# Chân suite của đường nền đọc đúng dòng trạng thái đầu tiên — design

Hồ sơ: `_acceptance/nen-cay-ban-dong-dau/` · T2 · 2026-09-24

## Vấn đề (tái hiện được)

Chân `suite` của `feature-loop/scripts/duong-nen.mjs` chụp `git status --porcelain` trước và sau
khi chạy suite, rồi gọi tên mọi dòng mới là «suite ghi rác vào cây». Nó đọc trạng thái qua
`gitTry()`, mà `gitTry()` `trim()` cả đầu ra — nên dòng ĐẦU TIÊN mất dấu cách mở đầu của mã trạng
thái (` M README.md` → `M README.md`), còn các dòng sau giữ nguyên. Hai triệu chứng:

| Ca | Báo hôm nay | Đúng |
|---|---|---|
| Suite sửa tệp đã theo dõi `a.txt` | `CAY BAN SAU SUITE .txt` | `… a.txt` |
| `b.txt` bẩn SẴN trước lượt, suite sửa `a.txt` (sắp trước) | `.txt` và `b.txt` | chỉ `a.txt` |

Ca thứ hai đổ oan: dòng của `b.txt` là dòng đầu lúc chụp trước (mất dấu cách) nhưng không còn là
dòng đầu lúc chụp sau (giữ dấu cách), nên hai chuỗi khác nhau và bị coi là mới. Quan sát thật:
`_acceptance/nen-cong-cu-gan-bang-lenh-con/duong-nen.md` ở commit `0c4eb404` ghi
`nen suite: CAY BAN SAU SUITE acceptance/config.yaml` (thiếu `_`).

Vì sao lưới hiện có không bắt: ca `NEN3` chỉ đo tệp chưa theo dõi (`?? rac.txt`), dòng không có
dấu cách mở đầu nên `trim()` không chạm.

## Thiết kế

Chân suite đọc trạng thái bằng một lời gọi git KHÔNG `trim()` đầu dòng: tách dòng, bỏ dòng rỗng,
giữ nguyên hai cột mã trạng thái. `gitTry()` giữ nguyên cho mọi chỗ khác (sha, merge-base, tên
nhánh — giá trị một dòng, `trim()` là đúng). Không đổi khuôn dòng đỏ, không đổi luật đỏ.

## Kiểm (hai chiều, fixture code-sinh của NEN0)

Lời đọc trạng thái nằm trong khối marker `SUITE-TRANG-THAI` để ca đột biến thay đúng nó.


- NEN-CB1: suite sửa `README.md` (đã theo dõi) → đúng MỘT dòng cây bẩn, nguyên văn
  `nen suite: CAY BAN SAU SUITE README.md`.
- NEN-CB2: `vat.txt` bẩn sẵn trước lượt + suite sửa `README.md` → tập dòng cây bẩn BẰNG ĐÚNG
  `[… README.md]`; `vat.txt` không bị gọi tên.
- NEN-CB4: như CB1 nhưng suite XOÁ `README.md` (` D`).
- NEN-CB5: đột biến đặt lại `trim()` → CB1 đỏ `EADME.md`, CB2 đỏ `vat.txt`; bản chép chưa tiêm xanh trước.
- Mọi ca tự chụp porcelain thô trước/sau lượt và so bằng nhau với tiền điều kiện (dòng đích đứng đầu).
- NEN-CB3 (chiều im): `vat.txt` bẩn sẵn, suite không ghi gì → chân suite xanh, 0 dòng cây bẩn.
- Chiều đỏ trong lịch sử: commit ca trước vá; trên bản chưa vá CB1 đỏ với `EADME.md`, CB2 đỏ với
  `vat.txt` bị đổ oan.
