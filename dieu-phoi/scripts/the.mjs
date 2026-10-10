// Dữ liệu cho hai thẻ của đợt — JSON, phiên giám sát dịch thành chữ người (spec workflow §4.1, §4.4, §14,
// §16 T15). Thẻ KHÔNG quyết gì: nó liệt kê điều người phải quyết và điều máy đi tiếp có cửa phản đối.
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';

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
  const fm = /^---\n([\s\S]*?)\n---/.exec(opp)?.[1] ?? '';
  const decision = /^decision:\s*([^#\s]*)/m.exec(fm)?.[1] ?? '';
  if (decision === 'build') return { tt: 'da-quyet' };
  if (decision === '') return { tt: 'cho' };
  return { tt: 'khong-build', decision };
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
    const q = trangThaiQuyet(gocKho, h.slug);
    if (q.tt === 'cho') choCongDang.push(h.slug);
    else if (q.tt === 'khong-build') canhBao.push({ slug: h.slug, ma: h.ma, decision: q.decision, ly_do: `ô đã quyết «${q.decision}», không vào đợt` });
  }
  return {
    dot: hv.dot,
    day: hv.day.map((d) => ({ id: d.id, worktree: d.worktree, hang: hv.hang.filter((h) => h.day === d.id).map((h) => h.slug) })),
    hang: hv.hang.map((h) => ({ ma: h.ma ?? null, slug: h.slug, day: h.day, uu_tien: h.uu_tien ?? null })),
    // T15: chỉ hỏi điều chỉ người biết — quyền tự merge, và chữ «build» cho từng hàng chờ Cổng Đáng.
    hoi: ['quyen-tu-merge', ...choCongDang.map((s) => `build:${s}`)],
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
