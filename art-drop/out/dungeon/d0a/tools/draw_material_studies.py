"""Native material studies; keep the four critic-approved drawings reproducible."""
from PIL import Image,ImageDraw
from draw_style_samples import c,poly,rect,patches,SWATCHES
from redraw_material_studies import FAILED,draw as redraw

def marks(d,r,s,paths):
 for points in paths:d.line(points,fill=c(r,s),width=2)

def draw(name):
 if name in FAILED:return redraw(name)
 r,s=SWATCHES[name];im=Image.new('RGBA',(48,48),c(r,s));d=ImageDraw.Draw(im)
 def p(points,rr,ss):poly(d,points,rr,ss)
 def b(box,rr,ss):rect(d,box,rr,ss)
 if name=='cave_ice':
  # Long transparent-looking planes meet along hard, connected fracture ridges.
  p([(0,0),(34,0),(12,22),(0,18)],'frost',3)
  p([(35,0),(40,0),(18,22),(29,33),(27,35),(13,21)],'station-panels',3)
  p([(41,0),(47,0),(47,33),(33,19),(23,19)],'frost',3)
  p([(47,35),(47,40),(25,18),(28,15)],'station-panels',3)
  p([(0,23),(10,23),(31,44),(47,44),(47,47),(29,47),(8,26),(0,26)],'station-panels',3)
  p([(0,28),(5,28),(24,47),(0,47)],'frost',3)
  p([(18,24),(21,24),(26,29),(26,32)],'frost',3)
  p([(31,35),(39,35),(44,40),(36,40)],'frost',3)
  p([(2,5),(14,5),(11,8),(4,8)],'blue-ice',3)
  p([(3,10),(8,10),(5,13),(0,13),(0,11)],'blue-ice',3)
  p([(23,4),(28,4),(22,10),(20,10)],'blue-ice',3)
  p([(37,8),(39,6),(39,14),(37,16)],'blue-ice',3)
  b((42,21,44,25),'blue-ice',3)
  p([(9,31),(14,36),(14,39),(9,34)],'blue-ice',3)
  b((2,36,4,41),'blue-ice',3)
  p([(25,37),(28,37),(31,40),(29,42),(25,39)],'frost',3)
 elif name=='cave_crystal':
  # Dark rock and a connected, bifurcating crystalline vein.
  p([(0,0),(17,0),(22,5),(13,14),(9,19),(0,22)],'dark-masonry',4)
  p([(28,0),(47,0),(47,18),(38,25),(31,18),(28,10),(23,5)],'dark-rock',5)
  p([(21,0),(24,0),(24,10),(27,15),(27,21),(33,27),(39,29),(47,29),(47,33),(39,33),(31,30),(24,23),(18,27),(12,33),(6,37),(0,43),(0,38),(5,33),(9,31),(15,25),(20,22),(22,19),(22,13),(20,8)],'violet-crystal',3)
  p([(22,3),(23,3),(23,12),(25,16),(25,19),(23,19),(23,15),(21,10)],'dark-rock',5)
  p([(10,35),(19,29),(24,27),(24,31),(19,37),(17,42),(9,44),(9,40)],'dark-rock',5)
  p([(13,36),(19,32),(21,32),(18,35),(15,40),(12,41)],'violet-crystal',3)
  p([(27,37),(31,37),(37,42),(47,42),(47,47),(21,47),(21,43)],'dark-masonry',4)
  p([(3,5),(10,5),(13,8),(10,10),(6,10),(3,8)],'dark-rock',4)
  p([(34,6),(39,6),(42,9),(39,12),(36,11)],'dark-rock',4)
  p([(34,16),(37,19),(35,21),(32,18)],'violet-crystal',3)
  b((3,23,8,25),'dark-rock',5)
  b((30,33,34,34),'dark-masonry',4)
 elif name in ('station_corridor','station_lab'):
  # The two passed studies are reproduced exactly if the output is absent.
  a,t=('station-panels',3) if name=='station_lab' else ('clean-tile',3)
  for box in [(0,0,47,1),(0,2,1,47),(46,2,47,47),(2,46,45,47)]:b(box,a,t)
  if name=='station_corridor':
   for box in [(5,6,15,7),(5,8,6,16),(34,31,41,32),(40,33,41,41)]:b(box,a,t)
   for pts in [[(7,33),(11,32),(16,32),(19,33)],[(24,17),(27,17),(29,18),(35,18)]]:d.line(pts,fill=c(a,t),width=2)
  else:
   for box in [(6,6,17,7),(6,8,7,17),(32,39,40,40),(39,32,40,38),(10,10,14,11),(34,34,36,36)]:b(box,a,t)
 if name=='cave_ice':
  marks(d,'station-panels',3,[[(17,7),(19,5),(21,5)],[(6,20),(10,20),(12,18)],[(32,27),(35,30),(37,30)],[(20,42),(23,45),(25,45)]])
  marks(d,'frost',3,[[(18,14),(21,11)],[(36,23),(39,26)],[(3,25),(7,25)],[(30,44),(34,44)]])
 elif name=='cave_crystal':
  patches(d,'dark-masonry',4,[[(2,14),(6,12),(8,12),(8,14),(5,16)],[(32,2),(37,2),(37,4),(34,4)],[(36,36),(40,36),(42,38),(38,39)]])
  marks(d,'dark-rock',5,[[(9,21),(12,19),(14,19)],[(28,16),(30,18)],[(3,44),(6,44)],[(29,41),(32,43),(34,43)]])
 cleanup={
  'cave_ice':[('frost',3,[(31,10),(30,11),(29,12),(28,13),(27,14),(26,15),(25,16),(24,17),(23,18),(40,27),(41,28),(42,29),(43,30),(44,31),(45,32),(46,33),(47,34)])],
  'cave_crystal':[('dark-masonry',4,[(10,19)]),('violet-crystal',3,[(32,19),(33,20),(34,21)]),('dark-rock',5,[(15,31),(14,32),(11,34)])]
 }
 for rr,ss,points in cleanup.get(name,[]):
  for xy in points:d.point(xy,fill=c(rr,ss))
 return im
