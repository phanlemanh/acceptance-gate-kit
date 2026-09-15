---
slug: chu-ky-khong-tu-lam-hoa-cu
at: 2026-09-15T00:52:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | Loại trừ `_acceptance/*` và `*/_acceptance/*` không nói khớp bằng gì; qua `globToRe` (`*` không xuyên `/`) thì `_acceptance/<slug>/evidence-report.md` (sâu 2) và `pkg/a/_acceptance/...` KHÔNG bị loại — mà đó là tệp bẩn ở 100 % lượt ký | Mọi `/signoff` thật: bước 6 vừa ghi `human_signoff` vào tệp sâu 2 → vị từ thấy «tệp ngoài loại-trừ» → làn chạy trọn 13 phút như cũ → dòng 1 không giảm, rơi đúng ngưỡng CHẾT của hồ sơ cơ hội | Loại theo PHÂN ĐOẠN đường dẫn (một đoạn bằng `_acceptance`, mọi độ sâu), không qua globToRe; SK1b thành ma trận 4 ô viết trước, có ô tiền tố giả `_acceptance-x/` phải KHÔNG bỏ qua | fixed: AC-4 khai vị từ theo phân đoạn + ma trận 4 ô; E4 expected ghim 4 assert; design mục (c′) sửa |
| P1 | evals + design | E6/SK5 không dựng trạng thái cây thật lúc 7b chạy: sau bước 6 thì `_acceptance/<slug>/*` VÀ `routing-baseline.txt` (tệp code) đều bẩn chưa commit — trạng thái ghép mà (d)+(c′) chỉ cùng nhau mới tạo ra | SK5 chạy trên fixture đã commit sạch nên xanh, trong khi lượt ký thật gặp tệp code bẩn ở vị từ hoặc ở gác cây-bẩn → không bao giờ bỏ qua trong sản xuất; răng xanh mà vật hỏng | SK5 dựng fixture hậu-bước-6: chữ ký chưa commit + dòng baseline sinh bằng chính `routing-baseline.mjs --write` chưa commit, rồi chạy nguyên văn lệnh 7b rút từ khối → `skipped: true` | fixed: AC-6 viết lại quanh trạng thái ghép; E6 expected dựng đúng fixture đó + chiều đỏ gỡ baseline khỏi T1 |
| P1 | evals + contract | AC-2 hứa «LM20 xanh sau khi sinh» nhưng RB2b chỉ đo «LM20-shape» — một bản chép phép so ở phía răng, không phải LM20 thật; `settled` chưa một-nguồn; không nói `--extract` sập thì làm gì `[release-2-11-0#F1]` | Làn bỏ qua nên LM20 không chạy trước commit chữ ký; LM20 thật so theo thứ tự hoặc dùng `settled` riêng → đỏ ở CI SAU chữ ký → quay lại đúng 10 phút chẩn LM20 + sửa fixture sau ký `[release-2-10-0#F1]` | RB2b gọi ĐÚNG ca LM20 của `gate-card-lmcms.test.mjs` trỏ kho fixture (root qua tham số/env, không hardcode) → `PASS: LM20`; RB2e ghim LM20 nhập cả `routingLine` lẫn `settled`; RB2f: extract hỏng → exit khác 0, tệp byte-giống; bước 6 của signoff chạy tệp ca LM20 làm đối chứng dương trong luồng thật | fixed: AC-2 + AC-3 viết lại; E2, E3 expected sửa |
| P1 | evals | E7 tuyên «hai tệp ca mới được wire tự động» nhưng phép đo chỉ là suite exit 0 — không assert nào chứng minh chúng đã chạy; E1–E6 gọi thẳng tệp ca nên vẫn xanh dù suite không chứa | Runner dùng danh sách tệp tường minh hoặc glob không khớp → RB*/SK* không bao giờ chạy trong `tests/scripts` → E7 xanh, CI về sau mù với hồi quy vị từ bỏ qua | E7 theo nếp pipefail + grep: đầu ra suite phải chứa `PASS: RB1` VÀ `PASS: SK1` — đỏ ở cây gốc, đỏ khi không wire | fixed: E7 expected ghim hai chuỗi + chiều đỏ đổi tên tệp ca |
| P2 | evals | Fixture RB1/SK* dựng `verified_commit` tay theo khuôn BÊN ĐỌC; không ca nào để writer thật ghi pin rồi mới đọc lại `[lan-doc-status-not-run#F2]` | Mã bỏ qua đọc pin ở khuôn khác chỗ writer thật ghi → sản xuất rơi vào nhánh «pin vắng → chạy trọn», mất trọn lợi ích trong khi mọi SK vẫn xanh | Pin ghim bằng chính `repin-lane.mjs --write` trong cùng lần chạy, rồi mới gọi `--skip-unchanged`; assert `sha` của JSON bỏ qua == SHA writer vừa ghi. Áp cho cả RB1 | fixed: AC-1 + AC-4 khai writer thật; E1, E4 expected sửa |

Một-pass theo nghi thức: artifact đã sửa, KHÔNG probe lại (phần code còn 3 round S4).
