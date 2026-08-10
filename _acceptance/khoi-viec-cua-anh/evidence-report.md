---
schema_version: 2
feature_slug: khoi-viec-cua-anh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3caee050e972147f6481111627dbe216cf30ba05
human_signoff: Manh Phan 2026-08-11
---

# Evidence Report: khoi-viec-cua-anh

Round 3 chạy trên `a87671687f63cfb48224a325f91d5e032551c287` (commit `fix(chip2 r2)` — câu mẫu đổi thành khuôn có chỗ trống, phủ 2 overlay Codex, suy tập bản chép từ mặt phẳng — theo Đường A owner duyệt sau round 2 REJECT). Cả sáu suite máy + product-map đều xanh, E1–E6 xanh, judge panel E7 đồng thuận 3/3 PASS. Review round này tìm 4 finding thật nhưng cả bốn đều rơi ngoài phạm vi các AC đã ký (xem `review-findings.md` mục "Ngoài hợp đồng") — không finding nào map vào AC nào, nên không có gì trả lại implementation. Verdict: PASS.

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
  run_id: minted-khoi-viec-cua-anh-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:00Z
  output: |
    PASS: P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-khoi-viec-cua-anh-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:05Z
  output: |
    PASS: P186 khoi Cong 2 du 4 loai + mau gop (mutant bi bat)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-viec-cua-anh-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:10Z
  output: |
    PASS: P187 chi-bao khong-can-lam-gi (3 nhanh + doi chung PASS)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-khoi-viec-cua-anh-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:15Z
  output: |
    PASS: P186b khoi khong bien mat khi 0 viec-nguoi (mutant bi bat)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-khoi-viec-cua-anh-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:20Z
  output: |
    PASS: P188 round-trip dieu khoan moi-cong: nguon + MOI ban chep (ke ca goi dung + overlay) khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-khoi-viec-cua-anh-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T06:20:25Z
  output: |
    PASS: P189 khuon VIEC-CUA-ANH: 3 ve + mau gop 1 dong + chi-bao + cam-dau-hoi (E6)

    Results: all plugin tests passed

- eval: E7
  judged_by: judge panel (fresh context) — 3 lenses: domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Cả ba thẻ (P185 Cổng 1, P186 Cổng 2 ký được, P187 Cổng 2 không ký được) render khối "👉 VIỆC CỦA ANH" với đủ 3 vế (làm gì / ở đâu / trả lời dạng) cho từng mục, dòng "Trả lời mẫu" nằm một dòng dạng khuôn-có-chỗ-trống (dùng "___", không điền sẵn lựa chọn — vd P186: «Ngoài-1: ___; E9: ___; cắt/hoãn: ___; Treo: ___; ký hay trả: ___»), thẻ P187 nói rõ "không cần làm gì" kèm hành động tiếp theo đúng verdict, và mọi mã tra cứu (Ngoài-1, E9, Treo-1) đều xuất hiện kèm 3-5 chữ giải nghĩa ngay tại khối được trỏ trong cùng thẻ (vd "E9 (câu hỏi cần mắt người)"). Rà cả hai khối marker YOUR-MOVE-BLOCK-TEMPLATE và GATE-INVITE-CLAUSE trong human-facing-language.md: khuôn tự mô tả đủ 3 vế + câu mẫu gộp một dòng + quy tắc "không điền sẵn" + chỉ-báo "không cần làm gì" + cấm câu hỏi tu từ, đủ rõ để một phiên khác chép đúng. Không thấy dấu "?" (câu hỏi tu từ) nào trong cả ba khối lẫn hai đoạn khuôn.
    - operational-feasibility: PASS — Cả ba thẻ đều có khối 👉 VIỆC CỦA ANH đúng khuôn YOUR-MOVE-BLOCK-TEMPLATE: mỗi mục đủ 3 vế làm-gì/ở-đâu/trả-lời-dạng (vd P186 "Chọn hướng cho Ngoài-1 — làm gì:... ở đâu:... trả lời dạng: «Ngoài-1: ghi Known limits» hoặc..."), dòng Trả lời mẫu nằm một dòng ở dạng khuôn-có-chỗ-trống không điền sẵn lựa chọn (không còn lặp lại vụ "E9 Đạt" điền sẵn từng bị nêu trong bản luật); mã tra cứu Ngoài-1/E9/Treo-1 đều xuất hiện kèm mô tả ngắn ngay tại khối được trỏ tới phía trên trong cùng thẻ, tìm được không cần đọc code. Thẻ P187 (không ký được) nói rõ một dòng "không cần làm gì — máy đang quay lại sửa code..." và không có mục nào đòi trả lời. Quét cả ba file HTML và hai khối khuôn trong human-facing-language.md không thấy dấu hỏi tu từ nào lọt (N6 giữ vững), và khuôn GATE-INVITE-CLAUSE/YOUR-MOVE-BLOCK-TEMPLATE đủ tự giải thích cho một phiên khác viết đúng tin mời. Có một điểm cosmetic nhỏ ở P186 — nhãn "(Treo-1…Treo-1)" trông như lỗi lặp khi range chỉ có một phần tử — nhưng không che mất 3 vế hay mã tra cứu nên không đủ để hạ verdict.
    - spec-alignment: PASS — Cả ba thẻ (P185 Cổng 1, P186 Cổng 2 ký được, P187 Cổng 2 không ký được) đều có khối "👉 VIỆC CỦA ANH" với mỗi mục đủ 3 vế làm-gì/ở-đâu/trả-lời-dạng-gì, câu "Trả lời mẫu" nằm đúng một dòng ở dạng khuôn-có-chỗ-trống (không điền sẵn lựa chọn — vd P186 "«Ngoài-1: ___; E9: ___; cắt/hoãn: ___; Treo: ___; ký hay trả: ___»"), mã tra cứu Ngoài-1/E9/Treo-1 hiện ngay tại khối được trỏ và khớp với item nguồn phía trên; thẻ P187 ghi rõ "không cần làm gì" kèm hành động máy đang làm tiếp; grep cả ba file không có ký tự "?" nào (không câu tu từ mang dấu hỏi). Hai khối khuôn lời-mời (YOUR-MOVE-BLOCK-TEMPLATE, GATE-INVITE-CLAUSE) trong human-facing-language.md khai đủ cả 5 chuẩn kèm luật đi kèm và ví dụ vi phạm cụ thể (dòng 147-149), đủ tự-đủ để một phiên khác chép đúng; các dấu "?" duy nhất trong file nằm ngoài hai khối marker này (dòng 46, 96, 109) nên không vi phạm.
  rationale: Đề xuất hội đồng (proposal) là PASS, đồng thuận 3/3 lens, không có dissent.
  human_override:

### Suite khác (regression-guard, không gắn eval cụ thể)

- `bash tests/scripts/run-tests.sh` — exit 0, "PASS: GCV1d contract lành không sinh cảnh báo nào" (671 passed, 0 failed)
- `bash tests/hooks/run-tests.sh` — exit 0, "PASS: T42" (54 passed, 0 failed)
- `bash scripts/sync-plugin-packages.sh --check` — exit 0, "plugins/ mirror in sync."
- `bash tests/workflows/run-tests.sh` — exit 0 (62 passed, 0 failed)
- `node scripts/product-map.mjs --root . --check` — exit 0, "PRODUCT-MAP.md khớp hồ sơ xưởng."

Các lệnh trên là regression-guard xanh-cả-hai-phía thông thường, không mapping tới eval cụ thể của feature này — liệt ở đây cho đầy đủ dấu vết, không phải bằng chứng riêng cho AC nào.

## Analyst

E1, E2, E3, E4, E5, E6 (bash tests/plugins/run-tests.sh) — non-discriminating: xanh trên CẢ HEAD lẫn baseline diffBase round này. Nên viết lại các case này để assert hành vi mới (không chỉ chuỗi cấu trúc) hoặc xác nhận là regression-guard có chủ ý. Xem thêm review-findings.md — hai finding "Hình dạng 4/5" chỉ ra chỗ P189/P188 chưa cô lập lớp và chưa có sàn số-bản-chép ở site nguồn, cùng dòng nguyên nhân khiến các eval này chưa phân biệt được mọi cách feature có thể vỡ.

## Variance

none — không có eval nào mang `runs > 1` trong round này (tất cả deterministic, runs=1).

## Iterations

Round 1: review tìm lỗi trong `scripts/gate-card.js` (khối 👉 VIỆC CỦA ANH) — sửa bằng commit `45dc912` ("fix(chip2 r1)"), đưa sang round 2.
Round 2: máy (E1–E6 + 5 suite regression-guard + product-map) xanh toàn bộ, judge panel E7 đồng thuận PASS 3/3, nhưng review tìm 3 finding severity=high map AC-2 (`scripts/gate-card.js:509,519` — dòng "Trả lời mẫu" tự điền "Đạt"/"Ký" kể cả khi judgment chưa đạt hoặc máy chưa đề xuất hướng nào) — trả lại implementation để sửa AC-2 trước khi tái verify.
Round 3: sửa bằng commit `a876716` ("fix(chip2 r2)" — câu mẫu đổi thành khuôn có chỗ trống «<mã>: ___», phủ 2 overlay Codex, suy tập bản chép từ mặt phẳng, thước AC-1/2/5/6 đổi có khai ở `ruler-change.md`). Máy (E1–E6 + 5 suite regression-guard + product-map) xanh toàn bộ, judge panel E7 đồng thuận PASS 3/3, review tìm 4 finding thật nhưng cả bốn ngoài phạm vi AC đã ký (2 lỗ đo trong chính P188/P189, 1 lỗi nội dung trong overlay Codex Gate 2, 1 lỗ trong định dạng evidence-report — xem review-findings.md) — verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-10, do sửa hai lỗi biết-trước-chữ-ký của round 3 (điều khoản về đúng ranh giới câu trong bản Codex; sáu khối bằng chứng trích đúng dòng kết quả của từng phép đo)
run_id: repin-khoi-viec-cua-anh-20260810T232030Z
sha: 3caee050e972147f6481111627dbe216cf30ba05 · suites: 6 lệnh exit 0
