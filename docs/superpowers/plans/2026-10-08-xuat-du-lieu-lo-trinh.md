# Kế hoạch — xuat-du-lieu-lo-trinh (hàng X1)

Hồ sơ `_acceptance/xuat-du-lieu-lo-trinh/` · design `docs/superpowers/specs/2026-10-08-xuat-du-lieu-lo-trinh-design.md`
· T2, Cổng Phạm vi làn V 08/10. Mọi task tuần tự (cùng một tệp vật, cùng một tệp test).

| # | Việc | Tệp | Kiểm từng bước | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Khuôn + dựng khối + nhúng vào trang + bộ đọc mẫu | `scripts/lo-trinh.mjs` | `node tests/scripts/lo-trinh.test.mjs` xanh với các ca cũ (trang mẫu đỏ là đúng chờ task 4) | E1 E3 E5 E6 E7 E8 E9 | false |
| 2 | Tài liệu kho tiêu thụ (bảng khoá + luật so ngày trong khối marker) · đoạn GUIDE · CHANGELOG | `skills/acceptance/references/lo-trinh-du-lieu.md` · `GUIDE.md` · `CHANGELOG.md` | đọc lại; ca LT-119/LT-120 ở task 3 | E10 E11 E12 | false |
| 3 | Ca đo LT-110 … LT-120, mỗi ca kèm chiều đỏ trên bản sao | `tests/scripts/lo-trinh.test.mjs` | `LT_CASES=LT-110,…,LT-120 node tests/scripts/lo-trinh.test.mjs` | E1–E10 E12 | false |
| 4 | Vẽ lại hai trang mẫu của hồ sơ đã ký (trang đổi vì có khối) + chụp lại ảnh | `_acceptance/viec-ke-theo-plan/mau/` · `_acceptance/trang-lo-trinh-doc-mot-phut/mau/` | `node tests/scripts/lo-trinh-mau.mjs --check` · `node tests/scripts/lo-trinh-mau-trang.mjs --check` | giữ LT-06-mau, LT-99-mau | false |
| 5 | Bốn mảnh suite + hooks + bản đồ xanh; hợp đồng `implemented` | — | bốn lệnh `feature_loop.suite_keys` | mọi E | false |

## Task 1 — `scripts/lo-trinh.mjs`

- `export const KHUON_DU_LIEU` — danh sách khoá từng cấp (`goc`, `lo_trinh`, `hang_ke`, `tien_do`, `hang`,
  `moc`, `da_bac`, `can_sua`), đúng bảng của design.
- `export function duLieuTrang(cacTep, sections)` — từ CÙNG `cacTep` `veHtml` nhận: hàng kế dùng
  `hangKeCua` + `thamSoKe`; chỗ cần sửa = `kq.co` dịch qua `dichCo` + `khaiLa` (đúng câu trang in);
  nhóm từng hàng = đúng phép chia của `theDau` (tách thành một hàm `nhomTienDo(d, kq, nhom)` mà cả
  `theDau` lẫn khối gọi — một nguồn); mốc sắp theo ngày, `con_viec` dùng chính luật `conViec` của
  `mucLoTrinh` (tách hàm dùng chung); cờ hàng = `d.coHang` dịch + câu `khaiNgoai`.
- `veHtml` chèn `<script type="application/json" id="lo-trinh-du-lieu">…</script>` ngay trước script
  nội tuyến; JSON thoát `<` → `<`, U+2028/2029 → ` `/` `.
- `export function docDuLieu(html)` — năm ca của AC-9, không ném.
- Không đổi một byte nào khác của trang (AC-3).

## Task 2 — tài liệu

- `skills/acceptance/references/lo-trinh-du-lieu.md`: lấy khối ở đâu (`LO-TRINH.html` nhánh chính của
  kho), rút ra sao (tìm `id="lo-trinh-du-lieu"`, `JSON.parse`), bảng khoá trong khối marker
  `LO-TRINH-DU-LIEU-KHOA` (mỗi dòng `cấp.khoá — nghĩa`), luật so ngày trong khối marker
  `LO-TRINH-DU-LIEU-LUAT-NGAY` (ngày lịch người xem, đúng ngày mốc chưa qua), đường đọc-cũ (năm ca),
  ví dụ lọc theo `nhom`.
- GUIDE: một đoạn trong mục lộ trình trỏ tài liệu. CHANGELOG: mục Unreleased.

## Task 3 — ca đo

Theo `evals.yaml` của hồ sơ; dùng lại `kho()`, `HO_SO`, `banSao`, `chayDo`, `napLT`, `khoTT` của tệp.
Bộ vẽ «trước vòng» = `git archive 7e965b54 scripts lib skills` (hàm `banGocX1()`, cùng nếp `bo2210`).
Bộ đọc HTML độc lập viết lại trong ca bằng regex trên trang, không gọi hàm vẽ nào. LT-120 chạy
`SCRIPT` nội tuyến của trang trong `vm` với DOM tối giản dựng từ các `li[data-ngay]`.

## Task 4 — trang mẫu của hồ sơ đã ký

Hai trang mẫu là vật máy sinh mà ca LT-06-mau và LT-99-mau so với bản vẽ lại; trang có thêm khối nên
phải vẽ lại (`lo-trinh-mau.mjs`, `lo-trinh-mau-trang.mjs --chup`). Phần người nhìn không đổi (AC-3) —
ảnh chụp lại chỉ để băm nguồn khớp. Hai hồ sơ đã ký `viec-ke-theo-plan`, `trang-lo-trinh-doc-mot-phut`
cũ đi ở mốc 2.27 như mọi lần đổi bộ vẽ; ghim lại ở chiến dịch phát hành, không trong vòng này
(GUIDE §7.1 — re-pin theo release).

## Lựa chọn chịu lực

- Tách `nhomTienDo` và `conViec` thành hàm dùng chung cho cả phần vẽ lẫn khối — để trang và khối
  không thể chia khác nhau (gap-probe P1 #3).
