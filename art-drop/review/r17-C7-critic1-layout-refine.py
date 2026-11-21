from pathlib import Path
p=Path('art-drop/out/city17/compose.py');s=p.read_text()
s=s.replace("dict(id='market',rect=[768,1056,288,144],floors=1,roof='brown',reserved_cells=[[x,y] for x in range(1,5) for y in range(2)]),",'')
s=s.replace("dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True)","dict(id='south-artisans',rect=[624,1200,432,144],floors=1,roof='brown',poor=True)")
s=s.replace("square=[768,672,336,336],square_notch=[1056,960,48,48]", "square=[768,720,336,336],square_notch=[1056,1008,48,48]")
s=s.replace("prop('market-north-c7',816,1152,id='market-hall',footprint=[816,1008,192,144],entrance=[888,1008]", "prop('market-north-c7',816,1200,id='market-hall',footprint=[816,1056,192,144],entrance=[888,1056]")
s=s.replace("prop('church-b-c7',528,1008,id='church',footprint=[528,720,240,288],entrance=[768,960]", "prop('church-b-c7',528,1056,id='church',footprint=[528,768,240,288],entrance=[768,1008]")
s=s.replace("prop('churchyard-c7',624,720,id='church-precinct',footprint=[624,624,144,96])", "prop('churchyard-c7',624,768,id='church-precinct',footprint=[624,672,144,96])")
# Projected mid-block north roofs now meet the northern street after one cell.
s=s.replace("dict(id='craft',rect=[144,816,336,192]", "dict(id='craft',rect=[144,768,336,240]")
s=s.replace("dict(id='inn',rect=[1200,816,288,192]", "dict(id='inn',rect=[1200,768,288,240]")
s=s.replace("reserved_cells=[[0,2],[1,2],[0,3],[1,3]]", "reserved_cells=[[0,3],[1,3],[0,4],[1,4]]")
s=s.replace("dict(id='east-trades',rect=[1536,816,240,192]", "dict(id='east-trades',rect=[1536,768,240,240]")
s=s.replace("dict(id='southwest',rect=[144,1152,432,192]", "dict(id='southwest',rect=[144,1104,432,240]")
s=s.replace("dict(id='southeast',rect=[1200,1152,576,192]", "dict(id='southeast',rect=[1200,1104,576,240]")
# A true 48x96 notch; western route turns into its rear-lane T.
s=s.replace("notches=[[0,0],[0,1],[1,0],[1,1]],court_cells=[[7,1]]", "notches=[[0,0],[0,1]],court_cells=[[7,1]]")
s=s.replace("('se-wedge-elbow',[1152,1152,96,96])", "('se-wedge-elbow',[1152,1104,96,96])")
# Wider roof planes replace the long skinny peripheral caps.
s=s.replace("if lot.get('deep_roof'):roof=asset(f'roof-a-w{w}-d3-c7')", "if lot.get('deep_roof'):roof=asset(f'roof-a-w{w}-d3-c7')\n    elif lot['floors']==1 or (face=='N' and lot['variant']==0):roof=asset(f'roof-a-w{w}-d2-c7')")
s=s.replace("for q in l['lots']:\n        if q['block']=='northwest'", "for q in l['lots']:\n        if q['block']=='south-artisans':q['floors']=1\n        if q['block']=='northwest'")
# Every eight-cell ordinary run changes through a genuine adjoining T/apron.
s=s.replace("road('nw-court-passage'", "road('west-trade-apron',[384,1008,96,96])\n    road('east-trade-apron',[1488,1008,96,96])\n    road('northwatch-return',[864,192,48,144])\n    road('southwatch-return',[864,1296,48,96])\n    road('nw-court-passage'")
s=s.replace("('northwest-wood'", "('northwest-wood'")
# Retained courts and entrance approaches are expressed in ground coordinates.
s=s.replace("('sorting-table-c7',1536,480", "('sorting-table-c7',1536,480")
s=s.replace("('bench-c7',1200,1024", "('bench-c7',1200,1056").replace("('inn-patron-a-c7',1210,1024", "('inn-patron-a-c7',1210,1056").replace("('inn-patron-b-c7',1236,1028", "('inn-patron-b-c7',1236,1060")
# Inn's sign occupies its drawn blind mounting bay above the porch, once.
s=s.replace("if p['id']=='market-hall':item['roofmask']", "if p['id']=='inn-porch':\n            sign=asset('sign-inn-c7');a.alpha_composite(sign,(0,144));item['a']=a\n        if p['id']=='market-hall':item['roofmask']")
s=s.replace("if reveal and item.get('roofmask'):", "if reveal and item.get('roofmask') and (reveal is True or q['id'] in reveal):")
p.write_text(s)
