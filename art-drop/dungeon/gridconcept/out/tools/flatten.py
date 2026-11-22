# Make darkness and wall tops perfectly flat, using the clean block-out's own colours as the mask.
import sys
from PIL import Image
K='/home/kolache/Downloads/marinara-art-dungeon-run/keeplair'; src,dst=sys.argv[1],sys.argv[2]
b=Image.open(f'{K}/keep-lair-base-clean.png').convert('RGB'); m=Image.open(src).convert('RGB')
bp=b.load(); mp=m.load(); W,H=b.size
VOID=(30,28,27); TOP=(46,42,40)          # block-out colours (measured)
FILL={VOID:(24,21,20),TOP:(46,40,38)}    # flat dark tones, close to the painting's own
n=0
for y in range(H):
  for x in range(W):
    c=bp[x,y]
    if c in FILL: mp[x,y]=FILL[c]; n+=1
m.save(dst); print('flattened px',n)
