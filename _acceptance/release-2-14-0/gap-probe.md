---
slug: release-2-14-0
at: 2026-09-15T08:05:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

# Phản biện context sạch — release-2-14-0

Một tác tử tươi, context sạch, đọc năm đầu vào: hợp đồng · evals · răng mới `rang-ton-dong.sh`
· `usage-report.md` của vòng trong cửa sổ · bài học từ feature trước. Hai răng chép nguyên
thân từ mốc 2.13.0 không đưa vào tầm đọc.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Dòng 4 của bảng năm dòng không dựng lại được từ nguồn đã gọi tên và tự mâu thuẫn trong một ô: con số tuyệt đối lấy nền gồm cache_create, còn ba phần trăm chỉ ra đúng khi đổi sang nền của bảng vai trò, tức bỏ gần 9 phần trăm của chính con số vừa ghi; ánh xạ vai-trò sang khối cũng không khai, mà hai vai không nằm trong bảng kê của luật (c). | Hội đồng làm đúng việc AC-4 giao — kiểm hai dòng máy-đo khớp từng chữ số — cộng lại theo bảng kê của luật rồi ra số khác, phán FAIL và hồ sơ mốc trượt. Lối ra kia tệ hơn: hội đồng không dựng nổi mẫu số nên phán «hợp lý», cổng nuốt một bảng số mà lần sau không ai dựng lại được. | Khai NỀN của từng ô ngay trong cột nguồn rút, và khai ánh xạ vai-trò sang khối từng chữ; thêm ô tổng cả vòng cạnh ô lượt PASS. | fixed: tách thành dòng 4 (tuyệt đối, nền per-model, kèm tổng vòng) và dòng 4b (ba phần trăm, nền bảng vai trò, khai lệch 8,9 phần trăm và ánh xạ đầy đủ, nói rõ hai vai xếp vào đâu và vì sao) |
| P1 | evals | Giá trị của chính cái mốc — số phải là 2.14.0 — không răng nào đo. AC-1 chủ động loại nó, và không eval nào khác chạm; cũng không có phép so đơn điệu với số mốc trước, thứ máy suy được từ kho. | Bước nâng số bị quên: hai manifest vẫn nhất quán ở số cũ, GUIDE dẫn xuất đúng số cũ, cặp phụ thuộc khớp — toàn hồ sơ xanh và một bản phát hành ra cửa mang số cũ. Vật duy nhất chặn là mắt người trên thẻ, mà thẻ không có ô nào bắt so với mốc trước. | Thêm một vế đo QUAN HỆ chứ không đo giá trị: số ở cây phải lớn hơn theo semver số ở mốc suy từ kho, và in con số ấy ra dòng kết luận. | fixed: AC-1 thêm vế «số phải TĂNG» + răng `rang-so-tang.sh` + eval E1b. Bản ĐẦU của răng ấy xanh oan vì neo sai (so với «lần cắt gần nhất» thay vì với lúc hồ sơ ra đời) — đã sửa và thử cả hai chiều |
| P1 | rang-ton-dong | Mã thoát của lưới bị toán tử «hoặc-đúng» nuốt, và chốt «lưới còn sống» khớp một tiền tố xuất hiện trong mọi thông điệp kể cả dòng lỗi của chính lưới; nhánh thoát 2 mà đầu tệp khai là không tồn tại trong mã. | Cửa sổ sau đổi tên cờ hoặc mốc so không còn với tới được: lưới in dòng lỗi mang đúng tiền tố, thoát khác 0 nhưng bị nuốt, đếm được 0, hai số lệch nên răng báo mã 3 «số chép tay đã hoá cũ» — trong khi thật ra chưa đo gì. Chiều ngược lại đến khi chiến dịch chạy xong và số về 0: lưới hỏng, đếm 0, bằng nhau, PASS im lặng. | Bắt mã thoát vào biến và cho nhánh thoát riêng; đổi chốt sang dòng kết luận thật; thêm đối chứng dương «lưới đã soi ít nhất một hồ sơ». | fixed: mã 2 riêng cho lưới gãy, chốt đọc dòng kết luận, mã 6 cho đối chứng dương |
| P1 | contract | Bảng năm dòng ghi 4 lượt gọi người và tự nhận vượt trần, nhưng không đọc điều kiện thu hồi mà chính hiến pháp gắn vào đúng con số đó, cũng không nêu số của mốc trước để biết điều kiện đã chạm hay chưa. | Owner ký mốc mà không được cho biết điều kiện thu hồi có thể đã nổ; nếu mốc trước cũng vượt thì cổng phạm vi của mốc sau duyệt trên một luật đã hết hiệu lực từ mốc này. | Thêm dòng nêu số của mốc trước kèm nguồn, và phán một câu điều kiện đã chạm hay chưa; đưa vế ấy vào expected của eval judgment. | fixed: khối năm dòng nay nêu cả hai mốc đều vượt trần, kết luận điều kiện ĐÃ chạm theo số nhưng KHÔNG CÒN hiệu lực vì ADR 0018 bỏ nó — nói rõ để hồ sơ sau không đọc thành «chưa bao giờ chạm» |
| P2 | rang-ton-dong | Cặp số và mốc so không neo vào vật nào; răng đo trên cây làm việc mà không ghi lại cây đã đo; đếm dòng chứ không đếm hồ sơ; con số còn gõ lại hai lần ở văn xuôi nơi răng không đọc. | Dán nhầm một sha có thật nhưng sai cửa sổ thì cặp vẫn tự khớp và hồ sơ công bố tồn đọng của sai cửa sổ. Hoặc ai đó sửa ô marker mà quên hai chỗ văn xuôi — đúng bệnh «số chép tay» răng này sinh ra để chặn, tái sinh trong cùng một tệp. | Bắt mốc so phải giải được và là tổ tiên của HEAD; in HEAD và trạng thái cây vào dòng kết luận; đếm theo hồ sơ duy nhất; đối chiếu mọi lần con số xuất hiện trong hợp đồng với ô marker. | fixed: cả bốn. Chốt cuối lộ thêm một lỗi của chính răng — mẫu dùng ký tự biên sau chữ đa byte, dưới bash không khớp gì nên chốt xanh vĩnh viễn; đã bỏ ký tự biên và dựng chiều đỏ mã 7 |

## Một điều răng tự bắt được chính nó

Chốt «một nguồn» ở bản đầu dùng ký tự biên từ quanh cụm tiếng Việt. Dưới `zsh` nó khớp, dưới
`bash` — đường chạy thật của mọi executor — nó không khớp gì, nên chốt xanh vĩnh viễn vì chưa
bao giờ đo. Lộ ra đúng lúc dựng chiều đỏ cho nó. Đây là lý do luật bắt mọi phép đo mới phải
có cặp hai chiều trên cùng một fixture: màu xanh của một phép đo chưa-từng-đỏ không phân biệt
được «vật lành» với «thước chưa bao giờ chạy».
