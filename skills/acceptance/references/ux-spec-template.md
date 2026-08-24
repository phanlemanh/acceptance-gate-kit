# Đặc tả UX — khuôn cho feature chạm UI (S1, TRƯỚC khi sinh 3 artifact)

Chép section trong marker `UX-SPEC-TEMPLATE` dưới đây vào design-doc của
feature rồi điền. **GIỮ NGUYÊN các dòng marker HTML-comment** (cả
`UX-SPEC-TEMPLATE` lẫn `UX-STATE-TABLE`): chúng vô hình khi render nhưng là mỏ
neo cho phép đo khớp vòng (cánh W8 của `eval-coverage-lint.js`) — xoá marker là
tự tắt phép đo của chính mình (W8a sẽ cờ).

Ba dây nối máy-đọc đi kèm (S1 của feature-loop ghi cả ba):

1. Contract frontmatter thêm key `design_doc: <path design-doc, tương đối
   repo-root>` — chỗ phép đo tìm section này.
2. Mỗi eval máy/ui chứng minh trạng thái nào thì khai `states: [ST-…]`
   (flow list MỘT dòng) trong `evals.yaml`.
3. Id trạng thái theo khuôn `ST-<màn>-<trạng-thái>` (chữ/số/gạch-nối) — đây là
   khoá khớp vòng: khai mà không đo → cờ W8b; đo mà không khai → cờ W8c.

**Cửa miễn:** feature KHÔNG chạm UI → không điền khuôn, ghi MỘT entry
`descope` vào `decisions.jsonl` với decision bắt đầu đúng chuỗi
`"bỏ đặc-tả-UX — <lý do 1 dòng>"` — có vết, lưới không cờ (contract không có
`surfaces: ui` và không có `design_doc:` thì W8 im lặng).

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
Căn cứ: {{đã tra gì / rút gì — thang 2 nấc: (i) phiên có công cụ tra mẫu thị trường (vd MCP Mobbin) → tra luồng cùng loại, ghi 1 dòng đã xem gì + rút gì; (ii) không có → chọn từ danh sách trên, ghi lý do. CHỈ tra khi không tự chắc (≥ 2 khuôn khả dĩ) — luồng hiển nhiên thì ghi thẳng lý do. Dòng này TRỐNG = máy đoán chay, cờ W8d}}
<!-- UX-SPEC-TEMPLATE>>> -->
