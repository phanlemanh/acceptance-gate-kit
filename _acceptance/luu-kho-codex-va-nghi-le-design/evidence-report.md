---
schema_version: 1
slug: luu-kho-codex-va-nghi-le-design
round: 1
verdict: REJECT
verified_commit: b82650af5ab0
---

# Trang bằng chứng — lưu kho harness song sinh và nghi lễ design

## Verdict: **REJECT** (vòng 1) — làn máy xanh, rà soát đối kháng ĐỎ

> **Đọc `review-findings.md` trước trang này.** Ba phiên chấm độc lập tìm ra:
> nhiều chân đo trong hồ sơ này **không sống** (chiều đỏ hằng-đúng, đối chứng
> dương chưa từng chạy, thông điệp xanh nói dối là đã có đối chứng), hai
> **khẳng định SAI** nằm trong vật phát đi cho repo tiêu thụ, và hai lần
> sửa-sau-Cổng-1 chưa khai. Làn máy 19/19 xanh vẫn đúng — nó xanh vì đo cái dễ
> hơn cái đã hứa.

Toàn bộ **19/19 phép đo máy XANH**, sổ chạy ghim đúng commit đang kiểm. Nhưng
verdict chưa được phép là ĐẠT: hợp đồng này đi qua S4 theo luật cũ, mà chặng
**rà soát đối kháng** (một context sạch đọc lại toàn bộ diff để tìm lỗi ngoài
tầm phép đo) chưa chạy. Ghi PENDING-JUDGMENT thay vì ĐẠT là có chủ ý — một
trang bằng chứng tuyên ĐẠT khi mới chạy nửa chặng chính là hình dạng
xanh-giả mà bộ kit này sinh ra để chặn.

**Hội đồng ba giám khảo KHÔNG ÁP DỤNG cho hồ sơ này — không phải bỏ quên.**
Hợp đồng có **0 phép đo loại phán-xét**: mọi lời hứa ở đây đều đo được bằng máy
(vật còn hay mất, băm nội dung có khớp mốc không, số ca có đúng đẳng thức
không). Hội đồng sinh ra để chấm những câu hỏi không có đáp án máy; ở đây không
có câu nào như thế. Ghi thẳng ra để người đọc sau không tưởng là chặng ấy bị
lược đi cho nhanh.

## Số đo

| Phép đo | Kết quả | Đẳng thức khai TRƯỚC |
|---|---|---|
| Bộ kiểm gói | **145/145 xanh** | `173 − 26 − 2` ✔ |
| Bộ kiểm luồng | **463/463 xanh** | `488 − 25` ✔ |
| Bộ kiểm script | **664/664 xanh** | `671 − 7` ✔ |
| Bộ kiểm hook | **54/54 xanh** | `54 → 54` (không chạm) ✔ |
| Bản đồ sản phẩm | khớp hồ sơ xưởng | — |
| Bộ răng đo sự-vắng-mặt | 13 chân + 6 chiều-đỏ, xanh trọn | — |

Cả bốn đẳng thức đều là **đẳng thức**, không phải sàn: một bộ kiểm bị chủ ý làm
teo mà đặt sàn `≥` thì lúc đỏ, đường thoát rẻ nhất là hạ sàn xuống mức vừa đo —
và phép đo mất đúng lý do nó tồn tại.

## Đường đảo

Mốc `truoc-luu-kho-2026-08` → commit `1df86adb7da1a013adad9a4c2f14cd62a4ac9c39`,
**đã có trên remote**, là **cha trực tiếp** của commit gỡ đầu tiên (quan hệ
tổ-tiên không được chấp nhận: nó cho phép chèn commit khác vào giữa). Hai ADR
ghim đúng sha đó kèm điều kiện mở lại. Đây là chân duy nhất biện minh cho việc
gỡ ~194 file, nên nó được đo bằng bốn vế riêng biệt.

## Sáu chiều đỏ đã chạy thật

Mỗi chiều dựng một bản sao có vật đã lưu kho chép ngược về, chạy lại **chính**
hàm kiểm, và đòi nó đỏ đúng thông điệp: tên mốc bịa · chép thư mục đã gỡ về ·
thêm lại một mục vào bản khai báo gói · tiêm tham chiếu ngoài vùng miễn trừ
(hai kiểu) · đổi một ký tự sha trong ADR · xoá một dòng của vật cấm-đụng · chép
lại một khoá cấu hình đã chết.

## Ngoài hợp đồng — việc của người quyết

1. **Một mẩu độ phủ bị bỏ.** Một ca kiểm chạy bộ sinh nằm trong hồ sơ đã ký;
   bộ sinh ấy ghim cứng bản chỉ dẫn của harness đã lưu kho. Ba đường đã cân, và
   đường được chọn là **xoá ca đó** thay vì viết lại bằng chứng của một hồ sơ đã
   có chữ ký. Lời hứa mà ca đó canh vẫn còn bảy ca khác canh.
2. **Phạm vi quét văn bản không gồm thư mục kiểm.** Ở đó «không còn con trỏ
   chết» được cưỡng chế bằng thứ mạnh hơn tìm-kiếm-chuỗi: bộ kiểm phải xanh và
   số ca phải khớp. Lập luận đầy đủ nằm trong chính bộ răng.
3. **Sửa-sau-Cổng-1 có dấu vết: sáu lần.** Ba lần chỉnh con số kỳ vọng (mỗi lần
   TRƯỚC một phép đo), một lần thêm vật bị gỡ sót, hai lần sửa định nghĩa phép
   đo bắt nhầm vật. Toàn bộ ghi trong nhật ký thi công kèm lý do.

## Giới hạn đã biết

- **Chạy lại nghiệm thu một hồ sơ cũ sẽ hỏng** ở những hồ sơ có phép đo trỏ
  khoá cấu hình đã chết. Đã khai từ Cổng 1, không migrate hàng loạt.
- **Một chân đo phụ thuộc mạng.** Chân «mốc đã lên remote» hỏi remote thật; hết
  ba lượt không hỏi được thì vẫn đỏ (không chứng minh được là đã đẩy thì không
  coi như đã đẩy) nhưng ghim rõ đó là lỗi đường truyền.
- **Bộ kiểm gói mất chiều đo hai-bản-chép.** Không còn bản dựng nào để so, nên
  luật «mọi bản chép phải khớp nguồn từng ký tự» thu về luật «đếm nguồn so với
  số khai trong bản luật, đúng hai hướng» — vốn là chân mạnh hơn.

## Việc còn lại trước khi mời ký

Chạy chặng rà soát đối kháng trên diff, rồi cập nhật verdict. Sau chữ ký: chạy
lại trọn bốn bộ kiểm trước khi đẩy.
