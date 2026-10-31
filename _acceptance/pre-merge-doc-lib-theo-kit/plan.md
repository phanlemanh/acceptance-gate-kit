# Kế hoạch: pre-merge-doc-lib-theo-kit

Hai việc tuần tự (việc 2 phụ thuộc việc 1 — chiều đỏ phải nằm trong lịch sử trước vật).

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Commit tệp ca LK1…LK5 + năm khoá eval, ĐỎ trên cây trước vòng | `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs` · `_acceptance/config.yaml` | `node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs` → LK1, LK3 đỏ với `không đọc được mục «Known limits» (fail-closed)`; LK5 gọi tên đúng hai dòng | E1–E5 | không |
| 2 | Bộ giải `kit_lib` trong khối marker `KIT-LIB-THEO-CHO-CAI` + hai chỗ gọi | `scripts/pre-merge-check.sh` | tệp ca xanh trọn (9/9) · `bash tests/scripts/run-tests.sh --manh bash` không đỏ mới · hai tệp ca cũ đo lưới (`dinh-tuyen-theo-ma-muc`, `hskt`) xanh | E1–E5 | không |

Sau việc 2: hợp đồng `implemented`, lượt chấm S4 (cần khoá máy của đợt điều phối đang chạy).
