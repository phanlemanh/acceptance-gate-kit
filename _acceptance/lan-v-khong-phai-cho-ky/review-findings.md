# Review Findings: lan-v-khong-phai-cho-ky (round 3)

## Trong hợp đồng

### Vị từ làn V bỏ sót nhánh gate1_skipped mà lưới trước-merge công nhận — hai bản dựng lệch ở đúng chỗ phép đo đẳng thức không soi
- file: `scripts/khong-can-nguoi.mjs:74`
- severity: high
- AC: AC-1
- source: conventions
- detail: Header của file tuyên bố vị từ hỏi ĐÚNG câu lưới hỏi ở Cổng 1 (`approved_by` rỗng ⇒ đòi làn V). Nhưng `scripts/pre-merge-check.sh:699-704` còn một lối thứ ba: `approved_by` rỗng + `gate1_skipped: true` ⇒ chỉ NOTE, không VIOLATION (cùng luật với `lib/evidence-core.cjs evaluateContractWrite` và `commands/approve.md`). `khongCanNguoi()` không đọc `gate1_skipped`: hồ sơ verified chưa ký, đủ sáu điều kiện sạch, `gate1_skipped: true`, không khoá veto → JS trả null → máy quét xếp `gates: bang-chung`, trong khi lưới in NOTE xanh-sạch và cho qua. Đây chính là lớp lệch AC-1 cấm («máy quét ∈ done ⇔ lưới không VIOLATION»), và ma trận LV5 (`tests/plugins/lan-v.test.mjs` MAT_CAT, `contractText()` không có tham số gate1_skipped) không có trục này nên «phép đo vĩnh viễn» giữ một-nguồn không đỏ. Vi phạm bất biến CLAUDE.md «thước phải gắn vào vật» + «hai bản chép trôi khỏi nhau»: sửa cần thêm nhánh gate1_skipped vào vị từ (trả một state, hoặc khai tường minh là «vẫn cần người» kèm lý do) VÀ thêm trục vào LV5/LV4 để răng canh.

### Vị từ «không cần người» bỏ sót enforcement_mode=off — máy quét giấu hồ sơ mà lưới vẫn chặn
- file: `scripts/khong-can-nguoi.mjs:50`
- severity: high
- AC: AC-1
- source: bugs
- detail: xanhSach() chỉ hỏi verdict · bypass_used · risk_tier · UNCERTAIN · hai mục rỗng, nhưng pre-merge-check.sh (dòng ~905-908) còn in `VIOLATION [slug]: enforcement_mode=off` TRƯỚC khi tới nhánh xanh-sạch — và chốt đó đọc cùng khối frontmatter của chính evidence-report.md, ngay cạnh bypass_used. Tái lập (đã chạy): kho git fixture y hệt LV5 với `enforcement_mode: off`, PASS, T2, approved_by có tên, hai mục rỗng → pre-merge exit 1 với VIOLATION enforcement_mode=off, còn `start-scan.mjs` trả `done: [{slug, state: 'xanh-sach'}]`, gates rỗng. Đây đúng chiều lệch NGƯỢC AN TOÀN mà hồ sơ này sinh ra để đóng (AC-1 «done ⇔ lưới không VIOLATION»). LV5/LV4 không bắt vì evidenceText() của fixture luôn ghi `enforcement_mode: strict`. Sửa: thêm điều kiện `enforcement_mode` (off ⇒ không sạch) vào xanhSach và thêm một ô `V-enf-off` vào MAT_CAT của LV5.

### Chân cay-that xanh giả khi lưới không chạy được — bỏ qua mã thoát của pre-merge-check.sh
- file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:126`
- severity: high
- AC: AC-7
- source: bugs
- detail: `luoi="$(… pre-merge-check.sh . --base main …)"` nuốt mã thoát; không có đối chứng nào chứng minh lưới đã đi tới phần kiểm từng hồ sơ. Khi `main` không resolve được (CI fetch nông, worktree không có nhánh main cục bộ) lưới chỉ in `VIOLATION [scope]` rồi dừng — không có dòng `VIOLATION [<slug>]` nào, nên mọi slug có chan=0; hai hồ sơ verified-chưa-ký trên cây thật (release-2-0-0, release-2-1-0) đều là done ⇒ «khớp» ở cả 2 và răng in `CAY-THAT OK: 2 ho so … may quet == luoi o ca 2`, exit 0. Đã tái lập bằng bản sao rang.sh đổi `--base main` thành ref không tồn tại: exit 0, OK. Cùng hình dạng ở dòng 138: nếu thiếu `python3`, `done_=0` cho mọi slug, lại khớp với chan=0 → xanh. LV5 trong lan-v.test.mjs có chốt `status==null||status===2` và đối chứng dương; chân cay-that (E8) thì không — đúng lớp «assertion âm-tính-một-mình». Sửa: bắt `$?` của lưới (exit 2 hoặc có `VIOLATION [scope]` ⇒ ĐỎ riêng), đòi ít nhất một dòng `NOTE [<slug>]`/kiểm từng hồ sơ xuất hiện, và để python3 lỗi thành ĐỎ thay vì `done_=0`.

### gate1_skipped: true bị vị từ coi là «còn cần người» trong khi lưới cho qua
- file: `scripts/khong-can-nguoi.mjs:74`
- severity: low
- AC: AC-1
- source: bugs
- detail: Cổng 1 của pre-merge chấp nhận ba đường: approved_by có tên · `gate1_skipped: true` (NOTE, không chặn) · làn V. khongCanNguoi() chỉ biết hai đường đầu/cuối: hồ sơ `gate1_skipped: true`, approved_by rỗng, bằng chứng sạch sáu điều kiện → lưới KHÔNG in VIOLATION (Cổng 1 NOTE, Cổng 2 NOTE xanh-sạch) nhưng vị từ trả null → máy quét xếp `gates: bang-chung`. Đã kiểm bằng node: `gate1_skipped, no approved_by -> null`. Lệch chiều an toàn (mời người tới cổng mà lưới nói không tồn tại — cùng lớp ledger #3), nhưng phá quan hệ «⇔» AC-1 khai. LV5 không có ô gate1_skipped nên không thấy. Nếu cố ý loại, ghi vào Known limits; nếu không, thêm nhánh gate1_skipped ⇒ 'xanh-sach' và một ô trong MAT_CAT.

### Hình dạng 4 — âm-tính-một-mình: chân cay-that coi «không có dòng VIOLATION [slug]» là «lưới cho qua» mà không kiểm lưới có CHẠY được không
- file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:126`
- severity: high
- AC: AC-7
- source: measurement
- detail: Dòng 126 bắt stdout của `pre-merge-check.sh . --base main` vào `$luoi` và VỨT mã thoát; dòng 137 chỉ hỏi `grep -q "^VIOLATION \[$slug\]"`. Khi lưới không chạy được (base không resolve → lưới in `VIOLATION [scope]: base … không resolve được` rồi exit 2, KHÔNG chấm hồ sơ nào) thì mọi slug đều chan=0; trên cây thật hiện có đúng 2 hồ sơ verified-chưa-ký (release-2-0-0, release-2-1-0) và máy quét xếp cả hai vào done (done_=1) → `[ chan -ne done_ ]` đúng ở cả hai ô → răng in `CAY-THAT OK: 2 ho so …, may quet == luoi o ca 2` và exit 0. Đã tái hiện: chép cây, đổi `--base main` thành ref không tồn tại → chân vẫn XANH. Đối chiếu LV5 trong lan-v.test.mjs (dòng 273–281): cùng phép so nhưng có guard `status == null || status === 2 || chanKhac` và đối chứng dương đòi `NOTE … xanh-sạch` — cay-that thiếu cả hai. Thiếu tối thiểu: kiểm `$?` của lưới (2 = ĐỎ riêng), bắt `VIOLATION [scope]`/`VIOLATION [config]` là hạ tầng, và đòi ít nhất một dòng `NOTE [<slug>]` cho mỗi hồ sơ được so (bằng chứng lưới đã chấm hồ sơ đó).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **PRODUCT-MAP.md lệch với hồ sơ xưởng — bước CI «bản đồ sản phẩm khớp hồ sơ xưởng» đỏ ở HEAD**
  Người dùng thấy gì: Bản đồ tổng quan sản phẩm có thể không khớp với tình trạng thật của hồ sơ đang xử lý, khiến bước kiểm tra tự động chạy trên mỗi thay đổi báo lỗi ngay cả khi tính năng đã hoàn tất đúng quy trình.
  file: `PRODUCT-MAP.md`
  severity: high
  Đề xuất: known-limits

- **Sổ known-limits ghi bốn dòng `song` nhưng hai dòng đã được chính diff này đóng và một dòng mô tả trạng thái không còn tồn tại**
  Người dùng thấy gì: Sổ ghi các hạn chế đã biết có vài dòng ghi sai tình trạng hiện tại — báo một vấn đề là còn tồn tại dù đã được xử lý, hoặc ngược lại — có thể khiến người đọc hiểu nhầm mức độ rủi ro thật.
  file: `docs/research/known-limits-ledger.tsv`
  severity: medium
  Đề xuất: known-limits

- **Chú thích ở start-scan khẳng định một bất biến không tồn tại: «vị từ nhập từ bản đồ, hai bộ đọc dùng chung»**
  Người dùng thấy gì: Một ghi chú giải thích trong mã nguồn mô tả sai cách hai bộ phận liên quan với nhau, có thể khiến người sửa sau tin nhầm vào một cơ chế bảo vệ không thực sự tồn tại.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Vị từ sáu điều kiện chạy hai lần cho mỗi hồ sơ verified**
  Người dùng thấy gì: Không ảnh hưởng gì tới người dùng — chỉ là một chỗ tính toán lặp lại không cần thiết ở bên trong, có thể dọn gọn khi tiện.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture evidence-report.md VIẾT TAY đúng khuôn bên đọc, không round-trip từ khuôn bên viết**
  Người dùng thấy gì: Bộ kiểm tra tự động dùng dữ liệu mẫu soạn tay thay vì lấy đúng từ khuôn thật hệ thống tạo ra, nên nếu khuôn thật thay đổi mà mẫu kiểm tra không đổi theo, một số lỗi có thể không bị phát hiện.
  file: `tests/plugins/lan-v.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (PRODUCT-MAP.md, docs/research/known-limits-ledger.tsv) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
