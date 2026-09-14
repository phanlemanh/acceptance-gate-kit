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
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, appendFileSync, cpSync } from 'node:fs';
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

// Bên ĐỌC THẬT của `ngoaiVatGlobs` là `acceptance-verify.js`. Workflow chạy trong sandbox
// không import được module nên nó giữ BẢN CHÉP `globToRe` — ràng buộc thật, không sửa
// được. Nghi thức khi đó: phép đo phải rút bản của bên ĐỌC TỪ NGUỒN của nó rồi chạy,
// chứ không lấy hàm của bên VIẾT rồi gọi là bên đọc (bản trước làm vậy nên VV4 xanh
// vĩnh viễn với mọi divergence — lượt chấm 1 của hồ sơ này bắt, và hai bản ĐÃ trôi thật
// ở ký tự `?`).
const { globToRe: globVIET } = await import(path.join(KIT, 'feature-loop', 'scripts', 'carry-plan.mjs'));
const globDOC = (() => {
  const src = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = src.match(/function globToRe\(g\) \{[\s\S]*?\n\}/);
  if (!m) throw new Error('khong rut duoc globToRe tu acceptance-verify.js — ben doc doi khuon');
  return new Function('return ' + m[0].replace(/^function globToRe/, 'function'))();
})();
const globToRe = globDOC;   // VV4 khớp bằng hàm của BÊN ĐỌC

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

// ── VV4b: hai BẢN CHÉP của cùng một phép khớp glob không được trôi ─────────
// Ràng buộc sandbox buộc phải có hai bản; luật thay thế là ma trận viết trước đòi hai
// bản cho CÙNG kết quả trên mọi ô. Bản trước không có ca này nên chúng trôi thật ở `?`.
{
  const M = [
    ['docs/?.md', 'docs/a.md'], ['docs/?.md', 'docs/ab.md'],
    ['src/**/*.ts', 'src/a.ts'], ['src/**/*.ts', 'src/x/y.ts'],
    ['_acceptance/*/**/*.md', '_acceptance/x/y.md'], ['_acceptance/*/**/*.md', '_acceptance/x/a/b.md'],
    ['a*b', 'axxb'], ['a*b', 'ax/xb'], ['**', 'bat/ky/thu/gi'],
  ];
  const lech = M.filter(([g, f]) => globVIET(g).test(f) !== globDOC(g).test(f));
  if (!lech.length) ok(`VV4b hai bản khớp glob (viết/đọc) cho CÙNG kết quả trên ${M.length} ô viết trước`);
  else bad('VV4b hai bản khớp glob đã TRÔI', lech.map(([g, f]) => `«${g}» vs «${f}»`).join(' · '));
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
    // Ca TỰ TÍNH: đứng trên chính nhánh chính và KHÔNG khai --diff-base → merge-base
    // (main, HEAD) = HEAD. Đây là hình dạng gặp thật khi vòng commit thẳng nhánh chính.
    let raA = null;
    execFileSync('git', ['-C', d, 'checkout', '-q', 'main']);
    try {
      execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT,
        '--out', path.join(d, 'aA.json')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      raA = 'KHONG NO';
    } catch (e) { raA = String((e && e.stderr) || ''); }
    if (raA !== 'KHONG NO' && /DIFF RỖNG/.test(raA) && /TỰ TÍNH/.test(raA) && /--diff-base/.test(raA))
      ok('VV6a mốc so TỰ TÍNH trùng HEAD → fail-loud có tên, chỉ đúng cách sửa');
    else bad('VV6a mốc so trùng HEAD KHÔNG nổ (hạ tầng neo sai trông như vòng sạch)', String(raA).slice(0, 160));
    // VV6c — phân biệt AI nói ra mốc so: người KHAI tường minh là hành động có chủ đích
    // (bộ đo chỉ cần tệp args, không cần vật), mốc TỰ TÍNH ra rỗng thì không ai chọn nó.
    // Gộp hai ca là chặn oan chính bộ đo của kit (gặp thật: BG3/BG4 của bo-giai-nhay).
    const d3 = buildRepo();
    execFileSync('git', ['-C', d3, 'checkout', '-q', 'main']);
    let ghiChu3 = '', a3 = null;
    try {
      execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d3, '--ag-root', KIT,
        '--out', path.join(d3, 'a3.json'), '--diff-base', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      a3 = JSON.parse(readFileSync(path.join(d3, 'a3.json'), 'utf8'));
    } catch (e) { ghiChu3 = String(e.stderr || e.message).slice(-160); }
    if (a3 && Array.isArray(a3.vungVat) && a3.vungVat.length === 0)
      ok('VV6c người KHAI tường minh --diff-base HEAD → đi tiếp (sinh args), không chặn oan');
    else bad('VV6c khai tường minh --diff-base HEAD lại bị chặn', ghiChu3 || 'khong sinh duoc args');
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

// ══ VV7/VV8 — «MÃ ĐO» và «VÙNG PHỦ» đo ở BÊN VIẾT, không ở bên đọc ══════════
// Lượt chấm 2 của hồ sơ này bắt đúng một lớp: ĐỔI KHUÔN 14/09 dời cả hai phân loại
// (`laFileDo` → `fileDoTrongDiff`, `pathsKhaiRes` → `coverageFiles`) sang bên VIẾT,
// nhưng mọi ca canh chúng vẫn nằm ở bên ĐỌC (W41d, W47) và đều TỰ TRUYỀN đáp án —
// `fileDoTrongDiff: ['<chuỗi muốn thử>']` rồi assert `length > 0`. Năm ca đó cho cùng
// kết quả với BẤT KỲ chuỗi nào: thay `_acceptance/config.yaml` bằng `zzz` vẫn xanh.
// Tức là đo CHỈ DẪN, không đo ĐẦU RA — đúng hình dạng (1) của luật «thước gắn vào vật».
//
// Ở đây đo ĐẦU RA THẬT của `s4-args.mjs` trên một repo git do code sinh, và đóng CẢ HAI
// chiều theo nghi thức: chiều NHẠY (gỡ từng vế của `laFileDo` trong một BẢN SAO thì ca
// phải ĐỎ) và chiều ĐẶC HIỆU (diff không chạm mã đo thì danh sách phải RỖNG — đây chính
// là cái tắt lens measurement, tức là tiền).
function buildRepoDo({ coPaths = true, doiGi } = {}) {
  const d = path.join(TMP, 'do-' + String(pass + fail) + '-' + String(Date.now() % 100000));
  mkdirSync(path.join(d, '_acceptance', 'demo', 'rang'), { recursive: true });
  for (const sub of ['docs', 'src', 'lib', 'tests']) mkdirSync(path.join(d, sub), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n'
    + 'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  // E1 khai `paths` trỏ mã sản phẩm. `lib/**` KHÔNG eval nào khai — nó là đối chứng ÂM
  // cho cả hai phép: mã sản phẩm thật, trong vùng vật, nhưng không phải mã đo và không
  // nằm trong vùng phủ.
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n'
    + '  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n'
    + (coPaths ? '    paths: [src/**]\n' : '') + '    expected: x\n');
  const tep = {
    'src/a.js': 'a\n',
    'lib/b.js': 'b\n',
    'tests/x.test.mjs': 'x\n',
    '_acceptance/demo/rang/a.mjs': 'r\n',
    '_acceptance/demo/gap-probe.md': 'g\n',
    'docs/note.md': 'n\n',
  };
  for (const [f, v] of Object.entries(tep)) writeFileSync(path.join(d, f), v);
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-qb', 'feat');
  for (const f of doiGi) {
    if (f === '_acceptance/config.yaml') appendFileSync(path.join(d, f), '# doi\n');
    else writeFileSync(path.join(d, f), (tep[f] || '') + 'doi\n');
  }
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'feat');
  return d;
}

// Bản sao để tiêm: chép TRỌN thư mục `feature-loop` (không chép danh sách tệp tay —
// P150: bản base dựng bằng danh sách tay thiếu file thì đỏ vì HẠ TẦNG, không vì vật).
// s4-args không chỉ import sibling trong `scripts/` — nó còn ĐỌC
// `../workflows/acceptance-verify.js` để rút bảng trường bắt buộc, nên bản sao thiếu
// `workflows/` sẽ chết vì thiếu môi trường và mọi mũi tiêm trông như «răng sống».
function s4Mutant(before, after) {
  const d = path.join(TMP, 'mut-' + String(pass + fail) + '-' + String(Date.now() % 100000));
  mkdirSync(d, { recursive: true });
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 's4-args.mjs');
  const src = readFileSync(f, 'utf8');
  const n = src.split(before).length - 1;
  if (n !== 1) throw new Error(`mui tiem khop ${n} lan (can dung 1): ${before.slice(0, 70)}`);
  writeFileSync(f, src.replace(before, after));
  const c = execFileSync(process.execPath, ['--check', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  void c;
  return f;
}
const runBang = (script, d, ...extra) => {
  const out = path.join(d, 'args.json');
  execFileSync(process.execPath, [script, '--slug', 'demo', '--root', d, '--ag-root', KIT,
    '--out', out, '--diff-base', 'main', ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};

const DOI_DU = ['src/a.js', 'lib/b.js', 'tests/x.test.mjs', '_acceptance/demo/rang/a.mjs',
  '_acceptance/config.yaml', '_acceptance/demo/gap-probe.md', 'docs/note.md'];

// ── VV7: `fileDoTrongDiff` là ĐẦU RA THẬT của bốn vế `laFileDo`, và KHÔNG nuốt mã
//        sản phẩm thường (đối chứng âm `lib/b.js`)
{
  const d = buildRepoDo({ doiGi: DOI_DU });
  try {
    const a = runBang(S4ARGS, d);
    const mong = ['tests/x.test.mjs', '_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml', 'src/a.js'];
    if (!Array.isArray(a.fileDoTrongDiff)) bad('VV7 args thiếu khoá fileDoTrongDiff', JSON.stringify(Object.keys(a)));
    else if (sorted(a.fileDoTrongDiff) !== sorted(mong))
      bad('VV7 fileDoTrongDiff sai — bốn vế của laFileDo không cho đúng tập này', JSON.stringify(a.fileDoTrongDiff));
    else ok('VV7 fileDoTrongDiff = tệp ca + mã trong thư mục hồ sơ + config.yaml + eval.paths; KHÔNG gồm mã sản phẩm thường (lib/b.js)');
  } catch (e) { bad('VV7 s4-args lỗi', loi(e)); }
}

// ── VV7-IM (chiều ĐẶC HIỆU): diff chỉ chạm mã sản phẩm KHÔNG ai đo → danh sách RỖNG.
//    Đây là ca duy nhất tiết kiệm tiền (bên đọc tắt lens measurement). Không có nó,
//    VV7 không phân biệt được «bốn vế đúng» với «vế nào cũng khớp».
{
  const d = buildRepoDo({ doiGi: ['lib/b.js'] });
  try {
    const a = runBang(S4ARGS, d);
    if (sorted(a.vungVat) !== sorted(['lib/b.js']))
      bad('VV7-IM đối chứng dương hỏng: vùng vật không phải đúng lib/b.js', JSON.stringify(a.vungVat));
    else if (Array.isArray(a.fileDoTrongDiff) && a.fileDoTrongDiff.length === 0)
      ok('VV7-IM diff chỉ chạm mã sản phẩm không ai đo → fileDoTrongDiff RỖNG (bên đọc tắt lens measurement)');
    else bad('VV7-IM diff không chạm mã đo mà fileDoTrongDiff vẫn có phần tử', JSON.stringify(a.fileDoTrongDiff));
  } catch (e) { bad('VV7-IM s4-args lỗi', loi(e)); }
}

// ── VV7b (chiều NHẠY): gỡ TỪNG vế của `laFileDo` trong một bản sao → ca phải ĐỎ.
//    Finding lượt chấm 2 nói nguyên văn: «xoá vế `f === '_acceptance/config.yaml'` thì
//    không ca nào đỏ». Bốn mũi tiêm dưới đây đóng đúng câu đó, mỗi vế một mũi.
{
  const MUI = [
    ['vế tệp ca (DO_GLOBS)', 'const doRes = DO_GLOBS.map(globToRe);', 'const doRes = [];', 'tests/x.test.mjs'],
    ['vế _acceptance/config.yaml', "|| f === '_acceptance/config.yaml'", '|| false', '_acceptance/config.yaml'],
    ['vế mã trong thư mục hồ sơ', '|| (/^_acceptance\\/[^/]+\\//.test(f) && !/\\.(md|jsonl)$/.test(f))', '|| false', '_acceptance/demo/rang/a.mjs'],
    ['vế eval.paths', '|| pathsKhaiRes.some(re => re.test(f))', '|| false', 'src/a.js'],
  ];
  for (const [ten, before, after, tepMat] of MUI) {
    try {
      const script = s4Mutant(before, after);
      const d = buildRepoDo({ doiGi: DOI_DU });
      const a = runBang(script, d);
      const con = (a.fileDoTrongDiff || []).includes(tepMat);
      if (con) bad(`VV7b gỡ ${ten} mà fileDoTrongDiff VẪN chứa ${tepMat} — vế này không có răng nào canh`,
        JSON.stringify(a.fileDoTrongDiff));
      else ok(`VV7b gỡ ${ten} → ${tepMat} rụng khỏi fileDoTrongDiff (vế có răng)`);
    } catch (e) { bad(`VV7b mũi tiêm «${ten}» lỗi`, loi(e)); }
  }
}

// ── VV8: `coverageFiles` / `coEvalPaths` — vùng phủ cũng là ĐẦU RA của bên viết
{
  const d = buildRepoDo({ doiGi: DOI_DU });
  try {
    const a = runBang(S4ARGS, d);
    if (a.coEvalPaths !== true) bad('VV8 coEvalPaths phải true khi có eval khai paths', JSON.stringify(a.coEvalPaths));
    else if (sorted(a.coverageFiles) !== sorted(['src/a.js']))
      bad('VV8 coverageFiles sai — chỉ src/a.js được E1 khai paths', JSON.stringify(a.coverageFiles));
    else ok('VV8 coverageFiles = đúng tệp trong diff được một eval khai paths; lib/b.js nằm ngoài vùng phủ');
  } catch (e) { bad('VV8 s4-args lỗi', loi(e)); }
}

// ── VV8b (chiều ĐẶC HIỆU của coEvalPaths): KHÔNG eval nào khai paths → bên đọc phải
//    biết là «không tính được» (n-a), không phải «mọi finding đều ngoài vùng phủ».
{
  const d = buildRepoDo({ coPaths: false, doiGi: DOI_DU });
  try {
    const a = runBang(S4ARGS, d);
    if (a.coEvalPaths === false && sorted(a.coverageFiles) === sorted([]))
      ok('VV8b không eval nào khai paths → coEvalPaths=false + coverageFiles rỗng (bên đọc đọc ra n-a, không báo cụm giả)');
    else bad('VV8b không khai paths mà coEvalPaths/coverageFiles không nói ra',
      `coEvalPaths=${JSON.stringify(a.coEvalPaths)} coverageFiles=${JSON.stringify(a.coverageFiles)}`);
  } catch (e) { bad('VV8b s4-args lỗi', loi(e)); }
}

// ── VV8c (chiều NHẠY): gỡ bộ lọc vùng phủ ở bên viết → ca phải ĐỎ
{
  try {
    const script = s4Mutant('const coverageFiles = diffTatCa.filter(f => pathsKhaiRes.some(re => re.test(f)));',
      'const coverageFiles = diffTatCa;');
    const d = buildRepoDo({ doiGi: DOI_DU });
    const a = runBang(script, d);
    if ((a.coverageFiles || []).includes('lib/b.js'))
      ok('VV8c gỡ bộ lọc vùng phủ → lib/b.js lọt vào coverageFiles (ca VV8 có răng)');
    else bad('VV8c gỡ bộ lọc mà coverageFiles không đổi — VV8 không phân biệt được bản lành với bản hỏng',
      JSON.stringify(a.coverageFiles));
  } catch (e) { bad('VV8c mũi tiêm lỗi', loi(e)); }
}

console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-vung-vat)`);
process.exit(fail ? 1 : 0);
