#!/bin/bash
# Watches this branch for v2/requests-*.md files, runs each one through Codex once, pushes the raws.
# usage (from ~/Downloads/marinara-starters-v2): bash v2/watch.sh
# Stops when v2/STOP appears or after 6 hours with no new request.
cd ~/Downloads/marinara-starters-v2 || exit 1
idle=0
while [ ! -f v2/STOP ] && [ $idle -lt 360 ]; do
  git pull -q --rebase origin theme-starters-v2-images
  did=0
  for req in v2/requests-*.md; do
    [ -f "$req" ] || continue
    name=$(basename "$req" .md)
    [ -f "v2/done/$name.done" ] && continue
    echo "== $(date +%T) running $req"
    python3 v2/run.py "$req" 2>&1 | tee "v2/logs/$name.log"
    python3 v2/export.py "$req" 2>&1 | tee -a "v2/logs/$name.log"
    # one retry for anything missing
    missing=$(grep '^MISSING' "v2/logs/$name.log" | awk '{print $2}')
    if [ -n "$missing" ]; then
      python3 v2/run.py "$req" $missing 2>&1 | tee -a "v2/logs/$name.log"
      python3 v2/export.py "$req" 2>&1 | tee -a "v2/logs/$name.log"
    fi
    touch "v2/done/$name.done"
    git add v2/raw v2/logs v2/done v2/times.txt 2>/dev/null
    git commit -q -m "Starter themes v2: raws for $name"
    for t in 2 4 8 16; do git pull -q --rebase origin theme-starters-v2-images && git push -q origin HEAD:theme-starters-v2-images && break; sleep $t; done
    did=1
  done
  if [ $did = 0 ]; then idle=$((idle+1)); sleep 60; else idle=0; fi
done
echo "watch stopped"
