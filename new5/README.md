# Five new starter themes (branch theme-starters-new5-images, 2026-11-09)

Aero Lagoon (aero), Nightshade Parlour (gothic), Saltwind Harbor (nautical), Brassworks Sky (steam),
Sodium Row (noir). Same method as round 6, run from ~/Downloads/marinara-theme-images-r6:

    git fetch origin theme-starters-new5-images && git checkout theme-starters-new5-images
    python3 new5/run.py new5/requests-batch1.md 2>&1 | tee new5/batch1.log
    python3 new5/export.py new5/requests-batch1.md
    git add new5/raw new5/batch1.log && git commit -m "New starter themes: batch 1 raws" && git push origin theme-starters-new5-images

`run.py` = run6.py with new5 paths (relight lines are twin edits, named images are style references).
`export.py` copies each raw to new5/raw/<theme>/<name>.webp; the cloud side crops, tiles and cleans alpha.
Retry anything that came back missing (`python3 new5/run.py new5/requests-batch1.md theme/name ...`),
note retries in new5/notes.md, and write new5/DONE when finished.
