---
slug: gap-probe-presence-hook
at: 2026-07-26T19:10:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — contract v2 (merge-boundary)

Vòng probe cho bộ artifact v2, sau khi gỡ hook write-time (d-20260726T180000Z-114).
Critic chỉ đọc contract.md + evals.yaml + decisions.jsonl; cấm đọc mã nguồn.
Vòng probe của contract v1 (hook write-time) nằm trong lịch sử git — contract đó
đã bị thay, giữ lại bản này cho bộ artifact đang chờ duyệt.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Hợp đồng producer↔consumer cho trường `verdict` để trống — AC-5/AC-6 đứng trên nó mà không nói đọc ở frontmatter hay thân bài | S1#7 ghi kiểu này, fixture eval tự soạn kiểu kia → 9 eval xanh nhưng mọi gap-probe.md thật bị đọc là "thiếu verdict" → VIOLATION oan chặn toàn bộ merge; chiều ngược lại grep lỏng thân bài thì dòng verdict trích trong bảng finding thành false-green | Ghim đúng một nguồn đọc + fixture sao chép nguyên văn đầu ra thật của S1#7 | fixed: AC-5/AC-6 nay ghim KHỐI FRONTMATTER đầu file (đã đối chiếu: feature-loop S1#7 ghi frontmatter, gap-probe.md thật của kit khớp) và loại tường minh dòng verdict nằm trong thân bài |
| P0 | contract | Bán kính quét khi bật `required` chưa được quyết — pre-merge lặp qua MỌI slug, trong khi bản hook cũ chỉ chạm contract đang ghi | Repo tiêu thụ có 20 slug lịch sử ở implemented+ bật required → 20 VIOLATION ở PR đầu tiên, không liên quan diff → đội hạ về advisory/off và luật chết đúng như kênh NOTE của bản hook | Quyết dứt phạm vi: chỉ slug trong diff PR, hay grandfathering, hay descope tường minh nêu chi phí | fixed: human chốt tại Cổng 1 ngày 2026-07-26 — chỉ xét slug có file trong diff PR; vào AC-1 + AC-12 + trục bán kính trong Coverage, ledger d-20260726T200000Z-116 |
| P1 | contract | Trục status vắng khỏi Coverage và không có AC phủ vế phủ định | Bản cài đặt đặt kiểm tra TRƯỚC bước lọc status → mọi feature đang làm dở (draft) sinh VIOLATION, không PR nào merge được; 9 eval vẫn xanh vì mọi fixture đều implemented+ | Thêm trục status vào Coverage + AC cho draft/approved im lặng | fixed: AC-10 + trục status trong Coverage + eval E10 |
| P1 | evals | Không AC/eval nào phủ giá trị gap_probe không nhận dạng được (nháy, hoa-thường, sai chính tả) | gap_probe với giá trị có nháy là YAML hợp lệ nhưng không khớp so-chuỗi-thô → rơi về advisory → cổng tự tắt im lặng, đúng false-green mà chính feature này sinh ra để chặn; repo có lịch sử gãy đúng lớp này (các fix quote-aware fieldVal) | AC fail-loud cho giá trị lạ + nhận đúng biến thể hợp lệ | fixed: AC-11 + eval E11 (3 biến thể có nháy / viết hoa / sai chính tả) |
| P1 | evals | E9 khai input evidence/premerge-messages.txt mà không nói ai sinh, sinh bằng gì, phải chứa gì — luật có 1 dạng VIOLATION và 3 dạng NOTE | Gói bằng chứng chỉ chứa VIOLATION (hoặc vắng) → judge đọc một thông điệp rõ rồi chấm AC-9 PASS trong khi 3 NOTE kia vẫn trống nghĩa; đúng lỗi d-109, lần đó có mắt người bắt, lần này không | Ghi lệnh sinh + điều kiện đủ, và một eval máy kiểm sự đầy đủ TRƯỚC khi judge chấm | fixed: E12 gác cổng (đòi đủ 4 nhãn) + ghi lệnh sinh vào comment của E9 |

## Ghi chú

One-pass theo nghi thức: đã sửa artifact thì KHÔNG probe lại. Cả 5 finding đều
được định đoạt TRÊN GIẤY trước khi có dòng code nào — chỗ rẻ nhất để sửa. Bốn
cái tôi sửa trực tiếp; P0 bán kính là quyết định phạm vi thật (không phải thiếu
sót kỹ thuật) nên đẩy lên Cổng 1, và human đã chốt ngày 2026-07-26.
