# Review findings: phan-du-bo-cuc-moi (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **KHOA_N_CU vá theo từng khoá bị nêu tên, không theo LỚP «khoá có chữ số đếm nội dung cây» (đây là lần tái phát thứ hai trong cùng vòng)**
  Người dùng thấy gì: Bước kiểm tra giữ khoá có thể báo nhầm là mất một ca kiểm khi thực ra ca đó chỉ đổi con số đếm. Người dùng không bị hại gì. Hậu quả là một lượt chấm có thể đỏ oan và tốn thêm khoảng một tiếng rưỡi chạy máy.
  Căn cứ: Lỗi chỉ gây cảnh báo oan chứ không để lọt lỗi thật, nên nhẹ với người dùng; ghi lại giới hạn kèm ngưỡng đếm là đủ, sửa trọn lớp thì tốn công hơn cái hại.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích mã và ca tự kiểm ghi sai cặp số (232→233), log thật là 233 ở bản gốc**
  Người dùng thấy gì: Một con số trong ghi chú nội bộ bị ghi sai, nên ai đọc sổ quyết định sẽ hiểu sai số đo. Sản phẩm chạy đúng và người dùng không thấy gì.
  Căn cứ: Chỉ sai chữ trong ghi chú, không đổi kết quả kiểm tra nào, nên sửa tốn công hơn nhiều so với hậu quả.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc: ca KHOA-N chép tay chuỗi khoá CTN-AC6-kit thay vì rút từ writer**
  Người dùng thấy gì: Nếu ai đó đổi chữ mô tả một ca kiểm ở nơi viết, bài tự kiểm của bước giữ khoá vẫn báo xanh trong khi bản chạy thật sẽ báo mất ca oan. Người dùng không bị ảnh hưởng, chỉ làm lượt chấm đỏ nhầm.
  Căn cứ: Hậu quả chỉ là báo đỏ nhầm, người phát triển thấy ngay và tự gỡ được; ghi giới hạn là đủ, chưa đáng mở việc riêng.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.test.mjs`
  severity: low
  Đề xuất: known-limits

- **recheck-evidence.cjs viết cứng tên plugin 'acceptance-gate' và khớp chuỗi con trên source, không tra theo vai qua bảng tên một nguồn (r1)**
  Người dùng thấy gì: Trong trường hợp hiếm, kiểm lại bằng chứng có thể nhận nhầm một gói có tên gần giống làm gói lõi. Các kho hiện nay không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ và hiếm gặp, không làm mất hay lộ dữ liệu; người dùng thấy lỗi thì kiểm tra lại được, và ghi thành giới hạn đã biết là đủ.
  file: `scripts/recheck-evidence.cjs`
  severity: low
  Đề xuất: known-limits

- **Đầu tệp bản nhân fixture trích sai sổ quyết định: d-20260912T024254Z-14 chọn MỘT module dùng chung, không phải «chuyển hay nhân bản» (r1)**
  Người dùng thấy gì: Người đọc lần theo ghi chú trong tệp kiểm sẽ thấy một quyết định cũ nói điều ngược lại. Sản phẩm chạy bình thường, chỉ gây hiểu nhầm khi đọc tài liệu.
  Căn cứ: Chỉ là chú thích sai, không ảnh hưởng người dùng cuối hay dữ liệu, nên sửa tay lúc nào tiện cũng được và không đáng mở việc riêng.
  file: `tests/fixtures/cua-veto-sau-chu-ky.mjs`
  severity: low
  Đề xuất: wont-fix

- **giu-khoa.mjs: `--base` with no value silently falls back to merge-base (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu người vận hành gõ thiếu giá trị cho tuỳ chọn mốc so sánh, công cụ đo vẫn chạy ở mốc mặc định mà không báo lỗi. Số đo ra có thể không phải mốc họ định đo.
  Căn cứ: Chỉ xảy ra khi gõ sai lệnh, người dùng chạy lại là xong và không mất dữ liệu; sửa sau cũng rẻ nên ghi giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình, không có đối chứng dương): `--cu` cho PASS «0/0» khi túi khoá bản gốc rỗng, cùng lớp lỗi vòng này vừa vá ở `--moi` (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bản gốc không chạy được, bước kiểm giữ khoá ở bố cục cũ có thể báo xanh dù thực ra chưa so sánh gì. Người ký có thể tin nhầm là không mất ca kiểm nào.
  Căn cứ: Chỉ xảy ra khi môi trường đo hỏng, không đụng tới người dùng cuối; nhưng màu xanh giả có thể đánh lừa người ký, nên cần khai rõ giới hạn này.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert trạng thái trong khi lời hứa là QUAN HỆ): GUI-B2 coi «thừa ở HEAD» là «diff của vòng làm thừa», không so với bản gốc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Danh sách mục vá thừa gửi sang kho bên kia có thể lẫn vài mục vốn đã cũ từ trước, không phải do vòng này làm thừa. Người nhận có thể mất công xem lại vài mục không cần thiết.
  Căn cứ: Chỉ làm danh sách gửi đi dài hơn một chút, không mất dữ liệu và người nhận tự lọc được; ghi giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Ứng viên gốc gói lõi viết cứng tên plugin và lùi về so chuỗi con trên dữ liệu ngoài (r1)**
  Người dùng thấy gì: Ở một kho có thư mục tên gần giống gói lõi mà không có gói lõi thật, việc kiểm lại báo cáo đã ký có thể tìm công cụ kiểm ở nhầm thư mục và bỏ qua cảnh báo thiếu công cụ.
  Căn cứ: Chỉ xảy ra ở kho có cách đặt tên thư mục hiếm, hậu quả là một cảnh báo bị mất chứ không mất dữ liệu, và người dùng đổi tên thư mục là tránh được.
  file: `scripts/recheck-evidence.cjs`
  severity: low
  Đề xuất: known-limits

- **Nhánh dự phòng của khoaBat nhận nhầm kho tiêu thụ tự là một plugin thành bản cài gói lõi (r1)**
  Người dùng thấy gì: Ở một kho tự là plugin và cài tính năng lộ trình từ chợ tên khác, luật chặn lộ trình có thể tắt lặng lẽ dù kho đã bật chặn, nên việc đáng bị chặn lại được đi qua.
  Căn cứ: Hiếm gặp vì cần kho vừa là plugin vừa bật luật chặn, nhưng khi xảy ra thì luật tắt mà không báo, nên cần ghi rõ để người dùng biết mà kiểm tay.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **The fourth verifier candidate only exists in recheck-evidence, so the PreToolUse hook and the CI re-check now give different answers (r1)**
  Người dùng thấy gì: Ở kho đặt gói lõi trong thư mục con, cùng một báo cáo bằng chứng qua được bước kiểm lại ở CI nhưng lại bị chặn khi phiên làm việc ghi hoặc sửa nó, nên người dùng bị chặn khó hiểu.
  Căn cứ: Người dùng bị chặn nhầm ở đúng kho dùng bố cục mới, không tự gỡ được vì hai nơi cho hai đáp án khác nhau, và sửa cần chạm lõi dùng chung nên đáng làm thành việc riêng.
  file: `scripts/recheck-evidence.cjs`
  severity: medium
  Đề xuất: new-contract

- **The new khoaBat fallback branch assumes a repo with .claude-plugin/plugin.json and no marketplace.json is always the new-layout kit install. A consumer repo that is itself a plugin breaks that assumption (r1)**
  Người dùng thấy gì: Ở kho tự là plugin, luật chặn lộ trình có thể tắt lặng lẽ hoặc báo lỗi thiếu tệp dù kho cấu hình đúng, nên người dùng tưởng được chặn mà thực ra không.
  Căn cứ: Chỉ ảnh hưởng nhóm kho hiếm có hình dạng này, không mất dữ liệu, và người dùng có thể tránh bằng cách chép đủ tệp bảng tên hoặc kiểm tay luật chặn.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert «có mặt» thay cho QUAN HỆ): GUI-B2 chỉ rút mục vá thừa ở HEAD, không so với bản gốc nên không đo «mục do diff của vòng làm thừa» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Danh sách mục vá thừa gửi cho kho giao hàng hôm nay đúng, nhưng cách rút danh sách chưa chứng minh được rằng chỉ những mục do vòng này làm thừa mới được liệt kê.
  Căn cứ: Kết quả hiện tại không sai và không ảnh hưởng người dùng; rủi ro chỉ xuất hiện nếu dữ liệu đổi sau này, và người đọc kiểm lại được bằng cách chạy so bản gốc.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không có đối chứng dương cho phía tham chiếu): phép so «túi HEAD ⊇ túi bản gốc» vẫn PASS 0/0 khi lượt chạy phía bố cục cũ hỏng hoặc không in ca nào (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu lượt chạy bản gốc hỏng im lặng, bước kiểm không-mất-ca-nào có thể báo xanh mà thực chất không so gì, nên một ca bị mất có thể lọt qua.
  Căn cứ: Hiện chưa gây sai kết quả nào và lỗi hạ tầng như vậy thường lộ ra ở các bước khác, nên ghi lại để người ký biết giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
