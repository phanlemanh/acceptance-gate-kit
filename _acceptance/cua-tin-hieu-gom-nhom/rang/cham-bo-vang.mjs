#!/usr/bin/env node
// cham-bo-vang.mjs — LỆNH chấm một lượt gom trên một bộ vàng (AC-10; đường đo «trùng đã biết gộp đúng»
// đọc ở Cổng Giá trị trên bộ vàng crm). Chạy được trên kho nào cũng được — không ghi cứng gì của bộ vàng kit.
//
//   node cham-bo-vang.mjs --root <kho> --bo-vang <tệp đáp án, tương đối gốc kho hoặc tuyệt đối>
//
// 0 đạt · 1 không đạt (mỗi dòng một lỗi) · 2 không chạy được.
// Kiểm: răng phủ của kit xanh · mỗi cặp trùng khai trong đáp án ở chung MỘT chỗ · tín hiệu từ hồ sơ đã giao
// ra «đã phủ» đúng hồ sơ · tín hiệu còn lại ở nhóm · đáp án commit TRƯỚC bản gom (khai trước, không khai
// sau khi thấy kết quả). `quetKin` (export) là phép quét KÍN ĐÁP ÁN của kho đưa cho phiên gom.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_MAC_DINH = path.resolve(__dirname, '..', '..', '..');

// Quét kín đáp án: mọi byte mọi tệp tín hiệu của kho KHÔNG chứa slug nào của đáp án, không tiêu đề nào trùng
// nguyên văn câu giao của một hồ sơ trong kho, và kho không có tệp đáp án. Trả danh sách lỗi.
export function quetKin({ root, boVang, tepTin }) {
  const loi = [];
  const slugs = Object.keys(boVang.ho_so || {});
  for (const f of tepTin) {
    const tho = readFileSync(f, 'utf8');
    for (const s of slugs) if (tho.includes(s)) loi.push(`${path.basename(f)} chứa tên hồ sơ ${s}`);
  }
  const cauGiao = new Set();
  const acc = path.join(root, '_acceptance');
  for (const d of (() => { try { return readdirSync(acc); } catch { return []; } })()) {
    for (const t of ['contract.md', 'opportunity.md']) {
      try { const m = readFileSync(path.join(acc, d, t), 'utf8').match(/^feature:\s*(.*)$/m); if (m) cauGiao.add(m[1].trim().replace(/^["']|["']$/g, '')); } catch { /* vắng */ }
    }
  }
  for (const f of tepTin) { const o = JSON.parse(readFileSync(f, 'utf8')); const td = String(o.noi_dung?.tieu_de || '').trim(); if (td && cauGiao.has(td)) loi.push(`${path.basename(f)} có tiêu đề trùng nguyên văn một câu giao`); }
  const coDapAn = (d => { const st = []; const di = x => { for (const e of readdirSync(x, { withFileTypes: true })) { if (e.name === '.git') continue; const p = path.join(x, e.name); if (e.isDirectory()) di(p); else if (e.name === 'bo-vang.json') st.push(p); } }; di(d); return st; })(root);
  for (const p of coDapAn) loi.push(`kho có tệp đáp án: ${path.relative(root, p)}`);
  return loi;
}

export async function cham({ root, boVangTep, kit = KIT_MAC_DINH }) {
  const T = await import(pathToFileURL(path.join(kit, 'scripts', 'tin-hieu.mjs')).href);
  const kq = T.kiemPhu({ root });
  if (kq.thoat2) return { thoat: 2, dong: [kq.thoat2] };
  const loi = kq.loi.map(l => `răng: ${l}`);
  const bv = JSON.parse(readFileSync(path.isAbsolute(boVangTep) ? boVangTep : path.join(root, boVangTep), 'utf8'));
  const cho = new Map(kq.bang.map(b => [b.id, b.cho]));
  const dong = [];
  for (const cap of bv.cap_trung || []) {
    const c = cap.map(id => cho.get(id) ?? 'không có');
    if (new Set(c).size !== 1) loi.push(`cặp trùng tách: ${cap.map((id, i) => `${id} → ${c[i]}`).join(' · ')}`);
    else dong.push(`- cặp ${cap.join(' + ')} → ${c[0]}`);
  }
  const daGiao = new Set(bv.da_giao || []);
  for (const m of bv.muc || []) {
    const c = cho.get(m.id) ?? 'không có';
    if (daGiao.has(m.ho_so)) { if (!c.startsWith(`đã phủ ${m.ho_so} `)) loi.push(`${m.id} sinh từ hồ sơ đã giao ${m.ho_so} nhưng ở «${c}»`); }
    else if (!c.startsWith('nhóm ')) loi.push(`${m.id} sinh từ hồ sơ chưa giao ${m.ho_so} nhưng ở «${c}», không ở nhóm`);
  }
  // Khai trước: commit đầu tiên thêm tệp đáp án là tổ tiên NGHIÊM NGẶT của commit đầu tiên thêm bản gom.
  const g = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch { return null; } };
  const relBv = path.isAbsolute(boVangTep) ? path.relative(root, boVangTep) : boVangTep;
  const dauTien = rel => (g('log', '--diff-filter=A', '--format=%H', '--reverse', '--', rel) || '').split('\n').filter(Boolean)[0] || null;
  const khai = T.docKhai(root);
  const cBv = dauTien(relBv); const cGom = khai ? dauTien(`${khai.gom.replace(/\/$/, '')}/*.md`) : null; // chỉ tệp bản gom, không tệp giữ chỗ
  if (!cBv || !cGom) loi.push(`khai trước: không tìm được commit của ${!cBv ? relBv : 'bản gom'}`);
  else if (cBv === cGom || g('merge-base', '--is-ancestor', cBv, cGom) == null) loi.push(`khai trước: ${relBv} phải commit TRƯỚC bản gom (${cBv.slice(0, 8)} không đứng trước ${cGom.slice(0, 8)})`);
  return { thoat: loi.length ? 1 : 0, dong: loi.length ? loi : [...dong, `đạt: ${(bv.cap_trung || []).length} cặp trùng chung chỗ, ${[...daGiao].length} hồ sơ đã giao ra «đã phủ»`] };
}

const laMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (laMain) {
  const a = process.argv.slice(2); const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  const root = lay('--root'); const boVangTep = lay('--bo-vang'); const kit = lay('--kit') || KIT_MAC_DINH;
  if (!root || !boVangTep) { process.stderr.write('cham-bo-vang: cần --root <kho> --bo-vang <tệp>\n'); process.exit(2); }
  let r; try { r = await cham({ root: path.resolve(root), boVangTep, kit }); } catch (e) { process.stderr.write(`cham-bo-vang: ${e.message}\n`); process.exit(2); }
  process.stdout.write(r.dong.join('\n') + '\n'); process.exit(r.thoat);
}
