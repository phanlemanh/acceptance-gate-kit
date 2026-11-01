## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **phanTepHoSo coi eval không khai paths là «không đo tệp chữ», ngược khuôn staleByPaths (eval thiếu paths = không biết đo gì → giữ luật cũ)**
  Người dùng thấy gì: Khi một hồ sơ có phép đo không khai rõ nó đo tệp nào, một PR chỉ sửa phần chữ của hồ sơ vẫn có thể được gộp mà không bị đòi ghim lại bằng chứng, dù phép đo ấy có thể đang dựa vào chính phần chữ đó.
  Căn cứ: Hậu quả là lưới bớt chặt ở một hình dạng hồ sơ hẹp, chỉ làm lỡ một lần đòi ghim lại chứ không mất dữ liệu, và vòng sau vẫn phát hiện được khi mã đổi.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Đọc evals.yaml lỗi bị nuốt và coi như hồ sơ không có evals.yaml, nên lưới bớt xét thay vì lùi về coi là tệp vật**
  Người dùng thấy gì: Nếu tệp khai phép đo của hồ sơ có mặt mà máy không đọc được, một PR chỉ sửa phần chữ có thể được coi nhẹ hơn mức cần, và hồ sơ cũ lọt qua mà không bị đòi ghim lại.
  Căn cứ: Chỉ xảy ra khi tệp bị hỏng quyền đọc, hiếm gặp, và người dùng tự thấy được qua lỗi hệ thống nên hậu quả nhẹ, sửa sau không đắt.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét lớp «paths không đọc được» nhưng ma trận chỉ có một điểm (ngoặc nhọn)**
  Người dùng thấy gì: Bộ kiểm hiện chưa chứng minh được rằng mọi kiểu khai đường dẫn lạ đều bị lưới xử lý chặt, nên một thay đổi sau này có thể làm lỏng lưới mà bộ kiểm vẫn báo xanh.
  Căn cứ: Đây là điểm yếu của thước đo chứ chưa phải lỗi người dùng đã gặp, và bổ sung ca đo sau này rẻ.
  file: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — coStale kiểm «src/app.js» có mặt ở bất cứ đâu trong đầu ra, không gắn với dòng VIOLATION stale**
  Người dùng thấy gì: Bộ kiểm có thể báo xanh dù dòng cảnh báo bằng chứng cũ không nêu tệp mã đã đổi, miễn tên tệp ấy xuất hiện ở dòng khác, nên người đọc có thể thiếu chỉ dẫn đúng chỗ.
  Căn cứ: Rủi ro nhẹ vì lưới vẫn chặn đúng và chỉ việc nêu tên tệp có thể sai chỗ, người dùng vẫn tự đọc được toàn bộ đầu ra.
  file: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
