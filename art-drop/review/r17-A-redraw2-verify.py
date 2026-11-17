"""Audit the four-file lantern repair, retained pixels, sources and references."""
from pathlib import Path
import base64, hashlib, importlib.util, io, json, subprocess, sys
from PIL import Image

ART=Path(__file__).resolve().parents[1];ROOT=ART.parent;REV=ART/'review';OUT=ART/'out/city17'
def module(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def im(p):return Image.open(p).convert('RGBA')
def equal(a,b):return a.size==b.size and a.tobytes()==b.tobytes()
checks=[]
def check(ok,name):checks.append(dict(pass_=bool(ok),check=name))
baseline=json.loads((REV/'r17-A-redraw2-baseline.json').read_text())
critic=json.loads((REV/'critic-r17A-2.json').read_text());failed=set(critic['failed'])
passing=[n for n,v in critic['files'].items() if v['status']=='pass']
allowed_art={f'art-drop/out/city17/{n}.png' for n in failed}
changed=[];new=[]
for path in sorted(set(baseline)|{str(p.relative_to(ROOT)) for p in ART.rglob('*') if p.is_file()}):
    p=ROOT/path
    if path in baseline and p.exists() and sha(p)==baseline[path]:continue
    (changed if path in baseline else new).append(path)
    check(path in allowed_art or path=='art-drop/NOTES.md' or path.startswith('art-drop/review/r17-A-'),'authorized scope '+path)
for n in passing:check(sha(OUT/(n+'.png'))==baseline[f'art-drop/out/city17/{n}.png'],'passing export unchanged '+n)
for n in failed:check(sha(OUT/(n+'.png'))!=baseline[f'art-drop/out/city17/{n}.png'],'failed export repaired '+n)
notes=(ART/'NOTES.md').read_bytes();marker=b'<!-- r17-A critic round 2 retained notes -->\n'
check(marker in notes and hashlib.sha256(notes.split(marker,1)[-1]).hexdigest()==baseline['art-drop/NOTES.md'],'complete preceding NOTES preserved')
process=module('process',REV/'r17-A-process.py')
rows=json.loads((REV/'r17-A-redraw2-generation.json').read_text())
check(len(rows)==2 and sum(r['selected'] for r in rows)==1,'two image-tool alternatives, one selected')
for r in rows:
    check((REV/r['source']).read_bytes()==Path(r['original_path']).read_bytes(),'exact tool source '+r['id'])
    stages=[REV/f'r17-A-{s}-{r["id"]}.png' for s in ('registered','mode','clean')]
    old=[sha(q) for q in stages];a,_=process.reduce(r)
    check([sha(q) for q in stages]==old,'full source registration/reduction replay '+r['id'])
    if r['selected']:
        before=im(REV/'r17-A-redraw2-before.png');box=r['registered_patch']['box']
        diffs=[(x,y) for y in range(48) for x in range(48) if a.getpixel((x,y))!=before.getpixel((x,y))]
        check(all(box[0]<=x<box[2] and box[1]<=y<box[3] for x,y in diffs),'every pixel outside lantern patch preserved')
        for bounds,label in [([20,9,42,42],'22x33 clear doorway'),([19,42,44,47],'lit threshold'),([3,24,15,35],'bottle display')]:
            check(equal(a.crop(bounds),before.crop(bounds)),label+' pixel-exact')
        check(all(a.getpixel((x,y))[:3] in [(233,179,95),(242,223,185)] for y in range(21,24) for x in range(11,14)),'native 3x3 warm lit lantern body')
        for c in range(3):
            target=im(OUT/(r['output']+f'-c{c}.png'))
            check(equal(process.colour(a,c),target),'colourway replay '+str(c))
            check(equal(target.getchannel('A'),a.getchannel('A')),'colourway alpha '+str(c))
        check(equal(a,im(OUT/(r['output']+'.png'))),'unsuffixed c0 alias')

# Read the requested Git object directly; do not fetch or mutate the checkout.
raw=subprocess.check_output(['git','show','origin/claude/project-thread-g8wuu1:packages/server/src/assets/overworld-art/fantasy.json'],cwd=ROOT)
pack=json.loads(raw);sheets={s['id']:Image.open(io.BytesIO(base64.b64decode(s['png'].split(',',1)[1]))).convert('RGBA') for s in pack['sheets']}
for kind in ('house','hall','stall','well'):
    for n,t in enumerate(pack['tiles'][kind]):
        x,y=t['x']*48,t['y']*48;w,h=t.get('w',1)*48,t.get('h',1)*48
        check(equal(sheets[t['sheet']].crop((x,y,x+w,y+h)),im(ART/f'reference/r17/fantasy-{kind}-{n}.png')),'fantasy source crop '+kind+'-'+str(n))
check(equal(im(REV/'city-view-towns-2026-11-16.png').crop((0,0,600,500)),im(ART/'reference/r17/current-town.png')),'literal current-town fantasy panel')
city15=module('city15',ART/'out/city15/compose.py');street,_=city15.street(city15.mounted_specs(731))
check(equal(street,im(ART/'reference/r17/round15-street.png')),'round15 mounted seed731 street replay')
check(subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip()=='art/overworld-codex-2026-11-06','requested branch retained')
audit=dict(checks=len(checks),passed=sum(c['pass_'] for c in checks),failed=[c for c in checks if not c['pass_']],
 repaired_exports=sorted(failed),passing_exports_preserved=len(passing),new_tool_drawings=2,selected_tool_drawings=1,
 changed_pixels_per_design=len(diffs),patch_bounds=box,clear_entrance=[20,9,42,42],lamp_light=[11,21,14,24],
 changed_existing_files=changed,new_files=new,reference_checks=15,
 method='Magenta image-tool edit, painted-row BOX registration at 8x, local registered drawing composite, fixed palette, exact all64 RGBA mode, contour/fleck cleanup and retained drawn course.',
 scope='Saved-art self-review only; independent critic reapproval pending. Later-part scene failures are retained.')
(REV/'r17-A-redraw2-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
print(json.dumps({k:v for k,v in audit.items() if k not in ('changed_existing_files','new_files')},indent=2))
sys.exit(bool(audit['failed']))
