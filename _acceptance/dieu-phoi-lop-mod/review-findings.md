# Review findings: dieu-phoi-lop-mod

Round 2, verified_commit 9f4a329d46d79550e651358b59c44ff3c8610124.

## Trong hợp đồng

- **Luật heredoc mở lối lọt mới: dòng mở có chuyển hướng (2>&1, > log) làm bash/node đọc stdin bị coi là 'có tệp script'**
  file: `dieu-phoi/scripts/phan-loai-s4.mjs:157`
  severity: high
  AC: AC-2
  source: bugs
  detail: Trong doThongDich, mọi đối số của bash/sh/zsh không bắt đầu bằng '-'/'+' đều bị coi là tệp script (dòng 157: `else if (!a.startsWith('-') && !a.startsWith('+')) { doc = null; break; }`). Nhánh node cũng vậy (dòng 170/172: từ đầu tiên không phải cờ thì dừng, và chỉ nhận khi từ đó là '-'). Từ chuyển hướng không được loại ra, và tachDoan còn cắt `2>&1` ở dấu `&`, nên `bash` nhận đối số `2>`. Kết quả: thân heredoc bị coi là dữ liệu, dù shell thật vẫn chạy nó. Đã chạy để kiểm (cột merge-base → bản mới): `bash <<'EOF' 2>&1 | tail -20\nnode x/repin-lane.mjs --write\nEOF` s4 → null (tachDoan ra [["bash","2>"],["1"],["tail","-20"]]); `bash > /tmp/log 2>&1 <<'EOF'…` s4 → null; `bash <<'EOF' >/tmp/log…` s4 → null; `timeout 900 bash <<'EOF' 2>&1 | tail -5…` s4 → null; `node --input-type=module <<'EOF' 2>&1 | tail\nimport('./repin-lane.mjs')…` s4 → null; `node - <<'EOF' > out.txt…` s4 → null. Bash thật chạy thân của dạng đầu tiên: đã in RAN từ một repin-lane.mjs giả. Hook chặn S4 gọi thẳng phanLoaiLenh (hook-chan-s4.mjs:66, :123), nên các lệnh S4 này đi qua hook mà merge-base từng chặn. Điều này trái AC-2 («luật heredoc không mở lối lọt mới»). README cũng khẳng định thân đưa cho `bash &lt;&lt;EOF` / `node &lt;&lt;EOF` «vẫn bị chặn». Dạng `… 2>&1 | tail -N` là dạng phổ biến nhất của phiên Claude: chính hai lời gọi thật trong tệp ca đều có `2>&1 | tail`. Ma trận khong-lot 15 ô không có ô nào mang chuyển hướng trên dòng mở, nên lỗi lọt qua. Cách sửa: trong doThongDich bỏ qua từ chuyển hướng (từ khớp /^\d*[<>]/ cùng đích của nó, hoặc phần còn lại sau khi cắt `>&`). Thêm các ô `bash &lt;&lt;'EOF' 2>&1 | tail`, `bash > log 2>&1 &lt;&lt;EOF`, `node - &lt;&lt;'EOF' > out` vào MA_TRAN_KHONG_LOT.
  rationale: AC-2 nêu đích danh «luật heredoc không mở lối lọt mới» và liệt kê `bash &lt;&lt;…` / `node` không tệp script trong ma trận chống lọt; finding chứng minh một biến thể phổ biến của chính các ô đó (thêm chuyển hướng trên dòng mở) bị chặn ở merge-base nhưng lọt ở bản mới.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bản vá «cờ mang giá trị của shell» chỉ sửa một trong hai bộ đọc argv bash cùng tệp; `bash -o pipefail -c '<S4>'` vẫn lọt**
  Người dùng thấy gì: Nếu lệnh chạy kiểm định S4 được gõ qua bash kèm tuỳ chọn như pipefail, chốt chặn không nhận ra nó, nên hai dãy việc vẫn có thể chạy S4 cùng lúc dù một dãy đang giữ lượt. Lỗi này có từ trước vòng này, không phải do vòng này gây ra.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cổng «bỏ qua» của ca nguồn chép lại cách rút đường của rut(), và fixture dựng theo khuôn bên đọc**
  Người dùng thấy gì: Nếu sau này cách tìm bản ghi hội thoại thay đổi, bài kiểm thử có thể báo «bỏ qua» sai hoặc báo lỗi không đúng chỗ. Sản phẩm hiện tại vẫn đúng; hậu quả chỉ là bài kiểm thử kém tin cậy hơn ở lần sửa sau.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Cùng lớp với lượt sửa R1 mà chưa vá: phanLoaiTu coi giá trị của -o/-O/--rcfile là tệp script, nên `bash -o pipefail -c '…'` lọt**
  Người dùng thấy gì: Một số cách gõ lệnh chạy kiểm định S4 qua bash kèm tuỳ chọn (ví dụ pipefail) vẫn đi qua chốt chặn, nên có thể có hai dãy chạy S4 trùng nhau mà không bị cản. Đây là chỗ hở có sẵn từ trước, vòng này chưa đóng nó.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Dấu đóng heredoc có nháy chứa dấu cách làm lệch trạng thái nháy và nuốt phần còn lại của lệnh**
  Người dùng thấy gì: Với một kiểu viết khối lệnh rất hiếm (dấu kết thúc có chứa khoảng trắng), chốt chặn đọc sai và bỏ sót lệnh chạy S4 nằm phía sau, nên lệnh đó đi qua dù một dãy khác đang giữ lượt. Rất ít gặp trong thực tế.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **doThongDich bỏ qua `env -S '<shell>'`, nên thân heredoc đưa cho shell qua env -S thành dữ liệu**
  Người dùng thấy gì: Khi nội dung lệnh được đưa cho một shell thông qua lớp bọc đặc biệt của env, chốt chặn coi nội dung đó là dữ liệu và không chặn, dù shell vẫn chạy nó. Trường hợp này rất hiếm, hậu quả là một lệnh S4 có thể chạy trong lúc dãy khác đang giữ lượt.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: bản sửa «bash kèm cờ mang giá trị» nói là phủ cả lớp nhưng ma trận khong-lot chỉ có ba điểm, và bốn đột biến của chính luật mới vẫn qua toàn bộ suite**
  Người dùng thấy gì: Bộ kiểm thử chưa đủ chặt để phát hiện nếu sau này ai đó vô tình làm hỏng cách chốt chặn xử lý vài tuỳ chọn bash ít gặp; hiện tại chốt chặn vẫn chạy đúng. Hậu quả chỉ xuất hiện ở lần sửa sau, khi lỗi có thể lọt qua mà không ai thấy.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **DP6-03 lech-o-goc lấy bản «cũ» từ merge-base sống, nên đỏ ở CI của main ngay sau khi gộp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ngay khi nhánh này gộp vào nhánh chính, một bài kiểm tra của bộ chặn lệnh sẽ báo đỏ dù không có gì hỏng, vì bản «cũ» nó so sánh lúc đó đã chính là bản mới. Kiểm tra tự động của nhánh chính bị đỏ và các vòng sau bị vướng; hai bài kiểm tra khác vẫn xanh nhưng không còn kiểm được gì.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **can_phan gắn cho mọi sự kiện cho-nguoi, nên mỗi yêu cầu can-nguoi của DP7 đánh thức giám sát hai lần (r1)**
  Người dùng thấy gì: Mỗi lần một thợ gửi yêu cầu cần người quyết, giám sát bị đánh thức hai lần cho cùng một việc, và lần thứ hai không nói việc đó của ai. Giám sát có thể coi đó là một việc chờ người riêng và báo người dùng thừa một lần.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **DP6-04 hang-viec-hong kết luận «xin thật sự từ chối» chỉ từ mã thoát khác 0, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm tra xác nhận lệnh xin lượt bị từ chối khi hàng việc hỏng, nhưng chỉ nhìn việc nó thất bại chứ không kiểm lý do. Nếu lệnh hỏng vì nguyên nhân khác, bài vẫn xanh và lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **`#` đứng ngay sau `)` / `))` bị coi là mở chú thích, nuốt phần còn lại của dòng: lọt lệnh S4 phía sau (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dạng lệnh hiếm, có dấu # dính liền sau dấu ngoặc đóng, bị hiểu nhầm là chú thích nên phần lệnh phía sau lọt qua khoá. Khi đó hai phiên có thể cùng chạy một việc lẽ ra phải chờ lượt.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 — mốc «bản cũ» rút từ merge-base SỐNG của checkout (HEAD vs origin/main), không ghim vào lịch sử: DP6-03 lech-o-goc đỏ ngay khi gộp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Sau khi nhánh này gộp vào nhánh chính, bài kiểm tra «bộ chặn lệnh cũ sai chín lời gọi thật» sẽ đỏ dù không có gì hỏng, vì bản cũ lúc đó đã là bản mới. Hai bài kiểm tra khác sẽ xanh nhưng không còn đo gì, nên người dùng tưởng được bảo vệ khi nâng cấp mà thực ra không.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1 — DP6-07 ten-ca-cu đo tên ca KHAI trong mã nguồn, không đo dòng «ok» của lượt chạy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra «ca cũ không bị mất» chỉ đếm tên ca còn được khai trong mã, không đếm ca thật sự chạy xanh. Một ca bị tắt đi vẫn được tính là còn, nên có thể mất một lớp bảo vệ mà không ai hay.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP6-04 loi-chan: lời hứa là QUAN HỆ với lời chặn của merge-base, assert chỉ là tiền tố regex + vắng chuỗi con (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra lời chặn chỉ xem câu mở đầu và sự vắng một cụm từ, chưa so trọn với lời chặn của bản cũ. Nếu phần đuôi của lời chặn bị đổi sai, bài vẫn xanh và người dùng có thể nhận lời chặn khác hẳn mà không ai báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-04 hang-viec-hong: «xin thật sự từ chối» chỉ assert mã thoát khác 0, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra «lệnh xin lượt bị từ chối khi hàng việc hỏng» chỉ nhìn việc lệnh thất bại mà không xem vì sao thất bại. Lệnh hỏng vì lý do khác cũng cho cùng kết quả xanh, nên lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-02 tien-de-help: thoát khác 0 và «băm cây trước == sau» cũng đúng khi KHÔNG có --help, nên hai vế đó không đo gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai vế kiểm tra «xem trợ giúp không làm đổi gì» vẫn xanh dù không có cờ trợ giúp, nên chưa chứng minh được điều cần chứng. Nếu một script khi chạy trợ giúp lại làm thay đổi kho, bộ kiểm tra có thể không báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-03 tep-ca: kiểm ẩn danh theo tên người dùng của MÁY CHẠY, không có đối chứng dương cho anDanh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Việc kiểm «tệp ca không lộ tên người dùng» chỉ có nghĩa trên máy của tác giả; ở máy khác bài vẫn xanh dù tên tác giả có lọt vào. Tên người dùng có thể đi kèm bản phát hành mà không bị bắt.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture tay đúng khuôn bên đọc: DP6-05 tự ghi xin/P1-s4.json, yeu-cau/P1-1.json; giuKhoa tự ghi khoa/s4/chu.json (r1 · tệp đã đổi)**
  Người dùng thấy gì: Vài bài kiểm tra tự tạo tệp «đơn xin» và «yêu cầu» bằng tay thay vì để chính lệnh thật tạo ra. Nếu cách đặt tên của lệnh thật đổi, các bài vẫn xanh trong khi việc báo «đang chờ người» ngoài đời có thể đã mất.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
