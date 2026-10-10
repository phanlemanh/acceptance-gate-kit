// MỘT hàm dựng mô hình trạng thái đợt (spec workflow §16 T8): `xem`, bảng đợt `bang.html` và khung của
// lớp mod (DP6) đều vẽ từ đây, để «đợt đang ở đâu» chỉ có một câu trả lời. Nhóm kế hoạch (chỗ nối 3) đi
// kèm tiến độ thi công theo mã hàng: `nhom` = Map<ma, nhom_trang_thai> từ khối dữ liệu lộ trình.
export function moHinh(tt, { nhom = new Map(), hangViec = null } = {}) {
  const maCua = new Map((hangViec?.hang ?? []).filter((h) => h.ma).map((h) => [h.slug, h.ma]));
  return {
    dot: tt.dot,
    pha: tt.pha ?? 'dang-chay',
    trang_thai: tt.trang_thai,
    nhip_cuoi: tt.nhip_cuoi,
    giam_tai: tt.trang_thai === 'giam-tai',
    ly_do_giam_tai: tt.suc_khoe?.lyDo ?? [],
    can_nguoi: tt.suc_khoe?.canNguoi ?? null,
    khoa: (tt.khoa ?? []).map((k) => ({ tai_nguyen: k.tai_nguyen, phien: k.phien, han: k.han_thue_den })),
    hang_cho: (tt.hang_cho ?? []).map((h) => ({ phien: h.phien, loai: h.loai, luc: h.luc })),
    cho_nguoi: (tt.cho_nguoi ?? []).map((c) => ({ phien: c.phien, loai: c.loai, tin: c.tin, luc: c.luc, link: c.link })),
    day: (tt.day ?? []).map((d) => {
      const ma = d.hang ? maCua.get(d.hang) ?? null : null;
      return { id: d.id, link: d.link, hang: d.hang, tien_do: d.tien_do, cho: d.cho, ma, nhom_ke_hoach: ma ? nhom.get(ma) ?? null : null };
    }),
    cho_may: tt.cho_may ?? null,
  };
}

// Bề mặt chữ của `xem`: dòng đầu giữ các chuỗi đã có (đợt, khoá, chờ lượt, chờ người) và thêm pha; mỗi
// dãy một dòng, kèm nhóm kế hoạch khi hàng mang mã lộ trình.
export function veXem(m) {
  const khoa = m.khoa.map((k) => `${k.tai_nguyen}:${k.phien}`).join(' ') || 'trống';
  const dong = [`đợt ${m.dot} · pha ${m.pha} · ${m.trang_thai} · nhịp ${m.nhip_cuoi} · khoá ${khoa} · chờ lượt ${m.hang_cho.length} · chờ người ${m.cho_nguoi.length}`];
  for (const d of m.day) dong.push(`  ${d.id} · ${d.hang ?? '—'} · ${d.tien_do ?? '—'}${d.nhom_ke_hoach ? ` · kế hoạch ${d.nhom_ke_hoach}` : ''}`);
  for (const c of m.cho_nguoi) dong.push(`  chờ người ${c.phien}: ${c.tin}`);
  if (m.cho_may) dong.push(`  s4 chờ khoá máy — kho đang giữ: ${m.cho_may}`);
  return dong.join('\n');
}
