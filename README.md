# Marinara Engine theme gallery

This branch holds the starter themes for the Marinara Engine UI overhaul. They are not part of the
app's install: the app's **Settings > Appearance > Theme gallery** lists them from `themes/index.json`
and downloads a theme only when someone picks it.

You can also download any `themes/<name>.json` file from here and import it yourself in
**Settings > Appearance > Import theme**.

## Adding or changing a theme

1. Put the theme package (a `.json` exported from the theme editor, `"kind": "marinara.theme"`) in `themes/`.
   The file name, without `.json`, is the theme's gallery id: lowercase letters, digits and dashes.
2. Run `python3 themes/build-index.py` (needs Pillow). It records each file's size and checksum; the app
   refuses a download that doesn't match the list.
3. Commit both the theme and `themes/index.json`.

Every theme here goes through the same safety checks as an imported theme when it is applied
(no scripts, no outside links, pictures only from inside the theme).
