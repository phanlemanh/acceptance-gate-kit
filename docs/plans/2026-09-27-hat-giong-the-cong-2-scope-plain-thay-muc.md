# Hạt giống — thẻ Cổng Bằng chứng vẫn để câu tóm `scope_plain` thay cho các mục «không làm»

**Ngày:** 2026-09-27 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/cham-khong-tu-dot-luot — lượt chấm 3, mục Ngoài-1 của `review-findings.md`; owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 27/09.

## Ca

Vòng `cham-khong-tu-dot-luot` (AC-6) sửa thẻ Cổng Phạm vi: mỗi mục «Out of scope» hiện một dòng
«Hoãn/cắt: …», câu dịch tra theo id `OOS-n`, và `scope_plain` chỉ còn là dòng dẫn. Thân lệnh
`commands/acceptance-card.md` nay định nghĩa `scope_plain` là «câu dẫn tuỳ chọn — KHÔNG thay các
mục». Bộ đọc Cổng 2 (`scripts/gate-card.js`, khối «Xác nhận các phần đã cắt/hoãn ngoài phạm vi»)
chưa đổi: vẫn `pl.scope_plain || oos.join(' · ')`. Tác tử dịch viết `scope_plain` theo khuôn mới
(một câu dẫn ngắn) thì thẻ Cổng 2 chỉ còn câu ấy, đúng ở ô người bấm «Đồng ý cắt / Không, kéo
vào». `--extract` Cổng 2 còn trả `scope` dạng chuỗi trong khi Cổng 1 trả `{id,text}`.

## Dạng nghiệm đúng tầng

Cổng 2 dùng cùng `oosItems` + `SCOPE_MUC` của Cổng 1 (một nguồn), extract Cổng 2 trả cùng hình
`{id,text}`. Chiều đỏ: bản dịch hình crm (scope_plain ngắn + 5 dòng `OOS-*`) → thẻ Cổng 2 hiện đủ
8 mục; bản sao bộ đọc Cổng 2 quay về `scope_plain ||` → ca đỏ gọi tên mục thiếu.
