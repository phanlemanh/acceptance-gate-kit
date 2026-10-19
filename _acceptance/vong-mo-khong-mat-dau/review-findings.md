# Review findings: vong-mo-khong-mat-dau (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E7 now names phat-lich.mjs as the measured component in row (c), but its paths list does not include it, so the check can carry a stale green**
  Người dùng thấy gì: Nếu sau này có người sửa phần bộ canh phát lịch mà không đụng gì khác, phép kiểm việc đáp yêu cầu cũ có thể không chạy lại và vẫn hiện xanh theo kết quả cũ. Hôm nay đáp yêu cầu cũ vẫn chạy đúng; rủi ro chỉ ở các vòng sửa sau.
  Căn cứ: Hậu quả nhẹ và chỉ xảy ra ở vòng sửa tương lai, không làm mất dữ liệu hay sai việc của người dùng hôm nay; ghi lại giới hạn là đủ, sửa sau vẫn rẻ.
  file: `_acceptance/vong-mo-khong-mat-dau/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **E10's new positive control (minutes = 45 must succeed and read back from the ledger) runs code that is missing from E10's paths**
  Người dùng thấy gì: Nếu sau này có người sửa phần đọc sổ hoặc phần giao việc mà không đụng gì khác, phép kiểm hạn gõ đúng có thể không chạy lại và vẫn hiện xanh theo kết quả cũ. Hôm nay hạn đúng vẫn được nhận và đọc lại chính xác.
  Căn cứ: Hậu quả nhẹ, chỉ làm một phép kiểm có thể không chạy lại ở vòng sửa sau, không ảnh hưởng người dùng hôm nay; ghi giới hạn đã biết rồi sửa ở vòng sau với chi phí thấp.
  file: `_acceptance/vong-mo-khong-mat-dau/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Phép đo E10 giờ chạy thật đường XONG/TRẢ kiểu cũ, nhưng danh sách tệp kích hoạt chạy lại của nó không mở rộng theo (r2 · tệp đã đổi)**
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

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/vong-mo-khong-mat-dau/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
