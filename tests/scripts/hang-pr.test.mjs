// hang-pr.test.mjs — hồ sơ ci-cua-kho-bo-job-nang: chế độ `--hang-pr` của scripts/pre-merge-check.sh
// (hàng lộ trình C1, 11/10/2026). CI của kho bỏ job nặng cho PR không chạm vật bằng MỘT cờ của chính cổng.
//
// Luật đo:
//  - Kho mẫu là kho git THẬT dựng trong lần chạy; gọi CHÍNH scripts/pre-merge-check.sh (có cờ và không cờ).
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng dưới), không tính từ mã cổng; số khẳng định = số hàng.
//  - Chiều đỏ: bản sao TRỌN `scripts/` + `lib/` bị tiêm đúng một kim (kim khớp đúng một lần, không thì ca đỏ
//    vì hạ tầng ca), thông điệp ghim; bản nguyên vẹn cùng kho là đối chứng dương.
//  - Đường dẫn suy từ vị trí tệp này. Tên ca = mã AC; HP_CASES chọn ca; mã lạ → thoát 2.
//  - Mặc định (không HP_CASES) chạy mọi ca TRỪ ca chỉ-chạy-khi-gọi-tên (chạy cổng trên chính cây kit — chậm).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GATE = path.join(KIT, 'scripts', 'pre-merge-check.sh');
const SLUG = 'ci-cua-kho-bo-job-nang';
// Commit cố định trước vòng này (điểm cắt nhánh của vòng, 11/10) — chỉ dùng làm dữ liệu cho ca đỏ của vế lịch sử
// và làm --base cho ca chạy trên cây kit; KHÔNG dùng làm mốc so «nhánh không đổi».
const NEO = 'd9d1f3a6c269d1274cd0ec643192fe63c61ad097';

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'hang-pr-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const thuMuc = (p) => { const d = path.join(TMP, `${p}-${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const ghi = (root, rel, txt) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const cut = (s, n = 300) => (String(s).length > n ? `${String(s).slice(0, n)}…` : String(s));

function gitInit(dir) {
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'config', 'user.email', 't@t.local'); git(dir, 'config', 'user.name', 't');
  git(dir, 'config', 'commit.gpgsign', 'false');
}
function commitAll(dir, msg) { git(dir, 'add', '-A'); git(dir, 'commit', '-q', '--allow-empty', '-m', msg); }

// Kho git: nhánh `main` = commit gốc; HEAD (nhánh `pr`) = commit PR. pr[rel] = null → xoá tệp.
function khoMau({ goc, pr }) {
  const dir = thuMuc('kho');
  gitInit(dir);
  for (const [r, t] of Object.entries(goc)) ghi(dir, r, t);
  commitAll(dir, 'goc');
  git(dir, 'checkout', '-q', '-b', 'pr');
  for (const [r, t] of Object.entries(pr)) {
    if (t === null) fs.rmSync(path.join(dir, r)); else ghi(dir, r, t);
  }
  commitAll(dir, 'pr');
  return dir;
}

// Chạy cổng. Biến GitHub của tiến trình gọi bị gỡ (CI của kit có GITHUB_OUTPUT thật) — ca tự đặt khi cần.
function chay(gate, cwd, args, env = {}) {
  const e = { ...process.env };
  for (const k of ['GITHUB_OUTPUT', 'GITHUB_STEP_SUMMARY', 'PRE_MERGE_BASE']) delete e[k];
  Object.assign(e, env);
  const r = spawnSync('bash', [gate, ...args], { cwd, encoding: 'utf8', env: e, maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

const KHUON = /^(hang|cham_vat|ly_do)=(.*)$/;
const TIEN_TO_CANH_BAO = '::warning title=hang-pr::';
function docKetQua(out) {
  const kq = { canhBao: [], le: [] };
  const dong = out.split('\n').filter((l) => l !== '');
  for (const l of dong) {
    const m = l.match(KHUON);
    if (m && !(m[1] in kq)) kq[m[1]] = m[2];
    else if (l.startsWith(TIEN_TO_CANH_BAO)) kq.canhBao.push(l);
    else kq.le.push(l);
  }
  kq.soDong = dong.length;
  return kq;
}

// Khối khoá đầu ra — bản gốc DUY NHẤT nằm trong tệp cổng (marker HANG-PR-KHOA).
function docKhoa(text) {
  const a = text.indexOf('# <<<HANG-PR-KHOA'); const b = text.indexOf('# HANG-PR-KHOA>>>');
  if (a < 0 || b < a) throw new Error('tệp cổng không có khối HANG-PR-KHOA');
  const khoa = {};
  for (const l of text.slice(a, b).split('\n').slice(1)) {
    const m = l.match(/^#\s*([a-z_]+):\s*(.+)$/);
    if (m) khoa[m[1]] = m[2].trim().split(/\s+/);
  }
  for (const k of ['hang', 'cham_vat', 'ly_do']) if (!khoa[k]) throw new Error(`khối HANG-PR-KHOA thiếu khoá ${k}`);
  return khoa;
}

// Kim: thay đúng MỘT chỗ; khớp 0 hay ≥2 lần là ca hỏng hạ tầng, nói tên kim.
function kim(text, tu, thanh) {
  const n = text.split(tu).length - 1;
  if (n !== 1) throw new Error(`kim khớp ${n} lần (phải đúng 1): ${cut(JSON.stringify(tu), 120)}`);
  return text.replace(tu, thanh);
}
// Bản sao TRỌN scripts/ + lib/ của cây đang đo; mutate(text) đổi tệp cổng trong bản sao. Trả đường tệp cổng.
function banSao(mutate) {
  const d = thuMuc('bansao');
  fs.cpSync(path.join(KIT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  fs.cpSync(path.join(KIT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const f = path.join(d, 'scripts', 'pre-merge-check.sh');
  fs.writeFileSync(f, mutate(fs.readFileSync(f, 'utf8')));
  return f;
}

// ── Ma trận viết trước (AC-1) ───────────────────────────────────────────────
const CAU_HINH = `schema_version: 1
risk_tiers:
  t1_skip_globs:
    - "docs/**"
    - "*.md"
    - "**/*.txt"
    - ".github/workflows/ci.yml"
  t3_paths:
    - "core/**"
`;
const GOC = { '_acceptance/config.yaml': CAU_HINH, 'docs/a.md': 'a\n', 'src/a.ts': 'a\n', 'core/x.ts': 'a\n', 'README.txt': 'a\n' };
// [tên hàng, tệp PR đổi, hang, cham_vat] — 12 hàng hợp đồng + 1 hàng Review Focus (ten-co-khoang).
// ten-co-khoang: `git diff --name-only` bọc tên non-ASCII trong nháy + mã bát phân (core.quotePath), nên CHÍNH
// cổng coi `docs/có khoảng.md` là ngoài T1 — chế độ một-nguồn đi theo (chạy đủ). Ca AC-1 ghim cả vế cổng.
const MA_TRAN = [
  ['chi-t1', ['docs/a.md'], 'T1', 'false'],
  ['sao-vuot-gach', ['notes/x/y.md'], 'T1', 'false'],
  ['hai-sao-o-goc', ['README.txt'], 'T1', 'false'],
  ['chi-ho-so', ['_acceptance/s1/contract.md'], 'ho-so', 'false'],
  ['ho-so-va-t1', ['_acceptance/s1/run-log.jsonl', 'docs/b.md'], 'ho-so', 'false'],
  ['thuoc-ho-so', ['_acceptance/s1/rang/do.mjs'], 'ho-so', 'false'],
  ['vat', ['src/a.ts'], 'T2', 'true'],
  ['vat-va-ho-so', ['src/a.ts', '_acceptance/s1/contract.md'], 'T2', 'true'],
  ['t3', ['core/x.ts'], 'T3', 'true'],
  ['t3-vat-t1', ['core/x.ts', 'src/a.ts', 'docs/a.md'], 'T3', 'true'],
  ['ci-khai', ['.github/workflows/ci.yml'], 'T1', 'false'],
  ['ci-khong-khai', ['.github/workflows/acceptance.yml'], 'T2', 'true'],
  ['ten-co-khoang', ['docs/có khoảng.md'], 'T2', 'true'],
];
const HANG = Object.fromEntries(MA_TRAN.map((h) => [h[0], h]));
const khoCache = new Map();
function khoHang(ten) {
  if (!khoCache.has(ten)) {
    const [, tep] = HANG[ten];
    khoCache.set(ten, khoMau({ goc: GOC, pr: Object.fromEntries(tep.map((t) => [t, 'doi\n'])) }));
  }
  return khoCache.get(ten);
}
const coCo = (gate, dir, them = ['--base', 'main'], env = {}) => chay(gate, dir, ['.', ...them, '--hang-pr'], env);
// Tập loại dòng `VIOLATION [PR]` cổng không cờ in ra.
function loaiPR(out) {
  const s = new Set();
  if (/^VIOLATION \[PR\]: T3 paths/m.test(out)) s.add('T3');
  if (/^VIOLATION \[PR\]: non-T1/m.test(out)) s.add('nonT1');
  return s;
}
const KY_VONG_PR = { T1: [], T2: ['nonT1'], T3: ['T3'] };
const bangTap = (s, arr) => s.size === arr.length && arr.every((x) => s.has(x));
function doiKetQua(r, { hang, cham_vat, ly_do, canhBao = 0 }, nhan) {
  const kq = docKetQua(r.stdout);
  const sai = [];
  if (r.status !== 0) sai.push(`mã ${r.status}`);
  if (hang !== undefined && kq.hang !== hang) sai.push(`hang=${kq.hang} (mong ${hang})`);
  if (cham_vat !== undefined && kq.cham_vat !== cham_vat) sai.push(`cham_vat=${kq.cham_vat} (mong ${cham_vat})`);
  if (ly_do !== undefined && kq.ly_do !== ly_do) sai.push(`ly_do=${kq.ly_do} (mong ${ly_do})`);
  if (kq.canhBao.length !== canhBao) sai.push(`${kq.canhBao.length} dòng cảnh báo (mong ${canhBao})`);
  if (kq.le.length) sai.push(`dòng lạ: ${cut(kq.le.join(' | '), 200)}`);
  if (sai.length) throw new Error(`${nhan}: ${sai.join('; ')} · stderr: ${cut(r.stderr, 160)}`);
  return kq;
}

// ── Sổ ca ───────────────────────────────────────────────────────────────────
const CA = new Map();
const CHI_GOI_TEN = new Set();
const ca = (id, fn, { chiGoiTen = false } = {}) => { CA.set(id, fn); if (chiGoiTen) CHI_GOI_TEN.add(id); };

ca('AC-1', () => {
  let n = 0;
  for (const [ten, , hang, cham_vat] of MA_TRAN) {
    doiKetQua(coCo(GATE, khoHang(ten)), { hang, cham_vat, ly_do: 'phan-loai' }, `hàng ${ten}`);
    n += 1;
  }
  if (n !== MA_TRAN.length) throw new Error(`số khẳng định ${n} ≠ số hàng ${MA_TRAN.length}`);
  if (!loaiPR(chay(GATE, khoHang('ten-co-khoang'), ['.', '--base', 'main']).stdout).has('nonT1')) {
    throw new Error('hàng ten-co-khoang: cổng không cờ KHÔNG in non-T1 — chế độ T2 không còn là phán quyết của cổng');
  }
  return `${n}/${MA_TRAN.length} hàng ma trận viết trước khớp (số khẳng định = số hàng); tên có dấu: cổng và chế độ cùng xử ngoài T1`;
});

const HANG_KHONG_HO_SO = ['chi-t1', 'sao-vuot-gach', 'hai-sao-o-goc', 'vat', 't3', 't3-vat-t1', 'ci-khai', 'ci-khong-khai'];
ca('AC-2', () => {
  let n = 0;
  for (const ten of HANG_KHONG_HO_SO) {
    const [, , hang] = HANG[ten];
    const s = loaiPR(chay(GATE, khoHang(ten), ['.', '--base', 'main']).stdout);
    if (!bangTap(s, KY_VONG_PR[hang])) throw new Error(`hàng ${ten}: cổng không cờ in {${[...s]}} — mong {${KY_VONG_PR[hang]}} cho hạng ${hang}`);
    n += 1;
  }
  return `${n}/8 hàng: tập dòng VIOLATION [PR] của cổng không cờ khớp hạng chế độ in`;
});

ca('AC-2-do', () => {
  const dir = khoHang('hai-sao-o-goc');
  doiKetQua(coCo(GATE, dir), { hang: 'T1', cham_vat: 'false' }, 'đối chứng dương README.txt');
  if (loaiPR(chay(GATE, dir, ['.', '--base', 'main']).stdout).size) throw new Error('đối chứng dương: cổng nguyên vẹn đã in VIOLATION [PR] cho README.txt');
  const g = banSao((t) => kim(t, '      glob_variants "$1$pre" "$post"          # GLOB-DOUBLESTAR-ZERO-DIRS\n', '      :\n'));
  const kq = docKetQua(coCo(g, dir).stdout);
  const cong = chay(g, dir, ['.', '--base', 'main']).stdout;
  const congLat = /^VIOLATION \[PR\]: non-T1[^\n]*\n(?:\s+\S[^\n]*\n)*?\s+README\.txt$/m.test(cong);
  if (!(kq.hang === 'T2' && kq.cham_vat === 'true' && congLat)) {
    throw new Error(`README.txt lật cùng cổng — KHÔNG: chế độ hang=${kq.hang}, cổng lật=${congLat}`);
  }
  return 'gỡ GLOB-DOUBLESTAR-ZERO-DIRS: README.txt lật cùng cổng (chế độ T2 + cổng non-T1 nêu README.txt)';
});

ca('AC-6', () => {
  const dir = khoHang('chi-t1');
  const d = thuMuc('gh');
  const out = path.join(d, 'output'); const sum = path.join(d, 'summary');
  fs.writeFileSync(out, 'co_san=1\n'); fs.writeFileSync(sum, '');
  const r = coCo(GATE, dir, ['--base', 'main'], { GITHUB_OUTPUT: out, GITHUB_STEP_SUMMARY: sum });
  const kq = doiKetQua(r, { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'kênh GitHub');
  if (kq.soDong !== 3) throw new Error(`stdout ${kq.soDong} dòng (mong 3)`);
  const o = fs.readFileSync(out, 'utf8');
  if (o !== 'co_san=1\nhang=T1\ncham_vat=false\nly_do=phan-loai\n') throw new Error(`GITHUB_OUTPUT = ${JSON.stringify(o)}`);
  const s = fs.readFileSync(sum, 'utf8').split('\n').filter(Boolean);
  if (s.length !== 1 || !s[0].includes('T1')) throw new Error(`GITHUB_STEP_SUMMARY = ${JSON.stringify(s)}`);
  const khoa = docKhoa(fs.readFileSync(GATE, 'utf8'));
  for (const k of ['hang', 'cham_vat', 'ly_do']) if (!khoa[k].includes(kq[k])) throw new Error(`${k}=${kq[k]} không có trong HANG-PR-KHOA`);
  const tam = thuMuc('tmpdir');
  const r2 = coCo(GATE, dir, ['--base', 'main'], { TMPDIR: tam });
  doiKetQua(r2, { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'không biến GitHub');
  const con = fs.readdirSync(tam);
  if (con.length) throw new Error(`thư mục tạm còn: ${con.join(', ')}`);
  const ban = git(dir, 'status', '--porcelain', '--untracked-files=all');
  if (ban) throw new Error(`lần chạy ghi vào kho: ${cut(ban)}`);
  return 'GITHUB_OUTPUT nối đúng ba dòng sau dòng có sẵn · summary một dòng · stdout ba dòng · không biến thì không ghi tệp · khoá/giá trị thuộc HANG-PR-KHOA';
});

ca('AC-6-do', () => {
  const dir = khoHang('chi-t1');
  const tot = docKetQua(coCo(GATE, dir).stdout);
  if (tot.le.length) throw new Error(`đối chứng dương: bản nguyên vẹn có dòng lạ ${cut(tot.le.join(' | '))}`);
  const g = banSao((t) => kim(t, '  exec >"$HP_TAM/cong.log" 2>&1\n', ''));
  const kq = docKetQua(coCo(g, dir).stdout);
  if (!kq.le.some((l) => l.startsWith('WARNING: committed-evidence re-check'))) {
    throw new Error(`dòng của cổng lọt ra — bản đột biến KHÔNG lọt dòng nào: ${cut(JSON.stringify(kq))}`);
  }
  return 'bỏ dòng nuốt stdout: dòng của cổng lọt ra (WARNING recheck) — bản nguyên vẹn sạch';
});

// Mỗi giá trị ly_do của khối khoá phải có một kịch bản; trả kết quả lần chạy.
const KICH_BAN = {
  'phan-loai': () => coCo(GATE, khoHang('chi-t1')),
  'khong-co-pham-vi-diff': () => coCo(GATE, khoHang('chi-t1'), []),
  'diff-rong': () => coCo(GATE, khoHang('chi-t1'), ['--base', 'HEAD']),
  'doi-danh-sach-hang': () => coCo(GATE, khoMau({ goc: GOC, pr: { '_acceptance/config.yaml': CAU_HINH.replace('    - "docs/**"\n', '    - "docs/**"\n    - "src/**"\n'), 'src/a.ts': 'doi\n' } })),
  'cau-hinh-loi': () => coCo(GATE, khoMau({ goc: { ...GOC, '_acceptance/config.yaml': CAU_HINH.replace('  t3_paths:\n', '\tt3_paths:\n') }, pr: { 'docs/a.md': 'doi\n' } })),
  'khong-phan-loai-duoc': () => coCo(GATE, khoHang('chi-t1'), ['--base', 'khong-co-ref']),
};
ca('AC-7', () => {
  const khoa = docKhoa(fs.readFileSync(GATE, 'utf8'));
  for (const ld of khoa.ly_do) {
    if (!KICH_BAN[ld]) throw new Error(`ly_do trong khối không có kịch bản: ${ld}`);
    const r = KICH_BAN[ld]();
    const kq = docKetQua(r.stdout);
    if (r.status !== 0 || kq.ly_do !== ld) throw new Error(`kịch bản ${ld}: mã ${r.status}, ly_do=${kq.ly_do}`);
  }
  for (const ld of Object.keys(KICH_BAN)) if (!khoa.ly_do.includes(ld)) throw new Error(`kịch bản ${ld} không có trong HANG-PR-KHOA`);
  const dir = khoHang('chi-t1');
  const a = chay(GATE, dir, ['.', '--hang-pr', '--base', '']);
  if (a.status !== 2 || !a.stderr.includes('--base requires a value')) throw new Error(`--base "" → mã ${a.status}, stderr ${cut(a.stderr)}`);
  const b = chay(GATE, dir, ['.', '--hang-prr']);
  if (b.status !== 2 || !b.stderr.includes('unknown option --hang-prr')) throw new Error(`--hang-prr → mã ${b.status}, stderr ${cut(b.stderr)}`);
  return `${khoa.ly_do.length}/${khoa.ly_do.length} giá trị ly_do mỗi giá trị một kịch bản, mã 0 · hai lỗi cú pháp giữ mã 2 với thông điệp hôm nay`;
});

// ── Thang nghi ngờ (AC-3, AC-4, AC-5) ───────────────────────────────────────
const KHO_DANH_SACH = {
  'them-t1': () => khoMau({ goc: GOC, pr: { '_acceptance/config.yaml': CAU_HINH.replace('    - "docs/**"\n', '    - "docs/**"\n    - "src/**"\n'), 'src/a.ts': 'doi\n' } }),
  'bo-t3': () => khoMau({ goc: GOC, pr: { '_acceptance/config.yaml': CAU_HINH.replace('    - "core/**"\n', ''), 'core/x.ts': 'doi\n' } }),
  'goc-chua-kit': () => khoMau({ goc: { 'docs/a.md': 'a\n', 'src/a.ts': 'a\n' }, pr: { '_acceptance/config.yaml': CAU_HINH, 'docs/a.md': 'doi\n' } }),
};
const khoDs = new Map();
const khoDanhSach = (k) => { if (!khoDs.has(k)) khoDs.set(k, KHO_DANH_SACH[k]()); return khoDs.get(k); };
const NGHI = { hang: 'khong-ro', cham_vat: 'true' };

ca('AC-3', () => {
  for (const k of Object.keys(KHO_DANH_SACH)) doiKetQua(coCo(GATE, khoDanhSach(k)), { ...NGHI, ly_do: 'doi-danh-sach-hang' }, `ca ${k}`);
  return 'ba ca đổi danh sách hạng (thêm t1 · bỏ t3 · gốc chưa có config) → khong-ro/true/doi-danh-sach-hang, 0 cảnh báo';
});

ca('AC-3-im', () => {
  const dir = khoMau({ goc: GOC, pr: { '_acceptance/config.yaml': `${CAU_HINH}feature_loop:\n  suite_keys: [executors.test.a]\n`, 'docs/a.md': 'doi\n' } });
  doiKetQua(coCo(GATE, dir), { hang: 'ho-so', cham_vat: 'false', ly_do: 'phan-loai' }, 'PR đổi khoá config khác');
  return 'PR đổi khoá config khác danh sách hạng + docs/a.md → ho-so/false/phan-loai';
});

ca('AC-3-do', () => {
  const g = banSao((t) => kim(t, '    if [ "$HP_T1_GOC" != "$T1_GLOBS" ] || [ "$HP_T3_GOC" != "$T3_PATHS" ]; then\n', '    if false; then\n'));
  for (const k of ['them-t1', 'goc-chua-kit']) {
    const dir = khoDanhSach(k);
    doiKetQua(coCo(GATE, dir), { ...NGHI, ly_do: 'doi-danh-sach-hang' }, `đối chứng dương ${k}`);
    const kq = docKetQua(coCo(g, dir).stdout);
    if (!(kq.hang === 'ho-so' && kq.cham_vat === 'false')) {
      throw new Error(`PR tự nới danh sách — bản bỏ bước so danh sách ở ca ${k} ra hang=${kq.hang} cham_vat=${kq.cham_vat} (mong ho-so/false)`);
    }
  }
  return 'bỏ bước so danh sách: hai ca PR tự nới danh sách ra ho-so/false (bit nguy hiểm) — bản nguyên vẹn khong-ro/true';
});

ca('AC-4', () => {
  const dir = khoHang('chi-t1');
  doiKetQua(coCo(GATE, dir), { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'đối chứng dương');
  doiKetQua(coCo(GATE, dir, []), { ...NGHI, ly_do: 'khong-co-pham-vi-diff', canhBao: 0 }, 'không --base');
  const r2 = coCo(GATE, dir, ['--base', 'khong-co-ref']);
  const k2 = doiKetQua(r2, { ...NGHI, ly_do: 'khong-phan-loai-duoc', canhBao: 1 }, 'ref không có');
  if (!k2.canhBao[0].includes('không resolve được')) throw new Error(`ref không có: cảnh báo không mang thông điệp cổng — ${cut(k2.canhBao[0])}`);
  const roi = khoMau({ goc: GOC, pr: { 'docs/a.md': 'doi\n' } });
  git(roi, 'checkout', '-q', '--orphan', 'roi'); commitAll(roi, 'roi'); git(roi, 'checkout', '-q', 'pr');
  doiKetQua(coCo(GATE, roi, ['--base', 'roi']), { ...NGHI, ly_do: 'khong-co-pham-vi-diff', canhBao: 1 }, 'lịch sử rời');
  doiKetQua(coCo(GATE, dir, ['--base', 'HEAD']), { ...NGHI, ly_do: 'diff-rong', canhBao: 1 }, 'diff rỗng');
  const tran = khoMau({ goc: { 'docs/a.md': 'a\n' }, pr: { 'docs/a.md': 'doi\n' } });
  const k5 = doiKetQua(coCo(GATE, tran), { ...NGHI, ly_do: 'khong-phan-loai-duoc', canhBao: 1 }, 'kho không _acceptance/');
  if (!k5.canhBao[0].includes('nothing to check')) throw new Error(`kho không _acceptance/: cảnh báo không mang thông điệp cổng — ${cut(k5.canhBao[0])}`);
  // Review Focus: % trong thông điệp được thoát · TMPDIR hỏng · GITHUB_OUTPUT chưa có · gốc lồng.
  const k6 = doiKetQua(coCo(GATE, dir, ['--base', 'khong%co']), { ...NGHI, ly_do: 'khong-phan-loai-duoc', canhBao: 1 }, 'ref có %');
  if (!k6.canhBao[0].includes('khong%25co') || k6.canhBao[0].includes('khong%co')) throw new Error(`ref có %: cảnh báo không thoát % — ${cut(k6.canhBao[0])}`);
  doiKetQua(coCo(GATE, dir, ['--base', 'main'], { TMPDIR: path.join(TMP, 'khong-co-thu-muc', 'x') }), { ...NGHI, ly_do: 'khong-phan-loai-duoc', canhBao: 1 }, 'TMPDIR hỏng');
  const out = path.join(thuMuc('gh-moi'), 'chua-co');
  doiKetQua(coCo(GATE, dir, ['--base', 'main'], { GITHUB_OUTPUT: out }), { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'GITHUB_OUTPUT chưa có');
  if (fs.readFileSync(out, 'utf8') !== 'hang=T1\ncham_vat=false\nly_do=phan-loai\n') throw new Error('GITHUB_OUTPUT chưa có: tệp tạo ra sai nội dung');
  // Tệp chỉ `docs/**` khớp được (đuôi .html: không dính `*.md`, `**/*.txt`) — đường diff tính từ gốc git là `pkg/docs/…`.
  const long = khoMau({ goc: { 'pkg/_acceptance/config.yaml': CAU_HINH, 'pkg/docs/a.html': 'a\n' }, pr: { 'pkg/docs/a.html': 'doi\n' } });
  doiKetQua(coCo(GATE, path.join(long, 'pkg')), { hang: 'T2', cham_vat: 'true', ly_do: 'phan-loai' }, 'gốc lồng');
  if (!loaiPR(chay(GATE, path.join(long, 'pkg'), ['.', '--base', 'main']).stdout).has('nonT1')) throw new Error('gốc lồng: cổng không cờ KHÔNG in non-T1 — chế độ lệch cổng');
  return 'năm ca nghi ngờ (không base · ref không có · lịch sử rời · diff rỗng · kho chưa có kit) đều chạy đủ, mã 0, cảnh báo đúng chỗ · Review Focus: thoát %, TMPDIR hỏng, GITHUB_OUTPUT chưa có, gốc lồng theo cổng';
});

ca('AC-4-do', () => {
  const dir = khoHang('chi-t1');
  doiKetQua(coCo(GATE, dir), { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'đối chứng dương');
  const moc = 'DIFF_GATED_FIRST="$(printf \'%s%s\' "$DIFF_T3_HITS" "$DIFF_NONT1_HITS" | head -1)"\n';
  for (const [ten, chen, dau] of [['exit 1', 'exit 1\n', null], ['biến chưa khai', ': "$HP_BIEN_CHUA_KHAI"\n', 'HP_BIEN_CHUA_KHAI']]) {
    const g = banSao((t) => kim(t, moc, chen + moc));
    const r = coCo(g, dir);
    const kq = docKetQua(r.stdout);
    if (!(r.status === 0 && kq.hang === 'khong-ro' && kq.cham_vat === 'true' && kq.ly_do === 'khong-phan-loai-duoc' && kq.canhBao.length === 1 && kq.le.length === 0)) {
      throw new Error(`lối dừng thoát khác 0 (${ten}) — chế độ không in «chạy đủ»: mã ${r.status}, ${cut(JSON.stringify(kq))}`);
    }
    if (dau && !kq.canhBao[0].includes(dau)) throw new Error(`lối dừng (${ten}): cảnh báo không chép thông điệp cổng — ${cut(kq.canhBao[0])}`);
  }
  return 'chèn exit 1 / biến chưa khai ngay trước khối phân loại: bẫy vẫn in khong-ro/true/khong-phan-loai-duoc, mã 0, một cảnh báo';
});

ca('AC-5', () => {
  doiKetQua(coCo(GATE, khoHang('chi-t1')), { hang: 'T1', cham_vat: 'false', ly_do: 'phan-loai' }, 'đối chứng dương');
  const tab = khoMau({ goc: { ...GOC, '_acceptance/config.yaml': CAU_HINH.replace('  t3_paths:\n', '\tt3_paths:\n') }, pr: { 'docs/a.md': 'doi\n' } });
  const k1 = doiKetQua(coCo(GATE, tab), { ...NGHI, ly_do: 'cau-hinh-loi', canhBao: 1 }, 'config có TAB');
  if (!k1.canhBao[0].includes('VIOLATION [config]')) throw new Error(`config có TAB: cảnh báo không chép dòng VIOLATION [config] — ${cut(k1.canhBao[0])}`);
  const vang = khoMau({ goc: { '_acceptance/s1/contract.md': '---\nstatus: draft\n---\n', 'docs/a.md': 'a\n' }, pr: { 'docs/a.md': 'doi\n' } });
  doiKetQua(coCo(GATE, vang), { ...NGHI, ly_do: 'cau-hinh-loi', canhBao: 1 }, 'config vắng');
  return 'config có TAB và config vắng → cau-hinh-loi + một cảnh báo, mã 0; đối chứng config lành → T1/false';
});

// ── Chạy ────────────────────────────────────────────────────────────────────
const yeuCau = (process.env.HP_CASES || '').split(',').map((s) => s.trim()).filter(Boolean);
for (const id of yeuCau) {
  if (!CA.has(id)) { console.error(`hang-pr.test: mã ca lạ «${id}» — có: ${[...CA.keys()].join(' ')}`); process.exit(2); }
}
const chon = yeuCau.length ? yeuCau : [...CA.keys()].filter((id) => !CHI_GOI_TEN.has(id));
let pass = 0; let fail = 0;
for (const id of chon) {
  const t0 = Date.now();
  try {
    const tom = await CA.get(id)();
    console.log(`  PASS: ${id} — ${tom} (${((Date.now() - t0) / 1000).toFixed(1)}s)`); pass += 1;
  } catch (e) {
    console.log(`  FAIL: ${id} — ${e && e.message ? e.message : e}`); fail += 1;
  }
}
console.log(`Results: ${pass} passed, ${fail} failed (hang-pr)`);
process.exit(fail > 0 || pass === 0 ? 1 : 0);
