---
slug: ban-do-khuon-roi-nhom
at: 2026-11-03T09:09:44Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract + evals | Hàng rời nhóm chỉ có dạng mapping một dòng vắng khoá; `khoi:` để trống và `khoi: ""` chưa xếp về phía nào; R2 gộp `''` vào nhánh null | Bộ đọc chỉ gán null ở một dạng viết, kho viết dạng khối vẫn bị báo oan mà RN xanh; hoặc `khoi: ""` hôm nay không miễn gì lặng lẽ thành rời nhóm | Ma trận trục A phía rời nhóm viết trước; `khoi: ""` xếp tường minh vào AC-3 hoặc AC-1/2, Out of scope ghi theo lựa chọn | fixed: rời nhóm thu về đúng ca VẮNG HẲN khoá `khoi` (design R2); RN-2 thêm hàng dạng khối nhiều dòng + đối chứng; RN-3 thêm `khoi:` trống và `khoi: ""` (bằng hệt gốc); Out of scope ghi ba cách viết giữ nghĩa cũ |
| P1 | design | Nghĩa mới lật chiều an toàn của mục thiếu `khoi` (trơ → gỡ tệp khỏi phép chấm) mà design không nêu đánh đổi, lối khác và giá [khuon-doc-ban-do-that#F1] | Người định miễn khối Hop mà quên dòng `khoi`; trước vá thấy lệch, sau vá tệp im và thẻ in 0 lệch | Design nêu lối đã chọn, một lối sống khác kèm giá, căn cứ; đếm số mục rời nhóm thật trên hai kho | fixed: design R6 (căn cứ: chủ kho đã định nghĩa V0, không phải khẩu vị mới; ba chốt: chỉ vắng khoá, bắt buộc ly_do, khuôn tệp nói thẳng; lối khác in dòng «rời nhóm» kèm giá và ngưỡng mở); RN-5 đếm mục rời nhóm (≥ 16 kho thứ hai, 0 crm) |
| P2 | contract | Coverage nói cờ «chưa chấm khuôn» của theCong2 «ghi giới hạn ở design R1» mà R1 không có câu giới hạn | theCong2 vẫn cắm cờ cho tệp đã rời nhóm, người ký tưởng giới hạn đã khai | Thêm hàng đo theCong2 hoặc khai giới hạn thật | fixed: RN-4 đo theCong2 — tệp rời không cờ, tệp không khai có cờ, bộ máy gốc có cờ (đối chứng); AC-4 nói thẳng |
| P2 | design + evals | Lời hứa `"khoi": null` ở --json và chữ «rời nhóm» trong câu báo sai không có eval | Vật in `""` hay giữ «?» mà RN vẫn xanh | Ghim `"khoi": null` + trường khác bằng hệt gốc; dòng sai chứa «rời nhóm» | fixed: RN-1 ghim `--json` (cây null, gốc "" — đối chứng, còn lại bằng hệt); RN-2 ghim «(src/man/bang/Moi4.tsx · rời nhóm)»; RN-6 ghim khoi null ở ví dụ của khuôn |
| P2 | contract (Đường đo) | Ngưỡng SỐNG/CHẾT đo trên việc bản đồ có bị đổi, mà đường đo sau phát hành chỉ đọc khuon-cham.json | Kho thêm khoi giả cho bước chấm im, khuon-cham.json xanh, hồ sơ mốc đọc thành SỐNG | Thêm lệnh diff tệp bản đồ từ commit cài mốc tới commit của vòng | fixed: Đường đo thêm `git diff <commit cài mốc>..<commit của vòng> -- design/patterns/`, có dòng đổi chỉ để bước chấm im thì ghi CHẾT |
