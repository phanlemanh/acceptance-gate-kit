# Review findings: vong-la-mot-ket-qua (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SKILL still says every `cảnh báo:` line is about rows outside the batch, but the new size flags now print `cảnh báo:` lines for rows inside the batch (r1)**
  Người dùng thấy gì: Hướng dẫn cắt lượt vẫn nói mọi dòng cảnh báo là về hàng cũ ngoài đợt, nên phiên cắt có thể bỏ qua gợi ý gộp cho chính đợt của mình và chỉ dán vào mô tả PR.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **SKILL tells consumer repos to edit the size range as «chủ kho» policy, but the script only reads the plugin's own SKILL (r1)**
  Người dùng thấy gì: Hướng dẫn bảo chủ kho tự sửa khoảng cỡ trong repo của mình, nhưng thực tế repo đó không có chỗ nào để sửa; muốn đổi phải đổi ở bản phát hành chung của kit và áp cho mọi kho.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Closing marker of the CAT-LUOT-BANG-CO table is glued to the «Thoát 2» sentence, breaking the exit-code explanation in step 4 (r1)**
  Người dùng thấy gì: Trong hướng dẫn, phần giải thích khi nào lệnh dừng với lỗi bị tách khỏi chỗ cần đọc và thiếu một nguyên nhân mới, nên người đọc dễ hiểu sai vì sao lệnh dừng.
  file: `skills/cat-luot/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **`vai: nền` (with diacritics) is read as a role name and blocks with a misleading `vai-khong-mo-cau` error (r1)**
  Người dùng thấy gì: Nếu phiên cắt ghi vai việc nền có dấu tiếng Việt, hệ thống chặn bằng thông báo nói sai chỗ lỗi (nói câu giao sai trong khi lỗi là cách viết chữ), làm mất thời gian tìm nguyên nhân.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Size gauge silently drops a record it cannot read (r1)**
  Người dùng thấy gì: Nếu một hồ sơ bị khoá quyền đọc, đồng hồ cỡ lặng lẽ bỏ nó mà không báo, nên con số in ra nhìn như đầy đủ nhưng thiếu hồ sơ đó.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **--tu date check accepts impossible dates such as 2026-02-31 (r1)**
  Người dùng thấy gì: Gõ nhầm một ngày không tồn tại như 31 tháng 2 làm đồng hồ lọc theo mốc sai mà không báo lỗi, nên số đo có thể lệch mà người xem không biết.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Role check passes when the role is only a prefix of the sentence's first word (r1)**
  Người dùng thấy gì: Một hàng ghi vai ngắn hơn từ đầu câu giao vẫn được coi là đúng dáng, nên một số câu giao lệch vai lọt qua mà không bị nhắc.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
