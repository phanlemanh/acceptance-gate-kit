# Review findings: ci-cua-kho-bo-job-nang

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **--hang-pr coi mọi */_acceptance/* ở bất kỳ độ sâu nào là hồ sơ, nên PR chỉ sửa fixture test được cham_vat=false và job test bị bỏ qua**
  Người dùng thấy gì: Một thay đổi chỉ sửa dữ liệu mẫu của bài test (nằm trong thư mục _acceptance lồng bên trong) có thể bị coi là chỉ sửa hồ sơ, nên CI của kho bỏ qua bước chạy test dù lẽ ra phải chạy. Kho nào bật tính năng bỏ job nặng sẽ không được test bắt lỗi cho loại thay đổi này.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **--hang-pr: đổi tên/di chuyển tệp nguồn vào vùng T1 thì ra T1, cham_vat=false, và job test bị bỏ**
  Người dùng thấy gì: Nếu một thay đổi chuyển mã sản phẩm sang thư mục tài liệu (chỉ đổi tên, không sửa nội dung), CI có thể coi đó là thay đổi tài liệu và bỏ qua bước chạy test. Mã sản phẩm đã đi chỗ khác mà không được kiểm lại.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **--hang-pr: tệp thuộc */_acceptance/ ở bất kỳ độ sâu nào (fixture test) bị xếp ho-so, cham_vat=false**
  Người dùng thấy gì: Thay đổi chỉ sửa tệp mẫu dùng cho test, nếu nằm trong một thư mục tên _acceptance ở bên trong, sẽ bị CI coi là hồ sơ và bỏ qua bước chạy test. Người dùng tưởng đã được kiểm nhưng test thật chưa chạy.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **Hình 3 — AC-2 hứa một QUAN HỆ (tập VIOLATION [PR] của cổng ↔ hạng mà CHẾ ĐỘ in) nhưng chỉ so cổng với một hằng viết trước; ca AC-2 không hề chạy chế độ**
  Người dùng thấy gì: Bài kiểm tra chưa so trực tiếp hạng mà chế độ mới báo với kết quả của cổng cũ trên từng ca. Nếu chế độ mới báo sai hạng ở một ca, một trong các bài kiểm tra vẫn báo xanh nên có thể lọt.
  file: `tests/scripts/hang-pr.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 3 — vế «bảng bốn hàng» (trạng thái job × đầu ra → chạy/bỏ) của AC-10 không có khẳng định nào; E11 vẫn tuyên đã đo**
  Người dùng thấy gì: Hướng dẫn cho kho tiêu thụ có một bảng nói khi nào chạy và khi nào bỏ test, nhưng không bài kiểm tra nào canh bảng này. Ai đó sửa nhầm bảng thì kho làm theo có thể cấu hình sai mà không bị phát hiện.
  file: `tests/scripts/hang-pr.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 1 — khoá `outputs.<khoá>` trong GUIDE được so với khối chú thích HANG-PR-KHOA, không so với khoá mà `hp_in` thật sự in; chiều KHOA ⊆ khoá-in-ra không có răng**
  Người dùng thấy gì: Hướng dẫn có thể nhắc một tên đầu ra mà cổng thật ra không bao giờ in. Khi đó CI của kho chỉ chạy test đầy đủ như cũ, nên chỉ tốn thêm phút chạy chứ không gây sai.
  file: `tests/scripts/hang-pr.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình 5 — vế lịch sử AC-8 tuyên «MỌI commit của vòng» nhưng tập commit lấy theo nhãn tự khai trong thông điệp (`--grep=slug`), không theo phạm vi diff**
  Người dùng thấy gì: Kiểm tra rằng cổng cũ không đổi hành vi chỉ nhìn các lần sửa có ghi tên vòng trong lời nhắn. Một lần sửa quên ghi tên có thể lọt qua mà không bị bắt, nhưng khả năng này thấp và chi phí vá lớn hơn hậu quả.
  file: `tests/scripts/hang-pr.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
