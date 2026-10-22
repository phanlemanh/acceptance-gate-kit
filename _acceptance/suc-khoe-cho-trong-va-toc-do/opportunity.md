---
schema_version: 1
slug: suc-khoe-cho-trong-va-toc-do
feature: Bộ phát lịch chỉ giảm tải khi máy đang nghẹt thật hoặc thiếu chỗ cho làn sắp cấp — không vì swap cũ hay một tiến trình lớn hợp lệ; lượt chạy dưới tải được gắn nhãn và thử lại một lần thay vì tính là lỗi vật; ngưỡng hiệu chuẩn từ các lượt bị hạ tầng đốt
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: chủ kho
decided_at: 2026-10-21      # chủ kho gõ ở phiên điều phối MacBook Pro, chữ build CÓ ĐIỀU KIỆN — thành build khi điều tra bước 1 chứng hiện trạng; điều tra 21/10 chứng ĐÚNG (docs/findings/2026-10-21-suc-khoe-may-do-sai.md)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: SK1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Chủ kho 21/10, nguyên văn: «Mở phiên điều tra nếu đúng hiện trạng thì đưa vào lộ trình và xử lý». Điều kiện «đúng hiện trạng» đã chứng ở `docs/findings/2026-10-21-suc-khoe-may-do-sai.md` (K1, K1b, K2, K3 ĐÚNG; K1a «swap chỉ tăng» SAI về chữ nhưng không đổi kết luận; K2a, K4 CHƯA CHỨNG trên máy này).

Người gặp: chủ kho và mọi phiên thợ chạy trong một đợt điều phối. Khi máy từng nghẹt rồi hết nghẹt, bộ phát lịch vẫn đứng ở giảm tải nhiều giờ — khoá s4, ghim lại, đường nền không cấp — nên kết quả chờ ký kéo dài mà không vì vật; người vận hành phải tự nâng ngưỡng trong thư mục đợt (hai máy đã làm vậy). Một tiến trình lớn hợp lệ (model chạy cục bộ) còn sinh lượt «cần người» không ai làm gì được.

Mở từ hàng SK1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Phát hành sau mốc 22/10 (số đặt lúc cắt) — ngày dự kiến đúng khi mốc phụ thuộc nhau (RD2) · thước sức khoẻ máy đo chỗ trống và tốc độ (SK1) — 29/10/2026.

Bộ phát lịch chỉ giảm tải khi máy đang nghẹt thật hoặc thiếu chỗ cho làn sắp cấp — không vì swap cũ hay một tiến trình lớn hợp lệ; lượt chạy dưới tải được gắn nhãn và thử lại một lần thay vì tính là lỗi vật; ngưỡng hiệu chuẩn từ các lượt bị hạ tầng đốt

Vì sao: Gốc: crm-onehub/_acceptance/dieu-phoi-hai-tang/ — AC-4 khoá «swap dùng > swap_gb → giảm tải». M5 báo crm-onehub#375 20/10 22:42Z: một đợt giảm tải hơn 2 giờ với áp lực bộ nhớ bình thường; điều tra 21/10 tái lập trên MacBook Pro (hàm thật trả giảm tải, áp lực mức 1, trống 46 %), cả hai máy đã nâng tay ngưỡng — docs/findings/2026-10-21-suc-khoe-may-do-sai.md.

## Phạm vi chủ kho giao (21/10)

Lời giao của phiên SK1, cùng lượt với chữ build: «Phạm vi là ba vế thước, kèm hai chiều đo nằm TRONG bộ kiểm: áp lực giả → chặn, ghim đúng thông điệp; số đo kiểu 20/10 → im; đối chứng dương. Vế «hai khoá S4 mỗi máy» là CỘNG: KHÔNG làm.»

Ba vế (theo lời báo M5, chủ kho chuyển nguyên):
1. cấp làn khi `memorystatus_level × RAM ≥ đỉnh_làn × 1,5` VÀ `pressure_level == 1`, với `đỉnh_làn` = p95 RSS cây tiến trình theo loại làn, mặc định 16 GB;
2. trong lúc chạy đo tốc độ Δswapins/phút, gắn nhãn lượt «chạy dưới tải» và cho thử lại một lần; `swap dùng` và RSS chỉ ghi, không chặn;
3. hiệu chuẩn bằng các lượt bị hạ tầng đốt (137/SIGKILL, hết giờ, ENOMEM).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «14 ngày sau khi crm nhận mốc có SK1: không lần giảm tải nào trên hai máy mà áp lực bộ nhớ ở mức bình thường và còn đủ chỗ cho làn, và không ngưỡng sức khoẻ nào phải chỉnh tay trong thư mục đợt» chưa?
- Kết quả nào là SỐNG: [đề xuất của máy — chủ kho chưa đọc, đổi được ở Cổng Phạm vi] 14 ngày sau khi crm nhận mốc có SK1: không lần giảm tải nào trên hai máy mà áp lực bộ nhớ ở mức bình thường và còn đủ chỗ cho làn, và không ngưỡng sức khoẻ nào phải chỉnh tay trong thư mục đợt — đếm trên `su-kien.jsonl` + `trang-thai.json` của các đợt trên hai máy; mẫu số N = số nhịp có số đo trong cửa sổ, N = 0 thì thước vô hiệu
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «14 ngày sau khi crm nhận mốc có SK1: không lần giảm tải nào trên hai máy mà áp lực bộ nhớ ở mức bình thường và còn đủ chỗ cho làn, và không ngưỡng sức khoẻ nào phải chỉnh tay trong thư mục đợt» khi hết timebox
- Timebox: [đề xuất] 2026-10-29 (mốc Phát hành sau mốc 22/10 (số đặt lúc cắt) — ngày dự kiến đúng khi mốc phụ thuộc nhau (RD2) · thước sức khoẻ máy đo chỗ trống và tốc độ (SK1))

## Ngoài vòng này

- Hai khoá S4 mỗi máy là CỘNG — không làm ở vòng này; hạt giống `docs/plans/2026-10-21-hat-giong-hai-khoa-s4.md` kèm điều kiện mở M5 nêu.
