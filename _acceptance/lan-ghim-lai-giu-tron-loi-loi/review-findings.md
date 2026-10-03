# Review findings: lan-ghim-lai-giu-tron-loi-loi (round 1)

## Trong hợp đồng

- **The E7 base engine is not built from full scripts+lib as AC-7 and the repo convention require**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/ban-base.mjs:8`
  severity: medium
  AC: AC-7
  source: conventions
  detail: AC-7 says the base is built with '`git archive` merge-base trọn `scripts lib feature-loop`'. CLAUDE.md also requires that a comparison base be taken as whole directories (`git archive <sha> scripts lib`), citing P150. banBase only archives `feature-loop`. chayLan then runs the base with `--ag-root KIT`, so it uses the CURRENT lib/ and scripts/ (recheck-evidence, evidence-core). The result is a hybrid engine that never existed at any commit. The comment justifies this with 'vòng này không sửa lib', but the eval lives on in later re-pin campaigns. Once lib/scripts change after merge, the base side compares old feature-loop against new lib and can go red from infrastructure, which is exactly the P150 class. The default ref `origin/main` also drifts: after merge, merge-base(HEAD, origin/main) == HEAD, so the base leg compares the tree with itself. Only the pinned codes 0·1·1·1·2 still give that leg any teeth.
  rationale: AC-7 ghi rõ bản base dựng bằng git archive trọn scripts, lib, feature-loop; bản dựng chỉ lấy feature-loop nên so sánh nhẹ hơn hợp đồng.

- **E6 does not test the 'red lane still exits 1 and still writes its mark' leg of AC-6(c)**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs:33`
  severity: medium
  AC: AC-6
  source: conventions
  detail: In AC-6(c), when the swap source is broken, the lane must still exit 1 and still write the repin-do line ('và làn đỏ VẪN thoát 1, VẪN ghi dấu'). chan-tai-may.mjs only imports tai-may.mjs directly and checks `swap_used_mb: null` + `nen`, plus the red direction (catch removed → throw). It never runs repin-lane.mjs with an engine copy whose NGUON_SWAP is injected. So the integration path (repin-lane calls docTai() unguarded at the red-path write) has no measurement in either the red or the green direction. That falls under the CLAUDE.md invariant 'Thước phải gắn vào vật được giao' (measuring the module instead of the delivered output). Fix: in chan-tai-may, use banSao on the whole feature-loop/ with NGUON_SWAP injected into feature-loop/scripts/tai-may.mjs, then run a red lane and assert exit 1 + one repin-do line with tai.nen != null.
  rationale: AC-6(c) đòi rõ làn đỏ vẫn thoát 1 và vẫn ghi dấu khi đọc swap lỗi; phép đo không chạy làn nên chân này không được đo.

- **E6 never checks AC-6(c): that the red lane still exits 1 and still writes repin-do when reading swap fails**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs:38`
  severity: medium
  AC: AC-6
  source: bugs
  detail: AC-6(c) and the E6 expected text both say: point the swap source at a missing path → «làn đỏ dùng bản sao ấy VẪN mã 1, VẪN có dòng repin-do». chan-tai-may.mjs only imports tai-may.mjs and calls docTai() directly; it never runs repin-lane (no chayLan or banSao of feature-loop). The red side («tải máy làm sập làn») only shows that docTai throws, not that the lane crashes. In repin-lane.mjs:523, `const tai = docTai();` sits outside any try. If it threw, Node would exit with an uncaught exception, which is also exit code 1 (the same as a normal red lane), and no repin-do line would be written to any slug. Exit code alone cannot tell the two cases apart, and the lane-level check that would (count repin-do lines when the injected copy runs) does not exist. The AC-6 clause is claimed but unmeasured.
  rationale: Trùng t3: chân «làn đỏ vẫn thoát 1 và vẫn ghi dấu» của AC-6(c) không được đo.

- **The base build archives only feature-loop/, while AC-7 and evals.yaml say scripts, lib and feature-loop**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/ban-base.mjs:11`
  severity: low
  AC: AC-7
  source: bugs
  detail: AC-7 and the evals.yaml header say the base is built with `git archive <merge-base> scripts lib feature-loop`. ban-base.mjs archives only `feature-loop`, and chayLan always passes `--ag-root KIT` (the current tree's lib). So the base lane in E7 runs on the current lib/scripts, not the base ones. This diff does not touch lib/ or scripts/, so there is no effect today. But the comparison is narrower than the contract says: a later change to lib/evidence-core.cjs that alters exit codes would show up identically on both sides and E7 would stay green.
  rationale: Trùng t2: AC-7 ghi trọn scripts lib feature-loop, bản dựng chỉ lấy feature-loop.

- **Hình dạng 1 (đo vật trung gian thay vì đầu ra): E6(c) và chiều đỏ «tải máy làm sập làn» không bao giờ chạy làn**
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs:37`
  severity: medium
  AC: AC-6
  source: measurement
  detail: AC-6(c) và evals.yaml E6 hứa: với nguồn swap trỏ tới đường không tồn tại, «làn đỏ dùng bản sao ấy VẪN mã 1, VẪN có dòng repin-do». Chiều đỏ được ghim là «tải máy làm sập làn». Nhưng chan-tai-may.mjs chỉ import tai-may.mjs rồi gọi docTai() trực tiếp. Dòng 37 assert swap_used_mb null kèm nen, dòng 43 assert «mô-đun ném». Không chỗ nào gọi chayLan, không đọc mã thoát hay run-log của làn. Đầu ra được giao là làn (repin-lane.mjs gọi `const tai = docTai();` mà không bọc try), nhưng thước chỉ đo mô-đun. Thêm một lý do chỉ mã thoát là không đủ: một exception không bắt trong node cũng thoát 1, nên «vẫn mã 1» không phân biệt được làn sống với làn sập. Chỉ việc dòng repin-do có mặt mới phân biệt được, và chân này không kiểm nó. Phụ thêm ở dòng 42–43: `nap(saoDo)` nằm trong cùng khối try với docTai(), nên bản sao import hỏng cũng cho nem=true, chiều đỏ không phân biệt «ném vì bỏ catch» với «mô-đun không nạp được».
  rationale: Trùng t3/t9: AC-6(c) và chiều đỏ ghim «tải máy làm sập làn» yêu cầu làn thật chạy, phép đo chỉ gọi mô-đun.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A green lane still writes a log file when an eval declares a non-zero expected exit**
  Người dùng thấy gì: Với kho có bài kiểm khai sẵn «đạt kèm giới hạn», lượt ghim vẫn xanh nhưng để lại một tệp nhật ký thừa trong thư mục tự ẩn khỏi git. Không đổi kết quả xanh/đỏ, chỉ thêm tệp rác vô hại.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **--run-id becomes a filesystem path component without validation**
  Người dùng thấy gì: Nếu người chạy làn gõ nhãn lượt chứa dấu gạch chéo lạ, nhật ký có thể bị ghi ra ngoài thư mục dành cho nó. Nhãn do chính phiên làm việc đặt nên rủi ro thấp.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **E4 does not measure every run-log reader: carry-plan.mjs is missing from the list**
  Người dùng thấy gì: Một công cụ đọc sổ lượt chạy của kho không nằm trong danh sách được kiểm tra «không bị dòng mới làm đổi kết quả». Hiện chưa thấy nó đổi hành vi, nhưng chưa có phép đo chứng minh.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

- **The `lech` predicate now has three copies; the new property also leaks eval objects into stdout**
  Người dùng thấy gì: Cùng một quy tắc «lệch kỳ vọng» được viết ở ba chỗ và đầu ra của làn có thêm một khoá phụ. Hiện kết quả đúng; rủi ro chỉ là sau này sửa một chỗ mà quên chỗ khác.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: wont-fix

- **Docs describe the log directory as repin-<run_id>, but the code never doubles the prefix**
  Người dùng thấy gì: Tài liệu chỉ đường tới thư mục nhật ký hơi khác thư mục thật; ai tự ghép đường theo tài liệu sẽ không thấy tệp. Đường đúng vẫn được in sẵn ở cuối mỗi lượt đỏ.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **A green lane still writes run logs when an eval passes with its declared non-zero exit code**
  Người dùng thấy gì: Lượt ghim xanh ở kho có bài kiểm «đạt kèm giới hạn» vẫn tạo tệp nhật ký thừa và in ra như thể có lỗi. Kết quả không sai, chỉ gây nhiễu và tệp rác ẩn khỏi git.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **The «lech-ky-vong» reason is dead code, and the AC-3/E3 case it serves can never happen**
  Người dùng thấy gì: Một tình huống hiếm được nhắc trong lời hứa của tính năng thực tế không thể xảy ra, nên người dùng không bị ảnh hưởng. Chỉ là mô tả dư.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): các chiều đỏ của E3/E1/E7 xanh cả khi bản sao làn chết sớm**
  Người dùng thấy gì: Một số phép thử «cố ý phá để thấy đỏ» có thể vẫn xanh nếu bản thử hỏng sớm vì lý do khác. Kết quả thật của tính năng không đổi, chỉ độ tin của phép thử giảm một chút.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng rút bằng từ vựng): E4 bỏ sót bộ đọc run-log carry-plan.mjs**
  Người dùng thấy gì: Một công cụ đọc sổ lượt chạy không được kiểm xem dòng mới thêm có làm nó đổi hành vi không. Đọc mã thì nó vẫn im, nhưng chưa có phép đo xác nhận.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: hàng repin-lane.mjs trong E4 so bằng nhau trên đường không đọc run-log, còn đối chứng dương lại đo đường khác**
  Người dùng thấy gì: Một phép thử «đọc sổ không đổi kết quả» chạy trên đường không thật sự đọc sổ, nên nó xanh theo cấu trúc. Người dùng không bị ảnh hưởng, chỉ là phép thử này không chứng minh thêm điều gì.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: ô «eval lệch kỳ vọng mà thoát 0 → log null kèm ly_do» được hứa trong E3 nhưng không fixture nào sinh ra**
  Người dùng thấy gì: Một tình huống hiếm được hứa trong mô tả không có phép thử riêng, vì có thể nó không bao giờ xảy ra. Không ảnh hưởng người dùng.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/evals.yaml`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 10/16 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/ban-base.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/bo-doc.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
