from pathlib import Path
import json
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
HEX = '191B24 30313C 50515A 7D8284 4A2928 844335 B96845 E2AC83 55382D 866044 B79263 E9D8AD 263C35 48604A 7F9363 BDD1A0 202D49 344F70 668298 ADC8C8 705427 AC8139 D7B45D F3D997'.split()
PAL = [tuple(bytes.fromhex(c)) for c in HEX]

def snap(im):
    cache = {}
    data=[]
    for r,g,b,a in im.getdata():
        if a<128:
            data.append((0,0,0,0)); continue
        rgb=(r,g,b)
        if rgb not in cache:
            cache[rgb]=min(PAL,key=lambda p:2*(r-p[0])**2+3*(g-p[1])**2+2*(b-p[2])**2)+(255,)
        data.append(cache[rgb])
    out=Image.new('RGBA',im.size); out.putdata(data)
    return out

def reduce(src,dst):
    im=Image.open(src).convert('RGB')
    data=[(0,0,0,0) if r>120 and b>120 and r-g>65 and b-g>65 else (r,g,b,255) for r,g,b in im.getdata()]
    keyed=Image.new('RGBA',im.size); keyed.putdata(data)
    im=keyed.crop(keyed.getbbox())
    im=snap(im.resize((round(im.width*92/im.height),92),Image.Resampling.BOX))
    im=im.crop(im.getbbox())
    if im.height!=92:
        im=snap(im.resize((round(im.width*92/im.height),92),Image.Resampling.NEAREST))
    xs=[x for y in range(im.height-3,im.height) for x in range(im.width) if im.getpixel((x,y))[3]]
    center=(min(xs)+max(xs))/2
    assert im.width<=96
    x=max(0,min(96-im.width,round(48-center)))
    frame=Image.new('RGBA',(96,128)); frame.paste(im,(x,125-im.height)); frame.save(dst)
    return frame

def check(path):
    im=Image.open(path).convert('RGBA'); data=list(im.getdata())
    colors={p[:3] for p in data if p[3]}; bounds=im.getbbox()
    rows=sum(any(im.getpixel((x,y))[3] for x in range(96)) for y in range(128))
    result={'file':path.name,'size':list(im.size),'bounds_inclusive':[bounds[0],bounds[1],bounds[2]-1,bounds[3]-1], 'occupied_rows':rows,'alpha':sorted({p[3] for p in data}),'colors':len(colors),'palette_ok':colors<=set(PAL),'transparent_rgb_zero':all(p==(0,0,0,0) for p in data if not p[3])}
    result['pass']=im.size==(96,128) and bounds[1]==33 and bounds[3]==125 and rows==92 and result['alpha']==[0,255] and result['palette_ok'] and result['transparent_rgb_zero']
    assert result['pass'],result
    return result

if __name__=='__main__' and len(sys.argv)==3:
    im=reduce(ROOT/sys.argv[1],ROOT/sys.argv[2]); print(json.dumps(check(ROOT/sys.argv[2]),indent=2))
    bg=Image.new('RGBA',im.size,Image.open(ROOT/'STYLE-SHEET.png').getpixel((0,0)))
    bg.alpha_composite(im)
    bg.convert('RGB').resize((576,768),Image.Resampling.NEAREST).save(OUT/'review'/('review-'+Path(sys.argv[2]).name))
