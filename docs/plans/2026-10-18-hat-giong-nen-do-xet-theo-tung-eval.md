# Hạt giống — dòng nền đỏ xét kết cục theo cả hồ sơ, nên eval chập chờn vẫn được làm nền

Gốc: acceptance-gate-kit/_acceptance/ho-so-da-ky-giu-tuoi/ — `review-findings.md` lượt chấm 2, mục Ngoài-7
(tệp `lib/do-san-tren-nen.cjs`, severity medium). Chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-10-18;
theo luật kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Ô gốc `_acceptance/ho-so-da-ky-giu-tuoi/` trích lại tệp này ở
`## Notes` của hợp đồng.

## Người dùng gặp gì

Khi một hồ sơ có một mục đỏ thật do thay đổi và một mục khác đỏ chập chờn vì hạ tầng, mục chập chờn vẫn có thể được ghi
làm nền. Vòng sau gặp lại đúng lỗi chập chờn ấy được cho qua với nhãn «đỏ sẵn trên nền», trái luật «đỏ hạ tầng không
bao giờ làm nền».

## Vì sao không vá trong vòng K-A

Lớp hạ tầng được xét theo từng eval, còn `ket_cuc` của dòng nền xét theo cả hồ sơ (một hồ sơ một kết cục trên bảng —
quyết định S3 dòng `d-20261017T153039Z-20`). Sửa cần quyết lại cách ghi nền theo từng mục — đổi hình dạng dòng `nen-do`
mà các bên đọc (lưới trước-gộp, kiểm lại, thẻ, bản đồ) cùng rút — nên là một hợp đồng riêng.

## Ngưỡng mở ô

≥ 1 dòng nền `nen-do` trên một kho tiêu thụ mà một eval mang lớp hạ tầng (mã 127, chập chờn) nằm trong hồ sơ có
`ket_cuc` khác hạ tầng, và một vòng khác đã đi tiếp nhờ nhãn trên chính eval ấy.
