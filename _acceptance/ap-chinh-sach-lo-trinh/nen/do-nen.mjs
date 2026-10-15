// Đo nền RM2 (thước «trước» và «sau» cho Cổng Giá trị): mỗi commit không-merge chạm tệp lộ trình — xếp vào lớp theo TRƯỜNG đổi.
// Lớp «doi» = việc RM2 tự làm: hàng đổi mốc (moc.hang), mốc đổi ngày (moc.ngay/den), hàng đổi thu_tu/han, hàng rời tệp hay vào
// da_bac. Phần MÁY dời (dòng `ap` mới của sổ tự áp `<tệp>.so.jsonl` trong cùng commit) bị trừ theo MÃ — không theo tiêu đề commit,
// vì tiêu đề mất khi gộp squash. Lớp «xep» = đổi dung_tren. Lớp «trang-thai» = trang_thai/buoc_ke/pr. Còn lại: them · khac · rong.
// Chạy: node do-nen.mjs <gốc kho> [ref] [tệp1,tệp2…]   (mặc định: mọi docs/plan/lo-trinh-*.json ở ref; mốc so theo khoa, vắng thì vị trí)
// Giới hạn: một lần dời TAY trùng đúng mã + khối đích với một dòng `ap` của máy trong cùng commit bị trừ nhầm.
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
export const TIEU_DE_MAY = 'lo-trinh(may-ap)';
const DOI = ['moc.hang', 'moc.ngay', 'moc.den', 'hang.thu_tu', 'hang.han', 'hang-', 'da_bac'];
export function doNen(root, ref = 'origin/onehub', tepArg = null) {
  const sh = (...a) => execFileSync('git', ['-C', root, ...a], { maxBuffer: 1 << 28, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const show = (s, f) => { try { return sh('show', `${s}:${f}`); } catch { return null; } };
  const json = (s, f) => { const t = show(s, f); try { return t == null ? null : JSON.parse(t); } catch { return null; } };
  const files = tepArg ? tepArg.split(',') : sh('ls-tree', '--name-only', ref, 'docs/plan/').split('\n').filter(f => /lo-trinh-.*\.json$/.test(f));
  const out = [];
  for (const f of files) {
    const so = f.replace(/\.json$/, '') + '.so.jsonl';
    for (const s of sh('log', ref, '--no-merges', '--format=%H', '--', f).split('\n').filter(Boolean).reverse()) {
      const a = json(`${s}^`, f), b = json(s, f); if (!b) continue;
      const c = {}; const inc = k => (c[k] = (c[k] || 0) + 1); const maDoi = new Set(); let ngayMoc = false;
      if (!a) inc('tao-tep'); else {
        const ha = new Map(a.hang.map(h => [h.ma, h])), hb = new Set(b.hang.map(h => h.ma));
        for (const h of b.hang) { const o = ha.get(h.ma); if (!o) { inc('hang+'); continue; }
          for (const k of new Set([...Object.keys(o), ...Object.keys(h)])) if (JSON.stringify(o[k]) !== JSON.stringify(h[k])) { inc('hang.' + k); if (k === 'thu_tu' || k === 'han') maDoi.add(h.ma); } }
        for (const k of ha.keys()) if (!hb.has(k)) { inc('hang-'); maDoi.add(k); }
        const key = (m, i) => m.khoa || `#${i}`;
        const ma = new Map((a.moc || []).map((m, i) => [key(m, i), m]));
        (b.moc || []).forEach((m, i) => { const o = ma.get(key(m, i)); if (!o) return inc('moc+');
          for (const k of new Set([...Object.keys(o), ...Object.keys(m)])) if (JSON.stringify(o[k]) !== JSON.stringify(m[k])) {
            inc('moc.' + k);
            if (k === 'ngay' || k === 'den') ngayMoc = true;
            if (k === 'hang') { const x = new Set(o.hang || []), y = new Set(m.hang || []); for (const v of [...x, ...y]) if (x.has(v) !== y.has(v)) maDoi.add(v); }
          } });
        for (const k of ['chan_troi', 'da_bac']) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) { inc(k);
          if (k === 'da_bac') { const x = new Set((a.da_bac || []).map(d => d.ma)); for (const d of b.da_bac || []) if (!x.has(d.ma)) maDoi.add(d.ma); } }
      }
      // Phần máy: dòng `ap` mới của sổ trong commit này.
      const dongSo = t => new Set((t || '').split('\n').filter(Boolean));
      const cu = dongSo(show(`${s}^`, so)); const may = new Set();
      for (const l of dongSo(show(s, so))) if (!cu.has(l)) { try { const d = JSON.parse(l); if (d.loai === 'ap') may.add(d.ma); } catch { /* dòng hỏng */ } }
      const tay = [...maDoi].filter(m => !may.has(m));
      const coDoi = Object.keys(c).some(k => DOI.includes(k));
      const lop = coDoi ? (tay.length || ngayMoc ? 'doi' : 'may') : c['hang.dung_tren'] ? 'xep'
        : (c['hang.trang_thai'] || c['hang.buoc_ke'] || c['hang.pr']) && !c['hang+'] ? 'trang-thai' : (c['hang+'] || c['moc+'] || c.chan_troi || c['tao-tep']) ? 'them' : Object.keys(c).length ? 'khac' : 'rong';
      out.push({ tep: f.split('/').pop(), sha: s.slice(0, 9), ngay: sh('log', '-1', '--format=%ad', '--date=short', s).trim(), tieu_de: sh('log', '-1', '--format=%s', s).trim(), lop, ma_tay: tay, ma_may: [...may], doi: c });
    }
  }
  const dem = l => out.filter(o => o.lop === l).length;
  const tong = { commit: out.length, tu: out.map(o => o.ngay).sort()[0], den: out.map(o => o.ngay).sort().at(-1), tieu_de_may: out.filter(o => o.tieu_de.startsWith(TIEU_DE_MAY)).length };
  for (const l of ['doi', 'may', 'xep', 'trang-thai', 'them', 'khac', 'rong']) tong[l] = dem(l);
  return { ref, sha: sh('rev-parse', ref).trim(), tong, dong: out };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(doNen(process.argv[2], process.argv[3] || 'origin/onehub', process.argv[4] || null), null, 1));
}
