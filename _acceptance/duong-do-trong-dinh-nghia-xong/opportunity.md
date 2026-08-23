---
schema_version: 1
slug: duong-do-trong-dinh-nghia-xong
feature: Đường đo nằm trong định-nghĩa-xong — ngưỡng khai trước phải truy được thành tiêu chí
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: park         # build | iterate | park | kill — người ký Cổng 0 điền
# ⚠ `park` Ở ĐÂY KHÔNG CÓ NGHĨA «đã quyết không làm». Việc này ĐÃ LÀM và ĐÃ
# GIAO (contract signed-off 21/08). Owner đổi sang `park` ngày 2026-08-23 để
# ĐÓNG Cổng Giá trị đang treo: cả bốn dòng ngưỡng chưa bao giờ được điền, nên
# phiên nghiệm thu không có gì đặt cạnh số — cổng không có câu hỏi nào để hỏi,
# tức trạm thu phí theo đúng chữ North Star. Bản đồ vì vậy xếp nó «Đã giao»,
# đó là sự thật. Xem entry `gia-tri-park` trong decisions.jsonl.
decided_by: Manh Phan
decided_at: 2026-08-21T14:00:00Z    # ISO UTC — mốc XẤP XỈ theo hội thoại «Gật dây A → B → C» 21/08 (máy điền, ±30 phút)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Ngưỡng khai ở Cổng Đáng không có ô trong contract nên không truy được thành AC; lỗ L1 của rà soát 21/08, người trả giá là owner ký trên thước trang trí. Đề bài đầy đủ: `docs/plans/2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md`.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: — ĐÓNG 2026-08-23 bằng `decision: park`. Ngưỡng chưa từng điền nên
  vòng này KHÔNG có số đo giá trị; cái đã giao vẫn còn nguyên trong sản phẩm.

## Cổng 0

- **decision = build** Căn cứ: owner gật dây A → B → C ngày 21/08 (chip C); mở vòng sau chip B.
