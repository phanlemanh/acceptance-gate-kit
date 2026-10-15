// Đo nền RM2 (thước «trước» cho Cổng Giá trị): mỗi commit không-merge chạm docs/plan/lo-trinh-*.json
// ở crm — xếp vào lớp theo TRƯỜNG đổi. Lớp «doi» = việc RM2 sẽ tự làm: hàng đổi mốc (moc.hang),
// mốc đổi ngày (moc.ngay/den), hàng đổi thu_tu/han, hàng rời tệp hay vào da_bac.
// Lớp «xep» = đổi dung_tren (thứ tự phụ thuộc). Lớp «trang-thai» = trang_thai/buoc_ke/pr (đồng bộ hồ sơ — không phải RM2).
// Chạy: node do-nen.mjs <gốc crm> [ref]   (mốc so khớp theo khoa, vắng khoa thì theo vị trí)
import { execSync } from 'node:child_process';
const root = process.argv[2], ref = process.argv[3] || 'origin/onehub';
const sh = c => execSync(c, { cwd: root, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const show = (s, f) => { try { return JSON.parse(sh(`git show ${s}:${f}`)); } catch { return null; } };
const files = sh(`git ls-tree --name-only ${ref} docs/plan/`).split('\n').filter(f => /lo-trinh-.*\.json$/.test(f));
const DOI = ['moc.hang', 'moc.ngay', 'moc.den', 'hang.thu_tu', 'hang.han', 'hang-', 'da_bac'];
const out = [];
for (const f of files) for (const s of sh(`git log ${ref} --no-merges --format=%H -- ${f}`).split('\n').filter(Boolean).reverse()) {
  const a = show(`${s}^`, f), b = show(s, f); if (!b) continue;
  const c = {}; const inc = k => (c[k] = (c[k] || 0) + 1);
  if (!a) { inc('tao-tep'); } else {
    const ha = new Map(a.hang.map(h => [h.ma, h])), hb = new Set(b.hang.map(h => h.ma));
    for (const h of b.hang) { const o = ha.get(h.ma); if (!o) { inc('hang+'); continue; }
      for (const k of new Set([...Object.keys(o), ...Object.keys(h)])) if (JSON.stringify(o[k]) !== JSON.stringify(h[k])) inc('hang.' + k); }
    for (const k of ha.keys()) if (!hb.has(k)) inc('hang-');
    const key = (m, i) => m.khoa || `#${i}`;
    const ma = new Map((a.moc || []).map((m, i) => [key(m, i), m]));
    (b.moc || []).forEach((m, i) => { const o = ma.get(key(m, i)); if (!o) return inc('moc+');
      for (const k of new Set([...Object.keys(o), ...Object.keys(m)])) if (JSON.stringify(o[k]) !== JSON.stringify(m[k])) inc('moc.' + k); });
    for (const k of ['chan_troi', 'da_bac']) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) inc(k);
  }
  const lop = Object.keys(c).some(k => DOI.includes(k)) ? 'doi' : c['hang.dung_tren'] ? 'xep'
    : (c['hang.trang_thai'] || c['hang.buoc_ke'] || c['hang.pr']) && !c['hang+'] ? 'trang-thai' : (c['hang+'] || c['moc+'] || c.chan_troi || c['tao-tep']) ? 'them' : Object.keys(c).length ? 'khac' : 'rong';
  out.push({ tep: f.split('/').pop(), sha: s.slice(0, 9), ngay: sh(`git log -1 --format=%ad --date=short ${s}`).trim(), tieu_de: sh(`git log -1 --format=%s ${s}`).trim(), lop, doi: c });
}
const dem = l => out.filter(o => o.lop === l).length;
const tong = { commit: out.length, tu: out.map(o => o.ngay).sort()[0], den: out.map(o => o.ngay).sort().at(-1) };
for (const l of ['doi', 'xep', 'trang-thai', 'them', 'khac', 'rong']) tong[l] = dem(l);
console.log(JSON.stringify({ ref, sha: sh(`git rev-parse ${ref}`).trim(), tong, dong: out }, null, 1));
