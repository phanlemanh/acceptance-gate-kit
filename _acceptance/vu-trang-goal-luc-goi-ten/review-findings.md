# Review findings — vu-trang-goal-luc-goi-ten (round 1)

## Trong hợp đồng

- **Bộ đọc id evals.yaml thứ ba tự viết — trái chú thích lib/eval-yaml.js «không mọc bản thứ ba»; quét cả thân block nên fail-open đúng chiều AC-7 canh** (`tests/scripts/run-log-minted.mjs:23`, severity medium, nguồn conventions) — `matchAll(/^\s*-\s*id:\s*(\S+)/gm)` là bộ đọc evals.yaml mới trong khi `lib/eval-yaml.js` (dùng chung bởi gate-card.js, eval-coverage-lint.js, product-map, start-scan…) ghi rõ ở đầu file: «Hai bản sao của cùng parser đã trôi cùng nhau; sửa một chỗ tại đây, không mọc bản thứ ba», và luật 2 của nó: dòng THÂN block (`expected: >`) không bao giờ được quét key — «- id: …» trong thân không được cướp state. Đã tái hiện trên fixture code-sinh: evals.yaml có một eval E1 với `expected: >` mà thân chứa dòng `- id: E9`; run-log chỉ có `minted-s-E9-r1` → script in `AC-7 OK: 1 dong, vong r1, 1 ts`, exit 0; `parseEvals` cùng file trả `['E1']`. Tức ca tự kiểm «id ngoai evals.yaml (E9) du dang minted -> exit 1» bị vô hiệu khi chuỗi id xuất hiện trong thân expected — chiều fail-open, ngược nếp «đảo chiều mặc định» (bất định → đỏ). Thân `expected` trong kho này thường xuyên nhắc id/fixture (E3 của chính hồ sơ này nêu «GL01», gap-probe nêu `lmcms-E3-r1`), nên kịch bản là thật. Nếp đúng: rút id qua `parseEvals(text, [])` từ lib. Vì sao tính vào hợp đồng: AC-7 đòi script tự thoát 1 khi có run_id mang id ngoài evals.yaml; bộ đọc id lỗi khiến đúng ca đó lọt qua (exit 0 thay vì 1), tức đầu ra của chính script AC-7 chỉ định không đúng như Then-clause hứa. AC: AC-7

- **Thước AC-7 đồng nhất «đi qua Workflow» với «run_id dạng minted-», nhưng bên viết có nhánh ghi run_id do verifier khai — Workflow thật vẫn bị gọi là «khong do workflow duc»** (`tests/scripts/run-log-minted.mjs:35`, severity medium, nguồn conventions) — RX chỉ chấp nhận `^minted-<slug>-(<id>|SUITE-…)-r\d+$`. Bên viết `feature-loop/workflows/acceptance-verify.js` có hai nhánh ghi run_id (dòng 618 chú thích: «verifier có runId thật → dùng; rỗng → mint»; hiện thân ở dòng 679 `ridTho` và 702 `(m.runId && …) || minted-…`), và MACHINE_SCHEMA dòng 113 dặn executor khai `runId: 'run_id tu stdout neu co'`. Nghĩa là một vòng S4 đi đúng qua Workflow mà executor nhặt được run_id từ stdout (suite của kit in nhiều chuỗi `run_id:` trong output ca fixture) sẽ có dòng run-log KHÔNG dạng minted → script thoát 1 «run_id khong do workflow duc» ngay lúc trình Cổng 2 (thời điểm duy nhất nó chạy) → AC-7 rơi vào Known limits oan, đúng lớp «đỏ vì phép đo, không vì vật» mà gap-probe vòng 2 nêu cho E9. Gap-probe đã đối chiếu dòng 679/702 nhưng bỏ sót nhánh `m.runId`. Cặp ca hai chiều trong run-log-minted.test.mjs không có ca cho nhánh này. Nghiệm đúng tầng: hoặc chấp nhận nhánh verifier-khai (vd đọc `evalId` + `round` + một `ts`/vòng làm vết Workflow thay vì hình dạng chuỗi), hoặc khai giới hạn này ở AC-7/Notes. Vì sao tính vào hợp đồng: AC-7 hứa script phân biệt đúng vòng đi qua Workflow thật; finding chứng minh bằng dữ liệu run-log thật trong kho rằng một vòng Workflow hợp lệ vẫn bị script báo đỏ nhầm, tức Then-clause của AC-7 không giữ đúng cho ca này. AC: AC-7

- **run-log-minted.mjs rejects two legitimate Workflow-produced run-log shapes (false RED for AC-7)** (`tests/scripts/run-log-minted.mjs:38`, severity medium, nguồn bugs) — The script assumes (1) exactly one `ts` per round and (2) every eval `run_id` is `minted-<slug>-<id>-r<n>`. Both are violated by the real writer. (1) `feature-loop/skills/feature-loop/SKILL.md` line 227 says a round is re-run in the SAME round when the synthesize report is empty (`rỗng → chạy lại S4 cùng round`), and `feature-loop/scripts/s4-args.mjs` line 256 mints a fresh `invokedAt` per invocation — so a re-invoked round has two `ts` with all-`minted-` ids. Real data in the repo: `_acceptance/suite-run-log-provenance/run-log.jsonl` round 5 has 12 rows at 2026-08-29T07:32:07Z and 13 rows at 08:00:42Z, every run_id `minted-…`; running `node tests/scripts/run-log-minted.mjs --slug suite-run-log-provenance --root .` today exits 1 with `hai ts trong mot vong: r5 co 2 ts khac nhau`. Same pattern in release-2-2-0 r5, gap-probe-presence-hook r1–r3, moi-noi-vong-trao r2, ra-co-ten-lam-va-trao r4. (2) `feature-loop/workflows/acceptance-verify.js` line 702 (`const rid = (m.runId && String(m.runId).trim()) || \`minted-${args.slug}-${evalId}-r${args.round}\`) and line 679 for suites prefer a run_id the verifier captured from stdout over minting, so a Workflow-driven eval can legitimately carry a non-minted id. Real data: `_acceptance/lan-v-khong-phai-cho-ky/run-log.jsonl` round 6, evalId E9, `run_id: b67cepxx0`, cmd `bash tests/plugins/run-tests.sh` (the other 8 rows are minted) — the checker exits 1 `run_id khong do workflow duc: b67cepxx0`. This feature's own evals use the same executors, so both paths are reachable at its Gate 2; a RED from this script therefore does not prove S4 was run by hand, which is what AC-7 uses it to certify. The regex check is at lines 35–37, the ts check at lines 38–39. Vì sao tính vào hợp đồng: Finding nêu đích danh AC-7 và chứng minh bằng dữ liệu thật rằng script có thể báo đỏ nhầm cho hai hình dạng run-log hợp lệ do Workflow sinh ra, vi phạm trực tiếp cam kết "đối chứng hai chiều... run-log đúc → xanh" của AC-7. AC: AC-7

- **Hình dạng 2 (biến thể) — Kỳ vọng goal_line chép nguyên công thức bên viết, không độc lập như AC-2 đòi** (`tests/scripts/gate-card-goal.test.mjs:27`, severity low, nguồn measurement) — Dòng 27 `expectLine = slug => TPL.trim().split('\n').join(' ').split('<slug>').join(slug)` giống từng ký tự với `goalLine` của bên viết (`scripts/gate-card.js` dòng 110: `GOAL_TEMPLATE.trim().split('\n').join(' ').split('<slug>').join(s)`). Chú thích dòng 26 nói «không chép replaceAll của bên viết» nhưng bên viết không dùng replaceAll — nó dùng đúng chuỗi split/join này; AC-2 ghi rõ «không chép hàm thay của bên viết». Lỗi nào trong phép biến đổi (dòng khuôn có khoảng trắng đuôi → hai khoảng trắng; biến thể `<slug>`) được tái tạo y hệt hai bên nên GL01 vẫn xanh — thước mắc đúng lỗi nó đi bắt. GL01 thực chất chỉ chứng «goal_line suy từ hằng trong marker với slug này». Dựng độc lập: regex `/<slug>/g` + gộp dòng bằng `/\s*\n\s*/`, hoặc assert cấu trúc (không `\n`; số lần xuất hiện slug == 2; sáu dòng khuôn nối lại bằng đúng một khoảng trắng). Vì sao tính vào hợp đồng: AC-2 ghi rõ, trực tiếp bằng chữ: test dựng kỳ vọng bằng phép thay ĐỘC LẬP, "không chép hàm thay của bên viết"; finding chứng minh test hiện tại dùng công thức giống hệt hàm của bên viết — vi phạm thẳng câu chữ này. AC: AC-2

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **routing-baseline dòng mới đã lỗi thời ngay tại HEAD — LM20 đỏ, suite scripts (verifier của E2/E3 và suite_keys S4) exit 1**
  Người dùng thấy gì: Một bộ kiểm tra tự động dùng chung sẽ báo đỏ vì một ghi chú định tuyến của một tính năng cũ khác chưa cập nhật kịp theo thay đổi lần này — không phải lỗi của tính năng đang xét, nhưng có thể khiến vòng kiểm tra tổng thể báo sai cho tới khi được cập nhật lại.
  file: `_acceptance/loi-moi-cong-may-sinh/routing-baseline.txt`
  severity: high
  Đề xuất: known-limits

- **gate-card-goal.test.mjs chép tay bộ dựng fixture thay vì tách helper dùng chung — trái Plan Task 3 và nếp repin-fixture.mjs**
  Người dùng thấy gì: Bộ kiểm thử cho tính năng này tự chép lại một phần dữ liệu mẫu thay vì dùng lại phần đã có sẵn — nếu sau này khuôn dữ liệu đổi, một trong hai bản có thể quên cập nhật và tiếp tục báo 'đạt' dù đã lỗi thời.
  file: `tests/scripts/gate-card-goal.test.mjs`
  severity: low
  Đề xuất: known-limits

- **tests/scripts suite is RED at HEAD: LM20 routing-baseline line for vu-trang-goal-luc-goi-ten no longer matches the card (introduced by this diff)**
  Người dùng thấy gì: Một bộ kiểm tra tự động dùng chung sẽ báo đỏ vì một ghi chú định tuyến cũ chưa cập nhật kịp theo thay đổi lần này — không phải lỗi của tính năng đang xét, nhưng khiến vòng kiểm tra tổng thể báo sai cho tới khi được cập nhật lại.
  file: `_acceptance/loi-moi-cong-may-sinh/routing-baseline.txt`
  severity: high
  Đề xuất: known-limits

- **P85b assertion on the P85 title is a tautology and can never fail**
  Người dùng thấy gì: Một bước kiểm tự động vốn được đặt ra để bảo đảm một dòng tiêu đề đã cập nhật đúng thực chất luôn báo đạt bất kể tiêu đề đó đúng hay sai, nên nếu sau này có ai sửa nhầm dòng đó, hệ thống sẽ không phát hiện được.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture run-log viết tay đúng khuôn bên đọc, không round-trip từ writer thật (acceptance-verify.js)**
  Người dùng thấy gì: Bộ dữ liệu mẫu dùng để kiểm tra khả năng phân biệt vòng chạy hợp lệ được viết tay đúng ý người kiểm, thay vì lấy từ đầu ra thật của quy trình đang chạy — nên nếu quy trình thật sinh ra một hình dạng khác, bộ kiểm có thể không phát hiện.
  file: `tests/scripts/run-log-minted.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Assert nhãn «ba thời điểm» có mặt, trong khi AC-5 hứa NÊU ĐỦ ba thời điểm (quan hệ đếm)**
  Người dùng thấy gì: Bước kiểm tự động chỉ xác nhận có một dòng tiêu đề nói về 'ba thời điểm', chứ không đếm xem cả ba thời điểm có thật sự được liệt kê đủ hay không — nên nếu sau này ai đó lỡ xoá mất một trong ba, hệ thống sẽ không phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Hai assert vắng-chuỗi «hai bản» đứng một mình, không đối chứng dương**
  Người dùng thấy gì: Hai bước kiểm chỉ xác nhận một cụm từ cũ KHÔNG còn xuất hiện, nhưng chưa từng được thử xem chúng có thật sự phát hiện được cụm từ đó nếu nó quay lại hay không — nên độ tin cậy của các bước kiểm này chưa được chứng minh.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — Neo tìm trên TOÀN file trong khi AC-4 hứa vị trí trong mục có tên (S1#1 · S1#5 · S1#7 · Gate 1 · S2#3)**
  Người dùng thấy gì: Các bước kiểm tự động chỉ xác nhận một câu có xuất hiện đâu đó trong toàn bộ tài liệu hướng dẫn, chứ không xác nhận câu đó nằm đúng mục quy định — nên nếu sau này câu đó bị dời sang mục khác, hệ thống vẫn báo đạt dù vị trí đã sai.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — AC-3 nêu lớp «thẻ đỏ» gồm rơi bậc / g1Blocked, GL03 chỉ có điểm-case rơi bậc**
  Người dùng thấy gì: Bộ kiểm chỉ thử một trong hai tình huống 'thẻ đang bị gắn cờ cảnh báo' mà lẽ ra nên thử cả hai — hiện tại chưa có ảnh hưởng thật vì cấu trúc hiện hành, nhưng nếu sau này có thay đổi thì lỗ hổng kiểm tra này mới lộ ra.
  file: `tests/scripts/gate-card-goal.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
