---
schema_version: 2
feature_slug: product-map-uat-session
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 79564bf0cb2168408c60b16988ab7bc243bac1ec
human_signoff:
---

# Evidence Report: product-map-uat-session

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | judgment | FAIL |
| E14 | AC-6 | script | PASS |
| E15 | AC-1 | test | PASS |
| E16 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E9
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS, đồng thuận cả 3 lens (không phân rẽ) — không đổi so với round 1 và round 2. Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E9" ngay dưới Evidence.

- eval: E10
  run_id: minted-product-map-uat-session-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E13
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: FAIL
  rationale: Đề xuất tổng hợp của panel round này là FAIL trên phiếu 2/3 (domain-correctness và operational-feasibility FAIL; spec-alignment PASS) — đổi so với round 2, khi domain-correctness và spec-alignment PASS còn operational-feasibility FAIL (PASS 2/3). Cả ba phiếu, kể cả phiếu bất đồng, KHÔNG bị gộp/ẩn — giữ nguyên toàn văn ở section "Judge panel — E13" ngay dưới Evidence, cho người đọc tại Cổng 2.

- eval: E14
  run_id: minted-product-map-uat-session-E14-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T09:11:55Z
  output: |
      plugins/ mirror in sync.

- eval: E15
  run_id: minted-product-map-uat-session-E15-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

- eval: E16
  run_id: minted-product-map-uat-session-E16-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T09:11:55Z
  output: |
      PASS: P111 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)

      Results: all plugin tests passed

### Judge panel — E9 (AC-9)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — SKILL.md giữ đủ 7 chốt của §2.3: điều kiện vào (contract signed-off + ngưỡng UAT chốt tại Cổng Đáng, mục 0), chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (mục 1), chấm kín trước thảo luận cùng commitment device "gửi cho khách nào, khi nào?" (mục 3), verdict do người ký điền — "Agent KHÔNG điền verdict thay người" (mục 5), câu KILL-là-thành-công (nêu ở đầu file, gắn chỉ dẫn "nói câu đó ra khi trình quyết định" tức đúng thời điểm mục 5), và làm mới PRODUCT-MAP sau ký (mục 6). Thứ tự các mục khớp trình tự spec: vào cổng → dựng hồ sơ/ngưỡng → mời người → chấm kín+cam kết → đo cạnh ngưỡng → người ký → sau ký.
- operational-feasibility: PASS — SKILL.md giữ đủ 7 chốt của §2.3 đúng thứ tự vận hành: điều kiện vào bắt signed-off + ngưỡng UAT đã chốt ở Cổng Đáng (mục 0) → chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (mục 1) → chấm kín trước thảo luận + commitment device "gửi cho khách nào, khi nào?" (mục 3) → số đo từ tracking thật cạnh ngưỡng (mục 4) → verdict do người ký, agent không điền thay (mục 5) → làm mới bản đồ sau ký (mục 6). Câu "KILL tại cổng này là THÀNH CÔNG của quy trình" xuất hiện ngay đầu file, đúng tinh thần Cổng Giá Trị trong spec.
- spec-alignment: PASS — SKILL.md giữ đủ 7 chốt của §2.3 đúng thứ tự: điều kiện vào (signed-off + ngưỡng UAT đã chốt tại Cổng Đáng, §0) → chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (đổi thật phải ghi SUPERSEDED và dừng chờ Cổng Đáng, §1) → mời người (§2) → chấm kín trước thảo luận kèm commitment device "gửi cho khách nào, khi nào?" (§3) → đặt số cạnh ngưỡng (§4) → verdict do người ký, agent bị cấm tự điền (§5) → làm mới PRODUCT-MAP sau ký (§6). Câu "KILL là thành công của quy trình" xuất hiện tường minh và đúng ngữ cảnh (trình quyết định, không phải thất bại người làm).

### Judge panel — E13 (AC-13)

Đề xuất tổng hợp của panel: FAIL trên phiếu 2/3 — domain-correctness và operational-feasibility FAIL, spec-alignment PASS. Không phải đồng thuận. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại — bao gồm cả phiếu bất đồng):

- domain-correctness: FAIL — Phần bản đồ TỰ VIẾT đạt: tiêu đề "# Bản đồ sản phẩm", ghi chú đầu file, 3 tiêu đề mục ("Vòng đang mở…", "Đã ship", "Ngoài phạm vi đã ký"), và dòng bản đồ trên thẻ /start (start.md dòng 48-53: "chưa có bản đồ sản phẩm…", "bản đồ đang lệch với hồ sơ…") đều qua phép thử xoá-tên-máy, chủ ngữ là bản đồ/sản phẩm, không nhồi tên kỹ thuật ra ngoài ngoặc. Phần THỪA HƯỞNG (mô tả sau mỗi slug, nguyên văn trường feature của các hồ sơ cũ) không đạt: hầu hết bullet trong "Đã ship" đọc như log kỹ thuật — `claim-scan.mjs`, `lib/md-section.js`, "frontmatter", "persist", "round-trip", "T1-escape", "diff", "gap-probe S1" — vi phạm N1 (chủ ngữ là cơ chế máy chứ không phải người dùng/sản phẩm), N2 (tên kỹ thuật nằm ngay trong câu chính chứ không xuống ngoặc), và N3/N6 (mã và biệt ngữ xuất hiện lần đầu không kèm 3-5 chữ giải thích, không có trong CONTEXT.md của kit). Vì phần nội dung chính người đọc cần (bản tóm việc đã ship) nằm ở phần thừa hưởng và phần đó hỏng nặng, tài liệu không đạt phép thử người-thứ-ba dù khung tự viết đạt — lỗi thuộc về nội dung thừa hưởng từ hồ sơ feature cũ, không thuộc bộ sinh bản đồ hay thẻ /start.
- operational-feasibility: FAIL — Phần map TỰ VIẾT đạt: tiêu đề, ghi chú đầu file ("Máy sinh từ hồ sơ...", "Bản đồ được làm mới..."), 3 tiêu đề mục, và dòng bản đồ trên thẻ /start (start.md bước 3, "chưa có bản đồ sản phẩm", "bản đồ đang lệch với hồ sơ") đều ngắn, không tên file làm chủ ngữ, qua được phép thử xoá-tên-máy. Nhưng phần THỪA HƯỞNG nguyên văn trường feature — tức nội dung thật của gần hết các dòng "Đã ship" — vi phạm nặng N1/N2/N3/N6: chủ ngữ là cơ chế/file ("6 cửa parse trong claim-scan.mjs", "gap-probe S1 đọc... qua claim-scan.mjs"), biệt ngữ không giải nghĩa ("biên merge", "chữ ký giữ-chỗ", "slug tự khai phát hành", "persist", "N5") — người không đọc code không thể kể lại "người dùng thấy gì khác" từ các dòng này. Vì phần bị thẩm hưởng là nội dung chiếm phần lớn diện tích trình cho người (không phải khung xung quanh), lỗi thuộc về trường feature của các hồ sơ cũ đã ký (upstream), không phải bộ sinh PRODUCT-MAP.md hay khuôn thẻ /start.
- spec-alignment: PASS — Phần TỰ VIẾT (ghi chú đầu file PRODUCT-MAP.md "Máy sinh từ hồ sơ... đừng sửa tay", ba tiêu đề mục, và ba dòng bản đồ trên thẻ /start ở start.md dòng 48-53) đạt N1-N6: chủ ngữ là sản phẩm/trạng thái chứ không phải file, tên kỹ thuật (`_acceptance/`, map.present) xuống backtick đúng N2, một dòng một ý, qua phép thử xoá-tên-máy — chỉ nợ nhẹ N6 với từ mượn "ship"/"nghiệm thu máy" chưa có mục trong CONTEXT.md, không chặn hiểu. Phần THỪA HƯỞNG nguyên văn trường `feature:` từ các hồ sơ đã ký cũ (các dòng bullet dưới "Vòng đang mở"/"Đã ship", vd chèn thẳng `claim-scan.mjs`, `lib/md-section.js`) vi phạm rõ N1-N3/N6, nhưng lỗi này thuộc về cách viết trường feature của các contract cũ — không phải phần chữ mà bộ sinh PRODUCT-MAP hay dòng thẻ /start của feature này tự viết ra, và việc không sửa nó là chủ đích đã khai báo (view thuần, "đừng sửa tay").

## Analyst

- `bash tests/plugins/run-tests.sh` → E1, E2, E3, E4, E5, E6, E8, E10, E11, E12, E15, E16: pass trên CẢ HEAD lẫn diffBase (baseline: green). Lệnh này là SUITE dùng chung nên phần lớn case trong đó không đụng nhánh product-map/uat-session, baseline cũng xanh; không tự nó chứng minh feature vô hại. Sức phân biệt thật nằm ở đột biến nội bộ từng case (tiêm enum lạc, xoá field, đảo thứ tự, marker sai...) mô tả trong cột `expected` của từng eval — bao gồm cả E16 (case P111) mới thêm round này.
- `bash scripts/sync-plugin-packages.sh --check` → E14: pass trên cả hai phía — guard chuẩn cho AC-6 (mirror sync), đối chứng dương đã có sẵn từ trước feature này (pattern P30), không phải hồi quy riêng của feature này.

Các lệnh suite chung khác chạy round này (`bash tests/scripts/run-tests.sh` — 596 passed, `bash tests/hooks/run-tests.sh` — 51 passed, `bash tests/workflows/run-tests.sh` — 10 passed) không gán eval nào (regression-guard chung của kit, xanh cả hai phía theo quy ước), nên không liệt kê ở đây.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 round này).

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E12, E14) PASS. E9 (AC-9, judgment) panel đồng thuận PASS. E13 (AC-13, judgment) panel đồng thuận thất bại về chất lượng ngôn-ngữ-mặt-người của phần thân PRODUCT-MAP.md (N1/N3/N6) — ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, verdict tổng PENDING-JUDGMENT, chuyển tới Cổng 2 cho người quyết trực tiếp.
Round 2: toàn bộ 13 eval máy/script (E1-E8, E10-E12, E14, E15 — E15 mới thêm round này) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ đồng thuận-thất-bại (round 1) sang chia phiếu 2/3 PASS (domain-correctness, spec-alignment) với operational-feasibility vẫn FAIL — dissent chép đầy đủ ở "Judge panel — E13". Verdict tổng round này: REJECT, failed_evals: [] (không eval máy nào fail; căn cứ scope-triage và các phát hiện ngoài hợp đồng nằm ở review-findings.md).
Round 3: toàn bộ 14 eval máy/script (E1-E8, E10-E12, E14, E15, E16 — E16 mới thêm round này, case P111) PASS, exit 0, gồm cả E7 (script, baseline: red). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ chia phiếu PASS 2/3 (round 2) sang chia phiếu FAIL 2/3 round này (domain-correctness và operational-feasibility FAIL, spec-alignment PASS) — dissent đầy đủ ở "Judge panel — E13". Song song, scope-triage review (review-findings.md) tìm được 1 finding "Trong hợp đồng" mức high, map AC-1: `lib/workspace-record.js:61` — hàm `recordProblem` không còn coi thư mục `_acceptance/<slug>/` chỉ có `uat-session.md` (thiếu cả contract.md lẫn opportunity.md) là hồ sơ hỏng, khiến `scripts/start-scan.mjs` làm slug đó biến mất khỏi MỌI nhóm trên thẻ /start (không gates, không inProgress, không done, không broken — regression so với 9732271) và `scripts/product-map.mjs` xếp sai slug đó vào mục "Đang cân nhắc cơ hội" dù không có opportunity.md — hai reader trái nhau trên cùng một sự thật, đúng lớp false-green mà module này được dựng ra để diệt, nhưng P110 không bắt được vì thiếu hình dạng fixture "chỉ-có-uat-session.md". Verdict tổng round này: REJECT. failed_evals: [] (không lệnh máy nào exit khác 0) — REJECT căn cứ (a) panel E13 chia phiếu nghiêng FAIL và (b) finding "Trong hợp đồng" mức high/AC-1 nói trên, được dựng lại và chạy thật, không phải suy đoán.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
