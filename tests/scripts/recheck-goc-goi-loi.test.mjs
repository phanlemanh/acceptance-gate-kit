#!/usr/bin/env node
// Hồ sơ phan-du-bo-cuc-moi, AC-6 / E6 — bộ kiểm lại bằng chứng (scripts/recheck-evidence.cjs) tìm `verifier:` trong
// GỐC GÓI LÕI khi kho đặt lõi ở thư mục con (marketplace.json của gốc kho git). Chạy: node tests/scripts/recheck-goc-goi-loi.test.mjs
//
//   RG-1  lõi ở plugins/acceptance-gate → verifier scripts/product-map.mjs giải được, recheck thoát 0.
//   RG-2  kho không có marketplace.json → stdout + stderr + mã thoát bằng từng byte bản gốc (merge-base với origin/main).
//   RG-3  chiều đỏ: bản sao có gocGoiLoi trả null → "verifier script not found" với đúng đường ấy; RG-1 trên CÙNG
//         fixture làm đối chứng dương.
//
// Mọi fixture (kho, báo cáo đã ký, verifier giả) do mã sinh trong lần chạy, ở os.tmpdir(). Bộ kiểm chạy với cwd = kho
// fixture: ứng viên cwd của bộ giải không được rơi về cây kit (cây kit CÓ scripts/product-map.mjs — xanh giả).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const VERIFIER = 'scripts/product-map.mjs';
const SLUG = 'rg-fixture';
const MSG_NOT_FOUND = `verifier script not found. raw: ${VERIFIER};`;

let passed = 0;
let failed = 0;
const check = (label, fn) => {
  try { fn(); passed++; console.log(`  PASS: ${label}`); } catch (e) { failed++; console.log(`  FAIL: ${e.message}`); }
};
const hong = (msg) => { throw new Error(msg); };

const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const tmp = (ten) => fs.mkdtempSync(path.join(os.tmpdir(), `rg-${ten}-`));
const ghi = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

// Khuôn báo cáo rút từ một báo cáo thật đã ký (_acceptance/release-2-5-0/evidence-report.md — eval E6 trỏ
// `verifier: scripts/product-map.mjs`): frontmatter schema_version 2 · verdict PASS · verified_commit · human_signoff,
// bảng eval, khối «- eval:» với run_id / exit_code / baseline / verifier / verified_at / output.
const baoCao = (sha) => [
  '---',
  'schema_version: 2',
  `feature_slug: ${SLUG}`,
  'verdict: PASS',
  'failed_evals: []',
  'reason: ',
  'verified_by: fresh-context verification subagent',
  'enforcement_mode: strict',
  'bypass_used: false',
  `verified_commit: ${sha}`,
  'human_signoff: Người Ký Giả 2026-11-15 — fixture RG',
  '---',
  '',
  `# Evidence Report: ${SLUG}`,
  '',
  '| Eval | Criterion | Executor | Verdict |',
  '|---|---|---|---|',
  '| E1 | AC-1 | script | PASS |',
  '',
  '## Evidence',
  '',
  '- eval: E1',
  `  run_id: minted-${SLUG}-E1-r1`,
  '  exit_code: 0',
  '  baseline: n-a',
  `  verifier: ${VERIFIER}`,
  '  verified_at: 2026-11-15T00:00:00Z',
  '  output: |',
  '    PASS: product-map khớp',
  '',
].join('\n');

// coLoi: null (không marketplace.json) · '.' (lõi ở gốc) · 'plugins/acceptance-gate' (lõi ở thư mục con).
// viTri: nơi đặt verifier giả, tương đối gốc kho.
function dungKho({ coLoi, viTri }) {
  const kho = tmp('kho');
  git(kho, 'init', '-q');
  git(kho, 'config', 'user.email', 'rg@example.invalid');
  git(kho, 'config', 'user.name', 'RG Fixture');
  if (coLoi !== null) {
    const source = coLoi === '.' ? './' : `./${coLoi}`;
    ghi(path.join(kho, '.claude-plugin', 'marketplace.json'), JSON.stringify({
      name: 'rg-market',
      plugins: [{ name: 'acceptance-gate', source }, { name: 'feature-loop', source: './plugins/feature-loop' }],
    }, null, 2) + '\n');
  }
  ghi(path.join(kho, viTri, VERIFIER), '#!/usr/bin/env node\nprocess.exit(0);\n');
  ghi(path.join(kho, 'README.md'), 'rg fixture\n');
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'fixture');
  const bc = path.join(kho, '_acceptance', SLUG, 'evidence-report.md');
  ghi(bc, baoCao(git(kho, 'rev-parse', 'HEAD')));
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'bao cao da ky');
  return { kho, bc };
}

const chay = (script, { kho, bc }) => {
  const r = spawnSync(process.execPath, [script, bc], { cwd: kho, encoding: 'utf8' });
  if (r.error) hong(`HẠ TẦNG: không chạy được ${script}: ${r.error.message}`);
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
};

// Bản gốc: TRỌN scripts/ + lib/ của merge-base (không chép danh sách tệp tay).
function banGoc() {
  const mb = git(ROOT, 'merge-base', 'HEAD', 'origin/main');
  const d = tmp('goc');
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" scripts lib | tar -x -C "$3"`, '_', ROOT, mb, d]);
  const p = path.join(d, 'scripts', 'recheck-evidence.cjs');
  if (!fs.existsSync(p)) hong(`HẠ TẦNG: git archive ${mb} không ra scripts/recheck-evidence.cjs`);
  return p;
}

// Bản sao bị tiêm: TRỌN scripts/ + lib/ của cây đang kiểm, gocGoiLoi trả null ngay dòng đầu.
function banTiemNull() {
  const d = tmp('tiem');
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const p = path.join(d, 'scripts', 'recheck-evidence.cjs');
  const goc = fs.readFileSync(p, 'utf8');
  const dau = 'function gocGoiLoi(gitRoot) {';
  const tiem = goc.replace(dau, `${dau}\n  return null;`);
  if (tiem === goc) hong('RG-3 HẠ TẦNG: không tìm thấy «function gocGoiLoi(gitRoot) {» — bản tiêm bằng bản gốc');
  fs.writeFileSync(p, tiem);
  return p;
}

const tomTat = (r) => `exit ${r.status}; stderr: ${r.stderr.trim().split('\n').slice(0, 4).join(' | ') || '(rỗng)'}`;
const khongNotFound = (r, ten) => {
  if (r.status !== 0) hong(`${ten} — mong exit 0, được ${tomTat(r)}`);
  if (r.stderr.includes('verifier script not found')) hong(`${ten} — còn dòng «verifier script not found»: ${tomTat(r)}`);
};

console.log('recheck-goc-goi-loi (AC-6)');

const loiCon = dungKho({ coLoi: 'plugins/acceptance-gate', viTri: 'plugins/acceptance-gate' });

check(`RG-1 lõi ở thư mục con → verifier ${VERIFIER} giải trong gốc gói lõi`, () => {
  khongNotFound(chay(SCRIPT, loiCon), 'RG-1');
});

check('RG-2 kho không có marketplace.json → đầu ra bằng bản gốc từng byte', () => {
  const goc = banGoc();
  const ca = [
    ['verifier ở gốc kho', dungKho({ coLoi: null, viTri: '.' }), 0],
    ['verifier chỉ ở plugins/acceptance-gate', dungKho({ coLoi: null, viTri: 'plugins/acceptance-gate' }), 1],
  ];
  for (const [ten, kho, maMong] of ca) {
    const a = chay(goc, kho);
    const b = chay(SCRIPT, kho);
    // Đối chứng: hai ca phải khác nhau về mã thoát — nếu không, phép so byte không phân biệt được gì.
    if (a.status !== maMong) hong(`RG-2 HẠ TẦNG (${ten}): bản gốc thoát ${a.status}, mong ${maMong} — fixture không như dựng`);
    if (a.status !== b.status || a.stdout !== b.stdout || a.stderr !== b.stderr) {
      hong(`RG-2 (${ten}) đầu ra lệch bản gốc — gốc: ${tomTat(a)} · nay: ${tomTat(b)}`);
    }
  }
});

check('RG-2b lõi ở gốc kho (source "./") → đầu ra bằng bản gốc từng byte', () => {
  const goc = banGoc();
  const kho = dungKho({ coLoi: '.', viTri: 'plugins/acceptance-gate' });
  const a = chay(goc, kho);
  const b = chay(SCRIPT, kho);
  if (a.status !== 1) hong(`RG-2b HẠ TẦNG: bản gốc thoát ${a.status}, mong 1`);
  if (a.status !== b.status || a.stdout !== b.stdout || a.stderr !== b.stderr) {
    hong(`RG-2b đầu ra lệch bản gốc — gốc: ${tomTat(a)} · nay: ${tomTat(b)}`);
  }
});

check(`RG-3 chiều đỏ — gỡ ứng viên gốc gói lõi trên bản sao → verifier script not found: ${VERIFIER}`, () => {
  // Đối chứng dương trên CÙNG fixture: bản thật giải được.
  khongNotFound(chay(SCRIPT, loiCon), 'RG-3 đối chứng dương (RG-1)');
  const r = chay(banTiemNull(), loiCon);
  if (r.status === 0 || !r.stderr.includes(MSG_NOT_FOUND)) {
    hong(`RG-3 chiều đỏ không đỏ — bản tiêm: ${tomTat(r)}`);
  }
  // Ghim: lỗi duy nhất của fixture là verifier — không lẫn lỗi hình dạng khác.
  const dongLoi = r.stderr.split('\n').filter((l) => /^\s+L\d /.test(l));
  if (dongLoi.length !== 1 || !dongLoi[0].includes('L2 SUBSTANCE')) {
    hong(`RG-3 fixture có lỗi ngoài verifier: ${dongLoi.join(' | ')}`);
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
