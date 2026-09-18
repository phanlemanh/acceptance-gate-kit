---
schema_version: 1
slug: phep-do-o-doc-lap-thuoc-co-cua
feature: Ba phép đo của vòng thuoc-co-cua tuyên đo từng ô mà ô không độc lập hoặc giá trị mẫu trùng — làm lại để chiều đỏ của từng ô là của chính ô ấy
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-09-17T17:33:29Z   # ISO UTC — owner chọn «build, 2.16→2.17» một chạm, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

# Cơ hội: phép đo của thuoc-co-cua phải phân biệt được từng ô

**Mở:** 2026-09-17, từ Ngoài-3, Ngoài-4, Ngoài-5 của vòng `thuoc-co-cua`. Owner quyết «mở hợp
đồng mới» tại Cổng Bằng chứng; máy gộp ba mục vào một ô vì cùng một lớp.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/thuoc-co-cua — ba finding ngoài hợp đồng của vòng, owner chấm build 18/09

Ba ca kiểm của vòng tuyên đo quan hệ từng ô nhưng không đứng được trên từng ô:

- Ca DN3-IM trong `tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs` cộng dồn các ô trong cùng một
  kho. Chiều đỏ của ô 2 và ô 3 vì thế là đỏ do dư của ô trước, không phải của chính ô.
- Ca GT1 trong `tests/scripts/gate-card-thuoc-vat.test.mjs` dùng giá trị mẫu trùng nhau. Thẻ in
  nhầm cột vật và thước vẫn xanh.
- Ca GN4/GN1 trong `tests/scripts/gate-card-duong-nen.test.mjs` cũng dùng giá trị chân nền trùng
  nhau. Thẻ đọc nhầm chân này sang chân kia vẫn xanh.

Người hưởng: người ký ở Cổng Bằng chứng của các vòng dùng đường nền và bộ đếm. Hôm nay dòng số và
khối nền trên thẻ có thể sai cột mà không ca nào đỏ.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mỗi ô dựng kho riêng và giá trị mẫu đôi một khác nhau là đủ để chiều đỏ của từng ô lật riêng | phải đổi khuôn phép đo chứ không chỉ đổi fixture | bản sao đổi chỗ hai cột trên thẻ phải làm GT1 đỏ; bản sao nới vị ngữ phải làm lật đúng từng ô DN3-IM khi chạy riêng ô ấy | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đột biến đổi chỗ hai giá trị trên thẻ, hoặc chỉ nới đúng một ô của vị ngữ, có làm đỏ đúng ca và đúng ô không?
- Kết quả nào là SỐNG: ba đột biến (đổi cột vật/thước · đổi chân nền · nới một ô DN3-IM) mỗi cái làm đỏ đúng một ca, chạy riêng ô vẫn lật.
- Kết quả nào là CHẾT: phải thêm khoá config hay lượt gọi người để làm được; hoặc sửa làm đổi hành vi của vật.
- Timebox: một vá-trong-mốc ở cửa sổ 2.16 → 2.17, cạnh router; không mở vòng meta riêng, không làm trong cửa sổ 2.15 → 2.16 (suất meta của cửa sổ ấy đã dùng cho thuoc-co-cua — luật b).

## Out of scope từ khám phá

- Hai finding ngoài hợp đồng khác của lượt chấm 1 (bộ đếm không giới hạn theo slug · dòng `fatal:` của git lọt ra đầu ra) — rơi khỏi thẻ Cổng Bằng chứng do luật carry; owner ghi Known limits 18/09 (sổ known-limits, dòng thuoc-co-cua#3 và #4); không thuộc ô này.

## Cổng 0

- **decision = build** (owner ký một chạm). Căn cứ: ba finding ngoài hợp đồng của vòng `thuoc-co-cua` cùng một lớp — phép đo tuyên từng ô mà ô không độc lập hoặc giá trị mẫu trùng; owner quyết «mở hợp đồng mới» ở Cổng Bằng chứng 17/09. Người dùng kit được: dòng vật · thước · nhát và khối nền trên thẻ không thể sai cột mà ca vẫn xanh. Mất: một vá-trong-mốc (ba tệp ca, không chạm vật).
- **disposition = không áp dụng** — không dựng prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** như mục «Ngưỡng chết / ngưỡng UAT» ở trên, đã gỡ tiền tố đề xuất; timebox ghi rõ cửa sổ.
