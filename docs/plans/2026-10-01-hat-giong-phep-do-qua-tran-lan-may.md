# Hạt giống — phép đo dài hơn trần 600 s của làn máy không có đường chạy

**Ngày:** 2026-10-01 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: crm/_acceptance/soan-okr-cung-tro-ly/ — sổ `d-20261001T024848Z-16` (E22, bài soạn thật, chạy
~35 phút: khai `status: not-run` trong lượt chấm, đo một lần ngoài lượt theo lối «A sửa» chủ kho chốt).

Phát hiện trong vòng: `_acceptance/luot-cham-ghi-vao-cay/` (Out of scope của hợp đồng trích lại tệp này).

## Hình dạng

Làn máy của lượt chấm S4 chạy mỗi lệnh trong một tác tử, qua công cụ chạy lệnh có trần 600 s.
Lệnh dài hơn bị công cụ ngắt; luật TOOL-KILL-RULE đọc đó là `cannotRun` + `killedByTool`, nhãn
*không đọc được ở đây*, và lượt thành BLOCKED. Kit chưa có đường chạy nền cho một eval máy dài,
nên kho phải tự chọn giữa (a) khai `not-run` rồi đo ngoài lượt (bằng chứng không vào sổ chạy của
bộ chấm) và (b) cắt phép đo cho vừa trần (hạ thước cho vừa bàn đo).

## Ý (chưa phải cam kết)

Eval máy khai thời lượng dự kiến; bộ chấm đưa lệnh ấy vào một làn nền (tiến trình nền, đọc mã
thoát từ tệp) thay vì một tác tử ôm trọn lệnh. Cần cân trên mọi kho: làn nền ăn tài nguyên máy
chung (lời nhờ «giữ máy yên» giữa các phiên 01/10 là chi phí thật).

## Ngưỡng mở

≥2 hồ sơ ở ≥1 kho phải khai `not-run` chỉ vì trần thời gian (đếm: grep `not-run` trong
`evals.yaml` các kho, đọc lý do ở sổ quyết định cùng hồ sơ).
