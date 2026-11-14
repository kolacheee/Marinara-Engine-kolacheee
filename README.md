# Professor Mari theme test — 2026-11-14

Throwaway copy of `claude/project-thread-2pgsk6` (1627b90), fresh data folder, port 7871. Mari on a Codex (ChatGPT login) connection, images via Codex ChatGPT image generation.

## Runs
- `attempt1-gpt55/`, `attempt2-gpt54/`: every request refused: "The 'gpt-5.x' model is not supported when using Codex with a ChatGPT account." This login only offers gpt-6.x / gpt-5.6 now. Used **gpt-6-astra**.
- `attempt3-no-tools/`: Mari answered "I have no tools in this session". Cause: `openai.provider.ts` never sends native `tools` for `openai_chatgpt` (`!isOpenAIChatGPT &&` guard from #670), while `supportsNativeToolCalls()` says the provider has them, so pi sends tools that are silently dropped. Fix applied to the test copy only: `test-copy-provider-fix.diff`. With it Codex accepts tools and Mari works.
- `round1/`: the five requests (cafe, harbor day/night/weather, blue clone of Velvet Casket, starter edit, @import/script/logo request).
- Top level (`run.log`, `fb-*`, `mari-transcript.json`, `themes.json`): feedback round, where Mari was told what looked wrong.

## Findings
1. **Codex connection gives Mari no tools** (above). Real bug; needs the fix in the repo.
2. **Clear-weather backdrop vanished** (round 1, harbor). Mari set `--mari-app-backdrop-layers` only inside rain/snow/fog selectors; `CustomThemeInjector` turns on layers mode whenever the token appears anywhere in the CSS, and `theme-tokens.css` then paints `background: var(--mari-app-backdrop-layers)` which is unset in clear weather → nothing. Mari fixed it in her theme when told, but the app should fall back to `--mari-app-backdrop` when the layers token is unset.
3. **Quoted dialogue unreadable in the day palette** (pale grey on cream). Mari fixed it when told (`--mari-dialogue-color`).
4. **Mari can't look at images**: she generated 3 header options and said she "can't visually inspect these files", so "pick the best" was blind. Her tools return text only.
5. Velvet clone recolour first left the painted art red; when asked she recoloured all 11 pictures blue.
6. Starter theme edit refused (read-only) and @import / script refused, as intended.
7. Driver note: harbor round 0 ended before the art was attached (reply was cut, not a question), so the harbor finish happened during the velvet follow-ups.

Screenshots: `screenshots/round1` (before feedback), `screenshots/after-feedback` (final, + rain/snow GIFs). Capture scripts in `tools/`.
