"""Replay native mode votes, animation and review artifacts for Round 16 A."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
from collections import Counter
import importlib.util,json,hashlib,sys
sys.dont_write_bytecode=True

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('weather',HERE/'r16-A-build.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
report=json.loads((HERE/'r16-A-measurements.json').read_text())
checks=[]

def check(condition,label):
    assert condition,label
    checks.append(label)

def direct_repeat(name,parts,groups,frame):
    side=576;data=[(0,0,0,0)]*(side*side)
    for g in groups:
        entries=[]
        if g['kind']=='track':
            pts=g['points']
            for k in range(g['phase'],len(pts),4):
                x,y=pts[(k+frame)%len(pts)];entries.append((g['particle'],x,y))
        else:
            state=g['states'][(frame+g['phase'])%4]
            if state is not None:
                idx,dx,dy=state;x,y=g['origin'];entries.append((idx,x+dx,y+dy))
        for idx,x,y in entries:
            x%=192;y%=192;pixels=b.particle_pixels(name,parts[idx],idx)
            for tx in range(-1,3):
                for ty in range(-1,3):
                    for px,py,p in pixels:
                        xx=x+192*tx+px;yy=y+192*ty+py
                        if 0<=xx<side and 0<=yy<side:
                            i=yy*side+xx;old=data[i]
                            if (p[3],p[:3])>(old[3],old[:3]):data[i]=p
    im=Image.new('RGBA',(side,side));im.putdata(data);return im

names=list(b.SPECS)
check(sorted(p.name for p in b.DEST.glob('*.png'))==sorted(f'{n}-f{f}.png' for n in names for f in range(4)),'Exact 24-file weather inventory')
native_blocks=0
for name in names:
    parts=[]
    for i,r in enumerate(report['registration'][name]):
        reg=Image.open(HERE/f'r16-A-registered-{name}-{i}.png').convert('RGBA')
        mode=Image.open(HERE/f'r16-A-mode-{name}-{i}.png').convert('RGBA')
        for y in range(mode.height):
            for x in range(mode.width):
                counts=Counter(reg.crop((x*8,y*8,x*8+8,y*8+8)).getdata())
                winner=min(counts,key=lambda p:(-counts[p],p))
                assert winner==mode.getpixel((x,y)),(name,i,x,y)
                native_blocks+=1
        part=Image.open(HERE/f'r16-A-particle-{name}-{i}.png').convert('RGBA')
        replay,removed=b.components(mode,3 if name=='sandstorm' else 2)
        check(part.tobytes()==replay.tobytes() and removed==r['cleanup_removed_indices'],f'{name} particle {i}: exact mode + cleanup replay')
        parts.append(part)
    groups=report['weather'][name]['groups']
    for gi,g in enumerate(groups):
        if g['kind']=='track':
            pts=g['points'];steps=g['steps']
            check(len(pts)%4==0,f'{name} track {gi}: four-phase cohort')
            check(all([(x+dx)%192,(y+dy)%192]==pts[(k+1)%len(pts)] for k,((x,y),(dx,dy)) in enumerate(zip(pts,steps))),f'{name} track {gi}: all native steps continue through wrap')
    frames=[]
    for f in range(4):
        im=Image.open(b.DEST/f'{name}-f{f}.png');frames.append(im)
        check(im.size==(192,192) and im.mode=='RGBA',f'{name} f{f}: dimensions and RGBA')
        values=list(im.getdata());allowed={(0,0,0,0)}
        for i,p in enumerate(parts):allowed.update(v for x,y,v in b.particle_pixels(name,p,i))
        check(set(values)<=allowed,f'{name} f{f}: fixed RGBA palette and zero transparent RGB')
        views=[im.tobytes(),im.transpose(Image.Transpose.TRANSPOSE).tobytes()]
        check(not any(buf==buf[k*768:]+buf[:k*768] for buf in views for k in range(1,192)),f'{name} f{f}: no exact horizontal or vertical subperiod')
        cap=40 if name=='blizzard' else 45 if name=='sandstorm' else 25
        covered=sum(p[3]>0 for p in values)
        check(covered*100/(192*192)<=cap,f'{name} f{f}: coverage cap')
        check(covered==report['weather'][name]['files'][f]['covered_pixels'],f'{name} f{f}: measured coverage replay')
        check(im.tobytes()==b.render(name,parts,groups,f).tobytes(),f'{name} f{f}: particle placement and motion replay')
        check(b.tiled(im,(576,576)).tobytes()==direct_repeat(name,parts,groups,f).tobytes(),f'{name} f{f}: literal 3x3 equals independent unwrapped particle rendering')
        for ref in sorted(b.REF.glob('ref-*.png')):
            stem=f'r16-A-repeat-{name}-f{f}-{ref.stem[4:]}'
            one=Image.open(HERE/f'{stem}-1x.png')
            for scale in (3,4):
                big=Image.open(HERE/f'{stem}-{scale}x.png')
                check(big.tobytes()==one.resize((576*scale,576*scale),b.NN).tobytes(),f'{stem}: exact {scale}x')
    check(b.render(name,parts,groups,4).tobytes()==frames[0].tobytes(),f'{name}: fourth advance equals f0 with no reset')
    check(len({im.tobytes() for im in frames})==4,f'{name}: four distinct frames')
    gif=Image.open(HERE/f'r16-A-{name}.gif')
    check(gif.n_frames==4 and gif.info.get('loop')==0,f'{name}: GIF contains four frames and loops forever')
    gif_palette=gif.copy()
    for f in range(4):
        gif.seek(f);decoded=gif.convert('RGB')
        for ri,refpath in enumerate(sorted(b.REF.glob('ref-*.png'))):
            expected=b.over(Image.open(refpath),frames[f],(288,288)).quantize(palette=gif_palette,dither=Image.Dither.NONE).convert('RGB')
            x=(ri%4)*300+6;y=(ri//4)*320+24
            actual=decoded.crop((x,y,x+288,y+288))
            check(actual.tobytes()==expected.tobytes(),f'{name} GIF f{f} {refpath.stem}: exact shared-palette PNG composite')


before=json.loads((HERE/'r16-A-before-redraw.json').read_text())
for p in b.REF.glob('ref-*.png'):
    rel=str(p.relative_to(b.ROOT.parent))
    check(hashlib.sha256(p.read_bytes()).hexdigest()==before[rel],p.name+': passing reference byte-preserved')
    check(Image.open(p).size==(288,288),p.name+': 6x6 cells at 48px')

# Round 2 scope: all other art and references remain byte-identical.
baseline=json.loads((HERE/'r16-A-before-redraw2.json').read_text())
allowed={f'art-drop/out/weather16/{n}-f{f}.png' for n in ('snow','sandstorm') for f in range(4)}
for rel,sha in baseline.items():
    if rel not in allowed:
        check(hashlib.sha256((b.ROOT.parent/rel).read_bytes()).hexdigest()==sha,rel+': unchanged outside eight failed files')

# Snow's broad-column density was the round-2 technical symptom.
densities={}
for f in range(4):
    im=Image.open(b.DEST/f'snow-f{f}.png');pixels=list(im.getdata())
    cols=[sum(pixels[y*192+x][3]>0 for y in range(192)) for x in range(192)]
    windows=[sum(cols[(x+k)%192] for k in range(32))*100/6144 for x in range(192)]
    densities[f'snow-f{f}']={'32px_column_cover_percent':[round(min(windows),4),round(max(windows),4)]}
    check(max(windows)-min(windows)<1.3,f'snow f{f}: broad-column coverage spread below 1.3 percentage points')
(HERE/'r16-A-redraw2-density.json').write_text(json.dumps(densities,indent=2)+'\n')

# A concise index, comparison and four-frame filmstrip, all at native scale.
overview=Image.new('RGB',(600,672),'#202832');d=ImageDraw.Draw(overview)
for i,name in enumerate(['rain','heavy_rain','snow','blizzard','hail','sandstorm']):
    x=i%2*300;y=i//2*224
    im=Image.open(b.DEST/f'{name}-f0.png');ref=Image.open(b.REF/'ref-fantasy-town.png')
    d.text((x+8,y+6),name,fill='white')
    overview.paste(b.over(ref,im,(288,192)),(x+6,y+26))
b.save(overview,HERE/'r16-A-overview.png')
for name in names:
    sheet=Image.new('RGB',(4*204,230),'#202832');d=ImageDraw.Draw(sheet)
    refname='snow' if name in ['snow','blizzard'] else 'desert-sand' if name=='sandstorm' else 'fantasy-town'
    ref=Image.open(b.REF/f'ref-{refname}.png')
    for f in range(4):
        d.text((f*204+6,6),f'{name} f{f}',fill='white')
        sheet.paste(b.over(ref,Image.open(b.DEST/f'{name}-f{f}.png'),(192,192)),(f*204+6,28))
    b.save(sheet,HERE/f'r16-A-filmstrip-{name}.png')

# All final phases over all seven contexts at 1x; native joins at 3x.
refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(b.REF.glob('ref-*.png'))}
for name in names:
    board=Image.new('RGB',(800,7*220),'#202832');d=ImageDraw.Draw(board)
    close=Image.new('RGB',(4*228,7*244),'#202832');dc=ImageDraw.Draw(close)
    for ri,(refname,ref) in enumerate(refs.items()):
        for f in range(4):
            ov=Image.open(b.DEST/f'{name}-f{f}.png');view=b.over(ref,ov,(288,288))
            d.text((f*200+4,ri*220+2),f'{refname} f{f}',fill='white')
            board.paste(view.crop((0,0,192,192)),(f*200+4,ri*220+22))
            join=b.over(ref,ov,(384,384)).crop((156,156,228,228)).resize((216,216),b.NN)
            dc.text((f*228+4,ri*244+3),f'{refname} f{f} joins 3x',fill='white')
            close.paste(join,(f*228+4,ri*244+22))
    b.save(board,HERE/f'r16-A-all-phases-{name}.png')
    b.save(close,HERE/f'r16-A-joins-{name}-3x.png')
for refname,ref in refs.items():
    sheet=Image.new('RGB',(1464,1192),'#202832');d=ImageDraw.Draw(sheet)
    d.text((8,8),refname+' | native / nearest-neighbour 4x',fill='white')
    sheet.paste(ref,(8,32));sheet.paste(ref.resize((1152,1152),b.NN),(304,32))
    b.save(sheet,HERE/f'r16-A-ref-{refname}.png')

# Quantify the former 96px periodicity and row-lane failure.
metrics={}
for p in sorted(b.DEST.glob('*.png')):
    im=Image.open(p);a=list(im.getdata());m=[v[3]>0 for v in a];n=sum(m)
    yy=sum(m[y*192+x] and m[((y+96)%192)*192+x] for y in range(192) for x in range(192))/n*100
    xx=sum(m[y*192+x] and m[y*192+(x+96)%192] for y in range(192) for x in range(192))/n*100
    rows=[sum(m[y*192:(y+1)*192])*100/192 for y in range(192)]
    metrics[p.name]={'96px_y_overlap_percent':round(yy,4),'96px_x_overlap_percent':round(xx,4),'row_cover_range_percent':[round(min(rows),4),round(max(rows),4)]}
(HERE/'r16-A-redraw-periodicity.json').write_text(json.dumps(metrics,indent=2)+'\n')

summary={'passed':True,'check_count':len(checks),'native_mode_blocks':native_blocks,'source_samples':native_blocks*64,'live_playback':'Unavailable: browser access host unavailable; GIF decoding and frame order checked, not real-time perceived motion','checks':checks,'final_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(b.DEST.glob('*.png'))}}
(HERE/'r16-A-validation.json').write_text(json.dumps(summary,indent=2)+'\n')
html='''<!doctype html><meta charset="utf-8"><title>Round 16 — Part A review</title><style>body{background:#202832;color:#edf2f5;font:16px system-ui;margin:24px}a{color:#bfe5ff}img{image-rendering:pixelated;max-width:100%}article{margin:28px 0}table{border-collapse:collapse}td,th{padding:6px 14px;text-align:left;border-bottom:1px solid #52606a}</style><h1>Round 16 — Part A: critic-r16A-2 redraw</h1><p>Snow keeps its approved flake drawings, redistributed on 82 independent shorter paths. Sandstorm uses ten varied dust-band drawings selected from three new image-tool variants. All 16 passing weather PNGs and seven references are unchanged.</p><p>Live playback could not be inspected: browser access host unavailable. Decoded GIF phases and mathematical motion closure are checked.</p><p>Actual four-frame GIFs over all seven 48 px/cell references. PNG files are authoritative for color and alpha; GIFs use a shared 256-color review palette.</p>'''
html+='<img src="r16-A-overview.png" alt="Native scale weather comparison">'
for name in names:
    html+=f'<article><h2>{name}</h2><img src="r16-A-{name}.gif" alt="{name} loop"><p><a href="r16-A-filmstrip-{name}.png">Four native frames</a> · <a href="r16-A-all-phases-{name}.png">All four phases / seven references</a> · <a href="r16-A-joins-{name}-3x.png">3x joins</a> · <a href="r16-A-file-{name}-f0.png">1x / 4x sheet</a></p></article>'
html+='<p><a href="r16-A-measurements.json">Per-file measurements, offsets and particle placements</a> · <a href="r16-A-validation.json">Validation</a></p>'
(HERE/'r16-A-review.html').write_text(html)
print(json.dumps({k:v for k,v in summary.items() if k not in ['checks','final_sha256']},indent=2))
