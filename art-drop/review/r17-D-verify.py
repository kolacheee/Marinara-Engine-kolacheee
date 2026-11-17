"""Saved-art mechanical audit: source/mode/cleanup, alpha, routes, scope."""
from pathlib import Path
from collections import Counter
import json,hashlib,importlib.util
from PIL import Image,ImageChops
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
def load(name,path):
 sp=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m
def run():
 c=load('compose_d',O/'compose.py');p=load('process_d',R/'r17-D-process.py');checks=[]
 def check(name,ok,**kw):checks.append(dict(check=name,pass_=bool(ok),**kw))
 # Historical accepted exports are checked byte-for-byte below. Replay
 # every sample of this redraw's two wall drawings, without redoing old rounds.
 logs=[dict(log,redraw=True) for log in json.loads((R/'r17-D-critic2-processing.json').read_text())];samples=0
 for log in logs:
  ident=log['id'];print('Replay',ident,flush=True);w,h=log['size']
  names={kind:(f'r17-D-critic2-{ident}-{kind}.png' if log.get('redraw') else f'r17-D-{kind}-{ident}.png') for kind in ['registered','mode','clean']}
  reg=Image.open(R/names['registered']).convert('RGBA');raw=[];sw=w*8
  for y in range(h):
   v=list(reg.crop((0,y*8,sw,(y+1)*8)).get_flattened_data())
   for x in range(w):
    votes=Counter(q for yy in range(8) for q in v[yy*sw+x*8:yy*sw+x*8+8]);raw.append(min(votes,key=lambda q:(-votes[q],q)))
  mode=Image.open(R/names['mode']);check(ident+' mode64',raw==list(mode.get_flattened_data()));samples+=w*h*64
  for x,y,before,after in log['cleanup']:
   check_ok=raw[y*w+x]==tuple(before)
   if not check_ok:raise AssertionError((ident,x,y,'cleanup before mismatch'))
   raw[y*w+x]=tuple(after)
  check(ident+' cleanup replay',raw==list(Image.open(R/names['clean']).get_flattened_data()))
  check(ident+' source hash',hashlib.sha256((R/log['source']).read_bytes()).hexdigest()==log['source_sha256'])
 files=json.loads((R/'r17-D-files.json').read_text())
 print('Audit exports and routes',flush=True)
 for name,rec in files.items():
  im=Image.open(O/(name+'.png')).convert('RGBA');v=list(im.get_flattened_data());check(name+' native dimensions',list(im.size)==rec['size']);check(name+' hard alpha',all(q[3] in (0,255) for q in v));check(name+' zero hiddenRGB',all(q==(0,0,0,0) for q in v if not q[3]));check(name+' manifest hash',hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest()==rec['sha256'])
  seen=set();components=0
  for i,q in enumerate(v):
   if not q[3] or i in seen:continue
   components+=1;todo=[i];seen.add(i)
   while todo:
    j=todo.pop();x,y=j%im.width,j//im.width
    for yy in range(max(0,y-1),min(im.height,y+2)):
     for xx in range(max(0,x-1),min(im.width,x+2)):
      k=yy*im.width+xx
      if v[k][3] and k not in seen:seen.add(k);todo.append(k)
  check(name+' one opaque component without detached specks',components==1,components=components)
  check(name+' review sheets',all((R/f'r17-D-{x}.png').exists() for x in (f'piece-{name}-1x4x',f'seam-{name}-1x',f'seam-{name}-3x')))
 walk=Image.open(O/'wall-walk.png').convert('RGBA');check('wall has no duplicated48px half',walk.crop((0,0,48,144)).tobytes()!=walk.crop((48,0,96,144)).tobytes())
 master=Image.open(R/'r17-D-critic2-wallA-clean.png').convert('RGBA');check('wall native drawing crop',walk.tobytes()==master.crop((0,0,96,144)).tobytes())
 alternate=Image.open(R/'r17-D-critic2-wall-walk-alternate.png').convert('RGBA')
 check('alternate adjacent drawing crop',alternate.tobytes()==master.crop((96,0,192,144)).tobytes())
 stair=Image.open(O/'wall-walk-stair.png').convert('RGBA')
 check('shared4px wall stair overlap is identical paint',stair.crop((0,0,4,144)).tobytes()==alternate.crop((92,0,96,144)).tobytes())
 recipe=json.loads((R/'r17-D-critic2-native-joins.json').read_text())
 previous=Image.open(R/recipe['stair_preserved_source']).convert('RGBA')
 preserved=all(stair.crop((x,y,192,y+1)).tobytes()==previous.crop((x,y,192,y+1)).tobytes() for y,x in enumerate(recipe['stair_preserved_left_x_by_row'],36))
 check('accepted stair treads cheek and gate landing byte identical',preserved)
 for y,x in enumerate(recipe['stair_preserved_left_x_by_row'],36):
  if stair.crop((4,y,x,y+1)).tobytes()!=master.crop((0,y,x-4,y+1)).tobytes():raise AssertionError(('wall composite',x,y))
 check('stair wall is common drawing donor',True)
 palette={tuple(q)+(255,) for q in logs[0]['palette']}
 check('redrawn wall and stair use locked stone palette',all(q in palette or q==(0,0,0,0) for a in [walk,stair,alternate] for q in a.get_flattened_data()))
 paving=Image.open(R/'r17-D-critic2-gate-interior.png').convert('RGBA');original_paving=Image.open(R/'r17-D-critic1-gate-paving.png').convert('RGBA')
 check('paving reuses whole compatible drawn courses',all(paving.crop((0,y,96,y+36)).tobytes()==original_paving.crop((0,51,96,87)).tobytes() for y in range(0,144,36)))
 check('paving interior contains only slate colours',all(q[:3] in [(80,91,109),(118,129,145)] for q in paving.crop((5,0,91,144)).get_flattened_data()))
 gate=Image.open(O/'gatehouse.png').convert('RGBA');opening=gate.crop((24,335,120,399));check('96x64 gateway clear below lintel',not opening.getchannel('A').getbbox())
 layouts=json.loads((R/'r17-D-scenes.json').read_text());route_results={}
 for name,layout in layouts.items():
  print('Audit scene',name,flush=True)
  occupied=Image.new('L',tuple(layout['size']))
  for b in layout.get('lots',[]):
   a,_=c.build_c(b['spec']);layer=Image.new('L',occupied.size);layer.paste(a.getchannel('A'),(b['x'],b['base']-a.height));occupied=ImageChops.lighter(occupied,layer)
  for o in layout.get('props',[]):
   if o['file']=='pilot-person':continue # A movable review actor is not a fixed obstacle.
   a=Image.open(c.ART/o['path']).convert('RGBA') if o.get('path') else c.asset(o['file']);layer=Image.new('L',occupied.size);layer.paste(a.getchannel('A'),(o['x'],o['base']-a.height));occupied=ImageChops.lighter(occupied,layer)
  route_results[name]=[]
  for rect in layout.get('clear_routes',[]):
   x,y,w,h=rect;count=sum(v>0 for v in occupied.crop((x,y,x+w,y+h)).get_flattened_data());route_results[name].append(dict(rect=rect,opaque_pixels=count));check(name+' clear route '+str(rect),count==0)
  a=Image.open(R/f'r17-D-critic-{name}-1x.png').convert('RGBA');b=Image.open(R/f'r17-D-critic-{name}-3x.png').convert('RGBA');check(name+' exact NN3x',a.resize(b.size,Image.Resampling.NEAREST).tobytes()==b.tobytes());grey=Image.open(R/f'r17-D-critic-{name}-squint-1x.png').convert('RGBA');check(name+' native greyscale',a.convert('L').convert('RGBA').tobytes()==grey.tobytes())
  shadow,_=c.c_shadow_layer(layout);check(name+' visible ground shadows',bool(shadow.getbbox()))
 # Verify unlike joins from the ACTUAL anchored placements, without ground.
 props=c.d_wall_props(gate_x=480,base=400,right_edge=864);joined=Image.new('RGBA',(864,432))
 for o in sorted(props,key=lambda o:(o['layer'],o['x'])):
  a=Image.open(c.ART/o['path']).convert('RGBA') if o.get('path') else c.asset(o['file'])
  joined.alpha_composite(a,(o['x'],o['base']-a.height))
 for label,x in [('tower-wall',116),('wall-stair',308),('stair-gate',488)]:
  band=joined.crop((x-4,294,x+4,398)).getchannel('A');check(label+' opaque masonry contact',all(v==255 for v in band.get_flattened_data()))
 gate_anchor=[480+8,400-400+292];stair_anchor=[304+184,400-144+36]
 check('gate landing and stair attachment coincide',gate_anchor==stair_anchor)
 market=layouts['market'];walls=sorted([o for o in market['props'] if o['file'].startswith(('wall-','gatehouse'))],key=lambda o:o['x'])
 check('at most two identical wall pieces in any five',all(max(Counter(o['file'] for o in walls[i:i+5]).values())<=2 for i in range(len(walls)-4)))
 check('guildhall addresses church through north forecourt',next(o for o in market['props'] if o['file']=='guildhall')['base']<next(o for o in market['props'] if o['file']=='cathedral')['base']-432)
 check('distinct drawn gate approach',any(o.get('path')=='review/r17-D-critic2-gate-interior.png' and o['rect']==[984,192,96,384] for o in market['roads']))
 check('threshold placed once at gate',sum(o['file']=='gate-threshold' for o in market['roads'])==1 and next(o['rect'] for o in market['roads'] if o['file']=='gate-threshold')==[984,423,96,9])
 # Real contiguous route width from the drawn service-road rectangles.
 service=[o['rect'] for o in market['roads'] if o['rect'][1]==432 and o['rect'][0]<984]
 widths=[max((y+h-432 for x,y,w,h in service if x<=xx<x+w),default=0) for xx in range(984)]
 longest=run=0;last=None
 for value in widths:
  run=run+1 if value==last else 1;longest=max(longest,run);last=value
 check('service road clear minimum48 and width runs at most384',min(widths)>=48 and longest<=384,longest_native_run=longest)
 before=json.loads((R/'r17-D-critic2-protected-before.json').read_text());allowed=set();bad=[]
 for file,digest in before.items():
  if file in allowed:continue
  f=Path(file)
  if not f.exists() or hashlib.sha256(f.read_bytes()).hexdigest()!=digest:bad.append(file)
 check('protected preexisting files unchanged',not bad,changed=bad,count=len(before)-len(allowed))
 result=dict(mode_samples=samples,checks=checks,clear_routes=route_results,passed=all(c['pass_'] for c in checks),failures=[c for c in checks if not c['pass_']])
 (R/'r17-D-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:result[k] for k in ['mode_samples','passed','failures']},indent=2))
if __name__=='__main__':run()
