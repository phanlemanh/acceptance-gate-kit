# Hạt giống — ca GT-07 «tin tự đến» của gói điều phối đỏ chập chờn

Gốc: acceptance-gate-kit/_acceptance/moi-cong-khong-qua-nut/ — `review-findings.md` lượt chấm 2 (tệp
`_acceptance/config.yaml`, mục E9b vẫn đỏ chập chờn). Chủ kho chọn «lối 1» (thu phạm vi AC-9) ở Cổng Bằng chứng 19/10;
ô gốc trích lại tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Một lượt chấm hay một lượt CI chạy trọn bộ ca khung của gói điều phối có thể đỏ ở ca `GT-07 tin-tu-den`
(`tests/dieu-phoi/tin.test.mjs`) dù không ai chạm phần tin giữa các phiên. Đo 19/10 trên cùng một cây
(`7d393249`): người chấm lượt 2 chạy cùng lệnh hai lần — một lần `# fail 1` (chỉ GT-07), một lần `# fail 0`; lượt chấm 1
cũng đỏ ở bộ ca này mà đầu ra bị cắt nên không đọc được tên ca. Chạy riêng tệp ca thì xanh; ca mất khoảng 15 giây vì
chờ theo giờ. Hệ quả: vòng của kho khác (KY1) mất hai lượt chấm (~118 phút máy) cho một ca nó không chạm.

## Vì sao không vá trong vòng KY1

Ca thuộc phần tin giữa các phiên (hồ sơ GT1, vòng GT2 đang sửa cùng vùng); KY1 không chạm mã nào của gói điều phối, chỉ
chữ. Nguyên nhân chưa đo: có thể là chờ theo đồng hồ thật dưới tải, có thể là dùng chung trạng thái giữa hai lần chạy.

## Ngưỡng mở ô

≥ 1 lần nữa ca GT-07 đỏ ở CI nhánh chính hay ở một lượt chấm mà cây không chạm `dieu-phoi/scripts/tin*.mjs` hay
`tests/dieu-phoi/tin.test.mjs`.
