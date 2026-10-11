// can-cu-s1.ca.mjs — ca đo hồ sơ buoc-len-thiet-ke-khong-hoi (CC-02..CC-10). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash) — tệp KHÔNG mang đuôi .test.mjs để không trôi
// giữa các mảnh mjs. Kho thử do code sinh trong lượt (thư mục tạm + git init); giá trị mong đợi viết sẵn
// trong ca, KHÔNG rút từ đầu ra mô-đun. Đường dẫn suy từ vị trí tệp này.
// Chế độ dựng thẻ cho eval nhìn E9: `node tests/scripts/can-cu-s1.ca.mjs --dung-the <thư mục>`.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
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

console.log(`\nResults: ${passed} passed, ${failed} failed (can-cu-s1)`);
process.exit(failed ? 1 : 0);
