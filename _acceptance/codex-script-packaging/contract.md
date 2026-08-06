---
schema_version: 2
feature: "Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau"
slug: codex-script-packaging
risk_tier: T2
surfaces: [cli]
status: approved
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

## Bảng tham chiếu công cụ-của-chính-gói — rút từ chỉ dẫn thật 2026-08-06

Mỗi dòng là MỘT tham chiếu mà chỉ dẫn của gói bảo chạy công cụ CỦA CHÍNH GÓI
ĐÓ. Phép đo phải rút được tập BẰNG ĐÚNG bảng này (thừa cũng đỏ, thiếu cũng
đỏ) — số assert bằng số dòng, không dùng bộ đếm ">0" làm thước phạm vi.

<!-- <<<CODEX-SELF-SCRIPT-REFS -->
- acceptance-gate | acceptance-card | gate-card.js
- acceptance-gate | approve | eval-coverage-lint.js
- acceptance-gate | approve | product-map.mjs
- acceptance-gate | signoff | product-map.mjs
- acceptance-gate | start | start-scan.mjs
- feature-loop-codex | feature-loop-codex | carry-plan.mjs
- feature-loop-codex | feature-loop-codex | resolve-plugin.mjs
<!-- CODEX-SELF-SCRIPT-REFS>>> -->

## Criteria

- AC-1: Given gói Codex đã dựng, When liệt kê công cụ trong đó, Then
  `carry-plan.mjs` có mặt — đo trên gói ĐÃ DỰNG (mirror sau đồng bộ), không
  đo mã nguồn của hàm dựng.
- AC-2: Given mọi chỉ dẫn của mọi gói Codex, When rút bằng biểu thức các tham
  chiếu trỏ vào công cụ CỦA CHÍNH GÓI MÌNH (dạng `${PLUGIN_ROOT}/scripts/…`
  hoặc `<plugin>/scripts/…`), Then từng tham chiếu phải có file thật trong gói
  đã dựng tương ứng; thiếu → ĐỎ nêu đích danh gói + tên file + chỉ dẫn nào
  nhắc. Tập rút được phải BẰNG ĐÚNG bảng `CODEX-SELF-SCRIPT-REFS` ở trên —
  thừa một dòng cũng đỏ, thiếu một dòng cũng đỏ; và tập TỆP CHỈ DẪN đã quét
  phải phủ cả ba gói Codex, đối chiếu danh sách viết trước. Bộ đếm chỉ là phụ
  trợ, KHÔNG dùng làm thước phạm vi.
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
- AC-5: Given bản dựng mới, When so danh sách file của TỪNG gói với bản trước
  thay đổi, Then chỉ được THÊM — không gói nào mất file (chống sửa hàm dựng
  làm rơi gói khác); đối chứng: bỏ một dòng chép trong hàm dựng → ĐỎ nêu file
  bị mất. KHÔNG fail-open: phải assert TRƯỚC rằng lấy được commit đã ghim
  trong sổ (không lấy được → ĐỎ với thông điệp RIÊNG, phân biệt rõ với
  hành-vi-sai) và bản dựng tại mốc ra đúng ba gói, mỗi gói có số file > 0 —
  danh sách base rỗng thì "không mất file nào" luôn đúng một cách vô nghĩa.
  Ca đối chứng thêm: đổi mã commit trong BẢN SAO sổ thành mã không tồn tại →
  phải ĐỎ đúng thông điệp không-lấy-được-bản-cũ.
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
