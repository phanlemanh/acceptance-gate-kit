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

- AC-1: Given commit ngay trước commit gỡ đầu tiên, When đọc danh sách mốc git, Then tồn
  tại mốc `truoc-luu-kho-2026-08` trỏ đúng commit đó, và `git checkout` mốc đó
  cho lại cây có đủ `codex/`, `design-loop/`, `plugins/`.
- AC-2: Given cây đã gỡ, When liệt kê đường dẫn, Then `codex/`, `tests/codex/`,
  `scripts/codex-self-script-refs.tsv`, `.agents/`, `design-loop/`,
  `tests/design-loop/` **không còn trên cây**; đối chứng dương: cả sáu đều tồn
  tại ở cây của mốc `truoc-luu-kho-2026-08`.
- AC-3: Given hai marketplace, When đọc `.claude-plugin/marketplace.json`, Then
  entry `design-loop` đã gỡ và hai entry còn lại (`acceptance-gate`,
  `feature-loop`) trỏ nguyên vẹn; `.agents/plugins/marketplace.json` không còn
  tồn tại.
- AC-4: Given `GUIDE.md`, `QUICKSTART.md`, `README.md`, `CONTEXT.md`, các
  `SKILL.md` và `commands/*.md`, When quét tham chiếu SỐNG tới đồ đã lưu kho
  (`codex`, `In Codex…`, `design-loop`, `/design-init`, `/design-mockup`,
  `/design-push`), Then 0 hit; `docs/` (sử liệu) và `_acceptance/` (hồ sơ cũ)
  ngoài phạm vi. Đối chứng dương ở cây của mốc: >0 hit cho TỪNG từ khoá.
- AC-5: Given nhánh CT2 trong `feature-loop/skills/feature-loop/SKILL.md`, When
  một feature chạm mặt người mà config chưa wire design, Then máy hướng sang
  **design-pass + eval `ui-check`/`design-gate`**, KHÔNG còn cảnh báo
  "cài design-loop" và KHÔNG còn DỪNG đòi `/design-mockup`; `GUIDE.md` có một
  đoạn ngắn hướng dẫn wire `executors.design` bằng tay.
- AC-6: Given danh sách CẤM ĐỤNG, When kiểm sau khi gỡ, Then `scripts/design-gate.mjs`,
  `scripts/design-scan.js`, `scripts/build-design-scan.mjs`, `lib/design-detect.mjs`,
  `lib/p-tiers.json`, `vendor/impeccable/`, `tests/design-eval/`, `tests/skills/`,
  và skill `design-pass` + `ux-ui-craft` **còn nguyên**, suite liên quan xanh
  (đối chứng giữ-gân). `design-loop/scripts/design-static-check.mjs` đi theo mốc git
  vì nó thuộc design-loop, không thuộc kit.
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
  **đều không còn**; `CLAUDE.md` không còn tuyên bố bất biến về mirror.
  (Xem Notes — đây là chỗ lệch đề bài.)
- AC-10: Given `scripts/product-map.mjs` và `scripts/start-scan.mjs` (hai script
  có nhánh đọc Codex), When chạy sau khi gỡ, Then chúng chạy sạch, không nhánh
  chết, `product-map --check` xanh.
- AC-11: Given cây đã gỡ, When chạy 4 suite (`scripts`, `hooks`, `plugins`,
  `workflows`) + `product-map --check`, Then tất cả xanh. Suite `plugins` phải
  còn **>0 case** sau khi gỡ P30 — suite rỗng cũng xanh, nên eval ghim SỐ CASE,
  không chỉ mã thoát.

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
