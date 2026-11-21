"""Register the new paintings and derive their native course/roof assemblies.
Passing PNGs are never opened for writing. Every production pixel is painted,
palette-remapped, wrapped or copied from a registered source.
"""
from pathlib import Path
import importlib.util,json,hashlib
from PIL import Image,ImageChops,ImageDraw
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic1-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
critic=json.loads((R/'critic-r17C7-1.json').read_text())['files'];ops=[]
def read(n):return Image.open(O/(n+'.png')).convert('RGBA')
def save(n,a,donors,op):
    assert critic.get(n,{}).get('status')!='pass',n
    a.putdata([q if q[3] else (0,0,0,0) for q in a.get_flattened_data()]);a.save(O/(n+'.png'))
    ops.append(dict(file=n+'.png',size=list(a.size),donors=donors,operation=op))
def reg(src,size,name,**kw):return p.register(f'r17-C7-critic1-source-{src}.png',size,name,**kw)
def course(a):
    d=read('ground-shop-w2-c0')
    for y in [0,47]:
        for x in range(a.width):a.putpixel((x,y),d.getpixel((x%96,y)))
    return a
def wrap(a):
    a=a.copy();a.paste(a.crop((0,0,a.width,1)),(0,a.height-1));a.paste(a.crop((0,0,1,a.height)),(a.width-1,0));return a
def roof_tone(a,tone):
    ramp=p.old.SLATE if tone=='slate' else p.old.BROWN
    out=a.copy();data=[]
    for c in a.get_flattened_data():
        r,g,b,al=c
        if al and r>g*1.35 and r>b*1.5:
            k=min(range(6),key=lambda k:sum((c[j]-p.old.RED[k][j])**2 for j in range(3)));c=(*ramp[k],255)
        data.append(c)
    out.putdata(data);return out

def run():
    # Whole, independently drawn 2/3-cell roof depths; never delete a middle band.
    for w in [1,2,3]:
        for d in [2,3]:
            src=f'roof-w{w}-d{d}'+('-b' if w>1 else '')
            a=reg(src,(48*w,48*d),src)
            save(f'roof-a-w{w}-d{d}-c7',a,[src],'complete painted depth registered and mode reduced')
    for d in [2,3]:
        a=read(f'roof-a-w3-d{d}-c7')
        for hand,x in [('left',0),('right',96)]:
            save(f'roof-hip-{hand}-d{d}-c7',a.crop((x,0,x+48,d*48)),[f'roof-a-w3-d{d}-c7'],'complete handed hip of separately drawn depth, native crop')
    cap=read('roof-a-w3-d3-c7');fill=wrap(cap.crop((48,80,96,128)))
    save('roof-fill-c7',fill,['roof-a-w3-d3-c7'],'native interior tile wrap')
    # New whole houses supply matching ground/storey/roof courses, including
    # separately painted west/east light and genuinely different arrangements.
    sources={
      'a':('corner-a',[0,580,995,1454]),
      'b':('corner-b',[0,380,720,1100]),
      'west':('side-west',[0,763,1156,1685]),
      'east':('side-east',[0,736,1076,1558]),
      'north':('back-north',[0,530,866,1265]),
    }
    for family,(src,ys) in sources.items():
        for w in [1,2]:
            a=reg(src,(w*48,192),f'house-{family}-w{w}',ycuts=(ys,[0,96,144,192]))
            save(f'house-{family}-w{w}-c7r1',a,[src],'whole-house source registration')
            for kind,box in [('ground',(0,144,w*48,192)),('storey',(0,96,w*48,144)),('roof',(0,0,w*48,96))]:
                b=a.crop(box);b=course(b) if kind!='roof' else b
                save(f'{kind}-{family}-w{w}-c7r1',b,[f'house-{family}-w{w}-c7r1'],'painted structural floor extraction; shared rows0/47' if kind!='roof' else 'complete roof extraction')
    # Existing passing 144px course modules stay byte-identical.
    large=reg('corner-a',(144,192),'corner-large',ycuts=([0,580,995,1454],[0,96,144,192]))
    corner=Image.new('RGBA',(144,240));corner.alpha_composite(large.crop((0,0,144,144)),(0,0));corner.alpha_composite(large.crop((0,96,144,192)),(0,144))
    save('corner-house-c7',corner,['corner-a'],'modest roof and three occupied courses; no repeated oriel')
    # The southeast wing is a COMPLETE one-storey handed house, never half a gable.
    wing=Image.new('RGBA',(48,144));wing.alpha_composite(read('roof-west-w1-c7r1'));wing.alpha_composite(read('ground-west-w1-c7r1'),(0,96))
    save('block-se-wing-c7',roof_tone(wing,'brown'),['roof-west-w1-c7r1','ground-west-w1-c7r1'],'complete native west-facing return and ground door')
    inn=reg('inn-west-b',(96,240),'inn-west',ycuts=([0,682,970,1297,1928],[0,96,144,192,240]))
    save('inn-west-c7r1',inn,['inn-west-b'],'whole west-facing inn with retained porch and passage')
    hall=reg('guildhall',(192,336),'guildhall',ycuts=([0,446,719,984,1224,1566],[0,96,192,240,288,336]))
    save('guildhall-c7r1',hall,['guildhall'],'whole civic building;192x96 roof; two banners')
    # One gate source; continuous chamber, wall-walk, stairs and bearings.
    gate=reg('gate-c',(192,192),'gate',xcuts=([0,238,698,930,1136],[0,24,120,144,192]))
    save('gate-assembly-c7',gate,['gate-c'],'whole coherent gate/stair registration;96px span')
    save('gate-c-c7',gate.crop((0,0,144,192)),['gate-assembly-c7'],'native144x192 gate core')
    save('gate-stair-c7',gate.crop((144,0,192,192)),['gate-assembly-c7'],'native48px matching stair, treads and landing')
    market=reg('market-c',(192,144),'market',ycuts=([0,590,869],[0,96,144]))
    save('market-north-c7',market,['market-c'],'whole continuous roof;four supported bays;open north/south aisle')
    # Masks are exact selected PAINTED alpha; no supports/counters/treads are erased.
    roofmask=Image.new('L',market.size);roofmask.paste(market.getchannel('A').crop((0,0,192,96)),(0,0));roofmask.save(R/'r17-C7-critic1-market-overhead-mask.png')
    gm=Image.new('L',gate.size);gm.paste(gate.getchannel('A').crop((24,0,120,106)),(24,0));gm.save(R/'r17-C7-critic1-gate-overhead-mask.png')
    # Quiet matched stone curtain family drawn as a continuous connected strip.
    wall=reg('wall-strip',(480,144),'curtain',outline=False);variants=[]
    edge=wall.crop((94,0,96,144))
    for i in range(5):
        a=wall.crop((96*i,0,96*(i+1),144));a.paste(edge,(0,0));a.paste(edge,(94,0));variants.append(a)
        save(f'wall-{i}-c7',a,['wall-strip'],'native continuous stone courses; compatible two-column paint edges')
        b=Image.new('RGBA',(96,96));b.paste(a.crop((0,0,96,64)));b.paste(a.crop((0,112,96,144)),(0,64))
        save(f'wall-{i}-short-c7',b,[f'wall-{i}-c7'],'remove complete middle masonry courses, retain original scale')
    strip=Image.new('RGBA',(480,144))
    for i,a in enumerate(variants):strip.alpha_composite(a,(96*i,0))
    save('wall-strip-c7',strip,[f'wall-{i}-c7' for i in range(5)],'five native connected curtain modules')
    walk=reg('wall-walk',(48,24),'walk',outline=False)
    walk.paste(walk.crop((1,0,2,24)),(0,0));walk.paste(walk.crop((1,0,2,24)),(47,0))
    save('wall-walk-c7',walk,['wall-walk'],'horizontal walking top and shallow shaded return')
    paved=reg('paving',(144,144),'paving',box=(36,36,1218,1218),outline=False)
    boxes=[(0,0),(48,0),(96,0),(0,48),(48,48),(96,48),(0,96)]
    for i,(x,y) in enumerate(boxes):
        a=wrap(paved.crop((x,y,x+48,y+48)))
        n=f'square-paving-{i}-c7' if i<4 else 'main-paving-c7' if i==4 else f'main-paving-v{i-4}-c7r1'
        save(n,a,['paving'],'distinct native48px sample and painted-edge wrap')
    turn=reg('street-turn',(96,96),'turn',box=(28,29,1226,1223),outline=False)
    save('street-turn-c7',turn,['street-turn'],'painted L kerb/gutter transition, square corner')
    (R/'r17-C7-critic1-native-operations.json').write_text(json.dumps(ops,indent=2))
    print('SAVED',len(ops),'registered/cropped exports',flush=True)
if __name__=='__main__':run()
