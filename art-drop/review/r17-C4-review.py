"""C4 saved-art review. All drawn annotations are confined to these sheets."""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json,copy
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
NN=Image.Resampling.NEAREST;BG=(40,43,37,255)
GROUND=['workyard-c4','main-paving-c4','cobble-c3','street-main-c3','street-side-c3','lane-c3','ditch-c3']
def save(a,n,factors=(1,4)):
 for z in factors:a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C4-{n}-{z}x.png')
def compare(a,n):
 refs=[('TODAY / literal 1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('R15 / literal 1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA'))]
 out=Image.new('RGBA',(a.width+max(b.width for _,b in refs)+32,max(a.height+32,sum(b.height+32 for _,b in refs))),BG);d=ImageDraw.Draw(out);out.alpha_composite(a,(0,24));d.text((4,4),n+' / literal 1x',fill='white');y=0
 for title,b in refs:d.text((a.width+16,y+4),title,fill='white');out.alpha_composite(b,(a.width+16,y+24));y+=b.height+32
 save(out,n+'-comparison',(1,))
def pair(items,n,factors=(1,4)):
 out=Image.new('RGBA',(sum(a.width+24 for _,a in items),max(a.height for _,a in items)+40),BG);d=ImageDraw.Draw(out);x=12
 for title,a in items:d.text((x,6),title,fill='white');out.alpha_composite(a,(x,out.height-8-a.height));x+=a.width+24
 save(out,n,factors)
def pieces():
 names=list(json.loads((R/'r17-C4-files.json').read_text()))
 for n in names:
  a=c.asset(n);ground=c.asset('workyard-c4') if n.startswith(('person','stable','lean','workshop')) else c.asset('cobble-c3')
  out=c.repeat(ground,(max(a.width+32,224),a.height+48));ImageDraw.Draw(out).text((8,5),n,fill='black');out.alpha_composite(a,(16,32));save(out,'piece-'+n)
  if a.width%48==0 and a.height%48==0:
   candidates=[k for k in names if k!=n and c.asset(k).size==a.size and k.split('-')[0]==n.split('-')[0] and not k.endswith(('slate','brown'))]
   donor=c.asset(candidates[0]) if candidates else a
   out=c.repeat(ground,(a.width*3,a.height+24))
   for j,b in enumerate([a,a,donor]):out.alpha_composite(b,(j*a.width,24))
   ImageDraw.Draw(out).text((2,4),'self / self / unlike: '+n,fill='black');save(out,'seam-'+n)
 for n in GROUND:
  a=c.asset(n);g=c.asset_path_grass() if n=='ditch-c3' else c.asset('cobble-c3');out=c.repeat(g,(a.width*3,a.height*3))
  for yy in range(3):
   for xx in range(3):out.alpha_composite(a,(xx*a.width,yy*a.height))
  save(out,'repeat-'+n)
 for n in ['planter-tree-c3','cart','crate','barrel','fence-0','fence-1','bench-pocket','yard-1','washing-line','court-closure-r']:
  a=c.asset(n);out=c.repeat(c.asset('workyard-c4'),(a.width+32,a.height+32));out.alpha_composite(a,(16,16));save(out,'retained-'+n)
 for family,ids,chosen in [('hip',['roof-hip-a','roof-hip-b'],'roof-hip-b'),('inn',['inn-front','inn-front-b'],'inn-front-b')]:
  pair([(i+(' SELECTED' if i==chosen else ' REJECTED'),Image.open(R/f'r17-C4-clean-{i}.png').convert('RGBA')) for i in ids],'selection-'+family)
 for family,ids,chosen in [('ridge',['ridge-a','ridge-b','ridge-c'],'ridge-a'),('junction',['junction-a','junction-b','junction-c'],'junction-c'),('west-wing',['west-wing-a','west-wing-b'],'west-wing-b'),('north-court',['north-shop-a','north-shop-b'],'north-shop-b')]:
  pair([(i+(' SELECTED' if i==chosen else ' REJECTED'),Image.open(R/f'r17-C4-clean-critic1-{i}.png').convert('RGBA')) for i in ids],'critic1-selection-'+family)
 ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
 for j,ground in enumerate(['baker','smith','apothecary']):
  sp=c.c4_spec(2,2,j,roof='roof-gable-c4-w2',returns=('right',));sp['panels'][0]='ground-'+ground+'-c4-w2'
  a,_=c.build_c(sp);pair([(ground+' / 2 storeys',a),('reference / house 2',ref)],'complete-house-'+ground)
 pair([('deep hip / 96x144',c.asset('roof-hip-c4-w2')),('companion / 48x144',c.asset('roof-gable-c4-w1')),('receiving junction',c.asset('roof-junction-c4')),('left return',c.asset('return-left-c4')),('right return',c.asset('return-right-c4'))],'roof-return-pilot')
 pair([(n,c.asset('sign-'+n+'-c4')) for n in ['baker','smith','apothecary','cobbler','inn','scribe','tailor','butcher']],'eight-signs')
 # Existing structural ground families remain available, with aligned courses.
 for kind in ['shop','door','arch','work']:
  pair([(kind+' '+str(j),c.asset('ground-'+kind+('' if j==0 else '-v'+str(j))+'-w2-c0')) for j in range(3)],'structural-'+kind)

def scenes():
 city=Image.open(R/'r17-city-final.png').convert('RGBA')
 crops={'square':(432,576,1392,1152),'street':(96,240,720,816),'gate-inn':(1104,720,1776,1440),'corner-court':(144,672,480,1056),'merchant-bend':(1200,240,1776,768),'property-sequence':(144,288,432,768),'south-property':(528,1008,720,1392)}
 for n,box in crops.items():
  a=city.crop(box);save(a,n,(1,3));save(a.convert('L'),n+'-squint',(1,));compare(a,n)
 audits={}
 for n,l in {**c.c4_proof_layouts(),**{'regression-'+n:l for n,l in c.e_layouts().items()}}.items():
  a,_,_=c.r_render(l) if n=='five-walls-offset-tower' else (*c.c_render(l),[])
  save(a,n,(1,3));save(a.convert('L'),n+'-squint',(1,));compare(a,n);audits[n]=c.c4_instance_audit(l)
 (R/'r17-C4-proof-audits.json').write_text(json.dumps(audits,indent=2))
 # Whole matched side/rear assemblies and explicit access cues.
 items=[]
 for title,sp in [('side west',dict(view='side',direction='W',depth=2,width=2,floors=2)),('side east',dict(view='side',direction='E',depth=2,width=2,floors=2)),('rear stair',dict(view='back',width=2,floors=2,back='stair')),('passage',c.make_spec(2,2,'arch',1,0,'ridge',['timber']))]:items.append((title,c.build_c(sp)[0]))
 pair(items,'side-rear-access')

def annotations():
 l=c.c4_city_layout();city=Image.open(R/'r17-city-final.png').convert('RGBA');out=city.copy();d=ImageDraw.Draw(out)
 for b in l['lots']+l['props']:
  if b.get('footprint'):
   x,y,w,h=b['footprint'];d.rectangle((x,y,x+w-1,y+h-1),outline='#4dddda')
  if b.get('entrance'):
   x,y=b['entrance'];d.ellipse((x-3,y-3,x+3,y+3),fill='#ffe533')
  for x,y,w,h in b.get('supports',[]):d.rectangle((x,y,x+w-1,y+h-1),outline='#ff5544')
  if b.get('foreground_mask'):
   a=c.r_prop_image(b);x,y=b['x'],b['base']-a.height;u,v,ww,hh=b['foreground_mask'];d.rectangle((x+u,y+v,x+ww-1,y+hh-1),outline='#cb8bff')
  if 'spec' in b:d.text((b['x']+2,b['base']-14),str(b['spec']['floors']),fill='white')
 for r in l['roads']:
  if r.get('clear'):
   x,y,w,h=r['rect'];d.rectangle((x,y,x+w-1,y+h-1),outline='#fff8dc')
 d.text((144,250),'CYAN footprints / digits storeys / YELLOW entries / RED supports / PURPLE overhead / WHITE routes',fill='black');save(out,'city-anchors',(1,))
 # Deliberate actors under the gate, at the inn landing and court threshold.
 proof=copy.deepcopy(l)
 for x,b,role in [(1240,1418,'under-gate'),(1232,1320,'gate-turn'),(1324,1092,'inn-entry'),(303,994,'court-entry')]:proof['props'].append(dict(file='person-porter-c4',x=x,base=b,role=role,id='proof-'+role))
 proof['props'].append(dict(file='cart',x=1224,base=1390,id='proof-gate-cart',footprint=[1224,1342,48,48]))
 normal,_,_=c.r_render(proof);reveal,_,_=c.r_render(proof,reveal=True)
 for n,box in [('gate',(1104,1152,1392,1440)),('inn',(1200,912,1584,1152)),('court',(240,864,384,1056)),('market',(912,744,1104,1008)),('wall-turn',(768,1200,960,1440))]:
  pair([('normal',normal.crop(box)),('reveal / supports stay',reveal.crop(box))],n+'-actor-reveal',(1,3))
 pair([('gate overhead',c.asset('gate-overhead-c4')),('ground supports',c.asset('gate-supports-c4')),('assembled',c.asset('gatehouse-c4'))],'gate-separated-art')
 (R/'r17-C4-actor-proof-layout.json').write_text(json.dumps(proof,indent=2))

def index():
 names=sorted(p.name for p in R.glob('r17-C4-*.png') if not any(t in p.name for t in ('source-','registered-','mode-','clean-','inspect','existing-study','house-pilot')))
 html='<!doctype html><meta charset="utf-8"><title>Round 17 C4 review</title><style>body{background:#272b25;color:#ddd;font:16px sans-serif}a{color:#bcdcbc}img{max-width:100%;image-rendering:pixelated}</style><h1>Round 17 C4</h1><p>48px native grid. Saved-art proofs; no runtime collision or independent panel approval claimed.</p><p><a href="r17-city-final.png">Final 1x</a> · <a href="r17-city-final-2x.png">Final 2x</a> · <a href="r17-city-final-squint.png">Greyscale</a> · <a href="r17-city-final-vs-r15-vs-today.png">Today / R15 / C4</a> · <a href="r17-C4-verification.json">Verification</a> · <a href="r17-C4-response.json">Fix list response</a></p><img src="r17-city-final.png"><ul>'
 html=html.replace('Fix list response</a></p>','Fix list response</a> · <a href="r17-C4-critic1-verification.json">Critic-1 repair checks</a> · <a href="r17-C4-critic1-generation.json">Redraw prompts and sources</a></p>')
 html+=''.join(f'<li><a href="{n}">{n}</a></li>' for n in names)+'</ul>'; (R/'r17-C4-review.html').write_text(html)
if __name__=='__main__':pieces();scenes();annotations();index();print('C4 review sheets complete')
