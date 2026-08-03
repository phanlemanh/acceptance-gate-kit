# Lệnh `/start` — mở phiên làm việc không cần prompt tự do — Design

> **Trạng thái: thiết kế đã duyệt hướng (Manh, chat maintainer 03/08), CHỜ THI
> CÔNG qua feature-loop (hạng mục F-H, plan rollout §Bổ sung 03/08).** Phiên
> thi công đọc file này làm input S1; contract + evals do vòng đó viết.

## Vấn đề

Khoảnh khắc mở Claude Code trên một repo và bắt đầu làm việc chưa có nghi
thức: người dùng phải gõ một câu tự do ("đọc handoff rồi tiếp tục", "làm
tiếp đi", "hôm nay làm gì"…). Mỗi cách gõ ra một biến thể phiên — có phiên
đọc handoff, có phiên không; có phiên tự chọn việc, có phiên hỏi lan man.
Workflow v2 phủ từ vòng HIỂU tới TRAO nhưng **bước 0 — vào phiên — đang là
prompt-lottery**. (Chính phiên maintainer 03/08 cũng vào bằng một câu tự do.)

## Giải: một lệnh người gõ, máy định hướng, người chọn bằng một chữ cái

`/start` — thao tác NGƯỜI (khoá model-invocation cả 2 harness — ứng viên
"thao tác cổng người thứ 6" đã khai nợ sẵn trong plan rollout §Nợ đã khai,
kèm mở rộng P31/P32).

### Hành vi (engine-generic — KHÔNG chứa ngữ cảnh sản phẩm/đội)

1. **Đọc máy, không hỏi người:**
   - Không có `_acceptance/config.yaml` → một dòng gợi ý `/acceptance-init`,
     dừng.
   - Quét `_acceptance/*/`: `opportunity.md` (stage/decision) + `contract.md`
     (status, risk_tier) + `evidence-report.md` (verdict, human_signoff) →
     xếp MỖI slug vào đúng MỘT ô: chờ-Cổng-Đáng · vòng-đang-dở (kèm bước kế
     S1/S1-D/S2/S3/S4 suy từ artifact có mặt) · chờ-Cổng-Phạm-vi ·
     chờ-Cổng-Bằng-chứng · chờ-phiên-nghiệm-thu · đã-ký.
   - `PRODUCT-MAP.md` có → đọc làm nguồn "việc xếp hàng" (park/lát-2);
     chưa có → skip-có-tên một dòng.
   - Git: nhánh hiện tại + cây bẩn — để cảnh báo một-worktree-một-phiên khi
     người chọn resume.
2. **Nạp `human-facing-language.md` TRƯỚC khi viết** (cùng khuôn
   acceptance-status/card).
3. **Trình MỘT thẻ, ba nhóm, theo thứ tự ưu tiên:**
   - **Chờ chữ ký của anh** — mỗi cổng một dòng: cổng nào, của vòng nào,
     ước phút (~10′). Cổng chờ lâu nhất lên đầu.
   - **Đang dở** — mỗi vòng một dòng: *người dùng sẽ được gì* + bước kế +
     nhắc worktree nếu vòng đó có cây riêng.
   - **Bắt đầu việc mới** — đúng ba lối: (a) ý còn mơ hồ → buổi khai thác
     vòng HIỂU (grill/brainstorm theo nghi thức advisor); (b) việc đã rõ →
     `/feature-loop <mô tả>`; (c) việc vặt khớp miễn T1 → sửa thẳng.
4. **MỘT câu hỏi chọn bằng chữ cái/số dòng** → bàn giao sang nghi thức đích.
   Resume vòng dở mà phiên đang đứng cây chung → nhắc mở worktree/phiên riêng
   trước (cạm bẫy đã dẫm 01/08).
5. **Lệnh KHÔNG tự làm nội dung.** Chỉ định hướng + bàn giao. Không đọc/ghi
   file sản phẩm, không sửa gì — thao tác chỉ-đọc.

### Vì sao khoá model-invocation

Cùng lý do ADR 0002: đây là nghi thức của NGƯỜI tại điểm vào phiên; model tự
gọi giữa chừng chỉ tạo nhiễu định hướng lại — đúng loại biến thể lệnh này
sinh ra để diệt. `acceptance-card` vẫn mở (được `/start` trình khi người chọn
một cổng).

### Phạm vi thi công (một vòng T2)

| Chạm | Việc |
|---|---|
| `commands/start.md` | Thân lệnh (khuôn: acceptance-status.md — frontmatter + các bước đánh số) |
| `codex/acceptance-gate/skills/start/` | SKILL.md + `agents/openai.yaml` khoá `allow_implicit_invocation: false` |
| `tests/plugins/run-tests.sh` | Mở rộng danh sách LOCKED của P31/P32 thêm `start` (nợ đã khai) + case mới: thẻ render đủ 3 nhóm trên fixture workspace do-code-sinh (đối chứng dương + bản tiêm hỏng ghim đúng thông điệp) |
| `GUIDE.md` + `README.md` | Một mục "vào phiên bằng /start" |
| mirror | `sync-plugin-packages.sh` + commit cùng lượt |

### Ngoài phạm vi (nói tên để khỏi bàn lại)

- KHÔNG đọc `docs/handoff/` — handoff là quy ước riêng repo kit, không phải
  engine; repo nào muốn thì nối qua PRODUCT-MAP/queue của nó.
- KHÔNG tự nhận đường A/B/C/D/E (đó là F-E).
- KHÔNG thay `/acceptance-status` (status = bảng tra soát máy; start = thẻ
  định hướng + bàn giao — hai vật khác nhau).

## Thiết kế thi công (S1 vòng start-command, 03/08)

Hai quyết định chốt với owner đầu S1 (ledger `_acceptance/start-command/`):

1. **Phân loại nằm trong script, prose nằm trong lệnh.** Thêm
   `scripts/start-scan.mjs --root <dir>` (đầu ra LUÔN là JSON một dòng — không
   có cờ định dạng): quét `_acceptance/*/`,
   đọc frontmatter (qua `lib/evidence-core.js` — cùng reader mọi cổng đang
   dùng, không viết parser mới), xuất inventory ĐÃ PHÂN Ô dạng JSON.
   `commands/start.md` chỉ còn: chạy script → nạp
   `human-facing-language.md` → dịch sang tiếng sản phẩm → MỘT câu hỏi.
   Cùng khuôn gate-card: *cái gì buộc phải hiện thì script render/emit,
   model không được quên hay điền sai*; và thước S4 gắn được vào ĐẦU RA
   script trên fixture code-sinh thay vì grep file hướng dẫn.
2. **Ô nào chưa có nguồn thì skip-có-tên, không bịa schema.** Cổng-Đáng
   dựng THẬT (schema `opportunity.md` đã chốt ở opportunity-template).
   PRODUCT-MAP + phiên-nghiệm-thu (nguồn UAT): chưa tồn tại (F-B) → JSON
   emit mục `skipped[]` có tên nguồn + lý do, thẻ in đúng một dòng mỗi
   nguồn. Khi F-B dựng nguồn, chỉ script đổi — lệnh giữ nguyên khuôn.

### Bảng phân ô (nguồn sự thật cho scan + test)

| Artifact quan sát được | Ô | Bước kế |
|---|---|---|
| `opportunity.md` stage ≠ `decided` (hoặc thiếu `decision`) | chờ-Cổng-Đáng | — |
| `opportunity.md` decision `build`/`iterate`, CHƯA có `contract.md` | vòng-đang-dở | S1 |
| `opportunity.md` decision `park`/`kill` | đã-xếp (nhóm đã-ký/nghỉ) | — |
| `contract.md` status `draft` | chờ-Cổng-Phạm-vi | — |
| status `approved`, chưa có plan khớp `*<slug>*` trong `docs/**/plans/` | vòng-đang-dở | S2 |
| status `approved`, có plan | vòng-đang-dở | S3 |
| status `implemented`, evidence vắng hoặc verdict REJECT | vòng-đang-dở | S4 / S3-fix |
| status `verified`, verdict PASS/PENDING-JUDGMENT, chưa `human_signoff` | chờ-Cổng-Bằng-chứng | — |
| status `signed-off` | đã-ký | — |
| frontmatter không parse được | cờ hỏng (broken[]) — vẫn hiện, không crash | — |

Mỗi slug đúng MỘT ô; ưu tiên tra từ artifact muộn nhất (evidence → contract
→ opportunity). `since` của ô chờ-cổng = timestamp frontmatter nếu có
(`approved_at`…), thiếu → mtime file — chỉ để XẾP thứ tự trong nhóm chờ ký,
không phải evidence.

### JSON scan (khuôn ổn định cho test + lệnh)

```json
{ "schema_version": 1,
  "config": true,
  "git": { "branch": "main", "dirty": false },
  "groups": { "gates": [ { "slug", "gate", "since", "tier" } ],
              "inProgress": [ { "slug", "status", "nextStep", "tier" } ],
              "done": [ { "slug", "state" } ] },
  "skipped": [ { "source": "PRODUCT-MAP.md", "reason": "chưa có — F-B" } ],
  "broken":  [ { "slug", "file", "reason" } ] }
```

Config vắng → `{ "config": false }` + exit 0; lệnh in một dòng gợi ý
`/acceptance-init` rồi dừng. Script tuyệt đối chỉ-đọc.
