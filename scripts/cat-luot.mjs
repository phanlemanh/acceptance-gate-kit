#!/usr/bin/env node
// cat-luot.mjs — răng phủ của skill cắt lượt + nhịp đo từ hồ sơ. Hồ sơ _acceptance/lo-trinh-cat-luot/,
// design docs/superpowers/specs/2026-10-08-lo-trinh-cat-luot-design.md.
//
// CHỈ ĐỌC: không ghi tệp nào, không gọi mô hình. Bản phạm vi (khuôn
// skills/acceptance/references/pham-vi-template.md, khối PHAM-VI-MA) và tệp lộ trình phải là tệp git
// theo dõi trong kho. Răng chỉ xét mục mang cùng `dot` với bản phạm vi; cờ khuôn và lệch ngày của hàng
// ngoài đợt thành dòng «cảnh báo:», không đổi mã thoát.
//
//   node scripts/cat-luot.mjs --root . --pham-vi <tệp> --lo-trinh <tệp>   0 xanh · 1 đỏ · 2 không chạy được
//   node scripts/cat-luot.mjs --root . --nhip                              JSON nhịp theo hạng
import { readFileSync, readdirSync, existsSync, realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kiemKhuon } from './lo-trinh.mjs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));

export const DANG = ['chuoi', 'lan-va'];
const chuoi = v => (v == null ? '' : String(v).trim());
const NGAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MA_DONG = /^- `([^`]*)` — (\S.*)$/;

// ── Bản phạm vi ───────────────────────────────────────────────────────────────
// Ba khoá đầu tệp (dot · dang · nguon), mỗi dòng `- \`<mã>\` — <mô tả>` một mã. Dòng mở bằng «- `»
// mà sai khuôn thì báo kèm số dòng — không bỏ lặng.
export function docPhamVi(txt) {
  const loi = []; const khoa = {}; const ma = []; const thay = new Set();
  String(txt ?? '').split(/\r?\n/).forEach((dong, i) => {
    const k = dong.match(/^(dot|dang|nguon):\s*(.*)$/);
    if (k) { if (!(k[1] in khoa)) khoa[k[1]] = k[2].trim(); return; }
    if (!dong.startsWith('- `')) return;
    const m = dong.match(MA_DONG);
    if (!m || !m[1].trim()) { loi.push(`dòng sai khuôn ${i + 1}: ${dong.trim()}`); return; }
    const c = m[1].trim();
    if (thay.has(c)) { loi.push(`mã trùng trong bản phạm vi: ${c}`); return; }
    thay.add(c); ma.push({ ma: c, mo_ta: m[2].trim(), dong: i + 1 });
  });
  const dot = chuoi(khoa.dot); const dang = chuoi(khoa.dang);
  if (!dot) loi.push('bản phạm vi thiếu dot');
  if (!DANG.includes(dang)) loi.push(`dang «${dang}» không phải chuoi hoặc lan-va`);
  return { dot, dang, nguon: chuoi(khoa.nguon), ma, loi };
}

// ── Răng ──────────────────────────────────────────────────────────────────────
// Nhãn mà một câu cờ của kiemKhuon gắn vào (hàng <nhãn> … · mã trùng: <mã>) — null khi cờ cấp tệp.
const nhanCuaCo = c => { const a = String(c).match(/^hàng (.+?)(?::| thiếu )/); if (a) return a[1]; const b = String(c).match(/^mã trùng: (.+)$/); return b ? b[1] : null; };
const CO_TEP_DO = [/^khối hang phải là một mảng$/, /^khối chan_troi phải là một mảng$/, /^chan_troi #\d+ không phải object$/];

export function kiemPhu(pv, data) {
  const loi = []; const canhBao = [];
  const k = kiemKhuon(data);
  const trongDot = r => chuoi(r.dot) === pv.dot;
  const hang = k.hang; const dot = hang.filter(trongDot);
  const nhanDot = new Set(dot.map(r => String(r._nhan)));
  for (const c of k.co) {
    const n = nhanCuaCo(c);
    if (n != null ? nhanDot.has(String(n)) : CO_TEP_DO.some(re => re.test(c))) loi.push(c); else canhBao.push(c);
  }
  const theoMa = new Map(hang.filter(r => r._ma).map(r => [r._ma, r]));
  for (const r of dot) for (const x of (Array.isArray(r.dung_tren) ? r.dung_tren : []).map(chuoi)) if (!theoMa.has(x)) loi.push(`hàng ${r._nhan}: đứng trên mã không có: ${x}`);
  // Ngày: hàng đứng sau không sớm hơn hàng nó đứng trên; hàng gắn mốc không muộn hơn ngày mốc.
  const datNgay = (r, cau) => (trongDot(r) ? loi : canhBao).push(cau);
  for (const r of hang) {
    const n = chuoi(r.ngay); if (!NGAY_RE.test(n)) continue;
    for (const x of (Array.isArray(r.dung_tren) ? r.dung_tren : []).map(chuoi)) {
      const t = theoMa.get(x); const nt = t ? chuoi(t.ngay) : '';
      if (NGAY_RE.test(nt) && n < nt) datNgay(r, `hàng ${r._nhan}: ngày ${n} sớm hơn ngày ${nt} của hàng ${x} nó đứng trên`);
    }
  }
  for (const m of k.moc) {
    const nm = chuoi(m.ngay); if (!NGAY_RE.test(nm) || !Array.isArray(m.hang)) continue;
    for (const x of m.hang.map(chuoi)) {
      const r = theoMa.get(x); const n = r ? chuoi(r.ngay) : '';
      if (NGAY_RE.test(n) && n > nm) datNgay(r, `hàng ${r._nhan}: ngày ${n} muộn hơn mốc «${chuoi(m.ten)}» ${nm}`);
    }
  }
  // Phủ: mỗi mã của bản phạm vi ở đúng một mục cùng đợt.
  const ct = (Array.isArray(data.chan_troi) ? data.chan_troi : []).filter(c => c && typeof c === 'object' && !Array.isArray(c) && chuoi(c.dot) === pv.dot);
  for (const c of ct) if (!chuoi(c.ly_do)) loi.push(`chân trời ${chuoi(c.ma) || '?'}: thiếu ly_do`);
  const cho = new Map();
  const ghi = (ma, noi) => { if (!cho.has(ma)) cho.set(ma, []); cho.get(ma).push(noi); };
  for (const r of dot) for (const x of (Array.isArray(r.phu) ? r.phu : []).map(chuoi)) ghi(x, `hàng ${r._nhan}`);
  for (const c of ct) for (const x of (Array.isArray(c.phu) ? c.phu : []).map(chuoi)) ghi(x, `chân trời ${chuoi(c.ma) || '?'}`);
  const bang = [];
  if (!dot.length && !ct.length) loi.push(`đợt ${pv.dot} chưa cắt: ${pv.ma.length} mã chưa ở hàng hay chân trời nào`);
  else {
    const coMa = new Set(pv.ma.map(m => m.ma));
    for (const { ma } of pv.ma) {
      const noi = cho.get(ma) || [];
      if (!noi.length) loi.push(`mã ${ma} không ở hàng hay chân trời nào`);
      else if (noi.length > 1) loi.push(`mã ${ma} ở ${noi.length === 2 ? 'hai' : noi.length} chỗ: ${noi.join(', ')}`);
      bang.push({ ma, cho: noi[0] || null });
    }
    for (const [ma, noi] of cho) if (!coMa.has(ma)) for (const n of noi) loi.push(`${n} phủ mã ${ma} — bản phạm vi không có mã này`);
  }
  return { loi, canhBao, bang };
}

// ── Nhịp ──────────────────────────────────────────────────────────────────────
// Số ngày từ lúc chốt phạm vi (approved_at, làn V thì veto_opened_at) tới ngày ký Cổng Bằng chứng
// (chuỗi YYYY-MM-DD đầu tiên trong human_signoff — khuôn bên ghi của lệnh ký «<tên> <ngày>»).
const ngayDau = s => { const m = String(s ?? '').match(/\d{4}-\d{2}-\d{2}/); return m ? m[0] : null; };
const doc = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
export function nhip(root) {
  const acc = path.join(root, '_acceptance');
  const ngay = { T1: [], T2: [], T3: [] }; let tong = 0; let boQua = 0;
  const ds = existsSync(acc) ? readdirSync(acc, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort() : [];
  for (const s of ds) {
    const c = doc(path.join(acc, s, 'contract.md')); const e = doc(path.join(acc, s, 'evidence-report.md'));
    if (c == null || e == null) continue;
    const ky = chuoi(frontmatterField(e, 'human_signoff'));
    if (!ky) continue;
    tong += 1;
    const hang = chuoi(frontmatterField(c, 'risk_tier'));
    const dau = ngayDau(frontmatterField(c, 'approved_at')) || ngayDau(frontmatterField(c, 'veto_opened_at'));
    const cuoi = ngayDau(ky);
    if (!dau || !cuoi || !(hang in ngay)) { boQua += 1; continue; }
    ngay[hang].push(Math.round((Date.parse(`${cuoi}T00:00:00Z`) - Date.parse(`${dau}T00:00:00Z`)) / 864e5));
  }
  const trungVi = a => { const b = [...a].sort((x, y) => x - y); const g = b.length >> 1; return b.length % 2 ? b[g] : (b[g - 1] + b[g]) / 2; };
  const hang = Object.fromEntries(Object.entries(ngay).map(([h, a]) => [h, a.length ? { n: a.length, trung_vi: trungVi(a) } : { n: 0 }]));
  return { hang, tong, bo_qua: boQua };
}

// ── CLI ───────────────────────────────────────────────────────────────────────
const isMain = (() => {
  if (!process.argv[1]) return false;
  try { return realpathSync(process.argv[1]) === realpathSync(__filename); } catch { return path.resolve(process.argv[1]) === __filename; }
})();
if (isMain) {
  const a = process.argv.slice(2);
  const thoat = (c, m) => { process.stderr.write(`cat-luot: ${m}\n`); process.exit(c); };
  let root = '.'; let tepPv = null; let tepLt = null; let coNhip = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--nhip') { coNhip = true; continue; }
    if (['--root', '--pham-vi', '--lo-trinh'].includes(a[i])) {
      const v = a[i + 1]; if (v == null || v === '' || v.startsWith('--')) thoat(2, `${a[i]} cần một giá trị ngay sau nó`);
      if (a[i] === '--root') root = v; else if (a[i] === '--pham-vi') tepPv = v; else tepLt = v; i++;
    } else thoat(2, `tham số lạ ${a[i]} — chỉ nhận --root <thư-mục> (--pham-vi <tệp> --lo-trinh <tệp> | --nhip)`);
  }
  root = path.resolve(root);
  if (coNhip) { process.stdout.write(JSON.stringify(nhip(root), null, 2) + '\n'); process.exit(0); }
  if (!tepPv || !tepLt) thoat(2, 'cần --pham-vi <tệp> và --lo-trinh <tệp> (hoặc --nhip)');
  const trongGit = tep => {
    const p = path.resolve(root, tep); const rel = path.relative(root, p);
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel) || !existsSync(p)) return false;
    try { execFileSync('git', ['-C', root, 'ls-files', '--error-unmatch', '--', rel], { stdio: 'ignore' }); return true; } catch { return false; }
  };
  if (!trongGit(tepPv)) thoat(2, `bản phạm vi phải là tệp có trong git: ${tepPv} (chưa add, hoặc nằm ngoài kho)`);
  if (!trongGit(tepLt)) thoat(2, `tệp lộ trình phải là tệp có trong git: ${tepLt} (chưa add, hoặc nằm ngoài kho)`);
  const pv = docPhamVi(readFileSync(path.resolve(root, tepPv), 'utf8'));
  if (!pv.ma.length) thoat(2, `bản phạm vi ${tepPv} không đọc ra mã nào — mỗi mã một dòng «- \`<mã>\` — <mô tả>»`);
  let data;
  try { data = JSON.parse(readFileSync(path.resolve(root, tepLt), 'utf8').replace(/^\uFEFF/, '')); } catch (e) { thoat(2, `tệp lộ trình không phải JSON hợp lệ: ${e.message}`); }
  if (data == null || typeof data !== 'object' || Array.isArray(data)) thoat(2, 'gốc tệp lộ trình phải là một object');
  const kq = kiemPhu(pv, data);
  const loi = [...pv.loi, ...kq.loi];
  const ra = [`bảng phủ đợt ${pv.dot} (${pv.dang}): ${pv.ma.length} mã`, ...kq.bang.map(b => `  ${b.ma} → ${b.cho || '—'}`),
    ...kq.canhBao.map(c => `cảnh báo: ${c}`), ...loi.map(l => `lỗi: ${l}`)];
  process.stdout.write(ra.join('\n') + '\n');
  process.exit(loi.length ? 1 : 0);
}
