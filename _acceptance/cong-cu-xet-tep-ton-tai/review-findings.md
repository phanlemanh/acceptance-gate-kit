## Trong hợp đồng

- **Assertion âm-tính-một-mình (hình dạng 4): đột biến (b) của NEN-TT5 chỉ xét bullet VẮNG, không ghim rằng lượt đột biến đã chạy hết**
  file: `tests/scripts/duong-nen.test.mjs:1293`
  severity: medium
  AC: AC-5
  source: measurement
  detail: Trong mảng DOT của NEN-TT5, đột biến (b) dùng phép xét `b => !b.some(l => l.endsWith('(khoa executors.script.tt_tuyet_doi_vang)'))`, với `b = x.r ? bulletCongCuMoi(x.r.tep) : []` (khoảng dòng 1293 và 1304). `bulletCongCuMoi` trả `[]` khi `tep` là null (`bullets(tep) || []`). Vậy nếu bản tiêm chết khi chạy (lỗi nạp, lỗi lúc chạy, thoát sớm trước khi ghi duong-nen.md), danh sách bullet rỗng và phép xét vẫn báo «đột biến làm ca đỏ». Không có gì phân biệt được «đột biến bị bắt đúng» với «bản tiêm không chạy». Phép kiểm trên bản sao chưa tiêm chỉ chứng minh bản chép còn tốt, không chứng minh lượt chạy của bản tiêm đã xong. Phép kiểm cũng không đọc `x.r.code` hay `fm(x.r.tep,'cong_cu')` của lượt đột biến. Hai đột biến (a) và (c) không mắc lỗi này vì chúng đòi một bullet nguyên văn phải CÓ MẶT. Với (b), lượt «vắng» vẫn phải sinh bullet `MONG_TEN` (`nen cong-cu: THIEU khong-co-that-tt (khoa executors.script.tt_ten_vang)`), vì tên trần không phải đường tệp nên không qua `coTep`. Đó là đối chứng dương sẵn có nhưng ca không ghim nó. Cùng lỗi này nằm trong lời hứa của E5/AC-5 «(b) khoá tuyệt đối vắng mất bullet»: lời hứa chỉ nói vắng, không kèm một chứng cứ có mặt.
  rationale: AC-5 đòi mỗi đột biến, kể cả (b), làm ca đỏ có tên; phép xét chỉ-vắng-bullet của (b) vẫn báo đỏ khi bản tiêm chết sớm nên không chứng minh được đột biến thật sự bị bắt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bảng «Bốn chân» của khuôn đường nền vẫn mô tả luật cũ của chân cong_cu (mọi tên chương trình đều tra bằng command -v); luật đường tệp mới không được ghi**
  Người dùng thấy gì: Tài liệu đi kèm bản kit vẫn mô tả cách kiểm tra công cụ theo luật cũ. Người đọc ở kho khác có thể hiểu sai vì sao một tệp kịch bản không có quyền chạy nay lại được coi là có mặt, hoặc vì sao một thư mục lại bị báo thiếu.
  Căn cứ: Chỉ là lời mô tả lệch, không làm kết quả kiểm sai và không mất dữ liệu; người đọc tự tra lại được, và sửa chữ về sau rẻ nên ghi hạn chế đã biết rồi ship.
  file: `skills/acceptance/references/duong-nen-template.md`
  severity: low
  Đề xuất: known-limits

- **A bare script name in the repo root is marked green even though bash cannot run it (exit 127)**
  Người dùng thấy gì: Nếu một lệnh công cụ bắt đầu bằng tên tệp kịch bản trần nằm ở gốc kho, bước kiểm báo xanh là công cụ có mặt, nhưng khi chạy thật lệnh đó không tìm thấy và hỏng. Người ký sẽ tin nhầm là công cụ dùng được.
  Căn cứ: Gây báo xanh giả ở một ca hẹp, lỗi chỉ lộ khi lệnh chạy thật chứ không mất dữ liệu; sửa thuộc về đổi chính điều hợp đồng đã chốt nên cần một việc riêng có người quyết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
