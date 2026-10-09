# Hạt giống — eval mang sang chạy lại vì `run_id` rỗng tách cặp nguyên tử của tiêu chí nhiều tầng

Gốc: `_acceptance/doc-ghi-troi-mang-sang-run-id/` (lượt chấm 3 ngày 09/10/2026, Cổng Bằng chứng ký 09/10 —
Ngoài-3, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài (một lượt
chấm thật ở kho tiêu thụ vấp đúng lỗ).

## Lỗ

Vòng `doc-ghi-troi-mang-sang-run-id` thêm bộ lọc `ridHopLe(c.runId)` vào `carriedEvals` của
`feature-loop/workflows/acceptance-verify.js`: eval mang sang mà `run_id` rỗng sau khi bỏ nháy thì chạy lại. Luật
cặp nguyên tử (một thành viên của tiêu chí nhiều tầng chạy lại thì CẢ CẶP chạy lại) chỉ áp ở
`feature-loop/scripts/carry-plan.mjs`, và bước đó chạy TRƯỚC workflow, lấy `runId: prev.run_id` thô từ run-log.
Ca cụ thể: AC-X nhiều tầng có E1 và E2; run-log lượt trước của E1 mang `run_id` `""`, của E2 thì thật.
carry-plan mang cả hai sang; workflow loại E1 nên E1 chạy lại, còn E2 vẫn dùng kết quả cũ — tiêu chí được chấm
trên hai lượt không cùng thời điểm, và việc loại không có dòng log riêng.

## Hướng

Đưa cùng phép kiểm hợp lệ vào `carry-plan.mjs` (một hàm chung với `ridHopLe`, đặt trong khối có marker để bên
viết và bên đọc cùng rút): `run_id` rỗng sau khi bỏ nháy thì vào danh sách chạy lại kèm lý do, để bước cặp nguyên
tử thấy nó. Ca dương/đỏ: cặp E1 (rỗng) + E2 (thật) → cả hai chạy lại; đột biến gỡ phép kiểm ở carry-plan → E2
còn mang sang (đỏ, thông điệp ghim).

Ngưỡng mở ô: ≥1 lượt S4 ở kho tiêu thụ có tiêu chí nhiều tầng mà một thành viên mang sang với `run_id` rỗng.
