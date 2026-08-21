# Gap-probe — lan-v-khong-phai-cho-ky (vòng hai, T3)

Phản biện context sạch, 21/08, trước Cổng Phạm vi. Đầu vào: contract · evals ·
design · sổ quyết định · bài học xuyên hồ sơ (claim-scan). Không đọc mã repo.

**VERDICT: findings** — 5 lỗ (3 P0, 2 P1). Tất cả đã xử trước khi trình cổng.

| # | Lỗ | Mức | Xử |
|---|---|---|---|
| F1 | Chiều đỏ của AC-2 không thể đỏ dưới chính ngả máy khuyên: bash *gọi* lib nên đột biến lib làm hai vế cùng đổi ⇒ phép so hằng-đúng | P0 | **fixed** — AC-2 viết lại: đo bash ↔ **bảng kỳ vọng viết tay** (độc lập cả hai bên) + đột biến ở **mối nối** (lớp vỏ bash parse `node -e`); Notes ghi rõ thước khác nhau theo ngả |
| F2 | «Đối chứng sống cho AC-5» ở AC-11 bị **quyết định thừa**: hồ sơ này trượt vì 3 lý do độc lập (T3 · draft · không bằng chứng), không chứng minh nhánh nào | P0 | **fixed** — bỏ lời tuyên, khai thẳng nó chỉ là ô âm chung; nhánh sạch-hay-chưa chứng minh ở E5 trên fixture code-sinh |
| F3 | Trụ an toàn của ngả (i) — suy biến **fail-CLOSED** khi thiếu node/lib — không có phép đo máy nào (chỉ một eval judgment). Sai hướng ⇒ fail-open ở **chính lưới trước-merge**, nặng hơn lỗi vòng một | P0 | **fixed** — thêm **AC-12** (chạy pre-merge với PATH không node / lib bị dời ⇒ phải VIOLATION kèm lý do, đối chứng dương cùng lượt) + trục F thêm nhánh «không đọc được nguồn luật» |
| F4 | AC-3 (đã giao ⇔ clean) mâu thuẫn AC-6 (da-veto không bao giờ đã giao) — hàm kỳ vọng 300 ô không có căn cứ chọn nhánh | P1 | **fixed** — AC-3 giới hạn vào nhánh `veto_state ≠ da-veto`, ghi **thứ tự nhánh tường minh**: da-veto → chữ ký → xanhSach |
| F5 | Design doc + sổ quyết định còn nguyên số liệu vòng một (T2 · 100 ô · 7 ca · «KHÔNG đặt vào lib/») mà chưa bị gạch; con trỏ chết AC-11→AC-10 trong Notes | P1 | **fixed** — thân design gắn nhãn *lịch sử vòng một* + trỏ nguồn đúng; entry sổ mới `supersedes: d-20260821T093623Z-29342`; con trỏ sửa về AC-10 |

**Bằng-chứng-thiếu mà phản biện nêu (bị cấm đọc mã) — máy kiểm hộ:** «bash hôm
nay xếp *mục VẮNG* là sạch hay không sạch?» → nhánh `__VANG__` của
`xanh_sach_check` đặt `clean_ok=0` («vắng ≠ rỗng»), nên AC-1 chép đúng ngữ nghĩa
đang chạy — **không siết**, không phạm mục Out-of-scope. Đã ghi vào contract.

**Lớp lỗi cũ tái xuất (claim-scan):** `cong-chan-nham-cho#F1` («làn V mở bằng
CHUỖI, không đo QUAN HỆ mo ⇔ xanh-sạch») — chính là lỗ vòng một, nay là lý do
vòng hai tồn tại. `veto-co-dau-vet#F2` (danh sách ĐÓNG thiếu một điều kiện) tái
xuất ở F3 dưới dạng «điều kiện đọc-được-nguồn không nằm trong danh sách nào».
