---
schema_version: 2
feature_slug: cua-veto-sau-chu-ky
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 71c1ab354747f273e46560202d807ea94721d4c8
human_signoff:
---

# Evidence Report: cua-veto-sau-chu-ky

> Round 2 — REJECT: 12/12 eval hợp đồng PASS, nhưng lệnh suite hồi quy `bash tests/plugins/run-tests.sh` FAIL tại `P93 mot-nguon` (không gắn AC nào của hợp đồng này) → toàn vòng REJECT theo luật lệnh-suite-fail-thì-vòng-fail.

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
  run_id: minted-cua-veto-sau-chu-ky-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_note_da_ky
  verified_at: 2026-09-12T00:00:00Z
  output: |
    đã ký → đóng, 1 dòng NOTE, vắng ở dòng tổng
           [chiều đỏ] gỡ nhánh mới khỏi bản sao → NOTE «cửa veto mở» quay lại cho hồ sơ đã ký
      OK   hồ sơ làn V ĐÃ KÝ → cửa veto đã đóng

- eval: E2
  run_id: minted-cua-veto-sau-chu-ky-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_that_con_mo
  verified_at: 2026-09-12T00:00:00Z
  output: |
    chưa ký → mở, có NOTE và có tên ở dòng tổng
           [chiều đỏ] cho nhánh mới nuốt mọi hồ sơ → hồ sơ CHƯA ký bị tuyên «cửa veto đã đóng bằng chữ ký»
      OK   làn V CHƯA ký → cửa veto vẫn mở

- eval: E3
  run_id: minted-cua-veto-sau-chu-ky-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dong_tong
  verified_at: 2026-09-12T00:00:00Z
  output: |
    dòng tổng: 1 tên đúng, N khớp số tên, ký hết thì im, gỡ ký thì hiện lại
           [chiều đỏ] gỡ dòng rẽ khỏi bản sao → dòng tổng đếm lại hồ sơ đã ký: [a-chua-ky b-da-ky c-lan-v-ky]
      OK   dòng tổng chỉ đếm cửa mở thật

- eval: E4
  run_id: minted-cua-veto-sau-chu-ky-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_giu_cho
  verified_at: 2026-09-12T00:00:00Z
  output: |
           [chiều đỏ a] bỏ phép thử giữ-chỗ khỏi lưới → lưới coi 11/11 mẫu là chữ ký: gc-0-kyhieu gc-1-kyhieu gc-2-kyhieu gc-3-kyhieu gc-4-pending gc-5-tbd gc-6-todo gc-7-na gc-8-none gc-9-unsigned gc-10-waiting
           [chiều đỏ b] bỏ mẫu «pending» khỏi bảng JS → máy quét coi giữ-chỗ pending 2026-09-11 là chữ ký
      OK   ma trận giữ-chỗ trên HAI bộ đọc

- eval: E5
  run_id: minted-cua-veto-sau-chu-ky-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_nhan_khong_dong
  verified_at: 2026-09-12T00:00:00Z
  output: |
      OK   nhãn status không đóng cửa

- eval: E6
  run_id: minted-cua-veto-sau-chu-ky-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dang_thuc
  verified_at: 2026-09-12T00:00:00Z
  output: |
           [chiều đỏ 3] máy quét đọc human_signoff CẢ FILE → lệch ở máy quét tại ô mo-co-ten-chi-o-than mo-rong-chi-o-than
           [chiều đỏ 4] máy quét bỏ nhánh soi-gương frontmatter thiếu dấu đóng → lệch ở máy quét tại ô mo-co-ten-thieu-fence-dong mo-rong-thieu-fence-dong
      OK   đẳng thức hai bộ đọc trên 84 ô

- eval: E7
  run_id: minted-cua-veto-sau-chu-ky-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_khong_noi
  verified_at: 2026-09-12T00:00:00Z
  output: |
           [chiều đỏ 1] cho nhánh đã-ký continue → tập VIOLATION tụt 1 → 0
           [chiều đỏ 2] neo trên kho chưa có câu ghim → thoát 97 «LỖI HẠ TẦNG: base không hợp lệ»
      OK   chỉ đổi LỜI, không đổi CHẶN

- eval: E8
  run_id: minted-cua-veto-sau-chu-ky-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_luat_lan_can
  verified_at: 2026-09-12T00:00:00Z
  output: |
    năm luật lân cận: 5/5 luật vẫn nổ trên hồ sơ ĐÃ KÝ; bản lành im
           [chiều đỏ] cho hồ sơ đã ký đi vòng qua khối cửa veto → mất VIOLATION «làn V chỉ T2»
      OK   năm luật chặn vẫn nổi trên hồ sơ đã ký

- eval: E9
  run_id: minted-cua-veto-sau-chu-ky-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cvsck_dv5
  verified_at: 2026-09-12T00:00:00Z
  output: |
      PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh

    Results: 3 passed, 0 failed

- eval: E10
  run_id: minted-cua-veto-sau-chu-ky-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_cay_that
  verified_at: 2026-09-12T00:00:00Z
  output: |
    cây thật: 4 cửa mở, 27 hồ sơ mo ĐÃ KÝ; lưới = máy quét = kỳ vọng, giao với tập đã-ký RỖNG
           [chiều đỏ] bản cũ (base d1ad3465) liệt 27 hồ sơ đã ký: cat-khoi-viec-cua-anh-tren-tin dac-ta-ux-vat-hoa-cau-truc design-pass-nac-khong-dong-bo duong-do-trong-dinh-nghia-xong hinh-tai-cong-1 …
      OK   cây thật của kit

- eval: E11
  run_id: minted-cua-veto-sau-chu-ky-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_van_ban
  verified_at: 2026-09-12T00:00:00Z
  output: |
           [chiều đỏ 2] START-SCAN-KEYS mất khoá
           [chiều đỏ 3] CONTEXT.md mất luật
      OK   thân lệnh · START-SCAN-KEYS · CONTEXT

- eval: E12
  run_id: minted-cua-veto-sau-chu-ky-E12-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cvsck_ca_thuong_truc
  verified_at: 2026-09-12T00:00:00Z
  output: |
    === cua-veto-sau-chu-ky.test.mjs ===

    [exited with code 0]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T00:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T00:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 1
  verified_at: 2026-09-12T00:00:00Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T00:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-veto-sau-chu-ky-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-12T00:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E9

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E12 và toàn bộ lệnh suite (scripts/hooks/plugins/workflows/product-map) đều pass ngay từ lượt chạy đầu tiên — không có vòng sửa nào cần lặp lại.
Round 2: E1–E12 vẫn PASS 12/12 (E6 nay đo trên ma trận 84 ô thay vì 78), nhưng lệnh suite hồi quy `bash tests/plugins/run-tests.sh` FAIL tại `P93 mot-nguon` (doc_manifest() thiếu số bản cho `feature-loop/skills/feature-loop/SKILL.md`, không gắn AC nào của hợp đồng này) — verdict REJECT, trả về triển khai để vá số bản plugin trước khi verify lại.
