# SETU WORKS V4 — Signature Luxury Edition

Static, zero-subscription, GitHub Pages compatible website. Five genuine, supplied project screenshots and no third-party code dependencies.

## Files
- `index.html` — semantic HTML, service, portfolio, pricing, process, FAQs, consultation form, structured data.
- `assets/css/style.css` — responsive design and motion.
- `assets/js/main.js` — menu, filters, case studies, progress, counters, and enquiry message.
- `assets/images/*.webp` — original project screenshots converted to efficient WebP files.
- `assets/images/social-share.jpg` — local branded social sharing preview.
- `assets/images/favicon.svg` — local vector favicon.
- `robots.txt`, `sitemap.xml` — crawling/discovery setup.
- `404.html` — GitHub Pages error page.

## Preview without publishing
Extract this complete folder. Open `index.html` in Chrome or Edge, or serve locally from this folder using `python -m http.server 8000` and visit `http://localhost:8000/`. Contact form opens WhatsApp; it does not post to a server.

## Deploy to existing GitHub Pages repository
1. Back up the existing GitHub repository content first.
2. Open the repository `https://github.com/setuworks/setu-works` and replace the existing published content with **the contents inside** this extracted folder, preserving folder structure (do not put the whole extracted parent folder under the repository).
3. Commit changes on the branch configured for GitHub Pages (`main`, root if unchanged).
4. Wait for the Pages deployment workflow to finish, then open `https://setuworks.github.io/setu-works/` in a private browser window.
5. Verify all five screenshots, modal open/close, portfolio filters, WhatsApp, mailto, mobile menu, 404 and SEO files.
6. Check `https://setuworks.github.io/setu-works/sitemap.xml` and `https://setuworks.github.io/setu-works/robots.txt` after deployment.

### Search Console
1. Open `https://search.google.com/search-console/` while signed into your Google account.
2. Add a **URL prefix** property: `https://setuworks.github.io/setu-works/`.
3. Choose an offered verification method; for HTML tag verification, paste the **actual** Google-provided verification meta tag into `<head>` of `index.html`, redeploy, then click Verify. Do not use a made-up token. If Google offers a verification HTML file instead, upload that file into the published repository root, deploy and verify.
4. In Sitemaps submit `https://setuworks.github.io/setu-works/sitemap.xml` (or `sitemap.xml` when prompted for the suffix).
5. Use URL Inspection for `https://setuworks.github.io/setu-works/` → Test Live URL → Request indexing if available. Indexing/rankings are at Google's discretion.
6. Monitor Pages indexing and Search performance; monitor technical issues in Search Console.

## Editorial / accuracy notes
- Five projects and the six services are real examples reported by the SETU WORKS owner; project descriptions reflect that report.
- Farooqui Gems Jewelry was an existing store; historical lifetime sales and ratings shown in its client screenshot are **not** claimed as agency-attributable sales.
- Meghaa Gems public store link was not independently verified, so only the local case study is linked.
- No fake reviews, growth figures or results.
- FAQ content is human-readable; FAQ rich-result structured data is deliberately not provided because Google retired the feature for most/all websites by 2026.
- Store links were reachable during preparation but may change; periodically check them.
- Performance, browser compatibility and search visibility must be measured on the deployed public website. A local test is not a live Lighthouse guarantee.
- `noindex` intentionally applies only to `404.html`.
- On a GitHub Pages **project** site, search engines normally check `https://setuworks.github.io/robots.txt` at the origin root, not `/setu-works/robots.txt`. The bundled `robots.txt` is useful for future custom-domain hosting, but do not rely on it alone to advertise the sitemap: submit the sitemap explicitly in Search Console.
- The live service email and WhatsApp number were carried forward from the original supplied website.

## Ongoing maintenance
Update pricing, portfolio images/links, SEO content and contact details only when business information changes. If adding pages, update `sitemap.xml`, internal links and canonical tags accordingly. Recheck legal rights to display any customer project screenshots in marketing.
