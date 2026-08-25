## Trong hợp đồng

### checkGuide grep trọn GUIDE.md thay vì trong khối có mốc neo — vế «muc 2b» là assertion chết, mutant toàn cục che mất
- file: `tests/plugins/lan-may-classifier.test.mjs:219`
- severity: medium
- AC: AC-7
- source: conventions

Ba bộ kiểm văn xuôi kia của chính file này (checkAdvice, checkFallback) đều trích khối giữa mốc neo (`CONSUMER-ALLOW-ADVICE`, `CLASSIFIER-FALLBACK`) rồi mới đo. checkGuide thì flat() cả GUIDE.md rồi grep — và mục mới ở GUIDE.md:1034 không có mốc neo nào, khác nếp đã có trong kho (tests/plugins/plugin-declare.test.mjs neo khối `GUIDE-PLUGIN-DECLARE` trong chính GUIDE.md).

Hệ quả đo được: cụm `tuần tự` đã có sẵn ở GUIDE.md dòng 307 và 372 (nói về S3 tuần tự, không liên quan ô này). Phá thử — xoá TRỌN đoạn «Nghi thức có đường thoái hoá…» khỏi mục mới — vế `muc 2b` vẫn XANH vì 2 lần xuất hiện cũ còn nguyên. Tức AC-6 nửa «GUIDE nói lượt kế đi TUẦN TỰ» không có phép đo nào canh.

Mutant m4 (dòng 394) không lộ ra điều đó vì nó tiêm TOÀN CỤC (split/join, chính bản vá d-…-3002): nó bẻ cả ba chỗ, kể cả hai chỗ ngoài vật, nên đỏ mà không chứng minh gì về đoạn mới. Đây là biến thể của lớp «vế chết núp sau mutant»: lệnh tiêm phải chứng minh nó đổi được một dòng TRONG VẬT, không phải ở bất kỳ đâu trong file.

Hướng sửa theo lớp: bọc mục mới của GUIDE bằng một cặp mốc neo và cho checkGuide đo trong khối đó, giống hai bộ kiểm anh em.

Phá thử chứng minh mệnh đề «muc 2b» không có chiều đỏ nào có thể xảy ra qua chính bộ kiểm của nó — đúng lỗi AC-7 cấm (mệnh đề đo được phải có chiều đỏ đi qua chính hàm kiểm, không được là assertion không thể chết).

### Mutant m3 của LM1 ghim cứng lệnh và dòng khoá đọc từ config — trái đúng lời khai của chính file test
- file: `tests/plugins/lan-may-classifier.test.mjs:256`
- severity: low
- AC: AC-7
- source: conventions

Đầu file khai «Danh sách lệnh kiểm CỐ ĐỊNH — nguồn sự thật là config, KHÔNG phải hằng trong ca», và LM1 dựng đúng như vậy cho chiều xanh. Nhưng mutant m3 lại gõ tay hai hằng lấy từ config: nó splice sau dòng khớp chính xác `    - executors.script.product_map`, rồi đòi thông điệp đỏ ghim nguyên văn `node scripts/eval-coverage-lint.js .` (giá trị của `executors.script.coverage_lint`).

Đổi lệnh coverage-lint trong _acceptance/config.yaml — một sửa đổi hoàn toàn hợp lệ, không đụng ô này — làm LM1 đỏ với «khong do dung ve», tức đỏ vì hạ tầng chứ không vì vật. Đổi tên/vị trí `product_map` trong suite_keys thì tệ hơn: findIndex trả -1, splice chèn dòng rác lên đầu file, mutant vẫn «đổi được gì» nên không rơi vào nhánh cảnh báo, và ca đỏ với thông điệp không nói được nguyên nhân thật.

Hướng sửa: chọn khoá cần chèn và giá trị kỳ vọng bằng cách suy từ chính suite_keys/executors lúc chạy (vd lấy một khoá `executors.script.*` chưa có trong suite_keys, resolve nó rồi dùng làm needle), và chèn theo phần tử cuối của khối thay vì theo một dòng gõ tay.

Mutant gõ tay hằng số thay vì lấy từ config lúc chạy — trực tiếp vi phạm điều AC-7 cấm là fixture do người viết tự liệt thay vì do code sinh trong chính lượt chạy.

### LM6 vế «muc 2b» là assertion chết — đo trên TRỌN GUIDE.md nên được thoả bởi văn bản có sẵn không liên quan; mutant m4 che đúng lỗ đó
- file: `tests/plugins/lan-may-classifier.test.mjs:219`
- severity: high
- AC: AC-7
- source: bugs

`checkGuide` đo `/tuần tự/i` trên TRỌN nội dung GUIDE.md (biến `g = flat(guideText)`), không đo trong phạm vi mục mới. GUIDE.md đã có sẵn 'tuần tự' ở dòng 307 và 372 (`git show 02d9bb5:GUIDE.md` xác nhận cả hai có TRƯỚC diff này), hoàn toàn không liên quan tới đường thoái hoá của bộ phân loại.

Kịch bản hỏng đã chạy thử: xoá TRỌN mục '## Làn máy và bộ phân loại an toàn' khỏi GUIDE.md rồi cho đi qua chính `checkGuide` → trả về `["muc 1","muc 1b","muc 2"]`, KHÔNG có 'muc 2b'. Nghĩa là mệnh đề «GUIDE nói lượt kế đi TUẦN TỰ» (AC-6, nửa thứ hai) không bao giờ đỏ được, kể cả khi câu đó bị xoá sạch.

Mutant m4 (dòng 394) không phát hiện được vì `runText` tiêm TOÀN CỤC (`src.split('tuần tự').join('kiểu khác')`) — nó xoá cả 3 lần xuất hiện trên toàn file, gồm hai lần ở dòng 307/372. Nên mutant vẫn đỏ và LM6 vẫn in PASS «4 mutant đo đúng vế», trong khi vế đó thật ra chỉ chứng minh 'GUIDE không còn chữ tuần tự ở BẤT KỲ đâu', không chứng minh mục mới còn nói điều đó. Đây đúng lớp «thước không gắn vào vật được giao» + «phép đo vừa khít mutant của chính nó» mà CLAUDE.md và chính evals.yaml (E7) nêu tên.

Cùng hình dạng, chưa nổ nhưng cùng cơ chế: `muc 1b` (dòng 217) cũng đo `/lệnh kiểm/i` trên trọn file — hôm nay chỉ có 1 lần xuất hiện nên còn sống, nhưng bất kỳ ai viết 'lệnh kiểm' ở chỗ khác trong GUIDE là vế đó chết im lặng y hệt.

Sửa theo LỚP: trích khối mục mới (mốc neo, như `block()` đã làm cho LM4/LM5) rồi đo trong khối, thay vì đo trên trọn file; và cho mutant tiêm CHỈ trong phạm vi khối để nó chứng được đúng điều nó tuyên.

Phá thử (xoá trọn mục mới) chứng minh vế đo không bao giờ đỏ được dù nội dung bị xoá sạch — đúng lỗi AC-7 cấm về mệnh đề đo được không có chiều đỏ thật qua chính bộ kiểm.

### Ma trận mutant không toàn phần: mỗi «vế» là phép AND hai điều kiện + có phép HOẶC bên trong, nhưng chỉ một lệnh tiêm cho cả vế
- file: `tests/plugins/lan-may-classifier.test.mjs:200`
- severity: medium
- AC: AC-7
- source: measurement

E4 khai «MA TRẬN 3 MUTANT: m1..m3 = bản sao xoá lần lượt từng vế» và E5 khai «m1..m3 = xoá lần lượt từng vế», nhưng từng vế trong code không phải một mệnh đề — nó là AND của hai điều kiện, và một trong hai còn chứa phép HOẶC:

- Dòng 200 (`checkAdvice` vế a): `if (!/KHỚP CHÍNH XÁC/.test(b) || !/KHÔNG dùng \`*\`|không glob/i.test(b))`. Mutant duy nhất của vế a là `['m1-bo-dang-khai', 'KHỚP CHÍNH XÁC', ...]` (dòng 384) — nó chỉ bẻ vế trái. Không lệnh tiêm nào xoá cụm «KHÔNG dùng `*`» khỏi `commands/acceptance-init.md`, nên nửa «không glob» của vế a — chính là nửa mang nội dung an ninh của AC-4 — chưa bao giờ được chứng biết đỏ. Thêm nữa, vật chỉ chứa «KHÔNG dùng `*`», nên nhánh `|không glob` là vế chết: không lệnh tiêm nào chứng minh nó đổi được một dòng.
- Dòng 181 (`checkFallback` vế 2): `!/tuần tự/i.test(b) || !/KHÔNG dispatch lại fan-out|KHÔNG fan-out lại/i.test(b)`. Mutant m2 chỉ bẻ cụm «KHÔNG dispatch lại fan-out»; điều kiện `/tuần tự/i` — hành động bắt buộc mà AC-5 mô tả là trọng tâm — không có mutant nào. Vật chỉ chứa «KHÔNG dispatch lại fan-out», nên nhánh `|KHÔNG fan-out lại` cũng là vế chết.
- Cùng hình dạng ở vế 1 (dòng 178: `(classifier|bộ phân loại)` không mutant) và vế 3 (dòng 184: `/acceptance/` không mutant).

Số assert thực (6 điều kiện ở LM5, 4 ở LM4) lớn hơn số mutant (3 và 3), nên «ma trận» chỉ là điểm-case. Điều này đáng chú ý vì chính file ca ghi ở comment dòng 216–218 rằng cố ý tránh phép HOẶC («một vế của phép hoặc luôn còn sống thì vế kia chết mà không ai biết») — luật đó được giữ ở `checkGuide` nhưng bị vi phạm ở `checkAdvice` và `checkFallback`.

Các nhánh HOẶC không có mutant riêng là vế chết không lệnh tiêm nào chứng minh đổi được, đúng lỗi AC-7 cấm (mỗi mệnh đề đo được phải có chiều đỏ thật, không được là thước vừa khít một tập mutant hẹp hơn số điều kiện thật).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **LM3 đóng băng TOÀN BỘ .claude/settings.json vào một sha cố định — mọi sửa hợp lệ về sau (bật thêm plugin) sẽ làm suite plugins đỏ vì hạ tầng**
  Người dùng thấy gì: Chốt cấu hình quyền hiện tại sẽ tự báo lỗi mỗi khi có một thay đổi hợp lệ khác trong tương lai (ví dụ bật thêm một tiện ích mới), kể cả khi thay đổi đó không liên quan gì tới tính năng này — có thể làm gián đoạn oan uổng các đợt kiểm tra sau này.
  file: `tests/plugins/lan-may-classifier.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Bảng ma trận mutant tự mâu thuẫn ở E2 và E6 — đúng lớp lỗi commit 8706e8f9 vừa sửa**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi sai số lượng kịch bản kiểm thử ở hai mục, không khớp với số thực tế đã chạy — người đọc lại hồ sơ sau này có thể hiểu nhầm mức độ đã được kiểm kỹ tới đâu.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Luật cho-phép bỏ qua bộ phân loại cho script nằm trong cây làm việc — nhánh PR sửa run-tests.sh vẫn được chạy không hỏi**
  Người dùng thấy gì: Danh sách lệnh được tự động cho phép chạy bao gồm cả các script mà chính nhánh đang chờ duyệt có thể vừa sửa đổi — lời giải thích 'các script này đã được rà soát an toàn' chưa hẳn đúng khi đang xét một thay đổi chưa được duyệt.
  file: `.claude/settings.json`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml khai số mutant tự mâu thuẫn ở E2 và E6 — trái với bảng MUTANT-MATRIX và trái với bộ ca thật**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi sai số lượng kịch bản kiểm thử ở hai mục, không khớp với số thực tế đã chạy và với chính bảng tổng hợp trong cùng hồ sơ — dễ gây hiểu nhầm về phạm vi đã kiểm khi đọc lại sau này.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Số mutant trong `expected` của E2 và E6 mâu thuẫn với marker MUTANT-MATRIX và với code**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi sai số lượng kịch bản kiểm thử ở hai mục so với số thực tế và so với bảng tổng hợp trong cùng tài liệu — người đọc lại hồ sơ có thể nhận thông tin sai về mức độ đã kiểm.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
