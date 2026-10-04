# Review findings: nhan-lan-v-theo-huong (round 1)

## Trong hợp đồng

- **nlvh_luat (E5) always fails: ONLY_BLOCK="P192 round-trip" matches no run() block**
  file: `_acceptance/config.yaml:503`
  severity: high
  AC: AC-5
  source: conventions
  detail: The `nlvh_luat` command ends with `ONLY_BLOCK="P192 round-trip" bash tests/plugins/run-tests.sh`. In run-tests.sh, ONLY_BLOCK only filters blocks called through `run()`, and only `run()` increments `only_matched` (lines 13-27). P192 is an inline `echo` + `pass`/`fail` block (lines 9764-9874), not a `run()` block, so `only_matched` stays 0. The guard at lines 11339-11343 then adds a failure ('ONLY_BLOCK=... khong khop khoi nao — go sai ten?') and the script exits 1. That happens even when P192 itself passes. Reproduced with `ONLY_BLOCK="P192 round-trip" bash tests/plugins/run-tests.sh --manh vung:3`, which prints 'PASS: P192 round-trip ...', then 'ONLY_BLOCK=P192 round-trip khong khop khoi nao', then 'Results: 1 failed', and exits 1. Two consequences: (1) E5 (AC-5) is red on every run whatever the change does. (2) As the run-tests.sh comment itself notes, every other inline block (~46) also runs under this filter, so the eval pays for most of the suite and goes red if any unrelated inline block fails. The shared condition is a 'measure that does not measure the object being delivered': the green state was never run, and the red state comes from the infrastructure, not from the change. Possible fixes: wrap P192 in `run()`, or call the P192 checker directly from nlvh-the.test.mjs. Do not use ONLY_BLOCK for an inline block.
  rationale: Phép đo E5 của AC-5 đỏ ở mọi lượt dù khối P192 mà AC-5 đòi «xanh» thật ra xanh, nên AC-5 không bao giờ chứng minh được là đạt.

- **Eval E5 (nlvh_luat) always exits 1: ONLY_BLOCK="P192 round-trip" matches no run() block**
  file: `_acceptance/config.yaml:503`
  severity: high
  AC: AC-5
  source: bugs
  detail: The `nlvh_luat` executor ends with `ONLY_BLOCK="P192 round-trip" bash tests/plugins/run-tests.sh`. ONLY_BLOCK only filters and counts blocks that go through `run()` (tests/plugins/run-tests.sh:14-27). P192 is an inline `echo`/`pass`/`fail` block at line 9764 that never calls `run()`, so `only_matched` stays 0. The guard at run-tests.sh:11340 then adds a failure ("ONLY_BLOCK=P192 round-trip khong khop khoi nao") and the script exits 1. Reproduced: `ONLY_BLOCK="P192 round-trip" bash tests/plugins/run-tests.sh --manh vung:3` prints `PASS: P192 round-trip ...`, then the ONLY_BLOCK miss message, then `Results: 1 failed`, exit=1. So E5 (AC-5) is red no matter what the deliverable does. Also, without `--manh`, the command runs every inline block in the whole plugins suite (~9 min, measured near the tool timeout) rather than just P192. Fix: wrap P192 in `run()` (or another named block the filter can see), or call P192's checker directly instead of going through ONLY_BLOCK.
  rationale: Cùng gốc với mục trên: lệnh đo E5 của AC-5 luôn thoát 1 do bộ lọc không khớp khối nào, nên AC-5 đỏ vì hạ tầng đo.

- **Lệnh E5 luôn đỏ vì hạ tầng: ONLY_BLOCK="P192 round-trip" không khớp khối run() nào (không thuộc 6 hình dạng; gần nhất là hình 4)**
  file: `_acceptance/config.yaml:503`
  severity: high
  AC: AC-5
  source: measurement
  detail: Lệnh `nlvh_luat` nối `... nlvh-the.test.mjs && ONLY_BLOCK="P192 round-trip" bash tests/plugins/run-tests.sh`. Trong run-tests.sh, P192 là khối viết thẳng (echo ở dòng 9764, pass/fail ở dòng 9874), không đi qua `run()`. Bộ lọc ONLY_BLOCK chỉ tăng `only_matched` trong `run()` (dòng 23-27), nên không khối nào khớp. Chốt chống xanh rỗng ở dòng 11340 khi đó cộng một lỗi và suite thoát 1. Đã chạy thật trên HEAD: P192 in «PASS: P192 round-trip ...», rồi in «ONLY_BLOCK=P192 round-trip khong khop khoi nao — go sai ten?» và «Results: 1 failed», exit=1. Nhóm NL-AC5-luat chạy riêng thì xanh 3/3. Kết quả là E5 (AC-5) đỏ ở mọi lượt chấm bất kể vật đúng hay sai: một lượt chấm bị hạ tầng đốt, và kỳ vọng «khối P192 (chạy riêng bằng ONLY_BLOCK) xanh» ở evals.yaml E5 không bao giờ đạt được. Lỗi này nằm ngoài sáu hình dạng đã giao, nhưng cùng một bản chất với hình 4: màu của phép đo không phản ánh vật. Ở đây là chiều ngược lại, đỏ dù vật đúng.
  rationale: Cùng lỗi với hai mục trên: lệnh đo E5 của AC-5 không bao giờ đạt, nên AC-5 không chứng minh được.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **NL-AC4-khep positive control is skipped silently when the base card fails to build**
  Người dùng thấy gì: Khi thẻ gốc không dựng được, một phép kiểm phụ có thể im lặng bỏ qua thay vì báo lỗi. Kết quả chung vẫn đỏ vì các phép kiểm chính cũng đỏ, nên người dùng không bị báo xanh giả.
  file: `tests/scripts/nlvh-the.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 6 (đo vật khác cây đang kiểm): NL-AC3-im dựng bản SAU từ commit `cuoi` trong lịch sử, không từ cây đang chấm**
  Người dùng thấy gì: Phép so sánh thẻ trước và sau chỉ đo đúng những lần sửa có đánh dấu tên vòng này. Nếu sau này có người sửa cách dựng thẻ mà không đánh dấu, phép so sánh vẫn báo xanh trên bản cũ.
  file: `tests/scripts/nlvh-the.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 4 (đối chứng dương có thể bỏ qua im lặng): đối chứng tiền đề của NL-AC4-khep thành no-op khi thẻ gốc không dựng được**
  Người dùng thấy gì: Một phép kiểm phụ của thẻ có thể bị bỏ qua mà không báo khi thẻ gốc hỏng. Rủi ro thấp vì các phép kiểm khác dựng cùng thẻ đó và sẽ đỏ.
  file: `tests/scripts/nlvh-the.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 5 (chốt «số assert = số hàng» là đếm vòng lặp, luôn bằng nhau): hai bộ đếm `n` không đo được gì**
  Người dùng thấy gì: Bộ kiểm có một chốt đếm hàng chỉ mang tính hình thức, nên chưa bắt được trường hợp một hàng mất phép kiểm. Hiện chưa có kết quả sai nào xảy ra vì mọi hàng vẫn đang được kiểm.
  file: `tests/scripts/nlvh-the.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
