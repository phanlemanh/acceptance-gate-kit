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

Toàn bộ **19/19 phép đo máy XANH** và cả bốn đẳng thức số ca đều khớp con số
khai trước. Rà soát đối kháng đã chạy và cho thấy **màu xanh đó không đủ**: một
phần đáng kể các chân đo không phân biệt được cây lành với cây hỏng.

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

## Chiều đỏ — sửa lại theo rà soát

Bản trước của trang này viết «Sáu chiều đỏ đã chạy thật» rồi liệt kê **tám**
món. Rà soát đối kháng đếm lại: script in **chín** dòng đột-biến, số thật sự đi
qua một hàm kiểm là **6–7**, và ít nhất hai món (`E5`, `E10`) **không chạy** —
chúng chỉ in một câu ở thì tương lai («lưới trên *sẽ* ĐỎ»). Một chiều khác
(`E10`) còn là hằng-đúng: nó `grep` tìm chính chuỗi vừa tự ghi ra, và chuỗi ấy
vốn đã có sẵn trong một dòng chú thích.

Danh sách chiều đỏ **thật sự** đi qua hàm kiểm, cùng những chỗ phải dựng lại,
nằm ở mục B của `review-findings.md`.

## Ngoài hợp đồng — việc của người quyết

1. **Một mẩu độ phủ bị bỏ.** Một ca kiểm chạy bộ sinh nằm trong hồ sơ đã ký;
   bộ sinh ấy ghim cứng bản chỉ dẫn của harness đã lưu kho. Ba đường đã cân, và
   đường được chọn là **xoá ca đó** thay vì viết lại bằng chứng của một hồ sơ đã
   có chữ ký. Lời hứa mà ca đó canh vẫn còn bảy ca khác canh.
2. **Phạm vi quét văn bản không gồm thư mục kiểm.** Ở đó «không còn con trỏ
   chết» được cưỡng chế bằng thứ mạnh hơn tìm-kiếm-chuỗi: bộ kiểm phải xanh và
   số ca phải khớp. Lập luận đầy đủ nằm trong chính bộ răng.
3. **Sửa-sau-Cổng-1: sáu lần ĐÃ khai, và rà soát tìm thêm HAI lần CHƯA khai.**
   Sáu lần đã khai gồm ba lần chỉnh con số kỳ vọng (mỗi lần TRƯỚC một phép đo),
   một lần thêm vật bị gỡ sót, hai lần sửa định nghĩa phép đo bắt nhầm vật.
   Hai lần chưa khai — mảng từ khoá co từ 11 xuống 8, và phạm vi quét bỏ thư
   mục kiểm — lý do chỉ nằm trong chú thích của script, đúng cái tội mà chính
   hồ sơ này đang đi tuần. Xem mục C của `review-findings.md`.

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

Vòng sửa 1: chữa hai **khẳng định sai trong vật phát đi** (mục A) trước tiên —
đó là thứ duy nhất đã rời khỏi kho và tới tay người đọc khác. Rồi dựng lại các
chân đo không sống (mục B), khai hai lần sửa-sau-cổng còn thiếu (mục C), và
quyết bốn mục ngoài-hợp-đồng (mục E) — trong đó **bump phiên bản** là mục có
hậu quả ngay với đội đang cài.

Sau khi sửa: chạy lại trọn bốn bộ kiểm + bộ răng, rồi rà soát đối kháng vòng 2.
