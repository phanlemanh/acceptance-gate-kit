// lenh-dai-chay-rieng.test.mjs — bên ĐỌC của hồ sơ lenh-dai-chay-rieng (AC-2, AC-3, AC-6, AC-7).
//
// Nạp CHÍNH acceptance-verify.js qua harness; đột biến chạy trên BẢN SAO TRONG BỘ NHỚ (`srcOverride`),
// mỗi kim khẳng định khớp ĐÚNG MỘT lần trong nguồn thật trước khi tin màu đỏ.
//   LD* — prompt lệnh dài (AC-2)            LN* — lệnh khởi chạy + lệnh chờ chạy bằng bash THẬT (AC-3)
//   CR* — thứ tự nhóm chạy-riêng (AC-6)     VP* — vi phân lane máy với v2.24.0 khi không khai gì (AC-7)
// Lệnh khởi chạy và lệnh chờ RÚT TỪ PROMPT của lane — không viết tay. Mọi đường dẫn suy từ vị trí tệp.
import { fileURLToPath } from 'node:url';
import { readFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary, TOOL_KILL_RULE_LINES } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const soLan = (hay, kim) => hay.split(kim).length - 1;
const ngu = ms => new Promise(r => setTimeout(r, ms));

const buildArgs = (over = {}) => ({
  slug: 'demo', round: 1, riskTier: 'T2', evals: [], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md', invokedAt: '2026-10-07T00:00:00Z', ...over,
});
const ev = (id, cmd, extra = {}) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok', ...extra });

// Agent giả: `machine` → `onMachine(call)` (mặc định xanh, ghi cờ start/end để đo thứ tự).
const responder = ({ events = [], onMachine } = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) {
    if (onMachine) return onMachine(call);
    const cmd = l.slice('machine:'.length).replace(/#\d+$/, '');
    events.push({ cmd, ev: 'start' });
    return new Promise(r => setTimeout(() => { events.push({ cmd, ev: 'end' }); r({ exitCode: 0, outputTail: 'green\n__EXIT=0', runId: '', cannotRun: false }); }, 20));
  }
  if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'assert ok', runId: '', screenshotPath: '', observed: '', networkObserved: 'n-a (driver)', cannotRun: false };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};
const promptCua = (calls, cmd) => (calls.find(c => c.label === 'machine:' + cmd.slice(0, 40)) || {}).prompt || '';

// ═════ LD — prompt lệnh dài (AC-2) ═══════════════════════════════════════════
const KIM_MAX = 'Math.max(0, ...machineEvals.filter(e => e.cmd === cmd && Number.isInteger(e.longRunning)).map(e => e.longRunning))';
const MUTANT_MIN = SRC.replace(KIM_MAX, '(xs => xs.length ? Math.min(...xs) : 0)(machineEvals.filter(e => e.cmd === cmd && Number.isInteger(e.longRunning)).map(e => e.longRunning))');
const argsLD = buildArgs({ evals: [ev('E1', 'dai-chung', { longRunning: 20 }), ev('E2', 'dai-chung', { longRunning: 45 }), ev('E3', 'thuong')], suiteCommands: ['suite-a'] });
const ketLuanLD = (calls) => {
  const dai = promptCua(calls, 'dai-chung'), thuong = promptCua(calls, 'thuong');
  const tran = Number((dai.match(/TRAN_LAN=(\d+)/) || [])[1]);
  const han = (dai.match(/HAN_PHUT=(\d+)/) || [])[1];
  const loi = [];
  if (!dai.includes('/repo/.acceptance-runs/demo/s4-lenh-dai/')) loi.push('thiếu đường nhật ký cố định');
  if (han !== '45') loi.push(`HAN_PHUT lệch: ${han}`);
  if (!(tran > 0 && tran <= 110)) loi.push(`TRAN_LAN ${tran} không dưới trần mặc định 120 s`);
  if (dai.includes('mktemp')) loi.push('lệnh dài còn khung bọc thường');
  const thieuLuat = TOOL_KILL_RULE_LINES.filter(l => !dai.includes(l));
  if (thieuLuat.length) loi.push(`luật TOOL-KILL không tới prompt lệnh dài: ${thieuLuat.length} dòng thiếu`);
  if (!thuong.includes('mktemp') || thuong.includes('HAN_PHUT')) loi.push('lệnh thường mất khung bọc thường');
  return loi;
};
console.log('LD1 lệnh dài: nhật ký cố định, HAN_PHUT = max, TRAN_LAN dưới 120 s; lệnh thường giữ khung cũ');
{
  const { calls } = await runWorkflow(WF, argsLD, responder());
  const loi = ketLuanLD(calls);
  check('LD1 prompt hai nhánh đúng', loi.length === 0, loi.join(' ; '));
}
console.log('LD2 longRunning hỏng → BLOCKED (evals), 0 agent — 3 ca viết trước');
{
  const HONG = [0, '30', 300];
  let dung = 0; const chiTiet = [];
  for (const v of HONG) {
    const { result, calls } = await runWorkflow(WF, buildArgs({ evals: [ev('E1', 'x', { longRunning: v })], suiteCommands: ['s'] }), responder());
    const b = (result.blocked || [])[0] || {};
    const ok = result.verdict === 'BLOCKED' && b.cmd === '(evals)' && /E1/.test(b.reason) && /longRunning/.test(b.reason) && calls.length === 0;
    if (ok) dung += 1; else chiTiet.push(`${JSON.stringify(v)}→${result.verdict}/${b.cmd}/${calls.length}`);
  }
  check(`LD2 ${dung}/${HONG.length} ca hỏng bị chặn có tên`, dung === HONG.length, chiTiet.join(' ; '));
}
console.log('LD3 chiều đỏ: bản sao lấy MIN thay MAX');
{
  const { calls } = await runWorkflow(WF, argsLD, responder(), MUTANT_MIN);
  const loi = ketLuanLD(calls);
  if (loi.length) console.log('  (mutant MIN) ' + loi.join(' ; '));
  check('LD3 mutant MIN đỏ với "HAN_PHUT lệch: 20"', MUTANT_MIN !== SRC && loi.includes('HAN_PHUT lệch: 20'), loi.join(' ; '));
}
check('LD4 kim MAX khớp đúng một lần trong nguồn thật', soLan(SRC, KIM_MAX) === 1, String(soLan(SRC, KIM_MAX)));

// ═════ LN — bash thật (AC-3) ════════════════════════════════════════════════
// Rút hai lệnh từ prompt: BUOC 1 … `:\n\n<khởi chạy>\n\nKHONG doc tep …` · BUOC 2 … `__CHUA_XONG:\n\n<chờ>\n\nDoc ket qua`.
const rutLenh = (prompt) => {
  const a = prompt.match(/BUOC 1 — KHOI CHAY[\s\S]*?`:\n\n([\s\S]*?)\n\nKHONG doc tep dau ra nen/);
  const b = prompt.match(/BUOC 2 — CHO[\s\S]*?__CHUA_XONG:\n\n([\s\S]*?)\n\nDoc ket qua/);
  return { khoi: a && a[1], cho: b && b[1] };
};
const song = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const docPid = f => { try { return Number(readFileSync(f, 'utf8').trim()) || 0; } catch { return 0; } };
const KIM_XONG = 'if [ -f "$L.xong" ]; then KQ=xong; break; fi;';
const KIM_CHE = ` | sed 's/^\${EXIT_MARK}/[__EXIT che]/'`;
const KIM_GIET = '[ -n "$P" ] && dung "$P";';
const MUTANT_GREP = SRC.replace(KIM_XONG, `if grep -q '^__EXIT=' "$L" 2>/dev/null; then KQ=xong; break; fi;`);
const MUTANT_KHONG_CHE = SRC.replace(KIM_CHE, '');
const MUTANT_GIET_VO = SRC.replace(KIM_GIET, '[ -n "$P" ] && kill -TERM "$P";');

// Chạy một lượt: tác tử giả rút hai lệnh, khởi chạy NỀN, gọi lệnh chờ (đã hạ trần/hạn) tới khi hết
// __CHUA_XONG hoặc tới `dungO` lần; `khai(out, lan)` là lời khai (có thể SAI) của tác tử.
async function luotThat({ cmd, phut = 45, tranLan = 1, hanPhut, dungO = 40, khai, src, truocCho, root: rootSan, invokedAt = '2026-10-07T00:00:00Z', khongKhoi = false }) {
  const root = rootSan || mkdtempSync(path.join(tmpdir(), 'ldcr-'));
  const st = { root, chuaXong: 0, out: '', ketCuoi: '' };
  const onMachine = async (call) => {
    const { khoi, cho } = rutLenh(call.prompt);
    st.rut = !!(khoi && cho);
    if (!st.rut) return { exitCode: 1, outputTail: 'khong rut duoc lenh', runId: '', cannotRun: true, reason: 'khong rut duoc' };
    let choCmd = cho.replace(/TRAN_LAN=\d+/, `TRAN_LAN=${tranLan}`);
    if (hanPhut !== undefined) choCmd = choCmd.replace(/HAN_PHUT=\d+/, `HAN_PHUT=${hanPhut}`);
    if (!khongKhoi) { const p = spawn('bash', ['-c', khoi], { detached: true, stdio: 'ignore' }); p.unref(); }
    if (truocCho) await truocCho(root);
    let lan = 0;
    for (; lan < dungO; lan += 1) {
      st.out = execFileSync('bash', ['-c', choCmd], { encoding: 'utf8' });
      st.ketCuoi = st.out.trim().split('\n').pop();
      if (st.ketCuoi !== '__CHUA_XONG') break;
      st.chuaXong += 1;
    }
    return khai(st.out, st);
  };
  const out = await runWorkflow(WF, buildArgs({ repoRoot: root, invokedAt, evals: [ev('E1', cmd, { longRunning: phut })], suiteCommands: [] }), responder({ onMachine }), src);
  const pidCanh = docPid(path.join(root, 'canh.pid'));
  return { ...out, st, root, pidCanh };
}
const choCanh = async (root) => { for (let i = 0; i < 50 && !docPid(path.join(root, 'canh.pid')); i++) await ngu(100); };
const chetTrong = async (pid, ms = 5000) => { for (let t = 0; t < ms; t += 100) { if (!song(pid)) return true; await ngu(100); } return !song(pid); };
const don = (r) => { if (r.pidCanh && song(r.pidCanh)) try { process.kill(r.pidCanh, 'SIGKILL'); } catch {} try { rmSync(r.root, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); } catch { /* tiến trình nền còn ghi .xong — thư mục tạm, để hệ điều hành dọn */ } };

// Lệnh mẫu: in dấu GIẢ giữa chừng, chạy tiếp rồi thoát 3. Tác tử khai SAI: killedByTool + exit 0.
const LENH_GIA_ROI_3 = `sh -c 'echo $$ > canh.pid; echo dau; echo __EXIT=0; sleep 3; echo cuoi; exit 3'`;
const khaiSai = (out) => ({ exitCode: 0, outputTail: out, runId: '', cannotRun: false, killedByTool: true });
const ketLuanLN1 = (r) => {
  const loi = [];
  if (!r.st.rut) loi.push('không rút được hai lệnh từ prompt');
  if (r.st.chuaXong < 1) loi.push('không lần chờ nào trả __CHUA_XONG');
  if (!existsSync(path.join(r.root, '.acceptance-runs', 'demo', 's4-lenh-dai', 'r1-l1-1-20261007000000.log'))) loi.push('nhật ký không ở đường cố định (gốc ô + nhãn lượt)');
  if (!existsSync(path.join(r.root, '.acceptance-runs', '.gitignore'))) loi.push('thư mục lượt chạy không tự ẩn khỏi git');
  if (!(r.result.failedEvals || []).includes('E1') || (r.result.blocked || []).length) loi.push(`dấu giả kết thúc chờ (verdict ${r.result.verdict}, failed ${JSON.stringify(r.result.failedEvals)})`);
  return loi;
};
console.log('LN1 dấu giả giữa chừng + thoát 3, tác tử khai sai → workflow đọc mã 3 từ dấu thật');
{
  const r = await luotThat({ cmd: LENH_GIA_ROI_3, khai: khaiSai });
  const loi = ketLuanLN1(r);
  check('LN1 chưa-xong ≥1 lần, nhật ký cố định, eval FAIL mã 3, không BLOCKED', loi.length === 0, loi.join(' ; ') + ` | ${r.st.out.slice(-160)}`);
  don(r);
}
console.log('LN2 quá hạn → __QUA_HAN và CÂY tiến trình chết (pid canh của cháu)');
{
  const LENH_NGU = `sh -c 'echo $$ > canh.pid; exec sleep 60'`;
  const khaiQuaHan = (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, killedByTool: false, reason: 'vuot thoi luong khai' });
  const r = await luotThat({ cmd: LENH_NGU, hanPhut: 0, khai: khaiQuaHan, truocCho: choCanh });
  const chet = r.pidCanh ? await chetTrong(r.pidCanh) : false;
  check('LN2 lệnh chờ trả __QUA_HAN, cháu chết', r.st.ketCuoi === '__QUA_HAN' && r.pidCanh > 0 && chet, `ket=${r.st.ketCuoi} pid=${r.pidCanh} chet=${chet}`);
  don(r);
  const m = await luotThat({ cmd: LENH_NGU, hanPhut: 0, khai: khaiQuaHan, truocCho: choCanh, src: MUTANT_GIET_VO });
  const chetM = m.pidCanh ? await chetTrong(m.pidCanh, 2000) : true;
  if (!chetM) console.log('  (mutant giết vỏ) cây con sống sót sau __QUA_HAN');
  check('LN2 chiều đỏ: bản sao chỉ giết pid vỏ → cây con sống sót sau __QUA_HAN',
    soLan(SRC, KIM_GIET) === 1 && m.st.ketCuoi === '__QUA_HAN' && m.pidCanh > 0 && !chetM, `ket=${m.st.ketCuoi} pid=${m.pidCanh} chet=${chetM}`);
  don(m);
}
console.log('LN3 chiều đỏ: bản sao chờ chữ __EXIT= trong nhật ký thay vì tệp .xong');
{
  const m = await luotThat({ cmd: LENH_GIA_ROI_3, khai: khaiSai, src: MUTANT_GREP });
  const loi = ketLuanLN1(m);
  if (loi.length) console.log('  (mutant grep) ' + loi.join(' ; '));
  check('LN3 mutant đỏ với "dấu giả kết thúc chờ"', soLan(SRC, KIM_XONG) === 1 && loi.some(x => x.startsWith('dấu giả kết thúc chờ')), loi.join(' ; '));
  don(m);
  await ngu(3500); // lệnh mẫu của mutant tự xong — không để tiến trình sống qua ca sau
}
console.log('LN4 dấu giả + chưa xong/quá hạn, tác tử dán nguyên văn đầu ra lệnh chờ → BLOCKED; đuôi chưa-xong không mang dấu nào');
const LENH_GIA_NGU = `sh -c 'echo $$ > canh.pid; echo __EXIT=0; exec sleep 60'`;
{
  const ca = async (src) => {
    const a = await luotThat({ cmd: LENH_GIA_NGU, hanPhut: 0, truocCho: choCanh, src,
      khai: (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, killedByTool: false, reason: 'vuot thoi luong khai 45 phut' }) });
    const b = await luotThat({ cmd: LENH_GIA_NGU, dungO: 1, truocCho: choCanh, src,
      khai: (out) => ({ exitCode: 0, outputTail: out, runId: '', cannotRun: false, killedByTool: true }) });
    const tot = x => x.result.verdict !== 'PASS' && (x.result.blocked || []).some(bb => bb.cmd === LENH_GIA_NGU) && !(x.result.failedEvals || []).length;
    const coDau = x => /^__EXIT=\d+\s*$/m.test(x.st.out);
    const kq = { quaHan: tot(a), chuaXong: tot(b) && b.st.ketCuoi === '__CHUA_XONG', dauLo: coDau(a) || coDau(b), va: `${a.result.verdict}/${b.result.verdict}` };
    don(a); don(b);
    return kq;
  };
  const that = await ca(undefined);
  check('LN4 cả hai biến thể → BLOCKED, đuôi chưa-xong/quá-hạn không mang dòng __EXIT=', that.quaHan && that.chuaXong && !that.dauLo, JSON.stringify(that));
  const mut = await ca(MUTANT_KHONG_CHE);
  if (mut.dauLo) console.log('  (mutant không che) dấu giả lộ ở đuôi chưa xong');
  check('LN4 chiều đỏ: bản sao không che dấu → "dấu giả lộ ở đuôi chưa xong"', soLan(SRC, KIM_CHE) === 1 && MUTANT_KHONG_CHE !== SRC && mut.dauLo, JSON.stringify(mut));
}
console.log('LN5 tác tử khai exit 0 sau MỘT lần chờ (đuôi __CHUA_XONG) → máy đọc dấu, BLOCKED — không PASS');
{
  const KIM_DOC = 'if (cuoi === DAU_CHUA_XONG || cuoi === DAU_QUA_HAN) {';
  const MUTANT_KHONG_DOC = SRC.replace(KIM_DOC, 'if (false) {');
  const ca = async (src) => {
    const r = await luotThat({ cmd: LENH_GIA_NGU, dungO: 1, truocCho: choCanh, src,
      khai: (out) => ({ exitCode: 0, outputTail: out, runId: '', cannotRun: false, killedByTool: false }) });
    const kq = { ket: r.st.ketCuoi, verdict: r.result.verdict, blocked: (r.result.blocked || []).some(bb => bb.cmd === LENH_GIA_NGU) };
    don(r);
    return kq;
  };
  const that = await ca(undefined);
  check('LN5 đuôi __CHUA_XONG + lời khai exit 0 → BLOCKED', that.ket === '__CHUA_XONG' && that.verdict !== 'PASS' && that.blocked, JSON.stringify(that));
  const mut = await ca(MUTANT_KHONG_DOC);
  if (mut.verdict === 'PASS') console.log('  (mutant không đọc dấu) đuôi chưa-xong thành PASS');
  check('LN5 chiều đỏ: bản sao không đọc dấu → "đuôi chưa-xong thành PASS"', soLan(SRC, KIM_DOC) === 1 && mut.verdict === 'PASS', JSON.stringify(mut));
}
console.log('LN6 bước khởi chạy không chạy → lệnh chờ TỰ ghi mốc bắt đầu (hạn chờ luôn có chặn)');
{
  const KIM_MOC = '[ -f "$L.bat-dau" ] || { date +%s > "$L.bat-dau.c" && mv -f "$L.bat-dau.c" "$L.bat-dau"; }; B=$(cat "$L.bat-dau" 2>/dev/null); case "$B" in \'\'|*[!0-9]*) B=$(date +%s);; esac;';
  const MUTANT_MOC = SRC.replace(KIM_MOC, 'B=$(cat "$L.bat-dau" 2>/dev/null || date +%s);');
  const ca = async (src) => {
    const r = await luotThat({ cmd: 'echo khong-bao-gio-chay', dungO: 1, khongKhoi: true, src,
      khai: (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, reason: 'chua khoi chay' }) });
    const moc = existsSync(path.join(r.root, '.acceptance-runs', 'demo', 's4-lenh-dai', 'r1-l1-1-20261007000000.log.bat-dau'));
    const kq = { ket: r.st.ketCuoi, moc };
    don(r);
    return kq;
  };
  const that = await ca(undefined);
  check('LN6 lần chờ đầu ghi mốc bắt đầu', that.ket === '__CHUA_XONG' && that.moc, JSON.stringify(that));
  const mut = await ca(MUTANT_MOC);
  if (!mut.moc) console.log('  (mutant mốc tính lại mỗi lần) chờ không hạn khi thiếu mốc');
  check('LN6 chiều đỏ: bản sao tính lại mốc mỗi lần → "chờ không hạn khi thiếu mốc"', soLan(SRC, KIM_MOC) === 1 && !mut.moc, JSON.stringify(mut));
}
console.log('LN7 lượt cùng round chạy lại: tên nhật ký theo nhãn lượt — lượt sau không đọc kết quả lượt trước');
{
  const KIM_NHAN = '  const ten = `${goc}-${NHAN_LUOT}`';
  const MUTANT_KHONG_NHAN = SRC.replace(KIM_NHAN, '  const ten = goc');
  const ca = async (src) => {
    const root = mkdtempSync(path.join(tmpdir(), 'ldcr-'));
    // Lượt 1 chạy trọn và thoát 5; lượt 2 (invokedAt khác) gọi lệnh chờ TRƯỚC khi khởi chạy của nó.
    const r1 = await luotThat({ root, cmd: 'exit 5', src, invokedAt: '2026-10-07T01:00:00Z',
      khai: (out) => ({ exitCode: 5, outputTail: out, runId: '', cannotRun: false }) });
    const r2 = await luotThat({ root, cmd: 'exit 5', src, invokedAt: '2026-10-07T02:00:00Z', khongKhoi: true, dungO: 1,
      khai: (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, reason: 'chua khoi chay' }) });
    const kq = { luot1: r1.st.ketCuoi, luot2: r2.st.ketCuoi };
    don(r2);
    return kq;
  };
  const that = await ca(undefined);
  check('LN7 lượt 1 xong mã 5; lần chờ đầu của lượt 2 trả __CHUA_XONG (không đọc .xong của lượt 1)',
    that.luot1 === '__EXIT=5' && that.luot2 === '__CHUA_XONG', JSON.stringify(that));
  const mut = await ca(MUTANT_KHONG_NHAN);
  if (mut.luot2 === '__EXIT=5') console.log('  (mutant bỏ nhãn lượt) lượt sau đọc kết quả lượt trước');
  check('LN7 chiều đỏ: bản sao bỏ nhãn lượt → "lượt sau đọc kết quả lượt trước"', soLan(SRC, KIM_NHAN) === 1 && mut.luot2 === '__EXIT=5', JSON.stringify(mut));
}
console.log('LN6c mốc bắt đầu RỖNG (đọc đúng lúc tệp bị cắt) → lần chờ không báo quá hạn giả');
{
  const KIM_CHAN = `case "$B" in ''|*[!0-9]*) B=$(date +%s);; esac;`;
  const MUTANT_KHONG_CHAN = SRC.replace(KIM_CHAN, '');
  const datMocRong = async (root) => {
    const d = path.join(root, '.acceptance-runs', 'demo', 's4-lenh-dai');
    execFileSync('mkdir', ['-p', d]);
    execFileSync('bash', ['-c', `: > "${d}/r1-l1-1-20261007000000.log.bat-dau"`]);
  };
  const ca = async (src) => {
    const r = await luotThat({ cmd: 'echo x', dungO: 1, khongKhoi: true, truocCho: datMocRong, src,
      khai: (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, reason: 'x' }) });
    const kq = { ket: r.st.ketCuoi }; don(r); return kq;
  };
  const that = await ca(undefined);
  check('LN6c mốc rỗng → __CHUA_XONG', that.ket === '__CHUA_XONG', JSON.stringify(that));
  const mut = await ca(MUTANT_KHONG_CHAN);
  if (mut.ket === '__QUA_HAN') console.log('  (mutant không chặn mốc rỗng) mốc rỗng thành quá hạn giả');
  check('LN6c chiều đỏ: bản sao gỡ đúng phép chặn → "mốc rỗng thành quá hạn giả"', soLan(SRC, KIM_CHAN) === 1 && mut.ket === '__QUA_HAN', JSON.stringify(mut));
}
console.log('LN8 lệnh bẫy SIGTERM: quá hạn vẫn dừng được (TERM rồi KILL)');
{
  const LENH_BAY = `sh -c 'echo $$ > canh.pid; trap "" TERM; exec sleep 60'`;
  const KIM_KILL = `for p in $(printf '%s\\\\n' "$DS"); do kill -KILL "$p" 2>/dev/null; done;`;
  const MUTANT_CHI_TERM = SRC.replace(KIM_KILL, '');
  const ca = async (src) => {
    const r = await luotThat({ cmd: LENH_BAY, hanPhut: 0, truocCho: choCanh, src,
      khai: (out) => ({ exitCode: 1, outputTail: out, runId: '', cannotRun: true, reason: 'qua han' }) });
    const chet = r.pidCanh ? await chetTrong(r.pidCanh, 3000) : false;
    const kq = { ket: r.st.ketCuoi, pid: r.pidCanh, chet };
    don(r);
    return kq;
  };
  const that = await ca(undefined);
  check('LN8 lệnh bẫy TERM chết sau __QUA_HAN', that.ket === '__QUA_HAN' && that.pid > 0 && that.chet, JSON.stringify(that));
  const mut = await ca(MUTANT_CHI_TERM);
  if (!mut.chet) console.log('  (mutant chỉ TERM) lệnh bẫy TERM sống sót');
  check('LN8 chiều đỏ: bản sao chỉ gửi TERM → "lệnh bẫy TERM sống sót"', soLan(SRC, KIM_KILL) === 1 && mut.pid > 0 && !mut.chet, `${JSON.stringify(mut)} kim=${soLan(SRC, KIM_KILL)}`);
}

// ═════ CR — nhóm chạy-riêng (AC-6) ══════════════════════════════════════════
const idx = (events, cmd, ev) => events.findIndex(e => e.cmd === cmd && e.ev === ev);
const SUITES = ['suite-a', 'suite-b', 'suite-c'];
const argsCR = (over = {}) => buildArgs({
  evals: [ev('E1', 'eval-1'), ev('E2', 'eval-2'), ev('E3', 'nang-1'), ev('E4', 'nang-2')],
  suiteCommands: [...SUITES], evalsChayRieng: ['E3', 'E4'], ...over,
});
const sauMoiLenhKhac = (events, nang, khac) => nang.every(n => khac.every(k => idx(events, k, 'end') !== -1 && idx(events, n, 'start') > idx(events, k, 'end')));
const ketLuanCR1 = (events, calls) => {
  const loi = [];
  if (calls.filter(c => c.label.startsWith('machine:')).length !== 7) loi.push(`số lời gọi machine ${calls.filter(c => c.label.startsWith('machine:')).length} ≠ 7`);
  if (!sauMoiLenhKhac(events, ['nang-1', 'nang-2'], ['eval-1', 'eval-2', ...SUITES])) loi.push('chạy-riêng chồng lệnh khác');
  const [s1, e1, s2, e2] = [idx(events, 'nang-1', 'start'), idx(events, 'nang-1', 'end'), idx(events, 'nang-2', 'start'), idx(events, 'nang-2', 'end')];
  if (!(e1 < s2 || e2 < s1)) loi.push('hai lệnh chạy-riêng chồng nhau');
  return loi;
};
const KIM_LA = 'const laChayRieng = c => (byCmd.get(c) || []).some(id => CHAY_RIENG.has(id))';
const KIM_SS = 'const cmdSongSong = distinctCmds.filter(c => !SUITE_SET.has(c) && !laChayRieng(c));';
const KIM_CR = 'const cmdChayRieng = distinctCmds.filter(c => !SUITE_SET.has(c) && laChayRieng(c));';
const MUTANT_GOP = SRC.replace(KIM_SS, 'const cmdSongSong = distinctCmds.filter(c => !SUITE_SET.has(c));').replace(KIM_CR, 'const cmdChayRieng = [];');
const KIM_RR = 'rr.push(await Promise.resolve().then(() => agentCuaLenh(cmd, n))';
const MUTANT_MAT_KHUNG = SRC.replace(KIM_RR, 'rr.push(await Promise.resolve().then(() => (cmdPhut.set(cmd, 0), agentCuaLenh(cmd, n)))');

console.log('CR1 lệnh chạy-riêng bắt đầu sau MỌI lệnh khác, không chồng nhau');
{
  const events = [];
  const { calls } = await runWorkflow(WF, argsCR(), responder({ events }));
  const loi = ketLuanCR1(events, calls);
  check('CR1 thứ tự đúng', loi.length === 0, loi.join(' ; ') + ' | ' + JSON.stringify(events));
}
console.log('CR2 dry-run in commandGroups.chayRieng');
{
  const { result: d } = await runWorkflow(WF, argsCR({ dryRun: true }), responder());
  const g = d.commandGroups || {};
  const nhom = ['songSong', 'tuanTu', 'chayRieng'].map(k => g[k] || []);
  const motNhom = d.distinctCommands.every(c => nhom.filter(n => n.includes(c)).length === 1);
  check('CR2 chayRieng = [nang-1, nang-2], mỗi lệnh đúng một nhóm',
    JSON.stringify(g.chayRieng) === JSON.stringify(['nang-1', 'nang-2']) && motNhom, JSON.stringify(g));
}
console.log('CR3 id chạy-riêng trên lệnh trùng suite → lệnh ở tuanTu');
{
  const { result: d } = await runWorkflow(WF, argsCR({ evals: [ev('E1', 'eval-1'), ev('E5', 'suite-a')], evalsChayRieng: ['E5'], dryRun: true }), responder());
  const g = d.commandGroups || {};
  check('CR3 suite-a trong tuanTu, không có nhóm chayRieng', (g.tuanTu || []).includes('suite-a') && !g.chayRieng, JSON.stringify(g));
}
console.log('CR4 chiều đỏ: bản sao gộp chạy-riêng về nhánh song song');
{
  const events = [];
  const { calls } = await runWorkflow(WF, argsCR(), responder({ events }), MUTANT_GOP);
  const loi = ketLuanCR1(events, calls);
  if (loi.length) console.log('  (mutant gộp) ' + loi.join(' ; '));
  check('CR4 mutant đỏ với "chạy-riêng chồng lệnh khác"',
    soLan(SRC, KIM_SS) === 1 && soLan(SRC, KIM_CR) === 1 && soLan(SRC, KIM_LA) === 1 && loi.includes('chạy-riêng chồng lệnh khác'), loi.join(' ; '));
}
console.log('CR5 ca crm E6/E7: vừa chạy-riêng vừa longRunning 45 → chạy sau VÀ mang khung nền');
{
  const a5 = argsCR({ evals: [ev('E1', 'eval-1'), ev('E2', 'eval-2'), ev('E3', 'nang-1', { longRunning: 45 }), ev('E4', 'nang-2')] });
  const ketLuan = async (src) => {
    const events = [];
    const { calls } = await runWorkflow(WF, a5, responder({ events }), src);
    const p = promptCua(calls, 'nang-1');
    const loi = [];
    if (!sauMoiLenhKhac(events, ['nang-1'], ['eval-1', 'eval-2', ...SUITES])) loi.push('chạy-riêng chồng lệnh khác');
    if (!/HAN_PHUT=45\b/.test(p) || p.includes('mktemp')) loi.push('chạy-riêng mất khung nền');
    return loi;
  };
  const lThat = await ketLuan(undefined);
  check('CR5 chạy sau mọi lệnh khác, prompt khung nền HAN_PHUT=45', lThat.length === 0, lThat.join(' ; '));
  const lMut = await ketLuan(MUTANT_MAT_KHUNG);
  if (lMut.length) console.log('  (mutant khung thường) ' + lMut.join(' ; '));
  check('CR5 chiều đỏ: nhóm chạy-riêng dùng khung bọc thường → "chạy-riêng mất khung nền"',
    soLan(SRC, KIM_RR) === 1 && lMut.includes('chạy-riêng mất khung nền'), lMut.join(' ; '));
}

// ═════ VP — vi phân với v2.24.0 khi không khai gì (AC-7) ════════════════════
// Base là mốc CỐ ĐỊNH, không phải merge-base: sau khi gộp merge-base trùng cây và vi phân rỗng (gap-probe F3).
const BASE_REF = 'v2.24.0';
let BASE_SRC = null, baseLoi = '';
try { BASE_SRC = execFileSync('git', ['-C', KIT, 'show', `${BASE_REF}:feature-loop/workflows/acceptance-verify.js`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
catch (e) { baseLoi = String((e && e.stderr) || e).split('\n')[0]; }
const argsVP = (over = {}) => buildArgs({
  evals: [ev('E1', 'eval-1'), ev('E2', 'eval-2'),
    { id: 'E3', criterion: 'AC-3', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md'] },
    { id: 'E4', criterion: 'AC-4', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] }],
  suiteCommands: ['s-a', 's-b'], ...over,
});
const vetLuot = async (src) => {
  const { result, calls } = await runWorkflow(WF, argsVP(), responder(), src);
  const { result: dry } = await runWorkflow(WF, argsVP({ dryRun: true }), responder(), src);
  // CHỈ lane máy (S4-r1/r2 finding t1): so prompt judge/review/synthesize với một mốc cố định là khoá cả
  // engine vào 2.24.0 — lần sửa hợp lệ kế tiếp của các lane đó sẽ đỏ oan. AC-7 hứa về lệnh MÁY.
  const may = calls.filter(c => c.label.startsWith('machine:'));
  const { distinctCommands, commandGroups, evalsPerCommand, runsPerCommand } = dry;
  return {
    goi: JSON.stringify(may.map(c => [c.label, c.prompt])),
    kq: JSON.stringify({ verdict: result.verdict, failedEvals: result.failedEvals, blocked: result.blocked }),
    dry: JSON.stringify({ distinctCommands, commandGroups, evalsPerCommand, runsPerCommand }), verdict: result.verdict,
    soMay: calls.filter(c => c.label.startsWith('machine:')).length,
  };
};
const MUTANT_MOI_EVAL_RIENG = SRC.replace(KIM_LA, 'const laChayRieng = c => (byCmd.get(c) || []).length > 0');
console.log(`VP1 cùng args không khai: lane máy của cây đang kiểm BẰNG HỆT ${BASE_REF} (thứ tự lời gọi máy, prompt máy, nhóm lệnh, verdict)`);
let vpBase = null;
if (!BASE_SRC) {
  check(`VP1 không giải được ${BASE_REF} — hạ tầng (cần tag; CI fetch-depth 0)`, false, baseLoi);
} else {
  vpBase = await vetLuot(BASE_SRC);
  const vThat = await vetLuot(undefined);
  const loi = [];
  if (BASE_SRC === SRC) loi.push('base trùng cây — vi phân rỗng');
  for (const [ten, v] of [['base', vpBase], ['cây', vThat]]) if (v.verdict !== 'PASS' || v.soMay !== 4) loi.push(`vi phân rỗng: kết cục ${ten} sai (${v.verdict}, ${v.soMay} machine)`);
  if (vThat.goi !== vpBase.goi) loi.push('thứ tự lệnh đổi (lời gọi/prompt máy khác base)');
  if (vThat.kq !== vpBase.kq) loi.push('kết quả khác base');
  if (vThat.dry !== vpBase.dry) loi.push('dry-run khác base');
  check('VP1 bằng hệt base, kết cục ghim đúng ở cả hai', loi.length === 0, loi.join(' ; '));
}
console.log('VP2 chiều đỏ: bản sao coi mọi lệnh eval là chạy-riêng');
if (vpBase) {
  const vMut = await vetLuot(MUTANT_MOI_EVAL_RIENG);
  const doi = vMut.goi !== vpBase.goi;
  if (doi) console.log('  (mutant mọi eval chạy riêng) thứ tự lệnh đổi');
  check('VP2 mutant đỏ với "thứ tự lệnh đổi"', soLan(SRC, KIM_LA) === 1 && doi, `doi=${doi}`);
} else check('VP2 không chạy được vì VP1 thiếu base', false, baseLoi);

summary('lenh-dai-chay-rieng');
