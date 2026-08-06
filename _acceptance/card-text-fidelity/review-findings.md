## Trong hợp đồng

### E6 (AC-6) không phân biệt được bản đã sửa với bản có lỗi — xanh trên chính bản TRƯỚC-DIFF
- file: `tests/plugins/run-tests.sh:6885`
- severity: high
- AC: AC-6
- source: conventions
- detail: Dòng 6885 `if re.search(re.escape(stem) + r"(?![A-Za-z0-9_.*/-])", src_all): continue` bỏ qua TOÀN BỘ phần quét bản-cụt cho glob nào mà chuỗi gốc (đã bỏ sao) cũng xuất hiện hợp lệ ở đâu đó trong nguồn. Đo thật trên corpus: 12/18 glob bị bỏ qua, gồm chính `plugins/**` trong contract của card-text-fidelity, `lib/**` + `hooks/**` của gate-card-ac-visibility, `_acceptance/*` của 3 slug.

  Đối chứng dương (nghi thức CLAUDE.md "phá vật thật trong một bản sao, phép đo này có đỏ không?"): tôi dựng scripts/gate-card.js tại mốc 044968e (bản CÓ lỗi mà feature này đi sửa) rồi chạy đúng logic E6 → `checked=3, fails=0` — Y HỆT bản mới. Nghĩa là E6 không thể đỏ trên vật hỏng, và assert duy nhất đóng chân này (`assert checked > 0`, dòng 6890) chỉ ghim sự tồn tại của 3 chuỗi con, trong khi AC-6 hứa quan hệ TOÀN PHẦN "mọi đường dẫn đó xuất hiện nguyên vẹn".

  Đây đúng finding high của review round 1 (`review-findings.md`, mục "Hình dạng 3 — E6/AC-6 hứa MỌI đường dẫn nguyên vẹn nhưng assert chỉ là có ít nhất một chuỗi có mặt") — bản sửa S4-r1 làm phạm vi đo HẸP đi (checked 10 → 3) chứ không làm nó sống lại. Vi phạm bất biến CLAUDE.md "Assertion âm-tính-một-mình là assertion không sống" và "Thước phải gắn vào vật được giao".

### E9 (AC-9) không thể đỏ — mệnh đề thoát `set(b) >= set(a)` là phép so TỪ VỰNG ký tự
- file: `tests/plugins/run-tests.sh:6917`
- severity: high
- AC: AC-9
- source: conventions
- detail: Dòng 6917: `if len(b) >= len(a) and a == re.sub(r"\*", "", b) or set(b) >= set(a): continue`. Ưu tiên Python cho `(len&&eq) or (set(b) >= set(a))` — vế thứ hai chỉ so TẬP KÝ TỰ, mà bản mới theo định nghĩa giữ lại dấu sao bản cũ nuốt nên `set(b) ⊇ set(a)` gần như luôn đúng.

  Đo thật trên corpus (25 slug × contract.md + decisions.jsonl): 13 dòng có chênh lệch cũ↔mới; 5 dòng TRƯỢT mệnh đề quan hệ thật và chỉ được cứu bởi `set(b) >= set(a)` (judgment-question-guard, s4-scope-triage, t1-escape-event-scope ×3). Không dòng nào rơi vào `unexplained`, và không có cấu hình dữ liệu thực tế nào làm nó rơi vào.

  Nặng hơn: AC-9/E9 hứa "mọi chênh lệch phải thuộc một hình dạng CÓ TÊN trong bảng" — mã không hề ánh xạ chênh lệch nào về tên hình dạng nào. Đây đúng lớp lỗi đã ghi trong bộ nhớ kit ("Đo từ vựng thay vì quan hệ" — assert hỏi "chuỗi/ký tự có mặt không" trong khi lời hứa là quan hệ), và đúng chân mà review round 1 REJECT vì thiếu.

### E5 (AC-12) fail-open: nhánh kho-nông bị bỏ qua âm thầm nếu clone hỏng
- file: `tests/plugins/run-tests.sh:6785`
- severity: high
- AC: AC-12
- source: conventions
- detail: Dòng 6782-6789: `subprocess.run(["git","clone","--quiet","--depth","1", ...], capture_output=True)` — returncode KHÔNG được kiểm — rồi `if (sub / ".git").exists():` mới chạy assert. Clone hỏng vì bất kỳ lý do gì (sandbox cấm file://, hết đĩa, git config `protocol.file.allow=never` — mặc định của git ≥ 2.38.1 cho submodule và đã lan sang một số bản đóng gói) ⇒ toàn bộ chân đo AC-12 biến mất, P161 vẫn XANH.

  Chính khối ngay dưới (dòng 6792-6794) ghi rõ `# KHONG fail-open: cay kiem that PHAI co moc, neu khong thi ĐỎ (S4-r1 finding)` — tức tác giả đã sửa fail-open ở nhánh cây-thật nhưng để nguyên fail-open ở nhánh fixture kho-nông, đúng kiểu "sửa theo finding chứ không theo LỚP" mà CLAUDE.md bất biến #4 cấm. E5 là chân DUY NHẤT chứng minh đường "không lấy được bản cũ" chạy được; nó cần đối chứng dương tường minh (assert clone thành công) chứ không phải một `if` bỏ qua.

### Hàm `classify()` chết trong E9 — vết tích của phép phân loại chưa từng được cài
- file: `tests/plugins/run-tests.sh:6901`
- severity: medium
- AC: AC-9
- source: conventions
- detail: Dòng 6901-6905 định nghĩa `def classify(line)` với thân là vòng lặp `for name, inp, want, _ in CASES:` chứa duy nhất `if ...: pass` rồi `return None`. Hàm không bao giờ được gọi, không có tác dụng phụ, và tham chiếu biến `want` che biến `want` của E6 phía trên.

  Nó là bằng chứng trực tiếp cho finding #2: đây là chỗ đáng lẽ ánh xạ mỗi chênh lệch về một hình dạng CÓ TÊN theo AC-9, nhưng phần thân bị bỏ trống và thay bằng mệnh đề `set(b) >= set(a)` ở dòng 6917. Để lại mã chết ở đây làm người đọc sau tưởng E9 có phân loại.

### AC-9 corpus scan (E9) has zero discriminating power — bold-strip mutant leaves it green
- file: `tests/plugins/run-tests.sh:6917`
- severity: high
- AC: AC-9
- source: bugs
- detail: The divergence guard is `if len(b) >= len(a) and a == re.sub(r"\*", "", b) or set(b) >= set(a): continue`. Both disjuncts are satisfied by every star-only divergence between old and new stripMd, because the new regexes are strictly more restrictive — b is always `a` with some `*` re-inserted, so `re.sub('\*','',b) == a` and `set(b) ⊇ set(a)` both hold unconditionally.

  Proven: I injected the same 'drop the bold-strip .replace line' mutant that E8 uses (anchor at run-tests.sh:6884) and re-ran E9's exact loop over the real `_acceptance/` corpus — result `unexplained = 0` over 511 star clusters. A version of gate-card.js that stops stripping `**bold**` entirely passes E9.

  Second, E9 never consults SHAPES or CASES at all, so it cannot verify what AC-9 states ('mọi chênh lệch phải thuộc một hình dạng CÓ TÊN trong bảng'). The vestigial `def classify(line)` at run-tests.sh:6901 confirms this — its body is `for name, inp, want, _ in CASES: if strip_old(line) != strip_new(line): pass` and it always returns None; it is never called. The `assert cum_count > 0` sanity counter passes regardless, so the block looks alive while measuring nothing.

  This is the 'assertion âm-tính-một-mình' / 'thước không gắn vào vật' class named in CLAUDE.md: the 510-cluster number printed in the P161 pass line is provenance, not evidence.

### AC-12 shallow-clone fixture is skipped silently when the clone fails
- file: `tests/plugins/run-tests.sh:6783`
- severity: high
- AC: AC-12
- source: bugs
- detail: ```python
subprocess.run(["git", "clone", "--quiet", "--depth", "1", "file://" + str(root), str(sub)],
               capture_output=True)
if (sub / ".git").exists():
    src_s, err_s = old_at(BASE, sub)
    assert src_s is None and err_s and "cay thieu lich su" in err_s, ...
```
  The clone's return code is discarded and the assertion is guarded by `.git` existing. Any clone failure makes the entire AC-12 measurement vanish with no diagnostic — the run still prints `P161 OK`.

  Reproduced: `git -c protocol.file.allow=never clone --quiet --depth 1 file:///…/acceptance-gate-kit nong2` → `fatal: transport 'file' not allowed`, no `nong2/.git`. `protocol.file.allow=never` is a common CI hardening setting after CVE-2022-39253, so this is not hypothetical. Same for a read-only or full TMPDIR.

  The rest of P161 gets this right — line 6800 (`assert src_old, "...chan doi chung KHONG duoc bo qua am tham"`) explicitly refuses to fail open on the same class of problem, and the pre-existing shallow-clone test at run-tests.sh:3936 uses `execFileSync` which throws. Only this new block regresses to a silent skip, and it is precisely the branch the commit message claims to have hardened ('co fixture kho-nong rieng cho duong "khong lay duoc ban cu"').

### Tuyên quét LỚP nhưng không có phân loại nào — E9 để lọt chênh lệch qua phép so TẬP KÝ TỰ (hàm classify là mã chết)
- file: `tests/plugins/run-tests.sh:6917`
- severity: high
- AC: AC-9
- source: measurement
- detail: evals.yaml E9 hứa: "mọi chênh lệch phải phân loại được vào một hình dạng CÓ TÊN trong marker; chênh lệch không thuộc hình dạng nào → ĐỎ". Mã thực thi không hề chạm tới tên hình dạng nào: hàm `classify(line)` (dòng 6901-6905) lặp qua CASES rồi `pass` và luôn trả `None`, và KHÔNG BAO GIỜ được gọi. Phép lọc thật là dòng 6917: `if len(b) >= len(a) and a == re.sub(r"\*", "", b) or set(b) >= set(a): continue` — vế `set(b) >= set(a)` là quan hệ SIÊU TẬP TRÊN TẬP KÝ TỰ, không liên quan gì tới 13 hình dạng. Đo thật trên corpus hiện tại (25 hồ sơ, contract.md + decisions.jsonl): 13 dòng có chênh lệch old/new, trong đó 5 dòng được tha DUY NHẤT bởi vế `set(b) >= set(a)` (không thoả vế thứ nhất), tức chưa từng bị đối chiếu với hình dạng nào. Vì bản mới chỉ GIỮ LẠI dấu sao so với bản cũ nên tập ký tự đầu ra mới luôn ⊇ tập cũ trên chính cặp đang đo, khiến assert 6920 gần như không thể đỏ; mọi hồi quy giữ nguyên bộ ký tự của dòng (nuốt một từ có chữ trùng chỗ khác, đổi thứ tự, nuốt khoảng trắng thừa) đều lọt. Sanity counter `cum_count > 0` chỉ chứng minh có dữ liệu vào, không chứng minh assert có răng.

### Fixture kho NÔNG dựng không kiểm — E5 âm thầm bỏ qua cả ca khi git clone thất bại
- file: `tests/plugins/run-tests.sh:6783`
- severity: high
- AC: AC-12
- source: measurement
- detail: Ca duy nhất đo đường "không lấy được bản cũ" (AC-12) dựng fixture bằng `subprocess.run(["git", "clone", "--quiet", "--depth", "1", "file://" + str(root), str(sub)], capture_output=True)` ở dòng 6783 và KHÔNG kiểm returncode, cũng không assert fixture dựng được. Toàn bộ assert của ca nằm dưới `if (sub / ".git").exists():` (dòng 6785) — clone hỏng (mạng file:// bị chặn, sandbox cấm ghi, git thiếu, đường dẫn có ký tự lạ) thì nhánh không chạy và bộ kiểm vẫn XANH, đúng lớp "fixture hỏng cho cùng một màu xanh" mà invariant kit cấm. Ca này có ghim thông điệp (`"cay thieu lich su" in err_s`) và có đối chứng dương ở dòng sau (cây đủ lịch sử → err_old is None), nhưng cả hai vô nghĩa khi bước dựng fixture im lặng thất bại. Đối chiếu: khối cùng file đo mutant có kiểm bước tiêm (`assert mut_src != CARD.read_text(...)`, dòng 6894) — chỗ này thiếu đúng bước tương ứng.

### Tuyên quét LỚP "không xoá assert cũ" nhưng chỉ phủ một dạng cú pháp, và đo bằng có-mặt-chuỗi thay vì quan hệ theo khối
- file: `tests/plugins/run-tests.sh:6927`
- severity: medium
- AC: AC-11
- source: measurement
- detail: Dòng 6927-6930 chống "hạ thước cho vừa vật" bằng: `old_asserts = [l.strip() for l in r.stdout.split("\n") if l.strip().startswith("assert ")]` rồi `missing = [l for l in old_asserts if l not in new_text]`. Hai lỗ: (1) phạm vi — ở bản mốc 044968e, file có 408 dòng bắt đầu bằng `assert ` NHƯNG cũng có 99 dòng dùng `grep` và 43 dòng `throw new Error`/`process.exit(1)` làm phép đo; toàn bộ 142 dòng đó nằm ngoài lượt quét, nên nới một pattern grep hay bỏ một `throw` trong khối P cũ vẫn XANH, trong khi evals.yaml E11 tuyên là "các khối P đã có TRƯỚC mốc chỉ được THÊM dòng, không đổi/không xoá assert cũ". (2) quan hệ — `l not in new_text` chỉ hỏi chuỗi còn xuất hiện ở ĐÂU ĐÓ trong file, không ràng buộc nó còn nằm trong đúng khối P cũ và còn được chạy; một assert bị chuyển sang khối khác, bị comment trong ngữ cảnh khác, hoặc trùng lặp văn bản đều thoả phép đo này.

### Mệnh đề "MỌI đường dẫn" của E6 tự miễn 24/36 trường hợp bằng nhánh continue
- file: `tests/plugins/run-tests.sh:6885`
- severity: low
- AC: AC-6
- source: measurement
- detail: E6 tuyên "mọi đường dẫn đó xuất hiện nguyên vẹn trong thẻ", nhưng dòng 6885 `if re.search(re.escape(stem) + r"(?![A-Za-z0-9_.*/-])", src_all): continue` bỏ qua mọi glob mà phần gốc (đã cắt sao) cũng là chuỗi hợp lệ ở nơi khác trong hồ sơ. Đo thật trên cây hiện tại: 36 lượt want-instance, 24 bị nhánh này bỏ qua, chỉ 12 lượt được so, và counter `checked` chỉ đạt 3. `assert checked > 0` (dòng 6892) giữ cho ca không rỗng hoàn toàn, nên đây không phải phép đo mù, nhưng độ phủ thực tế thấp hơn nhiều so với chữ "mọi" trong lời khai và không có dòng descope nào nêu phần tự miễn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Luật mở loại trừ `.` và `-` gây hồi quy nhóm LỘT trên văn xuôi, và hình dạng này không có tên trong ma trận**
  Người dùng thấy gì: Một số đoạn chữ đậm hoặc nghiêng đứng ngay sau dấu chấm, dấu gạch ngang hoặc gạch dưới trong câu văn thường (không phải đường dẫn kỹ thuật) có thể hiển thị nguyên cặp dấu sao thô trên thẻ thay vì được làm sạch, ảnh hưởng đến độ dễ đọc của thẻ.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits

- **Trục A của Coverage trôi khỏi ma trận: contract khai 12 hình dạng, marker có 13**
  Người dùng thấy gì: Tài liệu mô tả nội bộ của tính năng này ghi nhầm số lượng dạng đánh dấu cần bao phủ (12 thay vì 13 dạng thật đang có); không ảnh hưởng gì tới nội dung thẻ mà người dùng nhìn thấy, chỉ là con số thống kê trong tài liệu bị lệch.
  file: `_acceptance/card-text-fidelity/contract.md`
  severity: medium
  Đề xuất: known-limits

- **card() swallows gate-card.js failures — E6/E7 silently skip any slug whose card crashes**
  Người dùng thấy gì: Nếu việc dựng thẻ cho một hồ sơ nào đó gặp lỗi kỹ thuật ngầm, hồ sơ đó có thể bị âm thầm loại khỏi phép kiểm mà không có cảnh báo. Hiện chưa xảy ra trên các hồ sơ thật đang có, nhưng nếu phát sinh sau này sẽ không có ai biết để xử lý.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **stripMd no longer strips emphasis opened right after '.', '-' or '_' — behavior narrowing outside the declared shape matrix**
  Người dùng thấy gì: Một số đoạn chữ đậm hoặc nghiêng đứng ngay sau dấu chấm, dấu gạch ngang hoặc gạch dưới trong câu văn thường có thể hiển thị nguyên cặp dấu sao thô trên thẻ thay vì được làm sạch, ảnh hưởng đến độ dễ đọc.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Contract Coverage axis A declares 12 shapes; the STRIP-SHAPE-MATRIX marker holds 13 and nothing measures the mismatch**
  Người dùng thấy gì: Tài liệu mô tả nội bộ ghi nhầm số lượng dạng đánh dấu cần bao phủ (12 thay vì 13 dạng thật); không ảnh hưởng nội dung thẻ người dùng thấy, chỉ là con số thống kê tài liệu bị lệch.
  file: `_acceptance/card-text-fidelity/contract.md`
  severity: low
  Đề xuất: known-limits

- **Assert "chuỗi có mặt" trong HTML thô thay vì quan hệ trên chữ người đọc — sức giết của mutant E8 đến từ thẻ HTML dính, không từ tính chất được hứa**
  Người dùng thấy gì: Phép kiểm hiện đang phát hiện đúng lỗi dấu sao bị bỏ sót trên thẻ, nhưng lý do nó bắt được là do trùng hợp về cách ghép chữ HTML chứ chưa hẳn vì đúng logic được hứa; nếu lỗi tương tự xảy ra ở vị trí khác trên thẻ, phép kiểm có thể bỏ lọt mà không ai biết.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
