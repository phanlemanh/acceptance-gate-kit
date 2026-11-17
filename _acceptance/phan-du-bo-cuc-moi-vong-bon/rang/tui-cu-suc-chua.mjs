// tui-cu-suc-chua.mjs — luật so khoá ĐỀ NGHỊ cho thước giữ khoá của B2 (hồ sơ phan-du-bo-cuc-moi-vong-bon, AC-4; chủ kho
// chọn ở Hỏi-1). Thay `tuiCu` của `migration/kich-ban/giu-khoa.mjs` (bản chép: `_acceptance/phan-du-bo-cuc-moi/rang/
// tui-khoa.mjs`). Kho này KHÔNG dùng luật này cho phán quyết nào; B2 tự nhận (gui-b2.md §3.1).
//
// Lỗi của `tuiCu` hiện tại: khoá đổi tên nhận tên mới mỗi khi cây mới CÓ tên ấy, không xét cây mới còn CHỖ cho tên ấy
// không. `bo-cuc.test.mjs` in cả «BC commands/approve.md · HEAD» lẫn «BC plugins/acceptance-gate/commands/approve.md ·
// HEAD» ở cả hai cây; ở cây cũ tên thứ nhất đổi thành tên thứ hai, nên tên thứ hai bị đòi hai lần → 43 thiếu + 43 thừa.
//
// Luật đề nghị: (1) khoá không đổi tên giữ chỗ trước; (2) khoá đổi tên nhận tên mới khi cây mới còn chỗ cho tên ấy; hết chỗ
// mà tên nguyên chữ còn chỗ thì giữ tên nguyên; hết cả hai thì `soTui` sẽ báo thiếu — báo bằng tên MỚI khi cây mới không
// có tên mới (ca mất thật dưới tên mới, như `tuiCu` cũ), bằng tên NGUYÊN CHỮ khi cây mới có tên mới mà chỗ đã bị khoá
// khác giữ (thứ mất là bản nguyên chữ). Ba hình `tuiCu` đang xử lý — không đổi · đổi thường · tên chỉ còn nguyên chữ ở
// cây mới — cho cùng kết quả như cũ.
export function tuiCuSucChua(datA, datB, doi) {
  const cu = new Map(); const con = new Map(datB);
  const lay = (t, n) => { cu.set(t, (cu.get(t) || 0) + n); con.set(t, (con.get(t) || 0) - n); };
  const doiTen = [];
  for (const [k, n] of datA) { if (doi(k) === k) lay(k, n); else doiTen.push([k, n]); }
  for (const [k, n] of doiTen) {
    const m = doi(k);
    for (let i = 0; i < n; i++) lay((con.get(m) || 0) > 0 ? m : (con.get(k) || 0) > 0 ? k : datB.has(m) ? k : m, 1);
  }
  return cu;
}

// Hình của một khoá cây cũ dưới phép đổi `doi` so với túi cây mới (cho phép vi phân của --mp): 'khong-doi' · 'doi-thuong'
// (tên mới có ở cây mới) · 'nguyen-chu' (tên mới không có, tên nguyên chữ có) · 'vang' (không tên nào có).
export function hinhKhoa(k, datB, doi) {
  const m = doi(k);
  if (m === k) return 'khong-doi';
  if (datB.has(m)) return 'doi-thuong';
  return datB.has(k) ? 'nguyen-chu' : 'vang';
}
