# Hạt giống — thẻ Cổng 1 của hồ sơ ĐÃ KHÉP không có `evidence-report.md` vẫn hỏi «duyệt hay sửa»

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: crm/_acceptance/cua-vao-noi-tieng-viet — `observed` 21/09 (`da-cham-boi-thuc-te`, hồ sơ cũ không có `evidence-report.md`); thẻ trên kit 2.18.1 (crm PR #78) vẫn in ô hỏi «duyệt hay sửa».
Gốc: crm/_acceptance/tieng-viet-cho-crm — cùng hình, cùng ngày đo (Kit-vòng đo ngưỡng UAT ô `ho-so-khep-thoi-hoi` trên crm: thẻ hồ sơ khép 5/7 = 0 ô hỏi, 2/7 còn hỏi).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

Vòng `ho-so-khep-thoi-hoi` (2.18.1, AC-6) tắt ô hỏi cho hồ sơ đã khép ở nhánh **Cổng 2** của
`gate-card.js` — nhánh chọn theo `evidence-report.md`. Hồ sơ đóng bằng `observed` mà chưa từng có
lượt chấm (hai hồ sơ tiếng Việt cũ ở crm) không có báo cáo, nên thẻ rơi vào nhánh **Cổng 1** và
nhánh ấy chưa hỏi vị từ `hoSoDaKhep`. Kết quả: ngưỡng UAT «ô hỏi trên thẻ hồ sơ khép = 0» của ô
đạt 5/7, không đạt 0 → Cổng Giá trị của ô sẽ ra `iterate`, đúng luật.

## Dạng nghiệm đúng tầng

Vị từ «đã khép» hỏi TRƯỚC khi chọn nhánh cổng — một chỗ, ở đầu `gate-card.js`, cho cả hai nhánh;
chiều đỏ: fixture hồ sơ `da-cham-boi-thuc-te` KHÔNG có `evidence-report.md` → `--extract` không có
nhãn hỏi; hồ sơ `approved` thường → nhãn hỏi Cổng 1 như cũ. Vá điểm, TRỪ, cùng tệp AC-6 đã chạm.
Ngưỡng mở ô: đã đủ (2 hồ sơ thật, ngày cài). Xếp cùng vòng với hạt giống suite-qua-trần ở cửa sổ kế
nếu owner gọi tên.
