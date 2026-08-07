HÀNH ĐỘNG: Dừng lại, KHÔNG tự dispatch vòng sửa thứ ba. Vòng 2 sinh lỗi cùng lớp ("đo chuỗi-có-mặt thay vì quan hệ") với lớp đã ghi ở vòng 1 ⇒ khuôn giải sai. Tôi trình cho người ba đường để chọn tường minh: (1) đổi khuôn — thay lời giải hiện tại (che-nháy-ngược + guard hai phía + ngưỡng dung sai) bằng khuôn khác, đo bằng quan hệ toàn phần thay vì tổng-gộp/chuỗi-có-mặt; (2) thu phạm vi — rút bớt AC/hình dạng phải phủ (hiện ma trận chỉ ràng 11/19 hình dạng khai trong marker) xuống phần khuôn hiện tại thật sự đóng được; (3) ship với giới hạn đã biết — ghi Known limits cho AC-6/AC-9/AC-10/AC-11 và E12, ship như hiện tại. Vá tiếp chỉ đi khi người chọn nó tường minh.

CĂN CỨ (nguyên văn từ file 2, khối STOP-PATCHING-CLAUSE trong S4 §3 routing REJECT):

> **Trước khi dispatch vòng kế: so lớp lỗi vòng này với vòng trước.** Vòng
> sửa thứ HAI vẫn sinh lỗi CÙNG LỚP với vòng một ⇒ **khuôn giải sai**, không
> phải chi tiết sai. DỪNG — KHÔNG tự dispatch vòng ba. Trình người ba đường:
> **đổi khuôn** · **thu phạm vi** · **ship với giới hạn đã biết**; vá tiếp là
> đường người phải chọn tường minh, không phải mặc định. "Cùng lớp" = cùng
> TÊN LỚP LỖI trong sổ lớp lỗi (đo-chuỗi-thay-quan-hệ, hạ-thước, fail-open,
> đếm-rồi-vứt, hằng-đúng, assertion-âm-tính-một-mình…), KHÔNG phải cùng dòng
> mã hay cùng phép đo — hai lỗi ở hai file khác nhau vẫn là cùng lớp nếu
> cùng tên, và hai lỗi trên cùng một dòng vẫn là khác lớp nếu khác tên.
