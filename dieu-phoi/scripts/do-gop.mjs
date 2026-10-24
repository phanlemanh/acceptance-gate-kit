// Số đo một hàng đã gộp (hồ sơ ky-den-gop, thước «ký → gộp» của North Star «gộp được»), đọc từ lịch sử nhánh chính
// — không từ giờ bộ phát lịch thấy, vì bộ phát lịch có thể nghỉ giữa lúc ký và lúc gộp.
// · ký = commit ĐẦU TIÊN trên nhánh chính đưa dòng `status:` của hợp đồng sang một trạng thái đã thông;
// · gộp = commit đầu tiên trên lối cha-đầu của nhánh chính có commit ký là tổ tiên (commit gộp mang chữ ký vào) — không
//   phải commit đầu chạm hợp đồng: hồ sơ có thể đã lên nhánh chính từ trước giờ ký (ô chờ Cổng Đáng, lượt park);
// · gộp nhánh chính vào nhánh = số commit gộp bên trong PR có một cha nằm trên nhánh chính.
// Commit ký nằm ngay trên lối cha-đầu (gộp squash, commit thẳng vào nhánh chính) → không có lúc ký riêng: `ky_luc` null,
// số gộp-vào-nhánh null; giờ gộp vẫn là commit ấy.

const dong1 = (s) => s.split('\n').filter(Boolean)[0] ?? '';

// `daThong` = danh sách trạng thái đã thông (DA_THONG của bộ phát lịch — truyền vào để không nạp vòng).
export function soDoGop(io, cfg, slug, daThong) {
  const nhanh = `origin/${cfg.nhanh_chinh}`;
  const tep = `_acceptance/${slug}/contract.md`;
  const chay = (args) => {
    try {
      return io.chay('git', args);
    } catch {
      return null;
    }
  };
  const [shaKy, lucKy] = dong1(chay(['log', '--reverse', '--format=%H %cI', '-G', `^status:[[:space:]]*(${daThong.join('|')})`, nhanh, '--', tep]) ?? '').split(' ');
  const rong = { ky_luc: null, gop_luc: null, ky_den_gop_phut: null, gop_vao_nhanh: null };
  if (!shaKy) return rong;
  const chaDau = new Set((chay(['rev-list', '--first-parent', nhanh]) ?? '').split('\n').filter(Boolean));
  const thang = chaDau.has(shaKy);
  const shaGop = thang ? shaKy : (chay(['rev-list', '--first-parent', '--reverse', '--ancestry-path', `${shaKy}..${nhanh}`]) ?? '').split('\n').filter(Boolean).find((x) => chaDau.has(x));
  if (!shaGop) return rong;
  const [, lucGop, ...cha] = dong1(chay(['log', '-1', '--format=%H %cI %P', shaGop]) ?? '').split(' ');
  const kyThat = thang ? null : lucKy;
  let vao = null;
  if (!thang && cha.length === 2) {
    vao = 0;
    for (const x of (chay(['rev-list', '--merges', `${cha[0]}..${cha[1]}`]) ?? '').split('\n').filter(Boolean)) {
      const chaX = (chay(['rev-list', '--parents', '-n', '1', x]) ?? '').trim().split(' ').slice(2);
      if (chaX.some((q) => chay(['merge-base', '--is-ancestor', q, cha[0]]) !== null)) vao++;
    }
  }
  const iso = (x) => new Date(x).toISOString();
  const phut = kyThat ? Math.round((Date.parse(lucGop) - Date.parse(kyThat)) / 60_000) : null;
  return { ky_luc: kyThat ? iso(kyThat) : null, gop_luc: iso(lucGop), ky_den_gop_phut: phut, gop_vao_nhanh: vao };
}
