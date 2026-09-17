# Hình tại điểm quyết định — thuoc-co-cua, Cổng Phạm vi

Máy kê từ artifact cuối S1: dòng sổ chờ seal · chỗ thiết kế lệch nguồn gốc · finding đẩy người quyết.
Không có dòng giả định nào trong Coverage; không finding nào của phản biện đẩy về người.

| Điểm | Đếm | Hình |
|---|---|---|
| Cắt sáu tiêu chí phần đuôi (sổ dòng 3) | 1 bước · 2 nhánh (giữ cắt · kéo lại từng mục) | cần hình — gộp vào `vong-ba-cho-chan` (vạch cắt nằm trên cùng dòng chảy) |
| Ba chỗ máy chặn mới trong một vòng: đường nền ở S1 · bộ sinh args trước mỗi lượt chấm · suite tuần tự trong lượt chấm (sổ dòng 4, 5) | 6 bước nối tiếp | cần hình — `vong-ba-cho-chan` |
| Trần nhát sửa thước: đếm → từ chối → ba lối → van (sổ dòng 5, 8) | 4 bước · 3 nhánh | cần hình — `tran-nhat-thuoc` |
| Xếp hàng trong workflow thay tệp khoá (sổ dòng 4) | dưới ngưỡng: 1 bước · 0 nhánh | — |
| Gộp hồ sơ draft bo-qua (sổ dòng 6) | dưới ngưỡng: 2 bước · 0 nhánh | — |
| Lớp thước từ ba tập sẵn có, không khoá config (sổ dòng 7) | dưới ngưỡng: 1 bước · 0 nhánh | — |
| Bỏ coverage-scan · bỏ đặc tả UX (sổ dòng 1, 2) | dưới ngưỡng: 0 bước · 0 nhánh | — |

## Đề bài `vong-ba-cho-chan`

Loại: dòng chảy ngang một làn (flowchart), khổ ngang. Nút theo thứ tự: «S1 mở vòng» → «Đường nền hạ
tầng: công cụ · suite tuần tự · lưới như CI · engine» → «Gói Cổng Phạm vi (người quyết, có khối Nền hạ
tầng)» → «S3 viết vật và thước — TDD tự do, không đếm» → «Bộ sinh args trước MỖI lượt chấm: bỏ ô khai
không-chạy · đếm nhát thước» → «Lượt chấm: lệnh eval song song · lệnh suite tuần tự» → «Thẻ Cổng Bằng
chứng: một dòng vật · thước · nhát». Ba nút mới của vòng (đường nền · bộ sinh args · lượt chấm) tô nhấn;
hai cổng người vẽ dạng cổng. Dưới dòng chảy vẽ MỘT vạch cắt ngang ghi «trong hợp đồng: 15 tiêu chí» phía
trên và «phần đuôi — 6 tiêu chí, owner kéo lại được» phía dưới, với sáu nhãn nhỏ: hai mục khuôn hợp đồng ·
W9 · W10 · tiền đề kiểm lại trước mỗi lượt chấm · khuôn đường đo cấp repo · khai tài nguyên và bộ xếp
hàng. AC liên quan: AC-1, AC-6 đến AC-9, AC-11 đến AC-13.

## Đề bài `tran-nhat-thuoc`

Loại: lưu đồ có rẽ nhánh, khổ dọc. Nút: «Hợp đồng sang implemented = mốc sàn» → «Mỗi commit sau mốc sàn»
→ thoi «chạm thước mà không chạm vật?» — không: «không đếm (commit lẫn ghi ô lẫn · commit hồ sơ bỏ qua)»;
có: «nhát +1» → thoi «nhát từ 3 trở lên?» — không: «sinh args, lượt chấm chạy»; có: «TỪ CHỐI sinh args —
máy dừng, ba lối» → ba nhánh: «khai giới hạn có tên» · «đổi cách đo» · «mở vòng có chủ ngữ là thước (một
dòng lệnh in sẵn)». Hai nhánh đầu nối về «dòng sổ “trần thước —” được commit = mốc sàn mới, đếm lại từ 0».
Ghi chú cạnh thoi thứ hai: «số của ba vòng đã ký gần nhất: 2 · 3 · 4». AC liên quan: AC-11, AC-12.

## Cách đọc

`vong-ba-cho-chan` — đọc trái sang phải là một vòng. Ba ô cam là ba chỗ máy chặn MỚI; hai ô có trụ đậm là
hai cổng người, không đổi. Vạch đứt ngang là nhát cắt của hợp đồng: trên vạch là 15 tiêu chí xin duyệt,
dưới vạch là sáu tiêu chí phần đuôi; mũi tên đứt đi lên là lối owner kéo từng mục lại ở Cổng Phạm vi.
Hình dựng bằng Chromium headless có sẵn trên máy vì máy thiếu module playwright của bộ xuất; nền đặc,
không trong suốt. Ba điểm nhấn thay vì hai của luật hình: cả ba cùng một nghĩa «chỗ chặn mới».

`tran-nhat-thuoc` — đọc trên xuống. Thoi thứ nhất quyết một commit có là nhát không; thoi thứ hai là
trần. Ô cam là chỗ máy DỪNG: không có tệp args thì không lượt chấm nào chạy. Lối 1 và lối 2 đi qua van —
một dòng sổ được commit — rồi đếm lại từ 0; lối 3 rời vòng bằng một dòng lệnh in sẵn. Số 2 · 3 · 4 là số
nhát của ba vòng đã ký gần nhất ở kho kit, đo 17/09. Hình có 12 nút, vượt ngân sách 9 của luật hình vì
từng nhánh là một lối ra owner phải thấy.
