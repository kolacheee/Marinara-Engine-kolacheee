#!/usr/bin/env python3
"""Exact palette lookup and SPEC stack, reproducible previews and scene composites."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import json
import sys
sys.dont_write_bytecode=True
from build import ROOT,RAMPS,frame
BASE=ROOT.parent; BG=(122,122,122,255)
CHARACTERS=[
 {'name':'01 / Ranger','body':'woman','outfit':'ranger','hair':'long','skin':'light','hair_color':'red','eyes':'green','clothA':'moss','clothB':'fleece'},
 {'name':'02 / Labourer','body':'man','outfit':'labourer','hair':'short','beard':'full','skin':'very-dark','hair_color':'black','eyes':'brown','clothA':'linen','clothB':'umber'},
 {'name':'03 / Mage','body':'woman','feature':'elf-ears','outfit':'mage','hair':'braid','staff':True,'skin':'medium','hair_color':'white','eyes':'blue','clothA':'woad','clothB':'fleece'},
 {'name':'04 / Labourer','body':'man','feature':'horns','outfit':'labourer','hair':'short','skin':'ash-grey','hair_color':'dark-brown','eyes':'amber','clothA':'madder','clothB':'charcoal'},
 {'name':'05 / Elder','body':'man','outfit':'mage','hair':'long','beard':'full','hood':True,'skin':'light','hair_color':'grey','eyes':'grey','clothA':'linen','clothB':'umber'},
 {'name':'06 / Ranger','body':'man','feature':'elf-ears','outfit':'ranger','hair':'short','skin':'brown','hair_color':'blond','eyes':'hazel','clothA':'woad','clothB':'russet'}]
def recolor(im,c):
 mapping={}
 for region,key in [('skin','skin'),('hair','hair_color'),('eyes','eyes'),('clothA','clothA'),('clothB','clothB')]:
  if key not in c:continue
  for src,dst in zip(RAMPS['source'][region],RAMPS['targets'][region][c[key]]):mapping[tuple(bytes.fromhex(src[1:]))+(255,)]=tuple(bytes.fromhex(dst[1:]))+(255,)
 result=im.copy();result.putdata([mapping.get(p,p) for p in im.getdata()]);return result
def character(c,d='down',f=0):
 b=c['body'];layers=['body/'+b]
 if c.get('feature'):layers.append('feature/'+c['feature']+'@'+b)
 layers.append('outfit/'+c['outfit']+'@'+b)
 if c.get('beard'):layers.append('beard/'+c['beard']+'@'+b)
 layers.append('hair/'+c['hair']+'@'+b)
 if c.get('hood'):layers.append('head/hood@'+b)
 if c.get('staff'):layers.append('held/staff@'+b)
 im=Image.new('RGBA',(48,64))
 for layer in layers:im.alpha_composite(recolor(frame(layer,d,f),c))
 return im

def label(im,pos,text,fill=(224,216,199,255)):
 ImageDraw.Draw(im).text(pos,text,fill=fill,font=ImageFont.load_default())
def lineup():
 im=Image.new('RGBA',(1200,412),BG)
 for i,c in enumerate(CHARACTERS):
  x=i*200;label(im,(x+18,12),c['name']);im.alpha_composite(character(c),(x+76,36));im.alpha_composite(character(c).resize((192,256),Image.Resampling.NEAREST),(x+4,126))
 label(im,(18,397),'WORKING LIGHT   /   32 pixels per metre   /   native 1x and nearest-neighbour 4x')
 im.save(ROOT/'lineup.png')
def scenes():
 # Full 1280x760 original screenshots; feet deliberately clear the fountain and labels.
 configs=[('in-world.png','market-normal-zoom.png',2.3,[(835,443),(360,479),(931,577),(730,645),(252,654),(1031,479)]),('in-world-close.png','market-close-zoom.png',4,[(860,429),(203,431),(1048,624),(779,686),(123,688),(1125,394)])]
 for dest,src,scale,feet in configs:
  im=Image.open(BASE/'world'/src).convert('RGBA')
  for i in sorted(range(6),key=lambda n:feet[n][1]):
   x,y=feet[i];shadow=Image.new('RGBA',im.size)
   d=ImageDraw.Draw(shadow);w=48*scale*.6;h=48*scale*.2;cx=x+1.5*scale;cy=y-1.5*scale
   d.ellipse((cx-w/2,cy-h/2,cx+w/2,cy+h/2),fill=(43,37,48,115));shadow=shadow.filter(ImageFilter.GaussianBlur(1.3*scale));im.alpha_composite(shadow)
   fig=character(CHARACTERS[i]).resize((round(48*scale),round(64*scale)),Image.Resampling.NEAREST)
   im.alpha_composite(fig,(x-fig.width//2,y-fig.height+1))
  im.save(ROOT/dest)
def turn():
 im=Image.new('RGBA',(832,300),BG)
 for i,d in enumerate(['down','left','right','up']):label(im,(i*208+16,10),d.upper());im.alpha_composite(character(CHARACTERS[0],d).resize((192,256),Image.Resampling.NEAREST),(i*208+8,32))
 im.save(ROOT/'turn.png')
def walks():
 im=Image.new('RGBA',(1200,1112),BG)
 for row,(ci,d) in enumerate([(0,'down'),(0,'left'),(1,'down'),(1,'left')]):
  for f in range(6):
   label(im,(f*200+8,row*278+6),f'{ci+1:02} {d} / {f}');im.alpha_composite(character(CHARACTERS[ci],d,f).resize((192,256),Image.Resampling.NEAREST),(f*200+4,row*278+20))
 im.save(ROOT/'walk.png')
 frames=[]
 for f in range(6):
  im=Image.new('RGBA',(832,304),BG)
  for i,(ci,d) in enumerate([(0,'down'),(0,'left'),(1,'down'),(1,'left')]):
   label(im,(i*208+12,10),f'{ci+1:02} / {d}');im.alpha_composite(character(CHARACTERS[ci],d,f).resize((192,256),Image.Resampling.NEAREST),(i*208+8,36))
  frames.append(im.convert('RGB'))
 # A shared palette avoids frame-dependent colours and GIF flicker.
 palette=Image.new('RGB',(832,304*6))
 for i,im in enumerate(frames):palette.paste(im,(0,304*i))
 palette=palette.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
 frames=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in frames]
 frames[0].save(ROOT/'walk.gif',save_all=True,append_images=frames[1:],duration=150,loop=0,disposal=2,optimize=False)
def swatch():
 im=Image.new('RGBA',(1600,740),BG)
 for row,(region,base,key) in enumerate([('skin',CHARACTERS[1],'skin'),('hair',CHARACTERS[0],'hair_color')]):
  for i,name in enumerate(RAMPS['targets'][region]):
   c=dict(base);c[key]=name;x=i*200;y=row*370
   label(im,(x+12,y+10),name);im.alpha_composite(character(c),(x+76,y+30));im.alpha_composite(character(c).resize((192,256),Image.Resampling.NEAREST),(x+4,y+105))
 im.save(ROOT/'swatch.png')
if __name__=='__main__':
 lineup();scenes();turn();walks();swatch();print('Composed six PNGs and six-frame GIF.')
