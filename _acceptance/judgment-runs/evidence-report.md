---
schema_version: 2
feature_slug: judgment-runs
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 552978a975d1be0d94ffba53c4d334d9ce2635ec
human_signoff:
---

# Evidence Report: judgment-runs

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E15 | AC-15 | script | PASS |

Ghi chú đọc bảng: mọi eval máy chạy round 2 đều PASS (exit 0) và panel E10 đồng thuận PASS — nhưng verdict tổng của round này là REJECT vì review (adversarial, ngoài các lệnh eval trên) tìm và tái hiện được một lỗi ánh xạ AC-14 thật trong `scripts/gate-card.js:388` mà E14 không phát hiện (xem review-findings.md, mục "Trong hợp đồng"). `failed_evals` để trống vì không có lệnh eval nào thoát khác 0 — đây là REJECT nguồn-review, không phải REJECT nguồn-máy; việc cần làm là quay lại implementation để sửa guard rồi tăng cường E14 trước khi verify lại.

## Evidence

- eval: E1
  run_id: minted-judgment-runs-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E2
  run_id: minted-judgment-runs-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E3
  run_id: minted-judgment-runs-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E4
  run_id: minted-judgment-runs-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E5
  run_id: minted-judgment-runs-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E6
  run_id: minted-judgment-runs-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E7
  run_id: minted-judgment-runs-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E8
  run_id: minted-judgment-runs-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E9
  run_id: minted-judgment-runs-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E10
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale:
    - domain-correctness: PASS — Cả hai file đều có mệnh lệnh ràng buộc, không phải nhắc trôi nổi: feature-loop SKILL.md dòng 150 (bullet "Mọi verdict" trong S4) và codex SKILL.md dòng 589-597 (trong phần trình Cổng 2 ngay sau S4) đều quy định "khi inertFields không rỗng → trình RIÊNG một khối, KHÔNG nén vào phần máy đã lo, cùng hạng minh bạch với carried/carry-forward". Cả hai đều dùng ngôn ngữ sản phẩm với ví dụ nêu đích danh giống nhau ("E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn") kèm việc-của-người (sửa evals.yaml hoặc ghi Known limits), và không mâu thuẫn với phần còn lại của mỗi file. Khác biệt duy nhất là vị trí cấu trúc (feature-loop đặt trong bullet ngay dưới heading S4; codex đặt ở heading "## Gate 2" liền sau S4) — đây là khác biệt tổ chức văn bản, không phải lỗ hổng mệnh lệnh, vì cả hai đều là điểm main loop tổng hợp gói trình người cho MỌI verdict tới Cổng 2.
    - operational-feasibility: PASS — Cả hai harness đều có mệnh lệnh buộc (không phải nhắc qua): feature-loop/skills/feature-loop/SKILL.md:150 nói "Kết quả có inertFields không rỗng → trình RIÊNG một khối, KHÔNG được nén vào phần 'máy đã lo' (cùng hạng minh bạch với carried)" kèm ví dụ ngôn ngữ sản phẩm "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn"; codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:589-597 trong chính section "## Gate 2" nói "When result.inertFields is non-empty, surface it as its OWN block, never folded into the machine-handled summary (same visibility rank as carry-forward)" với ví dụ tương đương bằng tiếng Anh. Cả hai đều nêu đích danh eval+field, đặt cùng hạng minh bạch với carry-forward, và không có phần nào khác trong cùng file mâu thuẫn (danh sách base package ở feature-loop:166 và các khối cảnh báo khác như CT2 ở :172 theo đúng khuôn "thêm khối riêng vào gói Gate 2", không phải một danh sách đóng loại trừ inertFields). Codex đặt chỉ dẫn trong "## Gate 2" thay vì một bullet tên "Mọi verdict" như bản Claude, nhưng vẫn là câu lệnh bắt buộc ngay trong đoạn "Present one package" — không phải gợi ý trôi nổi.
    - spec-alignment: PASS — Cả hai harness đều có mệnh lệnh rõ trong bước verdict/Gate 2: feature-loop SKILL.md dòng 150 nói "Kết quả có inertFields không rỗng → trình RIÊNG một khối, KHÔNG được nén vào phần 'máy đã lo' (cùng hạng minh bạch với carried)"; codex SKILL.md dòng 589-597 nói "surface it as its OWN block, never folded into the machine-handled summary (same visibility rank as carry-forward)" — cả hai cùng hạng minh bạch với carry-forward, không nén. Cả hai đều buộc viết bằng ngôn ngữ sản phẩm nêu đích danh eval+field (ví dụ "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn" / "E10 declares runs: 3 but a judgment eval always runs exactly once per lens") kèm việc-của-người (sửa evals.yaml hoặc ghi known limit), và không mâu thuẫn với phần còn lại của mỗi file (định nghĩa inertFields ở bước parse evals.yaml của cả hai file khớp với mô tả ở bước verdict/Gate 2).
  human_override:

- eval: E11
  run_id: minted-judgment-runs-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T06:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E12
  run_id: minted-judgment-runs-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E13
  run_id: minted-judgment-runs-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E14
  run_id: minted-judgment-runs-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T06:00:00Z
  output: |
    === skill-claims.test.mjs ===
    10 passed, 0 failed

- eval: E15
  run_id: minted-judgment-runs-E15-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.mutation_check
  verified_at: 2026-08-04T06:00:00Z
  output: |
    PASS: [ben doc quay ve cat theo VI TRI chuoi thay vi theo DONG] -> DO dung case "WI6 [note-truoc] co DO phuong-sai van con"
    PASS: [khoi phuc cau mo ta runs cu (khong neu gioi han executor)] -> DO dung case "WI7 feature-loop/workflows/acceptance-verify.js: mo ta neu gioi han test/script"
    Results: 6 dot bien deu bi bat (bang chung phan biet dat)

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E12, E13, E14 (bash tests/workflows/run-tests.sh) và E11 (bash scripts/sync-plugin-packages.sh --check) — pass trên cả HEAD lẫn baseline diffBase, tức không phân biệt được nhờ đâu mà xanh. Cần xem lại: hoặc viết lại eval để assert hành vi mới của tính năng judgment-runs, hoặc xác nhận đây là regression-guard có chủ ý (suite chung, không riêng cho feature này) và ghi nhận như vậy. E15 (mutation-check) đỏ trên baseline nên có phân biệt (không thuộc danh sách này).

## Variance

Field khai mà máy không dùng: E10 khai `runs: 3` nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn, và ba góc nhìn đã là cách hấp thụ sai số. Giá trị đó bị bỏ qua — sửa evals.yaml (đổi loại eval hoặc bỏ field) hoặc chấp nhận và ghi vào phần hạn chế đã biết.

## Iterations

Round 1: E1–E9, E11–E13 (machine) pass trên HEAD, tất cả non-discriminating trên baseline (xem Analyst); E10 (judgment) — panel 3 góc nhìn đồng thuận PASS, chờ human_override bắt buộc theo luật T3 trước khi verdict tổng được nâng lên PASS.
Round 2: thêm E14, E15 vào bộ eval; toàn bộ 14 eval máy PASS trên HEAD (E14 non-discriminating trên baseline, E15 discriminating — 6 đột biến đều bị bắt), E10 tái chấm không-carried, panel 3 góc nhìn vẫn đồng thuận PASS. Dù vậy verdict tổng REJECT: review (adversarial) tái hiện được một lỗi thật ánh xạ AC-14 tại scripts/gate-card.js:388 — guard cấp khối `{{` nuốt cả cờ inert khi dòng đầu `## Variance` còn placeholder — mà E14 (round-trip theo dòng) không phủ tới trường hợp placeholder-lẫn-nội-dung. Quay lại implementation để sửa guard (lọc placeholder theo dòng, không theo khối) rồi verify lại; xem review-findings.md mục "Trong hợp đồng" (AC-14) để có bằng chứng tái hiện đầy đủ.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
