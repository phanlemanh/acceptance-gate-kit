# Thiết kế: Tier B đọc được kết quả không đo được

Hồ sơ: `_acceptance/tier-b-doc-khong-do-duoc/`. Nguồn: mục Ngoài-6 của hồ sơ `do-tuong-phan-lab-oklab`, người ký chọn «mở hợp
đồng mới» ở Cổng Bằng chứng 10/11/2026.

## Vấn đề

PR 489 cho bộ quét trong trình duyệt thêm kết quả thứ tư `KHONG-DO-DUOC`, với `exit_intent` 0, hoặc 5 khi người gọi đòi đo đủ.
Quy trình Tier B ở `skills/acceptance/references/design-ui-check.md` vẫn chỉ biết ba kết quả. Bước đọc nói «Three shapes», bước
ghi quy mọi kết quả không phải BLOCKED về PASS hoặc REJECT, và bảng mã chỉ có 0 và 2. Tác tử đọc đúng theo tài liệu không có lối
ghi đúng, và `exit_intent: 0` đọc theo nghĩa cũ là đạt.

## Cách làm

**Một bảng đọc thay cho văn xuôi ở bước 5.** Bảng nằm giữa cặp marker `TIER-B-DOC-KET-QUA`, mỗi hàng là một cặp (kết quả, mã) bộ
quét phát ra và một cách ghi:

| Bộ quét | Mã | Ghi kết quả | Ghi mã |
|---|---|---|---|
| PASS | 0 | PASS | 0 |
| REJECT | 2 | REJECT | 2 |
| BLOCKED | 1 | BLOCKED | — |
| KHONG-DO-DUOC | 0 | BLOCKED | — |
| KHONG-DO-DUOC | 5 | BLOCKED | 5 |

Bảng dùng được cho máy nên không có bản chép thứ hai của luật.

**Không đo được ghi là BLOCKED, ở cả hai mã.** Cổng bằng chứng chỉ có bốn kết quả cấp báo cáo. Đạt là điều người ký đã chỉ ra là
sai. Từ chối bị loại bởi quyết định `d-20261109T222734Z-8` của hồ sơ trước. `PENDING-JUDGMENT` chỉ dành cho hạng mục phán đoán
của người. BLOCKED là lối duy nhất còn lại và đúng nghĩa: bộ kiểm đã không đo xong được.

**Mã 0 không ghi cạnh BLOCKED.** Khi không đòi đo đủ, bộ quét trả mã 0, nhưng dòng `exit_code: 0` trong báo cáo là dấu hiệu của
đạt. Cột mã để trống ở hàng đó, chỉ mã 5 được chép.

**Công thức luôn đòi đo đủ.** Cả hai lời gọi trong công thức truyền `requireMeasured: true`, nên trang chưa đo được trả mã 5, không
trả mã 0. Hàng mã 0 vẫn ở bảng cho người gọi không qua công thức.

**Kênh của tác tử chấm.** Kết quả của tác tử chấm giao diện chỉ có mã thoát và cờ không chạy được, và luồng chấm tính cờ tắt kèm mã 0
là đạt. Mọi hàng ghi BLOCKED đặt cờ không chạy được kèm lý do, và trường mã không được là 0: chép mã khác 0 của bộ quét, mã 0 thì đặt 1.

## Phép kiểm máy

`tests/design-eval/tier-b-loi-doc.test.mjs` chạy bộ quét thật trong jsdom trên ma trận viết trước (đạt, từ chối, trang trộn, không
đo được, thiếu bộ dò × hai chế độ, 10 ô), rút tập cặp thật rồi so hai chiều với bảng đọc. Tập kết quả hợp lệ rút từ khuôn báo cáo
bằng chứng, còn tập kết quả và mã khai trong nguồn bộ quét được đối chiếu với ma trận để nhánh mới ngoài ma trận không lọt. Hai lời gọi
trong công thức được rút từ tài liệu và chạy thật. Báo cáo dựng từ từng hàng đi qua bộ kiểm của cổng bằng chứng thật. Mười bốn nhát phá
trên bản sao trong bộ nhớ chứng phép đo đỏ với thông điệp ghim.

## Phương án đã loại

- Ghi REJECT khi có mã 5: trang không có lỗi đo được, từ chối sẽ gửi người sửa một lỗi không tồn tại.
- Chỉ sửa văn xuôi, không bảng: lần sau bộ quét thêm kết quả, tài liệu lại lệch mà không ai biết. Đây chính là lỗi Ngoài-6.
- Giữ lời gọi mặc định trong công thức Tier B: bộ quét sẽ trả mã 0 cho trang chưa đo được, đúng mã của đạt.

## Ngoài phạm vi

Mã của bộ quét, cổng bằng chứng và tầng script không đổi. Các mục Ngoài-n khác của hồ sơ trước đã có quyết định riêng.
