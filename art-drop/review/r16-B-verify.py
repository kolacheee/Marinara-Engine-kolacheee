"""Replays source modes and validates delivered Part B PNGs and review proofs."""
from pathlib import Path
from PIL import Image,ImageDraw
from collections import Counter
import importlib.util,hashlib,json
import numpy as np

R=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('build',R/'r16-B-build.py');b=importlib.util.module_from_spec(s);s.loader.exec_module(b)
m=json.loads((R/'r16-B-measurements.json').read_text());checks=[]
def check(name,value):
 checks.append({'check':name,'pass':bool(value)})
 if not value:print('FAIL:',name)

mode_blocks=0;cleanup_pixels=0
for family,variants in m['drawings'].items():
 for var,records in variants.items():
  for i,rec in enumerate(records):
   stem=f'{family}-{var}-{i}';reg=Image.open(R/f'r16-B-registered-{stem}.png');mode=Image.open(R/f'r16-B-mode-{stem}.png');clean=Image.open(R/f'r16-B-clean-{stem}.png')
   w,h=mode.size;rp=list(reg.getdata());actual=list(mode.getdata());expected=[]
   for y in range(h):
    for x in range(w):
     votes=Counter(rp[(y*8+sy)*w*8+x*8+sx] for sy in range(8) for sx in range(8))
     expected.append(min(votes,key=lambda p:(-votes[p],p)))
   check(stem+' every 64-sample RGBA mode',expected==actual);mode_blocks+=w*h
   check(stem+' hard working alpha',set(reg.getchannel('A').getdata())<=set([0,255]))
   repaired=actual.copy()
   for j in rec['removed_indices']:repaired[j]=(0,0,0,0)
   cleanup_pixels+=len(rec['removed_indices']);check(stem+' cleanup replay',list(clean.getdata())==repaired)

parts={'fog':[],'heat_wave':[]}
for i in range(6):
 a=np.array(Image.open(R/f'r16-B-clean-fog-b-{i}.png'));a,changed=b.soften_drawn_contour(a)
 check(f'fog donor {i} contour replay',changed==m['fog_contour_recolours'][i]);parts['fog'].append(b.rgba_weather(a,'fog'))
for i in range(8):parts['heat_wave'].append(b.rgba_weather(np.array(Image.open(R/f'r16-B-clean-heat-a-{i}.png')),'heat'))

frames={};hashes={};details={}
for family in ['fog','heat_wave']:
 ff=[]
 for f in range(4):
  name=f'{family}-f{f}.png';im=Image.open(b.OUT/name);a=np.array(im);ff.append(a)
  hashes[name]=hashlib.sha256((b.OUT/name).read_bytes()).hexdigest()
  check(name+' size and RGBA',im.size==(192,192) and im.mode=='RGBA')
  check(name+' measurements',b.stats(a)==m['files'][name])
  check(name+' palette',set(map(tuple,a.reshape(-1,4)))<=set([(0,0,0,0)]+[(*rgb,aa) for rgb,aa in zip(b.PALETTES['fog' if family=='fog' else 'heat'],b.ALPHAS['fog' if family=='fog' else 'heat'])]))
  check(name+' no hidden RGB',not np.any(a[a[:,:,3]==0,:3]))
  check(name+' drawn placement replay',np.array_equal(a,b.render(parts[family],m['instances'][family],f)))
  # Render drawn particles on a large unwrapped plane, independent of modulo stamps.
  check(name+' independent unwrapped 3x3 equals repeat',np.array_equal(np.tile(a,(3,3,1)),b.render(parts[family],m['instances'][family],f,576,True)))
  _,removed,_=b.components(a,3,True);check(name+' no isolated 1/2-pixel components',not removed)
  cover=(a[:,:,3]>0).mean();check(name+' requested coverage',(.35<=cover<=.55) if family=='fog' else (0<cover<=.10))
  subperiods=[(axis,k) for axis in (0,1) for k in range(1,192) if 192%k==0 and np.array_equal(a,np.roll(a,k,axis))]
  check(name+' no exact shorter subperiod',not subperiods)
 frames[family]=ff
 check(family+' four distinct frames',len({a.tobytes() for a in ff})==4)
 check(family+' exact fourth-advance closure',np.array_equal(ff[0],b.render(parts[family],m['instances'][family],4)))
 steps=[]
 for f in range(4):
  delta=np.abs(ff[f][:,:,3].astype(int)-ff[(f+1)%4][:,:,3].astype(int));steps.append(float(delta.mean()))
  check(family+f' transition {f} -> {(f+1)%4} small delta',delta.mean()<3)
 check(family+' wrap transition comparable to others',max(steps)/min(steps)<1.25)
 details[family]={'mean_absolute_alpha_steps':steps,'max_fraction_of_full_opacity':max(steps)/255}

masks=[]
for i in range(4):
 mask,path=b.wrap_mask(np.array(Image.open(R/f'r16-B-clean-edge-b-{i}.png')));masks.append(mask)
 check(f'edge mask {i} drawn quilt replay',path==m['edge_quilt_paths'][i])
edges,caps=b.edges_from_field(frames['fog'][0],masks)
for k,a in edges.items():
 name=f'fog-edge-{k}.png';im=Image.open(b.OUT/name);delivered=np.array(im);hashes[name]=hashlib.sha256((b.OUT/name).read_bytes()).hexdigest()
 check(name+' exact drawn cap and cleanup replay',np.array_equal(a,delivered))
 check(name+' measurements',b.stats(a)==m['files'][name])
 check(name+' size',im.size==((192,48) if k in 'ns' else (48,192)))
 outer={'n':a[0,:,3],'s':a[-1,:,3],'e':a[:,-1,3],'w':a[:,0,3]}[k]
 inner={'n':caps[k][-3:,:],'s':caps[k][:3,:],'e':caps[k][:,:3],'w':caps[k][:,-3:]}[k]
 check(name+' completely clear outermost row/column',not np.any(outer))
 check(name+' inner 3 pixels preserve fog exactly',np.all(inner==255))
 _,removed,_=b.components(a,3,True);check(name+' no isolated 1/2-pixel components',not removed)
 for f,field in enumerate(frames['fog']):
  continuation={'n':field[189:192,:],'s':field[:3,:],'e':field[:,:3],'w':field[:,189:192]}[k]
  edgeinner={'n':a[-3:,:],'s':a[:3,:],'e':a[:,:3],'w':a[:,-3:]}[k]
  check(name+f' exact 3-pixel continuation f{f}',np.array_equal(continuation,edgeinner))

refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(b.REF.glob('ref-*.png'))}
proofs=0
for family,ff in frames.items():
 for f,a in enumerate(ff):
  for name,ref in refs.items():
   expected=b.composite(b.tiled_ref(ref,(576,576)),np.tile(a,(3,3,1)))
   for scale in (1,3,4):
    path=R/f'r16-B-repeat-{family}-f{f}-{name}-{scale}x.png';im=Image.open(path)
    check(path.name+' literal native repeat / NN enlargement',im.tobytes()==expected.resize((576*scale,576*scale),b.NN).tobytes());proofs+=1
  base=refs['fantasy-town' if family=='fog' else 'desert-sand'].crop((0,0,192,192));original=b.composite(base,a)
  sheet=Image.open(R/f'r16-B-file-{family}-f{f}.png')
  check(f'{family}-f{f} sheet 1x',sheet.crop((12,32,204,224)).tobytes()==original.tobytes())
  check(f'{family}-f{f} sheet 4x',sheet.crop((220,32,988,800)).tobytes()==original.resize((768,768),b.NN).tobytes())
for k,a in edges.items():
 w,h=a.shape[1],a.shape[0];original=b.composite(refs['fantasy-grass'].crop((0,0,w,h)),a);sheet=Image.open(R/f'r16-B-file-fog-edge-{k}.png')
 check(f'edge {k} sheet 1x',sheet.crop((12,32,12+w,32+h)).tobytes()==original.tobytes())
 check(f'edge {k} sheet 4x',sheet.crop((w+28,32,w*5+28,h*4+32)).tobytes()==original.resize((w*4,h*4),b.NN).tobytes())

area=[]
for f,field in enumerate(frames['fog']):
 a=b.area_overlay(field,edges,caps);area.append(a)
 check(f'area f{f} two by two exact core',np.array_equal(a[96:480,96:480],np.tile(field,(2,2,1))))
 check(f'area f{f} clear margin',not np.any(a[:48]) and not np.any(a[528:]) and not np.any(a[:,:48]) and not np.any(a[:,528:]))
 for name,ref in refs.items():
  if f==0:
   original=b.composite(b.tiled_ref(ref,(576,576)),a)
   for scale in (1,4):check(f'area {name} {scale}x',Image.open(R/f'r16-B-fog-area-{name}-{scale}x.png').tobytes()==original.resize((576*scale,576*scale),b.NN).tobytes())

for family,ff in frames.items():
 source=[]
 for f,a in enumerate(ff):
  im=Image.new('RGB',(1152,624),(28,32,38));d=ImageDraw.Draw(im)
  for j,(name,ref) in enumerate(refs.items()):
   x=j%4*288;y=j//4*312;im.paste(b.composite(ref,np.tile(a,(2,2,1))[:288,:288]),(x,y+24));d.text((x+5,y+6),name,fill='white')
  d.text((876,362),f'{family} / f{f}\n4 frames, 360 ms each\nActual PNG states\n192 px spatial period',fill='white');source.append(im)
 pal=source[0].quantize(256,method=Image.Quantize.MEDIANCUT);gif=Image.open(R/f'r16-B-{family}.gif')
 check(family+' GIF four frames / infinite loop',gif.n_frames==4 and gif.info['loop']==0)
 for f in range(4):
  gif.seek(f);expected=source[f].quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
  check(family+f' GIF phase {f} equals actual PNG composite',gif.convert('RGB').tobytes()==expected.tobytes())
  check(family+f' GIF phase {f} timing',gif.info['duration']==360)
source=[b.composite(b.tiled_ref(refs['fantasy-town'],(576,576)),a) for a in area]
pal=source[0].quantize(256,method=Image.Quantize.MEDIANCUT);gif=Image.open(R/'r16-B-fog-area.gif')
check('fog area GIF four frames / infinite loop',gif.n_frames==4 and gif.info['loop']==0)
for f in range(4):
 gif.seek(f);check(f'fog area GIF phase {f}',gif.convert('RGB').tobytes()==source[f].quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB').tobytes())

before=json.loads((R/'r16-B-before.json').read_text());changed=[]
for path,sha in before.items():
 p=b.ROOT.parent/path
 if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=sha:changed.append(path)
check('all pre-existing art/reference/review files preserved',not changed)
result={'passed':all(c['pass'] for c in checks),'checks_passed':sum(c['pass'] for c in checks),'checks_total':len(checks),'mode_blocks_replayed':mode_blocks,'source_samples_replayed':mode_blocks*64,'source_cleanup_pixels':cleanup_pixels,'fog_contour_recolours':sum(map(len,m['fog_contour_recolours'])),'edge_cleanup_pixels':sum(map(len,m['edge_cleanup_removed'].values())),'repeat_proofs':proofs,'preserved_files':len(before),'changed_protected_files':changed,'motion_details':details,'final_sha256':hashes,'checks':checks}
(R/'r16-B-validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ('checks','final_sha256')},indent=2))
if not result['passed']:raise SystemExit(1)
