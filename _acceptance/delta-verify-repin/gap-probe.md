---
slug: delta-verify-repin
at: 2026-08-05T00:00:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Gap-probe — delta-verify-repin

Critic fresh-context, 5 input (design + contract + evals + ledger + claims-scan
10 bài học). Corpus claims: cite `[context-ladder#F1]` được dùng ở 1 finding.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Hoán vị "lane fail vẫn ký" chỉ sống ở judgment — không luật MÁY nào đọc `suites_exit`: T1 chỉ khớp run_id+sha, dòng repin mang suite ĐỎ vẫn qua sạch — mâu thuẫn tuyên bố "chống gian lận bằng máy" và điều kiện chết "fraud-case không bị máy bắt → không ship" | Lane chạy, 1 suite exit 1; vẫn append dòng repin và ký evidence cite run_id, verified_commit==sha → recheck + pre-merge clean → merge chữ ký trên suite đỏ | Luật mới: dòng repin được cite mà suites_exit có phần tử ≠0 → VIOLATION đích danh; fixture đỏ + đối chứng dương; chỉ THÊM, hợp O1 | fixed: thêm AC-15 + E2 nhánh (3); design T1 bổ sung máy-đọc-suites_exit |
| P1 | evals | Seam LLM-viết→máy-đọc của dòng repin + section Re-pin không có khuôn một-chỗ-có-marker, không eval round-trip: E1 ghim chữ SKILL, E2 tự dựng fixture đúng khuôn bên đọc — hai bên trôi mà cả hai vẫn xanh; cite [context-ladder#F1]; design từng wobble `suites` vs `suites_exit` | Writer ghi `suites_exit`, reader đọc `suites` → VIOLATION oan trên việc lương thiện hoặc reader khớp lỏng → gian lận lọt; E1 lẫn E2 vẫn xanh | Khuôn đặt một chỗ giữa marker REPIN-TEMPLATE (mẫu OOC-ITEM-TEMPLATE); eval round-trip rút-từ-writer-parse-bằng-reader | fixed: thêm AC-16 + E15 (case DV12); design mục A.4; wobble suites→suites_exit đã chuẩn hoá |
| P1 | evals | E5 âm-tính-một-mình: "0 dòng '-'" không đối chứng đột biến, không sanity counter, base không định nghĩa — 0-hit của phép diff hỏng cho cùng màu xanh (lớp grep-sanity) | Base tính sai (diff HEAD..HEAD / pattern không match) → diff rỗng → E5 xanh trong khi luật cũ THẬT SỰ bị sửa — ngưỡng chết O1 duyệt nhầm | (a) base suy từ git merge-base lúc chạy; (b) sanity counter >0; (c) mutant sửa-1-luật-cũ → đỏ đích danh | fixed: E5 expected siết đủ 3 răng |
| P2 | evals | E2 chưa có nhánh run-log VẮNG file — implementation branch trên file-not-exists có thể skip âm thầm (cửa hậu T1) | Kẻ gian xoá run-log slug rồi ký evidence cite run_id → pre-merge clean; hoặc checkout thiếu file → VIOLATION oan | Nhánh 4 DV2: file vắng + evidence cite run_id → VIOLATION đích danh (vắng file ⊇ vắng dòng) + đối chứng dương | fixed: gộp vào AC-15 + E2 nhánh (4) |
| P2 | evals | E14 (mirror sync) treo dưới AC-14 dogfood — sync xanh sẽ tô xanh AC chưa hề được đo; người ký Gate 2 thấy dấu máy xanh trên lời hứa chưa kiểm | Ship xong re-pin dogfood chạy N lane (bỏ nghi thức) — E14 vẫn PASS, card tô AC-14 đạt → ký trên bằng chứng không đo lời hứa | Tách: sync về AC hạ tầng; AC-14 nhận eval đích danh tại Gate 2 hoặc đánh dấu tường minh không-tô-xanh-trước | fixed: E14 → AC-11; AC-14 thành (judgment) + E16 trả UNCERTAIN trước sự kiện, người đo tại Cổng 2 |

Cross-check còn lại sạch: 16/16 AC có eval; 4 trục Coverage đều có AC;
cross-layer duy nhất (atomic-pair) có AC-9/E9; ui-check không áp (CLI-only).
Không finding nào lật 3 quyết định đã ghi trong ledger.
