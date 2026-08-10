# Thước đã đổi ở vòng sửa 2 — người ký xem trước khi ký

Đường A (owner chọn 10/08) buộc đổi chữ trong tiêu chí ĐÃ ký ở Cổng 1. Theo
luật đổi-thước-có-hợp-đồng, bản diff nằm ở đây để người ký **ký thước mới có
mắt**, không phải ký một phép đo đã âm thầm đổi.

Vì sao đổi: vòng chấm 2 phát hiện thẻ Cổng 2 in sẵn một câu duyệt-tất-cả
(«Ngoài-1 ghi Known limits; E9 Đạt; đồng ý cắt; phê hết quyết định treo; Ký»)
trong khi E9 là mục máy vừa tự khai "chưa chắc, cần mắt người". Máy viết sẵn
câu **trả lời** của người tại cổng là vòng qua chính khoá ADR 0002. Thước cũ
không cấm điều đó, nên thước phải đổi — theo hướng **siết**, không nới.

## Tiêu chí

| Mã | Trước | Sau |
|---|---|---|
| AC-1 | "…một dòng `Trả lời mẫu` gộp nằm trên MỘT dòng." | "…nằm trên MỘT dòng **ở dạng KHUÔN CÓ CHỖ TRỐNG — máy KHÔNG điền sẵn lựa chọn thay người**." |
| AC-2 | "…nêu đủ các mã/nhãn đang hiện **cùng dạng trả lời từng loại**." | "…nêu đủ các mã/nhãn đang hiện **ở dạng KHUÔN CÓ CHỖ TRỐNG (một chỗ trống mỗi mục) — máy KHÔNG điền sẵn verdict, đề xuất hay chữ đồng-ý/Ký thay người**." |
| AC-5 | "…so với **bốn bên chép** (vòng lặp hai harness, skill acceptance, lệnh thẻ), mỗi bên KHỚP TỪNG KÝ TỰ." | "…**sáu site nguồn** khai giữa marker `GATE-INVITE-SITES` **CỘNG mọi bản dựng dưới `plugins/` và overlay cùng đuôi đường dẫn được SUY ra từ mặt phẳng**; mọi lần xuất hiện KHỚP TỪNG KÝ TỰ **và bản dựng không thiếu bản chép nào so với nguồn**." |
| AC-6 | "khuôn khai đủ **BỐN** chuẩn" | "khuôn khai đủ **NĂM** chuẩn — thêm: **câu mẫu là KHUÔN DẠNG có chỗ trống, máy KHÔNG BAO GIỜ điền sẵn lựa chọn thay người**." |

AC-3, AC-4, AC-7 giữ nguyên từng chữ.

## Kỳ vọng của phép đo

| Eval | Siết thêm gì (so với bản ký ở Cổng 1) |
|---|---|
| E1 | fixture dùng kịch bản CHUNG + đối chứng fixture-mang-đúng-status · ma trận mục × vế (đếm trên TỪNG mục) · câu mẫu phải có `___` và CẤM chuỗi điền-sẵn · chốt mutant-phải-chạy-được |
| E2 | mã phải hiện ở PHẦN MỤC (assert cũ bị chính dòng mẫu thoả) · ≥5 chỗ trống · danh sách CẤM chuỗi điền-sẵn · quan hệ mã-hiện-trong-khối-được-trỏ · hai mutant |
| E5 | suy tập bản chép TỪ MẶT PHẲNG thay danh sách gõ tay · luật đếm bản-dựng-không-ít-hơn-nguồn · ba chiều đỏ (lệch-bản-thứ-2 · gỡ-sạch-overlay · mất-đúng-một-bản) |
| E6 | checker THẬT gọi lại được + ma trận 5 mutant (bỏ tautology `str.replace` của vòng 1) |

E3, E4, E7 siết bằng cùng lớp (kịch bản chung, quan hệ verdict→câu, ma trận vế)
nhưng **không đổi lời hứa**.

## Một mục minh bạch tự khai

Ở vòng chấm 2, tham số truyền cho bộ chấm mang phần kỳ vọng **chi tiết hơn**
văn trong `evals.yaml` lúc đó (chỉ siết thêm điều kiện phải đạt, không nới bất
kỳ điều gì). Từ vòng 3, hai bên đã đồng bộ: `evals.yaml` là bản đã cập nhật ở
trên và tham số truyền đi chép từ đó.
