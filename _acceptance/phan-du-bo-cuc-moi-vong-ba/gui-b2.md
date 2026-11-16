# Gửi B2 — phan-du-bo-cuc-moi-vong-ba

Bốn thứ kịch bản chuyển nhà của B2 (`migration/kich-ban/` ở kho `delivery-loop`) cần biết để chạy trên cây của vòng này.
Thước: `node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`. Bảng vá chép ở `rang/va-bo-kiem-b2.json` — ảnh chụp
`migration/kich-ban/va-bo-kiem.json` của nhánh B2 tại commit `86669ccd` (267 mục, sha256 `351bedfe…`). Hai khối máy dưới đây
không sửa tay trừ khi đổi khai báo có chủ ý. Khối tự đúng đường của vòng hai (`_acceptance/phan-du-bo-cuc-moi/gui-b2.md`) vẫn
đúng; khối ở đây là PHẦN THÊM của vòng ba — bước 6 bỏ qua hợp hai khối.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Máy ghi bằng `--ghi-gui-b2`; `--tinh` rút lại và so. Một mục thừa khi tệp của nó nằm trong khối ở mục 2 (bước 6 bỏ qua tệp
ấy — không luật đường, không bảng vá). Xoá các mục này khỏi bảng vá.

<!-- <<<GUI-B2-VA-THUA -->
<!-- GUI-B2-VA-THUA>>> -->

## 2. Tệp tự đúng đường — bước 6 bỏ qua

Các tệp vòng ba sửa hoặc tạo dưới `tests/`, đã tự giải đường qua bộ dịch `tests/bo-cuc.mjs` (và `tests/hai-bo-cuc.mjs`).
Luật đổi tên (bước 3) vẫn áp như mọi tệp dưới `tests/`. Danh sách viết TRƯỚC khi đo; luật tĩnh của thước đòi nó bằng đúng
tập tệp vòng sửa (`git diff --name-only 795baf96 HEAD -- tests/`; `tests/scripts/fixtures/routing-baseline.txt` chỉ rời tập
khi mọi dòng đổi là dòng thêm của chính hồ sơ này — dòng lệnh ký ghi).

<!-- <<<GUI-B2-TU-DUNG -->
```text
```
<!-- GUI-B2-TU-DUNG>>> -->

## 3. Cấu hình kịch bản phải đổi

(điền ở S3)

## 4. Ca đổi nghĩa và lý do

(điền ở S3)
