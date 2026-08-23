// tests/plugins/lenh-bam-duoc.test.mjs — ca hồ sơ lenh-in-ra-phai-bam-duoc (LB1–LB8).
// Bảng COMMAND-NAMES rút từ marker; vật thật đọc từ thư mục + plugin.json lúc chạy; quét token với ranh
// giới khai tường minh (AC-2); đối chứng dương bằng vật TIÊM (không neo mốc git di động); gate-card thật.
//   LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const HFL = path.join(ROOT, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const OPP_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));

let failures = 0;
const ALL_IDS = ['LB1', 'LB2', 'LB3', 'LB4', 'LB5', 'LB6', 'LB7', 'LB8', 'LB9'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.LB_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'lb-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const blockOf = (text, marker) => { const m = text.match(new RegExp(`<!-- <<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>> -->`)); return m ? m[1] : null; };

// ── Bảng COMMAND-NAMES (nguồn duy nhất) ────────────────────────────────────
const parseTable = hflText => {
  const blk = blockOf(hflText, 'COMMAND-NAMES'); if (!blk) return null;
  return blk.split('\n').filter(l => /^\|/.test(l)).slice(2).map(l => l.split('|').slice(1, -1).map(c => c.trim()))
    .filter(c => c.length === 3).map(([bare, cmd, kind]) => ({ bare, cmd, kind }));
};
const ALLOW_HARNESS = ['goal'];
// pluginNameOf: prefix → name đọc từ plugin.json (mặc định: các thư mục plugin của kit)
const defaultPluginNameOf = () => {
  const map = {};
  for (const d of ['.', 'feature-loop', 'diagram-design']) {
    const pj = path.join(ROOT, d, '.claude-plugin', 'plugin.json');
    if (existsSync(pj)) map[JSON.parse(readFileSync(pj, 'utf8')).name] = path.join(ROOT, d);
  }
  return map;
};
// AC-1: bảng ⊆ vật thật
const checkTable = (rows, plugins) => {
  const errs = [];
  for (const r of rows) {
    if (r.kind === 'harness') { if (!ALLOW_HARNESS.includes(r.bare)) errs.push(`dòng harness «${r.bare}» ngoài danh sách ngoại lệ [${ALLOW_HARNESS.join(',')}]`); continue; }
    const m = r.cmd.match(/^\/([a-z0-9-]+):([a-z0-9-]+)$/);
    if (!m) { errs.push(`dòng «${r.bare}»: lệnh «${r.cmd}» không đúng dạng /<plugin>:<tên>`); continue; }
    const [, prefix, name] = m;
    const dir = plugins[prefix];
    if (!dir) { errs.push(`dòng «${r.bare}»: tiền tố lệch — không plugin.json nào có name «${prefix}»`); continue; }
    if (name !== r.bare) errs.push(`dòng «${r.bare}»: tên sau dấu : là «${name}», lệch cột một`);
    const ok = r.kind === 'command' ? existsSync(path.join(dir, 'commands', `${name}.md`)) : existsSync(path.join(dir, 'skills', name, 'SKILL.md'));
    if (!ok) errs.push(`dòng «${r.bare}»: không có vật ${r.kind === 'command' ? `commands/${name}.md` : `skills/${name}/SKILL.md`} trong plugin «${prefix}»`);
  }
  return errs;
};

// ── Quét điểm bàn giao (AC-2) — ranh giới khai tường minh ───────────────────
const FILES = ['commands/acceptance-card.md', 'commands/acceptance-init.md', 'commands/acceptance-report.md', 'commands/acceptance-status.md', 'commands/approve.md', 'commands/signoff.md', 'commands/start.md', 'skills/acceptance/SKILL.md', 'skills/acceptance/references/human-facing-language.md', 'skills/uat-session/SKILL.md', 'feature-loop/skills/feature-loop/SKILL.md', 'scripts/gate-card.js', 'scripts/evidence-page.js',
  // ba tài liệu ĐẦU-TAY (hồ sơ lenh-tran-tai-lieu-dau-tay): nơi người mới chép lệnh trước cả khi thấy thẻ
  'QUICKSTART.md', 'README.md', 'GUIDE.md'];
// uat-session vào danh sách trần (review S4-r1 F1: `/uat-session <slug>` từng lọt cả hai regex); look-ahead có `.`
// để không ăn đường dẫn `…/uat-session.md`.
const BARE_NAMES = ['start', 'approve', 'signoff', 'acceptance-card', 'acceptance-init', 'acceptance-status', 'acceptance-report', 'feature-loop', 'uat-session'];
const BARE_RE = new RegExp(`(^|[^a-z0-9:/-])/(${BARE_NAMES.join('|')})(?![a-z0-9:/.-])`, 'g');
if (FILES.length !== 16) throw new Error(`vũ trụ quét phải đúng 16 file, đang ${FILES.length}`);
const UAT_RE = /`uat-session\b/g;
const PREFIXED_RE = /\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*/g;
const scan = texts => {   // texts: [{rel, txt}] → {bare:[{rel,line,tok}], uat:[…], prefixed:[…]}
  const out = { bare: [], uat: [], prefixed: [] };
  for (const { rel, txt } of texts) {
    let inblk = false;
    txt.split('\n').forEach((l, i) => {
      if (l.includes('<<<COMMAND-NAMES -->')) inblk = true;
      if (inblk) { if (l.includes('COMMAND-NAMES>>>')) inblk = false; return; }
      for (const m of l.matchAll(BARE_RE)) out.bare.push({ rel, line: i + 1, tok: '/' + m[2] });
      for (const m of l.matchAll(UAT_RE)) out.uat.push({ rel, line: i + 1, tok: m[0] });
      for (const m of l.matchAll(PREFIXED_RE)) out.prefixed.push({ rel, line: i + 1, tok: m[0] });
    });
  }
  return out;
};
const loadTree = (readFn) => FILES.map(rel => ({ rel, txt: readFn(rel) }));

// ── gate-card helpers ──────────────────────────────────────────────────────
const cardHtml = (root, slug, script = GATE_CARD, extra = []) => {
  const r = spawnSync(process.execPath, [script, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card chết (${script}): ${r.stderr.slice(0, 200)}`);
  return r.stdout;
};
const flagsOf = html => [...html.matchAll(/<div class="flag (fwarn|finfo|fok|fred)"[^>]*>([\s\S]*?)<\/div>/g)].map(m => ({ cls: m[1], text: m[2].replace(/<[^>]+>/g, '') }));
const isBaselineFlag = f => f.cls === 'fred' && (/^n-a\b/i.test(f.text.trim()) || /Analyst n-a không nêu lý do/.test(f.text));
const isGlossaryFlag = f => /--glossary-base/.test(f.text);
const OPP_HEADING = 'Ngưỡng chết / ngưỡng UAT';
const oppFilled = () => {
  const tpl = readFileSync(OPP_TPL, 'utf8');
  const bul = section(tpl, OPP_HEADING).filter(l => /^\s*[-*]\s+[^:]+:/.test(l)).map(l => l.replace(/:\s*…\s*$/, ': giá trị thật'));
  return fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE', { slug: 'x', feature: 'Ý x', owner: 'o@x', stage: 'discovery', decision: '', decided_by: '', decided_at: '', base_commit: '', disposition: '' },
    `\n## Vấn đề & ai gặp\n\nMột câu.\n\n## ${OPP_HEADING}\n\n${bul.join('\n')}\n`);
};
const contractWith = (status, extraSections = '') => fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'Ý x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces: 'cli', status },
  '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c xảy ra.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n' + extraSections + '\n## Out of scope\n\n- a\n- b\n');
const evidenceWith = analyst => `---\nschema_version: 2\nfeature_slug: x\nverdict: PASS\nfailed_evals: []\nverified_by: t\nenforcement_mode: strict\nbypass_used: false\nverified_commit: 0123456789abcdef0123456789abcdef01234567\nhuman_signoff:\n---\n\n# Evidence Report: x\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: x-E1-r1-20260101T000000Z\n  exit_code: 0\n  verifier: config:executors.test.plugins\n  verified_at: 2026-01-01T00:00:00Z\n  output: |\n    ok\n\n## Analyst\n\n${analyst}\n\n## Variance\n\nnone\n\n## Known limits\n\n## Ngoài hợp đồng\n\n## Iterations\n\nRound 1: ok\n`;
const ws = ({ contract, evidence = null, opp = null, decisions = null, context = false }) => {
  const r = tmp();
  W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  W(r, '_acceptance/x/contract.md', contract);
  if (evidence) W(r, '_acceptance/x/evidence-report.md', evidence);
  if (opp) W(r, '_acceptance/x/opportunity.md', opp);
  if (decisions) W(r, '_acceptance/x/decisions.jsonl', decisions.map(d => JSON.stringify(d)).join('\n') + '\n');
  if (context) W(r, 'CONTEXT.md', '# ctx\n\n**Term**:\nđịnh nghĩa.\n_Avoid_: x\n');
  return r;
};

// ---------- LB1: bảng ⊆ vật thật (AC-1)
if (want('LB1')) {
  const errs = [];
  const hfl = readFileSync(HFL, 'utf8'); const rows = parseTable(hfl);
  if (!rows || rows.length < 9) errs.push(`bảng COMMAND-NAMES thiếu/ngắn: ${rows && rows.length}`);
  else {
    const plugins = defaultPluginNameOf();
    const e0 = checkTable(rows, plugins); if (e0.length) errs.push('đối chứng dương: ' + e0.join(' · '));
    const eA = checkTable([...rows, { bare: 'foo', cmd: '/acceptance-gate:foo', kind: 'command' }], plugins);
    if (!eA.some(x => x.includes('không có vật') && x.includes('foo'))) errs.push(`dòng foo không đỏ: ${JSON.stringify(eA)}`);
    const renamed = Object.fromEntries(Object.entries(plugins).map(([k, v]) => [k === 'acceptance-gate' ? 'acceptance-gat' : k, v]));
    const eB = checkTable(rows, renamed);
    if (!eB.some(x => x.includes('tiền tố lệch'))) errs.push(`đổi name plugin.json không đỏ: ${JSON.stringify(eB)}`);
    const eC = checkTable([...rows, { bare: 'bar', cmd: '/bar', kind: 'harness' }], plugins);
    if (!eC.some(x => x.includes('ngoài danh sách ngoại lệ') && x.includes('bar'))) errs.push(`dòng harness bar không đỏ: ${JSON.stringify(eC)}`);
  }
  if (errs.length) fail('LB1', errs.join(' · ')); else pass('LB1', 'bảng COMMAND-NAMES ⊆ vật thật (tiền tố = name plugin.json, vật tồn tại; harness chỉ [goal]); foo / đổi name / harness lạ → đỏ');
}

// ---------- LB2: điểm bàn giao ⊆ bảng, 0 trần, đối chứng dương per-file bằng vật tiêm (AC-2)
if (want('LB2')) {
  const errs = [];
  for (const rel of FILES) if (!existsSync(path.join(ROOT, rel))) errs.push(`vũ trụ thiếu ${rel}`);
  const rows = parseTable(readFileSync(HFL, 'utf8')) || [];
  const allowed = new Set(rows.map(r => r.cmd));
  const now = scan(loadTree(rel => readFileSync(path.join(ROOT, rel), 'utf8')));
  if (now.bare.length) errs.push(`còn token trần: ${now.bare.slice(0, 5).map(x => `${x.rel}:${x.line} ${x.tok}`).join(', ')}`);
  if (now.uat.length) errs.push(`còn uat-session thiếu tiền tố: ${now.uat.map(x => `${x.rel}:${x.line}`).join(', ')}`);
  const strange = now.prefixed.filter(x => !allowed.has(x.tok));
  if (strange.length) errs.push(`lệnh có tiền tố ngoài bảng: ${strange.slice(0, 5).map(x => `${x.rel}:${x.line} ${x.tok}`).join(', ')}`);
  // ĐỐI CHỨNG DƯƠNG dựng bằng VẬT DO TEST TIÊM, KHÔNG đọc `origin/main` (S4-r1 hồ sơ này:
  // neo mốc DI ĐỘNG thì ngay lần merge kế «bản cũ» thành bản mới và thước tự vô hiệu —
  // cùng lớp mà D17 của release-2-2-0 đã cấm). Vũ trụ không rỗng: đo bằng ngưỡng dưới cố định.
  if (now.prefixed.length < 100) errs.push(`vũ trụ teo: chỉ ${now.prefixed.length} token có tiền tố (< 100) — sửa bằng cách xoá câu?`);
  // per-file: mỗi file trong vũ trụ phải THẬT SỰ được đọc (đọc hụt một file là xanh giả)
  for (const rel of FILES) {
    const one = scan([{ rel, txt: readFileSync(path.join(ROOT, rel), 'utf8') + '\nchạy `/start` rồi `uat-session <slug>`\n' }]);
    if (!one.bare.some(x => x.rel === rel && x.tok === '/start')) errs.push(`đối chứng dương ${rel}: tiêm /start mà không thấy`);
    if (!one.uat.some(x => x.rel === rel)) errs.push(`đối chứng dương ${rel}: tiêm uat-session mà không thấy`);
  }
  // (v) giữ-gân: 3 chuỗi mẫu → 0 hit
  const guard = scan([{ rel: 'g', txt: 'x `/feature-loop:feature-loop x` y\nfeature-loop/skills/feature-loop/SKILL.md\n_acceptance/<slug>/uat-session.md\n<!-- <<<COMMAND-NAMES -->\n| start | /acceptance-gate:start | command |\n<!-- COMMAND-NAMES>>> -->\n' }]);
  if (guard.bare.length || guard.uat.length) errs.push(`giữ-gân hụt: ${JSON.stringify(guard.bare)}`);
  const r0 = scan([{ rel: 'g', txt: 'chạy `/uat-session <slug>`' }]);
  if (!r0.bare.some(x => x.tok === '/uat-session')) errs.push('`/uat-session <slug>` (gạch chéo, không tiền tố) lọt thước');
  // chiều đỏ: chèn vào bản sao start.md
  const startTxt = readFileSync(path.join(ROOT, 'commands/start.md'), 'utf8');
  const r1 = scan([{ rel: 'commands/start.md', txt: startTxt + '\nchạy `/start` đi\n' }]);
  if (!r1.bare.some(x => x.tok === '/start' && x.line > 1)) errs.push('chèn `/start` không đỏ nêu file:dòng');
  const r2 = scan([{ rel: 'commands/start.md', txt: startTxt + '\n`uat-session <slug>`\n' }]);
  if (!r2.uat.length) errs.push('chèn `uat-session <slug>` không đỏ');
  const r3 = scan([{ rel: 'commands/start.md', txt: startTxt + '\n/acceptance-gate:foo\n' }]);
  if (!r3.prefixed.some(x => x.tok === '/acceptance-gate:foo' && !allowed.has(x.tok))) errs.push('chèn /acceptance-gate:foo không đỏ');
  if (errs.length) fail('LB2', errs.join(' · ')); else pass('LB2', `16 file: 0 trần, 0 uat thiếu tiền tố, ${now.prefixed.length} lệnh có tiền tố ⊆ bảng; ${FILES.length} đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ`);
}

// ---------- LB3: câu luật (AC-3)
if (want('LB3')) {
  const errs = [];
  const hfl = readFileSync(HFL, 'utf8');
  const clause = blockOf(hfl, 'COMMAND-NAMES-CLAUSE');
  if (!clause) errs.push('không thấy khối COMMAND-NAMES-CLAUSE');
  else {
    if ((clause.match(/COMMAND-NAMES/g) || []).length !== 1) errs.push('câu luật phải nhắc bảng đúng 1 lần');
    if (!/Lệnh bấm được/.test(clause)) errs.push('câu luật không nhắc cột «Lệnh bấm được»');
    if (!/không dùng dạng trần/.test(clause)) errs.push('câu luật không cấm dạng trần');
  }
  if (blockOf(hfl.replace(/<!-- <<<COMMAND-NAMES-CLAUSE -->[\s\S]*?<!-- COMMAND-NAMES-CLAUSE>>> -->/, ''), 'COMMAND-NAMES-CLAUSE') !== null) errs.push('gỡ khối mà vẫn thấy');
  if (errs.length) fail('LB3', errs.join(' · ')); else pass('LB3', 'một câu luật: dùng cột Lệnh bấm được của COMMAND-NAMES, không dạng trần; gỡ → đỏ');
}

// ---------- LB4: Analyst n-a ba trạng thái (AC-4)
if (want('LB4')) {
  const errs = [];
  const run = analyst => flagsOf(cardHtml(ws({ contract: contractWith('verified'), evidence: evidenceWith(analyst) }), 'x'));
  const a = run('n-a — không chạy baseline vì đường verify độc lập, chủ ý theo d-1.');
  if (a.some(isBaselineFlag)) errs.push('(a) n-a có lý do mà vẫn cờ đỏ');
  const b = run('n-a');
  if (!b.some(f => /Analyst n-a không nêu lý do/.test(f.text))) errs.push(`(b) n-a trần không cờ ghim: ${JSON.stringify(b.map(f => f.text.slice(0, 40)))}`);
  const b2 = run('n-a — ngắn');
  if (!b2.some(f => /Analyst n-a không nêu lý do/.test(f.text))) errs.push('(b) n-a lý do ngắn không cờ');
  const c = run('Eval E1 không phân biệt: baseline cũng xanh.');
  if (!c.some(f => f.cls === 'fred' && /không phân biệt/.test(f.text))) errs.push('(c) Analyst có nội dung thật mà mất cờ đỏ cũ');
  // hỗn hợp: n-a cho vài eval NHƯNG có mệnh đề mở bằng mã eval → vẫn là phân tích thật → đỏ như cũ (review F2)
  const mix = run('n-a cho E1–E3 vì không có baseline; E4, E5: baseline cũng xanh — KHÔNG phân biệt');
  if (!mix.some(f => f.cls === 'fred' && /baseline cũng xanh/.test(f.text))) errs.push('(c\') Analyst hỗn hợp n-a + mã eval bị nuốt thành «có lý do»');
  // (c) rỗng / vắng section → không cờ baseline, không chết
  const e1 = run(''); if (e1.some(isBaselineFlag)) errs.push('(c) Analyst rỗng mà có cờ baseline');
  const noSec = evidenceWith('x').replace(/## Analyst\n\nx\n\n/, '');
  const e2 = flagsOf(cardHtml(ws({ contract: contractWith('verified'), evidence: noSec }), 'x')); if (e2.some(isBaselineFlag)) errs.push('(c) vắng section mà có cờ baseline');
  for (const s of ['repo-khai-plugin', 'vao-co-o-ra-co-ten', 'duong-do-trong-dinh-nghia-xong']) {
    const fl = flagsOf(cardHtml(ROOT, s));
    if (fl.some(isBaselineFlag)) errs.push(`vật thật ${s}: vẫn cờ đỏ baseline`);
  }
  if (errs.length) fail('LB4', errs.join(' · ')); else pass('LB4', 'Analyst n-a có lý do → không đỏ; n-a trần/ngắn → đỏ ghim; nội dung thật → đỏ như cũ; ba hồ sơ thật 0 cờ baseline');
}

// ---------- LB5: bỏ cờ glossary-base; tập cờ cũ∖mới trên cây thật (AC-5)
if (want('LB5')) {
  const errs = [];
  const r = ws({ contract: contractWith('draft'), context: true });
  const fl = flagsOf(cardHtml(r, 'x'));
  if (fl.some(isGlossaryFlag)) errs.push('fixture có CONTEXT.md không --glossary-base: vẫn cờ glossary-base');
  // bản sao cây với gate-card CŨ đặt đúng chỗ (require('../lib') sống)
  const copy = tmp();
  // (bản sao cây với gate-card CŨ đã dựng ở trên)
  // CONTEXT.md phải có trong bản sao: cờ glossary-base của bản cũ chỉ bắn khi repo có CONTEXT.md (đối chứng dương cần nó)
  for (const d of ['scripts', 'lib', 'skills/acceptance/references', '_acceptance/config.yaml', 'CONTEXT.md']) cpSync(path.join(ROOT, d), path.join(copy, d), { recursive: true });
  const SLUGS = ['repo-khai-plugin', 'vao-co-o-ra-co-ten', 'duong-do-trong-dinh-nghia-xong'];
  for (const s of SLUGS) cpSync(path.join(ROOT, '_acceptance', s), path.join(copy, '_acceptance', s), { recursive: true });
  // SHA CỐ ĐỊNH (main trước chip D #93) — KHÔNG `origin/main`: mốc di động làm «bản cũ» hoá bản mới
  // ngay lần merge kế, đối chứng dương chết im lặng (S4-r1 hồ sơ lenh-tran-tai-lieu-dau-tay).
  const OLD_SHA = 'ba539284';
  const oldSrc = execFileSync('git', ['-C', ROOT, 'show', `${OLD_SHA}:scripts/gate-card.js`], { encoding: 'utf8' });
  writeFileSync(path.join(copy, 'scripts', 'gate-card.js'), oldSrc);
  const kinds = { baseline: 0, glossary: 0 };
  // Đối chứng dương cho cờ glossary: cờ này chỉ có ở thẻ Cổng 1 (A/B/C đều đã ký → Cổng 2), nên đo trên
  // fixture Cổng 1 bằng CHÍNH bản cũ: cũ phải bắn, mới không.
  const oldFx = flagsOf(cardHtml(r, 'x', path.join(copy, 'scripts', 'gate-card.js')));
  if (oldFx.some(isGlossaryFlag)) kinds.glossary++; else errs.push('đối chứng dương: bản cũ trên fixture Cổng 1 có CONTEXT.md không bắn cờ glossary-base');
  for (const s of SLUGS) {
    const oldF = flagsOf(cardHtml(copy, s, path.join(copy, 'scripts', 'gate-card.js'))).map(f => f.text);
    const newF = flagsOf(cardHtml(ROOT, s)).map(f => f.text);
    const gone = oldF.filter(t => !newF.includes(t)), added = newF.filter(t => !oldF.includes(t));
    for (const t of gone) {
      if (/^n-a\b/i.test(t.trim())) kinds.baseline++;
      else if (/--glossary-base/.test(t)) kinds.glossary++;
      else errs.push(`${s}: cờ mất ngoài hai loại TRỪ: «${t.slice(0, 60)}»`);
    }
    if (added.length) errs.push(`${s}: CỘNG cờ lén: ${added.map(t => t.slice(0, 50)).join(' | ')}`);
  }
  if (!kinds.baseline) errs.push('đối chứng dương: bản cũ không phát cờ baseline nào trên ba hồ sơ');
  if (errs.length) fail('LB5', errs.join(' · ')); else pass('LB5', `0 cờ glossary-base; cũ∖mới trên A/B/C chỉ gồm baseline(${kinds.baseline}) + glossary(${kinds.glossary}), mới∖cũ = ∅`);
}

// ---------- LB6: dòng bỏ lệch gạch nối (AC-6)
if (want('LB6')) {
  const errs = [];
  const sec = '\n## Đường đo\n\n- Bỏ đường đo — lý do (entry d-1)\n';
  const j = (root) => JSON.parse(spawnSync(process.execPath, [GATE_CARD, '--root', root, '--slug', 'x', '--extract'], { encoding: 'utf8' }).stdout);
  const r1 = ws({ contract: contractWith('draft', sec), opp: oppFilled() });
  const d1 = j(r1).duong_do, f1 = flagsOf(cardHtml(r1, 'x'));
  if (d1.lines.length) errs.push(`dòng bỏ không gạch bị coi là đường đo: ${JSON.stringify(d1.lines)}`);
  if (!f1.some(f => f.cls === 'fwarn' && /chưa có đường đo/.test(f.text))) errs.push('không entry → phải vàng');
  const r2 = ws({ contract: contractWith('draft', sec), opp: oppFilled(), decisions: [{ id: 'd-1', type: 'descope', decision: 'bỏ đường-đo — test', impact: 'x' }] });
  const f2 = flagsOf(cardHtml(r2, 'x'));
  if (!f2.some(f => f.cls === 'finfo' && /Đã bỏ đường đo theo d-1/.test(f.text))) errs.push('có entry → phải info');
  if (errs.length) fail('LB6', errs.join(' · ')); else pass('LB6', '«Bỏ đường đo —» không gạch/viết hoa = dòng bỏ: không vào lines; không entry → vàng, entry → info');
}

// ---------- LB7: _Avoid_ không metric; uat-session không «tracking» (AC-7)
if (want('LB7')) {
  const errs = [];
  const check = ctx => {
    const e = []; const lines = section(ctx, 'Evidence vocabulary');
    const i = lines.findIndex(l => /^\*\*Đường đo\*\*:/.test(l)); if (i < 0) return ['thiếu term Đường đo'];
    const av = lines.slice(i + 1, i + 9).find(l => /^_Avoid_/.test(l)) || '';
    if (!/tracking/.test(av)) e.push('_Avoid_ thiếu tracking');
    if (/_Avoid_:[^(]*\bmetric\b/.test(av)) e.push('_Avoid_ còn «metric» (đụng từ chuẩn kit)');
    return e;
  };
  const ctx = readFileSync(path.join(ROOT, 'CONTEXT.md'), 'utf8');
  const e0 = check(ctx); if (e0.length) errs.push('đối chứng dương: ' + e0.join(' · '));
  const red = check(ctx.replace('_Avoid_: tracking, analytics.', '_Avoid_: tracking, analytics, metric.'));
  if (!red.some(x => x.includes('metric'))) errs.push('thêm lại metric mà không đỏ');
  const uat = readFileSync(path.join(ROOT, 'skills', 'uat-session', 'SKILL.md'), 'utf8');
  if (/Số lấy từ tracking/.test(uat)) errs.push('uat-session còn «Số lấy từ tracking»');
  if (!/đường đo đã khai/.test(uat)) errs.push('uat-session chưa nói «đường đo đã khai»');
  if (errs.length) fail('LB7', errs.join(' · ')); else pass('LB7', '_Avoid_ của Đường đo: tracking, không metric; uat-session lấy số từ đường đo đã khai; thêm lại metric → đỏ');
}

// ---------- LB8: vị trí khối START-HIEU-KET + ghi chú decided_at (AC-8)
if (want('LB8')) {
  const errs = [];
  const md = readFileSync(path.join(ROOT, 'commands', 'start.md'), 'utf8');
  const iNew = md.indexOf('**Bắt đầu việc mới**'), iHk = md.indexOf('<<<START-HIEU-KET'), iA = md.indexOf('(a) ý còn mơ hồ');
  if (!(iNew > -1 && iNew < iHk && iHk < iA)) errs.push(`vị trí: Bắt đầu=${iNew} HIEU-KET=${iHk} (a)=${iA}`);
  const stub = readFileSync(path.join(ROOT, '_acceptance', 'duong-do-trong-dinh-nghia-xong', 'opportunity.md'), 'utf8');
  if (!/decided_at:.*XẤP XỈ/.test(stub)) errs.push('stub duong-do thiếu ghi chú decided_at xấp xỉ');
  if (errs.length) fail('LB8', errs.join(' · ')); else pass('LB8', 'START-HIEU-KET nằm trong bullet «Bắt đầu việc mới», trước (a); stub duong-do ghi chú decided_at xấp xỉ');
}

// ---------- LB9: lệnh KHÔNG PHẢI slash-command giữ nguyên (AC-3 lenh-tran-tai-lieu-dau-tay)
// Neo SHA CỐ ĐỊNH — không `origin/main` (lớp «mốc di động» đã nổ một lần ở S4-r1 hồ sơ này).
if (want('LB9')) {
  const errs = [];
  const OLD_SHA = 'ba539284';
  const CMD_RE = /claude plugin (marketplace add|install|update)/g;
  const countIn = s => (s.match(CMD_RE) || []).length;
  const nowG = readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8');
  let oldG;
  try { oldG = execFileSync('git', ['-C', ROOT, 'show', `${OLD_SHA}:GUIDE.md`], { encoding: 'utf8' }); }
  catch (e) { errs.push(`không đọc được ${OLD_SHA}:GUIDE.md — ${String(e.message).split('\n')[0]}`); }
  if (oldG) {
    const a = countIn(oldG), b = countIn(nowG);
    if (a === 0) errs.push('đối chứng dương hỏng: bản cũ có 0 lệnh `claude plugin`');
    if (a !== b) errs.push(`lệnh \`claude plugin\` lệch số: cũ ${a}, nay ${b}`);
    const line = s => (s.split('\n').find(l => l.startsWith('> Khớp phiên bản')) || '').trim();
    if (line(nowG) !== line(oldG)) errs.push(`dòng «Khớp phiên bản» đổi: «${line(oldG)}» → «${line(nowG)}»`);
    // chiều đỏ: đổi một lệnh claude plugin thành dạng slash → phải lệch số
    const red = nowG.replace('claude plugin marketplace add', '/acceptance-gate:acceptance-init');
    if (red === nowG) errs.push('tiêm mutant thất bại: không thấy `claude plugin marketplace add`');
    else if (countIn(red) === countIn(nowG)) errs.push('mutant đổi lệnh claude plugin mà số không lệch');
  }
  if (errs.length) fail('LB9', errs.join(' · '));
  else pass('LB9', `lệnh \`claude plugin\` giữ nguyên số (${countIn(nowG)}) so với ${OLD_SHA}; dòng «Khớp phiên bản» không đổi; mutant đổi-sang-slash → lệch số`);
}

const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [LB_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`lenh-bam-duoc: ${failures} ca đỏ`); process.exit(1); }
