(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 600px)');
  const permitted = () => !reduced.matches && !document.body.classList.contains('motion-paused');
  const active = new Map();
  const watched = new Map();
  const ease = 'cubic-bezier(.16,1,.3,1)';

  function play(element, frames, options = {}) {
    if (!element || !permitted() || document.hidden) return null;
    const animation = element.animate(frames, { duration: 950, easing: ease, fill: 'backwards', ...options });
    active.set(animation, element);
    const clear = () => active.delete(animation);
    animation.finished.then(clear, clear);
    return animation;
  }

  function framesFor(element, effect) {
    const matrix = getComputedStyle(element).transform;
    const base = matrix === 'none' ? '' : matrix;
    const distance = compact.matches ? 18 : 42;
    const settled = { opacity: 1, transform: base || 'none', clipPath: 'inset(0% 0% 0% 0%)' };
    switch (effect) {
      case 'slide-left': return [{ opacity: 0, transform: base + ' translateX(-' + distance + 'px)' }, settled];
      case 'slide-right': return [{ opacity: 0, transform: base + ' translateX(' + distance + 'px)' }, settled];
      case 'unfold': return [{ opacity: .15, transform: base + ' perspective(1100px) rotateY(12deg) translateY(35px) scale(.95)', clipPath: 'inset(0% 0% 14% 0%)' }, settled];
      case 'phone': return [{ opacity: 0, transform: base + ' translateY(65px) rotate(-8deg) scale(.94)' }, settled];
      case 'wipe': return [{ opacity: .4, clipPath: 'inset(0% 100% 0% 0%)', transform: base + ' scale(1.035)' }, settled];
      case 'curtain': return [{ opacity: .4, clipPath: 'inset(0% 0% 100% 0%)', transform: base + ' translateY(20px)' }, settled];
      case 'card': return [{ opacity: 0, transform: base + ' translateY(45px) scale(.91)' }, { opacity: 1, transform: base + ' translateY(-2px) scale(1.005)', offset: .8 }, settled];
      default: return [{ opacity: 0, transform: base + ' translateY(30px)' }, settled];
    }
  }

  function reveal(element, effect, delay = 0) {
    element.dataset.motionEffect = effect;
    element.dataset.motionRevealed = permitted() ? 'entered' : 'static';
    if (!permitted()) return;
    play(element, framesFor(element, effect), { delay, duration: effect === 'wipe' || effect === 'unfold' ? 1200 : 950 });
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < .16) continue;
      const sequence = watched.get(entry.target);
      if (!sequence || document.hidden) continue;
      observer.unobserve(entry.target);
      watched.delete(entry.target);
      sequence();
    }
  }, { threshold: .16, rootMargin: '0px 0px -6% 0px' }) : null;

  function watch(element, sequence) {
    if (!element) return;
    if (!observer) { element.dataset.motionRevealed = 'static'; return; }
    watched.set(element, sequence);
    observer.observe(element);
  }
  function elements(selector, effect, stagger = 0) {
    document.querySelectorAll(selector).forEach((element, index) => {
      // Each card has its own viewport trigger; lower rows never animate unseen.
      watch(element, () => reveal(element, effect, (index % 4) * stagger));
    });
  }

  elements('.editorial-list article', 'slide-right', 100);
  elements('.inquiry-map', 'wipe');
  elements('.journey-detail .record-card', 'card');
  elements('.journey-tabs button', 'rise', 65);
  elements('.website-chapter .chapter-copy,.systems-chapter .chapter-copy', 'slide-left');
  elements('.presence-exhibit .browser-mock', 'unfold');
  elements('.presence-exhibit .phone-concept', 'phone', 0);
  elements('.system-console', 'curtain');
  elements('.crm-row', 'slide-left', 110);
  elements('.creative-image', 'wipe');
  elements('.creative-steps>div', 'slide-right', 120);
  elements('.lab-type-feature', 'card');
  elements('.support-columns article', 'card', 140);
  elements('.process-list li', 'rise', 140);
  elements('.faq-list details', 'rise', 60);
  elements('.discovery .form-panel', 'card');
  elements('.dossier-front', 'unfold');
  elements('.conversation-invite', 'unfold');

  const editStrip = document.querySelector('.edit-strip');
  watch(editStrip, () => {
    editStrip.dataset.motionRevealed = 'entered';
    editStrip.querySelectorAll('.edit-tracks i').forEach((track, i) => play(track,
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 850, delay: i * 140 }));
    play(editStrip.querySelector('.edit-tracks b'), [{ left: '5%' }, { left: '94%' }], { duration: 4200, delay: 500, easing: 'linear', fill: 'forwards' });
  });

  const firm = document.querySelector('[data-firm-experience]');
  let assembled = false;
  const chapterActions = new Set();
  function cue(element, frames, options) {
    const action = play(element, frames, {
      ...options,
      duration: (options.duration || 950) * .65,
      delay: (options.delay || 0) * .65
    });
    if (!action) return;
    chapterActions.add(action);
    action.finished.then(() => chapterActions.delete(action), () => chapterActions.delete(action));
  }
  function chapterCue() {
    if (!firm || !assembled || !permitted() || document.hidden || firm.dataset.automatic !== 'running') return;
    chapterActions.forEach(action => action.finish());
    chapterActions.clear();
    const mode = firm.dataset.view;
    const routes = firm.querySelector('.scene-tracer');
    cue(routes, [{ strokeDashoffset: 920, opacity: 0 }, { opacity: 1, offset: .2 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 1800, easing: 'ease-in-out' });
    if (mode === 'presence') {
      cue(firm.querySelector('.scene-site-hero>img'), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 1200, delay: 300 });
    } else if (mode === 'systems') {
      firm.querySelectorAll('.mini-person,.mini-field,.mini-pipeline').forEach((row, i) => cue(row,
        [{ opacity: 0, translate: '20px 0' }, { opacity: 1, translate: '0 0' }], { delay: 250 + i * 140, duration: 750 }));
    } else if (mode === 'followup') {
      firm.querySelectorAll('.message-timeline>span').forEach((row, i) => cue(row,
        [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { delay: 250 + i * 200, duration: 700 }));
      cue(firm.querySelector('.calendar-dots'), [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 1000, delay: 600 });
    } else {
      cue(firm.querySelector('.content-film>img'), [{ scale: 1.12 }, { scale: 1 }], { duration: 1800, delay: 200 });
      cue(firm.querySelector('.film-progress i'), [{ transform: 'translateX(-100%)' }, { transform: 'translateX(290%)' }], { duration: 3100, delay: 350, easing: 'linear' });
    }
  }
  if (firm) {
    watch(firm.querySelector('.firm-viewport'), () => {
      assembled = true;
      firm.dataset.motionRevealed = permitted() ? 'assembled' : 'static';
      firm.querySelectorAll('.scene-layer').forEach((layer, order) => {
        const base = getComputedStyle(layer).transform;
        const x = (350 - layer.offsetLeft - layer.offsetWidth / 2) * .8;
        const y = (265 - layer.offsetTop - layer.offsetHeight / 2) * .8;
        play(layer, [
          { opacity: 0, transform: 'translate(' + x + 'px,' + y + 'px) rotateZ(-12deg) scale(.28)' },
          { opacity: 1, offset: .72 },
          { opacity: 1, transform: base }
        ], { duration: 1450, delay: order * 145 });
      });
      const wire = firm.querySelector('.scene-wires>path:first-child');
      if (wire) {
        const length = wire.getTotalLength();
        play(wire, [{ strokeDasharray: length, strokeDashoffset: length }, { strokeDasharray: length, strokeDashoffset: 0 }], { duration: 2000, delay: 400 });
      }
      firm.querySelectorAll('.scene-orbit').forEach((ring, i) => play(ring,
        [{ opacity: 0, scale: .7 }, { opacity: 1, scale: 1 }], { duration: 1800, delay: 200 + i * 180 }));
    });
    new MutationObserver(records => {
      if (records.some(record => record.attributeName === 'data-view')) chapterCue();
    }).observe(firm, { attributes: true, attributeFilter: ['data-view'] });
  }

  function sync() {
    active.forEach((element, animation) => {
      if (!permitted()) animation.finish();
      else if (document.hidden) animation.pause();
      else animation.play();
    });
    // Entries that crossed the viewport while hidden are retried on return.
    if (!document.hidden && observer) watched.forEach((_, element) => { observer.unobserve(element); observer.observe(element); });
  }
  document.addEventListener('mds:motionchange', sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  document.addEventListener('focusin', event => {
    active.forEach((element, animation) => { if (element.contains(event.target)) animation.finish(); });
  });
})();
