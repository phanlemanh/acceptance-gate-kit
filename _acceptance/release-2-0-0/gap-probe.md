---
slug: release-2-0-0
at: 2026-08-15T05:05:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Gap-probe: release-2-0-0

Critic context sạch đọc đúng ba vật của hồ sơ (contract · evals · bộ răng),
soi 5 rủi ro đặc thù của hồ sơ release-đi-làn-xanh-sạch. 5 finding, xử
one-pass trước thi công tiếp — sửa THƯỚC, không hạ đáp án.

## Findings

| Sev | Artifact | Thiếu gì | Xử lý |
|---|---|---|---|
| P0 | contract + evals | Lời hứa «KHÔNG đổi một dòng engine» không có eval nào canh — thi công lén sửa `lib/` kèm bump vẫn đi làn xanh-sạch không chữ ký. Lớp «lời trấn an không thước» kinh điển | **fixed (pre-verify):** thêm AC-5 + E5 + chân `diff-allowlist`: mọi file trong diff phải thuộc allowlist ĐÓNG; diff rỗng cũng đỏ; chiều đỏ tiêm `lib/evidence-core.cjs` qua CHÍNH hàm lọc |
| P1 | evals E4 | Vế «CI clean khi human_signoff rỗng» nằm trong expected nhưng chỉ «ghi vào báo cáo sau» — sẽ thành LỜI KHAI TAY trong report, đúng lớp lời-khai-sai vừa bắt ở đợt 2 | **fixed (pre-verify):** tách vế CI ra khỏi verdict E4 — nó là bằng-chứng-vận-hành trạng thái CHỜ ở mục Analyst, xác nhận bằng lượt cổng CI thật của PR |
| P1 | rang chân lan-v | Assert «0 VIOLATION nhóm veto» là âm-tính-một-mình — định dạng dòng vi phạm đổi thì chân xanh vĩnh viễn | **fixed (pre-verify):** thêm đối chứng dương: fixture code-sinh có `da-veto` thật đi qua CHÍNH pre-merge, pattern grep phải BẮT được; ghi nhận exit code lượt chạy thật |
| P2 | rang chân lan-v | Chạy trên cây thật không fetch, không ghim SHA base — đỏ oan/xanh oan theo trạng thái local, evidence không tái lập | **fixed (pre-verify):** fetch trước (fail thì đỏ), in `git rev-parse origin/main` vào output |
| P2 | evals E3–E3d | Bốn số suite chép tay trong prose, E3d bắt verifier cộng tay | **fixed (pre-verify):** expected ghi rõ NGUỒN LỆNH in từng số để verifier so máy-với-máy; giữ số ghim vì nó là một phần răng chống-lén-đổi-engine |

Ghi nhận chiều thuận của critic: chân manifest/docs đạt nếp — mutant qua
CHÍNH hàm kiểm nhận gốc làm tham số, GUIDE so với version đọc từ manifest
(một nguồn).
