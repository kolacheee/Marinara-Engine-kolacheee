"""Register and reduce image-tool paintings; no procedural cloud drawing."""
from pathlib import Path
from PIL import Image, ImageDraw, PngImagePlugin
from collections import Counter
import json, hashlib

ROOT = Path(__file__).resolve().parents[1]
REV, OUT, REF = ROOT/'review', ROOT/'out/weather16', ROOT/'reference/r16'
NN = Image.Resampling.NEAREST
LIGHT = [(88,110,124),(132,155,164),(170,189,193),(207,219,218),(232,239,235),(248,250,245)]
DARK = [(23,30,41),(36,46,59),(55,68,83),(78,94,107),(111,128,139),(162,178,187)]
SHADOW = (27,36,46)
SIZES = [(96,96),(96,96),(144,96),(144,96),(192,144),(192,144)]
FITS = [(88,80),(78,86),(134,72),(132,82),(180,130),(180,130)]
SELECT = ['0a','1a','2a','3b','4a','5b']

def save(im, path, **meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items(): info.add_text(k,str(v))
    im.save(path,pnginfo=info)

def groups(im,colour=None):
    w,h=im.size
    pixels=list(im.get_flattened_data())
    todo={i for i,p in enumerate(pixels) if p[3] and (colour is None or p[:3]==colour)}
    result=[]
    while todo:
        seed=todo.pop();part=[seed];stack=[seed]
        while stack:
            p=stack.pop();y,x=divmod(p,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    q=yy*w+xx
                    if q in todo:todo.remove(q);part.append(q);stack.append(q)
        result.append(part)
    return sorted(result,key=len,reverse=True)

def mode_reduce(reg,w,h):
    samples=list(reg.get_flattened_data());result=[];rw=w*8
    for y in range(h):
        for x in range(w):
            counts=Counter(samples[(y*8+sy)*rw+x*8+sx] for sy in range(8) for sx in range(8))
            result.append(min(counts,key=lambda p:(-counts[p],p)))
    im=Image.new('RGBA',(w,h));im.putdata(result);return im

def reduce_source(rec):
    ident=rec['id'];idx=int(ident[0]);w,h=SIZES[idx];fw,fh=FITS[idx]
    raw=Image.open(REV/rec['source']).convert('RGB')
    pixels=[(0,0,0,0) if r>g+45 and b>g+45 and r>135 and b>135 else (r,g,b,255) for r,g,b in raw.get_flattened_data()]
    keyed=Image.new('RGBA',raw.size);keyed.putdata(pixels)
    bbox=keyed.getbbox();crop=keyed.crop(bbox)
    scale=min(fw/crop.width,fh/crop.height);bw,bh=round(crop.width*scale),round(crop.height*scale)
    x,y=(w-bw)//2,(h-bh)//2
    reg=Image.new('RGBA',(w*8,h*8));reg.paste(crop.resize((bw*8,bh*8),Image.Resampling.BOX),(x*8,y*8))
    cache={};locked=[]
    for p in reg.get_flattened_data():
        if p[3]<128:locked.append((0,0,0,0));continue
        rgb=p[:3]
        if rgb not in cache:cache[rgb]=min(LIGHT,key=lambda q:sum((a-b)**2 for a,b in zip(rgb,q)))
        locked.append((*cache[rgb],255))
    reg.putdata(locked);mode=mode_reduce(reg,w,h);clean=mode.copy();pix=list(clean.get_flattened_data())
    for part in groups(clean):
        if len(part)<3:
            for q in part:pix[q]=(0,0,0,0)
    # Keep source-drawn darkest strokes at most one pixel into the perimeter.
    for q,p in enumerate(pix.copy()):
        yy,xx=divmod(q,w)
        if p[:3]==LIGHT[0] and 0<xx<w-1 and 0<yy<h-1 and all(pix[z][3] for z in [q-1,q+1,q-w,q+w]):pix[q]=(*LIGHT[1],255)
    for cleanup_pass in range(2):
        clean.putdata(pix);before=pix.copy()
        # Palette-grain cleanup uses only an adjacent drawn colour, never noise.
        for colour in LIGHT:
            for part in groups(clean,colour):
                if len(part)>2:continue
                for q in part:
                    yy,xx=divmod(q,w);near=[]
                    for sy in range(max(0,yy-1),min(h,yy+2)):
                        for sx in range(max(0,xx-1),min(w,xx+2)):
                            p=before[sy*w+sx]
                            if p[3] and p[:3]!=colour:near.append(p)
                    if near:
                        counts=Counter(near)
                        pix[q]=min(counts,key=lambda p:(-counts[p],sum((p[k]-colour[k])**2 for k in range(3)),p))
        clean.putdata(pix)
    edits=[{'index':i,'before':list(p),'after':list(q)} for i,(p,q) in enumerate(zip(mode.get_flattened_data(),pix)) if p!=q]
    for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:save(im,REV/f'r16-C-{stage}-{ident}.png')
    return clean,{'id':ident,'source':rec['source'],'source_size':list(raw.size),'source_crop':list(bbox),'native_size':[w,h],'registered_paint_bounds':[x,y,x+bw,y+bh],'mode_blocks':w*h,'samples_per_block':64,'cleanup':edits,'components':[len(p) for p in groups(clean)]}

def variants(clean,idx):
    pix=list(clean.get_flattened_data());result={}
    for kind in ['light','dark','shadow']:
        data=[]
        for p in pix:
            if not p[3]:data.append((0,0,0,0));continue
            colour=p[:3] if kind=='light' else (DARK[LIGHT.index(p[:3])] if kind=='dark' else SHADOW)
            data.append((*colour,192))
        im=Image.new('RGBA',clean.size);im.putdata(data);path=OUT/f'cloud-{kind}-{idx}.png';save(im,path)
        visible=[p for p in data if p[3]]
        result[path.name]={'size':list(im.size),'bounds':list(im.getbbox()),'covered_pixels':len(visible),'coverage_percent':round(100*len(visible)/(im.width*im.height),4),'alpha_weighted_cover_percent':round(100*sum(p[3] for p in data)/(255*im.width*im.height),4),'visible_opacity':192,'palette':[list(q) for q in sorted(set(visible))],'components':[len(p) for p in groups(im)],'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    return result

def backing(size,colour=(78,91,91)):
    return Image.new('RGBA',size,(*colour,255))

def file_reviews(measure):
    for name in measure:
        im=Image.open(OUT/name).convert('RGBA');w,h=im.size
        bg=backing(im.size,(171,183,177) if 'shadow' in name else (63,78,78));bg.alpha_composite(im)
        sheet=Image.new('RGB',(w*5+48,h*4+60),(27,32,38));d=ImageDraw.Draw(sheet)
        d.text((12,8),name+' | native + nearest-neighbour 4x',fill=(235,240,241))
        sheet.paste(bg.convert('RGB'),(12,40));sheet.paste(bg.resize((w*4,h*4),NN).convert('RGB'),(w+32,40))
        save(sheet,REV/f'r16-C-file-{name}',native_rect=json.dumps([12,40,w,h]),four_rect=json.dumps([w+32,40,w*4,h*4]))

def selection_review(parts):
    ids=['0a','1a','2a','3a','3b','4a','5a','5b']
    sheet=Image.new('RGB',(1040,4*460),(27,32,38));d=ImageDraw.Draw(sheet)
    for k,ident in enumerate(ids):
        im=parts[ident];x=(k%2)*520;y=(k//2)*460
        d.text((x+12,y+8),ident+(' SELECTED' if ident in SELECT else ' alternative'),fill=(235,240,241))
        bg=backing(im.size);bg.alpha_composite(im);sheet.paste(bg,(x+12,y+32));sheet.paste(bg.resize((im.width*2,im.height*2),NN),(x+12,y+184))
    save(sheet,REV/'r16-C-selection.png')

def context_reviews():
    for refpath in sorted(REF.glob('ref-*.png')):
        ref=Image.open(refpath).convert('RGBA'); name=refpath.stem[4:]
        sheet=Image.new('RGB',(6*288,2*314),(27,32,38));d=ImageDraw.Draw(sheet)
        for row,kind in enumerate(['light','dark']):
            for idx in range(6):
                im=Image.open(OUT/f'cloud-{kind}-{idx}.png').convert('RGBA')
                sha=Image.open(OUT/f'cloud-shadow-{idx}.png').convert('RGBA');sha.putalpha(sha.getchannel('A').point(lambda a:56 if a else 0))
                x=(288-im.width)//2;y=(288-im.height)//2
                bg=ref.copy();bg.alpha_composite(sha,(x+18,y+14));bg.alpha_composite(im,(x,y))
                sheet.paste(bg,(idx*288,row*314+26));d.text((idx*288+8,row*314+7),f'{kind}-{idx} / {name}',fill='white')
        save(sheet,REV/f'r16-C-context-{name}-1x.png')

LAYOUT=[(0,28,35),(2,198,10),(1,470,32),(3,632,78),(4,77,197),(5,350,125),(0,716,282),(1,558,342),(2,285,351),(3,12,432),(4,640,412),(5,357,462)]

def sky_reviews():
    records={}
    for name,family,box in [('town','fantasy',(288,96,1152,768)),('city','modern',(288,48,1152,720))]:
        base=Image.open(REF/'renders'/f'ow-{family}-0.png').convert('RGBA').crop(box)
        save(base.convert('RGB'),REV/f'r16-C-sky-{name}-base.png')
        for kind in ['light','dark','mixed']:
            bg=base.copy(); mask=Image.new('RGBA',base.size)
            for idx,x,y in LAYOUT:
                sha=Image.open(OUT/f'cloud-shadow-{idx}.png').convert('RGBA');sha.putalpha(sha.getchannel('A').point(lambda a:56 if a else 0))
                bg.alpha_composite(sha,(x+22,y+18))
            for n,(idx,x,y) in enumerate(LAYOUT):
                ck=kind if kind!='mixed' else ('dark' if n in [3,5,7,10] else 'light')
                cloud=Image.open(OUT/f'cloud-{ck}-{idx}.png').convert('RGBA');bg.alpha_composite(cloud,(x,y));mask.alpha_composite(cloud,(x,y))
            rgb=bg.convert('RGB')
            for scale in [1,3,4]:save(rgb.resize((rgb.width*scale,rgb.height*scale),NN),REV/f'r16-C-sky-{name}-{kind}-{scale}x.png')
            a=list(mask.getchannel('A').get_flattened_data());records[f'{name}-{kind}']={'reference':f'renders/ow-{family}-0.png','crop':list(box),'size':list(bg.size),'clouds':len(LAYOUT),'placements':LAYOUT,'shadow_offset':[22,18],'shadow_preview_alpha':56,'coverage_percent':round(100*sum(v>0 for v in a)/len(a),4),'weighted_cover_percent':round(100*sum(a)/(255*len(a)),4)}
    return records

def overview(measure):
    sheet=Image.new('RGB',(6*208,3*180),(37,45,49));d=ImageDraw.Draw(sheet)
    for j,kind in enumerate(['light','dark','shadow']):
        for i in range(6):
            im=Image.open(OUT/f'cloud-{kind}-{i}.png').convert('RGBA')
            bg=backing(im.size,(171,183,177) if kind=='shadow' else (63,78,78));bg.alpha_composite(im)
            x=i*208;y=j*180;d.text((x+8,y+8),f'{kind}-{i} / {im.width}x{im.height}',fill='white');sheet.paste(bg,(x+(208-im.width)//2,y+28))
    save(sheet,REV/'r16-C-overview-1x.png');save(sheet.resize((sheet.width*4,sheet.height*4),NN),REV/'r16-C-overview-4x.png')

def main():
    records=json.loads((REV/'r16-C-generation.json').read_text());parts={};stages=[];measure={}
    for rec in records:
        im,stage=reduce_source(rec);parts[rec['id']]=im;stages.append(stage)
    for idx,ident in enumerate(SELECT):measure.update(variants(parts[ident],idx))
    selection_review(parts);file_reviews(measure);context_reviews();skies=sky_reviews();overview(measure)
    result={'method':'magenta key, BOX registration, fixed palette, exact 64-sample RGBA mode, native cleanup, fixed alpha','light_palette':LIGHT,'dark_palette':DARK,'shadow_colour':SHADOW,'selected':SELECT,'stages':stages,'files':measure,'sky_reviews':skies}
    (REV/'r16-C-measurements.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'sources':len(parts),'files':len(measure),'mode_blocks':sum(s['mode_blocks'] for s in stages),'cleanup_pixels':sum(len(s['cleanup']) for s in stages),'selected_cleanup_pixels':sum(len(s['cleanup']) for s in stages if s['id'] in SELECT),'files_measurements':{p:{k:v for k,v in m.items() if k in ['bounds','covered_pixels','coverage_percent','components']} for p,m in measure.items() if 'light' in p},'skies':skies},indent=2))

if __name__=='__main__':main()
