# User-supplied typography interaction

The user's StackTower React/Framer Motion example is adapted in the creative/content section, below the service chapters. It is deliberately absent from the hero.

Implementation: assets/js/experience.js and assets/css/atelier.css. No React, Framer Motion, package install, or framework rebuild is required.

Preserved behavior: twelve rows; 0.35-radian row offsets; cosine horizontal scale; minimum scale 0.08; sine-driven 22px horizontal travel and 6-degree skew; eased 10% hover emphasis; gold hover color; fading edges. The cycle is 6.5 seconds.

Websites / Systems / Content tabs change the words and the supporting service description. Repeated visual words are hidden from assistive technology. Accessible headings, descriptions, and keyboard tabs convey the content.

The requestAnimationFrame loop runs only while visible and permitted. Global pause, reduced motion, tab visibility, and offscreen state stop it. Reduced motion shows four static rows. Touch uses pan-y to preserve normal vertical scrolling.
