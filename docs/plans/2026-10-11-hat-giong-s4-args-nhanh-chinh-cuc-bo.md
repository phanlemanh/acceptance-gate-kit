# Hạt giống — s4-args giải nhánh chính bằng ref cục bộ trước origin/<nhánh>

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (S4 lượt 1, 11/10/2026 — dòng `kind:"baseline"` của `run-log.jsonl`
ghi mốc so `68951cef`). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài (ngưỡng ở cuối).

## Lỗ

`feature-loop/scripts/s4-args.mjs` lấy tên nhánh chính từ remote rồi thử ref theo thứ tự `[main, origin/main]`.
Kho dùng nhiều worktree chung một ref `main` cục bộ, mà không ai fetch vào nó — hôm đó `main` cục bộ đứng ở
`68951cef`, tụt 64 commit so với `origin/main`. Nhánh DP4 đã gộp main hai lần, nên `merge-base(main, HEAD)` rơi về
điểm rẽ trước DP3 thay vì `a4774fd5`.

Số đo của lượt: mốc so sai kéo cả mã DP3, DP7 và #302 vào vùng vật — **8/26 finding lạc vùng** (Ngoài-2, 4, 7, 9,
12, 16, 25, 26; hai cái trùng hạt giống DP7 đã có), làn soi opus **29M cache_read**, người ký đọc thêm tám mục
không thuộc vòng. Verdict không đổi: eval không phụ thuộc mốc so.

## Hướng (nghiệm đúng tầng)

`s4-args` ưu tiên `origin/<nhánh>` khi remote khai tên nhánh chính; hoặc giữ thứ tự cũ nhưng in cờ vàng khi ref cục
bộ tụt so với `origin/<nhánh>` (đếm `rev-list --count`). Cặp ca hai chiều trên kho thử do mã sinh: ref cục bộ tụt →
mốc so là merge-base với origin (hoặc cờ vàng có tên) · ref cục bộ khớp → im.

Vá vận hành đã làm (không mã): Điều phối M5 fast-forward `main` cục bộ về `origin/main` ngày 11/10 và giữ nó khớp
sau mỗi lần gộp.

Ngưỡng mở ô: ≥1 lượt S4 nữa dính mốc so cũ sau khi Điều phối đã giữ `main` cục bộ khớp origin.
