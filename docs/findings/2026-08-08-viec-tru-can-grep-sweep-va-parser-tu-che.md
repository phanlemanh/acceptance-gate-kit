# Hai bài học từ GĐ1 tai-lap-ceremony-diet (dừng có chủ đích, 2026-08-08)

Bối cảnh: đợt phẫu thuật GĐ1 (bỏ nghi thức phút, ký gộp, CHANGELOG/2.0.0,
re-pin theo release) chạy **5 vòng S4 đều REJECT** rồi dừng theo luật-chót
người khoá — 2.0.0 không ship qua cổng, công việc nằm ở nhánh
`release/2.0.0-wip`. ROI âm (5 vòng cho một đợt nhằm *tiết kiệm* vòng) là
dữ liệu, không phải xui. Chi tiết từng vòng: `_acceptance/tai-lap-ceremony-diet/`
(decisions.jsonl + 5 bộ evidence) và 29 mục ledger cùng slug.

## 1. Việc TRỪ có hình dạng hỏng riêng — và GĐ1 dùng sai công cụ ngay từ kế hoạch

Việc CỘNG hỏng kiểu "vật mới sai hành vi" — S4 full-verify (máy + review) là
thước đúng. Việc TRỪ (gỡ một nghi thức khỏi N vật mang) hỏng kiểu **GỠ SÓT**:
mỗi vòng review lại lôi ra thêm một vật mang còn dấu vết (GUIDE → QUICKSTART/
README → 2 SKILL acceptance → khối **Print** của chính acceptance-report →
description của 7 manifest). Thước đúng cho gỡ-sót là **một grep-sweep toàn
cây theo bảng-khuôn-cấm, chứng minh TẬP RỖNG một lần** — rẻ, đóng, không cần
agent; S4 full-verify chỉ nên chạy MỘT lượt cuối trên vật đã sweep sạch.
GĐ1 lên kế hoạch dùng S4 lặp làm thước chính cho một việc TRỪ, nên mỗi vòng
~25' + review chỉ để phát hiện thứ một lệnh grep 5 giây tìm ra. Lần TRỪ sau:
viết bảng khuôn-cấm trước, sweep toàn cây (mọi loại file, kể cả manifest
description và OUTPUT SPEC của lệnh báo cáo), chứng minh tập rỗng, rồi mới
xin một lượt verify.

## 2. Parser tự chế cho record là khuôn sai — input thiết kế cho 2.1

sign-batch đọc/ghi frontmatter bằng regex tự chế và **fail-open đổi da 4 lần
liên tiếp** dù mỗi lần đều "vá theo lớp": `\S` nhận `#` (comment-only ack) →
`\s*` băng-xuống-dòng (ack-để-trống vẫn ký) → `=== 'true'` phân-biệt-hoa-thường
(lệch reader pre-merge nhận `True|1|yes`) → quét CẢ FILE thay vì khối
frontmatter đầu (body mồi/độc được check). Bốn lần là bốn *trục lệch khác nhau*
giữa writer tự chế và reader chuẩn (`front_field` của pre-merge) — nghĩa là
lớp lỗi nằm ở **sự tồn tại của parser thứ hai**, không nằm ở từng regex.
Quyết định: 1b làm lại ở 2.1 **đọc/ghi qua một reader frontmatter dùng chung**
(`lib/workspace-record.js`) — cùng semantics với pre-merge, một chỗ vá, hết
lớp đổi-da. (Cùng kết luận với bất biến "bên VIẾT và bên ĐỌC trôi khỏi nhau"
trong CLAUDE.md, giờ có thêm 4 điểm dữ liệu trên cùng một file.)
