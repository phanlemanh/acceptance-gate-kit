# Hạt giống — Lớp CI chép tay tự xoá: hai dòng lệch đường, xoá danh sách chép, gắn tag mốc

**Ngày:** 2026-09-23 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2, vòng TRỪ,
đi SAU vòng S1 (`2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`, owner xếp trước 23/09)
Gốc: oneflow PR #127, artifact-platform #391, media-library #66, floorplanstudio #34, MapPoster #58 — sáu
kho nâng 2.18.1 cùng ngày, danh sách chép thiếu `opportunity-template.md` (lần thứ ba cùng lớp), bốn
kho chạy CI với 7–8/15 lớp không tín hiệu, oneflow giữ fork 508 dòng bỏ răng P184.
Gốc: crm PR #70 (22/09) — `MODULE_NOT_FOUND` ngày cài vì thiếu `trang-thai-ho-so.cjs`.
Số đo: `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md` §2, §3b–3d.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Owner đã quyết 23/09

1. Kho **theo sát từng mốc** → chi phí chép lặp là thật, mỗi mốc × sáu kho.
2. Đường mặc định = **chạy cổng từ bản kit ghim sha** (GUIDE §5.3 đã đổi cùng ngày, T1).
3. Kit **không nhận** `feature_scope`; oneflow bỏ fork (đo 4 merge gần nhất: verdict không đổi).
4. Nguyên tắc: **bỏ tốt hơn thêm**.

## Việc của vòng (toàn TRỪ + sửa lệch, không luật mới)

| # | Việc | Chiều đỏ của ca |
|---|---|---|
| 1 | `scripts/pre-merge-check.sh:376` và `:397` đọc `lib/md-section.cjs`, `lib/out-of-contract.cjs` theo `$ROOT` — đổi sang thư mục của cổng như 5 chỗ còn lại | chạy gate từ bản kit lên cây crm KHÔNG có `lib/` → hôm nay 3 VIOLATION «không đọc được mục Known limits»; sau sửa → giống hệt bản chép |
| 2 | XOÁ khối `INIT-CI-COPY-LIST` (`commands/acceptance-init.md`), khối `GUIDE-CI-COPY-LIST` + đoạn «Đường cũ» (GUIDE §5.3), ca `CE2*` (`tests/scripts/consumer-esm.test.mjs`), lời nhắc «re-copy pre-merge-check.sh» ở `commands/signoff.md:259` và `acceptance-init.md:184` | grep toàn kho không còn `COPY-LIST`; suite scripts xanh; `acceptance-init` viết khuôn workflow §5.3 thay bước chép |
| 3 | Gắn tag `v<phiên bản>` tại commit ký mốc (bước của `/signoff` cho hồ sơ `release-*`), để kho ghim theo tag thay sha | mốc kế có tag; `git ls-remote --tags` thấy |

Điều kiện mở: owner gọi tên sau khi mốc S1 (2.18.2) đã cắt. Ngưỡng thay thế nếu S1 chậm: thêm một
kho cài đỏ vì hạ tầng kit ở đường chép.

## Không làm (và vì sao)

- Không thêm «cổng tự kiểm đủ bộ tệp» hay «in phiên bản»: bản chép biến mất thì lớp lỗi biến mất,
  không cần thước mới (owner: bỏ tốt hơn thêm).
- Không nhận `feature_scope`: khoá `paths:` là nút hiệu năng P1 của kit («khai thiếu vô hại»), fork dùng
  nó làm phạm vi đúng-sai; tác giả hồ sơ tự khai scope cho thước chấm mình; 508 dòng grep-YAML; 4 merge
  đo được không đổi verdict.
- Không auto-follow phiên bản kit: vi phạm «không đổi engine dưới chân vòng đang chạy».
