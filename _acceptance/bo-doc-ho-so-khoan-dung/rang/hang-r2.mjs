#!/usr/bin/env node
// hang-r2.mjs — răng E9 của hồ sơ bo-doc-ho-so-khoan-dung: hàng R2 có trên lộ trình kit và nằm ở mốc «Tinh chỉnh
// sau hai đợt thử». Hàng đọc qua CHÍNH `scripts/lo-trinh.mjs --hang R2` của cây đang kiểm (gốc suy từ vị trí tệp này);
// mốc đọc từ tệp lộ trình. Chiều đỏ cùng lượt: bản sao tệp lộ trình bỏ R2 khỏi mốc → CHÍNH hàm kiểm trả «R2 không ở mốc».
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TEP = path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json');
const MOC = 'Tinh chỉnh sau hai đợt thử';

function kiem(lt, hang) {
  const loi = [];
  const can = { ma: 'R2', nhom: 'doc-khoan-dung', hang: 'T2', slug: 'bo-doc-ho-so-khoan-dung' };
  for (const [k, v] of Object.entries(can)) if (!hang || hang[k] !== v) loi.push(`hàng: ${k} = ${JSON.stringify(hang && hang[k])}, mong ${JSON.stringify(v)}`);
  if (!hang || !Array.isArray(hang.dung_tren) || !hang.dung_tren.includes('R1')) loi.push('hàng: dung_tren thiếu R1');
  const vs = String(hang && hang.vi_sao || '');
  if (!vs.startsWith('Gốc:') || !vs.includes('crm-onehub#375') || !vs.includes('2026-10-13-hat-giong-ngay-ky')) loi.push(`hàng: vi_sao không trỏ hai gốc — ${JSON.stringify(vs.slice(0, 80))}`);
  const moc = (lt.moc || []).filter(m => String(m.ten || '').startsWith(MOC));
  if (moc.length !== 1) loi.push(`mốc «${MOC}»: thấy ${moc.length}`);
  else if (!(moc[0].hang || []).includes('R2')) loi.push('R2 không ở mốc');
  return loi;
}

const r = spawnSync(process.execPath, [path.join(KIT, 'scripts', 'lo-trinh.mjs'), '--root', KIT, '--hang', 'R2'], { encoding: 'utf8' });
if (r.status !== 0) { process.stderr.write(`hang-r2: lo-trinh.mjs --hang R2 thoát ${r.status}: ${r.stderr.trim()}\n`); process.exit(1); }
const hang = JSON.parse(r.stdout);
process.stdout.write(JSON.stringify(hang) + '\n');
const lt = JSON.parse(readFileSync(TEP, 'utf8'));
const loi = kiem(lt, hang);
if (loi.length) { for (const l of loi) process.stdout.write(`LECH: ${l}\n`); process.exit(1); }
console.log('moc OK');
const banSao = JSON.parse(JSON.stringify(lt));
for (const m of banSao.moc) if (String(m.ten || '').startsWith(MOC)) m.hang = m.hang.filter(x => x !== 'R2');
const do_ = kiem(banSao, hang);
if (do_.includes('R2 không ở mốc')) console.log('do OK: R2 không ở mốc');
else { console.log(`LECH: bản sao bỏ R2 khỏi mốc mà hàm kiểm không đỏ: ${JSON.stringify(do_)}`); process.exit(1); }
