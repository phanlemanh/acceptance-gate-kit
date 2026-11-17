# Kế hoạch thi công — phan-du-bo-cuc-moi-vong-bon

Hợp đồng: `_acceptance/phan-du-bo-cuc-moi-vong-bon/contract.md` (duyệt 17/11, Phan Le Manh; nhận khuyến nghị Hỏi-1…Hỏi-5).
Thiết kế: `docs/superpowers/specs/2026-11-17-phan-du-bo-cuc-moi-vong-bon-design.md`. Hạng T2 — không Gate 1.5.

Thứ tự theo bài học vòng ba: **luật tĩnh của thước trước**, rồi từng nhóm sửa kèm chế độ đo của nó; mọi việc commit ngay khi
verify xanh. Mọi lệnh chạy bằng Node 24 (`export PATH="/opt/homebrew/opt/node@24/bin:$PATH"`).

Tệp vòng khai (`TEP_VONG`, sáu tệp, cả sáu đã ở khối tự đúng đường vòng hai ∪ vòng ba):
`tests/scripts/{additive-only.test.mjs, can-cu-s1.ca.mjs, kho-moi-cai-goi-road-map.test.mjs,
khoi-khuon-tren-the-cong.test.mjs, khuon-loi.test.mjs, cua-tin-hieu-giua-chien-dich.test.mjs}`.

| # | Việc | Tệp | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| T1 | Khung thước `rang/giu-khoa-4.mjs` + `--tinh` + bộ tự kiểm `rang/giu-khoa-4.test.mjs` (luật tệp, luật dòng nghi thức, ca IM/ĐỎ trên bản sao có commit nhánh chính lạ) | `rang/giu-khoa-4.mjs`, `rang/giu-khoa-4.test.mjs` | `node …/giu-khoa-4.mjs --tinh` PASS (trước khi sửa tệp kiểm: đỏ «khai mà nhánh không sửa» — đúng) · tự kiểm phá thử đỏ | E8 | false |
| T2 | Luật so đề nghị `rang/tui-cu-suc-chua.mjs` + `--mp` (túi thô, tái hiện 43, đề nghị 0, đối chứng xoá hai tên, vi phân ba hình) | `rang/tui-cu-suc-chua.mjs`, `giu-khoa-4.mjs` | `--mp` PASS; xoá một tên → đề nghị báo thiếu tên ấy | E6 | false |
| T3 | K4-TB: `banGocVong()` chép từng mục con `skills/` tới `duong(<mục>, {kho, ref: mb})` ở hai tệp + `--moi --nhom tb` (hai chỗ đặt bản gốc, chiều đỏ bản GOC_VONG) | `khoi-khuon-tren-the-cong.test.mjs`, `khuon-loi.test.mjs`, `giu-khoa-4.mjs` | hai tệp xanh ở cây phẳng; `--moi --nhom tb` PASS | E1 | false |
| T4 | KM-1 / CT-10-do: tên gói theo vai, đường import tính từ bộ dịch + `--moi --nhom lt` | `kho-moi-cai-goi-road-map.test.mjs`, `cua-tin-hieu-giua-chien-dich.test.mjs`, `giu-khoa-4.mjs` | hai tệp xanh ở cây phẳng; `--moi --nhom lt` PASS | E9 | false |
| T5 | DV5: `quaDonNha`, `DON_NHA_DOI`, năm ca DV5q-co/-im/-do/-ngoai, DV5qu + `--moi --nhom dv5` (mô phỏng bước 4 lên dòng chú thích) | `additive-only.test.mjs`, `giu-khoa-4.mjs` | `cvsck_dv5` xanh đủ năm dòng mới; phá `quaDonNha` rơi một vế → DV5q-co/-do đỏ; `--moi --nhom dv5` PASS | E2, E3 | false |
| T6 | KK-6 so-that: `--root` = bản bung `chaDonNha` khi cây không phẳng, in «gốc đọc sổ» + `--moi --nhom so-that` (kèm phá `gate-card.js` của kho mới) | `can-cu-s1.ca.mjs`, `giu-khoa-4.mjs` | `can_cu_s1_ca` xanh; `--moi --nhom so-that` PASS | E4, E5 | false |
| T7 | `--cu` (túi HEAD ⊇ túi GOC_VONG cho sáu tệp, CU-DO tự phá) | `giu-khoa-4.mjs` | `--cu` PASS | E7 | false |
| T8 | Đo tay trên cây kịch bản thật (bản sao tạm kho `delivery-loop`, chỉ đọc), điền `gui-b2.md` mục «Số đo trên cây kịch bản thật» | `gui-b2.md` | số kèm sha | Notes | false |

Mọi việc chạm cùng một tệp thước, nên không có hai việc `independent: true` — S3 chạy tuần tự trong phiên chính.

Ranh giới: không sửa `scripts/`, `lib/`, `skills/`; không sửa hồ sơ đã ký; không ghi gì ở kho `delivery-loop`;
`routing-baseline.txt` chỉ do nghi thức ký ghi.
