---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 16be8eb937876fcb840fd78a5b9bf91940f06700
findings_open: 14
human_signoff:
---

# Evidence Report: cong-nguoi-doc-du-nguon

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | script | PASS |
| E14 | AC-14 | script | PASS |
| E15 | AC-12 | script | PASS |
| E16 | AC-12 | script | PASS |
| E17 | AC-12 | script | PASS |
| E18 | AC-15 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-nguoi-doc-du-nguon-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_luat_thu_bay
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · lý do bash CHỨA nguyên văn lý do mjs

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E2
  run_id: minted-cong-nguoi-doc-du-nguon-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_mot_nguon
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · mũi (c): bash tự duyệt = 1 lần

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E3
  run_id: minted-cong-nguoi-doc-du-nguon-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_fail_closed
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng node: nêu đích danh thứ thiếu=true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E4
  run_id: minted-cong-nguoi-doc-du-nguon-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_khai_lech_vat
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · khoá 0 · 2 mục · 2 dòng sổ → clean=false why="lời khai lệch vật: findings_open khai 0, vật còn 2 mục chờ người (2 ng"

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E5
  run_id: minted-cong-nguoi-doc-du-nguon-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_duong_doc_cu
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng hẳn tệp: VIOLATION=0

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E6
  run_id: minted-cong-nguoi-doc-du-nguon-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_cua_ghi
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · dọn hết mục: mã=0, status→machine-cleared

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E7
  run_id: minted-cong-nguoi-doc-du-nguon-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · ba ca nguyên văn từ hợp đồng thật: đạt

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · không mục nào → AC-1,AC-2

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · bỏ sót 6/6 → blank

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E10
  run_id: minted-cong-nguoi-doc-du-nguon-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_the_cong_2
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vị trí: Trong=3297 Ngoài=3741

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E11
  run_id: minted-cong-nguoi-doc-du-nguon-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_cross_layer_hai_nhanh
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · nhánh awk   → nêu AC-1 xuyên lớp: true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E12
  run_id: minted-cong-nguoi-doc-du-nguon-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_luoi_chep_san_co
  verified_at: 2026-09-13T00:00:00Z
  output: |
    PASS: CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError

    Results: 9 passed, 0 failed

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bon_ben_goi
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · cả bốn bên đổi theo mũi tiêm — chúng cùng một nguồn

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E14
  run_id: minted-cong-nguoi-doc-du-nguon-E14-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_round_trip_writer
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · chiều đỏ: khuôn đổi → bên đọc ra 0 (phải khác 3)

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E15
  run_id: minted-cong-nguoi-doc-du-nguon-E15-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_lop_chep_ci
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · bản tiêm: thiếu=["lib/out-of-contract.cjs"] mã=1

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E16
  run_id: minted-cong-nguoi-doc-du-nguon-E16-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_lint_ho_so
  verified_at: 2026-09-13T00:00:00Z
  output: |
    eval-coverage-lint: no coverage gaps detected.

- eval: E17
  run_id: minted-cong-nguoi-doc-du-nguon-E17-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ban_kinh
  verified_at: 2026-09-13T00:00:00Z
  output: |
    "dung": 10
    }
    }

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng hẳn: coverage_missing=true, còn cờ vàng=true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r4
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay.

E12 (`node tests/scripts/consumer-esm.test.mjs`), E16 (`node scripts/eval-coverage-lint.js . --slug cong-nguoi-doc-du-nguon`) — cả hai baseline: n-a (không đo lại round này; round 3 đo là green, tức pass trên cả head lẫn diffBase). Đây là lưới sẵn có của kit (consumer-esm) và lint phủ eval hẹp theo slug — cả hai là regression-guard có chủ đích (không phải harness giả), không phải eval mới sinh ra để phân biệt vật của vòng này; giữ nguyên, không cần viết lại.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 trong vòng này).

## Iterations

Round 2: mọi 18 eval script + 5 lệnh suite đều exit 0 (baseline phần lớn red, hai lệnh non-discriminating là E12/E16), nhưng review scope-triage phát hiện 4 lỗi TRONG hợp đồng severity high/medium (AC-9, AC-11, AC-13, AC-14 — bộ đếm `inContract` luôn ra 0, `AC_XREF` không nới theo `AC_SUSPECT`, CN13 thiếu chân đo bên gọi thứ tư, CN11 không so tập id hai nhánh) cộng 9 lỗi ngoài hợp đồng (findings_open: 13) — verdict REJECT, quay lại triển khai để vá các lỗ trong phạm vi đã duyệt trước khi verify lại.
Round 3: mọi 18 eval script + 5 lệnh suite lại exit 0 (baseline phần lớn red, E12/E16 vẫn non-discriminating) — verdict PASS. Scope-triage lần này gom được 16 mục chờ người (1 mục TRONG hợp đồng — AC-7, `parseACBlock` nuốt tiêu chí gạch-đầu-dòng sau một tiêu chí tiêu đề, CHƯA vá; 15 mục NGOÀI hợp đồng, phần lớn là lỗ ở lớp phép đo/công cụ của chính vòng này — do-ban-kinh.cjs, evals.yaml lạc hậu, ca test thiếu chiều đỏ). Không mục nào trong 16 mục đó chặn máy evals hiện có, nên verdict giữ PASS; review-findings.md mang toàn bộ chi tiết cho Cổng 2 quyết theo từng đề xuất known-limits/new-contract.
Round 4: mọi 18 eval script + 5 lệnh suite vẫn exit 0 (baseline không đo lại — carried từ round 3), nhưng scope-triage vòng này phát hiện 6 lỗi TRONG hợp đồng (AC-9, AC-10, AC-11 ×3, AC-13 — `parseACBlock` ghi-đè-sau-cùng làm tắt răng cross-layer của pre-merge; `AC_XREF` không nới theo `AC_SUSPECT` gây cờ mù giả trên hợp đồng lành; hai lỗ đo ngay trong chính ca CN11 — assert chuỗi rời rạc thay vì so tập id, và PATH giả lập không tự kiểm node có thật sự vắng; CN13 chỉ dùng một mũi tiêm dùng chung thay vì bốn mũi độc lập như evals.yaml khai; CN10 có nhánh assert tự vô hiệu khi chữ trên thẻ đổi) cộng 8 lỗi NGOÀI hợp đồng (findings_open: 14) — verdict REJECT, quay lại triển khai để vá các lỗ TRONG phạm vi đã duyệt trước khi verify lại.