# Review Findings: hinh-tai-cong-1 (round 3)

## Trong hợp đồng

(không có finding nào trong hợp đồng round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P90 nới lỏng: bản chép câu-về-hình ở S2 (SKILL.md:142) nay trôi khuôn mà không test nào đỏ**
  Người dùng thấy gì: Có một bài kiểm tra cũ (không thuộc lần vá lần này) sẽ không phát hiện khi câu mô tả về hình bị sửa lệch ở bản gốc nhưng phần hiển thị tại Cổng 1 vẫn giữ nguyên — một số thay đổi nội dung có thể lọt qua bài kiểm tra cũ đó. Bài kiểm tra mới của lần vá này vẫn bắt được lỗi loại đó, nên rủi ro chỉ nằm ở bài kiểm tra cũ.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **rang.sh ghim 16/21 thông điệp — 5 nhánh check của P197 không có răng ngoài suite**
  Người dùng thấy gì: Một danh sách kiểm tra nhanh hỗ trợ trong repo bị thiếu 5 trên 21 mục so với đầy đủ; nếu sau này ai đó xoá một nhánh kiểm tra cùng lúc với đột biến tương ứng, công cụ kiểm nhanh này sẽ không phát hiện ra, dù bài kiểm tra chính (bài quyết định xanh/đỏ) vẫn tự bắt được lỗi đó.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Dùng «ledger» trần trong văn bản mới của SKILL.md (CONTEXT.md _Avoid_)**
  Người dùng thấy gì: Bước 'Kê' trong tài liệu vòng lặp dùng từ 'ledger' thay vì tên tiếng Việt chuẩn ('sổ quyết định') mà nội bộ muốn thống nhất dùng; đổi từ này kéo theo phải đổi cả hợp đồng nghiệm thu và bài kiểm tra đi kèm, nên cần người quyết có đổi hay giữ nguyên như hiện tại.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ — chiều đỏ của các check quan-hệ (has_unit) chỉ là xoá-needle, không phải phá-quan-hệ; đột biến 'tách xanh-sạch/bỏ qua' thực chất xoá needle**
  Người dùng thấy gì: Một số bài kiểm tra được thiết kế để chứng minh hai cụm chữ phải nằm cùng một câu/đoạn thực chất chỉ đang kiểm tra chữ có mặt hay không, chứ chưa thực sự kiểm tra chúng có bị tách rời nhau hay không — nên nếu sau này ai đó vô tình tách hai cụm ra hai đoạn riêng mà không xoá chữ nào, khả năng cao lỗi đó sẽ không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Tuyên ma trận toàn phần nhưng phần tử template được liệt kê SAU theo đúng đột biến đã chạy — nhãn chỉ 1/5, không viết trước**
  Người dùng thấy gì: Một ghi chú trong bài kiểm tra tự nhận là 'kiểm tra toàn bộ tổ hợp' nhưng thực tế chỉ kiểm đúng một tổ hợp đã chạy, không phải hết mọi tổ hợp có thể. Việc này không gây báo xanh giả cho bài kiểm tra chính, nhưng nếu tin theo ghi chú đó thì có thể yên tâm nhầm rằng phạm vi đã được kiểm đầy đủ hơn thực tế.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
