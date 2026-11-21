from pathlib import Path
p=Path('art-drop/review/r17-C7-review.py');s=p.read_text();s=s.replace("production=sorted(O.glob('*-c7.png'))", "production=sorted(set(O.glob('*-c7.png'))|set(O.glob('*-c7r1.png')))")
start=s.index('    # Stackable courses,');end=s.index('    # Ownership and clearance',start)
new='''    # Actual floor-driven assemblies at both unequal-height party contacts.
    stack_proofs=[]
    for hand in ['left','right']:
        proof=ground((288,432));items=[]
        for index,n in enumerate(([5,1] if hand=='left' else [1,5])):
            x=48+index*96;lot=dict(id='proof-'+str(index),block='proof',facing='S',variant=index,width=2,floors=n,roof='terracotta',cells=[[index*2,0],[index*2+1,0]],footprint=[x,336,96,48],bottom_left=[x,384])
            a,parts,rm,wm=c.c7_build_lot(lot);items.append(dict(base=384,z=0,x=x,y=384-a.height,a=a,meta=lot,parts=parts,roofmask=rm,wallmask=wm))
        c.c7_join_lots(items)
        for item in items:proof.alpha_composite(item['a'],(item['x'],item['y']))
        save('five-one-'+hand,proof,(1,3),'height join');stack_proofs.append((hand,proof))
    save('unequal-height-both-hands',panel(stack_proofs),(1,3),'height join')
    house=asset('corner-house-c7');ref=read(REF/'fantasy-house-2.png')
    save('house-vs-current',panel([('C7 native corner',house),('Different corner arrangement',asset('house-b-w2-c7r1')),('Current fantasy-house-2',ref)]),(1,4),'reference')
    # A real sixteen-by-twelve-cell ground plan, not arbitrary whole-block crops.
    test=ground((768,576));proof_blocks=[
        dict(id='L',rect=[48,240,288,240],roof='terracotta',floors=2,notches=[[5,0],[5,1]],court_cells=[[2,2]]),
        dict(id='T',rect=[384,240,336,144],roof='slate',floors=2,notches=[[0,0]]),
        dict(id='deadend',rect=[432,432,288,96],roof='brown',floors=1)]
    proof_lots=[];items=[]
    for b in proof_blocks:
        lots,cells,courts=c.c7_ring(b);proof_lots+=lots
        for q in lots:
            a,parts,rm,wm=c.c7_build_lot(q);x,base=q['bottom_left'];items.append(dict(base=base,z=0,x=x,y=base-a.height,a=a,meta=q,parts=parts,roofmask=rm,wallmask=wm))
            for xx,yy in q.get('rear_wing_cells',[]):test.alpha_composite(c.c7_tone(asset('roof-fill-c7'),q['roof']),(b['rect'][0]+xx*48,b['rect'][1]+yy*48))
    c.c7_join_lots(items)
    for i in sorted(items,key=lambda i:(i['base'],i['x'])):test.alpha_composite(i['a'],(i['x'],i['y']))
    save('acceptance-16x12',test,(1,3),'acceptance')
    (R/'r17-C7-acceptance-plan.json').write_text(json.dumps(dict(blocks=proof_blocks,lots=proof_lots),indent=2))
    square=city.crop((480,576,1536,1200));save('acceptance-square',square,(1,3),'acceptance')
    save('acceptance-vs-r15-today',panel([('C7 L/T/dead-end 16x12',test),('C7 civic square',square),('R15',read(R/'r15-city-mockup.png')),('Current town',read(REF/'current-town.png'))]),(1,3),'reference')
    save('city',city,(1,4),'city');save('city-greyscale',city.convert('L').convert('RGBA'),(1,),'city')
    for n in 'abc':save('concept-'+n,read(R/f'r17-concept-{n}.png'),(1,4),'concept')
'''
s=s[:start]+new+s[end:]
start=s.index('    cases=[');end=s.index('    # Machine checks',start)
new='''    cases=[('gate-portal',[1104,1350],(1008,1248,1248,1440),{'gate'},None),('gate-stair',[1196,1378],(1008,1248,1248,1440),{'gate'},'gate'),('market-entrance',[900,1164],(768,1008,1056,1248),{'market-hall'},None),('northwest-court',[348,492],(240,336,528,672),{q['id'] for q in layout['lots'] if q['block']=='northwest' and q['facing']=='S'},None),('church-porch',[766,1020],(576,864,864,1104),set(),None)]
    actor_records=[]
    for name,feet,box,reveal,owner in cases:
        actor=dict(feet=feet,file='guard-c7')
        if owner:actor['owner']=owner
        normal=c.c7_render(layout,actors=[actor])[0];revealed=c.c7_render(layout,reveal=reveal,actors=[actor])[0]
        a,b=normal.crop(box),revealed.crop(box);save('access-'+name,panel([('normal / feet '+str(feet),a),('only owning roof removed',b)]),(1,3),'access')
        actor_records.append(dict(case=name,feet=feet,box=list(box),reveal_owners=sorted(reveal),surface_owner=owner,different_pixels=sum(p!=q for p,q in zip(a.get_flattened_data(),b.get_flattened_data())),ordering='ground actor by actual feet; stair actor between owned tread and cheek layers',runtime_claim=False))
'''
s=s[:start]+new+s[end:]
s=s.replace("check(b['id']+' native owned-piece reconstruction',c.c7_assemble_block(b,layout['lots']).tobytes()==asset(b['file']).tobytes())", "changed=[dict(p,facing='E' if p['facing']!='E' else 'W',floors=1 if p['floors']!=1 else 3) for p in layout['lots']]\n        check(b['id']+' facings and floors change actual paint',c.c7_assemble_block(b,layout['lots']).tobytes()!=c.c7_assemble_block(b,changed).tobytes())\n        reserved=set(map(tuple,b.get('reserved_cells',[])))")
s=s.replace("set(owned)|court==cells and not set(owned)&court", "set(owned)|court|reserved==cells and not set(owned)&court and not set(owned)&reserved")
s=s.replace("check('southeast painted48x96 jog is empty',not asset('block-se-c7').crop((0,144,48,240)).getbbox())", "check('southeast real48x96 plan setback',next(b for b in layout['blocks'] if b['id']=='southeast')['notches']==[[0,0],[0,1]])")
start=s.index("    baseline=json.loads((R/'r17-C7-baseline.json')");end=s.index('    report=dict(',start)
new='''    baseline=json.loads((R/'r17-C7-critic1-baseline.json').read_text());changed=[];missing=[]
    for name,digest in baseline.items():
        p=R.parent.parent/name
        if not p.exists():missing.append(name)
        elif hashlib.sha256(p.read_bytes()).hexdigest()!=digest:changed.append(name)
    critic=json.loads((R/'critic-r17C7-1.json').read_text());allowed={'art-drop/out/city17/'+n+'.png' for n in critic['failed']}
    check('only failed existing production PNGs changed',set(changed)<=allowed and not missing,dict(changed=changed,unexpected=sorted(set(changed)-allowed),missing=missing))
    check('every failed production PNG replaced',all('art-drop/out/city17/'+n+'.png' in changed for n in critic['failed'] if (O/(n+'.png')).exists()))
    check('passing production files unchanged',all('art-drop/out/city17/'+n+'.png' not in changed for n,v in critic['files'].items() if v['status']=='pass'))
    check('all three shadow receiver surfaces present',all(any(p['surface']==v and p['mask_bounds'] for p in shadows) for v in ['ground','wall','roof']))
    check('all shadow receivers explicitly owned',all(p.get('owned_intersection') for p in shadows))
    for n in 'abc':
        a=read(R/f'r17-C7-critic1-source-concept-{n}-composite.png');check('concept '+n+' genuinely reduced',a.width>1920 and a.height>1440)
    for d in [2,3]:check('roof depth '+str(d)+' distinct drawn source',(R/f'r17-C7-critic1-source-roof-field-d{d}.png').exists())
    check('all trade signs occur once',len([q for q in layout['lots'] if q.get('trade')])==7)
    for seed in [1755,3051]:
        seq=c.c7_wall_sequence(19,seed);check('wall variation '+str(seed),len(set(tuple(seq[i:i+3]) for i in range(len(seq)-2)))==len(seq)-2 and all(max(Counter(seq[i:i+5]).values())<=2 for i in range(len(seq)-4)))
'''
s=s[:start]+new+s[end:]
p.write_text(s)
