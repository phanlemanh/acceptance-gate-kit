---
schema_version: 1
feature: Pha 3 — gói lưới 5 món cho discovery + feature-loop (template opportunity + platform-fit gap-probe + nạp DS skill + Gate 1 tự in /goal + wire S1-D design-pass)
slug: pha3-goi-luoi
risk_tier: T2
surfaces: [cli]
status: implemented
owner: phanlemanh@gmail.com
approved_by: Manh Phan
approved_at: 2026-07-30T07:32:36Z
time_human_minutes:
  gate1: 5
  gate2:
---

# Acceptance contract — pha3-goi-luoi

## Criteria

- AC-1 (món 1 — template tồn tại đủ mục): Given package acceptance-gate, When mở `skills/acceptance/references/opportunity-template.md`, Then file có frontmatter mẫu trong khối marker `OPP-FRONTMATTER-TEMPLATE` và đủ các section đã dùng thật ở V1: Vấn đề & ai gặp · Giả định chốt sinh tử · Ngưỡng chết / ngưỡng UAT · Kết quả prototype · Cổng 0 · Thước đo thành công · Bảng nợ kế thừa · Out of scope từ khám phá.
- AC-2 (món 1 — round-trip frontmatter): Given khuôn frontmatter rút từ marker của CHÍNH template, When điền giá trị mẫu và đọc bằng reader thật `frontmatterField()` của `lib/evidence-core.js`, Then các key top-level `slug`/`stage`/`decision`/`decided_by`/`decided_at`/`owner` trả đúng giá trị mẫu; và When đột biến xoá `---` đóng frontmatter, Then reader trả null (đối chứng âm có ghim hành vi).
- AC-3 (món 1 — trường Nguồn ngoài & phạm vi kế thừa): Given section `## Nguồn ngoài & phạm vi kế thừa`, Then nó buộc phân loại TỪNG món vật liệu ngoài repo thành `triết-lý/logic` (kế thừa được) hoặc `ngôn-ngữ-thiết-kế/hình-thái` (mặc định KHÔNG — chuẩn repo tiêu thụ thắng), và ghi rõ: kế thừa hình thái phải khai đích danh + người ký tại Cổng 0; kèm mệnh đề răng nguyên văn "không phân loại = chưa đủ điều kiện ký Cổng 0".
- AC-4 (món 2 — platform-fit, Claude): Given `feature-loop/skills/feature-loop/SKILL.md` mục S1#7, When đọc danh sách cross-check bắt buộc của gap-probe, Then có vế "artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp".
- AC-5 (món 2 — platform-fit, Codex): Given `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` step 8, Then danh sách cross-checks có cùng vế đó bản tiếng Anh (does the artifact set follow the consuming repo's existing UI/plugin standards; which repo skill/rule should have been loaded but was not).
- AC-6 (món 3 — nạp DS skill, Claude): Given feature chạm UI, When S1 chạy, Then SKILL chỉ dẫn đọc key config `feature_loop.ui_standards_skill`; key có → BẮT BUỘC nạp skill đó trước khi sinh 3 artifact; key vắng → ghi chú đúng 1 dòng vào gói Gate 1, KHÔNG chặn.
- AC-7 (món 3 — nạp DS skill, Codex): Given codex SKILL S1, Then cùng hành vi AC-6 (đọc `feature_loop.ui_standards_skill`, bắt buộc nạp khi có, ghi chú 1 dòng khi vắng, không chặn).
- AC-8 (món 4 — /goal nhúng + in mặc định): Given `feature-loop/skills/feature-loop/SKILL.md` mục GATE 1, Then template /goal nằm NGUYÊN VĂN trong khối marker `GOAL-TEMPLATE` ngay trong SKILL (không phụ thuộc GUIDE lúc runtime), với chỉ dẫn in mặc định đã điền slug ngay khi duyệt; template bắt đầu bằng `/goal`, chứa điều kiện `verified`, chứa lối thoát escalate (`REJECT quá 3 round`), KHÔNG nhắm đích `signed-off`.
- AC-9 (món 4 — chống trôi 2 bản + không phá Codex): Given khối `GOAL-TEMPLATE` trong SKILL và trong GUIDE.md, When rút cả hai qua marker và chuẩn hoá fence, Then hai khối bằng nhau từng ký tự — bản sao nguyên vẹn phải XANH trước (đối chứng dương), rồi đột biến một bản trong bản sao → phép so ĐỎ với đúng thông điệp mismatch nêu tên 2 file + nhãn GOAL-TEMPLATE; và dòng gợi ý `/goal` native trong codex SKILL vẫn còn nguyên (đối chứng không-phá — chính feature này sửa cùng file đó).
- AC-10 (món 5 — lane → design-pass): Given feature chạm UI, Then câu hỏi lane trong SKILL đổi thành: chạy skill `design-pass` (acceptance-gate ≥ 1.26.0) TRƯỚC Gate 1; bỏ qua PHẢI là entry `descope` có tên trong ledger; và mục GATE 1 ghi rõ: UI feature trình BẢN BẤM ĐƯỢC cùng thẻ, không duyệt UI bằng chữ.
- AC-11 (mirror đồng bộ): Given mọi sửa đổi nguồn `skills/` + `codex/`, When chạy `sync-plugin-packages.sh --check`, Then exit 0 — mirror `plugins/` được sync và commit cùng lượt.
- AC-12 (release có chủ đích): Given deliverable ship xong, Then `.claude-plugin/plugin.json` (acceptance-gate) version ≥ 1.27.0 và `feature-loop/.claude-plugin/plugin.json` version ≥ 1.19.0 (so semver, không so chuỗi), và description của cả hai nhắc hành vi mới (template opportunity / các lưới S1-Gate 1) — consumer chỉ nhận lưới qua release, quên bump = feature ship mà hiệu lực bằng 0.

## Coverage

- Trục Món (1-5) × Harness (Claude/Codex) × Loại bằng chứng (round-trip / drift-pin / grep-pin / mutation control) — từ morphological-scan preset test-matrix.
- Thước CE: brief Pha 3 (spec ngoài đã chốt scope đóng) + retro B1/B4 + mẫu P55; danh mục section template đối chiếu [NGÀNH: SVPG Opportunity Assessment, Teresa Torres OST].
- Core 11 ô → AC-1..AC-12; món 4 × Codex nâng Later → Core theo gap-probe F3 ("không phá" nay có thước — đối chứng không-phá trong AC-9).
- Never có vết: món 5 × Codex (revisit `d-20260730T050548Z-4723`) · máy-enforce /goal · khai tử ceremony (F-D) · reader S0 (F-A).

## Out of scope

- Codex wire design-pass — package codex chưa ship skill; chờ đợt audit marketplace (revisit đã ghi trong ledger design-pass-skill).
- Máy-enforce /goal bằng hook — brief cấm xây máy mới ngoài test.
- Khai tử CT1/CT2/design-mockup ceremony (F-D) — bảng cũ giữ nguyên làm đường đọc-cũ.
- Reader máy đọc opportunity.md ở S0 + card mode Cổng 0 (F-A/F-B).
- Mọi hạng mục spec v2 khác: B3 cap round cứng, B5 kênh phản hồi giữa vòng, B6 trạng thái đóng vòng, B7 worktree-mặc-định.

## Notes

- Template opportunity nằm trong package acceptance-gate → cả hai harness đọc cùng file; không cần bản codex riêng.
- Key nồng cốt lồng nhau (`prototype.*`, `time_human_minutes.*`) chưa có reader máy — reader thật là việc F-B; marker để test nâng cấp sau.
