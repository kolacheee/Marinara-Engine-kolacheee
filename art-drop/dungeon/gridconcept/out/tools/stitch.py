# Snap 2x quarters to 1x pixel art (shared palette, mode per 2x2) and stitch with min-difference seams (image quilting).
from PIL import Image
from collections import Counter
Q='/home/kolache/Downloads/marinara-art-dungeon-run/keeplair/q5'; C=48
names=('q1','q2','q3','q4'); W2,H2=17*C*2,13*C*2
qs={n:Image.open(f'{Q}/{n}-px.png').convert('RGB').resize((W2,H2),Image.NEAREST) for n in names}
sheet=Image.new('RGB',(W2*2,H2*2)); [sheet.paste(qs[n],((i%2)*W2,(i//2)*H2)) for i,n in enumerate(names)]
pal=sheet.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
art={}
for n,im in qs.items():
  s=im.quantize(palette=pal,dither=Image.Dither.NONE).load(); out=Image.new('P',(W2//2,H2//2)); out.putpalette(pal.getpalette()); o=out.load()
  for y in range(H2//2):
    for x in range(W2//2): o[x,y]=Counter((s[2*x,2*y],s[2*x+1,2*y],s[2*x,2*y+1],s[2*x+1,2*y+1])).most_common(1)[0][0]
  art[n]=out.convert('RGB')
def diff(a,b): return abs(a[0]-b[0])+abs(a[1]-b[1])+abs(a[2]-b[2])
def vseam(A,B,x0,x1,h):
  # A,B pixel accessors in canvas coords over columns x0..x1-1, rows 0..h-1; returns seam x per row
  w=x1-x0; cost=[[diff(A(x0+i,y),B(x0+i,y)) for i in range(w)] for y in range(h)]
  acc=[cost[0][:]]; back=[]
  for y in range(1,h):
    row=[];br=[]
    for i in range(w):
      best=min((acc[-1][j],j) for j in (i-1,i,i+1) if 0<=j<w); row.append(cost[y][i]+best[0]); br.append(best[1])
    acc.append(row); back.append(br)
  i=min(range(w),key=lambda k:acc[-1][k]); path=[i]
  for y in range(h-2,-1,-1): i=back[y][i]; path.append(i)
  return [x0+p for p in reversed(path)]
def join_lr(L,R,ox):  # L at 0, R at ox; overlap ox..L.width
  W=ox+R.width; H=L.height; out=Image.new('RGB',(W,H)); out.paste(L,(0,0)); lp=L.load(); rp=R.load()
  seam=vseam(lambda x,y:lp[x,y],lambda x,y:rp[x-ox,y],ox,L.width,H); op=out.load()
  for y in range(H):
    for x in range(seam[y],W): op[x,y]=rp[x-ox,y]
  return out
top=join_lr(art['q1'],art['q2'],14*C); bot=join_lr(art['q3'],art['q4'],14*C)
# horizontal join via transpose
t=join_lr(top.transpose(Image.Transpose.TRANSPOSE),bot.transpose(Image.Transpose.TRANSPOSE),10*C).transpose(Image.Transpose.TRANSPOSE)
t.save(f'{Q}/lair-px.png'); t.resize((t.width*2,t.height*2),Image.NEAREST).save(f'{Q}/lair-px-2x.png'); print(t.size,len(t.getcolors(10**6)))
