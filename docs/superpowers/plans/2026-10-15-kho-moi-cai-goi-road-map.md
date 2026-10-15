# Kế hoạch thi công — kho-moi-cai-goi-road-map (RM4)

Hợp đồng: `_acceptance/kho-moi-cai-goi-road-map/contract.md` (duyệt 15/10) · thiết kế:
`docs/superpowers/specs/2026-10-15-kho-moi-cai-goi-road-map-design.md`. T2 — không Gate 1.5. Thi công tuần tự trong
phiên chính (các task chạm chung tệp ca đo).

| # | Task | Tệp | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | `config-patch.mjs --append`: nối một mục `- "<v>"` vào danh sách khối (khối vắng → tạo khối và cả chuỗi cha); mục đã có → thoát 2; tự đọc lại bằng `configList` trước khi ghi | `scripts/config-patch.mjs` | KM-3-append-trung + bộ kiểm cũ của config-patch (`tests/scripts/run-tests.sh` mảnh bash) | E3 | false |
| 2 | `product-map.mjs` tách `veTrangLoTrinh(root)` (khoá → nạp lo-trinh → tin hiệu → `veTrang`), main gọi lại; không đổi đầu ra | `scripts/product-map.mjs` | bộ kiểm bản đồ + `lo_trinh`, `lo_trinh_trang` xanh; `--check` của kit thoát 0 | E4, E6 | false |
| 3 | `scripts/lo-trinh-khoi-tao.mjs`: điều kiện bật (marketplace.json, chỉ `settings.json`) → bước 0–5 hội tụ, mỗi bước một hàm, thoát 0/2/3/4; dòng tóm tắt | mới | KM-1, KM-2, KM-3, KM-5, KM-6 | E1–E6, E9 | false |
| 4 | Thẻ start ca 0 việc: câu mới trong `loTrinhThe` | `scripts/lo-trinh.mjs` | KM-7-rong, KM-7-co-viec + `lo_trinh` suite | E7 | false |
| 5 | `acceptance-init.md` bước 5d + khối `INIT-LO-TRINH` (lệnh + bảng mã thoát) + bước 1; `road-map/README.md` «Cài cho một kho»; GUIDE đoạn lộ trình | 3 tệp docs | KM-8 + P-ca hiện có đọc khối INIT (`plugin-declare.test.mjs`) | E8 | false |
| 6 | Ca đo `tests/scripts/kho-moi-cai-goi-road-map.test.mjs` (KM-1…KM-8, mỗi ca đỏ trên bản sao, nhát tiêm khớp đúng một lần) + `…-cac-kho.mjs` (KM-9) | mới | chạy cả hai, mọi dòng PASS ghim | E1–E9 | false |
| 7 | Ghi nấc 3 vào `ghi_chu` hàng RM5 (Hỏi-1 nhận khuyến nghị) + sổ ghi giờ máy | `docs/plans/lo-trinh-kit.json` | `lo-trinh.mjs` đọc tệp 0 cờ mới, `product-map --check` | — | false |

Lựa chọn tải trọng: bước 5 (trang) vẽ bằng hàm tách từ product-map (task 2) để một bản vẽ; khoá trước tệp (sổ
d-…-15). Verify cuối S3: hai lệnh ca đo + `feature_loop.suite_keys` qua khoá máy ở S4.
