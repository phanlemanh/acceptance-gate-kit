---
schema_version: 1
feature: Lệnh in ra phải bấm được — một nguồn tên lệnh (bảng COMMAND-NAMES, bảng ⊆ vật thật, điểm bàn giao ⊆ bảng) + TRỪ ba cờ nhiễu trên thẻ + bốn sửa đúng từ finding B/C
slug: lenh-in-ra-phai-bam-duoc
owner: phanlemanh@gmail.com
risk_tier: T2               # human-facing-language + commands + 3 SKILL + gate-card.js + CONTEXT + tests — không chạm lib/**, hook, lưới
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: lenh-in-ra-phai-bam-duoc

## Context

Harness chỉ bảo đảm dạng `/<plugin>:<tên>`; kit in 48 điểm bàn giao dạng trần và 7 chỗ `uat-session <slug>` không
phải lệnh — owner gõ lại tay. Cộng ba cờ nhiễu thường trực trên thẻ (đỏ «n-a baseline» cho lựa chọn chủ ý; cờ
«ngưỡng/biên» dò bằng dấu; info `--glossary-base` nói với agent) và bốn sửa đúng còn lại từ finding chip B/C.
Hồ sơ cơ hội đã qua red-team D2: cắt việc đổi ~170 literal thước cũ; năm mục CỘNG tách hồ sơ riêng.

Source input: `_acceptance/lenh-in-ra-phai-bam-duoc/opportunity.md` (build 22/08) · `docs/plans/2026-08-22-hat-giong-lenh-in-ra-phai-bam-duoc.md`. Thiết kế: `docs/superpowers/specs/2026-08-22-lenh-in-ra-phai-bam-duoc-design.md`.

## Criteria

- AC-1: Given bản luật ngôn ngữ mặt người sau hồ sơ, When đọc khối marker `COMMAND-NAMES`, Then mỗi dòng loại `command`/`skill` có tiền tố **bằng** `name` đọc từ `plugin.json` của plugin tương ứng (lúc chạy, không hằng) và vật tồn tại (`commands/<tên>.md` hoặc `skills/<tên>/SKILL.md` trong plugin đó); dòng loại `harness` chỉ được mang tên trong danh sách ngoại lệ khai tường minh (`goal`); bản sao bảng thêm dòng `/acceptance-gate:foo` → đỏ nêu dòng; bản sao `plugin.json` đổi `name` → đỏ nêu tiền tố lệch; bản sao thêm dòng harness `bar` → đỏ «ngoài danh sách ngoại lệ».
- AC-2: Given danh sách file khai tường minh — 7 file `commands/*.md`, `skills/acceptance/SKILL.md`, `skills/acceptance/references/human-facing-language.md`, `skills/uat-session/SKILL.md`, `feature-loop/skills/feature-loop/SKILL.md`, `scripts/gate-card.js`, `scripts/evidence-page.js` — When quét, Then **0** token `/<tên trần>` (`start` `approve` `signoff` `acceptance-card` `acceptance-init` `acceptance-status` `acceptance-report` `feature-loop`) thiếu tiền tố và **0** chỗ `uat-session` thiếu `/acceptance-gate:` ngoài cột một của bảng; mọi lệnh in ra nằm trong cột «lệnh bấm được»; phép đo assert đủ 12 file có mặt; bản sao chèn `` `/start` `` vào `commands/start.md` → đỏ nêu `file:dòng`; bản sao chèn `uat-session <slug>` → đỏ nêu `file:dòng`. Baseline trước hồ sơ: 48 + 7.
- AC-3: Given bản luật ngôn ngữ mặt người, When đọc, Then có **đúng một** câu luật nêu «khi nêu lệnh cho người, dùng đúng cột lệnh-bấm-được của bảng `COMMAND-NAMES`» (CỘNG duy nhất, khai ở hồ sơ cơ hội H1); bản sao gỡ câu → đỏ.
- AC-4: Given thẻ Cổng Bằng chứng với section `## Analyst` là `n-a` **kèm lý do** (≥ 20 ký tự sau `n-a`), When render, Then **không** có cờ đỏ về baseline; Analyst rỗng hoặc vắng section → cờ như trước (R−); fixture code-sinh cả hai chiều.
- AC-5: Given thẻ Cổng Phạm vi, When render, Then **không còn** cờ «có ngưỡng/biên nhưng chưa có ca dưới ngưỡng» (fixture contract có AC chứa `≥ 13`) và **không còn** cờ info `--glossary-base`; và trên cây thật, render ba hồ sơ `repo-khai-plugin` · `vao-co-o-ra-co-ten` · `duong-do-trong-dinh-nghia-xong` bằng `gate-card.js` **cũ** (đọc từ `git show origin/main:scripts/gate-card.js`) và **mới** → số cờ (`fred`+`fwarn`+`finfo`) mới **<** cũ ở cả ba (quan hệ, không hằng).
- AC-6: Given contract có section Đường đo với dòng `- Bỏ đường đo — lý do (entry d-1)` (không gạch nối, viết hoa), When render, Then dòng đó là **dòng bỏ** (không vào `lines`), không entry → cờ vàng, có entry đúng tiền tố → cờ info; ca DD của chip C cập nhật theo (đổi thước có hợp đồng, khai ở sổ).
- AC-7: Given `CONTEXT.md` và `skills/uat-session/SKILL.md` sau hồ sơ, When đọc, Then dòng `_Avoid_` của term «Đường đo» **không** chứa «metric» (giữ «tracking», «analytics»), và uat-session không còn câu «Số lấy từ tracking» (thay bằng «đường đo đã khai»); ca DD7 cập nhật (đổi thước có hợp đồng, khai ở sổ).
- AC-8: Given `commands/start.md` và stub `_acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md`, When đọc, Then khối `START-HIEU-KET` nằm **sau** dòng «**Bắt đầu việc mới**» và **trước** «(a) ý còn mơ hồ» (VC6 vẫn xanh), và stub có một dòng ghi chú `decided_at` là mốc xấp xỉ theo hội thoại 21/08.

## Coverage

- Bỏ coverage-scan — không gian AC là ma trận §4 của hạt giống sau red-team (R+ · R− · RK · R0) + ba mục TRỪ + bốn sửa đúng; mỗi mục một AC (entry d-20260822T150000Z-4502).

## Đường đo

- Thước: 0 lần owner gõ lại tay vì dạng kit in (ván lái-thử kế ở `artifact-platform`) · số từ: owner tự đếm trong ván · bảo đảm bởi: AC-2 (48/48 + uat-session 0) và AC-3 (câu Claude tự sinh).
- Thước: số cờ trên thẻ giảm · số từ: render cũ/mới trên cây thật · bảo đảm bởi: AC-5.

## Out of scope

- Không đổi tên, không thêm, không alias lệnh; `/goal` giữ (lệnh harness, ngoại lệ khai tường minh).
- Không đổi ~170 literal của thước cũ (red-team giả định 5).
- Không quét `docs/**` (sử liệu); mặt phẳng không cài plugin.
- Năm mục CỘNG B1 B2 B4 C4 C2 — hồ sơ riêng; hai hạt giống rà soát 22/08 — hồ sơ riêng.
- `lib/**`, hook, lưới trước-merge (T2).
