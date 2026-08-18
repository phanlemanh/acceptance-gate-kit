## Trong hợp đồng

### 1. P200 fail-open: mọi vế đỏ trên CÂY THẬT bị nuốt — `loi` không bao giờ được đọc, mã thoát chỉ phản ánh bộ đếm đột biến

- file: `tests/plugins/run-tests.sh:10445`
- severity: high
- source: conventions
- AC: AC-1

`const loi = []` (dòng 10445) gom (a) mọi vế đỏ của cây thật `kiem(ROOT, SO_BASE, BUOC)`, (b) thất bại của ĐỐI CHỨNG DƯƠNG «bản sao NGUYÊN VẸN đã đỏ», (c) «DOT BIEN KHONG AP DUOC». Nhưng đến cuối script (dòng 10499–10501) chỉ có duy nhất `if (nMut !== MUT_KY_VONG) process.exit(1)` — `loi` KHÔNG hề được kiểm, rồi in thẳng «P200 OK» và thoát 0. Hệ quả: P200 chỉ canh cỗ máy đột biến của chính nó, KHÔNG canh trạng thái repo — đúng thứ mà cả hồ sơ sinh ra để canh.

Đã chạy thật (trích khối 10350–10501 ra file rồi chạy node):

1) Cây có hai plugin LỆCH SỐ (acceptance-gate 2.2.0 vs feature-loop 2.2.1):
   `P200 VE DO: hai plugin lech so: acceptance-gate 2.2.0 vs feature-loop 2.2.1`
   `P200 VE DO: khong doc duoc so o base — khong doi chieu duoc, fail-closed`
   `P200 OK (... 5/5 dot bien chay that ...)`  → EXIT=0

2) Đúng kịch bản P0 mà gap-probe.md tuyên đã vá — MẤT COMMIT BUMP ở chế độ buộc-tăng (`P200_BASE=HEAD P200_MUST_BUMP=1` trên chính cây này):
   `P200 VE DO: acceptance-gate khong tang so so voi base: van la 2.2.0 — moc phat hanh buoc phai tang`
   `P200 VE DO: feature-loop khong tang so so voi base: ...`
   `P200 OK (... base=HEAD BUOC-TANG; 7/7 dot bien chay that ...)` → EXIT=0

Vì `run()` (dòng 14–35) chấm PASS/FAIL theo mã thoát, suite in `PASS: P200 ...` trong cả hai ca. Eval E1/E2/E6 ghim «P200 OK (… BUOC-TANG; 7/7 …)» nên chuỗi bằng chứng cũng khớp — màu xanh giả trọn vòng.

Vi phạm trực tiếp: CLAUDE.md «assertion âm-tính-một-mình là assertion không sống» + đối chứng dương phải THẬT SỰ chặn; MEMORY «ba lớp che màu xanh — runner nuốt mã thoát»; và chính lời khai của contract.md Notes («mọi vế là giá trị… bản sao NGUYÊN VẸN phải 0 vế đỏ trước khi tin bất kỳ bản bị tiêm nào là đỏ») + gap-probe.md P0/P2 («số BẰNG base → ĐỎ», «lệch là thoát 1») — cả ba đều là LỜI-KHAI-SAI so với mã hiện tại. Cùng file, ca P196 kề bên (dòng ~9855) dùng đúng nếp `e=0 / bad() { e=1 }` rồi thoát theo `e`; P200 lệch khỏi nếp đó.

Sửa: cuối p200.mjs, trước dòng in «P200 OK», thêm nhánh `if (loi.length) { for (const x of loi) console.error(\`  P200 LOI: ${x}\`); process.exit(1); }` (giữ nguyên kiểm `nMut`).

### 2. P200 tự hạ thước khi không giải được base: `MUT_KY_VONG = SO_BASE ? 7 : 5` bỏ im lặng cả hai vế quan-hệ-với-base

- file: `tests/plugins/run-tests.sh:10499`
- severity: medium
- source: conventions
- AC: AC-1

Khi `soOBase()` không giải được `origin/main` (clone nông, checkout không có remote origin, worktree/CI khác cấu hình), `SO_BASE === null`: khối `if (SO_BASE)` bỏ qua cả hai đột biến base, và ngưỡng khai-trước tự tụt từ 7 xuống 5 — bộ đếm khớp với chính nó nên không có tín hiệu nào cho biết vế «tăng số so với base» đã biến mất. Vế đỏ duy nhất báo việc này («khong doc duoc so o base — khong doi chieu duoc, fail-closed») lại rơi vào `loi` không ai đọc (xem finding trên), nên `P200_MUST_BUMP=1` ở môi trường thiếu base sẽ in «P200 OK … BUOC-TANG; 5/5» và thoát 0 dù KHÔNG kiểm gì về việc cắt số. Đã chạy thật: với ROOT là thư mục không phải kho git, script vẫn đi tới nhánh 5-đột-biến.

Đây đúng lớp lỗi mà repo đã tuyên cấm thành văn ở .github/workflows/gate.yml (~dòng 92): «T1-escape backstop KHÔNG chạy (base không resolve được) — fail-open không chấp nhận ở repo kit», và trái với chính chú thích của hàm («fail-closed, vì ‹không đối chiếu được› không phải ‹đạt›»). Sửa: giữ MUT_KY_VONG cố định 7 và cho `SO_BASE === null` thoát khác 0 (ít nhất khi `P200_MUST_BUMP=1`), thay vì đổi ngưỡng theo môi trường.

### 3. P200 collects every red leg into `loi` but never checks it — the real-tree assertion (and the positive control) can never fail the suite

- file: `tests/plugins/run-tests.sh:10445`
- severity: high
- source: bugs
- AC: AC-1

In the new P200 block, `const loi = []` (line 10445) is written to in five places — real-tree red legs (line 10448 `for (const x of veThat.filter(v => !v.ok)) loi.push(...)`), the positive control (line 10451 `if (sach.length) loi.push('ban sao NGUYEN VEN da do …')`), and the mutation guards — but `loi` is never read. The only exit gate is `if (nMut !== MUT_KY_VONG)` at line 10500, which counts mutants only. So every red leg on the REAL tree prints `P200 VE DO: …` and then the script prints `P200 OK` and exits 0; `run()` sees exit 0 and reports PASS.

Verified empirically by extracting the script verbatim and running it:

1. Missing-bump case (the exact thing the release lane exists to catch). `P200_BASE=HEAD P200_MUST_BUMP=1 node p200.mjs <ROOT>` prints:
   `P200 VE DO: acceptance-gate khong tang so so voi base: van la 2.2.0 — moc phat hanh buoc phai tang`
   `P200 VE DO: feature-loop khong tang so so voi base: van la 2.2.0 …`
   then `P200 OK (… 7/7 dot bien chay that …)` and `EXIT=0`.

2. Version-skew case. With feature-loop version set to 9.9.9 in a copied tree, it prints `P200 VE DO: hai plugin lech so`, `P200 VE DO: GUIDE khong chua cau dan xuat`, `P200 VE DO: khong doc duoc so o base — khong doi chieu duoc, fail-closed` — and still `P200 OK`, `EXIT=0`.

Consequences: (a) `plugins_release: "P200_MUST_BUMP=1 bash tests/plugins/run-tests.sh"` added in `_acceptance/config.yaml` is inert — E1's claim that a lost bump commit turns the gate red holds only for the synthetic mutant, never for the tree actually being released; (b) the positive control `sach` (intact copy must be 0 red) is dead, so a needle that was already present before mutation is not distinguishable from one the mutation caused; (c) the fail-closed leg for an unresolvable base is also dead — if `origin/main` is not fetched (shallow CI clone), `soOBase` returns null, `MUT_KY_VONG` silently drops from 7 to 5, the base dimension is skipped entirely and the suite still says `P200 OK`, while E1's expected text asks for `7/7`.

Fix: gate the exit on `loi` too, e.g. `if (loi.length) { for (const x of loi) console.error('  P200 LOI: ' + x); process.exit(1); }` before the `nMut` check.

### 4. Assertion âm-tính-một-mình: P200 chỉ đếm đột biến, vế trên CÂY THẬT và đối chứng dương bị vứt bỏ (fail-open)

- file: `tests/plugins/run-tests.sh:10448`
- severity: high
- source: measurement
- AC: AC-1

Trong script P200 (heredoc `p200.mjs`, dòng 10350–10501), mảng `loi` được khai ở dòng 10445 và được nạp ở 4 chỗ — (a) dòng 10448 `for (const x of veThat.filter(v => !v.ok)) loi.push(\`cay that: ${x.m}\`)` tức mọi vế ĐỎ trên cây đang kiểm; (b) dòng 10451 `if (sach.length) loi.push('ban sao NGUYEN VEN da do …')` tức ĐỐI CHỨNG DƯƠNG; (c) `DOT BIEN KHONG AP DUOC`; (d) `CHIEU DO KHONG CHAY` — nhưng `loi` KHÔNG BAO GIỜ được đọc lại. Điều kiện thoát duy nhất là dòng 10500 `if (nMut !== MUT_KY_VONG) … process.exit(1)`, tức chỉ phía ÂM (đột biến có đỏ không) mới có răng; phía DƯƠNG (vật thật có đúng không) chỉ được `console.log` rồi bỏ.

Đã chạy thật để xác nhận (trích `p200.mjs` ra, chạy trên bản sao code-sinh của chính cây này):
- feature-loop = 2.1.0 còn acceptance-gate = 2.2.0 → in `P200 VE DO: hai plugin lech so: acceptance-gate 2.2.0 vs feature-loop 2.1.0` và `P200 VE DO: GUIDE khong chua cau dan xuat: …` → **exit 0**, in `P200 OK (… 7/7 dot bien chay that …)`.
- diagram-design version = "2.5" (sai semver) → `P200 VE DO: diagram-design khong hop semver: 2.5` → **exit 0**, `P200 OK`.
- Kịch bản P0 mà gap-probe.md tuyên đã vá — mất commit bump: cả hai manifest + GUIDE cùng ở 2.1.0, chạy `P200_MUST_BUMP=1` → in hai dòng `P200 VE DO: … khong tang so so voi base: van la 2.1.0 — moc phat hanh buoc phai tang` → **exit 0**, `P200 OK (… BUOC-TANG; 7/7 …)`.

Hệ quả dây chuyền: `run()` (dòng 10503) chấm PASS theo mã thoát, nên suite `plugins`/`plugins_release` vẫn XANH; E3c («suite plugins XANH») và vế «Suite in «PASS: P200 …»» của E1 trong `_acceptance/release-2-2-0/evals.yaml` do đó không phân biệt được cây đúng với cây sai. Toàn bộ hai vế lõi của AC-1/AC-2 (hai plugin cùng số · GUIDE dẫn xuất từ manifest) và toàn bộ bản vá P0 (số phải TĂNG so với base) hiện không có răng máy nào — chúng chỉ tồn tại ở dòng in cho người đọc.

### 5. Số đột biến kỳ vọng KHÔNG được ghim trước mà suy từ chính điều kiện nó phải canh — «fail-closed» khai ở gap-probe thực tế là fail-open

- file: `tests/plugins/run-tests.sh:10499`
- severity: high
- source: measurement
- AC: AC-1

Dòng 10499 `const MUT_KY_VONG = SO_BASE ? 7 : 5;` — con số kỳ vọng được TÍNH từ `SO_BASE`, đúng biến mà hai đột biến quan hệ-với-base (`tut so xuong duoi base`, `mat commit bump (so bang base)`, dòng 10495–10497, chạy trong `if (SO_BASE)`) phụ thuộc vào. Khi `soOBase()` trả `null` (base không giải được: fetch chưa có `origin/main`, worktree lạ, ref sai), hai chiều đỏ đó biến mất VÀ ngưỡng tự hạ từ 7 xuống 5, nên bộ đếm luôn khớp với chính nó — đúng lớp lỗi mà gap-probe.md mục P2 tuyên đã sửa («số đột biến bị GHIM (7/7), lệch là thoát 1 — bộ đếm không còn tự khớp với chính nó»).

Cùng lúc, nhánh fail-closed ở dòng ~10432 `if (base === null) out.push(red('khong doc duoc so o base — khong doi chieu duoc, fail-closed'))` chỉ đẩy vào `veThat` → `loi`, mà `loi` không được kiểm (xem finding trên), nên nó không đỏ.

Chạy thật để xác nhận: `P200_MUST_BUMP=1 P200_BASE=khong-ton-tai node p200.mjs <root>` → in `P200 VE DO: khong doc duoc so o base — khong doi chieu duoc, fail-closed`, chỉ 5 đột biến chạy, **exit 0**, in `P200 OK (… base=khong-ton-tai BUOC-TANG; 5/5 dot bien chay that …)`. Tức trên một runner không giải được base, vế QUAN HỆ với base — lý do tồn tại của bản vá P0 — im lặng tắt hẳn mà ca vẫn tự khai «OK», và evals E1/E6 (ghim chuỗi «7/7» trong `_acceptance/release-2-2-0/evals.yaml`) chỉ bắt được điều này nếu người/agent verify đọc kỹ chữ số trong dòng tổng, không có răng máy nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **`dotBase` lacks the change-proof guard `dot` has — the 'mat commit bump' mutant is a no-op that still reports "chieu do chay that"**
  Người dùng thấy gì: Con số 'đã kiểm tra đủ các tình huống' đi kèm bản phát hành có thể không đáng tin trong một trường hợp hẹp, dù kết quả cuối cùng (đạt/không đạt) hiện vẫn đúng nhờ một phần kiểm tra khác.
  file: `tests/plugins/run-tests.sh:10484`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
