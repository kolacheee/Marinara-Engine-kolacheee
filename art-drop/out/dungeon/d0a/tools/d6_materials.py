"""Native material pencils and registered source crops for critic-six repairs."""
import json
from functools import lru_cache
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,c,pts
from redraw_critic21 import canvas,poly,line,box
from d4_caves import rgba
from d4_backport import tidy

@lru_cache(None)
def master():
 src=Image.open('art-drop/dungeon/reference/master-interiors-mock.png').convert('RGB')
 # Registered master storage: one authored art pixel per exact 2x2 block.
 im=Image.new('RGB',(src.width//2,src.height//2))
 im.putdata([src.getpixel((2*x,2*y)) for y in range(im.height) for x in range(im.width)])
 return im

def locked(pic,ramps):
 colours=[rgba(r) for r in ramps];src=pic.convert('RGB')
 lut={p:min(colours,key=lambda q:sum((p[i]-q[i])**2 for i in range(3))) for p in set(src.get_flattened_data())}
 im=Image.new('RGBA',src.size);im.putdata([lut[p] for p in src.get_flattened_data()])
 for _ in range(3):
  if not tidy(im):break
 return im

# Hand-authored wear profiles: wide rubbed arrises and broken mineral beds.
# Every path occurs once in the 6x6 material. No random positions or noise.
WEAR=[
 '4,4 36,4 36,7 29,7 29,11 20,11 20,15 12,15 12,21 4,21',
 '102,3 131,3 131,6 123,6 123,9 109,9 109,13 102,13',
 '243,5 282,5 282,18 274,18 274,13 263,13 263,9 243,9',
 '49,52 76,52 76,55 68,55 68,59 61,59 61,66 55,66 55,76 49,76',
 '150,48 177,48 177,53 170,53 170,59 161,59 161,66 155,66 155,83 150,83',
 '198,75 208,75 208,80 215,80 215,84 232,84 232,92 198,92',
 '3,99 24,99 24,102 18,102 18,108 12,108 12,120 7,120 7,134 3,134',
 '68,125 74,125 74,130 87,130 87,134 93,134 93,140 58,140 58,136 68,136',
 '99,102 132,102 132,105 119,105 119,111 112,111 112,117 105,117 105,124 99,124',
 '243,99 263,99 263,105 254,105 254,111 247,111 247,128 243,128',
 '8,168 17,168 17,175 25,175 25,181 37,181 37,187 8,187',
 '103,147 128,147 128,151 118,151 118,155 111,155 111,161 103,161',
 '169,171 183,171 183,178 188,178 188,187 155,187 155,183 162,183 162,177 169,177',
 '200,150 217,150 217,154 213,154 213,160 207,160 207,176 200,176',
 '251,175 264,175 264,180 282,180 282,188 246,188 246,183 251,183',
 '5,196 26,196 26,200 19,200 19,205 12,205 12,217 5,217',
 '58,225 66,225 66,230 86,230 86,235 57,235',
 '151,198 180,198 180,202 174,202 174,207 166,207 166,213 157,213 157,224 151,224',
 '242,201 249,201 249,214 256,214 256,219 262,219 262,226 249,226 249,221 242,221',
 '8,267 15,267 15,273 22,273 22,278 37,278 37,283 8,283',
 '99,244 127,244 127,249 116,249 116,254 109,254 109,265 99,265',
 '195,248 206,248 206,257 213,257 213,263 220,263 220,269 210,269 210,265 201,265 201,258 195,258',
 '256,275 265,275 265,279 282,279 282,284 250,284 250,280 256,280']
CRACKS=['48,26 57,26 57,30 63,30 63,36 70,36 70,40','180,0 180,9 176,9 176,19 170,19 170,27','96,80 107,80 107,76 117,76 117,69','235,49 235,58 229,58 229,66 225,66','31,96 31,111 36,111 36,118','144,130 153,130 153,125 165,125 165,119','270,144 270,156 275,156 275,165','48,179 59,179 59,174 67,174','129,192 129,206 124,206 124,217','205,239 205,230 211,230 211,220','79,240 79,252 85,252 85,263','287,260 274,260 274,255 266,255']

@lru_cache(None)
def stone(look):
 dark,mid,base={'keep':('limestone:2','iron:3','limestone:3'),'temple':('sandstone:2','grey-brown-rock:3','sandstone:3'),'crypt':('dark-masonry:4','grey-brown-rock:3','dark-masonry:5'),'service':('mud:4','grey-brown-rock:3','grey-brown-rock:4')}[look]
 im=canvas((288,288),base)
 # Original master stone grain, read from registered art pixels only once in
 # the pattern. Reject furniture/textiles by the floor material's RGB band.
 sx={'keep':650,'temple':710,'crypt':780,'service':735}[look]
 src=master().crop((sx,980,sx+288,1268)).convert('RGB');values=[]
 for ii,(rr,gg,bb) in enumerate(src.get_flattened_data()):
  xx,yy=ii%288,ii//288
  stone_pixel=2<=rr-gg<=10 and 3<=gg-bb<=13 and 96<=gg<=155
  values.append(rgba(mid if stone_pixel and rr+gg+bb<345 and (xx%48<9 or yy%48<7 or xx%48>43) else base))
 im.putdata(values)
 for _ in range(3):tidy(im)
 # Structural joints are on the cell lattice, with staggered large pavers.
 for y in range(0,288,48):line(im,dark,f'0,{y} 287,{y}',1)
 for row,xs in enumerate([(0,48,144,240),(0,96,192,240),(0,48,96,192),(0,96,144,240),(0,48,144,192),(0,96,192,240)]):
  for x in xs:line(im,dark,f'{x},{row*48} {x},{row*48+47}',1)
 # Worn mineral grain comes from the master, without corner-glyph stamps.
 for p in CRACKS:line(im,dark,p,1)
 if look=='temple':
  # The warm mineral grain stays inside sandstone and does not become cold tile.
  for p in ['75,11 84,11 84,14 91,14','119,36 134,36 134,39','19,65 28,65 28,69 38,69','163,86 173,86 173,89 184,89','113,167 124,167 124,170 135,170','65,202 75,202 75,205 88,205','214,279 224,279 224,276 234,276']:
   line(im,'mud:5',p,2)
 if look=='crypt':
  # Lichen grows from selected joints; scalloped growth replaces green bars.
  for p in ['48,59 53,59 53,63 58,63 58,70 54,70 54,76 48,76','144,148 152,148 152,153 158,153 158,159 154,159 154,164 148,164 148,172 144,172','203,95 203,88 209,88 209,84 215,84 215,91 221,91 221,95','2,240 18,240 18,245 12,245 12,251 7,251 7,255 2,255']:
   poly(im,'lichen:3',p)
 for _ in range(2):tidy(im)
 return im

def pattern_into(im,b,tex):
 x,y,u,v=b;crop=Image.new('RGBA',(u-x+1,v-y+1))
 for yy in range((y//tex.height)*tex.height,v+1,tex.height):
  for xx in range((x//tex.width)*tex.width,u+1,tex.width):crop.paste(tex,(xx-x,yy-y))
 im.paste(crop,(x,y))

def flags(im,b,base,joint,lip,period=48):
 look='crypt' if base.startswith('dark-masonry') else 'keep' if base.startswith(('limestone','iron')) else 'service' if base.startswith('grey-brown') else 'temple'
 pattern_into(im,b,stone(look))
 if base.startswith('marble'):
  # Threshold stone stays cool and smooth with a broad border.
  box(im,base,b)
  x,y,u,v=b
  for xx in range((x//48)*48,u,48):line(im,joint,f'{xx},{y} {xx},{v}',1)
  for yy in range((y//48)*48,v,48):line(im,joint,f'{x},{yy} {u},{yy}',1)

@lru_cache(None)
def wood():
 return locked(master().crop((298,110,474,248)),['parquet:3','timber:4','parquet:4'])
def boards(im,b):
 # Native grain source; board joints below deliberately follow 48px cells.
 pattern_into(im,b,wood());x,y,u,v=b
 for yy in range((y//16)*16,v+1,16):
  if yy>=y:line(im,'parquet:3',f'{x},{yy} {u},{yy}',1)
  for xx in range(((x+47)//48)*48,u,96):
   if yy>=y:line(im,'timber:4',f'{xx},{max(y,yy-15)} {xx},{yy}',1)

@lru_cache(None)
def woven(r):
 src=master().crop((112,164,184,233)).convert('RGB');out=Image.new('RGBA',src.size)
 # Three value/material classes read each native source pixel; no grid fitting.
 a=[]
 for p in src.get_flattened_data():
  lum=sum(p)/3
  step=1 if lum<60 else 2 if p[0]>p[1]*1.45 else 4 if lum>160 else 3
  a.append(rgba(r+':'+str(step)))
 out.putdata(a)
 for _ in range(2):tidy(out)
 return out

def rug(im,b,r='textiles-teal',motif=True):
 x,y,u,v=b;src=woven(r);box(im,r+':1',b);box(im,r+':2',(x+2,y+2,u-2,v-2))
 # Borders are designed woven repeats; centre ornaments are individually placed.
 for xx in range(x+5,u-4,60):
  w=min(60,u-4-xx);im.paste(src.crop((6,1,6+w,8)),(xx,y+2));im.paste(src.crop((6,60,6+w,67)),(xx,v-8))
 for yy in range(y+9,v-9,48):
  h=min(48,v-9-yy);im.paste(src.crop((1,10,8,10+h)),(x+2,yy));im.paste(src.crop((64,10,71,10+h)),(u-8,yy))
 for xx in range(x+3,u,4):
  line(im,r+':3',f'{xx},{y-2} {xx},{y-1}',2);line(im,r+':3',f'{xx},{v+1} {xx},{v+2}',2)
 centre=src.crop((13,13,58,58));cx=(x+u)//2;cy=(y+v)//2
 if motif:im.paste(centre,(cx-22,cy-22))
 else:
  small=src.crop((24,24,46,46));im.paste(small,(cx-11,cy-11))
 # Corner foliage and quiet broken weft bands, different spans per textile.
 for xx,yy,sx,sy in [(x+14,y+15,1,1),(u-14,y+15,-1,1),(x+14,v-15,1,-1),(u-14,v-15,-1,-1)]:
  q=[(xx,yy),(xx+sx*17,yy),(xx+sx*17,yy+sy*3),(xx+sx*12,yy+sy*3),(xx+sx*12,yy+sy*8),(xx+sx*7,yy+sy*8),(xx+sx*7,yy+sy*15),(xx,yy+sy*15)]
  ImageDraw.Draw(im).polygon(q,fill=c(r,3));line(im,r+':4',f'{xx},{yy} {xx+sx*11},{yy}',1)
 for a,bb,w in [(x+23,y+31,17),(u-44,v-29,18),(x+25,cy+19,22),(cx+24,y+24,19)]:
  if a+w<u-15 and y+15<bb<v-15:line(im,r+':3',f'{a},{bb} {a+w},{bb}',1)
