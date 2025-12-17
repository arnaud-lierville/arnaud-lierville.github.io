# Third-party notices / Avis sur les composants tiers

This repository includes (or references at runtime) third‑party software and assets.
Their respective licenses apply.

## Web libraries (CDN) used by pages in this repo

- **Bootstrap 4** (CSS/JS via CDN): used by `index.html`, `licence.html` (and likely other pages).
  - License: MIT (see Bootstrap license page).
- **jQuery (slim)** (JS via CDN): used by `index.html`, `licence.html`.
  - License: MIT (see jQuery project).
- **Popper.js** (JS via CDN): used by `index.html`, `licence.html`.
  - License: MIT (see Popper project).

- **Bootstrap 5** (CSS/JS bundle via CDN): used by `rodmaker2.html`.
  - License: MIT (see Bootstrap license).
- **Font Awesome Kit** (JS via `kit.fontawesome.com`): used by `rodmaker2.html`.
  - License/terms: see Font Awesome licensing/kit terms.
- **MathJax v3** (JS via CDN): used by `rodmaker2.html`.
  - License: see MathJax project license.
- **Paper.js** (JS via CDN): used by `rodmaker2.html`.
  - License: see Paper.js license.
- **qrcodejs** (JS via CDN): used by `qr-code/index.html`.
  - License: see qrcodejs project license.

## Bundled app assets (FigBank / RestFigBank)

The sub-apps `FigBank/` and `RestFigBank/` include bundled assets that mention:

- **Bootstrap v5.3.x** (bundled in generated assets)
- **Bootstrap Icons** (font files `.woff/.woff2` bundled)
- **Vue** (runtime code bundled; e.g. `@vue/shared` appears in generated assets)
- Possibly **PDF.js** (a `pdf.worker-*.mjs` is present in `RestFigBank/assets/`)

Please consult the upstream projects for license texts and requirements, and ensure any
required notices remain present in the generated bundles.
