## Trong hợp đồng

(rỗng — không có finding nào map được vào AC ở vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **`feature:` của hợp đồng chứa ` #149`/` #151` — reader duy nhất của kit cắt làm YAML comment, tên hồ sơ hiện cụt trên bản đồ và thẻ**
  Người dùng thấy gì: Tên tính năng hiển thị trên bản đồ sản phẩm và trên thẻ quyết định có thể bị cắt cụt (mất chữ, dấu ngoặc không đóng), khiến người đọc khó nhận ra đúng tên các vòng sửa liên quan khi ký duyệt.
  file: `_acceptance/release-2-9-0/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Contract window inventory already stale: origin/main contains PR #154 (CLAUDE.md constitution edit) outside the contract's counted window and explicitly listed as Out of scope**
  Người dùng thấy gì: Số lượng PR và mô tả 'các PR còn lại' ghi trong hồ sơ phát hành phản ánh đúng thời điểm viết hồ sơ; nếu có thêm thay đổi được gộp vào sau đó, các con số này có thể không còn khớp thực tế khi người đọc lại hồ sơ về sau.
  file: `_acceptance/release-2-9-0/contract.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
