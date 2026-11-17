"""Replay the critic-r17A-1 source reductions and install only failed designs."""
from pathlib import Path
import argparse, hashlib, importlib.util, json
from PIL import Image, ImageDraw

REV=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('process',REV/'r17-A-process.py')
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
CHOICES={
 'ground-shop-w1':'r1a','corner-ground':'r1a',
 'ground-shop-v1-w1':'r1b','ground-shop-v2-w1':'r1b',
 'ground-work-w1':'r1b','ground-work-v1-w1':'r1b',
 'ground-work-v2-w1':'r1b','inn-front-w1':'r1b',
 'ground-arch-w3':'r1a','storey-timber-w2':'r1c',
}
REASONS={
 'ground-shop-w1':'A retains the full 20px opening and compact two-mass bread display; B narrows the entry with a thicker frame.',
 'corner-ground':'A has calmer oak and a clear return; register its painted doorway to 21px. B has busier panel highlights.',
 'ground-shop-v1-w1':'B gives the three bottles a compact bay and keeps a 22px open entrance; A spends too much width on display.',
 'ground-shop-v2-w1':'B lifts the canopy clear of the door and simplifies the cloth; register the opening from 18 to 20px.',
 'ground-work-w1':'B has the clearer anvil horn and calmer forge; register the opening from 19 to 20px.',
 'ground-work-v1-w1':'B has fewer door planks and two larger tools; register the painted door leaf to 20px.',
 'ground-work-v2-w1':'B has a single-handled jug and 22px entry with one shallow step; A narrows the entry.',
 'inn-front-w1':'B places its lintel high, opens the courtyard passage and gives the tankard a large readable handle; A has a lower arch.',
 'ground-arch-w3':'A has quiet paved slabs with a clear far exit; B has excessive mottled stone and unnecessary courtyard facade detail.',
 'storey-timber-w2':'C retains calm rectangular plaster and straight thin sill planes, while recessed four-pane glazing and clear shutter braces read closer to fantasy-house-2 than the empty A/B openings.',
}

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--install',action='store_true');args=ap.parse_args()
    rows=json.loads((REV/'r17-A-redraw-generation.json').read_text())
    for r in rows:r['selected']=r['id']==r['output']+'-'+CHOICES[r['output']]
    (REV/'r17-A-redraw-generation.json').write_text(json.dumps(rows,indent=2)+'\n')
    processing=[]
    for r in rows:
        _,report=p.reduce(r);processing.append(report)
    selected=[r for r in rows if r['selected']]
    house=Image.open(p.REF/'fantasy-house-2.png').convert('RGBA')
    for offset in range(0,len(selected),5):
        group=selected[offset:offset+5]
        canvas=Image.new('RGBA',(1504,230*len(group)),(64,70,64,255));d=ImageDraw.Draw(canvas)
        for i,r in enumerate(group):
            a=Image.open(REV/f"r17-A-clean-{r['id']}.png").convert('RGBA');y=i*230
            d.text((8,y+4),r['id']+' / selected 1x + 4x / matching-scale reference',fill='white')
            canvas.alpha_composite(a,(8,y+30));canvas.alpha_composite(house,(160,y+25))
            canvas.alpha_composite(a.resize((a.width*4,192),Image.Resampling.NEAREST),(325,y+28))
            # A cropped lower facade reference at literal 4x fits each row.
            lower=house.crop((0,96,144,144));canvas.alpha_composite(lower.resize((576,192),Image.Resampling.NEAREST),(920,y+28))
        canvas.save(REV/f'r17-A-redraw-selected-{offset//5+1}.png')
    (REV/'r17-A-redraw-selection.json').write_text(json.dumps({n:dict(selected=n+'-'+CHOICES[n],reason=REASONS[n]) for n in CHOICES},indent=2)+'\n')
    if not args.install:
        print(f'{len(rows)} source reductions and selected previews saved; outputs unchanged.');return
    critic=json.loads((REV/'critic-r17A-1.json').read_text())
    permitted=set(critic['failed'])
    assert {n+s for n in CHOICES for s in ('','-c0','-c1','-c2')}==permitted
    manifest=json.loads((REV/'r17-A-generation.json').read_text())
    ids={r['id'] for r in rows};manifest=[r for r in manifest if r['id'] not in ids]
    for r in manifest:
        if r['output'] in CHOICES:r['selected']=False
    manifest.extend(rows)
    assert sum(r['selected'] for r in manifest)==66
    (REV/'r17-A-generation.json').write_text(json.dumps(manifest,indent=2)+'\n')
    reports=json.loads((REV/'r17-A-processing.json').read_text())
    reports=[r for r in reports if r['id'] not in ids]+processing
    (REV/'r17-A-processing.json').write_text(json.dumps(reports,indent=2)+'\n')
    hashes=json.loads((REV/'r17-A-source-hashes.json').read_text());hashes=[r for r in hashes if r['id'] not in ids]
    for r in rows:
        source=REV/r['source'];original=Path(r['original_path'])
        hashes.append(dict(id=r['id'],source=r['source'],sha256=hashlib.sha256(source.read_bytes()).hexdigest(),original=str(original),original_matches=source.read_bytes()==original.read_bytes()))
        if not r['selected']:continue
        a=Image.open(REV/f"r17-A-clean-{r['id']}.png").convert('RGBA')
        for c in range(3):p.save(p.colour(a,c),p.OUT/(r['output']+f'-c{c}.png'))
        p.save(a,p.OUT/(r['output']+'.png'))
    (REV/'r17-A-source-hashes.json').write_text(json.dumps(hashes,indent=2)+'\n')
    print('Installed exactly 10 designs / 40 failed exports; retained all other native art.')

if __name__=='__main__':main()
