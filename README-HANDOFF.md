# MDS Insurance & CPA — Scroll Choreography V6

September 18, 2026. Target handoff: September 21, 2026.
One unified audience. One funnel. Landing page, Step 2, and Thank You.

## Review the experience

Open index.html, or serve this folder with a static server. The checked browser is Chromium. Manrope and Newsreader load through Google Fonts; readable system fallbacks remain available.

- Watch the hero assemble: five touchpoints expand from a compact stack, with connecting lines and rings drawing into place. Website, CRM & automation, Follow-up & booking, and Content & creative then cycle automatically every 5.6 seconds. The discovery-call CTA remains.
- Scroll through the services: the website unfolds, the phone rises into place, CRM rows slide in, and the content image wipes on with an editing timeline. Supporting cards and process steps appear in sequence. These entrances run once when reached and then settle.
- Pause motion in the header. Reduced-motion preference removes continuous animation and preserves every manual control.
- Explore the inquiry workflow, then the CRM, automation, calendar, and reporting demos.
- The supplied typography tower now belongs to the creative/content section, below the services.
- Use sample details to visit Step 2. Choose priorities, view the calendar placeholder, and open the summary. Download, edit, and clear the local draft.

## What changed and why

V6 preserves the approved design and replaces generic repeated bobbing and pulses with purposeful motion. The hero assembles five business touchpoints, then each automatic chapter shows a related action: CRM rows appearing, follow-up steps revealing, a calendar reveal, or content playback. A noninteractive progress rail follows the sequence. Its clock freezes offscreen, with global pause, or when reduced motion is requested.

Lower sections use individual viewport triggers instead of one shared lift. Website, phone, CRM, content, support, and process elements receive distinct finite entrances. Pausing or enabling reduced motion resolves an active entrance to readable content; focusing a control does the same. Background visibility pauses active entrance animations. Content is visible without JavaScript.

The full funnel shares deep green, emerald, gold, and ivory; original MDS branding is unchanged. Decorative section numbering was removed. Service demonstrations now show the actual work MDS offers, rather than relying on large decorative numbers or claims of results. Website, systems, creative, process, brief, and summary sections have coordinated styling and transitions. Step 2 uses a project folio; Thank You uses a conversation invitation.

Content is aligned to the MDS service categories in the supplied/local references: websites/funnels, CRM/lead management, business automation, booking, GHL setup, social media, video editing, lead-generation support, and admin/executive support. Insurance and accounting examples stay within a single shared story. Fictional contacts, sample calendar availability, and the Linden Advisory concept are labeled illustrative. No testimonials, performance statistics, credentials, or guaranteed results were invented.

## Changed implementation files

- index.html, step-2.html, thank-you.html: load the shared motion director and versioned assets.
- assets/css/atelier.css: remove perpetual decorative bobbing and pulse rules while preserving the approved design.
- assets/js/experience.js: retain the automatic hero, tower, and interactive demos; remove competing generic entrances.
- assets/js/motion-director.js: new hero assembly, chapter cues, section-specific entrances, and motion lifecycle handling.

Existing assets/css/styles.css, assets/js/main.js, assets/js/workflow.js, and assets/js/funnel-flow.js remain unchanged in V6. No framework or new dependency was added. The continuous editorial typography ribbon, subtle animated gold lettering, and creative typography tower remain. No new image generation was needed; two existing generated scenes are reused. See GENERATED-ASSETS.md for provenance.

## Forms and live status

Forms remain clearly labeled local previews. No real inquiry is submitted, CRM contact created, notification sent, or discovery call booked. The draft lives in sessionStorage in the browser tab. Direct summary access or a forged booking parameter cannot produce a success claim.

The later GHL integration must replace the local handlers with verified form and calendar configuration. Keep inquiry success separate from verified booking success. Requirements are in GHL-INTEGRATION-CHECKLIST.md. Local design checks do not verify CRM, email, Sheets, calendar, branded-host redirects, or production delivery.

## Upload and rollback

Extract the ZIP and upload its CONTENTS to the new site root. index.html belongs at the root. Do not upload the ZIP as the website. No domain/CNAME is supplied; the production destination is not verified.

This release includes only the required pages, shared assets, source, and handoff documents. Earlier release ZIPs and the original Medical/Real Estate packages remain preserved. Existing MDS websites were not modified. Intermediate experiment files and unused imagery are excluded from the release archive.

See QA-REPORT.md for local verification and remaining live checks. This is a revised design ready for owner review, not a claim of final visual approval.

