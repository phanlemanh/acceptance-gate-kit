---
schema_version: 2
feature_slug: repo-khai-plugin
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, chạy tuần tự)
enforcement_mode: strict
bypass_used: false
verified_commit: e9205a96e2a74a940d32afabc57633070e314203
human_signoff:
---

# Evidence Report: repo-khai-plugin

Round 4 — lần đầu bằng chứng máy chạy được thật. Ba round trước BLOCKED vì hạ tầng
(bộ phân loại Bash rate-limited khi fan-out 23–28 agent); round này đi đường verify
độc lập, năm lệnh chạy tuần tự, mỗi lệnh một lượt.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E1b | AC-1 | test | PASS |
| E2b | AC-2b | test | PASS |
| E2c | AC-2c | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7b | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8b | test | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9b | test | PASS |
| E11 | AC-11 | test | PASS |
| E10 | AC-10 | judgment | UNCERTAIN |

## Bằng chứng gốc — một lượt chạy, mười tám ca

Cả 16 eval máy trỏ cùng một lệnh (`config:executors.test.plugins` =
`bash tests/plugins/run-tests.sh`). Lệnh chạy **một lần**, kết thúc sạch với dòng tổng
kết `Results: all plugin tests passed`; từng eval được đối chiếu với chốt `PASS: [PDn]`
có ranh giới vuông trong stdout của chính lượt chạy đó (chốt vuông là bản vá F1 —
trước đây `PASS: PD1` khớp nhầm `PD1b`).

Bộ ca in ra 18 chốt: PD1 · PD1b · PD1c · PD2 · PD2b · PD2c · PD3 · PD4 · PD4b · PD5 ·
PD6 · PD7 · PD7b · PD8 · PD8b · PD9 · PD9b · PD11. Mười sáu chốt gắn eval; hai chốt
thừa (PD1c, PD4b) là ca biên của hồ sơ không có eval riêng — chạy và xanh, ghi ở đây
cho đủ sổ.

Bốn suite của repo và phép kiểm bản đồ sản phẩm cũng xanh trong cùng phiên:

    bash tests/plugins/run-tests.sh      →  Results: all plugin tests passed
    bash tests/scripts/run-tests.sh      →  Results: 750 passed, 0 failed
    bash tests/hooks/run-tests.sh        →  Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh    →  Results: 44 passed, 0 failed
    node scripts/product-map.mjs --root . --check  →  PRODUCT-MAP.md khớp hồ sơ xưởng.

## Evidence

- eval: E1
  run_id: repo-khai-plugin-E1-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD1 (ho so repo-khai-plugin)
    PASS: [PD1] repo trống → file đúng tập n+1; gỡ diagram-design → thiếu đúng tên + lệch số
      PASS: ca khai plugin — PD1 (ho so repo-khai-plugin)

- eval: E2
  run_id: repo-khai-plugin-E2-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD2 (ho so repo-khai-plugin)
    PASS: [PD2] hợp nhất giữ permissions/worktree/paper-desktop + thứ tự; sản phẩm ghi-đè-cả-file qua cùng phép so → mất khoá paper-desktop@paper
      PASS: ca khai plugin — PD2 (ho so repo-khai-plugin)

- eval: E1b
  run_id: repo-khai-plugin-E1b-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD1b (ho so repo-khai-plugin)
    PASS: [PD1b] đổi name marketplace → hậu tố và khoá extraKnownMarketplaces cùng theo (một nguồn)
      PASS: ca khai plugin — PD1b (ho so repo-khai-plugin)

- eval: E2b
  run_id: repo-khai-plugin-E2b-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD2b (ho so repo-khai-plugin)
    PASS: [PD2b] JSON sai hình → mã thoát 3, không chạm, thông điệp nêu đúng lối; hợp lệ → ghi
      PASS: ca khai plugin — PD2b (ho so repo-khai-plugin)

- eval: E2c
  run_id: repo-khai-plugin-E2c-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD2c (ho so repo-khai-plugin)
    PASS: [PD2c] false giữ false, source riêng giữ nguyên, có dòng «giữ nguyên»; plugin chưa khai vẫn được bật
      PASS: ca khai plugin — PD2c (ho so repo-khai-plugin)

- eval: E3
  run_id: repo-khai-plugin-E3-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD3 (ho so repo-khai-plugin)
    PASS: [PD3] idempotent: lần hai không đổi byte, in «đã khai, không đổi»
      PASS: ca khai plugin — PD3 (ho so repo-khai-plugin)

- eval: E4
  run_id: repo-khai-plugin-E4-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD4 (ho so repo-khai-plugin)
    PASS: [PD4] JSON hỏng → mã thoát 3, không chạm; hợp lệ → ghi
      PASS: ca khai plugin — PD4 (ho so repo-khai-plugin)

- eval: E5
  run_id: repo-khai-plugin-E5-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD5 (ho so repo-khai-plugin)
    PASS: [PD5] dry-run không ghi, in đủ tên; --write ghi
      PASS: ca khai plugin — PD5 (ho so repo-khai-plugin)

- eval: E6
  run_id: repo-khai-plugin-E6-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD6 (ho so repo-khai-plugin)
    PASS: [PD6] bốn nơi khớp; gỡ một tên ở GUIDE → nêu tên+nơi; đổi marker init → không tìm thấy khối
      PASS: ca khai plugin — PD6 (ho so repo-khai-plugin)

- eval: E7
  run_id: repo-khai-plugin-E7-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD7 (ho so repo-khai-plugin)
    PASS: [PD7] GUIDE 5.1: 0 tuỳ chọn (cả hai chính tả), không pin, máy-đầu 1+1, máy-sau 1+0; hai đột biến đỏ đúng
      PASS: ca khai plugin — PD7 (ho so repo-khai-plugin)

- eval: E7b
  run_id: repo-khai-plugin-E7b-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD7b (ho so repo-khai-plugin)
    PASS: [PD7b] 16 tài liệu khai trong hợp đồng đều sạch (đủ 6 file bắt buộc); ba đột biến (lệnh ở README · chính tả «tùy» · mất marker) đều đỏ đúng
      PASS: ca khai plugin — PD7b (ho so repo-khai-plugin)

- eval: E8
  run_id: repo-khai-plugin-E8-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD8 (ho so repo-khai-plugin)
    PASS: [PD8] lệnh trong init chạy được và ghi đúng tập --list; --writ → mã thoát 4 (lệnh trong init không chạy được)
      PASS: ca khai plugin — PD8 (ho so repo-khai-plugin)

- eval: E8b
  run_id: repo-khai-plugin-E8b-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD8b (ho so repo-khai-plugin)
    PASS: [PD8b] 5b rẽ nhánh: mã thoát 0 → commit; mã thoát 3/4 → stderr nguyên văn, cấm bảo commit; gỡ nhánh lỗi → đỏ
      PASS: ca khai plugin — PD8b (ho so repo-khai-plugin)

- eval: E9
  run_id: repo-khai-plugin-E9-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD9 (ho so repo-khai-plugin)
    PASS: [PD9] marketplace vắng → mã thoát 4 nêu đường dẫn, không ghi; thêm ../.claude-plugin/ cạnh bản chép → mã thoát 0 + file có
      PASS: ca khai plugin — PD9 (ho so repo-khai-plugin)

- eval: E9b
  run_id: repo-khai-plugin-E9b-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD9b (ho so repo-khai-plugin)
    PASS: [PD9b] --root lạ → mã thoát 4 không mkdir; root thật → ghi
      PASS: ca khai plugin — PD9b (ho so repo-khai-plugin)

- eval: E11
  run_id: repo-khai-plugin-E11-r4-20260821T170701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T17:07:01Z
  output: |
    ca khai plugin — PD11 (ho so repo-khai-plugin)
    PASS: [PD11] init bước 1: repo đã có config vẫn chạy 5b + câu người-đọc; gỡ câu → đỏ
      PASS: ca khai plugin — PD11 (ho so repo-khai-plugin)

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E10
  judged_by: verifier độc lập (fresh context) — đọc trực tiếp input đã khai trong evals.yaml
  verdict: UNCERTAIN
  rationale: Đầu vào duy nhất của eval này — `_acceptance/repo-khai-plugin/kiem-tay-harness.md` — không tồn tại trên cây đang kiểm (`ls` báo No such file or directory). Đây là lời khai kiểm tay do người viết sau khi mở repo trên một máy khác, máy không được viết thay. Không có file thì không có căn cứ để chấm ba điều kiện của AC-10, nên verdict là UNCERTAIN kèm bằng-chứng-thiếu, đúng như `expected` của eval quy định. File vắng qua cả bốn round.
  required_evidence:
    - kiem-tay-harness.md — đặt tại `_acceptance/repo-khai-plugin/kiem-tay-harness.md`, do người thật viết sau khi mở repo trên một máy KHÁC máy đã dựng hồ sơ.
    - Trong file đó: một dòng ngày dạng ISO (YYYY-MM-DD).
    - Trong file đó: tên máy hoặc tên phiên đã kiểm tay, khác máy/phiên dựng hồ sơ.
    - Trong file đó: câu trả lời dứt khoát có/không (không «có vẻ», không «chắc là») cho đúng hai câu — (a) `true` cấp repo có thắng `false` cấp user không; (b) khoá `enabledPlugins` kích hoạt lời nhắc CÀI plugin hay chỉ BẬT plugin đã cài.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

## Analyst

n-a — round này KHÔNG chạy lượt baseline trên cây diffBase, nên chưa có dữ liệu
phân-biệt/không-phân-biệt cho eval nào; mọi ô `baseline:` ghi `n-a` đúng theo sự thật,
không chép lại giá trị `green` mà ba round BLOCKED trước từng để lại (giá trị đó chưa
bao giờ có lượt chạy phía HEAD để so). Điều đọc được từ chính lượt chạy này: mỗi ca PD
đều mang chiều đỏ chạy cùng lượt trên bản sao bị tiêm lỗi (gỡ tên plugin · đổi marker ·
sửa `--write` thành `--writ` · chèn lại chữ «tuỳ chọn» · ghi đè cả file settings), và
mọi chiều đỏ đó đều đỏ đúng thông điệp đã hẹn — nên bộ đo phân biệt được vật hỏng với
vật lành trong chính vòng này, dù chưa có số baseline.

## Variance

none — mọi eval của hồ sơ đều tất định (không eval nào khai `runs > 1`), và lượt chạy
duy nhất cho kết quả đồng nhất N/N.

## Known limits

- **Không có làn review / hội đồng đa-agent trong vòng đo này.** Ba round 1–3 đều
  BLOCKED vì bộ phân loại an toàn của Bash bị giới hạn khi workflow fan-out 23–28 agent;
  round 4 lấy bằng chứng bằng đường verify độc lập chạy tuần tự (quyết định
  d-20260821T170100Z-4110), nên chỉ có bằng chứng máy + một giám khảo đọc input, KHÔNG
  có làn review đa-agent hay hội đồng ba lens. Các finding của vòng 1–3 vẫn ghi nguyên ở
  `review-findings.md`; vòng này không sinh finding mới vì không có agent nào đi tìm.
- **AC-10: owner đã khai «CHƯA KIỂM ĐƯỢC» (2026-08-22).** Bằng chứng máy chỉ chứng minh FILE
  `.claude/settings.json` được ghi đúng. Hai câu về HÀNH VI của harness — `true` cấp
  repo có thắng `false` cấp user không, và khoá có nhắc CÀI hay chỉ BẬT plugin đã cài —
  không có phép đo máy nào phủ. File `kiem-tay-harness.md` nay TỒN TẠI và ghi rõ hai ô
  «chưa kiểm được» — owner chưa mở được repo trên máy thứ hai. E10 vẫn UNCERTAIN (không
  PASS), verdict giữ PENDING-JUDGMENT. Hệ quả đã khai trong file: lời hứa «máy sau chỉ
  cần marketplace add rồi mở repo» ở GUIDE §5.1 hiện là suy luận từ tài liệu, chưa có
  quan sát thực địa; nếu hoá ra khoá chỉ BẬT chứ không nhắc CÀI thì §5.1 phải sửa, phần
  script/init/khai file không đổi.
- **Hai ca biên chạy nhưng chưa có eval ghim tên riêng.** `PD1c` (marketplace thiếu
  khoá `name` → exit 4) và `PD4b` (settings.json là thư mục / `.claude` là file → exit 3)
  chạy thật và xanh trong suite, nhưng không eval nào ghim chuỗi `PASS: [PD1c]` /
  `PASS: [PD4b]`; chúng chỉ được phủ gián tiếp qua mã thoát của trọn suite. Vỡ một trong
  hai ca vẫn làm suite đỏ (nên không phải lỗ fail-open), nhưng báo cáo sẽ không chỉ được
  đúng eval nào hỏng. Sửa ở vòng sau: thêm hai chốt vào `expected` của E1b và E4.
- **Kit KHÔNG canh bản sao thủ tục cài ở `docs/**`.** Sau khi thu phạm vi ở vòng 3
  (quyết định d-20260821T170000Z-4109), vũ trụ quét của AC-7b là danh sách khai tường
  minh: mọi `*.md` ở gốc repo, `commands/*.md`, README của từng plugin, cộng đúng hai
  file docs (`docs/reference/DIAGRAM-RULE.md`, `docs/handoff/2026-08-10-onboarding-doi-gd3.md`).
  Một bản sao thủ tục cài xuất hiện ở chỗ khác trong `docs/**` sẽ KHÔNG làm phép đo đỏ.
  Đây là đánh đổi có chủ đích — lời hứa nay bằng đúng phép đo — không phải sót.
- **Chưa có lượt baseline (A/B).** Xem `## Analyst`.

## Ngoài hợp đồng

Mười finding của vòng 3 nằm ở `review-findings.md`. Trạng thái trên cây đang kiểm:

**Đã sửa trong vòng này (đã kiểm lại trên cây, không tin lời khai):**

- F1 — chốt eval là tiền tố của id ca anh em. `evals.yaml` nay ghim `PASS: [PDn]` có
  ranh giới vuông; xác nhận bằng chính bộ chốt in ra ở lượt chạy này (PD1 và PD1b là hai
  dòng riêng, không khớp lẫn nhau).
- F2 — danh sách ca PD là bản sao thứ hai phải giữ đồng bộ tay. `run-tests.sh` nay lấy
  danh sách bằng `--ids` từ chính file ca rồi lặp; thêm ca mới không phải sửa nơi thứ hai.
- F4 / F7 — sentinel `__kept` nhét vào chính object settings (một lỗi, hai bản ghi).
  `mergeSettings` nay trả `{ settings, kept }`; không còn chuỗi `__kept` nào trong
  `scripts/plugin-declare.mjs`.
- F5 — bước 5b của init báo thành công vô điều kiện. `commands/acceptance-init.md` nay
  có khối «BRANCH ON THE EXIT CODE», và AC-8b + ca PD8b canh cả hai nhánh (mã thoát 0 →
  câu commit; mã thoát 3/4 → in stderr nguyên văn, cấm bảo ai commit).
- F8 — `isEntryPoint()` nuốt lỗi realpath thành thoát êm không ghi gì. Nay `catch` rơi
  về so sánh đường dẫn thay vì trả `false`, kèm ghi chú «im lặng là fail-open câm».
- F10 — số file đã quét được in nhưng không được assert. Ca PD7b nay assert vũ trụ quét
  («16 tài liệu … đủ 6 file bắt buộc»), vũ trụ teo lại là đỏ.
- Hai bản sao thủ tục cài trong `docs/` — đã gỡ; quét lại `docs/reference/DIAGRAM-RULE.md`
  và `docs/handoff/2026-08-10-onboarding-doi-gd3.md` không còn lệnh
  `claude plugin install|update|marketplace add` nào.

**Còn lại — đóng bằng THU PHẠM VI, không bằng mã (owner đã chọn ở vòng 3):**

- F3 · F6 · F9 — cùng một lớp: hợp đồng tuyên «luật lớp cho mọi tài liệu» trong khi phép
  đo là danh sách thư mục ghi cứng. Vòng 3 không vá thêm mà TRỪ: AC-7b rút về danh sách
  khai tường minh, `docs/**` còn lại vào Out of scope làm sử liệu. Ba finding này vì thế
  không còn là vi phạm hợp đồng — chúng thành known-limit thứ ba ở trên. Người quyết ở
  Cổng 2 xem mức phủ đó có đủ không.

## Iterations

Round 1: E1-E9 (bash tests/plugins/run-tests.sh) và 3 suite khác (tests/scripts, tests/hooks, tests/workflows) không chạy được — Bash safety classifier (claude-sonnet-5) tạm thời rate-limited, ràng buộc hạ tầng chứ không phải lỗi script. E10 (judgment) chạy được: cả 3 lens đều UNCERTAIN vì thiếu file kiem-tay-harness.md. Verdict BLOCKED.
Round 2: Cùng bốn lệnh suite (nay E1-E9b đã mở rộng thêm E1b/E2b/E7b/E9b theo contract mới) vẫn không chạy được — cùng nguyên nhân classifier rate-limited, lặp lại y hệt round 1 lần thứ hai liên tiếp. E10 vẫn UNCERTAIN, file kiem-tay-harness.md vẫn chưa xuất hiện. Điểm mới duy nhất: lệnh phụ trợ ngoài hợp đồng `node scripts/product-map.mjs --root . --check` chạy được và PASS. Verdict vẫn BLOCKED — hạ tầng chặn (Bash tool rate-limit) chưa được giải quyết qua hai round; cần chạy lại toàn bộ 4 suite khi classifier khả dụng, không cần sửa code.
Round 3: Sau khi owner chọn đường A (đổi khuôn — sửa theo LỚP, quyết định d-20260821T150000Z-4108), hợp đồng mở rộng thêm E2c và E11 (nay 15 eval máy + E10 judgment); hạng giữ nguyên T2 suốt hồ sơ. Cùng bốn lệnh suite vẫn không chạy được — classifier rate-limited, lặp lại y hệt round 1 và 2 lần thứ ba liên tiếp — và lần này siết chặt hơn: ngay cả `node scripts/product-map.mjs --root . --check` (đã PASS ở round 2) cũng BLOCKED, không còn lệnh nào chạy được ở round này. E10 vẫn UNCERTAIN, file kiem-tay-harness.md vẫn chưa xuất hiện qua cả ba round. Verdict vẫn BLOCKED — hạ tầng chặn (Bash tool rate-limit) là nút thắt duy nhất ba round liên tiếp; cần chạy lại toàn bộ suite khi classifier khả dụng, không cần sửa code.
Round 4: Đổi đường lấy bằng chứng — verify độc lập, năm lệnh chạy tuần tự thay vì fan-out — và hạ tầng thôi chặn: cả năm lệnh chạy trọn, kết thúc bằng dòng tổng kết của chính lệnh. 16/16 eval máy XANH (18 chốt PD in ra, mỗi eval đối chiếu chốt vuông `PASS: [PDn]` của cùng lượt chạy); ba suite còn lại 750/60/44 ca xanh, bản đồ sản phẩm khớp. Hợp đồng nay 16 eval máy + E10 (AC-8b/PD8b thêm ở vòng 3). E10 vẫn UNCERTAIN — `kiem-tay-harness.md` vắng qua cả bốn round, chờ lời khai kiểm tay của người. Verdict PENDING-JUDGMENT: máy đã xong phần của máy, còn đúng một khoảnh khắc cần người.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
