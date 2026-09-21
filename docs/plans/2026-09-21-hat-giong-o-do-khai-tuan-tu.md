# Hạt giống — Cho ô đo khai `tuan_tu`: hàng đợi tuần tự hiện chỉ nhận lệnh suite

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(khuôn `evals.yaml` + bộ điều phối S4).
Gốc: crm/_acceptance/thuoc-khai-dung-tieng — K6 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

Hàng đợi tuần tự của S4 chỉ nhận **lệnh suite**. Một phép đo lẻ cần chạy một mình — vì nó chiếm
cổng, chiếm máy chủ, hoặc đơn giản là dài — không có cách khai điều đó, nên nó đi vào làn song
song và vỡ trần thời gian.

Số đo: **E12b mất 3 583 giây, gấp ~6 lần trần 600 s.** Nó không chậm vì sai; nó chậm vì bị xếp
nhầm làn.

## Việc

Cho mỗi ô đo khai `tuan_tu: true` (hoặc một khoá tương đương ở cấp eval, không chỉ cấp suite).
Bộ điều phối gom mọi eval mang cờ ấy vào một hàng đợi một-luồng, và trần thời gian của chúng đọc
riêng — không dùng chung trần của làn song song.

Đi kèm: lỗi «vỡ trần» phải phân biệt được «chậm thật» với «xếp nhầm làn», nếu không số đo phút
máy/lượt chấm (dòng 5 của luật (c)) trộn hai nguyên nhân.

## Ngưỡng mở ô

Đã có chip nền mở ở phiên crm. Trên kit: mở khi ≥1 eval của kit vỡ trần thời gian vì chạy song
song trong khi nó cần một mình — hoặc khi một kho tiêu thụ thứ hai gặp cùng hình dạng.
