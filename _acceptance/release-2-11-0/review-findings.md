## Trong hợp đồng

### 1. `resolveConfigList` nhánh khối đẩy `undefined` vào mảng khi item là flow-sequence — lệch pattern đã dùng ở `resolveConfigKey`
- file: `lib/evidence-core.cjs:236`
- severity: medium
- source: conventions
- AC: AC-4
- rationale: Đây đúng đường đọc #3 trong bảng AC-4 ("resolveConfigList nhánh khối"); AC-4 đòi đường này "trả chuỗi đúng như người viết nó" nhưng nó trả undefined, làm Then của AC-4 thất bại.

`out.push(parseFlowValue(m[1]).value)` đọc thuộc tính `.value`, nhưng `parseFlowValue` chỉ trả `.value` cho `kind === 'scalar'`; nhánh `'seq'` trả `{kind, text, items}` và KHÔNG có `value`. Đo được:

    resolveConfigList('executors:\n  x:\n    keys:\n      - [a, b]\n      - plain\n', 'executors.x.keys')
    ->  [ undefined, 'plain' ]        // JSON.stringify hiển thị [null,"plain"]

Bản trước commit này đẩy chuỗi nguyên văn `'[a, b]'` — không đúng, nhưng vẫn là một chuỗi. Nay là `undefined` lọt vào một mảng khai kiểu `string[]`, và `resolveConfigList` là nguồn của `feature_loop.suite_keys` (s4-args dùng để chạy suite) — một phần tử `undefined` đi tiếp sẽ chết ở một chỗ nói sai nguyên nhân.

Chỗ ĐÚNG nằm ngay trong cùng commit, cách 27 dòng: `resolveConfigKey` (dòng 209-210) viết `const val = pv.kind === 'seq' ? pv.text : pv.value;`. Nhánh khối không áp cùng pattern. Sửa một dòng: `out.push(parseFlowValue(m[1])).text` hoặc dùng đúng biểu thức ba ngôi trên.

### 2. Chân 2 "đối chứng dương" trong `rang-moc.sh` không thể chạm tới — exit 4 là mã chết
- file: `_acceptance/release-2-11-0/rang-moc.sh:73`
- severity: medium
- source: bugs
- AC: AC-11
- rationale: AC-11 đòi mốc so "phải suy từ kho" và răng phải sống qua chiến dịch ghim lại; cơ chế tự xưng kiểm chứng việc chọn mốc (exit 4) là hằng-đúng theo cấu tạo, đúng lớp lỗi mà AC-11 được mở ra để chặn, nên Then của AC-11 không được thoả.

Vòng chọn mốc (dòng 58-61) chỉ gán `NEO="$sha"` khi `[ -z "$cha" ] || [ "$(ver_tai "$sha")" != "$(ver_tai "$cha")" ]`. Chân 2 (dòng 72-76) rồi tính lại cùng cha bằng cùng lệnh và kiểm `[ -n "$CHA" ] && [ "$(ver_tai "$NEO")" = "$(ver_tai "$CHA")" ]`.

Nếu `CHA` khác rỗng, `cha` trong vòng lặp cũng khác rỗng (cùng `git rev-parse -q --verify "${NEO}^"`), nên vòng chỉ dừng vì hai số đã KHÁC nhau — nghĩa là phép so bằng ở chân 2 là phủ định của đúng vị từ vừa dùng để chọn `NEO`. `ver_tai` tất định (`git show` + `sed`), nên exit 4 là mã chết.

Kịch bản hỏng: cơ chế mà chân 2 tự xưng bảo vệ ("phép chọn mốc hỏng") không thể bị phát hiện — nếu sau này vòng chọn mốc bị sửa sai theo một hướng khác, chân 2 vẫn im lặng, và dòng PASS vẫn in `(doi chung duong: so tai moc KHAC so tai cha)`, khẳng định một cơ chế chưa từng được thực thi. Commit 329dbbfb được mô tả là để sửa đúng lớp tautology này; nó vẫn đúng theo cấu tạo, chỉ đổi hình dạng cấu tạo.

### 3. `parseFlowValue(...).value` là `undefined` cho flow-sequence — rò `null`/lỗi kiểu vào các bên đọc list
- file: `lib/evidence-core.cjs:236`
- severity: low
- source: bugs
- AC: AC-4
- rationale: Bug chạm ba đường đọc được liệt kê trong bảng AC-4 (#3 resolveConfigList nhánh khối, #5 s4-args list field khối, #9 carry-plan cmd:), khiến các đường này không "trả chuỗi đúng như người viết nó" như AC-4 yêu cầu.

`parseFlowValue` trả `{kind:'seq', items, text}` KHÔNG có thuộc tính `value`, nhưng ba nơi gọi đọc `.value` vô điều kiện trên giá trị có thể parse thành sequence:
- `lib/evidence-core.cjs:236` — `out.push(parseFlowValue(m[1]).value)` (nhánh block-list của `resolveConfigList`)
- `feature-loop/scripts/s4-args.mjs:147` — `cur[pendingList].push(parseFlowValue(itemM[1]).value)`
- `feature-loop/scripts/carry-plan.mjs:106` — `cur.cmd = R.parseFlowValue(f[1]).value`

Đo được: `resolveConfigList('k:\n  x:\n    - [a, b]\n    - z\n','k.x')` trả `[null, "z"]`.

Kịch bản hỏng: một `config.yaml` có item khối lồng inline dưới `feature_loop.suite_keys` (`- [a, b]`) cho `suiteKeys = [undefined, ...]`; `s4-args.mjs:205` gọi `resolveConfigKey(configText, undefined)`, gọi `dottedKey.split('.')` và ném TypeError không bắt, kèm stack trace. Mã trước-diff đẩy chuỗi thô `'[a, b]'`, hỏng to và có tên qua `die('suite_keys trỏ key không giải được: [a, b]')`. Cùng hình dạng ở đường s4-args đưa `null` nguyên văn vào field list của args.json sinh ra. Sửa bằng `pv.kind === 'seq' ? pv.text : pv.value` (như `resolveConfigKey` đã làm) hoặc từ chối sequence bằng lỗi có tên.

### 4. Hình dạng 4 — chân tự xưng "ĐỐI CHỨNG DƯƠNG" của `rang-moc.sh` là hằng-đúng, không bao giờ đỏ được
- file: `_acceptance/release-2-11-0/rang-moc.sh:73`
- severity: high
- source: measurement
- AC: AC-11
- rationale: Cùng lỗi với finding "Chân 2 unreachable" ở trên nhưng có bằng chứng thực nghiệm đầy đủ hơn (dựng lại kịch bản chọn sai mốc); trực tiếp phủ định yêu cầu của AC-11 rằng mốc so phải là một phép kiểm thật, suy từ kho, sống qua ghim lại — ở đây nó là mã chết.

Vòng chọn mốc (dòng 58-61) chỉ gán `NEO=$sha` khi `[ -z "$cha" ] || [ "$(ver_tai $sha)" != "$(ver_tai $cha)" ]`. Chân 2 (dòng 72-76) tính lại `CHA="$(G rev-parse ${NEO}^)"` và đỏ (exit 4) khi `[ -n "$CHA" ] && [ "$(ver_tai $NEO)" = "$(ver_tai $CHA)" ]` — ĐÚNG phủ định của vị từ vừa dùng để chọn NEO, trên cùng hai sha, cùng hàm `ver_tai` tất định. Nhánh exit 4 là mã chết: nếu CHA rỗng thì `[ -n "$CHA" ]` sai; nếu CHA không rỗng thì vòng đã bảo đảm hai số KHÁC nhau. Đã chứng thực nghiệm: clone kho, commit chạm `diagram-design/.claude-plugin/plugin.json` mà KHÔNG tăng version → vòng bỏ qua commit đó và script ra exit 5, không bao giờ ra exit 4.

Đây đúng lớp lỗi mà chú thích dòng 67-71 tuyên đã sửa ("bản trước … đúng theo CẤU TẠO — không đối chứng gì cả"): bản mới vẫn đúng theo cấu tạo, chỉ đổi cấu tạo. Hệ quả đo lường: răng AC-7/AC-11 kết luận PASS từ một chuỗi chân âm tính (diff rỗng ⇒ xanh) mà chân duy nhất được khai là đối chứng dương thì không mang tín hiệu nào. Lời khai trong evals.yaml còn khẳng định ngược với mã: E11 (dòng 225-226) viết "4 mốc chọn ra không phải một lần cắt số (đối chứng dương — chân này KHẲNG ĐỊNH ĐƯỢC SAI, khác bản trước vốn đúng theo cấu tạo)", và E7 (dòng 143-146) trỏ thẳng sang E11 nên thừa hưởng nguyên lời khai sai đó. Dòng PASS ở cuối script (dòng 87) cũng in cho người đọc cụm "(doi chung duong: so tai moc KHAC so tai cha)" — một lời tự chứng không thể sai.

### 5. Hình dạng 4 — kết luận PASS từ diff rỗng, đối chứng dương mà AC-7 khai đã bị bỏ và lỗi git bị nuốt
- file: `_acceptance/release-2-11-0/rang-moc.sh:79`
- severity: medium
- source: measurement
- AC: AC-7
- rationale: AC-7 quy định rõ ba chân tách bằng ba mã thoát riêng, trong đó có một chân đối chứng dương bắt buộc ("git diff --name-only 04069351..HEAD -- lib/ phải KHÁC rỗng"); finding cho thấy chân đó hoàn toàn không tồn tại trong script, nên Then của AC-7 thất bại trực tiếp.

Vế quyết định xanh là `DOI="$(G diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"` rồi `[ -n "$DOI" ]` → exit 5, ngược lại rơi xuống PASS. Script chạy với `set -u` (không `-e`), stderr của `git diff` bị đổ vào /dev/null và mã thoát của nó không được kiểm, nên "rỗng vì không đổi" và "rỗng vì lệnh diff không chạy được" cho cùng một màu xanh — đúng lớp lỗi mà contract.md AC-7 (dòng 132-137) dựng đối chứng dương để chặn: "đối chứng dương cùng cửa sổ — `git diff --name-only 04069351..HEAD -- lib/` phải KHÁC rỗng. Ba chân này tách nhau bằng ba mã thoát riêng, nên 'rỗng vì không đổi' không lẫn được với 'rỗng vì git chết / clone nông / sai thư mục'". Phép đo đã giao KHÔNG có chân đó: không chỗ nào trong rang-moc.sh chạy một diff phải-khác-rỗng để chứng minh cửa sổ `NEO..HEAD` và cỗ máy diff đang sống. Chân duy nhất còn lại (exit 6, đọc số tại HEAD, dòng 51-55) chứng minh vật còn tồn tại chứ không chứng minh phép so trong đường PASS đã thật sự chạy. Chân đáng lẽ thay thế nó (exit 4) thì không đỏ được — xem finding #4 — nên sau khi bỏ đối chứng của AC-7, răng này không còn phép đo dương nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **`.gitignore` thêm `s4-args.json` KHÔNG NEO đường dẫn — nuốt luôn artifact provenance đang được commit ở `_acceptance/<slug>/`**
  Người dùng thấy gì: Hồ sơ chấp nhận mới có thể bị bỏ sót một tệp bằng chứng quan trọng khỏi việc lưu trữ mà không có cảnh báo, khiến dấu vết xử lý của tính năng bị mất khi cần tra cứu lại sau này.
  file: `.gitignore`
  severity: medium
  Đề xuất: new-contract

- **`rang-moc.sh` treo VÔ HẠN khi `--chan` thiếu giá trị — không mã thoát, không thông điệp**
  Người dùng thấy gì: Nếu công cụ đo mốc phát hành được gọi thiếu một tham số, nó có thể treo vô thời hạn thay vì báo lỗi, làm tắc nghẽn quy trình phát hành mà không rõ nguyên nhân.
  file: `_acceptance/release-2-11-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

- **`stripYamlComment` được XUẤT KHẨU nhưng sai trên flow-sequence — đúng lớp mangle mà vòng này tồn tại để đóng**
  Người dùng thấy gì: Một hàm xử lý nội bộ chưa được kiểm chứng đầy đủ nay được mở ra cho nơi khác dùng; nếu sau này có người dùng sai cách, giá trị cấu hình chứa dấu thăng có thể bị đọc sai mà không báo lỗi.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Lời khai của E10 mâu thuẫn với mã: `--ag-root` là cờ TÙY CHỌN, thiếu nó KHÔNG fail-CLOSED trong kho kit**
  Người dùng thấy gì: Tài liệu mô tả cho rằng thiếu một tham số vị trí sẽ khiến công cụ dừng lại an toàn, nhưng thực tế nó có thể tự đoán vị trí và chạy tiếp — nếu đoán sai, lỗi cấu hình có thể bị che giấu thay vì báo ngay.
  file: `_acceptance/release-2-11-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **`die3()` thoát mã 2 trong khi mã 3 là một mã CÓ NGHĨA RIÊNG của chính script này**
  Người dùng thấy gì: Không ảnh hưởng người dùng cuối trực tiếp — thông điệp lỗi vẫn đúng nội dung, chỉ tên gọi nội bộ dễ khiến người bảo trì sau này hiểu nhầm ý nghĩa và sửa sai chỗ.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: known-limits

- **`readers()` nhớ bộ đọc đầu tiên ở biến module, bỏ qua `agRoot` của lần gọi sau; và `plan()` — hàm được export — nay có thể `process.exit`**
  Người dùng thấy gì: Nếu công cụ này được dùng lại nhiều lần trong cùng một lần chạy với các thư mục gốc khác nhau, nó có thể âm thầm dùng nhầm cấu hình của lần trước; và một lỗi nội bộ hiếm gặp có thể làm dừng đột ngột cả tiến trình gọi nó.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: known-limits

- **`parseFlowValue(m[2])` gọi HAI LẦN trên cùng một đầu vào, và mỏ neo đột biến của BG8 ghim chính bản trùng lặp đó**
  Người dùng thấy gì: Không ảnh hưởng người dùng — đây chỉ là một chỗ tính toán lặp lại không cần thiết bên trong, kết quả cuối cùng vẫn đúng.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

- **`rang-moc.sh --chan` without a value spins forever (infinite loop, no output)**
  Người dùng thấy gì: Nếu công cụ đo mốc phát hành được gọi thiếu một tham số, nó có thể treo vô thời hạn thay vì báo lỗi, làm tắc nghẽn quy trình phát hành mà không rõ nguyên nhân.
  file: `_acceptance/release-2-11-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/13 lỗi rơi vào file không bộ đo nào phủ (.gitignore, _acceptance/release-2-11-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.