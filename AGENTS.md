# Foundry UI contribution rules

## Product direction

- Foundry UI is a neutral design system for collaborative digital products. Examples should use creative-workspace concepts such as projects, assets, teams, publishing, reviews, tasks, and notifications.
- Do not introduce banking, lending, payments, balances, interest rates, bank accounts, financial eligibility, or region-specific copy into component examples.
- All user-facing documentation and examples must be written in English.
- Never use decorative ordinal labels such as `01`, `02`, `03`, numbered eyebrows, numbered card markers, or automatic example numbering. Numbers are allowed only when they communicate functional data, such as pagination, dates, quantities, measurements, ordered task steps, or version numbers.

## Component documentation standard

- Treat every documented component as a production component, not a static visual sample.
- Split materially different variants into separate named documentation examples, each with its own preview surface, responsive controls, theme toggle, and copyable code. In particular, horizontal, vertical, compact, descriptive, and responsive arrangements must not be combined into one preview card.
- A component preview must never contain multiple top-level demo sections inside one documentation example. Convert every top-level section into an entry in the component's `examples` collection and keep the automated catalog check passing.
- Foundation, utility, form, feedback, navigation, content, and pattern pages must each provide at least four isolated, production-oriented examples; preserve the expanded 41-page catalog coverage enforced by `scripts/check.mjs`.
- Document every applicable state: default, hover (as a labelled static reference only), focus, active or pressed, selected or checked, indeterminate where relevant, loading, empty, error or invalid, read-only, and disabled.
- Examples must use native semantics and working JavaScript where interaction changes state. Static state specimens must use the same public classes and attributes as the live component.
- Provide multiple pagination variants, including numbered, compact previous/next, truncated/ellipsis, first/last-page disabled states, and a narrow-screen treatment.
- Table documentation must include separate basic, configurable, row-state, responsive, sticky-header, empty/loading, comparison, and summary examples.
- Tabs documentation must include separate standard, contained, icon/count, scrollable, subnavigation, and state-reference examples with keyboard interaction.
- Lists documentation must include separate bulleted, ordered, checklist, action, activity, people, empty, loading, and state-reference examples.
- Video examples must remain self-contained with local MP4 and WebM sources, a poster, captions, transcript, native controls, and direct-download fallback.
- Heading documentation must isolate scale overview, display, page, section, subsection, module, compact, and label-heading guidance with exact type metrics and semantic usage.
- Dotnav and slidenav examples must be connected to real slides with clickable controls, keyboard and swipe support, live position text, current-dot state, and finite boundary states where applicable.
- Icon button documentation must isolate anatomy, visual variants, sizes, shapes, toggles, indicators, toolbar, tooltip, floating-action, and state-reference examples. Toggle state and toolbar keyboard mechanics must work.
- Toggle group documentation must isolate anatomy, single selection, icon-only, icon-and-label, sizes, multiple selection, responsive width, unavailable options, and state-reference examples. Single and multiple selection plus keyboard movement must work.
- Input documentation must isolate anatomy, native types, prefixes and suffixes, inline actions, password visibility, sizes, numeric constraints, validation, non-editable modes, and state references. Every field family must use the shared focus border and focus-ring tokens.
- Date input documentation must use one native picker indicator and isolate anatomy, live single date, constraints, range, optional clearing, date-time, month/week precision, validation, non-editable modes, and state references.
- Details documentation must isolate anatomy, independent FAQ, working single-open accordion, rich content, summary metadata, one-level nesting, compact density, and state-reference examples. Plus/minus icons must follow native open state.
- Typography documentation must isolate typeface, body scale, weights, prose rhythm, inline semantics, links, semantic lists, quotations, technical text, and responsive editorial composition with exact metrics and readable line lengths.

## Responsive quality bar

- Every component and card composition must be usable at desktop, tablet, and phone widths without clipping, accidental overflow, overlapping controls, or unreadable content.
- Keep a deliberate vertical rhythm between documentation sections. Dividers need generous space on both sides, headings must never sit against a preceding preview toolbar, and component interiors must use consistent gaps between media, text, metadata, and actions.
- Prefer fluid grids, container queries, wrapping toolbars, and scrollable data regions. Never rely on a desktop-only fixed width.
- Keep touch targets at least 44 by 44 CSS pixels where the compact visual treatment allows it.
- Before publishing changes, run `npm run check` and visually inspect affected pages in light and dark preview themes at desktop, tablet, and mobile sizes.

## Repository workflow

- Final work belongs on `main`; do not open pull requests for routine design-system changes.
- Keep source assets local and portable. Do not add framework, CDN, or runtime dependencies unless the task explicitly requires them.
- Keep the repository root deployable as a static GitHub Pages site. Use relative asset paths and preserve direct `file://` support.
- Foundry UI is proprietary source-available software. Do not describe it as open source, replace its license, or accept third-party development or contributions without the copyright holder's prior written permission.

## Reference-driven product workflow

- Treat this repository as the canonical source of reusable interface decisions when a user supplies a design-system or website reference for a product.
- First map the reference to existing Foundry UI tokens, components, and patterns. Build product screens from those public primitives instead of adding one-off copies.
- When the product requires a missing component, variant, interaction, or state, implement it in Foundry UI and add an isolated, copyable documentation example as part of the same change.
- Translate reference-specific visual decisions into neutral tokens and reusable behavior. Do not copy third-party brand names, proprietary artwork, region-specific content, or product-specific data into the public system.
- Keep product customization token-driven. A product may override accents, typography, density, radii, and other published tokens without forking component internals.
- Before committing, run `npm run check` and visually verify affected documentation and product views in light and dark themes at desktop, tablet, and phone widths.
- Commit reusable design-system improvements together with the product work that requires them so the product and its source system do not drift.
