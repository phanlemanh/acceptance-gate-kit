## Trong hợp đồng

- **Hình dạng 3 (chuỗi có mặt thay vì quan hệ): KL-4 kiểm «đường gốc» trên dòng cay-phu mà không bao giờ đỏ được**
  AC: AC-4
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs:279`
  severity: medium
  detail: Assert `[s.l.includes(phu) && s.l.includes(k4), 'dòng cay-phu thiếu đường …']` muốn chứng vế AC-4 «dòng VÀNG cay-phu gọi tên đường cây phụ VÀ đường gốc». Nhưng dungKho (dòng 91) đặt cây phụ ở `path.join(path.dirname(kho), `${path.basename(kho)}-phu`)`, nên đường gốc k4 luôn là chuỗi con của đường cây phụ phu. Hễ dòng có `phu` thì `includes(k4)` tự đúng. Lệnh mà bỏ hẳn vế «(cây phụ của <gốc>)» (scripts/kiem-ban-cai.mjs, dòng dựng biến `dau`) hay in sai gốc thì KL-4 vẫn xanh. Lời hứa ở đây là một quan hệ: dòng phải nói đúng gốc của cây phụ này. Phép kiểm chuỗi con trên hai đường lồng nhau không bắt được quan hệ đó. Cách kiểm đúng: so phần sau «cây phụ của » với k4, hoặc đặt cây phụ ở một đường không chứa đường gốc.
  source: measurement
  rationale: AC-4 đòi dòng cay-phu gọi tên cả đường cây phụ và đường gốc, mà phép kiểm của vế đường gốc không thể đỏ nên vế này của AC-4 không được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cây phụ của một gói không còn trong chợ tại ref được bảo «nâng bản ghi gốc trước», lời khuyên không bao giờ làm được và câu «gói không có trong chợ tại ref» bị nuốt mất**
  Người dùng thấy gì: Khi một gói đã bị gỡ hoặc đổi tên khỏi chợ, bản kiểm vẫn khuyên người dùng nâng bản ghi gốc rồi chạy lại. Việc đó không bao giờ làm được, và câu nói thẳng rằng gói không còn trong chợ không hiện ra.
  Căn cứ: Hậu quả nhẹ: chỉ là một lời khuyên sai trong một ca hiếm (gói đã gỡ), không mất dữ liệu và không làm sổ cài hỏng, người dùng vẫn tự nhận ra gói không còn và bỏ qua được.
  file: `scripts/kiem-ban-cai.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn/hằng của chính ca thay vì đầu ra): KL-2b-mau so BA_MAU với bản chép của chính nó, và BA_MAU không ca nào dùng**
  Người dùng thấy gì: Một dòng báo xanh trong bộ kiểm chỉ so một danh sách với bản chép của chính nó nên luôn xanh. Người dùng không bị ảnh hưởng gì, chỉ là bộ kiểm trông chắc hơn thực tế ở chỗ này.
  Căn cứ: Hậu quả gần như bằng không với người dùng vì hành vi của lệnh không đổi; chỉ làm một dòng xanh trong bộ kiểm kém ý nghĩa, và sửa sau rẻ.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên lớp, chỉ có điểm-case): «hằng bị nới rộng phải làm ca đỏ» chỉ phủ các vùng có tệp mẫu**
  Người dùng thấy gì: Nếu có người sau này vô tình nới danh sách tệp được coi là không chạy sang một số thư mục mã khác, bộ kiểm hiện tại sẽ không báo đỏ. Khi đó lệch ở các thư mục ấy có thể bị hạ thành cảnh báo vàng thay vì lỗi đỏ.
  Căn cứ: Rủi ro chỉ xảy ra nếu có người sửa nhầm danh sách trong tương lai, chưa ảnh hưởng người dùng hôm nay; sửa sau rẻ bằng một bộ ca theo từng vùng mã.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: đường «tính từ gốc kho» (tuGocKho) chưa được đo với gói con, chỉ đo gói gốc '.'**
  Người dùng thấy gì: Với các gói con nằm trong thư mục riêng, chưa có phép kiểm nào chứng minh tài liệu bên trong chúng được coi là không chạy đúng cách. Nếu cách tính đường sai, lệch ở gói con có thể bị báo đỏ hoặc vàng sai.
  Căn cứ: Chưa có bằng chứng lỗi thật, chỉ là chỗ chưa được đo; nếu sai thì hậu quả là một cảnh báo màu sai chứ không mất dữ liệu, và người dùng chạy lại hay đọc thêm là biết.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): phán quyết mutant không ghim thông điệp và không xác nhận bản tiêm đã chạy**
  Người dùng thấy gì: Khi bộ kiểm thử bắt lỗi bằng cách cố ý tiêm lỗi, nó có thể báo đỏ vì bản tiêm bị sập chứ không phải vì thật sự bắt đúng lỗi. Người dùng cuối không thấy ảnh hưởng, nhưng độ tin cậy của màu đỏ ở đó thấp hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng lệnh người dùng chạy; chỉ làm chiều đỏ của bộ kiểm kém chắc, và thêm kiểm mã thoát cùng thông điệp là sửa nhỏ, rẻ làm sau.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Bản vá lỗi dọn thư mục tạm (ENOTEMPTY) chỉ sửa chỗ bị nêu tên, chưa sửa theo lớp: cùng file còn một lệnh xoá cùng hình dạng chưa có thử lại (r2)**
  Người dùng thấy gì: Bộ ca kiểm bản cài còn một chỗ dọn dẹp cuối lượt chưa được làm bền như chỗ vừa vá. Nếu máy chạy chậm tay, lượt chạy thử có thể thỉnh thoảng đỏ oan dù bản cài vẫn đúng.
  Căn cứ: Hậu quả nhẹ: chỉ làm bộ thử đỏ oan thỉnh thoảng, không mất dữ liệu, chạy lại là qua, và chưa ai đo được nguyên nhân thật nên chưa đáng mở việc riêng.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bản vá chỉ che cuộc đua dọn thư mục ở hai bộ ca; chính công cụ đang giao vẫn dọn thư mục cấu hình claude tạm của nó mà không thử lại (r2)**
  Người dùng thấy gì: Khi người dùng chạy lệnh kiểm bản cài, nếu bước dọn dẹp cuối cùng gặp trục trặc thì lệnh có thể báo lỗi dù kết luận in ra là ĐẠT. Người dùng sẽ thấy kết quả mâu thuẫn nhưng bản cài của họ vẫn nguyên vẹn.
  Căn cứ: Hậu quả nhẹ và tự gỡ được: không mất dữ liệu, chạy lại lệnh kiểm là có kết quả sạch, và chưa có số đo nào chứng minh tình huống này xảy ra ngoài bộ thử.
  file: `scripts/kiem-ban-cai.mjs`
  severity: medium
  Đề xuất: known-limits

- **Mutant cases KL-4-dot and KL-7-dot count any missing backup as caught, so a mutant that crashes also passes (r1)**
  Người dùng thấy gì: Bộ kiểm tra việc sao lưu trước khi sửa sổ cài có thể báo đã bắt được lỗi trong khi thực ra bản thử bị hỏng và chưa từng chạy. Người dùng không thấy gì khác đi ở lệnh kiểm, chỉ là một lớp bảo hiểm của bộ kiểm yếu hơn mong muốn.
  Căn cứ: Không ảnh hưởng người dùng, không mất dữ liệu; chỉ làm bộ kiểm kém nhạy trong một tình huống hiếm, và luật chiều rộng đang đóng băng việc đo lại thước của thước.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KL-2b-dot is not gated on KL-2b and does not pin the error, so any failure turns it green (r1)**
  Người dùng thấy gì: Phép thử chứng minh bộ lọc tệp không chạy bị nới rộng sẽ bị bắt có thể báo xanh vì một lý do khác (lệnh hỏng) thay vì đúng lý do. Người dùng không bị ảnh hưởng trực tiếp.
  Căn cứ: Chỉ làm bộ kiểm có thể xanh nhầm trong trường hợp lệnh thật đã hỏng, mà khi đó ca chính đã đỏ nên người ký vẫn thấy; không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KL-2b-mau compares a constant in the test file with a literal in the same file and can never fail (r1)**
  Người dùng thấy gì: Có một dòng kiểm trong bộ kiểm luôn xanh, tạo cảm giác được bảo vệ hơn thực tế. Người dùng cuối không thấy khác biệt.
  Căn cứ: Hậu quả chỉ là một dòng xanh thừa, bảo vệ thật đã nằm ở các ca khác; sửa không đổi gì cho người dùng.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Header comment names the case prefix LS-, but the file prints KL- (r1)**
  Người dùng thấy gì: Một dòng ghi chú trong bộ kiểm gọi nhầm tên nhóm ca, người đọc tìm theo đó sẽ tìm không ra. Không ảnh hưởng người dùng.
  Căn cứ: Nhầm lẫn nhỏ chỉ ở lời ghi chú, người đọc tự phát hiện ngay, không mất dữ liệu và không đổi hành vi nào.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Mutant cases count any failure as red: they don't pin the expected message and ignore the apply exit code (r1)**
  Người dùng thấy gì: Các ca thử bản sao bị tiêm lỗi chấp nhận mọi kiểu thất bại là đã bắt được lỗi, kể cả khi bản thử chỉ chết giữa chừng. Người dùng không thấy khác biệt.
  Căn cứ: Chỉ yếu ở độ chặt của bộ kiểm trong tình huống hiếm, không gây mất dữ liệu cho người dùng; tất cả ca hiện đều xanh.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «hằng bị nới rộng phải làm ca đỏ» (cả lớp) mà chỉ có ba điểm-case; KL-2b-mau là phép so hằng với chính nó (r1)**
  Người dùng thấy gì: Nếu có người nới danh sách tệp được coi là không chạy sang cả thư mục mã thật khác, lệnh kiểm có thể hạ lệch mã thật từ đỏ xuống vàng mà bộ kiểm vẫn xanh. Khi đó người dùng có thể chấp nhận một bản cài lệch mã mà không được cảnh báo.
  Căn cứ: Hậu quả chỉ xảy ra nếu chính người sửa kit nới danh sách nhầm, hiếm và tự đảo được; ghi vào giới hạn đã biết với ngưỡng đang đếm là đủ, không mở thêm vòng đo thước.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — KL-5 chỉ kiểm âm tính «không có ‹cài lại ở› kể cây phụ», không có đối chứng dương cho chuỗi đó (r1)**
  Người dùng thấy gì: Nếu chữ nhắc cài lại trong cảnh báo được đổi tên, phép kiểm không để cây phụ lọt vào danh sách cài lại sẽ xanh vô nghĩa, và lỗi cũ có thể quay lại mà không ai biết. Người dùng khi đó lại bị chỉ sai chỗ cài lại.
  Căn cứ: Chỉ xảy ra khi có người đổi chữ nhãn mà không đổi bộ kiểm, và hậu quả là một lời khuyên sai tự đảo được bằng cách chạy lại; không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — đường đổi «tính từ gốc kho» (tuGocKho, khi nguồn gói khác '.') không có ca nào; ca tên feature-loop/LO-TRINH.html đo nhầm đường mã (r1)**
  Người dùng thấy gì: Khi một gói cài có nguồn không nằm ở gốc kho, bộ kiểm chưa có ca nào chứng minh cách tính đường tệp từ gốc kho còn đúng. Nếu cách tính đó hỏng, một tệp mã có thể bị coi nhầm là tệp không chạy và chỉ ra cảnh báo vàng thay vì đỏ, mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả chỉ xảy ra ở một hình dạng gói hiếm, bộ kiểm hiện tại đã phủ các ca tên giống mẫu, và nếu sai thì người dùng vẫn thấy cảnh báo vàng nêu tên tệp nên không mất dữ liệu và dễ phát hiện lại.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — KL-1/KL-2 kiểm «tên có mặt ở đâu đó trong dòng» trong khi lời hứa là quan hệ (tên nằm ở vế tệp không chạy lệch) (r1)**
  Người dùng thấy gì: Cảnh báo vàng có thể gọi tên tệp ở một vế khác với vế người đọc mong đợi mà bộ kiểm vẫn xanh. Người dùng vẫn thấy đủ tên tệp, chỉ khác chỗ xuất hiện.
  Căn cứ: Nhẹ: người dùng vẫn thấy đủ tên tệp lệch trong cùng một dòng, không mất dữ liệu, chỉ là cách phân nhóm trên dòng có thể chưa đúng ý.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — sổ cài và bản ghi cây phụ là fixture viết tay đúng khuôn bên đọc, không đi vòng qua bên ghi thật (r1)**
  Người dùng thấy gì: Sổ cài dùng để thử là bản tự dựng, nên nếu sổ thật của công cụ ghi bản ghi cây phụ khác đi, lệnh kiểm và lối sửa có thể sai trên máy thật mà bộ kiểm vẫn xanh. Người dùng khi đó sẽ thấy lời khuyên không chạy được.
  Căn cứ: Sổ cài thật đã được thử ở bộ ca khác và lần nhận kit kế tiếp là phép đo thật; nếu sai thì người dùng chỉ phải sửa tay và lệnh có sao lưu nên không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
