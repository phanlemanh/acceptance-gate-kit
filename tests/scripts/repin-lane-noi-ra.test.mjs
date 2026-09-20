// GN — làn ghim lại phải NÓI RA ô nó không đo (hồ sơ ghim-lai-noi-ra-o-khong-do, 20/09/2026).
//
// Ca VĨNH VIỄN: suite scripts chạy mọi *.test.mjs qua glob, nên đây là lưới thường trực
// cho lớp «pin im về thứ nó không chứng». Luật đo:
//  - Fixture là kho git THẬT dựng trong chính lượt chạy; hồ sơ theo MA TRẬN bốn AC:
//    AC-a{E1 test} · AC-b{E2 script not-run} · AC-c{E6 ui-check paths, E7 ui-check not-run}
//    · AC-d{E12 judgment, E13 test}. Danh sách kỳ vọng «AC không có chốt máy» VIẾT TRƯỚC
//    = hằng AC_KHONG dưới đây, KHÔNG tính lại từ mã sản phẩm (gap-probe F1).
//  - Mỗi ca chạy phép phán trên vật THẬT (phải không lỗi) rồi CÙNG phép phán trên bản sao
//    đã tiêm (phải ra đúng thông điệp ghim). Mũi tiêm khớp đúng một lần, bản sao khác gốc,
//    qua `node --check`.
//  - Mọi đường dẫn suy từ vị trí tệp này. Mốc git vắng → ca ĐỎ có tên, không xanh lặng.
//  - Mỗi ca in ĐÚNG MỘT dòng `PASS: GNxx …` / `FAIL: GNxx … (DO: …)`.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');
const MOC = '2826f807';               // mốc 2.17.0 — writer + bên đọc đời TRƯỚC hồ sơ này
const AC_KHONG = ['AC-b', 'AC-c'];    // kỳ vọng VIẾT TRƯỚC, không tính từ mã sản phẩm

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gnro-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));

// ── fixture: evals.yaml theo ma trận ────────────────────────────────────────
// `paths` viết dạng BLOCK SEQ — đúng dạng kho tiêu thụ dùng (đo ở crm 20/09:
// 393 eval block-seq / 49 flow). Ca GN07 đo thêm dạng flow.
const EVALS_MA_TRAN = `schema_version: 1
slug: feat-gn

evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
  - id: E2
    criterion: AC-b
    executor: script
    status: not-run
    cmd: config:executors.script.rang
    expected: >
      Ô tự khai không chạy.
  - id: E6
    criterion: AC-c
    executor: ui-check
    cmd: config:executors.ui.x
    paths:
      - "apps/x/**"
      - "_acceptance/feat-gn/rang/**"
    expected: >
      Nhìn frame.
  - id: E7
    criterion: AC-c
    executor: ui-check
    status: not-run
    cmd: config:executors.ui.x
    expected: >
      Ô ngoài làn máy tự khai không chạy.
  - id: E12
    criterion: AC-d
    executor: judgment
    cmd: judgment
    expected: >
      Người phán.
  - id: E13
    criterion: AC-d
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
`;
const EVALS_TOAN_MAY = `schema_version: 1
slug: feat-may

evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
`;
const CONFIG = `schema_version: 1
enforcement: strict
recheck: strict
gap_probe: off
feature_loop:
  suite_keys:
    - executors.test.suite
executors:
  test:
    suite: "bash suite.sh"
  script:
    rang: "bash rang.sh"
  ui:
    x: "echo ui"
`;
const REPORT = (slug, vc) => `---
schema_version: 1
slug: ${slug}
verified_commit: ${vc}
human_signoff: Nguoi Ky 2026-09-19
---

# Evidence — ${slug}

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-a | test | PASS |

## Iterations
`;

// Kho git tạm với MỘT hồ sơ. toanMay=true → hồ sơ chỉ có eval máy (chiều im).
function mkKho({ toanMay = false, evals = null } = {}) {
  const root = mk('kho-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const slug = toanMay ? 'feat-may' : 'feat-gn';
  const ws = path.join(root, '_acceptance', slug);
  fs.mkdirSync(path.join(ws, 'rang'), { recursive: true });
  fs.mkdirSync(path.join(root, 'apps', 'x'), { recursive: true });
  fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), CONFIG);
  fs.writeFileSync(path.join(root, 'suite.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'rang.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'apps', 'x', 'a.ts'), 'v1\n');
  fs.writeFileSync(path.join(ws, 'rang', 'r.mjs'), '// v1\n');
  fs.writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [ui]\nstatus: signed-off\napproved_by: Nguoi Ky\napproved_at: 2026-09-19\n---\n\n# Contract ${slug}\n\n## Criteria\n\n- AC-a: Given x, When y, Then z.\n`);
  const body = evals !== null ? evals : (toanMay ? EVALS_TOAN_MAY : EVALS_MA_TRAN);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), body.replaceAll('feat-gn', slug));
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const head0 = git('rev-parse', 'HEAD').trim();
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-19T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: head0, eval: 'E1', exit_code: 0 }) + '\n');
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), REPORT(slug, head0));
  git('add', '-A'); git('commit', '-qm', 'evidence');
  return { root, ws, slug, git, head: git('rev-parse', 'HEAD').trim(), logPath: path.join(ws, 'run-log.jsonl'), reportPath: path.join(ws, 'evidence-report.md') };
}

const chayLan = (root, slug, extra = [], laneScript = LANE) =>
  spawnSync(process.execPath, [laneScript, '--root', root, '--ag-root', ROOT, '--slug', slug, '--reason', 'ca GN', ...extra], { encoding: 'utf8' });
const dongRepinCuoi = (logPath) => JSON.parse(fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.includes('"kind":"repin"')).pop());
const sectionCuoi = (reportPath) => {
  const t = fs.readFileSync(reportPath, 'utf8');
  const i = t.lastIndexOf('### Re-pin lần');
  return i < 0 ? '' : t.slice(i);
};

// Bản sao đã tiêm: mũi tiêm khớp ĐÚNG MỘT LẦN, bản sao khác gốc, qua node --check.
// `chepTrong`: thư mục ANH EM phải chép TRỌN sang bản sao (bài học P150 — chép danh
// sách tệp tay thì vật đo gọi thêm một module là bản sao thiếu tệp, đỏ vì HẠ TẦNG chứ
// không vì vật). `repin-lane.mjs` import ./carry-plan.mjs và ./chup-ho-so-da-thong.mjs,
// `gate-card.js` require ../lib/*.cjs — nên cả hai đi đường chép trọn.
function mutant(src, tim, thay, chepTrong = null) {
  const s = fs.readFileSync(src, 'utf8');
  const n = s.split(tim).length - 1;
  if (n !== 1) throw new Error(`mui tiem khop ${n} lan (can 1): ${cut(tim, 70)}`);
  const moi = s.replace(tim, thay);
  if (moi === s) throw new Error('ban sao khong khac ban goc');
  let out;
  if (chepTrong) {
    const d = mk('mut-');
    for (const thuMuc of chepTrong) fs.cpSync(path.join(ROOT, thuMuc), path.join(d, thuMuc), { recursive: true });
    out = path.join(d, path.relative(ROOT, src));
    fs.writeFileSync(out, moi);
  } else {
    out = path.join(mk('mut-'), path.basename(src));
    fs.writeFileSync(out, moi);
  }
  if (/\.(mjs|cjs|js)$/.test(out)) {
    const chk = spawnSync(process.execPath, ['--check', out], { encoding: 'utf8' });
    if (chk.status !== 0) throw new Error(`ban sao khong qua node --check: ${cut(chk.stderr, 140)}`);
  }
  return out;
}
// Bản sao của làn: chép trọn feature-loop/scripts (anh em cùng thư mục).
const mutLane = (tim, thay) => mutant(LANE, tim, thay, ['feature-loop/scripts']);
// Bản sao của thẻ: chép trọn scripts + lib (thẻ require ../lib/*.cjs).
const mutCard = (tim, thay) => mutant(CARD, tim, thay, ['scripts', 'lib']);

const CASES = [];

// ── GN01 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN01',
  title: 'dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id',
  real(lane) {
    const errs = [];
    const f = mkKho();
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d.evals_not_machine) !== JSON.stringify(['E6', 'E7', 'E12'])) errs.push(`khoa evals_not_machine vang hoac sai: ${JSON.stringify(d.evals_not_machine)}`);
    if (JSON.stringify(d.evals_not_run) !== JSON.stringify(['E2'])) errs.push(`evals_not_run sai: ${JSON.stringify(d.evals_not_run)}`);
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1', 'E13'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    const hop = [...Object.keys(d.evals_exit), ...(d.evals_not_run || []), ...(d.evals_not_machine || [])];
    const tapId = ['E1', 'E2', 'E6', 'E7', 'E12', 'E13'];
    if (new Set(hop).size !== hop.length) errs.push(`id xuat hien hai mang: ${hop.join(',')}`);
    else if (JSON.stringify([...hop].sort()) !== JSON.stringify([...tapId].sort())) errs.push(`hop ba tap != tap id: ${hop.join(',')}`);
    return errs;
  },
  mutants: [
    { pin: 'khoa evals_not_machine vang', make: () => mutLane(".filter(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))\n    .map(e => e.id);\n  return { slug", '.filter(() => false)\n    .map(e => e.id);\n  return { slug') },
    { pin: 'id xuat hien hai mang', make: () => mutLane("    .filter(e => !core.isRepinMachineEval(e))\n    .map(e => e.id);\n  // Ô NGOÀI LÀN MÁY", "    .filter(() => true)\n    .map(e => e.id);\n  // Ô NGOÀI LÀN MÁY") },
  ],
});

// ── GN02 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN02',
  title: 'hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng',
  real(lane) {
    const errs = [];
    const f = mkKho({ toanMay: true });
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    const keys = Object.keys(d);
    for (const k of ['evals_not_run', 'evals_not_machine', 'evals_not_machine_touched']) {
      if (keys.includes(k)) errs.push(`mang rong thay vi vang: khoa ${k} co mat (${JSON.stringify(d[k])})`);
    }
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    return errs;
  },
  mutants: [
    { pin: 'mang rong thay vi vang', make: () => mutLane('s.ngoaiMay.length ? { evals_not_machine: s.ngoaiMay } : {},', '{ evals_not_machine: s.ngoaiMay },') },
  ],
});

// ── chạy ────────────────────────────────────────────────────────────────────
const want = (process.env.GNRO_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chosen.length) { console.log(`GNRO_CASES khop 0 ca: ${want.join(',')}`); process.exit(1); }
let passed = 0; let failed = 0;
for (const c of chosen) {
  const t0 = Date.now();
  let errs;
  try {
    errs = c.real(c.obj || LANE).map(e => `vat that: ${e}`);
    for (const m of c.mutants || []) {
      let got;
      try { got = (m.judge || c.real)(m.make()); } catch (e) { got = null; errs.push(`chieu do "${m.pin}" khong dung duoc: ${e.message}`); }
      if (got === null) continue;
      if (got.some(e => e.includes(m.pin))) process.stdout.write(`    · ${c.id} chieu do: ban sao do, ghim "${m.pin}"\n`);
      else errs.push(`chieu do khong do — ban sao khong ra "${m.pin}" (ra: ${cut(got.join(' | ') || 'khong loi nao', 220)})`);
    }
  } catch (e) { errs = [`ha tang: ${e.message}`]; }
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  if (!errs.length) { passed++; console.log(`  PASS: ${c.id} ${c.title} (${dt}s)`); } else { failed++; console.log(`  FAIL: ${c.id} ${c.title} (DO: ${errs.join(' | ')})`); }
}
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
