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

- §3 lớp C — 8 ca bộ đọc lệch chữ (6 mới), gồm thẻ + `acceptance-status` mời ký hồ sơ mà lưới đã
  tuyên không mời ký; «cửa veto mở» đếm 14 (lưới) vs 2 (thẻ); Cổng Giá trị luôn đứng đầu vì mốc rỗng.
- §3 lớp D — mặt phẳng làm việc: cây chính lệch origin sau chip, máy quét không đọc ahead/behind.
- §8 — ba ý owner 23/08 (hiện hết ý · nêu việc vừa làm · không hội thoại ở bước mờ) và căn cứ từng ý.
- §9 — vì sao ô này đi **trước** ô `ra-co-ten-lam-va-trao`.

**Trang đọc được ngoài terminal (bản trình cho owner, cùng nội dung):**
https://claude.ai/code/artifact/50f71e42-a378-4d3e-90df-121bd1641db1
