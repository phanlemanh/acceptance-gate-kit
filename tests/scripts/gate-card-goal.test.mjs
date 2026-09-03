// Lưới hồ sơ vu-trang-goal-luc-goi-ten (AC-1 nửa · AC-2 · AC-3): dòng /goal là VẬT thẻ
// Cổng 1 in ra. Fixture CODE-SINH trong chính lần chạy; khuôn goal RÚT qua marker
// GOAL-TEMPLATE của gate-card.js (không gõ literal); phép thay <slug> ĐỘC LẬP với
// bên viết; đẳng thức, không phép chứa; đột biến trong ca; đối chứng ba chiều.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const SRC = readFileSync(GC, 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

// Khuôn rút QUA MARKER — nội dung nguyên văn giữa hai backtick của hằng.
const tplOf = src => {
  const m = src.match(/\/\/ <<<GOAL-TEMPLATE[^\n]*\n(?:\/\/ [^\n]*\n)*const GOAL_TEMPLATE = `([\s\S]*?)`;\n\/\/ GOAL-TEMPLATE>>>/);
  if (!m) die('gate-card.js thieu khoi marker GOAL-TEMPLATE (hoac hang khong nam trong marker)');
  return m[1];
};
const TPL = tplOf(SRC);
// Kỳ vọng dựng ĐỘC LẬP: gộp dòng bằng ' ', thay MỌI <slug> bằng split/join (không chép replaceAll của bên viết).
const expectLine = slug => TPL.trim().split('\n').join(' ').split('<slug>').join(slug);

const CFG = 'schema_version: 1\ngap_probe: required\n';
const CONTRACT = (slug, status) => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${status === 'verified' ? 'approved_by: A\napproved_at: 2026-09-01T00:00:00Z\n' : ''}---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n`;
const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n    expected: xanh\n';
const PROBE = `---\nslug: g\nat: 2026-09-01T00:00:00Z\nverdict: findings\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n`;
const REPORT = `---\nschema_version: 2\nfeature_slug: g\nverdict: PASS\nfailed_evals: []\nverified_commit: 0000000\nhuman_signoff:\n---\n\n# E\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: r1abc\n  exit_code: 0\n  verifier: config:executors.test.scripts\n  verified_at: 2026-09-01T00:00:00Z\n\n## Known limits\n\n## Ngoài hợp đồng\n`;
function mkWs(slug, files) {
  const root = mkdtempSync(path.join(tmpdir(), 'goal-'));
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), CFG);
  for (const [f, t] of Object.entries(files)) writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return root;
}
const G1 = (slug, probe) => { const f = { 'contract.md': CONTRACT(slug, 'draft'), 'evals.yaml': EVALS, 'decisions.jsonl': '' }; if (probe !== null) f['gap-probe.md'] = probe; return f; };
const G2 = slug => ({ 'contract.md': CONTRACT(slug, 'verified'), 'evals.yaml': EVALS, 'decisions.jsonl': '', 'evidence-report.md': REPORT, 'gap-probe.md': PROBE });
const run = (gc, root, slug, extra = []) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
const extract = (gc, root, slug, extra = []) => JSON.parse(run(gc, root, slug, ['--extract', ...extra]).stdout);
// Phần tử goal phải KỀ NGAY SAU </div> của .mach chứa one_shot — chỉ khoảng trắng ở giữa.
const goalAfterMach = (html, oneShot) => {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const i = html.indexOf(`<b>${esc(oneShot)}</b></div>`);
  if (i < 0) die('HTML khong co .mach chua one_shot');
  const tail = html.slice(i + `<b>${esc(oneShot)}</b></div>`.length);
  const m = tail.match(/^\s*<div class="mach goal">[^<]*<b>([^<]*)<\/b><\/div>/);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") : null;
};

check('GL00 khuon trong gate-card.js: 6 dong, co dung 2 <slug>, bat dau bang /goal', () => {
  const lines = TPL.trim().split('\n');
  if (lines.length !== 6) die('khuon ' + lines.length + ' dong');
  if ((TPL.match(/<slug>/g) || []).length !== 2) die('khuon phai co dung 2 <slug>');
  if (!TPL.trim().startsWith('/goal ')) die('khuon khong bat dau bang /goal ');
});
check('GL01 goal_line == khuon rut qua marker (moi <slug> thay, mot dong, 0 <slug> sot)', () => {
  const r = mkWs('g1', G1('g1', PROBE));
  const j = extract(GC, r, 'g1', ['--gate', '1']);
  if (typeof j.goal_line !== 'string') die('thieu goal_line');
  if (j.goal_line !== expectLine('g1')) die(`lech\n  got : ${j.goal_line}\n  want: ${expectLine('g1')}`);
  if (j.goal_line.includes('<slug>')) die('con <slug> sot');
  if (j.goal_line.includes('\n')) die('goal_line phai la MOT dong');
});
check('GL02 HTML Cong 1: .mach.goal KE NGAY SAU .mach cua one_shot, <b> == goal_line (dang thuc)', () => {
  const r = mkWs('g1', G1('g1', PROBE));
  const j = extract(GC, r, 'g1', ['--gate', '1']);
  const html = run(GC, r, 'g1', ['--gate', '1']).stdout;
  const got = goalAfterMach(html, j.one_shot);
  if (got === null) die('khong thay <div class="mach goal"> ke ngay sau .mach');
  if (got !== j.goal_line) die(`HTML lech extract\n  html: ${got}\n  ext : ${j.goal_line}`);
  if (/<p class="li">[^<]*\/goal /.test(html)) die('dong goal nam trong <p class="li"> — pham P185');
  // ĐỘT BIẾN trong ca: nối đuôi vào <b> goal ở bản sao gate-card.js → phải ĐỎ (đẳng thức, không phép chứa).
  const md = mkdtempSync(path.join(tmpdir(), 'goal-mut-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(md, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(md, 'lib'), { recursive: true });
  const mg = path.join(md, 'scripts', 'gate-card.js');
  const src = readFileSync(mg, 'utf8');
  const mut = src.replace('<b>${esc(goalLine(slug))}</b></div>', '<b>${esc(goalLine(slug))} XXLECH</b></div>');
  if (mut === src) die('dot bien khong doi duoc chuoi render');
  writeFileSync(mg, mut);
  const html2 = run(mg, r, 'g1', ['--gate', '1']).stdout;
  const got2 = goalAfterMach(html2, j.one_shot);
  if (got2 === j.goal_line) die('dot bien noi duoi ma phep so van xanh — dang thuc chet');
});
check('GL03 the DO (roi bac: gap_probe required, vang file) VAN co goal_line + .mach.goal', () => {
  const r = mkWs('g1', G1('g1', null));
  const j = extract(GC, r, 'g1', ['--gate', '1']);
  if (!j.roi_bac || !j.roi_bac.on) die('fixture khong roi bac: ' + JSON.stringify(j.roi_bac));
  if (j.goal_line !== expectLine('g1')) die('the do mat goal_line');
  const html = run(GC, r, 'g1', ['--gate', '1']).stdout;
  if (goalAfterMach(html, j.one_shot) !== j.goal_line) die('the do mat .mach.goal');
});
check('GL04 the Cong 2: KHONG co goal_line, KHONG co .mach.goal (doi chung chieu nguoc)', () => {
  const r = mkWs('g2', G2('g2'));
  const j = extract(GC, r, 'g2');
  if (j.gate !== 2) die('fixture khong ra Cong 2: gate=' + j.gate);
  if ('goal_line' in j) die('Cong 2 co goal_line');
  const html = run(GC, r, 'g2').stdout;
  if (html.includes('class="mach goal"')) die('Cong 2 co .mach.goal');
});
check('GL05 khuon gate-card == khuon SKILL feature-loop (sau strip) — ban chep thu ba khong troi', () => {
  const skill = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const m = skill.match(/<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->/);
  if (!m) die('SKILL thieu khoi GOAL-TEMPLATE');
  if (m[1].trim() !== TPL.trim()) die('gate-card.js lech SKILL');
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-goal)`);
process.exit(failed ? 1 : 0);
