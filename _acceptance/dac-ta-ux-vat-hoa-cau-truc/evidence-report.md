---
schema_version: 2
feature_slug: dac-ta-ux-vat-hoa-cau-truc
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e19a71461c07f59c5211092593daaa5ff5546dfb
human_signoff:
---

# Evidence Report: dac-ta-ux-vat-hoa-cau-truc

REJECT: cả 4 test evals xanh (E1–E4) và không judgment nào bị FAIL dứt khoát, nhưng scope-triage (xem `review-findings.md`, mục "Trong hợp đồng") xác nhận AC-3 và AC-6 vẫn tuyên phần phạm vi đã bị cắt ở round 4/5 — hợp đồng lệch khỏi vật giao. Đây không phải lỗi thực thi máy mà là lỗi ý-định-chốt: tiêu chí viết trước không khớp vật đang có. Không sửa tay báo cáo — quay lại viết lại AC-3/AC-6 theo vật thật rồi verify lại.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | UNCERTAIN |
| E6 | AC-6 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E1-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T10:00:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E2-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T10:00:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E3-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T10:00:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E4-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T10:00:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E5
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verdict: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — (1) và (3) rõ: cả hai file dạy đúng thang 2 nấc, ghi thẳng "không phụ thuộc công cụ nào, luồng hiển nhiên không tra" (SKILL.md S1#4) và ngưỡng "≥2 khuôn khả dĩ" khớp nhau ở cả hai file, không phải trạm thu phí. (2) mơ hồ: cơ chế duy nhất hai file này khai cho vết là frontmatter `design_doc: <path>` "để người duyệt mở thẳng" (SKILL.md S1#4), còn khối trình tại Gate 1 (mục GATE 1) chỉ hứa đính "tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping" — không nêu acceptance-card có trích inline dòng "Khuôn IA đã chọn + căn cứ" hay chỉ để người duyệt tự mở file path đó; file acceptance-card (nơi quyết định có render inline hay không) nằm ngoài phạm vi input được giao nên không đủ căn cứ kết luận vết có thật sự "đọc được TẠI cổng" hay chỉ "mở được".
      required_evidence:
        - Đọc skill acceptance-gate:acceptance-card (file render thẻ Gate 1, thường ở skills/acceptance-gate hoặc tương đương) — nếu thẻ trích nguyên văn/paraphrase dòng 'Khuôn IA đã chọn + căn cứ' từ design-doc vào nội dung card thì verdict đổi PASS; nếu thẻ chỉ hiện path design_doc mà không hiện nội dung căn cứ thì đổi FAIL
        - Xác nhận 'tóm tắt design (≤10 dòng)' ở mục GATE 1 của feature-loop SKILL.md có phải văn tự do (agent viết tay) hay có khuôn bắt buộc phải chứa dòng Khuôn IA — nếu tự do và không bắt buộc, đó là bằng chứng vết có thể bị bỏ sót khỏi gói trình cổng
    - operational-feasibility: PASS — (1) Thang 2 nấc dạy khớp ở cả hai file, có câu chốt tường minh "không phụ thuộc công cụ nào" và MCP Mobbin chỉ là ví dụ ("vd") cho nấc (i), nấc (ii) là lối tự-điền không cần công cụ. (2) Vết nằm ở mục 6 design-doc, nhưng contract frontmatter ghi `design_doc: <path>` "để người duyệt mở thẳng" và Gate 1 đính "contract.md NGUYÊN VĂN" (chứa path đó) trong gói trình — cộng trần ≤1 trang nên chi phí quét thấp, đủ khả thi vận hành dù phải một cú click mở file rời. (3) Ngưỡng "chỉ tra khi không tự chắc" được lượng hoá cụ thể (≥2 khuôn khả dĩ) và có lối miễn tường minh cho luồng hiển nhiên ("ghi thẳng lý do"), nên không rơi vào trạm thu phí cho ca hiển nhiên.
    - spec-alignment: PASS — (1) Thang 2 nấc được dạy khớp nhau ở cả hai file bằng gần như cùng một câu chữ (SKILL.md dòng 92 và template mục 6): nấc (i) "có công cụ tra mẫu (vd MCP Mobbin)" chỉ là ví dụ, nấc (ii) "không có → chọn từ danh sách khuôn IA có tên, ghi lý do" là lối đi hợp lệ độc lập — không công cụ nào là điều kiện bắt buộc. (2) Vết nằm ở `## Đặc tả UX` trong design-doc, và contract ghi tường minh `design_doc: <path>` trong frontmatter "để người duyệt mở thẳng"; Gate 1 đính kèm contract.md NGUYÊN VĂN nên đường dẫn tới vết luôn có mặt trong gói cổng — dù bản thân dòng Căn cứ không được trích trực tiếp vào gói (chỉ có tóm tắt design ≤10 dòng), đây là một pointer tường minh, chủ đích, một-bước-mở, phù hợp khuôn "soi sâu khi cần" mà SKILL dùng cho toàn bộ Gate 1. (3) Luật "chỉ tra khi không tự chắc" có ngưỡng rõ (≥2 khuôn khả dĩ) và lối thoát tường minh cho luồng hiển nhiên ("luồng hiển nhiên thì ghi thẳng lý do" / "luồng hiển nhiên không tra") lặp lại nhất quán ở cả hai file, nên không đọc thành trạm thu phí bắt buộc.
  rationale: Panel không đồng nhất — spec-alignment và operational-feasibility cho PASS, domain-correctness giữ UNCERTAIN vì không có đủ input (file acceptance-card nằm ngoài phạm vi giao) để xác nhận vết "Khuôn IA đã chọn + căn cứ" thật sự đọc được TẠI cổng hay chỉ mở được qua path.
  required_evidence:
    - Đọc skill acceptance-gate:acceptance-card (file render thẻ Gate 1) — nếu thẻ trích nguyên văn/paraphrase dòng 'Khuôn IA đã chọn + căn cứ' từ design-doc vào nội dung card thì verdict đổi PASS; nếu thẻ chỉ hiện path design_doc mà không hiện nội dung căn cứ thì đổi FAIL
    - Xác nhận 'tóm tắt design (≤10 dòng)' ở mục GATE 1 của feature-loop SKILL.md có khuôn bắt buộc chứa dòng Khuôn IA hay không
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E6
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verdict: UNCERTAIN
  votes:
    - domain-correctness: PASS — Chạy thực tế file (node tests/plugins/ux-spec.test.mjs) ra 25/25 PASS trên bản nguyên vẹn — mọi ca đỏ trong UX1/UX3/UX4 đều đi kèm đối chứng dương (cùng hàm kiểm, khác input: uxSection() cho UX1, các hàm checks.a/a2/b/c/d cho UX3, mienKhop() cho UX4), không có assertion âm-tính đứng một mình. Đối chiếu grep trực tiếp trên feature-loop/skills/feature-loop/SKILL.md xác nhận các cụm bị mutate ("Rồi sinh CÙNG LÚC", "design_doc: <path", "GIỮ NGUYÊN các marker", "vẽ TỪ section Đặc tả UX", cụm resolve-plugin.mjs) chỉ xuất hiện đúng một lần và đúng bên trong đoạn bị cắt/thay — nên ghim đỏ không bị thoả bởi thứ khác. Fixture của cả ba ca đều rút từ file nguồn thật (ux-spec-template.md, SKILL.md) qua readFileSync + trích marker/replace, không có fixture viết tay; UX3 dùng named-check-function chạy trên cả bản gốc lẫn bản mutate nên mutation và assertion không phải cùng một thao tác.
    - operational-feasibility: PASS — Cả UX1, UX3, UX4 đều rút fixture qua readFileSync từ file thật (ux-spec-template.md, SKILL.md) chứ không viết tay; mọi chiều đỏ (UX1-đỏ/đỏ2, UX3 a/a2/b/c/d-đỏ, UX4-đỏ) đều đứng sau một đối chứng dương chạy CÙNG hàm kiểm trên bản gốc trước khi mutate, nên không có ca nào chỉ có assertion âm tính một mình. Không thấy chiều đỏ nào lặp y hệt thao tác của assertion (mutation dùng marker/vị trí cắt khác, assertion dùng substring/regex khác, kể cả khi cùng hàm check — đúng khuôn "cùng hàm, khác input" mà chính file đã tự đặt ra ở comment dòng 36-37 và 69-72).
    - spec-alignment: FAIL — Hằng `MIEN` (dòng 14) là literal gõ tay, không rút qua marker từ `ux-spec-template.md` như đầu file tự nhận ("Fixture CODE-SINH rút từ CHÍNH ux-spec-template.md qua marker"); UX4 (dòng 137-140) dùng nó để so cả SKILL lẫn TPL với MỘT literal thứ ba thay vì rút chuỗi từ một bên rồi kiểm bên kia, nên không đo đúng điều comment tự nhận ("hai tài liệu chép cùng một chuỗi") — nếu cả hai tài liệu cùng đổi cách viết câu miễn (vẫn khớp nhau) mà quên sửa MIEN, case báo lệch giả dù bất biến thật (SKILL==TPL) vẫn đúng. UX1 dòng 50 dùng lại cùng literal cho việc kiểm một-phía nên ít rủi ro hơn nhưng cùng nguồn gốc viết-tay.
      required_evidence:
        - Sửa tests/plugins/ux-spec.test.mjs dòng 130-141 (case UX4): rút chuỗi miễn từ TPL bằng marker/regex thay vì const MIEN gõ tay ở dòng 14, rồi kiểm chuỗi đó xuất hiện trong SKILL (round-trip rút-từ-writer, đúng khuôn OOC-ITEM-TEMPLATE mà chính CLAUDE.md kit yêu cầu) — chạy `node tests/plugins/ux-spec.test.mjs` xanh với UX4 sau khi sửa sẽ đổi verdict.
        - Hoặc: nếu MIEN thật ra được sinh ra ở một script/marker khác ngoài phạm vi file test này (mà judge không thấy do bị giới hạn input), trưng đường dẫn script đó — nếu chứng minh được MIEN không phải literal viết tay, verdict đổi thành PASS.
  rationale: Panel không đồng nhất — hai lens cho PASS trên cơ sở đối chứng dương/mutant hợp lệ có thật trong code test, nhưng spec-alignment nêu bằng chứng cụ thể rằng hằng MIEN trong UX4 là literal gõ tay chứ không rút round-trip từ writer, lệch khỏi chính lời khai đầu file — cần người quyết ngưỡng này có chấp nhận được không.
  required_evidence:
    - Sửa tests/plugins/ux-spec.test.mjs dòng 130-141 (case UX4): rút chuỗi miễn từ TPL bằng marker/regex thay vì literal MIEN gõ tay ở dòng 14
    - Hoặc trưng đường dẫn script/marker khác chứng minh MIEN không phải literal viết tay
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

## Analyst

E1, E2, E3, E4 — cả bốn xanh trên cả HEAD lẫn baseline (`bash tests/plugins/run-tests.sh` baseline: green), vì lệnh cover cả suite plugins rộng hơn 4 eval này. Không đủ căn cứ tách baseline theo từng eval riêng lẻ từ kết quả máy đưa vào; khuyến nghị vòng sau chạy baseline theo đúng UX_CASES=E{n} riêng để mỗi eval có tín hiệu phân biệt độc lập thay vì thừa hưởng baseline của cả suite.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: Cắt cánh W8 (state-matrix, mệnh đề `states:`) khỏi phạm vi — contract/evals chưa cập nhật theo kịp phần cắt.
Round 5: Hội đồng FAIL E9 (chiều đỏ tautology ở UX3c và UX1-đỏ2) — E9 bị XOÁ khỏi bộ đo thay vì sửa vật; evidence-report round 5 tự nêu "AC-3 còn tuyên mệnh đề `states:` đã bị cắt ở round 4" nhưng chưa sửa.
Round 6: E1–E4 xanh, panel E5/E6 không đồng nhất (UNCERTAIN); scope-triage xác nhận AC-3 và AC-6 vẫn lệch khỏi vật giao (6 finding "Trong hợp đồng") → REJECT, quay lại viết lại contract/evals theo phạm vi thật trước khi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
