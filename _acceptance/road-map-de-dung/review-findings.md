## Trong hợp đồng

- **Single-lane forecast can finish a milestone before the milestone it depends on**
  file: `scripts/gio-may.mjs:147`
  severity: high
  AC: AC-10
  source: bugs
  detail: The new single-lane pass in duBao visits milestones by date. For each one it computes the start as max(_bd, lan, hoanTatGio of the milestones in _phu). When a dependency j has a LATER date than the dependent milestone i, kq.get(j).hoanTatGio is still the value from before the lane pass, because j has not been visited yet. Later, j is pushed to start after i finishes (lan = i's completion), so the dependency ends up finishing after the milestone that depends on it. Repro run directly against scripts/gio-may.mjs: work A has dung_tren ['B']; milestone 'som' (2026-10-20) holds A and milestone 'muon' (2026-10-30) holds B. With today 2026-10-18 the output is som: start 10-18, done 10-19; muon: start 10-19, done 10-20. So the dependent finishes before its dependency, and quaTai for 'som' is also wrong. This shape exists in the real crm fixture tests/scripts/fixtures/lo-trinh/crm-onehub-1017/okr.json: milestone #8 (10-16) depends on #17 (10-31), and #22 (10-28) depends on #17 and #21 (12-14). Dates printed in the xem view, the startup card and the page/data block (mocGioMay/du_kien) can therefore be wrong. Fix: visit the lane in an order that respects dependencies (topological order, using date as the tie-break), or re-run the pass until it stops changing.

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): RD-10-kho nhận mọi dòng khác theo khuôn regex cố định, không theo tập kỳ vọng tính từ dữ liệu kho; khối dữ liệu bị cắt bỏ trước khi so**
  file: `tests/scripts/road-map-de-dung.test.mjs:545`
  severity: medium
  AC: AC-10
  source: measurement
  detail: E10 hứa: «mọi dòng khác nhau giữa bộ máy mới và cũ (trang, khối dữ liệu, --xem) thuộc tập kỳ vọng tính độc lập từ dữ liệu kho; in kỳ vọng/thực tế từng kho». Trong mã, `MOI_DUOC` (dòng 545) là danh sách regex khuôn, không suy ra từ dữ liệu: `/^  ! /` nhận MỌI dòng cờ mới, `/^  · .+: (bắt đầu ~|không tính được)/` nhận mọi dòng giờ máy đổi tuỳ ý, `CU_DUOC` cho phép mất bất kỳ dòng giờ máy nào. Một cờ sai sinh thêm, hay một dòng giờ máy sai số, vẫn xanh. Bên trang, `chuanTrang` (dòng 542–544) xoá trọn `<script type="application/json">`, cả khối Mốc và cả khối Cần sửa trước khi so, nên vế «khối dữ liệu» của lời hứa không hề được đo. Dòng in ra (dòng 558) chỉ đếm «thêm / bớt / ngoài tập kỳ vọng», không có con số kỳ vọng nào tính từ tệp để đặt cạnh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hồ sơ trỏ sai script sinh bản chụp crm: lo-trinh-chup-crm.mjs là một script khác, có sẵn từ trước**
  Người dùng thấy gì: Người đọc hồ sơ làm theo chỉ dẫn sẽ chạy nhầm công cụ chụp dữ liệu và không dựng lại được bản chụp của vòng này. Sản phẩm chạy đúng, chỉ có tài liệu hướng dẫn sai tên.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng sản phẩm, chỉ làm người bảo trì mất thời gian khi dựng lại dữ liệu mẫu, và sửa một dòng chữ rất rẻ.
  file: `_acceptance/road-map-de-dung/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Phần tử dung_tren rỗng khớp nhầm với mốc không có `ma`: báo sai cờ dung-tren-moc và mất dòng «mã không có»**
  Người dùng thấy gì: Khi lộ trình có một mục phụ thuộc bị để trống, hệ thống cảnh báo nhầm rằng việc đó đứng trên một mốc thật và nuốt mất cảnh báo đúng là mục phụ thuộc không có mã. Người đọc có thể bị chỉ sai chỗ cần sửa.
  Căn cứ: Nhẹ: chỉ xảy ra khi tệp lộ trình bị sửa tay sai, không mất dữ liệu, cảnh báo sai nhưng người dùng tự sửa lại tệp được.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Trang cũ nhận hai cờ vàng «vẽ lại bằng bộ kit mới» cho cùng một lần vẽ lại**
  Người dùng thấy gì: Với trang lộ trình vẽ từ rất sớm, người đọc thấy hai dòng cảnh báo cùng bảo vẽ lại trang, trong khi tài liệu hứa đúng một dòng. Chỉ gây rườm, không làm sai nội dung.
  Căn cứ: Nhẹ: chỉ thừa một dòng nhắc, người dùng vẽ lại trang một lần là hết, không mất dữ liệu.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Luật dữ liệu giả có hai bản cài đặt độc lập (răng cắt lượt và bộ đọc chung) dù comment khai «MỘT nguồn»**
  Người dùng thấy gì: Cùng một luật kiểm dữ liệu giả được viết ở hai nơi, nên sau này sửa một nơi mà quên nơi kia thì lúc cắt lượt và lúc đọc có thể báo khác nhau. Hiện chưa có người dùng nào gặp sai lệch cụ thể.
  Căn cứ: Rủi ro tương lai chứ chưa gây hại hôm nay; gộp hai bản đòi đụng nhiều chỗ nên đáng ghi lại hơn là sửa vội.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **A task listed in several milestones has its hours counted again for each one in the lane**
  Người dùng thấy gì: Khi một việc được liệt ở nhiều mốc, giờ máy của việc đó bị cộng lại ở mỗi mốc nên ngày dự kiến của các mốc sau bị đẩy muộn hơn thực tế. Người đọc có thể thấy ngày giao dự kiến xa hơn mức cần.
  Căn cứ: Vừa: chỉ làm ngày dự kiến thiên về muộn (an toàn hơn là sớm), không mất dữ liệu, người dùng tự bỏ trùng việc ở lộ trình được.
  file: `scripts/gio-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **Milestones-section header claims hidden milestones have no tasks, which is false when the task was shown under an earlier milestone**
  Người dùng thấy gì: Dòng tiêu đề khối Mốc nói một số mốc là chưa gắn việc nào, nhưng thực ra có mốc đã gắn việc mà việc đó đã hiện ở mốc trước. Người đọc hiểu nhầm lý do mốc bị ẩn.
  Căn cứ: Nhẹ: chỉ sai một câu giải thích, danh sách việc hiển thị vẫn đúng và không mất dữ liệu.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Display model puts undated milestones first, so they take shared tasks — the opposite of the machine-hours lane**
  Người dùng thấy gì: Khi một việc nằm ở cả mốc chưa có ngày và mốc có ngày, trang hiện việc đó dưới mốc chưa có ngày, ngược với cách tính giờ máy. Người đọc thấy việc nhóm khác nơi ngày dự kiến tính.
  Căn cứ: Nhẹ: chỉ xảy ra với mốc chưa có ngày dùng chung việc, không mất dữ liệu, người dùng chỉnh lại lộ trình là xong.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): RD-1-do và RD-1-do2 ghim một nhãn do chính ca tự gắn theo tên ca con, không ghim thông điệp của vật; nhãn của RD-1-do còn khớp hai ca con**
  Người dùng thấy gì: Ca kiểm chiều đỏ của luật bỏ mốc ngoài có thể vẫn báo đúng dù lỗi xảy ra ở chỗ khác, nên khó tin hoàn toàn rằng nó bắt đúng chỗ. Người dùng sản phẩm không bị ảnh hưởng trực tiếp.
  Căn cứ: Nhẹ với người dùng: chỉ làm bộ kiểm kém chặt, vật vẫn chạy đúng, và siết lại ca đo là việc nội bộ tách riêng được.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): RD-9-do ghim mã ô '|qua|co|' do ca tự sinh, còn thông điệp E9 khai «mốc đã khép vẫn bị báo» không có ở đâu trong mã**
  Người dùng thấy gì: Ca kiểm chiều đỏ của dòng gom mốc đã qua ngày ghim vào tên ô do chính ca tự đặt, nên chưa chứng minh được nó bắt đúng lỗi báo nhầm mốc đã khép. Người dùng không thấy khác biệt nào.
  Căn cứ: Nhẹ với người dùng: chỉ là bộ kiểm lỏng hơn lời khai, vật chạy đúng theo hợp đồng và có thể siết sau.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): RD-1 ca 'moc-ngoai-va-hang' hứa «thoát 1 CHỈ VÌ [moc-ngoai-da-bo]» nhưng chỉ kiểm dòng ấy có mặt**
  Người dùng thấy gì: Ca kiểm không loại trừ được việc hệ thống báo thêm lỗi sai bên cạnh lỗi mốc ngoài, nên một lỗi báo thừa có thể lọt qua. Người dùng có thể thấy thêm một dòng lỗi không đáng có ở ca hiếm.
  Căn cứ: Nhẹ: lỗi báo thừa chỉ gây nhiễu, không làm mất dữ liệu, và người dùng đọc là phân biệt được.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên phủ nhưng không có assert): E5 hứa «details mở chứa slug khi có» mà bộ đọc RD-5 xoá trọn nội dung details và không assert slug nào**
  Người dùng thấy gì: Chưa có phép đo nào kiểm rằng khi mở một dòng việc thì thấy tên hồ sơ; nếu chỗ này hỏng thì không ai biết qua bộ kiểm. Người dùng có thể mở dòng ra mà không thấy tên hồ sơ.
  Căn cứ: Nhẹ: chỉ là chi tiết phụ khi mở rộng dòng, người dùng tải lại hoặc xem nguồn là thấy, và thêm phép đo sau rất rẻ.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): RD-3 kiểm «khối VAN-HANH không dạy tạo mốc ngoài» bằng regex hai cụm, không có ca đỏ cho vế này**
  Người dùng thấy gì: Phép kiểm rằng hướng dẫn cắt lượt không dạy tạo mốc ngoài chỉ bắt hai cách viết cố định, nên nếu sau này ai dạy bằng câu chữ khác thì không bị phát hiện. Hiện hướng dẫn chưa sai.
  Căn cứ: Nhẹ: chỉ là lưới an toàn hẹp cho thay đổi tương lai, không có hậu quả với người dùng hôm nay, và bổ sung ca đỏ sau không đắt.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
