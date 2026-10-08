# Review findings: lo-trinh-cat-luot (round 1)

## Trong hợp đồng

- **Hình dạng 5 (tuyên quét lớp, đo thiếu): LT-133 bỏ ra ngoài ô «dung_tren trỏ mã không có» ở hàng ngoài đợt, chỉ kiểm mã thoát 0 mà không kiểm dòng «cảnh báo:»**
  file: `tests/scripts/lo-trinh.test.mjs:1784`
  severity: high
  AC: AC-4
  detail: AC-4 và E4 hứa ma trận 4 kiểu hỏng × {trong đợt, ngoài đợt}, trong đó ở hàng ngoài đợt mỗi cờ phải hiện sau «cảnh báo:» và mã thoát vẫn 0. Dòng 1784 tách riêng ô `dung-tren-khong-co` ngoài đợt, chỉ kiểm mã thoát 0 rồi `continue`, nên không ghim dòng cảnh báo nào. Chạy thử cho thấy vật im lặng ở ô này: `kiemPhu` trả `canhBao: []` vì cat-luot.mjs dòng 66 chỉ kiểm `dung_tren` trỏ mã không có cho hàng cùng đợt và kiemKhuon không có cờ này. Ma trận chỉ đo 7 trên 8 ô, trong khi dòng PASS vẫn tuyên «ở hàng đợt khác → cảnh báo, thoát 0». Cả bốn ô ngoài đợt chỉ dựng hàng có đợt khác (`dot: 'cu'`), chưa ô nào dựng hàng không có `dot` như AC nêu.
  source: measurement

- **Hình dạng 5 (tuyên quét lớp, đo thiếu): LT-137 tuyên ba lượt (xanh · đỏ · nhịp) không ghi gì nhưng không đo lượt xanh**
  file: `tests/scripts/lo-trinh.test.mjs:1880`
  severity: medium
  AC: AC-8
  detail: AC-8 và E8 hứa băm mọi tệp trước = sau ba lượt. Trong lt137, `truoc` chụp trước lượt xanh, sau lượt xanh có ghi lại lo-trinh.json và `git commit -qam`, rồi `truoc2` mới chụp; chỉ `truoc2` được so với `sau`, còn `truoc` chỉ làm đối chứng cây có đổi. Mọi thay đổi do lượt xanh gây ra trên tệp đã theo dõi bị `commit -a` nuốt và có mặt y hệt ở cả hai bên so; thay đổi bên trong .git cũng lọt. Phép băm vì thế không phủ lượt xanh, chỉ còn `git status --untracked-files=all` bắt tệp mới. Mutant LT-137-do ghi bang-phu.txt ở mọi lượt nên lượt đỏ bắt được, không phân biệt với vật chỉ ghi khi xanh. Phép so `Object.keys(sau)` cũng không thấy tệp bị xoá.
  source: measurement

- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): LT-130 ghim «dòng sai khuôn» mà không ghim số dòng như E1 hứa**
  file: `tests/scripts/lo-trinh.test.mjs:1713`
  severity: low
  AC: AC-1
  detail: E1 hứa mỗi ca hỏng ra đúng lỗi ghim (nêu mã / số dòng / giá trị). Hai ca `thieu-gach` và `ma-rong` (dòng 1713–1714) chỉ ghim chuỗi cố định «dòng sai khuôn» qua `x.loi.some(l => l.includes(ghim))`. Vật in `dòng sai khuôn ${i + 1}: ...` (cat-luot.mjs dòng 39) nhưng ca đo không kiểm số dòng khớp vị trí dòng đã chèn. Một bản vật báo sai số dòng, ví dụ `${i}` hay luôn in 0, vẫn cho LT-130 xanh.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The scope template says the reader only reads the PHAM-VI-MA marker block, but `docPhamVi` reads the whole file**
  Người dùng thấy gì: Khuôn bản phạm vi hứa rằng chỉ phần giữa hai dấu mốc được máy đọc, nhưng thực tế máy đọc cả tệp. Nếu ai đó ghi chú thêm một dòng cùng dạng với mã ngoài khối, máy sẽ tính nó như một mã thật hoặc báo lỗi oan.
  file: `skills/acceptance/references/pham-vi-template.md`
  severity: low
  Đề xuất: known-limits

- **SKILL sends Core «Never» cells to `da_bac`, but the coverage check gives `da_bac` no credit**
  Người dùng thấy gì: Hướng dẫn cắt lượt bảo đưa các mục «không bao giờ làm» vào danh sách đã bác, nhưng bước kiểm tra phủ không tính chúng. Người cắt có thể liệt kê chúng thành mã và bị báo đỏ, hoặc bỏ chúng đi và mất dấu vết.
  file: `skills/cat-luot/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Malformed milestone `hang` downgrades to a warning and skips the milestone-date rule for rows in the batch, so the check still exits 0**
  Người dùng thấy gì: Nếu danh sách hàng của một mốc bị ghi sai kiểu, máy chỉ cảnh báo và bỏ qua phép kiểm ngày với mốc đó. Một hàng trong đợt đang cắt có thể trễ hơn ngày mốc mà vẫn được cho qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **nhanCuaCo misreads labels that contain ':' or ' thiếu ', so a broken row in the batch only gets a warning**
  Người dùng thấy gì: Với mã hàng có dấu hai chấm, một hàng trong đợt đang cắt bị thiếu trường bắt buộc chỉ nhận cảnh báo thay vì lỗi. Việc cắt lượt vẫn qua dù hàng đó chưa hợp lệ.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
