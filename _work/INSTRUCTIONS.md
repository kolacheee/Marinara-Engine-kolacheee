# Translation job: full catch-up to ui/kolacheee (326 new UI strings, 12 changed UI strings, 31 guides)

The English source is the Engine commit in `_work/english-source-commit.txt` (ui/kolacheee). Use an Engine checkout at that commit for diffs and validators.

## UI strings
Work in each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- `_work/ui-missing.en.json`: 326 NEW keys, add them to every pack. They come from recent features: Chat settings / new-chat setup inside the chat tab (`chat.setupPage.*`), SillyTavern import reports (`ui.import.*`), the Image settings page in Library > Settings profiles (`imageSettings.*`), Connections setup / Defaults / Image reading prompt (`connections.*`), image mask canvas, Game setup lorebook picker (`game.setupLore.*`), window controls, keyboard shortcuts, Feature finder (`featureFinder.*`) and more. Look at where a key is used in the Engine source (`grep -rn "<key>" packages/client/src`) when the meaning is unclear.
- `_work/ui-changed.en.json`: 12 EXISTING keys whose English changed. Replace each pack's current translation with a translation of the new English. Notes: "Presets → Regexes" became "Library → Regex scripts"; the onboarding device titles are now plain headings ("Marinara on a Phone"), not questions; "New layout (UI overhaul preview)" is now just "New layout".
- Keep every `{{placeholder}}`, `⋯`, `›`, `→`, keyboard names (Ctrl, Enter, …) and literal commands exactly. Use each pack's existing translation for UI names that already exist (Library, Chat Settings, Connections, Settings profiles, Image reading, Professor Mari, …). Follow each language's glossary in `glossaries/` and the tone of nearby keys. Keep each pack's keys sorted the same way they already are. Do not remove stale keys.
- Then run `node scripts/ui-i18n/validate-packs.mjs <engine>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports. Every pack must reach 100% (20850/20850).

## Docs
Update all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans) for the guides in `_work/docs-to-sync.txt`, using the git diff named for each group. Translate only the changed parts and keep the rest of each file as it is (for Group C new files, translate the whole file). Bold UI labels must match each pack's translation of the UI strings. Code blocks, paths, URLs, link targets and `#fragments` stay byte-identical to English.
Then, from the Engine checkout, for each pack run `node scripts/docs-i18n/build-manifest.mjs <path>/<lang> --source-commit <commit in _work/english-source-commit.txt>` and `node scripts/docs-i18n/validate-pack.mjs <path>/<lang>`. Every pack must pass with 0 problems and no "English docs have no translation yet" note (today each pack fails with 15 link/orphan problems, all fixed by Groups B and C).

## If Codex runs out of usage
Stop right away. Do NOT finish the remaining translations any other way. Commit and push what is finished (keep `_work/`), and say which keys and guides are left.

## Finish
Delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch (kolacheee-i18n).
