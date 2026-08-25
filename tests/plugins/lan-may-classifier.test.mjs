// tests/plugins/lan-may-classifier.test.mjs — ca hồ sơ lan-may-song-qua-bo-phan-loai.
// Đo LỜI KHAI trên bốn vật (luật cho-phép · khuôn khởi tạo · nghi thức · tài liệu).
// Không có ca LM7: E7/AC-7 là eval judgment (hội đồng chấm chất lượng bộ đo), không
// phải phép đo máy — số hiệu giữ khớp với eval để đọc chéo không phải dịch.
//
// Mọi đường dẫn suy từ vị trí file này. Ma trận mutant là HỢP ĐỒNG, khai giữa mốc neo
// MUTANT-MATRIX ở đầu evals.yaml của hồ sơ; số mutant = số vế được khẳng định.
//   LM_CASES=LM1,LM2 node tests/plugins/lan-may-classifier.test.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
// Bộ đọc cấu hình DÙNG CHUNG của kit — CLAUDE.md cấm mọc parser thứ năm.
const { resolveConfigKey } = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));

const SETTINGS = path.join(ROOT, '.claude', 'settings.json');
const CONFIG = path.join(ROOT, '_acceptance', 'config.yaml');
const CONTRACT = path.join(ROOT, '_acceptance', 'lan-may-song-qua-bo-phan-loai', 'contract.md');

// Danh sách ca ĐÃ CÀI, mọc dần theo từng task của kế hoạch. Khai sẵn ca chưa viết
// làm bộ chạy đỏ oan ở mỗi commit trung gian; danh sách ĐỦ được evals.yaml canh
// (mỗi eval trỏ một ca), nên không có đường quên im lặng.
// LM3 ĐÃ RỜI file này sang răng hồ sơ `_acceptance/<slug>/rang-khong-nuot.sh`: nó so
// settings ở mốc git cố định với cây, nên nằm trong bộ kiểm THƯỜNG TRỰC thì mọi sửa
// hợp lệ về sau của enabledPlugins / extraKnownMarketplaces — do hồ sơ KHÁC làm — sẽ
// làm suite đỏ oan («thước ghim vào thứ SẼ ĐỔI»). Răng chết theo hồ sơ khi gộp.
const ALL_IDS = ['LM1', 'LM2', 'LM4', 'LM5', 'LM6', 'LM8'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
let failures = 0;
const only = (process.env.LM_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const readJSON = p => JSON.parse(readFileSync(p, 'utf8'));

// <<<PERM-RULE-GRAMMAR
// Khuôn luật quyền của khung cấu hình harness: mỗi entry là `Bash(<lệnh>)` — bọc bắt
// buộc, tên công cụ đứng trước. Nguồn: khoá `permissions` (allow/deny/ask) của khung
// cấu hình, đọc nguyên văn 2026-08-25. Khuôn sống ĐÚNG một chỗ: bên viết (settings)
// và bên đọc (ca này) phải cùng khuôn, không mỗi bên tự chế.
const PERM_RULE = /^Bash\((.+)\)$/;
// PERM-RULE-GRAMMAR>>>

// ---------------------------------------------------------------------------
// Bộ kiểm — DÙNG CHUNG cho chiều xanh và mọi mutant. Mỗi hàm trả mảng lỗi có TÊN
// vật/entry/lệnh trong thông điệp; ca chỉ so mã thoát không phân biệt được «bắt
// đúng lỗi» với «chưa bao giờ chạy».
// ---------------------------------------------------------------------------

const allowEntries = obj => ((obj.permissions || {}).allow || []);

// Danh sách lệnh kiểm CỐ ĐỊNH — nguồn sự thật là config, KHÔNG phải hằng trong ca.
// Chỉ bước đọc DANH SÁCH là cục bộ (bộ đọc chung của kit chỉ giải scalar, không giải
// list); mỗi phần tử vẫn giải bằng chính resolveConfigKey của kit.
function suiteCommands(configText) {
  const lines = configText.split('\n');
  const i = lines.findIndex(l => /^\s{2}suite_keys:\s*$/.test(l));
  if (i < 0) return { keys: [], cmds: [], err: 'khong tim thay feature_loop.suite_keys trong config' };
  const keys = [];
  for (let j = i + 1; j < lines.length; j++) {
    const m = lines[j].match(/^\s{4}- ([\w.]+)\s*$/);
    if (m) { keys.push(m[1]); continue; }
    if (lines[j].trim() === '' || lines[j].trim().startsWith('#')) continue;
    break;
  }
  const cmds = [], err = [];
  for (const k of keys) {
    const v = resolveConfigKey(configText, k);
    if (v === null) err.push(`khong giai duoc suite_key: ${k}`);
    else cmds.push(String(v).replace(/^"|"$/g, ''));
  }
  return { keys, cmds, err: err.join(' · ') };
}

// LM1 · AC-1 — QUAN HỆ SONG ÁNH giữa hai vật, không so với hằng gõ tay
function checkBijection(settingsObj, configText) {
  const { cmds, err } = suiteCommands(configText);
  if (err) return [err];
  const allow = allowEntries(settingsObj).map(e => (PERM_RULE.exec(e) || [null, e])[1]);
  const errs = [];
  for (const c of cmds) if (!allow.includes(c)) errs.push(`THIEU lenh trong permissions.allow: "${c}"`);
  for (const a of allow) if (!cmds.includes(a)) errs.push(`THUA lenh trong permissions.allow: "${a}" — khong co trong feature_loop.suite_keys`);
  return errs;
}

// LM2 · AC-2 — mệnh đề ĐÓNG: không entry nào chứa `*`
function checkNoStar(settingsObj) {
  const errs = [];
  const entries = allowEntries(settingsObj);
  // Danh sách RỖNG thoả «không entry nào chứa *» một cách HẰNG ĐÚNG — xanh rỗng.
  // Bộ đếm phải kêu, nếu không ca này xanh cả trên cây chưa hề có luật nào.
  if (!entries.length) errs.push('permissions.allow rong hoac vang — phep dem khong co gi de dem (hang dung)');
  for (const e of entries) if (e.includes('*')) errs.push(`entry cho-phep chua ky tu *: "${e}"`);
  return errs;
}

// LM8 · AC-8 — văn phạm luật quyền + entry nằm đúng chỗ
function checkGrammar(settingsObj, configText) {
  const { cmds } = suiteCommands(configText);
  const p = settingsObj.permissions || {};
  const errs = [];
  for (const e of (p.allow || [])) if (!PERM_RULE.test(e)) errs.push(`entry KHONG dung van pham Bash(<lenh>): "${e}"`);
  for (const k of ['ask', 'deny']) {
    for (const e of (p[k] || [])) {
      const cmd = (PERM_RULE.exec(e) || [null, e])[1];
      if (cmds.includes(cmd)) errs.push(`lenh kiem dat NHAM CHO: "${e}" nam duoi permissions.${k}, phai o allow`);
    }
  }
  if (!(p.allow || []).length) errs.push('permissions.allow rong hoac vang — khong co entry nao de kiem van pham');
  return errs;
}

// MỖI VẾ LÀ MỘT ĐIỀU KIỆN, khai dạng BẢNG — không phải phép AND/HOẶC viết tay.
// Gộp hai điều kiện vào một vế là chỗ trốn: chỉ cần một nhánh còn sống thì nhánh kia
// chết mà không mutant nào chứng được, và số mutant khai ra sẽ nhỏ hơn số điều kiện
// thật. Bảng ép «số vế = số điều kiện = số mutant» thành quan hệ nhìn thấy được.
// (Vấp thật S4-r1: checkAdvice và checkFallback dùng phép HOẶC ngay phía trên một
//  chú thích tự dặn là tránh phép HOẶC.)
const checkClauses = (text, clauses) =>
  clauses.filter(c => !c.re.test(text)).map(c => `${c.id}: ${c.msg}`);

// LM5 · AC-5 — đường thoái hoá trong nghi thức.
// Ba vế đầu là phép đo CÓ-MẶT trên từ vựng ĐÓNG: chúng canh điều khoản không bị
// xoá hay rút ruột, KHÔNG chứng minh câu chữ nói đúng ý — nghĩa của văn xuôi là
// việc người duyệt, đúng bài học hồ sơ design-pass-nac. Vế thứ tư mới là quan hệ
// đếm được: mốc neo xuất hiện ĐÚNG MỘT lần trên trọn hai thư mục.
// Văn xuôi trong markdown bị ngắt dòng theo bề rộng cột; phép đo bám chuỗi mà
// không gộp khoảng trắng sẽ vỡ mỗi lần ai đó xuống dòng lại — hỏng vì TRÌNH BÀY
// chứ không vì NGHĨA. Mọi phép đo trên văn xuôi ở file này đi qua flat().
const flat = t => String(t).replace(/\s+/g, ' ');
const FALLBACK_ANCHOR = 'CLASSIFIER-FALLBACK';
const SCAN_DIRS = ['skills', 'feature-loop'];
function walkFiles(abs, acc = []) {
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const q = path.join(abs, e.name);
    if (e.isDirectory()) walkFiles(q, acc); else acc.push(q);
  }
  return acc;
}
const block = (text, name) => {
  const m = text.match(new RegExp('<<<' + name + '\\s*-->\\n([\\s\\S]*?)<!-- ' + name + '>>>'));
  return m ? m[1] : null;
};
const FALLBACK_CLAUSES = [
  { id: 've1a', re: /bộ phân loại/i, msg: 'thieu dau hieu kich hoat: bo phan loai', bait: 'BỘ PHÂN LOẠI' },
  { id: 've1b', re: /nguyên nhân khác/i, msg: 'thieu ve phan biet voi BLOCKED nguyen nhan KHAC', bait: 'nguyên nhân khác' },
  { id: 've2a', re: /lệnh chạy TUẦN TỰ/, msg: 'thieu hanh dong bat buoc: luot ke di TUAN TU (khoi con cau tien le nhac tuan tu — do tu don le la de cau do do ho)', bait: 'lệnh chạy TUẦN TỰ' },
  { id: 've2b', re: /KHÔNG dispatch lại fan-out/, msg: 'thieu cam KHONG dispatch lai fan-out', bait: 'dispatch lại fan-out' },
  { id: 've3a', re: /Phase 3/, msg: 'thieu con tro toi Phase 3', bait: 'Phase 3' },
  { id: 've3b', re: /`acceptance`/, msg: 'thieu ten skill acceptance trong con tro', bait: '`acceptance`' },
];
function checkFallback(skillText, listFiles, readAt) {
  const b0 = block(skillText, FALLBACK_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${FALLBACK_ANCHOR} trong nghi thuc`];
  const errs = checkClauses(flat(b0), FALLBACK_CLAUSES);
  // vế thứ bảy — QUAN HỆ ĐẾM ĐƯỢC: mốc neo đúng MỘT chỗ trên trọn hai thư mục
  const hits = listFiles().filter(f => (readAt(f) || '').includes('<<<' + FALLBACK_ANCHOR));
  if (hits.length !== 1)
    errs.push(`ve4: moc neo xuat hien ${hits.length} cho (phai dung 1): ${hits.map(f => path.relative(ROOT, f)).join(', ')}`);
  return errs;
}

// LM4 · AC-4 — khối khuyên kho tiêu thụ, BA VẾ RỜI (phép đo CÓ-MẶT trên từ vựng đóng).
const ADVICE_ANCHOR = 'CONSUMER-ALLOW-ADVICE';
const ADVICE_CLAUSES = [
  { id: 'a1', re: /KHỚP CHÍNH XÁC/, msg: 'thieu dang khai KHOP CHINH XAC', bait: 'KHỚP CHÍNH XÁC' },
  { id: 'a2', re: /KHÔNG dùng `\*`/, msg: 'thieu cau cam dung `*` (danh sach cho-phep rong)', bait: 'KHÔNG dùng `*`' },
  { id: 'b', re: /nút cổ chai/i, msg: 'thieu ly do: bo phan loai la nut co chai cua lan may', bait: 'nút cổ chai' },
  { id: 'c1', re: /KHÔNG tự ghi/, msg: 'thieu cau khai kit KHONG tu ghi luat vao kho ho', bait: 'KHÔNG tự ghi' },
  { id: 'c2', re: /quyết định an ninh/i, msg: 'thieu cau cap quyen la QUYET DINH AN NINH cua doi', bait: 'quyết định an' },
];
function checkAdvice(initText) {
  const b0 = block(initText, ADVICE_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${ADVICE_ANCHOR} trong khuon khoi tao`];
  return checkClauses(flat(b0), ADVICE_CLAUSES);
}

// LM6 · AC-6 — tài liệu vận hành nêu CẢ HAI nửa.
const GUIDE_ANCHOR = 'GUIDE-CLASSIFIER-LANE';
const GUIDE_CLAUSES = [
  { id: 'muc1', re: /permissions\.allow/, msg: 'khong neu luat cho-phep cua kho', bait: 'permissions.allow' },
  { id: 'muc1b', re: /lệnh kiểm/i, msg: 'khong noi ro luat ay danh cho LENH KIEM co dinh', bait: 'lệnh kiểm' },
  { id: 'muc2', re: new RegExp(FALLBACK_ANCHOR), msg: 'khong tro toi moc neo duong thoai hoa', bait: 'CLASSIFIER-FALLBACK` trong skill' },
  { id: 'muc2b', re: /tuần tự/i, msg: 'khong noi luot ke di TUAN TU', bait: 'tuần tự' },
];
function checkGuide(guideText) {
  // Đo TRONG KHỐI có mốc neo, KHÔNG grep trọn tài liệu: GUIDE.md đã có sẵn cụm
  // «tuần tự» ở hai chỗ khác không liên quan, nên grep cả file làm vế muc2b thành
  // assertion CHẾT — xoá trọn mục mới mà vế đó vẫn xanh (vấp thật S4-r1).
  const b0 = block(guideText, GUIDE_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${GUIDE_ANCHOR} trong tai lieu van hanh`];
  return checkClauses(flat(b0), GUIDE_CLAUSES);
}

// ---------------------------------------------------------------------------
// Chạy ca: đối chứng dương TRƯỚC, rồi ma trận mutant. Mutant bẻ BẢN SAO của vật và
// đi qua CHÍNH bộ kiểm của chiều xanh — cùng hàm, khác input.
// needle nhận chuỗi hoặc mảng chuỗi (mảng = MỌI vế phải xuất hiện).
// ---------------------------------------------------------------------------
function runObj(id, label, check, mutants) {
  if (!want(id)) return;
  let settings, cfg;
  try { settings = readJSON(SETTINGS); cfg = readFileSync(CONFIG, 'utf8'); }
  catch (e) { return fail(id, `khong doc duoc vat: ${e.message}`); }
  const clean = check(settings, cfg);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const [name, mutate, needle] of mutants) {
    const [s2, c2] = mutate(JSON.parse(JSON.stringify(settings)), cfg);
    if (JSON.stringify(s2) === JSON.stringify(settings) && c2 === cfg) { bad.push(`${name}: lenh tiem KHONG doi duoc gi`); continue; }
    const errs = check(s2, c2);
    for (const nd of (Array.isArray(needle) ? needle : [needle])) {
      if (!errs.some(e => e.includes(nd))) bad.push(`${name}: khong do dung ve "${nd}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${mutants.length} mutant do dung ve`);
}

const CMDS = () => suiteCommands(readFileSync(CONFIG, 'utf8')).cmds;

runObj('LM1', 'song anh permissions.allow <-> feature_loop.suite_keys', checkBijection, [
  ['m1-bo-mot-lenh', (s, c) => { s.permissions.allow = s.permissions.allow.slice(1); return [s, c]; },
    `THIEU lenh trong permissions.allow: "${CMDS()[0]}"`],
  ['m2-them-lenh-la', (s, c) => { s.permissions.allow.push('Bash(echo khong-thuoc-suite)'); return [s, c]; },
    'THUA lenh trong permissions.allow: "echo khong-thuoc-suite"'],
  // m3 bẻ ĐẦU KIA (config) — chứng minh phép đo đọc CẢ HAI vật, không chỉ settings.
  // Khoá chèn và chuỗi kỳ vọng SUY TỪ CONFIG lúc chạy: ghim cứng tên khoá hay giá
  // trị của nó là ghim vào thứ SẼ ĐỔI — đổi lệnh coverage-lint (việc hợp lệ, không
  // đụng ô này) sẽ làm ca đỏ vì HẠ TẦNG chứ không vì vật (vấp thật S4-r1).
  ['m3-them-suite-key-o-config', (s2, c) => {
    const names = [...c.matchAll(/^ {4}([a-z_0-9]+):\s*"?(node |bash )/gm)].map(m => m[1]);
    const inSuite = suiteCommands(c).keys;
    const spare = names.flatMap(n => ['executors.script.' + n, 'executors.test.' + n])
      .find(k => !inSuite.includes(k) && resolveConfigKey(c, k) !== null);
    if (!spare) return [s2, c];                      // không có khoá dư → mutant no-op, runner kêu
    const lines = c.split('\n');
    let last = -1;
    for (let i = 0; i < lines.length; i++) if (/^ {4}- executors\./.test(lines[i])) last = i;
    lines.splice(last + 1, 0, '    - ' + spare);
    return [s2, lines.join('\n')];
  }, 'THIEU lenh trong permissions.allow'],
  ['m4-lech-mot-ky-tu', (s, c) => { s.permissions.allow[0] = s.permissions.allow[0].replace('.sh)', '.shX)'); return [s, c]; },
    ['THIEU lenh', 'THUA lenh']],
]);

runObj('LM2', 'khong entry cho-phep nao chua ky tu *', checkNoStar, [
  ['m1-them-glob-ho-lenh', (s, c) => { s.permissions.allow.push('Bash(bash *)'); return [s, c]; }, 'Bash(bash *)'],
  ['m2-doi-entry-thanh-glob', (s, c) => { s.permissions.allow[0] = s.permissions.allow[0].replace(')', ' *)'); return [s, c]; }, 'chua ky tu *'],
  ['m3-them-glob-tron', (s, c) => { s.permissions.allow.push('Bash(*)'); return [s, c]; }, 'Bash(*)'],
]);

runObj('LM8', 'van pham luat quyen + entry nam dung cho', checkGrammar, [
  ['m1-entry-tran-khong-boc', (s, c) => { s.permissions.allow[0] = CMDS()[0]; return [s, c]; },
    'KHONG dung van pham Bash(<lenh>)'],
  ['m2-dat-nham-duoi-ask', (s, c) => { const e = s.permissions.allow.shift(); (s.permissions.ask ||= []).push(e); return [s, c]; },
    'dat NHAM CHO'],
  ['m3-doi-ten-boc', (s, c) => { s.permissions.allow[0] = s.permissions.allow[0].replace(/^Bash\(/, 'Shell('); return [s, c]; },
    'KHONG dung van pham Bash(<lenh>)'],
]);

if (want('LM5')) {
  const FL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
  const listFiles = () => SCAN_DIRS.flatMap(d => walkFiles(path.join(ROOT, d)));
  const readAt = f => { try { return readFileSync(f, 'utf8'); } catch { return null; } };
  const src = readAt(FL) || '';
  const chk = t => checkFallback(t, listFiles, readAt);
  const clean = chk(src);
  if (clean.length) fail('LM5', `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  else {
    const bad = [];
    // MỘT VẾ → MỘT MUTANT, duyệt bảng nên không thể quên vế nào
    for (const c of FALLBACK_CLAUSES) {
      const mutated = src.split(c.bait).join('«da be»');
      if (mutated === src) { bad.push(`${c.id}: lenh tiem KHONG doi duoc dong nao (bait "${c.bait}" khong co trong vat)`); continue; }
      const errs = chk(mutated);
      if (!errs.some(e => e.startsWith(c.id + ':'))) bad.push(`${c.id}: be vat ma khong do dung ve (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
    // vế thứ bảy — CHIỀU ĐỎ NGOÀI file đã biết: mốc neo mọc ở file THỨ HAI
    const THIRD = path.join(ROOT, 'skills', 'acceptance', 'SKILL.md');
    const readPlus = f => (f === THIRD ? (readAt(f) || '') + '\n<<<' + FALLBACK_ANCHOR + '\n' : readAt(f));
    const e7 = checkFallback(src, listFiles, readPlus);
    if (!e7.some(x => x.startsWith('ve4:') && x.includes('skills/acceptance/SKILL.md')))
      bad.push('m-moc-neo-thu-hai: moc neo moc o file THU HAI ma khong do');
    if (bad.length) fail('LM5', bad.join(' · '));
    else pass('LM5', `duong thoai hoa: ${FALLBACK_CLAUSES.length} ve roi + 1 quan he dem duoc + ${FALLBACK_CLAUSES.length + 1} mutant`);
  }
}

// Một VẾ → một MUTANT, ép bằng cấu trúc: runner tự duyệt bảng vế, nên không thể
// «quên» mutant cho một điều kiện, và số mutant luôn bằng số vế.
function runClauses(id, label, file, check, clauses, extra = []) {
  if (!want(id)) return;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch (e) { return fail(id, `khong doc duoc vat: ${e.message}`); }
  const clean = check(src);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const c of clauses) {
    const mutated = src.split(c.bait).join('«da be»');
    if (mutated === src) { bad.push(`${c.id}: lenh tiem KHONG doi duoc dong nao (bait "${c.bait}" khong co trong vat)`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.startsWith(c.id + ':'))) bad.push(`${c.id}: be vat ma khong do dung ve (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  for (const [name, mutate, needle] of extra) {
    const mutated = mutate(src);
    if (mutated === src) { bad.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.includes(needle))) bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${clauses.length + extra.length} mutant do dung ve`);
}

function runText(id, label, file, check, mutants) {
  if (!want(id)) return;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch (e) { return fail(id, `khong doc duoc vat: ${e.message}`); }
  const clean = check(src);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const [name, frag, repl, needle] of mutants) {
    // Tiêm TOÀN CỤC khi frag là chuỗi: `String.replace(chuỗi)` chỉ đổi lần xuất hiện
    // ĐẦU, nên một cụm có mặt hai chỗ sẽ bị bẻ ở chỗ KHÔNG AI ĐO — mutant thành vô
    // hiệu mà nhìn thì vẫn như đã tiêm (lớp đã ghi sổ ở hồ sơ design-pass-nac).
    const mutated = typeof frag === 'string' ? src.split(frag).join(repl) : src.replace(frag, repl);
    if (mutated === src) { bad.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.includes(needle))) bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${mutants.length} mutant do dung ve`);
}

runClauses('LM4', 'khuon khoi tao khuyen kho tieu thu — moi ve mot dieu kien',
  path.join(ROOT, 'commands', 'acceptance-init.md'), checkAdvice, ADVICE_CLAUSES);

runClauses('LM6', 'tai lieu van hanh — do TRONG khoi co moc neo, moi ve mot dieu kien',
  path.join(ROOT, 'GUIDE.md'), checkGuide, GUIDE_CLAUSES);

// LM_CASES nêu id không tồn tại → không được xanh im lặng
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [LM_CASES] khong khop ca nao: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`lan-may-classifier: ${failures} ca do`); process.exit(1); }
