# Hạt giống — Tách `instrument_sha` khỏi `verified_commit`: sửa thước không được làm hoá cũ bằng chứng của vật

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(chạm khuôn hồ sơ + làn ghim lại).
Gốc: crm/_acceptance/thuoc-khai-dung-tieng — hạng mục «khai đúng tiếng» 19–20/09, K1 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp
này. Neo thật là hồ sơ crm ở dòng trên.

## Lỗ

Hồ sơ nghiệm thu hiện chỉ mang MỘT khái niệm «bản đang được chứng minh». Nhưng một vòng có
**hai** vật thay đổi độc lập: **vật sản phẩm** và **thước đo vật**. Ghim chung một sha thì mọi
lần chạm thước — kể cả lần chạm đã qua Cổng 1, Cổng 2 và chữ ký — đều làm bằng chứng của vật
hoá cũ, dù vật không đổi một byte.

Đo được trong hạng mục 81 dòng ấy: **+4 622 dòng bộ đo trên +81 dòng sản phẩm (57×)**. Với tỉ
lệ đó, gần như mọi commit đều là commit-chạm-thước, nên «hoá cũ» thành trạng thái thường trực
chứ không phải tín hiệu.

## Việc

Khai hai trường tách bạch trong hồ sơ: `verified_commit` (cây sản phẩm được chấm) và
`instrument_sha` (bộ đo đã chạy). Làn ghim lại so từng trường với vùng của nó; đổi thước mà
không đổi vật thì ghim lại **chỉ dòng thước**, bằng chứng của vật giữ nguyên hiệu lực.

Đi kèm K5 (`2026-09-21-hat-giong-vi-tu-tran-thuoc-dem-vong-chua-duyet.md`): trần thước chỉ đếm
đúng thứ nó định đếm khi hai trường này rời nhau.

## Ngưỡng mở ô

Chưa đo trên kit. Mở khi: ≥1 vòng của kit phải ghim lại hồ sơ **chỉ vì** một commit chạm thước
mà `git diff` cho thấy vùng sản phẩm không đổi. Lệnh đếm dựng được từ `repin-lane.mjs` đã có —
không dựng phép đo mới (luật (a): bộ đo một tầng).
