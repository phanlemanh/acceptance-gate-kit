# ADR 0023 — Luật sản phẩm của kho: một tệp ở gốc, nạp lúc thiết kế, gọi tên trên thẻ

2026-10-12 · CỘNG, chủ kho (Manh Phan) phê đích danh ở Cổng Đáng của vòng `bat-bien-san-pham`
(gõ «Làm» 11/10 — ADR 0018). **Số đo:** crm `27d47de04`: múi giờ Việt Nam ghi cứng ở 12 tệp mã sản
phẩm, 0 dòng múi giờ trong khuôn dữ liệu, 5/5 quyết định người về múi giờ là «ghi Known limits» ở
Cổng Bằng chứng và 0 ở bước thiết kế; hồ sơ neo `okr-soat-anh-luot-3` (hai mục «lại ghi cứng múi
giờ» trình như chuyện mã lặp). **Quyết định:** kho khai luật trong `PRODUCT-INVARIANTS.md` ở gốc —
đường CỐ ĐỊNH, không khoá config (bớt một ổ cắm; chưa kho nào cần đường khác); mã cố định `SP-<số>`
do kit định nghĩa (neo vào khuôn kit, không vào từ vựng của một kho); bước thiết kế ghi một dòng nạp
mang phiên bản tệp, phạm luật là câu chỉ-người mang `pham_luat` (ba luật đỏ trong bộ xếp lớp căn cứ
của ADR 0022); lượt chấm ghi `luat-cham.json` từ dấu hiệu trên dòng thêm của diff, thẻ Cổng Bằng chứng
chỉ ĐỌC tệp đó (không mở lối thứ hai cho thẻ chạm git); vị từ còn-cần-người đọc nó qua `ctx.luat` TUỲ
CHỌN. Kho không có tệp thì không đổi byte nào — đo vi phân trên mọi hồ sơ (luật 26/09). **Giới hạn
đã khai:** (i) bộ soi khớp chữ theo dấu hiệu kho tự khai — luật không viết được thành dấu hiệu chỉ
sống ở bước thiết kế; ngưỡng mở ô: ≥ 1 vòng có mục ngoài hợp đồng cùng lớp một luật đã khai mà khối
«Luật sản phẩm bị chạm» trống; (ii) lưới trước-gộp (`scripts/pre-merge-check.sh`, lõi cưỡng chế ngoài
vòng T2) KHÔNG biết luật sản phẩm — sáu điều kiện xanh-sạch giữ đẳng thức LV5 nên điều kiện luật nằm
ngoài chúng; ngưỡng: ≥ 1 hồ sơ gộp có `luat-cham.json` có chạm mà không có dòng sổ `gate2` cho mã đó;
(iii) commit máy/người tách bằng dòng `Co-Authored-By: Claude` — commit máy thiếu dòng đó lọt thành
người; ngưỡng: ≥ 1 commit chạm tệp luật mà chủ kho nói không phải của mình. **Đường đảo:** xoá tệp
luật ở kho = về hành vi cũ ngay; gỡ mô-đun `scripts/luat-san-pham.cjs` = thẻ và vị từ đi đường cũ,
bộ xếp lớp đỏ dòng mang `pham_luat` (đóng an toàn).
