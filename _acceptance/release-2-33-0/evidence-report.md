---
schema_version: 2
feature_slug: release-2-33-0
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f847b91aaee744f78306926dd96df316ab539434
human_signoff:
---

# Evidence Report: release-2-33-0

Round 1. Mọi eval máy đều xanh; còn một mục judgment (E9) chưa người chốt nên verdict dừng ở PENDING-JUDGMENT.

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
| E9 | AC-9 | judgment | UNCERTAIN |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-33-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-33-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-33-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-33-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: 36 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-33-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: 36 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-33-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-33-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-33-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-33-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-33-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-33-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-33-0-E3k-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-18T12:28:53Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E3e
  run_id: minted-release-2-33-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-18T12:28:53Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-33-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_cua_so
  verified_at: 2026-10-18T12:28:53Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-33-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_dd_giu
  verified_at: 2026-10-18T12:28:53Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-33-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-18T12:28:53Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-33-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_goi_doi
  verified_at: 2026-10-18T12:28:53Z
  output: |
    hai goi doi: dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-33-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2330_lop_chep
  verified_at: 2026-10-18T12:28:53Z
  output: |
    XANH: đúng 7 tệp đổi như ghi chú 2.33.0 kể

- eval: E10
  run_id: minted-release-2-33-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-18T12:28:53Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.32.1 (5bd64bc9) cài đúng tag

### Hội đồng judgment

- eval: E9
  judged_by: judge-subagent (fresh context), ba lăng kính
  verdict: UNCERTAIN
  proposal: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Ba vế (1), (2), (3) khớp với các tệp trong danh sách input. Vế (0) thì hợp đồng ho-so-da-ky-giu-tuoi không nói `fetch-depth: 0` và không có «bảy việc crm chờ K-A», nên không đối chiếu được. Hợp đồng chỉ có AC-7 (lưới đọc dòng nền tại điểm tách với nhánh chính) và Out of scope (vòng dọn hồ sơ tồn đọng là việc của crm). Thiếu căn cứ cho vế (0) nên không thể PASS, và cũng không có câu sai rõ ràng để FAIL.
    - operational-feasibility: UNCERTAIN — Vế (1), (2) và (3) đúng: ghi chú dặn cắt lại bằng skill mới và nêu không có đường đọc riêng cho mốc ngoài cũ; bảy tệp chép CI khớp khối INIT-CI-COPY-LIST (có do-san-tren-nen.cjs, 7+22=29); năm khoá mô hình hiển thị khớp lo-trinh-du-lieu.md và AC-11 của road-map-de-dung. Vế (0) không kiểm được: hợp đồng ho-so-da-ky-giu-tuoi không nhắc `fetch-depth: 0` và không nhắc con số «bảy việc crm chờ K-A». Hợp đồng còn nói ngưỡng đo chỉ mở sau khi crm cài mốc VÀ bật khoá, trong khi CHANGELOG viết «mở được sau khi crm cài mốc này».
    - spec-alignment: UNCERTAIN — Ba vế (1), (2), (3) khớp với các tệp trong Input. Vế (0) không chứng được: hợp đồng ho-so-da-ky-giu-tuoi không nhắc `fetch-depth: 0` và không nhắc «bảy việc crm chờ K-A». Điểm tách của nhánh (AC-7) chỉ gợi ý được về `fetch-depth`, còn «bảy» thì không có nguồn nào trong các tệp được phép đọc.
  rationale: Ba lăng kính cùng UNCERTAIN ở một chỗ — vế (0) của AC-9 (yêu cầu CI `fetch-depth: 0` của kho tiêu thụ và con số bảy việc crm chờ K-A) không có căn cứ trong hợp đồng ho-so-da-ky-giu-tuoi. Các vế (1), (2), (3) khớp.
  required_evidence:
    - Bản thiết kế docs/superpowers/specs/2026-10-17-ho-so-da-ky-giu-tuoi-design.md hoặc sổ quyết định của hồ sơ ho-so-da-ky-giu-tuoi (nằm ngoài danh sách input của lượt này), nêu rõ (a) lưới đọc dòng nền ở điểm tách và clone nông thì không có điểm tách nên CI cần `fetch-depth: 0`, và (b) danh sách bảy việc crm đang gom chờ K-A. Khi hai ý đó khớp mục 2.33.0 thì vế (0) PASS.
    - Hoặc thêm vào _acceptance/ho-so-da-ky-giu-tuoi/contract.md (mục Context hay Notes) một dòng nêu yêu cầu `fetch-depth: 0` của CI kho tiêu thụ và con số bảy việc chờ K-A (có thể kèm cột gốc là kênh điều phối crm-onehub#375). Khi đó contract trong input tự đủ căn cứ cho vế (0).
    - Danh sách bảy việc crm gom chờ K-A: tin trên kênh điều phối crm-onehub#375 hoặc một mục trong `docs/superpowers/specs/2026-10-17-ho-so-da-ky-giu-tuoi-design.md` liệt đúng 7 việc. Có nó thì vế (0) kiểm được con số «bảy».
    - Một dòng trong `_acceptance/ho-so-da-ky-giu-tuoi/contract.md` (Notes hoặc Đường đo) hoặc trong design doc nói bảy việc ấy mở ngay sau khi cài mốc, không cần bật khoá `feature_loop.do_san_tren_nen`. Có nó thì lời «mở được sau khi crm cài mốc này» khớp; hiện hợp đồng ghi ngưỡng đọc «sau khi crm cài mốc và bật khoá».
    - Một dòng trong hợp đồng K-A hoặc design doc của nó nói lưới đọc dòng nền ở điểm tách với nhánh chính nên cần lịch sử đầy đủ (CI `fetch-depth: 0`). AC-7 chỉ nói «điểm tách», chưa nêu CI.
    - Tệp contract.md của ho-so-da-ky-giu-tuoi có thêm một dòng nói crm phải đặt CI `fetch-depth: 0` (hiện chỉ AC-7 nói đọc dòng nền tại điểm tách với nhánh chính, không gọi tên `fetch-depth`).
    - Một tệp trong Input (đề xuất: mục Notes hoặc Out of scope của ho-so-da-ky-giu-tuoi/contract.md) liệt kê bảy việc crm đang gom chờ K-A, để đếm được là bảy. Mục Out of scope hiện chỉ nói «Lịch đêm… vòng dọn hồ sơ tồn đọng — việc của crm», không liệt kê việc nào.
  human_override:        # người điền "<tên> <ngày>" + ghi chú tuỳ chọn để chốt

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline — chứng minh harness chứ chưa chứng minh feature; hoặc viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E1, E2, E3j, E6 (cùng một lệnh vùng 3 của suite plugins): xanh trên cả baseline lẫn HEAD. Theo lời eval, chiều đỏ của E1/E2/E6 sống trong các đột biến của chính ca P200, không nằm ở việc lệnh đỏ trên mã cũ; E3j là regression-guard cùng lệnh.
- E3 (mảnh bash của suite scripts): xanh trên cả hai phía — regression-guard.

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 38 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
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

none — every multi-run eval is uniform (mọi eval chạy một lượt, xác định; không eval nào có runs lớn hơn 1).

## Iterations

Round 1: mọi eval máy xanh; E9 (judgment) UNCERTAIN ở vế (0) vì hợp đồng ho-so-da-ky-giu-tuoi không nêu `fetch-depth: 0` và con số bảy việc crm chờ K-A. Verdict PENDING-JUDGMENT, chờ người chốt E9 ở Cổng Bằng chứng.
