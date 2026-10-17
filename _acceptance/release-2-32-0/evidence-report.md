---
schema_version: 2
feature_slug: release-2-32-0
verdict: BLOCKED
failed_evals: ["E3d"]
reason: "Lenh bash -c set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 (eval E3i) chay qua 30 phut chua xong: ps cho thay run-tests.sh --manh vung:2 da chay 39 phut tinh den 12:14, chua co dong __EXIT=. Khong eval nao khai long_running cho lenh nay nen ngan sach mac dinh 30 phut da vuot. Khong co ma thoat de bao cao, khong doan PASS hay FAIL. Khong kill, khong chay lai, khong git checkout hay stash. Tien trinh van con song (pid 16650, 16663) va co the ghi tep tam; can nguoi hoac dieu phoi quyet cho tiep hay huy. Luu y: lenh goc ghi stdout vao tep tam mktemp va chi in duoi khi xong, nen khong xem duoc tien do."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2c2cded4caefe825c6d35836ee844d3b98ac1471
human_signoff:
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
| E3i | AC-3 | test | BLOCKED |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | FAIL |
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
  run_id: minted-release-2-32-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-32-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-32-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-32-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-32-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-32-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: 34 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-32-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-32-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-32-0-E3i-r1
  exit_code: (không có — lệnh chưa kết thúc, không có mã thoát để báo cáo)
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Lệnh vượt ngân sách mặc định 30 phút, không eval nào khai long_running cho nó; chưa có dòng __EXIT= trong bất kỳ đầu ra nào.
    ps: 16650 39:06 bash tests/plugins/run-tests.sh --manh vung:2 ; 16663 39:06 bash .../manh-vung-2.sh
    date: Sat Oct 17 12:14:20 +07 2026
    Tiến trình còn sống, không bị kill, không chạy lại. Cần người hoặc điều phối quyết cho chạy tiếp hay huỷ.

- eval: E3j
  run_id: minted-release-2-32-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-32-0-E3d-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-17T03:36:59Z
  output: |
    (đuôi đầu ra; phần đuôi chỉ hiện các ca xanh, không nêu tên ca đỏ — cần đọc trọn đầu ra để định vị)
    Results: 34 passed, 0 failed (triage-do-tin)
    Results: 15 passed, 0 failed (vung-vat-mutants)
    Results: workflow tests FAILED

- eval: E3e
  run_id: minted-release-2-32-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-17T03:36:59Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-32-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_cua_so
  verified_at: 2026-10-17T03:36:59Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-32-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_dd_giu
  verified_at: 2026-10-17T03:36:59Z
  output: |
    moc: 	"version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-32-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T03:36:59Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-32-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_goi_doi
  verified_at: 2026-10-17T03:36:59Z
  output: |
    hai goi doi: dieu-phoi/.claude-plugin/plugin.json dieu-phoi/scripts/cua-tin-hieu.mjs dieu-phoi/scripts/dieu-phoi.mjs dieu-phoi/scripts/mau/LUAT.md dieu-phoi/scripts/phat-lich.mjs dieu-phoi/scripts/yeu-cau.mjs road-map/.claude-plugin/plugin.

- eval: E8
  run_id: minted-release-2-32-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2320_lop_chep
  verified_at: 2026-10-17T03:36:59Z
  output: |
    XANH: đúng 6 tệp đổi như ghi chú 2.32.0 kể

- eval: E10
  run_id: minted-release-2-32-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-17T03:36:59Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.31.0 (f0634454) cài đúng tag

- eval: E9
  judged_by: hội đồng judge (fresh context), đề xuất PASS bởi ba lăng kính
  verdict: PASS
  rationale: Ba lăng kính (domain-correctness, operational-feasibility, spec-alignment) cùng đề xuất PASS; đây là đề xuất của máy, người quyết ở Cổng 2.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': E1, E2, E3j, E6 (xanh ở cả hai phía; chiều đỏ của chúng sống trong chính ca P200 chứ không ở việc lệnh đổi màu giữa baseline và HEAD)

Baseline khong do:
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 22 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
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

## Judge

Panel E9 (đề xuất, không có carried, không ungrounded; human_override để TRỐNG cho người):

- domain-correctness: PASS — Cả bốn vế khớp với vật. (1) Mục «crm, theo thứ tự» nói nhận SAU 2.31.0 và «Cài theo thẻ `v2.32.0`», kèm «Không cài từ `main` giữa hai thẻ». (2) Lời về hai tệp chép CI khớp: nhãn `[only-if-declared: lo_trinh]` trong INIT-CI-COPY-LIST, dòng 186 nói `lo-trinh.mjs` nạp `gio-may.mjs` lúc nạp (mã `import * as GM from './gio-may.mjs'`, dòng 32), dòng 187 nói thiếu `chan-lo-trinh.cjs` thì chỉ một dòng NOTE (mã `pre-merge-check.sh` 1798–1813). (3) Bốn lệnh `gui`, `ghim`, `bo-ghim`, `tra-lai` khớp README và năm tệp lệnh: ba lệnh có `disable-model-invocation`, `gui` và `xem` để mở, `xem` chạy `--xem` và chỉ đọc. (4) `lo_trinh.chan` vắng hoặc `false` là tắt và chỉ có hiệu lực khi `road-map` bật trong `.claude/settings.json`, khớp `trangThaiChan`; kho không khai thì bộ đọc in rỗng và thoát 0, khớp hợp đồng `kho-cam-ket-co-lo-trinh` (AC-5, AC-6, Ngoài-6).
- operational-feasibility: PASS — Cả bốn vế khớp với các tệp được phép đọc. (1) Mục «crm, theo thứ tự» ghi «nhận SAU 2.31.0» và «Cài theo thẻ v2.32.0», không cài từ main. (2) Danh sách chép trong acceptance-init.md gắn nhãn [only-if-declared: lo_trinh] cho lo-trinh.mjs, gio-may.mjs và chan-lo-trinh.cjs, còn pre-merge-check.sh và product-map.mjs không gắn nhãn. `lo-trinh.mjs` có dòng 32 `import * as GM from './gio-may.mjs'` nên thiếu tệp đó thì nạp lỗi. `pre-merge-check.sh` dòng 1798-1813 gọi lib, và khi thiếu lib ở kho bật luật thì in đúng một dòng NOTE chứ không vỡ. (3)(4) Bốn lệnh mới khớp tên, việc làm và tệp ghi trong README và các tệp `commands/*.md`; `lo_trinh.chan` vắng hoặc `false` thì `trangThaiChan` trả bat:false, lưới không in gì, khớp hợp đồng kho-cam-ket-co-lo-trinh.
- spec-alignment: PASS — Cả bốn vế khớp với tệp trong danh sách Input. (1) Mục «crm, theo thứ tự» ghi «nhận SAU 2.31.0» và «Cài theo thẻ `v2.32.0`». (2) Lời về lớp chép CI khớp nhãn INIT-CI-COPY-LIST: `lo-trinh.mjs` nạp `gio-may.mjs` bằng import tĩnh ở dòng 32, `pre-merge-check.sh` chỉ in đúng một dòng NOTE khi kho bật mà thiếu `lib/chan-lo-trinh.cjs`. (3) Bốn lệnh `gui`, `ghim`, `bo-ghim`, `tra-lai` khớp README và các tệp lệnh về tên, tác dụng, việc có ghi tệp lộ trình hay không và khoá model-invocation. (4) `lo_trinh.chan` mặc định tắt, chỉ bật khi `road-map` bật ở `.claude/settings.json`, kho không khai thì lưới không in gì; khớp mã `lib/chan-lo-trinh.cjs` và hợp đồng `kho-cam-ket-co-lo-trinh`.

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (mọi eval runs: 1, xác định)

## Iterations

Round 1: E3d đỏ (suite workflows thoát khác 0, đuôi đầu ra không nêu tên ca đỏ); E3i BLOCKED (vùng 2 của suite plugins chạy 39 phút chưa xong, vượt ngân sách mặc định 30 phút, tiến trình pid 16650 và 16663 còn sống, chờ người hoặc điều phối quyết). Các eval còn lại xanh.
