# Review findings: release-2-39-0 (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mô tả manifest nói sử cũ nằm trong CHANGELOG.md, nhưng thật ra nó nằm ở docs/reference/su-mo-ta-plugin-toi-2-38-1.md**
  Người dùng thấy gì: Người đọc mô tả plugin mà chỉ mở tệp lịch sử thay đổi sẽ không thấy sử các bản cũ, vì sử nằm ở một tệp tham chiếu khác. Họ phải tìm thêm một bước mới ra.
  Căn cứ: Hậu quả nhẹ: chỉ gây tìm lâu hơn một chút, không mất hay lộ dữ liệu, người dùng tự lần ra được, và sửa sau chỉ là đổi một câu chữ.
  file: `.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **goi-chi-doi-so.sh không thấy dòng trống được thêm hoặc xoá, nên vế «mọi dòng đổi là dòng version» có lỗ hẹp**
  Người dùng thấy gì: Công cụ kiểm hai gói chỉ đổi số phiên bản có thể bỏ sót việc thêm hoặc xoá một dòng trống, nên vẫn báo xanh. Dòng trống không đổi cách gói chạy nên người dùng không bị ảnh hưởng.
  Căn cứ: Hậu quả gần như không có với người dùng vì dòng trống không đổi hành vi, không mất dữ liệu, và có thể sửa sau với chi phí thấp.
  file: `_acceptance/release-2-39-0/goi-chi-doi-so.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên LỚP («jsdom ở 3 điểm init», «đột biến đều đỏ») nhưng chỉ có điểm-case**
  Người dùng thấy gì: Một ca kiểm nội bộ in ra lời khẳng định phủ rộng hơn thực tế, nên kết quả xanh của nó làm người đọc tưởng được kiểm kỹ hơn thật. Người dùng cuối không thấy ảnh hưởng trực tiếp.
  Căn cứ: Chỉ làm người bảo trì hiểu sai độ phủ của một ca kiểm, không ảnh hưởng người dùng hay dữ liệu, lỗi có từ trước và ghi vào giới hạn đã biết là đủ.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/release-2-39-0/goi-chi-doi-so.sh, tests/plugins/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
