// Kho mẫu code-sinh cho bộ răng lan-ghim-lai-theo-paths.
// Đường dẫn gốc kit SUY từ vị trí tệp (không hardcode). Pin `verified_commit` do CHÍNH
// `repin-lane.mjs --write` ghi (writer thật), cùng nếp tests/scripts/repin-lane-skip-unchanged.test.mjs.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..', '..');
const VALID = 'schema_version: 1\nfeature_slug: feat\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_ok\n    expected: exit 0\n    paths: ["src/**"]\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n';

const fs0 = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const W = (root, rel, txt) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, txt); };

// opts: { staleScope?: 'paths'|'all'|string, parallel?: boolean, evalsYaml: string|null,
//         prefix?: 'pkg/a/' (hồ sơ nằm sâu), suites?: string[] (lệnh suite), engine?: dir }
export function dungKho(opts = {}) {
  const R = mkdtempSync(path.join(tmpdir(), 'lgtp-'));
  const pre = opts.prefix || '';
  const AR = path.join(R, pre);                       // gốc kho của hồ sơ (--root)
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const suites = opts.suites || ['true'];
  const suiteKeys = suites.map((_, i) => `    - executors.test.s${i}`).join('\n');
  const suiteDefs = suites.map((c, i) => `    s${i}: ${JSON.stringify(c)}`).join('\n');
  const rt = ['risk_tiers:', '  t1_skip_globs:', '    - "docs/**"'];
  if (opts.staleScope !== undefined) rt.push(`  stale_scope: ${opts.staleScope}`);
  const fl = ['feature_loop:', '  suite_keys:', suiteKeys];
  if (opts.parallel) fl.push('  repin_parallel_suites: true');
  W(AR, '_acceptance/config.yaml', ['schema_version: 1', 'enforcement: strict', 'recheck: strict', 'gap_probe: off', ...fl,
    'executors:', '  test:', suiteDefs, '  script:', '    rang_ok: "true"', ...rt, ''].join('\n'));
  W(AR, 'src/a.js', 'v1\n'); W(AR, 'lib2/b.js', 'v1\n'); W(AR, 'ui/p.tsx', 'v1\n'); W(AR, 'docs/x.md', 'v1\n');
  W(AR, '_acceptance/feat/contract.md', '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n');
  // evals dùng để GHIM: bản của ô nếu hợp lệ cho làn, ngược lại bản VALID rồi đổi sau pin.
  const ghimBang = opts.ghimBangBanHopLe ? VALID : opts.evalsYaml;
  W(AR, '_acceptance/feat/evals.yaml', ghimBang);
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  W(AR, '_acceptance/feat/run-log.jsonl', JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
  W(AR, '_acceptance/feat/evidence-report.md', `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_ok\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const engine = opts.engine || KIT;
  const w = spawnSync(process.execPath, [path.join(engine, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', AR, '--ag-root', engine, '--slug', 'feat', '--reason', 'ghim ban dau', '--write'], { encoding: 'utf8' });
  if (w.status !== 0) throw new Error(`kho mẫu: writer thật không ghi được pin (exit ${w.status})\n${w.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  const pin = readFileSync(path.join(AR, '_acceptance/feat/evidence-report.md'), 'utf8').match(/^verified_commit:\s*(\S+)/m)[1];
  // Hồ sơ hình dạng cuối (M7/M8/M12): đổi evals.yaml SAU pin — tệp dưới _acceptance/ nên luật cũ không thấy.
  if (opts.ghimBangBanHopLe) {
    const p = path.join(AR, '_acceptance/feat/evals.yaml');
    if (opts.evalsYaml === null) rmSync(p); else writeFileSync(p, opts.evalsYaml);
    git('add', '-A'); git('commit', '-qm', 'doi evals sau pin');
  }
  // Nối thêm một dòng chú thích — KHÔNG ghi đè: ghi đè config.yaml là mất t1_skip_globs (vấp 03/10 ở M3).
  const apDiff = (tepList) => { for (const t of tepList) { const p = path.join(AR, t); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, (fs0(p) || '') + `# v2 ${t}\n`); } git('add', '-A'); git('commit', '-qm', 'diff sau pin'); };
  const don = () => rmSync(R, { recursive: true, force: true });
  return { R, AR, git, pin, apDiff, don };
}

// Chạy pre-merge-check của một engine (kit hoặc bản sao/bản base) trên kho mẫu.
export const chayPremerge = (engine, kho, args = []) =>
  spawnSync('bash', [path.join(engine, 'scripts', 'pre-merge-check.sh'), ...args, kho.AR], { encoding: 'utf8', env: { ...process.env, ...(args.env || {}) } });
// Chạy làn của một engine; bộ máy (--ag-root) mặc định chính engine đó.
export const chayLan = (engine, kho, args = [], agRoot = engine) =>
  spawnSync(process.execPath, [path.join(engine, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', kho.AR, '--ag-root', agRoot, '--slug', 'feat', ...args], { encoding: 'utf8' });

// Bản sao engine bị tiêm: chép trọn scripts/ lib/ feature-loop/ rồi thay chuỗi; chuỗi `tu`
// phải có mặt ĐÚNG một lần — tiêm hụt là lỗi hạ tầng có tên, không phải màu xanh.
export function banSao(sua = [], goc = KIT) {
  const D = mkdtempSync(path.join(tmpdir(), 'lgtp-sao-'));
  for (const d of ['scripts', 'lib', 'feature-loop']) cpSync(path.join(goc, d), path.join(D, d), { recursive: true });
  for (const { tep, tu, thanh } of sua) {
    const p = path.join(D, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(tu).length - 1;
    if (n !== 1) throw new Error(`tiêm hụt: «${tu.slice(0, 60)}» xuất hiện ${n} lần trong ${tep}`);
    writeFileSync(p, s.replace(tu, thanh));
  }
  return D;
}
