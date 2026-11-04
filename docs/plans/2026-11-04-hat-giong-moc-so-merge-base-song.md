# Hạt giống — năm ca so «bản trước vòng» bằng merge-base sống với nhánh chính

Gốc: acceptance-gate-kit/_acceptance/kk8-do-khong-rut-merge-base/. Vòng `kk8-do-khong-rut-merge-base` (04/11) sửa ca
KK-8-do làm `main` đỏ sau #483, rồi quét theo LỚP khắp `tests/`. Năm chỗ dưới đây cùng lớp nhưng không vá trong vòng ấy.
Hợp đồng của hồ sơ trích lại tên tệp này ở Out of scope. Hạt giống là sổ, không phải ô.

## Người dùng gặp gì

Mỗi ca dưới đây dựng «bản trước vòng» bằng `git merge-base HEAD <nhánh chính>` trên chính kho kit. Vòng của từng ca đã gộp,
nên:

- **Trên `main` hôm nay ca xanh rỗng**: merge-base là HEAD, nên phép so tự so với chính nó.
- **Ở nhánh sau có chạm hợp lệ vào tệp mà ca so**, ca đỏ oan. Người mở PR đó gặp đỏ ở một ca không thuộc vòng của mình,
  rồi mất một lượt chấm hoặc một lượt gọi người để quy kết. Đây là đúng hình dạng đã chặn `main` 04/11 (CI run
  41763815977).

| Chỗ | Ca | Vòng gốc | Tệp mà nhánh sau chạm thì đỏ oan |
|---|---|---|---|
| `tests/design-floor/moc-s0-s1.mjs:314` | THE-M0 | design-floor-moc-s0-s1 (#433) | `scripts/gate-card.js` |
| `tests/dieu-phoi/mo-dot.test.mjs:1154` | DP2-11 khong-dot | dieu-phoi-mo-dot-mot-lenh (#298) | start-scan của điều phối |
| `tests/dieu-phoi/doi-tai-khoan.test.mjs:819` | DP4-08 khong-ban-giao | dieu-phoi-doi-tai-khoan (#312) | `tiep-tuc` (moChip) |
| `tests/scripts/khuon-loi.test.mjs:524` | KL-8 | khuon-loi (#475) | `scripts/gate-card.js` |
| `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs:87` | ND-1-trang-giu, ND-7 | lo-trinh-du-lieu-ngay-du-kien (#368) | trang lộ trình (CSS) |

Hai kịch bản đã đo trên bản `clone --shared`: A (đã gộp) thì cả năm xanh rỗng; B (nhánh sau, nhánh chính cũ) thì cả năm
đỏ oan.

## Lớp này tái phát — số đếm

Tra tri thức ở S1 của vòng kk8 tìm ra năm lần cùng lớp đã gặp, mỗi lần vá tại chỗ:

| Lần | Hồ sơ | Dấu vết |
|---|---|---|
| 1 | ho-so-khep-thoi-hoi | HK-AC5-note đỏ trên main sau #202 (CI 35698390482) — `d-20260922T073441Z-33` |
| 2 | dieu-phoi-lop-mod | DP6-03 đỏ trên CI nhánh chính; chủ kho chọn «sửa bom hẹn giờ merge-base sống trước khi ký» — `d-20261011T092906Z-24`, `-26` |
| 3 | dieu-phoi-feature-loop-trong-dot | DP7-06/DP7-10 neo lại sau #306 — `d-20261011T043240Z-23`, `d-20261011T151347Z-26` |
| 4 | ho-so-da-ky-giu-tuoi | «bản trước vòng» dời hai lần — `d-20261017T202504Z-22`, `d-20261018T090227Z-49` |
| 5 | kk8-do-khong-rut-merge-base | KK-8-do làm main đỏ sau #483 (CI 41763815977) |

Năm lần vá tại chỗ là đúng hình dạng mà hiến pháp gọi là «dặn-bằng-lời làm nghiệm». Dạng nghiệm đúng tầng là một răng
máy-giữ khắp `tests/`: lời gọi merge-base HEAD↔nhánh chính trên kho kit thật chỉ được đi qua MỘT hàm dùng chung theo khuôn
commit gộp PR (nổ khi gốc == đỉnh), kèm ca đỏ cho chính răng. Đây là một CỘNG, cần chủ kho phê đích danh.

## Hướng

- Khuôn «commit gộp PR» đã có ở `tests/scripts/can-cu-s1.ca.mjs` (`tamVongKK`, khoảng dòng 690–704) và `mocSo` của
  `sua-truoc-dot-thu` / `on-dinh-r2`: tìm commit gộp PR của chính vòng, so gốc `merge-base m^1 m^2` với đỉnh `m^2`; chưa
  gộp thì merge-base↔HEAD; gốc == đỉnh thì nổ. Khuôn này chữa cả vế rỗng lẫn vế đỏ oan. Ghim sha (cách của KK-8) chỉ chữa
  vế rỗng, nên chỉ đúng khi mốc là một phiên bản cố định có tên.
- Mỗi ca thêm một ca `*-do merge-base-song`: cách lấy mốc bằng merge-base sống phải đỏ (mẫu: `DP7-06-do`, `DP3-11-do`,
  `DP6-07-do`).
- `lo-trinh-du-lieu-ngay`: `trungHead` phải nổ, không được PASS kèm một lời khai.

## Vì sao chưa làm

Hôm nay năm ca xanh trên `main` nên không chặn PR nào. Vòng `kk8` sinh ra để gỡ chặn `main` mà mọi PR đang chờ; vá năm
ca trên bốn suite sẽ làm vòng ấy phình chừng ba lần.

Ngưỡng mở vòng, mốc nào tới trước:

- ≥1 lượt CI hoặc lượt chấm S4 đỏ oan ở một trong năm ca; hoặc
- trước hàng đầu tiên của đợt `nen-thiet-ke-0411` chạm `scripts/gate-card.js`.
