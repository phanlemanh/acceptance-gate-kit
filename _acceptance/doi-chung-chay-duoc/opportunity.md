---
schema_version: 1
slug: doi-chung-chay-duoc
feature: Bước đối chứng của lượt chấm S4 chạy lại các lệnh máy trên commit gốc và phân loại được eval xanh cả hai phía, không còn BLOCKED vì tác tử đối chứng thiếu công cụ ghi tệp
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-29T04:55:51Z   # chủ kho gõ «build» ở thẻ Cổng Đáng của TC6 (phiên điều phối MBP)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC6
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC6 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Bước đối chứng của lượt chấm S4 chạy lại các lệnh máy trên commit gốc và phân loại được eval xanh cả hai phía, không còn BLOCKED vì tác tử đối chứng thiếu công cụ ghi tệp

Vì sao: Gốc: onehub-invest/_acceptance/aer-ac2-so-cap-co-dinh/ — evidence-report ghi baseline BLOCKED «No such tool available: Write»; M5 báo lại trên 2.35.0 ở kit #308 (29/10, hai lượt S4 của hồ sơ dung-m2-song-song). Ở kho kit, lượt chấm FL5 (_acceptance/design-floor-moc-s3-s4/) cũng ghi baseline n-a ở mọi eval. Gốc trong mã: lời giao của tác tử baseline trong feature-loop/workflows/acceptance-verify.js bảo dùng công cụ Write, mà loại tác tử feature-loop:cham-lenh chỉ có Bash, Read, Grep, Glob. Hệ quả: mọi eval máy xanh chưa từng được thấy đỏ trên mã cũ, ở mọi kho.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Lượt chấm mẫu: eval xanh cả trên commit gốc → báo cáo ghi không-phân-biệt; eval đỏ ở gốc xanh ở đầu → phân biệt; bản workflow cũ trên cùng mẫu ra BLOCKED đúng thông điệp «No such tool available: Write» (đối chứng); tác tử chấm vẫn không cầm bút ghi vào cây kho» chưa?
- Kết quả nào là SỐNG: [đề xuất] Lượt chấm mẫu: eval xanh cả trên commit gốc → báo cáo ghi không-phân-biệt; eval đỏ ở gốc xanh ở đầu → phân biệt; bản workflow cũ trên cùng mẫu ra BLOCKED đúng thông điệp «No such tool available: Write» (đối chứng); tác tử chấm vẫn không cầm bút ghi vào cây kho
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Lượt chấm mẫu: eval xanh cả trên commit gốc → báo cáo ghi không-phân-biệt; eval đỏ ở gốc xanh ở đầu → phân biệt; bản workflow cũ trên cùng mẫu ra BLOCKED đúng thông điệp «No such tool available: Write» (đối chứng); tác tử chấm vẫn không cầm bút ghi vào cây kho» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
