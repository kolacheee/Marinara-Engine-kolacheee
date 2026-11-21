"""Review-only zooms, exact greyscale and nearest-neighbour squints."""
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,S
from finish_c21 import STUDIES
import json

def run():
    for page in range(4):
        names=list(S)[page*4:page*4+4]
        for grey in (False,True):
            sh=Image.new('RGB',(912,944),'#222630');d=ImageDraw.Draw(sh)
            for j,n in enumerate(names):
                im=Image.open(BASE/f'proof/{n}{"-grey" if grey else ""}.png');x=8+j%2*456;y=24+j//2*464
                d.text((x,y-18),n,fill='white');sh.paste(im.resize((432,432),Image.Resampling.NEAREST),(x,y))
            sh.save(REVIEW/f'C21-all-3x-{page}{"-grey" if grey else ""}.png')
        sh=Image.new('RGB',(880,352),'#222630');d=ImageDraw.Draw(sh)
        for j,n in enumerate(names):
            x=4+j%2*440;y=20+j//2*176;d.text((x,y-16),n,fill='white');sh.paste(Image.open(REVIEW/f'proof-3x3repeat-{n}.png'),(x,y))
        sh.save(REVIEW/f'C21-repeat-{page}.png')
    sh=Image.new('RGB',(1040,540),'#222630');d=ImageDraw.Draw(sh)
    for j,n in enumerate(STUDIES):
        im=Image.open(BASE/f'canon/swatches/{n}.png');x=j%3*344;y=j//3*260;d.text((x+4,y+4),n,fill='white')
        for scale,off in [(1,4),(2,60),(3,168)]:sh.paste(im.resize((48*scale,48*scale),Image.Resampling.NEAREST),(x+off,y+24))
        sh.paste(im.convert('L'),(x+4,y+180));sh.paste(im.convert('L').resize((12,12),Image.Resampling.NEAREST),(x+64,y+180))
    sh.save(REVIEW/'C21-studies.png')
    guide=Image.open(BASE/'canon/style-guide.png')
    for name,bounds in json.loads((REVIEW/'B-guide-sections.json').read_text()):
        if name!='materials':continue
        pic=guide.crop(bounds)
        for scale in (1,2,3):pic.resize((pic.width*scale,pic.height*scale),Image.Resampling.NEAREST).save(REVIEW/f'C-guide-{name}-{scale}x.png')
        pic.convert('L').save(REVIEW/f'C-guide-{name}-grey.png');pic.convert('L').resize((pic.width//4,pic.height//4),Image.Resampling.NEAREST).save(REVIEW/f'C-guide-{name}-squint.png')
    # Current generic contact sheets must not retain older drawings.
    for scale in (1,2):
        Image.open(REVIEW/f'C-operator-contact-{scale}x.png').save(REVIEW/f'C-contact-{scale}x.png')
        Image.open(REVIEW/f'C-operator-contact-{scale}x-grey.png').save(REVIEW/f'C-contact-grey-{scale}x.png')
if __name__=='__main__':run()
