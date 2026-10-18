---
schema_version: 2
feature_slug: release-2-33-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 398f924dfba9b1bbac08907df08d719cdb47f5a3
human_signoff: Manh Phan 2026-10-18
---

# Evidence Report: release-2-33-0

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
| E3k | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-33-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-33-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-33-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-33-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-18T13:35:01Z
  output: |
    (lệnh thoát sạch; phần đuôi đã ghi không có dòng tóm tắt Results)

- eval: E3g
  run_id: minted-release-2-33-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: 36 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-33-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-33-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-33-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-33-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-33-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-33-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-33-0-E3k-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-18T13:35:01Z
  output: |
    (lệnh thoát sạch; phần đuôi đã ghi không có dòng tóm tắt DP1 hay dòng pass/fail để trích)

- eval: E3e
  run_id: minted-release-2-33-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-18T13:35:01Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-33-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_cua_so
  verified_at: 2026-10-18T13:35:01Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-33-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_dd_giu
  verified_at: 2026-10-18T13:35:01Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-33-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T13:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-33-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_goi_doi
  verified_at: 2026-10-18T13:35:01Z
  output: |
    hai goi doi: dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-33-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_lop_chep
  verified_at: 2026-10-18T13:35:01Z
  output: |
    XANH: đúng 7 tệp đổi như ghi chú 2.33.0 kể

- eval: E10
  run_id: minted-release-2-33-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-18T13:35:01Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.32.1 (5bd64bc9) cài đúng tag

### Judge (E9, AC-9)

Hội đồng đề xuất: PASS (ba thấu kính cùng PASS). Ô `human_override` để TRỐNG cho người điền ở Cổng Bằng chứng.

- eval: E9
  judged_by: judge-panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Ba thấu kính đều PASS; lệch con số «năm cờ» (CHANGELOG) và «sáu cờ» (AC-8/AC-10 của hợp đồng road-map-de-dung) được hai thấu kính ghi nhận là không đối chiếu được với mã vì `scripts/lo-trinh.mjs` ngoài Input.
  votes:
    - domain-correctness: PASS — Bốn vế đều khớp nguồn. (0) Mục 2.33.0 nói CI `fetch-depth: 0` khi bật khoá, đúng dòng sổ S4-r1 (d-25) và hàm tìm điểm tách với nhánh chính bằng merge-base trong `lib/do-san-tren-nen.cjs`. Nó nói bảy mục crm chờ K-A, đúng danh sách bảy mục trong opportunity.md, và ngưỡng 14 ngày sau khi cài mốc và bật khoá, đúng contract.md của K-A. (1) Mục dặn cắt lại bằng skill cắt lượt mới, nói lộ trình cũ hiện cờ vàng có tên và không có đường đọc riêng cho mốc ngoài cũ. (2) Bảy tệp đều có trong khối INIT-CI-COPY-LIST, trong đó `lib/do-san-tren-nen.cjs` là tệp mới. Khối ấy có 29 mục nên 29 − 7 = 22, khớp «hai mươi hai tệp còn lại». (3) Năm khoá `ten_hien_thi`, `moc[].hien`/`viec_hien`/`con_lai`, `chua_hen_moc` khớp mục «Mô hình hiển thị chung» của lo-trinh-du-lieu.md và AC-11 của hợp đồng road-map-de-dung. Mục 2.33.0 nói «năm cờ có tên» còn AC-8 và AC-10 của hợp đồng nói «sáu cờ». Tôi chỉ thấy lệch con số này, không đối chiếu được với mã vì `scripts/lo-trinh.mjs` ngoài Input, và AC-9 không hỏi về nó.
    - operational-feasibility: PASS — Bốn vế đều khớp với tệp trong danh sách input. (0) Mục K-A nói đúng ba điều: `fetch-depth: 0` khi bật khoá khớp dòng S4-r1 d-…-25 trong sổ và hàm `diemTachNhanhChinh` (merge-base) trong `lib/do-san-tren-nen.cjs`; bảy mục crm đứng chờ K-A khớp `opportunity.md`; ngưỡng 14 ngày sau khi cài mốc và bật khoá khớp contract K-A. (1) Có dặn cắt lại bằng skill cắt lượt mới, có nói cờ vàng có tên và không có đường đọc riêng cho mốc ngoài cũ. (2) Bảy tệp đều có trong khối INIT-CI-COPY-LIST (29 mục; 29−7 = 22 khớp «hai mươi hai tệp còn lại»), và `lib/do-san-tren-nen.cjs` là mục mới. (3) Năm khoá `hang[].ten_hien_thi`, `moc[].hien`, `moc[].viec_hien`, `moc[].con_lai`, `chua_hen_moc` khớp `lo-trinh-du-lieu.md` và hợp đồng road-map-de-dung (dòng 42, 80–81).
    - spec-alignment: PASS — Cả bốn vế khớp. (0) CHANGELOG nói `fetch-depth: 0` khi bật khoá, bảy mục crm chờ K-A và ngưỡng 14 ngày sau khi cài mốc và bật khoá. Ba điều này khớp dòng S4-r1 của sổ K-A (d-25), `opportunity.md`, `contract.md` và hàm `diemTachNhanhChinh` (dùng merge-base) trong `lib/do-san-tren-nen.cjs`. (1) Ghi chú dặn crm cắt lại bằng skill cắt lượt mới, nói lộ trình cũ hiện cờ vàng có tên và không có đường đọc riêng cho mốc ngoài cũ. (2) Bảy tệp khớp các mục trong INIT-CI-COPY-LIST, trong đó `lib/do-san-tren-nen.cjs` là mục mới. Khối có 29 mục, trừ 7 còn 22 nên "hai mươi hai tệp còn lại" đúng. (3) Năm khoá mô hình hiển thị khớp `lo-trinh-du-lieu.md` (các dòng 61, 86, 112–114, 158–167, 232) và AC-11 cùng dòng 80–81 của hợp đồng `road-map-de-dung`. Một điểm không ảnh hưởng phán quyết: tên cờ `dung-tren-moc` trong CHANGELOG và "sáu cờ" ở AC-8 hợp đồng RD1 không đối chiếu được trong các input này.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline — chứng minh harness chứ chưa chứng minh tính năng; chiều đỏ của chúng sống trong ca P200 và các ca của suite, nên đây là regression-guard có chủ ý hơn là eval cần viết lại):

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`: E1, E2, E3j, E6
- `bash tests/scripts/run-tests.sh --manh bash`: E3

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 48 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 5bd64bc9 road-map-de-dung ho-so-da-ky-giu-tuoi: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 5bd64bc9:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 5bd64bc9 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 5bd64bc9 HEAD -- dieu-phoi road-map | tr "\n" " "); echo "hai goi doi: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 5bd64bc9 2.33.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lượt, xác định; không eval nào có pass_rate lẫn).

## Iterations

Round 1: lượt chấm đầu ra PENDING-JUDGMENT — hội đồng chưa chốt được E9; ghi chú K-A trong mục 2.33.0 được chỉnh đúng chữ nguồn, E9 được đọc thêm căn cứ K-A; ghi 1 hàng sổ known-limits.
Round 2: toàn bộ eval máy xanh, hội đồng E9 ba thấu kính cùng PASS; 2 mục ngoài hợp đồng mang từ round 1 (hình dạng danh sách mong đợi viết tay ở E4 và E7) được giữ nguyên, không chấm lại.
