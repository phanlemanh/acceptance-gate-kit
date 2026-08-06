## Trong hợp đồng

### 1. stripMd vẫn nuốt dấu sao của glob trên THẺ THẬT — 2 hình dạng chưa được chặn (AC-6 đỏ trên dữ liệu sống)
- file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/gate-card.js:132`
- severity: high
- AC: AC-6
- detail: Guard `[^*/]` chỉ chặn ký tự đứng NGAY TRƯỚC dấu MỞ. Hai hình dạng thật trong corpus vẫn cụt, đã render thẻ thật để xác nhận (không phải suy diễn):

  (a) glob nằm trong đoạn-mã BÊN TRONG một cụm đậm — dấu `**` đóng bị ghép với `**` của glob. Nguồn `_acceptance/t1-escape-event-scope/contract.md:52`:
      `- **Miễn trừ ` + "`.github/**`" + ` khỏi ` + "`t1_skip_globs`" + `.**`
  Sau khi lột nháy ngược, luật 2-sao (dòng 132) khớp `** … .github/**` (đóng đứng sau `/` — không có guard cho dấu ĐÓNG).
      `node scripts/gate-card.js --root . --slug t1-escape-event-scope --gate 1` in ra: `Miễn trừ .github/ khỏi t1_skip_globs.**` — glob mất `**` VÀ thẻ còn rớt lại một cụm `**` trần trước mặt người.

  (b) glob mở đầu bằng MỘT sao `*/…` — luật 1-sao (dòng 133) ghép hai đầu glob thành cặp nghiêng. Nguồn `_acceptance/gap-probe-presence-hook/decisions.jsonl` có `*/_acceptance/*`;
      `node scripts/gate-card.js --root . --slug gap-probe-presence-hook --gate 1` in ra `Glob /_acceptance/ trong pre-merge-check.sh …` — mất cả hai sao.

  Ma trận STRIP-SHAPE-MATRIX khai `glob-mở-đầu-hai-sao` (`**/*.ts`) và `đậm-và-glob-cùng-dòng` (glob NGOÀI cụm đậm), nhưng không khai hai hình dạng trên, nên E2 không bắt; E6/E7/E9 cũng để lọt. Cùng lỗi ở bản mirror `plugins/acceptance-gate/scripts/gate-card.js:132-133`.

### 2. E6 đo bằng hiệu số `n_new > n_old` thay vì quan hệ toàn phần AC-6 hứa — biên chỉ 2, mutant thật vẫn xanh
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6898`
- severity: high
- AC: AC-6
- detail: AC-6/E6 hứa "MỌI đường dẫn chứa sao xuất hiện nguyên vẹn trong thẻ", nhưng chốt duy nhất là `assert n_new > n_old`. Đo thật trên cây hiện tại: bản mới giữ nguyên 14/36 want-instance, bản trước-diff giữ 12/36 → xanh với biên 2. Nghĩa là 22 instance không nguyên vẹn (gồm hai ca ở finding 1) mà phép đo không nói gì.

  Đối chứng theo nghi thức CLAUDE.md (phá vật thật trong bản sao): tiêm mutant bỏ guard `/` khỏi RIÊNG luật 1-sao (`(^|[^*/])\*…` → `(^|[^*])\*…`) — một hồi quy thật, làm `commands/*.md` cụt thành `commands/.md` — rồi chạy lại đúng `intact_count`: kết quả vẫn 14 vs 12 → `n_new > n_old` VẪN XANH. Đây đúng lớp lỗi review round 2 đã REJECT ("E6 hẹp hơn, checked 3/36"): bản S4-r2 đổi hình dạng chốt chứ chưa gắn thước vào vật.

### 3. E9: LEFTOVER là bản chép nguyên biểu thức đang bị kiểm → phép đo trùng lặp với vật, không bắt được hai ca ở finding 1
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6907`
- severity: medium
- AC: AC-9
- detail: `LEFTOVER = re.compile(r"(?:^|[^*/])\*\*(?=\S)[^*]+?(?<=\S)\*\*(?!\*)")` (6907) là bản dịch từng ký tự của luật 2-sao ở `gate-card.js:132`. Hậu-điều-kiện vì thế tautological: mọi chuỗi bản JS chịu lột thì Python cũng thấy hết, mọi chuỗi bản JS bỏ qua thì Python cũng bỏ qua. Cụ thể, cả hai ca hỏng thật ở finding 1 đều KHÔNG sinh cặp đậm dư (ca (a) chỉ để lại `**` lẻ, ca (b) không để lại sao nào) nên `left_new` rỗng và E9 xanh. Nếu chính guard `[^*/]` sai, bản chép sai y hệt → không thể đỏ.

  Kèm theo là lệch spec: `_acceptance/card-text-fidelity/evals.yaml` khai E9 phải "chạy qua cả bản cũ lẫn bản mới — mọi chênh lệch phải phân loại được vào một hình dạng CÓ TÊN trong marker", còn `scan_corpus` (6908-6919) không chạy bản cũ và không ánh xạ chênh lệch nào về tên hình dạng. E7 lệch tương tự: evals.yaml khai "sinh thẻ bằng bản cũ VÀ bản mới… cụm sao chỉ-có-ở-bản-mới", còn `untraceable(CARD)` (6941) chỉ chạy bản mới.

### 4. Đo CHỈ DẪN thay vì ĐẦU RA (+ tuyên quét LỚP nhưng chỉ có 2 điểm-case): E10 chỉ đếm chuỗi `stripMd(` trong mã nguồn rồi so với con số viết trong contract
- file: `tests/plugins/run-tests.sh:6954`
- severity: high
- AC: AC-10
- detail: E10 (dòng 6953-6957) gồm đúng 3 dòng đo:

      calls = len(re.findall(r"stripMd\(", CARD.read_text(encoding="utf-8")))
      mc = re.search(r"CE:\s*\*\*(\d+)\*\*\s*chỗ gọi hàm lột", contract)
      assert calls == int(mc.group(1)), ...

  Cả HAI vế đều là văn bản khai báo: một bên là grep trên file mã nguồn, một bên là con số **14** viết tay ở mục Coverage trục C của contract.md. Không có đầu ra nào của thẻ được sinh ra trong E10.

  Lời hứa của AC-10/E10 là: mỗi lối gọi khác biệt (thẻ Cổng 1, thẻ Cổng 2, các lối in dự phòng) có ít nhất một đầu ra thật được sinh và kiểm; lối không đo phải có dòng `descope` nêu số lượng. Trong toàn bộ P161 chỉ có 2 lối được sinh đầu ra thật — `card(js, slug, "1")` và `card(js, slug, "2")` (dòng 6833-6836) — tức 2/14 chỗ gọi. 12 chỗ gọi còn lại (các lối in dự phòng / card-plain) không có ô đo nào, và cũng không có bất kỳ assert nào kiểm sự tồn tại của dòng `descope` cho chúng. Hai hình dạng cùng lúc: đo trên chỉ dẫn/khai báo, không chạm vật được giao; VÀ tuyên là quét cả LỚP "mọi lối gọi" nhưng ma trận toàn phần không tồn tại — số assert (1) khác số phần tử (14).

### 5. Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ giữa hai bản: E9 không hề chạy corpus qua bản cũ, chỉ soi một regex hậu-điều-kiện trên bản mới
- file: `tests/plugins/run-tests.sh:6920`
- severity: high
- AC: AC-9
- detail: evals E9/AC-9 hứa một quan hệ ba chiều: "rút MỌI cụm dấu sao từ hồ sơ thật, chạy qua CẢ BẢN CŨ LẪN BẢN MỚI — mọi CHÊNH LỆCH phải phân loại được vào một hình dạng CÓ TÊN trong marker; chênh lệch không thuộc hình dạng nào → ĐỎ kèm chuỗi gốc".

  Hiện thực (dòng 6907-6922):

      LEFTOVER = re.compile(r"(?:^|[^*/])\*\*(?=\S)[^*]+?(?<=\S)\*\*(?!\*)")
      def scan_corpus(strip_fn): ... if LEFTOVER.search(out): left.append(...)
      left_new, cum_count = scan_corpus(strip_new)
      assert not left_new, ...

  `strip_old` KHÔNG bao giờ được truyền vào `scan_corpus` (grep cả khối: `scan_corpus` chỉ được gọi với `strip_new` ở 6920 và `strip_mut` ở 6941). Không có phép trừ hai tập kết quả, không có bước phân loại chênh lệch về tên hình dạng trong `SHAPES`, không có thông điệp nào nêu tên hình dạng. Cái còn lại là một assert "mẫu chuỗi `**x**` không còn xuất hiện trong đầu ra" — sự có mặt/vắng mặt của một chuỗi, thay cho quan hệ (đầu ra cũ × đầu ra mới) ⇒ tập hình dạng có tên. Hệ quả đo được: mọi hồi quy trên nhánh nghiêng (`*x*`) hoặc ba sao (`***x***`) trong corpus thật đều lọt; mọi chênh lệch cũ↔mới không tạo ra cặp đậm sót lại đều vô hình.

### 6. Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ append-only theo khối: E11 chỉ kiểm dòng `assert ` cũ có nằm đâu đó trong file mới
- file: `tests/plugins/run-tests.sh:6950`
- severity: medium
- AC: AC-11
- detail: AC-11/E11 hứa quan hệ giữa hai bản file: "các khối P đã có TRƯỚC mốc chỉ được THÊM dòng, không đổi/không xoá assert cũ".

  Hiện thực (dòng 6948-6951):

      old_asserts = [l.strip() for l in r.stdout.split("\n") if l.strip().startswith("assert ")]
      new_text = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
      missing = [l for l in old_asserts if l not in new_text]
      assert not missing, ...

  Phép đo rút gọn quan hệ "khối P cũ ⊆ khối P mới, không sửa" thành "mỗi dòng bắt đầu bằng `assert ` của bản cũ có mặt như substring ở BẤT KỲ đâu trong file mới". Ba hệ quả: (1) không ràng buộc vị trí — một assert bị xoá khỏi P53 vẫn xanh nếu chuỗi y hệt tồn tại ở P161 hay bất kỳ khối nào khác (bản cũ đã có ít nhất 5 dòng assert trùng lặp); (2) chỉ soi dòng `assert `: mọi dòng KHÔNG phải assert của phép đo cũ (hằng số kỳ vọng, `want = [...]`, regex, danh sách MUST, ngưỡng) có thể bị sửa/xoá tự do mà E11 vẫn xanh — đúng vector "hạ thước cho vừa vật" mà AC-11 định chặn; (3) `assert not missing` chân-không-đúng nếu `old_asserts` rỗng, không có assert sàn `len(old_asserts) > 0` như các chân khác cùng khối.

### 7. Đối chứng dương có thể suy biến mà không ĐỎ: `card()` nuốt exit khác 0, `intact_count(old_js)` không có sàn sanity
- file: `tests/plugins/run-tests.sh:6896`
- severity: medium
- AC: AC-6
- detail: `card()` (6833-6836) trả `None` khi `r.returncode != 0`, và cả hai chỗ tiêu thụ đều bỏ qua im lặng (`if out is None: continue` ở 6865 và 6892). `r.stderr` không bao giờ được đọc.

  Bên bản MỚI có chốt: `assert n_new > 0` (6897). Bên bản CŨ thì không — `n_old` chỉ xuất hiện trong `assert n_new > n_old` (6898-6899). Nếu `old_js` không chạy được như một script hoàn chỉnh (thiếu file trong `dd/lib`, đổi cờ dòng lệnh, lỗi require) thì mọi lời gọi `card(old_js, ...)` trả `None`, `n_old == 0`, và `n_new > 0 > 0` cho ra XANH — đúng màu xanh mà một đối chứng dương chạy thật cũng cho. Hình dạng "assertion âm-tính-một-mình" ở chân đối chứng: kết luận "bản mới giữ được nhiều đường dẫn hơn bản cũ" không phân biệt được "bản cũ thật sự làm cụt đường dẫn" với "bản cũ chưa bao giờ chạy". Thiếu một `assert n_old > 0` trước khi tin quan hệ `n_new > n_old`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **must_fail() — chân đo tự-chứng-minh-ĐỎ được khai báo nhưng KHÔNG BAO GIỜ được gọi**
  Người dùng thấy gì: Một số phép kiểm nội bộ của tính năng này chưa tự chứng minh được rằng chúng biết nhận ra lỗi. Nếu sau này có lỗi thật đúng ở những chỗ đó, hệ thống có thể vẫn báo "ổn" mà không ai phát hiện ngay.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6737`
  severity: high
  Đề xuất: known-limits

- **card() nuốt lặng lỗi render (`if out is None: continue`) — E6/E7 mất phạm vi mà vẫn xanh, không có bộ đếm sanity**
  Người dùng thấy gì: Nếu công cụ sinh thẻ trong tương lai lỗi trên phần lớn hồ sơ, bộ kiểm nội bộ có thể không nhận ra và vẫn báo "ổn" dù phạm vi thực tế đã âm thầm co lại.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6833`
  severity: medium
  Đề xuất: known-limits

- **Out of scope của contract biện minh bằng tiền đề SAI: stripMd không hề dùng chung với trang bằng chứng / bản đồ sản phẩm**
  Người dùng thấy gì: Một dòng giải thích trong hồ sơ chấp thuận nêu lý do không chính xác cho việc không cần kiểm lại hai màn hình khác, dù kết luận "không cần kiểm" vẫn đúng — có thể gây hiểu lầm cho người đọc lại hồ sơ này sau này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/_acceptance/card-text-fidelity/contract.md:113`
  severity: medium
  Đề xuất: known-limits

- **Khối chú thích stripMd: câu cụt "Chữ" giữa dòng + chú thích cũ để lại thành mâu thuẫn, và trỏ vào đường dẫn workspace kit-local**
  Người dùng thấy gì: Một đoạn ghi chú giải thích trong mã có câu bị cụt và trỏ tới một tài liệu nội bộ của bộ công cụ thay vì tới bộ kiểm — không ảnh hưởng gì tới việc thẻ quyết định hiển thị đúng hay sai cho người dùng, chỉ gây khó hiểu cho người đọc mã sau này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/gate-card.js:113`
  severity: low
  Đề xuất: known-limits

- **card() nuốt exit code + stderr; `if out is None: continue` bỏ qua slug âm thầm, không có bộ đếm thẻ đã render**
  Người dùng thấy gì: Nếu công cụ sinh thẻ gặp lỗi trên một phần hồ sơ, bộ kiểm nội bộ có thể bỏ qua các hồ sơ đó một cách âm thầm thay vì báo lỗi rõ ràng.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6833`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
