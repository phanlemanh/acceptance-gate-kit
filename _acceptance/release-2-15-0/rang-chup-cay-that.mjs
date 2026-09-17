#!/usr/bin/env node
// rang-chup-cay-that.mjs — răng của hồ sơ release-2-15-0, chân `cay-that`.
//
// Lời hứa: răng chụp hồ sơ đã thông cổng (feature-loop/scripts/chup-ho-so-da-thong.mjs,
// cắm trong repin-lane.mjs) IM trên cây thật của kit — chạy trọn các suite mà làn ghim
// lại chạy thì 0 tệp của hồ sơ đã thông Cổng Bằng chứng bị chạm. Chiều đỏ của răng
// nằm ở tệp ca tests/scripts/chup-ho-so-da-thong.test.mjs (CH2–CH4, fixture code-sinh);
// ở đây chỉ đo chiều IM, vì chiều im mới là thứ phải đúng trên cây này: răng kêu oan
// thì mọi lượt ghim lại của kit dừng.
//
// Cách đo, chép đúng đường của làn (không dựng bộ chụp thứ hai):
//   1. worktree tách tại HEAD của kho chứa tệp này, trong thư mục tạm — không chạy
//      cùng cây với lượt chấm đang chạy song song;
//   2. hồ sơ đã thông cổng = hoSoDaThong(frontmatterField, DA_THONG_CONG_2) — hỏi lib;
//   3. chụp → chạy tuần tự `feature_loop.suite_keys` (resolveConfigList/resolveConfigKey
//      của lib, như làn) → chụp → soChup.
// `--chi <lệnh>` thay các suite bằng MỘT lệnh — chỉ để phá thử hai chiều của chính
// răng này, không dùng trong eval.
//
//   0  xanh: suite chạy xong exit 0 và 0 tệp bị chạm
//   2  không có nền để đo: không phải kho git · tệp đã theo dõi ngoài _acceptance/ đổi chưa
//      commit · không dựng được worktree · suite_keys
//      rỗng/không giải được · 0 hồ sơ đã thông cổng (chụp rỗng là phép đo chưa sống)
//   3  có tệp của hồ sơ đã thông cổng bị chạm — in từng đường tệp
//   4  một suite đỏ — hồi quy không sạch nên chiều im chưa kết luận được
//   5  thiếu cờ `--chan cay-that`
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const argv = process.argv.slice(2);
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };

let chan = null, chi = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--chan') chan = argv[++i];
  else if (argv[i] === '--chi') chi = argv[++i];
  else stop(5, `FAIL(5): tham số lạ ${argv[i]} — chỉ nhận --chan cay-that [--chi <lệnh>]`);
}
if (chan !== 'cay-that') stop(5, 'FAIL(5): thiếu --chan cay-that');
if (argv.includes('--chi') && !chi) stop(5, 'FAIL(5): --chi khai mà không có lệnh');

const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let head;
try { head = git('rev-parse', 'HEAD'); } catch { stop(2, `FAIL(2): ${ROOT} không phải kho git — không có HEAD để đo`); }

// Không tệp ĐÃ THEO DÕI nào ngoài `_acceptance/` được đổi mà chưa commit: worktree dựng tại
// HEAD không mang thay đổi ấy, nên đo nó là đo một phiên bản KHÁC vật đang chấm (phản biện
// context sạch của mốc, P2). Dừng có tên, không đo.
// Chỉ soi tệp đã theo dõi, có chủ đích: lượt chấm S4 chạy răng này SONG SONG với các suite
// trên cùng cây, và suite hooks sinh tạm thư mục fixture chưa theo dõi — bản đầu soi cả tệp
// chưa theo dõi nên đỏ mã 2 oan ở lượt chấm 1. Giới hạn khai ở hợp đồng: một tệp MỚI chưa
// commit không bị chốt này thấy; lớp đó giữ bằng luật tệp args hết hạn theo HEAD.
const ban = execFileSync('git', ['-C', ROOT, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' })
  .split('\n').filter(Boolean).map(l => l.slice(3)).filter(f => !f.startsWith('_acceptance/') && !f.startsWith('.acceptance-runs/'));
if (ban.length) stop(2, `FAIL(2): cây chấm có ${ban.length} tệp đã theo dõi đổi chưa commit ngoài _acceptance/ — worktree tại HEAD ${head.slice(0, 8)} không phải vật đang chấm:\n${ban.slice(0, 10).map(f => `  - ${f}`).join('\n')}`);

const WT = mkdtempSync(path.join(tmpdir(), 'chup-cay-that-'));
let coWorktree = false;
const don = () => {
  if (coWorktree) { try { git('worktree', 'remove', '--force', WT); } catch { /* dọn tiếp bên dưới */ } }
  try { rmSync(WT, { recursive: true, force: true }); } catch { /* dọn tạm */ }
  try { git('worktree', 'prune'); } catch { /* dọn tạm */ }
};
process.on('exit', don);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));
try { git('worktree', 'add', '--detach', WT, head); coWorktree = true; }
catch (e) { stop(2, `FAIL(2): không dựng được worktree tách tại ${head.slice(0, 8)}: ${String(e.stderr || e.message).trim().split('\n')[0]}`); }

const req = createRequire(import.meta.url);
const core = req(path.join(WT, 'lib', 'evidence-core.cjs'));
const { DA_THONG_CONG_2 } = req(path.join(WT, 'lib', 'workspace-record.cjs'));
const { hoSoDaThong, chup, soChup } = await import(path.join(WT, 'feature-loop', 'scripts', 'chup-ho-so-da-thong.mjs'));

let cmds;
if (chi) cmds = [chi];
else {
  const cfg = readFileSync(path.join(WT, '_acceptance', 'config.yaml'), 'utf8');
  const keys = core.resolveConfigList(cfg, 'feature_loop.suite_keys');
  if (!keys.length) stop(2, 'FAIL(2): config.yaml thiếu feature_loop.suite_keys');
  cmds = keys.map(k => core.resolveConfigKey(cfg, k) || stop(2, `FAIL(2): suite_keys trỏ key không giải được: ${k}`));
}

const daThong = hoSoDaThong(WT, core.frontmatterField, DA_THONG_CONG_2);
if (!daThong.length) stop(2, 'FAIL(2): 0 hồ sơ đã thông cổng trên cây — chụp rỗng, phép đo chưa sống');
const truoc = chup(WT, daThong);
const exits = cmds.map((c, i) => {
  const t0 = Date.now();
  const r = spawnSync('bash', ['-c', c], { cwd: WT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024, env: process.env });
  const code = r.status == null ? 1 : r.status;
  out(`[chup] lệnh ${i + 1}/${cmds.length} exit ${code} (${Math.round((Date.now() - t0) / 1000)} s): ${c}`);
  if (code !== 0) out(String(r.stdout || '').split('\n').filter(l => /FAIL|^Results:/.test(l)).slice(-15).join('\n'));
  return code;
});
const cham = soChup(truoc, chup(WT, daThong));
if (cham.length) stop(3, `FAIL(3): ${cham.length} tệp của hồ sơ đã thông cổng bị chạm tại ${head.slice(0, 8)}:\n${cham.map(c => `  - ${c.tep} (${c.doi})`).join('\n')}`);
if (exits.some(x => x !== 0)) stop(4, `FAIL(4): ${exits.filter(x => x !== 0).length}/${cmds.length} lệnh đỏ — hồi quy không sạch, chiều im chưa kết luận được (0 tệp bị chạm)`);
out(`PASS: chup-cay-that ${daThong.length} ho so da thong cong (${truoc.size} tep) truoc ${cmds.length} lenh tai HEAD ${head.slice(0, 8)} · sau: 0 tep bi cham`);
