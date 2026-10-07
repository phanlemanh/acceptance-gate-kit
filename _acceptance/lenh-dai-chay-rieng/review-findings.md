# Review findings: lenh-dai-chay-rieng (round 5)

## Trong hợp đồng

- **LN6b case was deleted from the test, but eval E3 still requires PASS: LN6b, so E3 now fails and the stored-start-time rule has no test**
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs:262`
  severity: high
  AC: AC-3
  source: conventions
  detail: Commit f743960d replaced the whole LN6b block with the new LN6c block instead of adding LN6c next to it. LN6b set a start mark 120 s in the past with a 1-minute limit and expected __QUA_HAN; its mutant overwrote the mark on every wait. Now no check('LN6b …') is left in the file. The eval executor `ldcr_chay_nen_that` in _acceptance/config.yaml (line 435), which is E3's cmd, still loops over `LN1 LN2 LN3 LN4 LN5 LN6 LN6b LN6c LN7 LN8` and runs `grep -qF "PASS: $c " || exit 1`. The test run exits 0 and every LN case prints PASS except LN6b, which is missing, so E3 exits 1 and turns red on infrastructure, not on the product: the next S4 round gets a false FAIL. There is a second gap: the rule in CHO_NEN that keeps the stored mark (`[ -f "$L.bat-dau" ] || { date +%s > … }`) no longer has a red-direction test. AC-3(ii) in contract.md and E3's description in evals.yaml (line 61) still promise «mốc 120 s trước với hạn 1 phút trả __QUA_HAN; đỏ: ghi đè mốc mỗi lần → hạn chờ dời theo mỗi lần chờ», but no case checks it. LN6 only checks that the mark gets created. Fix: put the LN6b block back next to LN6c. The owner's scope cut only removed orphan-tree cleanup (LN9 and the old LN7), not LN6b.
  rationale (triage): AC-3 mục (ii) còn nguyên vế «mốc 120 s trước với hạn 1 phút trả __QUA_HAN» kèm chiều đỏ «ghi đè mốc mỗi lần»; ca LN6b là bằng chứng duy nhất của vế đó và đã bị xoá, mà mục Out of scope không loại nó (thu phạm vi chỉ gỡ bước dọn cây mồ côi).

- **Eval E3 always fails: config still requires `PASS: LN6b`, but this round deleted the LN6b case**
  file: `_acceptance/config.yaml:435`
  severity: high
  AC: AC-3
  source: bugs
  detail: In f743960d the `LN6b` block in tests/workflows/lenh-dai-chay-rieng.test.mjs was overwritten by the new `LN6c` block instead of being kept next to it. LN6b checked that the deadline counts from the stored start time (start mark 120 s ago, 1-minute limit → __QUA_HAN). Its red direction was a mutant that rewrites the mark on every wait. The test file no longer contains LN6b: grep finds no `check('LN6b`, and the full run prints no `PASS: LN6b` line. The config entry `executors.script.ldcr_chay_nen_that` (line 435) still loops over `LN1 … LN6 LN6b LN6c LN7 LN8` and runs `grep -qF "PASS: $c " || exit 1`. evals.yaml E3 (line 61) also still describes LN6b. Reproduced: `node tests/workflows/lenh-dai-chay-rieng.test.mjs` exits 0 and every other LN case passes, yet the E3 command exits 1 (`MISSING LN6b`). So the AC-3 eval is red on any build, whatever the code does. Also, the deadline-must-not-move behaviour of the wait command in acceptance-verify.js (`[ -f "$L.bat-dau" ] || { date +%s > … }`) has lost its only test, and nothing checks its red direction any more. Fix: restore the LN6b block next to LN6c, or remove LN6b from both config.yaml and evals.yaml. Removing it drops coverage of that behaviour.
  rationale (triage): Cùng gốc với mục trên: lệnh eval E3 của AC-3 đòi ca LN6b không còn được phát ra nên eval đỏ vì hạ tầng, và vế (ii) của AC-3 (hạn tính từ mốc đã lưu) mất chiều xanh lẫn chiều đỏ; không mục nào trong Out of scope phủ.

- **Hình dạng 5 — danh sách ca viết trước lệch với ca thật: ca LN6b đã bị xoá khỏi test, nhưng cổng E3 vẫn đòi «PASS: LN6b»**
  file: `_acceptance/config.yaml:435`
  severity: high
  AC: AC-3
  source: measurement
  detail: Commit f743960d viết đè khối LN6b trong tests/workflows/lenh-dai-chay-rieng.test.mjs bằng LN6c. LN6b là ca kiểm quan hệ «hạn chờ tính từ mốc đã lưu, không dời theo mỗi lần chờ»: mốc đặt 120 s trước, hạn 1 phút, kết quả phải là __QUA_HAN; chiều đỏ dùng KIM_GIU / MUTANT_DOI. Tệp test ở HEAD không còn chuỗi LN6b nào (`git show HEAD:… | grep -c LN6b` = 0). Phần mã được ca này canh vẫn còn trong CHO_NEN của acceptance-verify.js:714 (`[ -f "$L.bat-dau" ] || { date +%s > … }`). Thế nhưng lệnh cổng `ldcr_chay_nen_that` ở config.yaml:435 vẫn lặp `for c in LN1 LN2 LN3 LN4 LN5 LN6 LN6b LN6c LN7 LN8` và đòi `grep -qF "PASS: $c "`, còn evals.yaml:61 vẫn mô tả LN6b trong expected của E3. Đã chạy thật: test thoát 0 với 31 PASS, mọi LN khác đều có PASS, riêng «PASS: LN6b » không xuất hiện; đưa đầu ra đó qua đúng vòng kiểm của cổng thì báo «MISSING LN6b», tức `exit 1`. Hệ quả có hai chiều. (i) E3 đỏ ở mọi lượt chấm, dù vật đúng hay sai; màu đỏ đến từ chính phép đo chứ không từ vật, nên E3 không còn phân biệt được gì. (ii) Lời hứa quan hệ «mốc không dời» mất cả chiều xanh lẫn chiều đỏ trong bộ kiểm, trong khi hồ sơ vẫn ghi là có đo; bản sao ghi đè mốc mỗi lần sẽ không bị ca nào bắt. Danh sách ca trong config/evals là ma trận viết trước, nhưng không còn khớp một-một với các ca mà test thực sự phát ra.
  rationale (triage): Cùng một lỗi với hai mục trên nhìn từ góc danh sách ca: AC-3 (ii) vẫn cam kết ca mốc-đã-lưu có chiều đỏ, nhưng test không còn phát ca đó và eval E3 đòi nó, nên AC-3 không thể đạt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

(không có mục nào)

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
