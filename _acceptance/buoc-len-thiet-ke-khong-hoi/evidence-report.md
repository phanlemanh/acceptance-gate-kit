---
schema_version: 2
feature_slug: buoc-len-thiet-ke-khong-hoi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f1f447611162cdf1c1cca7c0b0753a9f9b6ca47a
human_signoff: Manh Phan 2026-10-11
---

# Evidence Report: buoc-len-thiet-ke-khong-hoi

Round 2. Mọi eval máy xanh, mọi lệnh suite hồi quy xanh, E9 mang từ round 1 (delta không chạm paths của nó). Verdict PENDING-JUDGMENT vì hợp đồng là T3: cả hai mục judgment (E1, E8) chờ người điền `human_override`. Round này review không còn finding trong hợp đồng (lỗi AC-6 của round 1 đã sửa, ca đo CC-06 bo-doc đọc đúng trường ba bộ đọc và có đối chứng dương).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | ui-check | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E2
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E4
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E5
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E6
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E7
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E10
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T13:29:07Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
      PASS: can-cu-s1.ca.mjs (CC-02..CC-10)
    Results: 838 passed, 0 failed

- eval: E9
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: tests/scripts/can-cu-s1.ca.mjs
  verified_at: 2026-10-11T12:55:28Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval
  screenshot: evidence/E9-step1.png
  observed: |
    E9-step1.png (1280x800): thẻ rộng khoảng 640px. Thứ tự khối từ trên xuống: Hệ thống sẽ làm, Sẽ không làm / Sẽ chặn, Câu chỉ anh trả lời được (xanh), Máy đã quyết ở bước thiết kế (xám), Quyết định & trade-off, Độ phủ AC. Hỏi-1 đọc được khuyến nghị + lối khác; Hỏi-2 mang nhãn khó-đảo (đúng một câu, card.html có 1 lần chữ này) cùng khuyến nghị + lối khác. Máy đã quyết m1 đọc được câu trích và tệp (CLAUDE.md); m2 đọc được lý do lối khác chết.
    E9-step2.png (390x844, iframe): không bị cắt ngang, chữ xuống dòng, chip «duyệt tiêu chí» nằm trong thẻ, thứ tự khối giữ nguyên; scrollWidth đo được 390 (clientWidth 390), 390 <= 390. Một màn đọc trả lời được «máy đã quyết gì, còn hỏi gì».
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-11T13:29:07Z

### Judgment (đề xuất của hội đồng — người quyết ở Cổng 2)

Hợp đồng T3: hội đồng chỉ đề xuất PASS cho cả hai eval, người phải tự xác nhận từng mục và điền `human_override`. Trường này để TRỐNG cho người điền.

- eval: E1
  judged_by: judge-subagent panel (fresh context)
  verdict: PASS
  panel_votes:
    - domain-correctness: PASS — Tất cả các câu hỏi đều đúng trong SKILL.md và acceptance-card.md. S1 mục 1 cấm dừng xin duyệt thiết kế và cấm hỏi «làm ngay chứ?». Mục này xếp ba nguồn căn cứ kèm việc máy làm, nói «không trỏ được căn cứ thì là chỉ người có», và để khó-đảo luôn là câu hỏi. Danh sách dừng của Gate 1 có vế mới. Điểm vũ trang /goal dời về lời mời Cổng Đáng. Ý (4) soi đủ bốn kiểu dòng sổ máy đã quyết và xử lý P0 bằng dòng S1 mới mang supersedes. Khuôn DEC-LAT-GATE1 và lời dặn ghi trước khi soạn lại đều có. Bước 3 của acceptance-card.md truyền gốc nhánh khi sổ có dòng mang can_cu. Khối TRONG-DOT còn nguyên lời dặn và không mâu thuẫn với luật mới.
    - operational-feasibility: PASS — Mọi câu đều đúng trên SKILL.md và commands/acceptance-card.md. S1 mục 1 cấm dừng xin duyệt thiết kế và cấm hỏi «làm ngay chứ?». Ba nguồn căn cứ kèm việc máy làm, quy tắc «không trỏ được thì là chỉ người có» và khó-đảo luôn là câu hỏi đều có mặt. Danh sách dừng Gate 1 có vế mới, `/goal` đầu tiên dời về lời mời Cổng Đáng, ý (4) soi mọi dòng S1 và xử lý bằng dòng supersedes, `DEC-LAT-GATE1` có đủ trường và dặn ghi trước khi soạn lại, bước 3 của acceptance-card truyền gốc nhánh khi sổ có `can_cu`, khối TRONG-DOT còn đủ năm luật. Hai điểm nhỏ không làm sai câu nào: chỉ dẫn in `/goal` nằm ở S1 mục 1 chứ không ở khối S0-MO-O-THOAT; và «nguyên một byte» của TRONG-DOT chỉ xác nhận được qua nội dung hiện tại, không qua đối chiếu lịch sử, vì lượt chấm này không đọc diff.
    - spec-alignment: PASS — Mọi câu hỏi đều khớp khi đối chiếu SKILL.md với design §3.1, §3.5, §3.6, §3.8 và ô cơ hội. S1 mục 1 bỏ hẳn hỏi-đáp và «làm ngay chứ?», xếp ba nguồn căn cứ kèm việc máy làm, và cho «không trỏ được căn cứ thì là chỉ người có» cùng khó-đảo luôn là câu hỏi. Câu chỉ-người-biết được soạn nháp theo khuyến nghị rồi lên thẻ Cổng Phạm vi. Danh sách dừng Gate 1 có thêm vế sổ còn câu hỏi hoặc dòng đỏ. Điểm vũ trang /goal đầu tiên dời về lời mời Cổng Đáng. Ý (4) của gap-probe soi mọi dòng S1 máy đã quyết, P0 xử lý bằng dòng S1 mới mang supersedes. Có khối DEC-LAT-GATE1 (stage gate1, supersedes, decided_by) với lời dặn ghi trước khi soạn lại. Bước 3 của acceptance-card.md truyền gốc nhánh khi sổ có dòng mang can_cu. Khối TRONG-DOT còn nguyên lời dặn riêng. Vì đã chặn đọc diff, tôi không so từng byte của TRONG-DOT với bản gốc.
  human_override: Manh Phan 2026-10-11 — Đạt

- eval: E8
  judged_by: judge-subagent panel (fresh context)
  verdict: PASS
  panel_votes:
    - domain-correctness: PASS — GUIDE.md (mục Sổ quyết định) nêu ba giá trị nguon (muc-tieu, mot-loi, chi-nguoi) với trường đi kèm (tep+trich, loi_chet, khuyen+loi_khac), cờ kho_dao luôn là câu hỏi, dòng không khoá được đọc như đời trước kèm cờ vàng ở hợp đồng nháp, và ba khối trên thẻ Cổng Phạm vi cùng cờ đỏ. CONTEXT.md định nghĩa «Nguồn căn cứ» kèm _Avoid_ (lý do, căn cứ pháp lý). ADR 0022 nêu vì sao khoá này không trái ADR 0021 (con trỏ cho máy kiểm, ba câu người đọc giữ nguyên), chủ kho phê đích danh phần CỘNG ở Cổng Phạm vi theo ADR 0018, và đường đảo (ngừng ghi khoá, bộ đọc coi dòng không khoá là đời trước, không đỏ).
    - operational-feasibility: PASS — GUIDE.md (dòng 325–345) nêu đủ ba nguồn `muc-tieu`/`mot-loi`/`chi-nguoi` với trường đi kèm, cờ `kho_dao: true` luôn là câu hỏi, dòng không khoá là đời trước, và thẻ Cổng Phạm vi hiện ba khối cho từng lớp. CONTEXT.md (dòng 341–347) định nghĩa «Nguồn căn cứ» kèm `_Avoid_`. ADR 0022 giải thích vì sao không trái ADR 0021 (khoá cho máy kiểm, không phải câu thứ tư cho người đọc), ghi chủ kho phê phần CỘNG ở Cổng Phạm vi theo ADR 0018, và nêu đường đảo (ngừng ghi khoá, bộ đọc coi dòng không khoá là đời trước, không đỏ). Chỉ có hai chỗ nhỏ không đủ để đổi verdict. GUIDE nói thẻ của hợp đồng nháp có thêm một cờ vàng cho dòng cũ, còn ADR nói «thẻ in như trước». Cú pháp một dòng chính xác nằm ở khuôn `DEC-CAN-CU-SLOT` trong SKILL, ngoài danh sách input, và GUIDE chủ ý trỏ tới đó thay vì chép lại.
    - spec-alignment: PASS — GUIDE.md mục «Sổ quyết định» ghi đủ khoá `can_cu` cho ba nguồn (`muc-tieu` với `tep`+`trich`, `mot-loi` với `loi_chet`, `chi-nguoi` với `khuyen`+`loi_khac`), cờ `kho_dao` luôn là câu hỏi, dòng không khoá là đời trước (đọc như cũ, hợp đồng nháp có thêm cờ vàng), và ba khối trên thẻ Cổng Phạm vi. CONTEXT.md có định nghĩa «Nguồn căn cứ» kèm `_Avoid_` (lý do, căn cứ pháp lý). ADR 0022 nói rõ vì sao không trái 0021 (con trỏ cho máy kiểm, không phải câu thứ tư cho người đọc), chủ kho phê CỘNG đích danh ở Cổng Phạm vi (ADR 0018), và đường đảo (ngừng ghi khoá, bộ đọc coi dòng không khoá là đời trước, không đỏ).
  human_override: Manh Phan 2026-10-11 — Đạt

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline, từ round 1): E2, E3, E4, E5, E6, E7, E10 (cùng lệnh `bash tests/scripts/run-tests.sh --manh bash`). Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy, ui-check và suite hồi quy xanh; REJECT vì một finding trong hợp đồng ở AC-6 (ca đo CC-06 bo-doc so hai vế đều là hằng số, không có đối chứng dương). Returned to implementation.
Round 2: mọi eval máy và suite hồi quy xanh sau khi sửa CC-06 bo-doc; E9 mang từ round 1 (delta không chạm paths); không còn finding trong hợp đồng. PENDING-JUDGMENT vì T3 cần người điền human_override cho E1 và E8.

### Re-pin lần 1 — 2026-10-11, do ghim lại sau gộp main d9d1f3a6 (#312, #313)
run_id: repin-20261011T143542Z-57573
sha: a3390dd8308eea8b524cd4c6f14a7d67bace1502 · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E1 (E1 không khai paths), E8 (E8 không khai paths), E9 · diff chạm vật đo ngoài làn máy: E9 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-1, AC-8, AC-9

### Re-pin lần 2 — 2026-10-12, do ghim lại sau gộp main a1e2e0b9 (mốc v2.27.0)
run_id: repin-20261012T084114Z-12006
sha: f1f447611162cdf1c1cca7c0b0753a9f9b6ca47a · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E1 (E1 không khai paths), E8 (E8 không khai paths), E9 · diff chạm vật đo ngoài làn máy: E9 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-1, AC-8, AC-9
