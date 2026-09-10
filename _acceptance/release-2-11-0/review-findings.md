## Trong hợp đồng

### stripYamlComment không nhận biết vỏ nháy cho list inline `[...]` — tái mở đúng chuỗi xanh-giả mà AC-4 khai đã đóng
- file: `lib/evidence-core.cjs:189`
- severity: high
- AC: AC-4

`stripYamlComment` chỉ nhận biết vỏ nháy khi TOÀN BỘ chuỗi là một scalar bọc nháy (`closingQuoteIndex(s)` đòi `s[0]` là dấu nháy). Với một flow-sequence `[...]`, `s[0] === '['` nên nó rơi thẳng về mệnh đề trần `s.replace(/\s+#.*$/, '')` — đúng mệnh đề mà chú thích ngay phía trên tuyên bố là sai.

Đo được trên chính cây này:

    resolveConfigList('bg:\n  a: ["click #submit", "then b"]\n', 'bg.a')  ->  ['"click']
    stripYamlComment('["click #submit", "then b"]')                     ->  '"click'

Hai hệ quả cùng lúc: (a) các item còn lại BIẾN MẤT LẶNG (2 item -> 1); (b) item còn lại mang dấu nháy MỞ không cân — `unquoteScalar` đúng thiết kế trả nguyên văn, nên chuỗi giao cho `bash -c` vỡ cú pháp và thoát 2, trong khi `EXPECTED_EXIT_BANNED = [97, 127]` KHÔNG cấm 2. Đó chính xác là chuỗi xanh-giả bốn bước mà hồ sơ release-2-11-0 tồn tại để đóng, chỉ khác nguồn gây nháy-không-cân.

Cùng lỗ ở bên feature-loop: `feature-loop/scripts/s4-args.mjs:142` gọi `stripYamlComment(vRaw)` rồi `parseInline` (dòng 131) trên `steps` / `paths` / `inputs`. Mô phỏng đúng biểu thức đó: `steps: ["click #submit", "assert title"]` -> `['"click']`. `steps` là CHỈ THỊ giao cho agent (Coverage của hợp đồng ghi rõ nó đang bị xén thật ở crm và artifact-platform) — một selector CSS `#submit` là hình dạng rất thật, không phải ca giả tưởng.

Đây là đường 2 và đường 4 của bảng «danh sách đóng» AC-4, tức nằm TRONG hợp đồng, không phải ngoài. Known limits không khai hình dạng này (chỉ khai un-double nháy đơn và ca «nháy hai đầu không phải một cặp»). Review-findings lượt 1 mục 3 đã mô tả đúng cơ chế này; bản vá lượt 2 chỉ phủ nhánh SCALAR, bỏ nhánh inline. BG7 cũng chỉ thử `#` trong vỏ ở nhánh KHỐI (`- "cd x # y"`) và `,` trong vỏ ở nhánh inline — không có ô `#` trong vỏ ở nhánh inline, nên ma trận xanh mà lỗ vẫn sống (đúng lớp AC-12 sinh ra để chặn).

Sửa đúng tầng là thứ tự: tách phẩy ngoài vỏ TRƯỚC, rồi cắt chú thích trên từng item (hoặc cho `stripYamlComment` biết nó đang đứng trước một flow-sequence).

Vì sao đây là AC-4 chưa đóng: AC-4 liệt kê chính đường 2 (resolveConfigList inline) và đường 4 (s4-args list field inline) trong danh sách đóng; stripYamlComment sai trên flow-sequence khiến giá trị các đường này không trả nguyên văn, đúng điều AC-4 Then cấm.

### rang-moc.sh anchors on last manifest touch, not last version bump; leg 2 cannot fail
- file: `_acceptance/release-2-11-0/rang-moc.sh:42`
- severity: low
- AC: AC-11

NEO is computed as `git log -n1 --format=%H -- diagram-design/.claude-plugin/plugin.json`, i.e. the last commit that TOUCHED the manifest, while the stated promise (header line 12) is "diagram-design/ không đổi KỂ TỪ lần cắt số gần nhất của CHÍNH NÓ". A commit that edits diagram-design/ content and also edits the manifest without bumping `version` (a description or keyword edit — exactly what the acceptance-gate manifest gets every release) becomes the new NEO, so leg 3 compares NEO..HEAD, finds nothing, and the tooth reports PASS while diagram-design/ content changed with the version left stale. Fail-open in the direction the tooth exists to guard.

Related, same file: leg 2 (line 54) is declared the "ĐỐI CHỨNG DƯƠNG" against "phép đo không chạy thật", but NEO was selected by a path that lives inside diagram-design/, so `diff-tree -- diagram-design/` on it is true by construction and the leg can never fire. And line 67 runs `G show HEAD:$MANIFEST | sed ...` with no `set -o pipefail`, so if git show fails, SO is empty and the script still prints `PASS: ... giu ` with a blank version.

Fix direction: derive NEO from the last commit where the manifest's `version` value actually changed (e.g. walk `git log --format=%H -- $MANIFEST` and compare `git show <sha>:$MANIFEST` versions), and make leg 2 assert something independent of how NEO was picked.

Vì sao đây là AC-11 chưa đóng: AC-11 đòi mốc so phải "suy từ kho" đúng nghĩa "lần cắt số gần nhất của chính nó"; finding chứng minh mốc so thực chất là "lần chạm manifest gần nhất", hai điều có thể khác nhau — đúng bất biến AC-11 cam kết mà không giữ được.

### Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ — E11 ghim cứng `giu 2.7.0` vào expected, đúng thứ AC-11 sinh ra để bỏ
- file: `_acceptance/release-2-11-0/evals.yaml:215`
- severity: high
- AC: AC-11

AC-11 hứa một QUAN HỆ bền: «diagram-design/ không đổi KỂ TỪ lần cắt số gần nhất CỦA CHÍNH NÓ», cốt để răng của hồ sơ đã ký còn xanh khi chiến dịch ghim lại chạy nó ở một HEAD muộn hơn sau khi diagram-design đã đổi. Nhưng `expected` của E11 lại khai một PHÉP CÓ-MẶT CHUỖI: «stdout có dòng «PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (<sha>), giu 2.7.0 (…)»». Tác giả đã trừu tượng hoá phần biến thiên của sha thành `<sha>` nhưng để NGUYÊN literal `2.7.0`. `rang-moc.sh:67` đọc số từ `git show HEAD:diagram-design/.claude-plugin/plugin.json` nên dòng in ra đổi theo kho.

Đã dựng thật: `git archive HEAD` ra bản sao trọn cây, bump diagram-design lên 2.8.0, commit, chạy lại răng → script vẫn `exit=0` và in «… giu 2.8.0 …». Tức đúng kịch bản Given của AC-11 (diagram-design đổi sau khi mốc này ship), VẬT thì sống nhưng LỜI KHAI của eval thì đỏ: người/agent chấm lại so stdout với `expected` đòi `giu 2.7.0` sẽ chấm FAIL. Chỗ giòn chỉ dời từ script sang expected, không bị gỡ.

Kèm theo: kịch bản Given của AC-11 không được chạy ở đâu cả — E11 chỉ quan sát «răng xanh ở HEAD hôm nay», y hệt E7 (cùng `cmd`, cùng dòng PASS). Ở HEAD hôm nay bản răng CŨ ghim cứng cửa sổ `04069351..HEAD` cũng xanh, nên phép đo hành vi không phân biệt được bản trước vá với bản sau vá; thứ duy nhất phân biệt là chuỗi thông điệp — đúng hình dạng số 3. Ba chiều đỏ mà E11 nêu (exit 3/4/5) đều tự khai là «đã chạy TAY 10/09», và không cái nào là kịch bản của AC-11 (mốc dời tới trước → vẫn xanh).

Vì sao đây là AC-11 chưa đóng: AC-11 tồn tại chính xác để răng của hồ sơ mốc sống qua chiến dịch ghim lại kể cả sau khi diagram-design cắt số mới; expected ghim cứng số cũ '2.7.0' tái tạo đúng lỗi mà AC-11 cấm, chỉ dời từ mã sang lời khai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **rang-moc.sh treo vô hạn khi `--chan` thiếu giá trị — hạ tầng hỏng không có tên, không có mã thoát**
  Người dùng thấy gì: Nếu ai đó chạy công cụ kiểm tra bản phát hành mà quên nhập giá trị cho một tuỳ chọn, công cụ có thể treo vô thời hạn thay vì báo lỗi ngay, làm mất thời gian chờ trong dây chuyền phát hành.
  file: `_acceptance/release-2-11-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

- **AC-10 chưa giữ được: carry-plan và s4-args vẫn bất đồng trên `paths:` có chú thích đuôi dòng**
  Người dùng thấy gì: Khi một dòng cấu hình liệt kê tệp có kèm ghi chú ở cuối dòng, hai phần của hệ thống có thể đọc khác nhau — hệ quả là một số bước kiểm tra chạy lại thừa dù không cần, không làm mất kết quả nhưng tốn thêm thời gian.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: known-limits

- **.gitignore thêm `s4-args.json` không neo đường dẫn và không có dòng chú thích như mọi mục khác**
  Người dùng thấy gì: Không ảnh hưởng người dùng — đây chỉ là một quy tắc bỏ qua tệp trong hệ thống quản lý mã nguồn, thiếu một dòng giải thích cho người bảo trì sau này.
  file: `.gitignore`
  severity: low
  Đề xuất: wont-fix

- **rang-moc.sh loops forever when --chan is passed without a value**
  Người dùng thấy gì: Nếu ai đó chạy công cụ kiểm tra bản phát hành mà quên nhập giá trị cho một tuỳ chọn, công cụ có thể treo vô thời hạn thay vì báo lỗi ngay, làm mất thời gian chờ trong dây chuyền phát hành.
  file: `_acceptance/release-2-11-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

- **paths entry `diagram-design` matches no file — E7/E11 can be carried forward stale**
  Người dùng thấy gì: Một vài mục kiểm tra liên quan tới phần vẽ sơ đồ có thể giữ nguyên kết quả kiểm tra cũ trong một vòng sửa lỗi nhiều bước, dù nội dung đã thay đổi — khiến thay đổi mới chưa chắc được kiểm tra lại kịp thời trong vòng đó.
  file: `_acceptance/release-2-11-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Inline `cmd:` in evals.yaml keeps its YAML quotes — ninth executed-value path uncovered**
  Người dùng thấy gì: Khi một dự án tiêu thụ viết lệnh kiểm tra trong ngoặc kép ở tệp cấu hình, lệnh đó có thể chạy sai và báo lỗi gây hiểu nhầm nguyên nhân — hiện chưa có dự án nào dùng cách viết này nên chưa ai gặp phải.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — E10 khai «thiếu --ag-root là fail-CLOSED có tên», mã KHÔNG làm vậy và BG9 không hề chạm đường đó**
  Người dùng thấy gì: Một mục kiểm tra mô tả một cơ chế bảo vệ mà trên thực tế chưa từng được chạy thử để xác nhận — người đọc báo cáo kiểm tra có thể tin nhầm vào một sự bảo vệ chưa được chứng minh là tồn tại.
  file: `_acceptance/release-2-11-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/10 lỗi rơi vào file không bộ đo nào phủ (.gitignore, _acceptance/release-2-11-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
