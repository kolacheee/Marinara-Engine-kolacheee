# Translation job: catch-up to ui/kolacheee c5b623667 (284 new UI strings, 10 changed UI strings, 11 guides)

The English source is the Engine commit in `_work/english-source-commit.txt` (ui/kolacheee). Use an Engine checkout at that commit for diffs and validators.

## UI strings
Work in each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- `_work/ui-missing.en.json`: 284 NEW keys, add them to every pack. They come from recent ships: SillyTavern import reports and hardening (`ui.import.*`, `ui.modals.*`), New Game setup inside the game's tab (`game.setupPage.*`), new-chat setup page (`chat.setupPage.*`), Library Rulesets / Backgrounds / Game assets pages (`library.*`), screen reader announcements (`chat.announce.*`), keyboard focus and control names, Chat settings pages, omnibar settings, agent import window, Server console, and more. Look at where a key is used in the Engine source (`grep -rn "<key>" packages/client/src`) when the meaning is unclear.
- `_work/ui-changed.en.json`: 10 EXISTING keys whose English changed (old and new English are both given). Replace each pack's current translation with a translation of the new English. Note: "Always show swipe menu" is now "Show swipe arrows from the first reply".
- Keep every `{{placeholder}}`, `**bold**` marker, `⋯`, `›`, `→`, keyboard names (Ctrl, Enter, …) and literal commands exactly. Use each pack's existing translation for UI names that already exist (Library, Chat Settings, Connections, Rulesets, Backgrounds, Game assets, Professor Mari, …). Follow each language's glossary in `glossaries/` and the tone of nearby keys. Keep each pack's keys sorted the same way they already are. Do not remove stale keys.
- Then run `node scripts/ui-i18n/validate-packs.mjs <engine>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports. Every pack must reach 100% (21133/21133).

## Docs
Update all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans) for the 11 guides in `_work/docs-to-sync.txt`, using `git diff 827ae36bd <source> -- docs/<file>`. Translate only the changed parts and keep the rest of each file as it is. Bold UI labels must match each pack's translation of the UI strings. Code blocks, paths, URLs, link targets, `<a id>` anchors and `#fragments` stay byte-identical to English.
Then, from the Engine checkout, for each pack run `node scripts/docs-i18n/build-manifest.mjs <path>/<lang> --source-commit <commit in _work/english-source-commit.txt>` and `node scripts/docs-i18n/validate-pack.mjs <path>/<lang>`. Every pack must pass with 0 problems.

## If Codex runs out of usage
Stop right away. Do NOT finish the remaining translations any other way. Commit and push what is finished (keep `_work/`), and say which keys and guides are left.

## Finish
Delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch (kolacheee-i18n).
