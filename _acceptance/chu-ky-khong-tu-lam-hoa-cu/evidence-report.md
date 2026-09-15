---
schema_version: 2
feature_slug: chu-ky-khong-tu-lam-hoa-cu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 87e1ccd816d1c8c5ac6abff3108a8da6bda72909
human_signoff: Mạnh 2026-09-15 — ký với 11 giới hạn đã khai. Mục ① (AC-3, RB3 bỏ neo) nâng phạm vi SỬA NGAY, đã sửa và chứng bằng mutant trong cùng lượt; mục ③ (--skip-unchanged loại trừ trọn _acceptance/** trong khi config.yaml và evals.yaml là nguồn định nghĩa lệnh) mở hợp đồng riêng cho 2.14.
---

# Evidence Report: chu-ky-khong-tu-lam-hoa-cu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-4 | test | PASS |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E1-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_rb_t1_stale
  verified_at: 2026-09-15T11:00:00Z
  output: |
      PASS: RB5 moi neo grep cua ho so KHOP mot ten ca that khai trong tep ca (chong lop «doi ten ca, quen neo»)

    Results: 14 passed, 0 failed (routing-baseline-t1)

- eval: E2
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E2-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_rb_sinh_dong
  verified_at: 2026-09-15T11:01:00Z
  output: |
    PASS: RB5 moi neo grep cua ho so KHOP mot ten ca that khai trong tep ca (chong lop «doi ten ca, quen neo»)

    Results: 14 passed, 0 failed (routing-baseline-t1)

- eval: E3
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E3-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_rb_signoff_van_ban
  verified_at: 2026-09-15T11:02:00Z
  output: |
    PASS: RB5 moi neo grep cua ho so KHOP mot ten ca that khai trong tep ca (chong lop «doi ten ca, quen neo»)

    Results: 14 passed, 0 failed (routing-baseline-t1)

- eval: E4
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E4-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_sk_bo_qua
  verified_at: 2026-09-15T11:03:00Z
  output: |
    PASS: SK6 so sach: ADR 0017 neu ADR 0007, GUIDE 7.1 va CHANGELOG neu --skip-unchanged

    Results: 10 passed, 0 failed (repin-lane-skip-unchanged)

- eval: E5
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E5-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_sk_fail_closed
  verified_at: 2026-09-15T11:04:00Z
  output: |
      PASS: SK6 so sach: ADR 0017 neu ADR 0007, GUIDE 7.1 va CHANGELOG neu --skip-unchanged

    Results: 10 passed, 0 failed (repin-lane-skip-unchanged)

- eval: E6
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E6-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_sk_lenh_tu_khoi
  verified_at: 2026-09-15T11:05:00Z
  output: |
    PASS: SK6 so sach: ADR 0017 neu ADR 0007, GUIDE 7.1 va CHANGELOG neu --skip-unchanged

    Results: 10 passed, 0 failed (repin-lane-skip-unchanged)

- eval: E7
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E7-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-15T11:06:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 873 passed, 0 failed

- eval: E8
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-E8-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ckh_rb_ba_cho_tu_phan
  verified_at: 2026-09-15T11:07:00Z
  output: |
    PASS: RB5 moi neo grep cua ho so KHOP mot ten ca that khai trong tep ca (chong lop «doi ten ca, quen neo»)

    Results: 14 passed, 0 failed (routing-baseline-t1)

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-15T11:10:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r5
  exit_code: 0
  verified_at: 2026-09-15T11:12:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-15T11:14:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-chu-ky-khong-tu-lam-hoa-cu-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-15T11:16:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E7 (`bash tests/scripts/run-tests.sh`) — xanh trên CẢ HEAD lẫn diffBase: bản thân lệnh chạy trọn suite tests/scripts (873 ca) và không phân biệt bằng exit code giữa hai bản; nó chứng minh harness còn chạy được, không riêng feature vòng này. Không phải regression-guard có chủ ý — nên xem lại theo finding «E7 khai một chiều đỏ không tồn tại: executors.test.scripts không hề grep» ở review-findings.md (mục Ngoài hợp đồng).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 7/7 eval exit 0, nhưng REJECT do hai suite hồi quy đỏ. Quay lại triển khai: sửa finding trong hợp đồng + ba ca hạ tầng đỏ.
Round 2: REJECT, 15 finding phát hiện (2 trong hợp đồng) — DỪNG-VÁ. Quay lại triển khai: sửa hai finding trong hợp đồng (thứ tự bước sinh thành VẬT, SK5 dùng writer thật) + ghi sổ 11 mục ngoài hợp đồng vào Known limits của hợp đồng.
Round 3: PENDING-JUDGMENT (triage_failed) — 7/7 eval máy + 5 suite exit 0, 0 finding trong hợp đồng, nhưng bước phân loại phạm vi hỏng (thiếu diffFiles) nên 19 finding không phân loại được, hết trần 3 vòng. Cổng Bằng chứng: owner định đoạt 17 mục ngoài hợp đồng — 3 mục (A1/A2/A3) nâng phạm vi sửa ngay ở AC-7, 14 mục Known limits — và mở lượt 4.
Round 4: BLOCKED (agent chết giữa chừng, hạ tầng, không phải vật) — finding trong hợp đồng AC-7/A2 lộ ra: hai tệp ca vẫn gọi tên bước cũ nên luật A2 tự loại trừ đúng chỗ đang vi phạm. Sửa: đổi tên trong cả hai tệp ca + mở rộng phạm vi quét A2. Round 4b: REJECT — finding trong hợp đồng AC-3 (E3 đỏ: ca RB3 đổi tên nhưng quên neo grep trong config.yaml). Quay lại triển khai: sửa neo + thêm ca RB5 đóng cả lớp «đổi tên ca, quên neo».

### Re-pin lần 1 — 2026-09-15, do hoá cũ do sửa mục ① tại Cổng Bằng chứng
run_id: repin-20260915T072246Z-13563
sha: 76879ac482f330990e5b7f0d335358114945abc3 · suites: 5 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-09-15, do ghim lại sau khi gộp origin/main mang mốc 2.13.0 + đổi số ADR 0019
run_id: repin-20260915T075335Z-58520
sha: 71d7d9c623be6a5bc24e06c009fbe160af72e647 · suites: 5 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng

### Re-pin lần 3 — 2026-09-15, do hoá cũ do commit cắt số 2.14.0 chạm hai manifest — ghim lại RIÊNG làn bị chặn, KHÔNG phải chiến dịch (đã hoãn công khai ở Out of scope)
run_id: repin-20260915T132212Z-62849
sha: c0eef437cd6cce1a3be422ce8e563d1df7a8b68a · suites: 5 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng

### Re-pin lần 4 — 2026-09-15, do pin thành phantom sau rebase 23 commit lên origin/main — sha cũ chưa từng lên origin nên CI clone sạch không giải được
run_id: repin-20260915T143727Z-88437
sha: 87e1ccd816d1c8c5ac6abff3108a8da6bda72909 · suites: 5 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng
