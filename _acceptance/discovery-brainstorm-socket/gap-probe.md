---
slug: discovery-brainstorm-socket
at: 2026-08-06T05:45:00Z
verdict: findings
p0: 0
p1: 4
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E1–E5 chung một cmd suite + chung MỘT nhãn case P165 — 5 eval nhưng 1 phép đo; expected khác nhau chỉ là văn | Implementer viết P165 chỉ phủ AC-1 → suite xanh → cả 5 eval xanh cùng lúc, không eval nào đỏ riêng lẻ được | Mỗi AC một chân đo phân biệt được | fixed: tách 3 case per-nhóm-AC (P165 vế âm · P166 ổ cắm máy · P167 hardcode+spec), mỗi eval ghim đúng tên case của nó |
| P1 | contract | AC-3 Given nêu "config không đọc được" nhưng E3 không có chân YAML-tồn-tại-nhưng-hỏng | start-scan gặp YAML malformed → nếu throw là phá lời hứa "exit 0, JSON nguyên hình" mà không fixture nào chạm nhánh | Hình dạng thứ 5 vào E3 | fixed: E3 thêm chân YAML hỏng → exit 0 + null (reader line-based không throw — chân đo chứng minh, không tin lời) |
| P1 | evals | Hình dạng LẠ của giá trị chưa có chân: quote đơn vs kép, list/map/block-scalar, literal `~`/`null` | Consumer khai `'x'` quote đơn → tên skill kèm quote → /start gọi skill sai tên, mọi eval xanh (lớp bug block-scalar đã treo ở context-ladder) | Ghim cả hai kiểu quote + case phi-scalar phải ra null không crash | fixed: E2 ghim quote đơn + kép; E3 thêm chân phi-scalar (block-scalar/inline-list) → null |
| P1 | evals | E5 vế âm trên spec là âm-tính-một-mình không đối chứng dương — đúng lớp E4 vừa vá vài dòng trên | Grep spec sai path → 0-hit xanh oan; vế dương không bị ràng đo trên CÙNG dòng luật | Ràng QUAN HỆ một lượt đọc: dòng §2.1 D1/§6 phải CHỨA chuỗi ổ cắm VÀ KHÔNG chứa chuỗi cũ + mutant tiêm chuỗi cũ | fixed: P167 đo quan hệ trên đúng hai đoạn luật, mutant per-đoạn ghim thông điệp |
| P2 | evals | E1 không ghi mutant là fixture code-sinh | Mutant chép tay drift khỏi thân sống → đỏ/xanh oan | Bất biến fixture-code-sinh | fixed: E1 ghi rõ mutant = bản sao thân sống, xoá-câu bằng máy trong chính lần chạy |
| P2 | contract | Cây quét AC-4 thiếu `vendor/` mà không lời giải thích | Người sửa sau "vá" bằng thêm vendor/ vào quét → đỏ oan (vendor giữ tên gốc là bất biến CLAUDE.md) | Loại trừ phải có tên | fixed: entry decisions d-10006 — vendor/ loại trừ CÓ CHỦ ĐÍCH (thân bên-thứ-ba vendor giữ tên + version gốc) |
| P2 | evals | E1/E2/E3 đo hiện-diện-chuỗi toàn file, không ghim "ở lối (a)" như contract đòi | Câu phủ định chèn ở footer → grep xanh, phiên đọc lối (a) vẫn lệch làn — đo từ vựng thay vì quan hệ | Ràng câu/nhánh nằm TRONG đoạn lối (a) | fixed: P165/P166 rút đoạn lối (a) bằng anchor hai đầu ("Bắt đầu việc mới" → "Dưới thẻ"/"Below the card"), assert trong đoạn; anchor vắng là đỏ có tên |
