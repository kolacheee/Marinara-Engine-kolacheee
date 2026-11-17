"""Literal native/nearest-neighbour review layouts, using saved artwork only."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, importlib.util

REV=Path(__file__).resolve().parent;ROOT=REV.parent;P='r16-Epolish-'
NN=Image.Resampling.NEAREST
NAMES=['clear-day','clear-night','cloudy','overcast','rain','heavy_rain','storm','snow','blizzard','fog','wind','hail','sandstorm','heat_wave']
LABELS=['Clear day','Clear night','Cloudy','Overcast','Rain','Heavy rain','Storm','Snow','Blizzard','Fog','Wind','Hail','Sandstorm','Heat wave']
LAYOUT=[]
FONT='/usr/share/fonts/dejavu-sans-fonts/DejaVuSans.ttf'
if not Path(FONT).exists():FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def font(n):
    return ImageFont.truetype(FONT,n) if Path(FONT).exists() else ImageFont.load_default(size=n)

def save(im,name):im.save(REV/(P+name+'.png'))

def image(name,before=False):
    # The comparison now starts at critic round 1; render delivered outputs.
    path=REV/(P+'critic1-before-icon-'+name+'.png') if before else ROOT/('out/weather16/icon-'+name+'.png')
    return Image.open(path).convert('RGBA')

def background(size,kind,ref='fantasy-grass'):
    raw=Image.open(ROOT/('reference/r16/ref-'+ref+'.png')).convert('RGBA')
    base=Image.new('RGBA',size)
    for y in range(0,size[1],raw.height):
        for x in range(0,size[0],raw.width):base.alpha_composite(raw,(x,y))
    color=(10,12,20,191) if kind=='dark' else (246,243,232,191)
    base.alpha_composite(Image.new('RGBA',size,color))
    return base

def paste(base,im,xy,scale=1):
    p=im.resize((im.width*scale,im.height*scale),NN)
    base.alpha_composite(p,xy)

def main():
    icons={n:image(n) for n in NAMES}
    for kind in ['dark','light']:
        row=background((456,40),kind)
        for i,n in enumerate(NAMES):paste(row,icons[n],(8+i*32,8))
        for scale in [1,2,4]:
            resized=row.convert('RGB').resize((456*scale,40*scale),NN)
            save(resized,'row-'+kind+'-'+str(scale)+'x')
            save(resized,'candidate-row-'+kind+'-'+str(scale)+'x')
        comp=Image.new('RGBA',(456,112),(48,53,62,255));d=ImageDraw.Draw(comp)
        d.text((8,2),'BEFORE',font=font(10),fill='white');d.text((8,58),'AFTER',font=font(10),fill='white')
        for j,old in enumerate([True,False]):
            r=background((456,40),kind)
            for i,n in enumerate(NAMES):paste(r,image(n,old),(8+i*32,8))
            comp.alpha_composite(r,(0,16+j*56))
        for scale in [1,2,4]:save(comp.convert('RGB').resize((456*scale,112*scale),NN),'before-after-'+kind+'-'+str(scale)+'x')
        # A badge uses the actual 48px icon plus a readable weather label.
        badges=Image.new('RGBA',(576,7*80+48),(48,53,62,255));d=ImageDraw.Draw(badges)
        d.text((16,10),kind.title()+' badges / 2x icons / 75% panels',font=font(16),fill='white')
        for i,(name,label) in enumerate(zip(NAMES,LABELS)):
            x=8+(i%2)*288;y=40+(i//2)*80
            card=background((272,68),kind,'fantasy-town');paste(card,icons[name],(8,10),2)
            dc=ImageDraw.Draw(card);dc.text((68,24),label,font=font(19),fill=(245,243,232) if kind=='dark' else (32,41,54))
            badges.alpha_composite(card,(x,y))
            LAYOUT.append({'sheet':'badges-'+kind,'icon':name,'xy':[x+8,y+10],'scale':2})
        save(badges.convert('RGB'),'badges-'+kind)
    overview=Image.new('RGBA',(7*152,2*290),(48,53,62,255));d=ImageDraw.Draw(overview)
    for i,n in enumerate(NAMES):
        x=i%7*152;y=i//7*290;d.text((x+7,y+7),n,font=font(12),fill='white')
        individual=Image.new('RGBA',(320,170),(48,53,62,255));di=ImageDraw.Draw(individual)
        di.text((8,8),'icon-'+n+'.png / 24x24 / 1x + 4x',font=font(12),fill='white')
        for j,kind in enumerate(['dark','light']):
            pane=background((144,116),kind);paste(pane,icons[n],(6,8));paste(pane,icons[n],(42,8),4)
            overview.alpha_composite(pane,(x+4,y+29+j*128));individual.alpha_composite(pane,(4+j*164,38))
            di.text((8+j*164,154),kind,font=font(11),fill='white')
            LAYOUT.append({'sheet':'file-icon-'+n,'icon':n,'xy':[10+j*164,46],'scale':1})
            LAYOUT.append({'sheet':'file-icon-'+n,'icon':n,'xy':[46+j*164,46],'scale':4})
        save(individual.convert('RGB'),'file-icon-'+n)
    save(overview.convert('RGB'),'overview')
    # The same two panel types over every provided map crop.
    for refpath in sorted((ROOT/'reference/r16').glob('ref-*.png')):
        ref=refpath.stem[4:];sheet=Image.new('RGBA',(456,112),(48,53,62,255));d=ImageDraw.Draw(sheet)
        for j,kind in enumerate(['dark','light']):
            d.text((8,j*56),ref+' / '+kind+' 75%',font=font(10),fill='white')
            row=background((456,40),kind,ref)
            for i,n in enumerate(NAMES):paste(row,icons[n],(8+i*32,8))
            sheet.alpha_composite(row,(0,16+j*56))
        for scale in [1,2,4]:save(sheet.convert('RGB').resize((456*scale,112*scale),NN),'context-'+ref+'-'+str(scale)+'x')
    html='<!doctype html><meta charset="utf-8"><title>Round 16 Epolish</title><style>body{background:#30353e;color:#f5f3df;font:16px sans-serif;padding:24px}img{display:block;image-rendering:pixelated;margin:16px 0;max-width:none}a{color:#c4e7f0}p{max-width:1000px}</style><h1>Round 16 — Part Epolish</h1><p>14 transparent 24x24 weather icons. Literal 1x, 2x and nearest-neighbour 4x proofs. Panels use 75% opacity over the supplied map crops. No ground bases or seasonal assets belong to this part.</p><p>'+', '.join(LABELS)+'</p>'
    for kind in ['dark','light']:
        html+='<h2>'+kind.title()+' panel</h2>'
        for scale in [1,2,4]:html+=f'<p>{scale}x</p><img src="{P}row-{kind}-{scale}x.png">'
        html+=f'<h2>{kind.title()} badges</h2><img src="{P}badges-{kind}.png"><h2>Before and after</h2><img src="{P}before-after-{kind}-2x.png">'
    html+=f'<h2>Every file at 1x and 4x</h2><img src="{P}overview.png"><h2>Critic round 1 redraw selections</h2><img src="{P}critic1-selection.png">'
    for ref in sorted((ROOT/'reference/r16').glob('ref-*.png')):html+=f'<h2>{ref.stem}</h2><img src="{P}context-{ref.stem[4:]}-1x.png">'
    html+='<p>Saved-art self-review. These are mock-ups, not screenshots of an in-engine test.</p>'
    (REV/(P+'review.html')).write_text(html+'\n')
    (REV/(P+'review-layout.json')).write_text(json.dumps(LAYOUT,indent=2)+'\n')
    print('Wrote rows, badges, all 14 individual proofs, before/after and 7 contexts.')

if __name__=='__main__':main()
