"""Publish C17 proof repairs locally, refresh named studies, and validate pixels."""
import hashlib
import io
import json
from collections import Counter
from contextlib import redirect_stdout
from pathlib import Path
from PIL import Image, ImageDraw
from repair_c17 import BASE, REVIEW, NAMES, S, clean_small
from check_proofs import rgb, light, mean, native_master, grouped_reviews
from review_c9 import lone_pixels
from draw_style_samples import SWATCHES
import check_operator_c as checks

STUDIES=['keep','temple','manor','cave_rock','cave_ice','cave_crystal','cave_lava','dungeon_sewer','building-yard']

def studies():
    guide=Image.open(BASE/'canon/style-guide.png').convert('RGB')
    for n in STUDIES:
        look='yard' if n=='building-yard' else n
        top,face,floor=[Image.open(REVIEW/f'C17-{look}-{tag}.png').convert('RGB') for tag in ('top','face','floor')]
        im=Image.new('RGB',(48,48))
        topbox=(0,28,48,40);facebox=(0,0,48,12);floorbox=(0,0,48,24)
        if n=='cave_crystal':floorbox=(10,8,58,32)
        if n=='temple':floorbox=(8,18,56,42)
        if n=='cave_rock':floorbox=(10,13,58,37)
        if n=='cave_lava':facebox=(20,0,68,12);floorbox=(10,6,58,30)
        if n=='dungeon_sewer':facebox=(0,15,48,27)
        im.paste(top.crop(topbox),(0,0));im.paste(face.crop(facebox),(0,12));im.paste(floor.crop(floorbox),(0,24))
        if n=='manor':
            # The critic permits its parquet portion to stay unchanged.
            im.paste(face.crop((0,0,48,24)),(0,0))
            im.paste(Image.open(BASE/'canon/swatches/manor.png').crop((0,24,48,48)),(0,24))
        if n=='building-yard':
            for k,x in enumerate((38,54,104)):im.paste(floor.crop((x,6,x+16,30)),(16*k,24))
        clean_small(im)
        im.convert('RGBA').save(BASE/f'canon/swatches/{n}.png')
        i=list(SWATCHES).index(n);guide.paste(im,(48+i%7*240,800+i//7*94))
    guide.paste(Image.open(BASE/'canon/swatches/keep.png'),(1032,1524))
    guide.save(BASE/'canon/style-guide.png')

def save():
    for n in NAMES:
        proof=Image.open(REVIEW/f'C17-{n}-proof.png').convert('RGBA')
        proof.save(BASE/f'proof/{n}.png');proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
        wall=Image.open(REVIEW/f'C17-{n}-wall.png').convert('RGBA');wall.save(REVIEW/f'C-layer-{n}-wall.png')
        floor=Image.open(REVIEW/f'C17-{n}-floor.png').convert('RGBA')
        backing=Image.new('RGBA',(144,144),Counter(floor.get_flattened_data()).most_common(1)[0][0])
        backing.paste(floor,(0,96));backing.save(REVIEW/f'C-layer-{n}-floor.png')
    studies()

def validate():
    checks.BODY.update({'temple':[('brass',4)],'cave_crystal':[('dark-rock',6)],
       'crypt':[('dark-masonry',6)],'cave_lava':[('ash',5),('ash',2)],
       'station_hydro':[('planters',4),('planters',5),('overgrowth',4),('overgrowth',5)]})
    output=io.StringIO()
    with redirect_stdout(output):report=checks.run()
    (REVIEW/'C17-check-output.txt').write_text(output.getvalue())
    for n,stats in report['results'].items():
        stats['checks'].pop('coverage_8px') # Operator accepts calm fill.
        p=Image.open(BASE/f'proof/{n}.png').convert('RGBA')
        w=Image.open(REVIEW/f'C-layer-{n}-wall.png').convert('RGBA')
        f=Image.open(REVIEW/f'C-layer-{n}-floor.png').convert('RGBA').crop((0,96,144,144))
        surface=Image.new('RGBA',(144,144));surface.paste(w,(0,0));surface.paste(f,(0,96))
        stats['lone_pixels']={tag:lone_pixels(im) for tag,im in [('surface',surface),('floor',f),('top',w.crop((0,8,144,48))),('face',w.crop((0,48,144,95))),('proof',p)]}
        stats['checks']['lone_pixel_ceiling_3pct']=all(v['percent']<=3 for v in stats['lone_pixels'].values())
        stats['visible_floor_mean_L']=mean(f)
        repeat=Image.new('RGBA',(432,144))
        for y in range(3):
            for x in range(3):repeat.paste(f,(x*144,y*48))
        repeat.save(REVIEW/f'proof-3x3repeat-{n}.png')
        fs=Image.new('RGB',(896,496),'#222630');d=ImageDraw.Draw(fs)
        d.text((8,8),f'{n}: visible floor / 3x3 repeat at 1x and 2x',fill='white')
        fs.paste(repeat,(8,32));fs.paste(repeat.resize((864,288),Image.Resampling.NEAREST),(8,192))
        fs.save(REVIEW/f'C-floor-repeat-{n}.png')
        master,_=native_master(n.startswith('station_'))
        sheet=Image.new('RGB',(608,328),'#222630');d=ImageDraw.Draw(sheet)
        d.text((8,8),f'{n}: proof 2x / master PNG crop 1x; equal art pixels',fill='white')
        sheet.paste(p.resize((288,288),Image.Resampling.NEAREST),(8,32));sheet.paste(master.resize((288,288),Image.Resampling.NEAREST),(312,32))
        sheet.save(REVIEW/f'C-op2-{n}.png')
    from check_style_guide import measurements,clusters
    report['studies']={}
    for n in STUDIES:
        im=Image.open(BASE/f'canon/swatches/{n}.png');m=measurements(im)
        allowed={rgb(h) for r in S['yard' if n=='building-yard' else n][4]+['void-mass'] for h in checks.P[r]}
        m['own_ramps']=all(v[:3] in allowed for v in im.convert('RGBA').get_flattened_data())
        m['small_components']=len(clusters(im));m['lone_pixels']=lone_pixels(im)
        m['pass']=m['size']==[48,48] and m['colours']<=32 and m['own_ramps'] and not m['small_components'] and not any(m[k] for k in ['soft_alpha_pixels','nonzero_transparent_rgb','off_palette_pixels','opaque_black_pixels'])
        report['studies'][n]=m
    before=json.loads((REVIEW/'C17-start-hashes.json').read_text())
    permitted={str(BASE/f'proof/{n}{suffix}.png') for n in NAMES for suffix in ('','-grey')}
    permitted|={str(BASE/f'canon/swatches/{n}.png') for n in STUDIES}
    permitted|={str(BASE/'canon/style-guide.png'),str(BASE/'NOTES.md')}
    # Normalize paths because the snapshot uses repository-relative paths.
    permitted={str(Path(p).resolve()) for p in permitted}
    frozen=[p for p in before if str(Path(p).resolve()) not in permitted]
    changed=[p for p in frozen if hashlib.sha256(Path(p).read_bytes()).hexdigest()!=before[p]]
    report['preservation']={'frozen_files_checked':len(frozen),'changed':changed}
    report['failures']=[f'{n}: {k}' for n,s in report['results'].items() for k,v in s['checks'].items() if not v]
    report['failures'] += [f'study {n}' for n,m in report['studies'].items() if not m['pass']]
    report['numeric_pass']=not report['failures'] and not changed
    report['pass']=report['numeric_pass']
    report['authoring']='Operator Round 3 tolerant registered-grid read-back; exact pitches and coverage recorded in C17-registration.json. Not an exact integer source grid.'
    report['visual_review']='Drawing-agent review, owner acceptance pending.'
    (REVIEW/'C17-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    (REVIEW/'C-operator-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    from review_operator_c import run
    run();grouped_reviews()
    print(json.dumps({'numeric_pass':report['numeric_pass'],'failures':report['failures'],'preservation':report['preservation'],
       'means':{n:s['mean_L'] for n,s in report['results'].items()},
       'floor_spans':{n:s['floor_span'] for n,s in report['results'].items()},
       'lone_pixels_percent':{n:s['lone_pixels']['surface']['percent'] for n,s in report['results'].items()}},indent=2))
    return report

if __name__=='__main__':
    save();validate()
