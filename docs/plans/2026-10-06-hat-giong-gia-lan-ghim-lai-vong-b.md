# Hạt giống — giá làn ghim lại, Vòng B (thước không gọi tên · carry theo băm đầu vào)

**Ngày:** 2026-10-06 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3 (chạm `lib/**`, `scripts/pre-merge-check.sh`).
Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop — cùng đợt crm-onehub/_acceptance/eval-model-that-dung-luc.
Tách ra từ vòng `_acceptance/gia-lan-ghim-lai/` (chủ kho thu vòng về Vòng A, 06/10 08:43, sổ điều phối crm).

## Hai điểm của Vòng B

- **Đ1 — tệp test chỉ làm hoá cũ hồ sơ gọi tên nó** (`risk_tiers.test_globs`). Thiết kế đủ ở
  `docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md` §Đ1, gồm định nghĩa «gọi tên»
  (paths nhắm thước HOẶC lệnh giải chính xác, lệnh không giải được → giữ), nghĩa SỞ HỮU và lưới là suite.
- **Đ2 — carry kết quả eval theo băm đầu vào** (`feature_loop.repin_carry`). Thiết kế ở cùng tệp
  §Đ2: băm = khối eval + lệnh đã giải + tệp khớp `paths` ∪ mọi tệp lệnh gọi tên + env khai; bên đọc
  kiểm chuỗi nguồn, tuổi so với dòng chống lưng; `carry_lech` là ngưỡng tự kiểm.

Phản biện context sạch 06/10 đã soi hai điểm này (P0 băm thiếu tệp lệnh nạp, P1 ma trận gọi tên,
P1 bên đọc so tuổi và kho chỉ có lớp CI) — bảng ở `_acceptance/gia-lan-ghim-lai/gap-probe.md`,
hợp đồng nháp 13 AC ở lịch sử commit `661d88cd` của tệp `_acceptance/gia-lan-ghim-lai/contract.md`.

## Vì sao chưa làm

Ca sinh ra Đ1 (R1g: bốn dòng test kéo E11 chạy lại 4 giờ) đã tan ở gốc: crm đổi E11 của
`tra-loi-tin-nhac` sang judgment 06/10, R1g ghim lại 6 phút. Số nền 14 ngày cho Đ1 chỉ 12/203 cặp
ghim lại có diff toàn tệp test. Đ2 lớn theo số đếm (1 726/2 912 lần chạy eval carry được) nhưng là
điểm duy nhất đổi cái được tính là «đã chứng», nên đi sau khi Vòng A đã ở kho.

## Ngưỡng mở (đang đếm: 0)

Đo lại trên crm SAU khi E11 không còn trong làn ghim lại: (a) Đ1 — ≥ 3 làn trong 14 ngày mà hồ sơ
hoá cũ chỉ vì tệp test nó không gọi tên; (b) Đ2 — phút eval thực chạy chiếm ≥ 50 % `wall_s` của
làn, hoặc «chi phí đo» trong tổng kết của Vòng A cho thấy eval model thật chạy lại với đầu vào
không đổi ≥ 5 lần/tuần. Đếm: dòng `repin` và khoá `tong_ket` trong `_acceptance/*/run-log.jsonl` của crm.
