## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dòng PASS của GM-1-doc-cu vẫn nói khối «giống từng byte», trong khi phép đo giờ đã gỡ bốn khoá trước khi so**
  Người dùng thấy gì: Báo cáo kiểm thử ghi trang người xem «giống từng byte» bản cũ, trong khi thật ra đã bỏ bốn mục giờ máy mới trước khi so. Người đọc báo cáo có thể hiểu quá mức điều đã được kiểm, nhưng trang hiển thị cho người dùng không đổi.
  Căn cứ: Chỉ là câu chữ trong báo cáo kiểm thử nói hơi quá, không ảnh hưởng người dùng cuối, không mất dữ liệu, và sửa sau rất rẻ.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Tài liệu vẫn nói bộ đọc «làm đúng sáu ca», nhưng bảng «Đọc khoan dung» nay có tám dòng**
  Người dùng thấy gì: Tài liệu hướng dẫn kho dùng kit vẫn nói bộ đọc xử lý «sáu ca» trong khi bảng đã có tám dòng. Người chép bộ đọc về kho mình có thể đếm sai số ca cần kiểm.
  Căn cứ: Chỉ làm người đọc tài liệu đếm lệch một con số; không gây hỏng trang hay mất dữ liệu, lệch này đã có từ trước vòng này, và sửa chữ rất rẻ.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **Tài liệu nói ngày tính dự báo là lúc việc ĐẦU TIÊN của mốc được mở, nhưng mã lấy dự báo sớm nhất trong số dự báo đang có**
  Người dùng thấy gì: Tài liệu mô tả ngày tính dự báo của mốc là lúc việc đầu tiên được mở, nhưng với mốc có hồ sơ cũ chưa có dự báo thì thực tế lấy dự báo của hồ sơ mở sau. Kho dùng kit có thể hiểu sai nghĩa của ngày này khi hiển thị.
  Căn cứ: Chỉ xảy ra ở mốc lai (có việc mở trước và sau bản kit mới), kho dùng kit vẫn nhận đúng ngày, chỉ lời giải thích hơi lệch; sửa chữ trong tài liệu rất rẻ.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture du-bao.json viết tay theo khuôn bên đọc, không đi qua bên viết (--mo-o / GM.duBaoHoSo)**
  Người dùng thấy gì: Các phép kiểm về ngày dự kiến dùng tệp dự báo dựng tay chứ không do chính lệnh tạo hồ sơ sinh ra. Nếu sau này lệnh tạo hồ sơ đổi cách ghi dự báo mà ca kiểm không đổi theo thì ngày dự kiến trên trang có thể sai mà bộ kiểm vẫn xanh.
  Căn cứ: Rủi ro chỉ hiện ra khi có người đổi cách ghi dự báo sau này, lúc đó người dùng sẽ thấy ngày dự kiến thiếu hoặc sai nhưng tải lại trang không tự hết; sửa sau tốn vừa phải nên ghi giới hạn và theo dõi.
  file: `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — ND-5-check kết luận «--check không lệch» chỉ từ exit 0: không ghim thông điệp, không có chiều đỏ**
  Người dùng thấy gì: Phép kiểm «trang đã lưu không bị báo lệch» chỉ nhìn vào việc lệnh kết thúc êm, không xác nhận lệnh đã thật sự so trang. Nếu lệnh bỏ qua bước so thì kết quả vẫn trông như «khớp».
  Căn cứ: Hậu quả chỉ là bộ kiểm có thể xanh giả ở một đường phụ, người dùng không thấy gì ngay; các ca khác của vòng vẫn bắt lỗi khối đổi theo ngày, và có thể bổ sung sau với chi phí thấp.
  file: `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên ma trận toàn phần «khối == trang» cho MỌI kho thử AC-1…AC-5, nhưng các ca ND-5 không chạy ma trận**
  Người dùng thấy gì: Lời tuyên trong hồ sơ nói mọi kho thử đều được so khối với trang, nhưng hai ca về ngày khác và về lệnh kiểm không chạy phép so đó. Một lệch giữa khối và trang ở riêng hai trường hợp này sẽ không bị bắt.
  Căn cứ: Phạm vi bị bỏ sót hẹp (một lần vẽ ngày khác và một kho nhỏ), người dùng chỉ bị ảnh hưởng nếu khối lệch trang đúng ở đó, và thêm lời gọi so sau này rẻ.
  file: `_acceptance/lo-trinh-du-lieu-ngay-du-kien/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hai bộ ghi vào cùng cửa tín hiệu lại ghi vào hai gốc khác nhau: bộ xét của đợt ghi vào kho chính, lệnh /road-map:gui ghi vào worktree (r1)**
  Người dùng thấy gì: Khi người dùng gửi một ý từ phiên làm việc riêng (cách kit thường chạy), ý đó nằm ở chỗ phiên khác không thấy. Xoá phiên là mất ý mà không có lời báo, dù lệnh đã nói «đã ghi».
  Căn cứ: Hậu quả nặng vì mất ý của người dùng trong im lặng ở đúng trường hợp hay gặp nhất, người dùng không tự phát hiện hay lấy lại được, và sửa là một việc riêng chứ không nằm trong vòng này.
  file: `scripts/gui-tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Bản chép tieuDeCua trong yeu-cau.mjs không có ca so với bản gốc, trái tiền lệ bản chép khoaTinHieu được CT-6 canh (r1)**
  Người dùng thấy gì: Nếu sau này cách nhận ra «hai ý cùng tiêu đề» đổi ở một nơi mà không đổi ở nơi kia, các ý trùng có thể bị gộp hoặc gom khác nhau mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hiện chưa có gì sai với người dùng, chỉ là một lưới canh còn thiếu cho thay đổi tương lai, và có thể ghi lại làm hạn chế đã biết rồi sửa khi chạm vùng này.
  file: `dieu-phoi/scripts/yeu-cau.mjs`
  severity: medium
  Đề xuất: known-limits

- **CT-6-do bỏ qua đối chứng dương: chiều đỏ được tin mà không cần bản lành xanh (r1)**
  Người dùng thấy gì: Một dòng báo «đạt» của bộ kiểm cửa tín hiệu có thể hiện ra dù bản nguyên vẹn đang đỏ, nên màu xanh đó chứng được ít hơn vẻ ngoài của nó.
  Căn cứ: Nhẹ vì bộ kiểm tổng vẫn đỏ nếu bản nguyên vẹn hỏng, người dùng không bị ảnh hưởng, chỉ lo khuôn này bị chép sang chỗ khác.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **CT-7-rong chỉ kiểm mã thoát 2, không kiểm thông điệp (r1)**
  Người dùng thấy gì: Nếu lệnh gửi ý từ chối câu rỗng vì một lý do khác lý do đúng, bộ kiểm vẫn xanh và hướng dẫn «hỏi lại đúng một câu» có thể dẫn người dùng sai.
  Căn cứ: Nhẹ vì chỉ là một phép kiểm lỏng, hỏng thật thì người dùng chỉ thấy một lần hỏi lại và tự thử lại được.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đợt ghi ý vào cửa ở checkout chính, còn thẻ khởi động, bộ gom và lệnh gửi lại đọc và ghi theo cây hiện tại, nên ở phiên worktree các ý biến mất mà không báo (r1)**
  Người dùng thấy gì: Ở phiên làm việc riêng, thẻ mở phiên không hiện số ý đang chờ gom, phiên gom không thấy các ý đó, và ý có thể mất khi xoá phiên mà không có lời báo.
  Căn cứ: Hậu quả nặng vì ý của người dùng biến mất im lặng và họ không tự phát hiện được, nhưng sửa thuộc một tính năng khác nên nên mở việc riêng cùng với lỗi trùng gốc trên.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 (assertion âm-tính-một-mình): CT-3 kiểm `--rang` chỉ bằng «không có dòng sai khuôn», không kiểm lệnh đã chạy (r1)**
  Người dùng thấy gì: Bộ kiểm có thể báo xanh về việc các tín hiệu đúng khuôn trong khi lệnh kiểm chưa hề chạy, nên màu xanh đó chưa đáng tin hoàn toàn.
  Căn cứ: Nhẹ với người dùng vì không có hành vi sản phẩm nào sai, chỉ là một lưới kiểm lỏng, và vá sau rẻ khi chạm bộ kiểm này.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, chỉ ghim mã thoát): CT-7-rong chỉ đòi `status === 2`, không ghim thông điệp (r1)**
  Người dùng thấy gì: Việc từ chối câu rỗng khi gửi ý có thể hỏng mà bộ kiểm vẫn xanh vì lệnh bị từ chối bởi một lý do khác.
  Căn cứ: Nhẹ vì lỗi nếu có chỉ làm người dùng phải gửi lại câu, không mất dữ liệu, và có thể gộp sửa cùng finding trùng ý.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương): CT-6-do truyền `lanhOk = true` cứng, không buộc vào kết quả bản lành CT-6 (r1)**
  Người dùng thấy gì: Dòng báo đạt của một ca kiểm cửa tín hiệu không còn chứng được rằng bản nguyên vẹn đã xanh trước đó.
  Căn cứ: Nhẹ vì bộ kiểm tổng vẫn đỏ khi bản nguyên vẹn hỏng và người dùng không bị ảnh hưởng, chỉ là nguy cơ khuôn này bị chép tiếp.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (đối chứng dương không chứng được nền khác vật): ND-1-trang-giu và ND-7 tự động xanh rỗng khi merge-base trùng HEAD (r1)**
  Người dùng thấy gì: Sau khi vòng đã gộp, hai phép kiểm «trang người nhìn giữ nguyên» và «chỉ thêm» tự so một thứ với chính nó nên vẫn báo đạt mà không đo gì thật.
  Căn cứ: Hôm nay chưa xảy ra vì nền còn khác bản hiện tại, và khi xảy ra thì dòng báo có tự khai, nên chỉ cần ghi là giới hạn đo lường đã biết thay vì dựng thêm thước.
  file: `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/lo-trinh-gio-may.test.mjs, _acceptance/lo-trinh-du-lieu-ngay-du-kien/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
