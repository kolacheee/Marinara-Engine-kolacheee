from pathlib import Path
p=Path('art-drop/out/city17/compose.py');s=p.read_text()
s=s.replace("floors=[3,4,5,3,4][index%5]","floors=[3,2,3,2,3][index%5]")
s=s.replace("variant=(index+xx+yy)%2,corner=True","variant=(index+xx+yy)%3,corner=True").replace("variant=index%2,corner=len(faces)>1","variant=index%3,corner=len(faces)>1")
s=s.replace("family={'N':'north','E':'east','W':'west','S':'ab'[lot['variant']]}[face]", "family={'N':['north','b','a'][lot['variant']%3],'E':'east','W':'west','S':['a','b','north'][lot['variant']%3]}[face]")
s=s.replace("elif lot['floors']==1 or (face=='N' and lot['variant']==0):roof=asset(f'roof-a-w{w}-d2-c7')", "elif face in 'NS' and lot['variant']!=1:roof=asset(f'roof-a-w{w}-d2-c7')")
s=s.replace("str(lot['variant'])+'-c5-w2'", "str(lot['variant']%2)+'-c5-w2'")
s=s.replace("dict(id='craft',rect=[144,768,336,240]", "dict(id='craft',rect=[144,768,384,288]")
s=s.replace("dict(id='southwest',rect=[144,1104,432,240],floors=2,roof='terracotta'", "dict(id='southwest',rect=[144,1104,432,240],floors=2,roof='brown'")
s=s.replace("dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True,reserved_cells=[[x,y] for x in range(4,8) for y in range(2)]", "dict(id='south-artisans',rect=[624,1056,432,288],floors=1,roof='brown',poor=True,reserved_cells=[[x,y] for x in range(4,8) for y in range(3)]")
s=s.replace("('craft-return',[480,816,48,192])", "('craft-return',[528,768,48,48])")
s=s.replace("('yard-2',336,480,'northwest-laundry')", "('yard-1',336,480,'northwest-laundry')")
s=s.replace("('sorting-table-c7',1536,480,'sorting-table')", "('sorting-table-c7',1536,480,'sorting-table')")
s=s.replace("if q['block']=='south-artisans':q['floors']=1", """if q['block']=='south-artisans':q['floors']=1
        if q['block']=='southeast' and q['facing']=='N':q['floors']=1
        if q['block']=='northeast' and q['facing']=='N':q['floors']=[2,3,2][q['variant']%3]
        if q['block']=='northeast' and q['facing']=='S' and q['footprint'][0] in [1440,1536]:q['floors']=1
        if q['block']=='inn' and q['facing']=='N' and q['footprint'][0]==1296:q['floors']=5
        if q['block']=='inn' and q['facing']=='S':q['floors']=2
        if q['block']=='craft' and q['facing']=='S':q['floors']=2
        if q['block']=='southwest' and q['facing']=='N':q['floors']=1""")
s=s.replace("    im.alpha_composite(turn.crop((0,0,48,48)),(1053,957))  # full native transition; kerbs lie outside the clear route", "    # Native transition surface at the actual48px jog. Only the painted gutter\n    # is outside the96px walking corridor; no offset square patch over the square.\n    im.alpha_composite(turn,(1056,960))")
# Never reapply the sign over an occupied window. The repaired inn contains its
# own registered blank mounting bay and physical sign.
s=s.replace("        if p['id']=='inn-porch':\n            sign=asset('sign-inn-c7');a.alpha_composite(sign,(0,144));item['a']=a\n", "")
# Replace leftover flat texture cells by shared pitched rear wings.
start=s.index('    # Painted roofed rear wings, each assigned to its parent property.',s.index('def c7_render('));end=s.index('    for q in l[\'lots\']:',start)
s=s[:start]+'''    # Whole drawn pitched wings, grouped by actual contiguous interior cells.
    for b in l['blocks']:
        for wing in c7_rear_wings(b,l['lots']):im.alpha_composite(wing['a'],(wing['x'],wing['y']))
        bx,by,_,_=b['rect']
        for xx,yy in b['court_cells']:im.alpha_composite(asset('packed-yard-c6r1').crop((0,0,48,48)),(bx+48*xx,by+48*yy))
'''+s[end:]
start=s.index('    for q in owners:\n',s.index('def c7_assemble_block('));end=s.index('    for q in sorted(owners',start)
s=s[:start]+'''    for wing in c7_rear_wings(block,lots):out.alpha_composite(wing['a'],(wing['x']-x,wing['y']-top))
'''+s[end:]
# Adjacent wall casts share one continuous receiver; no ownership seam clips
# the neighboring shadow before union. Receiver pixels remain attributed.
s=s.replace("        owner=ImageChops.subtract(owner,claimed);claimed=ImageChops.lighter(claimed,owner)", "        if not q.get('wall'):\n            owner=ImageChops.subtract(owner,claimed);claimed=ImageChops.lighter(claimed,owner)")
s=s.replace("'C7 critic1 repair / 48px cells / 1x'","'C7 critic2 redraw / 48px cells / 1x'")
# Rear wings have a drawn ridge, slope, shaded hip and eave. Interior surface
# tiles never substitute for the volume; all pixel operations are composition.
helper='''def c7_rear_wings(block,lots):
    bx,by,_,_=block['rect'];todo=set()
    for q in lots:
        if q['block']==block['id']:todo.update(map(tuple,q.get('rear_wing_cells',[])))
    result=[]
    while todo:
        x,y=min(todo,key=lambda q:(q[1],q[0]));w=1
        while w<3 and (x+w,y) in todo:w+=1
        rows=1
        while rows<3 and all((x+dx,y+rows) in todo for dx in range(w)):rows+=1
        for yy in range(rows):
            for xx in range(w):todo.remove((x+xx,y+yy))
        depth=3 if rows>=3 else 2
        roof=c7_tone(asset(f'roof-a-w{w}-d{depth}-c7'),block['roof'])
        # The roof projects north above its ground cells, as every other roof.
        base=by+(y+rows)*48;top=base-roof.height
        result.append(dict(a=roof,x=bx+x*48,y=top,base=base,cells=[x,y,w,rows],roof=f'roof-a-w{w}-d{depth}-c7'))
    return result


'''
pos=s.index('def c7_assemble_block(');s=s[:pos]+helper+s[pos:]
p.write_text(s)
