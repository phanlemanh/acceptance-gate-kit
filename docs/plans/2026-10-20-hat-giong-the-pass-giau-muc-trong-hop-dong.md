# Hạt giống KY3 — thẻ Cổng Bằng chứng khi PASS giấu mục trong hợp đồng mức vừa

Gốc: `acceptance-gate-kit/_acceptance/vong-mo-khong-mat-dau/` — lượt chấm 2 của GT2 (commit `90f0a62c`: «lượt chấm 2 PASS
— 11/11 eval, 12 suite xanh; 2 mục trong hợp đồng mức vừa và 5 mục ngoài hợp đồng chờ Cổng Bằng chứng»). Ô ghi hạt giống
này: `_acceptance/release-2-33-1/` (hồ sơ mốc 2.33.1 trích lại tên tệp ở `## Notes`).

## Người dùng gặp gì

Lượt chấm chỉ tự trả lại (REJECT) khi có mục trong hợp đồng mức NẶNG (`triageHighInContract` của
`feature-loop/workflows/acceptance-verify.js`). Mục trong hợp đồng mức VỪA để phán quyết là PASS, mà thẻ Cổng Bằng chứng
thì ghi «0 mục cần mắt người» — hai mục trong hợp đồng của GT2 lượt 2 không hiện ở đâu trên thẻ. Người ký chỉ thấy chúng
nếu tự đọc kết quả thô của lượt chấm. GT2 thấy vì phiên đọc `rejectFindings`, không phải vì thẻ.

## Vì sao chưa sửa

Lượt chấm 3 của GT2 không còn mục trong hợp đồng nào (commit `c62d6fbd`), nên chữ ký của GT2 không bị lệch. Lỗ nằm ở thẻ (`scripts/gate-card.js`, dòng
«Rà soát đối kháng: … mục cần mắt người») và luật định tuyến, không thuộc phạm vi GT2.

## Ngưỡng mở ô

≥ 1 lần một vòng được ký khi lượt chấm cuối còn mục trong hợp đồng mức vừa mà thẻ không hiện.
