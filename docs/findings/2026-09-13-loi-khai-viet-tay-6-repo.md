# P0 — Lời khai viết tay cho 6 repo, 13/09/2026

> Phép thử giả định #1 của ô `nha-tai-lieu-router`: *một khối ba cột đủ khai
> «lớp vật × vòng đời → một nhà» cho mọi hình dạng đang sống, không cần trường
> thứ tư*. Viết tay, **trước** khi có một dòng code. Mọi đường dẫn dưới đây đã
> `ls` trên đĩa 13/09 — không có đường nào theo trí nhớ. Khối chỉ nằm ở đây;
> không dán vào repo nào.

Khuôn dùng chung (theo khung §2): header `phiên-bản · quét`, ba cột
`lớp-vật | vòng-đời | nhà`; nhiều đường trên **một dòng** = một nhà lô-gic; nhiều
**dòng** cho cùng cặp = K1 đỏ. Engine chỉ bind ba cặp: `(đặc-tả, theo-vòng)` ·
`(kế-hoạch, theo-vòng)` · `(ý-định, thường-trú)`; hàng khác chỉ chịu K1/K2.
Dòng đánh dấu `← K1` là **cố ý khai để phép kiểm phải đỏ** — không phải lỗi gõ.

## 1. acceptance-gate-kit (kho kit)

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
đặc-tả         | theo-vòng  | docs/specs/                                   ← K1: 12 design doc ≤ 04/08, trôi quy ước
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
kế-hoạch       | theo-vòng  | docs/plans/                                   ← K1: 16 plan cũ trộn vào nhà hạt giống
ý-định         | thường-trú | docs/plans/                                   ← 27 hạt giống *-hat-giong-*.md
quyết-định     | thường-trú | docs/adr/
phát-hiện      | thường-trú | docs/findings/ · docs/research/
bàn-giao       | thường-trú | docs/handoff/
luật-máy       | thường-trú | CLAUDE.md · CONTEXT.md · skills/ · commands/
tài-liệu-người | thường-trú | README.md · GUIDE.md · QUICKSTART.md · docs/reference/
```
K2 sẽ nêu: `docs/lai-thu-nguoi-la.md` · `docs/tools/` (1) · `docs/diagrams/` (10) · `docs/specs/workflow-v2-spec.md` được viện dẫn từ `human-facing-language.md:3` — dời phải sửa dòng trỏ.

## 2. OneFlow

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
ý-định         | thường-trú | docs/roadmap.md#plan-freeze · docs/strategy/vision.md
sổ-cái         | thường-trú | docs/roadmap.md#roadmap-ledger
trạng-thái     | thường-trú | STATUS.md
quyết-định     | thường-trú | docs/adr/
chiến-lược     | thường-trú | docs/strategy/
đo-lường       | thường-trú | docs/measure/
luật-máy       | thường-trú | CLAUDE.md · AGENTS.md · .claude/
tài-liệu-người | thường-trú | README.md · docs/feature-index.md · docs/reference/ · docs/plugins.md
```
K2 sẽ nêu: `docs/README_JA.md` · `docs/README_ZH.md` · `docs/spec/prd/` · `docs/assets/`. Hai hàng có `#fragment` — marker của repo (`<!-- x:start -->`), engine không đọc nội dung ở P1/P2.

## 3. artifact-platform

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
ý-định         | thường-trú | docs/spec/OneHub-Roadmap.md · docs/spec/OneHub-Product-Intent-and-Goals.md · docs/proposals/
trạng-thái     | thường-trú | STATUS.md
đặc-tả         | thường-trú | docs/spec/
thiết-kế-nền   | thường-trú | docs/reference/DESIGN-SYSTEM.md · docs/reference/DESIGN-WORKFLOW.md · docs/spec/design/ · docs/spec/ux-architecture/
từ-điển        | thường-trú | docs/spec/GLOSSARY.md
luật-máy       | thường-trú | CLAUDE.md · AGENTS.md · .claude/skills/ · .claude/skills-retired/
tài-liệu-người | thường-trú | README.md · docs/DEVELOPER-GUIDE.md · docs/reference/
lưu-trữ        | thường-trú | docs/archive/
```
Phần người của `docs/MAP.md` đang có (5 tầng + luật phân xử) giữ nguyên; khối này dán thêm. K2 sẽ nêu: `docs/reviews/` · `docs/research/` · `docs/spec/prd/` `facs-vn/` `prompts/` `social-video/` (nằm trong `docs/spec/` → đã có nhà, không nêu).

## 4. media-library

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
ý-định         | thường-trú | docs/seed/
kế-hoạch       | thường-trú | docs/plans/
trạng-thái     | thường-trú | STATUS.md
thiết-kế-nền   | thường-trú | docs/reference/design-system.md
vận-hành       | thường-trú | docs/runbooks/
luật-máy       | thường-trú | CLAUDE.md · CONTEXT.md
tài-liệu-người | thường-trú | README.md · docs/reference/
lưu-trữ        | thường-trú | docs/archive/
```
Sạch: K1 0, K2 0. `docs/seed/` có `.tsv` và một thư mục con — K2 chỉ quét `.md`, nên không nêu.

## 5. crm-onehub

```
phiên-bản: 1 · quét: docs/ · *.md · adrs/
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
kế-hoạch       | theo-vòng  | docs/plan/                                    ← K1: 8 plan cũ ở nhà thứ hai
ý-định         | thường-trú | docs/crm-plan.md
ý-định         | thường-trú | docs/plan/crm-plan.md                         ← K1: cùng tên, 555 ≠ 1368 dòng
ý-định         | thường-trú | docs/list-building-roadmap.md                 ← K1: nhà thứ ba
thiết-kế-nền   | thường-trú | docs/design.md
quyết-định     | thường-trú | adrs/
luật-máy       | thường-trú | CLAUDE.md · AGENTS.md · CONTEXT.md · .claude/ · .agents/skills/
báo-cáo        | thường-trú | docs/reports/
tài-liệu-người | thường-trú | README.md · docs/guides/ · docs/reference/ · docs/setup.md · docs/environment.md
```
**Owner chọn cho hàng ý-định:** `____________` *(để trống có chủ ý — phép kiểm làm lộ, không quyết thay).*
K2 sẽ nêu 8 file phẳng còn lại ở gốc `docs/`: `agent-panel.md` · `agent.md` · `api.md` · `chat-ui.md` · `connections.md` · `currency.md` · `telemetry.md` · `tracking.md` — đúng danh sách repo phải xếp.

## 6. floorplanstudio

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
phát-hiện      | thường-trú | docs/findings/ · docs/research/
bàn-giao       | thường-trú | docs/handoff/
luật-máy       | thường-trú | CLAUDE.md · CONTEXT.md · engines/digitize/.claude/
tài-liệu-người | thường-trú | README.md · docs/reference/
lưu-trữ        | thường-trú | docs/archive/
```
Không có hàng `(ý-định, thường-trú)` — **hợp lệ**: engine fallback, thẻ start không cờ. Soi gương kit nên tên lớp giống kit.

## 7. mapposter

```
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
phát-hiện      | thường-trú | docs/research/
tài-liệu-người | thường-trú | README.md
```
Bốn dòng. Không `CLAUDE.md` nên không có hàng `luật-máy` — khối làm sự vắng mặt **nhìn thấy được**, K2 không có gì để nêu.

---

## Kết quả phép thử — SỐNG

| Số đo | Giá trị |
|---|---|
| Repo khai được bằng ba cột, không cần trường mới | **7/7** (6 repo tiêu thụ + kit) |
| Hàng engine bind mỗi repo | 3 (kit · OneFlow · artifact-platform · media-library · crm) · 2 (floorplanstudio · mapposter — vắng ý-định thường-trú, fallback) |
| K1 đỏ có chủ ý | kit **2** cặp · crm **2** cặp (ý-định ×3 dòng, kế-hoạch ×2 dòng) |
| K2 vàng | kit 4 · OneFlow 4 · artifact-platform 2 · media-library 0 · crm 8 · floorplanstudio 0 · mapposter 0 |
| Tên lớp ngoài ba khoá engine | 12 tên khác nhau trên 7 repo (`sổ-cái`, `trạng-thái`, `chiến-lược`, `đo-lường`, `thiết-kế-nền`, `từ-điển`, `phát-hiện`, `bàn-giao`, `vận-hành`, `báo-cáo`, `lưu-trữ`, `quyết-định`) |

Giả định #1 **đứng**. Tập lớp phải **mở** — 12 tên tự mọc, không tập đóng nào chứa hết mà không ép repo đổi từ.

## Năm phát hiện đưa ngược vào spec

1. **K1 có điểm mù có tên: hai FILE cùng vai trên MỘT dòng.** `CLAUDE.md · AGENTS.md`
   ở artifact-platform và crm-onehub là hai bản khác nội dung — khai chung một
   dòng là hợp lệ theo K1, và K1 **không thể** phân xử nội dung. Không thêm K3
   (thành thước-của-thước). Lối đúng là của repo: OneFlow đã làm bằng một câu
   trong `AGENTS.md` — *«CLAUDE.md is the single source of truth… this file only
   adds notes»*. Spec ghi thành **giới hạn có tên** + khuôn template gợi ý câu đó.
2. **Vật chặng 6 xuyên slug không có nhà** — 11 file lái-thử ở gốc `_acceptance/`
   của mapposter nằm trong `FIXED_HOMES` nên K2 không nhìn thấy, mà cũng không
   thuộc slug nào. Ngoài router; ghi sang hạt giống lát C / khuôn `uat-session`.
3. **Dời file phải kéo dòng trỏ** — `docs/specs/workflow-v2-spec.md` được
   `skills/acceptance/references/human-facing-language.md:3` viện dẫn. Dọn nhà kit
   (nhóm C của kế hoạch) là T1 nhưng không phải «mv rồi xong».
4. **Header `quét:` là bắt buộc để K2 có nghĩa** — `adrs/` ở gốc crm chỉ được
   nhìn thấy nhờ nó. Không có header thì mặc định `docs/ · *.md`, và spec phải nói
   rõ mặc định đó.
5. **`#fragment` chỉ là con trỏ ở P1/P2** — hai hàng OneFlow trỏ khối marker kiểu
   `<!-- x:start -->`. Router giao đường; ai đọc khối là P3. Ghi để P1 không lỡ
   tay parse.

## Trạng thái

Viết 13/09, không chạm engine, không commit vào repo tiêu thụ. Là input cho
Cổng Phạm vi của vòng P1+P2 (kế hoạch
[`2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md`](../plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md)).
