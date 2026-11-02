# Thiết kế: khuon-doc-ban-do-that — bước chấm khuôn đọc đúng bản đồ thật

Gốc: `crm/_acceptance/khung-chung-ngan-ban-ghi/` (BK1 đã ký) · vật vừa giao: `_acceptance/khuon-loi/` (PR #475).
Ô cơ hội: `_acceptance/khuon-doc-ban-do-that/opportunity.md` (chủ kho «Vá trước», 02/11).

## 1. Chuyện gì xảy ra

Phiên kit 02/11 cho bộ đọc và bước chấm vừa gộp đọc tệp bản đồ thật của crm, chỉ đọc, rồi giả lập trên một bản sao dùng
một lần. Ba chỗ nói sai, cả ba nằm ở tầng kit vì khuôn tệp kit đã cho phép đúng cách viết đó:

| # | Khuôn tệp kit nói | Vật làm | Hệ quả |
|---|---|---|---|
| 1 | YAML «dạng một dòng `{…}` `[…]` đều được»; `ngoai_le[{tep, khoi, ly_do}]` | `String(['A','B'])` → `"A,B"`, bước chấm so `e.khoi === x.khoi` | ngoại lệ dạng danh sách không bao giờ được miễn |
| 2 | `lop_trinh_bay` nằm trong «mở rộng có tên» | bộ đọc không giữ, bước chấm chỉ nhận `khuon.ten` | tệp dựng qua lớp trình bày đã khai bị báo «khuôn <ten>» |
| 3 | «thêm `tep: [glob]`» | cùng câu trên thẻ JSON; dòng `--kiem` không có lời nhắc nào | người đặt `tep:` cấp đầu, bước chấm vẫn «không đo được» |

Kho không khai `design/patterns/` không đi qua đường nào trong ba chỗ (bước chấm trả `null` trước khi đọc nhóm).

## 2. Lựa chọn

**L1 — ngoại lệ dạng danh sách tách thành nhiều mục, mỗi mục một khối.** `khoi: [A, B]` đọc thành hai mục `{tep, khoi:
A, ly_do}` và `{tep, khoi: B, ly_do}` — bằng hệt khi viết hai mục riêng. Không giữ `khoi` là mảng: lint của kho đọc JSON
của `ban-do-khuon.cjs --json` và hôm nay nhận `khoi` là chuỗi; giữ chuỗi thì không kho nào phải đổi bộ lint (bộ đọc
riêng của crm cũng tách đúng kiểu này). Danh sách rỗng → không mục nào (như hôm nay `khoi` rỗng không khớp gì).

**L2 — lớp trình bày đã khai được tính là dựng khuôn (câu hỏi cho người ở Cổng Phạm vi — khuyến nghị của máy).** Đọc `khuon.lop_trinh_bay` (chỗ crm viết) VÀ khoá cấp đầu
`lop_trinh_bay` (chỗ khuôn tệp liệt), chuỗi hay danh sách, hợp thành `khuon.lop_trinh_bay: string[]`. Ở bước chấm, mọi
chỗ dò «tệp có dựng khuôn» và «thẻ khuôn có đủ khe» nhận `khuon.ten` HOẶC một tên lớp trình bày, cùng luật nhập (tên gốc,
`as`, mặc định, `ns.X`). Khuôn tệp nói rõ nghĩa: «tên thành phần mà khuôn bọc; tệp dựng thẳng thành phần ấy được tính là
theo khuôn». Đánh đổi: một tệp lẽ ra phải dựng khuôn đầy đủ mà dựng thẳng lớp trình bày sẽ không bị bắt — kho nào cần
bắt thì không khai `lop_trinh_bay`, hoặc đưa tên ấy vào `cam_ngoai_khuon` (bước chấm vẫn đếm khối cấm như cũ).

**L3 — lời nhắc chỉ đúng chỗ.** Hằng `KHONG_DOC_SO_DANG_KY` nói «thêm `nhan_dien.tep: [glob]`»; dòng `--kiem` in trọn
nhãn của nhóm thay vì cắt còn «nhan_dien dạng sổ đăng ký»; khoá cấp đầu `tep` thay cờ «khoá lạ: tep» bằng cờ vàng nói
glob tệp đặt ở `nhan_dien.tep`. Không tự đọc `tep` cấp đầu như glob: hai chỗ cùng nghĩa là hai bản phải giữ khớp.

## 3. Không làm (và vì sao)

- **Đọc sổ đăng ký `kind`** — cách viết này hôm nay chỉ một kho dùng; dạy kit đọc nó là neo vào từ vựng của một kho
  (luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»). Giữ nhãn «không đọc được ở đây».
- **`doi_tuong` viết dạng danh sách bị nối thành chuỗi** — bước chấm không dùng khoá này; bộ lint đọc JSON nhận chuỗi
  như hôm nay. Ghi Out of scope.
- **Ngoài-13, Ngoài-14 của `khuon-loi`** — đã thành hạt giống `docs/plans/2026-11-02-hat-giong-khuon-cham-sau-ky.md`.

## 4. Đo

Tệp ca mới `tests/scripts/khuon-doc-ban-do-that.test.mjs` (mã ca `KD-`), dùng lại bộ dựng kho mẫu
`tests/scripts/khuon-loi-kho-mau.mjs`. Ca đầu-cuối dựng một kho mẫu theo HÌNH DẠNG tệp bản đồ crm — sổ đăng ký kèm
`nhan_dien.tep` hẹp, `khuon.lop_trinh_bay`, `thay_cho`, `cam_ho`, ngoại lệ dạng danh sách — với tên tệp và tên khối GIẢ
(kho kit công khai). Mỗi ca đỏ chạy chính hàm kiểm trên bản sao trọn `scripts/` + `lib/` bị tiêm đúng một nhát, sau
khi bản lành xanh; ghim thông điệp. Bộ `KL-*` của `khuon-loi` phải xanh nguyên (suite).

## 5. Số SAU trên tệp thật của crm

Đo 02/11 trên bản sao dùng một lần của crm `onehub` ở `1d55430a` — đỉnh nhánh lúc clone, cha thứ nhất của nó là
`7341a193` mà ô cơ hội ghi. TRƯỚC (kit `main`, `git archive main scripts lib`) và SAU (cây nhánh này) chạy trên CÙNG bản
sao, cùng commit giả lập `nhan_dien.tep`, nên so được. Lệnh: `design-floor-khuon.mjs --root . --kiem --base <base>`.
Tên tệp crm không chép sang kho công khai.

| Cấu hình glob | base | TRƯỚC | SAU |
|---|---|---|---|
| hẹp — chỉ tệp ngăn (9 tệp) | 30 commit trước | thoát 0 · lệch 0 · nợ cũ 1 | thoát 0 · lệch 0 · nợ cũ **0** |
| hẹp | trước khi có bản đồ | thoát 0 · nợ cũ 1 | thoát 0 · nợ cũ **0** |
| cả thư mục | 30 commit trước | thoát 1 · lệch 2 · nợ cũ 8 | thoát 1 · lệch 2 · nợ cũ **5** |
| cả thư mục | trước khi có bản đồ | thoát 0 · nợ cũ 4 | thoát 0 · nợ cũ **3** |

Ba dòng biến mất ở cấu hình cả thư mục: một ngăn dựng thẳng lớp trình bày đã khai (lỗi 2) và hai khối của một tệp đã khai
ngoại lệ dạng danh sách (lỗi 1). Bảy dòng còn lại đều nằm ở năm tệp phụ KHÔNG phải ngăn (khối con, phần dùng chung, tệp
`.ts` không dựng giao diện) — glob cả thư mục kéo chúng vào nhóm; đó là phạm vi glob của kho, không phải báo oan của bước
chấm, và glob hẹp là cách khai đúng. Kết luận: với glob hẹp, bước chấm trên tệp bản đồ thật của crm im hoàn toàn.

## Đặc tả UX

Bỏ — vòng không chạm màn hình người dùng cuối (dòng sổ `descope`).
