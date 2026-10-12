#!/usr/bin/env node
// Đo trên kho crm thật của máy này (hồ sơ dieu-phoi-on-dinh-r2, AC-4, E4) — KHÔNG phải tệp `.test.mjs` (CI không
// có kho crm). Bản sao chia đối tượng (`git clone --shared`) của `$HOME/dev/crm-onehub` ở hai sha ghim, HOME tạm
// (LaunchAgent của máy không lọt vào), so `kiemChuyen` của gói lúc này (cây đang kiểm, suy từ vị trí tệp) với
// `kiemChuyen` của gói v2.27.0 (bản crm đang cài, `git archive`), rồi chạy `phanLopChuyen` và CLI thật.
// Kho hay sha vắng → thoát 2 «không đọc được ở đây: …» (tiền lệ esl_vi_phan_bay_kho).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const KHO = path.join(os.homedir(), 'dev', 'crm-onehub');
const SHA = { 'merge-base': 'b9a3b1609b47f175d44b9a9236b26b7cabec84af', 'đỉnh nhánh chuyển': '48703713311ab96ba33e13da20cb73fdef62a2a1' };
const MOC_CU = 'a1e2e0b9c42bfd1c0914b17816cd61bf9e08beb7';
const IMPORT_KIEM_CHEO = ['scripts/kiem-cheo/dem.mjs', 'scripts/kiem-cheo/khoa.mjs', 'scripts/kiem-cheo/test/khoa.test.mjs'];
// Đọc tay một lần trên sha ghim b9a3b160 (sha không đổi nên tập không đổi): MỌI dòng import/require tương đối giải
// vào scripts/dieu-phoi/ của ba tệp kiểm chéo. Phần chênh phải BẰNG đúng tập này (finding lượt 1, trong hợp đồng AC-4).
const CHENH_CAN = ['scripts/kiem-cheo/dem.mjs:10', 'scripts/kiem-cheo/dem.mjs:11', 'scripts/kiem-cheo/khoa.mjs:4', 'scripts/kiem-cheo/test/khoa.test.mjs:14'];
const KHAI = ['"_acceptance/chuyen-goi-dieu-phoi/**"', '_acceptance/sua-paths-e5-soan-okr/evals.yaml#E7'];

const coSha = (sha) => spawnSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: KHO }).status === 0;
if (!fs.existsSync(path.join(KHO, '.git'))) {
  process.stderr.write(`không đọc được ở đây: ${KHO}\n`);
  process.exit(2);
}
for (const sha of Object.values(SHA)) {
  if (!coSha(sha)) {
    process.stderr.write(`không đọc được ở đây: sha ${sha} vắng trong ${KHO}\n`);
    process.exit(2);
  }
}

const tam = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp8-crm-')));
process.on('exit', () => fs.rmSync(tam, { recursive: true, force: true }));
const HOME = path.join(tam, 'home');
fs.mkdirSync(HOME);
process.env.HOME = HOME;
process.env.GIT_CONFIG_GLOBAL = '/dev/null';
const goiCu = path.join(tam, 'goi-cu');
fs.mkdirSync(goiCu);
execFileSync('tar', ['-x', '-C', goiCu], { input: execFileSync('git', ['archive', MOC_CU, 'dieu-phoi'], { cwd: KIT, maxBuffer: 1 << 28 }) });
const moi = await import(pathToFileURL(path.join(GOI, 'scripts', 'kiem-chuyen.mjs')).href);
const cu = await import(pathToFileURL(path.join(goiCu, 'dieu-phoi', 'scripts', 'dieu-phoi.mjs')).href);
console.log(`nguồn: kho ${KHO} · ${Object.entries(SHA).map(([t, s]) => `${t} ${s.slice(0, 12)}`).join(' · ')} · gói lúc này ${GOI} · gói v2.27.0 ${MOC_CU.slice(0, 12)}`);

const loi = [];
const dem = (ds) => ds.reduce((m, d) => m.set(d, (m.get(d) ?? 0) + 1), new Map());
const truDaTap = (a, b) => {
  const mb = dem(b);
  const ra = [];
  for (const d of a) {
    if ((mb.get(d) ?? 0) > 0) mb.set(d, mb.get(d) - 1);
    else ra.push(d);
  }
  return ra;
};
const tomTat = (kq) => {
  const lop = {};
  for (const x of kq.lich_su) lop[x.lop] = (lop[x.lop] ?? 0) + 1;
  return `tổng ${kq.phai_sua.length + kq.lich_su.length} · phải sửa ${kq.phai_sua.length} · lịch sử ${Object.entries(lop).map(([l, k]) => `${l} ${k}`).join(' · ')}`;
};
function banSao(ten, sha) {
  const d = path.join(tam, ten.replace(/\s+/g, '-'));
  execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', KHO, d], { stdio: 'ignore' });
  execFileSync('git', ['checkout', '-q', sha], { cwd: d, stdio: 'ignore' });
  return d;
}

// Merge-base: trước khi gỡ. Một hàm kiểm cho bản lành và bản sao bị tiêm (chiều đỏ, cùng cây).
function kiemMergeBase(mod, d, nhan) {
  const ra = [];
  const kq = mod.phanLopChuyen(d);
  if (nhan) console.log(`merge-base: ${tomTat(kq)}`);
  const phai = kq.phai_sua;
  const settings = phai.filter((x) => x.startsWith('.claude/settings.json:')).length;
  if (settings !== 4) ra.push(`merge-base: ${settings} dòng phải sửa ở .claude/settings.json, cần 4`);
  if (!phai.some((x) => x.startsWith('package.json:'))) ra.push('merge-base: thiếu dòng package.json');
  for (const f of IMPORT_KIEM_CHEO) if (!phai.some((x) => x.startsWith(`${f}:`))) ra.push(`merge-base: thiếu import tương đối ${f}`);
  const dsMoi = mod.kiemChuyen(d);
  const dsCu = cu.kiemChuyen(d);
  const thieu = truDaTap(dsCu, dsMoi);
  const them = truDaTap(dsMoi, dsCu);
  if (nhan) console.log(`merge-base: kiemChuyen mới ${dsMoi.length} · v2.27.0 ${dsCu.length} · chênh thêm: ${them.join(', ') || '(rỗng)'}`);
  if (thieu.length) ra.push(`merge-base: mới thiếu dòng v2.27.0 có: ${thieu.join(', ')}`);
  if (!them.length) ra.push('merge-base: phần chênh rỗng — import tương đối không được bắt');
  const chenhSap = [...them].sort();
  if (them.length && JSON.stringify(chenhSap) !== JSON.stringify(CHENH_CAN)) ra.push(`merge-base: phần chênh ${JSON.stringify(chenhSap)} ≠ tập viết sẵn ${JSON.stringify(CHENH_CAN)}`);
  for (const x of them) {
    const [f, so] = [x.slice(0, x.lastIndexOf(':')), Number(x.slice(x.lastIndexOf(':') + 1))];
    const dong = fs.readFileSync(path.join(d, f), 'utf8').split('\n')[so - 1] ?? '';
    if (!IMPORT_KIEM_CHEO.includes(f) || !/(?:from|import|require)\s*\(?\s*['"`]\.{1,2}\//.test(dong)) ra.push(`merge-base: dòng chênh không phải import tương đối của kiểm chéo: ${x} «${dong.trim()}»`);
  }
  return ra;
}
{
  const d = banSao('merge-base', SHA['merge-base']);
  loi.push(...kiemMergeBase(moi, d, true));
  // Chiều đỏ trên CÙNG cây: bản sao gói bỏ bước quét import tương đối → phải nêu đúng lỗi.
  const sao = path.join(tam, 'goi-sao');
  fs.cpSync(GOI, sao, { recursive: true });
  const pKc = path.join(sao, 'scripts', 'kiem-chuyen.mjs');
  const goc = fs.readFileSync(pKc, 'utf8');
  const tiem = goc.replace('if (!trung && ma) {', 'if (false) {');
  if (tiem === goc) loi.push('chiều đỏ: bước tiêm không áp được');
  fs.writeFileSync(pKc, tiem);
  const loiDo = kiemMergeBase(await import(`${pathToFileURL(pKc).href}?do`), d, false);
  console.log(`chiều đỏ (bản sao bỏ quét import tương đối): ${loiDo.join(' | ') || '(im)'}`);
  if (!loiDo.includes('merge-base: phần chênh rỗng — import tương đối không được bắt')) loi.push('chiều đỏ: bản sao bị tiêm không đỏ đúng lỗi');
  // Chiều đỏ thứ hai (đẳng thức tập — finding lượt 1): bản sao chỉ bắt import tương đối ĐẦU TIÊN của mỗi tệp → hụt
  // dem.mjs:11 mà vẫn qua bốn điều kiện cũ (mỗi tệp ≥ 1 dòng, chênh khác rỗng, từng phần tử đúng dạng).
  const sao2 = path.join(tam, 'goi-sao-2');
  fs.cpSync(GOI, sao2, { recursive: true });
  const pKc2 = path.join(sao2, 'scripts', 'kiem-chuyen.mjs');
  const goc2 = fs.readFileSync(pKc2, 'utf8');
  const tiem2 = goc2.replace('if (!trung && ma) {', 'if (!trung && ma && !ra.some((x) => x.startsWith(`${nhan}:`))) {');
  if (tiem2 === goc2) loi.push('chiều đỏ 2: bước tiêm không áp được');
  fs.writeFileSync(pKc2, tiem2);
  const loiDo2 = kiemMergeBase(await import(`${pathToFileURL(pKc2).href}?do2`), d, false);
  console.log(`chiều đỏ 2 (bản sao chỉ bắt import đầu tiên mỗi tệp): ${loiDo2.join(' | ') || '(im)'}`);
  if (JSON.stringify(loiDo2) !== JSON.stringify([`merge-base: phần chênh ${JSON.stringify(CHENH_CAN.filter((x) => x !== 'scripts/kiem-cheo/dem.mjs:11'))} ≠ tập viết sẵn ${JSON.stringify(CHENH_CAN)}`])) loi.push('chiều đỏ 2: bản sao chỉ bắt import đầu tiên mỗi tệp không đỏ đúng (và chỉ) ở đẳng thức tập');
}

// Đỉnh nhánh chuyển: sau khi gỡ.
{
  const d = banSao('dinh', SHA['đỉnh nhánh chuyển']);
  const dsMoi = moi.kiemChuyen(d);
  const dsCu = cu.kiemChuyen(d);
  if (JSON.stringify(dsMoi) !== JSON.stringify(dsCu)) loi.push(`đỉnh: kiemChuyen mới (${dsMoi.length}) ≠ v2.27.0 (${dsCu.length}): thêm ${truDaTap(dsMoi, dsCu).join(', ')} · thiếu ${truDaTap(dsCu, dsMoi).join(', ')}`);
  const kq = moi.phanLopChuyen(d);
  console.log(`đỉnh nhánh chuyển: ${tomTat(kq)} · kiemChuyen mới == v2.27.0: ${JSON.stringify(dsMoi) === JSON.stringify(dsCu)}`);
  console.log(`đỉnh nhánh chuyển, không khai: phải sửa ${kq.phai_sua.join(', ')}`);
  const pE = '_acceptance/sua-paths-e5-soan-okr/evals.yaml';
  const dongE = fs.readFileSync(path.join(d, pE), 'utf8').split('\n');
  const tu = dongE.findIndex((x) => /^\s*-\s+id:\s*E7\s*$/.test(x));
  let den = dongE.findIndex((x, i) => i > tu && /^\s*-\s+id:/.test(x));
  if (den < 0) den = dongE.length;
  const trongE7 = (x) => x.startsWith(`${pE}:`) && Number(x.slice(pE.length + 1)) - 1 > tu && Number(x.slice(pE.length + 1)) - 1 < den;
  const laChuyen = (x) => x.startsWith('_acceptance/chuyen-goi-dieu-phoi/evals.yaml:');
  if (tu < 0) loi.push('đỉnh: không thấy khối E7 của sua-paths-e5-soan-okr');
  const la = kq.phai_sua.filter((x) => !laChuyen(x) && !trongE7(x));
  if (la.length) loi.push(`đỉnh: phải sửa ngoài hai nhóm đã biết: ${la.join(', ')}`);
  if (!kq.phai_sua.some(laChuyen)) loi.push('đỉnh: không có dòng nào của evals.yaml hồ sơ chuyển');
  if (!kq.phai_sua.some(trongE7)) loi.push('đỉnh: không có dòng nào của khối E7');
  // Khai ở CẢ HAI dạng viết (khối và một dòng — finding lượt 1: dạng một dòng có `#<id>` từng bị đọc thành miễn cả tệp).
  const pCfg = path.join(d, '_acceptance', 'config.yaml');
  const cfgGoc = fs.readFileSync(pCfg, 'utf8').split('\n');
  const dangKhai = { khoi: ['  lich_su:', ...KHAI.map((m) => `    - ${m}`)], 'mot-dong': [`  lich_su: [${KHAI.join(', ')}]`] };
  for (const [dang, khoi] of Object.entries(dangKhai)) {
    const cfg = [...cfgGoc];
    const i = cfg.findIndex((x) => /^dieu_phoi:\s*(#.*)?$/.test(x));
    if (i >= 0) cfg.splice(i + 1, 0, ...khoi);
    else cfg.push('dieu_phoi:', ...khoi);
    fs.writeFileSync(pCfg, cfg.join('\n'));
    const r = spawnSync(process.execPath, [path.join(GOI, 'scripts', 'dieu-phoi.mjs'), 'xem', '--kiem-chuyen'], { cwd: d, env: process.env, encoding: 'utf8' });
    const dau = r.stdout.split('\n');
    console.log(`đỉnh nhánh chuyển, khai dieu_phoi.lich_su dạng ${dang}: ${dau.slice(0, 2).join(' / ')} · thoát ${r.status}`);
    if (dau[0] !== 'kiem-chuyen: sach' || r.status !== 0) loi.push(`đỉnh + khai dạng ${dang}: CLI in «${dau[0]}», thoát ${r.status}${r.stderr ? ` · ${r.stderr.trim()}` : ''}`);
  }
}

for (const l of loi) console.log(`LỖI ${l}`);
console.log(loi.length ? `dp8-crm-that: ĐỎ (${loi.length})` : 'dp8-crm-that: xanh');
process.exit(loi.length ? 1 : 0);
