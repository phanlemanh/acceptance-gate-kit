# Hạt giống — sáu lỗ hành vi của lệnh mở đợt và đổi kế hoạch sau DP2

Gốc: `_acceptance/dieu-phoi-mo-dot-mot-lenh/` (bốn lượt chấm ngày 10/10/2026, Cổng Bằng chứng ký 10/10 —
Ngoài-3, Ngoài-4, Ngoài-16, Ngoài-17, Ngoài-18, Ngoài-19, owner: mở hợp đồng mới). Hạt giống là SỔ, không
phải ô: chỉ mở thành ô khi có neo ngoài — một đợt thử thật (crm ~26/10, OneFlow ~27/10) vấp đúng lỗ. Gộp
theo lớp: cả sáu là chỗ CLI và lệnh người của gói `dieu-phoi` nói một đằng, bộ phát lịch hoặc tệp đợt làm
một nẻo. Không lỗ nào nằm trong 15 tiêu chí của DP2, nên vòng không vá.

## Lỗ

1. **Thẻ báo «không vào đợt» nhưng hàng vẫn được giao (Ngoài-18, nặng).** `theKhoiTao`
   (`dieu-phoi/scripts/the.mjs`) xếp hàng có ô `decision` khác `build` (park, kill, iterate) vào
   `canh_bao` với câu «không vào đợt», nhưng không ai gỡ hàng đó khỏi `hang-viec.json`: `mo` không lọc theo
   quyết định, `hang` không có lệnh bỏ hàng, `chonHangKe` và `tienDoCua` không đọc `decision`. Hàng park
   chưa có hợp đồng nên tiến độ là `chua` và được giao làm hàng kế ngay khi `pha dang-chay`. Hàng
   `build:<slug>` mà người không duyệt cũng gặp đúng lỗi này.
2. **Hai dãy cùng nhận một slug (Ngoài-19).** `themHang` (`dieu-phoi/scripts/hang.mjs`) chỉ kiểm trùng
   trong dãy đích; `hang them K3 --day P2` khi K3 đang ở P1 đẩy thêm `{slug, day:'P2'}` không mang `ma`.
   `kiemHangViec` không kiểm slug trùng, nên `chonHangKe` trả cùng slug cho cả P1 lẫn P2 — hai thợ mở một
   hồ sơ — và `theDong` đếm hàng đó là «phát sinh».
3. **`hang them <mã>` với mã chưa có trong đợt (Ngoài-4).** Slug suy từ chính chuỗi mã (`suySlug('K9')` =
   `k9`) thay vì từ hàng lộ trình (như `docHangLoTrinh`), và hàng mới mất `ma` — mất liên kết lộ trình, bảng
   đợt không xếp đúng nhóm kế hoạch.
4. **Đợt dựng tay mở lại cùng tên kẹt ở `dang-dong` (Ngoài-3; Ngoài-20 là cùng lỗ, ghi Known limits).**
   `moDotKq` (`dieu-phoi/scripts/dieu-phoi.mjs`) đường không gói dùng lại thư mục cũ và chỉ khởi tạo pha khi
   vắng `dieu-khien.json`; sau `pha dang-dong` + `dong` tệp đó còn `dang-dong`, mà `CHUYEN['dang-dong']`
   rỗng — chỉ thoát được bằng xoá tay.
5. **Chẩn đoán đòi một việc không làm được (Ngoài-16).** Đợt đã mở mà thiếu `nguon_goi` (đợt cũ, đợt dựng
   tay): mục `goi-dot` là `thieu` với việc «gọi `mo <tên> --goi`», nhưng `moDotKq` trả `daMo` trước khi đọc
   gói — `/dieu-phoi:mo-dot` bước 1 và bước 7 bảo phiên làm mục thiếu nên phiên giám sát quay vòng.
6. **Bước mở ô trong `mo-dot.md` không có đường tới bộ giải (Ngoài-17).** Bước 3 bảo giải `$AG` bằng
   `resolve-plugin.mjs` của feature-loop, nhưng `${CLAUDE_PLUGIN_ROOT}` trỏ gói `dieu-phoi` và gói này không
   có bộ giải; lời gọi `lo-trinh.mjs --mo-o` cũng thiếu `--require` khuôn ô
   (`skills/acceptance/references/opportunity-template.md`) mà mẫu chuẩn ở SKILL feature-loop luôn kèm.

## Hướng

Một vòng «đợt chỉ giao việc người đã quyết, mỗi việc một dãy»: (1) `mo` và lệnh `hang` gỡ hoặc đánh dấu
`ngoai_dot` cho hàng có quyết định khác `build`, `chonHangKe` bỏ qua chúng, kèm ca so thẻ ↔ `tiep/`;
(2) `kiemHangViec` cấm slug trùng giữa các dãy, `themHang` lấy slug và `ma` từ lộ trình như
`docHangLoTrinh`; (3) đường không gói từ chối thư mục cũ ở `dang-dong` như đường có gói; (4) việc của mục
`goi-dot` cho đợt đã mở chỉ nêu lối làm được (đóng rồi mở lại từ gói), hoặc mục ấy là `khong-ap` với đợt
cũ như mục `vai`; (5) gói `dieu-phoi` mang bộ giải gói anh em của riêng nó (hoặc một con trỏ tới gốc
feature-loop) và lời gọi `--mo-o` require đủ hai tệp. Mỗi mục một cặp ca hai chiều trên cùng fixture.

Ngưỡng mở ô: ≥1 đợt thử thật vấp một trong sáu lỗ, có sự kiện trong `su-kien.jsonl` hoặc dòng Nhật ký của
đợt làm neo.
