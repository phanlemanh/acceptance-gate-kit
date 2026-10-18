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
//        [--write] [--allow-dirty] [--tung-ho-so]
//
// --tung-ho-so (hồ sơ ho-so-da-ky-giu-tuoi): suite chung vẫn chạy MỘT lần; suite đỏ → không hồ sơ nào được
//   ghim (thoát 1, «suite chung đỏ — không ghim hồ sơ nào»); suite xanh → mỗi hồ sơ tự quyết: mọi eval đạt
//   thì ghim, có eval đỏ thì hồ sơ ấy nhận `repin-do`, hồ sơ khác vẫn ghim; thoát 0. Không cờ → một đỏ là
//   không ai ghim, như trước.
//
// exit 0 = làn xanh (đã ghi run-log + evidence-report nếu --write, rồi tự kiểm
//          bằng recheck-evidence.cjs) · 1 = làn ĐỎ — KHÔNG ghi gì, khắc phục rồi
//          chạy làn MỚI · 2 = nguồn thiếu/hỏng (bộ máy acceptance-gate thiếu
//          tệp/export hoặc nạp lỗi, config, evals.yaml, report, cây bẩn, ref
//          không giải được) · 3 = usage.
// Mọi lệnh chạy bằng `bash -c` tại gốc kho với env hiện tại (đặt
// CLAUDE_PLUGIN_ROOT… như khi chạy S4). stdout = JSON kết quả; tiến trình ở stderr.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
// globToRe: CÙNG hàm khớp glob mà S4 dùng cho vùng vật (feature-loop/scripts/
// carry-plan.mjs) — hai bản khớp glob là hai khuôn sẽ trôi (đã trôi thật ở ký tự `?`).
import { globToRe } from './carry-plan.mjs';
// Chụp cây hồ sơ đã thông Cổng Bằng chứng trước/sau khi chạy executor — sau cổng,
// `_acceptance/<slug>/` là sử liệu chỉ đọc (crm-onehub 16/09/2026: một spec trong
// suite chung ghi đè evidence/ đã ký sau mỗi lượt chạy mà không làn nào đỏ).
import { hoSoDaThong, chup, soChup } from './chup-ho-so-da-thong.mjs';
// Dòng tự xưng của bàn đo cho dấu lượt đỏ — không bao giờ ném (hồ sơ lan-ghim-lai-giu-tron-loi-loi).
import { docTai } from './tai-may.mjs';
// Hồ sơ gia-lan-ghim-lai (Vòng A): chạy lệnh trong nhóm riêng + dừng sạch cả cây (Đ5), quyết chạy lại
// một lần (Đ4), năm khoá của làn + tổng kết cuối lượt.
import { chayLenh } from './lib/chay-lenh.mjs';
import { docKhoa, doChiPhi, dungTongKet } from './lib/lan-khoa.mjs';
import { coChayLai, rutTenCa } from './lib/chay-lai.mjs';
// Hồ sơ eval-goi-model-that-khong-chay (hàng G3): dùng lại eval model thật khi băm đầu vào không đổi.
import { chayVanTay, tepGoiTen, coBienShell, bamDauVao, chonNguon, phatHienLech, docRunLog, LY_DO_CHAY, TEP_LAN_GHI } from './lib/dung-lai-model.mjs';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KNOWN = new Set(['root', 'slug', 'reason', 'run-id', 'ag-root', 'write', 'allow-dirty', 'skip-unchanged', 'tran-phut', 'chay-lai-model', 'tung-ho-so']);
// Đồng hồ trần (AC-2) tính từ lúc làn KHỞI ĐỘNG, không từ suite đầu.
const tKhoiDong = Date.now();
const BOOL = new Set(['write', 'allow-dirty', 'skip-unchanged', 'chay-lai-model', 'tung-ho-so']);

function usage(msg) { console.error(`repin-lane: ${msg}\nusage: repin-lane.mjs --root <repo> --slug <s> [--slug <s2> ...] [--reason "<lý do>"] [--run-id <id>] [--ag-root <path>] [--write] [--allow-dirty] [--skip-unchanged] [--tran-phut <phút>] [--chay-lai-model] [--tung-ho-so]`); process.exit(3); }
function die(msg) { console.error(`repin-lane: ${msg}`); process.exit(2); }
// Thoát SAU khi stdout đã xả (hồ sơ xa-stdout-truoc-khi-thoat): JSON làn đỏ in mọi slug, vượt bộ đệm
// pipe (65 536 byte trên macOS) từ vài chục slug; process.exit ngay thì phần sau mất im lặng. Lần ghi
// rỗng chỉ gọi callback sau mọi lần ghi trước; lời hứa không bao giờ xong nên mã phía dưới không chạy.
const xaRoiThoat = (ma) => new Promise(() => { process.stdout.write('', () => process.exit(ma)); });
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
// Bỏ qua KHÔNG BAO GIỜ là một pin: một lượt bỏ qua không chạy suite nào, nên nó
// không có tư cách ghi dòng repin. Hai cờ loại trừ nhau, fail-CLOSED ở usage.
if (flags['tran-phut'] !== undefined && !(Number.isFinite(Number(flags['tran-phut'])) && Number(flags['tran-phut']) > 0)) usage(`--tran-phut phải là số phút > 0 (nhận «${flags['tran-phut']}»)`);
if (flags['skip-unchanged'] && flags.write) usage('--skip-unchanged và --write loại trừ nhau: một lượt bỏ qua không chạy phép đo nào nên không được ghi pin. Chạy ĐO trước (--skip-unchanged), rồi ghim bằng một làn thật (--write) nếu cần');
const slugs = [...new Set(flags.slug)];

const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();
const readOr = (p, what) => { try { return fs.readFileSync(p, 'utf8'); } catch { return die(`${what} không đọc được: ${p}`); } };
// configPath/evalsPath là BIẾN, không phải chuỗi dựng lại chỗ khác: vị ngữ bỏ-qua
// (khối SKIP-UNCHANGED-PREDICATE) suy tập tệp định nghĩa phép đo từ CHÍNH chúng.
const configPath = path.join(root, '_acceptance', 'config.yaml');
const configText = readOr(configPath, 'config.yaml');

// ── acceptance-gate root: --ag-root (tự host) hoặc resolve-plugin ─────────
// --ag-root chỉ cấp BỘ MÁY (lib/ + scripts/ của acceptance-gate); --root là cây
// đang đo. Hai thứ tách nhau, nên một cây mang lớp vendored cũ vẫn đo được bằng
// một bộ máy đủ đời.
const AG_REQUIRES = ['lib/evidence-core.cjs', 'lib/eval-yaml.cjs', 'lib/workspace-record.cjs', 'scripts/recheck-evidence.cjs'];
const RESOLVER = path.join(HERE, 'resolve-plugin.mjs');
let agRoot = flags['ag-root'];
if (!agRoot) {
  try {
    const out = execFileSync(process.execPath, [RESOLVER, '--plugin', 'acceptance-gate', ...AG_REQUIRES.flatMap(r => ['--require', r])], { encoding: 'utf8' });
    agRoot = out.trim().split('\n').pop();
  } catch (e) { die(`không resolve được plugin acceptance-gate: ${String(e.message || e).split('\n')[0]}`); }
}
agRoot = (() => { try { return fs.realpathSync(agRoot); } catch { return die(`--ag-root không tồn tại: ${agRoot}`); } })();

// ── Cổng bộ máy — chạy TRƯỚC kiểm cây sạch, trước mọi suite, trước mọi lần ghi ──
// (hồ sơ ghim-lai-tren-lop-cu, 11/09/2026). Trước đây làn rút expectedExits từ
// một lớp cũ mà không kiểm, sập TypeError và thoát 1 — trùng mã LÀN ĐỎ, tức bộ
// máy cũ bị đọc thành hồ sơ mất tiền đề. Mỗi hàng dưới là MỘT điểm chạm của làn
// vào bộ máy, kể cả thứ bước tự kiểm recheck-evidence.cjs gọi (nó chạy SAU khi
// ghi, từ cùng gốc) và sàn ngữ nghĩa readSignedReportFor: nó sinh cùng luật hai
// vế của checkRepinEvals, evidence-core thiếu nó sẽ từ chối mã khác 0 đã khai
// SAU khi làn đã ghi. Kiểm export có mặt, không kiểm chuỗi version: lớp vendored
// không mang plugin.json. Tệp ca tests/scripts/repin-lane-lop-cu.test.mjs rút
// hàng từ CHÍNH khối này; thêm một lời gọi vào bộ máy mà không thêm hàng là ca
// GL03 đỏ gọi tên lời gọi đó.
// <<<AG-ENGINE-TABLE
const AG_ENGINE = [
  { file: 'lib/eval-yaml.cjs', name: 'parseEvals', kind: 'function', since: '2.9.0', why: 'làn gọi' },
  { file: 'lib/eval-yaml.cjs', name: 'expectedExits', kind: 'function', since: '2.11.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'resolveConfigKey', kind: 'function', since: '2.9.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'resolveConfigList', kind: 'function', since: '2.9.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'REPIN_MACHINE_EXECUTORS', kind: 'array', since: '2.9.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'isRepinMachineEval', kind: 'function', since: '2.12.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'machineEvalIdsSkipped', kind: 'function', since: '2.12.0', why: 'notRunConflicts gọi (làn gọi gián tiếp)' },
  { file: 'lib/evidence-core.cjs', name: 'notRunConflicts', kind: 'function', since: '2.12.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'determineEnforce', kind: 'function', since: '2.9.0', why: 'recheck gọi' },
  { file: 'lib/evidence-core.cjs', name: 'evaluateEvidence', kind: 'function', since: '2.9.0', why: 'recheck gọi' },
  { file: 'lib/evidence-core.cjs', name: 'checkRepinEvals', kind: 'function', since: '2.9.0', why: 'recheck gọi' },
  { file: 'lib/evidence-core.cjs', name: 'findAcceptanceConfig', kind: 'function', since: '2.9.0', why: 'recheck gọi' },
  { file: 'lib/evidence-core.cjs', name: 'readSignedReportFor', kind: 'function', since: '2.11.0', why: 'sàn ngữ nghĩa bên đọc' },
  { file: 'lib/evidence-core.cjs', name: 'frontmatterField', kind: 'function', since: '2.9.0', why: 'làn gọi (chụp hồ sơ đã thông cổng)' },
  { file: 'lib/workspace-record.cjs', name: 'DA_THONG_CONG_2', kind: 'array', since: '2.3.0', why: 'làn gọi (chụp hồ sơ đã thông cổng — hai trạng thái đã thông Cổng Bằng chứng, hỏi lib không chép)' },
  // Hàng ĐIỀU KIỆN (khoá `khi`): chỉ đòi khi kho bật khoá — kho không bật chạy y như trên bộ máy cũ
  // (hồ sơ lan-ghim-lai-theo-paths AC-10). Hàng thiếu `khi` là đòi vô điều kiện như mọi hàng trên.
  { file: 'lib/evidence-core.cjs', name: 'staleByPaths', kind: 'function', since: '2.21.0', why: 'làn gọi (--skip-unchanged khi risk_tiers.stale_scope: paths)', khi: 'stale_scope=paths' },
  // Ba hàng của hồ sơ eval-thay-boi-co-chung: chỉ đòi khi một slug đang ghim khai con trỏ thay thế —
  // kho không khai chạy y như trên bộ máy cũ (bộ máy cũ thấy con trỏ thì vẫn chặn ở luật hai vế).
  { file: 'lib/evidence-core.cjs', name: 'chungThayBoi', kind: 'function', since: '2.24.0', why: 'notRunConflicts gọi khi hồ sơ khai con trỏ thay thế', khi: 'superseded_by' },
  { file: 'lib/workspace-record.cjs', name: 'hoSoDaKhep', kind: 'function', since: '2.24.0', why: 'chungThayBoi gọi', khi: 'superseded_by' },
  { file: 'lib/ac-line.cjs', name: 'parseACBlock', kind: 'function', since: '2.24.0', why: 'chungThayBoi gọi', khi: 'superseded_by' },
  // Ba hàng của hồ sơ loc-paths-dong-mac-dinh — cũng ĐIỀU KIỆN: khoá vắng mà bộ máy thiếu chúng thì phần «ô ngoài
  // làn máy có vật đổi» in một dòng không tính được (chamTuPin), làn vẫn chạy y như bộ máy cũ.
  { file: 'lib/evidence-core.cjs', name: 'evalPathsOf', kind: 'function', since: '2.21.0', why: 'làn gọi (đọc paths một nguồn)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
  { file: 'lib/evidence-core.cjs', name: 'pathGlobToRe', kind: 'function', since: '2.21.0', why: 'làn gọi (khớp glob một nguồn)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
  { file: 'lib/evidence-core.cjs', name: 'dungCayPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (cây git cho bộ lọc)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
  { file: 'lib/evidence-core.cjs', name: 'phanLoaiMucPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (phân loại mục paths)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
];
// AG-ENGINE-TABLE>>>
const verNum = (v) => String(v).split('.').map(Number).reduce((n, x) => n * 1000 + (x || 0), 0);
const AG_FLOOR = AG_ENGINE.map(r => r.since).reduce((a, b) => (verNum(b) > verNum(a) ? b : a));
const shq = (s) => (/^[\w@%+=:,./-]+$/.test(s) ? s : `'${String(s).replace(/'/g, `'\\''`)}'`);
const nguon = flags['ag-root']
  ? `nguồn bộ máy: --ag-root ${flags['ag-root']}`
  : 'nguồn bộ máy: plugin cache (resolve-plugin.mjs chọn, không có --ag-root) — cập nhật plugin: claude plugin update acceptance-gate@acceptance-gate-kit';
// Dòng `lệnh dò:` in đường TUYỆT ĐỐI tới resolve-plugin.mjs: người chạy đứng ở
// --root, không ở gốc kit. resolve-plugin chỉ kiểm tệp có mặt, không kiểm
// export — nó có thể chỉ ra một bản đã cài vẫn cũ; lượt kế sẽ dừng lại ở chính
// cổng này với cùng khuôn thông điệp, không bao giờ lặng.
function engineStop(head) {
  return die([
    head,
    nguon,
    `lối đi tiếp: trỏ --ag-root vào một acceptance-gate ≥ ${AG_FLOOR}, ví dụ bản plugin đã cài — --ag-root chỉ cấp bộ máy, --root vẫn là cây đang đo (lớp vendored cũ trong cây vẫn đo được).`,
    `lệnh dò: node ${shq(RESOLVER)} --plugin acceptance-gate ${AG_REQUIRES.map(r => `--require ${r}`).join(' ')}`,
  ].join('\n'));
}
const vangTep = AG_REQUIRES.filter(r => !fs.existsSync(path.join(agRoot, r)));
if (vangTep.length) engineStop(`acceptance-gate không đủ tệp cho làn ghim lại (root: ${agRoot}) — thiếu ${vangTep.length} mục:\n${vangTep.map(r => `  - ${r}: (vắng tệp)`).join('\n')}`);
const require_ = createRequire(import.meta.url);
function loadEngine(rel) {
  try { return require_(path.join(agRoot, rel)); } catch (e) { return engineStop(`không nạp được ${rel} (root: ${agRoot}): ${String((e && e.message) || e).split('\n')[0]}`); }
}
const mods = { 'lib/evidence-core.cjs': loadEngine('lib/evidence-core.cjs'), 'lib/eval-yaml.cjs': loadEngine('lib/eval-yaml.cjs'), 'lib/workspace-record.cjs': loadEngine('lib/workspace-record.cjs') };
const lacks = (r) => { const v = mods[r.file] ? mods[r.file][r.name] : undefined; return r.kind === 'array' ? !Array.isArray(v) : typeof v !== 'function'; };
// risk_tiers.stale_scope đọc THẲNG từ config.yaml (bộ máy chưa nạp ở đây) — cùng cách pre-merge-check.sh
// đọc nó; giá trị lạ coi như vắng ở làn (lưới trước-merge là nơi gọi tên giá trị sai).
const staleScope = String((configText.match(/^[ \t]*stale_scope:[ \t]*([^\s#]+)/m) || [])[1] || 'all').replace(/^['"]|['"]$/g, '');
// Con trỏ thay thế: đọc THÔ evals.yaml của từng slug đang ghim (bộ máy chưa nạp) — chỉ để biết có đòi
// ba hàng `khi: 'superseded_by'` hay không; luật thật chạy trong bộ máy.
const coConTro = slugs.some(sl => { try { return /^[ \t]+superseded_by[ \t]*:/m.test(fs.readFileSync(path.join(root, '_acceptance', sl, 'evals.yaml'), 'utf8')); } catch { return false; } });
if (coConTro) mods['lib/ac-line.cjs'] = loadEngine('lib/ac-line.cjs');
const batKhoa = (r) => !r.khi || (r.khi === 'stale_scope=paths' && staleScope === 'paths') || (r.khi === 'superseded_by' && coConTro);
const missing = AG_ENGINE.filter(r => batKhoa(r) && lacks(r));
if (missing.length) engineStop(`acceptance-gate quá cũ cho làn ghim lại (root: ${agRoot}) — thiếu ${missing.length} mục:\n${missing.map(r => `  - ${r.file}: ${r.name} (cần ≥ ${r.since})`).join('\n')}`);
const core = mods['lib/evidence-core.cjs'];
const { parseEvals, expectedExits } = mods['lib/eval-yaml.cjs'];
const { DA_THONG_CONG_2 } = mods['lib/workspace-record.cjs'];

// ── Năm khoá của làn (hồ sơ gia-lan-ghim-lai) — VẮNG = hành vi trước vòng. Giá trị sai → nguồn hỏng (2).
let khoa;
try { khoa = docKhoa(configText, core); } catch (e) { die(String((e && e.message) || e)); }
// ── Nhãn «đỏ sẵn trên nền» (hồ sơ ho-so-da-ky-giu-tuoi): luật MỘT nguồn ở lib/do-san-tren-nen.cjs CỦA BỘ MÁY —
// cùng tệp checkRepinEvals (bên đọc) nạp cạnh evidence-core.cjs; làn không giữ bản luật thứ hai. Khoá
// `feature_loop.do_san_tren_nen` vắng/false → làn y như trước vòng. Giá trị sai → nguồn hỏng (2), gọi tên khoá.
// Bộ máy cũ không có tệp luật: khoá vắng/false thì im (chạy như cũ); khoá khai khác false thì dừng — không
// được lặng lẽ coi như tắt một khoá chủ kho đã bật.
const DS_REL = 'lib/do-san-tren-nen.cjs';
let ds = null;
if (fs.existsSync(path.join(agRoot, DS_REL))) {
  try { ds = require_(path.join(agRoot, DS_REL)); } catch (e) { engineStop(`không nạp được ${DS_REL} (root: ${agRoot}): ${String((e && e.message) || e).split('\n')[0]}`); }
}
let khoaDoSan = false;
if (ds) { try { khoaDoSan = ds.docKhoaDoSan(root); } catch (e) { die(String((e && e.message) || e)); } }
else {
  const v = (configText.match(/^[ \t]+do_san_tren_nen[ \t]*:[ \t]*([^\s#]+)/m) || [])[1];
  if (v !== undefined && String(v).replace(/^['"]|['"]$/g, '').toLowerCase() !== 'false') engineStop(`config.yaml khai feature_loop.do_san_tren_nen: ${v} nhưng bộ máy (root: ${agRoot}) thiếu ${DS_REL}`);
}
const tranPhut = flags['tran-phut'] !== undefined ? Number(flags['tran-phut']) : khoa.repin_budget_min;
const hanMs = tranPhut ? tKhoiDong + tranPhut * 60000 : null;
const conLai = () => (hanMs == null ? null : hanMs - Date.now());
// Env của suite: các khoá tuỳ chọn đặt RỖNG tường minh — xoá biến thì bộ nạp .env (Bun, node
// --env-file) điền lại giá trị (đo 06/10). Eval luôn chạy env đầy đủ.
const envCi = khoa.repin_ci_blank_env.length
  ? Object.assign({}, process.env, Object.fromEntries(khoa.repin_ci_blank_env.map(k => [k, ''])))
  : null;
const nhanCi = envCi ? `môi trường giống CI (biến rỗng: ${khoa.repin_ci_blank_env.join(', ')})` : '';

// ── git: sha = HEAD, cây phải sạch ngoài _acceptance/ (pin phải là cây đã đo) ──
// maxBuffer rộng (hồ sơ eval-goi-model-that-khong-chay, AC-13): `git ls-tree -r` của crm là 1,33 MB — trần
// mặc định 1 MiB của execFileSync làm làn chết ENOBUFS ngay khi bật model_carry_cmd.
const gitRaw = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 30 }); } catch (e) { return die(`git ${a[0]} thất bại tại ${root}: ${String(e.stderr || e.message).trim().split('\n')[0]}`); } };
// Cây git của bản đang kiểm (hồ sơ loc-paths-dong-mac-dinh) — dựng MỘT lần, lười, cho cả `--skip-unchanged`
// lẫn chamTuPin; tương đối --root, cùng gốc với `paths`. Khai ở đây vì `--skip-unchanged` chạy ở tầng trên
// cùng TRƯỚC phần khai hàm phía dưới (biến `let` khai sau chỗ dùng là lỗi «trước khi khởi tạo»).
let _cay;
function cayHead() { if (!_cay) _cay = core.dungCayPaths(gitRaw('ls-files', '-z').split('\0').filter(Boolean)); return _cay; }
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

// ── eval máy của từng hồ sơ: executor test/script VÀ không tự khai không-chạy,
// cmd đã giải — MỘT định nghĩa dùng chung với bên đọc (core.isRepinMachineEval,
// core.machineEvalIdsSkipped trong lib/evidence-core.cjs); làn không còn tự
// lọc riêng để hai bên không trôi khỏi nhau (hồ sơ lan-doc-status-not-run).
const perSlug = slugs.map(slug => {
  const ws = path.join(root, '_acceptance', slug);
  const reportPath = path.join(ws, 'evidence-report.md');
  if (!fs.existsSync(reportPath)) die(`${slug}: không có evidence-report.md — không có pin nào để ghim lại`);
  const report = fs.readFileSync(reportPath, 'utf8');
  if (!/^verified_commit\s*:\s*\S+/m.test(report)) die(`${slug}: evidence-report.md không có verified_commit (khuôn cũ) — không ghim được, verify lại`);
  const evalsPath = path.join(ws, 'evals.yaml');
  const evalsText = readOr(evalsPath, `${slug}: evals.yaml`);
  const { byId: expById, errs: expErrs } = expectedExits(evalsText);
  if (expErrs.length) die(`${slug}: evals.yaml khai mã thoát mong đợi sai luật —\n  ${expErrs.join('\n  ')}`);
  // MỘT lượt rút cho cả hai vế (minor ghi-lai-tren-lop-cu 12/09/2026): trước
  // đây `evals` lọc bằng core.isRepinMachineEval trên một parseEvals, còn
  // `skipped` gọi core.machineEvalIdsSkipped — hàm đó TỰ rút evalsText lần
  // hai. Hai lượt độc lập không mang bất biến nào buộc ids(evals) ∪ skipped =
  // trọn tập executor máy; sửa một bên mà quên bên kia là trôi lặng. Nay
  // `evals` và `skipped` cùng lọc trên MỘT mảng `evalRecords` — hai vế là bù
  // của nhau trên cùng dữ liệu, đúng bằng xây dựng chứ không phải hai luật gõ
  // tay đi song song. core.REPIN_MACHINE_EXECUTORS đã có hàng trong
  // AG-ENGINE-TABLE (2.9.0), nay mới thật sự được làn gọi.
  const evalRecords = parseEvals(evalsText, ['executor', 'cmd', 'status', 'criterion']);
  const evals = evalRecords
    .filter(e => core.isRepinMachineEval(e))
    .map(e => {
      let cmd = String(e.cmd || '').trim();
      if (!cmd) die(`${slug}: eval ${e.id} (executor ${e.executor}) không có cmd`);
      if (cmd.startsWith('config:')) cmd = core.resolveConfigKey(configText, cmd.slice('config:'.length)) || die(`${slug}: eval ${e.id} trỏ ${cmd} không giải được trong config.yaml`);
      return { id: e.id, cmd, expected: expById.get(e.id) || 0 };
    });
  const skipped = evalRecords
    .filter(e => core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))
    .filter(e => !core.isRepinMachineEval(e))
    .map(e => e.id);
  // Ô NGOÀI LÀN MÁY (ui-check/judgment): làn không chạy chúng bao giờ — giới hạn
  // đã khai (GUIDE §7.1, ADR 0014). Trước hồ sơ này pin IM về chúng, nên một hợp
  // đồng làm đúng nghĩa vụ lớp nhìn-thấy mất chốt máy mà không dòng nào nói (đo ở
  // crm 20/09: 6 hồ sơ vừa có ui-check vừa từng ghim; `tiep-thi-tuyen-doi-tac`
  // ghim 6 lần, E6/E9 vắng cả 6 lượt).
  // KIỂU thắng TRẠNG THÁI: ô ngoài làn máy khai `status: not-run` chỉ vào mảng
  // NÀY, không vào `skipped` — `skipped` đã lọc kiểu máy TRƯỚC, nên ba tập
  // (khoá evals_exit · skipped · ngoaiMay) rời nhau đúng bằng xây dựng, không
  // bằng hai luật gõ tay đi song song.
  const ngoaiMay = evalRecords
    .filter(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))
    .map(e => e.id);
  return { slug, ws, reportPath, report, evalsPath, evalsText, evals, skipped, ngoaiMay, evalRecords };
});

// ── luật hai vế (hồ sơ lan-doc-status-not-run, 2026-09-12): một ô khai
// không-chạy trong evals.yaml mà báo cáo ĐÃ KÝ vẫn mang mã thoát cho chính ô
// đó là hai vế mâu thuẫn — «thêm một dòng khai» không được phép trở thành
// đường né đo. Đứng NGAY SAU khi dựng perSlug, TRƯỚC lượt chạy suite đầu
// tiên: một xung đột phải dừng làn TRƯỚC KHI ghi byte nào, không phải sau.
for (const s of perSlug) {
  // s.evalsText: cùng nội dung đã đọc khi dựng perSlug (minor ghi-lai-tren-lop-cu
  // 12/09/2026) — không đọc lại evals.yaml lần hai từ đĩa.
  // `root` = --root đã giải tuyệt đối — hồ sơ thay tra ở CÂY ĐANG GHIM, không ở cwd (eval-thay-boi-co-chung).
  const { xungDot, khongDoiChieuDuoc, thayBoi, lyDo } = core.notRunConflicts(s.evalsText, s.report, { root, slug: s.slug });
  s.thayBoi = thayBoi || [];
  if (xungDot.length) die(`${s.slug}: eval ${xungDot.join(', ')} khai không-chạy trong evals.yaml nhưng báo cáo đã ký CÓ mã thoát cho chính nó — hai vế mâu thuẫn, làn không ghi gì; sửa hồ sơ rồi chạy làn mới${lyDo && lyDo.length ? ` — con trỏ thay thế không chứng được: ${lyDo.join('; ')}` : ''}`);
  // s.report LUÔN là chuỗi ở làn (đọc ngay trên, die nếu vắng) nên vế dưới
  // không chạy ở đây hôm nay; giữ để một bên gọi tương lai không lách qua
  // lặng lẽ — cùng nếp fail-closed với bên đọc.
  if (khongDoiChieuDuoc.length) die(`${s.slug}: eval ${khongDoiChieuDuoc.join(', ')} khai không-chạy mà không đọc được báo cáo đã ký để đối chiếu vế hai — làn không ghi gì; khôi phục evidence-report.md rồi chạy làn mới`);
}

// ── chạy: một lệnh trùng chỉ chạy MỘT lần (dedupe cmd như S4) ─────────────
// Khoá gộp = môi trường + lệnh (hồ sơ gia-lan-ghim-lai, Đ3): một eval có lệnh trùng nguyên văn một
// suite chạy ở env CI thì vẫn chạy riêng — hai môi trường là hai phép đo. Không bật env CI thì mọi
// lệnh mang thẻ 'full' và việc gộp y như trước vòng.
const results = new Map(); // khoaLenh → { exit, lan: [{exit, ms, log}], model, chap_chon? }
const khoaLenh = (cmd, envTag) => `${envTag}\0${cmd}`;
// Lệnh thuộc eval model thật, tính TRƯỚC khi chạy gì: tính chất model thuộc NGUYÊN VĂN LỆNH — không
// thuộc nhãn gặp lệnh lần đầu (S4 lượt 1), không thuộc môi trường chạy nó (S4 lượt 2). Một suite dùng
// chung lệnh với eval model, ở env nào, vẫn là lệnh model: không chạy lại (AC-1), và lần chạy được đếm.
const lenhModel = new Set(perSlug.flatMap(s => s.evals.filter(e => khoa.model_evals.has(`${s.slug}/${e.id}`)).map(e => e.cmd)));
// Điểm DUY NHẤT dựng bản ghi một lệnh — cả đường nối đuôi lẫn song song đi qua đây, nên cờ model không
// thể được xét ở chỗ này mà quên ở chỗ kia (hai lượt S4 trước đều là một chỗ gặp lệnh bị sót).
const taoRec = (cmd, envTag) => ({ exit: null, lan: [], model: lenhModel.has(cmd), envTag });
const chapChon = [];        // mục `chap_chon` của dòng pin (Đ4)
const dangChay = new Set(); // handle chayLenh đang chạy — bộ dừng (trần/tín hiệu) giết cả cây từng cái
const daXong = new Set();   // nhãn lệnh đã có kết quả — phần bù là `chua_chay` khi làn dừng sớm
// Lệnh đỏ → nhật ký TRỌN (hồ sơ lan-ghim-lai-giu-tron-loi-loi, 03/10/2026). Bản 2.20 chỉ in
// 30 dòng cuối: với suite 1 507 bài của crm đó là phần tổng kết, lời lỗi mất, và chẩn đoán
// đầu tiên của phiên thi công 02/10 SAI vì đoán thiếu lời lỗi. Tệp đi ra thư mục lượt chạy
// (eval-executors.md «Where a run writes its artifacts»), KHÔNG vào _acceptance/; lệnh xanh
// không sinh tệp nào. Đường lưu tương đối gốc kho để dấu lượt đỏ trỏ tới được từ mọi slug.
let soNhatKy = 0;
function ghiNhatKyNeuDo(cmd, label, exit, out, err) {
  if (exit === 0) return undefined;
  let rel = null;
  try { // NHAT-KY-KHI-DO
    soNhatKy += 1;
    const ten = `${String(soNhatKy).padStart(2, '0')}-${label.replace(/[^\w.-]+/g, '-').slice(0, 60)}.log`;
    rel = ['.acceptance-runs', slugs[0], runId.startsWith('repin-') ? runId : `repin-${runId}`, ten].join('/');
    const abs = path.join(root, ...rel.split('/'));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    // Thư mục lượt chạy TỰ ẨN khỏi git: kho chưa khai `.acceptance-runs/` trong .gitignore (đo 03/10:
    // radar, oneflow, media-library) mà `git add -A` sau lượt đỏ thì nhật ký vào lịch sử, và luật
    // hoá cũ đếm nó là mã đổi — mọi hồ sơ cũ theo. Vật tự lo, không kho nào phải làm gì (luật 26/09).
    const anGit = path.join(root, '.acceptance-runs', '.gitignore'); // TU-AN-GIT
    if (!fs.existsSync(anGit)) fs.writeFileSync(anGit, '*\n');
    const dau = `# lệnh: ${cmd}\n# mã thoát: ${exit}\n=== `;
    fs.writeFileSync(abs, dau + 'stdout ===\n' + out + '\n=== stderr ===\n' + err);
    process.stderr.write(`    nhật ký trọn: ${rel}\n`);
  } catch (e) {
    rel = null;
    process.stderr.write(`    (không ghi được nhật ký trọn: ${String((e && e.code) || (e && e.message) || e).split('\n')[0]})\n`);
  }
  const tail = (out + err).split('\n').filter(Boolean).slice(-30);
  for (const l of tail) process.stderr.write(`    ${l}\n`);
  return rel;
}
// Ghi MỘT lần chạy — dùng chung cho đường nối đuôi và đường song song: dòng log, nhật ký trọn khi
// đỏ, 30 dòng đuôi. Một chỗ ghi nên hai đường không trôi khỏi nhau.
function ghiLan(cmd, label, r, lanThu, envTag) {
  const veCi = envTag === 'ci' && r.exit !== 0 ? ` (${nhanCi})` : '';
  log(`${label}${lanThu > 1 ? ' (chạy lại)' : ''}: ${cmd} → exit ${r.exit} (${(r.ms / 1000).toFixed(1)}s)${veCi}`);
  const logRel = ghiNhatKyNeuDo(cmd, lanThu > 1 ? `${label}-lan-${lanThu}` : label, r.exit, r.out, r.err);
  return { exit: r.exit, ms: r.ms, log: logRel, out: r.out, err: r.err };
}
// Chờ kết quả một lệnh. Đã vào dừng sớm (trần / tín hiệu) thì luồng chính TREO tại đây: lệnh vừa bị
// giết trả về «exit 1», và nếu luồng chính đi tiếp nó sẽ chạy eval kế rồi thoát 1 trước khi bộ dừng kịp
// ghi dấu và thoát mã riêng. Bộ dừng giữ vòng sự kiện sống (hẹn giờ SIGKILL) rồi tự process.exit.
let dangDung = false;
const treo = () => new Promise(() => {});
function batDau(cmd, env) { const h = chayLenh(cmd, { cwd: root, env }); dangChay.add(h); h.done.then(() => dangChay.delete(h)); return h; }
async function cho(h) { const r = await h.done; if (dangDung) await treo(); return r; }
// Chạy lại (Đ4) — sau khi khối song song (nếu có) đã xong, một mình. Lần hai đạt → ghi chap_chon.
async function chayLaiNeuCan(rec, cmd, label, env, envTag, lech) {
  const l1 = rec.lan[0];
  const q = coChayLai({ khoa: khoa.repin_retry, lech: lech(l1.exit), laModel: rec.model, msLanDau: l1.ms, conLaiMs: conLai() });
  if (!q.chay) return;
  const l2 = ghiLan(cmd, label, await cho(batDau(cmd, env)), 2, envTag);
  rec.lan.push(l2); rec.exit = l2.exit;
  if (!lech(l2.exit)) {
    rec.chap_chon = { lenh: cmd, nhan: label, lan_dau: l1.exit, log: l1.log === undefined ? null : l1.log, ca: rutTenCa(`${l1.out}\n${l1.err}`) };
    chapChon.push(rec.chap_chon);
  }
}
async function runCmd(cmd, label, { env = process.env, envTag = 'full', lech = (x) => x !== 0 } = {}) {
  const k = khoaLenh(cmd, envTag);
  if (results.has(k)) { log(`${label}: (đã chạy) → exit ${results.get(k).exit}`); daXong.add(label); return results.get(k).exit; }
  const rec = taoRec(cmd, envTag);
  results.set(k, rec);
  rec.lan.push(ghiLan(cmd, label, await cho(batDau(cmd, env)), 1, envTag));
  rec.exit = rec.lan[0].exit;
  await chayLaiNeuCan(rec, cmd, label, env, envTag, lech);
  daXong.add(label);
  return rec.exit;
}
// Suite song song (hồ sơ lan-ghim-lai-theo-paths, AC-8/AC-9): khoá feature_loop.repin_parallel_suites
// = true thì mọi lệnh suite KHÁC NHAU bắn cùng lúc, chờ hết, rồi ghi kết quả theo ĐÚNG thứ tự
// suite_keys (không theo lúc xong) — mỗi lệnh một khối, không xen dòng. Eval vẫn nối đuôi. Khoá
// vắng/false → nối đuôi y như cũ. Đo 02/10 ở crm: phần cố định ≈ 13,6 phút mỗi làn là suite.
// Chạy lại (Đ4) chỉ bắt đầu SAU khi cả khối song song xong — ca chập chờn vì tải có một lượt máy yên.
async function runSuites(cmds) {
  const nhan = (i) => `suite ${i + 1}/${cmds.length}`;
  const env = envCi || process.env;
  const envTag = envCi ? 'ci' : 'full';
  const songSong = String(core.resolveConfigKey(configText, 'feature_loop.repin_parallel_suites') || '').trim() === 'true';
  if (!songSong) {
    const ra = [];
    for (let i = 0; i < cmds.length; i += 1) ra.push(await runCmd(cmds[i], nhan(i), { env, envTag }));
    return ra;
  }
  const moi = [...new Set(cmds)].filter(c => !results.has(khoaLenh(c, envTag)));
  const xong = new Map(await Promise.all(moi.map(async c => [c, await cho(batDau(c, env))])));
  const lech = (x) => x !== 0;
  const can = [];
  for (let i = 0; i < cmds.length; i += 1) {
    const c = cmds[i]; const k = khoaLenh(c, envTag);
    if (results.has(k)) { log(`${nhan(i)}: (đã chạy) → exit ${results.get(k).exit}`); daXong.add(nhan(i)); continue; }
    const rec = taoRec(c, envTag);
    rec.lan.push(ghiLan(c, nhan(i), xong.get(c), 1, envTag));
    rec.exit = rec.lan[0].exit; results.set(k, rec); can.push([rec, c, nhan(i)]);
  }
  for (const [rec, c, nh] of can) { await chayLaiNeuCan(rec, c, nh, env, envTag, lech); daXong.add(nh); }
  return cmds.map(c => results.get(khoaLenh(c, envTag)).exit);
}
// ── --skip-unchanged: cây BẰNG PIN thì không có gì để chứng lại ──────────────
// <<<SKIP-UNCHANGED-PREDICATE
// Vị từ là ngữ nghĩa `stale_files()` của scripts/pre-merge-check.sh: tệp
// git-theo-dõi đổi so `verified_commit` (cây làm việc tính luôn), TRỪ vật hồ sơ,
// TRỪ tệp repo đã khai là không-phải-hành-vi (`risk_tiers.t1_skip_globs`). Rỗng
// nghĩa là lưới trước-merge sẽ KHÔNG gọi hồ sơ này stale — nên một làn trọn
// corpus ở đây chỉ chứng lại thứ không đổi (đo 14/09: 7/7 chữ ký, 13 phút/làn).
//
// CỘNG MỘT vế mà `stale_files` không có (hồ sơ thuoc-co-cua AC-3, AC-4) — hai câu
// hỏi khác nhau. `stale_files` hỏi «bằng chứng có hoá cũ không»: với câu đó vật hồ
// sơ đúng là loại trừ. Làn này hỏi «có cần chạy lại phép đo không»: với câu đó
// `config.yaml` (giải executors, suite_keys) và `evals.yaml` của từng slug đang
// ghim là ĐẦU VÀO — đổi chúng mà bỏ qua thì lệnh MỚI không bao giờ chạy trước chữ
// ký. Tập tệp định nghĩa SUY từ chính biến làn đã đọc (configPath, s.evalsPath),
// quy về đường so gốc git bằng `rev-parse --show-prefix` (gốc làn có thể là thư
// mục con của một kho lớn hơn) — không gõ tay chuỗi đường dẫn; một nguồn định
// nghĩa mới đọc qua biến khác thì phải thêm biến ấy vào tập.
// Hai giới hạn còn lại khai ở ADR 0019, mỗi cái kèm ngưỡng đang đếm: tệp chưa
// theo dõi vô hình với `git diff` · lệch glob bash/JS ở dạng `dir/*`.
//
// Loại trừ hồ sơ tính theo PHÂN ĐOẠN đường dẫn, KHÔNG qua globToRe: `*` của nó
// không xuyên `/`, nên `_acceptance/<slug>/evidence-report.md` (sâu 2 — đúng tệp
// chữ ký vừa ghi) và `packages/x/_acceptance/...` sẽ lọt, tức không lượt ký nào
// bỏ qua được. Tiền tố giả `_acceptance-x/` KHÔNG khớp (so bằng đoạn, không bằng
// tiền tố chuỗi).
const laVatHoSo = (f) => f.split('/').includes('_acceptance');
const t1Res = (() => {
  try { const v = core.resolveConfigList(configText, 'risk_tiers.t1_skip_globs'); return (Array.isArray(v) ? v : []).map(globToRe); }
  catch { return []; }   // repo không khai → chỉ loại vật hồ sơ, fail-CLOSED về phía CHẠY
})();
const ngoaiVat = (f) => laVatHoSo(f) || t1Res.some(re => re.test(f));
if (flags['skip-unchanged']) {
  const tienToGit = gitRaw('rev-parse', '--show-prefix').trim();   // '' ở gốc kho · 'pkg/a/' khi --root là thư mục con
  const quyVeGit = (p) => tienToGit + path.relative(root, p).split(path.sep).join('/');
  const tepDinhNghia = new Set([configPath, ...perSlug.map(s => s.evalsPath)].map(quyVeGit));
  const laDinhNghia = (f) => tepDinhNghia.has(f);
  const pins = {};
  let khongGiaiDuoc = null;
  for (const s of perSlug) {
    const vc = (s.report.match(/^verified_commit\s*:\s*(\S+)/m) || [])[1];
    // Pin không giải được thì KHÔNG bỏ qua — thiếu pin là lý do để chạy, không
    // phải lý do để im (cùng nếp fail-closed với bên đọc).
    if (!vc) { khongGiaiDuoc = `${s.slug}: evidence-report.md không có verified_commit`; break; }
    const co = spawnSync('git', ['-C', root, 'cat-file', '-e', `${vc}^{commit}`], { stdio: 'ignore' });
    if (co.status !== 0) { khongGiaiDuoc = `${s.slug}: verified_commit ${vc.slice(0, 7)} không có trong kho này`; break; }
    pins[s.slug] = vc;
  }
  if (khongGiaiDuoc) {
    log(`--skip-unchanged KHÔNG áp dụng (${khongGiaiDuoc}) — làn chạy trọn`);
  } else {
    const doi = [];
    const dinhNghia = new Set();
    for (const [slug, vc] of Object.entries(pins)) {
      const doiSlug = [];
      for (const f of gitRaw('diff', '--name-only', vc, '--').split('\n').filter(Boolean)) {
        if (laDinhNghia(f)) dinhNghia.add(f);          // xét TRƯỚC ngoaiVat: tệp định nghĩa nằm dưới _acceptance/
        else if (!ngoaiVat(f)) doiSlug.push(f);
      }
      // Khoá risk_tiers.stale_scope: paths — CÙNG hàm lưới trước-merge gọi (lan-ghim-lai-theo-paths
      // AC-7): chỉ BỚT tệp ngoài phạm vi đo; vế tệp định nghĩa ở trên không qua bộ lọc.
      let giu = doiSlug;
      if (staleScope === 'paths' && doiSlug.length) {
        const s = perSlug.find(x => x.slug === slug);
        let r;
        try { r = core.staleByPaths(doiSlug, s ? s.evalsText : null, { prefix: tienToGit, cay: cayHead() }); } catch (e) { r = { apply: false, reason: `lib-loi:${String((e && e.message) || e).split('\n')[0]}` }; }
        if (r.apply) {
          giu = r.kept;
          if (r.skipped.length) process.stderr.write(`repin-lane: --skip-unchanged theo paths: bỏ qua ${r.skipped.length} tệp ngoài phạm vi đo của ${slug}\n`);
        } else process.stderr.write(`repin-lane: --skip-unchanged không lọc theo paths (${r.reason}) — xét theo luật cũ\n`);
      }
      for (const f of giu) doi.push(`${slug}: ${f}`);
    }
    for (const f of dinhNghia) process.stderr.write(`repin-lane: KHÔNG bỏ qua — tệp định nghĩa phép đo đổi so với pin: ${f}\n`);
    if (!doi.length && !dinhNghia.size) {
      log(`cây bằng pin ${sha.slice(0, 7)} — 0 tệp ngoài _acceptance/ và t1_skip_globs đổi so verified_commit của ${perSlug.length} hồ sơ — làn bỏ qua (không suite, không eval, không ghi)`);
      const tkBo = dungTongKet({ ketCuc: 'bo-qua', ms: Date.now() - tKhoiDong, soLenh: 0, modelGoi: 0, chapChon: 0 });
      process.stdout.write(JSON.stringify({ skipped: true, sha, pins, tong_ket: tkBo.obj }, null, 2) + '\n');
      process.stderr.write(tkBo.dong + '\n');
      process.exit(0);
    }
    if (doi.length) log(`--skip-unchanged: ${doi.length} tệp vật đổi so pin — làn chạy trọn: ${doi.slice(0, 5).join(', ')}${doi.length > 5 ? ' …' : ''}`);
  }
}
// SKIP-UNCHANGED-PREDICATE>>>

// ── Ô ngoài làn máy mà VẬT ĐO đã đổi (hồ sơ ghim-lai-noi-ra-o-khong-do) ─────
// Câu «hồ sơ mà diff chạm đúng phần ui-check đo phải đi vòng S4 delta» sống bằng
// CHỮ từ 07/09 — không máy nào cưỡng chế. Đo ở crm 20/09: 3 trong 6 khoảng ghim
// của `tiep-thi-tuyen-doi-tac` đổi tệp nằm trong `paths` của E6, hồ sơ vẫn ghim
// xanh cả 6 lần. Làn KHÔNG chặn (owner quyết ở Cổng Phạm vi 20/09): nó NÓI RA,
// và ngưỡng đếm được ở GUIDE §7.1 quyết có mở vòng chặn hay không.
//
// Mốc diff là `verified_commit` TRƯỚC khi làn ghi — KHÔNG phải HEAD~1: giữa hai
// lần ghim ở kho tiêu thụ là hàng trăm commit. Diff tính THÔ (không loại
// `_acceptance/`, không loại t1_skip_globs): `paths` của một eval UI trỏ cả răng
// của chính nó dưới `_acceptance/<slug>/rang/**`, và răng đổi LÀ vật đổi.
const tienToGitPin = gitRaw('rev-parse', '--show-prefix').trim();
// `paths` của ô ngoài làn máy đọc bằng CÙNG bộ đọc và bộ phân loại của lib mà bộ lọc dùng (hồ sơ
// loc-paths-dong-mac-dinh gộp bộ đọc riêng `pathsCuaEval` cũ — Ngoài-1 lượt chấm 4 của
// lan-ghim-lai-theo-paths). Bộ đọc của `carry-plan.mjs` (đường verdict S4) KHÔNG đổi.
function chamTuPin(s) {
  if (!s.ngoaiMay.length) return [];
  // Bộ máy cũ hơn làn (chỉ khi --ag-root trỏ bản kit cũ, khoá vắng): không giữ bộ đọc thứ hai làm đường lui.
  const thieuHam = ['evalPathsOf', 'pathGlobToRe', 'dungCayPaths', 'phanLoaiMucPaths'].find(n => typeof core[n] !== 'function');
  if (thieuHam) { log(`bộ máy thiếu ${thieuHam} — không tính được ô ngoài làn máy có vật đổi`); return []; }
  const vcCu = (s.report.match(/^verified_commit\s*:\s*(\S+)/m) || [])[1];
  if (!vcCu) { log(`${s.slug}: không đọc được verified_commit — không tính được ô ngoài làn máy có vật đổi`); return []; }
  const co = spawnSync('git', ['-C', root, 'cat-file', '-e', `${vcCu}^{commit}`], { stdio: 'ignore' });
  if (co.status !== 0) { log(`${s.slug}: pin cũ ${vcCu.slice(0, 7)} không có trong kho — không tính được ô ngoài làn máy có vật đổi`); return []; }
  // git in đường tương đối GỐC KHO GIT; `paths` tương đối gốc kho của hồ sơ (--root).
  const doi = gitRaw('diff', '--name-only', vcCu, '--').split('\n').filter(Boolean)
    .map(f => (tienToGitPin && f.startsWith(tienToGitPin) ? f.slice(tienToGitPin.length) : f));
  const cham = [];
  for (const id of s.ngoaiMay) {
    const gl = core.evalPathsOf(s.evalsText, id) || [];
    if (!gl.length) continue;                    // không khai paths → không biết vật nào, không kết luận
    // Mục không chứng được (dạng lạ, không trỏ tới tệp) → không biết vật nào đổi: nói ra (chạm) khi diff
    // khác rỗng — chiều nói-nhiều-hơn, danh sách chỉ có thể THÊM id so với bộ đọc cũ.
    const pl = gl.map(m => core.phanLoaiMucPaths(m, cayHead()));
    if (pl.some(x => !x.nhan)) { if (doi.length) cham.push(id); continue; }
    const res = pl.map(x => core.pathGlobToRe(x.glob));
    if (doi.some(f => res.some(re => re.test(f)))) cham.push(id);
  }
  return cham;
}

// «AC không có chốt máy» — MỌI eval phủ AC đó đều không phải eval máy đáng ghim
// (∀, KHÔNG phải ∃): một AC có cả ui-check lẫn test VẪN có chốt, và đó đúng là
// lối mà lint W8 khuyên khi đòi thêm ui-check. Ô tự khai `status: not-run` KHÔNG
// phải chốt — `isRepinMachineEval` đã loại nó; cùng MỘT vị từ với bên đọc pin.
// Thẻ Cổng Bằng chứng dựng lại phép gộp này và ca GN09 so hai bản (round-trip),
// nên hai bản không trôi khỏi nhau.
function acKhongChotMay(evalRecords) {
  const theoAc = new Map();   // Map giữ thứ tự chèn = thứ tự xuất hiện trong evals.yaml
  for (const e of evalRecords) {
    const ac = String(e.criterion || '').trim();
    if (!ac) continue;
    if (!theoAc.has(ac)) theoAc.set(ac, []);
    theoAc.get(ac).push(e);
  }
  return [...theoAc.entries()].filter(([, evs]) => evs.every(e => !core.isRepinMachineEval(e))).map(([ac]) => ac);
}

// ── Dùng lại eval model theo băm đầu vào (hồ sơ eval-goi-model-that-khong-chay) ─────────────────────
// Khoá `model_carry_cmd` VẮNG → không chạy gì ở đây, không khoá mới, không dòng stderr mới (hành vi trước
// vòng). Bật: lệnh dấu vân tay chạy MỘT lần; mỗi eval trong `model_evals` nhận một mục — lý do điều kiện
// (luôn chạy) hoặc băm năm lớp + kết quả chọn nguồn từ run-log của chính hồ sơ. Băm tính trên HEAD; tệp
// đầu vào bẩn thì không dùng lại. Thứ tự lý do theo khối CARRY-LY-DO-CHAY của thư viện.
const dungLai = new Map(); // `${slug}/${id}` → { dong, lyDoDk?, bam?, nguon?, lyDoNguon?, paths?, goiTen? }
if (khoa.model_carry_cmd) {
  // Bộ bắt tín hiệu của làn đăng ký SAU bước này (ketThucSom cần các biến khai phía dưới), nên lệnh dấu vân tay
  // mang bộ bắt riêng: bị ngắt thì dọn cả cây của nó rồi thoát 128 + số hiệu (AC-14) — không để nó sống mồ côi.
  const batVanTay = [];
  const vt = await chayVanTay(khoa.model_carry_cmd, {
    cwd: root, env: process.env,
    khiBatDau: (h) => { for (const [sig, so] of [['SIGTERM', 15], ['SIGINT', 2], ['SIGHUP', 1]]) { const f = () => { h.dung().then(() => process.exit(128 + so)); }; process.once(sig, f); batVanTay.push([sig, f]); } },
  });
  for (const [sig, f] of batVanTay) process.removeListener(sig, f);
  const tienTo = gitRaw('rev-parse', '--show-prefix').trim();
  const quyVe = (f) => (!tienTo ? f : (f.startsWith(tienTo) ? f.slice(tienTo.length) : null));
  const blob = new Map(); // tệp git-theo-dõi tại HEAD (tương đối --root) → blob
  for (const l of gitRaw('ls-tree', '-r', '-z', '--full-tree', 'HEAD').split('\0')) {
    const m = l.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/s);
    const f = m ? quyVe(m[2]) : null;
    if (f !== null && m) blob.set(f, m[1]);
  }
  const tep = new Set(blob.keys());
  // porcelain: đường luôn tương đối gốc kho git; mục R/C mang thêm một đường gốc ngay sau — bỏ qua nó.
  const ban = [];
  const ps = gitRaw('status', '--porcelain=v1', '-z', '--untracked-files=all').split('\0');
  for (let i = 0; i < ps.length; i += 1) {
    const l = ps[i]; if (l.length < 4) continue;
    const f = quyVe(l.slice(3)); if (f !== null) ban.push(f);
    if (/^[RC]/.test(l)) i += 1;
  }
  const thieuHam = ['evalPathsOf', 'phanLoaiMucPaths', 'pathGlobToRe', 'dungCayPaths'].find(n => typeof core[n] !== 'function');
  for (const s of perSlug) {
    const ma = s.evals.filter(e => khoa.model_evals.has(`${s.slug}/${e.id}`));
    if (!ma.length) continue;
    const rl = path.join(s.ws, 'run-log.jsonl');
    const dong = docRunLog(fs.existsSync(rl) ? fs.readFileSync(rl, 'utf8') : '');
    const goc = `_acceptance/${s.slug}/`;
    const trongHoSo = (f) => f.startsWith(goc) && !TEP_LAN_GHI.includes(f.slice(goc.length));
    const hoSo = [...tep].filter(trongHoSo);
    const banHoSo = ban.filter(trongHoSo);
    for (const e of ma) {
      const muc = { dong };
      dungLai.set(`${s.slug}/${e.id}`, muc);
      muc.lyDoDk = (() => {
        if (!vt.ok) return vt.lyDo;
        if (flags['allow-dirty']) return LY_DO_CHAY.allowDirty;
        const gl = thieuHam ? null : core.evalPathsOf(s.evalsText, e.id);
        if (thieuHam) return `${LY_DO_CHAY.pathsKhongChung} (bộ máy thiếu ${thieuHam})`;
        if (!gl || !gl.length) return LY_DO_CHAY.khongPaths;
        const pl = gl.map(m => core.phanLoaiMucPaths(m, cayHead()));
        const hong = pl.findIndex(x => !x.nhan);
        if (hong >= 0) return `${LY_DO_CHAY.pathsKhongChung}: ${gl[hong]}`;
        if (coBienShell(e.cmd)) return LY_DO_CHAY.bienShell;
        // Tên `khopPaths` riêng (không `res.some(re => …)`): mũi tiêm của ca GN07 (hồ sơ ghim-lai-noi-ra)
        // tìm đúng chuỗi ấy và đòi nó khớp MỘT lần trong làn.
        const reP = pl.map(x => core.pathGlobToRe(x.glob));
        const khopPaths = (f) => reP.some(r => r.test(f));
        muc.paths = [...tep].filter(khopPaths);
        muc.goiTen = tepGoiTen(e.cmd, tep);
        const banVao = ban.filter(f => khopPaths(f) || muc.goiTen.includes(f));
        const banDau = [...banHoSo, ...banVao][0];
        if (banDau) return `${LY_DO_CHAY.chuaCommit}: ${banDau}`;
        return null;
      })();
      if (muc.lyDoDk) continue;
      muc.bam = bamDauVao({ id: e.id, lenh: e.cmd, paths: muc.paths, hoSo, goiTen: muc.goiTen, vanTay: vt.dau, blob });
      // Ép chạy lại: đầu vào vẫn biết đủ nên vẫn băm — lượt ép chạy thành nguồn mới cho các lượt sau.
      if (flags['chay-lai-model']) { muc.lyDoDk = LY_DO_CHAY.ep; continue; }
      const laDat = (x) => x === e.expected || (e.expected !== 0 && x === 0);
      const q = chonNguon({ dong, id: e.id, bam: muc.bam, nowMs: tKhoiDong, laDat });
      if (q.nguon) muc.nguon = q.nguon; else muc.lyDoNguon = q.lyDo;
    }
  }
}
let modelCarry = 0;
const carryLech = []; // «E1 (slug)» cho dòng tổng kết

log(`sha ${sha} · ${suiteCmds.length} suite · ${perSlug.length} hồ sơ · ${perSlug.reduce((n, s) => n + s.evals.length, 0)} eval máy`);
// Chụp MỌI hồ sơ đã thông cổng, không chỉ slug đang ghim: suite của một hồ sơ
// ghi đè được bằng chứng của hồ sơ khác. Chụp SAU bước bỏ-qua (lượt bỏ qua không
// chạy executor nào) và so TRƯỚC mọi lần ghi của chính làn (run-log/report).
const daThong = hoSoDaThong(root, core.frontmatterField, DA_THONG_CONG_2);
const anhTruoc = chup(root, daThong);
// run_id sinh TRƯỚC lệnh đầu — thư mục nhật ký lệnh đỏ cần nó; `ts` của dòng sổ vẫn là lúc xong.
const tBatDau = Date.now();
const runId = flags['run-id'] || `repin-${new Date(tBatDau).toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[-:]/g, '')}-${Math.floor(Math.random() * 90000 + 10000)}`;
// ── Đ5: đo chi phí trước lệnh đầu, đồng hồ trần, bộ bắt tín hiệu (hồ sơ gia-lan-ghim-lai AC-2…AC-4) ──
const chiPhiTruoc = khoa.repin_cost_cmd ? doChiPhi(khoa.repin_cost_cmd, root, process.env) : undefined;
function chiPhiCuoi() {
  if (!khoa.repin_cost_cmd) return undefined;
  const sau = doChiPhi(khoa.repin_cost_cmd, root, process.env);
  if (typeof chiPhiTruoc !== 'number') return { loi: `lần đo trước: ${chiPhiTruoc.loi}` };
  if (typeof sau !== 'number') return { loi: `lần đo sau: ${sau.loi}` };
  return sau - chiPhiTruoc;
}
const demModel = () => [...results.values()].filter(r => r.model).reduce((n, r) => n + r.lan.length, 0);
const tongKet = (ketCuc) => dungTongKet({ ketCuc, ms: Date.now() - tKhoiDong, soLenh: results.size, modelGoi: demModel(), chapChon: chapChon.length, chiPhi: chiPhiCuoi(), modelCarry, carryLech });
const nhanKeHoach = [...suiteCmds.map((_, i) => `suite ${i + 1}/${suiteCmds.length}`), ...perSlug.flatMap(s => s.evals.map(e => `${s.slug} ${e.id}`))];
// Dừng sớm (vượt trần / bị ngắt): giết cả cây của MỌI lệnh đang chạy, ghi dấu (khi --write), in tổng
// kết, thoát mã riêng. Không ghi pin — làn chưa xong không chứng gì.
async function ketThucSom(kieu, extra, ma) {
  if (dangDung) return; dangDung = true;
  await Promise.all([...dangChay].map(h => h.dung()));
  const tk = tongKet(kieu);
  const chuaChay = nhanKeHoach.filter(n => !daXong.has(n));
  if (flags.write) {
    const iso2 = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const tai = docTai();
    for (const s of perSlug) {
      // Lượt dừng sớm vẫn mang băm + carry_lech đã thấy (AC-14): mất dấu lệch ở đây thì lượt sau dùng lại kết
      // quả xanh cũ cho một eval vừa lệch — xanh giả. Không mang evals_carry: lượt đỏ không bao giờ là nguồn.
      const { evals_hash: bamSom, carry_lech: lechSom } = dungLaiCua(s);
      const dau = JSON.stringify(Object.assign({ ts: iso2, kind: 'repin-do', lan_id: runId, sha, ly_do: kieu }, extra,
        { chua_chay: chuaChay }, chapChon.length ? { chap_chon: chapChon } : {}, bamSom ? { evals_hash: bamSom } : {}, lechSom ? { carry_lech: lechSom } : {}, { tong_ket: tk.obj, tai }));
      try { fs.appendFileSync(path.join(s.ws, 'run-log.jsonl'), dau + '\n'); } catch (e) { console.error(`repin-lane: ${s.slug}: không ghi được dấu ${kieu} — ${String((e && e.code) || e).split('\n')[0]}`); }
    }
  }
  process.stderr.write(tk.dong + '\n');
  process.exit(ma);
}
for (const [sig, so] of [['SIGTERM', 15], ['SIGINT', 2], ['SIGHUP', 1]]) process.on(sig, () => { ketThucSom('bi-ngat', { tin_hieu: sig }, 128 + so); });
const henTran = hanMs == null ? null : setTimeout(() => {
  ketThucSom('vuot-tran', { tran_phut: tranPhut, da_chay_phut: Math.round((Date.now() - tKhoiDong) / 600) / 100 }, 4);
}, Math.max(0, hanMs - Date.now()));

const suitesExit = await runSuites(suiteCmds);
for (const s of perSlug) for (const e of s.evals) {
  const nhan = `${s.slug} ${e.id}`;
  const muc = dungLai.get(`${s.slug}/${e.id}`);
  if (muc) {
    // Thứ tự: lý do điều kiện → lệnh đã chạy ở lượt này (đã trả tiền rồi) → lý do nguồn → dùng lại.
    const lyDo = muc.lyDoDk || (results.has(khoaLenh(e.cmd, 'full')) ? LY_DO_CHAY.lenhDaChay : null) || muc.lyDoNguon;
    if (!lyDo && muc.nguon) {
      e.exit = muc.nguon.evals_exit[e.id];
      e.carry = muc.nguon.run_id;
      modelCarry += 1;
      daXong.add(nhan);
      log(`${nhan}: dùng lại theo băm ${muc.bam.slice(0, 8)} từ ${muc.nguon.run_id} (${muc.nguon.ts}) — không gọi model`);
      continue;
    }
    log(`${nhan}: không dùng lại — ${lyDo}`);
  }
  e.exit = await runCmd(e.cmd, nhan, {
    lech: (x) => !(x === e.expected) && !(e.expected !== 0 && x === 0),
  });
  if (muc && muc.bam && phatHienLech({ dong: muc.dong, id: e.id, bam: muc.bam, exit: e.exit })) {
    e.lech = true;
    carryLech.push(`${e.id} (${s.slug})`);
  }
}
if (henTran) clearTimeout(henTran);
const cham = soChup(anhTruoc, chup(root, daThong));
// Thời lượng làn (việc (a), hồ sơ lan-ghim-lai-giu-tron-loi-loi): suite đầu → eval cuối, giây,
// một số lẻ; số lệnh KHÁC NHAU thực chạy (lệnh trùng gộp một lần). Không có hai số này thì làn
// vắng khỏi dòng phút máy của năm dòng số, và vòng lan-ghim-lai-theo-paths không có số nền.
const wallS = Math.round((Date.now() - tBatDau) / 100) / 10;
const soLenh = results.size;
log(`chụp ${daThong.length} hồ sơ đã thông Cổng Bằng chứng (${anhTruoc.size} tệp) trước suite · sau eval: ${cham.length} tệp bị chạm`);

// Ba khoá dùng lại của một hồ sơ, luật hiện diện (rỗng → vắng hẳn), thứ tự cố định theo khuôn REPIN-TEMPLATE.
function dungLaiCua(s) {
  const bam = {}, carry = {}, lech = [];
  for (const e of s.evals) {
    const muc = dungLai.get(`${s.slug}/${e.id}`);
    if (muc && muc.bam) bam[e.id] = muc.bam;
    if (e.carry) carry[e.id] = e.carry;
    if (e.lech) lech.push(e.id);
  }
  return Object.assign({}, Object.keys(bam).length ? { evals_hash: bam } : {}, Object.keys(carry).length ? { evals_carry: carry } : {}, lech.length ? { carry_lech: lech } : {});
}

// ── kết quả ─────────────────────────────────────────────────────────────
const now = new Date();
const iso = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
const day = iso.slice(0, 10);
const reason = flags.reason || 'ghim lại bằng làn eval';
const out = { run_id: runId, sha, ts: iso, suites: suiteCmds.map((cmd, i) => ({ cmd, exit: suitesExit[i] })), slugs: {} };
if (cham.length) out.cham_ho_so_da_thong = cham;
let red = suitesExit.some(x => x !== 0) || cham.length > 0;
// ── Ghim từng hồ sơ + thông điệp đỏ + nhãn (hồ sơ ho-so-da-ky-giu-tuoi) ─────
// `redChung` = cái đỏ của CẢ lượt (suite chung, executor chạm hồ sơ đã thông cổng): không hồ sơ nào được ghim
// ở mọi chế độ. `doSlug` = hồ sơ có eval đỏ KHÔNG được nhãn phủ. Không --tung-ho-so: một hồ sơ đỏ là cả lượt đỏ
// (như trước); có cờ: chỉ hồ sơ ấy không ghim.
const tungHoSo = !!flags['tung-ho-so'];
const suiteDo = suitesExit.some(x => x !== 0);
const redChung = red;
// Khuôn mục `lenh_do` mới (eval/suite · thong_diep_bam · trich) + `dinh_nghia`: chỉ khi bật cờ hay khoá — khoá
// tắt và không cờ thì dòng `repin-do` y từng byte như trước vòng.
const khuonMoi = tungHoSo || khoaDoSan;
const lechE = (e) => e.exit !== e.expected && !(e.expected !== 0 && e.exit === 0);
// Nhật ký đọc từ CHÍNH tệp làn đã ghi (ghiNhatKyNeuDo) — bên viết dòng nền và bên viết nhãn băm cùng một vật.
function nhatKyCua(cmd, envTag) {
  const rec = results.get(khoaLenh(cmd, envTag));
  const cuoi = rec ? rec.lan[rec.lan.length - 1] : null;
  if (!cuoi || cuoi.log == null) return null;
  let t;
  try { t = fs.readFileSync(path.join(root, ...cuoi.log.split('/')), 'utf8'); } catch { return null; }
  // Bỏ bốn dòng khung do CHÍNH làn ghi (ghiNhatKyNeuDo: «# lệnh:», «# mã thoát:», «=== stdout ===», «=== stderr ===»):
  // băm và trích chỉ trên lời của lệnh — bên chạy lại lệnh ở chỗ khác (lệnh giữ tươi) băm `${out}\n${err}` ra
  // cùng số mà không phải dựng lại khung này.
  return t.split('\n').filter(l => !/^# (lệnh|mã thoát): /.test(l) && !/^=== (stdout|stderr) ===$/.test(l)).join('\n');
}
const thongDiep = (cmd, envTag) => {
  const t = ds ? nhatKyCua(cmd, envTag) : null;
  if (t == null) return {};
  const ca = rutTenCa(t);
  return { thong_diep_bam: ds.bamThongDiep(t, ca), trich: ds.trichThongDiep(t, ca) };
};
// Mốc đọc dòng nền = điểm tách của HEAD với nhánh chính — CHÍNH hàm bên đọc dùng (ds.diemTachNhanhChinh), không
// bản chép luật dò nhánh thứ hai.
// Một eval đỏ có được nhãn không — MỘT luật (ds.kiemDoSan) với bên đọc. → { dat, cau, runId, bam }
function kiemMot(s, e) {
  if (e.expected !== 0) return { dat: false, cau: `eval khai mã thoát ${e.expected} — nhãn chỉ áp cho eval mong đợi 0` };
  if (typeof ds.diemTachNhanhChinh !== 'function') return { dat: false, cau: `bộ máy (root: ${agRoot}) thiếu hàm diemTachNhanhChinh trong ${DS_REL} — dùng bộ máy cùng đời với làn` };
  const moc = ds.diemTachNhanhChinh(root);
  if (!moc.sha) return { dat: false, cau: moc.lyDo };
  const bam = thongDiep(e.cmd, 'full').thong_diep_bam || null;
  const r = ds.kiemDoSan({ root, slug: s.slug, evalId: e.id, bam, dinhNghia: ds.bamDinhNghia(s.evalsText, e.id), headRef: 'HEAD', baseRef: moc.sha, khoa: true });
  return r.dat ? { dat: true, runId: r.runId, bam } : { dat: false, cau: ds.cauVeHong(r.veHong) };
}
const nhanCua = new Map(); // slug → { do_san: {E: {run_id, thong_diep_bam}} } — chỉ hồ sơ được nhãn phủ trọn
const doSlug = new Set();
for (const s of perSlug) {
  const lechs = s.evals.filter(lechE);
  if (!lechs.length) continue;
  if (khoaDoSan && !redChung) {
    const kq = lechs.map(e => Object.assign({ id: e.id }, kiemMot(s, e)));
    if (kq.every(x => x.dat)) { nhanCua.set(s.slug, { do_san: Object.fromEntries(kq.map(x => [x.id, { run_id: x.runId, thong_diep_bam: x.bam }])) }); continue; }
    for (const x of kq) if (!x.dat) console.error(`repin-lane: ${s.slug}/${x.id}: nhãn không gắn: ${x.cau}`);
  } else if (!khoaDoSan && ds) {
    // Khoá tắt: chỉ nói ra khi cây CÓ dòng nền cho eval ấy (đọc tệp, không gọi git) — kho không dùng nhãn im như cũ.
    for (const e of lechs) if (ds.docDongNen(root, s.slug, null).some(l => l.lenh_do.some(x => x && x.eval === e.id))) console.error(`repin-lane: ${s.slug}/${e.id}: nhãn không gắn: ${ds.cauVeHong('khoa-tat')}`);
  }
  doSlug.add(s.slug);
}
// Không --tung-ho-so: hồ sơ đỏ nào cũng làm cả lượt đỏ (như trước). Có cờ: chỉ cái đỏ chung làm cả lượt đỏ.
if (!tungHoSo && doSlug.size) red = true;
const lineObjs = new Map();
for (const s of perSlug) {
  const evalsExit = {};
  const gioiHan = [];    // đạt đúng một mã khác 0 đã khai
  const hetGioiHan = []; // khai mã khác 0 mà nay trả 0
  let dat = 0;
  for (const e of s.evals) {
    evalsExit[e.id] = e.exit;
    const datKyVong = e.exit === e.expected;
    const hetHan = e.expected !== 0 && e.exit === 0;   // AC-10: không phạt một cải thiện
    // Đỏ của eval quyết ở khối nhãn phía trên (doSlug) — một nơi cho cả hai chế độ.
    if (!datKyVong && !hetHan) continue;
    dat++;
    if (datKyVong && e.expected !== 0) gioiHan.push(`${e.id}=${e.exit}`);
    if (hetHan) hetGioiHan.push(`${e.id} (khai ${e.expected})`);
  }
  const n = (s.report.match(/^### Re-pin/gm) || []).length + 1;
  // Pin phải NÓI RA ô không đo (Task 4, hồ sơ lan-doc-status-not-run): khi
  // s.skipped rỗng, khoá evals_not_run VẮNG HẲN trong JSON (không phải mảng
  // rỗng) — hồ sơ không khai ô nào thì cả hai chỗ phải sạch, không phải một
  // khoá luôn có mặt mang giá trị rỗng.
  const boQua = s.skipped;
  const chamNgoaiMay = chamTuPin(s);
  // Ba khoá tuỳ chọn cùng LUẬT HIỆN DIỆN: rỗng thì VẮNG HẲN. Object.assign giữ
  // thứ tự chèn, nên thứ tự khoá khớp khuôn REPIN-TEMPLATE của SKILL với MỌI tổ
  // hợp có/không — ternary lồng nhau cho 8 nhánh là chỗ khuôn sẽ trôi.
  // Hồ sơ gia-lan-ghim-lai thêm ba khoá cùng luật hiện diện: chap_chon (Đ4), suites_env (Đ3), và
  // tong_ket (Đ5, LUÔN có — gắn sau vòng này, khi kết cục làn đã biết).
  const lineObj = Object.assign(
    { ts: iso, kind: 'repin', run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit, wall_s: wallS, so_lenh: soLenh },
    boQua.length ? { evals_not_run: boQua } : {},
    s.ngoaiMay.length ? { evals_not_machine: s.ngoaiMay } : {},
    chamNgoaiMay.length ? { evals_not_machine_touched: chamNgoaiMay } : {},
    chapChon.length ? { chap_chon: chapChon } : {},
    envCi ? { suites_env: 'ci' } : {},
    dungLaiCua(s),
    // Nhãn «đỏ sẵn trên nền» — luật hiện diện: không nhãn thì VẮNG HẲN (bên đọc cũ lọc theo `kind`, nên khoá
    // lạ này với mã eval ≠ 0 vẫn là VIOLATION ở bản kit cũ — đóng kín về phía đỏ).
    nhanCua.has(s.slug) ? { do_san: nhanCua.get(s.slug).do_san } : {},
  );
  const veGioiHan = gioiHan.length ? ` · đạt-có-giới-hạn: ${gioiHan.join(', ')}` : '';
  const veHet = hetGioiHan.length ? ` · giới hạn đã khai không còn: ${hetGioiHan.join(', ')}` : '';
  const veBoQua = boQua.length ? ` · không chạy theo hồ sơ: ${boQua.join(', ')}` : '';
  // Ô không chạy vì một hồ sơ đã ký khác thay nó (eval-thay-boi-co-chung): pin nói ra thay bởi đâu.
  // Thứ tự bản khai; vắng hẳn khi không ô nào qua chứng. Bên đọc không tin hậu tố — nó chứng lại.
  const thayBoi = s.thayBoi || [];
  const veThayBoi = thayBoi.length ? ` · thay bởi hồ sơ đã ký: ${thayBoi.map(t => `${t.id}→${t.thay}#${t.ac}`).join(', ')}` : '';
  // Ba hậu tố của hồ sơ ghim-lai-noi-ra-o-khong-do: ô ngoài làn máy · ô trong số
  // đó có vật đo đã đổi · AC vì thế không có chốt máy. Ô ngoài làn máy KHÔNG khai
  // `paths` thì nói rõ, để «vắng khỏi danh sách đã chạm» không đọc thành «không chạm».
  const acKhong = acKhongChotMay(s.evalRecords);
  const veNgoaiMay = s.ngoaiMay.length
    ? ` · ngoài làn máy: ${s.ngoaiMay.map(id => ((typeof core.evalPathsOf === 'function' ? core.evalPathsOf(s.evalsText, id) : null) ? id : `${id} (${id} không khai paths)`)).join(', ')}`
    : '';
  const veCham = chamNgoaiMay.length ? ` · diff chạm vật đo ngoài làn máy: ${chamNgoaiMay.join(', ')} — chưa chứng lại, đi vòng S4 delta` : '';
  const veAcKhong = acKhong.length ? ` · AC không có chốt máy: ${acKhong.join(', ')}` : '';
  const veChapChon = chapChon.length ? ` · chập chờn (đỏ lần đầu, đạt khi chạy lại): ${chapChon.map(c => c.nhan).join(', ')}` : '';
  const veEnvCi = envCi ? ` · suite chạy ở ${nhanCi}` : '';
  // Hồ sơ eval-goi-model-that-khong-chay: pin NÓI RA eval nào dùng lại và từ lượt nào, và eval nào lệch.
  const dl = dungLaiCua(s);
  const veDungLai = dl.evals_carry ? ` · dùng lại theo băm đầu vào (không gọi model): ${Object.entries(dl.evals_carry).map(([id, r]) => `${id}←${r}`).join(', ')}` : '';
  const veLech = dl.carry_lech ? ` · cùng băm mà kết quả khác (carry_lech): ${dl.carry_lech.join(', ')}` : '';
  const veDoSan = nhanCua.has(s.slug) ? ` · đỏ sẵn trên nền: ${Object.entries(nhanCua.get(s.slug).do_san).map(([id, d]) => `${id}←${d.run_id}`).join(', ')}` : '';
  const section = `### Re-pin lần ${n} — ${day}, do ${reason}\nrun_id: ${runId}\nsha: ${sha} · suites: ${suiteCmds.length} lệnh exit 0 · evals: ${dat}/${s.evals.length} eval máy đạt kỳ vọng${veGioiHan}${veHet}${veBoQua}${veThayBoi}${veNgoaiMay}${veCham}${veAcKhong}${veChapChon}${veEnvCi}${veDungLai}${veLech}${veDoSan}\n`;
  // `line` giữ CHỖ trong thứ tự khoá cũ (stdout là mặt máy — AC-7 so từng byte); gán sau khi có tổng kết.
  lineObjs.set(s.slug, lineObj);
  out.slugs[s.slug] = Object.assign({ evals_exit: evalsExit, line: null, section, lech: s.evals.filter(e => e.exit !== e.expected && !(e.expected !== 0 && e.exit === 0)) },
    dl.evals_carry ? { evals_carry: dl.evals_carry } : {},
    nhanCua.has(s.slug) ? { do_san: nhanCua.get(s.slug).do_san } : {},
    tungHoSo ? { ket_cuc: (redChung || doSlug.has(s.slug)) ? 'do' : 'ghim' } : {});
}
// Tổng kết cuối lượt (Đ5, AC-4) — mọi kết cục; đo chi phí sau lệnh cuối nằm trong lời gọi này.
// --tung-ho-so với vài hồ sơ đỏ mà suite xanh: kết cục «mot-phan» (lượt thoát 0, không phải mọi hồ sơ được ghim).
const tk = tongKet(red ? 'do' : (tungHoSo && doSlug.size ? 'mot-phan' : 'xanh'));
out.tong_ket = tk.obj;
for (const s of perSlug) {
  out.slugs[s.slug].line = JSON.stringify(Object.assign(lineObjs.get(s.slug), { tong_ket: tk.obj }));
}
// Dấu lượt đỏ (hồ sơ lan-ghim-lai-giu-tron-loi-loi, 03/10/2026): bản 2.20 thoát 1 mà KHÔNG ghi
// gì, nên lượt đỏ không tồn tại trong sổ nào — 02/10 ở crm, 5 lượt đỏ không để vết. Nay với
// --write, mỗi slug nhận MỘT dòng `repin-do` (KHÔNG phải `repin`: không chống lưng pin nào, bộ
// đọc 2.20 lọc theo loại nên đọc qua im — đo 03/10). Không --write thì như cũ: không chạm tệp
// đang theo dõi nào. Pin và evidence-report KHÔNG đổi ở mọi ca.
// `dsDo`: các hồ sơ nhận dấu — mọi hồ sơ khi cả lượt đỏ, chỉ hồ sơ đỏ khi --tung-ho-so mà suite xanh.
function ghiDauDo(dsDo) {
  let soDau = 0;
  // Mục `lenh_do` thêm (gia-lan-ghim-lai): `lan_thu_lai` + `log_lan_dau` khi lệnh đã chạy lại (Đ4),
  // `moi_truong: "ci"` khi đỏ ở env giống CI (Đ3). Lệnh không chạy lại, env đầy đủ → y như trước.
  const mucLenh = (cmd, exit, tag) => {
    const rec = results.get(khoaLenh(cmd, tag)); const cuoi = rec ? rec.lan[rec.lan.length - 1] : null;
    const lg = cuoi && cuoi.log != null ? cuoi.log : null;
    return Object.assign(lg === null ? { cmd, exit, log: null, ly_do: 'khong-ghi-duoc' } : { cmd, exit, log: lg },
      rec && rec.lan.length > 1 ? { lan_thu_lai: rec.lan.length - 1, log_lan_dau: rec.lan[0].log == null ? null : rec.lan[0].log } : {},
      tag === 'ci' ? { moi_truong: 'ci' } : {});
  };
  const tagSuite = envCi ? 'ci' : 'full';
  // Khuôn cũ: một `lenh_do` chung cho mọi hồ sơ, gộp theo lệnh — y từng byte như trước vòng.
  let lenhDoChung = null;
  if (!khuonMoi) {
    lenhDoChung = [];
    const daCo = new Set();
    const them = (cmd, exit, tag) => { const k = khoaLenh(cmd, tag); if (daCo.has(k)) return; daCo.add(k); lenhDoChung.push(mucLenh(cmd, exit, tag)); };
    suiteCmds.forEach((c, i) => { if (suitesExit[i] !== 0) them(c, suitesExit[i], tagSuite); });
    for (const s of perSlug) for (const e of out.slugs[s.slug].lech) them(e.cmd, e.exit, 'full');
  }
  // Khuôn mới (hồ sơ ho-so-da-ky-giu-tuoi): `lenh_do` RIÊNG từng hồ sơ — suite đỏ (`suite: <chỉ số>`) + eval đỏ
  // CỦA hồ sơ ấy (`eval: <id>`), mỗi mục mang `thong_diep_bam` + `trich` khi đọc được nhật ký; `dinh_nghia` =
  // băm khối eval đỏ trong evals.yaml. Đây là vật lệnh giữ tươi chép vào dòng nền đỏ.
  const lenhDoMoi = (s) => {
    const ra = [];
    const daSuite = new Set();
    suiteCmds.forEach((c, i) => {
      if (suitesExit[i] === 0 || daSuite.has(c)) return; daSuite.add(c);
      ra.push(Object.assign({ suite: i }, mucLenh(c, suitesExit[i], tagSuite), thongDiep(c, tagSuite)));
    });
    for (const e of out.slugs[s.slug].lech) ra.push(Object.assign({ eval: e.id }, mucLenh(e.cmd, e.exit, 'full'), thongDiep(e.cmd, 'full')));
    return ra;
  };
  const tai = docTai();
  for (const s of dsDo) {
    // Mã lượt dưới `lan_id`, KHÔNG `run_id`: thư viện bằng chứng (loadRunLogIds) nhận MỌI `run_id` trong sổ
    // làm mã lượt verify hợp lệ — mang `run_id` thì báo cáo trích mã của một lượt ĐỎ qua được recheck
    // (lượt chấm 3, Ngoài-5, tái hiện 03/10). Đỏ không bao giờ là bằng chứng (AC-8).
    // Lượt đỏ mang băm + carry_lech (không mang evals_carry: lượt đỏ không bao giờ là nguồn dùng lại).
    const { evals_hash: bamDo, carry_lech: lechDo } = dungLaiCua(s);
    const lenhDo = lenhDoChung || lenhDoMoi(s);
    const evDo = khuonMoi ? lenhDo.filter(m => m.eval !== undefined).map(m => m.eval) : [];
    const dinhNghia = ds && evDo.length ? { dinh_nghia: Object.fromEntries(evDo.map(id => [id, ds.bamDinhNghia(s.evalsText, id)])) } : {};
    const dau = JSON.stringify(Object.assign({ ts: iso, kind: 'repin-do', lan_id: runId, sha, suites_exit: suitesExit, evals_exit: out.slugs[s.slug].evals_exit, lenh_do: lenhDo, cham: cham.map(c => ({ tep: c.tep, doi: c.doi, log: null, ly_do: 'cham-ho-so' })), wall_s: wallS, so_lenh: soLenh },
      dinhNghia, chapChon.length ? { chap_chon: chapChon } : {}, bamDo ? { evals_hash: bamDo } : {}, lechDo ? { carry_lech: lechDo } : {}, { tong_ket: tk.obj, tai }));
    const logPath = path.join(s.ws, 'run-log.jsonl');
    try {
      const prev = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
      fs.writeFileSync(logPath, prev + (prev && !prev.endsWith('\n') ? '\n' : '') + dau + '\n');
      soDau += 1;
    } catch (e) { console.error(`repin-lane: ${s.slug}: không ghi được dấu lượt đỏ — ${String((e && e.code) || e).split('\n')[0]}`); }
  }
  return soDau;
}
if (red) {
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  const veCham = cham.length
    ? `\nexecutor chạm hồ sơ đã thông Cổng Bằng chứng — ${cham.length} tệp:\n${cham.map(c => `  - ${c.tep} (${c.doi})`).join('\n')}\n`
      + 'Sau cổng, cây _acceptance/<slug>/ là sử liệu chỉ đọc: tạo phẩm của lượt chạy lại đi ra .acceptance-runs/<slug>/ hoặc thư mục tạm (eval-executors.md, mục «Where a run writes its artifacts»); sửa bằng chứng đã thông cổng là một dòng revisit trong decisions.jsonl trước, không phải tác dụng phụ. Trả các tệp trên về bản đã commit, sửa executor ghi chúng, rồi chạy làn MỚI.'
    : '';
  const soDau = flags.write ? ghiDauDo(perSlug) : 0;
  if (tungHoSo && suiteDo) console.error('repin-lane: suite chung đỏ — không ghim hồ sơ nào');
  const dauDo = flags.write ? `không ghi pin; dấu lượt đỏ ở run-log của ${soDau} hồ sơ` : 'không ghi gì';
  console.error(`repin-lane: LÀN ĐỎ — ${dauDo} (suite ${JSON.stringify(suitesExit)}; eval đỏ: ${perSlug.flatMap(s => s.evals.filter(lechE).map(e => `${s.slug}/${e.id}=${e.exit}${e.expected !== 0 ? ` (khai ${e.expected})` : ''}`)).join(', ') || 'không'}). Khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới); không ký mù.${veCham}`);
  process.stderr.write(tk.dong + '\n');
  await xaRoiThoat(1);
}
// --tung-ho-so, suite xanh: hồ sơ đỏ nhận dấu lượt đỏ, hồ sơ còn lại ghim như thường.
const ghimDuoc = perSlug.filter(s => !doSlug.has(s.slug));
if (doSlug.size) {
  const dsDo = perSlug.filter(s => doSlug.has(s.slug));
  const soDau = flags.write ? ghiDauDo(dsDo) : 0;
  for (const s of dsDo) console.error(`repin-lane: ${s.slug}: không ghim — eval đỏ: ${s.evals.filter(lechE).map(e => `${e.id}=${e.exit}${e.expected !== 0 ? ` (khai ${e.expected})` : ''}`).join(', ')}${flags.write ? ' · dấu lượt đỏ ở run-log' : ''}`);
  if (flags.write && soDau !== dsDo.length) log(`dấu lượt đỏ ghi được ${soDau}/${dsDo.length} hồ sơ`);
}
if (flags.write) {
  for (const s of ghimDuoc) {
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
    if (rc.status !== 0) { console.error(`repin-lane: ${s.slug} đã ghi nhưng recheck-evidence ĐỎ (exit ${rc.status}) — sửa trước khi commit:\n${rc.stderr}`); process.stderr.write(tongKet('do').dong + '\n'); process.exit(1); }
    log(`${s.slug}: recheck-evidence xanh`);
  }
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
log(`LÀN XANH — run_id ${runId}${flags.write ? ' (đã ghi)' : ' (chưa ghi: thêm --write)'}${doSlug.size ? ` · ${ghimDuoc.length}/${perSlug.length} hồ sơ ghim, ${doSlug.size} hồ sơ đỏ không ghim` : ''}`);
process.stderr.write(tk.dong + '\n');
