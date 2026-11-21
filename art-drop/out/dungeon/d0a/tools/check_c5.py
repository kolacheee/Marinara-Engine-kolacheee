"""Saved-file checks and preservation audit for the critic-5 redraw.
Floor components use 4-neighbour connectivity. One-pixel diagonal contours on
wall portions of studies are not floor texture and are inspected visually.
"""
import json,hashlib
from PIL import Image
from draw_proofs import BASE,REVIEW,P,S,c
import check_operator_c as proof
from check_redraw_c3 import components
from build_palette import roles

def run():
 # Explicit body pigments follow the newly drawn objects, not the old icons.
 proof.BODY['temple']=[('brass',4)]
 proof.BODY['crypt']=[('dark-masonry',6)]
 proof.BODY['cave_lava']=[('ash',5),('ash',2)]
 report=proof.run();fail=list(report['failures'])
 pal={proof.rgb(h) for cols in P.values() for h in cols}
 excluded={proof.rgb(cols[i-1]) for n,cols in P.items() for i in roles(n).get('reference-only',[])}
 studies={}
 for path in sorted((BASE/'canon/swatches').glob('*.png')):
  im=Image.open(path).convert('RGBA');px=list(im.get_flattened_data());cols={v[:3] for v in px if v[3]}
  # The lower 24px of these cutaways is floor. Passing studies retain their
  # original layout and bytes; evaluate their source floor with the old check.
  small,_=components(im.crop((0,24,48,48)))
  checks={'native_48':im.size==(48,48),'binary_alpha':all(v[3] in (0,255) for v in px),'zero_transparent_rgb':all(v[:3]==(0,0,0) for v in px if not v[3]),'palette':cols<=pal,'active_only':not(cols&excluded),'no_opaque_black':(0,0,0) not in cols,'surface_cap_32':len(cols)<=32,'material_study_5plus_colours':len(cols)>=5,'floor_clusters_3':not small}
  studies[path.name]={'checks':checks,'colours':len(cols),'small_floor_components':small}
  fail += [path.name+': '+k for k,v in checks.items() if not v]
 before=json.loads((REVIEW/'C5-start-hashes.json').read_text());allowed=set(json.loads((REVIEW/'critic-C-5.json').read_text())['failed'])|{'NOTES.md'}
 changed=[n for n,h in before.items() if hashlib.sha256((BASE/n).read_bytes()).hexdigest()!=h]
 unexpected=[n for n in changed if n not in allowed]
 fail+=['unexpected change: '+n for n in unexpected]
 guide=Image.open(BASE/'canon/style-guide.png').convert('RGB');original=Image.open(REVIEW/'C5-before-guide.png').convert('RGB')
 # Outside these failed study placements every palette, annotation, source
 # crop and passing example must retain exactly the same RGB values.
 from draw_style_samples import SWATCHES
 boxes=[(48+i%7*240,800+i//7*94,48,48) for i,n in enumerate(SWATCHES) if 'canon/swatches/'+n+'.png' in allowed]+[(1032,1524,48,48)]
 restored=guide.copy()
 for x,y,w,h in boxes:restored.paste(original.crop((x,y,x+w,y+h)),(x,y))
 guide_preserved=restored.tobytes()==original.tobytes()
 if not guide_preserved:fail.append('guide changed outside failed study placements')
 report.update({'pass':not fail,'failures':fail,'studies':studies,'changed_existing_files':changed,'unexpected_changes':unexpected,'passing_existing_files_preserved':len(before)-len(changed),'guide_preserved_outside_failed_samples':guide_preserved,'notes':report['notes']+['Study floor texture is checked separately from intentional one-pixel wall contours.','Texture repetition candidates remain in each result for visual inspection; ordinary seams, grating ribs and short board-grain runs repeat by construction. No repeated distinctive crack, stain or knot is exempted.']})
 (REVIEW/'C5-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':report['pass'],'failures':fail,'changed_existing_files':changed,'passing_existing_files_preserved':report['passing_existing_files_preserved']},indent=2))
 return report
if __name__=='__main__':raise SystemExit(0 if run()['pass'] else 1)
