---
schema_version: 1
feature: Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR
slug: luu-kho-codex-va-nghi-le-design
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: luu-kho-codex-va-nghi-le-design

## Context

Kit đang nuôi hai harness song sinh. Mọi thay đổi trong lõi kit phải sửa hai lần: một
lần ở cây nguồn cho Claude, một lần ở lớp phủ Codex — rồi build lại một bản
mirror phẳng và commit nó. Owner tuyên 12/08: đội chủ yếu dùng Claude. Nhánh
nghi lễ của design-loop (mockup → evidence → push) cũng đã tự ghi khai tử trong
bản đồ sản phẩm: ba bước của nó không tự động được, và repo tiêu thụ chưa có mặt người nào để thiết kế.

Hồ sơ này **chỉ TRỪ**, và mọi thứ gỡ đều lấy lại được bằng một mốc git đặt ngay
trước commit gỡ đầu tiên. Máy đo design của kit **ở lại** — nó là kit, không
phải design-loop.

Source input: [docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md](../../docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md)
· bản neo [docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](../../docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)

## Criteria

Mọi tiêu chí âm tính ("không còn X") PHẢI kèm đối chứng dương: cùng câu quét
chạy trên cây của mốc `truoc-luu-kho-2026-08` cho **>0 hit**, eval in cả hai con
số. Cố ý neo vào mốc chứ không vào `origin/main`: mốc bất biến, `origin/main`
còn di chuyển — và một needle gõ sai cho 0 hit ở CẢ HAI đầu, nên vế "mốc >0" là
chân duy nhất phân biệt "đã gỡ" với "phép đo chưa bao giờ chạy". Mốc VẮNG →
eval ĐỎ, không phải bỏ qua.

- AC-1: Given commit ngay trước commit gỡ đầu tiên, When đọc danh sách mốc git,
  Then tồn tại mốc `truoc-luu-kho-2026-08` trỏ đúng commit đó, cây của mốc có đủ
  `codex/`, `design-loop/`, `plugins/`, **mốc là CHA TRỰC TIẾP của commit gỡ đầu
  tiên** (không chấp nhận quan hệ tổ-tiên: `git rev-list` giữa mốc và commit đầu
  tiên chạm một trong sáu đường dẫn AC-2 phải RỖNG), **và mốc đã có mặt trên
  remote** với đúng sha (`git ls-remote --tags origin`). Hai vế sau là bắt buộc
  vì mốc này là chân duy nhất của CẢ đường-đảo-rẻ LẪN mọi đối chứng dương của
  E1–E10: mốc chỉ nằm local thì sau merge không ai ngoài máy tác giả hoàn tác
  được ~194 file, hai ADR ghim một sha không ai resolve nổi, và mọi lần chạy lại
  verify đỏ vĩnh viễn theo đúng luật fail-closed.
- AC-2: Given cây đã gỡ, When liệt kê đường dẫn, Then `codex/`, `tests/codex/`,
  `scripts/codex-self-script-refs.tsv`, `.agents/`, `design-loop/`,
  `tests/design-loop/` **không còn trên cây**; đối chứng dương: cả sáu đều tồn
  tại ở cây của mốc `truoc-luu-kho-2026-08`.
- AC-3: Given hai marketplace, When đọc `.claude-plugin/marketplace.json`, Then
  entry `design-loop` đã gỡ và hai entry còn lại (`acceptance-gate`,
  `feature-loop`) trỏ nguyên vẹn; `.agents/plugins/marketplace.json` không còn
  tồn tại.
- AC-4: Given phạm vi quét = `commands/`, `skills/`, `feature-loop/`, `scripts/`,
  `lib/`, `hooks/`, `tests/`, `GUIDE.md`, `QUICKSTART.md`, `README.md`,
  `CONTEXT.md`, **`CLAUDE.md`**, **`.github/`**, và hai manifest, When quét tham
  chiếu SỐNG tới đồ đã lưu kho — mảng **11 needle**: `codex` · `In Codex` ·
  `.agents` · `design-loop` · `/design-init` · `/design-mockup` · `/design-push`
  · `sync-plugin-packages` · `mirror_sync` · `plugins/` · `P30` — Then 0 hit
  (trừ danh sách miễn trừ dưới); `docs/` và `_acceptance/` ngoài phạm vi. Đối
  chứng dương ở cây của mốc: >0 hit cho TỪNG needle.
  **Vì sao thêm `CLAUDE.md` + `.github/` + từ vựng mirror:** thiếu chúng thì gỡ
  `plugins/` và script sync xong, đoạn bất biến trong `CLAUDE.md` vẫn bắt "chạy
  sync và commit mirror cùng lượt" và CI vẫn gọi script đã xoá — 14/14 eval
  xanh, hai cổng duyệt, rồi CI đỏ sau merge.
  **Miễn trừ tường minh, quyết TRƯỚC khi đo, đúng MỘT dòng:**
  `skills/ux-ui-craft/SKILL.md:289` dùng cụm "a design-loop" làm **danh từ
  chung** ("một vòng lặp thiết kế đối chiếu bản dựng với bản thiết kế gốc"),
  không trỏ plugin. Miễn trừ này phải kèm chân ĐỎ-NGOÀI-DANH-SÁCH (xem AC-12),
  vì một allowlist không có chân đó biến lưới fail-loud thành fail-silent.
- AC-12: Given danh sách miễn trừ của AC-4, When tiêm một tham chiếu
  `design-loop` MỚI vào một file khác trong `skills/ux-ui-craft/`, Then lưới
  vẫn ĐỎ và ghim đúng file vừa tiêm — miễn trừ chỉ che đúng một dòng đã khai,
  không che cả thư mục.
- AC-5: Given nhánh CT2 trong `feature-loop/skills/feature-loop/SKILL.md`, When
  một feature chạm mặt người mà config chưa wire design, Then máy hướng sang
  **design-pass + eval `ui-check`/`design-gate`**, KHÔNG còn cảnh báo
  "cài design-loop" và KHÔNG còn DỪNG đòi `/design-mockup`; `GUIDE.md` có một
  đoạn ngắn hướng dẫn wire `executors.design` bằng tay.
- AC-6: Given danh sách CẤM ĐỤNG, When kiểm sau khi gỡ, Then `scripts/design-gate.mjs`,
  `scripts/design-scan.js`, `scripts/build-design-scan.mjs`, `lib/design-detect.mjs`,
  `lib/p-tiers.json`, `vendor/impeccable/`, `tests/design-eval/`, `tests/skills/`,
  và skill `design-pass` **còn nguyên** (so bằng BĂM NỘI DUNG với mốc, không
  chỉ `test -e` — tồn-tại-mà-bị-sửa là đúng kiểu cắt nhầm gân mà `test -e` mù),
  suite liên quan xanh. `design-loop/scripts/design-static-check.mjs` đi theo
  mốc git vì nó thuộc design-loop, không thuộc kit.
  **NGOẠI LỆ DUY NHẤT được khác mốc — `skills/ux-ui-craft/`.** Bản trước viết
  "ngoại lệ được phép khác mốc: không có"; kiểm tại chỗ chứng minh câu đó SAI và
  nếu giữ thì AC-4 và AC-6 mâu thuẫn nhau, **không tồn tại trạng thái cây nào
  cho cả bộ xanh** — sửa file cho AC-4 xanh thì AC-6 đỏ, giữ nguyên cho AC-6
  xanh thì AC-4 đỏ, và lối thoát rẻ nhất lúc đó là nới một trong hai sau khi đã
  thấy số, tức hạ thước. Sự thật trên vật: `skills/ux-ui-craft/references/layout-craft.md:121`
  chứa **tham chiếu SỐNG** — "Where design-loop is wired… (`design-static-check`'s
  layout-token-only BLOCK)" — trỏ đúng plugin và đúng script sắp chết, nên nó
  là PHẠM VI PHẢI SỬA, không phải miễn trừ. Câu đó viết lại thành nói về
  `design-pass` + `design-gate` (máy đo ở lại). Dòng `SKILL.md:289` là danh từ
  chung, giữ nguyên (miễn trừ của AC-4).
- AC-7: Given `docs/adr/`, When đọc sau khi gỡ, Then có 2 ADR một-đoạn mới —
  (a) lưu kho Codex, (b) khai tử nghi lễ design-loop — mỗi ADR ghi **đúng sha**
  của mốc git và nêu trigger mở lại.
- AC-8: Given ADR 0001 (commit `plugins/` như build mirror), When đọc sau khi
  gỡ, Then nó được đánh dấu **superseded** kèm trỏ tới ADR mới — không xoá sử
  liệu, vì lý do tồn tại của nó (manifest Codex không đọc được cây đa-edition)
  chết cùng Codex.
- AC-9: Given mirror `plugins/` và bộ máy quanh nó, When kiểm sau khi gỡ, Then
  `plugins/` (125 file), `scripts/sync-plugin-packages.sh`, case P30, khoá
  `executors.script.mirror_sync` và suite-key tương ứng trong
  `_acceptance/config.yaml`, và mục `plugins/**` trong `t1_skip_globs`
  **đều không còn**. (Xem Notes — đây là chỗ lệch đề bài.)
- AC-13: Given `CLAUDE.md`, When đọc sau khi gỡ, Then nó **không còn tuyên bố
  bất biến về build mirror** (4 chỗ nhắc `sync-plugin-packages` / "build
  mirror" hiện tại), đối chứng dương ở cây của mốc >0. Tách khỏi AC-9 (mệnh
  đề này nằm trong một file KHÔNG có lưới máy nào canh (`CLAUDE.md` thuộc
  `t1_skip_globs`) — gộp chung thì nó chìm trong một tiêu chí có 5 vế khác đều
  do script đo, và không ai nhận ra nó chưa được đo).
- AC-10: Given `scripts/product-map.mjs` và `scripts/start-scan.mjs` (hai script
  có nhánh đọc Codex), When **CHẠY THẬT cả hai** trên cây đã gỡ, Then mỗi script
  in đúng câu thành công của nó và không lỗi đọc file. Bản trước chỉ chạy
  `product-map`; `start-scan.mjs` chỉ nằm trong `paths`, mà `paths` không phải
  một thao tác. Kịch bản lọt: nhánh đọc Codex trong `start-scan.mjs` gỡ nửa
  chừng, còn một lượt đọc `.agents/plugins/marketplace.json` — đường dẫn đó
  KHÔNG chứa chuỗi `codex` nên needle cũ mù với nó — cả bộ xanh, lỗi chỉ nổ khi
  một người thật gõ lệnh khởi động ở repo tiêu thụ.
- AC-11: Given cây đã gỡ, When chạy 4 suite + `product-map --check`, Then tất cả
  xanh **và số ca khớp ĐẲNG THỨC khai trước**, không phải khớp một cái sàn:
  `scripts` **671 → 664** (gỡ 7 assert `DSC01–03` + `SG1–4` trong
  `tests/scripts/run-tests.sh:1390-1406` gọi thẳng script của design-loop) ·
  `plugins` **173 → 173 trừ số ca của P30** · `hooks` **54 → 54** ·
  `workflows` **62 → 62**. Đỏ ghim "so ca lech ky vong: <truoc> -> <sau>".
  **Sàn `≥` không dùng được cho một suite bị chủ ý làm teo** — nó chỉ đúng cho
  suite không đụng tới; dùng sàn ở đây thì lúc S4 đỏ, đường thoát tự nhiên là
  hạ con số xuống mức vừa đo, và phép đo mất hẳn khả năng bắt gỡ-nhầm.

## Coverage

Quét trên trục **vật bị gỡ × loại tham chiếu × lưới canh nó**.

- Trục **vật** (5): `codex/` (36 file) · `tests/codex/` + `tests/design-loop/`
  (17) · `design-loop/` (16) · `plugins/` mirror (125) · manifest & config.
  [thước CE: `git ls-files` đếm tại chỗ trong worktree này]
- Trục **loại tham chiếu** (4): manifest máy đọc · nhánh code (`resolve-plugin.mjs`,
  `product-map.mjs`, `start-scan.mjs`, `sync-plugin-packages.sh`) · văn bản chỉ
  dẫn (SKILL/command/GUIDE/QUICKSTART/README) · khoá config + suite key.
  [thước CE: grep tiêu-thụ-thật, không grep tên file — đề bài 1b.3]
- Trục **lưới canh** (3): P30 mirror-drift · `product-map --check` · suite
  `plugins`. [thước CE: cả ba đều đổi hình dạng sau khi gỡ, nên mỗi cái cần một
  eval riêng chứ không dựa vào mã thoát trọn suite]

**Ranh giới đã kiểm bằng grep tiêu-thụ-thật** (không suy từ tên):
`plugins/` chỉ được `.agents/plugins/marketplace.json` (Codex) trỏ vào; ba
plugin Claude lấy nguồn từ `./`, `./feature-loop`, `./design-loop` trong
`.claude-plugin/marketplace.json`. Máy đo design nằm ở `scripts/` + `lib/` cấp
kit, không nằm trong `design-loop/`; `tests/design-eval` và `tests/skills`
không tham chiếu `design-loop`.

## Out of scope

- **Xoá `docs/`** — sử liệu để nguyên, kể cả ADR 0001 (chỉ đánh dấu superseded).
- **Sửa hồ sơ `_acceptance/` cũ** — hàng chục hồ sơ đã ký có eval trỏ
  `executors.script.mirror_sync`. Chúng là sử liệu bất biến; luật staleness
  theo diff PR (chip ①) không soi hồ sơ ngoài diff, nên không cần migrate.
  Hệ quả phải khai: **chạy lại verify một hồ sơ cũ sẽ hỏng** vì suite key đã
  chết — chấp nhận, ghi known-limit.
- **Gỡ trường/khoá của đợt 2** (trạng thái veto, đổi luật cổng) — không thuộc
  hồ sơ này.
- **Cắt đo-phút trong `codex/`** — 5 file Codex có `time_human_minutes` chết
  theo AC-2, hồ sơ 1a cố ý không đụng.

## Notes

- **LỆCH ĐỀ BÀI (mục 1b.4) — đã kiểm trên vật, cần owner gạch tại Cổng 1.**
  Đề bài viết: *"Mirror: chạy `sync-plugin-packages.sh` và commit mirror CÙNG
  lượt; P30 phải xanh"* — tức giả định mirror sống tiếp. Kiểm tại chỗ cho thấy
  **`plugins/` tồn tại CHỈ để phục vụ Codex**: `.agents/plugins/marketplace.json`
  là bên duy nhất trỏ vào nó, và ADR 0001 nói thẳng lý do tồn tại là "manifest
  Codex không trỏ được vào cây nguồn đa-edition". Lưu kho Codex mà giữ mirror
  thì còn lại 125 file máy sinh không ai đọc, cộng một lưới (P30) canh sự khớp
  của thứ vô dụng đó. Khuyến nghị **một đường**: gỡ luôn mirror + sync script +
  P30 + hai khoá config, và đánh dấu ADR 0001 superseded. Đây cũng là cách duy
  nhất đạt mục tiêu M4 của bản neo ("nơi phải sửa-hai-lần = 0") — giữ mirror là
  giữ nguyên chỗ sửa-hai-lần. Nếu owner bác, đường lùi là giữ mirror nguyên
  trạng và chấp nhận M4 chỉ đạt một nửa.
- Tổng vật gỡ nếu duyệt khuyến nghị: **~194 file** (125 mirror + 36 codex +
  17 case đo + 16 design-loop) + 1 sync script + 2 khoá config + 2 manifest.
- Thứ tự bắt buộc: đặt mốc git TRƯỚC commit gỡ đầu tiên (AC-1), và ADR ghi sha của
  mốc nên ADR viết SAU khi có mốc.
- Hồ sơ này và hồ sơ `cat-hinh-thuc` là hai nhánh độc lập từ `daa9b3d`; tiêu chí
  âm tính của `cat-hinh-thuc` cố ý loại trừ `codex/` vì hồ sơ này xoá nó.
  **AC-11 của `cat-hinh-thuc` đòi `sync-plugin-packages.sh --check` xanh — tiêu
  chí đó chết khi hồ sơ này merge.** Bên nào merge sau phải rebase và bỏ tiêu
  chí đó; ghi ở đây để không ai phát hiện muộn.
