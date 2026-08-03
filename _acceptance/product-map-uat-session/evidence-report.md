---
schema_version: 2
feature_slug: product-map-uat-session
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 08e6bae48f80c675bfaf34f6bbfcbc3a47b9aa5f
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
| E13 | AC-13 | judgment | PASS |
| E14 | AC-6 | script | PASS |
| E15 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E9
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS, đồng thuận cả 3 lens (không phân rẽ) — không đổi so với round 1. Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E9" ngay dưới Evidence.

- eval: E10
  run_id: minted-product-map-uat-session-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

- eval: E13
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS trên phiếu 2/3 (domain-correctness và spec-alignment PASS; operational-feasibility vẫn FAIL) — đổi so với round 1, khi cả 3 lens đồng thuận thất bại. Dissent của operational-feasibility KHÔNG bị gộp/ẩn — giữ nguyên toàn văn ở section "Judge panel — E13" ngay dưới Evidence, cho người đọc tại Cổng 2.

- eval: E14
  run_id: minted-product-map-uat-session-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T15:29:00Z
  output: |
      plugins/ mirror in sync.

- eval: E15
  run_id: minted-product-map-uat-session-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:29:00Z
  output: |
      PASS: P110 ban do va bo quet dong ket luan tren moi ca ho so hong (E1,E10)

      Results: all plugin tests passed

### Judge panel — E9 (AC-9)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt của §2.3: điều kiện vào ở §0 (signed-off + ngưỡng UAT chốt tại Cổng Đáng + sản phẩm thật sau flag) → chép nguyên văn ngưỡng và cấm sửa sau khi thấy số ở §1 → mời người ở §2 → chấm kín TRƯỚC thảo luận cộng câu ràng buộc "gửi cho khách nào, khi nào?" (commitment device) ở §3 → đặt số cạnh ngưỡng ở §4 → verdict human-owned ("Agent KHÔNG điền verdict thay người") ở §5 → làm mới PRODUCT-MAP sau ký ở §6. Câu "KILL là thành công của quy trình" xuất hiện nguyên văn ngay đầu file và lặp lại ở bước quyết định/sau ký. Không thấy chốt nào của spec bị thiếu, đảo thứ tự, hay diễn giải sai.
- operational-feasibility: PASS — SKILL.md giữ đủ 7 chốt đúng thứ tự spec §2.3: §0 điều kiện vào (signed-off + ngưỡng UAT chốt tại Cổng Đáng) → §1 chép nguyên văn ngưỡng + cấm sửa sau khi thấy số → §3 chấm kín trước thảo luận cùng câu ràng buộc commitment device → §5 verdict do người ký điền, "Agent KHÔNG điền verdict thay người" → §6 làm mới PRODUCT-MAP sau khi ký. Câu "KILL là thành công của quy trình" xuất hiện nguyên văn ở đầu skill, khớp diễn đạt spec (mua bằng giá một vòng dựng/build, không phải thất bại người làm).
- spec-alignment: PASS — Skill uat-session giữ đủ 7 chốt của §2.3 đúng nội dung và đúng thứ tự: điều kiện vào kiểm signed-off + ngưỡng UAT tại opportunity.md (mục 0); chép nguyên văn ngưỡng + khoá sửa-sau-khi-thấy-số (mục 1); chấm kín TRƯỚC khối "Thảo luận" (mục 3) cùng lúc với commitment device "gửi cho khách nào, khi nào?" (mục 3, khớp cách spec gộp hai thứ này lại với nhau); verdict do người ký điền, agent tường minh cấm điền thay (mục 5); câu "KILL là thành công của quy trình" xuất hiện cả ở đầu file lẫn phần trình quyết định; làm mới PRODUCT-MAP đặt đúng ở bước sau ký (mục 6).

### Judge panel — E13 (AC-13)

Đề xuất tổng hợp của panel: PASS trên phiếu 2/3 — domain-correctness và spec-alignment PASS, operational-feasibility FAIL. Không phải đồng thuận (khác round 1, khi cả 3 lens cùng thất bại). Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại — bao gồm cả phiếu bất đồng):

- domain-correctness: PASS — Phần TỰ VIẾT đạt N1-N6: ghi chú đầu file PRODUCT-MAP.md ("Máy sinh từ hồ sơ... đừng sửa tay") và dòng bản đồ trên thẻ /start (start.md dòng 48-53: "chưa có bản đồ sản phẩm", "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh", "chưa kiểm được bản đồ") đều chủ ngữ là sản phẩm, không tên file, qua được phép thử xoá-tên-máy; tiêu đề mục "Ngoài phạm vi đã ký" cũng sạch — chỉ có "Đã ship" (PRODUCT-MAP.md:10) và "nghiệm thu máy" (dòng 6) là biệt ngữ nhẹ chưa có mục trong CONTEXT.md (N6), không chặn hiểu nhưng đáng ghi nợ. Phần THỪA HƯỞNG (các dòng "Vòng đang mở"/"Đã ship" — copy nguyên văn trường `feature:` từ contract.md cũ, đối chiếu trực tiếp khớp 100%) không đạt N1/N2: chủ ngữ là slug/tên feature, chèn thẳng tên file kỹ thuật (`claim-scan.mjs`, `lib/md-section.js`) vào câu — nhưng lỗi này thuộc về các hồ sơ đã ký cũ, không phải phần chữ feature này tự viết ra.
- operational-feasibility: FAIL — Phần TỰ VIẾT đạt: tiêu đề, ghi chú đầu file, ba tiêu đề mục của PRODUCT-MAP.md và dòng bản đồ trên thẻ /start (map.present/map.fresh/broken[]) đều dùng chủ ngữ sản phẩm/trạng thái, không nhồi mã máy trần trụi, qua được phép thử xoá-tên-máy. Nhưng phần THỪA HƯỞNG nguyên văn trường feature: (mọi dòng trong "Vòng đang mở"/"Đã ship" — phần chiếm gần hết nội dung mắt người thật sự đọc) vi phạm rõ N2/N3/N6: slug kỹ thuật kiểu thư mục (`s4-scope-triage`, `t1-escape-event-scope`, `premerge-unjudged-pass`) làm chủ ngữ/tiêu đề dòng thay vì xuống ngoặc, mã như "S4", "T1-escape", "PASS" xuất hiện không kèm 3-5 chữ giải nghĩa, và biệt ngữ nội bộ ("răng T1-escape", "biên merge", "tàng hình") không có trong CONTEXT.md. Lỗi này thuộc về hồ sơ cũ đã ký (trường feature: gốc), không phải bộ sinh PRODUCT-MAP hay dòng thẻ /start của feature này — nhưng vì nó là phần người không-kỹ-thuật thực sự phải đọc để hiểu "đã ship gì", nó khiến AC-13 không đạt trên tổng thể.
- spec-alignment: PASS — Phần TỰ VIẾT đạt N1–N6: tiêu đề, hai dòng ghi chú đầu file, tên ba mục ("Vòng đang mở", "Đã ship", "Ngoài phạm vi đã ký"), và ba dòng bản đồ trên thẻ /start ("chưa có bản đồ sản phẩm...", "bản đồ đang lệch với hồ sơ...", "chưa kiểm được bản đồ") đều có chủ ngữ là sản phẩm/người dùng, một dòng một ý, tên kỹ thuật (map.present, _acceptance/) đã xuống backtick/ngoặc đúng N2 — qua được phép thử xoá-tên-máy. Phần THỪA HƯỞNG nguyên văn trường feature: (mô tả bullet dưới "Đã ship"/"Vòng đang mở", vd "claim-scan.mjs", "gap-probe S1", "lib/md-section.js", "round-trip") vi phạm N1/N2/N3/N6 rõ — xoá tên máy thì rỗng nghĩa — nhưng lỗi này thuộc về cách viết trường feature: của các hồ sơ cũ đã ký trước, không phải lỗi của bộ sinh PRODUCT-MAP.md hay dòng thẻ /start mà feature này tự viết.

## Analyst

- `bash tests/plugins/run-tests.sh` → E1, E2, E3, E4, E5, E6, E8, E10, E11, E12, E15: pass trên CẢ HEAD lẫn diffBase (baseline: green). Lệnh này là SUITE dùng chung nên phần lớn case trong đó không đụng nhánh product-map/uat-session, baseline cũng xanh; không tự nó chứng minh feature vô hại. Sức phân biệt thật nằm ở đột biến nội bộ từng case (tiêm enum lạc, xoá field, đảo thứ tự, marker sai...) mô tả trong cột `expected` của từng eval.
- `bash scripts/sync-plugin-packages.sh --check` → E14: pass trên cả hai phía — guard chuẩn cho AC-6 (mirror sync), đối chứng dương đã có sẵn từ trước feature này (pattern P30), không phải hồi quy riêng của feature này.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 round này).

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E12, E14) PASS. E9 (AC-9, judgment) panel đồng thuận PASS. E13 (AC-13, judgment) panel đồng thuận thất bại về chất lượng ngôn-ngữ-mặt-người của phần thân PRODUCT-MAP.md (N1/N3/N6) — ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, verdict tổng PENDING-JUDGMENT, chuyển tới Cổng 2 cho người quyết trực tiếp.
Round 2: toàn bộ 13 eval máy/script (E1-E8, E10-E12, E14, E15 — E15 mới thêm round này) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ đồng thuận-thất-bại (round 1) sang chia phiếu 2/3 PASS (domain-correctness, spec-alignment) với operational-feasibility vẫn FAIL — dissent chép đầy đủ ở "Judge panel — E13". Verdict tổng round này: REJECT, failed_evals: [] (không eval máy nào fail; căn cứ scope-triage và các phát hiện ngoài hợp đồng nằm ở review-findings.md).

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
