"""Assemble operator round-4 sources without resizing.

Image-tool planes supply all replacement texture. Code only maps colours,
places whole-pixel crops, repairs small fragments and reinstates grid joints.
"""
from collections import Counter
import json
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,S,c
from check_proofs import light,rgb
from import_c16 import colour,clean_small,fit_region

CHANGED=['keep','temple','crypt','dungeon_sewer','cave_rock','cave_ice','cave_crystal','cave_lava','yard']
SELECT={'cave_rock':3,'cave_ice':1,'cave_crystal':2,'cave_lava':2,'yard':2}
# Source coordinates are chosen after the registered art is viewed. No scale.
CROPS={
 'cave_rock':[(0,4,143,44),(0,47,143,94),(0,100,143,142)],
 'cave_ice':[(0,3,143,43),(0,47,143,94),(0,96,143,143)],
 'cave_crystal':[(0,1,144,41),(0,51,144,98),(0,105,144,143)],
}
PALETTES={
 'cave_rock':[['mud:1','mud:2','grey-brown-rock:2'],['grey-brown-rock:1','grey-brown-rock:2','mud:3','grey-brown-rock:3'],['mud:4','grey-brown-rock:3','mud:5']],
 'cave_ice':[['blue-ice:1','frost:1','blue-ice:2'],['blue-ice:1','frost:1','blue-ice:2','frost:3'],['blue-ice:2','blue-ice:3','snowdrift:3']],
 'cave_crystal':[['dark-rock:2','dark-rock:3','dark-rock:4'],['dark-rock:2','dark-rock:3','dark-rock:4'],['dark-rock:4','dark-rock:4','dark-rock:5']],
 'cave_lava':[['basalt:2','basalt:3','basalt:4'],['basalt:2','basalt:4','ash:2','basalt:5'],['basalt:5','ash:3','basalt:6']],
 'yard':[['roof-slate:1','yard-cobble:1','roof-slate:2'],['yard-cobble:1','yard-cobble:2','yard-cobble:3'],['yard-cobble:3','roof-slate:3','yard-cobble:4']],
 'keep':[[],[],['limestone:2','iron:3','limestone:3']],
 'temple':[[],[],['marble:2','marble:2','marble:3']],
 'crypt':[[],[],['dark-masonry:4','dark-masonry:4','dark-masonry:5']],
 'dungeon_sewer':[[],[],['brick:3','brick:3','brick:4']],
}
CUTS={
 'cave_rock':[[18,29],[23,34,43],[39,46]],
 'cave_ice':[[35,56],[30,43,60],[46,59]],
 'cave_crystal':[[21,40],[14,23],[32,42]],
 'cave_lava':[[18,29],[20,29,40],[28,40]],
 'yard':[[24,40],[25,39],[33,46]],
 'keep':[[],[],[37,44]],'temple':[[],[],[43,49]],
 'crypt':[[],[],[33,43]],'dungeon_sewer':[[],[],[35,38]],
}

def mapped(im,n,role):
    out=Image.new('RGB',im.size);cols=[colour(t) for t in PALETTES[n][role]];cuts=CUTS[n][role]
    arr=[]
    for r,g,b in im.get_flattened_data():
        L=light((r,g,b));q=cols[sum(L>cut for cut in cuts)]
        if n=='cave_crystal' and role==1 and b-g>38 and b-r>20:
            q=colour('violet-crystal:3' if L>35 else 'violet-crystal:2')
        if n=='cave_crystal' and role==2 and L<25:q=colour('violet-crystal:3')
        if n=='cave_lava' and role>0 and r>g*1.35 and r>b*1.3:
            q=colour(('embers:3' if L>30 else 'embers:2') if role==1 else ('embers:4' if L>35 else 'basalt:5'))
        if n=='yard' and role==2:
            if g>r*1.03 and g>b*1.25:q=colour('yard-grass:4' if L>49 else 'yard-grass:3')
            elif r>b*1.22 and r>g*1.05:q=colour('yard-path:4' if L>47 else 'yard-path:3')
        if n=='dungeon_sewer' and role==2 and g>r*.92 and g>b*1.12:q=colour('slime:3')
        arr.append(q)
    out.putdata(arr);return out

def fit(im,size):
    # Missing edge pixels continue the adjacent plane; this adds no new texture.
    w,h=size;out=Image.new('RGB',size);dx=(w-im.width)//2;dy=(h-im.height)//2
    for y in range(h):
        for x in range(w):out.putpixel((x,y),im.getpixel((max(0,min(im.width-1,x-dx)),max(0,min(im.height-1,y-dy)))))
    return out

def cave(n):
    src=Image.open(REVIEW/f'C21-read-{n}-{SELECT[n]}.png').convert('RGB')
    boxes=CROPS.get(n)
    if boxes is None:
        w,h=src.size;boxes=[(0,0,w,h//3),(0,h//3,w,2*h//3-1),(0,2*h//3+1,w,h)]
    pieces=[fit(mapped(src.crop(box),n,k),(144,40 if k==0 else 47 if k==1 else 48)) for k,box in enumerate(boxes)]
    if n=='cave_lava':
        # Close the source channel before the proof boundary; no drawn texture.
        px=pieces[2].load();hot=colour('embers:4');bank=colour('basalt:5')
        for y in range(48):
            for x in list(range(8))+list(range(136,144)):
                if px[x,y]==hot:px[x,y]=bank
    if n=='cave_rock':
        # Erase background blotches after tracing the two source stones and crack.
        # Kept material pixels are copied unchanged inside these cleanup masks.
        old=pieces[2];mask=Image.new('1',old.size);d=ImageDraw.Draw(mask)
        d.polygon([(3,14),(10,11),(14,7),(28,7),(28,10),(36,10),(36,13),(42,13),(42,18),(45,18),(45,25),(40,29),(34,32),(27,35),(17,34),(10,31),(3,26)],fill=1)
        d.polygon([(98,25),(104,22),(114,20),(124,20),(131,23),(135,29),(132,36),(125,40),(113,40),(104,36),(99,32)],fill=1)
        d.polygon([(54,17),(66,17),(66,21),(75,21),(75,26),(83,26),(83,29),(77,29),(71,26),(65,24),(62,21),(54,20)],fill=1)
        pieces[2]=Image.new('RGB',old.size,colour('grey-brown-rock:3'));pieces[2].paste(old,(0,0),mask)
    if n=='yard':
        # Operator-authorized native overworld material read, one pixel to one pixel.
        root=BASE.parents[2]/'dungeon/reference'
        grass=Image.open(root/'overworld-grass-0.png').convert('RGB').crop((48,96,96,144))
        grass.putdata([colour('yard-grass:4' if light(v)>47.8 else 'yard-grass:3') for v in grass.get_flattened_data()])
        street=Image.open(root/'overworld-street-0.png').convert('RGB').crop((64,72,112,120))
        street.putdata([colour('yard-cobble:3' if light(v)<40 else 'roof-slate:3' if light(v)<51 else 'yard-cobble:4') for v in street.get_flattened_data()])
        pieces[2].paste(grass,(0,0));pieces[2].paste(street,(96,0))
    return pieces

def built(n):
    src=Image.open(REVIEW/f'C21-read-{n}-floor.png').convert('RGB')
    w,h=src.size;floor=Image.new('RGB',(144,48))
    # Each separate slab is moved to the canonical cell. Interior pixels retain size.
    for k in range(3):
        part=src.crop((round(k*w/3)+2,2,round((k+1)*w/3)-3,min(46,h//3-3)))
        part=fit(mapped(part,n,2),(48,48));floor.paste(part,(48*k,0))
    joint=colour(PALETTES[n][2][0]);d=ImageDraw.Draw(floor)
    for x in (0,48,96):d.line((x,0,x,47),fill=joint)
    d.line((0,0,143,0),fill=joint)
    return floor

def run():
    report={}
    for n in CHANGED:
        wall=Image.open(REVIEW/f'C-layer-{n}-wall.png').convert('RGBA')
        if n in SELECT:
            top,face,floor=cave(n)
            edits=[clean_small(a) for a in (top,face,floor)]
            wall.paste(top,(0,8));wall.paste(face,(0,48))
            ImageDraw.Draw(wall).line((0,95,143,95),fill=c(S[n][1][0],1))
            top.save(REVIEW/f'C21-{n}-top.png');face.save(REVIEW/f'C21-{n}-face.png')
        else:
            floor=built(n);edits=[clean_small(floor)]
        floor.save(REVIEW/f'C21-{n}-floor.png');wall.save(REVIEW/f'C21-{n}-wall.png')
        backing=Image.new('RGBA',(144,144),Counter(floor.get_flattened_data()).most_common(1)[0][0]);backing.paste(floor,(0,96))
        prop=Image.open(REVIEW/f'C-layer-{n}-prop.png').convert('RGBA')
        proof=backing.copy();proof.paste(wall);proof.alpha_composite(prop,(86,96))
        proof.save(REVIEW/f'C21-{n}-proof.png')
        report[n]=dict(selected=SELECT.get(n,'new floor'),cleanup_counts=[len(e) for e in edits],cleanup=edits)
    (REVIEW/'C21-assembly.json').write_text(json.dumps(report,indent=2)+'\n')
if __name__=='__main__':run()
