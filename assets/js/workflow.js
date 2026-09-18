(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-stage]')];
  if (!tabs.length) return;
  const stages = [
    { title: 'A thoughtful first hello.', copy: 'A focused inquiry form captures what the visitor needs, without overwhelming them with questions.', status: 'Received', next: 'Capture the essentials', event: 'One clear starting point for the conversation.' },
    { title: 'Context, in the right place.', copy: 'Bring the contact, service interest, and inquiry source into one record, with an agreed owner and pipeline stage.', status: 'Organized', next: 'Assign an inquiry owner', event: 'The team can see the context before responding.' },
    { title: 'A conversation that continues.', copy: 'Use agreed acknowledgments, team reminders, and consent-aware follow-up to support the next step.', status: 'Follow-up', next: 'Send the agreed next step', event: 'Clear ownership helps keep the conversation moving.' },
    { title: 'Make room for the conversation.', copy: 'Offer the appropriate calendar, then confirm the appointment only after a successful booking.', status: 'Next step', next: 'Choose an available time', event: 'Illustration only. No appointment has been booked.' }
  ];
  function select(index, focus = false) {
    const stage = stages[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    const fields = { '[data-step-number]': ['INQUIRY', 'CRM', 'FOLLOW-UP', 'DISCOVERY CALL'][index], '[data-step-title]': stage.title, '[data-step-copy]': stage.copy, '[data-record-status]': stage.status, '[data-record-next]': stage.next, '[data-record-event]': stage.event };
    Object.entries(fields).forEach(([selector, value]) => { document.querySelector(selector).textContent = value; });
    document.querySelector('#workflow-panel').setAttribute('aria-labelledby', tabs[index].id);
    document.querySelectorAll('[data-node]').forEach(node => node.classList.toggle('is-active', Number(node.dataset.node) === index));
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const keys = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (keys[event.key] !== undefined) { event.preventDefault(); select(keys[event.key], true); }
    });
  });
})();
