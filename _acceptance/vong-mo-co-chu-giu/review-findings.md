# Review findings: vong-mo-co-chu-giu (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Trường `kenh` (tên kênh tách từ tên tệp) trong cacMinh giờ là mã chết, còn ghi chú của đường đọc-cũ thì khai sai điều kiện**
  Người dùng thấy gì: Người dùng không thấy gì khác đi: tin vẫn đến đúng kênh và đúng phiên. Chỉ có một đoạn mã thừa và một dòng ghi chú nói sai, có thể làm người sửa mã sau này hiểu nhầm.
  Căn cứ: Không ảnh hưởng người dùng, không mất hay lộ dữ liệu, dọn lúc nào cũng được và rất rẻ nên không cần mở việc riêng.
  file: `dieu-phoi/scripts/tin-dua.mjs`
  severity: low
  Đề xuất: wont-fix

- **E8's expected text still says '12 hàng (a)…(l)' after row (m) was added**
  Người dùng thấy gì: Người dùng không bị ảnh hưởng. Chỉ là phần mô tả của một phép kiểm nội bộ còn ghi 12 hàng trong khi thực tế có 13, nên người đọc hồ sơ có thể đếm lệch.
  Căn cứ: Hậu quả nhẹ, chỉ lệch chữ trong hồ sơ kiểm; phép kiểm vẫn chạy đúng cả chiều xanh lẫn chiều đỏ, sửa một dòng là xong.
  file: `_acceptance/vong-mo-co-chu-giu/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **tin-giao.mjs now depends on phat-lich.mjs (DA_THONG), but no eval that exercises hangCuaDay lists phat-lich.mjs in its paths**
  Người dùng thấy gì: Nếu sau này danh sách trạng thái đã xong đổi, hai phép kiểm liên quan có thể không bị đánh dấu cần chạy lại, nên việc chọn hàng kế khi giao việc có thể đổi mà không ai được báo. Người dùng chưa gặp điều này hôm nay.
  Căn cứ: Chỉ xảy ra nếu sau này có người sửa danh sách đó, và lỗi hiện ra lúc ghim lại hồ sơ theo mốc phát hành chứ không làm mất dữ liệu; thêm một dòng vào danh sách đường dẫn là sửa được.
  file: `_acceptance/vong-mo-co-chu-giu/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Kênh liên máy dùng đọc-sửa-ghi cả tệp, nên một lần đồng bộ có thể xoá mất dấu máy mà hook vừa ghi (có thể mất cả «chấp nhận») (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bộ canh nền đang đồng bộ kênh mà phiên cùng lúc ghi nhận «đã đến» hoặc «chấp nhận», dấu đó có thể bị xoá. Hậu quả: vòng việc kẹt ở bước chờ người giao chấp nhận dù họ đã nghe, và sổ báo vòng vẫn mở.
  Căn cứ: Nặng vừa: chỉ xảy ra khi hai việc trùng thời điểm nhưng khi dính thì vòng kẹt mãi và người dùng không tự gỡ được, sửa cần thêm một cơ chế chống ghi đè nên đáng làm thành việc riêng.
  file: `dieu-phoi/scripts/tin-kenh.mjs`
  severity: medium
  Đề xuất: new-contract

- **--han và --han-xong không được kiểm: số lẻ, NaN, số âm vẫn được ghi, rồi bộ đọc lặng lẽ thay bằng hạn mặc định (r1)**
  Người dùng thấy gì: Người giao gõ hạn sai (số lẻ, chữ, số âm) vẫn được báo thành công, nhưng máy lặng lẽ tính theo hạn mặc định 30 phút hoặc coi như không có hạn. Người giao tưởng đã đặt hạn riêng mà không có cảnh báo nào.
  Căn cứ: Nhẹ vừa: không mất dữ liệu và chỉ khi gõ sai, nhưng hạn sai làm nhắc trễ hoặc không bao giờ nhắc; sửa rẻ.
  file: `dieu-phoi/scripts/tin.mjs`
  severity: medium
  Đề xuất: new-contract

- **phanTin (~55 dòng) bị chép nguyên văn vào hai hook: hai bản, không một nguồn (r1)**
  Người dùng thấy gì: Hiện người dùng không gặp gì khác thường. Rủi ro chỉ ở lần sửa sau: nếu chỉ sửa một trong hai chỗ, hai loại hook sẽ xử lý tin khác nhau.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, hai bản đang giống nhau từng byte; gộp lại có thể làm hỏng đường nạp an toàn đã được đo nên chi phí vượt lợi ích.
  file: `dieu-phoi/scripts/hook-nhip.mjs`
  severity: low
  Đề xuất: wont-fix

- **`tin XONG/NHẬN` trên yêu cầu cũ (mã dạng P1-7) báo thành công nhưng ghi ra một dòng mà bộ đọc bỏ qua: không đổi sổ, không đến người hỏi (r1)**
  Người dùng thấy gì: Đáp một yêu cầu cũ bằng lệnh mới được báo «thành công» nhưng câu trả lời không đến được người hỏi và sổ vẫn báo còn mở. Người đáp tưởng đã xong việc.
  Căn cứ: Nhẹ đến vừa: chỉ chạm các yêu cầu theo kiểu cũ còn sót, người dùng tự gỡ được bằng lệnh trả lời cũ; sửa rẻ (chặn kèm chỉ dẫn).
  file: `dieu-phoi/scripts/tin.mjs`
  severity: medium
  Đề xuất: new-contract

- **Dấu «đã báo lỗi nạp phần tin» không bao giờ được gỡ: sau lần lỗi đầu, mọi lỗi sau ở worktree đó bị nuốt vĩnh viễn (r1)**
  Người dùng thấy gì: Sau khi hộp tin báo hỏng một lần ở một thư mục làm việc, các lần hỏng sau ở đó không báo nữa. Tin tự đến có thể ngừng mà người dùng không hay biết.
  Căn cứ: Nhẹ vừa: cần hai lần hỏng khác nhau liên tiếp mới gặp, không mất dữ liệu, người dùng gỡ được bằng cách xoá dấu hoặc mở thư mục khác.
  file: `dieu-phoi/scripts/hook-nhip.mjs`
  severity: medium
  Đề xuất: known-limits

- **dongBo đọc, gọi mạng, rồi ghi đè trọn tệp trạng thái kênh: sự kiện máy (da-den, chap-nhan, ket-luot) ghi xen giữa sẽ mất (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bộ canh nền đang chờ mạng, các dấu «đã đến», «chấp nhận», «kết lượt» do phiên ghi xen vào có thể bị ghi đè mất. Vòng việc có thể kẹt hoặc hiện sai là chưa đến.
  Căn cứ: Cùng gốc với lỗi ghi chồng ở trên nên nên sửa chung trong một việc riêng; hiếm gặp nhưng khi dính người dùng không tự gỡ được.
  file: `dieu-phoi/scripts/tin-kenh.mjs`
  severity: low
  Đề xuất: new-contract

- **Mốc 24 giờ của MỞ LẠI dùng chap_nhan_luc cũ của vòng trước khi XONG lần hai chưa được chấp nhận (r1)**
  Người dùng thấy gì: Nếu người giao mở lại một việc lần hai trước khi kịp chấp nhận lần xong thứ hai, và đã quá 24 giờ từ lần chấp nhận đầu, hệ thống từ chối mở lại dù lần xong thứ hai vừa mới tới.
  Căn cứ: Nhẹ: tình huống hiếm, không mất dữ liệu, người giao có thể chấp nhận rồi mở lại hoặc giao việc mới.
  file: `dieu-phoi/scripts/tin.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): gh giả chia trang 30 và bỏ qua --jq, trong khi bên đọc xin per_page=100 (r1)**
  Người dùng thấy gì: Bộ kiểm giả lập kênh chia trang nhỏ hơn kênh thật, nên nếu ai bỏ cơ chế đọc nhiều trang thì bộ kiểm vẫn bắt được trong lab nhưng trên kênh thật có thể không lộ ra.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp; chỉ làm bộ kiểm kém tin cậy hơn, đã có ca chạy thật trên kênh thật bổ sung nên ghi giới hạn là đủ.
  file: `tests/dieu-phoi/gh-gia.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (đầu vào viết tay đúng khuôn bên đọc): hàng «chờ cổng người» tự dựng Set choCong, không đi qua choCongCua (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm chưa chứng minh được việc nhận ra «hồ sơ đang chờ người ký» từ hồ sơ thật, nên nếu phần nhận ra này hỏng thì đồng hồ hạn có thể vẫn chạy khi lẽ ra phải ngừng.
  Căn cứ: Nhẹ: lỗi chỉ làm nhắc quá hạn sai chứ không mất dữ liệu; chỗ trống nằm ở bộ kiểm, bù được bằng khai giới hạn.
  file: `tests/dieu-phoi/tin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn ghim cứng gốc): chayCanhNen luôn chạy gói thật GOI thay vì bản sao đang kiểm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai ca kiểm chế độ canh chờ luôn chạy bản thật chứ không chạy bản đang được thử tiêm lỗi, nên lỗi ở đường chờ có thể lọt qua bộ kiểm.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp, chỉ làm bộ kiểm yếu ở một góc; sửa không gấp, ghi giới hạn là đủ.
  file: `tests/dieu-phoi/tin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim đúng thông điệp): ca đỏ GT-03 so chuỗi mã có sẵn trong phần kỳ vọng nên luôn khớp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai ca kiểm «mục bị mất» và «chấp nhận một phía» không phân biệt được hai kiểu lỗi này với các lệch khác của cùng hàng. Lỗi vẫn bị bắt nhưng không chắc đúng lý do.
  Căn cứ: Rất nhẹ: lỗi thật vẫn làm ca đỏ, chỉ chẩn đoán kém rõ; không ảnh hưởng người dùng.
  file: `tests/dieu-phoi/tin.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (quan hệ không có mốc): «một hàm phân loại cho hai nơi chứa» chỉ so hai đầu ra với nhau (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép so này sẽ vẫn xanh nếu cả hai đường cùng đọc ra rỗng. Có thể che một lỗi đọc tin chung cho cả đợt lẫn kênh.
  Căn cứ: Rất nhẹ: ma trận đọc tin ở chỗ khác đã có giá trị mốc, nên rủi ro thật nhỏ; không ảnh hưởng người dùng.
  file: `tests/dieu-phoi/tin.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/vong-mo-co-chu-giu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
