"""Same painted registration, palette lock and exact 64-vote mode, in C.

No generated geometry. Includes source-size validation against native output.
"""
from pathlib import Path
import ctypes, importlib.util, json, hashlib, subprocess
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('oldpaint',R/'r17-C7-process.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old)
PAL=old.PAL
mode_library=R/'r17-C7-critic1-mode.so'
if not mode_library.exists():
    subprocess.run(['cc','-O3','-shared','-fPIC',str(R/'r17-C7-critic1-mode.c'),'-o',str(mode_library)],check=True)
lib=ctypes.CDLL(str(mode_library))
def key(im):
    im=im.convert('RGBA');buf=ctypes.create_string_buffer(im.tobytes());lib.magenta(buf,im.width*im.height)
    return Image.frombytes('RGBA',im.size,buf.raw[:im.width*im.height*4])
def register(source,size,name,box=None,palette=None,outline=True,course=False,output=None,xcuts=None,ycuts=None):
    src0=Image.open(R/source);source_size=src0.size;src=key(src0);box=box or src.getbbox();src=src.crop(box)
    w,h=size;palette=sorted(set(palette or PAL));assert len(palette)<255
    assert src.width>=w and src.height>=h,(name,'undersized drawing',src.size,size)
    pal=Image.new('P',(1,1));pal.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    xs,xd=xcuts or ([0,src.width],[0,w]);ys,yd=ycuts or ([0,src.height],[0,h])
    # Small production pieces can be registered by structural bands.
    if xcuts or ycuts:
        reg=Image.new('RGBA',(w*8,h*8))
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):
                reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
        src=reg
    raw=bytearray()
    for y in range(0,h,24):
        n=min(24,h-y);reg=src.resize((w*8,n*8),Image.Resampling.BOX,box=(0,y*src.height/h,src.width,(y+n)*src.height/h))
        idx=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).tobytes();alpha=reg.getchannel('A').tobytes()
        out=ctypes.create_string_buffer(w*n);lib.mode64(idx,alpha,out,w,n);raw.extend(out.raw)
    def rgba(data):
        a=Image.frombytes('P',(w,h),bytes(data));ramp=[(0,0,0)]+palette
        a.putpalette([v for c in ramp+[ramp[-1]]*(256-len(ramp)) for v in c]);a.info['transparency']=0
        return a.convert('RGBA')
    mode=rgba(raw);mode.save(R/f'r17-C7-critic2-mode-{name}.png')
    buf=ctypes.create_string_buffer(bytes(raw),len(raw));dark=palette.index((43,40,29))+1
    lib.cleanup(buf,w,h,int(outline),dark);im=rgba(buf.raw)
    if course:
        donor=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
        for yy in (0,47):
            interior=donor.crop((1,yy,95,yy+1))
            for xx in range(1,w-1,94): im.paste(interior.crop((0,0,min(94,w-1-xx),1)),(xx,yy))
            im.paste(donor.crop((0,yy,1,yy+1)),(0,yy))
            im.paste(donor.crop((95,yy,96,yy+1)),(w-1,yy))
    outpath=Path(output) if output else R/f'r17-C7-critic2-clean-{name}.png';im.save(outpath)
    rec=dict(id=name,source=source,source_size=list(source_size),bounds=list(box),native_size=list(size),palette=palette,
       source_sha256=hashlib.sha256((R/source).read_bytes()).hexdigest(),mode_blocks=w*h,samples_per_block=64,
       cleanup_pixels=sum(a!=b for a,b in zip(raw,buf.raw)),xcuts=xcuts,ycuts=ycuts,output=str(outpath),course_transfer=course)
    log=R/'r17-C7-critic2-processing.json';records=json.loads(log.read_text()) if log.exists() else []
    log.write_text(json.dumps([r for r in records if r['id']!=name]+[rec],indent=2));print(name,size,flush=True);return im
