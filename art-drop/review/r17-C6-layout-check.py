"""Static saved-layout connections and entrance approaches, not runtime navigation."""
from pathlib import Path
from collections import deque
import importlib.util,json
R=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('c',R.parent/'out/city17/compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
l=c.c6_city_layout();checks=[]
def test(name,ok,detail=None):checks.append(dict(name=name,passed=bool(ok),detail=detail))
def overlap(a,b):return max(a[0],b[0])<min(a[0]+a[2],b[0]+b[2]) and max(a[1],b[1])<min(a[1]+a[3],b[1]+b[3])
def touch(a,b):
    return ((a[0]+a[2]==b[0] or b[0]+b[2]==a[0]) and min(a[1]+a[3],b[1]+b[3])>max(a[1],b[1])) or ((a[1]+a[3]==b[1] or b[1]+b[3]==a[1]) and min(a[0]+a[2],b[0]+b[2])>max(a[0],b[0]))
solids=[(b['id'],r) for b in l['lots'] for r in b.get('footprints',[b['footprint']])]
for p in l['props']:
    if p.get('overhead') or p.get('id') in ('church-east-door','guildhall-public-entry'):continue
    feet=p.get('ground_footprints',p.get('footprints',[p['footprint']] if p.get('footprint') else []))
    if not feet and p['file'].startswith('lean-to'):feet=[[p['x'],p['base']-48,48,48]]
    solids.extend((p.get('id',p['file']),r) for r in feet)
adj={}
for b in l['lots']:
    adj[b['id']]=sorted({n for n,r in solids if n!=b['id'] and touch(b['footprint'],r)})
test('every modular house has a positive-length shared wall with a building or attached store',all(adj.values()),{k:v for k,v in adj.items() if not v})
for name in ('square-baker','square-apothecary','west-smith','west-cobbler','gate-road-inn'):
    b=next(b for b in l['lots'] if b['id']==name);x,y=b['entrance'];r=[x-12,y,24,32]
    hits=[n for n,foot in solids if n!=name and overlap(r,foot)]
    test(name+'24x32 standing area clear of solid supports',not hits,hits)
main=[r['rect'] for r in l['roads'] if r['kind']=='main'];cells=set()
for x,y,w,h in main:
    cells.update((xx//12,yy//12) for yy in range(y,y+h,12) for xx in range(x,x+w,12))
todo=deque([(1248//12,1428//12)]);seen=set(todo)
while todo:
    x,y=todo.popleft()
    for v in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if v in cells and v not in seen:seen.add(v);todo.append(v)
test('continuous designated main-road union from portal to eastern square', (1152//12,792//12) in seen)
test('main road width never less than96',all(min(r[2:])>=96 for r in main))
test('southern whole-house stagger exactly48',abs(next(b['base'] for b in l['lots'] if b['id']=='south-stagger-west')-next(b['base'] for b in l['lots'] if b['id']=='south-stagger-east'))==48)
test('gate preserved3x4 ground allocation',next(p['footprint'][2:] for p in l['props'] if p.get('id')=='gatehouse')==[144,192])
church=next(p['footprint'] for p in l['props'] if p.get('id')=='cathedral');porch=next(p['footprint'] for p in l['props'] if p.get('id')=='church-east-door')
test('church east porch within5x6 church allocation',church[0]<=porch[0] and church[1]<=porch[1] and porch[0]+porch[2]<=church[0]+church[2] and porch[1]+porch[3]<=church[1]+church[3])
out=dict(scope='Static authored geometry only; no runtime pathfinding claim',checks=checks,passed=sum(x['passed'] for x in checks),failed=[x for x in checks if not x['passed']],shared_edges=adj)
(R/'r17-C6-layout-connections.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='shared_edges'},indent=2))
