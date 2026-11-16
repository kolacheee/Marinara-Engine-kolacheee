"""Render the actual repaired outputs, including true four-frame wind loops."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageSequence
import json, importlib.util
P=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('repair',P/'r16-D-redraw1-build.py')
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
old=m.old;REV=m.REV;OUT=m.OUT;REF=m.REF;NN=m.NN

def files():
    names=[f'lightning-{i}-f{f}.png' for i in range(3) for f in range(3)]+['lightning-flash.png']+[f'wind-{i}-f{f}.png' for i in range(4) for f in range(4)]
    return {n:Image.open(OUT/n).convert('RGBA') for n in names}

def animations(art):
    records=[]
    for i in range(3):
        for context in ['cloud','modern-city','fantasy-town']:
            phases=[None,0,1,2,None];dur=[400,80,120,180,600]
            frames=[old.lightning_scene(art,i,context,p) for p in phases];stem=f'r16-D-bolt-{i}-over-{context}'
            old.gif(frames,dur,REV/f'{stem}.gif')
            strip=Image.new('RGB',(864,312),(27,32,38));d=ImageDraw.Draw(strip)
            for f in range(3):strip.paste(frames[f+1],(f*288,24));d.text((f*288+8,6),f'bolt {i} / f{f} / {context}',fill='white')
            old.save(strip,REV/f'{stem}-1x.png');old.save(strip.resize((3456,1248),NN),REV/f'{stem}-4x.png')
            records.append({'gif':f'{stem}.gif','kind':'bolt','index':i,'context':context,'phases':phases,'duration_ms':dur})
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((48,48,240,144))
    for i in range(4):
        frames=[old.compose(grass,art[f'wind-{i}-f{f}.png'],(24,24)) for f in range(4)]
        dur=[140]*4;stem=f'r16-D-wind-{i}-over-grass';old.gif(frames,dur,REV/f'{stem}.gif')
        strip=Image.new('RGB',(768,120),(27,32,38));d=ImageDraw.Draw(strip)
        for f in range(4):strip.paste(frames[f],(f*192,24));d.text((f*192+8,6),f'wind {i} / f{f}',fill='white')
        old.save(strip,REV/f'{stem}-1x.png');old.save(strip.resize((3072,480),NN),REV/f'{stem}-4x.png')
        records.append({'gif':f'{stem}.gif','kind':'wind','index':i,'context':'grass','phases':[0,1,2,3],'duration_ms':dur,'sprite_origin':[24,24]})
    for kind,w,h in [('bolt',288,288),('wind',192,96)]:
        rows=[r for r in records if r['kind']==kind];ncols=5 if kind=='bolt' else 4
        sheet=Image.new('RGB',(w*ncols,(h+24)*len(rows)),(27,32,38));d=ImageDraw.Draw(sheet)
        for row,r in enumerate(rows):
            im=Image.open(REV/r['gif'])
            for f,frame in enumerate(ImageSequence.Iterator(im)):
                sheet.paste(frame.convert('RGB'),(w*f,row*(h+24)+24));d.text((w*f+5,row*(h+24)+5),f'{r["index"]} {r["context"]} / {r["phases"][f]} / {r["duration_ms"][f]} ms',fill='white')
        old.save(sheet,REV/f'r16-D-decoded-{kind}-gifs-1x.png')
    return records

def focused(art):
    refs=['fantasy-grass','desert-sand','snow','fantasy-town','modern-city']
    sheet=Image.new('RGB',(960,5*178),(27,32,38));d=ImageDraw.Draw(sheet);contrast={}
    def energy(bg,im):
        c=old.compose(bg,im,(24,0))
        return sum(abs(.2126*(a[0]-b[0])+.7152*(a[1]-b[1])+.0722*(a[2]-b[2])) for a,b in zip(bg.convert('RGB').get_flattened_data(),c.get_flattened_data()))
    for row,ref in enumerate(refs):
        bg=Image.open(REF/f'ref-{ref}.png').convert('RGBA').crop((96,72,192,216));contrast[ref]={}
        for i in range(3):
            values=[]
            for f in range(3):
                im=art[f'lightning-{i}-f{f}.png'];x=(i*3+f)*106;y=row*178
                d.text((x,y),f'{i} f{f} {ref}',fill='white');sheet.paste(old.compose(bg,im,(24,0)),(x,y+16));values.append(round(energy(bg,im),3))
            before=Image.open(REV/f'r16-D-redraw1-before-lightning-{i}-f2.png').convert('RGBA')
            contrast[ref][str(i)]={'sum_absolute_luminance_difference_f0_f1_f2':values,'old_f2':round(energy(bg,before),3),'new_f2_over_f1':round(values[2]/values[1],4)}
    old.save(sheet,REV/'r16-D-redraw1-afterglow-context.png')
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((72,72,216,120))
    seam=Image.new('RGB',(800,4*100),(27,32,38));d=ImageDraw.Draw(seam);endpoints={}
    for i in range(4):
        seq=[2,3,0,1]
        for j,f in enumerate(seq):
            d.text((j*200+6,i*100+4),f'wind {i} f{f}',fill='white');seam.paste(old.compose(grass,art[f'wind-{i}-f{f}.png']),(j*200+6,i*100+24))
        before=[Image.open(REV/f'r16-D-redraw1-before-wind-{i}-f{f}.png').convert('RGBA') for f in [3,0]]
        after=[art[f'wind-{i}-f{f}.png'] for f in [3,0]]
        def change(pair):
            a,b=[old.compose(grass,x) for x in pair]
            return sum(sum(abs(x-y) for x,y in zip(p,q)) for p,q in zip(a.get_flattened_data(),b.get_flattened_data()))/(144*48*3)
        endpoints[str(i)]={'old_closure_mean_rgb_change':round(change(before),4),'new_closure_mean_rgb_change':round(change(after),4),'reduction_percent':round(100*(1-change(after)/change(before)),2)}
    old.save(seam,REV/'r16-D-redraw1-wind-loop-seams.png');old.save(seam.resize((3200,1600),NN),REV/'r16-D-redraw1-wind-loop-seams-4x.png')
    return contrast,endpoints

def detail_montages(art):
    for context in ['cloud','modern-city','fantasy-town']:
        sheet=Image.new('RGB',(864,936),(27,32,38))
        for i in range(3):sheet.paste(Image.open(REV/f'r16-D-bolt-{i}-over-{context}-1x.png'),(0,i*312))
        old.save(sheet,REV/f'r16-D-redraw1-{context}-phases.png')
    sheet=Image.new('RGB',(864,636),(27,32,38))
    for i in range(3):sheet.paste(Image.open(REV/f'r16-D-file-lightning-{i}-f2.png'),(i*288,0))
    old.save(sheet,REV/'r16-D-redraw1-afterglow-details.png')
    for f in [0,3]:
        sheet=Image.new('RGB',(768,1008),(27,32,38))
        for i in range(4):sheet.paste(Image.open(REV/f'r16-D-file-wind-{i}-f{f}.png'),(0,i*252))
        old.save(sheet,REV/f'r16-D-redraw1-wind-f{f}-details.png')
    sheet=Image.new('RGB',(1120,552),(27,32,38));d=ImageDraw.Draw(sheet)
    for col,path in enumerate(sorted(REF.glob('ref-*.png'))):
        bg=Image.open(path).convert('RGBA').crop((72,120,216,168));d.text((col*160+4,5),path.stem[4:],fill='white')
        for i in range(4):
            for j,f in enumerate([0,3]):
                y=24+(i*2+j)*64;d.text((col*160+4,y),f'wind {i} f{f}',fill='white');sheet.paste(old.compose(bg,art[f'wind-{i}-f{f}.png']),(col*160+4,y+14))
    old.save(sheet,REV/'r16-D-redraw1-wind-all-contexts.png')

def main():
    art=files();old.file_reviews(art);old.contexts(art);old.overview(art)
    overview=Image.open(REV/'r16-D-overview-1x.png').convert('RGB');d=ImageDraw.Draw(overview)
    d.rectangle((0,560,720,630),fill=(27,32,38));d.text((16,566),'Afterglows: thinner pale drawn remnants. Wind: four phases, no blank pause.',fill='white');d.text((16,588),'Critic D1 redraw: all 15 passing files retained byte-for-byte.',fill='white')
    old.save(overview,REV/'r16-D-overview-1x.png');old.save(overview.resize((2880,2520),NN),REV/'r16-D-overview-4x.png')
    anim=animations(art);contrast,endpoints=focused(art);detail_montages(art)
    measurements={n:old.measure(im,OUT/n) for n,im in art.items()}
    data={'revision':'critic-r16D-1 redraw','selected_bolts':m.SELECT_BOLTS,'selected_wind':m.SELECT_WIND,'files':measurements,'animations':anim,'afterglow_contrast':contrast,'wind_closure':endpoints}
    for name in ['r16-D-measurements.json','r16-D-redraw1-measurements.json']:(REV/name).write_text(json.dumps(data,indent=2)+'\n')
    (REV/'r16-D-selection.png').write_bytes((REV/'r16-D-redraw1-selection.png').read_bytes())
    old.html_page(measurements,anim)
    html=(REV/'r16-D-review.html').read_text().replace('GIFs show a single effect event followed by a clear pause. These are spawned sprites, not seamless looping tiles.','Critic D1 repair: pale, narrower afterglows; tiny wind endpoint wisps. Wind GIFs use exactly four 140 ms frames, fixed origin, with no blank frame. The 15 passing PNGs are unchanged.').replace('r16-D-generation.json','r16-D-redraw1-generation.json')
    html=html.replace('<h1>Round 16 — Part D</h1>','<h1>Round 16 — Part D: critic-r16D-1 redraw</h1>').replace('<section><h2>Alternative selection','<section><h2>Fade and loop closure</h2><img src="r16-D-redraw1-afterglow-context.png"><img src="r16-D-redraw1-wind-loop-seams.png"></section><section><h2>Alternative selection')
    (REV/'r16-D-review.html').write_text(html)
    print(json.dumps({'files':len(art),'GIFs':len(anim),'afterglow_f2_over_f1':{ref:{i:v['new_f2_over_f1'] for i,v in values.items()} for ref,values in contrast.items()},'wind_closure':endpoints},indent=2))

if __name__=='__main__':main()
