# Changelog

## 1.0.2 (29 Sep 2026)

- Understanding the Experience: the two image placeholders now hold the approved Higgsfield images
  (morning light through linen curtains at the top of the page, hands holding a warm mug in "Our approach").

## 1.0.1 (29 Sep 2026)

- Meet the Team: Dr Lorna Gladwin's approved bio replaces the placeholder (three paragraphs, word for word).
- Meet the Team: Lorna's portrait added on a warm studio backdrop, with alt text
  "Dr Lorna Gladwin, creator of The Anxious Patient Experience".
- Team bios now support paragraphs (blank line between them). Image slots accept an optional crop position.

## 1.0.0 (29 Sep 2026)

- All five pages built from the approved copy doc, word for word, in the doc's section order: Home, Understanding
  the Experience, Meet the Team, Book Now, FAQs. Global header, footer and health disclaimer.
- Meta title and description from the doc on every page; FAQPage schema on FAQs; organisation schema that skips
  unconfirmed details; sitemap, robots, canonical tags, staging noindex.
- Book Now: four-step APE-only booking flow on a mock provider, policy and required checkbox directly above the
  payment button, confirmation screen. `/api/booking/*` is the integration point.
- FAQs accordion (one open at a time). Seven-card "What we do differently" grid. Four pathway cards on Home.
- Phase 2 walkthrough video blocks behind `features.walkthroughVideo` (off).
- Book Now stays visible in the header at every width.
- Fonts self-hosted. Copy parity and dash checks in `scripts/`.
- Removed prototype-only copy not in the approved doc (see README).
