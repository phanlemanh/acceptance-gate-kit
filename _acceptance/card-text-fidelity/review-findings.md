# Review Findings: card-text-fidelity (round 4)

## Trong hợp đồng

- **E12 (AC-13) dùng ngưỡng dung sai `<= 25` thay vì ĐỎ-khi-có-cụm-mồ-côi — phép đo không thể đỏ**
  file: `tests/plugins/run-tests.sh:6960`
  severity: high
  AC: AC-13
  AC-13 trong contract và `expected` của E12 trong evals.yaml đều hứa: "cụm không khớp hình dạng nào → ĐỎ kèm chuỗi gốc và tên việc chứa nó". Cài đặt lại là `if orphan: kinds = sorted({o[1] for o in orphan}); assert len(kinds) <= 25`. Tôi chạy đúng logic phân loại đó trên corpus hiện tại: 23 lượt mồ côi / 18 mẫu phân biệt (ví dụ `'**Chuyển'`, `'mất**'`, `'executors.design.*'`, `'GPM*'`, `'(--*'`). Nghĩa là phép đo đang XANH trong khi bảng KHÔNG phủ corpus — đúng thứ AC-13 sinh ra để bắt — và còn dư 7 mẫu nữa mới chạm trần. Ngưỡng 25 được chọn cao hơn số thực tại thời điểm viết, tức là hạ thước cho vừa vật (invariant "Hạ thước cho vừa vật" / "Thước phải gắn vào vật được giao" trong CLAUDE.md). Thêm nữa, thông điệp khi đỏ chỉ in `kinds[:6]` — mất phần "tên việc chứa nó" mà AC-13 đòi, dù `orphan` đã có sẵn tuple (slug, frag).
  source: conventions

- **E12 không có đối chứng dương, và đối chứng đã khai trong evals.yaml về mặt cấu trúc không chạy được**
  file: `tests/plugins/run-tests.sh:6957`
  severity: high
  AC: AC-13
  evals.yaml E12 khai đối chứng dương: "bỏ một hình dạng khỏi bảng → phép đo ĐỎ đích danh cụm mồ côi". Trong P161, mọi chân đo khác đều có răng (E1 hai mutant xoá-hàng/đổi-tên, E2 `must_fail(e2_on(strip_old))`, E8 mutant bỏ-lột-đậm cho cả E7 lẫn E9), riêng khối E12 không có mutant nào — nó chỉ chạy một lượt trên cây thật. Đối chứng đã khai cũng không thể hiện thực hoá như mô tả: bỏ một hàng khỏi `STRIP-SHAPE-MATRIX` sẽ làm E1 (`name_errs`) đỏ trước khi tới E12, nên "E12 đỏ đích danh cụm mồ côi" chưa bao giờ được chứng minh. Cộng với ngưỡng 25 ở finding trên, E12 hiện là assertion không sống: không phân biệt được "bảng phủ corpus" với "khối này chưa bao giờ có khả năng đỏ" — đúng lớp lỗi CLAUDE.md liệt kê ("Assertion âm-tính-một-mình là assertion không sống").
  source: conventions

- **E12 corpus-coverage assert tolerates up to 25 unmatched star shapes — its stated claim is not the claim it measures**
  file: `tests/plugins/run-tests.sh:6960`
  severity: medium
  AC: AC-13
  The block is titled "BANG PHAI PHU CORPUS — moi cum sao trong ho so that phai khop mot hinh dang CO TEN", but the code is `if orphan: assert len(kinds) <= 25`. I measured the current tree: 1606 classified, 23 orphan occurrences over 18 distinct kinds. So the assert has 7 kinds of slack and the header's "mọi cụm sao" is never enforced — a future contract can introduce up to 7 brand-new unnamed star shapes and E12 stays green.

  The 25 is also not derived from anything (no comment ties it to a measured baseline), and the orphans it currently tolerates are not benign noise: they are real bold spans the classifier mis-handles, e.g. `_acceptance/cross-feature-claim-index/contract.md:105` `- **Chuyển contract mới `claim-scan-parser-hardening`** (quyết tại Cổng 2):`. The `sao-trong-đoạn-mã` regex consumes the backtick span first, leaving `**Chuyển contract mới  **`, whose closing `**` is now preceded by a space, so `đậm-chuẩn` no longer matches. (The product's stripMd handles this shape correctly — it masks the code span rather than deleting it — so the gap is in the ruler, not the object.) Either pin the number to the measured 18 with a comment, or fix the classifier to mask-not-delete code spans the way stripMd does, which would take orphans toward 0.
  source: bugs

- **Hạ ngưỡng thay vì quan hệ toàn phần — E12/AC-13 cho phép tới 25 loại cụm mồ côi**
  file: `tests/plugins/run-tests.sh:6960`
  severity: high
  AC: AC-13
  AC-13/E12 hứa: "MỌI cụm phải khớp ít nhất một hình dạng CÓ TÊN — cụm không khớp hình dạng nào → ĐỎ kèm chuỗi gốc". Phép đo thực tế là `assert len(kinds) <= 25` trên tập cụm mồ côi (dòng 6960), tức một NGƯỠNG ĐẾM chứ không phải quan hệ "tập mồ côi rỗng". Tôi chạy lại đúng đoạn phân loại này trên cây hiện tại: 23 cụm mồ côi / 18 loại phân biệt — ví dụ `**Chuyển`, `**Phép`, `mất**`, `(**`, `GPM*`, `executors.design.*`. Nghĩa là phép đo ĐANG XANH trong khi lời hứa đã bị vi phạm 18 lần, và nó chỉ đỏ khi số loại vọt qua 26. Biên chỉ còn 7 loại: bảng có thể mất phủ corpus thêm 7 hình dạng nữa mà vẫn xanh. Đây đúng lớp "hạ thước cho vừa vật" mà chính contract nói 3 vòng trước đã trượt.
  source: measurement

- **Assertion âm-tính-một-mình + ma trận không toàn phần — E12 thiếu đối chứng dương và chỉ ràng 11/19 hình dạng**
  file: `tests/plugins/run-tests.sh:6951`
  severity: high
  AC: AC-13
  E12 khai đối chứng dương: "bỏ một hình dạng khỏi bảng → phép đo ĐỎ đích danh cụm mồ côi". Trong khối E12 (dòng 6944-6961) KHÔNG có mutant nào: không có bản sao marker bị bớt hàng, không có must_fail. Chỉ có một nhánh assert đếm. Tệ hơn, danh sách STRUCT chỉ có 11 bộ phân loại còn marker có 19 tên, và vòng lặp `if name not in SHAPES: continue` (6951) chỉ lọc theo chiều ngược lại — nên 8 tên trong bảng (`glob-hai-sao-trong-đoạn-mã`, `glob-trong-cụm-đậm`, `nhiều-glob-một-dòng`, `sao-lẻ-không-cặp`, `đậm-dính-chữ-trước`, `đậm-dính-dấu-câu-trước`, `đậm-dính-gạch-ngang-trước`, `đậm-và-glob-cùng-dòng`) hoàn toàn không tham gia phép phân loại. Xoá bất kỳ tên nào trong 8 tên đó khỏi marker sẽ KHÔNG làm E12 đỏ — đối chứng dương đã khai sẽ trượt trên 8/19 phần tử. "Bảng bị corpus buộc phải có" mới chỉ đúng cho hơn nửa bảng.
  source: measurement

- **Đo số đếm thay vì quan hệ "mọi đường dẫn nguyên vẹn" — E6/AC-6 chỉ assert n_new > n_old**
  file: `tests/plugins/run-tests.sh:6912`
  severity: high
  AC: AC-6
  AC-6/E6 hứa: "MỌI đường dẫn [chứa sao trong hồ sơ thật] xuất hiện nguyên vẹn" trên thẻ. `intact_count` (6898-6911) gom `want` từ contract rồi CỘNG số đường dẫn tình cờ có mặt, và assert duy nhất là `n_new > n_old` (6912) — một so sánh tổng gộp giữa hai bản, không phải mệnh đề toàn xưng. Tôi chạy lại chính phép đếm này: tổng 36 lượt đường-dẫn-cần-kiểm, bản mới giữ nguyên vẹn 14, bản cũ 12. Tức phép đo XANH với biên vỏn vẹn 2 lượt, trong khi 22/36 lượt không có mặt nguyên vẹn trên thẻ. Một hồi quy làm cụt vài (không phải tất cả) đường dẫn vẫn dễ dàng giữ n_new > n_old. Bình luận ngay trên nó (6906-6908) nói phiên bản r1 bị mù vì "12/18 glob bị miễn"; bản thay thế vẫn không đo mệnh đề toàn xưng, chỉ đổi từ miễn-trừ sang so-số.
  source: measurement

- **E9/AC-9 không hề chạy corpus qua bản cũ — quan hệ "chênh lệch cũ↔mới" bị thay bằng hậu-điều-kiện một bản**
  file: `tests/plugins/run-tests.sh:6984`
  severity: medium
  AC: AC-9
  AC-9/E9 khai quan hệ giữa HAI bản: "rút MỌI cụm dấu sao từ hồ sơ thật, chạy qua CẢ BẢN CŨ LẪN BẢN MỚI — mọi chênh lệch phải phân loại được vào một hình dạng CÓ TÊN; chênh lệch không thuộc hình dạng nào → ĐỎ kèm chuỗi gốc". Trong code, `scan_corpus` chỉ được gọi với `strip_new` (6984) và `strip_mut` (6989); `strip_old` — đã có sẵn từ dòng 6829 — không bao giờ được truyền vào. Không nơi nào tính tập chênh lệch old↔new, cũng không nơi nào phân loại chênh lệch theo tên hình dạng. Cái thực sự được đo là một hậu-điều-kiện của riêng bản mới (`LEFTOVER` — không còn cặp đậm-chuẩn sót). Hậu-điều-kiện đó hữu ích, nhưng nó không phải mệnh đề mà AC-9 hứa, nên "chênh lệch không có tên" hiện không có phép đo nào bắt.
  source: measurement

- **E10/AC-10 đo từ vựng (`stripMd(` trong nguồn) thay cho "mọi lối gọi có đầu ra thật được kiểm"**
  file: `tests/plugins/run-tests.sh:7021`
  severity: medium
  AC: AC-10
  AC-10/E10 có hai vế. Vế đếm được cài: `re.findall(r"stripMd\(", ...)` so với con số ở trục C (7019-7021). Vế thứ hai — "mỗi lối gọi khác biệt (thẻ Cổng 1, thẻ Cổng 2, các lối in dự phòng) có ít nhất một đầu ra thật được sinh và kiểm; lối không đo phải có dòng descope nêu số lượng" — không có dòng code nào trong khối P161 thực hiện: không có ánh xạ từ 14 vị trí gọi sang đầu ra đã kiểm, không có kiểm `descope`. Kết quả là một tuyên bố quét-lớp ("mọi lối gọi") được chứng minh bằng một phép đếm chuỗi ký tự trong file nguồn; thêm một `stripMd(` vào một nhánh in chưa từng được sinh ra vẫn xanh miễn là trục C được sửa số theo.
  source: measurement

- **E11/AC-11 kiểm "chuỗi có mặt đâu đó trong file" thay cho quan hệ theo khối, và chỉ phủ dòng `assert `**
  file: `tests/plugins/run-tests.sh:7014`
  severity: low
  AC: AC-11
  AC-11 hứa "không phép đo cũ nào của thẻ bị SỬA"; E11 nói rõ "các khối P đã có TRƯỚC mốc chỉ được THÊM dòng". Cài đặt (7011-7015) rút mọi dòng bắt đầu bằng `assert ` từ bản tại mốc rồi kiểm `l not in new_text` — substring trên TOÀN VĂN file mới, mất hoàn toàn thông tin khối: một assert bị xoá khỏi khối P42 vẫn xanh nếu cùng chuỗi đó tồn tại ở khối khác (nhiều assert trong file này là câu ngắn lặp lại). Ngoài ra phạm vi chỉ là 408 dòng `assert ` của bản cũ, trong khi cùng file còn 127 dòng kiểm ở tầng shell (`grep`/`[`/`test`/`fail`) hoàn toàn không được canh. Khối cũng không có đối chứng dương nào chứng minh nó biết đỏ khi một assert cũ thật sự bị xoá.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Out of scope của contract dựa trên tiền đề sai: evidence-page/product-map KHÔNG dùng chung hàm lột**
  Người dùng thấy gì: Trang bằng chứng và trang bản đồ sản phẩm cũng in nội dung hồ sơ cho người đọc, nhưng tính năng lần này chỉ đo mỗi thẻ quyết định — nếu hai trang kia có cùng kiểu lỗi hiển thị chữ, người dùng vẫn thấy sai mà không có cảnh báo nào bắt được.
  file: `_acceptance/card-text-fidelity/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Biến `checked = n_new` được gán rồi bỏ, không assert gì**
  Người dùng thấy gì: Đây là phần dọn dẹp kỹ thuật nội bộ của bộ kiểm, không ảnh hưởng tới nội dung hay độ chính xác của thẻ mà người dùng nhìn thấy.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P161 fail-open: gate-card render crashes are counted then discarded — feature's own slug can be dead and the test stays green**
  Người dùng thấy gì: Nếu việc dựng thẻ cho một hồ sơ bị lỗi ngầm bên trong, bộ kiểm vẫn báo kết quả tốt thay vì báo đỏ — một thẻ hỏng hoàn toàn có thể lọt qua mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **stripMd leaves literal `**` on the card for nested emphasis — regression vs the pre-diff version, and E7 is structurally blind to it**
  Người dùng thấy gì: Nếu sau này có một dòng vừa in đậm vừa in nghiêng lồng nhau xuất hiện trong hồ sơ, thẻ quyết định có thể vẫn hiện nguyên hai cặp dấu sao thay vì chữ sạch — nhưng tình huống này chưa từng xảy ra trong dữ liệu thật hiện tại.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **stripMd sentinel collides with U+0000 in input: text silently deleted or replaced with unrelated code-span content**
  Người dùng thấy gì: Trong trường hợp cực hiếm hồ sơ chứa ký tự điều khiển ẩn (gần như không xảy ra trong thực tế), một đoạn chữ trên thẻ có thể bị mất hoặc lẫn nhầm nội dung không liên quan.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).