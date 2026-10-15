---
schema_version: 1
slug: kho-moi-cai-goi-road-map
feature: Kho mới cài gói road-map có sẵn tệp lộ trình khởi tạo đúng khuôn
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM4
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM4 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026.

Kho mới cài gói road-map có sẵn tệp lộ trình khởi tạo đúng khuôn

Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào; nấc 2 của ADR 0025 (lệnh khởi tạo kho tạo sẵn
tệp lộ trình), chủ kho gọi tên «road-map hoàn tất theo B′, làm luôn» 15/10 (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`).

**Ai đau:** chủ kho của một kho chọn có lộ trình (cài gói `road-map`). Hôm nay gói chỉ có lệnh xem; kho chưa có tệp
lộ trình thì thẻ khởi động chỉ in cờ vàng «Kho chưa khai lộ trình» (nấc 1, MC1) và người phải tự dựng mọi thứ.

**Số đo trước — máy đo 15/10 trên một kho thử trống** (git init + `config.yaml` tối thiểu, khai `lo_trinh.tep`, bộ máy
của cây kit @10b62ece): khai khoá mà chưa có tệp → trang lộ trình in «tệp ý định không tồn tại», và bước kiểm CI
`product-map.mjs --check` **thoát 1 ngay cả sau khi vẽ lại** vì `t1_skip_globs` chưa miễn `LO-TRINH.html`. Muốn mở
vòng đầu từ một hàng, người phải làm tay **5 việc**: viết tệp JSON theo khuôn mẫu · khai `lo_trinh.tep` · thêm
miễn trừ `LO-TRINH.html` · chép hai tệp CI chỉ-khi-khai (`lo-trinh.mjs`, `ho-so-tom-tat.cjs`) · vẽ và commit trang.
Hai kho đang có lộ trình (kit 08/10, crm 03/10) đều viết tay từ đầu.
**Kho trên máy MacBook Pro:** 14 kho có `_acceptance/config.yaml`; 4 khai lộ trình (kit, crm và hai bản sao thử),
10 chưa; **0/14 cài `road-map` ở phạm vi kho**.

**Ý định:** kho nào chọn cài `road-map` thì lần chạy lệnh khởi tạo kho (`/acceptance-gate:acceptance-init`, chạy lại
an toàn trên kho đã có cấu hình) để lại một tệp lộ trình rỗng đúng khuôn, khoá cấu hình, miễn trừ và trang đã vẽ —
`--check` xanh ở chính commit khởi tạo, thẻ khởi động hết cờ «chưa khai». Kho KHÔNG cài `road-map` thì lệnh khởi tạo
không đổi một byte nào (ADR 0025: nấc bắt buộc là lựa chọn của từng kho, không đổi mặc định).

**Ngoại lệ luật chiều rộng (b), nói thẳng:** hàng này từng ở «Chờ điều kiện» vì «chưa kho mới nào cần» — số đo trên
xác nhận điều đó (0 kho cài gói). Nó lên hàng chỉ vì chủ kho gọi tên cả gói 15/10. Chữ ký ở cổng này là xác nhận
ngoại lệ, không phải máy suy ra từ lời chuyển.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: kho thật đầu tiên cài `road-map` rồi chạy lệnh khởi tạo — còn phải làm tay việc nào trong
  5 việc ở trên trước khi mở vòng đầu không, và `product-map.mjs --check` có thoát 0 ở commit khởi tạo không?
  Thước: đếm commit sửa tay tệp lộ trình / `config.yaml` / bản chép CI giữa commit khởi tạo và hồ sơ đầu tiên mở từ
  một hàng (git log của kho đó) + mã thoát `--check` trên commit khởi tạo.
- Kết quả nào là SỐNG: 0 việc tay trong 5, `--check` thoát 0 ở commit khởi tạo.
- Kết quả nào là CHẾT: còn ≥ 2 việc tay, hoặc `--check` đỏ sau khởi tạo.
- Ở giữa (ITERATE): đúng 1 việc tay còn sót — đọc nó để xem lệnh khởi tạo thiếu gì.
- Timebox: 2026-11-19. Tới hạn mà chưa kho thật nào cài `road-map` → ô đo ghi «chưa đọc được ở đây» (nhãn trạng
  thái, không phải CHẾT); kho thử máy sinh trong bộ kiểm đọc được ngay từ lượt chấm.
