"""Review sheets from saved native artwork only. ImageDraw is used for labels."""
from pathlib import Path
import hashlib,importlib.util,json,re
from PIL import Image,ImageDraw,PngImagePlugin

ART=Path(__file__).resolve().parents[1];REV=ART/'review';OUT=ART/'out/city17';REF=ART/'reference/r17'
NN=Image.Resampling.NEAREST;BG=(64,70,64,255)
sp=importlib.util.spec_from_file_location('city17',OUT/'compose.py');city=importlib.util.module_from_spec(sp);sp.loader.exec_module(city)

def save(im,name,**meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items():info.add_text(k,json.dumps(v,sort_keys=True))
    im.save(REV/('r17-A-'+name+'.png'),pnginfo=info)

def scales(im,name,factors=(1,4),**meta):
    for s in factors:save(im.resize((im.width*s,im.height*s),NN),name+f'-{s}x',Scale=s,**meta)

def openim(p):return Image.open(p).convert('RGBA')

def repeat(a,n=3):
    im=Image.new('RGBA',(a.width*n,a.height*n))
    for y in range(n):
        for x in range(n):im.alpha_composite(a,(x*a.width,y*a.height))
    return im

def corner_reviews(house):
    """Show source-exact frontages and real composed corner floors at 1x/4x."""
    layouts=city.critic_layouts()['L-block']
    for lot in layouts['buildings']:
        if not lot['spec'].get('corner'):continue
        for colour in range(3):
            spec=json.loads(json.dumps(lot['spec']));spec['colour']=colour
            for upper in spec['storeys']:upper['colour']=colour
            building,parts=city.build(spec)
            for floor in range(1+len(spec['storeys'])):
                y=building.height-48*(floor+1);assembled=building.crop((0,y,building.width,y+48))
                sources=[p for p in parts if p['y']==y and p['layer'] in ('facade','corner')]
                source_width=sum(openim(ART/p['file']).width+12 for p in sources)
                pair=Image.new('RGBA',(source_width+assembled.width+house.width+40,house.height+32),BG)
                x=8;foot=pair.height-8
                for part in sources:
                    a=openim(ART/part['file']);pair.alpha_composite(a,(x,foot-a.height));x+=a.width+12
                pair.alpha_composite(assembled,(x+8,foot-48));x+=assembled.width+20
                pair.alpha_composite(house,(x,foot-house.height))
                label=f"{lot['id']} c{colour} floor{floor}: complete source panels / actual join / fantasy-house-2"
                sheet=Image.new('RGBA',(pair.width*4+16,pair.height*5+60),BG);d=ImageDraw.Draw(sheet)
                d.text((8,8),label+' / 1x then exact 4x',fill='white')
                sheet.alpha_composite(pair,(8,28));sheet.alpha_composite(pair.resize((pair.width*4,pair.height*4),NN),(8,pair.height+44))
                save(sheet,f'corner-assembly-{lot["id"]}-c{colour}-floor{floor}',
                     Spec=spec,Floor=floor,Parts=sources,PairSize=pair.size,Scales=[1,4],
                     Course='Only rows 0/47 use full-width drawn contact strips; rows 1..46 are complete source drawings.')
    scene,_=city.scene(layouts)
    before=openim(REV/'critic-r17A-3-L-block-1x.png')
    for lot in layouts['buildings']:
        if not lot['spec'].get('corner'):continue
        box=(lot['x'],lot['base']-48*(1+len(lot['spec']['storeys'])),
             lot['x']+lot['spec']['width']*48,lot['base'])
        old=before.crop(box);new=scene.crop(box)
        pair=Image.new('RGBA',(old.width+new.width+house.width+48,max(old.height,house.height)+32),BG)
        foot=pair.height-8;pair.alpha_composite(old,(8,foot-old.height));pair.alpha_composite(new,(old.width+24,foot-new.height));pair.alpha_composite(house,(old.width+new.width+40,foot-house.height))
        scales(pair,'corner-before-after-'+lot['id'],SceneBox=box,Order=['critic round3','repaired','fantasy-house-2'])

def reviews():
    house=openim(REF/'fantasy-house-2.png');files=sorted(OUT.glob('*.png'));index={};unique={}
    for p in files:
        a=openim(p);digest=hashlib.sha256(a.tobytes()).hexdigest();unique.setdefault(digest,[]).append(p.name)
        # Every export has a literal 1x pair and a literal 4x pair at a common foot.
        pairw=a.width+house.width+24;pairh=max(a.height,house.height)+8
        pair=city.grass((pairw,pairh)) if p.stem.startswith('sign-') else Image.new('RGBA',(pairw,pairh),BG)
        axy=(8,pairh-8-a.height);hxy=(a.width+16,pairh-8-house.height)
        pair.alpha_composite(a,axy);pair.alpha_composite(house,hxy)
        sheet=Image.new('RGBA',(pairw*5+36,pairh*4+50),BG);d=ImageDraw.Draw(sheet)
        d.text((8,8),p.name+' / 1x',fill='white');d.text((pairw+28,8),'4x nearest neighbour / fantasy-house-2 at matching scale',fill='white')
        sheet.alpha_composite(pair,(8,30));sheet.alpha_composite(pair.resize((pairw*4,pairh*4),NN),(pairw+28,30))
        save(sheet,'file-'+p.stem,File=p.name,PairOrigins=[[8,30],[pairw+28,30]],PairSize=pair.size,AssetOrigin=axy,HouseOrigin=hxy,Scales=[1,4])
        index[p.name]=dict(proof='r17-A-file-'+p.stem+'.png',size=a.size,pixels_sha256=digest,
                           alpha_values=sorted(set(a.getchannel('A').get_flattened_data())),colours=len(set(a.get_flattened_data())))
        if p.stem.startswith(('ground-','inn-front','corner-ground')):
            scales(repeat(a),'repeat-'+p.stem,Source='out/city17/'+p.name,Repeat=[3,3])
        # Exact native side-by-side self/colour/design seams for every file.
        base=re.sub(r'-c[0-2]$','',p.stem);partners=[p.name,p.name]
        for c in (1,2):
            q=OUT/(base+f'-c{c}.png');partners.append(q.name if q.exists() else p.name)
        below=[]
        for v in (0,1,2,0):
            q=re.sub(r'-v[12](?=-w)','',base)
            if q.startswith('ground-') and v:q=q.replace('-w',f'-v{v}-w')
            q=OUT/(q+'.png');below.append(q.name if q.exists() else p.name)
        seam=Image.new('RGBA',(a.width*4,a.height*2))
        for i,name in enumerate(partners+below):seam.alpha_composite(openim(OUT/name),((i%4)*a.width,(i//4)*a.height))
        scales(seam,'seam-'+p.stem,Files=partners+below,Cell=a.size)
    # Compact pages are for looking through every unique export at 1x/4x.
    names=[v[0] for v in unique.values()]
    for start in range(0,len(names),6):
        rows=names[start:start+6];sheet=Image.new('RGBA',(1040,215*len(rows)),BG);d=ImageDraw.Draw(sheet)
        for i,name in enumerate(rows):
            a=openim(OUT/name);y=i*215;d.text((8,y+4),name,fill='white')
            sheet.alpha_composite(a,(8,y+30));sheet.alpha_composite(a.resize((a.width*4,a.height*4),NN),(180,y+20));sheet.alpha_composite(house,(800,y+60))
        save(sheet,f'gallery-{start//6+1:02d}',Files=rows,Scales=[1,4],Reference='fantasy-house-2.png')
    # One calm 2-storey neighbour; existing roof is explicitly provisional.
    spec=city.make_spec(2,2,'shop',0,0,'hip',['timber']);a,parts=city.build(spec)
    box=a.getbbox();a=a.crop(box);pair=city.grass((a.width+house.width+40,max(a.height,house.height)+32));foot=pair.height-16
    pair.alpha_composite(a,(12,foot-a.height));pair.alpha_composite(house,(a.width+28,foot-house.height))
    scales(pair,'sample-neighbour',Spec=spec,Parts=parts,BuildingCrop=box,Placeholder='Round 15 roof; replace in B')
    # Baseline and colour-coherence view: only two wall colours and one roof colour.
    specs=[city.make_spec(w,f,g,v,c,r,k) for w,f,g,v,c,r,k in [
        (2,3,'shop',0,0,'hip',['timber','plaster']),(1,2,'door',1,1,'gable',['oriel']),
        (2,2,'arch',2,0,'ridge',['jetty']),(2,3,'work',0,1,'hip',['stone','timber']),
        (1,1,'inn',0,0,'gable',[])]]
    a,parts=city.street(specs);scales(a,'material-street',(1,3),Specs=specs,Parts=parts)
    # Signs over summer ground and in the inspected blank wall bay. Literal PNGs,
    # without names, form a native recognition strip beside the labelled key.
    signs=sorted(p for p in files if p.stem.startswith('sign-'));strip=city.grass((len(signs)*48,60))
    mounted=city.grass((4*160,2*100));d=ImageDraw.Draw(mounted);mounts=[]
    for i,p in enumerate(signs):
        sign=openim(p);strip.alpha_composite(sign,(i*48+8,10))
        s=city.make_spec(3,1);o=city.sign_mount(s,p.stem);host=city.asset(city.ground_name(s)).copy();host.alpha_composite(sign,(o['x'],o['y']))
        x,y=(i%4)*160,(i//4)*100;d.text((x+4,y+5),p.stem,fill='white');mounted.alpha_composite(host,(x+8,y+28));mounts.append(dict(file=p.name,host=city.ground_name(s),xy=[o['x'],o['y']],protected_goods=[45,0,112,48],protected_door=[112,0,144,48]))
    scales(strip,'trade-recognition');scales(mounted,'trade-mounts');(REV/'r17-A-mounts.json').write_text(json.dumps(mounts,indent=2)+'\n')
    # Door access proof: each example has an entirely clear native 48x48 approach.
    # The existing review person is a scale reference, never a newly drawn prop.
    entries=[('ground-door-w1',14),('ground-door-w2',23),('ground-work-v1-w3',20),
             ('ground-shop-w1',35),('ground-arch-w1',35),('inn-front-w2',39)]
    approach=city.grass((6*168,140));d=ImageDraw.Draw(approach);access=[]
    folk=openim(REV/'r15-M-clean-folk-b-0.png')
    for i,(name,doorx) in enumerate(entries):
        a=city.asset(name);x=i*168+8;d.text((x,3),name,fill='white');approach.alpha_composite(a,(x,24))
        approach.alpha_composite(folk,(x+doorx-folk.width//2,108-folk.height))
        access.append(dict(file=name+'.png',door_centre=doorx,facade_origin=[x,24],approach=[x+doorx-24,72,48,48],person_source='r15-M-clean-folk-b-0.png',person_base=108))
    scales(approach,'entrance-approaches',Entries=access)
    # A full corner stack and both side reveals retain the same course rows.
    specs=[city.make_spec(1,3,'door',i,i,'hip',corner=True) for i in range(3)]
    a,parts=city.street(specs);scales(a,'corner-stacks',Specs=specs,Parts=parts,Placeholder='Round15 roof / Part B')
    corner_reviews(house)
    # Both reveals on every width and colour; zero through four upper floors.
    for w in (1,2,3):
        specs=[city.make_spec(w,5,'door',c,c,'hip',list(city.STOREYS)) for c in range(3)]
        for s in specs:s['ends']=['left','right']
        a,parts=city.street(specs);scales(a,f'wall-ends-w{w}',Specs=specs,Parts=parts)
    # Terrain is context only. Facades are not terrain bases, but also have repeats.
    for key in ('street','square','town_ground'):
        a=city.context(key);scales(repeat(a),'repeat-context-'+key,Source='fantasy pack / '+key,Repeat=[3,3],Placeholder='Part C')
    a=openim(ART/'out/grass-base.png');scales(repeat(a),'repeat-context-grass',Source='out/grass-base.png',Repeat=[3,3])
    # All selected/rejected alternatives on comparison pages, preserving native pixels.
    manifest=json.loads((REV/'r17-A-generation.json').read_text());groups={}
    for r in manifest:groups.setdefault(r['output'],[]).append(r)
    alternate=[(k,v) for k,v in groups.items() if len(v)>1]
    for start in range(0,len(alternate),4):
        chunk=alternate[start:start+4]
        im=Image.new('RGBA',(600*max(len(recs) for _,recs in chunk),len(chunk)*250),BG);d=ImageDraw.Draw(im)
        for row,(name,recs) in enumerate(alternate[start:start+4]):
            for j,r in enumerate(recs):
                a=openim(REV/('r17-A-clean-'+r['id']+'.png'));x=j*600+8;y=row*250
                d.text((x,y+3),r['id']+(' / SELECTED' if r['selected'] else ' / retained alternative'),fill='white');im.alpha_composite(a,(x,y+23));im.alpha_composite(a.resize((a.width*3,a.height*3),NN),(x,y+85))
        save(im,f'selection-{start//4+1}')
    (REV/'r17-A-files.json').write_text(json.dumps(index,indent=2)+'\n')
    (REV/'r17-A-duplicates.json').write_text(json.dumps(list(unique.values()),indent=2)+'\n')
    # A local index keeps hundreds of exact per-export sheets navigable.
    html=['<!doctype html><meta charset="utf-8"><title>Round 17 Part A review</title>',
          '<style>body{background:#282d29;color:#eee;font:16px sans-serif;margin:24px}a{color:#edc88b}img{image-rendering:pixelated;max-width:100%}details{margin:12px}</style>',
          '<h1>Round 17 — Part A: critic-r17A-3 redraw</h1><p>Corner composition repaired with complete narrower facade drawings. All 240 passing PNG exports and COURSE.md are unchanged. Unsupported corner combinations are rejected; full-lot course rows 0/47 come from the retained drawn strips. Round 15 roofs and current fantasy context remain later-part placeholders. Independent reapproval is pending; no full-city pass is claimed.</p>',
          '<p><a href="r17-A-redraw3-audit.json">Corner repair audit</a> · <a href="r17-A-redraw3-verify.py">Regression and verification</a> · <a href="critic-r17A-3.json">Original critic</a></p>',
          '<p><a href="r17-A-validation.json">Audit</a> · <a href="r17-A-critic.json">Saved-art review</a> · <a href="../out/city17/COURSE.md">Course contract</a></p>']
    for name in ['sample-neighbour-1x','sample-neighbour-4x','trade-recognition-1x','trade-mounts-4x']+[f'critic-{s}-{suffix}' for s in ('L-block','market','height-test') for suffix in ('comparison-1x','comparison-3x','squint-1x')]:
        html.append(f'<details><summary>{name}</summary><a href="r17-A-{name}.png"><img src="r17-A-{name}.png"></a></details>')
    html.append('<h2>Repaired corner joins</h2><p>Before / repaired / fantasy-house-2, followed by all three colourways and every affected floor.</p>')
    for path in sorted(REV.glob('r17-A-corner-before-after-*.png'))+sorted(REV.glob('r17-A-corner-assembly-*.png')):
        html.append(f'<details><summary>{path.stem}</summary><a href="{path.name}"><img loading="lazy" src="{path.name}"></a></details>')
    html.append('<h2>Every export</h2>')
    for name,r in index.items():html.append(f'<details><summary>{name}</summary><a href="{r["proof"]}"><img loading="lazy" src="{r["proof"]}"></a> <a href="r17-A-seam-{Path(name).stem}-4x.png">Seams 4x</a></details>')
    (REV/'r17-A-review.html').write_text('\n'.join(html)+'\n')
    print(f'{len(files)} exports; {len(unique)} pixel-unique gallery entries; per-file, seam and repeat proofs saved.')

if __name__=='__main__':reviews()
