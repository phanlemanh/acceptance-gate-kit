# Review findings: phan-du-bo-cuc-moi-vong-ba (round 1)

## Trong hợp đồng

- **Chiều đỏ của AC-1 (bản gốc ghim đổi sang HEAD) không có mã nào chạy: biến BANG_TEN_GOC mà E1 hứa không tồn tại**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/evals.yaml:18`
  severity: high
  AC: AC-1
  source: conventions
  detail: AC-1 đòi chiều đỏ «đổi bản gốc ghim sang HEAD trên bản sao → ô khac-ten đỏ». E1 ghi chiều đỏ đi qua biến môi trường BANG_TEN_GOC=HEAD của chính tệp. Thực tế tests/scripts/bang-ten-lo-trinh.test.mjs không đọc biến môi trường nào: dòng 36 là hằng MOC_MA_TRAN, dòng 67 rev-parse thẳng hằng ấy. Grep BANG_TEN_GOC chỉ ra evals.yaml và s4-args.json. giu-khoa-3.mjs không có ca nào thay bản gốc; TU_PHA chỉ phá hai-bo-cuc.test.mjs; SAU-GOP-DO đo chiều đỏ khác (GOC_VONG sau gộp). Lời hứa đỏ của E1 là chữ không gắn vào vật, đúng lớp «thước phải gắn vào vật được giao».

- **Chiều đỏ AC-1/E1 hứa BANG_TEN_GOC=HEAD nhưng không mã nào hiện thực (cùng lỗi, góc nhìn bugs)**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/evals.yaml:17`
  severity: medium
  AC: AC-1
  source: bugs
  detail: Không tệp nào trong kho đọc BANG_TEN_GOC; MOC_MA_TRAN cứng ở dòng 37, dùng thẳng ở dòng 69. Ca K4-MP trong CA_CANH thử việc khác (đổi haiCay, không đổi bản gốc ghim). Nếu mốc ghim trôi về HEAD hay merge-base thì không phép đo nào đỏ, và người thẩm định đọc E1 không có đầu ra nào cho vế này.

- **Hình dạng 1 — Đo CHỈ DẪN thay vì ĐẦU RA: chiều đỏ của E1/AC-1 khai một khoá môi trường mà không mã nào đọc**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/evals.yaml:17`
  severity: high
  AC: AC-1
  source: measurement
  detail: git grep BANG_TEN_GOC HEAD chỉ ra đúng chính evals.yaml. bang-ten-lo-trinh.test.mjs ghim cứng MOC_MA_TRAN (dòng 37) và không đọc biến môi trường. Không chế độ nào của giu-khoa-3.mjs (TU_PHA, CA_CANH, SAU-GOP-DO) đổi mốc ghim sang HEAD. SAU-GOP-DO đo bản ở GOC_VONG, nên không chứng được độ nhạy của chính MOC_MA_TRAN.

- **E6 hứa dòng «PASS: CHONG-RONG <n> pathspec…» nhưng giu-khoa-3 --moi không bao giờ in dòng đó**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/evals.yaml:76`
  severity: medium
  AC: AC-6
  source: conventions
  detail: AC-6 đòi mọi git archive / git show một commit lịch sử của K4-TB đi qua pathspec của bộ dịch (chốt chống rỗng). cheDoMoi chỉ in MOI <cụm>, MOI túi và TIN, không có nhánh nào in CHONG-RONG. Chốt có thật trong pathspec() (ném lỗi khi rỗng) nhưng vế «mọi lệnh đều đi qua pathspec» không phép đo nào đếm; ví dụ dai-tom-tat-dem-dung.test.mjs dòng ~263 chạy `git show ${ref}:tests/...` không qua pathspec.

- **E6 expects a 'PASS: CHONG-RONG …' line that giu-khoa-3 --moi never prints; AC-6's empty-pathspec guard is not measured**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:307`
  severity: medium
  AC: AC-6
  source: bugs
  detail: cheDoMoi, hàm duy nhất pd3_moi_tb chạy, không in hay đếm CHONG-RONG; grep chỉ thấy chuỗi ở evals.yaml và s4-args.json. Vế pathspec của AC-6 hiện đúng chỉ vì K4-TB được sửa tay; một `git archive <ref> scripts lib` không qua pathspec thêm sau sẽ không làm phép đo đỏ.

- **Ô «kho mới» của AC-3 phải chạy trên bản sao có lịch sử thật, nhưng hai-bo-cuc.test.mjs dựng một kho tổng hợp sáu commit**
  file: `tests/scripts/hai-bo-cuc.test.mjs:45`
  severity: medium
  AC: AC-3
  source: conventions
  detail: AC-3 đòi «commit CON của HEAD trong bản sao có lịch sử thật» với sha bằng HEAD của bản sao; E3 hứa «ghim sha(cha commit dọn nhà) = HEAD của bản sao». Tệp kiểm `git init` kho mới, chép tập con tệp (dòng 36–43) rồi tạo c1…c6; ô «HC kho mới» so refPhang với c1 của kho tổng hợp. Lịch sử thật có hình dạng cần chạm: plugins/acceptance-gate/.claude-plugin/plugin.json được THÊM ở be4eb1d6 rồi xoá ở 8213eaa5, cả hai là tổ tiên của HEAD, nên `git log --diff-filter=A -1` của chaDonNha chưa từng được đo trên lịch sử thật. Phải sửa ô, hoặc hợp đồng ghi thu hẹp có tên.

- **The AC-3 cell 'new store on a copy with real history, sha = HEAD of the copy' is only exercised on a synthetic repo**
  file: `tests/scripts/hai-bo-cuc.test.mjs:1316`
  severity: low
  AC: AC-3
  source: bugs
  detail: HC kho mới chạy trên kho tổng hợp F sáu commit, kiểm `refPhang === C.c1` (sha của F, không phải HEAD của bản sao kit). Ca chaDonNha trên lịch sử gộp thật không bao giờ chạy. Đối chứng dương «dungKhoMoi(bản bung) = kho mới» luôn đúng theo cấu tạo vì c2 dựng bằng chính dungKhoMoi(T1).

- **Hình dạng 3 — Chỉ kiểm chuỗi có mặt trong khi lời hứa là QUAN HỆ nhân quả: ở --chieu-do, ca canh K4-MP đỏ vì bộ dịch đồng nhất, không phải vì haiCay bị thay**
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:407`
  severity: medium
  AC: AC-9
  source: measurement
  detail: AC-9 hứa «haiCay thay bằng bản luôn bung cây đang chạy làm K4-MP đỏ «source lạ»». cheDoChieuDo (dòng 407–409) thay CẢ tests/bo-cuc.mjs (bằng banDongNhat(), trả boCuc() = { phang: true } vô điều kiện) lẫn hai-bo-cuc.mjs trong cùng commit. Ca canh bang-ten-lo-trinh.test.mjs rẽ nhánh theo boCuc({ thuMuc: KIT }).phang ở dòng 72; với bộ dịch đồng nhất nhánh này luôn đúng, không gọi haiCay. Phép đo chỉ kiểm hai mảnh chữ (dòng 413–417); gỡ phần thay haiCay thì vẫn PASS. Vế «haiCay thay thế → K4-MP đỏ» không được đo; muốn đo phải chạy riêng một lượt chỉ thay haiCay, giữ bộ dịch thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **DD-6 tạo thư mục tạm dd6- bên ngoài TMP của tệp và không dọn**
  Người dùng thấy gì: Mỗi lần chạy bộ kiểm ở bố cục mới để lại một thư mục tạm nhỏ trong máy; không ảnh hưởng kết quả hay sản phẩm.
  Căn cứ: Hậu quả rất nhẹ, chỉ tốn chút dung lượng tạm, hệ điều hành tự dọn dần, sửa cũng không đem lại gì cho người dùng.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **RA-LOP only checks one direction (merge-base set ⊆ table), but the header claims equality**
  Người dùng thấy gì: Bảng phân loại có thể còn giữ dòng của tệp không còn dùng, và bộ kiểm không báo; số liệu nhóm có thể hơi lệch.
  Căn cứ: Chỉ làm bảng thống kê thừa dòng, không làm sai kết quả của sản phẩm, và người sửa bảng tay dễ phát hiện và gỡ sau.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — Đo CHỈ DẪN thay vì ĐẦU RA: ca tự phá CU-DO tự dựng một phép so riêng, không đi qua phép so mà --cu dùng, và nhắm đúng tệp mà phép so thật không thể đỏ**
  Người dùng thấy gì: Ca tự kiểm cho phép đo ở bố cục cũ có thể vẫn xanh dù phép đo thật hỏng, nên một lỗi mất ca kiểm ở tệp mới có thể lọt không bị báo.
  Căn cứ: Chỉ ảnh hưởng độ tin của bộ kiểm nội bộ chứ không chạm sản phẩm người dùng, và lỗi này bị lộ khi có người đọc kết quả đo; nên ghi giới hạn đã biết.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: high
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
