# ADR 0011 — Răng-hồ-sơ là lớp RẺ; bảo đảm dài hạn phải vào lưới thường trực ngay từ đầu

*2026-08-14 · Owner gạch **(b)** tại Cổng 1 hồ sơ `bai-hoc-do-luong-vao-engine`,
sau ba vòng rà soát đối kháng của `cat-hinh-thuc` (9 phiên, 41 lượt phá ghi lệnh,
luật dừng-vá bật hai lần).*

Mệnh đề `MEASURE-BIRTH-CLAUSE` cưỡng chế khuôn khai sinh phép đo cho case trong
**suite thường trực**, nhưng **răng-chết-theo-hồ-sơ** (`_acceptance/<slug>/<slug>-rang.sh`)
nằm ngoài vành đai ấy — và đó đúng là chỗ ba vòng chấm của `cat-hinh-thuc` chảy
máu: bốn lớp lỗi mới của tuần đều sinh trong bộ răng hồ sơ, không cái nào sinh
trong lưới thường trực. Hai đường đã cân và trình owner: **(a)** nâng bộ ghi sổ
và luật khai-sinh thành `lib/` dùng chung cho cả răng-hồ-sơ, đưa chúng vào trong
vành đai; **(b)** tuyên thẳng răng-hồ-sơ là **lớp RẺ, dùng-rồi-bỏ**, và mọi bảo
đảm DÀI HẠN phải vào lưới thường trực ngay từ lượt đầu. Owner gạch **(b)**, ba
căn cứ: (a) là trả tiền hạ tầng cho những script sinh ra để **chết khi merge**;
răng-hồ-sơ neo vào `origin/main` hoặc một mốc tạm nên sau merge nó tự vô nghĩa,
nâng nó thành `lib/` là kéo dài một thứ đáng chết; và `cat-hinh-thuc` **đã làm
đúng thế trên thực tế** ở vòng về đích — lint `LOP-PHUT`, hai chân
không-hứa-phút, hai neo dương của `P194` đều đi vào **thân ca sẵn có** của
`tests/plugins`, và chỉ những bảo đảm ấy còn sống sau merge.

Đánh đổi đã nhận, không giấu: (b) **không** làm răng-hồ-sơ tốt lên — nó vẫn là
lớp không ai canh, và bốn lớp lỗi của tuần vẫn có thể tái sinh ở đó nguyên vẹn.
Cái (b) mua được là một **luật phân loại rõ**: thứ gì phải đúng sau merge thì
không được nằm trong bộ răng hồ sơ, và người thi công biết điều đó **trước khi
viết**, thay vì phát hiện sau ba vòng chấm. Hệ quả cưỡng chế được ngay: hồ sơ
`bai-hoc-do-luong-vao-engine` **không có một khoá `executors.script.<slug>_rang`
nào** — mọi chân của nó đi vào thân `P177`/`P179` sẵn có, và đẳng thức 146 ca
được khai TRƯỚC để răng mới không mọc thành ca mới. Hệ quả chưa cưỡng chế được,
đã khai nợ trong hạt giống: lời tuyên (b) chưa vào chính `measure-birth.md` như
một câu của khuôn khai sinh — hồ sơ ấy đã cộng ba thứ vào cùng một bản chỉ dẫn,
món thứ tư hoãn sang vòng promote sau thay vì nong phạm vi một hồ sơ đang về
đích. Bằng chứng sống của chính đánh đổi này: bản khai bốn đẳng thức số ca từng
sống trong khối `SO-CA-KY-VONG` của `luu-kho-codex-va-nghi-le-design` — răng-hồ-sơ
— và nó **đã chết khi merge**; hôm nay không phép đo thường trực nào giữ bốn con
số ấy, và lỗ đó được ghi vào sổ known-limits kèm lệnh tái lập chứ không vá vội.
