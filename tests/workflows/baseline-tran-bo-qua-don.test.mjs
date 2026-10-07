// baseline-tran-bo-qua-don.test.mjs — làn đối chứng (baseline:diffBase) có trần, bỏ qua eval mới, tự dọn.
//
// Sự cố crm 07/10 (`khung-ban-ghi-kara`, wf_f425c910-a3b): tác tử baseline tự chế vòng `while read …
// bash -c "…$c"` — lệnh ấy chờ một hộp xin quyền 5 giờ (nhật ký app: «Emitted tool permission request»
// 22:45:15, owner bấm 03:45:17 giờ máy), giữ khoá s4, không ra báo cáo, để lại worktree tạm. Tám lệnh
// đầu còn đo tệp kiểm chưa có ở merge-base («had no matches»).
//
//   BH* — hình dạng lệnh kit sinh (không còn hình dạng tự chế nào; mọi lệnh eval có mặt nguyên văn)
//   BT* — (a) trần mỗi lệnh + trần tổng, chạy bằng shell THẬT (bash + zsh nếu có)
//   BB* — (a) lane chạm trần/không về → BLOCKED hạ tầng có tên, lượt vẫn ra báo cáo
//   BQ* — (b) tệp lệnh trỏ tới có ở HEAD mà không có ở merge-base → bỏ qua, lý do vào báo cáo
//   BD* — (c) bị dừng (TERM) → worktree tạm gỡ; bị giết cứng (KILL) → lượt sau quét mồ côi; worktree
//         của một lượt CÒN SỐNG thì không bị quét (chiều im)
// Lệnh RÚT TỪ PROMPT của lane — không viết tay. Mọi đường dẫn suy từ vị trí tệp.
import { fileURLToPath } from 'node:url';
import { readFileSync, mkdtempSync, rmSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const soLan = (hay, kim) => hay.split(kim).length - 1;
const ngu = ms => new Promise(r => setTimeout(r, ms));
const ZSH = ['/bin/zsh', '/usr/bin/zsh'].find(p => existsSync(p));
const SHELLS = ['bash', ...(ZSH ? [ZSH] : [])];
if (!ZSH) console.log('  (zsh vắng trên máy này — ca shell chỉ chạy bash)');

const ev = (id, cmd, extra = {}) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok', ...extra });
const buildArgs = (over = {}) => ({
  slug: 'demo', round: 1, riskTier: 'T2', evals: [], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md', invokedAt: '2026-10-08T00:00:00Z', evalsHash: 'h1', ...over,
});
const responder = ({ baseline } = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'green\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l === 'baseline:diffBase') return typeof baseline === 'function' ? baseline(call) : (baseline === undefined ? { results: [] } : baseline);
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};
const MO = '<<<AGK-BASELINE\n', DONG = '\nAGK-BASELINE>>>';
const lenhCua = (calls) => {
  const p = (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
  const a = p.indexOf(MO), b = p.indexOf(DONG);
  return a >= 0 && b > a ? p.slice(a + MO.length, b) : '';
};
const synthCua = (calls) => (calls.find(c => c.label === 'synthesize:report') || {}).prompt || '';
const baselineLog = (result) => (result.runLog || []).map(l => JSON.parse(l)).filter(o => o.kind === 'baseline');
// Thay hằng số trần trong lệnh RÚT từ prompt — khẳng định khớp ĐÚNG MỘT lần trước khi tin.
const doiTran = (lenh, ten, giay) => {
  const kim = new RegExp(`\\b${ten}=\\d+;`);
  if (soLan(lenh, (lenh.match(kim) || [''])[0]) !== 1 || !kim.test(lenh)) throw new Error(`khong thay ${ten}= dung mot lan trong lenh baseline`);
  return lenh.replace(kim, `${ten}=${giay};`);
};

// Kho git thật: commit gốc `base` + commit HEAD. `cu.sh` có ở cả hai, `moi.sh` chỉ ở HEAD.
const TOKEN = String(process.pid);
function dungKho() {
  const d = mkdtempSync(path.join(tmpdir(), 'agk-bt-'));
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { stdio: 'pipe' }).toString().trim();
  g('init', '-q'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't'); g('config', 'commit.gpgsign', 'false');
  mkdirSync(path.join(d, 't'));
  writeFileSync(path.join(d, 't', 'cu.sh'), 'exit 3\n');
  writeFileSync(path.join(d, 't', 'cham.sh'), `sleep 3${TOKEN.slice(-1)}.${TOKEN}\n`);
  g('add', '-A'); g('commit', '-qm', 'base'); g('tag', 'goc');
  writeFileSync(path.join(d, 't', 'moi.sh'), `touch "${d}/moi-da-chay"\nexit 0\n`);
  g('add', '-A'); g('commit', '-qm', 'head');
  return { d, g, don: () => { try { execFileSync('git', ['-C', d, 'worktree', 'prune']); } catch {} rmSync(d, { recursive: true, force: true }); } };
}
const chamConSong = () => { try { return execFileSync('pgrep', ['-f', `sleep 3${TOKEN.slice(-1)}.${TOKEN}`]).toString().trim() !== ''; } catch { return false; } };
const worktreeTam = (kho) => kho.g('worktree', 'list', '--porcelain').split('\n').filter(l => l.startsWith('worktree ') && l.includes('agk-baseline')).map(l => l.slice(9));
// detached → tiến trình shell là trưởng nhóm; `proc.pid` = pgid để gửi tín hiệu cho CẢ nhóm như công cụ.
const chayNen = (shell, lenh, opts = {}) => {
  const t0 = process.hrtime.bigint();
  const proc = spawn(shell, ['-c', lenh], { stdio: ['ignore', 'pipe', 'pipe'], detached: true, ...opts });
  let out = '';
  proc.stdout.on('data', b => { out += b; });
  proc.stderr.on('data', b => { out += b; });
  const xong = new Promise(res => proc.on('close', (code) => res({ code, out, giay: Number(process.hrtime.bigint() - t0) / 1e9 })));
  return { proc, xong };
};
const chay = (shell, lenh, opts) => chayNen(shell, lenh, opts).xong;
const lenhChoKho = async (kho, evals) => {
  const { calls } = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, diffBase: 'goc', evals }), responder());
  return lenhCua(calls);
};

// ═════ BH — hình dạng lệnh kit sinh ══════════════════════════════════════════
console.log('BH lệnh baseline do kit sinh: mọi lệnh có mặt nguyên văn, không hình dạng tự chế');
{
  const CMDS = [
    'cd apps/app && bun test --preload ../../packages/ui/test/setup-dom.ts ./test/kara-ban-ghi.dom.tsx -t tab-rong',
    'bun run test -- "cd apps/api && bun test test/hoan-tac-thong-tin.spec.ts -t bo-qua" && cd apps/app && bun test ./test/kara-ban-ghi-de-xuat.dom.tsx -t bo-qua',
    "node _acceptance/khung-ban-ghi-kara/rang/chu-cung.mjs --ten 'co nhay'",
  ];
  const { calls } = await runWorkflow(WF, buildArgs({ evals: CMDS.map((c, i) => ev('E' + (i + 1), c)) }), responder());
  const p = (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
  const lenh = lenhCua(calls);
  check('BH1 prompt mang đúng một khối lệnh giữa hai dấu', soLan(p, MO) === 1 && soLan(p, DONG) === 1 && lenh.length > 0, `mo=${soLan(p, MO)} dong=${soLan(p, DONG)}`);
  check('BH2 mỗi lệnh eval có mặt NGUYÊN VĂN đúng một lần', CMDS.every(c => soLan(lenh, c) === 1), CMDS.map(c => soLan(lenh, c)).join(','));
  // Khung kit sinh = lệnh với MỖI lệnh eval thay bằng một token cố định (lệnh eval nằm CHUNG dòng với khung
  // của nó — lọc bỏ dòng thì mù đúng chỗ dễ chèn hình dạng bị hỏi nhất).
  const khung = CMDS.reduce((acc, c) => acc.split(c).join('__LENH_EVAL__'), lenh);
  const CAM = [/\beval\b/, /\b(bash|sh|zsh) -c\b/, /\bxargs\b/, /\bwhile\b[^\n]*\bread\b/, /<\(/];
  check('BH3 khung không eval / sh|bash|zsh -c / xargs / while-read / <( … )', lenh.length > 0 && soLan(khung, '__LENH_EVAL__') === CMDS.length && CAM.every(re => !re.test(khung)),
    CAM.filter(re => re.test(khung)).map(String).join(' '));
  check('BH4 prompt dặn MỘT lần gọi Bash, timeout 600000, trả đầu ra nguyên văn', /MOT lan goi Bash/.test(p) && /600000/.test(p) && /dauRa/.test(p));
  check('BH5b không `rm`/`rmdir` trong lệnh kit sinh (kiểm tra an toàn của Claude Code hỏi người cho xoá có đích là biến)',
    lenh.length > 0 && !/\b(rm|rmdir)\s/.test(khung));
  check('BH5 có trần mỗi lệnh và trần tổng', /\bTRAN_LENH=\d+;/.test(lenh) && /\bTRAN_TONG=\d+;/.test(lenh));
  // Đường dẫn tệp suy theo `cd` của từng phạm vi: lệnh con trong nháy có `cd` RIÊNG, không rò ra ngoài.
  check('BH6 tệp ứng viên theo đúng thư mục của phạm vi',
    lenh.includes("'apps/app/test/kara-ban-ghi.dom.tsx'") && lenh.includes("'packages/ui/test/setup-dom.ts'")
      && lenh.includes("'apps/api/test/hoan-tac-thong-tin.spec.ts'") && lenh.includes("'apps/app/test/kara-ban-ghi-de-xuat.dom.tsx'")
      && lenh.includes("'_acceptance/khung-ban-ghi-kara/rang/chu-cung.mjs'") && !lenh.includes('apps/api/apps/app'),
    (lenh.match(/'[^' ]+\.(tsx?|mjs)'/g) || []).join(' '));
}

// ═════ BT — (a) trần thời gian, shell thật ══════════════════════════════════
for (const sh of SHELLS) {
  const ten = path.basename(sh);
  console.log(`BT [${ten}] trần mỗi lệnh: lệnh treo bị dừng cả cây ở trần, lệnh sau vẫn chạy`);
  const kho = dungKho();
  try {
    let lenh = await lenhChoKho(kho, [ev('E1', 'bash t/cham.sh'), ev('E2', 'bash t/cu.sh')]);
    lenh = doiTran(lenh, 'TRAN_LENH', 2);
    const r = await chay(sh, lenh, { cwd: kho.d });
    check(`BT1 [${ten}] lệnh treo → «qua-tran», lệnh sau → «xong 3»`,
      /^__BL 1 qua-tran 2$/m.test(r.out) && /^__BL 2 xong 3$/m.test(r.out) && /^__BL_XONG$/m.test(r.out), r.out.slice(-400));
    check(`BT2 [${ten}] cả lượt kết dưới 20 giây (trần 2 giây/lệnh)`, r.giay < 20, `${r.giay.toFixed(1)}s`);
    await ngu(300);
    check(`BT3 [${ten}] tiến trình lệnh treo đã chết`, !chamConSong());
    check(`BT4 [${ten}] worktree tạm đã gỡ`, worktreeTam(kho).length === 0, worktreeTam(kho).join(','));

    console.log(`BT [${ten}] trần tổng: hết trần thì lệnh còn lại «het-tran-tong», không chạy`);
    let lenh2 = await lenhChoKho(kho, [ev('E1', 'bash t/cham.sh'), ev('E2', 'bash t/cham.sh --hai'), ev('E3', 'bash t/cu.sh')]);
    lenh2 = doiTran(doiTran(lenh2, 'TRAN_LENH', 2), 'TRAN_TONG', 3);
    const r2 = await chay(sh, lenh2, { cwd: kho.d });
    // Lệnh 2 nhận phần trần tổng CÒN LẠI (≤ 1 giây) hoặc không còn gì — cả hai đúng; lệnh 3 chắc chắn hết lượt.
    check(`BT5 [${ten}] lệnh 3 «het-tran-tong»`, /^__BL 1 qua-tran 2$/m.test(r2.out) && /^__BL 2 (qua-tran 1|het-tran-tong)$/m.test(r2.out) && /^__BL 3 het-tran-tong$/m.test(r2.out), r2.out.slice(-400));
    check(`BT6 [${ten}] trần tổng chặn thời lượng (< 20 giây)`, r2.giay < 20, `${r2.giay.toFixed(1)}s`);
    // Đối chứng dương: trần rộng thì lệnh nhanh chạy tới cùng, không bị gắn nhãn trần.
    const r3 = await chay(sh, await lenhChoKho(kho, [ev('E1', 'bash t/cu.sh')]), { cwd: kho.d });
    check(`BT7 [${ten}] đối chứng: lệnh nhanh dưới trần → «xong 3»`, /^__BL 1 xong 3$/m.test(r3.out) && !/qua-tran|het-tran-tong/.test(r3.out), r3.out.slice(-300));
  } finally { kho.don(); }
}

// ═════ BB — (a) lane không về / chạm trần → BLOCKED hạ tầng, lượt vẫn ra báo cáo ═══
console.log('BB lane baseline không về đủ → BLOCKED hạ tầng có tên, không treo lượt, không ghi dòng baseline');
{
  const evals = [ev('E1', 'bash t/a.sh'), ev('E2', 'bash t/b.sh')];
  const DU = '__BL_BAT_DAU 2\n__BL 1 xong 0\n__BL 2 xong 1\n__BL_XONG';
  const rOk = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { dauRa: DU, results: [] } }));
  check('BB0 đối chứng: đầu ra đủ dấu → dòng run-log kind:baseline được ghi', baselineLog(rOk.result).length === 1);
  check('BB0b đối chứng: JS đọc mã từ dấu (E1 xanh-cả-hai → không phân biệt)',
    rOk.result.nonDiscriminating.some(n => n.cmd === 'bash t/a.sh') && !rOk.result.nonDiscriminating.some(n => n.cmd === 'bash t/b.sh'),
    JSON.stringify(rOk.result.nonDiscriminating));
  // Dấu do JS đọc, KHÔNG phải results[] tác tử khai: tác tử khai ngược lại mà dấu nói khác → dấu thắng.
  const rNguoc = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { dauRa: DU, results: [{ cmd: 'bash t/a.sh', baselineExit: 1, cannotRun: false }] } }));
  check('BB0c dấu thắng lời khai results[] của tác tử', rNguoc.result.nonDiscriminating.some(n => n.cmd === 'bash t/a.sh'));

  const CA = {
    'thieu-dau-ket': { dauRa: '__BL_BAT_DAU 2\n__BL 1 xong 0', results: [] },
    'tac-tu-chet': null,
    'cong-cu-giet': { dauRa: '__BL_BAT_DAU 2\n__BL 1 xong 0', results: [], killedByTool: true },
    'ha-tang-worktree': { dauRa: '__BL_BAT_DAU 2\n__BL_HA_TANG worktree-add\n__BL_XONG', results: [] },
  };
  for (const [ten, bl] of Object.entries(CA)) {
    const r = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: bl }));
    const s = synthCua(r.calls);
    check(`BB1 [${ten}] lượt vẫn ra verdict + báo cáo (không BLOCKED cả lượt vì làn phụ)`, r.result.verdict === 'PASS' && r.result.report.length > 0, r.result.verdict);
    check(`BB2 [${ten}] mọi lệnh baseline n-a, không red/green giả`, !s.includes('"baseline":"red"') && !s.includes('"baseline":"green"') && s.includes('"baseline":"n-a"'));
    check(`BB3 [${ten}] lý do «BLOCKED ha tang» có tên trong prompt tổng hợp và log`, /BASELINE BLOCKED HA TANG/.test(s) && r.logs.some(l => /baseline: BLOCKED ha tang/.test(l)), r.logs.filter(l => /baseline/i.test(l)).join(' | '));
    check(`BB4 [${ten}] KHÔNG ghi dòng kind:baseline (lượt sau đo lại, không carry phép đo hỏng)`, baselineLog(r.result).length === 0);
  }
  // Chạm trần ở một lệnh: lượt vẫn đủ, nhưng không carry → lượt sau đo lại.
  const rTran = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { dauRa: '__BL_BAT_DAU 2\n__BL 1 qua-tran 180\n__BL 2 xong 1\n__BL_XONG', results: [] } }));
  const sT = synthCua(rTran.calls);
  check('BB5 lệnh chạm trần → n-a kèm lý do «vuot tran 180 giay»', sT.includes('vuot tran 180 giay') && sT.includes('"baseline":"red"'), (sT.match(/BASELINE KHONG DO[^\n]*/) || [''])[0].slice(0, 200));
  check('BB6 lệnh chạm trần → không ghi dòng kind:baseline', baselineLog(rTran.result).length === 0);
  // Đường đọc-cũ: tác tử/harness đời cũ không trả `dauRa` → đọc results[] như 2.24.0, có cờ vàng.
  const rCu = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { results: [{ cmd: 'bash t/a.sh', baselineExit: 0, cannotRun: false }, { cmd: 'bash t/b.sh', baselineExit: 1, cannotRun: false }] } }));
  check('BB7 đường đọc-cũ: không dauRa → đọc results[] + cờ vàng',
    rCu.result.nonDiscriminating.some(n => n.cmd === 'bash t/a.sh') && rCu.logs.some(l => /CO VANG: baseline khong tra dauRa/.test(l)) && baselineLog(rCu.result).length === 1,
    rCu.logs.filter(l => /baseline/i.test(l)).join(' | '));
  // Đường đọc-cũ khai THIẾU lệnh: lệnh vắng có tên, phép đo không trọn → không ghi dòng kind:baseline.
  const rRong = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { results: [] } }));
  const sR = synthCua(rRong.calls);
  check('BB8 đường đọc-cũ results rỗng → lệnh vắng có lý do, không ghi dòng kind:baseline',
    baselineLog(rRong.result).length === 0 && sR.includes('tac tu baseline khong khai ket qua cho lenh nay'), String(baselineLog(rRong.result).length));
}

// ═════ BQ — (b) tệp chưa có ở merge-base → bỏ qua, lý do vào báo cáo ═════════
for (const sh of SHELLS) {
  const ten = path.basename(sh);
  console.log(`BQ [${ten}] tệp chỉ có ở HEAD → bỏ qua, KHÔNG chạy; tệp có ở cả hai → chạy`);
  const kho = dungKho();
  try {
    const lenh = await lenhChoKho(kho, [ev('E1', 'cd t && bash ./moi.sh'), ev('E2', 'bash t/cu.sh'), ev('E3', 'bash t/khong-co-o-dau.sh')]);
    const r = await chay(sh, lenh, { cwd: kho.d });
    check(`BQ1 [${ten}] lệnh trỏ tệp mới → «bo-qua t/moi.sh»`, /^__BL 1 bo-qua t\/moi\.sh$/m.test(r.out), r.out.slice(-400));
    check(`BQ2 [${ten}] lệnh bị bỏ qua KHÔNG chạy`, !existsSync(path.join(kho.d, 'moi-da-chay')));
    check(`BQ3 [${ten}] đối chứng: tệp có ở cả hai phía → chạy thật «xong 3»`, /^__BL 2 xong 3$/m.test(r.out));
    // Chiều im: tệp vắng ở CẢ HAI phía không phải «eval mới» — lệnh vẫn chạy, mã thật lên báo cáo.
    check(`BQ4 [${ten}] tệp vắng cả hai phía → không bỏ qua, chạy thật`, /^__BL 3 xong 127$/m.test(r.out), (r.out.match(/^__BL 3 .*$/m) || [''])[0]);
    // Chiều im (phát hiện HIGH của lượt soát): tệp CÓ ở cây làm việc mà không có ở gốc nhưng không phải tệp
    // kiểm mới — bị gitignore (sản phẩm build/cài đặt), đích chuyển hướng, node_modules, .env — KHÔNG được bỏ qua.
    writeFileSync(path.join(kho.d, '.gitignore'), 'gen/\n');
    mkdirSync(path.join(kho.d, 'gen'), { recursive: true }); writeFileSync(path.join(kho.d, 'gen', 'cau-hinh.json'), '{}');
    mkdirSync(path.join(kho.d, 'node_modules', '.bin'), { recursive: true }); writeFileSync(path.join(kho.d, 'node_modules', '.bin', 'x'), '');
    mkdirSync(path.join(kho.d, 'ra'), { recursive: true }); writeFileSync(path.join(kho.d, 'ra', 'r.txt'), ''); writeFileSync(path.join(kho.d, '.env.test'), '');
    const lenhIm = await lenhChoKho(kho, [ev('E1', 'bash t/cu.sh --cau-hinh gen/cau-hinh.json --env-file .env.test > ra/r.txt'), ev('E2', 'bash t/cu.sh ./node_modules/.bin/x')]);
    const rIm = await chay(sh, lenhIm, { cwd: kho.d });
    check(`BQ8 [${ten}] tệp bị ignore / đích chuyển hướng / node_modules / .env → không bỏ qua, chạy thật`,
      /^__BL 1 xong \d+$/m.test(rIm.out) && /^__BL 2 xong 3$/m.test(rIm.out) && !/bo-qua/.test(rIm.out), rIm.out.slice(-300));
  } finally { kho.don(); }
}
{
  const evals = [ev('E1', 'cd t && bash ./moi.sh'), ev('E2', 'bash t/cu.sh')];
  const r = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { dauRa: '__BL_BAT_DAU 2\n__BL 1 bo-qua t/moi.sh\n__BL 2 xong 3\n__BL_XONG', results: [] } }));
  const s = synthCua(r.calls);
  check('BQ5 báo cáo: lý do bỏ qua có tên tệp + «chua co o merge-base»', /"cmd":"cd t && bash \.\/moi\.sh","ly_do":"[^"]*t\/moi\.sh[^"]*chua co o merge-base/.test(s), (s.match(/BASELINE KHONG DO[^\n]*/) || [''])[0].slice(0, 300));
  check('BQ6 lệnh bỏ qua → n-a, lệnh chạy → red (E2 khai 0, gốc trả 3)', /"cmd":"cd t && bash \.\/moi\.sh"[^}]*"baseline":"n-a"/.test(s) && /"cmd":"bash t\/cu\.sh"[^}]*"baseline":"red"/.test(s));
  check('BQ7 bỏ qua không phải hạ tầng: dòng kind:baseline vẫn ghi', baselineLog(r.result).length === 1);
}

// ═════ BD — (c) dọn worktree tạm khi bị dừng / hỏng ════════════════════════
for (const sh of SHELLS) {
  const ten = path.basename(sh);
  console.log(`BD [${ten}] bị TERM giữa chừng → worktree tạm và tiến trình con được dọn`);
  const kho = dungKho();
  try {
    const lenh = await lenhChoKho(kho, [ev('E1', 'bash t/cham.sh')]);
    const { proc, xong } = chayNen(sh, lenh, { cwd: kho.d });
    let thay = [];
    for (let i = 0; i < 100 && !(thay.length && chamConSong()); i++) { await ngu(100); thay = worktreeTam(kho); }
    check(`BD0 [${ten}] đối chứng dương: worktree tạm CÓ và lệnh đang chạy trước khi dừng`, thay.length === 1 && chamConSong(), thay.join(','));
    // Công cụ dừng lệnh bằng tín hiệu cho cả nhóm tiến trình — làm y như vậy.
    process.kill(-proc.pid, 'SIGTERM');
    await xong;
    await ngu(300);
    check(`BD1 [${ten}] sau TERM: worktree tạm đã gỡ khỏi git`, worktreeTam(kho).length === 0, worktreeTam(kho).join(','));
    check(`BD2 [${ten}] sau TERM: thư mục tạm đã xoá`, thay.every(w => !existsSync(w)), thay.join(','));
    check(`BD3 [${ten}] sau TERM: lệnh đang chạy đã chết`, !chamConSong());
  } finally { kho.don(); }
}

console.log('BD giết cứng (KILL) → worktree mồ côi; lượt sau quét nó, nhưng KHÔNG quét worktree của lượt còn sống');
{
  const kho = dungKho();
  try {
    const lenh = await lenhChoKho(kho, [ev('E1', 'bash t/cham.sh')]);
    const { proc, xong } = chayNen('bash', lenh, { cwd: kho.d });
    let thay = [];
    for (let i = 0; i < 100 && !(thay.length && chamConSong()); i++) { await ngu(100); thay = worktreeTam(kho); }
    process.kill(-proc.pid, 'SIGKILL');
    await xong;
    try { execFileSync('pkill', ['-f', `sleep 3${TOKEN.slice(-1)}.${TOKEN}`]); } catch {}
    check('BD4 đối chứng dương: sau KILL worktree mồ côi CÒN', worktreeTam(kho).length === 1, worktreeTam(kho).join(','));
    // Một lượt «còn sống» giả: worktree thật, tệp pid trỏ tiến trình đang sống (chính tiến trình test).
    const song = mkdtempSync(path.join(tmpdir(), 'agk-baseline.'));
    kho.g('worktree', 'add', '--detach', '--lock', '--reason', `agk-baseline pid ${process.pid}`, song, 'goc');
    const r = await chay('bash', await lenhChoKho(kho, [ev('E1', 'bash t/cu.sh')]), { cwd: kho.d });
    const con = worktreeTam(kho);
    check('BD5 lượt sau quét worktree mồ côi', thay.every(w => !con.includes(w)) && /^__BL_DON /m.test(r.out), con.join(','));
    check('BD6 chiều im: worktree của lượt CÒN SỐNG (pid trong lý do khoá) không bị quét', con.some(w => w.endsWith(path.basename(song))), con.join(','));
    check('BD7 lượt sau vẫn chạy đủ', /^__BL 1 xong 3$/m.test(r.out) && /^__BL_XONG$/m.test(r.out));
    try { kho.g('worktree', 'remove', '--force', '--force', song); } catch {}
    rmSync(song, { recursive: true, force: true });
  } finally { kho.don(); }
}

// ═════ BM — đột biến: gỡ từng mảnh của bản sửa → ca của mảnh đó phải ĐỎ ══════
// Mỗi kim khớp ĐÚNG MỘT lần trong nguồn thật trước khi tin màu đỏ (không thì đột biến không xảy ra).
const SRC = readFileSync(WF, 'utf8');
const dotBien = (kim, thay) => {
  if (soLan(SRC, kim) !== 1) throw new Error('kim dot bien khong khop dung mot lan: ' + kim.slice(0, 60));
  return SRC.replace(kim, thay);
};
const lenhTuSrc = async (kho, evals, src) => {
  const { calls } = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, diffBase: 'goc', evals }), responder(), src);
  return lenhCua(calls);
};
console.log('BM đột biến từng mảnh → ca tương ứng đỏ');
{
  const kho = dungKho();
  try {
    // (a) gỡ lính canh trần mỗi lệnh → lệnh treo chạy tới hết (bị test cắt ở 8 giây).
    const mA = dotBien('( sleep "$HL"; echo 1 > "$L.qua-tran"; dung "$P" )', '( : )');
    const lA = doiTran(await lenhTuSrc(kho, [ev('E1', 'bash t/cham.sh')], mA), 'TRAN_LENH', 2);
    const { proc, xong } = chayNen('bash', lA, { cwd: kho.d });
    const hen = setTimeout(() => { try { process.kill(-proc.pid, 'SIGKILL'); } catch {} }, 8000);
    const rA = await xong; clearTimeout(hen);
    try { execFileSync('pkill', ['-f', `sleep 3${TOKEN.slice(-1)}.${TOKEN}`]); } catch {}
    check('BM1 gỡ lính canh trần → lệnh treo không còn «qua-tran» (đỏ)', !/^__BL 1 qua-tran/m.test(rA.out) && rA.giay >= 7.5, `${rA.giay.toFixed(1)}s ${rA.out.slice(-120)}`);
    try { kho.g('worktree', 'prune'); } catch {}
    for (const w of worktreeTam(kho)) { try { kho.g('worktree', 'remove', '--force', '--force', w); } catch {} }

    // (b) gỡ phép hỏi merge-base → lệnh trỏ tệp mới chạy thật trên code cũ.
    const mB = dotBien('! git -C "$R" cat-file -e "$B:$p" 2>/dev/null', 'false');
    const rB = await chay('bash', await lenhTuSrc(kho, [ev('E1', 'cd t && bash ./moi.sh')], mB), { cwd: kho.d });
    check('BM2 gỡ phép hỏi merge-base → không còn «bo-qua» (đỏ)', !/^__BL 1 bo-qua/m.test(rB.out), rB.out.slice(-160));

    // (c) gỡ MỌI trap → bị dừng thì worktree tạm ở lại. (Gỡ riêng trap TERM không đủ ở bash: bash chạy
    // trap EXIT khi bị TERM, zsh thì không — đo 08/10; công cụ chạy lệnh trong zsh nên cần cả trap TERM.)
    const mC = dotBien("trap don EXIT; trap 'don; exit 129' HUP; trap 'don; exit 130' INT; trap 'don; exit 143' TERM", ':');
    const { proc: pC, xong: xC } = chayNen('bash', await lenhTuSrc(kho, [ev('E1', 'bash t/cham.sh')], mC), { cwd: kho.d });
    for (let i = 0; i < 100 && !(worktreeTam(kho).length && chamConSong()); i++) await ngu(100);
    process.kill(-pC.pid, 'SIGTERM'); await xC; await ngu(300);
    try { execFileSync('pkill', ['-f', `sleep 3${TOKEN.slice(-1)}.${TOKEN}`]); } catch {}
    check('BM3 gỡ mọi trap → worktree tạm ở lại sau khi bị dừng (đỏ)', worktreeTam(kho).length === 1, worktreeTam(kho).join(','));

    // (c') gỡ phép kiểm pid sống của bước quét → worktree mồ côi (vừa để lại ở BM3) KHÔNG bị quét khi coi mọi pid là sống.
    const mD = dotBien('if [ -n "$P0" ] && kill -0 "$P0" 2>/dev/null; then :; else', 'if true; then :; else');
    // Đối chứng cho BM4: mồ côi của BM3 có khoá mang pid của lượt ĐÃ CHẾT — bản thật phải quét được nó.
    const truoc = worktreeTam(kho);
    const rD = await chay('bash', await lenhTuSrc(kho, [ev('E1', 'bash t/cu.sh')], mD), { cwd: kho.d });
    check('BM4 bước quét coi mọi lượt là sống → mồ côi KHÔNG được dọn (đỏ)', truoc.length === 1 && worktreeTam(kho).includes(truoc[0]) && !/^__BL_DON /m.test(rD.out), worktreeTam(kho).join(','));
  } finally {
    for (const w of worktreeTam(kho)) { try { kho.g('worktree', 'remove', '--force', '--force', w); } catch {} rmSync(w, { recursive: true, force: true }); }
    kho.don();
  }
  // (b') gỡ phép hỏi gitignore → tệp sinh ra bị bỏ qua nhầm.
  {
    const k2 = dungKho();
    try {
      writeFileSync(path.join(k2.d, '.gitignore'), 'gen/\n');
      mkdirSync(path.join(k2.d, 'gen')); writeFileSync(path.join(k2.d, 'gen', 'cau-hinh.json'), '{}');
      const mF = dotBien('! git -C "$R" check-ignore -q -- "$p" 2>/dev/null && ', '');
      const rF = await chay('bash', await lenhTuSrc(k2, [ev('E1', 'bash t/cu.sh gen/cau-hinh.json')], mF), { cwd: k2.d });
      check('BM6 gỡ phép hỏi gitignore → tệp sinh ra bị bỏ qua nhầm (đỏ)', /^__BL 1 bo-qua gen\/cau-hinh\.json$/m.test(rF.out), rF.out.slice(-160));
    } finally { k2.don(); }
  }
  // (JS) phép đo chạm trần bị coi là trọn → ghi dòng kind:baseline.
  const mG = dotBien('!baselineKetQua.some(b => b && (b.tran || b.thieu))', 'true');
  const rG = await runWorkflow(WF, buildArgs({ evals: [ev('E1', 'bash t/a.sh'), ev('E2', 'bash t/b.sh')] }), responder({ baseline: { dauRa: '__BL_BAT_DAU 2\n__BL 1 qua-tran 180\n__BL 2 xong 1\n__BL_XONG', results: [] } }), mG);
  check('BM7 bỏ điều kiện «không chạm trần» → phép đo chạm trần được ghi dòng kind:baseline (đỏ)', baselineLog(rG.result).length === 1);
  // (JS) bộ đọc bỏ điều kiện `__BL_XONG` → đầu ra cụt bị đọc như phép đo trọn.
  const mE = dotBien("const du = new RegExp(`^${DAU_BL}_XONG$`, 'm').test(s) && !haTang", 'const du = !haTang');
  const evals = [ev('E1', 'bash t/a.sh'), ev('E2', 'bash t/b.sh')];
  const rE = await runWorkflow(WF, buildArgs({ evals }), responder({ baseline: { dauRa: '__BL_BAT_DAU 2\n__BL 1 xong 0', results: [] } }), mE);
  check('BM5 bộ đọc bỏ điều kiện dòng kết → đầu ra cụt được ghi thành dòng kind:baseline (đỏ)', baselineLog(rE.result).length === 1);
}

summary('baseline-tran-bo-qua-don');
