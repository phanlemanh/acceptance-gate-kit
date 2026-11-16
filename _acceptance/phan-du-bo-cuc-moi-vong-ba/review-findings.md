# Review findings: phan-du-bo-cuc-moi-vong-ba (round 3)

## Trong hợp đồng

- **CHONG-RONG (AC-6) bỏ qua im lặng lệnh `git show` viết argv xuống dòng, trái lời khai «bắt mọi dạng / dạng lạ thì hỏng»**
  AC: AC-6
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:247`
  severity: low
  source: bugs
  detail: Trong `lenhLichSu`, nhánh `show-chuoi` bị chặn khi dòng có `'show',` (`!/'show',/.test(l)`). Còn `matchAll(/'show',\s*(`[^`]*`|\S+)/g)` thì phải có ít nhất một ký tự không trắng sau dấu phẩy NGAY TRÊN CÙNG DÒNG. Một dòng kết thúc bằng `'show',` (đường `<ref>:<đường>` nằm ở dòng sau, kiểu argv xuống dòng thường gặp) vì vậy không sinh bản ghi nào, kể cả bản ghi «dạng lạ». Đã chạy thử: `lenhLichSu("execFileSync('git', ['-C', KIT, 'show',\n  `${GOC}:scripts/lo-trinh.mjs`]);")` trả `[]`, tức một lệnh đọc đường phẳng ở commit lịch sử lọt qua mà không đỏ. Ở dạng tương tự, `'archive',` xuống dòng vẫn bị ghi là hỏng (bất đối xứng). Lời khai ở chú thích dòng 233–236 và evals E6 («dạng mới phải được dạy cho bộ quét chứ không lọt im») vì thế không đúng với `show`. TK-LS không có ca nào cho dạng này. Tám tệp K4-TB hiện tại đều viết trên một dòng nên PASS hôm nay không sai; lỗ hổng chỉ hở khi có tệp mới.
  rationale: AC-6 đòi thước đếm mọi lệnh git show/archive lịch sử ở mọi dạng viết; dạng argv xuống dòng lọt im lặng.

- **Hình dạng 3 (assert «chuỗi có mặt» thay cho quan hệ): CHONG-RONG nhận một lệnh archive là ok chỉ vì dòng ấy có chữ `pathspec(`**
  AC: AC-6
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:243`
  severity: medium
  source: measurement
  detail: Trong `lenhLichSu`, `const qua = l.includes('pathspec(')` là phán quyết duy nhất cho các loại `archive` và `archive-chuoi`, kể cả `show-chuoi` (dòng 243–247). AC-6 hứa một QUAN HỆ: mỗi đường mà `git archive <commit>` đọc phải giải qua pathspec của bộ dịch. Phép đo chỉ hỏi chữ `pathspec(` có xuất hiện ở đâu đó trên cùng dòng hay không. Một lệnh trộn đường phẳng viết cứng với đường đã dịch vẫn ok, ví dụ `'archive', GOC, 'scripts', ...boPhan(['lib'], c).map(x => pathspec(x, c))`. Lệnh ấy cho tar rỗng với `scripts` ở kho mới mà không ai kêu, đúng lỗi chốt chống rỗng sinh ra để bắt. Bộ tự kiểm TK-LS trong giu-khoa-3.test.mjs chỉ có ca lành, tức mọi tham số đường qua pathspec, và ca đỏ không có chữ pathspec nào. Không có mutant «có pathspec( trên dòng nhưng một tham số đường đi trần», nên lỗ này không có chiều đỏ. Ngược lại, nhánh `'show'` thì kiểm đúng quan hệ: `d.startsWith('${pathspec(')` đọc trên chính phần đường của tham số.
  rationale: AC-6 hứa mỗi đường mà git archive/show đọc phải qua pathspec và thước đỏ khi có lệnh không qua; một dòng trộn đường trần vẫn lọt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đường ống git archive | tar viết lại trong vòng mà vẫn thiếu set -o pipefail, nên lỗi archive bị nuốt và bản gốc thành thư mục rỗng**
  Người dùng thấy gì: Khi kho hạ tầng hỏng giữa chừng, một số bài kiểm có thể báo xanh hoặc đỏ trên dữ liệu rỗng thay vì báo rõ lỗi hạ tầng. Hôm nay mọi ca vẫn chạy đúng.
  Căn cứ: Hậu quả nhẹ và chỉ lộ khi hạ tầng hỏng, người dùng cuối không thấy gì; sửa sau vẫn rẻ.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: known-limits

- **--cu bỏ lọt tệp kiểm bị đổi tên hay xoá: túi khoá cũ không được so, thước vẫn in PASS**
  Người dùng thấy gì: Nếu một vòng sau đổi tên hoặc xoá một tệp kiểm rồi bỏ bớt ca, bước kiểm vẫn báo đạt. Vòng này không có tệp nào bị đổi tên hay xoá nên kết quả hôm nay không sai.
  Căn cứ: Chỉ là lỗ hổng tiềm ẩn của công cụ kiểm, chưa làm sai kết quả nào; ghi lại để vòng sau lưu ý là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): chiều đỏ SAU-GOP-DO chạy ở đúng điểm mà trước gộp và sau gộp là một, nên không chứng minh được phép giả lập «origin/main = HEAD» có tác dụng**
  Người dùng thấy gì: Phép thử giả lập trạng thái sau khi gộp có thể không thật sự chứng minh được mình đang chạy đúng, vì kết quả đỏ vốn đã đỏ sẵn. Kết quả hiện tại vẫn đúng.
  Căn cứ: Không làm sai kết quả giao cho người dùng, chỉ làm giảm độ tin của một phép kiểm; vá thêm đối chứng sau cũng được.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3/5: dòng «PASS: RA-LOP-A n/m tệp nhóm A xanh» lấy số tệp ĐÃ CHẠY làm tử số, in cả khi một tệp A vừa FAIL, và tệp A ngoài bộ chạy bị bỏ lặng**
  Người dùng thấy gì: Dòng báo cáo có thể ghi đạt kèm số lượng gây hiểu nhầm, dù kết quả cuối vẫn đỏ đúng khi có lỗi. Hôm nay mọi tệp liên quan đều chạy và xanh.
  Căn cứ: Chỉ ảnh hưởng cách đọc báo cáo, không đổi kết quả cuối; người đọc vẫn thấy dòng lỗi thật nên rủi ro thấp.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
