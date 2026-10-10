# Khối dữ liệu lộ trình chở thêm trường riêng của kho — BÁC 09/10/2026

**Quyết định:** máy, 09/10, theo luật «sửa kit vì sự cố MỘT kho phải cân trên MỌI kho» và «CỘNG cần
owner phê»; đường đảo: owner gọi tên một mục dưới đây là mở lại. Khuôn `lo-trinh-du-lieu` phiên bản 1
(hồ sơ `_acceptance/xuat-du-lieu-lo-trinh/`, PR #285) **không thêm khoá nào**; tài liệu kho tiêu thụ
`skills/acceptance/references/lo-trinh-du-lieu.md` thêm ba mục thay vào đó.

**Đề xuất là gì:** bản chiếu đầu tiên — trang «Lộ trình» chỉ đọc cho trưởng phòng ban trong crm (hồ
sơ crm `_acceptance/trang-lo-trinh-trong-crm`, nhánh `feat/trang-lo-trinh-trong-crm` `6d1ea30e4`) —
đo trên dữ liệu thật và xin sáu thứ khối chưa chở: (1) hạn `han` · (2) tên ngắn `ten_ngan` · (3) người
phụ trách / người cần hỏi · (4) tên hiển thị của nhóm · (5) thời điểm vẽ · (6) chữ cho người ngoài đội
(nhãn trạng thái, cách viết `bat_khi`).

**Vì sao có file này:** mỗi bản chiếu mới sẽ thấy khối «thiếu» đúng những trường riêng kho của nó
ghi. Ghi lý do ở đây để lần sau đụng lý do trước khi mở ô.

---

## Căn cứ — số đo 09/10

Kho thử: crm `onehub` `e86cf730f` (tệp kế hoạch đổi lần cuối ở `eaebd612b`), chép ra bằng
`git archive` (không chạm crm), vẽ bằng bộ vẽ của nhánh `vong/xuat-du-lieu-lo-trinh` `d86a2f5e`.
Ba lộ trình, 87 việc, 34 việc chưa giao, khối 35 KB.

| Mục | Dữ liệu có ở đâu | Đo | Phán |
|---|---|---|---|
| 1 `han` | trường riêng của crm | 25 việc có `han`, **24 đã giao**; trong 34 việc chưa giao, 1 việc có `han` — và việc đó đã gắn mốc. Chở `han` trả lời thêm «bao giờ xong» cho **0** việc chưa giao | Bác. Thiếu nằm ở DỮ LIỆU kế hoạch (31/34 việc chưa giao không có ngày nào), không ở khối |
| 2 `ten_ngan` | trường riêng của crm | có ở 28/34 việc chưa giao (Kho tài liệu 0/6); `ten` có ở 87/87 | Nhu cầu thật, nhưng là từ vựng của một kho → bản chiếu đọc thẳng tệp |
| 3 người lo | không có | `cho_ai` ở 7/34 việc chưa giao, cả bảy là «điều kiện» — không phải người. Khuôn kit có `moc.ai` (11/16 mốc OKR: «Trưởng phòng ban», «Ban lãnh đạo»…) | Bác: không có nguồn để chở. `moc.ai` đọc thẳng tệp như mục 2 |
| 4 tên nhóm | không có | `tu_vung` là bảng **từ trạng thái** («đã lên onehub» → «Đã giao»), không phải tên nhóm; không tệp nào ghi tên hiển thị cho `okr`, `tro-ly`… | Bác: không có nguồn. Kho thêm trường riêng ở tệp, bản chiếu đọc thẳng |
| 5 thời điểm vẽ | — | dấu giờ chạy đổi mỗi lượt → trang không khớp lần vẽ kế, CI đỏ; ngày commit của tệp đầu vào: trang vẽ TRƯỚC commit mang đầu vào, CI so SAU commit → luôn lệch, và CI lịch sử nông đỏ oan (cùng lý do vòng L2 bỏ suy `pr`) | Bác. Bản chiếu đã có sẵn ngày commit gần nhất đổi `LO-TRINH.html` |
| 6a nhãn người ngoài | khối đã chở | `nhom_trang_thai` bốn giá trị cố định; 87 việc mang 6 chữ trạng thái, chữ chung chỉ mất nghĩa ở nhóm `khac` (3 việc «Xếp lại sau») | Bác khoá mới: lời cho bốn giá trị là của từng bản chiếu |
| 6b chữ `bat_khi` | chữ crm viết | 3/114 câu của kế hoạch mang ghi chú quy trình («đề xuất, chốt ở Cổng Đáng») | Kit không viết lại ý định. GUIDE thêm một câu khuyến nghị cách viết |

**Phép nối thay cho khoá mới:** trên kho thử, nối từng việc của khối về tệp theo luật trong tài liệu
(`#<n>` = phần tử thứ n, còn lại khớp `ma`) ra **87/87** đúng một; nối mốc theo tên + ngày ra **22/22**.
Hai tệp cùng commit luôn khớp nhau vì CI của kho so trang với tệp.

## Lý do — một nguồn, kit không chứa từ vựng của kho

Khối chở thứ kit **tính** và trường của **khuôn kit**. `han`, `ten_ngan`, `cho_ai` là trường tự do
của một kho (GUIDE: «mọi trường khác là trường tự do của kho»); đặt chúng thành khoá của khuôn là neo
kit vào từ vựng của crm — kho khác ghi `deadline` hay `short_name` thì khoá vô nghĩa, kho nào cũng trả
giá đọc. Một khoá chung kiểu «chở nguyên hàng của tệp» thì tránh được từ vựng nhưng chép lại cả tệp
kế hoạch vào trang (OKR: +25 KB trường tự do trên khối 35 KB) để tiết kiệm một lần đọc tệp mà bản
chiếu đã biết đường dẫn. Và mọi cách đều là CỘNG cần owner phê, trong khi bản chiếu đọc thẳng tệp được
ngay hôm nay mà không chờ mốc phát hành nào — kit ra khỏi đường găng của crm cho mọi trường hiển thị
về sau, kể cả lọc theo phòng ban thật mà hồ sơ crm ghi «cần bộ kit thêm một trường riêng».

## Giới hạn đã khai

Phép nối việc ↔ tệp **không có ca đo trong kit**; nó dựa vào nhãn `#<n>` của khoá `hang.ma` đã có
trong khuôn phiên bản 1 (đổi nhãn đó là đổi nghĩa khoá = phiên bản mới, nên không trôi im được).
`moc.loai` và `moc.ai` có trong `lo-trinh-template.json` mà khối không chở — đọc thẳng tệp như trường
riêng.

## Ngưỡng mở lại (đang đếm)

- **≥1 bản chiếu thứ hai** (kho khác, hoặc bản chiếu ReUI) cần cùng một trường riêng → xét thêm một khoá
  chung (vị trí của việc trong tệp, hoặc hàng nguyên văn), không đặt tên theo từ vựng một kho.
- **≥1 lần bản chiếu nối sai** việc ↔ tệp trên nhánh chính của một kho → thêm ca đo cho phép nối, hoặc
  khoá vị trí.
- `moc.loai` / `moc.ai` vào khối khi một bản chiếu hiện chúng mà phép nối tên + ngày ra hơn một mốc.

## Việc CÒN SỐNG — thuộc kho crm, không thuộc kit

- Câu «bao giờ xong» của ngưỡng nghiệm thu crm (trưởng phòng ban trả lời trong một phút) cần **ngày
  cho 31 việc chưa giao** — gắn việc vào mốc (khối đã chở, trang và thẻ đã tính «trễ») hoặc ghi `han`.
- Bỏ ghi chú quy trình khỏi `bat_khi` của 3 việc (LT1, LT2, V1).

## Prior requests

- 09/10: phiên crm dựng trang «Lộ trình» (hàng `LT1`) liệt kê sáu mục → máy đo trên dữ liệu thật,
  bác cả sáu, thêm ba mục tài liệu (`lo-trinh-du-lieu.md`) và một câu GUIDE.
- Ai muốn mở lại: chỉ ra ca đã chạm một ngưỡng ở trên, kèm số đo trên dữ liệu thật của kho — không mở
  lại bằng «khối còn thiếu trường X».
