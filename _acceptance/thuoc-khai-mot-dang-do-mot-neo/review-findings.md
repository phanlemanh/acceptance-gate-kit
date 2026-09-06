## Trong hợp đồng

### 1. Phép quét tĩnh `quet_neo_dong` XANH khi trích được 0 dòng — đúng lớp «assertion âm-tính-một-mình» mà CLAUDE.md cấm
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:117`
- severity: **high**
- AC: AC-1
- source: conventions

`than_ham()` chỉ vào thân hàm khi dòng định nghĩa khớp CHÍNH XÁC `^<ten>\(\) \{`. Nếu không khớp, awk in RỖNG, `grep -nE "$NEO_DONG"` không thấy gì, `hit` rỗng, và `quet_neo_dong` in `OK: ... không nhắc điểm neo động nào` với rc=0 — tức phép đo báo xanh mà chưa hề đọc dòng mã nào. Đã phá thử tại chỗ: đổi `lane_song() {` thành `lane_song ()\n{` VÀ tiêm `"$MOC_KY"..HEAD` vào thân → `than_ham` trả 0 dòng, `quet_neo_dong` vẫn in OK, rc=0. Chiều đỏ 4 hiện có (sed chèn HEAD) không phân biệt được ca này vì nó giữ nguyên định dạng header. Đây chính là lớp lỗi CLAUDE.md gọi tên: «fixture hỏng, bước tiêm thất bại — tất cả đều cho cùng một màu xanh», và là hình dạng (1) của «Thước phải gắn vào vật được giao». Nghiệm đúng tầng: assert `than_ham` trả về SỐ DÒNG > 0 cho từng hàm trong `for ham in lane_song tap_file co_moc` (line 124) trước khi kết luận sạch, và đỏ gọi tên hàm không tìm thấy.

### 2. quet_neo_dong xanh im lặng khi than_ham không rút được thân hàm (guard vô hiệu, không ai biết)
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:125`
- severity: **high**
- AC: AC-1
- source: bugs

`than_ham` rút thân hàm bằng awk với mẫu cứng `^<tên>\(\) \{`. Nếu không khớp, awk in ra RỖNG, `hit` rỗng, và `quet_neo_dong` kết luận `OK: thân lane_song · tap_file · co_moc không nhắc điểm neo động nào` rồi return 0. Không có chỗ nào assert rằng thân hàm thực sự được rút ra (ví dụ: kiểm số dòng > 0, hoặc kiểm hàm tồn tại). Đây là fallback ẩn: phép đo không tìm thấy gì bị coi là phép đo sạch.

Đã chứng minh bằng thực nghiệm (chạy đúng thân hai hàm trích từ rang.sh):

1) Đổi tên hàm — `sed 's/^lane_song() {/lane_live() {/'` trên rang.sh CỘNG chèn `..HEAD` vào thân hàm đó → `quet_neo_dong` in `OK: sach`, rc=0. Nghĩa là một lần đổi tên hàm (kèm cập nhật mọi lời gọi, hoàn toàn hợp lệ về mặt chạy) làm cả tính chất «độc lập HEAD» hết được canh mà không ai đỏ.

2) Đổi kiểu ngoặc — file chứa:
```
lane_song()
{
  git rev-parse HEAD
}
```
→ `than_ham` trả rỗng cho CẢ BA hàm (`lane_song`, `tap_file`, `co_moc` đều `[]`), `quet_neo_dong` vẫn in `OK: sach`, rc=0, dù thân hàm có nguyên `git rev-parse HEAD`.

Hệ quả: đây là phép đo DUY NHẤT thực thi tính chất mà AC-1/E1 khai (`độc lập HEAD`), và nó tự tắt trong im lặng. Đúng lớp lỗi «ô đo chạy 0 ca vẫn xanh». Cách sửa: `quet_neo_dong` phải fail-closed khi `than_ham` trả rỗng — ví dụ `[ -n "$(than_ham "$f" "$ham")" ] || { echo "DO: không rút được thân $ham — phép quét vô hiệu"; rc=1; }` trước khi grep.

### 3. cmp -s xác nhận «mũi tiêm trúng» ở chiều đỏ 4 không bao giờ đỏ được — dòng sed tự đột biến chính nó
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:259`
- severity: **medium**
- AC: AC-1
- source: bugs

Dòng 258 dựng bản sao đột biến:
```
BS="$TMP/rang-neo-dong.sh"; sed 's|git -C "$repo" diff --quiet "$MOC_KY" -- "$REL_WF"|git -C "$repo" diff --quiet "$MOC_KY"..HEAD -- "$REL_WF"|' "$HERE/rang.sh" > "$BS"
```
Chính dòng lệnh sed này CHỨA chuỗi tìm kiếm nguyên văn, nên sed cũng thay thế trên chính nó. Kiểm chứng bằng `diff` giữa rang.sh và bản sao: có ĐÚNG HAI dòng đổi — dòng 103 (thân `lane_song`, mũi tiêm mong muốn) và dòng 258 (dòng sed tự đổi).

Do đó `cmp -s "$HERE/rang.sh" "$BS"` luôn báo KHÁC NHAU bất kể mũi tiêm có trúng thân `lane_song` hay không, và nhánh `bad "chiều đỏ 4: mũi tiêm KHÔNG trúng — bản sao giống hệt bản thật"` là mã chết không thể chạm tới.

Kịch bản cụ thể: nếu về sau `lane_song` được viết lại (ví dụ tách lệnh git ra biến, hay đổi thứ tự tham số) sao cho dòng 103 không còn khớp mẫu sed, thì mũi tiêm CHỈ còn trúng dòng 258 — `cmp` vẫn khác, guard im, và ca chiều đỏ 4 đi tiếp bằng một bản sao không hề có đột biến trong thân hàm.

Điều này quan trọng vì `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml` ô E1 khai `cmp -s` là chân chịu lực: «... gọi đúng tên hàm, sau khi `cmp -s` xác nhận mũi tiêm trúng». Lời khai đó hiện không có thật. (Giảm nhẹ: khi mũi tiêm trượt thì `quet_neo_dong "$BS"` trả rc=0 và nhánh else vẫn `bad`, nên kết cục là đỏ chứ không xanh giả — nhưng thông điệp sẽ chỉ sai chỗ, và guard được viết ra để phân biệt đúng hai ca đó thì vô dụng.) Cách sửa: dựng mẫu sed từ biến/heredoc để dòng lệnh không chứa chuỗi đích, hoặc đổi guard thành đếm số dòng khác nhau và đòi mũi tiêm nằm trong khoảng dòng của `lane_song`.

### 4. Hình dạng 4 — assertion âm-tính-một-mình: quét tĩnh XANH khi đọc được 0 dòng (không có chân chứng minh đã thật sự đọc thân hàm)
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:125`
- severity: **high**
- AC: AC-1
- source: measurement

`quet_neo_dong` (dòng 122–130) chỉ có MỘT loại khẳng định: `grep -nE "$NEO_DONG"` trên đầu ra của `than_ham` KHÔNG khớp gì. Không đâu assert rằng `than_ham` đã trả về dòng nào. `than_ham` (dòng 117–121) tìm thân hàm bằng awk `$0 ~ "^"f"\\(\\) \\{"` — mẫu neo tuyệt đối vào chuỗi `<tên>() {` ở đầu dòng; tên hàm đổi, hay chỉ cần một khoảng trắng (`lane_song () {`), là awk in ra 0 dòng, grep không khớp, `rc=0`, và hàm in ra dòng KHẲNG ĐỊNH `OK: thân lane_song · tap_file · co_moc không nhắc điểm neo động nào`. Đã đo tay 06/09 trên cây này: lấy bản sao rang.sh, (a) tiêm ĐÚNG đột biến mà chiều đỏ 4 dùng — đổi `git diff --quiet "$MOC_KY" -- "$REL_WF"` thành `"$MOC_KY"..HEAD`, tức phép đo mất hẳn tính độc-lập-HEAD mà AC-1 hứa — và (b) đổi ba tiêu đề hàm thành `lane_song () {` / `tap_file () {` / `co_moc () {`; chạy `quet_neo_dong` trên bản đó → in `OK: … không nhắc điểm neo động nào`, rc=0. `chiều đỏ 4` (dòng 258–262) không bịt được lỗ này: nó chỉ chứng minh phép quét đỏ khi tiêu đề hàm CÒN NGUYÊN, tức là đối chứng dương cho ca «tìm thấy thân», không phải cho ca «không tìm thấy thân». Đây là phép đo DUY NHẤT của AC-1, nên khi nó rơi về xanh-đọc-0-dòng thì tiêu chí trở thành vô hình.

### 5. Hình dạng 5 — tuyên «MỌI đột biến» nhưng chân kiểm mũi-tiêm chỉ phủ điểm-case: nhánh `them_cong` không đi qua `tiem()`
- file: `tests/plugins/run-tests.sh:11021`
- severity: **low**
- AC: AC-7
- source: measurement

AC-7 của contract và `expected` của E9 (`_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml`) tuyên một bất biến toàn lớp: «MỌI đột biến phải đi qua chân «mũi tiêm có trúng»» / «MỌI đột biến đi qua chân `tiem()` đếm chuỗi đích đúng một lần rồi so văn bản trước/sau». Trong mã, `tiem()` (dòng 11059–11071, đếm `text.count(a) == 1` rồi assert `ra != text`) được dùng cho 10 đột biến, nhưng nhánh `them_cong=True` bên trong `kiem` (dòng 11021–11026) tiêm ba dòng bảng bằng `.replace(..., 1)` TRẦN — `vi_g.replace("\n\n**Ngân sách", …)`, `vi_q.replace(…)`, `en_r.replace("\n\n**Human-turn budget", …)` — không đếm số lần khớp, không so văn bản trước/sau. Đột biến `"them cong nhung giu ngan sach"` (dòng 11084), tức chính ca duy nhất chứng minh phép so QUAN HỆ ở AC-8, chạy qua nhánh này. Cả `expected` của E9 lẫn `cmd` của nó (`config:executors.test.plugins`, chỉ chạy suite) đều không có khẳng định nào kiểm được tính chất «mọi đột biến» ấy — nó là tính chất của MÃ, không xuất hiện trong đầu ra mà ô đo đọc. (Ghi rõ chiều không-đỏ: nếu ba mũi `.replace` này trượt, ca vẫn FAIL vì lệch ghim, nên đây là lời khai quá tay chứ chưa phải đường xanh-im-lặng.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ ĐÃ KÝ `inputs-tinh-tu-goc-kho`: contract/evals được bổ chính nhưng khối bằng chứng E6 giữ nguyên đầu ra không còn sinh được**
  Người dùng thấy gì: Một tài liệu bằng chứng đã được duyệt trước đó cho một tính năng liên quan vẫn mô tả cách đo cũ, không còn khớp với cách tính năng đó thực sự được kiểm tra hiện nay — người đọc lại tài liệu này sau này có thể hiểu sai đã kiểm tra bằng phương pháp nào.
  file: `_acceptance/inputs-tinh-tu-goc-kho/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **«Out of scope» của hợp đồng mới tự mâu thuẫn với chính diff, và hai tham chiếu chết còn trong tiêu chí sống**
  Người dùng thấy gì: Bản mô tả phạm vi công việc có một dòng loại trừ mâu thuẫn với chính các thay đổi đã thực hiện, và còn nhắc tới hai phần việc đã không còn tồn tại — người đọc tài liệu này sau này có thể hiểu sai phạm vi thật sự đã được làm.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (đột biến ↔ bản chép bị gọi tên)**
  Người dùng thấy gì: Khi hai bản sao nội dung tiếng Việt bị sửa sai ở hai chỗ khác nhau, thông báo cảnh báo hiện ra giống hệt nhau, nên người đọc không biết chính xác bản nào bị sai và có thể mất thêm thời gian tìm ra chỗ cần sửa.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/inputs-tinh-tu-goc-kho/evidence-report.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.