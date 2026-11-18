"""New end-transition drawing only; all approved C5 PNGs remain untouched."""
from pathlib import Path
from PIL import Image, ImageDraw
import importlib.util, json, hashlib
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C5-process.py')
p=importlib.util.module_from_spec(s);s.loader.exec_module(p)

def run():
    logs=[];candidates={}
    for v in 'ab':
        rec=dict(id='critic3-roof-'+v,source='r17-C5-critic3-source-roof-'+v+'.png',size=[144,144])
        a,log=p.register(rec,palette=list(dict.fromkeys(p.RED+p.FLOOR+p.STONE)))
        logs.append(log);candidates[v]=a
    # Trace the painted front gable to retain plaster and timber while locking
    # all roof paint to exactly the same ramp as the existing directional fills.
    a=candidates['b'].copy();gable=Image.new('L',a.size)
    ImageDraw.Draw(gable).polygon([(72,115),(18,143),(126,143)],fill=255)
    edits=[]
    for y in range(144):
        for x in range(144):
            old=a.getpixel((x,y))
            if old[3] and not gable.getpixel((x,y)):
                rgb=min(p.RED,key=lambda c:sum((c[k]-old[k])**2 for k in range(3)))
                new=rgb+(255,)
                if new!=old:edits.append([x,y,list(old),list(new)]);a.putpixel((x,y),new)
    name='roof-extension-cap-c5r3-w3'
    crops={'roof-fill-left-c5r3':[0,48,48,96],'roof-ridge-c5r3':[48,48,96,96],'roof-fill-right-c5r3':[96,48,144,96]}
    # Fill planes omit exterior outlines; only the complete end silhouette
    # owns a one-pixel dark contour. No alpha or drawn shape is changed.
    exports={n:a.crop(box) for n,box in crops.items()};outline=[]
    alpha=a.getchannel('A')
    for y in range(144):
        for x in range(144):
            if alpha.getpixel((x,y)) and any(xx<0 or yy<0 or xx>=144 or yy>=144 or not alpha.getpixel((xx,yy)) for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]):
                old=a.getpixel((x,y));new=p.RED[0]+(255,)
                if old!=new:outline.append([x,y,list(old),list(new)]);a.putpixel((x,y),new)
    exports[name]=a
    files=json.loads((R/'r17-C5-files.json').read_text())
    for n,im in exports.items():
        im.save(O/(n+'.png'));v=list(im.get_flattened_data())
        files[n]=dict(size=list(im.size),sha256=hashlib.sha256((O/(n+'.png')).read_bytes()).hexdigest(),colours=len(set(q[:3] for q in v if q[3])),alpha=sorted(set(q[3] for q in v)),hidden_rgb=0)
    (R/'r17-C5-files.json').write_text(json.dumps(files,indent=2))
    (R/'r17-C5-critic3-processing.json').write_text(json.dumps(dict(drawings=logs,selected='b',reason='B has coherent shallow tile courses and smaller tile clusters. A tiles are too broad. The retained C5 swatches pass individually but differ at their actual joins; a matched extension kit uses native B crops without replacing any passing file.',output=name,native_crops=crops,roof_palette_edits=edits,exterior_outline_edits=outline,gable_preservation_polygon=[(72,115),(18,143),(126,143)]),indent=2))
    sheet=Image.new('RGBA',(352,184),(60,62,55,255));d=ImageDraw.Draw(sheet)
    for i,v in enumerate('ab'):sheet.alpha_composite(candidates[v],(16+i*176,32));d.text((16+i*176,8),v.upper()+(' / selected' if v=='b' else ''),fill='white')
    for z in (1,4):sheet.resize((352*z,184*z),Image.Resampling.NEAREST).save(R/f'r17-C5-critic3-roof-selection-{z}x.png')

if __name__=='__main__':run()
