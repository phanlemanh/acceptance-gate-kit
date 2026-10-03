# Hạt giống — làn kiểm trước chữ ký chạy trước bước vẽ lại bản đồ

Gốc: `_acceptance/viec-ke-theo-plan/` — Cổng Bằng chứng 03/10, mục Ngoài-3 của
`review-findings.md` (vòng 5), owner định tuyến «mở hợp đồng mới». Theo luật 18/09, lối này ghi
hạt giống, KHÔNG tạo ô.

## Lỗ

Trong `commands/signoff.md`, bước 7b (làn máy trước chữ ký, `repin-lane.mjs … --skip-unchanged`)
chạy TRƯỚC khối `MAP-STAGE` ở bước 7c. Bước 7a vừa ghi `status: signed-off`, nên hồ sơ đổi ô trên
bản đồ. Khi làn chạy TRỌN — cây có tệp ngoài T1 đổi sau `verified_commit` — suite
`product_map --check` thấy bản đồ chưa vẽ lại và đỏ; luật làn nói không commit chữ ký, còn bước vẽ
lại lại nằm sau làn. Người ký bị kẹt.

Lỗ có từ trước vòng `viec-ke-theo-plan` ở dạng nặng hơn: bản cũ vẽ lại ở bước 6, TRƯỚC 7a, nên vừa
đỏ ở làn vừa commit một bản đồ lệch. Vòng đó gỡ được vế commit lệch, chưa gỡ vế làn.

## Hướng sửa rẻ nhất (chưa chốt)

Dời khối `MAP-STAGE` lên giữa 7a-bis và 7b. Phép đo thứ tự LT-16-thu-tu vẫn qua (khối vẫn đứng sau
mốc 7a). Thêm một ca chạy làn 7b TRỌN trên kho fixture có tệp ngoài T1 đổi sau pin, đòi làn xanh.

## Điều kiện mở ô

Có neo ngoài: một lần ký thật bị kẹt ở làn 7b vì bản đồ, hoặc owner gọi tên.
