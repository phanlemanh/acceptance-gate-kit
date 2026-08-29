---
slug: cham-dung-cay-dung-cho-dung
at: 2026-08-29T08:40:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Gap-probe — phản biện ngữ cảnh sạch (S1, one-pass)

Critic tươi, input 6 file: design doc · contract · evals · decisions · claims
xuyên feature (input 5) · opportunity (input 6, cross-check ngưỡng ↔ đường đo).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Ngưỡng «hỏng hạ tầng tự xưng CHƯA-CHẤM-ĐƯỢC» chỉ có đường đo cho lớp vắng-mặt; lớp hỏng-mà-vẫn-trả-kết-quả (cd fail, exit 127) không AC nào phủ; dòng Đường đo tuyên «bảo đảm» là overclaim | Wrap cd của AC-6 fail hoặc lệnh exit 127 → agent trả exit ≠ 0 → đọc thành FAIL sản phẩm → REJECT giả, đốt luôn phép đếm 5-vòng-kế | AC + case harness: cd-fail và exit 127 đi nhánh BLOCKED, exit 1 thường vẫn FAIL | fixed: thêm AC-12 + E12 (ma trận 3 ô); Đường đo hạ chữ «bảo đảm» thành phủ-hai-dấu-hiệu + giới-hạn-đã-khai cho hình dạng khác |
| P1 | contract | Điều khoản «script lỗi → DỪNG, không fallback soạn tay» + gỡ 14-gạch chỉ nằm ở design doc, không AC/eval nào phủ | Script lỗi lần đầu, model lặng lẽ soạn tay như cũ — trọn lớp lỗi quay lại mà E1–E11 vẫn xanh | AC + eval đo SKILL theo marker nội dung, chiều đỏ chèn lại đoạn soạn-tay | fixed: thêm AC-13 + E13 |
| P1 | evals | E1 tuyên ~15 vế nhưng không ma trận toàn phần, chiều đỏ chỉ 1; diffBase là QUAN HỆ bị đo như chuỗi-có-mặt — đúng lớp cite [design-pass-nac-khong-dong-bo#F1] | Script quên toolKillRule hoặc diffBase = HEAD mà E1 vẫn xanh, args hỏng lọt vào lượt chấm thật | Ma trận 15 vế = 15 assert; diffBase so `git merge-base` chạy thật trên fixture repo có nhánh | fixed: E1 viết lại thành ma trận 15 vế + 2 chiều đỏ hai lớp |
| P1 | evals | E9 chỉ round-trip lượt sạch — bộ ba expected, returned, blocked chưa từng lệch trong kế hoạch đo | Writer hardcode returned = expected → tally báo đủ-quân khi agent chết, phép đếm 5-vòng-kế đếm thiếu mẫu số | Ca ghép: 1 agent null → tally lệch đúng số, khớp đếm độc lập | fixed: E9 viết lại thành hai ca sạch + lệch, số khớp đếm độc lập |
| P2 | evals | Vế SKILL của E5 tự-quy-chiếu (grep marker của chính SKILL), 0 chiều đỏ riêng | Ruột khối marker bị sửa ngược nghĩa mà marker còn → grep vẫn xanh | Assert NỘI DUNG trọn khối + mutant đảo khối | fixed: E5 viết lại — hai vế, mỗi vế chiều đỏ riêng |

Ghi chú của critic giữ lại làm giới hạn đã khai: E11 fixture dựng-theo-hợp-đồng-đã-ghi
vì đời 2.4.0 args soạn tay, không có writer thật để round-trip — đã khai thẳng
trong expected của E11.
