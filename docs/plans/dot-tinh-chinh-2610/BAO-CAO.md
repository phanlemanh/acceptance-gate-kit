# Báo cáo đợt tinh-chinh-2610

Đợt thứ hai kho kit tự chạy bằng gói `dieu-phoi` của chính nó, cho mốc «Tinh chỉnh sau hai đợt thử». Mục đích là sửa
những chỗ hai kho tiêu thụ vấp sau 2.34.0 và 2.35.0. Mở 29/10 ~02:11Z: chủ kho duyệt thẻ khởi tạo, cho build sáu hàng và
cho tự gộp. Sáu hàng gộp xong 30/10 07:58Z. Bản phát hành **2.36.0** chở cả sáu hàng; chủ kho ký 30/10 22:18Z (PR #455).

## Đã giao

| Hàng | Việc (người dùng kit được gì) | PR | Gộp |
|---|---|---|---|
| TC1 | Lịch 30′ không còn báo nhầm «giám sát không có nhịp sống» khi giám sát đang chạy | #419 | 29/10 08:46Z |
| TC5 | Đường nền không còn báo «THIẾU» với tệp kịch bản có thật | #447 | 29/10 11:57Z |
| TC4 | Kiểm bản cài nói lối sửa chạy được, không đọc lệch tài liệu thành ĐỎ | #448 | 29/10 15:39Z |
| TC2 | Lệnh của đợt ghi đúng hàng (xin lượt không cờ, `hang them` nhận mã hay slug) | #449 | 29/10 23:37Z |
| TC6 | Làn đối chứng của lượt chấm chạy được bằng Bash, không cần công cụ ghi tệp | #450 | 30/10 03:09Z |
| TC3 | Gộp nhánh chính không dừng ở hai tệp sinh (driver gộp bật theo lựa chọn) | #452 | 30/10 07:58Z |
| — | Mốc 2.36.0 gom sáu hàng trên + bộ đo giờ máy bỏ lời nhắn tự sinh khỏi token | #455 | chờ CI lúc viết |

Gộp cùng cửa sổ, ngoài hàng của đợt: #446 (lộ trình design-floor cho kho mới, DFK1–DFK3) và #451 (finding UI đồng nhất
giữa các màn). Cả hai gộp TRƯỚC lượt chấm 2 của mốc nên nằm trong 2.36.0. Mục 2.36.0 của CHANGELOG còn ghi «#446 chưa gộp,
mốc không chờ» — câu đó viết trước lúc gộp và nay sai; sửa ở bản kế, không đổi vật.

## Số đếm (`dem --json`, 30/10 23:00Z)

- **Lượt gọi chủ kho đếm được trong sổ:** 8 cho 6 hàng — TC2 2 · TC3 3 · TC4 1 · TC5 1 · TC6 1 · TC1 0. Dưới trần T2 (3)
  ở mọi hàng.
- **Lượt gọi ngoài sổ hàng** (đếm tay): duyệt thẻ khởi tạo 1 · giao quyền xếp thứ tự và gộp 2 (29/10, nhắc lại 30/10 sau
  đổi tài khoản) · bấm thẻ phiên chấm mốc 1 · ký mốc 1 · quyết đợt kho tiêu thụ thứ hai 1. Đều là trong thiết kế, trừ lần
  nhắc lại uỷ quyền sau đổi tài khoản.
- **Ký → gộp:** đo được 2 hàng, trung vị 46′ (TC2 47′ · TC3 45′); bốn hàng `chua_do`.
- **Gộp nhánh chính vào nhánh làm việc trước gộp:** 3 (TC2 2 · TC3 1). **Ghim lại sau ký:** 0.
- **Lượt chấm của mốc:** 3 — lượt 1 BLOCKED vì đứt mạng; lượt 1 chạy lại REJECT vì hai ca phụ thuộc máy; lượt 2 PASS 20/20.
- **Hạn mức:** tài khoản đầu chạm 97 % tuần lúc 30/10 ~10:40Z → bàn giao đổi tài khoản; tài khoản sau dùng 6 % tới lúc viết.

## Sự cố

- **Đổi tài khoản giữa đợt (30/10 ~10:45Z):** bàn giao hai đợt bằng `ban-giao`; tài khoản mới không thấy phiên cũ, nên mọi
  trạng thái phải đọc lại từ đĩa. Phiên phát hành cũ dừng ngay trước lượt chấm 2.
- **App khởi động lại giết lệnh nền:** Monitor, lượt chấm đang chạy và một lệnh chờ gộp chết theo. Phải giăng lại tay;
  lệnh gộp mốc chạy lại sau lần khởi động lại 31/10.
- **Khoá chấm cấp máy:** lượt chấm 2 của mốc chờ ~30′ vì một kho tiêu thụ khác trên cùng máy đang giữ lượt chấm. Đây là
  thiết kế (một lượt chấm mỗi máy), không phải lỗi — nhưng lời chặn ở phiên thợ đọc như lỗi «trống mà chưa cấp».
- **Lỗi bộ đo giờ máy lộ ra lúc chấm mốc:** phép đo token đọc bản ghi phiên thật của máy, gặp lời nhắn tự sinh của
  Claude Code (model `<synthetic>`, token 0) và coi là lỗi; main cũng đỏ trên máy này. Sửa trong mốc, có ca hai chiều.
- **Một ca chập chờn (EPIPE khi xuất qua ống):** đỏ trong lượt chấm, chạy riêng xanh 3/3 — vào sổ known-limits.
- **Ca sổ known-limits đốt một lượt chấm** ở TC4 và TC2 (sổ đổi sau chấm).
- **Mạng chập chờn:** sáu lần `git fetch` của bộ phát lịch lỗi trong ~3 giờ (30/10 11:28Z–14:44Z); một lần không đọc được hai kênh liên máy.
- **Áp lực bộ nhớ mức 2** bật giảm tải một lần giữa lượt chấm 3 của mốc; lượt đã cầm khoá nên chạy tiếp.

## Chỗ vấp của gói (ghi lại, chưa mở việc — luật đóng băng việc-kit giữa hai mốc)

1. **Phiên giám sát không có hook của gói vẫn bị coi là «không có nhịp sống»** — `danh-thuc` trả `bao-chu-kho` hai lần
   trong khi giám sát đang chạy; chẩn đoán báo `hook-phien thieu`. TC1 sửa đường đọc nhịp, nhưng phiên giám sát nạp gói
   từ thư mục bản cài khác kho thì hook vẫn không bắn. Cùng họ với chỗ vấp 1 của đợt `design-floor-2710`.
2. **Lượt lịch không tự mở phiên** cho hàng kế: TC3 phải đề xuất thẻ để chủ kho bấm.
3. **Thẻ đề xuất phiên không nhận thư mục của kho khác** — việc của kho tiêu thụ không mở được từ phiên giám sát kit.
4. **Hồ sơ mốc phát hành không phải một hàng của đợt**: phiên mốc ghi danh vào dãy D1 đã xong để xin khoá chấm; thẻ phiên
   phải giải thích tay vì sao lời chặn là «chờ lượt».
5. **Bản ghi phiên thật làm phép đo phụ thuộc máy** (ca GM-6-that): ca đọc thư mục bản ghi của chính máy, nên một loại lời
   nhắn mới của Claude Code làm đỏ cả main. Đã sửa bộ lọc; ca vẫn đọc bản ghi thật — giới hạn đã khai.
6. **CLI đợt cũ chép trong thư mục đợt không có lệnh `hoi`**: câu hỏi chủ kho ở đợt dùng lõi 2.33.0 không vào sổ «cần anh».

## Kho tiêu thụ

- **invest** nhận 2.36.0 trước (ghi chú nhận viết sau khi gắn thẻ).
- 31/10 chủ kho quyết máy MacBook Pro **không chạy crm nữa**: đợt crm `lo-trinh-tin-hieu` tạm dừng, bảy dãy nghỉ, bộ phát
  lịch của đợt đã dừng. crm nhận 2.36.0 ở máy khác khi chủ kho gọi.

## Hạt giống sinh trong đợt

`docs/plans/2026-10-29-hat-giong-ten-tran-kich-ban-goc-kho.md` ·
`docs/plans/2026-10-30-hat-giong-tep-sinh-mot-hang-mot-dong.md` (trong PR mốc, lời hứa với kho invest: dữ liệu nhúng của
trang lộ trình mỗi hàng một dòng, để tệp sinh không làm xung đột PR của kho tiêu thụ).

## Còn lại trước khi đóng đợt

Gộp #455 → gắn thẻ `v2.36.0` vào commit gộp → `node scripts/kiem-ban-cai.mjs --ref v2.36.0` phải TỔNG KẾT ĐẠT → ghi chú
nhận cho invest → báo kênh liên máy → thẻ đóng đợt (`/dieu-phoi:dong-dot`).
