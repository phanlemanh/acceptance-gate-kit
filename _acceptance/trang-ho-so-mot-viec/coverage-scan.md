# Quét độ phủ — trang-ho-so-mot-viec

Khuôn: `morphological-scan`, preset entity-feature (thực thể = MỘT hồ sơ việc), 11/10.

## Ngữ cảnh

- Sản phẩm: kit nghiệm thu — trang hồ sơ một việc + dải tóm tắt trong khối dữ liệu lộ trình.
  Chân sản phẩm: hàng X2 `[SUY-TỪ-REPO: docs/plans/lo-trinh-kit.json]`, ô cơ hội
  `[SUY-TỪ-REPO: _acceptance/trang-ho-so-mot-viec/opportunity.md]`, hồ sơ LT1 thật của crm
  (`10063a25e`), trang bằng chứng `[SUY-TỪ-REPO: scripts/evidence-page.js]`, khối bản 1
  `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`.
- Chân ngành: `[NGÀNH: trang pull request của GitHub — tóm tắt trên đầu, Conversation/Commits/Checks
  gập theo thẻ]` cho bố cục «dải trên + mục chi tiết»; `[NGÀNH: trang chi tiết issue của Linear —
  thuộc tính ở cột bên, dòng thời gian hoạt động lọc được]` cho dòng thời gian quyết định; `[NGÀNH:
  ADR — Nygard]` cho «vì sao / quyết gì / hệ quả». Bố cục được chủ kho nêu: màn chi tiết Thoả thuận
  của CRM.

## Trục

- **A — câu người đọc hỏi:** vì sao làm · hứa gì · quyết gì · tốn gì · giao gì · có ăn thua không ·
  đã lên production chưa · chưa làm gì · ai quyết  [thước CE: câu giao + `vi_sao` hàng X2; ADR Nygard]
- **B — tình trạng hồ sơ:** đủ và đã ký · đang dở (chưa có báo cáo bằng chứng) · đời cũ (thiếu tệp,
  sổ ghi `impact` thay `cost_if_wrong`) · hỏng một phần (dòng sổ JSON hỏng)  [thước CE: 126 hồ sơ có
  báo cáo ở kit + hồ sơ crm trên máy]
- **C — mặt hiện:** trang hồ sơ (người) · khối dữ liệu bản 2 (bản chiếu) · tiêu đề câu giao (cả trang
  lộ trình, trang hồ sơ, khối, ô cơ hội mở từ hàng)  [thước CE: hàng X2 «bộ vẽ + trường tiêu đề»]
- **D — bên đọc khối:** bộ đọc mới × trang bản 1 · bộ đọc bản 1 (crm chép) × trang bản 2 · CI
  `--check`  [thước CE: luật «đổi schema có đường đọc-cũ» của CLAUDE.md]

## Core

1. A × C(trang): chín câu trên dải + mục gập, mỗi câu rút từ một tệp có tên → AC-1, AC-2, AC-3, AC-4, AC-5.
2. A(tốn gì, quyết gì) × C(khối): tầng chủ kho trong khối → AC-7.
3. B × C(trang): đọc-cũ không vỡ, ô «chưa có» có tên; chạy trên mọi hồ sơ thật → AC-6.
4. D: hai chiều đọc + tài liệu khớp → AC-8, AC-9.
5. C(tiêu đề): bỏ đúng một cặp «» ở mọi chỗ in, khuôn hàng mới không thêm → AC-10, AC-11.
6. A × người nhìn: một màn đọc trên hồ sơ thật → AC-12.

## Later

- Liên kết từ hàng trên trang lộ trình sang trang hồ sơ (trang hồ sơ vẽ theo yêu cầu, không nằm trong git của kit).
- Số PR trong khối dữ liệu — chỉ có sau khi gộp; xem sổ quyết định.
- Ô «số lần gọi người» — chờ máy đếm.
- Trang hồ sơ cho việc đang dở (chưa có báo cáo bằng chứng) — hôm nay trang dừng như cũ; dải trong khối vẫn có.

## Never

- Gọi model để tóm tắt — trái «kit render, không soạn».
- Trang thứ ba / máy chủ.
- Sửa tệp kế hoạch của kho để gỡ «».

## Cross-cutting áp mọi ô Core

- Tất định: cùng vật → cùng byte, không phụ thuộc giờ chạy hay múi giờ.
- Mọi chữ hồ sơ được thoát HTML; không tải gì từ mạng.
