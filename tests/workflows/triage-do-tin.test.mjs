// triage-do-tin.test.mjs — vòng do-tin-tram-phan-loai (cửa sổ 2.14).
//
// Trạm phân loại phạm vi ghép kết quả theo MÃ MÁY ĐÚC, hỏi lại đúng MỘT lần phần còn
// thiếu, và để lại một dòng sổ kind triage. Mọi chân: đối chứng dương trên bản THẬT +
// mutant trên bản sao trong bộ nhớ (không ghi đè tệp thật). Phản hồi giả SINH TỪ tải gửi
// đi thật — rút mảng Findings khỏi lời nhắc (AC-10) — không gõ tay mã.
//
// Chạy trọn: node triage-do-tin.test.mjs · một chân: --chan <tên> (mã thoát của chân).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const CHAN = (() => { const i = process.argv.indexOf('--chan'); return i >= 0 ? process.argv[i + 1] : ''; })();
const SCRATCH = path.join(os.tmpdir(), 'triage-do-tin'); mkdirSync(SCRATCH, { recursive: true });
const RUNLOG_TMP = path.join(SCRATCH, 'triage-run-log.jsonl');

// Tên trường mã: rút từ khối marker của BÊN VIẾT — không gõ lại (AC-10).
const ID_FIELD = (() => {
  const m = SRC.match(/<<<TRIAGE-ID-FIELD[\s\S]*?const TRIAGE_ID_FIELD = '([a-zA-Z_]+)'[\s\S]*?TRIAGE-ID-FIELD>>>/);
  if (!m) { console.log('  FAIL: khong rut duoc marker TRIAGE-ID-FIELD tu acceptance-verify.js'); process.exit(5); }
  return m[1];
})();

const args = {
  slug: 'demo', round: 1, riskTier: 'T2', diffBase: 'main', repoRoot: '/repo',
  invokedAt: '2026-09-15T10:00:00Z', invokedSha: 'abc1234abc1234abc1234abc1234abc1234abc12',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass', paths: ['src/a.js'] }],
  suiteCommands: [], personasPath: '/refs/p.md', templatePath: '/refs/t.md',
  contractPath: '/repo/_acceptance/demo/contract.md',
};
// Hai phát hiện TRÙNG tiêu đề khác tệp (ô lưới gỡ-mơ-hồ cũ chịu thua) + một phát hiện lẻ.
const F3 = [
  { title: 'thieu kiem tra null', file: '/repo/src/a.js', line: 1, severity: 'high', detail: 'a' },
  { title: 'thieu kiem tra null', file: '/repo/src/b.js', line: 2, severity: 'high', detail: 'b' },
  { title: 'sai ma thoat',        file: '/repo/src/c.js', line: 3, severity: 'low',  detail: 'c' },
];
const rutTaiGui = (prompt) => {
  const m = prompt.match(/Findings: (\[[\s\S]*?\])\n\n/);
  if (!m) throw new Error('khong rut duoc tai gui di tu loi nhac triage');
  return JSON.parse(m[1]);
};
// row(f, o): một dòng phản hồi ĐÚNG khuôn, sinh từ phần tử tải gửi f.
const row = (f, o = {}) => ({ [ID_FIELD]: f[ID_FIELD], title: f.title, file: f.file, inContract: true, acRef: 'AC-1', rationale: 'r', plain: '', proposal: '', ...o });
// respond({ findings, triage }) — triage(sent, luot) trả mảng dòng (null = tác tử chết); luot đếm từ 1.
const respond = ({ findings, triage }) => {
  let luot = 0;
  return (c) => {
    if (c.label.startsWith('review:bugs')) return { findings };
    if (c.label.startsWith('review:')) return { findings: [] };
    if (c.label === 'triage') { luot += 1; const sent = rutTaiGui(c.prompt); const r = triage(sent, luot); return r === null ? null : { contractUnreadable: false, triaged: r }; }
    if (c.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
    if (c.label.startsWith('baseline:')) return { results: [] };
    if (c.label.startsWith('refute:')) return { refuted: false, reason: 'that' };
    if (c.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
    if (c.label === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  };
};
const triageCalls = (calls) => calls.filter(c => c.label === 'triage');
const refuteCalls = (calls) => calls.filter(c => c.label.startsWith('refute:'));
const du = (s) => s.map(f => row(f));
const mutant = (kim, thay) => {
  if (!SRC.includes(kim)) { console.log(`  FAIL: kim mutant KHONG co trong nguon: ${kim.slice(0, 70)}`); process.exit(2); }
  return SRC.replace(kim, thay);
};
const CHANS = [];
const chay = (ten, fn) => CHANS.push([ten, fn]);

// ── chân ma-may-duc (AC-1) ──────────────────────────────────────────────────
chay('ma-may-duc', async () => {
  // Đường dẫn trôi: agent trả file ở dạng khác hẳn (tương đối, đổi thư mục).
  const troi = (sent) => sent.map(f => row(f, { file: 'khac/' + path.basename(f.file) }));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }));
  const okThat = that.result.triageFailed === false && triageCalls(that.calls).length === 1;
  check('ma-may-duc doi chung duong: ban that ghep du ca ba du duong dan troi', okThat, JSON.stringify({ tf: that.result.triageFailed, n: triageCalls(that.calls).length }));
  const mut = mutant("const byTid = new Map(rows.filter(r => sentTids.has(r[TRIAGE_ID_FIELD])).map(r => [r[TRIAGE_ID_FIELD], r]))", 'const byTid = new Map()');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }), mut);
  check('ma-may-duc mutant go nhanh ghep-theo-ma -> DO (rang song)', ban.result.triageFailed === true, 'go ghep-theo-ma ma van xanh');
  if (!okThat) return 4; if (ban.result.triageFailed !== true) return 3;
  console.log('PASS: ghep duoc theo ma may duc khi duong dan troi, ke ca hai phat hien TRUNG tieu de khac tep (doi chung duong: ban nguyen ven XANH; mutant go nhanh ghep-theo-ma DO ma 3)');
  return 0;
});

// ── chân chu-ky-kiem (AC-2) ─────────────────────────────────────────────────
chay('chu-ky-kiem', async () => {
  // Lượt 1: dòng t3 mang tiêu đề lệch → phải vào tập thiếu; lượt 2 trả đúng → vá được.
  const lech = (sent, luot) => luot === 1
    ? sent.map(f => f[ID_FIELD] === 't3' ? row(f, { title: 'tieu de khac han' }) : row(f))
    : du(sent);
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: lech }));
  const tc = triageCalls(that.calls);
  const vaoTapThieu = tc.length === 2 && rutTaiGui(tc[1].prompt).every(f => f[ID_FIELD] === 't3');
  check('chu-ky-kiem ban that: dong lech KHONG ghep, t3 vao tap thieu, luot 2 chi mang t3', vaoTapThieu && that.result.triageFailed === false, JSON.stringify({ n: tc.length, tf: that.result.triageFailed }));
  const dung = await runWorkflow(WF, args, respond({ findings: F3, triage: du }));
  check('chu-ky-kiem doi chung duong: tieu de dung thi ghep ngay luot 1', triageCalls(dung.calls).length === 1);
  const mut = mutant("&& String(r1.title || '').trim() === String(f.title || '').trim()", '');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: lech }), mut);
  check('chu-ky-kiem mutant bo so tieu de -> dong lech VAN ghep -> khong hoi lai (rang song)', triageCalls(ban.calls).length === 1);
  if (!vaoTapThieu) return 4; if (triageCalls(ban.calls).length !== 1) return 3;
  console.log('PASS: ma khop ma tieu de lech thi KHONG ghep — phat hien do di vao tap CON THIEU va duoc luot hoi lai mang di hoi (doi chung duong: cung ca voi tieu de dung thi ghep ngay luot 1, khong co luot hoi lai)');
  return 0;
});

// ── chân ma-la (AC-3) ───────────────────────────────────────────────────────
chay('ma-la', async () => {
  // Dòng THỪA mang t99: bị bỏ, có log gọi tên, ba phát hiện vẫn ghép.
  const la = (sent) => [...du(sent), { ...row(sent[0]), [ID_FIELD]: 't99', title: 'bia' }];
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: la }));
  const ok = that.result.triageFailed === false && triageCalls(that.calls).length === 1 && that.logs.some(l => /ma la t99/i.test(l));
  check('ma-la ban that: dong t99 bi bo, co log goi ten, ca ba van ghep', ok, that.logs.filter(l => /triage/i.test(l)).join(' | ').slice(0, 200));
  // Mutant bỏ lưới mã-lạ: dòng lạ vào byTid dưới khoá t99 (vô hại) NHƯNG log gọi tên biến
  // mất — chính dòng chẩn đoán mà AC-3 đòi. Răng đo đúng vật đó.
  const mut = mutant("for (const r of rows) if (r[TRIAGE_ID_FIELD] && !sentTids.has(r[TRIAGE_ID_FIELD])) log(`Triage: ma la ${r[TRIAGE_ID_FIELD]} — bo dong thua, khong ghep sang ai`)", '');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: la }), mut);
  const banIm = !ban.logs.some(l => /ma la t99/i.test(l));
  check('ma-la mutant bo luoi ma-la -> dong la khong duoc goi ten (rang song)', banIm);
  if (!ok) return 4; if (!banIm) return 3;
  console.log('PASS: dong mang ma la la dong THUA — bi bo, co dong chan doan goi ten no, va khong phat hien nao mat phan loai vi no');
  return 0;
});

// ── chân seam-ma (AC-10) ────────────────────────────────────────────────────
chay('seam-ma', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: du }));
  const sent = rutTaiGui(triageCalls(that.calls)[0].prompt);
  const soMa = sent.filter(f => typeof f[ID_FIELD] === 'string' && f[ID_FIELD]).length;
  const trongLuocDo = SRC.includes("[TRIAGE_ID_FIELD]: { type: 'string'") && SRC.includes("required: ['title', 'file', 'inContract', 'acRef', 'rationale', 'proposal', 'plain', TRIAGE_ID_FIELD]");
  check('seam-ma so ma trong tai gui = so phat hien', soMa === F3.length, `${soMa}/${F3.length}`);
  check('seam-ma luoc do dung cung hang TRIAGE_ID_FIELD (mot nguon)', trongLuocDo);
  // Hai mutant chạy trên ca ĐƯỜNG DẪN TRÔI: nếu tải gửi mất mã thì nấc 2 (khoá tệp)
  // không cứu được vì tệp đã trôi, nấc 3 không cứu được vì hai tiêu đề trùng — chỉ còn
  // mã. Chạy trên ca tệp-chép-nguyên-văn thì nấc 2 cứu và mutant giả xanh (đo được ở
  // lần chạy đầu của chính chân này).
  const troi = (sent) => sent.map(f => row(f, { file: 'khac/' + path.basename(f.file) }));
  const mut1 = mutant("[TRIAGE_ID_FIELD]: f.tid, title: f.title", 'title: f.title');
  const ban1 = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }), mut1);
  check('seam-ma mutant go ma khoi loi nhac -> DO', ban1.result.triageFailed === true);
  // Đổi tên trường ở đúng MỘT phía (tải gửi) — lược đồ và bộ ghép vẫn đọc tên cũ.
  const mut2 = mutant("[TRIAGE_ID_FIELD]: f.tid, title: f.title", "id: f.tid, title: f.title");
  const ban2 = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }), mut2);
  check('seam-ma mutant doi ten truong o MOT phia -> DO', ban2.result.triageFailed === true);
  if (soMa !== F3.length) return 6; if (!trongLuocDo) return 5; if (ban1.result.triageFailed !== true) return 3; if (ban2.result.triageFailed !== true) return 4;
  console.log('PASS: khop gui-di ↔ doc-lai — so ma trong tai gui di BANG so phat hien, ten truong ma rut tu MOT cho co marker va trung o ca ba phia (loi nhac, luoc do, bo ghep)');
  return 0;
});

// ── chân hoi-lai (AC-4) ─────────────────────────────────────────────────────
chay('hoi-lai', async () => {
  const thieuT3 = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : du(sent);
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }));
  const tc = triageCalls(that.calls);
  const ok = tc.length === 2 && rutTaiGui(tc[1].prompt).map(f => f[ID_FIELD]).join() === 't3' && that.result.triageFailed === false && refuteCalls(that.calls).length === 3;
  check('hoi-lai ban that: dung MOT luot hoi lai chi mang t3, sau gop du, refute chi trong hop dong', ok, JSON.stringify({ n: tc.length, tf: that.result.triageFailed, rf: refuteCalls(that.calls).length }));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mut);
  check('hoi-lai mutant go luot hoi lai -> co hong bat ngay luot 1 (rang song)', ban.result.triageFailed === true && triageCalls(ban.calls).length === 1);
  const mutCa = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", 'triageRaw2 = await triageOnce(toTriage).catch(() => null)');
  const banCa = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mutCa);
  const caN = rutTaiGui(triageCalls(banCa.calls)[1].prompt).length;
  check('hoi-lai mutant hoi lai CA phat hien da ghep -> rang song', caN !== 1, String(caN));
  if (!ok) return 4; if (!(ban.result.triageFailed === true && triageCalls(ban.calls).length === 1)) return 3; if (caN === 1) return 4; if (tc.length !== 2) return 6;
  console.log('PASS: dung MOT luot hoi lai, loi nhac chi mang phat hien con thieu; sau gop du ca ba, triageFailed false, bac bo chi chay tren phat hien trong hop dong, va KHONG co tac tu phan loai thu ba');
  return 0;
});

// ── chân im (AC-5) ──────────────────────────────────────────────────────────
chay('im', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: du }));
  const n = triageCalls(that.calls).length;
  check('im ban that: luot 1 du -> dung MOT tac tu triage', n === 1, String(n));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (!triageFailed) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: du }), mut);
  check('im mutant hoi lai vo dieu kien -> hai tac tu (rang song)', triageCalls(ban.calls).length === 2);
  if (n !== 1) return 4; if (triageCalls(ban.calls).length !== 2) return 3;
  console.log('PASS: luot 1 du thi tong so tac tu nhan phan loai dung MOT — khong co luot hoi lai nao');
  return 0;
});

// ── chân van-thieu (AC-6 chân 1) ────────────────────────────────────────────
chay('van-thieu', async () => {
  const vanThieu = (sent) => sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: vanThieu }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2 && refuteCalls(that.calls).length === 3 && (that.result.rejectFindings || []).length === 0;
  check('van-thieu ban that: sau hoi lai van thieu -> triageFailed, refute TOAN BO, khong tac tu thu ba', ok, JSON.stringify({ tf: that.result.triageFailed, n: triageCalls(that.calls).length, rf: refuteCalls(that.calls).length }));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'for (let hoi = 0; hoi < 2 && thieu.length && !triageFailed; hoi++) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: vanThieu }), mut);
  check('van-thieu mutant hoi lai vong hai -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return that.result.triageFailed !== true ? 4 : 5; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: chan VAN THIEU — luot hoi lai tra ve ma van khong co dong khop thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba');
  return 0;
});

// ── chân hoi-lai-chet (AC-6 chân 2) ─────────────────────────────────────────
chay('hoi-lai-chet', async () => {
  const chet = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : null;
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: chet }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2 && refuteCalls(that.calls).length === 3;
  check('hoi-lai-chet ban that: tac tu luot hai chet -> triageFailed, refute TOAN BO, khong thu lai', ok, JSON.stringify({ tf: that.result.triageFailed, n: triageCalls(that.calls).length }));
  const mut = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", 'triageRaw2 = await triageOnce(thieu).catch(() => null); if (!triageRaw2) triageRaw2 = await triageOnce(thieu).catch(() => null)');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: chet }), mut);
  check('hoi-lai-chet mutant thu lai khi chet -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return 4; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: chan HOI LAI CHET — tac tu luot hai chet thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba');
  return 0;
});

// ── chân ma-giu-nguyen (AC-9) ───────────────────────────────────────────────
chay('ma-giu-nguyen', async () => {
  const thieuT3 = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : du(sent);
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }));
  const maLuot2 = rutTaiGui(triageCalls(that.calls)[1].prompt).map(f => f[ID_FIELD]);
  check('ma-giu-nguyen ban that: luot 2 mang lai ma CU t3', maLuot2.join() === 't3', maLuot2.join());
  // Dòng lượt 2 mang mã NGOÀI tập đang hỏi (t1) → xử như mã lạ, không ghép đè t1, t3 vẫn thiếu.
  const ngoaiTap = (sent, luot) => luot === 1
    ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f))
    : [{ ...row(sent[0]), [ID_FIELD]: 't1', title: 'thieu kiem tra null', inContract: false, acRef: '', proposal: 'known-limits', plain: 'x' }];
  const nt = await runWorkflow(WF, args, respond({ findings: F3, triage: ngoaiTap }));
  const ntOk = nt.result.triageFailed === true && nt.logs.some(l => /ma la t1/i.test(l));
  check('ma-giu-nguyen dong luot 2 mang ma ngoai tap -> ma la, t3 van thieu -> triageFailed', ntOk, nt.logs.filter(l => /triage/i.test(l)).join(' | ').slice(0, 200));
  const mut = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", "thieu.forEach((f, i) => { f.tid = `t${i + 1}` }); triageRaw2 = await triageOnce(thieu).catch(() => null)");
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mut);
  const maMut = rutTaiGui(triageCalls(ban.calls)[1].prompt).map(f => f[ID_FIELD]).join();
  check('ma-giu-nguyen mutant duc lai ma o luot 2 -> luot 2 mang t1 (rang song)', maMut === 't1', maMut);
  if (maLuot2.join() !== 't3') return 5; if (!ntOk) return 4; if (maMut !== 't1') return 3;
  console.log('PASS: luot hoi lai mang lai MA CU cua tung phat hien (khong tai danh so), va dong tra ve mang ma ngoai tap dang hoi bi xu nhu ma la');
  return 0;
});

// ── chân tap-rong (AC-8 chân 1) ─────────────────────────────────────────────
chay('tap-rong', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: [], triage: du }));
  const ok = triageCalls(that.calls).length === 0 && that.result.triageFailed === false;
  check('tap-rong ban that: khong tac tu triage, triageFailed false', ok, JSON.stringify({ n: triageCalls(that.calls).length, tf: that.result.triageFailed }));
  const mut = mutant("if (toTriage.length === 0) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, respond({ findings: [], triage: du }), mut);
  check('tap-rong mutant bo nhanh tap-rong -> goi tac tu (rang song)', triageCalls(ban.calls).length >= 1);
  if (!ok) return 4; if (triageCalls(ban.calls).length < 1) return 3;
  console.log('PASS: duong cu TAP RONG — khong tac tu phan loai nao duoc goi va triageFailed false');
  return 0;
});

// ── chân tac-tu-chet (AC-8 chân 2) ──────────────────────────────────────────
chay('tac-tu-chet', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: () => null }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2; // 1 + retry cũ, KHÔNG có hỏi lại
  check('tac-tu-chet ban that: chet ca hai lan thu -> triageFailed, khong hoi lai', ok, String(triageCalls(that.calls).length));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (thieu.length) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: () => null }), mut);
  check('tac-tu-chet mutant cho hoi lai o nhanh chet -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return that.result.triageFailed !== true ? 4 : 5; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: duong cu TAC TU CHET — chet ca hai lan thu cua luot 1 thi triageFailed true va KHONG co luot hoi lai nao');
  return 0;
});

// ── chân hop-dong-khong-doc-duoc (AC-8 chân 3) ──────────────────────────────
chay('hop-dong-khong-doc-duoc', async () => {
  const base = respond({ findings: F3, triage: () => [] });
  const r = (c) => c.label === 'triage' ? { contractUnreadable: true, triaged: [] } : base(c);
  const that = await runWorkflow(WF, args, r);
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 1;
  check('hop-dong-khong-doc-duoc ban that: triageFailed true, khong hoi lai', ok, String(triageCalls(that.calls).length));
  const mut = mutant("if (triageRaw && triageRaw.contractUnreadable === true) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, r, mut);
  // Bỏ nhánh tự-khai: lượt 1 «trả rỗng» → mọi mục thiếu → hỏi lại chạy → hai tác tử.
  const banHoiLai = triageCalls(ban.calls).length === 2;
  check('hop-dong-khong-doc-duoc mutant bo nhanh tu-khai -> hoi lai chay (rang song)', banHoiLai);
  if (!ok) return that.result.triageFailed !== true ? 3 : 4; if (!banHoiLai) return 3;
  console.log('PASS: duong cu TU KHAI KHONG DOC DUOC HOP DONG — triageFailed true va KHONG co luot hoi lai nao');
  return 0;
});

// ── chạy ──────────────────────────────────────────────────────────────────
const chon = CHAN ? CHANS.filter(([t]) => t === CHAN) : CHANS;
if (CHAN && !chon.length) { console.log(`  FAIL: khong co chan "${CHAN}"`); process.exit(2); }
let ma = 0;
for (const [ten, fn] of chon) { console.log(`== chan ${ten} ==`); const r = await fn(); if (r !== 0 && ma === 0) ma = r; }
if (CHAN) process.exit(ma);
summary('triage-do-tin');
// giữ import cho Task 4 (dòng sổ + ma trận bộ đọc)
void writeFileSync; void existsSync; void readdirSync; void execFileSync; void RUNLOG_TMP;
