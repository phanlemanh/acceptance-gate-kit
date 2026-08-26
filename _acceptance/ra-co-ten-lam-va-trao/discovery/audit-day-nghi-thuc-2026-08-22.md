# Hồ sơ khám phá — audit dây nghi thức kit (22–23/08/2026)

Ô này sinh ra từ một lần quét cả dây nghi thức của kit. **Bản đầy đủ là một nguồn duy nhất**, đặt ở
[`docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md`](../../../docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md)
— không chép lại ở đây để khỏi nuôi hai bản phải giữ đồng bộ.

**Cách quét:** Zwicky box — 17 chuyển trạng thái hồ sơ × 5 câu kiểm (ai đứng tên · con trỏ bước kế
có sống · ≥ 2 lối ra hay trạm thu phí · mấy lần gọi người · bốn bộ đọc có cùng chữ). Chân ngành:
Stage-Gate (R. Cooper) — mỗi cổng cần vật nộp · tiêu chí · lối ra · người gác · chủ bước kế.
Bốn máy đọc chạy song song, chỉ đọc; **chữ của bộ đọc lấy bằng chạy thật** `start-scan` ·
`product-map --check` · `pre-merge-check` · `gate-card --extract` trên cây thật và trên fixture
máy sinh (10 ô cơ hội + 6 hợp đồng ở mọi trạng thái), không suy từ code.

**Phần liên quan trực tiếp tới ô này:**

- §2 — bảng 17 chuyển trạng thái: ai đứng tên, con trỏ bước kế, sống hay chết.
- §3 lớp A — 12 mục «có ô mà không có tên»; A3 (làn V không ô kết) · A1+A2 (Cổng Đáng) · A7+A8+A9
  (Cổng Giá trị, `iterate`/`kill`, `archived`, timebox) là ba mục Core của ô này.
- §4 — bảng Stage-Gate bốn cổng × năm thành phần: cả bốn cổng thiếu «chủ bước kế».
- §5 — đếm lần gọi người theo đúng lời kit ở từng đoạn vòng.
- §6 — các mục xếp Later/Never, để ô này không phình.

**Trang đọc được ngoài terminal (bản trình cho owner, cùng nội dung):**
https://claude.ai/code/artifact/50f71e42-a378-4d3e-90df-121bd1641db1
