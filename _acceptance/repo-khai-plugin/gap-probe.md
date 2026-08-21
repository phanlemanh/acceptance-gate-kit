---
slug: repo-khai-plugin
at: 2026-08-21T13:10:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
claims_input: ok
---

# Gap-probe — repo-khai-plugin (S1, one-pass)

Critic ngữ cảnh sạch, 4 input (design · contract · evals · ledger) + input 5 claims
(advisory, không claim nào được cite). Lint W1 (AC-1 thiếu ca biên) gộp xử lý cùng F1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | Chiều đỏ E1 dựa vào cờ `--marketplace` không có trong §3; lời hứa «cache thiếu marketplace.json → exit 4» không AC/eval nào đo | Thi công đúng §3 → chiều đỏ PD1 không chạy được; cache thiếu `.claude-plugin/` → script ném stack trace, init chết không lời, suite vẫn xanh | Khai cờ trong §3; thêm ca marketplace vắng → exit 4 + đường dẫn + không ghi | fixed: §3 thêm `--marketplace` (mặc định suy từ vị trí script; vắng → exit 4 nêu đường dẫn); AC-9 + E9 (PD9) hai fixture (cờ sai đường · bản chép script không có `../.claude-plugin/`); E1 thêm biên không-ghi → đóng luôn lint W1 |
| P1 | design + contract + evals | Khuôn khối `GUIDE-PLUGIN-DECLARE` chưa đặt: AC-6 cần rút 4 tên từ GUIDE nhưng AC-7 tả khối chỉ có lệnh; E7 đếm «1 marketplace add» trên cả §5.1 trong khi hai khối con đều có | GUIDE viết đúng AC-7 → PD6 đỏ oan hoặc PD7 đỏ oan → thi công nới thành ≥1 → lời hứa «5 lệnh còn 1» và parity không còn được đo thật | Một khuôn: danh sách `- name@marketplace` + hai marker con; đếm theo marker con | fixed: design §4 đặt khuôn duy nhất (danh sách n+1 dòng + `GUIDE-MAY-DAU` + `GUIDE-MAY-SAU`); AC-7 viết lại ba vế (i)(ii)(iii); E6 rút tên theo `^- `; E7 đếm trong từng marker con + đột biến chèn `install feature-loop` vào máy-sau |
| P1 | evals | E8 đo CHỈ DẪN (grep dòng lệnh trong init) không đo lệnh đó chạy được; seam md-viết → agent-chạy không round-trip | Script đổi cờ/đường dẫn mà md không sửa: PD1–PD5 xanh, PD8 xanh, consumer chạy init → exit 4, không ai thấy | Rút nguyên văn dòng lệnh từ khối, thế biến, thực thi, assert file | fixed: AC-8 + E8 thành round-trip thực thi (thế `${CLAUDE_PLUGIN_ROOT}` + `<path>`, chạy bằng node, so tập khoá với `--list`); chiều đỏ `--write`→`--writ` → exit 4 |
| P2 | contract + design | AC-1/E1 ghim cứng «đúng bốn» trong khi d-4103 hứa script theo marketplace; design §1 nói «4 plugin» còn §3 chỉ có 3 hậu tố | Marketplace thêm plugin → PD1/PD6 đỏ trên hành vi đúng; hoặc test hardcode 4 tên → phép so thành tautology | Tập kỳ vọng = marketplace ∪ {superpowers}, assert bằng-tập + `length == n+1` | fixed: AC-1 «đúng n+1, bằng tập, không ghim số»; E1/E6 so tập + đếm n+1; design §1 ghi «n plugin của kit + superpowers (hiện n = 3)» |
| P2 | contract + evals | Điều kiện của descope d-4105 (kiểm tay hai câu harness) không AC/eval nào bắt buộc | S4 PASS 8/8 trên file đúng mà chưa ai mở repo trên máy mới; Cổng Bằng chứng ký khi giá trị thật chưa được chứng minh | Eval judgment trên lời khai kiểm tay | fixed: AC-10 (judgment) + E10 — inputs `kiem-tay-harness.md` (ngày · máy · hai câu trả lời dứt khoát); contract Notes ghi «tiền điều kiện signoff»; Out of scope sửa cho khớp |

Không lật descope nào trong ledger; F5 bổ sung đúng điều kiện mà d-4105 tự đặt, không lật nó.
