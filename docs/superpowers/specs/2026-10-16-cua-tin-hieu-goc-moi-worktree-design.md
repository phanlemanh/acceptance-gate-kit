# Cửa tín hiệu một gốc cho mọi worktree — thiết kế (hàng RM3b)

Hồ sơ `_acceptance/cua-tin-hieu-goc-moi-worktree/` · T2 · chủ kho ký Cổng Đáng 16/10 · vòng sửa của RM3
(`cua-tin-hieu-giua-chien-dich`). Bằng chứng lỗi: `_acceptance/cua-tin-hieu-goc-moi-worktree/repro/` (main 66951212).

## 1. Một phút

Ba bên chạm thư mục nguồn của cửa tín hiệu giải gốc khác nhau:

| Bên | Hôm nay giải nguồn theo | Sau vòng |
|---|---|---|
| Thợ qua đợt (`phat-lich` → `docCua(goc_kho)`) | thư mục chính của kho (`goc_kho` = `gocKhoChinh` lúc mở đợt) | không đổi |
| Người (`/road-map:gui` → `gui-tin-hieu.mjs --root .`) | gốc của PHIÊN (worktree nếu phiên ở worktree) | thư mục chính |
| Bộ đọc (`tin-hieu.mjs` `docTinHieu` → `--chua-gom`/`--rang`/`--duong`, thẻ khởi động, bản đồ) | gốc của PHIÊN | thư mục chính |

Một bộ giải: `gocKhoChinh` của `dieu-phoi/scripts/dot.mjs` (git common-dir → thư mục cha). Ở thư mục chính và ở CI
(checkout thường) common-dir = `<gốc>/.git` nên kết quả = gốc: **không đổi byte**. Không phải kho git (lỗi git) → rơi về
gốc phiên như cũ.

## 2. Thiết kế

- `scripts/tin-hieu.mjs` thêm `export function gocNguon(root)` — CHỈ khi `git rev-parse --show-toplevel` của gốc bằng chính
  gốc (gốc là đỉnh worktree/kho; thư mục con hay thư mục lồng giữ gốc như cũ) mới gọi `gocKhoChinh(path.resolve(root))` (import từ
  `../dieu-phoi/scripts/dot.mjs`, tệp crm đã chép theo INIT-CI-COPY-LIST), lỗi → `path.resolve(root)`. `docTinHieu`
  giải mỗi nguồn theo `gocNguon(root)` thay cho `root`. Đường tương đối in ra (`tep`, id) không đổi.
- **Chỉ thư mục NGUỒN** đi theo thư mục chính. Bản gom (`tin_hieu.gom`) và cấu hình (`_acceptance/config.yaml`) vẫn đọc theo
  gốc phiên: bản gom là tệp trong git của nhánh — đọc ở thư mục chính thì không thấy bản gom chưa gộp.
- `dieu-phoi/scripts/cua-tin-hieu.mjs` `docCua(gocKho, { gocNguon } = {})`: cấu hình đọc ở `gocKho`, nguồn giải theo
  `gocNguon ?? gocKho`. `phat-lich` gọi như cũ (một đối số) — byte không đổi.
- `scripts/gui-tin-hieu.mjs`: `docCua(root, { gocNguon: gocNguon(root) })`; số thứ tự tính trong thư mục nguồn ở thư mục
  chính; tệp mang `noi_dung.gui_tu` (`worktree` | `thu-muc-chinh`) cho đường đo; dòng in đường tệp tương đối thư mục chính.
- `scripts/start-scan.mjs`: phép lọc «thư mục nguồn chưa có» (`vang`) giải theo `TH.gocNguon(root)`.

## 3. Quét độ phủ (morphological-scan, gọn)

Trục: nơi chạy lệnh (thư mục chính · worktree · không phải git) × bên (người ghi · thợ ghi qua đợt · bộ đọc gom/thẻ/bản
đồ) × trạng thái worktree (sống · đã dọn ép). Chân ngành: [NGÀNH: git-worktree(1)] — `--git-common-dir` là chỗ chung
của mọi worktree; dữ liệu chung đặt ở common-dir hay thư mục chính, không ở cây làm việc riêng.
Core → 6 tiêu chí: ghi từ worktree (AC-1), đọc chéo cùng một tập (AC-2), dọn worktree (AC-3), thư mục chính/CI không đổi
byte (AC-4), một bộ giải (AC-5), không phải git + bản gom theo nhánh (AC-6).
Later: chuyển ý đã nằm sẵn trong worktree (chưa kho nào cài RM3 — không có dữ liệu thật) · commit tệp ý từ worktree.
Never: bộ giải thứ hai; đặt tệp ý vào `.git` (git không theo dõi, công cụ khác không thấy).

## 4. Giới hạn đã khai

- Tệp ý sống ở thư mục chính, chưa theo dõi; phiên gom chạy trong worktree ghi bản gom trong nhánh nhưng không commit được
  tệp ý của thư mục chính — commit tệp ý là việc ở thư mục chính (ngoài vòng).
- Ý đã ghi vào worktree trước bản này (RM3 trên main từ 66951212) không tự chuyển — chưa kho nào cài, nên không có dữ liệu.
