#!/bin/bash
# usage: run.sh <tag> <task text>
W=/home/kolache/Downloads/hd2d-dungeons
TAG=$1; TASK=$2
PROMPT="You are a senior pixel artist. Read SPEC.md and tools/px.py in this folder first; follow SPEC.md exactly (style rules, ramps, sizes, output paths). Your part of the job: $TASK
Work in scratch/$TAG/ for intermediates; final files go to the out/ paths from SPEC.md. For each file choose the better route: procedural drawing in Python+PIL (best for seamless tiling and crisp shapes) or your image generation tool followed by 'python3 tools/px.py quant' and hand-cleaning. Then run 'python3 tools/px.py check' (off_palette and semi_alpha must be 0, lone under 3%, seam near 1.0 for tileables), make 2x2 tiling and 8x zoom previews with tools/px.py and LOOK at them with your image viewing ability; redo anything flat, noisy, smeared, with a visible seam or that does not read as its material. Quality bar: Octopath Traveler 2 environment art, in our palette. Finally append a section for your files to out/NOTES-$TAG.md (how each was made, honest weaknesses). Do not touch the repo/ folder."
/usr/lib/chatgpt/resources/codex exec --skip-git-repo-check -s workspace-write -C "$W" \
  -c model_reasoning_effort="high" -o "$W/runs/$TAG-last.txt" "$PROMPT" < /dev/null > "$W/runs/$TAG.log" 2>&1
echo "exit $?" >> "$W/runs/$TAG.log"
