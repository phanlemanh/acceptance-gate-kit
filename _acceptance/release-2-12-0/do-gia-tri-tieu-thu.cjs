#!/usr/bin/env node
'use strict';
/**
 * do-gia-tri-tieu-thu.cjs — đo GIÁ TRỊ mốc này mang tới KHO TIÊU THỤ, theo kho.
 *
 * Vì sao tồn tại: bản đầu của hợp đồng khẳng định «493 hồ sơ · 27 đọc thêm · 253
 * tiêu chí» bằng một dòng chữ «đo trên hồ sơ thật của tám kho, ngày 13/09» — không
 * lệnh, không script, không sha. Đó là ba con số DUY NHẤT nối mốc này với north
 * star («nêu được người hưởng cụ thể»), nên chúng phải tái hiện được.
 *
 *   node do-gia-tri-tieu-thu.cjs [--dev <thư mục kho>] [--ag-root <cây thư viện>]
 *                               [--json] [--ghim <tổng tiêu chí>]
 *
 * BÊN ĐỌC CŨ dựng bằng CHÍNH thư viện hiện tại, đi đường hẹp `section(t,'Criteria')`
 * + `parseAC` từng dòng — đó đúng là đường mọi bên gọi đi TRƯỚC vòng
 * `cong-nguoi-doc-du-nguon`, và đường đó không đổi trong vòng ấy. Không dựng bản
 * sao cây cũ ở đây: bán kính cần đo là «bộ bóc RỘNG thấy thêm bao nhiêu so bộ bóc
 * HẸP», không phải «cây mới khác cây cũ chỗ nào».
 *
 * `--ghim <n>` biến script thành RĂNG: tổng tiêu chí đọc thêm phải bằng đúng n,
 * lệch thì thoát 5 kèm cả hai số. Dùng cho eval của hồ sơ mốc.
 *
 * Mọi đường dẫn suy từ vị trí tệp này; gốc corpus không suy được nên mặc định
 * `~/dev`, đổi bằng `--dev`.
 * exit 0 = đo được · 2 = nguồn thiếu · 3 = usage · 5 = lệch số đã ghim.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const HO_SO = path.dirname(__filename);
const CAY = path.resolve(HO_SO, '..', '..');

function usage(m) { process.stderr.write(`do-gia-tri-tieu-thu: ${m}\n`); process.exit(3); }
const o = { dev: path.join(os.homedir(), 'dev'), agRoot: CAY, json: false, ghim: null };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--dev') o.dev = path.resolve(process.argv[++i]);
  else if (a === '--ag-root') o.agRoot = path.resolve(process.argv[++i]);
  else if (a === '--json') o.json = true;
  else if (a === '--ghim') o.ghim = Number(process.argv[++i]);
  else usage(`cờ lạ ${a}`);
}

let acLine, mdSec;
try {
  acLine = require(path.join(o.agRoot, 'lib/ac-line.cjs'));
  mdSec = require(path.join(o.agRoot, 'lib/md-section.cjs'));
} catch (e) { process.stderr.write(`do-gia-tri-tieu-thu: không nạp được thư viện ở ${o.agRoot}: ${e.message}\n`); process.exit(2); }
if (typeof acLine.parseACBlock !== 'function') { process.stderr.write('do-gia-tri-tieu-thu: lớp này chưa có parseACBlock — không có gì để so\n'); process.exit(2); }

// Kho TIÊU THỤ: có `_acceptance/` và KHÔNG phải chính kho kit (kit không tự tiêu thụ).
const laKit = (d) => fs.existsSync(path.join(d, '.claude-plugin', 'plugin.json'));
const kho = [];
for (const ten of fs.readdirSync(o.dev).sort()) {
  const d = path.join(o.dev, ten);
  if (!fs.existsSync(path.join(d, '_acceptance'))) continue;
  if (laKit(d)) continue;
  let sha = null, goc = null;
  try { sha = cp.execFileSync('git', ['-C', d, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* không phải kho git */ }
  // GOM THEO KHO GỐC: nhiều cây dưới ~/dev là bản sao/nhánh của CÙNG một sản phẩm
  // (ap-people-rights, ap-trigger-axis, artifact-platform-h6p1-* …). Đếm chúng như
  // các kho riêng làm số phồng lên gấp bốn — đúng lớp «con số không có lệnh sinh ra»
  // mà script này đi chữa, nên nó phải tự phân biệt được.
  try { goc = cp.execFileSync('git', ['-C', d, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim().replace(/\.git$/, '').replace(/^.*[/:]/, ''); } catch { goc = null; }
  kho.push({ ten, dir: d, sha, goc: goc || ten });
}

const hang = [];
let tongHs = 0, tongThem = 0, tongTc = 0;
for (const k of kho) {
  const acc = path.join(k.dir, '_acceptance');
  let hs = 0, them = 0, tc = 0;
  for (const slug of fs.readdirSync(acc)) {
    const f = path.join(acc, slug, 'contract.md');
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    hs += 1;
    const hep = [];
    for (const l of mdSec.section(t, 'Criteria')) { const a = acLine.parseAC(l); if (a) hep.push(a.id); }
    const rong = acLine.parseACBlock(t).map(a => a.id);
    if (rong.length > hep.length) { them += 1; tc += rong.length - hep.length; }
  }
  tongHs += hs; tongThem += them; tongTc += tc;
  hang.push({ kho: k.ten, goc: k.goc, sha: k.sha, hoSo: hs, docThem: them, tieuChi: tc });
}

// Một cây ĐẠI DIỆN cho mỗi kho gốc: cây có nhiều hồ sơ nhất (bản sao thường tụt lại).
const theoGoc = new Map();
for (const h of hang) {
  const cu = theoGoc.get(h.goc);
  if (!cu || h.hoSo > cu.hoSo) theoGoc.set(h.goc, h);
}
const goc = [...theoGoc.values()].filter(h => h.hoSo > 0).sort((a, b) => b.tieuChi - a.tieuChi);
const gHs = goc.reduce((s, h) => s + h.hoSo, 0);
const gThem = goc.reduce((s, h) => s + h.docThem, 0);
const gTc = goc.reduce((s, h) => s + h.tieuChi, 0);
const ket = { lopDo: o.agRoot, soCay: kho.length, soKhoGoc: goc.length, cay: { hoSo: tongHs, docThem: tongThem, tieuChi: tongTc }, khoGoc: { hoSo: gHs, docThem: gThem, tieuChi: gTc }, theoKhoGoc: goc, theoCay: hang };
if (o.json) process.stdout.write(JSON.stringify(ket, null, 2) + '\n');
else {
  process.stdout.write(`| Kho gốc | cây đại diện | sha | Hồ sơ | Đọc thêm | Tiêu chí cứu được |\n|---|---|---|---:|---:|---:|\n`);
  for (const h of goc) process.stdout.write(`| ${h.goc} | ${h.kho} | \`${h.sha || '—'}\` | ${h.hoSo} | ${h.docThem} | ${h.tieuChi} |\n`);
  process.stdout.write(`| **TỔNG (${goc.length} kho gốc)** | | | **${gHs}** | **${gThem}** | **${gTc}** |\n`);
  process.stdout.write(`\n${kho.length} cây mang hồ sơ dưới ${o.dev}; gom theo kho gốc còn ${goc.length} kho có hồ sơ.\n`);
}
if (o.ghim !== null && gTc !== o.ghim) {
  process.stderr.write(`DO: tong tieu chi doc them (theo KHO GỐC) = ${gTc}, so da ghim = ${o.ghim}\n`);
  process.exit(5);
}
