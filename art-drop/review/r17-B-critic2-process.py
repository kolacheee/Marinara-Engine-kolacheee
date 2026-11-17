"""Replay image-tool fill redraws; only four failed exports may be written."""
from pathlib import Path
import importlib.util,json
from PIL import Image

REV=Path(__file__).resolve().parent
OUT=REV.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',REV/'r17-B-process.py')
p=importlib.util.module_from_spec(s);s.loader.exec_module(p)

def run():
    records=json.loads((REV/'r17-B-critic2-generation.json').read_text())
    processing=[]
    for r in records:
        reg=dict(r)
        if r['id'] in ('critic2-fill-b','critic2-fill-c'):reg['size']=[32,48]
        a,rec=p.reduce(reg)
        native_width=a.width
        # Wrap the painted last course's overlap using its opposite-stagger
        # partner. This is a native paint transfer, with no new tile geometry.
        if r['id']=='critic2-fill-c':
            a.paste(a.crop((0,15,native_width,16)),(0,47))
            rec['wrap']={'donor':[0,15,native_width,16],'destination':[0,47]}
        mode=Image.open(REV/f"r17-B-mode-{r['id']}.png").convert('RGBA')
        rec['cleanup']=[[i%native_width,i//native_width,list(x),list(y)] for i,(x,y) in
            enumerate(zip(mode.get_flattened_data(),a.get_flattened_data())) if x!=y]
        if native_width==32:
            wrapped=Image.new('RGBA',(48,48))
            wrapped.paste(a,(0,0));wrapped.paste(a.crop((0,0,16,48)),(32,0))
            a=wrapped
            rec['assembly']={'native_size':[32,48],'wrap_to':[48,48],'repeat_strip':[0,0,16,48]}
        p.save(a,REV/f"r17-B-clean-{r['id']}.png",Cleanup=rec['cleanup'])
        processing.append(rec)
        if r.get('used_as_adapter'):
            for c in range(3):p.save(p.colour(a,c),REV/f'r17-B-critic2-north-fill-c{c}.png')
        if r['selected']:
            p.save(a,OUT/'roof-fill-w1.png')
            for c in range(3):p.save(p.colour(a,c),OUT/f'roof-fill-w1-c{c}.png')
    (REV/'r17-B-critic2-processing.json').write_text(json.dumps(processing,indent=2)+'\n')
    old=json.loads((REV/'r17-B-generation.json').read_text())
    old=[r for r in old if not r['id'].startswith('critic2-')]
    for r in old:
        if r['output']=='roof-fill-w1':r['selected']=False
    (REV/'r17-B-generation.json').write_text(json.dumps(old+records,indent=2)+'\n')
    print('Three variants reduced; C exported, B used as drawn shaded adapter.')

if __name__=='__main__':run()
