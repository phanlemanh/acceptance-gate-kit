---
schema_version: 2
feature_slug: duong-do-trong-dinh-nghia-xong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, 6 lệnh chạy tuần tự — quyết định d-4308)
enforcement_mode: strict
bypass_used: false
verified_commit: 77727323a1943685ad4150da5d3e1efffe4ce4e1
human_signoff: Manh Phan 2026-08-22 — ký với known-limits đã khai; 4 finding ngoài hợp đồng (review-findings.md) là ứng viên hồ sơ T2 kế: bỏ «metric» khỏi _Avoid_ + nới nhận diện dòng bỏ
---

# Evidence Report: duong-do-trong-dinh-nghia-xong

Round 1. Bằng chứng lấy bằng một phiên tươi chạy tuần tự bốn suite của repo và phép kiểm
bản đồ trên cây `88193189` (working tree sạch); mỗi eval đối chiếu với chốt `PASS: [DDn]`
(ranh giới vuông) hoặc dòng tổng kết của chính lệnh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-1 | test | PASS |
| E9 | AC-1 | test | PASS |
| E10 | AC-6 | test | PASS |

## Bằng chứng gốc — năm lệnh, một lượt

    bash tests/plugins/run-tests.sh                →  Results: all plugin tests passed (0 dòng FAIL; 7 chốt DD)
    bash tests/scripts/run-tests.sh                →  Results: 750 passed, 0 failed
    bash tests/hooks/run-tests.sh                  →  Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh              →  Results: all workflow tests passed
    node scripts/product-map.mjs --root . --check  →  PRODUCT-MAP.md khớp hồ sơ xưởng.

Bảy eval máy của AC-1…AC-7 trỏ cùng lệnh suite plugins, chạy **một lần**, từng eval ghim
chốt riêng. Ba suite còn lại là hồi quy. Trong S3, lần chạy đầu đỏ 5 ca cũ (P84 ghim kề chữ ·
P122/P126 bản đồ lệch vì contract mới · P161 ma trận chỗ gọi stripMd · VC8 của chip B ghim
bước kế của chính chip C) — sửa theo lớp (đặt câu sau vế platform-fit · vẽ lại bản đồ · in
nguyên văn không qua hàm lột · VC8 thôi ghim nextStep), tất cả xanh trong lượt này.

## Evidence

- eval: E1
  run_id: duong-do-trong-dinh-nghia-xong-E1-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD1] R+: có ngưỡng + section thật → khối in, 0 cờ; applicable ⇔ khối Ngưỡng; biên 1 dòng thật vẫn áp dụng

- eval: E2
  run_id: duong-do-trong-dinh-nghia-xong-E2-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD2] R−: gỡ section / chỉ placeholder / chỉ dòng bỏ không entry → đúng 1 cờ vàng «chưa có đường đo» nêu hai lối

- eval: E3
  run_id: duong-do-trong-dinh-nghia-xong-E3-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD3] R0: không cơ hội / ngưỡng toàn «…» → không cờ, applicable=false ⇔ không khối Ngưỡng; khối Đường đo vẫn in

- eval: E4
  run_id: duong-do-trong-dinh-nghia-xong-E4-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD4] RK: entry đúng tiền tố → info «Đã bỏ đường đo theo id» + CHƯA ĐO, 0 vàng (cả khi section chỉ có dòng bỏ); sai tiền tố / sai type → vẫn vàng

- eval: E5
  run_id: duong-do-trong-dinh-nghia-xong-E5-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD5] khối khuôn: heading == DUONG_DO_HEADING, tiền tố bỏ == DUONG_DO_DESCOPE, có dòng mẫu; đổi heading → đỏ nêu hai chuỗi

- eval: E6
  run_id: duong-do-trong-dinh-nghia-xong-E6-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD6] SKILL S1#4/S1#7: 6 mệnh đề đếm-hit-trong-phạm-vi; tiền tố rút từ SKILL == gate-card; 6 mutant đỏ đúng mệnh đề

- eval: E7
  run_id: duong-do-trong-dinh-nghia-xong-E7-r1-20260822T012313Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T01:23:13Z
  output: |
    PASS: [DD7] CONTEXT.md có term Đường đo (thước/ngưỡng/số đo, _Avoid_ tracking+metric); gỡ → đỏ

- eval: E8
  run_id: duong-do-trong-dinh-nghia-xong-E8-r1-20260822T012537Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-22T01:25:37Z
  output: |
    Results: 750 passed, 0 failed

- eval: E9
  run_id: duong-do-trong-dinh-nghia-xong-E9-r1-20260822T012701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-22T01:27:01Z
  output: |
    Results: 60 passed, 0 failed

- eval: E10
  run_id: duong-do-trong-dinh-nghia-xong-E10-r1-20260822T012709Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-22T01:27:09Z
  output: |
    Results: all workflow tests passed

## Analyst

n-a — không chạy lượt baseline trên cây diffBase (đường verify độc lập). Điều đọc được từ
chính lượt chạy: mỗi ca DD mang chiều đỏ cùng lượt trên bản sao bị phá (gỡ section · chỉ
placeholder · chỉ dòng bỏ · sai tiền tố entry · sai type · đổi heading khuôn · 6 mutant SKILL ·
gỡ term), mọi chiều đỏ đều đỏ đúng thông điệp; tác giả phá thử bộ lọc dòng bỏ
(`!ddIsBoLine` → `true`) → DD2(c)/DD4(d) đỏ. Bộ đo phân biệt được vật hỏng với vật lành.

## Variance

none — mọi eval tất định.

## Known limits

- **Không có hội đồng đa-agent / baseline A-B** — đường verify độc lập + một reviewer tươi
  (d-4308). Reviewer cho 6 finding: 2 trong hợp đồng đã sửa cùng round; 4 ngoài — mục dưới.
- **Bullet của section Đường đo chỉ nhận dấu `-`** (`bullets()` dùng chung ba section của
  thẻ); `* Thước: …` → cờ vàng oan. Khuôn ghi rõ «Bullet dùng dấu `-`». Mở `bullets()` sang
  `[-*]` là việc của một hồ sơ chạm ma trận cũ, không phải hồ sơ này.
- **Dòng bỏ nhận diện bằng tiền tố đúng chuỗi** (`bỏ đường-đo`); «Bỏ đường đo —» (không gạch
  nối) được coi là đường đo thật → thẻ xanh. AC-1 định nghĩa như vậy; finding ngoài hợp đồng #1.
- **`_Avoid_: metric` trong term mới đụng từ kit đang dùng** (`uat-session` «tracking»,
  `morphological-scan` preset `metrics-tree`) — AC-7 đòi hai từ này nên chưa đổi; đề xuất bỏ
  «metric» khỏi `_Avoid_` ở lượt sau chữ ký (finding #3).
- **Hồ sơ kit đi nhánh R0** (stub cơ hội còn `…`, cửa bỏ d-4306): suite xanh của chính kit
  không chứng minh luật chạy ở consumer — chứng minh nằm ở fixture DD1–DD4 (cây sinh, gate-card
  thật), đúng cảnh báo hạt giống §6.
- **Hành vi agent (có viết section ở S1 không) không có eval** (d-4305).

## Ngoài hợp đồng

Bốn finding của reviewer (chi tiết ở `review-findings.md`), máy KHÔNG sửa trong round này:

1. Dòng bỏ lệch gạch nối lọt thành đường đo thật (medium) — đề xuất `/^bỏ\s+đường[-\s]đo\b/i`.
2. Heading tiền tố `## Đường đo lường` khớp — kế thừa luật `\b` md-section; chốt có chủ ý hay neo cuối.
3. `_Avoid_: metric` đụng từ chuẩn kit — bỏ «metric», đổi câu uat-session sang «đường đo đã khai».
4. Khuôn «dòng bỏ VÀ entry» vs SKILL «chỉ entry» — khuôn đổi «VÀ» → «(tuỳ chọn) kèm entry».

### Re-pin lần 1 — 2026-08-25, do engine đổi ở vòng ra-co-ten-lam-va-trao (lối ra «không đo được» + luật ngưỡng một chỗ + bộ đọc bản đồ/bộ quét)
run_id: repin-20260825-ra-co-ten-lam-va-trao-lane1
sha: 65a0c081bbf83caa8f43f3df00966b3444fb4f3b · suites: 4 lệnh exit 0

Hồ sơ này KHÔNG có dòng mã nào của nó đổi; nó hoá cũ vì engine đổi bên dưới, và
đã đỏ sẵn trên origin/main từ trước vòng đó. Vòng đó chạm hai file TÀI LIỆU của
hồ sơ (dòng ngưỡng + một dòng sổ, do AC-14 đòi) nên nó bị kéo vào tầm soi của
lưới — đúng ca GUIDE §7.1 «vòng đang chạy bị chặn thật → ghim lại RIÊNG làn đó».
Phiên chấm tươi chạy lại trọn bộ đo: 10/10 eval, verdict PASS, 0 lệnh bị chặn.
Chữ ký và verdict KHÔNG đổi — ghim lại là việc máy, không sinh chữ ký mới.

### Re-pin lần 2 — 2026-08-25, do gộp origin/main (kéo theo 30 commit engine, trong đó có vòng dac-ta-ux)
run_id: repin-20260825-gop-main-lane1
sha: a3038182803075f1246b73b0db75dc357d99a0a9 · suites: 5 lệnh exit 0

Nhánh GỘP origin/main SAU khi ký, nên bằng chứng hoá cũ — đặc tính của luật
staleness, không phải lỗi. Phiên chấm tươi chạy lại trọn bộ đo tại commit đã
gộp: **15/15 tiêu chí XANH, 5/5 lệnh exit 0, 0 lệnh bị chặn**.

Verdict của lượt đó là PENDING-JUDGMENT — KHÔNG phải vì tiêu chí nào gãy, mà vì
bộ phân loại findings chết (`triageFailed`), nên vòng tự hạ hạng theo luật «máy
không biết vòng này sạch thì không được ký một PASS sạch bong». Lượt ghim này
dựa trên DỮ KIỆN MÁY (15/15 eval + 5/5 lệnh), không dựa trên verdict đó; findings
của lượt chấm chờ người xem, không mục nào bị máy tự sửa.

Chữ ký và verdict của hồ sơ KHÔNG đổi. Ghim lại là việc máy.

## Iterations

Round 1: đường verify độc lập — 6 lệnh tuần tự trên `88193189`, tất cả exit 0; 10/10 eval PASS.
S3 trước đó: 5 ca cũ đỏ → sửa theo lớp; reviewer 2 finding trong hợp đồng → sửa cùng round.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter

### Re-pin lần 1 — 2026-08-22, do sửa ca VC8 sau chữ ký (CI đỏ: ca của hồ sơ #82 ghim chặng của hồ sơ này)
run_id: repin-duong-do-trong-dinh-nghia-xong-20260822T014349Z
sha: 60b7cf38fa839a6a8b0c6ce1a78b56882287c1c0 · suites: 4 lệnh exit 0 + product-map --check khớp

### Re-pin lần 2 — 2026-08-22, do hồ sơ lenh-in-ra-phai-bam-duoc (chip D) chạm gate-card.js · CONTEXT.md · uat-session SKILL · duong-do.test.mjs (DD2/DD4/DD7 đổi thước theo AC-6/AC-7 của chip D, d-4505)
run_id: repin-duong-do-trong-dinh-nghia-xong-20260822T153058Z
sha: 24eec78ce4823260b1b4656b66ed8d7ec867ed55 · suites: 4 lệnh exit 0 (phiên verify độc lập của chip D, 15:24–15:28Z) + product-map --check khớp

### Re-pin lần 5 — 2026-08-26, do nhánh design-pass-nac chạm mã sau mốc ghim cũ — ghim lại bằng MỘT lượt làn máy xanh trọn
run_id: repin-20260826T073920Z-dpnkdb
sha: 77727323a1943685ad4150da5d3e1efffe4ce4e1 · suites: 5 lệnh exit 0
