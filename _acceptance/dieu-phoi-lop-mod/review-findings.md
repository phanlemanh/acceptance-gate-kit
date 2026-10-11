# Review findings: dieu-phoi-lop-mod

Round 1, verified_commit 3053aae02be8c162cde5c4979e9b44a413362ac6.

## Trong hợp đồng

- **README của gói còn nguyên ba dấu xung đột merge (<<<<<<< HEAD / ======= / >>>>>>> origin/main)**
  file: `dieu-phoi/README.md:77`
  severity: high
  AC: AC-8
  source: conventions
  detail: Merge c5a43ce0 (gộp origin/main có DP7 #306) đã commit dieu-phoi/README.md khi xung đột chưa giải. Dòng 77 là '<<<<<<< HEAD', dòng 110 là '=======', dòng 130 là '>>>>>>> origin/main'. Hai mục bị bọc trong khối xung đột: mục «Chặn S4 và việc chờ người» của DP6 (vật của AC-8) và mục «Phiên thợ trong đợt» của DP7. Message của merge chỉ nhắc xung đột ở hook-chan-s4.mjs. Chạy git grep tìm dấu xung đột trên HEAD thì toàn kho chỉ còn chỗ này. README đi theo gói tới kho tiêu thụ, và judge E8 chấm AC-8 đọc thẳng tệp này. Cách sửa: xoá ba dòng dấu, giữ cả hai mục.
  rationale: AC-8 đòi README gói có mục «Chặn S4 và việc chờ người»; tệp đó là vật của AC-8 và đang vỡ bởi dấu xung đột chưa giải kẹp đúng mục này.

- **DP6-03 nguon chỉ «bỏ qua» khi thiếu cả thư mục ~/.claude/projects; máy có Claude Code mà thiếu chín bản ghi thì ca đỏ**
  file: `tests/dieu-phoi/lop-mod.test.mjs:183`
  severity: medium
  AC: AC-3
  source: conventions
  detail: Điều kiện bỏ qua là fs.existsSync(path.join(os.homedir(), '.claude', 'projects')). Thư mục này có trên mọi máy đã chạy Claude Code, kể cả máy của phiên S4 chấm suite. Trên máy ấy, nếu không có đúng chín tệp bản ghi (đường '-Users-&lt;u&gt;-dev-crm-onehub/…', khác máy, hoặc bản ghi bị dọn; các tệp nguồn hiện mang ngày 16-20/09), thì rut() ném 'rut-lenh-that: không thấy …' và ca đỏ thay vì in «bỏ qua». Như vậy nó lệch lời hứa của AC-3 và README: «in bỏ qua: không có bản ghi hội thoại khi không có». Chỉ CI không có ~/.claude là bỏ qua đúng. Nên bỏ qua khi thiếu tệp nguồn (kiểm từng tệp của DANH_SACH), không chỉ khi thiếu thư mục.
  rationale: AC-3 hứa ca kiểm nguồn in «bỏ qua: không có bản ghi hội thoại» khi không có bản ghi; ca hiện đỏ thay vì bỏ qua khi máy có thư mục nhưng thiếu chín tệp nguồn.

- **README gói còn nguyên dấu xung đột merge chưa giải (<<<<<<< HEAD / ======= / >>>>>>> origin/main)**
  file: `dieu-phoi/README.md:77`
  severity: high
  AC: AC-8
  source: bugs
  detail: Cùng lỗi với mục đầu của phần này (nguồn phát hiện khác). Merge c5a43ce0 (đưa origin/main DP7 vào nhánh) đã commit dieu-phoi/README.md khi xung đột chưa giải: dòng 77 là '<<<<<<< HEAD', dòng 110 là '=======', dòng 130 là '>>>>>>> origin/main'. Kiểm bằng `git show HEAD:dieu-phoi/README.md | grep -nE '^(<<<<<<<|=======|>>>>>>>)'`; ở 0182f894, ngay trước merge, tệp còn sạch. Mục mới «Chặn S4 và việc chờ người» (vật của AC-8) và mục «Phiên thợ trong đợt» của DP7 nằm kẹp giữa hai nửa xung đột. Vì vậy README phát hành tới kho tiêu thụ vỡ đúng chỗ AC-8 hứa. Không ca máy nào bắt được lỗi này: E8 là judgment, còn suite chỉ grep chữ.
  rationale: Cùng lỗi với mục đầu: README là vật của AC-8 và mục DP6 nằm kẹp trong khối xung đột chưa giải.

- **Thân heredoc đưa cho bash kèm cờ mang giá trị (-o pipefail, -euo pipefail, -O, --rcfile) bị coi là dữ liệu: lọt khoá S4 mà merge-base vẫn chặn**
  file: `dieu-phoi/scripts/phan-loai-s4.mjs:147`
  severity: medium
  AC: AC-2
  source: bugs
  detail: doThongDich coi mọi đối số không bắt đầu bằng '-' là tệp script, qua điều kiện `!doiSo.some((a) => !a.startsWith('-'))`. Với `bash -o pipefail &lt;&lt;'EOF'` (thân: `node x/repin-lane.mjs --write`), từ `pipefail` là giá trị của `-o` chứ không phải tệp script. Bash vẫn đọc lệnh từ stdin và chạy thân; đã kiểm thật bằng bash cho cả `bash -o pipefail &lt;&lt;EOF` và `bash -euo pipefail &lt;&lt;EOF`. Bộ phân loại lại trả null, trong khi merge-base trả 's4'. Đo được [merge-base 's4', bản mới null] cho năm dạng: `bash -o pipefail &lt;&lt;…`, `bash -euo pipefail &lt;&lt;…`, `bash -O extglob &lt;&lt;…`, `bash --rcfile r &lt;&lt;…` và `cat &lt;&lt;EOF | bash -o pipefail`. Đây là lối lọt mới, trái đúng luật đã khai ở AC-2 và design §4 C1: bash không -c và không tệp script thì thân CHÍNH LÀ lệnh, và luật heredoc không được mở lối lọt mới. Ma trận khong-lot chỉ có `bash &lt;&lt;`, `sh -s` và `| bash` nên không bắt được.
  rationale: AC-2 nêu rõ «luật heredoc không mở lối lọt mới» cho thân heredoc đưa vào bash đọc stdin; dạng bash kèm cờ mang giá trị là lối lọt mới mà merge-base vẫn chặn.

- **Ca DP6-03 nguon đỏ thay vì «bỏ qua» khi máy có ~/.claude/projects mà thiếu chín bản ghi; kéo đỏ cả suite dùng chung**
  file: `tests/dieu-phoi/lop-mod.test.mjs:183`
  severity: medium
  AC: AC-3
  source: bugs
  detail: Cùng lỗi với mục DP6-03 nguon ở trên (nguồn phát hiện khác). Ca này chỉ bỏ qua khi thư mục `~/.claude/projects` vắng (dòng 183), rồi gọi `rut(projects)`. Nếu một trong chín tệp bản ghi không có, `rut` ném lỗi «rut-lenh-that: không thấy …» (rut-lenh-that.mjs dòng 74). Đã kiểm: gọi rut trên một thư mục projects rỗng là ném đúng lỗi đó. Ca này đỏ ở mọi máy có cài Claude Code mà không có đúng chín phiên ấy: tên người dùng khác (đường `-Users-&lt;u&gt;-…` đổi theo), lịch sử bị dọn, hoặc runner CI có ~/.claude/projects. Hợp đồng AC-3 thì nói máy không có bản ghi phải in «bỏ qua: không có bản ghi hội thoại». Hậu quả: chạy node --test trên thư mục tests/dieu-phoi thoát khác 0, nên mọi executor dùng chung khuôn `set -o pipefail; node --test … | grep` đều đỏ vì hạ tầng chứ không vì vật. Bị ảnh hưởng gồm dieu_phoi_dp6 và cả dieu_phoi_dp2/dp3/dp7 của các hồ sơ đã ký.
  rationale: Cùng lỗi với mục DP6-03 nguon ở trên: AC-3 đòi in «bỏ qua» khi không có bản ghi, mà ca đỏ khi thiếu chín tệp nguồn dù thư mục có mặt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **DP6-03 lech-o-goc lấy bản «cũ» từ merge-base sống, nên đỏ ở CI của main ngay sau khi gộp**
  Người dùng thấy gì: Ngay khi nhánh này gộp vào nhánh chính, một bài kiểm tra của bộ chặn lệnh sẽ báo đỏ dù không có gì hỏng, vì bản «cũ» nó so sánh lúc đó đã chính là bản mới. Kiểm tra tự động của nhánh chính bị đỏ và các vòng sau bị vướng; hai bài kiểm tra khác vẫn xanh nhưng không còn kiểm được gì.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **can_phan gắn cho mọi sự kiện cho-nguoi, nên mỗi yêu cầu can-nguoi của DP7 đánh thức giám sát hai lần**
  Người dùng thấy gì: Mỗi lần một thợ gửi yêu cầu cần người quyết, giám sát bị đánh thức hai lần cho cùng một việc, và lần thứ hai không nói việc đó của ai. Giám sát có thể coi đó là một việc chờ người riêng và báo người dùng thừa một lần.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **DP6-04 hang-viec-hong kết luận «xin thật sự từ chối» chỉ từ mã thoát khác 0, không ghim thông điệp**
  Người dùng thấy gì: Một bài kiểm tra xác nhận lệnh xin lượt bị từ chối khi hàng việc hỏng, nhưng chỉ nhìn việc nó thất bại chứ không kiểm lý do. Nếu lệnh hỏng vì nguyên nhân khác, bài vẫn xanh và lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **`#` đứng ngay sau `)` / `))` bị coi là mở chú thích, nuốt phần còn lại của dòng: lọt lệnh S4 phía sau**
  Người dùng thấy gì: Một dạng lệnh hiếm, có dấu # dính liền sau dấu ngoặc đóng, bị hiểu nhầm là chú thích nên phần lệnh phía sau lọt qua khoá. Khi đó hai phiên có thể cùng chạy một việc lẽ ra phải chờ lượt.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 — mốc «bản cũ» rút từ merge-base SỐNG của checkout (HEAD vs origin/main), không ghim vào lịch sử: DP6-03 lech-o-goc đỏ ngay khi gộp**
  Người dùng thấy gì: Sau khi nhánh này gộp vào nhánh chính, bài kiểm tra «bộ chặn lệnh cũ sai chín lời gọi thật» sẽ đỏ dù không có gì hỏng, vì bản cũ lúc đó đã là bản mới. Hai bài kiểm tra khác sẽ xanh nhưng không còn đo gì, nên người dùng tưởng được bảo vệ khi nâng cấp mà thực ra không.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1 — DP6-07 ten-ca-cu đo tên ca KHAI trong mã nguồn, không đo dòng «ok» của lượt chạy**
  Người dùng thấy gì: Bài kiểm tra «ca cũ không bị mất» chỉ đếm tên ca còn được khai trong mã, không đếm ca thật sự chạy xanh. Một ca bị tắt đi vẫn được tính là còn, nên có thể mất một lớp bảo vệ mà không ai hay.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP6-04 loi-chan: lời hứa là QUAN HỆ với lời chặn của merge-base, assert chỉ là tiền tố regex + vắng chuỗi con**
  Người dùng thấy gì: Bài kiểm tra lời chặn chỉ xem câu mở đầu và sự vắng một cụm từ, chưa so trọn với lời chặn của bản cũ. Nếu phần đuôi của lời chặn bị đổi sai, bài vẫn xanh và người dùng có thể nhận lời chặn khác hẳn mà không ai báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-04 hang-viec-hong: «xin thật sự từ chối» chỉ assert mã thoát khác 0, không ghim thông điệp**
  Người dùng thấy gì: Bài kiểm tra «lệnh xin lượt bị từ chối khi hàng việc hỏng» chỉ nhìn việc lệnh thất bại mà không xem vì sao thất bại. Lệnh hỏng vì lý do khác cũng cho cùng kết quả xanh, nên lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-02 tien-de-help: thoát khác 0 và «băm cây trước == sau» cũng đúng khi KHÔNG có --help, nên hai vế đó không đo gì**
  Người dùng thấy gì: Hai vế kiểm tra «xem trợ giúp không làm đổi gì» vẫn xanh dù không có cờ trợ giúp, nên chưa chứng minh được điều cần chứng. Nếu một script khi chạy trợ giúp lại làm thay đổi kho, bộ kiểm tra có thể không báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-03 tep-ca: kiểm ẩn danh theo tên người dùng của MÁY CHẠY, không có đối chứng dương cho anDanh**
  Người dùng thấy gì: Việc kiểm «tệp ca không lộ tên người dùng» chỉ có nghĩa trên máy của tác giả; ở máy khác bài vẫn xanh dù tên tác giả có lọt vào. Tên người dùng có thể đi kèm bản phát hành mà không bị bắt.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture tay đúng khuôn bên đọc: DP6-05 tự ghi xin/P1-s4.json, yeu-cau/P1-1.json; giuKhoa tự ghi khoa/s4/chu.json**
  Người dùng thấy gì: Vài bài kiểm tra tự tạo tệp «đơn xin» và «yêu cầu» bằng tay thay vì để chính lệnh thật tạo ra. Nếu cách đặt tên của lệnh thật đổi, các bài vẫn xanh trong khi việc báo «đang chờ người» ngoài đời có thể đã mất.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
