## Trong hợp đồng

- **Chiều đỏ của AC-7 không đo được: câu chan-doan bị đổi trong worktree trôi không bao giờ hiện ở đầu ra mà TC1-06 so**
  AC: AC-7
  file: `tests/dieu-phoi/trao-vai.test.mjs:173`
  severity: medium
  source: conventions
  detail: worktreeTroi() đổi câu 'gọi với --phien để kiểm hook của phiên này' (chan-doan.mjs:87). Câu này chỉ được phát ra khi `!phien`. Nhưng dauRaDocCu (danh-thuc-ma-phien.test.mjs) lại gọi `chan-doan --json --chi-tiet --phien c-gs`, nên câu ấy không bao giờ nằm trong đầu ra «chan-doan» mà TC1-06 so. Hệ quả: dù TC1-06 có đọc lại cây làm việc thì vẫn khớp 8/8, tức chiều đỏ mà contract AC-7 và E7 khai («bản sao dùng cây làm việc → lệch ở đầu ra «chan-doan»») không dựng được trên fixture này. TC1b-07 lách bằng cách đọc nội dung tệp trong gói (`includes('(đổi trên cây làm việc)')`) chứ không chạy phép so của TC1-06. Vì vậy câu «phép so vẫn khớp 8/8 trên cây trôi» chưa từng được đo, và expected của E7 mô tả một kết quả mà ca không sinh ra. Ca này rơi đúng vào lớp «thước không gắn vào vật» (chiều nhạy). Cách sửa: đổi một câu `viec` thật sự có trong đầu ra khi gọi với `--phien`, rồi chạy dauRaDocCu trên gói lấy từ goiTai lành và goiTai đã tiêm.
  rationale: AC-7 khai chiều đỏ «bản sao dùng cây làm việc → lệch ở đầu ra chan-doan»; finding nói chiều đó không dựng được trên fixture, tức AC-7 không được chứng minh.

- **Ca TC1b ghim sha nhánh mà không có lối bỏ qua có tên: sha vắng thì ca ném lỗi hoặc đỏ, trái với AC-5/AC-7**
  AC: AC-5
  file: `tests/dieu-phoi/trao-vai.test.mjs:156`
  severity: medium
  source: conventions
  detail: SHA_TC1_CHAM (e208665f) và SHA_TC1_DINH (8df32d1c) hiện KHÔNG phải tổ tiên của origin/main. Chúng chỉ nằm trên nhánh vong/danh-thuc-doc-nhip-dung-ma (PR #419 còn mở), và repo vẫn bật rebase-merge (allow_rebase_merge=true). Contract AC-5/AC-7 hứa rằng khi sha vắng thì ca «BỎ QUA có tên, không xanh câm, không đỏ», và TC1-06/TC1-09 đã làm đúng điều đó (`t.skip`). Ba ca mới thì không có nhánh này: TC1b-04 gọi `git show ${SHA_TC1_DINH}:…` qua execFileSync nên ném lỗi; TC1b-05 khong-doc-cay so `kq.ds` mà không kiểm `kq.boQua`, nên deepEqual(undefined, …) đỏ; TC1b-07 có `goiTai` trả null rồi `path.dirname(null)` ném TypeError. Nếu #419 hoặc vòng này được gộp kiểu rebase (hay chạy trên clone nông), suite tests/dieu-phoi đỏ giả, đúng loại lỗi sau-gộp mà hồ sơ này sinh ra để dập.
  rationale: AC-5 và AC-7 đều hứa sha chấm vắng thì bỏ qua có tên, không đỏ; các ca mới ném lỗi hoặc đỏ khi sha vắng.

- **TC1b-07: phần trôi cây làm việc không hiện ra ở đầu ra mà TC1-06 so, nên chiều đỏ của AC-7 chưa được chứng minh**
  AC: AC-7
  file: `tests/dieu-phoi/trao-vai.test.mjs:172`
  severity: medium
  source: bugs
  detail: `worktreeTroi()` đổi câu `'gọi với --phien để kiểm hook của phiên này'` trong chan-doan.mjs. Câu này chỉ được in khi `!phien` (chan-doan.mjs:87). Trong khi đó `dauRaDocCu` (danh-thuc-ma-phien.test.mjs, khoảng dòng 361) luôn gọi `chan-doan --json --chi-tiet --phien CLI_ID`, nên câu bị đổi không bao giờ có trong đầu ra «chan-doan» mà TC1-06 so. Hệ quả: một TC1-06 đọc cây làm việc vẫn khớp 8/8 trên worktree trôi này, tức chiều đỏ «bản sao dùng cây làm việc → lệch ở đầu ra chan-doan» mà AC-7/E7 khai không thể xảy ra với phần trôi đã chọn. Bản thân TC1b-07 cũng không chạy phép so `dauRaDocCu`. Ca chỉ kiểm chuỗi có hay không trong tệp chan-doan.mjs được rút ra (`goiTai` lấy archive hay chép cây). Như vậy ca chứng minh `goiTai` không đọc cây làm việc, nhưng không chứng minh mệnh đề «TC1-06 im trên cây trôi, đỏ khi đọc cây». Thước chưa gắn vào vật mà nó tự xưng đo. Cách sửa: đổi một câu thật sự có trong đầu ra `chan-doan --phien <CLI>`, rồi chạy phép so (hoặc `dauRaDocCu`) trên cả hai bản gói.
  rationale: Cùng gốc với finding đầu của AC-7: chiều đỏ AC-7 («lệch ở đầu ra chan-doan») không xảy ra với phần trôi đã chọn.

- **TC1b-05 đổi sổ TC1 trong worktree nhưng không assertion nào đọc sổ đó**
  AC: AC-5
  file: `tests/dieu-phoi/trao-vai.test.mjs:170`
  severity: low
  source: bugs
  detail: `worktreeTroi()` nối thêm `{"type":"fix","ca_doi_than":["X"]}` vào `_acceptance/danh-thuc-doc-nhip-dung-ma/decisions.jsonl` của worktree. Tuy vậy TC1b-05 chỉ gọi `caDoiThanLichSu(w, …)` và so với một mảng viết cứng, không gọi `caKhaiTrongSo(docTai(w, SHA_TC1_CHAM, SO_TC1))`. TC1-09 thì đọc sổ qua `docTai(KIT, …)`, không qua worktree. Vì vậy vế «khớp khoá ca_doi_than của sổ TC1 đọc tại sha chấm, kể cả khi sổ trên cây bị đổi» của AC-5/E5 không được đo. Bước đổi sổ là bước chết: nếu ai đó sửa TC1-09 thành đọc sổ trên cây làm việc thì không ca nào đỏ.
  rationale: AC-5 nêu rõ sổ TC1 bị đổi và tập phải khớp khoá ca_doi_than của sổ tại sha chấm; không assertion nào đo vế này.

- **Hình dạng 1 (đo nguồn thay vì đầu ra) ở TC1b-07: ca soi chữ trong tệp, không chạy phép so, và câu bị tiêm không bao giờ lọt vào đầu ra được so**
  AC: AC-7
  file: `tests/dieu-phoi/trao-vai.test.mjs:668`
  severity: medium
  source: measurement
  detail: AC-7 và E7 hứa: với cây làm việc đã trôi, «phép so vẫn khớp 8/8», còn bản sao dùng cây làm việc thì «lệch ở đầu ra chan-doan». TC1b-07 không chạy dauRaDocCu hay lechNhau lần nào. Nó chỉ assert chữ trong mã nguồn của gói: `!fs.readFileSync(path.join(g,'scripts','chan-doan.mjs')).includes('(đổi trên cây làm việc)')`, và ở chiều đỏ là `.includes(...)` trên g2. Câu bị tiêm trong worktreeTroi (dòng 646) thay `'gọi với --phien để kiểm hook của phiên này'`. Câu đó nằm ở chan-doan.mjs:87 dưới nhánh `if (!phien) them('hook-phien','khong-ap',…)`. Thế nhưng dauRaDocCu (danh-thuc-ma-phien.test.mjs) luôn gọi `chan-doan --json --chi-tiet --phien CLI_ID`, nên nhánh này không bao giờ chạy trong phép so. Nếu thật sự chạy phép so trên gói chép từ cây làm việc thì đầu ra «chan-doan» vẫn khớp, tức chiều đỏ mà E7 khai không xảy ra. Thứ ca đang đo là văn bản tệp (chỉ dẫn), không phải đầu ra của đường đọc-cũ mà AC hứa.
  rationale: AC-7 hứa phép so TC1-06 khớp 8/8 trên cây trôi và lệch khi đọc cây; ca chỉ soi chữ trong tệp nên không đo được điều đó.

- **Hình dạng 3 (assert hằng thay cho QUAN HỆ) ở TC1b-05: sổ TC1 bị tiêm trên cây trôi nhưng không assert nào đọc sổ, nên lời hứa «tập BẰNG sổ đọc tại sha chấm» không có chiều đỏ**
  AC: AC-5
  file: `tests/dieu-phoi/trao-vai.test.mjs:645`
  severity: low
  source: measurement
  detail: AC-5 hứa một quan hệ: dù cây làm việc trôi, tập ca đổi thân vẫn BẰNG khoá `ca_doi_than` của sổ TC1 đọc tại sha chấm, không đọc cây làm việc. worktreeTroi có ghi thêm `{"type":"fix","ca_doi_than":["X"]}` vào `_acceptance/danh-thuc-doc-nhip-dung-ma/decisions.jsonl` của worktree. Nhưng TC1b-05 chỉ so `kq.ds` với một danh sách viết tay `['(đầu tiep-tuc.test.mjs)','DP3-09 ma-tran']`. caDoiThanLichSu thì không đọc sổ. Bộ đọc sổ thật nằm ở TC1-09 (`caKhaiTrongSo(docTai(KIT, SHA_TC1_CHAM, SO_TC1))`) và chỉ chạy trên KIT, không chạy trên cây trôi. Vì vậy bước tiêm vào sổ là bước tiêm chết. Một mutant đổi TC1-09 sang đọc sổ từ cây làm việc (fs.readFileSync) sẽ không làm ca nào đỏ, dù E5 khai rằng ca này phủ cả việc «đổi … sổ TC1».
  rationale: AC-5 hứa quan hệ tập BẰNG khoá sổ đọc tại sha chấm; ca chỉ so với danh sách viết tay nên quan hệ đó không được đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
