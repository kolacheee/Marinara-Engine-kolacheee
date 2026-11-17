"""Process the critic redraws; reuse the original registration/mode pipeline."""
from pathlib import Path
from PIL import Image, ImageDraw
import importlib.util, json, sys, hashlib

REV=Path(__file__).resolve().parent
P='r16-Epolish-critic1-'
OLD='r16-Epolish-'
spec=importlib.util.spec_from_file_location('ep',REV/(OLD+'build.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
b.P=P

def old(n):return Image.open(REV/(OLD+n+'.png')).convert('RGBA')
def save(im,n):im.save(REV/(P+n+'.png'))

def main():
    parts={}
    # Isolate the three already-drawn components before registration. No
    # stretching a gust into a snowflake arm or constructing replacement shapes.
    for variant,cut in [('c',540),('d',490)]:
        ident='blizzard-'+variant
        parts[ident]=b.reduce(ident,b.NEUTRAL,boxes=[
            ((cut,0,1254,1254),(10,2,23,22)),
            ((0,0,cut,660),(1,7,9,12)),
            ((0,660,cut,1254),(1,15,9,20))])
    parts['blizzard-d-compact']=b.reduce('blizzard-d',b.NEUTRAL,boxes=[
        ((490,0,1254,1254),(10,3,23,20)),
        ((0,0,490,660),(1,7,9,12)),
        ((0,660,490,1254),(1,15,9,20))],suffix='-compact')
    parts['sand-c']=b.reduce('sand-c',b.SAND,boxes=[
        ((0,0,1254,490),(2,1,22,7)),
        ((0,490,1254,870),(1,9,23,15)),
        ((0,870,1254,1254),(2,17,22,23))])
    parts['sand-d']=b.reduce('sand-d',b.SAND,boxes=[
        ((0,0,1254,510),(5,1,23,7)),
        ((0,510,1254,810),(1,9,23,15)),
        ((0,810,1254,1254),(1,17,20,23))])
    cloud=old('clean-cloud-c');sun=old('clean-sun-a-cloudy-disc')
    for dy in [2,3,4]:parts['cloudy-down-'+str(dy)]=b.over(b.shift(sun,0,dy),b.shift(cloud,0,8))
    selected={'cloudy':'cloudy-down-3','blizzard':'blizzard-d-compact','sandstorm':'sand-d'}
    # Retained passing icons are never opened for writing.
    for name,key in selected.items():
        save(parts[key],'candidate-icon-'+name)
        if '--install' in sys.argv:
            parts[key].save(b.OUT/('icon-'+name+'.png'))
            parts[key].save(REV/(OLD+'candidate-icon-'+name+'.png'))
    w=720;h=len(parts)*150
    sheet=Image.new('RGB',(w,h),(48,53,62));draw=ImageDraw.Draw(sheet)
    for i,(name,im) in enumerate(parts.items()):
        y=i*150;draw.text((8,y+8),name,fill='white')
        for j,kind in enumerate(['dark','light']):
            for scale,x in [(1,8),(2,50),(4,120),(5,230)]:
                tile=b.panel(im,kind).resize((24*scale,24*scale),b.NN)
                sheet.paste(tile,(j*360+x,y+26))
    save(sheet,'selection')
    result={'method':'Built-in drawings on solid magenta; BOX registration to 192x192; existing four-colour palette; exact RGBA mode of all 64 samples per 8x8 block; one-pixel contour cleanup. Only existing drawings are composited.',
            'stages':b.STAGES,'selection':selected,'files':{},
            'cloudy_recipe':'Unchanged sun-a-cloudy-disc translated (0,3), behind unchanged cloud-c translated (0,8). No pixel edits or palette changes.'}
    for name,key in selected.items():
        im=parts[key];px=[p for p in im.get_flattened_data() if p[3]]
        result['files'][name]={'bounds':list(im.getbbox()),'opaque_pixels':len(px),'colours':len(set(px)),'components':[len(c) for c in b.components(im)],'pixel_sha256':hashlib.sha256(im.tobytes()).hexdigest()}
    (REV/(P+'measurements.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'installed':'--install' in sys.argv,'files':result['files'],'stages':len(b.STAGES)},indent=2))

if __name__=='__main__':main()
