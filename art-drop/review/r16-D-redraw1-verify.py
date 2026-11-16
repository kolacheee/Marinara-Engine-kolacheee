"""Verify delivered pixels, drawing provenance, loops, and protected files."""
from pathlib import Path
from PIL import Image,ImageSequence
from collections import Counter
import json,hashlib,importlib.util,subprocess
P=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('review',P/'r16-D-redraw1-review.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
m=r.m;old=m.old;OUT=m.OUT;REV=m.REV;REF=m.REF
checks=[]
def check(name,ok,detail=None):
    checks.append({'check':name,'pass':bool(ok),'detail':detail})
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def pixels(im):return list(im.convert('RGBA').get_flattened_data())
def same(a,b):return a.size==b.size and a.convert('RGBA').tobytes()==b.convert('RGBA').tobytes()
art=r.files();stages=json.loads((REV/'r16-D-redraw1-stages.json').read_text());rawcache={}
for st in stages:
    ident=st['id'];source=st.get('source',ident);colour=m.PALE if ident.startswith('bolt') else m.WISP
    if source not in rawcache:rawcache[source]=m.keyed(REV/f'r16-D-redraw1-source-{source}.png',colour)
    raw=rawcache[source]
    if ident.startswith('bolt'):expected=m.lock(raw.resize((384,1152),Image.Resampling.BOX),colour)
    else:
        f=st['source_row'];row=raw.crop((0,round(raw.height*f/4),raw.width,round(raw.height*(f+1)/4)));crop=row.crop(st['source_crop']);x,y,w,h=st['placement']
        expected=Image.new('RGBA',(1152,384));expected.paste(crop.resize((w*8,h*8),Image.Resampling.BOX),(x*8,y*8));m.lock(expected,colour)
    reg=Image.open(REV/f'r16-D-redraw1-registered-{ident}.png').convert('RGBA');mode=Image.open(REV/f'r16-D-redraw1-mode-{ident}.png').convert('RGBA');clean=Image.open(REV/f'r16-D-redraw1-clean-{ident}.png').convert('RGBA')
    check('registration '+ident,same(reg,expected));w,h=mode.size;rp=pixels(reg);mp=pixels(mode);calculated=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(rp[(y*8+dy)*w*8+x*8+dx] for dy in range(8) for dx in range(8));calculated.append(min(votes,key=lambda v:(-votes[v],v)))
    check('exact 64-sample mode '+ident,mp==calculated)
    support_ok=True
    for join in st['joins']:
        q=join['index'];y,x=divmod(q,w);n=sum(bool(rp[(y*8+dy)*w*8+x*8+dx][3]) for dy in range(8) for dx in range(8));support_ok &= n==join['source_opaque_samples'] and n>=8;calculated[q]=colour
    for q in st['removed_specks']:calculated[q]=(0,0,0,0)
    check('source-supported cleanup '+ident,support_ok and calculated==pixels(clean))
    check('hard source alpha '+ident,set(v[3] for v in rp)<={0,255})
for name,im in art.items():
    p=pixels(im);flash=name=='lightning-flash.png';size=(192,192) if flash else (48,144) if name.startswith('lightning') else (144,48)
    check('size '+name,im.size==size)
    check('alpha '+name,set(q[3] for q in p)<=({0,8,16,28,44,64,88} if flash else {0,255}))
    check('zero RGB '+name,all(q==(0,0,0,0) for q in p if not q[3]))
    check('no detached specks '+name,all(len(g)>4 for g in old.groups(im)))
for i,ident in enumerate(m.SELECT_BOLTS):
    name=f'lightning-{i}-f2.png';im=art[name];orig=art[f'lightning-{i}-f0.png'];a=pixels(orig);b=pixels(im);n=sum(q[3]>0 for q in b);count=sum(q[3]>0 for q in a)
    check('selected bolt '+name,same(im,Image.open(REV/f'r16-D-redraw1-clean-{ident}.png')))
    check('connected pale afterglow '+name,len(old.groups(im))==1 and set(v for v in b if v[3])=={m.PALE})
    check('reduced stroke mass '+name,n<count*.65,{'old':count,'new':n})
    overlap=sum(bool(x[3] and y[3]) for x,y in zip(a,b))/n
    check('same registered bolt path '+name,overlap>=.98,{'within_original_mask':overlap})
    check('same vertical span '+name,abs(im.getbbox()[1]-orig.getbbox()[1])<=1 and abs(im.getbbox()[3]-orig.getbbox()[3])<=1)
for i,ident in enumerate(m.SELECT_WIND):
    for f in [0,3]:
        name=f'wind-{i}-f{f}.png';im=art[name];p=pixels(im)
        check('selected endpoint '+name,same(im,Image.open(REV/f'r16-D-redraw1-clean-{ident}-f{f}.png')))
        check('quiet connected endpoint '+name,len(old.groups(im))==1 and 5<sum(q[3]>0 for q in p)<=20 and set(v for v in p if v[3])=={m.WISP})
protected=json.loads((REV/'r16-D-redraw1-protected.json').read_text());changed=[path for path,sha in protected.items() if not Path(path).exists() or digest(Path(path))!=sha]
check('all protected files byte-identical',not changed,{'count':len(protected),'changed':changed})
crit=json.loads((REV/'critic-r16D-1.json').read_text())
for name in crit['failed']:check('failed file replaced '+name,digest(OUT/f'{name}.png')!=digest(REV/f'r16-D-redraw1-before-{name}.png'))
measure=json.loads((REV/'r16-D-measurements.json').read_text())
for name,im in art.items():check('current measurement hash '+name,measure['files'][name]['sha256']==digest(OUT/name))
for ref,values in measure['afterglow_contrast'].items():
    for i,v in values.items():check('afterglow contrast falls '+ref+' '+i,v['new_f2_over_f1']<.8,v['new_f2_over_f1'])
for i,v in measure['wind_closure'].items():check('quiet loop closure '+i,v['reduction_percent']>85,v)
grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((48,48,240,144))
for rec in measure['animations']:
    path=REV/rec['gif'];im=Image.open(path);decoded=[f.convert('RGB') for f in ImageSequence.Iterator(im)];dur=[]
    for f in ImageSequence.Iterator(im):dur.append(f.info['duration'])
    if rec['kind']=='wind':frames=[old.compose(grass,art[f'wind-{rec["index"]}-f{f}.png'],(24,24)) for f in range(4)]
    else:frames=[old.lightning_scene(art,rec['index'],rec['context'],f) for f in rec['phases']]
    check('GIF frame count/timing '+path.name,len(decoded)==len(frames) and dur==rec['duration_ms'])
    atlas=Image.new('RGB',(frames[0].width,frames[0].height*len(frames)))
    for k,f in enumerate(frames):atlas.paste(f,(0,k*f.height))
    pal=atlas.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
    check('GIF matches actual output frames '+path.name,all(same(a,b.quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')) for a,b in zip(decoded,frames)))
    if rec['kind']=='wind':check('exact four-frame fixed-origin loop '+path.name,rec['phases']==[0,1,2,3] and rec['sprite_origin']==[24,24] and len(decoded)==4 and dur==[140]*4)
for path in sorted(REV.glob('r16-D-*-1x.png')):
    other=path.with_name(path.name.replace('-1x.png','-4x.png'))
    if other.exists():
        im=Image.open(path);check('nearest-neighbour 4x '+path.name,same(Image.open(other),im.resize((im.width*4,im.height*4),m.NN)))
for ref in sorted(REF.glob('ref-*.png')):
    bg=Image.open(ref).convert('RGBA')
    for family in ['lightning','wind']:
        sheet=Image.open(REV/f'r16-D-context-{ref.stem[4:]}-{family}-all-1x.png').convert('RGB')
        for k,(name,im) in enumerate((n,v) for n,v in art.items() if n.startswith(family)):
            x=(k%4)*288;y=(k//4)*312+24
            check('context '+ref.stem+' '+name,same(sheet.crop((x,y,x+288,y+288)),old.compose(bg,im,((288-im.width)//2,(288-im.height)//2))))
before=(REV/'r16-D-redraw1-notes-before.txt').read_bytes();notes=(m.ROOT/'NOTES.md').read_bytes()
check('earlier NOTES preserved',notes.endswith(before))
check('requested note heading',notes.startswith('# Round 16 — Part D: critic-r16D-1 redraw'.encode()))
branch=subprocess.check_output(['git','branch','--show-current'],text=True).strip();check('branch unchanged',branch=='art/overworld-codex-2026-11-06',branch)
status=subprocess.check_output(['git','status','--porcelain'],text=True).splitlines();outside=[x for x in status if not x[3:].startswith('art-drop/')]
check('worktree changes confined to art-drop',not outside,outside)
report={'checks_passed':sum(c['pass'] for c in checks),'checks_total':len(checks),'protected_files':len(protected),'mode_blocks':sum(x['mode_blocks'] for x in stages),'source_samples':sum(x['mode_blocks'] for x in stages)*64,'failures':[c for c in checks if not c['pass']],'checks':checks}
for name in ['r16-D-redraw1-validation.json','r16-D-validation.json']:(REV/name).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
raise SystemExit(bool(report['failures']))
