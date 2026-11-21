"""Explicit pencil corrections at inspected facet tips/intersections, C22.
No detection, neighbor voting, filtering, or texture generation runs here.
"""
from redraw_critic21 import col
from draw_proofs import pts
from PIL import ImageDraw

FIXES={
('cave_rock','top'):{
 'mud:1':'62,0 62,1 61,2 61,3 60,4 60,5 99,22 99,23 100,24',
 'grey-brown-rock:2':'99,0 14,12 15,12 46,26 120,31 121,31'},
('cave_rock','face'):{
 'grey-brown-rock:3':'129,0 129,1 44,24 34,37',
 'grey-brown-rock:1':'29,9 130,13 63,20 63,21 35,33 35,34 137,37 140,38 142,39',
 'grey-brown-rock:2':'142,40 143,40'},
('cave_rock','floor'):{'mud:4':'13,18 14,18 12,19 10,20'},
('cave_ice','top'):{
 'blue-ice:1':'29,6 66,9 105,9 106,11 26,29 50,30',
 'frost:1':'39,14 3,30 4,30 7,31 8,31 29,32'},
('cave_ice','face'):{
 'blue-ice:1':'35,0 142,16 140,17 75,17 76,17 62,18 49,20 48,21 46,22 134,22 135,22 132,23 133,23 131,25 132,29 131,33 132,34',
 'blue-ice:2':'4,4 5,5 122,4 124,5 50,18 49,19 48,20 128,26 21,27 25,27 5,28 24,28',
 'frost:1':'42,4 43,5 85,12 85,13 84,15 137,21 138,21 18,23 19,23 78,27 69,35 70,35 31,37 30,38 21,39',
 'frost:2':'55,19 56,19 54,20 17,21 52,21 53,21 1,22 2,22 15,22 51,22 3,23 4,23 129,23 6,24 7,24 132,24 133,24 135,24'},
('cave_crystal','face'):{
 'violet-crystal:1':'48,22 45,23',
 'violet-crystal:3':'65,22 60,26 59,28 57,30',
 'violet-crystal:2':'59,27 58,28 58,29',
 'dark-rock:2':'0,27',
 'dark-rock:3':'40,29 40,30'},
('cave_crystal','floor'):{
 'dark-rock:4':'38,18 19,24 20,24 21,24 22,27 21,28 39,27 38,28 36,29 37,29 35,30',
 'dark-rock:5':'23,26'},
('cave_lava','top'):{'embers:2':'109,20 110,20 88,33','basalt:2':'0,23'},
('cave_lava','face'):{
 'basalt:5':'13,0 4,35 6,36 7,36 113,37',
 'basalt:4':'93,10 93,11 92,12 92,13 91,15 94,18 94,19 9,26 92,32 91,33 91,34 29,38 89,40 30,41 90,44 113,21 112,22 111,23 110,24',
 'basalt:3':'45,16 12,19',
 'embers:3':'93,12 93,13 92,14 92,15 26,17 23,18 21,19 22,19 114,20 21,21 19,22 30,26 30,27 28,28 28,29 28,33 28,34 89,41',
 'embers:2':'112,21 111,22 110,23'},
('cave_lava','floor'):{
 'basalt:5':'59,8',
 'basalt:6':'50,28 39,32 40,32 51,32',
 'embers:4':'61,34',
 'ash:3':'51,35 52,35 53,36 54,36'},
('yard','floor'):{
 'yard-grass:3':'3,0 20,0 4,1 7,1 0,2 0,3 17,3 16,10 19,13 23,16 23,17 17,19 0,21 28,21 30,21 31,21 0,28 6,28 26,29 27,32 8,34 20,44',
 'yard-grass:4':'13,4 13,5 25,13 28,35',
 'yard-cobble:4':''},
}

FINISH={
 ('cave_rock','face'):{'mud:3':'48,12 21,13','grey-brown-rock:3':'18,15 5,43'},
 ('cave_rock','swatch'):{'grey-brown-rock:1':'30,12'},
 ('cave_ice','top'):{'blue-ice:2':'7,31 8,31'},
 ('cave_ice','face'):{
  'blue-ice:2':'6,6 137,21 138,21 5,25 7,26 48,27',
  'frost:1':'87,6', 'frost:2':'125,23 53,24', 'frost:3':'6,24 7,24'},
 ('cave_crystal','face'):{'dark-rock:3':'17,13 81,13 16,15 14,17 82,18 8,19 24,38 22,40'},
 ('cave_crystal','swatch'):{'dark-rock:2':'47,0','violet-crystal:3':'29,47 30,47'},
 ('cave_lava','face'):{'basalt:2':'36,28 37,28'},
 ('cave_lava','swatch'):{'basalt:4':'15,12 15,13','basalt:3':'47,18 47,19','embers:3':'13,23 14,23','basalt:5':'47,42 47,43','basalt:6':'5,47'},

}

COBBLE_FINISH={
 ('yard','floor'):{
  'yard-cobble:3':'101,0 127,0 119,7 128,8 123,9 123,10 119,20 123,30 123,31 132,34 116,40 102,44 102,45',
  'yard-path:3':'108,0 112,0 113,0 107,1 108,1 106,2 106,3 120,46 120,47',
  'roof-slate:3':'116,4 117,4 120,27 112,33 113,33 99,37',
  'yard-path:4':'130,6 130,7 127,8 127,9 111,26 111,27 120,43',
  'yard-cobble:4':'113,7 114,7 116,7 111,12 111,13 130,14 123,35 125,40 126,40'},
 ('building-yard','swatch'):{'yard-cobble:4':'47,24 31,47 32,47'},
}

def clean(look,region,im):
    d=ImageDraw.Draw(im)
    for corrections in (FIXES,FINISH,COBBLE_FINISH):
        for tag,points in corrections.get((look,region),{}).items():
            d.point(pts(points),fill=col(tag))
    return im
