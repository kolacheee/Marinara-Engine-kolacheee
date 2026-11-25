#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def check():
 r=json.loads((ROOT/'ramps.json').read_text());seen={}
 for region,colors in (r['source']|r['fixed']).items():
  for c in colors:
   assert c not in seen,f'{c}: {region} duplicates {seen.get(c)}'
   seen[c]=region
 for region,targets in r['targets'].items():
  for name,colors in targets.items():assert len(colors)==len(r['source'][region]),(region,name)
 for c in r['targets']['hair']['black']:
  red,green,blue=bytes.fromhex(c[1:]);assert blue<=red+2
 print(f'Palette: {len(seen)} unique source/fixed colours; target lengths and warm black verified.')
if __name__=='__main__':check()
