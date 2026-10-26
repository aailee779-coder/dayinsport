/* Product hub filters (client-side over the static list; every model is in the HTML for SEO) */
(() => {
  const w = document.querySelector('[data-catalog]'); if (!w) return;
  const form = w.querySelector('form'), cards = [...w.querySelectorAll('.pgrid .card')], out = w.querySelector('[data-count-out]'), empty = w.querySelector('.empty');
  const get = n => [...form.querySelectorAll(`input[name="${n}"]:checked`)].map(i => i.value);
  const apply = () => {
    const f = { cat: get('cat'), seg: get('seg'), disp: get('disp'), pl: get('pl') }; let k = 0;
    cards.forEach(c => {
      const ok = (!f.cat.length || f.cat.includes(c.dataset.cat)) && (!f.seg.length || f.seg.includes(c.dataset.seg)) && (!f.disp.length || f.disp.includes(c.dataset.disp)) && (!f.pl.length || f.pl.includes(c.dataset.pl));
      c.parentElement.hidden = !ok; if (ok) k++;
    });
    out.textContent = k; empty.hidden = k > 0;
    const q = new URLSearchParams(); Object.entries(f).forEach(([n, v]) => v.length && q.set(n, v.join(','))); history.replaceState(null, '', q.toString() ? '?' + q : location.pathname);
  };
  const q = new URLSearchParams(location.search);
  q.forEach((v, n) => v.split(',').forEach(x => { const i = form.querySelector(`input[name="${n}"][value="${x}"]`); if (i) i.checked = true; }));
  form.addEventListener('change', apply); form.addEventListener('reset', () => setTimeout(apply)); apply();
})();
