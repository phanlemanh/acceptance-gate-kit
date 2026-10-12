# Hạt giống — bộ xếp căn cứ bước thiết kế phải chạy được ở kho khách, và thẻ phải giữ ba vế của dòng sổ

**Ngày:** 2026-10-11 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Nguồn:** chủ kho định đoạt
«mở hợp đồng mới» cho Ngoài-1, Ngoài-2, Ngoài-3 khi ký Cổng Bằng chứng vòng `buoc-len-thiet-ke-khong-hoi`
(sổ quyết định, dòng `gate2`), gộp thành MỘT hợp đồng.
Gốc: acceptance-gate-kit/_acceptance/buoc-len-thiet-ke-khong-hoi/ — `review-findings.md` mục «Ngoài hợp đồng», ba phát hiện lượt chấm 1 (hai high, một medium).

## Ca thật

1. **Ngoài-1 + Ngoài-3 (high, cùng một lỗi):** lời dặn feature-loop gọi bộ xếp căn cứ bằng đường
   tương đối `node scripts/can-cu-s1.cjs`. Đường đó chỉ có trong kho kit. Ở kho khách (crm), lệnh
   kiểm sổ trước Cổng Phạm vi không tìm thấy công cụ, thoát khác 0 và bị đọc thành «sổ đỏ». Mọi
   vòng sẽ dừng hỏi người vô cớ, và con số «máy quyết bị lật» (ngưỡng nghiệm thu của vòng) không đo
   được ở đúng kho nó được dựng cho.
   Hướng sửa: giải đường qua `resolve-plugin.mjs` như mọi script khác của acceptance-gate, kèm một ca
   chạy lời dặn trên một kho không phải kit.
2. **Ngoài-2 (medium):** thẻ Cổng Phạm vi in dòng sổ mang `can_cu` mà bỏ vế «vì sao» và vế «sai thì
   tốn gì». Như vậy nó trái ADR 0021 (ba vế một câu) và trái chính lời của ADR 0022 («ba câu người đọc
   giữ nguyên»). Người được mời lật quyết định mà thiếu thứ cần để lật.

## Vì sao phải trước mốc kế

Mốc phát hành kế mang vòng này tới crm. Nếu chưa sửa lỗi 1, bước thiết kế ở crm hoặc dừng mọi vòng,
hoặc bị phiên bỏ qua. Cả hai chiều đều làm ngược đúng điều vòng hứa (≤ 3 lượt gọi người mỗi vòng). Hạt giống này nên thành ô và gộp TRƯỚC khi cắt mốc.
