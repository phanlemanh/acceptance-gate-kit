---
schema_version: 2
feature_slug: release-2-32-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6894a57e97aba03e96176f97e12a2bd039c2b476
human_signoff: Manh Phan 2026-10-17
---

# Evidence Report: release-2-32-0

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
| E9 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-32-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-32-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-32-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-32-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-32-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-32-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: 34 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-32-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-32-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-32-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-32-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-32-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-32-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-17T05:54:54Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-32-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_cua_so
  verified_at: 2026-10-17T05:54:54Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-32-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_dd_giu
  verified_at: 2026-10-17T05:54:54Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-32-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T05:54:54Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-32-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_goi_doi
  verified_at: 2026-10-17T05:54:54Z
  output: |
    hai goi doi: dieu-phoi/.claude-plugin/plugin.json dieu-phoi/scripts/cua-tin-hieu.mjs dieu-phoi/scripts/dieu-phoi.mjs dieu-phoi/scripts/mau/LUAT.md dieu-phoi/scripts/phat-lich.mjs dieu-phoi/scripts/yeu-cau.mjs road-map/.claude-plugin/plugin.json road-map/README.md road-map/commands/bo-ghim.md road-map/commands/ghim.md road-map/commands/gui.md road-map/commands/tra-lai.md road-map/commands/xem.md

- eval: E8
  run_id: minted-release-2-32-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_lop_chep
  verified_at: 2026-10-17T05:54:54Z
  output: |
    XANH: đúng 6 tệp đổi như ghi chú 2.32.0 kể

- eval: E10
  run_id: minted-release-2-32-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-17T05:54:54Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.31.0 (f0634454) cài đúng tag

### Judgment

Hội đồng đề xuất cho E9: PASS (ba lăng kính cùng PASS). Ô human_override để TRỐNG cho người quyết ở Cổng 2.

- eval: E9
  judged_by: judge panel (fresh context, 3 lenses)
  verdict: PASS
  rationale: Cả ba lăng kính cùng thấy bốn vế của AC-9 khớp tệp đầu vào: mục nhận kho crm sau 2.31.0 và cài theo thẻ v2.32.0, lớp chép CI (28 mục, hai tệp gắn nhãn only-if-declared lo_trinh), bốn lệnh road-map mới, và khoá lo_trinh.chan mặc định tắt.
  human_override:  # chi nguoi ghi

Phiếu từng lăng kính:

- domain-correctness: PASS — Cả bốn vế khớp với tệp đầu vào. (1) Mục «crm, theo thứ tự» ghi «nhận SAU 2.31.0» và «Cài theo thẻ v2.32.0», cấm cài từ main. (2) Khối INIT-CI-COPY-LIST có đúng 28 mục, gio-may.mjs và chan-lo-trinh.cjs đều mang nhãn [only-if-declared: lo_trinh]. lo-trinh.mjs có `import * as GM from './gio-may.mjs'` ở mức module nên thiếu tệp thì ERR_MODULE_NOT_FOUND. pre-merge-check.sh chỉ in một dòng NOTE khi kho bật mà thiếu lib. (3)–(4) Bốn lệnh mới, khoá model-invocation và việc có ghi tệp lộ trình hay không khớp README và các tệp lệnh. Khoá `lo_trinh.chan` vắng hoặc false thì tắt và kho không khai thì không đổi gì, khớp lib/chan-lo-trinh.cjs và hợp đồng kho-cam-ket-co-lo-trinh. Chỉ tên tệp ý `nguoi-<tên git>-<n>.json` và đường «thư mục chính» của `/road-map:gui` nằm ở gui-tin-hieu.mjs ngoài danh sách đầu vào, nên tôi không kiểm được hai chi tiết đó; các đầu vào còn lại không mâu thuẫn với chúng.
- operational-feasibility: PASS — Cả bốn vế khớp. (1) Mục «crm, theo thứ tự» nói «nhận SAU 2.31.0» và «Cài theo thẻ `v2.32.0`». (2) Lời về lớp chép CI khớp: `acceptance-init.md` gắn nhãn `[only-if-declared: lo_trinh]` cho `gio-may.mjs` và `chan-lo-trinh.cjs`, `lo-trinh.mjs` dòng 32 `import * as GM from './gio-may.mjs'`, và `pre-merge-check.sh` dòng 1811-1812 chỉ in một dòng NOTE khi thiếu lib. (3) Bốn lệnh `gui`, `ghim`, `bo-ghim`, `tra-lai` khớp README và các tệp lệnh về tên, tác dụng, tệp ghi và khoá model-invocation. (4) `lo_trinh.chan` mặc định tắt khớp `lib/chan-lo-trinh.cjs` (vắng hoặc `false` thì in rỗng, thoát 0) và hợp đồng `kho-cam-ket-co-lo-trinh`.
- spec-alignment: PASS — Cả bốn vế khớp. (1) Mục «crm, theo thứ tự» nói nhận SAU 2.31.0 và cài theo ĐÚNG thẻ v2.32.0, không cài từ main. (2) Danh sách chép CI có đúng 28 mục. `gio-may.mjs` và `lib/chan-lo-trinh.cjs` mang nhãn `[only-if-declared: lo_trinh]`. `lo-trinh.mjs` nạp `gio-may.mjs` bằng `import` tĩnh ngay lúc nạp. `pre-merge-check.sh` thiếu `lib/chan-lo-trinh.cjs` mà kho bật luật thì chỉ in một dòng NOTE. (3) Tên lệnh, việc làm và chuyện có ghi tệp lộ trình hay không đều khớp README và năm tệp lệnh. (4) `lo_trinh.chan` mặc định tắt, và kho không khai thì lưới giữ nguyên.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên CẢ HEAD lẫn baseline — chúng chứng minh harness chứ không chứng minh tính năng; xác nhận là lưới hồi quy có chủ ý hoặc viết lại để assert hành vi mới):

- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': E1, E2, E3j, E6
- bash tests/scripts/run-tests.sh --manh bash: E3

Baseline khong do

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 30 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh f0634454 ap-chinh-sach-lo-trinh cham-lai-khong-tu-doi cua-tin-hieu-giua-chien-dich cua-tin-hieu-goc-moi-worktree kho-cam-ket-co-lo-trinh kho-moi-cai-goi-road-map lo-trinh-du-lieu-ngay-du-kien lo-trinh-gio-may: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show f0634454:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet f0634454 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only f0634454 HEAD -- dieu-phoi road-map | tr "\n" " "); echo "hai goi doi: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json dieu-phoi/scripts/cua-tin-hieu.mjs dieu-phoi/scripts/dieu-phoi.mjs dieu-phoi/scripts/mau/LUAT.md dieu-phoi/scripts/phat-lich.mjs dieu-phoi/scripts/yeu-cau.mjs road-map/.claude-plugin/plugin.json road-map/README.md road-map/commands/bo-ghim.md road-map/commands/ghim.md road-map/commands/gui.md road-map/commands/tra-lai.md road-map/commands/xem.md " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh f0634454 2.32.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E3d đỏ (suite workflows thoát khác 0, đuôi đầu ra không nêu tên ca đỏ); E3i BLOCKED (vùng 2 của suite plugins chạy 39 phút chưa xong, vượt ngân sách mặc định 30 phút, tiến trình pid 16650 và 16663 còn sống, chờ người hoặc điều phối quyết). Các eval còn lại xanh.
Round 2: toàn bộ eval xanh trên 6894a57e — E3i đã khai long_running 60 nên vùng 2 chạy xong trong ngân sách, E3d (workflows) xanh; không còn eval đỏ hay bị chặn.
