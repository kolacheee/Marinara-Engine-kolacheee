import sys, numpy as np, json
from PIL import Image, ImageFilter
from scipy import ndimage
W=sys.argv[1]; a=np.asarray(Image.open(W+"/out/raw.png").convert("RGB")).astype(int)
key=(a[...,0]>180)&(a[...,1]<110)&(a[...,2]>180)
near=np.asarray(Image.fromarray((key*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)))>0
spill=near&~key&(a[...,0]-a[...,1]>60)&(a[...,2]-a[...,1]>60)
alpha=~(key|spill)
lab,n=ndimage.label(ndimage.binary_opening(alpha,iterations=2)); sizes=ndimage.sum(alpha,lab,range(1,n+1))
figs=[ndimage.find_objects(lab)[i] for i in np.argsort(sizes)[::-1][:5]]
hs=sorted(s[0].stop-s[0].start for s in figs); med=hs[len(hs)//2]
scale=192/med
im=Image.fromarray(np.dstack([a,alpha*255]).astype(np.uint8),"RGBA"); bb=im.getbbox(); im=im.crop(bb)
im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.BOX)
o=np.asarray(im).copy(); o[...,3]=np.where(o[...,3]>=128,255,0); im=Image.fromarray(o,"RGBA"); im.save(W+"/out/lineup.png")
bg=Image.new("RGBA",im.size,(74,70,66,255)); bg.alpha_composite(im); bg.convert("RGB").save(W+"/out/lineup-on-grey.png")
json.dump({"raw_size":list(a.shape[1::-1]),"figure_heights_raw_px":hs,"scale":round(scale,4),"lineup_size":list(im.size),"implied_art_pixel_raw_px":round(med/48,1)},open(W+"/out/process.json","w"),indent=1)
print(open(W+"/out/process.json").read())
