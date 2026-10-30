# Hạt giống — tên trần đuôi kịch bản ở gốc kho: chân công cụ báo có, shell không chạy được

Gốc: `_acceptance/cong-cu-xet-tep-ton-tai/` — Ngoài-3 của lượt chấm 1, chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 29/10. Ô trích lại tên tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Một khoá executor mở đầu bằng tên tệp kịch bản trần nằm ở gốc kho (ví dụ `kiem-goc.js --x`) được chân công cụ của đường
nền báo XANH vì tệp có trên đĩa. Nhưng khi lệnh ấy chạy thẳng bằng shell, `bash` tra tên trần trên PATH chứ không tra thư
mục hiện tại, nên lệnh thoát 127. Người ký Cổng Phạm vi tin công cụ dùng được, rồi lệnh hỏng ở lượt chấm.

## Hướng

Tách hai trường hợp theo cách khoá được gọi: khoá chạy thẳng bằng shell thì tên trần chỉ xanh khi có trên PATH (hoặc có
`./`); khoá là một tay cầm mà người gọi tự ghép trình chạy (như `executors.design.ui_check`, gọi bằng `node <đường>`) thì
giữ luật xét tệp có tồn tại. Cần một ma trận viết trước cho cả hai cách gọi, kèm ca vi phân trên bộ khoá của các kho đã nhận.

## Vì sao chưa làm

Tiêu chí 1 của vòng `cong-cu-xet-tep-ton-tai` đã chốt rằng tên trần đuôi `.js`/`.mjs`/`.cjs` ở gốc kho là XANH — đổi điều
đó là đổi hợp đồng đã duyệt, và là đổi hành vi cho mọi kho đang ghim khoá dạng ấy; cần một vòng riêng.
