---
schema_version: 2
feature_slug: dac-ta-ux-vat-hoa-cau-truc
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 81911bccdddccbf1f38b0fd144679160516373a1
human_signoff:
---

# Evidence Report: dac-ta-ux-vat-hoa-cau-truc

PENDING-JUDGMENT: cả 4 test evals xanh (E1–E4), nhưng cả hai judgment item còn chưa đồng nhất trong hội đồng. E5 (AC-5): domain-correctness và spec-alignment nói PASS, operational-feasibility giữ UNCERTAIN vì không đủ căn cứ xác nhận acceptance-card có trích nguyên văn mục "Khuôn IA đã chọn + căn cứ" vào gói Gate 1 hay chỉ để lại đường dẫn. E6 (AC-6): domain-correctness và operational-feasibility nêu bằng chứng cụ thể rằng chiều đỏ UX1-đỏ2 vẫn tautology (mutate và assertion là cùng một thao tác thay chuỗi) và mệnh đề UX3b (`checks.b`) không có mutant cô lập riêng — ăn theo mutant của mệnh đề khác; spec-alignment giữ PASS. Người quyết ở Gate 2 cho cả hai item, đồng thời đọc `review-findings.md` — scope-triage xác nhận 4 finding còn nằm trong hợp đồng (đều map AC-6, cùng lớp tautology/thiếu-mutant-cô-lập) và 6 finding khác nằm ngoài hợp đồng nhưng có mức nghiêm trọng cao (thẻ Cổng 2 lệch verdict thật, evidence dán nhầm output của tính năng khác, verified_commit đã cũ hơn hai commit sửa chính vật được đo).

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
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E1-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T11:42:00+07:00
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E2-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T11:42:00+07:00
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E3-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T11:42:00+07:00
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E4-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T11:42:00+07:00
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E5
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verdict: UNCERTAIN
  votes:
    - domain-correctness: PASS — (1) Thang 2 nấc được dạy khớp nhau ở cả hai file (ux-spec-template.md mục 6, SKILL.md S1#4): nấc (i) "phiên có công cụ tra mẫu thị trường (vd MCP Mobbin)", nấc (ii) "không có → chọn từ danh sách khuôn IA có tên", và SKILL.md nói rõ "không phụ thuộc công cụ nào" — ví dụ Mobbin chỉ là minh hoạ, không phải điều kiện bắt buộc. (2) Vết nằm ở section `### 6. Khuôn IA đã chọn + căn cứ` trong design-doc, và contract frontmatter bắt buộc ghi `design_doc: <path>` (ux-spec-template.md dòng 13-14, SKILL.md dòng 92) "để người duyệt mở thẳng"; Gate 1 luôn đính "contract.md NGUYÊN VĂN" (SKILL.md dòng 103) nên đường dẫn tới vết luôn có mặt ngay trong gói trình cổng, đúng khuôn tiêu đề cố định nên dễ tìm khi mở. (3) Ngưỡng "CHỈ tra khi không tự chắc (≥2 khuôn khả dĩ) — luồng hiển nhiên thì ghi thẳng lý do" là một điều kiện tự-đánh-giá rõ ràng, không đòi hỏi bước xác nhận từ người khác, nên không phát sinh trạm thu phí cho luồng hiển nhiên.
    - operational-feasibility: UNCERTAIN — (1) và (3) đạt: thang 2 nấc được dạy khớp nguyên văn ở cả hai file, có nấc dự phòng không-công-cụ và tự nói rõ "không phụ thuộc công cụ nào"; ngưỡng "chỉ tra khi ≥2 khuôn khả dĩ, luồng hiển nhiên ghi thẳng" là điều kiện nhị phân rõ, không phải trạm thu phí. (2) mơ hồ: SKILL.md chỉ định nghĩa gói Gate 1 gồm "tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping AC→eval" — không nói rõ mục "Khuôn IA đã chọn + căn cứ" (section 6, nằm sâu trong design doc) có lọt vào bản tóm tắt ≤10 dòng hay không; cơ chế duy nhất bảo đảm người duyệt thấy được là `design_doc:` path trong frontmatter "để người duyệt mở thẳng" — tức một đường dẫn phải tự mở, không phải nội dung inline trong thẻ. Hai file trong phạm vi không đủ để xác định card có trích nguyên văn section 6 hay không (logic render nằm ở acceptance-card, ngoài phạm vi input được phép).
      required_evidence:
        - Nội dung/skill render acceptance-card (vd skills/acceptance-gate/skills/acceptance-card/... hoặc SKILL.md của acceptance-card) cho thấy card Gate 1 trích nguyên văn hoặc link trực tiếp tới section '### 6. Khuôn IA đã chọn + căn cứ' của design doc — không chỉ một bản tóm tắt ≤10 dòng có thể cắt mất mục này.
        - Một ví dụ contract.md + design-doc thật đã qua Gate 1 (hoặc fixture test) cho thấy dòng 'Căn cứ:' của mục 6 xuất hiện nguyên văn trong gói trình cổng thực tế, không chỉ trong file design-doc rời.
    - spec-alignment: PASS — (1) Thang 2 nấc được dạy khớp nguyên văn giữa hai file: ux-spec-template.md mục 6 và feature-loop SKILL.md S1#4 đều nêu "(i) có công cụ tra mẫu (vd MCP Mobbin) → tra + ghi vết; (ii) không có → chọn từ danh sách khuôn IA có tên, ghi lý do", và SKILL.md nói thẳng "không phụ thuộc công cụ nào" — Mobbin chỉ là ví dụ (vd), không phải điều kiện bắt buộc. (2) Vết nằm trong dòng "Căn cứ" của design-doc; contract.md có field frontmatter `design_doc: <path>` "để người duyệt mở thẳng", và Gate 1 đính kèm contract.md NGUYÊN VĂN — vị trí (tên field, lý do có mặt) rõ dù không inline sẵn nội dung căn cứ vào thẻ. (3) Ngưỡng "chỉ tra khi không tự chắc (≥2 khuôn khả dĩ)" + đối lập "luồng hiển nhiên thì ghi thẳng lý do" xuất hiện đồng nhất ở cả hai file, đủ cụ thể (số khuôn khả dĩ là điều kiện đo được) để không bắt tra mẫu cho mọi feature.
  rationale: Panel không đồng nhất — domain-correctness và spec-alignment cho PASS dựa trên thang 2 nấc khớp nhau ở cả hai file cộng pointer `design_doc:` luôn có mặt trong gói Gate 1; operational-feasibility giữ UNCERTAIN vì hai file trong phạm vi không xác nhận được acceptance-card có trích nguyên văn mục 6 vào nội dung card hay chỉ để lại đường dẫn phải tự mở — logic render nằm ngoài phạm vi input được giao cho vòng này.
  required_evidence:
    - Nội dung/skill render acceptance-card (vd skills/acceptance-gate/skills/acceptance-card/... hoặc SKILL.md của acceptance-card) cho thấy card Gate 1 trích nguyên văn hoặc link trực tiếp tới section '### 6. Khuôn IA đã chọn + căn cứ' của design doc — không chỉ một bản tóm tắt ≤10 dòng có thể cắt mất mục này.
    - Một ví dụ contract.md + design-doc thật đã qua Gate 1 (hoặc fixture test) cho thấy dòng 'Căn cứ:' của mục 6 xuất hiện nguyên văn trong gói trình cổng thực tế, không chỉ trong file design-doc rời.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E6
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: FAIL
  verdict: UNCERTAIN
  votes:
    - domain-correctness: FAIL — UX1's own comment (dòng 36-37, 62) tuyên bố tránh tautology bằng cách ĐỔI TÊN + kiểm khác thao tác — và áp đúng cho mục 6 (đỏ-2, dòng 64-66). Nhưng đỏ-1 cùng case (dòng 56-59) lại làm đúng thứ bị cấm: mutate bằng thay thế literal `UX-STATE-TABLE`→`UX-XXX-TABLE` trên toàn chuỗi rồi assert `!secMut.includes('<<<UX-STATE-TABLE')` — mutation và assertion là CÙNG một phép biến đổi chuỗi, không có logic trích/kiểm độc lập nào ở giữa (đối chứng `secMut !== null` cũng vô nghĩa vì marker template không hề bị chạm). Cùng hình dạng lặp lại ở UX3c: `mutC` (dòng 114, xác nhận bằng script đã xoá đúng 112 ký tự chứa cả "Đặc tả UX" lẫn "hình là chiếu của khuôn") xoá TRỌN câu chứa cả hai chuỗi mà `checks.c` (dòng 96) kiểm — nên chiều đỏ chỉ echo lại đúng nội dung vừa cắt, không chứng minh được năng lực phát hiện độc lập.
      required_evidence:
        - Sửa tests/plugins/ux-spec.test.mjs dòng 56-59 (UX1-đỏ gỡ marker bảng) theo đúng pattern ĐỔI TÊN + bộ-kiểm-khác-thao-tác mà đỏ-2 (dòng 64-66) đã dùng cho mục 6 — ví dụ mutate bằng đổi cấu trúc bảng (xoá một dòng ST-) thay vì swap literal chuỗi marker, rồi assert bằng đếm dòng/parse cấu trúc thay vì includes() đúng chuỗi vừa thay.
        - Sửa tests/plugins/ux-spec.test.mjs quanh dòng 92-96/114/125 (UX3c) để mutC chỉ cắt MỘT trong hai cụm mà checks.c kiểm (vd giữ nguyên 'Đặc tả UX' ở chỗ khác trong b3, chỉ xoá cụm 'hình là chiếu của khuôn'), chứng minh checks.c thật sự cần độc lập cả hai mệnh đề chứ không chỉ echo đúng đoạn bị xoá.
    - operational-feasibility: FAIL — UX1 và UX4 đều có đối chứng dương + chiều đỏ không-tautology, fixture rút từ writer thật (TPL) hoặc đọc thẳng file thật, đạt cả 4 tiêu chí. UX3 phần lớn ổn (mỗi mệnh đề a, a2, c, d có mutant riêng, không tautology), NHƯNG mệnh đề UX3b (`checks.b`, dòng 91: kiểm `design_doc: <path` + `GIỮ NGUYÊN các marker`) không có mutant riêng — chiều đỏ của nó (dòng 124: `!checks.b(mutA)`) chỉ tái dùng `mutA`, mutant được dựng riêng cho mệnh đề a (cắt câu SEN). Đây đúng dạng "ghim thoả bởi thứ khác cảnh báo thật": nếu một sửa đổi thật chỉ xoá/đổi nội dung `design_doc:`/`GIỮ NGUYÊN các marker` mà không đụng câu SEN của a, ca UX3b sẽ không bao giờ đỏ dù tiêu chí nó tuyên bố canh gác đã vỡ.
      required_evidence:
        - Thêm một mutant riêng cho checks.b trong tests/plugins/ux-spec.test.mjs — độc lập với mutA — chỉ xoá/đổi cụm `design_doc: <path` hoặc câu chứa `GIỮ NGUYÊN các marker` trong SKILL.md (không đụng câu SEN 'Kế đó, VẪN TRƯỚC khi sinh 3 artifact:'), rồi assert `!checks.b(mutB)` bên cạnh dòng 124. Nếu ca UX3b có mutant riêng thế này (thay vì ăn theo mutA) thì verdict đổi thành PASS.
    - spec-alignment: PASS — Cả ba ca UX1/UX3/UX4 đều có đối chứng dương chạy trên văn bản thật (baseline `ok(checks[k](s)...)` hoặc `ok(sec!==null...)`) trước mọi mutant, nên không có chiều đỏ nào đứng một mình. Fixture đều rút từ writer thật (TPL qua marker UX-SPEC-TEMPLATE, SKILL.md đọc trực tiếp), không phải văn viết tay. Chiều đỏ dùng chung hàm kiểm của chiều xanh trên input đã mutate (UX1: hasHeading dùng lại cho bản đổi-tên-mục kèm kiểm mục khác vẫn xanh; UX3: mỗi mệnh đề có checks[k] riêng chạy trên bản gỡ/đổi câu; UX4: mienKhop dùng lại trên bản đổi một bên) — không thấy dạng tautology xoá-chuỗi-rồi-kiểm-chuỗi-vắng trần trụi.
  rationale: Panel không đồng nhất — domain-correctness và operational-feasibility cho FAIL với bằng chứng cụ thể (UX1-đỏ2 vẫn tautology thay-chuỗi-rồi-kiểm-chuỗi-vắng dù comment đầu file tự nhận đã tránh; mệnh đề UX3b của checks.b không có mutant cô lập riêng, ăn theo mutant của mệnh đề a), spec-alignment cho PASS dựa trên đối chứng dương + fixture rút từ writer thật cho cả ba ca — người quyết ngưỡng AC-6 có chấp nhận được hai lỗ cụ thể này trước khi ký hay không.
  required_evidence:
    - Sửa tests/plugins/ux-spec.test.mjs dòng 56-59 (UX1-đỏ gỡ marker bảng) theo đúng pattern ĐỔI TÊN + bộ-kiểm-khác-thao-tác mà đỏ-2 (dòng 64-66) đã dùng cho mục 6.
    - Sửa tests/plugins/ux-spec.test.mjs quanh dòng 92-96/114/125 (UX3c) để mutC chỉ cắt MỘT trong hai cụm mà checks.c kiểm.
    - Thêm một mutant riêng cho checks.b (UX3b) trong tests/plugins/ux-spec.test.mjs, độc lập với mutA của mệnh đề a.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

## Analyst

E1, E2, E3, E4 — cả bốn xanh trên cả HEAD lẫn baseline (`bash tests/plugins/run-tests.sh` baseline: green), vì lệnh cover cả suite plugins rộng hơn 4 eval này; bốn khối bằng chứng ở trên còn dán chung một output tail (`PASS: ca bang dieu khien — BDK4`, thuộc hồ sơ start-bang-dieu-khien, không phải UX1-UX4 — xem review-findings.md mục ngoài hợp đồng), nên vòng này chưa có tín hiệu phân biệt độc lập theo từng eval. Khuyến nghị vòng sau chạy `UX_CASES=UX{n}` riêng cho từng ca để mỗi eval có output + baseline phân biệt độc lập thay vì thừa hưởng baseline của cả suite.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: Cắt cánh W8 (state-matrix, mệnh đề `states:`) khỏi phạm vi — contract/evals chưa cập nhật theo kịp phần cắt.
Round 5: Hội đồng FAIL E9 (chiều đỏ tautology ở UX3c và UX1-đỏ2) — E9 bị XOÁ khỏi bộ đo thay vì sửa vật; evidence-report round 5 tự nêu "AC-3 còn tuyên mệnh đề `states:` đã bị cắt ở round 4" nhưng chưa sửa.
Round 6: E1–E4 xanh, panel E5/E6 không đồng nhất (UNCERTAIN); scope-triage xác nhận AC-3 và AC-6 vẫn lệch khỏi vật giao (6 finding "Trong hợp đồng") → REJECT, quay lại viết lại contract/evals theo phạm vi thật trước khi verify lại.
Round 7: E1–E4 vẫn PASS nhưng không phân biệt (baseline green — cùng lệnh suite rộng hơn 4 eval); panel E5 UNCERTAIN (operational-feasibility cần bằng chứng render acceptance-card), panel E6 UNCERTAIN với proposal FAIL (domain-correctness + operational-feasibility nêu tautology cụ thể còn sót ở UX1-đỏ1 và thiếu mutant cô lập cho checks.b/UX3b, spec-alignment vẫn PASS) → verdict PENDING-JUDGMENT; scope-triage: 4 finding trong hợp đồng (đều AC-6, cùng lớp tautology/thiếu-mutant-cô-lập) + 6 finding ngoài hợp đồng nghiêm trọng (thẻ Cổng 2 lệch verdict thật, evidence E1-E4 dán nhầm output tính năng khác, verified_commit đã cũ hơn commit sửa vật được đo) — người quyết ở Gate 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
