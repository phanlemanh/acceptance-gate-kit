# Bản đồ sản phẩm

> Máy sinh từ hồ sơ trong `_acceptance/` và `.out-of-scope/` — đừng sửa tay.
> Bản đồ được làm mới ở mỗi lần một người ký một cổng.

## Vòng đang mở — đang dựng và nghiệm thu máy

- **product-map-uat-session** — PRODUCT-MAP + phiên nghiệm thu — bộ sinh bản đồ sản phẩm từ hồ sơ xưởng, nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới

## Đã ship

- **claim-scan-parser-hardening** — đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (5 lỗ: section-EOF, id sai khuôn, id trùng xuyên-feature, frontmatter không đọc được, nội dung rỗng)
- **cross-feature-claim-index** — gap-probe S1 đọc bài học lớp-lỗi từ các feature trước qua claim-scan.mjs (index dẫn xuất, không persist)
- **design-pass-skill** — skill mới `design-pass`: nghi thức thiết kế in-harness cho bước S1-D (phiên chuyên trách thẩm mỹ+UX trên proto C2 trong Browser pane, owner phản ứng bằng lời; thay vai ceremony design-mockup đã khai tử)
- **findings-section-boundary** — luật ranh giới section PER-SECTION đặt một chỗ có marker trong lib/md-section.js; gate-card + evidence-page hết bản sao, claim-scan ghim bằng round-trip
- **gap-probe-presence-hook** — Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time)
- **gate-card-ac-visibility** — Card Cổng 1 phải hiện ĐỦ criterion contract khai — hoặc kêu to khi không đọc được
- **hinh-theo-mat-phang** — Hình chọn theo mặt phẳng, không theo định dạng — vá luật N5
- **ngon-ngu-mat-nguoi** — Luật ngôn ngữ mặt người — cưỡng chế bằng file tham chiếu + khuôn trình bày
- **pha3-goi-luoi** — Pha 3 — gói lưới 5 món cho discovery + feature-loop (template opportunity + platform-fit gap-probe + nạp DS skill + Gate 1 tự in /goal + wire S1-D design-pass)
- **premerge-rules-ledger** — Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định
- **premerge-unjudged-pass** — Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình)
- **s4-scope-triage** — Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng
- **start-command** — Lệnh /start — nghi thức vào phiên, quét workspace trình thẻ 3 nhóm rồi bàn giao
- **t1-escape-event-scope** — Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version)

## Ngoài phạm vi đã ký

- **Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI** (`.out-of-scope/gap-probe-write-time-hook.md`)
- **Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI** (`.out-of-scope/t1-skip-globs-github-and-manifests.md`)
