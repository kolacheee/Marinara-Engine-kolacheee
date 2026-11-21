"""Write the C7 evidence index, decision record and top-of-file round notes."""
from pathlib import Path
import json,re
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';NN=Image.Resampling.NEAREST
def read(p):return Image.open(p).convert('RGBA')
generation=json.loads((R/'r17-C7-generation.json').read_text())
selected={'concept-a','concept-b2','concept-c2','block-nw-a','block-ne','block-civic','block-west','block-east','block-sw','block-sm','block-se-repaint','wall-strip','paving','life','church-b','street-turn-b','corner-b','inn-access','churchyard','tower-b','roof-family-c','market-north-c','gate-stone-d','corner-bastion','trade-signs'}
for g in generation:g['selection']='selected' if g['id'] in selected else 'superseded or rejected alternative'
(R/'r17-C7-generation.json').write_text(json.dumps(generation,indent=2))
decision=dict(chosen='r17-concept-b.png',source='concept-b2',reason='Strongest continuous terraced perimeter blocks and the clearest church-west / guildhall-north / inn-east / market-south civic room. Its mixed roofs, gate road and closed blocks provide one drawing treatment for the rebuild.',alternatives={'a':'Kept as a comparison: weaker street rank and less decisive square enclosure.','c':'Kept as a comparison: compact rings, but weaker market grouping.','a2':'Rejected: simplified treatment loses the reference materials.'},precedence=['Coordinator C7 structure rules control the composed plan when a concept differs.','BRIEF-17 controls allocations, 1-2-cell lot footprints, 48px courses, required bends, signs and bounded overlays.','Panel suggestions to deepen footprints, widen the gate core, shrink signs, waive street variation or permit cross-property overlays were not adopted.','The explicit full C7 district request supersedes the older small-pilot/defer-expansion recommendation.'],registration='Tool concept originals are 1448x1086. They are enlarged during registration to 1920x1440; the 8x working canvas is a sampling registration, not additional original drawing resolution. Individual production assets are reduced from larger painted sources.')
(R/'r17-C7-concept-choice.json').write_text(json.dumps(decision,indent=2))
fixes=[
('Enclosed properties','Ten complete painted perimeter blocks replace the old detached groups. compose.py assigns 114 outward/return lots, 1-2 cells wide/deep, with attached rear-wing cells and explicit court ownership. Native owned-piece reconstruction preserves every painted contact.','r17-C7-lot-ownership-1x.png'),
('Street rank and bend','96px gate route bends beside the southeast jog; ordinary routes are48px and the northwest service passage24px. East-trade and inn returns face the north-south streets. Plan/clearance data are separate from painted projection.','r17-C7-footprints-clearance-1x.png'),
('Civic enclosure','Guildhall north, east-porch church west, west-facing inn east and north-opening market south. The paving field has a48px northwest notch. Six48px stalls occupy two staggered triplets, with the fountain/cross in the open middle.','r17-C7-acceptance-square-1x.png'),
('Roof and return standard','Whole registered block paintings establish continuous roof/front/return treatment. New48/96/144px caps at96/144px depths, a merchant corner, native16px receivers and fixed-course corner floor units supply the modular proof. The hall painting includes three exposed arcade bays, clock and paired banners.','r17-C7-house-vs-current-4x.png'),
('Closed roof contacts','Ring roofs and rear wings are drawn together. Handed native hip adapters, roof fill and16x48 firewall crops are supplied. The unequal-height proof fills only the gap bounded by the actual two painted contours, using the drawn receiving masonry.','r17-C7-unequal-height-both-hands-3x.png'),
('Whole market','Selected the third whole-hall painting: four bays on the north/square side and a complete roof towards the south.192x144 pavilion remains an individual export; its attached rear ranges form the southern block.','r17-C7-piece-market-north-c7-4x.png'),
('Whole gate','Selected the grey-stone redraw with one continuous chamber, arch bearings, right doorway, landing and stair.192x192 context assembly is split into the required144x192 gate core and48px stair from the SAME drawing.96px passage is retained.','r17-C7-access-gate-stair-3x.png'),
('Entries and passages','Repainted church east porch and inn west access at ground level. Whole block frontages show lit thresholds/lanterns and dark shuttered scenery openings; court arches retain visible paving. Separate inn bench and patrons leave the public route clear.','r17-city-final-crop-square-3x.png'),
('Physical trade signs','Eight newly drawn64x72 hanging assemblies retain twice-R15 dimensions: loaf, bottle, scissors, quill, bed/tankard, hammer/anvil, boot and ham. Thin contours, lit rims, shaded thickness and hooks replace miniature embedded symbols as the primary trade cues.','r17-C7-trade-signs-1x.png'),
('Wall seams','The continuous480x144 painted strip supplies five variants. Its native two-column stone edge is registered consistently on both sides of each module, including all25 ordered pairs. Short variants retain the drawn top and foot.','r17-C7-wall-all-25-pairs-3x.png'),
('Material scale','Quiet broad wall stones replace scratch bands. Third roof atlas was selected for finer tile clusters. Native palette mapping removes the inn key fringe and unifies southern brown roof material without changing silhouettes.','r17-C7-wall-five-module-strip-3x.png'),
('Paving and drainage','Four image-painted48x48 variants use three close stone values and wrapped native edges. The main route uses the same family; native3px painted kerb/gutter strips turn around the connected route rectangles.','r17-C7-paving-variant-field-4x.png'),
('Structural shade','Ground casts sample actual painted silhouette rows, with12px stall /24px low /48px medium /60px tall reach, southeast offsets and88/255 opacity. Receiver masking excludes occupied painting; overlapping shade is unioned. Contact/eave/jetty shade is part of each painting.','r17-C7-city-greyscale-1x.png'),
('Wall circulation','North stair, drawn48x24 walk surfaces and tower doorways connect along the wall. The east gate stair reaches its chamber door. All interval towers stay in perimeter bands; a broader northwest bastion marks the corner.','r17-city-final.png'),
('Height hierarchy','Two-storey peripheral rings frame the south; taller merchants and the guildhall concentrate around the square, with the church spire above the house roofs. Red, slate and brown districts retain restrained roof families.','r17-C7-city-greyscale-1x.png'),
('Variation','All ten district block paintings differ. The slate east-trade block has a different return/corner arrangement from the inn and northeast block. Five wall modules and three tower-top arrangements break the former repeated tower/curtain cadence.','r17-city-final.png'),
('Church precinct','A144x96 enclosed packed-earth yard north of the church contains two slabs and an east gate. Its position is kept separate from the church painted spire overhang so the enclosure stays visible.','r17-C7-piece-churchyard-c7-4x.png'),
('Purposeful courts','Northwest retains well and laundry with worker/woodpile, northeast has goods sorting beside the rear range, southwest has a work/cart court. Other interiors are roofed, with no street-front lawns.','r17-C7-lot-ownership-1x.png'),
('Useful inhabitants','New12x24 laundry worker, two different inn patrons and guard;48x24 delivery with handler;24x16 bench. They are placed beside equipment, porch and gate stair, and the market uses varied figures.','r17-city-final-crop-street-3x.png'),
('Acceptance views','Native/4x every production export; literal3x3 ground repeats; self seams and wall variant pairs;16x12 L/T/dead-end assembly; irregular square; both tall/low contacts; reference and greyscale comparisons; ownership, clearance and actor normal/reveal views.','r17-C7-review.html')]
response=dict(part='C7',basis=['BRIEF-17.md','BRIEF-17-panel-1.md','BRIEF-17-panel-2.md','review/r17-cycle-7/FIXES.md','coordinator structure-first requirements'],items=[dict(item=i+1,title=a,change=b,evidence=c,status='implemented; saved-art self-review') for i,(a,b,c) in enumerate(fixes)],acceptance='No independent critic score or runtime collision approval is asserted. Visual judgement remains separate from the measured pixel/ownership checks.',precedence=decision['precedence'])
(R/'r17-C7-FIXES-response.json').write_text(json.dumps(response,indent=2))
# Full native comparison: the three candidates, the previous final, today and
# the rebuilt final. Smaller references are not enlarged on this 1x board.
items=[('CONCEPT A',R/'r17-concept-a.png'),('CONCEPT B / CHOSEN',R/'r17-concept-b.png'),('CONCEPT C',R/'r17-concept-c.png'),('PREVIOUS C6 FINAL',R/'r17-C7-before-city.png'),('TODAY',A/'reference/r17/current-town.png'),('C7 FINAL',R/'r17-city-final.png')]
board=Image.new('RGBA',(3*1936,2*1488),(32,36,32,255));d=ImageDraw.Draw(board)
for i,(title,p) in enumerate(items):
    x=i%3*1936+8;y=i//3*1488+8;d.text((x,y),title,fill='white');im=read(p);board.alpha_composite(im,(x,y+24))
board.save(R/'r17-concepts-vs-today-vs-final.png');board.save(R/'r17-C7-concepts-final-comparison-1x.png');board.resize((2904,1488),NN).save(R/'r17-C7-concepts-final-overview.png')
qc=json.loads((R/'r17-C7-QC.json').read_text());mode=json.loads((R/'r17-C7-mode-verification.json').read_text());l=json.loads((R/'r17-C7-layout.json').read_text())
passed=sum(a['passed'] for a in qc['checks']);failed=[a['name'] for a in qc['checks'] if not a['passed']]
section=f'''# Round 17 — Part C7

Painted the district first, then rebuilt the composer toward **concept B**.
Three full native concept views are retained, together with three exploratory
revisions. B was selected for connected roof-filled blocks, the clearest
four-sided civic square, mixed heights/roof materials and the gate road.
A has weaker street rank; C has a weaker market grouping. The coordinator's
structure rules govern the rebuilt plan wherever the painting differs.
[Concept comparison](review/r17-concepts-vs-today-vs-final.png) ·
[Choice and precedence](review/r17-C7-concept-choice.json).

**Method:** {len(generation)} built-in image-tool paintings on solid magenta,
with alternatives for the difficult block, church, gate, market, corner and
roof work. Registered paint → fixed reference palette → exact64-vote8×8
RGBA mode → native isolated-pixel/one-pixel-outline cleanup. Production
alpha is0/255 with zero RGB underneath transparency. Code only registers,
reduces, remaps material colours, wraps native edges, crops/masks and
composites drawn pixels. The concept originals returned by the tool are
1448×1086, enlarged during registration to1920×1440; the8× working registration does not add
original drawing resolution. Individual production pieces were reduced from
larger paintings. [Prompts and selections](review/r17-C7-generation.json) ·
[Registration measurements](review/r17-C7-processing.json) ·
[Native operations](review/r17-C7-native-operations.json).

**Plan:**40×30 cells at48px, {len(l['blocks'])} perimeter blocks and
{len(l['lots'])} owned outward/return lots with1–2-cell footprints. Front,
side and corner slices and their rear-wing cells reconstruct the whole
painted blocks without internal seams. These are static owned assemblies;
the separate course units supply the stacking proofs. The main route is96px, side streets48px,
service passage24px; the gate route bends beside the southeast jog.
The southeast wing was repainted and registered with a visible48×96 street
recess. The square has a48px notch, six stalls and four enclosing destinations:
guildhall north, church's east porch west, inn's west return east, open
north side of the market south. Towers occupy the wall line; a new angular
corner bastion, north stair and wall walk complete the defensive edge.
[Plan data](review/r17-C7-layout.json) ·
[Ownership](review/r17-C7-lot-ownership-1x.png) ·
[Clearances](review/r17-C7-footprints-clearance-1x.png).

**Files:** {qc['production_count']} new transparent PNGs in`out/city17/*-c7.png`;
existing production sprites remain byte-identical. Whole gate context192×192
is split from one painting into the144×192 gate core and48px stair, with a96px
portal. The complete market pavilion is192×144; church art240×432 projects
above its5×6-cell footprint. New corners,96/144px roof depths,16px receivers,
fixed-course floors, five96×144 curtains, four48×48 paving variants, signs
and purposeful people/props accompany the ten blocks. The gate's painted
24px projection is recorded separately from its cell anchor.
All requested final,2×,squint,three3× crops,old/today comparison and
`r17-city-final-vs-concept.png` have been rendered.
[Final city](review/r17-city-final.png) ·
[Final beside chosen concept](review/r17-city-final-vs-concept.png) ·
[Review index](review/r17-C7-review.html).

**QC:** {qc['sheets']} indexed review exports include every production file
at1×/nearest-neighbour4× over summer cobble, literal3×3 base repeats,
self/variant seams, five-module wall strip,16×12 L/T/dead-end proof,
irregular square, both5/1-storey joins, house/reference1×/4× and actor
normal/reveal states. {passed}/{len(qc['checks'])} measured checks pass:
hard alpha, hidden RGB, no1–2-pixel alpha islands, native course rows0/47,
all25 wall edge pairs, disjoint lot ownership, owned-piece reconstruction,
perimeter towers and exact enlarged/repeated exports. {mode['probes']} mode
probes across {mode['records']} registrations replay correctly; the log records
{mode['mode_samples_recorded']:,} sample votes, not an exhaustive replay of
every vote. [QC and complete file measurements](review/r17-C7-QC.json) ·
[Mode probes](review/r17-C7-mode-verification.json) ·
[Twenty-item cycle-7 response](review/r17-C7-FIXES-response.json).

These are saved-art self-checks, not independent critic approval or runtime
collision/pathfinding validation. BRIEF-17 takes precedence over the panels'
deeper-footprint, wider-gate-core, smaller-sign and cross-property-overlay
waivers; the explicit C7 district request supersedes their small-pilot cap.
No seasonal partner or other checkout file changed; no branch change, commit or push was made.

'''
section=re.sub(r'(\d)px',r'\1 px',section)
for a,b in [('exact64-vote8×8','exact 64-vote 8×8'),('is0/255','is 0/255'),('the8×','the 8×'),('to1920','to 1920'),('**Plan:**40','**Plan:** 40'),('at48','at 48'),('with1–2','with 1–2'),('is96','is 96'),('streets48','streets 48'),('passage24','passage 24'),('a48','a 48'),('visible48','visible 48'),('in`out/','in `out/'),('context192','context 192'),('the144','the 144'),('and48','and 48'),('a96','a 96'),('is192','is 192'),('art240','art 240'),('its5×6','its 5×6'),('corners,96','corners, 96'),('depths,16','depths, 16'),('five96','five 96'),('four48','four 48'),('final,2×,squint,three3×','final, 2×, squint, three 3×'),('at1×/nearest','at 1×/nearest'),('neighbour4×','neighbour 4×'),('literal3×3','literal 3×3'),('strip,16×12','strip, 16×12'),('both5/1','both 5/1'),('reference1×/4×','reference 1×/4×'),('no1–2','no 1–2'),('rows0/47','rows 0/47'),('all25','all 25'),('outside`art-drop/`','outside `art-drop/`')]:section=section.replace(a,b)
notes=A/'NOTES.md';old=notes.read_text();start=old.index('# Round 17 — Part C6:');notes.write_text(section+old[start:])
print(dict(generations=len(generation),production=qc['production_count'],review_exports=qc['sheets'],checks=passed,total=len(qc['checks']),failed=failed))
