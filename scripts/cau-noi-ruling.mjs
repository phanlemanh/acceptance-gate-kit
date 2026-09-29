#!/usr/bin/env node
// cau-noi-ruling.mjs — gặt dòng «Ruling» trong ledger superpowers (.superpowers/sdd/<ws>/progress.md) vào
// _acceptance/<slug>/decisions.jsonl thành dòng ba vế (ADR 0021, hồ sơ mot-so-ba-ve). Quy tắc cắt: NHÃN
// («Vì sao:», «Sai thì tốn:», «Giá nếu sai:», «cost if wrong:», có dấu hay không) thắng dấu « — ».
import { readFileSync, existsSync, appendFileSync, statSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MO = /\bRuling\b[^:\n]*:/;
const DONG_MOI = /^(#|- |Task \d|Final:|S\d+:|\d+\.\s)/;
export function tachRuling(text) {
  const out = []; let cur = null;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (MO.test(l) && !/minor \(deferred\)/.test(l)) { if (cur) out.push(cur); cur = [l]; continue; }
    if (!cur) continue;
    if (l === '' || DONG_MOI.test(l)) { out.push(cur); cur = null; } else cur.push(l);
  }
  if (cur) out.push(cur);
  return out.map(ls => ls.join(' '));
}
// Bản không dấu + ánh xạ vị trí về chuỗi gốc (một ký tự gốc có thể thành 0–1 ký tự không dấu).
function khongDau(s) {
  let n = ''; const idx = [];
  for (let i = 0; i < s.length; i++) {
    const k = s[i].normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    for (const ch of k) { n += ch; idx.push(i); }
  }
  idx.push(s.length);
  return { n, idx };
}
const NHAN_WHY = /vi sao(?: lat)?\s*:/;
const NHAN_GIA = /(?:sai thi ton|gia neu sai|cost if wrong)\s*:/;
const tim = (s, re) => { const { n, idx } = khongDau(s); const m = re.exec(n); return m ? { a: idx[m.index], b: idx[m.index + m[0].length] } : null; };
const gon = s => { const t = String(s || '').replace(/^[\s—-]+/, '').replace(/[\s—]+$/, '').trim(); return t || null; };
export function catBaVe(entry) {
  const m = entry.match(/^(.*?)\bRuling\b[^:]*:\s*/);
  const truoc = m[1].trim();
  const than = entry.slice(m[0].length);
  const prefix = (truoc.match(/^([^:]+):/) || [])[1]?.trim() || (entry.match(/^Ruling\s*\d+/) || [])[0] || 'Ruling';
  const pk = truoc.replace(/^[^:]*:\s*/, '').match(/^parked\s*—\s*([\s\S]*?)[\s—.]*$/);
  const w = tim(than, NHAN_WHY), c = tim(than, NHAN_GIA);
  const cuoiDau = Math.min(w ? w.a : Infinity, c ? c.a : Infinity, than.length);
  const dau = than.slice(0, cuoiDau);
  let why = w ? than.slice(w.b, c && c.a > w.a ? c.a : than.length) : null;
  const cost = c ? than.slice(c.b, w && w.a > c.a ? w.a : than.length) : null;
  let decision;
  if (pk) { decision = 'KHÔNG sửa: ' + gon(pk[1]); why = [gon(dau), gon(why)].filter(Boolean).join(' ') || null; }
  else if (w) decision = dau;
  else {
    const parts = dau.split(' — ').map(gon).filter(Boolean);
    decision = parts[0] || '';
    if (c) why = parts.slice(1).join(' — ') || null;
    else { why = parts[1] || null; if (parts.length > 2) return { prefix, type: 'approach', decision: gon(decision), why: gon(why), cost_if_wrong: gon(parts.slice(2).join(' — ')) }; }
  }
  return { prefix, type: pk ? 'revisit' : 'approach', decision: gon(decision), why: gon(why), cost_if_wrong: gon(cost) };
}
function suySlug(root, ws, text, slugArg) {
  const co = s => s && existsSync(path.join(root, '_acceptance', s)) && statSync(path.join(root, '_acceptance', s)).isDirectory();
  if (slugArg) return co(slugArg) ? slugArg : null;
  const tuTen = path.basename(ws).replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (co(tuTen)) return tuTen;
  const m = text.match(/_acceptance\/([\w-]+)\/contract\.md/);
  return m && co(m[1]) ? m[1] : null;
}
const soDong = t => t === '' ? 0 : t.split('\n').length - (t.endsWith('\n') ? 1 : 0);
export function main(argv) {
  const v = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const root = v('--root'), ws = v('--workspace'), write = argv.includes('--write');
  if (!root || !ws) { console.error('cau-noi-ruling: cú pháp — --root <repo> --workspace <.superpowers/sdd/<ws>> [--slug <slug>] [--write]'); return 5; }
  const wsAbs = path.resolve(root, ws);
  const pf = path.join(wsAbs, 'progress.md');
  if (!existsSync(pf)) { console.error(`cau-noi-ruling: không có ruling để gặt — không thấy ${pf}`); return 0; }
  const text = readFileSync(pf, 'utf8');
  const entries = tachRuling(text);
  if (!entries.length) { console.error(`cau-noi-ruling: không có ruling để gặt — ${pf} không có dòng Ruling`); return 0; }
  const slug = suySlug(root, wsAbs, text, v('--slug'));
  if (!slug) { console.error(`cau-noi-ruling: không suy được hồ sơ — tên workspace «${path.basename(wsAbs)}» và dòng _acceptance/<slug>/contract.md trong ledger đều không trỏ tới hồ sơ có thật; truyền --slug`); return 2; }
  const L = path.join(root, '_acceptance', slug, 'decisions.jsonl');
  let so = existsSync(L) ? readFileSync(L, 'utf8') : '';
  const daCo = new Set(so.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l).source_ref; } catch { return null; } }).filter(Boolean));
  let moi = 0;
  const now = new Date(); const utc = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); const at = now.toISOString().replace(/\.\d+Z$/, 'Z');
  for (const e of entries) {
    const b = catBaVe(e);
    const ref = `${path.basename(wsAbs)}#${b.prefix}:${createHash('sha256').update(e).digest('hex').slice(0, 8)}`;
    if (daCo.has(ref)) continue;
    const o = { id: `d-${utc}-${soDong(so) + 1}`, type: b.type, stage: 'S3', at, decision: b.decision };
    if (b.why) o.why = b.why;
    if (b.cost_if_wrong) o.cost_if_wrong = b.cost_if_wrong;
    o.source = 'superpowers'; o.source_ref = ref;
    const line = JSON.stringify(o) + '\n';
    if (write) { if (so !== '' && !so.endsWith('\n')) { appendFileSync(L, '\n'); so += '\n'; } appendFileSync(L, line); } else process.stdout.write(line);
    so += line; daCo.add(ref); moi++;
  }
  console.log(`cau-noi-ruling: đã gặt ${moi} ruling vào sổ ${slug} (${entries.length - moi} đã có)`);
  return 0;
}
// So bằng realpath: /var → /private/var trên macOS làm argv[1] lệch import.meta.url, và khi lệch thì
// main không chạy mà tiến trình vẫn thoát 0 — gặt «xanh» mà sổ không đổi.
const laMain = (() => { try { return !!process.argv[1] && realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (laMain) process.exit(main(process.argv.slice(2)));
