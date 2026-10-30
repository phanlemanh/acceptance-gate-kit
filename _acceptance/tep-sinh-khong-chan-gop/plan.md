# Kế hoạch thi công — tep-sinh-khong-chan-gop (T2, tuần tự)

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Ca đo hai nhánh gộp thật đỏ trước khi có vật | `tests/scripts/tep-sinh-khong-chan-gop.test.mjs`, `_acceptance/config.yaml` | AC-1…AC-7 (ca TS-1…TS-7) |
| Kho đọc được hai dòng khai và một lệnh bật ở một chỗ | `GUIDE.md` (khối GITATTR-TEP-SINH) | AC-1, AC-5 (khối bật một nguồn) |
| Kho kit tự bật | `.gitattributes` | AC-5 (kit tự bật) |
| Thư mục rỗng không còn vào bản đồ và trang lộ trình | `lib/workspace-record.cjs`, `scripts/product-map.mjs`, `scripts/lo-trinh.mjs` | AC-6 (thư mục rỗng), AC-7 (đường đọc-cũ) |
| Bản đồ của kit khớp | `PRODUCT-MAP.md`, `LO-TRINH.html` | AC-8 (bộ cũ xanh) |

Task (mọi task `independent: false` — cùng một tệp test):
1. Ca test trước (đỏ vì chưa có khối, chưa có hàm): verify `node tests/scripts/tep-sinh-khong-chan-gop.test.mjs` → FAIL ở TS-1, TS-5, TS-6, TS-7.
2. Khối GUIDE + `.gitattributes` + cấu hình driver cho bản clone này: verify TS-1…TS-5 xanh.
3. `coTepTrongCay` + hai chỗ lọc: verify TS-6, TS-7 xanh, `product-map.mjs --check` xanh.
4. Suite cục bộ (`run-tests.sh --manh mjs`) cho tệp test mới được nhặt; vẽ lại bản đồ.
