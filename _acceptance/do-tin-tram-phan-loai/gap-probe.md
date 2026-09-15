---
slug: do-tin-tram-phan-loai
at: 2026-09-15T01:25:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
claims_input: ok
---

# Phản biện context sạch — do-tin-tram-phan-loai

Một tác tử tươi, context sạch, đọc đúng năm đầu vào: design doc · contract · evals · sổ
quyết định · bài học từ feature trước (claim-scan). Không đọc hội thoại, không audit mã —
mã của vòng này chưa tồn tại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design + contract + evals | Mã đúc ở LƯỢT HỎI LẠI không được khai. Design chỉ nói gán mã theo thứ tự danh sách gửi đi, mà lượt hỏi lại gửi một danh sách CON. Không câu nào nói mã lượt 2 là mã cũ hay đúc lại. Trục B tách «lượt hỏi lại» thành giá trị riêng nhưng không AC nào phủ ô Trục-A × «lượt hỏi lại». | Thi công đúc lại mã cho tập con: phát hiện thứ ba của lượt 1 thành mã thứ nhất ở lượt 2. Lưới mã-lạ so với tập mã lượt 1 thấy hợp lệ nên gộp phân loại của phát hiện ba vào phát hiện một. Một phát hiện NGOÀI hợp đồng được gán nhãn trong hợp đồng, cờ hỏng false, lượt ký PASS sạch trên một phân loại SAI — im hoàn toàn, và mọi eval cũ vẫn xanh vì không ca nào cho lượt 2 trả mã. | AC mới: mã đúc MỘT lần cho cả trạm, lượt hỏi lại mang lại mã cũ; dòng trả về mang mã ngoài tập đang hỏi bị xử như mã lạ. Mutant bắt buộc: đúc lại mã ở lượt 2 phải ĐỎ. | fixed: thêm AC-9 và eval E9; design doc đã có câu «mã đi trong tải gửi» nay được AC ràng nghĩa |
| P0 | contract + evals | Không ca nào round-trip khớp LLM-viết → máy-đọc của CHÍNH cái mã. Mọi ca nuôi trạm bằng phản hồi dựng sẵn đúng khuôn bên ĐỌC. Không AC nào đòi tải GỬI ĐI thật mang mã, tên trường mã trùng nhau ở cả ba phía, hay phản hồi giả được rút từ tải gửi đi. CLAUDE.md đòi khuôn của khớp này đặt một chỗ có marker rồi test round-trip; lớp này đã cắn hai vòng trước. | Thi công quên chèn mã vào lời nhắc, hoặc lược đồ khai một tên trường còn bộ ghép đọc tên khác. Ca xanh hết vì fixture tự mang sẵn mã; mutant gỡ nhánh ghép-theo-mã vẫn đỏ đúng như hứa. Ship xong, tác tử thật không bao giờ trả mã, 100 phần trăm rơi về khoá cũ, trạm hỏng đúng 3 trên 6 lượt như trước, và không phép đo nào biết. | AC mới: số mã trong tải gửi đi bằng số phát hiện; tên trường rút từ một chỗ có marker; phản hồi giả sinh từ tải gửi đi thật trong chính lần chạy. Mutant: gỡ mã khỏi lời nhắc, hoặc đổi tên trường ở đúng một phía, phải ĐỎ. | fixed: thêm AC-10 và eval E10 |
| P1 | contract | AC-2 mâu thuẫn AC-4 về việc dòng bị chữ-ký-kiểm loại có kích hoạt lượt hỏi lại không. AC-2 nói cờ hỏng bật true ngay; design và AC-4 nói phát hiện chưa có dòng thì được hỏi lại — mà phát hiện bị loại vì chữ ký kiểm CHÍNH LÀ phát hiện chưa có dòng. | Hai lối đều trượt nghiệm thu. Thi công theo design thì ca AC-2 thấy có lượt hỏi lại và cờ hỏng false nên ĐỎ cho bản hiện thực ĐÚNG, mất một lượt chấm. Thi công theo AC-2 thì ca trôi tiêu đề mất hẳn đường cứu, nhát hỏi-lại chỉ còn cứu ca bỏ sót, dự báo dòng 3 tới 5 hụt mà cả hai eval đều xanh. | Viết lại vế Then của AC-2 nêu rõ hành vi lượt 2 cho nhánh này, và khai tương ứng trong Given của eval. Cùng nhát: nói rõ dòng mã-lạ là dòng THỪA hay dòng THAY. | fixed: AC-2 viết lại — phát hiện bị loại đi vào tập còn thiếu và được hỏi lại, cờ hỏng chỉ bật khi lượt 2 cũng không vá; AC-3 nói rõ dòng mã lạ là dòng THỪA |
| P1 | evals | Eval đường-cũ gộp BA chân vào một dòng PASS, eval fail-toward-human gộp HAI chân, mà mutant chỉ chạm một chân. Hai chân kia không có chiều đỏ nào. | Fixture của chân «tự khai không đọc được hợp đồng» dùng chuỗi khác chuỗi mã thật dò, hoặc bước dựng chân ấy ném lỗi bị nuốt, nên chân đó không bao giờ chạy tới assert — mà hai chân kia vẫn in dòng PASS duy nhất nên eval XANH. Đúng lớp assertion-âm-tính-một-mình: bắt-đúng-lỗi và chưa-bao-giờ-chạy cho cùng một màu, và nhánh cũ trôi mà AC dựng ra để giữ nó không thấy. | Một dòng PASS RIÊNG, văn khác nhau, cho mỗi chân; mỗi chân một mutant riêng và phải đỏ đúng dòng của chân ấy. | fixed: tách thành E6a, E6b, E8a, E8b, E8c — mỗi chân một khoá executor, một dòng kết luận, một mutant |
| P1 | contract + evals | AC về dòng sổ hứa một LỚP là «mọi bộ đọc bằng chứng đang chạy» nhưng eval đo bốn thể hiện chọn tay, không ma trận toàn phần; và run-log của nó là tệp dựng sẵn chứ không phải dòng do trạm THẬT ghi. | Có thêm một bộ đọc thứ năm đếm mọi dòng run-log thì nó đếm dòng triage thành một phát hiện giả, số của cửa sổ sau lệch, mà eval vẫn xanh vì chỉ soi bốn tên đã chọn. Và fixture dựng tay theo khuôn bên đọc thì trạm thật ghi trường lệch vẫn qua được, còn dòng THẬT làm bộ đọc vỡ ở mốc sau. | Đếm lớp bằng mã: liệt kê bộ đọc bằng phép quét suy từ vị trí tệp ca, assert số chạy bằng số quét được, in tên từng bộ. Và đầu vào là chính run-log do lần chạy của chân trước sinh ra. | fixed: AC-7 viết lại đòi ma trận toàn phần và round-trip; E7a nay ghi run-log ra tệp cho E7b dùng lại; E7b ghim mã 5 cho ca số-chạy-khác-số-quét-được |

## Một lỗ đã cân nhắc và LOẠI

Tác tử nêu thêm một mục P2 dưới ngưỡng và tự loại: vế «bước bác bỏ chỉ chạy trên phát hiện
trong hợp đồng» của AC-1 không nằm trong dòng kết luận của E1. Vế ấy đã được E4 ghim ở một
ca khác nên rủi ro duyệt-sai thấp. Giữ nguyên quyết định loại.
