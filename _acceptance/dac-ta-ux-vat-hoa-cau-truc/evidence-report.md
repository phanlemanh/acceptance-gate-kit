---
schema_version: 2
feature_slug: dac-ta-ux-vat-hoa-cau-truc
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a55215eaded0e80bd2f4eb19ed8267a36ea120a6
human_signoff:
---

# Evidence Report: dac-ta-ux-vat-hoa-cau-truc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | judgment | FAIL |
| E12 | AC-5 | test | PASS |
| E13 | AC-12 | test | PASS |
| E14 | AC-13 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E1-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
    PASS: [BDK3] ổ cắm 4 hình dạng đúng + fallback không chặn · §9.1 TRỪ có dấu vết, ổ cắm giữ nguyên · câu phủ định nằm trong lối (a)
    PASS: [BDK4] ba thân cổng in bước kế (S2 · S5 · hai lệnh ký), hai ngả Vòng TRAO, vũ trụ quét giữ 16
    Results: all plugin tests passed

- eval: E2
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E2-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
    PASS: [BDK3] ổ cắm 4 hình dạng đúng + fallback không chặn · §9.1 TRỪ có dấu vết, ổ cắm giữ nguyên · câu phủ định nằm trong lối (a)
    PASS: [BDK4] ba thân cổng in bước kế (S2 · S5 · hai lệnh ký), hai ngả Vòng TRAO, vũ trụ quét giữ 16
    Results: all plugin tests passed

- eval: E3
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E3-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
    PASS: [BDK3] ổ cắm 4 hình dạng đúng + fallback không chặn · §9.1 TRỪ có dấu vết, ổ cắm giữ nguyên · câu phủ định nằm trong lối (a)
    PASS: [BDK4] ba thân cổng in bước kế (S2 · S5 · hai lệnh ký), hai ngả Vòng TRAO, vũ trụ quét giữ 16
    Results: all plugin tests passed

- eval: E4
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E4-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
    PASS: [BDK3] ổ cắm 4 hình dạng đúng + fallback không chặn · §9.1 TRỪ có dấu vết, ổ cắm giữ nguyên · câu phủ định nằm trong lối (a)
    PASS: [BDK4] ba thân cổng in bước kế (S2 · S5 · hai lệnh ký), hai ngả Vòng TRAO, vũ trụ quét giữ 16
    Results: all plugin tests passed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E5
  run_id: dac-ta-ux-vat-hoa-cau-truc-E5-r4-judge
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verifier: judge panel (fresh-context, 3 lens)
  verdict: PASS
  verified_at: 2026-08-24T09:40:00+07:00
  rationale: |
    Panel nhất trí PASS (3/3 lens). Cả hai file (SKILL.md, ux-spec-template.md)
    dạy khớp nhau thang 2 nấc: (i) có công cụ tra mẫu → tra + ghi vết; (ii)
    không có → chọn từ danh sách khuôn IA có tên + ghi lý do. Cờ căn cứ-trống
    (W8d) hiện trên thẻ Cổng 1 dưới dạng ADVISORY.
  votes:
    - domain-correctness: PASS — Cả hai file mô tả khớp nhau: thang 2 nấc (i)
      có công cụ tra mẫu → tra + ghi vết «đã xem gì/rút gì», (ii) không có →
      chọn từ danh sách khuôn IA có tên + ghi lý do — nấc (ii) không đòi hỏi
      công cụ nào nên không tạo phụ thuộc cứng, và MCP Mobbin chỉ là ví dụ
      ("vd") chứ không phải điều kiện bắt buộc. SKILL.md nói rõ "cờ W8d...
      mọi cờ hiện tại thẻ Cổng 1 (ADVISORY)" nên căn cứ trống là NHÌN THẤY
      được trên thẻ cổng, không âm thầm lọt. Luật "CHỈ tra khi không tự chắc
      (≥2 khuôn khả dĩ) — luồng hiển nhiên thì ghi thẳng lý do" cho tiêu chí
      cụ thể để phân biệt, tránh thành trạm thu phí cho luồng hiển nhiên.
    - operational-feasibility: PASS — Cả hai file dạy nhất quán thang 2 nấc:
      (i) có công cụ tra mẫu (vd MCP Mobbin) → tra + ghi vết 1 dòng; (ii)
      không có → chọn từ danh sách khuôn IA có tên + ghi lý do — cả hai chỗ
      đều ghi rõ "không phụ thuộc công cụ nào" nên không tạo hard-dependency.
      Luật "CHỈ tra khi không tự chắc (≥2 khuôn khả dĩ) — luồng hiển nhiên
      thì ghi thẳng lý do / không tra" xuất hiện y hệt ở cả template lẫn
      SKILL.md, đủ rõ để loại trừ việc luồng hiển nhiên vẫn phải tra. Căn cứ
      trống được khai là cờ đoán-chay W8d và SKILL.md xác nhận "mọi cờ hiện
      tại thẻ Cổng 1 (ADVISORY)" — tức người đọc thẻ cổng (Cổng Phạm vi/Gate
      1, nơi trình "sẽ làm/sẽ KHÔNG làm") nhìn thấy được cờ này.
    - spec-alignment: PASS — (1) ux-spec-template.md mục 6 và SKILL.md S1#4
      dạy thang 2 nấc khớp nhau chữ-với-chữ: nấc (i) "có công cụ tra mẫu thị
      trường (vd MCP Mobbin)", nấc (ii) không có → chọn từ danh sách đóng
      ghi lý do; SKILL.md còn nói thẳng "không phụ thuộc công cụ nào" —
      Mobbin chỉ là ví dụ (vd), không phải điều kiện bắt buộc. (2) SKILL.md
      ghi rõ "cờ đoán-chay (W8d: mục Khuôn IA có mà căn cứ trống) — mọi cờ
      hiện tại thẻ Cổng 1 (ADVISORY)", tức khi căn cứ trống thì cờ W8d hiện
      trên thẻ Cổng 1 (Cổng Phạm vi) cho người đọc thấy, không âm thầm trôi
      qua. (3) Cả hai file định nghĩa "không tự chắc" bằng ngưỡng cụ thể "≥2
      khuôn khả dĩ" và có lối thoát tường minh "luồng hiển nhiên thì ghi
      thẳng lý do" / "luồng hiển nhiên không tra" — đủ rõ để luồng hiển
      nhiên không bị bắt tra, tránh trạm thu phí.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E6
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E6-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E7
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E7-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E8
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E8-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E9
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E9-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E10
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E10-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E11
  run_id: dac-ta-ux-vat-hoa-cau-truc-E11-r4-judge
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verifier: judge panel (fresh-context, 3 lens)
  verdict: FAIL
  verified_at: 2026-08-24T09:40:00+07:00
  rationale: |
    Panel chia phiếu 2 FAIL / 1 PASS (proposal: FAIL). domain-correctness cho
    PASS vì mọi fixture design-doc rút từ khuôn thật qua marker và mọi cánh
    đỏ đi qua reader thật với thông điệp ghim. operational-feasibility và
    spec-alignment cho FAIL vì bảy cánh trong tests/scripts/run-tests.sh
    (W8B, W8C, W8A-1..4, W8P) chỉ chạy lint SAU khi mutate fixture — không có
    lệnh lint trên CHÍNH fixture đó TRƯỚC mutate để chứng minh bản nguyên vẹn
    XANH — đúng lớp "assertion âm-tính-một-mình" mà CLAUDE.md cấm; và ba
    trong số đó (W8A-3, W8P, W8D-msg) ghim bằng pattern hai-mảnh thay vì một
    chuỗi cảnh báo liền, có thể thoả bởi văn bản không liên quan.
  votes:
    - domain-correctness: PASS — Rà cả 4 lớp lỗi (âm-tính-một-mình,
      fixture viết-tay-theo-khuôn-đọc, ghim-bị-thoả-bởi-chú-giải, tautology)
      trên UX1–UX4 và W8A/B/C/P/O/G/D/L-o1..o7/N/F (W8W không tồn tại trong
      file): mọi fixture design-doc đều rút từ ux-spec-template.md qua
      marker thật (uxSection/ux_section), mọi cánh red đi qua reader thật
      (eval-coverage-lint.js) và ghim nguyên câu message chứ không chỉ mã
      thoát; các cánh chỉ-âm-tính (W8O, W8G, W8F, W8N) đều có kèm nhánh
      «sống» đảo ngược để chứng minh luật không câm vĩnh viễn; W8D còn có
      case decoy chuyên trị đúng lớp lỗi "chú giải giả làm căn cứ thật" (r2
      regression) và W8L-o5 chuyên trị lớp "chuỗi trong thân block scalar bị
      hiểu nhầm là khai báo". Điểm duy nhất mấp mé là vài check trong UX3
      (checks.c, checks.a2) và UX4 (mienKhop) dùng canary chuỗi-nguyên-văn
      nơi mutation xoá đúng chuỗi assertion tìm — nhưng đây là cách hợp lý
      để kiểm văn bản hướng dẫn SKILL.md/khuôn (không có reader mã nào khác
      để đi qua), không phải tautology theo nghĩa mutation=assertion cùng
      một phép tính nội tại.
    - operational-feasibility: FAIL — Nhiều cánh W8 trong
      tests/scripts/run-tests.sh (W8A-1..4, W8B, W8C, W8P) chỉ chạy lint SAU
      khi đã mutate fixture — không có lệnh lint kiểm "0 cờ" trên CHÍNH
      instance đó TRƯỚC mutation — nên đây là assertion âm tính một mình
      trên từng cánh, dù file có ghi rõ ý định "cặp hai chiều CÙNG fixture".
      Ba cánh (W8A-3, W8P, W8D-msg) ghim thông điệp bằng pattern hai-mảnh
      `*"A"*"B"*` thay vì một chuỗi literal như các cánh chị em, nên có thể
      thoả bởi hai đoạn text không liền nhau/không cùng một dòng cảnh báo
      thật.
      required_evidence:
        - tests/scripts/run-tests.sh dòng 1126-1131 (W8B) và 1133-1137
          (W8C): thêm một lệnh `node "$LINT" "$RUXB"`/`"$RUXC"` NGAY SAU
          mk_ux_fixture, TRƯỚC dòng sed mutate, rồi assert output đó không
          chứa W8 — nếu thêm được và nó xanh thật, verdict đổi thành PASS
          cho hai cánh này (hiện thiếu bước đó, khác hẳn khuôn W8O/W8G/W8D
          đã làm đúng ở dòng 1166-1182, 1239-1247)
        - tests/scripts/run-tests.sh dòng 1139-1156 (W8A-1..4) và
          1158-1164 (W8P): tương tự, thêm lệnh lint trên fixture
          RUXA1..RUXA4/RUXP TRƯỚC khi sed mutate, ghim rằng bản chưa mutate
          0-cờ W8 — thiếu bước này thì không phân biệt được "mutation thật
          sự gây cờ" với "mk_ux_fixture lần này vô tình đã sinh ra bản luôn
          luôn đỏ"
        - tests/scripts/run-tests.sh dòng 1150-1151 (case "$outA3" in
          *"W8a"*"UX-STATE-TABLE"*), dòng 1162-1163 (case "$outP" in
          *"không parse được"*"ST-hong"*), dòng 1246-1247 (case "$outD" in
          *"W8d"*"chưa có căn cứ"*): đổi sang chuỗi literal đầy đủ một dòng
          cảnh báo (như cách W8A-1/W8A-2/W8C đã làm ở dòng 1143, 1147,
          1137) — nếu đổi được và test vẫn xanh thì ghim mới chặt hơn,
          chứng minh pin cũ có thể thoả bởi hai mảnh text rời nhau chứ
          không phải một cảnh báo thật
    - spec-alignment: FAIL — Bảy cánh W8B, W8C, W8A-1..4, W8P
      (tests/scripts/run-tests.sh dòng 1127–1163) dựng fixture bằng
      mk_ux_fixture rồi sed-mutate và CHỈ gọi `node "$LINT"` một lần — sau
      mutate — không có lệnh gọi LINT nào trên CHÍNH thư mục đó trước khi
      sed sửa để chứng minh bản nguyên vẹn XANH; đây đúng dạng
      "assertion âm-tính-một-mình" mà CLAUDE.md cấm. Ngược lại, W8O/W8G/
      W8N/W8D/W8F2 (dòng 1166–1249) làm ĐÚNG luật: gọi LINT hai lần trên
      CÙNG thư mục (trước mutate → quiet, sau mutate → cờ), cho thấy tác
      giả biết khuôn nhưng áp dụng không đều — đây là khoảng trống thật,
      không phải suy diễn.
      required_evidence:
        - Chèn một dòng `node "$LINT" "$RUXB" 2>&1` (kiểm exit 0, không cờ
          W8) NGAY SAU dòng 1127 (`RUXB=... mk_ux_fixture "$RUXB"`) và
          TRƯỚC dòng 1129 (sed mutate) trong tests/scripts/run-tests.sh —
          nếu có bước đối-chứng-dương-trên-chính-thư-mục này (như W8O dòng
          1166-1170 đã làm) thì cánh W8B đổi từ âm-tính-một-mình sang cặp
          hai chiều hợp luật.
        - Tương tự cho W8C (dòng 1134-1135), W8A-1..4 (dòng 1140-1155) và
          W8P (dòng 1159-1163): mỗi cánh cần một lệnh `node "$LINT" "$RUXX"`
          chạy TRÊN CHÍNH thư mục đó trước khi sed/rm mutate, ghim rõ exit 0
          + không cờ W8 — thiếu bước này ở bất cứ cánh nào trong bảy cánh
          trên thì verdict vẫn FAIL cho cánh đó.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E12
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E12-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E13
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E13-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

- eval: E14
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E14-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T09:40:00+07:00
  output: |
      PASS: ARM13-mut

    Results: 788 passed, 0 failed

## Analyst

E1, E2, E3, E4 (bash tests/plugins/run-tests.sh) và E6, E7, E8, E9, E10,
E12, E13, E14 (bash tests/scripts/run-tests.sh) — xanh trên cả HEAD lẫn
baseline (diffBase); nên viết lại để assert hành vi mới hoặc xác nhận là
regression-guard có chủ ý.

## Variance

none — không eval nào có runs > 1 trong vòng này.

## Iterations

Round 3: review-findings.md nêu đúng lớp "Hình dạng 4" (assertion khớp vào
dòng chú giải luôn-in thay vì thông điệp ghim của đúng cánh) tại
`[W8A]-1` — bản vá chỉ sửa case bị nêu tên (`[W8A]-1` + `UX1-đỏ`), không quét
cả file theo LỚP.
Round 4: E11 (adversarial-verify judgment) — panel 2/3 FAIL: vá round 3 chưa
quét hết lớp, còn tồn `[W8A]-3`, `[W8A]-4-msg` khớp dòng chú giải, `[W8D]`
decoy đặt sai phía (không đo được cửa chống-nhiễu), và bảy cánh
W8B/W8C/W8A-1..4/W8P thiếu đối chứng dương trên chính fixture trước khi
mutate. review-findings.md round 4 còn thêm ca ngoài-hợp-đồng: bảng
UX-STATE-TABLE rỗng đi qua sạch (0 cờ), W8d tắt được bằng cách xoá trọn mục
6. Verdict REJECT — trả về implementation, sửa theo LỚP không theo case nêu
tên.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
