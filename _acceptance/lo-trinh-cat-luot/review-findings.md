# Review findings: lo-trinh-cat-luot (round 3)

## Trong hợp đồng

Không có lỗi trong hợp đồng ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Carried eval run_id bypasses docRid: E13's `""` keeps being re-written and the evidence reader silently drops it**
  Người dùng thấy gì: Khi một phép kiểm được mang nguyên kết quả từ lượt chấm trước sang lượt sau, mã lượt chạy hỏng của nó vẫn được chép lại như cũ. Kết quả là phép kiểm đó (E13) lặng lẽ không bị đối chiếu nguồn gốc lúc ký, không báo đỏ cũng không báo khớp, và người ký không thấy dấu hiệu nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — vòng ghi→đọc W-RID tuyên «mọi run_id đọc lại đúng nó» nhưng chỉ thử một nhánh của luật bên đọc (nhánh cắt đuôi ` # …` không có đầu vào nào)**
  Người dùng thấy gì: Phép thử bảo vệ cho việc sửa mã lượt chạy chỉ thử một phần các kiểu mã sai có thể gặp. Nếu ai đó lỡ gỡ đoạn xử lý mã có ghi chú đi kèm, phép thử vẫn báo xanh, và lỗi cũ (ký bị chặn oan khi mã lượt chạy có chú thích) có thể quay lại mà không ai hay.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): LT-137 bỏ qua kết quả của lượt --nhip, nên «nhịp không ghi gì» xanh cả khi lượt nhịp không chạy (r2)**
  Người dùng thấy gì: Lệnh đo nhịp làm việc có thể hỏng ngay từ đầu mà phép kiểm «không đụng tới tệp nào» vẫn báo xanh. Rủi ro thấp vì phần chạy đúng của lệnh nhịp đã được kiểm ở chỗ khác. Đề xuất ghi là hạn chế đã biết và đi tiếp.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The scope template says the reader only reads the PHAM-VI-MA marker block, but `docPhamVi` reads the whole file (r1)**
  Người dùng thấy gì: Khuôn bản phạm vi hứa rằng chỉ phần giữa hai dấu mốc được máy đọc, nhưng thực tế máy đọc cả tệp. Nếu ai đó ghi chú thêm một dòng cùng dạng với mã ngoài khối, máy sẽ tính nó như một mã thật hoặc báo lỗi oan.
  file: `skills/acceptance/references/pham-vi-template.md`
  severity: low
  Đề xuất: known-limits

- **SKILL sends Core «Never» cells to `da_bac`, but the coverage check gives `da_bac` no credit (r1)**
  Người dùng thấy gì: Hướng dẫn cắt lượt bảo đưa các mục «không bao giờ làm» vào danh sách đã bác, nhưng bước kiểm tra phủ không tính chúng. Người cắt có thể liệt kê chúng thành mã và bị báo đỏ, hoặc bỏ chúng đi và mất dấu vết.
  file: `skills/cat-luot/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Malformed milestone `hang` downgrades to a warning and skips the milestone-date rule for rows in the batch, so the check still exits 0 (r1)**
  Người dùng thấy gì: Nếu danh sách hàng của một mốc bị ghi sai kiểu, máy chỉ cảnh báo và bỏ qua phép kiểm ngày với mốc đó. Một hàng trong đợt đang cắt có thể trễ hơn ngày mốc mà vẫn được cho qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **nhanCuaCo misreads labels that contain ':' or ' thiếu ', so a broken row in the batch only gets a warning (r1)**
  Người dùng thấy gì: Với mã hàng có dấu hai chấm, một hàng trong đợt đang cắt bị thiếu trường bắt buộc chỉ nhận cảnh báo thay vì lỗi. Việc cắt lượt vẫn qua dù hàng đó chưa hợp lệ.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (feature-loop/workflows/acceptance-verify.js, tests/workflows/acceptance-verify.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
