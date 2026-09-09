#!/usr/bin/env node
// repin-lane.mjs — làn re-pin bằng MÁY (hồ sơ repin-chay-lai-eval, 2026-09-07).
//
// Vì sao tồn tại: nghi thức re-pin cũ chỉ chạy bốn lệnh suite của kho; dòng
// {"kind":"repin"} chỉ mang suites_exit, không gì buộc chạy lại eval của CHÍNH
// hồ sơ được ghim. Một hồ sơ mất tiền đề sau hợp nhất 88 commit vẫn ghim lại
// xanh và đi thẳng nhánh chính với CI xanh (crm-onehub, 07/09/2026). Nay làn là
// một script: chạy suite_keys + MỌI eval test/script của TỪNG hồ sơ tại HEAD
// (một lệnh trùng chỉ chạy một lần), ghi kết quả vào dòng repin (`evals_exit`),
// và bên đọc (recheck-evidence.cjs + pre-merge-check.sh, luật checkRepinEvals
// trong lib/evidence-core.cjs) đòi đúng vật đó. Lời dặn không còn là nghiệm.
//
//   node repin-lane.mjs --root <repo> --slug <s> [--slug <s2> ...]
//        [--reason "<lý do 1 dòng>"] [--run-id <id>] [--ag-root <path>]
//        [--write] [--allow-dirty]
//
// exit 0 = làn xanh (đã ghi run-log + evidence-report nếu --write, rồi tự kiểm
//          bằng recheck-evidence.cjs) · 1 = làn ĐỎ — KHÔNG ghi gì, khắc phục rồi
//          chạy làn MỚI · 2 = nguồn thiếu/hỏng (config, evals.yaml, report, cây
//          bẩn, ref không giải được) · 3 = usage.
// Mọi lệnh chạy bằng `bash -c` tại gốc kho với env hiện tại (đặt
// CLAUDE_PLUGIN_ROOT… như khi chạy S4). stdout = JSON kết quả; tiến trình ở stderr.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KNOWN = new Set(['root', 'slug', 'reason', 'run-id', 'ag-root', 'write', 'allow-dirty']);
const BOOL = new Set(['write', 'allow-dirty']);

function usage(msg) { console.error(`repin-lane: ${msg}\nusage: repin-lane.mjs --root <repo> --slug <s> [--slug <s2> ...] [--reason "<lý do>"] [--run-id <id>] [--ag-root <path>] [--write] [--allow-dirty]`); process.exit(3); }
function die(msg) { console.error(`repin-lane: ${msg}`); process.exit(2); }
const log = (s) => process.stderr.write(`[lane] ${s}\n`);

const flags = { slug: [] };
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    const tok = argv[i];
    if (!tok.startsWith('--')) usage(`tham số lạ (không phải cờ): ${tok}`);
    const name = tok.slice(2);
    if (!KNOWN.has(name)) usage(`cờ không nhận diện được: ${tok}`);
    if (BOOL.has(name)) { flags[name] = true; continue; }
    if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) usage(`cờ ${tok} thiếu giá trị`);
    if (name === 'slug') flags.slug.push(argv[i + 1]); else flags[name] = argv[i + 1];
    i += 1;
  }
}
if (!flags.root || !flags.slug.length) usage('thiếu --root hoặc --slug');
const slugs = [...new Set(flags.slug)];

const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();
const readOr = (p, what) => { try { return fs.readFileSync(p, 'utf8'); } catch { return die(`${what} không đọc được: ${p}`); } };
const configText = readOr(path.join(root, '_acceptance', 'config.yaml'), 'config.yaml');

// ── acceptance-gate root: --ag-root (tự host) hoặc resolve-plugin ─────────
const AG_REQUIRES = ['lib/evidence-core.cjs', 'lib/eval-yaml.cjs', 'scripts/recheck-evidence.cjs'];
let agRoot = flags['ag-root'];
if (!agRoot) {
  try {
    const out = execFileSync(process.execPath, [path.join(HERE, 'resolve-plugin.mjs'), '--plugin', 'acceptance-gate', ...AG_REQUIRES.flatMap(r => ['--require', r])], { encoding: 'utf8' });
    agRoot = out.trim().split('\n').pop();
  } catch (e) { die(`không resolve được plugin acceptance-gate: ${String(e.message || e).split('\n')[0]}`); }
}
agRoot = (() => { try { return fs.realpathSync(agRoot); } catch { return die(`--ag-root không tồn tại: ${agRoot}`); } })();
for (const r of AG_REQUIRES) if (!fs.existsSync(path.join(agRoot, r))) die(`acceptance-gate root thiếu ${r} (root: ${agRoot}) — cần acceptance-gate ≥ 2.9.0`);
const require_ = createRequire(import.meta.url);
const core = require_(path.join(agRoot, 'lib', 'evidence-core.cjs'));
const { parseEvals, expectedExits } = require_(path.join(agRoot, 'lib', 'eval-yaml.cjs'));
for (const fn of ['resolveConfigKey', 'resolveConfigList', 'REPIN_MACHINE_EXECUTORS']) if (core[fn] === undefined) die(`lib/evidence-core.cjs thiếu ${fn} — acceptance-gate quá cũ (cần ≥ 2.9.0)`);

// ── git: sha = HEAD, cây phải sạch ngoài _acceptance/ (pin phải là cây đã đo) ──
const gitRaw = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return die(`git ${a[0]} thất bại tại ${root}: ${String(e.stderr || e.message).trim().split('\n')[0]}`); } };
const git = (...a) => gitRaw(...a).trim();
const sha = git('rev-parse', 'HEAD');
if (!/^[0-9a-f]{40}$/.test(sha)) die(`HEAD không phải SHA 40 hex: ${sha}`);
{
  // porcelain v1: hai cột trạng thái + khoảng trắng + đường dẫn — KHÔNG trim
  // cả đầu ra (mất khoảng trắng đầu dòng đầu là cắt sai đường dẫn).
  const dirty = gitRaw('status', '--porcelain', '--untracked-files=no').split('\n').filter(Boolean)
    .map(l => l.replace(/^.{2}\s/, '').replace(/^.* -> /, '').trim()).filter(p => !p.startsWith('_acceptance/'));
  if (dirty.length && !flags['allow-dirty']) die(`cây bẩn ngoài _acceptance/ — pin ${sha.slice(0, 7)} sẽ không phải cây đã đo: ${dirty.slice(0, 5).join(', ')}${dirty.length > 5 ? ' …' : ''} (commit trước, hoặc --allow-dirty nếu cố ý)`);
  if (dirty.length) log(`CẢNH BÁO --allow-dirty: ${dirty.length} file sửa chưa commit ngoài _acceptance/ — kết quả đo cây bẩn`);
}

// ── suites từ feature_loop.suite_keys — cùng reader với S4 (s4-args.mjs) ──
const suiteKeys = core.resolveConfigList(configText, 'feature_loop.suite_keys');
if (!suiteKeys.length) die('config.yaml thiếu feature_loop.suite_keys (hoặc rỗng) — khai danh sách suite chạy mỗi lượt rồi chạy lại');
const suiteCmds = suiteKeys.map(k => core.resolveConfigKey(configText, k) || die(`suite_keys trỏ key không giải được: ${k}`));

// ── eval máy của từng hồ sơ: executor test/script, cmd đã giải ───────────
const MACHINE = new Set(core.REPIN_MACHINE_EXECUTORS);
const perSlug = slugs.map(slug => {
  const ws = path.join(root, '_acceptance', slug);
  const reportPath = path.join(ws, 'evidence-report.md');
  if (!fs.existsSync(reportPath)) die(`${slug}: không có evidence-report.md — không có pin nào để ghim lại`);
  const report = fs.readFileSync(reportPath, 'utf8');
  if (!/^verified_commit\s*:\s*\S+/m.test(report)) die(`${slug}: evidence-report.md không có verified_commit (khuôn cũ) — không ghim được, verify lại`);
  const evalsText = readOr(path.join(ws, 'evals.yaml'), `${slug}: evals.yaml`);
  const { byId: expById, errs: expErrs } = expectedExits(evalsText);
  if (expErrs.length) die(`${slug}: evals.yaml khai mã thoát mong đợi sai luật —\n  ${expErrs.join('\n  ')}`);
  const evals = parseEvals(evalsText, ['executor', 'cmd'])
    .filter(e => MACHINE.has(String(e.executor || '').trim().toLowerCase()))
    .map(e => {
      let cmd = String(e.cmd || '').trim();
      if (!cmd) die(`${slug}: eval ${e.id} (executor ${e.executor}) không có cmd`);
      if (cmd.startsWith('config:')) cmd = core.resolveConfigKey(configText, cmd.slice('config:'.length)) || die(`${slug}: eval ${e.id} trỏ ${cmd} không giải được trong config.yaml`);
      return { id: e.id, cmd, expected: expById.get(e.id) || 0 };
    });
  return { slug, ws, reportPath, report, evals };
});

// ── chạy: một lệnh trùng chỉ chạy MỘT lần (dedupe cmd như S4) ─────────────
const results = new Map(); // cmd → exit
function runCmd(cmd, label) {
  if (results.has(cmd)) { log(`${label}: (đã chạy) → exit ${results.get(cmd)}`); return results.get(cmd); }
  const t0 = Date.now();
  const r = spawnSync('bash', ['-c', cmd], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024, env: process.env });
  const exit = r.status === null ? 1 : r.status;
  results.set(cmd, exit);
  log(`${label}: ${cmd} → exit ${exit} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  if (exit !== 0) {
    const tail = (String(r.stdout || '') + String(r.stderr || '')).split('\n').filter(Boolean).slice(-30);
    for (const l of tail) process.stderr.write(`    ${l}\n`);
  }
  return exit;
}
log(`sha ${sha} · ${suiteCmds.length} suite · ${perSlug.length} hồ sơ · ${perSlug.reduce((n, s) => n + s.evals.length, 0)} eval máy`);
const suitesExit = suiteCmds.map((c, i) => runCmd(c, `suite ${i + 1}/${suiteCmds.length}`));
for (const s of perSlug) for (const e of s.evals) e.exit = runCmd(e.cmd, `${s.slug} ${e.id}`);

// ── kết quả ─────────────────────────────────────────────────────────────
const now = new Date();
const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
const runId = flags['run-id'] || `repin-${iso.replace(/[-:]/g, '')}-${Math.floor(Math.random() * 90000 + 10000)}`;
const day = iso.slice(0, 10);
const reason = flags.reason || 'ghim lại bằng làn eval';
const out = { run_id: runId, sha, ts: iso, suites: suiteCmds.map((cmd, i) => ({ cmd, exit: suitesExit[i] })), slugs: {} };
let red = suitesExit.some(x => x !== 0);
for (const s of perSlug) {
  const evalsExit = {};
  const gioiHan = [];    // đạt đúng một mã khác 0 đã khai
  const hetGioiHan = []; // khai mã khác 0 mà nay trả 0
  let dat = 0;
  for (const e of s.evals) {
    evalsExit[e.id] = e.exit;
    const datKyVong = e.exit === e.expected;
    const hetHan = e.expected !== 0 && e.exit === 0;   // AC-10: không phạt một cải thiện
    if (!datKyVong && !hetHan) { red = true; continue; }
    dat++;
    if (datKyVong && e.expected !== 0) gioiHan.push(`${e.id}=${e.exit}`);
    if (hetHan) hetGioiHan.push(`${e.id} (khai ${e.expected})`);
  }
  const n = (s.report.match(/^### Re-pin/gm) || []).length + 1;
  const line = JSON.stringify({ ts: iso, kind: 'repin', run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit });
  const veGioiHan = gioiHan.length ? ` · đạt-có-giới-hạn: ${gioiHan.join(', ')}` : '';
  const veHet = hetGioiHan.length ? ` · giới hạn đã khai không còn: ${hetGioiHan.join(', ')}` : '';
  const section = `### Re-pin lần ${n} — ${day}, do ${reason}\nrun_id: ${runId}\nsha: ${sha} · suites: ${suiteCmds.length} lệnh exit 0 · evals: ${dat}/${s.evals.length} eval máy đạt kỳ vọng${veGioiHan}${veHet}\n`;
  out.slugs[s.slug] = { evals_exit: evalsExit, line, section };
}
if (red) {
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  const lech = (e) => e.exit !== e.expected && !(e.expected !== 0 && e.exit === 0);
  console.error(`repin-lane: LÀN ĐỎ — không ghi gì (suite ${JSON.stringify(suitesExit)}; eval đỏ: ${perSlug.flatMap(s => s.evals.filter(lech).map(e => `${s.slug}/${e.id}=${e.exit}${e.expected !== 0 ? ` (khai ${e.expected})` : ''}`)).join(', ') || 'không'}). Khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới); không ký mù.`);
  process.exit(1);
}
if (flags.write) {
  for (const s of perSlug) {
    const o = out.slugs[s.slug];
    const logPath = path.join(s.ws, 'run-log.jsonl');
    const prev = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
    fs.writeFileSync(logPath, prev + (prev && !prev.endsWith('\n') ? '\n' : '') + o.line + '\n');
    let rep = s.report.replace(/^(verified_commit\s*:\s*)\S+/m, `$1${sha}`);
    rep = rep + (rep.endsWith('\n') ? '' : '\n') + '\n' + o.section;
    fs.writeFileSync(s.reportPath, rep);
    log(`ghi ${s.slug}: run-log +1 dòng · verified_commit → ${sha.slice(0, 7)} · section Re-pin (${Object.keys(o.evals_exit).length} eval máy)`);
    // Tự kiểm bằng CHÍNH bên đọc — writer không được tin mình.
    const rc = spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'recheck-evidence.cjs'), s.reportPath], { encoding: 'utf8' });
    if (rc.status !== 0) { console.error(`repin-lane: ${s.slug} đã ghi nhưng recheck-evidence ĐỎ (exit ${rc.status}) — sửa trước khi commit:\n${rc.stderr}`); process.exit(1); }
    log(`${s.slug}: recheck-evidence xanh`);
  }
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
log(`LÀN XANH — run_id ${runId}${flags.write ? ' (đã ghi)' : ' (chưa ghi: thêm --write)'}`);
