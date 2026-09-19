# Hạt giống — một chữ `iterate` là mở được ô không cần neo (cửa sổ 2.16 → 2.17)

**Ngày:** 2026-09-19 · **Ổ:** chưa có ô — đây là SỔ, đúng luật ô-chỉ-mở-khi-có-neo.
**Gốc:** `acceptance-gate-kit/_acceptance/o-chi-mo-khi-co-neo-ngoai/` (park; hồ sơ đầy đủ ở nhánh `cong-dang/o-chi-mo-khi-co-neo-ngoai`) — lượt chấm 3 gọi tên
(sổ known-limits `o-chi-mo-khi-co-neo-ngoai#23`, severity high).

> Chữ trong tệp này là NGUỒN. Đừng đo lại trừ khi nghi số đã cũ.

## Vật và lỗi

`hangCho` trong `tests/plugins/vao-co-o.test.mjs` (bản mới, nhánh park) định nghĩa hàng chờ Cổng Đáng là
`stage === 'discovery'` HOẶC (`stage === 'decided'` và `decision === 'build'`).

Nhưng enum `decision` của khuôn là `['build','iterate','park','kill']`
(`lib/workspace-record.cjs:44`), và `scripts/start-scan.mjs:502` xếp **build VÀ iterate vào
CÙNG ngăn** `inProgress` («Sắp mở vòng»):
`else if (decision === 'build' || decision === 'iterate') inProgress.push(...)`.

Nghĩa là ô `stage: decided` + `decision: iterate` chưa có hợp đồng đứng **đúng chỗ** ô `build`
đứng — sắp mở vòng, chưa qua Cổng Phạm vi — mà răng neo bỏ qua hoàn toàn.

**Đo được (lượt chấm 3 dựng lại):** fixture `_acceptance/o-iterate/opportunity.md` với
`stage: decided`, `decision: iterate`, thân bài KHÔNG có dòng `Gốc:` → vị từ `neoErrs` trả
`[]` (im, qua cổng). Cùng hồ sơ đổi `decision` thành `build` → trả `o-iterate: thiếu Gốc`.

**Người trả giá:** owner — luật «ô chỉ mở khi có neo» có một lối vòng dài đúng một chữ. Lớp
«allowlist thiếu RED ngoài danh sách».

## Đường rẻ khi mở lại

Hỏi `start-scan` thay vì chép enum: hàng chờ = tập slug ở ngăn `inProgress` + `gates` của
chính bộ quét, thay cho hai điều kiện gõ tay trong ca. Cùng nếp đã dùng cho
`DA_THONG_CONG_2` và `frontmatterField` — một nguồn, bên đọc HỎI.

**Cảnh báo:** đừng chỉ thêm `|| de === 'iterate'` — đó là vá theo tên, và enum còn đổi được
lần nữa. Vá theo tên đã nổ hai lần ở kho này (VC8 ghim chặng, 22/08 và 23/08).
