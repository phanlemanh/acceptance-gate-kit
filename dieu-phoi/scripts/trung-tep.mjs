// Lịch biết tệp (hồ sơ ky-den-gop, hạng C): một hàng chưa bắt đầu chỉ được giao khi vùng tệp nó khai (`ranh_gioi`)
// không trùng (i) tệp của PR đang mở và (ii) `ranh_gioi` của hàng đang dở ở dãy khác. «Đang dở» = hàng đang làm,
// đã ký chưa gộp, hoặc đã được chọn làm hàng kế của dãy kia — đúng ca phiếu hai cột ở một kho tiêu thụ (23/10): hai PR cùng sửa một phiếu,
// cái gộp trước làm hồ sơ cái kia cũ đi và phải ghim lại.
import { khop, khopMot } from './glob.mjs';

const coDaiDien = (m) => /[*?]/.test(m);
const tienToTinh = (m) => {
  const i = m.search(/[*?]/);
  return i < 0 ? m : m.slice(0, i);
};

// Hai mẫu glob có thể khớp chung một tệp không. Mẫu không ký tự đại diện là một tệp: so bằng bộ khớp. Hai mẫu đều có
// ký tự đại diện thì so phần tĩnh đứng trước ký tự đại diện đầu — dư (thà báo trùng thừa còn hơn lọt): `a/**/*.ts` và
// `a/**/*.css` bị coi là trùng. Giới hạn đã khai trong hồ sơ.
export function mauGiao(a, b) {
  if (!coDaiDien(a)) return coDaiDien(b) ? khop(b, a) : a === b;
  if (!coDaiDien(b)) return khop(a, b);
  const pa = tienToTinh(a);
  const pb = tienToTinh(b);
  return pa.startsWith(pb) || pb.startsWith(pa);
}

export const ranhGioiGiao = (rgA, rgB) => rgA.flatMap((a) => rgB.filter((b) => mauGiao(a, b)).map((b) => [a, b]));

export const KHOA_HANG = (h) => h.ma ?? h.slug;
const DANG_DO = new Set(['dang', 'ky']);

// `nhanhMo` = {theoNhanh: Map(nhánh → [tệp]), loi} (bên viết: `docNhanhMo`). `nhanhCuaDay` = Map(id dãy → nhánh của
// worktree dãy). `keCua` = Map(id dãy → slug hàng kế đã chọn). Trả {vang, trung: [...]} — `vang` khi hàng không khai
// `ranh_gioi` (cảnh báo, không chặn).
export function xetTrungTep(h, { hangViec, tienDo, nhanhMo = null, nhanhCuaDay = new Map(), keCua = new Map() }) {
  const rg = h.ranh_gioi ?? [];
  if (rg.length === 0) return { vang: true, trung: [] };
  const trung = [];
  const dangDo = (x) => x.day !== h.day && x.slug !== h.slug && (DANG_DO.has(tienDo.get(x.slug)) || keCua.get(x.day) === x.slug);
  for (const x of hangViec.hang.filter(dangDo)) {
    const giao = ranhGioiGiao(rg, x.ranh_gioi ?? []);
    if (giao.length > 0) trung.push({ voi: 'hang', hang: x.slug, khoa: KHOA_HANG(x), day: x.day, mau: giao[0] });
  }
  const nhanhMinh = nhanhCuaDay.get(h.day) ?? null;
  const dayCuaNhanh = new Map([...nhanhCuaDay].filter(([, n]) => n).map(([d, n]) => [n, d]));
  for (const [nhanh, tep] of nhanhMo?.theoNhanh ?? []) {
    if (nhanh === nhanhMinh) continue;
    const cham = tep.filter((t) => khopMot(rg, t));
    if (cham.length === 0) continue;
    const day = dayCuaNhanh.get(nhanh);
    const x = day ? hangViec.hang.find((r) => r.day === day && DANG_DO.has(tienDo.get(r.slug))) : null;
    if (x) {
      if (!trung.some((t) => t.voi === 'hang' && t.hang === x.slug)) trung.push({ voi: 'hang', hang: x.slug, khoa: KHOA_HANG(x), day: x.day, nhanh, tep: cham });
    } else trung.push({ voi: 'pr', nhanh, tep: cham });
  }
  return { vang: false, trung };
}

// Dò PR đang mở và tệp mỗi nhánh tự thêm so với nhánh chính (hạt giống 10/10 lỗ 1: bản cũ nuốt lỗi và trả tập rỗng,
// nên máy duyệt chạm tệp với lý do «không nhánh mở nào chạm» khi chưa dò được gì). Lỗi nay đi ra ở `loi`.
export function docNhanhMo(io, cfg) {
  const theoNhanh = new Map();
  let ds;
  try {
    ds = JSON.parse(io.chay('gh', ['pr', 'list', '--state', 'open', '--json', 'headRefName', '--limit', '200']) || '[]');
  } catch (e) {
    return { theoNhanh, loi: `gh pr list lỗi: ${String(e.message ?? e).split('\n')[0]}` };
  }
  const hong = [];
  for (const { headRefName } of ds) {
    try {
      theoNhanh.set(headRefName, io.chay('git', ['diff', '--name-only', `origin/${cfg.nhanh_chinh}...origin/${headRefName}`]).split('\n').filter(Boolean));
    } catch {
      hong.push(headRefName);
    }
  }
  return { theoNhanh, loi: hong.length ? `không đọc được tệp của nhánh ${hong.join(', ')}` : null };
}

export function tepTheoNhanh(theoNhanh) {
  const kq = new Map();
  for (const [nhanh, tep] of theoNhanh) for (const t of tep) kq.set(t, [...(kq.get(t) ?? []), nhanh]);
  return kq;
}

// Bản chụp ghi vào trang-thai.json (`nhanh_mo`) để lệnh `hang them` đọc được mà không gọi gh.
export const chupNhanhMo = (nm, luc) => ({ luc, loi: nm.loi, theo_nhanh: Object.fromEntries(nm.theoNhanh) });
export const docChupNhanhMo = (chup, loi = undefined) => (chup ? { theoNhanh: new Map(Object.entries(chup.theo_nhanh ?? {})), loi: loi === undefined ? chup.loi ?? null : loi } : null);
