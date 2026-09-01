---
schema_version: 1
slug: loi-moi-cong-may-sinh
feature: Lời mời cổng thành vật máy sinh — thẻ in câu gộp khuyến nghị bấm được, khối VIỆC-CỦA-ANH chỉ chứa điều-chỉ-người-biết, vá các đường fail-quiet của thẻ
owner: manh.phan@onemount.com
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-09-01T14:35:00Z    # ISO UTC — owner phát ngôn «gọi tên» trong phiên tổng kết 01/09, trả lời đúng câu hỏi «mở vòng meta duy nhất cửa sổ 2.6→2.7?» (máy điền mốc, ±5 phút)
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Owner tại hai cổng ký. Lời mời cổng hiện là **văn máy soạn tự do cuối lượt**,
không qua khuôn nào — nên cả ba cơ chế chống-nghi-thức đã ship (ngữ pháp
một-lượt-gõ · luật lệnh-bấm-được · làn V) đều bị né đúng ở lớp lời mời. Đo
thật 01/09 (`docs/findings/2026-09-01-audit-loi-moi-cong-nang-hinh-thuc.md`):
vòng 2.6.0 gọi người 5 lượt / 1 quyết thật — lệnh in sai tên, mời khi chưa
ký-được-ngay ×2, tách signoff thành 2 lượt, chữ ký Cổng Phạm vi thừa so với
tiền lệ làn V. Song song, owner tự quan sát (quyết định 4, 01/09): ở
phạm-vi/tiêu-chí «tôi chỉ gật vì nó vượt nhận thức» — chữ ký là tin-suông.

Bài kiểm North Star, tự khai trước khi mở ô: vòng này TRỪ lượt người và TRỪ
đường fail-quiet, không thêm cổng, không thêm tầng thước; người hưởng cụ thể
là owner tại Cổng Phạm vi và Cổng Bằng chứng của MỌI vòng sau nó.

## Phạm vi — bảy vá, toàn đổi-vai trên vật sẵn có

1. Thẻ cổng in sẵn **câu gộp khuyến nghị hoàn chỉnh** trong khối «VIỆC CỦA
   ANH»: tên lệnh đầy đủ, mọi ô điền theo đề xuất máy, chừa đúng chữ quyết.
2. Khối «VIỆC CỦA ANH» chỉ render mục **loại-5** (điều-chỉ-người-biết); phần
   vượt-nhận-thức render thành khối «PHÁN QUYẾT ĐỐI KHÁNG» kèm số + chiều đỏ;
   loại-1/2 thành dòng báo có sổ (luật lời-mời trong CLAUDE.md, 01/09).
3. Bộ đọc Ngoài-hợp-đồng: mục có chữ mà 0 finding parse được → **cờ vàng**,
   hết bỏ-im-lặng (vết 2.6.0: khối rơi khỏi thẻ ngay trước lúc ký).
4. Trường `Đề xuất` token lạ → cờ vàng thay vì «máy chưa đề xuất hướng nào».
5. Cột SẼ/KHÔNG-làm thôi xếp nhầm vì chữ «không» trong vế Then (dính cả
   2.5.0 lẫn 2.6.0).
6. **N3 (rà soát hệ thống):** luật định tuyến áp cả vào khối «CHƯA duyệt» —
   veto-default dồn về Cổng 2 thì mục loại-1/2 trong đó là dòng báo, chỉ
   loại-5 cần phê đích danh; «phê hết» trên gói to không thành đóng-dấu mới.
7. **N4:** luật rơi bậc — `probe-failed` ⇒ mọi mục loại-3 rơi về loại-5,
   khai thẳng trên thẻ «người tự đọc vật, đối kháng không chạy được»; chữ ký
   không được nói «đối kháng đã hội tụ» khi nó chưa chạy.

Nới lỏng kèm theo (đã chạy de-facto 01/09, hợp thức hoá): hai nguồn danh tính
khớp tuyệt đối → bỏ lượt Enter-xác-nhận.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mục trên thẻ PHÂN LOẠI được bằng nguồn dữ liệu sẵn có (gap-probe verdict, ledger, contract) — không cần người gán nhãn | máy xếp nhầm loại-5 thành loại-1, người mất quyết định | lấy 3 thẻ đã ký (2.5.0 · 2.6.0 · cong-dang) phân loại tay từng mục, so với phân loại máy | Chưa thử |
| 2 | Câu gộp in sẵn được owner DÙNG thật thay vì gõ tay | vá thành trang trí, số chạm không giảm | vòng đầu tiên sau ship: đếm owner gửi nguyên câu hay tự gõ | Chưa thử (bằng chứng thuận: 01/09 owner copy nguyên dòng khuyến nghị khi có) |
| 3 | Cờ vàng fail-quiet không đỏ oan trên các hồ sơ cũ trong xưởng | suite/thẻ cũ nhiễu, người hết tin cờ | chạy bộ dựng thẻ lên TRỌN xưởng hiện có (~70 hồ sơ), đếm cờ vàng phát sinh | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

Khai tại đây, đo ở vòng ĐẦU TIÊN chạy dưới thẻ mới (mọi số đọc từ ba-dòng-số
của mốc phát hành kế — luật (c)):

- **Lượt gọi người/vòng ≤ 3** (mốc phát hành ≤ 1) và **0 lượt ngoài thiết kế**.
- **Chạm/lượt = 1** — người gửi nguyên câu gộp hoặc một chữ.
- Ngưỡng chết: nếu vòng đầu dưới thẻ mới vẫn phát sinh lượt máy-tự-chèn hoặc
  lời mời chưa-ký-được-ngay → vá chưa trúng lớp, dừng-vá theo điều khoản.

## Nguồn

Luật: CLAUDE.md (bullet lời-mời + luật (c), 01/09) · lập luận:
`docs/findings/2026-09-01-loi-moi-chi-chua-dieu-chi-nguoi-biet.md` +
`...-bo-an-cat-kit-muc-tieu-mot-cham.md` + `...-ra-soat-he-thong-sau-27.md`
(N3/N4) · hình: `docs/plans/assets/v27-01..04` (v27-03 chính là mock của thẻ
sau vá). Điều kiện vào việc: SAU khi PR 2.6.0 gộp — đúng luật Giới hạn CHIỀU
RỘNG, đây là vòng meta DUY NHẤT của cửa sổ 2.6→2.7.
