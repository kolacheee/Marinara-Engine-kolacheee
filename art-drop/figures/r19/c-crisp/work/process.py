"""Key, reduce, assign material palette, align, assemble and verify. No drawing edits."""
from pathlib import Path
from collections import deque, Counter
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'out'
RAMPS = {
 'skin': ['593B36','B78168','E2B68E'],
 'dark_skin': ['211E26','503733','865848'],
 'green': ['202F2B','435B3E','75835A'],
 'auburn': ['38262A','764333','AC7049'],
 'wood': ['30282A','644737','97704C'],
 'cream': ['514A41','AAA08A','DED2AE'],
 'blue': ['1D263B','304D70','66829A'],
 'gold': ['55412C','A08346','D4B96D'],
 'iron': ['293039','626F76','A4B2B4'],
 'black': ['1C1D25','34343C','55515A']}
RAMPS = {k:[tuple(bytes.fromhex(c)) for c in v] for k,v in RAMPS.items()}
# The historical PROTOS file is absent from this folder. These explicit source
# prototypes compensate for the warm generated pixels; targets remain exact.
EXTRA = {
 'skin': ['604135','BA815C','E6AA7B'],
 'cream': ['6D6551','A99C78','E2D2A3'],
 'green': ['26362C','4C5B39','7B8654'],
 'auburn': ['412B24','82462C','AC7049'],
 'wood': ['382A26','6C4832','9B7047'],
 'iron': ['30373B','697377','ABB5B4'],
 'gold': ['59462C','AA8744','D4B96D']}

def key(c):
 r,g,b=c[:3]
 return r>80 and b>60 and r>1.6*g and b>1.6*g and b>.55*r and r>.65*b

def process(name, version):
 src = OUT/'test-big'/f'{name}-{version}.png'
 im=Image.open(src).convert('RGB')
 mask=Image.new('L',im.size);mask.putdata([0 if key(c) else 255 for c in im.get_flattened_data()])
 box=mask.getbbox();crop=im.crop(box);w=round(crop.width*92/crop.height)
 reduced=crop.resize((w,92),Image.Resampling.NEAREST)
 pixels=list(reduced.get_flattened_data());opaque=[not key(c) for c in pixels]
 materials=[-1]*len(pixels);tones=[0]*len(pixels)
 mats=['skin','green','wood','cream']
 if name.startswith('innkeeper'): mats+=['auburn','iron','gold']
 prototypes=[]
 for mi,m in enumerate(mats):
  for ti,c in enumerate(RAMPS[m]): prototypes.append((mi,ti,c))
  for ti,c in enumerate(EXTRA.get(m,[])): prototypes.append((mi,ti,tuple(bytes.fromhex(c))))
  if m=='green': prototypes.append((mi,1,(56,70,44)))
  if m=='iron':
   prototypes.append((mi,1,(80,91,97)))
   prototypes.append((mi,1,(65,74,78)))
 q=deque()
 for y in range(92):
  for x in range(w):
   i=y*w+x
   if not opaque[i] or max(pixels[i])<56: continue
   allowed=set(mats)
   allowed.discard('iron')
   if name.startswith('innkeeper'):
    if y<30:
     allowed={'skin'}
     # Brown facial hair only; bald scalp shadow must stay skin.
     if name.endswith('side'):
      if x>w*.50 and 10<=y<=29: allowed.add('auburn')
     elif 11<=y<=29: allowed.add('auburn')
    elif y>=39: allowed.discard('auburn')
    if y>=76: allowed={'wood','cream'}
    # Gold is restricted to waistcoat buttons, not shirt or apron edges.
    button_x = x>w*.50 if name.endswith('side') else abs(x-w*.50)<w*.13
    if not (button_x and 34<=y<=48): allowed.discard('gold')
    r,g,b=pixels[i]
    if 33<=y<=75 and r>130 and 0<=r-g<32 and 0<=g-b<52:
     allowed={'cream'}
    # Cool neutral mug body/rim maps to iron, not cream shadow.
    r,g,b=pixels[i]
    mug_x = x>w*.73 if name.endswith('side') else w*.56<=x<=w*.83
    mug_y = 43<=y<=57 if name.endswith('side') else 45<=y<=59
    if mug_x and mug_y and abs(r-g)<28 and abs(g-b)<28:
     allowed={'iron'}
   else:
    if y<31: allowed={'skin','cream'}
    if y>=70: allowed={'green','wood'}
   r,g,b=pixels[i]
   if y>=31 and g>r+2 and g>b+3 and 'green' in allowed:
    allowed={'green'}
   options=[p for p in prototypes if mats[p[0]] in allowed]
   p=min(options,key=lambda p:sum((pixels[i][c]-p[2][c])**2 for c in range(3)))
   materials[i],tones[i]=p[:2];q.append((y,x))
 while q:
  y,x=q.popleft()
  for ny,nx in ((y-1,x),(y,x-1),(y,x+1),(y+1,x)):
   if 0<=ny<92 and 0<=nx<w:
    j=ny*w+nx
    if opaque[j] and materials[j]<0:
     materials[j]=materials[y*w+x];tones[j]=0;q.append((ny,nx))
 assert all(materials[i]>=0 for i,v in enumerate(opaque) if v), 'Unclassified isolated dark component'
 sprite=Image.new('RGBA',(w,92))
 sprite.putdata([RAMPS[mats[materials[i]]][tones[i]]+(255,) if v else (0,0,0,0) for i,v in enumerate(opaque)])
 if name.endswith('side'):
  headx=[i%w for i,v in enumerate(opaque[:31*w]) if v]
  headmid=(min(headx)+max(headx))/2;left=round(48-headmid)
 else: left=(96-w)//2
 assert left>=0 and left+w<=96
 frame=Image.new('RGBA',(96,128));frame.paste(sprite,(left,33))
 frame.save(OUT/f'test-{name}.png')
 data=list(frame.get_flattened_data());colors={c[:3] for c in data if c[3]}
 master={c for ramp in RAMPS.values() for c in ramp}
 assert frame.size==(96,128) and {c[3] for c in data}=={0,255}
 assert colors<=master and len(colors)<=32
 assert (frame.getbbox()[1],frame.getbbox()[3])==(33,125)
 assert all(c==(0,0,0,0) for c in data if not c[3])
 return {'source':str(src.relative_to(ROOT)),'source_size':im.size,'source_bbox':box,
  'reduced_size':[w,92],'frame_offset':[left,33],'bbox':frame.getbbox(),
  'colors':len(colors),'palette':[bytes(c).hex() for c in sorted(colors)],
  'alpha_values':[0,255],'occupied_rows':[33,124]}

def assemble(names):
 bg=Counter(Image.open(ROOT/'STYLE-SHEET.png').convert('RGB').get_flattened_data()).most_common(1)[0][0]
 refs=[(f'{n.upper()} / {v}',ROOT/'ref-sprites'/f'{n}-{v}.png') for n in ['wren','hadrik','noble'] for v in ['front','side']]
 tests=[(n.upper().replace('-',' / '),OUT/f'test-{n}.png') for n in names]
 entries=refs+tests
 cell=308; margin=20; top=52
 sheet=Image.new('RGB',(margin*2+cell*len(entries),top+384+20),bg)
 draw=ImageDraw.Draw(sheet);font=ImageFont.load_default(size=18)
 for i,(label,path) in enumerate(entries):
  x=margin+i*cell
  draw.text((x+144,18),label,font=font,fill=(39,47,50),anchor='mt')
  im=Image.open(path).convert('RGBA').resize((288,384),Image.Resampling.NEAREST)
  sheet.paste(im,(x,top),im)
 sheet.save(OUT/'test-strip.png')
 # Full-resolution sections preserve the strip's exact 3x scale during inspection.
 for i in range(2): sheet.crop((i*1540,0,min((i+1)*1540+40,sheet.width),sheet.height)).save(OUT/'work'/f'strip-section-{i+1}.png')
 native=Image.new('RGB',(96*len(tests),128),bg)
 for i,(_,path) in enumerate(tests):
  im=Image.open(path);native.paste(im,(96*i,0),im)
 native.save(OUT/'work'/'native.png')
 for label,path in tests:
  im=Image.open(path); panel=Image.new('RGBA',im.size,bg+(255,));panel.alpha_composite(im)
  panel.convert('RGB').resize((576,768),Image.Resampling.NEAREST).save(OUT/'work'/f'{path.stem}-6x.png')
 return {'background_rgb':bg,'strip_size':sheet.size,'scale':3,'order':[v[0] for v in entries]}

if __name__=='__main__':
 import sys
 versions=json.loads((OUT/'work'/'selected.json').read_text())
 checks={name:process(name,version) for name,version in versions.items()}
 for character in ['innkeeper','elder']:
  cc=set()
  for name in versions:
   if name.startswith(character): cc.update(checks[name]['palette'])
  assert len(cc)<=32
  checks[f'{character}_total_colors']=len(cc)
 if len(versions)==4: checks['assembly']=assemble(list(versions))
 (OUT/'work'/'checks.json').write_text(json.dumps(checks,indent=2)+'\n')
 print(json.dumps(checks,indent=2))
