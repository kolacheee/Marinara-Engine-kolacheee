# Mari theme test — round 2 (2026-11-14)

Build `claude/project-thread-2pgsk6` @ 285b3c540 (contains the Codex tools fix), same data folder, Mari on gpt-6-astra.

- `fb2-*`, `run.log`, `mari-transcript.json`, `themes.json`: the feedback2.json prompts on 285b3c540 as shipped.
- `after-look-fix/`: two picture-judging prompts (`feedback2b.json` in tools) after patching the look-image bug below.
- `look-images-fix.diff`: the patch (test copy only).
- `screenshots/`: day/night × clear/rain/snow/fog for both themes (desktop + phone), Home, Library > Characters, Chat settings, Settings > Appearance, rain/snow GIFs, `sheet-*.png` contact sheets.

## Look-image bug (285b3c540)
`mari images look` works, but pi-runtime `toChatMessages` resends only the NEWEST round's pictures. Mari looks over several rounds (or looks, then reads docs), the Codex route replays no reasoning, so when she writes her answer the earlier pictures are gone. On 285b3c540 she said the viewer "returned attachment notices without viewable pictures" for all 4 harbor pictures and all 3 café versions, and picked café version 1 "provisionally". Patch keeps each round's pictures right after its tool results for the whole run (newest 8 pictures; older ones become a one-line note). After it she described every picture and picked café version 3 for a stated reason.

The `[mari-look:…]` marker never shows in visible message text, but it stays in the saved command trace of the assistant messages (stored tool output) and in live `tool_end` events, although the pi code comment says the saved result keeps only the words. Harmless (each stash entry is used once) but untidy. No provider error about images; one transient Codex "servers are currently overloaded" error, retried by the driver.
