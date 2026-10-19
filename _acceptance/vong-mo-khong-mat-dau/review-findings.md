# Review findings — vong-mo-khong-mat-dau (round 1)

## Trong hợp đồng

- **Shape 3 (asserting a string is present when the promise is a relation): GD-07 (a) checks for "P1", which the request ID already contains**
  file: tests/dieu-phoi/tin-khong-mat-dau.test.mjs:456
  severity: medium
  AC: AC-7
  source: measurement
  detail: Row (a) checks `a.ma === 0 && a.out.includes(id) && a.out.includes('P1')`. The ID comes from `dieu-phoi.mjs yeu-cau` run in P1's worktree and is always 'P1-<n>' (a probe run printed 'P1-1'). Any output that contains the ID therefore also contains 'P1', so the second check can never fail on its own. The promise in AC-7 / E7(a) is a relation: the output must name the actual asker, `vào hộp của ${muc.tu}` (tin.mjs dapYeuCauCu). If that line named the wrong person (for example `muc.den` = 'G'), the row would still pass. It should check the full value, e.g. `out.includes(`vào hộp của P1`)`, or compare it to `muc.tu` read back from the record. No mutant targets this row either.
  rationale: AC-7 hứa stdout nêu đã trả lời vào hộp của đúng P1; hàng đo chỉ kiểm chữ «P1» vốn đã nằm trong mã yêu cầu nên không chứng minh được lời hứa người nhận đúng.

- **Shape 4 (negative assertion with no positive control): GD-07 (d) and GD-08 «sổ mở không còn vòng» turn a crashed `tin so` into a pass**
  file: tests/dieu-phoi/tin-khong-mat-dau.test.mjs:464
  severity: medium
  AC: AC-7
  source: measurement
  detail: Line 464 has `const soJ = JSON.parse(tin(k.kho, ['so', '--json'], { gocGoi }).out || '[]')`, then the row asserts `!soJ.some((v) => v.ma === id)`. Line 509/510 (kiemTraCu) repeats the same pattern. Neither checks the exit code of `tin so`. If `tin so --json` crashes or prints nothing, which is plausible since the new legacy-request reply format feeds straight into gapSo, the `|| '[]'` fallback yields an empty book and the row reads «không có id», i.e. green. There is also no positive control showing the same book did contain `id` before XONG/TRẢ. The GD-07-do mutant only proves the row turns red when `tin so` runs correctly; it cannot tell a crash apart from "the loop closed". The fix needs both: check `ma === 0`, and confirm the ID is in the open book before replying.
  rationale: AC-7 hứa «tin so không còn vòng P1-<n>» (AC-8 cùng ý); hàng đo xanh cả khi lệnh sổ hỏng và không có đối chứng dương nên không chứng được lời hứa.

- **Shape 4 (negative assertion with no positive control): GD-02 «lần Stop hai» passes whenever there is no decision:block, including when the hook crashes**
  file: tests/dieu-phoi/tin-khong-mat-dau.test.mjs:153
  severity: medium
  AC: AC-2
  source: measurement
  detail: `const r2 = chayHook(...'Stop'...)` and then `so('lần Stop hai', 'cho qua', ..., r2.json?.decision !== 'block')`. The test never checks `r2.ma` or that stdout is valid or empty in the expected way. If the Stop hook crashes (exit != 0, `json` null) or prints garbage, the row still reads «cho qua» and passes. That is exactly the failure class AC-2 is about: a sync slipping in and leaving the state file in a shape the hook cannot read. Stop one returning block proves the hook ran once, not that it ran correctly the second time. The row should also pin `r2.ma === 0` (and the expected output when the hook lets the turn through).
  rationale: AC-2 hứa lần Stop thứ hai cho qua sau khi đồng bộ xong; hàng đo xanh cả khi hook sập hoặc in rác nên không chứng được lời hứa này.

- **Shape 3 (asserting a string is present when the promise is a relation): GD-10 only greps the `tin TRẢ` example in the legacy-request row and never runs it**
  file: tests/dieu-phoi/tin-khong-mat-dau.test.mjs:604
  severity: low
  AC: AC-10
  source: measurement
  detail: Row 2 of kiemLuatGd checks only `l.includes('kiểu cũ') && l.includes('`tin XONG') && l.includes('`tin TRẢ')`. Row 4 extracts the `tin XONG ...` example and runs it on a real legacy request. The TRẢ example in the same row (`tin TRẢ <mã> "<câu vì sao trả>" --chuyen <ai>`) is never extracted or run. AC-10 promises that the rule describes a working behaviour, but this part is only checked as a string. If LUAT.md dropped `--chuyen` from the TRẢ example, `tin` would reject the command (exit 1, as GD-08 «thiếu --chuyen» shows) and GD-10 would stay green. The same applies to the hạn row: only the flag names are extracted, and the test builds its own GIAO command instead of running the rule's example.
  rationale: AC-10 yêu cầu ca đo rút câu lệnh mẫu của dòng luật rồi chạy nó trên kho thử; ví dụ `tin TRẢ` và ví dụ hạn chỉ được dò chữ, không chạy.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ kiểm hạn nhận cả số phút quá lớn mà bên đọc không xử lý được: NHẬN văng RangeError, số rất lớn bị đọc lại thành mặc định**
  Người dùng thấy gì: Nếu ai đó gõ một hạn lớn bất thường (hàng trăm tỷ phút), lệnh vẫn báo thành công nhưng người nhận sau đó không nhận được vòng, hoặc hạn bị đọc thành 30 phút mặc định.
  Căn cứ: Chỉ xảy ra khi gõ số phi thực tế nên hiếm với người dùng thật, vòng không mất dữ liệu và người giao có thể giao lại với hạn hợp lý.
  file: `dieu-phoi/scripts/tin.mjs`
  severity: low
  Đề xuất: known-limits

- **A half-written line in the marker log also wipes out the next valid marker, and the loss is never reported**
  Người dùng thấy gì: Nếu máy tắt đúng lúc đang ghi dấu «đã đến» hay «chấp nhận», dấu ghi ngay sau đó cũng mất và không có cảnh báo nào, nên vòng có thể kẹt ở «chờ chấp nhận» mà người dùng không biết vì sao.
  Căn cứ: Cần máy chết đúng giữa lúc ghi nên hiếm, nhưng khi xảy ra thì mất dấu im lặng và đúng loại kẹt mà vòng này muốn chặn; sửa sau rẻ (thêm một kiểm tra trước khi ghi).
  file: `dieu-phoi/scripts/tin-noi-chua.mjs`
  severity: medium
  Đề xuất: known-limits

- **E7 (c) says it runs a real `dieu-phoi.mjs chay` tick, but the test calls taoVong with fake I/O**
  Người dùng thấy gì: Hồ sơ nghiệm thu nói đã chạy một nhịp thật của bộ phát lịch, nhưng thực tế bài đo chạy bản giả lập; người đọc hồ sơ có thể tin đã đo chặt hơn sự thật.
  Căn cứ: Không ảnh hưởng trực tiếp người dùng cuối, chỉ làm hồ sơ nói quá mức đã đo; chỉ cần ghi rõ đây là giới hạn của phép đo.
  file: `_acceptance/vong-mo-khong-mat-dau/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (injection not proven to apply): GD-03 appends the half-written line without checking that the marks file exists**
  Người dùng thấy gì: Bài đo cho việc đọc bỏ qua dòng dấu ghi dở có thể xanh mà thực ra chưa hề tiêm dòng hỏng, nên khả năng chịu dòng ghi dở chưa được chứng thật.
  Căn cứ: Chỉ là độ tin của một bài đo phụ ngoài lời hứa chính, không làm người dùng mất gì; nếu thiếu chứng thì ghi là giới hạn chưa chứng.
  file: `tests/dieu-phoi/tin-khong-mat-dau.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
