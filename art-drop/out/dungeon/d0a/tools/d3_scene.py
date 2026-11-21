"""Critic-three local scene repairs. Source objects and grid stay in place."""
from PIL import Image,ImageDraw,ImageChops
import d_frames as F
import d2_scene as S
import d_redraw_scene as R
from draw_proofs import BASE,c
from d_layouts import MAPS
from d_sprites import new,framed
from redraw_critic21 import canvas,poly,line,box
from d3_materials import ribbon,draw
from d3_props import brazier,altar


def ground(im,mask):
    art=canvas(im.size,'mud:4')
    # Individual exposed beds, drawn along the chamber and around its passages.
    # Each has a broad plane, raised edge, undercut and accumulated packed clay.
    beds=[
    ('214,264 256,264 290,259 321,251 352,242 389,236 420,241 452,249 479,260 507,271 541,282 579,290',26,5,12),
    ('272,340 312,340 347,336 381,329 408,319 433,307 454,294 479,281',21,4,9),
    ('480,202 528,202 566,207 599,217 630,229 658,244 686,259 716,273 750,284 789,292 833,296',34,5,11),
    ('710,194 742,194 772,201 800,211 825,224 847,239 867,257 886,277 904,298 924,319',22,3,9),
    ('1020,281 1064,281 1104,275 1142,269 1174,275 1204,285 1232,298 1258,313 1284,328 1314,340 1350,349 1392,354',29,5,13),
    ('1152,390 1188,390 1222,384 1252,374 1278,362 1303,349 1328,335 1356,323 1388,313 1426,307 1470,304',24,4,10),
    ('1580,295 1617,295 1652,288 1684,278 1713,267 1747,260 1775,266 1801,277 1825,292',28,5,9),
    ('180,550 217,550 250,544 281,536 313,528 344,533 374,541 402,552 429,565 455,578 486,588 522,594',32,5,13),
    ('233,625 274,625 312,620 347,613 377,602 405,590 430,576',19,4,8),
    ('638,629 678,629 714,622 747,613 777,600 811,591 851,585 887,590 919,599 948,611 974,626 999,642 1026,657',36,5,12),
    ('700,728 738,728 773,722 806,713 836,701 864,687 890,671 914,653 938,634 965,616',23,4,10),
    ('951,787 993,787 1031,782 1066,774 1097,762 1124,747 1149,730 1173,712 1200,696 1230,682 1266,673 1308,669',31,5,12),
    ('1320,844 1354,844 1385,835 1412,823 1436,808 1457,790 1475,769 1493,747 1514,727',26,4,9),
    ('697,919 735,919 771,913 803,903 832,890 859,876 888,863 921,853 959,847 992,852 1022,860',33,5,13),
    ('117,1053 156,1053 192,1048 226,1041 257,1046 285,1055 310,1067 334,1081 357,1096 383,1110',24,4,10),
    ('321,1183 361,1183 399,1177 434,1169 464,1157 492,1143 524,1133 561,1128 594,1134 624,1143 651,1155',30,5,12),
    ('1070,1164 1111,1164 1148,1158 1181,1149 1211,1136 1237,1121 1262,1105 1291,1092 1325,1082 1364,1076',35,4,11),
    ('1452,1086 1491,1086 1491,1080 1527,1080 1527,1071 1560,1071 1560,1058 1590,1058 1590,1043 1618,1043 1618,1031 1648,1031 1648,1022 1683,1022 1683,1017 1724,1017',28,5,10)]
    for p,depth,lip,toe in beds:
        ribbon(art,p,-depth*2,0,'grey-brown-rock:3',False)
        ribbon(art,p,-lip-3,0,'mud:5',False)
        ribbon(art,p,1,toe,'mud:4',False)
        # Long bedding striae follow a selected part of this same bed, with a
        # different start/end per ledge. They describe layers rather than speckle.
        from draw_proofs import pts
        q=pts(p);q=q[2:-3]
        draw(art,'mud:5',[(x,y-depth+7) for x,y in q],3)
        draw(art,'grey-brown-rock:4',[(x,y-2) for x,y in q[1:5]],2)
    for p in [
        '389,236 389,263 399,263 399,284 408,284 408,307',
        '599,229 599,257 589,257 589,280 579,280 579,309 566,309 566,341 566,368',
        '867,277 845,277 845,309 834,309 834,339 818,339 818,368',
        '1174,285 1174,313 1164,313 1164,345 1152,345 1152,390',
        '1426,304 1426,337 1438,337 1438,367 1451,367 1451,394',
        '1652,278 1652,311 1640,311 1640,341 1624,341 1624,369',
        '281,536 281,565 294,565 294,590 312,590 312,613',
        '811,585 811,615 823,615 823,643 838,643 838,671 836,671 836,687',
        '1097,747 1097,775 1110,775 1110,802 1126,802 1126,826',
        '1412,808 1412,838 1399,838 1399,868 1383,868 1383,898',
        '859,876 859,903 872,903 872,932 888,932 888,956',
        '399,1169 399,1200 414,1200 414,1225',
        '1211,1136 1211,1169 1224,1169 1224,1197']:
        draw(art,'mud:4',p,4)
    # Exposed flakes at bed junctions have top planes and buried lower edges.
    # These placements follow the specific shelves above, never a scatter grid.
    for p in [
      '308,274 329,269 348,271 366,280 377,288 369,296 350,292 333,283 316,281',
      '411,325 426,317 446,312 463,314 478,321 473,327 457,327 444,321 429,327',
      '540,240 561,239 580,246 593,257 587,264 567,257 552,250',
      '741,229 758,223 775,230 789,243 790,254 779,254 767,240 752,236',
      '827,308 839,299 851,300 860,312 860,325 850,331 839,319',
      '1080,304 1104,300 1124,304 1138,315 1129,320 1111,311 1095,310',
      '1232,355 1249,344 1263,346 1278,356 1271,362 1258,354 1240,362',
      '1354,326 1373,321 1394,323 1409,330 1404,335 1387,329 1370,332',
      '1660,311 1683,302 1704,304 1718,312 1711,319 1693,312 1674,317',
      '266,568 285,562 304,570 317,583 308,590 294,578 278,576',
      '340,614 356,603 373,598 390,601 400,610 388,615 374,607 358,613',
      '714,652 737,644 757,646 775,657 767,665 749,656 730,659',
      '822,701 838,689 854,681 869,684 880,694 871,699 856,692 838,704',
      '1040,800 1063,792 1081,795 1095,808 1086,815 1069,804 1054,807',
      '1382,851 1397,839 1414,835 1427,842 1434,854 1423,859 1410,846 1395,858',
      '771,930 790,920 812,917 830,924 841,935 828,941 811,929 792,933',
      '181,1081 201,1076 219,1082 231,1094 225,1102 209,1090 193,1089',
      '427,1196 444,1184 463,1181 478,1190 484,1201 471,1205 459,1194 441,1204',
      '1174,1180 1196,1171 1215,1177 1230,1190 1223,1198 1206,1185 1187,1187',
      '1563,1090 1583,1078 1604,1075 1620,1085 1611,1093 1595,1085 1579,1095']:
        poly(art,'mud:5',p)
    for p in [
      '313,275 329,272 346,274 360,281','419,324 433,319 445,316 457,317',
      '546,242 560,242 575,248','747,230 758,226 771,232',
      '1086,305 1104,303 1119,307','1239,354 1250,348 1262,350',
      '1665,311 1684,306 1699,307','272,568 285,566 299,573',
      '720,651 737,647 752,650','828,700 840,692 851,687',
      '1046,800 1062,796 1078,800','1388,850 1400,842 1413,840',
      '777,929 792,923 810,921','186,1082 200,1080 215,1086',
      '434,1194 447,1188 461,1185','1181,1179 1196,1175 1210,1181',
      '1570,1089 1585,1082 1601,1079']:
        line(art,'grey-brown-rock:4',p,2)
    # Clay accumulated at the actual wall foot, before any props are placed.
    mp=mask.load();d=ImageDraw.Draw(art)
    for x in range(im.width):
        prev=False
        for y in range(im.height):
            cur=bool(mp[x,y])
            if cur and not prev:d.line((x,y,x,min(y+4,im.height-1)),fill=c('mud',4))
            prev=cur
    im.paste(art,(0,0),mask)
    return im


def ingot(im,x,y,w=34,h=17):
    # Bevels, cast side and irregular metal edge; no repeated rectangular stamp.
    poly(im,'hoard-bronze:1',f'{x},{y+5} {x+5},{y} {x+w-5},{y} {x+w},{y+5} {x+w},{y+h} {x},{y+h}')
    poly(im,'hoard-bronze:4',f'{x+1},{y+5} {x+5},{y+1} {x+w-5},{y+1} {x+w-1},{y+5} {x+w-1},{y+8} {x+1},{y+8}')
    box(im,'hoard-bronze:3',(x+1,y+9,x+w-1,y+h-1))
    line(im,'hoard-bronze:5',f'{x+5},{y+1} {x+w-6},{y+1}',1)
    line(im,'hoard-bronze:5',f'{x+2},{y+7} {x+w-3},{y+7}',1)
    line(im,'hoard-bronze:4',f'{x+2},{y+10} {x+w//2},{y+10} {x+w//2},{y+11} {x+w-5},{y+11}',1)
    line(im,'hoard-bronze:2',f'{x+3},{y+h-2} {x+w-3},{y+h-2}',1)


def goblet(im,x,y,w=16):
    poly(im,'hoard-bronze:1',f'{x-w//2},{y} {x+w//2},{y} {x+w//2},{y+7} {x+4},{y+12} {x+2},{y+13} {x+2},{y+22} {x+7},{y+24} {x+7},{y+26} {x-7},{y+26} {x-7},{y+24} {x-2},{y+22} {x-2},{y+13} {x-5},{y+11} {x-w//2},{y+6}')
    poly(im,'hoard-bronze:4',f'{x-w//2+1},{y+2} {x+w//2-1},{y+2} {x+w//2-2},{y+7} {x+3},{y+11} {x-2},{y+11} {x-w//2+2},{y+7}')
    line(im,'hoard-bronze:6',f'{x-w//2+2},{y+1} {x+w//2-2},{y+1}',1)
    line(im,'hoard-bronze:5',f'{x-w//2+2},{y+3} {x-w//2+2},{y+6} {x-3},{y+10}',1)
    line(im,'hoard-bronze:5',f'{x},{y+12} {x},{y+22}',2);box(im,'hoard-bronze:4',(x-5,y+24,x+5,y+25))


def hoard(im,bounds):
    # Reuse the accepted cargo, shield and urn construction, replacing the broad
    # stamped bullion field with individually occluding vessel/cargo groupings.
    return revised_hoard(im,bounds)


# This function is populated below with the native scene construction.
def revised_hoard(im,bounds):
    x,y,u,v=map(F.at,bounds);f=new(u-x+1,v-y+1)
    # Packed, mutually occluding objects, without any silhouette backing polygon.
    S.cargo(f,78,28,88,60);S.cargo(f,33,76,81,59);S.cargo(f,134,67,78,61)
    S.cargo(f,15,129,78,62);S.cargo(f,93,119,81,66);S.cargo(f,173,143,64,63)
    S.cargo(f,46,176,88,49,True);S.cargo(f,125,183,76,42)
    # Separate piles are deliberately connected through overlaps and cargo contact.
    bars=[(102,13,42),(145,27,33),(71,37,45),(113,51,47),
          (29,95,40),(73,106,31),(188,108,35),(16,147,34),
          (194,164,44),(15,207,41),(55,218,44),(119,220,40)]
    for a,b,w in bars:ingot(f,a,b,w,13 if w<36 else 17)
    S.platter(f,32,139,35);S.platter(f,180,133,34);S.platter(f,126,177,29)
    goblet(f,61,79,18);goblet(f,152,67,15);goblet(f,87,177,20)
    # A bound roll of chased metal sheets rests behind the central shield.
    for xx,yy,ww in [(88,75,31),(92,80,35),(98,86,30)]:
        framed(f,(xx,yy,xx+ww,yy+8),'hoard-bronze',3)
        line(f,'hoard-bronze:5',f'{xx+2},{yy+1} {xx+ww-2},{yy+1}',1)
    # Contact wear belongs to these individual cargo boards, not a stamp.
    for pp in ['43,120 54,120 54,121 65,121','151,96 162,96 162,97 174,97',
               '109,153 120,153 120,154 132,154','185,185 197,185 197,186 210,186',
               '57,201 67,201 67,202 80,202']:
        line(f,'wood-oak:4',pp,1)
    # Oval shield is made from authored stepped runs and edge studs, in front of cargo.
    poly(f,'iron:1','96,99 125,99 133,107 133,139 128,148 113,160 98,148 92,139 92,107')
    poly(f,'iron:3','97,101 124,101 131,108 131,138 126,146 113,157 100,146 94,138 94,108')
    poly(f,'iron:4','99,103 122,103 129,109 129,121 96,121 96,109')
    line(f,'hoard-bronze:4','113,106 113,149',3);line(f,'hoard-bronze:4','100,119 126,119',3)
    for a,b in [(99,110),(125,110),(98,134),(127,134),(112,149)]:box(f,'hoard-bronze:5',(a,b,a+1,b+1))
    # Curved urn with rolled lip, belly planes, a pedestal foot and chased bands.
    poly(f,'hoard-bronze:1','151,150 173,150 173,158 180,165 184,177 184,188 179,197 173,201 173,205 150,205 150,201 143,194 140,185 140,177 144,165 151,158')
    poly(f,'hoard-bronze:4','152,153 171,153 171,159 177,166 181,178 181,187 177,195 170,199 152,199 146,192 143,185 143,178 147,167 154,160')
    poly(f,'hoard-bronze:5','152,164 158,161 159,190 155,196 149,191 146,184 146,177')
    line(f,'hoard-bronze:3','170,166 176,173 177,186 173,194',3)
    line(f,'hoard-bronze:6','152,151 171,151',1);line(f,'hoard-bronze:2','145,179 180,179',2)
    line(f,'hoard-bronze:5','146,178 180,178',1);box(f,'hoard-bronze:5',(150,202,172,204))
    fx=F.at(448)-x;fy=F.at(1280)-y
    brazier(f,fx,fy)
    im.alpha_composite(f,(x,y));return [fx+x,fy+y]



def inset(im,kind):
    b=S.inset(im,kind)
    if kind=='hoard':
        x,y,u,v=b
        floor=Image.open(BASE/'canon/surfaces/keep-floor.png').crop((0,0,168,104));im.paste(floor,(x+12,y+28))
        S.cargo(im,x+24,y+51,58,35,True);S.cargo(im,x+90,y+80,60,30,True)
        for dx,dy,w in [(21,85,35),(48,95,38),(81,104,37),(115,112,35)]:ingot(im,x+dx,y+dy,w,12)
        S.platter(im,x+63,y+77,27);brazier(im,x+139,y+45,True)
    return b


def sanctum(im,bounds):
    result=S.sanctum(im,bounds)
    # Clear only the old marker's footprint before replacing it in place.
    floor=Image.open(BASE/'canon/surfaces/crypt-floor.png')
    x,y=1320,558
    for yy in range(y-53,y+22):
        for xx in range(x-27,x+28):im.putpixel((xx,yy),floor.getpixel((xx%288,yy%288)))
    altar(im,x,y)
    return result


old_path=F.path

def path(text):
    xy=old_path(text)
    if F.CURRENT=='hoard-keep' and text==MAPS[F.CURRENT]['outline']:
        a=xy.index((840,888));b=xy.index((720,1032))
        # A full native quarter curve replaces four faceted source chords. Its
        # endpoints and tangent joins remain at the same source grid landmarks.
        q=S.outline_points(720,888,120,144)
        curve=[p for p in q if p[0]>=720 and p[1]>=888]
        curve=sorted(set(curve),key=lambda p:(p[1],-p[0]))
        xy=xy[:a]+curve+xy[b+1:]
    return xy


def walls(im,mask,look):
    if F.CURRENT!='cave_rock-plain-21':return S.walls(im,mask,look)
    R.FLOOR_MASK=mask
    im=ground(im,mask)
    for p in MAPS[F.CURRENT].get('pools',[]):F.pool(im,p)
    im=R.original_walls(im,mask,look)
    # The established walked route lies on the bedding. Its edges widen around
    # the original apparatus and stairs, which are drawn later at their anchors.
    art=new(*im.size)
    route='303,408 323,391 353,389 377,403 411,408 456,405 493,410 532,422 570,441 615,461 660,480 701,496 737,501 782,506 838,504 893,499 944,495 996,490 1050,477 1105,469 1153,466 1199,478 1240,496 1281,513 1324,523 1370,532 1416,549 1451,567 1485,591 1516,608 1548,621 1568,651 1580,689 1581,734 1594,775 1616,810 1623,844 1615,873 1592,904 1564,922 1534,947 1500,971 1462,991 1424,1007 1388,1020 1353,1023 1316,1016 1278,1015 1243,1024 1204,1027 1167,1023 1131,1027 1094,1021 1063,1039 1037,1071 1008,1109 978,1143 951,1160 936,1142 957,1122 981,1096 1000,1068 1024,1032 1058,1001 1094,984 1135,988 1176,993 1213,994 1252,989 1290,990 1331,999 1369,998 1404,987 1437,969 1470,948 1501,924 1529,903 1553,878 1572,851 1575,826 1564,799 1548,762 1544,723 1536,684 1527,657 1506,642 1476,625 1444,604 1411,585 1374,570 1334,564 1296,553 1251,540 1213,524 1179,510 1146,506 1109,512 1068,522 1024,530 980,537 933,542 882,548 835,551 788,550 743,547 699,541 661,525 622,505 582,484 544,466 507,452 473,447 439,445 406,440 376,437 348,428 322,430'
    poly(art,'mud:4',route)
    for pp in ['320,415 353,415 353,420 376,420','480,428 504,432 531,444 560,458',
               '697,518 729,523 766,527','930,520 964,516 991,513 1016,507',
               '1108,489 1137,486 1162,490 1187,498','1310,542 1334,548 1359,550 1382,558',
               '1507,627 1526,642 1538,659','1570,761 1578,787 1589,812 1596,834',
               '1524,926 1501,942 1478,960','1297,1005 1320,1008 1343,1010 1365,1009',
               '1008,1090 1024,1068 1044,1044']:
        line(art,'mud:5',pp,3)
    art.putalpha(ImageChops.multiply(art.getchannel('A'),mask.convert('L')));im.alpha_composite(art)
    x,y=F.at(1252),F.at(168)
    for xx in (x-29,x+21):
        box(im,'grey-brown-rock:1',(xx,y-73,xx+8,y+22));box(im,'grey-brown-rock:2',(xx+1,y-72,xx+7,y+20));line(im,'mud:3',f'{xx+1},{y-70} {xx+1},{y+19}',1)
    return im


def run():
    S.install()
    F.path=path;F.feature_hoard=hoard;F.feature_sanctum=sanctum;F.broken_inset=inset;F.draw_walls=walls
    F.run()

if __name__=='__main__':run()
