# Review findings: cua-tin-hieu-giua-chien-dich (round 2)

## Trong hợp đồng

- **CT-3-do5 đỏ vì một lý do khác với thông điệp nó ghim, và chốt «tiêu đề rỗng thì không bao giờ trùng» không có ca đỏ nào**
  AC: AC-3
  file: tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs:225
  severity: medium
  source: conventions
  detail: Mutant CT-3-do5 thay `tieuDeYc` thành `chuanHoa(nd?.tieu_de)`, nhưng giữ chốt `td !== ''` trong `timTrung` (dieu-phoi/scripts/yeu-cau.mjs:104). Vì chốt còn đó, hai hang-moi chỉ có cau_giao vẫn được ghi riêng. Tôi chạy thử trên một bản sao: P2-1 trả về `ghi`. Thứ thật sự hỏng là cặp viec-phu cùng «viec» không còn được gộp, nên cửa có 4 tệp. Phép `tepCua(k).length !== 3` gộp hai tính chất vào một chỗ nên vẫn đẩy ra «ý không tiêu đề bị gộp mất». Mảng sai nhận được là ["ý không tiêu đề bị gộp mất", "hai việc phụ cùng «viec» không gộp: {ket_qua: ghi…}"]. Thông điệp được ghim vì thế mô tả sai cái đã hỏng, vi phạm luật «ghim đúng thông điệp mong đợi» trong CLAUDE.md. Hệ quả thứ hai: commit 45369daf khai «gộp chỉ khi tiêu đề không rỗng», nhưng chốt này không có ca đỏ nào canh. Tôi gỡ `td !== '' &&` khỏi yeu-cau.mjs:104 trên bản sao rồi chạy CT_CASES=CT-3: đủ 11/11 ca vẫn PASS, kể cả CT-3-do5. Một ý không có tieu_de/viec/cau_giao (chẳng hạn hang-moi chỉ có `tep: []`) sẽ bị gộp nhầm vào ý trước trong 24 giờ mà không ca nào bắt được. Cách sửa gợi ý: tách hai vế assert trong ca3KhongTieuDe; thêm một mutant gỡ chốt `td !== ''` trên fixture có hai ý không mang khoá tiêu đề nào, ghim đúng «ý không tiêu đề bị gộp mất»; ghim lại CT-3-do5 vào «hai việc phụ cùng «viec» không gộp».
  rationale: AC-3 hứa hai ý chỉ gộp khi tiêu đề sau chuẩn hoá KHÔNG rỗng và bằng nhau (Ngoài-3), nhưng không ca nào giữ chiều đỏ của vế «rỗng thì không gộp»: gỡ chốt mà 11/11 ca vẫn xanh.

- **Hình dạng 5 (thiếu phần tử ma trận): vế «tiêu đề sau chuẩn hoá KHÔNG rỗng» của AC-3 không có fixture nào đi qua, gỡ chốt mà mọi ca CT-3 vẫn xanh**
  AC: AC-3
  file: tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs:219
  severity: medium
  source: measurement
  detail: Contract AC-3 dòng 61-63 và commit 45369daf hứa «hai ý chỉ gộp khi tiêu đề (tieu_de → viec → cau_giao) sau chuẩn hoá KHÔNG rỗng và bằng nhau». Trong vật, vế đó là chốt `td !== '' &&` trong `timTrung` (dieu-phoi/scripts/yeu-cau.mjs:104). ca3KhongTieuDe chỉ dựng hai hang-moi có `cau_giao` khác nhau, vốn khác nhau sau khi rơi tiêu đề, và hai viec-phu có `viec` giống nhau. Không yêu cầu nào thiếu cả ba trường. Trên bản sao tôi gỡ riêng chốt (`(td !== '' && tieuDeYc(c.noi_dung) === td)` thành `(tieuDeYc(c.noi_dung) === td)`): CT-3, CT-3-lan-hai, CT-3-gop, CT-3-khac-than, CT-3-dot-sau, CT-3-khong-tieu-de cùng các ca đỏ do..do5 đều vẫn PASS. Vế «rỗng thì không bao giờ trùng» có hai giá trị (rỗng/không rỗng) nhưng ma trận chỉ phủ phía không rỗng. Lỗi gốc mà Ngoài-3 đi sửa là `'' === ''` gộp hai ý không tiêu đề, và hiện không ca nào giữ chiều đỏ của nó.
  rationale: Vế «KHÔNG rỗng» được AC-3 nêu đích danh nhưng ma trận ca không có fixture ba trường đều rỗng, nên vế này không được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **CT-3-do5 xanh vì lý do sai: mũi tiêm làm thiếu gộp chứ không làm mất ý, nhưng vẫn khớp thông điệp «ý không tiêu đề bị gộp mất» qua vế đếm tệp nối bằng phép HOẶC**
  Người dùng thấy gì: Bộ kiểm tra có một ca đỏ ghi nhãn lỗi chưa chính xác, nhưng hành vi gửi ý của người dùng không bị ảnh hưởng. Chỉ làm người đọc kết quả kiểm tra hiểu hơi lệch nguyên nhân khi ca đó đỏ.
  Căn cứ: Người dùng cuối không gặp gì; chỉ là nhãn báo lỗi của ca kiểm tra, sửa sau không mất gì và phần hổng thật đã nằm ở mục khác.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Tệp tín hiệu mang tên đợt vẫn đụng nhau khi tên đợt được dùng lại sau khi dọn thư mục đợt: mã yêu cầu đếm lại từ 1, mọi ý không chặn lại đánh thức giám sát**
  Người dùng thấy gì: Nếu người dùng dọn thư mục đợt rồi mở lại đợt mới với đúng tên cũ, các ý không chặn sẽ lại gọi giám sát vào phán thay vì được ghi lặng lẽ. Không ý nào bị mất, chỉ mất lợi ích đỡ phải gọi người cho đợt đó.
  Căn cứ: Hậu quả nhẹ vì không mất ý nào và người dùng tránh được bằng cách đặt tên đợt mới; chỉ xảy ra khi tự dùng lại tên cũ sau khi dọn, và hợp đồng đã ghi nhận giới hạn này.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, ghim thông điệp không phân biệt lỗi): ca đỏ CT-3-do5 xanh nhờ nhánh HOẶC, không nhờ lỗi «gộp mất» nó tuyên**
  Người dùng thấy gì: Một ca kiểm tra đỏ báo lỗi bằng nhãn không đúng nguyên nhân thật, không đổi gì cho người dùng gửi ý. Chỉ khiến người bảo trì khó đọc ra lỗi nào đang bị bắt.
  Căn cứ: Không ảnh hưởng người dùng, không mất dữ liệu; sửa sau rẻ và phần quan trọng đã được xử lý ở mục khác.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Tệp tín hiệu do bộ xét ghi lấy tên theo mã yêu cầu của đợt (`<dãy>-<số>`), nên đụng nhau giữa các đợt: từ đợt thứ hai trở đi, ý không chặn lại đánh thức giám sát (r1 · tệp đã đổi)**
  Người dùng thấy gì: Từ đợt thứ hai của cùng một kho, nhiều ý mới không chặn vẫn bị đẩy về cho giám sát phán như cũ, vì tên tệp của ý trùng với ý đợt trước chưa gom. Tức là tính năng «ý mới không đánh thức giám sát» chỉ chạy tốt ở đợt đầu.
  Căn cứ: Hậu quả nặng với mục đích chính của tính năng nhưng không mất ý nào (ý vẫn được giữ lại và đẩy về cho người phán), người dùng tự xử được, và sửa cần đổi cách đặt tên nên nên làm thành một việc riêng.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: high
  Đề xuất: new-contract

- **Dòng nhắc «Cửa tín hiệu: N ý chờ gom» chỉ hiện khi kho khai cả lộ trình; kho chỉ khai cửa thì không bao giờ thấy lời nhắc mà lệnh gửi hứa (r1 · tệp đã đổi)**
  Người dùng thấy gì: Kho chỉ bật cửa tín hiệu mà không khai lộ trình sẽ không thấy lời nhắc «còn N ý chờ gom» khi mở phiên, dù vẫn gửi ý được. Ý vẫn nằm trong kho nhưng có thể bị quên gom.
  Căn cứ: Hậu quả nhẹ vì không mất dữ liệu và ý vẫn gom được thủ công, chỉ thiếu lời nhắc cho kho cấu hình theo kiểu ít gặp; ghi giới hạn là đủ.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai ý khác nhau mà không có tieu_de bị gộp làm một trong im lặng và không bao giờ vào cửa tín hiệu (hang-moi theo khuôn cau_giao bị mất) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai ý mới khác nhau nhưng đều không có tiêu đề (như việc mới theo khuôn chuẩn) bị coi là một và ý thứ hai biến mất mà không báo lỗi. Người gửi chỉ nhận câu «trùng yêu cầu» sai.
  Căn cứ: Mất ý thật một cách im lặng nên hậu quả khá nặng, và người dùng không tự phát hiện được; nhưng chỉ xảy ra khi hai ý đến sát nhau trong 24 giờ và sửa rẻ nên nên làm sớm bằng việc riêng.
  file: `dieu-phoi/scripts/yeu-cau.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 (âm-tính-một-mình, thiếu đối chứng dương): CT-6-do được truyền lanhOk = true cứng thay vì kết quả của ca lành CT-6 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một ca kiểm tra nội bộ có thể báo xanh khi chạy riêng lẻ dù bản lành đã lệch. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng độ tin của một phép đo khi chạy lẻ, chạy đủ bộ thì vẫn được che, và không đụng tới sản phẩm người dùng nên chấp nhận.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm-tính-một-mình, không ghim thông điệp): CT-7-rong chỉ kiểm mã thoát 2 và việc không có tệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một ca kiểm tra nội bộ cho lệnh gửi ý không phân biệt được lý do từ chối khi gửi câu rỗng. Người dùng cuối không thấy khác biệt.
  Căn cứ: Chỉ làm phép đo lỏng hơn một chút, không ảnh hưởng người dùng và không mất dữ liệu nên không đáng mở việc.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
