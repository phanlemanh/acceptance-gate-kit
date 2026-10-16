# Dự báo đóng băng khớp theo mã hàng của mốc — thiết kế (hàng RM6b)

Hồ sơ: `_acceptance/du-bao-dong-bang-theo-ma-moc/` · Cổng Đáng ký 16/10 («đáng: build · ngưỡng: nhận»).
Gốc: `_acceptance/lo-trinh-gio-may/` Ngoài-6 · hạt giống `docs/plans/2026-10-16-hat-giong-du-bao-dong-bang-theo-ma-moc.md`.

## Vấn đề

RM6 đóng băng dự báo của mốc lúc mở việc (`du-bao.json`, ghi bởi `--mo-o`) với `moc.ten` = tên ngắn **kèm ngày mục
tiêu** (`tenNganMoc`: «Phát hành 2.31.0 16/10») và `moc.hang` = mã các hàng của mốc lúc ấy. Hai bên đọc —
dòng mốc trên trang lộ trình (`gioMayMoc`: «dự báo lúc bắt đầu …» + cờ «mốc quá tải») và `--do-lech` — tìm dự báo bằng
`x.moc.ten === tenNganMoc(m)`. Đổi ngày mục tiêu (dời mốc, hay ghi đè bằng ngày phát hành thật như thói quen 5/5 mốc
2.25 → 2.29) là mất khớp: trang mất dòng dự báo, cờ tắt, phép đo lệch in «chưa đóng băng». Đo trên dữ liệu thật của kit
16/10: dời mốc 19/10 → 18/10 → 1 → 0 dòng.

## Phương án

**Chọn — bộ đọc khoan dung, khớp theo mã hàng lúc đóng băng.** Mỗi dự báo về ĐÚNG MỘT mốc trong một lộ trình:

1. ứng viên: mốc có tên ngắn khớp nguyên văn `moc.ten` (đường cũ, giữ nguyên); HOẶC mốc chung ≥ 1 mã với `moc.hang`,
   chỉ khi hồ sơ mang dự báo là hồ sơ của một hàng trong CHÍNH lộ trình ấy. «Hồ sơ của một hàng» là đúng phép gắn hàng ↔
   hồ sơ mà bộ đọc lộ trình đã dùng cho cột trạng thái (`kq.dong[].hoSo`): thư mục mang `slug` của hàng, hoặc đúng một hồ
   sơ nhận hàng qua `lo_trinh_ma` trong ô cơ hội — `--mo-o` ghi cả hai đường, nên dự báo nó ghi luôn gắn được;
2. nhiều ứng viên (hàng dời mốc sau đóng băng): tên khớp nguyên văn > chung nhiều mã nhất > tên bỏ ngày khớp > đứng
   trước trong tệp. Mã đứng trước tên bỏ ngày vì ý định đã ký ở Cổng Đáng: «dự báo đóng băng gắn với mốc theo những
   hàng mốc chở lúc đóng băng, không theo ngày». Tên nguyên văn đứng đầu vì nó chỉ khớp khi mốc chưa đổi gì — khi ấy
   đầu ra phải giống từng byte bản RM6;
3. trong một mốc: dự báo đóng băng sớm nhất (như RM6).

Không thêm cờ «dự báo khớp theo mã» trên dòng mốc: ghi đè ngày mốc là thao tác thường lệ của MỌI mốc phát hành (5/5),
nên cờ ấy bật ở mọi mốc đã phát hành và thành nhiễu; và trang lộ trình chỉ còn ~2 % lề trước trần độ dài (ca LTT-san).
Nguồn gốc của dự báo vẫn đọc được: phép đo lệch in ngày đóng băng và số «hàng thêm sau đóng băng».

Bên ghi (`--mo-o`, `duBaoHoSo`) và khuôn `du-bao.json` KHÔNG đổi — tệp đã ghi trước bản sửa đọc như cũ. Cờ quá tải vẫn
so dự báo đóng băng với ngày mục tiêu HIỆN TẠI của mốc (đã đúng ở RM6, ca mới ghim quan hệ ấy).

**Loại — khớp theo tên bỏ ngày.** Rẻ, nhưng tên đổi theo thói quen («— ĐÃ PHÁT HÀNH …» sau dấu gạch dài thì tên ngắn
giữ, nhưng `ten_ngan` hay phần trước dấu gạch đổi là mất), và hai mốc khác ngày cùng tên ngắn («Phát hành», «Tinh chỉnh
…») gắn chéo. Giữ nó làm tiêu chí phân xử, không làm khoá.

**Loại — thêm khoá định danh mốc vào `du-bao.json` và tệp lộ trình.** Đổi khuôn hai tệp: mọi kho tiêu thụ trả giá
(luật 26/09: bộ đọc khoan dung đứng trước đổi mặc định); tệp lộ trình là ý định của chủ kho, kit không ghi vào.

## Đơn vị

- `scripts/lo-trinh.mjs`: hàm mới `ganDuBao(kq)` — một lần mỗi lộ trình, trả mảng dự báo theo chỉ số mốc, nhớ BÊN
  TRONG `kq._gm` (đối tượng đã không liệt kê từ RM6) → JSON các lệnh khác không đổi byte; AC-7 so cả JSON. `duBaoDongBang(kq, m)` đọc từ đó. Không đổi chữ ký hàm
  nào khác, không đổi `scripts/gio-may.mjs`.
- `tests/scripts/lo-trinh-gio-may.test.mjs`: ca `DB-<n>` = AC-n của hợp đồng này, cùng tệp với ca `GM-<n>` của RM6
  (cùng kho thử, cùng bộ dựng bản sao); bộ máy gốc của ca DB đọc từ `_acceptance/du-bao-dong-bang-theo-ma-moc/goc-so`.
- `_acceptance/config.yaml`: khoá `executors.test.du_bao_theo_ma_moc` chạy đúng các ca DB.

## Kiểm

TDD: commit ca đo trước, chạy thấy đỏ trên `main` (các ca dời ngày), rồi commit vật. Mỗi ca máy có chiều đỏ chạy CHÍNH
hàm đo trên bản sao của vật với một nhát tiêm, sau khi bản lành xanh trên cùng kho thử, và ghim thông điệp. Ca so byte
với bộ máy gốc làm đối chứng dương trước. Một ca chạy trên dữ liệu thật của kit (dự báo đóng băng của chính ô này).

## Giới hạn biết trước

- Hai lộ trình trong một kho có mốc trùng tên ngắn kèm ngày vẫn chia nhau dự báo theo đường cũ (hành vi RM6, không đổi).
- Hàng dời mốc sau đóng băng (mốc đã đổi cả ngày): dự báo về mốc giữ nhiều mã đóng băng nhất, kể cả khi mốc kia giữ
  tên; phép đo lệch vẫn đếm «hàng thêm sau đóng băng» như cũ, không đóng băng lại.
- Hồ sơ không gắn được hàng nào (không `slug`, không `lo_trinh_ma`) chỉ khớp theo tên kèm ngày như RM6.
