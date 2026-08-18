---
schema_version: 2
feature_slug: het-gio-khong-phai-truot
verdict: BLOCKED
failed_evals: []
reason: "bash tests/hooks/run-tests.sh — agent bị skip/chết giữa chừng: không sinh ra kết quả (không có exit code, không có output), nên không được tính là pass. Không phải một eval fail — bản thân verifier không chạy trọn được."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: eda7a8d11b5359e0398f2ff0e83442eabc3241f6
human_signoff:
---

# Evidence Report: het-gio-khong-phai-truot

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | test | PASS |

## Vì sao BLOCKED (không phải REJECT — không eval nào tự thất bại)

Cả tám eval E1–E8 đều chạy xong và exit 0: `bash _acceptance/het-gio-khong-phai-truot/rang.sh` (phủ E1–E6, E8) in "RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)", và `bash tests/workflows/run-tests.sh` (phủ E7) báo "Results: 44 passed, 0 failed" / "Results: all workflow tests passed". Ba lệnh suite khác không gắn eval cụ thể cũng xanh: `tests/scripts/run-tests.sh` (704 passed), `tests/plugins/run-tests.sh`, và `node scripts/product-map.mjs --root . --check` ("PRODUCT-MAP.md khớp hồ sơ xưởng.").

Nhưng `bash tests/hooks/run-tests.sh` — một lệnh máy bắt buộc của trọn bộ suite — không sinh ra kết quả: agent chạy nó bị skip/chết giữa chừng, không có exit code, không có output để đọc. Không thể coi đây là pass (không có bằng chứng nào chạy), cũng không thể coi là fail của một eval cụ thể (không eval nào trong hợp đồng ánh xạ vào lệnh này, và bản thân lệnh chưa từng chạy xong để biết nó fail vì lý do gì). Đây đúng trường hợp template mô tả "verifier could not run" — verdict BLOCKED, cần chạy lại `tests/hooks/run-tests.sh` (khả năng do hạ tầng agent, không phải do thay đổi mã nguồn của tính năng) rồi verify lại.

## Evidence

- eval: E1
  run_id: minted-het-gio-khong-phai-truot-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E2
  run_id: minted-het-gio-khong-phai-truot-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E3
  run_id: minted-het-gio-khong-phai-truot-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E4
  run_id: minted-het-gio-khong-phai-truot-E4-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E5
  run_id: minted-het-gio-khong-phai-truot-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E6
  run_id: minted-het-gio-khong-phai-truot-E6-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

- eval: E7
  run_id: minted-het-gio-khong-phai-truot-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T16:20:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-het-gio-khong-phai-truot-E8-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T16:20:00Z
  output: |
    (mutant)   [mutant] thieu dong PASS: W26 killedByTool -> BLOCKED
    PASS: TU-PHA-THU ban sao tiem 3 loi -> 3 loi, du 3 mui
    RANG-HGKPT OK (18 pin + san ton kho theo so ca + tu-pha-thu 3 mui)

## Analyst

- E7 (`bash tests/workflows/run-tests.sh`) — baseline: green, tức xanh trên cả HEAD và diffBase. Đây là regression-guard có chủ ý: AC-7 đòi suite workflows tồn kho (44 case cũ) không được vỡ khi thêm case mới, nên bản chất lời hứa là "không đổi hành vi cũ" — baseline vốn xanh là kỳ vọng đúng, không phải dấu hiệu eval vô dụng. Giữ nguyên, không cần viết lại để assert hành vi mới.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 trong vòng này).

## Iterations

Round 1: không eval nào (E1–E8) tự thất bại, nhưng hai lệnh không gắn eval — `bash tests/plugins/run-tests.sh` và `node scripts/product-map.mjs --root . --check` — exit 1 vì PRODUCT-MAP.md lệch hồ sơ xưởng. Verdict REJECT, trả về implementation để cập nhật bản đồ rồi verify lại.

Round 2: bản đồ đã cập nhật — cả 6 lệnh máy đều exit 0, không lệnh nào fail và không eval nào tự thất bại. Nhưng review scope-triage phát hiện 5 finding TRONG HỢP ĐỒNG (AC-5, AC-7): mutation-test thật trên bản sao cho thấy xoá phòng thủ tool-kill ở lane ui-check (AC-5), tiêm callsite khuôn-thứ-ba chung dòng với callsite đã phủ (AC-7), và tiêm case-đỏ vào ma trận mutation mà rang.sh không đọc mã thoát của suite (AC-7) đều không làm harness đỏ. Verdict REJECT, trả về implementation để vá theo `review-findings.md` mục `## Trong hợp đồng` rồi verify lại.

Round 3: sau khi vá, cả tám eval E1–E8 đều exit 0 (rang.sh in "RANG-HGKPT OK" đủ 18 pin + đối chứng dương tự-phá-thử 3 mũi; tests/workflows/run-tests.sh 44/44), và không eval nào tự thất bại. Nhưng `bash tests/hooks/run-tests.sh` — agent chạy lệnh này bị skip/chết, không sinh ra kết quả nào để đọc. Verdict BLOCKED (không phải REJECT: không có eval nào fail, verifier chỉ đơn giản chưa chạy trọn). Cần chạy lại `tests/hooks/run-tests.sh` rồi verify lại; không cần quay về implementation trừ khi lệnh đó tự nó lộ ra lỗi thật khi chạy được.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
