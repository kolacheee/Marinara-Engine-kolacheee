"""C17 source read-back, whole-pixel assembly and selected structural repairs.

Uses the operator's final tolerant-grid ruling. No image resize or filter is
used in artwork. Review-only sheets may use nearest-neighbour magnification.
"""
import json
from collections import Counter
from math import cos, sin, pi, atan2
from PIL import Image, ImageDraw
from draw_proofs import BASE, REVIEW, S, c
from check_proofs import light, rgb
from import_c16 import read_source, clean_small, colour

NAMES = ['keep','temple','manor','crypt','cave_rock','cave_ice',
         'cave_crystal','cave_lava','dungeon_sewer','yard']
BANDS = {'keep':(334,887), 'temple':(238,837), 'crypt':(196,791),
         'manor':(212,790), 'cave_rock':(416,857), 'cave_ice':(419,908),
         'cave_crystal':(418,842), 'cave_lava':(207,678),
         'dungeon_sewer':(227,785), 'yard':(225,684)}

def phase(im,axis,pitch):
    p=im.load();length=im.width if axis==1 else im.height
    cross=im.height if axis==1 else im.width;re=imag=0
    for i in range(1,length):
        v=sum(max(abs(a[k]-b[k]) for k in range(3)) for j in range(0,cross,3)
              for a,b in [(p[i,j],p[i-1,j]) if axis==1 else (p[j,i],p[j,i-1])])
        re+=v*cos(2*pi*i/pitch);imag+=v*sin(2*pi*i/pitch)
    return atan2(imag,re)*pitch/(2*pi)%pitch

def register():
    data=json.loads((REVIEW/'C17-registration.json').read_text())
    # Ice x=12 is a second harmonic. Rock y=9.28 follows the large fractures;
    # the small square edge steps use the x pitch. Register those same squares.
    for name,axis,pitch in [('cave_ice',1,6.0),('cave_rock',0,6.4)]:
        im=Image.open(REVIEW/f'C17-sources/{name}.png').convert('RGB')
        key='x_grid' if axis==1 else 'y_grid'
        data[name][key]={'pitch':pitch,'phase':phase(im,axis,pitch),
                         'correction':'square-pixel edge pitch; reject coarse harmonic'}
        out,stats=read_source(REVIEW/f'C17-sources/{name}.png',data[name])
        data[name].update(stats);out.save(REVIEW/f'C17-read-{name}.png')
    (REVIEW/'C17-registration.json').write_text(json.dumps(data,indent=2)+'\n')

def pick(L,cuts,tags):
    return colour(tags[sum(L>=v for v in cuts)])

def lock(im,n,role):
    maps={
      'keep': [([20,33],['limestone:1','iron:2','limestone:2']),
               ([26,46],['limestone:1','limestone:2','iron:3']),
               ([36],['iron:3','limestone:3'])],
      'temple':[([22,39],['sandstone:1','marble:1','sandstone:2']),
                ([36,57],['sandstone:1','sandstone:2','sandstone:3']),
                ([56],['marble:2','marble:3'])],
      'manor':[([16,28],['timber:1','timber:2','timber:3']),
               ([19,39],['timber:2','timber:3','timber:4']),
               ([28,55],['parquet:3','timber:4','parquet:4'])],
      'crypt':[([24,42],['dark-masonry:2','dark-masonry:3','dark-masonry:4']),
               ([30,49],['dark-masonry:2','dark-masonry:4','dark-masonry:5']),
               ([50],['dark-masonry:4','dark-masonry:5'])],
      'cave_rock':[([27,42],['mud:1','mud:2','grey-brown-rock:2']),
                   ([34,48],['grey-brown-rock:1','grey-brown-rock:2','grey-brown-rock:3']),
                   ([47],['grey-brown-rock:3','mud:4'])],
      'cave_ice':[([29,45],['blue-ice:1','frost:1','blue-ice:2']),
                  ([48,70],['frost:1','blue-ice:2','frost:3']),
                  ([76,87],['blue-ice:3','blue-ice:2','snowdrift:3'])],
      'cave_crystal':[([20,30],['dark-rock:1','dark-rock:2','dark-rock:3']),
                      ([28,40],['dark-rock:2','dark-rock:3','dark-rock:4']),
                      ([50],['dark-rock:4','dark-rock:5'])],
      'cave_lava':[([15,27],['basalt:2','basalt:3','basalt:4']),
                   ([23,34],['basalt:2','basalt:4','basalt:5']),
                   ([36],['basalt:5','ash:3'])],
      'dungeon_sewer':[([20,34],['brick:1','brick:2','brick:3']),
                       ([30,41],['brick:2','brick:3','brick:4']),
                       ([46],['brick:3','brick:4'])],
      'yard':[([27,41],['roof-slate:1','yard-cobble:1','roof-slate:2']),
              ([44,61],['yard-cobble:1','yard-cobble:2','yard-cobble:3']),
              ([47,63],['yard-path:3','yard-cobble:3','yard-cobble:4'])],
    }
    out=Image.new('RGB',im.size);values=[]
    for p in im.get_flattened_data():
        r,g,b=p;L=light(p);q=pick(L,*maps[n][role])
        if n=='manor' and role==1 and min(p)>100 and max(p)-min(p)<60:q=colour('plaster:2')
        if n=='crypt' and g>r*.90 and b<g*.75:q=colour('lichen:2' if role<2 else 'lichen:3')
        if n=='cave_rock' and role==2 and max(p)-min(p)<45:
            q=colour('grey-brown-rock:4' if L>51 else 'grey-brown-rock:3')
        if n=='cave_crystal' and r-g>17 and b-g>32 and L>36:
            q=colour(('dark-rock:5' if L>50 else 'violet-crystal:3') if role==2 else ('violet-crystal:3' if L>44 else 'violet-crystal:2'))
        if n=='cave_lava' and r>g*1.4 and r>b*1.35:
            q=colour(('embers:3' if L>45 else 'embers:2') if role<2 else ('embers:4' if L>44 else 'embers:3'))
        if n=='dungeon_sewer' and g>r*.70 and b<g*.78:
            q=colour('slime:2' if role<2 else 'slime:3')
        if n=='yard' and role==2:
            if g>r*1.01 and g>b*1.35:q=colour('yard-grass:4' if L>57 else 'yard-grass:3')
            elif r>b*1.28 and r>g*1.06:q=colour('yard-path:3' if L<52 else 'yard-path:4')
        values.append(q)
    out.putdata(values);return out

def splice(im, length, axis, cut=None):
    """Move whole-pixel strips; extend an untextured construction seam if short.

    This is an explicit carpentry/stone-plane edit, not spatial interpolation.
    Existing details keep their original pixel widths. Extra space contains
    only straight extensions of colours already meeting the chosen seam.
    """
    old=im.width if axis==0 else im.height
    if old==length:return im.copy()
    cut=old//2 if cut is None else cut
    size=(length,im.height) if axis==0 else (im.width,length)
    out=Image.new('RGB',size)
    delta=length-old
    if delta<0:
        cut=min(cut,length);end=cut-delta
        if axis==0:
            out.paste(im.crop((0,0,cut,im.height)),(0,0));out.paste(im.crop((end,0,old,im.height)),(cut,0))
        else:
            out.paste(im.crop((0,0,im.width,cut)),(0,0));out.paste(im.crop((0,end,im.width,old)),(0,cut))
    else:
        d=ImageDraw.Draw(out)
        if axis==0:
            out.paste(im.crop((0,0,cut,im.height)),(0,0));out.paste(im.crop((cut,0,old,im.height)),(cut+delta,0))
            for y in range(im.height):d.line((cut,y,cut+delta-1,y),fill=im.getpixel((cut,y)))
        else:
            out.paste(im.crop((0,0,im.width,cut)),(0,0));out.paste(im.crop((0,cut,im.width,old)),(0,cut+delta))
            for x in range(im.width):d.line((x,cut,x,cut+delta-1),fill=im.getpixel((x,cut)))
    return out

def slabs(im,height):
    out=Image.new('RGB',(144,height))
    for k in range(3):
        part=im.crop((round(k*im.width/3),0,round((k+1)*im.width/3),im.height))
        part=splice(splice(part,48,0),height,1)
        out.paste(part,(k*48,0))
    return out

def assemble():
    registry=json.loads((REVIEW/'C17-registration.json').read_text());record={}
    for n in NAMES:
        src=Image.open(REVIEW/f'C17-read-{n}.png').convert('RGB');g=registry[n]['y_grid']
        a,b=[round((y-g['phase'])/g['pitch']) for y in BANDS[n]]
        raw=[src.crop((0,0,src.width,a)),src.crop((0,a,src.width,b)),src.crop((0,b,src.width,src.height))]
        parts=[lock(im,n,i) for i,im in enumerate(raw)]
        top,face,floor=parts
        if n in ('keep','temple','crypt','dungeon_sewer','yard'):
            top=slabs(top,40)
            # Three source courses, each with its original upper/lower lips.
            front=Image.new('RGB',(144,47))
            for k,(h,y) in enumerate(((16,0),(16,16),(15,32))):
                course=face.crop((0,round(k*face.height/3),face.width,round((k+1)*face.height/3)))
                course=course.crop((0,0,144,course.height)) if course.width>=144 else splice(course,144,0,cut=min(85,course.width-4))
                front.paste(splice(course,h,1),(0,y))
            face=front
        elif n=='manor':
            top=slabs(top,40);face=slabs(face,47)
        else:
            # Contiguous cave crops retain the cap/front boundary at the same x.
            x=max(0,(top.width-144)//2)
            top=top.crop((x,max(0,top.height-40),min(x+144,top.width),top.height))
            face=face.crop((x,0,min(x+144,face.width),min(47,face.height)))
            top=splice(splice(top,144,0),40,1,cut=4)
            face=splice(splice(face,144,0),47,1)
        if n in ('keep','temple','crypt','dungeon_sewer'):
            floor=slabs(floor,48)
        elif n=='manor':
            # Retain the operator-approved earlier parquet source; move its
            # three whole panels to the 48px cell instead of offset subgrids.
            from import_c16 import palette_band
            old=Image.open(REVIEW/'C16-read-manor.png').convert('RGB').crop((0,76,131,124))
            floor=slabs(palette_band(old,n,2),48)
        else:
            x=max(0,(floor.width-144)//2)
            floor=floor.crop((x,0,min(x+144,floor.width),floor.height))
            floor=splice(splice(floor,144,0,cut=10),48,1)
        if n in ('cave_rock','cave_crystal'):
            # The central calm-strip crop would cut the small stone in half.
            # Keep that complete source feature and translate it into calm fill.
            floor=Image.new('RGB',(144,48),colour('mud:4' if n=='cave_rock' else 'dark-rock:4'))
            box=(39,26,63,43) if n=='cave_rock' else (40,32,61,47)
            floor.paste(parts[2].crop(box),(20,17))
        if n=='temple':
            # Preserve both distinct source veins when removing calm slab rows.
            floor.paste(parts[2].crop((12,25,36,52)),(13,14))
            floor.paste(parts[2].crop((90,11,115,26)),(61,20))
            # Trace continuous upper lips along the source's three courses.
            face.putdata([colour('sandstone:2') if q==colour('sandstone:3') else q for q in face.get_flattened_data()])
            d=ImageDraw.Draw(face)
            for y,spans in [(0,[(1,114),(118,143)]),(16,[(1,56),(60,143)]),(32,[(1,124),(128,143)])]:
                for x0,x1 in spans:d.line((x0,y,x1,y),fill=colour('sandstone:3'))
        if n=='crypt':
            face.putdata([colour('dark-masonry:4') if q==colour('dark-masonry:5') else q for q in face.get_flattened_data()])
            d=ImageDraw.Draw(face)
            for y,spans in [(0,[(1,9),(13,67),(71,143)]),(16,[(1,42),(46,124),(128,143)]),(32,[(1,12),(16,86),(90,143)])]:
                for x0,x1 in spans:d.line((x0,y,x1,y),fill=colour('dark-masonry:5'))
        if n=='manor':
            # Repair source butt joints and keep the upper light stroke continuous.
            d=ImageDraw.Draw(top)
            for x in (48,96):
                d.rectangle((x-5,0,x+4,39),fill=colour('timber:2'))
                d.line((x,0,x,39),fill=colour('timber:1'))
                d.line((x+1,1,x+1,38),fill=colour('timber:3'))
            d.line((0,0,143,0),fill=colour('timber:3'))
        if n=='cave_ice':
            # Translate the cropped snowbank inside the period and trim its cut
            # left edge into a closed drift. Keep the source's shaped right rim.
            bank=floor.crop((0,2,34,17));d=ImageDraw.Draw(floor)
            d.rectangle((0,0,35,19),fill=colour('blue-ice:3'))
            floor.paste(bank,(10,8));d=ImageDraw.Draw(floor)
            for box in [(10,8,15,10),(10,11,12,12),(10,13,10,15),(10,20,12,22)]:
                d.rectangle(box,fill=colour('blue-ice:3'))
            # Trace the two original fractures; disconnected specular fragments
            # become one continuous stepped lip on each connected plane.
            face.putdata([colour('blue-ice:2') if q==colour('frost:3') else q for q in face.get_flattened_data()])
            d=ImageDraw.Draw(face)
            for path in [[(18,0),(18,8),(16,8),(16,14),(14,14),(14,20),(12,20),(12,26),(9,26),(9,32),(7,32),(7,38),(5,38),(5,46)],
                         [(112,0),(112,6),(110,6),(110,13),(108,13),(108,21),(105,21),(105,29),(101,29),(101,35),(96,35),(96,40),(90,40),(90,46)]]:
                d.line(path,fill=colour('frost:3'),width=1)
        if n=='cave_crystal':
            # Clean the source's fractured seam and its three inset facets.
            # Source plane positions are retained; this replaces broken lines.
            face.putdata([colour('dark-rock:3') for q in face.get_flattened_data()])
            d=ImageDraw.Draw(face)
            seam=[(51,0),(51,5),(48,5),(48,10),(45,10),(45,15),(41,15),(41,20),(37,20),(37,24),(33,24),(33,28),(29,28),(29,32),(25,32),(25,36),(21,36),(21,41),(17,41),(17,46)]
            d.line(seam,fill=colour('dark-rock:2'),width=3)
            for path in [[(22,0),(22,9),(20,9),(20,18),(18,18),(18,27),(23,27),(23,30),(28,30)],
                         [(114,0),(114,8),(112,8),(112,17),(109,17),(109,26),(105,26),(105,34),(101,34),(101,46)]]:
                d.line(path,fill=colour('dark-rock:2'),width=1)
            d.line([(116,0),(116,8),(114,8),(114,17),(111,17),(111,26),(107,26),(107,34),(103,34),(103,46)],fill=colour('dark-rock:4'),width=1)
            facets=[([(49,1),(49,5),(47,5),(47,9),(45,9),(45,13),(43,13),(43,18),(46,16),(46,12),(48,12),(48,8),(50,8),(50,3)],
                     [(49,1),(49,5),(47,5),(47,9),(45,9),(45,13),(43,13),(43,17),(45,14),(45,10),(47,10),(47,6)]),
                    ([(37,21),(39,20),(39,24),(37,24),(37,27),(34,27),(34,30),(31,31),(31,28),(34,25)],
                     [(37,21),(37,24),(34,24),(34,27),(31,30),(31,28),(34,25)]),
                    ([(22,37),(24,35),(24,39),(22,39),(22,42),(19,44),(19,40)],
                     [(22,37),(22,40),(19,43),(19,40)])]
            for body,edge in facets:
                d.polygon(body,fill=colour('violet-crystal:2'));d.polygon(edge,fill=colour('violet-crystal:3'))
        if n=='cave_lava':
            # Cap the source fissure within the diagnostic period, repairing its
            # clipped entry and deleting the fragment severed by the calm crop.
            old=floor.copy();floor=Image.new('RGB',(144,48),colour('ash:3'));floor.paste(old,(12,0));d=ImageDraw.Draw(floor)
            d.rectangle((12,0,21,47),fill=colour('ash:3'))
            d.polygon([(14,15),(16,15),(16,17),(19,17),(19,19),(23,19),(23,24),(19,24),(19,22),(17,22),(17,20),(15,20),(15,18),(14,18)],fill=colour('basalt:5'))
            d.polygon([(16,17),(18,17),(18,19),(21,19),(21,20),(24,20),(24,23),(20,23),(20,21),(18,21),(18,19),(16,19)],fill=colour('embers:3'))
            d.line([(19,19),(19,20),(21,20),(21,21),(24,21)],fill=colour('embers:4'),width=1)
            d.rectangle((74,33,95,47),fill=colour('ash:3'))
            # The source's red cap rim is not an ember fracture.
            top.putdata([colour('basalt:4') if q in (colour('embers:2'),colour('embers:3')) else q for q in top.get_flattened_data()])
        if n=='yard':
            # Close the turf around the far paving edge, so the repeated strip
            # meets turf with turf. The paving bed's cross-joint is on the cell.
            d=ImageDraw.Draw(floor)
            d.polygon([(134,0),(143,0),(143,47),(134,47),(134,41),(131,41),(131,34),(133,34),(133,28),(130,28),(130,23),(132,23),(132,16),(135,16),(135,8),(134,8)],fill=colour('yard-grass:3'))
            d.polygon([(46,39),(50,39),(50,42),(52,42),(52,45),(54,45),(54,47),(0,47),(0,39)],fill=colour('yard-grass:3'))
            for y in (0,47):
                d.line((0,y,53,y),fill=colour('yard-grass:3'))
                d.line((54,y,87,y),fill=colour('yard-path:4'))
                d.line((88,y,133,y),fill=colour('yard-path:3'))
                d.line((134,y,143,y),fill=colour('yard-grass:3'))
        # Register constructed joints and connect straight frame strokes.
        d=ImageDraw.Draw(floor)
        joints={'keep':'iron:3','temple':'marble:2','crypt':'dark-masonry:4','manor':'parquet:3','dungeon_sewer':'brick:3'}
        if n in joints:
            for x in (0,48,96):d.line((x,0,x,47),fill=colour(joints[n]))
            d.line((0,0,143,0),fill=colour(joints[n]))
        edits={key:clean_small(im) for key,im in [('top',top),('face',face),('floor',floor)]}
        wall=Image.new('RGB',(144,96),rgb(c('void-mass',2)))
        wall.paste(top,(0,8));wall.paste(face,(0,48))
        ImageDraw.Draw(wall).line((0,95,143,95),fill=rgb(c(S[n][1][0],1)))
        proof=Image.new('RGBA',(144,144));proof.paste(wall,(0,0));proof.paste(floor,(0,96))
        prop=Image.open(REVIEW/f'C-layer-{n}-prop.png').convert('RGBA');proof.alpha_composite(prop,(86,96))
        for tag,im in [('top',top),('face',face),('floor',floor),('wall',wall),('proof',proof)]:im.save(REVIEW/f'C17-{n}-{tag}.png')
        record[n]={'read_size':list(src.size),'band_rows':[a,b],'cleanup_counts':{k:len(v) for k,v in edits.items()}}
    (REVIEW/'C17-assembly.json').write_text(json.dumps(record,indent=2)+'\n')
    contact()

def contact():
    sheet=Image.new('RGB',(1520,640),'#222630');d=ImageDraw.Draw(sheet)
    for i,n in enumerate(NAMES):
        im=Image.open(REVIEW/f'C17-{n}-proof.png');x=i%5*304;y=i//5*320
        d.text((x+8,y+4),n,fill='white');sheet.paste(im.resize((288,288),Image.Resampling.NEAREST),(x+8,y+24))
    sheet.save(REVIEW/'C17-assembly-contact.png')

if __name__=='__main__':
    register();assemble()
