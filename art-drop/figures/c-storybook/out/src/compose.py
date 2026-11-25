"""Exact palette swaps and runtime-order composition. python3 out/src/compose.py"""
import sys
sys.dont_write_bytecode = True
from pathlib import Path
from PIL import Image, ImageDraw
import json, random
from template import OUT,SCRATCH,DIRECTIONS,LAYERS
RAMPS=json.loads((OUT/'ramps.json').read_text())
NEAREST=Image.Resampling.NEAREST
CHARACTERS=[
 dict(body='woman',outfit='ranger',hair='long',skin=1,hair_color='red',eyes='green',clothA='verdigris',clothB='rose'),
 dict(body='man',outfit='labourer',hair='short',beard=True,skin=4,hair_color='black',eyes='grey',clothA='vermilion',clothB='azure'),
 dict(body='woman',outfit='mage',hair='braid',feature='elf-ears',staff=True,skin=0,hair_color='white',eyes='blue',clothA='lapis',clothB='ivory'),
 dict(body='man',outfit='labourer',hair='short',feature='horns',skin=5,hair_color='chestnut',eyes='amber',clothA='murrey',clothB='saffron'),
 dict(body='man',outfit='mage',hair='long',beard=True,hood=True,skin=1,hair_color='grey',eyes='brown',clothA='verdigris',clothB='rose'),
 dict(body='man',outfit='ranger',hair='short',feature='elf-ears',skin=2,hair_color='blond',eyes='hazel',clothA='lapis',clothB='saffron')]
def rgba(hex):return tuple(bytes.fromhex(hex[1:]))+(255,)
def recolor(im,c):
 mapping={}
 for region,key in [('skin','skin'),('hair','hair_color'),('eyes','eyes'),('clothA','clothA'),('clothB','clothB')]:
  src=RAMPS['source'][region];dst=RAMPS['targets'][region][c.get(key,{'skin':1,'hair_color':'brown','eyes':'brown','clothA':'lapis','clothB':'saffron'}[key])]
  mapping.update(zip(map(rgba,src),map(rgba,dst)))
 result=im.copy();result.putdata([mapping.get(p,p) for p in im.get_flattened_data()]);return result
CACHE={}
def cell(layer,d=0,f=0):
 if layer not in CACHE:CACHE[layer]=Image.open(OUT/(layer+'.png')).convert('RGBA')
 return CACHE[layer].crop((32*f,48*d,32*f+32,48*d+48))
def stack_names(c):
 names=['body/'+c['body']]
 if c.get('feature'):names.append('feature/'+c['feature'])
 if c.get('outfit'):names.append('outfit/'+c['outfit']+('@woman' if c['body']=='woman' else ''))
 if c.get('beard'):names.append('beard/full')
 if c.get('hair'):names.append('hair/'+c['hair'])
 if c.get('hood'):names.append('head/hood')
 if c.get('staff'):names.append('held/staff')
 return names

def compose(c,d=0,f=0,recolour=True):
 im=Image.new('RGBA',(32,48))
 for name in stack_names(c):im.alpha_composite(recolor(cell(name,d,f),c) if recolour else cell(name,d,f))
 return im

def strip(images,bg,scale=1,gap=8):
 w=len(images)*32+(len(images)-1)*gap
 im=Image.new('RGBA',(w,48),bg)
 for i,sprite in enumerate(images):im.alpha_composite(sprite,(i*(32+gap),0))
 return im.resize((w*scale,48*scale),NEAREST)
def lineup():
 images=[compose(c) for c in CHARACTERS]
 strips=[strip(images,bg,scale) for scale in (1,4) for bg in ('#7a7a7a','#3a3129')]
 im=Image.new('RGBA',(strips[-1].width,sum(s.height for s in strips)+24),'#252035')
 y=0
 for s in strips:im.alpha_composite(s,(0,y));y+=s.height+8
 im.save(OUT/'lineup.png')
 return images

def busy_ground(w,h):
 rng=random.Random(773)
 im=Image.new('RGBA',(w,h),'#332820');dr=ImageDraw.Draw(im)
 cols=['#514035','#65513f','#7c624b','#3f3028']
 y=0
 while y<h:
  ht=rng.randint(3,5);x=-rng.randint(0,5)
  while x<w:
   wd=rng.randint(3,5);col=rng.choice(cols)
   dr.rectangle((x+1,y+1,x+wd-1,y+ht-1),fill=col)
   x+=wd
  y+=ht
 return im

def main():
 SCRATCH.mkdir(exist_ok=True)
 images=lineup()
 strip([compose(CHARACTERS[0],d) for d in range(4)],'#7a7a7a',4).save(OUT/'turn.png')
 walk=Image.new('RGBA',(608,384),'#7a7a7a')
 for row,c in enumerate(CHARACTERS[:2]):walk.alpha_composite(strip([compose(c,0,f) for f in range(4)],'#7a7a7a',4),(0,row*192))
 walk.save(OUT/'walk.png')
 frames=[strip([compose(c,0,f) for c in CHARACTERS[:2]],'#7a7a7a',4).convert('RGB') for f in range(4)]
 # One shared GIF palette across all four frames, exact RGB and no dithering.
 colours=sorted(set(p for im in frames for p in im.get_flattened_data()))
 assert len(colours)<=256
 pal=Image.new('P',(1,1));pal.putpalette([ch for rgb in colours for ch in rgb]+[0]*(768-3*len(colours)))
 gifs=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in frames]
 gifs[0].save(OUT/'walk.gif',save_all=True,append_images=gifs[1:],duration=160,loop=0,disposal=2,optimize=False)
 skins=[compose(dict(CHARACTERS[1],skin=i)) for i in range(6)]
 hairs=[compose(dict(CHARACTERS[0],hair_color=color)) for color in RAMPS['targets']['hair']]
 sw=Image.new('RGBA',(624,200),'#7a7a7a');sw.alpha_composite(strip(skins,'#7a7a7a',2),(0,0));sw.alpha_composite(strip(hairs,'#7a7a7a',2),(0,104));sw.save(OUT/'swatch.png')
 busy=busy_ground(232,48);busy.save(SCRATCH/'busy.png')
 for i,sprite in enumerate(images):busy.alpha_composite(sprite,(i*40,0))
 busy.save(SCRATCH/'lineup-busy-1x.png')
 busy.resize((696,144),NEAREST).save(SCRATCH/'lineup-busy-3x.png')
 # All outfits/bodies/frames/directions, hair/hood and feature/hair pairs.
 rows=[]
 for b in ('man','woman'):
  for outfit in ('labourer','ranger','mage'):
   rows.append((b+' / '+outfit,[compose(dict(CHARACTERS[0],body=b,outfit=outfit,hair='short'),d,f) for d in range(4) for f in range(4)]))
 for hair in ('short','long','braid'):
  for feature in ('hood','elf-ears','horns'):
   c=dict(CHARACTERS[0],hair=hair)
   if feature=='hood':c['hood']=True
   else:c['feature']=feature
   rows.append((hair+' / '+feature,[compose(c,d,f) for d in range(4) for f in range(4)]))
 matrix=Image.new('RGBA',(16*36, len(rows)*60),'#7a7a7a');draw=ImageDraw.Draw(matrix)
 for i,(label,ims) in enumerate(rows):
  draw.text((1,i*60),label,fill='#ece0cc')
  for j,im in enumerate(ims):matrix.alpha_composite(im,(j*36,i*60+12))
 matrix.save(SCRATCH/'fit-matrix.png')
 # Diagnostic silhouette proof, and previews at exactly 4x original pixels.
 sil=Image.new('RGBA',(112,48),'#d2c3a6')
 for i,o in enumerate(('labourer','ranger','mage')):
  im=compose(dict(CHARACTERS[0],outfit=o,hair='short'));im.putdata([(53,26,38,255) if p[3] else p for p in im.get_flattened_data()]);sil.alpha_composite(im,(i*40,0))
 sil.save(SCRATCH/'silhouettes.png')
 preview=SCRATCH/'review';preview.mkdir(exist_ok=True)
 for name in LAYERS:
  im=Image.open(OUT/(name+'.png'));bg=Image.new('RGBA',im.size,'#7a7a7a');bg.alpha_composite(im)
  bg.resize((im.width*4,im.height*4),NEAREST).save(preview/(name.replace('/','-')+'-4x.png'))
 for name in ('lineup','turn','walk','swatch'):
  im=Image.open(OUT/(name+'.png'));im.resize((im.width*4,im.height*4),NEAREST).save(preview/(name+'-4x.png'))
 for name in ('busy','lineup-busy-1x','lineup-busy-3x','fit-matrix','silhouettes'):
  im=Image.open(SCRATCH/(name+'.png'));im.resize((im.width*4,im.height*4),NEAREST).save(preview/(name+'-4x.png'))
 gif=Image.open(OUT/'walk.gif')
 for f in range(4):
  gif.seek(f);frame=gif.convert('RGB');frame.resize((frame.width*4,frame.height*4),NEAREST).save(preview/f'gif-frame-{f}-4x.png')
 # Practical inspection pages maintain native sprites at 4x without viewer downscaling.
 for i,c in enumerate(CHARACTERS):
  strip([compose(c)],'#7a7a7a',4).save(preview/f'character-{i+1}-4x.png')
 for r,(label,ims) in enumerate(rows):
  for d in range(4):
   strip(ims[d*4:d*4+4],'#7a7a7a',4).save(preview/f'fit-{r:02d}-{d}.png')
 for r in range(len(rows)):
  page=Image.new('RGBA',(608,768),'#7a7a7a')
  for d in range(4):page.alpha_composite(Image.open(preview/f'fit-{r:02d}-{d}.png'),(0,d*192))
  page.save(preview/f'fit-page-{r:02d}.png')
 print('Wrote lineup, turn, walk PNG/GIF, swatch, busy-ground and all fit/review images.')
if __name__=='__main__':main()
