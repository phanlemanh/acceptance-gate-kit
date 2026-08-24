# Đặc tả UX — khuôn cho feature chạm UI (S1, TRƯỚC khi sinh 3 artifact)

Chép section trong marker `UX-SPEC-TEMPLATE` dưới đây vào design-doc của
feature rồi điền. **GIỮ NGUYÊN các dòng marker HTML-comment** (cả
`UX-SPEC-TEMPLATE` lẫn `UX-STATE-TABLE`): chúng vô hình khi render nhưng là mỏ
neo máy-đọc CHO VIỆC SAU — phép đo khớp vòng «trạng thái khai trước ↔ bài kiểm
đo nó» chưa tồn tại (đề bài + điều kiện mở lại:
`docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`). Bản này KHÔNG có lưới
máy nào cho đặc tả UX: chốt chặn là MẮT NGƯỜI duyệt tại Cổng Phạm vi.

Ba dây nối máy-đọc đi kèm (S1 của feature-loop ghi cả ba):

1. Contract frontmatter thêm key `design_doc: <path design-doc, tương đối
   repo-root>` — chỗ phép đo tìm section này.
2. Id trạng thái theo khuôn `ST-<màn>-<trạng-thái>` (chữ/số/gạch-nối) — bảng
   phải có ÍT NHẤT một dòng; bảng rỗng là «chép khuôn rồi xoá sạch».
3. Đối chiếu tự động «trạng thái khai trước ↔ bài kiểm đo nó» CHƯA có (tách sang
   việc riêng, 24/08) — người duyệt soi bằng mắt tại cổng.

**Cửa miễn:** feature KHÔNG chạm UI → không điền khuôn, ghi MỘT entry
`descope` vào `decisions.jsonl` với decision bắt đầu đúng chuỗi
`"bỏ đặc-tả-UX — <lý do 1 dòng>"` — vết cho NGƯỜI và ván thử đọc; engine không
có bộ đọc nào cho chuỗi này.

Trần kích thước: section điền xong **≤ 1 trang** — khuôn là tờ khai, không
phải tiểu luận; dòng nào feature này không có thì xoá dòng đó.

---8<---
<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: {{điểm vào}} → {{bước}} → {{kết quả}} (điểm ra: {{đâu}})
- Biên: {{ca rìa đáng kể — vd danh sách rỗng, quyền thiếu}}
- Lỗi & quay lại: {{sai ở bước nào → thấy gì → đường quay lại}}

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| {{tên màn}} | {{một câu, một việc}} | {{từ đâu / tới đâu}} |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-{{man}}-{{loading}} | {{màn}} | {{skeleton/spinner + copy thật}} | {{chờ / hủy}} |
| ST-{{man}}-{{empty}} | {{màn}} | {{empty state + copy thật}} | {{hành động gợi ý}} |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- {{validation / giới hạn ký tự / phím & focus / breakpoint — CHỈ dòng feature này thật có}}

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| {{tên}} | {{nấc}} | {{lý do}} |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: {{MỘT tên từ danh sách đóng: wizard · trung-tâm-toả-nhánh (hub-and-spoke) · bảng-điều-khiển (dashboard-first) · hội-thoại · kanban · danh-sách-chi-tiết (master-detail) · một-cột-cuộn}}
Căn cứ: {{đã tra gì / rút gì — thang 2 nấc: (i) phiên có công cụ tra mẫu thị trường (vd MCP Mobbin) → tra luồng cùng loại, ghi 1 dòng đã xem gì + rút gì; (ii) không có → chọn từ danh sách trên, ghi lý do. CHỈ tra khi không tự chắc (≥ 2 khuôn khả dĩ) — luồng hiển nhiên thì ghi thẳng lý do. Dòng này TRỐNG = máy đoán chay — người duyệt thấy tại cổng (máy không kiểm)}}
<!-- UX-SPEC-TEMPLATE>>> -->
