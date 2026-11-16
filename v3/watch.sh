#!/bin/bash
# Watches this branch for v3/requests-*.md files, runs each one through Codex once, pushes the raws.
# usage (from ~/Downloads/marinara-starters-v3): bash v3/watch.sh
# Stops when v3/STOP appears or after 6 hours with no new request.
cd ~/Downloads/marinara-starters-v3 || exit 1
idle=0
while [ ! -f v3/STOP ] && [ $idle -lt 360 ]; do
  git pull -q --rebase origin theme-starters-v3-images
  did=0
  for req in v3/requests-*.md; do
    [ -f "$req" ] || continue
    name=$(basename "$req" .md)
    [ -f "v3/done/$name.done" ] && continue
    echo "== $(date +%T) running $req"
    python3 v3/run.py "$req" 2>&1 | tee "v3/logs/$name.log"
    python3 v3/export.py "$req" 2>&1 | tee -a "v3/logs/$name.log"
    # one retry for anything missing
    missing=$(grep '^MISSING' "v3/logs/$name.log" | awk '{print $2}')
    if [ -n "$missing" ]; then
      python3 v3/run.py "$req" $missing 2>&1 | tee -a "v3/logs/$name.log"
      python3 v3/export.py "$req" 2>&1 | tee -a "v3/logs/$name.log"
    fi
    touch "v3/done/$name.done"
    git add v3/raw v3/logs v3/done v3/times.txt 2>/dev/null
    git commit -q -m "Starter themes v3: raws for $name"
    for t in 2 4 8 16; do git pull -q --rebase origin theme-starters-v3-images && git push -q origin HEAD:theme-starters-v3-images && break; sleep $t; done
    did=1
  done
  if [ $did = 0 ]; then idle=$((idle+1)); sleep 60; else idle=0; fi
done
echo "watch stopped"
