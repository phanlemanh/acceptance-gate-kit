---
schema_version: 1
slug: mot-nguon-tai-gui-triage
feature: Tải gửi cho trạm phân loại phạm vi dựng từ MỘT nguồn, bỏ cơ chế ghép đòi hai bản giống nhau từng byte
owner: phanlemanh@gmail.com
stage: decided
decision: park
decided_by: Mạnh
decided_at: 2026-09-15
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Khuôn tải gửi cho tác tử phân loại viết hai lần trong `feature-loop/workflows/acceptance-verify.js`; cơ chế hỏi-lại ghép lời nhắc lượt hai bằng phép thay chuỗi, chỉ đúng khi hai bản còn giống nhau từng byte, và phép thay chuỗi im lặng khi không khớp. Người trả giá: máy, ở dạng tiếng ồn chẩn đoán — không phải người dùng kit, và không phải tính đúng đắn của phán quyết.

Gốc: acceptance-gate-kit/_acceptance/do-tin-tram-phan-loai — Ngoài-1 của hồ sơ đó, owner quyết «mở hợp đồng mới» tại Cổng Bằng chứng 15/09

## Ngưỡng chết / ngưỡng UAT

- **Số đo 15/09 trên harness thật** (ca ba phát hiện thiếu một, so cây hiện tại với cây sau một lần sửa thường): số tác tử KHÔNG đổi (2 và 2) · quan hệ phân loại KHÔNG sai một mục · lời nhắc phân loại +6 % ký tự · **2 dòng chẩn đoán «mã lạ» giả**. Chi tiết và bảng ở hạt giống.
- **Đính chính:** cả tác tử chấm lẫn phiên điều phối từng mô tả hậu quả là «trả tiền tác tử gấp ba» — sai. Tác tử chấm xếp mục này `high`; trên số đo nó không phải `high`.
- **Kết quả nào là SỐNG** (đáng mở lại): khuôn tải gửi bị ai đó sửa, hoặc dòng «mã lạ» xuất hiện ở một lượt chấm thật mà không giải thích được.
- **Kết quả nào là CHẾT** (đóng hẳn): trạm phân loại được viết lại toàn bộ ở một vòng khác và cơ chế ghép bằng thay-chuỗi biến mất theo.
- **Timebox:** không có. Ngưỡng mở lại là sự kiện, không phải ngày.

## Vì sao park chứ không build

Vòng meta thứ hai của cửa sổ chỉ được một (luật (b)), ngay sau một vòng đã vượt trần lượt gọi người; và việc còn lại trong cửa sổ — chiến dịch ghim lại 42 hồ sơ, «ghim lại theo diff», `routing-baseline` ba lần đếm — có số đo nặng hơn hẳn. Đường rẻ được khuyến nghị: vá trong hồ sơ mốc phát hành, đúng tiền lệ P93 ở mốc 2.13.0.

**Đề bài không mất:** năm tiêu chí, bảy eval, bản phản biện và nhát cắt đã chốt nằm trọn ở `docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`, dùng được ngay.
