// lmtl-the.test.mjs — hồ sơ loi-moi-tran-luot-loi-song-co-gia: khối «Lối ra» trên thẻ Cổng Bằng
// chứng CHƯA-ký-được (AC-1…AC-9). Sổ chạy của fixture do CHÍNH bộ chấm sinh (harness
// tests/workflows chạy acceptance-verify.js với tác tử giả, ta ghi nguyên `result.runLog`); dòng
// `thuoc-vat` do thuoc-vat.mjs --write THẬT ghi trên kho git code sinh. Mỗi ca là một hàm nhận
// đường gate-card.js và trả danh sách sai, nên cùng ca chạy được trên cây thật (đối chứng dương)
// và trên bản sao `scripts lib skills` đã tiêm một đột biến (chiều đỏ — design doc §5).
// Bản thẻ «trước vòng» lấy trọn `scripts lib skills` bằng `git archive` ở cha của commit đầu đưa
// chuỗi `loi-ra-tran-luot` vào scripts/gate-card.js — sha là đầu ra lệnh; không tìm ra → ca đỏ có tên.
// Chọn ca: LMTL_CASES=<tên,…>; ca được gọi tên mà không in PASS/FAIL → «ca không chạy», thoát 1.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow } from '../workflows/harness.mjs';
import { dungKho, SLUG as SLUG_TV } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const MOD_REL = path.join('scripts', 'loi-ra-tran-luot.cjs');
const SKILL = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const LRM = createRequire(import.meta.url)(path.join(KIT, MOD_REL));
const TMP = mkdtempSync(path.join(tmpdir(), 'lmtl-'));
const SLUG = 's';

let pass = 0; let fail = 0; const daIn = new Set();
const ok = (name, msg = '') => { pass += 1; daIn.add(name); console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; daIn.add(name); console.log(`FAIL: ${name} — ${msg}`); };
const CHON = process.env.LMTL_CASES ? process.env.LMTL_CASES.split(',').map(s => s.trim()).filter(Boolean) : null;
const want = name => !CHON || CHON.includes(name);
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ONE_SHOT_SIGNOFF = (() => { const m = readFileSync(GC, 'utf8').match(/const ONE_SHOT_CMD_SIGNOFF = '([^']+)'/); if (!m) throw new Error('khong rut duoc ONE_SHOT_CMD_SIGNOFF'); return m[1]; })();

// ── bộ chấm thật với tác tử giả ────────────────────────────────────────────
const EVALS = ['E1', 'E2', 'E3'].map((id, i) => ({ id, criterion: `AC-${i + 1}`, executor: 'script', cmd: `cmd-e${i + 1}`, ref: `config:executors.script.e${i + 1}`, expected: 'x' }));
const DAT = { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false };
const DO = (c = 1) => ({ exitCode: c, outputTail: 'fail', runId: '', cannotRun: false });
const KHONG_CHAY = { exitCode: 0, outputTail: '', runId: '', cannotRun: true, reason: 'lenh dai qua' };
const NGAT = { exitCode: 1, outputTail: '', runId: '', cannotRun: false, killedByTool: true };
const CHET = () => null;
async function cham(round, tra = {}, over = {}) {
  const args = { slug: SLUG, round, riskTier: 'T2', evals: EVALS, suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md', invokedAt: `2026-10-0${round}T10:00:00Z`, ...over };
  const r = await runWorkflow(WF, args, call => {
    const l = call.label;
    for (const k of Object.keys(tra)) if (l === `machine:${k}`) { const v = tra[k]; return typeof v === 'function' ? v(call) : v; }
    if (l.startsWith('machine:')) return DAT;
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  });
  return r.result;
}

// ── hồ sơ fixture ───────────────────────────────────────────────────────────
const EVALS_YAML = (extra = {}) => `schema_version: 1\nfeature_slug: ${SLUG}\nevals:\n` + EVALS.map(e =>
  `  - id: ${e.id}\n    criterion: ${e.criterion}\n    executor: script\n    cmd: ${e.ref}\n${extra[e.id] || ''}    expected: x\n`).join('');
function hoSo({ verdict, runLog, evalsYaml = EVALS_YAML() }) {
  const d = mkdtempSync(path.join(TMP, 'hs-'));
  const ws = path.join(d, '_acceptance', SLUG);
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    e1: "true"\n    e2: "true"\n    e3: "true"\n');
  writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: Tinh nang mau\nslug: ${SLUG}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: verified\napproved_by: T\napproved_at: 2026-10-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n- AC-2: Given d, When e, Then f.\n- AC-3: Given g, When h, Then i.\n`);
  writeFileSync(path.join(ws, 'evals.yaml'), evalsYaml);
  const v2 = verdict === 'PASS' || verdict === 'PENDING-JUDGMENT' ? 'PASS' : verdict === 'REJECT' ? 'FAIL' : 'BLOCKED';
  writeFileSync(path.join(ws, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: ${SLUG}\nverdict: ${verdict}\nreason: ${verdict === 'BLOCKED' ? 'xem so chay' : ''}\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff:\n---\n\n# Evidence Report: ${SLUG}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n| E2 | AC-2 | script | ${v2} |\n| E3 | AC-3 | script | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: run-e1-1\n  exit_code: 0\n  verifier: config:executors.script.e1\n  verified_at: 2026-10-01T10:00:00Z\n\n## Known limits\n\n## Ngoài hợp đồng\n\n## Iterations\n\nRound 1: xem so chay.\n`);
  if (runLog !== null) writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.map(x => x + '\n').join(''));
  return d;
}
const the = (d, gc = GC) => {
  const h = spawnSync(process.execPath, [gc, '--root', d, '--slug', SLUG], { encoding: 'utf8' });
  const x = spawnSync(process.execPath, [gc, '--root', d, '--slug', SLUG, '--extract'], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(x.stdout); } catch (_) { /* lỗi */ }
  return { html: h.stdout, st: h.status, stx: x.status, err: h.stderr + x.stderr, j, raw: x.stdout };
};
const boTally = log => log.filter(l => !/"kind":"round-tally"/.test(l));
const lapIds = t => ((t.j && t.j.loi_ra && t.j.loi_ra.lap) || []).map(x => x.evalId);

// ── nhật ký dùng chung (sinh MỘT lần, bộ chấm thật) ─────────────────────────
const LOG = {};
async function dung() {
  const nhat = async (round, tra, over) => (await cham(round, tra, over)).runLog;
  LOG.lap = [...await nhat(1, { 'cmd-e2': KHONG_CHAY }), ...await nhat(2, { 'cmd-e2': DO(1) })];
  LOG.ngat = [...await nhat(1, { 'cmd-e2': NGAT }), ...await nhat(2, { 'cmd-e2': DO(1) })];
  LOG.ma2 = [...await nhat(1, { 'cmd-e2': DO(2) }), ...await nhat(2, { 'cmd-e2': DO(2) })];
  LOG.khai = [...await nhat(1, { 'cmd-e2': DO(2), 'cmd-e3': DAT }), ...await nhat(2, { 'cmd-e2': DO(2), 'cmd-e3': DO(1) })];
  LOG.thuLai = [...await nhat(1, { 'cmd-e2': DO(1) }), ...await nhat(2, { 'cmd-e2': DO(1) }), ...await nhat(2, { 'cmd-e2': DAT, 'cmd-e3': DO(1) })];
  LOG.suite = [...await nhat(1, { 'npm run build': DO(1) }), ...await nhat(2, { 'npm run build': DO(1) })];
  const r2 = await nhat(2, { 'cmd-e1': DO(1) });
  LOG.cut = [...await nhat(1, { 'cmd-e2': KHONG_CHAY }), ...r2.filter(l => !/"evalId":"E2"/.test(l))];
  LOG.blocked = [...await nhat(1, { 'cmd-e2': DO(1) }), ...await nhat(2, {}, { evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', ref: 'config:executors.script.e1', expected: 'x' }] })];
  LOG.tran = [...await nhat(1, { 'cmd-e1': DO(1) }), ...await nhat(2, { 'cmd-e2': DO(1) }), ...await nhat(3, { 'cmd-e3': DO(1) })];
  LOG.r1 = await nhat(1, { 'cmd-e2': DO(1) });
  LOG.r2khac = [...await nhat(1, { 'cmd-e1': DO(1) }), ...await nhat(2, { 'cmd-e2': DO(1) })];
  LOG.nayDat = [...await nhat(1, { 'cmd-e2': DO(1) }), ...await nhat(2, { 'cmd-e3': DO(1) })];
  LOG.pass = await nhat(1, {});
  LOG.mu = [...await nhat(1, { 'cmd-e2': DO(1) }), ...await nhat(2, { 'cmd-e2': DO(127) })];
  LOG.chet = [...await nhat(1, { 'cmd-e2': DO(1) }), ...await nhat(2, { 'cmd-e2': CHET })];
  const tv = await dungPhut();
  LOG.phut = tv.log; LOG.phutInvoked = tv.invoked;
}
// AC-5: hai lượt chấm thật trên kho git code sinh; mỗi lượt xong thì thuoc-vat --write THẬT ghi dòng.
async function dungPhut() {
  const { d } = dungKho(mkdtempSync(path.join(TMP, 'kho-')), ['vat', 'implemented']);
  const rl = path.join(d, '_acceptance', SLUG_TV, 'run-log.jsonl');
  const invoked = {};
  for (const [round, truoc] of [[1, 20], [2, 7]]) {
    invoked[round] = new Date(Date.now() - truoc * 60000).toISOString().slice(0, 19) + 'Z';
    const r = await cham(round, { 'cmd-e2': DO(1) }, { invokedAt: invoked[round] });
    appendFileSync(rl, r.runLog.map(x => x + '\n').join(''));
    const w = spawnSync(process.execPath, [path.join(KIT, 'feature-loop/scripts/thuoc-vat.mjs'), '--root', d, '--slug', SLUG_TV, '--ag-root', KIT, '--write'], { encoding: 'utf8' });
    if (w.status !== 0) throw new Error(`thuoc-vat --write thoat ${w.status}: ${w.stderr.split('\n')[0]}`);
  }
  return { log: readFileSync(rl, 'utf8').split('\n').filter(Boolean), invoked };
}

// ── ca: mỗi hàm (gc) → danh sách sai ────────────────────────────────────────
const CA = {};
CA['LT-AC1-lap'] = async gc => {
  const sai = []; const H = [
    ['1 cannot_run roi ma 1', LOG.lap, {}, t => (lapIds(t).join() === 'E2' && JSON.stringify(t.j.loi_ra.lap[0].luot) === '[1,2]' && t.j.loi_ra.lap[0].ac === 'AC-2' && t.html.includes(escH('E2 (AC-2) chưa đạt ở lượt 1, 2'))) || `lap=${JSON.stringify(t.j && t.j.loi_ra && t.j.loi_ra.lap)}`],
    ['2 bi cong cu ngat', LOG.ngat, {}, t => lapIds(t).join() === 'E2' || `lap=${lapIds(t)}`],
    ['3 ma 2 khong khai', LOG.ma2, {}, t => lapIds(t).join() === 'E2' || `lap=${lapIds(t)}`],
    ['4 ma dung expected_exit la dat', LOG.khai, { E2: '    expected_exit: 2\n' }, t => !lapIds(t).includes('E2') || 'E2 khai ma 2 van vao lap'],
    ['5 thu lai cung round dong cuoi thang', LOG.thuLai, {}, t => !lapIds(t).includes('E2') || 'dong cuoi dat ma E2 van lap'],
    ['6 SUITE khong vao lap', LOG.suite, {}, t => !lapIds(t).some(x => x.startsWith('SUITE-')) || `lap=${lapIds(t)}`],
    ['7 luot tuan tu khong tally', boTally(LOG.lap), {}, t => lapIds(t).join() === 'E2' || `lap=${lapIds(t)}`],
    ['8 luot cuoi cut', LOG.cut, {}, t => (lapIds(t).join() === 'E2' && t.j.loi_ra.lap[0].vang === 2 && t.html.includes('không có dòng ở lượt 2')) || `lap=${JSON.stringify(t.j && t.j.loi_ra && t.j.loi_ra.lap)}`],
    ['9 luot cuoi BLOCKED', LOG.blocked, {}, t => (lapIds(t).join() === 'E2' && t.html.includes(LRM.TEN_KHOI)) || `lap=${lapIds(t)}`],
  ];
  let n = 0;
  for (const [ten, log, extra, kiem] of H) {
    n += 1;
    const vd = ten.startsWith('9') ? 'BLOCKED' : 'REJECT';
    const t = the(hoSo({ verdict: vd, runLog: log, evalsYaml: EVALS_YAML(extra) }), gc);
    if (t.st !== 0 || !t.j) { sai.push(`${ten}: the thoat ${t.st} ${t.err.split('\n')[0]}`); continue; }
    if (t.j.approvable !== false) { sai.push(`${ten}: tien de hong — the ky duoc`); continue; }
    const k = kiem(t); if (k !== true) sai.push(`${ten}: ${k}`);
  }
  if (n !== H.length) sai.push(`so hang ${n}/${H.length}`);
  return sai;
};
CA['LT-AC1-tuan-tu'] = async gc => { const t = the(hoSo({ verdict: 'REJECT', runLog: boTally(LOG.lap) }), gc); return lapIds(t).join() === 'E2' ? [] : [`lap=${lapIds(t)}`]; };
CA['LT-AC1-blocked'] = async gc => { const t = the(hoSo({ verdict: 'BLOCKED', runLog: LOG.blocked }), gc); return t.j && t.j.loi_ra && t.html.includes(LRM.TEN_KHOI) ? [] : ['BLOCKED luot cuoi khong co khoi']; };
CA['LT-AC2-tran'] = async gc => {
  const t = the(hoSo({ verdict: 'REJECT', runLog: LOG.tran }), gc); const lr = t.j && t.j.loi_ra;
  if (!lr) return ['3 luot khong lap ma khong co khoi'];
  const s = [];
  if (lr.tran !== true) s.push(`tran=${lr.tran}`);
  if (lr.lap.length) s.push(`lap khong rong: ${lapIds(t)}`);
  const ln = lr.loi.find(l => l.ma === 'luot-nua');
  if (!ln || !ln.ten.includes(`vượt trần ${LRM.TRAN_LUOT} lượt`)) s.push('loi luot-nua thieu «vượt trần»');
  if (!t.html.includes(LRM.TEN_KHOI)) s.push('HTML thieu khoi');
  return s;
};
CA['LT-AC4-khuyen-nghi'] = async gc => {
  const s = [];
  const a = the(hoSo({ verdict: 'REJECT', runLog: LOG.lap }), gc).j; const b = the(hoSo({ verdict: 'REJECT', runLog: LOG.tran }), gc);
  if (!a || !a.loi_ra || a.loi_ra.khuyen_nghi.ma !== 'thu-pham-vi') s.push(`co lap: khuyen ${a && a.loi_ra && a.loi_ra.khuyen_nghi.ma}`);
  else if (!a.loi_ra.loi[0].ten.includes('AC-2')) s.push('ten loi thu-pham-vi khong goi AC-2');
  if (!b.j || !b.j.loi_ra || b.j.loi_ra.khuyen_nghi.ma !== 'luot-nua') s.push(`khong lap: khuyen ${b.j && b.j.loi_ra && b.j.loi_ra.khuyen_nghi.ma}`);
  else if (!b.j.loi_ra.khuyen_nghi.vi_sao || !b.html.includes(escH(b.j.loi_ra.khuyen_nghi.vi_sao))) s.push('vi_sao rong hoac khong tren HTML');
  return s;
};
CA['LT-AC7-mot-nguon'] = async gc => {
  const t = the(hoSo({ verdict: 'REJECT', runLog: LOG.lap }), gc); const lr = t.j && t.j.loi_ra;
  if (!lr) return ['khong co loi_ra'];
  const chuoi = [...lr.loi.flatMap(l => [l.ten, l.gia]), lr.khuyen_nghi.vi_sao, lr.khong_ky, ...lr.lap.map(x => x.cau), ...lr.canh_bao];
  const thieu = chuoi.filter(c => !t.html.includes(escH(c)));
  const mong = lr.loi.length * 2 + 2 + lr.lap.length + lr.canh_bao.length;
  if (chuoi.length !== mong) return [`so chuoi ${chuoi.length}/${mong}`];
  return thieu.length ? [`HTML thieu ${thieu.length}/${chuoi.length}: ${thieu[0]}`] : [];
};
CA['LT-AC5-phut'] = async gc => {
  const s = [];
  const tally = LOG.phut.map(l => JSON.parse(l)).filter(o => o.kind === 'round-tally');
  const tv = LOG.phut.map(l => JSON.parse(l)).filter(o => o.kind === 'thuoc-vat');
  if (tally.length !== 2 || tv.length !== 2) return [`so dong tally ${tally.length} thuoc-vat ${tv.length}, mong 2/2`];
  for (const o of [...tally, ...tv]) if (typeof o[LRM.TRUONG_GIO] !== 'string') s.push(`dong ${o.kind} r${o.round} thieu truong ${LRM.TRUONG_GIO}`);
  for (const o of tally) if (o[LRM.TRUONG_GIO] !== LOG.phutInvoked[o.round]) s.push(`tally r${o.round} ${LRM.TRUONG_GIO}=${o[LRM.TRUONG_GIO]} != invokedAt ${LOG.phutInvoked[o.round]}`);
  if (s.length) return s;
  const t = the(hoSo({ verdict: 'REJECT', runLog: LOG.phut }), gc); const lr = t.j && t.j.loi_ra;
  if (!lr) return ['khong co loi_ra'];
  const p2 = (lr.luot.find(x => x.round === 2) || {}).phut;
  if (![7, 8].includes(p2)) s.push(`phut luot 2 = ${p2}, mong 7 hoac 8`);
  const gia = lr.loi.find(l => l.ma === 'luot-nua').gia;
  if (!gia.includes(`khoảng ${p2} phút máy (lượt 2 đo được)`)) s.push(`gia luot-nua: ${gia}`);
  return s;
};
CA['LT-AC5-chua-do'] = async gc => {
  const log = LOG.phut.filter(l => !/"kind":"thuoc-vat"/.test(l));
  const t = the(hoSo({ verdict: 'REJECT', runLog: log }), gc); const lr = t.j && t.j.loi_ra;
  if (!lr) return ['khong co loi_ra'];
  const s = [];
  if (lr.luot.some(x => x.phut !== null)) s.push(`phut khong null: ${JSON.stringify(lr.luot.map(x => x.phut))}`);
  if (!lr.loi.find(l => l.ma === 'luot-nua').gia.includes('phút máy: chưa đo')) s.push('gia khong noi «chưa đo»');
  if (t.html.includes('0 phút')) s.push('HTML in «0 phút»');
  if (!t.html.includes('chưa đo')) s.push('HTML thieu «chưa đo»');
  return s;
};
CA['LT-AC9-so-hong'] = async gc => {
  const s = []; let n = 0;
  const H = [
    ['dong hong + thieu round', () => hoSo({ verdict: 'REJECT', runLog: [...LOG.lap, 'khong phai json {', '{"evalId":"E2","exit_code":1}'] }), t => lapIds(t).join() === 'E2' || `lap=${lapIds(t)}`],
    ['so vang', () => hoSo({ verdict: 'REJECT', runLog: null }), t => !t.j.loi_ra || 'co loi_ra'],
    ['chi dong hong', () => hoSo({ verdict: 'REJECT', runLog: ['khong phai json', '{"round":"1","evalId":"E2","exit_code":1}', '{"round":null,"kind":"round-tally"}'] }), t => !t.j.loi_ra || 'co loi_ra'],
    ['evals.yaml hong', () => hoSo({ verdict: 'REJECT', runLog: LOG.lap, evalsYaml: 'evals: [[[\n' }), t => (lapIds(t).join() === 'E2' && t.j.loi_ra.canh_bao.includes(LRM.CANH_BAO_EVALS) && t.html.includes(escH(LRM.CANH_BAO_EVALS))) || `lap=${lapIds(t)} canh_bao=${JSON.stringify(t.j.loi_ra && t.j.loi_ra.canh_bao)}`],
  ];
  for (const [ten, mk, kiem] of H) {
    n += 1;
    const t = the(mk(), gc);
    if (t.st !== 0 || t.stx !== 0 || !t.j) { s.push(`${ten}: the thoat ${t.st}/${t.stx} ${t.err.split('\n')[0]}`); continue; }
    const k = kiem(t); if (k !== true) s.push(`${ten}: ${k}`);
  }
  if (n !== H.length) s.push(`so hang ${n}/${H.length}`);
  return s;
};
CA['LT-AC3-khong-ky'] = async gc => {
  const s = []; let n = 0;
  const KHONG = [['PASS', 'PASS', LOG.pass], ['PENDING-JUDGMENT', 'PENDING-JUDGMENT', LOG.pass], ['BLOCKED canh mu', 'BLOCKED', LOG.mu], ['chet lan dau', 'BLOCKED', LOG.chet]];
  const CO = [['REJECT co lap', 'REJECT', LOG.lap], ['REJECT o tran', 'REJECT', LOG.tran]];
  for (const [ten, vd, log] of KHONG) {
    n += 1; const t = the(hoSo({ verdict: vd, runLog: log }), gc);
    if (!t.j) { s.push(`${ten}: extract loi`); continue; }
    if (ten !== 'chet lan dau' && t.j.approvable !== true) s.push(`${ten}: tien de hong — the khong ky duoc`);
    if (ten === 'chet lan dau' && (t.j.canh_gay || {}).trangThai !== 'chet-lan-dau') s.push(`${ten}: tien de hong — trangThai ${(t.j.canh_gay || {}).trangThai}`);
    if ('loi_ra' in t.j) s.push(`${ten}: co khoa loi_ra`);
    if (t.html.includes(LRM.TEN_KHOI)) s.push(`${ten}: HTML co «${LRM.TEN_KHOI}»`);
  }
  for (const [ten, vd, log] of CO) {
    n += 1; const t = the(hoSo({ verdict: vd, runLog: log }), gc); const lr = t.j && t.j.loi_ra;
    if (!lr) { s.push(`${ten}: khong co loi_ra`); continue; }
    if (JSON.stringify(lr.loi.map(l => l.ma)) !== '["thu-pham-vi","luot-nua","dung"]') s.push(`${ten}: ma loi ${lr.loi.map(l => l.ma)}`);
    if (!t.html.includes('Không có lối ký')) s.push(`${ten}: HTML thieu «Không có lối ký»`);
    if (t.html.includes(ONE_SHOT_SIGNOFF) || t.j.one_shot !== null) s.push(`${ten}: van moi ky`);
  }
  if (n !== KHONG.length + CO.length) s.push(`so hang ${n}/6`);
  return s;
};
const TRUOC = (() => {
  try {
    const shas = git(KIT, 'log', '--format=%H', '--reverse', '-S', 'loi-ra-tran-luot', '--', 'scripts/gate-card.js').split('\n').filter(Boolean);
    if (!shas.length) return { loi: 'khong tim thay commit dua loi-ra-tran-luot vao scripts/gate-card.js' };
    const d = mkdtempSync(path.join(TMP, 'truoc-'));
    const tar = execFileSync('git', ['-C', KIT, 'archive', `${shas[0]}^`, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
    return { gc: path.join(d, 'scripts', 'gate-card.js'), sha: shas[0] };
  } catch (e) { return { loi: loi(e) }; }
})();
CA['LT-AC6-im'] = async gc => {
  if (TRUOC.loi) return [TRUOC.loi];
  const s = []; let n = 0;
  const H = [['REJECT luot 1', 'REJECT', LOG.r1], ['REJECT luot 2 khong lap', 'REJECT', LOG.r2khac], ['tung chua dat nay dat', 'REJECT', LOG.nayDat], ['PASS', 'PASS', LOG.pass], ['BLOCKED canh mu', 'BLOCKED', LOG.mu]];
  for (const [ten, vd, log] of H) {
    n += 1; const d = hoSo({ verdict: vd, runLog: log });
    const moi = the(d, gc); const cu = the(d, TRUOC.gc);
    if (!moi.j) { s.push(`${ten}: extract loi`); continue; }
    if ('loi_ra' in moi.j) s.push(`${ten}: co khoa loi_ra`);
    if (moi.html !== cu.html) s.push(`${ten}: HTML khac ban truoc vong`);
    if (moi.raw !== cu.raw) s.push(`${ten}: --extract khac ban truoc vong`);
  }
  if (n !== H.length) s.push(`so hang ${n}/${H.length}`);
  return s;
};
// AC-8: khối chỉ dẫn của SKILL rút từ marker, so với hằng do mô-đun xuất (rút từ bên viết).
const kiemSkill = txt => {
  const m = txt.match(/<!-- <<<TRAN-LUOT-LOI-RA -->([\s\S]*?)<!-- TRAN-LUOT-LOI-RA>>> -->/);
  if (!m) return ['SKILL thieu khoi marker TRAN-LUOT-LOI-RA'];
  const k = m[1]; const s = [];
  if (!k.includes(`«${LRM.TEN_KHOI}»`)) s.push(`khoi khong goi ten «${LRM.TEN_KHOI}»`);
  if (!k.includes('dừng-vá')) s.push('khoi khong noi «dừng-vá»');
  if (!k.includes('không mời ký')) s.push('khoi khong co cau «không mời ký»');
  const t = txt.match(/Tối đa (\d+) round/);
  if (!t || Number(t[1]) !== LRM.TRAN_LUOT) s.push(`«Tối đa … round» = ${t && t[1]}, TRAN_LUOT = ${LRM.TRAN_LUOT}`);
  return s;
};
CA['LT-AC8-skill'] = async () => {
  const txt = readFileSync(SKILL, 'utf8'); const s = kiemSkill(txt);
  const go = txt.replace(/<!-- <<<TRAN-LUOT-LOI-RA -->[\s\S]*?<!-- TRAN-LUOT-LOI-RA>>> -->/, '');
  const d = kiemSkill(go);
  if (go === txt) s.push('chieu do: khong go duoc khoi (khoi vang)');
  else if (!d.some(x => x.includes('TRAN-LUOT-LOI-RA'))) s.push(`chieu do: go khoi ma ham kiem tra ${JSON.stringify(d)}`);
  return s;
};

// ── đột biến: bản sao scripts lib skills, thay nguyên văn ĐÚNG MỘT chỗ trong mô-đun ────────
const DOT_BIEN = [
  ['tat-khoi', 'if (!tran && !lap.length) return null;', 'return null;', 'LT-AC1-lap', '1 cannot_run'],
  ['them-loi-ky', "{ ma: 'dung',", "{ ma: 'ky', ten: 'ký luôn', gia: 'không' }, { ma: 'dung',", 'LT-AC3-khong-ky', 'REJECT co lap: ma loi'],
  ['phut-ve-0', 'if (!a || !b) return null;', 'if (!a || !b) return 0;', 'LT-AC5-chua-do', 'phut khong null'],
  ['lap-moi-luot', 'if (m.has(cuoi)) { if (!m.get(cuoi)) continue; } else vang = cuoi;', 'if (m.has(cuoi)) { /* bo */ } else vang = cuoi;', 'LT-AC6-im', 'tung chua dat nay dat'],
  ['bo-expected-exit', 'return !(k != null && String(k) === String(c));', 'return true;', 'LT-AC1-lap', '4 ma dung expected_exit'],
  ['bo-loc-id', "return !o.evalId.startsWith('SUITE-') && (evalMeta === null || coKhoa(evalMeta, o.evalId));", 'return true;', 'LT-AC1-lap', '6 SUITE'],
  ['nuot-evals-hong', 'if (evalMeta === null) canhBao.push(CANH_BAO_EVALS);', '', 'LT-AC9-so-hong', 'evals.yaml hong'],
];
async function dotBien([ten, tim, thay, ca, hang]) {
  const goc = readFileSync(path.join(KIT, MOD_REL), 'utf8');
  const so = goc.split(tim).length - 1;
  if (so !== 1) return `mui tiem khop ${so} cho, mong 1`;
  const d = mkdtempSync(path.join(TMP, `db-${ten}-`));
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true });
  const moi = goc.replace(tim, thay);
  if (moi === goc) return 'ban sao khong khac ban that';
  writeFileSync(path.join(d, MOD_REL), moi);
  const sai = await CA[ca](path.join(d, 'scripts', 'gate-card.js'));
  if (!sai.length) return `${ca} van xanh tren ban dot bien`;
  return sai.some(x => x.startsWith(hang)) ? true : `${ca} do nhung khong o hang «${hang}»: ${sai.join(' ; ')}`;
}

// ── chạy ─────────────────────────────────────────────────────────────────────
try { await dung(); } catch (e) { console.log(`FAIL: fixture — ${loi(e)}`); fail += 1; }
if (!fail) {
  for (const ten of Object.keys(CA)) {
    if (!want(ten)) continue;
    try { const s = await CA[ten](GC); if (s.length) bad(ten, s.join(' ; ')); else ok(ten); } catch (e) { bad(ten, loi(e)); }
  }
  for (const db of DOT_BIEN) {
    const ten = `LT-dot-bien-${db[0]}`;
    if (!want(ten)) continue;
    try { const r = await dotBien(db); if (r === true) ok(ten, `— ${db[3]} do dung hang «${db[4]}» tren ban dot bien`); else bad(ten, r); } catch (e) { bad(ten, loi(e)); }
  }
}
if (CHON) for (const c of CHON) if (!daIn.has(c)) { fail += 1; console.log(`FAIL: ca không chạy: ${c}`); }
rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (lmtl-the)`);
process.exit(fail ? 1 : 0);
