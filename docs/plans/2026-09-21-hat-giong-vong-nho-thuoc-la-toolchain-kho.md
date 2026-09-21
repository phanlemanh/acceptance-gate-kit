# Hạt giống — Vòng NHỎ: vật nhỏ thì thước là toolchain của kho, S4 chỉ làn machine, Cổng Bằng chứng một chạm

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(chạm bảng hạng ở S0 của feature-loop + bộ làn của `acceptance-verify.js`; không chạm luật cổng).
Gốc: crm/_acceptance/loi-vao-dieu-phoi-30-ngay — hai mục điều hướng cho màn 30 ngày (sau
PR crm #66), 21/09: hồ sơ mới, 5 phép đo, lượt chấm S4 **15 tác nhân**, BLOCKED vì tác nhân
E5 đọc câu nhắn của chủ kho làm nhiệm vụ; chủ kho hỏi «thêm một đường vào không cần quá
phức tạp thế?».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

Kit chỉ có hai hạng cho mã: **T1** = tài liệu (`t1_skip_globs`: `docs/**`, `**/*.md`) và
**T2/T3** = trọn nghi thức. Mọi byte trong `apps/**` rơi vào T2, và T2 kéo theo bộ làn S4
**cố định** — machine · baseline:diff · review 3 lens · refute · triage · capture ·
synthesize (+judge, +ui) — nên chi phí tỉ lệ theo *số eval × số phát hiện*, không theo *cỡ
vật*. Hai dòng menu trả cùng giá với ba nghìn dòng.

Số nền (bản định vị 21/09): vật nói **7,4 %** token S4; với ca này bốn lệnh của kho
(test · lint · lint:slop · build) đã xanh trong CI **trước** khi lượt chấm bắt đầu — tức
bằng chứng của vật đã có đủ, phần còn lại là bộ máy nói về vật.

## Việc

Một **hình dạng vòng nhỏ**, máy xếp ở S0 khi vật nhỏ và thước của kho phủ được:
- Hợp đồng 1–3 AC; eval **chỉ** là lệnh của toolchain kho (`executors.test.*`,
  `suite_keys`) — không `rang/`, không ui-check bằng agent, không judgment.
- S4 = **làn machine** (dedupe) + baseline; **không** review/refute/triage/synthesize;
  báo cáo do máy render từ sáu thứ (diff · test · skip · sha · suite · sha deploy).
- Cổng Bằng chứng một chạm; mặt người nhìn → chủ kho tự nhìn, ghi một dòng sổ
  (đúng «người chấp nhận chưa đọc» của cạnh Thước↔Vật).
- Điều kiện xếp hạng phải là **vật-máy-giữ**, không phải câu hỏi: diff ≤ N dòng ∧ mọi tệp
  chạm nằm trong glob kho khai `small_change_globs` ∧ 0 tệp thước mới — sai một vế thì rơi
  về T2 như hôm nay, có tên.
- Chiều đỏ: một diff chạm `apps/api/**` (ngoài glob) nhưng ≤ N dòng → KHÔNG được xếp nhỏ.

Thuộc Đ5 + Đ6 của bản định vị (ngoài phạm vi cửa sổ 2.18.0). Mở ô khi có mốc `crm` cài
2.18.0 và ≥ 1 ca thật nữa cùng hình (ngưỡng đang đếm: 1/2).
