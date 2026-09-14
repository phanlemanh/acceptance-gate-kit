---
schema_version: 2
feature_slug: release-2-13-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f55e143b66da578b072bbec94b009c9b4bfb3ee3
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
| E5b | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: 5e37943d
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_13
  verified_at: 2026-09-14T17:20:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 5e37943d)

- eval: E2
  run_id: minted-release-2-13-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_13
  verified_at: 2026-09-14T17:20:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 4dd25cc5)

- eval: E3a
  run_id: minted-release-2-13-0-E3a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-14T17:20:00Z
  output: |

    Results: 871 passed, 0 failed
    EXIT_CODE=0

- eval: E3b
  run_id: minted-release-2-13-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-14T17:20:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: d6a63be4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.plugins_so_ca_2_13
  verified_at: 2026-09-14T17:20:00Z
  output: |
    Results: all plugin tests passed
    PASS: suite plugins xanh va chay 266 ca (san 266, so mot phia — them ca khong lam do; rang ban d6a63be4)

- eval: E3d
  run_id: minted-release-2-13-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-14T17:20:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-13-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-09-14T17:20:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: release-2-13-0-E4-2026-09-14
  verifier: judge-subagent (fresh context) — 3-lens panel (domain-correctness, operational-feasibility, spec-alignment)
  verified_at: 2026-09-14T17:20:00Z
  human_override:
  output: |
    proposal: PASS
    - domain-correctness: PASS — Notes có đủ bốn khối, mỗi khối mang số thật kèm nguồn rút; khối 1 nêu rõ hai dòng máy đo lấy từ usage-report.md của vòng khoi-tim-loi-tra-phi-theo-vat, mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)", và khai rõ giới hạn cận dưới phồng của phép đếm lượt gọi người (15 so với 4). Đối chiếu nhãn-với-nguồn cho hai dòng máy đo: token 16.715.215 (tìm-lỗi 79,9%/chứng-minh-vật 15,6%/tổng hợp 4,6%) và phút 20,4 (machine 12,9) khớp từng chữ số với bảng trong usage-report.md (16,715,215; 79.9%; 15.6%; 4.6%; 20.4; 12.9), chỉ khác ký hiệu thập phân theo vùng miền.
    - operational-feasibility: PASS — Notes có đủ bốn khối, mỗi khối mang số thật kèm nguồn rút: khối 1 (bảng 5 dòng, mỗi ô có cột Nguồn rút), khối 2 (sha 7e260d4b + lệnh git diff --stat, giải thích rõ vì sao rỗng), khối 3 (ba lớp lỗi tái phát, mỗi lớp có dẫn chứng cụ thể), khối 4 (7 mục nhát cắt kế cho 2.14, xếp theo phụ thuộc). Khối 1 nói rõ hai dòng máy đo lấy từ usage-report.md của vòng khoi-tim-loi-tra-phi-theo-vat, mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)", và khai đúng giới hạn cận dưới phồng của phép đếm lượt gọi người (15 so với 4). Đối chiếu nhãn-với-nguồn cho hai dòng máy đo: dòng 4 (16.715.215 tổng · 79,9%/15,6%/4,6%) và dòng 5 (20,4 phút · đường găng machine 12,9 phút) khớp từng chữ số với usage-report.md (16,715,215; 79.9%/15.6%/4.6%; 20.4 phút; machine 12.9 phút, gọi rõ là đường găng) — chỉ khác cách gõ dấu chấm/phẩy phân cách nghìn-thập phân theo locale, không lệch chữ số nào.
    - spec-alignment: PASS — Notes có đủ 4 khối (năm dòng số · lớp vendored · lớp lỗi tái phát · nhát cắt kế), mỗi ô số đều ghi nguồn rút, khối 1 nói rõ hai dòng máy đo lấy từ usage-report.md mục "Lượt chấm 5 — lượt PASS (run wf_211fd30c-0ec)" và khai rõ giới hạn cận dưới phồng (15 so với 4 đếm tay). Đối chiếu nhãn-với-nguồn cho hai dòng máy đo: token 16.715.215 (79,9%/15,6%/4,6%) và phút 20,4 (đường găng machine 12,9) khớp từng chữ số với usage-report.md — không có sai lệch nào.

- eval: E5a
  run_id: minted-release-2-13-0-E5a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p93_theo_git_im
  verified_at: 2026-09-14T17:20:00Z
  output: |
    P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
      PASS: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    PASS: P93 IM truoc fixture KHONG theo doi trong ban sao mang vat (doi chung duong: ban sao chua tiem XANH; fixture rut tu nguon; vat ed5478e8; rang ban 96f9479e)

- eval: E5b
  run_id: minted-release-2-13-0-E5b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p93_theo_git_do
  verified_at: 2026-09-14T17:20:00Z
  output: |
    P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
      FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    PASS: P93 DO dung thong diep khi fixture vao index, cung ban sao va cung vat voi chan im (doi chung duong: ban sao chua tiem XANH; vat ed5478e8; rang ban 96f9479e)

### Lệnh suite (hồi quy)

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-release-2-13-0-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-14T17:20:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round truoc — baseline khong do lai round nay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5b failed — `rang-p93.sh --chan do` thoát mã 1 thay vì exit 0 kỳ vọng; dòng in ra là "FAIL: P93 mot-nguon..." thay vì dòng "PASS: P93 DO dung thong diep..." mà AC-5/E5b đòi. Đây là lệnh thất bại duy nhất của vòng này và đã gắn đúng vào eval E5b (không có lệnh fail nào đứng ngoài ánh xạ eval). Trả về S3 để sửa lại chỗ tiêm/thông điệp của chân `--chan do` trong `rang-p93.sh` hoặc trong `tests/plugins/run-tests.sh` mà nó bọc.
Round 2: Tất cả eval PASS (E1, E2, E3a–E3e, E4, E5a, E5b). Nhát vá f55e143b đổi kênh in dòng chẩn đoán của `rang-p93.sh` (chân `--chan do`) sang stderr — mã thoát của E5b nay đúng 0 và dòng kết luận đúng thông điệp AC-5 đòi; E5a/P200/mốc diagram/bốn suite hồi quy/product-map đều giữ nguyên PASS. Không có lệnh fail nào đứng ngoài ánh xạ eval.
