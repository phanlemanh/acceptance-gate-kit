#!/usr/bin/env node
// lo-trinh-mau-trang.mjs — trang mẫu cho hội đồng của hồ sơ trang-lo-trinh-doc-mot-phut (AC-11, E11):
// trạng thái hai lộ trình dựng từ fixture crm trong lượt (lo-trinh-kho-thu.mjs), vẽ bằng bộ vẽ của
// cây này. Hội đồng đọc ẢNH của chính trang đó; `mau/anh.json` gắn ảnh vào trang bằng băm.
//   node tests/scripts/lo-trinh-mau-trang.mjs            ghi lại trang mẫu
//   node tests/scripts/lo-trinh-mau-trang.mjs --chup     ghi trang + chụp hai ảnh (1440, 375) + anh.json
//   node tests/scripts/lo-trinh-mau-trang.mjs --check    trang == bản vẽ lại, ảnh chụp từ đúng trang
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
export const MAU = path.join(KIT, '_acceptance', 'trang-lo-trinh-doc-mot-phut', 'mau');
export const TRANG = 'hai-lo-trinh.html';
export const ANH = { 'hai-lo-trinh--1440.png': [1440, 900], 'hai-lo-trinh--375.png': [375, 812] };
const DT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-do-trang.mjs')).href);

// Ảnh trong `dir` có chụp từ đúng trang trong `dir` không — trả danh sách lỗi (rỗng = khớp).
export function kiemAnh(dir) {
  const p = path.join(dir, 'anh.json');
  if (!existsSync(p)) return [`thiếu ${path.relative(KIT, p)} — chạy: node tests/scripts/lo-trinh-mau-trang.mjs --chup`];
  const a = JSON.parse(readFileSync(p, 'utf8')); const sai = [];
  if (!a.nguon || a.nguon[TRANG] !== DT.bam(path.join(dir, TRANG))) sai.push(`ảnh chụp từ trang khác: băm nguồn ghi ${a.nguon && a.nguon[TRANG]} ≠ băm ${TRANG} hiện tại — chạy lại với --chup`);
  for (const f of Object.keys(ANH)) {
    if (!existsSync(path.join(dir, f))) sai.push(`thiếu ảnh ${f}`);
    else if (!a.anh || a.anh[f] !== DT.bam(path.join(dir, f))) sai.push(`ảnh ${f} đã đổi sau khi ghi băm`);
  }
  return sai;
}

async function veMau() {
  const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);
  const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
  const PM = await import(pathToFileURL(path.join(KIT, 'scripts', 'product-map.mjs')).href);
  const g = mkdtempSync(path.join(tmpdir(), 'lo-trinh-mau-trang-'));
  try { return LT.veTrang({ root: KT.dungKho('hai-lo-trinh', g), classify: PM.classify, sections: PM.SECTIONS }); }
  finally { rmSync(g, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const html = await veMau();
  const out = path.join(MAU, TRANG);
  if (process.argv.includes('--check')) {
    const sai = [];
    if (!existsSync(out) || readFileSync(out, 'utf8') !== html) sai.push(`trang mẫu ${existsSync(out) ? 'lệch bản vẽ lại' : 'chưa có'} — chạy: node tests/scripts/lo-trinh-mau-trang.mjs --chup`);
    sai.push(...kiemAnh(MAU));
    if (sai.length) { console.error(`lo-trinh-mau-trang: ${sai.join(' ; ')}`); process.exit(1); }
    console.log('lo-trinh-mau-trang: trang mẫu khớp bản vẽ lại, ảnh chụp từ đúng trang.');
  } else {
    mkdirSync(MAU, { recursive: true }); writeFileSync(out, html); console.log(out);
    if (process.argv.includes('--chup')) {
      const P = await DT.phienChrome(); const anh = {};
      try {
        for (const [f, [w, h]] of Object.entries(ANH)) { await P.mo(out, { w, h, sac: 'light', homNay: '2026-10-03' }); await P.chup(path.join(MAU, f)); anh[f] = DT.bam(path.join(MAU, f)); }
      } finally { await P.dong(); }
      writeFileSync(path.join(MAU, 'anh.json'), JSON.stringify({ hom_nay: '2026-10-03', nguon: { [TRANG]: DT.bam(out) }, anh }, null, 2) + '\n');
      console.log(Object.keys(anh).join(' · '));
    }
  }
}
