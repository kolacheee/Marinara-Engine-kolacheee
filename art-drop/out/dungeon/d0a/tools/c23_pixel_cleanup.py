"""Final explicit pixel corrections for C23, at inspected edges only."""
from PIL import ImageDraw
from redraw_critic21 import col
from draw_proofs import pts

WALL={
 'cave_rock':{
  'mud:2':'40,22',
  'grey-brown-rock:2':'90,79 90,80 52,27 53,27 36,75 37,75',},
 'cave_crystal':{
  'dark-rock:3':'11,63 19,63 64,80 62,81 63,81',
  'dark-rock:4':'26,68 27,68'},
}
FLOOR={
 'yard':{
  'yard-path:3':'123,2 123,3 124,4 134,9 138,44',
  'yard-cobble:4':'113,4',
  'yard-path:4':'105,42 104,43',
  'roof-slate:3':'99,41 100,41',
  'yard-grass:4':'136,12',
  'yard-grass:3':'143,23 143,24 141,25 142,25 139,30 140,30 135,41',
 }
}

def clean(n,wall,backing):
    for tag,path in WALL.get(n,{}).items():
        for x,y in pts(path):wall.putpixel((x,y),ImageDraw.ImageColor.getcolor(col(tag),'RGBA'))
    for tag,path in FLOOR.get(n,{}).items():
        for x,y in pts(path):backing.putpixel((x,y+96),ImageDraw.ImageColor.getcolor(col(tag),'RGBA'))
    return wall,backing

def clean_swatch(n,sw):
    if n=='cave_crystal':sw.putpixel((47,0),ImageDraw.ImageColor.getcolor(col('dark-rock:3'),'RGBA'));sw.putpixel((46,0),ImageDraw.ImageColor.getcolor(col('dark-rock:3'),'RGBA'));sw.putpixel((45,0),ImageDraw.ImageColor.getcolor(col('dark-rock:3'),'RGBA'))
    return sw
