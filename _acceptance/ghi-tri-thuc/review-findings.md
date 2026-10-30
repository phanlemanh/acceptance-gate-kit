## Trong hợp đồng

Không có phát hiện nào ánh xạ được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Remote GitHub có userinfo hay host alias SSH bị coi là «không phải GitHub», nên lệnh ghi vẫn chạy và bỏ qua quyết định Hỏi-1 «không kiểm được thì chặn»**
  Người dùng thấy gì: Nếu địa chỉ kho riêng viết theo kiểu có tên người dùng hoặc tên rút gọn cho nhiều tài khoản, hệ thống tưởng không phải GitHub nên không kiểm được kho đó công khai hay riêng tư. Nó chỉ cảnh báo rồi vẫn ghi nguồn thô, nên nguồn nhạy cảm có thể nằm ở một kho công khai mà không bị chặn.
  Căn cứ: Hậu quả có thể nặng vì lộ nguồn nhạy cảm ra kho công khai và đã đẩy lên thì khó rút lại; tuy vậy cách viết địa chỉ này khá hiếm và việc sửa sau là rẻ, nên đáng làm thành một việc riêng có kiểm thử chứ không nhét vào bản này.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Bốn ca mutant kết luận «đã bắt lỗi» chỉ từ việc mã thoát KHÁC giá trị cũ, không ghim mã hay thông điệp mong đợi (đúng lớp âm-tính-một-mình mà CLAUDE.md cấm)**
  Người dùng thấy gì: Một vài bài thử tự kiểm có thể báo «đã bắt được lỗi» trong khi thực ra bản thử hỏng vì lý do khác. Người dùng cuối không thấy gì, nhưng độ tin cậy của bộ thử ở bốn chỗ này yếu hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng dữ liệu hay hành vi người dùng, chỉ làm bộ thử đáng tin kém hơn ở bốn chỗ; có thể khai là giới hạn đã biết và vá dần khi quay lại sửa bộ thử.
  file: `tests/scripts/ghi-tri-thuc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **/tri-thuc:ghi dặn giải $AG «như /tri-thuc:kiem», tức đi kèm --require scripts/tri-thuc.mjs, không đòi chính tệp bên ghi**
  Người dùng thấy gì: Nếu máy đang có một bản kit cũ chưa có lệnh ghi, lệnh ghi sẽ báo lỗi chung chung thay vì chỉ cho người dùng cách cài bản mới. Chỉ gặp khi chưa cập nhật kit.
  Căn cứ: Hậu quả nhẹ: người dùng chỉ thấy một thông báo khó hiểu, không mất dữ liệu, cập nhật kit rồi chạy lại là xong.
  file: `tri-thuc/commands/ghi.md`
  severity: low
  Đề xuất: known-limits

- **Dùng lại raw không kiểm nguon.md có thật không: lần ghi trước bị ngắt giữa chừng thì lần sau thoát 0, commit, mà lint TT1 đỏ**
  Người dùng thấy gì: Nếu phiên bị ngắt đúng lúc đang ghi nguồn thô, lần chạy lại sẽ báo thành công nhưng thư mục nguồn vẫn thiếu tệp mô tả, và bước kiểm tri thức sau đó báo đỏ.
  Căn cứ: Hiếm gặp (cần đúng lúc ngắt), không mất nguồn gốc vì tệp thô vẫn còn, nhưng người dùng khó tự sửa vì nguồn thô là bất biến; nên ghi thành giới hạn đã biết.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **TRI-THUC.md lấy tên kho từ basename của root, nên chạy trong worktree thì tên kho thành tên worktree**
  Người dùng thấy gì: Khi làm việc trong thư mục làm việc tạm của một vòng, tiêu đề tệp tri thức đầu tiên mang tên của vòng chứ không phải tên kho thật.
  Căn cứ: Chỉ sai một dòng tiêu đề, không mất dữ liệu và người dùng sửa tay được trong vài giây.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **Trang đã có mà thiếu khoá nguon, ma hay cap_nhat: lệnh lặng lẽ không ghi các khoá ấy vẫn thoát 0**
  Người dùng thấy gì: Nếu một trang tri thức được viết tay mà thiếu một số mục đầu trang, lệnh báo đã ghi xong nhưng thực ra không nối nguồn mới vào trang và bỏ các mã đã nhập. Người dùng tưởng đã lưu, tới khi kiểm tri thức mới thấy đỏ.
  Căn cứ: Mất thông tin lặng lẽ và báo thành công sai, nên gây hiểu lầm; tuy nhiên chỉ xảy ra với trang viết tay thiếu khuôn và người dùng có thể thêm lại, nên nên xử lý trong một việc riêng.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lỗi ở pha ghi đĩa để lại raw dở dang mà vẫn thoát 2, phá lời hứa «mã khác 0: không tệp nào đổi»**
  Người dùng thấy gì: Khi đường dẫn trang va vào một tệp đã có sẵn cùng tên, lệnh báo lỗi nhưng để lại một phần nguồn thô đã chép trong thư mục, người dùng phải tự dọn.
  Căn cứ: Hậu quả nhẹ và hiếm: chỉ để lại tệp thừa chưa được commit, người dùng xoá đi hoặc chạy lại được, không ảnh hưởng dữ liệu đã có.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **Dựng dòng tệp của nguon.md bằng String.replace với chuỗi thay thế, nên tên tệp chứa `$&`, `$'` hay `$`` làm hỏng dòng**
  Người dùng thấy gì: Nếu tên một tệp nguồn có ký hiệu đô-la đặc biệt, dòng mô tả tệp ấy bị ghi sai và bước kiểm tri thức sau này báo đỏ; vì nguồn thô bất biến nên không sửa lại được.
  Căn cứ: Tên tệp kiểu này rất hiếm, người dùng tránh được bằng cách đổi tên tệp trước khi ghi; nên ghi thành giới hạn đã biết.
  file: `scripts/tri-thuc-ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: assert «chuỗi có mặt» trong khi lời hứa là giá trị đúng <chủ>/<kho> tách từ remote**
  Người dùng thấy gì: Bài thử hiện chưa phân biệt được việc tên kho gửi đi đúng hay thừa đuôi «.git», nên nếu sau này có lỗi cắt tên, kiểm tra riêng tư có thể hỏi nhầm kho mà bài thử vẫn xanh.
  Căn cứ: Hiện mã chạy đúng nên người dùng chưa chịu hậu quả nào, chỉ là bộ thử chưa bắt được lỗi này nếu nó xuất hiện; khai là giới hạn đã biết và siết khi sửa bộ thử.
  file: `tests/scripts/ghi-tri-thuc.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
