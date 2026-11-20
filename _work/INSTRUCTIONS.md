# Translation job: Advanced Parameters (hidden settings, Main model)

## UI strings
Translate every key in `_work/ui-missing.en.json` into each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans). All five keys are new: add them.

- Keep every `{{placeholder}}` exactly as written. "Main" is the app's name for the default model: translate it the way each pack already does (see existing `connections.switcher.followMain` keys). "Shuffle" is the label of `connections.switcher.shuffle`: use that pack's translation.
- "Show unsupported parameters" / "Hide unsupported parameters" are a button that shows or hides generation settings the chat's model does not accept. "Not sent to this model" is a small note under such a setting. Use the packs' existing words for "parameters" (see keys under `generationParameters.` and `ui.ui.generationparametersfields.`).
- Follow each language's glossary in `glossaries/` and the tone of nearby keys in the same pack.
- Keep each pack's keys sorted the same way they already are.
- Then run `node scripts/ui-i18n/validate-packs.mjs <path to an engine checkout at the commit in _work/english-source-commit.txt>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports.

## Docs
The English guide `docs/prompts/generation-parameters.md` changed at that same commit (compare it with `git diff 23426021f~1 23426021f -- docs/prompts/generation-parameters.md` in the engine checkout). Update `prompts/generation-parameters.md` in all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans) to match:
- In "Where to find them", the sentence quoting the old note ("Change generation settings for this chat only...") is replaced by a paragraph about the **?** tip.
- The section "Some models ignore some parameters" is rewritten: settings a model does not use are hidden, **Show unsupported parameters** shows them marked **Not sent to this model**, and the three bullets about which model a chat follows.
Translate only those changed parts; keep the rest of each file as it is. Bold UI labels must match each pack's translation of the UI strings above. Keep link targets and `#fragments` byte-identical.
Then, from the engine checkout, for each changed pack run `node scripts/docs-i18n/build-manifest.mjs <path>/<lang> --source-commit <commit in _work/english-source-commit.txt>` and `node scripts/docs-i18n/validate-pack.mjs <path>/<lang>`.

## Finish
Delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch.
