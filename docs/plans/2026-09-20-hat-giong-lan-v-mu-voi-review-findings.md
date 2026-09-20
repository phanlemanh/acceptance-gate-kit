# Hạt giống — Làn V mù với `review-findings.md`: máy tự thông một hồ sơ còn mục chưa định đoạt

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(`scripts/khong-can-nguoi.mjs` — đường bỏ-qua cổng người).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — phiên lái tự tìm ra ở round
2 và round 3 (20/09), không lượt chấm nào bắt được.

## Lỗ

`khong-can-nguoi.mjs` quyết «xanh-sạch» bằng SÁU điều kiện, trong đó hai điều đọc
`## Known limits` và `## Ngoài hợp đồng` của `evidence-report.md` — CHỈ tệp đó. Bộ tổng
hợp S4 để cả hai mục **rỗng** như một lẽ thường, và ghi mọi finding ngoài hợp đồng vào
`review-findings.md` — tệp làn V không bao giờ mở.

Đo hai lần trên cùng hồ sơ:

| Lượt | `review-findings.md` | `khong-can-nguoi --check` |
|---|---|---|
| round 2 | 29 mục ngoài hợp đồng (4 high) | «sẽ machine-cleared» |
| round 3 | 7 mục (2 high) + một CỤM ngoài vùng phủ | «sẽ machine-cleared» |

Thẻ Cổng Bằng chứng (`gate-card.js --extract`) đọc đúng `out_of_contract.findings` từ
`review-findings.md` và hỏi đủ từng mục — hai bộ đọc của cùng một kho mâu thuẫn, và bộ
**tự-thông** là bộ mù. Nếu phiên lái làm đúng lời SKILL («xanh-sạch đủ sáu điều kiện →
chạy `khong-can-nguoi --write`, đi tiếp S5, KHÔNG mời ký»), hồ sơ 29 mục chưa ai đọc sẽ
ship không qua người. Đây là lớp «bằng chứng tự dối» ở tầng nghi thức, không ở tầng
phép đo.

## Việc

Một trong hai, đúng tầng:

- điều kiện «Ngoài hợp đồng rỗng» đọc `review-findings.md` (mục `## Ngoài hợp đồng`) —
  cùng nguồn với thẻ; hoặc
- bộ tổng hợp S4 buộc phải chép danh sách ngoài-hợp-đồng vào `## Ngoài hợp đồng` của
  báo cáo (một nguồn = tệp báo cáo), và `khong-can-nguoi` từ chối khi báo cáo có mục rỗng
  mà `review-findings.md` không rỗng (chiều đỏ có tên).

Răng bắt buộc: fixture có `review-findings.md` mang ≥1 mục ngoài hợp đồng và báo cáo rỗng
hai mục → `--check` PHẢI in «còn cần người», không phải «sẽ machine-cleared».

## Ngưỡng mở ô

Đã đạt ngưỡng đo (hai lượt liên tiếp trên một hồ sơ). Mở khi owner gọi tên, vì T3 chạm
`scripts/` ở đường bỏ-qua cổng người; tới lúc đó phiên lái PHẢI so số mục của thẻ với hai
mục của báo cáo trước khi tin làn V.
