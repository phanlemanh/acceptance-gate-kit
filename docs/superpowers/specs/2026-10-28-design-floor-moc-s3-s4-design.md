# design-floor bước 2d — móc cuối S3 và S4 (FL5)

Hồ sơ: `_acceptance/design-floor-moc-s3-s4/` · hàng FL5 của `docs/plans/lo-trinh-kit.json` (phủ GN3, GN4, DO1) ·
kế hoạch: `docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` bước 4 · dựng trên FL4 (móc S0/S1, #433) và FL1
(cổng thiết kế trả KHÔNG-ĐO-ĐƯỢC, #434).

## Vấn đề

Sau FL4, vòng feature-loop biết bậc design-floor của kho (M0–M3) và in khối «Sàn thiết kế» ở Cổng Phạm vi, nhưng
không bước nào sửa hay chấm giao diện theo design system: kit cố ý thả ba luật design system (`lib/p-tiers.json`), nên
hôm nay kho có hex thô trong tệp giao diện vẫn qua S4. Hai điểm móc còn lại của bước 4:

- **Cuối S3** — `ui autofix --write` rồi sinh lại tệp dẫn xuất, commit TRONG S3, trước S4.
- **S4** — tuân thủ design system bằng `ui token-coverage` và hex thô, chạy thành executor `script` (0 token).

Luật đi kèm: không ghi gì sau commit S4 (ADR 0007); chỉ luật đã phân xử mới được chặn; không móc `ui gate` vào S4 khi
khối máy của hợp đồng nhập còn giới hạn DF-07.

## Thiết kế

### Cuối S3 — `scripts/design-floor-s3.mjs --root . --slug <slug> [--base <ref>]`

1. Đọc bậc bằng `docBac` của FL4. M0 → không in, thoát 0, không đổi gì.
2. Chụp trạng thái cây (tệp đã sửa và tệp chưa theo dõi) trước khi chạy. Việc dở có sẵn không bị đụng và không vào
   commit máy. Chỉ khi một đích autofix đã sửa chưa commit từ trước → thoát 2 gọi tên tệp, không chạy gì.
3. Đích autofix = tệp `.html`/`.htm` mà diff `<base>...HEAD` chạm, khớp `design.surface_globs`, còn trên đĩa. Mỗi đích:
   `argv_ghi` của lệnh `autofix` trong khối máy (`autofix {dich} --write --json`) qua bản gói `design-floor/dist/ui.mjs`.
   `--base` vắng → merge-base với nhánh chính (cùng cách `s4-args.mjs` tìm).
4. Sinh lại: các lệnh ở `design_floor.sinh_lai` (danh sách) chạy tuần tự ở gốc kho, sau autofix. Lệnh thoát ≠ 0 → lệnh
   S3 thoát 1 gọi tên lệnh, không commit (cây để nguyên cho người đọc). Không khai → dòng «chưa khai lệnh sinh lại».
5. Có tệp đổi → MỘT commit `design-floor S3: autofix N tệp, sinh lại M lệnh — <slug>` chỉ gồm tệp mà chính lệnh làm
   đổi hay tạo (so với ảnh chụp ở bước 2), ngoài `_acceptance/`. Không đổi gì → không commit. In một dòng tóm tắt.

Gọi ở khối `DESIGN-FLOOR-S3` của SKILL feature-loop, S3 bước 3, NGAY TRƯỚC khi hợp đồng sang `implemented`.

### S4 — `scripts/design-floor-s4.mjs --root . [--base <ref>] [--json]`

Chỉ đọc. Đích = tệp diff `<base>...HEAD` khớp `design.surface_globs`, còn trên đĩa.

- **Hex thô** (luật đã phân xử duy nhất ở v1): `#` + đúng 3/4/6/8 chữ số hex, không đứng sau `&` hay chữ/số, không có
  chữ/số liền sau, trong tệp đích, trừ tệp `design_floor.tokens`. Mỗi chỗ một dòng `tệp:dòng giá-trị`.
- **Độ phủ token** (M2/M3): `ui token-coverage {dich} --tokens {tokens} --json` trên đích `.html`/`.htm`. Mã 0 đạt,
  2 trượt, 3/4/5 «không đo được ở đây (mã k)»; mã khác hay lệnh chết → «lệnh ui lỗi (mã k)», lệnh S4 thoát 1.
- **Chặn theo bậc** (Hỏi-2, khuyến nghị — bậc đơn điệu): bảng một nguồn là khối `DF-CHAN-THEO-BAC` trong Notes của
  hợp đồng; ca AC-6 rút bảng từ đó. Tóm tắt: M1 chỉ hex thô (chặn); M2 hex thô chặn, độ phủ token cảnh báo; M3 cả hai
  chặn; không đo được không bao giờ chặn.

Khối `DESIGN-FLOOR-S4` của SKILL (mục Làn design) nói cách nối. Kho nối lệnh thành `executors.design.floor` (wire tay như `executors.design.gate`, GUIDE «Wire executors.design»);
hồ sơ chạm giao diện trỏ eval `cmd: config:executors.design.floor`. Lệnh bậc S0 ở M1+ khi kho chưa khai khoá ấy in thêm
một dòng «S4 chưa chấm tuân thủ design system — chưa khai executors.design.floor».

### Răng `ui gate`

Ca `GATE-DF07` trong `tests/design-floor/`: khối `DESIGN-FLOOR-S4` của SKILL hay `scripts/design-floor-s4.mjs` nhắc
`ui gate` (hay argv `gate`) trong lúc mục chờ FL-C1 còn ở `chan_troi` của `docs/plans/lo-trinh-kit.json` → đỏ «móc ui gate
vào S4 khi FL-C1 còn chờ»; hoặc trong lúc `gioi_han` của khối máy có DF-07 → đỏ «… khi khối máy còn giới hạn DF-07».
Hôm nay FL-C1 còn chờ (bản vá A đã làm DF-07 xanh nên `gioi_han` rỗng) — răng canh thật trên `main`.

### Vòng mẫu S0→S5

Ca `VONG-MAU`: kho fixture M2 sinh bằng mã chạy bậc S0, S1 của FL4, S3 (commit), S4 (lệnh chấm), ghi hồ sơ
`verified_commit` = HEAD sau S4 và chữ ký, rồi `scripts/pre-merge-check.sh` — không VIOLATION. Đột biến: lệnh S4 gọi
autofix `--write` → pre-merge báo `evidence is stale` gọi tên tệp.

## Ngoài phạm vi

- `ui gate` ở S4 (FL-C1 — chờ DF-07 xanh và một vòng thật ở kho tiêu thụ).
- Máy tự sửa cấu hình kho (thêm `executors.design.floor`, `design_floor.sinh_lai`) hay tự nâng bậc.
- Đo thí điểm DO1 trên onehub-invest — năm tiêu chí chết cần ≥10 vòng giao diện thật; hợp đồng này chỉ khai đường đo.
- Hex thô trong tệp không khớp `design.surface_globs`; luật màu/font/bo góc khác của design system.

## Bốn phép thử North Star

1. **Không ghi sau S4** — S3 commit trước khi sang `implemented`; lệnh S4 chỉ đọc (ca băm cây); vòng mẫu chứng bằng
   pre-merge-check; răng `ui gate`.
2. **Không thêm lượt gọi người** — không dòng thẻ mới; chặn ở S4 là REJECT thường của lượt chấm.
3. **Chi phí máy** — 0 token: autofix, token-coverage, quét hex là lệnh tất định; một commit S3 mỗi vòng có giao diện.
4. **Chiều đỏ** — mỗi kiểm mới có cặp lành/hỏng trên cùng fixture, thông điệp ghim; đột biến mỗi điểm móc.
