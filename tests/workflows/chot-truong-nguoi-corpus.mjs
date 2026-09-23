#!/usr/bin/env node
// chot-truong-nguoi-corpus.mjs — hồ sơ chot-may-chu-ky-sau-synthesize (AC-6, AC-7).
//
// Hai việc, một nguồn:
//   napChot(src)        rút khối hàm chốt NGUYÊN VĂN từ tệp workflow theo marker
//                       CHOT-TRUONG-NGUOI (sandbox workflow không có import — test rút, không chép).
//   kiemIm(truoc, sau)  phép chiều im: dòng khác nhau chỉ được là dòng trường của bốn khoá, ở
//                       vị trí trường theo KHUÔN BÊN VIẾT (cột 0 hoặc cột 2 — frontmatter và
//                       dòng trường của khối evidence trong evidence-report-template.md), cùng
//                       số dòng. Định nghĩa độc lập với luật vị trí của chính hàm chốt.
//
// CLI (chiều im trên kho khác, chỉ ĐỌC bằng git show — không ghi byte nào vào kho đó):
//   node chot-truong-nguoi-corpus.mjs --root <kho> --ref <ref>... [--can <slug>]... [--doi-cham] [--nhan <tên>]
// Mã thoát: 0 im · 1 có dòng ngoài bốn khoá (hoặc --doi-cham mà 0 bị chạm) · 3 không đọc được ở đây.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const KHOA_BON = ['human_signoff', 'human_override', 'bypass_ack', 'verified_at'];
const WF = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');

export function napChot(src) {
  const a = src.indexOf('// <<<CHOT-TRUONG-NGUOI');
  const b = src.indexOf('// CHOT-TRUONG-NGUOI>>>');
  if (a === -1 || b === -1 || b < a) throw new Error('khong rut duoc khoi CHOT-TRUONG-NGUOI tu tep workflow');
  const than = src.slice(src.indexOf('\n', a) + 1, b);
  // eslint-disable-next-line no-new-func
  return new Function(`${than}\nreturn chotTruongNguoi`)();
}

const RE_TRUONG = /^( {0,2})(- )?(human_signoff|human_override|bypass_ack|verified_at)(\s*[:=])/;
export function kiemIm(truoc, sau) {
  const a = String(truoc).split('\n'), b = String(sau).split('\n');
  if (a.length !== b.length) return [`so dong doi ${a.length} -> ${b.length}`];
  const v = [];
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] === b[i]) continue;
    const m = a[i].match(RE_TRUONG);
    if (!m) { v.push(`cham dong ngoai bon khoa: dong ${i + 1} «${a[i].trim().slice(0, 70)}»`); continue; }
    if (!b[i].startsWith(m[1] + (m[2] || '') + m[3])) v.push(`dong khoa ${m[3]} doi dang: dong ${i + 1}`);
  }
  return v;
}

function doiSo(argv) {
  const o = { ref: [], can: [], root: '', doiCham: false, nhan: 'kho' };
  for (let i = 0; i < argv.length; i += 1) {
    const x = argv[i];
    if (x === '--root') o.root = argv[++i];
    else if (x === '--ref') o.ref.push(argv[++i]);
    else if (x === '--can') o.can.push(argv[++i]);
    else if (x === '--nhan') o.nhan = argv[++i];
    else if (x === '--doi-cham') o.doiCham = true;
    else throw new Error(`co la: ${x}`);
  }
  return o;
}

function main() {
  const o = doiSo(process.argv.slice(2));
  const khong = m => { console.log(`khong doc duoc o day: ${m}`); process.exit(3); };
  const git = (...x) => execFileSync('git', ['-C', o.root, ...x], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
  if (!o.root) khong('thieu --root');
  try { git('rev-parse', '--git-dir'); } catch { khong(`${o.root} khong phai kho git`); }
  const docDuoc = [];
  for (const r of o.ref) {
    try { git('rev-parse', '--verify', '--quiet', `${r}^{commit}`); docDuoc.push(r); } catch { console.log(`ref vang: ${r}`); }
  }
  if (!docDuoc.length) khong('khong ref nao doc duoc');
  const chot = napChot(readFileSync(WF, 'utf8'));
  const baoCao = new Map(); // slug -> {ref, text}: ref đầu tiên có báo cáo ĐÃ KÝ
  for (const r of docDuoc) {
    let slugs = [];
    try { slugs = git('ls-tree', '--name-only', `${r}:_acceptance`).split('\n').filter(Boolean); } catch { continue; }
    for (const s of slugs) {
      if (baoCao.has(s)) continue;
      let t;
      try { t = git('show', `${r}:_acceptance/${s}/evidence-report.md`); } catch { continue; }
      const fm = t.split('\n---')[0];
      const ky = (fm.match(/^human_signoff[ \t]*[:=][ \t]*([^#\n]*)/m) || [])[1];
      if (ky && ky.trim()) baoCao.set(s, { ref: r, text: t });
    }
  }
  for (const s of o.can) if (!baoCao.has(s)) khong(`ho so ${s} vang o moi ref doc duoc`);
  let cham = 0; const viPham = [];
  for (const [s, { text }] of baoCao) {
    const sau = chot(text, { invokedAt: '2000-01-01T00:00:00Z', gioTheoRunId: {} }).text;
    if (sau !== text) cham += 1;
    for (const m of kiemIm(text, sau)) viPham.push(`${s}: ${m}`);
  }
  for (const s of o.can) console.log(`co mat: ${s}`);
  if (viPham.length) { viPham.slice(0, 20).forEach(m => console.log(m)); console.log(`im: ${baoCao.size} bao cao ${o.nhan}, ${cham} bi cham, ${viPham.length} dong ngoai bon khoa`); process.exit(1); }
  console.log(`im: ${baoCao.size} bao cao ${o.nhan}, ${cham} bi cham, 0 dong ngoai bon khoa`);
  if (o.doiCham && cham === 0) { console.log('doi cham: 0 bao cao bi cham — doi chung duong hong'); process.exit(1); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
