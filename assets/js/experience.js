(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canMove = () => !reduced.matches && !document.hidden && !document.body.classList.contains('motion-paused');
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const transitions = new Set();

  function enter(element) {
    if (!element || !canMove()) return;
    const animation = element.animate([{ opacity: .25, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
    transitions.add(animation);
    animation.finished.then(() => transitions.delete(animation), () => transitions.delete(animation));
  }
  // One queued frame per scroll event; no permanent animation loop.
  const movingImages = new Set();
  let frame = 0;
  function updateScroll() {
    frame = 0;
    if (!canMove()) return;
    movingImages.forEach(element => {
      const rect = element.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      element.style.setProperty('--image-drift', ((progress - .5) * 24).toFixed(2) + 'px');

    });
  }
  function queueScroll() { if (!frame && canMove()) frame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll);
  reduced.addEventListener('change', queueScroll);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
        if (entry.isIntersecting) movingImages.add(entry.target); else movingImages.delete(entry.target);
      });
      queueScroll();
    }, { threshold: .08 });
    document.querySelectorAll('[data-motion-surface]').forEach(element => observer.observe(element));
  }
  function accessibleTabs(buttons, select) {
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const keys = { ArrowRight: (index + 1) % buttons.length, ArrowLeft: (index + buttons.length - 1) % buttons.length, Home: 0, End: buttons.length - 1 };
        if (keys[event.key] !== undefined) { event.preventDefault(); select(keys[event.key]); buttons[keys[event.key]].focus(); }
      });
    });
  }
  // The hero runs itself. Its clock pauses without skipping a chapter.
  const firm = document.querySelector('[data-firm-experience]');
  if (firm) {
    const chapters = [...firm.querySelectorAll('[data-firm-chapter]')];
    const viewport = firm.querySelector('.firm-viewport');
    const copy = {
      presence: 'A credible website makes your expertise clear—and gives visitors a thoughtful way to get in touch.',
      systems: 'An organized CRM keeps the contact, their context, and your team’s next action together.',
      followup: 'Agreed follow-up and a connected calendar help the conversation move toward a consultation.',
      content: 'Branded visuals, social media support, and edited video give your expertise a consistent voice and a clear next step.'
    };
    const duration = 3000;
    let index = 0, visible = false, timer = 0, progress = null;
    let elapsed = 0, started = 0;
    const resizeScene = () => firm.style.setProperty('--scene-scale', (viewport.clientWidth / 700).toFixed(4));
    resizeScene();
    if ('ResizeObserver' in window) new ResizeObserver(resizeScene).observe(viewport);
    else addEventListener('resize', resizeScene);

    function selectChapter(next) {
      index = next;
      elapsed = 0;
      const chapter = chapters[index];
      firm.dataset.view = chapter.dataset.firmChapter;
      chapters.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        if (i === index) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      // No live region: automatic visual changes never interrupt a screen reader.
      const caption = firm.querySelector('[data-firm-copy]');
      caption.textContent = copy[chapter.dataset.firmChapter];
      if (progress) progress.cancel();
      progress = chapter.querySelector('i').animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration, fill: 'both', easing: 'linear' });
      progress.pause();
      if (visible) enter(caption);
    }
    function syncFirm() {
      const running = visible && canMove();
      firm.dataset.automatic = running ? 'running' : 'paused';
      if (!running) {
        if (timer) { clearTimeout(timer); timer = 0; elapsed = Math.min(duration, elapsed + performance.now() - started); }
        if (progress) progress.pause();
        return;
      }
      if (timer) return;
      started = performance.now();
      if (progress) { progress.currentTime = elapsed; progress.play(); }
      timer = setTimeout(() => {
        timer = 0;
        selectChapter((index + 1) % chapters.length);
        syncFirm();
      }, Math.max(0, duration - elapsed));
    }
    selectChapter(0);
    document.addEventListener('mds:motionchange', syncFirm);
    document.addEventListener('visibilitychange', syncFirm);
    reduced.addEventListener('change', syncFirm);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
      syncFirm();
    }, { threshold: .15 }).observe(firm);
    else { visible = true; syncFirm(); }

  }
  // Adapted from the user's StackTower React/Framer Motion example.
  // Keep its phase, scale, skew and eased hover behavior without adding a framework.
  const tower = document.querySelector('[data-type-tower]');
  const towerRows = [...document.querySelectorAll('[data-tower-row]')];
  const heroTabs = [...document.querySelectorAll('[data-hero-service]')];
  const heroServices = {
    presence: { words: ['BUILD', 'CONNECT'], copy: 'Websites and funnels that turn a first impression into a clear next step.' },
    systems: { words: ['CONNECT', 'SIMPLIFY'], copy: 'GHL, CRM, automation, and booking configured around the way your team works.' },
    content: { words: ['CREATE', 'CONNECT'], copy: 'Social media support, branded graphics, and video editing that bring your message to life.' }
  };
  let towerFrame = 0, towerVisible = false, previousTime = null, phase = .06, hoveredRow = -1;
  const hoverAmounts = Array(towerRows.length).fill(0);
  const foreground = [247, 244, 235], dim = [45, 80, 60], accent = [214, 181, 109];
  const mixColor = (a, b, t) => a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));
  function paintTower(delta) {
    const ease = 1 - Math.exp(-10 * delta);
    towerRows.forEach((row, index) => {
      const hover = hoverAmounts[index] += ((index === hoveredRow ? 1 : 0) - hoverAmounts[index]) * ease;
      const local = phase * Math.PI * 2 + index * .35;
      const cosine = Math.cos(local), sine = Math.sin(local), boost = 1 + hover * .1;
      const transform = 'translateX(' + (sine * 22).toFixed(2) + 'px) skewX(' + (sine * 6).toFixed(2) + 'deg) scale(' + (Math.max(.08, .55 + .45 * cosine) * boost).toFixed(4) + ',' + boost.toFixed(4) + ')';
      const ink = mixColor(mixColor(dim, foreground, (cosine + 1) / 2), accent, hover);
      row.firstElementChild.style.transform = transform;
      row.firstElementChild.style.color = 'rgb(' + ink.join(',') + ')';
    });
  }
  function tickTower(time) {
    towerFrame = 0;
    if (!towerVisible || !canMove()) { previousTime = null; return; }
    const delta = previousTime === null ? 0 : Math.min(.05, (time - previousTime) / 1000);
    previousTime = time;
    phase = (phase + delta / 6.5) % 1;
    paintTower(delta);
    towerFrame = requestAnimationFrame(tickTower);
  }
  function syncTower() {
    if (towerVisible && canMove()) {
      if (!towerFrame) { previousTime = null; towerFrame = requestAnimationFrame(tickTower); }
    } else {
      cancelAnimationFrame(towerFrame); towerFrame = 0; previousTime = null;
      if (reduced.matches) towerRows.forEach(row => { row.firstElementChild.style.transform = ''; row.firstElementChild.style.color = ''; });
    }
  }
  if (tower) {
    if (!reduced.matches) paintTower(0);
    towerRows.forEach((row, index) => {
      const enterRow = () => { hoveredRow = index; };
      const leaveRow = () => { if (hoveredRow === index) hoveredRow = -1; };
      row.addEventListener('pointerenter', enterRow); row.addEventListener('pointerdown', enterRow);
      ['pointerleave', 'pointerup', 'pointercancel'].forEach(event => row.addEventListener(event, leaveRow));
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { towerVisible = entries[0].isIntersecting; syncTower(); }, { threshold: .05 }).observe(tower);
    document.addEventListener('mds:motionchange', syncTower);
    document.addEventListener('visibilitychange', syncTower);
    reduced.addEventListener('change', syncTower);
  }
  if (heroTabs.length) accessibleTabs(heroTabs, index => {
    const tab = heroTabs[index], selection = heroServices[tab.dataset.heroService];
    heroTabs.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    towerRows.forEach((row, i) => { row.firstElementChild.textContent = selection.words[i % 2]; });
    const panel = document.querySelector('#hero-service-panel'); panel.setAttribute('aria-labelledby', tab.id);
    panel.querySelector('[data-hero-description]').textContent = selection.copy;
    enter(panel);
  });

  const consoleTabs = [...document.querySelectorAll('[data-console]')];
  const consoleData = {
    crm: ['New inquiry', 'Clear ownership', 'CRM & LEAD MANAGEMENT', 'A place for every conversation.', 'Contact fields, pipeline stages, and clear ownership keep the context with the inquiry.'],
    automation: ['An agreed trigger', 'The next action', 'BUSINESS AUTOMATION', 'A handoff your team can follow.', 'Connect agreed triggers to notifications, follow-up emails, and team tasks.'],
    booking: ['Choose a time', 'Confirm & remind', 'BOOKING SYSTEMS', 'Make the next conversation easier.', 'Configure availability, calendar routing, confirmations, and appointment reminders.'],
    reporting: ['Organized records', 'Useful visibility', 'REPORTING & SHEET CONNECTIONS', 'Keep the right details in view.', 'Bring agreed contact and activity fields into reporting views or Google Sheets logs.']
  };
  if (consoleTabs.length) accessibleTabs(consoleTabs, index => {
    const tab = consoleTabs[index], data = consoleData[tab.dataset.console];
    consoleTabs.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    ['a', 'b', 'label', 'title', 'copy'].forEach((key, i) => { document.querySelector('[data-console-' + key + ']').textContent = data[i]; });
    const panel = document.querySelector('#console-panel'); panel.setAttribute('aria-labelledby', tab.id); panel.dataset.consoleState = tab.dataset.console;
    enter(panel.querySelector('.console-caption'));
  });

  const blueprintTabs = [...document.querySelectorAll('[data-blueprint]')];
  const blueprintData = {
    presence: ['WEBSITES & FUNNELS', 'A presence that reflects your firm.', 'Clear service pages, considered design, and an inquiry path built around your business.'],
    systems: ['GHL / CRM / AUTOMATION / BOOKING', 'A clearer path behind the scenes.', 'Connect the contact, the owner, the follow-up, and the calendar around your team’s process.'],
    creative: ['SOCIAL MEDIA & VIDEO EDITING', 'Your message, thoughtfully presented.', 'Content planning, branded graphics, and edited footage that lead back to your business.']
  };
  function selectBlueprint(index) {
    const tab = blueprintTabs[index]; if (!tab) return;
    blueprintTabs.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    ['label', 'title', 'copy'].forEach((key, i) => { document.querySelector('[data-blueprint-' + key + ']').textContent = blueprintData[tab.dataset.blueprint][i]; });
    document.querySelector('.firm-blueprint').dataset.active = tab.dataset.blueprint;
    const panel = document.querySelector('#blueprint-panel'); panel.setAttribute('aria-labelledby', tab.id); enter(panel);
  }
  if (blueprintTabs.length) {
    accessibleTabs(blueprintTabs, selectBlueprint);
    document.querySelectorAll('input[name="services"]').forEach(input => input.addEventListener('change', () => {
      if (input.checked) selectBlueprint(input.value.includes('Website') ? 0 : input.value.includes('Content') ? 2 : 1);
    }));
  }

  // A user-started, single-pass demonstration; manual selection always takes over.
  const play = document.querySelector('[data-play-journey]');
  const journeyTabs = [...document.querySelectorAll('[data-stage]')];
  let timer = 0, programmatic = false;
  function stopJourney() {
    clearInterval(timer); timer = 0;
    if (play) { play.setAttribute('aria-pressed', 'false'); play.textContent = 'Play the journey ▷'; }
  }
  if (play) {
    play.addEventListener('click', () => {
      if (timer) { stopJourney(); return; }
      if (!canMove()) { programmatic = true; journeyTabs[0].click(); programmatic = false; return; }
      let stage = 0;
      const next = () => { programmatic = true; journeyTabs[stage].click(); programmatic = false; stage++; if (stage === journeyTabs.length) stopJourney(); };
      play.setAttribute('aria-pressed', 'true'); play.textContent = 'Pause journey Ⅱ';
      next(); timer = setInterval(next, 2400);
    });
    journeyTabs.forEach(tab => tab.addEventListener('click', () => { if (!programmatic) stopJourney(); }));
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stopJourney(); }, { threshold: .08 }).observe(document.querySelector('#workflow'));
  }
  function syncMotion() {
    if (!canMove()) {
      stopJourney();
      transitions.forEach(animation => animation.finish());
      document.querySelectorAll('[data-tilt],[data-image-drift]').forEach(element => { ['--tilt-x', '--tilt-y', '--image-drift', '--float-y'].forEach(prop => element.style.removeProperty(prop)); });
    } else queueScroll();
    if (play) play.hidden = reduced.matches;
  }
  document.addEventListener('mds:motionchange', syncMotion);
  syncMotion(); queueScroll();
})();
