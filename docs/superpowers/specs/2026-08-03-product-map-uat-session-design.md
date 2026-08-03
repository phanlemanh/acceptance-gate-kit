# Design: product-map-uat-session (F-B — PRODUCT-MAP + phiên nghiệm thu)

Ngày: 2026-08-03 · Slug: `product-map-uat-session` · Tier: T2
Nguồn intent: docs/plans/2026-07-27-discovery-gate0-rollout.md (hạng mục F-B) +
docs/specs/workflow-v2-spec.md (mục "Vận hành PRODUCT-MAP (quyết 30/07)", bảng
artifact, §2.3 Phiên UAT) + ghi chú Notes trong
`_acceptance/start-command/contract.md`.

## Phạm vi vòng này (khoanh bởi owner khi mở vòng)

Ba vật giao, một mạch: (1) **bộ sinh PRODUCT-MAP** `scripts/product-map.mjs`,
(2) **skill `uat-session`** — nghi thức Cổng Giá trị trên sản phẩm thật, ghi
`uat-session.md` máy-đọc, (3) **`start-scan.mjs` đọc 2 nguồn mới** thay 2 dòng
skip-có-tên đã ghi nợ từ vòng start-command.

KHÔNG thuộc vòng này (Later của scan hình thái): card Cổng 0/Cổng Giá trị trong
`/acceptance-card`, funnel số trong `/acceptance-report`, write-side `epic:` tại
D1b (thuộc F-A), lát-2 từ section Out of scope của contract vào map, status
`superseded`.

## 1. Bộ sinh PRODUCT-MAP (`scripts/product-map.mjs`)

**Vai:** script generic (KHÔNG khoá invocation — tách khỏi lệnh người, theo
workflow-v2-spec 30/07 và ADR 0002 giữ nguyên danh sách LOCKED). Đọc
`_acceptance/*/` + `.out-of-scope/*.md`, sinh `PRODUCT-MAP.md` tại gốc repo.
Import `lib/evidence-core.js` (`frontmatterField`) làm reader duy nhất — cùng
tiêu chí "đọc được" với mọi cổng khác; đường dẫn suy từ vị trí script.

**CLI:** `node scripts/product-map.mjs [--root <dir>] [--check]`. Export hàm
`renderProductMap(root)` để start-scan import (tính `map.fresh` không cần
child process).

**Bucket THÔ — bất biến giữa hai lần đóng cổng người.** Nội dung map chỉ được
đổi tại các chuyển trạng thái do NGƯỜI ký; chuyển trạng thái máy
(approved→implemented→verified) không được làm map lệch, nếu không `--check`
đỏ oan giữa vòng:

| Nguồn quan sát | Mục trong map |
|---|---|
| opportunity stage ≠ decided (hoặc thiếu decision) | Đang cân nhắc cơ hội |
| opportunity decision build/iterate, chưa có contract | Sắp mở vòng |
| contract status draft | Vòng đang mở — chờ duyệt phạm vi |
| contract status approved / implemented / verified | Vòng đang mở — đang dựng và nghiệm thu máy (MỘT nhãn chung) |
| contract signed-off + opportunity build/iterate + chưa có verdict nghiệm thu | Đã ship — chờ phiên nghiệm thu |
| contract signed-off (không thuộc đường A, hoặc không có opportunity) | Đã ship |
| uat-session verdict release / iterate / kill | Đã nghiệm thu giá trị (ghi rõ kết cục) |
| opportunity decision park | Xếp lại sau |
| opportunity decision kill | Đã bác từ khám phá |
| `.out-of-scope/*.md` | Ngoài phạm vi đã ký (title = dòng `# ` đầu file) |
| frontmatter không parse được | Hồ sơ hỏng (vẫn hiện, không crash) |

**Luật enum-lạc (gap-probe F1):** mọi field ĐIỀU HƯỚNG bucket (`status`,
`stage`, `decision`, `verdict`) mang giá trị ngoài enum của bảng → slug rơi
vào **Hồ sơ hỏng** kèm tên field + giá trị lạc — không slug nào được BIẾN MẤT
im lặng vì typo; cùng luật cho start-scan (`broken[]`). Test tiêm giá trị lạc
cho TỪNG field điều hướng (quét theo lớp, không chỉ verdict).

**Cạnh:** đọc `epic:` / `supersedes:` / `relates:` từ frontmatter opportunity +
contract; render inline (`· epic: X · thay thế: Y · liên quan: Z`) KHI CÓ, vắng
thì im — read-side sẵn sàng, write-side thuộc F-A.

**Tính xác định:** sort slug tăng dần trong từng mục; thứ tự mục cố định; KHÔNG
timestamp trong file (điều kiện để `--check` so bằng đẳng thức chuỗi). Mục
trống thì bỏ, không in "(trống)". Ngôn ngữ mặt người (N1–N6) cho heading và
dòng mô tả.

**`--check` (pattern P30):**
- file tồn tại + khớp render → exit 0.
- file tồn tại + lệch → exit 1, thông điệp ghim theo KHUÔN:
  `PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node <đường-dẫn-script> --root .`
  trong đó `<đường-dẫn-script>` SUY TỪ VỊ TRÍ script đang chạy (gap-probe F3:
  self-host in `scripts/product-map.mjs`, repo tiêu thụ in đường dẫn plugin
  thật — lệnh copy được chạy được ở CHÍNH repo đang đỏ, không phải ở repo kit).
- file CHƯA tồn tại → exit 0 + note một dòng (đường đọc-cũ: consumer chưa dựng
  map là hợp lệ; map sẽ tự xuất hiện ở lần đóng cổng kế).
- repo chưa có `_acceptance/config.yaml` → exit 0 + note (chưa init, không việc gì để làm).

**Điểm regen (regen tại MỌI lần đóng cổng người):**
- `commands/approve.md` + `commands/signoff.md` + codex
  `approve`/`signoff` SKILL.md: thêm một bước sau khi ghi field cổng —
  `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root .` (self-host kit
  chạy `scripts/` tại gốc).
- skill `uat-session`: regen sau khi verdict được ký.
- Cổng Đáng hôm nay còn ký tay (chưa có lệnh riêng) → không có điểm regen máy;
  lưới đỡ là `--check` trong CI + cờ `map.fresh` trên thẻ `/start` (lệch thì
  một lệnh là hết).
- Self-host: thêm `executors.script.product_map` + append vào
  `feature_loop.suite_keys` trong `_acceptance/config.yaml`, và một case kiểu
  P30 chạy `--check` trên CHÍNH repo trong tests/plugins (CI đỏ khi drift).

## 2. Skill `uat-session` (phiên nghiệm thu — Cổng Giá trị)

**Vị trí:** `skills/uat-session/SKILL.md` (plugin acceptance-gate) — skill
nghi thức có người ngồi, MỞ model-invocation theo tiền lệ design-pass (khoá là
gãy loop; các field quyết định vẫn human-owned). Bản Codex: CHƯA có ở vòng này
(known-limit, cùng dạng design-pass).

**Điều kiện vào:** contract `signed-off` + `opportunity.md` có ngưỡng UAT đã
chốt tại Cổng Đáng + sản phẩm thật chạy sau flag. Thiếu → dừng nói rõ thiếu gì
(đường B/C/E không có phiên nghiệm thu — contract Notes đã tự ghi).

**Nhịp phiên (theo spec §2.3):**
1. Dựng hồ sơ `_acceptance/<slug>/uat-session.md` từ template, `stage: scheduled`
   — CHÉP nguyên văn ngưỡng đã khai từ opportunity vào section khoá; từ lúc
   thấy số, CẤM sửa ngưỡng (muốn đổi phép đo → nghi thức `[SUPERSEDED]` bên
   opportunity, giữ bản gốc).
2. Mời stakeholder/người dùng đại diện; ghi danh sách.
3. **Chấm kín trước thảo luận** (chống social-desirability): thu điểm/nhận xét
   TỪNG NGƯỜI trước khi mở thảo luận chung; bảng chấm kín ghi vào hồ sơ trước,
   thảo luận ghi sau — thứ tự trong file là vết.
4. **Commitment device**: hỏi từng người "anh/chị gửi cho khách nào, khi nào?"
   — ghi nguyên văn.
5. Số đo thật (tracking) đặt cạnh ngưỡng đã khai — số so ngưỡng, không so cảm giác.
6. Người ký Cổng Giá trị điền `verdict: release|iterate|kill` +
   `decided_by`/`decided_at`/`time_human_minutes.gateUAT`. **KILL tại đây là
   THÀNH CÔNG của quy trình** — skill phải nói câu đó ở bước trình quyết định.
7. Sau ký: regen PRODUCT-MAP; gợi ý bước kế theo verdict (release → nghi thức
   release repo; iterate → cơ hội quay vòng; kill → đóng có hồ sơ).

**Template:** `skills/acceptance/references/uat-session-template.md`, khối
frontmatter máy-đọc trong marker `<!-- <<<UAT-FRONTMATTER-TEMPLATE -->` (mẫu
OOC-ITEM-TEMPLATE + case P55): test rút template, điền placeholder, đưa cho
CHÍNH start-scan/product-map đọc — khuôn seam LLM-viết→máy-đọc đặt một chỗ.

```yaml
---
schema_version: 1
slug: {slug}
feature: {feature}
owner: {owner}
stage: {stage}            # scheduled | held
verdict: {verdict}        # release | iterate | kill — người ký Cổng Giá trị điền, để trống tới lúc ký
decided_by: {decided_by}
decided_at: {decided_at}  # ISO UTC
time_human_minutes:
  gateUAT: {gateUAT_minutes}
---
```

## 3. `start-scan.mjs` đọc 2 nguồn mới

- **PRODUCT-MAP:** bỏ dòng skip `PRODUCT-MAP.md`; thêm key
  `map: { present: bool, fresh: bool|null }` (fresh = render so bằng file;
  lỗi khi tính → null). Thẻ `/start` in một dòng trạng thái bản đồ; lệch →
  gợi ý đúng một lệnh regen.
- **Phiên nghiệm thu:** bỏ dòng skip `phiên-nghiệm-thu`; ô mới theo bảng phân ô
  (cập nhật docs/specs/2026-08-03-start-command-design.md — nguồn sự thật P98):

| Artifact quan sát được | Ô | Bước kế |
|---|---|---|
| signed-off + opportunity build/iterate + uat-session vắng hoặc verdict trống | chờ-Cổng-Giá-trị (`gate: gia-tri`) | — |
| uat-session verdict release | đã-ký (`state: released`) | — |
| uat-session verdict iterate | đã-ký (`state: uat-iterate`) | — |
| uat-session verdict kill | đã-ký (`state: uat-kill`) | — |
| uat-session frontmatter không parse được | broken[] | — |

  Ưu tiên tra từ artifact muộn nhất giữ nguyên: uat-session → evidence →
  contract → opportunity. `since` của ô chờ-Cổng-Giá-trị = `decided_at` của
  uat nếu có, thiếu → mtime contract.md (quy tắc since hiện hành).
- **Marker:** khối START-SCAN-KEYS trong CẢ `commands/start.md` lẫn
  `codex/acceptance-gate/skills/start/SKILL.md` thêm `map.present map.fresh`
  (P99 round-trip giữ khớp). `skipped[]` GIỮ trong schema (giờ thường rỗng) —
  cơ chế skip-có-tên còn dùng cho nguồn tương lai.

## 4. Kiểm chứng (đối chứng dương + ghim thông điệp — bất biến CLAUDE.md)

Case mới trong tests/plugins (P102+), fixture code-sinh trong chính lần chạy.
**Khuôn fixture canonical (gap-probe F2):** fixture opportunity rút từ khối
marker `OPP-FRONTMATTER-TEMPLATE` của opportunity-template.md, fixture
contract rút từ khuôn contract-template.md (chưa có marker → vòng này ĐẶT
marker, cùng lý do khối UAT tồn tại), điền placeholder bằng code — test không
được tự dựng frontmatter theo khuôn bên đọc (hình dạng 3 của "thước gắn vào
vật được giao").
- **P102** product-map phân bucket: fixture phủ ĐỦ mọi hàng bảng bucket
  (kể cả broken + out-of-scope + cạnh có/vắng); assert từng slug đúng mục,
  tổng vào map = tổng fixture.
- **P103** bất biến giữa chuyển máy + `--check` 3 trạng thái: cùng fixture đổi
  approved→implemented→verified → render BẤT BIẾN; bản nguyên vẹn `--check`
  XANH trước, tiêm lệch → exit 1 + ĐÚNG thông điệp ghim; xoá file → exit 0 có note.
- **P104** (kiểu P30) `--check` trên CHÍNH repo: PRODUCT-MAP.md của kit đã
  commit và fresh — CI đỏ khi ai đó đổi trạng thái xưởng mà quên regen.
- **P105** round-trip template UAT: rút khối UAT-FRONTMATTER-TEMPLATE từ
  reference, điền placeholder bằng code, đưa cho start-scan + product-map đọc
  → ra đúng ô/mục; tiêm hỏng frontmatter → broken[] có tên + lý do.
- **P106** start-scan nguồn mới: các ô gia-tri/released/uat-iterate/uat-kill +
  `map.present/fresh` đúng cả 4 tổ hợp (vắng, có-fresh, có-stale, lỗi render);
  hai dòng skip cũ KHÔNG còn trong output.
- **P98/P99 mở rộng:** fixture P98 thêm hàng mới của bảng phân ô; P99 tự ăn
  key mới qua marker.
- Regen wiring: grep-có-đối-chứng trên 4 file lệnh (approve/signoff × 2
  harness) + uat-session SKILL — chấp nhận đo-chữ vì với lệnh prompt-as-code,
  văn bản LÀ hành vi.

## 5. Trade-off đã cân

- **Bucket thô vs map chi tiết:** chọn thô để `--check` không đỏ oan giữa vòng;
  chi tiết per-status đã có ở thẻ `/start` — hai vật hai vai, không trùng.
- **Regen bằng văn lệnh vs hook tự regen:** hook write-time đã có tiền lệ bác
  (.out-of-scope/gap-probe-write-time-hook.md — guard đọc trạng thái do chính
  bên bị ràng buộc ghi); văn lệnh + `--check` CI là điểm nghẽn đầu ra đúng nghĩa.
- **uat-session mở vs khoá invocation:** giữ mở theo tiền lệ design-pass và ADR
  0002 — thao tác NGHI THỨC khác thao tác KÝ; chữ ký vẫn human-owned trong file.
- **`--check` missing-file = exit 0:** đường đọc-cũ cho consumer chưa dựng map;
  đổi lại consumer có thể không bao giờ dựng — lưới là dòng map trên thẻ /start.
