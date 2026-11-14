# Mari theme test — round 4 (2026-11-14)

Build `claude/project-thread-2pgsk6` @ 8945d931d, same data folder, Mari on gpt-6-astra. Prompts: `feedback4.json`. Day shots with the app's Color scheme = Light, night with Dark (set back to Dark afterwards).

| Fix | Result |
|---|---|
| Harbor Library toolbar shapes | **Worked**: search, buttons, sort and grid/list toggle all 4px; selected segment follows the container (`harbor-*-toolbar*-2x.png`, `*-viewtoggle-2x.png`) |
| Harbor composer inner box | **Worked**: one frame (`harbor-*-composer-2x.png`) |
| Café Library toolbar shapes | **Worked**: all 10px, toggle segment matches |
| Café composer inner box | **Worked** |
| Café Home title/buttons backing | **Worked**: opaque cream (day) panel behind title and mode buttons; phone light is readable (`cafe-light-home-phone.png`). The counter picture is now mostly covered on desktop. |
| Velvet day crosses + skull bow | **Worked**: recoloured blue after she looked at them |
| Velvet day picket trim | **Not done**: `fence-day.svg`; `mari images look` refuses SVG theme pictures with a misleading error ("Image editing requires --source …, or a target that already has an image"). She said so honestly. A small lilac bat-wing heart sticker by the names is also still lilac (not in the prompt). |

## Other findings
- No new files in the app folder this round (`app-folder-before.txt` / `app-folder-after.txt`; the two from round 3 are still there).
- `updatedAt`: Velvet (changed via `mari images assign`) is stamped, but Harbor and Café, changed via `app_data theme.update`, still show their old `updatedAt` (11:58 and 13:01 UTC) although their CSS changed (8051→9144, 6017→7799 chars).
