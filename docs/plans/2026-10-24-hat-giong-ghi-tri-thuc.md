# Hạt giống — ghi-tri-thuc (TT2), chọn ở Cổng Bằng chứng 24/10/2026

Gốc: `_acceptance/ghi-tri-thuc/` (review-findings.md lượt chấm 1, sổ quyết định dòng gate2). Hai mục chủ kho chọn «mở hợp đồng mới»; hạt giống là sổ, chưa phải ô.

## Ngoài-1 — Remote GitHub có userinfo hay host alias SSH bị coi là «không phải GitHub», nên lệnh ghi vẫn chạy và bỏ qua quyết định Hỏi-1 «không kiểm được thì chặn»

- Tệp: `scripts/tri-thuc-ghi.mjs`
- Người dùng gặp gì: Nếu địa chỉ kho riêng viết theo kiểu có tên người dùng hoặc tên rút gọn cho nhiều tài khoản, hệ thống tưởng không phải GitHub nên không kiểm được kho đó công khai hay riêng tư. Nó chỉ cảnh báo rồi vẫn ghi nguồn thô, nên nguồn nhạy cảm có thể nằm ở một kho công khai mà không bị chặn.

## Ngoài-6 — Trang đã có mà thiếu khoá nguon, ma hay cap_nhat: lệnh lặng lẽ không ghi các khoá ấy vẫn thoát 0

- Tệp: `scripts/tri-thuc-ghi.mjs`
- Người dùng gặp gì: Nếu một trang tri thức được viết tay mà thiếu một số mục đầu trang, lệnh báo đã ghi xong nhưng thực ra không nối nguồn mới vào trang và bỏ các mã đã nhập. Người dùng tưởng đã lưu, tới khi kiểm tri thức mới thấy đỏ.
