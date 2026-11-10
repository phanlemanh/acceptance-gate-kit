## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): «mỗi nhánh bỏ qua có một nhát tiêm» vẫn thiếu năm nhánh của bộ quét**
  AC: AC-2
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:23`
  severity: medium
  source: measurement
  detail: AC-2 và E2 hứa «mỗi nhánh bỏ qua của bộ quét có một nhát tiêm riêng làm đỏ đúng hàng của nó»; dòng 45-46 chốt SO_NHAT_DJ2 = 20 như con số đủ. NHAT_DJ2 đã tiêm tới mức nhánh con (DJ-2-le cho lối lùi của chuỗi, DJ-2-regex-lop, DJ-2-regex-esc), nhưng cùng mức đó còn năm nhánh trong scripts/ban-do-khuon.cjs không có nhát và không có hàng nào phân biệt được: (1) dòng 304 `else if (s[j] === ']') lop = false`; (2) dòng 326 lối lùi `if (k > 0)` của regex không đóng; (3) dòng 293 điều kiện dừng ở xuống dòng của cuoiChuoi, tức vế «không có cặp trên dòng» mà chú thích dòng 318 và Out of scope dựa vào (hàng jsx-long-nhay-le không có dấu nháy thứ hai ở bất kỳ đâu sau nó nên không tách được «cùng dòng» với «cả tệp»); (4) dòng 301 điều kiện dừng ở xuống dòng của cuoiRegex; (5) dòng 339 đếm độ sâu `<` của cuoiKieu (hai hàng tham-so-kieu đều không có kiểu lồng). Đã chạy từng đột biến trên bản chép của bộ đọc với đúng bảng HANG_DJ2: cả năm không làm đỏ hàng nào trong 32 hàng. Năm đột biến đều đổi hành vi thật, ví dụ bỏ dòng 304 làm `/[a]}/` đọc sai, và đột biến cuoiKieu làm `<K<A<B>> title="x">c</K>` đóng thẻ sớm. Chưa chạy trọn bộ ca trên bản đột biến vì lệnh dựng bản sao bị từ chối quyền. Phần còn lại dựa trên đọc code: fixture DJ-1, DJ-3, DJ-4, DJ-5 không có regex, không có tham số kiểu, và không có nháy lẻ; DJ-6…8 không đi vào bộ quét thẻ.
  rationale: AC-2 hứa mỗi nhánh bỏ qua của bộ quét có một nhát tiêm riêng làm đỏ đúng hàng của nó, mà năm nhánh không có nhát nào làm đỏ hàng nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cả tám eval không khai tệp dựng kho mẫu trong paths, nên sửa tệp đó vẫn được mang màu xanh cũ**
  Người dùng thấy gì: Nếu sau này chỉ sửa phần dựng kho thử của bộ kiểm, các kết quả xanh của lượt trước vẫn được giữ lại mà không chạy lại. Bộ kiểm vẫn chạy đủ ở mỗi lượt nên chỗ hở này khó gây hại thật.
  Căn cứ: Hậu quả nhẹ, chỉ có thể khiến một kết quả xanh cũ được giữ thêm một lượt, không mất dữ liệu và lượt kiểm kế tiếp tự lộ ra; sửa sau cũng rẻ.
  file: `_acceptance/doc-jsx-va-ban-do-hong/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Chốt số phép so của DJ-7 cộng cứng ba ô, nên bỏ một trong ba phép so đó thì chốt vẫn xanh**
  Người dùng thấy gì: Hành vi cho người dùng vẫn đúng. Chỉ là nếu ai đó vô tình xoá bớt một phép kiểm về lỗi bản đồ nhẹ thì bộ kiểm không báo đỏ.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm lưới kiểm lỏng hơn một chút ở ba ô, và có thể siết lại sau mà không mất gì.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (số assert = số phần tử, mẫu P105): chốt số của DJ-7 cộng con số viết tay trước khi có phép so, không đếm phép so đã chạy**
  Người dùng thấy gì: Hành vi thật của bước sinh tham số vẫn đúng. Bộ kiểm có thể không nhận ra nếu một phép kiểm về lỗi bản đồ bị xoá nhầm.
  Căn cứ: Chỉ ảnh hưởng độ chặt của bộ kiểm chứ không ảnh hưởng người dùng, lỗi lộ ra khi ai đó sửa ca đo và sửa lại sau không tốn kém.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (thiếu ma trận toàn phần, số assert = số phần tử): bảng HANG_DJ4 và HANG_DJ5 không có chốt số, xoá hàng vẫn xanh**
  Người dùng thấy gì: Hành vi đọc thẻ vẫn đúng. Nếu ai đó xoá bớt một dạng thẻ khỏi bảng thử thì bộ kiểm vẫn xanh nên dạng đó có thể mất bảo vệ mà không ai hay.
  Căn cứ: Không làm sai kết quả cho người dùng ngay, chỉ để lỗ hổng bảo vệ về sau nếu bảng bị xoá, và thêm chốt số sau này rất rẻ.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá nhan_dien có mặt nhưng rỗng vẫn làm nhóm mất khỏi lưới mà không có lỗi nào, s4-args không dừng (r1)**
  Người dùng thấy gì: Nếu tệp bản đồ của một nhóm có mục nhận diện nhưng để trống, nhóm đó vẫn biến khỏi lưới mà không ai được báo. Hệ thống trả lời là không chạm nhóm nào và vẫn cho qua.
  Căn cứ: Nhóm mất khỏi lưới trong im lặng là lỗi nặng vì người dùng không có dấu hiệu nào để tự phát hiện, nhưng chỉ xảy ra khi ai đó cố tình để trống mục này và kho hiện tại không có nhóm nào như vậy, nên nên xử lý trong một hợp đồng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **E1, E5, E7 chạy bước chấm nhưng paths không khai scripts/design-floor-khuon.mjs, nên có thể bị mang màu xanh cũ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi chỉ sửa đúng tệp của bước chấm, một vài bằng chứng cũ có thể được mang sang thay vì chạy lại. Hồi quy thật vẫn bị bộ kiểm thử chung bắt ở mỗi lượt.
  Căn cứ: Hậu quả nhẹ vì lỗi thật vẫn bị phát hiện bằng đường khác, không mất dữ liệu, và sửa lại sau rất rẻ khi cần.
  file: `_acceptance/doc-jsx-va-ban-do-hong/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **nhan_dien có khoá nhưng rỗng vẫn làm nhóm mất khỏi lưới mà không báo gì (r1)**
  Người dùng thấy gì: Nhóm có mục nhận diện để trống sẽ biến khỏi lưới và hệ thống vẫn báo là không chạm nhóm nào. Người dùng không nhận được cảnh báo nào.
  Căn cứ: Mất nhóm trong im lặng là hậu quả nặng, nhưng cần ai đó để trống mục này và hiện không nhóm nào như vậy, nên gom cùng t1 vào một hợp đồng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): lớp «lỗi làm mất nhóm» chỉ có bốn hàng, bỏ giá trị nhan_dien không đọc được (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu mục nhận diện của một nhóm có giá trị không dùng được, nhóm vẫn biến khỏi lưới mà không có cảnh báo. Bộ kiểm thử hiện chỉ thử bốn kiểu lỗi đã biết.
  Căn cứ: Hậu quả giống t1 là nhóm mất trong im lặng, nhưng cần một kiểu nhập sai hiếm gặp, nên đề xuất gom vào hợp đồng mới thay vì sửa ngoài hợp đồng.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): khối eval khuôn EV_KHUON không rút từ bên viết goiYEval (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này cách sinh khối đánh giá đổi định dạng, hệ thống có thể từ chối khối thật mà bộ kiểm thử vẫn báo xanh. Người dùng sẽ gặp lỗi lúc sinh tham số.
  Căn cứ: Hậu quả nhẹ và dễ tự gỡ vì hệ thống dừng rõ ràng chứ không lặng lẽ sai, và chỉ xảy ra khi định dạng đổi trong tương lai.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
