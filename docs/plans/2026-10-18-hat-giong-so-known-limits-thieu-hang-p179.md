# Hạt giống — sổ giới hạn thiếu hàng cho chính hồ sơ đang chấm, P179 đốt một lượt S4 mỗi vòng

**Ngày:** 2026-10-18 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗi (biến lời dặn thành vật máy giữ; không thêm cổng).
Gốc: `acceptance-gate-kit/_acceptance/ap-chinh-sach-lo-trinh/` — `decisions.jsonl` d-20261015T064941Z-34 (S4-r2: P179 đỏ, thêm 10 dòng sổ).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- P179 (`tests/plugins/run-tests.sh:8797`) đòi `docs/research/known-limits-ledger.tsv` có số hàng ≥ số dòng
  `Đề xuất: known-limits` trên mọi `_acceptance/*/review-findings.md` — kể cả hồ sơ ĐANG chấm.
- Lượt S4 đỏ hoặc REJECT chỉ vì thiếu hàng sổ: RM2 `ap-chinh-sach-lo-trinh` lượt 2 (15/10, 3a6274cf) · RM4
  `kho-moi-cai-goi-road-map` lượt 2 (16/10, 362dc059) · TH-cau `cau-tin-hieu-nguoi-gui` lượt 2 (13/10, 478ad46b) · RM6c
  `lo-trinh-du-lieu-ngay-du-kien` (16/10, eefb3deb thêm 13 hàng) · RD1 `road-map-de-dung` lượt 2 (18/10, REJECT, thêm 16 hàng;
  hồ sơ chưa lên `main`). Mỗi lần ≈ 40 phút máy, và ăn một lượt trong trần ba.
- Lớp đã có tên trong sổ từ 2.14.0 (`release-2-14-0#10`, `song`, «đo sai thời điểm»); lời dặn trong bộ nhớ phiên vẫn thua.

## Gốc

Bên VIẾT mục (`review-findings.md`, máy sinh ở S4) và bên ĐỌC (P179) cùng marker, nhưng hàng sổ do thợ chép tay → khe để quên.

## Đề xuất (chưa làm)

1. **Đúng tầng (khuyến nghị):** máy sinh hàng sổ từ chính danh sách của hồ sơ — một bước nhỏ đọc mọi
   `Đề xuất: known-limits` của hồ sơ, thêm hàng `<slug>#n … song` còn thiếu (giữ hàng đã có). Gọi ngay khi
   `review-findings.md` được ghi và trước khi xin vé S4; chủ kho chọn sửa ở Cổng Bằng chứng thì hàng đổi `chet` + `closed_by`.
2. Lối TRỪ thay thế: P179 không đếm hồ sơ đang chấm (theo diff), đòi hàng ở bước ký. Rẻ hơn, nhưng dời khe sang bước ký.
3. Chiều đỏ: xoá một hàng sổ của hồ sơ thử → P179 đỏ đúng thông điệp `quan he >= vo`; chạy bước sinh → xanh; đối chứng
   dương: hồ sơ không có mục known-limits → bước sinh không thêm hàng nào, sổ giữ từng byte.

**Người hưởng:** điều phối máy và chủ kho (không mất lượt S4 và ≈ 40 phút máy vì một việc chép tay).
**Kho không gặp sự cố này được gì, mất gì:** sổ và P179 chỉ có ở kit — kho tiêu thụ không thấy gì đổi.

## Ngưỡng mở thành ô

Owner gọi tên (vòng nhỏ T2), hoặc thêm một lượt S4 nữa bị P179 đánh trượt vì thiếu hàng của chính hồ sơ.
