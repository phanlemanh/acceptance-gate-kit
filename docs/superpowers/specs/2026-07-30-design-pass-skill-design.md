# design-pass — nghi thức thiết kế in-harness (skill mới)

*2026-07-30 · slug `design-pass-skill` · T2 (chạm `skills/` nguồn + mirror).
Nguồn thiết kế: workflow v2 overview (S1-D) · retro V1 bài B1 · retro chương
trình (design-pass = giả thuyết chưa chạy) · rollout Amendment 28-30/07 (F-D)
· spec C2 của artifact-platform (2026-07-28). Sáu yêu cầu cốt lõi do owner
chưng cất 29-30/07 — là RÀNG BUỘC, không phải gợi ý.*

## 1. Vấn đề

Vòng r1 của trang-tu-van-v2 fail một phần vì **không có khoảnh khắc visual có
chủ** trước Gate 1: máy hội tụ 8 round vào một hợp đồng sai khung, Gate 2 bác
(retro B1). Workflow v2 trả lời bằng bước **S1-D**: feature chạm UI phải có
bản bấm được TRƯỚC Gate 1 — "Gate 1 duyệt trên bản bấm được, không duyệt UI
bằng chữ". Cỗ máy cũ cho khoảnh khắc đó (design-mockup/design-evidence/
design-push — ceremony CT2 của design-loop, dựa trên Claude Design bridge) đã
chết theo audit invoke 28/07 (14/2/0 lượt) và vi phạm nguyên tắc mới **một mặt
phẳng làm việc**. Cần một nghi thức thay thế chạy TRONG Claude Code, trên
artifact thật.

## 2. Giải pháp — skill `design-pass`

Một skill mới: **phiên chuyên trách thẩm mỹ + UX**, iterate trực tiếp trên
route/proto ĐANG CHẠY bằng component thật (đường C2), mở trong Browser pane,
owner ngồi xem và phản ứng bằng lời từng vòng. Không Claude Design, không
gương ngoài, không surface thứ hai.

### 2.1 Hình dạng nghi thức (5 giai đoạn)

1. **Preflight** — đọc `_acceptance/config.yaml` khối `design_pass.*` + xác
   định workspace slug đang phục vụ. Thiếu gì nói đích danh (bảng degrade
   §2.4), không lỗi mờ.
2. **Nạp 2 nguồn luật** — (a) skill `ux-ui-craft` của kit (cùng plugin);
   (b) nguồn luật DS theo **thang DS** (xem Hai thang bên dưới) — mặc định
   là skill chuẩn DS/plugin của REPO TIÊU THỤ, tên đọc từ
   `design_pass.ds_skill`. Kit là engine: không hardcode bất kỳ tên repo
   tiêu thụ nào.
3. **Mở đối tượng làm việc** — navigate Browser pane tới bản bấm được đang
   chạy: URL từ `design_pass.proto_route` (TEMPLATE chứa `{slug}`, vd
   `http://localhost:3000/proto/{slug}`; override được bằng arg khi gọi —
   route là per-feature, config là per-repo). Vật liệu của bản bấm được theo
   **thang vật liệu** bên dưới. Không mở được → DỪNG nghi thức có thông điệp
   (§2.4), tuyệt đối không tự dựng route/logic thay.
4. **Vòng lặp owner-phản-ứng** — mỗi vòng: sửa code proto (CHỈ thẩm mỹ + UX,
   trong từ vựng token) → reload Browser pane → chờ owner phản ứng bằng lời
   → vòng kế. Skill không tự chấm thẩm mỹ thay owner; máy chấm (nếu có) ở S4,
   không ở đây (doer≠grader giữ nguyên).
5. **Kết phiên** — capture ma trận state × breakpoint (× theme khi repo có
   dark mode); findings phân 2 nhóm; ghi vết vào workspace slug (§2.3).

**Hai thang biến thiên — một nghi thức đủ rộng cho repo hiện hữu LẪN repo
mới (quyết owner tại Gate 1, 2026-07-30).** Nghi thức 5 giai đoạn là BẤT
BIẾN; giữa các repo chỉ hai thứ biến thiên, mỗi thứ một thang, mọi hạ bậc
phải ĐỂ VẾT — paved road, opt-out có tên (nguyên lý 3 spec C2):

- **Thang vật liệu** của bản bấm được — khai `material:` trong frontmatter
  ghi vết, thẻ Gate 1 hiện để người duyệt biết độ tin + công port:
  | Bậc | Khi nào | Độ tin |
  |---|---|---|
  | `real-components` (MẶC ĐỊNH) | repo có component/token — kể cả SURFACE MỚI: proto module mới ghép từ component sẵn có (đường C2; pilot T7-T9 đúng dạng này) | Fidelity cấu trúc, drift 0, công port ~0 |
  | `scaffold` | repo có token/DS nhưng chưa đủ component cho surface này — dựng khung bằng primitives + token repo | Token đúng, hình khối component là nháp |
  | `static` | repo mới tinh / khác stack — HTML tĩnh token-only mở trong Browser pane | Chỉ ý định thị giác; công port xa nhất |
- **Thang nguồn luật DS** (khi `design_pass.ds_skill` vắng / không resolve):
  (i) repo có từ vựng token nhận diện được (theme.css / tailwind config /
  tương đương) → dùng nó làm luật; (ii) repo 0 token → dùng từ vựng
  **shadcn** làm mặc định CÓ TÊN — token/component đề xuất trong phiên theo
  khuôn shadcn, và finding nhóm 2 trình Gate 1 nhận nó làm DS hạt giống của
  repo hay thay. Nhắc tên shadcn trong kit hợp lệ: chuẩn ngành công khai
  (như nhắc WCAG), không phải vật liệu consumer, không vendor thân skill;
  khuôn shadcn thiên React/Tailwind — repo khác stack chỉ mượn TỪ VỰNG
  token, không mượn component (ghi rõ trong SKILL.md).

### 2.2 Ràng buộc cứng (kế thừa luật cứng C2, spec 2026-07-28 §3.2)

- Chỉ từ vựng token của repo — **không hex mới, không webfont**.
- **KHÔNG sửa `components/ui` "cho proto đẹp"** — thiếu/xấu ở tầng component
  = finding nhóm 2, ghi chờ Gate 1, sửa ở Build.
- Không thêm logic nghiệp vụ / write-path trong vòng lặp — phiên này CHỈ làm
  thẩm mỹ + UX.

### 2.3 Đầu ra kết phiên (ghi vết workspace)

- **Capture**: `_acceptance/<slug>/evidence/design-pass/<state>--<breakpoint>.png`
  — ma trận state (từ khai báo states của proto; proto KHÔNG khai states →
  hỏi owner danh sách ngay đầu phiên, ghi vào frontmatter, không bịa)
  × breakpoint (mặc định mobile 375 / desktop 1280 qua resize Browser pane)
  × theme (light/dark khi repo có dark mode — resize Browser pane hỗ trợ
  colorScheme; repo có lệnh chụp riêng → khai `design_pass.capture_cmd`,
  optional).
- **QUYẾT ĐỊNH CÓ CHỦ ĐÍCH**: KHÔNG ghi vào `evidence/design/` và KHÔNG tạo
  `provenance.json` — đó là trigger của công tắc CT2 (ceremony cũ) trong
  feature-loop hiện hành; design-pass không được bật nhầm làn đã khai tử.
- **Findings + ma trận**: file `_acceptance/<slug>/design-pass.md`, frontmatter
  máy-đọc (`slug / at / route / ds_skill / states / breakpoints / patched /
  deferred`) + bảng capture + `## Findings` 2 nhóm:
  - **Nhóm 1 — vá-được-trong-từ-vựng-token**: đã vá tại chỗ trong phiên
    (ghi gì-đã-đổi, 1 dòng/finding).
  - **Nhóm 2 — đòi-đổi-DS/component**: KHÔNG vá; ghi chờ Gate 1 quyết.
  Frontmatter gồm 10 trường máy-đọc: `slug / at / route / material /
  ds_skill (giá trị THẬT đã dùng: tên skill · "repo-tokens" ·
  "shadcn-default") / states / breakpoints / themes / patched / deferred`.
  Khuôn file đặt MỘT chỗ trong SKILL.md giữa cặp marker
  `<<<DESIGN-PASS-NOTE-TEMPLATE` … `DESIGN-PASS-NOTE-TEMPLATE>>>` (bài học
  OOC-ITEM-TEMPLATE: seam LLM-viết→máy-đọc phải có khuôn một chỗ có marker,
  test round-trip rút-từ-writer).

### 2.4 Degrade tử tế (bảng — mỗi thiếu hụt 1 hàng, không lỗi mờ)

| Thiếu | Hành xử |
|---|---|
| Khối `design_pass` / key `proto_route` trong config | DỪNG, in key thiếu đích danh + lệnh mẫu `config-patch.mjs --key design_pass.proto_route --value <url-template>` + giải thích cần bản bấm được đang chạy (trỏ spec C2). KHÔNG fail-open sang route mặc định. |
| `design_pass.ds_skill` vắng / skill không resolve được | CHẠY TIẾP theo thang DS: (i) từ vựng token repo nhận diện được → dùng nó; (ii) repo 0 token → từ vựng shadcn mặc định CÓ TÊN. Cả hai nấc TỰ ghi 1 finding nhóm 2 nêu rõ nấc đã dùng — degrade có tên, không im lặng. |
| Route khai trong config nhưng không mở được (404/refused) | DỪNG nghi thức: nói rõ bản bấm được chưa chạy, in `design_pass.dev_cmd` nếu repo đã khai (chưa khai → nói rõ chưa có lệnh khởi động được khai + trỏ đường dựng proto C2). KHÔNG tự dựng. |
| Proto không khai danh sách state | Hỏi owner danh sách state cần duyệt NGAY ĐẦU PHIÊN (1 câu), ghi vào frontmatter `states` — không bịa, không chụp mỗi default rồi im. |
| Workspace slug không xác định (gọi standalone, không đưa slug) | Hỏi user đúng 1 câu chọn slug trong `_acceptance/`; không có workspace nào → nói rõ design-pass phục vụ một feature đang trong vòng lặp, không chạy mồ côi. |

### 2.5 Frontmatter & invocation

- `name: design-pass`; description ghi rõ trigger (phiên thẩm mỹ+UX trên
  proto C2 trong bước S1-D của feature-loop, hoặc user gọi thẳng khi muốn
  design-pass một surface đang chạy) và NOT-for (logic, backend, sửa
  component nền, chấm fidelity).
- **KHÔNG** `disable-model-invocation` — feature-loop S1-D (spec v2) sẽ
  model-invoke nó; cùng phía "cố tình để mở" như acceptance-card (ADR 0002,
  bất đối xứng P31/P32 không đổi).

## 3. Quyết định mở — VỊ TRÍ SKILL (trình Gate 1, không tự quyết)

**Phương án A — `skills/design-pass/` trong plugin acceptance-gate (đề xuất).**
- Ưu: mọi repo tiêu thụ ĐÃ cài acceptance-gate (plugin design-loop đã bị gỡ
  khỏi consumer 28/07 — đặt vào đó là phát hành vào plugin không ai cài);
  nguồn luật số 1 (ux-ui-craft) cùng plugin — một lần resolve; preflight S0
  của feature-loop đã resolve acceptance-gate sẵn, S1-D chỉ thêm một
  `--require`. Usage là trọng tài (retro meta #3): acceptance-gate là plugin
  sống, design-loop là plugin 0-invoke.
- Nhược: acceptance-gate phình concept (description marketplace nói
  contract/evals/evidence); khi F-D đủ bộ (proto-init + proto-lint theo spec
  C2 §3.4) có thể phải quyết lại nhà cho cả cụm design — chấp nhận: quyết
  lại lúc đó bằng 1 ADR, chi phí move một thư mục skill là thấp.

**Phương án B — tái sinh `design-loop/skills/design-pass/`.**
- Ưu: đúng bản đồ F-D (rollout ghi nơi chạm `design-loop/ + mirror`; spec C2
  tầng 1 đặt proto-init/proto-lint vào design-loop) — vật design về một
  plugin, acceptance-gate giữ gọn.
- Nhược: consumer phải cài LẠI plugin vừa gỡ; ceremony cũ (design-subtrack,
  4 commands, description "Claude Design bridge") nằm cạnh skill mới — plugin
  tự mâu thuẫn với "một mặt phẳng" nếu không khai tử cùng lượt, mà khai tử
  cùng lượt thì scope phình đúng chỗ plan đã cảnh báo (F-A phình → tách).

## 4. Kiến trúc file (theo phương án A; B chỉ đổi prefix đường dẫn)

```
skills/design-pass/SKILL.md      # nguồn — nghi thức 5 giai đoạn + bảng degrade
                                 #   + khuôn design-pass.md giữa marker
plugins/acceptance-gate/skills/design-pass/   # mirror (sync cùng commit, P30)
tests/plugins/run-tests.sh       # case DP* mới (âm tính có đối chứng dương)
_acceptance/config.yaml          # KHÔNG sửa ở repo kit (kit không có web UI);
                                 #   khối design_pass là của repo TIÊU THỤ
```

Khối config đề xuất cho repo tiêu thụ (ghi trong SKILL.md, thêm bằng
`config-patch.mjs`):

```yaml
design_pass:
  proto_route: "<url-template>"   # BẮT BUỘC — template per-repo chứa {slug} (vd http://localhost:3000/proto/{slug}); override bằng arg mỗi lần gọi
  ds_skill: "<plugin>:<skill>"    # KHUYẾN NGHỊ — skill chuẩn DS của repo; vắng → thang DS (từ vựng repo → shadcn mặc định)
  dev_cmd: "<lệnh dev server>"    # OPTIONAL — để thông điệp DỪNG-route-chết in đúng lệnh khởi động
  capture_cmd: "<lệnh chụp>"      # OPTIONAL — vắng thì chụp bằng Browser pane
```

## 5. Điều KHÔNG làm (out of scope — xem contract)

Khai tử ceremony cũ, proto-init/proto-lint, wire feature-loop S1-D, Codex
edition, uat-session — mỗi cái một dòng lý do trong contract.

## 6. Kiểm chứng

- Máy: case tests/plugins mới grep cấu trúc SKILL.md (5 giai đoạn, bảng
  degrade, marker template, 2 key config, engine-clean, không surface ngoài)
  — mọi case âm tính có đối chứng dương + ghim thông điệp (bất biến
  CLAUDE.md); round-trip khuôn marker theo mẫu P55; smoke bản mirror.
- Judgment: panel đọc SKILL.md + spec này + 6 yêu cầu cốt lõi.
- Nghi thức "phá thử một lần cho mỗi phép đo mới" áp khi viết test ở S3.
- **Giới hạn trung thực:** skill là văn bản hành vi cho model — máy chỉ kiểm
  được CẤU TRÚC + VĂN BẢN, không kiểm được model có TUÂN không. Phép đo
  hành-vi-thật là lần chạy pilot r2 (đã ghi ở retro: design-pass là giả
  thuyết, r2 kiểm) — ngoài phạm vi eval của feature này, ghi thành known-limit
  ngay từ Gate 1.
- **Known-limits hệ thống (khai trước, xem Notes contract):** (a) capture
  "bản đã duyệt" chưa có máy so hạ nguồn sau Build (chờ F-D proto-lint/
  fidelity); (b) đường phát hiện "feature chạm UI" ở consumer đã đứt từ khi
  gỡ design-loop — spec v2 phải wire S1-D thay; (c) owner async (không ngồi
  xem trực tiếp) ngoài phạm vi; (d) các đường degrade là văn bản chưa kiểm
  trên repo thật ngoài pilot (quyết r2-trước, breadth theo usage); (e) phiên
  design-pass SAU Gate 1 (phản hồi thẩm mỹ giữa S3/S4) → findings đổ về
  `review-findings.md` theo quy ước kênh-giữa-vòng của spec v2, không ghi
  đè design-pass.md của bản đã duyệt.
