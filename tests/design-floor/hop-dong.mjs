#!/usr/bin/env node
// Bộ đo hành vi của hợp đồng nhập design-floor (design-floor/HOP-DONG-NHAP.md), chạy trên BẢN GÓI giao
// đi (design-floor/dist/ui.mjs = vỏ của kit + bản vendored đã vá) — thước gắn vào đúng vật kho tiêu thụ nhận. Mỗi phép đo có đối chứng: đối chứng hỏng là FAIL bất kể
// giới hạn đã khai, vì khi đó phép đo không phân biệt được «bắt đúng» với «chưa chạy».
// Fixture do mã sinh trong chính lượt chạy, mỗi phép đo một hộp cát:
//   <hộp>/home          HOME của lượt chạy (bắt ghi vào ~/.ease-design)
//   <hộp>/outer/design/ thư mục design/ ở THƯ MỤC CHA — hình dạng kho tiêu thụ đặt DS ở design/
//   <hộp>/outer/proj/   cwd; mọi đích và --tokens nằm ở đây, truyền bằng đường tương đối
//
// Dùng: node tests/design-floor/hop-dong.mjs [--hop-dong <md>] [--goc <gốc kit>] [--ui <bản gói>] [--chi DF-01,DF-07]
// Thoát 0 khi mọi phép đo PASS/XFAIL; 1 khi có FAIL/XPASS; 2 khi thiếu bản gói.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { docDoiSo, docHopDong, inKetQua, phanXu, soVaTai } from './lib/hop-dong.mjs';

const ds = docDoiSo(process.argv.slice(2));
const hd = docHopDong(ds.hopDong);
const MA = hd.ma_thoat;
const CHAN_MANG = pathToFileURL(new URL('./lib/chan-mang.mjs', import.meta.url).pathname).href;
const TMP = mkdtempSync(join(tmpdir(), 'design-floor-df-'));
const NET_LOG = join(TMP, 'net.log');

const CLI = ds.ui || join(ds.goc, hd.vendor.ban_goi);
if (!existsSync(CLI)) {
  console.error(`hop-dong: thiếu bản gói ${CLI} — chạy: node tests/design-floor/dong-bo.mjs --write`);
  process.exit(2);
}
const SO = soVaTai(hd, ds.goc);

// ── Fixture (mã sinh) ────────────────────────────────────────────────────────
const HEAD = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
const trang = (style, body) =>
  `<!doctype html>\n<html lang="en">\n<head>${HEAD}<title>Report</title><style>${style}</style></head>\n<body><main>${body}</main></body>\n</html>\n`;
const THAN = '<p class="eyebrow">Overview</p><h1>Quarterly report</h1><p>Revenue grew in every region this quarter.</p>';
const LAYOUT = `export default function RootLayout() {
  return (
    <html lang="en">
      <head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Orders</title></head>
      <body><main><h1>Orders</h1><p>Every order placed this week.</p></main></body>
    </html>
  );
}
`;
const BANG = '| Slot | Rung | Use | Reason |\n|---|---|---|---|\n';
const FIXTURE = {
  'tokens.json': JSON.stringify({ color: { muted: { $type: 'color', $value: '#888888' }, ink: { $type: 'color', $value: '#111111' }, paper: { $type: 'color', $value: '#ffffff' } } }),
  // #888 trên nền KHÔNG khai: tương phản không tính được → phải là KHÔNG-ĐO-ĐƯỢC.
  'eyebrow.html': trang('.eyebrow{color:#888888}', THAN),
  // Đối chứng: cùng trang, nền trắng khai rõ → 3,54:1 < 4,5:1, lỗi thật gate PHẢI thấy.
  'eyebrow-nen.html': trang('body{background:#ffffff}.eyebrow{color:#888888}', THAN),
  'layout.tsx': LAYOUT,
  'layout.html': LAYOUT,
  'trong.html': `<!doctype html>\n<html lang="en">\n<head>${HEAD}<title>Plain</title></head>\n<body><main><h1>Plain</h1><p>No styles at all.</p></main></body>\n</html>\n`,
  'raw.html': trang('h1{color:#123456;margin:13px}', '<h1>Raw</h1><p>Hardcoded values.</p>'),
  'fixme.html': `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Fix</title></head><body><main><h1>Fix</h1><p>Body copy.</p></main></body></html>\n`,
  'reg.json': JSON.stringify({ version: '0.1.0', components: [{ name: 'Page header/Default', category: 'layout', markup: '<header></header>', tokensUsed: ['color.ink'] }] }),
  'plan.md': `## Screen: Home\nPattern: none — single screen\n\n${BANG}| header | 3 | Page header/Default | — |\n| tint | 6 | color.muted | — |\n`,
  'plan-loi.md': `## Screen: Home\nPattern: none — single screen\n\n${BANG}| header | 3 | Ghost header | — |\n`,
  'flow.json': JSON.stringify({ screens: [{ id: 'a' }, { id: 'b', terminal: true }], transitions: [{ id: 't1', from: 'a', to: 'b', trigger: 'click' }], entryPoints: [{ id: 'e', screen: 'a' }] }),
};

function hopCat({ design = false, moi = false } = {}) {
  const R = mkdtempSync(join(TMP, 'hop-'));
  mkdirSync(join(R, 'home'));
  mkdirSync(join(R, 'outer', 'proj'), { recursive: true });
  for (const [ten, noi] of Object.entries(FIXTURE)) writeFileSync(join(R, 'outer', 'proj', ten), noi);
  if (design || moi) mkdirSync(join(R, 'outer', 'design'));
  if (moi) {
    // Mồi: một design system thật sự dò được ở thư mục cha (manifest + token khác hẳn).
    writeFileSync(join(R, 'outer', 'design', 'ds.manifest.json'), JSON.stringify({ name: 'moi', version: 1 }));
    writeFileSync(join(R, 'outer', 'design', 'design.tokens.json'), JSON.stringify({ color: { moi: { $type: 'color', $value: '#123456' } } }));
  }
  return R;
}

// Lời gọi rút từ argv mẫu của hợp đồng: {dich} {tokens} {registry}; `bo` gỡ cặp cờ+giá trị.
function goi(R, lenh, { dich, bo = [], them = [], ghi = false } = {}) {
  const l = hd.lenh[lenh];
  const mau = ghi ? l.argv_ghi : l.argv;
  const gia = { dich, tokens: 'tokens.json', registry: 'reg.json' };
  const argv = [];
  for (let i = 0; i < mau.length; i++) {
    const m = /^\{(\w+)\}$/.exec(mau[i + 1] || '');
    if (mau[i].startsWith('--') && m && bo.includes(m[1])) { i++; continue; }
    argv.push(mau[i].replace(/^\{(\w+)\}$/, (_, k) => gia[k]));
  }
  argv.push(...them);
  const r = spawnSync(process.execPath, ['--import', CHAN_MANG, CLI, ...argv], {
    cwd: join(R, 'outer', 'proj'),
    encoding: 'utf8',
    env: { ...process.env, ...hd.moi_truong, HOME: join(R, 'home'), DF_NET_LOG: NET_LOG },
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* không phải JSON — để phép đo tự xử */ }
  return { ec: r.status, out: (r.stdout || '').split(R).join('<HOP>'), err: r.stderr || '', json, d: json?.data || {} };
}

// Danh sách thư mục + băm từng tệp của CẢ hộp cát (dự án, thư mục cha, HOME).
function anh(R) {
  const out = new Map();
  (function di(d, rel) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      const r = rel ? `${rel}/${e}` : e;
      if (statSync(p).isDirectory()) { out.set(r, 'd'); di(p, r); } else out.set(r, createHash('sha256').update(readFileSync(p)).digest('hex'));
    }
  })(R, '');
  return out;
}
function khacAnh(a, b) {
  const d = [];
  for (const [k, v] of b) if (!a.has(k)) d.push(`+${k}`); else if (a.get(k) !== v) d.push(`~${k}`);
  for (const k of a.keys()) if (!b.has(k)) d.push(`-${k}`);
  return d.sort();
}

const coLoi = {
  gate: (j) => j.d.errorCount > 0,
  'token-coverage': (j) => (j.d.overall?.coverage ?? j.d.overall) < j.d.floor,
  'reuse-plan check': (j) => j.d.errorCount > 0,
  'flow lint': (j) => j.d.errorCount > 0,
};
const LOI = { gate: 'eyebrow-nen.html', 'token-coverage': 'raw.html', 'reuse-plan check': 'plan-loi.md', 'flow lint': 'flow.json' };
const SACH = { gate: 'eyebrow-nen.html', 'token-coverage': 'raw.html', 'reuse-plan check': 'plan.md', 'flow lint': 'flow.json' };
const DUOI = { gate: 'html', 'token-coverage': 'html', 'reuse-plan check': 'md', 'flow lint': 'json' };
const CHAM = Object.keys(hd.lenh).filter((k) => hd.lenh[k].vai === 'cham');
const CO_TOKENS = CHAM.filter((k) => hd.lenh[k].argv.includes('{tokens}'));

const PHEP_DO = [
  ['DF-01', 'tương phản không tính được (nền không khai) → KHÔNG-ĐO-ĐƯỢC', () => {
    const R = hopCat();
    const dc = goi(R, 'gate', { dich: 'eyebrow-nen.html' });
    const thay = Object.values(dc.d.families || {}).flatMap((f) => f.findings).some((f) => f.checkId === 'low-contrast');
    if (!thay) return { hong: `nền khai rõ mà gate không ra low-contrast (thoát ${dc.ec})` };
    const r = goi(R, 'gate', { dich: 'eyebrow.html' });
    return { do: r.ec !== MA.NOT_MEASURABLE, chi_tiet: `gate thoát ${r.ec} (muốn ${MA.NOT_MEASURABLE}) · pass=${r.d.pass} · partial=${(r.d.partial || []).length}` };
  }],
  ['DF-02', 'design system mồi ở thư mục cha không đổi kết quả của lời gọi theo hợp đồng', () => {
    const A = hopCat({ design: true });
    const B = hopCat({ moi: true });
    const dc = goi(B, 'gate', { dich: 'eyebrow-nen.html', bo: ['tokens'] });
    const src = dc.d.tokenCoverageSource || {};
    if (src.origin !== 'auto' || !String(src.path).includes('outer/design')) return { hong: `mồi không dò được (origin=${src.origin}) — phép đo không thể đỏ` };
    const lech = [];
    for (const k of CHAM) {
      const a = goi(A, k, { dich: SACH[k] });
      const b = goi(B, k, { dich: SACH[k] });
      if (a.ec !== b.ec || a.out !== b.out) lech.push(`${k} (${a.ec}→${b.ec})`);
    }
    return { do: lech.length > 0, chi_tiet: `kết quả đổi theo mồi: ${lech.join(', ')}` };
  }],
  ['DF-03', 'thiếu --tokens/--file là sai cú pháp, không tự dò', () => {
    const R = hopCat({ moi: true });
    const ra = [];
    for (const k of CO_TOKENS) ra.push([`${k} -tokens`, goi(R, k, { dich: SACH[k], bo: ['tokens'] }).ec]);
    for (const k of CHAM.filter((x) => hd.lenh[x].argv.includes('{registry}'))) ra.push([`${k} -file`, goi(R, k, { dich: SACH[k], bo: ['registry'] }).ec]);
    const sai = ra.filter(([, ec]) => ec !== MA.SAI_CU_PHAP);
    return { do: sai.length > 0, chi_tiet: `${sai.map(([t, ec]) => `${t}=${ec}`).join(' · ')} (muốn ${MA.SAI_CU_PHAP})` };
  }],
  ['DF-04', 'thiếu tệp · sai đối số · có lỗi → ba mã thoát riêng', () => {
    const R = hopCat();
    const muon = `${MA.THIEU_TEP}/${MA.SAI_CU_PHAP}/${MA.FAIL}`;
    const ra = [];
    for (const k of CHAM) {
      const loi = goi(R, k, { dich: LOI[k] });
      if (!coLoi[k](loi)) return { hong: `${k} ${LOI[k]} không ra lỗi nào — ca «có lỗi» không có lỗi` };
      const tep = goi(R, k, { dich: `khong-co.${DUOI[k]}` }).ec;
      const cu = goi(R, k, { dich: SACH[k], them: ['--bogus-flag'] }).ec;
      ra.push(`${k} ${tep}/${cu}/${loi.ec}`);
    }
    return { do: ra.some((x) => !x.endsWith(` ${muon}`)), chi_tiet: `${ra.join(' · ')} (muốn ${muon})` };
  }],
  ['DF-05', 'đích .tsx không bao giờ PASS', () => {
    const R = hopCat();
    const dc = goi(R, 'gate', { dich: 'layout.html' });
    if (dc.ec !== MA.PASS) return { hong: `cùng nội dung đuôi .html không PASS (thoát ${dc.ec}) — đỏ sẽ không do đuôi tệp` };
    const ra = ['gate', 'token-coverage'].map((k) => `${k} .tsx thoát ${goi(R, k, { dich: 'layout.tsx' }).ec}`);
    return { do: ra.some((x) => !x.endsWith(` ${MA.NOT_MEASURABLE}`)), chi_tiet: `${ra.join(' · ')} (muốn ${MA.NOT_MEASURABLE})` };
  }],
  ['DF-06', 'không có gì để đo → KHÔNG-ĐO-ĐƯỢC, không phải 100 %', () => {
    const R = hopCat();
    const dc = goi(R, 'token-coverage', { dich: 'raw.html' });
    if (!coLoi['token-coverage'](dc)) return { hong: 'trang có hex thô mà token-coverage không thấy giá trị thô nào' };
    const r = goi(R, 'token-coverage', { dich: 'trong.html' });
    return { do: r.ec !== MA.NOT_MEASURABLE, chi_tiet: `token-coverage trang không CSS thoát ${r.ec} (muốn ${MA.NOT_MEASURABLE}) · coverage=${r.d.overall?.coverage ?? r.d.overall}` };
  }],
  ['DF-07', 'lệnh chấm không ghi tệp nào (dự án · thư mục cha · HOME)', () => {
    const tu = hopCat();
    const a = anh(tu);
    writeFileSync(join(tu, 'outer', 'design-cam.txt'), 'x');
    if (!khacAnh(a, anh(tu)).length) return { hong: 'phép chụp không thấy một tệp vừa ghi' };
    const ra = [];
    for (const k of Object.keys(hd.lenh)) {
      const R = hopCat({ design: true });
      const truoc = anh(R);
      goi(R, k, { dich: SACH[k] || 'fixme.html' });
      const d = khacAnh(truoc, anh(R));
      if (d.length) ra.push(`${k}: ${d.join(' ')}`);
    }
    return { do: ra.length > 0, chi_tiet: ra.join(' · ') };
  }],
  ['DF-08', 'autofix --write chỉ ghi đúng tệp đích', () => {
    const R = hopCat({ design: true });
    const truoc = anh(R);
    goi(R, 'autofix', { dich: 'fixme.html', ghi: true });
    const d = khacAnh(truoc, anh(R));
    if (!d.includes('~outer/proj/fixme.html')) return { hong: `autofix --write không sửa đích (${d.join(' ') || 'không đổi gì'})` };
    const thua = d.filter((x) => x !== '~outer/proj/fixme.html');
    return { do: thua.length > 0, chi_tiet: `ngoài đích: ${thua.join(' ')}` };
  }],
  ['DF-09', 'không lệnh v1 nào gọi mạng', () => {
    const tu = spawnSync(process.execPath, ['--import', CHAN_MANG, '-e',
      "try{fetch('http://example.invalid')}catch{};try{require('net').connect(80,'example.invalid')}catch{};try{require('dns').lookup('example.invalid',()=>{})}catch{}"],
      { encoding: 'utf8', env: { ...process.env, DF_NET_LOG: join(TMP, 'tu-thu.log') } });
    let tuLog = '';
    try { tuLog = readFileSync(join(TMP, 'tu-thu.log'), 'utf8'); } catch { /* không ghi = bộ chặn hỏng */ }
    if (!/fetch/.test(tuLog) || !/net\./.test(tuLog) || !/dns\./.test(tuLog)) return { hong: `bộ chặn mạng không bắt fetch/net/dns (log: ${tuLog.trim() || 'rỗng'}; thoát ${tu.status})` };
    rmSync(NET_LOG, { force: true });
    const R = hopCat({ design: true });
    for (const k of Object.keys(hd.lenh)) goi(R, k, { dich: SACH[k] || 'fixme.html' });
    goi(R, 'autofix', { dich: 'fixme.html', ghi: true });
    let log = '';
    try { log = readFileSync(NET_LOG, 'utf8').trim(); } catch { /* rỗng */ }
    return { do: log.length > 0, chi_tiet: `đường mạng bị gọi: ${log.split('\n').join(', ')}` };
  }],
];

console.log(`hop-dong: ui = ${ds.ui ? CLI : hd.vendor.ban_goi} (bản vendored ${hd.nguon.repo} @ ${hd.nguon.commit.slice(0, 7)} + bản vá ${SO.ban_va.filter((d) => d.trang_thai === 'da-ap').map((d) => d.id).join(', ') || '(không)'})`);
let ok = true;
for (const [id, ten, chay] of PHEP_DO) {
  if (ds.chi && !ds.chi.has(id)) continue;
  let kq;
  try { kq = chay(); } catch (e) { kq = { hong: `ném lỗi: ${e.message}` }; }
  ok = inKetQua(id, ten, phanXu(hd, id, kq, SO), kq.do ? kq.chi_tiet : '') && ok;
}
rmSync(TMP, { recursive: true, force: true });
console.log(ok ? 'hop-dong: XANH (gồm giới hạn đã khai)' : 'hop-dong: ĐỎ');
process.exit(ok ? 0 : 1);
