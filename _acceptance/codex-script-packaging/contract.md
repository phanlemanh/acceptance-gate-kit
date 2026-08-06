---
schema_version: 2
feature: "Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau"
slug: codex-script-packaging
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-06T05:38:36Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-06-codex-script-packaging-design.md
time_human_minutes:
  gate1: 10
  gate2:
---

# Acceptance contract — codex-script-packaging

Bối cảnh: chỉ dẫn Codex bảo chạy `carry-plan.mjs` (cơ chế mang-kết-quả-sang
vòng-sau) nhưng gói không chứa file đó. Quét cả lớp: 1/6 tham chiếu
script-gói-mình là con trỏ chết, và **không phép đo nào canh quan hệ này** —
thêm công cụ mới vào chỉ dẫn mà quên chép thì hôm nay không gì đỏ. Feature
tiêu thụ #3 pha Đo chương trình 80/20.

## Nguồn sự thật của chốt — đặt cạnh hàm dựng, KHÔNG trong hồ sơ này

Bảng tham chiếu nằm ở `scripts/codex-self-script-refs.tsv`, cạnh hàm dựng gói.
Lý do: chốt chạy mỗi PR trên mã nguồn sống, nên nó không được lấy thẩm quyền
từ hồ sơ workspace của một việc đã đóng — thêm một công cụ ở vòng sau lẽ ra
không phải sửa hợp đồng của vòng này. File đó có hai phần: danh sách tham
chiếu-gói-mình, và danh sách tiền tố KHÔNG trỏ gói mình. Tiền tố nào không
thuộc cả hai → chốt ĐỎ, buộc người viết quyết (chống danh-sách-cấm trên không
gian mở).


## Criteria

- AC-1: Given gói Codex đã dựng, When liệt kê công cụ trong đó, Then
  `carry-plan.mjs` có mặt — đo trên gói ĐÃ DỰNG (mirror sau đồng bộ), không
  đo mã nguồn của hàm dựng.
- AC-2: Given mọi chỉ dẫn trong MỌI GÓI ĐÃ DỰNG (quét `plugins/<gói>/**` với
  đủ loại file `.md`/`.toml`/`.yaml` — KHÔNG quét thư mục overlay nguồn, vì
  gói gộp cả `skills/` gốc nên overlay hẹp hơn vật được giao), When rút bằng biểu thức các tham
  chiếu trỏ vào công cụ CỦA CHÍNH GÓI MÌNH (dạng `${PLUGIN_ROOT}/scripts/…`
  hoặc `<plugin>/scripts/…`), Then từng tham chiếu phải có file thật trong gói
  đã dựng tương ứng; thiếu → ĐỎ nêu đích danh gói + tên file + chỉ dẫn nào
  nhắc. Chốt rút MỌI dạng `<tiền tố>/scripts/<tên>` rồi PHÂN LOẠI: tiền tố
  mang `PLUGIN_ROOT` (ở bất kỳ dạng viết nào) hoặc `<plugin>` là trỏ gói mình;
  tiền tố khai ở phần hai của `scripts/codex-self-script-refs.tsv` là không
  trỏ gói mình; **tiền tố không thuộc cả hai → ĐỎ**, không được im lặng bỏ
  qua. Tập trỏ-gói-mình phải BẰNG ĐÚNG phần một của file đó — thừa đỏ, thiếu
  đỏ. Bộ đếm chỉ là phụ trợ, KHÔNG dùng làm thước phạm vi.
- AC-3: Given HAI hình dạng tham chiếu đã khai ở AC-2, When tiêm một tham
  chiếu BỊA theo TỪNG hình dạng vào bản sao chỉ dẫn, Then mỗi ca đều ĐỎ với
  thông điệp nêu đúng tên file bịa (2 ca dương, một ca cho mỗi hình dạng);
  VÀ chiều âm: chèn một tham chiếu trỏ SANG GÓI BẠN qua bộ giải thì phép đo
  phải vẫn XANH (không được rút nhầm). Bản nguyên vẹn XANH trước khi tin mọi
  kết quả đỏ; tiêm thất bại cũng ĐỎ với thông điệp riêng.
- AC-4: Given `carry-plan.mjs` trong gói Codex đã dựng, When chạy nó bằng
  `node` từ đúng vị trí đó, Then nó CHẠY ĐƯỢC — thiếu tham số trả mã thoát 2
  kèm thông điệp hướng dẫn ghim; và với hồ sơ THẬT của một việc đã niêm trong
  repo (do đường ghi thật sinh ra, KHÔNG phải hồ sơ test tự dựng theo khuôn
  bên đọc), trả mã thoát 0 và tập mã-hạng-mục mang-sang BẰNG ĐÚNG tập đủ điều
  kiện tính độc lập từ hồ sơ đó — quan hệ, không phải "kết quả có khoá đó".
  Có mặt nhưng không chạy được thì chưa tính là đã đóng gói.
- AC-5: Given hàm dựng gói, When gỡ MỘT dòng chép công cụ khỏi bản sao rồi
  dựng lại từ CÂY ĐANG KIỂM (không phải từ bản đã commit), Then chốt phải ĐỎ
  và nêu ĐÍCH DANH gói + công cụ bị mất — không chấp nhận "có gói nào đó mất
  file nào đó". Bắt buộc kèm: (a) lượt dựng phải trả mã thoát 0, vì hàm dựng
  xoá gói trước khi chép nên một lượt chạy hỏng cũng để lại gói rỗng và cho
  cùng màu đỏ vì lý do khác; (b) đối chứng dương — dựng lại bản NGUYÊN VẸN
  trong chính cây tạm đó phải cho danh sách mất-file RỖNG. Không neo vào mốc
  lịch sử: "chỉ được thêm kể từ một ngày" là luật sai, thứ cần canh là hàm
  dựng không làm rơi gói khác.
- AC-6: Given danh sách lệnh kiểm ĐỌC TỪ cấu hình đã khai (không ghim số),
  When chạy sau thay đổi, Then toàn bộ xanh, chốt chống-trôi nguồn⇔gói báo
  khớp, VÀ chốt quan hệ mới thật sự nằm trong lưới thường trực — ca âm: đổi
  tên tệp chốt trong bản sao cây thì lưới phải ĐỎ (chốt nằm ngoài đường quét
  thì lần thêm công cụ kế tiếp lại không có gì đỏ).

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — chặng của một công cụ** (CE: 3 chặng đếm từ đường đi thật của file:
  nguồn → hàm dựng → gói đã dựng → lệnh chạy được): AC-1 (có mặt trong gói),
  AC-4 (chạy được), AC-5 (không làm rơi cái khác)
- **B — quan hệ chỉ-dẫn ⇔ gói** (CE: 6 tham chiếu script-gói-mình rút được từ
  chỉ dẫn thật của 3 gói Codex [SP]): AC-2 (quan hệ toàn phần), AC-3 (đối
  chứng dương), AC-6 (chốt chống-trôi sẵn có)
- **C — cách phép đo có thể mù** (CE: 3 lớp lỗi đã trả giá trong hai vòng
  trước — ngưỡng dung sai, đếm-rồi-vứt, fail-open): AC-2 (sanity counter,
  không ngưỡng), AC-3 (mutant bắt buộc), AC-4 (chạy thật thay vì kiểm tồn tại)

## Out of scope

- Hợp nhất hai bản chỉ dẫn Claude và Codex.
- Đổi cách bộ giải tìm gói bạn.
- Thêm công cụ mới nào ngoài việc chép cái đã có.
