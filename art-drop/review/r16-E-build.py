"""Register image-tool drawings and mode-reduce them; never draw icon shapes."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, PngImagePlugin
from collections import Counter
import json, hashlib

ROOT=Path(__file__).resolve().parents[1]
REV=ROOT/'review'; OUT=ROOT/'out/weather16'
NN=Image.Resampling.NEAREST
OUTLINE=(32,41,54)
NEUTRAL=[OUTLINE,(89,111,134),(146,170,184),(206,219,222),(245,243,223)]
GOLD=[(187,116,59),(232,183,83),(255,240,176)]
BLUE=[(85,143,190),(113,184,221),(196,231,240)]
SAND=[(158,106,61),(201,155,83),(234,213,154)]
NAMES=['clear-day','clear-night','cloudy','overcast','rain','heavy_rain','storm','snow','blizzard','fog','wind','hail','sandstorm','heat_wave']
SELECT={n:n+'-a' for n in NAMES}
SELECT.update(cloudy='cloudy-g',overcast='overcast-f',snow='snow-d',blizzard='blizzard-b',sandstorm='sandstorm-c',heat_wave='heat_wave-d')
FITS={n:(22,22) for n in NAMES}

def save(im,path,**metadata):
    info=PngImagePlugin.PngInfo()
    for k,v in metadata.items():info.add_text(k,json.dumps(v))
    im.save(path,pnginfo=info)

def groups(im):
    w,h=im.size; p=list(im.get_flattened_data()); todo={i for i,v in enumerate(p) if v[3]}; result=[]
    while todo:
        seed=todo.pop(); stack=[seed]; part=[seed]
        while stack:
            q=stack.pop(); y,x=divmod(q,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    j=yy*w+xx
                    if j in todo:todo.remove(j);stack.append(j);part.append(j)
        result.append(part)
    return sorted(result,key=len,reverse=True)

def palette(name):
    if name=='sandstorm':return [OUTLINE]+SAND
    if name=='clear-day':return [OUTLINE]+GOLD
    if name=='heat_wave':return [OUTLINE,(200,121,63)]+GOLD
    return NEUTRAL+(GOLD if name in ['cloudy','storm'] else [])+(BLUE if name in ['rain','heavy_rain','blizzard'] else [])

def reduce_source(rec):
    ident=rec['id'];name=ident.rsplit('-',1)[0];pal=palette(name)
    raw=Image.open(REV/rec['source']).convert('RGB')
    keyed=Image.new('RGBA',raw.size)
    keyed.putdata([(0,0,0,0) if r>135 and b>135 and r>g+45 and b>g+45 else (r,g,b,255) for r,g,b in raw.get_flattened_data()])
    if rec.get('extract_cloud'):
        # Select the painted cool foreground and its adjacent EXISTING dark
        # stroke. The mask adds no colour or alpha to the source drawing.
        rp=list(keyed.get_flattened_data());fill=Image.new('L',raw.size)
        fill.putdata([255 if a and r>100 and b>175 and b>=r+6 and g>=r+6 else 0 for r,g,b,a in rp])
        near=fill.filter(ImageFilter.MaxFilter(85))
        keyed.putdata([p if f or (n and p[3] and max(p[:3])<115) else (0,0,0,0) for p,f,n in zip(rp,fill.get_flattened_data(),near.get_flattened_data())])
        save(keyed,REV/f'r16-E-extracted-{ident}.png')
    bbox=keyed.getbbox(); crop=keyed.crop(bbox); fw,fh=FITS[name]
    scale=min(fw/crop.width,fh/crop.height)
    bw,bh=round(crop.width*scale),round(crop.height*scale)
    x,y=(24-bw)//2,(24-bh)//2
    reg=Image.new('RGBA',(192,192)); placements=[]
    if rec.get('retain_sun'):
        # Retain only the old drawing's gold pixels and their drawn navy edge.
        # The new foreground cloud occludes this unchanged native sun artwork.
        prior=Image.open(REV/rec['retain_sun']).convert('RGBA');pp=list(prior.get_flattened_data())
        gold=Image.new('L',(24,24));gold.putdata([255 if p[3] and p[:3] in GOLD else 0 for p in pp])
        near=gold.filter(ImageFilter.MaxFilter(3))
        prior.putdata([p if g or (n and p[:3]==OUTLINE) else (0,0,0,0) for p,g,n in zip(pp,gold.get_flattened_data(),near.get_flattened_data())])
        reg.alpha_composite(prior.resize((192,192),NN))
    if 'native_bounds' in rec:
        tx,ty,tr,tb=rec['native_bounds']
        reg.alpha_composite(crop.resize(((tr-tx)*8,(tb-ty)*8),Image.Resampling.BOX),(tx*8,ty*8))
        placements.append({'source_crop':list(bbox),'native_bounds':rec['native_bounds']})
    elif ident in ['snow-b','snow-c','snow-d']:
        # Register the three painted components independently so the cross arms
        # retain a white centre after the one-pixel exposed-contour cleanup.
        split_y=670 if ident=='snow-b' else 650
        for source_box,target_box in [
            ((0,0,raw.width,split_y),(1,1,23,11)),
            ((0,split_y,625,raw.height),(2,12,11,21)),
            ((625,split_y,raw.width,raw.height),(13,13,22,22)),
        ]:
            part=keyed.crop(source_box); box=part.getbbox(); part=part.crop(box)
            tx,ty,tr,tb=target_box
            reg.paste(part.resize(((tr-tx)*8,(tb-ty)*8),Image.Resampling.BOX),(tx*8,ty*8))
            placements.append({'source_crop':[source_box[0]+box[0],source_box[1]+box[1],source_box[0]+box[2],source_box[1]+box[3]],'native_bounds':list(target_box)})
    elif ident=='heat_wave-d':
        # Register the separately drawn waves and base bar independently.
        # This preserves a visible interior in the source's narrow base bar.
        for source_box,target_box in [((0,0,raw.width,995),(2,1,22,19)),((0,995,raw.width,raw.height),(1,20,23,23))]:
            part=keyed.crop(source_box); box=part.getbbox(); part=part.crop(box)
            tx,ty,tr,tb=target_box
            reg.paste(part.resize(((tr-tx)*8,(tb-ty)*8),Image.Resampling.BOX),(tx*8,ty*8))
            placements.append({'source_crop':[source_box[0]+box[0],source_box[1]+box[1],source_box[0]+box[2],source_box[1]+box[3]],'native_bounds':list(target_box)})
    else:
        reg.paste(crop.resize((bw*8,bh*8),Image.Resampling.BOX),(x*8,y*8))
        placements.append({'source_crop':list(bbox),'native_bounds':[x,y,x+bw,y+bh]})
    cache={}; locked=[]
    for p in reg.get_flattened_data():
        if p[3]<128:locked.append((0,0,0,0));continue
        rgb=p[:3]
        if rgb not in cache:cache[rgb]=min(pal,key=lambda q:sum((a-b)**2 for a,b in zip(rgb,q)))
        locked.append((*cache[rgb],255))
    reg.putdata(locked); mode=Image.new('RGBA',(24,24)); pixels=[]
    for yy in range(24):
        for xx in range(24):
            count=Counter(locked[(yy*8+sy)*192+xx*8+sx] for sy in range(8) for sx in range(8))
            pixels.append(min(count,key=lambda p:(-count[p],p)))
    mode.putdata(pixels); clean=mode.copy()
    # Remove only detached single-pixel reduction remnants.
    for part in groups(mode):
        if len(part)<=2:
            for i in part:pixels[i]=(0,0,0,0)
    before=pixels.copy()
    # Recolour the existing silhouette's exposed cardinal contour, without growth.
    for i,p in enumerate(before):
        if not p[3]:continue
        yy,xx=divmod(i,24);near=[j for j in [i-1,i+1,i-24,i+24] if 0<=j<576]
        edge=xx in [0,23] or yy in [0,23] or any(not before[j][3] for j in near)
        if edge:pixels[i]=(*OUTLINE,255)
        elif p[:3]==OUTLINE and rec.get('round')!='critic-r16E-1 redraw':
            # Thin thick dark source edges to a single boundary pixel. Retain
            # one-pixel interior division lines if they separate drawn colours.
            if sum(before[j][:3]==OUTLINE for j in near)>=2:
                candidates=[before[j] for j in near if before[j][3] and before[j][:3]!=OUTLINE]
                if candidates:pixels[i]=Counter(candidates).most_common(1)[0][0]
    # Critic requested this single fill repair, with no silhouette changes.
    if ident=='sandstorm-c':pixels[14*24+11]=(*SAND[1],255)
    # Explicit contour repairs follow the drawn boundaries after mode reduction.
    for edit in rec.get('native_cleanup',[]):
        xx,yy=edit['xy'];pixels[yy*24+xx]=tuple(edit['rgba'])
    clean.putdata(pixels)
    edits=[{'xy':[i%24,i//24],'before':list(p),'after':list(q)} for i,(p,q) in enumerate(zip(mode.get_flattened_data(),pixels)) if p!=q]
    for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:save(im,REV/f'r16-E-{stage}-{ident}.png')
    return clean,{'id':ident,'source':rec['source'],'source_size':list(raw.size),'source_crop':list(bbox),'placements':placements,'registered_bounds':list(reg.getbbox()),'palette':pal,'mode_blocks':576,'samples_per_block':64,'cleanup':edits}

def on_panel(im,kind):
    bg=Image.new('RGBA',im.size,(26,31,34,255) if kind=='dark' else (232,229,217,255));bg.alpha_composite(im);return bg.convert('RGB')

def reviews(parts):
    for kind in ['dark','light']:
        row=Image.new('RGB',(14*32+8,40),(26,31,34) if kind=='dark' else (232,229,217))
        for i,n in enumerate(NAMES):row.paste(on_panel(parts[SELECT[n]],kind),(8+i*32,8))
        for s in [1,2,4]:save(row.resize((row.width*s,row.height*s),NN),REV/f'r16-E-row-{kind}-{s}x.png')
    contact=Image.new('RGB',(7*152,2*300),(34,39,49));d=ImageDraw.Draw(contact)
    for i,n in enumerate(NAMES):
        x=i%7*152;y=i//7*300;im=parts[SELECT[n]]
        d.text((x+8,y+6),n,fill='white')
        for j,kind in enumerate(['dark','light']):
            p=on_panel(im,kind);contact.paste(p,(x+6,y+31+j*130));contact.paste(p.resize((96,96),NN),(x+42,y+28+j*130))
        sheet=Image.new('RGB',(304,166),(34,39,49));dd=ImageDraw.Draw(sheet);dd.text((8,8),f'icon-{n}.png / 24x24 / 1x + 4x',fill='white')
        for j,kind in enumerate(['dark','light']):
            p=on_panel(im,kind);sheet.paste(p,(j*152+8,44));sheet.paste(p.resize((96,96),NN),(j*152+44,44));dd.text((j*152+8,146),kind,fill='white')
        save(sheet,REV/f'r16-E-file-icon-{n}.png')
    save(contact,REV/'r16-E-overview.png')
    ids=list(parts);sheet=Image.new('RGB',(6*172,((len(ids)+5)//6)*176),(34,39,49));d=ImageDraw.Draw(sheet)
    for i,ident in enumerate(ids):
        x=i%6*172;y=i//6*176;im=parts[ident];d.text((x+6,y+8),ident+(' *' if ident in SELECT.values() else ''),fill='white');p=on_panel(im,'dark');sheet.paste(p,(x+6,y+34));sheet.paste(p.resize((96,96),NN),(x+42,y+34))
    save(sheet,REV/'r16-E-selection.png')
    # Compare the previously installed drawings with the selected redraws.
    comparison=Image.new('RGB',(640,3*166),(34,39,49));d=ImageDraw.Draw(comparison)
    for i,name in enumerate(['cloudy','overcast','sandstorm']):
        y=i*166;d.text((8,y+8),name+' / previous 1x + 4x / final 1x + 4x',fill='white')
        before=Image.open(REV/f'r16-E-critic1-before-icon-{name}.png').convert('RGBA')
        for j,im in enumerate([before,parts[SELECT[name]]]):
            for k,kind in enumerate(['dark','light']):
                x=j*320+k*160;p=on_panel(im,kind)
                comparison.paste(p,(x+8,y+44));comparison.paste(p.resize((96,96),NN),(x+44,y+44))
    save(comparison,REV/'r16-E-redraw-comparison.png')
    # Actual translucent UI panels over every supplied native reference crop.
    for refpath in sorted((ROOT/'reference/r16').glob('ref-*.png')):
        ref=Image.open(refpath).convert('RGB');rp=ref.load()
        context=Image.new('RGB',(456,112),(34,39,49));d=ImageDraw.Draw(context)
        for j,(kind,panel) in enumerate([('dark',(10,12,20)),('light',(246,243,232))]):
            row=Image.new('RGB',(456,40));row.putdata([tuple((3*panel[c]+rp[x%ref.width,y][c]+2)//4 for c in range(3)) for y in range(40) for x in range(456)])
            for i,n in enumerate(NAMES):row.paste(parts[SELECT[n]],(8+i*32,8),parts[SELECT[n]])
            context.paste(row,(0,16+j*56));d.text((8,j*56+2),refpath.stem+' / '+kind+' panel 75%',fill='white')
        for s in [1,2,4]:save(context.resize((456*s,112*s),NN),REV/f'r16-E-context-{refpath.stem[4:]}-{s}x.png')
    legend=' | '.join(f'{i+1} {n}' for i,n in enumerate(NAMES))
    html='<!doctype html><meta charset="utf-8"><title>Round 16 Part E weather icons</title><style>body{background:#222731;color:#eee;font:15px sans-serif;padding:24px}img{image-rendering:pixelated;display:block;margin:12px 0;max-width:none}p{max-width:1100px}a{color:#afd4f6}</style><h1>Round 16 — Part E</h1><p>14 icons, 24×24 RGBA. Source drawings, mode reduction, fixed palettes and native outline cleanup. Review images are displayed at literal saved size.</p><p>'+legend+'</p>'
    for kind in ['dark','light']:
        html+=f'<h2>{kind} panel</h2>'
        for s in [1,2,4]:html+=f'<p>{s}×</p><img src="r16-E-row-{kind}-{s}x.png">'
    html+='<h2>Each file at 1× and 4×</h2><img src="r16-E-overview.png"><h2>Actual 75% panels over map references</h2>'
    for refpath in sorted((ROOT/'reference/r16').glob('ref-*.png')):
        html+=f'<p>{refpath.stem}</p><img src="r16-E-context-{refpath.stem[4:]}-1x.png"><a href="r16-E-context-{refpath.stem[4:]}-4x.png">4× proof</a>'
    html+='<h2>Three redraws: previous and final</h2><img src="r16-E-redraw-comparison.png"><h2>Drawing alternatives (* selected)</h2><img src="r16-E-selection.png"><p>Prompts: <a href="r16-E-generation.json">generation.json</a>. Measurements: <a href="r16-E-measurements.json">measurements.json</a>. Saved-art self-review; no in-engine test or independent critic verdict.</p>'
    (REV/'r16-E-review.html').write_text(html+'\n')

def main():
    records=json.loads((REV/'r16-E-generation.json').read_text());parts={};stages=[];files={}
    for rec in records:
        if 'original_path' not in rec:continue
        im,stage=reduce_source(rec);parts[rec['id']]=im;stages.append(stage)
    for name in NAMES:
        im=parts[SELECT[name]];path=OUT/f'icon-{name}.png'
        # Never rewrite passing files; require their existing pixels to match.
        if name in ['cloudy','overcast','sandstorm']:save(im,path)
        else:assert Image.open(path).convert('RGBA').tobytes()==im.tobytes(),name
        p=list(im.get_flattened_data());vis=[v for v in p if v[3]]
        files[path.name]={'source':SELECT[name],'size':[24,24],'bounds':list(im.getbbox()),'opaque_pixels':len(vis),'coverage_percent':round(100*len(vis)/576,3),'colours':len(set(vis)),'palette':[list(v) for v in sorted(set(vis))],'components':[len(g) for g in groups(im)],'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    reviews(parts)
    result={'selected':SELECT,'stages':stages,'files':files,'method':'magenta key; BOX registration to 192x192; fixed palette; exact RGBA mode of all 64 samples; native contour cleanup'}
    (REV/'r16-E-measurements.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'sources':len(parts),'outputs':len(files),'mode_blocks':576*len(parts),'cleanup':sum(len(s['cleanup']) for s in stages),'files':files},indent=2))

if __name__=='__main__':main()
