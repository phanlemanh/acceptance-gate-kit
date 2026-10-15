# Hạt giống — bước khởi tạo lộ trình im lặng không làm gì

Gốc: `_acceptance/kho-moi-cai-goi-road-map/` — chủ kho chọn «mở hợp đồng mới» cho Ngoài-1 và Ngoài-6 ở Cổng Bằng
chứng 16/10 (sổ quyết định `stage: gate2`; Notes của hợp đồng trích tên tệp này). Hạt giống là SỔ, không phải ô
(luật «Ô chỉ mở khi có neo ngoài»): chỉ thành vòng khi có kho thật vấp hoặc chủ kho gọi tên.

## Hai điều

1. **Gọi qua đường dẫn tắt thì im lặng không làm gì** (Ngoài-1; trùng Ngoài-24, độ nặng cao). Khối chạy lệnh của
   `scripts/lo-trinh-khoi-tao.mjs` so `path.resolve(argv[1])` với đường thật của mô-đun. Khi gốc gói đi qua một
   symlink (`/tmp` trên macOS, gói cài từ thư mục liên kết), lệnh in 0 dòng và thoát 0. Bước 5d của
   `acceptance-init` đọc thoát 0 là «xong», nên kho đã bật road-map không có lộ trình mà không ai được báo. Sửa
   một dòng (`realpathSync` như `product-map.mjs`, ca P119) cộng một ca đo gọi qua symlink.
2. **Ca đo trên các kho thật vẫn xanh khi không đo kho nào** (Ngoài-6; trùng Ngoài-26/30). `kho-moi-cai-goi-road-map-cac-kho.mjs`
   đếm kho «không bật» mà không đòi ≥ 1, nên khi mọi kho dò được đã cài road-map thì KM-9 xanh trên tập rỗng
   (lớp `tap-so-rong`).

## Ngưỡng mở

≥ 1 kho thật báo «đã chạy khởi tạo mà không có lộ trình», hoặc chủ kho gọi tên. Ước: một vòng T2 nhỏ, 3–4 tiêu chí,
khoảng 2–3 giờ máy.
