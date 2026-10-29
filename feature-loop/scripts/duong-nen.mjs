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
// Dòng của CHÍNH vòng (S1#0 soạn song song với nền): tệp mang slug + `_acceptance/config.yaml` mà
// suite thấy mới, và `VIOLATION [<slug>]` của lưới, vào mục «Dòng vàng» — có tên, không lật nền.
// Vị từ một chỗ: `lib/tep-cua-vong.mjs` (hồ sơ nen-khong-tinh-tep-cua-vong).
//
// Chạy NỀN: chân suite chạy trọn các suite của repo (ở kho kit là chân dài nhất
// của cả vòng) — không lời gọi công cụ nào được ôm trọn thời gian đó.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { tepCuaVong, viPhamCuaVong } from './lib/tep-cua-vong.mjs';

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
// Khuôn dòng VÀNG (hồ sơ nen-khong-tinh-tep-cua-vong): dòng của CHÍNH vòng — có tên, không lật nền.
const khuonDongVang = khoiMarker(templateText, 'DUONG-NEN-DONG-VANG');
if (!khuonDongVang) die(`khuôn ${TEMPLATE_REL} thiếu marker DUONG-NEN-DONG-VANG`);
const DONG_VANG = new Map();
for (const l of khuonDongVang) {
  const m = l.match(/^- ([a-z-]+): `(.*)`$/);
  if (m) DONG_VANG.set(m[1], m[2]);
}
for (const ma of ['suite-tep-cua-vong', 'luoi-cua-vong']) {
  if (!DONG_VANG.has(ma)) die(`khuôn dòng vàng thiếu mã «${ma}» trong ${TEMPLATE_REL}`);
}
const dongVang = (ma, vals = {}) => DONG_VANG.get(ma).replace(/\{(\w+)\}/g, (_, t) => (t in vals ? String(vals[t]) : `{${t}}`));

let initText;
try { initText = fs.readFileSync(path.join(agRoot, INIT_REL), 'utf8'); } catch { die(`thiếu ${INIT_REL} ở ${agRoot}`); }
const khoiCopy = khoiMarker(initText, 'INIT-CI-COPY-LIST');
if (!khoiCopy) die(`${INIT_REL} thiếu marker INIT-CI-COPY-LIST`);
// Neo vào gốc gói: mục nằm dưới thư mục khác (dieu-phoi/scripts/…) không được cắt đuôi thành scripts/… giả.
const TEP_ENGINE = [...new Set(khoiCopy.flatMap(l => [...l.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts|lib)\/[\w./-]+\.\w+)`/g)].map(m => m[1])))];
// Điều kiện của từng mục đọc từ CHÍNH khối (thẻ `[only-if-declared: <khoá>]` cuối dòng), không từ
// danh sách trong mã: tệp chỉ cần khi kho khai một ổ cắm (tin_hieu, lo_trinh) mà kho không khai thì
// vắng ở bản vendored là kho LÀNH (hồ sơ nen-dieu-kien-va-static-khong-do-duoc; crm-onehub#375).
const DIEU_KIEN = new Map();
for (const l of khoiCopy) {
  const m = l.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts|lib)\/[\w./-]+\.\w+)`.*\[only-if-declared: ([a-z_][a-z0-9_]*)\]\s*$/);
  if (m) DIEU_KIEN.set(m[1], m[2]);
}
// «Kho khai <khoá>» = config có dòng cột 0 `<khoá>:` — đúng phép thử product-map.mjs dùng cho tin_hieu.
const khoKhai = khoa => new RegExp(`^${khoa}:`, 'm').test(configText);

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
// Tách chuỗi lệnh executor thành các LỆNH ĐƠN của shell, đủ để gọi tên chương trình chạy đầu.
// Bộ tách hiểu ba thứ (POSIX.1-2017 XCU §2.9.1 Simple Commands): nháy đơn/kép · vùng thay thế
// `$(…)` `${…}` `` `…` `` là MỘT phần của từ dù bên trong có khoảng trắng, nháy hay ngoặc
// (cân ngoặc, lồng được) · `;` `&` `|` ngoài nháy/vùng kết thúc lệnh đơn, trừ `>&`/`<&` là
// chuyển hướng. Không phải một bộ phân tích shell đầy đủ: heredoc, từ khoá điều khiển và
// `$((…))` số học không được hiểu riêng — chúng rơi về luật `tenChuongTrinh` bên dưới.
const laVung = (s, i) => s[i] === '`' || (s[i] === '$' && (s[i + 1] === '(' || s[i + 1] === '{'));
// Chỉ số ngay sau vùng thay thế mở tại `i`; vùng không đóng thì chạy tới hết chuỗi.
function hetVung(s, i) {
  if (s[i] === '`') {
    let j = i + 1;
    while (j < s.length && s[j] !== '`') j += s[j] === '\\' ? 2 : 1;
    return Math.min(j + 1, s.length);
  }
  const mo = s[i + 1]; const dong = mo === '(' ? ')' : '}';
  let sau = 0; let q = null;
  for (let j = i + 1; j < s.length; j += 1) {
    const ch = s[j];
    if (q) { if (ch === '\\' && q === '"') j += 1; else if (ch === q) q = null; continue; }
    if (ch === '\\') { j += 1; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (j > i + 1 && laVung(s, j)) { j = hetVung(s, j) - 1; continue; }
    if (ch === mo) sau += 1;
    else if (ch === dong && (sau -= 1) === 0) return j + 1;
  }
  return s.length;
}
// Một từ = { text: chữ sau khi bỏ nháy (vùng thay thế giữ nguyên văn), con: [thân các lệnh con] }.
function cacLenhDon(cmd) {
  const s = String(cmd); const lenh = []; let tu = []; let w = null;
  const dongTu = () => { if (w) tu.push(w); w = null; };
  const dongLenh = () => { dongTu(); if (tu.length) lenh.push(tu); tu = []; };
  const vung = (i) => {
    const e = hetVung(s, i); w.text += s.slice(i, e);
    // Vùng không đóng (chuỗi cụt) chạy tới hết chuỗi — khi ấy không có ký tự đóng để bỏ.
    const huyen = s[i] === '`';
    const cuoi = e - (s[e - 1] === (huyen ? '`' : ')') && e - 1 > (huyen ? i : i + 1) ? 1 : 0);
    if (huyen) w.con.push(s.slice(i + 1, cuoi));
    else if (s[i + 1] === '(') w.con.push(s.slice(i + 2, cuoi));
    return e;
  };
  for (let i = 0; i < s.length;) {
    const ch = s[i];
    if (/\s/.test(ch)) { dongTu(); i += 1; continue; }
    if (';&|'.includes(ch) && !(ch === '&' && w && /[<>]$/.test(w.text))) { dongLenh(); i += 1; continue; }
    w = w || { text: '', con: [] };
    if (ch === "'") { const j = s.indexOf("'", i + 1); const e = j < 0 ? s.length : j; w.text += s.slice(i + 1, e); i = e + 1; continue; }
    if (ch === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') {
        if (s[j] === '\\') { w.text += s[j + 1] || ''; j += 2; } else if (laVung(s, j)) j = vung(j); else { w.text += s[j]; j += 1; }
      }
      i = j + 1; continue;
    }
    if (ch === '\\') { w.text += s[i + 1] || ''; i += 2; continue; }
    if (laVung(s, i)) { i = vung(i); continue; }
    w.text += ch; i += 1;
  }
  dongLenh();
  return lenh;
}
const LA_GAN = /^[A-Za-z_][A-Za-z0-9_]*=/;
// Từ đầu = từ đầu tiên không phải phép gán của lệnh đơn đầu tiên có tên lệnh. Lệnh đơn
// CHỈ-GÁN thì chương trình chạy thật là lệnh con trong phép gán (`B=$(git merge-base …)` →
// `git`, không phải `merge-base`); chỉ-gán không lệnh con (`A=1 && x`) → xét lệnh đơn kế.
function tuDau(cmd, sau = 0) {
  for (const tu of cacLenhDon(cmd)) {
    const ten = tu.find(w => !LA_GAN.test(w.text));
    if (ten) return ten.text;
    const con = tu.flatMap(w => w.con)[0];
    const t = con !== undefined && sau < 8 ? tuDau(con, sau + 1) : null;
    if (t) return t;
  }
  return null;
}
// <<<CONG-CU-TU-DAU
// Một TỪ ĐẦU chỉ tra được bằng `command -v` khi nó là TÊN CHƯƠNG TRÌNH (hoặc đường dẫn
// tới một chương trình). Từ đầu mang phép thay thế của shell — `${…}` `$(…)` `` `…` ``
// `$VAR` — hoặc mở một nhóm/subshell — `(` `{` — thì nó KHÔNG phải một cái tên, và hỏi
// máy về nó là hỏi sai câu: câu trả lời «không có» nói về một chuỗi cú pháp, không nói gì về
// lệnh. Đó là báo động giả đo được ở `~/dev/crm` nhánh onehub (executors.design.ui_check).
//
// Luật xét đúng TỪ ĐẦU, KHÔNG quét cả chuỗi lệnh: `khong-co-lenh | head` vẫn phải đỏ và
// ghim đúng tên — một bản quét cả chuỗi sẽ tắt luôn cái đèn đang sáng đúng đó (ca NEN-TD2).
const tenChuongTrinh = (tu) => !/[$`({]/.test(tu);
// CONG-CU-TU-DAU>>>

// <<<CONG-CU-DUONG-TEP
// Một TỪ ĐẦU là ĐƯỜNG TỆP khi nó chứa `/` hoặc là tên trần mang đuôi kịch bản. Câu chân công cụ
// hỏi là «công cụ có trên máy không», nên đường tệp được xét theo việc tệp có tồn tại, KHÔNG theo
// quyền chạy: khuôn kit của `executors.design.ui_check` là một tệp .js `-rw-r--r--`, và
// `command -v` trên nó thoát 1 dù tệp nằm trên đĩa (hồ sơ cong-cu-xet-tep-ton-tai). Đường tương
// đối giải theo GỐC KHO — nơi `bashNguoiGoi` chạy lệnh. Thư mục hay liên kết gãy là vắng.
const DUOI_KICH_BAN = /\.[cm]?js$/;
const laDuongTep = (tu) => tu.includes('/') || DUOI_KICH_BAN.test(tu);
const coTep = (tu) => { try { return fs.statSync(path.resolve(root, tu)).isFile(); } catch { return false; } };
// CONG-CU-DUONG-TEP>>>

// <<<BASH-NGUOI-GOI
// Mọi lệnh của kho (tra `command -v` lẫn chạy suite) đi qua MỘT cửa: `bash -c` với ĐÚNG
// môi trường của người gọi — cùng cách `repin-lane.mjs` chạy lệnh. KHÔNG `bash -lc`: shell
// đăng nhập nạp lại profile và đặt lại PATH, nên máy đo một máy KHÁC máy người gọi đang
// đứng. Đo ở crm@onehub 24/09: người gọi trên fnm node 24, `-lc` trả node 22 của
// /usr/local/bin → build «eve requires Node.js >=24» đỏ oan trên cây chưa chạm (ca NEN-ENV).
const bashNguoiGoi = (lenh, thamSo, o) =>
  spawnSync('bash', ['-c', lenh, ...thamSo], { cwd: root, env: process.env, ...o });
// BASH-NGUOI-GOI>>>

const chan = { cong_cu: 'xanh', suite: 'xanh', luoi: 'xanh', engine: 'xanh' };
const DO = [];
const VANG = [];
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
      const coLenh = () => bashNguoiGoi('command -v "$1"', ['_', tu], { stdio: ['ignore', 'ignore', 'ignore'] }).status === 0;
      // Đường có `/` chỉ xét tệp. Tên trần đuôi kịch bản xét tệp ở gốc kho rồi mới tra PATH như
      // trước vòng — nằm trên PATH mà không ở gốc kho thì vẫn xanh như cũ.
      coTrenMay.set(tu, laDuongTep(tu) ? coTep(tu) || (!tu.includes('/') && coLenh()) : coLenh());
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
    const r = bashNguoiGoi(cmd, [], { stdio: ['ignore', 2, 2] });
    kq.push({ khoa, ma: r.status === null ? `tin-hieu-${r.signal}` : r.status });
  }
  return kq;
}
// SUITE-TUAN-TU>>>
{
  // <<<SUITE-TRANG-THAI
  // Trạng thái cây ĐỌC THÔ, KHÔNG qua gitTry(): dòng porcelain mở bằng dấu cách khi cột X trống
  // (` M a.txt`, ` D a.txt`), và trim() cắt dấu cách ấy ở ĐÚNG dòng đầu — tên tệp mất một ký tự
  // và một tệp bẩn sẵn bị đổ cho suite khi thứ tự dòng đổi (hồ sơ nen-cay-ban-dong-dau).
  const trangThai = () => {
    try {
      const o = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return new Set(o.split('\n').filter(Boolean));
    } catch { return new Set(); }
  };
  // SUITE-TRANG-THAI>>>
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
  // Tệp CHÍNH vòng viết trong lúc nền chạy (S1#0 soạn song song) → mục vàng, không lật chân suite.
  const coOHead = d => gitTry('cat-file', '-e', `HEAD:${d}`) !== null;
  for (const dong of trangThai()) {
    if (truoc.has(dong)) continue;
    let tep = dong.slice(3);
    if (tep.includes(' -> ')) tep = tep.split(' -> ').pop();
    if (tepCuaVong(tep, flags.slug, coOHead)) { VANG.push(dongVang('suite-tep-cua-vong', { tep })); continue; }
    chan.suite = 'do';
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
    const tatCa = `${r.stdout || ''}\n${r.stderr || ''}`.split('\n');
    const viPham = tatCa.filter(l => l.startsWith('VIOLATION '));
    // Vi phạm của CHÍNH hồ sơ (S1 viết dở trong lúc nền chạy) → mục vàng. Lưới chỉ được coi là xanh
    // với chúng khi nó TỰ GIẢI THÍCH mã thoát: mã 1 + dòng tóm có số khớp số dòng VIOLATION; lưới
    // chết sau khi in vi phạm (mã khác, dòng tóm vắng hay lệch số) vẫn là LOI CHAY.
    const cuaVong = viPham.filter(l => viPhamCuaVong(l, flags.slug));
    const khac = viPham.filter(l => !viPhamCuaVong(l, flags.slug));
    const tom = tatCa.map(l => l.match(/^pre-merge-check: (\d+) violation\(s\) — merge blocked$/)).find(Boolean);
    const tuGiai = r.status === 1 && !!tom && Number(tom[1]) === viPham.length;
    log(`luoi: ${pm} --base ${base} → ma ${r.status}, ${viPham.length} vi pham (${cuaVong.length} cua chinh vong)`);
    if (cuaVong.length) VANG.push(dongVang('luoi-cua-vong', { k: cuaVong.length }), ...cuaVong);
    if (khac.length) { chan.luoi = 'do'; DO.push(dongDo('luoi-co-san', { k: khac.length }), ...khac); }
    else if (r.status !== 0 && !(cuaVong.length && tuGiai)) { chan.luoi = 'do'; DO.push(dongDo('luoi-loi-chay', { ma: r.status === null ? `tin-hieu-${r.signal}` : r.status })); }
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
      const khoa = DIEU_KIEN.get(tep);
      // Tệp có điều kiện, kho không khai, bản vendored VẮNG → bỏ bản vendored khỏi các cặp của RIÊNG tệp
      // này. Tệp CÓ mặt mà lệch vẫn đỏ: ổ cắm chưa khai không biện minh cho một bản chép cũ nằm trong cây.
      const boVendored = khoa && !khoKhai(khoa) && !fs.existsSync(path.join(root, tep));
      if (boVendored && ban.some(b => b.ten === 'vendored')) log(`engine: bo-qua ${tep} — tệp có điều kiện, kho không khai ${khoa}`);
      const lech = cap.filter(([a, b]) => !(boVendored && (a.ten === 'vendored' || b.ten === 'vendored')))
        .find(([a, b]) => bam(a.goc, tep) !== bam(b.goc, tep));
      if (lech) { chan.engine = 'do'; DO.push(dongDo('engine-lech', { tep, a: lech[0].ten, b: lech[1].ten })); }
    }
    if (ban.length < 2) chan.engine = 'bo-qua';
  }
}

// ── ghi tệp theo khuôn ────────────────────────────────────────────────────────
const nen = Object.values(chan).includes('do') ? 'do' : 'xanh';
const vals = { slug: flags.slug, at: new Date().toISOString(), sha, nen, ...chan };
const out = [];
// Bullet giữ chỗ điền theo MỤC chứa nó: «Dòng đỏ» nhận DO, «Dòng vàng» nhận VANG.
const THEO_MUC = { 'Dòng đỏ': DO, 'Dòng vàng': VANG };
let mucHienTai = null;
for (const l of khuonTep) {
  const fmM = l.match(/^(\w+): \{[^}]*\}$/);
  const hd = l.match(/^##\s+(.+?)\s*$/);
  if (hd) mucHienTai = hd[1];
  if (fmM) {
    if (!(fmM[1] in vals)) die(`khuôn có khoá lạ «${fmM[1]}» trong ${TEMPLATE_REL}`);
    out.push(`${fmM[1]}: ${vals[fmM[1]]}`);
  } else if (/^- \{.*\}$/.test(l)) {
    const ds = THEO_MUC[mucHienTai];
    if (!ds) die(`khuôn ${TEMPLATE_REL} có bullet giữ chỗ ngoài mục «Dòng đỏ»/«Dòng vàng» (mục: ${mucHienTai || 'không có'})`);
    for (const d of (ds.length ? ds : ['không có'])) out.push(`- ${d}`);
  } else out.push(l);
}
const dich = path.join(root, '_acceptance', flags.slug, 'duong-nen.md');
fs.mkdirSync(path.dirname(dich), { recursive: true });
fs.writeFileSync(dich, out.join('\n').replace(/\n*$/, '\n'));
console.log(`duong-nen: nen ${nen} · cong_cu ${chan.cong_cu} · suite ${chan.suite} · luoi ${chan.luoi} · engine ${chan.engine} → ${path.relative(root, dich)}`);
process.exit(nen === 'do' ? 1 : 0);
