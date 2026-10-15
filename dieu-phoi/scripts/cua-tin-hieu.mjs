// Cửa tín hiệu của kho, nhìn từ gói điều phối (hồ sơ cua-tin-hieu-giua-chien-dich, hàng RM3; B′ §10–§11).
// Ý không chặn giữa đợt (việc phụ, việc mới) và ý người gửi bằng /road-map:gui thành MỘT tệp tín hiệu trong thư mục
// nguồn ĐẦU của `tin_hieu.nguon` — một bộ ghi cho cả hai bên nêu, thân tệp = thân yêu cầu (khuôn tín hiệu = khuôn
// yêu cầu của gói). Không bao giờ đè: tệp cùng tên khác thân là một ý khác chưa gom.
//
// Gói này được chép phẳng vào `<thư mục đợt>/loi/`, nên chỉ import `./` và `node:`. `khoaTinHieu` dưới đây là BẢN
// CHÉP của scripts/tin-hieu-khoa.cjs — ca CT-6 so hai bản trên ma trận cấu hình (tiền lệ nguon-hang.mjs, ca DP2-08).
import fs from 'node:fs';
import path from 'node:path';

export const CAU_DA_GHI = 'đã ghi, xử ở mốc khép';
export const LOI_GUI_LAI = 'chặn việc đang làm thì gửi lại kèm --chan';

// ── Bản chép khoaTinHieu (scripts/tin-hieu-khoa.cjs) ──────────────────────────────────────────────────────────────
const NULLISH = new Set(['~', 'null', 'Null', 'NULL']);
const boNhay = (s) => String(s).trim().replace(/^["']|["']$/g, '').trim();
const boChuThich = (s) => String(s).replace(/\s+#.*$/, '').trim();

function khoiTinHieu(cfgText) {
  const dong = String(cfgText || '').replace(/\r\n?/g, '\n').split('\n');
  const i = dong.findIndex((l) => /^tin_hieu:\s*(#.*)?$/.test(l));
  if (i < 0) return null;
  const ra = [];
  for (const l of dong.slice(i + 1)) {
    if (/^\s*(#.*)?$/.test(l)) continue;
    if (/^\S/.test(l)) break;
    ra.push(l);
  }
  return ra;
}

function giaTri(khoi, ten) {
  const i = khoi.findIndex((l) => new RegExp(`^ {2}${ten}:`).test(l));
  if (i < 0) return null;
  const tho = [];
  const v = boChuThich(khoi[i].replace(new RegExp(`^ {2}${ten}:`), ''));
  if (v.startsWith('[')) for (const x of v.replace(/^\[/, '').replace(/\]$/, '').split(',')) tho.push(boNhay(x));
  else if (v) tho.push(boNhay(v));
  else {
    for (const l of khoi.slice(i + 1)) {
      const m = l.match(/^ {4,}-\s*(.*)$/);
      if (m) {
        tho.push(boNhay(boChuThich(m[1])));
        continue;
      }
      if (/^\s*(#.*)?$/.test(l)) continue;
      break;
    }
  }
  return tho.filter((t) => t && !NULLISH.has(t));
}

export function khoaTinHieu(cfgText) {
  const khoi = khoiTinHieu(cfgText);
  if (!khoi) return null;
  const nguonTho = giaTri(khoi, 'nguon');
  const gomTho = giaTri(khoi, 'gom');
  if (!nguonTho || !nguonTho.length || !gomTho || !gomTho.length) return null;
  const nguon = [];
  const co = [];
  for (const t of nguonTho) {
    if (nguon.includes(t)) {
      const c = `nguồn tín hiệu khai hai lần: ${t}`;
      if (!co.includes(c)) co.push(c);
      continue;
    }
    nguon.push(t);
  }
  if (gomTho.length > 1) co.push(`tin_hieu.gom chỉ nhận một thư mục — dùng ${gomTho[0]}`);
  return { nguon, gom: gomTho[0], co };
}

// ── Cửa của một kho ─────────────────────────────────────────────────────────────────────────────────────────────
// null = kho không khai cửa (hoặc không đọc được cấu hình) → bên gọi giữ hành vi cũ, từng byte.
export function docCua(gocKho) {
  if (!gocKho) return null;
  let t;
  try {
    t = fs.readFileSync(path.join(gocKho, '_acceptance', 'config.yaml'), 'utf8');
  } catch {
    return null;
  }
  const k = khoaTinHieu(t);
  if (!k) return null;
  return { goc: gocKho, nguon: path.resolve(gocKho, k.nguon[0]) };
}

export const thanTep = ({ phien, loai, hang, noi_dung, luc }) => `${JSON.stringify({ phien, loai, hang, noi_dung, luc }, null, 2)}\n`;

function soSanh(tep, than) {
  const cu = fs.readFileSync(tep, 'utf8');
  if (cu === than) return 'da-co';
  return 'khac-than';
}

// → { ket: 'moi' | 'da-co' | 'khac-than', tep }. Tạo độc quyền (tệp tạm rồi `link`): hai bên ghi cùng tên không bao
// giờ đè nhau. Thư mục nguồn không tạo được (vd là một tệp) → ném lỗi, bên gọi hạ về «cần phán».
export function ghiVaoCua(cua, id, yc) {
  const tep = path.join(cua.nguon, `${id}.json`);
  const than = thanTep(yc);
  fs.mkdirSync(cua.nguon, { recursive: true });
  if (fs.existsSync(tep)) return { ket: soSanh(tep, than), tep };
  const tam = `${tep}.${process.pid}.tmp`;
  fs.writeFileSync(tam, than);
  try {
    fs.linkSync(tam, tep);
    return { ket: 'moi', tep };
  } catch (e) {
    if (e.code === 'EEXIST') return { ket: soSanh(tep, than), tep };
    throw e;
  } finally {
    fs.rmSync(tam, { force: true });
  }
}

// Bộ xét đã trả `ghi` → chuyển yêu cầu vào cửa. Không ghi được, hay id trùng một ý khác → hạ về «cần phán» có tên.
export function chuyenVaoCua(cua, id, yc, kq) {
  try {
    const r = ghiVaoCua(cua, id, yc);
    if (r.ket === 'khac-than') return { ket_qua: 'can_phan', ly_do: `id trùng một ý khác trong cửa — ${path.relative(cua.goc, r.tep)}` };
    return kq;
  } catch (e) {
    return { ket_qua: 'can_phan', ly_do: `không ghi được vào cửa tín hiệu — ${e.code ?? e.message}` };
  }
}
