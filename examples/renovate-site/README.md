# Renovate/48 static website prototype

A five-page, framework-free prototype assembled from Foundry UI public primitives: app header, mastheads, cards, card grids, workflow steps, feature banners, details, forms, alerts, buttons, and footer. Product CSS is limited to theme tokens and page-level composition. It is intentionally ready for later conversion into ProcessWire templates, but does not include a CMS, email delivery, analytics, or a production form endpoint.

## Pages

- `index.html` — home
- `services.html` — services and deliverables
- `process.html` — engagement process
- `pricing.html` — pricing ranges and scope boundaries
- `contact.html` — static project brief form

## Local preview

From the Foundry UI repository root:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/examples/renovate-site/`.

The working name `Renovate/48`, contact details, legal links, and production claims must be confirmed before launch. The contact form deliberately does not send data; it reports that ProcessWire delivery is pending.
