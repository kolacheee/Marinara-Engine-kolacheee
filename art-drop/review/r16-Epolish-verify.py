"""Audit saved pixels, mode votes, cloud reuse, proofs and protected-file hashes."""
from pathlib import Path
from PIL import Image
from collections import Counter
import json, hashlib, importlib.util

REV=Path(__file__).resolve().parent;ROOT=REV.parent;P='r16-Epolish-'
spec=importlib.util.spec_from_file_location('epbuild',REV/(P+'build.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
checks=[]
def check(label,ok):
    checks.append({'check':label,'pass':bool(ok)})

def img(name):return Image.open(REV/(P+name+'.png')).convert('RGBA')
def eq(a,c):return a.size==c.size and a.tobytes()==c.tobytes()
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def proof(sheet,icon,xy,scale,label):
    im=icon.resize((24*scale,24*scale),Image.Resampling.NEAREST)
    crop=sheet.crop((xy[0],xy[1],xy[0]+im.width,xy[1]+im.height)).convert('RGB')
    check(label,all(not p[3] or p[:3]==q for p,q in zip(im.get_flattened_data(),crop.get_flattened_data())))

def main():
    meta=json.loads((REV/(P+'measurements.json')).read_text());names=b.NAMES
    stages=meta['stages'];check('Unique processing stage ids',len({s['id'] for s in stages})==len(stages))
    mode_blocks=0;cleanup_count=0;alpha_edits=0
    for s in stages:
        ident=s['id'];reg=img('registered-'+ident);mode=img('mode-'+ident);clean=img('clean-'+ident)
        rp=list(reg.get_flattened_data());mp=list(mode.get_flattened_data());replay=[]
        check(ident+' registered size',reg.size==(192,192))
        check(ident+' locked palette',all(p==(0,0,0,0) or p[3]==255 and list(p[:3]) in s['palette'] for p in rp))
        for y in range(24):
            for x in range(24):
                c=Counter(rp[(y*8+yy)*192+x*8+xx] for yy in range(8) for xx in range(8))
                replay.append(min(c,key=lambda p:(-c[p],p)))
        check(ident+' exact 64-sample modes',replay==mp);mode_blocks+=576
        for e in s['cleanup']:
            x,y=e['xy'];k=y*24+x
            check(ident+' edit '+str((x,y))+' prior',list(replay[k])==e['before'])
            alpha_edits+=e['before'][3]!=e['after'][3];replay[k]=tuple(e['after'])
        cleanup_count+=len(s['cleanup'])
        check(ident+' cleanup replay',replay==list(clean.get_flattened_data()))
    icons={n:Image.open(ROOT/('out/weather16/icon-'+n+'.png')).convert('RGBA') for n in names}
    for n,im in icons.items():
        p=list(im.get_flattened_data());box=im.getbbox();opaque=[v for v in p if v[3]]
        check(n+' size',im.size==(24,24));check(n+' hard alpha',all(v[3] in [0,255] for v in p))
        check(n+' zero hidden RGB',all(v[3] or v==(0,0,0,0) for v in p))
        check(n+' clear outer margin',box[0]>=1 and box[1]>=1 and box[2]<=23 and box[3]<=23)
        check(n+' balanced 20-22px width',20<=box[2]-box[0]<=22)
        check(n+' no isolated specks',all(len(c)>2 for c in b.components(im)))
        exposed=[]
        for y in range(24):
            for x in range(24):
                v=p[y*24+x]
                if not v[3]:continue
                near=[p[yy*24+xx] if 0<=xx<24 and 0<=yy<24 else (0,0,0,0) for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]]
                if any(not q[3] for q in near):exposed.append(v[:3]==b.EDGE)
        check(n+' continuous navy exposed contour',all(exposed))
        check(n+' matches reviewed candidate',eq(im,img('candidate-icon-'+n)))
        check(n+' redraw differs from start',not eq(im,img('before-icon-'+n)))
        file=meta['files']['icon-'+n+'.png']
        check(n+' measured pixels',len(opaque)==file['opaque_pixels'] and len(set(opaque))==file['colours'])
    check('14 unique outputs',len({im.tobytes() for im in icons.values()})==14)
    master=img('clean-cloud-c');slate=b.tint(master,meta['cloud']['slate']);dark=b.tint(master,meta['cloud']['dark'])
    recipes={
      'clear-day':b.over(*[img('clean-sun-a-'+s) for s in ['disc','n','ne','e','se','s','sw','w','nw']]),
      'clear-night':b.over(img('clean-night-a-moon'),img('clean-night-a-star')),
      'cloudy':b.over(img('clean-sun-a-cloudy-disc'),b.shift(master,0,8)),
      'overcast':b.over(b.shift(slate,-1,1),b.shift(slate,1,8)),
      'rain':b.over(master,img('clean-rain-a')),
      'heavy_rain':b.over(slate,img('clean-heavy-a')),
      'storm':b.over(dark,img('retained-bolt')),
      'snow':b.over(master,img('clean-snow-a-large')),
      'hail':b.over(slate,img('clean-hail-a-large')),
      'blizzard':img('clean-blizzard-b'),'wind':img('clean-wind-b-separated'),
      'fog':img('clean-fog-a'),'sandstorm':img('clean-sand-b')}
    halfsun=recipes['clear-day'].copy();halfsun.paste((0,0,0,0),(0,13,24,24))
    recipes['heat_wave']=b.over(halfsun,img('clean-heat-b-waves'))
    for n,expected in recipes.items():check(n+' exact assembly / shared cloud',eq(icons[n],expected))
    oldstorm=img('before-icon-storm');bolt=img('retained-bolt')
    check('Bolt uses only original opaque footprint',all(not q[3] or p[3] for p,q in zip(oldstorm.get_flattened_data(),bolt.get_flattened_data())))
    for rec in json.loads((REV/(P+'generation.json')).read_text()):
        check(rec['id']+' retained source and prompt',(REV/rec['source']).exists() and len(rec['prompt'])>100)
    # Literal proof scales and all icon placements.
    for kind in ['dark','light']:
        for prefix in ['row-','before-after-']:
            native=Image.open(REV/(P+prefix+kind+'-1x.png')).convert('RGB')
            for scale in [2,4]:
                scaled=Image.open(REV/(P+prefix+kind+'-'+str(scale)+'x.png')).convert('RGB')
                check(prefix+kind+' literal '+str(scale)+'x',eq(native.resize((native.width*scale,native.height*scale),Image.Resampling.NEAREST),scaled))
        row=img('row-'+kind+'-1x');compare=img('before-after-'+kind+'-1x')
        for i,n in enumerate(names):
            proof(row,icons[n],(8+i*32,8),1,'row '+kind+' '+n)
            proof(compare,img('before-icon-'+n),(8+i*32,24),1,'before '+kind+' '+n)
            proof(compare,icons[n],(8+i*32,80),1,'after '+kind+' '+n)
    for rec in json.loads((REV/(P+'review-layout.json')).read_text()):proof(img(rec['sheet']),icons[rec['icon']],rec['xy'],rec['scale'],str(rec))
    for ref in sorted((ROOT/'reference/r16').glob('ref-*.png')):
        stem='context-'+ref.stem[4:];native=img(stem+'-1x')
        for scale in [2,4]:check(stem+' exact '+str(scale)+'x',eq(native.resize((native.width*scale,native.height*scale),Image.Resampling.NEAREST),img(stem+'-'+str(scale)+'x')))
    baseline=json.loads((REV/(P+'baseline.json')).read_text());allowed={'art-drop/NOTES.md'}|{'art-drop/out/weather16/icon-'+n+'.png' for n in names}
    protected=0
    for rel,h in baseline.items():
        if rel in allowed:continue
        path=ROOT.parent/rel;check('Protected '+rel,path.exists() and sha(path)==h);protected+=1
    notes=(ROOT/'NOTES.md').read_text();prior=(REV/(P+'notes-before.txt')).read_text()
    check('Earlier NOTES preserved verbatim',notes.endswith(prior))
    check('New notes section at top',notes.startswith('# Round 16 — Part Epolish\n'))
    result={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failed':[c['check'] for c in checks if not c['pass']],
            'source_drawings':meta['source_drawings'],'mode_blocks':mode_blocks,'mode_samples':mode_blocks*64,
            'cleanup_edits_all_stages':cleanup_count,'alpha_edits_all_stages':alpha_edits,'protected_files':protected,'checks':checks}
    (REV/(P+'validation.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
    if result['failed']:raise SystemExit(1)

if __name__=='__main__':
    latest=REV/(P+'critic1-verify.py')
    if latest.exists():
        import runpy
        runpy.run_path(str(latest),run_name='__main__')
    else:main()
