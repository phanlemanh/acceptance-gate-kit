#!/usr/bin/env node
// rang-goal.mjs — răng của hồ sơ release-2-15-0, chân `khuon-goal`.
//
// Lời hứa ĐO ĐƯỢC của nhát sửa GOAL-TEMPLATE (owner phê 17/09, vá-trong-mốc): khuôn
// ở cây KHÁC khuôn ở lần cắt số trước (bản tiêm phải khác bản gốc), và tệp
// `mau-goal/khuon-cu.txt` — đầu vào của hội đồng chấm — BẰNG đúng khuôn rút từ kho
// tại lần cắt số trước, không chép tay. Ba bản chép khớp nhau và đúng 6 dòng là việc
// của ca thường trực P85; răng này không dựng lại nó.
//
// Phần NGHĨA — bộ chấm của hook nhận hai lần dừng hợp lệ mà vẫn chặn lần dừng lười —
// KHÔNG đo được bằng máy: lúc dựng hồ sơ, một bộ chấm dựng lại cho CÙNG phán quyết với
// khuôn cũ và khuôn mới ở cả 16 lượt chấm (hợp đồng, Known limits). Phần ấy là tiêu
// chí judgment, không phải răng này.
//
// NEO: commit mới nhất đổi dòng version của manifest acceptance-gate mà số tại đó
// khác số ở cây — lần cắt số trước. Khuôn rút qua marker của SKILL feature-loop.
//
//   0  xanh
//   2  không có nền: không git · không tìm được neo · không rút được khuôn ở neo hoặc ở cây
//   3  khuôn ở cây BẰNG khuôn ở neo — nhát sửa chưa có
//   4  mau-goal/khuon-cu.txt KHÁC khuôn rút từ neo
//   8  thiếu cờ `--chan khuon-goal`
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const out = (s) => process.stdout.write(s + '\n');
const stop = (code, msg) => { out(msg); process.exit(code); };
const argv = process.argv.slice(2);
if (argv.length !== 2 || argv[0] !== '--chan' || argv[1] !== 'khuon-goal') stop(8, 'FAIL(8): cần đúng --chan khuon-goal');

const git = (...a) => { const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { code: r.status, out: String(r.stdout || '') }; };
if (git('rev-parse', 'HEAD').code !== 0) stop(2, `FAIL(2): ${ROOT} không phải kho git`);

const MAN = '.claude-plugin/plugin.json';
const SKILL = 'feature-loop/skills/feature-loop/SKILL.md';
let soCay;
try { soCay = JSON.parse(readFileSync(path.join(ROOT, MAN), 'utf8')).version; } catch (e) { stop(2, `FAIL(2): không đọc được số ở ${MAN}`); }
let neo = null, soNeo = null;
for (const c of git('log', '--format=%H', '-G', '"version":', '--', MAN).out.trim().split('\n').filter(Boolean)) {
  const t = git('show', `${c}:${MAN}`);
  if (t.code !== 0) continue;
  try { const v = JSON.parse(t.out).version; if (v !== soCay) { neo = c; soNeo = v; break; } } catch { /* thử commit kế */ }
}
if (!neo) stop(2, `FAIL(2): không tìm được lần cắt số trước (số ở cây ${soCay})`);

const RX = /<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->/;
const tai = git('show', `${neo}:${SKILL}`);
const mNeo = tai.code === 0 ? tai.out.match(RX) : null;
if (!mNeo) stop(2, `FAIL(2): không rút được GOAL-TEMPLATE của ${SKILL} tại neo ${neo.slice(0, 8)}`);
const mCay = readFileSync(path.join(ROOT, SKILL), 'utf8').match(RX);
if (!mCay) stop(2, `FAIL(2): không rút được GOAL-TEMPLATE của ${SKILL} ở cây`);
if (mCay[1] === mNeo[1]) stop(3, `FAIL(3): GOAL-TEMPLATE ở cây BẰNG khuôn tại lần cắt số ${soNeo} (${neo.slice(0, 8)}) — nhát sửa chưa có`);

let cu;
try { cu = readFileSync(path.join(HERE, 'mau-goal', 'khuon-cu.txt'), 'utf8'); } catch { stop(4, 'FAIL(4): thiếu mau-goal/khuon-cu.txt'); }
if (cu !== mNeo[1]) stop(4, `FAIL(4): mau-goal/khuon-cu.txt KHÁC khuôn rút từ lần cắt số ${soNeo} (${neo.slice(0, 8)}) — đầu vào hội đồng không phải khuôn cũ thật`);

const doiDong = mCay[1].split('\n').filter((l, i) => l !== mNeo[1].split('\n')[i]).length;
out(`PASS: khuon-goal khac khuon tai lan cat so ${soNeo} (${neo.slice(0, 8)}) o ${doiDong} dong · mau-goal/khuon-cu.txt bang khuon rut tu neo`);
