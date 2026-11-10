---
schema_version: 1
feature: Thẻ Cổng Bằng chứng và trang bằng chứng hiện mọi lỗi trong hợp đồng còn mở, và không mời ký nhanh khi còn lỗi
slug: the-hien-loi-trong-hop-dong
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ + feature-loop/workflows/ + hai tệp ca — không chạm t3_paths
surfaces: [cli, ui]
design_doc: docs/superpowers/specs/2026-11-10-the-hien-loi-trong-hop-dong-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: the-hien-loi-trong-hop-dong

## Context

Lượt chấm có thể trả PASS khi còn lỗi trong hợp đồng mức vừa, và trước bản vá thẻ Cổng Bằng chứng vẫn mời ký nhanh trong
khi người ký không thấy lỗi. Vòng này đưa các lỗi đó lên thẻ và trang bằng chứng bằng tiếng sản phẩm, và buộc bên viết
tạo ra câu cho người đọc. Ca thật: `do-tuong-phan-lab-oklab`, lỗi chạm AC-10.

Source input: prompt của phiên điều phối; hạt giống docs/plans/2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md

## Criteria

- AC-1: Given hồ sơ PASS còn một lỗi trong hợp đồng mức vừa, When dựng thẻ Cổng Bằng chứng, Then thẻ không có lời mời ký nhanh, có nhãn «cần bạn quyết», có câu tiếng sản phẩm của lỗi và mã tiêu chí bị chạm, không có chữ «không lỗi».
- AC-2: Given hồ sơ còn hai lỗi trong hợp đồng khác mức, When dựng thẻ, Then cả hai lỗi đều hiện và số lỗi trên nhãn đầu thẻ và tiêu đề khối đều là 2.
- AC-3: Given hồ sơ còn lỗi trong hợp đồng, When dựng trang bằng chứng, Then khối lỗi có câu tiếng sản phẩm và mã tiêu chí, nằm ngoài mọi mục gập và đứng trước mục đầu tiên.
- AC-4: Given một lỗi có tiêu đề và chi tiết kỹ thuật, When dựng thẻ và trang bằng chứng, Then thẻ không in tiêu đề và chi tiết ấy, còn trang chỉ in chúng trong phần gập của khối.
- AC-5: Given hồ sơ chấm trước bản vá nên lỗi không có câu tiếng sản phẩm, When dựng thẻ và trang, Then chỗ đó in lời tiêu chí đã duyệt kèm ghi chú «chưa có mô tả cho người đọc», không bao giờ in tiêu đề kỹ thuật, và thẻ vẫn không mời ký nhanh; không tra được lời tiêu chí thì in mã tiêu chí kèm ghi chú đó.
- AC-6: Given mục «Trong hợp đồng» có chữ nhưng sai khuôn, When dựng thẻ và trang, Then cả hai báo «máy không đọc ra» và thẻ không mời ký nhanh.
- AC-7: Given hồ sơ không có tệp rà soát, tệp rỗng, mục rỗng hoặc mục ghi «không có», When dựng thẻ và trang, Then lời mời ký nhanh giữ nguyên và không có khối lỗi.
- AC-8: Given hồ sơ còn lỗi trong hợp đồng, When dựng thẻ, Then ô «ký hay trả» vẫn để trống, thẻ nói rõ ký là chấp nhận giao kèm lỗi, không thêm câu hỏi mới, và dữ liệu trích của thẻ có danh sách lỗi.
- AC-9: Given hồ sơ REJECT vì lỗi trong hợp đồng mức nặng, When dựng thẻ, Then thẻ nêu lỗi bằng câu tiếng sản phẩm.
- AC-10: Given lượt chấm có lỗi trong hợp đồng mức vừa, When bước phân loại và tổng hợp chạy, Then phán quyết vẫn là PASS, phân loại bị đòi viết câu tiếng sản phẩm, câu ấy đi tới tổng hợp, và khuôn mục tổng hợp đọc lại được đủ trường qua bộ đọc của thẻ.

## Coverage

Quét không gian: Phán quyết × Dạng mục «Trong hợp đồng» × Mặt đọc = 4 × 5 × 3 = 60 ô.

- Trục: Phán quyết: PASS | PENDING-JUDGMENT | REJECT | BLOCKED [thước CE: bốn verdict do `feature-loop/workflows/acceptance-verify.js` trả về]
- Trục: Dạng mục: không có/rỗng | một lỗi đủ câu | nhiều lỗi khác mức | lỗi thiếu câu (hồ sơ cũ) | sai khuôn [thước CE: khảo sát 206 hồ sơ thật của kit — 201 có mục này, 30 hồ sơ đọc ra 51 lỗi, 13 hồ sơ viết tay sai khuôn]
- Trục: Mặt đọc: thẻ | trang bằng chứng | dữ liệu trích [thước CE: ba đầu ra của `scripts/gate-card.js` và `scripts/evidence-page.js`]
- Core: PASS với mọi dạng trên cả thẻ và trang (AC-1 đến AC-7), dữ liệu trích (AC-8), REJECT có lỗi (AC-9), bên viết (AC-10).
- Later: PENDING-JUDGMENT và BLOCKED chưa có ca đo riêng; chúng dùng chung nhánh in với REJECT.
- [GIẢ ĐỊNH] Chưa đối chiếu sản phẩm ngành: đây là cổng nội bộ của kit, thước đủ là dữ liệu hồ sơ thật, không phải chuẩn ngành.

## Out of scope

- Không đổi luật phán quyết: lỗi trong hợp đồng mức vừa vẫn ra PASS. Câu hỏi này nằm ở Cổng Phạm vi.
- Không sửa đường máy tự đi tiếp (làn V); việc đó hạng T3, nằm ở nhánh `fix/lan-v-loi-trong-hop-dong`. Giá của việc tách: cho tới khi nhánh đó gộp, một hồ sơ T2 còn lỗi trong hợp đồng vẫn có thể được máy cho đi tiếp mà không có chữ ký và không có thẻ nào cho người đọc.
- Không viết lại các hồ sơ cũ để có câu tiếng sản phẩm; hồ sơ cũ hiện lời tiêu chí cho tới khi được chấm lại.
- Không sửa 13 hồ sơ viết tay sai khuôn; chúng nhận cờ «máy không đọc ra».

## Notes

- Mã đã commit ở `24934fa7` trước khi hồ sơ này mở. Cổng Phạm vi duyệt phạm vi của một bản đã có; lượt chấm độc lập chạy sau duyệt.
- Ca `LB5` của `tests/plugins/lenh-bam-duoc.test.mjs` được khai thêm một cờ mới theo đúng cơ chế danh sách `CONG` của nó, không nới luật.
- Khối cùng tên từng bị rút ngày 13/09 ở `cong-nguoi-doc-du-nguon`; lý do và cách vòng này xử nằm trong design doc.
