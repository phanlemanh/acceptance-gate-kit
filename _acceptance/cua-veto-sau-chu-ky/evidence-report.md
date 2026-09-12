---
schema_version: 2
feature_slug: cua-veto-sau-chu-ky
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 285e7efe2e7baaf9a171bbcc835daa4f76a5e1b2
human_signoff:
---

# Evidence Report: cua-veto-sau-chu-ky

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
| E14 | AC-13 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cua-veto-sau-chu-ky-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_note_da_ky
  verified_at: 2026-09-12T10:00:00Z
  output: |
    đã ký → đóng, 1 dòng NOTE, vắng ở dòng tổng
           [chiều đỏ] gỡ nhánh mới khỏi bản sao → NOTE «cửa veto mở» quay lại cho hồ sơ đã ký
      OK   hồ sơ làn V ĐÃ KÝ → cửa veto đã đóng

- eval: E2
  run_id: minted-cua-veto-sau-chu-ky-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_that_con_mo
  verified_at: 2026-09-12T10:00:00Z
  output: |
    chưa ký → mở, có NOTE và có tên ở dòng tổng
           [chiều đỏ] cho nhánh mới nuốt mọi hồ sơ → hồ sơ CHƯA ký bị tuyên «cửa veto đã đóng bằng chữ ký»
      OK   làn V CHƯA ký → cửa veto vẫn mở

- eval: E3
  run_id: minted-cua-veto-sau-chu-ky-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dong_tong
  verified_at: 2026-09-12T10:00:00Z
  output: |
      OK   dòng tổng chỉ đếm cửa mở thật

- eval: E4
  run_id: minted-cua-veto-sau-chu-ky-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_giu_cho
  verified_at: 2026-09-12T10:00:00Z
  output: |
    giữ-chỗ: 11 mẫu × 2 bộ đọc = 22 assert, cả hai bộ đọc giữ cửa MỞ
           [chiều đỏ] gỡ mẫu «pending» khỏi BẢNG Ở NGUỒN → cả lưới lẫn máy quét cùng coi giữ-chỗ pending 2026-09-11 là chữ ký (hồ sơ gc-0-pending rời cả hai danh sách)
      OK   ma trận giữ-chỗ trên HAI bộ đọc

- eval: E5
  run_id: minted-cua-veto-sau-chu-ky-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_nhan_khong_dong
  verified_at: 2026-09-12T10:00:00Z
  output: |
    máy quét: 14 assert · vetoOpenUnsigned=[gc-0-pending gc-1-tbd gc-10-kyhieu gc-2-todo gc-3-na gc-4-unsigned gc-5-waiting gc-6-kyhieu gc-7-none gc-8-kyhieu gc-9-kyhieu nhan-rong nhan-vang]
           [chiều đỏ] gỡ bảng giữ-chỗ khỏi bản sao → máy quét coi giữ-chỗ là chữ ký ở 11/11 mẫu: gc-0-pending gc-1-tbd gc-2-todo gc-3-na gc-4-unsigned gc-5-waiting gc-6-kyhieu gc-7-none gc-8-kyhieu gc-9-kyhieu gc-10-kyhieu
      OK   nhãn status không đóng cửa

- eval: E6
  run_id: minted-cua-veto-sau-chu-ky-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_dang_thuc
  verified_at: 2026-09-12T10:00:00Z
  output: |
           [chiều đỏ iv] trả chỗ đọc chữ ký của Cổng 2 về front_field → lưới tự mâu thuẫn ở ô mo-rong-khoa-hoa mo-rong-khoa-dau-bang mo-rong-khoa-cach-truoc
      OK   một nguồn + ngữ pháp trên 108 ô
    EXIT_CODE=0

- eval: E7
  run_id: minted-cua-veto-sau-chu-ky-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_khong_noi
  verified_at: 2026-09-12T10:00:00Z
  output: |
           [chiều đỏ 1] cho nhánh đã-ký continue → tập VIOLATION tụt 1 → 0
           [chiều đỏ 2] neo trên kho chưa có câu ghim → thoát 97 «LỖI HẠ TẦNG: base không hợp lệ»
      OK   chỉ đổi LỜI, không đổi CHẶN

- eval: E8
  run_id: minted-cua-veto-sau-chu-ky-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_luat_lan_can
  verified_at: 2026-09-12T10:00:00Z
  output: |
    năm luật lân cận: 5/5 luật vẫn nổ trên hồ sơ ĐÃ KÝ; bản lành im
           [chiều đỏ] cho hồ sơ đã ký đi vòng qua khối cửa veto → mất VIOLATION «làn V chỉ T2»
      OK   năm luật chặn vẫn nổ trên hồ sơ đã ký

- eval: E9
  run_id: minted-cua-veto-sau-chu-ky-E9-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cvsck_dv5
  verified_at: 2026-09-12T10:00:00Z
  output: |
    PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh

    Results: 5 passed, 0 failed

- eval: E10
  run_id: minted-cua-veto-sau-chu-ky-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_cay_that
  verified_at: 2026-09-12T10:00:00Z
  output: |
    cây thật: 4 cửa mở, 27 hồ sơ mo ĐÃ KÝ; lưới = máy quét = kỳ vọng, giao với tập đã-ký RỖNG
           [chiều đỏ] bản cũ (base d1ad3465) liệt 27 hồ sơ đã ký: cat-khoi-viec-cua-anh-tren-tin dac-ta-ux-vat-hoa-cau-truc design-pass-nac-khong-dong-bo duong-do-trong-dinh-nghia-xong hinh-tai-cong-1 …
      OK   cây thật của kit

- eval: E11
  run_id: minted-cua-veto-sau-chu-ky-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_van_ban
  verified_at: 2026-09-12T10:00:00Z
  output: |
           [chiều đỏ 2] START-SCAN-KEYS mất khoá
           [chiều đỏ 3] CONTEXT.md mất luật
      OK   thân lệnh · START-SCAN-KEYS · CONTEXT

- eval: E12
  run_id: minted-cua-veto-sau-chu-ky-E12-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cvsck_ca_thuong_truc
  verified_at: 2026-09-12T10:00:00Z
  output: |
      PASS: CVS4 chiều đỏ: gỡ nhánh mới → lưới nói lại «cửa veto mở» cho hồ sơ đã ký (chữ ký không đóng cửa)
    Results: 4 passed, 0 failed (cua-veto-sau-chu-ky)
    === cua-veto-sau-chu-ky.test.mjs ===

- eval: E14
  run_id: minted-cua-veto-sau-chu-ky-E14-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cvsck_lui_khong_engine
  verified_at: 2026-09-12T10:00:00Z
  output: |
           [chiều đỏ 1] gỡ mẫu chữ khỏi khối bản lùi → giữ-chỗ TBD lọt khi vắng engine
           [chiều đỏ 2] trả câu NOTE về dạng nháy hỏng → NOTE in danh sách RỖNG: «XED prefix list —  (dấu * = khớp tiền tố). NOTHING else is treated as a placehol»
      OK   bản lùi + NOTE một nguồn

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_scripts_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-12T10:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-12T10:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r4
  exit_code: 0
  verified_at: 2026-09-12T10:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-veto-sau-chu-ky-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-12T10:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-veto-sau-chu-ky-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 0
  verified_at: 2026-09-12T10:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E9 (baseline: green — pass trên CẢ HEAD lẫn diffBase, tức DV5 xanh cả trước và sau feature; đúng như review-findings đã chỉ ra, ca "DV5u-mutant" bên trong bài test này tự chép lại thân luật DV5u thay vì gọi qua luật thật, nên màu xanh-cả-hai-phía ở đây không chứng minh feature — cần rút hàm thuần dùng chung giữa DV5u thật và ca mutant, hoặc xác nhận đây là regression-guard có chủ ý và ghi rõ).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: 13/13 eval máy (E1–E12, E14) + 5 lệnh suite hồi quy đều PASS cơ học (exit 0); verdict tổng vẫn REJECT vì scope-triage xác nhận 8 phát hiện THẬT khớp AC trong hợp đồng (2 lỗ AC-13 nghiêm trọng: cờ NARROW_NET_BLIND/blind-note bị nuốt qua subshell hoặc không được đặt ở `signoff_that`, khiến lưới im lặng chạy bằng bản lùi hẹp hơn hoặc báo sai hồ sơ đã ký là "còn veto"; cộng 5 lỗ đo-không-gắn-vào-vật ở AC-1/AC-7/AC-8/AC-11 nơi chiều đỏ của chan-*.mjs chỉ so số lượng, dùng assertion âm-tính-một-mình, hoặc `|| ''` che ca NOTE biến mất) — quay lại triển khai để vá đúng lớp trước khi verify lại.
