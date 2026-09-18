# Local QA — Scroll Choreography V6

September 18, 2026. Revised local preview ready for owner review. Visual acceptance and live integration remain separate.

## Responsive layout and preview flow

All three pages passed Chromium checks at 320, 390, 768, 1024, and 1440px. No horizontal overflow, broken images, duplicate IDs, missing in-page anchors, clipped sampled headings/paragraphs/buttons/labels, local request failures, or page JavaScript errors were found.

Existing inquiry controls, system-demo tabs, Step 2 tabs, keyboard navigation, menu Escape, and local form flow passed. Contact carryover, validation, brief completion, calendar placeholder, summary download/edit/clear, direct access, and forged booking-parameter checks passed. No-JavaScript pages remain readable with submission disabled. Blocked storage shows an error.

## Automatic hero and lettering

The five-layer hero assembly was observed in flight and captured at early, intermediate, and settled frames. The former idle bobbing is removed. Targeted checks verified distinct section effects, below-fold imagery remaining untriggered until reached, and elements settling to full opacity. Mobile entrance checks found no horizontal overflow during movement. Pausing an active reveal resolves it visibly; reduced motion displays static content.

A natural-time test observed all four hero chapters in order and the wrap back to the website without clicking. No playback or selector buttons remain in the hero. The primary discovery-call link remains.

Global pause held the current chapter for longer than a chapter interval; resume continued. Offscreen observation stopped the clock and returning resumed it. Mobile started the sequence when the illustration became visible. Reduced motion stopped automatic changes and lettering animations and exposed one static, readable typography-ribbon group.

The implementation also listens to Page Visibility. The headless browser did not mark the original page hidden when another tab opened, so that real-background-tab branch was not verified in this environment. Recheck on the target browser/device before production.

Desktop/mobile captures cover the hero, type treatments, service exhibits, delivery process, Step 2, and Thank You. The hero assembly and mobile content section were visually reviewed in V6. Content remains ordinary semantic text; animated hero captions are not live announcements.

## Evidence

review-tools/review-insurance-cpa-choreography.cjs
review-tools/capture-insurance-cpa-choreography.cjs
review-tools/check-choreography-lifecycle.cjs
review-tools/check-scroll-reveals.cjs
Results and screenshots: tmp/insurance-cpa-choreography-qa/

The release manifest verifies root-ready paths, per-file byte hashes, and packaged page references. Original reference packages and previous releases remain untouched.

## Integration limits

Forms and calendar remain explicitly labeled browser-local previews. No real CRM contact, notification, sheet entry, inquiry, or appointment was created. Live GHL forms, privacy/consent links, contact association, pipeline/Sheets updates, calendar/timezone, success confirmation, redirects, and branded-host testing remain required after the GHL swap.

