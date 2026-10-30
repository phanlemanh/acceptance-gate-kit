# Hạt giống — hai khoá S4 mỗi máy

Gốc: acceptance-gate-kit/_acceptance/suc-khoe-cho-trong-va-toc-do/ — vế sau trong lời báo của M5 trên crm-onehub#375
(20/10 22:42Z). Vòng SK1 chỉ sửa thước sức khoẻ; vế này là CỘNG (thêm sức chứa cho bộ phát lịch) nên theo luật kho không
tự đi, và ô `_acceptance/suc-khoe-cho-trong-va-toc-do/` trích lại tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Mỗi máy chỉ chạy một lượt chấm S4 một lúc. Khi nhiều phiên cùng xong việc, các lượt chấm xếp hàng, và giờ lịch từ
làm-xong tới quyết-được dài ra theo độ dài hàng chờ, dù máy còn chỗ.

## Vì sao không làm trong vòng SK1

Mở khoá thứ hai đã bị bác 16/10 vì rủi ro tự dối: hai lượt chấm song song chung cơ sở dữ liệu, cổng và kho đo cố định,
và đột biến tại chỗ của lượt này lọt vào lượt kia — một lượt đỏ oan hay xanh oan mà không vì vật. Mở khoá trước khi
thước sức khoẻ đúng thì không phân biệt được «đỏ vì máy chật» với «đỏ vì lượt kia».

## Ngưỡng mở ô (điều kiện M5 nêu, cả ba theo thứ tự)

1. Cô lập theo worktree: cơ sở dữ liệu, cổng và kho đo riêng cho từng lượt; đột biến chạy ở worktree tạm, không tại
   chỗ. M5 ước 3–5 giờ máy.
2. Thước sức khoẻ của SK1 đã gộp và ở trong một mốc kho tiêu thụ đã nhận.
3. Thử N cặp S4 song song trên một commit đã xanh: đỏ oan = 0 và tổng giờ lịch giảm. Chỉ khi đạt cả hai mới đặt khoá 2.

Đường đảo: đặt khoá về 1.
