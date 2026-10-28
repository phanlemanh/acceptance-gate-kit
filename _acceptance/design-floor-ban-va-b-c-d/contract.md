---
schema_version: 1
feature: design-floor bước 2b — bản vá cục bộ B, C, D cho lõi Design OS vendored — mã thoát ba trạng thái, đầu vào tường minh, không module Figma trong đóng kín; khối máy hết giới hạn
slug: design-floor-ban-va-b-c-d
owner: phanlemanh@gmail.com
risk_tier: T2               # design-floor/** + tests/design-floor/** — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-27-design-floor-ban-va-b-c-d-design.md
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-27T08:45:03Z
---

# Acceptance Contract: design-floor-ban-va-b-c-d

## Context

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — DF-01, DF-03, DF-04, DF-05, DF-06 và phần figma của
FN-02 còn đỏ có chủ đích trên bản gói sau FL2 (#427, bản vá A). Hàng FL3 đóng chúng bằng ba bản vá cục bộ ghi sổ
LOCAL-PATCHES; không gửi PR upstream (chủ kho 26/10).

## Criteria

- AC-1: Given bản gói có bản vá B, When chạy `hop-dong.mjs --chi DF-01`, Then DF-01 PASS: `ui gate` trên `.eyebrow{color:#888}`
  nền không khai thoát 5; đối chứng cùng lượt — cùng trang nền trắng khai rõ ra `low-contrast` và thoát 2 (FAIL thắng 5).
- AC-2: Given bản gói có bản vá B, When chạy DF-04, Then bốn lệnh chấm (gate · token-coverage · reuse-plan check · flow
  lint) thoát 3 khi thiếu tệp đích, 4 khi có cờ lạ, 2 khi có lỗi thật trong JSON — DF-04 PASS với chuỗi `3/4/2` ở cả bốn.
- AC-3: Given đích `layout.tsx` có `<html lang><title>`, When gọi gate và token-coverage, Then cả hai thoát 5 (DF-05
  PASS); đối chứng: cùng nội dung đuôi `.html` → gate thoát 0.
- AC-4: Given trang không có khai báo CSS nào, When gọi token-coverage, Then thoát 5 (DF-06 PASS); đối chứng: trang có hex
  thô → token-coverage thấy giá trị thô và thoát 2.
- AC-5: Given bản gói có bản vá C và một design system mồi ở thư mục cha, When gọi gate/token-coverage/reuse-plan check
  thiếu `--tokens` và reuse-plan check thiếu `--file`, Then cả bốn lời gọi thoát 4 (DF-03 PASS); DF-02 PASS với đối chứng
  mới: trỏ `--tokens` tường minh vào token của mồi thì kết quả gate KHÁC — chứng mồi có nội dung đổi được kết quả.
  DF-03 in đủ bốn lời gọi kèm mã: `gate -tokens=4 · token-coverage -tokens=4 · reuse-plan check -tokens=4 · reuse-plan check
  -file=4`. Chiều đỏ thứ hai: gỡ riêng vế đòi `--file` khỏi bản vendored của bản sao → DF-03 FAIL nêu `reuse-plan check -file`.
  Chiều đỏ: argv của gate trong bản sao khối máy trỏ `--tokens` vào mồi → DF-02 FAIL «kết quả đổi theo mồi: gate».
- AC-6: Given bản gói có bản vá D, When chạy `rao-dong.mjs`, Then FN-02 PASS (không cặp lệnh·module cấm nào trong đóng
  kín giao đi — ba cặp figma còn lại sau FL2 đã rời, ngưỡng «bốn cặp» của hàng đọc là ba: sổ FL2 `d-20261027T055346Z-18`)
  và FN-04 PASS trong trần 124 tệp · 18 900 dòng.
- AC-7: Given khối máy hợp đồng nhập và sổ LOCAL-PATCHES, When đọc, Then `gioi_han` rỗng; sổ có A, B, C, D đều `da-ap`,
  mỗi dòng mang tệp · băm trước/sau · vì sao · phép đo nó làm xanh · tệp diff; không dòng `cho-va`. Các đột biến luật giới
  hạn của `tu-thu.mjs` (thiếu `ban_va`, thiếu `can_upstream`, con trỏ chết, trỏ bản vá đã áp, XPASS, khác chữ ký, không
  khai…) vẫn đỏ đúng thông điệp — mỗi đột biến tự thêm dòng `cho-va` vào bản sao sổ khi cần.
- AC-8: Given bản vendored, When dựng lại bản trước-vá rồi áp mọi bản vá TRỪ một và dựng lại bản gói (cùng đường mã cho
  bản áp đủ — đối chứng dương: bản áp đủ cả bốn chạy DF-01…09 + FN-02 XANH hết), Then TẬP phép đo đỏ BẰNG đúng tập viết
  độc lập, các phép đo khác vẫn PASS: bỏ A → {DF-07, DF-08, FN-02}; bỏ B → {DF-01, DF-03, DF-04, DF-05, DF-06} (C trả 4
  nhờ bảng mã của B, nên DF-03 đỏ theo); bỏ C → {DF-03}; bỏ D → {FN-02}.
- AC-9: Given A và B cùng sửa `gate.ts` và D tạo `dtcg-token-tree.ts`, When chạy VA-01, FN-01, BG-01 và `dong-bo.mjs
  --kiem`, Then cả bốn xanh: VA-01 đọc sổ theo chuỗi từng tệp, tệp do bản vá tạo không là «tệp lạ». Chiều đỏ: `sau` của
  bản vá A cho `gate.ts` sai → VA-01 FAIL «truoc của bản vá B ≠ sau trước đó»; `truoc` của tệp D tạo khác null → VA-01 FAIL.

## Coverage

Bỏ quét — xem sổ `d-20261027T083902Z-11`: phạm vi đã chốt bởi điều kiện bật của hàng
FL3 và bảng bản vá ở bước 4 của kế hoạch.

## Out of scope

- Chế độ chữ (không `--json`) giữ mã 1 cho lỗi đầu vào — argv khối máy luôn có `--json`.
- Phép đo kích một lần sập thật để chứng lỗi nội bộ thoát 1 (thoát 1 theo cấu tạo của bản vá B và vỏ).
- Móc design-floor vào S0–S4 (FL4, FL5); `ui gate` ở S4 (FL-C1).
- DF-07 thiếu đối chứng «lệnh đã chạy thật» (Known limit Ngoài-4/7 của FL2).

## Notes

- AC-1…AC-6 của hồ sơ này THAY THẾ vế «còn đỏ có chủ đích (XFAIL)» của AC-5 (FN-02 ba cặp figma) và AC-6 (DF-01, DF-03,
  DF-04, DF-05, DF-06) của `design-floor-vendor-va-ban-va-a` — hợp đồng đã ký ấy KHÔNG sửa; ca đo `khoi-may-ban-va-a.mjs`
  của nó đổi theo đúng lời hứa của bản vá A (không cặp `memory-*`, không giới hạn DF-07/DF-08).

- Ngoài-2, Ngoài-6, Ngoài-7, Ngoài-8 (chọn ở Cổng Bằng chứng 2026-10-27: mở hợp đồng mới): ghi thành hạt giống `docs/plans/2026-10-27-hat-giong-fl3-xanh-gia-reuse-plan-va-gate.md`.
- Ngoài-5 (chọn ở Cổng Bằng chứng 2026-10-27: chấp nhận, không sửa): chú thích trong mã bản vendored lệch sau bản vá B, C; hành vi không đổi.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-27:
  - Ngoài-1: Trang không phải HTML mà còn thiếu tệp token hay giá trị sai thì báo «không đo được» thay vì «thiếu đầu vào» — không có xanh giả, chỉ sai nhãn lý do.
  - Ngoài-3: Với trang không đo được, dòng chữ và trường kết quả vẫn ghi «PASS» dù mã thoát là không-đo-được; máy gác cổng đọc mã thoát nên không bị lừa.
  - Ngoài-4: Bản chép trung tính của mô-đun token chưa có phép đo giữ nó giống bản gốc; khi đổi bản ghim, bản sửa ở tệp gốc có thể không vào lõi chấm.
  - Ngoài-9: Đối chứng mới của DF-02 so trọn đầu ra, mà đầu ra chứa chính đường tệp token, nên luôn «khác» — chưa chứng mồi thật sự đổi kết quả.
  - Ngoài-10: Phép kiểm sổ vá sạch chưa có chiều đỏ riêng, và mô tả E7 hứa một ca đỏ mà lệnh của nó không chạy.

Known limits (khai từ thiết kế):
- Chế độ chữ (không `--json`): thiếu tệp và thiếu đầu vào bắt buộc trả 1 (errText không mang mã lỗi); cờ lạ trả 4 (vỏ của
  kit); chế độ JSON theo bảng 3/4.
