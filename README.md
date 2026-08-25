# Foundry UI

Foundry UI is a portable, framework-agnostic UI system for collaborative digital products. It includes production-ready components, responsive patterns, copyable examples, design tokens, dark-mode previews, and a searchable registry of 963 dependency-free SVG icons.

[Open the live documentation](https://mxmsmnv.github.io/foundry-ui/) · [View the repository](https://github.com/mxmsmnv/foundry-ui)

## Test it

The hosted documentation is the fastest way to explore the system. Search for a component, switch between desktop, tablet, and phone previews, toggle the preview theme, interact with the controls, and copy the example code.

To run the same documentation locally:

```bash
git clone https://github.com/mxmsmnv/foundry-ui.git
cd foundry-ui
npm run dev
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). No install or build step is required. The documentation also supports direct `file://` access through `index.html`.

Validate the catalog after making changes:

```bash
npm run check
```

## Use it in a project

Copy `src/` and `tokens.json` into your project, then load the stylesheet and optional icon runtime:

```html
<link rel="stylesheet" href="src/foundry.css">
<script src="src/icon-sprite.js"></script>

<button class="fd-button fd-button--primary" type="button">
  <svg class="fd-icon" aria-hidden="true"><use href="#plus"></use></svg>
  Create project
</button>
```

The inline sprite runtime works on local files and hosted applications. Bundlers and server-hosted projects can use `src/icons.svg` directly instead.

Foundry UI does not require Tailwind, Bootstrap, React, or another runtime. It uses semantic HTML, portable CSS custom properties, minimal vanilla JavaScript, local Hanken Grotesk webfonts, and an accessible SVG sprite. Components can be wrapped by React, Vue, Angular, Web Components, Twig, Blade, or a CMS without changing their visual contract.

## Customize it

Public classes use the `fd-` namespace and tokens use `--fd-`. Override the accent at the application, section, or component level:

```css
:root {
  --fd-accent: #4f46e5;
  --fd-accent-hover: #4338ca;
  --fd-accent-contrast: #ffffff;
  --fd-accent-soft: #eef2ff;
  --fd-accent-soft-contrast: #312e81;
}
```

Bundled palette classes such as `fd-accent--blue` are also available. Keep custom color pairs accessible in light and dark contexts.

## Reference-to-product workflow

This repository is the canonical source for both the component library and its documentation. When using a visual reference to build a product:

1. Map the reference to existing Foundry UI tokens, components, and patterns.
2. Build the product with those public primitives instead of one-off styles.
3. When a required primitive or state is missing, add it to Foundry UI and document it with an isolated, copyable example.
4. Verify the affected component and product views in light and dark themes at desktop, tablet, and phone widths.
5. Run `npm run check`, then commit the reusable system improvement together with the product-facing change.

[`AGENTS.md`](AGENTS.md) is the machine-readable implementation contract for coding agents. It defines the content model, state coverage, responsive quality bar, and main-branch workflow that future changes must preserve.

## Documentation coverage

The catalog contains 72 pages and more than 300 independent, named previews instead of compressed showcase panels. Each materially different variant has its own responsive controls, theme toggle, and copyable code. The catalog covers horizontal, vertical, compact, descriptive, and responsive variants alongside applicable default, hover, focus, pressed, loading, disabled, filled, error, read-only, checked, indeterminate, selected, open, and closed states.

The neutral reference theme uses projects, assets, teams, reviews, and publishing rather than banking or region-specific scenarios. All public documentation and examples are in English.

## Package layout

```text
src/foundry.css       Portable tokens and component styles
src/icons.svg         Standalone SVG icon sprite
src/icon-sprite.js    Inline sprite runtime for file:// compatibility
src/icon-registry.js  Searchable icon-name registry
src/fonts/            Hanken Grotesk webfonts and SIL OFL 1.1 license
components.js         Documentation registry and copyable examples
app.js                Documentation UI and interactive previews
docs.css              Documentation shell styles
tokens.json           Machine-readable token export
AGENTS.md              Agent implementation and QA contract
```

## Origin and licensing

The original interface audit found a Liferay Portal implementation using a Clay/Bootstrap-derived layer, custom theme styles, design tokens, and a proprietary icon font. Foundry UI deliberately replaces that dependency stack with portable primitives and newly drawn interface glyphs.

Foundry UI is source-available under a proprietary license. Viewing and evaluation are allowed, but use, modification, development, deployment, and redistribution require prior written permission from the copyright holder. See [`LICENSE`](LICENSE). The bundled Hanken Grotesk files are separately licensed under the SIL Open Font License 1.1 in `src/fonts/HANKEN-GROTESK-OFL.txt`.
