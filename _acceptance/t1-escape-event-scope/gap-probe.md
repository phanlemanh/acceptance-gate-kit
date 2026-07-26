---
slug: t1-escape-event-scope
at: 2026-07-26T11:20:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — t1-escape-event-scope

Critic đọc đúng 4 file (design · contract · evals · ledger), cấm đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design + contract | Không AC nào đo TRIỆU CHỨNG GỐC. 13 AC đều đo hành vi của cờ, không cái nào nói "chạy tại đúng commit hạ tầng đã repro → exit 0". Tệ hơn: khối repro in `2 violation(s)` mà chẩn đoán chỉ nói về MỘT — vi phạm còn lại không được nêu tên | Ship với 14 eval xanh, Cổng 2 ký. Commit release kế tiếp lên main: răng T1-escape im, nhưng vi phạm thứ hai vẫn nổ → job gate vẫn đỏ. Feature đạt acceptance mà mục tiêu không đạt — đúng failure mode ADR 0004 | AC end-to-end trên fixture commit hạ tầng; design phải nêu tên vi phạm thứ hai | **fixed**: +AC-16 (E17) đo `pre-merge-check: clean` + exit 0 trên fixture; design thêm bảng nêu tên cả hai vi phạm (cái thứ hai là `verdict=PENDING-JUDGMENT` của feature trước, đã hết ở `ea38973`) |
| P0 | contract AC-7 + trục phân loại file | Ngữ nghĩa `t1_skip_globs` khi diff HỖN HỢP không được đặc tả. AC-7 chỉ nói "PR CHỈ đổi file dưới plugins/". Lý do MỚI so với d-202: entry đó chỉ cân nhắc "miễn trừ plugins/ có mở lỗ không" (trả lời bằng P30), không cân nhắc lọc per-file vs whole-diff | Người cài đặt đọc thành "diff chạm bất kỳ glob T1 nào → bỏ qua răng". Vì CLAUDE.md bắt sync mirror cùng lượt, gần như MỌI PR thật đều chạm `plugins/**` → răng chết im lặng trên gần hết PR. E1 (chỉ non-T1) và E7 (chỉ plugins/) đều xanh, không eval nào bắt được | AC + case diff hỗn hợp: phải VIOLATION, liệt đúng file non-T1, KHÔNG liệt file plugins/. Kèm AC true-negative T1 thuần | **fixed**: +AC-14 (E15) ghim per-file + ca hỗn hợp, +AC-15 (E16) true-negative. Kiểm chứng: mã hiện tại ĐANG lọc per-file (`match_globs` trong vòng lặp), nên đây là ghim ngữ nghĩa trước khi ai đó sửa hỏng, không phải sửa lỗi đang có |
| P1 | contract AC-3 + evals E3/E14 | Marker được ghim nguyên văn nhưng "dòng tổng kết khai đã tắt" KHÔNG có chuỗi nào được ghim, không định dạng, không nói khai bằng cách nào | Người cài đặt in một câu bất kỳ; TE3 tự chọn regex khớp chính nó → xanh. Ba tháng sau câu chữ đổi, regex vẫn khớp (hoặc CI consumer grep chuỗi khác) → tín hiệu tắt mà suite vẫn xanh. Đo cái không định nghĩa = tác giả tự viết cả đề lẫn đáp án | Ghim nguyên văn dòng tổng kết như đã ghim marker; E3 so khớp chuỗi cố định `grep -F`, không regex | **fixed**: AC-3 ghim CẢ HAI chuỗi nguyên văn; E3 dùng `grep -cF … == 1` cho từng chuỗi |
| P1 | evals E9 | Fixture "bump ba manifest → suite vẫn xanh" chưa hoà giải với P30 (`mirror == nguồn`) và với AC-11 (bump và sync đi đôi) | Chạy E9: bump 3 manifest mà không sync → P30 đỏ vì DRIFT, không vì ghim literal. Người sửa hoặc nới P30 (mở lỗ thật), hoặc thêm sync rồi tuyên bố AC-9 đạt trong khi thứ vừa chứng minh là "bump + sync thì xanh" — không phải mệnh đề của AC-9 | Fixture nêu rõ: bump RỒI sync; assert `git diff --exit-code -- tests/` sạch thay vì chỉ "suite xanh" | **fixed**: E9 → case P45 với fixture tường minh và assert trên `tests/` |
| P1 | design + contract | Không nơi nào định nghĩa `reason=` lấy giá trị từ đâu; cờ có nhận tham số không cũng không nói | Cài đặt in `reason=` rỗng hoặc `reason=flag`. E3 (`grep -c == 1`) xanh; E14 (diff byte-đối-byte với chính output vừa sinh) theo thiết kế KHÔNG thể bắt vì nó so output với output. Đến E13 judge không trả lời được "VÌ SAO tắt" → AC-13 FAIL tại Cổng 2, sau khi đã tiêu hết vòng verify | Chốt: cờ nhận giá trị bắt buộc, HOẶC reason là hằng cố định có nội dung; AC-6 assert gate.yml truyền đúng giá trị | **fixed**: chọn HẰNG `reason=push-event-no-pr-premise` (cờ không nhận tham số — giữ ranh giới "không thêm cờ nào khác"); AC-3 ghim nguyên văn, AC-6 assert `--no-t1-escape` không tham số |

## Định đoạt — tóm tắt

5/5 sửa **trên giấy**, không finding nào `deferred`, không cái nào đẩy `human-gate1`.

Delta: **13 AC → 16 AC**, **14 eval → 17 eval**, **8 trục → 9 trục** (thêm trục
diff hỗn hợp và trục triệu chứng gốc).

Điểm đáng ghi nhất: cả hai P0 đều là **lỗ trong chính chẩn đoán của tôi** — một
cái bỏ sót nửa bằng chứng mình vừa in ra, một cái đặc tả thiếu đúng ngữ nghĩa mà
gần như mọi PR của repo này sẽ chạm. Một-pass: không re-probe (quy ước S1#7).
