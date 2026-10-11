# Kết quả phép đo DP0 — đổi tài khoản trong app desktop

Quy trình: [README.md](README.md). Quyết định chủ kho 11/10 (sổ `dieu-phoi-doi-tai-khoan`, dòng `by: manh`):
đo bằng MỘT lần đổi tài khoản CHỦ ĐỘNG trên máy M5 sau khi DP3 và DP7 gộp; đồng ý ba thử nghiệm h, i, l, mỗi
cái một chỗ, gỡ sau khi đo. Bộ đo: [thu/](thu/).

Trạng thái: **chưa đo** — chờ Điều phối chọn giờ. Bảng dưới là đầu vào của hàng DP4: ca `DP4-15` đối chiếu cột
«Giá trị» với mục «Nhánh DP0» của hợp đồng `_acceptance/dieu-phoi-doi-tai-khoan/contract.md`. Giá trị là một
trong `còn` · `mất` · `khác` · `chưa-đo`.

<!-- <<<KET-QUA-DP0 -->
| Câu | Câu hỏi (spec workflow §11) | Giá trị | Số đo / lý do |
|---|---|---|---|
| 1 | Sau khi đổi, phiên cũ, nhóm thanh bên, lịch 30′ còn hiện và còn chạy? | chưa-đo | chờ lần đổi chủ động |
| 2 | `rate_limits` của dòng trạng thái có trên app desktop và khớp `get_usage`? | chưa-đo | chờ cài thử nghiệm h |
| 3 | `StopFailure` bắn với `error: "rate_limit"` khi một lượt chết vì hạn mức? | chưa-đo | lần đổi chủ động không cạn hạn mức |
| 5 | Sau khi đổi, gói `dieu-phoi` và hook còn nạp trong phiên mới của kho? | chưa-đo | máy M5 chưa cài gói `dieu-phoi` cho kho nào |
| 6 | `$.session.usage().rateLimits` của mod có số trên app desktop và khớp `get_usage`? | chưa-đo | chờ cài thử nghiệm l |
<!-- KET-QUA-DP0>>> -->

## Câu 4 — không thuộc lần đổi

Phiên đang rảnh nhận tin liên phiên thì có bắt đầu lượt mới không? Hồ sơ DP3 khai đây là giới hạn (ngưỡng: đợt
thử crm ~26/10). Quan sát 11/10 trên M5, app desktop, CÙNG tài khoản, công cụ `send_message` của app (Điều phối M5
gom, thợ DP4 thêm một lần):

| Trạng thái phiên nhận | Kết quả công cụ | Phiên nhận làm gì | Lần quan sát |
|---|---|---|---|
| rảnh | «delivered; its turn has started on it» | bắt đầu lượt mới, trả lời tin | 4: «Đồng bộ OneHub từ GitHub» (hai tin), «Điều tra hạ tầng S4» (một tin), «Điều phối M5 đóng gói» (tin của thợ DP4, 02:19Z) |
| đang giữa lượt | «queued … runs it when that clears» | xử lý sau khi lượt đang chạy kết thúc, không chen giữa lượt | 2: phiên DP3, phiên DP7 |

Kết luận đo được: phiên rảnh → bắt đầu lượt ngay; phiên bận → xếp hàng tới hết lượt. Chưa đo: phiên rảnh dưới tài
khoản KHÁC (tin liên phiên chỉ trong cùng tài khoản — spec workflow §10), và phiên của app vừa khởi động lại.

## Số nền trước khi đổi (đọc 11/10 ~02:23Z qua `get_usage`)

Gói Max: cửa sổ 5 giờ 23 % (đặt lại 03:09:59Z) · tuần mọi model 12 % (đặt lại 12/10 23:59Z) · tuần Fable 0 %.
