# `dieu-phoi-sua-truoc-dot-thu` — năm lỗi của gói dieu-phoi chặn đợt thử

Gốc: ô dù [`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md) (Cổng
Đáng build 09/10, timebox 07/11) · lượt rà hạt giống trước đợt thử của phiên Điều phối M5 (11/10): sáu lỗ
CHẶN-THỬ, vòng này nhận năm (lỗ thứ sáu G0 là lõi DP6, đang ở vòng riêng) · hạt giống:
[tiep-tuc sau DP3](../../plans/2026-10-11-hat-giong-tiep-tuc-dieu-phoi-sau-dp3.md) lỗ 1 (D1) và lỗ 4 (D4) ·
[mo-dot sau DP2](../../plans/2026-10-10-hat-giong-mo-dot-dieu-phoi-sau-dp2.md) lỗ 1 (B1) · hồ sơ DP4
`dieu-phoi-doi-tai-khoan` (đã ký, chờ gộp) Ngoài-1 (E1) và Ngoài-2 (E2), ghi ở hạt giống
`docs/plans/2026-10-11-hat-giong-ban-giao-tai-khoan-sau-dp4.md` trên nhánh DP4.

Tài liệu này không mở lại thiết kế của DP2, DP3, DP4. Năm lỗi đều là chỗ hồ sơ đã ký hứa một điều mà vật làm
khác, nên máy sửa vật. Phần dưới chốt cách sửa và những chỗ phải chọn.

## 1. Việc

| Mã | Lỗi | Hỏng gì trong đợt thử (crm ~26/10, OneFlow ~27/10) |
|---|---|---|
| D4 | `chan-doan` xếp mọi dãy `mo-chip` vào `thieu` (`chan-doan.mjs` dòng 92); bước 7 của `mo-dot` bảo «còn thiếu thì làm tiếp» | Mỗi lần mở đợt, phiên mở chip LẦN HAI cho mọi dãy. Bấm cả hai chip là hai thợ trên một worktree |
| D1 | `slugKe` (`tiep-tuc.mjs:43`) rơi về hàng ưu tiên đầu khi `tiep/<dãy>.json` hết hàng, và không xét `nghi` | `/dieu-phoi:tiep-tuc` mời mở chip làm lại hàng đã gộp, hay mở chip cho dãy đã nghỉ |
| B1 | `chonHangKe` (`lich.mjs:49`) không đọc `decision` của ô hàng; thẻ chỉ cảnh báo (`the.mjs:53`) | Hàng chưa có chữ `build`, hay đã park/kill, vẫn được giao. Thợ (gác DP7) báo giám sát rồi dừng, nhưng dãy kẹt mãi ở hàng ấy |
| E2 | Bước 6 của `mo-dot` dựng lịch 30′ chỉ đọc `trang-thai.json`; chỉ `tiep-tuc` bước 3 gọi `get_usage` → `han-muc` → `danh-thuc` | Đợt mở bằng `mo-dot` không bao giờ bàn giao chủ động khi gần hết hạn mức |
| E1 | Thẻ khởi tạo thêm `khau-vi-han-muc` vào `hoi` khi cấu hình có `han_muc` (khuôn luôn có), mà không lệnh nào ghi câu trả lời | Mỗi đợt một câu hỏi vô ích — trạm thu phí, không phải điểm quyết định |

Thứ tự: D4, D1, B1 làm ngay trên `main`. E2, E1 sống trong mã của DP4, nên làm sau khi Điều phối báo DP4 đã vào
`main`: gộp `main` vào nhánh vòng bằng merge, rồi làm. Một lượt S4 cho cả năm.

## 2. Năm chỗ chọn

**Chỗ 1 — D4: dãy `mo-chip` là `du` («chờ người bấm chip»), không thêm trạng thái mới.** DP2-AC-6 khoá tập
trạng thái chẩn đoán ở `{du, thieu, khong-ap}` (ca DP2-06 kiểm từng mục). `thieu` nghĩa là «phiên còn việc phải
làm»; với dãy `mo-chip`, việc của phiên là mở chip, làm MỘT lần ở bước 6 (`mo-dot`) hay bước 4 (`tiep-tuc`).
Sau đó chỉ còn người bấm, và không lệnh nào của phiên làm thay được. Bảng hành động → trạng thái chẩn đoán là
một hằng đặt cạnh `HANH_DONG` trong `tiep-tuc.mjs`, nên chẩn đoán và kế hoạch dãy đọc cùng một nguồn. Bước 6 của
`mo-dot` mở chip đúng cho các dãy mà `chan-doan --chi-tiet` trả `mo-chip`, dùng nguyên văn `ghi_danh` (như bước
4 của `tiep-tuc`). Bước 7 đếm k từ chính các mục ấy.

- Loại (a): thêm trạng thái `cho-bam`. Làm vỡ DP2-AC-6.
- Loại (b): lệnh con mới ghi «chip đã mở» vào thư mục đợt. Đây là CỘNG, cần chủ kho phê. Nó cũng không biết
  chip đã được bấm hay bị bỏ qua.
- Giới hạn còn lại: máy không phân biệt «chip chưa mở» với «chip đã mở, chưa bấm». Một phiên MỚI gọi lại `mo-dot`
  trên đợt đang chạy thì bước 1 đưa nó về bước 6 và nó mở chip lại. Đây đúng là giới hạn `tiep-tuc` đã có từ DP3
  (mở chip cho mọi dãy không phiên sống).
- `nhan-giang-lai` giữ `thieu`: dạng `--nhe` không có bước 4, nên nó nhắn lại dãy ở bước 5 qua đúng mục này.

**Chỗ 2 — D1: bên đọc của `tiep/` đặt một chỗ, cạnh bên viết.** Hàm `hangKeTuTiep(tiep, hangViec, id)` ở
`lich.mjs`, cạnh `chonHangKe` (hàm sinh `ke` mà bộ phát lịch ghi vào `tiep/`), trả `{hang}` hoặc
`{hang: null, ly_do}`:

- dãy `nghi: true` → `ly_do: nghi`;
- có `tiep` → `tiep.hang`, hoặc `ly_do` là `xong` hay giá trị `cho` của nó;
- `tiep` vắng (bộ phát lịch chưa chạy nhịp nào) → hàng ưu tiên đầu, như cũ. Nhịp đầu chạy ngay khi `chay` khởi
  động bộ phát lịch, nên khe này chỉ dài vài giây sau khi mở đợt.

Dãy không có hàng nhận hành động thứ bảy `khong-hang` (chẩn đoán `du`): không mở chip, lệnh người nói một dòng
lý do. Hàm này đặt ở `lich.mjs` vì DP4 xoá `slugKe` và chép đúng lối rơi ấy vào `slugCuaDay` của `muc-day.mjs`.
Sau khi gộp DP4, `slugCuaDay` gọi cùng hàm, nên `ban-giao.json` cũng thôi ghi slug của hàng đã gộp.

- Loại: mở chip «hỏi giám sát» cho dãy đang chờ. Tốn một lần bấm, và thợ ngồi không. Ở S0, khối TRONG-DOT không
  xét `viec_ke`, nên thợ còn có thể làm trước một hàng đang chờ phụ thuộc.
- Giới hạn: dãy đang chờ khi có hàng thì không tự được mời chip. Lời mời chỉ có ở `tiep-tuc` dạng đủ (dạng
  `--nhe` không mở chip). Trước vòng này cũng không có lời mời nào đúng cho ca ấy.

**Chỗ 3 — B1: lọc ở điểm giao, đọc quyết bằng nguồn của thẻ.** `chonHangKe` nhận thêm một bảng quyết
`slug → da-quyet | cho | khong-build` (vắng bảng thì như cũ). Bộ phát lịch dựng bảng ở mỗi nhịp bằng `quyetCua`
của `tho.mjs`. Hàm này tìm ô hay hồ sơ ở worktree của dãy trước, rồi ở kho chính, qua `trangThaiQuyet` của
`the.mjs`. Thế là thẻ khởi tạo, thợ DP7 và bộ phát lịch đọc quyết từ cùng một hàm. Luật chọn:

- hàng `chua` chỉ được giao khi `da-quyet`. Hàng không mang mã, và hàng đã có `contract.md`, là đã quyết (luật
  của DP7);
- hàng `cho` (chưa có chữ `build`) bị bỏ qua, và hàng đã quyết kế tiếp được giao;
- không còn hàng giao được mà còn hàng chờ chữ `build` → `{hang: null, cho: 'cong-dang'}`;
- hàng `khong-build` không tính là «còn việc», nên dãy chỉ còn hàng park thì `xong`.

Không lọc ở `mo`: ô của hàng chờ được mở ở bước 3 và nhận chữ `build` ở bước 4, tức là SAU `mo`, và quyết còn
đổi trong đợt. Gác `bao-giam-sat` của thợ DP7 giữ nguyên, nay làm lưới cho ca quyết đổi sau khi nhịp đã ghi
`tiep/`.

**Chỗ 4 — E2: một khuôn lịch 30′ cho hai lệnh.** Việc mỗi lần lịch chạy đặt trong khối marker `LICH-30`, chép ở
cả `tiep-tuc.md` lẫn `mo-dot.md`. Lý do phải chép: lệnh người là prompt riêng, phiên chạy `mo-dot` không đọc
`tiep-tuc.md`. Một ca rút hai khối và so byte-bằng.

**Chỗ 5 — E1: TRỪ câu hỏi.** Bỏ `khau-vi-han-muc` khỏi `hoi`. Thẻ giữ trường `han_muc`; bước 3 của `mo-dot` in
ngưỡng thành một dòng thông tin, kèm chỗ sửa (`dieu-phoi.config.json` của gói đợt). Việc này đảo vế ấy của
DP4-AC-4. Ở Cổng Bằng chứng của DP4, chủ kho đã định tuyến chính lỗ này là «mở hợp đồng mới» (Ngoài-1).

## 3. Ca đã ký phải đổi thân

Một số ca đang ghim chính lỗi, nên sửa vật thì các ca ấy phải đổi theo. Danh sách đo được ở S0:

- `DP3-03 ma-tran`: dòng kiểm `c.muc.trang_thai === 'thieu'` thành `'du'` (D4). Chữ DP3-AC-3 không nói
  trạng thái.
- `DP7-03 ma-tran`: năm hàng `vang`, `discovery`, `park`, `kill`, `iterate` dựng ô `build` trước nhịp và đổi ô
  sau nhịp (B1). Chữ DP7-AC-3 giữ nguyên, vì nó đo `tho`, không đo nhịp.
- `DP2-07 ap-nhip-ke`: thêm ô `build` cho ba hàng của đợt thử (B1).
- Sau khi gộp DP4: `DP4-04 the-khoi-tao`, và danh sách `hoi` của ca thẻ trong `mo-dot.test.mjs` (E1).

Mỗi ca bị đổi có một dòng sổ `fix` nêu đúng tên. Ca `SDT-07` so danh sách tên đổi thân với sổ. Mốc so: nếu
lịch sử HEAD có commit gộp PR của nhánh vòng («Merge pull request #<n> from <chủ>/vong/dieu-phoi-sua-truoc-dot-thu»)
thì so từ điểm rẽ của hai cha tới cha-2 (khuôn neo lịch sử của DP7-10); nếu không thì so từ
`merge-base HEAD origin/main` tới HEAD. Commit gộp `main` VÀO nhánh (bước chờ DP4) không bao giờ được chọn làm
mốc — nếu chọn nó thì danh sách sẽ thành các ca DP4 đổ vào. Bộ chọn mốc có ca riêng trên kho git tạm cho cả hai
chiều gộp (phản biện F1). Danh sách thật chốt ở S3, sau khi chạy trọn bộ ca.

## 4. Ngoài phạm vi

- Lớp mod (DP6b), lõi DP6 (G0), vai cấp máy.
- Các lỗ còn lại của hai hạt giống (DP3 Ngoài-2, Ngoài-6; DP2 Ngoài-3, -4, -16, -17, -19), và DP4 Ngoài-3,
  Ngoài-11.
- `slugKeCua` của `ghi.mjs` (gắn slug vào đơn xin của thợ): bản chép thứ ba của lối rơi, đã ghi Known limits ở
  DP3 (Ngoài-4). Nó chỉ dùng để xếp hạng đơn, không mời mở chip.
