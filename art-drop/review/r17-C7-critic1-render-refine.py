from pathlib import Path
p=Path('art-drop/out/city17/compose.py');s=p.read_text()
s=s.replace("dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True)","dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True,reserved_cells=[[x,y] for x in range(4,8) for y in range(2)],reserved_owner='market-hall rear roof')")
s=s.replace("elif lot['floors']==1 or (face=='N' and lot['variant']==0):roof=asset(f'roof-a-w{w}-d2-c7')", "elif lot['floors']==1 or (face=='N' and lot['variant']==0):roof=asset(f'roof-a-w{w}-d2-c7')\n    if lot.get('corner') and face in 'WE' and w==2:roof=asset('roof-corner-c7r1')")
start=s.index('    # Ground receiver allotments are actual owned footprints',s.index('def c7_render('));end=s.index('    for actor in actors or []:',start)
new='''    # Shared wall contacts are built only inside the lower lot's transparent
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
'''
s=s[:start]+new+s[end:]
helper='''def c7_join_lots(items):
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


'''
s=s.replace('def c7_render(l,reveal=False,actors=None):',helper+'def c7_render(l,reveal=False,actors=None):')
p.write_text(s)
