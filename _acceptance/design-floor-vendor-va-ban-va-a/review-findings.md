# Review findings: design-floor-vendor-va-ban-va-a (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Một mục rà soát thuộc chủ đề chủ kho đã dặn không nêu trong kho công khai (quyết 26/10) — nội dung không chép vào đây**
  Người dùng thấy gì: không đổi gì ở hành vi của bản gói; mục chạm cách mã bên thứ ba được đưa vào kho.
  Căn cứ: tác tử rà soát xếp mức nặng và cho là khó đảo khi phát hành; chủ kho đã giữ quyền quyết chủ đề này nên máy không tự định tuyến, không viết lại nội dung.
  file: `design-floor/vendor/design-os`
  severity: high
  Đề xuất: new-contract

- **Sổ vá và hợp đồng vẫn ghi bản vá D làm xanh '4 cặp figma' trong khi khối máy chỉ còn 3**
  Người dùng thấy gì: Ghi chú cho người làm bước kế tiếp nói còn bốn cặp cần làm xanh trong khi thực tế chỉ còn ba. Người đó có thể mất công tìm một cặp không còn tồn tại, nhưng sản phẩm đang giao không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ, chỉ gây nhầm khi đối chiếu ở bước sau, không mất dữ liệu; người đọc tự phát hiện được qua số đo thật và sửa một dòng chữ là xong.
  file: `design-floor/LOCAL-PATCHES.md:17`
  severity: low
  Đề xuất: known-limits

- **VA-01 cannot handle two applied patches that touch the same file: it will falsely fail and skip checking the earlier patch**
  Người dùng thấy gì: Khi bước sau áp thêm bản vá thứ hai lên cùng một tệp, bộ kiểm sẽ báo lỗi giả và bỏ qua việc kiểm bản vá trước. Hiện chưa xảy ra nên người dùng chưa gặp gì.
  Căn cứ: Chưa có hậu quả hôm nay vì mới có một bản vá, nhưng sẽ gây báo đỏ giả ở bước kế tiếp; sửa rẻ nếu làm cùng lúc với bản vá thứ hai.
  file: `tests/design-floor/rao-dong.mjs:70`
  severity: medium
  Đề xuất: known-limits

- **DF-07 passes without checking that each command actually ran**
  Người dùng thấy gì: Phép kiểm 'các lệnh chấm không ghi tệp' có thể báo đạt cả khi một lệnh chết ngay từ đầu. Hiện các lệnh vẫn chạy bình thường nên chưa che lỗi thật nào.
  Căn cứ: Rủi ro là báo đạt sai trong tương lai nếu bản gói hỏng, chưa thấy xảy ra; người dùng không mất dữ liệu và sửa bộ kiểm sau không đắt.
  file: `tests/design-floor/hop-dong.mjs:200`
  severity: low
  Đề xuất: known-limits

- **Ledger and contract still say four figma pairs remain in FN-02; only three remain after patch A**
  Người dùng thấy gì: Sổ ghi chú vẫn nói bốn cặp và mười sáu cặp trong khi số thật là ba và mười bảy. Người làm bước kế tiếp có thể bị dẫn sai khi đối chiếu, sản phẩm đang giao không đổi.
  Căn cứ: Chỉ là ghi chú lệch số, không gây mất dữ liệu hay lỗi cho người dùng; sửa bằng một chỉnh chữ rẻ khi làm bước sau.
  file: `design-floor/LOCAL-PATCHES.md:85`
  severity: low
  Đề xuất: known-limits

- **dong-bo --kiem reports every build failure as a mismatch (exit 1) instead of «could not run» (exit 2)**
  Người dùng thấy gì: Khi môi trường thiếu công cụ dựng, phép đối chiếu báo là mã nguồn bị lệch thay vì báo không chạy được. Người bảo trì có thể mất thời gian tìm lỗi không có thật.
  Căn cứ: Chỉ gây nhầm lẫn khi chẩn đoán, không ảnh hưởng người dùng sản phẩm; người bảo trì tự thấy qua thông báo lỗi và sửa không đắt.
  file: `tests/design-floor/dong-bo.mjs:92`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): DF-07 không kiểm lệnh chấm có thật sự chạy trên bản gói đã vá**
  Người dùng thấy gì: Phép kiểm 'không ghi tệp' có thể báo đạt dù lệnh không chạy tới nơi. Tác giả đã chạy tay thì các lệnh chạy bình thường, nên hiện chưa có hỏng hóc nào bị che.
  Căn cứ: Rủi ro chỉ là màu xanh giả về sau, chưa thấy xảy ra, không mất dữ liệu cho người dùng; thêm một đối chứng sau này là rẻ.
  file: `tests/design-floor/hop-dong.mjs:200`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): bước kiểm gate.yml của E4 chỉ khớp chuỗi, không có chiều đỏ**
  Người dùng thấy gì: Phép kiểm cấu hình kiểm thử tự động chỉ xem tên cài đặt có xuất hiện hay không, nên ai đó vô tình làm mất hiệu lực cài đặt đó có thể không bị phát hiện. Cấu hình hiện tại đúng.
  Căn cứ: Cấu hình hiện đúng nên người dùng không bị ảnh hưởng; rủi ro là bị sửa nhầm mà không ai hay, nhưng lỗi này lộ ra khi chạy thật và sửa nhẹ.
  file: `tests/design-floor/eval.sh:16`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
