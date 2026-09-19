#!/usr/bin/env node
// duong-nen.mjs — ĐƯỜNG NỀN HẠ TẦNG, bước đầu S1 của feature-loop. Không LLM.
//
// Vì sao tồn tại: một lượt chấm bị hạ tầng đốt (công cụ vắng trên máy, suite đỏ
// sẵn, suite ghi rác vào cây, lưới trước-merge nợ vi phạm cũ, engine vendored
// lệch) trông giống hệt một lượt chấm đỏ vì vật. Script đo bốn chân đó TRƯỚC khi
// vòng viết tệp nào và ghi `_acceptance/<slug>/duong-nen.md`, để đỏ của nền được
// quyết ở Cổng Phạm vi chứ không bị tính cho vật ở S4 (hồ sơ thuoc-co-cua AC-6, AC-7).
//
//   node duong-nen.mjs --root <repo> --slug <slug> [--base <ref>]
//        [--ag-root <dir>] [--cache-root <dir>]
//
// Mã thoát: 0 nền xanh · 1 nền đỏ (VẪN ghi tệp) · 2 không chạy được (không phải
// kho git, thiếu config, thiếu feature_loop.suite_keys, thiếu khuôn) — KHÔNG ghi tệp.
//
// Khuôn tệp và khuôn dòng đỏ: MỘT chỗ, `<agRoot>/skills/acceptance/references/
// duong-nen-template.md` (marker DUONG-NEN-TEMPLATE · DUONG-NEN-DONG-DO). Script
// rút khuôn lúc chạy, không chép vào mã. Danh sách tệp engine: rút từ marker
// INIT-CI-COPY-LIST của `<agRoot>/commands/acceptance-init.md`.
//
// Chạy NỀN: chân suite chạy trọn các suite của repo (ở kho kit là chân dài nhất
// của cả vòng) — không lời gọi công cụ nào được ôm trọn thời gian đó.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KNOWN = new Set(['root', 'slug', 'base', 'ag-root', 'cache-root']);
const die = (msg) => { console.error(`duong-nen: ${msg}`); process.exit(2); };
const log = (msg) => { console.error(msg); };

// ── cờ ──
const flags = {};
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    const tok = argv[i];
    if (!tok.startsWith('--')) die(`tham số lạ (không phải cờ): ${tok}`);
    const name = tok.slice(2);
    if (!KNOWN.has(name)) die(`cờ không nhận diện được: ${tok}`);
    if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) die(`cờ ${tok} thiếu giá trị`);
    flags[name] = argv[i + 1]; i += 1;
  }
}
if (!flags.root || !flags.slug) die('usage: duong-nen.mjs --root <repo> --slug <slug> [--base <ref>] [--ag-root <dir>] [--cache-root <dir>]');
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(flags.slug)) die(`slug không hợp lệ: ${flags.slug}`);

const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();

// ── không chạy được → mã 2, không ghi gì. Mọi điều kiện kiểm TRƯỚC khi đo. ──
const gitTry = (...a) => {
  try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch { return null; }
};
if (gitTry('rev-parse', '--show-toplevel') === null) die(`không phải kho git: ${root}`);
const sha = gitTry('rev-parse', 'HEAD');
if (!sha) die(`kho git chưa có commit nào: ${root}`);

const configPath = path.join(root, '_acceptance', 'config.yaml');
let configText;
try { configText = fs.readFileSync(configPath, 'utf8'); } catch { die(`thiếu _acceptance/config.yaml: ${configPath}`); }

const cacheRoots = flags['cache-root'] ? ['--cache-root', flags['cache-root']] : [];
const TEMPLATE_REL = 'skills/acceptance/references/duong-nen-template.md';
const INIT_REL = 'commands/acceptance-init.md';
let agRoot = flags['ag-root'];
if (!agRoot) {
  const rp = spawnSync(process.execPath, [path.join(HERE, 'resolve-plugin.mjs'), '--plugin', 'acceptance-gate',
    '--require', TEMPLATE_REL, '--require', INIT_REL, '--require', 'lib/evidence-core.cjs', ...cacheRoots], { encoding: 'utf8' });
  if (rp.status !== 0) die(`không resolve được plugin acceptance-gate: ${String(rp.stderr || '').split('\n')[0]}`);
  agRoot = rp.stdout.trim().split('\n').pop();
}
agRoot = (() => { try { return fs.realpathSync(agRoot); } catch { return die(`--ag-root không tồn tại: ${agRoot}`); } })();

const require_ = createRequire(import.meta.url);
let resolveConfigKey, resolveConfigList;
try {
  ({ resolveConfigKey, resolveConfigList } = require_(path.join(agRoot, 'lib', 'evidence-core.cjs')));
} catch (e) { die(`không nạp được lib/evidence-core.cjs từ ${agRoot}: ${String(e.message || e).split('\n')[0]}`); }
if (typeof resolveConfigKey !== 'function' || typeof resolveConfigList !== 'function') die('lib/evidence-core.cjs thiếu resolveConfigKey/resolveConfigList — cập nhật plugin acceptance-gate');

const suiteKeys = resolveConfigList(configText, 'feature_loop.suite_keys');
if (!suiteKeys.length) die('thiếu feature_loop.suite_keys trong _acceptance/config.yaml');

const khoiMarker = (text, ten) => {
  const mo = text.indexOf(`<<<${ten}`);
  const dong = text.indexOf(`${ten}>>>`);
  if (mo < 0 || dong < 0 || dong < mo) return null;
  const lines = text.slice(mo, dong).split('\n');
  return lines.slice(1, -1); // bỏ dòng mở marker và phần dòng đóng
};
let templateText;
try { templateText = fs.readFileSync(path.join(agRoot, TEMPLATE_REL), 'utf8'); } catch { die(`thiếu khuôn ${TEMPLATE_REL} ở ${agRoot}`); }
const khuonTep = khoiMarker(templateText, 'DUONG-NEN-TEMPLATE');
const khuonDongDo = khoiMarker(templateText, 'DUONG-NEN-DONG-DO');
if (!khuonTep || !khuonDongDo) die(`khuôn ${TEMPLATE_REL} thiếu marker DUONG-NEN-TEMPLATE hoặc DUONG-NEN-DONG-DO`);
const DONG_DO = new Map();
for (const l of khuonDongDo) {
  const m = l.match(/^- ([a-z-]+): `(.*)`$/);
  if (m) DONG_DO.set(m[1], m[2]);
}
const dongDo = (ma, vals = {}) => {
  const k = DONG_DO.get(ma);
  if (!k) die(`khuôn dòng đỏ thiếu mã «${ma}» trong ${TEMPLATE_REL}`);
  return k.replace(/\{(\w+)\}/g, (_, t) => (t in vals ? String(vals[t]) : `{${t}}`));
};
for (const ma of ['cong-cu-thieu', 'suite-khong-lenh', 'suite-do-san', 'suite-cay-ban', 'luoi-co-san', 'luoi-loi-chay', 'engine-lech', 'engine-tu-host']) {
  if (!DONG_DO.has(ma)) die(`khuôn dòng đỏ thiếu mã «${ma}» trong ${TEMPLATE_REL}`);
}

let initText;
try { initText = fs.readFileSync(path.join(agRoot, INIT_REL), 'utf8'); } catch { die(`thiếu ${INIT_REL} ở ${agRoot}`); }
const khoiCopy = khoiMarker(initText, 'INIT-CI-COPY-LIST');
if (!khoiCopy) die(`${INIT_REL} thiếu marker INIT-CI-COPY-LIST`);
const TEP_ENGINE = [...new Set(khoiCopy.flatMap(l => [...l.matchAll(/\/((?:scripts|lib)\/[\w./-]+\.\w+)`/g)].map(m => m[1])))];

// ── chân cong-cu ──────────────────────────────────────────────────────────────
// Mọi khoá executors.<loại>.<tên>: duyệt thụt lề để LIỆT KÊ tên khoá, đọc GIÁ TRỊ bằng
// resolveConfigKey (bộ đọc một nguồn của evidence-core).
function khoaExecutor(text) {
  const out = [];
  let trong = false; let loai = null;
  for (const raw of String(text).split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    const m = line.trim().match(/^([\w-]+)\s*:/);
    if (indent === 0) { trong = !!m && m[1] === 'executors'; loai = null; continue; }
    if (!trong || !m) continue;
    if (indent === 2) loai = m[1];
    else if (indent === 4 && loai) out.push(`executors.${loai}.${m[1]}`);
  }
  return out;
}
// Từ đầu của lệnh sau khi bỏ các phép gán `TEN=gia-tri` đứng trước (tôn trọng nháy).
// CHÚ Ý: bộ tách này chỉ biết khoảng trắng và nháy — nó KHÔNG hiểu phép thay thế của
// shell, nên với `${VAR:-$(lenh con)}/duong/dan` nó trả về mảnh cụt `${VAR:-$(lenh`.
// Vị từ `tenChuongTrinh` dưới đây là chỗ mảnh cụt ấy bị chặn lại trước `command -v`.
function tuDau(cmd) {
  const toks = []; let cur = ''; let q = null; let co = false;
  for (const ch of String(cmd)) {
    if (q) { if (ch === q) q = null; else cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; co = true; continue; }
    if (/\s/.test(ch)) { if (co || cur) { toks.push(cur); cur = ''; co = false; } continue; }
    cur += ch; co = true;
  }
  if (co || cur) toks.push(cur);
  const t = toks.find(x => !/^[A-Za-z_][A-Za-z0-9_]*=/.test(x));
  return t || null;
}
// <<<CONG-CU-TU-DAU
// Một TỪ ĐẦU chỉ tra được bằng `command -v` khi nó là TÊN CHƯƠNG TRÌNH (hoặc đường dẫn
// tới một chương trình). Từ đầu mang phép thay thế của shell — `${…}` `$(…)` `` `…` ``
// `$VAR` — hoặc mở một nhóm/subshell — `(` `{` — thì nó KHÔNG phải một cái tên, và hỏi
// máy về nó là hỏi sai câu: câu trả lời «không có» nói về chuỗi cụt, không nói gì về
// lệnh. Đó là báo động giả đo được ở `~/dev/crm` nhánh onehub (executors.design.ui_check).
//
// Luật xét đúng TỪ ĐẦU, KHÔNG quét cả chuỗi lệnh: `khong-co-lenh | head` vẫn phải đỏ và
// ghim đúng tên — một bản quét cả chuỗi sẽ tắt luôn cái đèn đang sáng đúng đó (ca NEN-TD2).
const tenChuongTrinh = (tu) => !/[$`({]/.test(tu);
// CONG-CU-TU-DAU>>>

const chan = { cong_cu: 'xanh', suite: 'xanh', luoi: 'xanh', engine: 'xanh' };
const DO = [];
{
  const coTrenMay = new Map();
  for (const khoa of khoaExecutor(configText)) {
    const cmd = resolveConfigKey(configText, khoa);
    if (!cmd) continue;
    const tu = tuDau(cmd);
    if (!tu) continue;
    // Bỏ qua KHÔNG im lặng: chân không đỏ, nhưng stderr nói ra khoá nào không được tra —
    // cùng nếp `bo-qua`-in-stderr của chân `luoi` và chân `engine`. Đúng MỘT dòng cho
    // MỘT khoá bị bỏ tra, không in cho chắc (ca NEN-TD4 đếm chiều này).
    if (!tenChuongTrinh(tu)) {
      console.error(`cong-cu: bo qua ${khoa} — tu dau «${tu}» dung cu phap shell, khong phai ten chuong trinh`);
      continue;
    }
    if (!coTrenMay.has(tu)) {
      const r = spawnSync('bash', ['-lc', 'command -v "$1"', '_', tu], { cwd: root, stdio: ['ignore', 'ignore', 'ignore'] });
      coTrenMay.set(tu, r.status === 0);
    }
    if (!coTrenMay.get(tu)) { chan.cong_cu = 'do'; DO.push(dongDo('cong-cu-thieu', { tu, khoa })); }
  }
}

// ── chân suite ────────────────────────────────────────────────────────────────
// Mỗi lệnh suite một tiến trình con, LẦN LƯỢT: suite này thoát xong suite kế mới
// bắt đầu. Đầu ra của suite đổ sang stderr của script (stdout giữ cho tóm tắt).
// <<<SUITE-TUAN-TU
async function chaySuite(root, lenh) {
  const kq = [];
  for (const { khoa, cmd } of lenh) {
    const r = spawnSync('bash', ['-lc', cmd], { cwd: root, stdio: ['ignore', 2, 2] });
    kq.push({ khoa, ma: r.status === null ? `tin-hieu-${r.signal}` : r.status });
  }
  return kq;
}
// SUITE-TUAN-TU>>>
{
  const trangThai = () => new Set((gitTry('status', '--porcelain', '--untracked-files=all') || '').split('\n').filter(Boolean));
  const truoc = trangThai();
  const lenh = [];
  for (const khoa of suiteKeys) {
    const cmd = resolveConfigKey(configText, khoa);
    if (!cmd) { chan.suite = 'do'; DO.push(dongDo('suite-khong-lenh', { khoa })); continue; }
    lenh.push({ khoa, cmd });
  }
  log(`suite: chay ${lenh.length} lenh tuan tu`);
  for (const { khoa, ma } of await chaySuite(root, lenh)) {
    if (ma !== 0) { chan.suite = 'do'; DO.push(dongDo('suite-do-san', { khoa, ma })); }
  }
  for (const dong of trangThai()) {
    if (truoc.has(dong)) continue;
    chan.suite = 'do';
    let tep = dong.slice(3);
    if (tep.includes(' -> ')) tep = tep.split(' -> ').pop();
    DO.push(dongDo('suite-cay-ban', { tep }));
  }
}

// ── chân luoi ─────────────────────────────────────────────────────────────────
// Chạy lưới đúng như CI: có base là merge-base với nhánh gốc, KHÔNG --slug.
{
  const vendored = path.join(root, 'scripts', 'pre-merge-check.sh');
  const pm = fs.existsSync(vendored) ? vendored : path.join(agRoot, 'scripts', 'pre-merge-check.sh');
  let base = flags.base || null;
  let lyDo = null;
  if (!fs.existsSync(pm)) lyDo = 'không tìm thấy pre-merge-check.sh (vendored lẫn plugin)';
  else if (!base) {
    let goc = null;
    const oh = gitTry('symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD');
    if (oh) goc = oh.replace(/^refs\/remotes\//, '');
    if (!goc) for (const b of ['main', 'master', 'develop', 'trunk']) if (gitTry('rev-parse', '--verify', '--quiet', b) !== null) { goc = b; break; }
    if (!goc) lyDo = 'không dò được nhánh gốc (origin/HEAD, main, master, develop, trunk) — truyền --base <ref>';
    else {
      base = gitTry('merge-base', goc, 'HEAD');
      if (!base) lyDo = `không tính được merge-base giữa ${goc} và HEAD`;
    }
  }
  if (lyDo) { chan.luoi = 'bo-qua'; log(`luoi: bo-qua — ${lyDo}`); }
  else {
    const r = spawnSync('bash', [pm, root, '--base', base, '--no-t1-escape'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const viPham = `${r.stdout || ''}\n${r.stderr || ''}`.split('\n').filter(l => l.startsWith('VIOLATION '));
    log(`luoi: ${pm} --base ${base} → ma ${r.status}, ${viPham.length} vi pham`);
    if (viPham.length) { chan.luoi = 'do'; DO.push(dongDo('luoi-co-san', { k: viPham.length }), ...viPham); }
    else if (r.status !== 0) { chan.luoi = 'do'; DO.push(dongDo('luoi-loi-chay', { ma: r.status === null ? `tin-hieu-${r.signal}` : r.status })); }
  }
}

// ── chân engine ───────────────────────────────────────────────────────────────
{
  if (root === agRoot) {
    log(dongDo('engine-tu-host'));
  } else {
    log(`engine: bam ${TEP_ENGINE.length} tep`);
    const bam = (goc, tep) => { try { return createHash('sha256').update(fs.readFileSync(path.join(goc, tep))).digest('hex'); } catch { return null; } };
    const ban = [];
    if (TEP_ENGINE.some(t => fs.existsSync(path.join(root, t)))) ban.push({ ten: 'vendored', goc: root });
    else log('engine: vendored bo-qua — repo không vendored tệp engine nào');
    const rp = spawnSync(process.execPath, [path.join(HERE, 'resolve-plugin.mjs'), '--plugin', 'acceptance-gate', '--json', ...cacheRoots], { encoding: 'utf8' });
    let cache = null;
    if (rp.status === 0) { try { cache = JSON.parse(rp.stdout).root; } catch { cache = null; } }
    if (cache) { ban.push({ ten: 'cache', goc: cache }); log(`engine: cache ${cache}`); }
    else log('engine: cache bo-qua — không tìm thấy plugin acceptance-gate trong cache');
    ban.push({ ten: 'dang-chay', goc: agRoot });
    const cap = [];
    for (let i = 0; i < ban.length; i += 1) for (let j = i + 1; j < ban.length; j += 1) cap.push([ban[i], ban[j]]);
    // Thứ tự gọi tên: so với bản đang chạy trước, rồi vendored với cache.
    cap.sort((x, y) => (y[1].ten === 'dang-chay') - (x[1].ten === 'dang-chay'));
    for (const tep of TEP_ENGINE) {
      const lech = cap.find(([a, b]) => bam(a.goc, tep) !== bam(b.goc, tep));
      if (lech) { chan.engine = 'do'; DO.push(dongDo('engine-lech', { tep, a: lech[0].ten, b: lech[1].ten })); }
    }
    if (ban.length < 2) chan.engine = 'bo-qua';
  }
}

// ── ghi tệp theo khuôn ────────────────────────────────────────────────────────
const nen = Object.values(chan).includes('do') ? 'do' : 'xanh';
const vals = { slug: flags.slug, at: new Date().toISOString(), sha, nen, ...chan };
const out = [];
for (const l of khuonTep) {
  const fmM = l.match(/^(\w+): \{[^}]*\}$/);
  if (fmM) {
    if (!(fmM[1] in vals)) die(`khuôn có khoá lạ «${fmM[1]}» trong ${TEMPLATE_REL}`);
    out.push(`${fmM[1]}: ${vals[fmM[1]]}`);
  } else if (/^- \{.*\}$/.test(l)) {
    for (const d of (DO.length ? DO : ['không có'])) out.push(`- ${d}`);
  } else out.push(l);
}
const dich = path.join(root, '_acceptance', flags.slug, 'duong-nen.md');
fs.mkdirSync(path.dirname(dich), { recursive: true });
fs.writeFileSync(dich, out.join('\n').replace(/\n*$/, '\n'));
console.log(`duong-nen: nen ${nen} · cong_cu ${chan.cong_cu} · suite ${chan.suite} · luoi ${chan.luoi} · engine ${chan.engine} → ${path.relative(root, dich)}`);
process.exit(nen === 'do' ? 1 : 0);
