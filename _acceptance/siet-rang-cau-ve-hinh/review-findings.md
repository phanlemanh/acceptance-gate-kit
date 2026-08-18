## Trong hợp đồng

- **AC-8 chân diffBase thiếu đối chứng dương: không ghim P197 base đã CHẠY xanh trước khi tin răng ĐỎ** — AC: AC-8
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh:82`
  severity: medium
  Khối AC-8 chỉ ghim `P197-RANG DO`, `so P197-M < san`, `thieu dong P197-M-COUNT` trên output của rang chạy trong worktree base. Cả ba dòng đó cũng xuất hiện y hệt khi suite base KHÔNG chạy được (tests/plugins/run-tests.sh vắng, exit 127, worktree checkout thiếu file...) vì lúc đó OUT rỗng → NK=0, CNT rỗng. Không có `has "$OUTB" "PASS: P197"` (hoặc kiểm vắng dòng `khong thay dong 'PASS: P197'`) nên phép đo không phân biệt được «P197 ở base chạy xanh nhưng chưa in P197-M» với «chưa bao giờ chạy» — đúng lớp «assertion âm-tính-một-mình» trong CLAUDE.md, dù comment ngay trên khối tuyên bố có đối chứng dương. Sửa gợi ý: thêm `has "$OUTB" "PASS: P197"` và/hoặc chạy `ONLY_BLOCK=P197 bash "$TMP/base/tests/plugins/run-tests.sh"` kiểm exit 0 trước khi tin các keu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hình dạng 4 (biến thể đối chứng âm): đột biến m4 của P90 được nắn lại để khớp neo 4-chữ-đầu của thước — chiều đỏ «thay bản ĐẦU bằng câu khác» thực ra chỉ đỏ khi câu khác giữ nguyên 4 chữ đầu**
  Người dùng thấy gì: Một ca kiểm tự động dùng để phát hiện lỗi 'một bản sao câu bị viết lại khác bản kia' có thể yếu hơn tên gọi của nó: nếu ai đó viết lại câu theo cách khác với ví dụ đang dùng để kiểm, lỗi tương tự có thể không bị bắt. Rủi ro thấp, không chặn ship.
  file: `tests/plugins/run-tests.sh:1849`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: E1 tuyên chiều đỏ trên diffBase («răng ĐỎ ghim 'khong thay dong PASS: P198'») mà không mã nào chạy chiều đó, và thông điệp ghim cũng không tồn tại trong răng**
  Người dùng thấy gì: Một mô tả kiểm thử tự động ghi rằng đã thử một tình huống lỗi cụ thể và biết trước thông điệp cảnh báo sẽ hiện ra, nhưng tình huống đó chưa từng được chạy thật và thông điệp ghi trong mô tả cũng sai so với thông điệp thực tế của hệ thống — nên không nên coi phần này là bằng chứng đã kiểm chứng.
  file: `_acceptance/siet-rang-cau-ve-hinh/evals.yaml:13`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).