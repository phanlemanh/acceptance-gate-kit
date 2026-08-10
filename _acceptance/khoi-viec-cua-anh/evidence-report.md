---
schema_version: 2
feature_slug: khoi-viec-cua-anh
verdict: PENDING-JUDGMENT
failed_evals: []
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 94d4ba741d111a0f3cce811c03c68675683781cb
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: khoi-viec-cua-anh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-khoi-viec-cua-anh-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-khoi-viec-cua-anh-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-viec-cua-anh-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-khoi-viec-cua-anh-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-khoi-viec-cua-anh-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-khoi-viec-cua-anh-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T10:00:00Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)

    Results: all plugin tests passed

- eval: E7
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  rationale: Panel chia phiếu — domain-correctness và spec-alignment nêu cùng một lỗ (mã "E9" xuất hiện trần trụi ba lần trong mục "Chấm E9" của khối VIỆC CỦA ANH trên thẻ Cổng 2 ký được, không có 3-5 chữ chú giải, và mã đó cũng không hiện ở mục judgment mà mục này trỏ tới); operational-feasibility quét toàn bộ ba thẻ và hai khuôn lời-mời, không thấy vi phạm 3-vế/dòng-Trả-lời-mẫu/không-cần-làm-gì/cấm-câu-hỏi. Hai phiếu FAIL và một phiếu PASS đều có căn cứ cụ thể trỏ vào cùng một vị trí trên thẻ — cần người xem trực tiếp evidence/p186-card-gate2.html để quyết.
  votes:
    - domain-correctness: FAIL — Khối "👉 VIỆC CỦA ANH" trên thẻ Cổng 2 ký được (p186) dùng mã "E9" trần trụi ba lần trong mục "Chấm E9" mà không kèm 3-5 chữ nói nó là gì (vi phạm N3) — trong khi mục "Ngoài-1" ngay bên cạnh có gloss đầy đủ ("Ngoài-1 · Lỗi hiếm khi tên file có dấu hỏi"), cho thấy đây là khoảng trống thật chứ không phải giới hạn chung của khuôn. Tệ hơn, "E9" không xuất hiện ở đâu khác trên thẻ kể cả trong khối "Việc chỉ mình bạn quyết được" mà mục này trỏ tới (khối đó chỉ hiện "Given a, When b, Then c." không nhãn) — nên "ở đâu" của mục này không thực sự dẫn được người không đọc code tới đúng chỗ.
    - operational-feasibility: PASS — Ca ba the (p185/p186/p187) deu co khoi 👉 VIEC CUA ANH voi tung muc du 3 ve lam-gi/o-dau/tra-loi-dang, cau "Tra loi mau" nam gon mot dong chep duoc ngay (vd the Cong 1: «Duyet» — hoac «Sua: neu dieu can doi»; the Cong 2 ky duoc: mot dong gop 5 muc); the khong-ky-duoc (p187) mo dau dung "khong can lam gi" kem cau may dang lam gi tiep va khong co muc nao doi tra loi. Quet toan bo van ban ba the va hai khoi khuon YOUR-MOVE-BLOCK-TEMPLATE/GATE-INVITE-CLAUSE trong human-facing-language.md khong thay dau hoi tu tu nao lot (khop N cam-dau-hoi); khuon GATE-INVITE-CLAUSE tu no nhac lai du bon chuan (3 ve, mau gop mot dong, chi-bao khong-can-lam-gi, cam cau hoi) nen mot phien khac doc rieng khoi nay van du de viet dung tin moi.
    - spec-alignment: FAIL — Khối 👉 VIỆC CỦA ANH trên p186 (Cổng 2 ký được) dùng mã "E9" ba lần ("Chấm E9", "đọc câu hỏi E9...", "«E9 Đạt» hoặc «E9 Chưa đạt»") mà không có 3-5 chữ nói E9 là gì — và mã này cũng không xuất hiện ở đâu khác trên thẻ (mục judgment phía trên chỉ ghi "Given a, When b, Then c." không gắn nhãn E9), nên lần đầu xuất hiện với người đọc là trắng trơn. Đây đúng khuôn vi phạm N3 mà chính human-facing-language.md nêu làm ví dụ mẫu ("Phục vụ AC-7, E12" → phải sửa thành có chú giải trong ngoặc) — người quyết không đọc code sẽ không biết phải "chấm" cái gì khi làm theo Trả lời mẫu. Các phần còn lại (thẻ Cổng 1, thẻ Cổng 2-reject, mục Ngoài-1, hai khuôn lời-mời YOUR-MOVE-BLOCK-TEMPLATE/GATE-INVITE-CLAUSE) đạt đủ 3 vế, mẫu gộp một dòng, "không cần làm gì" rõ, không câu hỏi tu từ lọt.
  required_evidence:
    - (domain-correctness) Sửa _acceptance/khoi-viec-cua-anh/evidence/p186-card-gate2.html (hoặc script gate-card.js sinh ra nó): thêm 3-5 chữ gloss ngay sau lần đầu 'E9' xuất hiện trong mục 'Chấm E9' của khối VIỆC CỦA ANH, cùng khuôn với 'Ngoài-1 · <gloss>' đã dùng cho mục Ngoài-1 trên cùng thẻ.
    - (domain-correctness) Sửa cùng file/script để mã 'E9' (hoặc gloss ngắn của nó) hiện NGAY trong khối 'Việc chỉ mình bạn quyết được' — cạnh dòng 'Given a, When b, Then c.' — để lời chỉ đường 'ở đâu: đọc câu hỏi E9 ở khối...' trong VIỆC CỦA ANH thực sự tìm được, không chỉ đúng bằng loại trừ.
    - (spec-alignment) Mở /Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/eager-bose-fab8fd/_acceptance/khoi-viec-cua-anh/evidence/p186-card-gate2.html, xem khối 👉 VIỆC CỦA ANH — nếu mục 'Chấm E9' được sửa thành có 3-5 chữ chú giải E9 là gì (vd 'Chấm E9 (câu hỏi chấp nhận X)') ngay tại lần xuất hiện đầu tiên trên thẻ, verdict đổi sang PASS.
  human_override:

## Analyst

- `bash tests/plugins/run-tests.sh`: E1, E2, E3, E4, E5, E6 — pass trên cả HEAD lẫn baseline (diffBase), nên không phân biệt được feature khỏi code cũ; cân nhắc viết lại từng case để assert hành vi MỚI của khối 👉 VIỆC CỦA ANH (thay vì chỉ "chuỗi có mặt"), hoặc xác nhận đây là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E6 (machine, `bash tests/plugins/run-tests.sh`) đạt trên HEAD; E7 (judgment) — panel chia phiếu (domain-correctness và spec-alignment nêu cùng một lỗ mã "E9" không chú giải, operational-feasibility không thấy vi phạm), giữ PENDING-JUDGMENT chờ người quyết ở Gate 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
