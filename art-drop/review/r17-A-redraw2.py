"""Replay the local image-tool lantern edit; install only critic-r17A-2 failures."""
from pathlib import Path
import argparse, hashlib, importlib.util, json
from PIL import Image, ImageDraw

REV=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('process',REV/'r17-A-process.py')
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--install',action='store_true');args=ap.parse_args()
    rows=json.loads((REV/'r17-A-redraw2-generation.json').read_text())
    reports=[]
    for r in rows:
        r['selected']=r['id']=='ground-shop-v1-w1-r2a'
        _,report=p.reduce(r);reports.append(report)
    (REV/'r17-A-redraw2-generation.json').write_text(json.dumps(rows,indent=2)+'\n')
    selection={
        'selected':'ground-shop-v1-w1-r2a',
        'reason':'A retains a distinct top-lit projecting bracket and a broader 3x3 amber/cream light after exact native mode reduction. B has a narrower 2x3 lit body and its dark support merges into the display recess.',
        'patch':[10,16,19,26],
        'preserved':'Every pixel outside this registered drawing patch is unchanged, including clear entrance [20,9,42,42], lit threshold, bottles, canopy and course rows. No manually painted native pixels.',
    }
    (REV/'r17-A-redraw2-selection.json').write_text(json.dumps(selection,indent=2)+'\n')
    # Literal native, 4x and 12x crops; labels are the only drawing operation.
    images=[Image.open(REV/'r17-A-redraw2-before.png').convert('RGBA')]
    images.extend(Image.open(REV/f'r17-A-clean-{r["id"]}.png').convert('RGBA') for r in rows)
    sheet=Image.new('RGBA',(780,500),(64,70,64,255));d=ImageDraw.Draw(sheet)
    for i,a in enumerate(images):
        x=10+i*260;d.text((x,5),['before','A / selected','B / alternative'][i],fill='white')
        sheet.alpha_composite(a,(x,25))
        sheet.alpha_composite(a.resize((192,192),Image.Resampling.NEAREST),(x,90))
        sheet.alpha_composite(a.crop((8,14,20,28)).resize((144,168),Image.Resampling.NEAREST),(x,310))
    sheet.save(REV/'r17-A-redraw2-candidates.png')
    if not args.install:
        print('Two image-tool alternatives reduced; output art unchanged.');return
    critic=json.loads((REV/'critic-r17A-2.json').read_text())
    permitted=set(critic['failed']);base='ground-shop-v1-w1'
    assert permitted=={base+s for s in ('','-c0','-c1','-c2')}
    manifest=json.loads((REV/'r17-A-generation.json').read_text());ids={r['id'] for r in rows}
    manifest=[r for r in manifest if r['id'] not in ids]
    for r in manifest:
        if r['output']==base:r['selected']=False
    manifest.extend(rows);assert sum(r['selected'] for r in manifest)==66
    (REV/'r17-A-generation.json').write_text(json.dumps(manifest,indent=2)+'\n')
    processing=json.loads((REV/'r17-A-processing.json').read_text())
    processing=[r for r in processing if r['id'] not in ids]+reports
    (REV/'r17-A-processing.json').write_text(json.dumps(processing,indent=2)+'\n')
    hashes=json.loads((REV/'r17-A-source-hashes.json').read_text());hashes=[r for r in hashes if r['id'] not in ids]
    for r in rows:
        source=REV/r['source'];original=Path(r['original_path'])
        assert source.read_bytes()==original.read_bytes()
        hashes.append(dict(id=r['id'],source=r['source'],sha256=hashlib.sha256(source.read_bytes()).hexdigest(),original=str(original),original_matches=True))
        if r['selected']:
            a=Image.open(REV/f"r17-A-clean-{r['id']}.png").convert('RGBA')
            for c in range(3):p.save(p.colour(a,c),p.OUT/(base+f'-c{c}.png'))
            p.save(a,p.OUT/(base+'.png'))
    (REV/'r17-A-source-hashes.json').write_text(json.dumps(hashes,indent=2)+'\n')
    print('Installed the four failed apothecary exports only.')

if __name__=='__main__':main()
