"""Saved-pixel checks and operator-D review sheets. All review images stay ignored."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,S,c
from d_review import metric
from check_proofs import components,light
from review_c9 import lone_pixels
from review_critic23 import master_reference
from d_layouts import MAPS
from draw_style_samples import SWATCHES

CAVES=['cave_rock','cave_crystal','cave_ice','cave_lava']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def companions(im,path):
 g=im.convert('L').convert('RGBA')
 return {'2x':Image.open(path.with_name(path.stem+'-2x.png')).convert('RGBA').tobytes()==im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST).tobytes(),'grey':Image.open(path.with_name(path.stem+'-grey.png')).convert('RGBA').tobytes()==g.tobytes(),'squint':Image.open(path.with_name(path.stem+'-squint.png')).convert('RGBA').tobytes()==g.resize((im.width//4,im.height//4),Image.Resampling.NEAREST).tobytes()}
def board(pic,name,station=False):
 im=pic.convert('RGB');w,h=im.size;master,_=master_reference(station)
 # Same art-pixel scale: registered master art pixels at 1x; native master PNG
 # crop (2x storage) is also placed next to our exact 2x art detail below.
 out=Image.new('RGB',(4*w+204,max(3*h+60,240+h*2)),'#252a36');d=ImageDraw.Draw(out)
 d.text((8,8),name+' / native, nearest 3x, grey, quarter-grey / master at matching art scale',fill='white')
 out.paste(im,(8,28));out.paste(im.resize((3*w,3*h),Image.Resampling.NEAREST),(w+20,28));out.paste(master,(4*w+32,28))
 g=im.convert('L');out.paste(g,(8,h+44));out.paste(g.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST),(8,2*h+52))
 out.save(REVIEW/f'D-final-{name}.png')
def detail(im,b,name):
 p=im.crop(b);w,h=p.size;master,_=master_reference(False)
 out=Image.new('RGB',(6*w+336,max(3*h+48,h+340)),'#252a36');d=ImageDraw.Draw(out);d.text((8,8),name+' / 1x, 2x, 3x; master 1x PNG beside 2x art',fill='white')
 x=8
 for z in (1,2,3):out.paste(p.resize((w*z,h*z),Image.Resampling.NEAREST),(x,28));x+=w*z+8
 out.paste(master.resize((288,288),Image.Resampling.NEAREST),(x,28));out.save(REVIEW/f'D-final-detail-{name}.png')

def run(render=True):
 before=json.loads((REVIEW/'D4-start/hashes.json').read_text());report={'cell_size':48,'files':{},'floor_tiles':{},'map_surface_tiles':{},'frames':{},'protected':{},'failures':[]}
 # Validate all production surface and prop sheets, plus all changed colour art.
 paths=list((BASE/'canon/surfaces').glob('*.png'))+list((BASE/'canon/props').glob('*.png'))
 paths += [BASE/f'{folder}/{n}.png' for n in CAVES for folder in ['proof','canon/swatches']]
 for p in paths:
  im=Image.open(p).convert('RGBA');m=metric(im);m['cap']=32 if '/surfaces/' in str(p) or '/swatches/' in str(p) else 48
  if '/proof/' in str(p):m['cap']=80
  m['pass']=not any(m[k] for k in ['soft_alpha','dirty_transparent','off_palette','black']) and all(v%48==0 for v in im.size) and m['colours']<=m['cap']
  if '/surfaces/' in str(p):
   m['tiles']=[dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))) for y in range(0,im.height,48) for x in range(0,im.width,48)]
   if max(t['percent'] for t in m['tiles'])>3:m['pass']=False
  report['files'][str(p.relative_to(BASE))]=m
  if not m['pass']:report['failures'].append(str(p.relative_to(BASE)))
 for n in S:
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGBA');vs=[light(p) for p in set(f.get_flattened_data())];small,_=components(f);tiles=[]
  for y in range(0,f.height,48):
   for x in range(0,f.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(f.crop((x,y,x+48,y+48)))))
  report['floor_tiles'][n]={'L_min':min(vs),'L_max':max(vs),'span':max(vs)-min(vs),'small_components':len(small),'tiles':tiles}
  if max(vs)-min(vs)>15 or small or max(t['percent'] for t in tiles)>3:report['failures'].append('floor '+n)
 layout=json.loads((BASE/'frames/layout.json').read_text())
 for n,cfg in MAPS.items():
  p=BASE/f'frames/{n}.png';im=Image.open(p).convert('RGBA');m=metric(im);m['companions']=companions(im,p)
  actual=[(o.get('source_item',o['item']),o['source']) for o in layout[n]['objects'] if o['group']=='reference'];expected=[(k,list(xy)) for k,ps in cfg['items'].items() for xy in ps]+[(('airlock-' if n=='station_lab' else 'door-')+state,[x,y]) for state,x,y in cfg['doors']]
  m['source_objects']=len(expected);m['source_positions_exact']=sorted(actual)==sorted(expected)
  names={o['item'] for o in layout[n]['objects']}
  m['required_items']={k:any(x in names for x in choices) for k,choices in {'open_door':['door-open','airlock-open'],'locked_door':['door-locked','airlock-locked'],'stairs':['stairs-up','stairs-down'],'trap':['trap-found'],'closed_chest':['chest'],'opened_chest':['chest-open'],'party':['party'],'red_foe':['foe']}.items()}
  if not all(m['required_items'].values()):report['failures'].append('required items '+n)
  m['pass']=m['source_positions_exact'] and all(m['companions'].values()) and not any(m[k] for k in ['soft_alpha','dirty_transparent','off_palette','black'])
  report['frames'][n]=m
  if not m['pass']:report['failures'].append('frame '+n)
  surface=Image.open(REVIEW/f'D-{n}-surface.png').convert('RGBA');tiles=[]
  for y in range(0,surface.height,48):
   for x in range(0,surface.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(surface.crop((x,y,x+48,y+48)))))
  report['map_surface_tiles'][n]={'maximum_percent':max(t['percent'] for t in tiles),'tiles':tiles}
  if max(t['percent'] for t in tiles)>3:report['failures'].append('map surface '+n)
  if render:
   board(im,n,n=='station_lab');print('Reviewed sheet',n,flush=True)
 for p,h in before.items():
  if p.startswith('frames/station_lab') or p=='frames/STORIES.md':report['protected'][p]=sha(BASE/p)==h
 if not all(report['protected'].values()):report['failures'].append('protected lab or STORIES')
 guide=Image.open(BASE/'canon/style-guide.png').convert('RGB');old=Image.open(REVIEW/'D4-start/canon/style-guide.png').convert('RGB');diff=ImageChops.difference(guide,old);inserts={}
 for n in CAVES:
  i=list(SWATCHES).index(n);x,y=48+i%7*240,800+i//7*94
  inserts[n]=guide.crop((x,y,x+48,y+48)).tobytes()==Image.open(BASE/f'canon/swatches/{n}.png').convert('RGB').tobytes();ImageDraw.Draw(diff).rectangle((x,y,x+47,y+47),fill=0)
 report['guide']={'inserts_exact':inserts,'outside_inserts_unchanged':diff.getbbox() is None}
 if diff.getbbox() or not all(inserts.values()):report['failures'].append('style guide')
 report['changed_files']=[p for p,h in before.items() if (BASE/p).exists() and sha(BASE/p)!=h]
 report['hoard_north_wall_overlay_removed']=ImageChops.difference(Image.open(BASE/'frames/hoard-keep.png').crop((450,50,600,185)),Image.open(REVIEW/'D-hoard-keep-surface.png').crop((450,50,600,185))).getbbox() is None
 if not report['hoard_north_wall_overlay_removed']:report['failures'].append('stray hoard coins')
 allowed={'NOTES.md','d0a-review.png','frames/layout.json','canon/style-guide.png'}
 allowed|={f'frames/{n}{suffix}.png' for n in MAPS if n!='station_lab' for suffix in ('','-2x','-grey','-squint')}
 allowed|={f'canon/surfaces/{n}-floor.png' for n in CAVES}|{f'canon/swatches/{n}.png' for n in CAVES}|{f'proof/{n}{suffix}.png' for n in CAVES for suffix in ('','-grey')}
 report['unexpected_existing_changes']=[p for p in report['changed_files'] if p not in allowed]
 if report['unexpected_existing_changes']:report['failures'].append('unexpected earlier-file changes')
 report['pass']=not report['failures'];(REVIEW/'D-final-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':report['pass'],'failures':report['failures'],'floor_span_max':max(v['span'] for v in report['floor_tiles'].values()),'map_lone':{n:v['maximum_percent'] for n,v in report['map_surface_tiles'].items()},'protected':report['protected']},indent=2),flush=True)
 if not render:return report
 for n in CAVES:
  for folder in ['canon/surfaces','proof','canon/swatches']:
   stem=n+'-floor' if folder.endswith('surfaces') else n
   pic=Image.open(BASE/f'{folder}/{stem}.png');board(pic,folder.replace('/','-')+'-'+n)
   detail(pic,(0,0,*pic.size),folder.replace('/','-')+'-'+n)
 # Every style-guide region is shown at native and exact 3x; no giant shrinking.
 for y in range(0,guide.height,288):board(guide.crop((0,y,guide.width,min(guide.height,y+288))),f'style-guide-{y}')
 crops={'hoard-keep':[(96,768,384,1008),(432,432,624,720)],'breach-temple':[(336,576,864,768),(912,384,1104,624)],'sanctum-crypt':[(192,288,720,864)],'cave_rock-plain-21':[(576,288,960,576),(1152,576,1440,768)],'manor-ground':[(720,144,1080,384),(1056,480,1344,816),(1824,240,1968,864)],'station_lab':[(504,120,816,312)]}
 for n,bs in crops.items():
  im=Image.open(BASE/f'frames/{n}.png')
  for i,b in enumerate(bs):detail(im,b,n+'-'+str(i))
 ims=[Image.open(BASE/f'frames/{n}.png') for n in MAPS];w=sum(i.width for i in ims)+168;h=max(i.height for i in ims)+288
 contact=Image.new('RGB',(((w+47)//48)*48,((h+47)//48)*48),'#1c222e');d=ImageDraw.Draw(contact);d.fontmode='1';x=24
 for n,im in zip(MAPS,ims):d.text((x,12),n,fill='#c8c0af');contact.paste(im,(x,36));x+=im.width+24
 y=max(i.height for i in ims)+84
 for i,n in enumerate(S):d.text((24+i*192,y-20),n,fill='#c8c0af');contact.paste(Image.open(BASE/f'proof/{n}.png'),(24+i*192,y))
 contact.save(BASE/'d0a-review.png')
 # A compact quarter-grey review is the only intentional spatial reduction.
 sheet=Image.new('RGB',(1152,1152),'#252a36');d=ImageDraw.Draw(sheet);x=y=12;rh=0
 for n in MAPS:
  sq=Image.open(BASE/f'frames/{n}-squint.png')
  if x+sq.width>1152:x=12;y+=rh+36;rh=0
  d.text((x,y),n,fill='white');sheet.paste(sq,(x,y+20));x+=sq.width+16;rh=max(rh,sq.height)
 sheet.save(REVIEW/'D-final-squints.png');return report
if __name__=='__main__':
 import sys
 run('--checks-only' not in sys.argv)
