from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'out'
WORK = OUT / 'work'
RAMPS = {
    'outline': ['302321', '49332A'],
    'leather_wood_brown_hair': ['443027', '68432D', '93603A', 'B7804B'],
    'moss': ['383D28', '515735', '737847', '969B61'],
    'skin': ['9A6343', 'C18B5C', 'E5B47C', 'F2CF9B'],
    'linen_white_hair': ['786349', 'A38B68', 'C7B28B', 'E8D5AF'],
}
HEXES = sum(RAMPS.values(), [])
PALETTE = [tuple(bytes.fromhex(c)) for c in HEXES]

def reduce(source, column, count, name):
    original = Image.open(OUT / 'test-big' / source).convert('RGB')
    w, h = original.size
    col = original.crop((round(w * column/count), 0, round(w*(column+1)/count), h))
    # Keep a source-only column for the image tool's later turnaround reference.
    col.save(WORK / f'{name}-source.png')
    keyed = Image.new('RGBA',col.size)
    keyed.putdata([(0,0,0,0) if r>120 and b>100 and g<115 and min(r,b)-g>60 else (r,g,b,255) for r,g,b in col.getdata()])
    bbox = keyed.getbbox()
    crop = keyed.crop(bbox)
    crop.save(WORK / f'{name}-keyed.png')
    width = round(crop.width * 92 / crop.height)
    assert width < 94, (name, width)
    reduced = crop.resize((width,92), Image.Resampling.BOX)
    reduced.putdata([(0,0,0,0) if a<128 else (*min(PALETTE,key=lambda p:(r-p[0])**2+(g-p[1])**2+(b-p[2])**2),255) for r,g,b,a in reduced.getdata()])
    frame = Image.new('RGBA',(96,128))
    frame.paste(reduced, ((96-width)//2,33))
    frame.save(OUT/f'test-{name}.png')
    return {'source':source,'column':column,'count':count,'crop_bbox':bbox,'reduced_width':width}

def assemble(names, filename, scale=3):
    sheet=Image.open(ROOT/'STYLE-SHEET.png').convert('RGB')
    bg=sheet.getpixel((10,600))
    cell=96*scale
    canvas=Image.new('RGB',(cell*len(names),128*scale+36),bg)
    draw=ImageDraw.Draw(canvas)
    font=ImageFont.load_default(size=15 if scale==3 else 10)
    for i,(label,path) in enumerate(names):
        spr=Image.open(path).convert('RGBA')
        canvas.paste(spr.resize((96*scale,128*scale),Image.Resampling.NEAREST),(i*cell,36),spr.resize((96*scale,128*scale),Image.Resampling.NEAREST))
        draw.text((i*cell+cell//2,12),label,font=font,fill='#302321',anchor='mt')
    canvas.save(OUT/filename)

def main():
    config=json.loads((WORK/'sources.json').read_text())
    sources={name:reduce(*spec,name) for name,spec in config.items()}
    (WORK/'palette.json').write_text(json.dumps({'ramps':RAMPS,'allowed':HEXES,'order':'ramp insertion order; ties resolve to first entry','olive_exception':'Not applied: Wren-only exception; no Wren sprites are reduced here.'},indent=2)+'\n')
    (WORK/'source-map.json').write_text(json.dumps(sources,indent=2)+'\n')
    checks={}
    unions={}
    for name in config:
        im=Image.open(OUT/f'test-{name}.png')
        pixels=list(im.getdata())
        colors={p[:3] for p in pixels if p[3]==255}
        bbox=im.getbbox()
        assert im.size==(96,128)
        assert {p[3] for p in pixels}=={0,255}
        assert (bbox[1],bbox[3])==(33,125)
        assert bbox[0]>0 and bbox[2]<96
        assert colors <= set(PALETTE)
        assert all(p==(0,0,0,0) for p in pixels if not p[3])
        who=name.split('-')[0]
        unions.setdefault(who,set()).update(colors)
        checks[name]={'size':list(im.size),'bbox':list(bbox),'occupied_height':92,'lowest_row':124,'binary_alpha':True,'transparent_rgb_zero':True,'colors':len(colors),'allowed_palette':True}
    for who,colors in unions.items():
        assert len(colors)<=32
        checks[who+'-color-union']=len(colors)
    (WORK/'checks.json').write_text(json.dumps(checks,indent=2)+'\n')
    refs=[(f'{who.upper()} / {view.upper()}',ROOT/'ref-sprites'/f'{who}-{view}.png') for who in ['wren','hadrik','noble'] for view in ['front','side']]
    tests=[(name.upper().replace('-',' / '),OUT/f'test-{name}.png') for name in ['innkeeper-front','innkeeper-side','elder-front','elder-side'] if name in config]
    assemble(refs+tests,'test-strip.png')
    assemble(tests,'work/test-native.png',1)
    for who in ['innkeeper','elder']:
        group=[item for item in tests if item[0].startswith(who.upper())]
        if group: assemble(group,f'work/{who}-3x.png')
    print(json.dumps(checks,indent=2))

if __name__=='__main__': main()
