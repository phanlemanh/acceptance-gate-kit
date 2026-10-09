# Review findings: baseline-tran-bo-qua-don (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **BM2 and BM4 decide 'red' only from a missing marker and never pin the output the mutant should produce (violates the 'negative assertion alone is not alive' invariant)**
  Người dùng thấy gì: Hai phép thử phá-thử của lượt đo đối chứng có thể báo «đã bắt được lỗi» trong khi thực ra lệnh chưa chạy tới nơi. Người dùng vẫn nhận lượt chấm đúng, nhưng độ tin của hai phép thử đó thấp hơn vẻ ngoài.
  file: `tests/workflows/baseline-tran-bo-qua-don.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The Analyst still says 'none — every feature eval is red on baseline (discriminating)' even though the new skip rule makes evals pointing at new files n-a**
  Người dùng thấy gì: Báo cáo nghiệm thu có thể vừa nói «mọi bài kiểm tra tính năng đều đỏ trên bản cũ» vừa liệt kê các bài chưa hề được đo. Người đọc có thể hiểu nhầm rằng các bài ấy đã được kiểm chứng.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Baseline missing a command's result line is still logged as complete (kind:"baseline") and carried forward by P2**
  Người dùng thấy gì: Nếu bước chép đầu ra làm rơi kết quả của một bài kiểm tra, hệ thống vẫn coi lần đo đối chứng là trọn vẹn và các vòng sau không đo lại bài đó. Một bài kiểm tra không phân biệt được đúng sai có thể lọt qua mà không ai biết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Shape 4 (negative-only assertion): BQ2 'the skipped command does NOT run' can never go red**
  Người dùng thấy gì: Phép thử khẳng định «lệnh bị bỏ qua không chạy» thực chất không thể báo lỗi dù lệnh có chạy, nên lời hứa này chỉ được chứng minh gián tiếp qua dòng báo cáo bỏ qua. Người dùng vẫn nhận kết quả đúng, nhưng sẽ không được cảnh báo nếu hành vi này hỏng sau này.
  file: `tests/workflows/baseline-tran-bo-qua-don.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Shape 2 (hand-written fixture in the reader's format): the __BL reader has no round trip from the real shell output**
  Người dùng thấy gì: Nếu định dạng dòng kết quả ở phía sinh lệnh và phía đọc kết quả lệch nhau về sau, các phép thử hiện tại vẫn xanh trong khi báo cáo thật bị sai hoặc trống. Người dùng chỉ phát hiện khi gặp lượt chấm thực.
  file: `tests/workflows/baseline-tran-bo-qua-don.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Shape 4 (negative-only assertion): mutants BM2/BM4 are read as red from the ABSENCE of one marker, without pinning that the mutated command ran to completion**
  Người dùng thấy gì: Hai phép thử phá-thử có thể xanh vì lệnh hỏng sớm chứ không phải vì lỗi đã bị bắt. Người dùng không bị ảnh hưởng trực tiếp, chỉ giảm độ tin của bộ kiểm tra.
  file: `tests/workflows/baseline-tran-bo-qua-don.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (string presence where the promise is a relation): BB5 claims 'the capped command → n-a' but asserts an unrelated 'red' and a reason string found anywhere**
  Người dùng thấy gì: Phép thử không gắn đúng lệnh chạm trần với trạng thái «không đo được», nên nếu hệ thống gán nhầm trạng thái cho lệnh khác thì phép thử vẫn xanh. Báo cáo có thể ghi sai bài nào chưa được đo mà không bị phát hiện.
  file: `tests/workflows/baseline-tran-bo-qua-don.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (no positive control): LP4's mutant probe `/cd \/repo/` is never run against the real source, and the real assertion LP3 cannot see the mutant form**
  Người dùng thấy gì: Một phép thử bảo vệ việc lệnh đối chứng chạy trong thư mục tạm chứ không chạy trong kho thật chưa có đối chứng chứng minh nó biết báo đỏ. Hiện bản thật không vi phạm nên không ảnh hưởng người dùng, chi phí sửa lớn hơn hậu quả.
  file: `tests/workflows/lane-pin.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
