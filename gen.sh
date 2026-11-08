#!/bin/bash
# usage: gen.sh persona name "subject prompt" [reference-image] [twin|regen]
#   twin  = edit the reference into its day/night twin, keeping composition (default when a reference is given)
#   regen = the reference is the previous round's image, shown only so the model sees what to fix
P=$1; N=$2; S=$3; R=$4; M=${5:-twin}
ROOT=~/Downloads/marinara-theme-images-r4
W=$ROOT/work/$P/$N
mkdir -p "$W"
IMG=(); PRE="create exactly one image"
if [ -n "$R" ]; then
  cp "$R" "$W/ref.png"; IMG=(-i "$W/ref.png")
  if [ "$M" = regen ]; then
    PRE="create exactly one NEW image. The attached ref.png is the previous version, shown only so you can see what went wrong; do not copy it where the brief below differs, follow the brief"
  else
    PRE="edit the attached reference image (ref.png) into exactly one new image, keeping the same composition, layout, camera and shapes in the same positions, changing only what the brief asks"
  fi
fi
start=$(date +%s)
/usr/lib/chatgpt/resources/codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C "$W" -m gpt-5.6-luna -c model_reasoning_effort="low" -o "$W/last.txt" "${IMG[@]}" -- \
  "Use your image generation tool to $PRE: $S. Absolutely no text, letters, numbers, words, signatures, watermarks or logos anywhere in the image. Save the generated image into the current working directory as raw.png and print its absolute path." < /dev/null > "$W/log.txt" 2>&1
rc=$?
end=$(date +%s)
echo "$P/$N rc=$rc secs=$((end-start)) exists=$( [ -f "$W/raw.png" ] && echo yes || echo no)" >> $ROOT/times.txt
