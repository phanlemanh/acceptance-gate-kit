---
schema_version: 2
feature_slug: bang-ngoai-n-co-can-cu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fe496352f74e57766e0f389e2cf753a1646a69a4
human_signoff: manh 2026-10-14
---

# Evidence Report: bang-ngoai-n-co-can-cu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PENDING-JUDGMENT |
| E8 | AC-8 | judgment | PENDING-JUDGMENT |

## Evidence

- eval: E1
  run_id: minted-bang-ngoai-n-co-can-cu-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T05:03:17Z
  output: |
    node tests/scripts/bang-ngoai-n.test.mjs
    BN Results: 12 PASS · 0 FAIL

- eval: E2
  run_id: minted-bang-ngoai-n-co-can-cu-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T05:03:17Z
  output: |
    node tests/scripts/bang-ngoai-n.test.mjs
    BN Results: 12 PASS · 0 FAIL

- eval: E3
  run_id: minted-bang-ngoai-n-co-can-cu-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T05:03:17Z
  output: |
    node tests/scripts/bang-ngoai-n.test.mjs
    BN Results: 12 PASS · 0 FAIL

- eval: E4
  run_id: minted-bang-ngoai-n-co-can-cu-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T05:03:17Z
  output: |
    node tests/scripts/bang-ngoai-n.test.mjs
    BN Results: 12 PASS · 0 FAIL

- eval: E5
  run_id: minted-bang-ngoai-n-co-can-cu-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T05:03:17Z
  output: |
    node tests/scripts/bang-ngoai-n.test.mjs
    BN Results: 12 PASS · 0 FAIL

- eval: E6
  run_id: minted-bang-ngoai-n-co-can-cu-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_ngoai_n_man_hep
  verified_at: 2026-10-14T05:03:17Z
  output: |
    python3 _acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py
    man-hep: PASS

### Judgment (đề xuất của hội đồng — chờ người chốt ở Cổng 2)

- eval: E7
  judged_by: judge panel (fresh context) — đề xuất PASS, chưa có người chốt
  panel_proposal: PASS
  rationale: |
    - domain-correctness: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432) bắt tác tử viết MỘT câu ngôn ngữ sản phẩm, đủ bốn ý: hậu quả nặng hay nhẹ, có mất hoặc lộ dữ liệu không, người dùng tự gỡ được không (tải lại, thử lại), sửa sau rẻ hay đắt. Khối cấm tên hàm, đường dẫn tệp, mã thoát, từ ngữ regex hay schema, và nói rõ «Khong de xuat cach sua, khong doc code». Câu căn cứ làm cột «Căn cứ» trên thẻ Cổng 2, nên người ký đọc là đồng ý hoặc đảo được mà không phải mở tệp.
    - operational-feasibility: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432 của acceptance-verify.js) bắt buộc đúng MỘT câu ngôn ngữ sản phẩm nêu hậu quả nặng hay nhẹ, mất hay lộ dữ liệu, người dùng tự gỡ được không, sửa sau rẻ hay đắt; cấm tên hàm, đường dẫn, mã thoát, từ ngữ regex/schema, cấm đề xuất cách sửa và cấm đọc code. Tác tử làm đúng khối sẽ viết ra câu căn cứ đủ bốn ý mà người ký đọc được ngay trên thẻ.
    - spec-alignment: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432) bắt tác tử viết can_cu là MỘT câu ngôn ngữ sản phẩm nói đủ bốn ý: hậu quả nặng hay nhẹ, có mất hoặc lộ dữ liệu không, người dùng tự gỡ được không, sửa sau rẻ hay đắt; cấm tên hàm, đường dẫn, mã thoát, từ ngữ regex/schema, cấm đề xuất cách sửa và cấm đọc code.
  human_override: manh 2026-10-14 — Đạt

- eval: E8
  judged_by: judge panel (fresh context) — đề xuất PASS, chưa có người chốt
  panel_proposal: PASS
  rationale: |
    - domain-correctness: PASS — Mục đầu của CHANGELOG.md (2.30.0, mục con «Thẻ Cổng Bằng chứng: mục ngoài hợp đồng thành bảng có cột Căn cứ») nói đủ bảy ý: bảng bốn cột Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ; căn cứ do bước phân loại viết và đi theo cả mục mang sang lượt chấm sau; mục cần quyết đứng đầu; hồ sơ cũ hiện «chưa có căn cứ» kèm MỘT cờ vàng và không phải sửa; dòng lệnh ký và ba lựa chọn không đổi; kho chỉ cần nhận mốc (không khoá mới, không tệp mới). Đoạn «Ngoài hợp đồng» trong commands/acceptance-card.md (dòng 158–173) khớp từng điểm. Lưu ý: CHANGELOG không có tiêu đề «Chưa phát hành» theo đúng chữ; dòng 11 ghi mục đầu tiên chính là phần chưa phát hành, nên judge đọc mục 2.30.0 là mục đó.
    - operational-feasibility: PASS — CHANGELOG.md nói rõ mục đầu tiên (2.30.0) là phần chưa phát hành (dòng 11). Mục «Thẻ Cổng Bằng chứng: mục ngoài hợp đồng thành bảng có cột Căn cứ» (dòng 235–257) nêu đủ bảy ý; khối «Ngoài hợp đồng» trong commands/acceptance-card.md (dòng 158–169) khớp từng điểm đó.
    - spec-alignment: PASS — CHANGELOG.md dòng 235–257 (mục mới nhất, đứng dưới tiêu đề 2.30.0 vì không còn tiêu đề «Chưa phát hành» riêng) và commands/acceptance-card.md dòng 158–173 cùng nói đủ bảy ý. Điểm lệch nhỏ: đề bài viết «câu gộp ký» còn hai tệp viết «dòng lệnh ký», cùng một thứ, không làm đổi kết luận.
  human_override: manh 2026-10-14 — Đạt

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-14T05:03:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Field baseline cua tung block eval ghi n-a.

Eval không-phân-biệt: none — round này không đo lại baseline nên không có eval nào bị liệt kê; các lệnh suite xanh cả hai phía là regression-guard thường.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, deterministic)

## Iterations

Round 1: REJECT — 1 finding trong hợp đồng (BN-4 đếm số hàng thẻ chưa đúng, finding t7) và 2 suite đỏ (LB5/LC6/P190/P201 lệch theo bảng mới). Returned to implementation.
Round 2: E1–E6 pass, mọi lệnh suite xanh; E7 và E8 hội đồng đề xuất PASS nhưng chờ người chốt nên verdict là PENDING-JUDGMENT. Còn 1 finding trong hợp đồng mức low (BN-4 chỉ chốt tổng số hàng) và 2 mục ngoài hợp đồng cho người quyết ở Cổng 2, cộng 8 mục mang sang từ round 1 (xem review-findings.md).
