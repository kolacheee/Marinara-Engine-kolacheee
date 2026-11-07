# Earth data (the Earth seed)

These files are baked by `scripts/earth/bake-earth.py` from the sources below. An Earth world samples an
area of them at its map's size on the server and keeps that sample with the world's brief.

| File                     | What it holds                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earth-grid.bin`         | gzip: a 0.1 degree grid (3600 x 1800, row 0 at 90N, column 0 at 180W), three byte planes: surface (0 sea, 1 lake, 2 land, 3 ice), height (metres / 32) and dryness (0 wet to 255 dry) |
| `earth-coast.bin`        | gzip: the coast and lakes at 0.02 degrees (18000 x 9000), two bit planes (land, then lake), for town and region maps                                                                  |
| `earth-features.json.gz` | gzip JSON: rivers (name, rank, line), cities (name, country, state, lon, lat, population, rank, capital) and named regions (ranges, deserts, plains)                                  |

To bake them again, download the sources unchanged into one folder and run:

```
python3 -I scripts/earth/bake-earth.py SOURCE_DIR packages/server/src/assets/earth
```

## Sources

**Natural Earth** 1:10m, public domain (<https://www.naturalearthdata.com/>, from
<https://github.com/nvkelso/natural-earth-vector>): `ne_10m_land`, `ne_10m_lakes`,
`ne_10m_glaciated_areas`, `ne_10m_rivers_lake_centerlines`, `ne_10m_populated_places_simple`,
`ne_10m_geography_regions_polys`. Made with Natural Earth. Free vector and raster map data @
naturalearthdata.com.

**Elevation**: the Terrarium tiles at zoom 4 from the Terrain Tiles open dataset on AWS
(`s3.amazonaws.com/elevation-tiles-prod/terrarium/4/{x}/{y}.png`), made by Mapzen (Tilezen joerd), with
this attribution:

- ArcticDEM terrain data DEM(s) were created from DigitalGlobe, Inc., imagery and funded under National
  Science Foundation awards 1043681, 1559691, and 1542736.
- Australia terrain data © Commonwealth of Australia (Geoscience Australia) 2017.
- Austria terrain data © offene Daten Österreichs, Digitales Geländemodell (DGM) Österreich.
- Canada terrain data contains information licensed under the Open Government Licence, Canada.
- Europe terrain data produced using Copernicus data and information funded by the European Union, EU-DEM
  layers.
- Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration.
- Mexico terrain data source: INEGI, Continental relief, 2016.
- New Zealand terrain data Copyright 2011 Crown copyright (c) Land Information New Zealand and the New
  Zealand Government (All rights reserved).
- Norway terrain data © Kartverket.
- United Kingdom terrain data © Environment Agency copyright and/or database right 2015. All rights
  reserved.
- United States 3DEP (formerly NED) and global GMTED2010 and SRTM terrain data courtesy of the U.S.
  Geological Survey.

**Dryness** is not a source: the bake works it out from the climate belts by latitude, the distance from
the sea, the monsoon east coasts and westerly west coasts, and Natural Earth's deserts.
