// suite-tuan-tu.test.mjs — thuoc-co-cua AC-9 (E11): lệnh SUITE chạy tuần tự, lệnh
// eval giữ song song. Tư cách suite xét theo danh sách `args.suiteCommands` (so chuỗi
// lệnh), KHÔNG theo «lệnh không có eval đi kèm» (phản biện F1).
//
// Đo bằng CỜ THỨ TỰ (mẫu W44), không bằng ngưỡng đồng hồ: agent giả ghi `start` khi
// nhận lời gọi `machine:` và `end` sau một nhịp setTimeout — hai khoảng [start,end]
// chồng nhau hay không là quan hệ thứ tự trên mảng sự kiện, không phụ thuộc máy nhanh
// hay chậm. Đột biến chạy trên BẢN SAO TRONG BỘ NHỚ (`srcOverride` của harness); mỗi
// kim khẳng định khớp ĐÚNG MỘT lần trong nguồn thật trước khi tin màu đỏ.
// Tên ca là hợp đồng với khoá executor `tcc_suite_tuan_tu` trong _acceptance/config.yaml.
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const SUITES = ['suite-a', 'suite-b', 'suite-c'];

const buildArgs = (over = {}) => ({
  slug: 'demo-suite-tuan-tu',
  round: 1,
  riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'eval-1', ref: 'config:executors.script.e1', expected: 'ok' },
    { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: 'eval-2', ref: 'config:executors.script.e2', expected: 'ok' },
  ],
  suiteCommands: [...SUITES],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-09-17T10:00:00Z',
  ...over,
});

// ketQua: map cmd → kết quả máy (mặc định xanh). Mọi lời gọi `machine:` ghi cờ thứ tự.
const responder = (events, ketQua = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) {
    const cmd = l.slice('machine:'.length).replace(/#\d+$/, '');
    events.push({ cmd, ev: 'start' });
    return new Promise(r => setTimeout(() => {
      events.push({ cmd, ev: 'end' });
      r(ketQua[cmd] || { exitCode: 0, outputTail: 'green', runId: '', cannotRun: false });
    }, 30));
  }
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};

const idx = (events, cmd, ev) => events.findIndex(e => e.cmd === cmd && e.ev === ev);
// Hai khoảng [start,end] của hai lệnh KHÔNG chồng: một cái kết thúc trước khi cái kia bắt đầu.
const khongChong = (events, a, b) => {
  const [sa, ea, sb, eb] = [idx(events, a, 'start'), idx(events, a, 'end'), idx(events, b, 'start'), idx(events, b, 'end')];
  if ([sa, ea, sb, eb].some(i => i === -1)) return false; // lệnh không chạy thì không kết luận «không chồng»
  return ea < sb || eb < sa;
};
// Phép kiểm của ST1: với mọi cặp lệnh suite liền nhau, lệnh sau chỉ BẮT ĐẦU sau khi lệnh
// trước KẾT THÚC.
const suiteTuanTu = (events, suites = SUITES) => suites.every((s, i) => i === 0
  || (idx(events, suites[i - 1], 'end') !== -1 && idx(events, s, 'start') > idx(events, suites[i - 1], 'end')));

// ── Kim đột biến ─────────────────────────────────────────────────────────────
const KIM_TT = 'const cmdTuanTu = distinctCmds.filter(c => SUITE_SET.has(c));';
const KIM_SS = 'const cmdSongSong = distinctCmds.filter(c => !SUITE_SET.has(c));';
const soLan = (hay, kim) => hay.split(kim).length - 1;
const kimMotLan = soLan(SRC, KIM_TT) === 1 && soLan(SRC, KIM_SS) === 1;
// ST4: khôi phục mảng phẳng — mọi lệnh vào nhánh song song.
const MUTANT_PHANG = SRC.replace(KIM_TT, 'const cmdTuanTu = [];').replace(KIM_SS, 'const cmdSongSong = distinctCmds;');
// ST5: phân nhóm theo «lệnh không có eval đi kèm» (đúng hình dạng phản biện F1 bác).
const MUTANT_KHONG_EVAL = SRC
  .replace(KIM_TT, 'const cmdTuanTu = distinctCmds.filter(c => (byCmd.get(c) || []).length === 0);')
  .replace(KIM_SS, 'const cmdSongSong = distinctCmds.filter(c => (byCmd.get(c) || []).length > 0);');

const run = async (args, ketQua, src) => {
  const events = [];
  const out = await runWorkflow(WF, args, responder(events, ketQua), src);
  return { ...out, events };
};

console.log('ST0 doi chung duong: 2 lenh eval + 3 lenh suite deu duoc dispatch');
const that = await run(buildArgs());
{
  const machine = that.calls.filter(c => c.label.startsWith('machine:')).map(c => c.label).sort();
  check('ST0 du 5 loi goi machine: (2 eval + 3 suite)',
    machine.length === 5 && JSON.stringify(machine) === JSON.stringify(['machine:eval-1', 'machine:eval-2', 'machine:suite-a', 'machine:suite-b', 'machine:suite-c'])
      && that.events.filter(e => e.ev === 'end').length === 5,
    JSON.stringify(machine));
}

console.log('ST1 lenh suite sau chi bat dau khi lenh truoc da ket thuc');
check('ST1 ba lenh suite tuan tu — khong cap nao chong nhau',
  suiteTuanTu(that.events) && khongChong(that.events, 'suite-a', 'suite-c'),
  JSON.stringify(that.events));

console.log('ST2 hai lenh eval van chong nhau (tuan tu khong lan sang eval)');
{
  const firstEnd = that.events.findIndex(e => e.ev === 'end');
  const s1 = idx(that.events, 'eval-1', 'start');
  const s2 = idx(that.events, 'eval-2', 'start');
  check('ST2 start cua ca hai lenh eval dung truoc end dau tien',
    firstEnd !== -1 && s1 !== -1 && s2 !== -1 && s1 < firstEnd && s2 < firstEnd,
    `s1=${s1} s2=${s2} firstEnd=${firstEnd}`);
}

console.log('ST3 chay kho in hai nhom; cung bo ket qua -> verdict/failedEvals/blocked nhu mang phang');
{
  const { result: dry, calls: dryCalls } = await runWorkflow(WF, buildArgs({ dryRun: true }), responder([]));
  const g = dry.commandGroups || {};
  const ss = Array.isArray(g.songSong) ? g.songSong : null;
  const tt = Array.isArray(g.tuanTu) ? g.tuanTu : null;
  const nhomDung = !!ss && !!tt && dryCalls.length === 0
    && dry.distinctCommands.every(c => (ss.includes(c) ? 1 : 0) + (tt.includes(c) ? 1 : 0) === 1)
    && ss.length + tt.length === dry.distinctCommands.length
    && JSON.stringify([...tt]) === JSON.stringify(SUITES)
    && JSON.stringify([...ss].sort()) === JSON.stringify(['eval-1', 'eval-2']);
  // Hai bộ kết quả: toàn xanh, và hỗn hợp (một eval đỏ + một suite không chạy được).
  const boKetQua = [
    {},
    { 'eval-1': { exitCode: 1, outputTail: '1 failing', runId: 'run-e1', cannotRun: false },
      'suite-b': { exitCode: 1, outputTail: '', runId: '', cannotRun: true, reason: 'thieu env' } },
  ];
  const vet = r => JSON.stringify({ verdict: r.verdict, failedEvals: r.failedEvals, blocked: r.blocked });
  const so = [];
  for (const kq of boKetQua) {
    const a = await run(buildArgs(), kq);
    const b = await run(buildArgs(), kq, MUTANT_PHANG);
    so.push({ that: vet(a.result), phang: vet(b.result) });
  }
  const giongHet = so.every(x => x.that === x.phang);
  // Đối chứng: bộ thứ hai phải THẬT SỰ khác bộ đầu — không thì «giống hệt» xanh cả khi
  // kết quả máy bị bỏ qua.
  const khacNhau = so[0].that !== so[1].that;
  check('ST3 commandGroups hai nhom, moi lenh dung mot nhom; verdict failedEvals blocked giong mang phang',
    kimMotLan && nhomDung && giongHet && khacNhau,
    `kimMotLan=${kimMotLan} nhomDung=${nhomDung} groups=${JSON.stringify(g)} so=${JSON.stringify(so)}`);
}

console.log('ST4 chieu do: khoi phuc mang phang trong ban sao -> phep kiem ST1 do');
{
  const phang = await run(buildArgs(), {}, MUTANT_PHANG);
  const doDuoc = !suiteTuanTu(phang.events);
  if (!doDuoc) console.log('  (ban mang phang van tuan tu — phep kiem ST1 khong phan biet duoc)');
  check('ST4 khoi phuc mang phang — suite chong nhau',
    kimMotLan && MUTANT_PHANG !== SRC && suiteTuanTu(that.events) && doDuoc
      && phang.calls.filter(c => c.label.startsWith('machine:')).length === 5,
    `kimMotLan=${kimMotLan} thatXanh=${suiteTuanTu(that.events)} mutantDo=${doDuoc}`);
}

console.log('ST5 lenh vua la suite vua la lenh cua mot eval -> nhom tuan tu, khong chong suite khac');
{
  const args5 = buildArgs({ evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'eval-1', ref: 'config:executors.script.e1', expected: 'ok' },
    { id: 'E3', criterion: 'AC-3', executor: 'script', cmd: 'suite-a', ref: 'config:executors.script.suite_a', expected: 'ok' },
  ] });
  const ketLuan = async (src) => {
    const { result: dry } = await runWorkflow(WF, { ...args5, dryRun: true }, responder([]), src);
    const g = dry.commandGroups || {};
    const oTuanTu = Array.isArray(g.tuanTu) && g.tuanTu.includes('suite-a')
      && Array.isArray(g.songSong) && !g.songSong.includes('suite-a');
    const r = await run(args5, {}, src);
    const khongChongSuite = khongChong(r.events, 'suite-a', 'suite-b') && khongChong(r.events, 'suite-a', 'suite-c');
    return { oTuanTu, khongChongSuite, ok: oTuanTu && khongChongSuite };
  };
  const kThat = await ketLuan(undefined);
  const kMutant = await ketLuan(MUTANT_KHONG_EVAL);
  check('ST5 suite trung lenh eval nam o tuanTu va khong chong suite nao; mutant «khong co eval» lat ket luan',
    kimMotLan && MUTANT_KHONG_EVAL !== SRC && kThat.ok && !kMutant.ok,
    `that=${JSON.stringify(kThat)} mutant=${JSON.stringify(kMutant)}`);
}

summary('suite-tuan-tu');
