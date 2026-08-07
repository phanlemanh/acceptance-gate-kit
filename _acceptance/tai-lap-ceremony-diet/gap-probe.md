---
slug: tai-lap-ceremony-diet
at: 2026-08-07T21:35:30Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals+contract (AC-1/E1) | Không có discriminator bắt-buộc↔optional cho chỉ dẫn phút; mutation 1-file-1-hình-dạng — lớp không-có-mốc-định-danh [stop-patching-law#F2] | Grep thô → đỏ giả trên mention optional; hoặc đổi câu ở 1/7 file → nghi thức sống lại mà eval xanh | Bảng khuôn-cấm đích danh trong marker + đối chứng optional-không-đỏ + mutation lặp từng file + đẳng thức tập hợp | fixed: AC-1 + E1 viết lại đủ 4 vế |
| P1 | evals (E3) | sign-batch là writer MỚI của seam chữ ký mà không round-trip qua reader thật — lớp writer↔reader trôi (hình dạng 3 CLAUDE.md) | Helper điền đúng đủ để test tự viết công nhận nhưng sai khuôn pre-merge/hook thật → lô ký gộp đầu tiên ở consumer bị chặn | E3 chạy pre-merge-check.sh thật trên fixture sau ký → clean; fixture từ khuôn evidence-report-template.md | fixed: E3 + AC-3 thêm reader thật |
| P2 | evals (E5) | Tuyên 7 manifest, paths chỉ 5 — ma trận toàn phần không viết trước [codex-script-packaging#F1] | Mirror kẹt 1.x mà E5 xanh; consumer từ mirror gặp đúng bug số-trùng | Khai đích danh đủ 7 + đếm ==7 + mutation trên mirror | fixed: E5 paths 7 manifest + mutation mirror |
| P2 | evals+design (E7/AC-7) | Đường qua pre-merge của contract mẫu không khai — mở cửa fixture-viết-tay chữ ký | Sim xanh nhờ human_signoff chép tay đúng khuôn bên đọc — không chứng minh dùng-được-từ-số-không | Ký mẫu bằng CHÍNH sign-batch (round-trip 1b↔sim), cấm chép tay | fixed: AC-7 + E7 ràng chữ ký qua sign-batch |
| P2 | design+contract (AC-2) | Định nghĩa KPI chỉ được đo là CHỮ, chưa từng THI HÀNH — lớp đo-hình-dạng-không-chạy [measure-teeth-cleanup#F1]; feature đầu tiên dưới MEASURE-BIRTH mà thước đầu khai sinh không chạy được | Lệnh sai cú pháp/mơ hồ → mọi phiên report sau bịa số, KPI thay thế chết non trong khi E2 xanh | Thi hành lệnh một lượt trên kit thật → số ≥1 kèm slug; mutation hỏng cú pháp → đỏ ghim tên lệnh | fixed: AC-2 + E2 thêm vế thi-hành-được |

Ghi chú: không finding nào lật quyết định trong decisions.jsonl — F5 củng cố
KPI-git-log bằng cách bắt nó chạy được, F2 củng cố không-tự-commit bằng
reader thật. Ánh xạ AC↔eval 7/7 sau sửa.
