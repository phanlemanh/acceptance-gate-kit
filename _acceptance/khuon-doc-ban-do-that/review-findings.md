# Review findings: khuon-doc-ban-do-that (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ngoại lệ dạng danh sách trỏ tệp không có sinh N dòng sai lược đồ trùng hệt nhau**
  Người dùng thấy gì: Khi chủ kho khai miễn trừ cho nhiều khối cùng một tệp mà tệp đó không tồn tại, báo lỗi hiện cùng một câu lặp lại nhiều lần. Kết luận vẫn đúng, chỉ làm danh sách lỗi dài và ồn hơn.
  Căn cứ: Hậu quả nhẹ: người dùng vẫn bị báo lỗi đúng chỗ, không mất dữ liệu, chỉ đọc hơi rối; sửa sau cũng rẻ nên có thể ghi lại rồi ship.
  file: `scripts/ban-do-khuon.cjs`
  severity: low
  Đề xuất: known-limits

- **Phần expected của evals lệch khỏi fixture và số assert thật**
  Người dùng thấy gì: Phần mô tả kết quả mong đợi của vài ca đo ghi tên khối và số phép so không khớp với ca chạy thật. Người dùng cuối không thấy gì, nhưng người đọc hồ sơ có thể hiểu nhầm.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm; chỉ có nguy cơ gây hiểu nhầm cho người đọc hồ sơ về sau, và sửa chữ bất cứ lúc nào cũng rẻ.
  file: `_acceptance/khuon-doc-ban-do-that/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Câu cờ vàng chung («Dùng khi», «Không dùng», nhan_viec) bị dời vào đoạn lop_trinh_bay**
  Người dùng thấy gì: Một câu hướng dẫn chung về việc thiếu mục thì bị cảnh báo vàng nay nằm dưới phần lớp trình bày, nên người đọc có thể tưởng nó chỉ áp cho phần đó. Hành vi của công cụ không đổi.
  Căn cứ: Chỉ là chỗ đặt câu chữ trong tài liệu hướng dẫn, không làm sai kết quả hay mất gì của người dùng; sửa tốn công hơn lợi ích nên chấp nhận và ghi vết.
  file: `skills/acceptance/references/ban-do-khuon-template.md`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm-tính-một-mình, vế ghim thông điệp): ca -do ghim một tiêu đề mà chính tệp ca chèn vào mỗi khi có lỗi, không ghim lỗi được tiêm**
  Người dùng thấy gì: Một số ca thử chiều đỏ có thể báo đỏ vì một lỗi khác với lỗi định bắt, nên chưa chắc chứng minh được máy bắt đúng lỗi đó. Sản phẩm chạy đúng, chỉ độ tin cậy của phép thử yếu hơn mức mong muốn.
  Căn cứ: Không làm người dùng gặp lỗi hay mất dữ liệu, nhưng làm bằng chứng xanh kém chắc chắn hơn; đây là việc về thước đo nên ghi giới hạn và theo ngưỡng đang đếm thay vì mở thêm vòng.
  file: `tests/scripts/khuon-doc-ban-do-that.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên đủ đường nhưng chỉ có điểm-case): KD-7 tuyên đường lệch với ngoại lệ dạng danh sách, nhưng tệp mới duy nhất dạng danh sách có một phần tử, nên chiều đỏ chỉ chạm đường nợ cũ**
  Người dùng thấy gì: Trên ca thử dùng kho giống thật, trường hợp tệp mới có miễn trừ nhiều khối chưa được chứng minh là sẽ báo đỏ khi sai. Trường hợp này vẫn được kiểm ở ca thử dùng kho tổng hợp.
  Căn cứ: Hậu quả nhẹ vì lỗi này vẫn có chỗ khác chặn được, người dùng không mất gì; chỉ là bằng chứng trên kho giống thật còn thiếu một chiều, nên ghi giới hạn là đủ.
  file: `tests/scripts/khuon-doc-ban-do-that.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
