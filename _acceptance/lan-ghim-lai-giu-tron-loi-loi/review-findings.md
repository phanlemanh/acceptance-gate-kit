# Review findings: lan-ghim-lai-giu-tron-loi-loi (round 3)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E6 never tests the macOS swap parser, so a broken parser on the incident machine stays green**
  Người dùng thấy gì: Phần đọc mức dùng bộ nhớ đệm trên máy Mac chưa có phép thử nào. Nếu nó hỏng, lượt đỏ vẫn được ghi nhưng mục tải máy sẽ trống, và bộ kiểm không báo.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **Three red-direction (mutant) checks pass on 'nothing happened' alone, with no exit code or message pinned**
  Người dùng thấy gì: Bộ kiểm có thể báo đã bắt được lỗi 'lượt đỏ không để lại dấu' trong khi thực ra bản thử bị hỏng sớm và chưa chạy gì. Sản phẩm giao cho người dùng không bị ảnh hưởng, chỉ có độ tin của bộ kiểm giảm.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **E4 claims to cover every run-log reader, but its search misses carry-plan.mjs**
  Người dùng thấy gì: Một công cụ đọc sổ lượt chạy của kho chưa được thử với dòng sổ loại mới. Hôm nay nó bỏ qua dòng ấy nên không sao, nhưng nếu sau này sửa nó thì bộ kiểm sẽ không cảnh báo.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

- **--run-id now becomes a filesystem path with no validation, so a log can be written outside --root**
  Người dùng thấy gì: Nếu ai đó tự gõ một mã lượt chạy có ký tự lạ, tệp nhật ký có thể bị ghi ra ngoài thư mục kho. Mã này thường do làn tự sinh và chỉ người dùng tại máy mới gõ tay được, nên rủi ro thấp.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **A failed lane's run_id is now accepted as eval evidence: `repin-do` lines bypass the borrowed-lane-id check**
  Người dùng thấy gì: Mã của một lượt ghim đã đỏ có thể bị dùng làm bằng chứng trong báo cáo nghiệm thu và bộ kiểm lại vẫn cho qua. Như vậy một lượt thất bại có thể được trình như bằng chứng đã chạy, đúng điều hệ thống phải ngăn.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **A command that exits with its declared non-zero code still writes a log file and creates `.acceptance-runs/`**
  Người dùng thấy gì: Với kho có lệnh được khai là thoát mã khác 0 mà vẫn tính là đạt, mỗi lượt chạy vẫn để lại tệp nhật ký thừa và in một dòng thông báo. Không ảnh hưởng kết quả, chỉ làm lời hứa 'lệnh xanh không sinh tệp' chưa đúng hoàn toàn.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims to sweep a class but only has point cases): E4 builds its list of run-log readers by grepping for a literal, so carry-plan.mjs, a real reader, is missed and never measured**
  Người dùng thấy gì: Cùng một lỗ hổng với mục trước: một công cụ đọc sổ chưa được thử với dòng sổ mới, nên lời 'mọi bộ đọc đều không đổi' chưa đúng cho nó.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (hand-written fixture shaped for the reader, no writer round-trip): E4 feeds readers a repin-do line built by hand instead of one written by repin-lane.mjs**
  Người dùng thấy gì: Bộ kiểm các công cụ đọc sổ dùng dòng sổ tự dựng tay, nên nếu làn đổi dạng dòng sổ của nó thì phép thử này vẫn xanh dù công cụ đọc có thể đọc sai.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E7's red direction passes when ANY of the 5 cells changes, without pinning which cell or that the copy actually ran**
  Người dùng thấy gì: Phép thử 'làn đỏ phải vẫn thoát lỗi' có thể báo bắt được lỗi trong khi bản thử vốn đã hỏng vì lý do khác. Độ tin của bộ kiểm giảm, sản phẩm không đổi.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E3's red directions 'đỏ không vết' and 'thiếu dấu ở slug' only check that lines are missing**
  Người dùng thấy gì: Hai phép thử bắt lỗi 'lượt đỏ không để lại dấu' chỉ kiểm có thiếu dòng sổ, nên một bản thử chết giữa chừng cũng được tính là đã bắt đúng lỗi.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): both of E1's red directions pass when the copy writes no file or crashes**
  Người dùng thấy gì: Phép thử 'nhật ký bị cắt' có thể báo đã bắt được lỗi trong khi bản thử thực ra không ghi tệp nào hoặc đã sập. Độ tin của bộ kiểm giảm, sản phẩm không đổi.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): E6's red directions accept any throw or any failure without pinning the swap error**
  Người dùng thấy gì: Phép thử 'đọc tải máy lỗi không được làm sập làn' có thể xanh vì một lý do khác lỗi đọc swap, nên khó biết chắc nó đang bảo vệ đúng chỗ.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (asserts difference while the promise is a relation): E4's red direction only checks that loop-health output differs, not that it counts exactly one more pin lane**
  Người dùng thấy gì: Bảng sức khoẻ vòng được kiểm là có đổi khi có dấu đỏ giả làm pin, chưa kiểm là nó tăng đúng một làn. Một thay đổi khác trong bảng cũng khiến phép thử báo đã bắt được.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 10/13 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
