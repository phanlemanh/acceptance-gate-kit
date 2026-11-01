// khuon-loi-kho-mau.mjs — dựng kho mẫu cho bộ kiểm hồ sơ khuon-loi (không tự chạy; không đuôi .test.mjs).
//
// Kho mẫu = kho git tạm do code sinh trong lượt: ba nhóm hình dạng rút từ hai kho thử — nhóm màn YAML khối
// (`bang-du-lieu`, có `cam_ho` và `thay_cho`), nhóm màn YAML một dòng (`form-nhap`, thân viết «**Dùng khi:**»), nhóm
// phần tử (`trang-thai`, `khe_bat_buoc: [title]`). Tên khối và tên tệp là tên giả. Đường dẫn suy từ vị trí tệp này.
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'khuon-loi-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
export const thuMuc = p => { const d = path.join(TMP, `${p}-${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
export const ghi = (root, rel, txt) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
export const git = (root, ...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

export const BAN_DO = {
  'bang-du-lieu.md': `---
nhom: bang-du-lieu
doi_tuong: màn liệt kê nhiều bản ghi cùng loại
khuon:
  ten: KhungBang
  nhap: "@/khuon/KhungBang"   # khuôn bảng
nhan_dien:
  - "src/man/bang/**/*.tsx"
  - 'src/man/chung/**/*.tsx'
mau_dang_chay:
  tep: src/man/bang/DanhSachMau.tsx
khe_bat_buoc: []
cam_ngoai_khuon:
  - Hop
  - BangTho
cam_ho:
  - Hop
thay_cho:
  Hop: KhungBang.HopLoc
ngoai_le:
  - tep: src/man/bang/Cu.tsx
    khoi: BangTho
    ly_do: màn cũ chờ dời sang khuôn
nhan_viec: tra cứu nhiều bản ghi
---

## Dùng khi

Màn liệt kê nhiều bản ghi cùng loại. Có lọc và phân trang.

## Không dùng

Màn chi tiết một bản ghi — dùng khuôn form.

## Ví dụ sai

\`<BangTho />\` dựng thẳng bảng trần.
`,
  'form-nhap.md': `---
nhom: form-nhap
doi_tuong: màn nhập một bản ghi
khuon: {ten: KhungForm, nhap: "@/khuon/KhungForm"}
nhan_dien: ["src/man/form/**/*.tsx", "src/man/chung/**/*.tsx"]
mau_dang_chay: {tep: src/man/form/NhapMau.tsx}
khe_bat_buoc: []
cam_ngoai_khuon: [Hop, FormTho]
ngoai_le: []
nhan_viec: nhập một bản ghi
---
**Dùng khi:** màn nhập hay sửa một bản ghi. Một cột.
**Không dùng:** màn liệt kê — dùng khuôn bảng.
`,
  'trang-thai.md': `---
nhom: trang-thai
doi_tuong: ô trạng thái trống, lỗi, đang tải
don_vi: phan-tu
khuon: {ten: TrangThaiMau, nhap: "@/khuon/TrangThaiMau"}
nhan_dien: ["src/man/**/*.tsx"]
mau_dang_chay: {tep: src/man/bang/DanhSachMau.tsx}
khe_bat_buoc: [title]
cam_ngoai_khuon: [ODong]
ngoai_le: []
nhan_viec: báo trạng thái dữ liệu
---
## Dùng khi
Ô báo trống, lỗi hay đang tải trong màn.
## Không dùng
Thông báo toàn trang.
`,
};

export const MAN_BANG = `import { KhungBang } from '@/khuon/KhungBang';
import { TrangThaiMau } from '@/khuon/TrangThaiMau';
export default function DanhSachMau() {
  return <KhungBang><TrangThaiMau title="Trống" /></KhungBang>;
}
`;
export const MAN_FORM = `import { KhungForm } from '@/khuon/KhungForm';
// màn nhập mẫu
export default function NhapMau() {
  return <KhungForm />;
}
`;
export const MAN_NO_CU = `import { KhungForm } from '@/khuon/KhungForm';
import { Hop } from '@/ui/Hop';
// dòng chú thích sẽ bị xoá ở một hàng
export default function NoCu() {
  return <KhungForm><Hop /></KhungForm>;
}
`;

// taoKhoMau({coBanDo, typeModule, surfaceGlobs}) → gốc kho (nhánh main, một commit).
export function taoKhoMau(opts = {}) {
  const { coBanDo = true, typeModule = false, surfaceGlobs = null } = opts;
  const root = thuMuc('kho');
  git(root, 'init', '-q', '-b', 'main');
  git(root, 'config', 'user.email', 'ca@kho.mau');
  git(root, 'config', 'user.name', 'Ca Kho Mau');
  git(root, 'config', 'commit.gpgsign', 'false');
  ghi(root, 'package.json', JSON.stringify(typeModule ? { name: 'kho-mau', type: 'module' } : { name: 'kho-mau' }) + '\n');
  ghi(root, 'docs/README.md', '# kho mẫu\n');
  ghi(root, 'src/man/bang/DanhSachMau.tsx', MAN_BANG);
  ghi(root, 'src/man/bang/Cu.tsx', MAN_BANG.replace('DanhSachMau', 'Cu'));
  ghi(root, 'src/man/form/NhapMau.tsx', MAN_FORM);
  ghi(root, 'src/man/form/NoCu.tsx', MAN_NO_CU);
  ghi(root, 'src/man/form/Xoa.tsx', MAN_FORM.replace('NhapMau', 'Xoa'));
  const cfg = ['schema_version: 1'];
  if (surfaceGlobs) cfg.push('design:', `  surface_globs: [${surfaceGlobs.map(g => `"${g}"`).join(', ')}]`);
  cfg.push('executors:', '  test:', '    x: "true"', '  design:', '    khuon: "node design-floor-khuon.mjs --kiem --root ."', 'feature_loop:', '  suite_keys: [executors.test.x]');
  ghi(root, '_acceptance/config.yaml', cfg.join('\n') + '\n');
  if (coBanDo) for (const [f, t] of Object.entries(BAN_DO)) ghi(root, `design/patterns/${f}`, t);
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'kho mẫu');
  return root;
}

// nhanh(kho, ten, tep) — nhánh mới từ main: ghi (chuỗi) hay xoá (null) từng tệp, rồi commit.
export function nhanh(kho, ten, tep) {
  git(kho, 'checkout', '-q', '-B', ten, 'main');
  for (const [rel, t] of Object.entries(tep)) {
    if (t === null) fs.rmSync(path.join(kho, rel), { force: true });
    else ghi(kho, rel, t);
  }
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '--allow-empty', '-m', ten);
}

// banSaoTiem(dsThuMuc, tep, tim, thay) — chép TRỌN các thư mục của KIT, thay đúng một lần; tim khớp ≠ 1 → ném.
export function banSaoTiem(dsThuMuc, tep, tim, thay) {
  const goc = thuMuc('ban-sao');
  for (const d of dsThuMuc) fs.cpSync(path.join(KIT, d), path.join(goc, d), { recursive: true });
  const f = path.join(goc, tep);
  const t = fs.readFileSync(f, 'utf8');
  const n = t.split(tim).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (cần 1): ${tim}`);
  fs.writeFileSync(f, t.replace(tim, thay));
  return goc;
}

// chay(kitRoot, tepScript, args, cwd) → { ma, out, err }
export function chay(kitRoot, tepScript, args, cwd) {
  const r = spawnSync(process.execPath, [path.join(kitRoot, tepScript), ...args], { cwd: cwd || kitRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { ma: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// khoiMarker(tep, ten) — nội dung khối ```…``` giữa hai marker <<<ten / ten>>>, rút lúc chạy.
export function khoiMarker(tep, ten) {
  const t = fs.readFileSync(tep, 'utf8');
  const m = new RegExp(`<<<${ten} -->\\s*\`\`\`[a-z]*\\n([\\s\\S]*?)\\n\`\`\`\\s*<!-- ${ten}>>>`).exec(t);
  if (!m) throw new Error(`không thấy khối marker ${ten} trong ${tep}`);
  return m[1];
}
