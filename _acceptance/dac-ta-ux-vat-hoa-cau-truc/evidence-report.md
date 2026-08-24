---
schema_version: 2
feature_slug: dac-ta-ux-vat-hoa-cau-truc
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3c63678142000a061fb42b1fbb4d89bbf44f7404
human_signoff:
---

# Evidence Report: dac-ta-ux-vat-hoa-cau-truc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | UNCERTAIN |
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
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E5
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  rationale: 2/3 lens UNCERTAIN, 1/3 PASS. Cả ba lens đồng thuận thang 2 nấc (câu 1) và ngưỡng "≥2 khuôn khả dĩ mới tra" (câu 3) khớp nguyên văn giữa SKILL.md và ux-spec-template.md, không ép công cụ nào. Điểm chia rẽ là câu (2): domain-correctness và spec-alignment không tìm được câu nào trong SKILL.md xác nhận riêng cờ W8d (căn cứ trống ở mục 6) thực sự hiện trên thẻ Cổng 1 — chỉ có câu chung "cánh W8 ... khớp vòng hai chiều tại thẻ Cổng 1 (ADVISORY)" đặt trong ngữ cảnh design_doc/states (W8b/c); operational-feasibility coi câu chung đó đủ bao trùm cả W8d nên chấm PASS.
  votes:
    - domain-correctness: UNCERTAIN — (1) và (3) đạt: thang 2 nấc dạy khớp nhau ở cả hai file, "vd MCP Mobbin" chỉ là ví dụ không ép công cụ, ngưỡng ≥2 khuôn khả dĩ đủ cụ thể để không chặn luồng hiển nhiên. Nhưng (2) trong hai file được cấp, câu duy nhất nói cờ hiện ở thẻ Cổng 1 nằm ngay sau đoạn nói về dây design_doc/states — tức ngữ cảnh W8b/W8c — chứ KHÔNG nhắc riêng W8d. ux-spec-template.md định nghĩa "Dòng này TRỐNG = máy đoán chay, cờ W8d" nhưng không nói cờ đó có lên thẻ Cổng 1 hay không. Cơ chế "người đọc thẻ Cổng Phạm vi nhìn thấy máy đoán chay" cho riêng mục Khuôn IA không được xác nhận rõ trong phạm vi hai file này.
    - operational-feasibility: PASS — (1) Thang 2 nấc khớp gần như nguyên văn giữa ux-spec-template.md dòng 64 và SKILL.md dòng 92, cả hai dùng "vd MCP Mobbin" như ví dụ và SKILL.md nói thẳng "không phụ thuộc công cụ nào". (2) Cơ chế nhìn-thấy có thật: template ghi rõ "Dòng này TRỐNG = máy đoán chay, cờ W8d", SKILL.md corroborate cánh W8 được "soi khớp vòng hai chiều tại thẻ Cổng 1 (ADVISORY)" — căn cứ trống không tự do lọt qua âm thầm; lưu ý đoạn S1#4 chỉ tự gọi tên cơ chế theo dây design_doc/states (ứng W8b/W8c) chứ không tự nêu tên "W8d", nên người chỉ đọc SKILL.md sẽ không thấy tên cờ W8d bằng chữ, nhưng cơ chế chung "cánh W8 hiện ở thẻ" vẫn bao trùm nó theo cách đọc rộng. (3) Ngưỡng ≥2 khuôn khả dĩ định lượng rõ, lặp lại giống nhau ở cả hai file.
    - spec-alignment: UNCERTAIN — (1) và (3) khớp nguyên văn giữa hai file, ngưỡng ≥2 khuôn khả dĩ đủ rõ để luồng hiển nhiên không bị chặn. (2) không xác lập được: ux-spec-template.md tuyên "Dòng này TRỐNG = máy đoán chay, cờ W8d", nhưng câu duy nhất trong SKILL.md mô tả cơ chế hiện ở thẻ Cổng 1 chỉ nói "cánh W8 của eval-coverage-lint soi khớp vòng hai chiều tại thẻ Cổng 1 (ADVISORY)" — mô tả khớp states khai/đo (W8b/c), không nhắc riêng W8d hay xác nhận cờ đoán-chay của mục Khuôn IA có thực sự trồi lên thẻ hay không.
  required_evidence:
    - "[domain-correctness] SKILL.md thiếu một câu nêu rõ cờ W8d (căn cứ trống ở mục 'Khuôn IA đã chọn + căn cứ') cũng hiện trên thẻ Cổng 1 — hiện chỉ có câu chung 'cánh W8 ... tại thẻ Cổng 1 (ADVISORY)' đặt cạnh đoạn nói về dây design_doc/states (ngữ cảnh W8b/c). Cần thêm một dòng dạng 'thẻ Cổng 1 hiện đủ cờ W8a-d, gồm W8d khi mục Khuôn IA để trống' ngay tại S1#4 hoặc đoạn Gate 1 của feature-loop/skills/feature-loop/SKILL.md — nếu dòng này có mặt, verdict đổi thành PASS cho câu hỏi (2)."
    - "[spec-alignment] Đoạn văn trong feature-loop SKILL.md (hoặc mẫu thẻ Gate 1 do skill acceptance-card sinh ra) nêu RÕ tên W8d và xác nhận cờ «khuôn IA chưa có căn cứ» xuất hiện trên thẻ Cổng 1 — hiện S1 chỉ nói chung «cánh W8... khớp vòng hai chiều», không có chữ W8d nào trong toàn bộ SKILL.md (kiểm bằng `grep -n W8d feature-loop/skills/feature-loop/SKILL.md`, hiện ra rỗng)."
    - "[spec-alignment] Một bản demo/output thật của acceptance-card khi mục «Căn cứ» trong design-doc bị để trống, cho thấy dòng cờ W8d hiển thị trên thẻ — vd chạy scripts/eval-coverage-lint.js trên một design-doc có Căn cứ rỗng rồi xem card render, để xác nhận cờ có tới tay người đọc chứ không chỉ nằm trong JSON nội bộ."
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E6
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E7
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E8
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E9
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E10
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: FAIL
  rationale: 3/3 lens FAIL. Round này review-findings phơi ra ba hình dạng cụ thể của lớp "assertion âm-tính-một-mình / phép đo mới chưa phá thử" bên trong chính bộ test đang được E11 giao phải chứng minh sạch: UX3 (ux-spec.test.mjs) khai 5 mệnh đề nhưng checks.a2 và checks.d không có mutant nào lật được trong file; UX1 và UX4 gắn nhãn "chiều đỏ" cho các assertion mà mutation và assertion là cùng một thao tác chuỗi (tautology, không thể đỏ); và các cánh W8A/W8B/W8C/W8P (run-tests.sh) không chạy đối chứng dương trên CHÍNH instance vừa bị mutate trước khi tiêm lỗi, trái với header comment tự tuyên "Mỗi cánh: cặp hai chiều CÙNG fixture" của chính file đó. Cả ba lens đều xác nhận độc lập bằng cách chạy lại đúng biểu thức/mutant liên quan.
  votes:
    - domain-correctness: FAIL — Cả 4 câu hỏi hẹp đều SẠCH ở W8A–W8P/W8L/W8F và UX1/UX2/UX4 (mọi fixture rút từ ux-spec-template.md thật, mọi check() kèm case-message, mọi nhánh đỏ có mutation thật). Nhưng UX3 (ux-spec.test.mjs dòng 105-145) tự tuyên "Nay mỗi mệnh đề có mutant riêng" rồi không giữ lời: checks.d không có bất kỳ mutant nào trong file khiến nó lật false (đã chạy lại chính hai mutant mutA/mutC trong node — d(s)=d(mutA)=d(mutC)=true), và checks.a2 chỉ được assert ở chiều dương (dòng 142), không có dòng đỏ nào dù mutA tình cờ đã lật nó false — không có ca cô lập lớp cho hai mệnh đề này, vi phạm đúng bất biến "Thước phải gắn vào vật được giao" của kit.
    - operational-feasibility: FAIL — Trong run-tests.sh, header comment dòng 1102 tuyên "Mỗi cánh: cặp hai chiều CÙNG fixture + thông điệp ghim" nhưng 5 cánh (W8B, W8C, W8A-1/2/3, W8P — dòng 1126-1159) chỉ dựng MỘT fixture rồi tiêm lỗi ngay, không chạy lint trên bản CHƯA tiêm để xác nhận 0-cờ trước — khác pattern chuẩn mà chính file dùng ở W8O/W8G/W8L/W8D (đều mutate + kiểm trên CÙNG một thư mục, sạch rồi mới đỏ). Thông điệp vẫn ghim chuỗi ở mọi cánh nên không phải "assertion âm tính một mình" tuyệt đối, nhưng thiếu đúng "đối chứng dương cùng fixture" mà câu hỏi hỏi. Thêm: ux-spec.test.mjs UX3 khai 5 mệnh đề nhưng chỉ tạo mutant đỏ cho a, b, c — a2 và d chưa từng được chứng minh có thể fail.
    - spec-alignment: FAIL — Header comment dòng 1102 tuyên "Mỗi cánh: cặp hai chiều CÙNG fixture + thông điệp ghim" nhưng các cánh W8A (1139-1151), W8B (1126-1131), W8C (1133-1137) và W8P (1153-1159) không giữ đúng lời hứa: mỗi cánh tạo MỘT thư mục tmp mới rồi mutate ngay, không kiểm bản-nguyên-vẹn-của-CHÍNH-instance-đó trước khi mutate — khác hẳn W8O/W8G/W8L/W8D và cặp L35/L35b (đều mutate tại chỗ trên CÙNG một thư mục đã in-place). Về hai tiêu chí còn lại (fixture viết tay, message chỉ kiểm exit code) không thấy vi phạm — mọi states đều rút từ design.md thật, mọi chiều đỏ đều ghim chuỗi cụ thể.
  required_evidence:
    - "[domain-correctness] tests/plugins/ux-spec.test.mjs dòng 113-127 (định nghĩa checks.a2, checks.d) + dòng 142-145 (toàn bộ assertion UX3): checks.d chỉ xuất hiện trong vòng lặp dương ở dòng 142, không có dòng đỏ nào dạng ok(!checks.d(...)); nếu thêm một assertion đỏ cho 'd' (và cho 'a2') thì verdict đổi."
    - "[domain-correctness] Lệnh tái lập: node -e (đọc SKILL.md, tính lại mutA/mutC y hệt file test, gọi checks.d và checks.a2 trên s/mutA/mutC) — cho kết quả d(s)=d(mutA)=d(mutC)=true (không mutant nào trong file lật được checks.d), và a2(mutA)=false NHƯNG không có assertion nào trong ux-spec.test.mjs kiểm tra điều này."
    - "[domain-correctness] Đối chiếu comment tự khai tại ux-spec.test.mjs dòng 107-108: 'Nay mỗi mệnh đề có mutant riêng...' — lời tuyên này không đúng cho khoá 'd' và chỉ đúng-nhưng-chưa-được-assert cho khoá 'a2'."
    - "[operational-feasibility] Đọc tests/scripts/run-tests.sh dòng 1126-1131 (cánh [W8B]): chỉ có RUXB=mk_ux_fixture rồi sed xoá state ngay, không có lệnh node \"$LINT\" \"$RUXB\" nào chạy TRƯỚC khi sed — nếu thêm dòng đó (giống mẫu outO/outO2 ở dòng 1164+1167) thì verdict đổi."
    - "[operational-feasibility] Đọc tests/scripts/run-tests.sh dòng 1133-1137 ([W8C]), 1139-1151 ([W8A]-1/2/3), 1153-1159 ([W8P]): cùng hình dạng — không baseline riêng trên chính thư mục đó; đối chiếu dòng 1161-1177 (W8O, W8G) và 1179-1194 (W8L) nơi lint được gọi 2 lần trên CÙNG thư mục."
    - "[operational-feasibility] Đọc tests/plugins/ux-spec.test.mjs dòng 113-145: object checks có 5 khoá (a, a2, b, c, d), vòng lặp dòng 142 chỉ chạy chiều dương cho cả 5; dòng 143-145 chỉ gọi phủ định cho a, b, c — không có phủ định cho a2 hay d."
    - "[spec-alignment] tests/scripts/run-tests.sh dòng 1102: đọc lại chuỗi 'Mỗi cánh: cặp hai chiều CÙNG fixture' — nếu owner xác nhận comment này chỉ áp cho một phần cánh (không phải MỌI cánh W8) thì verdict đổi thành PASS."
    - "[spec-alignment] tests/scripts/run-tests.sh dòng 1126-1131 (W8B) và 1133-1137 (W8C): thêm một dòng check exit0/0-cờ trên CHÍNH $RUXB/$RUXC trước khi sed mutate — nếu thêm rồi chạy bash tests/scripts/run-tests.sh vẫn xanh thì cần đối chiếu lại."
    - "[spec-alignment] tests/scripts/run-tests.sh dòng 1139-1151 (W8A-1/2/3) và 1153-1159 (W8P): so sánh với khuôn in-place mutation của W8O (1161-1168) — chạy lint trên $RUXA1/$RUXA2/$RUXA3/$RUXP TRƯỚC khi sed/rm để xác nhận từng instance riêng thật sự xanh trước khi tin bản mutate là đỏ."
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E12
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E13
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

- eval: E14
  run_id: minted-dac-ta-ux-vat-hoa-cau-truc-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-24T04:32:10Z
  output: |
    PASS: ARM13-mut

    Results: 780 passed, 0 failed

## Analyst

E1, E2, E3, E4, E6, E7, E8, E9, E10, E12, E13, E14 — mọi eval máy trong round này (kể cả E13/E14 mới thêm cho AC-12/AC-13) đều `baseline: green` (pass trên CẢ HEAD lẫn diffBase) ở cấp exit-code toàn suite. Đây là kết quả chạy CẢ SUITE (780+ case, đa số không liên quan tới feature này) nên non-discriminating ở mức suite là kỳ vọng bình thường, không kết luận riêng từng case UX1-UX4/W8* có discriminating hay không từ con số này — xem review-findings.md để biết case cụ thể nào đã/chưa được chứng minh phân biệt bằng mutation nội bộ. `bash tests/hooks/run-tests.sh`, `bash tests/workflows/run-tests.sh` và `node scripts/product-map.mjs --check` chạy sạch cả hai phía và không gắn với eval id nào (regression-guard bình thường), không liệt kê ở đây.

## Variance

none — mọi eval máy trong round này là deterministic (0/1 hoặc 1/1), không eval nào có `runs` > 1.

## Iterations

Round 1: E1–E4 (bash tests/plugins/run-tests.sh) và E6–E10, E12 (bash tests/scripts/run-tests.sh) đều PASS trên HEAD, exit 0, baseline green (non-discriminating ở cấp suite). E5 (AC-5, judgment) ra UNCERTAIN — panel 3 lens đồng thuận thiếu bằng chứng cờ W8d có thực sự hiện trên thẻ Cổng 1. E11 (AC-11, judgment) ra PASS — panel 3 lens đồng thuận mọi cánh W8/UX có fixture code-sinh + thông điệp ghim + đối chứng dương/đỏ đủ tin cậy. Verdict: PENDING-JUDGMENT.
Round 2: E1–E4, E6–E10, E12 vẫn PASS; thêm E13 (AC-12), E14 (AC-13) cũng PASS, tất cả baseline green. E5 vẫn UNCERTAIN (2/3 lens, cùng lỗ hổng bằng chứng chưa được vá). E11 lật từ PASS sang FAIL — round này review-findings phơi ra checks.a2/checks.d (UX3) không có mutant, chiều đỏ UX1/UX4 là tautology (mutation và assertion là cùng một thao tác chuỗi), và các cánh W8A/W8B/W8C/W8P thiếu đối chứng dương trên chính instance bị mutate — đúng lớp "assertion âm-tính-một-mình" mà CLAUDE.md của kit cấm. Verdict: REJECT.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter