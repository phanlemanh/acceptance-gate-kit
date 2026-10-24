// tests/plugins/lop-nhin-thay.test.mjs — ca hồ sơ lop-bang-chung-nhin-thay (LNT1, LNT3, LNT4, LNT6) và hồ sơ
// anh-co-that-trong-ho-so (LNT7…LNT10).
// Fixture CODE-SINH từ khuôn (CONTRACT-FRONTMATTER-TEMPLATE), chạy gate-card.js / lint THẬT;
// hằng chuỗi RÚT từ nguồn (lib + gate-card), không literal; chiều đỏ trên bản sao, ghim thông điệp.
//   LNT_CASES=LNT1,LNT3 node tests/plugins/lop-nhin-thay.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, statSync, realpathSync, symlinkSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const LIB = path.join(ROOT, 'lib', 'lop-nhin-thay.cjs');
const NG = path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs');
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const require = createRequire(import.meta.url);
// Mốc BẤT BIẾN cho chiều đỏ có sẵn: cha của merge PR 158 (bản trước lib/lop-nhin-thay.cjs).
const BASE_LNT = '334d5d52';

let failures = 0;
const ALL_IDS = ['LNT1', 'LNT3', 'LNT4', 'LNT6', 'LNT7', 'LNT8', 'LNT9', 'LNT10'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.LNT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'lnt-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const eq = (id, got, exp, what) => { if (JSON.stringify(got) !== JSON.stringify(exp)) fail(id, `${what}: got ${JSON.stringify(got)} expected ${JSON.stringify(exp)}`); };

const BODY = '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n\n## Out of scope\n\n- a\n';
const contractOf = (surfaces, status = 'draft') => fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces, status }, BODY);
const EV_T = '  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n';
const EV_U = '  - id: E1\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "x"\n';
const gc = (root, ...a) => spawnSync('node', [GATE_CARD, '--root', root, '--slug', 'x', ...a], { encoding: 'utf8' });
const extract = root => { const r = gc(root, '--extract'); if (r.status !== 0) throw new Error('gate-card --extract exit ' + r.status + ': ' + r.stderr + r.stdout); return JSON.parse(r.stdout); };
// thẻ có thể in mã thoát màu; ca kiểm so CỤM CHỮ nên phải bỏ ESC trước khi so.
const html = root => gc(root).stdout.replace(/\x1b\[[0-9;]*m/g, '');

// enum rút từ chú thích dòng `surfaces:` của khối khuôn — không literal
const enumFromTemplate = (tpl = readFileSync(CONTRACT_TPL, 'utf8')) => {
  const blk = tpl.match(/<!-- <<<CONTRACT-FRONTMATTER-TEMPLATE -->\n([\s\S]*?)<!-- CONTRACT-FRONTMATTER-TEMPLATE>>> -->/)[1];
  const line = blk.split('\n').find(l => /^surfaces:/.test(l));
  const m = line.match(/#\s*([a-z\-]+(?:\s*\|\s*[a-z\-]+)+)/);
  if (!m) throw new Error('khuôn không có enum surfaces dạng a | b | c');
  return m[1].split('|').map(s => s.trim());
};

// ─── LNT1 — lib một nguồn ─────────────────────────────────────────────────────
if (want('LNT1')) {
  const id = 'LNT1'; const L = require(LIB); const N = require(NG);
  const before = failures;
  for (const s of ['[ui]', '[web]', '[web-ui]', '[api, web]']) eq(id, L.laMatNguoiNhin(s), true, `laMatNguoiNhin(${s})`);
  for (const s of ['[api]', '[cli]', '[mobile]', '[api, mobile]']) eq(id, L.laMatNguoiNhin(s), false, `laMatNguoiNhin(${s})`);
  eq(id, L.tokenLa('[ui, kiosk]  # chú thích web'), ['kiosk'], 'tokenLa bỏ chú thích');
  eq(id, L.coUiObserved([{ id: 'E1', executor: 'ui-check', layer: '' }]), true, 'coUiObserved đọc-cũ không nhãn');
  eq(id, L.coUiObserved([{ id: 'E1', executor: 'test', layer: 'ui-observed' }]), false, 'coUiObserved: nhãn không thay executor');
  eq(id, L.nhanLacCho([{ id: 'E1', executor: 'test', layer: 'ui-observed' }, { id: 'E2', executor: 'ui-check', layer: 'ui-observed' }]), ['E1'], 'nhanLacCho');
  eq(id, L.SURFACE_ENUM, enumFromTemplate(), 'SURFACE_ENUM == khuôn');
  // chiều đỏ round-trip: bản sao khuôn bỏ `docs` → reader phải nêu giá trị thiếu
  const tplMut = readFileSync(CONTRACT_TPL, 'utf8').replace('| docs ', '| ');
  const enumMut = enumFromTemplate(tplMut);
  const missing = L.SURFACE_ENUM.filter(x => !enumMut.includes(x));
  if (JSON.stringify(enumMut) === JSON.stringify(L.SURFACE_ENUM)) fail(id, 'mutant khuôn bỏ docs mà reader vẫn khớp');
  else if (!missing.includes('docs')) fail(id, `reader không nêu giá trị thiếu "docs" (nêu: ${missing.join(',')})`);
  // nguong-o-co-hoi nhận alias qua lib
  eq(id, N.coNguoiDungCuoi('[web]'), true, 'coNguoiDungCuoi([web])');
  eq(id, N.coNguoiDungCuoi('[web-ui]'), true, 'coNguoiDungCuoi([web-ui])');
  eq(id, N.coNguoiDungCuoi('[mobile]'), true, 'coNguoiDungCuoi([mobile]) giữ nguyên');
  eq(id, N.coNguoiDungCuoi('[api]'), false, 'coNguoiDungCuoi([api])');
  // chiều đỏ có sẵn — neo MỐC BẤT BIẾN (cha của merge PR 158, bản trước lib lop-nhin-thay),
  // KHÔNG neo nhánh `main`: nhánh di chuyển thì phép đo lặng lẽ đo cây khác (hình dạng 4).
  const old = spawnSync('git', ['-C', ROOT, 'show', `${BASE_LNT}:lib/nguong-o-co-hoi.cjs`], { encoding: 'utf8' });
  if (old.status !== 0) fail(id, `không đọc được mốc ${BASE_LNT} — chiều đỏ có sẵn không chạy`);
  else {
    const t = tmp(); mkdirSync(path.join(t, 'lib'), { recursive: true });
    cpSync(path.join(ROOT, 'lib', 'md-section.cjs'), path.join(t, 'lib', 'md-section.cjs'));
    writeFileSync(path.join(t, 'lib', 'nguong-o-co-hoi.cjs'), old.stdout);
    if (!/lop-nhin-thay/.test(old.stdout)) {
      const NOld = require(path.join(t, 'lib', 'nguong-o-co-hoi.cjs'));
      eq(id, NOld.coNguoiDungCuoi('[web]'), false, 'bản main không nhận [web] (chiều đỏ có sẵn)');
    }
  }
  // MUTANT MỘT-NGUỒN (gap-probe F3): bản sao lib+scripts bỏ web khỏi alias → BA bộ đọc cùng đổi
  const m = tmp();
  cpSync(path.join(ROOT, 'lib'), path.join(m, 'lib'), { recursive: true });
  cpSync(path.join(ROOT, 'scripts'), path.join(m, 'scripts'), { recursive: true });
  const libSrc = readFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), 'utf8');
  const libMut = libSrc.replace(/web:\s*'ui',\s*/, '');
  if (libMut === libSrc) fail(id, 'không tiêm được mutant alias (khuôn `web: \'ui\',` đổi?)');
  writeFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), libMut);
  const NM = require(path.join(m, 'lib', 'nguong-o-co-hoi.cjs'));
  eq(id, NM.coNguoiDungCuoi('[web]'), false, 'mutant: nguong-o-co-hoi mất web');
  const ws = tmp(); W(ws, '_acceptance/x/contract.md', contractOf('web')); W(ws, '_acceptance/x/evals.yaml', 'evals:\n' + EV_T);
  const gcM = spawnSync('node', [path.join(m, 'scripts', 'gate-card.js'), '--root', ws, '--slug', 'x', '--extract'], { encoding: 'utf8' });
  const gcG = gc(ws, '--extract');
  const uoM = gcM.status === 0 ? (JSON.parse(gcM.stdout).ui_observed || {}) : {};
  const uoG = gcG.status === 0 ? (JSON.parse(gcG.stdout).ui_observed || {}) : {};
  eq(id, uoM.applicable, false, 'mutant: gate-card [web] applicable');
  eq(id, uoG.applicable, true, 'lành: gate-card [web] applicable');
  // DẤU HIỆU BẢN SAO ĐÃ CHẠY (hình dạng 4): nhánh nghĩa vụ VẮNG ở bản sao có thể vì
  // mutant đúng, mà cũng có thể vì bản sao chưa từng chạy (cp lỗi, exit 127). Bản sao
  // bỏ alias `web` thì `web` thành token LẠ — đó là dấu dương chứng minh nó đã chạy.
  eq(id, uoM.token_la, ['web'], 'dấu hiệu bản sao đã chạy: mutant trả token_la [web]');
  eq(id, uoG.token_la, [], 'lành: token_la rỗng');
  const lintM = spawnSync('node', [path.join(m, 'scripts', 'eval-coverage-lint.js'), ws], { encoding: 'utf8' });
  const lintG = spawnSync('node', [LINT, ws], { encoding: 'utf8' });
  // Dòng NGHĨA VỤ (không phải dòng token-lạ: mutant bỏ alias thì `web` thành token lạ, W8-token nổ hợp lệ)
  const OBLIG = /\] W8 surfaces include a human-visible UI/;
  if (OBLIG.test(lintM.stdout)) fail(id, 'mutant: lint vẫn đòi ui-check cho [web]');
  if (!OBLIG.test(lintG.stdout)) fail(id, 'lành: lint không đòi ui-check cho [web]');
  if (failures === before) pass(id, 'lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc + dấu hiệu bản sao đã chạy');
}

// ─── LNT3 — thẻ Cổng Phạm vi: cờ + extract ui_observed ───────────────────────
if (want('LNT3')) {
  const id = 'LNT3'; const L = require(LIB); const before = failures;
  const gcSrc = readFileSync(GATE_CARD, 'utf8');
  const pick = (re, w) => { const m = gcSrc.match(re); if (!m) throw new Error('gate-card.js không khai ' + w); return m[1]; };
  const WARN = pick(/UI_OBS_FLAG_WARN = '([^']+)'/, 'UI_OBS_FLAG_WARN');
  const INFO = pick(/UI_OBS_FLAG_INFO = '([^']+)'/, 'UI_OBS_FLAG_INFO');
  const ws = (surfaces, evalsBody, ledger) => { const r = tmp(); W(r, '_acceptance/x/contract.md', contractOf(surfaces)); W(r, '_acceptance/x/evals.yaml', 'evals:\n' + evalsBody); if (ledger) W(r, '_acceptance/x/decisions.jsonl', ledger); return r; };
  const X = r => extract(r).ui_observed;
  let r = ws('ui', EV_T);
  eq(id, X(r), { applicable: true, present: false, declared: 0, descoped: null, token_la: [] }, '(a) extract');
  if (!html(r).includes(WARN)) fail(id, '(a) HTML thiếu cờ fwarn ' + WARN);
  r = ws('ui', EV_T, `{"id":"d-9","type":"descope","decision":"${L.UI_OBSERVED_DESCOPE}hỏng chụp"}\n`);
  eq(id, X(r).descoped, 'd-9', '(b) descoped');
  { const h = html(r); if (!h.includes(INFO) || !h.includes('d-9') || h.includes(WARN)) fail(id, '(b) cờ finfo nêu id, không còn fwarn'); }
  r = ws('ui', EV_U); eq(id, X(r).present, true, '(c) present'); if (html(r).includes(WARN)) fail(id, '(c) có ui-check mà vẫn cờ');
  r = ws('api', EV_T); eq(id, X(r).applicable, false, '(d) api'); if (html(r).includes(WARN)) fail(id, '(d) api mà cờ');
  r = ws('mobile', EV_T); eq(id, X(r).applicable, false, '(e) mobile');
  r = ws('web', EV_T); eq(id, X(r).applicable, true, '(f) web alias');
  r = ws('ui', EV_T, '{"id":"d-9","type":"descope","decision":"bỏ ui-observed: hỏng"}\n');
  eq(id, X(r).descoped, null, 'seam dấu hai chấm'); if (!html(r).includes(WARN)) fail(id, 'seam: vẫn phải fwarn');
  r = ws('ui, kiosk', EV_U); eq(id, X(r).token_la, ['kiosk'], 'token lạ'); if (!/kiosk/.test(html(r))) fail(id, 'token lạ phải lên cờ');
  if (failures === before) pass(id, 'thẻ Cổng Phạm vi: cờ + extract ui_observed sáu nhánh + seam + token lạ');
}

// Tệp ảnh do ca ghi: 8 byte chữ ký PNG — bộ xét ảnh chỉ đòi tệp thường > 0 byte, không đọc điểm ảnh.
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
// ─── Bộ dựng fixture Cổng Bằng chứng — dùng chung LNT4, LNT7…LNT10 ───────────
// Báo cáo dựng từ VÙNG CHÉP của khuôn bên viết (sau mốc ---8<---), điền theo KHOÁ như
// evidenceText() của ca ra-co-ten; khối ui-check rút từ marker UI-CHECK-BLOCK-TEMPLATE —
// fixture không tự chép khuôn bên đọc (gap-probe S4-r1 #11, hình dạng 2).
const EVID_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'evidence-report-template.md');
const blockOf = (txt, marker) => { const m = txt.match(new RegExp(`<!-- <<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>> -->`)); if (!m) throw new Error('khuôn thiếu khối ' + marker); return m[1]; };
// Hai điều kiện ĐỘC LẬP của «đạt» (exit 0 VÀ có screenshot) → ma trận âm 3 ca viết trước
// (hình dạng 5, gap-probe S4-r2 #2): exit≠0+có shot · exit0+không shot · cả hai.
const uiBlock = (evalId, { exit = 0, shot = true } = {}) => {
  let b = blockOf(readFileSync(EVID_TPL, 'utf8'), 'UI-CHECK-BLOCK-TEMPLATE').replace(/E3/g, evalId);
  b = b.replace(/^(\s+run_id:).*$/m, `$1 x-${evalId}-001`).replace(/^(\s+verified_at:).*$/m, '$1 2026-09-08T00:00:00Z')
    .replace(/^(\s+observed: \|)\n[\s\S]*?(?=\n\s+network_observed:)/m, '$1\n    frame shows the hero fully rendered as expected')
    .replace(/^(\s+network_observed:).*$/m, '$1 n-a (driver)');
  if (exit !== 0) b = b.replace(/^(\s+exit_code:).*$/m, `$1 ${exit}`);
  if (!shot) b = b.split('\n').filter(l => !/^\s+(screenshot|observed|network_observed):/.test(l) && !/^\s{4}frame shows/.test(l)).join('\n');
  const left = b.match(/\{\{[^}]*\}\}/g); if (left) throw new Error('uiBlock: placeholder chưa điền: ' + left.join(' · '));
  return b.endsWith('\n') ? b : b + '\n';
};
const report = (extraBlocks, extraRows = []) => {
  const tpl = readFileSync(EVID_TPL, 'utf8');
  let t = tpl.slice(tpl.indexOf('---8<---') + '---8<---'.length).replace(/^\s*/, '');
  t = t.replace(/\{\{slug\}\}/g, 'x').replace(/^verdict: .*$/m, 'verdict: PASS').replace(/^enforcement_mode: .*$/m, 'enforcement_mode: strict')
    .replace(/^bypass_used: .*$/m, 'bypass_used: false').replace(/^verified_commit: .*$/m, `verified_commit: ${'a'.repeat(40)}`).replace(/^human_signoff:.*$/m, 'human_signoff:');
  const rowVals = ['E1', 'AC-1', 'test', 'PASS']; let ri = 0;
  t = t.replace(/^\|.*\{\{.*\|$/m, line => line.replace(/\{\{[^}]*\}\}/g, () => rowVals[ri++] ?? '…') + extraRows.map(row => '\n| ' + row.join(' | ') + ' |').join(''));
  t = t.replace(/^(- eval:).*\{\{[^}]*\}\}.*$/m, '$1 E1').replace(/^(\s+run_id:).*\{\{[^}]*\}\}.*$/m, '$1 x-E1-001')
    .replace(/^(\s+verifier:).*\{\{[^}]*\}\}.*$/m, '$1 scripts/x.sh').replace(/^(\s+verified_at:).*\{\{[^}]*\}\}.*$/m, '$1 2026-09-08T00:00:00Z')
    .replace(/^(\s+)\{\{last 5-10[^}]*\}\}.*$/m, '$1ok')
    .replace(/\{\{eval ids green-on-both[^}]*\}\}/, 'none — every feature eval is red on baseline (discriminates)')
    .replace(/\{\{eval ids with mixed pass_rate[^}]*\}\}/, 'none — every multi-run eval is uniform')
    .replace(/\{\{One line per verify round[\s\S]*?\}\}/, 'Round 1: ok');
  const left = t.match(/\{\{[^}]*\}\}/g); if (left) throw new Error('report: placeholder chưa điền: ' + left.slice(0, 3).join(' · '));
  // khối ui-check chèn ngay trước hai mục xanh-sạch (sau khối E1) — đúng chỗ khuôn dạy
  const iKL = t.indexOf('\n## Known limits'); if (iKL < 0) throw new Error('vùng chép thiếu ## Known limits');
  const before = t.slice(0, iKL).replace(/\s*$/, '\n'); const after = t.slice(iKL);
  return before + (extraBlocks ? '\n' + extraBlocks : '') + after;
};
const ws = (surfaces, evalsBody, blocks, ledger, extraRows) => { const r = tmp();
  W(r, '_acceptance/x/contract.md', contractOf(surfaces, 'verified').replace('approved_by:', 'approved_by: Manh').replace('approved_at:', 'approved_at: 2026-09-01T00:00:00Z'));
  W(r, '_acceptance/x/evals.yaml', 'evals:\n' + evalsBody); W(r, '_acceptance/x/evidence-report.md', report(blocks, extraRows)); W(r, '_acceptance/x/run-log.jsonl', '');
  if (ledger) W(r, '_acceptance/x/decisions.jsonl', ledger); return r; };

// ─── LNT4 — thẻ Cổng Bằng chứng: present đọc trên BÁO CÁO (gap-probe F1) ──────
if (want('LNT4')) {
  const id = 'LNT4'; const L = require(LIB); const before = failures;
  const gcSrc = readFileSync(GATE_CARD, 'utf8');
  const pick = (re, w) => { const m = gcSrc.match(re); if (!m) throw new Error('gate-card.js không khai ' + w); return m[1]; };
  const NONE = pick(/UI_OBS_G2_NONE = '([^']+)'/, 'UI_OBS_G2_NONE');
  const EV = EV_T + '  - id: E10\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "frame"\n';
  // (a) ma trận âm — 3 phần tử, 3 assert (số assert = số phần tử)
  const NEG = [['a1 exit≠0 + có screenshot', { exit: 4, shot: true }], ['a2 exit 0 + KHÔNG screenshot', { exit: 0, shot: false }], ['a3 cả hai', { exit: 4, shot: false }]];
  let r, x;
  for (const [name, opt] of NEG) {
    r = ws('ui', EV, uiBlock('E10', opt)); x = extract(r);
    eq(id, x.gate, 2, name + ' nhận Cổng Bằng chứng');
    eq(id, x.ui_observed, { applicable: true, present: false, declared: 1, passed: 0, descoped: null }, '(' + name + ') khai mà không đạt');
    const h = html(r); if (!h.includes(NONE) || !h.includes('E10')) fail(id, '(' + name + ') HTML thiếu cờ KHÔNG có + id E10');
  }
  // (b) đối chứng dương: ảnh khai PHẢI là tệp có thật trong evidence/ của hồ sơ (hồ sơ anh-co-that-trong-ho-so) —
  // bản trước vòng ấy chỉ dựng báo cáo mà không ghi ảnh, nên ca ghim đúng chỗ hở thành hành vi đúng.
  r = ws('ui', EV, uiBlock('E10', { exit: 0, shot: true })); W(r, '_acceptance/x/evidence/E10-step1.png', PNG); x = extract(r);
  eq(id, x.ui_observed.present, true, '(b) đạt'); eq(id, x.ui_observed.passed, 1, '(b) passed');
  { const h = html(r); if (h.includes(NONE) || !/1 eval ui-check đạt/.test(h)) fail(id, '(b) phải nêu 1 eval đạt, không cờ KHÔNG có'); }
  r = ws('ui', EV_T, ''); x = extract(r); eq(id, x.ui_observed.declared, 0, '(c) declared 0'); if (!html(r).includes(NONE)) fail(id, '(c) thiếu cờ');
  const seal = '{"id":"d-1","type":"seal","gate":1,"at":"2026-09-01T00:00:00Z"}\n';
  const ds = `{"id":"d-2","type":"descope","stage":"S4-r1","at":"2026-09-02T00:00:00Z","decision":"${L.UI_OBSERVED_DESCOPE}hạ tầng chụp hỏng","impact":"không frame"}\n`;
  r = ws('ui', EV, uiBlock('E10', { exit: 4, shot: false }), seal + ds); x = extract(r);
  if (!(x.decisions_provisional || []).some(d => d.id === 'd-2')) fail(id, '(d) descope sau seal phải ở khối CHƯA duyệt');
  eq(id, x.ui_observed.descoped, 'd-2', '(d) descoped'); if (!html(r).includes('d-2')) fail(id, '(d) cờ nêu id');
  r = ws('cli', EV_T, ''); x = extract(r); eq(id, x.ui_observed.applicable, false, '(e) cli'); if (html(r).includes('lớp nhìn-thấy')) fail(id, '(e) cli mà có cụm lớp nhìn-thấy');
  if (failures === before) pass(id, 'thẻ Cổng Bằng chứng: present đọc trên báo cáo, descope sau seal ở CHƯA duyệt, cli im');
}

// ─── LNT6 — bảy văn bản nghi thức chép luật; gỡ từng mệnh đề → đỏ đúng tên ─────
if (want('LNT6')) {
  const id = 'LNT6'; const L = require(LIB); const before = failures;
  const F = {
    acc: path.join(ROOT, 'skills', 'acceptance', 'SKILL.md'),
    fl: path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'),
    ex: path.join(ROOT, 'skills', 'acceptance', 'references', 'eval-executors.md'),
    ctx: path.join(ROOT, 'CONTEXT.md'),
    init: path.join(ROOT, 'commands', 'acceptance-init.md'),
  };
  // Cắt phạm vi: từ startRe tới heading kế (endRe) — không tới EOF; phạm vi > 60% file = cắt hỏng
  const cut = (text, startRe, endRe) => { const s = text.search(startRe); if (s < 0) return ''; const rest = text.slice(s); const e = rest.slice(1).search(endRe); const out = e < 0 ? rest : rest.slice(0, e + 1); if (out.length > text.length * 0.6) throw new Error('phạm vi cắt quá rộng'); return out; };
  const clauses = [
    ['i-acc-2c', 'acc', t => { const p2 = cut(t, /^## Phase 2/m, /^## Phase 3/m); return /layer: ui-observed/.test(p2) && /theo hợp đồng/.test(p2) && p2.includes(L.UI_OBSERVED_DESCOPE); }],
    ['ii-fl-evals', 'fl', t => { const s1 = cut(t, /^## S1 — DESIGN/m, /^## GATE 1/m); return /≥1 eval `ui-check`/.test(s1) && /mặt người nhìn mà không eval `ui-check`/.test(s1); }],
    ['iii-ex-section', 'ex', t => /^## Pairing mechanics — `layer: ui-observed`/m.test(t) && cut(t, /^## Pairing mechanics — `layer: ui-observed`/m, /^## /m).includes('ui-observed')],
    // (iv) QUAN HỆ, không phải chuỗi có mặt: cặp alias khai trong CONTEXT phải BẰNG
    // SURFACE_ALIAS của lib. Câu «có chữ web» xanh cả khi CONTEXT ánh xạ web → mobile.
    ['iv-ctx-terms', 'ctx', t => {
      if (!cut(t, /^\*\*Layer\*\*:/m, /^\*\*[^*]+\*\*:/m).includes('ui-observed')) return false;
      const surf = cut(t, /^\*\*Surface\*\*:/m, /^\*\*[^*]+\*\*:/m);
      const m = surf.match(/Alias máy đọc:\s*((?:`[^`]+`[,\s]*)+)→\s*`([^`]+)`/);
      if (!m) return false;
      const froms = [...m[1].matchAll(/`([^`]+)`/g)].map(x => x[1]);
      const to = m[2];
      const declared = Object.fromEntries(froms.map(f => [f, to]));
      return JSON.stringify(declared) === JSON.stringify(L.SURFACE_ALIAS);
    }],
    // (vi) QUAN HỆ: câu nhắc @playwright/cli phải nằm CÙNG đoạn 3b với `capture.ui`
    // và lệnh mẫu `playwright-cli` — dời câu sang mục khác thì gợi ý mất chỗ đứng.
    ['vi-init-playwright', 'init', t => { const b = cut(t, /^3b\./m, /^3c\./m); return b.includes('@playwright/cli') && b.includes('capture.ui') && b.includes('playwright-cli '); }],
    ['vii-descope-roundtrip', 'fl', (t, all) => t.includes(L.UI_OBSERVED_DESCOPE) && all.acc.includes(L.UI_OBSERVED_DESCOPE)],
  ];
  const texts = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, readFileSync(p, 'utf8')]));
  const run = all => clauses.filter(([, k, fn]) => !fn(all[k], all)).map(([n]) => n);
  eq(id, run(texts), [], 'bản lành: mọi mệnh đề đọc được');
  const mutants = [
    ['i-acc-2c', 'acc', t => t.split('layer: ui-observed').join('layer: xx')],
    ['ii-fl-evals', 'fl', t => t.split('≥1 eval `ui-check`').join('≥1 eval')],
    ['iii-ex-section', 'ex', t => t.replace(/^## Pairing mechanics — `layer: ui-observed`.*$/m, '## Gỡ')],
    // mutant QUAN HỆ: CONTEXT vẫn nói «web» nhưng ánh xạ sang mobile → phải đỏ
    ['iv-ctx-terms', 'ctx', t => t.replace(/(Alias máy đọc:[\s\S]*?→\s*)`ui`/, '$1`mobile`')],
    // mutant QUAN HỆ: câu vẫn còn trong file nhưng bị dời khỏi đoạn 3b
    ['vi-init-playwright', 'init', t => t.replace(/^(3b\.[\s\S]*?)(\n3c\.)/m, (s, b, c) => b.split('@playwright/cli').join('mot-cong-cu-khac') + c)],
    ['vii-descope-roundtrip', 'acc', t => t.split(L.UI_OBSERVED_DESCOPE).join('bỏ ui-observed: ')],
  ];
  for (const [name, k, mut] of mutants) {
    const copy = { ...texts, [k]: mut(texts[k]) };
    if (copy[k] === texts[k]) { fail(id, `mutant ${name} không tiêm được (chuỗi đích không có?)`); continue; }
    const red = run(copy);
    if (!red.includes(name)) fail(id, `mutant ${name} không làm reader đỏ đúng mệnh đề (đỏ: ${red.join(',') || 'không'})`);
  }
  if (failures === before) pass(id, 'bảy văn bản nghi thức chép luật; (iv)(vi) đo quan hệ alias/chỗ đứng; gỡ từng mệnh đề → đỏ đúng tên');
}

// ─── Hồ sơ anh-co-that-trong-ho-so: LNT7…LNT10 — ảnh chỉ tính khi tệp có thật dưới evidence/ của hồ sơ ──────
// Bộ dựng fixture dùng chung ở trên (vùng chép của khuôn bên viết + khối UI-CHECK-BLOCK-TEMPLATE). Thẻ và trang chạy
// bằng ĐƯỜNG SCRIPT truyền vào (SC) để LNT9 chạy cùng hàm đo trên bản sao bị tiêm. Bản `main` trước vòng = git archive
// của ANH_BASE (gốc vòng) bung trong lượt.
const ANH_BASE = 'adab9a82';
const ANH_LIB = path.join(ROOT, 'scripts', 'anh-ho-so.cjs');
const ANH_DESIGN = path.join(ROOT, 'docs', 'superpowers', 'specs', '2026-10-22-anh-co-that-trong-ho-so-design.md');
const SC_THAT = { gc: GATE_CARD, ep: path.join(ROOT, 'scripts', 'evidence-page.js'), lib: ANH_LIB };
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const noAnsi = s => String(s || '').replace(/\x1b\[[0-9;]*m/g, '');
const chayGc = (SC, root, ...a) => spawnSync('node', [SC.gc, '--root', root, '--slug', 'x', ...a], { encoding: 'utf8' });
const extractSC = (SC, root) => { const r = chayGc(SC, root, '--extract'); if (r.status !== 0) throw new Error('gate-card --extract exit ' + r.status + ': ' + r.stderr); return JSON.parse(r.stdout); };
const trangSC = (SC, root) => { const r = spawnSync('node', [SC.ep, '--root', root, '--slug', 'x'], { encoding: 'utf8' }); if (r.status !== 0) throw new Error('evidence-page exit ' + r.status + ': ' + r.stderr); return readFileSync(path.join(root, '_acceptance', 'x', 'evidence-page.html'), 'utf8'); };
// khối một eval trên trang: từ <div class="card eval" id="<id>"> tới khối eval kế
const khoiTrang = (page, evalId) => { const i = page.indexOf(`<div class="card eval" id="${evalId}">`); if (i < 0) return null; const j = page.indexOf('<div class="card eval"', i + 1); return page.slice(i, j < 0 ? undefined : j); };
const srcCua = khoi => [...String(khoi || '').matchAll(/<img src="([^"]+)"/g)].map(m => m[1]);
const coThat = (root, src) => { try { const d = path.join(root, '_acceptance', 'x'); const p = path.join(d, src); const st = statSync(p); return st.isFile() && st.size > 0 && realpathSync(p).startsWith(realpathSync(path.join(d, 'evidence')) + path.sep); } catch (_) { return false; } };
const shotLa = (b, val) => b.replace(/^(\s+screenshot:).*$/m, `$1 ${val}`);
const EV_UI = ids => EV_T + ids.map(i => `  - id: ${i}\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "frame"\n`).join('');
const ROW_UI = ids => ids.map(i => [i, 'AC-1', 'ui-check', 'PASS']);
// dựng hồ sơ: blocks là chuỗi khối, files là { đường tương đối gốc kho: Buffer | 'DIR' | { link: đích tuyệt đối } }
const dungHoSo = (ids, blocks, files = {}) => { const r = ws('ui', EV_UI(ids), blocks, null, ROW_UI(ids));
  for (const [rel, v] of Object.entries(files)) { const p = path.join(r, rel); mkdirSync(path.dirname(p), { recursive: true });
    if (v === 'DIR') mkdirSync(p, { recursive: true }); else if (v && typeof v === 'object' && !Buffer.isBuffer(v)) symlinkSync(v.link, p); else writeFileSync(p, v); }
  return r; };
const EVF = '_acceptance/x/evidence/E10-step1.png';
// Ma trận viết TRƯỚC (số assert = số hàng). Hàng thiếu: [tên, giá trị, tệp, khoá LY_DO]. `ngoai` là thư mục tạm khác.
const maTran = ngoai => ({
  dat: [
    ['evidence', 'evidence/E10-step1.png'], ['dot-evidence', './evidence/E10-step1.png'], ['ten-tran', 'E10-step1.png'],
    ['chu-thich', null], ['nhay-kep', '"evidence/E10-step1.png"'], ['nhay-don', "'./evidence/E10-step1.png'"],
  ],
  thieu: [
    ['tuyet-doi-co-tep', path.join(ngoai, 'wt', '_acceptance', 'x', 'evidence', 'E10-step1.png'), {}, 'tuyetDoi'],
    ['nga', '~/E10.png', {}, 'tuyetDoi'],
    ['o-dia', 'C:\\w\\E10.png', {}, 'tuyetDoi'],
    ['luot-cham-co-tep', '.acceptance-runs/x/evidence/E10-step1.png', { '.acceptance-runs/x/evidence/E10-step1.png': PNG }, 'luotCham'],
    ['cham-cham', 'evidence/../../y.png', { '_acceptance/y.png': PNG }, 'ngoai'],
    ['url', 'https://h/E10.png', {}, 'ngoai'],
    ['thu-muc-khac', 'docs/E10.png', { '_acceptance/x/docs/E10.png': PNG }, 'ngoai'],
    ['thu-muc-con', 'evidence/sub/E10.png', { '_acceptance/x/evidence/sub/E10.png': PNG }, 'ngoai'],
    ['duoi-la', 'evidence/E10-step1.txt', { '_acceptance/x/evidence/E10-step1.txt': 'x' }, 'duoi'],
    ['khong-tep', 'evidence/E10-step1.png', {}, 'khongCo'],
    ['thu-muc', 'evidence/E10-step1.png', { [EVF]: 'DIR' }, 'khongCo'],
    ['rong', 'evidence/E10-step1.png', { [EVF]: Buffer.alloc(0) }, 'rong'],
    ['lien-ket-ra-ngoai', 'evidence/E10-step1.png', { [EVF]: { link: path.join(ngoai, 'ngoai.png') } }, 'ngoai'],
  ],
});
// Hàm đo của LNT7 — trả các hàng LẬT (kỳ vọng ≠ thực tế), mỗi hàng «nhóm hàng · kỳ vọng · thực tế». LNT9 gọi lại trên bản sao.
function doLNT7(SC, inRa) {
  const A = require(SC.lib); const lat = []; const inn = s => { if (inRa) console.log(s); };
  const NONE = (readFileSync(SC.gc, 'utf8').match(/UI_OBS_G2_NONE = '([^']+)'/) || [])[1];
  const THIEU = (readFileSync(SC.gc, 'utf8').match(/UI_OBS_G2_THIEU = '([^']+)'/) || [])[1] || 'Bằng chứng lớp nhìn-thấy: THIẾU ảnh';
  const ngoai = tmp(); W(ngoai, 'wt/_acceptance/x/evidence/E10-step1.png', PNG); W(ngoai, 'ngoai.png', PNG);
  const M = maTran(ngoai); let trangDung = 0, trangTong = 0;
  const flagCo = (h, chuoi) => h.split('<div class="flag').find(p => p.includes(chuoi)) || '';
  // so trang ↔ thẻ cho một hồ sơ — QUAN HỆ: có <img> ⟺ thẻ tính đạt; src có thật; số cờ «Thiếu ảnh:» = số mục thieu_anh
  const soTrang = (ten, r, x, ids, coDowngrade) => {
    trangTong++; const page = trangSC(SC, r); const loi = [];
    for (const i of ids) { const s = srcCua(khoiTrang(page, i)); const dat = (x.ui_observed.passed > 0) && !(x.ui_observed.thieu_anh || []).some(t => t.id === i);
      if ((s.length > 0) !== dat) loi.push(`${i} img ${s.length} thẻ ${dat ? 'đạt' : 'không đạt'}`);
      for (const src of s) if (!coThat(r, src)) loi.push(`${i} src không có thật ${src}`); }
    const tieu = (x.ui_observed.thieu_anh || []); const soCo = (page.match(/Thiếu ảnh:/g) || []).length;
    if (soCo !== tieu.length) loi.push(`cờ Thiếu ảnh ${soCo} ≠ thieu_anh ${tieu.length}`);
    for (const t of tieu) if (!page.split('Thiếu ảnh:').slice(1).some(p => p.includes(escH(t.gia_tri)) && p.includes(escH(t.ly_do)))) loi.push(`cờ thiếu ${t.id} không mang giá trị + nguyên nhân`);
    if (page.includes('downgrade sang judgment') !== coDowngrade) loi.push(`câu downgrade ${coDowngrade ? 'vắng' : 'có mặt'}`);
    if (loi.length) lat.push(`trang ${ten} · kỳ vọng khớp thẻ · ${loi.join('; ')}`); else trangDung++;
  };
  for (const [ten, val] of M.dat) {
    let b = uiBlock('E10'); if (val !== null) b = shotLa(b, val);
    const r = dungHoSo(['E10'], b, { [EVF]: PNG }); const x = extractSC(SC, r); const u = x.ui_observed;
    const thuc = `present ${u.present} passed ${u.passed} khoa ${Object.keys(u).includes('thieu_anh') ? 'thieu_anh' : '-'}`;
    inn(`LNT7 dat ${ten} · present true passed 1 khoa - · ${thuc}`);
    if (!(u.present === true && u.passed === 1 && !Object.keys(u).includes('thieu_anh'))) lat.push(`dat ${ten} · present true passed 1 · ${thuc}`);
    soTrang(ten, r, x, ['E10'], false);
  }
  let soThieu = 0;
  for (const [ten, val, files, k] of M.thieu) {
    const r = dungHoSo(['E10'], shotLa(uiBlock('E10'), val), files); const x = extractSC(SC, r); const u = x.ui_observed;
    const ky = [{ id: 'E10', gia_tri: val, ly_do: A.LY_DO[k] }];
    const thuc = `present ${u.present} passed ${u.passed} thieu ${JSON.stringify(u.thieu_anh || null)}`;
    inn(`LNT7 thieu ${ten} · present false ${A.LY_DO[k]} · ${thuc}`);
    const okX = u.present === false && u.passed === 0 && JSON.stringify(u.thieu_anh) === JSON.stringify(ky);
    // thẻ HTML (AC-4): cờ KHÔNG có mang id + giá trị + nguyên nhân trên CÙNG dòng cờ; không «xem frame»
    const h = noAnsi(chayGc(SC, r).stdout); const f = NONE ? flagCo(h, NONE) : '';
    const okH = !!f && f.includes('E10') && f.includes(escH(val)) && f.includes(escH(A.LY_DO[k])) && !h.includes('xem frame ở trang bằng chứng');
    if (okX && okH) soThieu++; else lat.push(`thieu ${ten} · present false + cờ KHÔNG có nêu E10/${A.LY_DO[k]} · ${thuc}${okH ? '' : ' · html ' + (f ? 'cờ thiếu chi tiết' : 'không cờ KHÔNG có') + (h.includes('xem frame ở trang bằng chứng') ? ' + có «xem frame»' : '')}`);
    soTrang(ten, r, x, ['E10'], false);
  }
  inn(`LNT7 thieu ${soThieu}/${M.thieu.length}`);
  { // trộn (AC-3): E10 ảnh thật, E11 ở thư mục lượt chấm
    const v11 = '.acceptance-runs/x/evidence/E11-step1.png';
    const r = dungHoSo(['E10', 'E11'], uiBlock('E10') + '\n' + shotLa(uiBlock('E11'), v11), { [EVF]: PNG, [v11]: PNG });
    const x = extractSC(SC, r); const u = x.ui_observed; const h = noAnsi(chayGc(SC, r).stdout);
    const okLine = '1 eval ui-check đạt (E10) — xem frame ở trang bằng chứng.'; const fOk = flagCo(h, okLine); const fT = flagCo(h, THIEU);
    const ok = u.present === true && u.passed === 1 && JSON.stringify(u.thieu_anh) === JSON.stringify([{ id: 'E11', gia_tri: v11, ly_do: A.LY_DO.luotCham }])
      && h.includes(okLine) && !fOk.includes('E11') && fT.includes('E11') && fT.includes(escH(v11)) && fT.includes(escH(A.LY_DO.luotCham));
    inn(`LNT7 tron · present true passed 1 thieu E11 · present ${u.present} passed ${u.passed} thieu ${JSON.stringify(u.thieu_anh || null)}`);
    if (!ok) lat.push(`tron · present true passed 1 + cờ THIẾU ảnh nêu E11 · present ${u.present} passed ${u.passed} cờ-thiếu ${fT ? 'có' : 'vắng'}`);
    soTrang('tron', r, x, ['E10', 'E11'], false);
  }
  { // đối chứng câu downgrade (P2 gap-probe): ui-check exit 0, KHÔNG dòng screenshot:, không evidence/
    const r = dungHoSo(['E10'], uiBlock('E10', { shot: false })); const x = extractSC(SC, r); const u = x.ui_observed;
    inn(`LNT7 khong-khai · present false khoa - · present ${u.present} khoa ${Object.keys(u).includes('thieu_anh') ? 'thieu_anh' : '-'}`);
    if (!(u.present === false && !Object.keys(u).includes('thieu_anh'))) lat.push('khong-khai · present false, không thieu_anh · ' + JSON.stringify(u));
    soTrang('khong-khai', r, x, ['E10'], true);
  }
  inn(`LNT7 trang ${trangDung}/${trangTong}`);
  return lat;
}

// ─── LNT7 — ma trận luật ảnh trên thẻ (--extract + HTML) và trang, cùng fixture ─────────────────────────────
if (want('LNT7')) {
  const id = 'LNT7'; const before = failures; const A = require(ANH_LIB);
  // bảng LY_DO của bộ xét = đúng các chuỗi nguyên nhân của bảng luật trong design doc (rút từ tệp, không literal)
  const tbl = [...readFileSync(ANH_DESIGN, 'utf8').matchAll(/^\|.*\| thiếu \| `([^`]+)` \|$/gm)].map(m => m[1]);
  eq(id, [...new Set(tbl)].sort(), Object.values(A.LY_DO).sort(), 'LY_DO == bảng luật design doc');
  for (const l of doLNT7(SC_THAT, true)) fail(id, l);
  if (failures === before) pass(id, 'ảnh chỉ tính khi tệp có thật dưới evidence/: 6 hàng đạt · 13 hàng thiếu · trộn · đối chứng không khai; trang khớp thẻ 21/21');
}

// ─── LNT8 — hai hình dạng thật (ẩn danh) + đọc-cũ byte-giống bản main trước vòng ──────────────────────────
const dungBan = () => { const b = tmp(); const ar = spawnSync('bash', ['-c', `git -C "${ROOT}" archive ${ANH_BASE} scripts lib skills | tar -x -C "${b}"`], { encoding: 'utf8' });
  return ar.status === 0 && existsSync(path.join(b, 'scripts', 'gate-card.js')) ? { gc: path.join(b, 'scripts', 'gate-card.js'), ep: path.join(b, 'scripts', 'evidence-page.js') } : null; };
if (want('LNT8')) {
  const id = 'LNT8'; const before = failures; const A = require(ANH_LIB);
  const NONE = readFileSync(GATE_CARD, 'utf8').match(/UI_OBS_G2_NONE = '([^']+)'/)[1];
  const CU = dungBan(); if (!CU) fail(id, 'không dựng được bản main trước vòng (' + ANH_BASE + ')');
  const docTam = b => b.replace(/^(\s+observed: \|)\n\s+frame shows[^\n]*/m, '$1\n    Đã đọc cả 8 ảnh (nền tối): kế hoạch rỗng hiện nút thêm bước, cả hai khổ đúng bố cục.');
  // Ca A: hai eval exit 0 trỏ đúng khuôn evidence/, observed nói đã đọc 8 ảnh, hồ sơ KHÔNG có thư mục evidence/
  const rA = dungHoSo(['E10', 'E11'], docTam(uiBlock('E10')) + '\n' + docTam(uiBlock('E11')));
  // Ca B: E6 carry trỏ thư mục lượt chấm (tệp CÓ ở đó); E7 trỏ đường tuyệt đối vào worktree khác (tệp CÓ ở đó)
  const wt = tmp(); W(wt, '_acceptance/x/evidence/E7-step1.png', PNG); const v6 = '.acceptance-runs/x/evidence/e6-1280.png'; const v7 = path.join(wt, '_acceptance', 'x', 'evidence', 'E7-step1.png');
  const b6 = shotLa(uiBlock('E6'), v6).replace(/^(\s+exit_code:.*)$/m, '$1\n  carried_from_round: 1');
  const rB = dungHoSo(['E6', 'E7'], b6 + '\n' + shotLa(uiBlock('E7'), v7), { [v6]: PNG });
  const caThat = [['A', rA, ['E10', 'E11'], [{ id: 'E10', gia_tri: 'evidence/E10-step1.png', ly_do: A.LY_DO.khongCo }, { id: 'E11', gia_tri: 'evidence/E11-step1.png', ly_do: A.LY_DO.khongCo }]],
    ['B', rB, ['E6', 'E7'], [{ id: 'E6', gia_tri: v6, ly_do: A.LY_DO.luotCham }, { id: 'E7', gia_tri: v7, ly_do: A.LY_DO.tuyetDoi }]]];
  const cuIn = [];
  for (const [ten, r, ids, ky] of caThat) {
    const u = extractSC(SC_THAT, r).ui_observed; const h = noAnsi(chayGc(SC_THAT, r).stdout); const f = h.split('<div class="flag').find(p => p.includes(NONE)) || '';
    eq(id, { present: u.present, thieu_anh: u.thieu_anh }, { present: false, thieu_anh: ky }, `ca ${ten} --extract`);
    for (const t of ky) if (!(f.includes(t.id) && f.includes(escH(t.gia_tri)) && f.includes(escH(t.ly_do)))) fail(id, `ca ${ten}: cờ KHÔNG có thiếu ${t.id} / giá trị / nguyên nhân`);
    const page = trangSC(SC_THAT, r); const imgs = (page.match(/<img /g) || []).length; const co = (page.match(/Thiếu ảnh:/g) || []).length;
    console.log(`LNT8 ca-that ${ten} · present false · thieu ${ky.length} · img 0 · thuc-te present ${u.present} thieu ${(u.thieu_anh || []).length} img ${imgs} co-thieu ${co}`);
    eq(id, { imgs, co }, { imgs: 0, co: ky.length }, `ca ${ten} trang`);
    if (CU) { const uc = extractSC({ gc: CU.gc }, r).ui_observed; cuIn.push(`${ten} present ${uc.present}`); if (uc.present !== true) fail(id, `ca ${ten}: bản cũ phải tính có ảnh (fixture tái lập đúng lỗi) — thực tế present ${uc.present}`); }
  }
  if (CU) console.log('LNT8 ca-that-ban-cu ' + cuIn.join(' · '));
  // Đọc-cũ (AC-8): ảnh thật đúng chỗ + sáu fixture LNT4 → HTML thẻ, --extract, src trang giống từng byte giữa hai bản
  if (CU) {
    const seal = '{"id":"d-1","type":"seal","gate":1,"at":"2026-09-01T00:00:00Z"}\n';
    const ds = `{"id":"d-2","type":"descope","stage":"S4-r1","at":"2026-09-02T00:00:00Z","decision":"${L_UI().UI_OBSERVED_DESCOPE}hạ tầng chụp hỏng","impact":"không frame"}\n`;
    const EV1 = EV_UI(['E10']);
    const fx = [['anh-that', () => dungHoSo(['E10'], uiBlock('E10'), { [EVF]: PNG })],
      ['a1', () => ws('ui', EV1, uiBlock('E10', { exit: 4 }), null, ROW_UI(['E10']))], ['a2', () => ws('ui', EV1, uiBlock('E10', { shot: false }), null, ROW_UI(['E10']))],
      ['a3', () => ws('ui', EV1, uiBlock('E10', { exit: 4, shot: false }), null, ROW_UI(['E10']))], ['c', () => ws('ui', EV_T, '')],
      ['d', () => ws('ui', EV1, uiBlock('E10', { exit: 4, shot: false }), seal + ds, ROW_UI(['E10']))], ['e', () => ws('cli', EV_T, '')]];
    let giong = 0;
    for (const [ten, mk] of fx) {
      const r = mk(); const ra = {};
      for (const [ban, SC] of [['cu', CU], ['moi', SC_THAT]]) {
        const h = chayGc(SC, r); const x = chayGc(SC, r, '--extract');
        if (h.status !== 0 || !h.stdout.trim() || x.status !== 0 || !x.stdout.trim()) fail(id, `đối chứng gốc không chạy: ${ban} ${ten}`);
        ra[ban] = { h: h.stdout, x: x.stdout, src: JSON.stringify(srcCua(trangSC(SC, r))) };
      }
      const khac = ['h', 'x', 'src'].filter(k => ra.cu[k] !== ra.moi[k]);
      if (khac.length) fail(id, `đọc-cũ ${ten}: khác bản main trước vòng ở ${khac.join(', ')}`); else giong++;
    }
    console.log(`LNT8 doc-cu ${giong}/${fx.length}`);
  }
  if (failures === before) pass(id, 'hai hình dạng thật: thẻ KHÔNG có + nguyên nhân, trang 0 ảnh (bản cũ tính có ảnh); đọc-cũ byte-giống 7/7');
}
function L_UI() { return require(LIB); }

// ─── LNT9 — chiều đỏ TRONG bộ kiểm: ba nhát tiêm trên bản sao trọn scripts/ + lib/ + skills/ ─────────────
if (want('LNT9')) {
  const id = 'LNT9'; const before = failures;
  const saoMoi = () => { const d = tmp(); for (const s of ['scripts', 'lib', 'skills']) cpSync(path.join(ROOT, s), path.join(d, s), { recursive: true });
    return { d, SC: { gc: path.join(d, 'scripts', 'gate-card.js'), ep: path.join(d, 'scripts', 'evidence-page.js'), lib: path.join(d, 'scripts', 'anh-ho-so.cjs') } }; };
  const lanh = saoMoi(); const latLanh = doLNT7(lanh.SC, false);
  console.log(`LNT9 lanh ${latLanh.length} lat`); if (latLanh.length) fail(id, 'bản sao chưa tiêm phải xanh: ' + latLanh.join(' | '));
  const NHAT = [
    ['i-the-chuoi', 'gc', 'const uiPassed = uiKhaiAnh.filter(i => uiKhung[i].frames.length > 0);', 'const uiPassed = uiKhaiAnh.slice();', /^thieu khong-tep /],
    ['ii-bo-kiem-tep', 'lib', 'try { st = fs.statSync(p); } catch (_) { return thieu(LY_DO.khongCo); }', "try { st = fs.statSync(p); } catch (_) { return { ok: true, rel: 'evidence/' + ten }; }", /^thieu khong-tep /],
    ['iii-trang-safeshot', 'ep', 'const framesFor = (id, shot) => anhHoSo.khungAnh(dir, id, shot);',
      "const framesFor = (id, shot) => { const b = anhHoSo.giaTriSach(shot).replace(/^\\.\\//, '').replace(/^evidence\\//, ''); return { frames: /^[A-Za-z0-9._-]+\\.(png|jpe?g|gif|webp)$/i.test(b) ? ['evidence/' + b] : [], thieu: [] }; };", /^trang khong-tep .*img 1/],
  ];
  for (const [ten, k, goc, tiem, mong] of NHAT) {
    const s = saoMoi(); const f = s.SC[k]; const src = readFileSync(f, 'utf8'); const n = src.split(goc).length - 1;
    if (n !== 1) { fail(id, `${ten}: chuỗi gốc khớp ${n} lần (phải đúng 1) — nhát tiêm không áp`); continue; }
    writeFileSync(f, src.replace(goc, tiem)); const sau = readFileSync(f, 'utf8');
    if (!sau.includes(tiem) || sau.includes(goc)) { fail(id, `${ten}: bước tiêm không áp (chuỗi tiêm vắng hoặc chuỗi gốc còn)`); continue; }
    const lat = doLNT7(s.SC, false); console.log(`LNT9 ${ten} lat ${lat.map(l => l.split(' · ')[0]).join(', ')}`);
    if (!lat.some(l => mong.test(l))) fail(id, `${ten}: hàm đo không nêu hàng mong đợi ${mong} — lật: ${lat.join(' | ') || '(không hàng nào)'}`);
  }
  if (failures === before) pass(id, 'bản sao lành 0 lật; ba nhát tiêm (thẻ chuỗi · bỏ kiểm tệp · trang safeShot) đều lật đúng hàng khong-tep');
}

// ─── LNT10 — lệnh đo kho (AC-9) trên kho tổng hợp: đủ ảnh · trộn · hết ảnh ────────────────────────────────
if (want('LNT10')) {
  const id = 'LNT10'; const before = failures; const KHO_CMD = path.join(ROOT, 'tests', 'scripts', 'anh-co-that-kho.mjs');
  const v11 = '.acceptance-runs/x/evidence/E11-step1.png';
  const kho = tmp(); mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  const dat = (ten, r) => cpSync(path.join(r, '_acceptance', 'x'), path.join(kho, '_acceptance', ten), { recursive: true });
  dat('du-anh', dungHoSo(['E10'], uiBlock('E10'), { [EVF]: PNG }));
  dat('tron', dungHoSo(['E10', 'E11'], uiBlock('E10') + '\n' + shotLa(uiBlock('E11'), v11), { [EVF]: PNG }));
  dat('het-anh', dungHoSo(['E10'], uiBlock('E10')));
  const chay = (cmd, env) => spawnSync('node', [cmd, '--goc', ROOT], { encoding: 'utf8', env: { ...process.env, KHO_DO: '', ...env } });
  const r = chay(KHO_CMD, { KHO_DO: kho }); const out = r.stdout || '';
  console.log('LNT10 ' + out.trim().split('\n').join(' | '));
  if (r.status !== 0) fail(id, `kho tổng hợp: exit ${r.status} — ${r.stderr.trim()}`);
  if (!out.includes('ho-so-ui 3 · cu-co-anh 3 · moi-co-anh 2 · doi 1 · du-kien 1')) fail(id, 'kho tổng hợp: thiếu dòng «ho-so-ui 3 · cu-co-anh 3 · moi-co-anh 2 · doi 1 · du-kien 1»');
  if (!out.includes('khong-doi-khi-du-anh 2/2')) fail(id, 'kho tổng hợp: thiếu «khong-doi-khi-du-anh 2/2»');
  if (out.includes(kho) || out.includes('_acceptance/')) fail(id, 'lệnh in đường thư mục — chỉ được in số');
  const r2 = chay(KHO_CMD, { KHO_DO: '' });
  if (r2.status !== 2 || !r2.stderr.includes('không có kho để đo')) fail(id, `không khai kho: phải thoát 2 + «không có kho để đo» — exit ${r2.status} ${r2.stderr.trim()}`);
  // chiều đỏ của phép so: bản sao lệnh đếm du-kien cả hồ sơ trộn → thoát 1, in «doi 1 · du-kien 2»
  const goc = 'if (cu && !coAnh) duKien++;'; const src = readFileSync(KHO_CMD, 'utf8');
  if (src.split(goc).length !== 2) fail(id, 'nhát tiêm du-kien không khớp đúng một chỗ');
  else { const m = tmp(); const f = path.join(m, 'anh-co-that-kho.mjs'); writeFileSync(f, src.replace(goc, 'if (cu && (!coAnh || coThieu)) duKien++;'));
    const r3 = chay(f, { KHO_DO: kho }); console.log('LNT10 tiem ' + (r3.stdout || '').trim().split('\n')[0]);
    if (r3.status !== 1 || !(r3.stdout || '').includes('doi 1 · du-kien 2')) fail(id, `tiêm du-kien: phải thoát 1 + «doi 1 · du-kien 2» — exit ${r3.status}`); }
  if (failures === before) pass(id, 'lệnh đo kho: kho tổng hợp đổi 1 = dự kiến 1, đủ ảnh 2/2 không đổi; không khai kho thoát 2; tiêm du-kien đỏ');
}

process.exit(failures ? 1 : 0);
