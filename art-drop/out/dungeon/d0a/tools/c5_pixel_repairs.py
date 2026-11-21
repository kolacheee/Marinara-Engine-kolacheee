"""Native contour corrections. Coordinates refer to saved 144px floor art.
These fill clipped corners and join diagonal grain; no image filters are used.
"""
from draw_proofs import c

def ink(r,s):return tuple(bytes.fromhex(c(r,s)[1:]))+(255,)
FLOOR={
 'keep':[(ink('limestone',2),[(13,28),(8,40),(11,110),(12,110),(111,140)]),(ink('iron',3),[(132,77)])],
 'temple':[(ink('sandstone',3),[(13,62),(14,62)])],
 'manor':[(ink('parquet',3),[(43,35),(20,106)]),(ink('timber',4),[(91,130),(92,130),(92,131),(138,130),(139,130),(140,130)])],
 'crypt':[(ink('lichen',3),[(13,28),(8,40),(59,56),(60,56),(11,110),(12,110),(111,140)]),(ink('bone',2),[(132,77)]),(ink('lichen',3),[(2,101)])],
 'cave_ice':[(ink('blue-ice',2),[(22,45)]),(ink('snowdrift',3),[(19,131)])],
 'cave_crystal':[(ink('dark-rock',4),[(27,25),(28,26),(29,27),(30,27),(114,27),(114,28),(31,28),(125,28),(37,58),(37,59),(120,63),(120,64),(117,118),(118,118),(116,119),(43,137),(43,138),(96,137)])],
 'cave_lava':[(ink('basalt',5),[(48,105),(84,111),(85,111),(51,125)]),(ink('embers',3),[(42,112),(62,130),(69,138)]),(ink('embers',4),[(46,111),(67,129),(69,133),(68,134)])],
 'dungeon_sewer':[(ink('sewer-water',3),[(13,28),(8,40),(111,140)]),(ink('brick',3),[(132,77)])],
 'station_hydro':[(ink('overgrowth',3),[(9,106),(12,106),(12,107),(28,120)]),(ink('leaks',3),[(16,122),(17,123)])],
}
STUDY={}
FLOOR['manor'] += [(ink('timber',4),[(20,106)]),(ink('parquet',3),[(91,129)])]
FLOOR['cave_lava'] += [(ink('embers',4),[(42,112),(67,134)]),(ink('ash',3),[(51,125)])]
FLOOR['crypt']=[(ink('dark-masonry',5),[(13,28),(8,40),(59,56),(60,56),(11,110),(12,110),(111,140),(50,83),(2,134),(3,134)]),(ink('bone',2),[(132,77),(47,51),(47,52)]),(ink('lichen',3),[(2,101)])]
FLOOR['crypt'] += [(ink('bone',2),[(46,51),(46,52)])]
FLOOR['yard'] = [(ink('yard-cobble',3),[(133,75)])]
# The studies are 1:1 cutaways. These few edge pixels finish deposits that
# were clipped by their 48px crop boundary.
STUDY={
 'temple':[(ink('marble',2),[(29,46),(29,47)])],
 'cave_rock':[(ink('mud',4),[(30,24),(47,24)])],
 'cave_lava':[(ink('basalt',5),[(0,28)])],
}
FLOOR['manor'] += [(ink('timber',4),[(12,141)])]
FLOOR['station_lab'] = [(ink('spills',3),[(28,111)])]
