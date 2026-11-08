#!/usr/bin/env python3
"""
Bakes the Earth seed's news: the real events of each year, by day, for the Game Master to look up when a
character follows the news (the world_news tool). Run offline; the output is committed, the source is not.

    python3 -I scripts/earth/bake-earth-news.py SLASHYEAR_DATA FEATURES OUT_DIR

SLASHYEAR_DATA is the `data` folder of the slashyear snapshot v1.1.0 (github.com/ctrl-maud/slashyear, release
asset slashyear-data-snapshot.tar.gz, sha256 baaa67da...4e): the dated entries of English Wikipedia's year
articles ("2001") and year-in-country articles ("2001 in Japan"), each quoted verbatim from a numbered
revision (CC BY-SA 4.0), with notability.json (byte length of each linked article).
FEATURES is earth-features.json.gz (the Natural Earth cities), to name countries as the Earth seed does.

OUT_DIR gets earth-news.json.br (brotli, made with node, which this calls; a third smaller than gzip): {"countries": [names], "years": {year: [[month, day, kind, country, place,
text], ...]}}, each year by date. kind is "e" an event or "d" a death; country is an index into countries, or
-1 for the world's news (the year article's own entries); place is where it happened when the entry names a
country or a big city, else "". Month and day are 0 when the article gives none.

What is kept: every event of the year articles; their 25 most notable deaths a year (by the length of the
article they link); and each country's 4 most notable events a year (not the births its article lists).
"""
import gzip
import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

SRC, FEATURES, OUT = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
OUT.mkdir(parents=True, exist_ok=True)

DEATHS_PER_YEAR = 25
COUNTRY_EVENTS_PER_YEAR = 4
MONTHS = set("January February March April May June July August September October November December".split())

# The year-in-country articles' names, as the Earth seed (Natural Earth) names the country.
COUNTRY_AS = {
    "England": "United Kingdom",
    "Scotland": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom",
    "United States": "United States of America",
    "Czech Republic": "Czechia",
    "Democratic Republic of the Congo": "Congo (Kinshasa)",
    "Republic of the Congo": "Congo (Brazzaville)",
    "Hong Kong": "Hong Kong S.A.R.",
    "Bahamas": "The Bahamas",
    "Gambia": "The Gambia",
}
# Other names an entry calls a country by.
COUNTRY_WORDS = {
    "United States of America": ["United States", "U.S.", "USA"],
    "United Kingdom": ["United Kingdom", "Britain", "England", "Scotland", "Wales", "Northern Ireland", "UK"],
    "Czechia": ["Czech Republic", "Czechia"],
    "Congo (Kinshasa)": ["Democratic Republic of the Congo", "Zaire"],
    "Congo (Brazzaville)": ["Republic of the Congo"],
    "Hong Kong S.A.R.": ["Hong Kong"],
    "The Bahamas": ["Bahamas"],
    "The Gambia": ["Gambia"],
    "Russia": ["Russia", "Soviet Union", "USSR"],
}

features = json.load(gzip.open(FEATURES))
countries = sorted({city["country"] for city in features["cities"]})
index = {name: i for i, name in enumerate(countries)}
by_word = {}
for name in countries:
    for word in COUNTRY_WORDS.get(name, [name]):
        by_word.setdefault(word, name)
country_pattern = re.compile(
    r"(?<![\w.])(" + "|".join(re.escape(word) for word in sorted(by_word, key=len, reverse=True)) + r")(?![\w])"
)
# Big cities, and the names entries give them ("New York City").
CITY_AS = {"New York City": "New York", "Washington, D.C.": "Washington, D.C."}
by_city = {}
for city in sorted(features["cities"], key=lambda city: -city["pop"]):
    if city["pop"] >= 500_000:
        by_city.setdefault(city["name"], city)
for alias, name in CITY_AS.items():
    if name in by_city:
        by_city.setdefault(alias, by_city[name])
city_pattern = re.compile(
    r"(?<![\w])(" + "|".join(re.escape(word) for word in sorted(by_city, key=len, reverse=True)) + r")(?![\w])"
)
BIRTH = re.compile(r"\((born|b\.) \d|^\S[^.]*\(\d{3,4}\s*[-–]\s*\)")

notability = json.load(open(SRC / "notability.json"))


def notable(claim):
    return max([notability.get(link, 0) for link in claim["links"] if link.split(" ")[0] not in MONTHS] or [0])


def place_of(claim):
    text = claim["body"] + " " + " ".join(claim["links"])
    found = city_pattern.search(text)
    if found:
        city = by_city[found.group(1)]
        return f"{city['name']}, {city['country']}"
    found = country_pattern.search(text)
    return by_word[found.group(1)] if found else ""


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


years = {}
for path in sorted((SRC / "claims").glob("*.json")):
    if not re.fullmatch(r"-?\d+", path.stem):
        continue
    data = json.load(open(path))
    year = int(data["year"])
    rows = []
    deaths = []
    by_country = defaultdict(list)
    for claim in data["claims"]:
        if claim["kind"] == "birth" or claim.get("from_deaths_list") or not claim["body"].strip():
            continue
        when = [claim.get("month") or 0, claim.get("day") or 0]
        if claim.get("from_place"):
            if claim["kind"] != "event":
                continue
            country = COUNTRY_AS.get(claim["country"], claim["country"])
            if country in index and not BIRTH.search(claim["body"]):
                by_country[country].append(claim)
            continue
        if claim["kind"] == "death":
            deaths.append(claim)
            continue
        rows.append([*when, "e", -1, place_of(claim), clean(claim["body"])])
    deaths.sort(key=lambda claim: -notable(claim))
    for claim in deaths[:DEATHS_PER_YEAR]:
        rows.append([claim.get("month") or 0, claim.get("day") or 0, "d", -1, "", clean(claim["body"])])
    for country, claims in by_country.items():
        claims.sort(key=lambda claim: -notable(claim))
        seen = set()
        for claim in claims:
            if len(seen) >= COUNTRY_EVENTS_PER_YEAR:
                break
            text = clean(claim["body"])
            if text in seen:
                continue
            seen.add(text)
            rows.append([claim.get("month") or 0, claim.get("day") or 0, "e", index[country], place_of(claim), text])
    # One of each: the same line from two articles is one entry.
    unique = {}
    for row in rows:
        unique.setdefault((row[0], row[1], row[5]), row)
    rows = sorted(unique.values(), key=lambda row: (row[0], row[1], row[3]))
    if rows:
        years[str(year)] = rows

out = {"countries": countries, "years": years}
raw = json.dumps(out, ensure_ascii=False, separators=(",", ":")).encode("utf8")
target = OUT / "earth-news.json.br"
subprocess.run(
    [
        "node",
        "-e",
        "const z=require('zlib');const c=z.constants;process.stdout.write(z.brotliCompressSync(require('fs')"
        ".readFileSync(0),{params:{[c.BROTLI_PARAM_QUALITY]:11,[c.BROTLI_PARAM_LGWIN]:24}}))",
    ],
    input=raw,
    stdout=open(target, "wb"),
    check=True,
)
total = sum(len(rows) for rows in years.values())
print(f"{len(years)} years, {total} entries, {len(raw)} bytes, {target.stat().st_size} as brotli")
