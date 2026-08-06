# Plan — measure-teeth-cleanup

Mốc so-bản-cũ: đọc từ `decisions.jsonl` (`base = e13199b…`).

**Hai quyết định thi công ghi trước** (đưa vào ledger, trình lại Cổng 2):

1. **AC-6 không đụng `--json`:** bộ đếm độc lập lộ qua cờ MỚI `--stats` của
   `acceptance-gold.mjs`; đầu ra `--json` mặc định giữ nguyên từng byte → chân
   so-bản-cũ P160 không bị đụng, và mọi assert bị sửa trong vòng này đều phân
   loại được là SIẾT (chặt hơn thuần) — không có NỚI nào, đúng luật AC-9.
2. **Nguồn độc lập của AC-7:** đọc theo chữ ("mọi khối có dựng bản sao") sẽ
   đòi bảng ~40 dòng — ngoài phạm vi 5-phép-đo đã duyệt. Thi công theo nghĩa:
   khối thuộc diện phải-có-răng mang thẻ `[TEETH]` trong tiêu đề `run`; tập
   thẻ trong cây kiểm ⇔ tập dòng bảng, hai chiều đều đỏ. Hai nguồn ở hai
   file khác nhau — sửa cả hai để lách là nhìn thấy được ở Cổng 2.

## T1 — hạ tầng chạy-một-khối (independent: false)
Files: `tests/plugins/run-tests.sh` (helper `run`)
Biến `ONLY_BLOCK`: đặt thì mọi khối có tiêu đề không chứa chuỗi đó bị bỏ qua
(không tính pass/fail). Phục vụ E8/E9 (mỗi dòng bảng ~vài giây).

## T2 — sửa sản phẩm (independent: false)
- `carry-plan.mjs` parseArgs: cờ lạ CÓ giá trị → tiêu thụ giá trị, báo đúng
  cờ (AC-3); ba thông điệp fail-loud khác nhau đôi một (AC-2 đo được).
- `acceptance-gold.mjs`: cờ `--stats` in JSON `{judgmentBlocks, points}` —
  `judgmentBlocks` đếm block có `judged_by` bằng NHÁNH ĐỘC LẬP với nhánh
  human_override; `--json` mặc định không đổi byte (AC-6).
- Chốt P162: mở rộng rút tham chiếu sang dạng không-tiền-tố + tên file
  gạch dưới/hoa/đuôi khác; bảng TSV thêm nhóm `CONSUMER` (AC-1).
- Chốt P161-E12: bỏ ngưỡng 25 → 0 mồ côi; bộ phân loại CHE đoạn mã bằng
  token thay vì xoá (AC-4). P161 RENDER: assert 3 số (AC-5).

## T3 — bảng răng + chốt thi hành (independent: false)
Files: `scripts/measures-need-teeth.tsv`, `tests/plugins/run-tests.sh` (P163)
≥6 dòng: tên khối · lệnh dựng vật hỏng (bash, chạy trong bản sao cây) ·
chuỗi phải xuất hiện. P163: với mỗi dòng — chép cây (trừ .git), chạy
`ONLY_BLOCK=<khối>` (XANH) → áp vật hỏng → chạy lại (ĐỎ + chứa chuỗi);
biến `TEETH_CHILD=1` để P163 tự bỏ qua trong lượt con. E9: làm hỏng assert
một khối trong bản sao → P163 đỏ đích danh.

## T4 — chốt SIẾT/NỚI (E10) + kiểm toàn phần (independent: false)
Mọi dòng assert của mốc bị sửa/xoá phải có entry ledger `SIẾT —`/`NỚI —`
trích đoạn dòng cũ; NỚI hoặc thiếu → đỏ. Ledger entry viết TRƯỚC mỗi lần sửa.
Verify: 6 lệnh kiểm + sync mirror + product-map.
