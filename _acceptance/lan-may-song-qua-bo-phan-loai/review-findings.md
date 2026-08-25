## Trong hợp đồng

### 1. Bộ đọc danh sách YAML thứ hai trong ca — trùng `configList()` của kit, và lời khai «bộ đọc chung chỉ giải scalar» là SAI
- file: `tests/plugins/lan-may-classifier.test.mjs:62`
- severity: **high**
- AC: AC-1

`suiteCommands()` tự cắt section bằng `/^\s{2}suite_keys:\s*$/` và bóc item bằng `/^\s{4}- ([\w.]+)\s*$/`. Chú thích ngay trên nó khai: «bộ đọc chung của kit chỉ giải scalar, không giải list». Lời khai đó sai — `lib/workspace-record.cjs` export `configList(cfgTxt, key)` đúng cho việc này, và chú thích của chính nó dặn: «hai bên đọc cùng một khoá không được cho hai kết luận trái nhau (S4-r15)». Đã chạy thử: `configList(config.yaml, 'suite_keys')` trả đúng 5 khoá.

Hai bộ đọc ĐÃ lệch nhau trên hình dạng YAML hợp lệ (phá thử trên cây sao chép):
- Thêm comment đuôi vào dòng khoá: `  suite_keys:   # chay moi vong verify` → `configList` vẫn đọc 5 khoá; ca thì FAIL [LM1] «khong tim thay feature_loop.suite_keys trong config», tức ĐỎ vì HẠ TẦNG chứ không vì vật (đúng lớp lỗi CLAUDE.md nêu ở P150).
- Cho một item vào nháy: `    - "executors.test.scripts"` → `configList` vẫn 5 khoá; ca đếm 0 khoá, `cmds` rỗng, LM1 báo cả 5 entry là THỪA (thông điệp sai nguyên nhân), và vế «lệnh kiểm đặt NHẦM CHỖ» của LM8 thành assertion không thể kêu.

Ngoài ra `suiteCommands` không kiểm khoá nằm dưới `feature_loop:` — bất kỳ `suite_keys:` nào thụt 2 khoảng ở chỗ khác đều khớp.

AC-1 đòi thông điệp đỏ nêu ĐÍCH DANH lệnh thừa/thiếu dựa trên quan hệ song ánh giữa hai file; bộ đọc lệch khiến YAML hợp lệ bị báo sai lệnh thừa/thiếu.

### 2. Hội đồng E7 bị hỏi về E3 nhưng không được đưa file cài E3 — chỉ còn đường tin lời văn `expected` tự khai
- file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml:190`
- severity: **medium**
- AC: AC-7

`inputs: [../../tests/plugins/lan-may-classifier.test.mjs, evals.yaml]` — không có `rang-khong-nuot.mjs`. Nhưng câu hỏi E7 hỏi thẳng: «E3 có rút danh sách khoá phải-giữ TỪ chính bản trước, hay liệt tay?» và bắt «in lại con số đọc được từ marker MUTANT-MATRIX cho TỪNG ca, cạnh số mutant bạn ĐẾM ĐƯỢC trong file test». E3 không có ca nào trong file test, nên hội đồng đếm được 0, và muốn trả lời câu về `checkPreserved` thì chỉ còn cách chép lại lời `expected` của chính evals.yaml — đúng thứ mà câu hỏi tự cấm ở dòng «ĐỪNG suy từ chính file test rồi tuyên khớp (bộ ca tự làm chứng cho chính nó)». Vì vậy vế judgment cho AC-3 hoặc thành PASS trên tiền đề tự khai, hoặc thành FAIL vì hạ tầng.

AC-7 đòi hội đồng đọc chính bộ ca để xác nhận các thuộc tính đo được; thiếu file cài đặt khiến hội đồng chỉ còn cách tin lời tự khai — đúng thứ AC-7 cấm.

### 3. Mục GUIDE mới nằm SAU dòng kết của tài liệu và không có trong Mục lục
- file: `GUIDE.md:1034`
- severity: **low**
- AC: AC-6

`## Làn máy và bộ phân loại an toàn` được nối vào cuối file, tức sau dòng đóng «*Tài liệu đồng hành: [README.md]… [QUICKSTART.md]…*» (dòng 1031) vốn đọc như dấu chấm hết của cả GUIDE, và sau mục «## 10. Dành cho người bảo trì kit». Mục lục ở dòng 7-27 liệt tới mục 10 và không có mục mới. Người vận hành tra mục lục — đúng người mà AC-6 nhắm — sẽ không thấy nó.

AC-6 đòi người vận hành TRA GUIDE.md thấy được cả luật cho-phép lẫn đường thoái hoá; đặt sau dòng kết và ngoài mục lục làm nội dung không tìm ra được khi tra.

### 4. AC-5 «mốc neo là chỗ DUY NHẤT» đếm SỐ FILE, không đếm số khối — bản sao thứ hai trong cùng file lọt xanh
- file: `tests/plugins/lan-may-classifier.test.mjs:164`
- severity: **high**
- AC: AC-5

`checkFallback` xác lập vế ve4 bằng `listFiles().filter(f => readAt(f).includes('<<<CLASSIFIER-FALLBACK'))` rồi đòi `hits.length === 1`. Đó là số FILE chứa mốc neo, không phải số KHỐI. Trong khi AC-5 (contract.md:50) và E5 (evals.yaml:120-121) khai đúng chữ «đo bằng ĐẾM số khối mang mốc neo trên TRỌN skills/** + feature-loop/**, phải đúng 1».

Cộng thêm: `block()` (dòng 147-150) dùng `text.match(...)` nên chỉ trả về khối ĐẦU TIÊN. Hệ quả kép — khối thứ hai trong CÙNG file vừa không bị vế đếm bắt, vừa không được vế nội dung nào đọc tới.

ĐÃ THỬ TAY (đã khôi phục cây sạch): nối thêm vào cuối `feature-loop/skills/feature-loop/SKILL.md` một khối `<!-- <<<CLASSIFIER-FALLBACK -->…` thứ hai với luật NGƯỢC LẠI (đổi «lệnh chạy TUẦN TỰ» thành «cứ dispatch lại fan-out») → `LM_CASES=LM5 node tests/plugins/lan-may-classifier.test.mjs` vẫn in `PASS: [LM5] … 6 ve roi + 1 quan he dem duoc + 7 mutant`, exit 0. Mutant m4 (mốc neo mọc ở file THỨ HAI) chỉ chứng được chiều đỏ NGOÀI file, nên không hề chạm lớp này.

Đây đúng bảo đảm mà AC-5 tồn tại để giữ: một chỗ duy nhất khai luật thoái hoá. Sửa: đếm số lần xuất hiện của mốc neo trên trọn tập file (tổng occurrence), không đếm số file — và cho `block()` kêu khi khớp >1.

AC-5 đòi mốc neo là chỗ DUY NHẤT khai luật; phép đếm theo file thay vì theo khối để lọt một bản sao khối thứ hai trong cùng file, đúng điều AC-5 cấm.

### 5. Assert «chuỗi có mặt» thay cho QUAN HỆ đã hứa: vế 4 của LM5 đếm số FILE chứa mốc neo, trong khi lời hứa là số KHỐI khai luật phải bằng 1
- file: `tests/plugins/lan-may-classifier.test.mjs:164`
- severity: **medium**
- AC: AC-5

Dòng 164–166: `const hits = listFiles().filter(f => (readAt(f) || '').includes('<<<' + FALLBACK_ANCHOR)); if (hits.length !== 1) errs.push('ve4: moc neo xuat hien ' + hits.length + ' cho (phai dung 1)')`. `filter` chạy trên DANH SÁCH FILE, nên `hits.length` là số file có ít nhất một lần xuất hiện — không phải số khối. AC-5 trong contract hứa «mốc neo là chỗ DUY NHẤT khai luật này trong hai thư mục», và evals.yaml E5 (dòng 119–121) khai «đo bằng ĐẾM số khối mang mốc neo… phải đúng 1». Ca vi phạm thật lọt được: dán thêm một khối `<<<CLASSIFIER-FALLBACK` thứ hai (nội dung rút ruột hoặc mâu thuẫn) vào CHÍNH `feature-loop/skills/feature-loop/SKILL.md` → `hits.length` vẫn là 1 → xanh; và vì `block()` (dòng 148) dùng `[\s\S]*?` non-greedy nên nó chỉ trả về khối ĐẦU, sáu vế còn lại cũng không nhìn thấy bản sao thứ hai. Chiều đỏ duy nhất được cài cho vế này (dòng 286–291, `readPlus` nhét mốc neo vào `skills/acceptance/SKILL.md`) tiêm vào một FILE KHÁC — tức mutant được viết vừa khít đúng hình dạng mà phép đo nhìn thấy được, chính là câu hỏi trọng tâm mà E7 (dòng 178–180) đặt ra.

Cùng lớp lỗi với đo-theo-file-thay-vì-theo-khối ở AC-5: đo sai đơn vị khiến bản sao thứ hai của khối khai luật trong cùng file không bị bắt, đúng điều AC-5 hứa ngăn.

### 6. Không round-trip bên-viết → bên-đọc: hằng văn phạm `PERM_RULE` là bản chép tay nằm trong chính bên đọc, nên lớp «hai bên trôi CÙNG NHAU» mà AC-8 nêu vẫn mở
- file: `tests/plugins/lan-may-classifier.test.mjs:48`
- severity: **low**
- AC: AC-8

Dòng 43–49 đặt `const PERM_RULE = /^Bash\((.+)\)$/` giữa mốc neo `PERM-RULE-GRAMMAR` kèm chú thích «Nguồn: khoá `permissions` của khung cấu hình, đọc nguyên văn 2026-08-25» và «Khuôn sống ĐÚNG một chỗ: bên viết (settings) và bên đọc (ca này) phải cùng khuôn». Nhưng «một chỗ» đó nằm hoàn toàn trong BÊN ĐỌC: không có bước nào rút khuôn từ bên viết (harness) hay từ một artifact do bên viết sinh ra — `.claude/settings.json` cũng do chính lượt này gõ theo cùng bản đọc. AC-8 tự khai lý do tồn tại của mình là «bên VIẾT và bên ĐỌC có thể trôi CÙNG NHAU», và cơ chế được cài chỉ đóng đúng một nhánh hẹp (cả hai cùng bỏ lớp bọc `Bash(...)`); nhánh «văn phạm thật của harness khác bản chép tay» — ví dụ dạng tiền tố `Bash(cmd:*)` hay ngữ nghĩa khớp khác — thì settings, `PERM_RULE`, E1 song ánh và E2 đếm `*` đều xanh trong khi luật câm với harness, đúng kịch bản mà AC-8 nói nó ngăn.

AC-8 nêu đích danh lý do tồn tại là ngăn bên viết và bên đọc trôi CÙNG NHAU; khuôn văn phạm chỉ nằm trong bên đọc (chép tay), không rút từ bên viết, nên đúng nhánh trôi mà AC-8 nói nó phải ngăn vẫn còn mở.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **E3 `paths` không cập nhật sau khi AC-3 rời sang răng hồ sơ — carry-forward sẽ mang E3 PASS qua vòng dù răng vừa bị sửa**
  Người dùng thấy gì: Nếu vòng sửa sau này chỉ chỉnh đúng phần kiểm tra cấu hình mà không đụng file nào khác, báo cáo nghiệm thu vẫn có thể ghi phần đó là 'đã qua' dù chưa được chạy lại thật, khiến người đọc báo cáo tin nhầm.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Bảng MUTANT-MATRIX ghi E3 = «3 chân» trong khi `expected` của E3 và răng thật đều là 5 mutant**
  Người dùng thấy gì: Bảng tóm tắt số ca kiểm và phần mô tả chi tiết trong hồ sơ nghiệm thu ghi hai con số khác nhau cho cùng một phép kiểm, khiến người đọc báo cáo không biết nên tin số nào.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hằng `CONTRACT` chết trong file ca sau khi LM3 rời đi**
  Người dùng thấy gì: Có một dòng khai báo không còn dùng tới trong file kiểm tra, dễ khiến người đọc sau này tưởng nhầm phần kiểm tra đó vẫn liên quan tới tài liệu hợp đồng, dù thực tế không còn.
  file: `tests/plugins/lan-may-classifier.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Số mutant trong `expected` của E4/E5/E6 lỗi thời sau lượt vá bảng-vế — mâu thuẫn với chính MUTANT-MATRIX**
  Người dùng thấy gì: Mô tả chi tiết và bảng tóm tắt số ca kiểm cho ba phép kiểm khác nhau trong hồ sơ đều ghi số ca không khớp nhau, khiến người đọc báo cáo khó biết phép kiểm đã quét đủ các trường hợp hay chưa.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Bản chép thứ hai đã lỗi thời: số mutant trong văn `expected` của E4/E5/E6 nhỏ hơn ma trận và nhỏ hơn số vế trong code, ngay dưới lời khai «expected cố ý KHÔNG nhắc con số nào»**
  Người dùng thấy gì: Cùng một kiểu lệch số ca kiểm giữa bảng tóm tắt và phần mô tả chi tiết lặp lại ở nhiều phép kiểm trong hồ sơ, làm báo cáo nghiệm thu tự mâu thuẫn về việc test đã phủ đủ trường hợp hay chưa.
  file: `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

⚠ Cụm ngoài vùng phủ: 5/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
