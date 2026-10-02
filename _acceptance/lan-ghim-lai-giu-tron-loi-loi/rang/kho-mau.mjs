// Kho mẫu code-sinh cho bộ răng lan-ghim-lai-giu-tron-loi-loi. Gốc kit SUY từ vị trí tệp.
// Pin do CHÍNH repin-lane.mjs --write ghi trên cấu hình toàn xanh; sau đó cấu hình đổi sang
// lệnh của ca (tệp dưới _acceptance/, nên cây vẫn «sạch ngoài _acceptance/» với làn).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..', '..');
const W = (root, rel, txt) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, txt); };
const evalsY = (slug, evals) => `schema_version: 1\nfeature_slug: ${slug}\nevals:\n` + evals.map(e =>
  `  - id: ${e.id}\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.${e.key}\n    expected: exit 0\n` +
  (e.expected_exit !== undefined ? `    expected_exit: ${e.expected_exit}\n` : '') +
  `    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`).join('');
const config = (suites, scripts) => ['schema_version: 1', 'enforcement: strict', 'recheck: strict', 'gap_probe: off',
  'feature_loop:', '  suite_keys:', ...suites.map((_, i) => `    - executors.test.s${i}`),
  'executors:', '  test:', ...suites.map((c, i) => `    s${i}: ${JSON.stringify(c)}`),
  '  script:', ...Object.entries(scripts).map(([k, c]) => `    ${k}: ${JSON.stringify(c)}`),
  'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"', ''].join('\n');

// opts: { slugs: [{ slug, evals: [{id, key, expected_exit?}] }], suites: [cmd], scripts: {key: cmd}, tep: {rel: noiDung} }
export function dungKho(opts) {
  const R = mkdtempSync(path.join(tmpdir(), 'gtll-'));
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const xanhScripts = Object.fromEntries(Object.keys(opts.scripts).map(k => [k, 'true']));
  W(R, '_acceptance/config.yaml', config(opts.suites.map(() => 'true'), xanhScripts));
  W(R, 'src/a.js', 'v1\n');
  for (const [rel, txt] of Object.entries(opts.tep || {})) W(R, rel, txt);
  for (const s of opts.slugs) {
    W(R, `_acceptance/${s.slug}/contract.md`, `---\nschema_version: 1\nfeature: ${s.slug}\nslug: ${s.slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n`);
    W(R, `_acceptance/${s.slug}/evals.yaml`, evalsY(s.slug, s.evals.map(e => ({ ...e, expected_exit: undefined }))));
  }
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  for (const s of opts.slugs) {
    const e1 = s.evals[0];
    W(R, `_acceptance/${s.slug}/run-log.jsonl`, JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: `r1-${s.slug}`, sha: H1, eval: e1.id, exit_code: 0 }) + '\n');
    W(R, `_acceptance/${s.slug}/evidence-report.md`, `---\nschema_version: 1\nfeature_slug: ${s.slug}\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: ${e1.id}\n  run_id: r1-${s.slug}\n  exit_code: 0\n  verifier: config:executors.script.${e1.key}\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
  }
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const w = chayLan(KIT, { R }, opts.slugs.map(s => s.slug), ['--reason', 'ghim ban dau', '--write']);
  if (w.status !== 0) throw new Error(`kho mẫu: writer thật không ghi được pin (exit ${w.status})\n${w.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  // Cấu hình + evals của CA (lệnh thật của ca, expected_exit nếu khai).
  W(R, '_acceptance/config.yaml', config(opts.suites, opts.scripts));
  for (const s of opts.slugs) W(R, `_acceptance/${s.slug}/evals.yaml`, evalsY(s.slug, s.evals));
  git('add', '-A'); git('commit', '-qm', 'lenh cua ca');
  const runs = () => { const d = path.join(R, '.acceptance-runs'); if (!existsSync(d)) return []; const out = []; const di = (p) => { for (const f of readdirSync(p, { withFileTypes: true })) { const q = path.join(p, f.name); if (f.isDirectory()) di(q); else out.push(path.relative(R, q)); } }; di(d); return out.sort(); };
  const doc = (rel) => readFileSync(path.join(R, rel), 'utf8');
  return { R, git, runs, doc, don: () => rmSync(R, { recursive: true, force: true }) };
}

// Làn của một engine (thư mục chứa feature-loop/scripts); bộ máy lib luôn là KIT (vòng này không sửa lib).
export function chayLan(engine, kho, slugs, args = [], env = {}) {
  return spawnSync(process.execPath, [path.join(engine, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', kho.R, '--ag-root', KIT, ...slugs.flatMap(s => ['--slug', s]), ...args],
    { encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 512 * 1024 * 1024 });
}

// Bản sao engine bị tiêm: chép TRỌN feature-loop/ (làn nạp tệp bạn theo đường tương đối).
// Chuỗi `tu` phải có mặt ĐÚNG một lần — tiêm hụt là lỗi hạ tầng có tên, không phải xanh.
export function banSao(sua = [], goc = KIT) {
  const D = mkdtempSync(path.join(tmpdir(), 'gtll-sao-'));
  cpSync(path.join(goc, 'feature-loop'), path.join(D, 'feature-loop'), { recursive: true });
  for (const { tep, tu, thanh } of sua) {
    const p = path.join(D, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(tu).length - 1;
    if (n !== 1) throw new Error(`tiêm hụt: «${tu.slice(0, 70)}» xuất hiện ${n} lần trong ${tep}`);
    writeFileSync(p, s.replace(tu, thanh));
  }
  return D;
}

export function bao(ten) {
  let loi = 0;
  const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
  const ket = () => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
  return { ok, ket };
}
