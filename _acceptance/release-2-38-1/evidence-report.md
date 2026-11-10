---
schema_version: 2
feature_slug: release-2-38-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2d90461a99a5ad21c7f5ea40059471aaed3fd4d3
human_signoff:
---

# Evidence Report: release-2-38-1

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
  run_id: minted-release-2-38-1-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-38-1-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-38-1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-38-1-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: 43 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-38-1-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-10T09:34:38Z
  output: |
    PASS: co it nhat mot *.test.mjs duoc chay
    Results: 43 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-38-1-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-38-1-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-38-1-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-38-1-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-38-1-E3j-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-38-1-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-38-1-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-10T09:34:38Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-38-1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2381_cua_so
  verified_at: 2026-11-10T09:34:38Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-38-1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2381_dd_giu
  verified_at: 2026-11-10T09:34:38Z
  output: |
    moc:   "version": "2.7.1" | HEAD:   "version": "2.7.1"

- eval: E6
  run_id: minted-release-2-38-1-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-10T09:34:38Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-38-1-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2381_goi_doi
  verified_at: 2026-11-10T09:34:38Z
  output: |
    goi chi doi so: dieu-phoi/.claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-38-1-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2381_lop_chep
  verified_at: 2026-11-10T09:34:38Z
  output: |
    XANH: đúng 1 tệp đổi như ghi chú 2.38.1 kể

- eval: E10
  run_id: r1-l15-1-20261110093438
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-10T09:34:38Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.38.0 (c8fa5a65) cài đúng tag

### Judgment

Hội đồng đề xuất cho E9 (đề xuất, chưa phải quyết định của người; `human_override` để trống cho người điền ở Cổng 2):

- eval: E9
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Cả ba góc nhìn cùng đề xuất PASS; năm vế khớp nguồn (xem phiếu từng judge bên dưới).
  human_override:  # chi nguoi ghi

Phiếu từng judge:

- domain-correctness: PASS — Cả năm vế khớp nguồn. Mục 2.38.1 chép đúng Gốc, Luật mới, tám dạng hồ sơ không tính, miễn trừ theo đỉnh nhánh đích, code ngoài t3_paths, cờ --no-t1-escape và 22 mục Ngoài-N (đếm đủ 22, câu Ngoài-7 trích đúng chữ). Số đo khớp ds-pr.json (đếm lại ra 48 PR, 10 kho, 27/12/2/7 và 3/2/1/1). Khối INIT-CI-COPY-LIST có 36 mục gồm scripts/pre-merge-check.sh, còn «Vì sao» và «Ai bị ảnh hưởng» nói thẳng PR đổi t3_paths không có hồ sơ được chấm nay bị chặn.
- operational-feasibility: PASS — Cả năm vế đều khớp nguồn. (0) Dòng «Gốc:», gạch «Vật:» và các luật bám đúng chữ AC-1 đến AC-7 và design.md. Ngoài-7 chép nguyên văn, và Notes liệt kê đúng 22 mục Ngoài. (1) Các dạng hồ sơ bị chặn, miễn trừ PR cài kit, code ngoài t3_paths giữ luật cũ và cờ --no-t1-escape khớp hợp đồng t3-can-ho-so-arm và đoạn README. (2) ds-pr.json có 48 PR của 10 kho, chia 27 · 12 · 2 · 7. Bảy PR bị chặn thêm theo kho là 3 · 2 · 1 · 1. (3) Khối INIT-CI-COPY-LIST (dòng 168 đến 203) có đúng 36 mục, gồm pre-merge-check.sh. (4) «Vì sao 2.38.1» và «Ai bị ảnh hưởng» nói thẳng PR đổi t3_paths không có hồ sơ được chấm nay bị chặn. Căn cứ patch (không cờ, khoá cấu hình hay lệnh mới) đúng với Context của release-2-38-1.
- spec-alignment: PASS — Cả năm vế đều khớp nguồn. (0) Dòng «Gốc:», gạch «Vật:» (đúng tên tính năng trong hợp đồng) và các lý do hồ sơ không được tính khớp contract, design.md và AC-1/AC-3. Notes của hợp đồng liệt kê đúng 22 mục Ngoài-N, và câu Ngoài-7 được trích đúng chữ. (1) Miễn trừ theo đỉnh nhánh đích, code ngoài t3_paths giữ luật cũ, `--no-t1-escape` và thông điệp cũ khi không có gì dưới `_acceptance/` khớp AC-6, AC-7 và đoạn README. (2) Trong rang/ds-pr.json đếm được 48 PR, 10 kho, 27·12·2 không chặn thêm, 7 chặn thêm chia 3·2·1·1. (3) Khối INIT-CI-COPY-LIST có 36 mục (dòng 168–203), gồm `scripts/pre-merge-check.sh`, nên «35 tệp còn lại» đúng. (4) «Vì sao 2.38.1» nói thẳng PR đổi t3_paths không có hồ sơ được chấm nay bị chặn, và căn cứ patch (không cờ, không khoá cấu hình, không lệnh mới) khớp Context của release-2-38-1.

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

### Baseline khong do

- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 119 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh c8fa5a65 t3-can-ho-so-arm: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show c8fa5a65:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet c8fa5a65 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only c8fa5a65 HEAD -- dieu-phoi feature-loop road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-38-0/lop-chep-doi.sh c8fa5a65 2.38.1: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh, E9 hội đồng đề xuất PASS (chờ người ở Cổng 2). Verdict PASS.
