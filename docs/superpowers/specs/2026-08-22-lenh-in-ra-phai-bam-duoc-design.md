# Thiết kế — «Lệnh in ra phải bấm được» + bốn mục TRỪ (chip D)

**Đề bài:** `docs/plans/2026-08-22-hat-giong-lenh-in-ra-phai-bam-duoc.md` + hồ sơ cơ hội (build 22/08, sau red-team D2).
**Hạng:** T2 — chạm `skills/acceptance/references/human-facing-language.md`, `commands/*.md`, hai SKILL (acceptance,
feature-loop, uat-session), `scripts/gate-card.js`, `CONTEXT.md`, một stub cơ hội, tests. Không chạm `lib/**`, hook, lưới.

## Mục 1 — một nguồn tên lệnh

**Sự thật harness (Claude Code 2.1.233):** tên chính thức `/<plugin>:<tên>`; dạng trần chỉ chạy khi không ai dùng tên
đó. Kit in 48 điểm bàn giao dạng trần; 7 chỗ `uat-session <slug>` không phải lệnh.

**Lời giải:**
1. Bảng marker `COMMAND-NAMES` trong bản luật ngôn ngữ mặt người — ba cột *tên trần · lệnh bấm được · loại*
   (`command` | `skill` | `harness`). Đây là nguồn duy nhất; dạng trần chỉ được phép xuất hiện ở cột một của bảng.
2. **Hai quan hệ, không «hai chiều»:** (a) *bảng ⊆ vật thật* — mỗi dòng command/skill: tiền tố = `name` đọc từ
   `plugin.json` của plugin đó, và `commands/<tên>.md` hoặc `skills/<tên>/SKILL.md` tồn tại; dòng `harness` chỉ
   được là tên trong danh sách ngoại lệ khai tường minh (`goal`) — dòng harness lạ = đỏ (RED ngoài allowlist).
   (b) *điểm bàn giao ⊆ bảng* — trong danh sách file khai tường minh (7 file `commands/`, `skills/acceptance/SKILL.md`,
   `human-facing-language.md`, `skills/uat-session/SKILL.md`, `feature-loop/skills/feature-loop/SKILL.md`,
   `scripts/gate-card.js`, `scripts/evidence-page.js`) KHÔNG còn token `/<tên trần>` hay `uat-session <…>` thiếu tiền tố;
   mọi lệnh in ra phải bằng đúng cột «lệnh bấm được» của bảng.
3. 48 điểm đổi sang dạng bảng; `uat-session <slug>` → `/acceptance-gate:uat-session <slug>`;
   `/feature-loop <slug>` → `/feature-loop:feature-loop <slug>`; `/goal` giữ.
4. **H1 (CỘNG duy nhất, khai trước):** một câu luật trong bản luật ngôn ngữ mặt người — «khi nêu lệnh cho người,
   dùng đúng cột *lệnh bấm được* của bảng COMMAND-NAMES» — để câu Claude tự sinh cũng đúng dạng.
5. KHÔNG đổi ~170 literal của thước cũ (kiểm kê: 0 ca ghim đúng chuỗi bàn giao).

## Mục 2–3 — TRỪ nhiễu trên thẻ (gate-card.js)

- Analyst `n-a` **có lý do** (≥ 20 ký tự sau `n-a`) → không cờ đỏ; Analyst rỗng/vắng → cờ như cũ.
- Bỏ cờ «AC-n có ngưỡng/biên nhưng chưa có ca dưới ngưỡng» (dò bằng dấu ≥/số trong chữ — chưa từng bắt lỗi thật).
- Bỏ cờ info «repo có CONTEXT.md nhưng thẻ chưa được truyền --glossary-base» (nói với agent, không với người).
- Thước quan hệ: render ba thẻ thật A/B/C bằng gate-card CŨ (từ `origin/main`) và MỚI → số cờ mới < cũ ở cả ba.

## Mục 4 — finding B/C giữ lại (TRỪ / sửa đúng)

- C1: dòng bỏ nhận diện bằng `/^bỏ\s+đường[-\s]đo\b/i` (lệch gạch nối vẫn là dòng bỏ).
- C3: `_Avoid_` của term «Đường đo» bỏ «metric»; câu «Số lấy từ tracking» trong uat-session → «đường đo đã khai».
- B3: stub `duong-do` ghi chú `decided_at` là mốc xấp xỉ theo hội thoại (một dòng, không hỏi).
- B5: khối `START-HIEU-KET` dời vào đầu bullet «Bắt đầu việc mới», trước «(a)» — vẫn thoả VC6.
- Năm mục CỘNG (B1 B2 B4 C4 C2) — hồ sơ riêng; không vào.

## Phép đo — `tests/plugins/lenh-bam-duoc.test.mjs` (LB1–LB8, chốt `PASS: [LBn]`)

Bảng rút từ marker; vật thật đọc từ thư mục + `plugin.json` lúc chạy; quét bằng regex có ranh giới; chiều đỏ trên
bản sao (thêm dòng bảng lạ · đổi `name` plugin.json · chèn `/start` trần · chèn `uat-session <slug>` · gỡ câu H1);
thẻ đo bằng fixture code-sinh + so cũ/mới trên cây thật.
