"""Save the ten replacement proof pairs, check all fourteen, and render reviews."""
import json, hashlib, io
from contextlib import redirect_stdout
from pathlib import Path
from collections import Counter
from PIL import Image, ImageDraw
from import_c16 import SELECT, BASE, REVIEW, S, clean_small
from check_proofs import light, mean, rgb, native_master, reviews, grouped_reviews
from review_c9 import lone_pixels
import check_operator_c as checks


def finish():
    for n in SELECT:
        proof=Image.open(REVIEW/f'C16-{n}-proof.png').convert('RGBA')
        proof.save(BASE/f'proof/{n}.png')
        proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
        wall=Image.open(REVIEW/f'C16-{n}-wall.png').convert('RGBA')
        visible=Image.open(REVIEW/f'C16-{n}-floor.png').convert('RGBA')
        # The hidden area is a calm backing for legacy proof reconstruction tools.
        # Only rows 96..143 are shown or tiled; this is not a production pattern.
        f=Image.new('RGBA',(144,144),Counter(visible.get_flattened_data()).most_common(1)[0][0]);f.paste(visible,(0,96))
        f.save(REVIEW/f'C-layer-{n}-floor.png');wall.save(REVIEW/f'C-layer-{n}-wall.png')
    checks.BODY.update({'temple':[('brass',4)],'cave_crystal':[('dark-rock',6)],
        'crypt':[('dark-masonry',6)],'cave_lava':[('ash',5),('ash',2)],
        'station_hydro':[('planters',4),('planters',5),('overgrowth',4),('overgrowth',5)]})
    legacy_output=io.StringIO()
    with redirect_stdout(legacy_output):report=checks.run()
    (REVIEW/'C16-legacy-check-output.txt').write_text(legacy_output.getvalue())
    for n,stats in report['results'].items():
        stats['checks'].pop('coverage_8px')
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
        # Opposing edges: diagnostic only, because a cobbled/grass yard has material joins.
        stats['repeat_edge_mean_delta_L']={
          'left_right':sum(abs(light(f.getpixel((0,y)))-light(f.getpixel((143,y)))) for y in range(48))/48,
          'top_bottom':sum(abs(light(f.getpixel((x,0)))-light(f.getpixel((x,47)))) for x in range(144))/144}
        master,_=native_master(n.startswith('station_'))
        sheet=Image.new('RGB',(608,328),'#222630');d=ImageDraw.Draw(sheet)
        d.text((8,8),f'{n}: proof 2x / master PNG 1x (equal art pixels)',fill='white')
        sheet.paste(p.resize((288,288),Image.Resampling.NEAREST),(8,32))
        sheet.paste(master.resize((288,288),Image.Resampling.NEAREST),(312,32))
        sheet.save(REVIEW/f'C-op2-{n}.png')
        # Show all floor pixels and both wrap directions at exact scales.
        fs=Image.new('RGB',(896,544),'#222630');d=ImageDraw.Draw(fs)
        d.text((8,8),f'{n}: 144x48 visible floor strip / 3x3 repeats; native and 2x nearest',fill='white')
        fs.paste(repeat,(8,32));fs.paste(repeat.resize((864,288),Image.Resampling.NEAREST),(8,192))
        fs.save(REVIEW/f'C-floor-repeat-{n}.png')
    before=json.loads((REVIEW/'C16-start-hashes.json').read_text())
    frozen=[p for p in before if '/canon/' in p or '/frames/' in p or '/proof/station_' in p or p.endswith('-shadow.png')]
    changed=[p for p in frozen if hashlib.sha256(Path(p).read_bytes()).hexdigest()!=before[p]]
    report['preservation']={'frozen_files_checked':len(frozen),'changed':changed}
    report['failures']=[f'{n}: {k}' for n,s in report['results'].items() for k,v in s['checks'].items() if not v]
    report['numeric_pass']=not report['failures'] and not changed
    report['pass']=report['numeric_pass']
    report['notes']+=['The image-tool sources were read by tolerant mode per registered block (RGB tolerance 8).',
      'Only the 144x48 visible floor strip is repeated; hidden floor backing is not a production texture.',
      'Numeric checks do not replace the owner review; visual review is by the drawing agent.']
    (REVIEW/'C16-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    (REVIEW/'C-operator-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    from review_operator_c import run as contacts
    contacts();grouped_reviews()
    print(json.dumps({'numeric_pass':report['numeric_pass'],'failures':report['failures'],'preservation':report['preservation'],
      'surface_lone_pixels_percent':{n:s['lone_pixels']['surface']['percent'] for n,s in report['results'].items()}},indent=2))

if __name__=='__main__':finish()
