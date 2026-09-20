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

## Hai số đo thêm (20/09, từ một phiên kit khác đang làm ở kho crm)

**Lối (iii) — «bắt kho đổi nhãn» — đắt hơn bảng trên nói.** Đổi nhãn `ui-check` → `script`
ở MỘT hồ sơ kéo theo hồ sơ **đã đóng**: ở crm, hai eval của vòng đang chấm chạy lại thước
của `nhan-ung-dung-noi-tieng-viet` (đã ký, chủ kho cấm mở lại), và chính thước ấy mang
khuyết tật cần sửa. Lối (i) và (ii) không chạm hồ sơ đóng. Đây là lý do thứ hai để A/B đi
trước C, ngoài lý do «rẻ nhất và độc lập».

**«Tươi theo đường» và «chạy theo executor» là HAI câu hỏi tách được.** Kho crm đã có một
hiện thân chạy thật, không phụ thuộc executor:
`_acceptance/thuoc-khai-dung-tieng/rang/ghim-lai-da-xong.mjs` — rút mọi đường trong khối
`paths:` của `evals.yaml` (KHÔNG lọc theo executor), băm nội dung tại `verified_commit` và
tại cây, gọi tên từng đường lệch. Nó bắt đúng một ca thật 20/09 (bằng chứng `nen-chat` hoá
cũ vì `.githooks/gate-shape.json` đổi; sau khi ghim lại: 0/14 đường lệch).

Hệ quả cho thiết kế: pin có thể nói một câu MẠNH HƠN `evals_not_machine_touched` hôm nay —
«ô này không chạy lại, **và** `paths` của nó không đổi từ lần ký» — tức phân biệt
«không chứng lại nhưng vật đứng yên» với «không chứng lại và vật đã đổi». Khoá
`evals_not_machine_touched` của vòng 20/09 mới nói được vế sau.

## Ngưỡng mở ô

- ≥1 hồi quy UI lọt qua một lượt ghim mà dòng pin mang `evals_not_machine_touched` (đếm bằng
  lệnh ở GUIDE §7.1), giữa hai bản phát hành; hoặc
- owner gọi tên.

Khi mở: ô mới mang `Gốc:` trỏ hồ sơ crm có số (`tiep-thi-tuyen-doi-tac`) và hồ sơ kit gốc.
