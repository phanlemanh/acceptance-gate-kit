---
slug: gap-probe-presence-hook
at: 2026-07-23T11:47:41Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Nhánh backward-tolerant trong design không có AC lẫn eval, tín hiệu nhận diện workspace cũ không được định nghĩa | Implement bỏ quên nhánh legacy: workspace T3 tạo trước 1.18-wave thiếu cả gap-probe.md lẫn descope → hook exit 2 chặn approve, trong khi design yêu cầu NOTE không chặn; cả 6 eval vẫn xanh vì không eval nào dựng fixture legacy | Thêm AC định nghĩa marker cụ thể + eval fixture legacy → exit 0 kèm NOTE | fixed: AC-7 + E7 + marker `gap_probe_expected` (design cập nhật, entry d-...103) |
| P0 | contract | Trạng thái file-tồn-tại-nhưng-verdict-thiếu/rác không có AC/eval — state 5 của trục Coverage vắng | Main loop cẩu thả `touch gap-probe.md` rỗng trên contract T3 → hành vi hook undefined, implementation exit 0 vẫn pass bộ eval → chốt fail-stop bị bypass bằng 1 lệnh touch mà Gate 2 vẫn xanh | Thêm AC cho verdict thiếu/ngoài tập: chặn hay NOTE — phải chọn 1 | human-gate1 — câu hỏi: file rác coi như THIẾU (chặn T3, chống bypass touch) hay chỉ NOTE? Đề xuất: chặn |
| P1 | contract | AC-1 mâu thuẫn AC-5: design gộp probe-failed vào "verdict hợp lệ" nhưng AC-1 hứa không cảnh báo | Eval-gen dựng fixture probe-failed cho E1 → E1 expect im lặng, E5 expect NOTE trên cùng input → hai eval không thể cùng pass | Sửa Given AC-1 còn clean/findings | fixed: AC-1 + E1 expected đã loại probe-failed |
| P1 | evals | Không có eval negative cho T1 / contract thiếu risk_tier | Hook quên filter tier áp check mọi contract: hotfix T1 bị NOTE/chặn oan khi approve → eval hiện có vẫn pass vì không fixture T1 | Thêm AC + eval T1/thiếu tier → exit 0 im lặng | fixed: AC-8 + E8 |
| P2 | contract | Luật khớp descope prefix không định nghĩa case-sensitivity | Entry descope viết "Bỏ gap-probe..." (hoa chữ B) → prefix match exact fail → hook chặn oan T3 dù descope đã ghi đúng nghi thức | Ghi luật khớp case-insensitive + case eval viết hoa | fixed: AC-4 ghi luật (khớp /i của card) + E4 thêm fixture viết hoa |
