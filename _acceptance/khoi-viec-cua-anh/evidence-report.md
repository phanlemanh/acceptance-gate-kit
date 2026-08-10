---
schema_version: 2
feature_slug: khoi-viec-cua-anh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 45dc912de82a92375110424653f2dd9c24956dcf
human_signoff:
---

# Evidence Report: khoi-viec-cua-anh

⚠ Verdict REJECT dù bảng eval bên dưới toàn PASS: máy (6 suite regression-guard + product-map) xanh, E1–E6 xanh, judge panel E7 đồng thuận 3/3 PASS — nhưng review tìm 3 finding severity=high map thẳng vào AC-2 (`scripts/gate-card.js:509,519`): dòng "Trả lời mẫu" ở thẻ Cổng 2 tự điền sẵn "Đạt"/"Ký"/"ghi Known limits" cho TỪNG mục việc-người, kể cả khi judgment đã FAIL hoặc máy chưa đề xuất hướng nào — người ký chỉ cần copy-paste một dòng là duyệt hết. Đây là vi phạm AC-2 thật trên code đang chạy (không phải lỗ đo), va thẳng lõi bất khả nhượng "chữ ký người" — nên round này REJECT, quay lại implementation. Xem `## Trong hợp đồng` trong review-findings.md để sửa trước khi tái verify. `failed_evals` để trống vì không machine eval nào exit khác 0 — lý do reject nằm ở review tìm bug thật, không nằm ở kết quả chạy lệnh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-viec-cua-anh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:00Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-khoi-viec-cua-anh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:05Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-viec-cua-anh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:10Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-khoi-viec-cua-anh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:15Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-khoi-viec-cua-anh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:20Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-khoi-viec-cua-anh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T16:40:25Z
  output: |
    PASS: P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)

    Results: all plugin tests passed

- eval: E7
  judged_by: judge panel (fresh context) — 3 lenses: domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Cả ba thẻ đều có khối "👉 VIỆC CỦA ANH" đủ 3 vế (làm gì/ở đâu/trả lời dạng) cho từng mục, mã tra cứu (Ngoài-1, E9, Treo-1) đều xuất hiện kèm gloss 3-5 chữ ngay tại khối được trỏ tới trên cùng thẻ, và câu "Trả lời mẫu" nằm gọn một dòng chép được ngay ở cả thẻ Cổng 1 và Cổng 2 ký được. Thẻ Cổng 2 không ký được nói rõ "không cần làm gì" đúng khuôn chỉ-báo, và rà toàn bộ text ba thẻ + hai khối YOUR-MOVE-BLOCK-TEMPLATE/GATE-INVITE-CLAUSE trong human-facing-language.md không thấy dấu hỏi nào (không câu tu từ mang dấu hỏi lọt qua N1-N6).
    - operational-feasibility: PASS — Cả ba thẻ (p185/p186/p187) đều kết bằng đúng khối "👉 VIỆC CỦA ANH" đủ 3 vế làm-gì/ở-đâu/trả-lời-dạng-gì cho mỗi mục, câu "Trả lời mẫu" nằm trên một dòng chép-được-ngay, thẻ không-ký-được (p187) nói rõ "không cần làm gì" và không chứa mục đòi trả lời; grep cả ba file xác nhận không có ký tự "?" nào. Mọi mã tra cứu (Ngoài-1, E9, Treo-1) đều hiện đúng tại khối được trỏ, và hai khối khuôn YOUR-MOVE-BLOCK-TEMPLATE + GATE-INVITE-CLAUSE tự đủ để một phiên khác viết đúng tin mời. Một điểm nhỏ không đủ sức đổi verdict: mục "Phê 1 quyết định ghi sau Cổng 1 (Treo-1…Treo-1)" trên p186 hiển thị mã lặp dạng khoảng dù chỉ có một mục — hơi gợn mắt nhưng câu "Phê 1 quyết định" đứng ngay trước đã disambiguate, không chặn hiểu-ngay.
    - spec-alignment: PASS — Cả ba thẻ đều có khối "👉 VIỆC CỦA ANH" đúng vị trí (trước hàng nút), mỗi mục đủ 3 vế làm-gì/ở-đâu/trả-lời-dạng-gì, và mã tra cứu (Ngoài-1, E9, Treo-1) đều hiện sẵn ngay tại khối mà mục việc trỏ tới. Thẻ p186 có dòng "Trả lời mẫu" gộp một dòng chép-được-ngay nêu đủ mọi mã đang hiện; thẻ p187 (không ký được) ghi rõ "không cần làm gì" kèm máy đang làm gì tiếp và không có mục đòi trả lời. Rà cả ba khối thẻ lẫn hai khối khuôn không thấy dấu "?" nào.
  rationale: Đề xuất hội đồng (proposal) là PASS, đồng thuận 3/3 lens, không có dissent. LƯU Ý: verdict PASS của E7 là về khuôn lời-mời/thẻ tự nó (đủ 6 ý câu hỏi), KHÔNG kiểm tra nội dung "Trả lời mẫu" có thiên lệch hay không — đúng lỗ mà review tìm ra ở AC-2 (xem review-findings.md).
  human_override:

### Suite khác (regression-guard, không gắn eval cụ thể)

- `bash tests/scripts/run-tests.sh` — exit 0, "PASS: GCV1d contract lành không sinh cảnh báo nào" (671 passed, 0 failed)
- `bash tests/hooks/run-tests.sh` — exit 0, "PASS: T42" (54 passed, 0 failed)
- `bash scripts/sync-plugin-packages.sh --check` — exit 0, "plugins/ mirror in sync."
- `bash tests/workflows/run-tests.sh` — exit 0 (62 passed, 0 failed)
- `node scripts/product-map.mjs --root . --check` — exit 0, "PRODUCT-MAP.md khớp hồ sơ xưởng."

Các lệnh trên là regression-guard xanh-cả-hai-phía thông thường, không mapping tới eval cụ thể của feature này — liệt ở đây cho đầy đủ dấu vết, không phải bằng chứng riêng cho AC nào.

## Analyst

carried từ round 1 — baseline không đo lại round này.

E1, E2, E3, E4, E5, E6 (bash tests/plugins/run-tests.sh) — non-discriminating theo dữ liệu carried từ round 1 (pass trên cả HEAD lẫn baseline diffBase); nên viết lại để assert hành vi mới (không chỉ chuỗi cấu trúc) hoặc xác nhận là regression-guard có chủ ý. Xem thêm review-findings.md phần "Hình dạng 3/5" cho lỗ đo cụ thể trong chính các case P186/P186b — cùng nguyên nhân khiến AC-2 bị vi phạm mà eval vẫn xanh.

## Variance

none — không có eval nào mang `runs > 1` trong round này (tất cả deterministic, runs=1).

## Iterations

Round 1: review tìm lỗi trong `scripts/gate-card.js` (khối 👉 VIỆC CỦA ANH) — sửa bằng commit `45dc912` ("fix(chip2 r1)"), đưa sang round 2.
Round 2: máy (E1–E6 + 5 suite regression-guard + product-map) xanh toàn bộ, judge panel E7 đồng thuận PASS 3/3, nhưng review tìm 3 finding severity=high map AC-2 (`scripts/gate-card.js:509,519` — dòng "Trả lời mẫu" tự điền "Đạt"/"Ký" kể cả khi judgment FAIL hoặc máy chưa đề xuất hướng nào) — verdict REJECT, trả lại implementation để sửa AC-2 trước khi tái verify.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
