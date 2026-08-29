## Trong hợp đồng

- **AC-6 đòi script ghi lại NGUỒN giải tên nhánh, nhưng mainBranchInfo là mã chết — không ai ghi, không ai đo**
  file: `feature-loop/scripts/s4-args.mjs:236`
  severity: high
  AC: AC-6
  AC-6 trong contract.md khai hai vế, vế thứ hai: «và script ghi lại NGUỒN giải được tên nhánh (`remote` hay `fallback`) để phép đo phân biệt được hai đường — hai đường cho cùng kết quả trên repo tên `main` nên không có trường này thì không đo được». Dòng P0 thứ hai của gap-probe.md cũng đóng lại bằng «fixed: … mã ghi `mainBranchSource` (remote/fallback)».

  Thực tế trong mã:
      const mainBranchInfo = { branch: mainBranch, source: mainBranchSource };
  không xuất hiện thêm ở bất cứ đâu. `grep -n mainBranchInfo feature-loop/scripts/s4-args.mjs` chỉ trả về đúng dòng 236 này. Object `args` (dòng ~310) KHÔNG có trường nào mang nó, và cũng không có console.error nào in ra. `mainBranchSource` được gán ('remote'/'fallback'/'none') rồi chết theo. Node không cảnh báo const không dùng, nên vế này lọt trọn.

  Và phép đo không bắt được vì chính nó cũng không đo vật: chân `remote-tra-loi` (rang.sh:144-151) «phân biệt NGUỒN» bằng cách TỰ chạy lại `git remote show origin` trên fixture rồi so kết quả với 'phat-trien'. Đó là đo FIXTURE, không đo ĐẦU RA của s4-args.mjs — đúng hình dạng (1) trong bất biến CLAUDE.md «Thước phải gắn vào vật được giao» (đo chỉ dẫn thay vì đầu ra). Assert đó xanh y hệt nhau dù `mainBranchInfo` có tồn tại hay không.

  Hai lối: (a) đưa nguồn vào args.json (đổi schema artifact → theo bất biến CLAUDE.md phải có nhánh đọc-cũ + cờ vàng cho consumer), hoặc (b) rút vế «script ghi lại NGUỒN» khỏi AC-6 và xoá mã chết. Điều không được giữ là trạng thái hiện tại: hợp đồng hứa một vật, mã có hình dạng của vật đó, và không đường nào nối hai thứ.

  nguồn: conventions

- **mainBranchInfo là biến chết — AC-6 («script ghi lại NGUỒN remote/fallback») chưa được cài, và phép đo E6 không đọc vật**
  file: `feature-loop/scripts/s4-args.mjs:236`
  severity: high
  AC: AC-6
  `const mainBranchInfo = { branch: mainBranch, source: mainBranchSource };` được tính rồi KHÔNG bao giờ dùng lại: không xuất hiện trong object `args` (dòng ~305–327), không ghi ra đâu cả. Chính comment ngay trên nó khai lý do tồn tại — «vật để phép đo phân biệt đường remote với đường dò tên quen (không có nó, hai đường cho cùng kết quả nên không đo được)» — nên đây không phải biến thừa vô hại mà là nửa sau của AC-6 chưa cài.

  AC-6 viết: «script ghi lại NGUỒN giải được tên nhánh (`remote` hay `fallback`) để phép đo phân biệt được hai đường». Chạy thật trên fixture nhánh master không remote, args.json sinh ra có đúng các khoá:

    generated_at, generated_sha, slug, round, riskTier, evals, suiteCommands,
    diffBase, repoRoot, personasPath, templatePath, toolKillRule, contractPath,
    invokedAt, invokedSha, evalsHash, runBaseline

  — không có mainBranch, mainBranchInfo hay mainBranchSource.

  Và E6 vẫn XANH, vì phép đo không gắn vào vật được giao: chân `remote-tra-loi` ở _acceptance/nhanh-chinh-khong-ten-main/rang.sh:143–152, dưới nhãn «phân biệt NGUỒN: fixture này phải là 'remote', fixture không remote là 'fallback'», tự chạy lại `git remote show origin` trong một tiến trình node riêng và so kết quả với chuỗi 'phat-trien'. Nó đo GIT và đo FIXTURE, không đọc args.json, nên nó xanh dù script không hề phát ra trường nguồn. Đây đúng lớp «thước phải gắn vào vật được giao» / «đo chỉ dẫn thay vì đầu ra» của kit.

  Hệ quả vận hành thêm: vì nguồn không được ghi ra, khi remote im lặng (hỏng mạng, tường lửa, hết trần 10 s) và script rơi về đoán một trong bốn tên quen, args.json trông y hệt lượt giải đúng qua remote — diffBase có thể sai mà không dấu vết nào cho người đọc bằng chứng.

  nguồn: bugs

- **Đo FIXTURE thay vì ĐẦU RA — vế «ghi lại nguồn giải tên nhánh» của AC-6 không có phép đo nào chạm (hình dạng 1)**
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:144`
  severity: high
  AC: AC-6
  AC-6 (contract.md:37) hứa HAI vế: (a) giải đúng tên nhánh từ remote, và (b) «script ghi lại NGUỒN giải được tên nhánh (`remote` hay `fallback`) để phép đo phân biệt được hai đường — hai đường cho cùng kết quả trên repo tên `main` nên không có trường này thì không đo được». gap-probe.md:15 khai đã fixed: «mã ghi `mainBranchSource` (remote/fallback)».

  Thực tế trong vật: `feature-loop/scripts/s4-args.mjs:236` dựng `const mainBranchInfo = { branch: mainBranch, source: mainBranchSource };` rồi BỎ ĐÓ. Object `args` (s4-args.mjs:305–327) không có trường `mainBranchInfo` / `mainBranchSource` / `source`. `grep -rn mainBranchInfo` toàn repo chỉ ra đúng một dòng 236 — biến chết, không vào args.json, không ai đọc.

  Phép đo lẽ ra phải bắt được điều đó lại đo chỗ khác. Chân `remote-tra-loi`, khối «phân biệt NGUỒN» (rang.sh:143–152) chạy:

      const out=execFileSync('git',['-C','$REPO','remote','show','origin'],...);
      process.stdout.write(/HEAD branch:\s*(\S+)/.exec(out)[1]);
      ...
      [ "$SRC_R" = "phat-trien" ] && ok "nguồn remote thật sự khai tên ngoài danh sách"

  Đây là phép đo tự chạy lại `git remote show origin` trên FIXTURE và tự bóc bằng chính regex của sản phẩm — nó khẳng định fixture được dựng đúng, KHÔNG hề đọc `$TMP/args.json` để xem sản phẩm có ghi `source: "remote"` không. evals.yaml:79 codify đúng chỗ trệch này: «kiểm fixture thật sự khai tên đó».

  Hệ quả: vế (b) của AC-6 chưa được cài mà cả 6 eval vẫn xanh; và đúng cái lý do AC-6 nêu ra để đòi trường này («hai đường cho cùng kết quả trên repo tên main nên không đo được») vẫn còn nguyên — không phép đo nào phân biệt được đường remote với đường dò tên quen qua đầu ra.

  nguồn: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chiều đỏ của E6 kết luận từ mã thoát trần — báo XANH khi bản tiêm chưa từng được dựng**
  Người dùng thấy gì: Một phần kiểm tra tự động cho tính năng này có thể báo 'đạt' ngay cả khi phần kiểm tra lỗi chưa từng thực sự được chạy, khiến kết quả kiểm thử không phản ánh đúng chất lượng thật của bản vá.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: high
  Đề xuất: new-contract

- **snapshot_tree liệt thư mục bằng tay và nuốt lỗi tar — hỏng bản sao thành vô hình**
  Người dùng thấy gì: Bước dựng bản sao phục vụ kiểm thử có thể âm thầm tạo ra bản sao thiếu hoặc rỗng mà không báo lỗi, khiến một số kết quả kiểm tra dựa trên dữ liệu không đầy đủ mà không ai nhận ra.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Mã chết trong khối SRC_R: một lời gọi node không tính gì**
  Người dùng thấy gì: Có một đoạn thao tác thừa, vô hại trong quy trình kiểm thử làm chậm nhẹ và khó đọc hơn, không ảnh hưởng tới kết quả kiểm tra hay tới tính năng.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Tên nhánh lấy từ remote không được kiểm tồn tại cục bộ — chết ở checkout single-branch/shallow (CI) với đúng thông điệp AC-2 cấm**
  Người dùng thấy gì: Trên một số môi trường build phổ biến (ví dụ máy chủ CI dùng bản sao rút gọn), công cụ chuẩn bị tham số có thể dừng đột ngột với thông báo lỗi kỹ thuật khó hiểu thay vì chỉ rõ cách khắc phục cho người dùng.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ của E6 và E4 kết luận từ «exit ≠ 0» / «rỗng» mà không ghim thông điệp — hạ tầng hỏng cho MÀU XANH**
  Người dùng thấy gì: Một số phép kiểm tự động có thể báo 'đạt' dù phần bị kiểm tra chưa hề chạy đúng cách, làm giảm độ tin cậy của bằng chứng kiểm thử cho tính năng này.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Chiều đỏ của E6 kết luận CHỈ từ exit ≠ 0 — không ghim thông điệp mong đợi (hình dạng 4)**
  Người dùng thấy gì: Một phần kiểm tra tự động cho tính năng này có thể báo 'đạt' ngay cả khi phần kiểm tra lỗi chưa từng thực sự được xác minh đúng nội dung, khiến kết quả kiểm thử không đáng tin cậy hoàn toàn.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 6/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nhanh-chinh-khong-ten-main/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
