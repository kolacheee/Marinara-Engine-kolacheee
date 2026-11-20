# Translation job: message menu cleanup + Continue

## UI strings
Work in each UI pack in `ui/` (ar, de, es, fr, hi, ja, ko, pl, pt-BR, ru, zh-Hans).

- `_work/ui-missing.en.json`: 2 NEW keys, add them. Both are "Continue": a message action that makes the AI keep writing its last reply, appending to the same message. It is NOT "continue to the next step" (do not reuse wizard/dialog "Continue" translations such as `ui.noodle.wizardfooter.continue`). Use the verb the language uses for "keep writing / continue the text".
- `_work/ui-changed.en.json`: 4 EXISTING keys whose English changed. Replace each pack's current translation with a translation of the new English:
  - `ui.overhaul.messagebuttons.allOnMessage` no longer says "⋯ lists them too": the ⋯ menu now only keeps extra actions such as Peek prompt (use the pack's translation of `ui.chat.chatmessage.peekPrompt`).
  - The three `continueAddsNewline` keys now name the action "Continue" (same word as the new keys) instead of only `/continue`. Keep `/continue` literally where the English has it.
- Keep `⋯` and every `{{placeholder}}` exactly. Follow each language's glossary in `glossaries/` and the tone of nearby keys. Keep each pack's keys sorted the same way they already are.
- Then run `node scripts/ui-i18n/validate-packs.mjs <path to an engine checkout at the commit in _work/english-source-commit.txt>/packages/client/src/localization/locales/en.json --write-manifest` and fix anything it reports.

## Docs
These English guides changed at that commit; see `git diff 23426021f 9d9ff9dae -- docs/chats/messages.md docs/chats/sending-and-streaming.md docs/chats/slash-commands.md docs/settings/settings-overview.md` in the engine checkout. Update the same files in all ten doc packs (de, es, fr, hi, ja, ko, pl, pt-br, ru, zh-hans):
- `chats/messages.md`: the Regenerate/continue/retry table row now names **Continue** (or `/continue`); the "Continue a reply" section now explains Continue in the ⋯ menu / hold menu on the last AI reply, picking it in Settings → Chatting → Message buttons (it sits next to Regenerate), and `/continue` as the typed alternative; the setting is now called "Add a new line before Continue text".
- `chats/sending-and-streaming.md`: "use `/continue`" became "use **Continue** in its **⋯** menu, or `/continue`".
- `chats/slash-commands.md` and `settings/settings-overview.md`: only the setting name changed to "Add a new line before Continue text".
Translate only the changed parts; keep the rest of each file as it is. Bold UI labels must match each pack's translation of the UI strings above. Keep link targets and `#fragments` byte-identical.
Then, from the engine checkout, for each changed pack run `node scripts/docs-i18n/build-manifest.mjs <path>/<lang> --source-commit <commit in _work/english-source-commit.txt>` and `node scripts/docs-i18n/validate-pack.mjs <path>/<lang>`.

## Finish
Delete the `_work/` folder, commit as kolacheee <113030175+kolacheee@users.noreply.github.com> with no Co-Authored-By or other attribution lines, and push to this same branch (kolacheee-i18n).
