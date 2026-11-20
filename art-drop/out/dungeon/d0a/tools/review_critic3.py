"""Review-only sheets and preservation proof for the five critic-3 failures."""
import hashlib,json
from collections import defaultdict
from PIL import Image, ImageDraw
from draw_style_samples import CANON,ROOT,c
from build_style_guide import text
from redraw_critic3 import FAILED
R=ROOT/'art-drop/review-d0a'
master=Image.open(ROOT/'art-drop/dungeon/reference/master-interiors-mock.png')
sheet=Image.new('RGB',(864,816),c('void-mass',1));d=ImageDraw.Draw(sheet)
repeats={}
for i,n in enumerate(FAILED):
    im=Image.open(CANON/'swatches'/f'{n}.png').convert('RGB');y=i*204
    ref=(Image.open(CANON/'crops/overworld-grass.png').crop((0,0,48,48)) if n=='building-yard'
         else master.crop((1944,2112,1992,2160)))
    text(d,(8,y+4),n+' / 1x / source / 2x / 3x / source 3x / grey 3x / squint')
    for pic,xy in [(im,(8,y+30)),(ref,(64,y+30)),
      (im.resize((96,96),Image.Resampling.NEAREST),(128,y+30)),
      (im.resize((144,144),Image.Resampling.NEAREST),(240,y+30)),
      (ref.resize((144,144),Image.Resampling.NEAREST),(400,y+30)),
      (im.convert('L').resize((144,144),Image.Resampling.NEAREST),(560,y+30)),
      (im.convert('L').resize((12,12),Image.Resampling.NEAREST),(720,y+30))]:sheet.paste(pic,xy)
    # Exact translated connected-component shapes, including colour.
    # Trivial straight runs are also recorded, without claiming they are motifs.
    a=im.load();seen=set();forms=defaultdict(list)
    for yy in range(48):
      for xx in range(48):
        if (xx,yy) in seen:continue
        todo=[(xx,yy)];seen.add((xx,yy));group=[]
        while todo:
          x,y0=todo.pop();group.append((x,y0))
          for p in [(x+1,y0),(x-1,y0),(x,y0+1),(x,y0-1)]:
            if 0<=p[0]<48 and 0<=p[1]<48 and p not in seen and a[p]==a[xx,yy]:
              seen.add(p);todo.append(p)
        bx=min(p[0] for p in group);by=min(p[1] for p in group)
        shape=tuple(sorted((x-bx,y0-by) for x,y0 in group))
        if len(group)>=3:forms[(a[xx,yy],shape)].append((bx,by))
    repeats[n]=[{'rgb':rgb,'shape':shape,'origins':origins} for (rgb,shape),origins in forms.items() if len(origins)>1]
sheet.save(R/'B-critic3-materials.png')
sheet.save(R/'B-material-overview.png')
guide=Image.open(CANON/'style-guide.png')
for name,box in [('top',(0,0,1728,760)),('studies',(0,760,1728,1016)),('do-dont',(0,1240,1728,1680))]:
    guide.crop(box).save(R/f'B-final-guide-{name}-1x.png')
before=json.loads((R/'B-critic3-before-hashes.json').read_text())
root=CANON.parent
changed=[name for name,h in before.items() if not (root/name).exists() or hashlib.sha256((root/name).read_bytes()).hexdigest()!=h]
critic=json.loads((R/'critic-B-3.json').read_text())
passing=[n for n,info in critic['files'].items() if info['status']=='pass']
violations=[n for n in passing if n in changed]
report={'changed_existing_files':changed,'passing_files_checked':len(passing),
        'passing_files_changed':violations,'repeated_components':repeats}
(R/'B-critic3-preservation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
assert not violations
assert not any(repeats.values())
