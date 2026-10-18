# Hạt giống — đáp một yêu cầu kiểu cũ bằng lệnh `tin` báo thành công nhưng câu trả lời bị nuốt

Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/ — `review-findings.md` lượt chấm 2, mục Ngoài-7
(tệp `dieu-phoi/scripts/tin.mjs`, severity medium). Chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-10-19; theo
luật kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Ô gốc `_acceptance/vong-mo-co-chu-giu/` trích lại tệp này ở `## Notes`
của hợp đồng.

## Người dùng gặp gì

Sổ vòng mở liệt cả yêu cầu kiểu cũ (mã dạng `P1-7`). Đáp nó bằng `tin XONG` hay `tin NHẬN` được báo «thành công», nhưng
dòng ghi ra mang mã mà bộ đọc dòng đầu không nhận, nên câu trả lời không đến người hỏi và sổ vẫn báo còn mở. Người đáp
tưởng đã xong việc.

## Vì sao không vá trong vòng GT1

Yêu cầu kiểu cũ ngoài phạm vi đáp bằng `tin` (luật 26/09: hook chỉ xét vòng mở bằng `tin`). Nghiệm rẻ: `tin` chặn đáp
trên mã kiểu cũ, chỉ dẫn lệnh trả lời cũ — hoặc bộ đọc nhận mã kiểu cũ khi đáp; chọn lối nào là quyết định riêng.

## Ngưỡng mở ô

≥ 1 lần `tin XONG`/`tin NHẬN` trên mã kiểu cũ trong nơi chứa của một đợt thật.
