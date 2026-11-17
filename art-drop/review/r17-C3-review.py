"""C3 art review sheets; all marks are annotations, never production paint."""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
NN=Image.Resampling.NEAREST;BG=(40,43,37,255)

def save(a,name,factors=(1,4)):
    for z in factors:a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C3-{name}-{z}x.png')

def comparison(a,name):
    refs=[('TODAY / literal1x /24px displayed cells',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA'))]
    for z in (1,3):
        big=a.resize((a.width*z,a.height*z),NN);out=Image.new('RGBA',(big.width+max(a.width for _,a in refs)+48,max(big.height+40,sum(a.height+32 for _,a in refs)+16)),BG);d=ImageDraw.Draw(out)
        d.text((8,8),name+f' /{z}x',fill='white');out.alpha_composite(big,(8,28));y=8
        for title,ref in refs:d.text((big.width+28,y),title,fill='white');out.alpha_composite(ref,(big.width+28,y+20));y+=ref.height+32
        out.save(R/f'r17-C3-{name}-comparison-{z}x.png')

def pieces():
    names=list(json.loads((R/'r17-C3-files.json').read_text()))
    ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for n in names:
        a=c.asset(n);ground=c.asset_path_grass() if n in ('ditch-c3','planter-tree-c3','street-edge-c3') else c.asset('cobble-c3')
        out=c.repeat(ground,(max(a.width+32,192),a.height+48));d=ImageDraw.Draw(out);d.text((8,4),n,fill='black');out.alpha_composite(a,(16,32));save(out,'piece-'+n)
        # Every asset self-contact; architecture also meets an unlike donor.
        donor=next((c.asset(other) for other in names if other!=n and c.asset(other).size==a.size),a)
        seam=c.repeat(ground,(a.width*3,a.height+16))
        for j,p in enumerate([a,a,donor]):seam.alpha_composite(p,(j*a.width,0))
        save(seam,'seam-'+n)
    for page,start in enumerate(range(0,len(names),4)):
        group=names[start:start+4];h=max([c.asset(n).height for n in group]+[ref.height])+48
        out=Image.new('RGBA',(sum(max(200,c.asset(n).width+16) for n in group)+ref.width+24,h),BG);d=ImageDraw.Draw(out);x=8
        for n in group:a=c.asset(n);d.text((x,8),n,fill='white');out.alpha_composite(a,(x,h-16-a.height));x+=max(200,a.width+16)
        d.text((x,8),'house2 / reference',fill='white');out.alpha_composite(ref,(x,h-16-ref.height));save(out,'pieces-'+str(page))
    # Literal3x3 repeats for each new ground/ground overlay, plus retained mud.
    for n in ['cobble-c3','street-main-c3','street-side-c3','lane-c3','gate-paving-c3','ditch-c3','street-edge-c3','puddle-c3','mud-edge']:
        a=c.asset(n);ground=c.asset_path_grass() if n in ('ditch-c3','street-edge-c3','mud-edge') else c.asset('cobble-c3');out=c.repeat(ground,(a.width*3,a.height*3))
        for yy in range(3):
            for xx in range(3):out.alpha_composite(a,(xx*a.width,yy*a.height))
        save(out,'repeat-'+n)
    # Reused furniture is reviewed on the same new receiving ground.
    for n in ['barrel','crate','cart','washing-line','court-closure-r','yard-0','yard-1','bench-pocket']:
        a=c.asset(n);out=c.repeat(c.asset('cobble-c3'),(a.width+32,a.height+32));out.alpha_composite(a,(16,16));save(out,'retained-'+n)
    for family in ['cobble','hip','gate-paving']:
        prefix='r17-C3-critic1-' if family=='hip' else 'r17-C3-'
        a=Image.open(R/f'{prefix}clean-{family}-a.png').convert('RGBA');b=Image.open(R/f'{prefix}clean-{family}-b.png').convert('RGBA');out=Image.new('RGBA',(a.width+b.width+48,max(a.height,b.height)+48),BG);d=ImageDraw.Draw(out)
        out.alpha_composite(a,(8,32));out.alpha_composite(b,(a.width+32,32));d.text((8,8),'A / selected' if family=='hip' else 'A / rejected',fill='white');d.text((a.width+32,8),'B / rejected' if family=='hip' else 'B / selected',fill='white');save(out,'selection-'+family)

def scenes():
    city=Image.open(R/'r17-city-final.png').convert('RGBA')
    crops={'square':(432,576,1392,1152),'street':(96,240,720,816),'gate-inn':(1104,720,1776,1440),'corner-court':(144,672,480,1056),'bent-east':(1200,240,1776,768)}
    for n,box in crops.items():a=city.crop(box);save(a,n,(1,3));comparison(a,n);save(a.convert('L').convert('RGBA'),n+'-squint',(1,))
    for n,l in c.e_layouts().items():
        a,_=c.c_render(l);save(a,'regression-'+n,(1,3));comparison(a,'regression-'+n)
    ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for j,n in enumerate(['baker','smith','apothecary','cloth','potter']):
        spec=c.c3_front(2,2,j,'roof-gable-w2-c0');spec['ground_file']='ground-'+n+'-c3-w2';a,_=c.build(spec)
        out=c.repeat(c.asset('cobble-c3'),(a.width+ref.width+48,max(a.height,ref.height)+32));out.alpha_composite(a,(8,out.height-16-a.height));out.alpha_composite(ref,(a.width+32,out.height-16-ref.height));save(out,'complete-house-'+n)
    # Complete corner/side/back/passage proofs, with the retained relit drawings.
    specs=[('corner',dict(view='complete',file='corner-house-r-w2')),('west side',dict(view='side',depth=2,width=2,floors=2,direction='W')),('east side',dict(view='side',depth=2,width=2,floors=2,direction='E')),('rear',dict(view='back',width=2,floors=2,back='plain')),('passage',c.make_spec(2,2,'arch',0,0,'ridge',['timber']))]
    out=c.repeat(c.asset('cobble-c3'),(720,312));d=ImageDraw.Draw(out)
    for i,(n,spec) in enumerate(specs):a,_=c.build_c(spec);out.alpha_composite(a,(i*144,264-a.height));d.text((i*144+4,282),n,fill='black')
    save(out,'corner-and-access-types')
    save(Image.open(R/'r17-R-seven-cell-roof-volumes-1x.png').convert('RGBA'),'retained-seven-cell-roof-volumes')

def annotations():
    l=c.c3_city_layout();plain=Image.open(R/'r17-city-final.png').convert('RGBA');out=plain.copy();d=ImageDraw.Draw(out)
    for b in l['lots']:
        x,y,w,h=b['footprint'];d.rectangle((x,y,x+w-1,y+h-1),outline=(65,222,221,255));d.text((x+2,b['base']-12),str(b['spec'].get('floors',len(b['spec'].get('storeys',[]))+1)),fill='white')
        if b.get('entrance'):x,y=b['entrance'];d.rectangle((x-12,y,x+11,y+31),outline=(255,225,60,255))
    for b in l['block_shapes']:d.line([tuple(p) for p in b['polygon']]+[tuple(b['polygon'][0])],fill=(255,133,190,255),width=2)
    for r in l['roads']:
        if r.get('id') in ('gate-to-square','north-through-alley','square-through-alley'):
            x,y,w,h=r['rect'];d.rectangle((x,y,x+w-1,y+h-1),outline=(230,230,255,255))
    for p in l['props']:
        for x,y,w,h in p.get('supports',[]):d.rectangle((x,y,x+w-1,y+h-1),outline=(240,80,70,255))
        if p.get('entrance'):
            x,y=p['entrance'];d.rectangle((x-24,y,x+23,y+47),outline=(255,225,60,255))
    d.text((150,245),'CYAN footprints / numbers storeys | YELLOW approaches | PINK block edges | WHITE clear routes | RED supports',fill='black');save(out,'city-anchors',(1,))
    revealed,_,_=c.r_render(l,reveal=True)
    for n,box in [('gate',(1104,1008,1392,1440)),('market',(912,744,1104,1008)),('north-service',(864,224,1104,432)),('west-main',(144,576,720,816)),('east-main',(1200,576,1776,864)),('west-court',(240,864,384,1056))]:
        a=plain.crop(box);b=revealed.crop(box);pair=Image.new('RGBA',(a.width*2+16,a.height+24),BG);pair.alpha_composite(a,(0,24));pair.alpha_composite(b,(a.width+16,24));d=ImageDraw.Draw(pair);d.text((4,4),'NORMAL',fill='white');d.text((a.width+20,4),'REVEAL / supports retained',fill='white');save(pair,n+'-reveal',(1,3))
    # The retained art-only roof/arch/canopy proof uses the same native actor.
    existing=Image.open(R/'r17-R-human-access-reveal-1x.png').convert('RGBA');save(existing,'human-access-reveal',(1,3))

def index():
    names=sorted(p.name for p in R.glob('r17-C3-*.png') if not any(t in p.name for t in ('source-','registered-','mode-','clean-','detail-','initial-selection')))
    html='<!doctype html><meta charset="utf-8"><title>Round17 C3 review</title><style>body{background:#272b25;color:#ddd;font:16px sans-serif}a{color:#bcdcbc}img{max-width:100%;image-rendering:pixelated}</style><h1>Round17 C3</h1><p>Native48px grid. Saved-art review. Exact nearest-neighbour enlargements.</p><p><a href="r17-city-final.png">Final1x</a> · <a href="r17-city-final-2x.png">Final2x</a> · <a href="r17-city-final-squint.png">Greyscale</a> · <a href="r17-city-final-vs-r15-vs-today.png">Three-way comparison</a></p><img src="r17-city-final.png"><ul>'
    html+=''.join(f'<li><a href="{n}">{n}</a></li>' for n in names)+'</ul>'
    (R/'r17-C3-review.html').write_text(html)

if __name__=='__main__':pieces();scenes();annotations();index();print('C3 review sheets complete')
