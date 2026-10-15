## Trong hợp đồng

- **Tự áp xoá nhầm hàng cuối của kế hoạch khi hàng cần áp không còn trong `hang` (thiếu kiểm idx < 0)**
  file:line: `scripts/lo-trinh.mjs:1144`
  severity: high
  AC: AC-3
  source: bugs
  detail: apMot tìm vị trí hàng bằng `findIndex(... chuoi(h.ma) === ma)` rồi gọi thẳng `data.hang.splice(idx, 1)` và `data[khoi].push(mucMay(hangGoc, ...))`, không kiểm idx. Khi idx = -1, `splice(-1, 1)` xoá HÀNG CUỐI của kế hoạch (một hàng khác hẳn), còn mục chờ điều kiện/đã bác được thêm là `{ly_do, mo_lai_khi, tu_ap}`, không có mã cũng không có câu giao. Lệnh thoát 0 và sổ không ghi gì về hàng bị mất.

  Có hai đường gây lỗi, cả hai đã chạy lại được bằng CLI trên kho thử:
  (1) Nhánh khôi phục khi đứt giữa chừng (dòng 1196). Sổ có dòng `ap` hôm nay, nhưng chủ kho đã xoá tay mục máy vừa chuyển vào chan_troi trong cùng ngày, nên conHieuLuc trả false và apMot chạy lại trên một hàng không còn trong `hang`. Kho thử: hang [A,B,C], tran_ke_tiep 0, tran_ap 1. Ngày 14 chạy `--ap --write` (báo trước), ngày 15 áp A. Xoá tay chan_troi rồi chạy lại `--ap --write` cùng ngày: hàng C biến mất, chan_troi có một mục không mã, thoát 0.
  (2) Hàng thiếu `ma` có nhãn `#N`. Luật trần đề xuất được `#N`, nhưng findIndex không bao giờ khớp. Kho thử: hang [B, {cau_giao}, C], tran_ke_tiep 0. Sang ngày áp, hàng C bị xoá và chan_troi có hai mục rỗng mã.

  Nhánh khôi phục còn một hệ quả nữa: nếu chủ kho tự đưa hàng về `hang` trong cùng ngày, máy áp lại mà không ghi dòng sổ mới, tức là đè quyết định tay của người.

  Cách sửa: khi idx < 0, apMot phải từ chối (bỏ qua và cảnh báo), không được splice. Nhánh khôi phục cần phân biệt «tệp chưa ghi» với «người đã sửa sau khi ghi».
  rationale: AC-3 (và AC-11) khẳng định tập mã trên hợp ba khối không đổi sau khi áp; finding cho thấy một hàng khác biến mất mà lệnh vẫn báo thành công.

- **Hình dạng 5 (ma trận khai trước không khớp số ca): E5 ghim dòng «PASS: AP-5-gop» mà tệp ca không có ca nào in dòng đó**
  file:line: `_acceptance/ap-chinh-sach-lo-trinh/evals.yaml:87`
  severity: high
  AC: AC-5
  source: measurement
  detail: E5 (AC-5) có `expected: exit 0; stdout có "PASS: AP-5", "PASS: AP-5-gop", "PASS: AP-5-dut", "PASS: AP-5-do"` và mô tả «AP-5-gop: `git merge` nhánh này vào nhánh kia thoát 0». Trong tests/scripts/ap-chinh-sach-lo-trinh.test.mjs không có `want('AP-5-gop')` hay `ok('AP-5-gop', …)` nào, kể cả dạng sinh động (grep chỉ ra chữ «gop» ở dòng 651, là tiêu đề commit). Phép gộp đang nằm lẫn trong ca AP-5 (dòng 371–373, `git merge --no-edit FETCH_HEAD`). Ca không phải khác tên, mà dòng đó không có thật. Tôi đối chiếu cả hai chiều: mọi id còn lại mà evals ghim đều có trong tệp ca (AP-11 nằm ở tệp crm), chỉ AP-5-gop thiếu. Theo luật chính evals.yaml tự khai («lệnh xanh mà thiếu dòng ghim là ĐỎ»), E5 sẽ đỏ dù vật đúng. Ngược lại, nếu bộ chấm đọc lỏng thì danh sách ca khai trước (4 dòng) không còn bằng số ca thật chạy (3 dòng), nên một vế của AC-5 có tên riêng mà không có ca riêng để đỏ. Kế hoạch (docs/superpowers/plans/2026-10-15-ap-chinh-sach-lo-trinh.md:239) cũng khai `AP-5-gop` là một ca riêng.
  rationale: Bộ chấm của AC-5 đòi một dòng xác nhận không ca nào in ra, nên tiêu chí này đỏ dù hành vi gộp nhánh đúng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mở việc tự áp và GHI tệp lộ trình cùng sổ trước khi kiểm hợp lệ; thoát 2 để lại thay đổi chưa commit, lần sau mất khoá «ap» nên mất commit riêng của máy**
  Người dùng thấy gì: Khi mở việc mới bị từ chối (ví dụ thư mục đã tồn tại), máy vẫn có thể đã dời hàng trong lộ trình rồi. Thay đổi đó nằm lại chưa commit, lần mở sau có thể không còn được tách thành commit riêng của máy.
  Căn cứ: Chỉ xảy ra khi mở việc bị từ chối đúng lúc máy vừa tự dời hàng; không mất dữ liệu, chủ kho thấy thay đổi trong cây làm việc và tự commit hoặc hoàn tác được.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bất biến «Kit không bao giờ ghi vào tệp ý định» vẫn nằm trong đầu mô-đun và trong hai SKILL, trái với bộ ghi mới**
  Người dùng thấy gì: Hướng dẫn mà phiên Claude đọc lúc mở việc vừa nói kit không ghi gì vào lộ trình, vừa nói máy sẽ tự dời hàng và commit riêng tệp lộ trình. Hai chỉ dẫn trái nhau có thể khiến phiên làm sai hoặc bối rối.
  Căn cứ: Chỉ là chữ lỗi thời trong tài liệu hướng dẫn, hành vi thật vẫn đúng; sửa rẻ và không ai mất dữ liệu, nhưng nên ghi lại để dọn ở mốc sau.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Lệnh trả lại / ghim chọn bộ ghi khác với bộ tự áp: kho có bản chép cũ (crm) thì đường đảo hỏng trong khi máy vẫn tự áp**
  Người dùng thấy gì: Ở kho còn giữ bản chép mã cũ, máy vẫn tự dời hàng nhưng lệnh trả lại hàng báo lỗi tham số lạ. Chủ kho không đảo được việc máy vừa làm bằng một lệnh cho tới khi kho cập nhật bản chép.
  Căn cứ: Đường đảo bị gãy chỉ ở kho chưa cập nhật bản chép; không mất dữ liệu vì chủ kho vẫn sửa tay được, và cập nhật bản chép là khắc phục.
  file: `road-map/commands/tra-lai.md`
  severity: medium
  Đề xuất: known-limits

- **Mẫu chặn chèn shell của ba lệnh road-map được chép tay, không đi qua khối marker một nguồn S0-MA-HANG-RE**
  Người dùng thấy gì: Ba lệnh ghim, bỏ ghim, trả lại mỗi lệnh giữ một bản chép riêng của quy tắc lọc đối số người gõ. Nếu quy tắc gốc đổi sau này, ba bản chép có thể lệch mà không ai hay.
  Căn cứ: Hôm nay ba bản vẫn khớp bản gốc nên người dùng chưa gặp gì; rủi ro chỉ xuất hiện khi quy tắc gốc đổi, và sửa lúc đó vẫn rẻ.
  file: `road-map/commands/ghim.md`
  severity: low
  Đề xuất: known-limits

- **Tự áp trên tệp có BOM làm sập thẻ khởi động, `--xem` và `--ap` (không --write) bằng stack trace**
  Người dùng thấy gì: Nếu tệp lộ trình có dấu BOM đầu tệp và kho bật tự áp, thẻ khởi động phiên và lệnh xem bản đồ có thể vỡ bằng một đống thông báo lỗi thay vì chạy bình thường. Trước thay đổi này, tệp như vậy vẫn đọc được.
  Căn cứ: Chỉ ảnh hưởng kho có tệp lộ trình mang BOM, hiếm; không mất dữ liệu và người dùng tự khắc phục được bằng cách bỏ BOM, nhưng nó làm hỏng lúc khởi động phiên nên nên sớm sửa.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Máy tự áp «xếp lại»/«đã bác» theo hồ sơ tự sinh cờ «hồ sơ X ghi lo_trinh_ma A — không có hàng A» trên kế hoạch**
  Người dùng thấy gì: Mỗi lần máy tự đưa một hàng đã có hồ sơ sang mục chờ hoặc đã bác, kế hoạch lại hiện một cờ lỗi giả báo hồ sơ trỏ tới hàng không tồn tại. Chủ kho phải mất công xem cờ đó dù không có gì sai.
  Căn cứ: Cờ giả lặp lại ở mọi kho dùng lối mở việc có hồ sơ, làm người dùng mất niềm tin vào cờ lỗi; không mất dữ liệu nhưng sửa cần đổi cách bộ đọc nối hồ sơ nên đáng một việc riêng.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Thước nền do-nen bỏ im lặng commit có JSON hỏng và đếm commit kế tiếp thành «tạo tệp»**
  Người dùng thấy gì: Khi lịch sử có một commit với tệp lộ trình hỏng, số đo trước/sau của vòng này sẽ lệch lặng lẽ mà không có cảnh báo. Con số báo cho chủ kho có thể không phản ánh đúng thực tế.
  Căn cứ: Chỉ làm lệch một con số đo nền trong tình huống tệp từng hỏng, hiếm; không ảnh hưởng dữ liệu hay hành vi sản phẩm.
  file: `_acceptance/ap-chinh-sach-lo-trinh/nen/do-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): AP-1-sai-kieu kết luận «không sổ, tệp không đổi» mà không có đối chứng dương trên cùng kho**
  Người dùng thấy gì: Bài kiểm cho trường hợp khai chính sách sai kiểu chỉ chứng minh máy không ghi gì, chưa chứng minh cùng kho khai đúng thì máy có ghi. Nếu máy vốn không báo trước ngày đó thì bài vẫn xanh mà không bắt được gì.
  Căn cứ: Hành vi sản phẩm vẫn đúng, chỉ là bài kiểm có thể xanh vì lý do sai; không ảnh hưởng người dùng trực tiếp và thêm đối chứng sau này rẻ.
  file: `tests/scripts/ap-chinh-sach-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): RS-3-chua-commit chỉ đòi «0 đề xuất tuổi», không đối chứng dương, không ghim thông điệp**
  Người dùng thấy gì: Bài kiểm cho tệp lộ trình chưa commit chỉ xác nhận không có đề xuất theo tuổi, không xác nhận lý do hay lời cảnh báo. Nếu luật tuổi hỏng hoàn toàn, bài vẫn xanh.
  Căn cứ: Lời cảnh báo cho người dùng đã được kiểm ở chỗ khác nên rủi ro thật rất nhỏ; đây chỉ là bài kiểm lỏng, không gây mất dữ liệu.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ap-chinh-sach-lo-trinh/evals.yaml, tests/scripts/ra-soat-lo-trinh.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
