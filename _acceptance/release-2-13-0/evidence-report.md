---
schema_version: 2
feature_slug: release-2-13-0
verdict: REJECT
failed_evals: [E5b]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2e06537b12d5344818d186aa71c0391d7b642655
human_signoff:
---

# Evidence Report: release-2-13-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3a | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | script | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E5a | AC-5 | script | PASS |
| E5b | AC-5 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-release-2-13-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so_2_13
  verified_at: 2026-09-14T16:12:40Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 5e37943d)

- eval: E2
  run_id: minted-release-2-13-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.moc_diagram_2_13
  verified_at: 2026-09-14T16:12:40Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 4dd25cc5)

- eval: E3a
  run_id: minted-release-2-13-0-E3a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-14T16:12:40Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 871 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-13-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-14T16:12:40Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: d6a63be4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.plugins_so_ca_2_13
  verified_at: 2026-09-14T16:12:40Z
  output: |
    Results: all plugin tests passed
    PASS: suite plugins xanh va chay 266 ca (san 266, so mot phia — them ca khong lam do; rang ban d6a63be4)

- eval: E3d
  run_id: minted-release-2-13-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-14T16:12:40Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-13-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-14T16:12:40Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: release-2-13-0-E4-2026-09-14
  verifier: judge-subagent (fresh context) — 3-lens panel (domain-correctness, operational-feasibility, spec-alignment)
  verified_at: 2026-09-14T16:12:40Z
  human_override:
  output: |
    proposal: PASS
    - domain-correctness: PASS — Bốn khối Notes (năm dòng số, lớp vendored, lớp lỗi tái phát, nhát cắt kế) đều có mặt với số thật và nguồn rút, không tiêu đề suông; khối 1 nói rõ hai dòng máy đo lấy từ usage-report.md mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)" và có khai rõ giới hạn "cận dưới phồng" của phép đếm lượt gọi người (15 so với 4). Đối chiếu nhãn-với-nguồn cho hai dòng máy đo khớp từng chữ số: dòng 4 token 16.715.215 (tìm-lỗi 79,9% · chứng-minh-vật 15,6% · tổng hợp 4,6%) khớp đúng bảng token trong usage-report.md (13.347.514/2.600.237/767.464 tương ứng 79.9%/15.6%/4.6%, tổng 16.715.215); dòng 5 phút 20,4 phút và đường găng làn machine 12,9 phút khớp đúng "20.4 phút · 20 tác tử" và hàng machine "12.9" phút trong usage-report.md.
    - operational-feasibility: PASS — Bốn khối trong ## Notes đều có mặt với số thật và nguồn rút (khối 1: bảng 5 dòng + đoạn "cận dưới PHỒNG" 15 vs 4; khối 2: sha 7e260d4b + kết quả git diff rỗng, có lý do cho việc để ngắn; khối 3: ba lớp lỗi có dẫn chứng; khối 4: 7 mục nhát cắt xếp theo phụ thuộc). Khối 1 nói rõ hai dòng máy đo lấy từ usage-report.md mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)", và đối chiếu nhãn-với-nguồn cho thấy khớp từng chữ số: tổng token 16.715.215 (=16,715,215), ba phần 79,9%/15,6%/4,6% (=79.9%/15.6%/4.6% dù thứ tự liệt kê đảo), phút 20,4 và đường găng machine 12,9 (=20.4 và 12.9) đều trùng usage-report.md.
    - spec-alignment: PASS — ## Notes có đủ bốn khối, mỗi khối mang số thật kèm nguồn rút: (1) bảng năm dòng số ghi rõ hai dòng máy đo lấy từ usage-report.md của vòng "khoi-tim-loi-tra-phi-theo-vat", mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)", và khai rõ giới hạn cận dưới phồng của phép đếm lượt gọi người (15 so với 4 đếm tay); (2) lớp vendored có diff-stat range cụ thể; (3) lớp lỗi tái phát gọi tên ba lớp kèm dẫn chứng; (4) bảy nhát cắt kế cho 2.14 theo thứ tự phụ thuộc. Đối chiếu nhãn-với-nguồn hai dòng máy đo: token 16.715.215 (tìm-lỗi 79,9%/chứng-minh-vật 15,6%/tổng hợp 4,6%) và phút 20,4 (đường găng machine 12,9) trong hợp đồng khớp từng chữ số với usage-report.md (16,715,215 tổng; 13,347,514=79.9%; 2,600,237=15.6%; 767,464=4.6%; 20.4 phút; machine 12.9 phút) — chỉ khác quy ước dấu phân cách hàng nghìn/thập phân giữa hai định dạng số, không lệch chữ số.

- eval: E5a
  run_id: minted-release-2-13-0-E5a-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.p93_theo_git_im
  verified_at: 2026-09-14T16:12:40Z
  output: |
    P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
      PASS: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    PASS: P93 IM truoc fixture KHONG theo doi trong ban sao mang vat (doi chung duong: ban sao chua tiem XANH; fixture rut tu nguon; vat 2db64eab; rang ban 40c9691a)

- eval: E5b
  run_id: minted-release-2-13-0-E5b-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.script.p93_theo_git_do
  verified_at: 2026-09-14T16:12:40Z
  output: |
    P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
      FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    PASS: P93 DO dung thong diep khi fixture vao index, cung ban sao va cung vat voi chan im (doi chung duong: ban sao chua tiem XANH; vat 2db64eab; rang ban 40c9691a)

### Lệnh suite (hồi quy)

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-release-2-13-0-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-14T16:12:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

E1, E2, E3a, E3b, E3c, E3d, E3e — không phân biệt (pass trên CẢ HEAD lẫn baseline diffBase). Bảy eval này đo hành vi mà mốc release-2-13-0 KHÔNG chạm (P200 số dòng, mốc diagram-design, và bốn suite hồi quy scripts/hooks/workflows/product-map) — chúng đứng làm regression-guard có chủ ý cho phần lõi không đổi trong vòng này, không phải bằng chứng cho riêng nhát vá P93 của vòng. Chỉ hai eval chạm đúng thay đổi của vòng (E5a, E5b, ref P93 --chan im/--chan do) mới đỏ trên baseline — tức có phân biệt.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5b failed — `rang-p93.sh --chan do` thoát mã 1 thay vì exit 0 kỳ vọng; dòng in ra là "FAIL: P93 mot-nguon..." thay vì dòng "PASS: P93 DO dung thong diep..." mà AC-5/E5b đòi. Đây là lệnh thất bại duy nhất của vòng này và đã gắn đúng vào eval E5b (không có lệnh fail nào đứng ngoài ánh xạ eval). Trả về S3 để sửa lại chỗ tiêm/thông điệp của chân `--chan do` trong `rang-p93.sh` hoặc trong `tests/plugins/run-tests.sh` mà nó bọc.
