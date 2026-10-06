// Kho mẫu code-sinh cho bộ răng loc-paths-dong-mac-dinh. Đường gốc kit SUY từ vị trí tệp. Pin
// `verified_commit` do CHÍNH `repin-lane.mjs --write` của kit ghi (writer thật), cùng nếp
// `_acceptance/lan-ghim-lai-theo-paths/rang/kho-mau.mjs`. Mọi thư mục tạm được dọn khi tiến trình
// thoát (bài học Ngoài-1 của mốc 2.23.0: bộ đo để lại hàng nghìn thư mục tạm).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..', '..');
// Bản base: nhánh chính lúc S3 bắt đầu (mốc 2.23.0). GHIM sha — merge-base sau khi gộp là chính
// cây đang kiểm (bài học vòng lan-ghim-lai-theo-paths).
export const MOC_BASE = '892755ec6014ccc4312afddca594c77ac2ce416c';

const TAM = new Set();
process.on('exit', () => { for (const d of TAM) { try { rmSync(d, { recursive: true, force: true }); } catch {} } });
export const thuMucTam = (tien) => { const d = mkdtempSync(path.join(tmpdir(), tien)); TAM.add(d); return d; };

const W = (root, rel, txt) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, txt); };
const idMay = (evalsYaml) => [...String(evalsYaml || '').matchAll(/- id: (E\d+)\n(?:.*\n)*?\s+executor: (\S+)/g)]
  .filter(m => ['script', 'test'].includes(m[2])).map(m => m[1]);

// opts: { staleScope?: 'paths'|'all', hoSo: [{ slug, evalsYaml }], tep: string[], prefix?: 'pkg/a/' }
export function dungKho(opts) {
  const R = thuMucTam('lpdm-');
  const pre = opts.prefix || '';
  const AR = path.join(R, pre);
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'core.quotepath=true', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const rt = ['risk_tiers:', '  t1_skip_globs:', '    - "docs/**"'];
  if (opts.staleScope !== undefined) rt.push(`  stale_scope: ${opts.staleScope}`);
  W(AR, '_acceptance/config.yaml', ['schema_version: 1', 'enforcement: strict', 'recheck: strict', 'gap_probe: off',
    'feature_loop:', '  suite_keys:', '    - executors.test.s0', 'executors:', '  test:', '    s0: "true"', '  script:', '    rang_ok: "true"', ...rt, ''].join('\n'));
  for (const t of opts.tep) W(AR, t, 'v1\n');
  for (const h of opts.hoSo) {
    W(AR, `_acceptance/${h.slug}/contract.md`, `---\nschema_version: 1\nfeature: ${h.slug}\nslug: ${h.slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n`);
    W(AR, `_acceptance/${h.slug}/evals.yaml`, h.evalsYaml);
  }
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  for (const h of opts.hoSo) {
    const ids = idMay(h.evalsYaml);
    W(AR, `_acceptance/${h.slug}/run-log.jsonl`, ids.map(e => JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: `r1-${e}`, sha: H1, eval: e, exit_code: 0 })).join('\n') + '\n');
    W(AR, `_acceptance/${h.slug}/evidence-report.md`, `---\nschema_version: 1\nfeature_slug: ${h.slug}\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n` +
      ids.map(e => `- eval: ${e}\n  run_id: r1-${e}\n  exit_code: 0\n  verifier: config:executors.script.rang_ok\n  verified_at: 2026-09-01\n`).join('') + `\n## Iterations\n\nRound 1 — PASS.\n`);
  }
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const w = spawnSync(process.execPath, [path.join(KIT, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', AR, '--ag-root', KIT,
    ...opts.hoSo.flatMap(h => ['--slug', h.slug]), '--reason', 'ghim ban dau', '--write'], { encoding: 'utf8' });
  if (w.status !== 0) throw new Error(`kho mẫu: writer thật không ghi được pin (exit ${w.status})\n${w.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  const doi = (tepList) => { for (const t of tepList) { const p = path.join(AR, t); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, (existsSync(p) ? readFileSync(p, 'utf8') : '') + `# v2\n`); } git('add', '-A', '--', ...tepList.map(t => path.join(pre, t))); git('commit', '-qm', 'diff sau pin'); };   // chỉ đúng các tệp đổi — tệp chưa theo dõi khác giữ nguyên chưa theo dõi
  const xoa = (tepList) => { for (const t of tepList) rmSync(path.join(AR, t), { force: true }); git('add', '-A', '--', ...tepList.map(t => path.join(pre, t))); git('commit', '-qm', 'xoa sau pin'); };
  const don = () => { rmSync(R, { recursive: true, force: true }); TAM.delete(R); };
  return { R, AR, git, doi, xoa, don };
}

// Danh sách tệp git theo dõi của kho — cách bên gọi thật dựng cây (`-z`, tên có dấu nguyên chữ).
export const lsFiles = (k) => execFileSync('git', ['-C', k.AR, 'ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);

export const chayPremerge = (engine, k, args = [], env = {}) => {
  const r = spawnSync('bash', [path.join(engine, 'scripts', 'pre-merge-check.sh'), ...args, k.AR], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { st: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
export const chayLan = (engine, k, slugs, args = [], agRoot = engine) => spawnSync(process.execPath,
  [path.join(engine, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', k.AR, '--ag-root', agRoot, ...slugs.flatMap(s => ['--slug', s]), ...args], { encoding: 'utf8' });

// Bản sao engine bị tiêm: chép trọn scripts/ lib/ feature-loop/ rồi thay chuỗi; chuỗi `tu` phải có mặt
// ĐÚNG một lần — tiêm hụt là lỗi hạ tầng có tên, không phải màu xanh.
export function banSao(sua = [], goc = KIT) {
  const D = thuMucTam('lpdm-sao-');
  for (const d of ['scripts', 'lib', 'feature-loop']) cpSync(path.join(goc, d), path.join(D, d), { recursive: true });
  for (const { tep, tu, thanh } of sua) {
    const p = path.join(D, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(tu).length - 1;
    if (n !== 1) throw new Error(`tiêm hụt: «${tu.slice(0, 60)}» xuất hiện ${n} lần trong ${tep}`);
    writeFileSync(p, s.replace(tu, thanh));
  }
  return D;
}
// Bản base: TRỌN `scripts lib feature-loop` bằng git archive tại MOC_BASE; pipefail để lỗi archive không
// thành một thư mục rỗng im lặng (Ngoài-5 của vòng lan-ghim-lai-theo-paths).
export function banBase(ref = process.env.LPDM_BASE_REF || MOC_BASE) {
  const D = thuMucTam('lpdm-base-');
  execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" scripts lib feature-loop | tar -x -C "$3"', '_', KIT, ref, D]);
  if (!existsSync(path.join(D, 'lib', 'evidence-core.cjs'))) throw new Error(`bản base rỗng tại ${ref}`);
  return D;
}
