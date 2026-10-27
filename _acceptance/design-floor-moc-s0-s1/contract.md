---
schema_version: 1
feature: design-floor bước 2c — móc S0 (đọc bậc M0–M3 của kho) và S1 (định tuyến tri thức thiết kế có trần, kiểm kế hoạch dùng lại, flow lint) thành dòng thông tin trên thẻ Cổng Phạm vi
slug: design-floor-moc-s0-s1
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/** + feature-loop/skills/** + tests/** — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-27-design-floor-moc-s0-s1-design.md
status: verified
approved_by: Manh Phan
approved_at: 2026-10-27
---

# Acceptance Contract: design-floor-moc-s0-s1

## Context

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — phạm vi v1 chốt 26/10: flow lint ở Cổng 1 và định
tuyến chỉ mục tri thức thiết kế. Bản gói `design-floor/dist/ui.mjs` đã đúng hợp đồng nhập sau FL3 (#429) nhưng chưa
bước nào của vòng gọi nó.

## Criteria

- AC-1: Given bốn kho fixture sinh bằng mã — không khai gì (M0), khai `design.surface_globs` khớp tệp (M1), thêm
  `design_floor.tokens` và `design_floor.registry` trỏ tệp có thật (M2), thêm `design_floor.niem_phong` (M3), When chạy
  lệnh bậc ở S0, Then mỗi kho ra đúng bậc của nó với lý do một dòng, và ở M0 lệnh không in gì, thoát 0.
- AC-2: Given khai báo hỏng — `niem_phong` có mà `tokens` vắng, hay `tokens` trỏ tệp không có, hay `tokens` có mà
  `registry` vắng, hay `surface_globs` không khớp tệp nào, When đọc bậc, Then lệnh hạ về bậc thấp hơn mà điều kiện thật sự đủ, in lý do gọi tên khoá hỏng, thoát 0
  (không chặn vòng).
- AC-3: Given kho M1–M3 và hồ sơ có hợp đồng, When chạy lệnh S1, Then lệnh chọn tối đa hai tệp tri thức theo số thẻ `when`
  khớp chữ của hồ sơ (điểm cao trước, hoà theo thứ tự chỉ mục), ghi `design-floor.json` với đường tệp và token ước lượng
  của chỉ mục và từng tệp; hồ sơ khớp năm mục → đúng hai mục điểm cao nhất; khớp không mục nào → chỉ chỉ mục.
- AC-4: Given chỉ mục hay tệp tri thức lệch băm của tệp khoá, hoặc không có bản ghim để đọc, When chạy lệnh S1, Then
  dòng tri thức ghi «không đọc được ở đây» kèm lý do, không tệp nào được trỏ, lệnh thoát 0 và hai kiểm còn lại vẫn chạy.
- AC-5: Given kho M2 và hồ sơ có `reuse-plan.md`, When chạy lệnh S1, Then `ui reuse-plan check` chạy với `--file` và
  `--tokens` từ khai báo kho, kết quả dịch thành «đạt» (mã 0), «trượt (N tên)» (mã 2) hay «không đo được (mã k)» (3/4/5)
  theo bảng mã của bản gói; ở M1 dòng ghi «chưa khai nguồn — không kiểm» và lệnh `ui` không được gọi.
- AC-6: Given hồ sơ có `flow.json`, When chạy lệnh S1, Then `ui flow lint` chạy và dòng ghi «đạt» hay «trượt (N lỗi)»; hồ
  sơ không có `flow.json` hay `reuse-plan.md` thì không có dòng tương ứng.
- AC-7: Given `design-floor.json` của hồ sơ, When dựng thẻ Cổng Phạm vi, Then thẻ in khối «Sàn thiết kế» với đúng các dòng
  của tệp, `routing.hoi` của thẻ không thêm mục nào; hồ sơ không có tệp → HTML thẻ giống từng byte thẻ dựng bằng
  `scripts/` của nhánh chính trước vòng.
- AC-8: Given lệnh S1 chạy trên kho M2, When so cây trước và sau, Then lệnh chỉ ghi `design-floor.json` và một dòng nối
  vào `usage-report.md` của hồ sơ — `_acceptance/config.yaml` và mọi tệp khác giữ nguyên băm; dòng usage-report mang số
  token của chỉ mục và từng tệp đã chọn. Cùng lệnh trên kho M0: stdout rỗng, thoát 0, băm mọi tệp trước và sau bằng
  nhau.
- AC-9: Given SKILL feature-loop, When rút lệnh từ khối marker S0 và khối marker S1 rồi chạy trên kho fixture M2, Then
  đầu ra bằng đầu ra gọi trực tiếp hai lệnh; đột biến bỏ khối khỏi bản sao SKILL → ca đỏ gọi tên khối thiếu.

- AC-10: Given mạng và bản ghim `a7ad5f1`, When lệnh S1 tải chỉ mục tri thức thật vào bộ đệm ngoài cây kho, Then băm
  chỉ mục và băm mọi tệp chỉ mục trỏ tới khớp khối `tri_thuc` của `design-floor/upstream.lock.json`; một vòng mẫu trên
  hồ sơ fixture chọn không quá hai tệp thật. Không mạng (`DESIGN_FLOOR_KHONG_MANG=1`) → ca in SKIP có tên, không xanh
  giả.

## Coverage

Bỏ quét — xem sổ (dòng «bỏ coverage-scan»): phạm vi đã chốt bởi điều kiện bật của hàng FL4 và mục «Móc vào
feature-loop» của kế hoạch, bước 4.

## Đường đo

- Bốn kho fixture M0–M3 ra đúng bậc — số từ ca BAC-M0…M3 của lệnh bậc · AC-1, AC-2.
- Ở M0 design-floor không in dòng nào — số từ stdout rỗng của lệnh bậc và lệnh S1, băm cây không đổi · AC-1, AC-8.
- Một vòng mẫu nạp không quá ba tệp tri thức — số từ design-floor.json (chỉ mục + ≤2 tệp) trên chỉ mục do mã sinh và chỉ mục thật · AC-3, AC-10.
- Thẻ Cổng 1 không có dòng design-floor nào là câu hỏi — số từ routing.hoi của thẻ không đổi · AC-7.
- Mỗi điểm móc có một đột biến đỏ đúng ca — số từ các ca đột biến S0, S1, thẻ, khối SKILL · AC-1, AC-3, AC-5, AC-7, AC-8, AC-9.

## Out of scope

- Chặn theo bậc (M1 chỉ luật đã phân xử · M2 cảnh báo · M3 mọi kiểm chặn) — thuộc S4, hàng FL5.
- Cuối S3 autofix và sinh lại tệp dẫn xuất; S4 chấm tuân thủ design system; `ui gate` ở S4 (FL-C1).
- Máy tự ghi niêm phong M3 hay tự nâng bậc bằng cách sửa cấu hình kho.
- Sinh `reuse-plan.md` hay `flow.json` — vòng này chỉ kiểm khi phiên S1 đã viết chúng.

## Notes

- Hai lối của Hỏi-2 đổi AC thế này: lối tải lúc chạy giữ nguyên AC-3, AC-4, AC-10 như viết; lối đưa tri thức vào kit đổi
  AC-4 vế «không có bản ghim» thành «thiếu tệp vendored», AC-10 thành phép khớp băm trên cây kit (không cần mạng), và AC-8
  không đổi (bộ đệm và bản vendored đều ngoài hồ sơ).

Known limits (khai từ thiết kế):
- Kho có giao diện mà chưa khai `design.surface_globs` đọc ra M0 — bậc đi theo khai báo, không theo dò đuôi tệp.
- Định tuyến tri thức khớp chữ theo thẻ `when` của chỉ mục, không hiểu nghĩa: câu giao không dùng từ của thẻ thì không
  chọn được tệp.
