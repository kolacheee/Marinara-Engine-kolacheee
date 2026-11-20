"""Part B layout and exact source crops. All placements use source pixels 1:1."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from draw_style_samples import ROOT,CANON,RAMPS,c,build,SWATCHES
from build_palette import lightness
REF=ROOT/'art-drop/dungeon/reference'
REVIEW=ROOT/'art-drop/review-d0a'
FONT=ImageFont.load_default_imagefont()
BG=c('void-mass',1);INK=c('bone',6);MUTED=c('limestone',5);ACCENT=c('wood-oak',6)
SOURCES=[];EXEMPT=[];REGIONS=[]
def text(d,xy,t,fill=INK):
 d.fontmode='1';d.text(xy,t,font=FONT,fill=fill)
def title(d,y,t):
 d.line((48,y-8,1679,y-8),fill=c('void-mass',4));text(d,(48,y),t,ACCENT)
def crop(name,source,box,kind):
 im=Image.open(source).crop(box);dst=CANON/'crops'/f'{name}.png';im.save(dst)
 SOURCES.append({'file':str(dst.relative_to(CANON)),'source':str(source.relative_to(ROOT)),
  'box':box,'kind':kind,'rgba_sha256':hashlib.sha256(im.convert('RGBA').tobytes()).hexdigest()})
 return im

def paste(im,src,xy,exempt=False):
 if src.mode=='RGBA':im.paste(src,xy,src)
 else:im.paste(src,xy)
 if exempt:EXEMPT.append([xy[0],xy[1],xy[0]+src.width,xy[1]+src.height])
def main():
 build();(CANON/'crops').mkdir(exist_ok=True);REVIEW.mkdir(exist_ok=True)
 master=REF/'master-interiors-mock.png'
 boxes={'wall':(316,490,460,586),'floor':(600,288,792,432),'wood-prop':(968,302,1064,398),
  'stone-prop':(696,32,888,224),'outline-detail':(974,312,1022,360),'rug':(216,324,408,468),'mass-edge':(440,440,584,536)}
 crops={n:crop(n,master,b,'master reference; unchanged pixels') for n,b in boxes.items()}
 for name,filename in [('overworld-grass','overworld-grass-0.png'),('overworld-path','overworld-path_joined-0.png'),('overworld-cobble','overworld-street-0.png')]:
  src=REF/filename;size=Image.open(src).size;crops[name]=crop(name,src,(0,0,*size),'summer reference; unchanged pixels')
 dont={
  'soft-hoard':('hoard-keep.png',(140,1030,332,1222)),
  'vector-rift':('breach-temple.png',(430,812,622,1004)),
  'brown-bars':('manor-ground.png',(915,666,1107,858)),
  'checker-floor':('manor-ground.png',(1380,1210,1572,1402)),
  'grey-mass':('sanctum-crypt.png',(960,30,1152,222))}
 for n,(f,b) in dont.items():crops[n]=crop('dont-'+n,REF/'current'/f,b,'DON\'T; current renderer at 64 px/cell; unchanged pixels')
 # The pack used by DungeonMapView's drawTile("party") fallback. Decode as tilePackPixels does.
 source=ROOT/'packages/server/src/assets/overworld-tiles/fantasy.json';pack=json.loads(source.read_text())
 alphabet='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
 party=Image.new('RGBA',(16,16))
 for y,row in enumerate(pack['tiles']['party'][0]):
  for x,ch in enumerate(row):
   if ch!='.':
    v=pack['palette'][alphabet.index(ch)][1:];rgba=tuple(int(v[i:i+2],16) for i in range(0,len(v),2))
    party.putpixel((x,y),rgba if len(rgba)==4 else (*rgba,255))
 # Source character is an explicit legacy exception. Its original shadow is composited
 # onto an opaque palette-colour backing; sprite pixels are neither recoloured nor resized.
 party_panel=Image.new('RGBA',(48,48),c('grey-brown-rock',3));party_panel.alpha_composite(party,(16,28))
 party_panel.convert('RGB').save(CANON/'crops/party-source.png')
 SOURCES.append({'file':'crops/party-source.png','source':str(source.relative_to(ROOT)),
  'entry':'tiles.party[0]','native_size':[16,16],'placement':[16,28],
  'backing':c('grey-brown-rock',3),'method':'tilePackPixels alphabet; native source-over on opaque backing',
  'exception':'Legacy party and foe style/scale. Original shadow pixels are composited, not repainted.'})
 (CANON/'crops/SOURCES.json').write_text(json.dumps(SOURCES,indent=2)+'\n')
 im=Image.new('RGB',(1728,3072),BG);d=ImageDraw.Draw(im)
 text(d,(48,24),'D0a / PART B / DUNGEON CANON',ACCENT)
 text(d,(48,46),'CELL = 48 PX / native authored pixels / high three-quarter view / light from upper left')
 text(d,(48,64),'Version D0a-B.1 / owner review pending / scene art uses palette.hex / source crops remain unchanged',MUTED)
 text(d,(48,82),'No reduction, filters, gradients, glow or soft alpha. Drawn art below is 1x. Enlargements belong only in B-* review sheets.',MUTED)
 title(d,112,'01 / OUTLINE AND SILHOUETTE / reusable drawings in canon/props/')
 outline=[('crate','wood-oak',48,['Square braced crate / oak outline step 1.','Top-left outline may use step 2.','Grain follows the plank; no random flecks.']),
 ('chest','textiles-teal',592,['Domed lid + metal bands + central lock.','Own ramp outline; gold belongs to loot.','Chest differs from crate by shape AND colour.']),
 ('column','limestone',1136,['Stone capital, shaft, flutes and plinth.','One-pixel outline; no doubled corner blocks.','Stepped curves use even, monotonic runs.'])]
 for name,r,x,lines in outline:
  p=Image.open(CANON/'props'/f'{name}.png');paste(im,p,(x,148))
  for j,t in enumerate(lines):text(d,(x+64,148+j*19),t)
  for j in (1,2):d.rectangle((x+64+(j-1)*64,214,x+111+(j-1)*64,237),fill=c(r,j));text(d,(x+64+(j-1)*64,241),'step '+str(j))
 text(d,(48,273),'Outline = 1 art pixel, darkest step of the object\'s material, never #000000. Floor texture has no outline.',MUTED)
 text(d,(48,292),'Clusters contain 3+ pixels. Built floor joints follow 48 px cells. Every crack, grain scar and stain is placed deliberately.',MUTED)
 title(d,328,'02 / SCALE / 48 PX CELLS / all figures shown at source or authored size')
 items=[('party-source','PARTY / source 16x16',(48,48)),('door','DOOR / 48x96',(48,96)),('table','TABLE / 96x96',(96,96)),('chest','CHEST / 48x48',(48,48)),('column','COLUMN / 48x96',(48,96)),('crate','CRATE / 48x48',(48,48))]
 for i,(n,label,sz) in enumerate(items):
  x=48+i*272;text(d,(x,354),label)
  d.rectangle((x,376,x+143,519),fill=c('limestone',2) if n in ('chest','column') else c('ash',2) if n in ('door','table','crate') else c('grey-brown-rock',3))
  for xx in range(x,x+145,48):d.line((xx,376,xx,519),fill=c('void-mass',4))
  for yy in range(376,521,48):d.line((x,yy,x+143,yy),fill=c('void-mass',4))
  p=Image.open(CANON/('crops' if n=='party-source' else 'props')/f'{n}.png')
  paste(im,p,(x+48-(24 if sz[0]==96 else 0),520-sz[1]),n=='party-source')
  text(d,(x,522),'DISPLAY / NOT A FLOOR' if n in ('door','table','crate') else 'FLOOR / L*35.1' if n in ('chest','column') else 'LEGACY SOURCE',MUTED)
 text(d,(48,536),'Party and foe sprites are known style/scale exceptions and out of scope. The party is decoded from fantasy.json, entry party[0].',MUTED)
 text(d,(48,554),'Door cuts the wall band; its lintel, frame and lit threshold stay readable. Walls have a 48 px face and a 1 px dark base line.',MUTED)
 title(d,590,'03 / LIGHT AND VALUES')
 light=Image.new('RGB',(144,96),c('ash',2));light.paste(Image.open(CANON/'props/crate.png'),(56,30),Image.open(CANON/'props/crate.png'))
 paste(im,light,(48,616));d.line((68,622,95,648),fill=ACCENT);d.line((87,648,95,648,95,640),fill=ACCENT)
 text(d,(208,616),'Light from upper left.');text(d,(208,635),'Edge light rises one ramp step.');text(d,(208,654),'No baked cast shadow.');text(d,(208,673),'Shadow layer: one colour at 35%.');text(d,(208,692),'Composite once; overlaps do not stack.')
 text(d,(48,720),'DISPLAY / NOT A FLOOR / L*30.3',MUTED)
 text(d,(48,738),'Oak studies show scale and light; scene pairing is unproven.',MUTED)
 bands=[('MASS','5-15',10),('WALL TOP','18-30',24),('WALL FACE','25-40',33),('FLOOR','35-55',45),('PROP','30-70',63),('FOCAL','up to 85',83)]
 for i,(label,bounds,L) in enumerate(bands):
  x=544+i*184
  # Neutral greys are diagram annotations, not material colours.
  v=round(255*(1.055*((L+16)/116)**(3/2.4)-.055))
  d.rectangle((x,636,x+159,683),fill=(v,v,v));EXEMPT.append([x,636,x+160,684])
  text(d,(x,616),label);text(d,(x,692),'L* '+bounds)
 text(d,(544,716),'Mass <=75% of wall-top L*. Floor total contrast <=15 L*. Prop outline AND main body: >=10 L* from floor.',MUTED)
 text(d,(544,734),'Loot / lair feature / found trap: >=15 L* above floor, <=85. Pale reference-only steps never become broad surfaces.',MUTED)
 title(d,770,'04 / MATERIAL STUDIES / 14 looks / 48x48 each / no outline on texture')
 for i,(n,(r,s)) in enumerate(SWATCHES.items()):
  x=48+(i%7)*240;y=800+(i//7)*94
  paste(im,Image.open(CANON/'swatches'/f'{n}.png'),(x,y));text(d,(x+56,y),n)
  text(d,(x+56,y+17),r);text(d,(x+56,y+34),'48 px / floor range',MUTED)
 text(d,(48,992),'These are material samples. Part C supplies the 3x3-cell proofs with mass, wall top, wall face, floor and a prop.',MUTED)
 title(d,1028,'05 / GAMEPLAY HUES / reserved entities only')
 reserved=['foe-red','loot-gold','found-trap','lair-hoard','lair-haven','lair-drowned','lair-sanctum','lair-breach','lair-den','lair-hive']
 for i,n in enumerate(reserved):
  x=48+i%5*328;y=1056+i//5*74;text(d,(x,y),n)
  for j,col in enumerate(RAMPS[n]):d.rectangle((x+j*32,y+18,x+j*32+31,y+41),fill=col)
  if n=='found-trap':
   for j in range(12):d.rectangle((x+j*16,y+42,x+j*16+15,y+46),fill=c('found-trap',5 if j%2 else 1))
 text(d,(48,1200),'Found traps also need a striped rim. Hoard dressing = hoard-bronze; heap body = lair-hoard 3-4; loose loot = loot-gold 5-6.',MUTED)
 text(d,(48,1218),'Use muted embers / brass / terracotta / hive-resin on materials. Full reserved hues belong to foes, loot, traps and features.',MUTED)
 title(d,1256,'06 / DO AND DON\'T / source pixels retained at 1:1 / current examples remain 64 PX PER CELL')
 names=list(dont);captions=['Soft hoard circles','Vector rift + glow','16 px brown-bar props','Checker floor dominates','Grey brick beyond walls']
 fixes=['Model objects with faces.','Use hard pixel edges.','Show joinery and depth.','Keep floor contrast low.','Darken the wall mass.']
 dos=[crops['wood-prop'],crops['outline-detail'],Image.open(CANON/'props/table.png'),Image.open(CANON/'swatches/keep.png'),crops['mass-edge']]
 for i,n in enumerate(names):
  x=48+i*328;text(d,(x,1284),'DON\'T / '+captions[i]);paste(im,crops[n],(x,1304),True)
  text(d,(x,1504),'DO / '+fixes[i]);paste(im,dos[i],(x,1524),i in (0,1,4))
 text(d,(48,1634),'Master crops teach edge density, construction and materials; the dungeon value ladder still controls broad scene values.',MUTED)
 text(d,(48,1652),'Sources and exact pixel rectangles: canon/crops/SOURCES.json. Reference crops and character samples are excluded from art palette caps.',MUTED)
 title(d,1690,'07 / COMPLETE RAMPS / darkest to lightest / exact names from palette.hex / six steps each')
 for i,(n,cols) in enumerate(RAMPS.items()):
  x=48+(i//21)*552;y=1720+(i%21)*62
  text(d,(x,y),n)
  for j,col in enumerate(cols):
   xx=x+j*80;d.rectangle((xx,y+14,xx+63,y+33),fill=col)
   text(d,(xx,y+36),f'{j+1} L*{lightness(col):.0f}')
   text(d,(xx,y+48),col,MUTED)
 text(d,(48,3034),'Surface sheet cap 32 colours / prop sheet cap 48 / alpha 0 or 255 / transparent RGB zero / palette.hex is authoritative.',MUTED)
 text(d,(48,3052),'This reference atlas combines all ramps and verbatim sources; sheet caps apply to the separate reusable art files.',MUTED)
 im.save(CANON/'style-guide.png')
 (REVIEW/'B-guide-exemptions.json').write_text(json.dumps(EXEMPT)+'\n')
 sections=[('outline',(0,0,1728,320)),('scale',(0,320,1728,576)),('light',(0,576,1728,760)),('materials',(0,760,1728,1016)),('gameplay',(0,1016,1728,1240)),('do-dont',(0,1240,1728,1680))]
 for i in range(7):sections.append((f'ramps-{i+1}',(0,1680+i*186,1728,min(1680+(i+1)*186,3072))))
 sections.append(('footer',(0,2982,1728,3072)))
 (REVIEW/'B-guide-sections.json').write_text(json.dumps(sections)+'\n')
 print('Wrote style guide',im.size,'with',len(RAMPS),'ramps and',len(SOURCES),'source entries')
if __name__=='__main__':main()
