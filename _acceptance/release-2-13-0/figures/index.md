# Kê điểm quyết định — release-2-13-0, Cổng Phạm vi

Máy kê từ artifact cuối S1, không hỏi người. Ngưỡng N5: cần hình khi một điểm đi qua ba
bước nối tiếp trở lên, hoặc rẽ từ hai nhánh trở lên.

| Điểm | Đếm | Hình |
|---|---|---|
| Giá trị số cắt (`2.13.0`) — điều chỉ người biết, AC-1 và AC-2 | một lựa chọn giá trị, 0 bước nối tiếp | dưới ngưỡng |
| Phạm vi mốc: cắt số + đúng một nhát vá | owner đã quyết trong phiên, 2 lối đã loại | dưới ngưỡng — quyết rồi, không còn là điểm mở |
| Phép vi phân AC-5 (clone → chép vật → khẳng định băm → đối chứng dương → rẽ tracked-ness) | 4 bước nối tiếp + 1 nhánh rẽ | **vượt ngưỡng** |
| Sàn số ca AC-3 | một phép so một phía | dưới ngưỡng |
| Năm dòng số AC-4 | liệt kê, không rẽ nhánh | dưới ngưỡng |

**Quyết: KHÔNG vẽ hình cho điểm vượt ngưỡng.** Lý do có tên: điểm ấy KHÔNG phải điều người
quyết ở cổng này — cơ chế của nó đã được owner soát trong phiên và đã sửa theo phản biện
context sạch; điều duy nhất còn chờ người là GIÁ TRỊ số cắt, vốn dưới ngưỡng. Vẽ một hình
cho một cơ chế không ai phải quyết là giờ-kit vứt đi, đúng điều luật hình-tại-điểm-quyết-định
nói khi nó dặn bỏ qua cả năm bước với làn đi tiếp. Nếu owner muốn soi cơ chế ấy, nó nằm ở
AC-5 của hợp đồng và ở phần chú thích đầu `rang-p93.sh`.
