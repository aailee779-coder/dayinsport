/* DAYIN Sport v4: hero slider, header shadow, fade-ups. Content is complete without JS. */
(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = $('.hd'); if (hd) { const f = () => hd.classList.toggle('sh', scrollY > 8); f(); addEventListener('scroll', f, { passive: true }); }

  /* hero slider */
  const h = $('[data-slider]');
  if (h) {
    const sl = $$('.v-slide', h), tb = $$('.v-tabs button', h), dur = 7000; let i = 0, t;
    const vid = s => $('video', s);
    const go = n => { sl[i].classList.remove('on'); tb[i].setAttribute('aria-selected', 'false'); const v0 = vid(sl[i]); v0 && v0.pause();
      i = (n + sl.length) % sl.length; sl[i].classList.add('on'); tb[i].setAttribute('aria-selected', 'true'); const v = vid(sl[i]); v && v.play().catch(() => {});
      sl.forEach((s, k) => s.inert = k !== i); clearTimeout(t); if (!reduce && !h.classList.contains('paused')) t = setTimeout(() => go(i + 1), dur); };
    h.style.setProperty('--dur', dur + 'ms');
    tb.forEach((b, k) => b.addEventListener('click', () => go(k)));
    h.addEventListener('mouseenter', () => { h.classList.add('paused'); clearTimeout(t); });
    h.addEventListener('mouseleave', () => { h.classList.remove('paused'); go(i); });
    $$('img[data-src]', h).forEach(im => { im.src = im.dataset.src; });
    go(0);
  }

  /* fade-ups */
  if (!reduce && 'IntersectionObserver' in window) {
    d.documentElement.classList.add('v-js');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-v]').forEach(el => io.observe(el));
  }
})();
