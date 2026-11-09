#!/bin/bash
# usage: gen.sh persona name "subject prompt" [ref1,ref2,...] [twin|regen|ref]
#   twin  = edit the first reference into its relit twin, keeping composition (default when a reference is given)
#   regen = the reference is the previous round's image, shown only so the model sees what to fix
#   ref   = the references are existing theme images: match their style/content, recompose per the brief
P=$1; N=$2; S=$3; R=$4; M=${5:-twin}
ROOT=~/Downloads/marinara-starters-v2
W=$ROOT/work/$P/$N
mkdir -p "$W"
IMG=(); PRE="create exactly one image"; NAMES=()
if [ -n "$R" ]; then
  i=0; IFS=, read -ra RS <<< "$R"
  for r in "${RS[@]}"; do i=$((i+1)); cp "$r" "$W/ref$i.png"; IMG+=(-i "$W/ref$i.png"); NAMES+=("ref$i.png ($(basename "$(dirname "$r")")/$(basename "$r"))"); done
  LIST=$(IFS=';'; echo "${NAMES[*]}")
  if [ "$M" = regen ]; then
    PRE="create exactly one NEW image. The attached ref1.png is the previous version, shown only so you can see what went wrong; do not copy it where the brief below differs, follow the brief"
    [ ${#RS[@]} -gt 1 ] && PRE="$PRE (the other attached images are existing images from the same theme, given only as style and palette references: $LIST)"
  elif [ "$M" = ref ]; then
    PRE="create exactly one NEW image. The attached images are existing images from the same theme, given as style and content references: $LIST. Match their style, palette and subject matter, but compose a new image exactly as the brief below says"
  else
    PRE="edit the attached reference image (ref1.png) into exactly one new image, keeping the same composition, layout, camera and shapes in the same positions, changing only what the brief asks"
    [ ${#RS[@]} -gt 1 ] && PRE="$PRE (ref2.png is an existing image showing the target lighting and palette to match; take only its look, not its composition)"
  fi
fi
start=$(date +%s)
/usr/lib/chatgpt/resources/codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C "$W" -m gpt-5.6-luna -c model_reasoning_effort="low" -o "$W/last.txt" "${IMG[@]}" -- \
  "Use your image generation tool to $PRE: $S. Absolutely no text, letters, numbers, words, signatures, watermarks or logos anywhere in the image. Save the generated image into the current working directory as raw.png and print its absolute path." < /dev/null > "$W/log.txt" 2>&1
rc=$?
end=$(date +%s)
echo "$P/$N rc=$rc secs=$((end-start)) exists=$( [ -f "$W/raw.png" ] && echo yes || echo no)" >> $ROOT/v2/times.txt
