# Review findings: vong-mo-thang-bang-feature-loop (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **dongGiu bỏ qua `supersedes`: dòng «giữ cỡ» đã bị thay vẫn mở cổng (fail-open)**
  Người dùng thấy gì: Nếu người dùng đã rút lại lý do «giữ nguyên cỡ lớn» của một hợp đồng từ 13 tiêu chí, hệ thống vẫn coi lý do cũ còn hiệu lực. Hợp đồng quá lớn vì thế vẫn đi tiếp vào bước chốt phạm vi, và số đếm hồ sơ «đã giữ có tên» bị tính dư.
  file: `scripts/co-hop-dong.cjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh duyệt: STOP ở bước 1 không chừa lối cho câu gộp `sửa: giữ cỡ`; dòng giữ ở bước 4 thiếu ba vế/decided_by và không có round-trip**
  Người dùng thấy gì: Khi hợp đồng quá lớn, người dùng gõ gộp «duyệt kèm giữ cỡ» trong một câu có thể bị chặn lại ở bước đầu và phải gõ lại hai lần. Dòng «giữ cỡ» được ghi bằng lệnh duyệt cũng có thể thiếu phần giá nếu sai và người quyết.
  file: `commands/approve.md`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml mô tả sai phép đo của chính nó (git archive HEAD, kho git thật) so với tệp ca**
  Người dùng thấy gì: Hồ sơ nghiệm thu mô tả cách kiểm tra khác với cách nó thực sự chạy, nên người đọc có thể hiểu nhầm rằng kết quả phản ánh bản đã commit trong khi nó lấy bản đang sửa dở. Mỗi lần chạy kiểm tra còn để lại một số thư mục tạm trên máy.
  file: `_acceptance/vong-mo-thang-bang-feature-loop/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **dongGiu bỏ qua `supersedes`: dòng «giữ cỡ» đã bị thay vẫn mở khoá hợp đồng ≥13 tiêu chí (fail-open)**
  Người dùng thấy gì: Khi lý do «giữ nguyên cỡ lớn» đã bị rút lại bằng một quyết định mới, hợp đồng từ 13 tiêu chí vẫn được mời duyệt như thể lý do còn nguyên. Đồng hồ đếm hồ sơ lớn cũng báo sai số hồ sơ đã giữ có tên.
  file: `scripts/co-hop-dong.cjs`
  severity: medium
  Đề xuất: new-contract

- **Chuỗi giữ chưa điền (`giữ cỡ — <lý do>`) vẫn được tính là dòng giữ có lý do**
  Người dùng thấy gì: Nếu người dùng dán nguyên câu mẫu «giữ cỡ — <lý do>» mà chưa điền lý do thật, hệ thống vẫn coi hợp đồng lớn là đã được giữ có lý do. Hợp đồng đó qua được bước chốt phạm vi mà không có lý do thật.
  file: `scripts/co-hop-dong.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình, không ghim thông điệp): AC-4-do và AC-5-do-khoa vẫn xanh khi thẻ sập trong bản sao**
  Người dùng thấy gì: Hai phép kiểm tra «bắt lỗi» có thể báo đã bắt được lỗi trong khi thực ra chỉ là công cụ kiểm tra bị hỏng. Màu đỏ của chúng khi đó không chứng minh được đúng lỗi cần bắt đang bị phát hiện.
  file: `tests/scripts/co-hop-dong.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay, không qua bên ghi): AC-7 tuyên đo ca «chốt trước mốc mà ký sau mốc» nhưng kho thử không có chữ ký nào**
  Người dùng thấy gì: Phép kiểm tra tuyên bố đã thử trường hợp hồ sơ chốt trước mốc nhưng ký sau mốc, mà thực tế không có chữ ký nào trong dữ liệu thử. Nếu bộ đếm lọc nhầm theo ngày ký thì kiểm tra vẫn báo xanh.
  file: `tests/scripts/co-hop-dong.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
