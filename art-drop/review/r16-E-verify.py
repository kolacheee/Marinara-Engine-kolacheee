"""Validate saved weather icon pixels, source mode votes and review placement."""
from pathlib import Path
from PIL import Image
from collections import Counter
import hashlib,json,itertools

ROOT=Path(__file__).resolve().parents[1];REV=ROOT/'review';OUT=ROOT/'out/weather16'
scope={'__file__':str(REV/'r16-E-build.py'),'__name__':'r16_e_validation_build'}
exec(compile((REV/'r16-E-build.py').read_text(),scope['__file__'],'exec'),scope)
scope['save']=lambda *a,**kw:None
M=json.loads((REV/'r16-E-measurements.json').read_text())
R=json.loads((REV/'r16-E-generation.json').read_text())
checks=[]
def check(label,condition):
    checks.append({'check':label,'pass':bool(condition)})
def same(a,b):return a.mode==b.mode and a.size==b.size and a.tobytes()==b.tobytes()

sources={r['id']:r for r in R if 'original_path' in r}
for stage in M['stages']:
    ident=stage['id'];rec=sources[ident]
    check(ident+' original copy',hashlib.sha256((REV/rec['source']).read_bytes()).hexdigest()==hashlib.sha256(Path(rec['original_path']).read_bytes()).hexdigest())
    rebuilt,replayed_stage=scope['reduce_source'](rec)
    check(ident+' source registration replay',stage==replayed_stage and same(rebuilt,Image.open(REV/f'r16-E-clean-{ident}.png')))
    reg=Image.open(REV/f'r16-E-registered-{ident}.png');mode=Image.open(REV/f'r16-E-mode-{ident}.png')
    # Independently replay all 64 RGBA samples, with transparent samples voting.
    votes=[]
    for y in range(24):
        for x in range(24):
            counts=Counter(reg.crop((x*8,y*8,x*8+8,y*8+8)).get_flattened_data())
            votes.append(sorted(counts,key=lambda p:(-counts[p],p))[0])
    check(ident+' exact RGBA mode',votes==list(mode.get_flattened_data()))
    for e in stage['cleanup']:
        x,y=e['xy'];check(ident+f' edit ({x},{y})',list(mode.getpixel((x,y)))==e['before'] and list(rebuilt.getpixel((x,y)))==e['after'])
    check(ident+' alpha only removes remnants',all(not b[3] or a[3] for a,b in zip(mode.get_flattened_data(),rebuilt.get_flattened_data())))

icons={n:Image.open(OUT/f'icon-{n}.png').convert('RGBA') for n in scope['NAMES']}
for n,im in icons.items():
    m=M['files'][f'icon-{n}.png'];p=list(im.get_flattened_data());pal=scope['palette'](n)
    check(n+' size and mode',im.size==(24,24) and Image.open(OUT/f'icon-{n}.png').mode=='RGBA')
    check(n+' hard alpha',set(v[3] for v in p)=={0,255})
    check(n+' zero transparent RGB',all(v[:3]==(0,0,0) for v in p if not v[3]))
    check(n+' fixed palette',all(v[:3] in pal for v in p if v[3]))
    check(n+' clear margin',all(not im.getpixel((x,y))[3] for x,y in [(x,y) for x in range(24) for y in [0,23]]+[(x,y) for x in [0,23] for y in range(24)]))
    check(n+' no isolated alpha specks',min(map(len,scope['groups'](im)))>=3)
    check(n+' each component has visible fill',all(any(p[q][:3]!=scope['OUTLINE'] for q in g) for g in scope['groups'](im)))
    exposed=[]
    for y in range(1,23):
        for x in range(1,23):
            v=im.getpixel((x,y))
            if v[3] and any(not im.getpixel((xx,yy))[3] for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]):exposed.append(v[:3])
    check(n+' dark one-pixel exposed contour',set(exposed)=={scope['OUTLINE']})
    check(n+' selected drawing',same(im,Image.open(REV/f'r16-E-clean-{M["selected"][n]}.png')))
    check(n+' measurements',im.getbbox()==tuple(m['bounds']) and sum(v[3]>0 for v in p)==m['opaque_pixels'] and len(set(v for v in p if v[3]))==m['colours'])
    check(n+' hash',hashlib.sha256((OUT/f'icon-{n}.png').read_bytes()).hexdigest()==m['sha256'])
    proof=Image.open(REV/f'r16-E-file-icon-{n}.png')
    for j,kind in enumerate(['dark','light']):
        panel=scope['on_panel'](im,kind)
        check(n+' '+kind+' proof 1x',same(proof.crop((j*152+8,44,j*152+32,68)),panel))
        check(n+' '+kind+' proof 4x',same(proof.crop((j*152+44,44,j*152+140,140)),panel.resize((96,96),Image.Resampling.NEAREST)))

for kind in ['dark','light']:
    row=Image.open(REV/f'r16-E-row-{kind}-1x.png')
    for i,n in enumerate(scope['NAMES']):check(kind+' row '+n,same(row.crop((8+i*32,8,32+i*32,32)),scope['on_panel'](icons[n],kind)))
    for s in [2,4]:check(kind+f' row exact {s}x',same(Image.open(REV/f'r16-E-row-{kind}-{s}x.png'),row.resize((row.width*s,row.height*s),Image.Resampling.NEAREST)))

for refpath in sorted((ROOT/'reference/r16').glob('ref-*.png')):
    ref=Image.open(refpath).convert('RGB');rp=ref.load();name=refpath.stem[4:];context=Image.open(REV/f'r16-E-context-{name}-1x.png')
    for j,(kind,panel) in enumerate([('dark',(10,12,20)),('light',(246,243,232))]):
        row=Image.new('RGB',(456,40));row.putdata([tuple((3*panel[c]+rp[x%ref.width,y][c]+2)//4 for c in range(3)) for y in range(40) for x in range(456)])
        for i,n in enumerate(scope['NAMES']):row.paste(icons[n],(8+i*32,8),icons[n])
        check(name+' '+kind+' actual 75% panel',same(context.crop((0,16+j*56,456,56+j*56)),row))
    for s in [2,4]:check(name+f' context exact {s}x',same(Image.open(REV/f'r16-E-context-{name}-{s}x.png'),context.resize((456*s,112*s),Image.Resampling.NEAREST)))

pairs=[]
for a,b in itertools.combinations(icons,2):
    changed=sum(x!=y for x,y in zip(icons[a].get_flattened_data(),icons[b].get_flattened_data()))
    pairs.append({'a':a,'b':b,'different_rgba_pixels':changed})
check('no duplicated icons',all(p['different_rgba_pixels']>0 for p in pairs))
baseline=json.loads((REV/'r16-E-baseline.json').read_text())
changed=[p for p,h in baseline.items() if not Path(p).is_file() or hashlib.sha256(Path(p).read_bytes()).hexdigest()!=h]
check('all protected art files byte-identical',not changed)
allowed={str(OUT/f'icon-{n}.png') for n in icons}|{str(ROOT/'NOTES.md')}
new=[str(p) for p in ROOT.rglob('*') if p.is_file() and str(p) not in baseline and str(p) not in allowed and not(p.parent==REV and p.name.startswith('r16-E-'))]
check('all new files in Part E scope',not new)
notes=(ROOT/'NOTES.md').read_bytes();old=(REV/'r16-E-notes-before.txt').read_bytes()
check('NOTES new section at top',notes.startswith('# Round 16 — Part E\n'.encode()))
check('all previous NOTES preserved',notes.endswith(old))
result={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failed':[c for c in checks if not c['pass']],'protected_files':len(baseline),'changed_protected':changed,'unexpected_new':new,'source_drawings':len(sources),'mode_blocks':len(sources)*576,'mode_samples':len(sources)*576*64,'pair_pixel_differences':pairs,'checks':checks}
(REV/'r16-E-validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['checks','pair_pixel_differences']},indent=2))
raise SystemExit(0 if result['passed']==result['total'] else 1)
