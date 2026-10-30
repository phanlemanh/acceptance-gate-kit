# Hạt giống — hai chỗ còn lệch sau vòng ảnh-có-thật

Gốc: `acceptance-gate-kit/_acceptance/anh-co-that-trong-ho-so/` — Known limits Ngoài-4 và Ngoài-1/Ngoài-5 do chủ kho chọn ở
Cổng Bằng chứng 22/10 (lượt chấm 2, `review-findings.md`). Ô ghi hạt giống này: chính hồ sơ ấy (mục Notes trích lại tên tệp,
luật VC8).

## 1. Trang và thẻ nói ngược nhau ở một ca hiếm (Ngoài-4)

Người ký gặp gì: hồ sơ khai `screenshot:` bằng một đường bị loại (thư mục lượt chấm, đường tuyệt đối…) nhưng hồ sơ vẫn có ảnh
đúng tên theo mã eval (`evidence/<mã>-*.png`). Thẻ tính eval có ảnh và không cờ; trang hiện ảnh kèm cờ đỏ «thẻ không tính
eval này là có ảnh» — câu sai. Đọc mã: `scripts/evidence-page.js` in mọi mục `thieu` của `khungAnh`, còn thẻ chỉ gom
`thieu` khi không có khung nào. Nghiệm rẻ: trang chỉ in cờ khi khung rỗng, hoặc đổi câu cờ khi đã có ảnh; thêm một hàng ma
trận LNT7 «giá trị hỏng + ảnh theo mã».

## 2. Lệnh đo kho báo «khớp» khi không đo được gì (Ngoài-1, Ngoài-5)

Người chạy gặp gì: `tests/scripts/anh-co-that-kho.mjs` thoát 0 khi thẻ lỗi ở mọi hồ sơ, hoặc kho không có hồ sơ giao diện
nào — mọi số bằng 0 trông như khớp. Đúng lớp «assertion âm-tính-một-mình» của CLAUDE.md. Nghiệm rẻ: thoát 2 (mù) khi
`ho-so-ui` trừ `loi-doc` bằng 0, hoặc khi `loi-doc` > 0; thêm ca vào LNT10.

## Ngưỡng mở ô

Mục 1: ≥ 1 lần người ký báo thấy cờ «thẻ không tính» cạnh một ảnh đang hiện. Mục 2: lệnh đo kho được dùng lại cho một mốc
phát hành hay một kho thứ hai.
