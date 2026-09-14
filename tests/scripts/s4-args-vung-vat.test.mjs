// s4-args-vung-vat.test.mjs — T2/T3 (khoi-tim-loi-tra-phi-theo-vat, AC-3):
// «vùng vật» có TÊN MÁY ĐỌC. Vùng vật = diff so nhánh chính TRỪ lời khai
// `risk_tiers.t1_skip_globs` của repo TRỪ văn bản hồ sơ vòng (.md/.jsonl trong thư
// mục hồ sơ). Mã răng, evals.yaml, config.yaml Ở LẠI — «thước tự dối» là lớp lỗi
// tỉ lệ cao nhất kit đo được, và 17/94 finding trong hợp đồng của crm-onehub nằm
// trên mã răng.
//
// VV4/VV5 do gap-probe 14/09 đòi thêm:
//   VV4 — seam bên-VIẾT (script này) sang bên-ĐỌC (workflow) phải round-trip: trường
//         `ngoaiVatGlobs` do writer phát, đem khớp bằng CHÍNH hàm khớp của reader.
//   VV5 — tệp được khai trong `paths` của một eval Ở LẠI delta bất kể đuôi. Không có
//         vế này thì sửa một fixture .md làm eval của nó được carry màu xanh CŨ
//         trong khi fixture đã đổi — chiều FAIL-OPEN.
//
// Fixture git do CODE SINH trong chính lần chạy; mọi đường dẫn suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-vungvat-'));
const sorted = a => JSON.stringify([...(a || [])].sort());

// Bộ khớp glob của bên ĐỌC — RÚT từ chính workflow, không chép tay: VV4 phải đo
// bằng cùng một phép khớp mà reader dùng, nếu không thì hai bên vẫn trôi được.
const { globToRe } = await import(path.join(KIT, 'feature-loop', 'scripts', 'carry-plan.mjs'));

function buildRepo({ t1 = true } = {}) {
  const d = path.join(TMP, 'r-' + String(pass + fail) + '-' + String(Date.now() % 100000));
  mkdirSync(path.join(d, '_acceptance', 'demo', 'rang'), { recursive: true });
  mkdirSync(path.join(d, 'docs'), { recursive: true });
  mkdirSync(path.join(d, 'src'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n'
    + (t1 ? 'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "**/*.md"\n' : ''));
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  // E1 khai paths trỏ mã sản phẩm; E2 khai paths trỏ một FIXTURE .md trong hồ sơ —
  // đúng hình dạng mà E2 của chính vòng này dùng (fixture thẻ P53).
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n'
    + '  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/**]\n    expected: x\n'
    + '  - id: E2\n    criterion: AC-2\n    executor: test\n    cmd: config:executors.test.api\n    paths: [_acceptance/demo/mau-the.md]\n    expected: y\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'gap-probe.md'), 'cu\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'decisions.jsonl'), '{"id":"d-1"}\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'mau-the.md'), 'fixture the — cu\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'rang', 'a.mjs'), 'cu\n');
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\n');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\n');
  writeFileSync(path.join(d, 'README.md'), 'r\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-qb', 'feat');
  // Đổi đủ sáu loại: mã sản phẩm · mã răng · config · văn bản hồ sơ · tài liệu · md gốc
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\nb\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'rang', 'a.mjs'), 'moi\n');
  appendFileSync(path.join(d, '_acceptance', 'config.yaml'), '# doi\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'gap-probe.md'), 'moi\n');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\nda sua\n');
  writeFileSync(path.join(d, 'README.md'), 'r2\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'feat');
  return d;
}

const run = (d, ...extra) => {
  const out = path.join(d, 'args.json');
  execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT,
    '--out', out, '--diff-base', 'main', ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};
const loi = e => String((e && e.stderr) || (e && e.message) || e).split('\n').filter(Boolean).slice(-2).join(' | ');

// ── VV1: vùng vật giữ mã sản phẩm + mã răng + config; bỏ tài liệu, md gốc, văn bản hồ sơ
{
  const d = buildRepo();
  try {
    const a = run(d);
    if (!Array.isArray(a.vungVat)) bad('VV1 args thiếu khoá vungVat', JSON.stringify(Object.keys(a)));
    else if (sorted(a.vungVat) !== sorted(['src/a.js', '_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml']))
      bad('VV1 vungVat sai', JSON.stringify(a.vungVat));
    else ok('VV1 vùng vật = mã sản phẩm + mã răng + config.yaml; bỏ tài liệu, md gốc, văn bản hồ sơ');
  } catch (e) { bad('VV1 s4-args lỗi', loi(e)); }
}

// ── VV2: repo KHÔNG khai t1_skip_globs → chỉ bỏ văn bản hồ sơ (tài liệu Ở LẠI)
{
  const d = buildRepo({ t1: false });
  try {
    const a = run(d);
    if (sorted(a.vungVat) === sorted(['src/a.js', '_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml', 'docs/note.md', 'README.md']))
      ok('VV2 không khai t1_skip_globs → chỉ bỏ văn bản hồ sơ, tài liệu ở lại');
    else bad('VV2 vungVat sai', JSON.stringify(a.vungVat));
  } catch (e) { bad('VV2 s4-args lỗi', loi(e)); }
}

// ── VV4: round-trip writer→reader — ngoaiVatGlobs khớp bằng CHÍNH hàm của reader
{
  const d = buildRepo();
  try {
    const a = run(d);
    const g = a.ngoaiVatGlobs;
    if (!Array.isArray(g) || !g.length) { bad('VV4 args thiếu ngoaiVatGlobs', JSON.stringify(Object.keys(a))); }
    else {
      const res = g.map(globToRe);
      const khop = p => res.some(re => re.test(p));
      const phaiKhop = ['_acceptance/demo/gap-probe.md', '_acceptance/demo/decisions.jsonl', 'docs/note.md', 'README.md'];
      const khongKhop = ['_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml', 'src/a.js'];
      const saiA = phaiKhop.filter(p => !khop(p));
      const saiB = khongKhop.filter(p => khop(p));
      if (saiA.length || saiB.length) bad('VV4 ngoaiVatGlobs khớp sai qua hàm của bên đọc', `thiếu khớp: ${saiA.join(',')} · khớp nhầm: ${saiB.join(',')}`);
      else ok('VV4 round-trip: ngoaiVatGlobs do writer phát, khớp đúng qua hàm khớp của bên đọc');
    }
  } catch (e) { bad('VV4 s4-args lỗi', loi(e)); }
}

// ── VV3 + VV5: deltaFiles (round ≥2) cùng bộ lọc; tệp khai trong eval.paths Ở LẠI
{
  const d = buildRepo();
  try {
    // dựng trạng thái round ≥2: report có Iterations + run-log có sha của round 1
    const ws = path.join(d, '_acceptance', 'demo');
    const anchor = git(d, 'rev-parse', 'main');
    writeFileSync(path.join(ws, 'evidence-report.md'), '---\nverdict: REJECT\n---\n\n## Iterations\n\nRound 1: REJECT.\n');
    writeFileSync(path.join(ws, 'run-log.jsonl'),
      JSON.stringify({ ts: '2026-09-01T00:00:00Z', round: 1, evalId: 'E1', run_id: 'demo-E1-001', exit_code: 0, cmd: 'echo x', sha: anchor }) + '\n');
    // VV5: sửa CHÍNH fixture .md mà E2 khai trong paths, sau anchor
    writeFileSync(path.join(ws, 'mau-the.md'), 'fixture the — DA SUA\n');
    git(d, 'add', '-A'); git(d, 'commit', '-qm', 'r1 + sua fixture');
    const a = run(d, '--carry-anchor', anchor);
    const df = a.deltaFiles || [];
    const co = p => df.includes(p);
    if (!co('_acceptance/demo/rang/a.mjs') || !co('_acceptance/config.yaml') || !co('src/a.js'))
      bad('VV3 deltaFiles thiếu mã răng / config / mã sản phẩm', JSON.stringify(df));
    else if (co('_acceptance/demo/gap-probe.md') || co('docs/note.md'))
      bad('VV3 deltaFiles CHỨA văn bản hồ sơ hoặc tài liệu', JSON.stringify(df));
    else ok('VV3 deltaFiles dùng CÙNG bộ lọc: mã răng + config là delta, văn bản hồ sơ và tài liệu không');
    // VV5 — chiều ĐỎ của fail-open: fixture .md có tên trong evals.yaml PHẢI là delta
    if (co('_acceptance/demo/mau-the.md'))
      ok('VV5 tệp khai trong eval.paths ở lại delta bất kể đuôi (fixture .md của E2)');
    else bad('VV5 fixture .md khai trong eval.paths bị loại khỏi delta — eval sẽ carry màu xanh cũ (FAIL-OPEN)', JSON.stringify(df));
    // VV5 đối chứng dương: một .md trong hồ sơ KHÔNG được khai thì vẫn bị loại
    if (!co('_acceptance/demo/gap-probe.md')) ok('VV5 đối chứng: .md hồ sơ KHÔNG khai trong eval.paths vẫn bị loại');
    else bad('VV5 đối chứng: .md không khai lại lọt vào delta', JSON.stringify(df));
  } catch (e) { bad('VV3/VV5 s4-args lỗi', loi(e)); }
}

// ── VV6: hai ca «vùng vật rỗng» phải nói ra KHÁC nhau ──────────────────────
// Làm thẳng trên nhánh chính thì merge-base(nhánh-chính, HEAD) = HEAD → diff rỗng →
// vùng vật rỗng → làn tìm-lỗi không spawn. Nếu im lặng, một mốc so SAI trông y hệt một
// vòng chỉ-đổi-tài-liệu. Gặp thật khi chạy S4 cho chính hồ sơ này (14/09).
{
  const d = buildRepo();
  try {
    // (a) mốc so TRÙNG HEAD → fail-LOUD, exit khác 0, KHÔNG sinh tệp args
    let raA = null;
    try { run(d, '--diff-base', 'feat'); raA = 'KHONG NO'; }
    catch (e) { raA = String((e && e.stderr) || ''); }
    if (raA !== 'KHONG NO' && /DIFF RỖNG/.test(raA) && /--diff-base/.test(raA))
      ok('VV6a mốc so trùng HEAD → fail-loud có tên, chỉ đúng cách sửa');
    else bad('VV6a mốc so trùng HEAD KHÔNG nổ (hạ tầng neo sai trông như vòng sạch)', String(raA).slice(0, 160));
    // (b) đối chứng dương: diff có tệp nhưng TOÀN tài liệu → đi tiếp, nói rõ lý do
    const d2 = buildRepo();
    execFileSync('git', ['-C', d2, 'checkout', '-q', 'main']);
    execFileSync('git', ['-C', d2, 'checkout', '-qb', 'chi-tai-lieu']);
    writeFileSync(path.join(d2, 'docs', 'note.md'), 'chi doi tai lieu\n');
    git(d2, 'add', '-A'); git(d2, 'commit', '-qm', 'chi tai lieu');
    let ghiChu = '';
    try { execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d2, '--ag-root', KIT,
      '--out', path.join(d2, 'a.json'), '--diff-base', 'main'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { ghiChu = 'NO: ' + String(e.stderr || '').slice(-160); }
    const a2 = ghiChu ? null : JSON.parse(readFileSync(path.join(d2, 'a.json'), 'utf8'));
    if (a2 && Array.isArray(a2.vungVat) && a2.vungVat.length === 0)
      ok('VV6b đối chứng dương: diff toàn tài liệu → vùng vật rỗng nhưng VẪN sinh args (hợp lệ)');
    else bad('VV6b diff toàn tài liệu lại không sinh được args', ghiChu || JSON.stringify(a2 && a2.vungVat));
  } catch (e) { bad('VV6 s4-args lỗi', loi(e)); }
}

console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-vung-vat)`);
process.exit(fail ? 1 : 0);
