# New starter themes, redesign (branch theme-starters-new5-images)

Batch 1 and its reviews were scrapped at the owner's request (2026-11-09). Five new designers each write
new5/requests-<theme>.md; they are merged into new5/requests-batchN.md. Run from ~/Downloads/marinara-theme-images-r6:

    git fetch origin theme-starters-new5-images && git checkout theme-starters-new5-images
    python3 new5/run.py new5/requests-batchN.md 2>&1 | tee new5/batchN.log
    python3 new5/export.py new5/requests-batchN.md
    git add new5/raw new5/batchN.log && git commit -m "New starter themes: batch N raws" && git push origin theme-starters-new5-images

`export.py` copies each raw to new5/raw/<persona>/<name>.webp; the cloud side crops, tiles and cleans alpha.
Retry anything missing (`python3 new5/run.py new5/requests-batchN.md persona/name ...`) and write new5/DONE-batchN when finished.
