# Biên bản hai vòng sửa — tính năng đang chạy

> Tệp này do `_acceptance/stop-patching-law/make-record.mjs` sinh từ hồ sơ
> thật (`_acceptance/card-text-fidelity/evidence-report.md`). Không viết tay.

## Vòng 1 — kết quả: TRẢ LẠI

11/11 eval máy xanh (exit 0) VÀ 6 suite regression-guard khác xanh, nhưng review phát hiện 2 hình dạng đường-dẫn-chứa-sao thật trên thẻ vẫn bị cụt (AC-6 đỏ trên dữ liệu sống dù E6/E7/E9 báo xanh), cộng 3 chân đo (E9, E10, E11) đo chỉ-dẫn hoặc chuỗi-có-mặt thay vì quan hệ mà AC hứa. REJECT — quay lại implementation để gắn thước đúng vào vật trước khi verify lại.

**Lớp lỗi ghi nhận:** đo chỉ-dẫn / chuỗi-có-mặt thay vì quan hệ mà tiêu chí hứa.

## Vòng 2 — bản sửa theo vòng 1; kết quả: TRẢ LẠI

đổi lời giải sang che nội dung trong nháy ngược trước khi lột + guard cả hai phía mở/đóng của dấu nhấn mạnh, và thêm E12/AC-13 (bảng phải phủ corpus, rút từ dữ liệu thật thay vì tự nghĩ) như chân mới đóng nguyên nhân gốc vòng trước. 12/12 eval máy xanh (exit 0) + 6 suite regression-guard khác xanh, nhưng scope-triage phát hiện E12 dùng ngưỡng dung sai `<= 25` thay vì quan hệ đỏ-khi-có-cụm-mồ-côi (18 loại mồ côi đo được hiện tại vẫn xanh, không có đối chứng dương chứng minh khối này biết đỏ) và ma trận chỉ ràng 11/19 hình dạng khai trong marker; cộng lớp "đo tổng-gộp/chỉ-dẫn/chuỗi-có-mặt thay vì quan hệ toàn phần" từ vòng trước vẫn còn nguyên ở E6 (AC-6), E9 (AC-9), E10 (AC-10), E11 (AC-11). REJECT — quay lại implementation, sửa theo LỚP chứ không theo từng finding.

**Lớp lỗi ghi nhận:** hạ-thước (ngưỡng dung sai thay cho quan hệ) và đo
chuỗi-có-mặt thay vì quan hệ — lớp thứ hai CHÍNH LÀ lớp đã ghi ở vòng 1, sau
bản sửa vẫn còn.

## Trạng thái hiện tại

Bản sửa vòng 2 đã xong, kết quả vừa về. Chưa dispatch vòng nào tiếp.
