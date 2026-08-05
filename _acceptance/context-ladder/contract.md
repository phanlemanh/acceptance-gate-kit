---
schema_version: 1
feature: Trục ngữ cảnh cho bản mẫu — khoá context 3 nấc trong sổ phiên design-pass, card Cổng 1 render nấc, generic mọi repo
slug: context-ladder
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-04T15:32:00Z
time_human_minutes: {gate1: 15, gate2: 15}
---

# Acceptance Contract: context-ladder

Nguồn scope: thiết kế đã duyệt hướng `docs/specs/2026-08-04-context-ladder-design.md`
(hạng mục F-I, plan rollout §Bổ sung 2026-08-04). Phạm vi đúng SÁU chỗ đổi +
BỐN điều KHÔNG đổi trong bản thiết kế đã duyệt — không ôm proto-init/lint.

## Criteria

- AC-1 (writer — khoá context): Given khuôn `DESIGN-PASS-NOTE-TEMPLATE` trong `skills/design-pass/SKILL.md`, When rút frontmatter giữa cặp marker bằng máy, Then có khoá bắt buộc `context:` với đúng 3 giá trị `standalone|static-frame|host-embedded` khai cạnh `material:`, và Giai đoạn 0 của skill có câu hỏi bắt buộc thứ hai "vật này sống ở đâu — phiên trình ở nấc nào?" song song câu phân loại mẫu; mutation xoá khoá hoặc xoá câu hỏi → case đỏ ghim đúng thông điệp, bản nguyên vẹn xanh trước.
- AC-2 (writer — luật cảnh ngữ-cảnh, khuôn MỘT chỗ): Given phiên khai `context: standalone` trước Cổng Phạm-vi, When kết phiên, Then skill bắt buộc kèm ≥1 cảnh ngữ-cảnh (khung host thật dạng tĩnh bọc vật + storyboard hành trình vào–ra) HOẶC entry descope có tên theo khuôn máy-đọc bắt đầu đúng chuỗi `"bỏ cảnh ngữ-cảnh — "`; không có đường bỏ im lặng; VÀ biểu diễn máy-đọc của cảnh ngữ-cảnh cùng chuỗi descope phải nằm TRONG chính khuôn `DESIGN-PASS-NOTE-TEMPLATE` (một chỗ có marker — reader chỉ dò theo khuôn đó, không heading/chuỗi tự đặt ở chỗ khác); mutation xoá luật hoặc tách khuôn khỏi marker → đỏ ghim thông điệp.
- AC-3 (writer — mặc-định-nấc-cao): Given vật giao là một đơn vị host đã có khuôn (plugin / route / screen), When skill hướng dẫn chọn nấc, Then mặc định là scaffold đơn vị THẬT sau cờ dev với ruột tạm (host render vật), CẤM dựng shell giống thật (gương song song); không có đường nhúng rẻ → `static-frame` hoặc `standalone`+cảnh là hợp lệ vĩnh viễn — thang là khai báo, không ép; mutation xoá quy tắc hoặc xoá lệnh cấm gương → đỏ.
- AC-4 (socket — host_embed đường đọc-cũ + con trỏ phải giải được): Given `_acceptance/config.yaml` KHÔNG có khoá `design_pass.host_embed`, When phiên chạy và card render, Then không lỗi — repo được coi chưa có đường nhúng rẻ → nấc thấp + cờ vàng trên card, KHÔNG chặn; Given khoá CÓ và con trỏ giải được, Then skill khai nó là con trỏ tới hướng dẫn nhúng của repo + route proto + cờ dev (docs khoá nằm trong bảng preflight của skill); Given khoá CÓ mà con trỏ KHÔNG giải được trong repo (file/skill không tồn tại), Then cờ vàng nêu tên con trỏ hỏng — không chặn, không im lặng coi như có đường nhúng.
- AC-5 (reader — render nấc + round-trip TOÀN khuôn): Given `_acceptance/<slug>/design-pass.md` viết theo ĐÚNG khuôn rút từ marker bên writer (fixture do code sinh, không viết tay), When `gate-card.js` render Cổng 1, Then card hiện nấc ngữ cảnh bằng tiếng người (đứng-một-mình / khung-giả-tĩnh / nhúng-host-thật) — phép đo round-trip rút-từ-writer-đọc-bằng-reader phủ CẢ khoá `context:` LẪN biểu diễn cảnh ngữ-cảnh, đo ĐẦU RA card.
- AC-6 (reader — cờ vàng standalone thiếu cảnh): Given sổ phiên khai `context: standalone` mà KHÔNG có cảnh ngữ-cảnh và ledger không có entry descope bắt đầu `"bỏ cảnh ngữ-cảnh — "`, When render card Cổng 1, Then cờ vàng nêu tên tình trạng để người duyệt có quyền trả; đối chứng dương: có cảnh HOẶC có entry descope → không cờ; fixture CẢ BA nhánh đều rút từ khuôn writer bằng code trong lần chạy — không nhánh nào dựng fixture theo khuôn bên đọc.
- AC-7 (reader — đường đọc-cũ + giá trị lạ): Given design-pass.md sinh trước feature này (không có khoá `context:`), When render card, Then cờ vàng "chưa khai nấc ngữ cảnh", KHÔNG lỗi, KHÔNG bắt migrate; Given `context:` mang giá trị NGOÀI 3 nấc, Then card nêu tên giá trị không nhận diện được (cờ vàng), không im lặng map sang nấc nào.
- AC-8 (generic — RED trên repo-lạ): Given fixture repo-lạ DO CODE SINH trong chính lần chạy suite (web app trơn, không phải artifact-platform), When chạy các phép đo AC-5/6/7 trên fixture đó, Then chúng phân biệt đúng đỏ/xanh — chứng minh phép đo ghim QUAN HỆ khai-nấc ⟂ config-cấp-đích; và không từ vựng host cụ thể nào ("Creator", "canvas", "plugin OneHub") xuất hiện trong nguồn skill/card/case của kit.
- AC-9 (wiring loop): Given `feature-loop/skills/feature-loop/SKILL.md` (nguồn), When đọc nghi thức S1-D, Then checklist kết phiên gồm ma trận capture + findings + NẤC NGỮ CẢNH ĐÃ KHAI, và resume-guard đọc khoá này khi resume vào workspace có design-pass.md; mutation xoá mục checklist → đỏ.
- AC-10 (chống thoái lui + docs + mirror): Given toàn bộ thay đổi, When chạy 4 suite + `sync-plugin-packages.sh --check`, Then các case design-pass hiện có (P72–P81) và toàn suite vẫn xanh, mirror khớp nguồn, `docs/specs/workflow-v2-spec.md` §2.2 có amendment "bổ sung 04/08 — trục ngữ cảnh" trỏ file design, CONTEXT.md có term mới cho trục ngữ cảnh.

## Coverage

- Trục A — Seam: writer-khai (design-pass SKILL) | reader-card (gate-card) | wiring-loop (S1-D + resume-guard) | socket-config (host_embed) [CE: bảng 6 chỗ đổi của bản thiết kế đã duyệt]
- Trục B — Tình trạng vật: hợp-lệ-đủ | standalone-thiếu-cảnh | workspace-cũ-không-context | config-vắng-key | giá-trị-ngoài-enum [CE: đường đọc-cũ CLAUDE.md + bản thiết kế #3/#6c + lớp bài học verdict-ngoài-từ-vựng của start-scan]
- Trục C — Phép kiểm: dương-nguyên-vẹn | âm-mutation-ghim-message | round-trip writer↔reader | generic-repo-lạ-code-sinh [CE: bất biến CLAUDE.md + mẫu P79/P55/P52; chân ngành: Storybook decorators xác nhận thang 3 nấc]
- Ánh xạ: A×writer → AC-1/2/3 · A×socket → AC-4 · A×reader × B → AC-5/6/7 · C×generic → AC-8 · A×wiring → AC-9 · chống thoái lui → AC-10.

## Out of scope

- `/proto-init` + `proto-lint` (F-D đợt 2) — chỉ gộp nếu plan chứng minh rẻ hơn; mặc định vòng riêng (entry descope).
- Codex parity cho S1-D/context — giữ nguyên descope Claude-only sẵn có (`d-20260730T050548Z-4723`, feature design-pass-skill).
- Kit ship giao diện/component/máy-chủ-preview — bản thiết kế đã duyệt §KHÔNG đổi; host là việc của repo.
- Ép migrate workspace/sổ phiên cũ — đường đọc-cũ + cờ vàng là đủ.
- Hợp nhất khối material + context trên card thành panel design riêng — thẩm mỹ trình bày, vòng sau nếu cần.
- Bảng định tuyến A/B/C/D/E — giữ nguyên (đường C không áp trục, đường E host = trang trưng bày).

## Notes

Known limits (Cổng 2, Manh Phan 2026-08-05):

- Câu kiểm phụ đếm-số-cảnh trong case P136 ghim chuỗi không khớp được đúng
  kiểu hồi quy nó định canh (hình dạng render là `</b> · N cảnh ngữ-cảnh`,
  và placeholder tách thành 2 phần tử chứ không phải 1) — lưới chính (nhánh
  cờ-vàng) vẫn bắt được hồi quy hiện tại; nếu logic cờ và logic đếm cảnh
  tách nhau sau này, phần đếm có thể sai mà suite vẫn xanh.
- CHUYỂN HỢP ĐỒNG MỚI (quyết Cổng 2): giá trị từ sổ phiên/config chèn vào
  HTML card không qua esc() (XSS tại cổng người) — lớp an-toàn-chuỗi trên mọi
  renderer mặt người, làm thành feature riêng có AC + eval của nó.
