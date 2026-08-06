---
schema_version: 2
feature_slug: hinh-theo-mat-phang
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4383b814def31b4627eb290d3e0ea688ca80887f
# bypass_ack:
human_signoff: Manh Phan 2026-08-02          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: hinh-theo-mat-phang

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-hinh-theo-mat-phang-E1-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-hinh-theo-mat-phang-E2-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-hinh-theo-mat-phang-E3-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-hinh-theo-mat-phang-E4-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-hinh-theo-mat-phang-E5-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-hinh-theo-mat-phang-E6-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-hinh-theo-mat-phang-E7-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-hinh-theo-mat-phang-E8-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-hinh-theo-mat-phang-E9-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-02T12:03:07Z
  output: |
    plugins/ mirror in sync.

- eval: E10
  run_id: minted-hinh-theo-mat-phang-E10-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-hinh-theo-mat-phang-E11-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T12:03:07Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — cả 11 eval đều xanh trên CẢ HEAD lẫn diffBase (cmd `bash tests/plugins/run-tests.sh` cho E1-E8/E10-E11, cmd `bash scripts/sync-plugin-packages.sh --check` cho E9). Suite `tests/plugins/run-tests.sh` và `scripts/sync-plugin-packages.sh --check` là lệnh regression-guard bao trùm toàn repo (hàng trăm case P khác cũng chạy qua cùng lệnh) nên xanh-cả-hai-phía ở mức LỆNH là bình thường; tín hiệu phân biệt thật của round này nằm ở việc từng case P97/P92/P89/P90/P93/P95/P96 có đúng đối chứng dương + đột biến riêng (xem cột "expected" trong evals.yaml). Round 6 không đổi test nào so với round 5 tại mức case — chấm lại chỉ để cập nhật `verified_commit` lên HEAD hiện tại (2b6823d) sau khi review phát hiện bằng chứng round 5 đã stale so với các thay đổi vào P97 (xem review-findings.md).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: E1-E11 pass (11/11) tại commit 00e3c19 — nhưng review sau đó bắt bốn lỗ mức cao (AC-11 tự-gác: danh sách bắt buộc rút từ chính khối đang đo; tên bảng tra trong khuôn câu-về-hình chưa bao giờ được giải tới marker thật; mục tránh `surface` là term chuẩn nên alias không bao giờ bắn; hàng bảng thiếu ô làm phép đo văng lỗi Python thay vì thông điệp có tên); quay lại implementation, vá tại commit 7153acd.
Round 3: E1-E11 pass (11/11) tại commit 7153acd — nhưng review round 3 bắt thêm năm lỗ ngoài hợp đồng: đối chứng âm của P96 vẫn hằng-đúng dù đã đổi hình dạng một lần (`if True:` sót lại), thẻ Cổng 2 (card-plain.json) còn tiếng máy, CONTEXT.md trích dẫn marker DECISION-DIAGRAM-SURFACES không bao giờ được giải, blacklist `_Avoid_: kênh` bắn cảnh báo sai trên 3 hợp đồng có sẵn không liên quan; vá qua ba commit: 2a08184 (đối chứng âm hằng-đúng → đối chứng phá vật thật), c7a3ada (dựng lại thẻ Cổng 2 bằng tiếng người), 377eb07 (từ điển trỏ tên bảng tra cũng giải được).
Round 4: E1-E11 pass (11/11) tại commit 377eb07 — review bắt hai lỗ cuối: nhánh tự-gác "nếu file có mặt" khiến P95 im lặng khi bản luật vắng trong gói (đúng lớp lỗi vừa gỡ khỏi P96), và một dòng ghi-chú-thôi trong bản luật bị đọc nhầm thành luật cưỡng chế; vá tại commit ae6f8f2.
Round 5: E1-E11 pass (11/11) tại commit ae6f8f2 — evidence ghi PASS nhưng report chưa qua Cổng 2 (human_signoff rỗng); sau đó P97 được siết thêm ràng buộc quan hệ (cơ chế phải đôi-một-khác-nhau, đúng-một-hàng-mặc-định) và E1's expected được viết lại tại commit 2b6823d mà không re-verify, khiến bằng chứng round 5 trở thành stale trước khi tới người ký.
Round 6: E1-E11 pass (11/11) tại commit 2b6823d (HEAD) — chấm lại toàn bộ trên cây hiện tại để `verified_commit` khớp mã đang có; review round này ghi nhận thêm các điểm ngoài hợp đồng (xem review-findings.md) — không eval nào đỏ, verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin — 2026-08-03 (sau start-command), tại b2d2eac

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 2 của feature
  `start-command`, Workflow `wf_73dc61df-6d8`, doer≠grader): 5 suite tại
  `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P101, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-scan-hardening), tại 6f3449c

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 5 của feature
  `start-scan-hardening`, Workflow `wf_4cdd5992-610`, doer≠grader): 5 suite tại
  `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P105, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-05 (sau gate-card-ngon-ngu-may 1.32.0), tại 866c89e

`verified_commit` lên `866c89e`. Nguyên nhân stale: PR #29 sửa LỚP TRÌNH BÀY
thẻ cổng — scripts/gate-card.js (nối bullet hard-wrap, tầng card-plain cho
Coverage/gap-probe, lột markdown ở fallback) + writer doc 2 harness + test
P146–P148 + bump manifest 1.32.0 + vẽ lại PRODUCT-MAP.md + fix grep portable.
Không luật cưỡng chế nào đổi: hooks/, lib/, pre-merge-check.sh,
recheck-evidence.js KHÔNG nằm trong diff.

- **ĐÃ chạy lại:** toàn bộ machine lane tại `866c89e` — 596 case scripts ·
  51 hooks · plugins pass (kèm P146–P148 mới) · workflows pass · mirror in
  sync · product-map khớp; cả 6 suite_keys exit 0. Minh bạch: MỘT lượt chạy
  chung trong phiên fix CI của PR #29 cho cả đợt re-pin 19 slug, không phải
  agent tươi per-slug (khuôn 1-lượt có máy đối chiếu là việc của
  delta-verify-repin, đã duyệt Cổng 1, chưa ship).
- **KHÔNG chạy lại:** eval judgment, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực.

### Re-pin lần 4 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0

### Re-pin lần 5 — 2026-08-05, do feature matrix-measure-law + hotfix luật repin (nghi thức 1-lane)
run_id: repin-20260805-matrix-measure-law-lane2
sha: 5ec937c0746dfeaa3c554f5c44b224954ae989ae · suites: 6 lệnh exit 0

### Re-pin lần 6 — 2026-08-05, do feature judge-required-evidence (nghi thức 1-lane)
run_id: repin-20260805-judge-required-evidence-lane1
sha: e6dad45a6169d17c59ac85a95c6d58924c14ffff · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0

### Re-pin lần 5 — 2026-08-06, do engine đổi ở vòng card-text-fidelity (hàm lột định dạng của thẻ + bộ kiểm)
run_id: repin-20260806-card-text-fidelity-lane1
sha: 2b01e982116f80b50828d30cb2d593025c918dbe · suites: 6 lệnh exit 0

### Re-pin lần 6 — 2026-08-06, do engine đổi ở vòng codex-script-packaging (công cụ mang-kết-quả + hàm dựng gói + chỉ dẫn 2 bản)
run_id: repin-20260806-codex-script-packaging-lane1
sha: 451840967a9ef3726e953246da03225504c71675 · suites: 6 lệnh exit 0

### Re-pin lần 7 — 2026-08-06, do engine đổi ở vòng discovery-brainstorm-socket (ổ cắm khám phá + bộ quét /start + bộ kiểm), ghim lại sau rebase lên main
run_id: repin-20260806-discovery-brainstorm-socket-lane2
sha: 4383b814def31b4627eb290d3e0ea688ca80887f · suites: 5 lệnh exit 0
