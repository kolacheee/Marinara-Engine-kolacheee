from process import *

sources=[('innkeeper-front','innkeeper-front-v1.png'),('innkeeper-side','innkeeper-side-v3.png'),('elder-front','elder-front-v2.png'),('elder-side','elder-side-v1.png')]
for name,source in sources:
    reduce(OUT/'test-big'/source,OUT/f'test-{name}.png')
refs=[(f'{char.title()} / {view}',ROOT/'ref-sprites'/f'{char}-{view}.png') for char in ['wren','hadrik','noble'] for view in ['front','side']]
tests=[(name.replace('-',' / ').title(),OUT/f'test-{name}.png') for name,_ in sources]
entries=refs+tests
bg=Image.open(ROOT/'STYLE-SHEET.png').convert('RGB').getpixel((0,0))
strip=Image.new('RGB',(2880,448),bg)
draw=ImageDraw.Draw(strip)
font=ImageFont.load_default(size=19)
small=ImageFont.load_default(size=14)
native=Image.new('RGB',(960,128),bg)
for i,(label,path) in enumerate(entries):
    sprite=Image.open(path).convert('RGBA')
    assert sprite.size==(96,128)
    scaled=sprite.resize((288,384),Image.Resampling.NEAREST)
    strip.paste(scaled,(i*288,48),scaled)
    width=draw.textlength(label,font=font)
    draw.text((i*288+(288-width)/2,12),label,font=font,fill='#191B24')
    kind='REFERENCE' if i<6 else 'TEST'
    width=draw.textlength(kind,font=small)
    draw.text((i*288+(288-width)/2,34),kind,font=small,fill='#50515A')
    native.paste(sprite,(i*96,0),sprite)
strip.save(OUT/'test-strip.png')
native.save(OUT/'review'/'all-native.png')
for index,(left,right) in enumerate([(0,864),(864,1728),(1728,2304),(2304,2880)],1):
    strip.crop((left,0,right,448)).save(OUT/'review'/f'strip-fullsize-{index}.png')
checks=[check(p) for _,p in tests]
union=set()
all_union=set()
for _,path in entries:
    colors={p[:3] for p in Image.open(path).convert('RGBA').getdata() if p[3]}
    all_union.update(colors)
    if path.parent==OUT: union.update(colors)
assert union<=set(PAL) and all_union<=set(PAL)
result={'sprites':checks,'test_color_union':len(union),'reference_and_test_color_union':len(all_union),'strip_size':list(strip.size),'strip_scale':3,'strip_background_rgb':list(bg),'accepted_originals':dict(sources)}
(OUT/'checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
