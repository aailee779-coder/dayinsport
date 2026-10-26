/* OEM configurator: segment, colour, door, display → config string + live display decoder (rules: catalogue p.48) */
(() => {
  const f = document.querySelector('[data-cfg]'); if (!f) return;
  const SEG = { PRO: { r: [2, 4, 3, 3], s: 13.5, t: 'PRO · 13.5″ face at 2.37 m · smallest bull and rings' }, STD: { r: [4, 4, 3, 3], s: 13.5, t: 'STD · 13.5″ face at 2.37 m · enlarged bull and wider rings' }, JMB: { r: [4, 4, 6, 6], s: 15.5, t: 'JMB · 15.5″ face at 2.44 m · six rows on triple and double' }, NEO: { r: [3, 4, 5, 5], s: 15.5, t: 'NEO · 15.5″ face at 2.44 m · commercial stand-up segment' } };
  const L = { C: 'LCD', S: 'flexible-light LCD', L: 'backlit LCD', E: 'LED seven-segment' };
  const ring = (r, size) => { const R = size === 15.5 ? 78 : 68, u = R / 26, [dbr, br, tr, drw] = r, dw = drw * u, tw = tr * u, db = dbr * u * .9, b = (dbr + br) * u * .9, trO = R * .63;
    let sp = ''; for (let i = 0; i < 20; i++) { const a = (i * 18 + 9) * Math.PI / 180; sp += `<line x1="${80 + b * Math.cos(a)}" y1="${80 + b * Math.sin(a)}" x2="${80 + R * Math.cos(a)}" y2="${80 + R * Math.sin(a)}"/>`; }
    return `<svg viewBox="0 0 160 160" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8"><circle cx="80" cy="80" r="${R}"/><circle cx="80" cy="80" r="${R - dw / 2}" stroke="#E46A58" stroke-width="${dw}" opacity=".85"/><circle cx="80" cy="80" r="${R - dw}"/><circle cx="80" cy="80" r="${trO - tw / 2}" stroke="#E46A58" stroke-width="${tw}" opacity=".85"/><circle cx="80" cy="80" r="${trO - tw}"/><circle cx="80" cy="80" r="${b}"/>${sp}<circle cx="80" cy="80" r="${db}" fill="#E46A58" stroke="none"/></g></svg>`; };
  const v = n => (f.querySelector(`[name="${n}"]:checked`) || f.querySelector(`[name="${n}"]`) || {}).value;
  const decode = (c, l, ox) => {
    if (+c > 80) return `${c} ${l} = full-LCD layout ${c} · ${L[l]}`;
    const a = +c[0], b = +c[1], cur = a % 2, pl = a - cur;
    return `${c} ${l} = ${[cur ? '1 current score' : '', pl + ' player scores', b ? b + ' cricket readouts' + (ox ? ' (on the door panel)' : '') : ''].filter(Boolean).join(' + ')} · ${L[l]}`;
  };
  const q = new URLSearchParams(location.search);
  ['seg', 'col', 'door', 'dl'].forEach(n => { const x = q.get(n); const i = x && f.querySelector(`[name="${n}"][value="${x}"]`); if (i) i.checked = true; });
  if (q.get('dc')) f.dc.value = q.get('dc'); if (q.get('ox')) f.ox.checked = true;
  const upd = () => {
    const s = v('seg'), col = v('col'), door = v('door'), dl = v('dl'), dc = f.dc.value, ox = f.ox.checked;
    const bad = dl === 'E' && +dc > 80; f.querySelector('[data-warn]').hidden = !bad;
    f.querySelector('[data-ring]').innerHTML = ring(SEG[s].r, SEG[s].s); f.querySelector('[data-segtxt]').textContent = SEG[s].t;
    const str = `${s} · ${col === 'brand' ? 'Brand palette' : 'Colour ' + col} · ${door === 'none' ? 'No doors' : 'Door ' + door.replace(/\d/, '')} · ${dc}-${dl}${ox ? '-OX' : ''}`;
    f.querySelector('[data-out]').textContent = str; f.config.value = str;
    f.querySelector('[data-dec]').textContent = bad ? 'Not available: choose another combination.' : decode(dc, dl, ox);
    f.querySelector('button[type=submit]').disabled = bad;
    const u = new URLSearchParams({ seg: s, col, door, dl, dc, ...(ox ? { ox: 1 } : {}) }); history.replaceState(null, '', '?' + u);
  };
  f.addEventListener('change', upd); upd();
  f.addEventListener('submit', e => { e.preventDefault(); location.href = f.getAttribute('action') + '?config=' + encodeURIComponent(f.config.value); });
})();
