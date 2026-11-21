"""Current C review sheets. Pixel repetition and squints are review-only."""
import json
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,S
from redraw_critic22 import CHANGED,STUDIES

def master_reference(station=False):
    box=(1748,884,2036,1172) if station else (580,0,868,288)
    crop=Image.open(BASE.parents[2]/'dungeon/reference/master-interiors-mock.png').convert('RGB').crop(box)
    im=Image.new('RGB',(144,144))
    for y in range(144):
        for x in range(144):
            value=crop.getpixel((2*x,2*y))
            assert all(crop.getpixel((2*x+dx,2*y+dy))==value for dx,dy in [(1,0),(0,1),(1,1)])
            im.putpixel((x,y),value)
    return im,box

def run():
    for n in S:
        im=Image.open(BASE/f'proof/{n}.png');g=Image.open(BASE/f'proof/{n}-grey.png')
        master,_=master_reference(n.startswith('station_'))
        s=Image.new('RGB',(1048,800),'#222630');d=ImageDraw.Draw(s)
        d.text((8,8),n+' / 3x colour + grey; 1x right; 2x below; master at equal art-pixel scale',fill='white')
        for pic,xy,scale in [(im,(8,28),3),(g,(448,28),3),(im,(896,28),1),(g,(896,192),1),(im,(8,496),2),(g,(304,496),2),(master,(600,496),2),(master,(896,496),1)]:
            s.paste(pic.resize((144*scale,144*scale),Image.Resampling.NEAREST),xy)
        s.paste(g.resize((36,36),Image.Resampling.NEAREST),(896,360))
        s.save(REVIEW/f'C22-final-{n}.png')
        s=Image.new('RGB',(608,328),'#222630');d=ImageDraw.Draw(s)
        d.text((8,8),n+' / art 2x; master PNG 1x (equal art-pixel scale)',fill='white')
        s.paste(im.resize((288,288),Image.Resampling.NEAREST),(8,32));s.paste(master.resize((288,288),Image.Resampling.NEAREST),(312,32));s.save(REVIEW/f'C-op2-{n}.png')
    # Every swatch and the five replacement guide inserts, with exact scale views.
    paths=sorted((BASE/'canon/swatches').glob('*.png'))
    for page in range(2):
        s=Image.new('RGB',(1040,800),'#222630');d=ImageDraw.Draw(s)
        for i,p in enumerate(paths[page*7:page*7+7]):
            im=Image.open(p);x=i%3*344;y=i//3*260;d.text((x+4,y+4),p.stem,fill='white')
            for scale,offset in [(1,4),(2,60),(3,168)]:s.paste(im.resize((48*scale,48*scale),Image.Resampling.NEAREST),(x+offset,y+24))
            s.paste(im.convert('L'),(x+4,y+180));s.paste(im.convert('L').resize((12,12),Image.Resampling.NEAREST),(x+64,y+180))
        s.save(REVIEW/f'C-canon-swatches-{page+1}.png')
    guide=Image.open(BASE/'canon/style-guide.png')
    for name,bounds in json.loads((REVIEW/'B-guide-sections.json').read_text()):
        pic=guide.crop(bounds)
        for scale in (1,2,3):pic.resize((pic.width*scale,pic.height*scale),Image.Resampling.NEAREST).save(REVIEW/f'C-guide-{name}-{scale}x.png')
        pic.convert('L').save(REVIEW/f'C-guide-{name}-grey.png');pic.convert('L').resize((pic.width//4,pic.height//4),Image.Resampling.NEAREST).save(REVIEW/f'C-guide-{name}-squint.png')
    for scale in (1,2):
        Image.open(REVIEW/f'C-operator-contact-{scale}x.png').save(REVIEW/f'C-contact-{scale}x.png')
        Image.open(REVIEW/f'C-operator-contact-{scale}x-grey.png').save(REVIEW/f'C-contact-grey-{scale}x.png')
    # Reference yard crops keep their original native pixels; no read-back scaling.
    ref=BASE.parents[2]/'dungeon/reference'
    s=Image.new('RGB',(736,416),'#222630');d=ImageDraw.Draw(s)
    for i,(name,bounds) in enumerate([('grass',(48,96,96,144)),('path_joined',(48,72,96,120)),('street',(64,72,112,120))]):
        im=Image.open(ref/f'overworld-{name}-0.png').crop(bounds);x=8+i*240
        d.text((x,8),name+' / native crop 1x + 3x',fill='white');s.paste(im,(x,32));s.paste(im.resize((144,144),Image.Resampling.NEAREST),(x,96))
    floor=Image.open(REVIEW/'C-layer-yard-floor.png').crop((0,96,144,144))
    s.paste(floor.resize((432,144),Image.Resampling.NEAREST),(8,264));s.save(REVIEW/'C-yard-sources.png')

if __name__=='__main__':run()
