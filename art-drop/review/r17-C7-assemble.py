"""Native crops, palette substitutions and compositing of C7 paintings."""
from pathlib import Path
import importlib.util,json
from PIL import Image,ImageChops
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('processing',R/'r17-C7-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
ops=[]
def read(n):return Image.open(O/(n+'.png')).convert('RGBA')
def save(n,a,donors,op):
    a.putdata([q if q[3] else (0,0,0,0) for q in a.get_flattened_data()]);a.save(O/(n+'.png'));ops.append(dict(file=n+'.png',donors=donors,operation=op,size=list(a.size)))
def repeat(a,size):
    im=Image.new('RGBA',size)
    for y in range(0,size[1],a.height):
        for x in range(0,size[0],a.width):im.paste(a,(x,y))
    return im
def roof_brown(a,height):
    q=a.copy();v=[]
    for i,c in enumerate(q.get_flattened_data()):
        r,g,b,al=c
        if i//q.width<height and al and r>g*1.40 and r>b*1.65:
            k=min(range(6),key=lambda k:sum((c[j]-p.RED[k][j])**2 for j in range(3)));c=(*p.BROWN[k],al)
        v.append(c)
    q.putdata(v);return q

def restore_mode(name):
    a=Image.open(R/('r17-C7-mode-'+name+'.png')).convert('RGBA')
    v,_=p.clean(list(a.get_flattened_data()),a.width,a.height,True)
    a.putdata(v);return a

def run():
    # Deterministic source for material changes: never remap yesterday's result.
    # Cool the residual purple key-fringe to the adjacent slate ramp.
    inn=restore_mode('inn-access');v=[]
    for c in inn.get_flattened_data():
        if c[3] and c[0]>c[1]*1.3 and c[2]>c[1]*1.2:
            k=min(range(len(p.SLATE)),key=lambda k:abs(sum(c[:3])/3-sum(p.SLATE[k])/3));c=(*p.SLATE[k],255)
        v.append(c)
    inn.putdata(v);save('block-inn-b-c7',inn,['r17-C7-mode-inn-access'],'remove key-fringe purple by nearest-value slate substitution; exact alpha retained')
    for name in ['block-sw','block-sm','block-se']:
        if name=='block-se' and (O/'block-se-main-c7.png').exists():
            a=Image.new('RGBA',(480,240));a.alpha_composite(roof_brown(read('roof-hip-left-d2-c7'),96),(32,48));a.alpha_composite(read('block-se-main-c7'),(48,0));a.alpha_composite(read('block-se-wing-c7'),(0,0))
        else:a=restore_mode(name)
        if name!='block-sw':
            # Replace the red material ramp, including lower gables, while
            # preserving ochre plaster, stone, glass and exact silhouettes.
            limit=a.height;v=[]
            for i,c in enumerate(a.get_flattened_data()):
                r,g,b,al=c
                if i//a.width<limit and al and r>g*1.40 and r>b*1.65:
                    lum=.299*r+.587*g+.114*b
                    k=min(range(6),key=lambda k:abs(lum-(.299*p.BROWN[k][0]+.587*p.BROWN[k][1]+.114*p.BROWN[k][2])));c=(*p.BROWN[k],al)
                v.append(c)
            a.putdata(v)
        save(name+'-c7',a,['block-se-main-c7','block-se-wing-c7','roof-hip-left-d2-c7'] if name=='block-se' else ['r17-C7-mode-'+name],'registered source-paint assembly; brown material map; SE one-cell wing ends at144px with48x96 clear notch')

    wall=read('wall-strip-c7')
    # Continuous strip is the master. Variant edges use adjacent painted
    # stone columns, retaining one shared contour without an internal border.
    for i in range(5):
        a=wall.crop((i*96,0,(i+1)*96,144))
        for x,sx in [(0,94),(1,95),(94,94),(95,95)]:a.paste(wall.crop((sx,0,sx+1,144)),(x,0))
        save('wall-'+str(i)+'-c7',a,['wall-strip-c7'],'native96px strip division; common two-column drawn edge contract')
        short=Image.new('RGBA',(96,96));short.paste(a.crop((0,0,96,64)),(0,0));short.paste(a.crop((0,112,96,144)),(0,64))
        save('wall-'+str(i)+'-short-c7',short,['wall-'+str(i)+'-c7'],'remove48px middle shaft courses at native scale')
    a=read('wall-tower-c7')
    for name,h in [('mid',192),('short',144)]:
        b=Image.new('RGBA',(96,h));b.paste(a.crop((0,0,96,96)),(0,0));b.paste(a.crop((0,240-(h-96),96,240)),(0,96));save('wall-tower-'+name+'-c7',b,['wall-tower-c7'],'remove native middle courses; preserve top and foot')
        for i in [1,2]:
            v=b.copy();top=read('wall-tower-'+'ab'[i-1]+'-c6').crop((0,0,96,72))
            v.paste((0,0,0,0),(0,0,96,72));v.alpha_composite(top,(0,0))
            save('wall-tower-'+name+'-v'+str(i)+'-c7',v,['wall-tower-c7','wall-tower-'+'ab'[i-1]+'-c6'],'native approved top alternative over continuous new stone shaft')
    save('wall-walk-c7',wall.crop((144,10,192,34)),['wall-strip-c7'],'native48x24 painted wall-walk surface')
    # Ground fills are image-painted. Quiet value remapping is material-only.
    a=Image.open(R/'r17-C7-clean-paving.png').convert('RGBA');ramp=[(105,100,85),(130,123,105),(155,146,125)]
    pal=Image.new('P',(1,1));pal.putpalette([q for c in ramp+[ramp[-1]]*253 for q in c]);a=a.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA')
    for i in range(4):
        x=i%2*48;y=i//2*48;b=a.crop((x,y,x+48,y+48))
        # Wrap the authored tile's outer mortar course at native resolution.
        b.paste(b.crop((0,0,48,1)),(0,47));b.paste(b.crop((0,0,1,48)),(47,0))
        save('square-paving-'+str(i)+'-c7',b,['r17-C7-clean-paving'],'48px atlas crop; quiet locked values; opposite-edge native wrap')
    b=read('square-paving-2-c7');save('main-paving-c7',b,['square-paving-2-c7'],'same drawn paving family on gate route')
    if (O/'street-turn-c7.png').exists():
        turn=read('street-turn-c7');save('kerb-v-c7',turn.crop((0,4,3,52)),['street-turn-c7'],'native painted3px vertical kerb/gutter crop');save('kerb-h-c7',turn.crop((4,0,52,3)),['street-turn-c7'],'native painted3px horizontal kerb/gutter crop')
    # Complete market roof and rear ranges meet as one owned city block.
    a=Image.new('RGBA',(384,288));b=read('block-sm-c7')
    a.alpha_composite(b,(0,48));a.alpha_composite(b,(144,48))
    hall=roof_brown(read('market-north-c7'),144);a.alpha_composite(hall,(96,0))
    save('block-market-c7',a,['block-sm-c7','market-north-c7'],'two attached native rear ranges and whole roofed pavilion; brown roof material remap')
    if (O/'corner-house-c7.png').exists():
        a=read('corner-house-c7');donor=read('ground-shop-w2-c0')
        for n,y in [('ground-corner-w3-c7',192),('storey-corner-w3-c7',144)]:
            b=a.crop((0,y,144,y+48))
            for yy in [0,47]:
                b.paste(donor.crop((0,yy,96,yy+1)),(0,yy));b.paste(donor.crop((0,yy,48,yy+1)),(96,yy))
            save(n,b,['corner-house-c7','ground-shop-w2-c0'],'native48px course extraction and fixed painted row0/47 transfer')
        tower=read('wall-tower-c7')
        for hand,x in [('left',24),('right',64)]:
            wall=tower.crop((x,96,x+16,240));save('receiving-'+hand+'-c7',wall,['wall-tower-c7'],'native16px separately lit masonry receiver with continuous courses')
            save('firewall-'+hand+'-c7',wall.crop((0,48,16,96)),['receiving-'+hand+'-c7'],'native16x48 firewall body')
    for w in [1,2,3]:
        n=f'roof-a-w{w}-d3-c7'
        if not (O/(n+'.png')).exists():continue
        a=read(n);b=Image.new('RGBA',(w*48,96));b.paste(a.crop((0,0,w*48,48)),(0,0));b.paste(a.crop((0,96,w*48,144)),(0,48));save(f'roof-a-w{w}-d2-c7',b,[n],'remove middle48 native roof rows; no stretched cap')
        for hand,x in [('left',0),('right',max(0,w*48-48))] if w==3 else []:
            for d,cap in [(3,a),(2,b)]:save(f'roof-hip-{hand}-d{d}-c7',cap.crop((x,0,x+48,d*48)),[n],'native handed hip/valley edge crop')
    if (O/'roof-a-w3-d3-c7.png').exists():
        a=read('roof-a-w3-d3-c7').crop((48,72,96,120));a.paste(a.crop((0,0,48,1)),(0,47));a.paste(a.crop((0,0,1,48)),(47,0));save('roof-fill-c7',a,['roof-a-w3-d3-c7'],'native painted interior tile with opposite-edge wrap')
    (R/'r17-C7-native-operations.json').write_text(json.dumps(ops,indent=2))
if __name__=='__main__':run()
