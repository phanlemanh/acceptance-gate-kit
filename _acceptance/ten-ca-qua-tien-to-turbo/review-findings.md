# Review findings: ten-ca-qua-tien-to-turbo (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC-1..AC-4.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E1–E3 thiếu tests/scripts/gia-lan-fixture.mjs trong paths: carry mang màu xanh cũ sang khi tệp này đổi**
  Người dùng thấy gì: Nếu một vòng sửa sau lần bị trả lại chỉ đụng vào phần dựng chung của bộ kiểm, ba bài kiểm đầu có thể bị coi là vẫn xanh như lần trước mà không chạy lại, nên một lỗi mới trong phần chung đó có thể lọt qua mà không ai thấy.
  file: `_acceptance/ten-ca-qua-tien-to-turbo/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Phép kiểm «số ô lệch» của AC-2 không bao giờ đỏ được, và MAU là danh sách chép tay không buộc vào KHUON_TEN_CA**
  Người dùng thấy gì: Bài kiểm nói đã soát đủ mười trường hợp mẫu nhưng con số này tự suy từ chính danh sách mẫu nên không bao giờ báo sai. Nếu sau này bỏ bớt một mẫu hoặc thêm một kiểu dòng mới, bài kiểm vẫn xanh và người đọc báo cáo vẫn tưởng mọi kiểu dòng đã được soát.
  file: `tests/scripts/ten-ca-qua-tien-to.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận tuyên viết trước nhưng phép đếm ô là hằng đúng (hai vế cùng rút từ MAU), xoá một hàng vẫn xanh**
  Người dùng thấy gì: Báo cáo ghi là đã kiểm đủ mười ô theo ma trận viết trước, nhưng chỉ cần xoá một hàng mẫu là bài kiểm vẫn xanh. Người ký đọc chữ đủ mười ô có thể tin vào một cam kết mà thực ra không còn gì giữ.
  file: `tests/scripts/ten-ca-qua-tien-to.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
