# Review findings: t3-arm-chu-ky-khong-im (round 1)

## Trong hợp đồng

- **Lệnh chấm E6 luôn thoát 0 kể cả khi bộ ca đỏ, vì thiếu pipefail**
  file: `_acceptance/config.yaml:1117`
  severity: high
  AC: AC-6
  source: conventions
  detail: `t3ak_e6` có dạng `bash -c 'set -e; chay-ca.sh ... | tail -n 3; node additive-only.test.mjs | tail -n 3'`. Không có pipefail thì mã thoát của mỗi đường ống là mã của `tail`, nên `set -e` không dừng và cả lệnh trả 0. Đã chạy thử đúng dạng này với một tên ca không tồn tại: chay-ca in `chay-ca: thieu dong Results cho 2 ca` nhưng lệnh vẫn thoát 0. Lỗi của phép đo additive-only cũng bị nuốt theo cách đó. Vì vậy lời hứa của E6 và AC-6 («Exit 0... thiếu một tên là đỏ») không có chiều đỏ ở mã thoát; đây đúng là lớp màu xanh không tự chứng minh mà CLAUDE.md cấm. Cùng tệp đã có nếp `set -o pipefail` kèm chú thích «pipefail GIỮ mã thoát của suite» (dòng 44-46, 173, 178, 327). Ngoài ra `tail -n 3` chỉ để lại ba dòng cuối, nên output bằng chứng không thể cho thấy «đủ 63 dòng PASS» như `expected` của E6 ghi. Cách sửa: dùng `set -eo pipefail`, hoặc bỏ hai đường ống `tail` vì chay-ca.sh đã tự cắt output; mã thoát thật khi đó mới đỏ được.

- **Eval E6 (t3ak_e6) luôn thoát 0 vì `set -e` không có pipefail, nên ca hỏng hoặc thiếu tên vẫn cho exit_code 0**
  file: `_acceptance/config.yaml:1117`
  severity: high
  AC: AC-6
  source: bugs
  detail: Lệnh là `bash -c 'set -e; bash .../chay-ca.sh <63 ca> | tail -n 3; node tests/scripts/additive-only.test.mjs | tail -n 3'`. Thiếu `set -o pipefail` nên mã thoát của mỗi pipeline là mã của `tail`, tức là 0. `set -e` không kích hoạt, và cả chay-ca.sh lẫn additive-only đều bị nuốt mã đỏ. Đã chạy đúng dạng này với một tên ca không tồn tại: chay-ca in `chay-ca: thieu dong Results cho 2 ca` (thoát 1) nhưng lệnh ngoài ra thoát 0; vế sau là `node -e process.exit(7) | tail -n 3` cũng không làm đỏ. Hệ quả: E6 hứa «thiếu một tên là đỏ» và phép đo additive-only xanh (AC-6), nhưng lệnh không thể đỏ theo mã thoát. Kit chấm `script` bằng mã thoát cộng khớp output, và PASS đòi `exit_code: 0`, nên bằng chứng ghi 0 kể cả khi hồi quy; chỉ còn khớp chữ trên 3 dòng cuối đỡ lại. `tail -n 3` cũng cắt 63 dòng PASS khỏi output, nên phần «đủ 63 dòng PASS» trong expected không thấy được trong bằng chứng. Hiện cả 63 ca và additive-only đều xanh, nên đây là lỗ của thước đo, chưa phải lỗi đang xảy ra. Cách sửa: thêm `set -o pipefail` như các executor khác trong cùng tệp (p200_cat_so, gdk_k1, cvsck_ca_thuong_truc); `tail` đọc hết stdin nên không có vấn đề SIGPIPE 141 như với `grep -q`.

- **Hình dạng 3 — Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: E6 (t3ak_e6) không bao giờ thoát đỏ, chỉ còn dòng Results trong đuôi đầu ra**
  file: `_acceptance/config.yaml:1117`
  severity: high
  AC: AC-6
  source: measurement
  detail: AC-6 và E6 hứa một quan hệ giữa danh sách 63 tên và kết quả: đủ 63 dòng PASS, «thiếu một tên là đỏ và nêu tên ca», kèm additive-only xanh. Lệnh t3ak_e6 là `bash -c 'set -e; bash .../chay-ca.sh <63 tên> | tail -n 3; node tests/scripts/additive-only.test.mjs | tail -n 3'`, không có `set -o pipefail`. Mã thoát của mỗi pipeline là của `tail`, nên `set -e` không thấy chay-ca.sh hay additive-only thất bại, và cả lệnh luôn thoát 0. Đã chạy đúng dạng lệnh này với một tên ca không tồn tại (`HA37-do KHONG-CO-CA`): đầu ra có `chay-ca: thieu dong Results cho 2 ca` nhưng mã thoát vẫn 0. Các executor khác cùng tệp dùng `pipefail` (dòng 46, 50-52) hoặc giữ `rc=$?`. Vì mã thoát là bằng chứng bắt buộc của E6, mã 0 không phân biệt được đỏ với xanh. `tail -n 3` còn cắt đầu ra xuống ba dòng cuối của mỗi vế, nên «đủ 63 dòng PASS» không quan sát được, chỉ còn chuỗi `Results: 63 passed` để đối chiếu. Phép đo additive-only của AC-6 bị che mã thoát theo cùng cách.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **HA43-do không đo máy đủ công cụ, trái lời khai «mỗi ca -do» và luật đối chứng**
  Người dùng thấy gì: Một ca kiểm tra về trường hợp máy thiếu node không có phép so sánh với máy đủ công cụ như các ca cùng loại. Người dùng vẫn được chặn đúng, chỉ là bằng chứng ít chặt hơn một chút.
  Căn cứ: Hành vi cho người dùng không sai và thông điệp vẫn được ghim, nên hậu quả nhẹ; có thể bổ sung sau mà không ảnh hưởng ai.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: báo cáo bằng chứng của các ca HA37-HA49 không rút từ khuôn của bên viết**
  Người dùng thấy gì: Các ca kiểm tra dùng báo cáo bằng chứng tự gõ tay, nên nếu khuôn báo cáo thật đổi đi thì các ca vẫn xanh dù cổng đọc sai chữ ký. Hiện tại chưa có người dùng nào bị ảnh hưởng.
  Căn cứ: Chưa gây sai lệch nào cho người dùng, chỉ là lưới an toàn có thể lỏng khi khuôn báo cáo đổi sau này; sửa được sau mà không mất dữ liệu.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/5 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
