---
schema_version: 1
slug: ban-do-khuon-roi-nhom
feature: "Bước chấm khuôn hiểu mục ngoai_le không có khoi là «tệp rời nhóm»: tệp ấy không thuộc nhóm, nên không bị chấm lệch hay nợ cũ theo nhóm ấy"
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-11-03   # chủ kho chọn «Cắt trước» cho câu §10 của finding 03/11: cắt 2.37.0 như đang có, V0 đi mốc kế
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: onehub-quy-hang/_acceptance/ban-do-khuon-nhom-da-co/ — hồ sơ đã ký dựng bản đồ khuôn của kho thứ hai, trong đó nhóm
«trang tạm» có glob phủ mọi trang và một danh sách `ngoai_le: [{tep, ly_do}]` không `khoi` để màn thật rời nhóm. Số đo
nằm ở finding `docs/findings/2026-11-03-ban-do-khuon-quy-hang-va-ke-hoach-kit.md` §0, §5.2, §10 (nhánh
`claude/khao-sat-ban-do-khuon-quy-hang-f55a61`, commit `e10ac284`).

Kho viết `ngoai_le` không có `khoi` để nói «tệp này rời nhóm». Bộ đọc của kit chỉ hiểu ngoại lệ là miễn một khối, nên bỏ
qua dòng ấy: tệp vẫn thuộc nhóm trang tạm, bị báo «thuộc hai nhóm màn» hay «thiếu khuôn». Trên bản sao kho thứ hai ở
`3273a44`, kit `main` `428b2773` ra **10 lệch mới và 6 nợ cũ**; bộ đo của kho ra 0.

Người gặp: chủ kho và đội sản phẩm của onehub-quy-hang khi nâng `KIT_TAG` lên mốc có bước chấm khuôn (trước đợt
`dau-khach-nhap`) — vòng giao diện đầu tiên chạm một màn thật sẽ có eval khuôn đỏ vì lỗi của kit (hạ tầng kit đốt lượt
chấm). Kho không viết `ngoai_le` thiếu `khoi` (crm: mọi mục đều có `khoi`) không đi qua đường này.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: trên bản đồ thật của kho thứ hai, bước chấm có thôi báo oan các tệp đã khai rời nhóm, mà vẫn
  chấm chúng theo nhóm thật và không đổi gì ở kho thứ nhất không?
- Thước trước phát hành: kho mẫu dựng lại HÌNH DẠNG bản đồ kho thứ hai — bộ máy trước vá báo, bản vá ra 0; bản sao hai
  kho thật: kho thứ hai 10 · 6 → 0 · 0, kho thứ nhất đầu ra bằng hệt.
- Kết quả nào là SỐNG: onehub-quy-hang cài mốc có bản vá, khai `executors.design.khuon`, và vòng giao diện đầu tiên chạm
  màn thật có eval khuôn xanh mà không thêm dòng nào vào bản đồ.
- Kết quả nào là CHẾT: sau khi cài, kho vẫn phải đổi cách khai (thêm `khoi` giả, tách nhóm trang tạm) chỉ để bước chấm im.
- Mốc gốc (đo 03/11 trên bản sao): kho thứ hai 10 lệch · 6 nợ cũ (base trước bản đồ), 6 · 3 (30 commit trước); kho thứ
  nhất 0 · 0 (nhóm «không đọc được ở đây»).
- Timebox: trước khi onehub-quy-hang nâng `KIT_TAG` cho đợt `dau-khach-nhap`.

## Cổng 0

- **decision = build** (Phan Le Manh, 03/11 — «Cắt trước»: cắt 2.37.0 như đang có, V0 đi mốc kế; CHANGELOG 2.37.0 đã
  khai giới hạn ở «Ai bị ảnh hưởng») hạng T2: chạm `scripts/ban-do-khuon.cjs`, chú thích ở
  `scripts/design-floor-khuon.mjs`, khuôn tệp, GUIDE §5.2 và bộ kiểm khuôn.
- **disposition = …** Không có prototype.
- **Không phải CỘNG:** khuôn tệp đã cho viết `ngoai_le` thiếu `khoi` (bộ đọc nhận, không sai lược đồ) mà vật đọc sai —
  cùng lớp với ba lỗi của `khuon-doc-ban-do-that`. Không thêm khoá, không thêm cổng.
- **Luật chiều rộng (b):** không phải vòng meta — bản vá có neo ngoài ở kho tiêu thụ chờ nhận mốc.
