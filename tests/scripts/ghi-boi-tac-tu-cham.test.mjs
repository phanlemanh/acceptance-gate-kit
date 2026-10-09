// ghi-boi-tac-tu-cham.test.mjs — hồ sơ tac-tu-cham-chi-cham-khong (T2, 09/10), lối D.
// Cây đổi trong lượt chấm → `thuoc-vat --write` quy trách nhiệm cho đúng tác tử chấm (AT5) và tự
// hoàn lại khi đủ bốn điều kiện an toàn, để lượt kế chấm lại CÙNG round (AT6). Tên nhóm AT<n> = AC-<n>.
//
// Fixture: kho git do CODE sinh (thuoc-vat-fixture.mjs); tệp args do s4-args THẬT sinh; dòng sổ do
// thuoc-vat --write THẬT ghi; dòng round-tally do bộ chấm THẬT dựng (harness vm). Transcript:
// hàng 2 là bản trích NGUYÊN VĂN transcript thật 07/10 (tests/fixtures/ghi-boi/), gốc kho thay
// bằng phép thay chuỗi trong lần chạy; các hàng khác do code sinh. HOME giả cho mọi lần gọi
// thuoc-vat — không quét thư mục dự án thật của máy. Mọi đường suy từ vị trí tệp này.
//
//   node tests/scripts/ghi-boi-tac-tu-cham.test.mjs [--only AT5,AT6]
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow } from '../workflows/harness.mjs';
import { dungKho, SLUG } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const THUOC_VAT = path.join(KIT, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
const GHI_BOI = path.join(KIT, 'feature-loop', 'scripts', 'lib', 'ghi-boi.mjs');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const MAU_0710 = path.join(KIT, 'tests', 'fixtures', 'ghi-boi', '0710-agent-ae624896.jsonl');
const GOC_0710 = '/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/gifted-euler-725261';
const TMP = mkdtempSync(path.join(tmpdir(), 'ghi-boi-'));
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : (process.env.AT_CASES || null); })();
const want = g => !ONLY || ONLY.split(',').includes(g);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WS = d => path.join(d, '_acceptance', SLUG);
const W = (d, rel, s) => { const f = path.join(d, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, s); };
const A = (d, rel, s = '// doi\n') => appendFileSync(path.join(d, rel), s);
const commit = (d, tep, msg = 'c') => { git(d, 'add', ...tep); git(d, 'commit', '-qm', msg); return git(d, 'rev-parse', 'HEAD'); };

// Khuôn dòng RÚT từ khối marker của bên viết — không gõ tay.
const khoaKhuon = () => {
  const m = readFileSync(GHI_BOI, 'utf8').match(/<<<GHI-BOI-LINE\n\/\/ (\{[^\n]+\})\n\/\/ GHI-BOI-LINE>>>/);
  if (!m) throw new Error('khong rut duoc khoi GHI-BOI-LINE tu ghi-boi.mjs');
  return Object.keys(JSON.parse(m[1].replace(/<n>/g, '0'))).filter(k => k !== 'ly_do').sort();
};

function kho() {
  const { d } = dungKho(mkdtempSync(path.join(TMP, 'k-')), ['vat', 'implemented']);
  W(d, 'src/b.js', '// b\n');
  commit(d, ['-A'], 'kho');
  return d;
}
const HOME_RONG = () => mkdtempSync(path.join(TMP, 'home-'));
const sinhArgs = d => spawnSync(process.execPath, [S4ARGS, '--slug', SLUG, '--root', d, '--ag-root', KIT, '--out', path.join(WS(d), 's4-args.json'), '--diff-base', 'main', '--no-carry'], { encoding: 'utf8' });
const docArgs = d => JSON.parse(readFileSync(path.join(WS(d), 's4-args.json'), 'utf8'));
const sauLuot = (d, { transcript = [], home = HOME_RONG() } = {}) => spawnSync(process.execPath,
  [THUOC_VAT, '--root', d, '--slug', SLUG, '--ag-root', KIT, '--write', ...transcript.flatMap(t => ['--transcript', t])],
  { encoding: 'utf8', env: { ...process.env, HOME: home } });
const dongSo = (d, kind) => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean)
  .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(o => o && o.kind === kind);

// Transcript do code sinh: một thư mục wf_ với journal + một tệp agent-*.jsonl mỗi tác tử.
function wfDir(goc, ten = 'wf_test') {
  const d = path.join(goc, ten); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'journal.jsonl'), '{"type":"result"}\n');
  return d;
}
function tacTu(wf, id, nhan, dung, { root = '' } = {}) {
  const dong = [
    { type: 'user', message: { role: 'user', content: [{ type: 'text', text: '[Workflow harness — user request] sua X va them test' }] } },
    { type: 'user', message: { role: 'user', content: [{ type: 'text', text: `[wf-label: ${nhan}]\nVerifier doc lap. cd "${root}" && npm test # _acceptance/${SLUG}/` }] } },
    ...dung.map(([ten, input]) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id: 'tu', name: ten, input }] } })),
  ];
  writeFileSync(path.join(wf, `agent-${id}.jsonl`), dong.map(o => JSON.stringify(o)).join('\n') + '\n');
}
// Một hồ sơ sẵn sàng: args do s4-args thật sinh + một lượt chấm thật ghi round-tally.
async function hoSo(chuanBi = () => {}) {
  const d = kho();
  chuanBi(d);
  const r = sinhArgs(d);
  if (r.status !== 0) throw new Error(`s4-args thoat ${r.status}: ${String(r.stderr).split('\n').slice(-2).join(' | ')}`);
  const a = docArgs(d);
  const ev = [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'echo x', ref: 'config:executors.test.api', expected: 'x' }];
  const k = await runWorkflow(WF, { slug: SLUG, round: a.round, riskTier: 'T2', evals: ev, suiteCommands: [], diffBase: 'main', repoRoot: d, personasPath: '/p', templatePath: '/t', invokedAt: a.invokedAt, invokedSha: a.invokedSha }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'x\n__EXIT=0', runId: 'rid-e1', cannotRun: false };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: a.invokedSha };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  });
  appendFileSync(path.join(WS(d), 'run-log.jsonl'), k.result.runLog.join('\n') + '\n');
  return { d, a };
}
// Kiểm chung cho mọi hàng: mã 6, đúng MỘT dòng ghi-boi sau đúng MỘT dòng cay-doi, khoá đúng khuôn.
function kiemChung(d, r, K, { ma = 6 } = {}) {
  const sai = [];
  const cd = dongSo(d, 'cay-doi'); const gb = dongSo(d, 'ghi-boi-tac-tu-cham');
  if (r.status !== ma) sai.push(`thoat ${r.status}, mong ${ma}: ${String(r.stderr).split('\n').slice(-3).join(' | ')}`);
  if (ma === 5 && dongSo(d, 'thuoc-lech').length !== 1) sai.push('mong dong thuoc-lech khi ma 5');
  if (cd.length !== 1 || gb.length !== 1) sai.push(`${cd.length} cay-doi / ${gb.length} ghi-boi, mong 1/1`);
  const dong = readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean);
  const iCd = dong.findIndex(l => l.includes('"kind":"cay-doi"'));
  if (iCd < 0 || !dong[iCd + 1] || !dong[iCd + 1].includes('"kind":"ghi-boi-tac-tu-cham"')) sai.push('dong ghi-boi khong dung NGAY sau dong cay-doi');
  const g = gb[0] || {};
  const khoa = Object.keys(g).filter(k => k !== 'ly_do' && k !== 'khong_doc_duoc').sort();
  if (gb.length && JSON.stringify(khoa) !== JSON.stringify(K)) sai.push(`khoa ${JSON.stringify(khoa)} != khuon ${JSON.stringify(K)}`);
  return { sai, g };
}

// ── AT5 — quy trách nhiệm ──────────────────────────────────────────────────
const HANG_AT5 = [
  { n: 1, ten: 'Edit tep vat', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'e1', 'machine:npm test', [['Edit', { file_path: path.join(d, 'src/a.js'), old_string: 'a', new_string: 'b' }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].id === 'agent-e1' && JSON.stringify(g.tac_tu[0].cong_cu) === '["Edit"]' && JSON.stringify(g.tac_tu[0].tep) === '["src/a.js"]' && !g.tep_khong_ro.length && !('khong_doc_duoc' in g) },
  { n: 2, ma: 5, ten: 'Write + git commit (trich that 07/10)', tiem: (d, wf) => {
      W(d, 'tests/scripts/luot-sua-giu-du-dem-dung.test.mjs', '// t1\n'); W(d, 'tests/scripts/thuoc-vat-merge-detailed.test.mjs', '// t2\n');
      commit(d, ['tests/scripts/luot-sua-giu-du-dem-dung.test.mjs', 'tests/scripts/thuoc-vat-merge-detailed.test.mjs']);
      writeFileSync(path.join(wf, 'agent-ae624896759b58fd7.jsonl'), readFileSync(MAU_0710, 'utf8').split(GOC_0710).join(d));
    },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].id === 'agent-ae624896759b58fd7' && g.tac_tu[0].cong_cu.includes('Write') && g.tac_tu[0].cong_cu.includes('Bash:git commit')
      && JSON.stringify(g.tac_tu[0].tep) === JSON.stringify(['tests/scripts/luot-sua-giu-du-dem-dung.test.mjs', 'tests/scripts/thuoc-vat-merge-detailed.test.mjs']) && !g.tep_khong_ro.length },
  { n: 3, ten: 'sed -i qua Bash', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 's1', 'machine:npm test', [['Bash', { command: "sed -i '' 's/a/b/' src/a.js" }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && JSON.stringify(g.tac_tu[0].cong_cu) === '["Bash:sed -i"]' && !g.tep_khong_ro.length },
  { n: 4, ten: 'phien tu sua', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'p1', 'machine:npm test', [['Bash', { command: 'npm test' }]], { root: d }); },
    mong: g => !g.tac_tu.length && JSON.stringify(g.tep_khong_ro) === '["src/a.js"]' && !('khong_doc_duoc' in g) },
  { n: 5, ten: 'khong transcript', khongTranscript: true, tiem: d => A(d, 'src/a.js'),
    mong: g => !g.tac_tu.length && typeof g.khong_doc_duoc === 'string' && g.khong_doc_duoc.length > 0 && g.hoan_lai === false },
  { n: 6, ten: 'tu tim qua HOME gia', tuTim: 'cung', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'e6', 'machine:npm test', [['Edit', { file_path: path.join(d, 'src/a.js'), old_string: 'a', new_string: 'b' }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].id === 'agent-e6' && !g.tep_khong_ro.length },
  { n: 7, ten: 'tac tu chi cat', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'c1', 'machine:npm test', [['Bash', { command: 'cat src/a.js 2>/dev/null' }]], { root: d }); },
    mong: g => !g.tac_tu.length && JSON.stringify(g.tep_khong_ro) === '["src/a.js"]' },
  { n: 8, ten: 'cd roi sed -i ten tran', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'cd1', 'machine:npm test', [['Bash', { command: "cd src && sed -i '' 's/a/b/' a.js" }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].id === 'agent-cd1' && !g.tep_khong_ro.length },
  { n: 9, ten: 'git -C . commit', tiem: (d, wf) => { A(d, 'src/a.js'); commit(d, ['src/a.js']); tacTu(wf, 'gc1', 'machine:npm test', [['Bash', { command: 'git -C . add src/a.js && git -C . commit -m sua' }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].cong_cu.includes('Bash:git commit') && !g.tep_khong_ro.length },
  { n: 10, ten: 'tu tim khi thu muc du an ma hoa khac --root', tuTim: 'khac', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'e10', 'machine:npm test', [['Edit', { file_path: path.join(d, 'src/a.js'), old_string: 'a', new_string: 'b' }]], { root: d }); },
    mong: g => g.tac_tu.length === 1 && g.tac_tu[0].id === 'agent-e10' },
  { n: 11, ten: 'cp tep la NGUON', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'cp1', 'review:bugs', [['Bash', { command: 'cp src/a.js /tmp/ban-sao-a.js' }]], { root: d }); },
    mong: g => !g.tac_tu.length && JSON.stringify(g.tep_khong_ro) === '["src/a.js"]' },
  { n: 12, ten: 'git diff --merge-base va git log chi doc', tiem: (d, wf) => { A(d, 'src/a.js'); tacTu(wf, 'gd1', 'refute:a.js', [['Bash', { command: 'git diff --merge-base main -- src/a.js' }], ['Bash', { command: 'git log --oneline -- src/a.js' }]], { root: d }); },
    mong: g => !g.tac_tu.length && JSON.stringify(g.tep_khong_ro) === '["src/a.js"]' },
  { n: 13, ten: 'git cat-file commit khong phai commit', tiem: (d, wf) => { A(d, 'src/a.js'); commit(d, ['src/a.js']); tacTu(wf, 'cf1', 'capture:provenance', [['Bash', { command: 'git cat-file commit HEAD' }]], { root: d }); },
    mong: g => !g.tac_tu.length && JSON.stringify(g.tep_khong_ro) === '["src/a.js"]' },
];
if (want('AT5')) {
  let K; try { K = khoaKhuon(); } catch (e) { bad('AT5', loi(e)); }
  let saiNhom = 0;
  for (const h of K ? HANG_AT5 : []) {
    const ten = `AT5 hang ${h.n}`;
    try {
      const { d } = await hoSo();
      const home = HOME_RONG();
      let wf = null;
      if (h.tuTim) {
        const ma = h.tuTim === 'cung' ? d.replace(/[^A-Za-z0-9]/g, '-') : '-Users-ai-do-thu-muc-khac';
        wf = wfDir(path.join(home, '.claude', 'projects', ma, 'sess-1', 'subagents', 'workflows'), 'wf_tu_tim');
      } else if (!h.khongTranscript) wf = wfDir(mkdtempSync(path.join(TMP, 'tr-')));
      h.tiem(d, wf);
      if (wf) { const t = new Date(Date.now() + 2000); utimesSync(path.join(wf, 'journal.jsonl'), t, t); }
      const r = sauLuot(d, { transcript: wf && !h.tuTim ? [wf] : [], home });
      const { sai, g } = kiemChung(d, r, K, { ma: h.ma || 6 });
      if (!sai.length && !h.mong(g)) sai.push(`dong ${JSON.stringify(g)}`);
      if (sai.length) { saiNhom += 1; bad(ten, `${h.ten}: ${sai.join(' ; ')}`); } else ok(ten, `— ${h.ten}`);
    } catch (e) { saiNhom += 1; bad(ten, loi(e)); }
  }
  if (K && !saiNhom) ok('AT5', `— ${HANG_AT5.length}/${HANG_AT5.length} hàng: đúng một dòng ghi-boi sau mỗi dòng cay-doi, quy đúng tác tử`);
}

// ── AT6 — tự hoàn lại ──────────────────────────────────────────────────────
const editA = (d, wf, id = 'h1') => { A(d, 'src/a.js'); tacTu(wf, id, 'machine:npm test', [['Edit', { file_path: path.join(d, 'src/a.js'), old_string: 'a', new_string: 'b' }], ['Bash', { command: 'git add src/a.js && git commit -m sua' }]], { root: d }); };
const HANG_AT6 = [
  { ten: 'AT6 da day', mo: 'commit da day len nhanh xa', tiem: (d, wf) => {
      editA(d, wf); commit(d, ['src/a.js']);
      const xa = mkdtempSync(path.join(TMP, 'xa-')); git(xa, 'init', '-q', '--bare'); git(d, 'remote', 'add', 'origin', xa); git(d, 'push', '-q', 'origin', 'HEAD:refs/heads/vong');
      git(d, 'fetch', '-q', 'origin');
    } },
  { ten: 'AT6 ban san', mo: 'tep ban san truoc luot bi ghi de: src/a.js', truoc: d => A(d, 'src/a.js', '// phien dang sua\n'), tiem: (d, wf) => editA(d, wf) },
  { ten: 'AT6 lan phien', mo: 'co tep khong ro chu: src/b.js', tiem: (d, wf) => { editA(d, wf); commit(d, ['src/a.js']); A(d, 'src/b.js'); } },
  { ten: 'AT6 chua commit', mo: 'co tep doi chua commit: src/a.js', tiem: (d, wf) => editA(d, wf) },
  { ten: 'AT6 mat to tien', mo: 'HEAD khong con sha da cham lam to tien', tiem: (d, wf) => { git(d, 'reset', '-q', '--hard', 'HEAD~1'); tacTu(wf, 'r1', 'machine:npm test', [['Bash', { command: 'git reset --hard HEAD~1' }]], { root: d }); } },
];
if (want('AT6')) {
  let K; try { K = khoaKhuon(); } catch (e) { bad('AT6', loi(e)); }
  let saiNhom = 0;
  // Ca an toàn: commit chưa đẩy + sửa đĩa, tệp sạch lúc chụp, cộng một tệp mới tác tử tạo.
  if (K) {
    try {
      const { d, a } = await hoSo();
      const wf = wfDir(mkdtempSync(path.join(TMP, 'tr-')));
      editA(d, wf); commit(d, ['src/a.js']);
      A(d, 'src/b.js'); commit(d, ['src/b.js']);
      tacTu(wf, 'h2', 'machine:npm run build', [['Bash', { command: "sed -i '' 's/b/c/' src/b.js && git -C . commit -am sua-b" }]], { root: d });
      W(d, 'tmp/out.txt', 'o\n');
      const r = sauLuot(d, { transcript: [wf] });
      const { sai, g } = kiemChung(d, r, K);
      if (g.hoan_lai !== true) sai.push(`hoan_lai ${g.hoan_lai}: ${g.ly_do}`);
      if (git(d, 'rev-parse', 'HEAD') !== a.invokedSha) sai.push('HEAD != sha da cham sau hoan lai');
      if (git(d, 'status', '--porcelain', '--', 'src')) sai.push(`src con ban: ${git(d, 'status', '--porcelain', '--', 'src')}`);
      if (!String(r.stderr).includes('da hoan lai')) sai.push('thieu thong diep «da hoan lai»');
      await new Promise(res => setTimeout(res, 1100));
      const r2 = sinhArgs(d);
      if (r2.status !== 0) sai.push(`AT6 cung round: s4-args luot ke thoat ${r2.status}: ${String(r2.stderr).split('\n').slice(-2).join(' | ')}`);
      else if (docArgs(d).round !== a.round) sai.push(`AT6 cung round: round ${docArgs(d).round}, mong ${a.round}`);
      if (sai.length) { saiNhom += 1; for (const s of sai) bad(s.startsWith('AT6 cung round') ? 'AT6 cung round' : 'AT6 an toan', s); }
      else ok('AT6 an toan', '— hoàn lại về đúng sha, lượt kế thoát 0 cùng round');
    } catch (e) { saiNhom += 1; bad('AT6 an toan', loi(e)); }
  }
  for (const h of K ? HANG_AT6 : []) {
    try {
      const { d } = await hoSo(h.truoc || (() => {}));
      const wf = wfDir(mkdtempSync(path.join(TMP, 'tr-')));
      h.tiem(d, wf);
      const ngoaiHoSo = () => git(d, 'status', '--porcelain', '--', '.', `:(exclude)_acceptance/${SLUG}`);
      const headTruoc = git(d, 'rev-parse', 'HEAD'); const stTruoc = ngoaiHoSo();
      const r = sauLuot(d, { transcript: [wf] });
      const { sai, g } = kiemChung(d, r, K);
      if (g.hoan_lai !== false || !String(g.ly_do || '').startsWith(h.mo)) sai.push(`hoan_lai ${g.hoan_lai}, ly_do «${g.ly_do}», mong «${h.mo}…»`);
      if (git(d, 'rev-parse', 'HEAD') !== headTruoc || ngoaiHoSo() !== stTruoc) sai.push('cay bi dong vao du khong an toan');
      if (sai.length) { saiNhom += 1; bad(h.ten, sai.join(' ; ')); } else ok(h.ten, `— không hoàn lại: ${h.mo}`);
    } catch (e) { saiNhom += 1; bad(h.ten, loi(e)); }
  }
  if (K && !saiNhom) ok('AT6', '— ca an toàn (chỉ commit) tự lành cùng round; năm ca không an toàn để nguyên cây');
}

console.log(`\nResults: ${pass} passed, ${fail} failed (ghi-boi-tac-tu-cham)`);
if (fail > 0) process.exit(1);
