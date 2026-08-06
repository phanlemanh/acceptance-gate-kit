## Trong hợp đồng

### 1. Hai bộ đếm của acceptance-gold bất đồng về thụt lề → bất đẳng thức sanity đỏ oan, đổ lỗi cho reader
- file: `scripts/acceptance-gold.mjs:84`
- severity: medium
- AC: AC-6
- source: bugs

`countJudgmentBlocks` yêu cầu `^\s+judged_by\s*:` (ÍT NHẤT một khoảng trắng), trong khi parser điểm vàng `collectGold` khớp field bằng `^(\s*)(\w+)\s*:` (KHÔNG hoặc nhiều). Một evidence-report có field không thụt lề vẫn được collectGold nhận, nhưng bộ đếm độc lập không thấy — vi phạm bất biến `judgmentBlocks >= points` mà cả P152 (run-tests.sh:6074) lẫn P164 (run-tests.sh:7407) dựa vào.

Đã dựng lại đúng ca này:
```
$ printf '## Per-eval\n\n- eval: E1\n  verdict: PASS\njudged_by: model-x\nhuman_override: nguoi quyet vi ly do\n' > t1/_acceptance/viec-mau/evidence-report.md
$ node scripts/acceptance-gold.mjs --root t1 --stats
{"judgmentBlocks":0,"points":1}
$ node scripts/acceptance-gold.mjs --root t1 --json | grep judgedBlocks
  "judgedBlocks": 1,
```
Kết quả: cả plugins suite ĐỎ với thông điệp 'bat dang thuc vo: phan < diem' / 'bat dang thuc do' — tức chốt tố cáo NHÁNH ĐỌC HỎNG trong khi vật thật chỉ là một hồ sơ viết thiếu thụt lề. Người sửa sẽ đi tìm bug trong reader thay vì trong artifact. Bản mirror plugins/acceptance-gate/scripts/acceptance-gold.mjs mang y hệt lỗi.

Sửa: cho hai bên dùng CÙNG một luật nhận field (`^\s*judged_by\s*:`), hoặc nếu cố ý giữ bộ đếm 'ngây thơ' thì bất đẳng thức phải chấp nhận sai lệch đó thay vì biến nó thành ĐỎ.

### 2. P161-E12 zero-tolerance biến một glob thường trong bất kỳ contract nào thành ĐỎ toàn suite
- file: `tests/plugins/run-tests.sh:7011`
- severity: medium
- AC: AC-4
- source: bugs

Ngưỡng cũ `len(kinds) <= 25` được thay bằng `assert not orphan` — MỘT cụm sao không phân loại được là đỏ. Vòng quét chạy trên `_acceptance/*/contract.md` + `decisions.jsonl` của MỌI slug (27 hôm nay, còn tăng) — tức văn xuôi tự do do người/LLM viết ở mọi feature tương lai.

Bảng 23 hình dạng KHÔNG phủ glob dạng `*.<ext>` (không có `/` đứng trước, không có sao đóng cặp). Chạy lại đúng vòng phân loại của P161 trên corpus thật, chỉ thêm MỘT dòng bình thường vào một contract:
```
khong tiem        -> orphan: 0 []
them 1 glob *.md  -> orphan: 1 [('card-text-fidelity', '*.md')]
```
→ toàn bộ tests/plugins/run-tests.sh (và cả CI) ĐỎ với 'bang KHONG phu corpus', vì một feature khác viết `*.md` trong hợp đồng của nó. Chi phí gỡ: phải sửa contract.md của card-text-fidelity — một workspace ĐÃ KÝ — thêm hàng vào marker STRIP-SHAPE-MATRIX, bump 'CE: **23**', thêm hàng CASES + STRUCT.

Ghi chú phụ (cùng chỗ): vòng quét đọc TOÀN VĂN không tách dòng, nên regex `nghiêng-chuẩn` cho phép một sao lẻ bắt cặp với một sao lẻ khác ở BẤT KỲ đâu trong file. Vì vậy phép đo vừa quá chặt với `*.md` vừa mù với sao mồ côi thật khi file có số sao lẻ chẵn.

### 3. ONLY_BLOCK chỉ lọc khối bọc bởi run() — 30 assertion inline vẫn chạy và vẫn tính pass/fail
- file: `tests/plugins/run-tests.sh:16`
- severity: medium
- AC: AC-8
- source: bugs

Bộ lọc nằm TRONG hàm `run()`, nhưng suite có 112 khối `run` và 64 lệnh `pass`/`fail` gọi thẳng ngoài `run` (P41, P42, P45, P145–P148…). Đo thật:
```
$ PLUGINS_SUITE_NESTED=1 ONLY_BLOCK=__nomatch__ bash tests/plugins/run-tests.sh | grep -cE '^  (PASS|FAIL)'
30
$ time PLUGINS_SUITE_NESTED=1 ONLY_BLOCK=P161 bash tests/plugins/run-tests.sh   # 37.5s
```
Ba hệ quả:
(a) Bước CI `TEETH=1 ONLY_BLOCK=P163` (gate.yml:31) KHÔNG đặt PLUGINS_SUITE_NESTED, nên P42 và P45 vẫn chạy — mỗi khối tự sinh một lượt suite LỒNG trọn vẹn (P42 chạy hai lượt). Bước 'răng' vì thế chạy lại 3 lượt suite đầy đủ đã chạy ở bước trước đó, cộng ~10 phút của P163.
(b) Verdict của bước CI đó không thuộc phạm vi P163: bất kỳ khối inline nào đỏ cũng làm bước răng đỏ, chỉ tay sai chỗ.
(c) Trong P163, `run_block` cũng không cô lập được khối: assert ở dòng 7512 ('khoi %s DO tren ban NGUYEN VEN — khong the tin cac ca vat hong') sẽ quy tội cho khối được nêu tên khi thật ra một trong 30 khối inline mới là cái đỏ. Đây cũng là lý do mỗi lượt tốn ~37s chứ không phải 'vài giây' như chú thích ở dòng 14–15 khai.

Sửa: đưa bộ lọc lên một chốt bao cả khối inline (vd một hàm `skip_block <ten>` gọi đầu mỗi khối), hoặc bọc các khối inline vào `run`.

### 4. Quan hệ thứ tự 'ghi entry TRƯỚC khi sửa assert' của P165 tự vô hiệu trong đúng quy trình chuẩn
- file: `tests/plugins/run-tests.sh:7634`
- severity: medium
- AC: AC-9
- source: bugs

Vòng kiểm thứ tự chỉ tính vi phạm khi `c_entry != c_assert` (dòng 7628). Nhưng quy trình của kit commit sổ quyết định CÙNG LƯỢT với bản sửa, nên hai mốc luôn trùng và vòng luôn `continue`. Đo trên chính vòng này:
```
$ git log --format=%h -S 'len(kinds) <= 25' -- _acceptance/measure-teeth-cleanup/decisions.jsonl
508d502
$ git log --format=%h -S 'len(kinds) <= 25' -- tests/plugins/run-tests.sh
508d502
a3d8eb2
```
→ c_entry == c_assert == 508d502, `unordered` rỗng. Chạy thật xác nhận: 'P165 OK: 1 assert doi, 4 entry SIET, 0 NOI' — vế thứ tự chưa từng được quan sát ĐỎ một lần nào, kể cả trên vòng nó được viết ra để canh.

Đây đúng lớp lỗi CLAUDE.md gọi là assertion không sống: nhánh phát hiện không bao giờ chạy nên không phân biệt được 'không có vi phạm' với 'chưa bao giờ đo'. Sổ có khai known-limit 'cùng-commit không phân biệt được thứ tự', nhưng khai đó biến trường hợp CHUẨN thành ngoại lệ, tức luật chỉ còn tồn tại trên giấy. Muốn có răng thì phải đo bằng thứ tự trong-commit (vd entry phải có mặt ở commit cha, hoặc bắt buộc entry landing ở commit riêng trước).

### 5. Hình dạng 4 — assertion không sống: mẫu số `attempted == len(slugs)` là hằng đúng, và bộ đếm được assert không phải bộ đếm mà các chân khác dựa vào
- file: `tests/plugins/run-tests.sh:6935`
- severity: high
- AC: AC-5
- source: measurement

Hai lỗi cùng chỗ trong chân AC-5 mới (6935-6947). (a) `attempted` được tăng đúng một lần mỗi vòng lặp `for slug in slugs` (6938-6939), nên `assert attempted == len(slugs)` (6943) là mệnh đề hằng đúng — không có đường nào làm nó đỏ; phần còn sống chỉ là `attempted > 0`, đã được `assert slugs` ở trên bảo đảm. E6 đòi mẫu số để chặn "0 hỏng luôn đúng vô nghĩa", nhưng mẫu số lại lấy từ chính vòng lặp nó canh. (b) Dòng 6935 RESET `RENDER["ok"]/["fail"]` về 0, vứt đúng số đếm của các lời gọi thật: `untraceable(CARD)` (6910) và `intact_count(CARD/old_js)` (6929) gọi `card(js, slug, gate)` với `--gate 1/2` và `if out is None: continue` — thẻ hỏng bị bỏ qua im lặng, và nếu MỌI thẻ hỏng thì `bad_new == []` nên `assert not bad_new` (6911) xanh vô nghĩa. Vòng đếm mới lại gọi `node CARD --root … --slug …` KHÔNG có `--gate` (6940-6941), tức đo một lời gọi khác với lời gọi mà các assert quan hệ phụ thuộc vào. Lỗ "đếm rồi vứt" mà comment 6932-6934 nói đang chữa vẫn còn nguyên trên đường `--gate`.

### 6. Hình dạng 5 — tuyên ma trận toàn phần nhưng chỉ có điểm-case: comment ghi "3 tiền tố x 4 tên file" mà bảng chỉ có 6 phần tử
- file: `tests/plugins/run-tests.sh:7208`
- severity: high
- AC: AC-1
- source: measurement

Comment 7208-7210 khai "ma tran DAY DU: 3 hinh dang TIEN TO x 4 hinh dang TEN FILE" — tích đầy đủ là 12 phần tử. Danh sách thực tế (7211-7216) chỉ có 6 hàng: `${PLUGIN_ROOT}` được ghép với cả 4 hình dạng tên (chữ thường .mjs, gạch dưới, chữ hoa, đuôi .py), còn `<plugin>` và `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}` mỗi cái chỉ có đúng một tên chữ-thường-.mjs. Nghĩa là 6/12 ô của ma trận đã khai không có assert nào — cùng đúng lớp lỗi mà comment nói mình đang chữa ("ban truoc chi 3 tien to voi cung mot ten chu-thuong-.mjs, nen thu regex ve [a-z0-9-]+ van xanh"): một lần thu hẹp `ANY_REF` (7113) chỉ ở nhánh tiền tố `<plugin>` hoặc `${CLAUDE_PLUGIN_ROOT:-…}` sẽ vẫn xanh. Ngoài ra hình dạng KHÔNG-tiền-tố (nhánh mới `prefix in ("", "./")` ở 7118-7119 và thang phân giải KITNAMES/OTHERPKG ở 7141-7150 — chính lõi của AC-1) không có ô nào trong ma trận mutant.

### 7. Hình dạng 1 — đo NHÃN người viết thay vì nguồn độc lập: `declared == tagged` so hai danh sách chép tay, nguồn thứ ba chỉ print
- file: `tests/plugins/run-tests.sh:7466`
- severity: medium
- AC: AC-7
- source: measurement

E8 (evals.yaml) hứa "Tập khối khai == tập rút từ NGUỒN ĐỘC LẬP với bảng (quét cây kiểm tìm khối có dựng bản sao) — thừa đỏ thiếu đỏ". Assert duy nhất (7466-7467) so `declared` (đọc từ scripts/measures-need-teeth.tsv) với `tagged` (regex `run "(P\d+) [TEETH]` trên chính run-tests.sh) — cả hai đều là nhãn do cùng một người viết trong cùng một lượt, và comment 7468-7471 tự thừa nhận điều đó ("KHONG phai hai nguon doc lap that"). Nguồn thật sự độc lập — quét khối có `mktemp|copytree|worktree add|cp -R` mà chưa gắn thẻ (7473-7480) — chỉ `print` cảnh báo, không đưa vào assert nào. Kết quả: một khối cần răng bị quên gắn thẻ VÀ quên khai bảng sẽ không làm đỏ bất cứ gì; phép đo chỉ bắt được trường hợp lệch giữa hai bản chép của cùng một tuyên bố.

### 8. Hình dạng 4 — bước tiêm không phân biệt "tiêm thành công" với "tiêm không làm gì"
- file: `tests/plugins/run-tests.sh:7517`
- severity: low
- AC: AC-7
- source: measurement

`assert h.returncode == 0, "dung vat hong cho %s THAT BAI…"` (7517) là chân duy nhất canh bước dựng vật hỏng. Mọi lệnh trong scripts/measures-need-teeth.tsv đều có dạng `python3 -c "…p.write_text(p.read_text().replace(A, B))"`, mà `str.replace` trả về chuỗi gốc và thoát 0 khi A không còn tồn tại — ví dụ hàng P155 ghim nguyên văn `'- single-source — một chỗ duy nhất giữ sự thật, nơi khác đọc lại'`, hàng P157 ghim nguyên văn một câu trong acceptance-gold.mjs, hàng P161 ghim `'- glob-một-sao — giữ nguyên'`. Khi văn bản nguồn đổi một chữ, lệnh vẫn exit 0, `assert` ở 7517 im lặng, và lỗi chỉ nổi lên ở 7519 dưới thông điệp sai địa chỉ ("PHEP DO MU: khoi X van XANH tren vat hong") — chỉ người đọc không có cách phân biệt "khối mất răng" với "lệnh tiêm no-op". E8 đòi "dựng vật hỏng thất bại → ĐỎ thông điệp riêng"; chân hiện tại chỉ bắt được lệnh CRASH, không bắt được lệnh chạy xong mà không đổi byte nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P165 — chốt thường trực lấy thẩm quyền từ hồ sơ workspace của một feature (đúng anti-pattern đã ghi trong repo)**
  Người dùng thấy gì: Một quy tắc kiểm tra áp dụng vĩnh viễn cho mọi thay đổi sau này lại dựa vào nhật ký quyết định của một tính năng đã đóng; càng về sau, ai sửa bất kỳ dòng kiểm tra cũ nào cũng buộc phải ghi thêm vào đúng hồ sơ cũ đó, khiến gánh nặng bảo trì tăng dần theo thời gian.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **ONLY_BLOCK chỉ lọc khối gọi qua run() — lời hứa "chạy đúng MỘT khối, vài giây" sai, bước CI teeth chạy lại nửa suite**
  Người dùng thấy gì: Bước kiểm tra 'phải có răng' được mô tả là chỉ mất vài giây mỗi lần chạy, nhưng thực tế mất hơn ba phút vì vẫn chạy lại phần lớn bộ kiểm tra đầy đủ, làm quy trình kiểm tra tự động chậm hơn nhiều so với cam kết.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Cờ --stats mới không có trong usage của acceptance-gold.mjs và âm thầm chiếm quyền trước --json**
  Người dùng thấy gì: Tùy chọn xuất số liệu mới của công cụ đo không được ghi trong hướng dẫn sử dụng, và nếu gọi cùng lúc với tùy chọn cũ, công cụ âm thầm đổi định dạng kết quả trả về mà không báo lỗi.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/acceptance-gold.mjs`
  severity: low
  Đề xuất: known-limits

- **P163 dọn worktree sai thứ tự và gọi `git worktree prune` không điều kiện lên kho của người dùng**
  Người dùng thấy gì: Quá trình dọn dẹp sau khi chạy kiểm tra có thể để lại rác trên máy nếu bị ngắt giữa chừng, và trong một số trường hợp còn xoá nhầm thông tin không gian làm việc của các công cụ khác đang chạy trên cùng kho mã.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 3 — assert "chuỗi có mặt" trong khi lời hứa là bước CI đang chạy**
  Người dùng thấy gì: Phép kiểm xác nhận bước kiểm 'răng' có chạy trong quy trình tự động chỉ tìm một chuỗi chữ xuất hiện đâu đó trong tệp cấu hình, kể cả khi đó chỉ là một dòng chú thích hoặc một bước đã bị tắt — nên không thật sự đảm bảo bước kiểm tra đó đang chạy.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).