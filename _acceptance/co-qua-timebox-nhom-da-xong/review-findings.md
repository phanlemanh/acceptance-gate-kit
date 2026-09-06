## Trong hợp đồng

- **cqt_o_khong_doi dùng \" trong chuỗi YAML mà parser của kit không unescape — lệnh giải ra thoát 1 trên cây sạch (ngược expected); PASS vòng 1 đến từ verifier tự viết lại lệnh, không phải từ args s4 sinh**
  file: `_acceptance/config.yaml:224`
  severity: high
  AC: AC-6
  source: conventions
  Giá trị `cqt_o_khong_doi: "... && test -z \"$(git status --porcelain PRODUCT-MAP.md)\""` là YAML hợp lệ, nhưng kit cố ý KHÔNG dùng YAML lib: `lib/evidence-core.cjs resolveConfigKey` (dòng 63) chỉ `.replace(/^["']|["']$/g,'')` — bỏ cặp nháy ngoài, không unescape `\"`; `scripts/pre-merge-check.sh config_list` (sed) cũng vậy, và `scripts/config-patch.mjs` ghi rõ đây là hợp đồng parser. Kiểm thực nghiệm trên cây hiện tại: `resolveConfigKey(...,'executors.script.cqt_o_khong_doi')` trả về chuỗi chứa `\"` nguyên văn; `node feature-loop/scripts/s4-args.mjs --slug co-qua-timebox-nhom-da-xong --root . --ag-root .` sinh E6.cmd cũng chứa `\"`; chạy đuôi `test -z \"$(git status --porcelain PRODUCT-MAP.md)\"` qua `bash -c` trên cây sạch (git status rỗng) → thoát khác 0, trong khi dạng đúng `test -z "$(...)"` → thoát 0. Tức ngữ nghĩa E6 (AC-6) bị đảo: bản đồ KHÔNG bị ghi thì eval vẫn báo hỏng. Trong khi đó `run-log.jsonl` của hồ sơ ghi E6 exit 0 với cmd có nháy TRẦN (`"` không có backslash) — khác chuỗi mà s4-args sinh từ CÙNG config.yaml tại SHA 1868ad16 (đã đối chiếu `git show`): verifier agent đã tự chuẩn hoá lệnh trước khi chạy, trái luật «Chạy đúng lệnh sau NGUYÊN VĂN» ở acceptance-verify.js:501, và hook L2 đối chiếu bằng ref nên không bắt được. Đây đúng lớp CLAUDE.md gọi tên: «bằng chứng không tự dối» / «thước phải gắn vào vật được giao» — màu xanh của E6 chưa từng đi qua đường args-máy. Commit cuối (36d8adc5) đưa hồ sơ về `implemented` chờ S4 vòng delta: vòng đó chạy đúng nguyên văn sẽ báo hỏng E6 vì hạ tầng, không vì vật. Không có tiền lệ: đây là dòng DUY NHẤT trong config.yaml dùng `\"` (grep). Hướng sửa (không tự sửa): bọc scalar bằng nháy đơn `'... test -z "$(git ...)"'` hoặc bỏ nháy lồng (`git diff --quiet -- PRODUCT-MAP.md`), rồi chạy lại S4 để bằng chứng E6 đi qua s4-args thật.
  Đối chiếu vòng 2: cùng lỗi vẫn còn nguyên trong `_acceptance/config.yaml:224` (chưa sửa) — round 2 xanh trên bảng eval chỉ vì lệnh đo lại được chuẩn hoá thủ công lần nữa, không phải vì hạ tầng đã sửa; đây là lý do verdict tổng giữ REJECT dù mọi hàng trong bảng đều PASS.

- **cqt_o_khong_doi can never exit 0 through the config resolver — E6 evidence is not reproducible**
  file: `_acceptance/config.yaml:224`
  severity: high
  AC: AC-6
  source: bugs
  The new executor `executors.script.cqt_o_khong_doi` is written as a YAML double-quoted scalar containing `test -z \"$(git status --porcelain PRODUCT-MAP.md)\"`. `resolveConfigKey` in lib/evidence-core.cjs is line-based and only strips the OUTER quote pair (`.replace(/^["']|["']$/g, '')`); it never unescapes `\"`. Verified by calling the real resolver: the returned string still contains a literal backslash-quote. The shell therefore receives `test -z \"$(...)\"`: `\"` is a literal `"` character, `$(...)` expands unquoted to nothing on a clean tree, and the argument becomes the two-character literal `""`, which is non-empty, so `test -z` returns non-zero. Reproduced under sh, bash and zsh, and the FULL resolved command run via `sh -c` fails while `git status --porcelain PRODUCT-MAP.md` is empty (0 lines). Consequences: (a) the eval is fail-closed in the wrong direction and can never pass via the kit's own resolver; (b) `_acceptance/co-qua-timebox-nhom-da-xong/evidence-report.md` records E6 PASS with a `cmd` that uses plain quotes, i.e. the green came from an agent-normalized command, not from what `config:` resolves to; (c) the delta S4 round queued by HEAD commit 36d8adc5 will fail E6 for a reason unrelated to the feature until this is fixed. The config line is byte-identical at the verify-round commits 1868ad16 and 577ddb0d, so this is not a merge artifact — it was wrong from the first write. Fix: drop the escaping (single-quoted YAML scalar) or avoid quoting entirely with `git diff --quiet -- PRODUCT-MAP.md`, then re-run E6 so the evidence exit code comes from the resolved command.
  Round 2 cross-check: the config line is unchanged, so this finding still stands and is the basis for the overall REJECT verdict this round.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Ngoại lệ evidence/** của chính hồ sơ chỉ áp cho đường TƯƠNG ĐỐI — tài liệu nói inputs được viết tuyệt đối và evidence cùng hồ sơ được miễn, code thì die exit 2 với dạng tuyệt đối**
  Người dùng thấy gì: Một số đường dẫn bằng chứng tuyệt đối trỏ vào chính hồ sơ đang xét có thể bị từ chối dù tài liệu nói là được phép, khiến người khai bằng chứng theo đúng hướng dẫn vẫn gặp lỗi khó hiểu.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 6 — Đường dẫn/mốc hardcode theo checkout tác giả: E6 check_lane đo topology nhánh, không đo cây**
  Người dùng thấy gì: Ở một tính năng khác, một phép kiểm tự động có thể báo đạt hoặc báo hỏng tùy vào máy hay nhánh đang chạy chứ không phải theo đúng nội dung thay đổi, khiến người xem không chắc kết quả kiểm tra có đáng tin hay không.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 — Fixture uat-session.md viết tay đúng khuôn bên đọc, không round-trip từ khuôn writer đã có helper**
  Người dùng thấy gì: Dữ liệu mẫu dùng để kiểm thử được viết tay thay vì lấy từ đúng khuôn mẫu chính thức; nếu khuôn mẫu đổi sau này, phép kiểm có thể vẫn báo đạt dù tính năng thật đã sai, nên người dùng có thể không được cảnh báo kịp lúc.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — assert "copy" in r_t kiểm toàn file README, không ghim vào câu tự khai bản chép**
  Người dùng thấy gì: Một phép kiểm tự động dùng để xác nhận tài liệu tự khai đúng nội dung vẫn có thể báo đạt ngay cả khi đoạn nội dung quan trọng đó bị xóa, nên nội dung tài liệu có thể sai lệch mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 5/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, feature-loop/scripts/s4-args.mjs, _acceptance/inputs-tinh-tu-goc-kho/rang.sh, tests/plugins/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.