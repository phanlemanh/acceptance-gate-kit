## Trong hợp đồng

- **HS10 fixture ghi vào docs/x/y.md nhưng thư mục docs/x không tồn tại — file không bao giờ được tạo, ca vẫn PASS**
  file: `tests/scripts/run-tests.sh:2028`
  severity: medium
  AC: AC-10
  `mk_glob_repo` chỉ `mkdir -p` cho src, docs, a/x, apps/app, docs2, _acceptance/feat-gl — không có `docs/x`. Ca HS10 truyền `'docs/d.md docs/x/y.md CHANGELOG.md'`; vòng `for f in $files; do printf 'changed\n' >> "$R/$f"; done` (dòng 2028) đổ lỗi `No such file or directory` ra stderr rồi đi tiếp vì run-tests không `set -e`. Xác nhận bằng chạy suite: log in `run-tests.sh: line 2028: .../gl10/docs/x/y.md: No such file or directory` mà HS10/HS10-nostale vẫn PASS. Hệ quả: vế «file lồng dưới docs/** đi qua nguyên vẹn» mà contract AC-10 và evals E10 khai đích danh (`docs/x/y.md`) chưa từng được đo — bằng chứng E10 nói có phủ ca lồng thư mục là phantom. Bản thân code `match_globs`/`glob_variants` xử lý đúng (`docs/**` không chứa `**/`, `*` vượt `/` nên khớp `docs/x/y.md`), lỗi ở fixture. Sửa: thêm `"$R/docs/x"` vào `mkdir -p` của `mk_glob_repo` (hoặc `mkdir -p "$(dirname "$R/$f")"` trong vòng for) và cân nhắc ghim đối chứng rằng file đổi thực sự nằm trong `git diff --name-only` của c3 để lớp «fixture tiêm hỏng mà xanh» không tái diễn ở ca khác cùng khuôn.
  Vì AC-10 đòi xác nhận docs/x/y.md (đường dẫn nhiều cấp dưới docs/**) đổi sau verify vẫn exit 0 không stale; phép thử này chưa bao giờ thực sự chạm file đó nên AC-10 chưa được xác minh đầy đủ.

- **Hình dạng 4 (bước dựng fixture thất bại im lặng → xanh không phân biệt): HS10 chưa bao giờ đo `docs/x/y.md`**
  file: `tests/scripts/run-tests.sh:2064`
  severity: medium
  AC: AC-10
  `mk_glob_repo` (dòng 2017) chỉ `mkdir -p "$R/docs"`, không tạo `docs/x/`; ca HS10 (dòng 2064–2065) yêu cầu chạm `docs/d.md docs/x/y.md CHANGELOG.md`, nên `printf 'changed' >> "$R/docs/x/y.md"` thất bại (suite in `line 2028: .../gl10/docs/x/y.md: No such file or directory` ra stderr, suite không `set -e`). Kiểm fixture sau khi chạy: `git diff --name-only HEAD~1 HEAD` của gl10 chỉ có `CHANGELOG.md` và `docs/d.md`. Vậy phần tử «đường dẫn nhiều cấp dưới `docs/**`» của AC-10 (trục B·b3) chưa từng nằm trong vật được đo, mà HS10 vẫn `PASS` — đúng lớp «bước tiêm thất bại cho cùng màu xanh» của bất biến trong CLAUDE.md. Kèm lệch chữ: contract AC-10 và evals E10 (evals.yaml dòng 129) nói file đổi là `docs/a.md`, test lại chạm `docs/d.md`. Chỗ sửa: thêm `$R/docs/x` vào `mkdir -p` (hoặc `mkdir -p "$(dirname "$R/$f")"` trong vòng `for f in $files`) và cho fixture tự khai lỗi khi touch thất bại; đồng bộ tên file giữa contract/evals/test.
  Cùng lỗ hổng xác minh AC-10 (đường dẫn nhiều cấp dưới docs/**), kèm lệch tên file so với contract — vẫn là AC-10 chưa được kiểm chứng đúng như cam kết.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **GUIDE §8 ghim số phiên bản chưa tồn tại («từ 2.9.0») trong khi plugin đang ở 2.8.0**
  Người dùng thấy gì: Tài liệu hướng dẫn ghi sẵn một mốc phiên bản chưa phát hành cho quy tắc mới, có thể khiến người đọc tài liệu hiểu nhầm tính năng đã có từ mốc đó.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (mặt ngược: xanh-một-mình, không chiều đỏ cùng glob): HS05 `a/**/b.md` không có đối chứng stale**
  Người dùng thấy gì: Dạng đường dẫn có thư mục ở giữa (kiểu a/**/b.md) mới được thử chiều 'đúng khớp', chưa có phép thử xác nhận nó không lỡ khớp nhầm những đường dẫn đáng lẽ phải báo lỗi thời — độ tin cậy của cảnh báo cho dạng này thấp hơn các dạng khác.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (ghim thông điệp không đích danh): «stdout có "PASS: HS01"» khớp cả dòng `PASS: HS01-nostale`**
  Người dùng thấy gì: Cách ghi nhận 'đạt' của một số phép thử tự động chưa phân biệt rạch ròi giữa trường hợp đúng và trường hợp gần giống, nên nếu một quy tắc bị hỏng, báo cáo bằng chứng có thể vẫn hiện đạt thay vì báo lỗi.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evals.yaml`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Hình dạng 3 (assert chuỗi có mặt, lời hứa là quan hệ): HS09 mệnh đề (3) chỉ kiểm có chữ `AGENTS.md`, không kiểm ví dụ «`**/*.md` bắt `AGENTS.md`»**
  file: `tests/scripts/run-tests.sh:2114`
  severity: low
  detail: AC-9 hứa hàng GUIDE «có ví dụ `**/*.md` bắt `AGENTS.md`» (quan hệ glob → file). Assert (3) ở dòng 2114 là `case "$gl09_row" in *'AGENTS.md'*)` — chỉ đòi chuỗi `AGENTS.md` xuất hiện đâu đó trong hàng; chuỗi `**/*.md` không được kiểm ở assert nào (assert (1) chỉ đòi `**/` cạnh «không-hoặc-nhiều thư mục»). Hàng viết «`AGENTS.md` không được bắt» hay xoá hẳn `**/*.md` khỏi ví dụ vẫn xanh. Ghim tối thiểu: đòi `**/*.md` và `AGENTS.md` cùng có mặt theo thứ tự.
  source: measurement

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).