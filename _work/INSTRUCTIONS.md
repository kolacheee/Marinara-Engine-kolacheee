# Translation job: Advanced Parameters (settings a service refuses, Gemini 3)

No UI strings changed. Only one guide changed.

## Docs
The English guide `docs/prompts/generation-parameters.md` changed at the commit in `_work/english-source-commit.txt` (see it with `git diff 7e60cd4da^1 7e60cd4da -- docs/prompts/generation-parameters.md` in an engine checkout of that commit). Update `prompts/generation-parameters.md` in all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans) to match. Only the section "Some models ignore some parameters" changed:
- The example sentence now says "Gemini 3 and Gemini 4 models" take no Temperature, Top P, Top K, Frequency or Presence (instead of naming Gemini 4 Argon, Carbon, Hydrogen, Neon and Gemini 3.6 to 3.8 Flash).
- A new paragraph after it: some services block a setting whatever the model accepts; OpenRouter lists what each model takes; other services only refuse a request; Marinara then resends the message without that setting, leaves it out for that service and model from then on, hides its control, remembers it for 30 days; a setting added under Custom Parameters is always sent as written.
Translate only those changed parts; keep the rest of each file as it is. Bold UI labels and the name "Custom Parameters" must match each pack's existing translation. Keep link targets and `#fragments` byte-identical. Follow each language's glossary in `glossaries/`.
Then, from the engine checkout, for each changed pack run `node scripts/docs-i18n/build-manifest.mjs <path>/<lang> --source-commit <commit in _work/english-source-commit.txt>` and `node scripts/docs-i18n/validate-pack.mjs <path>/<lang>`.

## Finish
Delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch.
