---
slug: release-2-15-0
at: 2026-09-17T01:40:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
claims_input: ok
---

# Phản biện context sạch — release-2-15-0

Một tác tử tươi, context sạch, đọc năm đầu vào: hợp đồng · evals · sổ quyết định · finding
bối cảnh trước và sau R (thay design doc) · bài học từ feature trước. Không đọc code.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E11 đưa cho hội đồng những con số tự mâu thuẫn trong inputs: hợp đồng ghi 147,77 M so 145,9 M và chuỗi lượt gọi người kết thúc ở 8, còn finding bối cảnh ghi 142 M so 146 M và kết thúc ở 7; số 145,9 M lấy từ hợp đồng mốc 2.14.0 mà tệp ấy không nằm trong inputs. | Hội đồng thấy 142 nhỏ hơn 146 tức R1 rẻ hơn, trái câu «không rẻ hơn», và E11 cấm tính lại ngoài bốn phép — hoặc REJECT oan, hoặc PASS một câu bất lợi không kiểm được. | Thêm hợp đồng mốc 2.14.0 vào inputs; giải thích hai lệch; nâng phép so cùng nền thành phép đối chiếu thứ năm. | fixed: inputs thêm hợp đồng 2.14.0; Notes §1 có đoạn «Hai con số khác với finding bối cảnh» — 142,27 M là nền bảng vai trò, 145,93 M là nền per-model, cùng nền thì 147,77 so 145,93; 7 là trước chữ ký, 8 là sau; AC-11 và E11 thành NĂM phép đối chiếu |
| P1 | contract | Notes §2 khai «lớp vendored không đổi tệp nào» mà không AC hay eval nào đo; neo được khẳng định bằng sha gõ tay. | Một commit trong cửa sổ chạm tệp của danh sách chép; mốc vẫn PASS với lời hứa «không phải chép lại», CI của repo tiêu thụ trôi lặng. | Eval rút danh sách từ khối INIT-CI-COPY-LIST, neo suy từ kho, git diff trên danh sách; phá thử phải đỏ gọi tên tệp. | fixed: AC-12 vế (a) + `rang-cua-so.mjs --chan vendored` + E12a; neo = lần cắt số trước suy từ kho; đối chứng dương cửa sổ toàn kho không rỗng; phá thử một dòng vào lib/md-section.cjs → mã 3 gọi đúng tệp |
| P1 | contract | Trục việc-đã-vào-cửa-sổ tự khai «liệt kê đóng» mà không thước máy; AC-9 chỉ đo trên fixture. [d-20260916T004927Z-4] cho thấy một hồ sơ có quyết định S1 sau chữ ký 2.14.0. | Nếu hồ sơ ấy sinh sau mốc, cửa sổ có thêm một việc meta; bảng năm dòng thiếu một cột và luật (b) bị đếm sai; Cổng Phạm vi duyệt một danh sách đóng sai. | Chân chạy trên cây thật: liệt kê mọi contract.md không có ở commit cắt 2.14.0, so bảng Context, lệch thì đỏ gọi tên. | fixed — và phát hiện ĐÚNG: `guide-chep-ci-buoc-vao-writer` là một vòng meta đã ký 16/09 09:17, trước commit chốt R, mà cả hồ sơ lẫn finding bối cảnh bỏ sót. Context thêm vòng ấy và khối VIEC-META-CUA-SO; AC-12 vế (b) + `rang-cua-so.mjs --chan viec-meta` + E12b; bảng năm dòng thêm cột; Notes §1 và §3 nói thẳng |
| P2 | evals | E7b đo chiều im trên worktree tại HEAD nhưng không đòi cây chấm sạch, không ghim sha. [release-2-13-0#F1] | Tệp ca mới và thay đổi start-scan còn ngoài commit lúc chấm; worktree tại HEAD không mang chúng, E7b báo 0 tệp bị chạm trên một phiên bản khác vật đang chấm. | Răng dừng mã 2 khi cây chấm bẩn ngoài thư mục lượt chạy; expected ghim sha8 bằng HEAD của lượt. | fixed: `rang-chup-cay-that.mjs` dừng mã 2 gọi tên tệp chưa commit ngoài _acceptance/ và thư mục lượt chạy — thử thật trên cây chưa commit bước nâng số → mã 2; E7b ghim sha8 bằng HEAD của lượt |
| P2 | contract | Trường serves của hai dòng sổ đầu còn trỏ số tiêu chí cũ sau khi đánh số lại năm lên mười một. | Thẻ Cổng Phạm vi xếp quyết định về khoá vat-da-o-nhanh-goc dưới AC-1 cắt số và AC-4 độ đặc hiệu; rủi ro «đóng theo quan sát chưa có trạng thái» không hiện cạnh AC-3 và AC-6. | Một dòng sổ sửa serves; kiểm chéo mọi quyết định về khoá ấy thuộc AC-3 đến AC-6. | fixed: dòng sổ d-…-8 ghi ánh xạ mới (dòng 1 → AC-3, AC-6 · dòng 2 → AC-3); sổ chỉ nối thêm, không sửa dòng cũ |
