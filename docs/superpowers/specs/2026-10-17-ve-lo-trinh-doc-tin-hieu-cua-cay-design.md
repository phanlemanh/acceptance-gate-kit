# Bộ vẽ lộ trình đọc tín hiệu của cây đang vẽ — design (VA2, vá 2.32.1)

Hồ sơ: `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/` · sự cố: crm-onehub#375 (Mac Studio, 17/10 09:30Z, PR crm #463)
· vòng gốc: `_acceptance/cua-tin-hieu-goc-moi-worktree/` (RM3b, đã ký).

## 1. Chuyện gì xảy ra

RM3b cho mọi bộ đọc cửa tín hiệu đi theo MỘT thư mục nguồn ở thư mục chính của kho (`gocNguon` → `gocKhoChinh`), để ý
gửi từ worktree không mất khi dọn worktree và mọi worktree thấy cùng một tập. «Mọi bộ đọc» gồm cả bộ vẽ trang lộ trình:
`product-map.mjs` → `tin-hieu.mjs duongDi` → `docTinHieu` → `gocNguon`.

Nhưng hai loại bộ đọc trả lời hai câu khác nhau:

| Bộ đọc | Câu nó trả lời | Ai đọc kết quả | Phải phụ thuộc vào |
|---|---|---|---|
| `--chua-gom`, `--duong`, `--rang`, `--cau`, thẻ khởi động, skill gom | «ý nào đang chờ ở kho này, ngay lúc này?» | phiên đang làm việc | hộp ý chung (thư mục chính) — đúng như RM3b |
| bộ vẽ `LO-TRINH.html` (product-map, khởi tạo lộ trình) | «trang commit vào cây này trông thế nào?» | CI `product-map --check` vẽ lại trên bản tải sạch | CHỈ cây đang vẽ — ADR 0007: `--check` là cổng độc lập duy nhất biện minh miễn trừ t1 của trang |

RM3b gộp hai câu làm một. Ở crm, thư mục chính lùi nền (thiếu 6 tín hiệu của #452 đã commit trên nhánh) → trang vẽ
trong worktree `--detach` sạch khác trang CI → `--check` đỏ hai lần. Tái hiện: `repro/tai-hien.sh` (v2.32.0 đỏ, v2.31.0
xanh). Đây chính là Known limit Ngoài-4 của RM3b, nay có ca thật.

## 2. Hướng chọn

Bộ VẼ chỉ đọc tệp tín hiệu **đã theo dõi** (có trong index git) trong **cây đang vẽ**; nội dung đọc từ đĩa của cây ấy.
Mọi bộ đọc tương tác giữ nguyên RM3b.

- Cài đặt: `docTinHieu(root, nguon, { chiTheoDoi })` — cờ bật: thư mục là `<root>/<nguồn>` (không qua `gocNguon`), danh
  sách tệp lấy từ `git -C <root> ls-files -- <nguồn>` giao với tệp `.json` con trực tiếp CÓ trên đĩa. Gốc không phải kho
  git → đọc cả thư mục như trước (không có index để lọc; đúng hành vi 2.31 và 2.32 ở ca này). `duongDi`/`dungDuong`
  chuyển cờ xuống; `product-map.mjs veTrangLoTrinh` là bên DUY NHẤT bật cờ (khởi tạo lộ trình đi qua đúng hàm này).
- Vì sao «đã theo dõi» chứ không chỉ «gốc phiên» (lối A — đọc mọi tệp ở `<gốc phiên>/<nguồn>`, tức quay về 2.31 cho bộ
  vẽ): lối A sửa ca worktree nhưng giữ ca thư mục chính có ý chưa theo dõi — trang vẽ ở đó mang ý CI không có → `--check`
  đỏ. Với kho giữ ý chưa theo dõi theo thiết kế RM3b, lối A đỏ ở MỌI lần vẽ có ý chờ. «Đã theo dõi» đóng cả hai.
- Vì sao đọc nội dung từ đĩa chứ không từ commit: bốn lệnh đóng cổng vẽ trang TRƯỚC commit cùng lượt; tệp ý đã `git add`
  hay đã sửa thì commit cùng trang → CI thấy đúng bản ấy.

## 3. Cân trên mọi kho (luật 26/09)

Đo 17/10 trên máy: trong `~/dev/*` chỉ crm (và bản sao `crm-cam-mo-pr`) khai `tin_hieu`; crm theo dõi tệp ý trong git
(`tin-hieu/crm/.gitkeep` + 7 tệp ý) và chạy `product-map --check` ở CI. Kit không khai cửa.

| Kho | Được | Mất |
|---|---|---|
| không khai `tin_hieu` | — (mã cửa không nạp, trang giống từng byte) | — |
| khai, không worktree, mọi ý đã theo dõi | — (giống từng byte 2.32.0) | — |
| khai, vẽ trong worktree (crm) | trang khớp CI | — |
| khai, có ý chưa theo dõi ở chỗ vẽ | `--check` hết đỏ vì ý chờ | trang không hiện ý chờ tới khi commit — **giới hạn có tên**; ý vẫn hiện ở `--chua-gom`, thẻ khởi động, `/road-map:xem` |
| gốc không phải kho git | — (đọc như cũ) | — |

Hành vi cũ có ai dựa: «trang hiện ý chưa commit» chưa từng đúng ở CI (CI không có tệp ấy) nên không kho nào dựa được
mà vẫn xanh. Đổi phạm vi lời hứa: AC-2 của RM3b kê `product-map.mjs` trong tập «ba gốc bằng nhau» — chân ấy thu lại.
Không sửa hợp đồng đã ký: hợp đồng mới ghi con trỏ thay thế, ca GW-2 bỏ chân product-map kèm chú thích trỏ về đây.

## 4. Phép đo

Tệp ca `tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs` (ca `VT-<n>` = AC-n). Kho thử, worktree, bản tải sạch
(`git clone --no-hardlinks` ở sha đã commit — hình dạng CI) do code sinh trong lượt. «Bộ máy gốc» = `git archive
<goc-so> …` với `goc-so` = v2.32.0 (f7d95695). Ca đỏ chạy chính hàm ca trên bản sao vật có nhát tiêm khớp đúng một lần,
sau khi bản lành xanh trên cùng fixture, và ghim thông điệp.

## 5. Ngoài phạm vi

- Bộ đọc tương tác (`--chua-gom`, `--duong`, `--rang`, `--cau`, thẻ khởi động, `/road-map:xem`, skill gom) — giữ RM3b.
- Tự commit ý cho người, hay nhắc «có N ý chờ chưa lên trang» trên trang — trang là vật commit, không mang trạng thái máy.
- Sửa lối lách tạm ở crm — crm tự bỏ khi nhận 2.32.1.
