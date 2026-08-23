---
schema_version: 1
slug: ngay-viec-vua-xong-lay-sai-nac
feature: Ngày «việc vừa xong» lấy sai nấc cho hồ sơ đã qua phiên nghiệm thu — vòng đóng hôm nay bị đóng dấu bảy tháng tuổi và rơi khỏi thẻ
owner: manh.phan@onemount.com
stage: discovery
decision:
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Thang suy ngày của «việc vừa xong» đọc chữ ký Cổng Bằng chứng TRƯỚC, rồi mới
tới mốc quyết định của phiên nghiệm thu. Nhưng mọi hồ sơ tới được phiên nghiệm
thu đều đã có chữ ký từ lâu — nên nấc hai **không bao giờ với tới** đúng những
hồ sơ nó được viết ra để gán ngày.

Đo trên fixture code-sinh: hồ sơ ký Cổng Bằng chứng 2026-01-05, chốt Cổng Giá
trị 2026-08-23 → thẻ in `2026-01-05`. Vì thẻ chỉ in năm việc mới nhất và xếp
theo ngày, một vòng vừa đóng hôm nay **rơi khỏi danh sách** — đúng cái mà khối
đó được thêm vào để chặn.

**Người trả giá:** owner — thẻ nói dối về thứ tự việc vừa làm, đúng chỗ nó hứa
nói thật.

**Vì sao là ô riêng, không phải lỗi của vòng trước:** mã làm ĐÚNG tiêu chí
AC-3 của hồ sơ `start-bang-dieu-khien` (thang `human_signoff` → `decided_at` →
git). Chính TIÊU CHÍ ghi sai thứ tự thang. Sửa nó là sửa hợp đồng, tức việc của
người — nên máy phân loại nó NGOÀI hợp đồng, và owner tách ra ở Cổng Bằng
chứng 2026-08-23. Nguồn: `_acceptance/start-bang-dieu-khien/review-findings.md`.

Hướng đã thấy (chưa quyết): rẽ thang theo LOẠI hồ sơ — hồ sơ đã nghiệm thu đọc
mốc của phiên nghiệm thu trước; hồ sơ máy-đi-tiếp không lấy mốc Cổng Đáng làm
ngày hoàn thành.

## Giả định chốt sinh tử

…

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Phát hiện gốc | review S4 vòng 2 của `start-bang-dieu-khien` | triết-lý/logic | có | — |

## Cổng 0

Chưa ký.

## Thước đo thành công → ứng viên criterion

- Số hồ sơ đã nghiệm thu bị gán sai ngày — đích 0.

## Out of scope từ khám phá

- Không đụng bộ đọc nào khác ngoài thang suy ngày.
