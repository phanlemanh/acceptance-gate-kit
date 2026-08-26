---
schema_version: 1
slug: duong-do-trong-dinh-nghia-xong
feature: Đường đo nằm trong định-nghĩa-xong — ngưỡng khai trước phải truy được thành tiêu chí
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-21T14:00:00Z    # ISO UTC — mốc XẤP XỈ theo hội thoại «Gật dây A → B → C» 21/08 (máy điền, ±30 phút)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Ngưỡng khai ở Cổng Đáng không có ô trong contract nên không truy được thành AC; lỗ L1 của rà soát 21/08, người trả giá là owner ký trên thước trang trí. Đề bài đầy đủ: `docs/plans/2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md`.

## Ngưỡng chết / ngưỡng UAT

Không đo được — vòng nội bộ của bộ công cụ, không có người dùng cuối để mời phiên nghiệm thu; người dùng thay thế là chính đội tự dùng kit. Ô «Đường đo» của hợp đồng đã bỏ có tên cùng lý do (entry d-20260822T000500Z-4306). Khai bổ sung 2026-08-23 theo lối ra có tên do hồ sơ `ra-co-ten-lam-va-trao` mở — KHÔNG sửa `decision`, KHÔNG sửa người ký hay ngày ký.

## Cổng 0

- **decision = build** Căn cứ: owner gật dây A → B → C ngày 21/08 (chip C); mở vòng sau chip B.
