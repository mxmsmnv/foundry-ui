# Raiffeisen HU Design System

A portable, framework-agnostic component library reconstructed from the public Raiffeisen Bank Hungary website. The documentation follows the information architecture of Designsystemet: searchable navigation, component overview, live previews, copyable examples, API notes, and accessibility guidance.

## Technology assessment

The source website is **not Tailwind-based**. It runs on **Liferay Portal** and uses Liferay's **Clay/Bootstrap-derived CSS layer**, plus a large custom Raiffeisen theme (`rbhu-*` classes), design tokens, the Amalia typeface, and a proprietary `gds-icon-*` icon font. Older pages still expose legacy Liferay/Bootstrap and Font Awesome patterns. Embedded calculators are separate iframe applications with their own styles.

This repository intentionally does not reproduce that dependency stack. The extracted library is built with semantic HTML, portable CSS custom properties, minimal vanilla JavaScript, and an accessible dependency-free SVG icon sprite. It can be used directly or wrapped by React, Vue, Angular, Web Components, Twig, Blade, or any CMS.

## Quick start

```html
<link rel="stylesheet" href="src/raif.css">
<button class="rb-button rb-button--primary" type="button">Open an account</button>
```

Use an icon:

```html
<svg class="rb-icon" aria-hidden="true"><use href="src/icons.svg#search"></use></svg>
```

Run the documentation locally:

```bash
npm run dev
```

Then open `http://127.0.0.1:4173/`.

## Package layout

```text
src/raif.css      Portable tokens and component styles
src/icons.svg     Dependency-free SVG icon sprite
components.js     Documentation registry and copyable examples
app.js            Documentation UI only
docs.css          Documentation shell only
tokens.json       Machine-readable token export
```

## Source audit

Captured on 25 August 2026 from the public pages `/`, `/kereses`, `/kapcsolat/panasz-bejelentese`, `/maganszemely/hitelek/szemelyi-kolcson`, theme token stylesheets, and the embedded personal-loan calculator. This is a normalized implementation reference, not an official Raiffeisen product or a byte-for-byte copy of its production code.

## Licensing note

No open-source license is granted by this repository. Raiffeisen names, brand assets, and the Amalia typeface remain the property of their respective owners. The included wordmark is schematic and the icon sprite consists of newly drawn interface glyphs.
