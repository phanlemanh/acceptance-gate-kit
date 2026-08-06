## Trong hợp đồng

### 1. countJudgmentBlocks bỏ guard block-scalar mà collectGold có — mở lại đúng lớp lỗi 'parser bịa điểm từ excerpt' đã vá ở AC-8
- file: `scripts/acceptance-gold.mjs:86`
- severity: medium
- AC: AC-6
- source: conventions

Comment khẳng định "CUNG luat nhan field voi collectGold (^\s*, khong doi thut le)" nhưng điều đó sai: `collectGold` (dòng 28-46) có nguyên một máy trạng thái bỏ qua vùng block-scalar (`output: |`, `rationale: |`) với ghi chú "Guard block-scalar port từ gate-card.js (fix S4-r2, AC-8): dòng nằm trong `output: |` ... là TRÍCH LOG, không phải field — parser ngây thơ từng đúc 'điểm người đã quyết' bịa từ excerpt", và chỉ đếm bên trong khối `- eval:`. `countJudgmentBlocks` thì quét thô toàn file bằng `/^\s*judged_by\s*:/` — đếm cả dòng nằm trong trích log, trong fenced code, và ngoài mọi khối eval.

Hệ quả trên chân sanity P152/P164: nếu một evidence-report trích một khối judgment vào `output: |` (khuôn hoàn toàn hợp lệ, và chính là kịch bản AC-8 đã dẫm), `judgmentBlocks > 0` sẽ XANH ngay cả khi nhánh đọc thật của reader đã hỏng — tức bộ đếm 'độc lập' vừa dựng để chống hằng-đúng lại tự trở thành một hằng-đúng khác. Corpus hôm nay chưa có ca nào (kiểm: 0 dòng judged_by trong block-scalar, 0 trong fenced), nên đây là lỗ tiềm ẩn chứ chưa đỏ.

### 2. `countJudgmentBlocks` counts `judged_by:` inside block scalars — the "independent sanity leg" can be satisfied by a quoted log excerpt
- file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/acceptance-gold.mjs:89`
- severity: medium
- AC: AC-6
- source: bugs

The new counter is a flat per-line regex `/^\s*judged_by\s*:/` with no `- eval:` context requirement and, critically, no block-scalar guard. `collectGold` right above it has an explicit guard (lines 30-41) precisely because a naive parser once fabricated points from `output: |` / `rationale: |` excerpts. The in-code comment claims "CUNG luat nhan field voi collectGold (^\s*, khong doi thut le)" — that claim is false; the two readers do not share the field-recognition law.

Demonstrated: a workspace whose only `judged_by:` line sits inside an `output: |` excerpt reports `{"judgmentBlocks":1,"points":0}`.
```
- eval: E1
  proposal: PASS
  output: |
    judged_by: nguoi khac
```
Consequence: the sanity legs added in P152 (`if (st.judgmentBlocks <= 0) ...`) and P164 (`assert s["judgmentBlocks"] > 0`) go green on a corpus with zero real judgment blocks, i.e. exactly the false-green the counter was introduced to prevent. The `judgmentBlocks >= points` inequality is likewise satisfiable for the wrong reason. On today's corpus the count is 29 vs 21 points and none of the 29 are excerpts, so this is latent, not currently firing.

Same line in the mirror: `/Users/manhphan/dev/acceptance-gate-kit/plugins/acceptance-gate/scripts/acceptance-gold.mjs:89`

### 3. P161: failed card renders are still swallowed; the new AC-5 counter zeroes the very counts that would have caught it
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6938`
- severity: medium
- AC: AC-5
- source: bugs

`card()` (line 6867-6871) returns `None` when `gate-card.js` exits non-zero, and both consumers swallow it: `untraceable()` does `if out is None: continue` (line 6900) and `intact_count()` does the same (line 6928). So a slug/gate whose card fails to render is silently dropped from the E6 and E7 measurements and both stay green.

The new block added by this diff claims to close that ("bo dem render phai duoc ASSERT du 3 so, khong dem-roi-vut"), but it starts with `RENDER["ok"] = RENDER["fail"] = 0` — explicitly discarding every failure accumulated by the `--gate 1` / `--gate 2` calls — and then re-renders each slug with a *different* invocation (`--slug X` with no `--gate`, auto-detect). The assertion `RENDER["fail"] == 0` therefore measures the auto-detect path only; the two gate-explicit paths that are actually swallowed remain unasserted.

Failure scenario: gate-card.js regresses so that `--gate 1` exits non-zero for some slug while the auto-detected gate (2) still renders. Every slug/gate pair for gate 1 is skipped in `untraceable`/`intact_count`, `bad_new` stays empty, `n_new` shrinks but may still exceed `n_old`, and the new counter renders only gate 2 successfully — P161 passes. Verified all 26 slugs currently render for both gates, so this is latent today.

### 4. Thiếu đối chứng dương cho chốt zero-tolerance — và bộ phân loại được nới đến khi dư lượng = 0 (hình dạng 4)
- file: `tests/plugins/run-tests.sh:7024`
- severity: high
- AC: AC-4
- source: measurement

`assert not hard` (dòng 7024) thay cho ngưỡng cũ `len(kinds) <= 25`, nhưng không có bất kỳ ca tiêm nào chứng minh nó biết ĐỎ. Eval E5 khai rõ cơ chế: 'tiêm ĐÚNG MỘT cụm mồ côi → ĐỎ nêu đích danh cụm đó (n=1 chứng minh không còn dung sai dưới bất kỳ hình dạng nào)'. Trong P161 không có bước tiêm nào cho đường này — chỉ chạy trên corpus thật rồi assert rỗng. Mutant duy nhất của P161 (dòng 7059-7074) nhắm đường lột đậm, và dòng bảng răng của P161 nhắm assert marker 'truc A troi khoi marker', đều không đi qua `hard`.

Đo thực trên cây hiện tại: tổng số cụm mồ côi = 0 (cả `hard` lẫn `soft` đều rỗng, nên nhánh `if soft: print(...)` dòng 7027 cũng chưa bao giờ chạy). Bỏ riêng một hình dạng mới `đuôi-sao-bắt-mọi` (dòng 6985, `[A-Za-z0-9_.'\)\]-]\*+` — khớp MỌI dấu sao đứng sau một ký tự chữ/số/dấu) thì dư lượng bật lên 4 cụm / 1 cụm có đường dẫn; bỏ thêm `sao-trong-đoạn-mã` biến thể-Ø (dòng 6991, khớp mọi sao kề vùng đã che) thì 12 cụm / 2 cụm có đường dẫn. Nghĩa là 'zero tolerance' đạt được phần lớn nhờ NỚI bộ phân loại cho hết dư lượng, không phải nhờ vật sạch — cùng lớp 'hạ thước cho vừa vật' mà vòng này đi chữa. Chân `assert classified > 0` (7012) không phân biệt được điều đó.

### 5. Đối chứng E9 chỉ khẳng định TIỀN ĐỀ, không chạy vòng phát-hiện của chính chốt (hình dạng 1: đo thay-thế thay vì đo đầu ra của vật)
- file: `tests/plugins/run-tests.sh:7580`
- severity: medium
- AC: AC-8
- source: measurement

Comment dòng 7570-7573 hứa 'CHAY CHINH VONG PHAT-HIEN cua chot tren cay gut ... Tai dung vong for cua chot cho DUNG dong P157'. Thực tế đoạn 7574-7581 dựng `gut2` bằng ĐÚNG cùng phép tiêm đã làm cho `gut` (chèn `import sys; sys.exit(0)` sau heredoc P157), gọi `run_block(gut2, 'P157')` — cùng một lời gọi đã chạy ở dòng 7562 — rồi kết bằng:

    assert rcg == 0 and row157[2] not in outg

Đây là mệnh đề tiền đề (khối bị vô hiệu thì XANH), không phải quan sát chốt P163 ĐỎ. Vòng for thật của chốt (dòng 7530-7545, `assert rc != 0` + `assert want in out`) không hề được chạy trên cây `gut`/`gut2`. Hệ quả: nếu ai xoá `assert rc != 0` ở dòng 7544, P163 mất hoàn toàn răng mà E9 vẫn XANH — đúng lỗ mà E9 sinh ra để bịt. Hai cây `gut` và `gut2` là bản sao trùng nhau, cùng assert một điều (`rc == 0` ở 7563 và `rcg == 0` ở 7579-7580), nên bước 'tái dựng' không thêm thông tin nào.

### 6. Tuyên 'ma trận ĐẦY ĐỦ 3 × 4' nhưng chỉ liệt kê 6/12 điểm-case (hình dạng 5)
- file: `tests/plugins/run-tests.sh:7228`
- severity: medium
- AC: AC-1
- source: measurement

Comment dòng 7225-7227 viết: 'ma tran DAY DU: 3 hinh dang TIEN TO x 4 hinh dang TEN FILE'. Danh sách thi hành ngay sau đó chỉ có 6 phần tử: 3 tiền tố (${PLUGIN_ROOT}, <plugin>, ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}) đều đi với tên chữ-thường-.mjs, cộng 3 tên mới (gạch dưới, chữ hoa, đuôi .py) đều chỉ đi với ${PLUGIN_ROOT}. Ma trận toàn phần 3×4 phải là 12 assert. Ba ô chưa bao giờ được đo: tiền tố `<plugin>` và `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}` với tên gạch-dưới / chữ-hoa / .py. Chính đây là chỗ regex mới (dòng 7237, `([^\s`"'()\[\]]{0,60}?)\bscripts/([A-Za-z0-9_.-]+\.[a-z]{1,4})`) có thể thoái lui theo trục tiền tố mà 6 ca hiện tại vẫn xanh — cùng lớp lỗ mà comment nói đang đóng ('ban truoc chi 3 tien to voi cung mot ten chu-thuong-.mjs, nen thu regex ve [a-z0-9-]+ van xanh').

### 7. 'Nguồn độc lập' của P163 là khai-báo-đối-khai-báo; nguồn độc lập thật chỉ được IN, không ĐỎ (hình dạng 1)
- file: `tests/plugins/run-tests.sh:7497`
- severity: medium
- AC: AC-7
- source: measurement

Eval E8 khai: 'Tập khối khai == tập rút từ NGUỒN ĐỘC LẬP với bảng (quét cây kiểm tìm khối có dựng bản sao) — thừa đỏ thiếu đỏ'. Assert duy nhất có răng là dòng 7487-7489: `declared == tagged`, so tập tên trong scripts/measures-need-teeth.tsv với tập thẻ `[TEETH]` trong tiêu đề `run` — cả hai đều do người viết gõ tay, và comment 7490-7492 tự thừa nhận 'KHONG phai hai nguon doc lap that'. Phép quét độc lập thật (dòng 7493-7497: tìm khối có `mktemp|copytree|worktree add|cp -R` mà chưa gắn thẻ) chỉ `print` ghi chú, không bao giờ làm chốt ĐỎ. Nên quan hệ 'thừa đỏ thiếu đỏ' với nguồn độc lập chưa được thi hành: thêm một khối dựng bản sao mà quên gắn thẻ vẫn XANH, đúng đường thoái lui mà AC-7 nhắm.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P165 (chốt SIẾT/NỚI) fail-open khi không resolve được merge-base — trái luật fail-closed đã ghi ngay trong chính gate.yml**
  Người dùng thấy gì: Khi hệ thống không xác định được điểm mốc so sánh của một thay đổi (ví dụ do cách lấy mã nguồn rút gọn), bước canh giữ chống hạ thấp tiêu chuẩn kiểm tra sẽ tự động bỏ qua mà vẫn báo đạt — một thay đổi làm yếu bài kiểm tra có thể lọt qua âm thầm.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **assert-ratchet.tsv bị rsync vào gói acceptance-gate trong khi hai TSV cùng loại bị loại trừ**
  Người dùng thấy gì: Một tệp ghi chú chỉ dùng nội bộ cho việc kiểm tra của riêng dự án này bị gói kèm và gửi tới mọi dự án khác dùng chung bộ công cụ, dù nó vô nghĩa với họ — không làm hỏng chức năng, chỉ là phần thừa không cần thiết.
  file: `scripts/sync-plugin-packages.sh`
  severity: medium
  Đề xuất: known-limits

- **assert-ratchet allowlist has no orphan check — 3 of its 4 rows already match nothing, so a bogus row is undetectable**
  Người dùng thấy gì: Sổ phân loại 'siết chặt hay nới lỏng' tiêu chuẩn kiểm tra hiện chấp nhận một số dòng ghi chú không khớp thay đổi thực tế nào; nếu sau này có người thêm một dòng ghi chú quá chung chung, nó có thể vô tình che giấu một thay đổi làm yếu bài kiểm tra thật mà không ai biết.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/assert-ratchet.tsv`
  severity: medium
  Đề xuất: known-limits

- **P165 skips the entire PR-scope ratchet with a print when merge-base cannot be resolved**
  Người dùng thấy gì: Khi không xác định được phạm vi thay đổi của một thay đổi mã nguồn, phần canh giữ chống hạ thấp tiêu chuẩn kiểm tra chỉ in một ghi chú rồi bỏ qua toàn bộ mà vẫn báo đạt — công cụ chống suy yếu bài kiểm tra có thể tắt lặng lẽ đúng lúc cần nó nhất.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **`assert-ratchet.tsv` ships into the acceptance-gate plugin mirror while its sibling ledger is excluded**
  Người dùng thấy gì: Một tệp sổ theo dõi chỉ có ý nghĩa nội bộ bị gửi kèm tới các dự án khác dùng chung bộ công cụ, dù họ không dùng được nó — chỉ là phần thừa, không ảnh hưởng chức năng.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/sync-plugin-packages.sh`
  severity: low
  Đề xuất: known-limits

- **Mẫu số tautology — hai vế của assert rút từ CÙNG một lượt quét (hình dạng 4: assertion không bao giờ ĐỎ được)**
  Người dùng thấy gì: Một phép đếm dùng để xác nhận 'đã thử đủ số thẻ' được tính theo cách mà hai vế so sánh luôn khớp nhau một cách máy móc bất kể hệ thống có lỗi hay không, nên phép kiểm này không thực sự canh gác được gì — hợp đồng đã ghi rõ việc dò tìm tự động các phép kiểm kiểu này nằm ngoài phạm vi vòng này.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **P165 fail-open khi không dựng được phạm vi PR, và vô hiệu trên push nhánh chính (hình dạng 4)**
  Người dùng thấy gì: Trên nhánh chính, khi thay đổi được đưa thẳng vào (không qua một yêu cầu hợp nhất riêng), phần canh giữ chống hạ thấp tiêu chuẩn kiểm tra coi như không có gì để kiểm — mất tác dụng đúng lúc kho tự vận hành cổng kiểm của chính mình.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/14 lỗi rơi vào file không bộ đo nào phủ (scripts/sync-plugin-packages.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.