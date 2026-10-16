# Review findings: lo-trinh-du-lieu-ngay-du-kien (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hai bộ ghi vào cùng cửa tín hiệu lại ghi vào hai gốc khác nhau: bộ xét của đợt ghi vào kho chính, lệnh /road-map:gui ghi vào worktree**
  Người dùng thấy gì: Khi người dùng gửi một ý từ phiên làm việc riêng (cách kit thường chạy), ý đó nằm ở chỗ phiên khác không thấy. Xoá phiên là mất ý mà không có lời báo, dù lệnh đã nói «đã ghi».
  Căn cứ: Hậu quả nặng vì mất ý của người dùng trong im lặng ở đúng trường hợp hay gặp nhất, người dùng không tự phát hiện hay lấy lại được, và sửa là một việc riêng chứ không nằm trong vòng này.
  file: `scripts/gui-tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Bản chép tieuDeCua trong yeu-cau.mjs không có ca so với bản gốc, trái tiền lệ bản chép khoaTinHieu được CT-6 canh**
  Người dùng thấy gì: Nếu sau này cách nhận ra «hai ý cùng tiêu đề» đổi ở một nơi mà không đổi ở nơi kia, các ý trùng có thể bị gộp hoặc gom khác nhau mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hiện chưa có gì sai với người dùng, chỉ là một lưới canh còn thiếu cho thay đổi tương lai, và có thể ghi lại làm hạn chế đã biết rồi sửa khi chạm vùng này.
  file: `dieu-phoi/scripts/yeu-cau.mjs`
  severity: medium
  Đề xuất: known-limits

- **CT-6-do bỏ qua đối chứng dương: chiều đỏ được tin mà không cần bản lành xanh**
  Người dùng thấy gì: Một dòng báo «đạt» của bộ kiểm cửa tín hiệu có thể hiện ra dù bản nguyên vẹn đang đỏ, nên màu xanh đó chứng được ít hơn vẻ ngoài của nó.
  Căn cứ: Nhẹ vì bộ kiểm tổng vẫn đỏ nếu bản nguyên vẹn hỏng, người dùng không bị ảnh hưởng, chỉ lo khuôn này bị chép sang chỗ khác.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **CT-7-rong chỉ kiểm mã thoát 2, không kiểm thông điệp**
  Người dùng thấy gì: Nếu lệnh gửi ý từ chối câu rỗng vì một lý do khác lý do đúng, bộ kiểm vẫn xanh và hướng dẫn «hỏi lại đúng một câu» có thể dẫn người dùng sai.
  Căn cứ: Nhẹ vì chỉ là một phép kiểm lỏng, hỏng thật thì người dùng chỉ thấy một lần hỏi lại và tự thử lại được.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đợt ghi ý vào cửa ở checkout chính, còn thẻ khởi động, bộ gom và lệnh gửi lại đọc và ghi theo cây hiện tại, nên ở phiên worktree các ý biến mất mà không báo**
  Người dùng thấy gì: Ở phiên làm việc riêng, thẻ mở phiên không hiện số ý đang chờ gom, phiên gom không thấy các ý đó, và ý có thể mất khi xoá phiên mà không có lời báo.
  Căn cứ: Hậu quả nặng vì ý của người dùng biến mất im lặng và họ không tự phát hiện được, nhưng sửa thuộc một tính năng khác nên nên mở việc riêng cùng với lỗi trùng gốc trên.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 (assertion âm-tính-một-mình): CT-3 kiểm `--rang` chỉ bằng «không có dòng sai khuôn», không kiểm lệnh đã chạy**
  Người dùng thấy gì: Bộ kiểm có thể báo xanh về việc các tín hiệu đúng khuôn trong khi lệnh kiểm chưa hề chạy, nên màu xanh đó chưa đáng tin hoàn toàn.
  Căn cứ: Nhẹ với người dùng vì không có hành vi sản phẩm nào sai, chỉ là một lưới kiểm lỏng, và vá sau rẻ khi chạm bộ kiểm này.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, chỉ ghim mã thoát): CT-7-rong chỉ đòi `status === 2`, không ghim thông điệp**
  Người dùng thấy gì: Việc từ chối câu rỗng khi gửi ý có thể hỏng mà bộ kiểm vẫn xanh vì lệnh bị từ chối bởi một lý do khác.
  Căn cứ: Nhẹ vì lỗi nếu có chỉ làm người dùng phải gửi lại câu, không mất dữ liệu, và có thể gộp sửa cùng finding trùng ý.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương): CT-6-do truyền `lanhOk = true` cứng, không buộc vào kết quả bản lành CT-6**
  Người dùng thấy gì: Dòng báo đạt của một ca kiểm cửa tín hiệu không còn chứng được rằng bản nguyên vẹn đã xanh trước đó.
  Căn cứ: Nhẹ vì bộ kiểm tổng vẫn đỏ khi bản nguyên vẹn hỏng và người dùng không bị ảnh hưởng, chỉ là nguy cơ khuôn này bị chép tiếp.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (đối chứng dương không chứng được nền khác vật): ND-1-trang-giu và ND-7 tự động xanh rỗng khi merge-base trùng HEAD**
  Người dùng thấy gì: Sau khi vòng đã gộp, hai phép kiểm «trang người nhìn giữ nguyên» và «chỉ thêm» tự so một thứ với chính nó nên vẫn báo đạt mà không đo gì thật.
  Căn cứ: Hôm nay chưa xảy ra vì nền còn khác bản hiện tại, và khi xảy ra thì dòng báo có tự khai, nên chỉ cần ghi là giới hạn đo lường đã biết thay vì dựng thêm thước.
  file: `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 8/9 lỗi rơi vào file không bộ đo nào phủ (scripts/gui-tin-hieu.mjs, dieu-phoi/scripts/yeu-cau.mjs, tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs, dieu-phoi/scripts/phat-lich.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
