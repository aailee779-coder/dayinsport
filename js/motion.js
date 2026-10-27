/* DAYIN Sport — motion (GSAP + ScrollTrigger + Lenis). Every effect degrades to a static, readable page. */
(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = $('.hd');
  if (hd && d.body.classList.contains('home')) { const t = () => hd.classList.toggle('top', scrollY < innerHeight * .75); t(); addEventListener('scroll', t, { passive: true }); }
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  d.documentElement.classList.add('js-motion');

  /* smooth scroll */
  if (window.Lenis && !matchMedia('(pointer:coarse)').matches) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }));
  }
  const E = 'expo.out', mm = gsap.matchMedia();

  /* ---------- COMMI hero + counters ---------- */
  const ch = $('.cm-hero');
  if (ch) gsap.timeline({ defaults: { ease: E } }).from($$('video', ch), { scale: 1.15, duration: 2.4 }, 0).from($$('.x-line>span', ch), { yPercent: 110, duration: 1.2, stagger: .1 }, .2).from($$('[data-x-in]', ch), { y: 24, opacity: 0, duration: 1, stagger: .1 }, .5);
  $$('[data-cnt]').forEach((dd, i) => { const t = dd.textContent, m = t.match(/[\d.]+/); if (!m) return; const end = parseFloat(m[0]), dec = (m[0].split('.')[1] || '').length, o = { v: 0 };
    ScrollTrigger.create({ trigger: dd, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, delay: (i % 4) * .1, ease: 'power3.out', onUpdate: () => dd.textContent = t.replace(m[0], o.v.toFixed(dec)) }) }); });
  const pd = $('.cm-pd');
  if (pd) gsap.timeline({ defaults: { ease: E } }).from($('.cm-gal img', pd), { scale: .85, opacity: 0, duration: 1.4 }, 0).from($$('.cm-info > *', pd), { y: 24, opacity: 0, duration: .9, stagger: .05 }, .15);
  /* ---------- HOME ---------- */
  const hero = $('[data-x="hero"]');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: E } });
    tl.from($$('.x-hero-vid', hero), { scale: 1.3, duration: 2.4 }, 0)
      .from($$('.x-line>span', hero), { yPercent: 110, duration: 1.3, stagger: .1 }, .25)
      .from($$('[data-x-in]', hero), { y: 24, opacity: 0, duration: 1.1, stagger: .12 }, .6);
    gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      .to('[data-x-media]', { scale: .9, borderRadius: 36, ease: 'none' }, 0)
      .to($('.x-hero-in', hero), { yPercent: -30, opacity: 0, ease: 'none' }, 0);
  }

  const board = $('[data-x="board"]');
  if (board) mm.add('(min-width: 901px)', () => {
    const imgs = $$('.x-board-imgs img', board), beats = $$('.x-beat', board), ring = $('.x-board-ring', board), bar = $('.x-board-prog i', board);
    let cur = 0;
    const show = i => { if (i === cur) return; gsap.to(imgs[cur], { opacity: 0, scale: .92, duration: .5, ease: 'power2.out' }); gsap.fromTo(imgs[i], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .8, ease: E });
      gsap.to(beats[cur], { opacity: 0, y: -30, duration: .4 }); gsap.fromTo(beats[i], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, ease: E }); cur = i; };
    gsap.set(imgs, { opacity: 0 }); gsap.set(imgs[0], { opacity: 1 }); gsap.set(beats, { opacity: 0 }); gsap.set(beats[0], { opacity: 1 });
    gsap.from($('.x-board-imgs', board), { scale: .6, rotate: -25, opacity: 0, duration: 1.4, ease: E, scrollTrigger: { trigger: board, start: 'top 70%' } });
    ScrollTrigger.create({ trigger: board, start: 'top top', end: '+=240%', pin: $('.x-board-pin', board), scrub: .6,
      onUpdate: s => { bar.style.width = (s.progress * 100) + '%'; show(Math.min(2, Math.floor(s.progress * 3 * .999))); gsap.set(ring, { rotate: s.progress * 120, scale: 1 + s.progress * .15 }); gsap.set($('.x-board-imgs', board), { rotate: Math.sin(s.progress * Math.PI) * -8 }); } });
    $$('circle', ring).forEach((c, i) => { const L = 2 * Math.PI * (+c.getAttribute('r') || 10); gsap.fromTo(c, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.8, delay: i * .06, ease: 'power2.out', scrollTrigger: { trigger: board, start: 'top 70%' } }); });
  });

  const nums = $('[data-x="nums"]');
  if (nums) $$('.x-nums-g>div', nums).forEach((el, i) => {
    const dd = $('dd', el), t = dd.textContent, m = t.match(/[\d.]+/), end = parseFloat(m[0]), dec = (m[0].split('.')[1] || '').length, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => {
      el.style.setProperty('--w', '100%');
      gsap.to(o, { v: end, duration: 1.6, delay: i * .12, ease: 'power3.out', onUpdate: () => dd.textContent = t.replace(m[0], o.v.toFixed(dec)) });
      gsap.from(el, { y: 40, opacity: 0, duration: 1, delay: i * .12, ease: E }); } });
  });

  const range = $('[data-x="range"]');
  if (range) mm.add('(min-width: 901px)', () => {
    const tr = $('.x-range-track', range);
    const dist = () => Math.max(0, tr.scrollWidth - (innerWidth - tr.getBoundingClientRect().left) + 40);
    gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: range, start: 'top top', end: () => '+=' + dist(), pin: $('.x-range-pin', range), scrub: .8, invalidateOnRefresh: true } });
    gsap.from($$('.x-fam', range), { y: 80, opacity: 0, duration: 1.2, stagger: .08, ease: E, scrollTrigger: { trigger: range, start: 'top 75%' } });
  });

  const fac = $('[data-x="factory"]');
  if (fac) {
    gsap.timeline({ scrollTrigger: { trigger: fac, start: 'top top', end: '+=120%', pin: $('.x-fac-pin', fac), scrub: .6 } })
      .to('[data-x-clip]', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
      .from($('.x-fac-copy .x-h1', fac), { yPercent: 40, opacity: 0, ease: 'none' }, .1)
      .from($$('.x-fac-steps li', fac), { y: 30, opacity: 0, stagger: .08, ease: 'none' }, .35);
  }

  const proc = $('[data-x="process"]');
  if (proc) {
    const lis = $$('.x-proc-l li', proc), bar = $('.x-proc-bar i', proc);
    ScrollTrigger.create({ trigger: $('.x-proc-l', proc), start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => { bar.parentElement.style.setProperty('--p', s.progress); bar.style.transform = `scaleX(${s.progress})`; lis.forEach((l, i) => l.classList.toggle('lit', s.progress >= i / (lis.length - 1) - .02)); } });
    gsap.from(lis, { y: 30, opacity: 0, stagger: .08, duration: 1, ease: E, scrollTrigger: { trigger: proc, start: 'top 70%' } });
  }

  $$('.x-end .x-line>span').forEach(s => gsap.from(s, { yPercent: 110, duration: 1.3, ease: E, scrollTrigger: { trigger: s, start: 'top 90%' } }));
  $$('[data-x-up]').forEach((el, i) => gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: E, delay: (i % 4) * .08, scrollTrigger: { trigger: el, start: 'top 90%' } }));
  $$('[data-x-par]').forEach(el => gsap.fromTo(el, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el.closest('a,section'), scrub: true } }));
  $$('.x-head').forEach(h => gsap.from(h.children, { y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: E, scrollTrigger: { trigger: h, start: 'top 85%' } }));

  /* ---------- INNER PAGES ---------- */
  const mh = $('.mhero');
  if (mh) {
    const tl = gsap.timeline({ defaults: { ease: E } });
    tl.from($('.mhero .im', mh), { clipPath: 'inset(8% 8% 8% 8% round 40px)', duration: 1.4 }, 0)
      .from($('.mhero .im img', mh), { scale: 1.25, rotate: -6, opacity: 0, duration: 1.6 }, 0)
      .from($$('.mhero > div:last-child > *', mh), { y: 30, opacity: 0, duration: 1, stagger: .07 }, .2);
    const box = $('.mhero .im', mh), img = $('img', box);
    if (matchMedia('(pointer:fine)').matches) { box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; gsap.to(img, { rotateY: x * 14, rotateX: -y * 14, x: x * 18, y: y * 18, duration: .8, ease: 'power3.out', transformPerspective: 900 }); });
      box.addEventListener('pointerleave', () => gsap.to(img, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1.2, ease: E })); }
  }
  $$('.specs tbody tr').forEach((r, i) => gsap.from(r, { x: -20, opacity: 0, duration: .7, ease: E, scrollTrigger: { trigger: r, start: 'top 95%' } }));
  ScrollTrigger.batch($$('main .card, main .feat, main .tile, main .seg, main .cert, main .step, main .plant, main .cm-card, main .cm-box'), { start: 'top 92%', once: true,
    onEnter: b => gsap.from(b, { y: 50, opacity: 0, scale: .97, duration: 1, stagger: .06, ease: E, overwrite: true }) });
  $$('main h1.h1, main .h-hero, main h2.h2').forEach(h => { if (h.closest('.x-hero,.x-board,[data-x]')) return; gsap.from(h, { y: 40, opacity: 0, duration: 1.1, ease: E, scrollTrigger: { trigger: h, start: 'top 90%' } }); });
  $$('.media img, .roof img').forEach(im => gsap.fromTo(im, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, scrub: true } }));

  addEventListener('load', () => ScrollTrigger.refresh());
})();
