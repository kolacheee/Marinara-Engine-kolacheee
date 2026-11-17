"""Replay the scoped critic repair: drawn sources, registration and compositing only."""
from pathlib import Path
from collections import Counter
import importlib.util, json, sys
from PIL import Image, ImageFilter

REV=Path(__file__).resolve().parent
OUT=REV.parent/'out/city17'
sp=importlib.util.spec_from_file_location('r17b_process',REV/'r17-B-process.py')
p=importlib.util.module_from_spec(sp);sp.loader.exec_module(p)

def run():
    records=json.loads((REV/'r17-B-critic1-generation.json').read_text())
    failed=set(json.loads((REV/'critic-r17B-1.json').read_text())['failed'])
    processing=[]
    fill=None
    for r in records:
        im,rec=p.reduce(r)
        if r['selected'] and r['output'].startswith('roof-flat'):
            # Remove isolated subpixel dark flecks inside the drawn terrace.
            # A real joint continues into a dark neighbour and is retained.
            data=list(im.get_flattened_data());clean=data[:];w,h=im.size
            dark={(*v,255) for v in (p.RED[0],p.BASE[1])}
            tile={(*v,255) for v in p.RED[2:]}
            for y in range(18,h-24):
                for x in range(8,w-8):
                    i=y*w+x
                    ns=[data[(y+dy)*w+x+dx] for dy in (-1,0,1) for dx in (-1,0,1) if dx or dy]
                    if data[i] in dark and all(v in tile for v in ns):
                        clean[i]=Counter(ns).most_common(1)[0][0]
            im.putdata(clean)
            rec['terrace_cleanup']='isolated dark flecks replaced by neighbouring tile mode; continuous joints retained'
        if r['selected'] and r['output']=='roof-fill-w1':
            # The sixth source course was clipped just before its overlap lip.
            # Wrap the drawn half-staggered second-course lip onto that edge.
            im.paste(im.crop((0,15,48,16)),(0,47))
            rec['wrap']={'donor':[0,15,48,16],'destination':[0,47],
                         'reason':'complete final overlap, all six courses retained'}
            fill=im.copy()
        if r['selected'] and r['output']=='roof-valley':
            assert fill is not None
            # The painted lead channel determines the two receiving planes.
            # Preserve its cut tile lips; composite complete drawn fill onto
            # the far parts of both planes to match their neighbouring tiles.
            lead=Image.new('L',im.size)
            lead.putdata([255 if px[:3] in (p.BASE[7],p.BASE[15],p.BASE[16]) else 0
                          for px in im.get_flattened_data()])
            assert lead.getbbox(), 'painted valley lead must survive mode reduction'
            band=lead.filter(ImageFilter.MaxFilter(5))
            blocked=list(band.get_flattened_data());region=set();queue=[(0,0)]
            while queue:
                x,y=queue.pop();i=y*48+x
                if not (0<=x<48 and 0<=y<48) or i in region or blocked[i]:continue
                region.add(i);queue.extend(((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
            mask=Image.new('L',im.size);mask.putdata([255 if i in region else 0 for i in range(2304)])
            assembled=fill.copy();assembled.paste(fill.transpose(Image.Transpose.ROTATE_270),(0,0),mask)
            assembled.paste(im,(0,0),band);im=assembled
            p.save(band,REV/'r17-B-critic1-valley-painted-channel-mask.png')
            p.save(mask,REV/'r17-B-critic1-valley-east-plane-mask.png')
            rec['assembly']='drawn gutter/lips retained; connected source-defined east plane receives rotated full fill; south plane receives full fill'
        if r['selected'] and r['output']=='roof-hip-end':
            assert fill is not None
            # Only the open incoming edge joins the wing. Keep the ridge entry
            # and complete hip drawing; use native fill paint at its two lips.
            for y0,y1 in ((0,44),(52,96)):
                for y in range(y0,y1):im.paste(fill.crop((0,y%48,2,y%48+1)),(0,y))
            rec['assembly']='two incoming-edge columns from fill, ridge entry retained at y44..51; complete drawn 48x96 terminal hip'
        if r['selected'] and r['output']=='firewall-w0':
            # Quiet the source limestone without inventing masonry: material
            # remap only; preserve its mortar and four independent courses.
            data=list(im.get_flattened_data())
            for y in range(4,44):
                for x in range(16):
                    a=data[y*16+x]
                    c=p.BASE[9] if .2126*a[0]+.7152*a[1]+.0722*a[2]<155 else p.BASE[10]
                    data[y*16+x]=(*c,255)
            im.putdata(data)
            # A complete drawn mortar course provides the vertical wrap join.
            im.paste(im.crop((0,13,16,14)),(0,43))
            data=list(im.get_flattened_data())
            pending={y*16+x for y in range(4,44) for x in range(16) if data[y*16+x][:3]==p.BASE[9]}
            while pending:
                seed=pending.pop();group=[seed];queue=[seed]
                while queue:
                    i=queue.pop();y,x=divmod(i,16)
                    for xx,yy in (((x-1)%16,y),((x+1)%16,y),(x,4+(y-5)%40),(x,4+(y-3)%40)):
                        j=yy*16+xx
                        if j in pending:pending.remove(j);group.append(j);queue.append(j)
                if len(group)<9:
                    for i in group:data[i]=(*p.BASE[10],255)
            im.putdata(data)
            rec['body_contract']=[0,4,16,44]
        # Record every post-mode palette/outline/wrap adjustment for replay.
        mode=Image.open(REV/f"r17-B-mode-{r['id']}.png").convert('RGBA')
        rec['cleanup']=[[i%im.width,i//im.width,list(a),list(b)] for i,(a,b) in
            enumerate(zip(mode.get_flattened_data(),im.get_flattened_data())) if a!=b]
        p.save(im,REV/f"r17-B-clean-{r['id']}.png",Cleanup=rec['cleanup'])
        processing.append(rec)
        if r['selected']:
            names=[(r['output'],im)]
            if not r.get('no_colours'):names += [(r['output']+f'-c{c}',p.colour(im,c)) for c in range(3)]
            for name,a in names:
                assert name in failed,('attempted edit of passing file',name)
                p.save(a,OUT/(name+'.png'))
        print(r['id'],'selected' if r['selected'] else 'alternative')
    (REV/'r17-B-critic1-processing.json').write_text(json.dumps(processing,indent=2)+'\n')
    # Keep original alternatives and prompts while marking the replacement
    # sources. The original w1 shadow remains selected and unchanged.
    old=json.loads((REV/'r17-B-generation.json').read_text())
    old=[r for r in old if not r['id'].startswith('critic1-')]
    replaced={r['output'] for r in records if r['selected']}
    for r in old:
        if r['output'] in replaced:r['selected']=False
    (REV/'r17-B-generation.json').write_text(json.dumps(old+records,indent=2)+'\n')

if __name__=='__main__':run()
