# Trục ngữ cảnh cho bản mẫu — thị giác gần thật nhất, generic mọi repo — Design

> **Trạng thái: thiết kế đã duyệt hướng (Manh, chat maintainer 04/08), chờ thi
> công qua feature-loop (hạng mục F-I, plan rollout §Bổ sung 04/08).** Nguồn:
> lỗ "thang vật liệu thiếu chiều ngữ cảnh" (feedback r3) + ràng tách tầng.

## Vấn đề

Thang vật liệu của phiên thiết kế (S1-D) chấm độ trung thực của VẬT
(linh-kiện-thật / khung-dựng / tĩnh) nhưng không có chiều cho CHỖ VẬT SỐNG:
bản mẫu đứng một mình không cho thấy người dùng đi đường nào tới vật, kết
quả đi đâu — owner duyệt thị giác xong vẫn không hình dung được cách hoạt
động (r3, 04/08). Đồng thời mọi lời giải phải generic: kit không được biết
"Creator/canvas" là gì.

## Thay đổi — sáu chỗ, kit giữ thang, repo giữ host

| # | Chỗ | Đổi gì |
|---|---|---|
| 1 | Skill `design-pass` (nguồn `skills/`) | Frontmatter sổ phiên (`design-pass.md`) thêm khoá bắt buộc `context: standalone \| static-frame \| host-embedded` (hiển thị tiếng người: đứng-một-mình / khung-giả-tĩnh / nhúng-host-thật) — khai như `material:`. Giai đoạn 0 thêm câu hỏi thứ hai bắt buộc chọn: "vật này sống ở đâu — phiên trình ở nấc nào?" (song song câu phân loại mẫu). Luật: `standalone` trước Cổng Phạm-vi ⇒ kèm ≥1 **cảnh ngữ-cảnh** (khung host thật dạng tĩnh bọc vật + storyboard hành trình vào–ra) hoặc entry descope có tên. |
| 2 | Hướng dẫn mặc-định-nấc-cao trong skill | Quy tắc chọn nấc RẺ nhất đạt thị giác thật: vật giao là một "đơn vị host đã có khuôn" (plugin / route / screen) ⇒ mặc định **scaffold đơn vị THẬT sau cờ dev, ruột tạm** (mẫu r3: plugin thật trong Creator) — host render vật, không dựng shell giống thật (cấm gương song song). Không có đường nhúng rẻ ⇒ `static-frame` hoặc `standalone`+cảnh — hợp lệ vĩnh viễn, thang là khai báo, không ép. |
| 3 | Ổ cắm consumer (`_acceptance/config.yaml`) | Khoá mới TU CHỌN `design_pass.host_embed`: con trỏ tới hướng dẫn nhúng của repo (thường = chính `ui_standards_skill`) + route proto + cờ dev. **Đường đọc-cũ:** khoá vắng ⇒ không lỗi, phiên coi repo chưa có đường nhúng rẻ → nấc thấp + cờ vàng trên thẻ, KHÔNG chặn (bất biến schema-có-đường-đọc-cũ). |
| 4 | Thẻ Cổng Phạm-vi (bộ dựng thẻ) | Render nấc ngữ cảnh đã khai bằng tiếng người + cờ vàng khi `standalone` thiếu cảnh ngữ-cảnh — người duyệt thấy và có quyền trả. |
| 5 | Vòng lặp tính năng (S1-D wiring) | Checklist kết phiên S1-D thêm mục: ma trận capture + findings + **nấc ngữ cảnh đã khai**; resume-guard đọc khoá này. |
| 6 | Test (pin) | (a) round-trip khuôn writer ↔ reader thẻ cho `context:` (mẫu P55/P104); (b) **RED trên fixture repo-lạ code-sinh** (web app trơn, không phải artifact-platform) — chứng minh generic bằng máy; (c) workspace cũ không có `context:` → cờ vàng, không bắt migrate. |

Kèm: spec v2 §2.2 nhận amendment "bổ sung 04/08 — trục ngữ cảnh" (một đoạn,
trỏ file này); CONTEXT.md thêm term khi land.

## KHÔNG đổi (nói tên để khỏi bàn lại)

- Kit KHÔNG ship UI/component/máy-chủ-preview nào — host là việc của repo
  (ADR "kit không ship UI" đi cùng F-D).
- Bảng định tuyến A/B/C/D/E giữ nguyên — đường C không áp trục (không có
  host thị giác); đường E host = trang trưng bày (đã định nghĩa sẵn).
- Không ghim từ vựng host nào ("Creator", "canvas", "plugin OneHub") vào
  kit — test chỉ ghim QUAN HỆ khai-nấc ⟂ config-cấp-đích.
- Thang vật liệu VẬT giữ nguyên — trục ngữ cảnh là chiều thứ hai độc lập,
  không thay thế.

## Đường thi công

Gộp với phần còn lại làn thiết kế (F-D đợt 2: `/proto-init` + `proto-lint`)
hoặc chạy riêng — một vòng T2 qua feature-loop, 1-2 buổi. Fixture bắt buộc
code-sinh; mọi case âm có đối chứng dương + ghim thông điệp (bất biến
CLAUDE.md).
