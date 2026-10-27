---
schema_version: 1
slug: design-floor-vendor-va-ban-va-a
feature: Bản lõi gọn Design OS nằm trong kit khớp từng băm của tệp khoá, có sổ LOCAL-PATCHES, và với bản vá A không lệnh v1 nào ghi tệp ngoài đích
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-27T03:56:31Z   # chủ kho gõ «Duyệt, Đồng ý» ở thẻ khởi tạo đợt design-floor-2710 (phiên giám sát), máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: FL2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng FL2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626` — chưa có trang: trang nền, trang đợt design-floor-2710
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Bản lõi gọn Design OS nằm trong kit khớp từng băm của tệp khoá, có sổ LOCAL-PATCHES, và với bản vá A không lệnh v1 nào ghi tệp ngoài đích

Vì sao: Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — hợp đồng nhập, tệp khoá 124 tệp và bộ đo bước 1 đã gộp; DF-07/DF-08 đỏ vì lệnh chấm ghi sổ sự kiện. Trang acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «CI so băm 124 tệp với tệp khoá và đỏ khi một tệp lệch; DF-07, DF-08 và 16 cặp memory của FN-02 xanh trên bản vendored và giới hạn tương ứng đã gỡ khỏi khối máy; sửa một byte của tệp vendored ngoài sổ vá thì CI đỏ đúng tệp» chưa?
- Kết quả nào là SỐNG: [đề xuất] CI so băm 124 tệp với tệp khoá và đỏ khi một tệp lệch; DF-07, DF-08 và 16 cặp memory của FN-02 xanh trên bản vendored và giới hạn tương ứng đã gỡ khỏi khối máy; sửa một byte của tệp vendored ngoài sổ vá thì CI đỏ đúng tệp
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «CI so băm 124 tệp với tệp khoá và đỏ khi một tệp lệch; DF-07, DF-08 và 16 cặp memory của FN-02 xanh trên bản vendored và giới hạn tương ứng đã gỡ khỏi khối máy; sửa một byte của tệp vendored ngoài sổ vá thì CI đỏ đúng tệp» khi hết timebox
- Timebox: …
