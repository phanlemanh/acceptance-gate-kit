---
schema_version: 2
feature_slug: ho-so-nghi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 881e54ec4d77bb5a8cb21404006bac07c4245a75
human_signoff:
---

# Evidence Report: ho-so-nghi

Round 1 chạy trên `881e54ec4d77bb5a8cb21404006bac07c4245a75`. Mười eval máy (E1–E7, E9–E11) đều exit 0 — `node tests/scripts/ho-so-nghi.test.mjs` (29 passed, 0 failed) và `node scripts/product-map.mjs --root . --check` — và bốn suite hồi quy (scripts/hooks/plugins/workflows) đều xanh. Judge panel E8 (AC-8, GUIDE «Cho một hồ sơ nghỉ») không đồng thuận: domain-correctness và spec-alignment PASS, operational-feasibility FAIL vì GUIDE/thẻ không cảnh báo recipe vô tác dụng trên một kho pin kit < 2.17.0 — item này còn UNCERTAIN, chờ Gate 2. Review round này tìm 15 finding: 6 map được vào hợp đồng (AC-2, AC-5 ×2, AC-6, AC-10) — phần lớn là assertion-âm-tính-một-mình và đo-chỉ-dẫn-thay-vì-đầu-ra khiến các ca HSN liên quan chưa thật sự verify đúng Then mà AC hứa, cộng một khoảng trống thật (`product-map.mjs` chưa được dạy nhận biết `hoSoNghi`, xếp cùng một hồ sơ nghỉ khác ô với `start-scan.mjs`). Vì vậy dù mọi lệnh máy thoát 0, verdict round này là REJECT — trả lại implementation theo 6 finding trong hợp đồng (xem `review-findings.md`, mục "Trong hợp đồng"); 9 finding còn lại nằm ngoài phạm vi đã duyệt, chờ người quyết ở Gate 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | UNCERTAIN |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-nghi-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:00Z
  note: đầu ra máy trả về chỉ có tail chung của cả lệnh (E1–E7, E9, E11 đều chạy chung một lượt `node tests/scripts/ho-so-nghi.test.mjs`); log không tách riêng dòng PASS theo từng HSN, nên output dưới đây là tail thật của cả lượt chạy, không phải dòng PASS riêng của HSN0/HSN1.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E2
  run_id: minted-ho-so-nghi-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:05Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E3
  run_id: minted-ho-so-nghi-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:10Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E4
  run_id: minted-ho-so-nghi-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:15Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E5
  run_id: minted-ho-so-nghi-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:20Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1. Xem thêm review-findings.md finding t12: bộ kiểm HSN5 không hề gọi `scripts/product-map.mjs`, nên phần bản đồ mà AC-5 hứa không được đo trong lượt này.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E6
  run_id: minted-ho-so-nghi-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:25Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — dòng PASS: HSN7 dưới đây chính là dòng của HSN7 mà E6 hứa đo. Xem review-findings.md finding t10 — chân "thẻ" và "cổng"/"kiểm-lại" của ca này là assertion vắng-mặt-một-mình, không ghim thông điệp.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E7
  run_id: minted-ho-so-nghi-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:30Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E9
  run_id: minted-ho-so-nghi-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:35Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1. Xem review-findings.md finding t14/t15 — đối chứng và tập so sánh của HSN9 dùng hằng số/grep văn bản thay vì rút qua git hoặc chạy bản cũ.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E10
  run_id: minted-ho-so-nghi-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-19T11:06:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E11
  run_id: minted-ho-so-nghi-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T11:05:40Z
  note: tail chung của cùng lượt chạy `node tests/scripts/ho-so-nghi.test.mjs` — xem note ở E1. Xem review-findings.md finding t13 — ca HSN10 không gọi bộ đọc thứ tư (thẻ), nên vế "cả bốn bộ đọc" của AC-10 chưa được verify trọn vẹn.
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá

    Results: 29 passed, 0 failed (ho-so-nghi)

- eval: E8
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verdict: UNCERTAIN
  votes:
    - domain-correctness: PASS — Mục GUIDE nêu rõ vấn đề (chữ ký cũ hứa điều không kiểm lại được), nói thẳng lối ra KHÔNG phải sửa chữ ký ("chữ ký là sử liệu"), cho khối lệnh chạy tại gốc kho với 4 chỗ cần điền cụ thể, và liệt kê hệ quả (lưới ngưng chấm ba luật, contract/evidence-report/run-log không đổi byte, thẻ/bản đồ đổi nhãn). Dòng thẻ Cổng Bằng chứng ("Hồ sơ đã nghỉ — {by} {ngày}: {lý do}. Chữ ký giữ làm sử liệu, không mời ký lại.") khớp đúng và củng cố lại đúng câu "không sửa chữ ký cũ" của GUIDE. Đối chiếu với spec thiết kế (mục 4 bảng ba bộ đọc, mục 6 bất biến, mục 7 ma trận HSN0–HSN10), mọi phát biểu trong GUIDE đều nằm trong phạm vi đã có ca đo tương ứng — không thấy lời hứa nào trong đoạn GUIDE mà spec liệt kê ở "Ngoài phạm vi" (mục 9) lại bị GUIDE ngầm hứa.
    - operational-feasibility: FAIL — Mục GUIDE «Cho một hồ sơ nghỉ» tự nó đọc rõ: chạy recipe ở gốc kho, ba luật thôi chấm, ba tệp đã ký không đổi byte nào, và dòng thẻ khớp đúng lời hứa đó ("Chữ ký giữ làm sử liệu, không mời ký lại") — không có khoảng trống nào giữa lời hứa và cái thẻ in ra. Nhưng cả mục GUIDE lẫn dòng thẻ đều không nói cho người đọc biết recipe chỉ có tác dụng NẾU repo của họ đã pin kit ≥2.17.0 — chính bản thiết kế xác nhận repo chưa lên 2.17.0 thì "bộ đọc cũ bỏ qua" dòng nghỉ, tức người chạy xong recipe vẫn bị cổng chặn y như cũ mà không biết vì sao. Đây đúng là tình huống người trong câu hỏi (kho tiêu thụ có hồ sơ chết tiền đề) — và hồ sơ gốc dẫn tới tính năng này (OneFlow) khi báo cáo còn đang ở kit 2.16.0, tức đúng nhóm người có nguy cơ dính gap này đầu tiên.
      required_evidence:
        - "GUIDE.md dòng 609-644 (mục «Cho một hồ sơ nghỉ»): đọc toàn bộ đoạn — không có câu nào nhắc kiểm tra hay yêu cầu pin kit ≥2.17.0 trước khi chạy recipe; nếu thêm một câu điều kiện tiên quyết kiểu 'xác nhận repo đã pin kit ≥2.17.0, nếu chưa hãy update trước' thì verdict đổi thành PASS."
        - "docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md §5 dòng 'Kho tiêu thụ chưa nhận 2.17.0: dòng nghỉ là một dòng JSON trong sổ, bộ đọc cũ bỏ qua.' — xác nhận recipe là no-op im lặng trên pin cũ, đúng khoảng trống nêu trên."
        - "docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md dòng 4 (Gốc): 'OneFlow/_acceptance/normalize-text-vi (owner 17/09) · kit release-2-16-0 (14/72 đỏ)' — ca thật khởi phát tính năng này chính là một kho đang ở pin trước 2.17.0, tức persona trong câu hỏi rất có thể rơi đúng vào lỗ chưa được cảnh báo."
    - spec-alignment: PASS — Mục "Cho một hồ sơ nghỉ" (GUIDE.md dòng 609-644) nêu đúng kịch bản (kho nguồn phần phụ thuộc biến mất), cho lệnh chạy tại gốc kho với 4 chỗ điền, nói rõ hệ quả (lưới thôi chấm ba luật) và khai rõ điều KHÔNG đổi ("contract.md, evidence-report.md, run-log.jsonl không đổi một byte" + chữ ký giữ làm sử liệu) — đủ để quyết trong một phút mà không cần đọc mã. Dòng thẻ gate-card.js (`Hồ sơ đã nghỉ — … Chữ ký giữ làm sử liệu, không mời ký lại`) khớp đúng lời hứa đó. Đoạn "Giới hạn đã khai" tự khai phần chưa làm (khoá chống máy tự gọi) là việc vòng sau, không phải lời hứa bị bỏ sót — không thấy lời hứa nào vượt phạm vi đo của vòng này trong ba file được cấp.
  rationale: Panel không đồng nhất — domain-correctness và spec-alignment cho PASS dựa trên việc GUIDE nêu đúng kịch bản, lệnh bấm được, hệ quả rõ và dòng thẻ khớp đúng lời hứa "chữ ký là sử liệu"; operational-feasibility cho FAIL vì cả GUIDE lẫn dòng thẻ không hề cảnh báo rằng recipe chỉ có tác dụng khi kho tiêu thụ đã pin kit ≥2.17.0 — một kho pin cũ chạy xong recipe vẫn bị cổng chặn như cũ mà không biết vì sao, và chính hồ sơ gốc khởi phát tính năng này (OneFlow, lúc kit còn ở 2.16.0) là đúng nhóm người có nguy cơ dính gap đó đầu tiên. Người quyết Gate 2 cần xem đây là khoảng-mơ-hồ cần thêm một câu điều kiện tiên quyết trong GUIDE, hay chấp nhận known-limits.
  required_evidence:
    - "GUIDE.md dòng 609-644 (mục «Cho một hồ sơ nghỉ»): không có câu nào nhắc kiểm tra hay yêu cầu pin kit ≥2.17.0 trước khi chạy recipe — thêm một câu điều kiện tiên quyết thì verdict đổi PASS."
    - "docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md §5: 'Kho tiêu thụ chưa nhận 2.17.0: dòng nghỉ là một dòng JSON trong sổ, bộ đọc cũ bỏ qua.' — xác nhận recipe là no-op im lặng trên pin cũ."
    - "docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md dòng 4 (Gốc): ca thật khởi phát tính năng này là một kho ở pin trước 2.17.0 (OneFlow, kit release-2-16-0)."
  human_override:

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T11:07:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T11:08:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-nghi-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-19T11:09:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T11:10:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E10 — baseline: green. `node scripts/product-map.mjs --root . --check` pass trên cả nhánh này lẫn diffBase, vì bản vá vòng này chỉ chạm `lib/workspace-record.cjs` + `scripts/start-scan.mjs`/`scripts/gate-card.js`/`scripts/pre-merge-check.sh`/`scripts/recheck-evidence.cjs` — không chạm `scripts/product-map.mjs`. Lệnh `--check` chỉ tự so bản đồ với chính đầu ra nó vừa sinh ra, không so với kết quả của `start-scan.mjs`, nên eval này không phân biệt được feature (không đo đúng quan hệ mà AC-5 hứa). Xem review-findings.md finding t3/t7: hai bộ đọc (`start-scan.mjs` và `product-map.mjs`) xếp cùng một hồ sơ nghỉ vào hai nhóm khác nhau trên hợp đồng chưa qua Cổng 2, mà E10 không hề chạm tới quan hệ đó.

## Variance

none — không eval nào mang trường `runs` > 1 vòng này; không có kết quả chạy đa lượt.

## Iterations

Round 1: 10 eval máy (E1–E7, E9–E11) PASS qua `node tests/scripts/ho-so-nghi.test.mjs` (29 passed) + `node scripts/product-map.mjs --check`, cộng 4 suite hồi quy đều xanh. E8 (judgment, AC-8) — panel 2/3 PASS, operational-feasibility FAIL vì GUIDE/thẻ không khai điều kiện tiên quyết pin kit ≥2.17.0 — item còn UNCERTAIN. Review xác nhận 6/15 finding map vào hợp đồng (AC-2, AC-5 ×2, AC-6, AC-10): phần lớn là assertion-âm-tính-một-mình (t10, t13), ma trận đo thiếu ô (t11), đo-chỉ-dẫn-thay-đầu-ra (t12), và product-map.mjs chưa được dạy nhận biết hoSoNghi (t3/t7) — nên các eval E2/E5/E6/E10/E11 tuy exit 0 nhưng chưa thật sự verify Then của AC tương ứng. Verdict: REJECT, trả lại implementation.