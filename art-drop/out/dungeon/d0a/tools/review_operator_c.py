"""Review-only contact sheets; native artwork is never resized in place."""
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,S

def run():
 for scale in (1,2):
  for grey in (False,True):
   sheet=Image.new('RGB',(4*(144*scale+16),4*(144*scale+28)),'#222630');d=ImageDraw.Draw(sheet)
   for i,n in enumerate(S):
    x=8+(i%4)*(144*scale+16);y=20+(i//4)*(144*scale+28)
    d.text((x,y-16),n,fill='white');im=Image.open(BASE/f'proof/{n}{"-grey" if grey else ""}.png').convert('RGB')
    sheet.paste(im.resize((144*scale,144*scale),Image.Resampling.NEAREST),(x,y))
   sheet.save(REVIEW/f'C-operator-contact-{scale}x{"-grey" if grey else ""}.png')
 sheet=Image.new('RGB',(1008,420),'#222630');d=ImageDraw.Draw(sheet)
 for i,n in enumerate(S):
  x=8+(i%7)*144;y=28+(i//7)*196
  im=Image.open(BASE/f'proof/{n}-grey.png').resize((36,36),Image.Resampling.NEAREST)
  d.text((x,y-16),n,fill='white');sheet.paste(im,(x,y));sheet.paste(im.resize((108,108),Image.Resampling.NEAREST),(x,y+48))
 sheet.save(REVIEW/'C-operator-squints.png')
 # Compact views of all corrected canon samples, with the same registered master.
 from check_proofs import native_master
 paths=[BASE/f'canon/props/{n}.png' for n in ('crate','chest','table')]+sorted((BASE/'canon/swatches').glob('*.png'))
 for start in range(0,len(paths),4):
  subset=paths[start:start+4];sheet=Image.new('RGB',(1152,320*len(subset)),'#222630');d=ImageDraw.Draw(sheet)
  for i,p in enumerate(subset):
   y=24+i*320;im=Image.open(p).convert('RGBA');master,_=native_master(p.stem.startswith('station_'))
   d.text((8,y-18),str(p.relative_to(BASE))+' / 1x, 2x, 3x / grey / squint / master art 1x',fill='white')
   for scale,x in [(1,8),(2,120),(3,336)]:
    tile=im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST);sheet.paste(tile,(x,y),tile)
   g=im.convert('L');sheet.paste(g,(640,y));sheet.paste(g.resize((g.width//4,g.height//4),Image.Resampling.NEAREST),(760,y));sheet.paste(master,(960,y))
  sheet.save(REVIEW/f'C-operator-canon-{start//4+1}.png')
if __name__=='__main__':run()
