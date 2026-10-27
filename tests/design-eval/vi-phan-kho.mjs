#!/usr/bin/env node
// Vi phân bản gốc ↔ bản mới của cổng thiết kế chế độ dom trên các kho tiêu thụ của máy (hồ sơ
// design-gate-khong-do-duoc-ba-nguyen-nhan, AC-8 E8b). Chỉ đọc kho; chỉ in SỐ — không in đường dẫn hay nội dung
// tệp của kho (kho kit công khai).
//
//   node tests/design-eval/vi-phan-kho.mjs        # KHO_GOC=<thư mục chứa các kho>, mặc định ~/dev
//
// Đích dom của một kho = (a) mọi .html/.htm dưới _acceptance/*/evidence/; (b) tệp nêu trong lệnh của khoá
// executors.design.* trong _acceptance/config.yaml có gọi design-gate.mjs mà không --mode static; (c) tệp trong
// `paths:` của eval gọi đúng `config:executors.design.gate`. Thoát 0 khi đủ ba kho, mọi đích được CẢ HAI bản đo ra một
// phán quyết thật (PASS · REJECT · KHONG-DO-DUOC) và không đích nào đổi · 1 khi có đích đổi · 2 khi thiếu kho, hoặc có đích
// mà một bản không đo được (BLOCKED vì thiếu jsdom, sập, hết giờ) — «đổi 0» khi cổng chưa chạy không phải kết quả.
// VI_PHAN_JSDOM=<thư mục> đổi chỗ nạp jsdom (mặc định thư mục của tệp này) — ca KD9-vi-phan-mu trỏ một thư mục rỗng.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const GOC_SHA = '2c90e4ca3a096abf79f2efa8216c355952594ada'; // cùng bản gốc với khong-do-duoc.test.mjs
const KHO = ['crm', 'artifact-platform', 'onehub-invest'];
const LY_DO = ['css-khong-ap-duoc', 'nen-to-tien-bi-bo', 'chu-gradient'];
const DUOI = /\.(html?|tsx|jsx)$/i;
const PHAN_QUYET = new Set(['PASS', 'REJECT', 'KHONG-DO-DUOC']);
const JSDOM_DIR = process.env.VI_PHAN_JSDOM || HERE;

const khoGoc = process.env.KHO_GOC || path.join(os.homedir(), 'dev');

function dichCuaKho(kho) {
  const ra = new Set();
  const acc = path.join(kho, '_acceptance');
  for (const ho of fs.existsSync(acc) ? fs.readdirSync(acc) : []) {
    const ev = path.join(acc, ho, 'evidence');
    if (fs.existsSync(ev) && fs.statSync(ev).isDirectory()) {
      for (const t of fs.readdirSync(ev)) if (/\.html?$/i.test(t)) ra.add(path.join(ev, t));
    }
    const evals = path.join(acc, ho, 'evals.yaml');
    if (!fs.existsSync(evals)) continue;
    for (const khoi of fs.readFileSync(evals, 'utf8').split(/\n\s*- id:/)) {
      if (!/cmd:\s*config:executors\.design\.gate\s*$/m.test(khoi)) continue;
      const p = /paths:\s*\[([^\]]*)\]/.exec(khoi);
      const muc = p ? p[1].split(',') : [...khoi.matchAll(/^\s+-\s+["']?([^"'\n]+)["']?\s*$/gm)].map((m) => m[1]);
      for (const m of muc) { const t = m.trim().replace(/^["']|["']$/g, ''); if (DUOI.test(t)) ra.add(path.join(kho, t)); }
    }
  }
  const cfg = path.join(acc, 'config.yaml');
  if (fs.existsSync(cfg)) {
    for (const dong of fs.readFileSync(cfg, 'utf8').split('\n')) {
      if (!/design-gate\.mjs/.test(dong) || /--mode\s+static/.test(dong)) continue;
      for (const m of dong.matchAll(/[\w./@[\]()-]+\.(?:html?|tsx|jsx)\b/gi)) ra.add(path.join(kho, m[0]));
    }
  }
  return [...ra].filter((t) => fs.existsSync(t) && fs.statSync(t).isFile());
}

let dang = 0;
const cho = [];
function cong(goc, dich) {
  return new Promise((xong) => {
    const chay = () => {
      dang++;
      execFile(process.execPath, [path.join(goc, 'scripts', 'design-gate.mjs'), dich, '--jsdom', JSDOM_DIR],
        { maxBuffer: 64 * 1024 * 1024, timeout: 180000 }, (_loi, stdout) => {
          dang--;
          let j = null;
          try { j = JSON.parse(stdout); } catch { /* verdict LOI bên dưới */ }
          xong(j);
          if (cho.length) cho.shift()();
        });
    };
    if (dang < 6) chay(); else cho.push(chay);
  });
}

const thieu = KHO.filter((k) => !fs.existsSync(path.join(khoGoc, k, '_acceptance')));
for (const k of thieu) console.log(`không đọc được ở đây: ${k} (dưới ${khoGoc === path.join(os.homedir(), 'dev') ? '~/dev' : 'KHO_GOC'})`);
if (thieu.length) process.exit(2);

const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kdd-vi-phan-'));
const goc = path.join(tam, 'goc');
fs.mkdirSync(goc);
execFileSync('bash', ['-c', 'git -C "$1" archive "$2" lib vendor scripts | tar -x -C "$3"', '_', ROOT, GOC_SHA, goc]);

let tongDich = 0, tongDoi = 0, tongMu = 0;
for (const ten of KHO) {
  const kho = path.join(khoGoc, ten);
  let sha = '?';
  try { sha = execFileSync('git', ['-C', kho, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim().slice(0, 8); } catch { /* không phải kho git */ }
  const dich = dichCuaKho(kho);
  const kq = await Promise.all(dich.map(async (d) => ({ cu: await cong(goc, d), moi: await cong(ROOT, d) })));
  let doi = 0, tuongPhanGoc = 0, mu = 0;
  const dem = Object.fromEntries(LY_DO.map((m) => [m, 0]));
  for (const { cu, moi } of kq) {
    if (!PHAN_QUYET.has(cu?.verdict) || !PHAN_QUYET.has(moi?.verdict)) { mu++; continue; }
    if (cu.verdict !== moi.verdict) doi++;
    tuongPhanGoc += (cu?.findings || []).filter((f) => f.rule === 'low-contrast').length;
    const ma = new Set((moi?.findings || []).filter((f) => f.do_duoc === false).flatMap((f) => f.ly_do || []));
    for (const m of ma) if (m in dem) dem[m]++;
  }
  tongDich += dich.length;
  tongDoi += doi;
  tongMu += mu;
  console.log(`kho ${ten} @${sha}: ${dich.length} đích dom · đổi phán quyết ${doi} · lý do mới {${LY_DO.map((m) => `${m}: ${dem[m]}`).join(', ')}} · tương phản ở bản gốc ${tuongPhanGoc}${mu ? ` · không đo được ${mu}` : ''}`);
}
fs.rmSync(tam, { recursive: true, force: true });
console.log(`vi phân: ${tongDich} đích · đổi ${tongDoi}`);
if (tongMu) { console.log(`không đo được ở đây: ${tongMu} đích — cổng không ra phán quyết ở một trong hai bản (jsdom, sập, hết giờ)`); process.exit(2); }
process.exit(tongDoi ? 1 : 0);
