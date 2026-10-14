# Hạt giống — RT13 so bộ quét mốc cũ với cả hồ sơ sinh SAU mốc

Gốc: acceptance-gate-kit/_acceptance/nen-khong-tinh-tep-cua-vong/ — chữ ký Cổng Bằng chứng 14/10
(`e4b7d571`) làm RT13 đỏ «lệch cho-cong-gia-tri→da-giao-khong-do mà khối không khai»; gỡ tạm bằng một
dòng khai trong hợp đồng ĐÃ KÝ của `ra-co-ten-lam-va-trao` (dòng sổ `d-20261014T111319Z-41`, Điều phối
M5 chọn lối khai thay vì đổi thước sau chữ ký).

## Lớp

`tests/plugins/ra-co-ten.test.mjs` RT13(ii) chạy bộ quét của mốc `cb38ea01` và bộ quét hiện tại trên
CÙNG cây, rồi đòi mọi khác biệt trạng thái phải khai trong khối `KHAC-BIET-DOC-CU` của
`_acceptance/ra-co-ten-lam-va-trao/contract.md`. Phép so ấy có nghĩa cho hồ sơ CÓ TỪ mốc (đọc-cũ không
được đổi màu một hồ sơ cũ), nhưng cũng áp cho hồ sơ sinh sau mốc — mà bản cũ không biết luật sinh sau nó
(ở đây: ngưỡng «Không đo được» khai tại Cổng Đáng). Hệ quả: mọi hồ sơ mới khai «Không đo được» sẽ làm
RT13 đỏ, và lối gỡ duy nhất là sửa một hợp đồng đã ký rồi ghim lại hồ sơ ấy (~12′ lượt máy) — đúng lớp
«bất biến không được nằm trong hồ sơ đã ký».

## Hướng sửa (chưa làm)

RT13(ii) chỉ so hồ sơ có mặt ở cây tại mốc `cb38ea01` (`git ls-tree cb38ea01 _acceptance/`); hồ sơ sinh
sau mốc đi nhánh bản-mới-không-broken (vế i). Chiều đỏ giữ: hồ sơ có từ mốc đổi màu không khai vẫn đỏ;
chiều im: hồ sơ mới khai «Không đo được» im.

## Ngưỡng mở

Một hồ sơ mới nữa (ngoài `nen-khong-tinh-tep-cua-vong`) khai «Không đo được» rồi làm RT13 đỏ lúc ký.
