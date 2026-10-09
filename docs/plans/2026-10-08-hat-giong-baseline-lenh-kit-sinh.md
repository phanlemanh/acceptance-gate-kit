# Hạt giống — làn đối chứng chạy lệnh kit sinh: ba lỗ còn lại sau vòng baseline-tran-bo-qua-don

Gốc: `_acceptance/baseline-tran-bo-qua-don/` (lượt chấm 1 ngày 08/10/2026, Cổng Bằng chứng ký 08/10). Hạt giống là SỔ, không phải
ô: chỉ mở thành ô khi có neo ngoài (một lượt chấm thật ở kho tiêu thụ vấp đúng lỗ).

## 1. Lệnh eval dạng `bash -c '…'` làm cả lệnh baseline bị kiểm tra an toàn từ chối (quan sát của chính lượt chấm)

Lệnh kit sinh chép NGUYÊN VĂN từng lệnh eval vào khối của nó. Kho kit khai eval dạng
`bash -c 'out=$(node <tệp ca> 2>&1); …'`, nên kiểm tra an toàn có sẵn của Claude Code coi cả lệnh là «script
`-c` có thể chứa `rm`, không phân tích được» và từ chối (lượt chấm 1: «Permission for this command was denied
by a built-in Claude Code safety check»). Ở phiên đó lệnh bị từ chối ngay và làn báo BLOCKED hạ tầng có tên,
nên lượt vẫn ra báo cáo. Nhưng ở phiên bypassPermissions trên app desktop, đúng hình dạng ấy sinh một hộp xin
quyền và nằm chờ: đó chính là sự cố crm 07/10. Eval của crm (`bun run test -- "…"`) đi qua kiểm tra này (đo
08/10), nên crm không vấp.

Hướng: JS phát hiện lệnh eval mang hình dạng bị hỏi (`\b(bash|sh|zsh) -c\b`, `\beval\b`, `\brm\b`) rồi đánh
`bo-qua` có lý do «hình dạng lệnh sẽ bị kiểm tra an toàn hỏi người». Lệnh đó không được chép vào khối.

Ngưỡng mở ô: ≥1 lượt S4 ở kho tiêu thụ có lane baseline chờ hộp xin quyền, hoặc bị từ chối, vì một lệnh eval
dạng `-c`.

## 2. Đầu ra có `__BL_XONG` nhưng rơi dòng của một lệnh vẫn được ghi là phép đo trọn (Ngoài-3, owner: mở hợp đồng mới)

Ở đường đọc dấu, lệnh vắng dòng `__BL <i> …` được gán `cannotRun` nhưng không gắn cờ `thieu`. Vì thế
`baselineTron` vẫn đúng và dòng `kind:"baseline"` vẫn được ghi; P2 mang phép đo thiếu sang các round sau, và
lệnh bị rơi không bao giờ được đo lại. Hướng: gắn `thieu: true` cho mục vắng dòng, thêm cặp ca dương/đỏ.

## 3. Bộ đọc dấu `__BL` chưa có ca round-trip từ đầu ra shell thật (Ngoài-5, owner: mở hợp đồng mới)

Các ca BB đưa `dauRa` viết tay đúng khuôn bên đọc. Các ca BT/BQ/BD chạy shell thật nhưng chỉ khớp regex trên
stdout, chưa nạp stdout đó qua `docBaseline` của workflow. Hướng: một ca chạy lệnh rút từ prompt bằng shell
thật, đưa stdout làm `dauRa` vào harness, rồi assert `nonDiscriminating` và lý do `n-a`.
