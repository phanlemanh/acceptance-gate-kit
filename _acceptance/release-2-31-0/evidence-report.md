---
schema_version: 2
feature_slug: release-2-31-0
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f70de6b160cec0dc39dea1bf82c0c1e2ce3fb57d
human_signoff: manh 2026-10-15
---

# Evidence Report: release-2-31-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

Ghi chú: `verified_at` ghi theo ngày chạy (2026-10-15), độ chính xác tới ngày; máy không trả giờ từng lệnh. Các eval E1, E2, E3j, E6 dùng chung một lệnh vùng 3 của suite plugins (một lần chạy, bốn eval).

- eval: E1
  run_id: minted-release-2-31-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-31-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-31-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-31-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: 32 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-31-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: 32 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-31-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-15T09:50:52Z
  output: |
    [exited with code 0]

- eval: E3b
  run_id: minted-release-2-31-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-31-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-31-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-31-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-31-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-31-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-15T09:50:52Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-31-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2310_cua_so
  verified_at: 2026-10-15T09:50:52Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-31-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2310_dd_giu
  verified_at: 2026-10-15T09:50:52Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-31-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-15T09:50:52Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-31-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2310_dp_giu
  verified_at: 2026-10-15T09:50:52Z
  output: |
    dieu-phoi doi: dieu-phoi/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-31-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2310_lop_chep
  verified_at: 2026-10-15T09:50:52Z
  output: |
    XANH: đúng 3 tệp đổi như ghi chú 2.31.0 kể

- eval: E10
  run_id: minted-release-2-31-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-15T09:50:52Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.30.0 (7cf78c36) cài đúng tag

### Judge (E9 — đề xuất của hội đồng, để trống human_override cho người ở Cổng 2)

- eval: E9
  judged_by: judge panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Ba lens đều chấm đạt; cả bốn vế của hạng mục khớp tệp đầu vào. Riêng lens spec-alignment ghi rõ vế (2) là suy luận từ cấu trúc mã hiện tại, không có mã cũ để đối chứng.
  human_override:  # chi nguoi ghi

Phiếu từng lens:

- domain-correctness: PASS — Cả bốn vế khớp. (1) Mục «crm, theo thứ tự» nói nhận sau 2.30.0 (crm PR #413), chưa gộp thì làm trọn các bước 2.30.0 trước, và cài theo thẻ v2.31.0. (2) `lib/out-of-contract.cjs` nhận khoá «Căn cứ» vào `can_cu`. Bộ đọc đếm khoá bằng một danh sách đóng và bỏ qua dòng không khớp (`if (!kv) continue`), nên bộ đọc cũ chưa có khoá này sẽ bỏ qua dòng đó thay vì làm lệch trường khác. Đây là suy từ cấu trúc mã hiện tại, vì tôi không đọc được bản cũ. (3) và (4) Lời về `--ra-soat`, chính sách, gói `road-map`, số đo crm `d0351bcd` (DA6, DA7, DA8 → chờ điều kiện) và cờ MC1 (OKR 12 → 26, Việc và Dự án 4 → 5, Kho tài liệu 2 → 2) khớp `road-map/README.md`, `road-map/commands/xem.md`, `commands/start.md` và hai hợp đồng `ra-soat-lo-trinh`, `moc-la-chien-dich`.
- operational-feasibility: PASS — Cả bốn vế khớp tệp đầu vào. (1) Bước 1–2 của mục «crm, theo thứ tự» nói nhận sau 2.30.0 (crm PR #413), làm trọn bước 2.30.0 nếu #413 chưa gộp, cài đúng thẻ `v2.31.0`, không cài từ `main`. (2) Biểu thức khoá trong `parseFindings` của `lib/out-of-contract.cjs` là danh sách đóng có «Căn cứ», nên dòng khoá lạ chỉ bị `continue` bỏ qua, không lệch sang trường khác. (3)(4) Lời về `--ra-soat`, `road-map` và cờ MC1 khớp `road-map/README.md`, `road-map/commands/xem.md`, `commands/start.md`, AC-1/AC-4/AC-5/AC-9 của `ra-soat-lo-trinh` và AC-1/AC-4/AC-10 của `moc-la-chien-dich`, kể cả các số đo crm.
- spec-alignment: PASS — Cả bốn vế khớp vật. (1) Mục «crm, theo thứ tự» nói nhận sau 2.30.0 (crm PR #413), chưa gộp thì làm trọn bước 2.30.0 trước, và cài theo thẻ `v2.31.0`. (2) `lib/out-of-contract.cjs` nhận khoá «Căn cứ» vào `can_cu`; khoá nằm ngoài danh sách thì `if (!kv) continue` bỏ qua. Suy ra bộ đọc cũ không bị lệch trường, nhưng mã cũ không nằm trong các tệp được phép đọc nên suy luận này không có mã đối chứng. (3) và (4) khớp từng điểm với README, `xem.md`, `start.md` và hai hợp đồng, kể cả số đo crm `d0351bcd` (DA6, DA7, DA8) và `1997da85` (OKR 12→26, Việc và Dự án 4→5, Kho tài liệu 2→2).

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng): E1, E2, E3j, E6 — cả bốn dùng chung lệnh vùng 3 của suite plugins (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'`), xanh trên mã cũ diffBase. Chiều đỏ của chúng sống trong ca P200 (đột biến và đối chứng dương nằm trong chính ca), không nằm ở khác biệt giữa baseline và HEAD; coi là regression-guard có chủ ý, hoặc viết lại để khẳng định hành vi mới nếu người muốn.

### Baseline khong do

- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 160 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 7cf78c36 bang-ngoai-n-co-can-cu moc-la-chien-dich nen-khong-tinh-tep-cua-vong ra-soat-lo-trinh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 7cf78c36:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 7cf78c36 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 7cf78c36 HEAD -- dieu-phoi); echo "dieu-phoi doi: ${d:-khong}"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 7cf78c36 2.31.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval ở round này chạy một lần, deterministic).

## Iterations

Round 1: không eval nào đỏ — 18 eval máy xanh, E9 do hội đồng chấm đạt cả ba lens; một mục ngoài hợp đồng (mức medium) chuyển sang review-findings.md cho người quyết ở Cổng 2.
