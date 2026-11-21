"""Saved-pixel validation for the operator redraw; diagnostics stay in review/."""
import json,hashlib
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,S,P,c
from check_proofs import light,rgb,mean,native_master,reviews,grouped_reviews
from check_redraw_c3 import components
from redraw_proofs_c3 import BODY as PREVIOUS_BODY
from build_palette import roles
BODY=dict(PREVIOUS_BODY)
BODY['cave_rock']=[('mud',6)]
BODY['cave_ice']=[('frost',4),('snowdrift',4)]

def flat(im):
 prev=[0]*(im.width+1);largest=(0,0,0);sites=[]
 for y in range(im.height):
  row=[0]*(im.width+1)
  for x in range(im.width):
   row[x+1]=1
   if x and y and im.getpixel((x,y))==im.getpixel((x-1,y))==im.getpixel((x,y-1))==im.getpixel((x-1,y-1)):
    row[x+1]=1+min(row[x],prev[x],prev[x+1])
   if row[x+1]>largest[0]:largest=(row[x+1],x,y)
   if row[x+1]>=9:sites.append((x,y))
  prev=row
 return {'largest_square':largest,'oversize_ends':sites}

def run():
 results={};fails=[];pal={rgb(h) for row in P.values() for h in row}
 excluded={rgb(v[i-1]) for n,v in P.items() for i in roles(n).get('reference-only',[])}
 for n,cfg in S.items():
  im=Image.open(BASE/f'proof/{n}.png').convert('RGBA');grey=Image.open(BASE/f'proof/{n}-grey.png').convert('RGBA')
  f,w,p=[Image.open(REVIEW/f'C-layer-{n}-{t}.png').convert('RGBA') for t in ('floor','wall','prop')]
  shadow=Image.open(BASE/f'proof/{n}-shadow.png').convert('RGBA')
  px=[v for a in (im,f,w,p,shadow) for v in a.get_flattened_data()]
  cols={v[:3] for v in px if v[3]};allowed={rgb(h) for r in cfg[4]+['void-mass'] for h in P[r]}
  surface={v[:3] for a in (f,w) for v in a.get_flattened_data() if v[3]};props={v[:3] for v in p.get_flattened_data() if v[3]}
  fv=[light(v) for v in set(f.get_flattened_data())];small,dups=components(f)
  bodies={rgb(c(*b)) for b in BODY[n]};outlines={rgb(c(r,1)) for r in cfg[4]}
  origin=90 if n=='station_lab' else 86
  pairs=[abs(light(p.getpixel((x,y)))-light(f.getpixel((x+origin,y+96)))) for y in range(48) for x in range(48) if p.getpixel((x,y))[:3] in bodies and p.getpixel((x,y))[3]]
  opairs=[abs(light(p.getpixel((x,y)))-light(f.getpixel((x+origin,y+96)))) for y in range(48) for x in range(48) if p.getpixel((x,y))[:3] in outlines and p.getpixel((x,y))[3]]
  levels={'mass':mean(w.crop((0,0,144,8))),'top':mean(w.crop((0,8,144,48))),'face':mean(w.crop((0,48,144,95))),'floor':mean(f)}
  recon=f.copy();recon.paste(w,(0,0));recon.alpha_composite(p,(origin,96))
  coverage={name:flat(pic) for name,pic in [('top',w.crop((0,8,144,48))),('face',w.crop((0,48,144,95))),('floor',f)]}
  checks={'size_144':im.size==grey.size==shadow.size==(144,144),'binary_alpha':all(v[3] in (0,255) for v in px),
   'transparent_rgb_zero':all(v[:3]==(0,0,0) for v in px if not v[3]),'palette':cols<=pal,'own_ramps':cols<=allowed,
   'active_palette':not(cols&excluded),'no_black_outline':(0,0,0) not in cols,'surface_cap_32':len(surface)<=32,'prop_cap_48':len(props)<=48,
   'floor_clusters_3':not small,'floor_35_55':min(fv)>=35 and max(fv)<=55,'floor_span_15':max(fv)-min(fv)<=15,
   'body_local_gap_10':bool(pairs) and min(pairs)>=10,'outline_local_gap_10':bool(opairs) and min(opairs)>=10,
   'body_30_70':all(30<=light(v)<=70 for v in bodies),'ladder':levels['mass']<levels['top']<levels['face']<levels['floor'],
   'mass_25pct_darker':levels['mass']<=levels['top']*.75,'wall_top_18_30':18<=levels['top']<=30,'wall_face_25_40':25<=levels['face']<=40,
   'baseline_1px':all(w.getpixel((x,95))[:3]==rgb(c(cfg[1][0],1)) for x in range(144)),
   'grey_exact':grey.tobytes()==im.convert('L').convert('RGBA').tobytes(),'native_composition':recon.tobytes()==im.tobytes(),
   'single_colour_shadow_mask':len({v[:3] for v in shadow.get_flattened_data() if v[3]})==1,
   'coverage_8px':n.startswith('station_') or all(v['largest_square'][0]<=8 for v in coverage.values())}
  stats={'checks':checks,'surface_colours':len(surface),'prop_colours':len(props),'floor_L_min':min(fv),'floor_L_max':max(fv),'floor_span':max(fv)-min(fv),
   'body_gap_min':min(pairs),'outline_gap_min':min(opairs),'main_body_pixels':len(pairs),'mean_L':levels,'small_floor_components':small,'repeated_component_candidates':dups,'coverage':coverage}
  results[n]=stats;fails += [n+': '+k for k,v in checks.items() if not v]
  master,_=native_master(n.startswith('station_'));reviews(n,im,grey,master,stats)
  # Show the separate shadow layer applied once, without changing the artwork.
  scene=f.copy();scene.paste(w,(0,0));s=shadow.copy();s.putalpha(s.getchannel('A').point(lambda a:89 if a else 0));scene.alpha_composite(s);scene.alpha_composite(p,(origin,96))
  sheet=Image.new('RGB',(896,484),'#222630');d=ImageDraw.Draw(sheet)
  d.text((8,7),n+' / final art 3x; contact shadow at 35% / master at equal art scale',fill='white')
  sheet.paste(scene.resize((432,432),Image.Resampling.NEAREST),(8,36));sheet.paste(master.resize((432,432),Image.Resampling.NEAREST),(456,36))
  sheet.save(REVIEW/f'C-operator-{n}-master.png')
 grouped_reviews()
 report={'pass':not fails,'failures':fails,'cell_size':48,'results':results,'notes':['Greyscale diagnostic files are exempt from palette membership.','Shadow files are opaque binary masks; review display composites them once at 35%.','Components and flat-square tests supplement visual review; they cannot certify artistic quality.']}
 (REVIEW/'C-operator-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':not fails,'failures':fails,'small':{n:len(v['small_floor_components']) for n,v in results.items()}},indent=2))
 return report
if __name__=='__main__':raise SystemExit(0 if run()['pass'] else 1)
