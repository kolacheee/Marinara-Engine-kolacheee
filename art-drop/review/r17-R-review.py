"""Native R review sheets. ImageDraw is confined to labels and annotations."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
from collections import Counter
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17';NN=Image.Resampling.NEAREST
sp=importlib.util.spec_from_file_location('city',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
BG=(37,41,35,255)

def save(a,name,scales=(1,4)):
    for z in scales:a.resize((a.width*z,a.height*z),NN).save(R/f'r17-R-{name}-{z}x.png')

def comparison(a,name,scales=(1,3)):
    refs=[('Current town / literal1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('Round15 / literal1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA'))]
    for z in scales:
        b=a.resize((a.width*z,a.height*z),NN);w=max(r.width for _,r in refs)
        out=Image.new('RGBA',(b.width+w+48,max(b.height+40,sum(r.height+32 for _,r in refs)+16)),BG);d=ImageDraw.Draw(out)
        d.text((8,8),f'{name} / {z}x nearest-neighbour',fill='white');out.alpha_composite(b,(8,28));y=8
        for title,r in refs:d.text((b.width+28,y),title,fill='white');out.alpha_composite(r,(b.width+28,y+20));y+=r.height+32
        out.save(R/f'r17-R-{name}-comparison-{z}x.png')

def exports():
    files=json.loads((R/'r17-R-files.json').read_text());contact=[]
    ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for name in files:
        a=c.asset(name);mount=c.repeat(c.asset_path_grass() if name=='bench-pocket' else c.asset('cobble-small'),(a.width+16,max(a.height,ref.height)+32))
        mount.alpha_composite(a,(8,mount.height-16-a.height));save(mount,'piece-'+name)
        contact.append((name,a))
        unlike=next((c.asset(n) for n in files if n!=name and c.asset(n).size==a.size),a)
        seam=c.repeat(c.asset('cobble-small'),(a.width*3,a.height+16));seam.alpha_composite(a,(0,0));seam.alpha_composite(a,(a.width,0));seam.alpha_composite(unlike,(a.width*2,0));save(seam,'seam-'+name)
    # Inspect packed native pieces beside the existing house; enlarged pages
    # preserve literal nearest-neighbour pixels and do not resample artwork.
    for page,start in enumerate(range(0,len(contact),4)):
        group=contact[start:start+4];w=sum(max(192,a.width+24) for _,a in group)+ref.width+24;h=max([a.height for _,a in group]+[ref.height])+50
        sheet=Image.new('RGBA',(w,h),BG);d=ImageDraw.Draw(sheet);x=8
        for name,a in group:d.text((x,8),name,fill='white');sheet.alpha_composite(a,(x,h-12-a.height));x+=max(192,a.width+24)
        d.text((x,8),'house2 / reference',fill='white');sheet.alpha_composite(ref,(x,h-12-ref.height));save(sheet,'pieces-'+str(page))
    # No new ground base belongs to R. Every ground actually used is still
    # shown as a literal3x3, including the24px lane and mud overlay.
    for name in ['cobble-large','cobble-small','street-main','street-side','lane','mud-edge']:
        a=c.asset(name);base=c.repeat(c.asset_path_grass() if name=='mud-edge' else c.asset('cobble-small'),(a.width*3,a.height*3))
        for y in range(3):
            for x in range(3):base.alpha_composite(a,(x*a.width,y*a.height))
        save(base,'repeat-'+name)


def assemblies():
    house=c.make_spec(2,2,'work',0,0,'gable',['jetty'],True)
    a,_=c.build(house);ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    sheet=c.repeat(c.asset('cobble-small'),(a.width+ref.width+48,max(a.height,ref.height)+32));sheet.alpha_composite(a,(8,sheet.height-16-a.height));sheet.alpha_composite(ref,(a.width+32,sheet.height-16-ref.height));save(sheet,'complete-corner-house')
    # Native7-cell module comparison. The3-cell hip is a seam demonstration;
    # live lots keep BRIEF17's1/2-cell limit.
    specs=[c.make_spec(2,3,'shop',0,0,'gable',['timber']),c.make_spec(3,2,'work',1,1,'hip',['plaster']),c.make_spec(2,3,'door',1,0,'ridge',['stone'])]
    specs[2]['roof_file']='roof-back-dormer-w2'
    lots=[dict(id='gable',x=0,base=336,spec=specs[0]),dict(id='lower-hip',x=96,base=336,spec=specs[1]),dict(id='rear-wing',x=240,base=336,spec=specs[2])]
    for b in lots:b['spec']['district']='R seam study'
    lots=c.neighbours(lots);im=c.repeat(c.asset('cobble-small'),(336,384))
    for b in lots:a,_=c.build(b['spec']);im.alpha_composite(a,(b['x'],336-a.height))
    save(im,'seven-cell-roof-volumes');comparison(im,'seven-cell-roof-volumes')
    # Both separately lit side entrances, service closure, and open passage.
    cases=[('side W',dict(view='side',depth=2,width=2,floors=2,direction='W')),('side E',dict(view='side',depth=2,width=2,floors=2,direction='E')),('rear service',dict(view='back',width=2,floors=2,back='plain')),('passage',c.make_spec(2,2,'arch',0,0,'ridge',['timber']))]
    im=c.repeat(c.asset('cobble-small'),(576,310));d=ImageDraw.Draw(im)
    for i,(name,s) in enumerate(cases):a,_=c.build_c(s);im.alpha_composite(a,(i*144,260-a.height));d.text((i*144+4,280),name,fill='black')
    save(im,'three-access-types')
    # Distinct trade frontage arrangements with their matching sign-bearing
    # upper floors. Large boards do not mask the recessed window or doorway.
    im=c.repeat(c.asset('cobble-small'),(432,342));d=ImageDraw.Draw(im)
    for i,trade in enumerate(['baker','smith','apothecary']):
        a,_=c.build(c.r_front(2,3,i,trade=trade));im.alpha_composite(a,(i*144+12,300-a.height));d.text((i*144+12,316),trade,fill='black')
    save(im,'three-trade-elevations')


def scenes():
    audits={}
    layouts=c.e_layouts()
    for district in c.E_DISTRICTS:layouts['district-'+district]=c.e_district_layout(district)
    for name,l in layouts.items():
        a,_=c.c_render(l);save(a,name,(1,3));comparison(a,name);save(a.convert('L').convert('RGBA'),name+'-squint',(1,))
        audits[name]=c.r_repeat_audit(l)
    (R/'r17-R-regression-layout-audit.json').write_text(json.dumps(audits,indent=2))
    a=Image.open(R/'r17-city-final.png').convert('RGBA')
    for name,box in [('populated-square',(432,576,1392,1152)),('corner-court',(144,672,480,1056)),('north-joined-roofs',(480,240,1200,576)),('gate-route',(1104,1008,1392,1440))]:
        crop=a.crop(box);save(crop,name,(1,3));comparison(crop,name);save(crop.convert('L').convert('RGBA'),name+'-squint',(1,))


def access_proof():
    # Literal art-state pair. Foreground masks are omitted in the reveal;
    # the standing actor and paving are the same native pixels in both.
    actor=Image.open(R/'r15-M-clean-folk-b-0.png').convert('RGBA')
    panels=[];annotations=[]
    # Roof: use an existing two-cell building; put the actor in its northern
    # ground-space projection. This is an art proof, not runtime code.
    s=c.make_spec(2,2,'arch',0,0,'gable',['timber']);building,parts=c.build(s)
    for case in ['behind roof','under arch','behind canopy']:
        normal=c.repeat(c.asset('cobble-small'),(192,272));reveal=normal.copy()
        if case=='behind roof':
            xy=(84,66);normal.alpha_composite(actor,xy);reveal.alpha_composite(actor,xy)
            normal.alpha_composite(building,(48,32));exposed=building.copy();exposed.paste((0,0,0,0),(0,0,96,96));reveal.alpha_composite(exposed,(48,32));boxes=[('footprint',(48,128,144,224)),('roof mask',(48,32,144,128)),('standing',(80,64,104,96))]
        elif case=='under arch':
            normal.alpha_composite(building,(48,32));reveal.alpha_composite(building,(48,32));xy=(119,184)
            # The drawn far exit and paving remain visible around the actor.
            normal.alpha_composite(actor,xy);reveal.alpha_composite(actor,xy);boxes=[('entrance',(112,224,136,256)),('passage',(111,185,139,224)),('base',(48,224,144,225))]
        else:
            stall=c.asset('stall-0');xy=(84,176);normal.alpha_composite(actor,xy);reveal.alpha_composite(actor,xy);normal.alpha_composite(stall,(72,176))
            # Canopy is a documented upper painted band; retain posts/counter.
            lower=stall.copy();lower.paste((0,0,0,0),(0,0,48,26));reveal.alpha_composite(lower,(72,176));boxes=[('canopy mask',(74,178,118,202)),('left post',(75,202,78,224)),('right post',(114,202,117,224)),('vendor',(80,176,104,208))]
        annotated=reveal.copy();d=ImageDraw.Draw(annotated)
        for label,box in boxes:d.rectangle(box,outline=(255,221,81,255),width=1)
        d.text((8,246),case,fill='black');panels.extend([normal,reveal,annotated]);annotations.append(dict(case=case,actor=[*xy,*actor.size],rects=[dict(label=t,box=b) for t,b in boxes]))
    sheet=Image.new('RGBA',(192*3,272*3+32),BG);d=ImageDraw.Draw(sheet)
    for i,a in enumerate(panels):sheet.alpha_composite(a,((i%3)*192,32+(i//3)*272))
    for i,t in enumerate(['normal','reveal / same actor','footprint, supports, mask']):d.text((i*192+8,8),t,fill='white')
    save(sheet,'human-access-reveal',(1,3))
    (R/'r17-R-foreground-masks.json').write_text(json.dumps(annotations,indent=2))
    # Full-city annotation uses exactly the metadata consumed by composition.
    city=Image.open(R/'r17-city-final.png').convert('RGBA');l=c.r_city_layout();d=ImageDraw.Draw(city)
    for b in l['lots']:
        x,y,w,h=b['footprint'];d.rectangle((x,y,x+w-1,y+h-1),outline=(93,197,211,255));d.line((x,b['base']-3,x,b['base']+3),fill=(255,235,100,255))
        if b.get('entrance'):
            x,y=b['entrance'];d.rectangle((x-12,y,x+11,y+31),outline=(255,235,100,255))
    for p in l['props']:
        for rect in [p['footprint']] if p.get('footprint') else []:
            x,y,w,h=rect;d.rectangle((x,y,x+w-1,y+h-1),outline=(93,197,211,255))
        if p.get('entrance'):
            ex,ey=p['entrance'];ew=48 if p.get('id') in ('cathedral','guildhall') else 24;eh=48 if ew==48 else 32;d.rectangle((ex-ew//2,ey,ex+ew//2-1,ey+eh-1),outline=(255,235,100,255))
        for x,y,w,h in p.get('supports',[]):d.rectangle((x,y,x+w-1,y+h-1),outline=(236,110,100,255))
        if p.get('foreground_mask'):
            a=c.r_prop_image(p);x,y=p['x'],p['base']-a.height;l0,t,r,b=p['foreground_mask'];d.rectangle((x+l0,y+t,x+r-1,y+b-1),outline=(255,235,100,255))
    d.rectangle((720,672,1199,1055),outline='white');d.rectangle((1104,672,1199,767),outline=(220,91,91,255))
    d.text((104,250),'CYAN footprint | YELLOW base /24x32 standing | WHITE10x8 square | RED2x2 notch',fill='black');city.save(R/'r17-R-city-anchors-1x.png')
    plain=Image.open(R/'r17-city-final.png').convert('RGBA');revealed,_,_=c.r_render(l,reveal=True)
    for name,box in [('gate',(1104,1008,1392,1440)),('market',(912,744,1104,1008))]:
        a=plain.crop(box);b=revealed.crop(box);pair=Image.new('RGBA',(a.width*2+16,a.height+24),BG);pair.alpha_composite(a,(0,24));pair.alpha_composite(b,(a.width+16,24));d=ImageDraw.Draw(pair);d.text((4,4),'normal',fill='white');d.text((a.width+20,4),'overhead reveal; supports retained',fill='white');save(pair,name+'-scene-reveal',(1,3))


def index():
    files=sorted(p.name for p in R.glob('r17-R-*.png') if 'registered' not in p.name and 'source' not in p.name and 'mode-' not in p.name)
    html='<!doctype html><meta charset="utf-8"><title>Round17 PartR review</title><style>body{background:#232722;color:#ddd;font:16px sans-serif}img{image-rendering:pixelated;max-width:100%}a{color:#b6d9b5}</style><h1>Round17 · PartR</h1><p>Native48px grid. Exact nearest-neighbour enlargements. Saved-art review.</p><p><a href="r17-city-final.png">City1x</a> · <a href="r17-city-final-2x.png">City2x</a> · <a href="r17-city-final-vs-r15-vs-today.png">Three-way1x comparison</a></p><img src="r17-city-final.png"><ul>'
    html+=''.join(f'<li><a href="{f}">{f}</a></li>' for f in files)+'</ul>'
    (R/'r17-R-review.html').write_text(html)

if __name__=='__main__':
    exports();assemblies();scenes();access_proof();index();print('Saved R native/enlarged exports, repeats, seams, populated comparisons and access/mask proofs.')
