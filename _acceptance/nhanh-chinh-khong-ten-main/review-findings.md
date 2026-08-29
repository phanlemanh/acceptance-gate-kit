# Review Findings: nhanh-chinh-khong-ten-main (round 2)

## Trong hợp đồng

- **Chiều đỏ của E6 không có lực nhân quả — mutant chạy trên fixture KHÔNG remote (snapshot_tree ghi đè biến REPO toàn cục)**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:165`
  severity: high
  AC: AC-6
  source: conventions
  Trong chân `remote-tra-loi`, fixture có remote thật được dựng ở dòng 142-147 (REPO = repo A, origin trỏ bare, origin/HEAD = phat-trien). Nhưng dòng 165 gọi `snapshot_tree "$MUT2"`, và snapshot_tree lại gọi `build_repo master` (dòng 70) cho đối chứng dương của nó — build_repo kết thúc bằng `REPO="$d"` KHÔNG khai `local`, nên REPO bị ghi đè sang một repo B hoàn toàn KHÔNG có remote. Dòng 173-175 (`git -C "$REPO" branch -D master`, rồi chạy bản tiêm) do đó chạy trên repo B, không phải fixture remote.

  Đã kiểm bằng `bash -x`: fixture remote là `repo-master-5500`, còn bản tiêm chạy `--root .../repo-master-13876` — repo do snapshot_tree dựng. Và đã kiểm trực tiếp: trên đúng hình dạng đó (repo master+feat/x, KHÔNG remote, xoá master), bản s4-args.mjs NGUYÊN VẸN cũng thoát 2 với ĐÚNG chuỗi được ghim «không nhận diện được nhánh chính ... truyền --diff-base». Nghĩa là mutant `const out = gitTry('remote','show','origin')` → `const out = null` không đổi được kết quả: assert đỏ xanh y hệt dù vật còn nguyên. Đây đúng lớp «chiều đỏ phải GỌI thứ nó canh» trong CLAUDE.md, và nó lệch cả với lời khai của chính eval E6 trong evals.yaml («phá bước bóc kết quả remote → phải rơi về đường dò tên và KHÔNG giải được»). Chân này hiện báo `passed` (đã chạy) mà không chứng minh gì cho AC-6.

  Gốc rễ dùng chung: `build_repo` sửa biến toàn cục REPO, nên MỌI lời gọi snapshot_tree sau khi fixture đã dựng đều âm thầm đổi vật đang đo.

  rationale: Chứng minh thực nghiệm mutant của AC-6 không đổi kết quả vì snapshot_tree ghi đè REPO toàn cục sang repo không remote, nên AC-6 (đường remote) chưa có bằng chứng phân biệt.

- **snapshot_tree thất bại không tăng FAIL — chân ci-single-branch in «passed» dù chiều đỏ chưa từng chạy**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:66`
  severity: high
  AC: AC-7
  source: conventions
  Hai nhánh hỏng của snapshot_tree (dòng 66 «chép cây thất bại», dòng 67 «bản sao thiếu vật được đo») dùng `echo "  DO: ..."` trần rồi `return 1` — KHÔNG gọi `bad`, nên biến FAIL không tăng. Trong khi đó dòng 287 viết `snapshot_tree "$MUT5" || done_chan`, và `done_chan` (dòng 13) in `passed` + `exit 0` khi FAIL bằng 0.

  Hệ quả: nếu tar hỏng, đĩa đầy, hay bản sao thiếu s4-args.mjs, chân `ci-single-branch` bỏ trọn chiều đỏ (bỏ bước kiểm-tồn-tại → phải chết đúng thông điệp sai-loại) mà vẫn kết luận «Results: chan ci-single-branch passed», exit 0 — S4 sẽ ghi xanh. Đây đúng lớp «ba lớp che màu xanh» / «assertion âm-tính-một-mình»: hỏng HẠ TẦNG cho ra cùng màu với đạt.

  Bốn chỗ gọi còn lại (dòng 105, 165, 209, 214) thì ngược lại: không kiểm mã trả về của snapshot_tree chút nào, nên bản sao hỏng lặng lẽ chảy tiếp vào bước tiêm python3/sed (mã trả về của chúng cũng không được kiểm) — chỉ tình cờ đỏ ở assert cuối chứ không có chốt nào nói «bản tiêm chưa từng dựng».

  rationale: Chân ci-single-branch là bằng chứng cho AC-7; khi snapshot_tree hỏng nó rơi thẳng vào done_chan báo passed mà chiều đỏ của AC-7 chưa từng chạy.

- **Chân đo trần thời gian (AC-5) không có chiều đỏ và phụ thuộc hành vi TCP của máy chạy**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:227`
  severity: medium
  AC: AC-5
  source: conventions
  Chân `remote-co-tran` chỉ có hai vế: (a) grep hằng `REMOTE_TIMEOUT_MS = [0-9_]*` trong nguồn, (b) đo đồng hồ tường của một lượt chạy với remote `git://192.0.2.1` rồi so với `TRAN/1000 + 20`. Không có bản sao bị tiêm nào — tức không trả lời được câu hỏi nghi thức của CLAUDE.md «nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?».

  Gỡ `timeout: REMOTE_TIMEOUT_MS` khỏi gitTry thì chân này chỉ đỏ ở môi trường mà kết nối tới IP không định tuyến THỰC SỰ treo tới hết TCP connect timeout của hệ (trên máy này đo được 10s có trần / khoảng 75s không trần). Ở CI/Docker chặn outbound, 192.0.2.1 trả «Network is unreachable» tức thì → DT ≈ 0s → chân vẫn xanh dù trần đã bị gỡ. Vế duy nhất còn lại khi đó là grep hằng, mà grep hằng chỉ chứng minh dòng khai tồn tại chứ không chứng minh nó được truyền vào execFileSync.

  Kèm theo: vế (a) ghim vào HÌNH DẠNG MÃ trần (`REMOTE_TIMEOUT_MS = ...`) trong khi hai phép đo anh em cùng file đã chuyển sang neo marker (`MAIN-BRANCH-CANDIDATES`, `PROBE-REGION`) đúng theo bài học vừa rút của chính vòng này — đổi tên hằng hoặc tách sang lib là phép đo tự chết/xanh rỗng.

  rationale: Không có bản tiêm nào bị phá cho AC-5, nên phép đo không trả lời được câu hỏi nghi thức 'phá vật thật thì có đỏ không' mà chính AC-5 đòi hỏi.

- **Phép đo vùng dò (AC-4) là blacklist trên không gian mở — không bắt lại được chính hình dạng mã mà bản vá vừa thay**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:206`
  severity: medium
  AC: AC-4
  source: conventions
  Chân `hai-vai-hai-ham` khẳng định «vùng dò KHÔNG còn lời gọi cửa fail-closed» bằng đúng một mẫu: `grep -qE "(^|[^a-zA-Z])git\("`. Đó là danh sách cấm gồm một phần tử trên một không gian mở.

  Cụ thể mã bị thay thế trong chính diff này là `execFileSync('git', ['-C', root, 'remote', 'show', 'origin'], {...})` viết thẳng trong vùng dò — không qua `git()` cũng không qua `gitTry()`, và KHÔNG có trần thời gian. Nếu ai đó quay lại đúng hình dạng cũ ấy: chuỗi `execFileSync('git',` không khớp `[^a-zA-Z]git\(`, nên vế (c) vẫn xanh; vế (b) đếm `gitTry(` vẫn còn 2 lời gọi (≥2) nên cũng xanh; vế (a) marker vẫn còn. Cả ba vế của AC-4 xanh trên đúng lớp hồi quy nó được dựng để chặn — và lượt đó cũng làm mất trần thời gian mà AC-5 canh.

  Theo nếp «đảo chiều mặc định» đã chốt của kit, phép đo nên khai danh sách CHO PHÉP trong vùng (chỉ `gitTry(`) và đỏ với mọi lời gọi tiến trình khác, thay vì liệt kê một hình dạng bị cấm.

  rationale: Mẫu grep cấm một hình dạng cụ thể nhưng bỏ lọt đúng hình dạng gọi tiến trình mà bản vá AC-4 vừa thay thế, nên hồi quy về hình dạng cũ vẫn được chấm xanh.

- **Chiều đỏ của AC-6 (`remote-tra-loi`) không phân biệt — `snapshot_tree` ghi đè biến toàn cục `REPO`**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:165`
  severity: high
  AC: AC-6
  source: bugs
  `build_repo()` gán `REPO="$d"` KHÔNG có `local`, và `snapshot_tree()` gọi `build_repo master` ở dòng 70 để chạy đối chứng dương. Trong chân `remote-tra-loi`, fixture thật (repo có remote khai nhánh `phat-trien` — nhánh NGOÀI bốn tên quen) được dựng ở dòng 142, nhưng đến dòng 165 `snapshot_tree "$MUT2"` lại dựng một repo mới KHÔNG remote và ghi đè `REPO`. Vì vậy bản tiêm ở dòng 174–181 chạy `--root "$REPO"` trên repo B — repo không có origin, chỉ có `master` (vừa bị `branch -D` ở dòng 173) và `feat/x`.

  Hệ quả: đột biến `const out = gitTry('remote','show','origin')` → `const out = null` không thay đổi gì cả, vì trên repo B lời gọi remote vốn đã thất bại. Bản CHƯA tiêm cũng chết với ĐÚNG chuỗi mà assert ghim.

  Đã kiểm thực nghiệm hai chiều:
  (a) Chạy script GỐC (không tiêm) trên fixture dựng y hệt repo B → `s4-args: không nhận diện được nhánh chính (không remote, không main/master/develop/trunk) — truyền --diff-base <ref>`, exit 2 — tức đúng chuỗi mà dòng 179 grep.
  (b) Thay lệnh tiêm bằng một no-op (chỉ nối thêm comment vào `// PROBE-REGION>>>`) rồi chạy lại chân: vẫn `PASS: chiều đỏ: phá bước đọc remote → rơi đúng câu đòi --diff-base (ghim thông điệp)` / `Results: chan remote-tra-loi passed`.

  Đây đúng lớp «assertion âm-tính-một-mình / mutant không cô lập lớp»: đường remote — đường duy nhất AC-6 tuyên là mới được che — thực tế KHÔNG có chiều đỏ nào. Sửa: giữ lại đường dẫn fixture có remote (ví dụ `REPO_REMOTE="$REPO"` trước dòng 165) và chạy bản tiêm trên nó, hoặc khai `local d` + trả đường dẫn qua stdout thay vì biến toàn cục.

  rationale: Cùng gốc với finding E6: snapshot_tree ghi đè REPO khiến bản tiêm chạy trên repo không remote, nên đường remote mà AC-6 tuyên là được che chưa từng có chiều đỏ thật.

- **Chiều đỏ 1 của `hai-vai-hai-ham` kết luận XANH từ kết quả RỖNG; `snapshot_tree` thất bại không cộng FAIL**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:210`
  severity: medium
  AC: AC-4
  source: bugs
  Dòng 209–212:

    MUT3="$TMP/mut3"; snapshot_tree "$MUT3"
    sed -i.bak 's/<<<PROBE-REGION/vung-do-cu/' "$MUT3/feature-loop/scripts/s4-args.mjs"
    R2="$(sed -n '/<<<PROBE-REGION/,/PROBE-REGION>>>/p' "$MUT3/...")"
    [ -z "$R2" ] && ok "..." || bad "..."

  Khác với ba mutant python trong cùng file (đều có `assert m!=s, "mutant khong tac dung"`), bước `sed` này KHÔNG kiểm chứng nó đã đổi được gì. Mà kết luận lại rút từ chuỗi RỖNG — nên mọi lý do khiến bản sao không tồn tại đều cho màu xanh: tar hỏng, đĩa đầy, đường dẫn sai, snapshot_tree return 1.

  Đã kiểm: chạy đúng hai dòng đó với `MUT3=/tmp/does-not-exist-xyz` → `sed: ... No such file or directory` trên stderr, `R2` rỗng, nhánh `ok` chạy — ca báo PASS dù bản sao chưa bao giờ được dựng.

  Làm nặng thêm: hai cửa thoát sớm của `snapshot_tree` (dòng 66 «chép cây thất bại», dòng 67 «bản sao thiếu vật được đo») chỉ `echo "  DO: ..."` rồi `return 1` mà KHÔNG gọi `bad()` — nên biến `FAIL` không tăng và verdict của chân (`done_chan` chỉ đọc `$FAIL`) không phản ánh sự cố. Ngoài ra chỉ dòng 287 kiểm mã trả về (`snapshot_tree "$MUT5" || done_chan`); các dòng 105, 165, 209, 214 đều bỏ qua. Sửa: cho hai cửa đó gọi `bad` thay vì `echo`, kiểm `|| done_chan` ở mọi lời gọi, và thêm khẳng định bản sao ĐANG có marker trước khi sed (đối chứng dương của chính phép tiêm).

  rationale: Thực nghiệm cho thấy chiều đỏ 1 của chân đo AC-4 báo PASS từ kết quả rỗng, không phân biệt được bản sao chưa từng dựng với mutant thật sự có tác dụng.

- **Assertion âm-tính-một-mình: hạ tầng hỏng ở snapshot_tree biến chân ci-single-branch thành "passed"**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:287`
  severity: high
  AC: AC-7
  source: measurement
  Dòng 287: `MUT5="$TMP/mut5"; snapshot_tree "$MUT5" || done_chan`. Hai cửa hỏng của `snapshot_tree` (dòng 66 tar chép cây thất bại, dòng 67 bản sao thiếu chính vật được đo) dùng `echo "  DO: ..."` TRẦN chứ không gọi `bad()` (dòng 12) — nên FAIL KHÔNG tăng. `done_chan` (dòng 13) chỉ đọc `$FAIL`, thấy 0 thì in `Results: chan ci-single-branch passed` và `exit 0`.

  Hệ quả: khi bản sao không dựng được, chân E7 nhảy thẳng ra verdict XANH mà chiều đỏ (mutant bỏ bước kiểm-tồn-tại ref) CHƯA BAO GIỜ CHẠY. Đây đúng cơ chế mà luật «assertion âm-tính-một-mình» nêu tên: `cp` lỗi / fixture hỏng / script không tồn tại đều cho cùng một màu xanh — chỉ khác ở chỗ đây nó xanh ngay ở tầng verdict của chân, không phải tầng assert.

  Sáu chân kia gọi `snapshot_tree "$MUT"` mà bỏ mã trả về, nhưng ở chúng lượt chạy mutant sau đó vẫn rơi vào nhánh `else` rồi `bad` — nên chỉ MUT5 (dòng 287) biến hỏng-hạ-tầng thành xanh. Sửa theo LỚP: cho hai cửa dòng 66/67 gọi `bad` thay vì `echo`, và đừng dùng `|| done_chan` làm lối thoát.

  rationale: Chân ci-single-branch là bằng chứng của AC-7; đường thoát || done_chan khiến hạ tầng hỏng cho ra cùng verdict passed như khi chiều đỏ thật sự chạy và bắt đúng lỗi.

- **Ghim thông điệp quá rộng (âm-tính-một-mình): chiều đỏ E1 nhận cả lỗi usage exit 3 làm bằng chứng**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:117`
  severity: medium
  AC: AC-2
  source: measurement
  Dòng 117: `grep -q "diff-base" "$TMP/m.txt" && ok "chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn"`. Chuỗi ghim chỉ là `diff-base` — 8 ký tự có mặt trong DÒNG USAGE của chính vật được đo. Tôi đã chạy kiểm: `node feature-loop/scripts/s4-args.mjs --slug demo --root /tmp --bogus x` in ra `usage: s4-args.mjs ... [--diff-base <ref>] ...` và thoát 3, tức `grep -q "diff-base"` KHỚP.

  Nên mọi lượt exit≠0 vì `usage()` (cờ lạ, cờ thiếu giá trị, tham số không phải cờ — bất kỳ lần nào lời gọi mutant ở dòng 114 trôi khỏi bộ cờ của script) đều rơi vào nhánh `else` rồi được chấm PASS như thể chiều đỏ đã chứng minh được điều nó hứa. Ca không phân biệt được «cắt danh sách tên làm nhánh master không giải được» với «bản tiêm chưa từng chạy đúng cách».

  Chính file này đã biết cách ghim đúng: dòng 165 và dòng 262 rút nguyên câu từ nguồn (`grep -o "không nhận diện được nhánh chính[^\`']*" "$S4ARGS" | head -1 | cut -c1-40`) rồi `grep -qF`. Chân master-khong-remote là chân duy nhất hạ thước xuống một mẩu chuỗi dùng chung với usage.

  rationale: Chuỗi ghim 'diff-base' trùng với dòng usage() của chính script, nên chiều đỏ cho AC-2 (câu có hướng dẫn khi nhánh không nhận diện được) không phân biệt được với một lời gọi sai cờ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Dòng khai nguồn nhánh chính và trường mainBranchInfo nói «null / none» khi chạy với --diff-base**
  Người dùng thấy gì: Khi người vận hành tự khai mốc so sánh bằng cờ --diff-base, dòng thông báo gỡ lỗi vẫn nói sai là không tìm được nhánh chính, dễ gây hiểu lầm khi đọc nhật ký dù kết quả cuối cùng vẫn đúng.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Thông điệp die() chép cứng bốn tên nhánh, tách khỏi hằng MAIN_BRANCH_CANDIDATES vừa được đặt marker**
  Người dùng thấy gì: Nếu danh sách tên nhánh mặc định được mở rộng trong tương lai, thông báo hướng dẫn cho người dùng có thể liệt kê sai danh sách, gây hiểu lầm khi người dùng tra lỗi theo hướng dẫn đó.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 8/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nhanh-chinh-khong-ten-main/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
