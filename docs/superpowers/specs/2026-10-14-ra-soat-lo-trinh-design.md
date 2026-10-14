# Rà soát lộ trình trên thẻ (RM1) — vòng 1 của gói road-map — design

**Ngày:** 2026-10-14 · **Hồ sơ:** `_acceptance/ra-soat-lo-trinh/` · **Hạng:** T2 · **Hàng lộ trình:** RM1 (mốc 05/11)
**Nguồn:** `docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` (B′, chủ kho duyệt 14/10) · ADR 0025 (bổ sung 14/10)
**Đứng trên:** vòng MC1 `moc-la-chien-dich` (nhánh `claude/vibrant-chatterjee-5d468b`, chưa gộp) — cùng tệp `scripts/lo-trinh.mjs`.
**Gốc vòng (bộ máy gốc của mọi ca so):** `1baceb96`.

## 1. Một kết quả

Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm
căn cứ máy đọc. Máy **không** sửa tệp lộ trình, **không** thêm lượt gọi người: đề xuất là cờ trên thẻ đã có.

Đây là lát «chỉ cờ» của B′. Phần máy tự áp (báo trước một nhịp, trần thao tác, bộ ghi, lệnh `ghim`/`tra-lai`)
và phần nối với gói điều phối (chính sách ở thẻ mở đợt, đề xuất của thợ vào cửa tín hiệu) là vòng sau — tài liệu
B′ §8: thiếu bốn ô an toàn thì chỉ chạy chế độ cờ vàng.

## 2. Ràng buộc quyết định hình dạng

**Rà soát KHÔNG vào trang lộ trình.** `LO-TRINH.html` và khối dữ liệu phải tất định — `product-map.mjs --check`
so từng byte ở CI và ở mọi lần đóng cổng. Rà soát phụ thuộc HÔM NAY (mốc đã qua ngày chưa, hàng bao lâu không ai
đụng). Nên nó chỉ hiện ở nơi đã có «hôm nay»: thẻ khởi động (`loTrinhThe` nhận `today`, như `hangTre`) và lệnh
`lo-trinh.mjs --ra-soat`. Hệ quả tốt: khuôn khối dữ liệu không đổi → ứng dụng crm (đọc khối bằng bản chép
`docDuLieu` + bộ kiểm khuôn riêng) không bị chạm.

## 3. Luật đề xuất

Một hàng được xét khi: **chưa giao**, **không** «không suy được». Hàng có hồ sơ **đang mở** (ô thuộc nhóm đang làm /
chưa bắt đầu của bản đồ) → không đụng. Hàng `ghim: true` được miễn hai luật theo thời gian (`tuoi`, `tran`) và không
tính vào K; ba luật sự thật vẫn áp. Một hàng nhận đề xuất của luật ĐẦU khớp theo thứ tự bảng.

| Mã luật | Khi nào | Đề xuất | Căn cứ máy đọc | Cần chính sách? |
|---|---|---|---|---|
| `moc-qua-ngay` | Hàng thuộc **mốc chiến dịch** đã qua ngày, chưa có hồ sơ | `doi-moc` (dời sang mốc kế, hoặc chờ điều kiện) | tên mốc + ngày | Không — sự thật |
| `xep-lai` | Hàng ở trạng thái «Xếp lại sau» — từ hồ sơ, hoặc lời tự khai khi chưa có hồ sơ (cùng luật suy trạng thái kit đang dùng) | `cho-dieu-kien` | nguồn (`ho-so` + slug, hoặc `tu-khai` + chữ khai) | Không |
| `ho-so-bac` | Hồ sơ của hàng ở ô «Đã bác từ khám phá» | `bac` | slug + ô | Không |
| `tuoi` | Hàng «Kế tiếp» (không thuộc mốc chiến dịch nào), chưa có hồ sơ, không ghim, tuổi ≥ `chinh_sach.tuoi_ngay` | `cho-dieu-kien` | tuổi + ngày + sha lần chạm cuối | Có |
| `tran` | Sau mọi đề xuất trên, số hàng «Kế tiếp» chưa có hồ sơ, không ghim, chưa có đề xuất vẫn vượt `chinh_sach.tran_ke_tiep` | `cho-dieu-kien` cho các hàng cũ nhất còn lại tới khi còn đúng trần | K, trần | Có |

**Mốc chiến dịch** = mốc có `loai` vắng hoặc `phat-hanh`. Mốc `ngoai`, `han`, `han-cung`, `su-kien` là việc của
người hay sự kiện ngoài — máy không chứng được nên không kích hoạt rà soát (B′ §8 Core 2).

**Tuổi hàng** (B′ §8 Core 1): số ngày từ lần cuối hàng được CHẠM trong lịch sử git của tệp lộ trình tới hôm nay.
Chạm = đổi bất kỳ trường nào trừ `ma`, hoặc đổi tập mốc chứa hàng. Đổi mã đơn thuần không chạm — danh tính hàng
đi theo câu giao (crm V0–V8 → DA0–DA8 giữ câu giao từng chữ). Đổi CẢ mã lẫn câu giao trong cùng một commit = hàng
mới (giới hạn khai). Tính trên lịch sử tới HEAD; tệp đang sửa chưa commit không tính.

**Chính sách** khai ở đầu tệp lộ trình — `"chinh_sach": {"tuoi_ngay": <nguyên dương>, "tran_ke_tiep": <nguyên ≥ 0>}`;
`"ghim": true` ở cấp hàng. Vắng → chỉ ba luật sự thật chạy. Giá trị sai → một cờ khuôn (trang «Cần sửa») và
không luật chính sách nào chạy (không đoán). Vì sao ở tệp lộ trình (Hỏi-2): tệp là ý định người viết qua PR; thẻ
mở đợt thuộc gói điều phối (vùng máy M5) — vòng sau thẻ ấy đọc/ghi CÙNG khoá này.

**Số đo trước (14/10, bộ máy gốc + luật viết riêng):** crm `d0351bcd` không chính sách → OKR 0 · Kho tài liệu 0 ·
Việc và Dự án 3 (`DA6`, `DA7`, `DA8` tự khai «xếp lại» → chờ điều kiện); hàng «Kế tiếp» chưa có hồ sơ: OKR 16 · Kho tài
liệu 2 · Việc và Dự án 5 — tức giá trị lớn ở crm đến khi kho khai `tran_ke_tiep`/`tuoi_ngay`. Kit: `A3`, `DP8` thuộc
mốc phát hành đã qua ngày mà chưa giao → dời mốc.

## 4. Bề mặt

- **Thẻ khởi động** — mỗi lộ trình có đề xuất thêm, ngay trước dòng «Lộ trình có N cờ» (không cờ thì trước dòng
  trang): một dòng tổng `Rà soát: N đề xuất — a dời mốc · b chờ điều kiện · c bác` và tối đa năm dòng
  `  · <mã> — <đề xuất>: <căn cứ>`, dòng thứ sáu `  … còn k — xem: <lệnh>`. **0 đề xuất → không in gì, không thêm
  khoá JSON**: thẻ của mọi kho không có đề xuất giống từng byte bản trước (luật 26/09 — kho không có sự cố không trả giá).
- **Lệnh** `node scripts/lo-trinh.mjs --root . --ra-soat [--json]` — trọn danh sách, chỉ đọc, thoát 0; kho chưa
  khai lộ trình thoát 1; đi cùng `--hang` thoát 2. JSON và dòng thẻ dựng từ CÙNG một hàm `raSoat`.
- **Gói `road-map`** (Hỏi-1, khuyên dựng ngay): gói thứ năm của marketplace, tag `bat-theo-lua-chon`, cùng số với
  ba gói khoá; một lệnh `/road-map:xem` chạy rà soát của kho hiện tại qua bộ giải gói. Chỉ đọc → KHÔNG thêm vào
  danh sách khoá ADR 0002. Mã vẫn ở lõi.

## 5. Cắt lượt dưới đóng băng (B′ §10)

`cat-luot.mjs` thêm cảnh báo vàng `gan-moc-dang-chay`: hàng của ĐỢT ĐANG CẮT được gắn vào một mốc chiến dịch
**đang chạy** = ngày mốc ≥ hôm nay VÀ mốc đã có ít nhất một hàng ngoài đợt. Gắn vào mốc mới (chỉ hàng của đợt),
mốc đã qua ngày hay mốc người → không cờ. Cảnh báo, không lỗi: skill cắt lượt đã có luật «xử lý hoặc ghi vì sao
vào mô tả PR».

## 6. Chữ «Chờ điều kiện»

Chữ hiển thị cho mục `chan_troi` đổi thành «chờ điều kiện» ở mọi thông báo người đọc của `cat-luot.mjs` và
`lo-trinh.mjs`, skill cắt lượt, khuôn phạm vi / tín hiệu, mục glossary. Khoá `chan_troi` KHÔNG đổi — tệp cũ đọc như
cũ, không ai phải chuyển (luật đổi khuôn: đường đọc-cũ).

## 7. Mã đổi

- `scripts/lo-trinh.mjs`: `raSoat({ cacTep, root, today })`, `tuoiHang(root, tep)` (đọc `git log` của tệp), bộ đọc
  `chinh_sach`/`ghim` trong `kiemKhuon` + cờ khuôn (thêm dòng `CO_DICH`, ca LT-97 tăng một dạng), dòng thẻ trong
  `loTrinhThe`, chế độ CLI `--ra-soat [--json]`. Chữ «chân trời» → «chờ điều kiện» ở thông báo.
- `scripts/cat-luot.mjs`: cờ `gan-moc-dang-chay` (+ `--hom-nay` / `ACCEPTANCE_TODAY`), đổi chữ.
- `scripts/start-scan.mjs`: chuyển `raSoat` qua `loTrinh.ds[]` (chỉ khi khác rỗng); `commands/start.md`: khoá mới.
- `skills/cat-luot/SKILL.md`, khuôn tham chiếu, `CONTEXT.md`: chữ.
- Gói mới `road-map/` (`.claude-plugin/plugin.json`, `commands/xem.md`, `README.md`) + mục marketplace + P200.
- Test: `tests/scripts/ra-soat-lo-trinh.test.mjs` (ca RS-n), `tests/scripts/ra-soat-lo-trinh-crm.mjs` (ngoài suite);
  khoá `executors.test.ra_soat_lo_trinh`, `executors.test.ra_soat_lo_trinh_crm` trong `_acceptance/config.yaml`.

## 8. Không làm (vòng này)

Tự áp + báo trước một nhịp + trần thao tác + bộ ghi · lệnh `ghim`/`bo-ghim`/`tra-lai`/`gui` · chính sách ở thẻ mở đợt
và phân loại yêu cầu của thợ (gói điều phối, vùng M5) · rà soát chính mục «chờ điều kiện» theo `mo_lai_khi` · luật
ưu tiên khi hai luật ngược nhau · `loai` vào khối dữ liệu · bản đồ hiện trạng liên kho.

## 9. Giới hạn đã khai

- Tuổi tính theo lịch sử git tới HEAD — kho clone nông (`--depth`) cho tuổi sai; bộ đọc thấy lịch sử cụt thì in
  một dòng «lịch sử cụt — tuổi tối thiểu».
- Đổi cả mã lẫn câu giao trong một commit = hàng mới.
- Gói `road-map` đọc lõi qua bộ giải (bản mới nhất trên máy) — chỉ đọc nên lệch phiên bản chỉ ảnh hưởng hiển thị;
  vòng có bộ ghi phải gọi bản chép trong kho (B′ §11).
