# Plan — card-text-fidelity

Mốc so-bản-cũ: `044968e01699c95bfc7f84f00d89304581d1af9a` (đọc từ
`_acceptance/card-text-fidelity/decisions.jsonl`, không hardcode trong test).

## T1 — sửa hàm lột trong `scripts/gate-card.js` (independent: false)

Files: `scripts/gate-card.js`
Phục vụ: E2, E3 (và là vật cho mọi eval còn lại)

Ba bước, thứ tự bắt buộc:
1. Xử lý dạng ba sao TRƯỚC hai sao (`***x***` → `x`), có ràng buộc không-trắng.
2. Hai sao: chỉ lột khi ngay sau dấu mở là ký tự không-trắng, ngay trước dấu
   đóng là ký tự không-trắng, và không dính sao thứ ba.
3. Một sao: cùng ràng buộc.

Verify: `node -e` chạy 12 hình dạng của bảng, đối chiếu kỳ vọng khai trong
marker `STRIP-SHAPE-MATRIX`.

## T2 — bộ đo (independent: false — cần T1 xong để có vật)

Files: `tests/plugins/run-tests.sh` (CHỈ THÊM khối mới, không sửa khối cũ)
Phục vụ: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11

Một khối `P161` gồm 8 phần, tất cả dùng chung một hàm nạp-bảng-từ-marker:
- (1) tập tên bảng ca == tập tên marker + 2 mutant (xoá hàng / đổi tên hàng),
  đối chứng dương bản nguyên vẹn xanh trước — E1
- (2) mọi hình dạng cho ra đúng kỳ vọng, hàm nạp từ file thật — E2
- (3) nhóm LỘT: bản mới == bản cũ trên đúng các hình dạng đó — E3
- (4) bản cũ tại mốc-đọc-từ-sổ: đỏ đúng tập, xanh đúng tập, hai tập không
  rỗng — E4; cây thiếu lịch sử → thông điệp riêng — E5
- (5) thẻ THẬT 2 cổng: đường dẫn nguyên vẹn hai chiều + sanity counter — E6
- (6) đường đọc-cũ HAI CHIỀU (cụm sao mới phải truy về nguồn), CẤM chuẩn hoá
  bỏ-sao — E7; mutant "không lột đậm" phải làm chính phần này đỏ — E8
- (7) quét mọi cụm sao trong corpus thật, chênh lệch phải thuộc hình dạng có
  tên, ghi số vào bằng chứng — E9
- (8) đếm chỗ gọi hàm lột từ mã == con số khai ở trục C — E10

Bản base ghi vào thư mục tạm của hệ điều hành, KHÔNG vào `scripts/` (bài học
vòng trước: rác máy sinh trong cây nguồn làm đỏ oan cổng chống-trôi).

Verify: `PLUGINS_SUITE_NESTED=1 bash tests/plugins/run-tests.sh`

## T3 — đồng bộ mirror + kiểm toàn phần (independent: false)

Files: `plugins/**` (sinh máy)
Verify: 6 lệnh kiểm; `bash scripts/sync-plugin-packages.sh --check`
