"""Critic-five redraw: native scene forms, preserved source anchors."""
import json,math,copy
from PIL import Image,ImageDraw,ImageChops
import d4_scene as D
import d5_ground as G
import d_frames as F
import d2_scene as S
import d_redraw_scene as R
from d_layouts import MAPS
from draw_proofs import BASE,REVIEW,c,pts
from redraw_critic21 import box,line,poly,canvas
from d_sprites import new,framed
from d3_props import brazier

old_ground=D.ground;old_place=D.place;old_yard=D.yard;old_inset=D.inset

def ground(im,mask,look):
 if look=='cave_rock':
  art=G.cave_scene(im.size);im.paste(art,(0,0),mask);return im
 im=old_ground(im,mask,look)
 if look in ('keep','temple','crypt','manor'):G.masonry(im,mask,look)
 if look=='manor':
  # One bedroom floor includes the three original bed feet and the aisle below.
  art=im.copy();D.boards(art,(1078,552,1244,609));D.rug(art,(1080,605,1242,631),'textiles-sage',False)
  # These are interiors: preserve the structural mask and avoid painted walls.
  im.paste(art,(0,0),mask)
  # Service work zones: worn wet flags and soot adjacent to actual fixtures.
  art=im.copy()
  for p in ['1534,252 1584,252 1584,268 1570,268 1570,283 1534,283','1610,338 1658,338 1658,360 1643,360 1643,373 1600,373 1600,353','1502,700 1569,700 1569,716 1554,716 1554,731 1502,731','1608,699 1666,699 1666,726 1646,726 1646,736 1611,736','1744,658 1780,658 1780,716 1760,716 1760,687 1744,687']:
   poly(art,'mud:4',p)
  for x,y,w,n in [(1400,600,80,22),(1490,596,68,18),(1570,582,88,30),(1670,610,75,26),(1410,760,112,28),(1542,769,102,24),(1660,768,105,32)]:
   poly(art,'grey-brown-rock:4',f'{x},{y} {x+w},{y} {x+w},{y+3} {x+n},{y+3} {x+n},{y+8} {x+5},{y+8} {x+5},{y+22} {x},{y+22}')
  im.paste(art,(0,0),mask)
 return im


def outcrop(im,p):
 q=F.path(p);x=min(a for a,b in q);u=max(a for a,b in q);y=min(b for a,b in q);v=max(b for a,b in q)
 # Clear the previous wall texture around this island before drawing its volume.
 floor=G.cave_scene(im.size);b=(x-24,y-65,u+25,v+25);im.paste(floor.crop(b),b[:2])
 # The exact source footprint remains the basal contact, including the hollow
 # in the southeast mass. Crown vertices shift only vertically, as wall faces do.
 d=ImageDraw.Draw(im);height=37 if u-x<120 else 44
 crown=[(a,b-height) for a,b in q]
 d.polygon(q,fill=c('grey-brown-rock',1));d.polygon(crown,fill=c('grey-brown-rock',2))
 # Extrude each visible south-facing edge instead of clipping a wall texture.
 for i,((a,b),(aa,bb)) in enumerate(zip(q,q[1:]+q[:1])):
  if aa<a:
   d.polygon([(a,b-height),(aa,bb-height),(aa,bb),(a,b)],fill=c('grey-brown-rock',2))
   d.line([(a,b),(aa,bb)],fill=c('grey-brown-rock',1),width=1)
 d.polygon(crown,fill=c('grey-brown-rock',3))
 # Individual crown planes terminate at the same vertices as face clefts.
 if u-x<120:
  poly(im,'mud:5',f'{x+12},{y-height+9} {x+32},{y-height+2} {u-28},{y-height+2} {u-14},{y-height+12} {x+44},{y-height+24} {x+17},{y-height+24}')
  poly(im,'grey-brown-rock:2',f'{x+44},{y-height+24} {u-14},{y-height+12} {u-5},{v-height-13} {u-26},{v-height-1} {x+47},{v-height-1}')
  line(im,'grey-brown-rock:4',f'{x+14},{y-height+9} {x+32},{y-height+3} {u-29},{y-height+3}',2)
  line(im,'grey-brown-rock:1',f'{x+46},{v-height} {x+46},{v-17} {x+40},{v-11} {x+40},{v-1}',2)
  line(im,'grey-brown-rock:3',f'{x+51},{v-height+6} {x+51},{v-19}',3)
 else:
  # The eastward reentrant shoulder is preserved, not filled as an oval.
  poly(im,'mud:5',f'{x+7},{y-height+21} {x+24},{y-height+3} {x+60},{y-height+3} {x+77},{y-height+15} {x+74},{y-height+37} {x+40},{y-height+47} {x+11},{y-height+37}')
  poly(im,'grey-brown-rock:2',f'{x+40},{y-height+47} {x+74},{y-height+37} {u-15},{v-height-50} {u-2},{v-height-35} {u-14},{v-height-12} {u-38},{v-height-2} {x+54},{v-height-2}')
  # Reentrant hollow from the source's C-shaped southeastern outcrop.
  poly(im,'grey-brown-rock:1',f'{x+27},{y-height+18} {x+50},{y-height+13} {x+61},{y-height+20} {x+61},{y-height+38} {x+71},{y-height+49} {x+49},{y-height+49} {x+30},{y-height+42} {x+24},{y-height+31}')
  poly(im,'grey-brown-rock:2',f'{x+27},{y-height+18} {x+50},{y-height+13} {x+59},{y-height+19} {x+34},{y-height+22} {x+30},{y-height+32} {x+30},{y-height+42} {x+24},{y-height+31}')
  line(im,'grey-brown-rock:4',f'{x+9},{y-height+21} {x+25},{y-height+4} {x+59},{y-height+4}',2)
  line(im,'grey-brown-rock:3',f'{x+42},{y-height+47} {x+65},{y-height+41}',2)
  for xx,yy,dep in [(x+43,v-height-3,30),(u-32,v-height-6,33),(x+16,v-height-23,24)]:
   line(im,'grey-brown-rock:1',f'{xx},{yy} {xx},{yy+dep//2} {xx-5},{yy+dep//2+5} {xx-5},{yy+dep}',2)
   line(im,'grey-brown-rock:3',f'{xx+4},{yy+3} {xx+4},{yy+dep//2-2}',3)
 # Bedding shelves on the actual front facets terminate at their clefts.
 for p in [f'{x+12},{v-21} {x+27},{v-17} {x+36},{v-17}',f'{x+51},{v-14} {x+65},{v-14} {x+72},{v-18}',f'{u-27},{v-29} {u-14},{v-34}']:
  line(im,'grey-brown-rock:3',p,3)
 poly(im,'mud:3',f'{x+18},{v-12} {x+29},{v-10} {x+34},{v-6} {x+23},{v-6} {x+18},{v-8}')
 for p in [f'{x+26},{y-height+17} {x+39},{y-height+14} {x+49},{y-height+17}',f'{x+20},{y-height+25} {x+31},{y-height+28} {x+38},{y-height+28}']:
  line(im,'grey-brown-rock:3',p,2)


def hoard(im,bounds):
 x,y,u,v=map(F.at,bounds);f=new(u-x+1,v-y+1)
 # A connected bronze mass with several overlapping avalanche fronts.
 poly(f,'hoard-bronze:2','8,202 14,166 28,140 36,102 64,76 80,45 104,34 124,14 150,14 172,36 190,62 217,86 222,128 238,156 250,194 254,215 222,234 44,234 16,221')
 mounds=[('82,52 101,33 123,31 128,18 147,18 166,38 180,65 164,86 125,94 95,80',12),('31,113 49,88 71,78 99,86 118,110 113,137 86,157 49,148 30,134',14),('120,102 145,82 180,75 210,93 220,118 211,140 183,157 147,150 119,128',17),('16,174 42,150 72,148 98,170 107,195 94,215 62,226 29,214 15,196',12),('96,165 121,143 157,144 179,165 189,190 178,218 147,229 113,218 94,195',13),('181,172 207,149 230,161 244,184 249,212 230,224 200,226 180,211',8)]
 for p,depth in mounds:
  q=pts(p);d=ImageDraw.Draw(f);d.polygon([(a,b+depth) for a,b in q],fill=c('hoard-bronze',2));d.polygon(q,fill=c('hoard-bronze',4))
  # The front has horizontal overlapping coin edges, not wooden boards.
  front=q[len(q)//2:]
  for off in (4,9):
   if off<depth:d.line([(a,b+off) for a,b in front],fill=c('hoard-bronze',3),width=2)
 # Dense loose coins overlap. Every position is placed; no lattice or scatter.
 coins=[(119,24,13),(132,29,11),(142,22,10),(111,36,12),(124,40,14),(140,38,12),(152,41,10),(98,48,11),(108,54,13),(123,52,12),(137,54,15),(153,56,12),(161,64,10),(100,68,15),(119,68,11),(132,72,13),(148,69,11),
 (48,99,13),(61,92,11),(75,96,13),(86,104,12),(40,112,11),(53,116,14),(68,112,12),(82,119,14),(98,119,11),(39,127,13),(56,133,12),(71,130,13),(88,138,12),
 (143,98,13),(155,90,11),(170,86,14),(185,94,12),(201,102,11),(131,112,12),(146,117,13),(160,110,11),(175,117,14),(191,113,13),(204,125,11),(142,132,14),(158,137,12),(176,132,13),(192,142,14),
 (29,172,13),(43,163,12),(56,164,11),(70,170,15),(83,179,11),(22,186,13),(37,189,12),(50,181,14),(66,190,12),(80,194,13),(30,201,14),(48,207,13),(64,203,11),(78,214,12),
 (116,164,13),(130,156,12),(146,158,14),(160,170,12),(108,178,13),(123,180,14),(140,173,13),(155,185,14),(169,189,11),(109,194,12),(125,199,15),(143,195,12),(159,205,14),(121,213,13),(140,218,12),
 (200,170,12),(215,177,14),(228,188,11),(189,185,13),(203,190,12),(218,197,14),(231,207,12),(187,204,13),(201,212,12),(217,216,13)]
 for i,(a,b,w) in enumerate(coins):
  # Coins form a connected granular surface. Five shallow overlapping discs
  # have different orientations and offsets; there is no detached stack icon.
  poly(f,'hoard-bronze:3',f'{a-5},{b} {a+w-1},{b-3} {a+w+5},{b+2} {a+w+4},{b+9} {a+2},{b+12} {a-6},{b+8}')
  for dx,dy,ww in [(-4,1,7),(3,-2,8),(w-2,2,6),(0,6,8),(8,7,7)]:
   aa,bb=a+dx,b+dy
   poly(f,'loot-gold:4',f'{aa+2},{bb} {aa+ww-2},{bb} {aa+ww},{bb+2} {aa+ww-1},{bb+4} {aa+1},{bb+4} {aa},{bb+2}')
   line(f,'hoard-bronze:2',f'{aa+2},{bb+4} {aa+ww-2},{bb+4}',1)
   line(f,'loot-gold:5',f'{aa+2},{bb} {aa+ww-3},{bb}',1)
 # Three vessels interrupt the coin fields: a tall chalice, fallen cup and crown.
 D.goblet(f,76,62,23);D.goblet(f,186,147,19);D.goblet(f,101,184,17)
 poly(f,'hoard-bronze:1','179,47 185,57 192,51 201,59 212,48 210,75 181,75')
 poly(f,'loot-gold:4','182,53 186,62 192,56 201,64 209,54 207,72 184,72')
 line(f,'loot-gold:5','185,68 206,68',2);box(f,'textiles-teal:4',(192,68,196,72))
 S.platter(f,116,112,41);line(f,'loot-gold:5','122,113 151,113',2)
 # Fallen goblet: a horizontal bowl and attached stem/base.
 poly(f,'hoard-bronze:2','48,211 54,204 65,204 71,210 65,217 55,217');line(f,'loot-gold:5','51,210 56,206 63,206',2);line(f,'loot-gold:4','69,211 84,216',3);line(f,'loot-gold:5','84,210 84,221',2)
 fx=F.at(448)-x;fy=F.at(1280)-y;brazier(f,fx,fy);im.alpha_composite(f,(x,y));return [fx+x,fy+y]

# Broken north-bank plates follow the source rift spine and overlap in depth.
BANKS=[(144,655,47,28,11),(181,673,51,30,15),(223,672,60,34,12),(273,648,54,35,18),(315,646,57,30,10),(364,632,50,39,16),(403,600,57,34,14),(449,604,55,34,12),(491,628,55,39,18),(534,670,54,34,12),(580,676,51,32,15),(619,652,54,36,11),(660,623,52,38,17),(702,600,57,30,12),(747,613,64,33,18),(794,635,29,30,10)]

def bank(im,x,y,w,h,n,r='sandstone'):
 # Top plane reaches back into the floor; front fractures have different depths.
 poly(im,r+':1',f'{x},{y+9} {x+n},{y} {x+w-9},{y+2} {x+w},{y+11} {x+w-4},{y+h} {x+w-20},{y+h+7} {x+12},{y+h+3} {x},{y+h-4}')
 poly(im,r+':2',f'{x+1},{y+12} {x+w-2},{y+13} {x+w-5},{y+h-1} {x+w-20},{y+h+4} {x+12},{y+h} {x+1},{y+h-5}')
 poly(im,r+':3',f'{x},{y+8} {x+n},{y-7} {x+w-12},{y-6} {x+w},{y+5} {x+w-7},{y+15} {x+w-20},{y+18} {x+10},{y+15} {x},{y+12}')
 line(im,r+':4',f'{x+2},{y+8} {x+n},{y-5} {x+w-13},{y-4}',2)
 line(im,r+':1',f'{x+n+4},{y+17} {x+n+4},{y+24} {x+n},{y+28} {x+n},{y+h+1}',2)
 line(im,r+':3',f'{x+w-10},{y+18} {x+w-10},{y+h-4}',3)


def breach(im,points):
 top=[(144,657),(195,676),(249,681),(303,653),(352,663),(382,665),(427,610),(472,613),(523,668),(572,695),(620,684),(668,656),(713,612),(763,626),(816,645)]
 bottom=[(144,727),(182,743),(225,756),(270,743),(319,730),(363,745),(398,727),(434,685),(472,688),(518,726),(562,763),(608,752),(656,736),(700,711),(738,676),(780,695),(816,693)]
 d=ImageDraw.Draw(im);d.polygon(top+bottom[::-1],fill=c('breach-stone',1))
 # Large pools of molten rock at varied depths, fragmented by overhanging crust.
 for p in ['150,710 181,715 206,732 237,731 258,717 274,718 249,744 215,745 181,727 150,721','303,709 326,693 349,701 373,713 388,700 417,660 438,648 465,650 450,665 432,678 407,718 382,734 352,719 328,713','484,678 507,690 535,723 565,743 592,741 620,729 643,717 631,738 604,752 564,756 532,738 512,709','660,702 685,678 713,646 735,642 760,656 784,671 812,676 812,687 782,682 752,666 732,657 715,667 695,694 675,711']:
  poly(im,'lair-breach:4',p)
 for p in ['162,714 180,719 207,736 229,737 216,741 188,730','404,701 421,673 441,657 454,657 435,675 420,701','547,734 565,747 591,746 607,739 596,750 564,752','694,686 716,653 732,648 750,658 730,654 715,665']:
  poly(im,'lair-breach:6',p)
 for b in BANKS:bank(im,*b)
 # Broken southern lips grow from intact paving, with fallen blocks down-slope.
 for x,y,w,h,n in [(146,725,47,15,13),(205,747,52,17,16),(273,732,52,14,11),(333,733,45,18,14),(401,702,41,15,12),(464,689,43,16,15),(516,735,45,17,10),(573,753,48,15,14),(637,734,47,18,16),(697,699,42,15,12),(756,686,49,17,15)]:
  poly(im,'sandstone:2',f'{x},{y} {x+n},{y-6} {x+w-7},{y-3} {x+w},{y+7} {x+w-9},{y+h} {x+4},{y+h}')
  line(im,'sandstone:3',f'{x+3},{y+2} {x+n},{y-3} {x+w-9},{y}',2)
 for x,y,w,h,n in [(277,698,21,12,6),(453,660,26,15,8),(608,715,24,11,7),(759,668,21,10,6)]:bank(im,x,y,w,h,n,'breach-stone')
 # Broken crust interrupts the molten surface at selected fault widenings.
 for p in ['185,721 196,719 208,725 208,731 218,731 213,736 200,733 195,728 185,727','335,706 344,704 355,710 365,710 371,716 367,721 357,718 347,718 343,712 335,712','539,729 549,727 559,733 571,733 575,738 568,744 554,741 549,736 539,736','722,651 732,649 742,653 749,653 753,659 746,663 735,658 728,658 722,655']:
  poly(im,'breach-stone:2',p)
 for pp in ['198,721 205,725','346,706 356,712 365,712','550,730 560,735 568,735','733,652 743,656']:
  line(im,'embers:3',pp,2)
 x,y=[(F.at(a),F.at(b)) for a,b in points][-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',3);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:6',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
 return [x,y-35]


def ring(im,centre,rx,ry,ramp,step=5):
 if rx!=240:return S.ring(im,centre,rx,ry,ramp,step)
 cx,cy=centre;under=im.copy();d=ImageDraw.Draw(im)
 out=S.outline_points(cx,cy,rx,ry);inside=S.outline_points(cx,cy,rx-12,ry-12)
 m=Image.new('L',im.size);md=ImageDraw.Draw(m);md.polygon(out,fill=255);md.polygon(inside,fill=0)
 fill=canvas(im.size,'lair-sanctum:4');im.paste(fill,(0,0),m)
 d.line(out+[out[0]],fill=c('dark-masonry',3),width=1)
 # Unevenly surviving inlay segments with visible bed joints at flag boundaries.
 a=im.load();mp=m.load();up=under.load()
 for y in range(cy-ry,cy+ry+1):
  for x in range(cx-rx,cx+rx+1):
   if mp[x,y]:
    if x%48 in (0,1) or y%48 in (0,1):a[x,y]=up[x,y]
    elif 2<((x-cx)**2/rx**2+(y-cy)**2/ry**2)*100-90<5:a[x,y]=tuple(bytes.fromhex(c('lair-sanctum',5)[1:]))+(255,)
 # Hand-specified chips eat into one edge, never disintegrate the whole circle.
 for x,y,w,h in [(320,406,12,5),(481,384,15,4),(603,451,8,6),(662,574,6,12),(644,701,8,7),(571,795,12,5),(425,832,15,4),(296,790,10,6),(206,684,7,11),(196,558,5,12),(244,465,9,7)]:
  im.paste(under.crop((x,y,x+w,y+h)),(x,y))
 # Socket joints connect to the inlay along short native stone channels.
 for x,y,u,v in [(240,432,255,456),(288,384,309,419),(384,384,389,391),(624,528,654,535),(672,576,667,581),(624,624,665,624),(624,720,635,730),(576,768,586,783),(432,816,432,834),(336,816,341,816),(288,768,276,780),(240,720,225,722),(192,576,195,576)]:
  line(im,'dark-masonry:3',f'{x},{y} {u},{v}',6);line(im,'lair-sanctum:4',f'{x},{y} {u},{v}',3)
 return out


def bone_variant(idx):
 im=new(48,48);k=idx%5
 # Distinct anatomies, drawn in volume; no reused thin rib glyph.
 if k==0: # pelvis and single femur
  poly(im,'bone:2','9,18 15,13 22,15 25,21 30,15 37,16 40,24 35,30 29,28 24,24 20,30 12,28 8,23')
  line(im,'bone:4','12,18 16,16 20,18 22,22',2);line(im,'bone:3','29,19 34,18 36,23 32,26',3)
  line(im,'bone:2','8,38 29,33',5);line(im,'bone:4','9,36 28,31',2)
 elif k==1: # broad shoulder blade with crossed arm bones
  poly(im,'bone:2','10,9 30,13 34,21 22,31 13,26');poly(im,'bone:3','12,11 27,15 28,21 21,27 15,24');line(im,'bone:4','13,12 22,15 26,15',2)
  line(im,'bone:2','8,37 37,27',5);line(im,'bone:4','9,35 35,25',2)
 elif k==2: # skull side profile and jaw
  poly(im,'bone:2','12,12 18,8 29,8 35,14 35,23 30,27 30,33 19,33 15,28 10,26 10,17');poly(im,'bone:4','15,13 20,10 28,10 32,15 32,21 27,25 20,25 14,21');box(im,'bone:1',(24,17,29,21));line(im,'bone:3','18,29 27,29',3);line(im,'bone:2','8,39 36,35',4);line(im,'bone:4','9,37 30,34',2)
 elif k==3: # folded rib cage: arcing broad ribs with spine
  for x,y,w in [(8,17,24),(10,24,27),(13,31,24)]:
   line(im,'bone:2',f'{x},{y+4} {x+4},{y} {x+w-4},{y} {x+w},{y+4}',4);line(im,'bone:4',f'{x+4},{y} {x+w-4},{y}',1)
  line(im,'bone:3','17,11 24,36',4)
 else: # long-bone bundle, knuckles and two joined vertebrae
  for x,y,u,v in [(8,18,28,35),(18,11,36,27)]:line(im,'bone:2',f'{x},{y} {u},{v}',5);line(im,'bone:4',f'{x},{y-1} {u},{v-1}',2)
  box(im,'bone:2',(7,30,14,36));box(im,'bone:3',(9,31,14,33));box(im,'bone:2',(13,36,20,41));box(im,'bone:4',(14,36,19,38))
 # A local extra fragment differs by source anchor, not a repeated decal.
 x=5+(idx//5)*4;line(im,'bone:2',f'{x},42 {x+6},40',3)
 return im

COUNTS={}
def place(im,name,xy,records,group='reference'):
 key=(F.CURRENT,name);idx=COUNTS.get(key,0);COUNTS[key]=idx+1;x,y=map(F.at,xy)
 if F.CURRENT!='station_lab' and name in ('bones','crypt-study','candles'):
  if name in ('bones','crypt-study'):pic=bone_variant(idx+(1 if name=='crypt-study' else 0))
  else:
   pic=new(48,48)
   # Candle holders vary in height, wax puddle and number at the same centre.
   configurations=[[(10,25,12),(22,14,23),(34,28,9)],[(13,16,22),(27,27,11)],[(9,29,10),(19,22,17),(32,10,29)],[(14,29,9),(29,17,21)],[(8,14,25),(23,27,12),(34,22,17)],[(16,12,27),(31,27,12)]]
   for a,b,h in configurations[idx%6]:
    framed(pic,(a-3,b+h,a+6,b+h+3),'brass',2);box(pic,'bone:2',(a,b,a+4,b+h));box(pic,'bone:4',(a,b,a+2,b+h-1));line(pic,'bone:3',f'{a+4},{b+4} {a+7},{b+4} {a+7},{b+8}',2);box(pic,'brass:4',(a+1,b-5,a+3,b-1))
  im.alpha_composite(pic,(x-24,y-24));records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-24,y-24,x+24,y+24],group=group,variant=idx));return
 if F.CURRENT=='manor-ground' and name=='hearth' and tuple(xy) in {(1912,456),(1912,520)}:
  # 42 px high fixtures leave a real gap and keep the adjacent doorway clear.
  left=x-25;top=y-23
  framed(im,(left,top,x+25,y+19),'iron',2);box(im,'iron:3',(left+1,top+1,x+24,top+8));line(im,'iron:4',f'{left+3},{top+2} {x+21},{top+2}',1)
  if xy[1]==456:
   # Closed range with two hob rings and an oven door.
   for xx in (x-13,x+9):
    ImageDraw.Draw(im).ellipse((xx-6,top+2,xx+6,top+7),fill=c('iron',1));line(im,'iron:4',f'{xx-4},{top+2} {xx+4},{top+2}',1)
   framed(im,(x-18,top+13,x+17,y+14),'iron',1);line(im,'iron:4',f'{x-10},{top+17} {x+8},{top+17}',2)
  else:
   # Open brick stove with a kettle on its top, no chimney over the other stove.
   box(im,'sandstone:2',(x-23,top+10,x+23,y+17));box(im,'iron:1',(x-15,top+13,x+15,y+11));poly(im,'embers:4',f'{x-9},{y+8} {x-9},{y+2} {x-3},{y-6} {x},{y} {x+6},{y-3} {x+10},{y+8}');line(im,'iron:4',f'{x-15},{y+13} {x+15},{y+13}',2)
   framed(im,(x-11,top-7,x+10,top+1),'iron',3);line(im,'iron:4',f'{x-7},{top-8} {x+5},{top-8}',2)
  for xx in (x-20,x+17):box(im,'iron:1',(xx,y+20,xx+3,y+23))
  for yy in (y+6,y+11):line(im,'iron:3',f'{x-22},{yy} {x-18},{yy}',2)
  box(im,'iron:4',(x+19,y-3,x+22,y+3));line(im,'iron:1',f'{x-18},{y+18} {x+18},{y+18}',2)
  records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-26,top-9,x+26,y+24],group=group));return
 if F.CURRENT=='manor-ground' and name=='bed':
  # A one-cell sleeping alcove bed, top plane plus a short footboard. Its 48 px
  # source footprint leaves the southern aisle clear; the centre is unchanged.
  r=['textiles-sage','textiles-teal','textiles-russet'][idx%3]
  framed(im,(x-21,y-25,x+21,y+15),'wood-oak',2)
  box(im,'wood-oak:4',(x-20,y-24,x+20,y-20));line(im,'wood-oak:5',f'{x-18},{y-23} {x+18},{y-23}',1)
  box(im,'bone:3',(x-17,y-18,x+17,y-10));box(im,'bone:4',(x-15,y-17,x+15,y-12))
  box(im,r+':3',(x-18,y-8,x+18,y+8));line(im,r+':4',f'{x-17},{y-7} {x+17},{y-7}',2)
  line(im,r+':2',f'{x-9},{y-4} {x-9},{y+5} {x+5},{y+5}',2)
  box(im,'wood-oak:3',(x-20,y+10,x+20,y+15));line(im,'wood-oak:4',f'{x-18},{y+10} {x+18},{y+10}',1)
  for xx in (x-20,x+16):box(im,'wood-oak:1',(xx,y+16,xx+3,y+19))
  records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-22,y-26,x+22,y+20],group=group));return
 if F.CURRENT=='manor-ground' and name=='basin':
  # A deep stone sink on a cabinet, preserving each basin's work position.
  framed(im,(x-24,y-8,x+24,y+21),'wood-oak',2);box(im,'wood-oak:3',(x-22,y+4,x+22,y+19));line(im,'wood-oak:1',f'{x},{y+5} {x},{y+18}',1)
  framed(im,(x-26,y-19,x+26,y+2),'yard-cobble',3);box(im,'yard-cobble:1',(x-20,y-14,x+20,y-3));box(im,'sewer-water:2',(x-17,y-10,x+17,y-4));line(im,'sewer-water:3',f'{x-13},{y-9} {x+6},{y-9}',2)
  line(im,'iron:2',f'{x+12},{y-16} {x+12},{y-26} {x+5},{y-26} {x+5},{y-20}',4);line(im,'iron:4',f'{x+11},{y-24} {x+6},{y-24}',1)
  records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-27,y-28,x+27,y+24],group=group));return
 old_place(im,name,xy,records,group)


def yard(im,mask):
 im=old_yard(im,mask)
 # Restore broad turf bands to grass, then draw deliberate irregular verge shapes.
 # Existing path and objects are preserved by exact-colour clipping.
 art=im.copy();d=ImageDraw.Draw(art)
 green=tuple(bytes.fromhex(c('yard-grass',4)[1:]))+(255,);base=tuple(bytes.fromhex(c('yard-grass',3)[1:]))+(255,)
 pix=art.load()
 for yy in range(im.height):
  for xx in range(im.width):
   if pix[xx,yy]==green:pix[xx,yy]=base
 for p in ['0,26 60,26 76,30 140,30 156,38 224,38 232,46 224,53 182,53 166,48 110,48 94,42 38,42 20,38 0,38','309,20 400,20 428,26 482,26 500,34 570,34 581,42 560,48 496,48 475,42 411,42 392,36 338,36 309,30','811,46 858,46 875,39 922,39 942,32 1021,32 1040,39 1074,39 1090,47 1067,55 1009,55 990,49 936,49 916,55 840,55 811,51','8,260 25,252 42,256 55,272 59,305 48,320 39,305 39,283 25,274 8,274','23,742 43,738 59,755 66,781 60,807 48,816 36,800 34,774 23,760','1903,926 1924,916 1945,923 1967,939 1967,966 1948,959 1928,947 1903,945','1156,1190 1214,1182 1260,1188 1282,1198 1314,1198 1330,1208 1304,1217 1259,1211 1238,1204 1180,1204 1156,1198']:
  poly(art,'yard-grass:4',p)
 # Preserve all non-turf pixels, and preserve house wall content.
 m=Image.new('L',im.size);mp=m.load();ip=im.load()
 for yy in range(im.height):
  for xx in range(im.width):
   if ip[xx,yy] in (green,base):mp[xx,yy]=255
 im.paste(art,(0,0),m)
 # Native joinery on a slatted bench, with mortices, rail and pegs.
 box(im,'wood-oak:2',(1492,41,1601,57))
 for yy in (41,47,53):
  box(im,'wood-oak:3',(1493,yy,1600,yy+4));line(im,'wood-oak:4',f'1495,{yy} 1598,{yy}',1)
 line(im,'wood-oak:2','1512,44 1546,44 1551,45 1575,45',1);line(im,'wood-oak:4','1501,63 1591,63',2)
 for xx in (1500,1590):box(im,'iron:2',(xx,43,xx+2,45));box(im,'wood-oak:4',(xx,58,xx+1,66))
 # Well: masonry courses around the opening, windlass, rope and bucket.
 for yy,xs in [(595,[35,52,68]),(601,[29,44,61]),(612,[43,56])]:
  line(im,'yard-cobble:1',f'25,{yy} 73,{yy}',1)
  for xx in xs:line(im,'yard-cobble:1',f'{xx},{yy-5} {xx},{yy}',1)
 line(im,'timber:1','29,550 71,550',5);line(im,'timber:4','30,548 69,548',2);line(im,'iron:3','73,548 80,548 80,556',2)
 framed(im,(8,610,24,628),'wood-oak',3);line(im,'iron:3','9,615 23,615',2);line(im,'iron:3','9,623 23,623',2)
 # Distinct garden planting plans: leafy cabbages, herbs, climbing beans.
 for i,(y,v) in enumerate([(255,395),(437,601),(650,817)]):
  box(im,'mud:4',(1894,y+4,1944,v-4));line(im,'timber:4',f'1892,{y+1} 1946,{y+1}',1)
  for yy in (y+7,v-9):line(im,'timber:1',f'1891,{yy} 1896,{yy}',2);line(im,'timber:1',f'1942,{yy} 1947,{yy}',2)
  if i==0:
   for xx,yy,w,h in [(1900,269,24,20),(1918,302,22,24),(1899,341,27,22),(1921,366,18,19)]:
    poly(im,'overgrowth:2',f'{xx},{yy+6} {xx+6},{yy} {xx+w-5},{yy} {xx+w},{yy+7} {xx+w-3},{yy+h} {xx+5},{yy+h} {xx},{yy+h-5}')
    poly(im,'overgrowth:3',f'{xx+3},{yy+6} {xx+8},{yy+2} {xx+w-6},{yy+3} {xx+w-3},{yy+8} {xx+w-7},{yy+h-3} {xx+7},{yy+h-3}')
    line(im,'overgrowth:4',f'{xx+8},{yy+4} {xx+8},{yy+10} {xx+15},{yy+10} {xx+15},{yy+h-4}',2)
  elif i==1:
   for xx,yy,w,h in [(1899,450,16,31),(1921,476,18,39),(1900,523,22,27),(1920,558,18,30)]:
    line(im,'overgrowth:2',f'{xx+w//2},{yy} {xx+w//2},{yy+h}',3)
    for off,side in [(5,-1),(14,1),(23,-1)]:
     a=xx+w//2;b=yy+off;poly(im,'overgrowth:3',' '.join(f'{u},{v}' for u,v in [(a,b+6),(a+side*8,b+2),(a+side*8,b-3),(a+side*3,b-1)]))
     line(im,'overgrowth:4',f'{a},{b+4} {a+side*6},{b}',1)
  else:
   for xx in (1901,1933):line(im,'timber:3',f'{xx},663 {xx},801',3)
   for yy in (674,708,743,780):line(im,'timber:3',f'1901,{yy} 1933,{yy}',2)
   for pp in ['1904,800 1913,784 1910,764 1920,746 1917,728 1925,710 1920,691 1927,670','1930,800 1924,782 1928,765 1921,750']:
    line(im,'overgrowth:3',pp,3)
   for xx,yy,side in [(1911,783,-1),(1917,748,1),(1921,711,-1),(1921,690,1),(1927,765,1)]:
    poly(im,'overgrowth:4',' '.join(f'{u},{v}' for u,v in [(xx,yy),(xx+side*10,yy-5),(xx+side*13,yy-1),(xx+side*8,yy+5)]))
 return im


def inset(im,kind):
 b=old_inset(im,kind)
 if kind=='breach':
  x,y,u,v=b;floor=Image.open(BASE/'canon/surfaces/temple-floor.png');im.paste(floor.crop((0,0,168,104)),(x+12,y+28))
  # Sealed chasm: keyed-in sandstone repair blocks and plugged rubble, no ember.
  for xx,yy,w,h,n in [(x+22,y+91,31,16,10),(x+48,y+86,34,20,11),(x+76,y+76,36,18,12),(x+107,y+70,31,21,9),(x+132,y+59,37,17,12)]:
   bank(im,xx,yy,w,h,n)
   line(im,'sandstone:2',f'{xx+5},{yy+3} {xx+12},{yy+3} {xx+12},{yy+8}',2)
 return b


def setup_layout():
 m=MAPS['manor-ground']
 # Remove the accidental square void from the L partition; keep its outer run.
 m['holes']=[p.replace('448,736 576,736 576,880 448,880','448,736 480,736 480,880 448,880') for p in m['holes']]
 # Bedroom's north/south walls become shallow partitions rather than projecting
 # 48 px into the only aisle; south wall stays at the exact source floor boundary.
 m['holes']=[p.replace('1440,688 1792,688 1792,736 1440,736','1440,688 1792,688 1792,704 1440,704') for p in m['holes']]

old_run=F.run

def run_frames():
 setup_layout()
 # Pass content is not regenerated. F.run only sees the five failed scenes.
 lab=MAPS.pop('station_lab');manifest=json.loads((BASE/'frames/layout.json').read_text())['station_lab']
 try:old_run()
 finally:MAPS['station_lab']=lab
 j=json.loads((BASE/'frames/layout.json').read_text());j['station_lab']=manifest;(BASE/'frames/layout.json').write_text(json.dumps(j,indent=2)+'\n')

def run():
 D.ground=ground;D.outcrop=outcrop;D.hoard=hoard;D.breach=breach;D.place=place;D.yard=yard;D.inset=inset
 F.run=run_frames
 install=S.install
 def installing():
  install();R.ring=ring
 S.install=installing
 D.run()
 # Two saved-pixel curve joins: 2,1,2,1 becomes 2,2,1,1; the later
 # horizontal transition becomes 1,1,2,2. Wall and surface use the same edits.
 for p in [BASE/'frames/hoard-keep.png',REVIEW/'D-hoard-keep-surface.png']:
  pic=Image.open(p).convert('RGBA')
  pic.putpixel((828,992),pic.getpixel((827,992)))
  pic.putpixel((792,1028),pic.getpixel((791,1028)))
  if p.parent.name=='frames':D.save_frame(pic,'hoard-keep')
  else:pic.save(p)

if __name__=='__main__':run()
