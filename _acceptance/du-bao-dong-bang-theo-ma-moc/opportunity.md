---
schema_version: 1
slug: du-bao-dong-bang-theo-ma-moc
feature: Chủ kho dời hay ghi đè ngày mục tiêu của một mốc mà trang lộ trình vẫn giữ dự báo lúc mốc bắt đầu, cờ quá tải vẫn tính theo mục tiêu mới, và phép đo lệch vẫn đọc được mốc ấy
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-16T01:43:27Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 16/10 — xác nhận luôn ngoại lệ luật (b)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM6b
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM6b của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026 (cùng gói với RM6, hàng này đứng trên RM6).

Gốc: kit/_acceptance/lo-trinh-gio-may/ — mục Ngoài-6 của Cổng Bằng chứng RM6 (16/10), chủ kho chọn «mở hợp đồng mới»;
hạt giống `docs/plans/2026-10-16-hat-giong-du-bao-dong-bang-theo-ma-moc.md`.

**Ai đau:** chủ kho, và mọi kho tiêu thụ có lộ trình. RM6 đóng băng dự báo của mốc lúc mở việc, nhưng tìm lại nó bằng
tên mốc **kèm ngày mục tiêu**. Ngày mục tiêu đổi — dời mốc, hay ghi đè bằng ngày phát hành thật — thì dự báo không khớp
nữa: trang lộ trình mất dòng «dự báo lúc bắt đầu», cờ «mốc quá tải» tắt, và phép đo lệch báo «chưa đóng băng».

**Vì sao gấp:** thói quen hiện tại là ghi đè ngày mốc bằng ngày phát hành thật đúng hôm phát hành (5/5 mốc 2.25 → 2.29,
số đo của hồ sơ RM6). Không sửa thì ngưỡng Cổng Đáng của RM6 — lệch dự báo ≤ 1 ngày ở mốc phát hành đầu tiên sau gộp —
không đọc được ở chính mốc đầu. Ngưỡng mở của hạt giống: trước khi cắt mốc ấy.

**Số đo trước** (máy đo 16/10 trên dữ liệu thật của kit, bản `main` 31c5b8df): mở hàng này đã đóng băng dự báo thật đầu
tiên của kit (`du-bao.json` của ô này, mốc «Gói road-map hoàn tất theo B′ 19/10»). Trang lộ trình vẽ từ dữ liệu ấy có
**1** dòng «dự báo lúc bắt đầu (16/10): hoàn tất 17/10». Dời ngày mốc 19/10 → 18/10 trên một bản sao: **0** dòng. Tỉ lệ
mất hôm nay là 100 % mỗi lần ngày mục tiêu đổi.

**Ý định:** dự báo đóng băng gắn với mốc theo những hàng mốc chở lúc đóng băng, không theo ngày. Không thêm cổng, không
thêm lượt gọi người, không đổi khuôn `du-bao.json` đã ghi (tệp cũ vẫn đọc được).

**Luật chiều rộng (b):** vòng sửa phép đo của RM6 trong cùng gói road-map chủ kho gọi tên 15/10 — vòng meta thứ năm của
cửa sổ sau 2.30 (MC1, RM1, RM2, RM6, RM6b). Chữ ký ở cổng này xác nhận ngoại lệ, như RM2 và RM6.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Danh sách mã hàng lúc đóng băng (`moc.hang`) cùng hồ sơ thuộc lộ trình đủ chỉ ra MỘT mốc | Dự báo gắn nhầm mốc khác hoặc lộ trình khác cùng mã | Ca đặc hiệu: mốc khác không giao mã · lộ trình khác cùng mã · hàng dời mốc sau đóng băng | Chưa thử |
| 2 | Ngưỡng RM6 đọc bằng `--do-lech` ở mốc đã ghi đè ngày | Ngưỡng vẫn không đọc được | Ca dời ngày trên `--do-lech` + đo lại trên dữ liệu thật của kit khi cắt mốc | Đã đo chiều hỏng (1 → 0) |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở mốc phát hành đầu tiên bắt đầu sau khi RM6 lên `main`, sau khi ngày mốc bị ghi đè bằng ngày
  phát hành thật, phép đo lệch (`lo-trinh.mjs --do-lech`) có in độ lệch của mốc ấy không?
- Kết quả nào là SỐNG: mốc ấy có ít nhất một hồ sơ mang `du-bao.json`, và phép đo lệch in dòng «dự báo … · khép thật … ·
  lệch N ngày» cho mốc ấy.
- Kết quả nào là CHẾT: phép đo lệch in «chưa đóng băng dự báo» cho mốc ấy trong khi một hồ sơ của mốc có `du-bao.json`.
- Timebox: 2026-11-05 (mốc «Tinh chỉnh sau hai đợt thử»). Tới hạn mà mốc ấy chưa khép đủ hàng → «chưa đọc được ở đây»,
  không phải CHẾT.

## Kết quả prototype

Không dựng prototype — sửa bộ đọc của bộ công cụ; đo bằng ca hai chiều và bằng dữ liệu thật lúc cắt mốc.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn `du-bao.json` và phép đo lệch | hồ sơ `_acceptance/lo-trinh-gio-may/` (RM6, đã ký 16/10) | triết-lý/logic | có | |

## Cổng 0

- **decision = build** Căn cứ: chủ kho chọn «mở hợp đồng mới» cho Ngoài-6 của RM6; số trước 1 → 0 dòng dự báo khi dời ngày mốc; phải gộp trước lần cắt mốc tới.
- **disposition = —** Căn cứ: không prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** nhận nguyên ngưỡng máy đề xuất (SỐNG: phép đo lệch in độ lệch của mốc đã ghi đè ngày · CHẾT: in «chưa đóng băng» khi mốc có hồ sơ đã đóng băng · hạn đọc 05/11).

## Thước đo thành công → ứng viên criterion

- Dời ngày mục tiêu → trang vẫn có dự báo đóng băng, cờ quá tải tính theo mục tiêu mới → AC trang.
- Dời ngày mục tiêu → `--do-lech` in khối lệch, không «chưa đóng băng» → AC đo lệch.
- Dự báo không gắn nhầm: mốc khác · lộ trình khác cùng mã · hàng dời mốc sau đóng băng → AC đặc hiệu.
- Tệp `du-bao.json` đã ghi trước bản sửa vẫn đọc được → AC đọc-cũ.

## Out of scope từ khám phá

- Đổi khuôn `du-bao.json` (thêm khoá định danh mốc) — bộ đọc khoan dung đủ, đổi khuôn là mọi kho trả giá.
- Đóng băng lại khi mốc đổi hàng sau lúc đóng băng — phép đo lệch đã đếm «hàng thêm sau đóng băng».
