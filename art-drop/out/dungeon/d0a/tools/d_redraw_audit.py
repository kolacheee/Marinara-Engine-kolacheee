"""Critic-redraw evidence. All reports, composite views and bulk renders stay in review/."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW
from d_layouts import MAPS
from d_review import metric
from review_c9 import lone_pixels
from check_proofs import light

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def panel(p,name):
    im=Image.open(p).convert('RGBA');w,h=im.size
    out=Image.new('RGB',(max(6*w+70,640),max(3*h+170,400)),'#62656a');d=ImageDraw.Draw(out);d.text((8,8),name+' | 1x / 2x / 3x / grey / quarter-grey',fill='white');x=8
    for z in (1,2,3):
        pic=im.resize((w*z,h*z),Image.Resampling.NEAREST);out.paste(pic,(x,32),pic);x+=w*z+12
    g=im.convert('L').convert('RGBA');g.putalpha(im.getchannel('A'));out.paste(g,(8,3*h+55),g)
    sq=g.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST);out.paste(sq,(w+28,3*h+55),sq);out.save(REVIEW/f'D-redraw-{name}.png')

def run():
    before=json.loads((REVIEW/'D-redraw-start-hashes.json').read_text());critic=json.loads((REVIEW/'critic-D-1.json').read_text())
    report={'passed_files_unchanged':{},'failed_files_changed':{},'surface_wrap':{},'surface_tiles':{},'changed_art':{},'failures':[]}
    for path,v in critic['files'].items():
        same=sha(BASE/path)==before[path]
        report['passed_files_unchanged' if v['status']=='pass' else 'failed_files_changed'][path]=same if v['status']=='pass' else not same
        if same!=(v['status']=='pass'):report['failures'].append('critic file protection '+path)
    # Every native 48 px surface tile is reported, including wall canvases.
    for p in sorted((BASE/'canon/surfaces').glob('*.png')):
        im=Image.open(p).convert('RGBA');tiles=[]
        for y in range(0,im.height,48):
            for x in range(0,im.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))))
        report['surface_tiles'][p.name]=tiles
        if max(t['percent'] for t in tiles)>3:report['failures'].append('lone pixel limit '+p.name)
    for n in ['cave_rock','cave_ice','cave_crystal','cave_lava']:
        p=BASE/f'canon/surfaces/{n}-floor.png';im=Image.open(p);w,h=im.size
        q={'left_right_equal':all(im.getpixel((0,y))==im.getpixel((w-1,y)) for y in range(h)), 'top_bottom_equal':all(im.getpixel((x,0))==im.getpixel((x,h-1)) for x in range(w))}
        report['surface_wrap'][n]=q
        if not all(q.values()):report['failures'].append('wrap '+n)
        repeat=Image.new('RGBA',(w*3,h*3))
        for y in range(3):
            for x in range(3):repeat.paste(im,(x*w,y*h))
        repeat.save(REVIEW/f'D-redraw-repeat-{n}.png')
    for p in sorted(BASE.rglob('*.png')):
        relative=str(p.relative_to(BASE))
        if relative in before and sha(p)==before[relative]:continue
        if '/frames/' in str(p) or p.name=='d0a-review.png':continue
        if p.name.endswith('-grey.png'):continue
        m=metric(Image.open(p));report['changed_art'][relative]=m
        if relative!='canon/style-guide.png' and any(m[k] for k in ('soft_alpha','dirty_transparent','off_palette','black')):report['failures'].append('pixel '+relative)
        if relative.startswith('canon/props/'):
            m['lone']=lone_pixels(Image.open(p));panel(p,'prop-'+p.stem.removeprefix('d-'))
        elif relative.startswith('canon/swatches/'):panel(p,'swatch-'+p.stem)
        elif relative.startswith('proof/'):panel(p,'proof-'+p.stem)
    # Keep the native inspection boards current with the actual saved deliveries.
    regions=[('hoard-keep',(90,750,426,1050)),('breach-temple',(390,590,726,890)),('sanctum-crypt',(190,380,526,680)),('cave_rock-plain-21',(1320,490,1656,790)),('manor-ground',(780,100,1116,400)),('station_lab',(110,170,446,470))]
    s=Image.new('RGB',(1152,1272),'#222630');d=ImageDraw.Draw(s)
    for i,(n,bounds) in enumerate(regions):
        x=i%3*384;y=i//3*636;p=Image.open(BASE/f'frames/{n}.png').crop(bounds);d.text((x+4,y+4),n,fill='white');s.paste(p,(x+4,y+24));s.paste(p.convert('L'),(x+4,y+330))
        p.save(REVIEW/f'D-redraw-detail-{n}.png');panel(REVIEW/f'D-redraw-detail-{n}.png','detail-scales-'+n)
    s.save(REVIEW/'D-redraw-native-grey.png');s.save(REVIEW/'D-redraw-overview-crops.png')
    # Direct cell identities are preserved; the replacement sprite name is recorded separately.
    report['validation']=json.loads((REVIEW/'D-validation.json').read_text())['pass']
    report['pass']=not report['failures'] and report['validation']
    (REVIEW/'D-redraw-audit.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'pass':report['pass'],'failures':report['failures'],'passed_unchanged':len(report['passed_files_unchanged']),'failed_changed':len(report['failed_files_changed']),'wrap':report['surface_wrap'],'surface_max_percent':max(t['percent'] for tiles in report['surface_tiles'].values() for t in tiles)},indent=2))
if __name__=='__main__':run()
