---
schema_version: 1
feature: Tài liệu first-run một khuôn — CI snippet, /start, jsdom, attribution version
slug: docs-first-run-audit
owner: manh@mstar.vn
risk_tier: T2
surfaces: [docs]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-04T18:10:00+07:00
time_human_minutes: {gate1: 10}
---

# Acceptance Contract: docs-first-run-audit

Nguồn scope: audit tài liệu hướng dẫn + đóng gói lần đầu (hội thoại 04/08).
Gói 6 mục Đ1/Đ2/Đ4/Đ5/Đ6/Đ7 đã được owner duyệt hai lượt trong phiên (review
kế hoạch → lệnh thực thi); Đ3 (hai harness ghi hai giá trị `executors.design.*`
không tương thích) chủ động để ngoài — quyết định thiết kế, vòng riêng.

## Criteria

- AC-1: Given ba tài liệu README/QUICKSTART/GUIDE, When một người copy snippet CI từ BẤT KỲ tài liệu nào, Then mọi lời gọi `pre-merge-check.sh .` đều mang `--base`, và file nào dạy snippet GitHub Actions thì dạy kèm `fetch-depth: 0` trong cùng file — một khuôn 2 bước duy nhất (GUIDE §5.3), không còn dạng không-base làm T1-escape/gap-probe declared-off ngay ngày đầu.
- AC-2: Given QUICKSTART là tài liệu 5-phút cho thành viên mới, When đọc mục Dùng hằng ngày, Then có mục vào phiên bằng `/start` (cùng chuẩn đo với GUIDE/README — phép đo per-file, mutant từng file phải đỏ đúng file).
- AC-3: Given khối pilot-mode trong README, When đối chiếu với `ls commands/*.md`, Then mọi lệnh đều có dòng symlink tương ứng — ma trận suy từ vật thật, thêm lệnh mới mà quên pilot block là đỏ.
- AC-4: Given phần chữ của gói, When đọc lại, Then (a) README nói đúng: init phát `recheck: strict`, câu cũ "advisory by default" không còn; (b) cả 3 điểm init (acceptance-init Claude, design-init 2 harness) nhắc `jsdom` — thiếu nó mọi design eval BLOCKED; (c) manifest Claude gán `/start session-entry` cho v1.30 (đúng commit release 3187b6e), bản đồ + phiên nghiệm thu cho v1.31.
- AC-5: Given toàn bộ hành vi đã nghiệm thu trước gói, When áp các thay đổi trên, Then cả 4 suite cùng hai cổng chống trôi (mirror-sync, product-map) vẫn xanh nguyên trạng.

## Coverage

- Bỏ quét không gian AC — scope là danh sách ĐÓNG 6 mục đã duyệt đích danh
  trong phiên 04/08 (entry descope trong decisions.jsonl); Đ3 ghi ngoài phạm vi
  có chủ đích.
- Trục kiểm duy nhất — ánh xạ mục-sửa ↔ AC: Đ1→AC-1 · Đ4→AC-2 · Đ5→AC-3 ·
  Đ2/Đ6/Đ7→AC-4; AC-5 chống thoái lui phủ phần còn lại.

## Out of scope

- Đ3: chuẩn hoá giá trị `executors.design.*` chạy được cả hai harness (hoặc
  khai tường minh config gắn harness khởi tạo) — quyết định thiết kế, cần vòng
  bàn riêng, có thể thành ADR.
- Đổi thân lệnh `/start`, đổi hành vi cổng pre-merge, đổi khuôn GUIDE §5.3.

## Notes

- Cổng 1 duyệt qua hội thoại (04/08): owner đọc bản phân tích 7 finding, yêu
  cầu review lại kế hoạch, rồi ra lệnh thực thi gói — máy điền
  `approved_by`/`approved_at` theo quyết định tường minh đó, cùng nghi thức
  /approve (card → YES tường minh → máy ghi).
- Thước viết TRƯỚC vật: P131/P132 + mở rộng P101 commit kèm gói, ĐỎ đúng 4 chỗ
  kỳ vọng trên doc cũ trước khi sửa; P133 ghim phần chữ.
- W3 (out-of-scope không có eval âm): hai mục out-of-scope là việc-không-làm
  thuộc vòng tương lai (Đ3) và các bất-biến đã có thước riêng (thân `/start`
  P101/P107, cổng pre-merge P44/P48, khuôn GUIDE chính là E1) — không có hành
  vi mới nào cần eval khẳng-định-không-nổ trong vòng này.
