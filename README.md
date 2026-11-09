# Starter themes v2: Codex image requests

Fresh branch for the five new starter themes (designed from scratch). Each designer writes
`v2/requests-<theme>-<round>.md`, one image per line:

    <theme>/<file>.png | WxH | alpha(yes/no) | prompt

(`## ` headings and blank lines are skipped; `REGEN: ...` prompts use `v2/current/<theme>/<file>.png` as the
what-went-wrong reference; naming another `<theme>/<file>.png` in a prompt passes it as a style reference;
`relight A.png -> B.png | ...` makes B as a relit edit of A.)

On the owner's PC, one-time setup:

    cd ~/Downloads && git clone --single-branch -b theme-starters-v2-images https://github.com/kolacheee/Marinara-Engine-kolacheee marinara-starters-v2
    cd marinara-starters-v2 && bash v2/watch.sh

`watch.sh` runs each new request file once through `gen.sh` (Codex CLI image tool, 3 at a time), exports
`v2/raw/<theme>/<file>.webp`, pushes, and marks `v2/done/<name>.done`. The cloud side crops and cleans the raws.
Stop it by pushing `v2/STOP`.

The images are AI-generated with the Codex CLI image tool. All starter themes credit kolache; free to reuse.
