---
schema_version: 2
feature_slug: product-map-uat-session
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d98be0b4b47bec1cb7b94778c25dd03f5b2246c2
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
| E13 | AC-13 | judgment | UNCERTAIN |
| E14 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E9
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Cả ba lens đều PASS ở vòng này — skills/uat-session/SKILL.md giữ đủ và đúng thứ tự cả 7 chốt của §2.3 workflow-v2-spec.md: điều kiện vào kiểm cả signed-off VÀ ngưỡng UAT chốt tại Cổng Đáng (mục 0); chép nguyên văn ngưỡng + cấm sửa sau khi thấy số, có lối thoát SUPERSEDED (mục 1); chấm kín TRƯỚC khi mở thảo luận (mục 2→3) cùng commitment device đúng câu ví dụ của spec "gửi cho khách nào, khi nào?"; số đo đặt cạnh ngưỡng sau khi chấm kín (mục 4); verdict tường minh human-owned, cấm agent điền dù số đã rõ (mục 5); câu "KILL là thành công của quy trình" xuất hiện làm framing bắt buộc khi trình quyết định; làm mới PRODUCT-MAP sau ký khớp lệnh product-map.mjs của spec (mục 6). Không lens nào phát hiện chốt bị thiếu, đảo thứ tự hay diễn giải sai. Đầy đủ vote từng lens xem section "Judge panel — E9" ngay dưới Evidence.
  human_override:

- eval: E10
  run_id: minted-product-map-uat-session-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T14:00:00Z
  output: |
    PASS: P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)

    Results: all plugin tests passed

- eval: E13
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: UNCERTAIN
  rationale: Đề xuất chung của panel là thất bại — cả ba lens đồng thuận (không phân rẽ) rằng PRODUCT-MAP.md vi phạm luật ngôn-ngữ-mặt-người N1/N3/N6 ở phần thân (chủ ngữ là cơ chế/tên file máy thay vì người dùng/sản phẩm; biệt ngữ máy như "section-EOF", "frontmatter", "merge-boundary", "opt-out", "bump version", "persist", "hook write-time", "round-trip" xuất hiện không chú giải), dù ba dòng bản đồ hiển thị trên thẻ /start (map.present/map.fresh/broken[]) đạt chuẩn. Vì đây là câu hỏi chất lượng nội dung/mặt người trên một judgment item, tôi không tự chốt REJECT thay người — mục này ở UNCERTAIN, chờ người quyết trực tiếp tại Cổng 2 xem có chấp nhận làm known-limits hay yêu cầu viết lại phần thân PRODUCT-MAP.md trước khi ký. Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E13" ngay dưới Evidence.
  human_override:

- eval: E14
  run_id: minted-product-map-uat-session-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T14:00:00Z
  output: |
    plugins/ mirror in sync.

### Judge panel — E9 (AC-9)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — SKILL.md giữ đủ và đúng thứ tự cả 7 chốt của §2.3: điều kiện vào kiểm cả signed-off VÀ ngưỡng UAT chốt tại Cổng Đáng (mục 0); chép nguyên văn ngưỡng + cấm sửa sau khi thấy số, có lối thoát SUPERSEDED (mục 1); chấm kín trước khi mở thảo luận, đúng thứ tự sau khi mời người (mục 2→3); commitment device dùng đúng câu ví dụ của spec "gửi cho khách nào, khi nào?" (mục 3); số đo đặt cạnh ngưỡng sau khi chấm kín (mục 4); verdict tường minh human-owned, cấm agent điền dù số đã rõ (mục 5); câu "KILL là thành công của quy trình" xuất hiện làm framing bắt buộc nói ra khi trình quyết định; làm mới PRODUCT-MAP sau ký khớp lệnh product-map.mjs của spec (mục 6). Không phát hiện chốt nào bị thiếu, đảo thứ tự, hay diễn giải sai so với workflow-v2-spec.md §2.3.
- operational-feasibility: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt của §2.3: điều kiện vào (contract signed-off + ngưỡng UAT đã chốt tại Cổng Đáng, mục 0) → chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (mục 1) → chấm kín TRƯỚC thảo luận cùng commitment device "gửi cho khách nào, khi nào?" (mục 3) → đặt số đo cạnh ngưỡng từ tracking thật (mục 4) → verdict human-owned, agent không điền thay (mục 5) → làm mới bản đồ sau ký (mục 6). Câu "KILL là thành công của quy trình" xuất hiện ngay đầu file và được nhắc lại đúng thời điểm trình quyết định (mục 5), khớp nguyên văn với spec.
- spec-alignment: PASS — SKILL.md giữ đủ 7 chốt của §2.3 đúng thứ tự: điều kiện vào (§0: signed-off + ngưỡng UAT chốt tại Cổng Đáng) → chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (§1) → mời người (§2) → chấm kín trước thảo luận kèm commitment device "gửi cho khách nào, khi nào?" (§3) → đặt số cạnh ngưỡng (§4) → verdict human-owned, agent không điền thay (§5) → làm mới bản đồ sau ký (§6). Câu "KILL là thành công của quy trình" xuất hiện nguyên văn ở đầu file, khớp tinh thần Cổng Giá Trị của spec.

### Judge panel — E13 (AC-13)

Đề xuất tổng hợp của panel: thất bại, đồng thuận cả 3 lens (không phân rẽ) — do đó mục này được ghi UNCERTAIN ở trên (câu hỏi chất lượng nội dung, người quyết tại Cổng 2), không tự chốt REJECT. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: FAIL — PRODUCT-MAP.md — đúng là bản đồ "trình cho người ký cổng" (tự nhận "làm mới ở mỗi lần một người ký một cổng") nên nằm trong phạm vi ÁP của luật N1–N6, nhưng mục "Đã ship" vi phạm rõ: chủ ngữ là cơ chế/file chứ không phải người dùng/sản phẩm (N1, vd "đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs"), thuật ngữ máy trần không có chú giải khi xuất hiện lần đầu (N3/N6: "section-EOF", "frontmatter", "merge-boundary", "opt-out", "bump version", "T1-escape", "persist", "hook write-time"). Áp phép thử Xoá-tên-máy: bỏ hết tên file/mã ra, câu vẫn còn đầy biệt ngữ kỹ thuật khó hiểu với người không đọc code — trượt phép thử. Ngược lại, ba dòng bản đồ hiển thị trên thẻ /start (map.present/map.fresh/null trong commands/start.md) tuân N1/N4/N6 tốt — nhưng vì câu hỏi gộp cả PRODUCT-MAP.md, và tài liệu đó không đạt chuẩn tiếng sản phẩm ở phần thân, nên câu trả lời chung là FAIL.
- operational-feasibility: FAIL — Dòng bản đồ trên thẻ /start (bước 3, phần "Dưới thẻ") đạt: câu người-sản phẩm làm chủ ngữ, không jargon ("chưa có bản đồ sản phẩm", "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh"). Nhưng PRODUCT-MAP.md — thứ được sinh và được dòng đó dẫn tới — vi phạm N1/N2/N6 có hệ thống: mỗi mục lấy slug kỹ thuật kiểu file (`gap-probe-presence-hook`, `t1-escape-event-scope`, `premerge-unjudged-pass`) làm chủ ngữ/nhãn chính thay vì "người dùng thấy gì khác", và phần mô tả nhồi nguyên văn biệt ngữ máy chưa dịch: "Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time)", "cờ opt-out + thứ tự bump version", "index dẫn xuất, không persist", "claim-scan ghim bằng round-trip", "PASS chưa ai phán ở biên merge". Áp phép thử xoá-tên-máy: xoá tên file thì câu vẫn còn đầy jargon tiếng Anh/CS trần (persist, opt-out, bump version, round-trip, PASS) không có trong từ điển sản phẩm nào được cung cấp — người không-kỹ-thuật không kể lại được "sau việc này người dùng thấy gì khác". Đây không phải một-hai ca lẻ mà là hầu hết các dòng trong mục "Đã ship" và "Vòng đang mở", nên PRODUCT-MAP.md như hiện tại đọc như changelog kỹ sư-cho-kỹ-sư, không đạt chuẩn mặt người mà câu hỏi E13 yêu cầu.
- spec-alignment: FAIL — Dòng bản đồ trên thẻ /start (map.present/map.fresh/broken[]) đọc ổn, nhưng PRODUCT-MAP.md — thứ /start dẫn người tới đọc — vi phạm rõ N1/N3/N6: nhiều mục lấy chủ ngữ là cơ chế máy chứ không phải người dùng/sản phẩm và nhồi nguyên biệt ngữ tiếng Anh chưa giải nghĩa, ví dụ "gap-probe-presence-hook — Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time)" và "t1-escape-event-scope — ... (cờ opt-out + thứ tự bump version)". Áp phép thử Xoá-tên-máy vào các dòng này thì câu trở nên vô nghĩa với người không đọc code, nên không đạt chuẩn N1–N6.

## Analyst

- `bash tests/plugins/run-tests.sh` → E1, E2, E3, E4, E5, E6, E8, E10, E11, E12: pass trên CẢ HEAD lẫn diffBase (baseline: green) — đây là lệnh SUITE dùng chung nên phần lớn case trong đó không đụng nhánh product-map/uat-session, baseline cũng xanh; không tự nó chứng minh feature vô hại. Sức phân biệt thật của các case P102-P109 nằm ở đột biến nội bộ từng case (tiêm enum lạc, xoá field, đảo thứ tự...) mô tả trong cột `expected` của từng eval ở trên, không phải trong việc suite tổng có xanh hay không.
- `bash scripts/sync-plugin-packages.sh --check` → E14: pass trên cả hai phía — guard chuẩn cho AC-6 (mirror sync), đối chứng dương đã có sẵn từ trước feature này (pattern P30), không phải hồi quy riêng của feature này.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 round này).

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E12, E14) PASS. E9 (AC-9, judgment) panel đồng thuận PASS. E13 (AC-13, judgment) panel đồng thuận thất bại về chất lượng ngôn-ngữ-mặt-người của phần thân PRODUCT-MAP.md (N1/N3/N6) — ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, verdict tổng PENDING-JUDGMENT, chuyển tới Cổng 2 cho người quyết trực tiếp.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
