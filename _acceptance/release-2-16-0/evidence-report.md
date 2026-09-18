---
schema_version: 2
feature_slug: release-2-16-0
verdict: REJECT
failed_evals: [E1b, E5]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c7cd7e2a4abc9fbe8b447fd6e8e5e663cae75997
human_signoff:
---

# Evidence Report: release-2-16-0 (round 1)

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | FAIL |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | FAIL |
| E8 | AC-8 | script | PASS |
| E6a | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6c | AC-6 | test | PASS |
| E6d | AC-6 | test | PASS |
| E6e | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PASS |

## Evidence

- eval: E1
  criterion: AC-1
  run_id: minted-release-2-16-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban d9269477)

- eval: E1b
  criterion: AC-1
  run_id: minted-release-2-16-0-E1b-r1
  exit_code: 3
  baseline: n-a
  verifier: config:executors.script.so_tang_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (26bf12fe) = 2.16.0 · so trong cay lam viec = 2.16.0
    DO: so (2.16.0) BANG so tai neo — buoc nang so cua moc nay CHUA CHAY

- eval: E2
  criterion: AC-2
  run_id: minted-release-2-16-0-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban dc7abe93)

- eval: E3
  criterion: AC-3
  run_id: minted-release-2-16-0-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_vendored_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    PASS: vendored 9 tep chep CI + chinh tep mang khoi chep (danh sach BANG danh sach tai neo) KHONG doi ke tu lan cat so 2.15.0 (89fbc87b) toi cay lam viec (doi chung: cua so tren toan kho co 94 tep doi)

- eval: E4
  criterion: AC-4
  run_id: minted-release-2-16-0-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_viec_meta_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    PASS: viec-meta 1 ho so vong sinh sau lan cat so 2.15.0 (89fbc87b) BANG khoi khai [thuoc-co-cua] · the mo phien tren cay that: vong meta dang mo n=0 [rong]

- eval: E5
  criterion: AC-5
  run_id: repin-20260918T025435Z-51649
  exit_code: 1
  baseline: red
  verifier: config:executors.script.chien_dich_ghim_lai_2_16
  verified_at: 2026-09-18T02:54:35Z
  output: |
    PASS: chien-dich lan repin-20260918T025435Z-51649 exit 1 tai sha 26bf12fe — 0 ho so da ky mang dong ghim lai moi nhat cua luot BANG khoi khai [rong] (doi chung: 72 ho so da ky, 48 ho so co dong ghim lai)

- eval: E8
  criterion: AC-8
  run_id: minted-release-2-16-0-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_viec_va_2_16
  verified_at: 2026-09-18T03:15:00Z
  output: |
    PASS: viec-va 0 tep engine doi sau chu ky b9f8766e ngoai 2 tep cua chinh moc (doi chung: cua so 89fbc87b..b9f8766e co 30 tep engine; cua so sau chu ky co 21 tep doi)

- eval: E6a
  criterion: AC-6
  run_id: minted-release-2-16-0-E6a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-18T03:15:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 885 passed, 0 failed

- eval: E6b
  criterion: AC-6
  run_id: minted-release-2-16-0-E6b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-18T03:15:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E6c
  criterion: AC-6
  run_id: minted-release-2-16-0-E6c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-18T03:15:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E6d
  criterion: AC-6
  run_id: minted-release-2-16-0-E6d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-18T03:15:00Z
  output: |
    Results: all workflow tests passed
    EXIT_CODE=0

- eval: E6e
  criterion: AC-6
  run_id: minted-release-2-16-0-E6e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T03:15:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E7
  criterion: AC-7
  judged_by: 3-judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Khối ## Notes của _acceptance/release-2-16-0/contract.md có đủ năm mục (năm dòng số, lớp vendored, lớp lỗi tái phát, chiến dịch ghim lại, nhát cắt kế), bảng năm dòng đúng hai cột với nguồn rút hoặc "không đo được" kèm lý do ở mọi ô, và dòng 2 tách trong/ngoài thiết kế có gọi tên lý do. Tôi tính lại độc lập cả bốn phép đối chiếu bắt buộc từ usage-report.md (dòng 4: 1,53/23,25/21,96/5,09/2,97 M, S4 gộp 30,02 M, vòng gộp 54,80 M; dòng 4b: 22,5/75,6/1,9 · 28,1/65,6/6,3 · 50,5/41,6/7,9, gộp 25,7/71,2/3,1%, tìm-lỗi tuyệt đối 18,49 M) và khớp từng chữ số; giờ tác giả các commit được gọi tên (53aa1f08, b9f8766e, 57b6eda1, f49709ef, c30cf544, 618b66ab, e3563671, 4fff1f18, b4fbec9b, 26bf12fe) khớp đúng với dòng 1–2; phép đối chiếu (iv) so 71,2% với 9,5% của R1 ở hợp đồng 2.15.0 kèm giải thích vì sao không so thẳng được cũng có mặt và đúng số nguồn. Cả bảy điều bất lợi đều được nói thẳng (rải ở §1 và §4), mục 5 gọi tên nhiều chỗ cắt và định đoạt router theo Q3 17/09, và mục 4 nói đúng ba số 14/72, 60 eval đỏ, 0 hồ sơ được ghim.
    - operational-feasibility: PASS — Đủ năm khối Notes (năm dòng số · lớp vendored · lớp lỗi tái phát · chiến dịch ghim lại · nhát cắt kế), bảng năm dòng đủ hai cột với nguồn rút/«không đo được» kèm lý do ở mọi ô, dòng 2 tách rõ trong/ngoài thiết kế và gọi tên lý do (phát hiện CRLF). Tự tính lại độc lập từ usage-report.md cho cả bốn phép đối chiếu: (i) 1,53/23,25/21,96/5,09/2,97 M và gộp 30,02 M/54,80 M khớp chính xác (cộng out+in+cache_read+cache_create theo nền per-model); (ii) ba tỉ lệ từng lượt 22,5/75,6/1,9 · 28,1/65,6/6,3 · 50,5/41,6/7,9 và gộp 25,7/71,2/3,1% cùng số tuyệt đối tìm-lỗi 18,49 M khớp chính xác đến chữ số thập phân (nền bảng vai trò, không cache_create, refute+review = tìm-lỗi, machine+judge+baseline = chứng-minh-vật); (iii) dòng 1–2 nội bộ nhất quán về số học giờ (20:29→23:05=2h36, 21:37→23:05=1h28) — không thể đối chiếu git log vì ngoài phạm vi input được cấp, nhưng không có mâu thuẫn nội tại; (iv) 71,2% so 9,5% của R1 và câu giải thích (làn ui phình mẫu số ở R1, so tuyệt đối 18,49 M với 8,30 M) khớp đúng nguồn 2.15.0. Đủ bảy điều bất lợi được nói thẳng, mục 5 gọi tên nhiều chỗ cắt và định đoạt router, mục 4 nói đúng ba số 14/72 · 60 eval đỏ · 0 hồ sơ được ghim.
    - spec-alignment: PASS — Đủ năm khối Notes, bảng năm dòng đủ hai cột (vòng meta thuoc-co-cua · ba việc vá-trong-mốc) với nguồn rút cho từng dòng, và dòng 2 tách trong/ngoài thiết kế kèm tên lớp (lớp một ở mục 3). Tôi tính lại độc lập cả bốn phép đối chiếu liệt kê đóng: (i) tổng out+in+cache_read+cache_create theo usage-report.md khớp đúng từng số 1,53/23,25/21,96/5,09/2,97 M và hai số gộp 30,02 M / 54,80 M; (ii) tổng theo bảng vai trò (không cache_create, refute+review=tìm-lỗi, machine+judge+baseline=chứng-minh-vật) khớp đúng ba bộ tỉ lệ từng lượt và tỉ lệ gộp 25,7/71,2/3,1 % cùng số tuyệt đối 18,49 M; (iii) git show xác nhận đúng giờ tác giả của mọi commit được gọi tên ở dòng 1 và dòng 2 (53aa1f08 20:29:58 → b9f8766e 23:05:53 = 2h36; 57b6eda1 21:37:46 → b9f8766e = 1h28; bốn cổng trong thiết kế đúng giờ); (iv) số 9,5 % đúng là số R1 ở Notes §1 hợp đồng 2.15.0 và câu giải thích mẫu số (làn ui phình ở R1) khớp văn bản gốc. Bảy điều bất lợi đều được nói thẳng (không bị che), mục 4 đúng ba số 14/72 · 60 eval đỏ · 0 hồ sơ ghim, và mục 5 vừa gọi tên chỗ cắt chính (răng đo đại lượng di động) vừa định đoạt router (giữ nguyên, owner đã chốt).
  rationale: Đồng thuận PASS cả ba lens trên phần vượt-nhận-thức của E7 — khối ## Notes của contract.md có đủ năm mục, bảng năm dòng đủ hai cột có nguồn cho mọi ô, dòng 2 tách trong/ngoài thiết kế kèm lý do, bốn phép đối chiếu bắt buộc được cả ba lens tính lại độc lập và khớp từng chữ số, bảy điều bất lợi được nói thẳng không che, và mục 5 gọi tên chỗ cắt kèm định đoạt router.

## Known limits

## Ngoài hợp đồng

## Analyst

E6a, E6b, E6c, E6d, E6e — pass trên cả HEAD lẫn baseline diffBase (bash tests/scripts/run-tests.sh · bash tests/hooks/run-tests.sh · bash tests/plugins/run-tests.sh lọc FAIL/Results · bash tests/workflows/run-tests.sh · node scripts/product-map.mjs --root . --check). Cả năm là regression-guard chạy mỗi vòng, không đặc thù cho riêng feature release-2-16-0 — không phân biệt được cây có/không có thay đổi của mốc này. Xác nhận đây là bốn suite hồi quy + một script kiểm nhất quán có chủ ý, không phải lỗ hổng của bộ eval; không cần viết lại.

## Variance

none — không có eval nào chạy nhiều lần (runs>1) trong round này.

## Iterations

Round 1: E1b, E5 failed — E1b: răng so-tăng neo vào chính commit đưa hồ sơ mốc + nâng số 2.16.0 vào kho cùng lúc (26bf12fe), nên số tại neo bằng số ở cây, mã thoát khác 0; E5: chiến dịch ghim lại (repin-20260918T025435Z-51649) dừng tại sha 26bf12fe, 0/72 hồ sơ mang dòng ghim lại mới nhất của lượt. Trả về S3.
