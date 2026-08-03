---
schema_version: 2
feature_slug: product-map-uat-session
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 30562b89d5d570ab4f31f0f652ca0349a5184f3e
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
| E13 | AC-13b | judgment | UNCERTAIN |
| E14 | AC-6 | script | PASS |
| E15 | AC-1 | test | PASS |
| E16 | AC-1 | test | PASS |
| E17 | AC-13a | test | PASS |
| E18 | AC-14 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E9
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS, đồng thuận cả 3 lens (không phân rẽ) — không đổi qua 8 round liên tiếp. Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E9" ngay dưới Evidence.
  human_override:

- eval: E10
  run_id: minted-product-map-uat-session-E10-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E13
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: UNCERTAIN
  rationale: Đề xuất tổng hợp của panel round này là FAIL trên phiếu 2/3 — domain-correctness và spec-alignment FAIL, operational-feasibility PASS. Hình dạng chia phiếu ĐẢO NGƯỢC lần nữa so với round 7 (khi đó domain-correctness/operational-feasibility PASS, spec-alignment FAIL, và panel tự chốt PASS vì đề xuất thuận T2 không cần override). Round này đề xuất nghiêng FAIL nên không tự chốt REJECT cho một judgment item đang phân rẽ — ghi UNCERTAIN, chờ người quyết trực tiếp tại Cổng 2 và điền human_override. Cả hai phiếu FAIL đều chỉ cùng một lớp: 4 nhãn cổng tự đặt trong sơ đồ mermaid PRODUCT-MAP.md ("Cổng Đáng", "Cổng Phạm vi", "Cổng Bằng chứng", "Cổng Giá trị") là biệt ngữ mới chưa có mục trong CONTEXT.md và nối dài đúng quy ước viết-hoa mà CONTEXT.md dành riêng cho "Cổng 1"/"Cổng 2" — cùng lớp ngôn-ngữ-mặt-người mà panel theo dõi suốt các round trước. Cả ba phiếu, kể cả phiếu bất đồng, KHÔNG bị gộp/ẩn — giữ nguyên toàn văn ở section "Judge panel — E13" ngay dưới Evidence, cho người đọc tại Cổng 2.
  human_override:

- eval: E14
  run_id: minted-product-map-uat-session-E14-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T19:45:00Z
  output: |
      plugins/ mirror in sync.

- eval: E15
  run_id: minted-product-map-uat-session-E15-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E16
  run_id: minted-product-map-uat-session-E16-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E17
  run_id: minted-product-map-uat-session-E17-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

- eval: E18
  run_id: minted-product-map-uat-session-E18-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T19:45:00Z
  output: |
      PASS: P113 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

      Results: all plugin tests passed

### Judge panel — E9 (AC-9)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — Skill uat-session.md chứa đủ 7 chốt của §2.3 theo đúng thứ tự: điều kiện vào ở §0 (signed-off + ngưỡng UAT chốt tại Cổng Đáng), chép nguyên văn ngưỡng + cấm sửa sau khi thấy số ở §1, chấm kín rồi mới thảo luận + commitment device "anh/chị sẽ gửi cho khách nào, khi nào?" ở §3 (đúng thứ tự file), verdict do người ký điền và agent bị cấm điền thay ở §5, câu "KILL tại cổng này là THÀNH CÔNG của quy trình" nêu rõ trong phần mở đầu, và làm mới bản đồ sản phẩm (product-map.mjs) ở §6 sau khi ký. Không có chốt nào trong danh sách bị thiếu hay đảo ngược thứ tự thực chất so với spec.
- operational-feasibility: PASS — Skill uat-session giữ đủ 7 chốt và đúng thứ tự: §0 điều kiện vào (signed-off + ngưỡng UAT chốt tại Cổng Đáng) → §1 chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (yêu cầu SUPERSEDED + dừng chờ Cổng Đáng nếu đổi) → §3 chấm kín TRƯỚC thảo luận, cùng lúc hỏi commitment device "gửi cho khách nào, khi nào?" → §4 đặt số đo cạnh ngưỡng → §5 verdict do người điền, agent không điền thay ("chữ ký là thứ duy nhất máy không thay được") → §6 làm mới PRODUCT-MAP sau khi ký. Câu "KILL là thành công của quy trình" có mặt nguyên văn ở đầu skill và được chỉ định nói ra tại thời điểm trình quyết định (§5), khớp Cổng Giá Trị trong spec.
- spec-alignment: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt §2.3: điều kiện vào (signed-off + ngưỡng UAT đã chốt tại Cổng Đáng, §0) → chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (§1, trước khi mời người) → mời người (§2) → chấm kín TRƯỚC thảo luận kèm commitment device "gửi cho khách nào, khi nào?" (§3) → đặt số đo cạnh ngưỡng từ tracking thật (§4) → verdict do người ký, agent không điền thay (§5) → làm mới PRODUCT-MAP sau ký (§6). Câu "KILL là thành công của quy trình" xuất hiện nguyên vẹn ở đầu file, khớp câu gateUAT trong spec.

### Judge panel — E13 (AC-13b)

Đề xuất tổng hợp của panel: FAIL trên phiếu 2/3 — domain-correctness và spec-alignment FAIL, operational-feasibility PASS. Không phải đồng thuận. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại — bao gồm cả phiếu bất đồng):

- domain-correctness: FAIL — Phần TỰ VIẾT (nhãn mermaid trong PRODUCT-MAP.md + dòng giải thích cổng trên thẻ /start): bốn tên cổng viết hoa "Cổng Đáng", "Cổng Phạm vi", "Cổng Bằng chứng", "Cổng Giá trị" đều không có mục trong CONTEXT.md — vi phạm N6, và hai cái sau còn là bí danh song song cho "Gate 1"/"Gate 2" (CONTEXT.md dành riêng dạng viết hoa "Cổng 1"/"Cổng 2" cho đúng hai cổng đó, sau một quyết định 2026-07-26 chống trôi từ vựng) nên tự nó tạo đúng loại trôi mà quyết định đó định chặn; PRODUCT-MAP.md không giải nghĩa các nhãn này tại chỗ (start.md thì có). Phần THỪA HƯỞNG (các dòng mô tả dưới "Đang làm"/"Đã giao", vd. chủ ngữ là `claim-scan.mjs`, "gap-probe S1", "start-scan"): đúng như đề bài nêu, đây là nguyên văn hồ sơ cũ đã ký mà vòng này cố ý không sửa nên không tính là lỗi phát sinh của vòng này, dù đọc độc lập các câu đó vẫn phạm N1/N2 (chủ ngữ là tên file/script, không phải người dùng/sản phẩm).
- operational-feasibility: PASS — Phần TỰ VIẾT (tiêu đề "Bản đồ sản phẩm", ghi chú đầu file, tên mục "Đang làm/Đã giao/Ngoài phạm vi đã ký", nhãn mermaid trong PRODUCT-MAP.md; và trong start.md: ba dòng bản đồ dưới thẻ "chưa có bản đồ sản phẩm...", "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh", "chưa kiểm được bản đồ", cùng khuôn dòng broken[] "việc nào, hồ sơ nào (file), vì sao (reason)") đọc được bằng tiếng sản phẩm, qua được phép thử xoá-tên-máy, tên kỹ thuật đã xuống ngoặc đúng N2, mã S1–S4 kèm nghĩa ngay lần đầu đúng N3 — PASS trên trục chữ. Phần THỪA HƯỞNG (các dòng liệt kê trong "Đang làm"/"Đã giao"/"Ngoài phạm vi" — ví dụ "đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (5 lỗ: section-EOF, id sai khuôn... frontmatter không đọc được...)") vẫn là ngôn ngữ máy thuần (chủ ngữ là cơ chế parse, thuật ngữ section-EOF/frontmatter không giải nghĩa, nhồi nhiều lỗ vào một dòng) — không đạt N1/N4/N6 nếu xét độc lập, nhưng đây đúng như đề bài nêu là trường nguyên văn từ hồ sơ cũ đã ký mà vòng này cố ý không sửa, nên không tính là lỗi của phần bộ sinh tự viết ra ở vòng này.
- spec-alignment: FAIL — Lệch nằm ở phần TỰ VIẾT: mermaid trong PRODUCT-MAP.md và khuôn thẻ /start dùng lặp lại 4 tên cổng viết hoa mới ("Cổng Đáng", "Cổng Phạm vi", "Cổng Bằng chứng", "Cổng Giá trị") cùng cụm "phiên nghiệm thu" — grep CONTEXT.md ra 0 hit cho cả năm cụm, vi phạm N6 vì đây là chữ hoa kiểu tên riêng (nối dài đúng quy ước "Cổng 1/Cổng 2" mà CONTEXT.md đã ghim là dành riêng), không phải "chữ thường ai cũng hiểu", và tài liệu không có mục định nghĩa nào cho chúng. Phần THỪA HƯỞNG (các dòng trong "Đã giao"/"Ngoài phạm vi đã ký" của PRODUCT-MAP.md, ví dụ "đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (...)") có chủ ngữ là file/cơ chế máy nên cũng không qua N1/N2, nhưng đây là trường feature nguyên văn từ hồ sơ cũ đã ký mà vòng này cố ý không sửa — không tính là lỗi mới, chỉ là nợ đã biết.

## Analyst

- `bash tests/plugins/run-tests.sh` → E1, E2, E3, E4, E5, E6, E8, E10, E11, E12, E15, E16, E17, E18: pass trên CẢ HEAD lẫn diffBase (baseline: green). Lệnh này là SUITE dùng chung nên phần lớn case trong đó không đụng nhánh product-map/uat-session, baseline cũng xanh; không tự nó chứng minh feature vô hại. Sức phân biệt thật nằm ở đột biến nội bộ từng case (tiêm enum lạc, xoá field, đảo thứ tự, marker sai, tiêm/xoá bản đồ, mode lạ, xoá bản đồ đã-track...) mô tả trong cột `expected` của từng eval.
- `bash scripts/sync-plugin-packages.sh --check` → E14: pass trên cả hai phía — guard chuẩn cho AC-6 (mirror sync), đối chứng dương đã có sẵn từ trước feature này (pattern P30), không phải hồi quy riêng của feature này.

Các lệnh suite chung khác chạy round này (`bash tests/scripts/run-tests.sh` — 596 passed, `bash tests/hooks/run-tests.sh` — 51 passed, `bash tests/workflows/run-tests.sh` — 10 passed) không gán eval nào (regression-guard chung của kit, xanh cả hai phía theo quy ước), nên không liệt kê ở đây.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 round này).

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E12, E14) PASS. E9 (AC-9, judgment) panel đồng thuận PASS. E13 (AC-13, judgment) panel đồng thuận thất bại về chất lượng ngôn-ngữ-mặt-người của phần thân PRODUCT-MAP.md (N1/N3/N6) — ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, verdict tổng PENDING-JUDGMENT, chuyển tới Cổng 2 cho người quyết trực tiếp.
Round 2: toàn bộ 13 eval máy/script (E1-E8, E10-E12, E14, E15 — E15 mới thêm round này) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ đồng thuận-thất-bại (round 1) sang chia phiếu 2/3 PASS (domain-correctness, spec-alignment) với operational-feasibility vẫn FAIL — dissent chép đầy đủ ở "Judge panel — E13". Verdict tổng round này: REJECT, failed_evals: [] (không eval máy nào fail; căn cứ scope-triage và các phát hiện ngoài hợp đồng nằm ở review-findings.md).
Round 3: toàn bộ 14 eval máy/script (E1-E8, E10-E12, E14, E15, E16 — E16 mới thêm round này, case P111) PASS, exit 0, gồm cả E7 (script, baseline: red). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ chia phiếu PASS 2/3 (round 2) sang chia phiếu FAIL 2/3 round này (domain-correctness và operational-feasibility FAIL, spec-alignment PASS). Song song, scope-triage review tìm được 1 finding "Trong hợp đồng" mức high, map AC-1: `lib/workspace-record.js` — `recordProblem` không còn coi thư mục `_acceptance/<slug>/` chỉ có `uat-session.md` (thiếu contract.md lẫn opportunity.md) là hồ sơ hỏng, khiến slug đó biến mất khỏi MỌI nhóm trên thẻ /start và hai reader trái nhau — đúng lớp false-green mà module này được dựng ra để diệt. Verdict tổng round này: REJECT. failed_evals: [] — REJECT căn cứ (a) panel E13 chia phiếu nghiêng FAIL và (b) finding "Trong hợp đồng" mức high/AC-1 nói trên. Người quyết (decisions.jsonl d-...-26794): dừng tại cap 3 round, escalate cho người thay vì tự chạy round 4.
Round 4 (người phê chuẩn vượt cap 3 round — decisions.jsonl d-20260803T094746Z-19579): sửa hồi quy workspace-mồ-côi phát hiện ở round 3 (guard đếm ANCHOR_FILES thay vì cả ba file bắt buộc — slug chỉ có uat-session.md nay quay lại hiện ở broken/Hồ sơ hỏng ở CẢ hai reader), bỏ bước tiêm no-op trong case P110 kèm thêm 2 hình dạng fixture, và khoá NAV_RULES theo (file,field) để stage của uat-session (scheduled|held) không còn nguy cơ bị gán nhầm enum của opportunity. Toàn bộ 14 eval máy/script (E1-E8, E10-E12, E14, E15, E16) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 4 round. Panel E13 GIỮ NGUYÊN chia phiếu FAIL 2/3 (domain-correctness, operational-feasibility FAIL; spec-alignment PASS) — không đổi so với round 3, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — finding high/AC-1 của round 3 đã được sửa và không còn phát hiện nào map được vào AC; 7 finding còn lại đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PENDING-JUDGMENT — không còn finding "Trong hợp đồng" chặn merge, chỉ còn duy nhất phiếu chia của panel E13 (2 FAIL/1 PASS, không đồng thuận) cần người quyết định trực tiếp tại Cổng 2 thay vì máy tự chốt REJECT hay PASS cho một judgment item đang phân rẽ.
Round 5: thêm 2 eval mới (E17/AC-13a case P112 — bản đồ mermaid đứng trước danh sách + số thật; E18/AC-14 case P113 — PRODUCT-MAP.md miễn trừ t1_skip_globs). AC-13 cũ tách thành AC-13a (E17) + AC-13b (E13) round này. Toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 5 round. Panel E13 GIỮ NGUYÊN chia phiếu FAIL 2/3 (domain-correctness, operational-feasibility FAIL; spec-alignment PASS) — không đổi hình dạng so với round 3-4, rationale viết lại chi tiết hơn nhưng cùng kết luận, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" có 1 finding MỚI mức medium, map AC-13b — `lib/evidence-core.js:96` bóc nháy đầu/cuối độc lập thay vì theo cặp khớp khiến `frontmatterField` cắt nhầm dấu nháy cuối của giá trị không-quote, hệ quả đã thấy trên PRODUCT-MAP.md:36 (dòng feature của s4-scope-triage bị cụt nháy) — cùng đúng lớp bug mà panel E13 đang chỉ ra, không phải phát hiện tách biệt khỏi AC-13b. 8 finding còn lại xếp "Ngoài hợp đồng" (xem review-findings.md). Verdict tổng round này: PENDING-JUDGMENT — không eval máy nào fail (failed_evals: []), finding "Trong hợp đồng" duy nhất củng cố đúng phiếu FAIL đã có của E13 chứ không mở AC mới; vẫn còn duy nhất phiếu chia của panel E13 (2 FAIL/1 PASS) cần người quyết định trực tiếp tại Cổng 2.
Round 6 (fix nối tiếp, không có report/verdict riêng — decisions.jsonl d-20260803T105727Z-9473 và d-20260803T111906Z-29745): (a) sửa finding medium/AC-13b của round 5 — `frontmatterField` (lib/evidence-core.js) đổi sang chỉ bóc nháy khi CẢ CẶP khớp, không còn cắt nhầm dấu nháy cuối của giá trị không-quote; P113 đổi sang phá BẢN SAO thay vì phá PRODUCT-MAP.md thật của kit. (b) `product-map.mjs` chuyển fail-OPEN → fail-CLOSED: chốt mode hợp lệ + thứ tự tham số (mode lạ như `--chek` nay exit 2 và KHÔNG ghi đè bản đồ), và XOÁ bản đồ đã-git-theo-dõi nay exit 1 kèm thông điệp thay vì im lặng exit 0 — case P106 (E3) mở rộng từ 6 lên 8 chân. Hai fix này không tự sinh report/PENDING-JUDGMENT riêng; round 7 verify cả hai cùng lúc.
Round 7: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt) và E3 nay phủ đủ 8 chân fail-closed từ round 6 (bao gồm hai chân mới: mode lạ → exit 2 không ghi đè, và xoá bản đồ đã-track → exit 1). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 7 round. Panel E13 LẦN ĐẦU đổi sang đa số PASS (2/3: domain-correctness, operational-feasibility PASS; spec-alignment FAIL) — đảo ngược hình dạng chia phiếu FAIL 2/3 đã giữ nguyên suốt round 3-5; phiếu FAIL còn lại chỉ ra 4 nhãn cổng tự đặt trong mermaid (Cổng Đáng/Phạm vi/Bằng chứng/Giá trị) là biệt ngữ mới chưa vào CONTEXT.md, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 9 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PASS — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" nào chặn merge, và panel E13 đa số PASS (không còn UNCERTAIN chờ human_override — tier T2, không bắt buộc override khi panel đã tự chốt).
Round 8: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 8 round. Panel E13 LẦN NỮA đảo phiếu — quay lại đa số FAIL 2/3 (domain-correctness, spec-alignment FAIL; operational-feasibility PASS), đảo ngược hình dạng đa số PASS vừa xuất hiện ở round 7; hai phiếu FAIL cùng chỉ một lớp: 4 nhãn cổng tự đặt trong mermaid ("Cổng Đáng"/"Phạm vi"/"Bằng chứng"/"Giá trị") vẫn chưa có mục trong CONTEXT.md và nối dài đúng quy ước viết-hoa mà CONTEXT.md dành riêng cho "Cổng 1"/"Cổng 2", dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 10 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md, 2/10 rơi vào file ngoài vùng phủ của bộ đo), không finding nào chặn AC. Khác round 7 (đề xuất thuận PASS nên tự chốt, không cần override), round này đề xuất nghiêng FAIL — không tự chốt REJECT cho một judgment item đang phân rẽ, ghi UNCERTAIN thay. Verdict tổng round này: PENDING-JUDGMENT — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" chặn merge, duy nhất E13 UNCERTAIN chờ human_override tại Cổng 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
