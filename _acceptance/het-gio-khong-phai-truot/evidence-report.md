---
schema_version: 2
feature_slug: het-gio-khong-phai-truot
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b4bd3c2da4620a7ec3c5f695d5a60ea62439c9be
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

## Vì sao REJECT (không lệnh nào fail, không eval nào tự thất bại lần này)

Khác với Round 1 (PRODUCT-MAP.md lệch hồ sơ xưởng), lần này cả 6 lệnh máy đều exit 0 — kể cả `bash tests/plugins/run-tests.sh` và `node scripts/product-map.mjs --root . --check` đã xanh trở lại sau khi bản đồ được cập nhật (`PRODUCT-MAP.md khớp hồ sơ xưởng.`). Không eval nào trong E1–E8 tự thất bại, và không có lệnh nào ngoài eval fail.

Verdict vẫn REJECT vì vòng review-scope-triage xác nhận 5 finding TRONG HỢP ĐỒNG (xem `review-findings.md` mục `## Trong hợp đồng`) — 2 severity high, 3 severity medium — ánh xạ vào AC-5 và AC-7. Các finding này dựa trên mutation-test THẬT chạy trên bản sao cây nguồn (đã khôi phục sau đo), không phải suy diễn:

- xoá `.map(normKill)` ở lane `ui-check` trong `feature-loop/workflows/acceptance-verify.js:542` → `node tests/workflows/acceptance-verify.test.mjs` vẫn "340 passed, 0 failed" và `rang.sh` vẫn in "RANG-HGKPT OK" — AC-5 tuyên routing killedByTool áp dụng cho cả lane machine LẪN ui, nhưng chỉ lane machine (W26) và lane baseline (W27) có ca cô lập; lane ui không có chiều đỏ nào.
- tiêm callsite khuôn-đặt-tên-thứ-ba (`check("...", ...)`) CHUNG DÒNG với một callsite đã phủ vào bản sao `BASE_SRC` trong `rang.sh` → đẳng thức "đóng không gian" (`N_CALL == N_SQ + N_BT`, dòng 94) vẫn cân vì `N_CALL` đếm DÒNG (`grep -c`) trong khi `N_SQ`/`N_BT` đếm LƯỢT (`grep -o | wc -l`) — khuôn nháy-kép lọt qua hoàn toàn vô hình với phép đo.
- `rang.sh:14` không đọc mã thoát của `node "$TEST_FILE"` (`OUT="$(node ... 2>&1)"`, không set -e, không kiểm `$?`); tiêm case-đỏ vào ma trận mutation WT-T19+ (dòng 978) làm suite exit 1 thật, nhưng `rang.sh` vẫn báo "RANG-HGKPT OK" và exit 0.

Nghĩa là E1–E8 báo PASS đúng như harness đo hiện có, nhưng bản thân harness (mutant matrix của lane ui, đẳng thức "đóng không gian", và việc đọc mã thoát của suite) chưa thực sự phân biệt được các lớp lỗi mà AC-5/AC-7 hứa chặn — đúng lớp "máy tin nhầm chính nó". Đây là REJECT ở tầng phép đo, không phải một lệnh cụ thể fail, nên `failed_evals` giữ nguyên rỗng theo dữ liệu chạy thật của round này.

## Evidence

- eval: E1
  run_id: minted-het-gio-khong-phai-truot-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E2
  run_id: minted-het-gio-khong-phai-truot-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E3
  run_id: minted-het-gio-khong-phai-truot-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E4
  run_id: minted-het-gio-khong-phai-truot-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E5
  run_id: minted-het-gio-khong-phai-truot-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E6
  run_id: minted-het-gio-khong-phai-truot-E6-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E7
  run_id: minted-het-gio-khong-phai-truot-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T15:44:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-het-gio-khong-phai-truot-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T15:44:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    PASS: TON-KHO-TPL 11 case ten dong nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

## Analyst

- E7 (`bash tests/workflows/run-tests.sh`) — baseline: green, tức xanh trên cả HEAD và diffBase. Đây là regression-guard có chủ ý: AC-7 đòi suite workflows tồn kho (44 case cũ) không được vỡ khi thêm case mới, nên bản chất lời hứa là "không đổi hành vi cũ" — baseline vốn xanh là kỳ vọng đúng, không phải dấu hiệu eval vô dụng. Giữ nguyên, không cần viết lại để assert hành vi mới.

## Variance

none — không eval nào có `runs` > 1 (không có eval ngẫu nhiên trong vòng này).

## Iterations

Round 1: không eval nào (E1–E8) tự thất bại, nhưng hai lệnh không gắn eval — `bash tests/plugins/run-tests.sh` và `node scripts/product-map.mjs --root . --check` — exit 1 vì PRODUCT-MAP.md lệch hồ sơ xưởng. Verdict REJECT, trả về implementation để cập nhật bản đồ rồi verify lại.

Round 2: bản đồ đã cập nhật — cả 6 lệnh máy đều exit 0, không lệnh nào fail và không eval nào tự thất bại. Nhưng review scope-triage phát hiện 5 finding TRONG HỢP ĐỒNG (AC-5, AC-7): mutation-test thật trên bản sao cho thấy xoá phòng thủ tool-kill ở lane ui-check (AC-5), tiêm callsite khuôn-thứ-ba chung dòng với callsite đã phủ (AC-7), và tiêm case-đỏ vào ma trận mutation mà rang.sh không đọc mã thoát của suite (AC-7) đều không làm harness đỏ. Verdict REJECT, trả về implementation để vá theo `review-findings.md` mục `## Trong hợp đồng` rồi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
