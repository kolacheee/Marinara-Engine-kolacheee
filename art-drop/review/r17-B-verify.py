"""Saved-output and compositor integration checks for Round17 PartB."""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json, re
from PIL import Image
if __name__=='__main__' and (Path(__file__).resolve().parent/'r17-B-critic2-verify.py').exists():
    import runpy
    runpy.run_path(str(Path(__file__).resolve().parent/'r17-B-critic2-verify.py'),run_name='__main__')
    raise SystemExit
if __name__=='__main__' and (Path(__file__).resolve().parent/'r17-B-critic1-verify.py').exists():
    import runpy
    runpy.run_path(str(Path(__file__).resolve().parent/'r17-B-critic1-verify.py'),run_name='__main__')
    raise SystemExit
ART=Path(__file__).resolve().parents[1];REV=ART/'review';OUT=ART/'out/city17'
def module(name,path):
    sp=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m
city=module('city17_verify',OUT/'compose.py');proc=module('r17b_proc',REV/'r17-B-process.py')
checks=[]
def check(condition,label):checks.append(dict(pass_=bool(condition),check=label))
def im(p):return Image.open(p).convert('RGBA')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
index=json.loads((REV/'r17-B-files.json').read_text())
allowed=set(proc.PAL+sum(proc.RAMPS,[])+[(30,30,30),(27,32,39),(38,31,23)])
for name,r in index.items():
    a=im(OUT/name);px=list(a.get_flattened_data());shadow=name.startswith('shadow-')
    check(a.size==tuple(r['size']),name+' size')
    check(all(p[3] in (0,112) if shadow else p[3] in (0,255) for p in px),name+' alpha')
    check(all(p[3] or p[:3]==(0,0,0) for p in px),name+' zero hidden RGB')
    check(all(p[:3] in allowed for p in px if p[3]),name+' locked palette')
    check(hashlib.sha256(a.tobytes()).hexdigest()==r['pixels_sha256'],name+' reviewed bytes')
    check((REV/r['proof']).exists() and (REV/f'r17-B-seam-{Path(name).stem}-4x.png').exists(),name+' proofs')
    todo={i for i,p in enumerate(px) if p[3]};sizes=[]
    while todo:
        seed=todo.pop();q=[seed];count=0
        while q:
            i=q.pop();count+=1;y,x=divmod(i,a.width)
            for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
                j=yy*a.width+xx
                if 0<=xx<a.width and 0<=yy<a.height and j in todo:todo.remove(j);q.append(j)
        sizes.append(count)
    check(min(sizes,default=0)>=3,name+' no isolated alpha specks')
    if name.startswith(('roof-','firewall-')):
        check(all(p[3]==255 for p in px),name+' opaque footprint without holes')
    m=re.match(r'roof-(gable|ridge|hip|flat)-w([123])',name)
    if m:
        check(a.width==48*int(m[2]) and a.height in (96,144),name+' whole-cell cap')
        check(a.crop((0,a.height-1,a.width,a.height)).tobytes()==proc.course(a.width).tobytes(),name+' facade eave course')
    if not shadow and not name.startswith(('roof-fill','roof-valley')):
        contour=[]
        for y in range(a.height):
            for x in range(a.width):
                p=px[y*a.width+x]
                if not p[3]:continue
                ns=[px[yy*a.width+xx] for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)) if 0<=xx<a.width and 0<=yy<a.height]
                if (len(ns)<4 or any(not n[3] for n in ns)) and y!=a.height-1:contour.append(p)
        check(all(p==proc.DARK for p in contour),name+' one-pixel exposed contour')
    # Proof enlargement is a literal nearest-neighbour copy of the 1x pair.
    proof=Image.open(REV/r['proof']);info=proof.info;pw,ph=json.loads(info['PairSize']);p1,p4=json.loads(info['PairOrigins'])
    native=proof.crop((p1[0],p1[1],p1[0]+pw,p1[1]+ph));large=proof.crop((p4[0],p4[1],p4[0]+pw*4,p4[1]+ph*4))
    check(native.resize(large.size,Image.Resampling.NEAREST).tobytes()==large.tobytes(),name+' exact4x proof')

# Every c variant preserves its source silhouette byte-for-byte.
for name in index:
    if '-c' in name:
        base=re.sub(r'-c[0-2](?=\.png$)','',name)
        check(im(OUT/name).getchannel('A').tobytes()==im(OUT/base).getchannel('A').tobytes(),name+' identical silhouette')
        c=int(re.search(r'-c([0-2])\.png$',name)[1])
        check(im(OUT/name).tobytes()==proc.colour(im(OUT/base),c).tobytes(),name+' exact material colourway')

# Replay all exact64-sample mode votes and all documented cleanup/compositing edits.
processing=json.loads((REV/'r17-B-processing.json').read_text());mode_blocks=0
for r in processing:
    name=r['id'];w,h=r['size'];reg=im(REV/f'r17-B-registered-{name}.png');mode=im(REV/f'r17-B-mode-{name}.png')
    px=list(reg.get_flattened_data());result=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(p for dy in range(8) for p in px[(y*8+dy)*w*8+x*8:(y*8+dy)*w*8+x*8+8])
            result.append(min(votes,key=lambda p:(-votes[p],p)))
    check(result==list(mode.get_flattened_data()),name+' all64 exact mode samples')
    for x,y,old,new in r['cleanup']:
        check(result[y*w+x]==tuple(old),name+f' cleanup source {x},{y}')
        result[y*w+x]=tuple(new)
    check(result==list(im(REV/f'r17-B-clean-{name}.png').get_flattened_data()),name+' cleanup replay')
    mode_blocks+=w*h

layouts=city.critic_layouts()
for name,layout in layouts.items():
    a,records=city.scene(layout);check(a.tobytes()==im(REV/f'r17-B-critic-{name}-1x.png').tobytes(),name+' saved scene replay')
    check(a.resize((a.width*3,a.height*3),Image.Resampling.NEAREST).tobytes()==im(REV/f'r17-B-critic-{name}-3x.png').tobytes(),name+' exact3x scene')
    check(a.convert('L').convert('RGBA').tobytes()==im(REV/f'r17-B-critic-{name}-squint-1x.png').tobytes(),name+' squint replay')
    for b in city.neighbours(layout['buildings']):
        a,parts=city.build(b['spec']);check(b['base']>=a.height,b['id']+' roof within scene north edge')
        for p in parts:
            piece=im(ART/p['file']);piece=piece.crop(p['crop']) if p['crop'] else piece
            check(0<=p['x']<=a.width-piece.width and 0<=p['y']<=a.height-piece.height,b['id']+' bounded '+p['layer'])
            check('/city15/' not in p['file'],b['id']+' current round asset '+p['layer'])
    check(any(r.get('side')=='south' for r in records),name+' receiving street shadow')
    if name=='height-test':
        walls=[p for b in city.neighbours(layout['buildings']) for p in city.build(b['spec'])[1] if p['layer']=='firewall coping']
        check(len(walls)==2,name+' both taller-neighbour orientations')
        east={r['id']:r['reach'] for r in records if r.get('side')=='east'}
        check(east=={'height-1':6,'height-3':30},name+' height-responsive east receivers')
    if name=='L-block':check(a is not None and tuple(layout['size'])==(768,576),name+'16x12 cells')

# Reject an out-of-lot overlay instead of silently clipping it.
bad=city.make_spec(1,1);bad['roof_overlays']=[dict(file='dormer-0',x=40,y=40)]
try:city.build(bad);bounded=False
except ValueError:bounded=True
check(bounded,'reject cross-lot roof overlay')
check(city.firewall_surface((56,160)).tobytes()==im(REV/'r17-B-firewall-body-repeat-1x.png').tobytes(),'firewall body tiles in both axes; edge courses once')

for c in range(3):
    tile=im(OUT/f'roof-fill-w1-c{c}.png');rep=city.repeat(tile,(144,144))
    check(rep.tobytes()==im(REV/f'r17-B-repeat-roof-fill-w1-c{c}-1x.png').tobytes(),f'fill c{c} literal3x3')
    check(tile.crop((0,0,16,16)).tobytes()==tile.crop((32,32,48,48)).tobytes(),f'fill c{c} periodic16px drawn patch')

before=json.loads((REV/'r17-B-starting-hashes.json').read_text());protected=0
for path,digest in before.items():
    if path in ('art-drop/NOTES.md','art-drop/out/city17/compose.py'):continue
    check(Path(path).exists() and sha(Path(path))==digest,'protected '+path);protected+=1
notes=(ART/'NOTES.md').read_bytes();old=(REV/'r17-B-notes-before.txt').read_bytes()
check(notes.endswith(old),'earlier NOTES including pre-existing merge conflict preserved')
failures=[r['check'] for r in checks if not r['pass_']]
report=dict(passed=len(checks)-len(failures),total=len(checks),failures=failures,exports=len(index),
    protected_files=protected,mode_blocks=mode_blocks,mode_samples=mode_blocks*64,
    shadow_alpha_exception='112/255 only; all other assets0/255',checks=checks)
(REV/'r17-B-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
raise SystemExit(bool(failures))
