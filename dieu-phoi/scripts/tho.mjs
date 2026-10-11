// Ngữ cảnh phiên thợ trong đợt (DP7, spec workflow §16 T7) — CHỈ ĐỌC, không ghi byte nào. Bên đọc của
// `tiep/<dãy>.json` (bên viết: bộ phát lịch), `dieu-khien.json` (bên viết: `pha`) và ô/hồ sơ của hàng kế
// (`trangThaiQuyet` — một nguồn với thẻ khởi tạo). Dãy của phiên = `phienCuaCwd`, cùng hàm hai hook dùng.
// feature-loop gọi lệnh này qua `trong-dot.mjs` từ BẢN LÕI của đợt, nên mọi import phải là tệp cùng thư mục.
import path from 'node:path';
import { docJson, gocKhoChinh, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { trangThaiQuyet } from './the.mjs';

// Việc kế của thợ — khối TRONG-DOT của SKILL feature-loop có đúng một dòng cho mỗi giá trị (ca DP7-08).
export const VIEC_KE = ['mo-hang', 'cho-nhip', 'bao-giam-sat', 'cho', 'xong'];

// Hàng không mang `ma` là hàng phát sinh mà giám sát đã thêm (`hang them`) — đó chính là lượt gom Cổng Đáng
// về giám sát (T15), nên đã quyết. Hàng mang `ma`: tìm hồ sơ/ô ở worktree của dãy trước, rồi ở kho chính.
function quyetCua(gocKho, day, hang) {
  if (!hang.ma) return { tt: 'da-quyet' };
  const trongDay = trangThaiQuyet(day.worktree, hang.slug);
  if (trongDay.tt === 'da-quyet') return trongDay;
  const chinh = trangThaiQuyet(gocKho, hang.slug);
  return chinh.tt === 'cho' && trongDay.tt !== 'cho' ? trongDay : chinh;
}

export function ngucanhTho(cwd, { slug = null } = {}) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { trong_dot: false, ly_do: 'khong-dot' };
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, cwd);
  if (!id) return { trong_dot: false, ly_do: 'khong-phai-tho' };
  const day = hv.day.find((d) => d.id === id);
  const dk = docPha(thuMuc);
  const tiep = docJson(path.join(thuMuc, 'tiep', `${id}.json`), null);
  const kq = {
    trong_dot: true,
    dot: hv.dot,
    thu_muc: thuMuc,
    day: id,
    luat: path.join(thuMuc, 'LUAT.md'),
    pha: dk.pha,
    tu_merge: typeof dk.tu_merge === 'boolean' ? dk.tu_merge : null,
    hang_ke: { slug: tiep?.hang ?? null, moi: tiep?.moi ?? null, quyet: null },
  };
  const ra = (viecKe, lyDo) => ({ ...kq, viec_ke: viecKe, ...(lyDo ? { ly_do: lyDo } : {}) });
  if (dk.pha !== 'dang-chay') return ra('cho', `pha ${dk.pha}`);
  if (!tiep) return ra('cho-nhip', 'bộ phát lịch chưa ghi hàng kế cho dãy');
  if (!tiep.hang) return tiep.xong ? ra('xong') : ra('cho', tiep.cho ?? 'chờ');
  if (slug && tiep.hang === slug) return ra('cho-nhip', `nhịp chưa thấy ${slug} xong`);
  const hang = hv.hang.find((h) => h.slug === tiep.hang) ?? { slug: tiep.hang };
  const q = quyetCua(gocKhoChinh(cwd), day, hang);
  kq.hang_ke.quyet = q.tt;
  if (q.tt === 'da-quyet') return ra('mo-hang');
  return ra('bao-giam-sat', q.tt === 'khong-build' ? `${hang.slug}: ô đã quyết «${q.decision}»` : `${hang.slug}: chưa có quyết build`);
}
