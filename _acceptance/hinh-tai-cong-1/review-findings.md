# Review Findings: hinh-tai-cong-1 (round 5)

## Trong hợp đồng

- **Hình dạng 3 — assert 'chuỗi có mặt' trong khối trong khi contract hứa vị trí trong BƯỚC (kê/đếm)**
  file: `tests/plugins/run-tests.sh:9961`
  severity: medium
  AC: AC-2, AC-3
  detail: AC-2 hứa `_acceptance/<slug>/figures/index.md` «có mặt ở bước đếm», AC-3 hứa bốn cụm nguồn + `không hỏi người` «có mặt trong bước kê». Nhưng check() đo block-wide: dòng 9961 `if "_acceptance/<slug>/figures/index.md" not in b`, dòng 9963-9965 `for s in SOURCES: if s not in b`, và `"không hỏi người" not in b` — b là cả khối, không phải đơn vị bullet [1]/[2]. Đột biến chuyển `human-gate1` hay `figures/index.md` từ [1]/[2] sang bullet [5] Đính vẫn XANH. Case đã có sẵn hàm has_unit() (đo quan hệ cùng-đoạn) nhưng không dùng nó cho các needle này. Đây là quan hệ (needle ⊂ đơn vị bước X) bị đo bằng presence trong khối.
  source: measurement
  rationale: check() dùng presence toàn khối thay vì đơn vị-bước, trực tiếp trái với lời hứa vị trí 'có mặt ở bước đếm' (AC-2) và 'có mặt trong bước kê' (AC-3) nêu rõ trong Then của hai AC này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **rang.sh ghim 16 thông điệp trong khi bảng M của P197 có 18 — hai thông điệp mà evals E3/E4 tuyên bố rang ghim (không-hỏi-người, xanh-sạch/bỏ-qua) không có trong danh sách rang**
  Người dùng thấy gì: Lớp bảo vệ phụ hiện chưa canh đủ hai cảnh báo trong nhóm kiểm tra Cổng 1; nếu sau này ai đó gỡ nhầm phần kiểm tra tương ứng ở bộ kiểm chính, lớp bảo vệ phụ này sẽ không kịp báo động dù bộ kiểm chính hiện vẫn giữ đủ. Người dùng hiện tại không bị ảnh hưởng.
  file: `_acceptance/hinh-tai-cong-1/rang.sh:147`
  severity: low
  Đề xuất: known-limits

- **rang.sh chỉ ghim 16/21 thông điệp mà check() của P197 có thể phát — 5 nhánh không được răng ngoài bảo vệ**
  Người dùng thấy gì: Lớp bảo vệ phụ mới canh khoảng ba phần tư các cảnh báo của Cổng 1; năm cảnh báo còn lại chỉ được bộ kiểm chính giữ, không có lớp phụ dự phòng. Nếu bộ kiểm chính bị nới lỏng trong một thay đổi tương lai, các cảnh báo này có thể lặng lẽ biến mất mà không ai nhận ra ngay.
  file: `_acceptance/hinh-tai-cong-1/rang.sh:147`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «ma trận TOÀN PHẦN» nhưng EXPECTED tự thu hẹp: nhãn nở 1/5, needle trong has_unit không gỡ lẻ**
  Người dùng thấy gì: Phép kiểm tự động cho khối hình chỉ chắc chắn bắt lỗi khi một nhãn bước bị xoá hoặc sai; bốn nhãn bước còn lại và các cách đổi thứ tự khác chưa được xác nhận là sẽ bị bắt lỗi. Nếu các nhãn đó bị viết sai trong một thay đổi tương lai, hệ thống có thể không phát hiện được.
  file: `tests/plugins/run-tests.sh:10059`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (biến thể) — chiều đỏ của các check quan hệ has_unit chỉ chứng minh bằng XOÁ, không bằng TÁCH đoạn giữ đủ chữ**
  Người dùng thấy gì: Các phép kiểm 'cùng một bước' hiện chỉ được xác nhận bằng cách xoá hẳn câu chữ, chưa được xác nhận khi câu chữ bị tách ra nhiều đoạn nhưng vẫn giữ đủ nội dung. Có khả năng một bản chỉnh sửa tách nội dung ra nhiều đoạn vẫn lọt qua kiểm tra dù không còn đúng ý 'cùng một bước'.
  file: `tests/plugins/run-tests.sh:10034`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (drift) — E8 gọi p90_check là «hàm check THẬT của P90» nhưng là bản chép tay một dòng, không phải reader P90**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm chéo nói phép kiểm này dùng đúng logic gốc của bước kiểm câu-về-hình, nhưng thực chất đó là một bản chép tay riêng; nếu logic gốc thay đổi sau này, phép kiểm chéo có thể không cập nhật theo và không phát hiện ra sai lệch. Đây là rủi ro về tài liệu kiểm thử, không ảnh hưởng tính năng đang bàn giao.
  file: `tests/plugins/run-tests.sh:10066`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
