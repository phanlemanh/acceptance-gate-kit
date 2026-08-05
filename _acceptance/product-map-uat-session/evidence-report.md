---
schema_version: 2
feature_slug: product-map-uat-session
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c1f781d9ccb880091988a9612f2dd0a5b72d3b82
human_signoff: Manh Phan 2026-08-04
---

# Evidence Report: product-map-uat-session (round 16)

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
| E19 | AC-14 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-product-map-uat-session-E1-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-product-map-uat-session-E2-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-product-map-uat-session-E3-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-product-map-uat-session-E4-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-product-map-uat-session-E5-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-product-map-uat-session-E6-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-product-map-uat-session-E7-r16
  exit_code: 0
  baseline: red
  verifier: config:executors.script.product_map
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E8
  run_id: minted-product-map-uat-session-E8-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E9
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt: §0 điều kiện vào (signed-off + ngưỡng UAT đã chốt tại Cổng Đáng) → §1 chép nguyên văn ngưỡng + cấm sửa sau khi thấy số (có lối SUPERSEDED quay lại Cổng Đáng) → §3 chấm kín TRƯỚC thảo luận + câu ràng buộc dạng "gửi cho khách nào, khi nào?" → §4 số đo cạnh ngưỡng → §5 verdict do người điền, agent tường minh không được điền thay → §6 làm mới PRODUCT-MAP sau ký kèm đường đọc-cũ đầy đủ cho repo chưa bật (in ghi chú, hai dòng bật ở config.yaml). Câu "KILL là thành công của quy trình" xuất hiện nguyên văn ở đầu file, đúng tinh thần Cổng Giá Trị của spec (§2.3, Chương 3). Không thấy chốt nào bị thiếu, đảo thứ tự hay diễn giải sai so với workflow-v2-spec.md §2.3.
    - operational-feasibility: PASS — SKILL.md giữ đủ 7 chốt của §2.3 đúng thứ tự: điều kiện vào ở mục 0 (signed-off + ngưỡng UAT chốt tại Cổng Đáng); chép nguyên văn ngưỡng + cấm sửa sau khi thấy số ở mục 1 (trước cả khi mời người); chấm kín trước thảo luận + câu ràng buộc (commitment device) cùng ở mục 3; verdict do người điền, agent bị cấm điền thay, ở mục 5; câu "KILL là thành công của quy trình" xuất hiện ngay đầu file (dòng 12-14); làm mới bản đồ sau ký ở mục 6, có nhánh đọc-cũ rõ ràng (kiểm risk_tiers.t1_skip_globs, in ghi chú hướng dẫn bật nếu repo chưa có PRODUCT-MAP). Không thấy chốt nào bị thiếu hay đảo thứ tự so với spec.
    - spec-alignment: PASS — SKILL.md giữ đủ và đúng thứ tự các chốt của §2.3: điều kiện vào kiểm cả signed-off và ngưỡng UAT đã chốt tại Cổng Đáng (mục 0); chép nguyên văn ngưỡng + khoá "đổi phép đo sau khi thấy số là gian" với lối thoát hợp thức quay lại Cổng Đáng (mục 1); chấm kín ép trước thảo luận bằng ràng buộc thứ tự file (mục 3) kèm commitment device "gửi cho khách nào, khi nào?" cùng bước; verdict chỉ người ký điền, agent bị cấm tường minh (mục 5); câu "KILL là thành công của quy trình" xuất hiện ngay đầu file; làm mới PRODUCT-MAP sau ký có nhánh đọc-cũ đầy đủ cho repo chưa bật bản đồ (mục 6), đúng bất biến "đổi schema phải có đường đọc-cũ" và khớp yêu cầu regen-tại-mọi-cổng-đóng ở Chương 4 của spec. Không tìm thấy chốt nào bị thiếu, đảo thứ tự, hay mâu thuẫn với workflow-v2-spec §2.3/§2.4/Chương 4 khi đọc độc lập hai file.

- eval: E10
  run_id: minted-product-map-uat-session-E10-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-product-map-uat-session-E11-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-product-map-uat-session-E12-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E13
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Phần TỰ VIẾT đạt N1-N6: bốn tên cổng (Cổng Đáng/Phạm vi/Bằng chứng/Giá trị) trong mermaid của PRODUCT-MAP.md có đoạn tự-giải-nghĩa thật ngay dưới hình (dòng 19-22) và bảng tra cứu thật ở CONTEXT.md §"Tên bốn cổng" (dòng 94-104) — đúng như luật N3/N6 đòi và đúng như ghi chú vòng 16 mô tả, không phải nhớ nhầm từ vòng trước; tiêu đề, note, nhãn mermaid (trạng thái + số việc) và dòng bản đồ trên thẻ /start (start.md bước 3, các câu "chưa có bản đồ...", "bản đồ đang lệch...") đều có chủ ngữ sản phẩm, tên kỹ thuật xuống ngoặc/backtick, đúng khuôn N1/N2/N4. Phần THỪA HƯỞNG — các mục liệt kê dưới "Chờ duyệt phạm vi/Đang làm/Đã giao" (vd "đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs...") chép nguyên văn field feature cũ, đậm ngôn ngữ máy, không tự đạt N1/N2/N6 nếu đứng riêng — nhưng đây đúng là phần đề bài xác nhận vòng này cố ý không sửa, không phải hồi quy của bộ sinh.
    - operational-feasibility: PASS — Đã xác thực trên vật thật (không dùng trí nhớ vòng trước): CONTEXT.md có bảng "Tên bốn cổng" (dòng 94-110) và PRODUCT-MAP.md có đoạn tự giải nghĩa bốn nhãn ngay dưới hình mermaid (dòng 19-22, khớp nguyên văn bảng CONTEXT), start.md cũng giải nghĩa mã cổng ngay lần đầu xuất hiện trên thẻ (dòng 34-37) — cả hai đạt N3/N6. Chữ do bộ sinh TỰ VIẾT đạt N1-N6, trừ một điểm mềm: từ "xưởng" (PRODUCT-MAP.md dòng 3) là tiếng thường dễ hiểu nhưng dùng ẩn dụ, không có mục trong CONTEXT.md — không đủ nặng để chặn. Phần THỪA HƯỞNG nguyên văn từ hồ sơ feature cũ đã ký vẫn mang giọng máy vi phạm N1/N2, nhưng đây đúng là phần vòng này CỐ Ý không sửa, không phải hồi quy mới.
    - spec-alignment: PASS — Phần TỰ VIẾT của bộ sinh (tiêu đề, ghi chú, nhãn mermaid, đoạn "Bốn cổng người" tự giải nghĩa dưới hình trong PRODUCT-MAP.md, và các chuỗi hiển thị mà /start.md tự soạn) đạt N1-N6: bảng "Tên bốn cổng" trong CONTEXT.md và dòng tự giải nghĩa bốn nhãn dưới hình đều THẬT trên vật (đã đọc trực tiếp, không dùng trí nhớ vòng trước), tên cổng khớp đúng cả hai nơi, mã máy xuống ngoặc đúng N2, mỗi node/dòng một ý đúng N4. Phần THỪA HƯỞNG nguyên văn trường feature: từ hồ sơ cũ vi phạm N1/N4 — nhưng đây đúng là phần cố ý không sửa vòng này, và trường nguồn vốn nằm trong danh sách "mặt máy" được human-facing-language.md miễn trừ tại nguồn.

- eval: E14
  run_id: minted-product-map-uat-session-E14-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T09:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E15
  run_id: minted-product-map-uat-session-E15-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E16
  run_id: minted-product-map-uat-session-E16-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E17
  run_id: minted-product-map-uat-session-E17-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E18
  run_id: minted-product-map-uat-session-E18-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

- eval: E19
  run_id: minted-product-map-uat-session-E19-r16
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
      PASS: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E8, E10, E11, E12, E15, E16, E17, E18, E19, E14 — tất cả pass trên CẢ HEAD lẫn diffBase (baseline: green) vì đây là các case trong `tests/plugins/run-tests.sh` và `scripts/sync-plugin-packages.sh --check`: bộ test đã tồn tại và đã xanh trước round này, cùng chạy trên bản chưa có thay đổi round 16 (tên bốn cổng vào glossary + bản đồ tự giải nghĩa nhãn cổng). Đây là regression-guard đang bảo vệ hành vi đã ổn định của các round trước (P115-P130), không phải bằng chứng phân biệt cho riêng round 16 — hợp lý vì round 16 chỉ thêm nội dung glossary/tự-giải-nghĩa mà các case này không trực tiếp đo. E7 (`product-map.mjs --check`, baseline: red) là eval phân biệt thật của round này.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 14: gom cách ĐỌC hồ sơ vào luật chung + chặn fail-open của `--check` (commit 863fa28) — trở lại implementation sau khi phát hiện lỗ fail-open.
Round 15: sửa hồi quy hiển thị của r14 + chốt xoá bản đồ hết cần lịch sử git (29d2291), sau đó thêm tên bốn cổng vào glossary + bản đồ tự giải nghĩa nhãn cổng (662715a) — trở lại implementation để đóng E17/E19.
Round 16: toàn bộ 19 eval PASS (E1-E19, gồm E17/E19 kiểm bản đồ tự giải nghĩa + tên bốn cổng) — verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract


### Re-pin — 2026-08-05 (sau gate-card-ngon-ngu-may 1.32.0), tại 866c89e

`verified_commit` lên `866c89e`. Nguyên nhân stale: PR #29 sửa LỚP TRÌNH BÀY
thẻ cổng — scripts/gate-card.js (nối bullet hard-wrap, tầng card-plain cho
Coverage/gap-probe, lột markdown ở fallback) + writer doc 2 harness + test
P146–P148 + bump manifest 1.32.0 + vẽ lại PRODUCT-MAP.md + fix grep portable.
Không luật cưỡng chế nào đổi: hooks/, lib/, pre-merge-check.sh,
recheck-evidence.js KHÔNG nằm trong diff.

- **ĐÃ chạy lại:** toàn bộ machine lane tại `866c89e` — 596 case scripts ·
  51 hooks · plugins pass (kèm P146–P148 mới) · workflows pass · mirror in
  sync · product-map khớp; cả 6 suite_keys exit 0. Minh bạch: MỘT lượt chạy
  chung trong phiên fix CI của PR #29 cho cả đợt re-pin 19 slug, không phải
  agent tươi per-slug (khuôn 1-lượt có máy đối chiếu là việc của
  delta-verify-repin, đã duyệt Cổng 1, chưa ship).
- **KHÔNG chạy lại:** eval judgment, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực.

### Re-pin lần 2 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0
