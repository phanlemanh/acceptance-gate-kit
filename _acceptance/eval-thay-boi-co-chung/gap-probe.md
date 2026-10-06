---
slug: eval-thay-boi-co-chung
at: 2026-10-06T09:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Gap-probe — eval-thay-boi-co-chung

Phản biện context sạch (một tác tử tươi, sáu tệp: design doc, contract, evals, sổ quyết định,
bài học xuyên hồ sơ, opportunity). Không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Bảy điều kiện chỉ chứng hồ sơ thay còn sống, không chứng nó nhận việc thay; con trỏ viết vào hồ sơ CŨ sau khi ký nên người ký hồ sơ thay chưa từng thấy lời thay | khai con trỏ tới `ho-so-bat-ky#AC-1` (đã ký, không liên quan, AC-1 còn eval sống) → làn xanh, recheck 0, phép đo cũ biến mất — đúng ngưỡng chết của ô | điều kiện mới: hồ sơ thay nêu thẻ `<slug cũ>/<id>` trong contract hoặc design doc; hàng ma trận + mutant | fixed: điều kiện 6 `thay-khong-nhan` (design, AC-1, AC-2, E1, E2; sổ d-…-8); giới hạn «đọc văn bản hiện tại» khai ở Notes |
| P1 | design | Điều kiện eval sống chỉ đọc evals.yaml hiện tại, không đọc báo cáo đã ký của hồ sơ thay | thêm eval chưa từng chạy phủ AC vào hồ sơ thay sau khi ký → qua; mở lại vòng tròn | eval phủ AC phải có mã thoát 0/mã đã khai trong báo cáo đã ký; hàng ma trận + đối chứng | fixed: điều kiện 8 đọc báo cáo đã ký (design, AC-2, E2) |
| P1 | evals | So AC bằng «chứa» — `AC-1` khớp `AC-10`; không hàng cho criterion nhiều AC | con trỏ `#AC-1` khi chỉ AC-10 sống → nhận một ô không thước | so theo ranh giới thẻ; hai hàng ma trận + mutant chuỗi con | fixed: design điều 8 «so theo ranh giới»; AC-2/E2 thêm hàng từ chối + hàng nhận «AC-3, AC-7» + mutant |
| P1 | design | Điều kiện trạng thái nhận cả machine-cleared, mâu thuẫn ý định «chữ ký người cho việc thay» | hồ sơ thay làn V, cả chuỗi không có quyết định người nào | chỉ nhận signed-off; hàng ma trận machine-cleared | fixed: điều kiện 4 chỉ `signed-off`, lý do `ho-so-thay-chua-ky` (sổ d-…-7 thay d-…-4) |
| P2 | evals | Làn ghim lại không được kiểm khi cwd là kho khác | làn ở K1 ghim hồ sơ K2, đọc hồ sơ thay của K1, ghi pin xanh | hàng E5 cho làn, băm trước/sau | fixed: AC-5/E5 thêm làn `--root` K2 với cwd K1; design: làn chỉ dùng `--root` giải tuyệt đối |
