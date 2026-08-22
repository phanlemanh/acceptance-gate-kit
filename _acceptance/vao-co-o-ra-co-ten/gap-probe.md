---
slug: vao-co-o-ra-co-ten
at: 2026-08-22T01:10:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E8(i) quét LỚP «mọi docs/plans/*hat-giong-<slug>.md» không có assert vũ trụ; chiều đỏ dùng file do chính test tạo đúng pattern của test — [d-20260821T170000Z-4109] «assert vũ trụ» | Glob lệch tên thật → cây thật trả 0 file → (i) xanh rỗng; hạt giống thật không ô lọt lưới | VC8: assert ≥ 13 hạt giống và tập slug ⊇ 7 mới ∪ 6 cũ; chiều đỏ thứ hai: đổi tên một file thật ra khỏi pattern → đỏ nêu slug | fixed: AC-8(i) + E8 thêm assert vũ trụ và chiều đỏ đổi-tên |
| P1 | evals | E4 một commit → không phân biệt commit ĐẦU với commit cuối; chỉ đặt COMMITTER_DATE, contract không nói mốc nào | Stub commit D, sửa chính tả D+9 → bản cài đọc log -1 trả since = D+9 → thẻ nói sai tuổi, E4 vẫn xanh | VC4: hai commit (−10, −1) đặt cả AUTHOR lẫn COMMITTER date → since == −10; contract ghi rõ committer date của commit đầu | fixed: AC-4 ghi committer date commit đầu (diff-filter=A); E4 fixture hai commit + mutant tail→head |
| P1 | evals | AC-6(ii) sáu mệnh đề nhưng E6 ghim 3 chuỗi; «cả hai lối» và «bắt đầu ở ---» không đo; (iv) dựng stub từ khuôn chứ không từ khối dặn | Khối nằm trong nhánh có brainstormSkill → lối không skill vẫn mù (đúng lỗi gốc), E6 xanh; khối quên «---» → agent viết H1 trước frontmatter → hồ sơ hỏng như [d-20260821T161802Z-13533] | VC6: ma trận 6 mệnh đề viết trước, vị trí khối trước cả hai nhánh, (iv) rút code span từ khối lúc chạy rồi quét; chiều đỏ gỡ span → đỏ nêu mệnh đề | fixed: AC-6 viết ma trận ① – ⑥ + vị trí + round-trip rút-span; E6 theo đó |
| P2 | contract | AC-8(i) chân «được contract nêu tên» không định nghĩa phép khớp; 6 hạt giống cũ chỉ còn chân này | Contract đã ký nêu hạt giống bằng dạng khác → E8 đỏ trên cây thật → phải sửa contract đã ký hoặc nới luật tại S3 | Contract ghi phép khớp (đường dẫn tương đối nguyên văn) + chân thứ ba (con trỏ trong chính file); fixture một hồ sơ mỗi chân + mồ côi | fixed: AC-8(i) ba chân khớp tường minh + fixture mỗi chân |
| P2 | design | AC-6(i) không nói hành vi khi N = 0 | Consumer không có ý nào → mỗi /start in «Đang cân nhắc: 0 ý · cũ nhất undefined ngày» — nhiễu thường trực, trái North Star | Khối dặn N = 0 → bỏ dòng; VC6 thêm mệnh đề; AC-7 đối chứng considering rỗng | fixed: AC-6(i) thêm N = 0 → không in; E6 assert; E7 đối chứng mảng rỗng |
