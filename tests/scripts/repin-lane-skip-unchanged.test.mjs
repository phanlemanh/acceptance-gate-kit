// SK — làn re-pin BỎ QUA khi cây bằng pin (`--skip-unchanged`, hồ sơ
// chu-ky-khong-tu-lam-hoa-cu 15/09/2026, ADR 0017).
//
// Hai chiều cho mỗi phép đo, trên CÙNG kho fixture code-sinh:
//   ĐỎ  — tệp vật bẩn / commit sau pin → làn KHÔNG bỏ qua, chạy trọn, LÀN ĐỎ có tên.
//   IM  — vật hồ sơ (mọi độ sâu) + tệp T1 bẩn → vẫn bỏ qua, suite KHÔNG chạy.
// «Suite không chạy» đo bằng DẤU VẾT (suite ghi một tệp marker mỗi lần chạy),
// không suy từ thời gian.
// Pin `verified_commit` do CHÍNH `repin-lane.mjs --write` ghi trong lần chạy này
// (writer thật), không dựng tay theo khuôn bên đọc.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');            // suy từ vị trí script
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const SIGNOFF = path.join(ROOT, 'commands', 'signoff.md');
const RB = path.join(ROOT, 'tests', 'scripts', 'routing-baseline.mjs');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// ── kho git code-sinh ───────────────────────────────────────────────────────
const R = mkdtempSync(path.join(tmpdir(), 'sk-lane-'));
const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WS = path.join(R, '_acceptance', 'feat');
mkdirSync(WS, { recursive: true });
mkdirSync(path.join(R, 'docs'), { recursive: true });
mkdirSync(path.join(R, 'pkg', 'a', '_acceptance', 'feat'), { recursive: true });

// Dấu vết nằm NGOÀI kho đang đo: để trong kho thì chính nó là một tệp git theo
// dõi, và mỗi lượt chạy làm cây khác pin — hạ tầng đo tự làm bẩn vật.
const MARKER = path.join(mkdtempSync(path.join(tmpdir(), 'sk-marker-')), 'suite-da-chay.txt');
process.env.SK_MARKER = MARKER;
// Suite để lại DẤU VẾT mỗi lượt chạy — «không chạy» thành một sự kiện đo được.
writeFileSync(path.join(R, 'suite.sh'), 'echo ran >> "$SK_MARKER"\nexit 0\n');
writeFileSync(path.join(R, 'rang-e1.sh'), 'echo ran >> "$SK_MARKER"\ntest -f tien-de.txt\n');
writeFileSync(path.join(R, 'tien-de.txt'), 'tien de\n');
writeFileSync(path.join(R, 'src.js'), 'v1\n');
writeFileSync(path.join(R, 'docs', 'x.md'), 'tai lieu\n');           // T1
writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
  'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
writeFileSync(path.join(WS, 'contract.md'), '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n');
writeFileSync(path.join(WS, 'evals.yaml'), 'schema_version: 1\nfeature_slug: feat\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n');
git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
const H1 = git('rev-parse', 'HEAD');
writeFileSync(path.join(WS, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
writeFileSync(path.join(WS, 'evidence-report.md'),
  `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
git('add', '-A'); git('commit', '-qm', 'evidence');

const REPORT = path.join(WS, 'evidence-report.md');
const LOG = path.join(WS, 'run-log.jsonl');
const lane = (...a) => spawnSync(process.execPath, [LANE, '--root', R, '--ag-root', ROOT, ...a], { encoding: 'utf8' });
const vcOf = () => readFileSync(REPORT, 'utf8').match(/^verified_commit:\s*(\S+)/m)[1];
const marker = () => (existsSync(MARKER) ? readFileSync(MARKER, 'utf8') : '');
const clearMarker = () => { if (existsSync(MARKER)) rmSync(MARKER); };
const skipRun = (...a) => { clearMarker(); return lane('--slug', 'feat', '--allow-dirty', '--skip-unchanged', ...a); };

// ── PIN do WRITER THẬT ghi (không dựng tay theo khuôn bên đọc) ──────────────
const wrote = lane('--slug', 'feat', '--reason', 'ghim ban dau', '--write');
if (wrote.status !== 0) { console.log(`  FAIL: SK0 writer thật không ghi được pin\n    ${wrote.stderr}`); failed++; }
else { passed++; console.log('  PASS: SK0 pin do repin-lane --write that ghi (khong dung tay theo khuon ben doc)'); }
git('add', '-A'); git('commit', '-qm', 'repin');
const PIN = vcOf();

check('SK1 cay bang pin: skipped=true, mot dong stderr, suite KHONG chay, khong ghi gi', () => {
  const before = { log: readFileSync(LOG, 'utf8'), rep: readFileSync(REPORT, 'utf8') };
  const r = skipRun();
  assert.equal(r.status, 0, r.stderr);
  const o = JSON.parse(r.stdout);
  assert.equal(o.skipped, true, 'phải khai skipped');
  assert.equal(o.sha, git('rev-parse', 'HEAD'), 'sha của lượt bỏ qua phải là HEAD');
  assert.equal(o.pins.feat, PIN, 'pins phải nêu verified_commit mà writer thật vừa ghi');
  const dong = r.stderr.split('\n').filter(l => l.includes('cây bằng pin'));
  assert.equal(dong.length, 1, `đúng MỘT dòng «cây bằng pin», thấy ${dong.length}:\n${r.stderr}`);
  assert.match(dong[0], /làn bỏ qua/);
  assert.equal(marker(), '', 'suite ĐÃ CHẠY trong lượt lẽ ra bỏ qua (dấu vết có mặt)');
  assert.equal(readFileSync(LOG, 'utf8'), before.log, 'lượt bỏ qua mà sổ chạy đổi');
  assert.equal(readFileSync(REPORT, 'utf8'), before.rep, 'lượt bỏ qua mà báo cáo đổi');
});

check('SK1b ma tran 4 o loai-tru theo PHAN DOAN: vat ho so sau 2 + monorepo + T1 -> bo qua; tien to gia -> KHONG', () => {
  // (1) vật hồ sơ sâu 2 — đúng tệp chữ ký ghi vào
  writeFileSync(REPORT, readFileSync(REPORT, 'utf8').replace('human_signoff: Manh 2026-09-01', 'human_signoff: Manh 2026-09-15 — ky lai'));
  assert.equal(JSON.parse(skipRun().stdout).skipped, true, 'ô 1: _acceptance/<slug>/evidence-report.md (sâu 2) bẩn phải vẫn bỏ qua');
  // (2) monorepo: _acceptance nằm sâu trong cây
  const mono = path.join(R, 'pkg', 'a', '_acceptance', 'feat', 'decisions.jsonl');
  writeFileSync(mono, '{"id":"d-1"}\n'); git('add', '-A'); git('commit', '-qm', 'mono ho so');
  assert.equal(JSON.parse(skipRun().stdout).skipped, true, 'ô 2: pkg/a/_acceptance/... phải vẫn bỏ qua');
  // (3) tệp T1 đã khai
  writeFileSync(path.join(R, 'docs', 'x.md'), 'tai lieu doi\n');
  assert.equal(JSON.parse(skipRun().stdout).skipped, true, 'ô 3: tệp khớp t1_skip_globs bẩn phải vẫn bỏ qua');
  // (4) TIỀN TỐ GIẢ — không phải một phân đoạn `_acceptance`
  mkdirSync(path.join(R, '_acceptance-x'), { recursive: true });
  writeFileSync(path.join(R, '_acceptance-x', 'y.md'), 'gia\n');
  git('add', '-A'); git('commit', '-qm', 'tien to gia');
  const r4 = skipRun();
  assert.notEqual(JSON.parse(r4.stdout).skipped, true, 'ô 4: `_acceptance-x/` là tiền tố GIẢ — không được bỏ qua');
  assert.match(r4.stderr, /_acceptance-x\/y\.md/, 'phải gọi tên tệp làm làn chạy');
  // dọn ô 4 để các ca sau lại ở trạng thái cây-bằng-pin
  rmSync(path.join(R, '_acceptance-x'), { recursive: true });
  git('add', '-A'); git('commit', '-qm', 'go tien to gia');
  writeFileSync(path.join(R, 'docs', 'x.md'), 'tai lieu\n');
  assert.equal(JSON.parse(skipRun().stdout).skipped, true, 'sau khi dọn phải bỏ qua lại');
});

check('SK2 CHIEU DO: tep vat ban trong cay lam viec -> KHONG bo qua, lan chay tron va DO co ten', () => {
  rmSync(path.join(R, 'tien-de.txt'));            // phá vật thật: E1 mất tiền đề
  const r = skipRun();
  assert.equal(r.status, 1, `phá vật thật mà làn không đỏ:\n${r.stderr}`);
  assert.match(r.stderr, /tệp vật đổi so pin/, 'phải nói rõ vì sao KHÔNG bỏ qua');
  assert.match(r.stderr, /LÀN ĐỎ — không ghi gì \(suite \[0\]; eval đỏ: feat\/E1=1\)/);
  assert.notEqual(marker(), '', 'làn chạy thật thì dấu vết suite phải có');
  writeFileSync(path.join(R, 'tien-de.txt'), 'tien de\n');   // hoàn nguyên
});

check('SK2b CHIEU DO: commit SAU pin cham tep vat -> KHONG bo qua', () => {
  writeFileSync(path.join(R, 'src.js'), 'v2\n');
  git('add', '-A'); git('commit', '-qm', 'doi vat sau pin');
  const r = skipRun();
  assert.notEqual(JSON.parse(r.stdout || '{}').skipped, true, 'commit sau pin chạm vật mà vẫn bỏ qua');
  assert.match(r.stderr, /src\.js/);
  assert.notEqual(marker(), '', 'làn phải chạy thật');
  git('revert', '--no-edit', 'HEAD');             // về lại cây bằng pin
});

check('SK3 --skip-unchanged + --write -> usage exit 3, khong chay gi', () => {
  clearMarker();
  const r = lane('--slug', 'feat', '--skip-unchanged', '--write');
  assert.equal(r.status, 3, `hai cờ loại trừ nhau phải là usage exit 3, thấy ${r.status}:\n${r.stderr}`);
  assert.match(r.stderr, /loại trừ nhau/);
  assert.equal(marker(), '', 'usage mà vẫn chạy suite');
});

check('SK4 verified_commit VANG -> KHONG bo qua, in ly do, lan chay', () => {
  const keep = readFileSync(REPORT, 'utf8');
  writeFileSync(REPORT, keep.replace(/^verified_commit:.*$/m, 'verified_commit:'));
  const r = skipRun();
  assert.notEqual(JSON.parse(r.stdout || '{}').skipped, true, 'pin vắng mà vẫn bỏ qua');
  assert.match(r.stderr, /không có verified_commit|KHÔNG áp dụng/);
  writeFileSync(REPORT, keep);
});

check('SK4b verified_commit tro SHA MA -> KHONG bo qua', () => {
  const keep = readFileSync(REPORT, 'utf8');
  writeFileSync(REPORT, keep.replace(/^verified_commit:.*$/m, 'verified_commit: ' + 'd'.repeat(40)));
  const r = skipRun();
  assert.notEqual(JSON.parse(r.stdout || '{}').skipped, true, 'SHA ma mà vẫn bỏ qua');
  assert.match(r.stderr, /không có trong kho này/);
  writeFileSync(REPORT, keep);
});

check('SK5 lenh 7b rut tu SIGNOFF-LANE-CLAUSE chay o trang thai hau-buoc-6 -> skipped', () => {
  // Khối là NGUỒN của phép đo: dòng lệnh rút ra từ đây, không gõ lại ở test.
  const src = readFileSync(SIGNOFF, 'utf8');
  const blk = src.match(/<!-- <<<SIGNOFF-LANE-CLAUSE -->\n([\s\S]*?)<!-- SIGNOFF-LANE-CLAUSE>>> -->/);
  assert.ok(blk, 'signoff.md thiếu khối SIGNOFF-LANE-CLAUSE');
  const cmd = (blk[1].match(/^\s*node "<feature-loop>\/scripts\/repin-lane\.mjs".*$/m) || [])[0];
  assert.ok(cmd, 'khối không có dòng lệnh 7b');
  assert.ok(!/--write/.test(cmd), 'lệnh 7b không được mang --write');
  const argv = cmd.trim()
    .replace(/^node\s+"<feature-loop>\/scripts\/repin-lane\.mjs"\s*/, '')
    .replace(/--root \./, `--root ${R}`).replace(/<slug>/, 'feat')
    .split(/\s+/).filter(Boolean);

  // TRẠNG THÁI HẬU-BƯỚC-6 thật: chữ ký vừa ghi CHƯA commit + dòng bản ghi mốc
  // vừa sinh CHƯA commit. Đây là trạng thái ghép mà (d) và (c′) chỉ cùng nhau
  // mới tạo ra — fixture commit sạch sẽ bỏ lọt đúng ca này.
  writeFileSync(REPORT, readFileSync(REPORT, 'utf8').replace(/^human_signoff:.*$/m, 'human_signoff: Manh 2026-09-15 — hau buoc 6'));
  const FIXDIR = path.join(R, 'tests', 'scripts', 'fixtures');
  mkdirSync(FIXDIR, { recursive: true });
  const BASE = path.join(FIXDIR, 'routing-baseline.txt');
  writeFileSync(BASE, '# moc dinh tuyen\n');
  git('add', '-A'); git('commit', '-qm', 'them ban ghi moc');
  // khai nó là T1 đúng như kho kit làm, rồi làm bẩn nó như bước 6b vừa ghi
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
    readFileSync(path.join(R, '_acceptance', 'config.yaml'), 'utf8').replace('    - "docs/**"\n', '    - "docs/**"\n    - "tests/scripts/fixtures/routing-baseline.txt"\n'));
  git('add', '-A'); git('commit', '-qm', 'khai T1 cho ban ghi moc');
  // pin phải theo kịp cây (hai commit trên chạm tệp ngoài _acceptance/)
  const rp = lane('--slug', 'feat', '--reason', 'ghim truoc ca 7b', '--write');
  assert.equal(rp.status, 0, `ghim lại trước ca 7b phải xanh:\n${rp.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin truoc 7b');
  writeFileSync(BASE, '# moc dinh tuyen\nfeat\thoi=ký hay trả\tbao=cắt/hoãn\n');   // bước 6b vừa sinh, CHƯA commit
  writeFileSync(REPORT, readFileSync(REPORT, 'utf8').replace(/^human_signoff:.*$/m, 'human_signoff: Manh 2026-09-15 — hau buoc 6'));

  clearMarker();
  const r = spawnSync(process.execPath, [LANE, ...argv, '--ag-root', ROOT], { encoding: 'utf8' });
  assert.equal(r.status, 0, `lệnh 7b ở trạng thái hậu-bước-6 phải exit 0:\n${r.stderr}`);
  assert.equal(JSON.parse(r.stdout).skipped, true, `chữ ký + bản ghi mốc bẩn mà làn vẫn chạy trọn — cắt không có hiệu lực ở lượt ký thật:\n${r.stderr}`);
  assert.equal(marker(), '', 'lượt bỏ qua mà suite vẫn chạy');
});

check('SK6 so sach: ADR 0017 neu ADR 0007, GUIDE 7.1 va CHANGELOG neu --skip-unchanged', () => {
  const adr = readFileSync(path.join(ROOT, 'docs', 'adr', '0017-ban-ghi-dinh-tuyen-la-vat-t1-may-sinh.md'), 'utf8');
  assert.match(adr, /ADR 0007/, 'ADR 0017 phải nối vào ADR 0007');
  assert.match(adr, /ĐIỀU KIỆN THU HỒI/, 'miễn trừ T1 phải mang điều kiện thu hồi');
  assert.match(readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8'), /--skip-unchanged/);
  assert.match(readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8'), /hoá cũ|hoá cu/);
  assert.ok(existsSync(RB), 'lệnh sinh bản ghi mốc phải tồn tại');
});

rmSync(R, { recursive: true, force: true });
console.log(`\nResults: ${passed} passed, ${failed} failed (repin-lane-skip-unchanged)`);
process.exit(failed ? 1 : 0);
