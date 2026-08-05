---
slug: matrix-measure-law
at: 2026-08-05T05:10:00Z
verdict: findings
p0: 1
p1: 2
p2: 1
---

# Gap-probe — matrix-measure-law

Critic fresh-context, 5 input (claims-scan trả 10 bài học; cite
`[hinh-theo-mat-phang#F1]` được dùng). Chủ đề trớ trêu được soi đúng: các
eval của luật-đo-lường tự vi phạm hình dạng chúng luật hoá.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | M3 so prompt với MEASUREMENT_SHAPES lấy từ CHÍNH script — expectation cùng nguồn với vật đo (writer/reader cùng nguồn, hình dạng 2 + bài học so-với-checkout-tác-giả) | Mutant xoá 1 shape → prompt lẫn expectation co lại cùng nhau → MM3 vẫn xanh; GO-2 mutation coverage xanh giả | Test PIN 6 hình dạng thành hằng độc lập chép từ design doc; so ba-chiều pin↔const↔prompt | fixed: M3 expected siết ba-chiều |
| P1 | evals | Ma trận mutation M7 thiếu chân codex — 4 câu bên codex chỉ có mutant gộp (chính hình dạng 5: điểm-case thay ma trận, trên trục S của contract) | Xoá 1 trong 4 câu ở codex SKILL, regex lỏng vẫn khớp → M2 xanh, parity 2 harness trôi im lặng | Ma trận 14 mutant viết-trước (6+4+4), mỗi mutant đích danh | fixed: M7 thành 14 mutant, AC-7 khớp số |
| P1 | evals | Chân điểm-cắm-1 toàn đo CHỈ DẪN (chuỗi trong SKILL + judgment đọc văn) — không phép đo HÀNH VI nào trên artifact vi-phạm; cite [hinh-theo-mat-phang#F1] | 4 câu có mặt nguyên văn nhưng mơ hồ đủ để critic trả clean đúng chữ; lớp lỗi tái xuất ở feature kế, O2 chỉ thấy SAU khi đốt round | RED-probe: fixture gài-1-vi-phạm + bản sạch đối chứng, fresh critic chạy ý (4) → phải gọi tên hình dạng | fixed: thêm M11 (judgment ×3, fixture evidence/red-probe-artifact.md sinh ở S3) + AC-9 mở rộng |
| P2 | evals | M6 ghim prompt cũ bằng chuỗi chép tay không neo nguồn | Chép pin sau khi lỡ sửa 1 từ prompt cũ → pin khớp bản-đã-sửa, NO-GO bị tô xanh | Pin phải khớp git show sha-trước-feature ghi trong test | fixed: M6 expected thêm neo nguồn |

Cross-check còn lại sạch: 10/10 AC có eval (nay 11 eval); 4 trục Coverage đủ
AC; cross-layer không áp (CLI-only); M4/M5 đo quan hệ pipeline có đối chứng
dương; inputs judgment đường dẫn tương đối. Không finding nào lật 3 quyết
định trong ledger.
