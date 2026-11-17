"""Select, recolour, tile-wrap and composite native drawings; never draw shapes."""
from pathlib import Path
from PIL import Image
import json,hashlib,importlib.util
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('eprocess',R/'r17-E-process.py');p=importlib.util.module_from_spec(sp);sp.loader.exec_module(p)
files={};transfers=[]
def clean(n):return Image.open(R/f'r17-E-clean-{n}.png').convert('RGBA')
def put(n,a,source,kind='prop',**extra):
 a.save(O/(n+'.png'));q=list(a.get_flattened_data());files[n]=dict(size=list(a.size),source=source,kind=kind,colours=len(set(v[:3] for v in q if v[3])),opaque=sum(v[3]>0 for v in q),alpha=sorted(set(v[3] for v in q)),sha256=hashlib.sha256((O/(n+'.png')).read_bytes()).hexdigest(),anchor_bottom_left=[0,a.height],season='summer',**extra)
def recolour(a,m):
 b=a.copy();b.putdata([tuple(m.get(q[:3],q[:3]))+(q[3],) if q[3] else (0,0,0,0) for q in a.get_flattened_data()]);return b
# Exact source-to-native course periods, repeated without interpolation.
large=clean('cobble-large-patch');small=clean('cobble-small-patch')
put('cobble-large',p.repeat(large,(48,48)),'cobble-large-patch','ground',period=[24,12],cobble=[12,6])
put('cobble-small',p.repeat(small,(48,48)),'cobble-small-patch','ground',period=[12,8],cobble=[6,4])
for n,w,tile,kerb in [('street-main',96,large,'main'),('street-side',48,small,'side')]:
 a=p.repeat(tile,(w,48))
 for side,x in [('left',0),('right',w-4)]:a.paste(p.repeat(clean(f'{kerb}-kerb-{side}'),(4,48)),(x,0))
 put(n,a,[f'{kerb}-kerb-left',f'{kerb}-kerb-right', 'cobble-large-patch' if w==96 else 'cobble-small-patch'],'ground',kerb_gutter_width=4,period_y=12 if w==96 else 8)
# The lane's own painted edge columns survive; replace only its interior
# with the complete small cobble courses, keeping the 24px joined width.
a=p.repeat(small,(24,48));lane=clean('lane-patch')
a.paste(p.repeat(lane.crop((0,0,3,8)),(3,48)),(0,0));a.paste(p.repeat(lane.crop((21,0,24,8)),(3,48)),(21,0))
put('lane',a,['lane-patch','cobble-small-patch'],'ground',period_y=8,style='lane_joined',kerb_gutter_width=3)
# Mud wraps a native connected interior period; no loose outer fringe.
mud=clean('mud-edge');period=mud.crop((18,0,42,48));put('mud-edge',p.repeat(period,(48,48)),'mud-edge','ground-overlay',period=[24,48])
for n in ['sign-'+n for n in ['smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher']]:put(n,clean(n),n)
for n in ['barrel','crate','cart','chimney-smoke','forge-smoke','cat','pigeon','district-market-scales','district-temple-candles','district-craft-drying-rack','district-rich-banner','district-poor-shed','district-poor-shutter']:
 put(n,clean(n),n,'overlay' if n in ['chimney-smoke','forge-smoke','district-rich-banner','district-poor-shutter'] else 'prop')
put('washing-line',clean('washing-line-b'),'washing-line-b','overlay')
# The new two-cell inn preserves the fixed A course; existing other widths
# are retained. All colourways change only the established wall ramp.
base=p.prior.BASE;ramp=base[7:15]
ramps={
 'market':[(82,70,60),(127,107,87),(165,142,109),(190,167,128),(200,178,140),(222,203,167),(239,224,190),(247,237,210)],
 'temple':[(82,83,78),(119,120,109),(153,154,137),(180,180,157),(193,191,167),(214,212,185),(232,229,204),(246,241,221)],
 'craft':[(73,65,55),(111,97,79),(144,127,102),(169,150,120),(182,164,132),(205,187,156),(225,207,178),(241,226,202)],
 'rich':[(71,78,79),(109,119,119),(143,154,151),(171,182,175),(184,195,185),(207,216,202),(227,234,220),(242,246,233)],
 'poor':[(72,65,54),(109,99,80),(140,128,104),(164,151,122),(179,165,134),(199,187,153),(218,208,174),(236,227,198)]}
inn=clean('inn-front-b');put('inn-front',inn,'inn-front-b','facade');put('inn-front-w2',inn,'inn-front-b','facade')
for c,key in enumerate(['market','temple','rich']):put(f'inn-front-w2-c{c}',inn if c==0 else recolour(inn,dict(zip(ramp,ramps[key]))),'inn-front-b','facade')
configs={'market':('ground-shop-v2-w2-c0','storey-plaster-w2-c0','roof-ridge-w2-c0'),
 'temple':('ground-door-v2-w2-c0','storey-stone-w2-c0','roof-ridge-w2-c1'),
 'craft':('ground-work-v2-w2-c0','storey-timber-w2-c0','roof-ridge-w2-c2'),
 'rich':('ground-door-v2-w2-c0','storey-stone-w2-c0','roof-ridge-w2-c1'),
 'poor':('ground-door-v2-w2-c0','storey-plaster-w2-c0',None)}
districts={}
for key,sources in configs.items():
 names={}
 for layer,donor in zip(['ground','storey','roof'],sources):
  n=f'district-{key}-{layer}-w2';a=Image.open(O/(donor+'.png')).convert('RGBA') if donor else clean('district-poor-roof')
  if layer!='roof':
   a=recolour(a,dict(zip(ramp,ramps[key])))
   if key=='poor' and layer=='storey':
    a.alpha_composite(clean('district-poor-shutter'),(12,10));transfers.append(dict(target=n,donor='district-poor-shutter',at=[12,10]))
  put(n,a,donor or 'district-poor-roof','roof' if layer=='roof' else 'facade',district=key)
  names[layer]=n
 districts[key]=dict(files=names,wall_ramp=ramps[key],floors=[1,2] if key=='poor' else [3,5] if key=='rich' else [1,3],roof_colours=1,wall_colours_max=2)
# Three distinct bay/door layouts and roof forms in each one-colour family.
for key in configs:
 gkind='shop' if key=='market' else 'work' if key=='craft' else 'door'
 for v in (1,2):
  for layer,donor in [('ground',f'ground-{gkind}'+('' if v==1 else '-v1')+'-w2-c0'),('storey',f'storey-'+('timber' if v==1 else 'oriel')+'-w2-c0')]:
   n=f'district-{key}-{layer}-v{v}-w2';a=recolour(Image.open(O/(donor+'.png')).convert('RGBA'),dict(zip(ramp,ramps[key])))
   if key=='poor':
    patch_x=(58 if v==1 else 12) if layer=='ground' else (12 if v==1 else 36)
    a.alpha_composite(clean('district-poor-shutter'),(patch_x,10))
   put(n,a,donor,'facade',district=key,layout=v)
  colour=1 if key in ('temple','rich') else 2 if key=='craft' else 0
  donor=f'roof-'+('gable' if v==1 else 'hip')+f'-w2-c{colour}'
  a=clean('district-poor-roof-'+('b' if v==1 else 'c')) if key=='poor' else Image.open(O/(donor+'.png')).convert('RGBA')
  put(f'district-{key}-roof-v{v}-w2',a,'district-poor-roof-'+('b' if v==1 else 'c') if key=='poor' else donor,'roof',district=key,layout=v)
(R/'r17-E-districts.json').write_text(json.dumps(districts,indent=2));(R/'r17-E-native-transfers.json').write_text(json.dumps(transfers,indent=2));(R/'r17-E-files.json').write_text(json.dumps(files,indent=2));print('Installed',len(files),'exports')
