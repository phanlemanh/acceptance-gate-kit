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
const ALL_IDS = ['LM1', 'LM2', 'LM3', 'LM5', 'LM8'];
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

// LM3 · AC-3 — không nuốt cấu hình khác. HAI CHÂN RỜI, mỗi chân thông điệp riêng.
// Danh sách khoá phải-giữ DUYỆT TỪ bản ở mốc, không liệt tay trong ca.
function checkPreserved(baseObj, treeObj) {
  const errs = [];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // (a) mọi khoá cấp cao NGOÀI `permissions` — `permissions` là thứ ô này THÊM
  for (const k of Object.keys(baseObj)) {
    if (k === 'permissions') continue;
    if (!(k in treeObj)) { errs.push(`(a) MAT khoa cap cao: "${k}"`); continue; }
    if (!same(baseObj[k], treeObj[k])) errs.push(`(a) DOI gia tri khoa cap cao: "${k}"`);
  }
  // (b) trong `permissions`: mọi khoá ngoài `allow` giữ nguyên; `allow` chỉ được THÊM
  const bp = baseObj.permissions, tp = treeObj.permissions || {};
  if (bp) {
    for (const k of Object.keys(bp)) {
      if (k === 'allow') continue;
      if (!same(bp[k], tp[k])) errs.push(`(b) khoa trong permissions bi doi hoac mat: "${k}"`);
    }
    for (const e of (bp.allow || [])) {
      if (!(tp.allow || []).includes(e)) errs.push(`(b) MAT entry allow von co o moc: "${e}"`);
    }
  }
  return errs;
}

// Mốc git CỐ ĐỊNH đọc TỪ contract, không hardcode sha trong ca.
function baseSettings() {
  const contract = readFileSync(CONTRACT, 'utf8');
  const m = contract.match(/\*\*BASE-LMSQBPL:\*\*\s*`([0-9a-f]{40})`/);
  if (!m) throw new Error('khong doc duoc moc BASE-LMSQBPL tu contract.md');
  const raw = execFileSync('git', ['show', `${m[1]}:.claude/settings.json`], { cwd: ROOT, encoding: 'utf8' });
  return { sha: m[1], obj: JSON.parse(raw) };
}

// LM5 · AC-5 — đường thoái hoá trong nghi thức. BỐN VẾ RỜI.
// Ba vế đầu là phép đo CÓ-MẶT trên từ vựng ĐÓNG: chúng canh điều khoản không bị
// xoá hay rút ruột, KHÔNG chứng minh câu chữ nói đúng ý — nghĩa của văn xuôi là
// việc người duyệt, đúng bài học hồ sơ design-pass-nac. Vế thứ tư mới là quan hệ
// đếm được: mốc neo xuất hiện ĐÚNG MỘT lần trên trọn hai thư mục.
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
function checkFallback(skillText, listFiles, readAt) {
  const b = block(skillText, FALLBACK_ANCHOR);
  if (b === null) return [`thieu moc neo ${FALLBACK_ANCHOR} trong nghi thuc`];
  const errs = [];
  // (1) điều kiện kích hoạt phân biệt được với BLOCKED nguyên nhân khác
  if (!/(classifier|bộ phân loại)/i.test(b) || !/(nguyên nhân khác|phân biệt)/i.test(b))
    errs.push('ve 1: thieu dieu kien kich hoat phan biet "chan vi bo phan loai" voi BLOCKED khac');
  // (2) hành động bắt buộc: tuần tự VÀ không fan-out lại — hai mảnh, một vế
  if (!/tuần tự/i.test(b) || !/KHÔNG dispatch lại fan-out|KHÔNG fan-out lại/i.test(b))
    errs.push('ve 2: thieu hanh dong bat buoc "luot ke di TUAN TU, KHONG fan-out lai"');
  // (3) con trỏ tới đường tuần tự
  if (!/Phase 3/.test(b) || !/acceptance/.test(b))
    errs.push('ve 3: thieu con tro toi duong verify doc lap tuan tu');
  // (4) QUAN HỆ ĐẾM ĐƯỢC: mốc neo đúng MỘT chỗ trên trọn hai thư mục
  const hits = listFiles().filter(f => (readAt(f) || '').includes('<<<' + FALLBACK_ANCHOR));
  if (hits.length !== 1)
    errs.push(`ve 4: moc neo xuat hien ${hits.length} cho (phai dung 1): ${hits.map(f => path.relative(ROOT, f)).join(', ')}`);
  return errs;
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
  // m3 bẻ ĐẦU KIA (config) — chứng minh phép đo đọc CẢ HAI vật, không chỉ settings
  ['m3-them-suite-key-o-config', (s, c) => {
    const lines = c.split('\n');
    const i = lines.findIndex(l => /^\s{4}- executors\.script\.product_map\s*$/.test(l));
    lines.splice(i + 1, 0, '    - executors.script.coverage_lint');
    return [s, lines.join('\n')];
  }, 'THIEU lenh trong permissions.allow: "node scripts/eval-coverage-lint.js ."'],
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

if (want('LM3')) {
  const errs = [];
  let base;
  try { base = baseSettings(); } catch (e) { errs.push(`khong lay duoc ban o moc: ${e.message}`); }
  if (base) {
    const tree = readJSON(SETTINGS);
    // ── CHÂN (a): CẶP THẬT mốc ↔ cây. Đối chứng dương chạy TRƯỚC. ──
    const clean = checkPreserved(base.obj, tree);
    if (clean.length) errs.push(`doi chung duong DO tren cap THAT: ${clean.join(' · ')}`);
    const topKeys = Object.keys(base.obj).filter(k => k !== 'permissions');
    if (!topKeys.length) errs.push('ban o moc khong co khoa cap cao nao ngoai permissions — chan (a) hang dung, khong do duoc gi');
    else {
      const m1 = JSON.parse(JSON.stringify(tree)); delete m1[topKeys[0]];
      if (!checkPreserved(base.obj, m1).some(e => e.includes(`(a) MAT khoa cap cao: "${topKeys[0]}"`)))
        errs.push('m1: xoa mot khoa cap cao ma khong do');
      const m3 = JSON.parse(JSON.stringify(tree)); m3[topKeys[0]] = { 'da-doi': true };
      if (!checkPreserved(base.obj, m3).some(e => e.includes(`(a) DOI gia tri khoa cap cao: "${topKeys[0]}"`)))
        errs.push('m3: doi gia tri mot khoa cap cao ma khong do');
    }
    // ── CHÂN (b): bản ở mốc CHƯA có khối `permissions`, nên cặp thật không có gì để
    // mất. Chứng chân này biết đỏ trên CẶP SINH BỞI CODE — CÙNG hàm so, khác input.
    // Khai thẳng ở evals/contract; nó thành phép đo trên vật thật ngay khi settings
    // của kho có `deny`/`ask`.
    if (base.obj.permissions) {
      errs.push('ban o moc NAY DA co khoi permissions — cap nhat ca: chan (b) do duoc tren cap that, bo cap sinh');
    }
    const bSyn = { permissions: { allow: ['Bash(a)', 'Bash(b)'], deny: ['Bash(rm -rf /)'], defaultMode: 'default' } };
    const tSyn = { permissions: { allow: ['Bash(a)', 'Bash(b)', 'Bash(c)'], deny: ['Bash(rm -rf /)'], defaultMode: 'default' } };
    const cleanSyn = checkPreserved(bSyn, tSyn);
    if (cleanSyn.length) errs.push(`doi chung duong DO tren cap sinh: ${cleanSyn.join(' · ')}`);
    const m2 = JSON.parse(JSON.stringify(tSyn)); delete m2.permissions.deny;
    if (!checkPreserved(bSyn, m2).some(e => e.includes('(b) khoa trong permissions bi doi hoac mat: "deny"')))
      errs.push('m2: xoa permissions.deny ma khong do');
    const m4 = JSON.parse(JSON.stringify(tSyn)); m4.permissions.allow = m4.permissions.allow.filter(x => x !== 'Bash(a)');
    if (!checkPreserved(bSyn, m4).some(e => e.includes('(b) MAT entry allow von co o moc: "Bash(a)"')))
      errs.push('m4: xoa mot entry allow von co o moc ma khong do');
    const m5 = JSON.parse(JSON.stringify(tSyn)); m5.permissions.defaultMode = 'bypassPermissions';
    if (!checkPreserved(bSyn, m5).some(e => e.includes('(b) khoa trong permissions bi doi hoac mat: "defaultMode"')))
      errs.push('m5: doi defaultMode ma khong do');
  }
  if (errs.length) fail('LM3', errs.join(' · '));
  else pass('LM3', 'khong nuot cau hinh khac: chan (a) tren cap THAT moc<->cay + chan (b) tren cap sinh + 5 mutant do dung ve');
}

if (want('LM5')) {
  const FL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
  const listFiles = () => SCAN_DIRS.flatMap(d => walkFiles(path.join(ROOT, d)));
  const readAt = f => { try { return readFileSync(f, 'utf8'); } catch { return null; } };
  const src = readAt(FL) || '';
  const clean = checkFallback(src, listFiles, readAt);
  if (clean.length) fail('LM5', `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  else {
    const errs = [];
    const b = block(src, FALLBACK_ANCHOR);
    const mut = (frag, repl) => {
      const b2 = b.replace(frag, repl);
      if (b2 === b) return null;
      return src.replace(b, b2);
    };
    const cases = [
      ['m1-bo-dieu-kien', mut('Phân biệt với BLOCKED do nguyên nhân khác', 'Khi ấy thì'), 've 1'],
      ['m2-bo-hanh-dong', mut('KHÔNG dispatch lại fan-out', 'làm gì thì tuỳ'), 've 2'],
      ['m3-bo-con-tro', mut('Phase 3', 'bước sau'), 've 3'],
    ];
    for (const [name, mutated, needle] of cases) {
      if (mutated === null) { errs.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
      const e = checkFallback(mutated, listFiles, readAt);
      if (!e.some(x => x.includes(needle))) errs.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${e.join(' · ') || 'KHONG LOI NAO'})`);
    }
    // m4 — CHIỀU ĐỎ NGOÀI file đã biết: mốc neo mọc thêm ở file THỨ HAI dưới hai thư mục
    const THIRD = path.join(ROOT, 'skills', 'acceptance', 'SKILL.md');
    const listPlus = listFiles;
    const readPlus = f => (f === THIRD ? (readAt(f) || '') + '\n<<<' + FALLBACK_ANCHOR + '\n' : readAt(f));
    const e4 = checkFallback(src, listPlus, readPlus);
    if (!e4.some(x => x.includes('moc neo xuat hien 2 cho') && x.includes('skills/acceptance/SKILL.md')))
      errs.push('m4: moc neo moc them o file THU HAI ma khong do — allowlist thieu chieu do ngoai danh sach');
    if (errs.length) fail('LM5', errs.join(' · '));
    else pass('LM5', 'duong thoai hoa: 3 ve co-mat tren tu vung dong + 1 quan he dem duoc + 4 mutant');
  }
}

// LM_CASES nêu id không tồn tại → không được xanh im lặng
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [LM_CASES] khong khop ca nao: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`lan-may-classifier: ${failures} ca do`); process.exit(1); }
