// CE (consumer-esm, bugfix 1.39.1) — lớp "vật chép sang consumer chưa từng
// được đo ở consumer": repo tiêu thụ khai `"type": "module"` làm Node đọc file
// `.js` chép sang thành ESM, `require()` bên trong nổ ReferenceError, và tầng
// recheck + gap-probe chết CÂM trong khi suite tự-host của kit vẫn xanh (kho
// kit không có package.json gốc nên `.js` = CJS ở xưởng). GĐ2 ván 1
// (floorplanstudio, sổ vấp #23-24) trả giá bằng một pre-merge đỏ chặn merge.
//
// Phép đo dựng CONSUMER GIẢ-LẬP bằng code trong chính lần chạy:
//   1. Danh sách chép round-trip từ commands/acceptance-init.md (marker
//      INIT-CI-COPY-LIST) — KHÔNG chép tay, để danh-sách-thiếu tự làm test đỏ.
//   2. QUAN HỆ "mọi lib pre-merge dùng ⊆ danh sách chép" ghim bằng máy — thêm
//      một lib mới vào pre-merge mà quên khai chép là ĐỎ ngay tại đây.
//   3. Chiều XANH: recheck exit 0 trên evidence lành + exit 1 ĐÚNG THÔNG ĐIỆP
//      trên bản tiêm (chứng minh nó CHẤM thật, không phải chết-mà-im); pre-merge
//      chạy trọn `rules ran=4`, không một dòng NOT ENFORCED / fallback nào.
//   4. Chiều ĐỎ: cùng NỘI DUNG file nhưng mang đuôi .js (đúng layout trước vá)
//      phải nổ ReferenceError "require is not defined" — đối chứng dương là
//      chính bản .cjs cùng nội dung, cùng repo, đã xanh ở (3).
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// ── 1. Round-trip danh sách chép từ chỉ dẫn thật ────────────────────────────
const initMd = readFileSync(path.join(ROOT, 'commands', 'acceptance-init.md'), 'utf8');
const listBlock = (initMd.split('<!-- <<<INIT-CI-COPY-LIST -->')[1] || '').split('<!-- INIT-CI-COPY-LIST>>> -->')[0];
const COPIES = [];
for (const m of listBlock.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)`\s*→\s*`([^`]+)\//g)) {
  COPIES.push({ src: m[1], dstDir: m[2] });
}

check('CE1 danh sách chép trích được từ marker (sanity ≥ 7 mục, mọi src tồn tại)', () => {
  assert.ok(COPIES.length >= 7, `chỉ trích được ${COPIES.length} mục từ INIT-CI-COPY-LIST — marker/khuôn hỏng`);
  for (const c of COPIES) {
    assert.ok(existsSync(path.join(ROOT, c.src)), `src trong danh sách chép không tồn tại ở kho: ${c.src}`);
  }
});

// Dùng chung cho CE2 (bản thật), CE2m/CE2g/CE2gm (mutant trong-lần-chạy): trích tập file
// pre-merge/recheck DÙNG, rồi so với một danh-sách-khai bất kỳ.
//
// Ba chỗ gap-probe 16/09 bắt được ở bản đầu, vá theo LỚP chứ không vá từng ca:
//   P1#2 — regex cũ `[a-z-]+\.cjs` chỉ thấy kebab-thường-đuôi-cjs, trong khi lib/ của
//          chính kho đã có .mjs/.js/.json: thêm `lib/x2.cjs` hay `lib/design-detect.mjs`
//          vào pre-merge rồi quên khai là XANH. Nay charset rộng + 4 đuôi.
//   P1#3 — quan hệ chỉ đi MỘT bước: ac-line→md-section, lop-nhin-thay→eval-yaml,
//          evidence-core→eval-yaml nằm trong danh sách chỉ vì pre-merge TÌNH CỜ cũng
//          nhắc tên chúng. Nay đóng BAO ĐÓNG require/__dirname, nên gỡ lời nhắc ở
//          pre-merge cũng không làm mắt xích biến mất.
//   P2#7 — `scripts/recheck-evidence.cjs` vào tập nhờ một dấu NHÁY KÉP; đổi kiểu nháy
//          là mắt xích biến mất. Nay nhận theo vị trí `$HERE/<file>` (thư mục của chính
//          script) — cùng thứ shell thật sự chạy.
const DUOI = String.raw`(?:cjs|mjs|js|json)`;
const TEN_TEP = new RegExp(String.raw`^[A-Za-z0-9][A-Za-z0-9._-]*\.${DUOI}$`);

// Các đường nạp mà MỘT tệp JS kéo theo, trả về đường dẫn tính từ gốc kho.
function nap(relPath) {
  if (!/\.(cjs|mjs|js)$/.test(relPath)) return [];
  const abs = path.join(ROOT, relPath);
  if (!existsSync(abs)) return [];
  const src = readFileSync(abs, 'utf8');
  const dir = path.dirname(relPath);
  const out = [];
  for (const m of src.matchAll(/(?:require|import)\(\s*['"](\.[^'"]+)['"]\s*\)/g)) out.push(path.join(dir, m[1]));
  for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) out.push(path.join(dir, m[1]));
  for (const m of src.matchAll(/path\.join\(\s*__dirname\s*,([^)]*)\)/g)) {
    const phan = m[1].split(',').map(x => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    if (phan.length && TEN_TEP.test(phan[phan.length - 1])) out.push(path.join(dir, ...phan));
  }
  return out;
}

// Tập tệp mà cổng THẬT SỰ nạp, tính từ hai điểm vào; `pmText` cho phép mutant
// tiêm vào BẢN SAO văn bản pre-merge mà không chạm tệp thật.
// Điểm vào THỨ BA của CI kho tiêu thụ (ho-so-khep-thoi-hoi AC-3): lệnh `product_map:` mà khuôn
// config của acceptance-init dựng — rút từ CHÍNH dòng ấy, không gõ tay tên tệp. Hai điểm vào đầu
// (pre-merge + $HERE/recheck) đã có; thiếu điểm này là crm chép đủ 10 tệp mà CI đỏ ngày cài
// (MODULE_NOT_FOUND ở trang-thai-ho-so.cjs — PR crm #70, 22/09).
function diemVaoBanDo(initText) {
  const m = /product_map:\s*"node \$\{CLAUDE_PLUGIN_ROOT\}\/([^\s"]+)/.exec(initText ?? initMd);
  return m ? m[1] : null;
}
function tapDung(pmText, diemVao = diemVaoBanDo()) {
  const pm = pmText ?? readFileSync(path.join(ROOT, 'scripts', 'pre-merge-check.sh'), 'utf8');
  const used = new Set(['scripts/pre-merge-check.sh', ...(diemVao ? [diemVao] : [])]);
  // lib/: nhận rộng — mọi tệp lib nhắc trong cổng đều phải theo cổng sang consumer.
  for (const m of pm.matchAll(new RegExp(String.raw`lib\/([A-Za-z0-9][A-Za-z0-9._-]*\.${DUOI})`, 'g'))) used.add(`lib/${m[1]}`);
  // scripts/: chỉ thứ cổng NẠP theo vị trí thư mục của chính nó, không phải mọi tên
  // .mjs/.js được nhắc trong chú thích (gate-card.js, config-patch.mjs là lời khuyên
  // cho người, consumer không cần chép).
  for (const m of pm.matchAll(new RegExp(String.raw`\$HERE\/([A-Za-z0-9][A-Za-z0-9._-]*\.${DUOI})`, 'g'))) used.add(`scripts/${m[1]}`);
  // Bao đóng: đi tới điểm bất động.
  for (let doi = true; doi; ) {
    doi = false;
    for (const u of [...used]) for (const n of nap(u)) if (!used.has(n)) { used.add(n); doi = true; }
  }
  return used;
}

function usedVsDeclared(declaredSrcs, pmText, diemVao) {
  const used = tapDung(pmText, diemVao);
  const declared = new Set(declaredSrcs);
  return { used, missing: [...used].filter(u => !declared.has(u)) };
}

check('CE2 QUAN HỆ đủ-bộ: mọi file scripts/+lib/ mà pre-merge-check.sh và recheck dùng đều nằm trong danh sách chép', () => {
  const { used, missing } = usedVsDeclared(COPIES.map(c => c.src));
  assert.ok(used.size >= 7, `sanity: chỉ nhận diện ${used.size} file dùng — phép nhận diện hỏng`);
  assert.deepEqual(missing, [], `pre-merge/recheck dùng file KHÔNG có trong danh sách chép của acceptance-init: ${missing.join(', ')}`);
});

check('CE2m mutant trong-lần-chạy: bỏ 1 mục khỏi danh-sách-khai → quan hệ phải ĐỎ ghim đúng tên (gap-probe S1 P1#1)', () => {
  const mutated = COPIES.map(c => c.src).filter(s => s !== 'lib/gap-probe.cjs');
  assert.equal(mutated.length, COPIES.length - 1, 'mutant không bỏ được mục nào — tên mục trong danh sách đã đổi?');
  const { missing } = usedVsDeclared(mutated);
  assert.ok(missing.includes('lib/gap-probe.cjs'), `phép đo quan hệ không đỏ khi thiếu lib/gap-probe.cjs (missing=${JSON.stringify(missing)})`);
});

check('CE2p điểm vào thứ ba rút từ dòng product_map: của khuôn config; bao đóng của nó ⊆ danh sách chép', () => {
  const dv = diemVaoBanDo();
  assert.ok(dv, 'không rút được dòng product_map: từ khuôn config trong commands/acceptance-init.md');
  assert.ok(existsSync(path.join(ROOT, dv)), `điểm vào ${dv} không tồn tại ở kho`);
  const { used, missing } = usedVsDeclared(COPIES.map(c => c.src));
  assert.ok(used.has(dv), `bao đóng không chứa chính điểm vào ${dv}`);
  const chiCuaBanDo = [...tapDung(undefined, dv)].filter(u => !tapDung(undefined, null).has(u));
  assert.ok(chiCuaBanDo.length >= 2, `điểm vào thứ ba không kéo thêm tệp nào (${JSON.stringify(chiCuaBanDo)}) — phép nhận diện import/require của .mjs hỏng?`);
  assert.deepEqual(missing, [], `danh sách chép thiếu tệp mà lệnh bản đồ nạp: ${missing.join(', ')}`);
});

check('CE2p-dot-bien bỏ scripts/trang-thai-ho-so.cjs khỏi danh-sách-khai → quan hệ ĐỎ ghim đúng tên', () => {
  const TEN = 'scripts/trang-thai-ho-so.cjs';
  const mutated = COPIES.map(c => c.src).filter(x => x !== TEN);
  assert.equal(mutated.length, COPIES.length - 1, `mutant không bỏ được ${TEN} — tên mục trong danh sách đã đổi?`);
  const { missing } = usedVsDeclared(mutated);
  assert.ok(missing.includes(TEN), `phép đo quan hệ không đỏ khi thiếu ${TEN} (missing=${JSON.stringify(missing)})`);
});

// Mutant trên BẢN SAO văn bản pre-merge: chứng minh chân «gắn vào writer» thật sự
// nhận diện được thứ nó hứa nhận (gap-probe 16/09 P1#2, P1#3).
check('CE2w chân writer: tên lib có chữ số/đuôi .mjs vẫn vào tập DÙNG, và mắt xích bắc cầu sống khi gỡ hết lời nhắc trực tiếp', () => {
  const pm = readFileSync(path.join(ROOT, 'scripts', 'pre-merge-check.sh'), 'utf8');
  const that = usedVsDeclared(COPIES.map(c => c.src));
  assert.deepEqual(that.missing, [], 'đối chứng dương hỏng: bản pre-merge thật đã lệch danh sách chép');

  for (const ten of ['lib/lop-nhin-thay-v2.cjs', 'lib/eval_yaml2.cjs', 'lib/design-detect.mjs', 'lib/Bang-Chu-Hoa.js']) {
    const tiem = pm.replace('GP_LIB=', `# ${ten}\nGP_LIB=`);
    assert.notEqual(tiem, pm, 'mutant không tiêm được — neo GP_LIB= đã đổi?');
    const { used, missing } = usedVsDeclared(COPIES.map(c => c.src), tiem);
    assert.ok(used.has(ten), `phép nhận diện KHÔNG thấy ${ten} — lib mới vào cổng mà quên khai sẽ xanh`);
    assert.ok(missing.includes(ten), `thấy ${ten} nhưng không báo thiếu khai (missing=${JSON.stringify(missing)})`);
  }

  // Bao đóng: gỡ MỌI lời nhắc trực tiếp `lib/eval-yaml.cjs` khỏi văn bản cổng.
  // Nó vẫn phải ở trong tập DÙNG, vì evidence-core.cjs và lop-nhin-thay.cjs require nó.
  const khongNhac = pm.split('lib/eval-yaml.cjs').join('lib/KHONG-CON-NHAC.cjs');
  assert.ok(!khongNhac.includes('lib/eval-yaml.cjs'), 'mutant bao đóng không gỡ được lời nhắc nào');
  const { used: u2 } = usedVsDeclared(COPIES.map(c => c.src), khongNhac);
  assert.ok(u2.has('lib/eval-yaml.cjs'),
    'mắt xích bắc cầu chết: gỡ lời nhắc ở pre-merge là eval-yaml.cjs biến khỏi tập DÙNG, dù evidence-core vẫn require nó lúc chạy');
});

// GUIDE §5.3 là bản khai THỨ HAI của cùng danh sách (người wire CI đọc nó, không
// đọc commands/). Bản đó trôi khỏi nguồn chuẩn ít nhất một lần — 2026-09-16 nó
// còn ghi 7 file trong khi cổng nạp 9, nên ai wire theo GUIDE thì tắt im lặng
// lớp «bề mặt người nhìn thấy» + đường đọc expected_exit mà CI vẫn xanh.
// Buộc cả hai bản khai vào CÙNG một writer thay vì bắt người nhớ đồng bộ.
const GUIDE_MD = readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8');

// Cắt ĐÚNG §5.3. Con số «đủ N file» nằm NGOÀI cặp marker, nên nếu quét toàn tệp
// thì một câu cùng dạng ở mục khác làm phép đo hoá vô hiệu (gap-probe 16/09 P1#1).
function mucNamBa(md) {
  const src = md ?? GUIDE_MD;
  const i = src.indexOf('### 5.3 ');
  if (i < 0) return '';
  const con = src.slice(i + 4).search(/\n#{2,4} /);
  return con < 0 ? src.slice(i) : src.slice(i, i + 4 + con);
}

function guideCopyList(md) {
  const muc = mucNamBa(md);
  const block = (muc.split('<!-- <<<GUIDE-CI-COPY-LIST -->')[1] || '').split('<!-- GUIDE-CI-COPY-LIST>>> -->')[0];
  const list = [...block.matchAll(/^- `([^`]+)`/gm)].map(m => m[1]);
  const so = [...muc.matchAll(/Copy \*\*đủ (\d+) file\*\*/g)].map(m => Number(m[1]));
  return { list, soTrongMuc: so, declaredCount: so.length === 1 ? so[0] : null };
}

// MỘT vị từ cho cả CE2g lẫn đối chứng dương của CE2gm — để «xanh» trong hai ca
// đó là cùng một chữ xanh (gap-probe 16/09 P2#5).
function viPhamGuide(md) {
  const { list, soTrongMuc, declaredCount } = guideCopyList(md);
  const loi = [];
  if (list.length < 7) loi.push(`danh sách §5.3 rút được ${list.length} mục — marker/khuôn hỏng hoặc khối nằm ngoài §5.3`);
  const { missing } = usedVsDeclared(list);
  if (missing.length) loi.push(`GUIDE §5.3 thiếu file cổng thật sự nạp: ${missing.join(', ')}`);
  const g = [...new Set(list)].sort(), i = [...new Set(COPIES.map(c => c.src))].sort();
  if (g.join('|') !== i.join('|')) loi.push(`GUIDE §5.3 và INIT-CI-COPY-LIST khai khác tập file: GUIDE=[${g}] INIT=[${i}]`);
  if (soTrongMuc.length !== 1) loi.push(`câu «đủ N file» xuất hiện ${soTrongMuc.length} lần TRONG §5.3 — con số không neo được vào danh sách`);
  else if (declaredCount !== list.length) loi.push(`§5.3 viết «đủ ${declaredCount} file» nhưng danh sách có ${list.length}`);
  return loi;
}

check('CE2g GUIDE §5.3: cùng writer, cùng tập với INIT-CI-COPY-LIST, con số «đủ N file» neo trong §5.3 và khớp độ dài', () => {
  assert.deepEqual(viPhamGuide(), []);
});

check('CE2gm sáu mutant SINH TRONG LẦN CHẠY trên chính văn bản GUIDE — ba chiều nhạy ghim đúng thông điệp, ba chiều đặc hiệu phải IM', () => {
  assert.deepEqual(viPhamGuide(), [], 'đối chứng dương: bản GUIDE thật phải xanh theo ĐÚNG chuỗi vị từ của CE2g trước khi tin mutant');
  const nhay = (ten, md, cum) => {
    assert.notEqual(md, GUIDE_MD, `mutant ${ten} không chạm được văn bản nào — khuôn GUIDE đã đổi?`);
    const loi = viPhamGuide(md);
    assert.ok(loi.some(l => l.includes(cum)), `mutant ${ten} không đỏ đúng thông điệp «${cum}» (lỗi=${JSON.stringify(loi)})`);
  };
  const im = (ten, md) => {
    assert.notEqual(md, GUIDE_MD, `mutant ${ten} không chạm được văn bản nào — khuôn GUIDE đã đổi?`);
    assert.deepEqual(viPhamGuide(md), [], `mutant ${ten} làm phép đo ĐỎ — nó đang bắt cả thứ KHÔNG phải danh sách`);
  };

  // ── chiều NHẠY ──
  nhay('(a) bỏ một dòng khỏi danh sách',
    GUIDE_MD.replace(/^- `lib\/lop-nhin-thay\.cjs`[^\n]*\n/m, ''), 'lib/lop-nhin-thay.cjs');
  nhay('(b) lệch số — đúng lỗi lịch sử 16/09',
    GUIDE_MD.replace(/Copy \*\*đủ \d+ file\*\*/, 'Copy **đủ 7 file**'), 'viết «đủ 7 file»');
  nhay('(c) đổi tên một tệp trong danh sách',
    GUIDE_MD.replace('- `lib/md-section.cjs`', '- `lib/md-section-v2.cjs`'), 'khai khác tập file');

  // ── chiều ĐẶC HIỆU ──
  im('(d) câu «đủ N file» thứ hai ở MỤC KHÁC (ngay SAU tiêu đề kế, tức ngoài §5.3)',
    GUIDE_MD.replace(/(\n### Sổ luật-đã-chạy[^\n]*\n)/, '$1\nCopy **đủ 3 file** (ví dụ ở mục khác)\n'));
  im('(e) thêm một bullet NGOÀI cặp marker',
    GUIDE_MD.replace('<!-- <<<GUIDE-CI-COPY-LIST -->', '- `khong-phai-danh-sach.txt` — bullet ngoài khối\n\n<!-- <<<GUIDE-CI-COPY-LIST -->'));
  im('(f) đảo thứ tự hai dòng trong khối',
    GUIDE_MD.replace(/(- `lib\/md-section\.cjs`[^\n]*\n)(- `lib\/eval-yaml\.cjs`[^\n]*\n)/, '$2$1'));
});

// ── 2. Dựng consumer giả-lập type:module theo đúng danh sách chép ───────────
const SIM = mkdtempSync(path.join(tmpdir(), 'agk-consumer-'));
const git = (...a) => execFileSync('git', ['-C', SIM, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8' });

writeFileSync(path.join(SIM, 'package.json'), JSON.stringify({ name: 'consumer-sim', type: 'module' }, null, 2) + '\n');
for (const c of COPIES) {
  mkdirSync(path.join(SIM, c.dstDir), { recursive: true });
  copyFileSync(path.join(ROOT, c.src), path.join(SIM, c.dstDir, path.basename(c.src)));
}
mkdirSync(path.join(SIM, 'src'), { recursive: true });
writeFileSync(path.join(SIM, 'src', 'app.js'), 'export const x = 1;\n');
git('init', '-q');
git('add', '-A'); git('commit', '-qm', 'base');
const BASE_SHA = git('rev-parse', 'HEAD').trim();

// Workspace nghiệm thu tối thiểu nhưng LÀNH — mọi field cổng đòi đều thật.
const WS = path.join(SIM, '_acceptance', 'featx');
mkdirSync(WS, { recursive: true });
writeFileSync(path.join(SIM, '_acceptance', 'config.yaml'),
  'schema_version: 1\nenforcement: strict\ngap_probe: required\nrecheck: strict\n');
writeFileSync(path.join(WS, 'contract.md'),
  '---\nslug: featx\nstatus: implemented\nrisk_tier: T3\napproved_by: Manh\napproved_at: 2026-08-08\n---\n\n## Notes\n\nfixture sinh bởi consumer-esm.test.mjs\n');
writeFileSync(path.join(WS, 'gap-probe.md'),
  '---\nslug: featx\nat: 2026-08-08T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\nKhông còn lỗ đáng kể.\n');
writeFileSync(path.join(WS, 'run-log.jsonl'), '{"run_id":"ce-sim-1","kind":"eval"}\n');
git('add', '-A'); git('commit', '-qm', 'feature featx + workspace');
const HEAD_SHA = git('rev-parse', 'HEAD').trim();
const report = [
  '---', 'slug: featx', 'verdict: PASS', 'human_signoff: Manh Phan 2026-08-08',
  `verified_commit: ${HEAD_SHA}`, 'verified_at: 2026-08-08T00:00:00Z', '---', '',
  '## Evidence', '', '- eval: E1', '  run_id: ce-sim-1', '  exit_code: 0',
  '  verifier: scripts/pre-merge-check.sh', '  verified_at: 2026-08-08T00:00:00Z', '',
].join('\n');
writeFileSync(path.join(WS, 'evidence-report.md'), report);

const RECHECK_SIM = path.join(SIM, 'scripts', 'recheck-evidence.cjs');
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: 'utf8', ...opts });

// ── 3. Chiều XANH (kèm đối chứng nó-có-chấm-thật) ───────────────────────────
check('CE3 recheck (.cjs) exit 0 trên evidence lành trong repo type:module', () => {
  const r = run('node', [RECHECK_SIM, path.join(WS, 'evidence-report.md')]);
  assert.equal(r.status, 0, `recheck exit ${r.status}; stderr: ${r.stderr.slice(0, 300)}`);
  assert.ok(!/ReferenceError|require is not defined/.test(r.stderr), `ESM-scope error còn nguyên: ${r.stderr.slice(0, 200)}`);
});

check('CE4 đối chứng chấm-thật: bản tiêm exit_code: 2 → recheck exit 1 ghim "fails the evidence bar"', () => {
  const bad = path.join(WS, 'evidence-report-bad.md');
  writeFileSync(bad, report.replace('  exit_code: 0', '  exit_code: 2'));
  const r = run('node', [RECHECK_SIM, bad]);
  assert.equal(r.status, 1, `mong exit 1, được ${r.status}; stderr: ${r.stderr.slice(0, 300)}`);
  assert.match(r.stderr, /fails the evidence bar/, `đỏ nhưng sai thông điệp: ${r.stderr.slice(0, 300)}`);
});

check('CE5 pre-merge trong consumer type:module: exit 0, rules ran=4, KHÔNG một dòng NOT ENFORCED/fallback', () => {
  const r = run('bash', [path.join(SIM, 'scripts', 'pre-merge-check.sh'), SIM, '--base', BASE_SHA]);
  const out = r.stdout + r.stderr;
  assert.equal(r.status, 0, `pre-merge exit ${r.status}:\n${out.slice(0, 1500)}`);
  assert.match(out, /OK \[featx\]: PASS/, `thiếu dòng OK per-slug:\n${out.slice(0, 800)}`);
  assert.match(out, /rules ran=4 declared-off=0/, `sổ luật không trọn:\n${out.slice(0, 800)}`);
  assert.ok(!/NOT ENFORCED/.test(out), `còn lớp tắt tiếng:\n${out}`);
  assert.ok(!/not vendored|re-check unavailable/.test(out), `lớp recheck không sống:\n${out}`);
  assert.ok(!/not lib\/ac-line\.cjs/.test(out), `ac-line rơi về awk fallback trong repo ESM:\n${out}`);
});

check('CE5b vendored gap-probe CHẤM thật ở consumer: xoá gap-probe.md → pre-merge (required) VIOLATION đúng thông điệp (gap-probe S1 P1#2)', () => {
  const gp = path.join(WS, 'gap-probe.md');
  const saved = readFileSync(gp, 'utf8');
  try {
    rmSync(gp);
    const r = run('bash', [path.join(SIM, 'scripts', 'pre-merge-check.sh'), SIM, '--base', BASE_SHA]);
    const out = r.stdout + r.stderr;
    assert.equal(r.status, 1, `mong exit 1 (luật cắn), được ${r.status}:\n${out.slice(0, 800)}`);
    assert.match(out, /VIOLATION \[featx\]: chưa qua phản biện context sạch \(gap-probe\)/, `luật gap-probe không cắn ở consumer:\n${out.slice(0, 800)}`);
    assert.ok(!/NOT ENFORCED/.test(out), `luật cắn phải là phán CÓ-CHẠY, không phải NOT-ENFORCED:\n${out}`);
  } finally {
    writeFileSync(gp, saved);
  }
});

check('CE5-map lệnh bản đồ chạy trọn trong consumer type:module từ ĐÚNG danh sách chép; gỡ trang-thai-ho-so.cjs → đỏ gọi tên', () => {
  const dv = diemVaoBanDo();
  const lenh = () => run('node', [path.join(SIM, dv), '--root', SIM]);
  const w = lenh(); assert.equal(w.status, 0, `vẽ bản đồ ở consumer thất bại (${w.status}): ${w.stderr.slice(0, 400)}`);
  const c = run('node', [path.join(SIM, dv), '--root', SIM, '--check']);
  assert.equal(c.status, 0, `--check thất bại (${c.status}): ${(c.stdout + c.stderr).slice(0, 400)}`);
  assert.ok(!/MODULE_NOT_FOUND|ReferenceError|Cannot find module/.test(c.stderr), `lỗi nạp còn nguyên: ${c.stderr.slice(0, 300)}`);
  // Mutant: bản chép thiếu đúng tệp crm từng thiếu.
  const SIM2 = mkdtempSync(path.join(tmpdir(), 'agk-consumer-thieu-'));
  execFileSync('cp', ['-R', SIM + '/.', SIM2]);
  rmSync(path.join(SIM2, 'scripts', 'trang-thai-ho-so.cjs'));
  const r = run('node', [path.join(SIM2, dv), '--root', SIM2, '--check']);
  assert.notEqual(r.status, 0, 'bản chép thiếu trang-thai-ho-so.cjs mà lệnh bản đồ vẫn xanh');
  assert.match(r.stderr, /trang-thai-ho-so\.cjs/, `đỏ nhưng không nêu tên tệp thiếu: ${r.stderr.slice(0, 300)}`);
  rmSync(SIM2, { recursive: true, force: true });
});

check('CE6-ooc không còn tham chiếu đuôi cũ .js của lib/out-of-contract trong bộ máy; bản sao khôi phục một require đuôi cũ → đỏ gọi tên', () => {
  const DIRS = ['scripts', 'lib', 'skills', 'feature-loop', 'commands', 'tests'];
  const RE = /out-of-contract\.js\b/;
  const quet = (docTep) => {
    const hit = [];
    const di = d => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') di(p); } else if (RE.test(docTep(p))) hit.push(path.relative(ROOT, p)); } };
    for (const d of DIRS) if (existsSync(path.join(ROOT, d))) di(path.join(ROOT, d));
    return hit;
  };
  const doc = p => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };
  assert.deepEqual(quet(doc), [], 'còn tham chiếu đuôi cũ .js của lib/out-of-contract');
  const GC = path.join(ROOT, 'scripts', 'gate-card.js');
  // Chuỗi tiêm GHÉP từ hai mảnh để chính tệp ca này không mang tên đuôi cũ (phép quét sẽ tự bắt nó).
  const tiem = p => p === GC ? doc(p).replace("out-of-contract.cjs')", 'out-of-contract' + ".js')") : doc(p);
  assert.notEqual(tiem(GC), doc(GC), 'mutant không tiêm được — neo require của gate-card đã đổi?');
  assert.deepEqual(quet(tiem), ['scripts/gate-card.js'], 'phép quét không gọi tên tệp mang require .js vừa tiêm');
});

// ── 4. Chiều ĐỎ: đúng layout TRƯỚC vá (.js) phải nổ ReferenceError ──────────
check('CE6 red: cùng nội dung recheck nhưng đuôi .js trong type:module → ĐỎ đúng "require is not defined"', () => {
  const oldJs = path.join(SIM, 'scripts', 'recheck-evidence.js');
  copyFileSync(RECHECK_SIM, oldJs);
  const r = run('node', [oldJs, path.join(WS, 'evidence-report.md')]);
  assert.notEqual(r.status, 0, 'layout trước vá mà vẫn xanh — mô phỏng không tái tạo được lỗi lớp này');
  assert.match(r.stderr, /ReferenceError/, `đỏ nhưng không phải ReferenceError: ${r.stderr.slice(0, 300)}`);
  assert.match(r.stderr, /require is not defined/, `sai thông điệp: ${r.stderr.slice(0, 300)}`);
});

check('CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError', () => {
  const oldJs = path.join(SIM, 'lib', 'gap-probe.js');
  copyFileSync(path.join(SIM, 'lib', 'gap-probe.cjs'), oldJs);
  const r = run('node', [oldJs, 'classify', WS]);
  assert.notEqual(r.status, 0, 'gap-probe .js vẫn chạy được — mô phỏng sai');
  assert.match(r.stderr, /require is not defined/, `sai thông điệp: ${r.stderr.slice(0, 300)}`);
  // Đối chứng dương cùng repo, cùng nội dung, đuôi .cjs:
  const g = run('node', [path.join(SIM, 'lib', 'gap-probe.cjs'), 'classify', WS]);
  assert.equal(g.status, 0, `đối chứng .cjs phải xanh: ${g.stderr.slice(0, 200)}`);
  assert.match(g.stdout, /^ok\t/, `classify phải trả ok: "${g.stdout.slice(0, 80)}"`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
