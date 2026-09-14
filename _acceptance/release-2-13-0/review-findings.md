## Trong hợp đồng

- **Bản sao của chiều đỏ P93 lọc lại qua .gitignore nên KHÔNG bảo đảm là ảnh của vật — đúng lớp mà commit này sinh ra để giết**
  file: `tests/plugins/run-tests.sh:2222`
  severity: medium
  AC: AC-5
  detail: `dung_ban_sao()` (tests/plugins/run-tests.sh:2183-2221) chép đúng tập `git ls-files` của nguồn — chuẩn — rồi kết bằng:

      subprocess.run(["git", "-C", str(dst), "init", "-q"], check=True)
      subprocess.run(["git", "-C", str(dst), "add", "-A"], check=True)

  Docstring khẳng định «ban sao chep DUNG tap `git ls-files` cua nguon, nen no chua dung thu `scan(src_root)` dem — mot vi tu, hai cho». Vế đó không được gì canh: hai bên dùng HAI vị từ khác nhau.

  - Bên nguồn: `scan()` đọc `git ls-files`, liệt kê tệp ĐANG theo dõi — tracked thắng .gitignore.
  - Bên bản sao: kho `init` mới + `add -A` TÔN TRỌNG `.gitignore` (đã chép sang) và cả `core.excludesFile` toàn cục của máy chạy. Kiểm chứng: repo rỗng với `.gitignore` chứa `foo.md` + `foo.md` trên đĩa → `git add -A` → `git ls-files` chỉ in `.gitignore`, thoát 0, không một dòng cảnh báo.

  Tức một tệp NGUỒN vừa được theo dõi vừa khớp .gitignore sẽ có mặt trên đĩa trong `dst` nhưng biến mất khỏi `scan(dst)` — im lặng, mã thoát 0.

  Hôm nay chưa vỡ: `git ls-files | git check-ignore --stdin --no-index` cho đúng hai tệp — `_acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json` và `_acceptance/vu-trang-goal-luc-goi-ten/s4-args.json` (khớp mẫu `s4-args.json` cuối .gitignore) — và cả hai nằm dưới `_acceptance`, đã ở trong `SKIP_TOP`. Nên P93 hiện xanh và cả hai chân `rang-p93.sh` (`--chan im` → 0, `--chan do` → 0) chạy đúng; tôi đã chạy cả hai.

  Nhưng đây đúng là lớp mà chính commit này viết docstring để giết: «ban sao khong phai la anh cua vat». Thêm một mẫu .gitignore (hoặc một dev/CI có `core.excludesFile` toàn cục) chạm một thư mục nguồn thật là đối chứng dương `assert verdict(dst) == []` tự đi qua trên một tập NHỎ HƠN vật — xanh vì quét thiếu, không vì kho lành. Lưu ý mặt còn lại đã an toàn: ba chỗ tiêm dùng `git add <path>` với `check=True`, nên nếu path bị ignore thì đỏ to, không im.

  Sửa rẻ, giữ nguyên ý «một vị từ»: `git add -A --force` (kèm `-f` cho ba lần add tiêm), hoặc khẳng định thẳng bất biến sau khi dựng — `assert len(scan(dst)) == len(scan(src_root))`, lệch thì nêu tên tệp thiếu.

  Không tự fix theo yêu cầu.

- **dung_ban_sao: `git add -A` tôn trọng .gitignore nên bản sao KHÔNG phải ảnh đúng của scan(src) như docstring khẳng định**
  file: `tests/plugins/run-tests.sh:2214`
  severity: low
  AC: AC-5
  detail: Hàm mới `dung_ban_sao` (tests/plugins/run-tests.sh:2183-2214) chép đúng tập `git ls-files` của nguồn rồi `git init` + `git add -A` trong bản sao, và docstring khẳng định «nó chứa đúng thứ `scan(src_root)` đếm — một vị từ, hai chỗ».

  Vế đó không đúng: `git ls-files` liệt kê cả tệp được force-add dù khớp .gitignore, còn `git add -A` thì BỎ QUA chúng (bản sao mang theo chính .gitignore đã chép). Đo trên cây hiện tại: nguồn có 1701 tệp theo dõi, bản sao dựng lại chỉ còn 1699 — hai tệp rơi im lặng là `_acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json` và `_acceptance/vu-trang-goal-luc-goi-ten/s4-args.json`, khớp dòng cuối `.gitignore` (`s4-args.json`). Không có cảnh báo, không có mã thoát khác 0 — `git add -A` trả 0.

  Tác động HÔM NAY bằng không, và đó là lý do xếp low: cả hai tệp lệch nằm dưới `_acceptance/`, tức trong `SKIP_TOP` nên `scan()` vốn không đếm chúng; và mọi hệ quả của lệch-tập đều rơi vào chiều ĐỎ ồn (đối chứng dương `verdict(dst) == []` sẽ gãy, hoặc `(dst / REF_REL).read_text()` ném FileNotFoundError), chứ không tạo xanh giả. P93 chạy xanh, cả hai chân `rang-p93.sh` xanh — đã xác nhận.

  Nhưng vị từ «một chỗ» là thứ chính bản vá này bán, và nó đang lệch theo một đường không ai thấy: một tệp nguồn force-add dưới `skills/`, `docs/`, `vendor/` sẽ làm hai vế đếm khác nhau mà không ai biết nguyên nhân nằm ở .gitignore. Sửa một chữ: `git add -A -f` (hoặc chạy add dưới `-c core.excludesFile=/dev/null`) để hai tập trùng khít theo đúng lời hứa.

- **Bản sao không tái lập bằng cùng một vị từ với vật — docstring khai «một vị từ, hai chỗ» nhưng chiều đọc là `git ls-files`, chiều dựng là `git add -A`**
  file: `tests/plugins/run-tests.sh:2214`
  severity: low
  AC: AC-5
  detail: `scan()` (2093–2118) định nghĩa vật = tập `git ls-files` của cây nguồn. `dung_ban_sao()` (2183–2214) chép đúng tập ấy, nhưng rồi dựng lại tracked-ness trong bản sao bằng `git init` + `git add -A` (2213–2214) — một vị từ KHÁC, vì `git add -A` tuân `.gitignore` (tệp `.gitignore` là tệp được theo dõi nên vừa được chép sang) và `core.excludesFile` của máy chạy. Docstring 2195 khai ngược lại: «no chua dung thu `scan(src_root)` dem — mot vi tu, hai cho». Cơ chế đang sống trong kho này: `git ls-files | git check-ignore --no-index --stdin` trả 2 tệp vừa-theo-dõi-vừa-bị-ignore (`_acceptance/*/s4-args.json`); hôm nay chúng rơi vào `SKIP_TOP` nên chưa lệch (tôi chạy đối chiếu: src 738 tệp / dst 738 tệp, không lệch tệp nào). Nhưng khi một tệp tracked-and-ignored xuất hiện trong vùng quét, nó biến mất khỏi bản sao trong IM LẶNG: đối chứng dương `assert verdict(dst) == []` (2223) chỉ kiểm «không có lỗi», nên bản sao thu hẹp lại làm nó DỄ xanh hơn chứ không đỏ, và chiều đỏ ở dưới đo trên một vật nhỏ hơn vật thật. Sửa theo tầng: dựng index của bản sao từ chính danh sách đã chép (`git add --force -- <danh sách>`, hoặc `git update-index --add`) rồi KHẲNG ĐỊNH `set(scan(dst)) == set(scan(src))` — thành một vị từ thật, thay vì lời khai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tuyên quét LỚP («cả ba vùng từng bị bỏ lọt») nhưng assert chỉ là «chuỗi có mặt» trên danh sách lỗi GỘP — mất nguyên vùng docs/superpowers/ vẫn XANH**
  Người dùng thấy gì: Bài kiểm tra tự động dùng để đảm bảo không khu vực nào trong kho bị bỏ sót khi rà một loại lỗi tài liệu đã từng xảy ra có một điểm mù: nếu chỉ riêng một khu vực bị bỏ sót trở lại, hệ thống vẫn báo mọi thứ ổn thay vì cảnh báo, vì phép kiểm hiện tại đếm gộp chứ không tách theo từng khu vực.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).