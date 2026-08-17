---
schema_version: 2
feature_slug: moi-noi-vong-trao
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 36bed766ca996210bcba6c1afcec222fecccad71
human_signoff: Manh Phan 2026-08-18
---

# Evidence Report: moi-noi-vong-trao

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E4b | AC-4 | script | PASS |
| E4c | AC-4 | script | PASS |
| E5 | AC-5 | judgment | PASS |
| E5b | AC-5 | script | PASS |
| E5c | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-noi-vong-trao-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_the_nguong
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [the-nguong]: P197 OK + 4 mutant bi bat (ghim dong, khong tin ma thoat suite)

- eval: E2
  run_id: minted-moi-noi-vong-trao-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_the_nguong
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [the-nguong]: P197 OK + 4 mutant bi bat (ghim dong, khong tin ma thoat suite)

- eval: E3
  run_id: minted-moi-noi-vong-trao-E3-r2
  exit_code: 0
  verifier: config:executors.script.rang_mnvt_khuon
  verified_at: 2026-08-17T04:28:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4b
  run_id: minted-moi-noi-vong-trao-E4b-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_uat_needle
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [uat-needle]: 3 bullet nhanh doc rieng, quan he nhanh→ket cuc; 3 mutant hep qua chinh checker, ghim dung thong diep

- eval: E4c
  run_id: minted-moi-noi-vong-trao-E4c-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_hoi_dong
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [hoi-dong]: transcript E4/E5 ghi nap_sha256 khop vung SKILL hien tai + agent_id + tool_uses 0; mutant doi SKILL bi bat
    ---VERIFICATION_EXIT_CODE: 0---

- eval: E5b
  run_id: minted-moi-noi-vong-trao-E5b-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_s5_needle
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [s5-needle]: Ket S5: quan he co/khong opportunity → ban giao/ship thang trong cung doan; S0 input thu nhat; 3 mutant hep qua chinh checker

- eval: E5c
  run_id: minted-moi-noi-vong-trao-E5c-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_mnvt_hoi_dong
  verified_at: 2026-08-17T04:56:00Z
  output: |
    MNVT XANH [hoi-dong]: transcript E4/E5 ghi nap_sha256 khop vung SKILL hien tai + agent_id + tool_uses 0; mutant doi SKILL bi bat
    ---VERIFICATION_EXIT_CODE: 0---

- eval: E6
  run_id: minted-moi-noi-vong-trao-E6-r2
  exit_code: 0
  verifier: config:executors.script.rang_mnvt_spec
  verified_at: 2026-08-17T04:28:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-moi-noi-vong-trao-E7-r2
  exit_code: 0
  verifier: config:executors.script.rang_mnvt_hinh
  verified_at: 2026-08-17T04:28:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-moi-noi-vong-trao-E8-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-17T04:56:00Z
  output: |
      PASS: P197 the Cong Pham vi in nguong nghiem thu: ma tran 4x2 + doi-cu + 3 mutant (moi-noi-vong-trao E1/E2)

    Results: all plugin tests passed

- eval: E4
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Đối chiếu 6 ca trong transcript-E4.md với cột ĐẠT của dap-an-E4.md: Ca1 nêu bằng chứng (agent 17/08 sau verified_at 16/08, 0 chặn) rồi mở phiên không hỏi; Ca2 dừng đúng, nêu 2 vấp CHẶN, chỉ đường "vòng sửa rồi lái-thử lại"; Ca3/4/5/6 đều đi tiếp mở phiên kèm đúng tên cờ vàng («chưa lái-thử» / «không đọc được nhật-ký-vấp» / «nhật-ký của vòng khác» nêu 2 slug / «nhật-ký cũ hơn bản chấm» nêu 2 mốc 10/08 vs 16/08) — không ca nào rơi vào cột TRƯỢT. 6/6 ĐẠT khớp §0 SKILL.md sau sửa.
    - operational-feasibility: PASS — Đối chiếu transcript-E4.md với dap-an-E4.md từng ca: Ca1 nêu ván/biến thể + 0 CHẶN, đi tiếp mở phiên không hỏi owner (ĐẠT); Ca2 DỪNG, nêu đúng 2 vấp CHẶN, chỉ đường quay lại lái-thử (ĐẠT); Ca3–6 đều đi tiếp mở phiên với cờ vàng nêu đúng lý do (chưa lái-thử / không đọc được / vòng khác / cũ hơn bản chấm), không dừng, không coi chan=0 là bằng chứng khi không đủ điều kiện (ĐẠT cả 4). 6/6 ca khớp cột ĐẠT của đáp án → PASS theo §0 SKILL.
    - spec-alignment: PASS — Đầu transcript-E4.md có đủ giao thức chống rò rỉ (agent_id, tool_uses: 0, nap_sha256, nap_vung §0–§1, khai rõ không nạp đáp án). Đối chiếu 6 ca với dap-an-E4.md: Ca1 nói "THOẢ BẰNG BẰNG CHỨNG" nêu ván/biến thể/0 CHẶN rồi mở phiên không hỏi owner — ĐẠT; Ca2 DỪNG, nêu đúng 2 vấp CHẶN, nói việc sửa thuộc vòng + chỉ đường lái-thử lại — ĐẠT; Ca3/4/5/6 đều đi tiếp mở phiên kèm cờ vàng có tên lý do đúng khuôn (chưa lái-thử / không đọc được / vòng khác / cũ hơn bản chấm), không dừng và không hỏi owner xác nhận — ĐẠT. 6/6 ca khớp cột ĐẠT của đáp án.
  rationale: Panel 3/3 lens đồng thuận PASS, không dissent — transcript-E4.md (bài làm phiên sạch, tool_uses 0) khớp 6/6 ca của dap-an-E4.md; hội đồng E4c xác nhận transcript chưa lệch vùng SKILL hiện tại nên panel giữ nguyên kết luận PASS ở round 3.
  human_override:

- eval: E5
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Ca 1: câu in đúng 1 dòng khớp nguyên văn khuôn S5 "đã giao sau cờ · bước kế: lái-thử người-lạ ... rồi phiên nghiệm thu — uat-session refine-editor", việc kế nói rõ không hỏi/không tự mở UAT — khớp đáp án. Ca 2: câu in đúng 1 dòng "không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng", việc kế không nhắc lái-thử — khớp đáp án. Ca 3: chưa hỏi owner câu nào, việc kế nêu đọc trọn opportunity.md làm input thứ nhất trước brainstorm và cho ngưỡng/khung chảy vào contract S1, không hỏi lại điều đã grill — khớp S0 điểm 3 và đáp án. Cả 3 ca đều ĐẠT.
    - operational-feasibility: PASS — Cả 3 ca trong transcript-E5.md khớp đúng tiêu chí ĐẠT của dap-an-E5.md, đối chiếu với văn bản S0 điểm 3 và S5 của feature-loop/skills/feature-loop/SKILL.md (dòng 83, 217): Ca 1 in đúng một dòng bàn giao «đã giao sau cờ · bước kế: lái-thử người-lạ... rồi phiên nghiệm thu — uat-session refine-editor» gần như nguyên văn SKILL.md, không hỏi owner, không tự chạy uat-session. Ca 2 in đúng một dòng đóng vòng «không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng», không nhắc lái-thử. Ca 3 nêu đọc trọn opportunity.md TRƯỚC câu hỏi brainstorm đầu, lấy khung người/việc/dữ liệu + ngưỡng làm input thứ nhất chảy vào contract S1, không hỏi lại owner điều đã grill — khớp đúng S0 điểm 3.
    - spec-alignment: PASS — Cả 3 ca trong transcript-E5.md khớp đúng đáp án: Ca1 in đúng một dòng bàn giao «lái-thử người-lạ ... rồi phiên nghiệm thu — uat-session refine-editor» khớp nguyên văn SKILL mục S5 (thay slug), không hỏi owner, không kết «xong». Ca2 in đúng một dòng «không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng» khớp nguyên văn, không nhắc lái-thử. Ca3 nêu đọc trọn opportunity.md làm input thứ nhất TRƯỚC khi invoke brainstorming, mang khung/ngưỡng chảy vào contract S1, câu hỏi đầu chỉ hỏi phần opportunity.md chưa trả lời — đúng SKILL mục S0 điểm 3, chưa in câu hỏi nào cho owner (đúng yêu cầu đề ca).
  rationale: Panel 3/3 lens đồng thuận PASS, không dissent — S5 đổi câu chỉ dẫn ngày 17/08 buộc chạy lại hội đồng (vết đầu transcript-E5.md, xác nhận bởi E5c); bản chấm lại round 3 vẫn khớp 3/3 ca của dap-an-E5.md.
  human_override:

## Analyst

E8 — `bash tests/plugins/run-tests.sh` xanh trên cả HEAD lẫn diffBase (baseline: green). Suite plugins là bộ đo vĩnh viễn dùng chung nhiều feature nên nó xanh cả trước và sau vòng moi-noi-vong-trao và không tự phân biệt được feature này; chiều phân biệt thật của P197 nằm ở E1/E2 (rang-mnvt.sh chạy ONLY_BLOCK=P197 rồi tự áp 4 mutant). Đây là regression-guard bình thường, giữ nguyên.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 8 machine eval (E1, E2, E3, E4b, E5b, E6, E7, E8) đều PASS ngay lần chạy đầu, 7/8 phân biệt được trên baseline (baseline: red), riêng E8 baseline: green (xem Analyst); 2 judgment item (E4, E5) panel trả UNCERTAIN — thiếu artifact bài làm thực tế của agent-dưới-khảo trong danh sách Input để đối chiếu — chuyển Gate 2 cho người quyết, không lặp vòng.
Round 2: bổ sung transcript-E4.md/transcript-E5.md (bài làm agent phiên sạch, tool_uses: 0) + đáp án dap-an-E4.md/dap-an-E5.md vào Input cho judge; panel 3 lens chấm lại E4 (6/6 ca khớp cột ĐẠT) và E5 (3/3 ca khớp cột ĐẠT), cả hai UNCERTAIN → PASS, không dissent; 8 machine eval chạy lại cùng lệnh, giữ nguyên PASS; verdict tổng lên PASS.
Round 3: thêm mutant m4-placeholder vào chân the-nguong (E1/E2 nay ghim 4 mutant thay vì 3) và chân hoi-dong mới (E4c/E5c) kiểm transcript-E4/E5 chưa lệch vùng SKILL hiện tại sau khi S5 đổi câu chỉ dẫn ngày 17/08; E3/E6/E7 carry-forward từ round 2 (delta không chạm paths của các eval này); panel E4/E5 giữ nguyên PASS; toàn bộ 12 eval PASS, verdict tổng PASS.

## Ngoài hợp đồng

Năm phát hiện của vòng 3 là lỗi THẬT nhưng nằm ngoài phạm vi đã duyệt ở Cổng
Phạm vi; người quyết xếp cả năm vào Known limits (không cái nào đổi thứ người
dùng thấy — đều là độ chặt của phép đo nội bộ). Chi tiết nguyên văn ở
`review-findings.md`.

## Known limits

- **Khuôn nhật-ký-vấp còn một ô ghi kiểu khác nếp.** Ô «số câu chuyển phiên
  người» dùng chỗ-trống `{n}` thay vì `{chuyen_phien_nguoi}` như mọi khuôn
  khác; công cụ điền khuôn tự động sau này có thể bỏ sót ô đó mà không kêu.
  Tái lập: `grep '{n}' skills/acceptance/references/stranger-drive-template.md`.
- **Nhãn của một bài kiểm nội bộ ghi «3 phép thử phá» trong khi nó chạy 4.**
  Số thật in ở dòng kết quả; không che lỗi nào, nhưng người đọc log có thể
  hiểu nhầm mức đã kiểm. Tái lập: `grep -n '3 mutant' tests/plugins/run-tests.sh`.
- **Bảng kiểm của thẻ thiếu một ô: hồ sơ cơ hội CÓ mà không đọc được.** Thẻ có
  nhánh riêng cho ca này (cờ vàng «không đọc được»), nhưng không ô kiểm nào
  bắt buộc nó xuất hiện — gỡ nhánh đó đi thì bài kiểm vẫn xanh.
- **Hai phép kiểm «khuôn cũ không còn» chưa từng chạy chiều đỏ.** Chúng nằm
  ngoài hàm kiểm nên ba phép thử phá không chạm tới; nếu chúng hỏng thì im
  lặng. Tái lập: `bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan khuon`.
- **Ô «có ngưỡng» chỉ đo một chiều.** Có kiểm «phải hiện khối ngưỡng», chưa
  kiểm «và không được hiện cờ chưa-khai» — chiều ngược đã có phép thử phá.

- **Điều kiện tự đặt trong Notes đã được owner miễn.** Hợp đồng ghi «ký sau
  khi đọc mục lỗ-kit của vòng refine-editor (máy B)»; owner quyết merge trước
  khi vòng đó tới mốc đó (18/08). Số liệu vòng refine-editor vẫn về sau và là
  đầu vào cho hồ sơ kế, không mất; đường đảo: revert một commit merge.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
