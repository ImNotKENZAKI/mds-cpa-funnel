(() => {
  'use strict';
  // Deliberately local-only. Live GHL submission and booking must be integrated and verified separately.
  const KEY = 'mds-insurance-cpa-preview-v1';
  const services = ['Website & funnel', 'CRM & automation', 'Booking & follow-up', 'Content & creative'];
  let draft = {};
  try { const saved = JSON.parse(sessionStorage.getItem(KEY) || '{}'); if (saved && typeof saved === 'object' && !Array.isArray(saved)) draft = saved; } catch { /* Missing or blocked tab storage is handled on save. */ }
  const clean = (value, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  const value = key => clean(draft[key]);
  const validContact = () => Boolean(value('full_name') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')) && value('business'));
  const contact = document.querySelector('[data-contact-form]');
  const brief = document.querySelector('[data-brief-form]');
  const calendar = document.querySelector('[data-calendar-preview]');
  const summary = document.querySelector('.project-summary');
  function save(next, form) {
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); draft = next; return true; }
    catch { form.querySelector('[data-form-error]').textContent = 'Your browser cannot save this preview between pages. Allow tab storage or open the preview in a regular browser window. Nothing was sent.'; return false; }
  }
  function restore(form) {
    [...form.elements].forEach(field => {
      if (!field.name) return;
      if (field.type === 'checkbox') field.checked = Array.isArray(draft.services) && draft.services.includes(field.value);
      else if (typeof draft[field.name] === 'string') field.value = value(field.name);
    });
  }
  function renderSummary() {
    if (!summary) return;
    const interests = Array.isArray(draft.services) ? draft.services.filter(item => services.includes(item)).join(', ') : '';
    const fields = { business: value('business') || 'Your firm', contact: [value('full_name'), value('email')].filter(Boolean).join(' · '), services: interests, setup: value('setup'), challenge: value('challenge'), priority: value('priority'), timeline: value('timeline') };
    Object.entries(fields).forEach(([key, text]) => { document.querySelector('[data-summary="' + key + '"]').textContent = text || 'Not provided'; });
    document.querySelector('[data-summary-status]').textContent = validContact() ? 'Local draft only. Nothing submitted. No call booked.' : 'Preview only. No saved brief was found in this tab.';
    const download = document.querySelector('[data-download-brief]'); if (download) download.hidden = !validContact();
  }
  if (contact) {
    restore(contact); contact.querySelector('fieldset').disabled = false;
    contact.addEventListener('submit', event => {
      event.preventDefault();
      for (const name of ['full_name', 'business']) { const field = contact.elements[name]; field.value = field.value.trim(); }
      const email = contact.elements.email; email.setCustomValidity('');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) email.setCustomValidity('Enter a complete work email address.');
      if (!contact.reportValidity()) return;
      const next = { ...draft, ...Object.fromEntries(new FormData(contact)), mode: 'preview', briefComplete: false };
      if (save(next, contact)) location.href = 'step-2.html';
    });
    contact.elements.email.addEventListener('input', () => contact.elements.email.setCustomValidity(''));
  }
  function updateBrief() {
    if (!brief) return;
    const selected = brief.querySelectorAll('input[name="services"]:checked').length;
    const checkbox = brief.querySelector('input[name="services"]');
    checkbox.setCustomValidity(selected ? '' : 'Select at least one service interest.');
    const done = Number(selected > 0) + ['setup', 'challenge', 'priority', 'timeline'].filter(name => brief.elements[name].value.trim()).length;
    brief.querySelector('progress').value = done;
    brief.querySelector('[data-readiness]').textContent = done + ' of 5 sections complete';
  }
  if (brief) {
    const hasContact = validContact();
    document.querySelector('[data-missing-contact]').hidden = hasContact;
    document.querySelector('[data-contact-summary]').hidden = !hasContact;
    brief.querySelector('fieldset').disabled = !hasContact;
    if (hasContact) {
      document.querySelector('[data-contact-business]').textContent = value('business');
      document.querySelector('[data-contact-person]').textContent = value('full_name') + ' · ' + value('email');
      restore(brief);
      if (draft.briefComplete === true) calendar.hidden = false;
    }
    updateBrief();
    brief.addEventListener('input', () => {
      updateBrief(); calendar.hidden = true;
      const data = new FormData(brief);
      draft = { ...draft, ...Object.fromEntries(data), services: data.getAll('services'), briefComplete: false };
      try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* Submission reports blocked storage. */ }
    });
    brief.addEventListener('change', updateBrief);
    brief.addEventListener('submit', event => {
      event.preventDefault(); brief.elements.priority.value = brief.elements.priority.value.trim(); updateBrief();
      if (!brief.reportValidity()) return;
      const data = new FormData(brief);
      const next = { ...draft, ...Object.fromEntries(data), services: data.getAll('services'), mode: 'preview', briefComplete: true };
      if (!save(next, brief)) return;
      calendar.hidden = false; calendar.focus({ preventScroll: true }); calendar.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
  }
  renderSummary();
  const download = document.querySelector('[data-download-brief]');
  if (download) download.addEventListener('click', () => {
    const lines = ['MARY DIGI SOLUTIONS', 'Insurance & CPA project brief', 'LOCAL DRAFT — Nothing submitted. No discovery call booked.', ''];
    summary.querySelectorAll('dl>div').forEach(row => lines.push(row.querySelector('dt').textContent + ': ' + row.querySelector('dd').textContent, ''));
    lines.splice(4, 0, 'Business: ' + value('business'), 'Website: ' + (value('website') || 'Not provided'), '');
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'MDS-insurance-cpa-preview-brief.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.querySelectorAll('[data-clear-draft]').forEach(button => button.addEventListener('click', () => {
    try { sessionStorage.removeItem(KEY); } catch { /* An in-memory draft is still cleared. */ }
    draft = {}; if (contact) contact.reset();
    if (brief) { brief.reset(); brief.querySelector('fieldset').disabled = true; calendar.hidden = true; document.querySelector('[data-contact-summary]').hidden = true; document.querySelector('[data-missing-contact]').hidden = false; updateBrief(); }
    renderSummary(); document.querySelectorAll('[data-clear-status]').forEach(status => { status.textContent = 'Preview details cleared from this tab.'; });
  }));
})();
