# Review findings: lan-ghim-lai-giu-tron-loi-loi (round 4)

## Trong hợp đồng

Không có phát hiện nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ca chiều đỏ của bộ răng kết luận từ «không thấy» mà không có đối chứng dương trên chính bản sao và không ghim thông điệp (vi phạm bất biến «âm-tính-một-mình»)**
  Người dùng thấy gì: Bộ kiểm tra «phá thử» có thể báo xanh dù bản phá thử đã hỏng ngay từ đầu, nên một số lỗi của làn ghim lại có thể lọt mà vẫn thấy màu xanh. Hành vi thật của làn không bị ảnh hưởng, chỉ là độ tin cậy của màu xanh thấp hơn mức mong muốn.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Vị từ «eval lệch kỳ vọng» được chép tay thành bản thứ hai ngay trước định nghĩa `lech`, và mảng `lech` rò vào JSON stdout**
  Người dùng thấy gì: Cùng một quy tắc «lệnh kiểm nào bị coi là đỏ» đang được viết hai chỗ; sau này sửa một chỗ có thể làm thông điệp lượt đỏ và danh sách lệnh đỏ lệch nhau mà không ai thấy. Hiện tại kết quả vẫn đúng.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Lời khai «KHÔNG ghi gì» của làn đỏ nay sai: làn ghi nhật ký vào .acceptance-runs/ ở mọi chế độ**
  Người dùng thấy gì: Khi lượt ghim đỏ, màn hình vừa báo «không ghi gì» vừa báo đã lưu nhật ký đầy đủ, hai câu mâu thuẫn nhau. Người đọc có thể hiểu nhầm rằng lượt đỏ không để lại dấu nào.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **The full log records a killed or truncated command as a normal 'exit 1' and drops the signal and spawn error**
  Người dùng thấy gì: Nếu máy quá tải và hệ điều hành giết bộ kiểm tra giữa chừng, nhật ký vẫn ghi như một lần kiểm đỏ bình thường nên người đọc không phân biệt được «máy quá tải» với «test thật sự hỏng». Đây đúng là kiểu chẩn đoán nhầm mà vòng này muốn tránh, nhưng cần một hợp đồng riêng để xử lý.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **Several red-direction checks pass whenever the mutated copy never reaches the injected code (crash or unrelated early exit)**
  Người dùng thấy gì: Một số phép thử «phá thử» sẽ vẫn báo xanh nếu bản phá thử tự sập trước khi tới chỗ cần kiểm, nên chúng chưa chứng minh được là lỗi sẽ bị bắt. Hành vi thật của làn không đổi.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E8's red direction passes even when the mutant writes no red-lane marker**
  Người dùng thấy gì: Phép thử chứng minh «mã lượt đỏ không bao giờ được coi là bằng chứng» có thể báo xanh ngay cả khi bản phá thử không để lại dấu nào, nên chưa chắc đã chứng minh đúng điều nó tuyên bố. Cần người quyết có chấp nhận giới hạn này hay không.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: high
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): both E1 red directions turn green when the mutant writes no log or prints nothing**
  Người dùng thấy gì: Phép thử «nhật ký bị cắt» vẫn báo bắt được lỗi ngay cả khi bản phá thử chẳng ghi nhật ký nào, nên màn xanh ở đây chưa phân biệt được «bắt đúng lỗi» với «chưa chạy tới».
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E3 mutants «đỏ không vết» and «thiếu dấu ở slug» only check for the absence of lines, without checking run status or the unaffected slug**
  Người dùng thấy gì: Phép thử «lượt đỏ phải để lại dấu cho từng hồ sơ» chỉ kiểm không thấy dấu, nên nếu làn sập sớm thì cũng báo như đã bắt được lỗi. Dấu thật của lượt đỏ vẫn được ghi đúng.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E7's red direction sets the flag on ANY exit-code drift, including crash exits on the green case**
  Người dùng thấy gì: Phép thử «làn đỏ không được đổi nghĩa» coi mọi sai khác mã thoát là đã bắt được lỗi, kể cả khi bản phá thử chỉ bị sập, nên chưa chắc đã chứng minh đúng lỗi đổi nghĩa đỏ.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (hand-written fixture): E4 hand-writes the repin-do line and wall_s/so_lenh instead of taking them from the real writer**
  Người dùng thấy gì: Phép thử «các bộ đọc sổ vẫn im khi có dòng mới» dùng dòng mới do tay viết thay vì dòng làn thật sinh ra, nên có thể bỏ sót khác biệt nhỏ giữa hai dạng. Hiện chưa thấy bộ đọc nào bị ảnh hưởng.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (class sweep with only point cases): E4 finds readers by grepping the literal «run-log.jsonl», missing readers that take the run-log path as an argument**
  Người dùng thấy gì: Có một bộ đọc sổ nhận đường dẫn qua tham số nên phép thử không tự tìm ra nó. Hiện bộ đọc ấy vẫn không bị ảnh hưởng bởi dòng mới, nhưng sau này nếu nó đổi thì phép thử sẽ không báo.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 8/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
