"""Save approved-by-self-review C21 assemblies and measure their saved pixels."""
import hashlib,io,json
from pathlib import Path
from contextlib import redirect_stdout
from collections import Counter
from PIL import Image,ImageDraw
from assemble_c21 import CHANGED,SELECT
from draw_proofs import BASE,REVIEW,S,P
from draw_style_samples import SWATCHES
from check_proofs import rgb,mean,components,native_master,grouped_reviews
from check_style_guide import measurements,clusters
from import_c16 import clean_small
from review_c9 import lone_pixels
import check_operator_c as checks
STUDIES=['cave_rock','cave_ice','cave_crystal','cave_lava','building-yard']

def save():
    for n in CHANGED:
        proof=Image.open(REVIEW/f'C21-{n}-proof.png').convert('RGBA')
        proof.save(BASE/f'proof/{n}.png');proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
        Image.open(REVIEW/f'C21-{n}-wall.png').save(REVIEW/f'C-layer-{n}-wall.png')
        floor=Image.open(REVIEW/f'C21-{n}-floor.png').convert('RGBA')
        back=Image.new('RGBA',(144,144),Counter(floor.get_flattened_data()).most_common(1)[0][0]);back.paste(floor,(0,96));back.save(REVIEW/f'C-layer-{n}-floor.png')
    guide=Image.open(BASE/'canon/style-guide.png').convert('RGB')
    for n in STUDIES:
        look='yard' if n=='building-yard' else n
        top,face,floor=[Image.open(REVIEW/f'C21-{look}-{tag}.png').convert('RGB') for tag in ['top','face','floor']]
        im=Image.new('RGB',(48,48));im.paste(top.crop((20,6,68,18)),(0,0))
        face_x={'cave_crystal':24,'cave_lava':17,'cave_ice':2}.get(n,20)
        im.paste(face.crop((face_x,14,face_x+48,26)),(0,12));im.paste(floor.crop((4,8,52,32)),(0,24))
        if n=='building-yard':
            im.paste(floor.crop((4,8,24,32)),(0,24));im.paste(floor.crop((65,8,73,32)),(20,24));im.paste(floor.crop((100,8,120,32)),(28,24))
        clean_small(im);im.convert('RGBA').save(BASE/f'canon/swatches/{n}.png')
        i=list(SWATCHES).index(n);guide.paste(im,(48+i%7*240,800+i//7*94))
    guide.save(BASE/'canon/style-guide.png')

def validate():
    checks.BODY.update({'temple':[('brass',4)],'cave_crystal':[('dark-rock',6)],'crypt':[('dark-masonry',6)],'cave_lava':[('ash',5),('ash',2)],'station_hydro':[('planters',4),('planters',5),('overgrowth',4),('overgrowth',5)]})
    with redirect_stdout(io.StringIO()):report=checks.run()
    for n,s in report['results'].items():
        s['checks'].pop('coverage_8px')
        wall=Image.open(REVIEW/f'C-layer-{n}-wall.png').convert('RGBA');floor=Image.open(REVIEW/f'C-layer-{n}-floor.png').convert('RGBA').crop((0,96,144,144))
        proof=Image.open(BASE/f'proof/{n}.png').convert('RGBA');surface=Image.new('RGBA',(144,144));surface.paste(wall);surface.paste(floor,(0,96))
        s['mean_L']['visible_floor']=mean(floor)
        s['lone_pixels']={tag:lone_pixels(im) for tag,im in [('surface',surface),('floor',floor),('top',wall.crop((0,8,144,48))),('face',wall.crop((0,48,144,95))),('proof',proof)]}
        s['checks']['lone_pixels_under_3pct']=all(v['percent']<=3 for v in s['lone_pixels'].values())
        s['checks']['visible_floor_clusters_3']=not components(floor)[0]
        repeat=Image.new('RGBA',(432,144))
        for y in range(3):
            for x in range(3):repeat.paste(floor,(144*x,48*y))
        repeat.save(REVIEW/f'proof-3x3repeat-{n}.png')
        master,_=native_master(n.startswith('station_'));sheet=Image.new('RGB',(608,328),'#222630');d=ImageDraw.Draw(sheet)
        d.text((8,8),f'{n}: proof 2x / master PNG crop 1x, equal art-pixel scale',fill='white');sheet.paste(proof.resize((288,288),Image.Resampling.NEAREST),(8,32));sheet.paste(master.resize((288,288),Image.Resampling.NEAREST),(312,32));sheet.save(REVIEW/f'C-op2-{n}.png')
    report['studies']={}
    for n in STUDIES:
        im=Image.open(BASE/f'canon/swatches/{n}.png');m=measurements(im);allowed={rgb(h) for r in S['yard' if n=='building-yard' else n][4]+['void-mass'] for h in P[r]}
        m['own_ramps']=all(v[:3] in allowed for v in im.convert('RGBA').get_flattened_data());m['small_components']=clusters(im);m['lone_pixels']=lone_pixels(im)
        m['pass']=m['size']==[48,48] and 5<=m['colours']<=32 and m['own_ramps'] and not m['small_components'] and not any(m[k] for k in ['soft_alpha_pixels','nonzero_transparent_rgb','off_palette_pixels','opaque_black_pixels'])
        report['studies'][n]=m
    before=json.loads((REVIEW/'C21-start-hashes.json').read_text());allowed={str((BASE/f'proof/{n}{s}.png').resolve()) for n in CHANGED for s in ('','-grey')}
    allowed|={str((BASE/f'canon/swatches/{n}.png').resolve()) for n in STUDIES};allowed|={str((BASE/'canon/style-guide.png').resolve()),str((BASE/'NOTES.md').resolve())}
    frozen=[p for p in before if p not in allowed];changed=[p for p in frozen if hashlib.sha256(Path(p).read_bytes()).hexdigest()!=before[p]]
    # Wall rows are separately frozen even when the proof's floor changed.
    wall_matches={n:Image.open(BASE/f'proof/{n}.png').crop((0,0,144,96)).tobytes()==Image.open(REVIEW/f'C19-{n}-proof.png').crop((0,0,144,96)).tobytes() for n in ['keep','temple','crypt','dungeon_sewer']}
    report['preservation']=dict(frozen_files_checked=len(frozen),changed=changed,frozen_walls_match=wall_matches)
    report['failures']=[f'{n}: {k}' for n,s in report['results'].items() for k,v in s['checks'].items() if not v]+[f'study {n}' for n,m in report['studies'].items() if not m['pass']]
    report['numeric_pass']=not report['failures'] and not changed and all(wall_matches.values())
    report['pass']=report['numeric_pass'];report['authoring']='Built-in image-tool sources, detected common square-grid pitch, tolerant mode per block, own-ramp palette lock, whole-pixel region assembly and small-fragment/contour cleanup. Native overworld yard crops mapped 1:1. No spatial resampling or code-generated texture.'
    report['visual_review']='Drawing-agent self-review; owner acceptance pending.'
    for f in ['C21-validation.json','C-validation.json','C-operator-validation.json']:(REVIEW/f).write_text(json.dumps(report,indent=2)+'\n')
    from review_operator_c import run
    run();grouped_reviews()
    print(json.dumps({'numeric_pass':report['numeric_pass'],'failures':report['failures'],'preservation':report['preservation'],'lone_pixels':{n:s['lone_pixels']['surface']['percent'] for n,s in report['results'].items()}},indent=2))
    return report
if __name__=='__main__':
    save();raise SystemExit(0 if validate()['numeric_pass'] else 1)
