---
slug: lan-v-giu-loi-trong-hop-dong
at: 2026-11-10T14:17:31Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Giữ hồ sơ `verified` chưa ký ở mọi PR là lựa chọn của người mà sổ không ghi, design không khai số hồ sơ chịu ảnh hưởng | Kho có hồ sơ `verified` cũ còn lỗi nhẹ: trước bản vá qua, sau bản vá mọi PR đỏ | Dòng chỉ-người có lối khác và giá, design khai số theo kho | human-gate1: dòng sổ mới thành câu hỏi trên thẻ; design khai bảng đo bốn kho, 0 hồ sơ chịu ảnh hưởng |
| P0 | design | Dòng «sai khuôn thì giữ» ghi một lối, chưa xét lối giữa chỉ giữ khi PR có đổi hồ sơ | Hồ sơ khuôn cũ chưa ký làm đỏ mọi PR, người duyệt tưởng không có lối khác | Thay bằng dòng chỉ-người | human-gate1: phạm vi xét gộp vào cùng câu hỏi trên; dòng cũ thay bằng dòng mang `supersedes`, chỉ quyết việc khi luật đã xét tới |
| P1 | evals | E10 xanh khi vắng hai kho chứa ba hồ sơ rủi ro | Chạy chỉ có kit, AC-10 coi như đạt mà ba hồ sơ chưa được chạy qua | Kho bắt buộc, ghim ba tên, đối chứng bỏ miễn trừ | fixed: ba kho bắt buộc, vắng là đỏ, ghim ba tên kèm đối chứng |
| P1 | evals | Fixture tự khớp bộ đọc, không eval nào rút từ mục do lượt chấm thật ghi | Câu thật lệch nhẹ bị xếp sai khuôn, E2 E3 E4 vẫn xanh | Chạy bộ đọc trên hồ sơ thật, so bản kê chốt trước | fixed: thêm E2b với bản kê và cách đếm độc lập |
| P1 | evals | Ma trận không viết ra, thiếu trục người duyệt chưa ký, thiếu dạng rỗng và sai khuôn ở hai bản dựng, thiếu ca bộ đọc ném lỗi và đột biến bỏ fail-closed | Gạch đầu dòng không in đậm đọc thành không có lỗi; bộ đọc ném lỗi bị nuốt | Bảng phần tử, ca ranh giới, đột biến có ghim | fixed: khai 39 tình huống và kết luận từng dòng, phủ trục A4, thêm ca ném lỗi và đột biến `bo-fail-closed` |
