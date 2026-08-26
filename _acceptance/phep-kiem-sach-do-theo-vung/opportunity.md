---
schema_version: 1
slug: phep-kiem-sach-do-theo-vung
feature: Phép kiểm xanh-sạch đo theo vùng có cấu trúc, không quét trọn file
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Điều kiện «0 mục không chắc» của bộ chấm xanh-sạch (cả bản lưới lẫn bản bộ quét) quét TRỌN
file báo cáo tìm một chữ. Đó là blacklist trên không gian mở — lớp lỗi đã có tên trong sổ
của kit: mọi khuôn, checklist, ví dụ, hay câu văn nhắc tới chữ đó đều đầu độc phép kiểm.
Bằng chứng thực địa (vòng ra-co-ten-lam-va-trao, 23–24/08): hai hồ sơ làn V đời trước
«sạch» chỉ vì người viết biết luật mà né chữ; hai báo cáo thật đời sau dính 1 lần khớp mỗi
báo cáo chỉ vì dòng checklist; bốn bản vá vị-trí-khối liên tiếp đều là vá triệu chứng.
Người trả giá: mọi vòng làn V (trạng thái «máy đã thông» phụ thuộc phép kiểm này) và người
viết khuôn (không được nhắc tới một giá trị verdict trong chính tài liệu dạy về nó).

**Cùng lớp, bằng chứng thứ hai (S4-r7, 24/08).** Ca chống-chép `RT18` đi tìm luật ngưỡng
bằng cách quét trọn file tìm CHUỖI. Hai hình dạng lọt ngay trong lần chạy đầu: (a) miễn trừ
tính theo ĐƯỜNG DẪN nên bộ đọc từng chép luật được gạch trắng cho cả năm chuỗi — đã đóng
trong vòng này bằng gạch theo cặp file×chuỗi; (b) hằng một-ngày bắt theo CHÍNH TẢ, nên
`24 * 60 * 60 * 1000` lọt trong khi `86400000` bị bắt — và chính file mang ca đó đang viết
dạng lọt, tức phép đo tự cho mình màu xanh. Dạng (b) KHÔNG đóng được bằng grep: bản chép có
thể diễn lại luật bằng biểu thức không có hằng nào (`d <= now`). Đây đúng là lý do ô này
tồn tại — đo phải bám VÙNG có cấu trúc và QUAN HỆ, không bám mặt chữ.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Phép kiểm «không chắc» có còn đọc nhầm văn xuôi/khuôn/checklist thành verdict không, và hai bản dựng (lưới bash · bộ quét mjs) có cùng kết luận trên cùng hồ sơ không?
- Kết quả nào là SỐNG: [đề xuất] phép kiểm chỉ đếm giá trị verdict trong ô có cấu trúc (bảng eval + khối evidence); báo cáo chứa chữ đó trong văn xuôi vẫn SẠCH; ma trận đẳng thức bash↔mjs xanh trọn; 0 hồ sơ cũ đổi kết luận ngoài danh sách khai
- Kết quả nào là CHẾT: [đề xuất] còn một ca văn-xuôi-thành-verdict, HOẶC hai bản dựng trả lời khác nhau trên cùng hồ sơ, HOẶC phải sửa hồ sơ đã ký
- Timebox: [đề xuất] muộn nhất 2026-09-30 → park

## Out of scope từ khám phá

- Đổi từ vựng verdict (PASS/REJECT/…) — chỉ đổi CÁCH ĐO, không đổi thang.
- Nới sáu điều kiện xanh-sạch — danh sách đóng giữ nguyên, chỉ sửa phép đọc một điều kiện.
