"""Validate saved sheets and composites, without modifying the artwork."""
import sys
sys.dont_write_bytecode = True
import json
from collections import Counter
from PIL import Image, ImageSequence
from template import OUT,SCRATCH,LAYERS,DIRECTIONS,N4,POSES
from compose import CHARACTERS,compose,cell,stack_names,rgba,strip
R=json.loads((OUT/'ramps.json').read_text())
LOG=[];FAIL=[]
def report(s):LOG.append(s);print(s)
def require(ok,message):
 if not ok:FAIL.append(message)
def luminosity(hex):
 s=[v/255 for v in bytes.fromhex(hex[1:])];lin=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in s]
 return sum(a*b for a,b in zip(lin,(.2126,.7152,.0722)))
def pixels(im):return list(im.get_flattened_data())
SOURCE={n:set(map(rgba,r)) for n,r in (R['source']|R['fixed']).items()}
ALL=set().union(*SOURCE.values())
INKS={rgba(r[0]) for r in (R['source']|R['fixed']).values()}
ALL_TARGET=set(ALL);ALL_INKS=set(INKS)
for n,rs in R['targets'].items():
 for ramp in (rs if isinstance(rs,list) else rs.values()):ALL_TARGET.update(map(rgba,ramp));ALL_INKS.add(rgba(ramp[0]))
ROLE={rgba(c):(n,i) for n,r in (R['source']|R['fixed']).items() for i,c in enumerate(r)}
ALLOWED={'body':['skin','eyes','linen','leather'],'outfit':['clothA','clothB','leather','gold','garnet','linen'],'hair':['hair','gold'],'beard':['hair','gold'],'head':['clothA','clothB'],'held':['wood','gold','garnet']}
def metric(im,inks=ALL_INKS):
 p=im.load();w,h=im.size;opaque={(x,y) for y in range(h) for x in range(w) if p[x,y][3]}
 edge=[(x,y) for x,y in opaque if any((x+dx,y+dy) not in opaque for dx,dy in N4)]
 missing=[(x,y) for x,y in edge if p[x,y] not in inks]
 blocks=[(x,y) for x,y in opaque if x<w-1 and y<h-1 and p[x,y] in inks and all(p[x+dx,y+dy]==p[x,y] for dx,dy in ((1,0),(0,1),(1,1)))]
 return missing,blocks,len(edge)
def lone_metric(im,name):
 p=im.load();w,h=im.size;total=0;lone=0;exempt=0
 for y in range(h):
  for x in range(w):
   col=p[x,y]
   if not col[3]:continue
   total+=1
   if any(0<=x+dx<w and 0<=y+dy<h and p[x+dx,y+dy]==col for dx,dy in N4):continue
   region,index=ROLE[col];xx=x%32;yy=y%48;direction=y//48;f=x//32;dy=POSES[f]['dy'] if direction==0 else 0
   # Only exemptions explicitly in the brief. Semé is a cloth-A light dot.
   face_mark=region=='skin' and index==1 and ((direction==0 and ((xx,yy-dy)==(16,10) or yy-dy==12 and xx in (15,16))) or direction in (1,2) and yy==12 and xx in (12,19))
   mouth=region=='hair' and index==0 and yy-dy==12 and xx in (12,15,16,19)
   seme='mage' in name and region=='clothA' and index==3 and yy in range(21,42) and yy%4==1 and xx%4==(yy//4%2)*2
   if region in ('eyes','gold','garnet') or face_mark or mouth or seme:exempt+=1
   else:lone+=1
 return lone/total*100 if total else 0,lone,total,exempt

def main():
 entries=[c for r in (R['source']|R['fixed']).values() for c in r]
 require(len(entries)==len(set(entries)),'source/fixed hex collision')
 all_ramps=list((R['source']|R['fixed']).values())+[r for rs in R['targets'].values() for r in (rs if isinstance(rs,list) else rs.values())]
 for r in all_ramps:
  rgb=bytes.fromhex(r[0][1:]);require(luminosity(r[0])<=.07,f'ink too light {r[0]}');require(max(rgb)-min(rgb)>=12,f'neutral ink {r[0]}')
  for c in r:
   rgb=bytes.fromhex(c[1:]);require(c!='#000000' and not(max(rgb)<80 and max(rgb)-min(rgb)<12),f'neutral near-black {c}')
 report(f'RAMPS: {len(entries)} unique source/fixed colours; {len(all_ramps)} ramps; max ink luminance {max(luminosity(r[0]) for r in all_ramps):.5f}; coloured inks PASS.')
 for name in LAYERS:
  before=len(FAIL);im=Image.open(OUT/(name+'.png')).convert('RGBA');group=name.split('/')[0]
  allowed=set().union(*(SOURCE[n] for n in (['skin'] if name.endswith('elf-ears') else ['horn']) if n in SOURCE)) if group=='feature' else set().union(*(SOURCE[n] for n in ALLOWED[group]))
  require(im.size==(128,192),f'{name}: dimensions');off=sum(p[3] and p not in allowed for p in pixels(im));semi=sum(p[3] not in (0,255) for p in pixels(im));require(not off,f'{name}: off-palette {off}');require(not semi,f'{name}: semi-alpha')
  missing=blocks=edges=0
  for d in range(4):
   for f in range(4):
    tile=cell(name,d,f);m,b,e=metric(tile);missing+=len(m);blocks+=len(b);edges+=e
    if group=='body':
     x0,y0,x1,y1=tile.getbbox();height=y1-y0;centre=(x0+x1-1)/2
     require(y1==48 and 43<=height<=45 and 40<=height<=46 and abs(centre-15.5)<=1,f'{name}: body bbox d{d}f{f} {tile.getbbox()}')
    if d and f:require(tile.tobytes()==cell(name,d,0).tobytes(),f'{name}: non-down repeated frame mismatch')
  require(not blocks,f'{name}: {blocks} ink blocks');require(not missing,f'{name}: {missing} nonink outer-edge pixels')
  # Individual overlay edges may be interior after composition: report both; every composite rim is enforced below.
  ratio,lone,total,exempt=lone_metric(im,name);require(ratio<3,f'{name}: lone {ratio:.3f}%')
  if name=='beard/full':require(all(not cell(name,3,f).getbbox() for f in range(4)),'unused up beard cells not transparent')
  require(cell(name,2,0).tobytes()==cell(name,1,0).transpose(Image.Transpose.FLIP_LEFT_RIGHT).tobytes(),name+': right not mirrored left')
  report(f'LAYER {name}: {"PASS" if before==len(FAIL) else "FAIL"}; 128x192; off={off}; semi={semi}; lone={ratio:.2f}% ({lone}/{total}, exempt={exempt}); ink2x2={blocks}; overlay-edge nonink={missing}.')
 # Test all requested interactions with both body templates and every direction/frame.
 fit_count=0;coverage=0;face=0;feature_count=0
 for body in ('man','woman'):
  for outfit in ('labourer','ranger','mage'):
   for d in range(4):
    for f in range(4):
     c=dict(CHARACTERS[0],body=body,outfit=outfit,hair='short');im=compose(c,d,f,False)
     m,b,e=metric(im,INKS);require(not m and not b,f'fit {body}/{outfit}/{d}/{f}: rim={m}, blocks={b}');fit_count+=1
     # Every source linen pixel is covered by the outfit; forearms, face and shoes are intentional.
     leaks=[(x,y) for y in range(48) for x in range(32) if im.getpixel((x,y)) in SOURCE['linen']]
     require(not leaks,f'linen poke-through {body}/{outfit}/{d}/{f}: {leaks}');coverage+=1
     if outfit in ('ranger','mage') or body=='man':
      calf_leaks=[(x,y) for y in range(34,48) for x in range(11,21) if im.getpixel((x,y)) in SOURCE['skin']]
      require(not calf_leaks,f'bare calf under garment {body}/{outfit}/{d}/{f}: {calf_leaks}')
  for hair in ('short','long','braid'):
   for feature in ('hood','elf-ears','horns'):
    for d in range(4):
     for f in range(4):
      c=dict(CHARACTERS[0],body=body,hair=hair)
      if feature=='hood':c['hood']=True
      else:c['feature']=feature
      im=compose(c,d,f,False);m,b,e=metric(im,INKS)
      require(not m and not b,f'head fit {body}/{hair}/{feature}/{d}/{f}: rim={m}, blocks={b}');fit_count+=1
      if d==0:
       dy=POSES[f]['dy']
       for x in (14,17):require(im.getpixel((x,8+dy))==rgba(R['source']['eyes'][0]) and im.getpixel((x,9+dy))==rgba(R['source']['eyes'][1]),f'eye obscured {body}/{hair}/{feature}/{f}/{x}')
       face+=1
      if feature!='hood':
       feature_layer=cell('feature/'+feature,d,f);visible=sum(p[3] and p==q for p,q in zip(pixels(feature_layer),pixels(im)))
       require(visible>=8,f'feature hidden {body}/{hair}/{feature}/{d}/{f}');feature_count+=1
      # Every hairstyle contacts the skull in the crown, without a transparent crack.
      bald=cell('body/'+body,d,f);hm=cell('hair/'+hair,d,f);overlap=sum(p[3] and q[3] for p,q in zip(pixels(bald),pixels(hm)))
      require(overlap>=10,f'hair gap {body}/{hair}/{d}/{f}')
 # Grip follows the actual body mitten, and E2 stays reserved.
 for d,x in enumerate((9,14,17,22)):
  for f in range(4):
   ay=POSES[f]['arms'][0] if d==0 else 0
   im=compose(CHARACTERS[2],d,f,False)
   require(im.getpixel((x,31+ay)) in SOURCE['skin'],f'staff grip missing d{d}f{f}')
   require(not cell('held/staff',d,f).getpixel((x,31+ay))[3],f'staff paints over hand d{d}f{f}')
 for name in LAYERS:require(rgba(R['source']['eyes'][2]) not in pixels(Image.open(OUT/(name+'.png'))),name+': reserved E2 used')
 # Every demonstration character in every direction and walk phase.
 for i,c in enumerate(CHARACTERS):
  before=len(FAIL);rim=blocks=edges=0;source_sheet=Image.new('RGBA',(128,192))
  for d in range(4):
   for f in range(4):
    im=compose(c,d,f);source_sheet.paste(compose(c,d,f,False),(f*32,d*48));m,b,e=metric(im);rim+=len(m);blocks+=len(b);edges+=e
    require(not m and not b,f'character {i+1} d{d}f{f}: rim={m}, blocks={b}')
    require(all(p[3] in (0,255) and (not p[3] or p in ALL_TARGET) for p in pixels(im)),f'character {i+1}: palette/alpha')
  ratio,lone,total,exempt=lone_metric(source_sheet,'composite/'+c['outfit']);require(ratio<3,f'character {i+1}: lone pixels {ratio:.2f}%')
  report(f'CHARACTER {i+1}: {"PASS" if before==len(FAIL) else "FAIL"}; 16 cells; ink rim={edges-rim}/{edges}; ink2x2={blocks}; lone={ratio:.2f}%; exact target palettes.')
 report(f'FIT: {fit_count} combinations; {coverage} outfit coverage tests; {face} two-eye tests; {feature_count} feature visibility tests; crown overlaps and right mirrors checked.')
 expected={'lineup':(928,504),'turn':(608,192),'walk':(608,384),'swatch':(624,200)}
 backgrounds={rgba(c) for c in ('#7a7a7a','#3a3129','#252035')}
 for name,size in expected.items():
  im=Image.open(OUT/(name+'.png')).convert('RGBA');before=len(FAIL)
  require(im.size==size,f'{name}: dimensions {im.size}');off=sum(p not in ALL_TARGET|backgrounds for p in pixels(im));require(not off,f'{name}: off palette {off}');require(all(p[3]==255 for p in pixels(im)),f'{name}: composite background alpha')
  report(f'COMPOSITE {name}.png: {"PASS" if before==len(FAIL) else "FAIL"}; {im.width}x{im.height}; off={off}; opaque backgrounds; source cells validated above.')
 gif=Image.open(OUT/'walk.gif');require(gif.n_frames==4 and gif.info.get('loop')==0,'GIF frame/loop settings')
 durations=[]
 for f in range(gif.n_frames):
  gif.seek(f);durations.append(gif.info['duration']);require(gif.info['duration']==160,'GIF duration')
  expected_frame=strip([compose(c,0,f) for c in CHARACTERS[:2]],'#7a7a7a',4).convert('RGB')
  require(gif.convert('RGB').tobytes()==expected_frame.tobytes(),f'GIF palette changed pixels in frame {f}')
 require(gif.size==(288,192),'GIF size')
 report(f'COMPOSITE walk.gif: {gif.n_frames} frames; {gif.size[0]}x{gif.size[1]}; {durations} ms; loop=0; fixed exact palette.')
 report('Unused cells: only beard up row; transparent. All other cells intentionally populated.')
 if FAIL:
  report(f'RESULT: FAIL ({len(FAIL)} failures)')
  for error in FAIL:report('  '+error)
 else:report('RESULT: PASS (0 failures)')
 (SCRATCH/'check-report.txt').write_text('\n'.join(LOG)+'\n')
 return bool(FAIL)
if __name__=='__main__':raise SystemExit(main())
