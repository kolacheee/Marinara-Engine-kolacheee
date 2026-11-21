"""Saved-file measurements and scope preservation for critic-seven repairs."""
import json,hashlib
from PIL import Image
from draw_proofs import BASE,REVIEW,P,S,c
import check_operator_c as proof
from check_redraw_c3 import components
from build_palette import roles

def run():
 proof.BODY['temple']=[('brass',4)]
 proof.BODY['cave_crystal']=[('dark-rock',6)]
 proof.BODY['crypt']=[('dark-masonry',6)]
 proof.BODY['cave_lava']=[('ash',5),('ash',2)]
 # All broad hydro face and leaf pigments are measured, including the two
 # omitted by round five. Step four may return in a later edit and must pass.
 proof.BODY['station_hydro']=[('planters',4),('planters',5),('overgrowth',4),('overgrowth',5)]
 report=proof.run();fail=list(report['failures'])
 pal={proof.rgb(h) for cols in P.values() for h in cols}
 excluded={proof.rgb(cols[i-1]) for n,cols in P.items() for i in roles(n).get('reference-only',[])}
 studies={}
 for path in sorted((BASE/'canon/swatches').glob('*.png')):
  im=Image.open(path).convert('RGBA');px=list(im.get_flattened_data());cols={v[:3] for v in px if v[3]}
  small,_=components(im.crop((0,24,48,48)))
  n='yard' if path.stem=='building-yard' else path.stem
  allowed={proof.rgb(h) for r in S[n][4]+['void-mass'] for h in P[r]}
  checks={'native_48':im.size==(48,48),'binary_alpha':all(v[3] in (0,255) for v in px),'zero_transparent_rgb':all(v[:3]==(0,0,0) for v in px if not v[3]),'palette':cols<=pal,'own_ramps':cols<=allowed,'active_only':not(cols&excluded),'no_opaque_black':(0,0,0) not in cols,'surface_cap_32':len(cols)<=32,'material_study_5plus_colours':len(cols)>=5,'floor_clusters_3':not small}
  studies[path.name]={'checks':checks,'colours':len(cols),'small_floor_components':small}
  fail += [path.name+': '+k for k,v in checks.items() if not v]
 before=json.loads((REVIEW/'C7-start-hashes.json').read_text());allowed=set(json.loads((REVIEW/'critic-C-7.json').read_text())['failed'])|{'NOTES.md'}
 changed=[n for n,h in before.items() if hashlib.sha256((BASE/n).read_bytes()).hexdigest()!=h]
 unexpected=[n for n in changed if n not in allowed];fail+=['unexpected change: '+n for n in unexpected]
 guide=Image.open(BASE/'canon/style-guide.png').convert('RGB');original=Image.open(REVIEW/'C7-before/canon/style-guide.png').convert('RGB')
 from draw_style_samples import SWATCHES
 boxes=[(48+i%7*240,800+i//7*94,48,48) for i,n in enumerate(SWATCHES) if 'canon/swatches/'+n+'.png' in allowed]+[(1032,1524,48,48)]
 restored=guide.copy()
 for x,y,w,h in boxes:restored.paste(original.crop((x,y,x+w,y+h)),(x,y))
 guide_preserved=restored.tobytes()==original.tobytes()
 if not guide_preserved:fail.append('guide changed outside failed study placements')
 report.update({'pass':not fail,'failures':fail,'studies':studies,'changed_existing_files':changed,'unexpected_changes':unexpected,'passing_existing_files_preserved':len(before)-len(changed),'guide_preserved_outside_failed_samples':guide_preserved})
 (REVIEW/'C7-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':not fail,'failures':fail,'changed_existing_files':changed},indent=2))
 return report
if __name__=='__main__':raise SystemExit(0 if run()['pass'] else 1)
