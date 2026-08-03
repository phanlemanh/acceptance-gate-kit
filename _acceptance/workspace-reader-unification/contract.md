---
schema_version: 1
feature: Gom luật đọc hồ sơ xưởng về một chỗ — mọi bên đọc phải cho cùng một kết luận
slug: workspace-reader-unification
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
relates: product-map-uat-session
---

# Acceptance Contract: workspace-reader-unification

## Context

Vòng `product-map-uat-session` dựng `lib/workspace-record.js` làm "luật duy nhất
trả lời hồ sơ của slug này có hỏng không", và case P110 ghim quan hệ hai bên đọc
phải đồng ý. Nhưng luật chỉ phủ ba file; **mọi luật về `evidence-report.md` vẫn
nằm riêng trong `start-scan.mjs`**, còn bản đồ không đọc file đó lần nào. Chín
vòng S4 của feature trước bắt lại đúng lớp lỗi này ở **bốn file khác nhau** —
mỗi lần vá một file thì nó hiện ra ở file kế tiếp. Đây là vòng dọn trọn, không
vá tiếp.

Nguồn: `_acceptance/product-map-uat-session/review-findings.md` (S4-r5→r9) +
Known limits mục 1–2 của contract đó.

## Criteria

- AC-1 (luật một chỗ): Given `_acceptance/<slug>/` có `evidence-report.md` ở các hình dạng hỏng (frontmatter không đọc được · thiếu `verdict` · `verdict` ngoài enum · `status: verified` mà thiếu hẳn file), When cả bản đồ sản phẩm lẫn bộ quét vào phiên đọc cùng workspace đó, Then hai bên cho CÙNG kết luận hỏng/không-hỏng và cùng nêu tên file — luật sống trong `lib/workspace-record.js`, không bên nào giữ bản sao riêng.
- AC-2 (khoá `verdict` hai enum): Given `verdict` xuất hiện ở CẢ `evidence-report.md` (PASS/REJECT/BLOCKED/PENDING-JUDGMENT) lẫn `uat-session.md` (release/iterate/kill), When luật kiểm enum chạy, Then mỗi file được kiểm bằng enum CỦA NÓ — gán nhầm enum chéo phải làm phép đo ĐỎ.
- AC-3 (trạng thái bản đồ một chỗ): Given `PRODUCT-MAP.md` bị xoá khỏi cây làm việc sau khi đã commit, When bộ quét vào phiên và `--check` cùng nhìn, Then cả hai gọi nó là ĐÃ XOÁ (không phải "chưa dựng"), và thẻ `/start` nói đúng điều CI đang nói.
- AC-4 (khuôn chép được): Given người dùng chép `uat-session-template.md` theo đúng chỉ dẫn trong thân skill, When file kết quả được đưa cho reader chuẩn, Then nó là hồ sơ LÀNH MẠNH — khuôn phải tự dặn bỏ dấu marker và khối fence, như `contract-template.md` đã dặn. (Known limit 1 của vòng trước.)
- AC-5 (`--check` không xanh giả): Given `--root` trỏ vào thư mục không tồn tại hoặc không phải repo đã init, When chạy `--check`, Then KHÔNG exit 0 im lặng — mode kiểm phải phân biệt được "chưa init" với "đường dẫn sai". (Known limit 2 của vòng trước.)
- AC-6 (từ vựng): Given `CONTEXT.md` là glossary authoring-time, When vòng này xong, Then nó có mục cho Cổng Giá trị (mục **Gate** liệt đủ bốn cổng người), cho `uat-session.md` và `PRODUCT-MAP.md` trong phần Artifacts, và cảnh báo `verdict` mang hai nghĩa theo file.

## Coverage

- **Trục file** (contract · opportunity · uat-session · evidence-report · PRODUCT-MAP) — AC-1, AC-2, AC-3.
- **Trục bên đọc** (bản đồ · bộ quét vào phiên · `--check` · hook/CI) — AC-1, AC-3, AC-5.
- **Trục người dùng** (chép khuôn tay · tra glossary) — AC-4, AC-6.
- Thước CE: chín vòng S4 của `product-map-uat-session` đã liệt kê từng hình dạng hỏng kèm bước tái dựng — dùng chính danh sách đó làm fixture.

## Out of scope

- Bản Codex của nghi thức phiên nghiệm thu (Known limit 3) — thuộc vòng riêng về Codex parity.
- ADR cho việc Cổng Giá trị để mở model-invocation (Known limit 4) — quyết định chính sách, đi cùng vòng bàn về cổng thứ bảy.
- Quy tắc `since` của ô chờ-Cổng-Giá-trị (Known limit 5) — chỉ chạm khi nghi thức thật sinh ra `decided_at` trước lúc ký.

## Notes

- Vòng trước dạy: **vá một file trong họ lỗi này thì nó hiện ra ở file kế tiếp**.
  Cách đo đúng là gắn thước vào QUAN HỆ "mọi bên đọc đồng ý" trên TOÀN BỘ tập
  file, không gắn vào bảng luật hiện có — P110 xanh suốt chín vòng chính vì
  danh sách ca của nó chỉ dựng những file mà bảng luật đã biết.
