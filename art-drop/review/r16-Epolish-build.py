"""Process image-tool drawings; code only registers, reduces, cleans and composites."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
from collections import Counter
import json, hashlib, sys

REV=Path(__file__).resolve().parent
ROOT=REV.parent
OUT=ROOT/'out/weather16'
P='r16-Epolish-'
NN=Image.Resampling.NEAREST
EDGE=(32,41,54)
NEUTRAL=[EDGE,(146,170,184),(206,219,222),(245,243,223)]
GOLD=[EDGE,(187,116,59),(232,183,83),(255,240,176)]
BLUE=[EDGE,(85,143,190),(113,184,221),(196,231,240)]
SAND=[EDGE,(158,106,61),(201,155,83),(234,213,154)]
NAMES=['clear-day','clear-night','cloudy','overcast','rain','heavy_rain','storm','snow','blizzard','fog','wind','hail','sandstorm','heat_wave']
STAGES=[]

def save(im,name):
    im.save(REV/(P+name+'.png'))

def keyed(ident):
    im=Image.open(REV/(P+'source-'+ident+'.png')).convert('RGB')
    out=Image.new('RGBA',im.size)
    out.putdata([(0,0,0,0) if r>135 and b>135 and r>g+45 and b>g+45 else (r,g,b,255) for r,g,b in im.get_flattened_data()])
    return out

def components(im):
    w,h=im.size;p=list(im.get_flattened_data());todo={i for i,v in enumerate(p) if v[3]};parts=[]
    while todo:
        pt=todo.pop();part=[pt];stack=[pt]
        while stack:
            q=stack.pop();y,x=divmod(q,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    k=yy*w+xx
                    if k in todo:todo.remove(k);part.append(k);stack.append(k)
        parts.append(part)
    return sorted(parts,key=len,reverse=True)

def contour(mode):
    before=list(mode.get_flattened_data());a=before.copy()
    for i,p in enumerate(before):
        if not p[3]:continue
        y,x=divmod(i,24)
        near=[before[yy*24+xx] if 0<=xx<24 and 0<=yy<24 else (0,0,0,0) for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]]
        if any(not n[3] for n in near):a[i]=(*EDGE,255)
        elif p[:3]==EDGE:
            shades=[v for v in near if v[3] and v[:3]!=EDGE]
            if shades:a[i]=Counter(shades).most_common(1)[0][0]
    out=Image.new('RGBA',(24,24));out.putdata(a)
    for part in components(out):
        if len(part)<=2:
            for i in part:a[i]=(0,0,0,0)
    out.putdata(a);return out

def reduce(ident,pal,boxes=None,bounds=(1,1,23,23),suffix='',clean=True,seed=None,exclude=None,native_refinements=None):
    src=keyed(ident);canvas=Image.new('RGBA',(192,192));placements=[]
    if seed:
        mask=src.getchannel('A');ImageDraw.floodfill(mask,seed,127)
        src.putdata([p if m==127 else (0,0,0,0) for p,m in zip(src.get_flattened_data(),mask.get_flattened_data())])
    if exclude:
        for box in exclude:src.paste((0,0,0,0),box)
    if boxes is None:boxes=[((0,0,*src.size),bounds)]
    for sb,tb in boxes:
        crop=src.crop(sb);bb=crop.getbbox()
        if bb is None:raise ValueError((ident,sb))
        crop=crop.crop(bb);x,y,r,b=tb
        canvas.alpha_composite(crop.resize(((r-x)*8,(b-y)*8),Image.Resampling.BOX),(x*8,y*8))
        placements.append({'source_box':[sb[0]+bb[0],sb[1]+bb[1],sb[0]+bb[2],sb[1]+bb[3]],'native_bounds':list(tb)})
    cache={};locked=[]
    for p in canvas.get_flattened_data():
        if p[3]<128:locked.append((0,0,0,0));continue
        rgb=p[:3]
        if rgb not in cache:cache[rgb]=min(pal,key=lambda q:sum((c-d)**2 for c,d in zip(rgb,q)))
        locked.append((*cache[rgb],255))
    reg=Image.new('RGBA',(192,192));reg.putdata(locked);native=[]
    for y in range(24):
        for x in range(24):
            counts=Counter(locked[(y*8+yy)*192+x*8+xx] for yy in range(8) for xx in range(8))
            native.append(min(counts,key=lambda c:(-counts[c],c)))
    mode=Image.new('RGBA',(24,24));mode.putdata(native);out=contour(mode) if clean else mode.copy()
    # Restore three source-painted midtone transitions lost between the wind's
    # highlight and underside. No new alpha or unsupported colour is introduced.
    for x,y,rgb in native_refinements or []:
        rgba=(*rgb,255)
        assert rgba in reg.crop((x*8,y*8,x*8+8,y*8+8)).get_flattened_data()
        assert out.getpixel((x,y))[3]
        out.putpixel((x,y),rgba)
    ident2=ident+suffix
    for tag,img in [('registered',reg),('mode',mode),('clean',out)]:save(img,tag+'-'+ident2)
    edits=[{'xy':[i%24,i//24],'before':list(a),'after':list(b)} for i,(a,b) in enumerate(zip(native,out.get_flattened_data())) if a!=b]
    STAGES.append({'id':ident2,'source':P+'source-'+ident+'.png','placements':placements,'component_seed':seed,'excluded_source_boxes':exclude,'palette':pal,'mode_blocks':576,'cleanup':edits})
    return out

def strip(ident,pal,count,targets,suffix=''):
    src=keyed(ident);bb=src.getbbox();step=(bb[2]-bb[0])/count
    boxes=[((round(bb[0]+i*step),bb[1],round(bb[0]+(i+1)*step),bb[3]),t) for i,t in enumerate(targets)]
    return reduce(ident,pal,boxes=boxes,suffix=suffix)

def shift(im,dx,dy):
    out=Image.new('RGBA',(24,24));out.alpha_composite(im,(dx,dy));return out

def tint(im,colors):
    out=im.copy();lookup={(*a,255):(*b,255) for a,b in zip(NEUTRAL,colors)}
    out.putdata([lookup.get(p,p) for p in im.get_flattened_data()]);return out

def over(*ims):
    out=Image.new('RGBA',(24,24))
    for im in ims:out.alpha_composite(im)
    return out

def panel(im,kind):
    out=Image.new('RGBA',im.size,(26,31,34,255) if kind=='dark' else (232,229,217,255))
    out.alpha_composite(im);return out.convert('RGB')

def preview(parts):
    w=7*180;h=((len(parts)+6)//7)*180
    sheet=Image.new('RGB',(w,h),(48,53,62));d=ImageDraw.Draw(sheet)
    for i,(n,im) in enumerate(parts.items()):
        x=i%7*180;y=i//7*180
        d.text((x+8,y+8),n,fill='white');sheet.paste(panel(im,'dark'),(x+8,y+30));sheet.paste(panel(im,'light').resize((96,96),NN),(x+48,y+30))
    save(sheet,'working-selection')

def main():
    parts={}
    for ident in ['cloud-a','cloud-b','cloud-c']:
        parts[ident]=reduce(ident,NEUTRAL,bounds=(2,1,22,13))
    parts['sun-a']=reduce('sun-a',GOLD)
    parts['sun-b']=reduce('sun-b',GOLD)
    parts['night-a']=reduce('night-a',NEUTRAL)
    parts['rain-a']=strip('rain-a',BLUE,3,[(2,15,7,22),(9,15,14,22),(16,15,21,22)])
    parts['heavy-a']=reduce('heavy-a',BLUE,seed=(200,500),boxes=[((0,0,1254,1254),(1+i*4,14,6+i*4,23)) for i in range(5)])
    parts['snow-a']=strip('snow-a',NEUTRAL,3,[(2,16,7,21),(10,17,15,22),(18,16,23,21)])
    parts['hail-a']=strip('hail-a',NEUTRAL,4,[(2+i*5,17+i%2,6+i*5,21+i%2) for i in range(4)])
    parts['snow-large']=reduce('snow-a',NEUTRAL,boxes=[((0,0,720,724),(3,15,10,22)),((725,0,1440,724),(14,15,21,22))],suffix='-large')
    parts['hail-large']=reduce('hail-a',NEUTRAL,boxes=[((200,100,650,600),(3+i*7,17,8+i*7,22)) for i in range(3)],suffix='-large')
    for name,pal in [('wind',NEUTRAL),('blizzard',NEUTRAL+BLUE[1:]),('fog',NEUTRAL),('heat',GOLD),('sand',SAND)]:
        for v in ['a','b']:
            ident=name+'-'+v
            if (REV/(P+'source-'+ident+'.png')).exists():parts[ident]=reduce(ident,pal,bounds=(1,1,23,23))
    # Separate drawn sun components, each retaining a coloured interior.
    sunparts=[]
    for tag,seed,bounds in [
        ('disc',(620,620),(6,6,18,18)),('n',(620,140),(10,1,14,5)),
        ('ne',(950,290),(17,3,21,7)),('e',(1080,620),(19,10,23,14)),
        ('se',(960,950),(17,17,21,21)),('s',(620,1080),(10,19,14,23)),
        ('sw',(290,960),(3,17,7,21)),('w',(160,620),(1,10,5,14)),
        ('nw',(290,290),(3,3,7,7))]:
        sunparts.append(reduce('sun-a',GOLD,seed=seed,bounds=bounds,suffix='-'+tag))
    parts['sun-assembled']=over(*sunparts)
    moon=reduce('night-a',NEUTRAL,exclude=[(770,140,1080,715)],suffix='-moon')
    star=reduce('night-a',NEUTRAL,boxes=[((770,390,1080,715),(15,4,22,11))],suffix='-star')
    parts['night-assembled']=over(moon,star)
    parts['wind-separated']=reduce('wind-b',NEUTRAL,boxes=[((0,0,1254,550),(1,1,23,10)),((0,550,1254,770),(1,11,22,14)),((0,770,1254,1254),(1,15,19,23))],suffix='-separated',native_refinements=[(19,8,NEUTRAL[2]),(15,16,NEUTRAL[2]),(17,20,NEUTRAL[2])])
    waves=reduce('heat-b',GOLD,boxes=[((0,850,1254,1060),(1,12,23,17)),((0,1060,1254,1254),(1,18,23,23))],suffix='-waves')
    halfsun=parts['sun-assembled'].copy();halfsun.paste((0,0,0,0),(0,13,24,24))
    parts['heat-assembled']=over(halfsun,waves)
    # Use exactly one cloud pixel mask; only palette and translations differ.
    cloud=parts['cloud-c']
    slate=tint(cloud,[EDGE,(89,111,134),(146,170,184),(206,219,222)])
    dark=tint(cloud,[EDGE,(59,77,99),(89,111,134),(146,170,184)])
    sun_small=reduce('sun-a',GOLD,seed=(620,620),bounds=(1,1,14,14),suffix='-cloudy-disc')
    icons={'clear-day':parts['sun-assembled'],'clear-night':parts['night-assembled'],
           'cloudy':over(sun_small,shift(cloud,0,8)),
           'overcast':over(shift(slate,-1,1),shift(slate,1,8)),
           'rain':over(cloud,parts['rain-a']),'heavy_rain':over(slate,parts['heavy-a']),
           'snow':over(cloud,parts['snow-large']),'hail':over(slate,parts['hail-large'])}
    old=Image.open(REV/(P+'before-icon-storm.png')).convert('RGBA')
    mask=Image.new('L',(24,24));mask.putdata([255 if p[:3] in GOLD[1:] and p[3] else 0 for p in old.get_flattened_data()])
    mask=ImageChops.multiply(mask.filter(ImageFilter.MaxFilter(3)),old.getchannel('A'))
    bolt=old.copy();bolt.putdata([p if m else (0,0,0,0) for p,m in zip(old.get_flattened_data(),mask.get_flattened_data())]);bolt_before=bolt.copy();bolt=contour(bolt)
    bolt_edits=[{'xy':[i%24,i//24],'before':list(a),'after':list(c)} for i,(a,c) in enumerate(zip(bolt_before.get_flattened_data(),bolt.get_flattened_data())) if a!=c]
    (REV/(P+'bolt-cleanup.json')).write_text(json.dumps(bolt_edits,indent=2)+'\n')
    save(bolt,'retained-bolt');icons['storm']=over(dark,bolt)
    for name,key in [('blizzard','blizzard-b'),('wind','wind-separated'),('fog','fog-a'),('sandstorm','sand-b'),('heat_wave','heat-assembled')]:icons[name]=parts[key]
    icons={n:icons[n] for n in NAMES}
    for name,im in icons.items():save(im,'candidate-icon-'+name)
    for kind in ['dark','light']:
        row=Image.new('RGB',(14*32+8,40),(26,31,34) if kind=='dark' else (232,229,217))
        for i,name in enumerate(NAMES):row.paste(panel(icons[name],kind),(8+i*32,8))
        for s in [1,2,4]:save(row.resize((row.width*s,row.height*s),NN),'candidate-row-'+kind+'-'+str(s)+'x')
    preview(parts)
    files={}
    for name,im in icons.items():
        if '--install' in sys.argv:im.save(OUT/('icon-'+name+'.png'))
        visible=[p for p in im.get_flattened_data() if p[3]]
        files['icon-'+name+'.png']={'size':list(im.size),'bounds':list(im.getbbox()),'opaque_pixels':len(visible),'colours':len(set(visible)),'palette':[list(p) for p in sorted(set(visible))],'components':[len(c) for c in components(im)],'pixel_sha256':hashlib.sha256(im.tobytes()).hexdigest()}
    recipes={
      'clear-day':'Composite nine separately registered components from sun-a: disc,n,ne,e,se,s,sw,w,nw.',
      'clear-night':'night-a-moon, with both original stars excluded; night-a-star, enlarged to 7x7.',
      'cloudy':'sun-a-cloudy-disc behind cloud-c translated (0,8).',
      'overcast':'Slate cloud-c copies translated (-1,1) and (1,8). Same mask and scale.',
      'rain':'White cloud-c plus rain-a: three separately registered 5x7 slanted strokes.',
      'heavy_rain':'Slate cloud-c plus heavy-a: five copies of the first drawn 5x9 stroke.',
      'storm':'Dark slate cloud-c plus retained-bolt, extracted from the starting storm icon and outlined inside existing opaque pixels.',
      'snow':'White cloud-c plus snow-a-large: two 7x7 cross flakes.',
      'hail':'Slate cloud-c plus hail-a-large: three separated 5x5 rounded pellets.',
      'blizzard':'blizzard-b, the simpler second drawing.',
      'fog':'fog-a: three thick offset bands.',
      'wind':'wind-b-separated: independent registration of three drawn gusts.',
      'sandstorm':'sand-b: three asymmetric ochre dust bands.',
      'heat_wave':'Upper 13 rows of the assembled clear-day sun, with heat-b-waves: two separately registered 22x5 ripples.'}
    result={'method':'Solid magenta key; BOX registration at 8x; palette lock without dithering; exact RGBA mode of all 64 samples per pixel with lexicographic ties; source-supported native contour cleanup; component compositing.',
            'source_drawings':len(json.loads((REV/(P+'generation.json')).read_text())),
            'stages':STAGES,'recipes':recipes,'files':files,
            'cloud':{'stage':'cloud-c','bounds':[2,1,22,13],'white':NEUTRAL,'slate':[EDGE,(89,111,134),(146,170,184),(206,219,222)],'dark':[EDGE,(59,77,99),(89,111,134),(146,170,184)]},
            'selection':{'cloud':'c: three broad puffs; a/b have a taller central peak.','sun':'a, components registered independently; b has less even rays.','night':'a, keeping one enlarged four-point star.','blizzard':'b: fewer branches, stronger native silhouette.','wind':'b: straighter gusts and offset open hooks.','sandstorm':'b: asymmetric dense bands with open channels.','heat_wave':'b ripples with the same sun as clear-day; a is too dense at native size.'}}
    (REV/(P+'measurements.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'sources':result['source_drawings'],'stages':len(STAGES),'mode_blocks':576*len(STAGES),'cleanup':sum(len(s['cleanup']) for s in STAGES),'installed':'--install' in sys.argv}))

if __name__=='__main__':
    # The critic repair supersedes the original three failed assemblies.
    latest=REV/(P+'critic1-build.py')
    if latest.exists():
        import runpy
        runpy.run_path(str(latest),run_name='__main__')
    else:main()
