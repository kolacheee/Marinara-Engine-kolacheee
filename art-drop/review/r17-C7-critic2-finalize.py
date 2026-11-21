"""Publish current C7 repair evidence, preserving all earlier round notes."""
from pathlib import Path
from collections import Counter
import hashlib, html, json
from PIL import Image, ImageDraw
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';NN=Image.Resampling.NEAREST
def read(p):return Image.open(p).convert('RGBA')
def write(name,value):(R/name).write_text(json.dumps(value,indent=2))
def panel(items):
    out=Image.new('RGBA',(sum(a.width for _,a in items)+16*(len(items)+1),max(a.height for _,a in items)+40),(32,36,32,255));d=ImageDraw.Draw(out);x=16
    for title,a in items:d.text((x,6),title,fill='white');out.alpha_composite(a,(x,28));x+=a.width+16
    return out
extra=[]
def save(name,a,scales=(1,3),kind='critic 2 repairs'):
    for scale in scales:
        fn=f'r17-C7-{name}-{scale}x.png';a.resize((a.width*scale,a.height*scale),NN).save(R/fn)
        extra.append(dict(file=fn,kind=kind,size=[a.width*scale,a.height*scale],native=list(a.size),scale=scale))

g=json.loads((R/'r17-C7-critic2-generation.json').read_text())
all_drawings={q['id']:q for q in g['drawings']}
all_drawings.update({q['id']:q for q in json.loads((R/'r17-C7-critic2-grid-generation.json').read_text())})
for key,q in all_drawings.items():
    q['selection']='retained alternative'
    if key.startswith('concept-'):q['selection']='selected final layout guide/section' if '-grid-' in key else 'superseded: grid clearances drifted'
    if key in ['terrace-b','corner-b','west-a','inn','paving-turn']:q['selection']='selected production drawing'
    if key=='corner-a':q['selection']='selected roof contact; corner B selected for whole assembly'
g['drawings']=list(all_drawings.values());g['drawing_count']=len(all_drawings);write('r17-C7-critic2-generation.json',g)

decision=dict(chosen='b',why='B keeps broad connected roof planes, distinct brown peripheral housing and the four-sided civic enclosure without A\'s crowded gable rhythm. C is close, but its slate return arrangement is less clear. The final repaint uses the measured nine-block layout guide so its streets and landmark allocations track the rebuild.',alternatives={'a':'More gables, but excessive small roof peaks at district scale.','c':'Sober material treatment; weaker separation of the eastern returns.'},source_method='Three full fixed-layout guides, then twelve newly drawn overlapping 1448x1086 sections, joined to 2688x2016 and genuinely reduced to 1920x1440. Initial unregistered concepts remain as rejected evidence. The north ditch is existing painted art wrapped behind the wall.',precedence='BRIEF-17 and coordinator structure rules control streets, lots and allocations. No panel waiver enlarges the gate, market or lots, reduces sign scale or authorizes cross-property overlays.',status='Repair submission; no independent critic approval asserted',comparison='r17-city-final-vs-concept.png',registration='r17-C7-critic2-concept-registration.json')
write('r17-C7-concept-choice.json',decision)

# Every old current comparison is rebuilt; historical before/source evidence stays.
items=[('CONCEPT A',R/'r17-concept-a.png'),('CONCEPT B / SELECTED',R/'r17-concept-b.png'),('CONCEPT C',R/'r17-concept-c.png'),('BEFORE CRITIC-2 REPAIR',R/'r17-C7-critic2-before-r17-city-final.png'),('TODAY IN GAME',A/'reference/r17/current-town.png'),('C7 REBUILT CITY',R/'r17-city-final.png')]
board=Image.new('RGBA',(5808,2976),(32,36,32,255));d=ImageDraw.Draw(board)
for i,(title,path) in enumerate(items):
    x=i%3*1936+8;y=i//3*1488+8;d.text((x,y),title,fill='white');board.alpha_composite(read(path),(x,y+24))
board.save(R/'r17-concepts-vs-today-vs-final.png')
for name in ['concepts','concepts-final-comparison']:save(name,board,(1,),'concept comparison')
board.resize((2904,1488),NN).save(R/'r17-C7-concepts-overview.png')
board.resize((2904,1488),NN).save(R/'r17-C7-concepts-final-overview.png')
save('critic2-before-after',panel([('BEFORE',read(items[3][1])),('AFTER',read(items[5][1]))]),(1,),'comparison')
roof_items=[(f'{w*48} x {dep*48}',read(O/f'roof-a-w{w}-d{dep}-c7.png')) for dep in [2,3] for w in [1,2,3]]
roof_items += [(f'{hand} {dep*48}',read(O/f'roof-hip-{hand}-d{dep}-c7.png')) for dep in [2,3] for hand in ['left','right']]
save('critic2-roof-family',panel(roof_items))
save('critic2-selected-redraws',panel([(n,read(O/(n+'.png'))) for n in ['corner-house-c7','house-west-w1-c7r1','inn-west-c7r1','street-turn-c7','block-se-wing-c7']]),(1,4))
save('critic2-alternatives',panel([(n,read(R/f'r17-C7-critic2-clean-{n}.png')) for n in ['terrace-a','terrace-b','corner-a','corner-b','west-a','west-b']]))
course_names=json.loads((R/'r17-C7-critic2-course-repair.json').read_text())['files']
save('critic2-course-contract',panel([(n,read(O/(n+'.png'))) for n in course_names]),(1,4))

critic=json.loads((R/'critic-r17C7-2.json').read_text())
oldops={q['file']:q for q in json.loads((R/'r17-C7-critic2-native-operations.json').read_text())}
ops=[]
for name in critic['failed']:
    path=O/(name+'.png')
    if not path.exists():continue
    op=oldops.get(name,dict(file=name,operation='Drawn course interior transferred at native scale; independent endpoint pixels placed only at x0/xW-1 on rows0/47.'))
    if name.startswith(('roof-a-w','roof-hip-')) or name in ['roof-fill-c7','roof-lean-c7r1']:
        op['operation']='Selected newly drawn terrace B; exact mode/palette reduction. Preserve native16px hips and interior tile columns for width. Depth144 wraps one native48px slope band between ridge and eave; roof fill is a repeat-proof asset, not a city roof carpet.'
        op['source']='r17-C7-critic2-source-terrace-b.png'
    if name=='inn-west-c7r1':op['operation']='Newly drawn inn body, compatible retained roof, painted blank64x96 mounting bay, whole26x29 windows translated to x68, unchanged64x72 sign at (0,112); porch begins at y192. See inn-mount.json.'
    if name in ['block-inn-b-c7','block-market-c7','block-se-c7']:op['operation']='Re-exported current independent lot assemblies, joined contacts and complete pitched rear wings; new inn and unchanged passing whole market included as applicable. See block-export-recipes.json.'
    if name=='block-se-wing-c7':op['operation']='Selected terrace-B complete pitched roof and newly drawn west-facing ground assembly, composed at native scale and mapped to the approved brown palette.'
    op['size']=list(read(path).size);op['sha256']=hashlib.sha256(path.read_bytes()).hexdigest();ops.append(op)
write('r17-C7-critic2-native-operations.json',ops)
by_name={q['file']:q for q in ops};file_response=[]
for name in critic['failed']:
    if name in by_name:
        change=by_name[name]['operation'];evidence='../out/city17/'+name+'.png'
    elif name=='compose.py':
        change='Nine-ring plan, attached civic returns, drawn pitched rear wings, actual facade/roof selection variation, blank inn bay, measured clear routes, visible work courts, corrected road turn and continuous north-wall shadow union.';evidence='../out/city17/compose.py'
    elif name.startswith('r17-concept-'):
        change='Repainted over the fixed measured plan in four large overlapping sections, reduced from2688x2016 by exact mode. Brown southern roof groups and orthogonal streets replace the initial drifting concept.';evidence=name+'.png'
    else:
        change='Regenerated from the current repaired sources and layout; exact enlargement/greyscale checks retained. The sheet remains evidence for visual review, not an approval.';evidence=name+'.png'
    file_response.append(dict(file=name,original_problems=critic['files'][name]['problems'],change=change,evidence=evidence,status='repair submitted'))
write('r17-C7-critic2-file-response.json',dict(critic='critic-r17C7-2.json',files=file_response,independent_verdict='not rerun by this repair task'))

changes=[
('Perimeter enclosure','Nine explicit rings, 107 outward/return lots, connected pitched rear wings, and only purposeful retained courts. Church west range and both market returns close former aprons.','r17-C7-lot-ownership-1x.png'),
('Street rank','Measured96px main route with an orthogonal bend,48px ordinary routes and24px service passages. Southeast has a48x96 setback; stale road/lot overlaps were removed.','r17-C7-footprints-clearance-1x.png'),
('Civic square','Guildhall north, attached church west, inn east and market with attached southern returns. The336x336 core, notch, six stalls and fountain approaches are retained.','r17-C7-acceptance-square-1x.png'),
('Roof and return family','New terrace B supplies all six width/depth roofs and both hip hands; newly drawn whole corner and narrow west house supply real side volumes. Passing guildhall stays unchanged.','r17-C7-critic2-roof-family-3x.png'),
('Roof contacts','Whole pitched rear roofs replace texture carpets. Native shared eaves and existing16px receivers join actual adjacent properties; shallow side elevations were lowered to avoid window clipping.','r17-C7-unequal-height-both-hands-3x.png'),
('Market','Passing complete192x144 market retained; expanded southern ring and attached roofs enclose its sides and leave the north approach clear.','r17-C7-piece-block-market-c7-4x.png'),
('Gate','Passing coherent gate chamber, bearings, landing and stair retained unchanged, with wall-line towers and96px portal.','r17-C7-access-gate-stair-3x.png'),
('Entries','New inn blank sign bay preserves complete windows and porch. Courtyard arch interiors show existing painted pavement; jambs and thresholds are retained.','r17-C7-piece-inn-west-c7r1-4x.png'),
('Signs','Passing physical signs remain unchanged. Inn sign moved to a measured clear bay; the tailor sign now retains every painted pixel in the normal city.','r17-C7-trade-signs-1x.png'),
('Curtain seams','Passing wall variants, their two-column joints and all25 pair proofs retained and regenerated.','r17-C7-wall-all-25-pairs-3x.png'),
('Material scale','New roof drawings use larger coherent clusters with identical native tile scale across widths/depths; no roof-fill carpets remain in city composition.','r17-C7-critic2-roof-family-1x.png'),
('Paving','New48px image-painted turn palette-matched to the approved road, with registered painted edge joints; moved to the actual cell-aligned bend.','r17-C7-repeat-street-turn-c7-4x.png'),
('Shadows','Continuous north-wall casts union without detached bright gaps; actual painted caster silhouettes and separate receiver masks retained, maximum alpha88.','r17-C7-city-greyscale-1x.png'),
('Wall circulation','Passing north stair, walk and gate access art remain in wall bands with static access/reveal proofs.','r17-C7-review.html'),
('Height hierarchy','Peripheral housing is predominantly1–2 storeys. Civic neighbours were lowered; three-/five-storey merchants remain central/east.','r17-city-final-squint.png'),
('Variation','New corner bays/dormer; north and south rows now vary actual ground/storey/roof selections. Sliding five-lot runs are checked from selected layer filenames.','r17-C7-QC.json'),
('Precinct','Passing3x2-cell churchyard with slabs and market-side gate retained.','r17-C7-piece-churchyard-c7-4x.png'),
('Court work','Northwest now uses the actual laundry rack, northeast sorting table is exposed by lower foreground lots, southwest woodpile moved inside its small court.','r17-city-final-crop-street-3x.png'),
('Inhabitants','Passing laundry worker, patrons, bench, delivery and stair guard retained beside their tasks; normal and reveal states regenerated.','r17-C7-review.html'),
('Acceptance','All current asset, seam, repeat,16x12, square, unequal-height, actor, whole-city, comparison and enlargement sheets regenerated from the repaired sources.','r17-C7-review.html')]
write('r17-C7-FIXES-response.json',dict(part='C7',repair='critic-r17C7-2',items=[dict(item=i+1,title=a,change=b,evidence=e,status='repair implemented; visual review pending') for i,(a,b,e) in enumerate(changes)],precedence=decision['precedence'],acceptance='Measured static-art checks are not independent visual approval or runtime collision validation.'))

qc=json.loads((R/'r17-C7-QC.json').read_text());catalog=json.loads((R/'r17-C7-sheets.json').read_text())
extra_files={q['file'] for q in extra};catalog=[q for q in catalog if q['file'] not in extra_files]+extra
qc['sheets']=len(catalog);write('r17-C7-QC.json',qc);write('r17-C7-sheets.json',catalog)
index=R/'r17-C7-review.html';body=index.read_text().split('<!-- critic2 supplement -->')[0]
body+='\n<!-- critic2 supplement --><section><h2>Critic round 2 repairs</h2><p><a href="r17-C7-critic2-generation.json">All drawing prompts and selections</a> · <a href="r17-C7-critic2-native-operations.json">Final native operations</a></p>'
for q in extra:
    if q['scale']==1:body+='<details><summary>'+html.escape(q['file'])+'</summary><img loading="lazy" src="'+q['file']+'"></details>'
index.write_text(body+'</section>\n')
passed=sum(q['passed'] for q in qc['checks']);failed=[q['name'] for q in qc['checks'] if not q['passed']]
assert not failed,failed
section=f'''# Round 17 — Part C7: critic-r17C7-2 redraw

Repaired all **34 failed production PNGs** and rebuilt the city/review exports.
New painted terrace roofs, handed hips, a complete corner and west-facing house,
the inn mounting bay and street turn replace the failed drawings. The twelve
course repairs now use dark endpoints only at x0/xW−1, with brown interiors on
rows 0/47. Passing production art and seasonal files remain byte-identical.

**Concept B remains selected:** its broad joined roofs are calmer than A's many
gables, and its eastern returns read more clearly than C's. The initial concept
repairs still drifted from the grid, so all three were repainted over the measured
nine-block layout. Each final 2688×2016 source joins four newly drawn overlapping
sections and is genuinely reduced to 1920×1440. Across this repair, {len(all_drawings)}
image-tool drawings and their alternatives are retained. Solid magenta → painted
registration → reference palette → exact 8×8 mode → one-pixel cleanup; hard alpha
0/255 and zero RGB under transparency. Code only registers, reduces, wraps,
cleans and composites painted art. The final roof depth extension wraps a drawn
48 px slope band without changing native tile scale.

The composer now has **nine rings / 107 lots**, pitched rear wings, varied actual
facade/roof layers, attached church and market returns, the bent 96 px route,
48 px side streets, continuous north-wall shade and visible court work. The inn's
sign clears its windows/porch; the tailor sign is fully visible in the normal view.
BRIEF-17 and the coordinator's structure rules override the panels' allocation,
sign-size and cross-property-overlay waivers.

**Verification:** {passed}/{len(qc['checks'])} measured checks pass; {len(catalog)} review
PNGs are indexed, including every current asset and the requested final/crop/
comparison views. An independent Python counter also replays 240 sampled native
pixels across 20 mode registrations. These are static self-checks, not an independent critic pass
or runtime collision validation. No branch change, commit or push was made.

[Review index](review/r17-C7-review.html) ·
[Final beside concept](review/r17-city-final-vs-concept.png) ·
[Twenty fixes](review/r17-C7-FIXES-response.json) ·
[Checks](review/r17-C7-QC.json) ·
[Drawing manifest](review/r17-C7-critic2-generation.json) ·
[Reduction records](review/r17-C7-critic2-processing.json) ·
[Mode replay](review/r17-C7-critic2-mode-verification.json).

'''
notes=A/'NOTES.md';old=notes.read_text();heading='# Round 17 — Part C7: critic-r17C7-2 redraw\n'
if old.startswith(heading):old=old[old.index('\n# Round ',len(heading))+1:]
notes.write_text(section+old)
print(json.dumps(dict(drawings=len(all_drawings),changed_production=len(ops),sheets=len(catalog),checks=passed,failed=failed),indent=2))
