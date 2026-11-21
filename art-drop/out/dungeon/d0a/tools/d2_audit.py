"""Round-two preservation, geometry and saved-pixel evidence. Review writes only."""
import hashlib,json
from itertools import groupby
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,c
from d_layouts import MAPS
from d_review import metric
from review_c9 import lone_pixels
from check_proofs import light,components,mean
from review_critic23 import master_reference
from d2_scene import outline_points


def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()


def board(im,name,station=False):
    im=im.convert('RGBA');w,h=im.size
    master,_=master_reference(station)
    s=Image.new('RGB',(max(6*w+64,1000),max(4*h+90,3*h+332,650)),'#41444b');d=ImageDraw.Draw(s)
    d.text((8,8),name+' | native, 2x, 3x; grey, quarter-grey; registered master art pixels',fill='white')
    x=8
    for z in (1,2,3):
        p=im.resize((w*z,h*z),Image.Resampling.NEAREST);s.paste(p,(x,28),p);x+=p.width+12
    y=3*h+44;g=im.convert('L').convert('RGBA');g.putalpha(im.getchannel('A'));s.paste(g,(8,y),g)
    sq=g.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST);s.paste(sq,(w+24,y),sq)
    s.paste(master,(w+w//4+48,y));s.paste(master.resize((288,288),Image.Resampling.NEAREST),(w+w//4+204,y))
    s.save(REVIEW/f'D-critic2-{name}.png')


def run():
    before=json.loads((REVIEW/'D2-start-hashes.json').read_text());critic=json.loads((REVIEW/'critic-D-2.json').read_text())
    out={'passed_files_unchanged':{},'failed_files_changed':{},'surfaces':{},'changed_art':{},'failures':[]}
    for p,v in critic['files'].items():
        same=sha(BASE/p)==before[p];key='passed_files_unchanged' if v['status']=='pass' else 'failed_files_changed'
        out[key][p]=same if v['status']=='pass' else not same
        if not out[key][p]:out['failures'].append('critic file preservation '+p)
    for p in (BASE/'canon/surfaces').glob('*.png'):
        im=Image.open(p).convert('RGBA');tiles=[]
        for y in range(0,im.height,48):
            for x in range(0,im.width,48):tiles.append(dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))))
        out['surfaces'][p.name]={'tiles':tiles,'max_lone_percent':max(t['percent'] for t in tiles)}
        if out['surfaces'][p.name]['max_lone_percent']>3:out['failures'].append('surface lone '+p.name)
        if p.stem.endswith('floor'):
            small,_=components(im);ls=[light(p) for p in set(im.get_flattened_data())]
            out['surfaces'][p.name].update(small_clusters=small,span=max(ls)-min(ls))
            if small or max(ls)-min(ls)>15:out['failures'].append('floor '+p.name)
        if p.name in [n+'-floor.png' for n in ('cave_rock','cave_crystal','cave_ice','cave_lava')]:
            wrap={'horizontal':im.crop((0,0,1,288)).tobytes()==im.crop((287,0,288,288)).tobytes(),'vertical':im.crop((0,0,288,1)).tobytes()==im.crop((0,287,288,288)).tobytes()}
            out['surfaces'][p.name]['wrap']=wrap
            if not all(wrap.values()):out['failures'].append('wrap '+p.name)
            repeat=Image.new('RGBA',(864,864))
            for y in range(3):
                for x in range(3):repeat.paste(im,(x*288,y*288))
            repeat.save(REVIEW/f'D-critic2-repeat-{p.stem}.png')
    for p in BASE.rglob('*.png'):
        rel=str(p.relative_to(BASE))
        if rel in before and sha(p)==before[rel]:continue
        if p.name=='d0a-review.png':continue
        im=Image.open(p);m=metric(im);out['changed_art'][rel]=m
        if '-grey' not in p.stem and '-squint' not in p.stem and any(m[k] for k in ('soft_alpha','dirty_transparent','off_palette','black')):out['failures'].append('pixels '+rel)
        if p.parent.name in ('props','surfaces'):
            cap=48 if p.parent.name=='props' else 32
            if m['colours']>cap:out['failures'].append('colour cap '+rel)
        if p.parent.name!='frames' and '-grey' not in p.stem:board(im,p.parent.name+'-'+p.stem,'station' in p.stem)
    # Exact outline geometry: each tangent-to-diagonal run group is monotone.
    ring=Image.new('1',(481,457));ps=outline_points(240,228,240,228);ImageDraw.Draw(ring).line(ps+[ps[0]],fill=1,width=1)
    left=[]
    for y in range(228):left.append(min(x for x in range(481) if ring.getpixel((x,y))))
    runs=[len(list(g)) for _,g in groupby(left)]
    # Near the upper tangent, consecutive columns form horizontal rather than vertical runs.
    out['ring']={'outer_left_vertical_runs':runs,'nondecreasing_vertical_runs':all(a<=b for a,b in zip(runs,runs[1:])), 'apex_outline_pixels':sum(ring.getpixel((240,y)) for y in range(4))}
    if not out['ring']['nondecreasing_vertical_runs'] or out['ring']['apex_outline_pixels']!=1:out['failures'].append('ring contour')
    board(ring.convert('RGB'),'ring-outline')
    # Focused visual boards cover every critic location and the preserved mining props.
    crops={
      'hoard-keep':{'heap':(96,768,384,1008),'lock':(336,192,432,288),'secret':(600,672,696,768),'broken':(1224,936,1416,1080)},
      'breach-temple':{'beds':(540,120,780,264),'rift':(394,584,730,776),'approach':(822,390,1110,594)},
      'sanctum-crypt':{'ring':(192,384,480,672),'lock':(1248,384,1344,480),'cloth':(504,228,792,372),'tombs':(288,528,576,672)},
      'cave_rock-plain-21':{'floor':(432,216,768,504),'mine':(1710,846,1806,990),'lock':(1656,1008,1752,1104),'stair':(1296,480,1488,624)},
      'manor-ground':{'wall':(336,312,528,384),'table':(528,744,816,816),'door':(1056,420,1152,516)},
      'station_lab':{'bay':(516,120,804,288),'bench':(144,180,336,276),'door':(408,264,504,360)}}
    squints=Image.new('RGB',(1032,1104),'#222630');d=ImageDraw.Draw(squints);x=y=8;row=0
    for n,regions in crops.items():
        im=Image.open(BASE/f'frames/{n}.png')
        for label,b in regions.items():board(im.crop(b),n+'-'+label,n=='station_lab')
        for z in (1,2,3):im.resize((im.width*z,im.height*z),Image.Resampling.NEAREST).save(REVIEW/f'D-critic2-{n}-{z}x.png')
        g=Image.open(BASE/f'frames/{n}-squint.png')
        if x+g.width>1032:x=8;y+=row+32;row=0
        d.text((x,y),n,fill='white');squints.paste(g,(x,y+20));x+=g.width+20;row=max(row,g.height)
    squints.save(REVIEW/'D-critic2-squints.png')
    proof_floor=Image.open(REVIEW/'C-layer-cave_rock-floor.png').crop((0,96,144,144))
    out['proof_floor_small_clusters']=components(proof_floor)[0]
    if out['proof_floor_small_clusters']:out['failures'].append('proof floor clusters')
    out['manor_face_mean_L']=mean(Image.open(BASE/'canon/surfaces/manor-wall.png').crop((0,48,144,95)))
    out['standard_validation']=json.loads((REVIEW/'D-validation.json').read_text())['pass']
    out['pass']=not out['failures'] and out['standard_validation']
    (REVIEW/'D-critic2-redraw-audit.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'pass':out['pass'],'failures':out['failures'],'protected_passes':len(out['passed_files_unchanged']),'repaired_failed_files':len(out['failed_files_changed']),'ring':out['ring'],'manor_face_mean_L':out['manor_face_mean_L']},indent=2))
if __name__=='__main__':run()
