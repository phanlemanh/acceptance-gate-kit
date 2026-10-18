---
schema_version: 2
feature_slug: release-2-32-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9bfe26c8f032e5c40bb5f81e3b194fab7ce90caa
human_signoff: Manh Phan 2026-10-18
---

# Evidence Report: release-2-32-1

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
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-32-1-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-32-1-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-32-1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: bjg4o4ezt
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-32-1-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-32-1-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: 35 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-32-1-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-32-1-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-32-1-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-32-1-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-32-1-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-32-1-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-17T16:36:23Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-32-1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2321_cua_so
  verified_at: 2026-10-17T16:36:23Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-32-1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2321_dd_giu
  verified_at: 2026-10-17T16:36:23Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-32-1-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-17T16:36:23Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-32-1-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2321_goi_doi
  verified_at: 2026-10-17T16:36:23Z
  output: |
    hai goi doi: dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-32-1-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2321_lop_chep
  verified_at: 2026-10-17T16:36:23Z
  output: |
    XANH: đúng 2 tệp đổi như ghi chú 2.32.1 kể

- eval: E10
  run_id: minted-release-2-32-1-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-17T16:36:23Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.32.0 (f7d95695) cài đúng tag

### Judgment (E9)

Panel do máy đề xuất; ô `human_override` để trống cho người điền ở Cổng Bằng chứng.

- eval: E9
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba hội đồng (domain-correctness, operational-feasibility, spec-alignment) cùng chấm PASS cho cả ba vế, xem phiếu từng thẩm phán ngay dưới.
  human_override:  # chi nguoi ghi

#### Phiếu từng thẩm phán (E9)

- domain-correctness: PASS — Cả ba vế đều khớp. (1) Mục «crm, theo thứ tự» của CHANGELOG 2.32.1 nói nhận 2.32.1 thay cho 2.32.0, sau chuỗi đêm M5 (~03:00Z 18/10), và cài theo ĐÚNG thẻ `v2.32.1`. (2) Trong khối INIT-CI-COPY-LIST, `scripts/product-map.mjs` không có nhãn nên luôn cần; `scripts/tin-hieu.mjs` mang `[only-if-declared: tin_hieu]`; danh sách có 28 mục nên «hai mươi sáu tệp còn lại» đúng. (3) `docTinHieu` mặc định `chiTheoDoi=false` nên đọc `gocNguon` (thư mục chính). `product-map.mjs` gọi `duongDi` với `chiTheoDoi: true`, nên chỉ lấy tệp `git ls-files` trong chính cây đang vẽ. `--chua-gom` giữ mặc định. Hợp đồng VA2 (AC-3, Ngoài-3) cũng nói ý chưa commit xem ở thẻ khởi động và các lệnh gom, không ở `/road-map:xem`. Tôi không đọc `start-scan.mjs` vì nó ngoài danh sách Input. Phần «thẻ khởi động đọc thư mục chính» dựa vào hợp đồng VA2 (AC-3 nêu `start-scan.mjs`) và vào ghi chú CHANGELOG, không dựa vào mã của chính nó.
- operational-feasibility: PASS — Cả ba vế đúng. (1) Mục «crm, theo thứ tự» nói nhận 2.32.1 thay cho 2.32.0, sau chuỗi đêm M5 (~03:00Z 18/10), và cài theo đúng thẻ `v2.32.1`. (2) Lớp chép CI khớp INIT-CI-COPY-LIST: `product-map.mjs` không có nhãn nên luôn cần, `tin-hieu.mjs` mang `[only-if-declared: tin_hieu]`, và danh sách có 28 mục (2 + 26). (3) Hành vi mới khớp mã và hợp đồng: `product-map.mjs:382` gọi `duongDi` với `chiTheoDoi: true`, `docTinHieu` lọc bằng `git ls-files` trong cây đang vẽ, còn mặc định `chiTheoDoi = false` thì đọc thư mục chính qua `gocNguon`. Hợp đồng VA2 ghi cùng điều đó ở AC-2 và AC-3, và Ngoài-3 nói rõ `/road-map:xem` không hiện tín hiệu.
- spec-alignment: PASS — Cả ba vế đều khớp. (1) Mục «crm, theo thứ tự» ghi nhận 2.32.1 THAY CHO 2.32.0, sau chuỗi đêm M5 (~03:00Z 18/10), cài theo thẻ `v2.32.1`. (2) Trong khối INIT-CI-COPY-LIST, `product-map.mjs` không có nhãn `only-if-declared` (luôn cần), còn `tin-hieu.mjs` mang `[only-if-declared: tin_hieu]`; danh sách có 28 mục nên «hai tệp đổi, 26 tệp còn lại» đúng. (3) `docTinHieu` mặc định `chiTheoDoi=false` nên đọc thư mục chính; `veTrangLoTrinh` gọi `duongDi` với `chiTheoDoi:true`, lọc `git ls-files` trong chính cây đang vẽ và đọc nội dung từ đĩa. Hợp đồng VA2 nêu cùng điều đó: AC-3, Out of scope, Ngoài-3 (ý chưa commit hiện ở thẻ khởi động và các lệnh gom, không hiện ở `/road-map:xem`) và Notes (bước khởi tạo lộ trình đi qua `veTrangLoTrinh`).

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (pass trên CẢ HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` — các eval E1, E2, E3j, E6. Lệnh này xanh trên cả code cũ lẫn HEAD. Chiều đỏ của AC-1, AC-2, AC-6 sống trong các đột biến của chính ca P200 (kèm đối chứng dương trên bản sao nguyên vẹn), nên lệnh vùng 3 ở đây là đường chạy ca đó chứ không tự phân biệt trước/sau.

Ghi chú: giờ trong `verified_at` chỉ mang ngày chạy (2026-10-18); giờ cụ thể không được truyền xuống bước soạn báo cáo.

Baseline không đo:

- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 2 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh f7d95695 ve-lo-trinh-doc-tin-hieu-cua-cay: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show f7d95695:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet f7d95695 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only f7d95695 HEAD -- dieu-phoi road-map | tr "\n" " "); echo "hai goi doi: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh f7d95695 2.32.1: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy đều xanh, E9 do hội đồng chấm PASS; chưa có vòng nào bị trả lại.
