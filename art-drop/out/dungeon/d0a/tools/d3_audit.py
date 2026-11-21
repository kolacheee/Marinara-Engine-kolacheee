"""Critic-three saved-pixel checks and review-only comparisons."""
import hashlib,json
from itertools import groupby
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW
from d_review import metric
from review_c9 import lone_pixels
from check_proofs import components,light,mean
from review_critic23 import master_reference
from d_layouts import MAPS


def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()


def board(im,name):
    im=im.convert('RGBA');w,h=im.size
    master,_=master_reference(False)
    sheet=Image.new('RGB',(max(6*w+64,800),max(4*h+80,3*h+228)),'#343943');d=ImageDraw.Draw(sheet)
    d.text((8,8),name+' | 1x / 2x / 3x nearest; grey / quarter-grey / master art pixels',fill='white')
    x=8
    for z in (1,2,3):
        pic=im.resize((w*z,h*z),Image.Resampling.NEAREST);sheet.paste(pic,(x,28),pic);x+=pic.width+12
    grey=im.convert('L').convert('RGBA');grey.putalpha(im.getchannel('A'));y=3*h+44
    sheet.paste(grey,(8,y),grey);sq=grey.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST);sheet.paste(sq,(w+24,y),sq);sheet.paste(master,(w+w//4+40,y))
    sheet.save(REVIEW/f'D-critic3-{name}.png')


def run():
    before=json.loads((REVIEW/'D3-start-hashes.json').read_text());critic=json.loads((REVIEW/'critic-D-3.json').read_text())
    report={'passing_files_unchanged':{},'failed_files_changed':{},'surfaces':{},'frames':{},'failures':[]}
    for p,v in critic['files'].items():
        same=sha(BASE/p)==before[p];key='passing_files_unchanged' if v['status']=='pass' else 'failed_files_changed'
        report[key][p]=same if v['status']=='pass' else not same
        if not report[key][p]:report['failures'].append(key+': '+p)
    # Allow only critic-failed art, refreshed contact sheet, notes and new tools.
    allowed={p for p,v in critic['files'].items() if v['status']=='fail'}|{'NOTES.md','d0a-review.png'}
    report['unexpected_changed_existing']=[p for p,h in before.items() if not p.startswith('tools/__pycache__/') and sha(BASE/p)!=h and p not in allowed]
    if report['unexpected_changed_existing']:report['failures'].append('unexpected existing edits')
    for p in sorted((BASE/'canon/surfaces').glob('*.png')):
        im=Image.open(p).convert('RGBA');m=metric(im);ts=[]
        for y in range(0,im.height,48):
            for x in range(0,im.width,48):ts.append(dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))))
        m.update(tiles=ts,max_lone_percent=max(t['percent'] for t in ts));report['surfaces'][p.name]=m
        if m['max_lone_percent']>3:report['failures'].append('lone '+p.name)
        if p.stem.endswith('-floor'):
            small,_=components(im);ls=list(map(light,set(im.get_flattened_data())))
            m.update(small_components=small,floor_span_L=max(ls)-min(ls))
            if small or m['floor_span_L']>15:report['failures'].append('floor '+p.name)
        if m['colours']>32 or any(m[k] for k in ('soft_alpha','dirty_transparent','off_palette','black')):report['failures'].append('surface pixels '+p.name)
    for n in ('cave_rock','cave_crystal','cave_ice','cave_lava'):
        im=Image.open(BASE/f'canon/surfaces/{n}-floor.png');board(im,'floor-'+n)
        repeat=Image.new('RGBA',(864,864))
        for y in range(3):
            for x in range(3):repeat.paste(im,(x*288,y*288))
        repeat.save(REVIEW/f'D-critic3-repeat-{n}-1x.png');repeat.resize((2592,2592),Image.Resampling.NEAREST).save(REVIEW/f'D-critic3-repeat-{n}-3x.png')
        # Boundary context contains 24 real pixels on either side. This catches
        # truncated features which equal first/last-column tests failed to catch.
        seam_h=repeat.crop((264,144,312,432));seam_v=repeat.crop((144,264,432,312))
        board(seam_h,'seam-x-'+n);board(seam_v,'seam-y-'+n)
    for n in ('d-chest','d-chest-open'):
        im=Image.open(BASE/f'canon/props/{n}.png');board(im,'props-'+n)
        m=metric(im);report[n]=m
        if m['colours']>48 or any(m[k] for k in ('soft_alpha','dirty_transparent','off_palette','black')):report['failures'].append(n)
    board(Image.open(BASE/'canon/surfaces/manor-wall.png'),'manor-wall')
    opened=Image.open(BASE/'canon/props/d-chest-open.png').convert('RGBA')
    report['open_lid_connected_rows']={str(y):sum(opened.getpixel((x,y))[3]>0 for x in range(48)) for y in range(19,31)}
    if not all(report['open_lid_connected_rows'].values()):report['failures'].append('floating lid')
    regions={
      'hoard-keep':{'heap':(96,768,384,1008),'brazier':(300,912,372,984),'broken':(1224,936,1416,1080),'curve':(768,900,864,996),'loot':(1080,174,1128,222)},
      'breach-temple':{'loot':(540,264,624,336)},
      'sanctum-crypt':{'altar':(1272,492,1368,588),'loot':(792,366,888,414)},
      'cave_rock-plain-21':{'ground1':(264,216,816,408),'ground2':(672,600,1152,816),'ground3':(1008,960,1392,1152),'mining':(1710,846,1806,990),'loot':(1440,534,1512,630)},
      'manor-ground':{'plaster':(336,312,528,384),'loot':(1416,894,1464,942)},
      'station_lab':{'loot':(360,504,624,552)}}
    squints=Image.new('RGB',(1104,1104),'#343943');d=ImageDraw.Draw(squints);x=y=8;rh=0
    for n in MAPS:
        im=Image.open(BASE/f'frames/{n}.png').convert('RGBA');g=Image.open(BASE/f'frames/{n}-grey.png').convert('RGBA')
        m=metric(im);m['companions_exact']=all([
          Image.open(BASE/f'frames/{n}-2x.png').convert('RGBA').tobytes()==im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST).tobytes(),
          g.tobytes()==im.convert('L').convert('RGBA').tobytes(),
          Image.open(BASE/f'frames/{n}-squint.png').convert('RGBA').tobytes()==g.resize((im.width//4,im.height//4),Image.Resampling.NEAREST).tobytes()])
        report['frames'][n]=m
        if not m['companions_exact']:report['failures'].append('companions '+n)
        for z in (1,2,3):im.resize((im.width*z,im.height*z),Image.Resampling.NEAREST).save(REVIEW/f'D-critic3-{n}-{z}x.png')
        for label,b in regions[n].items():board(im.crop(b),n+'-'+label)
        sq=Image.open(BASE/f'frames/{n}-squint.png')
        if x+sq.width>1104:x=8;y+=rh+32;rh=0
        d.text((x,y),n,fill='white');squints.paste(sq,(x,y+20));x+=sq.width+20;rh=max(rh,sq.height)
    squints.save(REVIEW/'D-critic3-squints.png')
    mask=Image.open(REVIEW/'D-hoard-keep-floor-mask.png');xs=[]
    for y in range(888,1033):xs.append(max(x for x in range(700,861) if mask.getpixel((x,y))))
    runs=[len(list(g)) for _,g in groupby(xs)];report['hoard_curve']={'rightmost_floor_x_by_row':xs,'vertical_runs':runs,'nonincreasing_runs':all(a>=b for a,b in zip(runs,runs[1:]))}
    if not report['hoard_curve']['nonincreasing_runs']:report['failures'].append('curve runs')
    report['map_surface_tiles']={}
    for n in MAPS:
        im=Image.open(REVIEW/f'D-{n}-surface.png').convert('RGBA');tiles=[]
        for y in range(0,im.height,48):
            for x in range(0,im.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))))
        maximum=max(t['percent'] for t in tiles)
        report['map_surface_tiles'][n]={'tiles':tiles,'max_lone_percent':maximum}
        if maximum>3:report['failures'].append('map surface lone '+n)
    report['manor_face_mean_L']=mean(Image.open(BASE/'canon/surfaces/manor-wall.png').crop((0,48,144,95)))
    report['standard_checks']=json.loads((REVIEW/'D-validation.json').read_text())['pass']
    report['pass']=not report['failures'] and report['standard_checks']
    (REVIEW/'D-critic3-redraw-audit.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k in ('pass','failures','unexpected_changed_existing','manor_face_mean_L','open_lid_connected_rows')},indent=2))
    print('Preserved',len(report['passing_files_unchanged']),'repaired',len(report['failed_files_changed']))

if __name__=='__main__':run()
