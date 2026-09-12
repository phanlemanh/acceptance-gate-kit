---
schema_version: 2
feature_slug: cua-veto-sau-chu-ky
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e18aa7bbb4ecfdc4337496617f9285efb1b3dd0b
human_signoff:
---

# Evidence Report: cua-veto-sau-chu-ky

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào được máy tự sửa; danh sách đầy đủ nằm trong review-findings.md; người xem lại toàn bộ trước khi ký.

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

## Evidence

- eval: E1
  run_id: minted-cua-veto-sau-chu-ky-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_note_da_ky
  verified_at: 2026-09-12T09:00:00Z
  output: |
    đã ký → đóng, 1 dòng NOTE, vắng ở dòng tổng
           [chiều đỏ] gỡ nhánh mới khỏi bản sao → NOTE «cửa veto mở» quay lại cho hồ sơ đã ký
      OK   hồ sơ làn V ĐÃ KÝ → cửa veto đã đóng

- eval: E2
  run_id: minted-cua-veto-sau-chu-ky-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_that_con_mo
  verified_at: 2026-09-12T09:00:00Z
  output: |
    chưa ký → mở, có NOTE và có tên ở dòng tổng
           [chiều đỏ] cho nhánh mới nuốt mọi hồ sơ → hồ sơ CHƯA ký bị tuyên «cửa veto đã đóng bằng chữ ký»
      OK   làn V CHƯA ký → cửa veto vẫn mở

- eval: E3
  run_id: minted-cua-veto-sau-chu-ky-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dong_tong
  verified_at: 2026-09-12T09:00:00Z
  output: |
    dòng tổng: 1 tên đúng, N khớp số tên, ký hết thì im, gỡ ký thì hiện lại
           [chiều đỏ] gỡ dòng rẽ khỏi bản sao → dòng tổng đếm lại hồ sơ đã ký: [a-chua-ky b-da-ky c-lan-v-ky]
      OK   dòng tổng chỉ đếm cửa mở thật

- eval: E4
  run_id: minted-cua-veto-sau-chu-ky-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_giu_cho
  verified_at: 2026-09-12T09:00:00Z
  output: |
    giữ-chỗ: 11 mẫu × 2 bộ đọc = 22 assert, cả hai bộ đọc giữ cửa MỞ
           [chiều đỏ] gỡ mẫu «pending» khỏi BẢNG Ở NGUỒN → cả lưới lẫn máy quét cùng coi giữ-chỗ pending 2026-09-11 là chữ ký (hồ sơ gc-0-pending rời cả hai danh sách)
      OK   ma trận giữ-chỗ trên HAI bộ đọc

- eval: E5
  run_id: minted-cua-veto-sau-chu-ky-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_nhan_khong_dong
  verified_at: 2026-09-12T09:00:00Z
  output: |
    máy quét: 14 assert · vetoOpenUnsigned=[gc-0-pending gc-1-tbd gc-10-kyhieu gc-2-todo gc-3-na gc-4-unsigned gc-5-waiting gc-6-kyhieu gc-7-none gc-8-kyhieu gc-9-kyhieu nhan-rong nhan-vang]
           [chiều đỏ] gỡ bảng giữ-chỗ khỏi bản sao → máy quét coi giữ-chỗ là chữ ký ở 11/11 mẫu: gc-0-pending gc-1-tbd gc-2-todo gc-3-na gc-4-unsigned gc-5-waiting gc-6-kyhieu gc-7-none gc-8-kyhieu gc-9-kyhieu gc-10-kyhieu
      OK   nhãn status không đóng cửa

- eval: E6
  run_id: minted-cua-veto-sau-chu-ky-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dang_thuc
  verified_at: 2026-09-12T09:00:00Z
  output: |
           [chiều đỏ iii] máy quét tự đọc cả file → lệch ở máy quét tại ô mo-co-ten-chi-o-than mo-rong-chi-o-than
      OK   một nguồn + ngữ pháp trên 108 ô

- eval: E7
  run_id: minted-cua-veto-sau-chu-ky-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_khong_noi
  verified_at: 2026-09-12T09:00:00Z
  output: |
           [chiều đỏ 1] cho nhánh đã-ký continue → tập VIOLATION tụt 1 → 0
           [chiều đỏ 2] neo trên kho chưa có câu ghim → thoát 97 «LỖI HẠ TẦNG: base không hợp lệ»
      OK   chỉ đổi LỜI, không đổi CHẶN

- eval: E8
  run_id: minted-cua-veto-sau-chu-ky-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_luat_lan_can
  verified_at: 2026-09-12T09:00:00Z
  output: |
    năm luật lân cận: 5/5 luật vẫn nổ trên hồ sơ ĐÃ KÝ; bản lành im
           [chiều đỏ] cho hồ sơ đã ký đi vòng qua khối cửa veto → mất VIOLATION «làn V chỉ T2»
      OK   năm luật chặn vẫn nổ trên hồ sơ đã ký

- eval: E9
  run_id: minted-cua-veto-sau-chu-ky-E9-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cvsck_dv5
  verified_at: 2026-09-12T09:00:00Z
  output: |
      PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh

    Results: 3 passed, 0 failed

- eval: E10
  run_id: minted-cua-veto-sau-chu-ky-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_cay_that
  verified_at: 2026-09-12T09:00:00Z
  output: |
    cây thật: 4 cửa mở, 27 hồ sơ mo ĐÃ KÝ; lưới = máy quét = kỳ vọng, giao với tập đã-ký RỖNG
           [chiều đỏ] bản cũ (base d1ad3465) liệt 27 hồ sơ đã ký: cat-khoi-viec-cua-anh-tren-tin dac-ta-ux-vat-hoa-cau-truc design-pass-nac-khong-dong-bo duong-do-trong-dinh-nghia-xong hinh-tai-cong-1 …
      OK   cây thật của kit

- eval: E11
  run_id: minted-cua-veto-sau-chu-ky-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_van_ban
  verified_at: 2026-09-12T09:00:00Z
  output: |
           [chiều đỏ 2] START-SCAN-KEYS mất khoá
           [chiều đỏ 3] CONTEXT.md mất luật
      OK   thân lệnh · START-SCAN-KEYS · CONTEXT

- eval: E12
  run_id: minted-cua-veto-sau-chu-ky-E12-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cvsck_ca_thuong_truc
  verified_at: 2026-09-12T09:00:00Z
  output: |
      PASS: CVS4 chiều đỏ: gỡ nhánh mới → lưới nói lại «cửa veto mở» cho hồ sơ đã ký (chữ ký không đóng cửa)
    Results: 4 passed, 0 failed (cua-veto-sau-chu-ky)
    === cua-veto-sau-chu-ky.test.mjs ===

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-12T09:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-12T09:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-12T09:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-12T09:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-veto-sau-chu-ky-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-12T09:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E9 (`node tests/scripts/additive-only.test.mjs`, baseline: green) — DV5 (kiểm tra diff-chỉ-thêm trên pre-merge-check.sh + recheck-evidence.cjs) pass CẢ trên HEAD lẫn diffBase; đây là regression-guard có chủ ý (chặn xoá dòng luật cũ ngoài ALLOWED_REMOVALS, không liên quan hành vi mới của round này), nên không cần viết lại thành assert hành vi mới — giữ nguyên như một guard.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: scope-triage không chạy được (không phân loại được finding vào/ngoài hợp đồng) — 12 eval + 5 lệnh suite máy đều xanh (0 fail, xem ## Evidence), nhưng máy KHÔNG tự phân loại và KHÔNG tự sửa finding nào; toàn bộ 9 finding chuyển cho người tại review-findings.md, verdict PENDING-JUDGMENT.
