# Plan — khuon-rang-dung-chung

| # | Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Thư viện khuôn: kr_init/ok/bad/done_chan · kr_git · kr_snapshot · kr_tiem_batdau/xong · kr_vi_phan; khối marker RANG-KHUON-API | scripts/rang-khuon.sh | bash -n + tự chạy demo chân | E1..E4, E6 | false |
| 2 | Lưới thường trực: ma trận 3 hình hỏng móng + sweep call-site bad + tiêm-không-đổi + vi phân + cửa đường rỗng + round-trip API | tests/scripts/rang-khuon.test.mjs | node file → 0 fail | E1..E4, E6 | false (cần 1) |
| 3 | s4-args: đảo mặc định phép loại trong thư mục hồ sơ (chỉ loại đuôi giấy) | feature-loop/scripts/s4-args.mjs | node --check + E7 chân | E7 | false |
| 4 | Viết lại rang.sh của nhanh-chinh theo khuôn, giữ trọn 6 chân + mutant | _acceptance/nhanh-chinh-khong-ten-main/rang.sh | chạy 6 chân → passed | E5 | false (cần 1) |
| 5 | Răng hồ sơ: chân tich-hop (đếm ca chiều-đỏ từ BASE-KRDC + đảo mặc định API) + chân carry-ma-thuc-thi; đăng ký 2 khoá config | _acceptance/khuon-rang-dung-chung/rang.sh, _acceptance/config.yaml | chạy 2 chân | E5, E7 | false (cần 3,4) |

Task phụ thuộc dây chuyền → tuần tự main loop, không fan-out.
