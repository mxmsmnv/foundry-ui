# Icon import

Foundry UI converts the audited public `gds-icons` font into portable SVG symbols. The generated library does not require the original font, CSS, Liferay, or JavaScript runtime.

- Source audit: the public banking interface used as the initial visual reference
- Source format: TrueType icon font with CSS codepoint mappings
- Imported glyphs: single-path functional icons
- Excluded: multi-layer country flags and duplicate IDs already designed for Foundry UI
- Output: `src/icons.svg`, `src/icon-registry.js`, and `src/icon-sprite.js`

To refresh the generated symbols, download the public CSS and font into a temporary directory, install `fonttools` outside the project, and run:

```sh
PYTHONPATH=/path/to/fonttools python3 scripts/import-icon-font.py \
  --css /tmp/source/main.css \
  --font /tmp/source/gds-icons.ttf \
  --sprite src/icons.svg \
  --registry src/icon-registry.js
```

The importer normalizes every glyph to a centred 24×24 `currentColor` SVG symbol. Existing Foundry icon IDs take precedence.

After importing icons, regenerate the file-protocol-compatible inline runtime:

```sh
npm run build:icons
```
