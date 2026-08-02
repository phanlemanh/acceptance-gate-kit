---
schema_version: 2
feature_slug: hinh-theo-mat-phang
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2b6823d400df3360975c9029b120ac5871e36bbf
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