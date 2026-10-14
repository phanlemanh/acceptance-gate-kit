---
schema_version: 2
feature_slug: release-2-30-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 71f108c5f4289506bfd84ac8ffb863cf37e8e5b5
human_signoff: manh 2026-10-14
---

# Evidence Report: release-2-30-0

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
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-30-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-30-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-30-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-30-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: 31 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-30-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: 31 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-30-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: 31 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-30-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-30-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-30-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-30-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-30-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-30-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-14T02:21:17Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-30-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2300_cua_so
  verified_at: 2026-10-14T02:21:17Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-30-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2300_dd_giu
  verified_at: 2026-10-14T02:21:17Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-30-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T02:21:17Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-30-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-14T02:21:17Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E8
  run_id: minted-release-2-30-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2300_lop_chep
  verified_at: 2026-10-14T02:21:17Z
  output: |
    XANH: đúng 7 tệp đổi như ghi chú 2.30.0 kể

- eval: E10
  run_id: minted-release-2-30-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-14T02:21:17Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.29.0 (6a9c0f9a) cài đúng tag

### Judge (E9 — đề xuất của hội đồng, để trống human_override cho người quyết ở Cổng 2)

- eval: E9
  judged_by: judge panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Ba lens cùng PASS; cả bốn vế của ghi chú nâng cấp khớp mã và tài liệu đi kèm.
  human_override:  # chi nguoi ghi

- domain-correctness: PASS — Cả bốn vế đều khớp mã và tài liệu đi kèm. (1) Mục «crm, theo thứ tự» nói nhận THẲNG từ 2.28.0 và bỏ qua 2.29.0. Nó giữ các bước còn cần của 2.29.0 (`co-hop-dong.cjs`, `tin-hieu-template.md`, TH-cau, BB1, S3c) và cài theo đúng thẻ `v2.30.0`. (2) Bốn tệp chép cùng lúc khớp mã. `khong-can-nguoi.mjs` ném «thiếu ngữ cảnh { findings, ledger, runLog }», `product-map.mjs` truyền `runLog`, `pre-merge-check.sh` gọi `cumCu` của lib, và lib cũ thiếu `cumCu` làm nhánh đó chết nên lưới đóng. (3) Lời về `zalo-qua-webhook` khớp `ganDinhTuyen`: dòng chỉ có số mà ghi trước lượt chấm cuối vào `soCu` nên các mục thành chưa định tuyến. Khuôn `NGOAI-N-GATE2-LINE` có `tieu_de` và `tep`, và dòng mới ghi sau lượt chấm khớp theo mã. (4) `--root`, `--base`, mã thoát 0/1/2 và «không chặn gì mặc định» khớp chú thích đầu `yaml-chuan.cjs` và phần CLI.
- operational-feasibility: PASS — Cả bốn vế khớp mã và tài liệu. (1) Mục «crm, theo thứ tự» nói nhận thẳng từ 2.28.0, bỏ qua 2.29.0. Nó giữ các bước 2.29.0 còn cần (co-hop-dong.cjs, tin-hieu-template, TH-cau, S3c, BB1) và cài đúng thẻ v2.30.0, cấm cài từ main. (2) khong-can-nguoi.mjs ném lỗi «thiếu ngữ cảnh { findings, ledger, runLog }» và product-map.mjs truyền runLog. pre-merge-check.sh gọi cumCu của lib, lib xuất cumCu, và lỗi lib cũ rơi vào __LOI__ nên lưới đóng. (3) Bộ phân giải đẩy dòng chỉ số ghi trước round-tally cuối vào soCu và các mục thành chưa định tuyến. Khuôn NGOAI-N-GATE2-LINE của signoff.md mang tieu_de và tep đúng như lời. (4) Đầu tệp yaml-chuan.cjs khớp ghi chú về --root, --base, mã thoát 0/1/2 và không chặn mặc định.
- spec-alignment: PASS — Cả bốn vế khớp mã. (1) Mục «crm, theo thứ tự» nói crm nhận thẳng từ 2.28.0 và bỏ qua 2.29.0. Mục ấy giữ phần nhận của 2.29.0: `co-hop-dong.cjs`, `tin-hieu-template.md`, TH-cau, S3c. Mục ấy cài theo thẻ `v2.30.0`. (2) `khong-can-nguoi.mjs` dòng 73–74 ném «thiếu ngữ cảnh { findings, ledger, runLog }». `product-map.mjs` dòng 246 truyền `runLog`. `pre-merge-check.sh` dòng 468 và 474 gọi `cumCu` của lib, thiếu thì node lỗi và rơi vào `__LOI__` (đóng). (3) `ganDinhTuyen` trong `lib/out-of-contract.cjs` đưa dòng chỉ có số mà ghi trước `round-tally` cuối vào `soCu`, không gán mục nào, nên mục thành «chưa định tuyến». Khuôn `NGOAI-N-GATE2-LINE` của `commands/signoff.md` mang `tieu_de` và `tep`. (4) `yaml-chuan.cjs` có `--root` và `--base`, thoát 0 sạch / 1 có chỗ / 2 không chạy được, và chỉ in rồi thoát chứ không chặn gì mặc định. `--base` chỉ xét hồ sơ có tệp đổi từ điểm rẽ, đúng chú thích đầu tệp.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline — chứng minh harness chứ không chứng minh tính năng; xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới):

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` — các eval E1, E2, E3j, E6. Chiều đỏ của chúng sống trong các đột biến của ca P200 (chạy bên trong lệnh), nên lệnh vùng 3 xanh ở cả hai phía là regression-guard có chủ ý; người đọc Cổng 2 xác nhận.

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 170 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 6a9c0f9a bo-doc-ho-so-khoan-dung dieu-phoi-khoa-day-giu-nhip dinh-tuyen-theo-ma-muc tac-tu-cham-chi-cham-khong: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 6a9c0f9a:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 6a9c0f9a HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 6a9c0f9a 2.30.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tất cả eval máy xanh, E9 do hội đồng chấm PASS (human_override để trống cho người); verdict PASS.
