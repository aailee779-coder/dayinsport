/* Product listing filters (every model is in the HTML for SEO) */
(() => {
  const w = document.querySelector('[data-catalog]'); if (!w) return;
  const form = w.querySelector('form'), items = [...w.querySelectorAll('.cm-grid > li')], out = w.querySelector('[data-count-out]'), empty = w.querySelector('.empty');
  const get = n => [...form.querySelectorAll(`input[name="${n}"]:checked`)].map(i => i.value);
  const apply = () => { const f = { seg: get('seg'), disp: get('disp'), pl: get('pl') }; let k = 0;
    items.forEach(li => { const ok = Object.entries(f).every(([n, v]) => !v.length || v.includes(li.dataset[n])); li.hidden = !ok; if (ok) k++; });
    out.textContent = k; empty.hidden = k > 0; };
  const q = new URLSearchParams(location.search); q.forEach((v, n) => v.split(',').forEach(x => { const i = form.querySelector(`input[name="${n}"][value="${x}"]`); if (i) i.checked = true; }));
  form.addEventListener('change', apply); form.addEventListener('reset', () => setTimeout(apply)); apply();
})();
/* product gallery thumbs + sticky quote bar */
(() => {
  document.querySelectorAll('.cm-thumbs button').forEach(b => b.addEventListener('click', () => { const g = document.querySelector('[data-gal] img'); g.srcset = ''; g.src = b.dataset.src; b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  const bar = document.querySelector('[data-sbar]'); if (bar) addEventListener('scroll', () => bar.classList.toggle('on', scrollY > 700 && scrollY < document.body.scrollHeight - innerHeight - 400), { passive: true });
})();
