// dai-tom-tat-crm.mjs — hồ sơ dai-tom-tat-doc-dung, ca DT-9: ba ô dải tóm tắt trên dữ liệu THẬT của crm.
// KHÔNG mang đuôi .test.mjs: cần kho crm trên máy (biến CRM_ROOT, mặc định ~/dev/crm) nên không vào suite —
// thiếu kho hay commit thì ĐỎ nêu «crm», không bỏ qua. Bản sao crm dựng bằng `git archive` commit ghim
// 27d47de04 (bản đo 12/10 của LT1b) vào thư mục tạm; vẽ bằng cây đang kiểm (đường suy từ vị trí tệp này)
// và bằng bản base 7f65e5a0 (`git archive` TRỌN thư mục scripts lib skills) — phép đo phải phân biệt được.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const CRM = process.env.CRM_ROOT || path.join(homedir(), 'dev', 'crm');
const CRM_SHA = '27d47de04';
const BASE_SHA = '7f65e5a0';
const LT1_PROD = 'đã triển khai — gộp vào onehub 2026-10-10; chưa ai ghi đã thấy chạy ở production';
const TMP = mkdtempSync(path.join(tmpdir(), 'dai-tom-tat-crm-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const ketThuc = () => { rmSync(TMP, { recursive: true, force: true }); console.log(`\nResults: ${pass} passed, ${fail} failed (dai-tom-tat-crm)`); process.exit(fail ? 1 : 0); };

function giai(repo, sha, dich, thuMuc = []) {
  mkdirSync(dich, { recursive: true });
  const tar = execFileSync('git', ['-C', repo, 'archive', '--format=tar', sha, ...thuMuc], { maxBuffer: 1 << 30 });
  execFileSync('tar', ['-x', '-C', dich], { input: tar, maxBuffer: 1 << 30 });
}
const crm = path.join(TMP, 'crm'); const base = path.join(TMP, 'base');
// Bản sao crm là một bản clone --shared (đọc đối tượng của kho crm, không ghi gì vào kho crm) đứng ở commit
// ghim; mọi nhánh xa bị xoá và nhánh `onehub` ghim vào CHÍNH commit đó — phép suy «đã triển khai» tất định.
const g = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).trim();
try {
  execFileSync('git', ['clone', '-q', '--no-checkout', '--shared', CRM, crm], { stdio: 'ignore' });
  g(crm, 'checkout', '-q', '--detach', CRM_SHA);
  for (const r of g(crm, 'for-each-ref', '--format=%(refname)', 'refs/remotes').split('\n').filter(Boolean)) g(crm, 'update-ref', '-d', r);
  g(crm, 'branch', '-f', 'onehub', CRM_SHA);
} catch (e) { bad('DT-9', `không dựng được bản sao crm ${CRM_SHA} từ ${CRM}: ${String(e.message).split('\n')[0]}`); ketThuc(); }
const CFG = path.join(crm, '_acceptance', 'config.yaml'); const cfgGoc = readFileSync(CFG, 'utf8');
try { giai(KIT, BASE_SHA, base, ['scripts', 'lib', 'skills']); } catch (e) { bad('DT-9', `không dựng được bản base ${BASE_SHA}: ${String(e.message).split('\n')[0]}`); ketThuc(); }

const { docDuLieu } = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
// Vẽ bản sao crm bằng `kit`, đọc khối; trả { hang (mọi hàng có tom_tat), khoi }.
function ve(kit) {
  const x = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', crm], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (x.status !== 0) throw new Error(`product-map (${kit === KIT ? 'cây đang kiểm' : 'base'}) exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  const html = readFileSync(path.join(crm, 'LO-TRINH.html'), 'utf8');
  const raw = JSON.parse(html.match(/<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/)[1]);
  const { duLieu } = docDuLieu(html);
  return { hang: duLieu.lo_trinh.flatMap(t => t.hang).filter(h => h.tom_tat), raw };
}
const ketHaiCham = v => /:$/.test(String(v || '').replace(/[*_\s]+$/, ''));
const dem = hang => ({
  co: hang.length,
  chuaGhi: hang.filter(h => /chưa ghi quan sát/.test(h.tom_tat.moi_nguoi.production || '')).length,
  cut: hang.filter(h => ketHaiCham(h.tom_tat.moi_nguoi.vi_sao)).length,
  dai: hang.filter(h => String(h.tom_tat.moi_nguoi.vi_sao || '').length > 400).length,
  ngoaiHD: hang.filter(h => /ngoài hợp đồng/.test(h.tom_tat.moi_nguoi.chua_lam || '')).length,
  lt1: (hang.find(h => h.ma === 'LT1') || { tom_tat: { moi_nguoi: {} } }).tom_tat.moi_nguoi.chua_lam,
});
// Khuôn khối: phien_ban + tập khoá và kiểu từng khoá của mọi tom_tat (khối thô, chưa qua bộ đọc).
const khuon = raw => {
  const k = new Set();
  for (const t of raw.lo_trinh) for (const h of t.hang) if (h.tom_tat) for (const nhom of ['moi_nguoi', 'chu_kho']) for (const [o, v] of Object.entries(h.tom_tat[nhom] || {})) k.add(`${nhom}.${o}:${v === null ? 'null' : typeof v}`);
  return JSON.stringify({ phien_ban: raw.phien_ban, nhom: Object.keys(raw.lo_trinh[0].hang.find(h => h.tom_tat).tom_tat), khoa: [...k].sort() });
};

const loaiProd = hang => { const o = {}; for (const h of hang) { const v = String(h.tom_tat.moi_nguoi.production).replace(/\d{4}-\d{2}-\d{2}/, '<ngày>').replace(/bản dựng \w+, quan sát <ngày>, .*/, 'bản dựng …'); o[v] = (o[v] || 0) + 1; } return o; };
try {
  const sau = ve(KIT); const S = dem(sau.hang);
  console.log(`    · production (kho không khai): ${JSON.stringify(loaiProd(sau.hang))}`);
  console.log(`    · cây đang kiểm: ${JSON.stringify(S)}`);
  const sai = [];
  if (S.co !== 81) sai.push(`số hàng có tom_tat ${S.co}, cần 81`);
  if (S.chuaGhi !== 81) sai.push(`kho KHÔNG khai: ${S.chuaGhi}/81 ô production «chưa ghi quan sát» — hành vi cũ phải giữ nguyên`);
  if (S.cut) sai.push(`${S.cut} ô vi_sao kết «:»`);
  if (S.dai) sai.push(`${S.dai} ô vi_sao quá 400 ký tự`);
  if (S.ngoaiHD) sai.push(`${S.ngoaiHD} ô chua_lam còn «ngoài hợp đồng»`);
  if (S.lt1 !== '9 mục để ngoài phạm vi · 13 giới hạn đã biết') sai.push(`LT1 chua_lam «${S.lt1}»`);
  // Kho KHAI nhánh production (bản sao thêm khối `production:` — kho crm thật không bị sửa).
  writeFileSync(CFG, `${cfgGoc.replace(/\n*$/, '\n')}production:\n  nhanh: onehub\n`);
  const khai = ve(KIT); writeFileSync(CFG, cfgGoc);
  const P = loaiProd(khai.hang); console.log(`    · production (kho khai onehub): ${JSON.stringify(P)}`);
  const lt1 = (khai.hang.find(h => h.ma === 'LT1') || { tom_tat: { moi_nguoi: {} } }).tom_tat.moi_nguoi.production;
  if (lt1 !== LT1_PROD) sai.push(`kho khai: LT1 production «${lt1}» ≠ «${LT1_PROD}»`);
  const docKhong = khai.hang.filter(h => /^chưa đọc được triển khai/.test(h.tom_tat.moi_nguoi.production)).length;
  const chuaGhiKhai = khai.hang.filter(h => /chưa ghi quan sát/.test(h.tom_tat.moi_nguoi.production)).length;
  if (chuaGhiKhai) sai.push(`kho khai: ${chuaGhiKhai} ô còn «chưa ghi quan sát»`);
  console.log(`    · kho khai: ${docKhong} ô «chưa đọc được triển khai» (mã đã chấm vắng trong kho — có tên trong ô)`);
  if (sai.length) bad('DT-9', sai.join(' ; ')); else ok('DT-9', 'bản sao crm 27d47de04: 81 hàng có dải; 0 vì sao cụt · 0 quá 400 · 0 «ngoài hợp đồng»; LT1 «9 · 13»; kho không khai production như cũ, kho khai onehub → LT1 «đã triển khai» đúng ngày');

  const truoc = ve(base); const B = dem(truoc.hang);
  console.log(`    · base ${BASE_SHA}: ${JSON.stringify(B)}`);
  const saiB = [];
  if (B.co !== 81 || B.chuaGhi !== 81 || B.cut !== 11 || B.dai !== 31) saiB.push(`base cho ${B.co} · ${B.chuaGhi} · ${B.cut} · ${B.dai}, cần 81 · 81 · 11 · 31`);
  if (B.lt1 !== '9 mục ngoài hợp đồng · 0 giới hạn đã biết') saiB.push(`base LT1 «${B.lt1}»`);
  const ks = khuon(sau.raw); const kb = khuon(truoc.raw);
  console.log(`    · khuôn khối (cây đang kiểm): ${ks}`);
  if (ks !== kb) saiB.push(`khuôn khối khác: base ${kb}`);
  if (saiB.length) bad('DT-9-base', saiB.join(' ; ')); else ok('DT-9-base', 'bản base cho đúng 81 · 11 · 31 · LT1 «9 · 0» — phép đo phân biệt hai bản; khuôn khối hai bản bằng nhau');
} catch (e) { bad('DT-9', String(e.stack || e).split('\n').slice(0, 3).join(' | ')); }
ketThuc();
