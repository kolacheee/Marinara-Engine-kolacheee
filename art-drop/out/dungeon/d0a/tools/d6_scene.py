"""Critic-six native redraw, preserving the five source plans and all anchors."""
import json,math,shutil
from functools import lru_cache
from PIL import Image,ImageDraw,ImageChops
import d_frames as F
import d4_scene as D
import d5_scene as V
import d2_scene as S
import d_redraw_scene as R
import d6_materials as M
import d6_caves as C
from d_layouts import MAPS
from draw_proofs import BASE,REVIEW,c,pts
from redraw_critic21 import canvas,poly,line,box
from d_sprites import new,framed
from d3_props import brazier
from d4_backport import tidy
from d4_caves import rgba


def ground(im,mask,look):
 if look=='cave_rock':
  im.paste(C.cave_scene(im.size),(0,0),mask);return im
 art=im.copy();w,h=im.size
 if look in ('keep','temple','crypt'):
  M.pattern_into(art,(0,0,w-1,h-1),M.stone(look))
  if look=='keep':
   M.rug(art,(799,278,1007,539),'textiles-teal');M.rug(art,(443,543,608,713),'textiles-russet')
   # A continuous rubbed route through the treasury, beneath the source objects.
   for p in ['409,775 446,775 446,795 470,795 470,828 495,828 495,861 472,861 472,841 445,841 445,811 409,811','500,870 531,870 531,892 556,892 556,930 528,930 528,906 500,906','552,931 582,931 582,965 604,965 604,993 575,993 575,972 552,972']:
    poly(art,'mud:5',p)
  elif look=='temple':
   M.rug(art,(920,179,1068,305),'textiles-sage',False)
   # Warm marble perimeter, interrupted by original stone joints.
   for b in [(192,480,719,492),(192,948,719,960),(192,492,204,948),(708,492,720,948)]:
    box(art,'mud:5',b)
  else:M.rug(art,(748,206,894,275),'sanctum-cloth',False)
 elif look=='manor':
  M.boards(art,(0,0,w-1,h-1))
  M.flags(art,(1080,162,1824,529),'sandstone:3','sandstone:2','mud:5')
  M.flags(art,(1344,530,1824,865),'grey-brown-rock:3','mud:4','mud:5')
  M.flags(art,(1248,902,1824,1080),'grey-brown-rock:3','mud:4','mud:5')
  M.flags(art,(960,866,1247,1080),'marble:2','marble:3','marble:2')
  for b,r,m in [((769,263,1024,310),'textiles-teal',False),((400,566,592,624),'textiles-sage',False),((700,561,900,624),'textiles-teal',False),((504,728,867,847),'textiles-russet',True),((504,919,867,1038),'textiles-sage',True),((185,291,314,422),'textiles-sage',True)]:M.rug(art,b,r,m)
  for p in MAPS[F.CURRENT].get('rugs',[]):R.rug(art,p)
  # Beds have a quieter matching runner below their footboards.
  M.boards(art,(1078,552,1244,626))
 # Grime grows at actual wall contacts, with native depth variation along joints.
 mp=mask.load();ad=ImageDraw.Draw(art)
 r={'keep':'limestone:2','temple':'sandstone:2','crypt':'dark-masonry:4','manor':'parquet:3'}[look]
 for x in range(w):
  prev=False
  for y in range(h):
   cur=bool(mp[x,y])
   if cur and not prev:
    depth=3 if x%48<24 else 2
    ad.line((x,y,x,min(y+depth,h-1)),fill=c(*r.split(':')[:1],int(r.split(':')[1])))
   prev=cur
 im.paste(art,(0,0),mask);return im


def outcrop(im,p):
 q=F.path(p);x=min(a for a,b in q);u=max(a for a,b in q);y=min(b for a,b in q);v=max(b for a,b in q)
 b=(x-24,y-66,u+25,v+26);im.paste(C.cave_scene(im.size).crop(b),b[:2])
 # Registered Part C wall rock forms the new mass's articulated front and crown.
 wall=Image.open(BASE/'canon/surfaces/cave_rock-wall.png').convert('RGBA')
 crown=[(a,b-34) for a,b in q];d=ImageDraw.Draw(im)
 front=Image.new('L',im.size);fd=ImageDraw.Draw(front);fd.polygon(q,fill=255);fd.polygon(crown,fill=255)
 texture=F.fill_pattern(im.size,wall.crop((0,48,144,95)))
 im.paste(texture,(0,0),front)
 topmask=Image.new('L',im.size);ImageDraw.Draw(topmask).polygon(crown,fill=255)
 top=F.fill_pattern(im.size,wall.crop((0,8,144,48)));im.paste(top,(0,0),topmask)
 # Distinct top planes stay joined to the source-shaped basal contour.
 line(im,'grey-brown-rock:4',' '.join(f'{a},{b}' for a,b in crown[:5]),2)
 for a,b,hh in [(x+24,y+2,25),(x+58,y+7,25),(u-19,y+16,27)]:
  line(im,'grey-brown-rock:1',f'{a},{b} {a},{b+hh//2} {a-4},{b+hh//2+4} {a-4},{b+hh}',2)
  line(im,'grey-brown-rock:3',f'{a+3},{b+3} {a+3},{b+hh//2}',2)
 if u-x>120:
  # The source's southeast hollow cuts down into the rock, with a visible wall.
  poly(im,'grey-brown-rock:1',f'{x+26},{y-12} {x+45},{y-20} {x+61},{y-14} {x+66},{y+8} {x+77},{y+20} {x+61},{y+31} {x+34},{y+23} {x+23},{y+7}')
  poly(im,'grey-brown-rock:2',f'{x+26},{y-12} {x+45},{y-20} {x+61},{y-14} {x+59},{y-5} {x+39},{y-10} {x+31},{y+2} {x+34},{y+23} {x+23},{y+7}')
  line(im,'grey-brown-rock:3',f'{x+29},{y-11} {x+45},{y-17} {x+56},{y-13}',2)
 # Source base line, one native pixel, closes the front onto packed earth.
 d=ImageDraw.Draw(im);d.line(q[5:]+[q[0]],fill=c('grey-brown-rock',1),width=1)


def goblet(im,x,y,w=18):
 # Rolled rim, concave bowl, lit shoulder, stem collar and broad foot.
 a=w//2
 poly(im,'hoard-bronze:1',f'{x-a},{y+2} {x-a+3},{y} {x+a-3},{y} {x+a},{y+2} {x+a-1},{y+10} {x+4},{y+17} {x+2},{y+17} {x+2},{y+25} {x+7},{y+27} {x+7},{y+30} {x-7},{y+30} {x-7},{y+27} {x-2},{y+25} {x-2},{y+17} {x-4},{y+17} {x-a+1},{y+10}')
 poly(im,'loot-gold:4',f'{x-a+2},{y+4} {x+a-2},{y+4} {x+a-3},{y+10} {x+3},{y+15} {x-3},{y+15} {x-a+3},{y+10}')
 line(im,'loot-gold:6',f'{x-a+3},{y+1} {x+a-4},{y+1}',1);line(im,'hoard-bronze:2',f'{x-a+3},{y+3} {x+a-3},{y+3}',2)
 poly(im,'loot-gold:5',f'{x-a+3},{y+5} {x-a+1+5},{y+5} {x-2},{y+12} {x+2},{y+14} {x-3},{y+13} {x-a+4},{y+9}')
 line(im,'hoard-bronze:3',f'{x+a-4},{y+5} {x+a-4},{y+9} {x+2},{y+13}',2)
 line(im,'loot-gold:5',f'{x-1},{y+17} {x-1},{y+26}',2);line(im,'loot-gold:4',f'{x-5},{y+27} {x+5},{y+27}',2);line(im,'loot-gold:6',f'{x-4},{y+27} {x+1},{y+27}',1)


def hoard(im,bounds):
 x,y,u,v=map(F.at,bounds);f=new(u-x+1,v-y+1)
 # Single connected bank, with hanging coin strata and a broad lit crest.
 poly(f,'hoard-bronze:2','9,202 13,173 28,147 33,113 50,91 62,68 87,47 107,40 124,20 148,20 168,37 182,63 211,84 221,115 220,145 238,167 251,196 250,216 226,233 48,234 22,223')
 for colour,p in [('hoard-bronze:3','14,193 31,161 42,129 66,112 75,83 106,59 128,28 150,28 167,46 174,72 199,93 209,122 202,145 230,178 240,211 219,223 48,222 24,212'),('hoard-bronze:4','46,126 60,97 88,72 105,68 130,40 150,40 168,68 158,87 127,97 106,119 79,136'),('hoard-bronze:4','121,131 150,107 174,96 196,108 203,130 193,149 175,160 164,188 128,200 110,189 116,161'),('hoard-bronze:4','29,172 50,151 76,153 95,172 91,195 73,216 39,210'),('hoard-bronze:3','170,185 191,157 215,160 236,192 234,213 210,222 184,217')]:poly(f,colour,p)
 # Coin groups are drawn once at named offsets, without a scallop lattice.
 groups=[(125,33,13,4),(142,39,9,5),(112,49,10,3),(155,52,13,4),(99,62,9,5),(127,59,11,4),(145,70,8,4),(85,78,12,3),(106,80,13,4),(120,74,8,5),(151,86,12,4),(67,96,10,4),(82,104,13,3),(97,97,9,5),(116,110,12,4),(61,119,13,4),(48,129,9,3),(75,126,11,4),(91,136,12,5),(153,110,10,5),(173,102,12,4),(188,118,10,3),(165,126,13,4),(144,137,11,5),(181,142,12,3),(158,152,9,4),(131,161,12,4),(116,176,10,5),(143,178,14,3),(161,191,10,5),(129,199,13,4),(144,211,10,4),(48,163,10,5),(64,171,14,3),(31,181,12,4),(45,193,9,5),(65,199,11,4),(82,185,12,3),(79,214,11,4),(33,207,10,3),(189,177,12,4),(209,170,9,5),(220,191,11,4),(193,198,14,4),(206,211,12,3),(225,213,9,4),(101,209,8,4)]
 for i,(a,b,w,h) in enumerate(groups):
  # Unequal overlays make sideways coins, face-up coins and short stacks.
  poly(f,'hoard-bronze:1',f'{a+2},{b} {a+w-2},{b} {a+w},{b+2} {a+w},{b+h} {a+w-2},{b+h+2} {a+1},{b+h+2} {a},{b+h} {a},{b+2}')
  box(f,'loot-gold:4',(a+1,b+2,a+w-1,b+h));line(f,'loot-gold:5',f'{a+2},{b} {a+w-3},{b}',1)
  if i in (0,5,11,17,20,26,31,38,44):
   line(f,'hoard-bronze:2',f'{a+2},{b+h} {a+w-2},{b+h}',1);line(f,'loot-gold:6',f'{a+3},{b+1} {a+6},{b+1}',1)
  if i in (1,4,9,15,19,23,30,35,41):
   line(f,'loot-gold:4',f'{a-4},{b+7} {a+w-3},{b+7}',3);line(f,'loot-gold:5',f'{a-2},{b+6} {a+w-4},{b+6}',1)
 # Bright metal edges are discontinuous connected groups on avalanche fronts.
 for p in ['19,202 26,206 35,206','81,210 86,205 91,205','119,217 127,221 139,221','170,206 175,198 181,195','200,220 210,222 221,220','43,142 51,146 63,146','175,76 185,82 190,90','116,87 125,83 135,83']:
  line(f,'loot-gold:4',p,2)
 # Overlapping currency follows the bank's slopes. The irregular rows below
 # are a placed drawing, not a random scatter or repeated five-coin stamp.
 rows=[(40,[122,132,144]),(49,[107,119,134,148,158]),(58,[97,111,123,139,151,163]),(69,[86,99,115,128,142,157,169]),(80,[77,90,104,118,133,147,163,176]),(91,[65,79,95,109,123,140,154,168,184]),(102,[54,68,83,99,113,130,145,160,176,190]),(113,[44,58,74,89,105,121,136,153,168,183,197]),(124,[38,51,66,80,97,112,129,143,159,175,190,204]),(135,[34,47,62,77,93,108,124,140,155,173,187,202]),(146,[30,42,58,73,89,104,120,135,152,166,182,197,210]),(157,[24,38,51,67,81,96,113,127,144,159,174,191,205,219]),(168,[20,32,47,60,77,92,108,122,139,154,169,186,201,216,228]),(179,[17,28,43,57,73,88,103,119,135,150,166,181,198,212,229,239]),(190,[17,30,42,58,72,86,102,117,132,148,163,178,193,208,224,237]),(202,[22,36,49,64,78,93,109,124,139,155,170,185,200,216,231]),(213,[31,46,60,76,90,106,121,137,151,168,184,199,214,225])]
 for row,(yy,xs) in enumerate(rows):
  for col,xx in enumerate(xs):
   ww=[8,10,7,11,9,8,12][(row+col)%7];dy=[0,-2,2,1,-1][(row*2+col)%5];yy2=yy+dy
   # Short side-on edges alternate with face-up and tilted coin faces.
   if (row+col)%3==0:
    line(f,'hoard-bronze:2',f'{xx},{yy2+2} {xx+ww},{yy2+2}',3);line(f,'loot-gold:4',f'{xx+1},{yy2} {xx+ww-1},{yy2}',2);line(f,'loot-gold:5',f'{xx+2},{yy2} {xx+ww-3},{yy2}',1)
   elif (row+col)%3==1:
    poly(f,'hoard-bronze:2',f'{xx},{yy2+3} {xx+ww-3},{yy2} {xx+ww},{yy2+2} {xx+ww},{yy2+5} {xx+3},{yy2+7} {xx},{yy2+5}')
    line(f,'loot-gold:4',f'{xx+2},{yy2+3} {xx+ww-3},{yy2+1}',3);line(f,'loot-gold:5',f'{xx+2},{yy2+2} {xx+ww-4},{yy2+1}',1)
   else:
    poly(f,'hoard-bronze:2',f'{xx+2},{yy2} {xx+ww-2},{yy2} {xx+ww},{yy2+2} {xx+ww-1},{yy2+5} {xx+1},{yy2+5} {xx},{yy2+3}')
    line(f,'loot-gold:4',f'{xx+2},{yy2+2} {xx+ww-2},{yy2+2}',3);line(f,'loot-gold:5',f'{xx+2},{yy2} {xx+ww-3},{yy2}',1)
 # Three vessels, a tilted plate and a chased crown interrupt the coin rhythm.
 goblet(f,74,67,24);goblet(f,179,149,19);goblet(f,94,174,17)
 poly(f,'hoard-bronze:1','178,44 184,51 188,49 194,56 200,51 208,43 209,69 204,76 181,76')
 poly(f,'loot-gold:4','181,49 186,57 190,54 195,62 202,56 206,49 205,69 201,72 184,72')
 line(f,'loot-gold:6','184,68 201,68',2);line(f,'hoard-bronze:3','185,60 185,65',2);line(f,'loot-gold:5','200,60 200,65',2)
 framed(f,(190,66,196,73),'hoard-bronze',2);box(f,'textiles-teal:4',(192,68,194,71))
 # A wide silver salver has a hollow centre, rolled rim and chased leaf strokes.
 d=ImageDraw.Draw(f);d.ellipse((97,120,143,140),fill=c('iron',1));d.ellipse((99,121,141,137),fill=c('iron',4));d.ellipse((103,124,137,134),fill=c('iron',3));line(f,'iron:5','107,122 130,122',2)
 for p in ['108,126 114,129 119,129','130,127 125,131 118,131']:line(f,'iron:4',p,1)
 # Linked necklace, separate from the silver platter and foreground coins.
 for a,b in [(201,127),(207,130),(212,135),(214,141),(212,147)]:
  line(f,'loot-gold:4',f'{a},{b} {a+3},{b} {a+4},{b+3} {a+1},{b+4} {a},{b}',1)
 fx=F.at(448)-x;fy=F.at(1280)-y;brazier(f,fx,fy);im.alpha_composite(f,(x,y));return [fx+x,fy+y]


def breach(im,points):
 top=[(144,657),(177,663),(195,676),(230,678),(249,681),(278,665),(303,653),(335,654),(352,663),(382,665),(407,637),(427,610),(452,606),(472,613),(497,639),(523,668),(548,682),(572,695),(597,691),(620,684),(644,674),(668,656),(692,634),(713,612),(740,616),(763,626),(790,637),(816,645)]
 bottom=[(144,727),(182,743),(225,756),(270,743),(319,730),(363,745),(398,727),(434,685),(472,688),(518,726),(562,763),(608,752),(656,736),(700,711),(738,676),(780,695),(816,693)]
 d=ImageDraw.Draw(im);d.polygon(top+bottom[::-1],fill=c('breach-stone',1))
 # Native molten pockets from four different source regions, never reduced.
 src=Image.open(REVIEW/'D6-cave-source.png').convert('RGB')
 for b,at in [((653,1043,777,1137),(151,667)),((1013,860,1129,956),(379,616)),((946,909,1058,1000),(516,685)),((1133,707,1246,805),(687,620))]:
  crop=src.crop(b);p=new(*crop.size);pixels=[]
  for rr,g,bb in crop.get_flattened_data():
   if rr>g*1.45 and rr>bb*1.5:
    tag='lair-breach:5' if rr>205 else 'lair-breach:4' if rr>150 else 'lair-breach:3';pixels.append(rgba(tag))
   else:pixels.append((0,0,0,0))
  p.putdata(pixels);C.cleanup(p)
  # Clip pocket art to the same broken-floor cavity.
  cm=Image.new('L',im.size);ImageDraw.Draw(cm).polygon(top+bottom[::-1],fill=255)
  a=cm.crop((at[0],at[1],at[0]+p.width,at[1]+p.height));p.putalpha(ImageChops.multiply(p.getchannel('A'),a));p.putdata([q if q[3] else (0,0,0,0) for q in p.get_flattened_data()]);im.alpha_composite(p,at)
 # The north bank is one fractured rock face, with differing overhang depths.
 inner=[(x,y+dep) for (x,y),dep in zip(top,[19,25,29,23,26,32,25,19,30,23,30,27,22,25,29,20,26,24,31,23,28,24,31,25,22,29,23,25])]
 face=Image.new('L',im.size);ImageDraw.Draw(face).polygon(top+inner[::-1],fill=255)
 rock=Image.open(BASE/'canon/surfaces/cave_rock-wall.png').crop((0,48,144,95)).convert('RGBA')
 # Preserve the wall's distinct bedding planes; nearest RGB would collapse
 # both brown mineral faces into one sandstone value.
 remap={rgba('grey-brown-rock:1'):rgba('sandstone:1'),rgba('grey-brown-rock:2'):rgba('sandstone:2'),rgba('mud:3'):rgba('sandstone:3')}
 rock.putdata([remap.get(p,p) for p in rock.get_flattened_data()])
 faceart=F.fill_pattern(im.size,rock);im.paste(faceart,(0,0),face)
 # Broken paving reaches right to the fracture. Unequal chips reveal the face.
 for i in range(0,len(top)-1):
  a,b=top[i:i+2];ImageDraw.Draw(im).line([a,b],fill=c('sandstone',3),width=2)
 for p in ['165,663 171,663 171,675 177,680 177,690','253,681 253,695 246,703','329,655 329,667 335,673 335,683','411,633 411,650 416,656','486,628 486,641 493,650 493,656','581,696 581,710 587,715 587,723','649,671 649,687 644,695','733,615 733,628 740,632 740,641','794,640 794,658 800,663']:
  line(im,'sandstone:1',p,2)
 for p in ['176,666 188,671','302,655 316,655','429,611 442,609','549,686 560,690','702,624 711,615','750,622 762,628']:
  line(im,'sandstone:4',p,2)
 # South crust contains broad flakes, joints and exposed scorched undersides.
 for p in ['148,727 166,731 180,743 172,750 151,739','218,752 238,750 251,742 260,750 241,760 222,760','308,730 326,733 344,738 341,745 318,741','431,685 446,683 461,688 456,698 438,694','548,758 562,763 582,759 586,768 564,774 548,767','644,742 661,734 675,721 681,727 667,742 651,749','748,684 764,692 778,695 777,702 759,700 745,692']:
  poly(im,'sandstone:2',p)
 for p in ['154,731 166,735','224,754 237,753 247,749','316,733 329,737','439,687 453,690','553,761 563,766 578,762','650,742 662,735','753,690 765,696']:
  line(im,'sandstone:3',p,2)
 # A few detached crust faces are unique in size and angle.
 for p in ['273,699 284,694 298,696 303,703 295,710 281,709','463,657 478,655 489,663 482,672 468,671','612,714 623,705 637,708 643,716 633,726 619,723']:
  poly(im,'breach-stone:2',p)
 for p in ['278,700 286,697 296,699','467,659 476,658 485,663','617,714 625,709 635,712']:line(im,'embers:3',p,2)
 x,y=[(F.at(a),F.at(b)) for a,b in points][-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',3);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:6',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
 return [x,y-35]


def ring(im,centre,rx,ry,ramp,step=5):
 if rx!=240:return S.ring(im,centre,rx,ry,ramp,step)
 cx,cy=centre;under=im.copy();out=S.outline_points(cx,cy,rx,ry)
 # Individually fitted radial stones. Circular edges remain the ordered native
 # ellipse raster, while each joint, chip and wear plane belongs to one stone.
 outer=Image.new('L',im.size);od=ImageDraw.Draw(outer);od.polygon(out,fill=255);od.polygon(S.outline_points(cx,cy,rx-15,ry-15),fill=0)
 d=ImageDraw.Draw(im);im.paste(canvas(im.size,'sanctum-cloth:2'),(0,0),outer)
 mid=Image.new('L',im.size);md=ImageDraw.Draw(mid);md.polygon(S.outline_points(cx,cy,rx-2,ry-2),fill=255);md.polygon(S.outline_points(cx,cy,rx-12,ry-12),fill=0)
 im.paste(canvas(im.size,'lair-sanctum:4'),(0,0),mid)
 # A lit upper arris is contained within the individual fitted inlay pieces.
 lip=Image.new('L',im.size);ld=ImageDraw.Draw(lip);ld.polygon(S.outline_points(cx,cy,rx-3,ry-3),fill=255);ld.polygon(S.outline_points(cx,cy,rx-5,ry-5),fill=0)
 im.paste(canvas(im.size,'lair-sanctum:5'),(0,0),lip)
 angles=[0,9,21,34,47,59,72,84,96,109,121,134,148,161,173,186,199,212,226,237,249,261,273,285,299,312,325,338,349]
 for i,deg in enumerate(angles):
  a=math.radians(deg);ax=round(cx+(rx+1)*math.cos(a));ay=round(cy+(ry+1)*math.sin(a));bx=round(cx+(rx-16)*math.cos(a));by=round(cy+(ry-16)*math.sin(a))
  joint=Image.new('L',im.size);ImageDraw.Draw(joint).line((ax,ay,bx,by),fill=255,width=2)
  joint=ImageChops.multiply(joint,outer);im.paste(under,(0,0),joint)
  # Light catch beside each cut, clipped to its stone (no stray glow).
  cut=Image.new('L',im.size);ImageDraw.Draw(cut).line((ax-2,ay,bx-2,by),fill=255,width=1);cut=ImageChops.multiply(cut,mid);im.paste(canvas(im.size,'lair-sanctum:5'),(0,0),cut)
 # Worn mineral facets, each follows a short arc within a different stone.
 for lo,hi,rr in [(16,19,8),(41,45,7),(64,69,9),(100,105,8),(126,131,7),(152,157,8),(181,184,9),(219,222,8),(242,246,9),(278,282,8),(302,308,7),(329,334,8)]:
  q=[(round(cx+(rx-rr)*math.cos(math.radians(a))),round(cy+(ry-rr)*math.sin(math.radians(a)))) for a in range(lo,hi+1)]
  m=Image.new('L',im.size);ImageDraw.Draw(m).line(q,fill=255,width=2);im.paste(canvas(im.size,'sanctum-cloth:3'),(0,0),ImageChops.multiply(m,mid))
 # Socket contacts are keyed into the stone ring, not floating on the floor.
 for x,y,u,v in [(240,432,255,456),(288,384,309,419),(384,384,389,391),(624,528,654,535),(672,576,667,581),(624,624,665,624),(624,720,635,730),(576,768,586,783),(432,816,432,834),(336,816,341,816),(288,768,276,780),(240,720,225,722),(192,576,195,576)]:
  line(im,'dark-masonry:3',f'{x},{y} {u},{v}',6);line(im,'lair-sanctum:4',f'{x},{y} {u},{v}',3)
 return out


def bones(idx):
 # Distinct anatomical clusters; no square-eyed circle or long stick-rib glyph.
 pic=new(48,48)
 k=idx%5
 if k==0:
  poly(pic,'bone:1','8,18 12,12 19,11 24,17 28,12 35,12 40,18 39,26 34,31 27,29 24,25 20,31 12,29 8,24')
  poly(pic,'bone:3','11,18 14,14 18,14 23,20 26,20 30,15 35,15 37,20 35,26 31,27 27,23 23,22 18,27 13,25')
  line(pic,'bone:4','13,17 16,15 19,18',2);line(pic,'bone:4','30,17 34,17 35,20',2)
  poly(pic,'bone:1','13,19 16,18 19,21 16,24 13,22');poly(pic,'bone:2','29,20 33,19 34,22 31,25 28,23')
  line(pic,'bone:2','10,37 17,35 23,35 30,31',5);line(pic,'bone:4','11,35 17,33 23,33 29,30',2)
 elif k==1:
  poly(pic,'bone:1','9,15 15,10 24,11 31,16 29,22 24,24 22,29 17,30 12,27 10,22')
  poly(pic,'bone:3','12,16 16,13 23,14 27,17 26,21 21,23 19,27 15,26 13,21');line(pic,'bone:4','14,17 18,15 23,17',2)
  line(pic,'bone:2','7,39 15,36 24,36 35,31',5);line(pic,'bone:4','8,37 16,34 24,34 33,30',2)
  for x,y in [(29,16),(31,22),(34,28)]:
   poly(pic,'bone:2',f'{x-3},{y} {x+2},{y-2} {x+5},{y+1} {x+3},{y+5} {x-2},{y+5}');line(pic,'bone:3',f'{x-1},{y} {x+2},{y}',2)
 elif k==3:
  # Collapsed thorax with curved short ribs enclosing a shaded interior.
  poly(pic,'bone:1','12,12 19,9 28,11 35,18 36,27 30,34 20,36 12,29 9,21')
  for p in ['13,15 18,12 25,13 31,18 31,22','11,21 15,18 23,18 29,23 30,28','13,27 18,24 24,25 27,30 26,33']:
   line(pic,'bone:3',p,3)
  for p in ['14,14 18,12 24,13','13,20 16,18 22,18','15,26 18,24 23,25']:line(pic,'bone:4',p,1)
  line(pic,'bone:2','19,10 18,17 20,23 20,32',4)
  line(pic,'bone:3','8,40 18,39 27,36 36,36',3)
 elif k==4:
  # Broken femurs have broad knuckles and a tapered shaft, not crossed sticks.
  poly(pic,'bone:2','8,12 13,9 17,12 17,17 23,25 28,29 33,28 38,32 36,37 30,38 26,33 21,30 14,21 9,18')
  poly(pic,'bone:3','10,13 13,12 15,15 15,18 22,27 29,32 33,31 35,34 32,35 28,33 20,28 12,18')
  line(pic,'bone:4','11,13 14,16 14,19 20,26',2)
  poly(pic,'bone:2','27,10 31,8 35,12 34,16 31,18 25,28 20,34 19,39 14,41 10,38 12,34 17,32 23,24 28,15')
  line(pic,'bone:4','29,11 31,13 29,17 25,23',2);line(pic,'bone:3','24,27 18,35 15,37',3)
 if idx%5==2:
  # Profile skull: cranial dome, cheek arch, nasal notch, eye and separate jaw.
  pic=new(48,48)
  poly(pic,'bone:1','10,20 10,13 14,9 20,7 29,7 34,10 38,16 38,24 34,26 34,31 27,35 17,35 13,31 11,27 8,25 8,21')
  poly(pic,'bone:3','12,15 16,11 22,9 29,9 34,12 36,17 35,22 30,27 26,27 24,31 17,31 15,27 11,24')
  poly(pic,'bone:4','15,15 19,11 28,11 32,13 34,17 30,18 27,16 22,16 19,20 15,20')
  poly(pic,'bone:1','22,18 27,17 30,20 29,24 24,25 21,22');line(pic,'bone:2','13,22 16,24 17,27',2)
  poly(pic,'bone:2','28,28 33,27 32,31 27,33 19,33 18,30 22,31 26,31')
  line(pic,'bone:4','21,32 27,32',1);line(pic,'bone:2','7,40 18,39 23,36 32,36',4);line(pic,'bone:3','9,38 17,38 22,35 30,35',2)
 return pic

COUNTS={}
def place(im,name,xy,records,group='reference'):
 key=(F.CURRENT,name);idx=COUNTS.get(key,0);COUNTS[key]=idx+1;x,y=map(F.at,xy)
 if name in ('bones','crypt-study'):
  pic=bones(idx+(1 if name=='crypt-study' else 0));im.alpha_composite(pic,(x-24,y-24));records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-24,y-24,x+24,y+24],group=group,variant=idx));return
 if F.CURRENT=='manor-ground' and name=='bed':
  r=['textiles-sage','textiles-teal','textiles-russet'][idx%3]
  # Mattress, soft rounded pillow, folded blanket and a substantial front rail.
  framed(im,(x-20,y-32,x+20,y+29),'wood-oak',2)
  box(im,'wood-oak:3',(x-19,y-31,x+19,y-26));line(im,'wood-oak:5',f'{x-17},{y-31} {x+17},{y-31}',1)
  box(im,'bone:3',(x-16,y-25,x+16,y+18))
  poly(im,'bone:2',f'{x-13},{y-25} {x+12},{y-25} {x+15},{y-22} {x+14},{y-15} {x+10},{y-13} {x-12},{y-14} {x-15},{y-17} {x-15},{y-22}')
  poly(im,'bone:4',f'{x-11},{y-24} {x+10},{y-24} {x+13},{y-21} {x+12},{y-17} {x+8},{y-15} {x-11},{y-16} {x-13},{y-19}')
  box(im,r+':3',(x-16,y-10,x+16,y+17));box(im,r+':4',(x-15,y-10,x+15,y-7));line(im,r+':2',f'{x-15},{y-5} {x+15},{y-5}',1)
  for a,b,ln in [(-10,-2,10),(6,1,12),(-3,9,6)]:
   line(im,r+':2',f'{x+a},{y+b} {x+a},{y+b+ln}',1);line(im,r+':4',f'{x+a+2},{y+b} {x+a+2},{y+b+ln-3}',1)
  line(im,r+':4',f'{x-14},{y+14} {x+14},{y+14}',1)
  framed(im,(x-19,y+19,x+19,y+27),'wood-oak',3);line(im,'wood-oak:5',f'{x-17},{y+19} {x+17},{y+19}',1);line(im,'wood-oak:2',f'{x-14},{y+24} {x+13},{y+24}',1)
  for xx in (x-20,x+16):
   box(im,'wood-oak:2',(xx,y+13,xx+4,y+32));box(im,'wood-oak:4',(xx+1,y+14,xx+2,y+29));box(im,'wood-oak:5',(xx,y+12,xx+4,y+14))
  records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-21,y-33,x+21,y+33],group=group));return
 V.place(im,name,xy,records,group)
 if F.CURRENT=='manor-ground' and name=='hearth' and tuple(xy) not in {(1912,456),(1912,520)}:
  # Each fireplace retains its source centre but gets a different mantle and
  # chimney treatment: plaster hood, stone arch, timber mantel, or kitchen rack.
  if idx%3==0:
   poly(im,'plaster:2',f'{x-19},{y-69} {x+19},{y-69} {x+24},{y-43} {x-24},{y-43}')
   poly(im,'plaster:3',f'{x-17},{y-68} {x+16},{y-68} {x+21},{y-47} {x-21},{y-47}')
   line(im,'plaster:2',f'{x-6},{y-65} {x-6},{y-57} {x+3},{y-57}',2)
  elif idx%3==1:
   for yy,xxs in [(y-61,[x-17,x+4]),(y-51,[x-4,x+16])]:
    line(im,'limestone:2',f'{x-20},{yy} {x+20},{yy}',2)
    for xx in xxs:line(im,'limestone:2',f'{xx},{yy-8} {xx},{yy}',1)
   box(im,'wood-oak:2',(x-33,y-43,x+33,y-38));line(im,'wood-oak:5',f'{x-31},{y-42} {x+31},{y-42}',1)
  else:
   line(im,'iron:2',f'{x-26},{y-48} {x+26},{y-48}',3)
   for xx,hh in [(x-17,12),(x+9,17)]:
    line(im,'iron:3',f'{xx},{y-48} {xx},{y-48+hh}',2);framed(im,(xx-4,y-48+hh,xx+4,y-43+hh),'iron',2)
  if idx in (0,3,8):
   for xx,ww in [(x-26,7),(x-17,9),(x+19,6)]:framed(im,(xx,y-48,xx+ww,y-43),'textiles-teal' if idx==0 else 'bone',3)


def manor_wall(im,mask):
 target=BASE/'canon/surfaces/manor-wall.png';original=target.read_bytes();wall=Image.open(target).convert('RGBA')
 # Native oak grain in dark structural timber; plaster has sparse source wear.
 source=M.master().crop((298,110,442,150)).convert('RGB')
 grain=new(144,40);grain.putdata([rgba('timber:3' if sum(p)>315 else 'timber:2') for p in source.get_flattened_data()]);tidy(grain);wall.paste(grain,(0,8))
 box(wall,'plaster:2',(0,48,143,79))
 # Uneven lime plaster patches are placed against timber contacts only.
 for p in ['3,51 11,51 11,54 8,54 8,58 3,58','40,65 45,65 45,76 39,76 39,72 42,72 42,68','91,51 98,51 98,55 94,55 94,62 91,62','121,71 127,71 127,74 135,74 135,78 121,78']:
  poly(wall,'ash:2',p)
 box(wall,'timber:2',(0,80,143,94));line(wall,'timber:3','0,80 143,80',2);line(wall,'timber:1','0,95 143,95',1)
 for x in (0,96):
  # The plaster stays continuous; no repeating window-like framed panels.
  line(wall,'timber:1',f'{x+10},86 {x+38},86',1);line(wall,'timber:3',f'{x+10},85 {x+36},85',1)
 wall.save(target)
 try:return R.original_walls(im,mask,'manor')
 finally:target.write_bytes(original)


def yard(im,mask):
 im=V.yard(im,mask)
 # The overworld source supplies native grass blades, palette-locked as a
 # sparse turf texture; broad two-value camouflage fields are discarded.
 grass=Image.open('art-drop/dungeon/reference/overworld-grass-0.png').convert('RGB');g=new(*grass.size)
 g.putdata([rgba('yard-grass:4' if p[1]>130 and p[0]>105 else 'yard-grass:3') for p in grass.get_flattened_data()]);tidy(g)
 tex=F.fill_pattern(im.size,g);a=im.load();t=tex.load();colours={rgba('yard-grass:3'),rgba('yard-grass:4')}
 for yy in range(im.height):
  for xx in range(im.width):
   if a[xx,yy] in colours:a[xx,yy]=t[xx,yy]
 # Broken edge contacts, hoof-worn patches and a single widened garden landing.
 for p in ['83,247 90,247 90,272 95,272 95,291 85,291','104,507 118,507 118,528 124,528 124,552 115,552 115,537 104,537','80,932 92,932 92,951 99,951 99,972 88,972 88,957 80,957','296,1129 324,1129 324,1136 342,1136 342,1142 305,1142 305,1137 296,1137','1204,1154 1235,1154 1235,1164 1267,1164 1267,1170 1223,1170 1223,1163 1204,1163','1839,425 1854,425 1854,438 1889,438 1889,467 1859,467 1859,478 1839,478']:
  poly(im,'yard-path:3',p)
 for p in ['91,265 100,265 100,276','109,521 114,521 114,532','88,947 95,951 95,961','312,1137 327,1137 327,1140','1229,1162 1245,1162 1245,1166','1859,445 1875,445 1875,451']:
  line(im,'yard-path:4',p,2)
 # Individual connected grass clumps at the worn path margin.
 for x,y,h,side in [(78,261,8,1),(121,516,11,-1),(79,941,7,1),(332,1170,9,-1),(578,1131,8,1),(820,1171,10,-1),(1222,1171,8,-1),(1439,1130,11,1),(1879,354,8,1),(1881,570,10,1),(1839,934,9,-1),(943,1204,7,1)]:
  line(im,'yard-grass:4',f'{x},{y} {x},{y-h} {x+side*3},{y-h-4}',2);line(im,'yard-grass:4',f'{x},{y} {x+side*5},{y-5} {x+side*7},{y-9}',2)
 # Full plant heads replace the outlined blobs: outer folded leaves, vein,
 # overlapping inner leaves and an irregular light-facing edge.
 for idx,(x,y,w,h) in enumerate([(1900,269,24,20),(1918,302,22,24),(1899,341,27,22),(1921,366,18,19)]):
  poly(im,'overgrowth:2',f'{x},{y+6} {x+5},{y} {x+w-6},{y} {x+w},{y+7} {x+w-2},{y+h-3} {x+w-7},{y+h} {x+5},{y+h} {x},{y+h-6}')
  poly(im,'overgrowth:3',f'{x+2},{y+6} {x+7},{y+2} {x+w-6},{y+3} {x+w-2},{y+8} {x+w-5},{y+h-4} {x+7},{y+h-2} {x+3},{y+h-7}')
  for p in [f'{x+4},{y+7} {x+8},{y+5} {x+11},{y+8} {x+11},{y+14}',f'{x+w-4},{y+9} {x+w-9},{y+8} {x+w-12},{y+12} {x+w-10},{y+h-3}']:
   line(im,'overgrowth:4',p,2)
  line(im,'overgrowth:2',f'{x+5},{y+h-5} {x+9},{y+h-7} {x+12},{y+h-4}',2)
 # Broad aromatic herb clusters are rooted into the second bed.
 for x,y,w,h in [(1899,450,16,31),(1921,476,18,39),(1900,523,22,27),(1920,558,18,30)]:
  for dx,dy,ww in [(1,6,7),(w-8,10,8),(2,19,9),(w-10,h-5,8)]:
   poly(im,'overgrowth:3',f'{x+dx},{y+dy} {x+dx+3},{y+dy-4} {x+dx+ww},{y+dy-3} {x+dx+ww+1},{y+dy+1} {x+dx+ww-3},{y+dy+5} {x+dx+2},{y+dy+4}')
   line(im,'overgrowth:4',f'{x+dx+3},{y+dy-2} {x+dx+ww-1},{y+dy-1}',2)
 # Bean leaves overlap the trellis, with bent pods at distinct heights.
 for x,y,side in [(1911,783,-1),(1917,748,1),(1921,711,-1),(1921,690,1),(1927,765,1)]:
  q=[(x,y+3),(x+side*4,y-6),(x+side*11,y-9),(x+side*14,y-3),(x+side*9,y+4),(x+side*4,y+6)];ImageDraw.Draw(im).polygon(q,fill=c('overgrowth',3));line(im,'overgrowth:4',f'{x+side*3},{y+1} {x+side*10},{y-5}',2)
 for p in ['1909,735 1907,745 1911,749','1924,718 1927,730 1924,736','1918,789 1920,799 1917,804']:line(im,'overgrowth:4',p,3)
 # Octagonal well: continuous water opening, capstones and two masonry courses.
 box(im,'yard-grass:3',(16,535,83,631))
 poly(im,'yard-cobble:1','20,583 27,575 69,575 78,583 78,605 69,615 28,615 20,605')
 poly(im,'yard-cobble:3','22,585 29,579 67,579 76,585 76,603 67,612 30,612 22,603')
 poly(im,'yard-cobble:4','20,582 29,574 68,574 78,582 78,591 69,599 29,599 20,591')
 poly(im,'yard-cobble:1','27,583 33,579 64,579 71,583 71,589 65,593 33,593 27,589')
 poly(im,'sewer-water:2','29,585 35,581 63,581 69,585 68,589 63,591 35,591 29,589')
 line(im,'sewer-water:3','36,584 54,584',2);line(im,'yard-cobble:5','29,575 65,575',1)
 for pp in ['23,602 75,602','31,600 31,610','49,603 49,612','68,600 68,610','40,594 40,601','59,594 59,600','32,575 34,580','62,575 61,579','21,586 27,586','71,586 77,586']:
  line(im,'yard-cobble:2',pp,1)
 # Posts, mortised crossbeam, cylindrical windlass, handle and suspended bucket.
 for xx in (24,71):
  box(im,'timber:1',(xx,539,xx+4,591));box(im,'timber:3',(xx+1,541,xx+3,588));line(im,'timber:4',f'{xx+1},542 {xx+1},585',1)
 framed(im,(20,537,80,543),'timber',3);line(im,'timber:4','22,538 76,538',1)
 framed(im,(29,549,70,555),'wood-oak',3);line(im,'wood-oak:5','31,549 66,549',1);line(im,'wood-oak:2','31,553 66,553',1)
 for xx in (45,48,51,54):line(im,'bone:2',f'{xx},549 {xx},554',1)
 line(im,'iron:3','74,551 81,551 81,558',2);line(im,'bone:2','50,555 50,584',2)
 framed(im,(7,612,22,627),'wood-oak',3)
 for xx in (10,15,19):line(im,'wood-oak:2',f'{xx},615 {xx},625',1)
 line(im,'iron:3','8,616 21,616',2);line(im,'iron:3','8,623 21,623',2);line(im,'iron:2','9,611 9,606 19,606 19,611',1)
 # Bench back and seat share parallel front edges; leg braces carry the load.
 for xx in (1497,1593):
  box(im,'wood-oak:1',(xx,22,xx+5,67));box(im,'wood-oak:3',(xx+1,24,xx+3,65));line(im,'wood-oak:5',f'{xx+1},24 {xx+1},35',1)
 for yy in (24,32):
  framed(im,(1495,yy,1600,yy+5),'wood-oak',3);line(im,'wood-oak:4',f'1497,{yy+1} 1597,{yy+1}',1)
 line(im,'wood-oak:2','1512,27 1532,27 1536,28 1559,28',1);line(im,'wood-oak:2','1551,35 1578,35 1583,34 1591,34',1)
 line(im,'wood-oak:2','1503,61 1592,61',4);line(im,'wood-oak:4','1505,60 1589,60',1)
 for xx in (1500,1590):box(im,'iron:2',(xx,26,xx+2,28));box(im,'wood-oak:4',(xx-1,64,xx+5,67))
 return im

old_approach=D.approach
def approach(im,kind):
 if kind!='breach':return old_approach(im,kind)
 # These are fallen pieces of the damaged wall, with visible mortar scars.
 for p in ['1047,394 1053,394 1053,412 1045,412 1045,421','1036,451 1042,451 1042,471 1033,471 1033,483','1010,507 1018,507 1018,530 1008,530 1008,542','979,539 987,539 987,557 966,557','875,541 883,541 883,554 858,554']:
  line(im,'breach-stone:2',p,2)
 # Unequal side profiles, each with its own fracture face and missing corner.
 for top,front in [('1042,403 1056,400 1063,407 1058,414 1045,413','1045,413 1058,414 1058,420 1047,419'),('1031,465 1042,459 1058,465 1053,478 1037,482 1029,475','1037,482 1053,478 1051,487 1039,490'),('1012,520 1026,510 1044,515 1048,524 1036,532 1014,529','1014,529 1036,532 1034,542 1018,539'),('956,551 969,538 995,543 1003,557 989,567 966,563','966,563 989,567 988,577 970,573'),('850,554 864,536 892,541 908,555 895,570 861,569','861,569 895,570 892,582 867,580')]:
  poly(im,'sandstone:2',front);poly(im,'sandstone:3',top)
 for p in ['1045,404 1053,403','1034,465 1042,462 1052,465','1017,519 1026,514 1037,517','961,550 971,542 985,545','856,553 866,540 887,544']:
  line(im,'sandstone:4',p,2)
 for p in ['1052,406 1052,410 1057,413','1043,465 1043,473 1038,477','1032,519 1029,525 1029,533','984,549 980,556 980,570','879,546 875,557 880,565 880,576']:
  line(im,'sandstone:1',p,1)


def run_frames():
 V.setup_layout()
 lab=MAPS.pop('station_lab');manifest=json.loads((BASE/'frames/layout.json').read_text())['station_lab']
 # Install after the older setup functions so no legacy sprite dispatch wins.
 F.place=place;F.draw_walls=D.walls;F.feature_hoard=hoard;F.feature_breach=breach;R.ring=ring
 try:V.old_run()
 finally:MAPS['station_lab']=lab
 j=json.loads((BASE/'frames/layout.json').read_text());j['station_lab']=manifest;(BASE/'frames/layout.json').write_text(json.dumps(j,indent=2)+'\n')


def run():
 D.ground=ground;D.outcrop=outcrop;D.place=place;D.hoard=hoard;D.breach=breach;D.yard=yard;D.manor_wall=manor_wall;D.inset=V.inset;D.approach=approach
 F.run=run_frames;D.run()
 # Preserve the already-correct ordered southeast wall steps.
 for p in [BASE/'frames/hoard-keep.png',REVIEW/'D-hoard-keep-surface.png']:
  pic=Image.open(p).convert('RGBA');pic.putpixel((828,992),pic.getpixel((827,992)));pic.putpixel((792,1028),pic.getpixel((791,1028)))
  if p.parent.name=='frames':D.save_frame(pic,'hoard-keep')
  else:pic.save(p)
 # Explicitly preserve the passed quartet from this round, not an older snapshot.
 for p in (REVIEW/'D6-start/frames').glob('station_lab*.png'):shutil.copyfile(p,BASE/'frames'/p.name)
if __name__=='__main__':run()
