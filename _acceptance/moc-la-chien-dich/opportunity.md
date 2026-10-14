---
schema_version: 1
slug: moc-la-chien-dich
feature: "Mỗi vòng thuộc một mốc: lộ trình cắm cờ vàng cho việc đang mở mà chưa thuộc mốc nào, và lúc mở vòng máy in tên phiên cùng nhóm thanh bên của mốc đó"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-14T09:03:39Z   # chủ kho gọi tên vòng 14/10 và gõ «duyệt» ở Cổng Phạm vi gộp; máy ghi «làm» theo đó (sổ d-…-12)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: MC1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — tệp `BAN-GIAO.md` viết tay lúc đổi tài khoản 14/10.
Hạt giống đủ (mô hình + số đo): `docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md` (PR #350).

Mở từ hàng MC1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`), mốc «Tinh chỉnh
sau hai đợt thử» 05/11. Chủ kho gọi tên 14/10: vòng sửa kit DUY NHẤT của cửa sổ sau mốc crm nhận 2.30.0
(luật chiều rộng (b)). Là phần THÊM vào kit (ADR 0018) — chủ kho duyệt đích danh ở Cổng Phạm vi.

**Ai đau:** chủ kho. 14/10 đổi tài khoản giữa ngày, thanh bên chỉ hiện phiên của tài khoản đang dùng → «không
biết việc nào đã xong, việc nào đang dở» — 3 lượt gọi người ngoài thiết kế trong nửa giờ. Việc thật vẫn nằm
trên đĩa và GitHub; cái gãy là lớp nhìn.

**Ý định (chủ kho 14/10):** lộ trình và mốc là kế hoạch tổng. Mỗi mốc là một chiến dịch; thanh bên là mỏ neo
của chiến dịch đang chạy; kho nhiều lộ trình thì chia theo lộ trình × mốc.

**Số đo trước (14/10, bằng bộ dựng lộ trình của kit hiện tại):**
- crm `onehub` @1997da85: OKR 19 mốc · 124 hàng · 13 hàng đang mở vòng, **4 không thuộc mốc nào** (F8, F23,
  F24, F26); Kho tài liệu 6 mốc · 1 hàng đang mở, 0 ngoài mốc; Việc và Dự án **0 mốc** · 1 hàng đang mở (DA0c).
  Các vòng MacBook Pro/M5 chạy hôm 14/10 (TB1, TH1, TH4, TH6, LT1c, DA2, DA3) chưa gộp nên chưa hiện ở đây.
- kit: 11 mốc · 37 hàng · 0 hàng đang mở ngoài mốc. Bốn kho khác (radar, oneflow, artifact-platform,
  media-library) không khai lộ trình → không đổi gì.
- Tên ngắn của hàng: crm đã ghi `ten_ngan` ở 124/124 hàng OKR, 14/14 Việc và Dự án, 1/12 Kho tài liệu; kit 0/37.

**Phạm vi gợi ý (máy được thu hẹp ở bước thiết kế; chủ kho chốt ở Cổng Phạm vi):**
1. Trang lộ trình: hàng có hồ sơ đang mở mà không thuộc mốc nào → cờ vàng. Chỉ cảnh báo, không chặn, không làm
   đỏ `--check`; kho không dùng mốc chạy như cũ.
2. Lúc mở vòng cho một hàng: máy in mốc của hàng, tên phiên `<mã> · <tên ngắn> (<kho>)` và tên nhóm thanh bên
   `<lộ trình> · <mốc>` (kho một lộ trình: `<mốc>`) — MỘT hàm máy sinh. Hàng chưa có mốc → một dòng trên thẻ
   Cổng Đáng sẵn có. App desktop dùng tên đó đặt tên và xếp nhóm; mặt không có thanh bên chỉ in.
3. NGOÀI vòng: chip của gói `dieu-phoi` dùng cùng hàm — vùng M5, chỉ ghi sẵn chỗ nối.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Người mất bản đồ chủ yếu vì thanh bên không mang mốc, không vì thiếu một trang tổng | Vòng này không giảm lượt hỏi; phải làm «bản đồ hiện trạng» của hạt giống | Đếm lượt hỏi hiện trạng ở lần đổi tài khoản/máy kế | Chưa thử |
| 2 | Kho dùng mốc chấp nhận cờ vàng mà không thấy là nhiễu | Cờ bị lờ, «cần sửa» phình | Đọc số cờ crm trước/sau (4 + 1 cờ mới trên ba lộ trình) | Đo được ở S4 |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] sau lần đổi tài khoản, đổi máy hay mất phiên kế tiếp, người có còn phải hỏi «hiện trạng thế nào» không?
- Kết quả nào là SỐNG: [đề xuất] 0 lượt hỏi hiện trạng ngoài thiết kế ở lần đổi kế — đếm ở dòng 2 luật (c) của hồ sơ mốc kế; mọi vòng mở sau ngày gộp có nhóm thanh bên theo mốc do máy sinh
- Kết quả nào là CHẾT: [đề xuất] ≥1 lượt hỏi hiện trạng ở lần đổi kế dù vòng đã có nhóm theo mốc → mở «bản đồ hiện trạng» của hạt giống
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử)
