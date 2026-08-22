// tests/plugins/duong-do.test.mjs — ca hồ sơ duong-do-trong-dinh-nghia-xong (DD1–DD7).
// Fixture CODE-SINH từ HAI khuôn (contract-template: frontmatter + khối CONTRACT-DUONG-DO-TEMPLATE;
// opportunity-template: frontmatter + section Ngưỡng), chạy gate-card.js THẬT (--extract + HTML);
// hằng heading/tiền tố RÚT từ nguồn gate-card, không literal; chiều đỏ trên bản sao, ghim thông điệp.
//   DD_CASES=DD1,DD5 node tests/plugins/duong-do.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const OPP_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const CONTEXT = path.join(ROOT, 'CONTEXT.md');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
const OPP_HEADING = 'Ngưỡng chết / ngưỡng UAT';

let failures = 0;
const ALL_IDS = ['DD1', 'DD2', 'DD3', 'DD4', 'DD5', 'DD6', 'DD7'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.DD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'dd-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };

// ── Hằng RÚT TỪ NGUỒN gate-card (không gõ literal) ──────────────────────────
const gcSrc = readFileSync(GATE_CARD, 'utf8');
const pick = (re, what) => { const m = gcSrc.match(re); if (!m) throw new Error(`gate-card.js không khai ${what}`); return m[1]; };
const HEADING = pick(/DUONG_DO_HEADING = '([^']+)'/, 'DUONG_DO_HEADING');
const DESCOPE = pick(/DUONG_DO_DESCOPE = '([^']+)'/, 'DUONG_DO_DESCOPE');

// ── Fixture từ khuôn ─────────────────────────────────────────────────────────
const blockOf = (text, marker) => { const m = text.match(new RegExp(`<!-- <<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>> -->`)); return m ? m[1] : null; };
const ddBlock = (tpl = readFileSync(CONTRACT_TPL, 'utf8')) => blockOf(tpl, 'CONTRACT-DUONG-DO-TEMPLATE');
// kind: real | placeholder | bo | none — section dựng từ CHÍNH khối khuôn
const ddSection = kind => {
  if (kind === 'none') return '';
  const blk = ddBlock(); if (!blk) throw new Error('khuôn thiếu khối CONTRACT-DUONG-DO-TEMPLATE');
  const lines = blk.split('\n');
  const heading = lines.find(l => /^##\s+/.test(l));
  const bulletsT = lines.filter(l => /^-\s+/.test(l));
  if (kind === 'placeholder') return `\n${heading}\n\n${bulletsT.join('\n')}\n`;
  if (kind === 'real') return `\n${heading}\n\n${bulletsT[0].replace(/\{\{[^}]*\}\}/g, 'x')}\n`;
  if (kind === 'bo') {
    const m = blk.match(/"(bỏ [^"<]+?<lý do 1 dòng> \(entry d-\.\.\.\))"/);
    if (!m) throw new Error('khuôn thiếu dòng mẫu bỏ');
    return `\n${heading}\n\n- ${m[1].replace('<lý do 1 dòng>', 'test').replace('d-...', 'd-1')}\n`;
  }
  throw new Error(`kind lạ ${kind}`);
};
const contractOf = kind => fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'Ý x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces: 'cli', status: 'draft' },
  '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c xảy ra.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n' + ddSection(kind) + '\n## Out of scope\n\n- a\n- b\n');
// mode: filled | dots | one
const oppOf = mode => {
  const tpl = readFileSync(OPP_TPL, 'utf8');
  const bul = section(tpl, OPP_HEADING).filter(l => /^\s*[-*]\s+[^:]+:/.test(l));
  const filled = bul.map((l, i) => (mode === 'filled' || (mode === 'one' && i === 0)) ? l.replace(/:\s*…\s*$/, ': giá trị thật') : l);
  return fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE',
    { slug: 'x', feature: 'Ý x', owner: 'o@x', stage: 'discovery', decision: '', decided_by: '', decided_at: '', base_commit: '', disposition: '' },
    `\n## Vấn đề & ai gặp\n\nMột câu.\n\n## ${OPP_HEADING}\n\n${filled.join('\n')}\n`);
};
const ws = ({ contract, opp = null, decisions = null }) => {
  const r = tmp();
  W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  W(r, '_acceptance/x/contract.md', contract);
  if (opp) W(r, '_acceptance/x/opportunity.md', opp);
  if (decisions) W(r, '_acceptance/x/decisions.jsonl', decisions.map(d => JSON.stringify(d)).join('\n') + '\n');
  return r;
};
const card = root => {
  const j = spawnSync(process.execPath, [GATE_CARD, '--root', root, '--slug', 'x', '--extract'], { encoding: 'utf8' });
  const h = spawnSync(process.execPath, [GATE_CARD, '--root', root, '--slug', 'x'], { encoding: 'utf8' });
  if (j.status !== 0 || h.status !== 0) throw new Error(`gate-card chết: ${j.stderr || h.stderr}`);
  return { json: JSON.parse(j.stdout), html: h.stdout };
};
const flagsOf = html => [...html.matchAll(/<div class="flag (fwarn|finfo|fok)">([\s\S]*?)<\/div>/g)].map(m => ({ cls: m[1], text: m[2] }));
const ddFlags = html => flagsOf(html).filter(f => /đường đo/i.test(f.text));
const hasLab = (html, lab) => html.includes(`<div class="lab">${lab}`);
// QUAN HỆ một-vị-từ: applicable ⇔ khối «Ngưỡng nghiệm thu» in (gap-probe F3) — chạy ở MỌI fixture
const relErr = ({ json, html }, tag) => json.duong_do.applicable === hasLab(html, 'Ngưỡng nghiệm thu') ? null : `${tag}: applicable=${json.duong_do.applicable} nhưng khối Ngưỡng ${hasLab(html, 'Ngưỡng nghiệm thu') ? 'CÓ' : 'KHÔNG'} in`;
const entry = (decision, type = 'descope') => [{ id: 'd-1', type, stage: 'S1', at: '2026-01-01T00:00:00Z', decision, impact: 'x' }];

// ---------- DD1: R+ (AC-1)
if (want('DD1')) {
  const errs = [];
  const c = card(ws({ contract: contractOf('real'), opp: oppOf('filled') }));
  const dd = c.json.duong_do;
  if (!(dd && dd.applicable === true && dd.present === true && Array.isArray(dd.lines) && dd.lines.length === 1 && dd.descoped === null)) errs.push(`duong_do lệch: ${JSON.stringify(dd)}`);
  if (!hasLab(c.html, HEADING)) errs.push('HTML không có khối Đường đo');
  if (dd && dd.lines[0] && !c.html.includes(dd.lines[0].replace(/[`*_]/g, ''))) errs.push('khối không in đúng dòng');
  if (ddFlags(c.html).length) errs.push(`R+ mà có cờ Đường đo: ${ddFlags(c.html).map(f => f.text.slice(0, 60)).join(' | ')}`);
  const r1 = relErr(c, 'R+'); if (r1) errs.push(r1);
  const cb = card(ws({ contract: contractOf('real'), opp: oppOf('one') }));
  if (cb.json.duong_do.applicable !== true || !hasLab(cb.html, 'Ngưỡng nghiệm thu')) errs.push('biên 1 dòng thật + 3 «…» phải là áp dụng ở cả hai bên');
  if (errs.length) fail('DD1', errs.join(' · ')); else pass('DD1', 'R+: có ngưỡng + section thật → khối in, 0 cờ; applicable ⇔ khối Ngưỡng; biên 1 dòng thật vẫn áp dụng');
}

// ---------- DD2: R− (AC-2)
if (want('DD2')) {
  const errs = [];
  const check = (kind, tag, wantPresent) => {
    const c = card(ws({ contract: contractOf(kind), opp: oppOf('filled') }));
    const dd = c.json.duong_do, fl = ddFlags(c.html);
    if (dd.applicable !== true) errs.push(`${tag}: applicable phải true`);
    if (dd.present !== wantPresent) errs.push(`${tag}: present=${dd.present} (mong ${wantPresent})`);
    if (dd.lines.length) errs.push(`${tag}: lines phải rỗng: ${JSON.stringify(dd.lines)}`);
    if (!(fl.length === 1 && fl[0].cls === 'fwarn' && /chưa có đường đo/.test(fl[0].text) && /section/.test(fl[0].text) && fl[0].text.includes(DESCOPE.trim()))) errs.push(`${tag}: cờ vàng lệch: ${JSON.stringify(fl.map(f => f.cls + ':' + f.text.slice(0, 70)))}`);
    if (hasLab(c.html, HEADING)) errs.push(`${tag}: không được in khối`);
    if (fl[0] && /<[a-zA-Z]/.test(fl[0].text)) errs.push(`${tag}: cờ chứa <…> thô — trình duyệt nuốt như tag`);
    const r = relErr(c, tag); if (r) errs.push(r);
  };
  check('none', '(a) gỡ section', false);
  check('placeholder', '(b) chỉ placeholder', true);
  check('bo', '(c) chỉ dòng bỏ, không entry', true);
  if (errs.length) fail('DD2', errs.join(' · ')); else pass('DD2', 'R−: gỡ section / chỉ placeholder / chỉ dòng bỏ không entry → đúng 1 cờ vàng «chưa có đường đo» nêu hai lối');
}

// ---------- DD3: R0 (AC-3)
if (want('DD3')) {
  const errs = [];
  for (const [tag, opp] of [['(a) không opportunity', null], ['(b) ngưỡng toàn «…»', oppOf('dots')]]) {
    const c = card(ws({ contract: contractOf('real'), opp }));
    if (c.json.duong_do.applicable !== false) errs.push(`${tag}: applicable phải false`);
    if (hasLab(c.html, 'Ngưỡng nghiệm thu')) errs.push(`${tag}: khối Ngưỡng không được in`);
    if (ddFlags(c.html).length) errs.push(`${tag}: luật rò — có cờ Đường đo`);
    if (!hasLab(c.html, HEADING)) errs.push(`${tag}: khối Đường đo vẫn phải in (contract có dòng thật)`);
    const r = relErr(c, tag); if (r) errs.push(r);
  }
  if (errs.length) fail('DD3', errs.join(' · ')); else pass('DD3', 'R0: không cơ hội / ngưỡng toàn «…» → không cờ, applicable=false ⇔ không khối Ngưỡng; khối Đường đo vẫn in');
}

// ---------- DD4: RK cửa bỏ có tên (AC-4)
if (want('DD4')) {
  const errs = [];
  for (const [tag, kind] of [['(a) gỡ section', 'none'], ['(d) chỉ dòng bỏ', 'bo']]) {
    const c = card(ws({ contract: contractOf(kind), opp: oppOf('filled'), decisions: entry(DESCOPE + 'test') }));
    const dd = c.json.duong_do, fl = ddFlags(c.html);
    if (dd.descoped !== 'd-1') errs.push(`${tag}: descoped=${dd.descoped}`);
    if (dd.lines.length) errs.push(`${tag}: lines phải rỗng`);
    if (hasLab(c.html, HEADING)) errs.push(`${tag}: không được in khối`);
    if (!(fl.length === 1 && fl[0].cls === 'finfo' && /Đã bỏ đường đo theo d-1/.test(fl[0].text) && /CHƯA ĐO/.test(fl[0].text))) errs.push(`${tag}: cờ info lệch: ${JSON.stringify(fl.map(f => f.cls + ':' + f.text.slice(0, 60)))}`);
    const r = relErr(c, tag); if (r) errs.push(r);
  }
  // seam: sai tiền tố (không gạch nối) / sai type → vẫn vàng, descoped null
  for (const [tag, decs] of [['sai tiền tố', entry(DESCOPE.replace('-', ' ') + 'test')], ['type approach', entry(DESCOPE + 'test', 'approach')]]) {
    const c = card(ws({ contract: contractOf('none'), opp: oppOf('filled'), decisions: decs }));
    const fl = ddFlags(c.html);
    if (c.json.duong_do.descoped !== null) errs.push(`seam ${tag}: descoped phải null`);
    if (!(fl.length === 1 && fl[0].cls === 'fwarn')) errs.push(`seam ${tag}: phải đúng 1 cờ vàng`);
  }
  if (errs.length) fail('DD4', errs.join(' · ')); else pass('DD4', 'RK: entry đúng tiền tố → info «Đã bỏ đường đo theo id» + CHƯA ĐO, 0 vàng (cả khi section chỉ có dòng bỏ); sai tiền tố / sai type → vẫn vàng');
}

// ---------- DD5: round-trip khuôn ↔ gate-card (AC-5)
if (want('DD5')) {
  const errs = [];
  const checkTpl = tplText => {
    const e = [];
    const blk = blockOf(tplText, 'CONTRACT-DUONG-DO-TEMPLATE');
    if (!blk) return ['khuôn thiếu khối CONTRACT-DUONG-DO-TEMPLATE'];
    const h = (blk.split('\n').find(l => /^##\s+/.test(l)) || '').replace(/^##\s+/, '').trim();
    if (h !== HEADING) e.push(`heading khuôn «${h}» ≠ gate-card «${HEADING}»`);
    const m = blk.match(/"(bỏ [^"<]+?— )<lý do/);
    if (!m) e.push('khuôn thiếu dòng mẫu bỏ'); else if (m[1] !== DESCOPE) e.push(`tiền tố khuôn «${m[1]}» ≠ gate-card «${DESCOPE}»`);
    if (!/^-\s+Thước:.*bảo đảm bởi:/m.test(blk)) e.push('khuôn thiếu dòng mẫu thước · số từ · bảo đảm bởi');
    return e;
  };
  const tpl = readFileSync(CONTRACT_TPL, 'utf8');
  const e0 = checkTpl(tpl); if (e0.length) errs.push('đối chứng dương: ' + e0.join(' · '));
  const red = checkTpl(tpl.replace(`## ${HEADING}`, '## Đường đo lường'));
  if (!red.some(x => x.includes('Đường đo lường') && x.includes(HEADING))) errs.push(`bản sao đổi heading không đỏ nêu hai chuỗi: ${JSON.stringify(red)}`);
  if (errs.length) fail('DD5', errs.join(' · ')); else pass('DD5', 'khối khuôn: heading == DUONG_DO_HEADING, tiền tố bỏ == DUONG_DO_DESCOPE, có dòng mẫu; đổi heading → đỏ nêu hai chuỗi');
}

// ---------- DD6: SKILL.md — ma trận 6 mệnh đề, phạm vi cắt đúng (AC-6)
if (want('DD6')) {
  const errs = [];
  const count = (s, needle) => s.split(needle).length - 1;
  const checkSkill = text => {
    const e = [];
    const i14 = text.indexOf('- `_acceptance/<slug>/contract.md`'); if (i14 < 0) return ['không thấy bullet contract S1#4'];
    const j14 = text.indexOf('\n   - ', i14 + 1);
    const s14 = text.slice(i14, j14 < 0 ? undefined : j14);
    const s17 = (text.split('\n').find(l => l.includes('Phản biện context sạch (gap-probe)') && l.includes('cross-check bắt buộc')) || '');
    const i4 = s17.indexOf('(4) cross-check'), i5 = s17.indexOf('(5)', i4);
    const y4 = i4 < 0 ? '' : s17.slice(i4, i5 < 0 ? undefined : i5);
    const MATRIX = [
      ['①', () => count(s14, '`## Đường đo`') === 1],
      ['②', () => count(s14, '`opportunity.md` với ngưỡng') === 1],
      ['③', () => { const m = s14.match(/bắt đầu đúng chuỗi `"([^"]+?)<lý do/); return m && m[1] === DESCOPE; }],
      ['④', () => count(s14, 'CHƯA ĐO') === 1],
      ['⑤', () => count(y4, 'không có đường đo nào trong contract') === 1],
      ['⑥', () => count(s17, '`_acceptance/<slug>/opportunity.md` làm input thứ 6') === 1],
    ];
    for (const [id, ok] of MATRIX) if (!ok()) e.push(`mệnh đề ${id}`);
    const m = s14.match(/bắt đầu đúng chuỗi `"([^"]+?)<lý do/);
    if (m && m[1] !== DESCOPE) e.push(`tiền tố SKILL «${m[1]}» ≠ gate-card «${DESCOPE}»`);
    return e;
  };
  const skill = readFileSync(SKILL, 'utf8');
  const e0 = checkSkill(skill); if (e0.length) errs.push('đối chứng dương: ' + e0.join(' · '));
  const MUT = [
    ['①', t => t.replace('section `## Đường đo` khi hồ sơ', 'section khi hồ sơ')],
    ['②', t => t.replace('`opportunity.md` với ngưỡng đã khai', 'hồ sơ với ngưỡng đã khai')],
    ['③', t => t.replace('bắt đầu đúng chuỗi `"bỏ đường-đo — <lý do', 'bắt đầu đúng chuỗi `"bỏ-dd — <lý do')],
    ['④', t => t.replace('với ô CHƯA ĐO — quyết release', 'với ô trống — quyết release')],
    ['⑤', t => t.replace('; ngưỡng nào ở `opportunity.md` không có đường đo nào trong contract', '')],
    ['⑥', t => t.replace(', CỘNG `_acceptance/<slug>/opportunity.md` làm input thứ 6', '')],
  ];
  for (const [id, mut] of MUT) {
    const m = mut(skill);
    if (m === skill) { errs.push(`mutant ${id} không tiêm được`); continue; }
    const e = checkSkill(m);
    if (!e.some(x => x.includes(`mệnh đề ${id}`))) errs.push(`gỡ ${id} mà reader không đỏ đúng mệnh đề: ${JSON.stringify(e)}`);
    if (id === '③' && !e.some(x => x.includes('bỏ-dd') && x.includes(DESCOPE))) errs.push('đổi tiền tố mà không nêu hai chuỗi');
  }
  if (errs.length) fail('DD6', errs.join(' · ')); else pass('DD6', 'SKILL S1#4/S1#7: 6 mệnh đề đếm-hit-trong-phạm-vi; tiền tố rút từ SKILL == gate-card; 6 mutant đỏ đúng mệnh đề');
}

// ---------- DD7: CONTEXT.md term (AC-7)
if (want('DD7')) {
  const errs = [];
  const checkCtx = text => {
    const e = [];
    const lines = section(text, 'Evidence vocabulary');
    const i = lines.findIndex(l => /^\*\*Đường đo\*\*:/.test(l));
    if (i < 0) return ['Evidence vocabulary thiếu term **Đường đo**'];
    const body = lines.slice(i + 1, i + 8).join('\n');
    for (const w of ['thước', 'ngưỡng', 'số đo']) if (!body.includes(w)) e.push(`định nghĩa thiếu «${w}»`);
    const av = lines.slice(i + 1, i + 8).find(l => /^_Avoid_/.test(l)) || '';
    if (!(av.includes('tracking') && av.includes('metric'))) e.push('_Avoid_ thiếu tracking/metric');
    return e;
  };
  const ctx = readFileSync(CONTEXT, 'utf8');
  const e0 = checkCtx(ctx); if (e0.length) errs.push('đối chứng dương: ' + e0.join(' · '));
  const red = checkCtx(ctx.replace('**Đường đo**:', '**Duong do**:'));
  if (!red.some(x => x.includes('thiếu term'))) errs.push('gỡ term mà không đỏ');
  if (errs.length) fail('DD7', errs.join(' · ')); else pass('DD7', 'CONTEXT.md có term Đường đo (thước/ngưỡng/số đo, _Avoid_ tracking+metric); gỡ → đỏ');
}

const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [DD_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`duong-do: ${failures} ca đỏ`); process.exit(1); }
