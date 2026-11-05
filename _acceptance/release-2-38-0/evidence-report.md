---
schema_version: 2
feature_slug: release-2-38-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 633ebb021123104f722823bef74f7bbb57308d7d
human_signoff: Phan Le Manh 2026-11-05
---

# Evidence Report: release-2-38-0

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

- eval: E1
  run_id: minted-release-2-38-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-38-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-38-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-38-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: 43 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-38-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-38-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-38-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-38-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-38-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-38-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-38-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-38-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-05T06:14:34Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-38-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_cua_so
  verified_at: 2026-11-05T06:14:34Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-38-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_dd_giu
  verified_at: 2026-11-05T06:14:34Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-38-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T06:14:34Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-38-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_goi_doi
  verified_at: 2026-11-05T06:14:34Z
  output: |
    goi chi doi so: dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-38-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_lop_chep
  verified_at: 2026-11-05T06:14:34Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 2.38.0 kể

- eval: E10
  run_id: minted-release-2-38-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-05T06:14:34Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.37.0 (39fa45cc) cài đúng tag

### Judge (E9, AC-9)

Hội đồng đề xuất PASS. Ba phiếu, không phiếu nào bất đồng.

- domain-correctness: PASS — Mục 2.38.0 của CHANGELOG khớp các nguồn trong Input cả năm vế: số giới hạn (6 mục ở ban-do-khuon-roi-nhom, 17 mục ở khoi-khuon-tren-the-cong), hai câu trích Ngoài-1 và Ngoài-11/15, số TRƯỚC/SAU theo design.md §5, lớp chép CI «không chép gì» (36 tệp trong INIT-CI-COPY-LIST, không tệp nào đổi).
- operational-feasibility: PASS — Dòng «Gốc:», gạch «Vật:» và hai đoạn giới hạn khớp chữ opportunity và hợp đồng; lời về cờ `--nhom`, `--nhom-moi`, `--gan`, khoá `chon`, khối «Khuôn», `ngoai_le` khớp hợp đồng, design.md, khuôn tệp và GUIDE §5.2; hai đổi hành vi và lý do cắt trước `nen-thiet-ke-0411` nói thẳng.
- spec-alignment: PASS — Ba câu trích Ngoài-1, Ngoài-11, Ngoài-15 đúng nguyên văn, bảng TRƯỚC/SAU khớp design.md §5, INIT-CI-COPY-LIST có đúng 36 mục và phần so sánh `commands/acceptance-init.md` với v2.37.0 không có dòng đổi.

- eval: E9
  judged_by: judge panel (3 lens, fresh context)
  verdict: PASS
  rationale: Cả ba góc nhìn đối chiếu mục 2.38.0 của CHANGELOG với nguồn và thấy khớp cả năm vế.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (green trên cả HEAD lẫn baseline; chứng minh harness, không chứng minh feature) — xác nhận là regression-guard có chủ ý, không viết lại ở vòng này:

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`: E1, E2, E3j, E6 (chiều đỏ sống trong ca P200 qua các đột biến của chính ca, không ở khác biệt HEAD với baseline)
- `bash tests/scripts/run-tests.sh --manh bash`: E3

### Baseline khong do

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 11 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 39fa45cc ban-do-khuon-roi-nhom khoi-khuon-tren-the-cong: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 39fa45cc:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 39fa45cc HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 39fa45cc HEAD -- dieu-phoi road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-38-0/lop-chep-doi.sh 39fa45cc 2.38.0: bo qua baseline: tep _acceptance/release-2-38-0/lop-chep-doi.sh co o cay dang kiem nhung chua co o merge-base 2c77e408016fb411efa990cc3487f96d2c5f06c2 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — mọi eval chạy một lần, xác định (deterministic), không eval nào có runs lớn hơn 1.

## Iterations

Round 1: lượt chấm đầu REJECT — ca P161 ở vùng 2 của suite plugins đỏ; đã ghi báo cáo, sổ chạy, số đo, dòng sổ thay câu trích mang dấu đậm, vật giữ nguyên.
Round 2: toàn bộ 18 lệnh máy xanh, hội đồng E9 ba phiếu PASS, không finding nào còn mở.
