# Foundry UI contribution rules

## Product direction

- Foundry UI is a neutral design system for collaborative digital products. Examples should use creative-workspace concepts such as projects, assets, teams, publishing, reviews, tasks, and notifications.
- Do not introduce banking, lending, payments, balances, interest rates, bank accounts, financial eligibility, or region-specific copy into component examples.
- All user-facing documentation and examples must be written in English.

## Component documentation standard

- Treat every documented component as a production component, not a static visual sample.
- Split materially different variants into separate named demo sections. In particular, horizontal, vertical, compact, descriptive, and responsive arrangements must not be combined into one undifferentiated example.
- Document every applicable state: default, hover (as a labelled static reference only), focus, active or pressed, selected or checked, indeterminate where relevant, loading, empty, error or invalid, read-only, and disabled.
- Examples must use native semantics and working JavaScript where interaction changes state. Static state specimens must use the same public classes and attributes as the live component.
- Provide multiple pagination variants, including numbered, compact previous/next, truncated/ellipsis, first/last-page disabled states, and a narrow-screen treatment.

## Responsive quality bar

- Every component and card composition must be usable at desktop, tablet, and phone widths without clipping, accidental overflow, overlapping controls, or unreadable content.
- Prefer fluid grids, container queries, wrapping toolbars, and scrollable data regions. Never rely on a desktop-only fixed width.
- Keep touch targets at least 44 by 44 CSS pixels where the compact visual treatment allows it.
- Before publishing changes, run `npm run check` and visually inspect affected pages in light and dark preview themes at desktop, tablet, and mobile sizes.

## Repository workflow

- Final work belongs on `main`; do not open pull requests for routine design-system changes.
- Keep source assets local and portable. Do not add framework, CDN, or runtime dependencies unless the task explicitly requires them.
