# Live integration handoff — Insurance & CPA

Status: local design preview. There is no active submission endpoint or booking calendar. The JavaScript stores a temporary draft in sessionStorage; no contact or appointment is created. This package is reviewable, not live lead capture.

## Required inputs

- Approved destination domain and final page URLs.
- Dedicated MDS Insurance & CPA Step 1/Step 2 GHL forms, or an explicitly approved shared form setup; their regenerated embeds and custom-field mapping.
- Verified MDS discovery-call calendar ID, owner, timezone, meeting location/link generation, availability, and confirmation settings.
- Approved contact-association method, privacy/terms URLs, and consent requirements. Current preview invites sample details only. Do not send real details until privacy and live capture are approved.
- Internal notification recipients, pipeline/stages, follow-up timing, and optional Sheets log requirements.

Do not reuse real-estate or medical IDs/domains/video assets. No new IDs were invented.

## Intended journey

1. Step 1 captures name, work email, business name, and optional website. Confirm successful contact creation/update before proceeding. Preserve association to the same contact for Step 2; avoid putting personal information into query strings.
2. Step 2 updates the contact with service interests, setup, challenge, priority, and timeline. Validate required fields. Show the inline calendar only after verified submission success. Errors must keep entered details visible and offer retry.
3. The calendar supplies actual availability and timezone selection. Booking is optional after the inquiry; leaving here is an inquiry without an appointment.
4. The Thank You page renders one of three states: verified appointment (confirmed time/timezone and meeting details); verified inquiry only (inquiry received plus booking option); or unverified (no success claim).

The delivered page implements only the truthful preview state. Live inquiry/booking states must be implemented as part of the integration using a trusted success signal. A browser query such as `?booked=true`, local storage, a direct visit, or arbitrary postMessage is not proof of booking. If messages are used, validate provider origin, source frame, and documented message type; use server-backed verification where required. Provider-native confirmation is preferable to a fabricated confirmation screen.

## Workflow configuration

- Associate both steps with the same contact; verify duplicate handling.
- Suggested pipeline: New inquiry → Brief received → Discovery call booked → Scope/proposal → Closed/archived.
- Internal notification after initial inquiry, then a brief-update notification or task.
- Appointment confirmation/reminders only after successful calendar booking.
- Respect consent, unsubscribe and follow-up eligibility. No prechecked marketing opt-in.
- If approved, log selected business fields and state changes to Sheets. CRM remains the source of truth; do not log sensitive insurance/client/tax documents.

## Production acceptance

Test the branded host on desktop and a real phone: Step 1, same-contact Step 2, calendar pointer/touch, timezone, unavailable slots, error recovery, duplicate submission, appointment creation, meeting link, notifications, pipeline/log updates, consent behavior, and redirects. Test inquiry without booking, direct Thank You access, spoofed status URLs, and repeat visits. Only remove preview labels when the corresponding live behavior passes.
