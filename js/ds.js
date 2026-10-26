/* DAYIN Sport: shared behaviour (header, reveal, counters, rails, forms) */
(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: hide on scroll down, burger */
  const hd = $('.hd');
  if (hd) {
    let y0 = scrollY;
    addEventListener('scroll', () => { const y = scrollY; if (!hd.classList.contains('open')) hd.classList.toggle('up', y > 160 && y > y0); y0 = y; }, { passive: true });
    const b = $('.burger', hd);
    b && b.addEventListener('click', () => { const o = hd.classList.toggle('open'); b.setAttribute('aria-expanded', o); d.body.style.overflow = o ? 'hidden' : ''; });
  }

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.rv, .steps').forEach(el => reduce ? el.classList.add('in') : io.observe(el));

  /* count-up (values are in the HTML for SEO; animation only re-plays them) */
  if (!reduce) $$('[data-count]').forEach(el => {
    const t = el.textContent, m = t.match(/[\d.]+/); if (!m) return;
    const end = parseFloat(m[0]), dec = (m[0].split('.')[1] || '').length;
    const o = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now(); const f = n => { const k = Math.min(1, (n - t0) / 900), v = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        el.textContent = t.replace(m[0], v); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { threshold: .4 });
    o.observe(el);
  });

  /* rails */
  $$('[data-rail]').forEach(w => {
    const r = $('.rail', w), p = $('[data-prev]', w), n = $('[data-next]', w); if (!r || !p) return;
    const step = () => ($('.tile', r)?.getBoundingClientRect().width || 300) + 20;
    const upd = () => { p.disabled = r.scrollLeft < 8; n.disabled = r.scrollLeft + r.clientWidth > r.scrollWidth - 8; };
    p.onclick = () => r.scrollBy({ left: -step(), behavior: 'smooth' }); n.onclick = () => r.scrollBy({ left: step(), behavior: 'smooth' });
    r.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  });

  /* forms: not connected yet (preview). Prefill from ?model= / ?config= */
  const q = new URLSearchParams(location.search);
  $$('form[data-form]').forEach(f => {
    const mf = $('[name="models"]', f); if (mf && q.get('model')) mf.value = q.get('model');
    const cf = $('[name="config"]', f); if (cf && q.get('config')) cf.value = q.get('config');
    f.addEventListener('submit', e => { e.preventDefault(); if ($('.hp input', f)?.value) return; f.classList.add('sent'); $('.ok', f)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
  });
})();
