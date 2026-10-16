## Trong hợp đồng

- **Hình dạng 5 (ô ma trận không cô lập trường): mũi «executor» của CL1 đổi hai trường cùng lúc**
  file: `tests/scripts/cham-lai-khong-tu-doi.test.mjs:138`
  severity: low
  AC: AC-1
  source: measurement
  detail: Chú thích ở dòng 134 và AC-1 đều khai ma trận viết trước «mỗi mũi đổi đúng MỘT trường của khối E1». Nhưng mũi `['executor', { executor: 'script', cmd: 'config:executors.script.api' }]` đổi cả `executor` lẫn `cmd`. Vì `cmd` đã có ô riêng ở dòng 137, ô này không chứng được rằng riêng việc đổi `executor` đủ để không mang sang. Một vân tay định nghĩa bỏ sót trường executor vẫn làm ô này xanh, nhờ `cmd` đổi theo. Hôm nay vân tay là trọn khối nguyên văn nên chưa lộ, nhưng ô không đo đúng điều ma trận tuyên bố.
  rationale: AC-1 khai rõ chủ kho đổi ĐÚNG MỘT trường mỗi mũi, mà mũi executor trong ca đo đổi cả executor lẫn cmd nên Given của AC-1 không được tái hiện đúng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **So chữ tiêu chí bị mù với eval phục vụ nhiều tiêu chí (criterion: AC-1, AC-2), nên vẫn mang kết quả cũ sang**
  Người dùng thấy gì: Khi một bài kiểm tra phục vụ nhiều tiêu chí cùng lúc và chữ của một tiêu chí bị đổi, lượt chấm lại vẫn lấy kết quả xanh cũ mà không chạy lại. Người dùng có thể ship với màu xanh đã lỗi thời mà không hay biết.
  Căn cứ: Lỗi này làm kết quả xanh cũ lọt qua im lặng ở các kho đang dùng nhiều tiêu chí cho một bài kiểm tra (đã có hàng chục hồ sơ như vậy), người dùng không tự phát hiện được, nên đáng dựng một việc riêng thay vì chỉ ghi chú.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: new-contract

- **khoiEval là thêm một bộ đọc evals.yaml, ngược lời dặn «không mọc bản thứ ba» của lib/eval-yaml.cjs**
  Người dùng thấy gì: Phần so sánh định nghĩa bài kiểm tra dùng một cách đọc riêng, có thể sai ở vài hình dạng hồ sơ hiếm. Hiện chưa hồ sơ thật nào gặp, nên người dùng chưa bị ảnh hưởng.
  Căn cứ: Quét hơn 400 hồ sơ thật chưa thấy ca nào bị ảnh hưởng, nên hậu quả hiện bằng không và chỉ cần ghi lại để theo dõi nếu có hình dạng lạ xuất hiện.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: known-limits

- **Eval nhiều tiêu chí (hoặc tiêu chí bọc nháy) vẫn được mang sang khi chữ tiêu chí đổi**
  Người dùng thấy gì: Khi một bài kiểm tra khai nhiều tiêu chí hoặc đặt tên tiêu chí trong dấu nháy, đổi chữ tiêu chí vẫn không làm chạy lại, nên màu xanh cũ được giữ nguyên một cách im lặng.
  Căn cứ: Hậu quả nặng vì tạo màu xanh sai không báo, nhiều kho đang dùng đúng hình dạng này và người dùng không tự thấy được; nên gộp chung với việc ở mục nhiều tiêu chí để sửa một lần.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: high
  Đề xuất: new-contract

- **--args trỏ tệp không đọc được thì bỏ qua cả hai phép so thước và cây, thoát 0**
  Người dùng thấy gì: Nếu người chấm gõ nhầm đường dẫn tệp tham số của lượt chấm, hệ thống bỏ qua kiểm tra thước lệch và cây đổi rồi báo qua như hồ sơ đời cũ. Người dùng nhận kết quả xanh mà chưa hề được kiểm.
  Căn cứ: Lỗi im lặng nhưng chỉ xảy ra khi gõ sai đường dẫn, và sai sót đó khó nhận ra vì thông báo đánh lừa là hồ sơ cũ; chi phí sửa nhỏ nên nên đưa vào một việc riêng.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (ma trận thiếu ô phân biệt): đổi nguồn `round` của dòng thuoc-lech không có chiều đỏ, mutant hoàn lại vẫn qua CL6/CL7/CL8**
  Người dùng thấy gì: Bộ kiểm tra chưa có ca nào bắt được trường hợp số lượt ghi sai trên dòng báo thước lệch khi lượt cuối chết giữa chừng. Nếu sau này có người sửa nhầm chỗ đó, không có gì báo đỏ.
  Căn cứ: Hành vi hiện đúng và chỉ thiếu một ca canh gác cho tương lai, nên không gây mất dữ liệu hay khoá oan ngay, chấp nhận ghi lại là giới hạn đã biết.
  file: `tests/scripts/cham-lai-khong-tu-doi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tự kiểm số mũi là lưới chết): `n !== 5` và `n !== MUI_*.length` không bao giờ đỏ được**
  Người dùng thấy gì: Phép kiểm đếm xem có đủ số ca đã chạy hay không thực ra không thể đỏ, nên nếu ai đó lỡ bỏ bớt một ca thì không có tín hiệu nào báo. Các ca còn lại vẫn kiểm đúng, nên kết quả hôm nay không sai.
  Căn cứ: Không có màu xanh giả nào hôm nay vì mỗi ca vẫn có kiểm tra thật, chỉ là lưới đếm số ca yếu hơn lời khai, nên ghi lại là giới hạn đo lường.
  file: `tests/scripts/cham-lai-khong-tu-doi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Lý do mang sang được nối giữa hai script bằng regex trên chuỗi tiếng người, không rút từ một nguồn chung (r1)**
  Người dùng thấy gì: Dòng báo «eval không mang sang» phụ thuộc vào đúng chữ của bên kia. Nếu có người đổi chữ ở một phía, dòng báo có thể biến mất im lặng dù việc chạy lại vẫn đúng.
  Căn cứ: Hôm nay không ai bị ảnh hưởng, vì các ca kiểm hiện có canh đúng dòng này; hậu quả nếu xảy ra chỉ là mất một dòng thông báo, không sai kết quả chấm, và sửa sau không đắt.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Không đọc được hợp đồng ở lượt gốc thì máy báo nhầm «tiêu chí đổi chữ» thay vì «không đọc được định nghĩa» (r1)**
  Người dùng thấy gì: Trong một ca hiếm, thẻ nói sai lý do eval phải chạy lại («tiêu chí đổi chữ» thay vì «không đọc được định nghĩa»). Eval vẫn được chạy lại nên kết quả chấm không sai.
  Căn cứ: Chỉ sai câu giải thích, không sai kết luận và không mất dữ liệu; người dùng không cần làm gì, và ca này hiếm nên chưa đáng mở việc riêng.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: known-limits

- **Phép so của AC-7 trong evals bỏ nhiều trường hơn chữ tiêu chí (r1)**
  Người dùng thấy gì: Thẻ AC-7 xanh được đọc là «bằng nhau trên mọi trường trừ giờ và sha», nhưng thực tế phép so còn bỏ thêm hai trường cùng loại. Người đọc có thể tin thước chặt hơn một chút so với thực tế.
  Căn cứ: Hai trường bị bỏ khác nhau tất yếu giữa hai kho dựng riêng, nên không che lỗi thật nào; chỉ cần ghi một dòng vào giới hạn đã biết là đủ, rẻ và đảo được.
  file: `_acceptance/cham-lai-khong-tu-doi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Phép so chữ tiêu chí tự tắt, không báo gì, khi eval khai nhiều tiêu chí hoặc mã tiêu chí có hậu tố (r1)**
  Người dùng thấy gì: Với những eval khai nhiều tiêu chí hoặc mã có hậu tố, nếu chữ tiêu chí đổi thì máy vẫn mang màu xanh cũ sang mà không báo gì. Kho crm đang có hàng chục eval thuộc dạng này nên chúng vẫn bị lỗi cũ là xanh theo định nghĩa đã đổi.
  Căn cứ: Hậu quả nặng vừa: một eval có thể xanh giả sau khi tiêu chí đổi mà không ai thấy, và thật sự đang chạm kho crm; người dùng không tự phát hiện được. Sửa tương đối rẻ nên đáng làm thành một việc riêng.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Truyền --args trỏ tệp không đọc được thì bỏ qua cả phép so thước lẫn so cây mà vẫn thoát 0 (r1)**
  Người dùng thấy gì: Nếu người chấm gõ sai đường dẫn tệp tham số, hai lưới báo thước lệch và cây đổi âm thầm tắt và lượt vẫn báo thành công. Thẻ có thể hiện xanh trong khi hai kiểm tra đó chưa từng chạy.
  Căn cứ: Hậu quả vừa: mất hai lớp canh mà bề ngoài vẫn thành công, người dùng khó tự biết; nhưng chỉ xảy ra khi gõ sai đường dẫn và chạy lại với đường đúng là hết, nên sửa riêng một việc nhỏ là hợp lý.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 4 (thiếu đối chứng dương, không ghim kết quả): ma trận chiều im CL7 chỉ so bằng nhau giữa bản mới và bản trước vòng, không ghim mã thoát hay loại dòng mong đợi của từng ô (r1)**
  Người dùng thấy gì: Một ca kiểm chưa tự chứng minh được rằng nó đang kiểm đúng tình huống mà nó tuyên bố. Hôm nay kết quả thật vẫn đúng, nhưng nếu về sau ca này hỏng im lặng thì vẫn hiện xanh.
  Căn cứ: Chưa gây sai cho người dùng nào vì đã đo thấy mọi ô đúng; rủi ro chỉ là về sau mất khả năng phát hiện, và ghi vào giới hạn đã biết là đủ cho lúc này.
  file: `tests/scripts/cham-lai-khong-tu-doi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): LC4(4) sửa tay invokedAt của tệp args lượt 1 thành 2098 cho vừa vị từ moiHonLuot, rồi evals gọi đó là «hình dạng lượt chết thật» (r1)**
  Người dùng thấy gì: Một ca kiểm cũ dùng dữ liệu vá tay nhưng được gọi là «lượt chết thật». Hình dạng thật đã được một ca khác kiểm bằng dữ liệu máy sinh, nên người dùng không mất lớp canh nào.
  Căn cứ: Không ảnh hưởng người dùng vì ca khác đã phủ đúng tình huống thật; chỉ là cách gọi tên hơi quá, sửa tốn công hơn nhiều so với lợi ích.
  file: `tests/scripts/cay-doi-trong-luot.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
