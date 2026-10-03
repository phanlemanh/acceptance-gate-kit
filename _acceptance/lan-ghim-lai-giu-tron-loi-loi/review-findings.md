## Trong hợp đồng

- **E4's "wall_s/so_lenh absent" baseline already has both keys, so that half of AC-4 can never go red**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/kho-mau.mjs:43`
  severity: medium
  AC: AC-4
  source: bugs
  detail: `dungKho` writes the starting pin with the current writer: `chayLan(KIT, { R }, …, ['--write'])` at kho-mau.mjs:43. Since this change, that writer always emits `wall_s` and `so_lenh` (repin-lane.mjs:484). In chan-bo-doc.mjs:39-53, the "clean" fixture k1 is meant to be the record without the new keys, but its `kind:repin` line already carries `wall_s` and `so_lenh`. `themMoi(k2)` only changes their values (`o.wall_s = 812.4; o.so_lenh = 3`). So the E4 assertion "output + exit code BẰNG HỆT không có" compares two records that both have the keys. It can only catch a reader whose output depends on the key values. It cannot catch a reader that breaks when the keys are present, for example a strict key-set or schema check: that reader fails the same way on k1 and k2, and E4 stays green. AC-4's promise that readers are unaffected by the new pin-line keys is therefore not measured. The repin-do half of the comparison is still valid, because k1 has no repin-do line. Fix: build the k1 baseline by stripping `wall_s` and `so_lenh` from its repin line, or write it with the base writer (`banBase()`).
  rationale: AC-4 hứa đầu ra bằng hệt trên hồ sơ KHÔNG có hai khoá wall_s/so_lenh, nhưng bản đối chứng đã có sẵn hai khoá nên vế này không đo được.

- **Shape 4 (a no-change assertion with no control arm): E4 compares two arms that both carry wall_s/so_lenh**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs:53`
  severity: medium
  AC: AC-4
  source: measurement
  detail: E4 claims a differential 'có vs không có (một dòng repin-do + wall_s/so_lenh)', asserted at line 53 as `a.status === c.status && chuan(a.out) === chuan(c.out)`. The baseline arm k1 comes from `dungKho`, which writes its pin with the NEW writer of the tree under test (kho-mau.mjs:43, `chayLan(KIT, …, '--write')`). That writer now emits `wall_s`/`so_lenh` (repin-lane.mjs line 484). I ran it and the clean k1 pin line is `{…"evals_exit":{"E1":0},"wall_s":0,"so_lenh":1}`. `themMoi` (lines 21-22) only overwrites the values (812.4/3), so neither arm is ever the 2.20 shape without those keys. Suppose a reader breaks or changes its output just because the `wall_s`/`so_lenh` keys are present: both arms are affected the same way, so the assertion stays green. For that half of AC-4 the 'im' result cannot tell 'the reader ignores the key' from 'the key never varied'. The per-reader positive control uses a different disturbance (sha-pin/xoa-log/them-…), not the presence of the key, so it does not cover this.
  rationale: Cùng gốc với t4: hai nhánh so sánh đều đã mang wall_s/so_lenh nên AC-4 «hồ sơ không có hai thứ ấy» không được kiểm.

- **Shape 3 (presence check where the promise is a relation): E3 never checks that each log belongs to its own red command**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs:42`
  severity: medium
  AC: AC-3
  source: measurement
  detail: evals.yaml E3 promises 'Mỗi lenh_do[].log … chứa dấu riêng mà CHÍNH lệnh đỏ ấy in', which is a relation between each command and its log. Line 42 only checks `CA[ca].dau.some(x => mo.includes(x))`, and every case has exactly ONE red command (suite: DAU-SUITE-91; eval: DAU-EVAL-55; cham: none). Line 44 even requires `lenh_do.length === 1`. With only one red command per run, the cmd→log mapping (`nhatKy.set(cmd, rel)` / `nhatKy.get(cmd)`) is never exercised against a second command. A mutant that points every lenh_do entry at the first log file of the run, or that swaps logs between commands, passes every assertion. On top of that, `.some` over the dau list would accept any marker even if several existed. To test the relation, the measure needs a single run with ≥2 red commands that each print a different marker, and for each entry it must check that the file holds THAT entry's marker.
  rationale: AC-3 hứa nhật ký mở được chứa dấu riêng mà CHÍNH lệnh đỏ ấy in; phép đo chỉ có một lệnh đỏ mỗi lượt nên quan hệ lệnh-nhật ký không bị thử.

- **Shape 5 (claimed case with no code behind it): E3's 'eval mismatched but exited 0 → log null + ly_do' case is never built**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs:11`
  severity: medium
  AC: AC-3
  source: measurement
  detail: evals.yaml E3 expected states: 'eval lệch kỳ vọng mà thoát 0 và ca chạm hồ sơ → log null kèm ly_do'. chan-dau-do.mjs only builds three cases. The 'eval' case (line 11) has an eval that exits 1 against a declared 2, so its exit is not 0 and it gets a real log. No case has an eval exiting 0 against a nonzero declared exit, and nothing in the file checks `ly_do === 'lech-ky-vong'` or `'khong-ghi-duoc'` on a lenh_do entry. Only `cham[].ly_do === 'cham-ho-so'` is checked (line 45). There is also a deeper problem: in repin-lane.mjs the `lech` filter (line 502/506: `e.exit !== e.expected && !(e.expected !== 0 && e.exit === 0)`) drops every exit-0 eval. So the `exit === 0 ? 'lech-ky-vong'` branch on line 520 cannot be reached, and the measure states a promise that no case can ever turn red or green.
  rationale: AC-3 nêu rõ ca eval lệch kỳ vọng mà thoát 0 phải có log null kèm ly_do; ca này không được dựng và nhánh mã tương ứng dường như không tới được.

- **Shape 3 (count check where the promise is 'the last 30 lines'): E1 only counts 30 tail lines**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs:27`
  severity: low
  AC: AC-1
  source: measurement
  detail: E1 promises that stderr 'vẫn in 30 dòng CUỐI như 2.20'. Lines 26-27 only count lines matching `^    dong-\d+$` and check `duoi === 30`. They never check that those lines are the last ones (in this fixture the tail of out+err is dong-141..dong-199, odd numbers only). A mutant that changes `.slice(-30)` to `.slice(0, 30)` (prints the first 30 lines, which is exactly the class of bug this record exists to fix, where the error message gets lost) still prints 30 `dong-N` lines and stays green. The assertion should pin the expected set or order, for example the last line must be `dong-199` and the set must equal the computed last 30 lines of the concatenation.
  rationale: AC-1 hứa stderr vẫn in 30 dòng CUỐI; phép đo chỉ đếm 30 dòng nên bản in 30 dòng ĐẦU vẫn xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Unvalidated --run-id is now used as a filesystem path segment**
  Người dùng thấy gì: Nếu ai đó gõ một mã lượt chạy có ký tự lùi thư mục, nhật ký có thể bị ghi ra ngoài kho. Chỉ xảy ra khi chính người chạy cố tình truyền giá trị lạ, nên ghi là hạn chế đã biết.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Red-eval predicate now exists in three copies; internal `lech` leaks into the lane's stdout JSON**
  Người dùng thấy gì: Cùng một quy tắc nhận biết lượt đỏ được viết ở ba chỗ nên sau này dễ lệch nhau, và kết quả in ra của làn có thêm một phần dữ liệu nội bộ. Hôm nay chưa làm sai kết quả cho người dùng.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **E4 «every run-log reader» is found by literal string match and misses carry-plan.mjs**
  Người dùng thấy gì: Có một công cụ đọc sổ lượt chạy mà phép kiểm không soi tới, nên nếu sau này nó đọc nhầm dòng mới thì không ai được báo trước. Hiện nó bỏ qua dòng mới nên chưa gây hại.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

- **The "full log" header records exit 1 for a killed process and drops the signal and spawn error**
  Người dùng thấy gì: Khi một lệnh bị hệ điều hành giết giữa chừng (ví dụ hết bộ nhớ), nhật ký vẫn ghi như một lệnh thất bại bình thường, nên người đọc khó phân biệt lỗi test với bị ngắt.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 6/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/kho-mau.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
