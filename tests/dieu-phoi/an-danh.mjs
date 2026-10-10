#!/usr/bin/env node
// an-danh.mjs — hồ sơ dieu-phoi-dong-goi-loi, AC-4 (E4).
// Ẩn danh một bản chụp thư mục đợt do bản lõi cũ dựng, để làm fixture đọc-cũ trong kho kit công
// khai. Chỉ chép các tệp JSON mà bộ đọc của lõi đọc (sổ quyết định d-…-14); bỏ văn xuôi, nhật ký,
// bảng. Tập khoá JSON (mọi cấp) giữ NGUYÊN — chỉ giá trị đổi:
//   · giữ: số, bool, null, thời gian ISO, mã dạng định danh (P1, K2, P3-2, gia-han:P3-2), và giá trị
//     DẠNG ĐỊNH DANH (không khoảng trắng) của các khoá cấu trúc (loai, ket_qua, tai_nguyen, phien, …) —
//     văn tự do luôn bị thay, kể cả dưới khoá cấu trúc (noi_dung.trang_thai của yêu cầu là văn xuôi);
//   · `goc_kho` và mọi đường bắt đầu bằng nó → `@KHO@` + đoạn đã đổi tên (`wt-<n>`);
//   · `nhanh_chinh` → `main`; `link` → `claude://x/<n>`;
//   · mọi chuỗi khác → token tất định qua MỘT bảng chung (cùng chuỗi → cùng token ở mọi tệp, nên
//     quan hệ slug ↔ khoá ↔ đơn ↔ hàng kế còn nguyên); chuỗi dạng đường/glob giữ đuôi `/**`, `*`.
// Ngoại lệ DUY NHẤT của «khoá giữ nguyên»: tên khoá tự do chứa tên nhánh chính của kho (vd khoá
// `<nhánh>_da_gop` trong noi_dung của yêu cầu) đổi đúng phần tên nhánh thành `nhanh_chinh` — luật
// `doiTenKhoa` dưới đây, xuất ra để phép so tập khoá áp cùng luật (sổ quyết định của S3).
// Dùng: node tests/dieu-phoi/an-danh.mjs <thư mục đợt gốc> <thư mục đích>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEP_GOC = ['dieu-phoi.config.json', 'hang-viec.json', 'trang-thai.json', 'ranh-gioi-them.json'];
export const THU_MUC_JSON = ['xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep'];
export const KHO_GIU = '@KHO@';

const KHOA_GIU = new Set(['loai', 'ket_qua', 'tai_nguyen', 'phien', 'id', 'day', 'trang_thai', 'boi', 's4', 'ma', 'dot', 'kieu', 'dich', 'tien_do', 'hanh_dong']);
const LA_GIO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/;
const LA_MA = /^(gia-han:)?[A-Z][A-Z0-9]*(-\d+)?$/;
const LA_DINH_DANH = /^[\w.:@-]{1,60}$/;

export const doiTenKhoa = (k, nhanhChinh) => (nhanhChinh && k.includes(nhanhChinh) ? k.split(nhanhChinh).join('nhanh_chinh') : k);

export function taoAnDanh() {
  const bang = new Map();
  const doan = new Map();
  let gocKho = null;
  let nhanhChinh = null;
  let soLink = 0;
  const token = (s) => {
    if (!bang.has(s)) {
      const n = bang.size + 1;
      bang.set(s, s.endsWith('/**') ? `p${n}/**` : s.includes('*') ? `p${n}/*` : s.includes('/') ? `p${n}` : `t${n}`);
    }
    return bang.get(s);
  };
  const doiDuong = (s) => {
    const rest = s.slice(gocKho.length);
    const moi = rest
      .split('/')
      .map((d) => {
        if (d === '' || d === '.claude' || d === 'worktrees') return d;
        if (!doan.has(d)) doan.set(d, `wt-${doan.size + 1}`);
        return doan.get(d);
      })
      .join('/');
    return `${KHO_GIU}${moi}`;
  };
  const gia = (khoa, v) => {
    if (typeof v !== 'string') return v;
    if (khoa === 'goc_kho') return KHO_GIU;
    if (khoa === 'nhanh_chinh') return 'main';
    if (khoa === 'link') return v === '' ? v : `claude://x/${++soLink}`;
    if (v === '' || LA_GIO.test(v) || LA_MA.test(v)) return v;
    if (KHOA_GIU.has(khoa) && LA_DINH_DANH.test(v)) return v;
    if (gocKho && (v === gocKho || v.startsWith(`${gocKho}/`))) return doiDuong(v);
    return token(v);
  };
  const duyet = (v, khoa = null) => {
    if (Array.isArray(v)) return v.map((x) => duyet(x, khoa));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [doiTenKhoa(k, nhanhChinh), duyet(x, k)]));
    return gia(khoa, v);
  };
  return {
    datGocKho: (g) => {
      gocKho = g;
    },
    datNhanhChinh: (n) => {
      nhanhChinh = n;
    },
    duyet,
  };
}

const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};

// Danh sách tệp đọc (đường tương đối), theo thứ tự tất định.
export function tepCanChep(nguon) {
  const ds = TEP_GOC.filter((f) => fs.existsSync(path.join(nguon, f)));
  const khoa = path.join(nguon, 'khoa');
  if (fs.existsSync(khoa)) {
    for (const tn of fs.readdirSync(khoa).sort()) {
      for (const f of ['chu.json', 'nhip']) if (fs.existsSync(path.join(khoa, tn, f))) ds.push(path.join('khoa', tn, f));
    }
  }
  for (const d of THU_MUC_JSON) {
    const p = path.join(nguon, d);
    if (!fs.existsSync(p)) continue;
    for (const f of fs.readdirSync(p).sort()) if (f.endsWith('.json') && fs.statSync(path.join(p, f)).isFile()) ds.push(path.join(d, f));
  }
  return ds;
}

export function anDanh(nguon, dich) {
  const ad = taoAnDanh();
  const cfg = path.join(nguon, 'dieu-phoi.config.json');
  if (fs.existsSync(cfg)) {
    ad.datGocKho(docJ(cfg).goc_kho ?? null);
    ad.datNhanhChinh(docJ(cfg).nhanh_chinh ?? null);
  }
  const ds = tepCanChep(nguon);
  for (const rel of ds) {
    const p = path.join(nguon, rel);
    if (rel.endsWith('nhip')) {
      // Tệp nhịp chỉ chứa một mốc thời gian; giữ nguyên nếu đúng dạng, không thì bỏ chữ.
      const t = fs.readFileSync(p, 'utf8').trim();
      fs.mkdirSync(path.dirname(path.join(dich, rel)), { recursive: true });
      fs.writeFileSync(path.join(dich, rel), LA_GIO.test(t) ? t : '');
      continue;
    }
    ghiJ(path.join(dich, rel), ad.duyet(docJ(p)));
  }
  return { tep: ds.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const [nguon, dich] = process.argv.slice(2);
  if (!nguon || !dich) {
    console.error('dùng: an-danh.mjs <thư mục đợt gốc> <thư mục đích>');
    process.exit(2);
  }
  const { tep } = anDanh(path.resolve(nguon), path.resolve(dich));
  console.log(`an-danh: ${tep} tệp → ${dich}`);
}
