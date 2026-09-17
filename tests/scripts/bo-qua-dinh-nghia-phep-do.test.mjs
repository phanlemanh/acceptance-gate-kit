// DN — vị ngữ bỏ-qua của làn ghim lại phải THẤY tệp định nghĩa phép đo (hồ sơ
// thuoc-co-cua AC-3, AC-4, AC-5; nguồn gốc: hồ sơ draft bo-qua-phai-thay-dinh-nghia-phep-do).
//
// `_acceptance/config.yaml` (giải executors, suite_keys) và `_acceptance/<slug>/evals.yaml`
// là ĐẦU VÀO của làn, không phải vật hồ sơ: đổi chúng mà làn vẫn bỏ qua thì lệnh MỚI không
// bao giờ chạy trước chữ ký.
//
// Hai chiều trên CÙNG kho fixture code-sinh; pin do CHÍNH `repin-lane.mjs --write` ghi.
// Đột biến trên bản sao TRỌN thư mục feature-loop (không chép danh sách tệp tay); mỗi mũi
// tiêm khẳng định kim khớp đúng MỘT lần trong nguồn thật trước khi tin màu đỏ.
// Dấu vết suite nằm NGOÀI kho đang đo — để trong kho thì chính nó làm cây khác pin.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');              // suy từ vị trí tệp ca
// Trạng thái đã thông Cổng Bằng chứng rút từ MỘT nguồn của lib (lib/workspace-record.cjs), không gõ
// tay chuỗi: fixture chỉ cần một hồ sơ đã thông cổng để làn ghim lại đọc pin (ca RT13 vế hai).
const { DA_THONG_CONG_2 } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const LANE = path.join(KIT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const ADR = path.join(KIT, 'docs', 'adr', '0019-ban-ghi-dinh-tuyen-la-vat-t1-may-sinh.md');
const TMP = mkdtempSync(path.join(tmpdir(), 'dn-lane-'));
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${String(e.message).split('\n').join('\n    ')}`); } };

// ── kho git code-sinh ───────────────────────────────────────────────────────
// `sub` khác rỗng: gốc làn là thư mục con của một kho git lớn hơn (monorepo).
const EV = (id) => `  - id: ${id}\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`;
function dungKho(ten, { sub = '', slugs = ['demo'] } = {}) {
  const R = mkdtempSync(path.join(TMP, `${ten}-`));
  const L = sub ? path.join(R, sub) : R;
  const MARKER = path.join(mkdtempSync(path.join(TMP, `${ten}-dau-`)), 'suite-da-chay.txt');
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  mkdirSync(path.join(L, 'docs'), { recursive: true });
  mkdirSync(path.join(L, 'pkg', 'a', '_acceptance', 'feat'), { recursive: true });
  writeFileSync(path.join(L, 'suite.sh'), 'echo ran >> "$SK_MARKER"\nexit 0\n');
  writeFileSync(path.join(L, 'rang-e1.sh'), 'echo ran >> "$SK_MARKER"\ntest -f tien-de.txt\n');
  writeFileSync(path.join(L, 'tien-de.txt'), 'tien de\n');
  writeFileSync(path.join(L, 'src.js'), 'v1\n');
  writeFileSync(path.join(L, 'docs', 'x.md'), 'tai lieu\n');
  mkdirSync(path.join(L, '_acceptance'), { recursive: true });
  writeFileSync(path.join(L, '_acceptance', 'config.yaml'),
    'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  for (const s of slugs) {
    const ws = path.join(L, '_acceptance', s);
    mkdirSync(ws, { recursive: true });
    writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${s}\nslug: ${s}\nrisk_tier: T2\nsurfaces: [api]\nstatus: ${DA_THONG_CONG_2[0]}\napproved_by: Manh Phan\n---\n`);
    writeFileSync(path.join(ws, 'evals.yaml'), `schema_version: 1\nfeature_slug: ${s}\nevals:\n${EV('E1')}`);
  }
  git('init', '-q', '-b', 'main'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  for (const s of slugs) {
    const ws = path.join(L, '_acceptance', s);
    writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: `r1-${s}-E1`, sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
    writeFileSync(path.join(ws, 'evidence-report.md'),
      `---\nschema_version: 1\nfeature_slug: ${s}\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-${s}-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
  }
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const env = { ...process.env, SK_MARKER: MARKER };
  const chay = (bin, ...a) => spawnSync(process.execPath, [bin, '--root', L, '--ag-root', KIT, ...a], { encoding: 'utf8', env });
  // PIN do WRITER THẬT ghi, một lượt cho mọi slug
  const w = chay(LANE, ...slugs.flatMap(s => ['--slug', s]), '--reason', 'ghim ban dau', '--write');
  if (w.status !== 0) throw new Error(`fixture ${ten}: writer thật không ghi được pin (exit ${w.status}):\n${w.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  const clear = () => { if (existsSync(MARKER)) rmSync(MARKER); };
  const kho = {
    R, L, git,
    tep: (...p) => path.join(L, ...p),
    marker: () => (existsSync(MARKER) ? readFileSync(MARKER, 'utf8') : ''),
    // lượt đo bỏ-qua: KHÔNG --write (loại trừ nhau), --allow-dirty để cây làm việc tính luôn
    skip: (bin, slugList, ...a) => { clear(); return chay(bin, ...slugList.flatMap(s => ['--slug', s]), '--allow-dirty', '--skip-unchanged', ...a); },
  };
  return kho;
}
const json = (r) => { try { return JSON.parse(r.stdout || '{}'); } catch { return {}; } };
const boQua = (r) => json(r).skipped === true;
// Thay nội dung một tệp, khẳng định chuỗi kim có mặt đúng một lần; trả hàm hoàn nguyên.
function sua(file, kim, thay) {
  const goc = readFileSync(file, 'utf8');
  const n = goc.split(kim).length - 1;
  if (n !== 1) throw new Error(`kim khớp ${n} lần trong ${file} (cần 1): ${kim}`);
  writeFileSync(file, goc.replace(kim, thay));
  return () => writeFileSync(file, goc);
}

// ── bản sao đột biến: chép TRỌN feature-loop, tiêm một chỗ ────────────────────
let soDotBien = 0;
function dotBien(kim, thay) {
  const d = path.join(TMP, `dot-bien-${soDotBien++}`);
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 'repin-lane.mjs');
  const src = readFileSync(f, 'utf8');
  const n = src.split(kim).length - 1;
  if (n !== 1) throw new Error(`mũi tiêm khớp ${n} lần trong repin-lane.mjs thật (cần đúng 1): ${kim}`);
  writeFileSync(f, src.replace(kim, thay));
  execFileSync(process.execPath, ['--check', f], { stdio: ['ignore', 'pipe', 'pipe'] });
  return f;
}
// Kim của hai mũi tiêm là HAI dòng của khối SKIP-UNCHANGED-PREDICATE: tập suy-ra và
// phép thử thuộc-tập.
const KIM_TAP = 'const tepDinhNghia = new Set([configPath, ...perSlug.map(s => s.evalsPath)].map(quyVeGit));';
const KIM_THU = 'const laDinhNghia = (f) => tepDinhNghia.has(f);';
const lazy = (fn) => { let v; let e; let done = false; return () => { if (!done) { try { v = fn(); } catch (x) { e = x; } done = true; } if (e) throw e; return v; }; };
// Đột biến «danh sách gõ tay»: hai chuỗi đường dẫn thay cho tập suy-ra
const M_GO_TAY = lazy(() => dotBien(KIM_TAP, "const tepDinhNghia = new Set(['_acceptance/config.yaml', '_acceptance/demo/evals.yaml']);"));
// Đột biến «mọi thứ dưới thư mục hồ sơ đều là định nghĩa»
const M_MOI_ACCEPTANCE = lazy(() => dotBien(KIM_THU, "const laDinhNghia = (f) => f.split('/').includes('_acceptance');"));

let K;
try { K = dungKho('chinh', { slugs: ['demo', 'khac', 'demo-2'] }); }
catch (e) { console.log(`  FAIL: fixture chinh khong dung duoc\n    ${e.message}`); rmSync(TMP, { recursive: true, force: true }); console.log('\nResults: 0 passed, 1 failed (bo-qua-dinh-nghia-phep-do)'); process.exit(1); }
const CONFIG = K.tep('_acceptance', 'config.yaml');
const REPORT = K.tep('_acceptance', 'demo', 'evidence-report.md');
const LOG = K.tep('_acceptance', 'demo', 'run-log.jsonl');

check('DN1 doi gia tri executors trong _acceptance/config.yaml -> lan KHONG bo qua, chay lenh MOI va DO, goi ten tep dinh nghia', () => {
  // đối chứng dương: cây bằng pin → bỏ qua, suite không chạy
  const r0 = K.skip(LANE, ['demo']);
  assert.equal(r0.status, 0, r0.stderr);
  assert.equal(boQua(r0), true, `cây bằng pin mà không bỏ qua — phép đo không có nền:\n${r0.stderr}`);
  assert.equal(K.marker(), '', 'cây bằng pin mà suite vẫn chạy');
  const truoc = { log: readFileSync(LOG, 'utf8'), rep: readFileSync(REPORT, 'utf8') };
  // lệnh XANH → lệnh ĐỎ (mã 7 chỉ lệnh MỚI sinh ra được)
  const hoan = sua(CONFIG, 'rang_e1: "sh rang-e1.sh"', `rang_e1: 'bash -c "exit 7"'`);
  try {
    const r = K.skip(LANE, ['demo']);
    assert.notEqual(boQua(r), true, `định nghĩa phép đo đổi mà làn vẫn bỏ qua (skipped=true):\n${r.stderr}`);
    assert.equal(r.status, 1, `lệnh mới đỏ mà làn không ĐỎ (exit ${r.status}):\n${r.stderr}`);
    assert.equal(json(r).slugs.demo.evals_exit.E1, 7, 'evals_exit của E1 phải là mã của lệnh MỚI (7) — hành vi, không phải chuỗi');
    assert.notEqual(K.marker(), '', 'làn chạy thật thì dấu vết suite phải có');
    assert.match(r.stdout + r.stderr, /_acceptance\/config\.yaml/, 'thông điệp phải gọi tên tệp định nghĩa đã đổi');
    assert.match(r.stderr, /KHÔNG bỏ qua — tệp định nghĩa phép đo đổi so với pin: _acceptance\/config\.yaml/);
    assert.equal(readFileSync(LOG, 'utf8'), truoc.log, 'làn đỏ mà sổ chạy có thêm dòng repin');
    assert.equal(readFileSync(REPORT, 'utf8'), truoc.rep, 'làn đỏ mà báo cáo đổi');
  } finally { hoan(); }
  assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'hoàn nguyên config mà không bỏ qua lại');
});

check('DN2 them eval E9 vao evals.yaml -> lan chay tron, E9 co trong evals_exit cua dong repin', () => {
  const hoan = sua(K.tep('_acceptance', 'demo', 'evals.yaml'), EV('E1'), EV('E1') + EV('E9'));
  try {
    const r = K.skip(LANE, ['demo']);
    assert.notEqual(boQua(r), true, `thêm eval mà làn vẫn bỏ qua:\n${r.stderr}`);
    assert.equal(r.status, 0, `làn trọn phải xanh:\n${r.stderr}`);
    const dong = JSON.parse(json(r).slugs.demo.line);
    assert.equal(dong.kind, 'repin');
    assert.equal(dong.evals_exit.E9, 0, `dòng repin thiếu E9: ${JSON.stringify(dong.evals_exit)}`);
    assert.match(r.stderr, /tệp định nghĩa phép đo đổi so với pin: _acceptance\/demo\/evals\.yaml/);
  } finally { hoan(); }
  assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'hoàn nguyên evals.yaml mà không bỏ qua lại');
});

check('DN3-IM ma tran 4 o cua SK1b KHONG mat o nao; dot bien «moi thu duoi _acceptance la dinh nghia» lat ba o dau', () => {
  const M = M_MOI_ACCEPTANCE();
  // Lật phải QUY được về mũi tiêm, không về hạ tầng hỏng: bản đột biến chạy trọn
  // (exit 0, có kết quả từng slug) và nói lý do bằng chính thông điệp định nghĩa.
  const latThat = (i) => {
    const r = K.skip(M, ['demo']);
    if (boQua(r)) return `ô ${i} không lật`;
    if (r.status !== 0 || !json(r).slugs || !/KHÔNG bỏ qua — tệp định nghĩa phép đo/.test(r.stderr)) throw new Error(`ô ${i}: bản đột biến không chạy như một làn (exit ${r.status}) — mũi tiêm hỏng hạ tầng, màu đỏ không đo gì:\n${r.stderr}`);
    return null;
  };
  const keepRep = readFileSync(REPORT, 'utf8');
  const lat = [];
  try {
    // ô 1: vật hồ sơ sâu 2 — đúng tệp chữ ký ghi vào
    writeFileSync(REPORT, keepRep.replace('human_signoff: Manh 2026-09-01', 'human_signoff: Manh 2026-09-15 — ky lai'));
    assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'ô 1 MẤT: _acceptance/<slug>/evidence-report.md bẩn phải vẫn bỏ qua');
    lat.push(latThat(1));
    // ô 2: monorepo — _acceptance nằm sâu trong cây
    writeFileSync(K.tep('pkg', 'a', '_acceptance', 'feat', 'decisions.jsonl'), '{"id":"d-1"}\n');
    K.git('add', '-A'); K.git('commit', '-qm', 'mono ho so');
    assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'ô 2 MẤT: pkg/a/_acceptance/... phải vẫn bỏ qua');
    lat.push(latThat(2));
    // ô 3: tệp T1 đã khai
    writeFileSync(K.tep('docs', 'x.md'), 'tai lieu doi\n');
    assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'ô 3 MẤT: tệp khớp t1_skip_globs bẩn phải vẫn bỏ qua');
    lat.push(latThat(3));
    // ô 4: tiền tố GIẢ — không phải phân đoạn `_acceptance`, KHÔNG bỏ qua (như SK1b)
    mkdirSync(K.tep('_acceptance-x'), { recursive: true });
    writeFileSync(K.tep('_acceptance-x', 'y.md'), 'gia\n');
    K.git('add', '-A'); K.git('commit', '-qm', 'tien to gia');
    const r4 = K.skip(LANE, ['demo']);
    assert.notEqual(boQua(r4), true, 'ô 4 MẤT: `_acceptance-x/` là tiền tố giả — không được bỏ qua');
    assert.match(r4.stderr, /_acceptance-x\/y\.md/, 'ô 4 phải gọi tên tệp làm làn chạy');
    assert.doesNotMatch(r4.stderr, /tệp định nghĩa phép đo/, 'ô 4: tệp vật thường không được gọi là định nghĩa');
  } finally {
    if (existsSync(K.tep('_acceptance-x'))) { rmSync(K.tep('_acceptance-x'), { recursive: true }); K.git('add', '-A'); K.git('commit', '-qm', 'go tien to gia'); }
    writeFileSync(K.tep('docs', 'x.md'), 'tai lieu\n');
    writeFileSync(REPORT, keepRep);
  }
  assert.deepEqual(lat.filter(Boolean), [], `đột biến «mọi thứ dưới _acceptance là định nghĩa» phải lật ba ô đầu — phép đo IM không phân biệt được: ${lat.join(', ')}`);
  assert.equal(boQua(K.skip(LANE, ['demo'])), true, 'sau khi dọn phải bỏ qua lại');
});

check('DN4a goc lan la thu muc con pkg/a/ cua mot kho git lon hon -> vi ngu thay config; dot bien go tay DO', () => {
  const O = dungKho('mono', { sub: path.join('pkg', 'a'), slugs: ['demo'] });
  const M = M_GO_TAY();
  assert.equal(boQua(O.skip(LANE, ['demo'])), true, `đối chứng dương: cây bằng pin (gốc con) phải bỏ qua:\n${O.skip(LANE, ['demo']).stderr}`);
  const hoan = sua(O.tep('_acceptance', 'config.yaml'), 'rang_e1: "sh rang-e1.sh"', 'rang_e1: "sh ./rang-e1.sh"');
  try {
    const r = O.skip(LANE, ['demo']);
    assert.notEqual(boQua(r), true, `gốc con: config đổi mà làn bỏ qua:\n${r.stderr}`);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stderr, /tệp định nghĩa phép đo đổi so với pin: pkg\/a\/_acceptance\/config\.yaml/);
    assert.notEqual(O.marker(), '', 'làn chạy thật thì dấu vết suite phải có');
    const rm = O.skip(M, ['demo']);
    assert.equal(boQua(rm), true, `đột biến gõ tay KHÔNG đỏ ở gốc con (vẫn thấy config) — phép đo không phân biệt suy-ra với gõ-tay:\n${rm.stderr}`);
  } finally { hoan(); }
});

check('DN4b luot ghim hai slug, doi evals.yaml cua slug THU HAI -> vi ngu thay; dot bien go tay DO', () => {
  const M = M_GO_TAY();
  // đối chứng: bản gõ tay đúng ở ca mặc định (slug demo) — nó là một cài đặt hợp lý, không hỏng hạ tầng
  const hoanDemo = sua(K.tep('_acceptance', 'demo', 'evals.yaml'), EV('E1'), EV('E1') + EV('E2'));
  try { assert.notEqual(boQua(K.skip(M, ['demo', 'khac'])), true, 'bản gõ tay phải thấy evals.yaml của slug demo — đối chứng hỏng'); }
  finally { hoanDemo(); }
  const hoan = sua(K.tep('_acceptance', 'khac', 'evals.yaml'), EV('E1'), EV('E1') + EV('E2'));
  try {
    const r = K.skip(LANE, ['demo', 'khac']);
    assert.notEqual(boQua(r), true, `evals.yaml của slug thứ hai đổi mà làn bỏ qua:\n${r.stderr}`);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stderr, /tệp định nghĩa phép đo đổi so với pin: _acceptance\/khac\/evals\.yaml/);
    assert.equal(JSON.parse(json(r).slugs.khac.line).evals_exit.E2, 0, 'eval mới của slug thứ hai phải chạy');
    const rm = K.skip(M, ['demo', 'khac']);
    assert.equal(boQua(rm), true, `đột biến gõ tay KHÔNG đỏ ở slug thứ hai:\n${rm.stderr}`);
  } finally { hoan(); }
});

check('DN4c slug demo-2 chua ten slug demo: doi evals.yaml cua demo-2 trong luot chi ghim demo-2 -> vi ngu thay; dot bien go tay DO', () => {
  const M = M_GO_TAY();
  const hoan = sua(K.tep('_acceptance', 'demo-2', 'evals.yaml'), EV('E1'), EV('E1') + EV('E2'));
  try {
    const r = K.skip(LANE, ['demo-2']);
    assert.notEqual(boQua(r), true, `evals.yaml của demo-2 đổi mà làn bỏ qua:\n${r.stderr}`);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stderr, /tệp định nghĩa phép đo đổi so với pin: _acceptance\/demo-2\/evals\.yaml/);
    // chiều im: lượt chỉ ghim demo — evals.yaml của demo-2 không phải định nghĩa của nó
    const rIm = K.skip(LANE, ['demo']);
    assert.equal(boQua(rIm), true, `lượt ghim demo bị làm chạy bởi evals.yaml của demo-2 (khớp theo chuỗi con?):\n${rIm.stderr}`);
    const rm = K.skip(M, ['demo-2']);
    assert.equal(boQua(rm), true, `đột biến gõ tay KHÔNG đỏ ở demo-2:\n${rm.stderr}`);
  } finally { hoan(); }
});

// ── DN5: phép đo lời khai giới hạn — theo SỰ CÓ MẶT từng lời khai kèm ngưỡng ──
// Khuôn một lời khai: tiêu đề `### Giới hạn đã khai: <tên>`, thân tới tiêu đề kế,
// thân có một dòng `Ngưỡng đang đếm: <nội dung>`. Không đếm số khối, không so văn.
const GIOI_HAN = ['tệp chưa theo dõi', 'lệch glob bash/JS'];
function gioiHanThieu(text) {
  const khoi = text.split(/^(?=#{2,3} )/m).filter(k => /^### Giới hạn đã khai:/.test(k));
  return GIOI_HAN.filter(ten => !khoi.some(k => k.split('\n')[0].toLowerCase().includes(ten.toLowerCase())
    && /^Ngưỡng đang đếm:\s*\S/m.test(k)));
}
function goKhoi(text, ten) {
  const re = new RegExp(`^### Giới hạn đã khai: ${ten.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}[^\\n]*\\n[\\s\\S]*?(?=^#{2,3} |(?![\\s\\S]))`, 'm');
  const m = text.match(re);
  if (!m) throw new Error(`không tìm thấy khối để gỡ: ${ten}`);
  return text.replace(m[0], '');
}
check('DN5 ADR 0019 khai hai gioi han kem nguong dang dem; go mot khoi thi DO goi ten, them khoi thu ba hay sua van thi IM', () => {
  const adr = readFileSync(ADR, 'utf8');
  assert.deepEqual(gioiHanThieu(adr), [], `ADR 0019 thiếu lời khai giới hạn kèm ngưỡng: ${gioiHanThieu(adr).join(', ')}`);
  // chiều đỏ: gỡ TỪNG khối trong bản sao → đỏ gọi đúng tên khối bị gỡ
  for (const ten of GIOI_HAN) {
    const thieu = gioiHanThieu(goKhoi(adr, ten));
    assert.deepEqual(thieu, [ten], `gỡ khối «${ten}» mà phép đo không gọi đúng tên nó: ${JSON.stringify(thieu)}`);
  }
  // chiều đỏ: giữ tiêu đề, gỡ dòng ngưỡng
  const khongNguong = adr.replace(/(### Giới hạn đã khai: tệp chưa theo dõi[\s\S]*?)^Ngưỡng đang đếm:[^\n]*\n/m, '$1');
  assert.notEqual(khongNguong, adr, 'mũi tiêm gỡ dòng ngưỡng không khớp gì');
  assert.deepEqual(gioiHanThieu(khongNguong), ['tệp chưa theo dõi'], 'lời khai mất ngưỡng mà phép đo im');
  // chiều im: thêm lời khai thứ ba cùng khuôn
  const thuBa = adr + '\n### Giới hạn đã khai: một giới hạn khác\n\nVăn mô tả.\n\nNgưỡng đang đếm: ≥1 lần giữa hai bản phát hành.\n';
  assert.deepEqual(gioiHanThieu(thuBa), [], 'thêm lời khai thứ ba mà phép đo đỏ — nó đang đếm số khối');
  // chiều im: sửa văn xuôi ngoài hai lời khai
  const suaVan = adr.replace('owner gọi tên vòng meta duy nhất', 'owner gọi tên một vòng meta');
  assert.notEqual(suaVan, adr, 'mũi tiêm sửa văn không khớp gì');
  assert.deepEqual(gioiHanThieu(suaVan), [], 'sửa văn xuôi mà phép đo đỏ — nó đang so chuỗi cố định');
});

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${passed} passed, ${failed} failed (bo-qua-dinh-nghia-phep-do)`);
process.exit(failed ? 1 : 0);
