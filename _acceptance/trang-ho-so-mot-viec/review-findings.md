# Review findings: trang-ho-so-mot-viec (round 2)

## Trong hợp đồng

Không có finding nào trong hợp đồng ở lượt này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Redrawing the sample pages puts two signed records into this PR's diff, so their evidence goes stale and the pre-merge gate blocks the merge (r1)**
  Người dùng thấy gì: Hai hồ sơ đã ký trước đó bị kéo vào lần gộp này và bị đánh dấu là chứng cứ đã cũ, nên cổng kiểm trước khi gộp đang chặn. Người quyết cần chọn: ghim lại hai hồ sơ ngay trong lần này, hoặc để đến đợt phát hành sau và chấp nhận chặn tạm.
  file: `_acceptance/trang-lo-trinh-doc-mot-phut/mau/hai-lo-trinh.html`
  severity: high
  Đề xuất: known-limits

- **Missing fields in the roadmap data reader now come back as null instead of an empty value of the right type, because some cell names match existing field names (r1)**
  Người dùng thấy gì: Khi dữ liệu lộ trình thiếu vài trường như số đã giao hay mã việc, kho đọc dữ liệu sẽ nhận về giá trị rỗng không có kiểu thay vì số 0 hoặc chuỗi rỗng. Kho nào cộng số hoặc xử lý chữ từ các trường đó có thể bị lỗi.
  file: `scripts/lo-trinh.mjs`
  severity: high
  Đề xuất: new-contract

- **A summary block missing its moi_nguoi or chu_kho part reads as an empty string, not an object of nulls (r1)**
  Người dùng thấy gì: Nếu dải tóm tắt của một việc thiếu hẳn phần cho người mới hoặc phần cho chủ kho, người đọc dữ liệu nhận về một chuỗi chữ thay vì bảng ô trống. Trang do kit vẽ ra luôn đủ hai phần nên chỉ gặp khi dữ liệu bị cắt tay.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **The 'what will we measure' cell shows the template placeholder '…' (or a '[đề xuất]' prefix) instead of 'chưa khai ngưỡng' (r1)**
  Người dùng thấy gì: Với việc mà ô cơ hội chưa điền câu hỏi đo, dải đầu trang hiện dấu ba chấm thay vì chữ chưa khai ngưỡng. Người đọc thấy một ô trông như đã có nội dung mà thật ra chưa có gì.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion, no positive control): «vi_sao/bat_khi keep the original text» is tested only on inputs the bracket-stripping function cannot change (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm rằng lý do và điều kiện của hàng giữ nguyên chữ gốc chỉ chạy trên những câu mà phép bỏ ngoặc vốn không đổi, nên nếu sau này có người lỡ bỏ ngoặc ở hai trường đó thì kiểm tra vẫn xanh.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (containment instead of equality): «Đã hứa» in LT-151 accepts an empty or truncated criterion sentence (r1 · tệp đã đổi)**
  Người dùng thấy gì: Mục Đã hứa được kiểm bằng cách chấp nhận cả câu bị cắt ngắn hoặc để trống, nên nếu bộ vẽ làm rơi câu của tiêu chí thì kiểm tra vẫn xanh dù người đọc thấy mục trống chữ.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
