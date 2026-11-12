---
schema_version: 2
feature_slug: release-2-39-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 553b61981c37539295183ac776c8118053391ddb
human_signoff:
---

# Evidence Report: release-2-39-0

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
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-39-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-39-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-39-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-39-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-12T22:50:15Z
  output: |
    mảnh mjs:1/3 chạy xong, thoát sạch

- eval: E3g
  run_id: minted-release-2-39-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: 43 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-39-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: 43 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-39-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-39-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-39-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-39-0-E3j-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-39-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-39-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-12T22:50:15Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-39-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_cua_so
  verified_at: 2026-11-12T22:50:15Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-39-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_dd_giu
  verified_at: 2026-11-12T22:50:15Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-39-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T22:50:15Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-39-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_goi_doi
  verified_at: 2026-11-12T22:50:15Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E8
  run_id: minted-release-2-39-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_lop_chep
  verified_at: 2026-11-12T22:50:15Z
  output: |
    XANH: đúng 1 tệp đổi như ghi chú 2.39.0 kể

- eval: E10
  run_id: minted-release-2-39-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-12T22:50:15Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.38.1 (88d31b63) cài đúng tag

- eval: E11
  run_id: minted-release-2-39-0-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_ba_viec
  verified_at: 2026-11-12T22:50:15Z
  output: |
    XANH: ba việc chỉ-bớt đã xong ở HEAD

- eval: E12
  run_id: minted-release-2-39-0-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_su_mo_ta
  verified_at: 2026-11-12T22:50:15Z
  output: |
    XANH: sử trong mô tả hai plugin ở v2.38.1 còn nguyên trong docs/reference/su-mo-ta-plugin-toi-2-38-1.md

### Judgment

- eval: E9
  judged_by: judge panel (fresh context) — đề xuất PASS
  proposal: PASS
  votes:
    - domain-correctness: UNCERTAIN — Các vế (0) cho năm hồ sơ, (1) và (2) khớp nguồn: Gốc, Vật, số giới hạn và câu trích đều đúng chữ; INIT-CI-COPY-LIST có đúng 36 mục và có pre-merge-check.sh; (3) khớp Context. Riêng mục `luot-kiem-nhe` có hai chi tiết mà nguồn trong danh sách Input không đủ chứng thực, và một trong hai còn lệch với nguồn, nên không thể kết luận PASS.
    - operational-feasibility: PASS — Cả bốn vế đúng theo các tệp trong danh sách Input. Sáu mục con khớp chữ của hợp đồng, opportunity.md và design.md, và số giới hạn khớp Notes (8, 3, 7, 5, 3, 4 mục chọn). Khối INIT-CI-COPY-LIST đếm đúng 36 mục, có `scripts/pre-merge-check.sh`, nên «một tệp + 35 giữ nguyên» đúng. Có vài chi tiết nhỏ (`mjs:1/7`, tên `.github/actions/node-tu-xung`, «không kho tiêu thụ nào gọi» `rel-cua-so.sh`) mà tệp trong danh sách không kiểm được hoặc nói hơi rộng, nhưng không cái nào mâu thuẫn rõ với nguồn.
    - spec-alignment: PASS — Bốn vế đều khớp nguồn. Số mục khớp Notes: 8, 3, 7 (6 cộng 1), 5, 3, 4. Khối INIT-CI-COPY-LIST có đúng 36 mục; CHANGELOG kể chép lại 1 tệp và 35 tệp còn lại. Hai đoạn «Vì sao» và «Ai bị ảnh hưởng» nói thẳng các đổi hành vi, việc gỡ hai tệp và việc mô tả plugin thôi mang sử.
  required_evidence_của_domain-correctness:
    - Dòng CHANGELOG «gate.yml hôm nay: `mjs:1/7`…`mjs:7/7`, `vung:1`…`vung:3`». Design doc (§4.1) chỉ ghi «n … ước 6–8» và hợp đồng chỉ ghi «n rút từ chính gate.yml». Cần `.github/workflows/gate.yml` ở HEAD (ma trận của việc `manh`) cho thấy n = 7 và K = 3, hoặc một câu trong hợp đồng, design hay opportunity của `luot-kiem-nhe` nêu số 7. Nếu có thì vế này đúng.
    - Dòng CHANGELOG «ba việc `design-floor`, `design-eval`, `gate` kiểm bằng hành động dùng chung `.github/actions/node-tu-xung`». Hợp đồng ghi hai việc `design-floor` và `design-eval` kiểm «bằng một bước trong gate.yml». Design §3 ghi ba việc không qua bộ chạy bash là điều phối, bản đồ và `gate`. Tên hành động `node-tu-xung` không có trong hồ sơ nào. Cần `.github/actions/node-tu-xung/action.yml` và `gate.yml` ở HEAD cho thấy đúng ba việc ấy dùng hành động đó, hoặc sửa câu CHANGELOG theo chữ của hợp đồng. Nếu gate.yml khác câu này thì kết luận đổi thành FAIL.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline không đo (round này không đo lại, evals.yaml không đổi từ lần baseline cuối ở round 1): mọi eval ghi `baseline: n-a`.

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E3e — `node scripts/product-map.mjs --root . --check`
- E5 — kiểm `diagram-design/` không đổi và số bằng số ở mốc
- E10 — `node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc`

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED vì hạ tầng — tác tử chấm chạy Node 26, bộ chạy thoát 3; ghi sổ chạy, báo cáo, số đo, sửa bốn câu CHANGELOG hội đồng E9 bắt.
Round 2: toàn bộ eval máy xanh trên 553b6198; verdict PASS (E9 còn một phiếu domain-correctness chưa chốt, để trống human_override cho người ở Cổng 2).
