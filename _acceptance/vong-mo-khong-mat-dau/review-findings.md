## Trong hợp đồng

- **GD-10 hàng lệnh hạn chỉ chạy nhánh từ chối, nên lệnh mẫu hỏng mà thiếu người nhận hay thiếu câu vẫn xanh**
  file: `tests/dieu-phoi/tin-khong-mat-dau.test.mjs:637`
  severity: medium
  AC: AC-10
  source: bugs
  detail: kiemLuatGd chạy nguyên văn từng lệnh mẫu `tin GIAO|HỎI …` của dòng hạn, nhưng chỉ với <phút> = 1.5, rồi đòi thoát 1 kèm đúng câu của AC-5. Trong tin.mjs, phutNguyenDuong(co,'han'/'han-xong') chạy ở dòng 305-306, TRƯỚC mọi bước kiểm người nhận và câu của GIAO/HỎI. Vì vậy mọi lệnh mẫu còn giữ được cờ hạn đều tạo ra đúng câu từ chối, dù phần còn lại của lệnh không chạy được. Hàng này chỉ có kiểm âm, không có đối chứng dương: chưa lần nào chạy lệnh mẫu với một số phút hợp lệ để xem nó thoát 0 và ghi được lời giao. Tôi đã tạo mutant và chạy qua kiemLuatGd trên bản sao: (1) đổi lệnh mẫu GIAO thành `tin GIAO --han-xong <phút>` (bỏ dãy và câu) thì loi = []; (2) đổi lệnh mẫu HỎI thành `tin HỎI --han <phút>` thì loi = []. Cả hai đều xanh. Như vậy lời hứa của AC-10/E10, «lệnh mẫu trong luật chạy được», chưa được đo cho dòng hạn. Mutant han-mau-hong có đỏ, nhưng chỉ vì nó phá đúng chỗ cờ hạn. Cách sửa: chạy thêm mỗi lệnh mẫu với <phút> hợp lệ (ví dụ 5), đòi thoát 0 và có lời giao hoặc câu hỏi trong sổ, rồi mới tin kết quả đỏ ở 1.5.
  rationale: AC-10 đòi ca đo rút câu lệnh mẫu của dòng luật rồi chạy nó trên kho thử; ca đo hạn chỉ chạy nhánh từ chối nên lệnh mẫu hỏng vẫn xanh, tức lời hứa «lệnh mẫu chạy được» chưa được đo.

- **trongKhe so sánh mốc bằng dấu < nghiêm ngặt theo mili giây, nên GD-01/02/03 đỏ ngẫu nhiên khi hai mốc trùng nhau**
  file: `tests/dieu-phoi/tin-khong-mat-dau.test.mjs:68`
  severity: medium
  AC: AC-1
  source: bugs
  detail: `const trongKhe = (m) => m.batDau < m.truoc && m.sau < m.traVe;`. batDau là Date.now() mà gh-gia.mjs (dòng 84) ghi vào moc-doc-bat-dau. truoc là Date.now() lấy ngay sau khi choTep thấy tệp đó. Hai giá trị này có thể trùng một mili giây, trong khi thứ tự vẫn đúng (tệp được ghi trước khi bên đo đọc). Lần chạy đầy đủ của tôi trên HEAD bf862fe0 cho đúng ca này: `✖ GD-01 dau-may-song-qua-dong-bo … '(a) đã đến sống qua đồng bộ: mong canh 0 · trong khe · nấc 2 da-den, nhận canh 0 · bắt đầu đọc 1792423805536 < ghi 1792423805536…'`, tức tests 28, fail 1. Lần GD-01 khác trong cùng lượt chạy thì xanh. Bộ kiểm vì thế đỏ hay xanh tuỳ đồng hồ chứ không tuỳ mã đang đo, và một lượt chấm S4 có thể bị đốt vì hạ tầng đo. GD-02 (dòng 151) và GD-03 (dòng 271) dùng cùng trongKhe nên cũng dính. Cách sửa: dùng `<=` cho batDau ≤ truoc, vì quan hệ nhân quả đã có sẵn nhờ choTep. Hoặc lấy truoc trước khi bắt đầu chờ tệp thì đổi hướng so sánh, không phụ thuộc độ phân giải đồng hồ.
  rationale: Hàng (a) của ma trận AC-1 đỏ ngẫu nhiên trên mã lành vì phép so mốc theo mili giây; AC-1 đòi mỗi hàng chứng mốc bắt đầu đọc đứng trước mốc ghi dấu, và phép đo hiện đỏ sai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phép đo E10 giờ chạy thật đường XONG/TRẢ kiểu cũ, nhưng danh sách tệp kích hoạt chạy lại của nó không mở rộng theo**
  Người dùng thấy gì: Nếu sau này ai sửa phần ghi câu trả lời hoặc phần dựng kho thử, phép kiểm về lệnh đáp yêu cầu kiểu cũ có thể không chạy lại mà mang kết quả xanh cũ sang. Hôm nay hành vi vẫn đúng, chỉ là về sau có thể một lỗi mới lọt qua mà không ai thấy.
  Căn cứ: Không ảnh hưởng người dùng ở bản này, chỉ làm lưới bắt lỗi về sau thưa đi; thêm ba đường dẫn là rẻ và làm lúc nào cũng được.
  file: `_acceptance/vong-mo-khong-mat-dau/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Bộ kiểm hạn nhận cả số phút quá lớn mà bên đọc không xử lý được: NHẬN văng RangeError, số rất lớn bị đọc lại thành mặc định (r1)**
  Người dùng thấy gì: Nếu ai đó gõ một hạn lớn bất thường (hàng trăm tỷ phút), lệnh vẫn báo thành công nhưng người nhận sau đó không nhận được vòng, hoặc hạn bị đọc thành 30 phút mặc định.
  Căn cứ: Chỉ xảy ra khi gõ số phi thực tế nên hiếm với người dùng thật, vòng không mất dữ liệu và người giao có thể giao lại với hạn hợp lý.
  file: `dieu-phoi/scripts/tin.mjs`
  severity: low
  Đề xuất: known-limits

- **A half-written line in the marker log also wipes out the next valid marker, and the loss is never reported (r1)**
  Người dùng thấy gì: Nếu máy tắt đúng lúc đang ghi dấu «đã đến» hay «chấp nhận», dấu ghi ngay sau đó cũng mất và không có cảnh báo nào, nên vòng có thể kẹt ở «chờ chấp nhận» mà người dùng không biết vì sao.
  Căn cứ: Cần máy chết đúng giữa lúc ghi nên hiếm, nhưng khi xảy ra thì mất dấu im lặng và đúng loại kẹt mà vòng này muốn chặn; sửa sau rẻ (thêm một kiểm tra trước khi ghi).
  file: `dieu-phoi/scripts/tin-noi-chua.mjs`
  severity: medium
  Đề xuất: known-limits

- **E7 (c) says it runs a real `dieu-phoi.mjs chay` tick, but the test calls taoVong with fake I/O (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hồ sơ nghiệm thu nói đã chạy một nhịp thật của bộ phát lịch, nhưng thực tế bài đo chạy bản giả lập; người đọc hồ sơ có thể tin đã đo chặt hơn sự thật.
  Căn cứ: Không ảnh hưởng trực tiếp người dùng cuối, chỉ làm hồ sơ nói quá mức đã đo; chỉ cần ghi rõ đây là giới hạn của phép đo.
  file: `_acceptance/vong-mo-khong-mat-dau/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (injection not proven to apply): GD-03 appends the half-written line without checking that the marks file exists (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài đo cho việc đọc bỏ qua dòng dấu ghi dở có thể xanh mà thực ra chưa hề tiêm dòng hỏng, nên khả năng chịu dòng ghi dở chưa được chứng thật.
  Căn cứ: Chỉ là độ tin của một bài đo phụ ngoài lời hứa chính, không làm người dùng mất gì; nếu thiếu chứng thì ghi là giới hạn chưa chứng.
  file: `tests/dieu-phoi/tin-khong-mat-dau.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
