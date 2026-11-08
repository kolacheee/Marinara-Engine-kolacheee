#!/bin/bash
# usage: gen.sh persona name "subject prompt" [reference-image]
P=$1; N=$2; S=$3; R=$4
W=~/Downloads/marinara-theme-images-r3/work/$P/$N
mkdir -p "$W"
IMG=(); PRE="create exactly one image"
if [ -n "$R" ]; then cp "$R" "$W/ref.png"; IMG=(-i "$W/ref.png"); PRE="edit the attached reference image (ref.png) into exactly one new image, keeping the same composition, layout and style"; fi
start=$(date +%s)
/usr/lib/chatgpt/resources/codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C "$W" -m gpt-5.6-luna -c model_reasoning_effort="low" -o "$W/last.txt" "${IMG[@]}" -- \
  "Use your image generation tool to $PRE: $S. Absolutely no text, letters, numbers, words, signatures, watermarks or logos anywhere in the image. Save the generated image into the current working directory as raw.png and print its absolute path." < /dev/null > "$W/log.txt" 2>&1
rc=$?
end=$(date +%s)
echo "$P/$N rc=$rc secs=$((end-start)) exists=$( [ -f "$W/raw.png" ] && echo yes || echo no)" >> ~/Downloads/marinara-theme-images-r3/times.txt
