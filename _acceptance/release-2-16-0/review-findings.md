# Review Findings: release-2-16-0 (round 2)

## Trong hợp đồng

### Chân viec-va tự viết LẠI bộ đọc config + bộ khớp glob, trong khi kho đã có một-nguồn `configList` và răng chị em nhập nó bằng createRequire

- file:line: `_acceptance/release-2-16-0/rang-cua-so.mjs:132`
- severity: medium
- source: conventions
- AC: AC-8

Nhát sửa bỏ mảng tiền tố gõ tay là đúng hướng, nhưng nó chỉ bỏ bản chép DANH SÁCH; bản chép KHUÔN vẫn còn: dòng 132-147 tự regex ra `t1_skip_globs` và tự dịch glob sang RegExp. Kho đã có đúng một nguồn cho cả hai việc — `lib/workspace-record.cjs` xuất `configList(cfgTxt, key)` (header của chính nó ghi rõ vì sao regex quét cả file sai HAI chiều), và `scripts/pre-merge-check.sh` gọi nó qua node (`config_list`, dòng ~288) rồi khớp bằng `match_globs`/`glob_variants`. Răng chị em `_acceptance/release-2-16-0/rang-ghim-lai.mjs` đã làm đúng: `createRequire` để hỏi `DA_THONG_CONG_2`, kèm câu «một bản chép mảng trạng thái là một khuôn sẽ trôi». Bản mới ở đây lại dán chính câu ấy vào comment trong khi vẫn chép khuôn, và hợp đồng AC-8 + expected của E8 khai là «cùng vị từ lưới trước-merge dùng» — lời khai đó không đúng.

Hai chiều trôi, thử thật (node, so `lib.configList` với khối regex y hệt dòng 133-143):
  - khoá mang comment đuôi `t1_skip_globs:   # ghi chu` → canon đọc 5 mẫu, bản răng trả `null` → stop(2). Đây đúng hình dạng đã từng là bug thật (bug round 16 product-map-uat-session, ghi ở workspace-record.cjs:195-198).
  - mục mang comment đuôi `- "README.md"   # ban do` → canon đọc 6 mẫu, bản răng đọc 1 rồi `break` (regex `"?([^"\n]+?)"?\s*$` không nuốt comment) — danh sách bị CẮT IM LẶNG. Với ≥5 mẫu còn sót thì sàn `t1.length < 5` (dòng 145) không nổ, và các mẫu bị rụng hoá «engine» → mã 6 gọi tên tệp văn. Chính file này, dòng 76-79, đã viết rằng «Sàn ‹không dưới năm tệp› MỘT MÌNH là fail-open» cho chân vendored rồi lại dùng đúng sàn ấy một mình ở chân mới.

Thêm: bộ dịch glob dòng 146 cho `*` KHÔNG băng qua `/` (`[^/]*`), trong khi `case` của bash thì có, và nó không có phép nở `**/` mà `glob_variants` dựng (nên `**/x` sẽ không khớp `x` ở gốc). Danh sách hiện tại không có mẫu nào rơi vào hai chỗ lệch này nên chưa đổi màu hôm nay — đó đúng là định nghĩa của một khuôn đang chờ trôi. Nhát chữa: `createRequire` → `configList(readFileSync(config), 't1_skip_globs')`, và nếu cần khớp thì mượn cùng vị từ thay vì dịch lại.

### AC-5: trên nhánh làn-đỏ, răng chiến dịch không ràng buộc run_id lẫn sha vào bất kỳ vật nào — PASS là hằng đúng

- file:line: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:133`
- severity: high
- source: bugs
- AC: AC-5

Khối khai hiện tại là exit: 1 với danh sách RỖNG. Đi theo mã: (a) cuoiLaRun = [] nên so với khai = [] luôn bằng; (c) nhánh exitKhai !== 0 chỉ đòi mangRun rỗng; (b) vòng lặp chạy trên mảng rỗng. Kết quả: shaKhai chỉ được kiểm «có tồn tại trong kho», còn runKhai KHÔNG được đối chiếu với bất kỳ vật nào. Đã thử thật trên cây này (đã khôi phục contract.md, git diff sạch): đổi dòng run_id thành «repin-KHONG-BAO-GIO-CHAY-00000» → vẫn PASS, rc=0; đổi sha 26bf12fe... thành sha của HEAD (7740187f) → vẫn PASS, rc=0. Và feature-loop/scripts/repin-lane.mjs dòng 362 khai rõ «LÀN ĐỎ — không ghi gì», nên với làn đỏ KHÔNG có tệp nào trong kho mang run_id ấy: không có vật nào để đối chiếu, kể cả về nguyên tắc. Hệ quả: răng không phân biệt được «chiến dịch đã chạy và đỏ» với «chiến dịch chưa ai chạy, run_id bịa ra» — đúng lớp hằng-đúng mà chính header của tệp (dòng 20–30) và AC-5 của hợp đồng tuyên là đã giết bằng vế (c). Ba số ở Notes §4 (14/72, 60 eval đỏ, 0 hồ sơ ghim) hiện chỉ có chữ đỡ, không có thước. Đường vá rẻ nhất: làn đỏ vẫn phải ghi một vật (dòng kind:repin-fail hoặc một tệp run-log của chính hồ sơ mốc) mang run_id + sha + exit, rồi răng đòi vật ấy tồn tại và sha của nó BẰNG sha khai.

### AC-8: tệp engine MỚI chưa git-add vô hình với chân viec-va (git diff không thấy tệp untracked)

- file:line: `_acceptance/release-2-16-0/rang-cua-so.mjs:154`
- severity: medium
- source: bugs
- AC: AC-8

Chân viec-va đo cửa sổ bằng `git diff --name-only <chu-ky>` (dòng 154), tức so commit chữ ký với CÂY LÀM VIỆC nhưng CHỈ trên tệp git-theo-dõi. Tệp mới chưa `git add` không xuất hiện trong đầu ra, nên nó không bao giờ đi qua laEngine. Đã thử thật (đã xoá sau khi thử): tạo lib/zz-untracked-probe.cjs rồi chạy răng → PASS rc=0; `git add` đúng tệp ấy rồi chạy lại → FAIL(6) gọi đúng tên tệp. Vì S4 chạy trên cây làm việc TRƯỚC khi commit, đây đúng là thời điểm một tệp engine mới thường còn untracked — mà «thêm một tệp engine mới» lại là hình dạng phổ biến nhất của việc chạm engine. scripts/pre-merge-check.sh dòng 574–577 khai thẳng giới hạn này cho stale_files («Untracked files are invisible to git diff — CI runs on a committed tree, so that is moot there»), nhưng ở đây lời biện hộ ấy KHÔNG áp dụng: răng chạy trên cây làm việc chứ không trên cây đã commit của CI. Hợp đồng (AC-8) và khối Known limits không khai giới hạn này, trong khi ngưỡng «cửa sổ này là 0 việc chạm engine» đứng trên chính phép đo ấy. Vá: thêm `git ls-files --others --exclude-standard` vào tập tệp được lọc, hoặc khai giới hạn ở Known limits.

### Chân viec-va chép lại BỘ ĐỌC t1_skip_globs thay vì gọi lib/workspace-record.cjs configList — hai bản lệch trên chú thích cuối dòng

- file:line: `_acceptance/release-2-16-0/rang-cua-so.mjs:132`
- severity: medium
- source: bugs
- AC: AC-8

Nhát sửa lượt 1 bỏ mảng tiền tố gõ tay (đúng), nhưng thay bằng một bộ đọc YAML viết riêng tại chỗ (dòng 131–147), trong khi kho đã có MỘT nguồn cho đúng việc ấy — `configList` của lib/workspace-record.cjs, chính là thứ scripts/pre-merge-check.sh dòng 285–293 dùng qua `config_list`. Hai bản đọc lệch nhau thật, đã đo trên chính _acceptance/config.yaml: bản dùng chung trả 14 glob, bản chép trả 14 glob khi config nguyên vẹn — nhưng thêm chú thích cuối dòng vào MỘT mục (ví dụ `    - "README.md"   # ghi chu`) thì bản dùng chung vẫn trả 14, còn bản chép chỉ trả 1 (regex `^\s+-\s*"?([^"\n]+?)"?\s*$` không nuốt được đuôi chú thích nên `break` ngay giữa danh sách). Tương tự, chú thích ở cuối DÒNG KHOÁ (`  t1_skip_globs:  # ...`) làm regex khoá ở dòng 133 trượt và răng dừng mã 2, trong khi configList đọc được (workspace-record.cjs dòng 195 khai đúng hình dạng đó là ca đã từng lệch). Khi cắt cụt mà vẫn còn ≥5 mẫu thì không có mã 2 nào nổ: danh sách t1 ngắn đi làm NHIỀU tệp bị xếp là engine, tức răng đỏ giả về một cửa sổ lành, và đỏ ấy không tự nói ra nguyên nhân. Chính chú thích ngay trên chỗ này («một bản chép danh sách là một khuôn sẽ trôi») nói đúng bệnh, nhưng nhát sửa mới chỉ bỏ chép DANH SÁCH, còn chép BỘ ĐỌC. Vá: gọi thẳng `require(lib/workspace-record.cjs).configList(cfg, 't1_skip_globs')`.

### Hình dạng 4 (assertion âm-tính-một-mình): nhánh làn-ĐỎ của rang-ghim-lai.mjs xanh y hệt với một run_id bịa

- file:line: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:133`
- severity: high
- source: measurement
- AC: AC-5

Khối khai của mốc này là exit khác 0 + danh sách RỖNG. Ở ca ấy toàn bộ phán quyết xanh gồm ba vế, cả ba đều ÂM TÍNH hoặc không gắn vào lượt đang khai: (a) dòng 123-124 cuoiLaRun rỗng == khai rỗng; (c) dòng 133 `exitKhai !== 0 && mangRun.length` — «không hồ sơ nào mang runKhai»; và dòng 92 `git cat-file -e` chỉ chứng sha có trong kho. Vế (b) dòng 136-143 — nơi DUY NHẤT đối chiếu verified_commit với sha khai — KHÔNG chạy vì `khai` rỗng. Đối chứng dương duy nhất (coGhim.length > 0, dòng 119) đến từ 48 dòng kind:repin của các chiến dịch LỊCH SỬ, không ràng gì vào lượt đang khai.

Đã thử thật trên cây này: đổi dòng «run_id: repin-20260918T025435Z-51649» trong contract.md thành «run_id: BIA-KHONG-TON-TAI-999» rồi chạy `node _acceptance/release-2-16-0/rang-ghim-lai.mjs --chan chien-dich` → exit 0, dòng PASS giống hệt bản thật: «PASS: chien-dich lan BIA-KHONG-TON-TAI-999 ma-thoat-lan 1 tai sha 26bf12fe — 0 ho so da ky mang dong ghim lai moi nhat cua luot BANG khoi khai [rong] (doi chung: 72 ho so da ky, 48 ho so co dong ghim lai)». Tức phép đo không phân biệt «làn chạy 2 giờ 25 phút rồi chết mã 1» với «chưa ai chạy làn nào» — đúng cặp mà hiến pháp bắt phân biệt.

Lượt sửa 1 CHỈ đổi chữ trong dòng PASS (exit → ma-thoat-lan, dòng 145-151); không vế đo nào được thêm, nên lỗ mà lượt chấm 1 gọi tên vẫn nguyên. Header của chính răng (dòng 15-17: «run_id — mã lượt làn tự đúc; đây là vật nói đã-chạy, thay cho lời khai») và AC-5 «kết quả THẬT, đếm được» vì thế chỉ đúng cho nhánh exit 0 — nhánh mà mốc này KHÔNG đi.

### Hình dạng 4 (kết luận âm tính không có đối chứng ràng vào vật): «0 tệp engine» của chân viec-va lật thành xanh khi nới t1_skip_globs — chính tệp mà bộ lọc tự loại trừ

- file:line: `_acceptance/release-2-16-0/rang-cua-so.mjs:152`
- severity: high
- source: measurement
- AC: AC-8

Chân viec-va kết luận từ việc tập `pham` (dòng 158) RỖNG. Đối chứng dương duy nhất là dòng 152 — «cửa sổ neo..chữ-ký phải có tệp engine» — nhưng nó đo một cửa sổ KHÁC (89fbc87b..b9f8766e, lịch sử) chứ không ràng bộ lọc vào cửa sổ mà kết luận nói tới, và nó không nhạy với việc định nghĩa «engine» bị thu hẹp.

Nguồn định nghĩa engine là `risk_tiers.t1_skip_globs` trong `_acceptance/config.yaml` (dòng 131-147), mà `laEngine` (dòng 147) lại loại trừ cứng mọi thứ dưới `_acceptance/` — nên chính tệp điều khiển phép đo nằm NGOÀI phép đo, và nó ĐÃ đổi trong đúng cửa sổ đang soi (bảy khoá executors 2_16 thêm ở lượt này).

Đã thử thật trên cây này, hai bước:
1. Xoá dòng khai `feature-loop/.claude-plugin/plugin.json` khỏi khối VIEC-VA-SAU-CHU-KY → FAIL(6), gọi đúng tệp. Chiều đỏ sống.
2. Giữ nguyên bước 1, thêm một dòng `- "feature-loop/**"` vào t1_skip_globs của `_acceptance/config.yaml` → exit 0, «PASS: viec-va 0 tep engine doi sau chu ky b9f8766e ngoai 1 tep cua chinh moc (doi chung: cua so 89fbc87b..b9f8766e co 21 tep engine; cua so sau chu ky co 25 tep doi)». Đối chứng dương chỉ tụt 30 → 21, vẫn > 0, nên nó không bắt được.

Đây đúng hình dạng fail-open mà chính tệp này vừa vá cho chân `vendored` (dòng 76-85: so DANH SÁCH ở cả hai đầu cửa sổ vì «sàn năm tệp MỘT MÌNH là fail-open»); chân viec-va không có vế tương ứng — không so danh sách mẫu t1 ở neo với ở cây, không có đối chứng nào chứng minh bộ lọc còn thấy đúng lớp tệp trong cửa sổ sau chữ ký. Hệ quả: câu «không việc nào chạm engine», risk_tier T2 và ngưỡng «cửa sổ này là 0» của Known limits đứng trên một kết luận rỗng mà một dòng trong tệp không-bị-soi lật được.

### Hình dạng 2 (bản chép khuôn thay vì một-nguồn round-trip): chân viec-va tự viết lại reader + matcher của t1_skip_globs trong khi kit đã có configList

- file:line: `_acceptance/release-2-16-0/rang-cua-so.mjs:131`
- severity: medium
- source: measurement
- AC: AC-8

Hợp đồng (AC-8) và expected của E8 đều khai: «Engine hỏi ĐÚNG MỘT NGUỒN của kho, không chép tay: vị từ của lưới trước-merge», «rút từ MỘT nguồn của kho — risk_tiers.t1_skip_globs, cùng vị từ lưới trước-merge dùng». Code không làm thế: dòng 131-145 là một parser YAML gõ tay, dòng 146 là một bộ chuyển glob→regex gõ tay.

Kit đã có nguồn thật: `configList` export từ `lib/workspace-record.cjs` (dòng 193), và `scripts/pre-merge-check.sh` dòng 285-293 gọi đúng nó qua `config_list`. Răng chị em `rang-ghim-lai.mjs` dòng 63-70 làm ĐÚNG luật ấy — nó `require_` chính `lib/workspace-record.cjs` để lấy DA_THONG_CONG_2 và tự ghi «một bản chép mảng trạng thái là một khuôn sẽ trôi». Chân viec-va không round-trip với reader thật nào.

Hai khuôn lệch đã thấy trong code, dù hôm nay chưa lộ vì danh sách hiện tại không có hình dạng kích hoạt:
- Reader: configList dùng `^\s{2}key:\s*(#.*)?$` (cho phép chú thích đuôi, bỏ qua dòng lạ giữa danh sách bằng `continue`); bản chép dùng `^\s*t1_skip_globs:\s*$` (chú thích đuôi → trả null → mã 2) và `break` ở dòng lạ đầu tiên (cắt cụt danh sách âm thầm).
- Matcher: pre-merge khớp bằng `case` của shell (nơi `*` nuốt cả `/`) cộng `glob_variants` cho `**/`; bản chép dịch `*` thành `[^/]*` và không có biến thể `**/`. Một glob kiểu `scripts/*.sh` hay `docs/**/*.md` thêm vào config sẽ cho hai bên hai kết luận trái nhau, mà bên nào sai thì không phép đo nào phát hiện.

Đã kiểm: trên config hôm nay hai bản đọc trả danh sách BẰNG nhau (14 mẫu) — tức khuôn chưa trôi, chưa phải lỗi đang nổ; nhưng lời khai «MỘT nguồn» trong AC-8 và E8 hiện không đúng với vật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Nhánh «commit gốc, không có cha» của rang-so-tang.sh KHÔNG BAO GIỜ chạy — `git rev-parse <sha>^` in lại chính chuỗi ra stdout**
    Người dùng thấy gì: Với một kho mã nguồn chỉ có đúng một commit duy nhất (chưa có lịch sử trước đó), công cụ cắt số phiên bản có thể báo sai lý do lỗi thay vì chỉ đúng bước còn thiếu — nhưng tình huống này không xảy ra với các kho đang dùng kit hiện nay.
    file: `_acceptance/release-2-16-0/rang-so-tang.sh`
    severity: medium
    Đề xuất: known-limits

- **Nhát sửa «exit <n>» chỉ vá đúng dòng bị nêu tên; cùng hình dạng còn sống ở dòng FAIL(6) của chính file**
    Người dùng thấy gì: Ở nhánh chiến dịch ghim lại bị lỗi, một dòng thông báo nội bộ còn dùng chữ chưa nhất quán với các dòng khác trong cùng công cụ, có thể gây khó đọc log nhưng không làm sai kết quả hay ảnh hưởng quyết định của cổng.
    file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
    severity: medium
    Đề xuất: known-limits

- **Neo của rang-so-tang.sh vẫn buộc vào THỨ TỰ COMMIT: lời khai «mang số CŨ ở cả hai thứ tự» sai, và răng đỏ mã 3 khai sai về vật**
    Người dùng thấy gì: Nếu một lần phát hành sau này tách bước tăng số phiên bản và bước ghi hồ sơ mốc thành hai commit riêng biệt (khác cách làm của mốc này), công cụ kiểm tra số phiên bản có thể báo sai kết quả dù số đã tăng đúng — nhóm đã ghi nhận và xếp lịch xử lý ở một vòng riêng.
    file: `_acceptance/release-2-16-0/rang-so-tang.sh`
    severity: medium
    Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).