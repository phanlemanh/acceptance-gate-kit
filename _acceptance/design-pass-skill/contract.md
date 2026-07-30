---
schema_version: 2
feature: "design-pass-skill — skill mới `design-pass`: nghi thức thiết kế in-harness cho bước S1-D (phiên chuyên trách thẩm mỹ+UX trên proto C2 trong Browser pane, owner phản ứng bằng lời; thay vai ceremony design-mockup đã khai tử)"
slug: design-pass-skill
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-07-30T03:48:08Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-07-30-design-pass-skill-design.md
time_human_minutes:
  gate1: 10
---

# Acceptance contract — design-pass-skill

Bối cảnh: retro V1 bài B1 — vòng r1 fail vì không có khoảnh khắc visual có
chủ trước Gate 1; workflow v2 thêm bước S1-D "Gate 1 duyệt trên bản bấm
được". Ceremony cũ (design-mockup/evidence/push) khai tử theo audit invoke
14/2/0 lượt. design-pass là cỗ máy thay thế, nguyên tắc một mặt phẳng làm
việc. Vị trí skill (acceptance-gate `skills/` vs tái sinh design-loop) là
QUYẾT ĐỊNH MỞ trình tại Gate 1 — AC dưới viết trung lập theo `<skill-dir>`.

## Criteria

- AC-1: Given kit sau khi land, When đọc `<skill-dir>/design-pass/SKILL.md`,
  Then frontmatter có `name: design-pass` + description ghi CẢ trigger (phiên
  thẩm mỹ+UX trên proto C2 / bước S1-D) LẪN NOT-for (logic, backend, sửa
  component nền, chấm fidelity), và KHÔNG có `disable-model-invocation`
  (feature-loop S1-D sẽ model-invoke; giữ bất đối xứng ADR 0002); đối chứng
  dương: bản sao tiêm `disable-model-invocation: true` → case đỏ với thông
  điệp ghim.
- AC-2: Given SKILL.md, When đọc phần preflight, Then nghi thức đọc cấu hình
  TỪ `_acceptance/config.yaml`: key BẮT BUỘC `design_pass.proto_route` là
  TEMPLATE per-repo chứa `{slug}` (route là per-feature — override được bằng
  arg khi gọi) + key khuyến nghị `design_pass.ds_skill` (+ `capture_cmd`,
  `dev_cmd` optional), có lệnh mẫu `config-patch.mjs` để repo thêm khối,
  khai bước xác định workspace slug đang phục vụ (gọi standalone không slug
  → hỏi 1 câu / không chạy mồ côi), VÀ nhánh thiếu khối/`proto_route` =
  DỪNG nghi thức + in key thiếu đích danh (không fail-open sang route mặc
  định) — máy kiểm: các dotted key + chuỗi `{slug}` + chuỗi `config-patch`
  + đoạn DỪNG xuất hiện.
- AC-3: Given SKILL.md, When đọc phần nạp luật, Then khai ĐỦ 2 nguồn:
  `ux-ui-craft` (kit) và nguồn luật DS theo THANG có tên — mặc định skill
  của repo tiêu thụ đọc từ `design_pass.ds_skill`; ds_skill vắng/không
  resolve → (i) từ vựng token repo nhận diện được → dùng nó; (ii) repo
  0 token → từ vựng `shadcn` làm mặc định CÓ TÊN (chuẩn ngành công khai —
  repo khác stack chỉ mượn từ vựng token, không mượn component); CẢ HAI nấc
  TỰ ghi finding nhóm 2 nêu rõ nấc đã dùng — không im lặng bỏ, không nạp
  thiếu nguồn mà không để vết.
- AC-4: Given SKILL.md, When đọc phần mở đối tượng làm việc, Then đối tượng
  là BẢN BẤM ĐƯỢC ĐANG CHẠY mở trong Browser pane qua `proto_route`, với
  THANG VẬT LIỆU 3 bậc thành văn — `real-components` (mặc định; gồm cả
  surface mới ghép từ component sẵn có) / `scaffold` (khung bằng primitives
  + token repo) / `static` (HTML tĩnh token-only) — bậc đang dùng PHẢI khai
  `material:` trong ghi vết (hạ bậc để vết, không hạ ngầm); route không mở
  được → DỪNG nghi thức với thông điệp nêu bản bấm được chưa chạy + in
  `dev_cmd` nếu repo khai + hướng dựng, và có câu cấm tường minh "không tự
  dựng route/logic thay".
- AC-5: Given SKILL.md, When đọc ràng buộc cứng, Then đủ 4 luật thành văn:
  (a) chỉ từ vựng token repo — không hex mới; (b) không webfont;
  (c) không sửa `components/ui` "cho proto đẹp" — thiếu/xấu tầng component
  = finding nhóm 2 chờ Gate 1, sửa ở Build; (d) không logic nghiệp vụ /
  write-path trong vòng lặp.
- AC-6: Given SKILL.md, When đọc vòng lặp, Then mỗi vòng khai đúng nhịp
  sửa-proto → reload Browser pane → CHỜ owner phản ứng bằng lời; có câu cấm
  tự chấm thẩm mỹ thay owner (grading của máy ở S4, không ở phiên này).
- AC-7: Given SKILL.md, When đọc kết phiên, Then capture ma trận
  state × breakpoint (× theme khi repo có dark mode) về
  `_acceptance/<slug>/evidence/design-pass/`, nhánh proto-không-khai-states
  = hỏi owner danh sách đầu phiên rồi ghi frontmatter (không bịa, không
  chụp mỗi default rồi im), và có câu cấm tường minh ghi vào
  `evidence/design/` / tạo `provenance.json` (không bật nhầm công tắc CT2
  của ceremony đã khai tử); đối chứng dương: bản sao đổi đường capture về
  `evidence/design/` → case đỏ với thông điệp ghim.
- AC-8: Given SKILL.md, When rút khối giữa cặp marker
  `<<<DESIGN-PASS-NOTE-TEMPLATE` … `DESIGN-PASS-NOTE-TEMPLATE>>>`, Then được
  khuôn file `_acceptance/<slug>/design-pass.md` có frontmatter máy-đọc đủ
  10 trường (slug/at/route/material/ds_skill — giá trị THẬT đã dùng:
  tên-skill · repo-tokens · shadcn-default —/states/breakpoints/themes/
  patched/deferred) + section `## Findings` 2 nhóm (nhóm 1 vá-trong-token
  đã vá tại chỗ · nhóm 2 đòi-đổi-DS/component chờ Gate 1); round-trip:
  fixture sinh TỪ khuôn rút được parse lại đủ trường bằng reader của test
  (mẫu P55) — đối chứng đột biến: xoá marker → lỗi khớp nguyên văn.
- AC-9: Given mọi file mới của feature (SKILL.md + test), When grep, Then
  KHÔNG chứa tên/vật liệu repo tiêu thụ (`onehub`/`OneHub`, `deal-page`,
  `@onehub`, `mstar`) VÀ không tham chiếu surface ngoài như mắt xích của
  nghi thức (`claude.ai/design`, `/design-sync`, `/design-login`,
  `/design-mockup`) — kit là engine, một mặt phẳng; đối chứng dương: fixture
  tiêm từng lớp chuỗi cấm → case đỏ với thông điệp ghim.
- AC-10: Given bump version + `sync-plugin-packages.sh --check`, When chạy,
  Then exit 0 (mirror đồng bộ, skill mới có mặt trong package tương ứng) VÀ
  smoke DƯƠNG trên bản mirror: đọc frontmatter `name: design-pass` từ file
  TRONG `plugins/` — vật được giao chạy thật, không chỉ "không drift".
- AC-11: Given toàn bộ suite hiện hành (scripts/hooks/plugins/workflows),
  When chạy sau thay đổi, Then tất cả xanh — không hồi quy hành vi nào khác.
- AC-12: (judgment) SKILL.md giữ TRỌN 6 yêu cầu cốt lõi của thiết kế
  29-30/07 (in-harness một mặt phẳng · 2 nguồn luật từ config không hardcode
  · đối tượng là bản bấm được đang chạy + owner phản ứng bằng lời · ràng
  buộc cứng token/components-ui · kết phiên capture + findings 2 nhóm + ghi
  vết workspace · degrade tử tế) CỘNG 2 thang mở rộng quyết tại Gate 1
  (thang vật liệu 3 bậc khai `material:` · thang DS với shadcn mặc định có
  tên) và văn theo glossary CONTEXT.md — một kỹ sư ngoài cuộc đọc SKILL.md
  dựng lại được nghi thức mà không cần hỏi.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc; chân ngành:
[NGÀNH: superpowers brainstorming/writing-skills — khuôn nghi thức có
HARD-GATE] + [NGÀNH: anthropic skill-creator — khuôn frontmatter/description];
chân sản phẩm: 6 yêu cầu cốt lõi 29-30/07 + spec C2 + design-subtrack
tiền nhiệm):

- **G — giai đoạn nghi thức** (CE: 6 yêu cầu cốt lõi + §2.1 design doc):
  preflight (AC-2) · nạp luật (AC-3) · mở đối tượng (AC-4) · vòng lặp (AC-6)
  · kết phiên + ghi vết (AC-7, AC-8).
- **M — trạng thái môi trường / degrade** (CE: bảng degrade §2.4 — 5 hàng +
  2 thang): thiếu config (AC-2) · DS vắng → thang 2 nấc có tên (AC-3) ·
  route không chạy (AC-4) · bậc vật liệu khai material (AC-4) · states
  không khai (AC-7) · slug mồ côi (AC-2).
- **R — ràng buộc cứng** (CE: luật cứng C2 spec 2026-07-28 §3.2, 4 luật +
  doer≠grader): hex/webfont/components-ui/logic (AC-5) · không tự chấm
  (AC-6) · không bật nhầm CT2 (AC-7).
- **E — engine vs consumer + đóng gói** (CE: bất biến CLAUDE.md "kit là
  engine" + P30 + glossary): engine-clean & một-mặt-phẳng (AC-9) · mirror +
  smoke (AC-10) · frontmatter/invocation (AC-1) · không hồi quy (AC-11) ·
  chất lượng tổng thể (AC-12).

## Out of scope

- Khai tử design-mockup/design-evidence/design-push + design-subtrack —
  phần còn lại của F-D, feature riêng (audit invoke đã có số; gỡ ceremony
  chạm 2 harness + marketplace description).
- proto-init + proto-lint (máy soi hex/webfont/DB-import) — theo spec C2
  §3.4, chờ proto-c2 prove ở app repo (doctrine OneHub-trước-kit-sau).
- Wire feature-loop S1-D gọi design-pass bắt buộc — thuộc spec v2 một thể;
  design-pass đứng được một mình, feature-loop trỏ tới sau.
- Codex edition của design-pass — Browser pane là driver của Claude Code;
  parity chờ như các skill khác.
- uat-session — skill đề xuất riêng trong workflow v2.
- Đổi hành vi 2 công tắc CT1/CT2 hiện có của feature-loop — giữ nguyên,
  design-pass chỉ TRÁNH kích hoạt nhầm chúng (AC-7).

## Notes

- Known-limit khai trước từ Gate 1: máy chỉ kiểm được CẤU TRÚC + VĂN BẢN của
  SKILL.md, không kiểm được model có TUÂN nghi thức khi chạy thật — phép đo
  hành-vi là pilot r2 (retro chương trình đã ghi design-pass = giả thuyết
  chưa chạy).
- Known-limits hệ thống (khai tại Gate 1, 2026-07-30): (a) capture "bản đã
  duyệt" CHƯA có máy so hạ nguồn sau Build — chờ F-D proto-lint/fidelity;
  (b) đường phát hiện "feature chạm UI" ở consumer đã đứt từ khi gỡ
  design-loop 28/07 — spec v2 phải wire S1-D thay thế, nếu không design-pass
  chỉ được gọi tay; (c) owner async ngoài phạm vi (nghi thức đòi owner ngồi
  xem trực tiếp); (d) các đường degrade là văn bản CHƯA kiểm trên repo thật
  ngoài pilot artifact-platform (quyết r2-trước, breadth theo usage);
  (e) phiên design-pass SAU Gate 1 → findings đổ về `review-findings.md`
  (kênh giữa-vòng spec v2), không ghi đè design-pass.md của bản đã duyệt.
- Known-limits Cổng 2 (round 3, disposition Manh Phan 2026-07-30): (f) SKILL.md
  nói thẻ Gate 1 hiện `material:` nhưng reader của thẻ CHƯA đọc design-pass.md
  — writer ship trước, reader đi cùng hạng mục F-B card modes (workflow v2);
  tạm thời người duyệt đọc trực tiếp ghi vết. (g) description gói Codex nhắc
  v1.26 design-pass trong khi gói Codex chưa chứa skill này (parity đã khai
  Out of scope) — sửa mô tả ở đợt đối-chiếu-marketplace kế.
