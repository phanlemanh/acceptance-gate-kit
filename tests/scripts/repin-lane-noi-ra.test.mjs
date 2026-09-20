// GN — làn ghim lại phải NÓI RA ô nó không đo (hồ sơ ghim-lai-noi-ra-o-khong-do, 20/09/2026).
//
// Ca VĨNH VIỄN: suite scripts chạy mọi *.test.mjs qua glob, nên đây là lưới thường trực
// cho lớp «pin im về thứ nó không chứng». Luật đo:
//  - Fixture là kho git THẬT dựng trong chính lượt chạy; hồ sơ theo MA TRẬN bốn AC:
//    AC-a{E1 test} · AC-b{E2 script not-run} · AC-c{E6 ui-check paths, E7 ui-check not-run}
//    · AC-d{E12 judgment, E13 test}. Danh sách kỳ vọng «AC không có chốt máy» VIẾT TRƯỚC
//    = hằng AC_KHONG dưới đây, KHÔNG tính lại từ mã sản phẩm (gap-probe F1).
//  - Mỗi ca chạy phép phán trên vật THẬT (phải không lỗi) rồi CÙNG phép phán trên bản sao
//    đã tiêm (phải ra đúng thông điệp ghim). Mũi tiêm khớp đúng một lần, bản sao khác gốc,
//    qua `node --check`.
//  - Mọi đường dẫn suy từ vị trí tệp này. Mốc git vắng → ca ĐỎ có tên, không xanh lặng.
//  - Mỗi ca in ĐÚNG MỘT dòng `PASS: GNxx …` / `FAIL: GNxx … (DO: …)`.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
// GNRO_ROOT: bản sao CỦA CHÍNH tệp ca chạy từ thư mục tạm, nên `HERE` của nó
// không suy ra gốc kho — mutant truyền gốc thật vào. Lượt chạy bình thường
// không có biến này và vẫn suy từ vị trí tệp (bất biến: không hardcode ROOT).
const ROOT = process.env.GNRO_ROOT || path.resolve(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');
const MOC = '2826f807';               // mốc 2.17.0 — writer + bên đọc đời TRƯỚC hồ sơ này
const AC_KHONG = ['AC-b', 'AC-c'];    // kỳ vọng VIẾT TRƯỚC, không tính từ mã sản phẩm

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gnro-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));

// Bỏ chiều đỏ là một trạng thái phải LỘ RA, không phải một công tắc lặng. Chỉ
// chính tệp ca đặt được nó (bắt tay nội bộ), và lượt bỏ chiều đỏ luôn nối hậu tố
// vào dòng kết quả rồi thoát KHÁC 0 — nếu không, xuất một biến môi trường ở khoá
// executor hay ở CI là mọi ca in PASS với 0 mutant chạy (gap-probe P0, lượt nâng
// phạm vi 20/09).
const BAT_TAY = 'gnro-noi-bo-' + '5f3a9c21';
const BO_CHIEU_DO = process.env.GNRO_SKIP_MUTANTS === BAT_TAY;
const BO_CHIEU_DO_LA = !!process.env.GNRO_SKIP_MUTANTS && !BO_CHIEU_DO;

// ── fixture: evals.yaml theo ma trận ────────────────────────────────────────
// `paths` viết dạng BLOCK SEQ — đúng dạng kho tiêu thụ dùng (đo ở crm 20/09:
// 393 eval block-seq / 49 flow). Ca GN07 đo thêm dạng flow.
const EVALS_MA_TRAN = `schema_version: 1
slug: feat-gn

evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
  - id: E2
    criterion: AC-b
    executor: script
    status: not-run
    cmd: config:executors.script.rang
    expected: >
      Ô tự khai không chạy.
  - id: E6
    criterion: AC-c
    executor: ui-check
    cmd: config:executors.ui.x
    paths:
      - "apps/x/**"
      - "_acceptance/feat-gn/rang/**"
    expected: >
      Nhìn frame.
  - id: E7
    criterion: AC-c
    executor: ui-check
    status: not-run
    cmd: config:executors.ui.x
    expected: >
      Ô ngoài làn máy tự khai không chạy.
  - id: E12
    criterion: AC-d
    executor: judgment
    cmd: judgment
    expected: >
      Người phán.
  - id: E13
    criterion: AC-d
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
`;
const EVALS_TOAN_MAY = `schema_version: 1
slug: feat-may

evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: >
      Xanh: suite exit 0.
`;
const CONFIG = `schema_version: 1
enforcement: strict
recheck: strict
gap_probe: off
feature_loop:
  suite_keys:
    - executors.test.suite
executors:
  test:
    suite: "bash suite.sh"
  script:
    rang: "bash rang.sh"
  ui:
    x: "echo ui"
`;
// Khuôn báo cáo theo repin-fixture.mjs (bên đọc đòi verdict + khối Evidence có
// đủ trường); khối eval dựng cho ĐÚNG các eval máy của hồ sơ.
const REPORT = (slug, vc, verifier, machineIds) => `---
schema_version: 1
feature_slug: ${slug}
verdict: PASS
verified_commit: ${vc}
human_signoff: Nguoi Ky 2026-09-19
---

## Evidence
${machineIds.map(id => `- eval: ${id}\n  run_id: ${slug}-${id}-001\n  exit_code: 0\n  verifier: ${verifier}\n  verified_at: 2026-09-19`).join('\n')}

## Iterations
`;

// Kho git tạm với MỘT hồ sơ. toanMay=true → hồ sơ chỉ có eval máy (chiều im).
// `status: implemented` chứ không phải trạng thái đã ký: tệp ca KHÔNG phải bộ đọc
// trạng thái ký (làn và recheck không đọc `contract.md` để quyết gì ở đây), nên
// chuỗi ấy trong tệp ca chỉ làm lưới RT13 kêu. Cùng lối với repin-fixture.mjs và
// tiền lệ ghim-lai-tren-lop-cu (entry d-20260911T162950Z-14) — KHÔNG khai gạch
// BO-DOC-KHAI-GACH, vì sửa khối đó kéo hồ sơ đã ký ra-co-ten-lam-va-trao vào
// phạm vi diff và lộ pin cũ của nó.
function mkKho({ toanMay = false, evals = null } = {}) {
  const root = mk('kho-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const slug = toanMay ? 'feat-may' : 'feat-gn';
  const ws = path.join(root, '_acceptance', slug);
  fs.mkdirSync(path.join(ws, 'rang'), { recursive: true });
  fs.mkdirSync(path.join(root, 'apps', 'x'), { recursive: true });
  fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), CONFIG);
  fs.writeFileSync(path.join(root, 'suite.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'rang.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'apps', 'x', 'a.ts'), 'v1\n');
  fs.writeFileSync(path.join(ws, 'rang', 'r.mjs'), '// v1\n');
  fs.writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [ui]\nstatus: implemented\napproved_by: Nguoi Ky\napproved_at: 2026-09-19\n---\n\n# Contract ${slug}\n\n## Criteria\n\n- AC-a: Given x, When y, Then z.\n`);
  const body = evals !== null ? evals : (toanMay ? EVALS_TOAN_MAY : EVALS_MA_TRAN);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), body.replaceAll('feat-gn', slug));
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const head0 = git('rev-parse', 'HEAD').trim();
  const machineIds = toanMay ? ['E1'] : ['E1', 'E13'];
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), machineIds.map(id => JSON.stringify({ ts: '2026-09-19T00:00:00Z', round: 1, evalId: id, run_id: `${slug}-${id}-001`, exit_code: 0, cmd: 'bash suite.sh' })).join('\n') + '\n');
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), REPORT(slug, head0, path.join(root, 'suite.sh'), machineIds));
  git('add', '-A'); git('commit', '-qm', 'evidence');
  return { root, ws, slug, git, head: git('rev-parse', 'HEAD').trim(), logPath: path.join(ws, 'run-log.jsonl'), reportPath: path.join(ws, 'evidence-report.md') };
}

const chayLan = (root, slug, extra = [], laneScript = LANE) =>
  spawnSync(process.execPath, [laneScript, '--root', root, '--ag-root', ROOT, '--slug', slug, '--reason', 'ca GN', ...extra], { encoding: 'utf8' });
const dongRepinCuoi = (logPath) => JSON.parse(fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.includes('"kind":"repin"')).pop());
const sectionCuoi = (reportPath) => {
  const t = fs.readFileSync(reportPath, 'utf8');
  const i = t.lastIndexOf('### Re-pin lần');
  return i < 0 ? '' : t.slice(i);
};

// Bản sao đã tiêm: mũi tiêm khớp ĐÚNG MỘT LẦN, bản sao khác gốc, qua node --check.
// `chepTrong`: thư mục ANH EM phải chép TRỌN sang bản sao (bài học P150 — chép danh
// sách tệp tay thì vật đo gọi thêm một module là bản sao thiếu tệp, đỏ vì HẠ TẦNG chứ
// không vì vật). `repin-lane.mjs` import ./carry-plan.mjs và ./chup-ho-so-da-thong.mjs,
// `gate-card.js` require ../lib/*.cjs — nên cả hai đi đường chép trọn.
function mutant(src, tim, thay, chepTrong = null) {
  const s = fs.readFileSync(src, 'utf8');
  const n = s.split(tim).length - 1;
  if (n !== 1) throw new Error(`mui tiem khop ${n} lan (can 1): ${cut(tim, 70)}`);
  const moi = s.replace(tim, thay);
  if (moi === s) throw new Error('ban sao khong khac ban goc');
  let out;
  if (chepTrong) {
    const d = mk('mut-');
    for (const thuMuc of chepTrong) fs.cpSync(path.join(ROOT, thuMuc), path.join(d, thuMuc), { recursive: true });
    out = path.join(d, path.relative(ROOT, src));
    fs.writeFileSync(out, moi);
  } else {
    out = path.join(mk('mut-'), path.basename(src));
    fs.writeFileSync(out, moi);
  }
  if (/\.(mjs|cjs|js)$/.test(out)) {
    const chk = spawnSync(process.execPath, ['--check', out], { encoding: 'utf8' });
    if (chk.status !== 0) throw new Error(`ban sao khong qua node --check: ${cut(chk.stderr, 140)}`);
  }
  return out;
}
// Bản sao của làn: chép trọn feature-loop/scripts (anh em cùng thư mục).
const mutLane = (tim, thay) => mutant(LANE, tim, thay, ['feature-loop/scripts']);
// Bản sao của thẻ: chép trọn scripts + lib (thẻ require ../lib/*.cjs).
const mutCard = (tim, thay) => mutant(CARD, tim, thay, ['scripts', 'lib']);

// Chuẩn hoá section để so BYTE: run_id, sha và ngày là giá trị của lượt chạy.
const chuanHoa = (s) => String(s)
  .replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>')
  .replace(/\b[0-9a-f]{40}\b/g, '<SHA>')
  .replace(/\d{4}-\d{2}-\d{2}/g, '<NGAY>');

// Writer/bên đọc ĐỜI TRƯỚC hồ sơ này: git archive TRỌN thư mục (chép danh sách
// tệp tay thì vật gọi thêm một module là bản cũ đỏ vì HẠ TẦNG — bài học P150).
const mocCache = new Map();
function cayMoc(sha) {
  if (mocCache.has(sha)) return mocCache.get(sha);
  const ok = spawnSync('git', ['-C', ROOT, 'cat-file', '-e', `${sha}^{commit}`], { encoding: 'utf8' });
  if (ok.status !== 0) throw new Error(`thieu moc ${sha} — can lich su git day du (fetch-depth: 0)`);
  const d = mk(`moc-${sha}-`);
  const tar = path.join(TMP, `moc-${sha}.tar`);
  execFileSync('git', ['-C', ROOT, 'archive', '-o', tar, sha, 'feature-loop', 'lib', 'scripts']);
  execFileSync('tar', ['-xf', tar, '-C', d]);
  for (const rel of ['feature-loop/scripts/repin-lane.mjs', 'scripts/gate-card.js', 'scripts/recheck-evidence.cjs', 'scripts/pre-merge-check.sh', 'scripts/eval-coverage-lint.js']) {
    if (!fs.existsSync(path.join(d, rel))) throw new Error(`lop ${sha} thieu ${rel} sau git archive`);
  }
  mocCache.set(sha, d);
  return d;
}
const laneMoc = (sha) => path.join(cayMoc(sha), 'feature-loop', 'scripts', 'repin-lane.mjs');

// ── RÚT kỳ vọng TỪ VẬT, không gõ lại (đổi khuôn, owner quyết 20/09 ở STOP-PATCHING)
// Lớp lỗi đã bắt ba lượt liên tiếp: mỗi ca tự viết lại lời hứa bằng chuỗi của
// RIÊNG nó, nên «đo gần đúng lời hứa» là trạng thái mặc định chứ không phải tai
// nạn — ca xanh trong khi dòng chữ người đọc biến mất. Ba hàm dưới rút chuỗi kỳ
// vọng từ ba vật ĐỘC LẬP với thứ đang bị đo, và mỗi hàm NỔ khi rút được rỗng:
// một phép so với vế kỳ vọng rỗng là hằng đúng, đúng bệnh GN11 đã dẫm.

// (1) Hợp đồng giữ nguyên văn các hậu tố đã hứa — nguồn duy nhất, cả làn lẫn ca
// đều phải khớp nó. Hồ sơ lưu kho về sau → ca ĐỎ có tên, không xanh lặng.
const HOP_DONG = path.join(ROOT, '_acceptance', 'ghim-lai-noi-ra-o-khong-do', 'contract.md');
function huaTuHopDong(acId) {
  if (!fs.existsSync(HOP_DONG)) throw new Error(`thieu hop dong ${HOP_DONG} — ca nay rut loi hua tu hop dong, khong go tay`);
  const dong = fs.readFileSync(HOP_DONG, 'utf8').split('\n').find(l => l.startsWith(`- ${acId}:`));
  if (!dong) throw new Error(`hop dong khong co dong "- ${acId}:"`);
  const hua = [...dong.matchAll(/`(\s*·[^`]*)`/g)].map(m => m[1]);
  if (!hua.length) throw new Error(`rut 0 hau to tu ${acId} — ve ky vong rong thi phep so hang dung`);
  return hua;
}

// (2) Bộ đọc evals.yaml ĐỘC LẬP với lib sản phẩm: thẻ và bộ đọc này trôi khỏi
// nhau là phải ĐỎ, đó chính là việc của ca. Trả về chuỗi diễn giải kỳ vọng
// («AC-b (E2 script not-run)») dựng từ CHÍNH tệp thẻ đọc, không gõ lại.
function moMongDoi(evalsText) {
  const recs = evalsText.split(/^ {2}- id:[ \t]*/m).slice(1).map(b => ({
    id: b.split('\n')[0].trim(),
    executor: (b.match(/^ {4}executor:[ \t]*(\S+)/m) || [])[1] || '',
    status: (b.match(/^ {4}status:[ \t]*(\S+)/m) || [])[1] || '',
    criterion: (b.match(/^ {4}criterion:[ \t]*(\S+)/m) || [])[1] || '',
  }));
  const theoAc = new Map();
  for (const e of recs) {
    if (!e.criterion) continue;
    if (!theoAc.has(e.criterion)) theoAc.set(e.criterion, []);
    theoAc.get(e.criterion).push(e);
  }
  const may = (e) => ['test', 'script'].includes(e.executor) && e.status !== 'not-run';
  const mo = [...theoAc.entries()].filter(([, evs]) => evs.every(e => !may(e)))
    .map(([ac, evs]) => `${ac} (${evs.map(e => `${e.id} ${e.executor}${e.status === 'not-run' ? ' not-run' : ''}`).join(', ')})`);
  if (!mo.length) throw new Error('ma tran fixture khong con AC nao thieu chot may — ve ky vong rong, phep so vo luc');
  return mo;
}

// (3) Khoá MỚI do chính writer khai = hiệu tập khoá (làn nay − làn mốc 2.17.0)
// trên CÙNG một fixture. Tài liệu phải gọi tên đúng những khoá này; thêm khoá
// thứ ba về sau thì phép đo tự vũ trang, không ai phải nhớ sửa ca.
function khoaMoiSoVoiMoc(lane) {
  const khoa = (kho) => Object.keys(dongRepinCuoi(kho.logPath));
  const nay = mkKho();
  fs.writeFileSync(path.join(nay.root, 'apps', 'x', 'a.ts'), 'v2\n');
  nay.git('add', '-A'); nay.git('commit', '-qm', 'cham');
  if (chayLan(nay.root, nay.slug, ['--write'], lane).status !== 0) throw new Error('lan nay do khi rut khoa moi');
  const cu = mkKho();
  fs.writeFileSync(path.join(cu.root, 'apps', 'x', 'a.ts'), 'v2\n');
  cu.git('add', '-A'); cu.git('commit', '-qm', 'cham');
  if (chayLan(cu.root, cu.slug, ['--write'], laneMoc(MOC)).status !== 0) throw new Error(`lan moc ${MOC} do khi rut khoa moi`);
  const moi = khoa(nay).filter(k => !khoa(cu).includes(k));
  if (!moi.length) throw new Error(`rut 0 khoa moi so voi ${MOC} — ve ky vong rong, phep so hang dung`);
  return moi;
}

const CASES = [];

// ── GN01 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN01',
  title: 'dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id',
  real(lane) {
    const errs = [];
    const f = mkKho();
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d.evals_not_machine) !== JSON.stringify(['E6', 'E7', 'E12'])) errs.push(`khoa evals_not_machine vang hoac sai: ${JSON.stringify(d.evals_not_machine)}`);
    if (JSON.stringify(d.evals_not_run) !== JSON.stringify(['E2'])) errs.push(`evals_not_run sai: ${JSON.stringify(d.evals_not_run)}`);
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1', 'E13'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    const hop = [...Object.keys(d.evals_exit), ...(d.evals_not_run || []), ...(d.evals_not_machine || [])];
    const tapId = ['E1', 'E2', 'E6', 'E7', 'E12', 'E13'];
    if (new Set(hop).size !== hop.length) errs.push(`id xuat hien hai mang: ${hop.join(',')}`);
    else if (JSON.stringify([...hop].sort()) !== JSON.stringify([...tapId].sort())) errs.push(`hop ba tap != tap id: ${hop.join(',')}`);
    return errs;
  },
  mutants: [
    { pin: 'khoa evals_not_machine vang', make: () => mutLane(".filter(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))\n    .map(e => e.id);\n  return { slug", '.filter(() => false)\n    .map(e => e.id);\n  return { slug') },
    { pin: 'id xuat hien hai mang', make: () => mutLane("    .filter(e => !core.isRepinMachineEval(e))\n    .map(e => e.id);\n  // Ô NGOÀI LÀN MÁY", "    .filter(() => true)\n    .map(e => e.id);\n  // Ô NGOÀI LÀN MÁY") },
  ],
});

// ── GN02 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN02',
  title: 'hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng',
  real(lane) {
    const errs = [];
    const f = mkKho({ toanMay: true });
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    const keys = Object.keys(d);
    for (const k of ['evals_not_run', 'evals_not_machine', 'evals_not_machine_touched']) {
      if (keys.includes(k)) errs.push(`mang rong thay vi vang: khoa ${k} co mat (${JSON.stringify(d[k])})`);
    }
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    return errs;
  },
  mutants: [
    { pin: 'mang rong thay vi vang', make: () => mutLane('s.ngoaiMay.length ? { evals_not_machine: s.ngoaiMay } : {},', '{ evals_not_machine: s.ngoaiMay },') },
  ],
});

// ── GN03 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN03',
  title: 'section Re-pin nêu ô ngoài làn máy + AC không có chốt máy; hồ sơ toàn máy thì im',
  real(lane) {
    const errs = [];
    const f = mkKho();
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const sec = sectionCuoi(f.reportPath);
    // Hậu tố kỳ vọng RÚT TỪ HỢP ĐỒNG (AC-2), không gõ lại trong ca.
    for (const hua of huaTuHopDong('AC-2')) {
      if (!sec.includes(hua)) errs.push(`section thieu hau to hop dong hua: "${cut(hua, 90)}" · section=${cut(sec, 200)}`);
    }
    const mAC = sec.match(/· AC không có chốt máy: ([^\n·]+)/);
    if (!mAC) errs.push(`section thieu AC khong chot may: ${cut(sec, 240)}`);
    else {
      const got = mAC[1].trim().split(/,\s*/);
      if (JSON.stringify(got) !== JSON.stringify(AC_KHONG)) {
        errs.push(got.includes('AC-d') || got.includes('AC-a') ? `got AC bang ton tai: ${got.join(',')}`
          : (!got.includes('AC-b') ? `not-run tinh la chot: ${got.join(',')}` : `AC khong chot may sai: ${got.join(',')}`));
      }
    }
    // CHIỀU IM: hồ sơ toàn eval máy — so BYTE với section do WRITER mốc 2.17.0 ghi.
    const g = mkKho({ toanMay: true });
    const rg = chayLan(g.root, g.slug, ['--write'], lane);
    if (rg.status !== 0) return errs.concat(`ho so toan may exit ${rg.status}: ${cut(rg.stderr, 220)}`);
    const nay = chuanHoa(sectionCuoi(g.reportPath));
    const g2 = mkKho({ toanMay: true });
    const rc = chayLan(g2.root, g2.slug, ['--write'], laneMoc(MOC));
    if (rc.status !== 0) return errs.concat(`writer moc ${MOC} exit ${rc.status}: ${cut(rc.stderr, 220)}`);
    const cu = chuanHoa(sectionCuoi(g2.reportPath));
    if (nay !== cu) errs.push(`section troi so voi lan 2.17.0: nay="${cut(nay, 160)}" cu="${cut(cu, 160)}"`);
    // Đối chứng dương của phép so byte: trên hồ sơ ma trận hai bản PHẢI khác.
    // «Khác nhau» một mình KHÔNG phân biệt được «hai bản render khác» với «một
    // bản chưa từng chạy»: sectionCuoi trả '' khi báo cáo không có section, nên
    // một làn đỏ (mốc khuyết, cây bẩn, bản tiêm) cho '' vs '<thật>' và đối chứng
    // «qua» mà chưa so gì (finding Ngoài-10). Vì thế kiểm CẢ mã thoát lẫn
    // section-khác-rỗng của hai làn trước khi tin phép so có lực.
    const h = mkKho(); const h2 = mkKho();
    const rh = chayLan(h.root, h.slug, ['--write'], lane);
    const rh2 = chayLan(h2.root, h2.slug, ['--write'], laneMoc(MOC));
    const sh = sectionCuoi(h.reportPath); const sh2 = sectionCuoi(h2.reportPath);
    if (rh.status !== 0 || rh2.status !== 0) errs.push(`doi chung duong khong chay duoc: lan nay exit ${rh.status}, lan ${MOC} exit ${rh2.status}`);
    else if (!sh.trim() || !sh2.trim()) errs.push(`doi chung duong khong chay duoc: section rong (nay ${sh.length} ky tu, ${MOC} ${sh2.length} ky tu)`);
    else if (chuanHoa(sh) === chuanHoa(sh2)) errs.push('phep so byte khong phan biet duoc: ho so ma tran cho section y het ban 2.17.0');
    return errs;
  },
  mutants: [
    { pin: 'section thieu AC khong chot may', make: () => mutLane('${veAcKhong}', '') },
    { pin: 'got AC bang ton tai', make: () => mutLane('evs.every(e => !core.isRepinMachineEval(e))', 'evs.some(e => !core.isRepinMachineEval(e))') },
    { pin: 'not-run tinh la chot', make: () => mutLane('evs.every(e => !core.isRepinMachineEval(e))', "evs.every(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))") },
    // Một làn của ĐỐI CHỨNG DƯƠNG không chạy được → ca phải NÓI RA, không được
    // «qua» nhờ '' khác '<section thật>' (finding Ngoài-10). Tiêm vào chính tệp
    // ca vì mốc 2.17.0 chỉ dùng ở đây; needle ghép động để không tự khớp.
    { pin: 'doi chung duong khong chay duoc',
      judge: (p) => {
        const r = spawnSync(process.execPath, [p], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN03', GNRO_ROOT: ROOT, GNRO_SKIP_MUTANTS: BAT_TAY } });
        return /doi chung duong khong chay duoc/.test(r.stdout) ? ['doi chung duong khong chay duoc'] : [`ban sao khong do: ${cut(r.stdout, 200)}`];
      },
      make: () => mutant(
        SELF,
        "const rh2 = chayLan(h2.root, h2.slug, ['--write'], laneMoc(" + "MOC));",
        "const rh2 = chayLan(h2.root, h2.slug, ['--write'], laneMoc(MOC) + '-khong-ton-tai');",
      ) },
  ],
});

// ── GN04 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN04',
  title: 'khoá dòng ghim của script == khoá khuôn REPIN-TEMPLATE, cả ca đủ ba khoá tuỳ chọn',
  // `ref` = các đường dẫn tệp văn bản ca đọc; mutant truyền BẢN SAO vào đây thay
  // vì ghi đè cây thật (lượt chấm 2, finding «đua với làn eval song song»).
  real(ref = {}) {
    const lane = ref.lane || LANE;
    const errs = [];
    const skill = fs.readFileSync(ref.skill || SKILL, 'utf8');
    const m = skill.match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
    if (!m) return ['khuon SKILL thieu: khong thay marker REPIN-TEMPLATE'];
    const tl = m[1].split('\n').find(l => l.includes('"kind":"repin"'));
    const filled = tl.replaceAll('<ISO>', '2026-09-20T00:00:00Z').replaceAll('<id>', 'x').replaceAll('<40-hex>', 'a'.repeat(40)).replaceAll('"<E>"', '"E1"');
    const tKeys = Object.keys(JSON.parse(filled));
    for (const k of ['evals_not_machine', 'evals_not_machine_touched']) {
      if (!tKeys.includes(k)) errs.push(`khuon SKILL thieu khoa ${k}`);
    }
    // Hồ sơ đủ BA khoá tuỳ chọn: ma trận + diff chạm paths E6.
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return errs.concat(`lan exit ${r.status}: ${cut(r.stderr, 220)}`);
    const dKeys = Object.keys(dongRepinCuoi(f.logPath));
    if (JSON.stringify(dKeys) !== JSON.stringify(tKeys)) errs.push(`khuon SKILL thieu hoac lech: script viet ${dKeys.join(',')} · khuon ${tKeys.join(',')}`);
    // Hồ sơ toàn máy: tập khoá = khuôn TRỪ đúng ba khoá tuỳ chọn.
    const g = mkKho({ toanMay: true });
    const rg = chayLan(g.root, g.slug, ['--write'], lane);
    if (rg.status !== 0) return errs.concat(`ho so toan may exit ${rg.status}`);
    const gKeys = Object.keys(dongRepinCuoi(g.logPath));
    const mong = tKeys.filter(k => !['evals_not_run', 'evals_not_machine', 'evals_not_machine_touched'].includes(k));
    if (JSON.stringify(gKeys) !== JSON.stringify(mong)) errs.push(`ho so toan may: script viet ${gKeys.join(',')} · mong ${mong.join(',')}`);
    return errs;
  },
  mutants: [
    { pin: 'khuon SKILL thieu',
      judge: (p) => CASES.find(c => c.id === 'GN04').real({ skill: p }),
      make: () => mutant(SKILL, ',"evals_not_machine":["<E>"]', '') },
  ],
});

// ── GN05 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN05',
  title: 'SKILL + GUIDE §7.1 khai khoá touched; lệnh đếm ngưỡng của GUIDE chạy thật',
  real(ref = {}) {
    const errs = [];
    const skill = fs.readFileSync(ref.skill || SKILL, 'utf8');
    const guide = fs.readFileSync(ref.guide || GUIDE, 'utf8');
    // Đo ĐÚNG câu giới hạn của nghi thức re-pin, không chỉ «tên khoá có xuất hiện
    // đâu đó»: khuôn REPIN-TEMPLATE cũng mang tên khoá, nên phép đo lỏng sẽ xanh
    // ngay cả khi câu giới hạn bị gỡ (mutant bắt được đúng lỗ này).
    const cauGH = skill.match(/Giới hạn khai: eval `ui-check`\/`judgment`[^\n]*/);
    const menhDe = [
      /`evals_not_machine` liệt mọi id ngoài làn máy/,
      /liệt những id mà diff từ pin cũ tới HEAD chạm `paths`/,
      /section Re-pin nêu thêm `AC không có chốt máy`/,
    ];
    if (!cauGH || !menhDe.every(re => re.test(cauGH[0]))) errs.push('SKILL thieu cau touched');
    // Vế GUIDE: neo vào ĐOẠN VĂN giới hạn của §7.1 và CẮT khối lệnh ra khỏi nó —
    // quét tên khoá trên toàn tệp thì chính dòng lệnh đếm ở dưới tự thoả điều
    // kiện (finding lượt chấm 3). Danh sách khoá phải gọi tên KHÔNG gõ tay: nó là
    // hiệu tập khoá giữa làn nay và làn mốc 2.17.0 trên cùng fixture.
    const mDoan = guide.match(/\*\*Giới hạn khai, một ngưỡng ĐẾM ĐƯỢC:\*\*([\s\S]*?)```/);
    if (!mDoan) errs.push('GUIDE thieu doan gioi han §7.1');
    else {
      const vanXuoi = mDoan[1];
      // Khớp theo RANH GIỚI, không `includes` trần: `evals_not_machine_touched`
      // BAO `evals_not_machine`, nên containment làm khoá ngắn không bao giờ
      // được kiểm thật — gỡ hẳn câu nêu khoá ngắn mà giữ khoá dài thì phép đo
      // vẫn xanh (hằng đúng, finding Ngoài-11 lượt chấm 2). Tài liệu của kit
      // luôn đặt tên khoá trong dấu huyền, nên dấu huyền chính là ranh giới.
      for (const k of khoaMoiSoVoiMoc(ref.lane || LANE)) {
        if (!vanXuoi.includes('`' + k + '`')) errs.push(`GUIDE thieu cau touched: doan §7.1 khong goi ten khoa moi "${k}"`);
      }
    }
    const mL = guide.match(/```bash\n(grep -l '"evals_not_machine_touched"'[^\n]*)\n```/);
    if (!mL) return errs.concat('GUIDE khong con lenh dem');
    const lenh = mL[1];
    // Chạy THẬT: kho có đúng 1 hồ sơ mang khoá → "1"; kho không hồ sơ nào → "0".
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    chayLan(f.root, f.slug, ['--write']);
    const co = spawnSync('bash', ['-c', lenh], { cwd: f.root, encoding: 'utf8' });
    if (co.stdout.trim() !== '1') errs.push(`GUIDE khong con lenh dem dung: kho co 1 ho so mang khoa nhung lenh in "${co.stdout.trim()}"`);
    const g = mkKho({ toanMay: true });
    chayLan(g.root, g.slug, ['--write']);
    const khong = spawnSync('bash', ['-c', lenh], { cwd: g.root, encoding: 'utf8' });
    if (khong.stdout.trim() !== '0') errs.push(`lenh dem sai o kho sach: in "${khong.stdout.trim()}"`);
    return errs;
  },
  mutants: [
    { pin: 'GUIDE khong con lenh dem',
      judge: (p) => CASES.find(c => c.id === 'GN05').real({ guide: p }),
      make: () => mutant(GUIDE, "grep -l '\"evals_not_machine_touched\"'", "grep -l 'KHONG-CO-KHOA-NAY'") },
    { pin: 'SKILL thieu cau touched',
      judge: (p) => CASES.find(c => c.id === 'GN05').real({ skill: p }),
      make: () => mutant(SKILL, 'liệt những id mà diff từ pin cũ tới HEAD chạm `paths`', 'liệt vài thứ') },
    // Neo của đoạn văn §7.1 mất → ca ĐỎ: chứng phép đo đứng trên ĐOẠN VĂN, không
    // trên cả tệp (quét cả tệp thì chính dòng lệnh đếm dưới fence tự thoả).
    { pin: 'GUIDE thieu doan gioi han',
      judge: (p) => CASES.find(c => c.id === 'GN05').real({ guide: p }),
      make: () => mutant(GUIDE, '**Giới hạn khai, một ngưỡng ĐẾM ĐƯỢC:**', '**Khong noi gi ca:**') },
    // Writer đổi tên khoá → đoạn văn không còn gọi đúng tên → ca ĐỎ. Đây là vế
    // round-trip: danh sách khoá phải đo đòi hỏi là do LÀN khai, không do ca gõ.
    { pin: 'GUIDE thieu cau touched',
      judge: (p) => CASES.find(c => c.id === 'GN05').real({ lane: p }),
      make: () => mutLane('{ evals_not_machine_touched: chamNgoaiMay }', '{ evals_not_machine_cham: chamNgoaiMay }') },
    // Khoá NGẮN bị gỡ khỏi đoạn văn mà khoá DÀI còn nguyên: `includes` trần cho
    // xanh vì khoá dài bao khoá ngắn. Mũi tiêm này là chiều đỏ của chính phép
    // khớp-có-ranh-giới (finding Ngoài-11).
    { pin: 'GUIDE thieu cau touched',
      judge: (p) => CASES.find(c => c.id === 'GN05').real({ guide: p }),
      make: () => mutant(GUIDE, '`evals_not_machine` (mọi id ngoài làn máy) và ', '') },
  ],
});

// ── GN06 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN06',
  title: 'diff từ PIN CŨ chạm paths của ô ngoài làn máy → khoá touched, không chặn',
  real(lane) {
    const errs = [];
    const f = mkKho();
    // HAI commit sau pin: commit 1 chạm glob, commit 2 không — mốc phải là pin cũ,
    // không phải HEAD~1 (giữa hai lần ghim ở kho tiêu thụ là hàng trăm commit).
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham glob');
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'x\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'khong cham');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status} (phai 0, khong chan): ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d.evals_not_machine_touched) !== JSON.stringify(['E6'])) {
      errs.push(`touched vang du diff cham / moc diff khong phai pin cu: ${JSON.stringify(d.evals_not_machine_touched)}`);
    }
    // AC-4 hứa một HẬU TỐ TRONG SECTION cho NGƯỜI đọc, không chỉ một khoá JSON
    // cho máy: đo khoá là đo proxy — xoá trắng hậu tố thì mọi ca cũ vẫn xanh
    // (finding lượt chấm 3). Chuỗi kỳ vọng RÚT TỪ HỢP ĐỒNG, không gõ lại.
    const hua4 = huaTuHopDong('AC-4');
    const sec1 = sectionCuoi(f.reportPath);
    for (const h of hua4) if (!sec1.includes(h)) errs.push(`section thieu hau to diff cham vat: "${cut(h, 90)}" · section=${cut(sec1, 200)}`);
    // Lượt ghim kế: chỉ commit tệp không khớp glob → khoá VẮNG HẲN.
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'y\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'lai khong cham');
    const r2 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}: ${cut(r2.stderr, 220)}`);
    const d2 = dongRepinCuoi(f.logPath);
    if (Object.keys(d2).includes('evals_not_machine_touched')) errs.push(`luot sach van co touched: ${JSON.stringify(d2.evals_not_machine_touched)}`);
    // Đối chứng cùng hậu tố: lượt sạch thì section KHÔNG mang nó (phép so có lực
    // vì vế trên đã chứng nó CÓ mặt khi chạm).
    const sec2 = sectionCuoi(f.reportPath);
    for (const h of hua4) if (sec2.includes(h)) errs.push(`luot sach van co hau to diff cham vat: ${cut(sec2, 200)}`);
    // Vật hồ sơ dưới _acceptance/<slug>/rang/ cũng khớp glob → VẪN tính chạm.
    fs.writeFileSync(path.join(f.ws, 'rang', 'r.mjs'), '// v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham rang');
    const r3 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r3.status !== 0) return errs.concat(`luot 3 exit ${r3.status}: ${cut(r3.stderr, 220)}`);
    const d3 = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d3.evals_not_machine_touched) !== JSON.stringify(['E6'])) errs.push(`vat ho so khop glob khong tinh cham: ${JSON.stringify(d3.evals_not_machine_touched)}`);
    return errs;
  },
  mutants: [
    { pin: 'touched vang du diff cham', make: () => mutLane('const chamNgoaiMay = chamTuPin(s);', 'const chamNgoaiMay = [];') },
    { pin: 'moc diff khong phai pin cu', make: () => mutLane("gitRaw('diff', '--name-only', vcCu, '--')", "gitRaw('diff', '--name-only', 'HEAD~1', '--')") },
    // Dòng chữ NGƯỜI đọc biến mất trong khi khoá JSON còn nguyên — đúng lỗ mà
    // phép đo cũ không thấy.
    { pin: 'section thieu hau to diff cham vat', make: () => mutLane('${veNgoaiMay}${veCham}${veAcKhong}', '${veNgoaiMay}${veAcKhong}') },
  ],
});

// ── GN07 ────────────────────────────────────────────────────────────────────
CASES.push({
  id: 'GN07',
  title: 'khớp glob bằng globToRe của carry-plan (* không xuyên /); đọc cả paths flow lẫn block-seq',
  real(lane) {
    const errs = [];
    // paths HẸP, dạng block-seq: apps/x/*.ts — tệp sâu hơn KHÔNG khớp.
    const hep = EVALS_MA_TRAN.replace('      - "apps/x/**"\n      - "_acceptance/feat-gn/rang/**"\n', '      - "apps/x/*.ts"\n');
    const f = mkKho({ evals: hep });
    fs.mkdirSync(path.join(f.root, 'apps', 'x', 'sub'), { recursive: true });
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'sub', 'a.ts'), 'v1\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'sau hon');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    if (Object.keys(d).includes('evals_not_machine_touched')) errs.push(`khop tien to thay glob: apps/x/sub/a.ts khong duoc khop apps/x/*.ts (${JSON.stringify(d.evals_not_machine_touched)})`);
    // Đối chứng dương: tệp ĐÚNG một tầng → khớp.
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'dung tang');
    const r2 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}: ${cut(r2.stderr, 220)}`);
    const d2 = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d2.evals_not_machine_touched) !== JSON.stringify(['E6'])) errs.push(`doi chung duong hong (block-seq): ${JSON.stringify(d2.evals_not_machine_touched)}`);
    // DẠNG FLOW: cùng lời hứa, cách viết khác — cả hai phải đọc được (đo ở crm:
    // 393 eval block-seq / 49 flow; bộ đọc chỉ nhận flow sẽ mù 89% ở đó).
    const flow = EVALS_MA_TRAN.replace('    paths:\n      - "apps/x/**"\n      - "_acceptance/feat-gn/rang/**"\n', '    paths: ["apps/x/**"]\n');
    const g = mkKho({ evals: flow });
    fs.writeFileSync(path.join(g.root, 'apps', 'x', 'a.ts'), 'v2\n');
    g.git('add', '-A'); g.git('commit', '-qm', 'cham');
    const rg = chayLan(g.root, g.slug, ['--write'], lane);
    if (rg.status !== 0) return errs.concat(`ho so paths flow exit ${rg.status}: ${cut(rg.stderr, 220)}`);
    const dg = dongRepinCuoi(g.logPath);
    if (JSON.stringify(dg.evals_not_machine_touched) !== JSON.stringify(['E6'])) errs.push(`paths dang flow khong doc duoc: ${JSON.stringify(dg.evals_not_machine_touched)}`);
    return errs;
  },
  mutants: [
    { pin: 'khop tien to thay glob', make: () => mutLane('res.some(re => re.test(f))', 'gl.some(g => f.startsWith(String(g).replace(/[*?].*$/, "")))') },
    { pin: 'paths dang flow khong doc duoc', make: () => mutLane("if (v.startsWith('[')) { const pv = core.parseFlowValue(v); return pv.kind === 'seq' ? pv.items : []; }", "if (v.startsWith('[')) { return []; }") },
  ],
});

// ── GN08 ────────────────────────────────────────────────────────────────────
// Bên đọc ĐỜI 2.17.0 = lớp vendored đang chạy ở kho tiêu thụ hôm nay.
const docMoc = (sha) => ({
  recheck: path.join(cayMoc(sha), 'scripts', 'recheck-evidence.cjs'),
  premerge: path.join(cayMoc(sha), 'scripts', 'pre-merge-check.sh'),
});

CASES.push({
  id: 'GN08',
  title: 'dòng ghim mang khoá mới: bên đọc hiện tại VÀ bên đọc 2.17.0 đều xanh, không VIOLATION',
  real() {
    const errs = [];
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write']);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const d = dongRepinCuoi(f.logPath);
    if (!d.evals_not_machine_touched) errs.push('fixture hong: dong ghim khong mang khoa moi');
    const cu = docMoc(MOC);
    const doc = [
      ['recheck nay', () => spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), f.reportPath], { encoding: 'utf8' })],
      [`recheck ${MOC}`, () => spawnSync(process.execPath, [cu.recheck, f.reportPath], { encoding: 'utf8' })],
      ['premerge nay', () => spawnSync('bash', [path.join(ROOT, 'scripts', 'pre-merge-check.sh'), f.root], { encoding: 'utf8' })],
      [`premerge ${MOC}`, () => spawnSync('bash', [cu.premerge, f.root], { encoding: 'utf8' })],
    ];
    for (const [ten, chay] of doc) {
      const x = chay();
      const out = String(x.stdout || '') + String(x.stderr || '');
      if (/VIOLATION|REPIN x/.test(out)) errs.push(`${ten} bao VIOLATION tren dong moi: ${cut(out.split('\n').filter(l => /VIOLATION|REPIN x/.test(l)).join(' | '), 200)}`);
    }
    // Đối chứng ĐỎ: gỡ evals_exit khỏi dòng → CẢ HAI lớp phải đỏ đúng thông điệp.
    const raw = fs.readFileSync(f.logPath, 'utf8').split('\n').filter(Boolean);
    const cuoi = JSON.parse(raw.pop()); delete cuoi.evals_exit;
    fs.writeFileSync(f.logPath, raw.concat(JSON.stringify(cuoi)).join('\n') + '\n');
    // Đối chứng đỏ chạy CẢ BỐN bộ đọc, không riêng hai recheck: một khẳng định
    // «không VIOLATION» chỉ sống khi chính bộ đọc ấy đã chứng minh nó BIẾT kêu.
    // Bỏ hai pre-merge ở đây là assertion âm-tính-một-mình — chúng có thể đang
    // không chạy, hoặc chạy mà không soi dòng ghim, và ca vẫn xanh (S4-r1).
    for (const [ten, chay] of doc) {
      const x = chay();
      const out = String(x.stdout || '') + String(x.stderr || '');
      if (x.status === 0 || !/recorded no evals_exit/.test(out)) errs.push(`doi chung do hong o ${ten}: exit ${x.status}, ${cut(out, 200)}`);
    }
    return errs;
  },
  mutants: [],   // chiều đỏ nằm TRONG ca (đối chứng gỡ evals_exit trên CẢ HAI lớp)
});

// ── GN09 / GN10 (thẻ hai cổng) ──────────────────────────────────────────────
const theExtract = (root, slug, gate, card = CARD) => {
  const r = spawnSync(process.execPath, [card, '--root', root, '--slug', slug, '--gate', String(gate), '--extract'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card --gate ${gate} exit ${r.status}: ${cut(r.stderr, 220)}`);
  return JSON.parse(r.stdout);
};
const theHtml = (root, slug, gate, card = CARD) => {
  const r = spawnSync(process.execPath, [card, '--root', root, '--slug', slug, '--gate', String(gate)], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card html --gate ${gate} exit ${r.status}: ${cut(r.stderr, 220)}`);
  return r.stdout;
};
const cardMoc = (sha) => path.join(cayMoc(sha), 'scripts', 'gate-card.js');
// Hợp đồng về `draft` để render được thẻ Cổng Phạm vi.
const veDraft = (f) => {
  const c = path.join(f.ws, 'contract.md');
  fs.writeFileSync(c, fs.readFileSync(c, 'utf8').replace('status: implemented', 'status: draft').replace('approved_by: Nguoi Ky\napproved_at: 2026-09-19\n', ''));
};
const sai = (got, ky) => (got.includes('AC-d') || got.includes('AC-a') ? `got AC bang ton tai: ${got.join(',')}`
  : (!got.includes('AC-b') ? `not-run tinh la chot: ${got.join(',')}` : `ac_khong sai: ${got.join(',')} (mong ${ky.join(',')})`));

CASES.push({
  id: 'GN09',
  title: 'thẻ Cổng Bằng chứng: cờ AC không có chốt máy + cờ pin đã chạm, round-trip với section',
  real(card) {
    const errs = [];
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write']);      // LƯỢT GHIM 1: pin chống lưng mang touched
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 220)}`];
    const x = theExtract(f.root, f.slug, 2, card);
    if (!x.chot_may) return ['the thieu co AC khong chot may: --extract khong co chot_may'];
    if (JSON.stringify(x.chot_may.ac_khong) !== JSON.stringify(AC_KHONG)) errs.push(sai(x.chot_may.ac_khong || [], AC_KHONG));
    if (JSON.stringify(x.chot_may.touched) !== JSON.stringify(['E6'])) errs.push(`chot_may.touched sai: ${JSON.stringify(x.chot_may.touched)}`);
    // ROUND-TRIP: danh sách AC của thẻ == danh sách trong section làn vừa ghi.
    const mAC = sectionCuoi(f.reportPath).match(/· AC không có chốt máy: ([^\n·]+)/);
    const secAC = mAC ? mAC[1].trim().split(/,\s*/) : [];
    if (JSON.stringify([...secAC].sort()) !== JSON.stringify([...(x.chot_may.ac_khong || [])].sort())) errs.push(`round-trip lech: section ${secAC.join(',')} · the ${(x.chot_may.ac_khong || []).join(',')}`);
    const html = theHtml(f.root, f.slug, 2, card);
    if (!html.includes('AC không có chốt máy khi ghim lại')) errs.push('the thieu co AC khong chot may: HTML khong co cau');
    if (!html.includes('diff đã chạm vật')) errs.push('HTML thieu co pin da cham');
    // NỘI DUNG cờ, không chỉ NHÃN: diễn giải AC→eval→kiểu phải đúng, và phải nằm
    // TRONG thẻ người đọc. Kỳ vọng dựng từ CHÍNH evals.yaml thẻ đọc (bộ đọc độc
    // lập), nên hỏng khâu phân loại kiểu là ĐỎ — nhãn suông thì không bắt được.
    const moKy = moMongDoi(EVALS_MA_TRAN);
    const moGot = x.chot_may.ac_khong_mo || [];
    if (JSON.stringify([...moGot].sort()) !== JSON.stringify([...moKy].sort())) errs.push(`the dien giai sai kieu/eval: ${JSON.stringify(moGot)} (mong ${JSON.stringify(moKy)})`);
    for (const s of moKy) if (!html.includes(s)) errs.push(`the thieu noi dung co: HTML khong mang "${s}"`);
    for (const id of (x.chot_may.touched || [])) {
      if (!new RegExp(`diff đã chạm vật[^<]*\\b${id}\\b`).test(html)) errs.push(`co fwarn khong neu id: HTML khong neu ${id}`);
    }
    // routing KHÔNG đổi so mốc 2.17.0 (LM20 baseline không được trôi).
    const cu = theExtract(f.root, f.slug, 2, cardMoc(MOC));
    if (JSON.stringify(x.routing) !== JSON.stringify(cu.routing)) errs.push(`routing doi so ${MOC}: ${JSON.stringify(x.routing)} vs ${JSON.stringify(cu.routing)}`);
    // CA ĐẶC HIỆU: lượt ghim 2 SẠCH → cờ tắt, touched rỗng (cờ đọc dòng CHỐNG LƯNG).
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'z\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'khong cham');
    const r2 = chayLan(f.root, f.slug, ['--write']);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}: ${cut(r2.stderr, 220)}`);
    const x2 = theExtract(f.root, f.slug, 2, card);
    if ((x2.chot_may.touched || []).length) errs.push(`fwarn tu dong repin khong chong lung: pin sach van bao touched ${JSON.stringify(x2.chot_may.touched)}`);
    if (theHtml(f.root, f.slug, 2, card).includes('diff đã chạm vật')) errs.push('fwarn tu dong repin khong chong lung: HTML van co co vang');
    // CHIỀU IM: hồ sơ toàn eval máy.
    const g = mkKho({ toanMay: true });
    chayLan(g.root, g.slug, ['--write']);
    const xg = theExtract(g.root, g.slug, 2, card);
    if ((xg.chot_may.ac_khong || []).length) errs.push(`chieu im hong: ho so toan may bao ac_khong ${JSON.stringify(xg.chot_may.ac_khong)}`);
    return errs;
  },
  obj: CARD,
  mutants: [
    { pin: 'the thieu co AC khong chot may', make: () => mutCard('const cm = chotMay(dir);', "const cm = { ac_khong: [], ac_khong_mo: [], touched: [] };") },
    { pin: 'got AC bang ton tai', make: () => mutCard('.filter(([, evs]) => evs.every(e => !evidenceCore.isRepinMachineEval(e)))', '.filter(([, evs]) => evs.some(e => !evidenceCore.isRepinMachineEval(e)))') },
    { pin: 'fwarn tu dong repin khong chong lung', make: () => mutCard('dongRepin.filter(o => o.sha === vc).pop()', 'dongRepin.filter(o => Array.isArray(o.evals_not_machine_touched)).pop()') },
    // Hỏng khâu phân loại kiểu eval: cờ vẫn hiện, NHÃN vẫn đúng, nội dung sai.
    { pin: 'the dien giai sai kieu/eval', make: () => mutCard("return `${e.executor}${st === 'not-run' ? ' not-run' : ''}`;", "return 'XXBROKENXX';") },
    // Cờ vàng cắt cụt: không còn nêu eval nào gây ra nó.
    { pin: 'co fwarn khong neu id', make: () => mutCard("diff đã chạm vật ${esc(cm.touched.join(', '))} đo", 'diff đã chạm vật gì đó đo') },
  ],
});

CASES.push({
  id: 'GN10',
  title: 'thẻ Cổng Phạm vi: cùng vị từ AC không có chốt máy, chiều im khi toàn eval máy',
  real(card) {
    const errs = [];
    const f = mkKho();
    veDraft(f);
    const x = theExtract(f.root, f.slug, 1, card);
    if (!x.chot_may) return ['the cong 1 thieu co: --extract gate 1 khong co chot_may'];
    if (JSON.stringify(x.chot_may.ac_khong) !== JSON.stringify(AC_KHONG)) errs.push(sai(x.chot_may.ac_khong || [], AC_KHONG));
    const html1 = theHtml(f.root, f.slug, 1, card);
    if (!html1.includes('AC không có chốt máy khi ghim lại')) errs.push('the cong 1 thieu co: HTML khong co cau');
    // NỘI DUNG cờ ở Cổng Phạm vi — cùng luật với Cổng Bằng chứng (GN09).
    const moKy1 = moMongDoi(EVALS_MA_TRAN);
    const moGot1 = x.chot_may.ac_khong_mo || [];
    if (JSON.stringify([...moGot1].sort()) !== JSON.stringify([...moKy1].sort())) errs.push(`the cong 1 dien giai sai kieu/eval: ${JSON.stringify(moGot1)} (mong ${JSON.stringify(moKy1)})`);
    for (const s of moKy1) if (!html1.includes(s)) errs.push(`the cong 1 thieu noi dung co: HTML khong mang "${s}"`);
    const cu = theExtract(f.root, f.slug, 1, cardMoc(MOC));
    if (JSON.stringify(x.routing) !== JSON.stringify(cu.routing)) errs.push(`routing doi so ${MOC}: ${JSON.stringify(x.routing)} vs ${JSON.stringify(cu.routing)}`);
    const g = mkKho({ toanMay: true });
    veDraft(g);
    const xg = theExtract(g.root, g.slug, 1, card);
    if ((xg.chot_may.ac_khong || []).length) errs.push(`chieu im hong: ${JSON.stringify(xg.chot_may.ac_khong)}`);
    return errs;
  },
  obj: CARD,
  mutants: [
    { pin: 'the cong 1 thieu co', make: () => mutCard("if (cmG1.ac_khong.length) flags.push(['finfo',", "if (false && cmG1.ac_khong.length) flags.push(['finfo',") },
    { pin: 'not-run tinh la chot', make: () => mutCard('evidenceCore.isRepinMachineEval(e)))\n    .map(([ac, evs])', "evidenceCore.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase())))\n    .map(([ac, evs])") },
    { pin: 'the cong 1 dien giai sai kieu/eval', make: () => mutCard("return `${e.executor}${st === 'not-run' ? ' not-run' : ''}`;", "return 'XXBROKENXX';") },
  ],
});

// ── GN11 / GN12 ─────────────────────────────────────────────────────────────
const lintMoc = (sha) => path.join(cayMoc(sha), 'scripts', 'eval-coverage-lint.js');

CASES.push({
  id: 'GN11',
  title: 'W8 giữ tiền tố cũ và NỐI câu giá; hợp đồng không có mặt người nhìn thì im',
  real(ref = {}) {
    const errs = [];
    const LINT_X = ref.lint || LINT;
    const f = mkKho();
    // Gỡ ui-check khỏi evals để W8 (nghĩa vụ lớp nhìn-thấy) nổ.
    fs.writeFileSync(path.join(f.ws, 'evals.yaml'), EVALS_TOAN_MAY.replace('slug: feat-may', `slug: ${f.slug}`));
    const chay = (root, lint = LINT_X) => String(spawnSync(process.execPath, [lint, root], { encoding: 'utf8' }).stdout || '');
    const out = chay(f.root);
    const w8 = out.split('\n').filter(l => /W8 surfaces include a human-visible/.test(l));
    if (!w8.length) return [`fixture hong: W8 khong no tren hop dong surfaces [ui] khong ui-check: ${cut(out, 200)}`];
    const d = w8.join(' ');
    for (const chuoi of ['không có chốt máy khi ghim lại', 'GUIDE §7.1', 'test/script cho cùng tiêu chí']) {
      if (!d.includes(chuoi)) errs.push(`W8 thieu cau gia: khong thay "${chuoi}"`);
    }
    // CHIỀU IM: surfaces [api] → số dòng cảnh báo BẰNG bản mốc 2.17.0 trên cùng fixture.
    const g = mkKho();
    // Fixture [api] phải sinh ≥1 cảnh báo, nếu không phép so chiều im lại là
    // 0 === 0 theo cách khác (gap-probe P1 của lượt nâng phạm vi). `parseACs` chỉ
    // nhận id dạng `AC-<số>`, nên ma trận id-chữ làm MỌI W im — ở đây dùng một
    // tiêu chí NGƯỠNG id số mà eval của nó không khai ca dưới-ngưỡng → W1 nổ.
    fs.writeFileSync(path.join(g.ws, 'evals.yaml'), 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.suite\n    expected: >\n      Xanh: dưới 200ms.\n');
    const gc = path.join(g.ws, 'contract.md');
    fs.writeFileSync(gc, fs.readFileSync(gc, 'utf8')
      .replace('surfaces: [ui]', 'surfaces: [api]')
      .replace('- AC-a: Given x, When y, Then z.', '- AC-1: Given tải bình thường, When gọi API, Then thời gian phản hồi < 200ms.'));
    // Dòng cảnh báo của lint THỤT ĐẦU DÒNG («      [slug] W6 …»), nên bộ đếm neo
    // `^\[` khớp 0 dòng và phép so «chiều im» hoá 0 === 0 — hằng đúng, chưa từng
    // có khả năng đỏ (lượt chấm 2 bắt được; sửa ở vòng nâng phạm vi).
    const dem = (o) => o.split('\n').filter(l => /^\s*\[/.test(l)).length;
    // ĐỐI CHỨNG DƯƠNG của chính bộ đếm: hồ sơ surfaces [ui] không ui-check PHẢI
    // ra > 0 dòng. Không có vế này thì một bộ đếm hỏng lại cho 0 === 0 lần nữa.
    // (Không so `nay` với `demUi`: hai hồ sơ tình cờ cùng số là chuyện thường,
    //  vế ấy kêu oan mà không nói thêm gì về lực của phép đo.)
    const demUi = dem(chay(f.root));
    if (demUi === 0) errs.push(`bo dem chieu im hang dung: hop dong surfaces [ui] khong ui-check ma dem duoc 0 dong canh bao`);
    const nay = dem(chay(g.root));
    const cu = dem(chay(g.root, lintMoc(MOC)));
    // Phép so chỉ có LỰC khi bản mốc thật sự in ra cái gì đó để so.
    if (cu === 0) errs.push(`phep so chieu im khong co luc: ban ${MOC} in 0 dong tren ho so [api]`);
    if (nay !== cu) errs.push(`chieu im hong: surfaces [api] ra ${nay} dong canh bao, ban ${MOC} ra ${cu}`);
    return errs;
  },
  mutants: [
    // Mutant của CHÍNH BỘ ĐẾM: hoàn nguyên neo `^\\[` (bản trước lượt chấm 2).
    // Bản sao chạy chiều thật của GN11; nếu nó vẫn PASS thì phép đo không phân
    // biệt được bộ đếm hỏng — đó đúng là lỗ đã lọt một lượt.
    { pin: 'bo dem chieu im hang dung',
      judge: (p) => {
        const r = spawnSync(process.execPath, [p], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN11', GNRO_SKIP_MUTANTS: BAT_TAY, GNRO_ROOT: ROOT } });
        const out = String(r.stdout || '') + String(r.stderr || '');
        // Bản sao PHẢI đỏ vì chính vế đối chứng dương mới thêm. Nó xanh nghĩa là
        // phép đo lại không phân biệt được bộ đếm hỏng — lỗ cũ chưa đóng.
        // Lượt bỏ chiều đỏ luôn thoát 1, nên mã thoát không phân biệt được gì —
        // phán bằng CHÍNH dòng kết quả của ca.
        return /FAIL: GN11/.test(out) && out.includes('bo dem chieu im hang dung') ? ['bo dem chieu im hang dung'] : [];
      },
      make: () => mutant(SELF, '/^\\s*\\[/.test(l)', '/^\\[/.test(l)') },
    { pin: 'W8 thieu cau gia',
      judge: (p) => CASES.find(c => c.id === 'GN11').real({ lint: p }),
      // Tiêm vào MỆNH ĐỀ mà ca đo (một trong ba chuỗi), không vào nhãn dẫn — đổi nhãn
      // thì câu giá vẫn nguyên và phép đo đúng khi im.
      // Chép TRỌN scripts + lib: lint require ../lib/eval-yaml.cjs, thiếu nó thì
      // bản sao fail-open advisory và ca đỏ vì HẠ TẦNG chứ không vì vật (P150).
      make: () => mutant(LINT, 'sẽ không có chốt máy khi ghim lại', 'sẽ ổn thôi', ['scripts', 'lib']) },
  ],
});

CASES.push({
  id: 'GN12',
  title: 'bộ chọn GNRO_CASES: một ca in đúng một dòng; khớp 0 ca thì đỏ có tên',
  real() {
    const errs = [];
    const mot = spawnSync(process.execPath, [SELF], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN02' } });
    const dong = String(mot.stdout).split('\n').filter(l => /^\s*(PASS|FAIL): GN\d\d/.test(l));
    if (dong.length !== 1) errs.push(`bo chon sai: GNRO_CASES=GN02 in ${dong.length} dong ket qua`);
    else if (!dong[0].includes('GN02')) errs.push(`bo chon sai: dong ket qua khong mang GN02 (${cut(dong[0], 80)})`);
    const khong = spawnSync(process.execPath, [SELF], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN99' } });
    if (khong.status === 0 || !String(khong.stdout).includes('GNRO_CASES khop 0 ca')) {
      errs.push(`bo chon 0 ca khong do: exit ${khong.status}, ${cut(khong.stdout, 140)}`);
    }
    return errs;
  },
  mutants: [
    { pin: 'bo chon 0 ca khong do',
      judge: (p) => { const r = spawnSync(process.execPath, [p], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN99' } }); return (r.status === 0 || !String(r.stdout).includes('GNRO_CASES khop 0 ca')) ? ['bo chon 0 ca khong do'] : []; },
      // Neo gồm dòng `const chosen` phía trước: chuỗi `if (!chosen.length)` một mình
      // khớp HAI lần (bộ chạy + chính dòng mũi tiêm này).
      make: () => mutant(SELF, "const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;\nif (!chosen.length) {", 'const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;\nif (!chosen.length) { process.exit(0); }\nif (false) {') },
  ],
});

// ── GN13 ────────────────────────────────────────────────────────────────────
// Đo HÀNH VI GHI, không đo residue: lối bị cấm khôi phục Y HỆT byte, nên
// `git status` trước/sau giống nhau và một phép đo residue sẽ XANH trong khi lỗi
// còn nguyên (gap-probe P0 của lượt nâng phạm vi). Chụp (sha256, size, mtime_ns):
// mtime bắt được cả lần ghi rồi khôi phục y hệt.
//
// Danh sách canh SUY TỪ VẬT, không gõ tay: mọi ca CÓ mutant (trừ chính GN13) ×
// mọi tệp git-theo-dõi dưới các thư mục nguồn — «đừng ghim con số thành danh
// sách đóng» (CLAUDE.md).
const VUNG_NGUON = ['scripts', 'lib', 'feature-loop', 'tests', 'GUIDE.md'];
function tepTheoDoi() {
  return execFileSync('git', ['-C', ROOT, 'ls-files', '--', ...VUNG_NGUON], { encoding: 'utf8' })
    .split('\n').filter(Boolean);
}
// Cây DÙNG MỘT LẦN cho chiều đỏ. Chiều đỏ của ca này cố tình GHI ĐÈ một tệp
// nguồn, nên nó KHÔNG được chạy trên cây dùng chung: đo 20/09 bằng cách lấy mẫu
// băm liên tục trong lượt chạy — `SKILL.md` mang băm khác trong ~0,44 s
// (3 781/457 649 mẫu). Cửa sổ đó đủ để một suite chạy song song đọc nhầm SKILL,
// và đủ để một làn ghim lại từ chối vì «cây bẩn» — đúng cơ chế sinh lượt đỏ
// không tái lập được của E12. Bản sao phải có LỊCH SỬ GIT (`cayMoc` gọi
// `git archive <mốc>`), và clone một mình chỉ mang HEAD nên phải phủ TRẠNG THÁI
// LÀM VIỆC của mọi tệp git-theo-dõi lên trên — không thì ca đo bản đã commit
// thay vì cây đang sửa.
function cayDungMotLan() {
  const d = mk('cay-');
  execFileSync('git', ['clone', '--local', '--quiet', ROOT, d]);
  for (const rel of tepTheoDoi()) {
    const src = path.join(ROOT, rel); const dst = path.join(d, rel);
    if (!fs.existsSync(src)) { fs.rmSync(dst, { force: true }); continue; }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
  return d;
}
function chupNguon(dsach, goc = ROOT) {
  const m = new Map();
  for (const rel of dsach) {
    const f = path.join(goc, rel);
    let st; try { st = fs.statSync(f); } catch { continue; }
    m.set(rel, { sha: createHash('sha256').update(fs.readFileSync(f)).digest('hex'), size: st.size, mtime: String(st.mtimeNs ?? st.mtimeMs) });
  }
  return m;
}
const soChupNguon = (truoc, sau) => [...truoc.entries()]
  .filter(([rel, a]) => { const b = sau.get(rel); return !b || b.sha !== a.sha || b.size !== a.size || b.mtime !== a.mtime; })
  .map(([rel]) => rel);

CASES.push({
  id: 'GN13',
  title: 'không ca nào GHI vào tệp nguồn theo dõi git — kể cả ghi rồi khôi phục y hệt',
  real(ref = {}) {
    const errs = [];
    const tepCa = ref.src || SELF;
    const coMutant = CASES.filter(c => (c.mutants || []).length && c.id !== 'GN13').map(c => c.id);
    if (coMutant.length < 3) errs.push(`danh sach ca suy tu vat qua it: ${coMutant.join(',')}`);
    const dsach = tepTheoDoi();
    const cay = cayDungMotLan();
    const truoc = chupNguon(dsach, cay);
    // Lưới thứ hai: cây DÙNG CHUNG phải không suy suyển dù ca được trao gốc khác
    // — bắt ca nào phớt lờ GNRO_ROOT mà ghi thẳng cây thật, và sửa lại được.
    const truocThat = chupNguon(dsach);
    const noiDungThat = new Map(dsach.map(rel => { try { return [rel, fs.readFileSync(path.join(ROOT, rel))]; } catch { return [rel, null]; } }));
    const r = spawnSync(process.execPath, [tepCa], {
      encoding: 'utf8',
      env: { ...process.env, GNRO_CASES: coMutant.join(','), GNRO_ROOT: cay },
    });
    const cham = soChupNguon(truoc, chupNguon(dsach, cay));
    if (cham.length) errs.push(`ca ghi de tep nguon that: ${cham.join(', ')}`);
    const chamThat = soChupNguon(truocThat, chupNguon(dsach));
    if (chamThat.length) {
      // Trả ĐÚNG các tệp bị chạm về bản đã chụp — không `git checkout` cả nhóm,
      // vì cây thường đang có sửa đổi chưa commit của chính người đang làm.
      for (const rel of chamThat) {
        const bak = noiDungThat.get(rel);
        if (bak !== null && bak !== undefined) fs.writeFileSync(path.join(ROOT, rel), bak);
      }
      errs.push(`ca ghi de CAY DUNG CHUNG (da tra lai): ${chamThat.join(', ')}`);
    }
    if (!errs.length && r.status !== 0) errs.push(`cac ca co mutant chay that bai (khong phai loi ghi): ${cut(r.stdout, 200)}`);
    return errs;
  },
  mutants: [
    // Lớp THẬT: ghi đè rồi khôi phục Y HỆT byte trong `finally` — đúng hình dạng
    // owner trả lại. Residue bằng 0, nên chỉ mtime tố cáo.
    { pin: 'ca ghi de tep nguon that',
      judge: (p) => CASES.find(c => c.id === 'GN13').real({ src: p }),
      // Neo vào judge của GN04 — ca chỉ có MỘT mutant, nên mũi tiêm không đụng
      // độ collide khi GN05 mọc thêm chiều đỏ (đã dẫm 20/09: thêm một judge
      // `{ guide: p }` thứ hai làm mũi tiêm cũ khớp hai lần, GN13 đỏ vì HẠ TẦNG).
      make: () => mutant(
        SELF,
        "judge: (p) => CASES.find(c => c.id === " + "'GN04'" + ").real({ skill: p })",
        "judge: (p) => { const bak = fs.readFileSync(SKILL, 'utf8'); try { fs.writeFileSync(SKILL, fs.readFileSync(p, 'utf8')); return CASES.find(c => c.id === 'GN04').real(); } finally { fs.writeFileSync(SKILL, bak); } }",
      ) },
  ],
});

// ── chạy ────────────────────────────────────────────────────────────────────
const want = (process.env.GNRO_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chosen.length) { console.log(`GNRO_CASES khop 0 ca: ${want.join(',')}`); process.exit(1); }
let passed = 0; let failed = 0;
for (const c of chosen) {
  const t0 = Date.now();
  let errs;
  try {
    errs = c.real(c.obj || LANE).map(e => `vat that: ${e}`);
    for (const m of (BO_CHIEU_DO ? [] : c.mutants || [])) {
      let got;
      try { got = (m.judge || c.real)(m.make()); } catch (e) { got = null; errs.push(`chieu do "${m.pin}" khong dung duoc: ${e.message}`); }
      if (got === null) continue;
      if (got.some(e => e.includes(m.pin))) process.stdout.write(`    · ${c.id} chieu do: ban sao do, ghim "${m.pin}"\n`);
      else errs.push(`chieu do khong do — ban sao khong ra "${m.pin}" (ra: ${cut(got.join(' | ') || 'khong loi nao', 220)})`);
    }
  } catch (e) { errs = [`ha tang: ${e.message}`]; }
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  const hauTo = BO_CHIEU_DO ? ' [KHONG CHIEU DO]' : '';
  if (!errs.length) { passed++; console.log(`  PASS: ${c.id} ${c.title}${hauTo} (${dt}s)`); } else { failed++; console.log(`  FAIL: ${c.id} ${c.title}${hauTo} (DO: ${errs.join(' | ')})`); }
}
if (BO_CHIEU_DO_LA) { console.log('GNRO_SKIP_MUTANTS dat sai gia tri — chi chinh tep ca dat duoc bat tay noi bo'); process.exit(3); }
console.log(`\nResults: ${passed} passed, ${failed} failed${BO_CHIEU_DO ? ' (KHONG CHIEU DO)' : ''}`);
// Lượt bỏ chiều đỏ KHÔNG BAO GIỜ được thoát 0: nó là lượt chạy con của một mutant,
// không phải một lượt chấm hợp lệ.
process.exit(failed || BO_CHIEU_DO ? 1 : 0);
