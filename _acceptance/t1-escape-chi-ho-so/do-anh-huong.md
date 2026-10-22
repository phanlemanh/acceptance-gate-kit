# Số đo ảnh hưởng — PR nào lẽ ra bị bản vá chặn thêm

Đo 22/10/2026, ở bước thiết kế (sau gap-probe P0). Script dùng một lần (không vào kho): với mỗi commit first-parent của
nhánh chính từ 01/06/2026, lấy diff so cha thứ nhất; commit «chạm vật» khi có tệp ngoài `_acceptance/` không khớp
`t1_skip_globs` của config ở commit đó. Commit chạm vật mà có tệp `_acceptance/` nhưng KHÔNG tệp nào thuộc thư mục `_acceptance/<slug>/` ở gốc git có
`contract.md` ở commit đó → răng cũ cho qua, bản vá chặn. Chia theo lý do của tệp `_acceptance/` có mặt. Tên kho riêng
đã ẩn; onehub-invest và kit giữ tên (đã nêu trong hợp đồng).

| Kho | Commit (chạm vật) | Tệp gốc | Hồ sơ fixture ngoài `_acceptance/` của cổng | Thư mục không hợp đồng | Chỉ `opportunity.md` | Xoá hồ sơ |
|---|---|---|---|---|---|---|
| acceptance-gate-kit | 1258 (641) | 2 | 2 | 0 | 3 | 0 |
| kho A | 474 (377) | 5 | 0 | 3 | 0 | 0 |
| kho B | 40 (23) | 8 | 0 | 0 | 1 | 0 |
| kho C | 53 (30) | 1 | 0 | 0 | 0 | 0 |
| kho D | 157 (90) | 2 | 0 | 0 | 0 | 0 |
| kho E | 208 (161) | 3 | 0 | 0 | 0 | 0 |
| onehub-invest | 144 (142) | 1 | 0 | 0 | 0 | 0 |
| kho F | 565 (8) | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | | **22** | **2** | **3** | **4** | **0** |

Một commit kho A tính ở cả cột tệp gốc lẫn cột không hợp đồng; tổng commit khác nhau là 30. Cột fixture đo bằng lượt
thứ hai cùng ngày, khi định nghĩa «hồ sơ» thu về thư mục `_acceptance/` của chính cổng (mọi kho đo được đặt cổng ở gốc
git). Một kho tiêu thụ thứ chín (kho có vai nhận kit từ
19/10) không có nhánh chính ở bản sao local — chưa đo.

**Commit loại «tệp gốc» là gì** (đọc tiêu đề + tệp ngoài `_acceptance/`):

- Bảo trì lớp kit — khởi tạo kit (onehub-invest `d2a21a9` «khởi tạo Acceptance-Gate Kit 2.32.0»; kho E «acceptance-gate
  setup»), chép lại / nâng lớp chép CI (kho A «acceptance-gate-ci-1.9.2»; kho E «CI chạy cổng từ kit ghim sha»), bỏ cổng
  vendored (kho B). Diff gồm `scripts/pre-merge-check.sh`, `lib/*.cjs`, workflow CI cùng `_acceptance/config.yaml`.
- PR tính năng thật mang code ứng dụng, đi qua chỉ nhờ tệp gốc (kho A ba PR `feat/…`, `fix/…`; kho B, kho C mỗi kho
  một PR) — đúng lớp lỗ của ca onehub-invest.
- Ở kit: hai PR tài liệu/manifest.

**Hệ quả cho bản vá:** sau khi một kho chép bản vá vào lớp CI, PR chép lại lớp CI kế tiếp của kho đó (đổi
`scripts/`, `lib/` — ngoài T1 ở mọi kho đo được) cũng phải kèm hồ sơ — kể cả chính PR mang bản vá vào kho, vì CI chạy
bản chép ở HEAD của PR.
