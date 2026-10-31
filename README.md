# Ultimate2k (Pty) Ltd.

Vanilla HTML, CSS and JavaScript website, prepared for Vercel. **Review version; not deployed.**

## Current pages

- `index.html` — Enterprise software solutions, capabilities, founding team and partnership introduction.
- `services.html` — Web/business applications, mobile development, AI assistants/RAG and API integrations.
- `about.html` — Four-person founding team and the combined engineering/business-analysis approach.
- `contact.html` — Project or delivery-partnership brief.

Only pages with meaningful current content are included. Empty team, careers, news, certificate, policy and portfolio pages were removed. SEO, social marketing and unconfirmed e-commerce offerings were also removed. Earlier design explorations are archived outside the deployable site.

The landing uses a **stationary**, darkened wall of original illustrated comic-book covers. It has no wall animation, parallax or motion on scroll. Other page effects can be paused and respect reduced-motion preferences.

## Content basis

The user supplied the brand, logo and company name **Ultimate2k (Pty) Ltd.** The requested Software Development Tenders chat supplied a fact-separated handoff: a South African four-person founding team, two software engineers and two business analysts, full-stack/mobile/RAG capabilities and openness to delivery partnerships.

Proposed internal tools, tender opportunities, certification plans and outreach prospects are not presented as delivered projects, earned certifications, clients or partners. No company phone, email or office address has been supplied.

The form creates a visible, copyable and downloadable brief in the visitor’s browser. It **does not send enquiries** and does not save form data on a server. A real contact destination is required before using the site for lead generation.

## Vercel

Import `i-like-software/Ultimate2k` into Vercel after approving the review branch. Choose **Other** as the framework, the repository root as the project root, no build/install command, and `.` as the output directory. `vercel.json` declares the buildless static configuration and clean URLs. Internal `.html` links also work when opening files locally.

The previous GitHub Pages setup is no longer used. Vercel access was confirmed, with no existing Ultimate2k project found. No deployment, custom domain or production setting has been changed. The repository remains on a draft review branch. Import the repository when the review is approved and you are ready to publish.

Configuration reference: [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json), [static builds](https://vercel.com/docs/builds). `noindex,nofollow` remains in the review HTML; remove it after launch content is approved.

## Editing

Edit the four HTML pages directly. Shared styling is in `assets/styles.css`; the comic treatment is in `assets/comic-refinement.css`; current site-specific adjustments and the static wall are in `assets/current.css`. Interactions live in `assets/site.js`. Fonts and assets are local; no runtime dependencies are needed. Font licences are in `assets/fonts/`.

Open `index.html` in a browser to review the current site. The 404 page is a utility page, not part of the navigation.

