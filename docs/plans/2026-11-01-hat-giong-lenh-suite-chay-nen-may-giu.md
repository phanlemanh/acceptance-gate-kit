# Hạt giống — lệnh bộ kiểm chung chạy nền do máy giữ, không trông vào lời dặn người chấm

Gốc: acceptance-gate-kit/_acceptance/run-id-danh-sach-cho-phep/ — lượt chấm 2 BLOCKED vì bộ kiểm plugin vùng 2 chạy quá
trần 600 giây của công cụ; hồ sơ trích lại tên tệp này ở `## Notes`. Điều phối giao ghi hạt giống, không mở ô (01/11).

## Người dùng gặp gì

Lệnh eval khai `long_running` trong `evals.yaml` đã có đường chạy nền do máy giữ (chờ nền, bóc kết quả). Lệnh bộ kiểm
chung (`feature_loop.suite_keys`) thì không: chúng chỉ có luật chữ «bị đẩy nền thì chờ tới 30 phút» trong lời dặn tác tử.
Lượt 2 của vòng `run-id-danh-sach-cho-phep` (31/10) chứng luật chữ ấy không giữ: vùng 2 của bộ kiểm plugin hết 735 giây
dưới tải khoảng 11, công cụ đẩy nền, người chấm không chờ, tiến trình nền bị giết, lượt BLOCKED vì hạ tầng — một lượt
khoảng một giờ máy mất trắng, vật không đổi.

## Hướng

Đưa lệnh suite qua cùng đường máy giữ của `long_running`: bộ chấm phát lệnh nền có tệp kết quả, rồi chờ bằng vòng lặp
máy tới khi tệp có mã thoát hoặc hết trần khai — không phụ thuộc người chấm đọc lời dặn. Khoá bật theo lựa chọn ở
`config.yaml` (đổi mặc định là mọi kho trả giá). Ca đo: lệnh suite ngủ quá trần công cụ — bản mới ghi mã thoát thật,
bản cũ BLOCKED.

## Vì sao chưa làm

Là CỘNG chạm đường verdict — đổi thành phần đường chấm cần răng hai chiều và chủ kho gọi tên. Vòng sinh ra hạt giống này
sửa chính đường chấm nên giữ thành phần không đổi; ngưỡng mở ô: thêm một lượt BLOCKED vì lệnh suite vượt trần công cụ.
