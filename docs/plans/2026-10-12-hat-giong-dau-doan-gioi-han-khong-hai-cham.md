# Hạt giống — đầu đoạn giới hạn không dấu hai chấm, đứng một mình, bị đếm 0

Gốc: `_acceptance/dai-tom-tat-dem-dung-vi-sao-tron/` (Cổng Bằng chứng 12/10/2026 — Ngoài-6 trong
`review-findings.md`, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài
(ngưỡng ở cuối).

## Việc

Bộ đọc khối giới hạn của dải tóm tắt (`scripts/ho-so-tom-tat.cjs`) coi một đoạn văn ở `## Notes` mở bằng chữ giới
hạn mà KHÔNG có dấu «:» là tiêu đề trơn rồi đọc thân sau nó. Đoạn ấy đứng một mình — vd «Known limits — bộ đọc bỏ
qua bảng lồng trong Notes.», sau đó hết mục Notes hay tới tiêu đề — thì thân rỗng nên ô in «0 giới hạn đã biết»,
không cờ vàng (dòng đầu đoạn đã thuộc khối nên không tính là chỗ nhắc sai khuôn). Cùng câu dùng «:» thay «—» thì ô in
1; bộ đọc trước vòng cũng in 1. Bộ đếm độc lập của `tests/scripts/dai-tom-tat-sau-kho.mjs` có cùng điểm mù.

Hướng (chưa chốt): đầu đoạn không dấu «:» mà thân rỗng → coi chính đoạn là một giới hạn (như đầu đoạn mang câu),
hoặc nói «chưa đọc được»; kèm ca hai chiều trên ma trận DD và sửa bộ đếm độc lập cùng lượt.

## Ngưỡng mở ô

Một hồ sơ thật ở bất kỳ kho nào mang hình dạng này (đo bằng
`node tests/scripts/dai-tom-tat-sau-kho.mjs --hien-tai <kho>=<gốc>` cộng một phép quét đầu đoạn không «:» thân rỗng),
hoặc mốc phát hành kế tiếp sau mốc mang vòng `dai-tom-tat-dem-dung-vi-sao-tron` — cái nào tới trước. Đo 12/10 trên
sáu kho (661 hồ sơ): 0 hồ sơ dính.
