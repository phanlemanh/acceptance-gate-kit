# Hạt giống — bốn điểm đi ngược North Star đo được trong audit S4 cách mới (22/09)

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Nguồn:** `docs/findings/2026-09-22-audit-s4-cach-moi-thong-le-co-bi-bo-qua.md` §6 (PR #201)
Gốc: crm/_acceptance/quan-ly-danh-muc-30-ngay — Cổng Bằng chứng: 12 mục Treo, owner «phê hết» không sửa mục nào (cùng hình: `noi-bon-nut` 5, `bang-cot` 6, `sua-luu-tru` 20 — 4/4 lần).
Gốc: crm/_acceptance/sua-luu-tru-dieu-phoi — `bỏ design-pass — dùng lại khuôn` trong khi diff chạm `packages/ui/src/components/combobox.tsx`; hệ quả đo được: owner mở vòng `ke-hoach-la-mot-ban-ghi` (22/09) để kéo UX màn điều phối về khuôn chung.
Gốc: crm/_acceptance/noi-bon-nut-dieu-phoi — vòng 10 AC không `opportunity.md` (ý định 4/8 vòng mới; `sua-luu-tru` 15 AC cũng không).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Bốn điểm, MỘT hạt giống (như #197): cùng cửa sổ, cùng kho, cùng lớp «lời thay vật». Phiên tổng kết
(kế hoạch `2026-09-22-tong-ket-hieu-qua-cach-moi-cua-so-2-18.md` §5 câu 2 và 6) chốt cái nào thành ô.

| # | Điểm | Số | Dạng nghiệm đúng tầng | Loại |
|---|---|---|---|---|
| 1 | Treo «phê hết» là trạm thu phí | 5·6·12·20 mục/chữ ký, 4/4 phê hết | Thẻ Cổng 2 phân loại từng mục Treo theo NGUỒN CĂN CỨ (luật lời mời 01/09): mục có quy tắc đã khai (`bỏ coverage-scan` khi phạm vi đóng; `KHÔNG làm X` đã ở Out of scope) → máy đi tiếp, ghi sổ, cửa veto; chỉ mục thiếu quy tắc mới là ô hỏi | TRỪ (bớt ô hỏi) |
| 2 | `bỏ design-pass` bằng lời | 6/6 vòng UI bỏ; `ux-ui-craft` 0 lần | Máy kiểm bằng vật: diff của vòng không thêm tệp component và không chạm `packages/ui` → bỏ có bằng chứng; ngược lại S1-D chạy. Lý do chép tay không còn là nghiệm | TRỪ |
| 3 | Ý định không đi cùng vòng giao thẳng | `opportunity.md` 4/8 | Vòng T2/T3 không có ô → S1 rút MỘT dòng ý định từ câu người giao (nguyên văn) vào frontmatter hợp đồng (`intent:`), thẻ Cổng 2 in dòng ấy (Đ7 mỏng) — không đòi ô | CỘNG nhỏ, owner phê |
| 4 | «Chiều đỏ trong lịch sử» chưa khớp vật | crm: 0/8 vòng commit test trước vật; làn `baseline` 8/8 | Sửa LỜI khối ĐỊNH VỊ trong `CLAUDE.md`: chiều đỏ nằm ở lịch sử HOẶC làn `baseline` của run-log (kho gộp test và vật một commit); kit giữ nếp T trước S | TRỪ (sửa lời cho khớp vật; owner duyệt vì chạm hiến pháp) |

Ngưỡng mở ô: điểm 1 và 2 đã đủ (4/4 và 6/6); điểm 3, 4 đi cùng vòng nào chạm thẻ/luật.
