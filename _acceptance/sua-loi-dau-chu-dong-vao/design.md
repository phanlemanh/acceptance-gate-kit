# Design: sua-loi-dau-chu-dong-vao

Gốc: issue phanlemanh/acceptance-gate-kit#477 (đợt Điều phối – Thợ `dau-chu-dong-vao` của onehub-quy-hang, kit
v2.36.0, 31/10 – 02/11/2026) · lỗi (a) của bộ ba lỗi 3/4 đã báo ở #403 §3 ngày 23/10. Kho chờ nhận: onehub-quy-hang
nâng `KIT_TAG` lên mốc 2.37.0 trước đợt `dau-khach-nhap`.

## Vấn đề

Năm lỗi, mỗi lỗi đã lách tay tại chỗ — mỗi lần lách là một lượt gọi giám sát hay chủ kho:

| # | Lỗi | Tình trạng trên main `6c3b0a4a` |
|---|---|---|
| 1 | `pre-merge-check.sh` đọc `lib/` ở gốc kho → kho cài theo plugin fail-closed mọi hồ sơ máy-thông | đã sửa ở `08505e62`, đã có ca LK1/LK1-do (`tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs`) — chưa phát hành |
| 2 | `sau` trỏ slug của một hàng có `ma` → hàng kẹt «chờ phụ thuộc» mãi | còn nguyên (`lich.mjs` `duPhuThuoc`) |
| 3 | khoá không nhả khi PR đã gộp | còn nguyên — bốn gốc (a)–(d) dưới |
| 4 | đơn `ghim-lai` cấp dưới `khoa/s4` mà thợ canh `khoa/ghim-lai` | còn nguyên — là gốc (a) |
| 5 | người chấm ui-check không biết URL bản dev; ui-check song song dùng chung trình duyệt | còn nguyên (`acceptance-verify.js` khối ui) |

Gốc chung của 3 và 4:
- (a) `TAI_NGUYEN` ánh xạ `ghim-lai` → `s4` (cố ý: lượt ghim lại và lượt chấm cùng nặng, dùng chung một chỗ), nhưng
  `mau/LUAT.md` bảo thợ chờ `khoa/<tài nguyên>` — thợ điền tên loại, canh một thư mục không bao giờ xuất hiện.
- (b) `nhaKhoa` với tên không có khoá trả «không làm gì», thoát 0 → thợ `nha ghim-lai` báo «đã nhả» trong khi
  `khoa/s4` còn.
- (c) `gop` gộp xong không nhả `khoa/merge`; LUAT không dặn nhả.
- (d) `chamNhip` chạm nhịp mọi khoá có worktree chứa cwd ở mỗi lần dùng công cụ → `xetHanThue` gia hạn mãi chừng
  nào thợ còn làm hàng kế trong cùng worktree.

## Hướng sửa — máy giữ, không dặn bằng lời

1. **Lỗi 2** — `duPhuThuoc` tra `ma` trước, rồi tra `slug` bất kể hàng đích có `ma` hay không. `sau` không khớp
   hàng nào → phán quyết KHÔNG đổi (hàng vẫn chờ phụ thuộc) nhưng kết quả mang `sau_khong_co` và lý do chờ đọc ra
   «sau trỏ hàng không có: <hàng>→<chuỗi>» ở `tiep/<dãy>.json` (đọc bởi `tiep-tuc`, `chan-doan`). Cờ vàng, không fail:
   kho cũ có `sau` lệch không đổi phán quyết, chỉ thôi im.
2. **Lỗi 3/4 (a)+(b)** — `nha` và `xin` đi qua MỘT bộ giải `TAI_NGUYEN`: nhận cả tên loại (`ghim-lai`) lẫn tên tài
   nguyên (`s4`). `xin` in lệnh chờ đã giải (`khoa/s4/chu.json` cho `ghim-lai`). `nha <tên lạ>` thoát 1 nêu bảng tên
   hợp lệ, không chạm khoá nào. `nha <tên hợp lệ>` khi khoá vắng giữ hành vi cũ (thoát 0, «không có — không làm gì»):
   khoá đã bị thu hồi thì nhả lại là vô hại. LUAT bảo chép đúng lệnh chờ `xin` in.
3. **Lỗi 3 (c)** — `gop` gộp thành công thì tự nhả `khoa/merge` của dãy, ghi kèm vào sự kiện `gop`. Không gộp (lối
   `cu`, `cho-ci`, `chan`) → khoá giữ nguyên như cũ.
4. **Lỗi 3 (d)** — bộ phát lịch, mỗi nhịp, thu hồi khoá mà hồ sơ `chu.slug` đã gộp trên nhánh chính (đọc bằng
   `daGopTrenNhanhChinh` — một nguồn với tiến độ hàng), bất kể hạn thuê hay nhịp. Sự kiện `thu-hoi` lý do «hồ sơ <slug>
   đã gộp trên nhánh chính», `can_phan: false` (không phải sự cố), và KHÔNG đánh dấu lượt đo là bị thu hồi (sổ hiệu
   chuẩn đọc «thu-hoi» là lượt hỏng). Không đổi `chamNhip`: chạm nhịp vẫn là tín hiệu sống đúng cho khoá chưa gộp.
5. **Lỗi 5** — `s4-args` giải `config:dev_server.url` thành `devServerUrl` khi hồ sơ có eval ui-check (vắng khoá →
   vắng trường, không dừng); workflow tiêm giá trị đó vào lời gọi người chấm ui-check, vắng thì nói thẳng «config
   chưa khai dev_server.url». KHÔNG thêm trường `target` vào eval (đó là CỘNG, cần owner phê). Các eval ui-check chạy
   TUẦN TỰ với nhau (chung một trình duyệt) — khối ui vẫn song song với lệnh máy, hội đồng và review như cũ.
6. **Tham số lớn của lượt chấm** — đã có hạt giống `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md`:
   vòng này chỉ thêm một dòng `Gốc:` trỏ #477 §5, không sửa.
7. **Lỗi 1** — không sửa thêm; eval của vòng chạy lại ca LK1/LK1-do có sẵn để mốc 2.37.0 mang nó.

## Cân trên mọi kho (CLAUDE.md, luật 26/09)

| Sửa | Kho không gặp sự cố được gì / mất gì | Ai dựa vào hành vi cũ? |
|---|---|---|
| tra slug bất kể `ma` | hàng có `sau` theo slug thôi kẹt; hàng theo mã không đổi | không — hành vi cũ là kẹt vĩnh viễn |
| cờ vàng `sau` mồ côi | thêm một dòng lý do; phán quyết không đổi | không |
| `nha`/`xin` qua bộ giải | thợ gõ tên loại cũng nhả/canh đúng; `nha` tên lạ thôi im | thợ gõ tên lạ từng «thành công» — đó là lỗi |
| `gop` tự nhả `merge` | khoá thôi treo sau gộp | thợ từng `nha merge` sau gộp → nay «không có — không làm gì», thoát 0, vô hại |
| thu hồi khi đã gộp | khoá treo sau gộp tự gỡ | không ai cần giữ khoá của hàng đã gộp |
| ui-check tuần tự + URL | lượt chấm nhiều ui-check dài hơn (tuần tự), hết nhiễm chéo | kho một ui-check không đổi thời gian |

## Đặc tả UX

Bỏ — không chạm UI (entry `descope` trong sổ quyết định).
