# Hạt giống — nhãn của luat-san-pham.cjs trong danh sách chép CI sai điều kiện

**Ngày:** 2026-10-25 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa đúng tầng (nhãn khớp điều kiện nạp thật).
Gốc: `_acceptance/vong-don-le-tra-tri-thuc/` — Ngoài-1 của Cổng Bằng chứng 25/10, chủ kho chọn «mở hợp đồng mới».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/vong-don-le-tra-tri-thuc/contract.md` trích lại tệp này.

## Số đo

- Lượt sửa S4 r1 của TT5 thêm `scripts/luat-san-pham.cjs` vào `INIT-CI-COPY-LIST` (`commands/acceptance-init.md`) và GUIDE §5.3
  với nhãn `[only-if-declared: tri_thuc]`, ghi chú «chỉ trên lối `--tra`».
- Sai điều kiện: `scripts/khong-can-nguoi.mjs` luôn được chép, `product-map.mjs` nạp nó ở mọi lượt, và nó nạp khoan dung
  `luat-san-pham.cjs`. Kho có `PRODUCT-INVARIANTS.md` mà không khai `tri_thuc`, làm theo danh sách và bỏ tệp này → bản đồ đẩy mọi
  hồ sơ làn V về «còn cần người» (`LY_DO_LUAT_KHONG_NAP`), không báo lỗi; đường nền xếp tệp vắng là «bố cục lành».
- Trước TT5 tệp này không có trong danh sách — khoảng hở có từ hồ sơ `bat-bien-san-pham`; TT5 thêm nó với nhãn hẹp.

## Đề xuất (chưa làm)

1. Bỏ nhãn `[only-if-declared: tri_thuc]` của dòng `luat-san-pham.cjs` (chép vô điều kiện), sửa ghi chú ở cả hai bản khai; hoặc
   gắn theo khoá điều khiển `PRODUCT-INVARIANTS.md` nếu bộ đọc nhãn hỗ trợ.
2. Ca đo: kho thử có `PRODUCT-INVARIANTS.md`, không khai `tri_thuc`, chép đúng danh sách → bước bản đồ không đẩy hồ sơ làn V về
   «cần người»; bản tiêm gắn lại nhãn hẹp → đỏ ghim `LY_DO_LUAT_KHONG_NAP`.

Ngưỡng mở thành ô: một kho có `PRODUCT-INVARIANTS.md` đi đường chép tay nhận bản phát hành có TT5.
