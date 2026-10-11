// luat-san-pham.ca.mjs — ca đo hồ sơ bat-bien-san-pham (LS-01..LS-11). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash) — tệp KHÔNG mang đuôi .test.mjs để không trôi
// giữa các mảnh mjs. Kho thử do code sinh trong lượt (thư mục tạm + git init); tệp luật của kho thử dựng
// TỪ khối PRODUCT-INVARIANTS-TEMPLATE rút bằng marker; giá trị mong đợi viết sẵn trong ca, KHÔNG rút từ
// đầu ra mô-đun, bộ soi hay thẻ. Đường dẫn suy từ vị trí tệp này.
// Chạy một phần: LS_CASES=LS-01,LS-05 node tests/scripts/luat-san-pham.ca.mjs
import { spawn, spawnSync, execFileSync } from 'node:child_process';
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

// ── Hồ sơ đã chấm xanh-sạch + nhánh vòng (LS-07, LS-08, LS-10) ─────────────────────────────────────────
// Khuôn mục ngoài hợp đồng rút từ bên VIẾT (acceptance-verify.js) — cùng cách tests/scripts/out-of-contract.test.mjs.
const OOC_TPL = (() => { const wf = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/); if (!m) die('không rút được OOC-ITEM-TEMPLATE'); return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`'); })();
const oocMuc = (title, plain) => OOC_TPL.replace('{title}', title).replace('{plain}', plain).replace('{file}', 'apps/a.ts').replace('{severity}', 'medium').replace('{proposal}', 'known-limits');
const oocTep = items => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.\n\n${items.join('\n')}\n\n## Known limits\n`;
const HD_XM = `---\nschema_version: 1\nfeature: Kho thử h\nslug: h\nowner: t@t\nrisk_tier: T2\nsurfaces: [cli]\nstatus: verified\napproved_by: Chủ Kho\napproved_at: 2026-10-12\n---\n\n# h\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n\n## Out of scope\n\n- một\n- hai\n`;
const BC = vc => `---\nschema_version: 1\nfeature_slug: h\nverdict: PASS\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff:\n---\n\n# Evidence Report: h\n\n## Evidence\n- eval: E1\n  run_id: h-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-10-12\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;
const MAY = '\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>';
// buoc(r) sửa cây của nhánh vòng; trả { r, base, den } với hồ sơ h đã chấm ở den.
function mkVong(buoc, { luat = [SP1, SP2], findings = null, ghiCham = true } = {}) {
  const k = mkKhoLuat({ luat });
  ghiTep(k.r, 'verify.sh', '#!/bin/sh\nexit 0\n'); ghiTep(k.r, 'apps/cu.ts', 'export const a = 1;\n'); git(k.r, 'add', '-A'); git(k.r, 'commit', '-qm', 'goc2');
  const base = git(k.r, 'rev-parse', 'HEAD');
  git(k.r, 'checkout', '-qb', 'vong');
  buoc(k.r);
  const den = git(k.r, 'rev-parse', 'HEAD');
  ghiTep(k.r, '_acceptance/h/contract.md', HD_XM); ghiTep(k.r, '_acceptance/h/evals.yaml', EVALS);
  ghiTep(k.r, '_acceptance/h/evidence-report.md', BC(den));
  ghiTep(k.r, '_acceptance/h/decisions.jsonl', '');
  if (findings) ghiTep(k.r, '_acceptance/h/review-findings.md', oocTep(findings));
  git(k.r, 'add', '-A'); git(k.r, 'commit', '-qm', 'bang-chung');
  if (ghiCham) { const p = spawnSync(process.execPath, [LSP, '--root', k.r, '--slug', 'h', '--quet', '--base', base, '--den', den, '--write'], { encoding: 'utf8' }); if (p.status !== 0) die(`bộ soi thoát ${p.status}: ${p.stderr}`); }
  return { r: k.r, base, den };
}
const commit = (r, msg) => { git(r, 'add', '-A'); git(r, 'commit', '-qm', msg); return git(r, 'rev-parse', 'HEAD'); };
const docCham = v => JSON.parse(readFileSync(path.join(v.r, '_acceptance/h/luat-cham.json'), 'utf8'));
const kcn = v => spawnSync(process.execPath, [KCN, '--check', '--root', v.r, '--slug', 'h'], { encoding: 'utf8' });
const CO_SUA = 'Vòng này sửa tệp luật sản phẩm — máy không sửa luật; tách thành commit riêng của chủ kho';
const CO_CHUA_SOI = 'Chưa soi luật sản phẩm trên bản đã chấm';
const LAN_V = 'đi tiếp hay kéo lại';

if (want('LS-07')) {
  let shaMay, shaNguoi;
  const vMay = mkVong(r => { ghiTep(r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2, SP3])); shaMay = commit(r, 'sua luat' + MAY); });
  const vNguoi = mkVong(r => { ghiTep(r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2, SP3])); shaNguoi = commit(r, 'chu kho sua luat'); });
  const vSach = mkVong(r => { ghiTep(r, 'apps/cu.ts', 'export const a = 2;\n'); commit(r, 'vat'); });
  check('LS-07 may', () => {
    eq(docCham(vMay).sua_tep_luat, { may: [shaMay], nguoi: [] }, 'sha máy');
    const h = the(vMay); if (!h.includes(CO_SUA)) die('thiếu cờ đỏ sửa tệp luật');
    const r = rut(vMay); if (!r.one_shot || !r.one_shot.includes('Tệp luật: ___')) die('dòng lệnh thiếu ô Tệp luật: ' + r.one_shot);
    if (r.one_shot.includes(LAN_V)) die('vẫn đi làn V');
    const k = kcn(vMay); eq(k.status, 2, 'khong-can-nguoi thoát'); if (!(k.stderr + k.stdout).includes('luật sản phẩm')) die('khong-can-nguoi không nêu luật sản phẩm: ' + k.stderr);
  });
  check('LS-07 nguoi', () => {
    eq(docCham(vNguoi).sua_tep_luat, { may: [], nguoi: [shaNguoi] }, 'sha người');
    const h = the(vNguoi); if (h.includes(CO_SUA)) die('commit chủ kho mà vẫn cờ đỏ');
    if (!h.includes('Chủ kho sửa tệp luật trong nhánh vòng (1 commit)')) die('thiếu dòng báo chủ kho sửa');
  });
  check('LS-07 sach', () => {
    eq(docCham(vSach).sua_tep_luat, { may: [], nguoi: [] }, 'không ai sửa');
    if (the(vSach).includes(CO_SUA)) die('không chạm tệp luật mà có cờ');
    const k = kcn(vSach); eq(k.status, 0, 'khong-can-nguoi thoát (đối chứng dương): ' + k.stderr);
  });
  check('LS-07 xoa-tep', () => {   // Review Focus 5: xoá tệp luật bằng commit máy = máy sửa tệp luật
    let sha; const v = mkVong(r => { rmSync(path.join(r, 'PRODUCT-INVARIANTS.md')); sha = commit(r, 'xoa luat' + MAY); });
    eq(docCham(v).sua_tep_luat, { may: [sha], nguoi: [] }, 'xoá tệp là sửa tệp');
  });
  check('LS-07-do', () => {
    const d = banSaoTiem('luat-san-pham.cjs', '(DONG_MAY.test(', '(true || DONG_MAY.test(');
    const p = spawnSync(process.execPath, [path.join(d, 'luat-san-pham.cjs'), '--root', vNguoi.r, '--slug', 'h', '--quet', '--base', vNguoi.base, '--den', vNguoi.den], { encoding: 'utf8' });
    const o = JSON.parse(p.stdout); if (!o.sua_tep_luat.may.length) die('bỏ tách máy/người mà commit chủ kho vẫn không thành máy — phép đo không phân biệt');
  });
}

if (want('LS-08')) {
  const DONG_A = 3;
  const okr = r => {
    ghiTep(r, 'apps/app/lib/a.ts', 'export const OKR = {\n  ten: "chu ky",\n  muiGio: "Asia/Ho_Chi_Minh",\n};\n');
    ghiTep(r, 'tests/a.spec.ts', 'const tz = "Asia/Ho_Chi_Minh";\n');
    ghiTep(r, '_acceptance/x/notes.md', 'Asia/Ho_Chi_Minh\n');
    writeFileSync(path.join(r, 'apps', 'logo.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0x2b, 0x30, 0x37, 0x3a, 0x30, 0x30]));
    git(r, 'mv', 'apps/cu.ts', 'apps/moi.ts'); writeFileSync(path.join(r, 'apps', 'moi.ts'), 'const lech = "+07:00";\nexport const a = 1;\n');
    commit(r, 'vat okr');
  };
  const v = mkVong(okr);
  check('LS-08 okr-soat', () => {
    const c = docCham(v);
    eq(c.cham.map(x => [x.ma, x.tep, x.dong]), [['SP-1', 'apps/app/lib/a.ts', DONG_A], ['SP-1', 'apps/moi.ts', 1]], 'chỗ chạm');
    eq(c.den, v.den, 'den = verified_commit');
    const h = the(v); const k = khoiLab(h, 'Luật sản phẩm bị chạm'); if (!k) die('thiếu khối «Luật sản phẩm bị chạm»');
    for (const t of ['SP-1', SP1.cau, SP1.chu, 'khó-đảo', `apps/app/lib/a.ts:${DONG_A}`]) if (!k.includes(t)) die('khối luật thiếu: ' + t);
    const r = rut(v); if (!r.one_shot.includes('SP-1: sửa vật')) die('dòng lệnh thiếu «SP-1: sửa vật»: ' + r.one_shot);
    if (!r.routing.hoi.includes('SP-1')) die('routing.hoi thiếu SP-1'); if (r.one_shot.includes(LAN_V)) die('vẫn đi làn V');
    const kk = kcn(v); eq(kk.status, 2, 'khong-can-nguoi thoát'); if (!(kk.stderr + kk.stdout).includes('luật sản phẩm')) die('không nêu luật sản phẩm');
  });
  check('LS-08 cu', () => {
    const vVang = mkVong(r => { ghiTep(r, 'apps/cu.ts', 'export const a = 3;\n'); commit(r, 'vat'); }, { ghiCham: false });
    const h1 = the(vVang); if ((h1.split(CO_CHUA_SOI).length - 1) !== 1) die('vắng luat-cham: phải đúng một cờ chưa soi');
    if (rut(vVang).one_shot.includes(LAN_V)) die('vắng luat-cham mà vẫn đi làn V');
    const vLech = mkVong(r => { ghiTep(r, 'apps/cu.ts', 'export const a = 4;\n'); commit(r, 'vat'); });
    const c = docCham(vLech); c.den = vLech.base; writeFileSync(path.join(vLech.r, '_acceptance/h/luat-cham.json'), JSON.stringify(c));
    const h2 = the(vLech); if ((h2.split(CO_CHUA_SOI).length - 1) !== 1) die('lệch bản: phải đúng một cờ chưa soi');
    if (rut(vLech).one_shot.includes(LAN_V)) die('lệch bản mà vẫn đi làn V');
    // Review Focus 4: hồ sơ đã ký không có luat-cham → không cờ.
    const vKy = mkVong(r => { ghiTep(r, 'apps/cu.ts', 'export const a = 5;\n'); commit(r, 'vat'); }, { ghiCham: false });
    writeFileSync(path.join(vKy.r, '_acceptance/h/contract.md'), HD_XM.replace('status: verified', 'status: signed-off'));
    if (the(vKy).includes(CO_CHUA_SOI)) die('hồ sơ đã ký mà vẫn cờ chưa soi');
  });
  check('LS-08 nhan-ngoai', () => {
    const vn = mkVong(r => { ghiTep(r, 'apps/cu.ts', 'export const a = 6;\n'); commit(r, 'vat'); },
      { findings: [oocMuc('Hằng múi giờ khai lại', 'Phạm luật SP-1: múi giờ ghi cứng lần nữa.'), oocMuc('Mã luật không có', 'Nhắc SP-9 không có trong tệp.')] });
    const h = the(vn);
    const dong = t => { const i = h.indexOf(t); if (i < 0) die('thẻ không in mục: ' + t); return h.slice(i, h.indexOf('</p>', i)); };
    if (!dong('múi giờ ghi cứng lần nữa').includes('luật SP-1 · khó đảo')) die('mục nhắc SP-1 thiếu nhãn luật');
    if (/luật SP-\d/.test(dong('Nhắc SP-9'))) die('mục nhắc SP-9 (không có trong tệp) lại mang nhãn');
  });
  check('LS-08-do pham-vi', () => {
    const d = banSaoTiem('luat-san-pham.cjs', '(!r.pham_vi.length || r.pham_vi.some(g => khopGlob(g, tep)))', 'true');
    const p = spawnSync(process.execPath, [path.join(d, 'luat-san-pham.cjs'), '--root', v.r, '--slug', 'h', '--quet', '--base', v.base, '--den', v.den], { encoding: 'utf8' });
    if (!JSON.parse(p.stdout).cham.some(x => x.tep === 'tests/a.spec.ts')) die('bỏ lọc phạm vi mà tests/a.spec.ts vẫn không chạm');
  });
  check('LS-08-do khong-luat', () => {
    const vk = mkVong(okr, { luat: [SP2] });
    if (khoiLab(the(vk), 'Luật sản phẩm bị chạm')) die('tệp không có SP-1 mà vẫn có khối luật bị chạm');
    if (!khoiLab(the(v), 'Luật sản phẩm bị chạm')) die('đối chứng: bản lành phải có khối');
  });
}

// ── LS-10: mọi câu luật trong khối việc-của-anh + dòng lệnh duy nhất; nhãn ô có trong GATE-ONESHOT-SLOTS ──
const slotList = t => { const m = String(t).match(/<!-- <<<GATE-ONESHOT-SLOTS -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-SLOTS>>> -->/); if (!m) die('thiếu khối GATE-ONESHOT-SLOTS'); return m[1].split('\n').filter(Boolean); };
const slotRe = l => new RegExp('^' + l.replace(/^(g1|g2|extra)\s+/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<số>/g, '\\d+').replace(/<mã eval>/g, 'E\\d+') + '$');
const nhanLa = (slots, nhan) => nhan.filter(n => !slots.some(l => slotRe(l).test(n)));
const nhanG2 = oneShot => oneShot.replace(/^\S+\s+\S+\s+/, '').split(';').map(x => x.split(':')[0].trim()).filter(Boolean);
const LENH_RE = /\/acceptance-gate:(approve|signoff)\b/g;
if (want('LS-10')) {
  const ho = [];
  { const k = mkKhoLuat(); mkHoSo(k, [S1('c1', CN('SP-2')), S1('c2', CN('SP-1', true))]); ho.push(['g1', k]); }
  { ho.push(['g2', mkVong(r => { ghiTep(r, 'apps/app/lib/a.ts', 'const m = "Asia/Ho_Chi_Minh";\n'); commit(r, 'vat'); })]); }
  { ho.push(['g2', mkVong(r => { ghiTep(r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2, SP3])); commit(r, 'sua luat' + MAY); })]); }
  const SL = slotList(readFileSync(HFL, 'utf8'));
  check('LS-10 mot-dong', () => {
    for (const [g, k] of ho) {
      const h = the(k, g === 'g1' ? ['--glossary-base', k.base] : []);
      eq((h.match(/<div class="lab">👉 VIỆC CỦA ANH<\/div>/g) || []).length, 1, `${g}: số khối VIỆC CỦA ANH`);
      eq((h.match(LENH_RE) || []).length, 1, `${g}: số dòng lệnh`);
      const viec = khoiLab(h, '👉 VIỆC CỦA ANH');
      if (g === 'g1') { for (const n of ['Hỏi-1', 'Hỏi-2']) if (!viec.includes(n)) die('g1: câu luật không nằm trong khối việc-của-anh: ' + n); }
      else {
        const r = rut(k); const nh = nhanG2(r.one_shot);
        for (const n of nh.filter(x => /^SP-\d+$|^Tệp luật$/.test(x))) if (!viec.includes(n)) die(`g2: ô ${n} không có trong khối việc-của-anh`);
        if (!nh.some(x => /^SP-\d+$|^Tệp luật$/.test(x))) die('g2: hồ sơ thử không có ô luật nào — ca không đo gì');
        eq(nhanLa(SL, nh), [], 'g2: nhãn ô không có trong GATE-ONESHOT-SLOTS');
      }
    }
  });
  check('LS-10-do', () => {
    const SLhong = SL.filter(l => l !== 'g2 SP-<số>');
    if (SLhong.length === SL.length) die('danh sách nhãn không có dòng g2 SP-<số> để gỡ');
    const la = nhanLa(SLhong, nhanG2(rut(ho[1][1]).one_shot));
    if (!la.includes('SP-1')) die('gỡ nhãn SP-<số> mà SP-1 vẫn được nhận — phép đo không phân biệt');
  });
  if (process.env.LS_GHI_ANH === '1') {
    const out = path.join(ROOT, '_acceptance', 'bat-bien-san-pham', 'evidence'); mkdirSync(out, { recursive: true });
    writeFileSync(path.join(out, 'card-g1-luat.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">' + the(ho[0][1], ['--glossary-base', ho[0][1].base]));
    writeFileSync(path.join(out, 'card-g2-luat.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">' + the(ho[1][1]));
    console.log('  (đã ghi hai thẻ cho E11 vào ' + out + ')');
  }
}

// ── LS-11: lệnh đếm cho Cổng Giá trị ────────────────────────────────────────────────────────────────────
if (want('LS-11')) {
  const NGAY = '2026-10-20';
  const k = (() => {
    const r = tam('lsp-dem-'); git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't'); git(r, 'config', 'commit.gpgsign', 'false');
    ghiTep(r, 'CLAUDE.md', '# x\n'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
    ghiTep(r, 'PRODUCT-INVARIANTS.md', tepLuat(KHUON, [SP1, SP2])); git(r, 'add', '-A');
    execFileSync('git', ['commit', '-qm', 'khai luat'], { cwd: r, env: { ...process.env, GIT_COMMITTER_DATE: `${NGAY}T03:00:00Z`, GIT_AUTHOR_DATE: `${NGAY}T03:00:00Z` } });
    return r;
  })();
  const at = d => `${d}T05:00:00Z`;
  const so = (slug, dongs) => ghiTep(k, `_acceptance/${slug}/decisions.jsonl`, dongs.map(x => JSON.stringify(x)).join('\n') + '\n');
  const nap = d => S1('nap', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'x' }, { at: at(d), luat_nap: { ban: 'b', so: 2 } });
  so('a-truoc', [S1('x', undefined, { at: at('2026-10-10') }), S1('p', CN('SP-2'), { at: at('2026-10-10') })]);
  so('b-co-nap', [nap('2026-10-21')]);
  so('c-thieu-nap', [S1('x', undefined, { at: at('2026-10-21') })]);
  so('d-pham', [nap('2026-10-22'), S1('p1', CN('SP-2'), { at: at('2026-10-22') }), S1('p2', CN('SP-1', true), { at: at('2026-10-22') }), S1('p3', CN('SP-2'), { at: at('2026-10-22'), supersedes: 'p2' })]);
  so('e-cham', [nap('2026-10-23')]);
  ghiTep(k, '_acceptance/e-cham/luat-cham.json', JSON.stringify({ ban: 'b', base: 'x', den: 'y', sua_tep_luat: { may: [], nguoi: [] }, cham: [{ ma: 'SP-1', tep: 'a', dong: 1 }, { ma: 'SP-1', tep: 'b', dong: 2 }] }));
  ghiTep(k, '_acceptance/e-cham/review-findings.md', oocTep([oocMuc('Hằng giờ', 'Nhắc SP-1 lần nữa.'), oocMuc('Khác', 'Không nhắc luật.')]));
  so('f-sua', [nap('2026-10-24')]);
  ghiTep(k, '_acceptance/f-sua/luat-cham.json', JSON.stringify({ ban: 'b', base: 'x', den: 'y', sua_tep_luat: { may: ['m1'], nguoi: ['n1'] }, cham: [] }));
  const COT = ['slug', 'dong_nap', 'pham_thiet_ke', 'cham_diff', 'nhan_ngoai', 'may_sua', 'nguoi_sua'];
  const BANG = [
    ['b-co-nap', 1, 0, 0, 0, 0, 0], ['c-thieu-nap', 0, 0, 0, 0, 0, 0], ['d-pham', 1, 2, 0, 0, 0, 0],
    ['e-cham', 1, 0, 2, 1, 0, 0], ['f-sua', 1, 0, 0, 0, 1, 1],
  ];
  const chay = (bin, them) => { const p = spawnSync(process.execPath, [bin, '--root', k, '--dem', ...them], { encoding: 'utf8' }); if (p.status !== 0) die(`--dem thoát ${p.status}: ${p.stderr}`); return p.stdout; };
  const hang = o => o.hang.map(h => COT.map(c => h[c]));
  check('LS-11 dem', () => {
    const j = JSON.parse(chay(LSP, ['--tu', NGAY, '--json']));
    eq(j.ngay_khai, NGAY, 'ngày khai'); eq(hang(j), BANG, 'bảng sau ngày khai');
    const chu = chay(LSP, ['--tu', NGAY]).split('\n').filter(l => /^[a-z]-/.test(l));
    eq(chu.length, 5, 'dạng chữ năm hàng');
    eq(JSON.parse(chay(LSP, ['--json'])).hang.length, 6, 'không --tu: sáu hàng');
  });
  check('LS-11-do', () => {
    const d = banSaoTiem('luat-san-pham.cjs', '!biThay.has(e.id)', 'true');
    const j = JSON.parse(chay(path.join(d, 'luat-san-pham.cjs'), ['--tu', NGAY, '--json']));
    const lech = hang(j).find(h => h[0] === 'd-pham'); if (!lech || lech[2] === 2) die('đếm cả dòng bị thay mà cột phạm ở thiết kế vẫn 2 — phép đo không phân biệt');
  });
}

// ── LS-02: kho không khai luật → thẻ (HTML + bản rút) và khong-can-nguoi giống từng byte bản ở gốc vòng ──
// Gốc vòng đọc từ Notes của hợp đồng; hồ sơ của vòng đã ký → ca không so (vòng sau đổi thẻ hợp lệ). Kho crm
// theo LS_CRM_ROOT (vắng → «crm=vang» có tên). Kho có tệp luật → bỏ kho đó (vi phân chỉ định nghĩa cho kho không tệp).
const HD_VONG = path.join(ROOT, '_acceptance', 'bat-bien-san-pham', 'contract.md');
function dungGoc(gocSha) {
  const d = tam('lsp-goc-');
  execFileSync('bash', ['-c', 'git -C "$1" archive "$2" scripts lib skills | tar -x -C "$3"', 'x', ROOT, gocSha, d]);   // trọn thư mục, không danh sách tay
  return d;
}
// Chạy song song (bể 8 tiến trình): mỗi lần dựng thẻ quét cả xưởng, tuần tự thì ca mất ~4 phút.
const chayAsync = (bin, a) => new Promise(res => { const p = spawn(process.execPath, [bin, ...a]); let o = ''; p.stdout.on('data', d => { o += d; }); p.stderr.on('data', () => {}); p.on('close', c => res(`${c}\n${o}`)); });
async function be(viec, n = 8) { const kq = new Array(viec.length); let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < viec.length) { const k = i++; kq[k] = await viec[k](); } })); return kq; }
async function soKho(kho, gcGoc, kcnGoc, gcMoi, kcnMoi) {
  const ds = readdirSync(path.join(kho, '_acceptance')).filter(n => existsSync(path.join(kho, '_acceptance', n, 'contract.md'))).sort();
  const lech = await be(ds.map(slug => async () => {
    const a = ['--root', kho, '--slug', slug];
    const [hg, hm, rg, rm] = await Promise.all([chayAsync(gcGoc, a), chayAsync(gcMoi, a), chayAsync(gcGoc, [...a, '--extract']), chayAsync(gcMoi, [...a, '--extract'])]);
    if (hg !== hm) return `${slug} (thẻ)`;
    if (rg !== rm) {
      const tach = t => { const i = t.indexOf('\n'); return [t.slice(0, i), t.slice(i + 1)]; };
      const [sg, jg] = tach(rg), [sm, jm] = tach(rm);
      let ok = sg === sm;
      try { const og = JSON.parse(jg), om = JSON.parse(jm); ok = ok && JSON.stringify(om.luat) === JSON.stringify({ co_tep: false }) && !('luat' in og); delete om.luat; ok = ok && JSON.stringify(og) === JSON.stringify(om); } catch (_) { ok = false; }
      if (!ok) return `${slug} (bản rút)`;
    }
    const st = (readFileSync(path.join(kho, '_acceptance', slug, 'contract.md'), 'utf8').match(/^status:\s*(\S+)/m) || [])[1];
    if (st === 'verified') { const [kg, km] = await Promise.all([chayAsync(kcnGoc, ['--check', ...a]), chayAsync(kcnMoi, ['--check', ...a])]); if (kg !== km) return `${slug} (khong-can-nguoi)`; }
    return null;
  }));
  return { n: ds.length, lech: lech.filter(Boolean) };
}
if (want('LS-02')) {
  const hd = readFileSync(HD_VONG, 'utf8');
  const st = (hd.match(/^status:\s*(\S+)/m) || [])[1];
  if (['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te'].includes(st)) console.log('  PASS: LS-02 da-ky (hồ sơ của vòng đã ký — không so)');
  else {
    const goc = (hd.match(/Commit gốc của vòng: `([0-9a-f]{7,40})`/) || [])[1];
    // Đo trước (async), chấm sau (check đồng bộ).
    let kq = null, loi = null, kqDo = null, loiDo = null;
    if (!goc) loi = 'dòng «Commit gốc của vòng» ở Notes của hợp đồng vắng hoặc chưa ghi sha';
    else {
      const d = dungGoc(goc);
      try {
        kq = [];
        for (const [ten, kho] of [['kit', ROOT], ['crm', process.env.LS_CRM_ROOT || null]]) {
          if (!kho) { kq.push([ten, 'vang']); continue; }
          if (existsSync(path.join(kho, 'PRODUCT-INVARIANTS.md'))) { kq.push([ten, 'co-tep-luat(bo)']); continue; }
          kq.push([ten, await soKho(kho, path.join(d, 'scripts', 'gate-card.js'), path.join(d, 'scripts', 'khong-can-nguoi.mjs'), GC, KCN)]);
        }
      } catch (e) { loi = e.message; }
      try {
        const nha = tam('lsp-nha-'); for (const t of ['scripts', 'lib', 'skills']) cpSync(path.join(ROOT, t), path.join(nha, t), { recursive: true });
        const gcT = path.join(nha, 'scripts', 'gate-card.js'); const t = readFileSync(gcT, 'utf8');
        const cu = "if (luatG2) { for (const [c, t] of luatG2.co)"; if (t.split(cu).length !== 2) throw new Error('mũi tiêm thẻ không áp');
        writeFileSync(gcT, t.replace(cu, "P.push('<div class=\"lab\">Luật sản phẩm bị chạm</div>'); if (luatG2) { for (const [c, t] of luatG2.co)"));
        const mau = readdirSync(path.join(ROOT, '_acceptance')).filter(n => existsSync(path.join(ROOT, '_acceptance', n, 'evidence-report.md'))).sort().slice(0, 3);
        const k = tam('lsp-kho-'); mkdirSync(path.join(k, '_acceptance'));
        for (const n of mau) cpSync(path.join(ROOT, '_acceptance', n), path.join(k, '_acceptance', n), { recursive: true });
        cpSync(path.join(ROOT, '_acceptance', 'config.yaml'), path.join(k, '_acceptance', 'config.yaml'));
        kqDo = { tiem: await soKho(k, path.join(d, 'scripts', 'gate-card.js'), path.join(d, 'scripts', 'khong-can-nguoi.mjs'), gcT, path.join(nha, 'scripts', 'khong-can-nguoi.mjs')),
                 lanh: await soKho(k, path.join(d, 'scripts', 'gate-card.js'), path.join(d, 'scripts', 'khong-can-nguoi.mjs'), GC, KCN) };
      } catch (e) { loiDo = e.message; }
    }
    check('LS-02 vi-phan', () => {
      if (loi) die(loi);
      for (const [ten, r] of kq) if (typeof r === 'object' && r.lech.length) die(`${ten}: ${r.lech.length}/${r.n} hồ sơ lệch — đầu tiên: ${r.lech[0]}`);
      console.log(`  PASS: LS-02 vi-phan ${kq.map(([ten, r]) => `${ten}=${typeof r === 'object' ? r.n : r}`).join(' ')}`);
    });
    check('LS-02-do', () => {
      if (loi || loiDo) die(loi || loiDo);
      if (kqDo.lanh.lech.length) die('đối chứng: bản lành trên cùng kho mẫu lại lệch — ' + kqDo.lanh.lech[0]);
      if (!kqDo.tiem.lech.length) die('thẻ in khối luật vô điều kiện mà phép so không lệch hồ sơ nào');
    });
  }
}

// ── LS-09: lượt chấm gọi bộ soi luật ngay sau thuoc-vat (đoạn «Mọi verdict» của S4 trong SKILL) ────────
function kiemNoiDay(skillText) {
  const l = skillText.split('\n').find(x => x.includes('**Mọi verdict:**'));
  if (!l) return 'không thấy đoạn «Mọi verdict» trong SKILL';
  const i = l.search(/thuoc-vat\.mjs[^`]*--write/); if (i < 0) return 'đoạn «Mọi verdict» không có lệnh thuoc-vat --write';
  const j = l.indexOf('luat-san-pham.cjs', i); if (j < 0) return 'thiếu lệnh luat-san-pham sau thuoc-vat';
  const lenh = l.slice(j, l.indexOf('`', j));
  if (!/--quet/.test(lenh) || !/--write/.test(lenh)) return 'lệnh luat-san-pham thiếu --quet hoặc --write: ' + lenh;
  const m5 = l.indexOf('**Mã 5', i); if (m5 >= 0 && m5 < j) return 'lệnh luat-san-pham đứng sau câu mã thoát 5 — không ngay sau thuoc-vat';
  return '';
}
if (want('LS-09')) {
  const SK = readFileSync(SKILL, 'utf8');
  check('LS-09 noi-day-s4', () => { const e = kiemNoiDay(SK); if (e) die(e); });
  check('LS-09-do', () => {
    const tiem = SK.replace(/ Kho có `PRODUCT-INVARIANTS\.md` → chạy tiếp `[^`]*luat-san-pham\.cjs[^`]*`[^.]*\./, '');
    if (tiem === SK) die('mũi tiêm (xoá câu soi luật) không áp');
    const e = kiemNoiDay(tiem); if (!e.includes('luat-san-pham')) die('xoá câu soi luật mà hàm kiểm không nêu luat-san-pham: ' + e);
  });
}

console.log(`luat-san-pham.ca: ${passed} đạt, ${failed} trượt`);
process.exit(failed ? 1 : 0);
