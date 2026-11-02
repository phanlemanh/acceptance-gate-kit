---
schema_version: 1
slug: khuon-doc-ban-do-that
feature: "Bước chấm khuôn đọc đúng bản đồ thật của kho đã khai: ngoại lệ viết dạng danh sách được miễn, tệp dựng qua lớp trình bày đã khai được tính là theo khuôn, và lời nhắc chỗ đặt glob nói đúng chỗ"
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-11-02T04:28:36Z   # chủ kho gõ «Vá trước» ở phiên kit Mac Studio, trả lời «Vá ba lỗi của kit trước khi cắt 2.37.0?»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/khung-chung-ngan-ban-ghi/ — BK1 đã ký, dựng tệp bản đồ `design/patterns/ngan-ban-ghi.md` mà
phiên kit 02/11 cho bộ đọc vừa gộp ở 2.37.0 (`scripts/ban-do-khuon.cjs`, PR #475, hồ sơ `_acceptance/khuon-loi/`) đọc
thử trên `onehub` `7341a193`.

Kho đã khai bản đồ khuôn cài 2.37.0 sẽ gặp ba chỗ bước chấm nói sai, đo được trên tệp thật của kho thứ nhất:

- **Ngoại lệ viết dạng danh sách không bao giờ được miễn.** Sáu dòng `ngoai_le` của crm viết `khoi: [Skeleton,
  VungTaiLoi]` — dạng một dòng mà khuôn tệp của kit cho phép. Bộ đọc nối danh sách thành `"Skeleton,VungTaiLoi"`, bước
  chấm so bằng phép bằng nhau, nên khối đã khai ngoại lệ vẫn bị đếm là nợ cũ hay lệch. Bộ đọc riêng của crm (bộ lint
  của kho) tách danh sách — hai bộ đọc cho hai kết quả trên cùng tệp.
- **Tệp dựng qua lớp trình bày bị báo ngoài khuôn.** Khuôn tệp liệt `lop_trinh_bay` trong «mở rộng có tên»; crm khai
  `khuon.lop_trinh_bay: <lớp trình bày>`, và một ngăn dựng thẳng bằng lớp trình bày ấy. Bước chấm chỉ nhận `khuon.ten`
  nên báo tệp ấy thiếu khuôn — báo oan duy nhất còn lại khi crm khai glob hẹp chỉ gồm tệp ngăn.
- **Lời nhắc chỗ đặt glob mơ hồ.** Nhóm khai bằng sổ đăng ký nhận nhãn «thêm tep: [glob]»; phiên kit đặt `tep:` ngang
  hàng với `nhan_dien` và bước chấm vẫn báo «không đo được». Chỗ đúng là `nhan_dien.tep`.

Người gặp: chủ kho và đội sản phẩm ở mọi kho đã khai bản đồ khuôn (crm nhận trước, onehub-quy-hang nhận tính kết quả của
mốc). Kho không khai `design/patterns/` không chạm đường nào trong ba chỗ trên.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: trên bản đồ thật của crm (bản chụp trong bộ kiểm kit), bước chấm có miễn đúng các ngoại lệ
  đã khai và nhận đúng lớp trình bày không?
- Thước trước phát hành: trên một kho mẫu dựng lại hình dạng tệp crm (ngoại lệ dạng danh sách, lớp trình bày, nhóm sổ
  đăng ký có `nhan_dien.tep`), bước chấm ra 0 lệch và 0 nợ cũ cho các khối đã khai; gỡ một tên khỏi danh sách ngoại lệ
  thì đỏ đúng tệp và khối đó; chỉ khai lớp trình bày mà tệp dựng tên khác thì vẫn đỏ.
- Kết quả nào là SỐNG: crm cài 2.37.0, khai `nhan_dien.tep` hẹp, và bước chấm trên một vòng ngăn bản ghi thật ra 0 báo
  oan.
- Kết quả nào là CHẾT: sau khi crm cài 2.37.0 vẫn phải thêm ngoại lệ hay đổi mã chỉ để bước chấm im — tức kit buộc kho
  viết lại bản đồ theo bộ đọc của kit.
- Mốc gốc (đo 02/11 trên bản sao crm, glob hẹp chỉ gồm chín tệp ngăn): 1 báo oan (một ngăn dựng qua lớp trình bày);
  glob cả thư mục ngăn: 2 lệch + 8 nợ cũ, trong đó 2 khối của một tệp đã khai ngoại lệ dạng danh sách.
- Timebox: 2026-11-04 (mốc Phát hành 2.37.0).

## Cổng 0

- **decision = build** (Phan Le Manh, 02/11 — «Vá trước», trả lời «Vá ba lỗi của kit trước khi cắt 2.37.0?») hạng T2:
  chỉ chạm `scripts/ban-do-khuon.cjs`, `scripts/design-floor-khuon.mjs`, khuôn tệp và bộ kiểm khuôn.
- **disposition = …** Không có prototype.
- **Không phải CỘNG:** cả ba là sửa vật vừa giao cho khớp khuôn tệp kit đã khai (dạng `[…]` được phép,
  `lop_trinh_bay` là mở rộng có tên, `nhan_dien.tep` là chỗ đúng) — không thêm khoá lược đồ, không thêm cổng.
- **Luật chiều rộng (b):** không mở vòng meta mới — đây là bản vá trong vòng sản phẩm `khuon-loi` của cửa sổ 2.37.0,
  vấp ở dữ liệu thật của kho nhận trước khi cắt mốc.
