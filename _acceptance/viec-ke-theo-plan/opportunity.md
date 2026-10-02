---
schema_version: 1
slug: viec-ke-theo-plan
feature: Lộ trình vào kit, lát 1 — ổ cắm đọc file ý định của kho (khuôn sáu trường), máy suy trạng thái từ hồ sơ bằng bảng nhãn bản đồ sản phẩm, in ba dòng lên thẻ start và vẽ trang lộ trình cạnh PRODUCT-MAP.md; kit KHÔNG ghi vào file ý định
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Sử liệu: ghi 06/09 (hạt giống «việc kế theo plan»), park 18/09 vì thiếu neo (owner chọn đường
> B, decided_by Mạnh); **mở lại 02/10** sau khi crm nhận mốc 2.20.0 (crm-onehub#233 gộp
> `9660bf6c`) — neo thật ở dòng `Gốc:` dưới. Phạm vi ô = **lát 1** của hạt giống; lát 2 (skill cắt
> lượt) là ô khác, mở sau khi lát 1 ký. Là vòng meta có kho chờ nhận (crm đang chạy hai lộ trình).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/cap-nhat-tuan-okr — lượt 4 của lộ trình OKR (23–26/09): 23 trong 48 tin owner ở phiên điều phối là hỏi tiến độ, vì bảng đồng hồ nhiều lượt không tồn tại (finding 26/09 §4, §5.4 xếp là «CỘNG, chờ owner phê»; owner phê 02/10)

Chủ kho đã tự dựng lộ trình **ba lần** ở hai kho trong năm tuần, mỗi lần một khuôn khác (crm OKR
28 hàng · crm Kho tài liệu 11 hàng · oneflow 24 tuần), và lần nào trạng thái cũng gõ tay dù sự thật
đã nằm trong hồ sơ cổng: 12 commit «bản chụp» trong 4 ngày cho một lộ trình; hàng vẫn trắng khi hồ
sơ đã verified (oneflow 05/09). Phiên vào kho không biết hàng kế: bốn lượt đọc file (oneflow 05/09).
Người trả giá: owner ở phiên điều phối (hỏi tiến độ thay vì quyết) và mọi phiên S0.

Bằng chứng, hai lớp (ý định độc lập · trạng thái suy), khuôn sáu trường, chiều đỏ, thước, rà soát
thông lệ và chỗ ngược playbook: `docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md` §«Cập nhật
02/10» và §8. Hình: `docs/plans/assets/2026-10-02-lo-trinh-vao-kit/`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Khuôn sáu trường (ma · cau_giao · hang · dung_tren[] · slug · bat_khi) + `vi_sao` + `moc[]` cấp file phủ được cả ba lộ trình đang sống mà không ép kho đổi trường tự do | khuôn thứ tư ra đời, mọi kho trả giá | viết tay khối sáu trường cho ba lộ trình (crm OKR, crm Kho tài liệu, oneflow) TRƯỚC khi có một dòng code — mẫu P0 của `nha-tai-lieu-router` | Chưa thử |
| 2 | Trạng thái suy từ hồ sơ bằng bảng nhãn bản đồ sản phẩm khớp trạng thái owner đang gõ tay ở crm (28 hàng) | máy in sai, owner lại gõ tay | so cột `trang_thai` của `lo-trinh-okr.data.js` với nhãn máy suy, in bảng lệch kèm lý do | Chưa thử |
| 3 | Ổ cắm vắng thì im: kho không khai không thấy gì, không cờ, không đỏ | kho không dùng lộ trình trả giá | chạy start-scan + product-map trên 4 kho không khai, diff thẻ trước/sau = 0 | Chưa thử |
| 4 | Hàng ↔ hồ sơ qua `slug` + dòng `Gốc:` ngược đủ cho ca biên (một hàng hai vòng, một vòng nhiều mã, đổi hạng giữa đường) | thẻ in sai hàng kế | ba ca thật crm: okr-8 → 8a/8c · canh-kr-okr phủ 5 mã · 9b T2→T3 | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] *trang vẽ + ba dòng thẻ start có thay được việc hỏi tiến độ và gõ tay trạng thái không?*
- Kết quả nào là SỐNG: [đề xuất] trên hai lộ trình crm dùng ổ cắm, tin hỏi tiến độ/lượt ≤ nửa nền (nền 23/48, lượt 4 OKR) · 0 commit «bản chụp» chỉ đổi trạng thái sau khi ổ cắm chạy · 0 hàng tự khai lệch hồ sơ mà thẻ im.
- Kết quả nào là CHẾT: [đề xuất] owner vẫn gõ trạng thái tay sau hai lộ trình, hoặc ổ cắm làm kho không khai đổi thẻ/đỏ.
- Timebox: [đề xuất] một vòng, trần ba lượt chấm; ngưỡng đọc sau hai lộ trình crm kế tiếp (≤ 30 ngày sau phát hành).

## Kết quả prototype

Chưa dựng. Bản mẫu đang sống: `crm/docs/plan/lo-trinh-okr.{md,data.js,html}` (trang vẽ tay, bản
sống Artifact) — là vật để so khuôn và trạng thái, không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn dữ liệu lộ trình + trang vẽ | crm `docs/plan/lo-trinh-okr.data.js`, `.html` | khuôn hàng, mốc, view | có — rút sáu trường bind, bỏ 13 trường vận hành | — |
| Răng chống trôi A/B/C | oneflow `scripts/roadmap/roadmap-drift.mjs` | luật kho, băng | KHÔNG vào kit (lát C, mở khi ≥2 kho đòi) | — |
| Bộ vẽ từ hồ sơ + `--check` | kit `scripts/product-map.mjs`, `lib/workspace-record.cjs` (MAP_LABELS) | tiền lệ, dùng chung bảng nhãn | có | — |
| Ổ cắm trung tính | kit `discovery.brainstorm_skill` (start-scan.mjs) | khoá vắng thì im | có | — |

## Cổng 0

- **decision = …** Đề xuất `build` lát 1, hạng T2: một khoá config · bộ đọc khối + đối chiếu slug · ba dòng thẻ start · bộ vẽ HTML cạnh PRODUCT-MAP.md · feature-loop S0 nhận một hàng. Không cổng mới, không lệnh thứ tám, không ghi vào file ý định.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** ba ngưỡng SỐNG ở trên + hai thước từ git ghi cạnh năm dòng của hồ sơ mốc (tỉ lệ hàng sống qua Cổng Đáng · số hàng bị sửa sau khi vòng mở).

## Out of scope từ khám phá

- Không đưa ★, làn, ngưỡng 85%, ba lý do ngoại lệ, mốc 09/10 vào kit dưới dạng hằng.
- Không để kit ghi bất kỳ ô nào của plan; ◐ chỉ in, không ghi vào file.
- Không kit-hoá nấc 2 hạt giống (thẻ start đã có «Đang cân nhắc» kèm tuổi và cờ quá hạn).
- Không viết bộ đọc frontmatter thứ hai; không sinh lại bản đồ bằng bộ sinh cache khi bộ kiểm
  vendored của repo chưa nâng theo.
- Không gộp bản đồ sản phẩm với lộ trình (từ điển: «Product map, _Avoid_: roadmap»); khi mở ô thêm term «Lộ trình» = ý định thường-trú đứng cạnh.
- Không đưa skill cắt lượt (lát 2), băng/răng chống trôi (lát C), nấc 1–2 trong CRM vào ô này.
