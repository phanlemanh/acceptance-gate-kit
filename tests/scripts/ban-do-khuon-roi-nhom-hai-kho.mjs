// ban-do-khuon-roi-nhom-hai-kho.mjs — hồ sơ ban-do-khuon-roi-nhom, ca RN-5: số TRƯỚC/SAU trên bản sao hai kho thử thật.
//
// Cần hai kho trên máy, nên tệp KHÔNG mang đuôi .test.mjs và KHÔNG vào feature_loop.suite_keys:
//   kho thứ hai — QUY_HANG_ROOT hoặc ~/onehub-quy-hang · kho thứ nhất — CRM_ROOT hoặc ~/dev/crm.
// Kho vắng hay thiếu commit ghim → thoát 2 nêu đường (mù, không xanh).
// Mỗi kho được `git clone --shared` vào thư mục tạm và checkout commit ghim; không ghi gì vào kho thật. «Bộ máy gốc» =
// `git archive <GOC> scripts lib` bung trong lượt; «cây» = scripts/ của cây đang kiểm (suy từ vị trí tệp này). Cả hai chạy
// `chamKho` trên CÙNG bản sao. Kho thứ nhất khai nhóm bằng sổ đăng ký nên bộ chấm «không đo được»; ca giả lập hai cấu hình
// `nhan_dien.tep` (thư mục mẫu phẳng · cả cây thư mục mẫu) trong một commit của bản sao để phép so không rỗng.
// Chỉ in số — không in tên tệp của hai kho (kho kit công khai). Kỳ vọng VIẾT SẴN từ finding 03/11 §5.2.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GOC = 'eab2ca4181afd8e1e6a4f3e09f7653a928ece108';
const QH = { ten: 'kho thứ hai', goc: process.env.QUY_HANG_ROOT || path.join(os.homedir(), 'onehub-quy-hang'), sha: '3273a4485a1e5cb2734793f1b59a0a9b4b3ac8c2' };
const CRM = { ten: 'kho thứ nhất', goc: process.env.CRM_ROOT || path.join(os.homedir(), 'dev', 'crm'), sha: '3ee79f1642ea8b04104fd50595c80e57c7a862fe' };
// [nhãn, base, TRƯỚC {lech, no, theo}, SAU {lech, no, theo}] — số của finding 03/11 §5.2.
const HANG_QH = [
  ['base trước bản đồ', 'e7a5f2c2d9b9e0dc70af55f8e3b106804472a8da', { lech: 10, no: 6, theo: 65 }, { lech: 0, no: 0, theo: 81 }],
  ['base 30 commit trước', `${QH.sha}~30`, { lech: 6, no: 3, theo: 47 }, { lech: 0, no: 0, theo: 56 }],
];

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'roi-nhom-hai-kho-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const git = (root, ...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
const mu = msg => { console.error(`ban-do-khuon-roi-nhom-hai-kho: ${msg}`); process.exit(2); };

function banSao(kho) {
  if (!fs.existsSync(path.join(kho.goc, '.git'))) mu(`${kho.ten} vắng: ${kho.goc}`);
  try { git(kho.goc, 'cat-file', '-e', `${kho.sha}^{commit}`); } catch (_) { mu(`${kho.ten} thiếu commit ${kho.sha.slice(0, 8)}: ${kho.goc}`); }
  const d = path.join(TMP, kho.ten.replace(/\s+/g, '-'));
  execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', kho.goc, d]);
  git(d, 'checkout', '-q', kho.sha);
  git(d, 'config', 'user.email', 'ca@roi.nhom'); git(d, 'config', 'user.name', 'Ca Roi Nhom'); git(d, 'config', 'commit.gpgsign', 'false');
  return d;
}
async function mayGoc() {
  const d = path.join(TMP, 'goc');
  fs.mkdirSync(d);
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', GOC, 'scripts', 'lib'], { maxBuffer: 256 * 1024 * 1024 }) });
  return d;
}
const nap = async kit => (await import(pathToFileURL(path.join(kit, 'scripts', 'design-floor-khuon.mjs')).href)).chamKho;
const so = ra => ({ lech: ra.lech_moi.length, no: ra.no_cu.length, theo: ra.theo_khuon.length });
const inSo = s => `lệch ${s.lech} · nợ cũ ${s.no} · theo khuôn ${s.theo}`;

let hong = 0;
const ket = (ma, loi, them = '') => {
  if (!loi.length) console.log(`PASS: RN-5 ${ma}${them}`);
  else { hong++; console.log(`FAIL: RN-5 ${ma} — ${loi.join(' | ')}`); }
};

const chamGoc = await nap(await mayGoc());
const chamCay = await nap(KIT);
// Quy mô phạm vi bị gỡ khỏi phép chấm: số mục rời nhóm (ngoai_le vắng khoi) bộ đọc của cây thấy trên bản đồ của kho.
const docCay = createRequire(import.meta.url)(path.join(KIT, 'scripts', 'ban-do-khuon.cjs'));
const demRoi = kho => docCay.docThuMuc(kho).nhom.reduce((n, g) => n + g.ngoai_le.filter(e => e.khoi === null).length, 0);

// Kho thứ hai: TRƯỚC và SAU khớp số viết sẵn.
const qh = banSao(QH);
const roiQh = demRoi(qh);
ket('kho-thu-hai muc-roi-nhom', roiQh >= 16 ? [] : [`chỉ ${roiQh} mục rời nhóm (cần ≥ 16 — mười sáu tệp báo oan đều nằm trong danh sách rời nhóm)`], ` — ${roiQh} mục`);
for (const [nhan, base, truoc, sau] of HANG_QH) {
  const g = so(chamGoc(qh, base));
  const c = so(chamCay(qh, base));
  const loi = [];
  if (JSON.stringify(g) !== JSON.stringify(truoc)) loi.push(`TRƯỚC ${inSo(g)} (viết sẵn ${inSo(truoc)})`);
  if (JSON.stringify(c) !== JSON.stringify(sau)) loi.push(`SAU ${inSo(c)} (viết sẵn ${inSo(sau)})`);
  ket(`kho-thu-hai ${nhan}`, loi, ` — TRƯỚC ${inSo(g)} → SAU ${inSo(c)}`);
}

// Kho thứ nhất: hai cấu hình nhan_dien.tep giả lập; TRƯỚC == SAU từng mục, và tổng số dòng báo > 0 (phép so không rỗng).
const crm = banSao(CRM);
const roiCrm = demRoi(crm);
ket('kho-thu-nhat muc-roi-nhom', roiCrm === 0 ? [] : [`${roiCrm} mục rời nhóm (cần 0 — mọi mục ngoai_le của kho có khoi)`], ` — ${roiCrm} mục`);
const TEP_NHOM = git(crm, 'ls-files', 'design/patterns/*.md').split('\n').filter(f => f && !/\/(README|lech-lot)\.md$/.test(f));
if (TEP_NHOM.length !== 1) mu(`${CRM.ten}: cần đúng một tệp nhóm, có ${TEP_NHOM.length}`);
const goc = fs.readFileSync(path.join(crm, TEP_NHOM[0]), 'utf8');
const mau = /^mau_dang_chay:\n(?:\s+.*\n)*?\s+tep:\s*(\S+)/m.exec(goc);
if (!mau || !/^  dang_ky:/m.test(goc)) mu(`${CRM.ten}: tệp nhóm không còn hình dạng sổ đăng ký + mau_dang_chay.tep`);
const thuMucMau = path.posix.dirname(mau[1]);
let tongBao = 0;
for (const [nhan, glob] of [['glob thư mục mẫu phẳng', `${thuMucMau}/*.tsx`], ['glob cả cây thư mục mẫu', `${thuMucMau}/**`]]) {
  git(crm, 'checkout', '-q', '-f', CRM.sha);
  fs.writeFileSync(path.join(crm, TEP_NHOM[0]), goc.replace(/^(  dang_ky:.*\n)/m, `$1  tep: ["${glob}"]\n`));
  git(crm, 'commit', '-qam', `giả lập nhan_dien.tep ${nhan}`);
  const base = `${CRM.sha}~30`;
  const g = chamGoc(crm, base);
  const c = chamCay(crm, base);
  const loi = [];
  if (g.khong_do.some(k => k.startsWith('nhóm '))) loi.push(`nhóm vẫn «không đo được» sau giả lập: ${g.khong_do.find(k => k.startsWith('nhóm '))}`);
  for (const k of ['lech_moi', 'no_cu', 'theo_khuon', 'khong_do']) if (JSON.stringify(g[k]) !== JSON.stringify(c[k])) loi.push(`${k} khác bản gốc`);
  if (g.ngoai_ban_do !== c.ngoai_ban_do) loi.push(`ngoài bản đồ ${g.ngoai_ban_do} → ${c.ngoai_ban_do}`);
  tongBao += g.lech_moi.length + g.no_cu.length;
  ket(`kho-thu-nhat ${nhan}`, loi, ` — TRƯỚC ${inSo(so(g))} → SAU ${inSo(so(c))}`);
}
ket('kho-thu-nhat khong-rong', tongBao > 0 ? [] : ['hai cấu hình không cho dòng báo nào — phép so «không đổi» rỗng']);

process.exitCode = hong ? 1 : 0;
