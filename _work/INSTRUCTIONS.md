# Translation job: embeddings page Languages row

Translate every key in `_work/ui-missing.en.json` into each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- `connections.builtinEmbedding.aboutQwen` already exists in the packs with OLD English wording ("Reads many languages and long texts"): replace it with a translation of the new English (the languages part moved to its own row).
- `languagesAllEngine`, `languagesSomeEngine` and `languagesUnnamed` are new: add them. They are the value of a "Languages" row on the embedding model page. `{{languages}}` and `{{missing}}` are lists of language names the app fills in already in the reader's language (via Intl), so don't add names yourself. "Marinara speaks" means the languages the Engine is translated into.
- Keep every `{{placeholder}}` exactly as written.
- Follow each language's glossary in `glossaries/` and the tone of nearby keys in the same pack.
- Keep each pack's keys sorted the same way they already are.
- Then run `node scripts/ui-i18n/validate-packs.mjs <path to an engine checkout at the commit in _work/english-source-commit.txt>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports.
- Finally delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch.
