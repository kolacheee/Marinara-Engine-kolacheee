# Translation job: catch-up to ui/kolacheee 2140e0a1c (580 new UI strings, 30 changed UI strings, 38 guides)

The English source is the Engine commit in `_work/english-source-commit.txt` (ui/kolacheee). The packs' previous source was c5b623667.

## UI strings
Work in each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- `_work/ui-missing.en.json`: 580 NEW keys, add them to every pack. Most come from the UI overhaul (`ui.*`, `connections.*` setup and picker, `gestures.*`, `shortcuts.*`, `settings.search`, `library.*`, `lorebook.*`, `game.combat.*`, `rulesetBuilder.rankDisplay*`, …). When a key's meaning is unclear, look at where it is used in the Engine source at /home/kolache/Documents/GitHub/marinara-wt/en-src (`grep -rn "<key>" packages/client/src`).
- `_work/ui-changed.en.json`: 30 EXISTING keys whose English changed (old and new English given). Replace each pack's translation with a translation of the new English. Note the rename: "Built-in model" is now "On device" / "On this device", and the sidecar is now "Sidecar".
- Keep every `{{placeholder}}`, `**bold**` marker, `⋯`, `›`, `→`, keyboard names (Ctrl, Enter, …) and literal commands exactly. Reuse each pack's existing translation for UI names that already exist. Follow `glossaries/` and the tone of nearby keys. Keep keys sorted as they already are. Do not remove stale keys.
- Check with `node scripts/ui-i18n/validate-packs.mjs /home/kolache/Documents/GitHub/marinara-wt/en-src/packages/client/src/localization/locales/en.json`. Every pack must reach 100% (21712/21712).

## Docs
Update all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans).
- `_work/docs-issues.txt`: guides for issues #9884, #9902, #9903, #9912, #9928.
- `_work/docs-other.txt`: the remaining guides that changed.
For each guide the English diff is `_work/diffs/<path with / as _>.diff` and the full new English is `_work/en-new/<path>`. Translate only the changed parts and keep the rest of each translated file as it is. A guide that does not exist yet in a pack (new in English) gets a full translation. Bold UI labels must match each pack's translation of the UI strings. Code blocks, paths, URLs, link targets, `<a id>` anchors and `#fragments` stay byte-identical to English. Follow `glossaries/glossary-<lang>.md`.

## If Codex runs out of usage
Stop right away. Do NOT finish the remaining translations any other way. Say which keys and guides are left.

## Do not touch
Issues #9919, #9921 and #9925 belong to someone else: do not add their changes (REMOTE_ACCESS forwarding header / TRUSTED_HOSTS, backup-and-restore install-only settings, custom-tools masked webhooks, professor-mari data folder / patches / shell limits).
