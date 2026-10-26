# Bản phạm vi — tinh chỉnh sau đợt thử thứ hai (onehub-invest `dieu-phoi-dot0-cam-mau`, 26/10)

Chủ kho gọi tên 26/10: cắt hàng vào mốc «Tinh chỉnh sau hai đợt thử» (05/11) cho các lỗi kit đã đủ ngưỡng; gói
`dieu-phoi` trước (đánh thức, khoá s4, `hang them`, `hang chay-lai`), rồi tệp sinh xung đột; mở vòng feature-loop đầu
tiên. Mã `B1`–`B3` thêm 26/10 sau Cổng Bằng chứng TC1 (hạt giống `docs/plans/2026-10-26-hat-giong-tc1b-sau-danh-thuc.md`). Nguồn từng mã — gốc trong mã, tái hiện, cách né, đề xuất kèm chiều đỏ — là hạt giống dưới; số `M<n>` trùng số mục
của hạt giống. Mục 10 của hạt giống (ghi chú nhận ghi sai bản) đã sửa ở PR mang hạt giống nên không có mã ở đây. Mục 5
tách hai: nửa `chay-lai` là TRỪ (chiều ngược của lệnh `nghi` đã có), nửa `uu-tien` là CỘNG và chờ chủ kho phê.

Dáng `lan-va`: các lỗi rời của một đợt thử, hàng chạy song song, không `dung_tren` giữa chúng.

<!-- <<<PHAM-VI-MA -->
```
dot: tinh-chinh-2610
dang: lan-va
nguon: docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md

- `M1` — tệp sinh PRODUCT-MAP.md và LO-TRINH.html không làm dừng lần gộp nhánh chính vào nhánh PR; bản vẽ sai sau gộp vẫn bị --check bắt
- `M2` — đánh thức và chẩn đoán đọc nhịp sống của giám sát đúng mã phiên mà hook ghi; phiên mở trước khi nạp gói được nói ra đúng tên
- `M3` — đơn xin s4 không cờ mang slug của hàng đang chấm, không phải hàng kế của bộ phát lịch
- `M4` — chân cong_cu của đường nền xét tệp kịch bản có tồn tại, không xét quyền chạy
- `M5a` — lệnh chay-lai cho một dãy đã nghỉ chạy lại, cùng khuôn với lệnh nghi
- `M5b` — lệnh đặt uu_tien tuyệt đối cho một hàng của đợt
- `M6` — hang them nhận mã hay slug của lộ trình: hàng thêm mang đúng slug và mã, slug dài không bị cắt
- `M7` — kiem-ban-cai tách lệch chỉ-tệp-không-chạy sau thẻ khỏi lệch mã, và chỉ lệnh fetch thẻ khi bản clone thiếu thẻ
- `M8` — kiem-ban-cai in lối sửa chạy được cho bản ghi cây phụ lệch số, tách bản ghi mồ côi
- `M9` — hook chan-s4 không chặn heredoc mà thân chỉ là dữ liệu
- `B1` — lệnh vai --giam-sat trao vai không gắn mã CLI của phiên trao vào giám sát mới (Cổng Bằng chứng TC1, Ngoài-5/8)
- `B2` — lời dặn chẩn đoán lại của tiep-tuc khớp hành vi chẩn đoán khi nhận mã CLI (Cổng Bằng chứng TC1, Ngoài-1)
- `B3` — hai phép đo TC1-06 và TC1-09 không đỏ giả cho vòng sau khi TC1 đã gộp (Cổng Bằng chứng TC1, Ngoài-6/7)
```
<!-- PHAM-VI-MA>>> -->
