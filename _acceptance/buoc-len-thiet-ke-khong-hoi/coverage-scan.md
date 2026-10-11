# Quét không gian tiêu chí — buoc-len-thiet-ke-khong-hoi (11/10)

## Ngữ cảnh
- Sản phẩm: bộ kit nghiệm thu — bước thiết kế (S1) của vòng feature-loop, sổ quyết định, thẻ Cổng Phạm vi.
- Chân sản phẩm: [SUY-TỪ-REPO: CLAUDE.md] luật «Lời mời cổng chỉ chứa ĐIỀU-CHỈ-NGƯỜI-BIẾT» (năm loại theo nguồn căn cứ) · [SUY-TỪ-REPO: feature-loop/skills/feature-loop/SKILL.md] S1#1 dạy máy hỏi-đáp và xin duyệt thiết kế; khối TRONG-DOT đã bỏ việc đó trong đợt · [SUY-TỪ-REPO: _acceptance/buoc-len-thiet-ke-khong-hoi/do-11-10/so-s1-crm.md] 51 lựa chọn chủ kho trả lời ở S1.
- Chân ngành: [NGÀNH: Architecture Decision Records (Nygard) — mỗi quyết định ghi bối cảnh + căn cứ + hệ quả] · [NGÀNH: RACI — tách «ai quyết» khỏi «ai được báo»] — cả hai chỉ làm thước CE cho trục «mặt đọc» và «con trỏ căn cứ», không là nguồn sinh chính (bài toán nội bộ kit).

Preset test-matrix (nền tảng · vai · dữ liệu · mạng) không khớp — trục tự dựng theo B1.

## Trục
- **A. Nguồn căn cứ của một lựa chọn S1:** mục tiêu + quy tắc đã khai | chỉ một lối ra sống | chỉ người có | vắng (dòng đời trước) | giá trị lạ. [thước CE: luật lời mời 01/09 + 51 dòng sổ crm đã xếp — mỗi dòng rơi đúng một giá trị]
- **B. Khó-đảo:** không | có. [thước CE: danh sách khó-đảo của bất biến dừng — ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho]
- **C. Con trỏ căn cứ (chỉ áp khi A = mục tiêu + quy tắc):** hợp lệ | thiếu | tệp vắng | câu trích không có trong tệp | trỏ vào vật của chính vòng (tự biện minh) | câu trích chỉ có trong nhánh, không có ở gốc. [thước CE: lớp lỗi «ô tự biện minh» của luật neo ngoài; «thước ghim vào thứ sẽ đổi»]
- **D. Mặt đọc:** thẻ Cổng Phạm vi | quyết định đi-tiếp/dừng ở Cổng Phạm vi | bộ kiểm sổ | phản biện context sạch. [thước CE: RACI — mỗi mặt trả lời một câu khác nhau]

## Không gian (lát theo A)
| A | B | C | Có nghĩa? | Mức |
|---|---|---|---|---|
| mục tiêu | không | hợp lệ | máy đã quyết, hiện câu trích | Core |
| mục tiêu | không | thiếu / tệp vắng / câu trích không có / tự biện minh / chỉ có trong nhánh | đỏ có tên (5 ô) | Core |
| mục tiêu | có | — | đỏ: khó-đảo luôn là câu hỏi | Core |
| một lối ra | không | (lối đã chết có / vắng) | đã quyết / đỏ | Core |
| một lối ra | có | — | đỏ | Core |
| chỉ người có | không/có | — | câu hỏi lên thẻ (khuyến nghị + lối khác + giá đổi); thiếu khuyến nghị → đỏ | Core |
| vắng | — | — | đọc được, cờ vàng, không đỏ | Core (chiều im) |
| giá trị lạ | — | — | đỏ (không tự coi là «máy đã quyết») | Core |
| mọi ô | — | — | × D: thẻ / đi-tiếp-dừng / bộ kiểm / phản biện | Core ở thẻ + đi-tiếp-dừng + bộ kiểm; phản biện = câu thêm vào lời dặn |

Core = 1 lát mỗi giá trị A × mặt đọc chính; các ô C gom thành MỘT ma trận trong một tiêu chí (so bằng nhau, không đếm dấu).

## Later
- Câu gộp ở lệnh duyệt nhận «duyệt; Hỏi-n = lối B» để áp lối khác không cần ký lại — đo trước xem người chọn khác khuyến nghị bao lâu một lần.
- Cổng chặn gộp kiểm sổ S1 (lõi cưỡng chế) — thẻ + đi-tiếp/dừng đủ cho vòng này; mở khi có một dòng đỏ lọt tới lúc gộp.
- Bộ đếm lượt hỏi giữa S1 thành lệnh của kit — vòng này dùng công cụ đo trong hồ sơ.
- Khối trong đợt (DP7) gom câu chỉ-người-biết về Cổng Phạm vi thay vì gửi yêu cầu giữa S1 — của máy M5.
- Đánh giá bộ phân loại bằng gọi model thật — của hàng G3.

## Never
- Bỏ hỏi toàn bộ — 23/51 lựa chọn là câu thật, người trả lời khác máy ở 8/8 câu loại này.
- Sửa skill brainstorming bên thứ ba.
- Danh sách chủ đề «luôn hỏi người» làm bộ phân loại duy nhất — danh sách trên không gian mở luôn sót; khó-đảo giữ danh sách ĐÓNG đã có.

## Cross-cutting áp mọi ô Core
- Hồ sơ đã ký không đổi màu (chạy bộ kiểm trên mọi hồ sơ hiện có của kit: 0 đỏ mới).
- Kho chưa nâng bản (dòng không có trường nguồn) chỉ thấy cờ vàng.
- Khối TRONG-DOT giữ nguyên từng byte.
- Không thêm lượt gọi người: câu chỉ-người-biết đi cùng chữ duyệt Cổng Phạm vi.
