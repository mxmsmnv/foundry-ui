# Foundry UI

A portable, framework-agnostic component library for building product interfaces. The documentation follows the information architecture of Designsystemet: searchable navigation, isolated previews, copyable examples, API notes, and accessibility guidance.

## Technology assessment

The audited source interface is **not Tailwind-based**. It runs on **Liferay Portal** and uses Liferay's **Clay/Bootstrap-derived CSS layer**, plus a large custom theme, design tokens, and a proprietary icon font. Older pages still expose legacy Liferay/Bootstrap and Font Awesome patterns. Embedded calculators are separate iframe applications with their own styles.

This repository intentionally does not reproduce that dependency stack. The extracted library is built with semantic HTML, portable CSS custom properties, minimal vanilla JavaScript, and an accessible dependency-free SVG icon sprite. It can be used directly or wrapped by React, Vue, Angular, Web Components, Twig, Blade, or any CMS.

All public classes and CSS custom properties use the Foundry Design namespace: `fd-` for classes and `--fd-` for tokens.

The default teal accent is optional. Choose a bundled palette class such as `fd-accent--blue` or set `--fd-accent`, `--fd-accent-hover`, `--fd-accent-contrast`, `--fd-accent-soft`, and `--fd-accent-soft-contrast` to any accessible palette at the application or component level.

Hanken Grotesk is bundled as the primary interface typeface in normal and italic variable WOFF2 files. Native system fonts remain available as fallbacks.

## Quick start

```html
<link rel="stylesheet" href="src/foundry.css">
<button class="fd-button fd-button--primary" type="button">Open an account</button>
```

Use an icon:

```html
<script src="src/icon-sprite.js"></script>
<svg class="fd-icon" aria-hidden="true"><use href="#search"></use></svg>
```

The inline sprite runtime keeps icon previews working when `index.html` is opened directly through `file://`. The standalone `src/icons.svg` remains available for server-hosted and bundled applications.

Run the documentation locally:

```bash
npm run dev
```

Then open `http://127.0.0.1:4173/`.

The catalog contains 72 isolated pages. Component examples include copyable HTML/CSS, dark-surface testing, and desktop/tablet/mobile preview frames. Dedicated audit pages document the 12-column grid, responsive card compositions, and applicable default, hover, focus, pressed, loading, disabled, filled, error, read-only, checked, selected, open, and closed states.

## Package layout

```text
src/foundry.css       Portable tokens and component styles
src/icons.svg         Standalone SVG icon sprite
src/icon-sprite.js    Inline sprite runtime for file:// compatibility
src/icon-registry.js  Searchable icon-name registry
src/fonts/            Hanken Grotesk webfonts and SIL OFL 1.1 license
components.js         Documentation registry and copyable examples
app.js                Documentation UI only
docs.css              Documentation shell only
tokens.json           Machine-readable token export
```

## Source audit

Captured on 25 August 2026 from several public landing, search, contact, form, product, and calculator contexts. Desktop measurements were verified at 1440 px and mobile behavior at 390 px. The package preserves audited visual metrics and state behavior while remaining a normalized implementation reference rather than a byte-for-byte copy of production code.

## Licensing note

No open-source license is granted for Foundry UI itself. Original source assets remain the property of their respective owners. The bundled Hanken Grotesk font files are separately licensed under the SIL Open Font License 1.1; see `src/fonts/HANKEN-GROTESK-OFL.txt`. Foundry UI uses a schematic wordmark and newly drawn interface glyphs.
