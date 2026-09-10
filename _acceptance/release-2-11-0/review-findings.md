## Trong hợp đồng

### 1. resolveConfigKey/resolveConfigList cắt chú thích TRƯỚC khi bóc nháy — chuỗi sắp thi hành giữ lại dấu nháy MỞ, tái tạo đúng chuỗi xanh-giả vòng này đóng
- file: `lib/evidence-core.cjs:94`
- severity: medium
- source: conventions
- AC: AC-3

`unquoteScalar` chỉ bóc khi cả chuỗi CÂN, nhưng ba bên gọi lại tự làm hỏng tính cân trước khi đưa vào:

    lib/evidence-core.cjs:94   const val = unquoteScalar(m[2].replace(/\s+#.*$/, '').trim());
    lib/evidence-core.cjs:120  out.push(unquoteScalar(m[1].replace(/\s+#.*$/, '').trim()));

Phép cắt chú thích `/\s+#.*$/` không biết gì về vỏ nháy, nên một scalar HỢP LỆ có ` #` bên trong vỏ bị xén, phần còn lại không cân, và `unquoteScalar` (đúng theo thiết kế) trả NGUYÊN VĂN kèm dấu nháy mở.

Đo trên chính cây này (node -e, cùng đầu vào `k: "echo a # b"`):
- base d1d36479: `resolveConfigKey` → `echo a`
- HEAD: `resolveConfigKey` → `"echo a`

Chuỗi `"echo a` giao cho `bash -c` là vỡ cú pháp → thoát 2 → và `EXPECTED_EXIT_BANNED = [97,127]` vẫn KHÔNG cấm 2, nên một hồ sơ khai `expected_exit: 2` đọc nó thành «giới hạn đã khai» = PASS. Đó là nguyên văn chuỗi bốn bước mà §Context của contract nói vòng này đóng — chỉ đổi hình dạng đầu vào từ «nháy không cân do người viết» sang «nháy không cân do CHÍNH bộ giải tạo ra».

Khối «Known limits» của contract (dòng 314-337) khai ba giới hạn (un-double nháy đơn, nháy hai đầu không phải một cặp, vòng round-trip dừng ở s4-args) nhưng KHÔNG khai giới hạn này, và không có ca nào trong `bo-giai-nhay.test.mjs` phủ hình dạng `#`-trong-vỏ. Trái luật CLAUDE.md «Chỗ không biến được → khai giới hạn kèm MỘT ngưỡng đang đếm — cấm dặn-bằng-lời làm nghiệm».

Hiện config.yaml của kit có 0 giá trị dạng này (đã quét), nên chưa nổ ở đây — nhưng `lib/evidence-core.cjs` nằm trong INIT-CI-COPY-LIST và được vendor sang 7 kho tiêu thụ.

Hướng: cắt chú thích phải nhận biết vỏ nháy (bỏ qua `#` nằm trong vỏ), hoặc bóc vỏ trước rồi mới cắt chú thích; nếu cố ý không sửa thì phải khai ở Known limits kèm một ca đo.

Rationale (map AC): Finding tái tạo đúng chuỗi bốn bước mà AC-3 hứa đã đóng (lệnh chứa nháy nội dòng vỡ cú pháp, thoát 2 không bị cấm, hồ sơ khai expected_exit:2 đọc nhầm thành PASS) — chỉ khác ở hình dạng đầu vào có thêm dấu #.

---

### 2. Bảng lớp vendored trong contract khai +258/−16 cho lib/evidence-core.cjs, lệnh nó tự trích dẫn ra 260/16
- file: `_acceptance/release-2-11-0/contract.md:261`
- severity: low
- source: conventions
- AC: AC-9

Dòng 257 khai nguồn rút: «Đo bằng `git diff --numstat 04069351..HEAD` trên chín mục của INIT-CI-COPY-LIST». Chạy đúng lệnh đó trên cây này:

    48   1    lib/eval-yaml.cjs
    260  16   lib/evidence-core.cjs
    1    1    scripts/pre-merge-check.sh
    1    1    scripts/recheck-evidence.cjs

Ba hàng kia khớp; hàng `lib/evidence-core.cjs` khai **+258** thay vì **260**. Không phải trôi do commit sau: tại chính commit viết contract (52929f40) numstat đã là 260/16, nên số sai từ lúc viết.

AC-9 (dòng 136+) và eval E9 đòi «mỗi số nói được nó đọc từ đâu» và «trả FAIL cho số nào không nói được nó đọc từ đâu» — số này khai nguồn nhưng không khớp nguồn, tức đúng thứ E9 sinh ra để bắt. Sửa một chữ số, hoặc để làn ghim lại rút số bằng máy thay vì gõ tay (cùng bài học «sha phải là output lệnh»).

Rationale (map AC): AC-9 đòi mỗi số trong bảng lớp vendored phải nói được nguồn rút và khớp nguồn đó; số này khai đúng nguồn (git diff --numstat) nhưng chạy lệnh đó ra số khác, nên AC-9 thất bại đúng chỗ nó lập ra để bắt.

---

### 3. Comment/comma stripping runs before unquoteScalar, so unbalanced fragments now keep a stray quote that gets executed
- file: `lib/evidence-core.cjs:94`
- severity: medium
- source: bugs
- AC: AC-3

resolveConfigKey (line 94), resolveConfigList block branch (line 120) and inline branch (line 132) — and the mirrored code in feature-loop/scripts/s4-args.mjs lines 125/139 — apply `.replace(/\s+#.*$/,'')` and `.split(',')` BEFORE calling unquoteScalar. unquoteScalar only strips a shell when the whole string is a balanced pair, so the truncated fragment is now returned VERBATIM including the orphan quote character. The old anchored clause at least removed it.

Reproduced on this tree:
    resolveConfigKey('bg:\n  k: "echo hi # note"\n', 'bg.k')  ->  '"echo hi'   (was 'echo hi')
    resolveConfigList('bg:\n  inline: [plain, "a, b", z]\n', ...) -> ['plain','"a','b"','z']  (was ['plain','a','b','z'])

The resolveConfigKey case is the worse one: that value is handed straight to `bash -c` by repin-lane.mjs:115 and by the S4 machine lane, and `bash -c '"echo hi'` dies on an unbalanced quote with exit 2 — which is exactly the shell-exit-2 mis-read as a declared tool limit that this whole change set exists to close (EXPECTED_EXIT_BANNED is [97,127], 2 is allowed). So for this input shape the patch re-opens the four-step false-green channel it closes for the trailing-quote shape.

Fix is ordering, not the new regex: parse the quoted scalar first, strip a trailing comment / split on commas only outside the shell. Neither Known limits nor the contract's Coverage 'Never' section covers this shape (it lists only un-doubling single quotes and the two-quotes-not-a-pair case). No config in this repo hits it today, and the 28-site measurement across the 7 consumer repos would not have surfaced it because it only measured shapes present there.

failure_scenario: A consumer config key such as `executors.script.x: "pytest -q # smoke"` (or any quoted command containing ' #') resolves to `"pytest -q` — with a leading double quote. `bash -c '"pytest -q'` fails with an unbalanced-quote syntax error and exit code 2; if the eval declares `expected_exit: 2`, the run is scored PASS even though the tool never executed. Before this diff the same key resolved to `pytest -q`, which actually ran.

Rationale (map AC): Cùng cơ chế với finding cắt-chú-thích ở trên (bản tiếng Anh của cùng lớp lỗi), tái mở đúng kênh xanh-giả bốn bước mà AC-3 hứa đã đóng cho hình dạng lệnh có dấu # bên trong nháy.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **carry-plan.mjs vẫn bóc nháy kiểu cũ — hai bộ đọc của CÙNG trường `paths:` nay bất đồng (đúng lớp «bên VIẾT trôi khỏi bên ĐỌC»)**
  Người dùng thấy gì: Một phần của hệ thống có thể vẫn dùng kết quả kiểm tra cũ (đánh dấu 'đã đạt' từ vòng trước) thay vì kiểm tra lại khi tệp liên quan đã thay đổi thật, khiến báo cáo có thể không phản ánh đúng thay đổi mới nhất.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Nhánh list inline tách theo dấu phẩy trước khi bóc nháy — item bọc nháy có dấu phẩy giữ lại nháy thừa**
  Người dùng thấy gì: Nếu một mục cấu hình dạng danh sách chứa dấu phẩy bên trong dấu ngoặc kép, hệ thống có thể đọc sai đường dẫn tệp hoặc nội dung chỉ dẫn công việc. Trường hợp này chưa từng xảy ra trong các dự án đang dùng kit.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **AC-7 teeth pin a fixed base sha, so re-pin of this signed dossier goes permanently red once diagram-design changes**
  Người dùng thấy gì: Ở các đợt phát hành sau, một phép kiểm tra tự động có thể luôn báo lỗi một cách sai lệch ngay khi có bất kỳ thay đổi nào ở phần sơ đồ, kể cả khi bản phát hành đó hoàn toàn ổn — khiến người vận hành phải bỏ qua cảnh báo đỏ, làm giảm độ tin cậy của các cảnh báo khác.
  file: `_acceptance/release-2-11-0/rang-moc.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: phép đếm `unquoteScalar(` của BG6 tính cả chuỗi thông điệp `die()`**
  Người dùng thấy gì: Bài kiểm tra tự động dùng để đảm bảo toàn bộ mã nguồn xử lý dấu ngoặc kép một cách nhất quán có một lỗ hổng: nó có thể vẫn báo 'đạt' ngay cả khi một phần thực sự bị bỏ sót bản vá, khiến lỗi cũ có thể quay lại đúng chỗ đó mà không bị phát hiện sớm.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 5 — ma trận bảy đường khai trước 13 assert nhưng ô «đường 7 (models)» không phân biệt được bản vá với bản chưa vá**
  Người dùng thấy gì: Một trong các phép kiểm tra tự động không thực sự phân biệt được giữa bản đã vá và bản chưa vá ở phần xử lý tên mô hình AI, nên nếu lỗi cũ quay lại đúng chỗ đó, hệ thống kiểm tra sẽ không phát hiện ra.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 4 — chiều đỏ BG5 chỉ tiêm MỘT trong bảy đường nhưng ghim kết luận cho cả ca hành vi bảy đường**
  Người dùng thấy gì: Phép kiểm tra 'phải báo lỗi khi cố tình gài lại lỗi cũ' chỉ thực sự thử nghiệm trên một phần nhỏ của toàn bộ thay đổi, nhưng thông điệp báo cáo lại ngụ ý đã kiểm tra toàn diện hơn thực tế.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 3 — BG2 khẳng định «chuỗi con có mặt» trong khi lời hứa AC-2 là quan hệ trên trọn chuỗi ra**
  Người dùng thấy gì: Một phép kiểm tra tự động chỉ xác nhận một đoạn nhỏ trong kết quả có đúng hay không, thay vì kiểm tra toàn bộ kết quả — nên một số lỗi nằm ngoài đoạn đó có thể lọt qua mà không bị phát hiện.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (feature-loop/scripts/carry-plan.mjs, _acceptance/release-2-11-0/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
