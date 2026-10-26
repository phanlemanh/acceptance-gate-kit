// Bộ đọc «ca đổi thân» dùng chung (hồ sơ trao-vai-va-do-sau-gop, TC1b). Tệp .test.mjs không import lẫn nhau (khuôn
// DP8-11), nên bộ tách khối sống ở đây. `dongKhep`/`khoiCa`/`khoiCaCu` chép nguyên từ on-dinh-r2.test.mjs (bộ tách mới:
// `test(` ở mọi mức thụt, khép theo ngoặc; bộ cũ cột 0 chỉ giữ làm chiều đỏ).
//
// `caDoiThanLichSu` so HAI SHA CỐ ĐỊNH, đọc bằng `git show` — không đọc cây làm việc. Lý do: một phép so «cây làm việc so
// với sha ghim + sổ hồ sơ đã ký» là bất biến lúc gộp; sau khi hồ sơ gộp, vòng sau đổi thân ca là CI đỏ giả (Cổng Bằng
// chứng TC1, Ngoài-6/7; hạt giống docs/plans/2026-10-18-hat-giong-bat-bien-luc-gop-trong-ho-so-da-ky.md).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const git = (goc, ...a) => spawnSync('git', a, { cwd: goc, env: ENV, encoding: 'utf8', maxBuffer: 1 << 28 });

export const coSha = (goc, sha) => git(goc, 'cat-file', '-e', `${sha}^{commit}`).status === 0;
export const docTai = (goc, sha, p) => {
  const r = git(goc, 'show', `${sha}:${p}`);
  return r.status === 0 ? r.stdout : null;
};
const tepTai = (goc, sha, thuMuc) => {
  const r = git(goc, 'ls-tree', '-r', '--name-only', sha, '--', thuMuc);
  return r.status === 0 ? r.stdout.split('\n').filter((f) => f.endsWith('.test.mjs')) : [];
};

export function dongKhep(dong, i, thutMo) {
  let sau = 0;
  let nhay = null;
  const quet = (d, tu) => {
    for (let k = tu; k < d.length; k++) {
      const c = d[k];
      if (nhay) {
        if (c === '\\') k++;
        else if (c === nhay) nhay = null;
      } else if (c === "'" || c === '"' || c === '`') nhay = c;
      else if (c === '(') sau++;
      else if (c === ')' && --sau === 0) return true;
    }
    if (nhay !== '`') nhay = null;
    return false;
  };
  if (quet(dong[i], dong[i].indexOf('test('))) return i;
  if (/\{\s*$/.test(dong[i])) {
    const khep = new RegExp(`^${thutMo}\\}`);
    let j = i + 1;
    while (j < dong.length && !khep.test(dong[j])) j++;
    return j;
  }
  for (let j = i + 1; j < dong.length; j++) if (quet(dong[j], 0)) return j;
  return dong.length - 1;
}
export function khoiCa(text, tep) {
  const ra = new Map();
  if (text == null) return ra;
  const dong = text.split('\n');
  let dau = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = /^(\s*)test\((['"`])(.+?)\2/.exec(dong[i]);
    if (!m) continue;
    // Khác bản on-dinh-r2: phần đầu tệp là khối riêng, ca đầu tiên bắt đầu từ dòng `test(` của nó — bản kia tính đổi
    // phần đầu thành đổi cả ca đầu tiên.
    if (!ra.size && dau === 0 && i > 0) {
      ra.set(`(đầu ${tep})`, dong.slice(0, i).join('\n'));
      dau = i;
    }
    const j = dongKhep(dong, i, m[1]);
    ra.set(m[3], dong.slice(dau, j + 1).join('\n'));
    dau = j + 1;
    i = j;
  }
  return ra;
}
// Bộ tách cũ của SDT-07 — chỉ để chạy chiều đỏ của DP8-11 (ca DP8-11-do tach-khoi-cu).
export function khoiCaCu(text, tep) {
  const ra = new Map();
  if (text == null) return ra;
  const dong = text.split('\n');
  let dau = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = /^test\((['"`])(.+?)\1/.exec(dong[i]);
    if (!m) continue;
    if (!ra.size && dau === 0 && i > 0) ra.set(`(đầu ${tep})`, dong.slice(0, i).join('\n'));
    let j = i;
    while (j < dong.length && !/^\}\);\s*$/.test(dong[j])) j++;
    ra.set(m[2], dong.slice(dau, j + 1).join('\n'));
    dau = j + 1;
    i = j;
  }
  return ra;
}

// Ca đổi thân giữa hai sha cố định: chỉ ca CÓ ở mốc đầu mà chữ khác ở mốc cuối (ca mới không tính). Một trong hai sha
// vắng khỏi lịch sử (clone nông, gộp squash) → `{ boQua }` có tên, không xanh câm, không đỏ.
export function caDoiThanLichSu(goc, tu, den, { thuMuc = 'tests/dieu-phoi', tach = khoiCa, doc = (sha, p) => docTai(goc, sha, p) } = {}) {
  for (const sha of [tu, den]) if (!coSha(goc, sha)) return { boQua: `sha ${sha.slice(0, 12)} không có trong lịch sử` };
  const ra = [];
  for (const f of tepTai(goc, tu, thuMuc)) {
    const cu = tach(doc(tu, f), path.basename(f));
    const moi = tach(doc(den, f), path.basename(f));
    for (const [ten, than] of cu) if (moi.get(ten) !== than) ra.push(ten);
  }
  return { ds: ra.sort() };
}

// Gói `<thuMuc>` rút bằng `git archive` tại một sha cố định vào thư mục tạm (người gọi dọn). Trả đường gói, hoặc null khi
// sha vắng khỏi lịch sử.
export function goiTai(goc, sha, thuMuc = 'dieu-phoi') {
  if (!coSha(goc, sha)) return null;
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'goi-tai-')));
  execFileSync('sh', ['-c', `git -C "${goc}" archive ${sha} ${thuMuc} | tar -x -C "${d}"`], { env: ENV });
  return path.join(d, thuMuc);
}

// Khoá `ca_doi_than` của các dòng sổ `fix`, đọc tại một sha cố định (không đọc cây làm việc). Sha vắng → null.
export function caKhaiTai(goc, sha, duongSo) {
  if (!coSha(goc, sha)) return null;
  return (docTai(goc, sha, duongSo) ?? '').split('\n').filter(Boolean).flatMap((d) => {
    try {
      const o = JSON.parse(d);
      return o.type === 'fix' && Array.isArray(o.ca_doi_than) ? o.ca_doi_than : [];
    } catch {
      return [];
    }
  }).sort();
}
