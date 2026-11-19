# Translation job: embedding notices + memories/lorebook vector UI

Translate every key in `_work/ui-missing.en.json` into each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- Keys `connections.builtinTts.aboutKokoro`, `connections.builtinTts.aboutSupertonic` and `connections.builtinEmotion.about` already exist in the packs with OLD English wording: replace those translations with translations of the new English.
- All other keys are new: add them.
- Keep every `{{placeholder}}` exactly as written. Keep model names (Qwen3-Embedding-0.6B, all-MiniLM) and "Embeddings" as the packs already translate that Connections job name.
- Plurals: these packs only use `_one` / `_other`; phrase each so it reads correctly for every count, as the packs' existing `_one`/`_other` keys do.
- Follow each language's glossary in `glossaries/` and the tone of nearby keys in the same pack.
- Keep each pack's keys sorted the same way they already are.
- Then run `node scripts/ui-i18n/validate-packs.mjs <path to an engine checkout at the commit in _work/english-source-commit.txt>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports.
- Finally delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch.
