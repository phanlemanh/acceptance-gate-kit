---
slug: cross-feature-claim-index
at: 2026-07-29T06:40:00Z
verdict: findings
p0: 0
p1: 1
p2: 3
---

# Gap-probe — cross-feature-claim-index

Critic context sạch (agent tươi, input đúng 4 file artifact). Cross-check:
AC↔eval 12/12 đủ · mọi GWT đo được · 4 trục Coverage đều có AC ·
(cross-layer) không áp — CLI-only.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Design hứa "gap-probe.md khác khuôn → skip + đếm to" và sort theo `at`, nhưng không eval nào tiêm gap-probe.md hỏng khuôn / thiếu `at` — AC-2/E2 chỉ tiêm phía JSONL | Parser bảng markdown (seam vừa vỡ ở s4-scope-triage round 6) gặp bảng lệch cột → im lặng ra 0 claim nguồn gap-probe; mọi eval vẫn xanh vì fixture đều đúng khuôn; ship xong GO-criterion (1) chết vì id `#F` không bao giờ xuất hiện — NO-GO oan | Tiêm bảng lệch cột + file thiếu `at`, đối chứng dương bảng nguyên vẹn trước, ghim thông điệp per-file | fixed: AC-2 + E2 mở rộng sang phía gap-probe (bảng lệch khuôn, thiếu at, không crash sort) |
| P2 | evals | E1 đòi "probe-failed không xuất hiện" nhưng fixture CS1 không dựng file probe-failed — assertion vắng-mặt không được dựng | Scanner đọc nhầm bảng Findings sót trong file `verdict: probe-failed` → claim rác vào input 5, agent cite id ma; E1 xanh vì chưa từng kiểm | Fixture thêm probe-failed CÓ bảng Findings kèm id đánh dấu; assert vắng theo id + đối chứng dương | fixed: CS1 dựng thêm file probe-failed có bảng + id đánh dấu, assert vắng/có theo id cụ thể |
| P2 | evals | Nhánh "--slug thiếu → exit ≠0" trong design không có eval đo | Implement coi thiếu --slug như corpus rỗng → SKILL gọi sai cú pháp rơi vào nhánh im-lặng-hợp-lệ, cuối cửa sổ đo thành "zero trích dẫn" NO-GO oan mà không ai biết scan chưa từng chạy đúng | Sub-case gọi không --slug → exit ≠0 + ghim thông điệp usage | fixed: AC-4 + E4 thêm sub-case (d) thiếu --slug nổ to |
| P2 | contract | E12 (mirror sync) gắn AC-1 nhưng AC-1 không nói về mirror — eval mồ côi | Round verify sửa AC-1 → E12 bị dọn theo; drift mirror chỉ còn bắt ở CI sau merge; coverage card sai | Thêm AC tường minh cho bất biến sync rồi trỏ E12 về nó | fixed: thêm AC-12 (sync --check exit 0) + E12 đổi criterion về AC-12, Coverage thêm trục bất biến đóng gói |
