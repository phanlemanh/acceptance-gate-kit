# Preset: Feature quanh một entity

Dùng khi scope feature xoay quanh một danh từ trung tâm: contact, listing, deal, tin đăng, dự án…

## Trục

1. **Lifecycle** — vòng đời entity, quét trọn chuỗi, cấm dừng ở CRUD:
   tạo/nhập (form, import file, API) → phát hiện & merge trùng → sửa (đơn lẻ + bulk) → tổ chức (tag, phân loại, gán người phụ trách) → lưu trữ/khôi phục vs xóa hẳn → xuất/chia sẻ.
2. **Actor × quyền** — từng role trong Product Context × phạm vi (own / team / all). Trục này sinh ra: sở hữu riêng vs chung, **chuyển giao entity khi nhân sự nghỉ việc**, phân quyền xem–sửa–xóa, audit log.
3. **Vào – ra** — entity từ đâu đến (form web, chat, cuộc gọi, quét card, API, import) và đi đâu (kênh marketing, báo cáo, export, hệ thống khác — kênh cụ thể lấy từ Product Context). Mỗi đầu vào/ra là một cụm feature tích hợp.
4. **Thời gian** — entity không tĩnh: timeline tương tác, nhắc follow-up, phát hiện nguội/stale, lịch sử thay đổi, job định kỳ (dedupe schedule…).

## Cross-cutting (áp mọi ô Core)

- Dữ liệu cá nhân: entity chứa PII → áp khung pháp lý dữ liệu của thị trường trong Product Context (vd VN: Luật Bảo vệ dữ liệu cá nhân 2025 — thay NĐ13, hiệu lực 01/2026; EU: GDPR) — consent, quyền yêu cầu sửa/xóa. Bắt buộc, không phải nice-to-have.
- Audit log; empty/loading/error state; giới hạn số lượng + phân trang; tìm kiếm & lọc.

## Thước CE

User journey đầy đủ của từng actor + đối chiếu 2 sản phẩm cùng loại đang chạy thật.

## Bẫy hay gặp

- Sót merge duplicate và bulk ops — spec ngây thơ gần như luôn sót.
- Sót "chuyển giao khi nghỉ việc" — chỉ trục actor mới đẻ ra, CRUD thuần không bao giờ.
