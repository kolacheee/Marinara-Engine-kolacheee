#!/usr/bin/env python3
"""
Bakes the Earth grid an Earth world is compiled from (worldgen, the Earth seed). Run offline; the output is
committed, the sources are not.

    python3 -I scripts/earth/bake-earth.py SOURCE_DIR OUT_DIR

SOURCE_DIR holds, unchanged from their publishers:
  - Natural Earth 1:10m (public domain), from github.com/nvkelso/natural-earth-vector/geojson:
    ne_10m_land, ne_10m_lakes, ne_10m_glaciated_areas, ne_10m_rivers_lake_centerlines,
    ne_10m_populated_places_simple, ne_10m_geography_regions_polys (.geojson)
  - z4/t_X_Y.png: the Terrarium elevation tiles at zoom 4 (s3.amazonaws.com/elevation-tiles-prod/terrarium),
    made from SRTM, GMTED2010, ETOPO1 and others (see their attribution in packages/server/src/assets/earth/SOURCES.md).

OUT_DIR gets:
  - earth-coast.bin: the coast and lakes at 0.02 degrees, 18000 x 9000 cells, row 0 at 90N: two bit planes
    (numpy packbits, most significant bit first), land, then lake.
  - earth-grid.bin: a 0.1 degree grid, 3600 x 1800 cells, row 0 at 90N, column 0 at 180W, three byte planes:
    surface (0 sea, 1 lake, 2 land, 3 ice), height (land only: metres / 32, 0 to 255), and dryness (land
    only: 0 wet to 255 dry, from the climate belts, distance from the sea and the real deserts).
  - earth-features.json.gz: rivers (name, rank, lon/lat polylines simplified to the grid), cities (name, country, state,
    lon, lat, population, rank, capital), and named regions (ranges, deserts, plains: name, kind, bbox).
"""
import gzip
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
W, H = 3600, 1800
SS = 2  # rasterise at twice the grid, then take the majority


def load(name):
    return json.loads((SRC / f"{name}.geojson").read_text())["features"]


def rings(geometry):
    if geometry["type"] == "Polygon":
        yield geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        yield from geometry["coordinates"]


def raster(features):
    image = Image.new("L", (W * SS, H * SS), 0)
    draw = ImageDraw.Draw(image)
    for feature in features:
        for polygon in rings(feature["geometry"]):
            for index, ring in enumerate(polygon):
                points = [((lon + 180) / 360 * W * SS, (90 - lat) / 180 * H * SS) for lon, lat, *_ in ring]
                if len(points) >= 3:
                    draw.polygon(points, fill=0 if index else 255)
    big = np.asarray(image, dtype=np.uint16).reshape(H, SS, W, SS).sum(axis=(1, 3))
    return big >= 255 * SS * SS / 2


land = raster(load("ne_10m_land"))
lakes = raster(load("ne_10m_lakes"))
ice = raster(load("ne_10m_glaciated_areas"))
surface = np.zeros((H, W), dtype=np.uint8)
surface[land] = 2
surface[land & lakes] = 1
surface[land & ice & ~lakes] = 3
# Antarctica's sea ice shelf and the far south are ice where the land says land.
surface[(surface == 2) & (np.arange(H)[:, None] > H * (150 / 180))] = 3

# Elevation: the web-mercator tiles read back at each cell's centre.
tiles = {}
for x in range(16):
    for y in range(16):
        rgb = np.asarray(Image.open(SRC / "z4" / f"t_{x}_{y}.png").convert("RGB"), dtype=np.float64)
        tiles[(x, y)] = rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768
mosaic = np.zeros((16 * 256, 16 * 256))
for (x, y), tile in tiles.items():
    mosaic[y * 256 : (y + 1) * 256, x * 256 : (x + 1) * 256] = tile
lons = (np.arange(W) + 0.5) / W * 360 - 180
lats = 90 - (np.arange(H) + 0.5) / H * 180
px = np.clip(((lons + 180) / 360 * 4096).astype(int), 0, 4095)
clamped = np.clip(lats, -85.05, 85.05)
py = np.clip(
    ((1 - np.log(np.tan(np.radians(clamped)) + 1 / np.cos(np.radians(clamped))) / math.pi) / 2 * 4096).astype(int),
    0,
    4095,
)
metres = mosaic[py[:, None], px[None, :]]
height = np.where(surface >= 2, np.clip(metres / 32, 0, 255), 0).astype(np.uint8)

# Dryness (0 wet to 255 dry): the climate belts by latitude (the wet tropics, the dry horse latitudes, the
# wet westerlies, the cold dry north), drier with distance from the sea, and the real deserts dry outright.
deserts = raster([f for f in load("ne_10m_geography_regions_polys") if f["properties"]["FEATURECLA"] == "Desert"])
coarse = surface.reshape(H // 5, 5, W // 5, 5).max(axis=(1, 3)) == 0  # sea at 0.5 degrees
reach = np.full(coarse.shape, 60, dtype=np.float64)
front = coarse.copy()
reach[front] = 0
for step in range(1, 60):
    grown = front.copy()
    grown[1:] |= front[:-1]
    grown[:-1] |= front[1:]
    grown |= np.roll(front, 1, axis=1) | np.roll(front, -1, axis=1)
    reach[grown & ~front] = step
    front = grown
inland = np.repeat(np.repeat(reach, 5, axis=0), 5, axis=1)  # in half degrees from the sea
latitude = np.abs(lats)[:, None] * np.ones((1, W))
belt = np.interp(latitude, [0, 8, 15, 22, 30, 38, 45, 60, 70, 90], [0.1, 0.15, 0.5, 0.8, 0.75, 0.45, 0.3, 0.3, 0.45, 0.6])
# The trade winds and monsoons bring rain to the east coasts of the subtropics (China, Florida, Natal,
# Queensland), the westerlies to the west coasts further out (Ireland, Oregon, Chile, Norway), and the
# rainforests stay wet deep inland: those lose much of the dryness the belt and distance give them.
coarse_sea = coarse
east = np.zeros(coarse.shape, dtype=bool)
for shift in range(1, 31):  # sea within 15 degrees to the east
    east |= np.roll(coarse_sea, -shift, axis=1)
east_wet = np.repeat(np.repeat(east, 5, axis=0), 5, axis=1) & ~np.repeat(np.repeat(coarse_sea, 5, axis=0), 5, axis=1)
west = np.zeros(coarse.shape, dtype=bool)
for shift in range(1, 13):  # the westerlies: sea within 6 degrees to the west, from 38 to 62 degrees
    west |= np.roll(coarse_sea, shift, axis=1)
west_wet = np.repeat(np.repeat(west, 5, axis=0), 5, axis=1)
westerly = np.interp(latitude, [34, 42, 58, 66], [0, 0.25, 0.25, 0])
monsoon = np.interp(latitude, [0, 12, 18, 30, 40, 48], [0, 0, 0.3, 0.35, 0.15, 0])
tropic = np.interp(latitude, [0, 10, 18], [0.35, 0.5, 1])
dry = np.clip(belt - np.where(east_wet, monsoon, 0) - np.where(west_wet, westerly, 0) + np.minimum(inland, 40) / 40 * 0.3 * tropic, 0, 1)
dry = np.where(deserts, np.maximum(dry, 0.92), dry)
dryness = np.where(surface >= 2, dry * 255, 0).astype(np.uint8)

# The coast and the lakes five times finer (0.02 degrees, 18000 x 9000 cells, one bit each: land, then
# lake), for a town or a region map, whose cells are finer than the grid's.
FW, FH = 18000, 9000


def fine_raster(features):
    image = Image.new("1", (FW, FH), 0)
    draw = ImageDraw.Draw(image)
    for feature in features:
        for polygon in rings(feature["geometry"]):
            for index, ring in enumerate(polygon):
                points = [((lon + 180) / 360 * FW, (90 - lat) / 180 * FH) for lon, lat, *_ in ring]
                if len(points) >= 3:
                    draw.polygon(points, fill=0 if index else 1)
    return np.asarray(image, dtype=bool)


fine_land = fine_raster(load("ne_10m_land"))
fine_lake = fine_raster(load("ne_10m_lakes")) & fine_land
(OUT / "earth-coast.bin").write_bytes(
    gzip.compress(np.packbits(fine_land.reshape(-1)).tobytes() + np.packbits(fine_lake.reshape(-1)).tobytes(), 9)
)
del fine_land, fine_lake

(OUT / "earth-grid.bin").write_bytes(gzip.compress(surface.tobytes() + height.tobytes() + dryness.tobytes(), 9))


def simplify(line):
    out = []
    for lon, lat, *_ in line:
        cell = (round(lon, 2), round(lat, 2))
        if not out or abs(cell[0] - out[-1][0]) + abs(cell[1] - out[-1][1]) >= 0.08:
            out.append(cell)
    return out


rivers = []
for feature in load("ne_10m_rivers_lake_centerlines"):
    props, geometry = feature["properties"], feature["geometry"]
    if not geometry:
        continue
    lines = geometry["coordinates"] if geometry["type"] == "MultiLineString" else [geometry["coordinates"]]
    for line in lines:
        points = simplify(line)
        if len(points) >= 2:
            rivers.append({"name": props.get("name_en") or props.get("name") or "", "rank": props["scalerank"], "line": points})

cities = []
for feature in load("ne_10m_populated_places_simple"):
    props = feature["properties"]
    cities.append(
        {
            "name": props["nameascii"] or props["name"],
            "country": props["adm0name"],
            # Natural Earth's adm1 names lost some letters to "?" (Vietnam's provinces): left out, not shown so.
            **({"state": props["adm1name"]} if props.get("adm1name") and "?" not in props["adm1name"] else {}),
            "lon": round(props["longitude"], 3),
            "lat": round(props["latitude"], 3),
            "pop": int(props["pop_max"] or 0),
            "rank": props["scalerank"],
            **({"capital": True} if props["adm0cap"] else {}),
        }
    )

regions = []
for feature in load("ne_10m_geography_regions_polys"):
    props = feature["properties"]
    xs, ys = [], []
    for polygon in rings(feature["geometry"]):
        for lon, lat, *_ in polygon[0]:
            xs.append(lon)
            ys.append(lat)
    if xs:
        regions.append(
            {
                "name": props.get("NAME_EN") or props["NAME"],
                "kind": props["FEATURECLA"],
                "rank": props["SCALERANK"],
                "box": [round(min(xs), 2), round(min(ys), 2), round(max(xs), 2), round(max(ys), 2)],
            }
        )

features = {"rivers": rivers, "cities": cities, "regions": regions}
(OUT / "earth-features.json.gz").write_bytes(
    gzip.compress(json.dumps(features, separators=(",", ":"), ensure_ascii=False).encode(), 9)
)
print(
    f"grid {(OUT / 'earth-grid.bin').stat().st_size} bytes, features {(OUT / 'earth-features.json.gz').stat().st_size} bytes,"
    f" {len(rivers)} rivers, {len(cities)} cities, {len(regions)} regions"
)
