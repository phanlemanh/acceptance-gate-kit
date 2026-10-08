# Review findings: lo-trinh-cat-luot (round 2)

## Trong hợp đồng

- **Hình dạng 5 (tuyên quét lớp, chỉ đo điểm): LT-133 ở ngoài đợt chỉ dựng hàng «đợt khác», không có ô nào dựng hàng KHÔNG dot như E4 hứa**
  file: `tests/scripts/lo-trinh.test.mjs:1779`
  severity: medium
  AC: AC-4
  source: measurement
  detail: E4 ghi rõ «cùng bốn hỏng ở hàng KHÔNG dot → thoát 0 và mỗi cờ hiện sau «cảnh báo:»». AC-4 nêu hai lớp con của ngoài đợt: không `dot` hoặc đợt khác. Dòng 1779 chỉ dựng nhánh ngoài đợt bằng `H('R5', { dot: 'cu' }), H('R6', { dot: 'cu', dung_tren: ['R5'] })`, và `sua(lt, dich, trong ? 'd1' : 'cu')` cũng chỉ truyền 'cu'. Vì thế ma trận chỉ có hai trục {trong đợt, đợt khác} × 4 hỏng = 8 ô. Lớp «hàng không dot», tức đúng lớp mà E4 gọi tên, không có ô nào. Bản sửa S4-r1 (decisions d-11: «LT-133 nay đo đủ tám ô») chỉ lấp ô dung-tren-khong-co ngoài đợt. Phần «chưa ô nào dựng hàng không có dot» mà review lượt 1 đã nêu vẫn còn nguyên. Hệ quả: một bản vật xử lý `dot` vắng khác với `dot` khác (ví dụ `trongDot = r => !r.dot || chuoi(r.dot) === pv.dot`) sẽ đẩy cờ của hàng không dot thành «lỗi:» và thoát 1, nhưng LT-133 vẫn xanh. Dòng PASS tự giới hạn lời tuyên ở «hàng đợt khác», nên lời tuyên hẹp hơn E4.

- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): LT-130 ca ma-rong vẫn chỉ ghim «dòng sai khuôn», không ghim số dòng như E1/AC-1 hứa**
  file: `tests/scripts/lo-trinh.test.mjs:1714`
  severity: low
  AC: AC-1
  source: measurement
  detail: Bản sửa S4-r1 ghim số dòng cho ca `thieu-gach`: `dòng sai khuôn ${khoi.split('\n').length}: ...`. Ca `ma-rong` ở dòng 1714 vẫn là `[khoi + '- `` — mô tả\n', 'dòng sai khuôn']` và được kiểm bằng `x.loi.some(l => l.includes(ghim))`. AC-1 hứa với mã rỗng cũng «lỗi nêu số dòng», E1 hứa «đúng lỗi ghim (nêu mã / số dòng / giá trị)». Vật in `dòng sai khuôn ${i + 1}: ...` (cat-luot.mjs:39), cùng một nhánh `!m || !m[1].trim()` cho cả hai ca. Một bản vật tách nhánh mã rỗng ra và in số dòng sai, chẳng hạn `${i}` hoặc thiếu số, vẫn cho ca này xanh. Phép đo ở ca này vẫn chỉ kiểm chuỗi có mặt, chưa kiểm quan hệ giữa số dòng in ra và vị trí của dòng đã chèn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm-tính-một-mình): LT-137 bỏ qua kết quả của lượt --nhip, nên «nhịp không ghi gì» xanh cả khi lượt nhịp không chạy**
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

- **Malformed milestone `hang` downgrades to a warning and skips the milestone-date rule for rows in the batch, so the check still exits 0 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu danh sách hàng của một mốc bị ghi sai kiểu, máy chỉ cảnh báo và bỏ qua phép kiểm ngày với mốc đó. Một hàng trong đợt đang cắt có thể trễ hơn ngày mốc mà vẫn được cho qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **nhanCuaCo misreads labels that contain ':' or ' thiếu ', so a broken row in the batch only gets a warning (r1 · tệp đã đổi)**
  Người dùng thấy gì: Với mã hàng có dấu hai chấm, một hàng trong đợt đang cắt bị thiếu trường bắt buộc chỉ nhận cảnh báo thay vì lỗi. Việc cắt lượt vẫn qua dù hàng đó chưa hợp lệ.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
