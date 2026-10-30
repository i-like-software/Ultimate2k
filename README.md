# Ultimate2k — two design directions

Static, buildless HTML/CSS/JavaScript website prepared for design review. **Not published.**

- `index.html`: comparison landing page.
- `professional/index.html`: professional edition.
- `comic/index.html`: expressive comic edition.
- Both editions contain the same 21-page information architecture.
- Open `index.html` directly, or serve this folder with any static HTTP server.
- No framework, package installation, build step, backend, secrets or analytics.
- Fonts, logo, illustrations and scripts are local. The supplied logo is represented by a web-sized 128px copy; the original full-resolution file is retained separately in the local deliverables.

## Review first

The review bar switches between the equivalent page in each edition. Choose a direction before replacing the review homepage with the selected edition. Keep relative asset paths intact.

All service descriptions are proposed copy. Social media marketing and SEO were included to match the requested Digital Platforms sitemap; confirm that Ultimate2k offers them. Work examples are explicitly illustrative concepts. Team, news, careers, certificates and legal pages are labelled content awaiting confirmation. No client names, statistics, testimonials, certificates or staff profiles are invented.

Contact creates a browser-local text brief with download and copy options. **It does not send enquiries.** A verified contact destination or external form endpoint is required before launch. Native browser downloads depend on browser policy; the generated brief remains visible and copyable.

## GitHub Pages, after review

This repository is Pages-compatible but does not automatically deploy. After approval:

1. Choose the edition and complete the content listed in `docs/CONTENT-TO-CONFIRM.md`.
2. Remove the comparison/review interface and `noindex,nofollow` metadata for the production edition.
3. Merge the approved version into `main`.
4. In repository Settings → Pages, select deployment from `main`, root folder. Alternatively add an approved Pages Actions workflow.
5. The project site will normally be `https://i-like-software.github.io/Ultimate2k/`.

No custom domain or Pages settings were changed. `404.html` and `.nojekyll` are included. Review links use explicit `.html` paths so they work under the repository subpath.

## Editing

Edit the HTML pages directly. Shared appearance is in `assets/styles.css`; interaction code is in `assets/site.js`. The two editions are selected by the body class `professional` or `comic`. Fonts are licensed under the SIL Open Font License (see `assets/fonts/`).

## Accessibility and motion

Semantic headings, labelled forms, keyboard-operated disclosure menus, visible focus styles, skip links and responsive layouts are included. Motion respects the operating system preference and can be paused. Pause preference is kept in session storage; no personal form data is persisted.

Reference research and the sitemap mapping are in `docs/DESIGN-NOTES.md`.
