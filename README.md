# Starter themes v3: Codex image requests

Shared by the v3 starter theme designers. Each designer pushes `v3/requests-<slug>-<round>.md`, one image per line:

    <slug>/<file>.png | WxH | alpha(yes/no) | prompt

(`## ` headings and blank lines are skipped; `REGEN: ...` prompts use the previous raw as the what-went-wrong
reference; naming another `<slug>/<file>.png` in a prompt passes it as a style reference;
`relight A.png -> B.png | ...` makes B as a relit edit of A.)

On the owner's PC, one-time setup:

    cd ~/Downloads && git clone --single-branch -b theme-starters-v3-images https://github.com/kolacheee/Marinara-Engine-kolacheee marinara-starters-v3
    cd marinara-starters-v3 && bash v3/watch.sh

`watch.sh` runs each new request file once through `gen.sh` (Codex CLI image tool, 3 at a time), exports
`v3/raw/<slug>/<file>.webp`, pushes, and marks `v3/done/<name>.done`. Stop it by pushing `v3/STOP`.

The images are AI-generated with the Codex CLI image tool. Starter themes credit kolache; free to reuse.
