---
schema_version: 1
slug: lan-may-song-qua-bo-phan-loai
feature: làn máy sống qua bộ phân loại — lệnh kiểm cố định thôi phải xin phép từng lần (A) + nghi thức biết đường thoái hoá tuần tự khi fan-out nghẽn (B)
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

Chốt nguyên văn cùng lượt chữ ký Cổng Đáng 25/08 — không sửa số nào so với bản đề xuất.

- Câu hỏi phép đo trả lời: sau khi ship, vòng S4 còn chết vì bộ phân loại
  không, và khi vẫn nghẽn thì có thoát trong MỘT lượt không?
- Kết quả nào là SỐNG: trong 5 vòng S4 kế tiếp trên kho kit (hoặc tới 30/09):
  0 vòng BLOCKED vì bộ phân loại trên lệnh đã cho-phép-sẵn; không còn chuỗi ≥2
  lượt fan-out BLOCKED liên tiếp — lượt kế sau lượt chặn là đường tuần tự và
  thông.
- Kết quả nào là CHẾT: vẫn có chuỗi 2 lượt fan-out chặn liên tiếp, HOẶC danh
  sách cho-phép gây một sự cố thật.
- Số từ: run-log + Iterations của evidence-report — nguồn có sẵn, không cần
  đường đo mới.
- Timebox: 2026-09-30 → không đủ vòng để đo thì `park` với số đã có.

## Người dự

Vòng nội bộ của bộ công cụ: người dùng cuối là chủ kho. Không có người dùng đại
diện ngoài đội để mời; số đo lấy từ sổ của chính các vòng S4 đã chạy.

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho, người ký | mọi phiên chạy S4 trên kho kit |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | (điền khi ký) | — |

## Thảo luận sau khi đã chấm

Máy đo trước 09/09/2026 (phiên đúc kết), cách đo: đọc `decisions.jsonl` của mọi hồ
sơ trong kho lấy entry `stage: S4-r*` có `at` ≥ 25/08 → 18 hồ sơ; đọc `## Iterations`
của 18 hồ sơ đó đếm round và round mang chữ BLOCKED; tìm nguyên nhân từng lượt
BLOCKED trong sổ. Phép đo là proxy văn bản: một lượt chặn do bộ phân loại mà sổ
không ghi chữ «phân loại / cho-phép-sẵn / classifier» sẽ bị bỏ sót.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Vòng S4 quan sát | ≥ 5 vòng kế tiếp trên kho kit, tới 30/09 | 18 hồ sơ · 40 round S4 từ 25/08 tới 09/09 | đủ mẫu |
| Vòng BLOCKED vì bộ phân loại trên lệnh cho-phép-sẵn | 0 | 0 (lượt BLOCKED duy nhất: `lop-bang-chung-nhin-thay` S4-r1 08/09 — nguyên nhân sổ ghi: 7/10 agent dính hạn mức phiên + một agent suite không trả structured output; không phải bộ phân loại) | SỐNG |
| Chuỗi ≥ 2 lượt fan-out BLOCKED liên tiếp | 0 | 0 (1 round BLOCKED trên 40, round kế PASS) | SỐNG |
| Danh sách cho-phép gây sự cố thật | không có | không thấy sự cố nào ghi trong sổ 18 hồ sơ | SỐNG (theo sổ) |

## Quyết định Cổng Giá trị

(người ký điền `verdict`, `decided_by`, `decided_at`, `stage: held`)
