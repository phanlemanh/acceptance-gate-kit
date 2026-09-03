// Lưới hồ sơ vu-trang-goal-luc-goi-ten (AC-1 nửa · AC-2 · AC-3): dòng /goal là VẬT thẻ
// Cổng 1 in ra. Fixture CODE-SINH trong chính lần chạy; khuôn goal RÚT qua marker
// GOAL-TEMPLATE của gate-card.js (không gõ literal); phép thay <slug> ĐỘC LẬP với
// bên viết; đẳng thức, không phép chứa; đột biến trong ca; đối chứng ba chiều.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

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
// Kỳ vọng dựng ĐỘC LẬP từ NGUỒN KHÁC: khối GOAL-TEMPLATE trong SKILL feature-loop (không phải hằng
// của gate-card.js) — gộp dòng bằng ' ', thay MỌI <slug> bằng split/join (S4-r1: kỳ vọng chép công
// thức bên viết là hình dạng 2 của «thước không gắn vào vật»).
const SKILL_TPL = (() => {
  const t = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const m = t.match(/<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->/);
  if (!m) die('SKILL feature-loop thieu khoi GOAL-TEMPLATE');
  return m[1];
})();
const expectLine = slug => SKILL_TPL.trim().split('\n').join(' ').split('<slug>').join(slug);

// Fixture DÙNG CHUNG với gate-card-lmcms (một nguồn cho khuôn workspace mà gate-card.js đòi —
// S4-r1 bắt bản chép tay). G1(probe): hồ sơ draft slug «g»; G2(review): hồ sơ verified slug «s».
import { mkWs, G1, G2, PROBE, OOC, ITEM } from './gate-fixture.mjs';
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
  const r = mkWs('g', G1(PROBE('findings')));
  const j = extract(GC, r, 'g', ['--gate', '1']);
  if (typeof j.goal_line !== 'string') die('thieu goal_line');
  if (j.goal_line !== expectLine('g')) die(`lech\n  got : ${j.goal_line}\n  want: ${expectLine('g')}`);
  if (j.goal_line.includes('<slug>')) die('con <slug> sot');
  if (j.goal_line.includes('\n')) die('goal_line phai la MOT dong');
});
check('GL02 HTML Cong 1: .mach.goal KE NGAY SAU .mach cua one_shot, <b> == goal_line (dang thuc)', () => {
  const r = mkWs('g', G1(PROBE('findings')));
  const j = extract(GC, r, 'g', ['--gate', '1']);
  const html = run(GC, r, 'g', ['--gate', '1']).stdout;
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
  const html2 = run(mg, r, 'g', ['--gate', '1']).stdout;
  const got2 = goalAfterMach(html2, j.one_shot);
  if (got2 === j.goal_line) die('dot bien noi duoi ma phep so van xanh — dang thuc chet');
});
check('GL03 the DO (roi bac: gap_probe required, vang file) VAN co goal_line + .mach.goal', () => {
  const r = mkWs('g', G1(null));
  const j = extract(GC, r, 'g', ['--gate', '1']);
  if (!j.roi_bac || !j.roi_bac.on) die('fixture khong roi bac: ' + JSON.stringify(j.roi_bac));
  if (j.goal_line !== expectLine('g')) die('the do mat goal_line');
  const html = run(GC, r, 'g', ['--gate', '1']).stdout;
  if (goalAfterMach(html, j.one_shot) !== j.goal_line) die('the do mat .mach.goal');
});
check('GL03b the DO (g1Blocked: khai KHONG DO DUOC ma hop dong co mat nguoi dung) VAN co goal_line', () => {
  // Cùng công thức cờ đỏ với LM16 của lmcms — tiền tố rút từ khuôn ô cơ hội, không gõ literal.
  const NG1 = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs'));
  const kd = NG1.prefixes(readFileSync(path.join(ROOT, 'skills/acceptance/references/opportunity-template.md'), 'utf8')).khongDo;
  const f = G1(PROBE('findings'));
  f['contract.md'] = f['contract.md'].replace('surfaces: [cli]', 'surfaces: [ui]');
  f['opportunity.md'] = `---\nschema_version: 1\nslug: g\nstage: decided\ndecision: build\n---\n\n## ${NG1.UAT_THRESHOLD_HEADING}\n\n- ${kd} vòng này không có người dùng cuối.\n`;
  const r = mkWs('g', f);
  const j = extract(GC, r, 'g', ['--gate', '1']);
  if (!j.one_shot.endsWith('___')) die('fixture khong g1Blocked (one_shot dien san): ' + j.one_shot);
  if (j.goal_line !== expectLine('g')) die('the g1Blocked mat goal_line');
  const html = run(GC, r, 'g', ['--gate', '1']).stdout;
  if (goalAfterMach(html, j.one_shot) !== j.goal_line) die('the g1Blocked mat .mach.goal');
});
check('GL04 the Cong 2: KHONG co goal_line, KHONG co .mach.goal (doi chung chieu nguoc)', () => {
  const r = mkWs('s', G2(OOC(ITEM('known-limits'))));
  const j = extract(GC, r, 's');
  if (j.gate !== 2) die('fixture khong ra Cong 2: gate=' + j.gate);
  if ('goal_line' in j) die('Cong 2 co goal_line');
  const html = run(GC, r, 's').stdout;
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
