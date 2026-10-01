// cay-doi.mjs — MỘT nguồn cho «cây đổi trong lượt chấm» (hồ sơ luot-cham-ghi-vao-cay).
//
// Lượt chấm S4 giả định cây đứng yên ở `invokedSha`. Không tác tử nào được tự khai điều đó
// (AC-5 của cham-khong-tu-dot-luot), nên hai đầu tất định ở phiên chính giữ nó:
//   · s4-args.mjs chụp cây TRƯỚC fan-out (`chupCay`, cùng lúc ghi invokedSha);
//   · thuoc-vat.mjs --write so NGAY SAU fan-out (`soCay`), có đổi → dòng sổ `cay-doi` (khuôn
//     marker dưới), thoát 6.
// Bên đọc dòng sổ: lib/nhan-canh-gay.cjs (thẻ, lưới trước-merge, recheck) và s4-args (round,
// kiểm đã hoàn lại).
//
// VÙNG XÉT = lớp `vat` + `thuoc` của lib/phan-loai.mjs, TRỪ ba tiền tố của NGOAI_VUNG. Lớp
// `ho-so` và `ngoai` không xét — cùng luật «hoá cũ» của Staleness guard và lưới trước-merge.
// Ba vế so (design doc §3):
//   1. commit lạ — tệp trong vùng mà `git diff <sha> HEAD` HOẶC `git log <sha>..HEAD` liệt
//      (vế log bắt commit rồi hoàn lại trong lượt);
//   2. tệp ĐANG THEO DÕI bị đổi nội dung — chỉ đường git đang theo dõi; mục chưa theo dõi
//      không bao giờ vào vế này (tạo phẩm chưa theo dõi của lượt trước bị ghi lại không khoá);
//   3. mục chưa theo dõi MỚI — chỉ gọi tên, không khoá.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { phanLoai } from './phan-loai.mjs';

// <<<CAY-DOI-LINE
// {"kind":"cay-doi","ts":"<ISO>","round":<n>,"luot_ts":"<invokedAt của args>","sha":"<sha đã chấm>","tep":[{"tep":"<đường>","doi":"<commit|đổi nội dung|xoá>"}],"commit":["<sha ngắn>"],"moi":["<mục chưa theo dõi mới>"]}
// CAY-DOI-LINE>>>

// Ba tiền tố không xét — mỗi vế một dòng: răng hồ sơ gỡ TỪNG vế trong bản sao.
export const NGOAI_VUNG = slug => [
  '.acceptance-runs/',
  `_acceptance/${slug}/evidence/`,
  '.claude/',
];

export function trongVung(rel, slug, t1SkipGlobs = []) {
  const f = String(rel).split(path.sep).join('/');
  if (NGOAI_VUNG(slug).some(p => f.startsWith(p))) return false;
  const lop = phanLoai(f, { t1SkipGlobs });
  return lop === 'vat' || lop === 'thuoc';
}

const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
const tachZ = s => String(s).split('\0').filter(Boolean);

// Băm nội dung trên đĩa (liên kết mềm: băm đích). Vắng → 'vang'.
export function bam(root, rel) {
  const abs = path.join(root, rel);
  try {
    const st = fs.lstatSync(abs);
    return createHash('sha256').update(st.isSymbolicLink() ? fs.readlinkSync(abs) : fs.readFileSync(abs)).digest('hex');
  } catch { return 'vang'; }
}

// Tệp đang theo dõi khác `<sha>` trên cây làm việc (sửa · xoá · đã stage) — git tự áp bộ lọc
// dòng cuối và bỏ qua chênh mtime.
const doiSoVoi = (root, sha) => tachZ(git(root, ['diff', '--name-only', '-z', sha]));
// Mục chưa theo dõi, thư mục chưa theo dõi gộp một dòng (không băm — §5.1).
function chuaTheoDoiCuaCay(root) {
  const t = tachZ(git(root, ['status', '--porcelain', '-z', '--untracked-files=normal']));
  const out = [];
  for (let i = 0; i < t.length; i++) {
    const xy = t[i].slice(0, 2);
    if (xy === '??') out.push(t[i].slice(3));
    else if (xy[0] === 'R' || xy[0] === 'C') i += 1;   // -z: đường gốc của rename/copy là token kế
  }
  return out;
}

// Ảnh chụp TRƯỚC lượt — gọi khi HEAD = sha. → { sha, ban: {đường: băm}, chuaTheoDoi: [mục] }
export function chupCay(root, slug, t1SkipGlobs = [], sha) {
  const ban = {};
  for (const f of doiSoVoi(root, sha)) if (trongVung(f, slug, t1SkipGlobs)) ban[f] = bam(root, f);
  const chuaTheoDoi = chuaTheoDoiCuaCay(root).filter(f => trongVung(f, slug, t1SkipGlobs)).sort();
  return { sha, ban, chuaTheoDoi };
}

// So SAU lượt. → { tep: [{tep, doi, truoc?}], commit: [sha ngắn], moi: [mục] }; tep rỗng = im.
export function soCay(root, slug, t1SkipGlobs = [], chup) {
  const { sha } = chup;
  const ban = chup.ban || {};
  const truocChua = new Set(chup.chuaTheoDoi || []);
  const vung = f => trongVung(f, slug, t1SkipGlobs);
  const out = new Map();
  // Vế 1 — commit lạ.
  const quaCommit = new Set([
    ...tachZ(git(root, ['diff', '--name-only', '-z', sha, 'HEAD'])),
    ...tachZ(git(root, ['log', '--format=', '--name-only', '-z', `${sha}..HEAD`])).map(s => s.trim()).filter(Boolean),
  ].filter(vung));
  for (const f of quaCommit) out.set(f, { tep: f, doi: 'commit' });
  const commit = quaCommit.size ? git(root, ['log', '--format=%h', `${sha}..HEAD`, '--', ...quaCommit]).split('\n').filter(Boolean) : [];
  // Vế 2 — tệp đang theo dõi đổi nội dung trong lượt.
  const ung = new Set([...doiSoVoi(root, sha), ...Object.keys(ban)].filter(vung));
  for (const f of ung) {
    if (out.has(f)) continue;
    const sau = bam(root, f);
    const doi = Object.prototype.hasOwnProperty.call(ban, f) ? ban[f] !== sau : true;   // không có ở ảnh = sạch lúc chụp
    if (doi) out.set(f, { tep: f, doi: sau === 'vang' ? 'xoá' : 'đổi nội dung', ...(ban[f] ? { truoc: ban[f] } : {}) });
  }
  // Vế 3 — mục chưa theo dõi mới: gọi tên, không khoá.
  const moi = chuaTheoDoiCuaCay(root).filter(f => vung(f) && !truocChua.has(f)).sort();
  const tep = [...out.values()].sort((a, b) => (a.tep < b.tep ? -1 : a.tep > b.tep ? 1 : 0));
  return { tep, commit, moi };
}

// Dựng MỘT dòng sổ đúng khuôn CAY-DOI-LINE (khoá theo đúng thứ tự khuôn).
export function dongCayDoi({ ts, round, luotTs, sha, tep, commit, moi }) {
  if (!Number.isInteger(round)) throw new Error('dongCayDoi: round phai la so nguyen');
  return JSON.stringify({ kind: 'cay-doi', ts, round, luot_ts: luotTs || '', sha, tep, commit: commit || [], moi: moi || [] });
}
