# Hạt giống — Pin phải phân biệt «không chạm» với «không tính được»

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`feature-loop/scripts/repin-lane.mjs`).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — owner định đoạt «mở hợp
đồng mới» cho mục Ngoài-17 tại Cổng Bằng chứng round 2 (20/09).

## Lỗ

`chamTuPin` trả `[]` ở HAI ca khác hẳn nhau:

- `verified_commit` vắng khỏi báo cáo, hoặc
- pin cũ không có trong kho (clone nông, squash-merge sinh sha ma —
  `scripts/pre-merge-check.sh:1260` ghi đúng ca này là nguyên nhân tái phát).

Vì ba khoá mới theo luật **vắng-hẳn-khi-rỗng**, dòng pin khi đó KHÔNG mang
`evals_not_machine_touched` và section KHÔNG mang hậu tố — **giống hệt từng byte** với
một làn đã kiểm thật và thấy không có gì chạm. Mọi bộ đọc phía sau (cờ vàng của thẻ,
lệnh đếm ngưỡng ở GUIDE §7.1) đọc thành «sạch». Thứ duy nhất nói ra sự thật là một dòng
`[lane] …` trên stderr — đúng cái «dặn-bằng-lời làm nghiệm» mà hiến pháp cấm.

Khối `--skip-unchanged` cách đó ~60 dòng xử CÙNG hai điều kiện ấy theo lối
fail-CLOSED («thiếu pin là lý do để chạy, không phải lý do để im»). Hai khối cạnh nhau,
hai hướng ngược nhau.

## Việc

Một trong hai, không phải cả hai:

- làn TỪ CHỐI ghim khi không giải được pin cũ (cùng lối `--skip-unchanged`); hoặc
- dòng pin mang một dấu bền — ví dụ `evals_not_machine_touched_unknown` — kèm hậu tố
  section, để bên đọc phân biệt được «không chạm» với «không tính được».

Lối hai rẻ hơn và không đổi hành vi chặn; lối một mạnh hơn nhưng chạm đường verdict.

## Ngưỡng mở ô

- ≥1 hồ sơ ghim lại trên một kho clone nông hoặc sau squash-merge mà pin im về ô
  ui-check; hoặc mở kèm khi có vòng khác đã chạm `repin-lane.mjs` (gộp để khỏi vòng
  riêng).
