# Review findings — dieu-phoi-feature-loop-trong-dot (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phép so chiều im DP7-09 neo vào merge-base(HEAD, origin/main) đang trôi, nên hồ sơ đã ký sẽ đỏ ở vòng sau**
  Người dùng thấy gì: Phép kiểm 'kho không có đợt không đổi byte nào' hôm nay xanh đúng, nhưng ở các vòng sau trên nhánh khác nó có thể đỏ oan khi ai đó sửa tệp của feature-loop, hoặc xanh rỗng sau khi gộp. Người dùng kit có thể thấy cảnh báo sai hoặc mất sự bảo vệ này mà không biết.
  file: `tests/dieu-phoi/dp7-chieu-im.mjs`
  severity: high
  Đề xuất: known-limits

- **AC-12 cho phép hang-viec.json có hai hàng trùng `ma`, nhưng các bên đọc theo `ma` không được sửa theo**
  Người dùng thấy gì: Khi hai lộ trình có cùng mã việc, bảng đợt và bộ xếp lịch có thể nhầm hai việc là một: việc phải chờ có thể được mở sớm sai thứ tự, và lệnh đẩy hay thêm hàng chỉ chạm vào việc thứ nhất.
  file: `dieu-phoi/scripts/goi-dot.mjs`
  severity: medium
  Đề xuất: new-contract

- **trong-dot.mjs gộp mọi lần `tho` thất bại thành «lõi chưa có lệnh tho», nên phiên thợ đi tiếp như ngoài đợt**
  Người dùng thấy gì: Nếu tệp của đợt bị hỏng, phiên thợ được báo nhầm rằng bản lõi quá cũ rồi làm việc như thể không ở trong đợt: nó tự hỏi người và không xin lượt. Không ai biết nguyên nhân thật là tệp đợt hỏng.
  file: `feature-loop/scripts/trong-dot.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh `pha dang-chay --tu-merge` khi đã ở dang-chay: bỏ im lặng ở đợt cũ, và không ghi sổ ở đợt mới**
  Người dùng thấy gì: Nếu chủ kho đổi ý về quyền tự gộp khi đợt đã đang chạy, lệnh báo 'đã ở trạng thái đó' nên có thể không lưu lựa chọn, hoặc lưu mà không để lại dòng nhật ký nào. Người đọc sau không biết ai đã đổi quyền gộp.
  file: `dieu-phoi/scripts/pha.mjs`
  severity: low
  Đề xuất: known-limits

- **trong-dot.mjs reports every failure of `tho` as "lõi chưa có lệnh tho" and discards stderr, so the worker silently falls back to the non-đợt loop**
  Người dùng thấy gì: Khi tệp trạng thái của đợt hỏng, phiên thợ bị báo sai nguyên nhân và lặng lẽ chạy như ngoài đợt. Lỗi thật bị giấu nên chủ kho không biết phải sửa gì.
  file: `feature-loop/scripts/trong-dot.mjs`
  severity: medium
  Đề xuất: new-contract

- **`pha dang-chay --tu-merge` is silently dropped on a legacy đợt and recorded nowhere on a đợt already in dang-chay**
  Người dùng thấy gì: Với đợt cũ, câu trả lời của chủ kho về quyền tự gộp có thể bị nuốt mà không báo lỗi. Với đợt đang chạy, quyền gộp đổi mà không để lại dấu vết nào.
  file: `dieu-phoi/scripts/pha.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): DP7-09 script-khac và DP7-09 hook xanh chỉ vì diff rỗng**
  Người dùng thấy gì: Phép kiểm 'kho không có đợt không bị đổi' có thể báo xanh kể cả khi nó so nhầm mốc nên chẳng so được gì. Người dùng có thể tin vào sự an toàn này nhiều hơn mức nó thật sự chứng minh.
  file: `tests/dieu-phoi/dp7-chieu-im.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): DP7-06 ngoai-day / DP7-10 so với merge-base mà không chứng minh base khác vật**
  Người dùng thấy gì: Phép kiểm 'lời chặn ngoài dãy giữ nguyên như trước' có thể thành so một thứ với chính nó sau khi gộp, nên màu xanh không còn chứng minh được lời hứa không đổi hành vi cũ.
  file: `tests/dieu-phoi/trong-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case (hình dạng 5): nhánh «trên nhánh chính → gop» của AC-4 chỉ thử machine-cleared**
  Người dùng thấy gì: Khi hàng việc đã xong nằm trên nhánh chính, chỉ một trạng thái hoàn tất được kiểm thật. Một sửa sai cho các trạng thái hoàn tất còn lại hoặc cho trạng thái chưa xong có thể lọt qua mà bộ kiểm vẫn xanh.
  file: `tests/dieu-phoi/trong-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
