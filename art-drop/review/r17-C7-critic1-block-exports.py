from pathlib import Path
import importlib.util,json
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
l=c.c7_city_layout();records=[]
for bid,name,extras in [('inn','block-inn-b-c7',['inn-porch']),('south-artisans','block-market-c7',['market-hall']),('southeast','block-se-c7',[])]:
 b=next(b for b in l['blocks'] if b['id']==bid);x,y,w,h=b['rect'];items=[]
 for q in l['lots']:
  if q['block']!=bid:continue
  a,parts,rm,wm=c.c7_build_lot(q);xx,base=q['bottom_left'];items.append(dict(base=base,z=0,x=xx,y=base-a.height,a=a,meta=q,parts=parts,roofmask=rm,wallmask=wm))
 c.c7_join_lots(items)
 for prop in l['props']:
  if prop['id'] not in extras:continue
  a=c.asset(prop['file']).copy()
  if prop['id']=='inn-porch':a.alpha_composite(c.asset('sign-inn-c7'),(0,144))
  items.append(dict(base=prop['base'],z=1,x=prop['x'],y=prop['base']-a.height,a=a,meta=prop))
 top=min(i['y'] for i in items);top=(top//48)*48;a=Image.new('RGBA',(w,y+h-top))
 for q in l['lots']:
  if q['block']!=bid:continue
  for xx,yy in q.get('rear_wing_cells',[]):a.alpha_composite(c.c7_tone(c.asset('roof-fill-c7'),q['roof']),(xx*48,y+yy*48-top))
 for i in sorted(items,key=lambda i:(i['base'],i['z'],i['x'])):a.alpha_composite(i['a'],(i['x']-x,i['y']-top))
 a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);a.save(O/(name+'.png'))
 records.append(dict(file=name+'.png',size=list(a.size),ground_plan=b['rect'],projected_origin=[x,top],lots=[i['meta']['id'] for i in items],method='Complete oriented ground/storey/roof assemblies, native rear wings and whole landmark'))
(R/'r17-C7-critic1-block-export-recipes.json').write_text(json.dumps(records,indent=2))
print(records)
