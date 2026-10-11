// Dữ liệu cho hai thẻ của đợt — JSON, phiên giám sát dịch thành chữ người (spec workflow §4.1, §4.4, §14,
// §16 T15). Thẻ KHÔNG quyết gì: nó liệt kê điều người phải quyết và điều máy đi tiếp có cửa phản đối.
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';

// Một trường frontmatter, đọc theo ĐÚNG nghĩa `frontmatterField` của kit (lib/evidence-core.cjs): trong
// một dòng (`[ \t]*`, không `\s*` — khoá để trống không được nuốt dòng kế), bỏ chú thích `#`, bóc nháy
// khi đủ cặp. Gói cài riêng nên không nạp được lib của kit; ca DP2-09 so hai bộ đọc trên một ma trận.
export function truongFm(fm, khoa) {
  const dong = new RegExp(`^${khoa}[ \\t]*[:=][ \\t]*(.*)$`, 'mi').exec(fm);
  if (!dong) return null;
  const v = dong[1].replace(/^#.*$/, '').replace(/\s+#.*$/, '').trim();
  const cap = v.match(/^"([\s\S]*)"$/) || v.match(/^'([\s\S]*)'$/);
  return (cap ? cap[1] : v).trim();
}

// Trạng thái quyết của một hồ sơ: 'da-quyet' · 'cho' (chưa có chữ quyết của người) · 'khong-build'.
// Thư mục có mặt KHÔNG phải quyết định: ô `stage: discovery` chưa có `decision` vẫn là chờ.
export function trangThaiQuyet(gocKho, slug) {
  const dir = path.join(gocKho, '_acceptance', slug);
  if (fs.existsSync(path.join(dir, 'contract.md'))) return { tt: 'da-quyet' };
  let opp;
  try {
    opp = fs.readFileSync(path.join(dir, 'opportunity.md'), 'utf8');
  } catch {
    return { tt: 'cho' };
  }
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(opp)?.[1] ?? '';
  const decision = (truongFm(fm, 'decision') ?? '').toLowerCase();
  if (decision === 'build') return { tt: 'da-quyet' };
  if (decision === '') return { tt: 'cho' };
  return { tt: 'khong-build', decision };
}

// Quyết của MỘT hàng trong đợt — một nguồn cho thẻ khởi tạo, thợ (`tho.mjs`) và bộ phát lịch (`bangQuyet`).
// Hàng không mang `ma` là hàng phát sinh mà giám sát đã thêm (`hang them`) — đó chính là lượt gom Cổng Đáng về
// giám sát (T15), nên đã quyết. Hàng mang `ma`: tìm hồ sơ/ô ở worktree của dãy trước, rồi ở kho chính. (DP7 viết
// hàm này trong tho.mjs; hồ sơ dieu-phoi-sua-truoc-dot-thu dời về đây để thẻ đọc cùng hàm với bộ phát lịch.)
export function quyetCua(gocKho, day, hang) {
  if (!hang.ma) return { tt: 'da-quyet' };
  const trongDay = day?.worktree ? trangThaiQuyet(day.worktree, hang.slug) : { tt: 'cho' };
  if (trongDay.tt === 'da-quyet') return trongDay;
  const chinh = trangThaiQuyet(gocKho, hang.slug);
  return chinh.tt === 'cho' && trongDay.tt !== 'cho' ? trongDay : chinh;
}

// Bảng quyết của mọi hàng trong đợt — bộ phát lịch dựng mỗi nhịp để chỉ giao hàng đã quyết (B1).
export function bangQuyet(gocKho, hangViec) {
  return new Map(hangViec.hang.map((h) => [h.slug, quyetCua(gocKho, hangViec.day.find((d) => d.id === h.day), h).tt]));
}

const canDot = (cwd) => {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('không có đợt nào đang chạy');
  return thuMuc;
};

export function theKhoiTao(cwd) {
  const thuMuc = canDot(cwd);
  const gocKho = gocKhoChinh(cwd);
  const hv = docHangViec(thuMuc);
  const choCongDang = [];
  const canhBao = [];
  for (const h of hv.hang) {
    if (!h.ma) continue;
    const q = quyetCua(gocKho, hv.day.find((d) => d.id === h.day), h);
    if (q.tt === 'cho') choCongDang.push(h.slug);
    else if (q.tt === 'khong-build') canhBao.push({ slug: h.slug, ma: h.ma, decision: q.decision, ly_do: `ô đã quyết «${q.decision}», không vào đợt` });
  }
  let hanMuc = null;
  try {
    hanMuc = docCauHinh(thuMuc).han_muc ?? null;
  } catch {
    hanMuc = null;
  }
  return {
    dot: hv.dot,
    day: hv.day.map((d) => ({ id: d.id, worktree: d.worktree, hang: hv.hang.filter((h) => h.day === d.id).map((h) => h.slug) })),
    hang: hv.hang.map((h) => ({ ma: h.ma ?? null, slug: h.slug, day: h.day, uu_tien: h.uu_tien ?? null })),
    // T15: chỉ hỏi điều chỉ người biết — quyền tự merge, và chữ «build» cho từng hàng chờ Cổng Đáng.
    // Hồ sơ dieu-phoi-sua-truoc-dot-thu (E1, DP4 Ngoài-1): mỗi phần tử của `hoi` có một lối ghi câu trả lời
    // (`pha --tu-merge`, `decision` của ô). Khẩu vị hạn mức không có lối ghi nên không hỏi — ngưỡng `han_muc` in ra
    // như thông tin, sửa ở `dieu-phoi.config.json` của gói đợt.
    hoi: ['quyen-tu-merge', ...choCongDang.map((s) => `build:${s}`)],
    han_muc: hanMuc,
    may_di_tiep: ['uu-tien', 'lan-v'],
    cho_cong_dang: choCongDang,
    canh_bao: canhBao,
  };
}

const suKienDot = (thuMuc) => {
  const p = path.join(thuMuc, 'su-kien.jsonl');
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).flatMap((d) => {
    try {
      return [JSON.parse(d)];
    } catch {
      return [];
    }
  });
};

// Thẻ đóng đợt (§14 chỗ nối 4, 5): hàng phát sinh trong đợt (không mang mã lộ trình) để người chọn giữ
// hàng nào; các lớp phủ ưu tiên đã đổi trong đợt để hỏi một lần có đưa vào lộ trình không.
export function theDong(cwd) {
  const thuMuc = canDot(cwd);
  const hv = docHangViec(thuMuc);
  return {
    dot: hv.dot,
    hang_phat_sinh: hv.hang.filter((h) => !h.ma).map((h) => h.slug),
    lop_phu: suKienDot(thuMuc).filter((e) => e.loai === 'doi-ke-hoach' && e.kieu === 'day-len').map((e) => ({ hang: e.hang, truoc: e.truoc, luc: e.luc })),
  };
}
