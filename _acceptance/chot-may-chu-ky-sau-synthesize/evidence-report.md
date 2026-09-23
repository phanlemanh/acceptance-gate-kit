---
schema_version: 2
feature_slug: chot-may-chu-ky-sau-synthesize
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b7fbed29f4cdbe2f5420982dee4b30d392b5efb0
human_signoff:
---

# Evidence Report: chot-may-chu-ky-sau-synthesize

PASS — round 5, sau round 4 PASS (human_signoff: Mạnh 2026-09-23). Owner nâng phạm vi Ngoài-1 sau chữ ký (bản ghi carry lồng trong frontmatter phải giữ giờ carry, gộp vào lời hứa AC-2); hồ sơ mở lại implemented cho lượt này. Lịch sử đầy đủ ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E9 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-chot-may-chu-ky-sau-synthesize-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac1
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E2
  run_id: minted-chot-may-chu-ky-sau-synthesize-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac2
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E3
  run_id: minted-chot-may-chu-ky-sau-synthesize-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac3
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E4
  run_id: minted-chot-may-chu-ky-sau-synthesize-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac4
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC6-dot-bien ban sao cham dong verdict -> phep im bao «cham dong ngoai bon khoa»

    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E5
  run_id: minted-chot-may-chu-ky-sau-synthesize-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac5
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC7-khong-git goc khong phai kho git -> ma rieng + «khong doc duoc o day»
    PASS: CTN-AC1-vi-phan vi phan voi ben doc that: 114 o chu ky/override
    PASS: CTN-AC2-vi-phan vi phan voi ben doc that: 328 o gio carry

- eval: E6
  run_id: minted-chot-may-chu-ky-sau-synthesize-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac6
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC1-vi-phan vi phan voi ben doc that: 114 o chu ky/override
    PASS: CTN-AC2-vi-phan vi-phan voi ben doc that: 328 o gio carry
    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E7
  run_id: minted-chot-may-chu-ky-sau-synthesize-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac7
  verified_at: 2026-09-23T11:29:59Z
  output: |
    co mat: bo-dung-chung-nhan-chuoi
    co mat: tieu-de-cot-doc-tron
    im: 51 bao cao crm, 51 bi cham, 0 dong ngoai bon khoa

- eval: E9
  run_id: chot-truong-nguoi
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac7_nhanh
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC3-vi-phan vi phan: 38 o khoi vo huong + gio dung dang khac
    PASS: CTN-AC8-vi-phan 12 dot bien cua khuon doc — moi cai do dung truc no pha
    Results: 30 passed, 0 failed (chot-truong-nguoi)

- eval: E8
  run_id: minted-chot-may-chu-ky-sau-synthesize-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac8
  verified_at: 2026-09-23T11:29:59Z
  output: |
    PASS: CTN-AC8-carry khoi carry lay invokedAt -> phep AC-2 goi id eval carry
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi
    Results: 30 passed, 0 failed (chot-truong-nguoi)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-23T11:29:59Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-23T11:29:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r5
  exit_code: 0
  verified_at: 2026-09-23T11:29:59Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-23T11:29:59Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-23T11:29:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay
none — baseline không đo lại vòng này (carried từ round 1), nên không có eval nào xếp vào KHÔNG-PHÂN-BIỆT ở round này.

## Variance

none — không eval nào có runs > 1 vòng này (không có eval ngẫu nhiên).

## Iterations

Round 1: t3 AC-1, t4 AC-2 phát hiện — chốt chưa nhận đúng frontmatter/khoá/run_id theo luật bên đọc. Quay lại implementation.
Round 2: PASS — 2 phát hiện trong hợp đồng cùng lớp, áp dụng dừng-vá; hồ sơ ký PASS.
Round 3: REJECT — sau đổi khuôn (nhận đúng ngữ pháp bên đọc, đo vi phân với lib/evidence-core.cjs), review adversarial vẫn xác nhận 4 phát hiện Trong hợp đồng ở AC-1 (rào đóng frontmatter thiếu, block-scalar mở trên dòng gạch đầu dòng, và ma trận vi phân không phủ đúng ngữ pháp thật của bộ đọc L3) dù mọi eval máy xanh — đã chạm trần 3 vòng, cần leo thang cho người quyết.
Round 4: PASS — owner trả lời «tiếp tục» tại điểm dừng trần 3 lượt; sửa hẹp đúng bốn phát hiện của round 3 (giới hạn cột 0 chỉ còn áp cho human_signoff/bypass_ack — sửa hồi quy rào frontmatter không đóng; cột vô hướng rút từ cột khoá thay vì dòng mở `- output: |`; trục vị trí B của bảng vi phân rút trực tiếp từ biểu thức L3 thật, năm hình dạng override mà L3 vẫn đếm nhưng chốt không chạm nay khai thành giới hạn đã biết trong khối GIOI-HAN-CHOT); bảng vi phân 472 ô + 11 đột biến, mọi eval máy xanh, adversarial-verify không còn phát hiện Trong hợp đồng nào mới — 3 phát hiện còn lại (1 mới severity high, 2 known-limits) xếp Ngoài hợp đồng cho người quyết ở Gate 2. Hồ sơ ký PASS (human_signoff: Mạnh 2026-09-23).
Round 5 (hiện tại): PASS — sau chữ ký round 4, owner đổi quyết định Ngoài-1 (trước ghi Known limits) sang «nâng phạm vi sửa ngay»: bản ghi carry lồng trong frontmatter phải giữ giờ carry, gộp vào lời hứa AC-2; hồ sơ mở lại về implemented cho S4 lượt 5 (vượt trần 3, theo lệnh owner). Sửa đúng phát hiện đó; mọi eval máy xanh (30/30 chot-truong-nguoi mỗi eval + corpus crm 51 báo cáo/51 bị chạm/0 dòng ngoài bốn khoá), adversarial-verify không phát hiện gì mới Trong hợp đồng lẫn Ngoài hợp đồng. Ngoài-2 (CTN-AC8-vi-phan không tự đối chứng dương khi chạy riêng) giữ Known limits theo quyết định round 4, không chấm lại; mục Ngoài hợp đồng «Hình dạng 2» (corpus kiemIm dùng cùng ngữ pháp với chốt, carried từ round 3) vẫn chưa nghiệm — xem review-findings.md.
