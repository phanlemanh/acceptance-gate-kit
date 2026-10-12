---
slug: ngoai-n-tu-dinh-tuyen
at: 2026-10-11T14:48:14Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap probe: ngoai-n-tu-dinh-tuyen

Phản biện context sạch (một tác tử tươi, đọc đúng design + contract + evals + sổ quyết định + bài học xuyên
hồ sơ từ claim-scan). One-pass: sửa artifact xong không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Sáu hàng ma trận AC-3 chỉ đo âm tính (không thêm dòng), không đối chứng dương trên cùng fixture, không ghim mã thoát/stdout | Bên ghi chết sớm (lib sai đường, exit 1/127) → không hàng nào nhận dòng → năm hàng vẫn xanh: không phân biệt «bỏ qua đúng» với «chưa từng chạy» | Mỗi hàng thêm một mục known-limits đối chứng; ghim thoát 0, đúng một dòng cho đối chứng, stdout `1 mục`; chiều đỏ thoát sớm làm cả sáu hàng đỏ | fixed: AC-3 + E3 — mục đối chứng mỗi hàng, ghim stdout, chiều đỏ NT3-do thoat-som |
| P1 | design | Hai bộ đọc mới tìm dòng mới nhất cho Ngoài-n không khai ranh giới nhãn; fixture chỉ 3 mục nên Ngoài-1 không bao giờ đứng cạnh Ngoài-11 | Hồ sơ 11 mục: so chuỗi con lấy dòng Ngoài-11 làm dòng của Ngoài-1 → bên ghi thoát 2 oan khi resume, mất làn V; thẻ cờ vàng oan | Hàng hồ sơ 11 mục ở AC-3 và AC-7; chiều đỏ bản sao so chuỗi con | fixed: design §3.3 nhãn tách thành số, một hàm chung; AC-3/AC-7 + E3/E7 thêm hàng 11 mục, chiều đỏ NT3-do chuoi-con |
| P2 | design | Điều kiện hồ sơ dựng lại trong bên ghi thay vì một nguồn; fixture báo cáo viết tay đúng khuôn bên đọc | Regex UNCERTAIN đổi ở xanhSach mà bản chép trong bên ghi không đổi → máy định tuyến hồ sơ có UNCERTAIN, trái d-…(descope T3/UNCERTAIN), E4 vẫn xanh | Vi phân với khong-can-nguoi --check trên cùng fixture; báo cáo sinh từ khuôn có marker | fixed: AC-4 + E4 — vi phân NT4 vi-phan; mã vế ⊇ khối EVIDENCE-XANH-SACH-BLOCK (NT4 mot-nguon); báo cáo dựng từ EVIDENCE-SECTIONS-TEMPLATE + JUDGMENT-BLOCK-TEMPLATE |
| P2 | evals | Đường đảo chỉ đo bằng chuỗi-có-mặt (dao == literal); lời hứa là quan hệ signoff nhận câu đó cho mục đã có dòng máy | Signoff bỏ qua mục đã có dòng gate2 → owner dán dao mà không có dòng người mới; E2 + E9b vẫn PASS | E9b hỏi thêm vế định tuyến lại mục có dòng máy trên cả hai loại hồ sơ; NT7 tách dao thành hai vế đúng ngữ pháp | fixed: E9b thêm ý (vi); AC-7 + E7 NT7 dao tách vế, so OOC_GLOSS_NGUOI |
| P2 | evals | Phép «không đổi» so merge-base với origin/main — gốc trôi; ý (iv) E9b hỏi quan hệ trước/sau mà hội đồng không có bản gốc | Sau gộp merge-base == HEAD → so tệp với chính nó, xanh rỗng ở chiến dịch ghim lại; người chấm E9b không thấy bảng cũ → UNCERTAIN hoặc PASS mù | Ghim sha gốc cố định; chuyển (iv) sang phép máy; bỏ NT8 baseline vì LM20 đã giữ | fixed: E9c script so sha cố định d9d1f3a6 (khối + bảng cổng); E9b (iv) chỉ hỏi lời khai của khối; NT8 baseline bỏ, AC-8 dựa LM20; giới hạn sha cố định khai ở Notes |
