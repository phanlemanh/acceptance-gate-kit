// ban-do-khuon-roi-nhom.test.mjs — hồ sơ ban-do-khuon-roi-nhom (V0, mốc kế sau 2.37.0): mục `ngoai_le` không có `khoi`
// là «tệp rời nhóm» — tệp ấy không thuộc nhóm, nên không bị chấm lệch hay nợ cũ theo nhóm ấy.
//
// Luật đo (nếp khuon-doc-ban-do-that.test.mjs):
//  - Kho mẫu do code sinh trong lượt (bộ dựng chung `khuon-loi-kho-mau.mjs`); gọi CHÍNH script của cây đang kiểm.
//  - «Bộ máy gốc» = `git archive <GOC> scripts lib feature-loop skills` bung trong lượt — bản trước vá, chạy trên CÙNG kho
//    mẫu với cây đang kiểm. Kỳ vọng VIẾT TRƯỚC (hằng), không tính từ mã sản phẩm; ca ma trận in «số hàng: N».
//  - Chiều đỏ: mỗi ca «-do» chạy CHÍNH hàm kiểm trên bản sao TRỌN thư mục của cây đang kiểm bị tiêm đúng một nhát, SAU
//    khi bản lành xanh trên cùng fixture; bản sao phải chạy được trước khi tin màu đỏ; ghim thông điệp lỗi.
//  - Tên ca = mã ca của evals.yaml; RN_CASES chọn ca; mã lạ → thoát 2.
//  - Kho mẫu rời nhóm dựng lại HÌNH DẠNG bản đồ của kho thứ hai: một nhóm màn có glob phủ mọi trang, danh sách rời nhóm
//    viết một dòng `[{ tep: "…", ly_do: "…" }, …]`, lý do có dấu phẩy. Tên tệp và tên khối giả.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, thuMuc, khoiMarker, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const DOC = 'scripts/ban-do-khuon.cjs';
const S4 = 'feature-loop/scripts/s4-args.mjs';
const GOC = 'eab2ca4181afd8e1e6a4f3e09f7653a928ece108';   // main sau #476 và #478 — bộ đọc chưa biết rời nhóm
const CA = ['RN-1', 'RN-1-do', 'RN-2', 'RN-3', 'RN-3-do', 'RN-4', 'RN-4-do', 'RN-6'];
const chon = (process.env.RN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`ban-do-khuon-roi-nhom.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);

const require = createRequire(import.meta.url);
const docLai = kit => { const p = path.join(kit, DOC); delete require.cache[require.resolve(p)]; return require(p); };
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
const kiem = (kit, kho, base = 'main') => chay(kit, LENH, ['--kiem', '--root', kho, '--base', base]);
const dong = out => out.split('\n').map(l => l.trim()).filter(Boolean);
const bao = out => dong(out).filter(l => l.startsWith('lệch:') || l.startsWith('nợ cũ:'));
const json = (kit, kho) => { const r = chay(kit, DOC, ['--root', kho, '--json']); return r.ma === 0 ? r.out : `thoát ${r.ma}: ${r.err}`; };

// Bộ máy gốc: bung một lần; phải có đủ lệnh trước khi dùng.
let _goc = null;
function mayGoc() {
  if (_goc) return _goc;
  const d = thuMuc('goc');
  const tar = execFileSync('git', ['-C', KIT, 'archive', GOC, 'scripts', 'lib', 'feature-loop', 'skills'], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  for (const f of [LENH, DOC, S4]) if (!fs.existsSync(path.join(d, f))) throw new Error(`bộ máy gốc ${GOC.slice(0, 8)} thiếu ${f}`);
  return (_goc = d);
}
const caDo = (ma, kiemFn, lanh, saoTiem, thongDiep) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    const song = chay(sao, LENH, ['--root', taoKhoMau(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiemFn(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  ket(ma, loi.some(x => x.includes(thongDiep)) ? [] : [`bản tiêm không cho lỗi «${thongDiep}» (lỗi: ${loi.join(' | ') || 'không có'})`]);
};

// Nhát tiêm (khớp đúng một lần trong bản sao):
const LOC = 'e.khoi === null && e.tep === tep && e.ly_do';
const TIEM_BO_LOC = [`!n.ngoai_le.some(e => ${LOC})`, 'true'];           // RN-1-do, RN-4-do: bỏ phép lọc rời nhóm
const TIEM_MOI_MUC = [LOC, 'e.tep === tep && e.ly_do'];                  // RN-3-do: mục CÓ khoi cũng làm tệp rời nhóm

// ── Kho mẫu rời nhóm: nhóm trang-tam phủ mọi trang, danh sách rời nhóm viết một dòng ───────────────────────────
const ROI = (tep, lyDo) => `{ tep: "${tep}", ly_do: "${lyDo}" }`;
const ROI_GOC = [
  ROI('src/man/bang/DanhSachMau.tsx', 'màn thật, thuộc nhóm bang-du-lieu (hàng 1)'),
  ROI('src/man/bang/Cu.tsx', 'màn thật, thuộc nhóm bang-du-lieu'),
  ROI('src/man/form/NhapMau.tsx', 'màn thật, thuộc nhóm form-nhap'),
  ROI('src/man/form/NoCu.tsx', 'màn thật, thuộc nhóm form-nhap'),
  ROI('src/man/form/Xoa.tsx', 'màn thật, thuộc nhóm form-nhap'),
];
const trangTam = (them = []) => `---
nhom: trang-tam
doi_tuong: [trang-chua-co-man, muc-chua-co-man]
khuon: { ten: TrangTam, nhap: "@/khuon/TrangTam" }
nhan_dien: ["src/**/*.tsx"]
mau_dang_chay: { tep: "src/tam/TamMau.tsx" }
khe_bat_buoc: []
cam_ngoai_khuon: [Hop]
ngoai_le: [${[...ROI_GOC, ...them].join(', ')}]
nhan_viec: giữ chỗ cho trang chưa có màn thật
---
**Dùng khi** trang chưa có màn thật, dựng chỗ giữ. **Không dùng** cho màn đã có nhóm — ghi tệp vào ngoai_le để nó rời nhóm.
`;
const TAM_MAU = `import { TrangTam } from '@/khuon/TrangTam';
export default function TamMau() {
  return <TrangTam />;
}
`;
const manBang = (ten, title = ' title="Trống"') => `import { KhungBang } from '@/khuon/KhungBang';
import { TrangThaiMau } from '@/khuon/TrangThaiMau';
export default function ${ten}() {
  return <KhungBang><TrangThaiMau${title} /></KhungBang>;
}
`;
const THU_AN = `import { Bang } from '@/ui/Bang';
// trang thử ẩn — không dựng khuôn nhóm nào
export default function Thu() {
  return <Bang />;
}
`;
// khoRoi({base, sua, surfaceGlobs}) → kho: main = kho mẫu + trang-tam (+ base); nhánh «roi» ghi các tệp `sua`.
function khoRoi({ base = {}, sua = {}, surfaceGlobs = null } = {}) {
  const kho = taoKhoMau({ surfaceGlobs });
  ghi(kho, 'design/patterns/trang-tam.md', trangTam());
  ghi(kho, 'src/tam/TamMau.tsx', TAM_MAU);
  for (const [f, t] of Object.entries(base)) ghi(kho, f, t);
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'nhóm trang-tam');
  nhanh(kho, 'roi', sua);
  return kho;
}

// ── RN-1: ca đỏ — bộ máy gốc báo, cây đang kiểm im, trên CÙNG lối dựng kho ────────────────────────────────────────
// Ba đường: tệp mới thuộc nhóm thật đã rời trang-tam (đường lệch) · tệp có ở base đã rời trang-tam, nhánh chạm nó (đường
// nợ cũ, hai nhóm) · trang thử ẩn chỉ thuộc trang-tam, đã rời (đường nợ cũ, thiếu khuôn).
const T_MOI = 'src/man/bang/Moi.tsx';
const T_THU = 'src/thu/Thu.tsx';
const T_CU = 'src/man/bang/DanhSachMau.tsx';
const LD_THU = 'trang thử ẩn, không có lối vào; gỡ khi xong đo';
const khoRN1 = () => khoRoi({
  base: { [T_THU]: THU_AN, 'design/patterns/trang-tam.md': trangTam([ROI(T_THU, LD_THU)]) },
  sua: {
    'design/patterns/trang-tam.md': trangTam([ROI(T_THU, LD_THU), ROI(T_MOI, 'màn thật mới, thuộc nhóm bang-du-lieu')]),
    [T_MOI]: manBang('Moi'),
    [T_CU]: manBang('DanhSachMau') + '// nhánh chạm\n',
    [T_THU]: THU_AN + '// nhánh chạm\n',
  },
});
// Viết sẵn: bộ máy gốc thấy ba tệp vẫn thuộc trang-tam.
const RN1_GOC = [
  `lệch: ${T_MOI} · thuộc hai nhóm màn: bang-du-lieu, trang-tam`,
  `nợ cũ: ${T_CU} · thuộc hai nhóm màn: bang-du-lieu, trang-tam`,
  `nợ cũ: ${T_THU} · khuôn TrangTam`,
];
function kiemRN1(kit) {
  const r = kiem(kit, khoRN1());
  const loi = [];
  if (r.ma !== 0) loi.push(`cây đang kiểm thoát ${r.ma} (cần 0)`);
  if (bao(r.out).length) loi.push(`tệp rời nhóm vẫn bị chấm: ${bao(r.out).join(' / ')}`);
  if (dong(r.out).some(l => l.startsWith('sai:'))) loi.push(`sai lược đồ: ${dong(r.out).filter(l => l.startsWith('sai:')).join(' / ')}`);
  return loi;
}
let lanhRN1 = null;
if (want('RN-1') || want('RN-1-do')) lanhRN1 = kiemRN1(KIT);
if (want('RN-1')) {
  const loi = [...lanhRN1];
  // Bản trước vá trên CÙNG lối dựng kho phải báo đúng ba dòng viết sẵn — không thì ca xanh vì kho không bao giờ chạm luật.
  const g = kiem(mayGoc(), khoRN1());
  const ds = bao(g.out);
  if (g.ma !== 1) loi.push(`bộ máy gốc thoát ${g.ma} (cần 1)`);
  for (const x of RN1_GOC) if (!ds.includes(x)) loi.push(`bộ máy gốc thiếu dòng «${x}»`);
  if (ds.length !== RN1_GOC.length) loi.push(`bộ máy gốc in ${ds.length} dòng (cần ${RN1_GOC.length}): ${ds.join(' / ')}`);
  // CLI --json: mục rời nhóm in `"khoi": null` (gốc in ""), mọi trường khác bằng hệt bộ máy gốc.
  const kho = khoRN1();
  const nl = (out, nhom) => { try { return JSON.parse(out).nhom.find(n => n.nhom === nhom).ngoai_le; } catch (_) { return null; } };
  const jc = nl(json(KIT, kho), 'trang-tam');
  const jg = nl(json(mayGoc(), kho), 'trang-tam');
  if (!jc || jc.length !== 7 || jc.some(e => e.khoi !== null)) loi.push(`--json: mục rời nhóm không mang "khoi": null (${JSON.stringify(jc)})`);
  if (!jg || jg.some(e => e.khoi !== '')) loi.push(`--json bộ máy gốc: mục rời nhóm không mang "khoi": "" (${JSON.stringify(jg)}) — đối chứng hỏng`);
  else if (jc && JSON.stringify(jc.map(e => ({ ...e, khoi: '' }))) !== JSON.stringify(jg)) loi.push('--json: mục rời nhóm khác bản gốc ngoài trường khoi');
  ket('RN-1', loi);
}
if (want('RN-1-do')) caDo('RN-1-do', kiemRN1, lanhRN1, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_BO_LOC), 'tệp rời nhóm vẫn bị chấm');

// ── RN-2: rời ĐÚNG nhóm khai nó, ĐÚNG tệp khai, chỉ khi có lý do; nhóm phần tử cũng rời được; tệp rời mọi nhóm màn
// là «ngoài bản đồ» ──────────────────────────────────────────────────────────────────────────────────────────────
const TT = BAN_DO['trang-thai.md'];
if (!TT.includes('ngoai_le: []')) throw new Error('kho mẫu đổi khuôn: không thấy «ngoai_le: []» của trang-thai');
const KHE = 'src/man/bang/Khe.tsx';
const CHUNG = 'src/man/chung/Chung.tsx';
const HANG_RN2 = [
  { ten: 'vẫn chấm theo nhóm thật', sua: {
    'design/patterns/trang-tam.md': trangTam([ROI('src/man/bang/Moi2.tsx', 'màn thật mới, thuộc nhóm bang-du-lieu')]),
    'src/man/bang/Moi2.tsx': "import { Hop } from '@/ui/Hop';\nexport default function Moi2() {\n  return <Hop />;\n}\n",
  }, can: ['lệch: src/man/bang/Moi2.tsx · Hop · nhóm bang-du-lieu · dùng KhungBang.HopLoc', 'lệch: src/man/bang/Moi2.tsx · khuôn KhungBang · nhóm bang-du-lieu'], ma: 1 },
  { ten: 'tệp không khai vẫn thuộc hai nhóm', sua: {
    'design/patterns/trang-tam.md': trangTam([ROI('src/man/bang/Moi2.tsx', 'màn thật mới')]),
    'src/man/bang/Moi2.tsx': manBang('Moi2'),
    'src/man/bang/Moi3.tsx': manBang('Moi3'),
  }, can: ['lệch: src/man/bang/Moi3.tsx · thuộc hai nhóm màn: bang-du-lieu, trang-tam'], ma: 1 },
  { ten: 'mục thiếu ly_do không rời nhóm', sua: {
    'design/patterns/trang-tam.md': trangTam(['{ tep: "src/man/bang/Moi4.tsx" }']),
    'src/man/bang/Moi4.tsx': manBang('Moi4'),
  }, can: ['lệch: src/man/bang/Moi4.tsx · thuộc hai nhóm màn: bang-du-lieu, trang-tam'], sai: 'ngoai_le thiếu ly_do (src/man/bang/Moi4.tsx · rời nhóm)', ma: 1 },
  { ten: 'rời nhóm viết dạng khối', sua: {
    'design/patterns/trang-tam.md': trangTam([ROI(CHUNG, 'màn chung, thuộc nhóm form-nhap')]),
    'design/patterns/bang-du-lieu.md': BAN_DO['bang-du-lieu.md'].replace('ngoai_le:\n', `ngoai_le:\n  - tep: ${CHUNG}\n    ly_do: màn chung, thuộc nhóm form-nhap\n`),
    [CHUNG]: "import { KhungForm } from '@/khuon/KhungForm';\nexport default function Chung() {\n  return <KhungForm />;\n}\n",
  }, can: [], ma: 0 },
  { ten: 'đối chứng: dạng khối không khai', sua: {
    [CHUNG]: "import { KhungForm } from '@/khuon/KhungForm';\nexport default function Chung() {\n  return <KhungForm />;\n}\n",
  }, can: [`lệch: ${CHUNG} · thuộc hai nhóm màn: bang-du-lieu, form-nhap, trang-tam`], ma: 1 },
  { ten: 'rời nhóm phần tử', sua: {
    'design/patterns/trang-tam.md': trangTam([ROI(KHE, 'màn thật mới')]),
    'design/patterns/trang-thai.md': TT.replace('ngoai_le: []', `ngoai_le: [${ROI(KHE, 'ô trạng thái của nhà cung cấp, không theo khuôn')}]`),
    [KHE]: manBang('Khe', ''),
  }, can: [], ma: 0 },
  { ten: 'đối chứng: nhóm phần tử không khai', sua: {
    'design/patterns/trang-tam.md': trangTam([ROI(KHE, 'màn thật mới')]),
    [KHE]: manBang('Khe', ''),
  }, can: [`lệch: ${KHE} · TrangThaiMau thiếu khe title · nhóm trang-thai`], ma: 1 },
  { ten: 'rời mọi nhóm màn là ngoài bản đồ', surfaceGlobs: ['src/**/*.tsx'], sua: {
    'design/patterns/trang-tam.md': trangTam([ROI(T_THU, LD_THU)]),
    [T_THU]: THU_AN,
  }, can: [], ma: 0, ngoai: '1 tệp giao diện ngoài bản đồ' },
];
if (want('RN-2')) {
  console.log(`số hàng: ${HANG_RN2.length}`);
  const loi = [];
  for (const h of HANG_RN2) {
    const r = kiem(KIT, khoRoi({ sua: h.sua, surfaceGlobs: h.surfaceGlobs || null }));
    const ds = bao(r.out);
    if (r.ma !== h.ma) loi.push(`«${h.ten}» thoát ${r.ma} (cần ${h.ma})`);
    if (JSON.stringify(ds) !== JSON.stringify(h.can)) loi.push(`«${h.ten}» in ${JSON.stringify(ds)} (cần ${JSON.stringify(h.can)})`);
    const sai = dong(r.out).filter(l => l.startsWith('sai:'));
    if (h.sai ? !sai.some(l => l.includes(h.sai)) : sai.length) loi.push(`«${h.ten}» dòng sai: ${JSON.stringify(sai)} (cần ${h.sai || 'không có'})`);
    const ngoai = dong(r.out).filter(l => l.endsWith('ngoài bản đồ'));
    if (JSON.stringify(ngoai) !== JSON.stringify(h.ngoai ? [h.ngoai] : [])) loi.push(`«${h.ten}» ngoài bản đồ: ${JSON.stringify(ngoai)} (cần ${h.ngoai || 'không có'})`);
  }
  ket('RN-2', loi);
}

// ── RN-3: đường đọc-cũ — mục CÓ khoi (chuỗi · danh sách một dòng · danh sách khối) và `khoi: []` giữ nguyên hành vi ────
// Mỗi hàng chạy bộ máy gốc và cây đang kiểm trên CÙNG kho: đầu ra --kiem, mã thoát và CLI --json phải bằng hệt, và số dòng
// báo khớp số viết sẵn (hàng có báo thì phép so không rỗng).
const BANG = BAN_DO['bang-du-lieu.md'];
const NL_GOC = 'ngoai_le:\n  - tep: src/man/bang/Cu.tsx\n    khoi: BangTho\n    ly_do: màn cũ chờ dời sang khuôn\n';
if (!BANG.includes(NL_GOC)) throw new Error('kho mẫu đổi khuôn: không thấy khối ngoai_le gốc của bang-du-lieu');
const T3 = 'src/man/bang/Hai.tsx';
const MAN_HAI = "import { KhungBang } from '@/khuon/KhungBang';\nimport { Hop } from '@/ui/Hop';\nimport { BangTho } from '@/ui/BangTho';\nexport default function Hai() {\n  return <KhungBang><Hop /><BangTho /></KhungBang>;\n}\n";
const nlThem = them => BANG.replace(NL_GOC, NL_GOC + them);
const HANG_RN3 = [
  { ten: 'khoi chuỗi · tệp mới', them: `  - tep: ${T3}\n    khoi: Hop\n    ly_do: chờ dời\n`, coBase: false, so: 1 },
  { ten: 'khoi danh sách một dòng · tệp mới', them: `  - tep: ${T3}\n    khoi: [Hop]\n    ly_do: chờ dời\n`, coBase: false, so: 1 },
  { ten: 'khoi danh sách khối · tệp mới', them: `  - tep: ${T3}\n    khoi:\n      - Hop\n    ly_do: chờ dời\n`, coBase: false, so: 1 },
  { ten: 'mapping một dòng · tệp có ở base', them: `  - {tep: ${T3}, khoi: Hop, ly_do: "chờ tải, rồi dời"}\n`, coBase: true, so: 1 },
  { ten: 'khoi: [] rỗng', them: `  - tep: ${T3}\n    khoi: []\n    ly_do: chờ dời\n`, coBase: false, so: 2 },
  { ten: 'khoi: để trống', them: `  - tep: ${T3}\n    khoi:\n    ly_do: chờ dời\n`, coBase: false, so: 2 },
  { ten: 'khoi: "" chuỗi rỗng', them: `  - tep: ${T3}\n    khoi: ""\n    ly_do: chờ dời\n`, coBase: false, so: 2 },
];
function khoRN3(h) {
  const kho = taoKhoMau();
  if (h.coBase) { ghi(kho, T3, MAN_HAI); git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'T3 có ở base'); }
  nhanh(kho, 'doc-cu', { 'design/patterns/bang-du-lieu.md': nlThem(h.them), [T3]: h.coBase ? MAN_HAI + '// nhánh chạm\n' : MAN_HAI });
  return kho;
}
function kiemRN3(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${HANG_RN3.length}`);
  const loi = [];
  for (const h of HANG_RN3) {
    const kho = khoRN3(h);
    const g = kiem(mayGoc(), kho);
    const m = kiem(kit, kho);
    if (bao(g.out).length !== h.so) { loi.push(`«${h.ten}» bộ máy gốc in ${bao(g.out).length} dòng báo (viết sẵn ${h.so}) — fixture không chạm luật`); continue; }
    if (m.out !== g.out || m.ma !== g.ma) loi.push(`«${h.ten}» đầu ra khác bản gốc: ${JSON.stringify(m.out)} (thoát ${m.ma}) ≠ ${JSON.stringify(g.out)} (thoát ${g.ma})`);
    if (json(kit, kho) !== json(mayGoc(), kho)) loi.push(`«${h.ten}» CLI --json khác bản gốc`);
  }
  if (loi.length) loi.unshift('đường đọc-cũ đổi hành vi');
  return loi;
}
let lanhRN3 = null;
if (want('RN-3') || want('RN-3-do')) lanhRN3 = kiemRN3(KIT, want('RN-3'));
if (want('RN-3')) ket('RN-3', lanhRN3);
if (want('RN-3-do')) caDo('RN-3-do', kiemRN3, lanhRN3, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_MOI_MUC), 'đường đọc-cũ đổi hành vi');

// ── RN-4: lưới s4-args — hồ sơ chỉ chạm tệp đã rời nhóm duy nhất của nó không bị đòi eval khuôn ──────────────────
const HD_IMPL = slug => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV_TEST = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: xanh\n    evidence_required: [run_id, exit_code]\n';
const sinhArgs = (kit, kho, slug) => { const out = path.join(thuMuc('args'), 'a.json'); const r = chay(kit, S4, ['--slug', slug, '--root', kho, '--out', out, '--no-carry', '--ag-root', kit]); return { ...r, coTep: fs.existsSync(out) }; };
const HS = 'ho-so-roi';
const khoRN4 = (tep, khai) => khoRoi({ sua: {
  'design/patterns/trang-tam.md': trangTam(khai ? [ROI(tep, LD_THU)] : []),
  [tep]: THU_AN,
  [`_acceptance/${HS}/contract.md`]: HD_IMPL(HS),
  [`_acceptance/${HS}/evals.yaml`]: EV_TEST,
} });
function kiemRN4(kit) {
  const loi = [];
  const a = sinhArgs(kit, khoRN4(T_THU, true), HS);
  if (a.ma !== 0 || !a.coTep) loi.push(`tệp rời nhóm vẫn đòi eval khuôn (thoát ${a.ma}, tệp ${a.coTep}: ${a.err.trim().split('\n').pop()})`);
  // Đối chứng: tệp KHÔNG khai rời nhóm thì lưới vẫn chặn.
  const b = sinhArgs(kit, khoRN4('src/thu/Thu2.tsx', false), HS);
  if (b.ma !== 2 || b.coTep || !b.err.includes(`hồ sơ ${HS} chạm vùng nhóm trang-tam`)) loi.push(`tệp chưa khai mà lưới không chặn (thoát ${b.ma}, tệp ${b.coTep}: ${b.err.trim().split('\n').pop()})`);
  // Cờ «chưa chấm khuôn» của thẻ Cổng Bằng chứng đi qua cùng nhomCuaTep: tệp rời nhóm → không cờ; đối chứng → có cờ.
  const B = docLai(kit);
  const co = kho => (B.theCong2({ root: kho, slug: HS, contractTxt: HD_IMPL(HS), evidenceTxt: '---\nverified_commit: HEAD\n---\n' }) || {}).co;
  const ca = co(khoRN4(T_THU, true));
  if (ca) loi.push(`tệp rời nhóm vẫn bị cờ chưa chấm khuôn: ${ca}`);
  const cb = co(khoRN4('src/thu/Thu2.tsx', false));
  if (!cb || !cb.includes('chưa chấm khuôn')) loi.push(`tệp chưa khai mà thẻ không cắm cờ chưa chấm khuôn (cờ: ${cb})`);
  return loi;
}
let lanhRN4 = null;
if (want('RN-4') || want('RN-4-do')) lanhRN4 = kiemRN4(KIT);
if (want('RN-4')) {
  const loi = [...lanhRN4];
  const g = sinhArgs(mayGoc(), khoRN4(T_THU, true), HS);
  if (g.ma !== 2 || !g.err.includes(`hồ sơ ${HS} chạm vùng nhóm trang-tam`)) loi.push(`bộ máy gốc không chặn hồ sơ chạm tệp rời nhóm (thoát ${g.ma}) — fixture không chạm lưới`);
  const cg = (docLai(mayGoc()).theCong2({ root: khoRN4(T_THU, true), slug: HS, contractTxt: HD_IMPL(HS), evidenceTxt: '---\nverified_commit: HEAD\n---\n' }) || {}).co;
  if (!cg || !cg.includes('chưa chấm khuôn')) loi.push(`bộ máy gốc không cắm cờ chưa chấm khuôn cho tệp rời nhóm (cờ: ${cg}) — fixture không chạm thẻ`);
  ket('RN-4', loi);
}
if (want('RN-4-do')) caDo('RN-4-do', kiemRN4, lanhRN4, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], DOC, ...TIEM_BO_LOC), 'tệp rời nhóm vẫn đòi eval khuôn');

// ── RN-6: khuôn tệp và GUIDE §5.2 nói đúng nghĩa mới — round-trip ví dụ của khuôn qua bộ đọc ───────────────────────
// Ví dụ rút từ khối marker của khuôn tệp lúc chạy, ghép vào nhóm bảng của kho mẫu; bộ đọc phải cho mục không khoi rời nhóm
// và mục có khoi miễn đúng khối. Bộ đọc gốc trên cùng ví dụ phải KHÔNG cho tệp rời nhóm (chiều đỏ của ca).
const KHUON = path.join(KIT, 'skills/acceptance/references/ban-do-khuon-template.md');
function kiemRN6(kit) {
  const loi = [];
  let vd;
  try { vd = khoiMarker(KHUON, 'BAN-DO-KHUON-NGOAI-LE-VI-DU').replaceAll('<nhom>', 'bang').replaceAll('<KhoiCam>', 'BangTho'); }
  catch (e) { return [`khuôn tệp: ${e.message}`]; }
  if (!/^ngoai_le:\n/.test(vd)) return [`khối ví dụ không mở bằng «ngoai_le:»: ${JSON.stringify(vd.slice(0, 40))}`];
  const B = docLai(kit);
  const doc = B.docBanDo(BANG.replace(NL_GOC, vd.endsWith('\n') ? vd : vd + '\n'), 'design/patterns/bang-du-lieu.md');
  if (!doc.nhom || doc.sai.length) return [`ví dụ của khuôn sai lược đồ: ${JSON.stringify(doc.sai)}`];
  const mien = doc.nhom.ngoai_le.filter(e => e.khoi);
  const roi = doc.nhom.ngoai_le.filter(e => !e.khoi);
  if (mien.length !== 1 || roi.length !== 1) return [`ví dụ cần đúng một mục miễn khối và một mục rời nhóm, có ${mien.length} và ${roi.length}`];
  if (roi[0].khoi !== null) loi.push(`ví dụ của khuôn: mục rời nhóm mang khoi ${JSON.stringify(roi[0].khoi)} (cần null)`);
  const bd = { nhom: [doc.nhom] };
  if (B.nhomCuaTep(bd, roi[0].tep).length !== 0) loi.push(`ví dụ của khuôn: mục không khoi không làm ${roi[0].tep} rời nhóm`);
  if (B.nhomCuaTep(bd, mien[0].tep).length !== 1) loi.push(`ví dụ của khuôn: mục có khoi làm ${mien[0].tep} rời nhóm`);
  return loi;
}
function kiemTaiLieu(khuonTxt, guideTxt) {
  const loi = [];
  const lo = khuonTxt.split('<!-- <<<BAN-DO-KHUON-TEMPLATE')[0].replace(/\n/g, ' ');
  if (!/không có `khoi`[^.]*rời nhóm/.test(lo)) loi.push('khuôn tệp: phần lõi không nói «không có `khoi` … rời nhóm»');
  const m = /\*\*Bản đồ khuôn \(`executors\.design\.khuon`\)\.\*\*[\s\S]*?(?=\n\n)/.exec(guideTxt);
  if (!m) loi.push('GUIDE: không thấy đoạn «Bản đồ khuôn (`executors.design.khuon`)»');
  else if (!/`ngoai_le` không có `khoi`[^.]*rời nhóm/.test(m[0].replace(/\n/g, ' '))) loi.push('GUIDE §5.2: đoạn bản đồ khuôn không nói «`ngoai_le` không có `khoi` … rời nhóm»');
  return loi;
}
const docTep = rel => fs.readFileSync(path.join(KIT, rel), 'utf8');
const docGoc = rel => execFileSync('git', ['-C', KIT, 'show', `${GOC}:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const TL = ['skills/acceptance/references/ban-do-khuon-template.md', 'GUIDE.md'];
if (want('RN-6')) {
  const loi = [...kiemRN6(KIT), ...kiemTaiLieu(...TL.map(docTep))];
  // Chiều đỏ: bộ đọc gốc trên ví dụ của khuôn, và hai tài liệu ở bản gốc, đều phải đỏ đúng thông điệp.
  const g = kiemRN6(mayGoc());
  if (!g.some(x => x.includes('không làm') && x.includes('rời nhóm'))) loi.push(`bộ đọc gốc trên ví dụ của khuôn không đỏ (lỗi: ${g.join(' | ') || 'không có'})`);
  const t = kiemTaiLieu(...TL.map(docGoc));
  for (const x of ['khuôn tệp: phần lõi không nói', 'GUIDE §5.2: đoạn bản đồ khuôn không nói']) if (!t.some(y => y.startsWith(x))) loi.push(`tài liệu bản gốc không đỏ «${x}» (lỗi: ${t.join(' | ') || 'không có'})`);
  ket('RN-6', loi);
}

process.exitCode = hong ? 1 : 0;
