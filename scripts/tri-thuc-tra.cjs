#!/usr/bin/env node
'use strict';
// tri-thuc-tra.cjs — dòng «đã tra tri thức» của bước thiết kế (hồ sơ thiet-ke-nap-tri-thuc, TT4, đợt tri-thuc-2410;
// thiết kế docs/superpowers/specs/2026-10-24-thiet-ke-nap-tri-thuc-design.md). CJS để thẻ Cổng Phạm vi và bộ xếp căn cứ
// nạp được. Kho không khai `tri_thuc` → mọi hàm trả null, bên gọi giữ nguyên hành vi trước vòng.
//
// Không có bộ so băm thứ hai: mỗi đường trỏ kiểm bằng `scripts/tri-thuc.mjs --con-tro` (0 khớp · 1 lệch/không có ·
// 2 sai khuôn · 3 không đọc được ở đây). Dòng «Nguồn:» của ô đọc bằng `docDongNguon` của tri-thuc-nguon.cjs.
//
//   node scripts/tri-thuc-tra.cjs --root <kho> --clone   0 đã clone / đã có / trong kho · 2 không chạy được · 3 không đọc được ở đây
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { docTriThuc, giaiGoc, dongKhongDoc, gocCheckoutChinh } = require('./tri-thuc-khoa.cjs');
const TN = require('./tri-thuc-nguon.cjs');

const KHOA_TRA = 'tri_thuc_tra';
const BIN_TT = path.join(__dirname, 'tri-thuc.mjs');
const KET = { 0: 'khop', 1: 'lech', 2: 'sai', 3: 'khong-doc' };
// Chữ trên thẻ — một nguồn cho thẻ và bộ kiểm.
const CO = {
  chuaTra: 'CHƯA vào được Cổng Phạm vi: chưa tra tri thức — kho đã khai tri_thuc mà sổ bước thiết kế không có dòng tra (khối DEC-TRI-THUC-TRA). Máy tra trang, ghi dòng rồi dựng lại thẻ.',
  chuaTraTrang: ds => `CHƯA vào được Cổng Phạm vi: chưa tra tri thức — chưa tra: ${ds.join(', ')} (trang ô đã nêu ở dòng «Nguồn:»). Máy tra trang, ghi dòng tra mới rồi dựng lại thẻ.`,
  lech: r => `trang tri thức không khớp bản đã tra: ${r}`,
  sai: r => `đường trỏ tri thức sai khuôn: ${r}`,
  khongDoc: d => d,
  khoiLoi: l => `khối tri_thuc lỗi — ${l.join('; ')}: chưa kiểm dòng tra tri thức.`,
  docCu: 'hồ sơ đã qua Cổng Phạm vi không có dòng tra tri thức — đọc như cũ, không chặn.',
};
const VANG = 'fwarn tri-thuc';

function docCfg(root) {
  const p = path.join(root, '_acceptance', 'config.yaml');
  return docTriThuc(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
}
// Một đường trỏ → mã thoát của --con-tro (mã lạ / tiến trình chết → 'sai' kèm dòng lỗi).
function kiemTro(root, ref) {
  const r = spawnSync(process.execPath, [BIN_TT, '--root', root, '--con-tro', String(ref)], { encoding: 'utf8' });
  const dong = String(r.stdout || r.stderr || '').trim().split('\n')[0] || '';
  return { ket: KET[r.status] || 'sai', thoat: r.status, dong };
}
const hopLe = o => !!o && typeof o === 'object' && !Array.isArray(o) && typeof o.tra === 'string' && o.tra.trim() !== '' && Array.isArray(o.trang) && o.trang.every(x => typeof x === 'string');
// Dòng tra còn hiệu lực cuối cùng: stage S1, khoá hợp lệ, không bị một dòng SAU nó thay.
function dongTra(entries) {
  const es = (entries || []).filter(e => e && typeof e === 'object');
  const biThay = new Set(); const viTri = new Map();
  es.forEach((e, i) => { if (typeof e.id === 'string' && !viTri.has(e.id)) viTri.set(e.id, i); });
  es.forEach((e, j) => { if (typeof e.supersedes === 'string' && viTri.has(e.supersedes) && viTri.get(e.supersedes) < j) biThay.add(e.supersedes); });
  let ra = null;
  for (const e of es) if (e.stage === 'S1' && hopLe(e[KHOA_TRA]) && !biThay.has(e.id)) ra = e;
  return ra;
}
// `<kho>:<đường>` của một đường trỏ (bỏ băm) — so trang ô đã nêu với trang đã tra.
const khoaTrang = (ref, re) => { const m = String(ref).match(re); return m ? `${m[1] ? `${m[1]}:` : ''}${m[2]}` : null; };

// Thẻ Cổng 1. → null (kho không khai) | { khoa, co: [[lớp, chữ]], chan, chuDo }
function theCong1({ root, entries, draft, oTxt }) {
  const cfg = docCfg(root);
  if (!cfg) return null;
  if (cfg.loi.length) return { khoa: { khai: true, loi: cfg.loi, chan: false }, co: draft ? [[VANG, CO.khoiLoi(cfg.loi)]] : [], chan: false, chuDo: null };
  const kh = TN.napKhuonNguon();
  const e = dongTra(entries);
  const o = TN.docDongNguon(oTxt || '', kh);
  const trang = e ? e[KHOA_TRA].trang.map(ref => ({ tro: ref, ...kiemTro(root, ref) })) : [];
  const daTra = new Set(trang.map(t => khoaTrang(t.tro, kh.conTro)).filter(Boolean));
  const chuaTra = e && !e[KHOA_TRA].khong_doc ? o.conTro.map(r => khoaTrang(r, kh.conTro)).filter(k => k && !daTra.has(k)) : [];
  const chan = !!draft && (!e || chuaTra.length > 0);
  const co = [];
  // Hồ sơ đã qua Cổng Phạm vi mà không dòng tra: đường đọc-cũ, một cờ vàng (luật kit: nhánh đọc bản cũ + cờ vàng).
  if (!draft && !e) co.push([VANG, CO.docCu]);
  if (draft && e) {
    if (typeof e[KHOA_TRA].khong_doc === 'string' && e[KHOA_TRA].khong_doc.trim()) co.push([VANG, CO.khongDoc(e[KHOA_TRA].khong_doc.trim())]);
    const kd = trang.find(t => t.ket === 'khong-doc');
    if (kd) co.push([VANG, CO.khongDoc(kd.dong)]);
    for (const t of trang) if (t.ket === 'lech') co.push([VANG, CO.lech(t.tro)]); else if (t.ket === 'sai') co.push([VANG, CO.sai(t.tro)]);
  }
  const chuDo = !chan ? null : (e ? CO.chuaTraTrang(chuaTra) : CO.chuaTra);
  return {
    khoa: { khai: true, dong: e ? (e.id || null) : null, tra: e ? e[KHOA_TRA].tra : null, trang: trang.map(t => ({ tro: t.tro, ket: t.ket })), nguon_o: o.conTro, chua_tra: chuaTra, khong_doc: !!(e && e[KHOA_TRA].khong_doc), chan },
    co, chan, chuDo,
  };
}

// Bộ xếp căn cứ (can-cu-s1.cjs): căn cứ nguồn mục tiêu mang khoá tri_thuc. → { lop, ma?, ghi_chu? }
// `base` (gốc nhánh) đã kiểm → trang trong kho phải có cùng băm ở gốc nhánh, không thì căn cứ sinh trong vòng.
function xetCanCu(c, { root, base }) {
  if (typeof c.tri_thuc !== 'string') return { lop: 'do', ma: 'tri-thuc-sai' };
  const cfg = docCfg(root);
  if (!cfg) return { lop: 'do', ma: 'tri-thuc-khong-khai' };
  const re = TN.napKhuonNguon().conTro;
  const m = c.tri_thuc.match(re);
  if (!m) return { lop: 'do', ma: 'tri-thuc-sai' };
  if (m[1] && (c.trich !== undefined || c.tep !== undefined)) return { lop: 'do', ma: 'tri-thuc-kem-trich' };
  const k = kiemTro(root, c.tri_thuc);
  if (k.ket === 'khong-doc') return { lop: 'da-quyet', ghi_chu: k.dong };
  if (k.ket === 'lech') return { lop: 'do', ma: 'tri-thuc-lech' };
  if (k.ket !== 'khop') return { lop: 'do', ma: 'tri-thuc-sai' };
  if (base && !m[1] && !cfg.kho && cfg.noi) {
    const rel = path.posix.join(String(cfg.noi).replace(/\\/g, '/'), m[2]);
    const r = spawnSync('git', ['-C', root, 'rev-parse', '--verify', '--quiet', `${base}:${rel}`], { encoding: 'utf8' });
    if (r.status !== 0 || r.stdout.trim() !== m[3]) return { lop: 'do', ma: 'sinh-trong-vong' };
  }
  return { lop: 'da-quyet' };
}

// Tự clone kho riêng (C4). → { thoat, dong }
function clone(root) {
  const cfg = docCfg(root);
  if (!cfg) return { thoat: 2, dong: 'tri-thuc-tra: kho chưa khai tri_thuc trong _acceptance/config.yaml' };
  if (cfg.loi.length) return { thoat: 2, dong: `tri-thuc-tra: ${cfg.loi.join('; ')}` };
  const { goc, trongKho } = giaiGoc(root, cfg);
  if (trongKho) return { thoat: 0, dong: `kho tri thức nằm trong kho: ${goc}` };
  if (fs.existsSync(goc)) return { thoat: 0, dong: `đã có: ${goc}` };
  // Kho riêng giữ raw và trang nhạy cảm: clone vào cây của kho đang chạy (checkout chính hay worktree) là một lần git add
  // tới chỗ lộ không thu hồi được — từ chối.
  const trongCay = [gocCheckoutChinh(root), fs.realpathSync(root)].some(b => { const r = path.relative(b, goc); return !r.startsWith('..') && !path.isAbsolute(r); });
  if (trongCay) return { thoat: 3, dong: `không đọc được ở đây: ${cfg.kho.ten} — đường kho riêng ${goc} nằm trong cây kho; khai kho.duong ra ngoài cây (vd ../${cfg.kho.ten}) để máy clone hộ` };
  if (!cfg.kho.remote) return { thoat: 3, dong: dongKhongDoc(cfg) + goc };
  const r = spawnSync('git', ['clone', '-q', cfg.kho.remote, goc], { encoding: 'utf8' });
  if (r.status !== 0) return { thoat: 3, dong: `không đọc được ở đây: ${cfg.kho.ten} — clone thất bại: ${String(r.stderr || '').trim().split('\n')[0]}` };
  return { thoat: 0, dong: `đã clone ${cfg.kho.remote} → ${goc}` };
}

module.exports = { KHOA_TRA, CO, KET, dongTra, kiemTro, theCong1, xetCanCu, clone };

if (require.main === module) {
  const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
  const root = path.resolve(opt('--root') || '.');
  if (!a.includes('--clone')) { process.stderr.write('tri-thuc-tra: cần --clone\n'); process.exit(2); }
  const kq = clone(root);
  (kq.thoat === 2 ? process.stderr : process.stdout).write(kq.dong + '\n');
  process.exit(kq.thoat);
}
