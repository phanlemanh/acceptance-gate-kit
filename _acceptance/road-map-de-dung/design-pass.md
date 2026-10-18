---
slug: road-map-de-dung
at: 2026-10-17T13:20:00Z
route: http://localhost:8765/moi.html (bản mẫu bộ vẽ trên bản chụp crm onehub b74ec7eae — _acceptance/ + docs/plan/, 307 hồ sơ thật)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-chup-gui-goi)
options: evidence/design-pass/ten-la-cau-giao--* (khuyên) · evidence/design-pass/ten-ngan--* (lối khác) — Hỏi-3 trên thẻ Cổng Phạm vi
divergence: opened
ds_skill: repo-tokens
states: [ten-la-cau-giao, ten-ngan, moc-con-viec, moc-het-viec, moc-chua-gan, moc-qua-ngay, tep-moc-ngoai, khong-lam-trong-kho]
breakpoints: [mobile-375, desktop-1280]
themes: [light, dark]
patched: 2
deferred: 0
---
# design-pass — road-map-de-dung

Trang là tệp HTML tĩnh mở thẳng trong trình duyệt — trình duyệt là host thật, nên nấc là `host-embedded` (tiền lệ
`trang-lo-trinh-doc-mot-phut`): bản mẫu dùng lớp phân tích thật của kit (`phanTichKho`) trên `_acceptance/` + ba tệp lộ trình
thật của crm `onehub` b74ec7eae, chỉ thay lớp vẽ khối Mốc (bản sao trong thư mục nháp; vá 45 dòng). Ngày xem 17/10.

Đo nhanh trên Chrome ở 375: không cuộn ngang (`scrollWidth` 375 = `innerWidth`), `<summary>` dòng việc thấp nhất 44px. 17 mốc
ngoài của OKR không còn trên dải mốc; mốc «Công bố OKR quý 4» (`han-cung`, có 4 việc) vẫn hiện — đúng luật mới (hạn của mốc
phát triển). Đo đủ thước (tương phản, độ dài ≤ 1/3 bản 2.21.0) là ca `LTT-ten`/`LTT-san` ở S4.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| trước (bộ máy 2.32.0) | desktop-1280 | light | evidence/design-pass/truoc-ban-may-2-32-0--desktop-1280--light.jpg |
| lối khuyên (Hỏi-3): tên = câu giao đầy đủ | desktop-1280 | light | evidence/design-pass/ten-la-cau-giao--desktop-1280--light.jpg |
| lối khuyên (Hỏi-3): tên = câu giao đầy đủ | mobile-375 | light | evidence/design-pass/ten-la-cau-giao--mobile-375--light.jpg |
| lối khác: tên ngắn trước | desktop-1280 | light | evidence/design-pass/ten-ngan--desktop-1280--light.jpg |
| lối khác: tên ngắn trước | desktop-1280 | dark | evidence/design-pass/ten-ngan--desktop-1280--dark.jpg |
| lối khác: tên ngắn trước | mobile-375 | light | evidence/design-pass/ten-ngan--mobile-375--light.jpg |
| lối khác: tên ngắn trước | mobile-375 | dark | evidence/design-pass/ten-ngan--mobile-375--dark.jpg |

`moc-chua-gan`, `tep-moc-ngoai`, `khong-lam-trong-kho` không chụp riêng: chữ «chưa gắn việc» giữ nguyên bản cũ; hai trạng thái
sau là một dòng chữ ở «Cần sửa trong kế hoạch» và một tiêu đề mục — đo bằng ca RD-2 / RD-3-trang ở S4.

## Cảnh ngữ-cảnh

- Không áp — `context: host-embedded` (trang tĩnh, trình duyệt là host).

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Mã việc bị cắt ở mép phải cột dải mốc → mã `flex-shrink: 0`, danh sách việc có lề phải.
- Mốc đã xong ghi «còn 0/8 việc» khó đọc → «đã giao đủ 8 việc» màu `--ok`.

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- (không có) — Ghi cho S3, không phải Nhóm 2: mốc đã xong hiện cả «đã giao đủ n việc» lẫn dòng gập «n việc đã giao» (thừa
  một dòng) — gộp thành một dòng gập ở S3.
