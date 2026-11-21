"""Final D saved-file audit, including actual curved map surfaces."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,P,S
from d_surfaces import FIXED
from draw_style_samples import SWATCHES
from d_layouts import MAPS
from d_review import metric,sheet
from review_c9 import lone_pixels
from check_proofs import light

def run():
    report=json.loads((REVIEW/'D-validation.json').read_text())
    report['failures']=[f for f in report['failures'] if not f.startswith('map surface ')]
    guide=Image.open(BASE/'canon/style-guide.png').convert('RGB');old=Image.open(REVIEW/'D-start/style-guide.png').convert('RGB');diff=ImageChops.difference(guide,old)
    matches={}
    for n in FIXED:
        i=list(SWATCHES).index(n);x,y=48+i%7*240,800+i//7*94
        matches[n]=guide.crop((x,y,x+48,y+48)).tobytes()==Image.open(BASE/f'canon/swatches/{n}.png').convert('RGB').tobytes()
        ImageDraw.Draw(diff).rectangle((x,y,x+47,y+47),fill=0)
    report['guide']={'matching_inserts':matches,'unchanged_outside_inserts':diff.getbbox() is None}
    sheet(guide,'style-guide')
    # The delivered contact sheet has hard bitmap text and palette-only scene pixels.
    report['contact']=metric(Image.open(BASE/'d0a-review.png'))
    report['map_surface_tiles']={}
    for n in MAPS:
        im=Image.open(REVIEW/f'D-{n}-surface.png').convert('RGBA');tiles=[]
        for y in range(0,im.height,48):
            for x in range(0,im.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))))
        maximum=max(t['percent'] for t in tiles);report['map_surface_tiles'][n]={'maximum_percent':maximum,'tiles':tiles,'pass':maximum<=3}
    allowed={str(BASE/f'proof/{n}{s}.png') for n in FIXED for s in ['', '-grey']}|{str(BASE/f'canon/swatches/{n}.png') for n in FIXED}|{str(BASE/'canon/style-guide.png'),str(BASE/'NOTES.md')}
    # Original snapshot paths were relative to the repository root.
    before=json.loads((REVIEW/'D-start/hashes.json').read_text());changed=[];unexpected=[]
    for p,h in before.items():
        if hashlib.sha256(Path(p).read_bytes()).hexdigest()!=h:
            changed.append(p)
            if str(Path(p).resolve()) not in allowed:unexpected.append(p)
    report['changed_earlier_files']=changed;report['unexpected_earlier_changes']=unexpected
    report['final_hashes']={str(p.relative_to(BASE)):hashlib.sha256(p.read_bytes()).hexdigest() for p in BASE.rglob('*') if p.is_file() and '__pycache__' not in str(p) and (str(p) in allowed or p not in [Path(x).resolve() for x in before])}
    for n,r in report['map_surface_tiles'].items():
        if not r['pass']:report['failures'].append('map surface '+n)
    if unexpected:report['failures'].append('protected earlier files')
    if diff.getbbox() is not None or not all(matches.values()):report['failures'].append('style-guide inserts')
    if any(report['contact'][k] for k in ['soft_alpha','dirty_transparent','off_palette','black']):report['failures'].append('contact pixels')
    report['pass']=not report['failures'];(REVIEW/'D-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'pass':report['pass'],'failures':report['failures'],'guide':report['guide'],'unexpected_earlier_changes':unexpected,'map_surface_maxima':{n:r['maximum_percent'] for n,r in report['map_surface_tiles'].items()}},indent=2))
if __name__=='__main__':run()
