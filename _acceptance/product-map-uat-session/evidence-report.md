---
schema_version: 2
feature_slug: product-map-uat-session
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 62444dfd5f6ce79836034b2695bc69f87425495d
human_signoff: Manh Phan 2026-08-03
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
| E13 | AC-13b | judgment | PASS |
| E14 | AC-6 | script | PASS |
| E15 | AC-1 | test | PASS |
| E16 | AC-1 | test | PASS |
| E17 | AC-13a | test | PASS |
| E18 | AC-14 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r11
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E9
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS, đồng thuận cả 3 lens (không phân rẽ) — không đổi qua 11 round liên tiếp. Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E9" ngay dưới Evidence.
  human_override:

- eval: E10
  run_id: minted-product-map-uat-session-E10-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E13
  judged_by: 3-lens judge panel (fresh context) — domain-correctness / operational-feasibility / spec-alignment
  verdict: PASS
  rationale: Đề xuất tổng hợp của panel round này là PASS, đồng thuận cả 3 lens — LẦN ĐẦU TIÊN qua 11 round panel đạt đồng thuận PASS tuyệt đối (round 10 vừa là lần đầu đồng thuận FAIL 3/3; round 7/9 trước đó chỉ là đa số PASS 2/3, chưa từng đồng thuận). Cả ba phiếu xác nhận phần TỰ VIẾT của bộ sinh (tiêu đề, ghi chú, tên mục, nhãn mermaid, ba dòng bản đồ trên thẻ /start) đạt N1-N6, ghi nhận 4 mã cổng dang/pham-vi/bang-chung/gia-tri nay đều kèm gloss ngay lần đầu xuất hiện — không còn nêu lại vướng mắc "chưa có mục trong CONTEXT.md" đã lặp lại xuyên suốt round 3-10. Phần THỪA HƯỞNG nguyên văn từ hồ sơ cũ vẫn bị cả 3 lens ghi nhận có vi phạm N1/N2/N4/N6 nhưng không tính vào phán quyết vòng này vì cố ý không sửa (đúng phạm vi AC-13b). Vì đề xuất là PASS đồng thuận, verdict tự chốt PASS — tier T2, không bắt buộc human_override khi panel tự chốt (giống round 7/9). Đầy đủ vote từng lens (không rút gọn) xem section "Judge panel — E13" ngay dưới Evidence.
  human_override: Manh Phan 2026-08-03 — CHẤP NHẬN; phần không đạt là tên việc thừa hưởng từ hồ sơ cũ đã ký, cố ý không sửa, bản đồ sạch dần theo hồ sơ mới, đảo ngược được

- eval: E14
  run_id: minted-product-map-uat-session-E14-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T15:05:00Z
  output: |
      plugins/ mirror in sync.

- eval: E15
  run_id: minted-product-map-uat-session-E15-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E16
  run_id: minted-product-map-uat-session-E16-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E17
  run_id: minted-product-map-uat-session-E17-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

- eval: E18
  run_id: minted-product-map-uat-session-E18-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T15:05:00Z
  output: |
      PASS: P114 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)

      Results: all plugin tests passed

### Judge panel — E9 (AC-9)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — SKILL.md giữ đủ 7 chốt của §2.3 đúng thứ tự: §0 kiểm signed-off + ngưỡng UAT chốt tại Cổng Đáng trước khi vào; §1 chép nguyên văn ngưỡng và cấm sửa sau khi thấy số (đổi thật phải ghi SUPERSEDED, dừng chờ Cổng Đáng); §3 chấm kín trước khi mở thảo luận (thứ tự file là vết) kèm đúng câu ràng buộc "gửi cho khách nào, khi nào?"; §5 verdict do người ký điền, agent không tự điền dù số đã rõ; câu "KILL là thành công của quy trình" xuất hiện ở phần mở đầu gắn với thời điểm trình quyết định (khớp ý Cổng Giá Trị của spec); §6 làm mới PRODUCT-MAP diễn ra sau khi ký, đúng vị trí cuối cùng như spec mô tả (release/iterate/kill rồi mới regen map). Không thấy chốt nào bị thiếu hay đảo thứ tự so với văn bản §2.3.
- operational-feasibility: PASS — SKILL.md giữ đủ 7 chốt đúng thứ tự vận hành: §0 điều kiện vào (signed-off + ngưỡng UAT đã chốt tại Cổng Đáng) → §1 chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (có lối SUPERSEDED quay lại Cổng Đáng, không phải sửa lặng lẽ) → §3 chấm kín TRƯỚC thảo luận (khối Chấm kín phải điền xong mới viết Thảo luận, "thứ tự trong file là vết") ghép cùng commitment device ("gửi cho khách nào, khi nào?") → §5 verdict human-owned ("Agent KHÔNG điền verdict thay người") → §6 làm mới bản đồ sản phẩm sau khi ký. Câu "KILL là thành công của quy trình" xuất hiện đúng nghĩa (preamble nêu nguyên tắc, kèm chỉ dẫn tường minh "Nói câu đó ra khi trình quyết định" trỏ đúng tới thời điểm §5) — không phải một bước tách rời nên vị trí đầu file không phá thứ tự vận hành thực tế.
- spec-alignment: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt của §2.3: mục 0 kiểm signed-off + ngưỡng UAT đã chốt tại Cổng Đáng trước khi vào; mục 1 chép nguyên văn ngưỡng từ opportunity.md và cấm sửa sau khi thấy số (ghi SUPERSEDED nếu cần đổi thật); mục 3 chấm kín xong mới mở "Thảo luận" (thứ tự trong file là vết) kèm câu ràng buộc "gửi cho khách nào, khi nào?"; mục 5 nêu rõ "Agent KHÔNG điền verdict thay người" (verdict human-owned); câu "KILL tại cổng này là THÀNH CÔNG của quy trình" xuất hiện gần như nguyên văn spec; mục 6 (sau khi ký) làm mới PRODUCT-MAP và append kết quả đo vào opportunity.md cho retro. Không phát hiện chốt nào bị thiếu, đổi nghĩa hay đảo thứ tự so với §2.3.

### Judge panel — E13 (AC-13b)

Đề xuất tổng hợp của panel: PASS, đồng thuận cả 3 lens — lần đầu tiên qua 11 round panel đạt đồng thuận PASS tuyệt đối. Vote từng lens (giữ nguyên toàn bộ, không rút gọn/viết lại):

- domain-correctness: PASS — Phần bộ sinh TỰ VIẾT — tiêu đề, ghi chú đầu PRODUCT-MAP.md, tên bốn mục (Chờ duyệt phạm vi/Đang làm/Đã giao/Ngoài phạm vi đã ký), nhãn trong sơ đồ mermaid (Cổng Đáng/Phạm vi/Bằng chứng/Giá trị, các trạng thái "Đang cân nhắc cơ hội", "Sắp mở vòng"...), và ba thông điệp dòng bản đồ trên thẻ /start (map.present/fresh/null) — đạt N1–N6: chủ ngữ là trạng thái sản phẩm chứ không phải file, tên kỹ thuật (`_acceptance/`, `.out-of-scope/`, `file`/`reason`) đều nằm gọn trong ngoặc/cột phụ, mỗi node một ý qua `<br/>`, sơ đồ đứng trước chữ đúng N5, và tên cổng được định nghĩa ngay lần đầu xuất hiện ở bước 3 của start.md. Phần THỪA HƯỞNG — các dòng liệt kê việc dưới mỗi mục — mang nguyên ngôn ngữ máy của hồ sơ cũ đã ký (vd "start-scan đọc 2 nguồn mới" lấy tên script làm chủ ngữ, vi phạm N1; mục Đã giao dùng biệt ngữ code như claim-scan.mjs/frontmatter/section-EOF chưa chắc có trong từ điển, khó qua phép xoá-tên-máy) nhưng vòng này cố ý không sửa, nên đây là nợ cũ chứ không phải lỗi của bộ sinh vòng này.
- operational-feasibility: PASS — Phần bộ sinh TỰ VIẾT — tiêu đề, ghi chú đầu PRODUCT-MAP.md, 4 tên mục ("Chờ duyệt phạm vi"/"Đang làm"/"Đã giao"/"Ngoài phạm vi đã ký"), nhãn mermaid ("Đang cân nhắc cơ hội", "Sắp mở vòng"...), và ba dòng mẫu bản đồ trên thẻ /start (map.present/map.fresh/null/broken[]) — dùng tiếng sản phẩm phẳng, qua phép thử xoá-tên-máy, tên kỹ thuật (`_acceptance/`, "file", "reason") đều xuống ngoặc đúng N2, và bốn mã cổng dang/pham-vi/bang-chung/gia-tri đều kèm gloss 3-5 chữ ngay lần đầu xuất hiện đúng N3. Phần THỪA HƯỞNG — rõ nhất 14 dòng mục "Đã giao" (vd "...trong claim-scan.mjs", "lib/md-section.js", "PER-SECTION", "T1-escape", "diff", "bump version") — vi phạm rõ N1/N2/N6: chủ ngữ là tên file/thuật ngữ nội bộ chưa có trong CONTEXT.md, không phải thứ người dùng thấy khác; nhưng đây là trường nguyên văn từ hồ sơ cũ đã ký mà vòng này cố ý không sửa (đúng như đề bài nêu), không phải lỗi mới của bộ sinh. Vì phạm vi thực sự của lượt này — phần bộ sinh tự viết — đạt N1-N6, phán PASS trên trục chữ.
- spec-alignment: PASS — Phần bộ sinh TỰ VIẾT đạt N1-N6: tiêu đề, ghi chú, tên mục và mọi nhãn mermaid trong PRODUCT-MAP.md dùng chủ ngữ là sản phẩm/trạng thái công việc (không phải tên file), mỗi nhãn một ý, không biệt ngữ chưa giải thích; ba dòng trạng thái bản đồ trên thẻ /start ("chưa có bản đồ sản phẩm...", "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh", "chưa kiểm được bản đồ") cũng ngắn gọn, đúng người-thứ-ba đọc hiểu được. Phần THỪA HƯỞNG (các gạch đầu dòng dưới mỗi mục, lấy nguyên văn trường tóm tắt của hồ sơ feature cũ) thực sự có vi phạm N1/N4/N6 rõ — ví dụ "PRODUCT-MAP + phiên nghiệm thu — ..., nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới" nhồi ba việc một dòng và lấy tên file PRODUCT-MAP làm chủ ngữ, hay "Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version)" toàn biệt ngữ tiếng Anh không giải thích — nhưng đây đúng là chữ của hồ sơ cũ đã ký mà vòng này cố ý không đụng, nên không tính là lỗi của bộ sinh đang được xét ở AC-13b này.

## Analyst

- bash tests/plugins/run-tests.sh: E1, E2, E3, E4, E5, E6, E8, E10, E11, E12, E15, E16, E17, E18 — xanh trên cả HEAD lẫn diffBase (baseline: green), không phân biệt bằng cmd này; suite chứa nhiều case cố định (regression-guard) trộn cùng case mới của feature, không tách được theo cmd-level baseline.
- bash scripts/sync-plugin-packages.sh --check: E14 — xanh trên cả HEAD lẫn diffBase (baseline: green); đây là regression-guard cố ý (mirror phải luôn khớp nguồn, kể cả trước feature), không phải dấu hiệu eval không đo được gì.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E12, E14) PASS. E9 (AC-9, judgment) panel đồng thuận PASS. E13 (AC-13, judgment) panel đồng thuận thất bại về chất lượng ngôn-ngữ-mặt-người của phần thân PRODUCT-MAP.md (N1/N3/N6) — ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, verdict tổng PENDING-JUDGMENT, chuyển tới Cổng 2 cho người quyết trực tiếp.
Round 2: toàn bộ 13 eval máy/script (E1-E8, E10-E12, E14, E15 — E15 mới thêm round này) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ đồng thuận-thất-bại (round 1) sang chia phiếu 2/3 PASS (domain-correctness, spec-alignment) với operational-feasibility vẫn FAIL — dissent chép đầy đủ ở "Judge panel — E13". Verdict tổng round này: REJECT, failed_evals: [] (không eval máy nào fail; căn cứ scope-triage và các phát hiện ngoài hợp đồng nằm ở review-findings.md).
Round 3: toàn bộ 14 eval máy/script (E1-E8, E10-E12, E14, E15, E16 — E16 mới thêm round này, case P111) PASS, exit 0, gồm cả E7 (script, baseline: red). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3). Panel E13 đổi từ chia phiếu PASS 2/3 (round 2) sang chia phiếu FAIL 2/3 round này (domain-correctness và operational-feasibility FAIL, spec-alignment PASS). Song song, scope-triage review tìm được 1 finding "Trong hợp đồng" mức high, map AC-1: `lib/workspace-record.js` — `recordProblem` không còn coi thư mục `_acceptance/<slug>/` chỉ có `uat-session.md` (thiếu contract.md lẫn opportunity.md) là hồ sơ hỏng, khiến slug đó biến mất khỏi MỌI nhóm trên thẻ /start và hai reader trái nhau — đúng lớp false-green mà module này được dựng ra để diệt. Verdict tổng round này: REJECT. failed_evals: [] — REJECT căn cứ (a) panel E13 chia phiếu nghiêng FAIL và (b) finding "Trong hợp đồng" mức high/AC-1 nói trên. Người quyết (decisions.jsonl d-...-26794): dừng tại cap 3 round, escalate cho người thay vì tự chạy round 4.
Round 4 (người phê chuẩn vượt cap 3 round — decisions.jsonl d-20260803T094746Z-19579): sửa hồi quy workspace-mồ-côi phát hiện ở round 3 (guard đếm ANCHOR_FILES thay vì cả ba file bắt buộc — slug chỉ có uat-session.md nay quay lại hiện ở broken/Hồ sơ hỏng ở CẢ hai reader), bỏ bước tiêm no-op trong case P110 kèm thêm 2 hình dạng fixture, và khoá NAV_RULES theo (file,field) để stage của uat-session (scheduled|held) không còn nguy cơ bị gán nhầm enum của opportunity. Toàn bộ 14 eval máy/script (E1-E8, E10-E12, E14, E15, E16) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 4 round. Panel E13 GIỮ NGUYÊN chia phiếu FAIL 2/3 (domain-correctness, operational-feasibility FAIL; spec-alignment PASS) — không đổi so với round 3, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — finding high/AC-1 của round 3 đã được sửa và không còn phát hiện nào map được vào AC; 7 finding còn lại đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PENDING-JUDGMENT — không còn finding "Trong hợp đồng" chặn merge, chỉ còn duy nhất phiếu chia của panel E13 (2 FAIL/1 PASS, không đồng thuận) cần người quyết định trực tiếp tại Cổng 2 thay vì máy tự chốt REJECT hay PASS cho một judgment item đang phân rẽ.
Round 5: thêm 2 eval mới (E17/AC-13a case P112 — bản đồ mermaid đứng trước danh sách + số thật; E18/AC-14 case P113 — PRODUCT-MAP.md miễn trừ t1_skip_globs). AC-13 cũ tách thành AC-13a (E17) + AC-13b (E13) round này. Toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 5 round. Panel E13 GIỮ NGUYÊN chia phiếu FAIL 2/3 (domain-correctness, operational-feasibility FAIL; spec-alignment PASS) — không đổi hình dạng so với round 3-4, rationale viết lại chi tiết hơn nhưng cùng kết luận, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" có 1 finding MỚI mức medium, map AC-13b — `lib/evidence-core.js:96` bóc nháy đầu/cuối độc lập thay vì theo cặp khớp khiến `frontmatterField` cắt nhầm dấu nháy cuối của giá trị không-quote, hệ quả đã thấy trên PRODUCT-MAP.md:36 (dòng feature của s4-scope-triage bị cụt nháy) — cùng đúng lớp bug mà panel E13 đang chỉ ra, không phải phát hiện tách biệt khỏi AC-13b. 8 finding còn lại xếp "Ngoài hợp đồng" (xem review-findings.md). Verdict tổng round này: PENDING-JUDGMENT — không eval máy nào fail (failed_evals: []), finding "Trong hợp đồng" duy nhất củng cố đúng phiếu FAIL đã có của E13 chứ không mở AC mới; vẫn còn duy nhất phiếu chia của panel E13 (2 FAIL/1 PASS) cần người quyết định trực tiếp tại Cổng 2.
Round 6 (fix nối tiếp, không có report/verdict riêng — decisions.jsonl d-20260803T105727Z-9473 và d-20260803T111906Z-29745): (a) sửa finding medium/AC-13b của round 5 — `frontmatterField` (lib/evidence-core.js) đổi sang chỉ bóc nháy khi CẢ CẶP khớp, không còn cắt nhầm dấu nháy cuối của giá trị không-quote; P113 đổi sang phá BẢN SAO thay vì phá PRODUCT-MAP.md thật của kit. (b) `product-map.mjs` chuyển fail-OPEN → fail-CLOSED: chốt mode hợp lệ + thứ tự tham số (mode lạ như `--chek` nay exit 2 và KHÔNG ghi đè bản đồ), và XOÁ bản đồ đã-git-theo-dõi nay exit 1 kèm thông điệp thay vì im lặng exit 0 — case P106 (E3) mở rộng từ 6 lên 8 chân. Hai fix này không tự sinh report/PENDING-JUDGMENT riêng; round 7 verify cả hai cùng lúc.
Round 7: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt) và E3 nay phủ đủ 8 chân fail-closed từ round 6 (bao gồm hai chân mới: mode lạ → exit 2 không ghi đè, và xoá bản đồ đã-track → exit 1). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 7 round. Panel E13 LẦN ĐẦU đổi sang đa số PASS (2/3: domain-correctness, operational-feasibility PASS; spec-alignment FAIL) — đảo ngược hình dạng chia phiếu FAIL 2/3 đã giữ nguyên suốt round 3-5; phiếu FAIL còn lại chỉ ra 4 nhãn cổng tự đặt trong mermaid (Cổng Đáng/Phạm vi/Bằng chứng/Giá trị) là biệt ngữ mới chưa vào CONTEXT.md, dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 9 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PASS — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" nào chặn merge, và panel E13 đa số PASS (không còn UNCERTAIN chờ human_override — tier T2, không bắt buộc override khi panel đã tự chốt).
Round 8: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) vẫn xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 8 round. Panel E13 LẦN NỮA đảo phiếu — quay lại đa số FAIL 2/3 (domain-correctness, spec-alignment FAIL; operational-feasibility PASS), đảo ngược hình dạng đa số PASS vừa xuất hiện ở round 7; hai phiếu FAIL cùng chỉ một lớp: 4 nhãn cổng tự đặt trong mermaid ("Cổng Đáng"/"Phạm vi"/"Bằng chứng"/"Giá trị") vẫn chưa có mục trong CONTEXT.md và nối dài đúng quy ước viết-hoa mà CONTEXT.md dành riêng cho "Cổng 1"/"Cổng 2", dissent đầy đủ ở "Judge panel — E13". Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 10 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md, 2/10 rơi vào file ngoài vùng phủ của bộ đo), không finding nào chặn AC. Khác round 7 (đề xuất thuận PASS nên tự chốt, không cần override), round này đề xuất nghiêng FAIL — không tự chốt REJECT cho một judgment item đang phân rẽ, ghi UNCERTAIN thay. Verdict tổng round này: PENDING-JUDGMENT — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" chặn merge, duy nhất E13 UNCERTAIN chờ human_override tại Cổng 2.
Round 9: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (227, gồm execute-parallel 16 + skill-claims 10 + các suite khác) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 9 round. Panel E13 lần thứ ba đảo phiếu — quay lại đa số PASS 2/3 (domain-correctness, spec-alignment PASS; operational-feasibility FAIL), tổ hợp bất đồng KHÁC round 7 (khi đó domain-correctness + operational-feasibility PASS, spec-alignment FAIL) dù cùng kết luận thuận; phiếu FAIL vẫn chỉ đúng lớp cũ đã theo dõi từ round 3: 4 nhãn cổng tự đặt trong mermaid ("Cổng Đáng"/"Cổng Phạm vi"/"Cổng Bằng chứng"/"Cổng Giá trị") chưa có mục trong CONTEXT.md, dissent đầy đủ ở "Judge panel — E13" ngay dưới Evidence. Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 6 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PASS — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" chặn merge, panel E9 đồng thuận PASS và panel E13 đa số PASS (2/3, tier T2 — không bắt buộc human_override khi panel tự chốt, giống round 7).
Round 10: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 10 round. Panel E13 LẦN ĐẦU đồng thuận cả 3/3 FAIL — khác mọi round trước (3-9) luôn chia phiếu 2/3 theo cả hai hướng, không lần nào cả ba lens cùng một verdict; ba phiếu vẫn quy về đúng một lớp cũ: 4 nhãn cổng tự đặt trong mermaid ("Cổng Đáng"/"Cổng Phạm vi"/"Cổng Bằng chứng"/"Cổng Giá trị") chưa có mục trong CONTEXT.md. Vì đề xuất không phải PASS đồng thuận, verdict E13 ghi UNCERTAIN thay vì tự chốt REJECT cho một judgment item, dissent đầy đủ ở "Judge panel — E13" ngay dưới Evidence. Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 9 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md, 3/9 rơi vào file ngoài vùng phủ của bộ đo), không finding nào chặn AC. Verdict tổng round này: PENDING-JUDGMENT — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" chặn merge, duy nhất E13 UNCERTAIN (đồng thuận FAIL 3/3, lần đầu tiên không chia phiếu qua 10 round) chờ human_override tại Cổng 2.
Round 11: toàn bộ 16 eval máy/script (E1-E8, E10-E12, E14-E18) PASS, exit 0, gồm cả E7 (script, baseline: red — có phân biệt). Suite chung tests/scripts (596), tests/hooks (51), tests/workflows (10) đều xanh, không gán eval. Panel E9 giữ nguyên đồng thuận PASS (3/3), không đổi qua 11 round. Panel E13 LẦN ĐẦU đồng thuận cả 3/3 PASS — đảo ngược hoàn toàn so với round 10 (đồng thuận FAIL 3/3, lần đầu tiên không chia phiếu), và khác các lần đa số PASS 2/3 ở round 7/9 (chưa từng là đồng thuận tuyệt đối theo hướng PASS); ba phiếu xác nhận phần TỰ VIẾT của bộ sinh (tiêu đề, ghi chú, tên mục, nhãn mermaid, ba dòng bản đồ trên thẻ /start) đạt N1-N6, ghi nhận 4 mã cổng dang/pham-vi/bang-chung/gia-tri nay đều kèm gloss ngay lần đầu xuất hiện — không còn nêu lại vướng mắc "chưa có mục trong CONTEXT.md" đã lặp lại xuyên suốt round 3-10; phần THỪA HƯỞNG nguyên văn từ hồ sơ cũ vẫn bị cả 3 lens ghi nhận có vi phạm N1/N2/N4/N6 nhưng không tính vào phán quyết vòng này vì cố ý không sửa. Vì đề xuất là PASS đồng thuận, verdict E13 tự chốt PASS (tier T2, không bắt buộc human_override khi panel tự chốt, giống round 7/9). Scope-triage review round này: mục "Trong hợp đồng" RỖNG — không finding nào map được vào AC; 8 finding thật đều xếp "Ngoài hợp đồng" (xem review-findings.md), không finding nào chặn AC. Verdict tổng round này: PASS — không eval máy nào fail (failed_evals: []), không finding "Trong hợp đồng" chặn merge, panel E9 đồng thuận PASS và panel E13 lần đầu đồng thuận PASS tuyệt đối (3/3, tier T2, không cần human_override).

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract