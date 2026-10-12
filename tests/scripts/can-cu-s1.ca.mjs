// can-cu-s1.ca.mjs — ca đo hồ sơ buoc-len-thiet-ke-khong-hoi (CC-02..CC-10). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash) — tệp KHÔNG mang đuôi .test.mjs để không trôi
// giữa các mảnh mjs. Kho thử do code sinh trong lượt (thư mục tạm + git init); giá trị mong đợi viết sẵn
// trong ca, KHÔNG rút từ đầu ra mô-đun. Đường dẫn suy từ vị trí tệp này.
// Chế độ dựng thẻ cho eval nhìn E9: `node tests/scripts/can-cu-s1.ca.mjs --dung-the <thư mục>`.
import { spawnSync, execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync, symlinkSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const MOD = path.join(ROOT, 'scripts', 'can-cu-s1.cjs');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const SKILL_REL = 'feature-loop/skills/feature-loop/SKILL.md';
const SLUG_VONG = 'buoc-len-thiet-ke-khong-hoi';
const NHANH = 'vong/a2-thiet-ke-khong-hoi-thua';
const require = createRequire(import.meta.url);
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghiTep = (root, rel, t) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), t); };

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────
const Q_GOC = 'Quy tắc gốc của kho: mọi bảng phải có khoá chính rõ ràng.';
const Q_LUAT = 'Luật kho: đổi khuôn dữ liệu phải có đường đọc bản cũ.';
const Q_NGAN = 'khoá chính';
const Q_THEM = 'Câu thêm vào tệp có sẵn ngay trong nhánh của vòng.';
const Q_MOI = 'Quy tắc mới đặt trong nhánh để tự biện minh cho lựa chọn.';
const Q_HD = 'Hợp đồng nói bảng mới dùng khoá tự tăng cho mọi dòng.';
const Q_O = 'Ô đã ký nói bước thiết kế không dừng hỏi người.';
function mkKho({ oDaKy = true } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-'));
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't'); git(r, 'config', 'commit.gpgsign', 'false');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n`);
  ghiTep(r, 'docs/luat.md', `${Q_LUAT}\n`);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  const base = git(r, 'rev-parse', 'HEAD');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n${Q_THEM}\n`);
  ghiTep(r, 'docs/moi.md', `${Q_MOI}\n`);
  ghiTep(r, '_acceptance/h/contract.md', `---\nslug: h\nstatus: draft\ndesign_doc: docs/superpowers/specs/2026-10-11-h-design.md\n---\n\n${Q_HD}\n`);
  ghiTep(r, 'docs/superpowers/specs/2026-10-11-h-design.md', `# h\n\n${Q_HD}\n`);
  ghiTep(r, '_acceptance/h/opportunity.md', `---\nslug: h\ndecision: ${oDaKy ? 'build' : ''}\ndecided_by: ${oDaKy ? 'Chủ Kho' : ''}\n---\n\n${Q_O}\n`);
  ghiTep(r, '_acceptance/h/decisions.jsonl', '{"id":"d-x","type":"approach","stage":"S1","decision":"Lựa chọn a được ghi vào sổ của vòng."}\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'nhanh');
  return { r, base };
}
const S1 = (id, can_cu, extra = {}) => Object.assign({ id, type: 'approach', stage: 'S1', at: '2026-10-11T00:00:00Z', decision: 'Lựa chọn ' + id, why: 'vì', cost_if_wrong: 'tốn' }, can_cu === undefined ? {} : { can_cu }, extra);
const MT = (tep, trich, kho_dao = false) => ({ nguon: 'muc-tieu', kho_dao, tep, trich });
const ML = id => S1(id, { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới tệp.' });
const CN = id => S1(id, { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên giữ.', loi_khac: 'Đổi — tốn một tiêu chí.' });
const ghiSoKho = (r, slug, dongs) => ghiTep(r, `_acceptance/${slug}/decisions.jsonl`, dongs.map(x => JSON.stringify(x)).join('\n') + '\n');

// ── Thẻ (dùng ở CC-05, CC-06, và chế độ --dung-the) ─────────────────────────────────────────────────────
const HD_DRAFT = `---\nschema_version: 1\nfeature: Kho thử h\nslug: h\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\ndesign_doc: docs/superpowers/specs/2026-10-11-h-design.md\n---\n\n# h\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n\n## Coverage\n\n- Trục A: a [thước CE: b] → AC-1\n\n## Out of scope\n\n- một\n- hai\n`;
const EVALS = 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: "exit 0"\n';
const CAU_KD = S1('q2', { nguon: 'chi-nguoi', kho_dao: true, khuyen: 'Giữ bản ghi cũ.', loi_khac: 'Xoá bản ghi cũ — không lấy lại được.' });
function mkHoSoThe({ themDo = false } = {}) {
  const kho = mkKho();
  ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT);
  ghiTep(kho.r, '_acceptance/h/evals.yaml', EVALS);
  ghiTep(kho.r, '_acceptance/config.yaml', 'risk_tiers:\n  t3_paths: []\nexecutors:\n  test:\n    x: "true"\n');
  const dongs = [CN('q1'), CAU_KD, S1('m1', MT('CLAUDE.md', Q_GOC)), ML('m2'), S1('c1', undefined), Object.assign(S1('s2', undefined), { stage: 'S2' })];
  if (themDo) dongs.push(S1('r1', MT('docs/moi.md', Q_MOI)));
  ghiSoKho(kho.r, 'h', dongs);
  return kho;
}
const theCua = (kho, them = []) => spawnSync('node', [GC, '--root', kho.r, '--slug', 'h', ...them], { encoding: 'utf8' });

// Hồ sơ nháp cho ca thẻ ba vế (KK-5..7, eval nhìn E9 của vòng can-cu-s1-chay-moi-kho): mỗi dòng mang vì sao + giá
// RIÊNG; khối máy đã quyết phủ nguồn {mục-tiêu, một-lối} × loại {approach, descope}; m5 thiếu giá.
const W = id => ({ why: `Vì sao riêng của ${id}.`, cost_if_wrong: `Giá riêng của ${id}.` });
function mkHoSoBaVe() {
  const kho = mkKho();
  ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT);
  ghiTep(kho.r, '_acceptance/h/evals.yaml', EVALS);
  ghiTep(kho.r, '_acceptance/config.yaml', 'risk_tiers:\n  t3_paths: []\nexecutors:\n  test:\n    x: "true"\n');
  const m5 = Object.assign(S1('m5', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới tệp.' }), { why: W('m5').why }); delete m5.cost_if_wrong;
  ghiSoKho(kho.r, 'h', [
    Object.assign(CN('q1'), W('q1')),
    Object.assign(S1('q2', { nguon: 'chi-nguoi', kho_dao: true, khuyen: 'Giữ bản ghi cũ.', loi_khac: 'Xoá bản ghi cũ — không lấy lại được.' }), W('q2')),
    Object.assign(S1('m1', MT('CLAUDE.md', Q_GOC)), W('m1')),
    Object.assign(ML('m2'), W('m2')),
    Object.assign(S1('m3', MT('docs/luat.md', Q_LUAT)), { type: 'descope' }, W('m3')),
    Object.assign(ML('m4'), { type: 'descope' }, W('m4')),
    m5,
  ]);
  return kho;
}
if (process.argv[2] === '--dung-the-ba-ve') {
  const out = process.argv[3];
  if (!out) { console.error('can-cu-s1.ca: cần thư mục đích'); process.exit(2); }
  const kho = mkHoSoBaVe(); mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'card.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">' + theCua(kho, ['--glossary-base', kho.base]).stdout);
  console.log(path.join(out, 'card.html'));
  process.exit(0);
}
if (process.argv[2] === '--dung-the') {
  const out = process.argv[3];
  if (!out) { console.error('can-cu-s1.ca: cần thư mục đích'); process.exit(2); }
  const kho = mkHoSoThe(); mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'card.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">' + theCua(kho, ['--glossary-base', kho.base]).stdout);
  console.log(path.join(out, 'card.html'));
  process.exit(0);
}

// ── CC-04: ma trận xếp lớp ──────────────────────────────────────────────────────────────────────────────
// [tên ca, dòng, dùng gốc?, lớp mong đợi, mã mong đợi, thông điệp mong đợi]
const MA_TRAN = [
  ['mt-hop-le-co-goc', S1('a', MT('CLAUDE.md', Q_GOC)), true, 'da-quyet', null, null],
  ['mt-hop-le-khong-goc', S1('a', MT('CLAUDE.md', Q_GOC)), false, 'da-quyet', null, null],
  ['mt-tep-cham-gach', S1('a', MT('./CLAUDE.md', Q_GOC)), true, 'da-quyet', null, null],
  ['mt-tep-gach-nguoc', S1('a', MT('docs\\luat.md', Q_LUAT)), true, 'da-quyet', null, null],
  ['mt-thieu-con-tro', S1('a', { nguon: 'muc-tieu', kho_dao: false }), true, 'do', 'thieu-con-tro', 'thiếu con trỏ căn cứ (tệp + câu trích)'],
  ['mt-tep-vang', S1('a', MT('docs/khong-co.md', Q_GOC)), true, 'do', 'tep-vang', 'tệp căn cứ không có'],
  ['mt-tep-thoat-goc', S1('a', MT('../ngoai.md', Q_GOC)), true, 'do', 'tep-vang', 'tệp căn cứ không có'],
  ['mt-trich-ngan', S1('a', MT('CLAUDE.md', Q_NGAN)), true, 'do', 'trich-ngan', 'câu trích quá ngắn để làm căn cứ'],
  ['mt-trich-vang', S1('a', MT('CLAUDE.md', 'Câu này không hề có trong tệp căn cứ nào cả.')), true, 'do', 'trich-vang', 'câu trích không có trong tệp căn cứ'],
  ['mt-tu-bien-minh-contract', S1('a', MT('_acceptance/h/contract.md', Q_HD)), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-tu-bien-minh-design', S1('a', MT('docs/superpowers/specs/2026-10-11-h-design.md', Q_HD)), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-tu-bien-minh-so', S1('a', MT('_acceptance/h/decisions.jsonl', 'Lựa chọn a được ghi vào sổ của vòng.')), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-o-da-ky-moi-trong-nhanh', S1('a', MT('_acceptance/h/opportunity.md', Q_O)), true, 'da-quyet', null, null],
  ['mt-sinh-trong-vong-tep-moi', S1('a', MT('docs/moi.md', Q_MOI)), true, 'do', 'sinh-trong-vong', 'câu trích không có ở gốc nhánh — căn cứ sinh trong vòng'],
  ['mt-sinh-trong-vong-cau-them', S1('a', MT('CLAUDE.md', Q_THEM)), true, 'do', 'sinh-trong-vong', 'câu trích không có ở gốc nhánh — căn cứ sinh trong vòng'],
  ['mt-kho-dao', S1('a', MT('CLAUDE.md', Q_GOC, true)), true, 'do', 'kho-dao', 'khó-đảo luôn là câu hỏi cho người'],
  ['ml-co-loi-chet', S1('a', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chạm tệp ngoài ranh giới lời giao.' }), true, 'da-quyet', null, null],
  ['ml-thieu-loi-chet', S1('a', { nguon: 'mot-loi', kho_dao: false }), true, 'do', 'thieu-loi-chet', 'một lối ra nhưng không nói lối khác chết vì sao'],
  ['ml-kho-dao', S1('a', { nguon: 'mot-loi', kho_dao: true, loi_chet: 'Lối kia không còn.' }), true, 'do', 'kho-dao', 'khó-đảo luôn là câu hỏi cho người'],
  ['cn-du', S1('a', { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Giữ ba loại giai đoạn.', loi_khac: 'Thêm loại thứ tư — sửa hai tiêu chí.' }), true, 'cau-hoi', null, null],
  ['cn-kho-dao', S1('a', { nguon: 'chi-nguoi', kho_dao: true, khuyen: 'Giữ bản ghi cũ.', loi_khac: 'Xoá bản ghi cũ — không lấy lại được.' }), true, 'cau-hoi', null, null],
  ['cn-thieu-khuyen', S1('a', { nguon: 'chi-nguoi', kho_dao: false, loi_khac: 'Lối khác.' }), true, 'do', 'thieu-khuyen', 'câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác'],
  ['cn-thieu-loi-khac', S1('a', { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên.' }), true, 'do', 'thieu-khuyen', 'câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác'],
  ['nguon-la', S1('a', { nguon: 'muc_tieu', kho_dao: false, tep: 'CLAUDE.md', trich: Q_GOC }), true, 'do', 'nguon-la', 'nguồn căn cứ lạ'],
  ['doi-truoc', S1('a', undefined), true, 'doi-truoc', null, null],
  ['ngoai-s1', Object.assign(S1('a', MT('docs/khong-co.md', Q_GOC)), { stage: 'S2' }), true, null, null, null],
];
function chayMaTran(mod, kho) {
  const lech = [];
  for (const [ten, e, coGoc, lop, ma, td] of MA_TRAN) {
    const kq = mod.phanLoaiSo([e], { root: kho.r, slug: 'h', base: coGoc ? kho.base : null });
    const d = kq.dong[0] || null;
    const got = d ? [d.lop, d.ma || null, d.thong_diep || null] : [null, null, null];
    if (JSON.stringify(got) !== JSON.stringify([lop, ma, td])) lech.push(`${ten}: got ${JSON.stringify(got)} want ${JSON.stringify([lop, ma, td])}`);
  }
  return lech;
}
const banSaoMod = (tu, thay) => {
  const goc = readFileSync(MOD, 'utf8');
  if (!goc.includes(tu)) die('mũi tiêm không áp: không thấy «' + tu + '»');
  const d = mkdtempSync(path.join(tmpdir(), 'cancu-mut-')); const f = path.join(d, 'can-cu-s1.cjs');
  writeFileSync(f, goc.replace(tu, thay)); return require(f);
};

check(`CC-04 ma-tran (${MA_TRAN.length} ca)`, () => {
  if (MA_TRAN.length < 22) die('ma trận dưới 22 ca');
  const mod = require(MOD); const kho = mkKho();
  const lech = chayMaTran(mod, kho);
  if (lech.length) die('lệch:\n    ' + lech.join('\n    '));
  const k = mod.phanLoaiSo([S1('a', MT('CLAUDE.md', Q_GOC))], { root: kho.r, slug: 'h', base: null });
  eq([k.goc, k.dong[0].ghi_chu], ['chua-kiem', 'chưa kiểm câu trích có từ trước vòng'], 'không gốc → ghi chú chưa kiểm');
  const l = mod.phanLoaiSo([S1('a', MT('CLAUDE.md', Q_GOC))], { root: kho.r, slug: 'h', base: 'khong-co-ref' });
  eq([l.goc, l.dong[0].lop], ['loi', 'da-quyet'], 'gốc không đọc được → lỗi gốc, không đỏ');
  const kho2 = mkKho({ oDaKy: false });
  const m = mod.phanLoaiSo([S1('a', MT('_acceptance/h/opportunity.md', Q_O))], { root: kho2.r, slug: 'h', base: kho2.base });
  eq([m.dong[0].lop, m.dong[0].ma, m.dong[0].thong_diep], ['do', 'o-chua-ky', 'căn cứ là ô cơ hội chưa ký'], 'ô cơ hội chưa ký');
  const raw = [JSON.stringify(S1('x', { nguon: 'mot-loi', kho_dao: false })), '{hỏng', JSON.stringify(S1('do1', { nguon: 'la' })),
    JSON.stringify(S1('y', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới.' }, { supersedes: 'x' }))].join('\n');
  const so = mod.docSo(raw); eq(so.broken, 1, 'dòng hỏng được đếm');
  const t = mod.phanLoaiSo(so.entries, { root: kho.r, slug: 'h', base: kho.base });
  eq(t.dong.map(d => [d.id, d.lop]), [['x', 'bi-thay'], ['do1', 'do'], ['y', 'da-quyet']], 'bị thay (dòng thay đứng sau một dòng đỏ)');
  eq([t.bi_thay, t.do.length, t.da_quyet.length], [1, 1, 1], 'đếm lớp');
  const cu = mod.phanLoaiSo([S1('z', undefined), Object.assign(ML('w'), { stage: 'S4-r1', supersedes: 'z' })], { root: kho.r, slug: 'h' });
  eq(cu.dong.map(d => [d.id, d.lop]), [['z', 'doi-truoc']], 'dòng đời trước bị thay vẫn là đời trước (thẻ hồ sơ cũ không đổi)');
  const h = mod.phanLoaiSo([CN('a'), Object.assign({}, CAU_KD, { id: 'b' })], { root: kho.r, slug: 'h' });
  eq(h.cau_hoi.map(d => [d.id, d.nhan]), [['a', 'Hỏi-1'], ['b', 'Hỏi-2']], 'nhãn Hỏi-n theo thứ tự sổ');
});

// Mỗi mũi tiêm gỡ đúng một luật đỏ: [mã, chuỗi gốc, chuỗi thay, ca ma trận phải lệch]
const MUI = [
  ['nguon-la', " || !NGUON.includes(c.nguon)) return ra('do', 'nguon-la');", ") return ra('do', 'nguon-la');", 'nguon-la'],
  ['kho-dao', "if (c.kho_dao === true) return ra('do', 'kho-dao');", '', 'mt-kho-dao'],
  ['thieu-con-tro', "if (!chuoi(c.tep) || !trich) return ra('do', 'thieu-con-tro');", '', 'mt-thieu-con-tro'],
  ['tep-vang', "if (noiDung === null) return ra('do', 'tep-vang');", '', 'mt-tep-vang'],
  ['trich-ngan', "if (trich.length < TRICH_MIN) return ra('do', 'trich-ngan');", '', 'mt-trich-ngan'],
  ['trich-vang', "if (!gom(noiDung).includes(trich)) return ra('do', 'trich-vang');", '', 'mt-trich-vang'],
  ['tu-bien-minh', "if (laVatCuaVong(nc, rel)) return ra('do', 'tu-bien-minh');", '', 'mt-tu-bien-minh-contract'],
  ['o-chua-ky', "if (laO && !nc.oDaKy) return ra('do', 'o-chua-ky');", '', null],
  ['sinh-trong-vong', "if (cu === null || !gom(cu).includes(trich)) return ra('do', 'sinh-trong-vong');", '', 'mt-sinh-trong-vong-tep-moi'],
  ['thieu-loi-chet', "return chuoi(c.loi_chet) ? ra('da-quyet') : ra('do', 'thieu-loi-chet');", "return ra('da-quyet');", 'ml-thieu-loi-chet'],
  ['thieu-khuyen', "return chuoi(c.khuyen) && chuoi(c.loi_khac) ? ra('cau-hoi') : ra('do', 'thieu-khuyen');", "return ra('cau-hoi');", 'cn-thieu-khuyen'],
];
for (const [ma, tu, thay, ca] of MUI) {
  check(`CC-04-do ${ma}`, () => {
    const mod = banSaoMod(tu, thay);
    if (ma === 'o-chua-ky') {
      const k = mkKho({ oDaKy: false });
      const r = mod.phanLoaiSo([S1('a', MT('_acceptance/h/opportunity.md', Q_O))], { root: k.r, slug: 'h', base: k.base });
      if (r.dong[0].ma === 'o-chua-ky') die('gỡ luật o-chua-ky mà ca ô chưa ký vẫn đỏ đúng mã — phép đo không phân biệt');
      return;
    }
    const lech = chayMaTran(mod, mkKho());
    if (!lech.some(l => l.startsWith(ca + ':'))) die(`gỡ luật ${ma} mà ca «${ca}» không lệch — phép đo không phân biệt: ${lech.join(' | ')}`);
  });
}

// ── CC-07: lệnh đếm của đường đo ────────────────────────────────────────────────────────────────────────
const G1 = (id, sup) => ({ id, type: 'approach', stage: 'gate1', at: '2026-10-11T01:00:00Z', decision: 'Người chọn lại', why: 'người chọn ở Cổng Phạm vi', cost_if_wrong: 'tốn', supersedes: sup, decided_by: 'Chủ Kho' });
const DEM_MONG = [
  { slug: 'A', cau_hoi: 0, da_quyet: 1, do: 0, doi_truoc: 0, bi_thay: 1, lat_may_quyet: 1, lat_cau_hoi: 0 },
  { slug: 'B', cau_hoi: 0, da_quyet: 0, do: 0, doi_truoc: 0, bi_thay: 1, lat_may_quyet: 0, lat_cau_hoi: 1 },
  { slug: 'C', cau_hoi: 1, da_quyet: 1, do: 0, doi_truoc: 1, bi_thay: 0, lat_may_quyet: 0, lat_cau_hoi: 0 },
];
const mkKhoDem = () => {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-dem-'));
  ghiSoKho(r, 'A', [ML('a1'), ML('a2'), G1('a3', 'a1')]);
  ghiSoKho(r, 'B', [CN('b1'), G1('b2', 'b1')]);
  ghiSoKho(r, 'C', [CN('c1'), ML('c2'), S1('c3', undefined), Object.assign(ML('c4'), { stage: 'S2' }), G1('c5', 'c4')]);
  return r;
};
check('CC-07', () => {
  const r = mkKhoDem();
  const j = spawnSync('node', [MOD, '--root', r, '--dem', '--json'], { encoding: 'utf8' });
  if (j.status !== 0) die('--dem --json thoát ' + j.status + ': ' + j.stderr);
  eq(JSON.parse(j.stdout), DEM_MONG, 'đếm từng hồ sơ — dòng ngoài S1 KHÔNG được đếm');
  const t = spawnSync('node', [MOD, '--root', r, '--dem'], { encoding: 'utf8' }).stdout.trim().split('\n');
  eq(t.length, 3, 'một dòng mỗi hồ sơ');
  DEM_MONG.forEach((m, i) => {
    if (!t[i].startsWith(m.slug + ' · ') || !t[i].includes(`máy quyết bị lật ${m.lat_may_quyet}`) || !t[i].includes(`câu hỏi chọn khác ${m.lat_cau_hoi}`)) die('dòng chữ lệch: ' + t[i]);
  });
});
check('CC-07-do', () => {
  const mod = banSaoMod("if (l === 'da-quyet') latMay++; else if (l === 'cau-hoi') latHoi++;", 'latMay++;');
  const lech = mod.dem(mkKhoDem()).filter((x, i) => JSON.stringify(x) !== JSON.stringify(DEM_MONG[i])).map(x => x.slug);
  if (!lech.includes('C')) die('đếm mọi supersedes mà hồ sơ C không lệch: ' + lech.join(','));
});

// ── Tầm của vòng, neo LỊCH SỬ (dòng sổ S2 d-…-18): commit gộp nhánh vòng vào main → [điểm rẽ, cha-2];
// chưa gộp → [merge-base với nhánh chính, HEAD]. Vật của vòng đọc ở đỉnh tầm, không ở cây sống — để vòng
// sau sửa hợp lệ khuôn/luật không làm các ca này đỏ oan (cùng cách DP7-10).
function tamVong() {
  const re = new RegExp(`\\tMerge pull request #\\d+ from \\S+/${NHANH.replace(/[/.]/g, m => '\\' + m)}$`);
  const dong = git(ROOT, 'log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n').find(l => re.test(l));
  if (dong) { const m = dong.split('\t')[0]; return { goc: git(ROOT, 'merge-base', `${m}^1`, `${m}^2`), dinh: git(ROOT, 'rev-parse', `${m}^2`), nguon: 'lich-su' }; }
  const chinh = ['origin/main', 'main'].find(r => spawnSync('git', ['-C', ROOT, 'rev-parse', '--verify', '--quiet', r]).status === 0);
  if (!chinh) die('không tìm được nhánh chính (origin/main | main) để tính tầm vòng');
  const goc = git(ROOT, 'merge-base', 'HEAD', chinh); const dinh = git(ROOT, 'rev-parse', 'HEAD');
  if (goc === dinh) die('tầm vòng rỗng: không tìm được commit gộp ' + NHANH + ' và HEAD trùng nhánh chính');
  return { goc, dinh, nguon: 'nhanh' };
}
const tepO = (sha, rel) => { const r = spawnSync('git', ['-C', ROOT, 'show', `${sha}:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return r.status === 0 ? r.stdout : null; };
const cacKhoi = t => { const m = new Map(); for (const x of t.matchAll(/<!-- <<<([A-Z0-9-]+) -->([\s\S]*?)<!-- \1>>> -->/g)) m.set(x[1], x[2]); return m; };
function soKhoi(goc, moi) {
  const b = cacKhoi(goc), n = cacKhoi(moi);
  return { lech: [...b.keys()].filter(k => n.get(k) !== b.get(k)), them: [...n.keys()].filter(k => !b.has(k)).sort() };
}
const VUNG_CAM = ['feature-loop/scripts', 'feature-loop/workflows', 'dieu-phoi', 'scripts/cat-luot.mjs', 'skills/cat-luot', 'lib', 'hooks', 'scripts/pre-merge-check.sh', 'commands/approve.md', '_acceptance/config.yaml'];

// ── CC-02: khuôn có sẵn giữ từng byte, vùng cấm không đổi ─────────────────────────────────────────────
check('CC-02 khoi-giu-byte', () => {
  const t = tamVong(); const goc = tepO(t.goc, SKILL_REL), dinh = tepO(t.dinh, SKILL_REL);
  if (goc === null || dinh === null) die('không đọc được SKILL ở tầm vòng ' + JSON.stringify(t));
  const k = soKhoi(goc, dinh);
  eq(k.lech, [], `khối có ở gốc ${t.goc.slice(0, 8)} phải giữ từng byte (${t.nguon})`);
  eq(k.them, ['DEC-CAN-CU-SLOT', 'DEC-LAT-GATE1'], 'khối mới đúng hai');
  eq(git(ROOT, 'diff', '--name-only', t.goc, t.dinh, '--', ...VUNG_CAM), '', 'vùng cấm chạm không đổi');
  console.log(`    CC-02: tầm ${t.goc.slice(0, 8)}..${t.dinh.slice(0, 8)} (${t.nguon}) · ${cacKhoi(goc).size} khối gốc`);
});
check('CC-02-do', () => {
  const goc = readFileSync(SKILL, 'utf8');
  const tiem = goc.replace(/(<!-- <<<TRONG-DOT -->[\s\S]*?)Trong đợt/, '$1Trong dot');
  if (tiem === goc) die('mũi tiêm TRONG-DOT không áp');
  const k = soKhoi(goc, tiem);
  if (!k.lech.includes('TRONG-DOT')) die('đổi một ký tự trong TRONG-DOT mà hàm so không nêu khối: ' + JSON.stringify(k));
});

// ── CC-03: khuôn rút từ SKILL, ghi bằng CHÍNH khối lệnh DEC-ID-RECIPE (bash + zsh), bộ xếp lớp đọc lại ──
const recipeOf = t => { const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/); if (!m) die('thiếu khối DEC-ID-RECIPE'); return m[1]; };
const khuonCanCu = t => {
  const m = t.match(/<!-- <<<DEC-CAN-CU-SLOT -->\n([\s\S]+?)\n<!-- DEC-CAN-CU-SLOT>>> -->/); if (!m) die('thiếu khối DEC-CAN-CU-SLOT');
  const l = m[1].split('\n'); if (l.length !== 3 || !l.every(x => /^,"can[_a-z]*":/.test(x))) die('khối DEC-CAN-CU-SLOT phải đúng 3 dòng khoá căn cứ');
  return l;
};
const LO = '"cost_if_wrong":"<sai thì tốn gì, 1 câu>"';
const jsonStr = s => JSON.stringify(String(s)).slice(1, -1);
const Q_DB = "Luật kho: giá '100%' và biến $HOME «không» được nội suy trong câu.";
const DIEN = {
  '<đường dẫn tương đối gốc kho>': 'CLAUDE.md', '<câu trích nguyên văn, một dòng>': jsonStr(Q_DB),
  '<lối khác chết vì sao, 1 câu>': jsonStr("Lối kia chạm 'tệp' ngoài ranh giới — 0% đường."),
  '<lối máy khuyên, 1 câu>': jsonStr('Giữ $A như cũ.'), '<lối khác — giá nếu chọn nó, 1 câu>': jsonStr("Đổi sang 'B' — tốn 2 tiêu chí."),
};
const dienKhuon = l => Object.entries(DIEN).reduce((s, [k, v]) => s.split(k).join(v), l);
function ghiBangCongThuc(skillText, sh) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-rt-'));
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't'); git(r, 'config', 'commit.gpgsign', 'false');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_DB}\n`); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  const base = git(r, 'rev-parse', 'HEAD'); mkdirSync(path.join(r, '_acceptance', 'x'), { recursive: true });
  const recipe = recipeOf(skillText); if (recipe.split(LO).length !== 2) die('khối DEC-ID-RECIPE không còn đúng một ô cost_if_wrong');
  for (const k of khuonCanCu(skillText)) {
    const lenh = recipe.split(LO).join(LO + dienKhuon(k)).split('<slug>').join('x').split('<type>').join('approach').split('<stage>').join('S1')
      .split('<ISO>').join('2026-10-11T00:00:00Z').split('<1 câu>').join('Chọn A').split('<vì sao, 1 câu>').join('vì').split('<sai thì tốn gì, 1 câu>').join('tốn');
    const p = spawnSync(sh, ['-c', lenh], { cwd: r, encoding: 'utf8' }); if (p.status !== 0) die(`khối lệnh không chạy dưới ${sh}: ${p.stderr}`);
  }
  const mod = require(MOD);
  return { mod, r, base, so: mod.docSo(readFileSync(path.join(r, '_acceptance', 'x', 'decisions.jsonl'), 'utf8')) };
}
for (const sh of ['bash', 'zsh']) {
  check(`CC-03 ${sh}`, () => {
    if (spawnSync(sh, ['-c', 'true']).status !== 0) die(sh + ' vắng trên máy — ca KHÔNG bỏ qua');
    const { mod, r, base, so } = ghiBangCongThuc(readFileSync(SKILL, 'utf8'), sh);
    eq(so.broken, 0, 'mọi dòng là JSON');
    const kq = mod.phanLoaiSo(so.entries, { root: r, slug: 'x', base });
    eq(kq.dong.map(d => d.lop), ['da-quyet', 'da-quyet', 'cau-hoi'], 'lớp ba khuôn');
    eq(new Set(so.entries.map(e => e.id)).size, 3, 'mã dòng duy nhất');
    const [a, b, c] = so.entries.map(e => e.can_cu);
    eq([a.tep, a.trich, b.loi_chet, c.khuyen, c.loi_khac], ['CLAUDE.md', Q_DB, "Lối kia chạm 'tệp' ngoài ranh giới — 0% đường.", 'Giữ $A như cũ.', "Đổi sang 'B' — tốn 2 tiêu chí."], 'trường đọc lại = giá trị đã điền');
  });
}
check('CC-03-do', () => {
  const t = readFileSync(SKILL, 'utf8');
  const tiem = t.replace(/(<!-- <<<DEC-CAN-CU-SLOT -->\n),"can_cu":/, '$1,"cancu":');
  if (tiem === t) die('mũi tiêm khuôn không áp');
  const { mod, r, base, so } = ghiBangCongThuc(tiem, 'bash');
  const kq = mod.phanLoaiSo(so.entries, { root: r, slug: 'x', base });
  if (kq.dong[0].lop !== 'doi-truoc') die('đổi tên khoá trong khuôn 1 mà dòng không ra doi-truoc: ' + kq.dong[0].lop);
});

// ── CC-07 khuôn lật: rút DEC-LAT-GATE1, ghi bằng DEC-ID-RECIPE vào hồ sơ D có một dòng S1 máy đã quyết ──
const khuonLat = t => { const m = t.match(/<!-- <<<DEC-LAT-GATE1 -->\n([^\n]+)\n<!-- DEC-LAT-GATE1>>> -->/); if (!m) die('thiếu khối DEC-LAT-GATE1 (một dòng)'); return m[1]; };
function demSauLat(skillText) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-lat-'));
  ghiSoKho(r, 'D', [ML('d1')]);
  const recipe = recipeOf(skillText);
  const giua = recipe.split('\n').find(l => l.includes('"type":"<type>"')); if (!giua) die('khối DEC-ID-RECIPE không có dòng giữa');
  const lenh = recipe.split(giua).join(khuonLat(skillText)).split('<slug>').join('D').split('<mã dòng S1 bị đổi>').join('d1').split('<tên người>').join('Chủ Kho')
    .split('<ISO>').join('2026-10-11T01:00:00Z').split('<type>').join('approach').split('<lựa chọn mới theo lời người, 1 câu>').join('Người chọn lối B')
    .split('<câu người gõ ở Cổng Phạm vi>').join('sửa: Hỏi-1 = B').split('<sai thì tốn gì, 1 câu>').join('tốn');
  const p = spawnSync('bash', ['-c', lenh], { cwd: r, encoding: 'utf8' }); if (p.status !== 0) die('khối lệnh lật không chạy: ' + p.stderr);
  return require(MOD).dem(r).find(x => x.slug === 'D');
}
check('CC-07 khuon-lat', () => { eq(demSauLat(readFileSync(SKILL, 'utf8')).lat_may_quyet, 1, 'dòng lật ghi bằng khuôn SKILL được đếm'); });
check('CC-07-do khuon', () => {
  const t = readFileSync(SKILL, 'utf8'); const tiem = t.replace(/(<!-- <<<DEC-LAT-GATE1 -->\n[^\n]*)"stage":"gate1"/, '$1"stage":"S1"');
  if (tiem === t) die('mũi tiêm khuôn lật không áp');
  if (demSauLat(tiem).lat_may_quyet !== 0) die('đổi stage trong khuôn lật mà vẫn đếm 1 — phép đo không phân biệt');
});

// ── CC-05: thẻ Cổng Phạm vi ────────────────────────────────────────────────────────────────────────────
const khoiLab = (html, lab) => { const i = html.indexOf(`<div class="lab">${lab}</div>`); if (i < 0) return null; const j = html.indexOf('<div class="lab">', i + 10); return html.slice(i, j < 0 ? undefined : j); };
const cac = (s, re) => [...String(s || '').matchAll(re)].map(m => m[1]);
check('CC-05 the', () => {
  const kho = mkHoSoThe(); const b = ['--glossary-base', kho.base];
  const h = theCua(kho, b); if (h.status !== 0) die('thẻ thoát ' + h.status + ': ' + h.stderr);
  const hoi = khoiLab(h.stdout, 'Câu chỉ anh trả lời được'); if (!hoi) die('thiếu khối câu hỏi');
  eq(cac(hoi, /data-cau-hoi="([^"]+)"/g), ['Hỏi-1', 'Hỏi-2'], 'thứ tự câu hỏi');
  for (const s of ['Khuyên giữ.', 'Đổi — tốn một tiêu chí.', 'Giữ bản ghi cũ.', 'Xoá bản ghi cũ — không lấy lại được.']) if (!hoi.includes(s)) die('khối câu hỏi thiếu «' + s + '»');
  eq((hoi.match(/khó-đảo/g) || []).length, 1, 'nhãn khó-đảo đúng một câu');
  const q2 = hoi.slice(hoi.indexOf('data-cau-hoi="Hỏi-2"')); if (!/^[^\n]*?khó-đảo/.test(q2.split('</p>')[0])) die('nhãn khó-đảo không ở Hỏi-2');
  const mq = khoiLab(h.stdout, 'Máy đã quyết ở bước thiết kế — anh lật được'); if (!mq) die('thiếu khối máy đã quyết');
  eq(cac(mq, /data-may-quyet="([^"]+)"/g), ['m1', 'm2'], 'dòng máy đã quyết');
  if (!mq.includes(`«${Q_GOC}» (CLAUDE.md)`) || !mq.includes('lối khác chết vì: Lối kia chết vì ranh giới tệp.')) die('khối máy đã quyết thiếu căn cứ hoặc lối chết');
  eq((khoiLab(h.stdout, 'Quyết định &amp; trade-off').match(/<p class="li">/g) || []).length, 2, 'trade-off còn đời trước + S2');
  const vc = khoiLab(h.stdout, '👉 VIỆC CỦA ANH'); eq((vc.match(/<b>Hỏi-\d+<\/b>/g) || []).length, 2, 'VIỆC CỦA ANH một mục mỗi câu');
  if (!vc.includes('«duyệt hay sửa: ___»')) die('câu trả lời mẫu đổi');
  const j = JSON.parse(theCua(kho, [...b, '--extract']).stdout);
  eq(j.routing.hoi, ['duyệt hay sửa', 'Hỏi-1', 'Hỏi-2'], 'routing.hoi');
  eq([j.can_cu.cau_hoi.length, j.can_cu.da_quyet.length, j.can_cu.do.length, j.can_cu.doi_truoc], [2, 2, 0, 1], 'đếm can_cu');
  if (!j.one_shot.endsWith(' duyệt')) die('one_shot không điền sẵn duyệt: ' + j.one_shot);
});
check('CC-05 do', () => {
  const kho = mkHoSoThe({ themDo: true }); const b = ['--glossary-base', kho.base];
  const co = 'Sổ bước thiết kế — r1: câu trích không có ở gốc nhánh — căn cứ sinh trong vòng';
  if (!theCua(kho, b).stdout.includes(`<div class="flag fred">${co}</div>`)) die('thiếu cờ đỏ của dòng r1');
  const j = JSON.parse(theCua(kho, [...b, '--extract']).stdout);
  if (!j.one_shot.endsWith(' ___')) die('có dòng đỏ mà one_shot vẫn điền sẵn: ' + j.one_shot);
  eq(j.can_cu.do.map(x => [x.id, x.ma]), [['r1', 'sinh-trong-vong']], 'can_cu.do');
});
check('CC-05 khong-goc', () => {
  const h = theCua(mkHoSoThe()).stdout;
  eq((h.match(/chưa kiểm câu trích có từ trước vòng/g) || []).length, 1, 'đúng một cờ vàng chưa kiểm gốc');
  if (/Sổ bước thiết kế — /.test(h)) die('không gốc mà có cờ đỏ mới');
});
const VANG_MO_DUN = 'Không nạp được bộ đọc căn cứ bước thiết kế (scripts/can-cu-s1.cjs)';
check('CC-05 vang-mo-dun', () => {
  const kho = mkHoSoThe();
  if (theCua(kho, ['--glossary-base', kho.base]).stdout.includes(VANG_MO_DUN)) die('đối chứng: thẻ lành mà có cờ vắng bộ đọc');
  const d = mkdtempSync(path.join(tmpdir(), 'cancu-don-')); mkdirSync(path.join(d, 'scripts'));
  cpSync(GC, path.join(d, 'scripts', 'gate-card.js')); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const h = spawnSync('node', [path.join(d, 'scripts', 'gate-card.js'), '--root', kho.r, '--slug', 'h', '--glossary-base', kho.base], { encoding: 'utf8' });
  if (h.status !== 0) die('thẻ đứng một mình không dựng được: ' + h.stderr.slice(0, 200));
  eq((h.stdout.match(/Không nạp được bộ đọc căn cứ bước thiết kế/g) || []).length, 1, 'thẻ thiếu bộ đọc có đúng một cờ vàng');
  if (h.stdout.includes('Câu chỉ anh trả lời được')) die('thiếu bộ đọc mà vẫn có khối câu hỏi');
});
check('CC-05-do', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'cancu-gc-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const f = path.join(d, 'scripts', 'gate-card.js'); const t = readFileSync(f, 'utf8');
  const tu = 'const ccMayQuyet = cc.da_quyet;'; if (!t.includes(tu)) die('mũi tiêm thẻ không áp');
  writeFileSync(f, t.replace(tu, 'const ccMayQuyet = cc.da_quyet.concat(cc.cau_hoi);'));
  const kho = mkHoSoThe(); const h = spawnSync('node', [f, '--root', kho.r, '--slug', 'h', '--glossary-base', kho.base], { encoding: 'utf8' }).stdout;
  const lac = cac(khoiLab(h, 'Máy đã quyết ở bước thiết kế — anh lật được'), /data-may-quyet="([^"]+)"/g).filter(x => x.startsWith('q'));
  if (!lac.length) die('đưa câu hỏi vào khối máy-đã-quyết mà hàm so không thấy');
  console.log('    CC-05-do nêu: ' + lac.join(', '));
});

// ── CC-06: chiều im — đọc vật ở đỉnh tầm vòng ─────────────────────────────────────────────────────────
const dsHoSo = sha => git(ROOT, 'ls-tree', '--name-only', `${sha}:_acceptance`).split('\n').filter(Boolean);
check('CC-06 kho-that', () => {
  const t = tamVong(); const mod = require(MOD); let soHoSo = 0, soDong = 0, soLat = 0; const do_ = [];
  for (const slug of dsHoSo(t.goc)) {
    if (slug === SLUG_VONG) continue;
    const raw = tepO(t.dinh, `_acceptance/${slug}/decisions.jsonl`); if (raw === null) continue;
    const { entries } = mod.docSo(raw); soHoSo++; soDong += entries.length;
    soLat += entries.filter(e => e && e.stage === 'gate1' && typeof e.supersedes === 'string').length;
    if (mod.phanLoaiSo(entries, { root: ROOT, slug, docTep: rel => tepO(t.dinh, rel) }).do.length) do_.push(slug);
  }
  console.log(`    CC-06: ${soHoSo} hồ sơ · ${soDong} dòng · ${soLat} dòng gate1 mang supersedes`);
  if (!soHoSo) die('không đọc được hồ sơ nào'); eq(do_, [], 'hồ sơ có sẵn có dòng đỏ');
});
// Chọn theo TÍNH CHẤT, không giả định (sửa ở hồ sơ can-cu-s1-chay-moi-kho, AC-10): hồ sơ đã qua Cổng Phạm vi
// có dòng S1 và KHÔNG dòng nào mang can_cu. Hồ sơ ghi sổ theo khuôn căn cứ (vòng sau A2) có hai khối căn cứ trên
// thẻ — không phải đối tượng của ca này; trước khi sửa, một hồ sơ như thế đứng đầu chữ cái làm ca đỏ oan (BB1, 11/10).
function chonTheCu(goc, slugs, { n = 3, locCanCu = true } = {}) {
  const mod = require(MOD); const chon = [];
  for (const slug of slugs) {
    if (chon.length === n) break;
    let hd = '', raw = '';
    try { hd = readFileSync(path.join(goc, '_acceptance', slug, 'contract.md'), 'utf8'); raw = readFileSync(path.join(goc, '_acceptance', slug, 'decisions.jsonl'), 'utf8'); } catch (_) { continue; }
    if (!/^status:\s*\S/m.test(hd) || /^status:\s*draft\b/m.test(hd)) continue;
    const en = mod.docSo(raw).entries; if (!en.some(e => e.stage === 'S1')) continue;
    if (locCanCu && en.some(e => e && e.can_cu !== undefined)) continue;
    chon.push([slug, en.filter(e => e.type !== 'seal').length]);
  }
  return chon;
}
function kiemTheCu(goc, chon, gc = GC) {
  const loi = [];
  for (const [slug, n] of chon) {
    const h = spawnSync('node', [gc, '--root', goc, '--slug', slug, '--gate', '1'], { encoding: 'utf8' }).stdout;
    if (h.includes('dòng sổ đời trước')) loi.push(slug + ': thẻ đã qua Cổng Phạm vi mang cờ đời trước');
    if (h.includes('Câu chỉ anh trả lời được')) loi.push(slug + ': thẻ đã qua Cổng Phạm vi có khối câu hỏi');
    const m = (khoiLab(h, 'Quyết định &amp; trade-off') || '').match(/<p class="li">/g) || [];
    if (m.length !== n) loi.push(`${slug}: trade-off đủ dòng — got ${m.length}, want ${n}`);
  }
  return loi;
}
check('CC-06 the-cu', () => {
  const t = tamVong(); const chon = chonTheCu(ROOT, dsHoSo(t.goc));
  if (chon.length !== 3) die('không đủ ba hồ sơ đã qua Cổng Phạm vi có dòng S1 đời trước');
  eq(kiemTheCu(ROOT, chon), [], 'thẻ hồ sơ đời trước đã qua Cổng Phạm vi');
  console.log('    CC-06 the-cu: ' + chon.map(x => x[0]).join(', '));
});
check('CC-06 vang', () => {
  const kho = mkKho(); ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT); ghiTep(kho.r, '_acceptance/h/evals.yaml', EVALS);
  ghiSoKho(kho.r, 'h', [S1('c1', undefined), S1('c2', undefined)]);
  eq((theCua(kho, ['--glossary-base', kho.base]).stdout.match(/dòng sổ đời trước/g) || []).length, 1, 'đúng một cờ vàng đời trước');
});
// Ba bộ đọc sổ có sẵn, đọc ĐÚNG trường lấy từ sổ: tóm tắt hồ sơ (dai.chu_kho.quyet_dinh_may/nguoi), quét bài
// học (dòng fix/descope mang mã d-<UTC>-<n>), sức khoẻ vòng (đếm thô dòng fix S4). Đối chứng dương: bớt một dòng
// sổ thì đầu ra của từng bộ đọc ĐỔI — hai vế so bằng nhau không phải hằng số.
const SO_BO_DOC = [
  S1('d-20261011T000000Z-1', MT('CLAUDE.md', Q_GOC), { type: 'descope' }),
  S1('d-20261011T000000Z-2', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới tệp.' }),
  S1('d-20261011T000000Z-3', { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên giữ.', loi_khac: 'Đổi — tốn một tiêu chí.' }),
  Object.assign(S1('d-20261011T000000Z-4', undefined), { type: 'fix', stage: 'S4-r1' }),
  { id: 'd-20261011T000000Z-5', type: 'approach', stage: 'gate1', at: '2026-10-11T01:00:00Z', decision: 'Người chọn lại', why: 'người chọn', cost_if_wrong: 'tốn', supersedes: 'd-20261011T000000Z-2', decided_by: 'Chủ Kho' },
];
function docBaBoDoc(dongs) {
  const kho = mkKho();
  ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT.replace('status: draft', 'status: implemented'));
  ghiTep(kho.r, '_acceptance/h/evals.yaml', EVALS);
  ghiSoKho(kho.r, 'h', dongs); ghiSoKho(kho.r, 'khac', [S1('d-20261011T000000Z-9', undefined)]);
  const HS = require(path.join(ROOT, 'scripts', 'ho-so-tom-tat.cjs'));
  const ck = HS.tomTatHoSo(path.join(kho.r, '_acceptance', 'h')).dai.chu_kho;
  const cs = spawnSync('node', [path.join(ROOT, 'feature-loop', 'scripts', 'claim-scan.mjs'), '--root', kho.r, '--slug', 'khac'], { encoding: 'utf8' });
  const lh = spawnSync('node', [path.join(ROOT, 'scripts', 'loop-health.mjs'), '--root', kho.r, '--json'], { encoding: 'utf8' });
  let hang = null; try { hang = (JSON.parse(lh.stdout).rows || []).find(x => x.slug === 'h') || null; } catch (_) { die('loop-health không in JSON: ' + (lh.stderr || lh.stdout).slice(0, 200)); }
  return { tom: [ck.quyet_dinh_may, ck.quyet_dinh_nguoi], claim: cs.stdout.split('\n').filter(l => /d-20261011T000000Z-\d/.test(l)).map(l => l.replace(/\/[^\s"]*cancu-[^\s"/]*/g, '<T>')), fix_s4: hang ? hang.fix_s4 : null };
}
const boCanCu = dongs => dongs.map(e => { const x = Object.assign({}, e); delete x.can_cu; return x; });
check('CC-06 bo-doc', () => {
  const co = docBaBoDoc(SO_BO_DOC), khong = docBaBoDoc(boCanCu(SO_BO_DOC));
  eq(co, khong, 'bộ đọc khác ra cùng kết quả có/không can_cu');
  eq([co.tom[0] >= 4, co.tom[1], co.claim.length >= 2, co.fix_s4], [true, 1, true, 1], 'ba bộ đọc thật sự đọc sổ (máy ≥ 4 · người 1 · ≥ 2 bài học · 1 dòng fix S4)');
  const bot = docBaBoDoc(SO_BO_DOC.filter(e => e.id !== 'd-20261011T000000Z-1' && e.id !== 'd-20261011T000000Z-4'));
  if (bot.tom[0] === co.tom[0] || bot.claim.length === co.claim.length || bot.fix_s4 === co.fix_s4) die('đối chứng dương: bớt dòng sổ mà đầu ra bộ đọc không đổi ' + JSON.stringify({ co, bot }));
  console.log(`    CC-06 bo-doc: máy ${co.tom[0]} · người ${co.tom[1]} · bài học ${co.claim.length} · fix S4 ${co.fix_s4}`);
});
check('CC-06-do', () => {
  const mod = banSaoMod("if (c === undefined) return ra('doi-truoc');", "if (c === undefined) return ra('do', 'nguon-la');");
  const t = tamVong();
  const dau = dsHoSo(t.goc).find(s => { if (s === SLUG_VONG) return false; const raw = tepO(t.dinh, `_acceptance/${s}/decisions.jsonl`); return raw && mod.docSo(raw).entries.some(e => e.stage === 'S1' && e.can_cu === undefined); });
  const kq = mod.phanLoaiSo(mod.docSo(tepO(t.dinh, `_acceptance/${dau}/decisions.jsonl`)).entries, { root: ROOT, slug: dau, docTep: rel => tepO(t.dinh, rel) });
  if (!kq.do.length) die('coi dòng đời trước là đỏ mà hồ sơ đầu tiên không đỏ');
  console.log('    CC-06-do nêu: ' + dau);
});

// ── CC-10: sổ của chính vòng, đọc ở đỉnh tầm, gốc 08ba287d ─────────────────────────────────────────────
check('CC-10', () => {
  const t = tamVong(); const mod = require(MOD);
  const kq = mod.phanLoaiSo(mod.docSo(tepO(t.dinh, `_acceptance/${SLUG_VONG}/decisions.jsonl`)).entries, { root: ROOT, slug: SLUG_VONG, base: '08ba287d', docTep: rel => tepO(t.dinh, rel) });
  console.log(`    CC-10: đỏ ${kq.do.length} · câu hỏi ${kq.cau_hoi.length} · máy đã quyết ${kq.da_quyet.length} · bị thay ${kq.bi_thay}`);
  eq([kq.do.length, kq.cau_hoi.length, kq.da_quyet.length, kq.bi_thay], [0, 3, 10, 3], 'sổ của vòng');
});

// ── KK: vòng can-cu-s1-chay-moi-kho (KK-n = AC-n) — lệnh gọi bộ xếp chạy ở kho khách ─────────────────────
// Kho thử do code sinh, KHÔNG có scripts/ của kit; HOME tạm mang bộ nhớ đệm plugin giả
// (acceptance-gate-kit/acceptance-gate/9.9.9) — thư mục bản là thư mục THẬT vì bộ giải gói bỏ qua symlink ở
// cấp đó, chỉ scripts/ bên trong trỏ cây đang kiểm. Lệnh là lệnh RÚT từ SKILL lúc chạy.
const FL_WF = path.join(ROOT, 'feature-loop', 'workflows');
const lenhBoXep = t => [...t.matchAll(/`([^`]*\bnode\b[^`]*can-cu-s1\.cjs[^`]*)`/g)].map(m => m[1]);
function nhaGia({ coBoXep = true } = {}) {
  const h = mkdtempSync(path.join(tmpdir(), 'kk-nha-'));
  const ban = path.join(h, '.claude', 'plugins', 'cache', 'acceptance-gate-kit', 'acceptance-gate', '9.9.9');
  mkdirSync(ban, { recursive: true });
  if (coBoXep) symlinkSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'));
  else mkdirSync(path.join(ban, 'scripts'));
  return h;
}
function khoKhach({ themDo = false } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'kk-kho-')); git(r, 'init', '-q');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n`);
  ghiTep(r, '_acceptance/h/contract.md', '---\nslug: h\nstatus: draft\n---\n');
  const dongs = [CN('q1'), S1('m1', MT('CLAUDE.md', Q_GOC)), ML('m2')];
  if (themDo) dongs.push(S1('r1', { nguon: 'la', kho_dao: false }));
  ghiSoKho(r, 'h', dongs); return r;
}
const TONG_SACH = 'h · câu hỏi 1 · máy đã quyết 2 · đỏ 0 · đời trước 0 · bị thay 0';
const chayLenh = (l, kho, nha, vo = 'bash') => spawnSync(vo, ['-c', l.split('$WORKFLOWS_DIR').join(FL_WF).split('<slug>').join('h')], { cwd: kho, env: { ...process.env, HOME: nha }, encoding: 'utf8' });
function kiemLenhKhoKhach(skillText, vo) {
  const ds = lenhBoXep(skillText); if (ds.length !== 2) return [`lệnh gọi bộ xếp rút được ${ds.length}, cần 2`];
  const kho = khoKhach(), nha = nhaGia(); if (existsSync(path.join(kho, 'scripts'))) return ['kho thử có scripts/ — không phải kho khách'];
  const loi = [];
  for (const l of ds) {
    const p = chayLenh(l, kho, nha, vo);
    if (p.status !== 0 || !p.stdout.split('\n').some(x => x.startsWith(TONG_SACH))) loi.push(`không chạy được ngoài kho kit (${vo}, thoát ${p.status}): «${l.slice(0, 80)}» → ${(p.stdout + p.stderr).trim().slice(0, 240)}`);
  }
  return loi;
}
for (const vo of ['bash', 'zsh']) check(`KK-1 ${vo}`, () => {
  if (spawnSync(vo, ['-c', 'true']).status !== 0) die(vo + ' vắng trên máy chạy');
  eq(kiemLenhKhoKhach(readFileSync(SKILL, 'utf8'), vo), [], 'lệnh rút từ SKILL chạy ở kho khách');
});
check('KK-1-do', () => {
  const t = readFileSync(SKILL, 'utf8'); eq(kiemLenhKhoKhach(t, 'bash'), [], 'đối chứng dương: bản lành xanh trên cùng kho thử');
  const tiem = t.replace('AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs"', 'node scripts/can-cu-s1.cjs');
  if (tiem === t) die('mũi tiêm không áp');
  const loi = kiemLenhKhoKhach(tiem, 'bash');
  if (!loi.some(x => x.startsWith('không chạy được ngoài kho kit'))) die('lệnh tương đối mà hàm kiểm không nêu: ' + JSON.stringify(loi));
});
const lenhKiemSo = () => { const l = lenhBoXep(readFileSync(SKILL, 'utf8')).find(x => x.includes('--slug')); if (!l) die('không rút được lệnh kiểm sổ (--slug) từ SKILL'); return l; };
check('KK-2 so-do', () => {
  const l = lenhKiemSo();
  const sach = chayLenh(l, khoKhach(), nhaGia());
  if (sach.status !== 0 || !sach.stdout.includes(TONG_SACH)) die('đối chứng dương: sổ sạch phải thoát 0 kèm dòng tổng kết — ' + (sach.stdout + sach.stderr).slice(0, 240));
  const p = chayLenh(l, khoKhach({ themDo: true }), nhaGia());
  if (p.status !== 1 || !/^h · câu hỏi 1 · máy đã quyết 2 · đỏ 1 · /m.test(p.stdout)) die(`sổ đỏ phải thoát 1 KÈM dòng tổng kết «đỏ 1»: thoát ${p.status} — ${(p.stdout + p.stderr).slice(0, 240)}`);
});
check('KK-2 chua-cai', () => {
  const l = lenhKiemSo();
  const p = chayLenh(l, khoKhach(), nhaGia({ coBoXep: false }));
  if (p.status === 0 || /^h · câu hỏi/m.test(p.stdout)) die('gói cũ mà vẫn thoát 0 hoặc có dòng tổng kết: ' + p.stdout.slice(0, 240));
  if (!p.stderr.includes('acceptance-gate') || !p.stderr.includes('claude plugin install')) die('thông điệp không nêu gói + lệnh cài: ' + p.stderr.slice(0, 240));
});
// Quét lớp trên trọn SKILL feature-loop: lời gọi node|bash|sh tới một công cụ CÓ trong kit bằng đường chỉ đúng ở kho kit.
const quetTuongDoi = (text, ten) => text.split('\n').flatMap((l, i) => [...l.matchAll(/\b(?:node|bash|sh)\s+["']?(?:\.\/)?((?:[\w-]+\/)?scripts\/[\w.-]+)/g)]
  .filter(m => existsSync(path.join(ROOT, m[1])) || existsSync(path.join(ROOT, 'feature-loop', m[1]))).map(() => `${ten}:${i + 1}`));
check('KK-4 quet-lop', () => { eq(quetTuongDoi(readFileSync(SKILL, 'utf8'), 'SKILL.md'), [], 'SKILL feature-loop gọi công cụ kit bằng đường tương đối'); });
const HINH_KK4 = ['node scripts/can-cu-s1.cjs --root .', 'node ./scripts/can-cu-s1.cjs --root .', 'node feature-loop/scripts/resolve-plugin.mjs --plugin x', 'bash scripts/pre-merge-check.sh .'];
check('KK-4-do', () => {
  const dong = readFileSync(SKILL, 'utf8').split('\n'); const K = 40;
  eq(quetTuongDoi(dong.join('\n'), 'SKILL.md'), [], 'đối chứng dương: bản sao chưa tiêm');
  let n = 0;
  for (const h of HINH_KK4) { const s = [...dong]; s.splice(K, 0, `Chạy \`${h}\`.`); eq(quetTuongDoi(s.join('\n'), 'SKILL.md'), [`SKILL.md:${K + 1}`], `hình «${h}»`); n++; }
  console.log(`    KK-4-do: ${n}/${HINH_KK4.length} hình đỏ đúng dòng`);
  if (n !== 4) die('số hình đỏ ' + n);
});

// ── KK-5..7: thẻ Cổng Phạm vi in ba vế cho hai khối căn cứ ─────────────────────────────────────────────
const dongP = (khoi, attr, id) => { const t = String(khoi || ''); const i = t.indexOf(`${attr}="${id}"`); return i < 0 ? null : t.slice(i, t.indexOf('</p>', i)); };
function kiemHoi(html) {
  const hoi = khoiLab(html, 'Câu chỉ anh trả lời được'); if (!hoi) return ['thiếu khối câu hỏi'];
  const loi = [];
  for (const [nhan, id, khac] of [['Hỏi-1', 'q1', 'q2'], ['Hỏi-2', 'q2', 'q1']]) {
    const p = dongP(hoi, 'data-cau-hoi', nhan); if (!p) { loi.push(`${nhan}: thiếu dòng`); continue; }
    if (!p.includes(W(id).why)) loi.push(`${nhan}: thiếu vì sao`);
    if (!p.includes('sai thì tốn: ' + W(id).cost_if_wrong)) loi.push(`${nhan}: thiếu sai thì tốn`);
    if (p.includes(W(khac).why) || p.includes(W(khac).cost_if_wrong)) loi.push(`${nhan}: lẫn vế của ${khac}`);
    if (!p.includes('máy khuyên') || !p.includes('lối khác')) loi.push(`${nhan}: mất khuyến nghị hoặc lối khác`);
    if (p.includes('khó-đảo') !== (id === 'q2')) loi.push(`${nhan}: nhãn khó-đảo sai câu`);
  }
  return loi;
}
function kiemMayQuyet(html) {
  const mq = khoiLab(html, 'Máy đã quyết ở bước thiết kế — anh lật được'); if (!mq) return ['thiếu khối máy đã quyết'];
  const loi = [];
  for (const id of ['m1', 'm2', 'm3', 'm4']) {
    const p = dongP(mq, 'data-may-quyet', id); if (!p) { loi.push(`${id}: thiếu dòng`); continue; }
    if (!p.includes(W(id).why)) loi.push(`${id}: thiếu vì sao`);
    const g = p.indexOf('sai thì tốn: ' + W(id).cost_if_wrong); if (g < 0) { loi.push(`${id}: thiếu sai thì tốn`); continue; }
    const c = Math.max(p.indexOf('căn cứ: «'), p.indexOf('lối khác chết vì:'));
    if (c < 0) loi.push(`${id}: mất căn cứ hoặc lối chết`); else if (c < g) loi.push(`${id}: giá đứng sau căn cứ`);
    if (p.includes('KHÔNG làm:') !== (id === 'm3' || id === 'm4')) loi.push(`${id}: nhãn KHÔNG làm sai`);
  }
  return loi;
}
function kiemBanRut(j) {
  const cc = j && j.can_cu; if (!cc) return ['bản rút thiếu can_cu'];
  const muc = [...(cc.cau_hoi || []), ...(cc.da_quyet || [])]; const loi = [];
  const mong = { q1: W('q1'), q2: W('q2'), m1: W('m1'), m2: W('m2'), m3: W('m3'), m4: W('m4'), m5: { why: W('m5').why, cost_if_wrong: null } };
  for (const [id, w] of Object.entries(mong)) {
    const m = muc.find(x => x.id === id); if (!m) { loi.push(`${id}: thiếu trong bản rút`); continue; }
    if (m.why !== w.why) loi.push(`${id}: why = ${JSON.stringify(m.why)}`);
    if (m.cost_if_wrong !== w.cost_if_wrong) loi.push(`${id}: cost_if_wrong = ${JSON.stringify(m.cost_if_wrong)}`);
  }
  return loi;
}
function banSaoThe(tu, sang) {
  const d = mkdtempSync(path.join(tmpdir(), 'kk-gc-'));
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(ROOT, x), path.join(d, x), { recursive: true });
  const f = path.join(d, 'scripts', 'gate-card.js'); const t = readFileSync(f, 'utf8');
  if (!t.includes(tu)) die('mũi tiêm thẻ không áp: ' + tu.slice(0, 80));
  writeFileSync(f, t.split(tu).join(sang)); return f;
}
const theBaVe = (gc = GC, them = []) => { const kho = mkHoSoBaVe(); return spawnSync('node', [gc, '--root', kho.r, '--slug', 'h', '--glossary-base', kho.base, ...them], { encoding: 'utf8' }); };
check('KK-5 the-hoi', () => { const h = theBaVe(); if (h.status !== 0) die('thẻ thoát ' + h.status + ': ' + h.stderr.slice(0, 200)); eq(kiemHoi(h.stdout), [], 'khối câu hỏi in ba vế của chính dòng'); });
check('KK-5-do', () => {
  const f = banSaoThe('<b>${esc(d.nhan)}</b> · ${decBaVe(d.e)}', '<b>${esc(d.nhan)}</b> · ${esc(stripMd(d.e.decision || \'\'))}');
  const loi = kiemHoi(theBaVe(f).stdout);
  if (!loi.some(x => x.startsWith('Hỏi-1') && x.includes('vì sao'))) die('dòng câu hỏi in như A2 mà hàm kiểm không nêu Hỏi-1 + vì sao: ' + JSON.stringify(loi));
});
check('KK-6 the-may-quyet', () => { const h = theBaVe(); if (h.status !== 0) die('thẻ thoát ' + h.status); eq(kiemMayQuyet(h.stdout), [], 'khối máy đã quyết in ba vế trước căn cứ'); });
check('KK-6-do', () => {
  const f = banSaoThe(": ''}${decBaVe(d.e)} — ${cu}", ": ''}${esc(stripMd(d.e.decision || ''))} — ${cu}");
  const loi = kiemMayQuyet(theBaVe(f).stdout);
  if (!['m1', 'm2', 'm3', 'm4'].every(id => loi.some(x => x.startsWith(id + ':')))) die('dòng máy quyết in như A2 mà hàm kiểm không nêu đủ mã dòng: ' + JSON.stringify(loi));
});
// Vòng tròn: sổ THẬT của hồ sơ này (ghi bằng khối lệnh DEC-ID-RECIPE của SKILL) — đếm bằng bộ xếp, không từ thẻ.
const chuanChu = x => String(x || '').replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
const chuP = p => chuanChu(p.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
// Vế mong đợi đếm THẲNG từ sổ, không qua bộ xếp mà thẻ gọi (lượt chấm 1, phát hiện trong hợp đồng AC-6): dòng S1 mang
// can_cu mà không dòng SAU nào supersedes nó. Câu chỉ-người-biết mang nhãn Hỏi-<k> theo thứ tự trong sổ.
const SLUG_SO_THAT = 'can-cu-s1-chay-moi-kho';
function kiemSoThat(gc = GC) {
  const en = readFileSync(path.join(ROOT, '_acceptance', SLUG_SO_THAT, 'decisions.jsonl'), 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
  const biThay = new Set(en.map((e, j) => [e.supersedes, j]).filter(([x, j]) => typeof x === 'string' && en.findIndex(e2 => e2.id === x) < j).map(([x]) => x));
  const mong = en.filter(e => e.stage === 'S1' && e.can_cu !== undefined && !biThay.has(e.id));
  if (!mong.length) return ['sổ thật không có dòng S1 mang căn cứ chưa bị thay'];
  const h = spawnSync('node', [gc, '--root', ROOT, '--slug', SLUG_SO_THAT, '--gate', '1'], { encoding: 'utf8' });
  if (h.status !== 0) return ['thẻ thoát ' + h.status];
  const loi = []; let k = 0;
  const soP = cac(h.stdout, /data-cau-hoi="([^"]+)"/g).length + cac(h.stdout, /data-may-quyet="([^"]+)"/g).length;
  if (soP !== mong.length) loi.push(`số dòng hai khối ${soP} ≠ ${mong.length} dòng S1 mang căn cứ chưa bị thay`);
  for (const e of mong) {
    const [attr, khoa] = e.can_cu.nguon === 'chi-nguoi' ? ['data-cau-hoi', `Hỏi-${++k}`] : ['data-may-quyet', e.id];
    const p = dongP(h.stdout, attr, khoa); if (!p) { loi.push(`${e.id}: thiếu dòng trên thẻ`); continue; }
    const why = chuanChu(e.why), gia = chuanChu(e.cost_if_wrong);
    if (!why || !gia) { loi.push(`${e.id}: dòng sổ thiếu vì sao hoặc giá`); continue; }
    const t = chuP(p); if (!t.includes(why) || !t.includes('sai thì tốn: ' + gia)) loi.push(`${e.id}: dòng thẻ thiếu vì sao hoặc giá của chính nó`);
  }
  return loi;
}
check('KK-6 so-that', () => {
  eq(kiemSoThat(), [], 'thẻ ép --gate 1 trên sổ thật: một dòng ba vế cho mỗi dòng S1 mang căn cứ chưa bị thay');
  console.log('    KK-6 so-that: sổ thật ' + SLUG_SO_THAT);
});
check('KK-6-do so-that', () => {
  const f = banSaoThe('const ccMayQuyet = cc.da_quyet;', 'const ccMayQuyet = cc.da_quyet.slice(1);');
  const loi = kiemSoThat(f);
  if (!loi.some(x => x.startsWith('số dòng hai khối')) || !loi.some(x => x.endsWith('thiếu dòng trên thẻ'))) die('thẻ bỏ sót một dòng máy đã quyết mà ca không nêu: ' + JSON.stringify(loi));
});
check('KK-7 thieu-gia', () => {
  const h = theBaVe(); if (h.status !== 0) die('thẻ thoát ' + h.status);
  const mq = khoiLab(h.stdout, 'Máy đã quyết ở bước thiết kế — anh lật được');
  const p5 = dongP(mq, 'data-may-quyet', 'm5'); if (!p5 || !p5.includes('⚠ chưa khai giá nếu sai')) die('m5 thiếu giá mà không có nhãn: ' + p5);
  for (const id of ['m1', 'm2', 'm3', 'm4']) if ((dongP(mq, 'data-may-quyet', id) || '').includes('chưa khai giá')) die(id + ': đủ giá mà mang nhãn');
});
check('KK-7 ban-rut', () => { const h = theBaVe(GC, ['--extract']); if (h.status !== 0) die('bản rút thoát ' + h.status); eq(kiemBanRut(JSON.parse(h.stdout)), [], 'bản rút mang hai vế'); });
check('KK-7-do', () => {
  const f = banSaoThe("const baVeRut = e => ({ why: typeof e.why === 'string' ? e.why : null, ", 'const baVeRut = e => ({ ');
  const loi = kiemBanRut(JSON.parse(theBaVe(f, ['--extract']).stdout));
  if (!loi.some(x => x.includes('why'))) die('bản rút mất why mà hàm kiểm không nêu: ' + JSON.stringify(loi));
});

// ── KK-8: hồ sơ cũ (sổ không có dòng mang can_cu) — thẻ Cổng Phạm vi ép --gate 1 ở gốc vòng == ở đỉnh vòng ──
// Gốc/đỉnh neo LỊCH SỬ khi nhánh vòng đã gộp (merge-base hai cha / cha thứ hai), chưa gộp thì merge-base với nhánh
// chính / cây làm việc. Bản thẻ dựng bằng git archive trọn ba thư mục thẻ nạp; đối chứng dương chứng bộ thư mục đủ.
const NHANH_KK = 'vong/can-cu-s1-chay-moi-kho';
function tamVongKK() {
  const re = new RegExp(`\\tMerge pull request #\\d+ from \\S+/${NHANH_KK.replace(/[/.]/g, m => '\\' + m)}$`);
  const dong = git(ROOT, 'log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n').find(l => re.test(l));
  if (dong) { const m = dong.split('\t')[0]; return { goc: git(ROOT, 'merge-base', `${m}^1`, `${m}^2`), dinh: git(ROOT, 'rev-parse', `${m}^2`), nguon: 'lich-su' }; }
  const chinh = ['origin/main', 'main'].find(r => spawnSync('git', ['-C', ROOT, 'rev-parse', '--verify', '--quiet', r]).status === 0);
  if (!chinh) throw new Error('không tìm được nhánh chính (origin/main | main) để tính gốc vòng');
  // Chưa gộp: gốc = phía upstream (cha thứ hai) của lần gộp upstream GẦN NHẤT trên chuỗi commit chính của nhánh kể từ
  // điểm rẽ (cha commit mở ô); chưa gộp lần nào thì là điểm rẽ. merge-base với nhánh chính sai khi nhánh xếp chồng trên
  // một nhánh chưa gộp (A2, 12/10): nó kéo vật của nhánh dưới vào phép so. Không tìm được commit mở ô → merge-base.
  const mo = git(ROOT, 'log', '--diff-filter=A', '--format=%H', '--', '_acceptance/can-cu-s1-chay-moi-kho/opportunity.md').split('\n').filter(Boolean).pop();
  if (!mo) return { goc: git(ROOT, 'merge-base', 'HEAD', chinh), dinh: null, nguon: 'nhanh' };
  const gopGan = git(ROOT, 'rev-list', '--first-parent', '--merges', '-n', '1', `${mo}..HEAD`);
  return gopGan ? { goc: git(ROOT, 'rev-parse', `${gopGan}^2`), dinh: null, nguon: 'gop-gan' } : { goc: git(ROOT, 'rev-parse', `${mo}^`), dinh: null, nguon: 'diem-re' };
}
const THU_MUC_THE = ['scripts', 'lib', 'skills'];
const banLuu = sha => { const d = mkdtempSync(path.join(tmpdir(), 'kk-luu-')); execFileSync('bash', ['-c', 'git -C "$1" archive "$2" scripts lib skills | tar -x -C "$3"', '_', ROOT, sha, d]); return d; };
const banSaoTu = (goc, tu, sang) => {
  const d = mkdtempSync(path.join(tmpdir(), 'kk-tiem-')); for (const x of THU_MUC_THE) cpSync(path.join(goc, x), path.join(d, x), { recursive: true });
  const f = path.join(d, 'scripts', 'gate-card.js'); const t = readFileSync(f, 'utf8'); if (!t.includes(tu)) throw new Error('mũi tiêm thẻ không áp: ' + tu);
  writeFileSync(f, t.split(tu).join(sang)); return d;
};
const hoSoCu = () => readdirSync(path.join(ROOT, '_acceptance')).filter(x => {
  try { readFileSync(path.join(ROOT, '_acceptance', x, 'contract.md')); return !readFileSync(path.join(ROOT, '_acceptance', x, 'decisions.jsonl'), 'utf8').includes('"can_cu"'); } catch (_) { return false; }
}).sort();
const chayThe = (goc, slug, them) => new Promise(res => {
  const p = spawn('node', [path.join(goc, 'scripts', 'gate-card.js'), '--root', ROOT, '--slug', slug, '--gate', '1', ...them]);
  let o = ''; p.stdout.on('data', c => { o += c; }); p.on('close', code => res(`${code}\n${o}`));
});
async function soThe(gocA, gocB, slugs, { dungKhiLech = false } = {}) {
  const lech = []; let i = 0;
  const tho = async () => {
    while (i < slugs.length && !(dungKhiLech && lech.length)) {
      const x = slugs[i++];
      for (const them of [[], ['--extract']]) {
        const [a, b] = await Promise.all([chayThe(gocA, x, them), chayThe(gocB, x, them)]);
        if (a !== b) { lech.push(x + (them.length ? ' (bản rút)' : '')); break; }
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, tho)); return lech.sort();
}
let KK8;
try {
  const t0 = Date.now(); const tv = tamVongKK(); const ds = hoSoCu();
  const gocA = banLuu(tv.goc); const gocB = tv.dinh ? banLuu(tv.dinh) : ROOT;
  const doiChung = await soThe(banLuu('HEAD'), ROOT, ds.slice(0, 5));
  const lech = await soThe(gocA, gocB, ds);
  const lechTiem = await soThe(gocA, banSaoTu(gocB, 'sai thì tốn: ', 'sai thi ton: '), ds, { dungKhiLech: true });
  KK8 = { tv, n: ds.length, doiChung, lech, lechTiem, giay: ((Date.now() - t0) / 1000).toFixed(1) };
} catch (e) { KK8 = { loi: e.message }; }
check('KK-8 ho-so-cu', () => {
  if (KK8.loi) die(KK8.loi);
  eq(KK8.doiChung, [], 'đối chứng dương: bản lưu trữ HEAD (scripts lib skills) == cây làm việc');
  if (KK8.n < 20) die(`chỉ ${KK8.n} hồ sơ cũ để so — cần ≥ 20`);
  eq(KK8.lech, [], 'thẻ hồ sơ cũ ở gốc vòng == ở đỉnh vòng');
  console.log(`    KK-8: ${KK8.n} hồ sơ · gốc ${KK8.tv.goc.slice(0, 8)} → đỉnh ${KK8.tv.dinh ? KK8.tv.dinh.slice(0, 8) : 'cây làm việc'} (${KK8.tv.nguon}) · ${KK8.giay} s`);
});
check('KK-8-do', () => {
  if (KK8.loi) die(KK8.loi);
  if (!KK8.lechTiem.length) die('thẻ đỉnh đổi chữ «sai thì tốn:» của khối chung mà phép so không nêu hồ sơ nào');
  console.log('    KK-8-do nêu: ' + KK8.lechTiem.join(', '));
});

// ── KK-10: ca CC-06 chọn hồ sơ theo tính chất — kho thử do code sinh, hồ sơ mang can_cu đứng ĐẦU chữ cái ──
function mkKhoTheCu() {
  const r = mkdtempSync(path.join(tmpdir(), 'kk-thecu-')); git(r, 'init', '-q');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n`);
  ghiTep(r, '_acceptance/config.yaml', 'risk_tiers:\n  t3_paths: []\nexecutors:\n  test:\n    x: "true"\n');
  for (const x of ['a-moi', 'b-cu']) { ghiTep(r, `_acceptance/${x}/contract.md`, HD_DRAFT.replace('slug: h', `slug: ${x}`).replace('status: draft', 'status: approved')); ghiTep(r, `_acceptance/${x}/evals.yaml`, EVALS); }
  const s2 = Object.assign(S1('s2', undefined), { stage: 'S2' });
  ghiSoKho(r, 'a-moi', [CN('q1'), S1('m1', MT('CLAUDE.md', Q_GOC)), s2]);
  ghiSoKho(r, 'b-cu', [S1('c1', undefined), S1('c2', undefined), s2]);
  return r;
}
const DOI_TRUOC_HO_SO_DA_QUA = ['a-moi', 'b-cu'];
check('KK-10 chon-theo-tinh-chat', () => {
  const r = mkKhoTheCu(); const chon = chonTheCu(r, DOI_TRUOC_HO_SO_DA_QUA);
  eq(chon.map(x => x[0]), ['b-cu'], 'chỉ chọn hồ sơ đời trước (bỏ hồ sơ mang can_cu đứng đầu)');
  eq(kiemTheCu(r, chon), [], 'đối chứng dương: thẻ hồ sơ đời trước sạch trên thẻ lành');
  const h = spawnSync('node', [GC, '--root', r, '--slug', 'a-moi', '--gate', '1'], { encoding: 'utf8' }).stdout;
  eq([cac(h, /data-cau-hoi="([^"]+)"/g).length, cac(h, /data-may-quyet="([^"]+)"/g).length, ((khoiLab(h, 'Quyết định &amp; trade-off') || '').match(/<p class="li">/g) || []).length], [1, 1, 1], 'a-moi: 1 câu hỏi · 1 máy đã quyết · khối chung còn đúng dòng S2');
  if (h.includes('dòng sổ đời trước')) die('a-moi đã qua Cổng Phạm vi mà mang cờ đời trước');
  const mod = require(MOD);
  const dau = DOI_TRUOC_HO_SO_DA_QUA.find(x => mod.docSo(readFileSync(path.join(r, '_acceptance', x, 'decisions.jsonl'), 'utf8')).entries.some(e => e.stage === 'S1' && e.can_cu === undefined));
  eq(dau, 'b-cu', 'CC-06-do chọn hồ sơ có dòng S1 đời trước');
});
check('KK-10-do', () => {
  const r = mkKhoTheCu();
  const loiCu = kiemTheCu(r, chonTheCu(r, DOI_TRUOC_HO_SO_DA_QUA, { n: 1, locCanCu: false }));
  if (!loiCu.some(x => x.startsWith('a-moi: trade-off đủ dòng'))) die('cách chọn cũ (không lọc can_cu) mà ca không đỏ đúng hình BB1: ' + JSON.stringify(loiCu));
  const f = banSaoThe('if (ccDraft && cc.doi_truoc) flags.push', 'if (cc.doi_truoc) flags.push');
  const loiThe = kiemTheCu(r, [['b-cu', 3]], f);
  if (!loiThe.some(x => x.startsWith('b-cu:') && x.includes('cờ đời trước'))) die('thẻ in cờ đời trước cho hồ sơ đã qua Cổng Phạm vi mà ca không nêu: ' + JSON.stringify(loiThe));
});

console.log(`\nResults: ${passed} passed, ${failed} failed (can-cu-s1)`);
process.exit(failed ? 1 : 0);
