---
schema_version: 1
feature: Phát hành kit 2.3.0 — đóng số cho bảy hồ sơ đã ký 18–22/08 (hồ sơ chưa arm cổng · hết giờ ≠ trượt · tool-kill một nguồn · làn V không phải chờ ký · repo khai plugin · vào có ô ra có tên · đường đo) để repo tiêu thụ nhận engine mới theo mốc có chủ đích
slug: release-2-3-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-22T02:31:44Z
---

# Acceptance Contract: release-2-3-0

## Context

Repo tiêu thụ đang chạy plugin **2.2.0** (18/08). Kể từ đó bảy hồ sơ đã ký và gộp, bề mặt
engine đổi 18 file (+622/−87) mà **không đổi schema, không cần migrate**:

- `status-chua-arm-cong` (#66) — hồ sơ có bằng chứng mà status chưa arm cổng không còn tàng hình.
- `het-gio-khong-phai-truot` (#67) · `tool-kill-duong-doc-lap` (#68) — verifier bị công cụ giết ≠ trượt; luật một nguồn `references/tool-kill-rule.md`.
- `lan-v-khong-phai-cho-ky` (#80) — bộ quét vào phiên hỏi đúng câu lưới hỏi (`scripts/khong-can-nguoi.mjs`): hồ sơ làn V sạch = «đã giao, cửa veto mở», không phải «chờ ký».
- `repo-khai-plugin` (#81) — init ghi `.claude/settings.json` cấp repo (`scripts/plugin-declare.mjs`); GUIDE §5.1 một khối: máy đầu 1+1 lệnh, máy sau 1 lệnh.
- `vao-co-o-ra-co-ten` (#82) — `/start` tách «đang cân nhắc» khỏi «chờ Cổng Đáng»; nghi thức kết thúc khai thác `START-HIEU-KET`; `groups.considering[]`.
- `duong-do-trong-dinh-nghia-xong` (#83) — section `## Đường đo` trong khuôn contract; cờ vàng/info trên thẻ Cổng Phạm vi; cross-check gap-probe; term CONTEXT.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số và nói cho người dùng biết họ nhận gì
(mục `v2.3.0` trong mô tả hai plugin) kèm ba điều phải nói thật: lời hứa «máy sau chỉ cần
marketplace add» chưa quan sát thực địa; tuổi ý tính từ ngày có ô; đường đo chỉ cờ, không chặn.

Source input: `git log aa130478..b446d8ca` (18 PR #66–#83) · nếp phát hành `_acceptance/release-2-2-0/` · rà soát trước khi cắt số 22/08 (owner gật «Cắt 2.3.0, mở hồ sơ phát hành»).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.3.0`), `diagram-design` hợp semver (giữ `2.5.0`, không đổi kể từ 2.2.0).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH (ca vĩnh viễn P200 và ba bộ ca PD/VC/DD của ba hồ sơ trong mốc chạy bên trong suite plugins) và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.3.0` và mục `v2.3.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.3.0` — đo trên đoạn cắt từ `v2.3.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* năm vế người dùng nhận gì + ba điều nói thật đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0/2-2-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: hai mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (làn V mở | bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới (entry d-20260822T020100Z-4402).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (entry d-20260822T020300Z-4404).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — kể cả ba mục TRỪ đã nêu ở rà soát (cờ đỏ baseline vô nghĩa · cờ «ngưỡng/biên» dò bằng dấu · chín điểm ngoài hợp đồng của B + C): việc của hồ sơ kế (chip D).
- Nâng số `diagram-design` — không đổi kể từ 2.2.0.
- Ghim lại 53 hồ sơ đã ký đang hoá cũ — chính sách §7.1: mốc phát hành không dựng răng, không ghim hàng loạt; hồ sơ bị chặn thật giữa hai mốc thì ghim riêng làn đó.
- Giải cổng Giá trị đang treo của `duong-do-trong-dinh-nghia-xong` — lỗ luật «vòng kit tự-dùng không có chặng bàn giao», chờ hạt giống.
- Cài bản mới lên repo tiêu thụ và kiểm tay máy thứ hai (nợ E10 của repo-khai-plugin) — việc sau khi mốc này merge.
