# Ultimate2k (Pty) Ltd.

Vanilla HTML, CSS and JavaScript website. **Deployed on Vercel:** [ultimate2k.vercel.app](https://ultimate2k.vercel.app).

## Current pages

- `index.html` — Enterprise software solutions, capabilities, founding team and partnership introduction.
- `services.html` — Web/business applications, mobile development, AI assistants/RAG and API integrations.
- `about.html` — Four-person founding team and the combined engineering/business-analysis approach.
- `contact.html` — Project or delivery-partnership brief.

Only pages with meaningful current content are included. Empty team, careers, news, certificate, policy and portfolio pages were removed. SEO, social marketing and unconfirmed e-commerce offerings were also removed. Earlier design explorations are archived outside the deployable site.

The landing uses a **stationary**, darkened wall of original illustrated comic-book covers. It has no wall animation, parallax or motion on scroll. Other page effects can be paused and respect reduced-motion preferences.

The wall contains 80 panels with programming-pun titles, a slight blur and a stronger dark crimson tint. Exactly three covers have a restrained, steady glow.

## Content basis

The user supplied the brand, logo and company name **Ultimate2k (Pty) Ltd.** The requested Software Development Tenders chat supplied a fact-separated handoff: a South African four-person founding team, two software engineers and two business analysts, full-stack/mobile/RAG capabilities and openness to delivery partnerships.

Proposed internal tools, tender opportunities, certification plans and outreach prospects are not presented as delivered projects, earned certifications, clients or partners. No company phone, email or office address has been supplied.

The form creates a visible, copyable and downloadable brief in the visitor’s browser. It **does not send enquiries** and does not save form data on a server. A real contact destination is required before using the site for lead generation.

## Vercel

The Vercel project is `ultimate2k`, with **Other** as the framework, the repository root as the project root, no build/install command, and `.` as the output directory. `vercel.json` declares the buildless static configuration and clean URLs. Internal `.html` links also work when opening files locally.

The user authorised production deployment on 31 October 2026. Deployment `dpl_ryZd6duFpH9AKAG1eYVuN2XAQmkB` reached READY from commit `cf290799cd8ca3b6caa80c946e5cb4a058d82d3e`. Production is public; preview protection remains enabled. The source is still on `design/two-directions`; the draft PR has not been merged.

`ultimate2k.co.za` and `www.ultimate2k.co.za` are attached to this project, with www redirecting to the main domain. HostAfrica registration/DNS setup is still required. Vercel’s returned recommended records are: A `@` → `216.198.79.1`, A `@` → `64.29.17.1`, CNAME `www` → `c44aebcc6483cca3.vercel-dns-017.com`. Keep HostAfrica-managed DNS; its current guide lists nameservers `dan1.host-ww.net` and `dan2.host-ww.net`.

Configuration reference: [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json), [static builds](https://vercel.com/docs/builds). Review-only noindex metadata was removed for the authorised launch.

## Editing

Edit the four HTML pages directly. Shared styling is in `assets/styles.css`; the comic treatment is in `assets/comic-refinement.css`; current site-specific adjustments and the static wall are in `assets/current.css`. Interactions live in `assets/site.js`. Fonts and assets are local; no runtime dependencies are needed. Font licences are in `assets/fonts/`.

Open `index.html` in a browser to review the current site. The 404 page is a utility page, not part of the navigation.

