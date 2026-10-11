# Review findings: ngoai-n-tu-dinh-tuyen (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Luật signoff mới chặn lối kéo-lại khi người dán câu gộp của chính thẻ làn V**
  Người dùng thấy gì: Trên hồ sơ mà máy đã đi trước, nếu người dán nguyên dòng lệnh thẻ in sẵn thì bị đưa sang đường ký thường thay vì đi tiếp, và nếu sửa thành «kéo lại» rồi dán cả dòng thì nút dừng của làn nhanh không chạy. Người cần dán dòng ngắn tay hoặc ký lại cho đúng đường.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: new-contract

- **NHAN_LUOT_RE là bản chép tay một phần khuôn OOC-TITLE-RE, nằm ngoài marker và ngoài ca DG2; NT12 dùng nhãn viết tay dù E12 khai «rút từ khuôn»**
  Người dùng thấy gì: Nếu sau này định dạng nhãn lượt của bước mang-sang đổi mà bản chép ở đây không đổi theo, các mục máy đã tự quyết sẽ bị báo lệch oan và quay lại hỏi người, mà không có kiểm tra nào đỏ để báo trước.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: known-limits

- **Máy tự ghi gạch known-limits vào Notes, trái định nghĩa của CONTEXT.md**
  Người dùng thấy gì: Một dòng «giới hạn đã biết» trong hồ sơ từ nay có thể do máy tự ghi chứ chưa chắc người đã đọc và chấp nhận, nên người đọc hồ sơ có thể hiểu nhầm là đã có người đồng ý.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Dòng máy cũ vẫn định tuyến một mục mà S4 nay đề xuất new-contract: khớp mục chỉ so tiêu đề, không so đề xuất**
  Người dùng thấy gì: Nếu một lượt chấm sau cùng tìm lại đúng lỗi cũ nhưng nay cho rằng nó cần làm thành một việc riêng, quyết định tự động trước đó vẫn đứng và người không được hỏi, nên một lỗi đáng lẽ do người phân xử bị bỏ qua êm.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: new-contract

- **--soat-lech im lặng báo 0 hồ sơ lệch khi --root sai hoặc thiếu _acceptance/**
  Người dùng thấy gì: Lệnh đếm số hồ sơ lệch để quyết định có mở việc sửa hay không sẽ báo «0 hồ sơ lệch» cả khi người gõ sai thư mục, nên một lần gọi sai trông y như kho sạch và có thể làm người bỏ qua vấn đề thật.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: new-contract

- **Fixture VIẾT TAY đúng khuôn bên đọc (hình dạng 2): NT12 tự gõ nhãn lượt thay vì rút từ bên viết nhanCarry hay khối OOC-TITLE-RE**
  Người dùng thấy gì: Bài kiểm tra dùng nhãn gõ tay nên nếu định dạng nhãn thật đổi, bài kiểm tra vẫn xanh trong khi người dùng bắt đầu thấy các mục bị báo lệch oan.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (hình dạng 3): NT7 html không ghép lệnh đảo với đúng mục**
  Người dùng thấy gì: Nếu thẻ in nhầm lệnh đảo của mục này sang mục khác thì bài kiểm tra không phát hiện, người đọc có thể bấm đảo nhầm mục.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): NT5 sau-a kết luận lưới cho qua chỉ từ việc VẮNG «VIOLATION [slug]»**
  Người dùng thấy gì: Nếu bước kiểm tra cuối cùng hỏng vì lý do khác thì bài kiểm tra vẫn báo xanh, nên người có thể tin rằng làn nhanh đã mở được trong khi thực ra công cụ kiểm tra đã chết.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đo mã nguồn thay vì đầu ra (hình dạng 1): NT12 mot-ham grep gate-card.js để chứng «thẻ dùng chung hàm so tiêu đề»**
  Người dùng thấy gì: Bài kiểm tra chỉ xem chữ trong mã chứ không chạy thật, nên thẻ có thể lặng lẽ dùng cách so tiêu đề khác bên ghi mà vẫn qua, làm người thấy cờ lệch không nhất quán giữa hai nơi.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
