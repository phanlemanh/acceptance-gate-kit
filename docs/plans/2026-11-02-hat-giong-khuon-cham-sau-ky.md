# Hạt giống — bước chấm khuôn còn hai chỗ nói sai cho người ký

Gốc: acceptance-gate-kit/_acceptance/khuon-loi/ — Cổng Bằng chứng 02/11 của vòng `khuon-loi` (hàng KH1, mốc 2.37.0): người
ký chọn «mở hợp đồng mới» cho Ngoài-13 và Ngoài-14 của `review-findings.md`; ô cơ hội của hồ sơ trích lại tên tệp này.
Ghi hạt giống, không mở ô (luật «ô chỉ mở khi có neo ngoài»).

## Người dùng gặp gì

- **Ngoài-13 — bản đồ hỏng mà thẻ in dòng Khuôn sạch.** Bước ghi số đo sau lượt chấm bỏ mất danh sách sai lược đồ: tệp bản
  đồ của kho hỏng cú pháp thì khuon-cham.json vẫn ghi số sạch, lệnh thoát 0, và thẻ Cổng Bằng chứng in «Khuôn: … 0 lệch
  mới» trong khi bản đồ thực ra không được đọc. Người ký đọc một dòng xanh không có thật.
- **Ngoài-14 — kiểm khe dừng ở dấu «>» đầu tiên trong thẻ.** Thẻ phần tử có thuộc tính viết hàm mũi tên
  (`onClick={() => …}`) bị cắt giữa chừng: khe khai sau mũi tên bị báo thiếu dù có (trả màn lại oan), và khe `children`
  có thể lọt khi thật sự thiếu.

## Hướng

- Ngoài-13: ghi `sai` vào khuon-cham.json và để thẻ in cờ đỏ «bản đồ sai lược đồ» thay dòng số; `--write` thoát 1 khi bản đồ
  sai, cùng mã với `--kiem`.
- Ngoài-14: đọc thuộc tính thẻ có cân ngoặc `{…}` thay vì dừng ở `>` đầu tiên; ca kiểm có hàm mũi tên trước và sau khe.

## Vì sao chưa làm

Hai mục nằm ngoài mười một tiêu chí đã duyệt ở Cổng Phạm vi 02/11; vòng khuon-loi đã dùng đủ ba lượt chấm. Hôm nay chưa kho
nào khai bản đồ khuôn trên bản phát hành, nên cả hai chỉ chạm người dùng khi một kho nhận cài 2.37.0 và chạy bước chấm.
Neo ngoài để mở ô: một kho nhận chạy bước chấm khuôn trên một vòng giao diện thật và gặp một trong hai ca.
