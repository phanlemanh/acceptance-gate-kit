> ⚠️ **[SUPERSEDED 30/07/2026 → `workflow-v2-spec.md`]** — file này là trầm tích lịch sử, giữ làm sử liệu. Session mới: đọc `workflow-v2-spec.md`, KHÔNG đọc file này.

# Workflow v2 — bản đồ hoàn chỉnh: bước · output · skill (DRAFT, xương của spec v2)

*2026-07-30 · Tổng hợp sau V1 + 2 retro + 3 pivot (đo-tại-UAT · một-mặt-phẳng ·
S1-D visual-first). Ký hiệu: ✅ có sẵn đang chạy · ⚙️ có nhưng phải sửa ·
➕ đề xuất xây (kèm hạng mục). Nguyên tắc nền: một mặt phẳng làm việc (mọi vòng
lặp trong Claude Code trên artifact thật) · phễu-mới-phải-có-lưới · mọi phép đo
có đường tự-phản-nghiệm · hợp đồng chỉ bảo vệ thứ nó có ghi.*

## Tầng 0 — NỀN (1 lần / repo)

| Bước | Output | Skill/tool | TT |
|---|---|---|---|
| Dựng cổng | `_acceptance/config.yaml` | `/acceptance-init` | ✅ |
| Wire CI | pre-merge check trong pipeline | script kit | ✅ |
| Chuẩn nội bộ repo | skill khuôn-plugin + DS police (per-repo) | vd `create-onehub-plugin`, `validate_tokens` | ✅ per-repo |
| Handbook đội | quy định người (4 cổng, prototype, brainstorm routing) | repo team-handbook | ⚙️ scaffold |

## Giai đoạn 1 — KHÁM PHÁ (rẻ → đắt, giết sớm)

| Bước | Output | Skill | TT |
|---|---|---|---|
| **D1a** làm rõ | 2-3 hướng + riskiest assumption | `product-management:brainstorm` | ✅ |
| **D1b** đúc khuôn | `_acceptance/<slug>/opportunity.md` — gồm trường **"Nguồn ngoài & phạm vi kế thừa"** (lưới 1) | `opportunity-template.md` trong references | ✅ **1.27.0** (P82/83) — nợ spec v2: luật kiểm-kê-inventory-first (chống thiếu-kế-thừa kiểu E03-trục-không-gian) |
| **D2** red-team | bảng giả định re-rank + phép thử rẻ nhất, lưu `evidence/discovery/` | `strategy-red-team` (vendor → discovery-pack) | ✅ / ➕ F-C wrapper |
| **D2.5** phép-thử-rẻ | trả lời mọi ẩn số KHÔNG cần dựng (đọc schema, hỏi trực tiếp…), ghi `evidence/discovery/*-probe.md` | quy ước trong skill discovery | ➕ spec v2 |
| **D3** prototype | HỘI TỤ Ý ĐỊNH (không đo lường) — bấm được, timebox | `interactive-prototype`/C2 (repo) | ✅ |
| **CỔNG 0** (người #1) | `decision` + `disposition` (keep→bảng nợ + 3 guard) + **khai ngưỡng UAT tại đây** | `/acceptance-card` mode Cổng 0 | ➕ F-B (nay: điền tay) |

## Giai đoạn 2 — GIAO HÀNG (feature-loop)

| Bước | Output | Skill | TT |
|---|---|---|---|
| **S0** intake | tier + worktree riêng (mặc định T2/T3) + đọc opportunity | feature-loop | ✅ + ➕ F-A/spec v2 |
| **S1** design | design doc + contract + evals; **bắt nạp skill chuẩn-plugin repo khi chạm UI** (`feature_loop.ui_standards_skill`, P86); gap-probe + **câu platform-fit cả 2 harness** (P84) | `superpowers:brainstorming` · `morphological-scan` · gap-probe | ✅ **1.19.0** |
| **S1-D** visual (UI feature, BẮT BUỘC) | C2 proto + design-pass (owner ngồi xem Browser pane) + capture ma trận state có khai `material:` | skill **`design-pass`** — ĐÃ XÂY 30/07 (acceptance-gate 1.26.0, vị trí A, S4 đang chạy): 5 giai đoạn, **thang vật liệu 3 bậc** (real-components mặc định / scaffold / static — hạ bậc phải để vết) + **thang DS** (skill repo → shadcn-vocabulary làm mặc định có tên khi repo 0 token); wire vào feature-loop S1 = việc của Pha 3 (descope có tên trong feature này) | ⚙️ chờ Gate 2 |
| **GATE 1** (người #2) | duyệt contract + evals + **bản bấm được** (S1-D wired P87); in mặc định gợi ý `/goal` (GOAL-TEMPLATE nhúng SKILL, drift-pin GUIDE — P85, sửa gốc bệnh B4) | `/acceptance-card` + `/approve` | ✅ **1.19.0** |
| **S2** plan (+Gate 1.5 T3) | plan 9-task style: files/verify/independent | `superpowers:writing-plans` | ✅ |
| **S3** execute | code + verify per-task; in 1 dòng routing; checkpoint giữa chuỗi dài | `executing-plans` / `execute-parallel.js` | ✅ + ➕ spec v2 |
| **S4** verify | evidence-report + run-log; **T3-hardening**: đối chiếu exit_code report↔run-log · hash ảnh per-state · cap round cứng (vượt = 1 phê chuẩn người) · verify-agent read-only | `acceptance-verify.js` (Workflow) | ✅ + ➕ spec v2 |
| **GATE 2** (người #3) | signoff HOẶC từ chối có hồ sơ; kênh phản-hồi-giữa-vòng đổ về `review-findings.md`; trạng thái `superseded` khi đóng không ký | `/acceptance-card` + `/signoff` | ✅ + ➕ spec v2 |

## Định tuyến theo loại feature (audit 30/07 — sửa thiên lệch UI của bản đầu)

**Nguyên tắc: UAT theo GIẢ ĐỊNH, không theo kích thước/UI.** Điều kiện máy-suy
từ artifact, không hỏi người: **A** value-bet (có opportunity + ngưỡng UAT) →
pipeline đầy đủ gồm phiên UAT; **B** UI-không-giả-định-mới (chạm UI, không
opportunity) → S1-D bật, ship thẳng sau Gate 2 (nghiệm thu trải nghiệm =
Gate 1 bản-bấm-được; đo sau ship qua tracking); **C** backend/kỹ thuật →
S1-D tắt, gap-probe đối chiếu invariant backend của repo, "UAT" = itest trong
evals + soak T3 sau ship; **D** T1 thoát S0. Chống-quên: đường B/C → contract
Notes tự ghi "không giả định giá trị mới — không phiên UAT" (Gate 2 thấy chữ);
có ngưỡng UAT mà ship thẳng → chặn. gap-probe P84 sửa đích thành "chuẩn sẵn có
của repo cho LỚP artifact này". (Thực hành đã đúng — design-pass/pha3 đi đường
C tự nhiên; sửa này đưa nó thành văn + máy-suy. → spec v2 + F-A args-prep.)

## Giai đoạn 3 — UAT (phép đo chính khi ĐƯỜNG A; giả thuyết PHẢI kiểm ở r2)

| Bước | Output | Skill | TT |
|---|---|---|---|
| **Phiên UAT** | sản phẩm THẬT sau flag; stakeholder/môi giới mời vào; **chấm kín trước thảo luận + commitment device**; đo bằng tracking thật; số so ngưỡng ĐÃ khai ở Cổng 0 | skill **`uat-session`** (mới): chuẩn bị flag/seed/form chấm kín → điều phối buổi → thu số → render so-ngưỡng | ➕ **chưa từng có — đề xuất mới** |
| **CỔNG UAT** (người #4) | release / iterate / **kill** (giết-tại-UAT = thành công quy trình) | `/acceptance-card` mode UAT | ➕ F-B mở rộng |

## Giai đoạn 4 — SAU SHIP (đóng vòng học)

| Bước | Output | Skill | TT |
|---|---|---|---|
| **Đối soát tài liệu sản phẩm (S5, quyết 30/07)** | PRD/Tech-Arch/GLOSSARY của repo mô tả HIỆN TRẠNG mới; chưa có PRD → seed từ contract+opportunity SAU ship (viết từ cái đang chạy). Workflow không SINH PRD (duyệt-trước = opportunity+contract); workflow NUÔI PRD. UX-of-record = bản bấm được đã duyệt + capture design-pass — KHÔNG viết UX spec văn xuôi song song (bài học G3/frames.css) | lens docs-drift trong review S4 + checklist S5 | ➕ spec v2 |
| Release comms | release notes (+stakeholder plan T3) | `release-notes` · `stakeholder-map` | ✅ (F-C vendor) |
| Đo lại thước đo | reminder tự tạo lúc ship → kết quả append opportunity | quy ước M1 + scheduled-tasks MCP | ➕ Đợt 3 |
| Retro per-feature | bài học từ journal + ledger + rounds + usage | `retro` | ✅ |
| Funnel chương trình + **PRODUCT-MAP (quyết 30/07)** | View SINH RA (không tài liệu tay — mirror tay đã chết đủ lần): quét frontmatter `_acceptance/**` + PRD → `PRODUCT-MAP.md` generated: bảng epic × lifecycle (link xuống artifact) + đồ thị mermaid từ cạnh frontmatter + funnel số + **roadmap = truy vấn trên park/lát-2/out-of-scope đã ký**. Cần 1 field additive `epic:` (+ `supersedes:`/`relates:` hình thức hoá; workspace cũ cờ-vàng). Graph = mô hình cạnh trong frontmatter + render, KHÔNG hạ tầng graph riêng (một-mặt-phẳng). Handbook: map là điểm vào duy nhất của đội. **Vận hành (quyết 30/07):** engine = `scripts/product-map.mjs` (generic, KHÔNG thuộc diện khoá invocation — tách khỏi lệnh người `/acceptance-report --map` vẫn khoá theo ADR 0002); ghi cạnh: `epic:` tại D1b (grill) → S1 chép sang contract, `supersedes:` tại Cổng 0; **regen tại mọi lần đóng cổng người** (Cổng 0/Gate 2/UAT/S5 — cùng khoảnh khắc đối soát PRD); chống drift bằng `--check` trong CI (pattern P30); ĐỌC tại bước chọn-feature (roadmap = truy vấn park/lát-2) | `/acceptance-report` mở rộng + `product-map.mjs` | ➕ F-B |

## Skill ĐỀ XUẤT MỚI (chưa tồn tại) — gom một chỗ

1. **`design-pass`** — ✅ ĐÃ XÂY 30/07 (1.26.0, chờ Gate 2). Quyết tại Gate 1: vị trí A `skills/design-pass/` trong acceptance-gate (loại design-loop tái sinh) → **tiền lệ: phần còn lại của F-D (proto-init/proto-lint, khai tử ceremony) nghiêng về acceptance-gate**; degrade per-shape hoãn kiểm đến r2 pilot (ledger descope có tên).
2. **`uat-session`** (mới, chưa có hạng mục — đề xuất gắn vào F-B hoặc riêng) — điều phối phiên UAT: setup flag/seed, form chấm kín, kịch bản 2 câu hỏi, thu số từ tracking, render bảng so-ngưỡng cho Cổng UAT. *Không có nó, triết lý đo-tại-UAT mãi là giả thuyết.*
3. **Discovery guide** (F-A) — S0 đọc opportunity + trình tự D1→D3 thành skill dẫn được người mới. **Ruột = ELICITATION (quyết 30/07):** D1 hai mode — brainstorm (diverge, cùng nghĩ) và **grill-mode (phỏng vấn rút tri thức ngầm)** trước khi đúc khuôn; bộ câu hỏi cấu trúc (phạm vi phủ định · biên nhận "build đúng mọi lời mà X thì có nhận không?" · trade-off ép chọn · kể-lần-gần-nhất · kiểm kê nguồn inventory-first · "điều gì hiển nhiên với anh mà tôi không biết?") — mỗi câu đổ THẲNG vào một mục opportunity-template, không transcript rời. Lý do: chuỗi BRD→PRD→SPEC sụp về MỘT mối hàn đầu-người→artifact; brainstorm không thay được elicitation (bằng chứng: E03 rơi 2 trụ tại một dấu ngoặc D1b). Kèm: handbook thêm bảng ánh xạ BRD/PRD/SPEC → artifact mới cho người mang từ vựng cũ.
4. **Card modes Cổng 0 + Cổng UAT** (F-B) — `/acceptance-card` nhận 2 cổng mới.
5. **`proto-init` + `proto-lint`** (F-D, theo spec C2) — wiring 1 lần + máy soi hex/webfont/DB-import, degrade cho repo không design-repo.

## Thứ tự xây (không đổi so plan): Pha 3 gói lưới 5 món → r2 pilot (dùng S1-D + uat-session bản tay) → spec v2 一 thể → F-A/F-B/F-C/F-D theo release.
