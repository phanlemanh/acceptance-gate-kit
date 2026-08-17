---
schema_version: 2
feature_slug: moi-noi-vong-trao
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d9f7be76b46bfc58298064434a00055fe6f91f4d
human_signoff:
---

# Evidence Report: moi-noi-vong-trao

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | judgment | UNCERTAIN |
| E4b | AC-4 | script | PASS |
| E5 | AC-5 | judgment | UNCERTAIN |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-noi-vong-trao-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_the_nguong
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [the-nguong]: P197 OK + 3 mutant bi bat (ghim dong, khong tin ma thoat suite)

- eval: E2
  run_id: minted-moi-noi-vong-trao-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_the_nguong_do
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [the-nguong-do]: P197 OK + 3 mutant bi bat (ghim dong, khong tin ma thoat suite)

- eval: E3
  run_id: minted-moi-noi-vong-trao-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_khuon
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [khuon]: DOC ⊆ KHUON, DOC ⊇ {chan,slug,ran_at}; 2 mutant bi bat (mutA: §0 doc khoa ngoai khuon: chan | mutB: §0 doc khoa ngoai khuon: blocked)

- eval: E4b
  run_id: minted-moi-noi-vong-trao-E4b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_uat_needle
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
      MNVT XANH [uat-needle]: 6 nhanh co ten; 2 mutant (thieu nhanh co vang · thieu chi duong lai-thu lai) doi mau

- eval: E5b
  run_id: minted-moi-noi-vong-trao-E5b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_s5_needle
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [s5-needle]: S5 co dong ban giao (opportunity · lái-thử · uat-session <slug>) + nhanh ship thang; S0 doc opportunity; mutant xoa dong ban giao doi mau

- eval: E6
  run_id: minted-moi-noi-vong-trao-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_spec
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [spec]: §2.3 thi DO · hang A co lai-thu · Chuong 3 dong · Chuong 4 nhat-ky-vap · §5 de bai nguyen; mutant hang A doi mau
    EXIT_CODE=0

- eval: E7
  run_id: minted-moi-noi-vong-trao-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_hinh
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
    MNVT XANH [hinh]: 6 file · muc luc du · dau DE XUAT + dieu kien go tren 2 hinh; mutant go dau doi mau

- eval: E8
  run_id: minted-moi-noi-vong-trao-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-17T10:00:00+07:00
  output: |
      PASS: P197 the Cong Pham vi in nguong nghiem thu: ma tran 4x2 + doi-cu + 3 mutant (moi-noi-vong-trao E1/E2)

    Results: all plugin tests passed

- eval: E4
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Danh sách Input chỉ có 2 file: SKILL.md (thân skill) và ca-E4.md (đề bài 6 ca). Không có file nào chứa ĐÁP ÁN THẬT của agent hành động (đoạn nó nói với owner ở bước "Điều kiện vào" cho từng ca) để chấm, và cũng không có đáp án mẫu giam-khao/dap-an-E4.md mà câu hỏi dẫn chiếu. Không có bài làm để đối chiếu với §0 của SKILL.md thì không thể kết luận 6/6 đạt hay có ca trượt.
    - operational-feasibility: UNCERTAIN — Hai file Input (SKILL.md của uat-session và ca-E4.md — chỉ là 6 đề bài) không chứa đoạn trả lời thực tế mà agent-được-chấm đã viết cho từng ca ở bước «Điều kiện vào»; đề bài E4 yêu cầu chấm CHÍNH đoạn agent viết, nhưng không có artifact nào trong danh sách Input mang nội dung đó để đối chiếu với 6 ca.
    - spec-alignment: UNCERTAIN — Input chỉ có thân skill uat-session (SKILL.md §0) và đề bài ca-E4.md (6 ca tình huống) — không có bài làm thực tế của agent-dưới-khảo (đoạn nó nói với owner cho từng ca) để đối chiếu 6/6. Không có bằng chứng đó thì không thể phán "đạt/mơ hồ/trượt" theo đáp án, dù bản thân SKILL.md §0 tự nó cho quy tắc xác định khá rõ cho 5/6 ca (chan>0 dừng nêu vấp; file vắng/frontmatter hỏng/slug lệch/ran_at cũ → cờ vàng nêu lý do có tên, không chặn) — trừ ca 1 (chan=0 "hợp lệ") không nêu rõ slug/ran_at nên phải suy diễn ngầm.
  rationale: Panel đề xuất UNCERTAIN — cả 3 lens đồng thuận: danh sách Input chỉ có SKILL.md và ca-E4.md (đề bài), không có artifact nào chứa bài làm thực tế của agent-dưới-khảo cho 6 ca để đối chiếu với luật ở §0, nên không thể phán 6/6 đạt hay có ca trượt.
  required_evidence:
    - File chứa bài làm thực tế của agent hành động cho 6 ca trong ca-E4.md — đoạn agent nói với owner ở bước Điều kiện vào cho từng ca 1-6 (ví dụ một file kiểu _acceptance/moi-noi-vong-trao/hoi-dong/ca-E4-tra-loi.md hoặc transcript agent chạy skill uat-session với input ca-E4.md) — cần được thêm vào danh sách Input
    - File đáp án giam-khao/dap-an-E4.md mà đề bài dẫn chiếu để chấm ("Giám khảo chấm theo đáp án giam-khao/dap-an-E4.md") — hiện không nằm trong danh sách Input nên không thể áp tiêu chí 6/6
    - File chứa 6 đoạn trả lời thực tế mà agent-được-chấm đã viết cho owner ở bước «Điều kiện vào» ứng với Ca 1–6 của ca-E4.md (ví dụ một bản ghi hội thoại/output agent, dạng .md hoặc .txt) — hiện không có tên trong danh sách Input nên không thể đối chiếu để phân PASS/FAIL
    - (judge không nêu bằng-chứng-thiếu)
  human_override:

- eval: E5
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Input chỉ có bản SKILL.md (nguồn luật) và ca-E5.md (đề bài 3 ca) — không có artifact nào ghi lại câu agent hành động THỰC TẾ đã in cho owner / việc nó làm kế ở từng ca (S5-ca1, S5-ca2, S0-ca3) để đối chiếu domain-correctness với SKILL.md. Không có sản phẩm cần chấm thì không thể kết luận PASS hay FAIL, chỉ có thể tự suy ra "đáp án đúng nên là gì" từ SKILL.md chứ không phải chấm câu ai đó đã viết.
    - operational-feasibility: PASS — Cả 3 ca trong ca-E5.md map thẳng, không mơ hồ, vào đúng câu chữ tường minh trong thân feature-loop SAU sửa: Ca 1 (S5 có opportunity.md) và Ca 2 (S5 không có) khớp đúng cặp câu in ở S5 "Kết S5" (SKILL.md dòng 217 — hai nhánh «đã giao sau cờ...» / «không hồ sơ cơ hội...»); Ca 3 (S0 mở vòng khi workspace đã có opportunity.md) khớp đúng S0 bước 3 (SKILL.md dòng 83 — opportunity.md là "INPUT THỨ NHẤT của brainstorm S1: đọc trước khi hỏi câu nào"). Cả 3 ca tự đủ (không cần file ngoài để xác định đáp án), và bản thân ca-E5.md không lộ sẵn câu trả lời — agent-dưới-test phải tự tìm đúng đoạn trong thân skill để trả lời, đúng tinh thần giao thức chống rò rỉ như E4.
    - spec-alignment: UNCERTAIN — Input list chỉ có SKILL.md (thân feature-loop, tức đề bài/spec) và ca-E5.md (3 tình huống được hỏi) — không có bất kỳ artifact nào ghi lại câu trả lời/câu in thực tế của agent hành động cho 3 ca đó để đối chiếu với S0/S5 của SKILL.md. Không có đầu ra của agent thì không có gì để chấm spec-alignment, dù bản thân SKILL.md tự nó mô tả rõ hành vi kỳ vọng cho cả 3 ca (S5 có/không opportunity.md ở dòng "Kết S5" và S0 mục 3 về đọc opportunity.md trước brainstorm).
  rationale: Panel đề xuất UNCERTAIN — dissent nội bộ: 2/3 lens (domain-correctness, spec-alignment) giữ UNCERTAIN vì không có artifact ghi câu trả lời thực tế của agent cho 3 ca; operational-feasibility đã vote PASS vì tự thấy 3 ca map thẳng vào câu chữ tường minh của SKILL.md mà không cần file ngoài — dissent này giữ nguyên, chưa gộp, người quyết ở Gate 2.
  required_evidence:
    - Transcript/file ghi câu agent hành động thực tế in cho Ca 1 (S5, slug refine-editor, có opportunity.md) — cần đối chiếu với dòng mẫu ở SKILL.md dòng 217 ("đã giao sau cờ · bước kế: lái-thử người-lạ...")
    - Transcript/file ghi câu agent hành động thực tế in cho Ca 2 (S5, slug mcp-cost-guard, KHÔNG có opportunity.md) — đối chiếu dòng mẫu "không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng"
    - Transcript/file ghi việc agent hành động thực tế làm cho Ca 3 (S0, refine-editor có opportunity.md, chưa có contract) trước câu hỏi brainstorm đầu tiên — đối chiếu SKILL.md dòng 83 (đọc opportunity.md làm input thứ nhất, không hỏi lại điều đã có trong đó)
  human_override:

## Analyst

- E8 — `bash tests/plugins/run-tests.sh` xanh trên cả HEAD lẫn diffBase (baseline: green) — suite P197 là bộ đo vĩnh viễn dùng chung cho nhiều feature, nên nó xanh cả trước và sau vòng moi-noi-vong-trao và không tự phân biệt được feature này. Đây là regression-guard bình thường (không phải phép đo mới cho feature), giữ nguyên; chiều phân biệt thật của P197 nằm ở E1/E2 (rang-mnvt.sh chạy ONLY_BLOCK=P197 rồi tự áp mutant).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 8 machine eval (E1, E2, E3, E4b, E5b, E6, E7, E8) đều PASS ngay lần chạy đầu, 7/8 phân biệt được trên baseline (baseline: red), riêng E8 baseline: green (xem Analyst); 2 judgment item (E4, E5) panel trả UNCERTAIN — thiếu artifact bài làm thực tế của agent-dưới-khảo trong danh sách Input để đối chiếu — chuyển Gate 2 cho người quyết, không lặp vòng.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
