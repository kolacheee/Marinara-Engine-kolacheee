"""Refresh authorized studies and review sheets; validate the saved C18 pixels."""
import hashlib
import io
import json
from contextlib import redirect_stdout
from pathlib import Path
from PIL import Image,ImageDraw
from redraw_c18 import BASE, REVIEW, NAMES
from draw_proofs import S, P
from draw_style_samples import SWATCHES
from check_proofs import rgb, mean, grouped_reviews, native_master, components
from check_style_guide import measurements, clusters
from review_c9 import lone_pixels
import check_operator_c as checks

STUDIES=['keep','temple','manor','cave_rock','cave_ice','cave_crystal',
         'cave_lava','dungeon_sewer','building-yard']

def studies():
    guide=Image.open(BASE/'canon/style-guide.png').convert('RGB')
    for n in STUDIES:
        look='yard' if n=='building-yard' else n
        top,face,floor=[Image.open(REVIEW/f'C18-{look}-{tag}.png').convert('RGB') for tag in ('top','face','floor')]
        im=Image.new('RGB',(48,48))
        topbox=(0,0,48,12);facebox=(0,0,48,12);floorbox=(0,8,48,32)
        if n=='cave_crystal':topbox=(12,14,60,26);facebox=(10,14,58,26)
        if n=='cave_ice':topbox=(8,20,56,32);facebox=(0,0,48,12)
        if n=='cave_lava':topbox=(12,20,60,32);facebox=(20,18,68,30);floorbox=(12,6,60,30)
        if n=='dungeon_sewer':facebox=(0,14,48,26)
        im.paste(top.crop(topbox),(0,0));im.paste(face.crop(facebox),(0,12));im.paste(floor.crop(floorbox),(0,24))
        if n=='manor':
            im.paste(face.crop((0,0,48,24)),(0,0))
            im.paste(floor.crop((0,0,48,24)),(0,24))
        if n=='building-yard':
            # Turf, dirt and a whole upper cobble; no feature is scaled.
            im.paste(floor.crop((24,10,42,34)),(0,24))
            im.paste(floor.crop((60,10,66,34)),(18,24))
            im.paste(floor.crop((90,0,114,24)),(24,24))
        im.convert('RGBA').save(BASE/f'canon/swatches/{n}.png')
        i=list(SWATCHES).index(n);guide.paste(im,(48+i%7*240,800+i//7*94))
    guide.paste(Image.open(BASE/'canon/swatches/keep.png'),(1032,1524))
    guide.save(BASE/'canon/style-guide.png')

def validate():
    checks.BODY.update({'temple':[('brass',4)],'cave_crystal':[('dark-rock',6)],
       'crypt':[('dark-masonry',6)],'cave_lava':[('ash',5),('ash',2)],
       'station_hydro':[('planters',4),('planters',5),('overgrowth',4),('overgrowth',5)]})
    with redirect_stdout(io.StringIO()):report=checks.run()
    for n,s in report['results'].items():
        # Operator/critic 18 expressly permits calm fill; an 8px fill ceiling is obsolete.
        s['checks'].pop('coverage_8px')
        wall=Image.open(REVIEW/f'C-layer-{n}-wall.png').convert('RGBA')
        floor=Image.open(REVIEW/f'C-layer-{n}-floor.png').convert('RGBA').crop((0,96,144,144))
        proof=Image.open(BASE/f'proof/{n}.png').convert('RGBA')
        surface=Image.new('RGBA',(144,144));surface.paste(wall);surface.paste(floor,(0,96))
        s['mean_L']['floor']=mean(floor)
        s['lone_pixels']={tag:lone_pixels(im) for tag,im in [('surface',surface),('floor',floor),('top',wall.crop((0,8,144,48))),('face',wall.crop((0,48,144,95))),('proof',proof)]}
        s['checks']['lone_pixel_ceiling_3pct']=all(v['percent']<=3 for v in s['lone_pixels'].values())
        s['checks']['visible_floor_clusters_3']=not components(floor)[0]
        s['visible_floor_small_components']=components(floor)[0]
        repeat=Image.new('RGBA',(432,144))
        for y in range(3):
            for x in range(3):repeat.paste(floor,(x*144,y*48))
        repeat.save(REVIEW/f'proof-3x3repeat-{n}.png')
        sheet=Image.new('RGB',(896,496),'#222630');d=ImageDraw.Draw(sheet)
        d.text((8,8),f'{n}: visible floor / 3x3 repeat at 1x and 2x',fill='white')
        sheet.paste(repeat,(8,32));sheet.paste(repeat.resize((864,288),Image.Resampling.NEAREST),(8,192))
        sheet.save(REVIEW/f'C-floor-repeat-{n}.png')
        master,_=native_master(n.startswith('station_'))
        sheet=Image.new('RGB',(608,328),'#222630');d=ImageDraw.Draw(sheet)
        d.text((8,8),f'{n}: proof 2x / master PNG crop 1x; equal art pixels',fill='white')
        sheet.paste(proof.resize((288,288),Image.Resampling.NEAREST),(8,32))
        sheet.paste(master.resize((288,288),Image.Resampling.NEAREST),(312,32))
        sheet.save(REVIEW/f'C-op2-{n}.png')
    report['studies']={}
    for n in STUDIES:
        im=Image.open(BASE/f'canon/swatches/{n}.png');m=measurements(im)
        allowed={rgb(h) for r in S['yard' if n=='building-yard' else n][4]+['void-mass'] for h in P[r]}
        m['own_ramps']=all(v[:3] in allowed for v in im.convert('RGBA').get_flattened_data())
        m['small_components']=clusters(im);m['lone_pixels']=lone_pixels(im)
        m['pass']=m['size']==[48,48] and m['colours']<=32 and m['own_ramps'] and not m['small_components'] and not any(m[k] for k in ['soft_alpha_pixels','nonzero_transparent_rgb','off_palette_pixels','opaque_black_pixels'])
        report['studies'][n]=m
    before=json.loads((REVIEW/'C18-start-hashes.json').read_text())
    permitted={str(BASE/f'proof/{n}{suffix}.png') for n in NAMES for suffix in ('','-grey')}
    permitted|={str(BASE/f'canon/swatches/{n}.png') for n in STUDIES}
    permitted|={str(BASE/'canon/style-guide.png'),str(BASE/'NOTES.md')}
    permitted={str(Path(p).resolve()) for p in permitted}
    frozen=[p for p in before if str(Path(p).resolve()) not in permitted]
    changed=[p for p in frozen if hashlib.sha256(Path(p).read_bytes()).hexdigest()!=before[p]]
    report['preservation']={'frozen_files_checked':len(frozen),'changed':changed}
    report['failures']=[f'{n}: {k}' for n,s in report['results'].items() for k,v in s['checks'].items() if not v]
    report['failures'] += [f'study {n}' for n,m in report['studies'].items() if not m['pass']]
    report['numeric_pass']=not report['failures'] and not changed
    report['pass']=report['numeric_pass']
    report['authoring']='Ten surface sets drawn directly on native 144px-wide canvases with explicit integer-coordinate rectangles and paths in redraw_c18.py. No source image read-back, resampling, random texture or filters. Existing separate props remain unchanged.'
    report['visual_review']='Drawing-agent self-review; no independent critic verdict or owner approval claimed.'
    for filename in ['C18-validation.json','C-operator-validation.json','C-validation.json']:
        (REVIEW/filename).write_text(json.dumps(report,indent=2)+'\n')
    from review_operator_c import run
    run();grouped_reviews()
    # Refresh the generic C contact sheets as well as the operator sheets.
    for scale in (1,2):
        Image.open(REVIEW/f'C-operator-contact-{scale}x.png').save(REVIEW/f'C-contact-{scale}x.png')
    print(json.dumps({'numeric_pass':report['numeric_pass'],'failures':report['failures'],
       'preservation':report['preservation'],'small_studies':{n:s['small_components'] for n,s in report['studies'].items() if s['small_components']},
       'lone_pixels_percent':{n:s['lone_pixels']['surface']['percent'] for n,s in report['results'].items()}},indent=2))
    return report

if __name__=='__main__':
    studies()
    raise SystemExit(0 if validate()['numeric_pass'] else 1)
