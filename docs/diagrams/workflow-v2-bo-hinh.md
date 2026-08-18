# Bộ hình Workflow v2 toàn tuyến — để duyệt và lưu

*Chốt 2026-08-17 (owner gật bộ 4 hình + 1 bảng; rà lỗi logic cùng ngày — bỏ `route:`, chuyển mắt xích tự khai sang nhật-ký-vấp). Bộ này là **chiếu** của
[`docs/specs/workflow-v2-spec.md`](../specs/workflow-v2-spec.md) và
[`docs/lai-thu-nguoi-la.md`](../lai-thu-nguoi-la.md) cộng đề xuất hai mối nối
S0/S5 của feature-loop — chữ là nguồn, hình đi kèm; đổi thì sửa nguồn rồi vẽ
lại (DIAGRAM-RULE §2). Tầng 2, `docs/diagrams/`.*

## Bốn hình — đọc theo thứ tự 1 → 3 → 2 → 4

| # | Hình | Câu hỏi nó trả lời | Loại | Vai khi duyệt |
|---|---|---|---|---|
| 1 | [Toàn tuyến máy–người](workflow-v2-toan-tuyen.html) | Ai làm gì, người nhúng xuống ở đâu, đường A/B/C/E rẽ chỗ nào | Swimlane | Bối cảnh |
| 3 | [Vòng đời một việc](workflow-v2-vong-doi-mot-viec.html) | Việc đi qua trạng thái nào; máy suy mỗi bước chuyển từ dấu hiệu nào trong hồ sơ | State machine | **Quyết định · ĐỀ XUẤT** (chờ guard có trong mã) — hai guard rẽ khỏi «Đã giao» đều do một dấu hiệu (hồ sơ cơ hội) mà bộ đọc chung đã suy; hồ sơ chỉ nối feature-loop vào |
| 2 | [Chuỗi vật chứng](workflow-v2-chuoi-vat-chung.html) | Vật nào sinh ở đâu, ai viết, ai kiểm; ranh bên làm / bên kiểm | Evidence chain | **Quyết định · ĐỀ XUẤT** (chờ guard có trong mã) — hồ sơ thêm đúng một mắt xích (nhật-ký-vấp); ranh không dịch; chỗ yếu tự khai của mắt xích mới được gọi tên (số CHẶN ai viết) |
| 4 | [Kiến trúc bộ máy](workflow-v2-kien-truc-bo-may.html) | Kit đứng ở đâu so với Claude Code, repo tiêu thụ, forge/CI, công cụ ngoài, hai loại người | System context | Lưu trữ |

## Hai hình thêm — làn UI (owner yêu cầu 17/08: «UX/UI luôn là vấn đề phát sinh»)

Bốn hình trên vẽ làn UI thành một ô «bản bấm được». Spec lại có bảy lượt bổ
sung riêng cho làn này (02/08 ×4 · 04/08 · 06/08 ×3) — chỗ đổi nhiều nhất của
workflow, nên đáng hai hình riêng, không nhồi vào hình 1:

| # | Hình | Câu hỏi nó trả lời | Loại | Vai khi duyệt |
|---|---|---|---|---|
| 5 | [Bản mẫu bốn trục](workflow-v2-ban-mau-bon-truc.html) | «Ba loại bản mẫu» là gì, và ba lựa chọn nào luôn đi kèm nó: vật liệu · chỗ sống · nguồn luật token · lối cho mẫu hệ chưa có — mặc định là sợi cam, rời sợi cam thì phải khai và thẻ Cổng Phạm vi phải hiện | Morphological box | **Quyết định** — bản đồ tĩnh của mọi lựa chọn UI, một trang |
| 6 | [Làn UI trong vòng LÀM](workflow-v2-lan-ui.html) | Bốn lựa chọn ấy rơi vào bước nào; bản mẫu sinh ra ở đâu, được duyệt ở đâu (owner ngồi xem), chết ở đâu (khai tử có đo, bảng trạng thái thật lên làm bản-vẽ-chuẩn); máy siết gì sau cổng | Flowchart | Bối cảnh cho hình 5 |

Đọc 5 rồi 6. Hình 5 là chiếu của `skills/design-pass/SKILL.md` (Giai đoạn 0 ·
thang DS · thang vật liệu) + spec §2.2 mục «ba lối ra»; hình 6 là chiếu của
spec §2.2 S1-D + một-nguồn-sự-thật + tầng dùng chung + ratchet.

Mỗi hình có 3–5 dòng «cách đọc» và colophon dưới chân. Cổng Kế hoạch (chỉ T3)
lược khỏi hình 1 để giữ 9 ô. Không vẽ *cadence* (nhịp KHAI→LÀM→ĐO→QUYẾT lồng
bốn cỡ) — hiến pháp, không giúp phê duyệt hồ sơ này; thêm sau nếu kho cần bản
«tại sao».

## Bảng — skill & công cụ theo bước

Bước xếp theo tuyến. Cột cuối đánh dấu **✚** ở chỗ hồ sơ «hai mối nối + tích
hợp lái-thử» chạm vào; hàng không dấu là hiện trạng, không đổi.

| Bước | Việc | Skill / lệnh / công cụ | Nguồn | Khi nào | Hồ sơ này |
|---|---|---|---|---|---|
| Vào phiên | quét hồ sơ xưởng, thẻ 3 nhóm, bàn giao đúng lối | `/start` (đường A do bộ đọc chung suy: hồ sơ cơ hội build/iterate) | acceptance-gate | mỗi phiên | |
| HIỂU · grill | khai thác ý định, bốn câu thực tế, viết hồ sơ cơ hội | ổ cắm `discovery.brainstorm_skill` → skill repo khai; vắng → grill của kit theo `opportunity-template.md` | repo tiêu thụ / acceptance-gate | đường A | |
| HIỂU · red-team · phép thử rẻ | bảng giả định, thử ẩn số không-cần-dựng | phiên tách (nghi thức, chưa skill riêng) | — | đường A | |
| Cổng Đáng | build / iterate / park / kill + khai ngưỡng nghiệm thu | người ghi `decision` vào `opportunity.md` (không lệnh) | — | người | |
| S0 | hạng T1/T2/T3, slug, worktree riêng, guard trùng slug | feature-loop S0 · `superpowers:using-git-worktrees` | feature-loop / superpowers | mọi vòng | ✚ quét hồ sơ cơ hội build chưa có hợp đồng → dùng slug đó, đọc làm input thứ nhất |
| S1 | brainstorm-làm-thế-nào · quét độ phủ · 3 vật cùng lúc · phản biện context sạch | `superpowers:brainstorming` · `morphological-scan` · khuôn hợp đồng/evals · subagent tươi (gap-probe) · `claim-scan.mjs` | superpowers / acceptance-gate / feature-loop | T2/T3 | ✚ hợp đồng có dòng trỏ ngưỡng (A); không thêm trường |
| S1-D | bản bấm được trước Cổng Phạm vi | `design-pass` (+ `ux-ui-craft` khi dựng UI · skill chuẩn repo qua `feature_loop.ui_standards_skill`) | acceptance-gate | chạm UI | |
| Cổng Phạm vi | thẻ + duyệt, hoặc V mở (T2) | `/acceptance-card` · `/approve` | acceptance-gate | người / veto | ✚ thẻ render ngưỡng nguyên văn (A) / câu «không phiên nghiệm thu» (B/C/E) từ có-không hồ sơ cơ hội |
| S2 | kế hoạch task có verify-cmd | `superpowers:writing-plans` | superpowers | T2/T3 | |
| Cổng Kế hoạch | duyệt plan | trình plan | — | chỉ T3 | |
| S3 | code tuần tự / fan-out · lái tay toàn tuyến | main loop · Workflow `execute-parallel.js` · `superpowers:test-driven-development` | feature-loop / superpowers | mọi vòng | |
| S4 | một Workflow run/round: evals máy · hội đồng judge · review · baseline | Workflow `acceptance-verify.js` (agent tươi) | feature-loop | ≤3 round | |
| Cổng Bằng chứng | thẻ + ký; xanh-sạch thì đi tiếp không ký | `/acceptance-card` · `/signoff` | acceptance-gate | người khi cần | |
| S5 | PR theo nghi thức repo; lưới trước-merge độc lập | `superpowers:finishing-a-development-branch` · `pre-merge-check.sh` (CI) · `product-map.mjs` (vẽ lại bản đồ, gọi từ lệnh cổng) | superpowers / acceptance-gate | mọi vòng | ✚ đường A (bộ đọc chung nói): in dòng bàn giao «lái-thử → phiên nghiệm thu» |
| Lái-thử Người-lạ | phiên trắng lái sản phẩm thật, nhật-ký-vấp | đề bài docs + Playwright MCP / Chrome DevTools MCP / cầu nối `mcp-drive.mjs` · deny-rules · `vlm-assert.mjs` (scaffold từ `/acceptance-init`) | docs / công cụ ngoài | đường A, bề mặt mới | ✚ khuôn `stranger-drive.md` có mặt máy, dời vào `skills/acceptance/references/` |
| Phiên nghiệm thu · Cổng Giá trị | chấm kín, so ngưỡng, người ký verdict | `uat-session` | acceptance-gate | đường A | ✚ §0 đọc dòng tổng kết do phiên trắng viết: có + 0 CHẶN → «bấm được» bằng bằng chứng; vắng → cờ vàng; CHẶN → dừng, mở việc sửa |
| Trình cho người | hình tầng 2 tại cổng | `diagram-design` | diagram-design | khi trình cổng | |
| Báo cáo | trạng thái, báo cáo, bản đồ | `/acceptance-status` · `/acceptance-report` | acceptance-gate | khi cần | |

## Tham chiếu

- Spec hợp nhất: [`docs/specs/workflow-v2-spec.md`](../specs/workflow-v2-spec.md)
- Lái-thử Người-lạ: [`docs/lai-thu-nguoi-la.md`](../lai-thu-nguoi-la.md) + 3 hình `lai-thu-nguoi-la-*.html` cùng thư mục
- Luật hình: [`docs/reference/DIAGRAM-RULE.md`](../reference/DIAGRAM-RULE.md)
