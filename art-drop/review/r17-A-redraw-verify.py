"""Verify redraw scope, immutable passes, source provenance, and entrance bounds."""
from pathlib import Path
import hashlib, importlib.util, json, sys
from PIL import Image

REV=Path(__file__).resolve().parent;ART=REV.parent;ROOT=ART.parent;OUT=ART/'out/city17'
baseline=json.loads((REV/'r17-A-redraw-baseline.json').read_text())
critic=json.loads((REV/'critic-r17A-1.json').read_text())
failed=set(critic['failed']);checks=[]
def check(ok,name):checks.append({'pass':bool(ok),'check':name})
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
changed=[]
for path,original in baseline.items():
    p=ROOT/path
    if p.exists() and sha(p)==original:continue
    changed.append(path)
    allowed=(path=='art-drop/NOTES.md' or path.startswith('art-drop/review/r17-A-')
             or path in {f'art-drop/out/city17/{n}.png' for n in failed})
    check(allowed,'scope: '+path)
passing=[n for n,d in critic['files'].items() if d['status']=='pass']
for n in passing:check(sha(OUT/(n+'.png'))==baseline[f'art-drop/out/city17/{n}.png'],'passing bytes unchanged: '+n)
for n in failed:check(sha(OUT/(n+'.png'))!=baseline[f'art-drop/out/city17/{n}.png'],'failed export redrawn: '+n)
notes=(ART/'NOTES.md').read_bytes();marker=b'<!-- r17-A critic redraw retained notes -->\n'
check(marker in notes and hashlib.sha256(notes.split(marker,1)[-1]).hexdigest()==baseline['art-drop/NOTES.md'],'complete prior NOTES retained')
check(all(json.loads((REV/'r17-A-redraw-reference-checks.json').read_text()).values()),'all 15 reference/replay checks')
spec=importlib.util.spec_from_file_location('process',REV/'r17-A-process.py');process=importlib.util.module_from_spec(spec);spec.loader.exec_module(process)
rows=json.loads((REV/'r17-A-redraw-generation.json').read_text())
check(len(rows)==21,'two variants per failed design and third timber refinement')
check(sum(r['selected'] for r in rows)==10,'ten selected redraw sources')
for r in rows:
    source=REV/r['source'];check(source.read_bytes()==Path(r['original_path']).read_bytes(),'tool source bytes: '+r['id'])
    stages=[REV/f'r17-A-{stage}-{r["id"]}.png' for stage in ['registered','mode','clean']]
    old=[sha(q) for q in stages];a,_=process.reduce(r)
    check([sha(q) for q in stages]==old,'full source reduction replay: '+r['id'])
    if r['selected']:
        for c in range(3):
            b=Image.open(OUT/(r['output']+f'-c{c}.png')).convert('RGBA')
            check(process.colour(a,c).tobytes()==b.tobytes(),'selected colour replay: '+r['output']+f'-c{c}')
            check(b.getchannel('A').tobytes()==a.getchannel('A').tobytes(),'colourway silhouette: '+r['output']+f'-c{c}')
        check(Image.open(OUT/(r['output']+'.png')).tobytes()==a.tobytes(),'c0 alias: '+r['output'])
entrances={
 'ground-shop-w1':[23,9,43,41], 'corner-ground':[6,11,27,42],
 'ground-shop-v1-w1':[20,9,42,42], 'ground-shop-v2-w1':[5,8,25,41],
 'ground-work-w1':[5,8,25,42], 'ground-work-v1-w1':[6,11,26,42],
 'ground-work-v2-w1':[21,9,43,40], 'inn-front-w1':[6,10,28,44],
}
measurements={n:dict(clear_entry_bounds=b,width=b[2]-b[0],height=b[3]-b[1],
                   method='Visually located native painted opening/door-leaf bounds; right/bottom exclusive. Not engine collision data.') for n,b in entrances.items()}
for n,m in measurements.items():check(m['width']>=20 and m['height']>=30,'painted entrance target: '+n)
(REV/'r17-A-redraw-entrances.json').write_text(json.dumps(measurements,indent=2)+'\n')
audit=dict(checks=len(checks),passed=sum(c['pass'] for c in checks),failed=[c for c in checks if not c['pass']],
           redrawn_exports=len(failed),passing_exports_preserved=len(passing),new_sources=len(rows),selected_sources=10,
           reference_checks=15,changed_existing_files=changed,entrances=measurements,
           source_method='Built-in image tool on magenta; painted-row/optional frontage registration; 8x BOX; 23-colour subset of existing family palette; exact all64 RGBA mode; contour/material-fleck cleanup; painted course donor; existing c0/c1/c2 ramps.',
           visual_scope='Saved-art self-review. Full-city B/C/D dependencies remain failures; no independent reapproval claimed.')
(REV/'r17-A-redraw-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
print(json.dumps({k:v for k,v in audit.items() if k not in ['changed_existing_files','entrances']},indent=2))
sys.exit(bool(audit['failed']))
