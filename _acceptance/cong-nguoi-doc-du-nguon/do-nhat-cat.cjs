#!/usr/bin/env node
'use strict';
/**
 * do-nhat-cat.cjs — số cho QUYẾT ĐỊNH ở Cổng Bằng chứng lượt 5, không phải cho
 * một tiêu chí. Nó tách 220 hợp đồng «đọc THÊM tiêu chí» thành hai nhánh:
 *
 *   CÓ mục tiêu chí   → bộ đọc quét TRONG mục. An toàn, không bịa được.
 *   KHÔNG có mục      → bộ đọc quét CẢ TỆP. Đây là nhánh sinh tiêu chí MA và
 *                       làm cờ điểm-mù hoá im (đo được ở lượt 5).
 *
 * Người quyết cần biết mỗi lối cắt bỏ đi bao nhiêu, nên số phải ĐỌC TỪ VẬT —
 * hợp đồng thật của mọi kho dưới ~/dev — và phải ĐỔI khi lớp thư viện đổi.
 *
 *   node do-nhat-cat.cjs [--ag-root <cây thư viện>] [--dev <thư mục kho>]
 *
 * Chạy với --ag-root trỏ vào một cây ĐÃ CẮT phải cho khongCoMuc = 0. Số không
 * đổi theo lớp nghĩa là script đang đo VĂN chứ không đo VẬT.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const HO_SO = path.dirname(__filename);
const CAY = path.resolve(HO_SO, '..', '..');

function doiSo(argv) {
  const o = { agRoot: CAY, dev: path.join(os.homedir(), 'dev') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--ag-root') o.agRoot = path.resolve(argv[++i]);
    else if (argv[i] === '--dev') o.dev = path.resolve(argv[++i]);
    else { process.stderr.write(`do-nhat-cat: cờ lạ ${argv[i]}\n`); process.exit(2); }
  }
  return o;
}

const o = doiSo(process.argv.slice(2));
const acLine = require(path.join(o.agRoot, 'lib/ac-line.cjs'));
const mdSec = require(path.join(o.agRoot, 'lib/md-section.cjs'));
const MUC_CAM = /known limit|giới hạn|out of scope|ngoài phạm vi|không làm|notes?$/;

const hoSo = [];
for (const kho of fs.readdirSync(o.dev)) {
  const d = path.join(o.dev, kho, '_acceptance');
  let st; try { st = fs.statSync(d); } catch { continue; }
  if (!st.isDirectory()) continue;
  for (const slug of fs.readdirSync(d)) {
    const f = path.join(d, slug, 'contract.md');
    if (fs.existsSync(f)) hoSo.push({ kho, slug, f });
  }
}

let coMuc = 0, khongMuc = 0, tcCo = 0, tcKhong = 0, maTuMucCam = 0, coHoaIm = 0;
const viDu = [];
for (const h of hoSo) {
  const t = fs.readFileSync(h.f, 'utf8');
  const hep = [];
  for (const l of mdSec.section(t, 'Criteria')) { const a = acLine.parseAC(l); if (a) hep.push(a.id); }
  const rong = acLine.parseACBlock(t).map(a => a.id);
  if (rong.length <= hep.length) continue;
  const coSection = acLine.CRITERIA_HEADINGS.some(x => mdSec.sectionLines(t, x).length > 0);
  if (coSection) { coMuc += 1; tcCo += rong.length - hep.length; continue; }
  khongMuc += 1; tcKhong += rong.length - hep.length;
  let muc = '';
  for (const l of t.split('\n')) {
    const hd = l.match(/^#{1,6}\s+(.*)$/);
    if (hd) muc = hd[1].toLowerCase();
    const id = l.match(/^\s*(?:#{2,6}\s+)?(?:[-*]\s+)?\*{0,2}\s*(AC-\d+)\b/);
    if (id && rong.includes(id[1]) && MUC_CAM.test(muc)) {
      maTuMucCam += 1; if (viDu.length < 8) viDu.push(`${h.kho}/${h.slug}: ${id[1]} ở «${muc.slice(0, 30)}»`);
      break;
    }
  }
  if (acLine.acBlindSpot(t, rong) === null && acLine.acBlindSpot(t, hep) !== null) coHoaIm += 1;
}

console.log(JSON.stringify({
  lopDo: o.agRoot, hoSo: hoSo.length, docThem: coMuc + khongMuc,
  coMucTieuChi: coMuc, tieuChiThemCoMuc: tcCo,
  khongCoMuc: khongMuc, tieuChiThemKhongMuc: tcKhong,
  hoSoNhatMaTuMucCam: maTuMucCam, coDiemMuHoaIm: coHoaIm, viDu,
}, null, 2));
