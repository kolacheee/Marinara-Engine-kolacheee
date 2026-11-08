#!/usr/bin/env python3
"""
Bakes the Earth seed's news: the names of the real events of each year, by day, for the Game Master to look
up when a character follows the news (the world_news tool). Only the names: Game Mode runs on models that
know the events themselves (owner 2026-11-08). Run offline; the output is committed, the source is not.

    python3 -I scripts/earth/bake-earth-news.py SLASHYEAR_DATA OUT_DIR

SLASHYEAR_DATA is the `data` folder of the slashyear snapshot v1.1.0 (github.com/ctrl-maud/slashyear, release
asset slashyear-data-snapshot.tar.gz, sha256 baaa67da...4e): the dated entries of English Wikipedia's year
articles ("2001"), each quoted from a numbered revision (CC BY-SA 4.0), with notability.json (the byte length
of each linked article).

OUT_DIR gets earth-news.json.br (brotli, made with node, which this calls): {year: [[month, day, name], ...]},
each year by date, month and day 0 when the article gives none. A name is the event's own article title when
the entry leads with one ("September 11 attacks: ..."), else the entry's first clause, cut short; a death is
"Death of" the person. Kept: the year articles' events (not the year-in-country articles'), and their 5 most
notable deaths a year (by the length of the person's article).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

DEATHS_PER_YEAR = 5
NAME_MAX = 90
DATE = re.compile(
    r"^((January|February|March|April|May|June|July|August|September|October|November|December)( \d{1,2})?"
    r"|\d+( BC)?|\d+s( BC)?|unknown date|date unknown)$",
    re.I,
)
YEAR = re.compile(r"\b(1\d{3}|20\d{2})\b")
notability = json.load(open(SRC / "notability.json"))


def links(claim):
    return [link for link in claim["links"] if not DATE.match(link)]


# An article title that names an event, for an entry that does not lead with one ("... are killed in the
# September 11 attacks").
EVENT = re.compile(
    r"\b(war|battle|siege|attacks?|bombings?|massacre|earthquake|tsunami|hurricane|typhoon|cyclone|floods?|"
    r"famine|great fire|eruption|pandemic|epidemic|plague|outbreak|election|referendum|treaty|accords?|"
    r"revolution|uprising|rebellion|revolt|coup|crisis|riots?|disaster|crash|sinking|landing|invasion|"
    r"olympics|world cup|assassination|death of|genocide|shooting|hijacking|explosion|collapse|"
    r"declaration of independence|summit)\b",
    re.I,
)


def clause(text):
    text = re.sub(r"^\([^)]*\)\s*[–:-]?\s*", "", text.strip())
    text = re.split(r"(?<![A-Z][a-z])(?<!\bInc)(?<!\bLtd)(?<!\bCorp)(?<!\bCo)(?<!\bJr)(?<!\bSr)(?<!\bSt)(?<!\bMt)(?<!\bvs)(?<=[a-z0-9\)])\.\s|;\s| – ", text.strip())[0].strip().rstrip(".")
    if len(text) > NAME_MAX:
        text = text[:NAME_MAX].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return text


def name_of(claim, year):
    body = re.sub(r"\s+", " ", claim["body"]).strip()
    lead = re.match(r"^([^:–]{3,100}):\s+(.*)$", body)
    if lead:
        title, rest = lead.group(1).strip(), lead.group(2)
        if DATE.match(title) or title.startswith("(") or not rest:
            name = clause(rest or body)
        elif title in links(claim) or len(title) <= 70:
            name = title
        else:
            name = clause(body)
    else:
        named = next((link for link in links(claim) if EVENT.search(link) and link.lower() in body.lower()), None)
        name = named or clause(body)
    # An entry that names another year's event ("the 2008 Summer Olympics are awarded") is that year's news
    # under its own words, not that event.
    years = [int(value) for value in YEAR.findall(name)]
    if year >= 1000 and any(abs(value - year) > 2 for value in years) and not re.search(r"\d{4}[–-]\d{2,4}", name):
        name = clause(body)
    return name if len(name) >= 3 and not DATE.match(name) else None


years = {}
for path in sorted((SRC / "claims").glob("*.json")):
    if not re.fullmatch(r"-?\d+", path.stem):
        continue
    data = json.load(open(path))
    year = int(data["year"])
    rows = {}
    deaths = []
    for claim in data["claims"]:
        if claim.get("from_place") or claim.get("from_deaths_list") or claim["kind"] == "birth":
            continue
        when = (claim.get("month") or 0, claim.get("day") or 0)
        if claim["kind"] == "death":
            person = next(iter(links(claim)), None)
            if person:
                deaths.append((notability.get(person, 0), when, f"Death of {person}"))
            continue
        name = name_of(claim, year)
        if name:
            rows.setdefault((name.lower(), when), [*when, name])
    deaths.sort(key=lambda death: -death[0])
    for _, when, name in deaths[:DEATHS_PER_YEAR]:
        rows.setdefault((name.lower(), when), [*when, name])
    if rows:
        years[str(year)] = sorted(rows.values(), key=lambda row: (row[0], row[1]))

raw = json.dumps(years, ensure_ascii=False, separators=(",", ":")).encode("utf8")
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
print(f"{len(years)} years, {total} names, {len(raw)} bytes, {target.stat().st_size} as brotli")
