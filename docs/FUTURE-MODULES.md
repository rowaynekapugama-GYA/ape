# Future modules (not built)

The brief asks for a platform that can later add these without a rebuild. Nothing below exists yet; this is
where each piece goes, so it can be added one at a time.

| Module | Flag in `site.config.ts` | Where it goes |
|---|---|---|
| Education and training for dentists and teams | `features.courses` | Route group `src/app/(learn)/` with its own layout. Courses and lessons as dashboard collections. |
| Protected course content and member areas | `features.memberArea` | `src/app/(members)/` behind middleware that checks the session. Payload's auth-enabled collections supply accounts, so no second login system is needed. |
| Practitioner and location search | `features.practitionerSearch` | `/find-a-practitioner/`, reading the practitioner collection with a location field. |
| Practitioner directory or certification pathway | `features.practitionerDirectory` | `/practitioners/[slug]/`. Meet the Team already renders from a list of members (`content/pages/team.json` `members`), so the directory reuses the same shape plus location and certification fields. |
| Additional digital resources | none needed | A Resources collection and `/resources/`, same pattern as a blog. |
| Walkthrough videos | `features.walkthroughVideo` | Built. Switch on and set `walkthroughVideo.src`. |

Rules that keep this cheap later:

- New public sections go in their own route group so they can have their own layout and access rules.
- Anything a practice or GYA edits becomes a dashboard collection when the CMS layer is retrofitted; keep new
  content as JSON in `src/content/` until then.
- Booking stays behind `BookingProvider`, so a multi-location practitioner search can hand a practitioner and
  location straight to the same flow.
