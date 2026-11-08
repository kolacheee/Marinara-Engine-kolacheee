#!/usr/bin/env python3
"""
Bakes the Earth seed's past: which cities stood in a year, how big they were and what they were called, and
which realms held the land. Run offline; the output is committed, the sources are not.

    python3 -I scripts/earth/bake-earth-history.py SOURCE_DIR OUT_DIR

SOURCE_DIR holds, unchanged from their publishers:
  - chandlerV2.csv, modelskiAncientV2.csv, modelskiModernV2.csv: Reba, Reitsma and Seto's digitised Chandler
    and Modelski city populations, 3700 BC to AD 2000 (CC BY 4.0, figshare 10.6084/m9.figshare.2059494,
    .2059497, .2059500).
  - cliopatria_polities_only_v021.geojson: Cliopatria 0.2.1, the Seshat world polities 3400 BC to AD 2024
    (CC BY 4.0, github.com/Seshat-Global-History-Databank/cliopatria).
  - ne_10m_populated_places_simple.geojson: the Natural Earth cities the grid bake reads, to join the past to.

OUT_DIR gets:
  - earth-history.json.gz: the dated cities (name, other names, lon, lat, [year, people] pairs, the index of
    the Natural Earth city it is today, if any) and the dated names of cities (Edo before 1868, Constantinople from 330
    to 1929...), keyed by today's name.
  - earth-polities.bin: a 4-byte length (little-endian), a gzipped JSON list of the polities (name, from, to, member of,
    area, the box of their mask on a 0.2 degree grid, its byte offset and size), and the masks, each its own
    zlib stream of numpy packbits row by row, so a reader inflates only the few a year and an area need.
"""
import csv
import gzip
import json
import math
import struct
import sys
import unicodedata
import zlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)


def fold(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return " ".join(text.replace("-", " ").replace(".", " ").replace("'", "").split())


def year_of(column):
    era, number = column.split("_")
    return -int(number) if era == "BC" else int(number)


# ── The dated cities ──
cities = {}
for name in ["chandlerV2.csv", "modelskiAncientV2.csv", "modelskiModernV2.csv"]:
    for row in csv.DictReader((SRC / name).open(encoding="latin-1")):
        try:
            lon, lat = float(row["Longitude"]), float(row["Latitude"])
        except ValueError:
            continue
        pops = []
        for column, value in row.items():
            if column[:3] in ("BC_", "AD_") and value and value.strip():
                try:
                    pops.append((year_of(column), int(float(value))))
                except ValueError:
                    pass
        if not pops:
            continue
        key = (fold(row["City"]), round(lon, 1), round(lat, 1))
        city = cities.setdefault(
            key,
            {
                "name": row["City"].strip(),
                "alt": [each.strip() for each in (row["OtherName"] or "").split(",") if each.strip()],
                "lon": round(lon, 3),
                "lat": round(lat, 3),
                "pops": {},
            },
        )
        for year, people in pops:
            if people > 0:
                city["pops"][year] = max(city["pops"].get(year, 0), people)

# Joined to today's Natural Earth city: the same name (or another name) within 40 km, else the nearest
# within 12 km.
places = [feature["properties"] for feature in json.loads((SRC / "ne_10m_populated_places_simple.geojson").read_text())["features"]]
by_name = {}
for index, place in enumerate(places):
    for name in {place["nameascii"], place["name"]}:
        if name:
            by_name.setdefault(fold(name), []).append(index)


def km(a_lon, a_lat, b_lon, b_lat):
    return math.hypot((a_lon - b_lon) * 111.32 * math.cos(math.radians((a_lat + b_lat) / 2)), (a_lat - b_lat) * 110.57)


out_cities = []
for city in cities.values():
    match = None
    named = False
    for name in [city["name"], *city["alt"]]:
        for index in by_name.get(fold(name), []):
            place = places[index]
            if km(city["lon"], city["lat"], place["longitude"], place["latitude"]) < 40:
                match = index
                named = True
                break
        if match is not None:
            break
    if match is None:
        near = min(
            range(len(places)),
            key=lambda index: km(city["lon"], city["lat"], places[index]["longitude"], places[index]["latitude"]),
        )
        if km(city["lon"], city["lat"], places[near]["longitude"], places[near]["latitude"]) < 12:
            match = near
    out_cities.append(
        {
            "name": city["name"],
            **({"alt": city["alt"][:4]} if city["alt"] else {}),
            "lon": city["lon"],
            "lat": city["lat"],
            "pops": sorted([year, people] for year, people in city["pops"].items()),
            # The index of today's city among Natural Earth's (the grid bake keeps them all, in order).
            **({"today": match} if match is not None else {}),
            # Joined by name (the same city under today's name), not only by being nearby (Carthage by Tunis).
            **({"named": True} if named else {}),
        }
    )

# Dated names: what a city was called when, by today's (Natural Earth) name. [from, to, name], years
# inclusive, negative BC; the name today's from the end of the last span.
RENAMES = {
    "Istanbul": [[-660, 329, "Byzantium"], [330, 1929, "Constantinople"]],
    "Izmir": [[-1000, 1929, "Smyrna"]],
    "Edirne": [[125, 1929, "Adrianople"]],
    "Ankara": [[-300, 1399, "Ancyra"], [1400, 1929, "Angora"]],
    "Thessaloniki": [[-315, 1429, "Thessalonica"], [1430, 1936, "Salonica"]],
    "Trabzon": [[-700, 1922, "Trebizond"]],
    "Antakya": [[-300, 1268, "Antioch"]],
    "Iznik": [[-300, 1331, "Nicaea"]],
    "Izmit": [[-264, 1337, "Nicomedia"]],
    "Bursa": [[-200, 1325, "Prusa"]],
    "Sanliurfa": [[-300, 1144, "Edessa"]],
    "Diyarbakir": [[-300, 638, "Amida"]],
    "Gaziantep": [[1000, 1920, "Aintab"]],
    "Tokyo": [[1457, 1867, "Edo"]],
    "Kyoto": [[794, 1099, "Heian-kyo"]],
    "Nara": [[710, 784, "Heijo-kyo"]],
    "Osaka": [[600, 1495, "Naniwa"]],
    "Beijing": [[938, 1152, "Yanjing"], [1153, 1214, "Zhongdu"], [1267, 1367, "Dadu"], [1368, 1402, "Beiping"], [1928, 1948, "Beiping"]],
    "Xian": [[-202, 1271, "Chang'an"], [1272, 1368, "Fengyuan"]],
    "Nanjing": [[317, 588, "Jiankang"]],
    "Kaifeng": [[960, 1127, "Bianjing"]],
    "Hangzhou": [[1129, 1276, "Lin'an"]],
    "Shenyang": [[1625, 1945, "Mukden"]],
    "Shenyeng": [[1625, 1945, "Mukden"]],
    "Changchun": [[1932, 1945, "Hsinking"]],
    "Dalian": [[1905, 1945, "Dairen"]],
    "Seoul": [[1394, 1909, "Hanseong"], [1910, 1945, "Keijo"]],
    "Taipei": [[1895, 1945, "Taihoku"]],
    "Ho Chi Minh City": [[1698, 1975, "Saigon"]],
    "Hanoi": [[1010, 1830, "Thang Long"]],
    "Rangoon": [[1755, 1988, "Rangoon"]],
    "Yangon": [[1755, 1988, "Rangoon"]],
    "Singapore": [[1299, 1398, "Temasek"]],
    "Jakarta": [[1000, 1526, "Sunda Kelapa"], [1527, 1618, "Jayakarta"], [1619, 1942, "Batavia"]],
    "Mumbai": [[1534, 1994, "Bombay"]],
    "Chennai": [[1639, 1995, "Madras"]],
    "Kolkata": [[1690, 2000, "Calcutta"]],
    "Patna": [[-490, 600, "Pataliputra"]],
    "Peshawar": [[100, 1000, "Purushapura"]],
    "Ulaanbaatar": [[1639, 1923, "Urga"]],
    "Almaty": [[1854, 1920, "Verny"], [1921, 1992, "Alma-Ata"]],
    "Bishkek": [[1825, 1925, "Pishpek"], [1926, 1990, "Frunze"]],
    "Dushanbe": [[1929, 1960, "Stalinabad"]],
    "Astana": [[1832, 1960, "Akmolinsk"], [1961, 1991, "Tselinograd"], [1992, 1997, "Akmola"]],
    "Tbilisi": [[500, 1935, "Tiflis"]],
    "Medina": [[-600, 621, "Yathrib"]],
    "Cairo": [[-3100, 640, "Memphis"], [641, 968, "Fustat"]],
    "Luxor": [[-2100, -27, "Thebes"]],
    "Naples": [[-470, 500, "Neapolis"]],
    "Taranto": [[-706, 500, "Tarentum"]],
    "Siracusa": [[-734, 877, "Syracuse"]],
    "Iraklio": [[1211, 1897, "Candia"]],
    "Kinshasa": [[1881, 1965, "Leopoldville"]],
    "Harare": [[1890, 1981, "Salisbury"]],
    "Maputo": [[1876, 1975, "Lourenco Marques"]],
    "Mexico City": [[1325, 1520, "Tenochtitlan"]],
    "New York": [[1625, 1663, "New Amsterdam"]],
    "Montreal": [[1642, 1705, "Ville-Marie"]],
    "Toronto": [[1793, 1833, "York"]],
    "Ottawa": [[1826, 1854, "Bytown"]],
    "San Francisco": [[1835, 1846, "Yerba Buena"]],
    "Ciudad Juarez": [[1659, 1887, "Paso del Norte"]],
    "Oslo": [[1624, 1924, "Christiania"]],
    "Helsinki": [[1550, 1917, "Helsingfors"]],
    "Tallinn": [[1219, 1917, "Reval"]],
    "Tartu": [[1224, 1917, "Dorpat"]],
    "Klaipeda": [[1252, 1923, "Memel"]],
    "St. Petersburg": [[1914, 1923, "Petrograd"], [1924, 1990, "Leningrad"]],
    "Volgograd": [[1589, 1924, "Tsaritsyn"], [1925, 1960, "Stalingrad"]],
    "Nizhny Novgorod": [[1932, 1990, "Gorky"]],
    "Yekaterinburg": [[1924, 1990, "Sverdlovsk"]],
    "Samara": [[1935, 1990, "Kuybyshev"]],
    "Tver": [[1931, 1990, "Kalinin"]],
    "Perm": [[1940, 1957, "Molotov"]],
    "Kirov": [[1374, 1933, "Vyatka"]],
    "Kaliningrad": [[1255, 1945, "Konigsberg"]],
    "Gdansk": [[1308, 1945, "Danzig"]],
    "Wroclaw": [[1335, 1945, "Breslau"]],
    "Szczecin": [[1200, 1945, "Stettin"]],
    "Poznan": [[1793, 1918, "Posen"]],
    "Bydgoszcz": [[1772, 1919, "Bromberg"]],
    "Lviv": [[1349, 1771, "Lwow"], [1772, 1918, "Lemberg"], [1919, 1944, "Lwow"]],
    "Lvov": [[1349, 1771, "Lwow"], [1772, 1918, "Lemberg"], [1919, 1944, "Lwow"]],
    "Chernivtsi": [[1775, 1918, "Czernowitz"]],
    "Donetsk": [[1869, 1923, "Yuzovka"], [1924, 1960, "Stalino"]],
    "Dnipro": [[1776, 1925, "Yekaterinoslav"], [1926, 2015, "Dnipropetrovsk"]],
    "Zaporizhzhya": [[1770, 1920, "Aleksandrovsk"]],
    "Chemnitz": [[1953, 1990, "Karl-Marx-Stadt"]],
    "Bratislava": [[1500, 1918, "Pressburg"]],
    "Ljubljana": [[1200, 1918, "Laibach"]],
    "Rijeka": [[1500, 1945, "Fiume"]],
    "Dubrovnik": [[800, 1918, "Ragusa"]],
    "Durres": [[-200, 1501, "Dyrrachium"]],
    "Plovdiv": [[-340, 1364, "Philippopolis"]],
    "Sofia": [[-29, 808, "Serdica"], [809, 1376, "Sredets"]],
    "Belgrade": [[-75, 630, "Singidunum"]],
    "Nis": [[-75, 600, "Naissus"]],
    "Budapest": [[1000, 1872, "Buda"]],
    "London": [[47, 409, "Londinium"]],
    "York": [[71, 409, "Eboracum"], [866, 1066, "Jorvik"]],
    "Colchester": [[43, 450, "Camulodunum"]],
    "Paris": [[-52, 359, "Lutetia"]],
    "Lyon": [[-43, 450, "Lugdunum"]],
    "Bordeaux": [[-56, 450, "Burdigala"]],
    "Marseille": [[-600, -50, "Massalia"], [-49, 500, "Massilia"]],
    "Strasbourg": [[12, 450, "Argentoratum"]],
    "Cologne": [[50, 450, "Colonia Agrippina"]],
    "Mainz": [[-13, 450, "Mogontiacum"]],
    "Trier": [[-16, 450, "Augusta Treverorum"]],
    "Augsburg": [[-15, 450, "Augusta Vindelicorum"]],
    "Vienna": [[15, 450, "Vindobona"]],
    "Milan": [[-222, 450, "Mediolanum"]],
    "Brindisi": [[-244, 500, "Brundisium"]],
    "Palermo": [[-500, 830, "Panormus"], [831, 1072, "Balarm"]],
    "Barcelona": [[-15, 415, "Barcino"]],
    "Tarragona": [[-218, 713, "Tarraco"]],
    "Cartagena": [[-227, 450, "Carthago Nova"]],
    "Seville": [[-206, 711, "Hispalis"], [712, 1247, "Ishbiliya"]],
    "Cordoba": [[-169, 711, "Corduba"], [712, 1235, "Qurtuba"]],
    "Lisbon": [[-200, 711, "Olissipo"], [712, 1146, "al-Ushbuna"]],
    "Granada": [[1013, 1491, "Gharnata"]],
    "Valencia": [[714, 1237, "Balansiya"]],
    "Zaragoza": [[-14, 713, "Caesaraugusta"], [714, 1117, "Saraqusta"]],
    "Merida": [[-25, 712, "Emerita Augusta"]],
    "Shizuoka": [[1000, 1868, "Sunpu"]],
}

data = {"cities": out_cities, "renames": RENAMES}
(OUT / "earth-history.json.gz").write_bytes(
    gzip.compress(json.dumps(data, separators=(",", ":"), ensure_ascii=False).encode(), 9)
)
known = {place["nameascii"] for place in places}
missing = sorted(name for name in RENAMES if name not in known)
print(f"{len(out_cities)} dated cities, {sum(1 for c in out_cities if 'today' in c)} joined to today's;"
      f" renames not in Natural Earth: {missing}")

# ── The polities: each row's land as a mask on a 0.2 degree grid ──
STEP = 0.2
GW, GH = int(360 / STEP), int(180 / STEP)
rows = json.loads((SRC / "cliopatria_polities_only_v021.geojson").read_text())["features"]
# Rows the dataset carries past the realm's end: the Norse towns of Ireland passed to the English from 1171,
# yet the Viking settlements' row runs on to 1332 and would hold Dublin in 1300.
ENDED = {"Viking settlements": 1170}
meta = []
masks = bytearray()
for feature in rows:
    props, geometry = feature["properties"], feature["geometry"]
    if not geometry:
        continue
    end = ENDED.get(props["Name"])
    if end is not None:
        if props["FromYear"] > end:
            continue
        props["ToYear"] = min(props["ToYear"], end)
    polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    xs = [lon for polygon in polygons for lon, lat, *_ in polygon[0]]
    ys = [lat for polygon in polygons for lon, lat, *_ in polygon[0]]
    x0 = max(0, int(math.floor((min(xs) + 180) / STEP)))
    x1 = min(GW, int(math.ceil((max(xs) + 180) / STEP)) + 1)
    y0 = max(0, int(math.floor((90 - max(ys)) / STEP)))
    y1 = min(GH, int(math.ceil((90 - min(ys)) / STEP)) + 1)
    w, h = max(1, x1 - x0), max(1, y1 - y0)
    image = Image.new("1", (w, h), 0)
    draw = ImageDraw.Draw(image)
    for polygon in polygons:
        for index, ring in enumerate(polygon):
            points = [((lon + 180) / STEP - x0, (90 - lat) / STEP - y0) for lon, lat, *_ in ring]
            if len(points) >= 3:
                draw.polygon(points, fill=0 if index else 1)
    bits = zlib.compress(np.packbits(np.asarray(image, dtype=bool).reshape(-1)).tobytes(), 9)
    name = props["Name"]
    meta.append(
        {
            "name": name[1:-1] if name.startswith("(") and name.endswith(")") else name,
            **({"union": True} if name.startswith("(") else {}),
            "from": props["FromYear"],
            "to": props["ToYear"],
            **({"of": props["MemberOf"][1:-1] if props["MemberOf"].startswith("(") else props["MemberOf"]} if props["MemberOf"] else {}),
            "area": round(props["Area"] or 0),
            "box": [x0, y0, w, h],
            "at": len(masks),
            "size": len(bits),
        }
    )
    masks += bits
header = gzip.compress(
    json.dumps({"step": STEP, "width": GW, "height": GH, "polities": meta}, separators=(",", ":"), ensure_ascii=False).encode(),
    9,
)
(OUT / "earth-polities.bin").write_bytes(struct.pack("<I", len(header)) + header + bytes(masks))
print(f"{len(meta)} polity rows, masks {len(masks)} bytes, file {(OUT / 'earth-polities.bin').stat().st_size} bytes")
