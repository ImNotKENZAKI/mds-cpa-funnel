(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (menu && nav) {
    document.documentElement.classList.add('menu-ready');
    menu.hidden = false;
    const close = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { close(); menu.focus(); } });
    const mobile = matchMedia('(max-width: 600px)');
    mobile.addEventListener('change', close);
  }

  let paused = false;
  const animations = new Set();
  const toggles = [...document.querySelectorAll('[data-motion-toggle]')];
  function syncMotion() {
    const off = reduced.matches || paused;
    document.documentElement.classList.toggle('motion-on', !off);
    document.body.classList.toggle('motion-paused', off);
    document.body.classList.toggle('tab-hidden', document.hidden);
    for (const animation of animations) {
      if (off) animation.finish();
      else if (document.hidden) animation.pause();
      else animation.play();
    }
    for (const button of toggles) {
      button.hidden = reduced.matches;
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    }
    document.dispatchEvent(new CustomEvent('mds:motionchange', { detail: { paused: off, hidden: document.hidden } }));
  }
  toggles.forEach(button => button.addEventListener('click', () => { paused = !paused; syncMotion(); }));
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
  if (!('IntersectionObserver' in window)) return;

  const headings = [...document.querySelectorAll('[data-reveal]')];
  // Preserve real text nodes and heading semantics; only animate visual word wrappers.
  if (!reduced.matches) headings.forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
        const clip = document.createElement('span'); clip.className = 'word-clip';
        const inner = document.createElement('span'); inner.className = 'word-inner'; inner.textContent = word;
        clip.append(inner); fragment.append(clip);
      });
      node.replaceWith(fragment);
    });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.classList.contains('journey')) { entry.target.classList.toggle('is-in-view', entry.isIntersecting); return; }
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduced.matches || paused || document.hidden) return;
      entry.target.querySelectorAll('.word-inner').forEach((word, index) => {
        const animation = word.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { duration: 750, delay: Math.min(index * 45, 400), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        animations.add(animation); animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      });
    });
  }, { threshold: .12 });
  headings.forEach(heading => observer.observe(heading));
  const journey = document.querySelector('.journey'); if (journey) observer.observe(journey);
})();
