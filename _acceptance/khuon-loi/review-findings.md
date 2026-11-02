# Review findings: khuon-loi (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ lọc «chỉ chạm hồ sơ» của --write miễn cả _acceptance/config.yaml, mà chính bước chấm lại đọc tệp này**
  Người dùng thấy gì: Nếu ai đó sửa cấu hình vùng giao diện của kho sau khi chấm, tệp số đo vẫn được ghi và đóng dấu như thể số đo ấy tính từ cấu hình cũ. Hiện chưa có chỗ nào đọc con số bị ảnh hưởng nên người dùng chưa thấy gì sai.
  Căn cứ: Hậu quả nhẹ: con số bị ảnh hưởng chưa hiện trên thẻ nào, không mất dữ liệu, và chạy chấm lại là sửa được.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **git diff --name-only (rename detection mặc định bật) chỉ in đường dẫn đích, nên dời một tệp vùng vào _acceptance/ sau den vẫn qua được**
  Người dùng thấy gì: Nếu một màn giao diện bị dời vào thư mục hồ sơ sau lần chấm, hệ thống vẫn cho ghi số đo và đóng dấu như chưa có gì thay đổi, nên số đo có thể không còn đúng với bản đã chấm. Tình huống này hiếm.
  Căn cứ: Rất hiếm gặp, hậu quả chỉ là một con số lệch trong tệp số đo, người dùng tự chạy lại để sửa được.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **Chiều đỏ của răng --write mới chỉ phủ nhánh sauDen; nhánh is-ancestor không có ca, và thông điệp tu1 ghim chưa phân biệt được hai lối từ chối**
  Người dùng thấy gì: Một lần gỡ nhầm đoạn kiểm tra sản phẩm từ chối ghi số đo khi bản chấm không nằm trên nhánh hiện tại có thể không bị bộ kiểm phát hiện. Người dùng chỉ gặp nếu sau này ai đó sửa nhầm đoạn này.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, chỉ làm mạng lưới kiểm thưa hơn ở một chỗ phụ; bổ sung ca kiểm sau này rẻ.
  file: `tests/scripts/khuon-loi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **KL-7: phần kiểm «không chạm tệp đã có» của nhánh commit-ngoài-hồ-sơ (tu1) không còn tác dụng vì `git reset --hard` xoá dấu vết trước khi so**
  Người dùng thấy gì: Lời hứa rằng khi từ chối thì không đụng tới tệp số đo cũ, ở trường hợp có commit mới sau lần chấm, hiện chỉ được giữ bằng mã thoát chứ chưa được kiểm trực tiếp trên nội dung tệp. Hôm nay hành vi thật vẫn đúng.
  Căn cứ: Hành vi thật đang đúng, chỉ là phép kiểm yếu; nếu sau này hỏng thì tệp số đo cũ bị ghi đè nhưng chạy lại là khôi phục được.
  file: `tests/scripts/khuon-loi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): bộ lọc «ngoài hồ sơ» mới của --write có ba nhánh, nhưng không ca nào bắt hai nhánh mới**
  Người dùng thấy gì: Một số cách chặn ghi số đo khi cây làm việc đã đổi chưa được bộ kiểm canh giữ, nên nếu ai đó vô tình gỡ chúng thì không có gì báo đỏ. Người dùng chỉ thấy hậu quả nếu số đo bị đóng dấu trên bản đã đổi mà không ai hay.
  Căn cứ: Rủi ro nằm ở việc sửa đổi sau này chứ không ở hành vi hiện tại; lỗi nếu xảy ra chỉ làm số đo kém tin cậy và chạy chấm lại là sửa được.
  file: `tests/scripts/khuon-loi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không phân biệt): tu1 ghim chuỗi con mà cả hai lời từ chối đều chứa**
  Người dùng thấy gì: Bộ kiểm không phân biệt được hai lý do từ chối ghi số đo vì cả hai lời báo có chung một cụm chữ. Người dùng vẫn bị từ chối đúng, chỉ là lời báo trong bài kiểm kém chính xác.
  Căn cứ: Không có ảnh hưởng nào lên người dùng, chỉ là độ chặt của bài kiểm; sửa chủ yếu là chỉnh chữ nhưng giá trị mang lại rất nhỏ.
  file: `tests/scripts/khuon-loi.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **The porcelain -z filter cuts 3 characters off the old path of a rename entry, so a staged rename inside _acceptance/ is refused by mistake (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi ai đó vừa đổi tên một tệp trong thư mục hồ sơ mà chưa commit, lệnh ghi số đo khuôn từ chối chạy và in một đường dẫn bị cụt chữ. Người dùng chỉ cần commit hoặc bỏ thay đổi đó rồi chạy lại là xong.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu, chỉ bị từ chối nhầm một lần ở ca hiếm, và người dùng tự gỡ được bằng cách commit rồi chạy lại.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **--slug không được kiểm trước khi ghi tệp vào _acceptance/<slug>/ (lệch với luat-san-pham) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu ai đó gõ tên hồ sơ có dấu đi ngược thư mục, công cụ có thể ghi tệp kết quả ra ngoài thư mục hồ sơ thay vì báo lỗi.
  Căn cứ: Chỉ xảy ra khi người chạy lệnh tự gõ tên bất thường trên máy của mình, không chạm người dùng cuối, sửa sau rẻ và không mất dữ liệu có sẵn.
  file: `scripts/design-floor-khuon.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khuôn đặc tả UX và SKILL nói «máy so» Thẻ việc với nhan_viec, nhưng không có máy nào làm việc đó (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn nói máy sẽ đối chiếu phần mô tả công việc của màn với khai báo của nhóm, nhưng thực tế chưa có bước nào làm vậy nên người đọc có thể tin nhầm là đã được kiểm.
  Căn cứ: Hậu quả nhẹ vì chỉ là câu chữ gây hiểu lầm, không làm sai kết quả chấm; chỉ cần khai rõ giới hạn là đủ và sửa lúc nào cũng rẻ.
  file: `skills/acceptance/references/ux-spec-template.md`
  severity: medium
  Đề xuất: known-limits

- **Vòng khuon-loi sửa test của hồ sơ lo-trinh-gio-may đã ký: đổi một chiều đỏ thành SKIP mà expected của eval đã ký không có (r1)**
  Người dùng thấy gì: Một phép kiểm của hồ sơ khác đã ký nay có thể báo bỏ qua thay vì đỏ khi bộ đọc hỏng, và hồ sơ đó sẽ hiện là cũ cần ghim lại.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ làm một thước của hồ sơ khác lỏng hơn và cần ghim lại ở đợt phát hành; người quyết nên biết để xếp lịch ghim.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tệp fixture khuon-loi-kho-mau.mjs không nằm trong paths của eval nào, nên vòng sửa chỉ chạm fixture vẫn mang sang màu xanh cũ (r1)**
  Người dùng thấy gì: Nếu một lượt sau chỉ sửa dữ liệu mẫu dùng để thử, các phép kiểm có thể được giữ lại màu xanh của lượt trước mà không chạy lại.
  Căn cứ: Chỉ làm lượt sau chấm lỏng hơn mức cần, người dùng cuối không thấy; khai thành giới hạn là đủ vì sửa danh sách đường dẫn rất rẻ khi cần.
  file: `_acceptance/khuon-loi/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khoá khuon_loi trong config ghi sai dải ca và chen vào giữa cặp quet_het_han/_rt5 (r1)**
  Người dùng thấy gì: Một dòng ghi chú trong tệp cấu hình ghi sai dải ca và nằm chưa đúng chỗ, chỉ gây khó đọc cho người bảo trì.
  Căn cứ: Không có hậu quả nào với người dùng hay kết quả chấm; chi phí mở việc riêng lớn hơn lợi ích.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **--kiem --write bỏ mất ra.sai: bản đồ hỏng lược đồ vẫn ra khuon-cham.json sạch, lệnh thoát 0, thẻ in dòng Khuôn sạch (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi tệp mô tả khuôn của kho bị hỏng cú pháp, thẻ duyệt vẫn in dòng Khuôn sạch như không có lỗi, trong khi cả bản đồ khuôn thực ra đã bị tắt mà không ai hay.
  Căn cứ: Người ký có thể tin là màn đã theo khuôn trong lúc không có gì được kiểm, nên lỗi lọt qua cổng; sửa nên làm sớm và không đắt vì người chạy lại lệnh kiểm vẫn thấy lỗi.
  file: `scripts/design-floor-khuon.mjs`
  severity: high
  Đề xuất: new-contract

- **Kiểm khe bị cắt ở dấu «>» đầu tiên trong thẻ: hàm mũi tên trong thuộc tính báo thiếu khe sai và để lọt thiếu children (r1)**
  Người dùng thấy gì: Với những thẻ có xử lý bấm nút viết kiểu hàm mũi tên, công cụ có thể báo thiếu mục dù đã có (trả lại màn oan), hoặc bỏ sót khi thật sự thiếu nội dung.
  Căn cứ: Kiểu viết này rất phổ biến nên người làm sẽ bị trả lại oan hoặc lọt lỗi khá thường xuyên; người dùng cuối không bị ảnh hưởng trực tiếp nhưng sửa cần một vòng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **Bộ đọc YAML âm thầm bỏ mọi khoá sau một dòng thụt sâu hơn (scalar nhiều dòng, |, >) (r1)**
  Người dùng thấy gì: Nếu người viết tệp khuôn dùng một mô tả trải nhiều dòng, các mục khai báo phía sau bị lặng lẽ bỏ qua, có thể khiến nhóm bị chấm sai hoặc quy tắc cấm bị tắt.
  Căn cứ: Chỉ xảy ra khi tệp khuôn dùng cách viết hiếm, người dùng cuối không thấy trực tiếp; khai giới hạn kèm ngưỡng và dặn dùng dạng một dòng là hợp lý.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **gate-card nuốt mọi lỗi của theCong2: thẻ trông như kho không khai bản đồ (r1)**
  Người dùng thấy gì: Nếu phần dựng dòng Khuôn trên thẻ gặp lỗi bất ngờ, thẻ im lặng bỏ dòng này và trông y như kho không dùng khuôn.
  Căn cứ: Hiếm gặp và chỉ làm thẻ thiếu thông tin chứ không đưa thông tin sai; người xem chạy lại thẻ là thấy, sửa rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
