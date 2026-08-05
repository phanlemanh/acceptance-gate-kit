---
slug: judge-required-evidence
at: 2026-08-05T08:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — judge-required-evidence

Critic fresh-context, 5 input (claims-scan 10 bài học; cite
`[context-ladder#F1]` + `[matrix-measure-law#F1]`). Đáng ghi: **cả 5 finding
đều đến từ 7 câu luật-đo-lường vừa ship ở vòng 2** — luật mới chạy thật ngay
lần S1 đầu tiên sau khi ship (dữ liệu sống cho O2).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | J1/J2/J3 stub + J5 fixture tự dựng đúng khuôn bên đọc — không rút từ writer thật (VERDICT_SCHEMA, khuôn template); cite [context-ladder#F1] | Schema quy định khuôn X, parser đọc Y, stub viết theo Y → test xanh hết, judge thật trả X → memo rụng danh sách ở production | Stub sinh-từ-schema; fixture sinh-từ-khuôn-template; round-trip cả 3 seam | fixed: J1/J2/J3/J5 expected siết sinh-từ-writer |
| P1 | evals | J11 âm-tính-một-mình: "0 VIOLATION mới" không đối chứng dương, không sanity, không baseline viết-trước | Đường gọi hook sai/corpus rỗng → 0 VIOLATION tất nhiên, đường đọc-cũ vỡ mà vẫn xanh | Tiêm 1 vi phạm biết trước vào bản sao → đỏ đúng thông điệp; sanity số file >0; baseline viết trước | fixed: J11 expected đủ 3 răng |
| P2 | evals | J13 chấm SOURCE thay vì ĐẦU RA (đo chỉ dẫn — hình dạng 1) | stdout runtime lộ tiếng máy dù source đọc ổn → AC-13 fail tại Cổng 2 dù J13 xanh | Input J13 = stdout thật capture trong vòng verify | fixed: J13 inputs → evidence/gold-stdout.txt (sinh ở S3/S4) |
| P2 | evals | Chặng report của AC-2 đo bằng grep prompt — quan hệ memo-có-dấu ⇒ report-hiện-dấu không được đo | LLM synthesize bỏ rơi dấu → report sạch, O3 mù, J2 vẫn xanh | Token dấu vào khuôn template một-chỗ + round-trip như J4 | fixed: J2 + J4 expected gộp token vào khuôn |
| P2 | evals | J5 "byte-tương-đương" không khai nguồn baseline — nguy cơ so-với-chính-mình; cite [matrix-measure-law#F1] | Cờ lạc xuất hiện ở cả hai lần chạy cùng code mới → tautology xanh, cờ oan ship | Baseline sinh bằng gate-card tại BASE COMMIT trong chính lần chạy | fixed: J5 expected khai nguồn baseline git |

Cross-check còn lại sạch: 14/14 AC có eval 1-1; 4 trục Coverage đủ;
cross-layer không áp (CLI-only). Không finding nào lật 3 quyết định ledger.
