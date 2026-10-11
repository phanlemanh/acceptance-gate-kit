// luat-san-pham.ca.mjs — ca đo hồ sơ bat-bien-san-pham (LS-01..LS-11). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash) — tệp KHÔNG mang đuôi .test.mjs để không trôi
// giữa các mảnh mjs. Kho thử do code sinh trong lượt (thư mục tạm + git init); tệp luật của kho thử dựng
// TỪ khối PRODUCT-INVARIANTS-TEMPLATE rút bằng marker; giá trị mong đợi viết sẵn trong ca, KHÔNG rút từ
// đầu ra mô-đun, bộ soi hay thẻ. Đường dẫn suy từ vị trí tệp này.
// Chạy một phần: LS_CASES=LS-01,LS-05 node tests/scripts/luat-san-pham.ca.mjs
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const LSP = path.join(ROOT, 'scripts', 'luat-san-pham.cjs');
const CC = path.join(ROOT, 'scripts', 'can-cu-s1.cjs');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const KCN = path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const KHUON_TEP = path.join(ROOT, 'skills', 'acceptance', 'references', 'product-invariants-template.md');
const HFL = path.join(ROOT, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const require = createRequire(import.meta.url);
const CHON = process.env.LS_CASES ? new Set(process.env.LS_CASES.split(',').map(s => s.trim())) : null;
const want = id => !CHON || CHON.has(id);
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghiTep = (root, rel, t) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), t); };
const tam = p => mkdtempSync(path.join(tmpdir(), p));
// Nạp bản mới của một mô-đun CJS (bản sao tiêm ở thư mục tạm, hoặc bản lành) — không dùng cache.
const napMoi = f => { delete require.cache[require.resolve(f)]; return require(f); };

// ── Khuôn tệp luật: rút từ marker, điền bằng giá trị viết sẵn ───────────────────────────────────────────
const rutKhuon = t => { const m = String(t).match(/<!-- <<<PRODUCT-INVARIANTS-TEMPLATE -->\n```markdown\n([\s\S]*?)\n```\n<!-- PRODUCT-INVARIANTS-TEMPLATE>>> -->/); if (!m) die('khối PRODUCT-INVARIANTS-TEMPLATE vắng'); return m[1]; };
const KHUON = rutKhuon(readFileSync(KHUON_TEP, 'utf8'));
const dien = (khuon, o) => khuon.split('\n')
  .filter(l => !(o.dau_hieu == null && /\{dau_hieu\}/.test(l)) && !(o.pham_vi == null && /\{pham_vi\}/.test(l)) && !(o.chu == null && /\{chu\}/.test(l)))
  .join('\n').replace(/\{(\w+)\}/g, (_, k) => o[k]);
const SP1 = { so: 1, cau: 'Múi giờ của tổ chức đọc từ cấu hình, không khai hằng mới', muc: 'khó đảo', chu: 'Chủ A', giu: 'test mui-gio-mot-nguon', dau_hieu: 'Asia/Ho_Chi_Minh|\\+07:00', pham_vi: '`apps/**`', vi_sao: 'Tổ chức thứ hai ở múi giờ khác.' };
const SP2 = { so: 2, cau: 'Mỗi tổ chức có một tổ chức mẫu để thử', muc: 'thường', chu: 'Chủ B', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Người mới thử được ngay.' };
const SP3 = { so: 3, cau: "Câu có 'nháy', $tien và | ống", muc: 'thường', chu: 'Chủ C', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Ca ký tự lạ.' };
const tepLuat = (khuon, ds) => '# Luật sản phẩm — kho thử\n\nVăn tự do của kho, bộ đọc bỏ qua.\n\n' + ds.map(o => dien(khuon, o)).join('\n\n') + '\n';

// ── LS-01: khuôn + bộ đọc + băm phiên bản ───────────────────────────────────────────────────────────────
if (want('LS-01')) {
  const SAI = [
    { so: 4, cau: 'Thiếu chủ luật', muc: 'thường', chu: null, giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 5, cau: 'Mức lạ', muc: 'vừa', chu: 'Chủ D', giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 6, cau: 'Dấu hiệu hỏng', muc: 'thường', chu: 'Chủ E', giu: 'x', dau_hieu: '(', pham_vi: null, vi_sao: 'x' },
    { so: 1, cau: 'Trùng mã', muc: 'thường', chu: 'Chủ F', giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 7, cau: 'Dấu hiệu khớp rỗng', muc: 'thường', chu: 'Chủ G', giu: 'x', dau_hieu: 'a*', pham_vi: null, vi_sao: 'x' },
  ];
  // Review Focus 1: BOM + CRLF.
  const t = '﻿' + tepLuat(KHUON, [SP1, SP2, SP3, ...SAI]).replace(/\n/g, '\r\n');
  check('LS-01 doc-luat', () => {
    const m = napMoi(LSP);
    const r = m.docLuat(t);
    eq(r.luat.map(l => [l.ma, l.cau, l.muc, l.chu, l.giu, l.dau_hieu_nguon, l.pham_vi]), [
      ['SP-1', SP1.cau, 'kho-dao', 'Chủ A', 'test mui-gio-mot-nguon', 'Asia/Ho_Chi_Minh|\\+07:00', ['apps/**']],
      ['SP-2', SP2.cau, 'thuong', 'Chủ B', 'giữ bằng mắt', null, []],
      ['SP-3', "Câu có 'nháy', $tien và | ống", 'thuong', 'Chủ C', 'giữ bằng mắt', null, []],
    ], 'ba luật đọc ra');
    eq(r.sai_khuon.map(s => [s.ma, s.ly_do]), [
      ['SP-4', 'thiếu Chủ luật'], ['SP-5', 'mức lạ: vừa'], ['SP-6', 'dấu hiệu không biên dịch được'], ['SP-1', 'mã trùng'], ['SP-7', 'dấu hiệu khớp chuỗi rỗng'],
    ], 'năm khối sai khuôn');
    const gitBan = execFileSync('git', ['hash-object', '--stdin'], { input: t }).toString().trim();
    eq(m.banLuat(t), gitBan, 'banLuat khớp git hash-object');
  });
  check('LS-01-do', () => {
    // Bản sao khuôn đổi nhãn «Chủ luật» → dựng lại ba luật lành → bộ đọc phải ra 0 luật (khuôn và bộ đọc là một cặp).
    const khuonHong = KHUON.replace('Chủ luật:', 'Người giữ:');
    if (khuonHong === KHUON) die('tiêm không đổi được khuôn');
    const r = napMoi(LSP).docLuat(tepLuat(khuonHong, [SP1, SP2, SP3]));
    if (r.luat.length !== 0) die(`khuôn đổi nhãn mà vẫn đọc ra ${r.luat.length} luật`);
  });
}

// ── Kho thử có tệp luật (dùng từ LS-03 trở đi) ─────────────────────────────────────────────────────────
function mkKhoLuat({ luat = [SP1, SP2], coTep = true } = {}) {
  const r = tam('lsp-');
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't'); git(r, 'config', 'commit.gpgsign', 'false');
  ghiTep(r, 'CLAUDE.md', '# Luật kho thử\n');
  if (coTep) ghiTep(r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, luat));
  ghiTep(r, '_acceptance/config.yaml', 'risk_tiers:\n  t3_paths: []\nexecutors:\n  test:\n    x: "true"\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  return { r, base: git(r, 'rev-parse', 'HEAD') };
}
const S1 = (id, can_cu, extra = {}) => Object.assign({ id, type: 'approach', stage: 'S1', at: '2026-10-12T00:00:00Z', decision: 'Lựa chọn ' + id, why: 'vì', cost_if_wrong: 'tốn' }, can_cu === undefined ? {} : { can_cu }, extra);
const CN = (pham, kho_dao = false) => Object.assign({ nguon: 'chi-nguoi', kho_dao, khuyen: 'Khuyên giữ nguyên.', loi_khac: 'Đổi hướng — tốn một lượt sửa sau.' }, pham ? { pham_luat: pham } : {});
// Ma trận LS-05: [tên ca, can_cu, lớp, mã đỏ, thông điệp]
const MT05 = [
  ['c1-thuong', CN('SP-2'), 'cau-hoi', null, null],
  ['c2-khodao-dung', CN('SP-1', true), 'cau-hoi', null, null],
  ['c3-khodao-thieu-nhan', CN('SP-1', false), 'do', 'luat-kho-dao', 'luật khó đảo phải mang nhãn khó-đảo'],
  ['c4-muc-tieu', { nguon: 'muc-tieu', kho_dao: false, tep: 'PRODUCT-INVARIANTS.md', trich: SP2.cau, pham_luat: 'SP-2' }, 'do', 'pham-luat-may-quyet', 'phạm luật sản phẩm là câu hỏi cho người'],
  ['c5-mot-loi', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới tệp.', pham_luat: 'SP-2' }, 'do', 'pham-luat-may-quyet', 'phạm luật sản phẩm là câu hỏi cho người'],
];
const xepLop = (mod, r, slug, dongs) => mod.phanLoaiSo(dongs, { root: r, slug }).dong.map(d => [d.id, d.lop, d.ma || null, d.thong_diep || null]);
const chayMaTran = (mod, r, ds) => xepLop(mod, r, 'h', ds.map(([n, c]) => S1(n, c)));
const mongMaTran = ds => ds.map(([n, , lop, ma, td]) => [n, lop, ma, td]);
// Bản sao mô-đun để tiêm: chép can-cu-s1.cjs + luat-san-pham.cjs vào thư mục tạm, sửa đúng một chỗ.
function banSaoTiem(tep, cu, moi) {
  const d = tam('lsp-tiem-'); mkdirSync(path.join(d, 'scripts'));
  for (const f of ['can-cu-s1.cjs', 'luat-san-pham.cjs']) cpSync(path.join(ROOT, 'scripts', f), path.join(d, 'scripts', f));
  cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const p = path.join(d, 'scripts', tep); const t = readFileSync(p, 'utf8');
  if (t.split(cu).length !== 2) die(`tiêm ${tep}: chuỗi cần thay phải xuất hiện đúng một lần`);
  writeFileSync(p, t.replace(cu, moi));
  return path.join(d, 'scripts');
}

if (want('LS-05')) {
  const kho = mkKhoLuat();
  check('LS-05 ma-tran 5/5 (bo xep lop)', () => eq(chayMaTran(napMoi(CC), kho.r, MT05), mongMaTran(MT05), 'năm ca phạm luật'));
  for (const [ma, cu] of [['pham-luat-may-quyet', "if (c.nguon !== 'chi-nguoi') return { lop: 'do', ma: 'pham-luat-may-quyet', them };"],
                          ['luat-kho-dao', "if (l.muc === 'kho-dao' && c.kho_dao !== true) return { lop: 'do', ma: 'luat-kho-dao', them };"]]) {
    check(`LS-05-do ${ma}`, () => {
      const d = banSaoTiem('luat-san-pham.cjs', cu, '');
      const got = chayMaTran(napMoi(path.join(d, 'can-cu-s1.cjs')), kho.r, MT05);
      const caDo = MT05.filter(x => x[3] === ma).map(x => x[0]);
      for (const n of caDo) { const g = got.find(x => x[0] === n); if (g[1] === 'do' && g[2] === ma) die(`gỡ luật ${ma} mà ca ${n} vẫn đỏ ${ma}`); }
    });
  }
}
if (want('LS-06')) {
  const coTep = mkKhoLuat(), khongTep = mkKhoLuat({ coTep: false });
  const dong = [S1('v1', CN('SP-9')), S1('v2', CN('SP-2'))];
  const TD = 'mã luật không có trong tệp luật sản phẩm';
  check('LS-06 luat-vang 2/2', () => {
    eq(xepLop(napMoi(CC), coTep.r, 'h', dong), [['v1', 'do', 'luat-vang', TD], ['v2', 'cau-hoi', null, null]], 'kho có tệp');
    eq(xepLop(napMoi(CC), khongTep.r, 'h', dong.slice(0, 1)), [['v1', 'do', 'luat-vang', TD]], 'kho không tệp');
  });
  check('LS-06-do', () => {
    const d = banSaoTiem('luat-san-pham.cjs', "if (!l) return { lop: 'do', ma: 'luat-vang', them };", "if (!l) return null;");
    const g = xepLop(napMoi(path.join(d, 'can-cu-s1.cjs')), coTep.r, 'h', dong.slice(0, 1))[0];
    if (g[2] === 'luat-vang') die('bỏ phép tra mã mà SP-9 vẫn đỏ luat-vang');
  });
}

// ── Hồ sơ nháp + thẻ (LS-03, LS-04, LS-05 phần thẻ, LS-10) ─────────────────────────────────────────────
const HD = st => `---\nschema_version: 1\nfeature: Kho thử h\nslug: h\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${st}\ndesign_doc: docs/superpowers/specs/2026-10-12-h-design.md\n---\n\n# h\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n\n## Coverage\n\n- Trục A: a [thước CE: b] → AC-1\n\n## Out of scope\n\n- một\n- hai\n`;
const EVALS = 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: "exit 0"\n';
function mkHoSo(kho, dongs, { status = 'draft', slug = 'h', commit = true } = {}) {
  ghiTep(kho.r, `_acceptance/${slug}/contract.md`, HD(status));
  ghiTep(kho.r, `_acceptance/${slug}/evals.yaml`, EVALS);
  ghiTep(kho.r, `_acceptance/${slug}/decisions.jsonl`, dongs.map(x => JSON.stringify(x)).join('\n') + '\n');
  if (commit) { git(kho.r, 'add', '-A'); git(kho.r, 'commit', '-qm', 'ho-so ' + slug); }
  return kho;
}
const the = (kho, them = [], slug = 'h') => { const p = spawnSync(process.execPath, [GC, '--root', kho.r, '--slug', slug, ...them], { encoding: 'utf8' }); if (p.status !== 0) die(`thẻ thoát ${p.status}: ${p.stderr}`); return p.stdout; };
const rut = (kho, them = [], slug = 'h') => JSON.parse(the(kho, ['--extract', ...them], slug));
const khoiLab = (html, lab) => { const i = html.indexOf(`<div class="lab">${lab}</div>`); if (i < 0) return null; const j = html.indexOf('<div class="lab">', i + 10); return html.slice(i, j < 0 ? undefined : j); };
const CO_THIEU_NAP = 'Kho đã khai luật sản phẩm mà sổ bước thiết kế chưa có dòng nạp — lựa chọn của vòng chưa được soi theo luật.';
const CO_DOI = 'Luật sản phẩm đã đổi sau khi bước thiết kế nạp';
const recipeOf = t => { const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/); if (!m) die('thiếu khối DEC-ID-RECIPE'); return m[1]; };
const khuonNap = t => { const m = t.match(/<!-- <<<DEC-LUAT-NAP -->\n([^\n]+)\n<!-- DEC-LUAT-NAP>>> -->/); if (!m) die('thiếu khối DEC-LUAT-NAP (một dòng)'); return m[1]; };
// Ghi dòng nạp vào sổ hồ sơ h bằng CHÍNH khối lệnh DEC-ID-RECIPE (thay dòng giữa bằng khuôn), dưới shell sh.
function ghiNap(skillText, kho, sh, ban, n) {
  const recipe = recipeOf(skillText);
  const giua = recipe.split('\n').find(l => l.includes('"type":"<type>"')); if (!giua) die('khối DEC-ID-RECIPE không có dòng giữa');
  const lenh = recipe.split(giua).join(khuonNap(skillText)).split('<slug>').join('h').split('<ISO>').join('2026-10-12T00:00:00Z').split('<ban>').join(ban).split('<N>').join(String(n));
  mkdirSync(path.join(kho.r, '_acceptance', 'h'), { recursive: true });
  const p = spawnSync(sh, ['-c', lenh], { cwd: kho.r, encoding: 'utf8' }); if (p.status !== 0) die(`khối lệnh không chạy dưới ${sh}: ${p.stderr}`);
}
const banTep = kho => napMoi(LSP).banLuat(readFileSync(path.join(kho.r, 'PRODUCT-INVARIANTS.md'), 'utf8'));
const coLuat = h => (h.match(/<div class="flag [^"]+">[^<]*(?:luật sản phẩm|Luật sản phẩm)[^<]*<\/div>/g) || []);

if (want('LS-03')) {
  const SK = readFileSync(SKILL, 'utf8');
  for (const sh of ['bash', 'zsh']) {
    check(`LS-03 ${sh}`, () => {
      if (spawnSync(sh, ['-c', 'true']).status !== 0) die(sh + ' vắng trên máy — ca KHÔNG bỏ qua');
      const kn = khuonNap(SK); if (!/"can_cu":/.test(kn) || !/"luat_nap":/.test(kn)) die('khuôn DEC-LUAT-NAP thiếu can_cu hoặc luat_nap');
      // Ca khớp: dòng nạp đúng bản.
      const khop = mkKhoLuat(); mkHoSo(khop, [], { commit: false }); writeFileSync(path.join(khop.r, '_acceptance/h/decisions.jsonl'), '');
      ghiNap(SK, khop, sh, banTep(khop), 2); git(khop.r, 'add', '-A'); git(khop.r, 'commit', '-qm', 'nap');
      const so = napMoi(CC).docSo(readFileSync(path.join(khop.r, '_acceptance/h/decisions.jsonl'), 'utf8'));
      eq(so.broken, 0, 'dòng nạp là JSON');
      eq(so.entries[0].luat_nap, { ban: banTep(khop), so: 2 }, 'luat_nap đọc lại');
      eq(napMoi(CC).phanLoaiSo(so.entries, { root: khop.r, slug: 'h' }).dong.map(d => d.lop), ['da-quyet'], 'dòng nạp là lựa chọn máy đã quyết');
      eq(coLuat(the(khop, ['--glossary-base', khop.base])), [], 'ca khớp: không cờ luật');
      eq(rut(khop, ['--glossary-base', khop.base]).luat, { co_tep: true, so_luat: 2, sai_khuon: [], nap: { ban: banTep(khop), khop: true } }, 'khoá luat ca khớp');
      // Ca đổi: sửa tệp luật sau khi nạp.
      const banCu = banTep(khop);
      ghiTep(khop.r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2, SP3])); git(khop.r, 'commit', '-qam', 'doi-luat');
      const coDoi = coLuat(the(khop, ['--glossary-base', khop.base]));
      eq(coDoi.length, 1, 'ca đổi: đúng một cờ luật');
      if (!coDoi[0].includes(CO_DOI) || !coDoi[0].includes(banCu.slice(0, 7)) || !coDoi[0].includes(banTep(khop).slice(0, 7))) die('cờ đổi thiếu chữ hoặc bảy ký tự hai bản: ' + coDoi[0]);
    });
  }
  check('LS-03 thieu', () => {
    const k = mkKhoLuat(); mkHoSo(k, [S1('a', CN(null))]);
    const co = coLuat(the(k, ['--glossary-base', k.base]));
    eq(co.length, 1, 'ca thiếu: đúng một cờ'); if (!co[0].includes(CO_THIEU_NAP)) die('cờ thiếu sai chữ: ' + co[0]);
  });
  check('LS-03-do', () => {
    const tiem = SK.replace(/(<!-- <<<DEC-LUAT-NAP -->\n[^\n]*)"luat_nap":/, '$1"luatnap":'); if (tiem === SK) die('mũi tiêm khuôn nạp không áp');
    const k = mkKhoLuat(); mkHoSo(k, [], { commit: false }); writeFileSync(path.join(k.r, '_acceptance/h/decisions.jsonl'), '');
    ghiNap(tiem, k, 'bash', banTep(k), 2); git(k.r, 'add', '-A'); git(k.r, 'commit', '-qm', 'nap');
    const co = coLuat(the(k, ['--glossary-base', k.base]));
    if (!co.some(c => c.includes(CO_THIEU_NAP))) die('DEC-LUAT-NAP đổi tên khoá mà ca khớp không ra cờ thiếu');
  });
}

if (want('LS-04')) {
  check('LS-04 theo-luat', () => {
    const k = mkKhoLuat({ luat: [SP1, SP2] });
    mkHoSo(k, [S1('t1', { nguon: 'muc-tieu', kho_dao: false, tep: 'PRODUCT-INVARIANTS.md', trich: SP2.cau }),
               S1('t2', { nguon: 'muc-tieu', kho_dao: false, tep: 'PRODUCT-INVARIANTS.md', trich: 'Văn tự do của kho, bộ đọc bỏ qua.' })]);
    const h = khoiLab(the(k, ['--glossary-base', k.base]), 'Máy đã quyết ở bước thiết kế — anh lật được'); if (!h) die('thiếu khối máy đã quyết');
    const dong = id => (h.match(new RegExp(`<p class="li" data-may-quyet="${id}">[\\s\\S]*?</p>`)) || [''])[0];
    if (!dong('t1').includes('theo luật SP-2')) die('dòng trích câu SP-2 thiếu «theo luật SP-2»');
    if (dong('t2').includes('theo luật')) die('dòng trích câu ngoài khối luật lại mang mã luật');
    // Câu luật chỉ thêm trong nhánh → đỏ sinh-trong-vong như A2.
    const k2 = mkKhoLuat({ luat: [SP1] });
    ghiTep(k2.r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2]));
    mkHoSo(k2, [S1('t1', { nguon: 'muc-tieu', kho_dao: false, tep: 'PRODUCT-INVARIANTS.md', trich: SP2.cau })]);
    const d = napMoi(CC).phanLoaiSo(napMoi(CC).docSo(readFileSync(path.join(k2.r, '_acceptance/h/decisions.jsonl'), 'utf8')).entries, { root: k2.r, slug: 'h', base: k2.base }).dong[0];
    eq([d.lop, d.ma], ['do', 'sinh-trong-vong'], 'câu luật sinh trong vòng');
  });
  check('LS-04-do', () => {
    // Bản sao maTheoTrich gắn mã luật đầu tiên cho mọi câu trích → dòng ngoài khối mang «theo luật».
    const d = banSaoTiem('luat-san-pham.cjs', 'return l ? l.ma : null;', 'return (luat && luat[0]) ? luat[0].ma : null;');
    const gcCopy = path.join(d, 'gate-card.js'); cpSync(GC, gcCopy);
    for (const f of readdirSync(path.join(ROOT, 'scripts'))) if (!existsSync(path.join(d, f))) cpSync(path.join(ROOT, 'scripts', f), path.join(d, f), { recursive: true });
    const k = mkKhoLuat({ luat: [SP1, SP2] });
    mkHoSo(k, [S1('t2', { nguon: 'muc-tieu', kho_dao: false, tep: 'PRODUCT-INVARIANTS.md', trich: 'Văn tự do của kho, bộ đọc bỏ qua.' })]);
    const p = spawnSync(process.execPath, [gcCopy, '--root', k.r, '--slug', 'h', '--glossary-base', k.base], { encoding: 'utf8' });
    if (!/data-may-quyet="t2">[^<]*(<[^/][^>]*>[^<]*<\/[^>]+>)*[^<]*theo luật/.test(p.stdout) && !(khoiLab(p.stdout, 'Máy đã quyết ở bước thiết kế — anh lật được') || '').includes('theo luật')) die('bản sao gắn mã bừa mà dòng ngoài khối không mang «theo luật» — phép đo không phân biệt');
  });
}

if (want('LS-05')) {
  check('LS-05 the', () => {
    const k = mkKhoLuat();
    mkHoSo(k, [S1('c1', CN('SP-2')), S1('c2', CN('SP-1', true)), S1('c6', CN(null))]);
    const h = the(k, ['--glossary-base', k.base]);
    const hoi = khoiLab(h, 'Câu chỉ anh trả lời được'); if (!hoi) die('thiếu khối câu hỏi');
    const cau = n => (hoi.match(new RegExp(`<p class="li" data-cau-hoi="${n}">([\\s\\S]*?)</p>`)) || [, ''])[1];
    if (!cau('Hỏi-1').includes(`Phạm luật SP-2 — ${SP2.cau} (chủ luật: ${SP2.chu})`)) die('Hỏi-1 thiếu tiền tố phạm luật: ' + cau('Hỏi-1'));
    if (!cau('Hỏi-2').includes(`Phạm luật SP-1 — ${SP1.cau} (chủ luật: ${SP1.chu})`) || !cau('Hỏi-2').includes('khó-đảo')) die('Hỏi-2 thiếu tiền tố hoặc nhãn khó-đảo: ' + cau('Hỏi-2'));
    if (cau('Hỏi-1').includes('khó-đảo')) die('Hỏi-1 (luật thường) mang nhãn khó-đảo');
    if (cau('Hỏi-3').includes('Phạm luật') || /SP-\d/.test(cau('Hỏi-3'))) die('câu chỉ-người không phạm luật lại mang chữ phạm luật: ' + cau('Hỏi-3'));
    const k2 = mkKhoLuat(); mkHoSo(k2, [S1('c3', CN('SP-1', false))]);
    const r = rut(k2, ['--glossary-base', k2.base]);
    if (!/___$/.test(r.one_shot)) die('có dòng đỏ mà dòng lệnh duyệt vẫn điền sẵn: ' + r.one_shot);
  });
}

console.log(`luat-san-pham.ca: ${passed} đạt, ${failed} trượt`);
process.exit(failed ? 1 : 0);
