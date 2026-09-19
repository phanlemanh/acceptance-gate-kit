---
schema_version: 2
feature_slug: ho-so-nghi
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c152a24d4b133020030620c32595d11aa01078aa
human_signoff:
---

# Evidence Report: ho-so-nghi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-nghi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E2
  run_id: minted-ho-so-nghi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E3
  run_id: minted-ho-so-nghi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E4
  run_id: minted-ho-so-nghi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E5
  run_id: minted-ho-so-nghi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E6
  run_id: minted-ho-so-nghi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E7
  run_id: minted-ho-so-nghi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E9
  run_id: minted-ho-so-nghi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

- eval: E10
  run_id: minted-ho-so-nghi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-09-19T09:20:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E11
  run_id: minted-ho-so-nghi-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hsn_rang
  verified_at: 2026-09-19T09:15:00Z
  output: |
    PASS: HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)

    Results: 34 passed, 0 failed (ho-so-nghi)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-19T09:25:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-19T09:26:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-nghi-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-19T09:27:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-nghi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-19T09:28:00Z

- eval: E8
  run_id: minted-ho-so-nghi-E8-r2
  verifier: judge-subagent (fresh context) — 3 lens: domain-correctness, operational-feasibility, spec-alignment
  verified_at: 2026-09-19T09:40:00Z
  judged_by: judge panel (fresh context)
  verdict: PASS
  panel:
    - lens: domain-correctness
      verdict: PASS — GUIDE §"Cho một hồ sơ nghỉ" trùng khớp gần như nguyên văn với kịch bản (chính nó nêu ví dụ "kho nguồn của một phần phụ thuộc biến mất"), và trả lời đủ ba câu hỏi trong một phút: làm gì (chạy khối lệnh bash NGHI-LINE-RECIPE, điền 4 chỗ), làm ở đâu ("Chạy ở gốc kho"), và điều gì không xảy ra với chữ ký cũ (nêu rõ "chữ ký là sử liệu", "contract.md, evidence-report.md, run-log.jsonl không đổi một byte", và mô tả cổng chỉ thôi chấm ba luật chứ không sửa hồ sơ đã ký). Dòng thẻ gate-card.js in khi NGHI khớp: "Chữ ký giữ làm sử liệu, không mời ký lại." — nhất quán với GUIDE, không mâu thuẫn. Giới hạn (thiếu vế → vẫn cần ký; chưa có khoá chống máy tự gọi) được khai rõ như limitation, không phải lời hứa ngầm; đối chiếu ma trận thước ở spec (HSN0–HSN10) không thấy lời hứa nào trong hai vật liệu này thiếu ca đo tương ứng.
    - lens: operational-feasibility
      verdict: PASS — Mục GUIDE §"Cho một hồ sơ nghỉ" tự đủ trong một phút: nêu đúng nỗi đau (cổng chặn mọi PR vì hồ sơ chết tiền đề, không ai ghim được), cho công thức bash chạy-được-ngay tại gốc kho với đúng bốn chỗ cần thay (`<slug>`, `<tên người>`, `<lý do một câu>`, `<hồ sơ thôi hứa gì>`), và khai rõ điều KHÔNG xảy ra với chữ ký cũ: "chữ ký là sử liệu", "contract.md, evidence-report.md, run-log.jsonl không đổi một byte", "thôi chấm hồ sơ ấy" ở ba luật liệt kê tên. Dòng thẻ Cổng 2 (gate-card.js:1075) khớp đúng lời hứa đó — in thẳng "Chữ ký giữ làm sử liệu, không mời ký lại" — và đối chiếu với mã cho thấy hồ sơ NGHỈ được xếp vào nhánh MAY_DI_TIEP (không hiện nút ký) nên lời hứa "không mời ký lại" có thật trong chính file được giao, không phải lời hứa suông. GUIDE cũng tự khai giới hạn (chưa có khoá chống máy tự gọi) thay vì giấu, và thiếu tên/lý do được nói rõ là "không tính là nghỉ" kèm hệ quả. Không thấy khoảng trống giữa điều GUIDE hứa và điều bản thiết kế liệt kê sẽ đo (ma trận HSN0–HSN10 phủ đúng các nhánh GUIDE mô tả: thiếu vế, văn xuôi không tính, mở lại bằng supersedes, vi phân byte).
    - lens: spec-alignment
      verdict: PASS — GUIDE mục «Cho một hồ sơ nghỉ» mở đúng bằng kịch bản "kho nguồn phụ thuộc biến mất", cho lệnh chạy-được tại gốc kho với đúng 4 chỗ điền, và nói rõ "chữ ký giữ làm sử liệu, không mời ký lại" — dòng cờ trong gate-card.js (`Hồ sơ đã nghỉ — {by} {at}: {ly_do}. Chữ ký giữ làm sử liệu, không mời ký lại.`) lặp lại đúng cam kết đó, nên người đọc trong một phút biết làm gì (chạy recipe), làm ở đâu (gốc kho), và điều KHÔNG xảy ra (không sửa/không mời ký lại chữ ký cũ). Các lời hứa khác trong mục này (lưới trước-merge dừng 3 luật, contract/evidence/run-log không đổi byte, thiếu vế thì không tính nghỉ, mở lại bằng supersedes) đều có ca đo tương ứng trong spec (HSN1/HSN2/HSN6/HSN10), và giới hạn chưa làm (khoá model-invocation) được khai rõ là việc của vòng sau — không thấy chỗ nào hứa mà vòng này không đo.
  rationale: Cả ba lens đồng thuận PASS — GUIDE §"Cho một hồ sơ nghỉ" cùng dòng thẻ gate-card.js trả lời đủ ba câu hỏi trong một phút (làm gì / ở đâu / điều gì KHÔNG xảy ra với chữ ký cũ), lời hứa "chữ ký giữ làm sử liệu, không mời ký lại" khớp với hành vi mã (nhánh MAY_DI_TIEP không hiện nút ký), và không lens nào tìm thấy lời hứa nào trong hai vật liệu mà ma trận HSN0–HSN10 không đo. Xem đầy đủ rationale từng lens ở mục `panel:` phía trên — không tóm tắt, không lược bớt bất đồng (không có bất đồng: 3/3 PASS).
  required_evidence:
    - (panel đồng thuận PASS cả ba lens; T3 vẫn đòi người tự đọc GUIDE §"Cho một hồ sơ nghỉ" + dòng thẻ gate-card.js:1075 và tự xác nhận ba câu hỏi trong một phút trước khi ký human_override — hợp đồng này ở risk_tier T3 nên PASS của panel không tự động thay chữ ký người trên MỌI judgment item)
  human_override:

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

E10 (`node scripts/product-map.mjs --root . --check`)

## Variance

none — mọi eval round này đều `runs: 1` (không có eval ngẫu nhiên, không có phương sai để chấm).

## Iterations

Round 1: REJECT — 15 phát hiện (6 trong hợp đồng: hai lỗi sản phẩm, bốn phép đo yếu). Returned to implementation.
Round 2: Chín eval script (E1–E7, E9, E11) + E10 (product-map) + năm lệnh suite hồi quy đều xanh; panel judgment E8 đồng thuận PASS 3/3 lens. Verdict tổng PENDING-JUDGMENT vì hợp đồng ở risk_tier T3 đòi `human_override` trên MỌI judgment item bất kể verdict của judge.
