"""Saved-art audit: exact mode replay, protected exports, joins and receivers."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent;A=R.parent;ROOT=A.parent;O=A/'out/city17';NN=Image.Resampling.NEAREST
def module(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('c',O/'compose.py');p=module('p',R/'r17-C-critic2-process.py');old=module('old',R/'r17-C-critic1-process.py');review=module('review',R/'r17-C-review.py')
def rgba(path):return Image.open(path).convert('RGBA')
def eq(a,b):return a.size==b.size and a.tobytes()==b.tobytes()
checks=[];fail=[]
def check(ok,label):
    checks.append(label)
    if not ok:fail.append(label)
before=json.loads((R/'r17-C-critic2-before.json').read_text());critic=json.loads((R/'critic-r17C-2.json').read_text())
records=json.loads((R/'r17-C-critic2-generation.json').read_text());processing=json.loads((R/'r17-C-critic2-processing.json').read_text())
names=review.exports();measurements=[]
palette=set(old.PAL)|set(old.BASE)|set(old.GROUND_PAL)|set(old.GREEN_PAL)|{(120,121,108),(146,143,125),(162,150,122)}
for name in names:
    a=rgba(O/(name+'.png'));w,h=a.size;v=list(a.get_flattened_data())
    check(all(q[3] in (0,255) for q in v),name+': hard alpha')
    check(all(q==(0,0,0,0) for q in v if not q[3]),name+': hidden RGB zero')
    check(all(q[:3] in palette for q in v if q[3]),name+': locked palette')
    if name.startswith(('back-','side-ground','side-storey')) or name.endswith('-storey'):
        check(eq(a.crop((0,0,w,1)),old.course(w)) and eq(a.crop((0,47,w,48)),old.course(w)),name+': courses0/47')
    if not name.startswith(('yard-','fence-','mud-edge')):check(a.getchannel('A').getextrema()==(255,255),name+': square opaque coverage')
    unseen={i for i,q in enumerate(v) if q[3]};sizes=[]
    while unseen:
        stack=[unseen.pop()];count=0
        while stack:
            i=stack.pop();count+=1;x,y=i%w,i//w
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    j=yy*w+xx
                    if j in unseen:unseen.remove(j);stack.append(j)
        sizes.append(count)
    check(not sizes or min(sizes)>2,name+': no detached alpha specks')
    sheet=rgba(R/f'r17-C-file-{name}.png');mounted=review.mount(name,a)
    check(eq(sheet.crop((12,199-h,12+w,199)),mounted),name+': literal1x beside house')
    x=12+w+144+20;y=55+max(h,144)*4-h*4
    check(eq(sheet.crop((x,y,x+w*4,y+h*4)),mounted.resize((w*4,h*4),NN)),name+': literal4x beside house')
    check((R/f'r17-C-seam-{name}-1x.png').exists() and (R/f'r17-C-seam-{name}-4x.png').exists(),name+': self/variant seam sheets')
    measurements.append(dict(file=name,size=[w,h],colours=len({q[:3] for q in v if q[3]}),alpha_components=sorted(sizes)))

samples=0
for rec in processing:
    name=rec['id'];w,h=rec['size'];reg=rgba(R/f'r17-C-critic2-registered-{name}.png');v=list(reg.get_flattened_data());sw=w*8;mode=[]
    check(hashlib.sha256((R/rec['source']).read_bytes()).hexdigest()==rec['source_sha256'],name+': source hash')
    for y in range(h):
        for x in range(w):
            votes=Counter(q for yy in range(8) for q in v[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);mode.append(min(votes,key=lambda q:(-votes[q],q)))
    samples+=w*h*64;im=Image.new('RGBA',(w,h));im.putdata(mode)
    check(eq(im,rgba(R/f'r17-C-critic2-mode-{name}.png')),name+': exact64-sample mode')
    for x,y,source,target in rec['cleanup']:
        check(im.getpixel((x,y))==tuple(source),name+f': cleanup source{x},{y}');im.putpixel((x,y),tuple(target))
    check(eq(im,rgba(R/f'r17-C-critic2-clean-{name}.png')),name+': cleanup replay')
    selected=next(q for q in records if q['id']==name)['selected']
    if selected:
        path=O/'street-junction-turn.png' if name.startswith('paving') else R/f'r17-C-critic2-connected-{name[:-2]}.png'
        check(eq(im,rgba(path)),name+': selected paint')

routes={};roofs={};shadows={}
layouts={'pilot':c.pilot_c(),**c.c_layouts()}
for name,layout in layouts.items():
    im,_=c.c_render(layout);stem='pilot' if name=='pilot' else 'critic-'+name
    occupied=Image.new('L',im.size);roofmask=Image.new('L',im.size)
    for b in layout['lots']:
        a,_=c.build_c(b['spec']);x,y=b['x'],b['base']-a.height;mask=Image.new('L',im.size);mask.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,mask)
        floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])));rh=a.height-floors*48
        mask=Image.new('L',im.size);mask.paste(a.getchannel('A').crop((0,0,a.width,rh)),(x,y));roofmask=ImageChops.lighter(roofmask,mask)
    if layout.get('joined_l'):
        j=layout['joined_l'];a=c.joined_l_roof(j.get('colour',0));mask=Image.new('L',im.size);mask.paste(a.getchannel('A'),(j['x'],j['y']));roofmask=ImageChops.lighter(roofmask,mask);occupied=ImageChops.lighter(occupied,mask)
    for prop in layout['props']:
        if prop['file']=='pilot-person':continue
        a=c.asset(prop['file']) if not prop.get('path') else rgba(A/prop['path']);mask=Image.new('L',im.size);mask.paste(a.getchannel('A'),(prop['x'],prop['base']-a.height));occupied=ImageChops.lighter(occupied,mask)
    for scale in (1,3):
        enlarged=im.resize((im.width*scale,im.height*scale),NN);check(eq(enlarged,rgba(R/f'r17-C-{stem}-{scale}x.png')),name+f': exact{scale}x scene')
        sheet=rgba(R/f'r17-C-critic-{name}-comparison-{scale}x.png');check(eq(sheet.crop((12,34,12+enlarged.width,34+enlarged.height)),enlarged),name+f': comparison{scale}x')
        y=12
        for ref in ['round15-street','current-town']:
            a=rgba(A/f'reference/r17/{ref}.png');x=enlarged.width+36;check(eq(sheet.crop((x,y+22,x+a.width,y+22+a.height)),a),name+': literal reference '+ref);y+=a.height+40
    check(eq(im.convert('L').convert('RGBA'),rgba(R/f'r17-C-{stem}-squint-1x.png')),name+': greyscale squint')
    routes[name]=[];roofs[name]=[]
    for x,y,w,h in layout.get('clear_routes',[]):
        n=sum(q>0 for q in occupied.crop((x,y,x+w,y+h)).get_flattened_data());check(n==0,name+': clear route'+str([x,y,w,h]));routes[name].append(dict(rect=[x,y,w,h],blocked=n))
    for x,y,w,h in layout.get('required_roofs',[]):
        n=sum(q<255 for q in roofmask.crop((x,y,x+w,y+h)).get_flattened_data());check(n==0,name+': complete roofs'+str([x,y,w,h]));roofs[name].append(dict(rect=[x,y,w,h],uncovered=n))
    shade,receivers=c.c_shadow_layer(layout);alpha=shade.getchannel('A')
    check(alpha.getextrema()[1]<=112,name+': shadow opacity/no double darkening')
    check(not ImageChops.multiply(alpha,occupied).getbbox(),name+': no shadows on roofs/props')
    shadows[name]=[]
    for rec in receivers:
        x,y,w,h=rec['receiver'];box=(max(0,x),max(0,y),min(im.width,x+w),min(im.height,y+h))
        if box[2]<=box[0] or box[3]<=box[1]:continue
        n=sum(q>0 for q in alpha.crop(box).get_flattened_data());shadows[name].append(dict(**rec,visible_ground_pixels=n))
    check(any(q['visible_ground_pixels'] for q in shadows[name] if q['side']=='south'),name+': visible south shadow')
    check(any(q['visible_ground_pixels'] for q in shadows[name] if q['side']=='east'),name+': visible east shadow')

m=layouts['market'];im,_=c.c_render(m);ground=c.c_ground(tuple(m['size']),m['roads']);box=(816,144,828,240)
changed=sum(a!=b for a,b in zip(im.crop(box).get_flattened_data(),ground.crop(box).get_flattened_data()))
check(changed==1152,'regression: all1152 exposed market east pixels shadowed')
for node in ['corner-outer-L','corner-inner','tee-end','corner-outer-R','deadend-cap']:
    whole=c.c_connected_roof(node);wing,_=c.build_c(dict(view='wing',node=node));body,_=c.build_c(dict(view='node',node=node,floors=2,connected=True))
    joined=Image.new('RGBA',whole.size);joined.paste(wing,(0,0));joined.paste(body.crop((0,0,body.width,96)),(0,96))
    check(eq(joined,whole),node+': consecutive rows; zero reset or internal border')
    for period in [32,48,64]:check(not eq(wing.crop((0,0,96,96-period)),wing.crop((0,period,96,96))),node+': no old repeat period'+str(period))
turn=rgba(O/'street-junction-turn.png');field=rgba(O/'street-junction.png')
mean=lambda im:sum(im.convert('L').get_flattened_data())/(im.width*im.height)
check(abs(mean(turn)-mean(field))<4,'turn value matches junction within4 luma')
for scale in [1,4]:check(eq(rgba(R/f'r17-C-repeat-street-junction-turn-{scale}x.png'),c.repeat(turn,(144,144)).resize((144*scale,144*scale),NN)),'full turn literal repeat'+str(scale))

protected=0;changes=[]
for rel,digest in before.items():
    path=ROOT/rel
    if rel in ['art-drop/NOTES.md','art-drop/out/city17/compose.py','art-drop/out/city17/street-junction-turn.png'] or (path.parent==R and path.name.startswith('r17-C-')):continue
    ok=path.exists() and hashlib.sha256(path.read_bytes()).hexdigest()==digest
    check(ok,'protected '+rel);protected+=int(ok)
    if not ok:changes.append(rel)
passing=[n for n,v in critic['files'].items() if v['status']=='pass']
for n in passing:
    rel='art-drop/out/city17/'+n+'.png';check(hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()==before[rel],n+': passing PNG unchanged')
for n in critic['failed']:
    rel='art-drop/out/city17/'+(n if n=='compose.py' else n+'.png');check(hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()!=before[rel],n+': failed file changed')
report=dict(status='PASS' if not fail else 'FAIL',checks=len(checks),failures=fail,exports=len(names),new_image_drawings=len(records),selected_drawings=sum(q['selected'] for q in records),mode_samples_replayed=samples,passing_files_unchanged=len(passing),protected_files_unchanged=protected,protected_changes=changes,market_east_regression_pixels=changed,turn_mean_luma=mean(turn),junction_mean_luma=mean(field),route_clearance=routes,roof_coverage=roofs,shadow_receivers=shadows,measurements=measurements,limitations=['Saved-art self-review only, not independent or in-engine approval.','Part D civic proxies defer final skyline/gate and six distinct stalls.'])
(R/'r17-C-critic2-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['measurements','route_clearance','roof_coverage','shadow_receivers']},indent=2))
raise SystemExit(bool(fail))
