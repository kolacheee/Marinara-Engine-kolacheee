"""Saved-pixel D checks and review-only sheets; no delivery art is modified."""
import json,hashlib
from collections import Counter
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,S,P
from check_proofs import light,components,mean
from review_c9 import lone_pixels
from review_critic23 import master_reference
from d_surfaces import FIXED
from d_layouts import MAPS

PAL={tuple(bytes.fromhex(h[1:])) for ramp in P.values() for h in ramp}
def metric(pic):
    im=pic.convert('RGBA');counts=Counter(im.get_flattened_data());visible={p[:3] for p in counts if p[3]}
    return dict(size=list(im.size),colours=len(visible),soft_alpha=sum(n for p,n in counts.items() if p[3] not in (0,255)),
      dirty_transparent=sum(n for p,n in counts.items() if not p[3] and p[:3]!=(0,0,0)),off_palette=sum(n for p,n in counts.items() if p[3] and p[:3] not in PAL),black=sum(n for p,n in counts.items() if p[3] and p[:3]==(0,0,0)))
def sheet(pic,name,station=False):
    im=pic.convert('RGB');w,h=im.size;master,_=master_reference(station);g=im.convert('L');sq=g.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST)
    # Full native and full 3x views are retained, even for the largest maps.
    pw=max(4*w+508,1160);ph=max(3*h+112,h+704)
    out=Image.new('RGB',(pw,ph),'#222630');d=ImageDraw.Draw(out);d.text((12,8),name+' / native 1x, 3x nearest, grey, quarter-grey squint; master registered from exact 2x2 pixels',fill='white')
    out.paste(im,(12,40));out.paste(im.resize((3*w,3*h),Image.Resampling.NEAREST),(w+28,40))
    out.paste(master,(4*w+52,40));out.paste(master.resize((432,432),Image.Resampling.NEAREST),(4*w+52,216))
    out.paste(g,(12,h+72));out.paste(sq,(12,2*h+104))
    out.save(REVIEW/f'D-{name}.png')
    # 2x beside the master PNG's stored 1x crop, same art-pixel density.
    if w<=288 and h<=288:
        out=Image.new('RGB',(max(2*w+336,720),max(2*h+48,344)),'#222630');d=ImageDraw.Draw(out);d.text((8,8),name+' / 2x native art; master PNG crop 1x',fill='white');out.paste(im.resize((w*2,h*2),Image.Resampling.NEAREST),(8,40));out.paste(master.resize((288,288),Image.Resampling.NEAREST),(w*2+24,40));out.save(REVIEW/f'D-{name}-2x.png')

def run():
    report={'cell_size':48,'authoring':'Native coordinate drawings; reference grids supply geometry only. Existing B/C sprites and surface rows copy 1:1.','files':{},'surfaces':{},'proofs':{},'frames':{},'failures':[]}
    paths=list((BASE/'canon/surfaces').glob('*.png'))+list((BASE/'canon/props').glob('d-*.png'))+list((BASE/'canon/props').glob('*-study.png'))
    paths+= [BASE/f'proof/{n}.png' for n in FIXED]+[BASE/f'canon/swatches/{n}.png' for n in FIXED]
    for p in paths:
        im=Image.open(p);m=metric(im);m['cap']=32 if 'surfaces' in str(p) or 'swatches' in str(p) else 48
        # A proof is a scene, not a combined production sheet; measure layers below.
        if '/proof/' in str(p):m['cap']=80
        m['pass']=not any(m[k] for k in ['soft_alpha','dirty_transparent','off_palette','black']) and all(v%48==0 for v in im.size) and m['colours']<=m['cap'];report['files'][str(p.relative_to(BASE))]=m
        if not m['pass']:report['failures'].append(str(p.relative_to(BASE)))
        prefix=p.parent.name+'-'+p.stem;sheet(im,prefix,'station' in p.stem)
    for n in S:
        f=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGBA');wall=Image.open(BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA')
        small,_=components(f);ls=[light(v) for v in set(f.get_flattened_data())];tiles=[]
        for y in range(0,288,48):
            for x in range(0,288,48):
                lp=lone_pixels(f.crop((x,y,x+48,y+48)));tiles.append(dict(x=x,y=y,**lp))
        lp=lone_pixels(wall);entry=dict(floor_min_L=min(ls),floor_max_L=max(ls),floor_span=max(ls)-min(ls),small_floor_clusters=small,floor_lone=lone_pixels(f),wall_lone=lp,tiles=tiles,
          surface_colours=len(set(p for im in [f,wall] for p in im.get_flattened_data())),mean_mass=mean(wall.crop((0,0,144,8))),mean_top=mean(wall.crop((0,8,144,48))),mean_face=mean(wall.crop((0,48,144,95))))
        entry['pass']=not small and max(ls)-min(ls)<=15 and min(ls)>=35 and max(ls)<=55 and lp['percent']<=3 and max(t['percent'] for t in tiles)<=3 and entry['surface_colours']<=32
        report['surfaces'][n]=entry
        if not entry['pass']:report['failures'].append('surface '+n)
        # Existing 14 proof surfaces are checked from actual diagnostic layers.
        proof=Image.open(BASE/f'proof/{n}.png').convert('RGBA');grey=Image.open(BASE/f'proof/{n}-grey.png').convert('RGBA')
        floor=Image.open(REVIEW/f'C-layer-{n}-floor.png').convert('RGBA').crop((0,96,144,144));ss=Image.new('RGBA',(144,144));ss.paste(wall);ss.paste(floor,(0,96))
        pl=lone_pixels(ss);pr=dict(lone_pixels=pl,grey_exact=grey.tobytes()==proof.convert('L').convert('RGBA').tobytes(),surface_colours=len(set(ss.get_flattened_data())),prop_colours=metric(Image.open(BASE/f'canon/props/{n}-study.png'))['colours'])
        pr['pass']=pr['grey_exact'] and pl['percent']<=3 and pr['surface_colours']<=32 and pr['prop_colours']<=48;report['proofs'][n]=pr
        if not pr['pass']:report['failures'].append('proof '+n)
    layouts=json.loads((BASE/'frames/layout.json').read_text())
    for n,cfg in MAPS.items():
        im=Image.open(BASE/f'frames/{n}.png').convert('RGBA');g=Image.open(BASE/f'frames/{n}-grey.png').convert('RGBA');m=metric(im)
        m['two_x_exact']=Image.open(BASE/f'frames/{n}-2x.png').convert('RGBA').tobytes()==im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST).tobytes()
        m['grey_exact']=g.tobytes()==im.convert('L').convert('RGBA').tobytes();m['squint_exact']=Image.open(BASE/f'frames/{n}-squint.png').convert('RGBA').tobytes()==g.resize((im.width//4,im.height//4),Image.Resampling.NEAREST).tobytes()
        actual=[(o.get('source_item',o['item']),o['source']) for o in layouts[n]['objects'] if o['group']=='reference'];expected=[(k,list(xy)) for k,ps in cfg['items'].items() for xy in ps]+[(('airlock-' if n=='station_lab' else 'door-')+state,[x,y]) for state,x,y in cfg['doors']]
        m['reference_object_count']=len(expected);m['reference_positions_preserved']=sorted(actual)==sorted(expected)
        names={o['item'] for o in layouts[n]['objects']};m['required_items']=all(any(q in names for q in options) for options in [('door-open','airlock-open'),('door-locked','airlock-locked'),('stairs-up','stairs-down'),('party',),('foe',),('trap-found',),('chest',),('chest-open',)])
        m['pass']=all(m[k] for k in ['two_x_exact','grey_exact','squint_exact','reference_positions_preserved','required_items']) and not any(m[k] for k in ['soft_alpha','dirty_transparent','off_palette','black']) and all(v%48==0 for v in im.size)
        report['frames'][n]=m
        if not m['pass']:report['failures'].append('frame '+n)
        sheet(im,'frame-'+n,n=='station_lab')
        # Paginated native crops make visual review practical without reducing art.
        for y in range(0,im.height,384):
            for x in range(0,im.width,480):
                crop=im.crop((x,y,min(x+480,im.width),min(y+384,im.height)));sheet(crop,f'crop-{n}-{x}-{y}',n=='station_lab')
    # Frozen reference and B files must remain untouched outside authorized inserts.
    before=json.loads((REVIEW/'D-start/hashes.json').read_text());changed=[]
    for p,h in before.items():
        if hashlib.sha256(__import__('pathlib').Path(p).read_bytes()).hexdigest()!=h:changed.append(p)
    report['changed_earlier_files']=changed
    report['pass']=not report['failures'];(REVIEW/'D-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    # Contact sheet is explicitly the native six-frame deliverable, no reduction.
    ims=[Image.open(BASE/f'frames/{n}.png') for n in MAPS];w=sum(i.width for i in ims)+7*24;h=max(i.height for i in ims)+288
    contact=Image.new('RGB',(w,h),'#1c222e');d=ImageDraw.Draw(contact);d.fontmode='1';x=24
    for n,im in zip(MAPS,ims):d.text((x,12),n,fill='#c8c0af');contact.paste(im,(x,36));x+=im.width+24
    y=max(i.height for i in ims)+84
    for i,n in enumerate(S):
        x=24+i*192;d.text((x,y-20),n,fill='#c8c0af');contact.paste(Image.open(BASE/f'proof/{n}.png'),(x,y))
    # Keep the final owner sheet dimensions on the native-cell lattice.
    padded=Image.new('RGB',(((w+47)//48)*48,((h+47)//48)*48),'#1c222e');padded.paste(contact);padded.save(BASE/'d0a-review.png')
    print(json.dumps({'pass':report['pass'],'failures':report['failures'],'frames':{n:{k:m[k] for k in ['size','colours','reference_object_count']} for n,m in report['frames'].items()},'surface_lone':{n:m['wall_lone']['percent'] for n,m in report['surfaces'].items()}},indent=2))
    return report
if __name__=='__main__':run()
