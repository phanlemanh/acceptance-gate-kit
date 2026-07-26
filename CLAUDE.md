# Kit maintainer invariants

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

- **5 thao tác cổng người** (`approve`, `signoff`, `acceptance-init`,
  `acceptance-status`, `acceptance-report`) bị khoá model-invocation ở CẢ HAI
  harness; `acceptance-card` cố tình để mở (feature-loop và approve/signoff
  model-invoke nó). Đừng "sửa" sự bất đối xứng này — test P31/P32 giữ nó,
  lý do ở [docs/adr/0002](docs/adr/0002-human-gate-invocation-lock.md).

- **Assertion âm-tính-một-mình là assertion không sống.** Mọi case dựng bản
  sao/fixture rồi kết luận từ "exit khác 0" PHẢI có (a) **đối chứng dương** —
  bản nguyên vẹn phải XANH trước khi tin bản bị tiêm là ĐỎ — và (b) ghim **đúng
  thông điệp** mong đợi, không chỉ mã thoát. Không có hai thứ đó thì case không
  phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy": fixture hỏng, `cp`
  lỗi, script không tồn tại (exit 127), bước tiêm thất bại — tất cả đều cho
  cùng một màu xanh. Lớp lỗi này đã xuất hiện **5 lần** trong hai feature
  (`TE2a`, `P43`, `P40`, `P42`, `P45`), mỗi lần sửa một chỗ rồi viết lại đúng
  nó vài dòng bên dưới — nên sửa phải theo LỚP, không theo từng finding.

- **Quyết định khó đảo / gây bất ngờ / có trade-off thật** → ghi ADR 1-đoạn-văn
  vào `docs/adr/` (đủ cả 3 điều kiện mới ghi, thiếu 1 thì bỏ). Đề xuất đã
  TỪ CHỐI mà có nguy cơ quay lại → 1 file trong `.out-of-scope/` kèm mục
  "Prior requests".
