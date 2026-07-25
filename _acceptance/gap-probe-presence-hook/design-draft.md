# Hook recheck enforce gap-probe presence — design draft (S1)

**Nguồn:** ứng viên v2 ghi ở spec `docs/superpowers/specs/2026-07-23-s1-gap-probe-design.md` §8
("KHÔNG hook/CI enforce sự tồn tại gap-probe.md — cờ vàng trên thẻ là đủ v1; hook recheck là
ứng viên v2 khi có dữ liệu bước bị bỏ qua thường xuyên").

## Vấn đề

V1 chỉ có cờ vàng trên thẻ Cổng 1 khi thiếu `gap-probe.md`. Cờ vàng là fail-visible nhưng
không fail-stop: một main loop cẩu thả (hoặc human duyệt vội) vẫn có thể set
`status: approved` mà bước S1#7 chưa từng chạy và cũng không có entry descope. Khi điều đó
xảy ra thường xuyên, cần một chốt tất định ở tầng hook — cùng triết lý với các chốt L2
hiện có (chữ ký máy, run_id đối chiếu).

## Cơ chế

Mở rộng hook recheck hiện có (điểm móc: edit `contract.md` đổi `status` sang `approved`):

- Contract `risk_tier ∈ {T2,T3}`: kiểm tra `gap-probe.md` tồn tại trong workspace HOẶC
  `decisions.jsonl` có entry `descope` với decision bắt đầu `"bỏ gap-probe"`
  (case-insensitive, trim — cùng luật với card).
- Có file: verdict `clean|findings` → qua sạch; `probe-failed` → NOTE nhắc (duyệt có ý
  thức), không chặn; verdict THIẾU hoặc ngoài tập (file rỗng/rác) → **mở, chờ human Gate 1
  chọn**: chặn như thiếu file (chống bypass bằng `touch`) hay NOTE.
- Thiếu cả hai: T3 → chặn (exit 2) kèm thông điệp hướng dẫn chạy S1#7 hoặc ghi descope;
  T2 → NOTE không chặn (leo thang dần, thu dữ liệu trước khi siết).
- **Marker backward-tolerant (GUIDE chuẩn F — "enforce cứng chỉ khi artifact có field
  mới"):** S1 của feature-loop ≥ 1.19 ghi `gap_probe_expected: true` vào frontmatter
  contract khi CT-S bật. Hook chỉ được CHẶN khi field này hiện diện; contract không có
  field (workspace cũ / ngoài loop) → NOTE tối đa, không bắt migrate. T1 / thiếu
  `risk_tier` → hook bỏ qua hoàn toàn.

## Không làm

- Không enforce ở CI pre-merge (thẻ + hook approve-time là đủ hai lớp; CI đã chặn artifact
  thiếu theo luật cũ).
- Không auto-run probe từ hook (hook không dispatch agent — chỉ chặn/nhắc).
