"""Current C7 function snapshot; compose.py is the executable entry point."""
def c7_tone(a,tone):
    """Material-only mapping of the newly painted roof, preserving all pixels."""
    if tone=='terracotta':return a.copy()
    red=[(54,40,34),(87,55,45),(111,65,49),(137,79,58),(156,95,68),(179,115,78)]
    ramp=[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)] if tone=='slate' else [(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]
    b=a.copy();v=[]
    for q in a.get_flattened_data():
        r,g,bb,al=q
        if al and r>g*1.35 and r>bb*1.5:
            k=min(range(6),key=lambda k:sum((q[j]-red[k][j])**2 for j in range(3)));q=(*ramp[k],al)
        v.append(q)
    b.putdata(v);return b


def c7_ring(block):
    """Real 1/2-cell ground buildings around a polygon, not bitmap fragments."""
    x,y,w,h=block['rect'];cols,rows=w//48,h//48
    cells={(xx,yy) for yy in range(rows) for xx in range(cols)}-set(map(tuple,block.get('notches',[])))
    court=set(map(tuple,block.get('court_cells',[])))
    reserved=set(map(tuple,block.get('reserved_cells',[])))
    available=cells-court-reserved;owned=set();lots=[]
    directions={'N':(0,-1),'S':(0,1),'W':(-1,0),'E':(1,0)}
    for facing in ['N','S','W','E']:
        dx,dy=directions[facing]
        edge=sorted([q for q in available if (q[0]+dx,q[1]+dy) not in cells],key=lambda q:(q[1],q[0]))
        for q in edge:
            if q in owned:continue
            axis=(1,0) if facing in 'NS' else (0,1)
            other=(q[0]+axis[0],q[1]+axis[1]);run=[q]
            if other in edge and other not in owned:run.append(other)
            for xx,yy in list(run):
                inward=(xx-dx,yy-dy)
                if inward in available and inward not in owned and inward not in run:run.append(inward)
            run=sorted(set(run)-owned);owned.update(run)
            faces={facing}
            for xx,yy in run:
                for f,(ex,ey) in directions.items():
                    if (xx+ex,yy+ey) not in cells:faces.add(f)
            index=len(lots);floors=block.get('floors',2)
            if block['id']=='civic' and facing=='S':floors=[3,4,5,3,4][index%5]
            if block.get('poor'):floors=1+(index%3==0)
            if block['id']=='northwest' and facing=='S' and 2<=min(xx for xx,yy in run)<=5:floors=1
            left=min(xx for xx,yy in run);top=min(yy for xx,yy in run)
            ww=max(xx for xx,yy in run)-left+1;hh=max(yy for xx,yy in run)-top+1
            # Nonrectangular leftover cells become separate complete one-cell
            # corner lots, never missing portions of a projected house painting.
            if len(run)!=ww*hh:
                owned.difference_update(run)
                for xx,yy in run:
                    if (xx,yy) in owned:continue
                    owned.add((xx,yy));lots.append(dict(id=f'{block["id"]}-{facing}-{xx}-{yy}',block=block['id'],facing=facing,street_faces=sorted(faces),cells=[[xx,yy]],footprint=[x+48*xx,y+48*yy,48,48],bottom_left=[x+48*xx,y+48*(yy+1)],floors=floors,width=1,roof=block['roof'],variant=(index+xx+yy)%2,corner=True))
            else:
                lots.append(dict(id=f'{block["id"]}-{facing}-{index}',block=block['id'],facing=facing,street_faces=sorted(faces),cells=[list(q) for q in run],footprint=[x+48*left,y+48*top,48*ww,48*hh],bottom_left=[x+48*left,y+48*(top+hh)],floors=floors,width=ww,roof=block['roof'],variant=index%2,corner=len(faces)>1))
    # Deep interiors are attached roofed rear wings, with explicit ownership.
    for q in sorted(available-owned):
        owner=min(lots,key=lambda lot:min(abs(q[0]-v[0])+abs(q[1]-v[1]) for v in lot['cells']))
        owner.setdefault('rear_wing_cells',[]).append(list(q))
    return lots,sorted(cells),sorted(court)


def c7_build_lot(lot):
    """Facing selects painted elevations; floor count physically builds courses."""
    face=lot['facing'];family={'N':'north','E':'east','W':'west','S':'ab'[lot['variant']]}[face]
    w=lot['width'];n=lot['floors'];roof=asset(f'roof-{family}-w{w}-c7r1')
    if lot.get('deep_roof'):roof=asset(f'roof-a-w{w}-d3-c7')
    elif lot['floors']==1 or (face=='N' and lot['variant']==0):roof=asset(f'roof-a-w{w}-d2-c7')
    if w==2 and ((lot.get('corner') and face in 'WE') or (face=='S' and lot['variant']==0 and n>1)):roof=asset('roof-corner-c7r1')
    roof=c7_tone(roof,lot['roof']);h=roof.height+n*48
    a=Image.new('RGBA',(w*48,h));layers=[]
    for j in range(n):
        name=f'{"ground" if j==0 else "storey"}-{family}-w{w}-c7r1'
        if j==0 and lot.get('passage') and w==2:name='ground-passage-w2-c6'
        if j==1 and lot.get('trade') and w==2:name='storey-sign-bay-v'+str(lot['variant'])+'-c5-w2'
        panel=asset(name);yy=h-(j+1)*48;a.alpha_composite(panel,(0,yy))
        layers.append(dict(file=name,x=0,y=yy,kind='ground' if j==0 else 'storey'))
    a.alpha_composite(roof,(0,0));layers.append(dict(file=f'roof-{family}-w{w}-c7r1',x=0,y=0,kind='roof'))
    roofmask=Image.new('L',a.size);roofmask.paste(roof.getchannel('A'),(0,0))
    wallmask=Image.new('L',a.size);wallmask.paste(a.getchannel('A').crop((0,roof.height,a.width,h)),(0,roof.height))
    if lot.get('trade'):
        sign=asset('sign-'+lot['trade']+'-c7');sx=0;sy=h-96
        if w==1:raise ValueError('Signs need an actual blank two-cell mounting bay')
        sh=Image.new('L',a.size);sh.paste(sign.getchannel('A'),(sx+2,sy+3));sh=ImageChops.multiply(sh,wallmask)
        shade=Image.new('RGBA',a.size,(35,37,32,0));shade.putalpha(sh.point(lambda q:q*80//255));a.alpha_composite(shade);a.alpha_composite(sign,(sx,sy))
        layers.append(dict(file='sign-'+lot['trade']+'-c7',x=sx,y=sy,kind='overlay',receiver='own blank wall bay'))
    return a,layers,roofmask,wallmask


def c7_city_layout():
    blocks=[
      dict(id='northwest',rect=[144,336,432,336],floors=2,roof='terracotta',court_cells=[[3,2],[4,2],[3,3],[4,3]],notches=[[8,0]]),
      dict(id='civic',rect=[624,336,576,336],floors=2,roof='terracotta',reserved_cells=[[x,y] for x in range(4,8) for y in range(3,7)],notches=[[0,0]]),
      dict(id='northeast',rect=[1248,336,528,336],floors=3,roof='slate',court_cells=[[6,2],[7,2]],notches=[[10,0],[10,1]]),
      dict(id='craft',rect=[144,768,336,240],floors=2,roof='terracotta',notches=[[6,0],[6,1]]),
      dict(id='inn',rect=[1200,768,288,240],floors=3,roof='slate',reserved_cells=[[0,3],[1,3],[0,4],[1,4]]),
      dict(id='east-trades',rect=[1536,768,240,240],floors=3,roof='slate',notches=[[4,0]]),
      dict(id='southwest',rect=[144,1104,432,240],floors=2,roof='terracotta',poor=True,notches=[[0,0],[0,1]],court_cells=[[3,1]]),
      dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True,reserved_cells=[[x,y] for x in range(4,8) for y in range(2)],reserved_owner='market-hall rear roof'),
      
      dict(id='southeast',rect=[1200,1104,576,240],floors=2,roof='brown',poor=True,notches=[[0,0],[0,1]],court_cells=[[7,1]]),
    ]
    l=dict(size=[1920,1440],concept='r17-concept-b.png',blocks=blocks,lots=[],props=[],roads=[],square=[768,720,336,336],square_notch=[1056,1008,48,48])
    for b in blocks:
        lots,cells,court=c7_ring(b);l['lots']+=lots;b.update(cells=[list(q) for q in cells],court_cells=[list(q) for q in court],base=b['rect'][1]+b['rect'][3],x=b['rect'][0])
    def road(ident,rect,kind='side'):
        l['roads'].append(dict(id=ident,rect=rect,kind=kind,clear_width=96 if kind=='main' else 24 if kind=='lane' else 48))
    # Every named run ends at a real T, bend or property-linked widening.
    for i,x in enumerate([96,480,864,1248,1632]):road('north-inner-'+str(i),[x,240,min(384,1824-x),48])
    for side,x in [('west',96),('east',1776)]:
        for i,y in enumerate([288,576,960]):road(side+'-inner-'+str(i),[x,y,48,288 if y<960 else 384])
    for i,(x,w) in enumerate([(144,432),(624,576),(1248,528)]):road('northern-crossing-'+str(i),[x,672,w,48])
    for name,rect in [('nw-return',[576,336,48,336]),('ne-return',[1200,336,48,336]),('west-bend',[432,720,96,96]),('craft-return',[480,816,48,192]),('east-through',[1488,720,48,336]),('southwest-T',[144,1008,624,48]),('craft-south',[144,1056,480,48]),('south-mid-return',[576,1056,48,288]),('east-crossing',[1200,1008,576,48]),('se-rear-T',[1296,1056,48,96]),('se-wedge-elbow',[1152,1104,96,96])]:road(name,rect)
    for i,x in enumerate([96,480,864,1248,1632]):road('south-inner-'+str(i),[x,1344,min(384,1824-x),48])
    road('gate-square',[1104,672,96,288],'main')
    road('gate-bend',[1056,960,144,96],'main')
    road('gate-middle',[1056,1056,96,144],'main')
    road('gate-widening-T',[1056,1200,144,96],'main')
    road('gate-south',[1056,1296,96,144],'main')
    road('west-trade-apron',[384,1008,96,96])
    road('east-trade-apron',[1488,1008,96,96])
    road('northwatch-return',[864,192,48,144])
    road('southwatch-return',[864,1296,48,96])
    road('nw-court-passage',[312,528,24,144],'lane')
    road('se-service-T',[1248,1128,96,24],'lane')
    def prop(file,x,base,**kw):
        a=asset(file);p=dict(file=file,x=x,base=base,floors=0,**kw);l['props'].append(p);return p
    prop('guildhall-c7r1',816,672,id='guildhall',footprint=[816,480,192,192],facing='S',height=5)
    prop('church-b-c7',528,1056,id='church',footprint=[528,768,240,288],entrance=[768,1008],facing='E',height=5)
    prop('churchyard-c7',624,768,id='church-precinct',footprint=[624,672,144,96])
    prop('inn-west-c7r1',1200,1008,id='inn-porch',footprint=[1200,912,96,96],entrance=[1200,960],facing='W',height=3)
    prop('market-north-c7',816,1200,id='market-hall',footprint=[816,1056,192,144],entrance=[888,1056],facing='N',height=1)
    for i,(x,base) in enumerate([(816,768),(864,768),(912,768),(816,864),(864,864),(912,864)]):prop('stall-'+str(i),x,base,id='stall-'+str(i),footprint=[x,base-48,48,48],height=1)
    prop('fountain',1008,960,id='fountain',footprint=[1008,864,96,96])
    prop('market-cross',960,864,id='market-cross',footprint=[960,768,48,96])
    for i,x in enumerate([0,432,1008,1488,1824]):
        prop('corner-bastion-c7' if i==0 else 'wall-tower-mid'+(['','-v1','-v2'][i%3])+'-c7',x,192,id='north-tower-'+str(i),wall=True,footprint=[x,96,144 if i==0 else 96,96],height=4)
    for side,x,bases in [('west',0,[624,1008,1440]),('east',1824,[576,1008,1440])]:
        for i,base in enumerate(bases):prop('wall-tower-'+('short' if base==1440 else 'mid')+(['-v2','','-v1'][i%3])+'-c7',x,base,id=side+'-tower-'+str(i),wall=True,footprint=[x,base-96,96,96],height=3)
    for i,x in enumerate([528,1536]):prop('wall-tower-short'+(['','-v2'][i])+'-c7',x,1440,id='south-tower-'+str(i),wall=True,footprint=[x,1392,96,48],height=3)
    prop('gate-assembly-c7',1032,1440,id='gate',wall=True,footprint=[1008,1248,192,192],anchor=[1008,1440],paint_offset=[24,0],portal=[1056,1344,96,96],height=4)
    prop('wall-access-c5',912,192,id='north-wall-stair',wall=True,height=2)
    # Signs mount once on dedicated window-free elevations, within their owner.
    for bid,trade in [('civic','baker'),('civic','apothecary'),('craft','smith'),('craft','cobbler'),('east-trades','tailor'),('east-trades','scribe'),('southwest','butcher')]:
        choices=[q for q in l['lots'] if q['block']==bid and q['facing']=='S' and q['width']==2 and not q.get('trade')]
        if choices:
            q=choices[0 if trade not in ['apothecary','scribe','cobbler'] else -1];q['trade']=trade;q['floors']=max(2,q['floors'])
    for q in l['lots']:
        if q['block']=='south-artisans':q['floors']=1
        if q['block']=='southeast' and q['footprint'][0]==1200:q['facing']='W'
        if q['block']=='northwest' and q['facing']=='S' and q['width']==2 and q['footprint'][0] in [240,336]:q['passage']=True
    # Actual ground feet, with no arbitrary foreground sort overrides.
    for file,x,base,ident in [('yard-0',288,480,'northwest-well'),('yard-2',336,480,'northwest-laundry'),('woodpile-c7',360,504,'northwest-wood'),('laundry-worker-c7',318,504,'laundry-worker'),('sorting-table-c7',1536,480,'sorting-table'),('woodpile-c7',336,1248,'southwest-wood'),('delivery-c7',288,1044,'craft-delivery'),('bench-c7',1200,1056,'inn-bench'),('inn-patron-a-c7',1210,1056,'inn-patron-a'),('inn-patron-b-c7',1236,1060,'inn-patron-b')]:prop(file,x,base,id=ident,role=ident)
    # The stair actor belongs to an elevated walking surface. It is composited
    # between that drawing's retained treads and its painted foreground cheek.
    l['surface_actors']=[dict(file='guard-c7',owner='gate',feet=[1196,1378],surface='east stair tread',id='gate-guard')]
    for i,(x,base) in enumerate([(824,792),(872,792),(920,792),(824,888),(872,888),(920,888),(980,972),(1090,972)]):prop(['person-customer-c4','inn-patron-a-c7','inn-patron-b-c7','laundry-worker-c7'][i%4],x,base,id='market-life-'+str(i),role='vendor/customer')
    return l


def c7_ground(l):
    im=Image.new('RGBA',tuple(l['size']));rng=random.Random(17071);previous=[]
    for y in range(0,im.height,48):
        row=[]
        for x in range(0,im.width,48):
            options=[i for i in range(4) if (not row or i!=row[-1]) and (not previous or i!=previous[x//48])];i=rng.choice(options);row.append(i)
            im.paste(asset(f'square-paving-{i}-c7'),(x,y))
        previous=row
    im.paste(repeat(asset('ditch-c3'),(1920,48)),(0,0))
    mains=[r['rect'] for r in l['roads'] if r['kind']=='main']
    def inside(x,y):return any(a<=x<a+w and b<=y<b+h for a,b,w,h in mains)
    tile_names=['main-paving-c7','main-paving-v1-c7r1','main-paving-v2-c7r1']
    for x,y,w,h in mains:
        for yy in range(y,y+h,48):
            for xx in range(x,x+w,48):im.paste(asset(tile_names[rng.randrange(3)]),(xx,yy))
    # Measured width is BETWEEN kerbs. All three kerb pixels are outside it.
    kv=asset('kerb-v-c7');kh=asset('kerb-h-c7')
    for x,y,w,h in mains:
        for yy in range(y,y+h):
            for xx,probe in [(x-3,x-1),(x+w,x+w)]:
                if not inside(probe,yy):im.alpha_composite(kv.crop((0,yy%48,3,yy%48+1)),(xx,yy))
        for xx in range(x,x+w):
            for yy,probe in [(y-3,y-1),(y+h,y+h)]:
                if not inside(xx,probe):im.alpha_composite(kh.crop((xx%48,0,xx%48+1,3)),(xx,yy))
    # Dedicated painted corner joins at actual turns, outside the walking lane.
    turn=asset('street-turn-c7')
    im.alpha_composite(turn.crop((0,0,48,48)),(1053,957))  # full native transition; kerbs lie outside the clear route
    return im


def c7_assemble_block(block,lots):
    """Review-only projection of independent oriented building recipes."""
    x,y,w,h=block['rect'];top=min([q['bottom_left'][1]-c7_build_lot(q)[0].height for q in lots if q['block']==block['id']]+[y]);out=Image.new('RGBA',(w,h+y-top))
    owners=[q for q in lots if q['block']==block['id']]
    for q in owners:
        for xx,yy in q.get('rear_wing_cells',[]):out.alpha_composite(c7_tone(asset('roof-fill-c7'),q['roof']),(xx*48,y+yy*48-top))
    for q in sorted(owners,key=lambda q:(q['bottom_left'][1],q['bottom_left'][0])):
        a,_,_,_=c7_build_lot(q);out.alpha_composite(a,(q['bottom_left'][0]-x,q['bottom_left'][1]-a.height-top))
    return out


def c7_wall_sequence(n,seed=1707):
    rng=random.Random(seed);seq=[];triples=set()
    for i in range(n):
        options=[v for v in range(5) if seq[-4:].count(v)<2 and (len(seq)<2 or tuple(seq[-2:]+[v]) not in triples) and (not seq or v!=seq[-1])]
        v=rng.choice(options);seq.append(v)
        if len(seq)>=3:triples.add(tuple(seq[-3:]))
    return seq


def c7_join_lots(items):
    """Close genuine shared-property contacts without stretching facade bays."""
    houses=[i for i in items if i['meta'].get('cells')]
    originals={i['meta']['id']:i['a'].copy() for i in houses}
    for low in houses:
        q=low['meta'];x,y,w,h=q['footprint'];source=originals[q['id']];al=source.getchannel('A')
        for high in houses:
            o=high['meta'];ox,oy,ow,oh=o['footprint']
            if o['id']==q['id'] or high['base']!=low['base'] or not (ox+ow==x or x+w==ox):continue
            if o['floors']<q['floors']:continue
            hand='left' if ox+ow==x else 'right';wall=asset('receiving-'+hand+'-c7');metal=asset('firewall-'+hand+'-c7')
            under=Image.new('RGBA',source.size);over=Image.new('RGBA',source.size);first=None
            for sy in range(source.height):
                hy=low['y']+sy-high['y'];ha=originals[o['id']]
                if not 0<=hy<ha.height:continue
                edge=al.crop((0,sy,source.width,sy+1)).getbbox()
                if not edge:continue
                left,right=(0,edge[0]) if hand=='left' else (edge[2],source.width)
                # Sixteen-pixel native receiving margin only; never a window.
                if right-left>16:left,right=(max(left,right-16),right) if hand=='left' else (left,min(right,left+16))
                if right<=left:continue
                if first is None:first=sy
                wy=0 if sy==first else 1+(sy-first-1)%(wall.height-1)
                under.paste(repeat(wall.crop((0,wy,wall.width,wy+1)),(right-left,1)),(left,sy))
                if low.get('roofmask') and low['roofmask'].crop((0,sy,source.width,sy+1)).getbbox():
                    # Only the neutral coping/flashing columns from the drawn
                    # handed strip are exposed; its masonry does not repeat.
                    fx=right-1 if hand=='left' else left
                    over.paste(metal.crop((0,wy%metal.height,1,wy%metal.height+1)),(fx,sy))
            under.alpha_composite(low['a']);under.alpha_composite(over);low['a']=under
            low.setdefault('contacts',[]).append(dict(neighbour=o['id'],hand=hand,receiver='receiving-'+hand+'-c7',flashing='firewall-'+hand+'-c7'))
    return items


def c7_render(l,reveal=False,actors=None):
    im=c7_ground(l);ordered=[];records=[];shadow_records=[];ground_cast=Image.new('L',im.size)
    # Painted roofed rear wings, each assigned to its parent property.
    for b in l['blocks']:
        bx,by,_,_=b['rect']
        for q in [q for q in l['lots'] if q['block']==b['id']]:
            for xx,yy in q.get('rear_wing_cells',[]):im.alpha_composite(c7_tone(asset('roof-fill-c7'),q['roof']),(bx+48*xx,by+48*yy))
        for xx,yy in b['court_cells']:im.alpha_composite(asset('packed-yard-c6r1').crop((0,0,48,48)),(bx+48*xx,by+48*yy))
    for q in l['lots']:
        a,parts,roofmask,wallmask=c7_build_lot(q);x,base=q['bottom_left'];y=base-a.height
        ordered.append(dict(base=base,z=0,x=x,y=y,a=a,meta=q,parts=parts,roofmask=roofmask,wallmask=wallmask))
    for y,short in [(48,False),(1344,True)]:
        seq=c7_wall_sequence(19,1707+y)
        for i,x in enumerate(range(48,1872,96)):
            if short and 1008<=x<1200:continue
            a=asset('wall-'+str(seq[i])+('-short' if short else '')+'-c7')
            ordered.append(dict(base=y+a.height,z=-2,x=x,y=y,a=a,meta=dict(id=f'curtain-{x}-{y}',wall=True,floors=2,footprint=[x,y,96,a.height]),parts=[]))
    for x in range(96,1824,48):
        a=asset('wall-walk-c7');ordered.append(dict(base=192,z=-1,x=x,y=80,a=a,meta=dict(id='north-walk-'+str(x),wall=True,floors=0),parts=[]))
    for x in [0,48,1824,1872]:
        for i,y in enumerate(range(192,1344,144)):
            a=asset('wall-side-'+'abc'[i%3]+'-c4');ordered.append(dict(base=y+a.height,z=-2,x=x,y=y,a=a,meta=dict(id=f'side-wall-{x}-{y}',wall=True,floors=2),parts=[]))
    for p in l['props']:
        a=asset(p['file']).copy();item=dict(base=p['base'],z=2 if p.get('role') else 1,x=p['x'],y=p['base']-a.height,a=a,meta=p,parts=[])
        if p['id']=='inn-porch':
            sign=asset('sign-inn-c7');a.alpha_composite(sign,(0,144));item['a']=a
        if p['id']=='market-hall':item['roofmask']=Image.open(REVIEW/'r17-C7-critic1-market-overhead-mask.png').convert('L')
        if p['id']=='gate':item['roofmask']=Image.open(REVIEW/'r17-C7-critic1-gate-overhead-mask.png').convert('L')
        ordered.append(item)
    # Shared wall contacts are built only inside the lower lot's transparent
    # edge margin, using native handed masonry, one coping and contour flashing.
    c7_join_lots(ordered)
    occupied=Image.new('L',im.size)
    for item in ordered:
        mask=Image.new('L',im.size);mask.paste(item['a'].getchannel('A'),(item['x'],item['y']));occupied=ImageChops.lighter(occupied,mask)
    claimed=Image.new('L',im.size)
    for item in ordered:
        q=item['meta'];height=q.get('floors',q.get('height',0));foot=q.get('footprint')
        if not height or not foot or q.get('role'):continue
        x,y,w,h=foot;a=item['a'];alpha=a.getchannel('A')
        reach=12 if q['id'].startswith('stall-') else min(72,24*height)
        # Each frontage owns a compact southeast ground receiver. Ground-plan
        # ownership and projected paint bounds remain distinct; shared street
        # receivers are partitioned once, so no cast crosses its assigned mask.
        owner=Image.new('L',im.size);receiver=[x,y,w+reach//2,h+reach]
        owner.paste(255,(x,y,x+w+reach//2,y+h+reach))
        for other in l['lots']:
            if other['id']==q['id']:continue
            ox,oy,ow,oh=other['footprint'];owner.paste(0,(ox,oy,ox+ow,oy+oh))
        owner=ImageChops.multiply(owner,ImageChops.invert(occupied))
        owner=ImageChops.subtract(owner,claimed);claimed=ImageChops.lighter(claimed,owner)
        cast=Image.new('L',im.size)
        for sy in range(a.height):
            rise=a.height-1-sy;dy=round(rise*reach/max(1,a.height-1));dx=dy//2
            row=alpha.crop((0,sy,a.width,sy+1));py=item['base']+dy
            if 0<=py<im.height:
                prior=cast.crop((item['x']+dx,py,item['x']+dx+a.width,py+1))
                cast.paste(ImageChops.lighter(prior,row),(item['x']+dx,py))
        cast=ImageChops.multiply(cast,owner);ground_cast=ImageChops.lighter(ground_cast,cast)
        shadow_records.append(dict(owner=q['id'],receiver=receiver,ground_footprint=foot,opacity=88,surface='ground',mask_bounds=cast.getbbox(),owned_intersection=True,projection='stepped drawn silhouette southeast onto partitioned frontage receiver',reach=reach,receiver_pixels=owner.histogram()[255],cast_pixels=cast.histogram()[255]))
        if item.get('wallmask'):
            wall=item['wallmask'];roof=item['roofmask'];wallshade=Image.new('L',a.size);roofshade=Image.new('L',a.size)
            for dx,dy in [(1,2),(2,3),(2,4)]:
                shift=Image.new('L',a.size);shift.paste(roof,(dx,dy));wallshade=ImageChops.lighter(wallshade,ImageChops.multiply(shift,wall))
            for other in ordered:
                o=other['meta']
                if not o.get('footprint') or o.get('floors',0)<=height:continue
                ox,oy,ow,oh=o['footprint']
                if ox+ow!=x or not (oy<y+h and y<oy+oh):continue
                for dx,dy in [(2,4),(4,8),(6,12)]:
                    shift=Image.new('L',a.size);shift.paste(other['a'].getchannel('A'),(other['x']-item['x']+dx,other['y']-item['y']+dy));roofshade=ImageChops.lighter(roofshade,ImageChops.multiply(shift,roof))
            mask=ImageChops.lighter(wallshade,roofshade);shade=Image.new('RGBA',a.size,(35,37,32,0));shade.putalpha(mask.point(lambda v:v*88//255));item['a']=a.copy();item['a'].alpha_composite(shade)
            for surface,sm in [('wall',wallshade),('roof',roofshade)]:
                shadow_records.append(dict(owner=q['id'],receiver=[item['x'],item['y'],a.width,a.height],opacity=88,surface=surface,mask_bounds=sm.getbbox(),owned_intersection=True,projection='source alpha intersected with own painted surface'))
    shade=Image.new('RGBA',im.size,(35,37,32,0));shade.putalpha(ground_cast.point(lambda v:v*88//255));im.alpha_composite(shade)
    for actor in actors or []:
        if actor.get('owner'):continue
        a=asset(actor.get('file','guard-c7'));x,base=actor['feet'];ordered.append(dict(base=base,z=3,x=x-a.width//2,y=base-a.height,a=a,meta=dict(id='proof-actor',role='actor'),parts=[]))
    for item in sorted(ordered,key=lambda q:(q['base'],q['z'],q['x'])):
        a=item['a'].copy();q=item['meta'];x,y=item['x'],item['y']
        if reveal and item.get('roofmask') and (reveal is True or q['id'] in reveal):
            al=ImageChops.subtract(a.getchannel('A'),item['roofmask']);a.putalpha(al)
        im.alpha_composite(a,(x,y))
        if q['id']=='gate':
            surface_actors=l.get('surface_actors',[])+[z for z in actors or [] if z.get('owner')=='gate']
            for actor in surface_actors:
                aa=asset(actor['file']);fx,fy=actor['feet'];im.alpha_composite(aa,(fx-aa.width//2,fy-aa.height))
                # Reapply only the drawn right cheek in front of the feet,
                # selected from the assembly's diagonal parapet surface.
                mask=Image.new('L',a.size);d=ImageDraw.Draw(mask);d.polygon([(181,91),(191,99),(191,188),(181,192),(170,175),(178,145)],fill=255)
                mask=ImageChops.multiply(mask,item['a'].getchannel('A'));fg=item['a'].copy();fg.putalpha(mask);im.alpha_composite(fg,(x,y))
        records.append(dict(id=q['id'],file=q.get('file'),bounds=[x,y,a.width,a.height],base=item['base'],layer=item['z'],parts=item['parts'],facing=q.get('facing'),floors=q.get('floors'),footprint=q.get('footprint')))
    return im,records,shadow_records


def c7_main():
    l=c7_city_layout();im,records,shadows=c7_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png');im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for n,box in {'square':(480,480,1536,1152),'street':(96,192,672,1056),'gate':(864,1008,1392,1440)}.items():
        crop=im.crop(box);crop.resize((crop.width*3,crop.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{n}-3x.png')
    def sheet(name,items):
        s=Image.new('RGBA',(sum(a.width for _,a in items)+16*(len(items)+1),max(a.height for _,a in items)+48),(32,36,32,255));d=ImageDraw.Draw(s);x=16
        for title,a in items:d.text((x,10),title,fill='white');s.alpha_composite(a,(x,32));x+=a.width+16
        s.save(REVIEW/name)
    sheet('r17-city-final-vs-r15-vs-today.png',[('TODAY / 1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / 1x',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('C7 critic1 repair / 48px cells / 1x',im)])
    sheet('r17-city-final-vs-concept.png',[('CONCEPT B / genuine reduction',Image.open(REVIEW/'r17-concept-b.png').convert('RGBA')),('C7 COMPOSED / native',im)])
    sheet('r17-concepts-vs-today-vs-final.png',[(f'CONCEPT {v.upper()} / native',Image.open(REVIEW/f'r17-concept-{v}.png').convert('RGBA')) for v in 'abc']+[('TODAY',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('BEFORE REPAIR',Image.open(REVIEW/'r17-C7-critic1-before-city.png').convert('RGBA')),('REBUILT CURRENT FINAL / native',im)])
    for name,data in [('layout',l),('placements',records),('shadows',shadows)]:(REVIEW/f'r17-C7-{name}.json').write_text(json.dumps(data,indent=2))
    print('C7:',len(l['blocks']),'perimeter plans,',len(l['lots']),'real oriented buildings')


