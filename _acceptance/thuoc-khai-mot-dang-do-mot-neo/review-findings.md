## Trong hợp đồng

- **Bốn đột biến mới của P86 chỉ assert «khác None», không ghim thông điệp — con số «9» trong output là chữ hằng trong nhãn ca, không phải số máy trích**
  file: `tests/plugins/run-tests.sh:11075`
  severity: high
  AC: AC-7
  CLAUDE.md nêu bất biến: mọi case kết luận từ «exit khác 0» PHẢI có (a) đối chứng dương VÀ (b) ghim ĐÚNG THÔNG ĐIỆP mong đợi, không chỉ mã thoát. Bốn đột biến mới (`ngan sach luot 3->9`, `tran T3 4->5`, `xoa ve moc phat hanh`, `them cong nhung giu ngan sach`) đều truyền `phai_neu = None`, nên vòng lặp chỉ chạy `assert d is not None` rồi `print(f"P86 MUTANT: {ten} -> do dung cho")` — biến `d` (thông điệp lỗi có chứa số đã trích) KHÔNG BAO GIỜ được in ra và không bị assert.

  Hệ quả cụ thể, và nó chạm thẳng vào AC-7/E7: E7 khai «Dòng đỏ của ca một phải NÊU SỐ THẬT đã trích — chứa `9` — chứng minh con số là dữ liệu chứ không phải chữ trong câu». Chạy thật, dòng duy nhất chứa `9` là `P86 MUTANT: ngan sach luot 3->9 -> do dung cho` — chuỗi `3->9` là NHÃN hardcode của ca đột biến ở dòng 11068, không phải giá trị `ngan_sach()` đọc được. Người/judge đọc bằng chứng sẽ xác nhận đúng câu E7 hứa trong khi vật không hề tạo ra bằng chứng ấy.

  Kịch bản fail: sửa thông điệp ở dòng 11073 từ `f"{ten}: ngan sach luot {luot} != so cong {len(vis)} - 1"` thành hằng `f"{ten}: ngan sach sai"` (hoặc để một vế đỏ vì lệch bản chép thay vì vì ngân sách) — P86 vẫn XANH, vẫn in đủ 9 dòng MUTANT, E7 vẫn được chấm PASS, trong khi lời hứa «số là dữ liệu» đã chết. Cùng lớp lỗi, phép so QUAN HỆ có thể đỏ vì lý do khác vế bị đột biến mà không ca nào phân biệt được.

  Cách đóng đúng lớp (không vá riêng ca một): cho mỗi đột biến mới một chuỗi ghim (mở rộng `phai_neu` thành mẫu thông điệp, không chỉ tên file), assert `phai_neu in d`, và in `d` ra thay vì chỉ in `ten` — để con số trích được thật sự xuất hiện trong bằng chứng. Lưu ý hai đột biến CŨ (`mat ngan sach T3`) cũng đang `None` nên nên quét cả khối, đúng nếp «sửa theo LỚP» của CLAUDE.md.
  (source: conventions)

- **«Ba mốc đã neo» khai ở comment, AC-1 và E1 — thực tế chỉ có HAI hằng mốc**
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:83`
  severity: medium
  AC: AC-1
  Dòng 83 viết «Ba mốc dưới đây là hằng có chủ ý» nhưng ngay dưới chỉ có HAI phép gán: `MOC_KY` (dòng 85) và `MOC_GOP` (dòng 86). Contract AC-1 nói «Then nhóm XANH và in ba mốc đã neo», và E1 `expected` nói «dòng đối chứng dương in ba mốc đã neo nguyên văn».

  Chạy thật, output in `9b3d6f64` (vế lane), rồi `1765b550..9b3d6f64` (vế tập-file) — hai SHA phân biệt, một cái xuất hiện hai lần. Không ô nào assert số lượng mốc, nên sai lệch này đi qua cổng im lặng.

  Kịch bản fail: người duyệt Cổng Bằng chứng đọc E1 rồi đếm SHA trong output, thấy ba lần xuất hiện, kết luận «đủ ba mốc» — nhưng nếu về sau ai đó thêm/bớt một hằng mốc (ví dụ tách `MOC_NGON` riêng như câu chữ đang gợi ý), cả comment, AC-1 lẫn E1 vẫn khai đúng «ba» mà không phép đo nào phản ứng. Đây chính là hình dạng «tự khai một đằng» ở tầng văn bản mà hồ sơ này tồn tại để cắt. Sửa: thống nhất về «hai mốc» ở cả ba chỗ, hoặc nếu chủ ý là ba thì thiếu một hằng.
  (source: conventions)

- **P86 mutant loop discards the red message — AC-7/AC-8's "prints the extracted number" is never emitted, and the only `9` in the output is the hardcoded mutant label**
  file: `tests/plugins/run-tests.sh:11078`
  severity: high
  AC: AC-7
  The mutant loop computes the red message into `d` but prints a constant:

      d = f()
      assert d is not None, ...
      if phai_neu:
          assert phai_neu in d, ...
      print(f"     P86 MUTANT: {ten} -> do dung cho")

  All four NEW mutants pass `phai_neu=None`, so the `assert phai_neu in d` branch never runs for them, and `d` is never printed. Actual observed output:

      P86 MUTANT: ngan sach luot 3->9 -> do dung cho
      P86 MUTANT: tran T3 4->5 -> do dung cho
      P86 MUTANT: xoa ve moc phat hanh -> do dung cho
      P86 MUTANT: them cong nhung giu ngan sach -> do dung cho

  But the contract requires (contract.md AC-7) "mỗi ca ĐỎ, gọi tên vế hỏng, và NÊU CON SỐ THẬT đã trích (ca một in `9`)" and AC-8 "dòng đỏ nêu cả hai số thật"; evals.yaml E7 states the red line "phải NÊU SỐ THẬT đã trích — chứa `9` — chứng minh con số là dữ liệu chứ không phải chữ trong câu", and E8 expects the printed line to carry both real numbers.

  Neither is observable. The messages exist internally (re-ran the extracted block printing `d`: `ngan sach luot 9 != so cong 4 - 1`, `them cong ...: ngan sach luot 3 != so cong 5 - 1`) but are thrown away. A verifier grepping the E7 expected string finds `9` only inside the hardcoded mutant NAME `"ngan sach luot 3->9"` — i.e. the check would be satisfied by literal text in the test source, which is exactly the "number is prose, not data" failure mode this round was opened to close. Likewise nothing asserts the message "gọi tên vế hỏng": the four new mutants would still report `do dung cho` if `ngan_sach()` regressed to always returning its error string for the wrong clause, or named the wrong copy.

  Fix: print `d` (or pass a `phai_neu`-style substring per new mutant, e.g. `"ngan sach luot 9 !="`, `"tran T3 5 !="`, `"«moc phat hanh»"`, `"!= so cong 5 - 1"`) so the emitted evidence actually contains the extracted values.
  (source: bugs)

- **E1 expects the positive control to print "ba mốc đã neo nguyên văn" but only two anchors exist and both print abbreviated to 8 chars**
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml:17`
  severity: medium
  AC: AC-1
  E1's expected string is "`Results: chan lane-doc-khong-doi passed`; dòng đối chứng dương in ba mốc đã neo nguyên văn". The implementation defines only two anchored constants (rang.sh:85 `MOC_KY`, rang.sh:86 `MOC_GOP`) — the third SHA in the file (`5c15e065`) appears only inside a comment and is never checked — and contract.md Notes itself says "Hằng mốc là **hai** sha viết trong răng". rang.sh:83's own comment is also wrong: "Ba mốc dưới đây là hằng có chủ ý" followed by two definitions.

  And nothing is printed "nguyên văn": the two OK lines emit truncated forms via `${MOC_KY:0:8}` / `${base:0:8}..${tip:0:8}`. Observed output:

      OK: vế lane (sống) — feature-loop/workflows/acceptance-verify.js trên cây giống bản tại mốc ký 9b3d6f64
      OK: vế tập-file (chứng-một-lần) — trong 1765b550..9b3d6f64 tập file mã đổi = {feature-loop/scripts/s4-args.mjs}

  A verifier matching E1's expected literally (three anchors, verbatim SHAs) cannot pass on real output; the only way E1 goes green is by not actually being matched. Either print the full SHAs and say "hai mốc", or reword E1 and the rang.sh:83 comment to two abbreviated anchors.
  (source: bugs)

- **"hai lượt một kết quả" compares only stdout and discards both exit codes — two identical failures report PASS**
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:229`
  severity: low
  AC: AC-1
      L1="$(lane_song "$KIT"; tap_file "$KIT" "$MOC_GOP" "$MOC_KY")"
      L2="$(lane_song "$CL2"; tap_file "$CL2" "$MOC_GOP" "$MOC_KY")"
      if [ "$L1" = "$L2" ]; then ok "hai lượt một kết quả: ... GIỐNG NHAU từng byte"; else bad ...

  The return codes of all four calls are dropped; only the captured text is compared. `$CL2` is a clone of `$KIT`, so both runs share an object store: if the anchored SHAs are missing (rewritten history, shallow clone), both sides emit the identical `DO: mốc đã neo không có trong kho: …` and this check prints PASS while claiming the measurement succeeded on two trees. Same for any other symmetric failure. It is currently shadowed by the direct assertions earlier in the chan (so the chan still exits non-zero), but the PASS line itself is misleading evidence for AC-1. Require both halves to also succeed, e.g. capture rc for each and gate on `rc==0 && "$L1" = "$L2"`.
  (source: bugs)

- **Hình dạng 3 — «hai lượt một kết quả» so hai chuỗi HẰNG trong khi lời hứa là quan hệ (phép đo độc lập HEAD)**
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:229`
  severity: high
  AC: AC-1
  L1 (dòng 227) và L2 (228) là stdout của `lane_song` + `tap_file`. Nhìn hai hàm: dòng OK của `lane_song` in `$REL_WF` + `${MOC_KY:0:8}`; dòng OK của `tap_file` in `${base:0:8}..${tip:0:8}` + `$REL_S4` — TOÀN BỘ là hằng của script, không một byte nào lấy từ nội dung kho đang đo. Nên `[ "$L1" = "$L2" ]` ở dòng 229 chỉ có thể lệch khi một vế ĐỎ, mà vế đỏ ấy đã bị hai assert ở dòng 182–185 bắt trước rồi. AC-1 và E1 khai đây là «cách bắt đường phụ thuộc HEAD còn sót»; đó là một QUAN HỆ (kết quả không đổi theo HEAD), không phải hai chuỗi bằng nhau. Đã chứng minh trên clone: đổi `lane_song` sang bản phụ thuộc HEAD (`git diff --quiet "$MOC_KY"..HEAD -- "$REL_WF"`) — đúng thứ ô này tuyên bắt — nhóm vẫn `Results: chan lane-doc-khong-doi passed (7 pass, 0 do)` và chính dòng «hai lượt một kết quả» vẫn PASS.
  (source: measurement)

- **Hình dạng 4 — bốn đột biến P86 mới assert âm tính trần, không ghim thông điệp; bằng chứng «có số 9» đến từ tên ca hardcode**
  file: `tests/plugins/run-tests.sh:11073`
  severity: high
  AC: AC-7
  Bốn ca mới (11068–11071: `ngan sach luot 3->9`, `tran T3 4->5`, `xoa ve moc phat hanh`, `them cong nhung giu ngan sach`) đều truyền `phai_neu=None`. Vòng lặp 11073–11077 khi đó chỉ chạy `assert d is not None` — đỏ vì BẤT KỲ lý do gì cũng đạt — và bỏ qua nhánh `if phai_neu:` (11076), tức không ghim một mảnh nào của thông điệp đỏ. Dòng in ra ở 11078 là chuỗi đóng hộp `P86 MUTANT: {ten} -> do dung cho`; nội dung `d` không bao giờ được in hay assert. Hệ quả: AC-7/E7 đòi «dòng đỏ phải NÊU CON SỐ THẬT đã trích (ca một in `9`)» và AC-8/E8 đòi «dòng đỏ nêu cả hai số thật» — cả hai không có phép đo nào. Con số `9` mà người đọc bằng chứng thấy trong output nằm trong TÊN CA hardcode `"ngan sach luot 3->9"`, không phải giá trị máy trích. Kiểm chứng: chạy lại khối P86 với `print(d)` cho thấy thông điệp thật đúng như hợp đồng mong, nhưng khối như đang giao vẫn xanh nếu thông điệp ấy đổi thành bất cứ chuỗi nào khác.
  (source: measurement)

- **Hình dạng 5 — AC-2 tuyên lớp «kể cả sửa chưa commit», chiều đỏ 1 chỉ có điểm-case đã commit**
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:190`
  severity: high
  AC: AC-2
  AC-2 và E2 khai rõ vế lane so CÂY LÀM VIỆC «không so HEAD: sửa chưa commit cũng bị bắt» — một lớp hai phần tử {đã commit, chưa commit}. Chiều đỏ duy nhất dựng cho vế này (dòng 190) tiêm rồi `git -C "$CL" commit -qam "tiem"`, tức chỉ đo phần tử «đã commit»; không có ca nào để thay đổi ở trạng thái dirty. Vì vậy assert ở 192 không phân biệt được `git diff "$MOC_KY" -- "$REL_WF"` (bản đang giao) với `git diff "$MOC_KY"..HEAD -- "$REL_WF"` (bản phụ thuộc HEAD): thay bằng bản sau, dòng «chiều đỏ 1» vẫn PASS (đã chạy thử trên clone). Bằng chứng cho phần tử còn lại được E2 dẫn bằng lời — «Đã phá thử tay 06/09 … nhóm FAILED (5 pass, 2 do)» — tức nằm ngoài lưới, không tái lập được khi chạy lại ô.
  (source: measurement)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **AC-6 của hồ sơ ĐÃ KÝ `inputs-tinh-tu-goc-kho` giờ mô tả một phương pháp không còn tồn tại (`git merge-base`, «chiều đỏ trên clone tạm» cho cả hai vế)**
  Người dùng thấy gì: Tài liệu mô tả cách đo của một tính năng cũ đã không còn khớp với cách hệ thống thực sự kiểm tra thay đổi mã nguồn nữa; ai đọc lại tài liệu đó sau này có thể hiểu nhầm cách phép kiểm tra hoạt động.
  file: `_acceptance/inputs-tinh-tu-goc-kho/contract.md`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/inputs-tinh-tu-goc-kho/contract.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
