// doc-jsx-va-ban-do-hong.test.mjs — hồ sơ doc-jsx-va-ban-do-hong: bộ quét thẻ mở của bước chấm khuôn, và lưới khuôn của
// s4-args khi tệp bản đồ hỏng làm mất nhóm.
//
// Luật đo:
//  - Kho mẫu do code sinh trong lượt (`khuon-loi-kho-mau.mjs`); gọi CHÍNH script của cây đang kiểm như tiến trình con.
//  - «Bộ máy gốc» = `git archive <GOC> scripts lib feature-loop skills` bung trong lượt — bản trước vá, chạy trên CÙNG kho.
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng), không tính từ mã sản phẩm; ca ma trận in «số hàng: N».
//  - Chiều đỏ: mỗi ca «-do» và mỗi nhát của DJ-2 chạy CHÍNH hàm kiểm trên bản sao TRỌN thư mục bị tiêm một nhát (khớp đúng
//    một lần), SAU khi bản lành xanh trên cùng fixture; bản sao phải chạy được; ghim thông điệp của đúng lỗi được tiêm.
//  - Tên ca = mã ca của evals.yaml; DJ_CASES chọn ca; mã lạ → thoát 2.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, thuMuc } from './khuon-loi-kho-mau.mjs';

const GOC = 'c8fa5a65588609b622dc83a9b114d65d2bdc5b47';   // main trước vá
const LENH = 'scripts/design-floor-khuon.mjs';
const DOC = 'scripts/ban-do-khuon.cjs';
const S4 = 'feature-loop/scripts/s4-args.mjs';
const THU_MUC_KIT = ['scripts', 'lib', 'feature-loop', 'skills'];

const NHAT_DJ2 = {
  'DJ-2-do': { hang: 'khe-trong-bieu-thuc', thongDiep: 'khe trong biểu thức con bị tính', tim: "phang += '{}'; j = k; continue;", thay: 'phang += noi.slice(j, k); j = k; continue;' },
  'DJ-2-chuoi': { hang: 'ngoac-trong-chuoi', tim: `if ((c === '"' || c === "'") && !laChuCai(s[j - 1])) {`, thay: 'if (false) {' },
  'DJ-2-mau': { hang: 'chuoi-mau-long', tim: "if (c === '`') { const k = cuoiChuoiMau(s, j); if (k < 0) return -1; j = k; continue; }", thay: '' },
  'DJ-2-cmt': { hang: 'chu-thich-trong-bieu-thuc', tim: "if (c === '/' && s[j + 1] === '*') { const k = s.indexOf('*/', j + 2); if (k < 0) return -1; j = k + 2; continue; }", thay: '' },
  'DJ-2-cmt-the': { hang: 'chu-thich-cap-the', tim: "if (c === '/' && noi[j + 1] === '*') { const k = noi.indexOf('*/', j + 2); if (k < 0) return null; j = k + 2; continue; }", thay: '' },
  'DJ-2-regex': { hang: 'bieu-thuc-chinh-quy-ngoac', tim: "if (c === '/' && MO_REGEX.includes(truocCoNghia(s, j))) {", thay: 'if (false) {' },
  'DJ-2-chia': { hang: 'dau-chia', tim: "if (c === '/' && MO_REGEX.includes(truocCoNghia(s, j))) {", thay: "if (c === '/') {" },
  'DJ-2-kieu': { hang: 'tham-so-kieu', tim: "if (noi[j] === '<') { j = cuoiKieu(noi, j); if (j < 0) return null; }", thay: '' },
  'DJ-2-nhay': { hang: 'jsx-long-hai-nhay', tim: `if ((c === '"' || c === "'") && !laChuCai(s[j - 1])) {`, thay: `if (c === '"' || c === "'") {` },
  'DJ-2-le': { hang: 'jsx-long-nhay-le', tim: 'const k = cuoiChuoi(s, j); if (k > 0) { j = k; continue; }', thay: 'const k = cuoiChuoi(s, j); if (k < 0) return -1; j = k; continue;' },
};
const CA = ['DJ-1', 'DJ-1-do', 'DJ-2', ...Object.keys(NHAT_DJ2), 'DJ-3', 'DJ-3-do', 'DJ-4', 'DJ-4-do', 'DJ-5', 'DJ-5-do', 'DJ-6', 'DJ-6-do', 'DJ-6-do2', 'DJ-7', 'DJ-7-do', 'DJ-8', 'DJ-8-do'];
const chon = (process.env.DJ_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`doc-jsx-va-ban-do-hong.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);

const require = createRequire(import.meta.url);
const docLai = kit => { const p = path.join(kit, DOC); delete require.cache[require.resolve(p)]; return require(p); };
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
let _khoSong = null;
const khoSong = () => (_khoSong ||= taoKhoMau());
// Ca đỏ: bản lành phải xanh trên cùng fixture, bản sao phải chạy được và đỏ với đúng thông điệp ghim.
const caDo = (ma, kiem, lanh, saoTiem, thongDiep) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    const song = chay(sao, LENH, ['--root', khoSong(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiem(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  ket(ma, loi.some(x => x.includes(thongDiep)) ? [] : [`bản tiêm không cho lỗi «${thongDiep}» (lỗi: ${loi.join(' | ') || 'không có'})`]);
};
const banSao = (tep, tim, thay) => banSaoTiem(THU_MUC_KIT, tep, tim, thay);

// Bộ máy gốc: bung một lần.
let _goc = null;
const goc = () => {
  if (_goc) return _goc;
  const d = thuMuc('goc');
  const tar = execFileSync('git', ['-C', KIT, 'archive', GOC, ...THU_MUC_KIT], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  for (const f of [LENH, DOC, S4]) if (!fs.existsSync(path.join(d, f))) throw new Error(`bộ máy gốc ${GOC.slice(0, 8)} thiếu ${f}`);
  return (_goc = d);
};

// ── Kho chấm khe: nhóm phần tử trang-thai đòi cả title và children ───────────────────────────────────────────────
function khoKhe() {
  const kho = taoKhoMau();
  const p = 'design/patterns/trang-thai.md';
  const t = fs.readFileSync(path.join(kho, p), 'utf8');
  if (!t.includes('khe_bat_buoc: [title]')) throw new Error('kho mẫu đổi: không thấy khe_bat_buoc của trang-thai');
  ghi(kho, p, t.replace('khe_bat_buoc: [title]', 'khe_bat_buoc: [title, children]'));
  git(kho, 'commit', '-qam', 'đòi hai khe');
  return kho;
}
const manThe = the => `import { TrangThaiMau } from '@/khuon/TrangThaiMau';\nexport default function The() { return ${the}; }\n`;
const TEP_THE = 'src/man/khac/The.tsx';
const kiemKho = (kit, kho) => chay(kit, LENH, ['--kiem', '--root', kho, '--base', 'main']);
const dongRa = r => r.out.split('\n').filter(Boolean);

// ── DJ-1: hai chiều trên CÙNG một thẻ ────────────────────────────────────────────────────────────────────────────
const THE_DJ1 = '<TrangThaiMau onClose={() => dong()} title="x" />';
function kiemDJ1(kit, laGoc) {
  const kho = khoKhe();
  nhanh(kho, 'dj1', { [TEP_THE]: manThe(THE_DJ1) });
  const r = kiemKho(kit, kho);
  const coTitle = r.out.includes('thiếu khe title');
  const coChildren = r.out.includes('thiếu khe children');
  const loi = [];
  if (r.ma !== 1) loi.push(`thoát ${r.ma} (cần 1): ${r.out}${r.err}`);
  if (laGoc ? !(coTitle && !coChildren) : !(!coTitle && coChildren)) loi.push(`thẻ có mũi tên đọc sai (báo thiếu title: ${coTitle}, báo thiếu children: ${coChildren})`);
  return loi;
}
if (want('DJ-1') || want('DJ-1-do')) {
  const lanh = [...kiemDJ1(goc(), true).map(x => `bộ máy gốc: ${x}`), ...kiemDJ1(KIT, false)];
  if (want('DJ-1')) ket('DJ-1', lanh);
  if (want('DJ-1-do')) caDo('DJ-1-do', k => kiemDJ1(k, false), lanh, () => banSao(DOC, 'const k = cuoiNgoac(noi, j); if (k < 0) return null;', 'const k = j + 1; if (k < 0) return null;'), 'thẻ có mũi tên đọc sai');
}

// ── DJ-2: ma trận viết sẵn — khe đòi: title, children ────────────────────────────────────────────────────────────
const BAN_DO_K = `---
nhom: k
doi_tuong: phần tử k
don_vi: phan-tu
khuon: {ten: K, nhap: "@/khuon/K"}
nhan_dien: ["src/k/**/*.tsx"]
mau_dang_chay: {tep: src/k/Mau.tsx}
khe_bat_buoc: [title, children]
cam_ngoai_khuon: []
ngoai_le: []
nhan_viec: x
---
## Dùng khi
x
## Không dùng
y
`;
const HANG_DJ2 = [
  ['mui-ten-truoc-co-con', '<K f={() => d()} title="x">c</K>', []],
  ['mui-ten-truoc-tu-dong', '<K f={() => d()} title="x" />', ['children']],
  ['mui-ten-sau-co-con', '<K title="x" f={() => d()}>c</K>', []],
  ['mui-ten-sau-tu-dong', '<K title="x" f={() => d()} />', ['children']],
  ['khe-vang-co-con', '<K f={() => d()}>c</K>', ['title']],
  ['khe-vang-tu-dong', '<K f={() => d()} />', ['title', 'children']],
  ['khe-trong-bieu-thuc', '<K f={() => <b title="y">z</b>}>c</K>', ['title']],
  ['khe-trong-chuoi', '<K hint="a title > b">c</K>', ['title']],
  ['so-sanh', '<K on={a > b} title="x">c</K>', []],
  ['mui-ten-chua-tu-dong-co-con', '<K f={() => <b/>} title="x">c</K>', []],
  ['mui-ten-chua-tu-dong-tu-dong', '<K f={() => <b>y</b>} title="x" />', ['children']],
  ['ngoac-trong-chuoi', '<K a={"}"} title="x">c</K>', []],
  ['chuoi-mau-long', '<K c={`a } > ${b > 1 ? 1 : 0} d`} title="x">c</K>', []],
  ['jsx-long-mot-nhay', "<K a={<p>it's</p>} title=\"x\">c</K>", []],
  ['jsx-long-hai-nhay', "<K a={<p>it's</p>} title=\"x\" b={<p>Bob's</p>} />", ['children']],
  ['jsx-long-nhay-le', "<K a={<p>rock 'n roll</p>} title=\"x\">c</K>", []],
  ['bieu-thuc-chinh-quy-ngoac', '<K p={/} >/} title="x">c</K>', []],
  ['dau-chia', '<K w={a / 2} title="x" h={b / 2} />', ['children']],
  ['chu-thich-cap-the', '<K /* a > b */ title="x">c</K>', []],
  ['chu-thich-trong-bieu-thuc', "<K a={/* it's }\n > */ 1} title=\"x\">c</K>", []],
  ['tham-so-kieu', '<K<Hang> title="x">c</K>', []],
  ['tham-so-kieu-mui-ten', '<K<() => void> title="x" />', ['children']],
  ['nhieu-dong', '<K\n  f={() => {\n    d();\n  }}\n  title="x"\n/>', ['children']],
  ['khe-tran', '<K title f={() => d()} />', ['children']],
];
const GOI_DJ2 = { 'khe-trong-bieu-thuc': 'khe trong biểu thức con bị tính' };
const manK = the => `import { K } from '@/khuon/K';\nexport default function M() { return ${the}; }\n`;
function kiemDJ2(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${HANG_DJ2.length}`);
  const B = docLai(kit);
  const n = B.docBanDo(BAN_DO_K, 'k.md').nhom;
  const loi = [];
  for (const [ten, the, can] of HANG_DJ2) {
    const r = B.lechTrongTep(n, 'src/k/M.tsx', manK(the));
    const thay = r.lech.filter(x => x.loai === 'khe').map(x => x.khoi.replace('K thiếu khe ', ''));
    if (JSON.stringify(thay) !== JSON.stringify(can) || r.khong_do.length) loi.push(`hàng ${ten}: ${GOI_DJ2[ten] || 'sai khe'} — cần [${can}], được [${thay}], không đo [${r.khong_do}]`);
  }
  return loi;
}
if (want('DJ-2') || Object.keys(NHAT_DJ2).some(want)) {
  const lanh = kiemDJ2(KIT, want('DJ-2'));
  if (want('DJ-2')) ket('DJ-2', lanh);
  for (const [ma, x] of Object.entries(NHAT_DJ2)) if (want(ma)) caDo(ma, kiemDJ2, lanh, () => banSao(DOC, x.tim, x.thay), `hàng ${x.hang}: ${GOI_DJ2[x.hang] || 'sai khe'}`);
}

// ── DJ-3: spread cấp thẻ và spread trong giá trị ─────────────────────────────────────────────────────────────────
function kiemDJ3(kit) {
  const B = docLai(kit);
  const n = B.docBanDo(BAN_DO_K, 'k.md').nhom;
  const loi = [];
  const a = B.lechTrongTep(n, 'src/k/M.tsx', manK('<K f={() => d()} {...rest}>c</K>'));
  if (JSON.stringify(a.khong_do) !== '["thẻ mang spread"]' || a.lech.length) loi.push(`spread cấp thẻ không vào nhóm không đo (không đo [${a.khong_do}], ${a.lech.length} lệch)`);
  const b = B.lechTrongTep(n, 'src/k/M.tsx', manK('<K style={{...s}}>c</K>'));
  const khoi = b.lech.map(x => x.khoi);
  if (b.khong_do.length || JSON.stringify(khoi) !== '["K thiếu khe title"]') loi.push(`spread trong giá trị bị coi là spread cấp thẻ (không đo [${b.khong_do}], lệch [${khoi}])`);
  return loi;
}
if (want('DJ-3') || want('DJ-3-do')) {
  const lanh = kiemDJ3(KIT);
  if (want('DJ-3')) ket('DJ-3', lanh);
  if (want('DJ-3-do')) caDo('DJ-3-do', kiemDJ3, lanh, () => banSao(DOC, 'if (/^\\{\\s*\\.\\.\\./.test(noi.slice(j, k))) spread = true;', ''), 'spread cấp thẻ không vào nhóm không đo');
}

// ── DJ-4: thẻ không đọc hết → không đo, không suy đoán ───────────────────────────────────────────────────────────
// Danh sách «theo khuôn» của CHÍNH bước chấm của bản đang kiểm (nạp hàm trong tiến trình con — hàm kiểm là đồng bộ).
const theoKhuon = (kit, kho) => {
  const ma = `import { pathToFileURL } from 'node:url'; const { chamKho } = await import(pathToFileURL(${JSON.stringify(path.join(kit, LENH))}).href); console.log(JSON.stringify(chamKho(${JSON.stringify(kho)}, 'main').theo_khuon));`;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', ma], { encoding: 'utf8' }));
};
const HANG_DJ4 = [
  ['hết tệp', `import { TrangThaiMau } from '@/khuon/TrangThaiMau';\nexport default () => (<TrangThaiMau title="x"\n`],
  ['ngoặc hụt', manThe('<TrangThaiMau a={ x title="x">c</TrangThaiMau>')],
];
function kiemDJ4(kit) {
  const loi = [];
  for (const [ten, noi] of HANG_DJ4) {
    const kho = khoKhe();
    nhanh(kho, 'dj4', { [TEP_THE]: noi });
    const r = kiemKho(kit, kho);
    const dong = dongRa(r);
    if (r.ma !== 0) loi.push(`${ten}: thoát ${r.ma} (cần 0)`);
    if (r.out.includes('thiếu khe')) loi.push(`${ten}: có dòng thiếu khe trên thẻ dở`);
    if (!dong.includes(`không đo được: ${TEP_THE} — thẻ không đọc được`)) loi.push(`${ten}: thẻ dở không báo không đo (${dong.join(' / ')})`);
    if (theoKhuon(kit, kho).includes(TEP_THE)) loi.push(`${ten}: tệp thẻ dở được đếm theo khuôn`);
  }
  return loi;
}
if (want('DJ-4') || want('DJ-4-do')) {
  const lanh = kiemDJ4(KIT);
  if (want('DJ-4')) ket('DJ-4', lanh);
  if (want('DJ-4-do')) caDo('DJ-4-do', kiemDJ4, lanh, () => banSao(DOC, "if (!the) { if (!khong_do.includes(THE_DO)) khong_do.push(THE_DO); continue; }", 'if (!the) continue;'), 'thẻ dở không báo không đo');
}

// ── DJ-5: đối chứng hồi quy — thẻ không có dấu lớn hơn trong giá trị ─────────────────────────────────────────────
const HANG_DJ5 = ['<TrangThaiMau title="x">c</TrangThaiMau>', '<TrangThaiMau>c</TrangThaiMau>', '<TrangThaiMau title="x" />', '<TrangThaiMau title />'];
function kiemDJ5(kit) {
  const loi = [];
  let tong = 0;
  HANG_DJ5.forEach((the, i) => {
    const kho = khoKhe();
    nhanh(kho, `dj5-${i}`, { [TEP_THE]: manThe(the) });
    const g = kiemKho(goc(), kho);
    const c = kiemKho(kit, kho);
    tong += dongRa(g).filter(l => l.startsWith('lệch:')).length;
    if (g.ma !== c.ma || g.out !== c.out) loi.push(`hàng ${the}: khác bộ máy gốc (gốc thoát ${g.ma}: ${g.out} | cây thoát ${c.ma}: ${c.out})`);
  });
  if (tong < 1) loi.push('phép so rỗng: bộ máy gốc không có dòng lệch nào');
  return loi;
}
if (want('DJ-5') || want('DJ-5-do')) {
  const lanh = kiemDJ5(KIT);
  if (want('DJ-5')) ket('DJ-5', lanh);
  if (want('DJ-5-do')) caDo('DJ-5-do', kiemDJ5, lanh, () => banSao(DOC, 'tuDong: /\\/\\s*$/.test(phang)', 'tuDong: false'), 'khác bộ máy gốc');
}

// ── DJ-6…8: lưới khuôn của s4-args khi bản đồ hỏng ───────────────────────────────────────────────────────────────
const TEP_RIENG = 'design/patterns/rieng.md';
const banDoRieng = ({ ngoaiLe = '[]', mau = '{tep: docs/README.md}', boNhanDien = false } = {}) => `---
nhom: rieng
doi_tuong: màn riêng
khuon: {ten: KhungRieng, nhap: "@/khuon/KhungRieng"}
${boNhanDien ? '' : 'nhan_dien: ["src/rieng/**/*.tsx"]\n'}mau_dang_chay: ${mau}
khe_bat_buoc: []
cam_ngoai_khuon: []
ngoai_le: ${ngoaiLe}
nhan_viec: x
---
## Dùng khi
x
## Không dùng
y
`;
const HD = slug => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV_TEST = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: xanh\n    evidence_required: [run_id, exit_code]\n';
const EV_KHUON = EV_TEST + '  - id: E2\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.design.khuon\n    expected: exit 0\n    evidence_required: [run_id, exit_code]\n';
const MAN_RIENG = "import { KhungRieng } from '@/khuon/KhungRieng';\nexport default function Moi() { return <KhungRieng />; }\n";
function khoRieng() {
  const kho = taoKhoMau();
  ghi(kho, TEP_RIENG, banDoRieng());
  git(kho, 'add', '-A');
  git(kho, 'commit', '-qm', 'nhóm rieng');
  return kho;
}
let seq = 0;
// hoSo(kho, banDo, cham, evals) — một nhánh, một hồ sơ; cham: tệp giao diện trong vùng nhóm, hay tệp docs.
function hoSo(kho, banDo, cham, evals) {
  const slug = `ho-so-${++seq}`;
  nhanh(kho, slug, {
    ...(banDo === null ? {} : { [TEP_RIENG]: banDo }),
    [`_acceptance/${slug}/contract.md`]: HD(slug),
    [`_acceptance/${slug}/evals.yaml`]: evals,
    ...(cham ? { 'src/rieng/Moi.tsx': MAN_RIENG } : { 'docs/ghi-chu.md': `# ${slug}\n` }),
  });
  return slug;
}
const sinhArgs = (kit, kho, slug) => { const out = path.join(thuMuc('args'), 'a.json'); const r = chay(kit, S4, ['--slug', slug, '--root', kho, '--out', out, '--no-carry', '--ag-root', kit]); return { ...r, coTep: fs.existsSync(out) }; };

const LOI_MAT_NHOM = [
  ['không frontmatter', '# chỉ có chữ\n', 'không có frontmatter YAML'],
  ['YAML hỏng', '---\nnhom: rieng\nnhan_dien: ["src/rieng/**/*.tsx"\n---\nx\n', 'YAML không đọc được'],
  ['không mapping', '---\n- a\n- b\n---\nx\n', 'frontmatter không phải mapping'],
  ['thiếu nhan_dien', banDoRieng({ boNhanDien: true }), 'thiếu khoá nhan_dien'],
];
function kiemDJ6Cay(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${LOI_MAT_NHOM.length * 2}`);
  const loi = [];
  for (const [ten, banDo, lyDo] of LOI_MAT_NHOM) for (const cham of [true, false]) {
    const kho = khoRieng();
    const a = sinhArgs(kit, kho, hoSo(kho, banDo, cham, EV_TEST));
    const nhan = `${ten} × ${cham ? 'chạm vùng thiếu eval' : 'không chạm'}`;
    if (a.ma !== 2 || a.coTep) loi.push(`${nhan}: bản đồ hỏng mà vẫn sinh args (thoát ${a.ma}, tệp ${a.coTep}: ${a.err.trim().split('\n').pop()})`);
    else if (!a.err.includes(TEP_RIENG) || !a.err.includes(lyDo)) loi.push(`${nhan}: không gọi tên tệp và lý do «${lyDo}»: ${a.err.trim()}`);
    else if (a.err.includes('chạm vùng nhóm')) loi.push(`${nhan}: ra thông điệp lưới cũ thay vì lý do bản đồ: ${a.err.trim()}`);
  }
  return loi;
}
function kiemDJ6Goc() {
  const loi = [];
  const k0 = khoRieng();
  const lanh = sinhArgs(goc(), k0, hoSo(k0, null, true, EV_TEST));
  if (lanh.ma !== 2 || !lanh.err.includes('chạm vùng nhóm rieng')) loi.push(`đối chứng bản đồ lành: bộ máy gốc thoát ${lanh.ma}: ${lanh.err.trim().split('\n').pop()}`);
  for (const [ten, banDo] of LOI_MAT_NHOM) {
    const kho = khoRieng();
    const a = sinhArgs(goc(), kho, hoSo(kho, banDo, true, EV_TEST));
    if (a.ma !== 0 || !a.coTep) loi.push(`đối chứng ${ten}: bộ máy gốc thoát ${a.ma}, tệp ${a.coTep}: ${a.err.trim().split('\n').pop()}`);
  }
  return loi;
}
if (want('DJ-6') || want('DJ-6-do') || want('DJ-6-do2')) {
  const lanh = [...kiemDJ6Goc(), ...kiemDJ6Cay(KIT, want('DJ-6'))];
  if (want('DJ-6')) ket('DJ-6', lanh);
  if (want('DJ-6-do')) caDo('DJ-6-do', kiemDJ6Cay, lanh, () => banSao(S4, 'if (matNhom.length) die(', 'if (false) die('), 'bản đồ hỏng mà vẫn sinh args');
  if (want('DJ-6-do2')) caDo('DJ-6-do2', kiemDJ6Cay, lanh, () => banSao(S4, 'if (matNhom.length) die(', "if (matNhom.length && evals.some(e => e.ref === 'config:executors.design.khuon')) die("), 'bản đồ hỏng mà vẫn sinh args');
}

const LOI_KHONG_MAT = [
  ['ngoại lệ trỏ tệp vắng', banDoRieng({ ngoaiLe: '[{tep: src/vang.tsx, khoi: Hop, ly_do: cũ}]' }), 'ngoai_le trỏ tệp không có: src/vang.tsx'],
  ['màn mẫu vắng', banDoRieng({ mau: '{tep: src/vang2.tsx}' }), 'mau_dang_chay.tep không có: src/vang2.tsx'],
  ['ngoại lệ thiếu lý do', banDoRieng({ ngoaiLe: '[{tep: docs/README.md, khoi: Hop}]' }), 'ngoai_le thiếu ly_do'],
];
const dongBao = a => a.err.split('\n').filter(l => l.includes('bản đồ khuôn có lỗi'));
function kiemDJ7(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${LOI_KHONG_MAT.length * 3 + 2}`);
  const loi = [];
  for (const [ten, banDo, lyDo] of LOI_KHONG_MAT) {
    const k1 = khoRieng();
    const a = sinhArgs(kit, k1, hoSo(k1, banDo, false, EV_TEST));
    if (a.ma !== 0 || !a.coTep) loi.push(`${ten} × không chạm: lỗi không mất nhóm bị chặn (thoát ${a.ma}: ${a.err.trim().split('\n').pop()})`);
    else { const d = dongBao(a); if (d.length !== 1 || !d[0].includes(lyDo)) loi.push(`${ten} × không chạm: cần đúng một dòng báo chứa «${lyDo}», được [${d.join(' / ')}]`); }

    const k2 = khoRieng();
    const b = sinhArgs(kit, k2, hoSo(k2, banDo, true, EV_KHUON));
    if (b.ma !== 0 || !b.coTep) loi.push(`${ten} × chạm có eval: lỗi không mất nhóm bị chặn (thoát ${b.ma}: ${b.err.trim().split('\n').pop()})`);
    const ch = kiemKho(kit, k2);
    if (ch.ma !== 1 || !dongRa(ch).some(l => l.startsWith('sai:') && l.includes(lyDo))) loi.push(`${ten} × chạm có eval: bước chấm không báo lỗi (thoát ${ch.ma}: ${ch.out})`);

    const k3 = khoRieng();
    const c = sinhArgs(kit, k3, hoSo(k3, banDo, true, EV_TEST));
    if (c.ma !== 2 || c.coTep || !c.err.includes('chạm vùng nhóm rieng')) loi.push(`${ten} × chạm thiếu eval: lưới có sẵn mất (thoát ${c.ma}: ${c.err.trim().split('\n').pop()})`);
  }
  const k4 = khoRieng();
  const d = sinhArgs(kit, k4, hoSo(k4, null, false, EV_TEST));
  if (d.ma !== 0 || !d.coTep || dongBao(d).length) loi.push(`bản đồ lành × không chạm: thoát ${d.ma}, dòng báo [${dongBao(d).join(' / ')}]`);
  const k5 = khoRieng();
  const e = sinhArgs(kit, k5, hoSo(k5, null, true, EV_KHUON));
  if (e.ma !== 0 || !e.coTep || dongBao(e).length) loi.push(`bản đồ lành × chạm có eval: thoát ${e.ma}, dòng báo [${dongBao(e).join(' / ')}]`);
  return loi;
}
if (want('DJ-7') || want('DJ-7-do')) {
  const lanh = kiemDJ7(KIT, want('DJ-7'));
  if (want('DJ-7')) ket('DJ-7', lanh);
  if (want('DJ-7-do')) caDo('DJ-7-do', kiemDJ7, lanh, () => banSao(S4, 'const matNhom = bd.mat_nhom || [];', 'const matNhom = bd.sai;'), 'lỗi không mất nhóm bị chặn');
}

function kiemDJ8(kit) {
  const loi = [];
  const kho = khoRieng();
  nhanh(kho, 'dj8', { [TEP_RIENG]: '# hỏng\n' });
  const a = chay(goc(), DOC, ['--root', kho, '--json']);
  const b = chay(kit, DOC, ['--root', kho, '--json']);
  if (a.ma !== 0 || a.out !== b.out || b.ma !== 0 || 'mat_nhom' in JSON.parse(b.out)) loi.push(`JSON của bộ đọc đổi hình dạng (gốc thoát ${a.ma}, cây thoát ${b.ma}, ${a.out === b.out ? 'bằng' : 'khác'})`);
  const k0 = taoKhoMau({ coBanDo: false });
  const c = sinhArgs(kit, k0, (() => { const slug = `ho-so-${++seq}`; nhanh(k0, slug, { [`_acceptance/${slug}/contract.md`]: HD(slug), [`_acceptance/${slug}/evals.yaml`]: EV_TEST, 'src/rieng/Moi.tsx': MAN_RIENG }); return slug; })());
  if (c.ma !== 0 || !c.coTep || c.err.includes('bản đồ khuôn')) loi.push(`kho không khai bản đồ: thoát ${c.ma}, ${c.err.trim().split('\n').pop()}`);
  return loi;
}
if (want('DJ-8') || want('DJ-8-do')) {
  const lanh = kiemDJ8(KIT);
  if (want('DJ-8')) ket('DJ-8', lanh);
  if (want('DJ-8-do')) caDo('DJ-8-do', kiemDJ8, lanh, () => banSao(DOC, 'sai: bd.sai, canh_bao: bd.canh_bao }, null, 2)', 'sai: bd.sai, mat_nhom: bd.mat_nhom, canh_bao: bd.canh_bao }, null, 2)'), 'JSON của bộ đọc đổi hình dạng');
}

process.exitCode = hong ? 1 : 0;
