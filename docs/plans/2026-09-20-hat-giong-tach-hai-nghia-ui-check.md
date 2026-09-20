# Hạt giống — Tách hai nghĩa của `executor: ui-check`

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(chạm `lib/evidence-core.cjs` hoặc `lib/lop-nhin-thay.cjs` — bộ đọc vendored ở mọi kho).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` (design §3 C1) — owner giữ quyền
quyết, máy không tự chọn.

## Lỗ

`executor: ui-check` gánh hai nghĩa: (1) neo nghĩa vụ lớp nhìn-thấy (`lop-nhin-thay.cjs`,
W8, thẻ hai cổng, NOTE pre-merge); (2) định tuyến làn ghim lại (`REPIN_MACHINE_EXECUTORS`).
Làm đúng (1) thì mất chốt máy ở (2). Vòng gốc chỉ làm pin NÓI RA (khoá `evals_not_machine`,
`evals_not_machine_touched`), không tách nghĩa.

## Ba lối đã thấy (chưa lối nào chọn)

| Lối | Được | Mất |
|---|---|---|
| (i) ui-check có `cmd` máy thật, không `steps` → làn ghim lại chạy | AC kiểu-lệnh có chốt máy | làn cần dev_server/driver; đổi bên đọc lib (T3) + mọi kho vendor lại |
| (ii) trường `lane: machine` trên eval ngoài máy | kiểu executor giữ nghĩa (1) | thêm một lời khai người gõ — lớp ADR 0016 phải dựng luật hai vế |
| (iii) nghĩa (1) đổi neo sang `layer: ui-observed` | một trường một nghĩa | 4 bộ đọc đổi cùng lúc, hồ sơ cũ đi đường đọc-cũ |

## Ngưỡng mở ô

- ≥1 hồi quy UI lọt qua một lượt ghim mà dòng pin mang `evals_not_machine_touched` (đếm bằng
  lệnh ở GUIDE §7.1), giữa hai bản phát hành; hoặc
- owner gọi tên.

Khi mở: ô mới mang `Gốc:` trỏ hồ sơ crm có số (`tiep-thi-tuyen-doi-tac`) và hồ sơ kit gốc.
