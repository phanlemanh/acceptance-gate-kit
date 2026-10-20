# Thước sức khoẻ máy của bộ phát lịch đo sai thứ — điều tra hiện trạng (SK1)

Ngày 21/10/2026, phiên SK1 làn Nhóm 3 (MacBook Pro). Đây là SỔ đo, chỉ đọc và đo — không sửa mã.

**Nguồn.** Máy M5 báo trên crm-onehub#375 (20/10 22:42Z): một đợt điều phối của M5 GIẢM TẢI hơn hai
giờ, chặn khoá s4, với lý do duy nhất là swap đã dùng vượt ngưỡng, trong khi áp lực bộ nhớ ở mức bình
thường. Chủ kho 21/10, nguyên văn: «Mở phiên điều tra nếu đúng hiện trạng thì đưa vào lộ trình và xử lý».

**Phạm vi đo.** Mã trên `main` kit tại `b010ecd2`. Máy đo: MacBook Pro (Mac16,6), RAM 36 GB, chạy liền
6 ngày (khởi động 14/10 12:00Z). Số đo của máy M5 (128 GB) là số M5 tự báo — máy này không đo lại được.

## Kết luận một đoạn

**Hiện trạng ĐÚNG.** Thước giảm tải coi «swap đã dùng» là dấu hiệu máy nghẹt, và hàm thật trả *giảm tải*
trên chính máy này lúc 23:48Z 20/10 khi áp lực bộ nhớ ở mức bình thường và còn 46 % bộ nhớ trống — cùng
hình dạng lỗi M5 báo, tái lập trên một máy thứ hai khác cỡ RAM. Đợt crm trên máy này chỉ không vấp vì
ngưỡng đã được nâng tay 8 → 16 GB; M5 cũng nâng tay 8 → 11 GB. Một vế trong lời báo **SAI về chữ**:
swap đã dùng trên macOS *có* giảm (đo được), nhưng giảm rất chậm khi máy rảnh nên kết luận của M5 vẫn
đứng — con số ấy là dấu vết của áp lực đã qua, không phải áp lực bây giờ. Đề xuất vế 1 của M5 với mặc định
16 GB sẽ **chặn máy 36 GB này gần như mọi lúc** — vòng sửa phải đặt ràng buộc «im trên cả hai máy».

## 1. Đối chiếu từng khẳng định

| # | Khẳng định của M5 | Kết luận | Căn cứ |
|---|---|---|---|
| K1 | So swap đã dùng với `swap_gb` → giảm tải | **ĐÚNG** | `dieu-phoi/scripts/suc-khoe.mjs:35` — `if (dung > nguong.swap_gb) lyDo.push(...)`; `giamTai = lyDo.length > 0` ở `:38`. Bộ phát lịch đọc `sysctl vm.swapusage` ở `dieu-phoi/scripts/phat-lich.mjs:411`, chuyển `giamTai` vào `capPhat` ở `:432`, và `capLuot` bỏ mọi làn trừ `merge` ở `dieu-phoi/scripts/lich.mjs:29`. Hành vi này được khoá có chủ đích: ca `tests/dieu-phoi/loi/suc-khoe.test.mjs:36–37` «swap tuyệt đối vượt 8 GB dù tỉ lệ thấp → giảm tải» với áp lực mức 1. Gốc là AC-4 của `crm-onehub/_acceptance/dieu-phoi-hai-tang/contract.md:38` («áp lực ≥ `ap_luc_muc` *hoặc* swap dùng > `swap_gb` → giảm tải»). |
| K1a | «Trên macOS swap đã dùng chỉ tăng, không tự giảm» | **SAI về chữ** | Chuỗi 20″ trên máy này: 12 000,44 → 11 984,44 MB lúc 23:49:10Z, không có swapout nào trong khoảng đó (swapouts đứng 6 739 543), swapins tăng 4 101 040 → 4 101 600. Nhân cũng xoá tệp swap: `/System/Volumes/VM` còn 13 tệp nhưng chỉ số chạy tới 15 — khuyết `swapfile2`, `swapfile6`, `swapfile13`. |
| K1b | → «đỏ khi máy khoẻ» (không đặc hiệu) | **ĐÚNG** | Chạy `danhGiaSucKhoe` thật với số đo sống và mẫu `dieu-phoi/scripts/mau/dieu-phoi.config.json:6` (`swap_gb` 8) lúc 23:48:39Z: `giamTai: true`, `lyDo: ["swap 11.7/13.0 GB"]`, áp lực mức 1, `memorystatus_level` 46 %, load 4,27. Swap giảm 16 MB trong 2 phút — tốc độ ấy cần nhiều ngày để về dưới 8 GB, nên một máy từng nghẹt sẽ đứng ở giảm tải lâu sau khi hết nghẹt. |
| K2 | RSS một tiến trình > `rss_gb` → «cần người» | **ĐÚNG về cơ chế** | `suc-khoe.mjs:37` lấy tiến trình RSS lớn nhất bất kỳ (`ps -axo rss=,comm=`, `phat-lich.mjs:414`) rồi `phat-lich.mjs:420` ghi sự kiện `can-nguoi` gửi owner, `can_phan: true`. Nó không chặn cấp làn, nhưng là một lượt gọi người. Nó không đo chỗ làn cần — đúng như M5 nói. |
| K2a | Tiến trình đó «có thể là model hợp lệ» | **CHƯA CHỨNG trên máy này** | Trong 34 giờ đợt crm trên MacBook Pro (19/10 13:12Z → 20/10 23:36Z) chỉ có **1** sự kiện `can-nguoi` vì RSS: một tiện ích dọn máy giữ 10,2 GB — một rò thật, đáng báo. Máy M5 chủ model với 56 GB wired (M5 tự báo) thì khả năng báo nhầm cao hơn, nhưng máy này không đo được. |
| K3 | Ngưỡng 8 GB chưa hiệu chuẩn | **ĐÚNG** | Hai ca có nguồn trong `suc-khoe.test.mjs`: ca 04/10 (`:16`, swap 22,3/24 GB *cùng* áp lực 4 — riêng áp lực đã đủ giảm tải) và ca 05/10 (`:23`, báo động giả). Ca duy nhất bắt swap *một mình* giảm tải (`:36`) là số tổng hợp, không trỏ lượt nào bị hạ tầng đốt. Cả hai máy đã chỉnh tay khỏi mặc định: đợt crm trên MacBook Pro đặt `swap_gb` 16, M5 đặt 11. |
| K4 | Số đo máy M5 lúc sự cố (level 48 %, áp lực 1, trống 15,4 GB, swapouts 662k / swapins 27k) | **CHƯA CHỨNG** (máy khác) | Không đo lại được từ đây. Hình dạng được tái lập ở K1b trên máy thứ hai. |

## 2. Đề xuất ba vế của M5 — đo trước khi dựng

- **Vế 1 (cấp làn khi `level × RAM ≥ đỉnh_làn × 1,5` VÀ áp lực mức 1, mặc định `đỉnh_làn` 16 GB).** Trên
  máy này: 36 GB × 46 % = 16,6 GB < 16 × 1,5 = 24 GB → **chặn**. Trong 10 phút đo, `memorystatus_level`
  dao động 45–49 %; để qua cần ≥ 67 %. Mặc định 16 GB lấy từ máy 128 GB; áp nguyên cho máy 36 GB là đổi
  một báo động giả lấy một báo động giả khác. Theo luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI
  kho»: vòng sửa phải có ca *số đo kiểu MacBook Pro 21/10 → im* bên cạnh ca *số đo kiểu M5 20/10 → im*,
  và mặc định `đỉnh_làn` phải suy được từ máy (p95 đo được) hoặc tỉ lệ với RAM — không phải một hằng số.
- **Vế 2 (tốc độ Δswapins/phút trong lúc chạy, nhãn «chạy dưới tải», thử lại một lần).** Nền của máy
  này lúc rảnh: ~140 trang/phút (16 KB/trang, ≈ 2 MB/phút). Chưa có số lúc nghẹt thật để đặt ngưỡng — ngưỡng
  phải đến từ vế 3.
- **Vế 3 (hiệu chuẩn bằng lượt bị hạ tầng đốt).** Chưa có sổ nào ghi số đo lúc cấp làn; `trang-thai.json`
  chỉ giữ nhịp cuối. Đây là phần dựng mới, không phải sửa.
- **Chiều đỏ thật** `memory_pressure -l warn` **chưa chạy** ở bước này: máy đang có lượt nặng của phiên
  khác, và gây áp lực thật lên máy dùng chung là đúng thứ thước phải ngăn. Trong vòng sửa, chiều đỏ nằm
  trong bộ kiểm bằng số đo tiêm (áp lực mức 2/4 → chặn, ghim đúng thông điệp).

## 3. Quan sát ngoài lời báo (sổ, không phải ô)

- **Giảm tải theo áp lực lật liên tục.** 40 lần vào giảm tải trong 34 giờ ở đợt crm trên máy này, cả 40
  vì «áp lực bộ nhớ mức 2»; trung vị 30″, 26/40 lần dưới một phút, dài nhất 355′ (20/10 17:10Z → 23:05Z).
  Mỗi lần vào ghi một sự kiện `can_phan: true` (`phat-lich.mjs:418`), tức đánh thức phiên giám sát. Lời
  báo của M5 không nói tới chuyện này, và vế 1 của M5 giữ nguyên điều kiện áp lực. Ghi ở đây để vòng sửa
  không vô tình làm nó tệ hơn; không mở việc riêng.

## 4. Chuỗi đo

Chuỗi 20″ trên MacBook Pro, 21/10 (giờ UTC): `giờ · swap đã dùng MB · swapins · swapouts · mức áp lực ·
memorystatus_level % · số tệp swap`.

```
23:48:49 12000.44 4101040 6739543 1 45 13
23:49:10 11984.44 4101192 6739543 1 46 13
23:49:30 11984.44 4101192 6739543 1 46 13
23:49:50 11984.44 4101264 6739543 1 48 13
23:50:10 11984.44 4101280 6739543 1 48 13
23:50:30 11984.44 4101304 6739543 1 49 13
23:50:50 11984.44 4101600 6739543 1 47 13
```

Cách đo lại: `sysctl vm.swapusage kern.memorystatus_level kern.memorystatus_vm_pressure_level`,
`vm_stat | grep -E 'Swap(ins|outs)'`, `ls /System/Volumes/VM`; gọi hàm thật bằng cách import
`dieu-phoi/scripts/suc-khoe.mjs` và truyền đúng bốn lệnh mà `phat-lich.mjs:411–414` chạy.
