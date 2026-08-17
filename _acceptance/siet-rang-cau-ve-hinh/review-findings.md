# Review Findings: siet-rang-cau-ve-hinh (round 1)

## Trong hợp đồng

- **Assert chuỗi có mặt thay vì ghim đủ thông điệp (hình 3/4): AC-5 chỉ kiểm 'ma tran chua toan phan', không ghim nhãn thiếu**
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh:190`
  severity: low
  detail: E5 trong evals.yaml hứa: bỏ một đột biến nhãn → 'ĐỎ ghim nhãn thiếu'. Răng chỉ `has "$OUTN" "ma tran chua toan phan"`; assert thật của P197 in `... thong diep chua tung do: ['GATE 1: thieu nhan buoc [5] Đính']` nhưng răng không kiểm phần `[5] Đính`. Bản sao suite có thể đỏ ma trận vì BẤT KỲ thông điệp nào chưa từng đỏ (một mutation khác gãy) mà răng vẫn coi là 'đã canh nhãn'. Chỉ cần thêm needle `thieu nhan buoc [5] Đính` để gắn thước vào đúng vật.
  source: measurement
  AC: AC-5

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chân AC-8 (phân biệt diffBase) là assertion âm-tính-một-mình: chỉ đọc exit code, không ghim thông điệp, và bị bỏ qua im lặng khi worktree add thất bại**
  Người dùng thấy gì: Phép kiểm tra 'còn phân biệt được phiên bản cũ hay không' trong báo cáo nghiệm thu có thể bị lặng lẽ bỏ qua nếu bước dựng môi trường tạm thất bại — khi đó báo cáo vẫn hiện đạt dù phần này chưa thực sự chạy.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Dùng git worktree (mutate .git) thay vì mẫu tar-copy sang tmp như các rang.sh khác; bản sao suite ghi vào tests/plugins/ ngoài trap dọn**
  Người dùng thấy gì: Nếu quá trình kiểm tra bị ngắt giữa chừng, có thể để sót file tạm trong thư mục dự án hoặc để lại cấu hình chưa dọn, thay vì tự động dọn sạch.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: low
  Đề xuất: known-limits

- **AC-8 diffBase check silently skips when `git worktree add` fails, and accepts ANY nonzero exit as 'discrimination'**
  Người dùng thấy gì: Phép kiểm tra 'còn phân biệt được phiên bản cũ hay không' có thể bị bỏ qua âm thầm khi môi trường tạm dựng thất bại, và có thể báo đạt vì một lý do lỗi khác chứ không phải vì đúng điều cần kiểm.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **ONLY_BLOCK=P197 also matches P198 (title contains 'P90/P197'), coupling the two blocks in both rang scripts**
  Người dùng thấy gì: Khi chọn chạy riêng một nhóm kiểm tra theo tên, hệ thống có thể vô tình chạy kèm một nhóm khác có tên gần giống, khiến kết quả lỗi dễ bị hiểu nhầm là của nhóm đang chọn.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **clause_copies_ok stays green when one whole copy is deleted; blind spot not listed in the docstring or Known limits**
  Người dùng thấy gì: Tài liệu đi kèm công cụ kiểm tra tự nhận chỉ còn đúng một lỗ hổng, nhưng thực tế còn một trường hợp xoá nội dung khác cũng không bị phát hiện — người đọc tài liệu để quyết định có thể tin nhầm là đã kín kẽ.
  file: `tests/plugins/hfl_clause.py`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): chặn diffBase AC-8 không ghim thông điệp và im lặng khi bước dựng thất bại**
  Người dùng thấy gì: Phép kiểm tra 'còn phân biệt được phiên bản cũ hay không' trong báo cáo nghiệm thu có thể bị bỏ qua lặng lẽ khi bước dựng môi trường tạm thất bại, khiến báo cáo hiện đạt dù chưa thực sự kiểm tra được.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Số đếm ma trận khai tay, không rút từ phép đo (hình 5): NKC=4 là hằng, không đếm từ struct()**
  Người dùng thấy gì: Một con số thống kê trong báo cáo kiểm tra được đặt cố định sẵn thay vì đếm thực tế, nên nếu sau này có thêm hay bớt phần kiểm tra, con số hiển thị sẽ không tự cập nhật và có thể gây hiểu nhầm về mức độ kiểm đã bao phủ.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
