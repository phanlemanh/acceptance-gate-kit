// gia-lan-fixture.mjs — kho git code-sinh cho các ca của hồ sơ gia-lan-ghim-lai (KHÔNG phải tệp ca:
// run-tests.sh chỉ chạy *.test.mjs). Pin do CHÍNH repin-lane.mjs --write ghi (writer thật); dấu vết
// lệnh ghi ra thư mục NGOÀI kho — một tệp git theo dõi làm dấu thì mỗi lượt chạy làm cây khác pin.
// Đường dẫn suy từ vị trí tệp này (không hardcode ROOT).
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');

// opts: { config: dòng YAML thêm dưới feature_loop (thụt 2), suite: thân suite.sh, suiteCmd: lệnh
//         suite thay `sh suite.sh`, extraSuites: [{key, cmd}], evals: [{id, cmd, body?, sh?}],
//         files: {tên: nội dung}, lane: đường làn khác (bản sao), agRoot: bộ máy khác }
export function mkKho(opts = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'gg-kho-'));
  const dau = mkdtempSync(path.join(tmpdir(), 'gg-dau-'));
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(root, '_acceptance', 'feat');
  mkdirSync(ws, { recursive: true });
  const evals = opts.evals || [{ id: 'E1', cmd: 'rang_e1' }];
  // Nháy KÉP có thoát ký tự: bộ đọc config của kit gỡ \\" và \\\\ trong nháy kép, nhưng KHÔNG gỡ '' trong
  // nháy đơn — lệnh có nháy đơn viết trong nháy đơn sẽ tới bash sai (đo 06/10: `trap` không bao giờ chạy).
  const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const extra = opts.extraSuites || [];
  const suiteKeys = ['    - executors.test.suite', ...extra.map(x => `    - executors.test.${x.key}`)].join('\n');
  const testExecs = [`    suite: ${q(opts.suiteCmd || 'sh suite.sh')}`, ...extra.map(x => `    ${x.key}: ${q(x.cmd)}`)].join('\n');
  const scriptExecs = evals.map(e => `    ${e.cmd}: ${q(e.sh || `sh ${e.cmd}.sh`)}`).join('\n');
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'),
    `schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n${suiteKeys}\n${opts.config || ''}executors:\n  test:\n${testExecs}\n  script:\n${scriptExecs}\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n`);
  writeFileSync(path.join(root, 'suite.sh'), opts.suite || 'echo ran >> "$GG_DAU/suite.txt"\nexit 0\n');
  for (const e of evals) if (!e.sh) writeFileSync(path.join(root, `${e.cmd}.sh`), e.body || `echo ran >> "$GG_DAU/${e.id}.txt"\nexit 0\n`);
  for (const [ten, nd] of Object.entries(opts.files || {})) { const p = path.join(root, ten); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, nd); }
  // `status: implemented`, không phải trạng thái đã ký: làn không đọc trạng thái hợp đồng để quyết gì, còn
  // chuỗi trạng thái ký trong tệp ca làm lưới RT13 kêu (tiền lệ repin-lane-noi-ra, d-20260911T162950Z-14).
  writeFileSync(path.join(ws, 'contract.md'), '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n');
  writeFileSync(path.join(ws, 'evals.yaml'), `schema_version: 1\nfeature_slug: feat\nevals:\n${evals.map(e => `  - id: ${e.id}\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.${e.cmd}\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`).join('')}`);
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-10-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
  writeFileSync(path.join(ws, 'evidence-report.md'),
    `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-10-01\n---\n\n## Evidence\n${evals.map(e => `- eval: ${e.id}\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.${e.cmd}\n  verified_at: 2026-10-01\n`).join('')}\n## Iterations\n\nRound 1 — PASS.\n`);
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const laneFile = opts.lane || LANE;
  const agRoot = opts.agRoot || ROOT;
  const envOf = (extraEnv) => ({ ...process.env, GG_DAU: dau, ...(extraEnv || {}) });
  // o.laneFile / o.agRoot: chạy một bản làn khác (bản archive trước vòng) trên CÙNG kho.
  const lane = (args, o = {}) => spawnSync(process.execPath, [o.laneFile || laneFile, '--root', root, '--ag-root', o.agRoot || agRoot, '--slug', 'feat', ...args],
    { encoding: 'utf8', env: envOf(o.env), timeout: o.timeout || 300000, killSignal: 'SIGKILL', maxBuffer: 256 * 1024 * 1024 });
  // Làn chạy NỀN — để gửi tín hiệu vào giữa lệnh. Trả { proc, xong: Promise<{status, signal, stdout, stderr}> }.
  const laneNen = (args, o = {}) => {
    const proc = spawn(process.execPath, [o.laneFile || laneFile, '--root', root, '--ag-root', o.agRoot || agRoot, '--slug', 'feat', ...args], { env: envOf(o.env), stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => { stdout += d; }); proc.stderr.on('data', d => { stderr += d; });
    const xong = new Promise(res => proc.on('close', (status, signal) => res({ status, signal, stdout, stderr })));
    return { proc, xong };
  };
  const pinBanDau = () => { const r = lane(['--reason', 'pin dau', '--write']); if (r.status !== 0) throw new Error(`pin đầu đỏ (${r.status}): ${r.stderr}`); git('add', '-A'); git('commit', '-qm', 'repin'); return r; };
  const docLog = () => readFileSync(path.join(ws, 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const docReport = () => readFileSync(path.join(ws, 'evidence-report.md'), 'utf8');
  const docDau = (ten) => { const p = path.join(dau, ten); return existsSync(p) ? readFileSync(p, 'utf8') : ''; };
  const dem = (ten) => docDau(ten).split('\n').filter(Boolean).length;
  const xoaDau = () => { rmSync(dau, { recursive: true, force: true }); mkdirSync(dau, { recursive: true }); };
  return { root, ws, dau, git, lane, laneNen, pinBanDau, docLog, docReport, docDau, dem, xoaDau };
}

// Lệnh fixture chập chờn: lần 1 đỏ (in một dòng ca kiểu bun), từ lần 2 xanh. Bộ đếm ngoài kho.
export const lenhChapChon = (ten, ca = 'ca-chap-chon') =>
  `n=$(cat "$GG_DAU/${ten}" 2>/dev/null || echo 0); echo $((n+1)) > "$GG_DAU/${ten}"; echo "(fail) ${ca} [1.00ms]"; [ "$n" -ge 1 ]`;

// Lệnh sinh một tiến trình cháu ghi pid ra tệp ngoài kho rồi chờ. bayTerm → cháu phớt lờ SIGTERM.
export const lenhChau = (tepPid = 'chau.pid', { bayTerm = false, ngu = 120 } = {}) => bayTerm
  ? `bash -c 'trap "" TERM; sleep ${ngu}' & echo $! > "$GG_DAU/${tepPid}"; wait`
  : `sleep ${ngu} & echo $! > "$GG_DAU/${tepPid}"; wait`;

export const song = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
export const ngu = (ms) => new Promise(r => setTimeout(r, ms));
// Chờ tệp pid có (dấu dương cháu đã sinh) — vắng sau hạn là ĐỎ «cháu chưa kịp sinh», không phải xanh.
export async function choPid(k, ten = 'chau.pid', hanMs = 20000) {
  const t = Date.now();
  while (Date.now() - t < hanMs) { const s = k.docDau(ten).trim(); if (/^\d+$/.test(s)) return Number(s); await ngu(100); }
  throw new Error(`cháu chưa kịp sinh (${ten} vắng sau ${hanMs} ms)`);
}
export async function choChet(pid, hanMs = 5000) { const t = Date.now(); while (song(pid) && Date.now() - t < hanMs) await ngu(100); return !song(pid); }

// Bộ kiểm chung: in PASS:/FAIL: có mã ca, lọc theo GG_CASES, --ids in danh sách; ca gọi tên mà không
// chạy là ĐỎ (một id gõ sai không được thành xanh rỗng).
export function boKiem(ALL_IDS) {
  if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
  const only = (process.env.GG_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
  let failed = 0; const ran = new Set();
  const ca = async (id, ten, f) => {
    if (only.length && !only.includes(id)) return;
    ran.add(id);
    console.log(`… [${id}] ${ten}`);
    try { await f(); console.log(`PASS: [${id}] ${ten}`); } catch (e) { failed++; console.log(`FAIL: [${id}] ${ten}\n    ${String(e && e.message || e).split('\n').join('\n    ')}`); }
  };
  const ket = () => {
    for (const id of only) if (!ran.has(id)) { failed++; console.log(`FAIL: [${id}] ca gọi tên mà không chạy`); }
    console.log(`\nResults: ${ran.size - failed} passed, ${failed} failed`);
    process.exit(failed ? 1 : 0);
  };
  return { ca, ket };
}
export const ok = (dk, ghim) => { if (!dk) throw new Error(ghim); };
