## Trong hợp đồng

### Spec artifacts still pin 4 clauses / 14 mutants; shipped measure is 6 / 18
- file: `_acceptance/matrix-measure-law/evals.yaml:66`
- severity: medium
- source: conventions
- AC: AC-7

Commit 36401e1 (S4-r1) added 2 cross-check clauses (chỉ-dẫn-vs-đầu-ra, hardcode-ROOT) to both SKILLs and grew the mutation matrix to 18 (6 shape + 6 VI + 6 EN — confirmed by running tests/workflows/measure-law-mutants.test.mjs: "MM7 ma trận 18 mutant", 28 pass). But the written-in-advance measure specs were not swept: evals.yaml M1 (line 10) says "đủ 4 câu", M2 (line 20) "đủ 4 quan hệ", M7 (line 66) "14 mutant … (4) … (4)"; contract.md AC-1 (line 26) "đủ 4 câu hỏi (a)–(d)", AC-7 (line 50) "14 mutant (6+4+4)", frontmatter feature line 3 "(4 câu cross-check)"; PRODUCT-MAP.md line 26 "(4 câu cross-check)". This violates the repo's own invariant being shipped here — "thước gắn vào vật được giao" / "số assert = số phần tử" — and the CLAUDE.md class-sweep rule: the earlier gap-probe fix kept AC-7 "khớp số" when the matrix grew to 14, but the 14→18 growth was not propagated. A human counting evidence at Gate 2 against evals.yaml/contract will see numbers that disagree with the run output.

AC rationale: AC-7 chốt cứng công thức 14 mutant (6 shape + 4 câu + 4 câu) nhưng artifact khai và measure chạy thực tế là 18 (6+6+6) — lệch đúng con số trong Then của AC-7.

### AC-6 promises the invariants-branch prompt intact, but MM6 pins only conventions + bugs
- file: `tests/workflows/measure-law-mutants.test.mjs:44`
- severity: low
- source: conventions
- AC: AC-6

contract.md AC-6 says "2 finder cũ (conventions/invariants + bugs) nguyên vẹn TỪNG CHỮ prompt", but MM6's git-anchored word-for-word comparison loops only ['conventions', 'bugs'] (line 44). The 'invariants' branch of the first REVIEWERS element (the reviewSkillPath ternary in feature-loop/workflows/acceptance-verify.js) is never compared, even though the same grab regex would extract it. The diff does not touch that prompt today, so behavior is intact — but the guard is narrower than the promise (the repo's own "measure narrower than the delivered thing" shape): a future edit to the invariants prompt would pass MM6 while AC-6 claims it is pinned.

AC rationale: AC-6 yêu cầu 2 finder cũ (gồm nhánh invariants) nguyên vẹn từng chữ prompt được xác minh, nhưng MM6 chỉ đối chiếu 'conventions' và 'bugs', bỏ sót đúng nhánh invariants mà AC-6 hứa pin.

### Ma trận khai-trước (4 câu/14 mutant) lệch ma trận giao (6 câu/18 mutant) — file test tự mâu thuẫn
- file: `tests/workflows/measure-law-mutants.test.mjs:2`
- severity: medium
- source: bugs
- AC: AC-7

Header comment dòng 2 khai "ma trận mutation toàn phần viết-trước 14 phần tử (6 shape + 4 câu SKILL feature-loop + 4 câu SKILL codex)" nhưng chính file đó chạy 18 mutant (dòng 70 log "18 mutant... 6 câu VI + 6 câu EN"; MEASURE_CLAUSES_VI/EN mỗi bên 6 phần tử). Cùng lệch ở các artifact đo trong cùng diff: _acceptance/matrix-measure-law/contract.md AC-1 (dòng 26: "đủ 4 câu hỏi", liệt kê a-d), AC-7 (dòng 48-50: "14 mutant (6+4+4)"), evals.yaml M1/M2 (dòng 10, 20: "đủ 4 câu") và M7 (dòng 66: "14 mutant... (4)... (4)"), gap-probe.md ("fixed: M7 thành 14 mutant, AC-7 khớp số"), và plugin.json v1.23 description chỉ liệt kê 4 mục cross-check. Thực tế SKILL cả 2 harness chứa 6 câu (thêm "chỉ dẫn vs đầu ra" + "hardcode ROOT"). Hướng lệch là chặt hơn (không false-green), nhưng expected của eval M1/M7 và AC-7 giờ mô tả SAI phép đo đang giao — vi phạm chính luật của feature này ("ma trận toàn phần viết-trước, số assert = số phần tử"): người/judge đếm theo 14 sẽ đối chiếu nhầm vật, và contract đã seal Gate 1 không khớp bản giao.

AC rationale: Cùng lớp lệch số với AC-7: contract/evals khai 14 mutant (6+4+4) trong khi measure thực tế chạy 18 (6+6+6), lệch đúng con số trong Then của AC-7.

### Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: red-probe-artifact.md không do code nào sinh ra
- file: `_acceptance/matrix-measure-law/evidence/red-probe-artifact.md:3`
- severity: high
- source: measurement
- AC: AC-9

Fixture cho judgment eval M11 tự nhận "khối A sinh từ HÌNH DẠNG 4... của design doc" và evals.yaml M11 (dòng 122-124) mô tả nó là "sinh kèm ghi chú nguồn khuôn" — nhưng không có code path nào sinh file này: grep toàn repo chỉ thấy nó được nhắc trong docs/plan/usage-report/evals/gap-probe, và commit 072eb39 thêm nó như một file markdown tĩnh viết tay. Đây đúng nguyên văn bài học lịch sử shape 2 ("fixture cho judge là văn viết tay không code path nào sinh ra"): khối A/B được tác giả soạn theo đúng khuôn mà critic (bên đọc) mong đợi, nên M11 đo được "critic bắt được văn mẫu của tác giả" chứ không đo "critic bắt được vi phạm do artifact thật sinh ra". Chữ "sinh" trong ghi chú nguồn làm phép đo trông như round-trip trong khi không có writer nào tồn tại.

AC rationale: AC-9 đòi M11 đo "hành vi thật" qua fixture gài-vi-phạm để đo đầu ra chứ không chỉ chỉ dẫn; fixture viết tay đúng khuôn bên đọc khiến M11 không còn đo đầu ra thật như AC-9 hứa.

### Hình dạng 5 — Ma trận viết-trước lệch số phần tử: eval khai 14 mutant (6+4+4) nhưng bài đo chạy 18 (6+6+6)
- file: `_acceptance/matrix-measure-law/evals.yaml:66`
- severity: medium
- source: measurement
- AC: AC-7

Luật của chính feature này là "số assert = số phần tử, ma trận viết-trước". Nhưng thước và vật đang lệch nhau về số phần tử ở BA chỗ cùng lớp: (1) M7 expected khai "14 mutant... xoá từng câu đối chiếu chéo (4)... xoá từng câu tương đương (4)" trong khi skill-claims.test.mjs có MEASURE_CLAUSES_VI = 6 phần tử (dòng 63-70) và MEASURE_CLAUSES_EN = 6 (dòng 71-78), tức 6+6+6 = 18 mutant; (2) M1 expected (dòng 10) khai "đủ 4 câu lớp-đo-lường" và liệt kê đúng 4 quan hệ, thiếu 2 câu "chỉ dẫn vs đầu ra" và "hardcode ROOT" mà test đang assert; (3) M2 (dòng 20) khai "4 câu tương đương". Ngay trong measure-law-mutants.test.mjs, comment đầu file (dòng 2-4) khai "14 phần tử (6 shape + 4 câu + 4 câu)" còn console.log dòng 70 khai "18 mutant (6+6+6)". Ma trận viết-trước (evals.yaml — thước của record cho Cổng 2) không còn khớp từng-phần-tử với ma trận đã chạy: verifier đọc M7/M1 không thể đếm-đối-chiếu để xác nhận không sót phần tử, đúng lỗ mà shape 5 tồn tại để chặn.

AC rationale: Cùng nội dung với finding lệch số mutant khác: eval M7/AC-7 khai 14 (6+4+4) trong khi measure thực tế 18 (6+6+6) — lệch đúng con số Then của AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **measure-law-mutants.test.mjs header comment contradicts its own matrix (14 vs 18)**
  Người dùng thấy gì: Ghi chú mô tả trong bộ kiểm thử nói khác với số lượng kịch bản đang thực sự chạy, có thể khiến người đọc sau này hiểu nhầm là phạm vi kiểm tra hẹp hơn thực tế.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/workflows/measure-law-mutants.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 áp cho meta-thước — nhánh 'prompt thiếu pin' của measureShapes không có mutant nào làm nó đỏ**
  Người dùng thấy gì: Một nhánh kiểm tra bên trong công cụ đo (trường hợp lời nhắc thiếu mục cần ghim) chưa từng được thử bằng một tình huống giả lập lỗi thật, nên nếu nhánh đó bị hỏng trong tương lai sẽ không ai phát hiện ra.
  file: `tests/workflows/measure-law-mutants.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — đếm REVIEWERS bằng regex hình-dạng-dòng trong khi lời hứa là quan hệ REVIEWERS.length == 3**
  Người dùng thấy gì: Cách đếm số người kiểm tra dựa vào cách trình bày dòng chữ cụ thể; nếu có người thêm một người kiểm tra mới theo cách viết khác đi, công cụ có thể vẫn báo đủ số như cũ dù thực tế đã thiếu người kiểm tra.
  file: `tests/workflows/measure-law-mutants.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

### v1.23 plugin descriptions enumerate only 4 of the 6 gap-probe cross-check shapes
- file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/.claude-plugin/plugin.json:4`
- severity: low
- source: conventions

Both manifests (feature-loop/.claude-plugin/plugin.json:4 and codex/feature-loop-codex/.codex-plugin/plugin.json:4, plus their plugins/ mirror copies) describe v1.23's gap-probe block as "(full-matrix / positive-control+pinned-message / code-generated-round-trip / vocabulary-vs-relationship)" — written at the bump commit (ac4880d) before S4-r1 added instructions-vs-output and hardcode-ROOT. The description now under-states the shipped cross-check block. Fixing requires re-running scripts/sync-plugin-packages.sh so the mirror stays in sync (P30).

## Chưa adversarial-verify (refuter chết)

(không có finding nào ở trạng thái refuter chết trong round này)

⚠ Cụm ngoài vùng phủ: 4/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/matrix-measure-law/evals.yaml, feature-loop/.claude-plugin/plugin.json, _acceptance/matrix-measure-law/evidence/red-probe-artifact.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
