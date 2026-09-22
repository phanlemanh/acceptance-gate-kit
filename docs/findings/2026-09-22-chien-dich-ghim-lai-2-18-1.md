# Chiến dịch ghim lại theo mốc 2.18.1 — 22/09/2026

Nối tiếp mốc 2.18.1 (PR #204, gộp `ccabea22`), theo GUIDE §7.1. Nguồn: đầu ra nguyên văn của
`feature-loop/scripts/repin-lane.mjs`. Cách chạy giữ nguyên nếp 2.18.0: lượt 1 đo để phân loại,
lượt 2 ghim riêng tập xanh.

## Số

| | Lượt 1 — mọi hồ sơ hoá cũ | Lượt 2 — chỉ hồ sơ xanh |
|---|---|---|
| hồ sơ | 67 | 64 |
| eval máy | 661 | 631 |
| suite chung | 5/5 xanh | 5/5 xanh |
| hồ sơ có eval đỏ | **3**, mỗi hồ sơ **1** eval | 0 |
| tệp hồ sơ đã ký bị chạm | 0 | 0 |
| kết quả | ĐỎ — không ghi gì | XANH — ghi, run_id `repin-20260922T110053Z-46306` |
| phút máy (tổng thời lượng lệnh) | ≈ 80 | ≈ 59 |

Danh sách hồ sơ hoá cũ rút từ `pre-merge-check.sh --recheck-all` trên `ccabea22`.

## Ba hồ sơ nghỉ — owner quyết 22/09 («nghỉ cả ba hồ sơ đỏ»)

| Hồ sơ | Eval đỏ | Vì sao |
|---|---|---|
| `cua-veto-sau-chu-ky` | E10 | ghim `release-2-0-0` vào tập «cửa veto còn mở»; 2.18.1 bỏ hồ sơ đã chấm bởi thực tế khỏi tập đó có chủ đích |
| `lan-v-khong-phai-cho-ky` | E7 | mutant 2 hỏng vì `xanhSach` đổi chữ ký hàm ở 2.18.1 — đã khai sẵn ở hồ sơ mốc |
| `release-2-18-0` | E4 | `rel-cua-so.sh` đọc `2826f807..HEAD` → thấy `ho-so-khep-thoi-hoi` ký sau mốc |

Mỗi hồ sơ nhận đúng một dòng `type: nghi` mang tên owner (khối NGHI-LINE-RECIPE ở GUIDE). Ba hồ
sơ đổi nhóm `da-giao → da-nghi` nên khối `KHAC-BIET-DOC-CU` của `ra-co-ten-lam-va-trao` khai thêm
ba dòng (RT13); bản ghi mốc định tuyến sinh lại cùng commit (LM20 xanh) và bản đồ vẽ lại.

**Đọc bảng:** không hồ sơ nào đỏ vì một hồi quy của vật. Hai hồ sơ đỏ vì chính thay đổi có chủ đích
của 2.18.1, một hồ sơ mốc đỏ vì phép đo cửa sổ không có điểm cuối cố định. Hình dạng thứ ba lặp
đúng chiến dịch 2.18.0 (`release-2-15-0`/`-16-0`/`-17-0`): mọi hồ sơ mốc đo cửa sổ bằng `..HEAD`
sẽ đỏ ở mốc kế tiếp. Ghi ở đây, không mở ô.

**Hạ tầng:** suite scripts chạy 601 s trong lượt 1 (ca E12 của `cua-veto-sau-chu-ky` bọc cả suite)
— đã khai ở hồ sơ mốc 2.18.1 là vượt trần 600 s của công cụ.
