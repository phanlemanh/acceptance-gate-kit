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
  if (/W8/.test(lintM.stdout)) fail(id, 'mutant: lint vẫn W8 cho [web]');
  if (!/W8/.test(lintG.stdout)) fail(id, 'lành: lint không W8 cho [web]');
  if (failures === before) pass(id, 'lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc');
}

process.exit(failures ? 1 : 0);
