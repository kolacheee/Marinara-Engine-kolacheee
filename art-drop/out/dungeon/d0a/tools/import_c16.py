"""Tolerant block read-back of operator-approved image-tool sources.

Source images and raw readings stay in review-d0a. Each grid block supplies
one colour; no spatial resize/filter is used in artwork. Region assembly and
palette choices are recorded below. Reviews alone use nearest-neighbour zoom.
"""
import json
from pathlib import Path
from collections import Counter
from statistics import median
from PIL import Image, ImageDraw
from draw_proofs import BASE, REVIEW, P, S, c
from check_proofs import rgb, light
from check_registered_c12 import boundaries

SELECT = dict(keep=1, temple=2, manor=3, crypt=2, cave_rock=1,
              cave_ice=1, cave_crystal=1, cave_lava=1, dungeon_sewer=1, yard=3)

def read_source(path, grid):
    src=Image.open(path).convert('RGB'); px=src.load()
    xs,ys=(boundaries(src.width,grid['x_grid']),boundaries(src.height,grid['y_grid']))
    out=Image.new('RGB',(len(xs)-1,len(ys)-1)); coverage=[]
    for j,(y0,y1) in enumerate(zip(ys,ys[1:])):
        for i,(x0,x1) in enumerate(zip(xs,xs[1:])):
            values=[px[x,y] for y in range(y0,y1) for x in range(x0,x1)]
            bins={}
            for v in values: bins.setdefault(tuple((q+8)//16 for q in v),[]).append(v)
            candidates=[]
            for members in sorted(bins.values(),key=len,reverse=True)[:3]:
                centre=tuple(sum(v[k] for v in members)/len(members) for k in range(3))
                candidates.append(min(members,key=lambda v:sum((v[k]-centre[k])**2 for k in range(3))))
            groups=[[v for v in values if max(abs(v[k]-q[k]) for k in range(3))<=8] for q in candidates]
            members=max(groups,key=len)
            centre=tuple(sum(v[k] for v in members)/len(members) for k in range(3))
            chosen=min(members,key=lambda v:sum((v[k]-centre[k])**2 for k in range(3)))
            out.putpixel((i,j),chosen);coverage.append(len(members)/len(values))
    return out,dict(size=list(out.size),
        dominant_cluster_75_percent=100*sum(x>=.75 for x in coverage)/len(coverage),
        median_cluster_coverage=median(coverage), x_grid=grid['x_grid'], y_grid=grid['y_grid'])

def read_all():
    grids=json.loads((REVIEW/'C12-grid-validation.json').read_text());report={}
    for n,k in SELECT.items():
        path=REVIEW/f'C12-sources/{n}-{k}.png'; grid=next(g for g in grids if Path(g['source']).stem==path.stem)
        out,stats=read_source(path,grid);out.save(REVIEW/f'C16-read-{n}.png');report[n]=dict(source=str(path),**stats)
    (REVIEW/'C16-registration.json').write_text(json.dumps(report,indent=2)+'\n')
    for page in range(2):
        names=list(SELECT)[page*5:page*5+5]; sheet=Image.new('RGB',(1200,400*len(names)),'#222630');d=ImageDraw.Draw(sheet)
        for j,n in enumerate(names):
            im=Image.open(REVIEW/f'C16-read-{n}.png');d.text((8,j*400+4),f'{n} {im.size}: actual block readings / 3x nearest',fill='white')
            sheet.paste(im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST),(8,j*400+24))
            # Rulers refer to native read-back rows/columns.
            for y in range(0,im.height,8):d.text((im.width*3+16,j*400+24+y*3),str(y),fill='white')
        sheet.save(REVIEW/f'C16-reads-{page}.png')
    print(json.dumps(report,indent=2))



# Palette choices by surface role. These are existing active canon colours.
ROLE={
 'keep': [('limestone:1','iron:2','limestone:2'),('limestone:1','limestone:2','iron:3'),('iron:3','limestone:3')],
 'temple':[('sandstone:1','marble:1','sandstone:2'),('sandstone:1','sandstone:2','sandstone:3'),('marble:2','marble:3')],
 'manor':[('timber:1','timber:2','timber:3'),('timber:2','timber:3','plaster:2'),('parquet:3','timber:4')],
 'crypt':[('dark-masonry:2','dark-masonry:3','lichen:2'),('dark-masonry:2','dark-masonry:3','dark-masonry:4'),('dark-masonry:4','dark-masonry:5')],
 'cave_rock':[('mud:1','mud:2','grey-brown-rock:2'),('grey-brown-rock:1','grey-brown-rock:2','grey-brown-rock:3'),('mud:4','mud:5','grey-brown-rock:3')],
 'cave_ice':[('blue-ice:1','frost:1','blue-ice:2'),('frost:1','blue-ice:2','frost:3'),('blue-ice:2','blue-ice:3','snowdrift:3')],
 'cave_crystal':[('dark-rock:1','dark-rock:2','dark-rock:3'),('dark-rock:2','dark-rock:3','dark-rock:4'),('dark-rock:4','dark-rock:5','violet-crystal:3')],
 'cave_lava':[('basalt:2','basalt:3','basalt:4'),('basalt:2','basalt:4','ash:2'),('basalt:5','ash:3','basalt:6')],
 'dungeon_sewer':[('brick:1','brick:2','sewer-water:2'),('brick:2','brick:3','brick:4'),('brick:3','brick:4')],
 'yard':[('roof-slate:1','yard-cobble:1','roof-slate:2'),('yard-cobble:1','yard-cobble:2','yard-cobble:3'),('yard-cobble:3','yard-cobble:4')],
}
def colour(tag):
    ramp,step=tag.split(':');return rgb(c(ramp,int(step)))

def palette_band(im,name,role):
    """Palette lock discrete source planes, including muted material accents."""
    out=Image.new('RGB',im.size);px=im.load();op=out.load();choices=list(map(colour,ROLE[name][role]))
    # Explicit luminance boundaries sit between the selected source's flat planes.
    cuts={
      'keep':[(9,25),(20,48),(44,99)],
      'temple':[(17,34),(24,44),(48,99)],
      'manor':[(27,53),(30,65),(43,99)],
      'crypt':[(34,59),(33,59),(60,99)],
      'cave_rock':[(36,65),(35,45),(43,50)],
      'cave_ice':[(45,76),(56,76),(60,76)],
      'cave_crystal':[(20,43),(22,34),(32,49)],
      'cave_lava':[(18,34),(17,45),(39,48)],
      'dungeon_sewer':[(25,60),(27,43),(38,99)],
      'yard':[(25,58),(35,57),(47,99)],
    }
    low,high=cuts[name][role]
    for y in range(im.height):
        for x in range(im.width):
            p=px[x,y];r,g,b=p;L=light(p)
            # Two material planes plus recesses. Thresholds avoid keeping source shading.
            index=(0 if L<low else 1 if L<high else 2) if len(choices)==3 else int(L>low)
            q=choices[index]
            if name=='manor' and role==1:
                q=colour('plaster:2') if min(p)>110 and max(p)-min(p)<65 else colour('timber:3' if L>42 else 'timber:2')
            if name=='cave_lava' and role>0 and r>g*1.25 and r>b*1.25:
                q=colour(('embers:2' if L<40 else 'embers:3') if role==1 else ('basalt:5' if L<48 else 'embers:4'))
            if name=='crypt' and g>r*1.15 and g>b*1.25:q=colour('lichen:2' if role<2 else 'lichen:3')
            if name=='cave_crystal' and b>g*1.25 and r>g*1.08 and L>45:
                q=colour('violet-crystal:2' if role==0 else 'violet-crystal:3')
            if name=='cave_rock' and role==2:
                q=colour('grey-brown-rock:3') if max(p)-min(p)<35 else colour('mud:4' if L<44 else 'mud:5')
            if name=='dungeon_sewer' and g>r*.96 and g>b*1.15:
                q=colour('slime:2' if role<2 else 'slime:3')
            if name=='yard' and role==2:
                if g>r*1.03 and g>b*1.2:q=colour('yard-grass:3' if L<53 else 'yard-grass:4')
                elif r>b*1.3 and r>g*1.07:q=colour('yard-path:3' if L<58 else 'yard-path:4')
                else:q=colour('yard-cobble:3' if L<50 else 'yard-cobble:4')
            op[x,y]=q
    return out

def clean_small(im):
    """Merge 1/2-pixel fragments into an adjacent existing cluster; add no texture."""
    from check_proofs import components
    edits=[]
    for _ in range(4):
        small,_=components(im)
        if not small:break
        px=im.load()
        for group in small:
            points=group['points'];old=px[points[0][0],points[0][1]];neighbors=[]
            for x,y in points:
                for u,v in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    if 0<=u<im.width and 0<=v<im.height and (u,v) not in points:neighbors.append(px[u,v])
            if neighbors:
                counts=Counter(neighbors);new=min(counts,key=lambda q:(-counts[q],sum((q[k]-old[k])**2 for k in range(3))))
                for x,y in points:px[x,y]=new;edits.append([x,y,list(old),list(new)])
    return edits

def fit_region(im,size,fill=None):
    """Place whole native pixels, cropping overhang; fill only missing calm margin."""
    fill=fill or Counter(im.get_flattened_data()).most_common(1)[0][0]
    out=Image.new('RGB',size,fill);out.paste(im,((size[0]-im.width)//2,(size[1]-im.height)//2));return out

# Native source crop rectangles. Neither this table nor assembly rescales art.
CROPS={
 'keep':[(0,18,224,58),(0,75,224,122),(0,150,224,198)],
 'temple':[(0,38,224,78),(0,98,224,145),(0,164,224,212)],
 'manor':[(0,76,131,116),(0,27,131,74),(0,76,131,124)],
 'crypt':[(0,4,126,44),(0,48,126,95),(0,99,126,125)],
 'cave_rock':[(24,10,168,50),(24,80,168,127),(24,158,168,206)],
 'cave_ice':[(0,3,127,43),(0,44,127,91),(0,94,127,127)],
 'cave_crystal':[(0,4,127,44),(0,46,127,93),(0,96,127,126)],
 'cave_lava':[(0,0,117,33),(0,33,117,77),(0,80,117,114)],
 'dungeon_sewer':[(0,4,118,44),(0,35,118,82),(0,85,118,110)],
 'yard':[(5,1,149,41),(5,53,149,100),(5,110,149,158)],
}

def assemble():
    report={}
    for name in SELECT:
        src=Image.open(REVIEW/f'C16-read-{name}.png').convert('RGB')
        regions=[palette_band(src.crop(box),name,i) for i,box in enumerate(CROPS[name])]
        top,face,floor=regions
        if name in ('keep','temple'):
            # Separate original source slabs, translated to the canonical 48px cells.
            for i,region in enumerate(regions):
                row=Image.new('RGB',(144,region.height))
                xs=(0,75,150) if i!=1 else (20,68,116)
                for k,x in enumerate(xs):row.paste(region.crop((x,0,x+48,region.height)),(k*48,0))
                regions[i]=row
            top,face,floor=regions
        # Remove generated cave-floor tile separators, using adjacent plane colour.
        divider_ranges={'cave_rock':[(43,47),(111,115)],'cave_ice':[(42,44),(84,87)],
                        'cave_crystal':[(41,44),(84,87)],'cave_lava':[(38,41),(78,81)]}
        if name in divider_ranges:
            px=floor.load()
            for x0,x1 in divider_ranges[name]:
                for y in range(floor.height):
                    for x in range(x0,min(x1,floor.width)):px[x,y]=px[x0-1,y]
        top=fit_region(top,(144,40));face=fit_region(face,(144,47));floor=fit_region(floor,(144,48))
        if name=='manor':
            # Extend the cap's calm upper plane; preserve the source beam's joinery.
            cap=palette_band(src.crop((0,0,131,10)),name,0)
            top=Image.new('RGB',(144,40),colour('timber:2'));top.paste(cap,(6,30))
            d=ImageDraw.Draw(top)
            for x in (48,96):d.line((x,0,x,29),fill=colour('timber:1'))
            d.line((0,0,143,0),fill=colour('timber:3'))
        # Existing face material supplies the baseline; floor joints use floor values.
        if name in ('keep','temple','crypt','manor','dungeon_sewer'):
            d=ImageDraw.Draw(floor);joint=colour(ROLE[name][2][0])
            for x in (0,48,96):d.line((x,0,x,47),fill=joint)
            d.line((0,0,143,0),fill=joint)
        if name in ('keep','temple'):
            d=ImageDraw.Draw(top)
            for x in (48,96):d.line((x,0,x,39),fill=colour(ROLE[name][0][0]))
        if name in ('crypt','dungeon_sewer'):
            # Give source capstones their full top-plane depth using calm infill.
            cap=palette_band(src.crop((0,4,src.width,24)),name,0)
            cap=fit_region(cap,(144,20));top=Image.new('RGB',(144,40),colour(ROLE[name][0][1]));top.paste(cap,(0,20))
            d=ImageDraw.Draw(top)
            for x in (48,96):d.line((x,0,x,39),fill=colour(ROLE[name][0][0]))
            d.line((0,0,143,0),fill=colour(ROLE[name][0][2]))
            # Relocate source panel separators to the 48px construction grid.
            original=regions[2];row=Image.new('RGB',(144,48))
            for i in range(3):
                x0=round(original.width*i/3)+2;x1=round(original.width*(i+1)/3)-2
                cell=fit_region(original.crop((x0,0,x1,original.height)),(48,48))
                row.paste(cell,(i*48,0))
            floor=row;d=ImageDraw.Draw(floor)
            for x in (0,48,96):d.line((x,0,x,47),fill=colour(ROLE[name][2][0]))
            d.line((0,0,143,0),fill=colour(ROLE[name][2][0]))
        if name=='yard':
            fresh=Image.open(REVIEW/'C16-read-yard-new.png').convert('RGB')
            floor=Image.new('RGB',(144,48))
            # One tuft only: the two duplicate source tufts lie outside this crop.
            for i,(x0,fill) in enumerate(((16,'yard-grass:3'),(76,'yard-path:4'),(128,'yard-cobble:3'))):
                part=fresh.crop((x0,72,x0+48,110))
                family=('yard-grass','yard-path','yard-cobble')[i];threshold=(51,46,39)[i]
                part.putdata([colour(f'{family}:{4 if light(v)>threshold else 3}') for v in part.get_flattened_data()])
                floor.paste(fit_region(part,(48,48),colour(fill)),(i*48,0))
        if name=='cave_rock':
            # Keep the source boulders; remove the numerous small mud highlights.
            px=floor.load()
            for y in range(48):
                for x in range(144):
                    if px[x,y]==colour('mud:5'):px[x,y]=colour('mud:4')
                    elif px[x,y]==colour('grey-brown-rock:3') and x<80:px[x,y]=colour('grey-brown-rock:4')
        if name=='cave_crystal':
            # Retain one broad source plane and the crystal chip; calm the rest.
            px=floor.load()
            for y in range(48):
                for x in range(144):
                    if px[x,y]==colour('dark-rock:5') and not (4<=x<=49 and 9<=y<=34):
                        px[x,y]=colour('dark-rock:4')
        if name=='cave_rock':
            # Hand repair the broken source fissure into a connected 4-by-3 stair.
            px=top.load();dark=colour('mud:1');plane=colour('mud:2')
            for y in range(4,30):
                for x in range(34,57):
                    if px[x,y]==dark:px[x,y]=plane
            ImageDraw.Draw(top).line([(52,5),(52,9),(49,9),(49,13),(46,13),
                (46,17),(43,17),(43,21),(40,21),(40,25),(38,25),(38,39)],fill=dark,width=2)
        edits={tag:clean_small(im) for tag,im in [('top',top),('face',face),('floor',floor)]}
        wall=Image.new('RGB',(144,96),rgb(c('void-mass',2)));wall.paste(top,(0,8));wall.paste(face,(0,48))
        ImageDraw.Draw(wall).line((0,95,143,95),fill=rgb(c(S[name][1][0],1)))
        proof=Image.new('RGBA',(144,144));proof.paste(wall,(0,0));proof.paste(floor,(0,96))
        prop=Image.open(REVIEW/f'C-layer-{name}-prop.png').convert('RGBA');proof.alpha_composite(prop,(86,96))
        # Initial assembly remains review-only until inspection and repairs finish.
        for tag,pic in [('top',top),('face',face),('floor',floor),('wall',wall),('proof',proof)]:pic.save(REVIEW/f'C16-{name}-{tag}.png')
        report[name]={'crops':CROPS[name],'cleanup_pixels':{k:len(v) for k,v in edits.items()},'cleanup':edits}
    (REVIEW/'C16-assembly.json').write_text(json.dumps(report,indent=2)+'\n')
    sheet=Image.new('RGB',(5*304,2*320),'#222630');d=ImageDraw.Draw(sheet)
    for i,n in enumerate(SELECT):
        im=Image.open(REVIEW/f'C16-{n}-proof.png');x=i%5*304;y=i//5*320;d.text((x+8,y+4),n,fill='white');sheet.paste(im.resize((288,288),Image.Resampling.NEAREST),(x+8,y+24))
    sheet.save(REVIEW/'C16-assembly-contact.png')

if __name__=='__main__':
    assemble()
