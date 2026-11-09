# Theme weather art (branch theme-weather-images, 2026-11-09)

For the "themes restyle weather" feature: the app now labels the page with the story's weather
(`data-mari-weather="rain"` etc.), so a theme can show a different backdrop in bad weather.
Lantern Path's day backdrop has painted sunbeams (and its night one a moon glow), which look wrong
in rain, fog, snow and storms, so it gets weather twins.

Same method as round 6: `gen.sh` from ~/Downloads/marinara-theme-images-r6 (one Codex generation per line).
Every line here is an EDIT of the named reference in `wx/current/<persona>/<file>.png`
(gen.sh mode `twin`), keeping the composition pixel for pixel, then resized/cropped to the exact size.
Results go to `wx/images/<persona>/<file>.png`. Write `wx/DONE` when the batch is finished (and
`wx/notes.md` for anything that needed retries).

Requests: `wx/requests-batch1.md` (line format: `edit <ref> -> <persona>/<file>.png | WxH | transparent? | prompt`).
