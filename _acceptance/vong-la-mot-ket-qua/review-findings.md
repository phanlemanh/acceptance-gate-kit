# Review findings: vong-la-mot-ket-qua (round 1)

## Trong hợp đồng

- **Hình dạng 3 — LT-143 kiểm «dòng nêu con số» bằng chuỗi có mặt, nhưng mã hàng đã chứa sẵn con số đó nên phép kiểm luôn qua**
  file:line: `tests/scripts/lo-trinh.test.mjs:2459`
  severity: medium
  AC: AC-2
  source: measurement
  detail: Trong lt143, ma trận 16 cỡ đặt tên hàng là `C${i+1}` và cho cỡ đúng bằng i+1 (dòng `const MT = [...Array.from({ length: 16 }, (_, i) => [`C${i + 1}`, i + 1]) ...]`). Phép kiểm vế «nêu con số» là `ds[0].includes(JSON.stringify(v).replace(/^"|"$/g, ''))`, nhưng `ds[0]` đã qua `startsWith(`${m[1]}: hàng ${ma} [`)`, tức dòng nào cũng chứa «hàng C11», mà «C11» đã chứa «11». Vì vậy với cả 16 phần tử cỡ, vế con số không bao giờ đỏ. Ví dụ: nếu cat-luot.mjs in sai số (cờ can-tach in `dự kiến ${k.tach_tu}` thay vì `${v}`, nên hàng C14 ra «dự kiến 13 tiêu chí»), dòng vẫn chứa «14» nhờ mã «C14» và LT-143 vẫn PASS. Thế nhưng E2 và thông điệp ok hứa «mỗi hàng … nêu con số». Lời hứa là một QUAN HỆ (số trong câu cờ == tieu_chi của hàng), còn assert chỉ kiểm chuỗi có mặt. Lỗi chỉ không xảy ra ở bốn phần tử sai kiểu CS1–CS4, vì tên của chúng không chứa giá trị.

- **Hình dạng 4/3 — ca «cho-phep-nho» của LT-142 ghim tên khoá mà một thông điệp khác cũng chứa, nên không biết lỗi bắt được có phải đúng lỗi của ca này**
  file:line: `tests/scripts/lo-trinh.test.mjs:2423`
  severity: low
  AC: AC-1
  source: measurement
  detail: Ca `['cho-phep-nho', thay('cho_phep_den: 12', 'cho_phep_den: 9'), 'cho_phep_den']` chỉ đòi `z.status === 2 && z.stderr.includes('cho_phep_den')`. Trong docKhoang (scripts/cat-luot.mjs dòng 136-137), thông điệp của phép kiểm tach_tu là «khoá tach_tu ${t} phải bằng cho_phep_den + 1 = …», nên nó cũng chứa «cho_phep_den». Nếu gỡ phép kiểm `if (c < cuoi)` (đột biến: cho_phep_den 9 nhỏ hơn cuối mục tiêu 10 không còn bị bắt), khối 9/13 vẫn thoát 2 qua nhánh tach_tu với stderr «khoá tach_tu 13 phải bằng cho_phep_den + 1 = 10 (khoảng hở)». Ca vẫn xanh dù phép kiểm mà nó đại diện đã mất. Thông điệp ghim không đặc trưng cho phép kiểm đang đo, nên ca này không phân biệt được «bắt đúng lỗi» với «một phép kiểm khác bắt hộ». Cách sửa trong phạm vi phép đo: ghim cụm riêng của nhánh, ví dụ «nhỏ hơn cuối muc_tieu».

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SKILL still says every `cảnh báo:` line is about rows outside the batch, but the new size flags now print `cảnh báo:` lines for rows inside the batch**
  Người dùng thấy gì: Hướng dẫn cắt lượt vẫn nói mọi dòng cảnh báo là về hàng cũ ngoài đợt, nên phiên cắt có thể bỏ qua gợi ý gộp cho chính đợt của mình và chỉ dán vào mô tả PR.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits
- **SKILL tells consumer repos to edit the size range as «chủ kho» policy, but the script only reads the plugin's own SKILL**
  Người dùng thấy gì: Hướng dẫn bảo chủ kho tự sửa khoảng cỡ trong repo của mình, nhưng thực tế repo đó không có chỗ nào để sửa; muốn đổi phải đổi ở bản phát hành chung của kit và áp cho mọi kho.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits
- **Closing marker of the CAT-LUOT-BANG-CO table is glued to the «Thoát 2» sentence, breaking the exit-code explanation in step 4**
  Người dùng thấy gì: Trong hướng dẫn, phần giải thích khi nào lệnh dừng với lỗi bị tách khỏi chỗ cần đọc và thiếu một nguyên nhân mới, nên người đọc dễ hiểu sai vì sao lệnh dừng.
  file: `skills/cat-luot/SKILL.md`
  severity: low
  Đề xuất: known-limits
- **`vai: nền` (with diacritics) is read as a role name and blocks with a misleading `vai-khong-mo-cau` error**
  Người dùng thấy gì: Nếu phiên cắt ghi vai việc nền có dấu tiếng Việt, hệ thống chặn bằng thông báo nói sai chỗ lỗi (nói câu giao sai trong khi lỗi là cách viết chữ), làm mất thời gian tìm nguyên nhân.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits
- **Size gauge silently drops a record it cannot read**
  Người dùng thấy gì: Nếu một hồ sơ bị khoá quyền đọc, đồng hồ cỡ lặng lẽ bỏ nó mà không báo, nên con số in ra nhìn như đầy đủ nhưng thiếu hồ sơ đó.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits
- **--tu date check accepts impossible dates such as 2026-02-31**
  Người dùng thấy gì: Gõ nhầm một ngày không tồn tại như 31 tháng 2 làm đồng hồ lọc theo mốc sai mà không báo lỗi, nên số đo có thể lệch mà người xem không biết.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits
- **Role check passes when the role is only a prefix of the sentence's first word**
  Người dùng thấy gì: Một hàng ghi vai ngắn hơn từ đầu câu giao vẫn được coi là đúng dáng, nên một số câu giao lệch vai lọt qua mà không bị nhắc.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
