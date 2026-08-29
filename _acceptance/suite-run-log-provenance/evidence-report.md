---
schema_version: 2
feature_slug: suite-run-log-provenance
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 60f9d6cd4be9928ba7477f093c329e5a3ad30757
human_signoff: Manh Phan 2026-08-29
---

# Evidence Report: suite-run-log-provenance

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-2 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-suite-run-log-provenance-E1-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_suite_case
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: suite-case: W03 suite: dong mang exit + cmd that
    PASS: suite-case: W03 synthesize cung nhan id cua lenh suite (log va report phai khop)
    Results: chan suite-case passed

- eval: E2
  run_id: minted-suite-run-log-provenance-E2-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_hai_chieu
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: ban sao lanh -> exit 0
    PASS: go va -> do dung ca
    Results: chan hai-chieu passed

- eval: E3
  run_id: minted-suite-run-log-provenance-E3-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_va_cham_ten
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: tiem [go lop ma duy nhat] doi duoc noi dung
    PASS: chieu do [go lop ma duy nhat]: W35 hai lenh -> hai run_id KE CA khi verifier khai trung
    Results: chan va-cham-ten passed

- eval: E4
  run_id: minted-suite-run-log-provenance-E4-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_ket_qua_rieng
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: ket-qua-rieng: W31 cannotRun -> exit_code null + co cannot_run
    PASS: ket-qua-rieng: W04 dong suite giu exit RIENG cua no, khong an theo eval hong
    Results: chan ket-qua-rieng passed

- eval: E5
  run_id: minted-suite-run-log-provenance-E5-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_thu_tu
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: tiem [bo hau to vong] doi duoc noi dung
    PASS: chieu do [bo hau to vong]: W29 doi round -> doi ma
    Results: chan thu-tu passed

- eval: E6
  run_id: minted-suite-run-log-provenance-E6-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_day_khep
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: day-khep: W33 khuon suite trong ban mau CO dong run_id (round-trip writer<->reader)
    PASS: day-khep: W33 de bai tro dung khuon SUITE-BLOCK-TEMPLATE cua ban mau
    Results: chan day-khep passed

- eval: E7
  run_id: minted-suite-run-log-provenance-E7-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_khong_hoi_quy
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: khong-hoi-quy: W32 so dong = so eval
    PASS: dong eval khong doi hinh dang (cmd,evalId,exit_code,round,run_id,ts)
    Results: chan khong-hoi-quy passed

- eval: E8
  run_id: minted-suite-run-log-provenance-E8-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_bo_doc
  verified_at: 2026-08-29T00:00:00Z
  output: |
    PASS: chieu do [gate-card.js/fx-head]: go nhanh -> sai chu lo ra
    Results: chan bo-doc passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-suite-run-log-provenance-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-08-29T00:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-suite-run-log-provenance-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-08-29T00:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-suite-run-log-provenance-SUITE-bash_tests_plugins_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-08-29T00:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-suite-run-log-provenance-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-08-29T00:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-suite-run-log-provenance-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-08-29T00:00:00Z

## Known limits

Năm giới hạn owner đã chốt khai ra thay vì đuổi thêm vòng (nguyên văn ở mục
«Giới hạn đã khai» của contract.md):

- Chiều đỏ chưa phủ đều: chân va-chạm chạy phép so đỏ trên MỘT trong ba biến
  thể; hai chân ket-qua-rieng và khong-hoi-quy chỉ có chiều dương.
- Danh sách vật-được-đo trong răng viết tay; thêm vật mới mà quên cập nhật thì
  lưới chống-trôi không canh nó.
- Trang bằng chứng và card Cổng 2 mới chỉ thôi gán trường của lệnh chạy chung
  cho một tiêu chí; chúng chưa render các khối đó thành mục riêng.
- Không lưới nào bắt bản chấm phải THẬT SỰ mang khối lệnh chạy chung: bộ đối
  chiếu chỉ kiểm chiều bản-chấm → sổ, không kiểm chiều ngược lại.
- Dòng sổ của lệnh chạy chung chưa có phép so tập-khoá toàn phần như dòng tiêu
  chí; lượt soi đo thật: bỏ trường vòng khỏi riêng dòng đó thì bộ kiểm vẫn xanh.

## Ngoài hợp đồng

Sáu việc lượt soi xác nhận, đều nằm ngoài phạm vi đã duyệt — người ký quyết
từng mục (ghi hạn chế · mở hợp đồng mới · nâng phạm vi sửa ngay). Chi tiết đầy
đủ trong review-findings.md:

- Bảng tách tên bỏ sót dạng `yarn run <script>`, nên trong kho dùng yarn mọi
  dòng lệnh chạy chung đều mang cùng một tên gốc. Máy đề nghị: mở hợp đồng mới.
- Fixture của hai bản trình gõ tay theo khuôn bên đọc thay vì rút từ khuôn có
  nhãn trong bản mẫu — sửa khuôn ở bản mẫu thì ca đo vẫn xanh (hai finding cùng
  lớp). Máy đề nghị: mở hợp đồng mới.
- Bộ đọc thứ ba của cùng khối bằng chứng chưa nhận nhánh đóng khối; hôm nay vô
  hại vì nó không đọc trường nào của khối đó, nhưng đó là ngẫu nhiên chứ không
  phải bất biến. Máy đề nghị: ghi hạn chế.
- Phép so nội dung trong răng gộp «khác nhau» với «không so được» vào cùng một
  nhánh, nên ca chưa-bao-giờ-chạy đọc thành đã-tiêm-được. Máy đề nghị: ghi hạn chế.
- Lưới chống-trôi của bản sao dùng danh sách file viết tay (cùng gốc với giới
  hạn đã khai số 2). Máy đề nghị: ghi hạn chế.

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E1–E7 (script) + 5 lệnh suite hồi quy đều PASS trên bản sao trọn cây (git archive HEAD) — verdict PASS, nhưng E8/AC-7 (bộ đọc trang bằng chứng + gate-card) chưa từng chạy và hai mục Known limits/Ngoài hợp đồng để trống dù dữ liệu đã có — evidence hoá ra stale.
Round 4: E1–E8 (script, nay đã có E8) + 5 lệnh suite hồi quy đều exit 0 trên bản sao trọn cây, nhưng rà soát phát hiện 3 lỗi đo lường TRONG HỢP ĐỒNG (AC-7 assertion âm-tính-một-mình ở chân bo-doc/thẻ Cổng 2, AC-2 hậu tố băm không có ca đo trên bộ lệnh va chạm, AC-3 assert quan hệ ở biến thể 40-ký-tự hạ thành so-khác-nhau) — verdict REJECT, quay lại sửa phép đo trước khi tin cờ xanh.
Round 5: E1–E8 (script) + 5 lệnh suite hồi quy đều PASS trên bản sao trọn cây; ba lỗi đo lường của round 4 (AC-7, AC-2, AC-3) đã sửa và cả 8 chân đều red-trên-baseline — verdict PASS. Rà soát ngoài hợp đồng còn 5 finding (fixture viết tay thay vì round-trip từ SUITE-BLOCK-TEMPLATE ở hai ca EPS/GCS và rang.sh, một bộ đọc thứ ba (acceptance-gold.mjs) chưa cùng mức phòng thủ, tenSuite hụt biến thể `yarn run x`, `cmp -s` không phân biệt rc=1/rc=2 trong rang.sh) — không AC nào thất bại, để Cổng 2 người đọc.

### Re-pin lần 1 — 2026-08-29, do main gộp hai PR chạm chính hai file hồ sơ này đo (`scripts/gate-card.js`, `tests/scripts/run-tests.sh`)
run_id: repin-suite-run-log-provenance-20260829T092544Z
sha: 60f9d6cd4be9928ba7477f093c329e5a3ad30757 · suites: 5 lệnh exit 0
