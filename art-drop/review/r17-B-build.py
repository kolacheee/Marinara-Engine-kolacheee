"""Review only: composite saved drawings; ImageDraw is used solely for labels."""
from pathlib import Path
import hashlib, importlib.util, json, re
from PIL import Image, ImageDraw
ART=Path(__file__).resolve().parents[1];REV=ART/'review';OUT=ART/'out/city17';REF=ART/'reference/r17'
NN=Image.Resampling.NEAREST;BG=(64,70,64,255)
sp=importlib.util.spec_from_file_location('city17',OUT/'compose.py');city=importlib.util.module_from_spec(sp);sp.loader.exec_module(city)

def image(path):return Image.open(path).convert('RGBA')
def save(a,name,**meta):city.save(a,name,**meta)
def scales(a,name,ss=(1,4),**meta):city.scales(a,name,ss,**meta)

def files():
    names=set()
    for r in json.loads((REV/'r17-B-generation.json').read_text()):
        if not r['selected']:continue
        bases=[r['output']]
        if r.get('shadow'):bases.extend(r['output'].replace('-w1',f'-w{w}') for w in (2,3))
        for base in bases:
            names.add(base+'.png')
            if not r.get('no_colours'):names.update(base+f'-c{c}.png' for c in range(3))
    return sorted(names)

def backdrop(size,name):
    if name.startswith('shadow'):return city.repeat(city.context('street'),size)
    if name.startswith(('chimney','dormer','skylight')):return city.grass(size)
    return Image.new('RGBA',size,BG)

def reviews():
    house=image(REF/'fantasy-house-2.png');names=files();index={};unique={}
    for name in names:
        a=image(OUT/name);digest=hashlib.sha256(a.tobytes()).hexdigest();unique.setdefault((a.size,digest),[]).append(name)
        pair=backdrop((a.width+house.width+32,max(a.height,house.height)+16),name);foot=pair.height-8
        pair.alpha_composite(a,(8,foot-a.height));pair.alpha_composite(house,(a.width+24,foot-house.height))
        sheet=Image.new('RGBA',(pair.width*5+32,pair.height*4+36),BG);d=ImageDraw.Draw(sheet)
        d.text((8,8),name+' / native 1x',fill='white');d.text((pair.width+24,8),'exact 4x / fantasy-house-2 at matching scale',fill='white')
        sheet.alpha_composite(pair,(8,28));sheet.alpha_composite(pair.resize((pair.width*4,pair.height*4),NN),(pair.width+24,28))
        save(sheet,'file-'+Path(name).stem,File=name,PairSize=pair.size,PairOrigins=[[8,28],[pair.width+24,28]],Scales=[1,4])
        base=re.sub('-c[0-2]$','',Path(name).stem)
        partners=[name,name]+[(base+f'-c{c}.png') if (OUT/(base+f'-c{c}.png')).exists() else name for c in (1,2)]
        seam=backdrop((a.width*4,a.height*2),name)
        for i,n in enumerate(partners*2):seam.alpha_composite(image(OUT/n),((i%4)*a.width,(i//4)*a.height))
        scales(seam,'seam-'+Path(name).stem,Files=partners*2)
        if name.startswith('roof-fill') or name=='firewall-w0.png':
            rep=city.repeat(a,(a.width*3,a.height*3));scales(rep,'repeat-'+Path(name).stem,Repeat=[3,3],Source=name)
        pixels=list(a.get_flattened_data())
        index[name]=dict(proof='r17-B-file-'+Path(name).stem+'.png',size=a.size,bounds=a.getbbox(),
            colours=len({p[:3] for p in pixels if p[3]}),alpha=sorted({p[3] for p in pixels}),
            painted_pixels=sum(p[3]>0 for p in pixels),pixels_sha256=digest)
    # Every pixel-unique export at native 1x and exact4x; one house per row.
    unames=[v[0] for v in unique.values()]
    pages=[]
    for start in range(0,len(unames),3):
        group=unames[start:start+3];rowh=620;page=Image.new('RGBA',(1544,rowh*len(group)),BG);d=ImageDraw.Draw(page)
        for row,name in enumerate(group):
            a=image(OUT/name);y=row*rowh
            d.text((8,y+4),name+' / 1x, 4x, reference4x',fill='white')
            patch=backdrop((a.width,a.height),name);patch.alpha_composite(a)
            page.alpha_composite(patch,(8,y+30));page.alpha_composite(patch.resize((a.width*4,a.height*4),NN),(168,y+28))
            page.alpha_composite(house,(768,y+28));page.alpha_composite(house.resize((576,576),NN),(936,y+28))
        label=f'gallery-{start//3+1:02d}';save(page,label,Files=group,Scales=[1,4]);pages.append('r17-B-'+label+'.png')
    # Compatible unlike eaves in all colours, including both 2/3-cell depths.
    for c in range(3):
        parts=[]
        for kind,w in [('gable',1),('ridge',2),('hip',3),('flat',2)]:parts.append(image(OUT/f'roof-{kind}-w{w}-c{c}.png'))
        a=city.grass((sum(p.width for p in parts),192));x=0
        for p in parts:a.alpha_composite(p,(x,144-p.height));x+=p.width
        scales(a,f'unlike-eaves-c{c}',Files=[f'roof-{k}-w{w}-c{c}.png' for k,w in [('gable',1),('ridge',2),('hip',3),('flat',2)]])
    # Native fill repetition, gutter, hip end and a broad firewall assembly.
    for c in range(3):
        roof=city.joined_l_roof(c)
        scales(roof,f'join-kit-c{c}',Parts=['roof-fill-w1','roof-valley','roof-hip-end'])
    wall=city.firewall_surface((56,160))
    scales(wall,'firewall-body-repeat',RepeatBody=[0,4,16,44],Coping='once at top',Flashing='once at foot')
    # Shared flat parapet proof uses the same adjacency rule as actual scenes.
    for c in range(3):
        specs=[city.make_spec(2,1,'door',0,0,'flat') for _ in range(2)]
        for s in specs:s['roof_colour']=c
        lots=[dict(id=str(i),x=i*96,base=144,spec=s) for i,s in enumerate(specs)]
        shared=Image.new('RGBA',(192,144))
        for lot in city.neighbours(lots):shared.alpha_composite(city.build(lot['spec'])[0],(lot['x'],0))
        scales(shared,f'shared-flat-c{c}')
    # All overlay variants are mounted on their own roof family, inside lot edges.
    for c in range(3):
        overlays=[n for n in names if n.startswith(('chimney','dormer','skylight')) and n.endswith(f'-c{c}.png')]
        mont=city.grass((len(overlays)*104,208));d=ImageDraw.Draw(mont)
        for i,n in enumerate(overlays):
            roof=image(OUT/f'roof-ridge-w2-c{c}.png');o=image(OUT/n);roof.alpha_composite(o,(36,40))
            mont.alpha_composite(roof,(i*104,24));d.text((i*104,4),Path(n).stem,fill='white')
            mont.alpha_composite(city.asset('ground-door-w2-c0'),(i*104,120))
        scales(mont,f'overlay-mounts-c{c}',ss=(1,3),Files=overlays)
    # One composed 2-cell front beside the approved reference at both scales.
    spec=city.make_spec(2,1,'door',0,0,'gable');spec['roof_overlays']=[dict(file='chimney-0',x=8,y=12)]
    a,parts=city.build(spec);pair=city.grass((a.width+house.width+32,max(a.height,house.height)+24));foot=pair.height-8
    pair.alpha_composite(a,(8,foot-a.height));pair.alpha_composite(house,(a.width+24,foot-house.height));scales(pair,'sample-neighbour',Parts=parts)
    # Retain every alternative at native scale and4x, grouped by output.
    groups={}
    for r in json.loads((REV/'r17-B-generation.json').read_text()):groups.setdefault(r['output'],[]).append(r)
    for name,rs in groups.items():
        if len(rs)<2:continue
        w=max(r['size'][0] for r in rs);h=max(r['size'][1] for r in rs)
        sheet=Image.new('RGBA',((w*4+32)*len(rs),h*5+72),BG);d=ImageDraw.Draw(sheet)
        for i,r in enumerate(rs):
            a=image(REV/('r17-B-clean-'+r['id']+'.png'));x=i*(w*4+32)
            d.text((x+8,8),r['id']+(' SELECTED' if r['selected'] else ' alternative'),fill='white')
            sheet.alpha_composite(a,(x+8,28));sheet.alpha_composite(a.resize((a.width*4,a.height*4),NN),(x+8,h+48))
        save(sheet,'selection-'+name)
    (REV/'r17-B-files.json').write_text(json.dumps(index,indent=2)+'\n')
    (REV/'r17-B-duplicates.json').write_text(json.dumps(list(unique.values()),indent=2)+'\n')
    (REV/'r17-B-gallery.json').write_text(json.dumps(pages,indent=2)+'\n')
    html=['<!doctype html><meta charset="utf-8"><title>Round17 PartB review</title>',
          '<style>body{background:#282d29;color:#eee;font:16px sans-serif;margin:24px}a{color:#edc88b}img{image-rendering:pixelated;max-width:100%}details{margin:12px}</style>',
          '<h1>Round 17 — Part B: critic-r17B-3 redraw</h1><p>Repaired compose.py with continuous image-tool L-roof paint: coherent receiving planes, hips ending at outside corners, and one uninterrupted eave. All 137 passing PNG exports remain byte-identical. Three drawing alternatives were reduced and compared. Parts C/D context remains explicitly provisional. Saved-art self-review; no independent panel or in-engine approval is claimed.</p>',
          '<p><a href="r17-B-validation.json">Validation</a> · <a href="r17-B-critic3-response.json">Response to every failed file</a> · <a href="critic-r17B-3.json">Original independent critic</a> · <a href="r17-B-critic3-generation.json">Exact redraw prompts and source manifest</a></p>']
    for name in ['sample-neighbour-1x','sample-neighbour-4x']+[f'critic-{s}-{suffix}' for s in ('L-block','market','height-test') for suffix in ('comparison-1x','comparison-3x','squint-1x')]:
        html.append(f'<details><summary>{name}</summary><a href="r17-B-{name}.png"><img loading="lazy" src="r17-B-{name}.png"></a></details>')
    for name in [f'{kind}-c{c}-{s}x' for kind in ('unlike-eaves','join-kit','repeat-roof-fill-w1','shared-flat') for c in range(3) for s in (1,4)]+['firewall-body-repeat-1x','firewall-body-repeat-4x']+[f'overlay-mounts-c{c}-{s}x' for c in range(3) for s in (1,3)]:
        html.append(f'<details><summary>{name}</summary><a href="r17-B-{name}.png"><img loading="lazy" src="r17-B-{name}.png"></a></details>')
    for name in [f'critic2-deep-w{w}-c{c}-{z}x' for w in (1,2,3) for c in range(3) for z in (1,4)]+[f'critic2-{n}-{z}x' for n in ('narrow-pair','narrow-between') for z in (1,3)]+[f'critic2-L-join-c{c}-squint-1x' for c in range(3)]+[f'critic2-final-{n}-8x' for n in ('dormer','chimney')]:
        html.append(f'<details><summary>{name}</summary><a href="r17-B-{name}.png"><img loading="lazy" src="r17-B-{name}.png"></a></details>')
    for name in [f'critic3-L-join-c{c}-{z}x' for c in range(3) for z in (1,4)]+[f'critic3-L-join-c{c}-squint-1x' for c in range(3)]+[f'critic3-{n}-c{c}-8x' for c in range(3) for n in ('left-transition','hip-transition','eave')]+[f'critic3-selection-{v}' for v in 'abc']:
        html.append(f'<details><summary>{name}</summary><a href="r17-B-{name}.png"><img loading="lazy" src="r17-B-{name}.png"></a></details>')
    for name in ['critic1-gutter-elbow-8x','critic1-terminal-hip-8x','critic1-shadow-full-depth-1x','critic1-shadow-full-depth-4x']:
        html.append(f'<details><summary>{name}</summary><a href="r17-B-{name}.png"><img loading="lazy" src="r17-B-{name}.png"></a></details>')
    for name in names:
        proof=index[name]['proof'];stem=Path(name).stem
        html.append(f'<details><summary>{name}</summary><a href="{proof}"><img loading="lazy" src="{proof}"></a> · <a href="r17-B-seam-{stem}-1x.png">Seams1x</a> · <a href="r17-B-seam-{stem}-4x.png">Seams4x</a></details>')
    (REV/'r17-B-review.html').write_text('\n'.join(html)+'\n')
    print(len(names),'exports;',len(unique),'pixel-unique;',len(pages),'gallery pages')

if __name__=='__main__':reviews()
