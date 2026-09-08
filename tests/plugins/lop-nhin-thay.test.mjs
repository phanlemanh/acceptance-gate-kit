// tests/plugins/lop-nhin-thay.test.mjs — ca hồ sơ lop-bang-chung-nhin-thay (LNT1, LNT3, LNT4, LNT6).
// Fixture CODE-SINH từ khuôn (CONTRACT-FRONTMATTER-TEMPLATE), chạy gate-card.js / lint THẬT;
// hằng chuỗi RÚT từ nguồn (lib + gate-card), không literal; chiều đỏ trên bản sao, ghim thông điệp.
//   LNT_CASES=LNT1,LNT3 node tests/plugins/lop-nhin-thay.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
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

let failures = 0;
const ALL_IDS = ['LNT1', 'LNT3', 'LNT4', 'LNT6'];
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
const html = root => gc(root).stdout;

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
  // chiều đỏ có sẵn: bản tại main không nhận [web]
  const old = spawnSync('git', ['-C', ROOT, 'show', 'main:lib/nguong-o-co-hoi.cjs'], { encoding: 'utf8' });
  if (old.status === 0) {
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
  const lintM = spawnSync('node', [path.join(m, 'scripts', 'eval-coverage-lint.js'), ws], { encoding: 'utf8' });
  const lintG = spawnSync('node', [LINT, ws], { encoding: 'utf8' });
  // Dòng NGHĨA VỤ (không phải dòng token-lạ: mutant bỏ alias thì `web` thành token lạ, W8-token nổ hợp lệ)
  const OBLIG = /\] W8 surfaces include a human-visible UI/;
  if (OBLIG.test(lintM.stdout)) fail(id, 'mutant: lint vẫn đòi ui-check cho [web]');
  if (!OBLIG.test(lintG.stdout)) fail(id, 'lành: lint không đòi ui-check cho [web]');
  if (failures === before) pass(id, 'lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc');
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

// ─── LNT4 — thẻ Cổng Bằng chứng: present đọc trên BÁO CÁO (gap-probe F1) ──────
if (want('LNT4')) {
  const id = 'LNT4'; const L = require(LIB); const before = failures;
  const gcSrc = readFileSync(GATE_CARD, 'utf8');
  const pick = (re, w) => { const m = gcSrc.match(re); if (!m) throw new Error('gate-card.js không khai ' + w); return m[1]; };
  const NONE = pick(/UI_OBS_G2_NONE = '([^']+)'/, 'UI_OBS_G2_NONE');
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
  const report = (extraBlocks) => {
    const tpl = readFileSync(EVID_TPL, 'utf8');
    let t = tpl.slice(tpl.indexOf('---8<---') + '---8<---'.length).replace(/^\s*/, '');
    t = t.replace(/\{\{slug\}\}/g, 'x').replace(/^verdict: .*$/m, 'verdict: PASS').replace(/^enforcement_mode: .*$/m, 'enforcement_mode: strict')
      .replace(/^bypass_used: .*$/m, 'bypass_used: false').replace(/^verified_commit: .*$/m, `verified_commit: ${'a'.repeat(40)}`).replace(/^human_signoff:.*$/m, 'human_signoff:');
    const rowVals = ['E1', 'AC-1', 'test', 'PASS']; let ri = 0;
    t = t.replace(/^\|.*\{\{.*\|$/m, line => line.replace(/\{\{[^}]*\}\}/g, () => rowVals[ri++] ?? '…'));
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
  const ws = (surfaces, evalsBody, blocks, ledger) => { const r = tmp();
    W(r, '_acceptance/x/contract.md', contractOf(surfaces, 'verified').replace('approved_by:', 'approved_by: Manh').replace('approved_at:', 'approved_at: 2026-09-01T00:00:00Z'));
    W(r, '_acceptance/x/evals.yaml', 'evals:\n' + evalsBody); W(r, '_acceptance/x/evidence-report.md', report(blocks)); W(r, '_acceptance/x/run-log.jsonl', '');
    if (ledger) W(r, '_acceptance/x/decisions.jsonl', ledger); return r; };
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
  r = ws('ui', EV, uiBlock('E10', { exit: 0, shot: true })); x = extract(r);
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
    ['iv-ctx-terms', 'ctx', t => cut(t, /^\*\*Layer\*\*:/m, /^\*\*[^*]+\*\*:/m).includes('ui-observed') && cut(t, /^\*\*Surface\*\*:/m, /^\*\*[^*]+\*\*:/m).includes('`web`')],
    ['vi-init-playwright', 'init', t => cut(t, /^3b\./m, /^3c\./m).includes('@playwright/cli')],
    ['vii-descope-roundtrip', 'fl', (t, all) => t.includes(L.UI_OBSERVED_DESCOPE) && all.acc.includes(L.UI_OBSERVED_DESCOPE)],
  ];
  const texts = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, readFileSync(p, 'utf8')]));
  const run = all => clauses.filter(([, k, fn]) => !fn(all[k], all)).map(([n]) => n);
  eq(id, run(texts), [], 'bản lành: mọi mệnh đề đọc được');
  const mutants = [
    ['i-acc-2c', 'acc', t => t.split('layer: ui-observed').join('layer: xx')],
    ['ii-fl-evals', 'fl', t => t.split('≥1 eval `ui-check`').join('≥1 eval')],
    ['iii-ex-section', 'ex', t => t.replace(/^## Pairing mechanics — `layer: ui-observed`.*$/m, '## Gỡ')],
    ['iv-ctx-terms', 'ctx', t => t.split('ui-observed').join('xx')],
    ['vi-init-playwright', 'init', t => t.split('@playwright/cli').join('xx')],
    ['vii-descope-roundtrip', 'acc', t => t.split(L.UI_OBSERVED_DESCOPE).join('bỏ ui-observed: ')],
  ];
  for (const [name, k, mut] of mutants) {
    const copy = { ...texts, [k]: mut(texts[k]) };
    if (copy[k] === texts[k]) { fail(id, `mutant ${name} không tiêm được (chuỗi đích không có?)`); continue; }
    const red = run(copy);
    if (!red.includes(name)) fail(id, `mutant ${name} không làm reader đỏ đúng mệnh đề (đỏ: ${red.join(',') || 'không'})`);
  }
  if (failures === before) pass(id, 'bảy văn bản nghi thức chép luật; gỡ từng mệnh đề → đỏ đúng tên');
}

process.exit(failures ? 1 : 0);
