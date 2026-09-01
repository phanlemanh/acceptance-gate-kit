## Trong hợp đồng

### `--gate 0` đi vòng qua NO-DOSSIER-GUARD → thẻ ma Cổng Đáng (tái phát lớp #121)
- file: `scripts/gate-card.js:140`
- severity: high
- AC: AC-6
- detail: Chốt «không có hồ sơ thì không vẽ thẻ» chỉ chạy trong nhánh `if (!contract.trim())`, và nhánh đáy giờ là `if (gate !== '0')`. Vì `gate` đọc từ `--gate` TRƯỚC khi chốt chạy, một `--gate 0` tường minh xuyên qua cả hai lớp. Đã dựng lại và xác nhận hai ca:

  (a) hồ sơ CÓ contract.md (đã qua Cổng Phạm vi), chạy `--gate 0` → exit 0 + trọn thẻ Cổng Đáng, tiêu đề là slug, bốn nút lối ra sống, mời người ký lại một cổng đã đi qua;
  (b) hồ sơ tồn tại nhưng RỖNG (không contract.md, không opportunity.md), `--gate 0` → cũng exit 0 + trọn thẻ, mục Ngưỡng ghi «chưa có», khối «VIỆC CỦA ANH» vẫn bảo «Chọn một lối ra».

  Đây đúng lớp lỗi mà hồ sơ `khong-ve-the-ma` (#121, 29/08) đã ký để dẹp — người được mời ký trên hư không, false-green ở tầng trình bày. Ghi chú ngay trên chốt còn khẳng định «Chốt đặt TRƯỚC mọi nhánh đường ra (--extract lẫn render, Cổng 1 lẫn Cổng 2) nên một chỗ che hết»; lời khai đó nay sai vì Cổng Đáng có một đường ra chốt không phủ. Cả GD01–GD08 lẫn 13 chân `rang.sh` đều không có ca nào truyền `--gate`, nên không phép đo nào bắt được.

  Slug không tồn tại thì vẫn bị chặn đúng — lỗ chỉ ở hai ca trên.

### Sáu hàng `g0` trong GATE-ONESHOT-SLOTS lệch khuôn khối: liệt GIÁ TRỊ thay vì nhãn chỗ trống, và nhãn thật `lối ra` không được khai
- file: `skills/acceptance/references/human-facing-language.md:260`
- severity: low
- AC: AC-10
- detail: Khối này tự khai là «Danh sách nhãn chỗ trống máy-đọc», và mọi hàng cũ đúng vậy (`g1 duyệt hay sửa`, `g2 ký hay trả`, `extra tên`). Sáu hàng mới thì trộn hai loại: `g0 giữ proto` / `g0 không đo được` là mệnh đề tuỳ chọn, còn `g0 làm|lặp|xếp lại|dừng` là bốn GIÁ TRỊ trả lời. Chỗ trống mà thẻ thật render lại là «Trả lời mẫu (một dòng, điền vào chỗ trống): «lối ra: ___»» — nhãn `lối ra` không có hàng nào.

  Hệ quả: hai bộ đọc round-trip hiện có (`tests/plugins/run-tests.sh` P191 dòng 9438, P192 dòng 9485, và bản python dòng 9597) đều lọc `^(g1|g2|extra) ` nên bỏ qua sạch sáu hàng g0 — bảo đảm hai-chiều thẻ↔ngữ-pháp mà khối này tồn tại để giữ KHÔNG phủ được Cổng Đáng. Câu dẫn ngay trên khối cũng chưa sửa: vẫn viết «cột một là cổng (`g1`/`g2`) hoặc `extra`».

  Kế hoạch gốc (docs/superpowers/plans/2026-08-23-ra-co-ten-lam-va-trao.md:1016) khai đúng khuôn: `g0 lối ra` · `g0 giữ proto` · `g0 không đo được`.

### gate-card and start-scan disagree on which dossiers are at Cổng Đáng (decision set while stage still discovery)
- file: `scripts/gate-card.js:138`
- severity: high
- AC: AC-1
- detail: `if (!dec0) gate = '0';` keys the Gate-0 lane on `decision` alone, while scripts/start-scan.mjs:417 keys it on `stage !== 'decided' || !decision`. Any opportunity.md with `stage: discovery` (or any non-`decided`/non-`archived` stage) plus a non-empty `decision` falls into the gap.

  Reproduced: opportunity.md with `stage: discovery`, `decision: iterate`, threshold filled →
    start-scan: `{"gate":"dang","stateKey":"cho-cong-dang","label":"chờ chữ ký — Cổng Đáng","viecKe":"người: quyết có làm việc này không"}`
    gate-card: exit 2, `gate-card: hồ sơ chưa có contract.md «x» …`
  So /start lists the item as awaiting a signature, hands the human to /acceptance-card, and the card refuses with the wrong cause and sends them to write a contract (S1) instead. `decision: park` with `stage: discovery` is worse: the scanner says "chờ chữ ký" while the card says "ý đã đóng".

  This is exactly the A\B ≠ ∅ condition the new code claims to hold (comment at line 112-114: «máy quét vào phiên và bộ dựng thẻ phải cho CÙNG kết luận trên cùng hồ sơ»). The rang.sh `hai-bo-doc` chân does not catch it because its fixture only builds `decided+build` (o6-da-ky), never `discovery+<decision>`. A partial frontmatter write by the approve flow (decision written, stage not) lands directly in this state.

  Fix: gate on the same predicate the scanner uses, or better, export that predicate from lib/ and have both readers call it.

### `--gate 0` bypasses the no-dossier guard and renders a ghost Cổng Đáng card
- file: `scripts/gate-card.js:140`
- severity: medium
- AC: AC-6
- detail: The guard's final branch was changed from an unconditional `process.exit(2)` to `if (gate !== '0') { … exit(2) }`. `gate` can be '0' from the CLI (`let gate = opt('--gate')`), not only from the new internal assignment at line 138, so an explicitly-passed `--gate 0` now falls out of the guard without exiting.

  Reproduced: dossier dir exists, no contract.md, no opportunity.md at all →
    `node scripts/gate-card.js --root $T --slug x --gate 0` → exit 0, full Cổng Đáng card on stdout, title = the slug, four live exit buttons and a «👉 VIỆC CỦA ANH — Chọn một lối ra» block. The human is invited to sign on a dossier with no content.

  This is the same false-green class the NO-DOSSIER-GUARD block was written to close (comment at lines 66-72, tests GM01/GM05). The guard should require `opp0.trim()` to be non-empty before allowing the Gate-0 fall-through, i.e. gate the exception on the internal assignment rather than on the value of `gate`.

### Tuyên quét LỚP nhưng số phần tử viết cứng — bốn nấc ngưỡng không rút từ lib
- file: `_acceptance/cong-dang-co-cua/rang.sh:174`
- severity: high
- AC: AC-2
- detail: Chân `nguong-chua-chot` chạy `for n in n1 n2 n3 n4` và chốt `[ "$DEM" = "12" ]` (dòng 192) — cả tập nấc lẫn tổng số assert đều là literal trong file đo. evals.yaml E2 (dòng 43-45) khai bất biến: «Bốn nấc RÚT TỪ lib/nguong-o-co-hoi.cjs (thresholdState + prefixes), KHÔNG gõ literal — thêm một nấc ở lib mà quên ở đây thì chân này phải đỏ vì đếm lệch». Trong mã không có một lượt đọc nào lấy tập trạng thái ra từ lib (khác hẳn chân `anh-xa-du-hang` dòng 528 vốn rút `NAV_RULES[...].decision.enum` thật). lib/nguong-o-co-hoi.cjs hiện trả bốn giá trị ('khong-do-duoc' | 'chua-chot' | 'de-xuat' | 'chot'); thêm nấc thứ năm ở lib thì ma trận vẫn 4×3=12 và chân này vẫn xanh — đúng ca «số phần tử viết trước lặng lẽ thành số ô dựng được» mà chính eval nói mình đi chặn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **SELF01 xanh cả khi phép quét KHÔNG chạy — chính lớp lỗi ca này sinh ra để chặn**
  Người dùng thấy gì: Bộ tự kiểm nội bộ của kit có thể báo 'đạt' ngay cả khi phép rà soát bên trong không thực sự chạy, nên một lỗi thật trong công cụ có thể lọt qua mà không ai hay biết.
  file: `tests/scripts/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Đối chứng dương SELF02 CHÉP công thức của SELF01 thay vì GỌI nó**
  Người dùng thấy gì: Bài kiểm chứng minh 'lỗi thật sẽ bị phát hiện' lại không kiểm đúng cơ chế đang chạy thật, nên nếu cơ chế rà soát chính bị hỏng, không có cảnh báo nào bật lên.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **`commands/acceptance-card.md` chưa biết làn Cổng Đáng — bước bàn giao bỏ trống, bước dịch chỉ sai**
  Người dùng thấy gì: Người vào thẳng màn ký Cổng Đáng qua đường tắt (không qua bước khởi động) có thể thấy hướng dẫn bước tiếp theo ghi sai tên lệnh cần gõ, và một bước dịch sang ngôn ngữ dễ hiểu có thể chạy nhưng kết quả bị bỏ phí, không hiển thị ở đâu cả.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **Unreadable or oversized opportunity.md is swallowed and reported as "chưa có contract.md"**
  Người dùng thấy gì: Nếu hồ sơ cơ hội không đọc được (ví dụ do quyền truy cập bị chặn) hoặc quá lớn, người dùng nhận thông báo yêu cầu viết lại đặc tả từ đầu, dù vấn đề thực chất là file bị hỏng hoặc không mở được — khiến người mất thời gian làm sai việc cần làm.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **`--plain` overlay is silently discarded on the Gate-0 card**
  Người dùng thấy gì: Khi bật chế độ hiển thị ngôn ngữ dễ hiểu, thẻ cổng vẫn hiện nguyên văn thô của hồ sơ thay vì bản đã dịch, dù hệ thống không báo lỗi gì — người xem thẻ không được lợi ích của bản dịch mà không hay biết.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **rang.sh `mot-nguon` chân passes vacuously if any of the three marker blocks goes missing**
  Người dùng thấy gì: Nếu một trong các khối đối chiếu nội bộ về tên lối ra bị xoá hoặc đổi tên nhầm, bài kiểm tra có thể vẫn báo 'khớp nhau' thay vì báo lỗi, khiến sai lệch âm thầm tồn tại mà không ai biết.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: đối chứng dương của (2) đo một cơ chế KHÁC, phép quét thật không bao giờ khớp được**
  Người dùng thấy gì: Bài kiểm bảo đảm thẻ không tự điền sẵn quyết định thay người dùng thực ra không thể phát hiện nếu điều đó xảy ra, vì nó không soi đúng phần liên quan — rủi ro máy âm thầm quyết định thay người có thể không được cảnh báo.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ dòng — dấu «máy đề xuất»**
  Người dùng thấy gì: Bài kiểm xác nhận dấu hiệu 'mức do máy đề xuất' nằm đúng chỗ trên thẻ thực ra chỉ kiểm dấu hiệu đó có xuất hiện ở bất kỳ đâu trên thẻ, nên nếu dấu hiệu bị gắn nhầm sang dòng khác, không có cảnh báo nào bật lên.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Đối chứng dương CHÉP CÔNG THỨC thay vì gọi phép quét đang được canh (SELF01/SELF02)**
  Người dùng thấy gì: Bài kiểm chứng minh 'lỗi thật sẽ bị phát hiện' lại không kiểm đúng cơ chế đang chạy thật, nên nếu cơ chế rà soát chính bị hỏng, không có cảnh báo nào bật lên.
  file: `tests/scripts/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Chiều đỏ tự-thoả: chỉ grep lại chuỗi vừa bị perl thay, không chạy lại phép đo**
  Người dùng thấy gì: Một lượt kiểm tra được thiết kế để phát hiện lỗi thứ tự/tên lệnh sai chỉ xác nhận rằng bản sao thử nghiệm đã bị sửa, chứ không chạy lại phép đo thật — nên nếu phần đo thứ tự và tên lệnh bị gỡ bỏ, bài kiểm này vẫn báo đạt.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» thay cho QUAN HỆ tên-lệnh-khớp-thân-lệnh-có-thật**
  Người dùng thấy gì: Bài kiểm xác nhận tên lệnh ký khớp với lệnh thật lại chỉ tìm một dòng tiêu đề không liên quan, nên nếu hướng dẫn ghi sai tên lệnh cần gõ, không có cảnh báo nào bật lên.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Khai «BẰNG NHAU» nhưng đo tập CON — bên ngữ pháp chỉ được kiểm một chiều**
  Người dùng thấy gì: Phép so sánh nhãn bốn lối ra giữa nơi vẽ thẻ và nơi ghi ngữ pháp chỉ kiểm được một chiều, nên nếu bên ghi có thêm nhãn thừa hoặc sắp xếp sai thứ tự, không có cảnh báo nào bật lên dù lời hứa là khớp nhau hoàn toàn.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Assert in PASS vô điều kiện — kết luận «phân biệt được» không đọc kết quả vòng lặp**
  Người dùng thấy gì: Một dòng nhật ký nội bộ báo 'phân biệt được' được in ra vô điều kiện, kể cả trong đúng lượt phát hiện lỗi — có thể khiến người đọc log hiểu nhầm là mọi thứ ổn dù có lỗi được ghi nhận riêng.
  file: `_acceptance/cong-dang-co-cua/rang.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 11/18 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/run-tests.sh, _acceptance/cong-dang-co-cua/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.