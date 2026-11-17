"""Native compositor regression proofs; labels and saved-paint composites only."""
from pathlib import Path
import importlib.util,json
from PIL import Image,ImageDraw
REV=Path(__file__).resolve().parent;ART=REV.parent;OUT=ART/'out/city17'
s=importlib.util.spec_from_file_location('city',OUT/'compose.py')
city=importlib.util.module_from_spec(s);s.loader.exec_module(city)
NN=Image.Resampling.NEAREST
BG=(64,70,64,255)

def run():
    house=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for colour in range(3):
        for width in (1,2,3):
            parts=[]
            for depth in (2,3,4,5):
                spec=city.make_spec(width,1,'door',0,0,'ridge')
                spec.update(roof_depth=depth,roof_colour=colour)
                parts.append(city.build(spec)[0])
            sheet=Image.new('RGBA',(sum(a.width+12 for a in parts)+160,340),BG)
            d=ImageDraw.Draw(sheet);x=0
            for depth,a in zip((2,3,4,5),parts):
                d.text((x+2,4),f'{depth} cells',fill='white')
                sheet.alpha_composite(a,(x,328-a.height));x+=a.width+12
            sheet.alpha_composite(house,(x,328-house.height))
            city.scales(sheet,f'critic2-deep-w{width}-c{colour}',(1,4))
        join=city.joined_l_roof(colour)
        city.scales(join,f'critic2-L-join-c{colour}',(1,4))
        city.save(join.convert('L').convert('RGBA'),f'critic2-L-join-c{colour}-squint-1x')
    # Explicitly exercise all narrow arrangements that previously raised.
    cases={'narrow-pair':[(48,1,5),(96,1,1),(240,1,1),(288,1,5)],
           'narrow-between':[(48,1,1),(96,2,5),(192,1,1)]}
    layouts={}
    for name,lots in cases.items():
        layout=dict(size=[432,480],terrain={'street':[[0,9,9,1]]},buildings=[],objects=[])
        for i,(x,w,f) in enumerate(lots):
            spec=city.make_spec(w,f,'door',0,0,'hip',['stone','plaster','jetty','timber'])
            layout['buildings'].append(dict(id=name+str(i),x=x,base=432,spec=spec))
        layouts[name]=layout
        im,records=city.scene(layout)
        city.scales(im,'critic2-'+name,(1,3),Placements=records)
        city.save(im.convert('L').convert('RGBA'),'critic2-'+name+'-squint-1x')
    (REV/'r17-B-critic2-narrow-layouts.json').write_text(json.dumps(layouts,indent=2)+'\n')
    # Preserve literal 3x regions; large comparison canvases may shrink in viewers.
    sections={'L-block':[(0,0,384,192),(384,0,768,192),(0,240,336,576),(336,240,768,576)],
              'market':[(0,0,432,288),(432,0,864,288),(0,288,432,576),(432,288,864,576),(0,576,432,864),(432,576,864,864)],
              'height-test':[(0,0,336,480),(336,0,672,480)]}
    for name,boxes in sections.items():
        a=Image.open(REV/f'r17-B-critic-{name}-3x.png')
        for i,box in enumerate(boxes):
            city.save(a.crop(tuple(v*3 for v in box)),f'critic2-section-{name}-{i+1}-3x')
    height=Image.open(REV/'r17-B-critic-height-test-1x.png')
    for side,box in [('west',(136,270,200,310)),('east',(424,270,488,310))]:
        a=height.crop(box);city.scales(a,'critic2-firewall-shadow-'+side,(1,8))
    for name,box in [('dormer',(100,432,140,468)),('chimney',(196,388,224,432))]:
        a=Image.open(REV/'r17-B-critic-L-block-1x.png').crop(box)
        city.scales(a,'critic2-final-'+name,(1,8))
    print('Saved 27 deeper-roof cases, both narrow joins, directional squints and exact scene crops.')

if __name__=='__main__':run()
