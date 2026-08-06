# card-text-fidelity — thẻ quyết định in đúng thứ hồ sơ viết

**Ngày:** 2026-08-05 · **Slug:** `card-text-fidelity` · **Tier:** T2 ·
**Nguồn:** chip tồn từ vòng judge-required-evidence — feature tiêu thụ #2 pha Đo.

## Vấn đề (đã tái hiện trên thẻ thật)

Thẻ quyết định lột định dạng markdown trước khi in cho người. Hàm lột hiện tại
coi MỌI cặp `**` là chữ đậm, nên đường dẫn đệ quy (`plugins/**`, `lib/**`) bị
cụt mất hai dấu sao. Thẻ Cổng 1 của `t1-escape-event-scope` đang in cả
`plugins/` lẫn `plugins/**` trong cùng một trang — người đọc không biết đâu là
thư mục, đâu là "và mọi thứ bên dưới".

Hai tầng gốc rễ:

1. **Không tôn trọng đoạn mã.** Backtick bị lột TRƯỚC, nên nội dung trong
   `` `tests/plugins/**` `` mất lớp bảo vệ rồi mới bị lột tiếp.
2. **Không dùng ràng buộc mở/đóng.** CommonMark quy định `**` chỉ mở khi ngay
   sau nó là ký tự không-trắng, và chỉ đóng khi ngay trước nó là ký tự
   không-trắng. `docs/** · plugins/**` không thoả — nên lẽ ra không được coi là
   chữ đậm. Hệ quả hiện tại phụ thuộc số glob trên dòng (chẵn/lẻ).

## Approach đã chọn (A) — ràng buộc mở/đóng theo CommonMark

Sửa đúng hai biểu thức trong hàm lột: thêm điều kiện ký tự-không-trắng ở hai
đầu và cấm dính sao thứ ba. Bất biến ngữ nghĩa mượn từ chuẩn có sẵn, không phải
danh sách trường hợp cần vá — đúng bài học "vá blacklist trên không gian mở".

Loại: (B) chỉ bỏ qua khi thấy dấu `/` trước `**` — vá riêng cho glob, thủng
ngay với `**/*.ts`; (C) dùng thư viện markdown — kéo phụ thuộc ngoài vào một
script phải chạy được ở repo tiêu thụ.

## Phép đo

- **Ma trận toàn phần viết trước**: 8 ca (glob-trong-mã · glob-trần ·
  đậm-thật · nghiêng-thật · đậm+glob cùng dòng · nhiều glob một dòng ·
  `**/*.ts` · sao trong đoạn mã), mỗi ca một ô, số ô = số hàng bảng ca.
- **Đối chứng dương bắt buộc**: chạy cùng ma trận qua bản CŨ lấy bằng
  `git show <base>` — bản cũ PHẢI đỏ ở đúng các ca glob, xanh ở các ca đậm
  thật. Không có chân này thì không phân biệt được "sửa đúng" với "test chưa
  bao giờ chạy".
- **Đo trên vật được giao**: quét thẻ THẬT sinh từ hồ sơ thật — mọi đường dẫn
  dạng `x/**` có trong nguồn phải xuất hiện nguyên vẹn trong thẻ; đối chứng:
  ngược lại thẻ không được chứa `x/` cụt mà nguồn không có.

## Out of scope

- Viết trình bày markdown đầy đủ (bảng, danh sách lồng, trích dẫn).
- Đổi cách các trang khác (trang bằng chứng, bản đồ sản phẩm) trình bày.
- Chuẩn hoá cách hồ sơ viết đường dẫn.
