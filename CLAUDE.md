# Kit maintainer invariants

- **ĐÓNG BĂNG LAB (tái lập 2026-08-07):** engine (`skills/`, `feature-loop/`,
  `design-loop/`, `codex/`, `commands/`, `scripts/`, `lib/`, `hooks/`) chỉ
  nhận (a) **bugfix**, (b) **đóng nốt vòng đang dở lúc ra quyết định**
  (`measure-birth-certificate` — giữa S4, ký hoặc owner chủ động huỷ; KHÔNG
  mở rộng phạm vi nó), và (c) **đợt phẫu thuật GĐ1** khai trong
  [docs/plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md](docs/plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md).
  KHÔNG mở vòng meta MỚI nào (hồ sơ draft `premerge-ac-line` đứng ở Cổng 1
  chờ owner quyết duyệt-hay-xếp-lại theo tinh thần này) cho đến khi **≥3
  feature thật ở repo tiêu thụ** đi trọn vòng trên bản mới. Lý do: toàn bộ
  việc đã giao đến 07/08 là kit-sửa-kit, gate-fatigue của owner là ràng
  buộc số 1; chi tiết trong kế hoạch trên.

- **Nguồn sự thật** là `skills/`, `feature-loop/`, `design-loop/`, `codex/`,
  `commands/`, **và cả `scripts/`, `lib/`, `hooks/`, `vendor/`** — bốn cái sau
  cũng bị `rsync` vào mirror (xem `scripts/sync-plugin-packages.sh:27-31`), nên
  sửa ở `plugins/.../lib/` hay `plugins/.../scripts/` là mất việc ở lần sync kế.
  `plugins/` là **build mirror** sinh bởi
  `scripts/sync-plugin-packages.sh` — sửa nguồn xong PHẢI chạy sync và commit
  mirror cùng lượt; test P30 (`sync-plugin-packages.sh --check`) chặn drift.
  Vì sao commit mirror: [docs/adr/0001](docs/adr/0001-commit-plugins-mirror.md).

- **[CONTEXT.md](CONTEXT.md) là glossary phát triển của kit** (authoring-time).
  Khi viết/sửa SKILL.md, docs, message của script: dùng đúng term chuẩn và
  tránh mọi từ nằm trong `_Avoid_`. Term mới chỉ thêm khi kit thật sự cần nó.

- **6 thao tác cổng người** (`approve`, `signoff`, `acceptance-init`,
  `acceptance-status`, `acceptance-report`, `start`) bị khoá model-invocation ở CẢ HAI
  harness; `acceptance-card` cố tình để mở (feature-loop và approve/signoff
  model-invoke nó). Đừng "sửa" sự bất đối xứng này — test P31/P32 giữ nó,
  lý do ở [docs/adr/0002](docs/adr/0002-human-gate-invocation-lock.md).

- **Assertion âm-tính-một-mình là assertion không sống.** Mọi case dựng bản
  sao/fixture rồi kết luận từ "exit khác 0" PHẢI có (a) **đối chứng dương** —
  bản nguyên vẹn phải XANH trước khi tin bản bị tiêm là ĐỎ — và (b) ghim **đúng
  thông điệp** mong đợi, không chỉ mã thoát. Không có hai thứ đó thì case không
  phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy": fixture hỏng, `cp`
  lỗi, script không tồn tại (exit 127), bước tiêm thất bại — tất cả đều cho
  cùng một màu xanh. Trong hai feature 2026-07-26 nó xuất hiện **ít nhất 9 lượt**
  (`TE2a`, `P43`, `P40`, `P42`, `P45`, `TE18d/f/g`, `P46`, `TE5`), lần nào cũng
  là sửa một chỗ rồi viết lại đúng nó vài dòng bên dưới — nên sửa phải theo
  LỚP: quét cả file tìm mọi case cùng hình dạng, đừng chỉ vá case bị nêu tên.
  (Đừng ghim con số này thành danh sách đóng — nó sẽ lại lỗi thời; ý là *lớp*,
  không phải *danh sách*.)

- **Thước phải gắn vào vật được giao** — dạng tổng quát của bất biến trên,
  học bằng 4 round S4 liên tiếp của s4-scope-triage (2026-07-27→28): cùng một
  lớp lỗi đổi da 4 lần mà mọi eval vẫn xanh. Bốn hình dạng đã dẫm: (1) đo *chỉ
  dẫn* thay vì *đầu ra* (grep file hướng dẫn trong khi renderer không đọc key);
  (2) fixture cho judge là văn *viết tay* không code path nào sinh ra; (3) bên
  VIẾT và bên ĐỌC của một artifact trôi khỏi nhau vì mọi test tự dựng fixture
  đúng khuôn bên đọc; (4) phép-đo-thêm-để-chữa-lớp-này hardcode ROOT nên so với
  checkout của tác giả thay vì cây đang kiểm. Luật rút ra: fixture phải do
  **code sinh** trong chính lần chạy; khuôn của seam LLM-viết→máy-đọc phải đặt
  **một chỗ có marker** rồi test **round-trip** rút-từ-writer-đọc-bằng-reader
  (mẫu: `OOC-ITEM-TEMPLATE` + case P55); mọi đường dẫn trong test/script sinh
  fixture phải **suy từ vị trí script**, không hardcode. Nghi thức kiểm nhanh:
  hỏi "nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?" — rồi
  phá thử một lần cho mỗi phép đo mới.

- **Kit là engine — KHÔNG chứa**: product context của repo tiêu thụ, quy định
  đội (sống ở team handbook riêng), nội dung workspace `_acceptance/` của sản
  phẩm, thân skill bên thứ ba chưa vendor có tên + version gốc. Phép thử khi
  phân vân: thứ gì phải *chép* sang repo sản phẩm thứ hai, hoặc vô nghĩa với
  một công ty khác dùng kit, thì không thuộc kit. (Quyết 2026-07-27, plan
  discovery-gate0-rollout G1.)

- **Đổi schema artifact phải có đường đọc-cũ**: nhánh đọc bản cũ + cờ vàng
  trên card, KHÔNG bắt consumer migrate hàng loạt (pattern đã dùng: contract
  thiếu Coverage → cờ vàng 1.13.0; workspace thiếu gap-probe → cờ vàng
  1.14.0). Consumer nhận engine mới theo release có chủ đích — không đổi
  engine dưới chân một feature đang giữa vòng lặp.

- **Quyết định khó đảo / gây bất ngờ / có trade-off thật** → ghi ADR 1-đoạn-văn
  vào `docs/adr/` (đủ cả 3 điều kiện mới ghi, thiếu 1 thì bỏ). Đề xuất đã
  TỪ CHỐI mà có nguy cơ quay lại → 1 file trong `.out-of-scope/` kèm mục
  "Prior requests".
