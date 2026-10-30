// doi-chung-chay-duoc.test.mjs — làn đối chứng của lượt chấm chạy được bằng tác tử KHÔNG cầm bút (hồ sơ
// doi-chung-chay-duoc, hàng TC6).
//
// Sự cố: từ 23/10 đề bài làn đối chứng bảo tác tử «dùng công cụ ghi tệp (Write)», mà vai baseline chạy bằng loại
// tác tử feature-loop:cham-lenh (Bash, Read, Grep, Glob — hồ sơ tac-tu-cham-chi-cham-khong). Mọi lượt ra «No such tool
// available: Write», đối chứng không chạy dòng nào, ở mọi kho. Ca 23/10 (BW1e) chỉ soi chữ trong đề bài.
//
// «Tác tử» ở đây là bộ mô phỏng TẤT ĐỊNH của loại cham-lenh: bộ công cụ đọc từ feature-loop/agents/cham-lenh.md; đề
// bài nhắc một công cụ ngoài bộ ấy → trả đúng chữ lỗi harness thật trả (đo 29/10 bằng tác tử cham-lenh thật); còn
// lại → chạy NGUYÊN VĂN các khối lệnh của đề bài trong shell thật trên kho git thật. Kho, kịch bản, đầu ra đều do mã
// sinh trong lượt chạy; đường suy từ vị trí tệp.
//
//   DC1 — đề bài: bước ghi là lời gọi Bash với lệnh kit sinh, không nhắc công cụ ghi tệp
//   DC2 — shell thật (bash, zsh): lệnh ghi tạo tệp đúng từng byte, lời gọi ra đủ dấu, cây sạch
//   DC3 — chép sai một byte / bỏ một dòng → «__BL_GHI sai», kịch bản không chạy, BLOCKED hạ tầng có tên; lành → im;
//         tác tử bỏ/viết lại dòng so dấu kiểm hay mất dòng mở → không tin; lời gọi ghi bị từ chối → lý do mang chữ ấy
//   DC4 — lượt mẫu: eval xanh cả hai phía → không phân biệt (green)
//   DC5 — lượt mẫu: eval đỏ ở gốc xanh ở đầu → phân biệt (red), phép đo trọn
//   DC6 — đối chứng: bộ chấm của commit trước sửa, cùng mẫu, cùng tác tử → BLOCKED «No such tool available: Write»
//   DC7 — mọi vai: đề bài không nhắc công cụ mà loại tác tử của vai không có; vai chấm không cầm bút
//   DC8 — lệnh eval mang một dòng trùng dấu kết heredoc → kit đổi dấu; tệp vẫn đúng từng byte
//   DC9 — bản ghi đầu ra của tác tử cham-lenh THẬT (evidence/tac-tu-that.json) qua bộ đọc thật: đề bài mới đo trọn,
//         đề bài cũ ra đúng chữ lỗi Write
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { runWorkflow, check, summary, lenhGhiBaseline, kichBanTuLenhGhi, dongGhiDung } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = fs.readFileSync(WF, 'utf8');
const AGENTS = path.join(ROOT, 'feature-loop', 'agents');
// Commit cuối của nhánh chính TRƯỚC bản sửa (gói đợt tinh-chinh-2610, 29/10) — bộ chấm ở đó còn dặn «Write».
const GOC_CU = 'd3cfca5c';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-dc-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const w = (d, rel, s) => { const p = path.join(d, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); return p; };
const soLan = (hay, kim) => hay.split(kim).length - 1;

// ── bộ công cụ của loại tác tử — đọc từ tệp loại, không giữ bản chép ─────────────
const TU_VUNG = ['Bash', 'Read', 'Grep', 'Glob', 'Write', 'Edit', 'NotebookEdit', 'WebFetch', 'WebSearch'];
const CAM_BUT = ['Write', 'Edit', 'NotebookEdit'];
function congCuTuMd(md) {
  const fm = (md.match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const ds = k => ((fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1] || '').split(',').map(s => s.trim()).filter(Boolean);
  const co = ds('tools'), cam = ds('disallowedTools');
  return new Set(co.length ? co : TU_VUNG.filter(t => !cam.includes(t)));
}
const congCuCua = loai => {
  const ten = String(loai || '').replace(/^feature-loop:/, '');
  return congCuTuMd(fs.readFileSync(path.join(AGENTS, `${ten}.md`), 'utf8'));
};
const congCuNhac = prompt => TU_VUNG.filter(t => new RegExp(`\\b${t}\\b`).test(prompt));
// Chữ lỗi harness trả khi tác tử gọi công cụ nó không có — nguyên văn đo 29/10 (tác tử cham-lenh thật).
const loiThieu = t => `<tool_use_error>Error: No such tool available: ${t}. ${t} is not among the tools available here. Continue with the tools you have.</tool_use_error>`;
// Bản ghi tác tử thật của hồ sơ (DC9): khi có, chữ lỗi «Write» lấy từ đầu ra tác tử thật thay cho khuôn trên.
const BAN_GHI = path.join(ROOT, '_acceptance', 'doi-chung-chay-duoc', 'evidence', 'tac-tu-that.json');
const GHI_THAT = fs.existsSync(BAN_GHI) ? JSON.parse(fs.readFileSync(BAN_GHI, 'utf8')) : null;
const LOI_THAT = GHI_THAT && GHI_THAT.cu && /No such tool available: Write/.test(GHI_THAT.cu.dauRa) ? { Write: GHI_THAT.cu.dauRa } : {};

const giua = (p, mo, dong) => { const a = p.indexOf(mo), b = p.indexOf(dong, a + mo.length); return a >= 0 && b > a ? p.slice(a + mo.length, b) : ''; };
const loiGoiCua = p => giua(p, '<<<AGK-BASELINE-GOI\n', '\nAGK-BASELINE-GOI>>>');
const sh = (vo, lenh, cwd) => { const r = spawnSync(vo, ['-c', lenh], { cwd, encoding: 'utf8', timeout: 120000 }); return { out: (r.stdout || '') + (r.stderr || ''), code: r.status }; };

// Tác tử mô phỏng chỉ-Bash của vai baseline: thiếu công cụ → chữ lỗi; đủ → chạy lệnh ghi (nếu có) rồi lời gọi.
const tacTuBaseline = (cwd, { vo = 'bash', suaGhi, tuChoiGhi } = {}) => (call) => {
  const co = congCuCua(call.opts.agentType || 'feature-loop:cham-lenh');
  const thieu = congCuNhac(call.prompt).filter(t => !co.has(t));
  if (thieu.length) return { dauRa: (LOI_THAT[thieu[0]] || loiThieu(thieu[0])), results: [] };
  // Bộ canh từ chối lời gọi ghi → đề bài dặn trả nguyên chữ công cụ rồi DỪNG.
  if (tuChoiGhi && lenhGhiBaseline(call.prompt)) return { dauRa: tuChoiGhi, results: [] };
  let ghi = lenhGhiBaseline(call.prompt);
  if (suaGhi) ghi = suaGhi(ghi);
  const r1 = ghi ? sh(vo, ghi, cwd) : { out: '' };
  const r2 = sh(vo, loiGoiCua(call.prompt), cwd);
  return { dauRa: r1.out + r2.out, results: [] };
};
const ev = (id, cmd) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok' });
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const INVOKED = '2026-10-29T05:30:00Z';
const buildArgs = (over = {}) => ({
  slug: 'mau', round: 1, riskTier: 'T2', evals: [], suiteCommands: [], diffBase: 'goc', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  invokedAt: INVOKED, invokedSha: VC, evalsHash: 'h1', ...over,
});
// Vai máy chạy CHÍNH lệnh eval ở HEAD của kho mẫu — mã thoát thật, không đóng khung.
const responder = (cwd, baseline) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) { const cmd = l.slice('machine:'.length); const r = sh('bash', cmd, cwd); return { exitCode: r.code, outputTail: `${r.out}\n__EXIT=${r.code}`, runId: '', cannotRun: false }; }
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l === 'baseline:diffBase') return baseline(call);
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence mau', findings: '# Findings mau' };
  throw new Error('unexpected agent label: ' + l);
};
const dongLog = (result, kind) => (result.runLog || []).map(l => JSON.parse(l)).filter(o => o.kind === kind);
// Cột đối chứng từng lệnh máy — đúng dòng bộ chấm đưa tác tử tổng hợp (bên đọc của báo cáo).
const cotDoiChung = calls => {
  const p = (calls.find(c => c.label === 'synthesize:report') || {}).prompt || '';
  const dong = (p.split('\n').find(x => x.includes('KHONG bia)): ')) || '');
  try { return new Map(JSON.parse(dong.slice(dong.indexOf('KHONG bia)): ') + 'KHONG bia)): '.length)).map(m => [m.cmd, m.baseline])); } catch { return new Map(); }
};

// Kho mẫu: ở gốc `xanh.sh` thoát 0, `do.sh` thoát 1; ở đầu `do.sh` được sửa thành thoát 0.
function dungKho() {
  const d = fs.mkdtempSync(path.join(TMP, 'kho-'));
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { stdio: 'pipe' }).toString().trim();
  g('init', '-q'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't'); g('config', 'commit.gpgsign', 'false');
  w(d, 't/xanh.sh', 'exit 0\n'); w(d, 't/do.sh', 'exit 1\n');
  g('add', '-A'); g('commit', '-qm', 'goc'); g('tag', 'goc');
  w(d, 't/do.sh', 'exit 0\n');
  g('add', '-A'); g('commit', '-qm', 'dau');
  return { d, g };
}
const EV_MAU = [ev('E1', 'bash t/xanh.sh'), ev('E2', 'bash t/do.sh')];

// ═════ DC1 — đề bài ═══════════════════════════════════════════════════════════
console.log('DC1 đề bài: bước ghi là lời gọi Bash với lệnh kit sinh, không nhắc công cụ ghi tệp');
{
  const { calls } = await runWorkflow(WF, buildArgs({ evals: EV_MAU }), responder('/', () => ({ dauRa: '', results: [] })));
  const p = (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
  const ghi = lenhGhiBaseline(p), dau = ghi.split('\n')[0] || '';
  const tep = (loiGoiCua(p).match(/^bash '([^']+)'$/) || [])[1] || '';
  check('DC1a đúng một khối lệnh ghi, mở bằng mkdir + heredoc có nháy vào đúng tệp của lời gọi',
    soLan(p, '<<<AGK-BASELINE-GHI\n') === 1 && !!tep && dau.startsWith(`mkdir -p '`) && dau.endsWith(`cat > '${tep}' <<'AGK_HET_KICH_BAN'`), dau);
  check('DC1b dòng cuối lệnh ghi so cksum với số kit tính, lệch thì đổi tên .sai (không rm)',
    /if \[ "\$C" = '\d+ \d+' \]; then echo "__BL_GHI dung \$C"; else mv -f '[^']+' '[^']+\.sai'/.test(ghi.split('\n').pop()) && !/\brm(dir)?\b/.test(ghi.split('\n').pop()), ghi.split('\n').pop());
  const nhac = CAM_BUT.filter(t => new RegExp(`\\b${t}\\b`).test(p));
  check('DC1c đề bài không nhắc công cụ ghi/sửa tệp nào', nhac.length === 0, nhac.join(','));
  check('DC1d đề bài dặn đúng HAI lời gọi Bash, trả đầu ra của cả hai', (p.match(/MOT lan goi Bash/g) || []).length === 2 && /ket qua cua lan goi Bash o buoc 1, roi ket qua cua lan goi Bash o buoc 2/.test(p), '');
}

// ═════ DC2 — shell thật, bash và zsh ═════════════════════════════════════════
console.log('DC2 lệnh ghi chạy thật: tệp đúng từng byte, lời gọi đủ dấu, cây sạch');
for (const vo of ['bash', 'zsh']) {
  const coVo = spawnSync(vo, ['-c', 'exit 0']).status === 0;
  if (!coVo) { console.log(`  BỎ QUA DC2-${vo}: không đọc được ở đây — ${vo} vắng trên máy này`); continue; }
  const kho = dungKho();
  // Lấy đề bài thật của lượt rồi đóng vai tác tử bằng tay trên đúng vỏ đang thử (bộ mô phỏng chung chạy bash).
  const { calls } = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: [ev('E1', 'bash t/do.sh')] }), responder(kho.d, () => ({ dauRa: '', results: [] })));
  const p = (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
  const tep = (loiGoiCua(p).match(/^bash '([^']+)'$/) || [])[1] || '';
  const ghiThay = lenhGhiBaseline(p), kb = kichBanTuLenhGhi(ghiThay);
  const truoc = kho.g('status', '--porcelain', '--ignored', '--untracked-files=all');
  const r1 = sh(vo, ghiThay, kho.d);
  const tren = fs.existsSync(tep) ? fs.readFileSync(tep, 'utf8') : '';
  const kt = vo === 'bash' ? 'DC2a' : 'DC2b';
  check(`${kt} ${vo}: tệp kịch bản = thân heredoc + một dòng mới, đúng từng byte; lệnh ghi in «__BL_GHI dung <số kit tính>»`,
    kb.length > 0 && tren === kb + '\n' && r1.out.split('\n').includes(dongGhiDung(p)) && dongGhiDung(p) !== '', r1.out.slice(0, 200));
  const r2 = sh(vo, loiGoiCua(p), kho.d);
  check(`${kt}-goi ${vo}: lời gọi ra đủ dấu — bắt đầu · «xong 1» trên gốc · kết; worktree tạm đã gỡ; cây sạch`,
    /^__BL_BAT_DAU 1$/m.test(r2.out) && /^__BL 1 xong 1$/m.test(r2.out) && /^__BL_XONG$/m.test(r2.out)
      && !kho.g('worktree', 'list', '--porcelain').includes('agk-baseline') && kho.g('status', '--porcelain') === '', r2.out.slice(-200) + ' | ' + kho.g('status', '--porcelain'));
  // Vế «không ghi vào cây kho»: mọi thứ làn ghi (kể cả tệp bị bỏ qua) nằm dưới .acceptance-runs/ — vùng tạo phẩm
  // của lượt chấm, ngoài phần vật/thước mà ca cây-đổi-trong-lượt canh.
  const sau = kho.g('status', '--porcelain', '--ignored', '--untracked-files=all');
  const moi = sau.split('\n').filter(x => x && !truoc.split('\n').includes(x));
  check(`${kt}-cay ${vo}: mọi tệp mới (kể cả bị bỏ qua) nằm dưới .acceptance-runs/; tệp kịch bản ở đó`,
    moi.length > 0 && moi.every(x => / \.acceptance-runs\//.test(x) || /^!! \.acceptance-runs\/$/.test(x)) && tep.startsWith(path.join(kho.d, '.acceptance-runs') + '/'), moi.join(' | '));
}

// Đột biến: thư mục lượt dời ra ngoài .acceptance-runs/ → phép «chỉ ghi dưới .acceptance-runs/» phải đỏ.
{
  const kim = "const BL_DIR = `${args.repoRoot}/.acceptance-runs/${args.slug}/s4-baseline/${NHAN_LUOT}`";
  const mSrc = SRC.replace(kim, "const BL_DIR = `${args.repoRoot}/s4-baseline-tam/${NHAN_LUOT}`");
  const kho = dungKho();
  const { calls } = mSrc !== SRC ? await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: [ev('E1', 'bash t/do.sh')] }), responder(kho.d, () => ({ dauRa: '', results: [] })), mSrc) : { calls: [] };
  const p = (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
  const truoc = kho.g('status', '--porcelain', '--ignored', '--untracked-files=all');
  sh('bash', lenhGhiBaseline(p), kho.d); sh('bash', loiGoiCua(p), kho.d);
  const moi = kho.g('status', '--porcelain', '--ignored', '--untracked-files=all').split('\n').filter(x => x && !truoc.split('\n').includes(x));
  check('DC2c đột biến dời thư mục lượt ra ngoài .acceptance-runs/ → có tệp mới ngoài vùng tạo phẩm (phép DC2-cay đỏ)',
    mSrc !== SRC && moi.some(x => !/ \.acceptance-runs\//.test(x)), moi.join(' | ') || (mSrc === SRC ? 'không tiêm được' : 'không tệp mới'));
}

// ═════ DC3 — chép sai bị chặn ════════════════════════════════════════════════
console.log('DC3 chép sai một byte hay bỏ một dòng → __BL_GHI sai, kịch bản không chạy, BLOCKED có tên; lành → im');
{
  const sai = {
    'mot-byte': g => { const d = g.split('\n'); d[2] = d[2].replace('HAN=', 'HAM='); return d.join('\n'); },
    'bo-dong': g => { const d = g.split('\n'); d.splice(3, 1); return d.join('\n'); },
  };
  const loi = [];
  for (const [ten, suaGhi] of Object.entries(sai)) {
    const kho = dungKho();
    const r = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: EV_MAU }), responder(kho.d, tacTuBaseline(kho.d, { suaGhi })));
    const hd = r.result.baselineKhongDo || {};
    const d = dongLog(r.result, 'baseline-khong-do');
    const p = (r.calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
    const tep = (loiGoiCua(p).match(/^bash '([^']+)'$/) || [])[1] || '';
    if (!/^tac tu chep kich ban doi chung sai \(dau kiem tep vua ghi: «\d+ \d+», kit tinh \d+ \d+\)/.test(hd.haTang || '')) loi.push(`${ten}: haTang «${hd.haTang}»`);
    if (d.length !== 1 || d[0].chua_chay !== true) loi.push(`${ten}: dòng baseline-khong-do ${JSON.stringify(d)}`);
    if (dongLog(r.result, 'baseline').length) loi.push(`${ten}: ghi dòng kind:baseline cho phép đo không chạy`);
    if (fs.existsSync(tep) || !fs.existsSync(tep + '.sai')) loi.push(`${ten}: tệp lời gọi còn đó hoặc thiếu .sai`);
    if (r.result.nonDiscriminating.length) loi.push(`${ten}: vẫn liệt eval không phân biệt`);
    if (kho.g('status', '--porcelain') !== '') loi.push(`${ten}: cây bẩn «${kho.g('status', '--porcelain')}»`);
  }
  check('DC3a mỗi kiểu chép sai: BLOCKED hạ tầng «tác tử chép kịch bản sai», chưa chạy dòng nào, tệp → .sai, cây sạch', loi.length === 0, loi.join(' | '));
  // Chiều im: chép lành cùng kho → không lý do, có dòng kind:baseline.
  const kho = dungKho();
  const r = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: EV_MAU }), responder(kho.d, tacTuBaseline(kho.d)));
  check('DC3b chép lành: không lý do hạ tầng, không dòng baseline-khong-do, có dòng kind:baseline',
    (r.result.baselineKhongDo || {}).haTang === null && !dongLog(r.result, 'baseline-khong-do').length && dongLog(r.result, 'baseline').length === 1, JSON.stringify(r.result.baselineKhongDo));
  // Tác tử «gọn hoá» lệnh ghi (gap-probe F1): bộ đọc mặc định không tin — thiếu dòng xác nhận đúng số là hạ tầng.
  const gon = {
    'bo-dong-so': [g => g.split('\n').slice(0, -1).join('\n'), /^lenh ghi khong xac nhan dau kiem \d+ \d+ \(dong __BL_GHI dung vang\)/],
    'echo-dung': [g => g.split('\n').slice(0, -1).concat('echo "__BL_GHI dung"').join('\n'), /^lenh ghi khong xac nhan dau kiem \d+ \d+ \(dong __BL_GHI dung «»\)/],
    'mat-dong-mo': [g => g.split('\n').slice(1).join('\n'), /^tac tu chep kich ban doi chung sai/],
  };
  const loiGon = [];
  for (const [ten, [suaGhi, ly]] of Object.entries(gon)) {
    const k = dungKho();
    const rr = await runWorkflow(WF, buildArgs({ repoRoot: k.d, evals: EV_MAU }), responder(k.d, tacTuBaseline(k.d, { suaGhi })));
    const ht = (rr.result.baselineKhongDo || {}).haTang || '';
    if (!ly.test(ht)) loiGon.push(`${ten}: «${ht}»`);
    if (dongLog(rr.result, 'baseline').length || dongLog(rr.result, 'baseline-khong-do').length !== 1) loiGon.push(`${ten}: dòng run-log sai`);
    if (rr.result.nonDiscriminating.length) loiGon.push(`${ten}: vẫn liệt eval không phân biệt`);
  }
  check('DC3c gọn hoá lệnh ghi (bỏ dòng so · thay bằng echo dung · mất dòng mở) → đúng lý do từng kiểu, 0 dòng kind:baseline, không phân loại', loiGon.length === 0, loiGon.join(' | '));
  // Bộ canh từ chối lời gọi ghi (gap-probe F5): lý do + dòng run-log mang nguyên chữ từ chối — ngưỡng mở lại đếm được.
  const TU_CHOI = 'Permission to use Bash with command mkdir has been denied by the command guard (thu nghiem DC3d).';
  const k = dungKho();
  const rt = await runWorkflow(WF, buildArgs({ repoRoot: k.d, evals: EV_MAU }), responder(k.d, tacTuBaseline(k.d, { tuChoiGhi: TU_CHOI })));
  const dt = dongLog(rt.result, 'baseline-khong-do');
  check('DC3d lời gọi ghi bị từ chối → lý do «chưa chạy dòng nào» mang nguyên chữ từ chối, dòng baseline-khong-do mang chữ ấy',
    ((rt.result.baselineKhongDo || {}).haTang || '').includes(TU_CHOI) && dt.length === 1 && dt[0].chua_chay === true && String(dt[0].ly_do || '').includes(TU_CHOI), JSON.stringify(dt));
}

// ═════ DC4–DC5 — lượt mẫu với bộ chấm sau sửa ════════════════════════════════
console.log('DC4–DC5 lượt mẫu: tác tử chỉ-Bash, eval xanh cả hai phía vs đỏ ở gốc');
{
  const kho = dungKho();
  const r = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: EV_MAU }), responder(kho.d, tacTuBaseline(kho.d)));
  const cot = cotDoiChung(r.calls);
  const kd = r.result.nonDiscriminating.map(m => m.cmd);
  check('DC4a eval xanh ở gốc và đầu → nằm trong danh sách không phân biệt; cột đối chứng green',
    kd.includes('bash t/xanh.sh') && cot.get('bash t/xanh.sh') === 'green', `kd=${JSON.stringify(kd)} cot=${cot.get('bash t/xanh.sh')}`);
  const bl = dongLog(r.result, 'baseline');
  check('DC4b dòng kind:baseline ghi lệnh đó vào non_discriminating', bl.length === 1 && JSON.stringify(bl[0].non_discriminating || []).includes('bash t/xanh.sh'), JSON.stringify(bl));
  check('DC5a eval đỏ ở gốc, xanh ở đầu → KHÔNG nằm trong danh sách; cột đối chứng red',
    !kd.includes('bash t/do.sh') && cot.get('bash t/do.sh') === 'red', `cot=${cot.get('bash t/do.sh')}`);
  check('DC5b phép đo trọn: không lý do hạ tầng, không dòng baseline-khong-do, verdict PASS',
    (r.result.baselineKhongDo || {}).haTang === null && !dongLog(r.result, 'baseline-khong-do').length && r.result.verdict === 'PASS', `${r.result.verdict} ${JSON.stringify(r.result.baselineKhongDo)}`);
}

// ═════ DC6 — đối chứng: bộ chấm trước sửa ════════════════════════════════════
console.log(`DC6 bộ chấm của ${GOC_CU} (trước sửa), cùng mẫu, cùng tác tử → BLOCKED «No such tool available: Write»`);
let SRC_CU = '';
try { SRC_CU = execFileSync('git', ['-C', ROOT, 'show', `${GOC_CU}:feature-loop/workflows/acceptance-verify.js`], { stdio: 'pipe' }).toString(); } catch { /* đỏ dưới */ }
check('DC6a nạp được bộ chấm cũ và nó còn dặn công cụ ghi tệp (đối chứng đúng vật)', /dung cong cu ghi tep \(Write\)/.test(SRC_CU), SRC_CU ? 'không thấy câu dặn' : `git show ${GOC_CU} không chạy — kho nông?`);
if (SRC_CU) {
  const kho = dungKho();
  const r = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: EV_MAU }), responder(kho.d, tacTuBaseline(kho.d)), SRC_CU);
  const hd = r.result.baselineKhongDo || {};
  const d = dongLog(r.result, 'baseline-khong-do');
  const cot = cotDoiChung(r.calls);
  check('DC6b BLOCKED hạ tầng «chưa chạy dòng nào» mang đúng chữ «No such tool available: Write»',
    /khong chay dong nao/.test(hd.haTang || '') && (hd.haTang || '').includes('No such tool available: Write'), hd.haTang);
  check('DC6c dòng baseline-khong-do chua_chay; không eval nào được phân loại; cột đối chứng n-a',
    d.length === 1 && d[0].chua_chay === true && r.result.nonDiscriminating.length === 0 && cot.get('bash t/do.sh') === 'n-a' && cot.get('bash t/xanh.sh') === 'n-a', JSON.stringify(d));
}

// ═════ DC7 — mọi vai: đề bài khớp bộ công cụ của loại tác tử ═════════════════
console.log('DC7 mọi vai: đề bài không nhắc công cụ mà loại tác tử của vai không có; vai chấm không cầm bút');
const evDu = [ev('E1', 'bash t/E1.sh'), { id: 'E2', criterion: 'AC-2', executor: 'ui-check', steps: ['open /'], expected: 'ok' },
  { id: 'E3', criterion: 'AC-3', executor: 'judgment', question: 'q', inputs: ['/repo/a.md'], expected: 'ok' }];
const traDu = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: '__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('ui:')) return { verdict: 'PASS', observed: 'x', screenshot: '' };
  if (l.startsWith('judge:')) return { vote: 'PASS', reason: 'x' };
  if (l.startsWith('review:')) return { findings: [{ file: 'a.js', line: 1, title: 't', detail: 'd', severity: 'P1' }] };
  if (l.startsWith('refute:')) return { refuted: false, reason: 'x' };
  if (l.startsWith('triage')) return { items: [] };
  if (l === 'baseline:diffBase') return { dauRa: '', results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l.startsWith('synthesize')) return { report: '# r', findings: '# f' };
  return {};
};
const viPham = async (src) => {
  const { calls } = await runWorkflow(WF, buildArgs({ evals: evDu, suiteCommands: ['bash suite.sh'], contractPath: '/repo/_acceptance/mau/contract.md' }), traDu, src);
  const ra = [];
  for (const c of calls) {
    if (!c.opts.agentType) { ra.push(`${c.label}: không loại tác tử`); continue; }
    const co = congCuCua(c.opts.agentType);
    for (const t of congCuNhac(c.prompt)) if (!co.has(t)) ra.push(`${c.label}/${t}`);
  }
  return { ra, vai: new Set(calls.map(c => c.label.split(':')[0])) };
};
{
  const { ra, vai } = await viPham();
  check('DC7a bộ chấm sau sửa: đủ vai (máy · ui · hội đồng · tìm lỗi · phản bác · phân loại · đối chứng · xuất xứ · tổng hợp), 0 chỗ nhắc công cụ vắng',
    ra.length === 0 && ['machine', 'ui', 'judge', 'review', 'refute', 'triage', 'baseline', 'capture', 'synthesize'].every(v => vai.has(v)), ra.join(' | ') || [...vai].join(','));
  if (SRC_CU) {
    const cu = await viPham(SRC_CU);
    check('DC7b đối chứng: bộ chấm trước sửa → ĐÚNG một vi phạm, ở vai đối chứng, công cụ Write', JSON.stringify(cu.ra) === JSON.stringify(['baseline:diffBase/Write']), cu.ra.join(' | '));
  }
  // Đột biến không dính chữ «Write»: đề bài tổng hợp (loại chỉ đọc) nhắc Bash → phép kiểm bắt, không chỉ bắt một chữ.
  const kim = 'Soan NOI DUNG evidence report';
  const mSrc = SRC.replace(kim, 'Goi Bash roi ' + kim);
  check('DC7c đột biến: đề bài tổng hợp nhắc Bash → đúng một vi phạm synthesize:report/Bash', mSrc !== SRC && JSON.stringify((await viPham(mSrc)).ra) === JSON.stringify(['synthesize:report/Bash']), '');
  // Vai chấm không cầm bút: vai đối chứng vẫn gán loại cham-lenh, và loại ấy không có công cụ ghi/sửa tệp.
  const loaiBl = (SRC.match(/baseline: '(feature-loop:[a-z-]+)'/) || [])[1];
  const khongBut = md => CAM_BUT.every(t => !congCuTuMd(md).has(t));
  const mdLenh = fs.readFileSync(path.join(AGENTS, 'cham-lenh.md'), 'utf8');
  check('DC7d vai đối chứng = feature-loop:cham-lenh, loại ấy không cầm bút (Write/Edit/NotebookEdit)', loaiBl === 'feature-loop:cham-lenh' && khongBut(mdLenh), `${loaiBl}`);
  check('DC7e đột biến: thêm Write vào bộ công cụ cham-lenh → phép «không cầm bút» đỏ', !khongBut(mdLenh.replace(/^tools: (.+)$/m, 'tools: $1, Write')), '');
}

// ═════ DC8 — dấu kết heredoc không đụng lệnh eval ════════════════════════════
console.log('DC8 lệnh eval mang một dòng trùng dấu kết heredoc → kit đổi dấu, tệp vẫn đúng từng byte');
{
  const cmd = "cat <<'AGK_HET_KICH_BAN' > /dev/null\nxin chao\nAGK_HET_KICH_BAN\nbash t/xanh.sh";
  const chay = async (src) => {
    const kho = dungKho();
    let ghi = '';
    const r = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, evals: [ev('E1', cmd)] }), responder(kho.d, tacTuBaseline(kho.d, { suaGhi: g => (ghi = g) })), src);
    return { r, ghi, kho };
  };
  const { r, ghi } = await chay();
  const dau = ghi.split('\n')[0] || '';
  check('DC8a dấu kết đổi thành AGK_HET_KICH_BAN_1; kịch bản chạy lệnh nhiều dòng ấy «xong 0»; phép đo trọn',
    dau.endsWith(`<<'AGK_HET_KICH_BAN_1'`) && (r.result.baselineKhongDo || {}).haTang === null && dongLog(r.result, 'baseline').length === 1, `${dau.slice(-40)} ${JSON.stringify(r.result.baselineKhongDo)}`);
  // Đột biến: gỡ vòng đổi dấu → heredoc đóng sớm ở dòng của lệnh eval và đuôi kịch bản chạy NGAY trong lời gọi ghi.
  // Dấu kiểm KHÔNG phải lưới cho ca này (đo 29/10: lượt ra «thiếu __BL_XONG», không «chép sai») — vòng đổi dấu là răng.
  const kimVong = "for (let k = 1; kb.split('\\n').includes(het); k++) het = `AGK_HET_KICH_BAN_${k}`";
  const mSrc = SRC.replace(kimVong, '');
  const m = mSrc !== SRC ? await chay(mSrc) : null;
  check('DC8b đột biến gỡ vòng đổi dấu → phép đo không trọn: có lý do hạ tầng, không dòng kind:baseline, dấu kết là AGK_HET_KICH_BAN',
    !!m && m.ghi.split('\n')[0].endsWith(`<<'AGK_HET_KICH_BAN'`) && !!(m.r.result.baselineKhongDo || {}).haTang && dongLog(m.r.result, 'baseline').length === 0, m ? (m.r.result.baselineKhongDo || {}).haTang : 'không tiêm được');
}

// ═════ DC9 — bản ghi tác tử thật, phát lại qua bộ đọc thật ═══════════════════
// Bản ghi do phiên của vòng giao đề bài THẬT (8 lệnh eval của hồ sơ này, cỡ thật) cho hai tác tử feature-loop:cham-lenh
// thật — một đề bài mới, một đề bài của d3cfca5c — và chép NGUYÊN VĂN đầu ra (cách ghi: trường `cach_ghi` của tệp).
// Phát lại qua ĐÚNG bản bộ chấm đã sinh đề bài (băm blob `ban_cham_blob`), nên vòng sau sửa bộ chấm không làm ca cũ đi.
console.log('DC9 bản ghi tác tử cham-lenh thật (evidence/tac-tu-that.json) qua bộ đọc thật');
{
  const g = GHI_THAT;
  let srcGhi = '';
  try { if (g) srcGhi = execFileSync('git', ['-C', ROOT, 'cat-file', '-p', g.ban_cham_blob], { stdio: 'pipe' }).toString(); } catch { /* đỏ dưới */ }
  check('DC9a bản ghi có mặt, đủ trường, và blob bộ chấm của nó đọc được từ lịch sử kho',
    !!g && !!srcGhi && g.args && Array.isArray(g.args.evals) && g.args.evals.length >= 8 && typeof (g.moi || {}).dauRa === 'string' && typeof (g.cu || {}).dauRa === 'string', g ? `blob ${g.ban_cham_blob} ${srcGhi ? 'đọc được' : 'KHÔNG đọc được'}` : 'thiếu tệp');
  if (g && srcGhi) {
    const traThat = dauRa => (call) => {
      const l = call.label;
      if (l === 'baseline:diffBase') return { dauRa, results: [] };
      if (l.startsWith('machine:')) return { exitCode: 0, outputTail: '__EXIT=0', runId: '', cannotRun: false };
      if (l.startsWith('review:')) return { findings: [] };
      if (l.startsWith('triage')) return { items: [] };
      if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
      if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
      throw new Error('unexpected agent label: ' + l);
    };
    const r = await runWorkflow(WF, g.args, traThat(g.moi.dauRa), srcGhi);
    const pm = (r.calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
    const n = g.args.evals.length;
    const dongKq = (g.moi.dauRa.match(/^__BL \d+ (xong|qua-tran|het-tran-tong|bo-qua)\b.*$/gm) || []).length;
    check('DC9b đề bài mới, tác tử thật: lệnh ghi xác nhận ĐÚNG số dấu kiểm kit tính, đủ dấu cho từng lệnh, bộ đọc không gắn lý do hạ tầng, có dòng kind:baseline',
      dongGhiDung(pm) !== '' && g.moi.dauRa.split('\n').includes(dongGhiDung(pm)) && dongKq === n && /^__BL_XONG$/m.test(g.moi.dauRa)
        && (r.result.baselineKhongDo || {}).haTang === null && dongLog(r.result, 'baseline').length === 1, `${dongKq}/${n} dòng · ${JSON.stringify(r.result.baselineKhongDo).slice(0, 200)}`);
    // Chiều đỏ trên CÙNG bản ghi: đổi một chữ số của dòng xác nhận → bộ đọc không tin, không dòng kind:baseline.
    const hong = g.moi.dauRa.replace(/^(__BL_GHI dung \d*)(\d)/m, (m0, a, d) => a + String((Number(d) + 1) % 10));
    const rh = hong !== g.moi.dauRa ? await runWorkflow(WF, g.args, traThat(hong), srcGhi) : null;
    check('DC9d đột biến: bản ghi lệch một chữ số dấu kiểm → «lenh ghi khong xac nhan dau kiem», 0 dòng kind:baseline',
      !!rh && /^lenh ghi khong xac nhan dau kiem/.test((rh.result.baselineKhongDo || {}).haTang || '') && dongLog(rh.result, 'baseline').length === 0, rh ? (rh.result.baselineKhongDo || {}).haTang : 'không tiêm được');
    const rc = SRC_CU ? await runWorkflow(WF, g.args, traThat(g.cu.dauRa), SRC_CU) : null;
    // Tác tử thật nhận đề bài cũ có hai hành vi đã thấy: gọi Write và chép chữ lỗi (kho tiêu thụ, FL5), hoặc biết
    // mình không có Write nên không chạy gì và trả rỗng (bản ghi 29/10). Cả hai: không dấu bắt đầu → không đo được.
    check('DC9c đề bài cũ (d3cfca5c), tác tử thật: không dòng __BL nào (rỗng hoặc chữ lỗi Write), bộ đọc cũ ghi «chưa chạy dòng nào»',
      !!rc && !/^__BL/m.test(g.cu.dauRa) && (g.cu.dauRa.trim() === '' || /No such tool available: Write/.test(g.cu.dauRa)) && /khong chay dong nao/.test((rc.result.baselineKhongDo || {}).haTang || ''), rc ? (rc.result.baselineKhongDo || {}).haTang : 'không nạp được bộ chấm cũ');
  }
}

summary('doi-chung-chay-duoc');
