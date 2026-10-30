# ADR 0027 — Bốn chân của một quyết định của người: định vị · tác động · dự đoán kín · ký theo chính sách

2026-10-28 · CỘNG, chủ kho (Manh Phan) phê nguyên văn: «Ghi ADR bốn chân; chân định vị dựng trước trên khung đợt, kèm sửa
bộ đếm «cần anh».» Ghi từ phiên brainstorm đề bài #430, sau bốn nhận xét của chủ kho trong cùng phiên (28/10).

**Vì sao.** Chủ kho tự quan sát: ở Cổng Bằng chứng anh gần như luôn ký theo khuyến nghị — máy đã kiểm thì anh không kiểm lại,
nên chữ ký chỉ thêm thời gian chờ. Đo trên sổ quyết định của kho này (28/10): 179/179 hồ sơ đã ký mang phán quyết PASS; 81/135
lời ký ở Cổng Bằng chứng là «theo khuyến nghị / phê hết / đồng ý / câu gộp», phần lớn số còn lại là «xác nhận mục đã duyệt ở Cổng
Phạm vi»; tìm theo từ khoá chỉ thấy khoảng hai lần quyết khác khuyến nghị. Chỗ chủ kho thật sự thêm thông tin là mở ngân sách
(«sửa luôn trong vòng này»). Cùng dạng ở chỗ khác: duyệt kế hoạch thi công 9/10 lần chỉ «duyệt»; mốc phát hành ký lại điều đã
duyệt ở Cổng Phạm vi. Ngược chiều: 21 hồ sơ ghi «nhận ngưỡng máy đề xuất» ở Cổng Đáng — máy viết cả vật lẫn thước rồi người gật
— và dòng hiệu chuẩn thực tế mới `0 / 8` với 9 hồ sơ có trạng thái chạm thực tế. Ba lỗ đi kèm, đo cùng ngày: (i) 1 147 quyết định
ở Cổng Bằng chứng, 352 không ghi tác động, 310 ghi một câu mẫu lặp ≥ 5 lần nói máy cất mục vào đâu chứ không nói ai gặp gì;
(ii) 0 quyết định nào mang lời máy đoán trước chủ kho sẽ chọn gì; (iii) chủ kho mất bối cảnh khi ngủ dậy hay đổi máy, đổi phiên —
12/12 lời mời cổng của đợt design-floor 27/10 mở bằng mã trần không tên, 0/12 nói vì sao; thẻ Cổng Đáng đã rút từ 01/09; khung
trạng thái đợt in nguyên dòng gỡ lỗi của lệnh `xem` (khe máy, chữ không dấu, giờ UTC có mili-giây) và báo «cần anh 0» trong khi
phiên giám sát của một kho tiêu thụ đang chờ chủ kho xác nhận một chẩn đoán (28/10) — bộ đếm chỉ tính tệp chờ người của phiên thợ.

**Quyết định.** Mỗi chỗ người quyết được dựng bằng bốn chân, theo thứ tự phụ thuộc; đơn vị áp là **loại quyết định** (kiểu quyết
× mức lỗi × khó-đảo, theo khuôn kit định nghĩa, không theo từ vựng của một kho), không phải từng cổng — một cổng có thể vừa có
phần gật vừa có phần quyết thật.
1. **Định vị** — mọi lời mời gửi chủ kho mở bằng bốn dòng máy DỰNG từ hồ sơ, không soạn: *là gì* (tên bằng tiếng sản phẩm + một
   câu; mã đứng sau trong ngoặc) · *từ đâu ra* (`Gốc:` + ai đau) · *anh đã quyết gì về nó* (ý định, ngưỡng, ngày — đưa ý định tới
   Cổng Bằng chứng như bản neo 21/09 đòi) · *đổi gì từ lần anh nhìn cuối* (Cổng Đáng: «việc này mới»). Nhiều cổng chờ cùng lúc
   gom thành một trang đọc một lần ngồi.
2. **Tác động mỗi lối** — mỗi lối ra, không chỉ lối máy chọn, trả lời năm câu: ai gặp · gặp gì · khi nào · giá (giờ máy · lượt
   gọi người · đường đảo và giá đảo) · dấu hiệu sai mà thực tế sẽ báo. Mục máy tự quyết cũng in đủ năm câu, để cửa veto có nội dung.
3. **Dự đoán kín** — trước mỗi câu hỏi người, máy ghi và niêm lời đoán «chủ kho sẽ chọn X» trước khi trình; chiều đỏ nằm trong
   lịch sử như commit test đứng trước commit vật. Khớp khi người đã thấy khuyến nghị đo SỰ NỂ, không đo sự hiểu — nên với loại
   quyết đang được cân trao quyền, một phần nhỏ câu hỏi trình MÙ (không kèm khuyến nghị; không thêm lượt gọi).
4. **Ký theo chính sách** — loại quyết đạt ngưỡng (đề xuất: 10 câu mù liên tiếp khớp, 0 lệch) thì máy KHÔNG tự trao quyền mà soạn
   MỘT dòng luật để chủ kho ký một lần (ví dụ của chủ kho: «lỗi mức cao, sửa ngay rẻ hơn hợp đồng mới, không chạm khó-đảo → sửa
   ngay trong vòng»). Tự thu hồi khi một câu mù lệch hoặc thực tế báo đỏ (prod đỏ · revert · hồ sơ mở lại). **Khó-đảo không bao
   giờ trao.** Chốt «chữ quyết vẫn của người» (ADR 0002) đọc là: chữ ở dạng luật ký một lần thay cho gật từng mục; khoá
   model-invocation của bảy thao tác cổng người GIỮ NGUYÊN — cách máy áp luật mà không gọi `signoff` là câu hỏi thiết kế của
   vòng dựng chân 4, không quyết ở đây.

**Thứ tự dựng (chủ kho chốt định vị trước, trên khung đợt).** (a) Bộ đếm «cần anh» của gói điều phối đếm MỌI câu đang chờ chủ
kho, gồm câu do phiên giám sát đặt — ghi vào sổ chung bằng một kiểu riêng để Monitor của giám sát không tự đánh thức vì câu của
chính nó; đây là lỗi đúng-sai, đi trước. (b) Khung trạng thái đợt tách khỏi dòng `xem` (dòng `xem` giữ nguyên cho máy đọc) và mở
bằng khối định vị: mục tiêu đợt, tiến độ «xong / đang chấm / chờ / rảnh», «CẦN ANH: n — là gì — ở phiên nào», mỗi việc mang tên
từ tệp lộ trình, giờ địa phương tương đối. (c) Khối định vị trên mọi lời mời cổng; thẻ Cổng Đáng tối giản chỉ phần định vị — mở
lại làn thẻ đã rút 01/09 cần Cổng Phạm vi của chính vòng đó. (d) Tác động mỗi lối. (e) Dự đoán kín: chế độ bóng (chỉ ghi) → có
câu mù. (f) Ký theo chính sách. Loại quyết trao trước khi có đủ số: duyệt kế hoạch thi công khi kế hoạch không đổi hợp đồng, và
xác nhận lại ở mốc phát hành điều đã duyệt. Hai chỗ KHÔNG trao mà cần người nhiều hơn: ngưỡng ở Cổng Đáng (thêm tác động, không
trao) và đọc thực tế (lưới thay cho chữ ký chỉ sống khi N của dòng hiệu chuẩn tăng).

**Răng (không dặn bằng lời).** Lời mời thiếu khối định vị thì không gửi; dòng «là gì» chỉ có mã thì chặn; khung đếm 0 khi sổ còn
câu treo thì báo đỏ; câu tác động trùng nguyên văn câu khác trong cùng hồ sơ thì mục về «chưa được hỏi»; lời đoán có dấu thời gian
sau câu trả lời thì không tính. Hồ sơ và sổ cũ thiếu trường mới: đọc được, cờ vàng, không migrate hàng loạt.

**Đánh đổi.** Mỗi câu hỏi thêm một dòng đoán và năm câu tác động (token máy ↑ nhẹ); câu mù bắt chủ kho tự suy thay vì gật (chạm
↑ ở đúng câu đó); khung đợt đổi bề mặt cho mọi kho dùng gói điều phối — bộ đếm «cần anh» sẽ báo số lớn hơn hôm nay ở kho nào có
giám sát đặt câu trong chat; ai đang đọc dòng `xem` bằng máy không bị ảnh hưởng vì dòng đó giữ nguyên.

**Dự báo năm dòng (luật c).** Thời gian làm-xong→quyết-được ↓ (rõ nhất sau đêm) · lượt gọi người = ở (a)–(e), ↓ từ (f) · vòng bị
hạ tầng đốt lượt chấm = · token máy/vòng ↑ nhẹ · phút máy/lượt chấm =. Điều kiện tin cậy: đường verdict không đổi thành phần.

**Thời điểm.** (a)–(b) chạm bề mặt một kho tiêu thụ dùng hằng ngày nên mở như vòng của gói điều phối sau khi vòng
`vung-giao-viec-tu-cat-luot` gộp; (c)–(f) là việc kit sửa nghi thức của kit, chịu luật chiều rộng (b) — đi sau mốc kế tiếp được
một kho tiêu thụ nhận. Mỗi bước mở ô có dòng `Gốc:` như luật kho; ADR này là phê CỘNG, không thay Cổng Đáng của từng vòng.

**Đường đảo.** Hoàn lại PR của từng bước; luật ở chân 4 tự thu hồi theo dòng hiệu chuẩn và câu mù; kho tiêu thụ giữ bản kit cũ
tới khi nhận mốc.
