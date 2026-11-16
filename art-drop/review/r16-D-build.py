"""Round 16 D: process image-tool drawings; never generate effect geometry."""
from pathlib import Path
from PIL import Image, ImageDraw, PngImagePlugin
from collections import Counter
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
REV,OUT,REF=ROOT/'review',ROOT/'out/weather16',ROOT/'reference/r16'
NN=Image.Resampling.NEAREST
BOLT=[(83,75,134),(150,154,208),(194,217,252),(251,253,255)]
BOLT_FRAMES=[BOLT,[(58,58,93),(91,102,148),(125,148,184),(173,190,218)],[(40,43,66),(54,62,90),(67,82,115),(92,112,151)]]
WIND=[(154,176,186),(213,229,232),(250,252,247)]
WIND_FRAMES=[[(137,157,168),(195,212,220),(237,243,241)],WIND,[(125,149,161),(177,198,207),(217,230,233)],[(103,129,144),(147,173,185),(182,204,215)]]
GREYS=[(v,v,v) for v in [48,85,128,174,222,252]]
FLASH_ALPHA=[8,16,28,44,64,88]
SELECT=['bolt-0a','bolt-1a','bolt-2b','wind-0a','wind-1a','wind-2a','wind-3b','flash-a']

def save(im,path,**meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items():info.add_text(k,json.dumps(v) if not isinstance(v,str) else v)
    im.save(path,pnginfo=info)

def groups(im,colour=None):
    w,h=im.size;p=list(im.get_flattened_data())
    todo={i for i,v in enumerate(p) if v[3] and (colour is None or v[:3]==colour)};result=[]
    while todo:
        s=todo.pop();part=[s];stack=[s]
        while stack:
            q=stack.pop();y,x=divmod(q,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    z=yy*w+xx
                    if z in todo:todo.remove(z);part.append(z);stack.append(z)
        result.append(part)
    return sorted(result,key=len,reverse=True)

def mode_reduce(reg,size):
    w,h=size;rw=w*8;p=list(reg.get_flattened_data());out=[]
    for y in range(h):
        for x in range(w):
            c=Counter(p[(y*8+dy)*rw+x*8+dx] for dy in range(8) for dx in range(8))
            out.append(min(c,key=lambda q:(-c[q],q)))
    im=Image.new('RGBA',size);im.putdata(out);return im

def reduce_source(rec):
    ident=rec['id'];raw=Image.open(REV/f'r16-D-source-{ident}.png').convert('RGB')
    p=[(0,0,0,0) if r>g+45 and b>g+45 and r>135 and b>135 else (r,g,b,255) for r,g,b in raw.get_flattened_data()]
    keyed=Image.new('RGBA',raw.size);keyed.putdata(p)
    if ident.startswith('wind'):
        size=(144,192);bbox=(0,0,*raw.size);reg=keyed.resize((1152,1536),Image.Resampling.BOX);palette=WIND;placement=(0,0,144,192)
    else:
        bbox=keyed.getbbox();crop=keyed.crop(bbox)
        if ident.startswith('bolt'):
            size=(48,144);bh=136;bw=min(40,round(crop.width*bh/crop.height));palette=BOLT
        else:size=(192,192);bw,bh=(176,176);palette=GREYS
        x,y=(size[0]-bw)//2,(size[1]-bh)//2
        reg=Image.new('RGBA',(size[0]*8,size[1]*8));reg.paste(crop.resize((bw*8,bh*8),Image.Resampling.BOX),(x*8,y*8));placement=(x,y,bw,bh)
    cache={};locked=[]
    for v in reg.get_flattened_data():
        if v[3]<128:locked.append((0,0,0,0));continue
        rgb=v[:3]
        if rgb not in cache:cache[rgb]=min(palette,key=lambda q:sum((a-b)**2 for a,b in zip(rgb,q)))
        locked.append((*cache[rgb],255))
    reg.putdata(locked);mode=mode_reduce(reg,size);clean=mode.copy();p=list(clean.get_flattened_data());w,h=size
    joins=[]
    # Restore only one-pixel gaps backed by >=8 opaque samples in the source.
    # Both sides must already belong to different drawn components.
    if not ident.startswith('flash'):
        for attempt in range(8):
            clean.putdata(p);labels={q:i for i,part in enumerate(groups(clean)) for q in part};candidates=[]
            for q,v in enumerate(p):
                if v[3]:continue
                y,x=divmod(q,w)
                near={labels[yy*w+xx] for yy in range(max(0,y-1),min(h,y+2)) for xx in range(max(0,x-1),min(w,x+2)) if yy*w+xx in labels}
                if len(near)<2:continue
                votes=Counter(locked[(y*8+dy)*w*8+x*8+dx] for dy in range(8) for dx in range(8) if locked[(y*8+dy)*w*8+x*8+dx][3])
                count=sum(votes.values())
                if count>=8:candidates.append((count,q,min(votes,key=lambda v:(-votes[v],v))))
            if not candidates:break
            count,q,v=max(candidates,key=lambda t:(t[0],-t[1]));p[q]=v;joins.append({'index':q,'source_opaque_samples':count,'rgba':list(v)})
    clean.putdata(p)
    for i,part in enumerate(groups(clean)):
        if (ident.startswith('bolt') and i>0) or (not ident.startswith('bolt') and len(part)<5):
            for q in part:p[q]=(0,0,0,0)
    # Restrict the drawing's darkest contour to a one-native-pixel perimeter.
    if not ident.startswith('flash'):
        for q,v in enumerate(p.copy()):
            y,x=divmod(q,w)
            if v[:3]==palette[0] and 0<x<w-1 and 0<y<h-1 and all(p[z][3] for z in [q-1,q+1,q-w,q+w]):p[q]=(*palette[1],255)
    clean.putdata(p)
    edits=[{'index':i,'before':list(a),'after':list(b)} for i,(a,b) in enumerate(zip(mode.get_flattened_data(),p)) if a!=b]
    for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:save(im,REV/f'r16-D-{stage}-{ident}.png')
    return clean,{'id':ident,'source':f'r16-D-source-{ident}.png','source_size':list(raw.size),'source_crop':bbox,'native_size':size,'placement':placement,'mode_blocks':w*h,'source_supported_joins':joins,'cleanup':edits,'components':[len(x) for x in groups(clean)]}

def recolour(im,before,after):
    out=im.copy();out.putdata([(*after[before.index(p[:3])],p[3]) if p[3] else (0,0,0,0) for p in im.get_flattened_data()]);return out

def measure(im,path):
    p=list(im.get_flattened_data());visible=[v for v in p if v[3]];xs=[];ys=[]
    for i,v in enumerate(p):
        if v[3]:y,x=divmod(i,im.width);xs.append(x);ys.append(y)
    return {'size':list(im.size),'bounds':list(im.getbbox()),'covered_pixels':len(visible),'cover_percent':round(100*len(visible)/len(p),4),'alpha_weighted_cover_percent':round(100*sum(v[3] for v in p)/(255*len(p)),4),'centroid':[round(sum(xs)/len(xs),3),round(sum(ys)/len(ys),3)],'mean_luma':round(sum(.2126*v[0]+.7152*v[1]+.0722*v[2] for v in visible)/len(visible),3),'alpha_levels':sorted(set(v[3] for v in p)),'palette':[list(v) for v in sorted(set(visible))],'components':[len(x) for x in groups(im)],'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}

def export(parts):
    files={}
    for i,ident in enumerate(SELECT[:3]):
        for f in range(3):files[f'lightning-{i}-f{f}.png']=recolour(parts[ident],BOLT,BOLT_FRAMES[f])
    for i,ident in enumerate(SELECT[3:7]):
        for f in range(4):files[f'wind-{i}-f{f}.png']=recolour(parts[ident].crop((0,f*48,144,(f+1)*48)),WIND,WIND_FRAMES[f])
    flash=parts['flash-a'].copy();flash.putdata([(228,234,255,FLASH_ALPHA[GREYS.index(p[:3])]) if p[3] else (0,0,0,0) for p in flash.get_flattened_data()]);files['lightning-flash.png']=flash
    result={}
    for name,im in files.items():save(im,OUT/name);result[name]=measure(im,OUT/name)
    return files,result

def compose(bg,im,xy=(0,0)):
    r=bg.convert('RGBA').copy();r.alpha_composite(im,xy);return r.convert('RGB')

def pair_sheet(im,label,path):
    w,h=im.size;sheet=Image.new('RGB',(w*5+48,h*4+60),(27,32,38));d=ImageDraw.Draw(sheet)
    d.text((12,10),label+' | native + exact nearest-neighbour 4x',fill=(235,240,241));sheet.paste(im,(12,40));sheet.paste(im.resize((w*4,h*4),NN),(w+32,40))
    save(sheet,path,native_rect=[12,40,w,h],four_rect=[w+32,40,w*4,h*4])

def file_reviews(files):
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA')
    city=Image.open(REF/'ref-modern-city.png').convert('RGBA')
    for name,im in files.items():
        if name.startswith('wind'):bg=grass.crop((72,72,216,120))
        elif name=='lightning-flash.png':bg=city.crop((48,48,240,240))
        else:bg=Image.new('RGBA',im.size,(38,47,64,255))
        pair_sheet(compose(bg,im),name,REV/f'r16-D-file-{name}')

def selection(parts):
    sheet=Image.new('RGB',(1000,1120),(27,32,38));d=ImageDraw.Draw(sheet)
    for i,ident in enumerate(['bolt-2a','bolt-2b']):
        im=parts[ident];bg=compose(Image.new('RGBA',im.size,(38,47,64,255)),im)
        x=20+i*240;d.text((x,10),ident+(' SELECTED' if ident in SELECT else ' alternative'),fill='white');sheet.paste(bg,(x,35));sheet.paste(bg.resize((144,432),NN),(x+65,35))
    for i,ident in enumerate(['wind-3a','wind-3b']):
        im=parts[ident];bg=compose(Image.new('RGBA',im.size,(66,87,68,255)),im)
        x=20+i*490;d.text((x,485),ident+(' SELECTED' if ident in SELECT else ' alternative'),fill='white');sheet.paste(bg.resize((432,576),NN),(x,510))
    save(sheet,REV/'r16-D-selection.png')

def overview(files):
    sheet=Image.new('RGB',(720,630),(27,32,38));d=ImageDraw.Draw(sheet)
    for i in range(3):
        for f in range(3):
            im=files[f'lightning-{i}-f{f}.png'];x=16+i*196+f*56;y=28
            d.text((x,y-16),f'{i} f{f}',fill='white');sheet.paste(compose(Image.new('RGBA',im.size,(38,47,64,255)),im),(x,y))
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((72,72,216,120))
    for i in range(4):
        for f in range(4):
            x=16+f*174;y=210+i*80;d.text((x,y-16),f'wind-{i} f{f}',fill='white');sheet.paste(compose(grass,files[f'wind-{i}-f{f}.png']),(x,y))
    d.text((16,544),'Flash: separate 192x192 file sheet. All previews at native size.',fill='white')
    d.text((16,566),'Bolts: same mask, dimmer RGB. Gusts: drawn phase changes + dimmer RGB.',fill='white')
    d.text((16,588),'Sources: image-tool drawings on magenta; exact 8x8 mode reduction.',fill='white')
    save(sheet,REV/'r16-D-overview-1x.png');save(sheet.resize((2880,2520),NN),REV/'r16-D-overview-4x.png')

def gif(frames,durations,path):
    # Shared palette avoids frame-local GIF colour pumping.
    atlas=Image.new('RGB',(frames[0].width,frames[0].height*len(frames)))
    for i,im in enumerate(frames):atlas.paste(im,(0,i*im.height))
    pal=atlas.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
    indexed=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in frames]
    indexed[0].save(path,save_all=True,append_images=indexed[1:],duration=durations,loop=0,disposal=2,optimize=False)

def lightning_scene(files,idx,context,phase):
    if context=='cloud':bg=Image.new('RGBA',(288,288),(30,38,53,255))
    else:bg=Image.open(REF/f'ref-{context}.png').convert('RGBA')
    # Read approved Part C clouds, never change them.
    cloud=Image.open(OUT/f'cloud-dark-{[2,3,4][idx]}.png').convert('RGBA')
    cx=(288-cloud.width)//2;cy=16
    bolt=files[f'lightning-{idx}-f0.png'];top=bolt.getbbox()[1]
    top_x=round(sum(x for x in range(bolt.width) if bolt.getpixel((x,top))[3])/sum(bool(bolt.getpixel((x,top))[3]) for x in range(bolt.width)))
    anchor_x=cloud.width//2
    anchor_y=max(y for y in range(cloud.height) if cloud.getpixel((anchor_x,y))[3])
    bolt_xy=(cx+anchor_x-top_x,cy+anchor_y-top-3)
    if phase==0:bg.alpha_composite(files['lightning-flash.png'],(48,80))
    if phase is not None:bg.alpha_composite(files[f'lightning-{idx}-f{phase}.png'],bolt_xy)
    bg.alpha_composite(cloud,(cx,cy))
    return bg.convert('RGB')

def animation_reviews(files):
    records=[]
    for i in range(3):
        for context in ['cloud','modern-city','fantasy-town']:
            phases=[None,0,1,2,None];dur=[400,80,120,180,600]
            frames=[lightning_scene(files,i,context,p) for p in phases]
            stem=f'r16-D-bolt-{i}-over-{context}'
            gif(frames,dur,REV/f'{stem}.gif')
            strip=Image.new('RGB',(288*3,312),(27,32,38));d=ImageDraw.Draw(strip)
            for f in range(3):strip.paste(frames[f+1],(f*288,24));d.text((f*288+8,6),f'bolt {i} / f{f} / {context}',fill='white')
            save(strip,REV/f'{stem}-1x.png');save(strip.resize((strip.width*4,strip.height*4),NN),REV/f'{stem}-4x.png')
            records.append({'gif':f'{stem}.gif','kind':'bolt','index':i,'context':context,'phases':phases,'duration_ms':dur})
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((48,48,240,144))
    for i in range(4):
        frames=[compose(grass,files[f'wind-{i}-f{f}.png'],(24,24)) for f in range(4)]+[grass.convert('RGB')]
        dur=[140,140,140,140,420];stem=f'r16-D-wind-{i}-over-grass';gif(frames,dur,REV/f'{stem}.gif')
        strip=Image.new('RGB',(192*4,120),(27,32,38));d=ImageDraw.Draw(strip)
        for f in range(4):strip.paste(frames[f],(f*192,24));d.text((f*192+8,6),f'wind {i} / f{f}',fill='white')
        save(strip,REV/f'{stem}-1x.png');save(strip.resize((strip.width*4,strip.height*4),NN),REV/f'{stem}-4x.png')
        records.append({'gif':f'{stem}.gif','kind':'wind','index':i,'context':'grass','phases':[0,1,2,3,None],'duration_ms':dur})
    return records

def contexts(files):
    names=[f'lightning-{i}-f0.png' for i in range(3)]+['lightning-flash.png']+[f'wind-{i}-f1.png' for i in range(4)]
    for refpath in sorted(REF.glob('ref-*.png')):
        bg=Image.open(refpath).convert('RGBA');sheet=Image.new('RGB',(1152,624),(27,32,38));d=ImageDraw.Draw(sheet)
        for i,name in enumerate(names):
            im=files[name];scene=compose(bg,im,((288-im.width)//2,(288-im.height)//2));x=(i%4)*288;y=(i//4)*312
            sheet.paste(scene,(x,y+24));d.text((x+8,y+7),name,fill='white')
        save(sheet,REV/f'r16-D-context-{refpath.stem[4:]}-1x.png')
        # Each exported phase also gets a placement on every reference.
        for family in ['lightning','wind']:
            phase_names=[n for n in files if n.startswith(family)]
            rows=(len(phase_names)+3)//4
            all_phases=Image.new('RGB',(1152,312*rows),(27,32,38));ad=ImageDraw.Draw(all_phases)
            for i,name in enumerate(phase_names):
                im=files[name];scene=compose(bg,im,((288-im.width)//2,(288-im.height)//2));x=(i%4)*288;y=(i//4)*312
                all_phases.paste(scene,(x,y+24));ad.text((x+8,y+7),name,fill='white')
            save(all_phases,REV/f'r16-D-context-{refpath.stem[4:]}-{family}-all-1x.png')

def html_page(measure,animations):
    text=['<!doctype html><meta charset="utf-8"><title>Round 16 D review</title><style>body{background:#1b2026;color:#edf2f3;font:16px system-ui;margin:24px}img{image-rendering:pixelated;max-width:100%}section{margin:32px 0}a{color:#aed4f3}figure{display:inline-block;margin:12px;vertical-align:top}figcaption{margin:8px 0}</style><h1>Round 16 — Part D</h1><p>Three lightning strikes, a banded flash and four wind gusts. GIFs show a single effect event followed by a clear pause. These are spawned sprites, not seamless looping tiles.</p><p><a href="r16-D-measurements.json">Measurements</a> · <a href="r16-D-generation.json">Drawing prompts</a> · <a href="r16-D-validation.json">Validation</a></p><img src="r16-D-overview-1x.png">']
    for group in ['bolt','wind']:
        text.append('<section><h2>'+group.title()+' animation previews</h2>')
        for r in animations:
            if r['kind']==group:text.append(f'<figure><img src="{r["gif"]}"><figcaption>{r["gif"]}</figcaption></figure>')
        text.append('</section>')
    text.append('<section><h2>Every file — 1× and exact 4×</h2>')
    for name in measure:text.append(f'<details><summary>{name}</summary><img src="r16-D-file-{name}"></details>')
    text.append('</section><section><h2>Reference contexts</h2>')
    for p in sorted(REV.glob('r16-D-context-*-1x.png')):text.append(f'<details><summary>{p.stem}</summary><img src="{p.name}"></details>')
    text.append('</section><section><h2>Alternative selection</h2><img src="r16-D-selection.png"></section>')
    (REV/'r16-D-review.html').write_text('\n'.join(text)+'\n')

def main():
    recs=json.loads((REV/'r16-D-generation.json').read_text());parts={};stages=[]
    for r in recs:
        im,stage=reduce_source(r);parts[r['id']]=im;stages.append(stage)
    files,measurements=export(parts);selection(parts);overview(files);file_reviews(files);animations=animation_reviews(files);contexts(files);html_page(measurements,animations)
    result={'method':'image drawings, magenta key, BOX registration, fixed palette, exact 64-sample RGBA mode, one-pixel native cleanup','selected':SELECT,'stages':stages,'files':measurements,'animations':animations,'bolt_palettes':BOLT_FRAMES,'wind_palettes':WIND_FRAMES,'flash_alpha':FLASH_ALPHA}
    (REV/'r16-D-measurements.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'sources':len(recs),'files':len(files),'mode_blocks':sum(s['mode_blocks'] for s in stages),'cleanup_pixels':sum(len(s['cleanup']) for s in stages),'selected_cleanup_pixels':sum(len(s['cleanup']) for s in stages if s['id'] in SELECT),'measurements':{n:{k:m[k] for k in ['bounds','covered_pixels','components','mean_luma','centroid']} for n,m in measurements.items()}},indent=2))

if __name__=='__main__':main()
