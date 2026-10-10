# DP2 `dieu-phoi-mo-dot-mot-lenh` — thiết kế thi công

Gốc: hàng DP2 của lộ trình kit (`docs/plans/lo-trinh-kit.json`) · ô dù
[`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md) (Cổng Đáng build
09/10, phủ DP1–DP4 — spec ô dù §3) · **thiết kế chung đã duyệt 10/10:**
[workflow 2026-10-10](2026-10-10-dieu-phoi-workflow-design.md) §3, §4.1, §4.4, §4.6, §9, §13, §14, §15, §16 (T6,
T8, T14, T15, T16).

Tài liệu này KHÔNG mở thiết kế lại. Nó chốt chi tiết thi công trong khung đã duyệt: tệp nào, hàm nào, khuôn
nào, và năm chỗ chọn mà spec để ngỏ (mục 3). Chỗ nào spec đã nói thì tài liệu chỉ trỏ về.

## 1. Việc

Thay sáu bước tay mở đợt (README của gói, mục «Mở đợt») và bốn bước đóng đợt bằng hai lệnh
`/dieu-phoi:mo-dot <tên>`, `/dieu-phoi:dong-dot`, cộng lệnh chỉ đọc `/dieu-phoi:xem`. Kèm theo, đúng phần
§9 giao cho DP2: vòng đời đợt (bốn trạng thái của DP2), khung chẩn đoán, đổi kế hoạch trong đợt (§4.6),
liên kết lộ trình (§14 chỗ nối 1–5), thuật ngữ (§15), và năm việc của §16 (T6, T8, T14, T15, T16).

## 2. Bố cục

```
dieu-phoi/
  commands/mo-dot.md      lệnh người: chẩn đoán → CLI mo → thẻ khởi tạo → (người duyệt) → pha dang-chay,
                          chay → Monitor, lịch 30′, nhóm thanh bên, chip → chẩn đoán lại
  commands/dong-dot.md    lệnh người: thẻ đóng đợt → (người duyệt) → pha dang-dong → dong → dọn phiên
  commands/xem.md         lệnh đọc: CLI xem
  scripts/pha.mjs         MỘT bên viết dieu-khien.json; bảng chuyển trạng thái
  scripts/vai.mjs         bên viết vai.json (DP2 ghi lúc mở; DP3 thêm «nhận vai»)
  scripts/goi-dot.mjs     tìm và đọc gói đợt của kho; ghép LUAT.md
  scripts/nguon-hang.mjs  đọc hàng từ khối dữ liệu `lo-trinh-du-lieu` của LO-TRINH.html (bản chép
                          của bộ đọc docDuLieu — không nạp kit)
  scripts/chan-doan.mjs   khung chẩn đoán {muc, trang_thai, viec}
  scripts/hang.mjs        đổi kế hoạch: day-len · them · nghi
  scripts/the.mjs         dữ liệu thẻ khởi tạo và thẻ đóng đợt (JSON — phiên dịch thành chữ người)
  scripts/dem.mjs         lệnh đếm đợt (T14)
  scripts/may.mjs         khoá s4 CẤP MÁY (T6)
  scripts/mo-hinh.mjs     MỘT hàm dựng mô hình trạng thái đợt; `xem` và bang.html cùng vẽ từ nó (T8)
```

Ngoài gói: `scripts/start-scan.mjs` + `scripts/lo-trinh.mjs` + `commands/start.md` của acceptance-gate
(T8); `CONTEXT.md`, GUIDE §6.6, QUICKSTART (T16, §15); bảng tên lệnh `COMMAND-NAMES` của bản luật ngôn
ngữ mặt người và bộ đọc tiền tố của ca LB1 (để tài liệu nhắc được `/dieu-phoi:…`).

## 3. Năm chỗ chọn mà spec để ngỏ

1. **`mo` không có gói đợt.** Spec §4.1: «thiếu cả hai thì lệnh dừng và nói đúng điều đó». Hồ sơ DP1 đã ký
   lại gọi `mo <tên>` không gói (khuôn trống) trong nhiều ca đo. Chọn: CLI `mo` giữ đường khuôn trống
   (đợt dựng tay, như bản crm: `pha` đi thẳng `dang-chay`, không khoá cấp máy), nhưng ghi `nguon_goi: null`
   vào `dieu-khien.json`; `chan-doan` báo mục `goi-dot` là `thieu` với việc «khai `dieu_phoi.goi_dot`
   hoặc `--goi`». Lệnh người `/dieu-phoi:mo-dot` gọi chẩn đoán TRƯỚC và dừng đúng ở mục đó. Đợt mở từ
   gói đi `pha nhap` và chờ thẻ khởi tạo.
2. **Đợt không có `dieu-khien.json`** (đợt crm dựng bằng bản cũ — fixture `dot-crm-0910` của DP1) đọc là
   `dang-chay`. Đường đọc-cũ, không bắt migrate.
3. **Khoá s4 cấp máy chỉ áp cho đợt mở từ gói** (có `dieu-khien.json` với `nguon_goi`). Đợt dựng tay và đợt
   cũ giữ hành vi cũ. Thư mục khoá máy `~/.claude/dieu-phoi/may/`, đổi được bằng biến
   `DIEU_PHOI_MAY_DIR` (ca đo dùng thư mục tạm). Lý do: 84 ca lõi và các ca DP1 cấp s4 song song trong
   cùng một lượt `node --test`; bật khoá máy cho mọi đợt làm chúng tranh nhau một thư mục chung.
4. **Hàng từ lộ trình chép `slug` và `ma` vào `hang-viec.json` lúc mở**, không chép câu giao. Bộ phát
   lịch cần `slug` mỗi nhịp; đọc lại lộ trình mỗi nhịp là thêm một nguồn chạy được giữa đợt. `ma` là
   khoá nối về lộ trình (chỗ nối 3, 4).
5. **`dong` không đòi `pha dang-dong`.** CLI thấp tầng giữ như cũ (ca DP1 gọi nó từ `nhap`); thứ tự
   «thẻ → `pha dang-dong` → `dong`» nằm ở lệnh người `/dieu-phoi:dong-dot`.

## 4. Tệp trao tay mới (khuôn ở `dieu-phoi/scripts/mau/`, có marker)

| Tệp | Bên viết | Khuôn |
|---|---|---|
| `dieu-khien.json` | `pha.mjs` (gọi từ CLI `mo`, `pha`) | `{pha, nguon_goi, dat_boi, dat_luc, ly_do, lich_su:[{pha, dat_boi, dat_luc, ly_do}]}` |
| `vai.json` | `vai.mjs` (CLI `mo`) | `{giam_sat:{phien, worktree, nhan_luc}, lich_su:[], day:[{id, worktree, phien}]}` |
| gói đợt của kho | người | `dieu-phoi.config.json` · `hang-viec.json` · `LUAT-rieng.md`; khoá `nguon_hang` (tuỳ chọn) trong cấu hình đợt |

Bảng chuyển `pha` của DP2: `nhap → dang-chay` · `dang-chay ↔ tam-dung` · `dang-chay | tam-dung → dang-dong`.
Chuyển ngoài bảng → từ chối, nêu «từ → sang». DP4 thêm hai trạng thái ★ vào CÙNG bảng.

Bộ phát lịch đọc `pha` mỗi nhịp: `dang-chay` cấp như cũ; `nhap`, `tam-dung` không cấp gì; `dang-dong` chỉ
cấp `merge` (hoàn tất merge dở). `trang-thai.json` thêm khoá `pha`.

## 5. Đo

Ca của hàng sống ở `tests/dieu-phoi/mo-dot.test.mjs` (tên ca «DP2-…»), kho thử do mã sinh, đường suy từ
vị trí tệp. Mỗi phép đo mới có cặp hai chiều trên cùng fixture. Bộ đọc khối lộ trình có ca round-trip:
`lo-trinh.mjs` thật của kit dựng trang, bộ đọc của gói đọc lại. Suite DP1 (118 ca) phải xanh nguyên.
