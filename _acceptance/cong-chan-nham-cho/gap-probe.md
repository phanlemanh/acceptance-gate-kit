---
slug: cong-chan-nham-cho
at: 2026-08-16T10:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Phản biện context sạch — cong-chan-nham-cho

Critic: subagent tươi, 5 input (design · contract · evals · decisions · claims). One-pass.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract AC-1/AC-2 + evals E1/E2 | Làn V ở pre-merge mở bằng CHUỖI (mo + T2 + vết) không đo QUAN HỆ mo ⇔ xanh-sạch; không chân «mo nhưng report không sạch» — cùng lớp [veto-co-dau-vet#F2] | Report bị sửa thêm UNCERTAIN/Known limits sau S4 hoặc ai gõ tay mo → pre-merge NOTE, exit 0 → trượt qua biên merge không chữ ký | AC-2(d) mo + không sạch + chưa ký → VIOLATION; dùng lại khối kiểm 6 điều kiện đợt 2, không viết bản hai; chân giữ-gân (e) | fixed: AC-1 đòi (xanh-sạch HOẶC human_signoff), AC-2 thêm (d)+(e), E2 4/4+giữ-gân, design #1 |
| P1 | Coverage «hành vi máy» + AC-8 · spec | Gỡ lớp 2 mà không AC nào đo cái THAY nó: chiều GHI human_signoff không ai canh; provenance forge chỉ thật khi có approval — cùng lớp [veto-co-dau-vet#F1] | Agent trong feature-loop tự điền human_signoff + signed-off + commit cùng bản đồ → 0 VIOLATION, 0 NOTE, không ai thấy chữ ký ra đời | NOTE chiều ghi theo diff PR (rẻ, người merge thấy); E8 ca 4 agent bị bảo điền chữ ký → từ chối; ADR nêu điều kiện forge | fixed: AC-11/E11 NOTE chiều ghi; E8 ca 4; design #1b; ADR sẽ ghi điều kiện |
| P1 | AC-8 · dap-an-E8 · ca-E8 | Ô đáp án không trace về thân lệnh (hiển-thị-lại danh tính · một-câu-đóng), đề/đáp án chưa nộp cùng Gate 1 — cùng lớp [cat-khoi-viec-cua-anh-tren-tin#F1] | Thợ sửa đúng spec nhưng không thêm câu ấy → REJECT trên vật đúng, hoặc giám khảo tự nới | Mỗi ô phải ghi «neo: <câu trong signoff.md>», ô không neo → loại; nộp đề + đáp án cùng Gate 1 | fixed: AC-8 + đáp án ghi luật neo; hai câu ấy ĐÃ CÓ trong thân lệnh (bậc thang ③b + điều khoản mời cổng) — design «KHÔNG làm» khai giữ nguyên; đề + đáp án đã nộp cùng bộ này |
| P1 | PHAM-VI-RANG + AC-5/E5 | Phạm vi thiếu lib/hooks; needle dạng scaffold không bắt prose/identifier trần; «human-owned» vắng — cùng lớp [luu-kho-codex-va-nghi-le-design#F1] | Reader khác pre-merge còn đọc khoá; GUIDE/README còn nghi lễ mà E5 in 5/5 | Phạm vi + lib/hooks; needle trần; allowlist 2 chỗ khai-in-ra; chân (b) hook+recheck mù với khoá cũ | fixed: PHAM-VI-RANG +lib +hooks; AC-5/E5 needle trần {require_human_commit, agent_authors, human-fields-only, human-owned, commit RIÊNG} + chân (b) |
| P2 | SO-CA-PHAN-RA · E9 | Phân rã thiếu site plugins ~208 (P30) và ca đọc README/GUIDE — cùng lớp [luu-kho-codex-va-nghi-le-design#F2] | Suite plugins lệch → E9 đỏ vì thước chưa khai | Thêm dòng P30; E9 kiểm mọi ca trong bảng tồn tại + không FAIL ngoài bảng | fixed: PHAN-RA thêm P30 + dòng README/GUIDE (không ca nào — kiểm bằng E5), V04/V05 thêm → scripts 686→691; E9 kiểm tồn tại |
