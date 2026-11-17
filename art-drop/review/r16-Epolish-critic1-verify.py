"""Audit critic-round repairs, all delivered icons and exact saved proof pixels."""
from pathlib import Path
from PIL import Image
from collections import Counter
import json, hashlib, importlib.util

REV=Path(__file__).resolve().parent;ROOT=REV.parent;P='r16-Epolish-';Q=P+'critic1-'
spec=importlib.util.spec_from_file_location('ep',REV/(P+'build.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
checks=[]
def check(label,ok):checks.append({'check':label,'pass':bool(ok)})
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def img(n):return Image.open(REV/(n+'.png')).convert('RGBA')
def eq(a,c):return a.size==c.size and a.tobytes()==c.tobytes()
def proof(sheet,icon,xy,scale,label):
    icon=icon.resize((24*scale,24*scale),b.NN)
    crop=sheet.crop((xy[0],xy[1],xy[0]+icon.width,xy[1]+icon.height))
    check(label,all(not p[3] or p[:3]==q[:3] for p,q in zip(icon.get_flattened_data(),crop.get_flattened_data())))

def main():
    meta=json.loads((REV/(Q+'measurements.json')).read_text());failed={'cloudy','blizzard','sandstorm'}
    mode_blocks=0;cleanup=0;alpha_edits=0
    for s in meta['stages']:
        ident=s['id'];reg=img(Q+'registered-'+ident);mode=img(Q+'mode-'+ident);clean=img(Q+'clean-'+ident)
        rp=list(reg.get_flattened_data());mp=list(mode.get_flattened_data());replay=[]
        check(ident+' 192x192 registration',reg.size==(192,192))
        check(ident+' palette lock',all(p==(0,0,0,0) or p[3]==255 and list(p[:3]) in s['palette'] for p in rp))
        for y in range(24):
            for x in range(24):
                c=Counter(rp[(y*8+yy)*192+x*8+xx] for yy in range(8) for xx in range(8))
                replay.append(min(c,key=lambda p:(-c[p],p)))
        check(ident+' exact mode of all 64 samples',replay==mp);mode_blocks+=576
        for e in s['cleanup']:
            x,y=e['xy'];k=y*24+x
            check(ident+' cleanup prior '+str((x,y)),list(replay[k])==e['before'])
            alpha_edits+=e['before'][3]!=e['after'][3];replay[k]=tuple(e['after'])
        cleanup+=len(s['cleanup']);check(ident+' exact cleanup replay',replay==list(clean.get_flattened_data()))
    icons={n:Image.open(b.OUT/('icon-'+n+'.png')).convert('RGBA') for n in b.NAMES}
    for n,im in icons.items():
        px=list(im.get_flattened_data());box=im.getbbox()
        check(n+' 24x24 RGBA',im.size==(24,24) and Image.open(b.OUT/('icon-'+n+'.png')).mode=='RGBA')
        check(n+' hard alpha and zero hidden RGB',all(p[3]==255 or p==(0,0,0,0) for p in px))
        check(n+' one clear outer pixel',box[0]>=1 and box[1]>=1 and box[2]<=23 and box[3]<=23)
        check(n+' 20-22 pixel width',20<=box[2]-box[0]<=22)
        check(n+' no one/two-pixel specks',all(len(c)>2 for c in b.components(im)))
        exposed=[]
        for y in range(24):
            for x in range(24):
                p=px[y*24+x]
                if p[3] and any(not px[yy*24+xx][3] for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]):exposed.append(p[:3]==b.EDGE)
        check(n+' complete navy exposed contour',all(exposed))
        check(n+' matches candidate',eq(im,img(P+'candidate-icon-'+n)))
        prior=REV/(Q+'before-icon-'+n+'.png')
        check(n+(' repaired' if n in failed else ' passing PNG byte-identical'),sha(b.OUT/('icon-'+n+'.png'))!=sha(prior) if n in failed else sha(b.OUT/('icon-'+n+'.png'))==sha(prior))
    cloud=img(P+'clean-cloud-c');sun=b.shift(img(P+'clean-sun-a-cloudy-disc'),0,3)
    check('Cloudy exact retained sun translation and shared cloud',eq(icons['cloudy'],b.over(sun,b.shift(cloud,0,8))))
    cloudpixels=list(b.shift(cloud,0,8).get_flattened_data())
    check('All shared cloudy cloud pixels preserved',all(not p[3] or p==q for p,q in zip(cloudpixels,icons['cloudy'].get_flattened_data())))
    for n in ['blizzard','sandstorm']:
        check(n+' exact selected drawing',eq(icons[n],img(Q+'clean-'+meta['selection'][n])))
        check(n+' three separated components',len(b.components(icons[n]))==3)
    check('Blizzard clear gap between gusts and flake',all(not icons['blizzard'].getpixel((9,y))[3] for y in range(24)))
    check('Sandstorm two-pixel open channels',all(not icons['sandstorm'].getpixel((x,y))[3] for x in range(24) for y in [7,8,15,16]))
    oldmeta=json.loads((REV/(P+'measurements.json')).read_text())
    slate=b.tint(cloud,oldmeta['cloud']['slate']);dark=b.tint(cloud,oldmeta['cloud']['dark'])
    recipes={'overcast':b.over(b.shift(slate,-1,1),b.shift(slate,1,8)),
      'rain':b.over(cloud,img(P+'clean-rain-a')),'heavy_rain':b.over(slate,img(P+'clean-heavy-a')),
      'snow':b.over(cloud,img(P+'clean-snow-a-large')),'hail':b.over(slate,img(P+'clean-hail-a-large')),
      'storm':b.over(dark,img(P+'retained-bolt'))}
    for n,im in recipes.items():check(n+' exact shared cloud assembly',eq(im,icons[n]))
    for rec in json.loads((REV/(Q+'generation.json')).read_text()):
        check(rec['id']+' retained source and prompt',(ROOT.parent/rec['saved_path']).exists() and len(rec['prompt'])>100)
    for kind in ['dark','light']:
        for prefix in ['row-','candidate-row-','before-after-']:
            native=img(P+prefix+kind+'-1x')
            for scale in [2,4]:check(prefix+kind+' exact '+str(scale)+'x',eq(native.resize((native.width*scale,native.height*scale),b.NN),img(P+prefix+kind+'-'+str(scale)+'x')))
        row=img(P+'row-'+kind+'-1x');compare=img(P+'before-after-'+kind+'-1x')
        for i,n in enumerate(b.NAMES):
            proof(row,icons[n],(8+i*32,8),1,'Row '+kind+' '+n)
            proof(compare,img(Q+'before-icon-'+n),(8+i*32,24),1,'Before '+kind+' '+n)
            proof(compare,icons[n],(8+i*32,80),1,'After '+kind+' '+n)
    for rec in json.loads((REV/(P+'review-layout.json')).read_text()):proof(img(P+rec['sheet']),icons[rec['icon']],rec['xy'],rec['scale'],str(rec))
    for ref in sorted((ROOT/'reference/r16').glob('ref-*.png')):
        stem=P+'context-'+ref.stem[4:];native=img(stem+'-1x')
        for scale in [2,4]:check(stem+' exact '+str(scale)+'x',eq(native.resize((native.width*scale,native.height*scale),b.NN),img(stem+'-'+str(scale)+'x')))
        for j,kind in enumerate(['dark','light']):
            for i,n in enumerate(b.NAMES):proof(native,icons[n],(8+i*32,24+j*56),1,ref.stem+' '+kind+' '+n)
    # Check the literal panel compositing as well as opaque sprite placements.
    spec=importlib.util.spec_from_file_location('review',REV/(P+'review.py'))
    r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
    for kind in ['dark','light']:
        expected=r.background((456,40),kind)
        for i,n in enumerate(b.NAMES):r.paste(expected,icons[n],(8+i*32,8))
        check(kind+' exact 75% reference-map panel',eq(expected.convert('RGB'),img(P+'row-'+kind+'-1x').convert('RGB')))
    baseline=json.loads((REV/(Q+'baseline.json')).read_text())
    output_paths={'art-drop/out/weather16/icon-'+n+'.png' for n in failed}
    generated=['overview.png','review.html','review-layout.json','review.py','build.py','verify.py','validation.json']
    allowed={'art-drop/NOTES.md'}|output_paths|{'art-drop/review/'+P+n for n in generated}
    for rel in baseline:
        name=Path(rel).name
        if rel.startswith('art-drop/review/'+P) and any(name.startswith(P+t) for t in ['row-','candidate-row-','before-after-','badges-','file-icon-','context-']):allowed.add(rel)
    allowed|={'art-drop/review/'+P+'candidate-icon-'+n+'.png' for n in failed}
    changed=[];protected=0
    for rel,digest in baseline.items():
        path=ROOT.parent/rel;same=path.exists() and sha(path)==digest
        if not same:changed.append(rel)
        if rel not in allowed:check('Protected '+rel,same);protected+=1
    check('Exactly three output icons changed',{p for p in changed if p.startswith('art-drop/out/')}==output_paths)
    check('Every change lies in art-drop',all(p.startswith('art-drop/') for p in changed))
    prior=(REV/(Q+'notes-before.txt')).read_text();notes=(ROOT/'NOTES.md').read_text()
    check('Earlier notes unchanged',notes.endswith(prior))
    check('Requested note at top',notes.startswith('# Round 16 — Part Epolish: critic-r16Epolish-1 redraw\n'))
    result={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failed':[c['check'] for c in checks if not c['pass']],
      'mode_blocks':mode_blocks,'mode_samples':mode_blocks*64,'cleanup_edits':cleanup,'alpha_edits':alpha_edits,
      'protected_files':protected,'changed_existing_files':changed,'checks':checks}
    for prefix in [P,Q]:(REV/(prefix+'validation.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k not in ['checks','changed_existing_files']},indent=2))
    if result['failed']:raise SystemExit(1)

if __name__=='__main__':main()
