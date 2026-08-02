---
schema_version: 1
feature: Hình chọn theo mặt phẳng, không theo định dạng — vá luật N5
slug: hinh-theo-mat-phang
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-02T01:00:55Z
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: hinh-theo-mat-phang

## Context

Luật N5 ("hình trước, chữ là chú thích") được thi hành bằng một khuôn ghim định
dạng `mermaid`. Ngay lượt đầu áp vào việc thật, một khối `mermaid` được dán vào
khung hội thoại — nơi không vẽ được mermaid — nên thứ người dùng nhận là một
khối mã, tệ hơn cả một cái bảng. Owner bắt tại chỗ.

Lớp lỗi: luật ghim ĐỊNH DẠNG trong khi điều cần ghim là KẾT QUẢ — người nhận có
nhìn thấy hình hay không. Feature này thay câu trả lời cứng bằng một bảng tra
theo mặt phẳng, và giữ nguyên phần ngưỡng kích hoạt vốn vẫn đúng.

Source input: prompt (`/feature-loop`) + quan sát trực tiếp của owner 2026-08-02.

## Criteria

- AC-1: Given bản luật ngôn ngữ mặt người, When rút khối giữa cặp marker `DECISION-DIAGRAM-SURFACES`, Then khối đó là một bảng tra có ít nhất ba hàng mặt phẳng, và ô cách-vẽ của MỌI hàng đặt tên một cơ chế vẽ cụ thể lấy từ danh sách đóng nằm ngay cạnh bảng.
- AC-2: Given bảng tra ở AC-1, When tìm hàng của khung hội thoại, Then hàng đó có mặt và được đánh dấu là lựa chọn mặc định.
- AC-3: Given bản luật, When rút khối giữa cặp marker `DECISION-PICTURE-TEST`, Then khối đó chứa phép thử một câu hỏi người nhận có nhìn thấy hình hay chưa, kèm trường hợp trượt nêu đích danh: dán khối mã vào một mặt phẳng thiếu bộ vẽ.
- AC-4: Given khối ví dụ giữa cặp marker `DECISION-DIAGRAM-TEMPLATE`, When đọc câu dẫn ngay trước nó, Then câu đó ghi rõ đây là ví dụ cho một mặt phẳng cụ thể, một trong các cách vẽ liệt kê ở bảng tra.
- AC-5: Given ngưỡng kích hoạt của N5 đang có, When đọc lại sau khi sửa, Then ngưỡng giữ nguyên nguyên văn — feature này đổi cách vẽ và giữ nguyên lúc phải vẽ.
- AC-6: Given khuôn câu-về-hình đặt một chỗ giữa cặp marker `LOOP-PICTURE-CLAUSE`, When so nó với vòng lặp tính năng ở cả hai harness, Then mỗi bản chứa khuôn đó KHỚP TỪNG KÝ TỰ — câu về hình có đúng một nguồn, mọi bản đều chép từ đó.
- AC-7: Given cây nguồn, loại đúng bốn vùng có tên và có lý do (`plugins/` là bản sinh máy của AC-9, `_acceptance/` là hồ sơ nghiệm thu, `tests/` là bên đo, và ruột công cụ `.git` `.claude` `node_modules` thuộc hạ tầng), When đếm cặp marker thật của `DECISION-DIAGRAM-SURFACES`, `DECISION-PICTURE-TEST` và `LOOP-PICTURE-CLAUSE`, Then mỗi cái đúng một cặp, và số đếm được in theo từng thư mục gốc kèm tổng.
- AC-8: Given hai gói đã đóng `plugins/acceptance-gate/` và `plugins/feature-loop-codex/`, When đi theo con trỏ tới bản luật ghi trong bản vòng lặp của từng gói rồi rút khối bảng tra, Then rút được khối đó từ bên trong gói — con trỏ giải tới tận vật được dùng.
- AC-9: Given nguồn đã sửa xong, When chạy `scripts/sync-plugin-packages.sh --check`, Then thoát 0 — mirror khớp nguồn.

## Coverage

Bài toán một chiều, phạm vi do owner chốt tại chỗ và đóng: đổi một câu trả lời
cứng thành một bảng tra. Không quét không gian AC bằng `morphological-scan` —
xem entry `descope` trong `decisions.jsonl`.

- Trục duy nhất — vật được giao: bảng tra | phép thử một câu | nhãn cho khối ví dụ | khuôn câu-về-hình | đóng gói [thước CE: quan sát trực tiếp của owner + cấu trúc bản luật đang có]
- Ô bổ sung do phản biện context sạch bắt: `vật × có marker riêng` (phép thử một câu và câu-về-hình trước đó không có marker nên buộc phải đo bằng tìm-chuỗi-toàn-file) và `vật × giải được trong gói đã đóng` — cả hai là lớp lỗi feature trước đã trả giá bốn vòng

## Out of scope

- **Đo hành vi thật lúc chạy** (agent có chọn đúng cách vẽ không): cùng giới hạn đã ghi ở feature trước, chờ pilot.
- **Thêm mặt phẳng thứ năm** chưa dùng tới: bảng liệt kê bốn mặt phẳng kit đang chạm; mở rộng khi có nhu cầu thật rẻ hơn đoán trước.
- **Đổi ngưỡng kích hoạt của N5**: ngưỡng đang đúng và đang cưỡng chế được, không đụng.
- **Sửa các hình đã vẽ trong kho** (5 sơ đồ trong `GUIDE.md`): chúng nằm ở mặt phẳng tài liệu và đang đúng.

> Out of scope = scope-truth (Gate 1 duyệt mục này).

## Notes

Feature này là bản vá cho `ngon-ngu-mat-nguoi` (ký 2026-08-01). Bốn vòng chấm
của feature đó đã trả giá để có vùng quét và cách đếm cặp marker trong `P93` —
feature này TÁI DÙNG, không dựng lại.
