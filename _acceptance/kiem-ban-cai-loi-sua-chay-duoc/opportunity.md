---
schema_version: 1
slug: kiem-ban-cai-loi-sua-chay-duoc
feature: Kiểm bản cài sau thẻ phân biệt lệch mã với lệch chỉ ở tệp không chạy, chỉ lệnh lấy thẻ khi bản clone thiếu thẻ, và in cho mỗi bản ghi cây phụ lệch số một lối sửa chạy được
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC4
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC4 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Kiểm bản cài sau thẻ phân biệt lệch mã với lệch chỉ ở tệp không chạy, chỉ lệnh lấy thẻ khi bản clone thiếu thẻ, và in cho mỗi bản ghi cây phụ lệch số một lối sửa chạy được

Gốc: onehub-invest/_acceptance/nang-kit-2-34-0/

Vì sao: Gốc: onehub-invest/_acceptance/nang-kit-2-34-0/ — lần nhận 2.34.0 của kho (25/10); cài từ chợ ra đỉnh main đã quá thẻ cùng số (v2.34.0..main lệch ba tệp không chạy) nên --may ĐỎ; bản clone chợ không có thẻ nên «ref không có»; lời khuyên «cài lại ở project <worktree>» không chạy được vì lệnh từ cây phụ chỉ nâng bản ghi gốc. Lần nhận kit thứ hai vấp lớp cây phụ — đủ ngưỡng hạt giống docs/plans/2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc.md; hạt giống docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md mục 7, 8.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sổ cài và bộ đệm dựng bằng code: lệch chỉ ở docs/, _acceptance/, LO-TRINH.html → VÀNG có tên, không ĐỎ; lệch một tệp scripts/ → ĐỎ (đối chứng); clone không thẻ → in lệnh fetch thẻ; bản ghi cây phụ lệch → in lệnh sửa, áp lệnh rồi chạy lại → ĐẠT; bản ghi trỏ thư mục đã xoá → khối riêng» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sổ cài và bộ đệm dựng bằng code: lệch chỉ ở docs/, _acceptance/, LO-TRINH.html → VÀNG có tên, không ĐỎ; lệch một tệp scripts/ → ĐỎ (đối chứng); clone không thẻ → in lệnh fetch thẻ; bản ghi cây phụ lệch → in lệnh sửa, áp lệnh rồi chạy lại → ĐẠT; bản ghi trỏ thư mục đã xoá → khối riêng
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sổ cài và bộ đệm dựng bằng code: lệch chỉ ở docs/, _acceptance/, LO-TRINH.html → VÀNG có tên, không ĐỎ; lệch một tệp scripts/ → ĐỎ (đối chứng); clone không thẻ → in lệnh fetch thẻ; bản ghi cây phụ lệch → in lệnh sửa, áp lệnh rồi chạy lại → ĐẠT; bản ghi trỏ thư mục đã xoá → khối riêng» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
