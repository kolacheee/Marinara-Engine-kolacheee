"""Focused native/nearest-neighbour crops of current composer output only."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,importlib.util
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';NN=Image.Resampling.NEAREST
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)

def run():
 focus={
  'poor-lane':('district-poor',(48,432,288,672)),
  'junction':('L-block',(240,120,432,312)),
  'mounted-trades-north':('market',(504,672,984,936)),
  'mounted-trades-south':('market',(504,1200,984,1464)),
  'market-stalls':('market',(456,1488,984,1776)),
  'washing':('district-poor',(72,528,288,648))}
 for key in c.E_DISTRICTS:focus[key+'-court']=('district-'+key,(384,432,624,816))
 links=[]
 for tag,(name,box) in focus.items():
  a=Image.open(R/f'r17-E-critic-{name}-1x.png').convert('RGBA').crop(box)
  for scale in (1,3,4):
   path=f'r17-E-critic2-focus-{tag}-{scale}x.png';a.resize((a.width*scale,a.height*scale),NN).save(R/path);links.append(path)
  # Historical focus filenames are refreshed so no linked inspection of
  # a current scene retains the rejected road paint.
  if tag in ('junction','mounted-trades-north','mounted-trades-south','market-stalls','washing'):
   refs=[Image.open(R.parent/'reference/r17'/f).convert('RGBA') for f in ('round15-street.png','current-town.png')]
   for scale in (1,3):
    scaled=a.resize((a.width*scale,a.height*scale),NN);sheet=Image.new('RGBA',(scaled.width+max(r.width for r in refs)+48,max(scaled.height+70,sum(r.height+40 for r in refs)+30)),(35,39,34,255));d=ImageDraw.Draw(sheet)
    d.text((12,10),'Current Part E / '+tag+f' / {scale}x',fill='white');sheet.alpha_composite(scaled,(12,34));y=12
    for label,ref in zip(('Round15 / literal1x','Current town / literal1x'),refs):
     d.text((scaled.width+36,y),label,fill='white');sheet.alpha_composite(ref,(scaled.width+36,y+22));y+=ref.height+40
    sheet.save(R/f'r17-E-critic1-focus-{tag}-{scale}x.png')
 for name in ('cobble-small','street-side','lane'):
  a=Image.open(O/(name+'.png')).convert('RGBA');rep=Image.new('RGBA',(a.width,144))
  for y in range(3):rep.paste(a,(0,y*48))
  for scale in (1,4,8):
   path=f'r17-E-critic2-vertical-{name}-{scale}x.png';rep.resize((rep.width*scale,rep.height*scale),NN).save(R/path);links.append(path)
 (R/'r17-E-critic2-focus.json').write_text(json.dumps(dict(crops=focus,links=links),indent=2))
 print('Saved focused entrance, lane, junction, trade and vertical-repeat proofs.')

if __name__=='__main__':run()
