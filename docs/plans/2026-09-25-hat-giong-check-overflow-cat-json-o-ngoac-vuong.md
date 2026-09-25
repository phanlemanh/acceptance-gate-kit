# Hạt giống — `check_overflow.py` cắt kết quả ở dấu `]` đầu tiên, vỡ khi nhãn tràn có ngoặc vuông

**Ngày:** 2026-09-25 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: crm/_acceptance/cai-dat-chung-chi-quan-tri — hình `figures/thu-tu-kiem-quyen.html`; phiên crm «Chốt quyền cho ba thao tác cài đặt toàn công ty» 25/09 gặp `JSONDecodeError: Unterminated string` khi chạy bộ kiểm tràn chữ. Owner chọn ghi sổ, không đưa vào mốc 2.18.4 (hồ sơ `_acceptance/release-2-18-4/`).

## Ca

`diagram-design/skills/diagram-design/scripts/check_overflow.py` nhận kết quả đo từ Chrome dưới dạng
chuỗi `JSON:[…]` trong DOM đã dump, rồi cắt ở dấu `]` ĐẦU TIÊN trước khi `json.loads` (dòng 147:
`payload[: payload.index("]") + 1]`). Mỗi mục báo cáo mang `text` = chữ của nhãn tràn. Nhãn có ngoặc
vuông — hình `thu-tu-kiem-quyen.html` có `[member · không thuộc workspace]` và `[owner · admin]` — mà
tràn thì chuỗi bị cắt giữa tên nhãn → `JSONDecodeError: Unterminated string`.

Hệ quả đo được: lỗi CHỈ nổ khi có ít nhất một nhãn tràn thật chứa `]`, nên đúng lúc bộ kiểm có điều
để báo thì nó vỡ và che mất phát hiện. Vỡ ồn ào (không xanh giả). Bản hình đã commit ở Cổng 1 của hồ
sơ gốc (`177a22d9`) chạy lại sạch, thoát 0 — bằng chứng của crm PR #133 không bị ảnh hưởng. Tái lập
tối thiểu: payload `[{"text":"[owner · admin]",…}]` → cắt ra `[{"text":"[owner · admin]` → cùng lỗi.

Quét cùng thư mục: `check_backs.py`, `check_label_occlusion.py`, `drawio_extract.py` không dùng giao
thức này — một chỗ duy nhất. Tật phụ cùng dòng 148: `.replace("&quot;", '"')` gần như vô tác dụng
(`--dump-dom` không mã hoá nháy trong nút chữ) trong khi `&`/`<` trong nhãn ra báo cáo thành `&amp;`/`&lt;`.

## Dạng nghiệm đúng tầng

Đọc đúng một giá trị JSON thay vì đoán điểm cắt: `json.JSONDecoder().raw_decode(payload)` (đo tay
25/09: đọc đúng nhãn `[owner · admin]`); giải mã thực thể HTML bằng `html.unescape` trước khi đọc.
Ma trận viết trước, commit ĐỎ trước vá: hình mẫu có nhãn chứa `]` cố ý tràn → trên bản hiện tại đỏ
ghim `Unterminated string`, sau vá liệt kê đúng nhãn đó; đối chứng dương: hình không tràn → xanh.

Mã vendor (`cathrynlavery/diagram-design` @ `da45d4a`, không nằm trong phần kit tự thêm) → vá là bản
vá cục bộ, phải ghi `diagram-design/skills/diagram-design/LOCAL-PATCHES.md` và nâng số `diagram-design`.
Chưa kiểm upstream đã tự vá chưa.

TRỪ (bớt một lần vỡ che phát hiện). Ngưỡng mở ô: lần vỡ thứ hai ở bất kỳ kho nào, hoặc owner gọi tên.
