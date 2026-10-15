# Quét hình thái — ap-chinh-sach-lo-trinh

Skill `morphological-scan`, preset entity-feature. Thực thể = **một lần máy tự áp chính sách lên một hàng lộ trình**.
Vòng 1 (`_acceptance/ra-soat-lo-trinh/coverage-scan.md`) đã quét «đề xuất»; vòng này quét «đề xuất → thay đổi tệp».

## Ngữ cảnh
- Sản phẩm: lộ trình của kit nghiệm thu. Chân sản phẩm:
  - `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]` — `raSoat` có năm luật, `kiemKhuon` đọc `chinh_sach`, có các khối `chan_troi` và `da_bac`.
  - `[SUY-TỪ-REPO: docs/findings/2026-10-14-kien-truc-roadmap-plugin.md]` — §6 mục 2–3, §11.
  - `[SUY-TỪ-REPO: _acceptance/ap-chinh-sach-lo-trinh/nen/crm-onehub-3818ad4e.json]` — 8 commit dời hàng bằng tay ở crm, 03–14/10.
  - Ba tệp lộ trình của crm và tệp của kit đều đúng dạng `JSON.stringify(…, null, 2)` cộng dấu xuống dòng (máy kiểm 15/10).
- Chân ngành:
  - `[NGÀNH: GitHub actions/stale]` — đánh dấu cũ trước, đóng sau N ngày nữa. Nhãn miễn trừ (`exempt-issue-labels`). Đụng vào thì đồng hồ đặt lại.
  - `[NGÀNH: Linear — auto-close / auto-archive]` — không đóng khi chu kỳ gắn việc chưa xong; có lối hoàn tác.
  - `[NGÀNH: Renovate — Dependency Dashboard]` — máy đề xuất trước, người duyệt hay chặn một mục bằng một thao tác.
  - Ba nguồn đã kiểm ở vòng 1 (14/10) và ở tài liệu kiến trúc §8.

## Trục
- **A · Loại đề xuất → hành động:**
  - dời mốc → dời hàng sang mốc chiến dịch đang chạy;
  - chờ điều kiện → chuyển hàng vào `chan_troi`;
  - bác → chuyển hàng vào `da_bac`;
  - dời mốc mà không còn mốc chiến dịch nào phía trước → không áp, cảnh báo.
  - [thước CE: B′ §6 mục 3 «chỉ dời hàng giữa mốc / chân trời / đã bác»; luật của `raSoat`]
- **B · Pha của một đề xuất:**
  - lần đầu thấy → báo trước;
  - còn trong nhịp → giữ;
  - qua nhịp mà đề xuất còn nguyên → áp;
  - qua nhịp mà đề xuất đã mất → huỷ;
  - đã áp → trả lại được;
  - hàng ghim → miễn.
  - [thước CE: actions/stale (stale → close), B′ §11 (ghim · tra-lai)]
- **C · Chính sách:**
  - không khai → chỉ cờ;
  - khai ở tệp mà không bật tự áp → chỉ cờ;
  - mốc chiến dịch đang chạy bật tự áp → áp;
  - khai sai kiểu → cờ khuôn, không áp;
  - mốc chiến dịch đã qua có chính sách → không áp theo nó.
  - [thước CE: ADR 0025 bổ sung «chính sách chiến dịch chốt ở khoảnh khắc mở chiến dịch»; §11 `docChinhSach` «đọc từ mốc»]
- **D · Mặt và tệp chịu tác động:**
  - tệp lộ trình (định dạng, thứ tự, khoá lạ);
  - sổ tự áp;
  - thẻ khởi động;
  - lệnh xem;
  - lệnh khoá ghim / bỏ ghim / trả lại;
  - trang lộ trình;
  - nhánh của nhiều máy cùng áp.
  - [thước CE: B′ §6 mục 3, §11 ràng buộc (i)(ii); ADR 0002]

## Core
1. Ba hành động (A) trên ba loại đề xuất, kèm ca không có mốc chiến dịch phía trước → AC-3.
2. Pha báo trước → áp → huỷ, trần áp mỗi ngày (B) → AC-2.
3. Đọc chính sách theo mốc chiến dịch đang chạy (C) → AC-1.
4. Bộ ghi giữ byte ngoài phần dời, và từ chối ghi tệp không đúng dạng chuẩn (D) → AC-4.
5. Sổ tất định: hai máy áp cùng ngày ra cùng byte (D) → AC-5.
6. Trả lại, ghim, bỏ ghim (B) → AC-6, kèm ba lệnh khoá (CỘNG) → AC-7.
7. Bản đồ của lệnh xem và thẻ khởi động báo trước (D) → AC-8, AC-9.
8. Điểm chạy tự động và thước đo «dời bằng tay» trừ commit máy → AC-10.
9. Dữ liệu thật: bản chụp crm cộng chính sách giả, áp hai ngày → AC-11.

## Later
- Đóng băng (`dong_bang`) — răng của nó nằm ở cắt lượt (`cat-luot.mjs --co`, B′ §10). Vào hạt giống.
- Rà soát lại mục «chờ điều kiện» theo `mo_lai_khi` (tự kéo hàng về «Kế tiếp»).
- Chính sách hỏi ở thẻ mở đợt (`/dieu-phoi:mo-dot`, vùng máy M5).
- Cửa tín hiệu `/road-map:gui` (RM3, vùng M5).
- Tệp lộ trình khởi tạo (RM4, nấc 2): điều kiện mở lại chưa đạt.

## Never
- Tự áp việc **chặn** một việc đang chạy (RM5, nấc 4). Việc chặn là khó đảo, luôn là câu hỏi cho chủ kho.
- Xoá hẳn một hàng. Mọi lần áp chỉ chuyển hàng giữa các khối của cùng tệp.
- Đụng hàng có hồ sơ đang mở.
- Sửa mốc của người (`ngoai`, `han`, `su-kien`).
- Áp khi đọc thẻ khởi động: `/start` là lệnh chỉ đọc.

## Cross-cutting áp mọi ô Core
- Kho không khai `tu_ap`: mọi mặt giống TỪNG BYTE bộ máy gốc — thẻ, trang, lệnh rà soát; bộ ghi không chạy.
- Mọi lần ghi: dòng sổ có trước, tệp đổi sau. Hỏng giữa chừng thì không để tệp nửa vời (ghi tệp tạm rồi đổi tên).
- Chữ hiển thị «chờ điều kiện», không phải «chân trời».
