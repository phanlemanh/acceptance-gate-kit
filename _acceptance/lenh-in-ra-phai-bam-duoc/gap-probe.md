---
slug: lenh-in-ra-phai-bam-duoc
at: 2026-08-22T15:20:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract AC-2 · E2 | Regex «có ranh giới» không khai ranh giới; không đối chứng dương 55 điểm; không chân giữ-gân cho 3 dương tính giả biết trước | `\b` đếm `/feature-loop:feature-loop` và đường dẫn SKILL.md là trần → nới regex quá tay → quét mù mà ca đỏ vẫn đỏ | Ranh giới khai tường minh; đối chứng dương trên git show origin/main == 48+7; 3 chuỗi giữ-gân → 0 hit | fixed: AC-2 (iv)(v) + ranh giới |
| P1 | contract AC-2 vế «mọi lệnh in ra ∈ bảng» | Không chiều đỏ, không cách rút «lệnh in ra», xanh rỗng nếu xoá câu bàn giao; danh sách 8 tên đóng bỏ sót `/acceptance-gate:aprove` | Sửa bằng cách xoá câu → xanh; gõ sai tên có tiền tố → quét im nhưng bấm không chạy | Rút mọi token /x:y ⊆ bảng (chèn foo → đỏ); số token có tiền tố ≥ 55 | fixed: AC-2 (ii)(iii) |
| P1 | contract AC-5 · d-4506 | «mới < cũ» xanh bằng bất kỳ cờ nào mất (kể cả cờ hợp lệ) hoặc thêm cờ mới miễn tổng giảm; bản cũ ghi ngoài scripts/ → require đứt | Cắt nhầm cờ stale → xanh; CỘNG cờ lén → xanh; bản cũ crash → BLOCKED giả | So TẬP thông điệp: cũ∖mới ⊆ 3 loại, mới∖cũ = ∅, mỗi loại ≥ 1 trong cũ; bản cũ đặt đúng chỗ trong bản sao cây | fixed: AC-5 + E5 |
| P1 | opportunity giả định 3 · H2 | «Thử ở S1» nhưng không AC/eval/entry nào ghi kết quả | App desktop không nhận dạng có tiền tố → 48 điểm đổi xong owner vẫn gõ lại; H2 sai → thẻ rối | Entry `type: assumption` ghi kết quả thử CLI (headless) + khai giới hạn desktop; H2: gate-card không in lệnh nào (kiểm kê 0 hit) → không áp | fixed: entry d-4507 (xem sổ) |
| P2 | contract AC-4 · E4 | Ba trạng thái Analyst mà AC đo hai đầu; ngưỡng 20 không chiều đỏ; fixture tự dựng | «có n-a là tha» → n-a trần hết cờ mà ca xanh; khuôn thật khác fixture → thẻ thật vẫn đỏ oan | Chân thứ ba n-a trần/ngắn → cờ ghim; round-trip Analyst thật của A/B/C → 0 cờ | fixed: AC-4 ba trạng thái + round-trip |
