# Hình tại điểm quyết định — phan-du-bo-cuc-moi-vong-ba (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-2 bản gốc ghim 644e9b49 | một bước, không rẽ | dưới ngưỡng: 1 bước |
| d-…-3 rà lớp merge-base: hai nhóm | hai nhánh rẽ | `hai-cay-va-thuoc.png` (khung trái) |
| d-…-4 haiCay: cây đang chạy phẳng hay mới | hai nhánh rẽ | `hai-cay-va-thuoc.png` (khung giữa) |
| d-…-6 thước: luật tĩnh trước, đo dài sau | ba bước nối tiếp (tĩnh → đo → ký) | `hai-cay-va-thuoc.png` (khung phải) |
| d-…-9 Hỏi-1 P161 | hai lối, một bước | dưới ngưỡng: 1 bước |

## Đề bài `hai-cay-va-thuoc`

- Loại: ba khung ngang (flowchart nhỏ), chữ tiếng Việt.
- Khung 1 «Ca dùng merge-base»: rẽ hai — «kỳ vọng tuyệt đối theo mốc» → «ghim commit cố định» ; «so tương đối nhánh không đổi X» → «giữ merge-base sống (xanh rỗng sau gộp)». AC-1, AC-2.
- Khung 2 «haiCay(cây đang chạy)»: rẽ hai — «phẳng» → phẳng = cây này, mới = dungKhoMoi(cây này) ; «bố cục mới» → mới = cây này, phẳng = bung cha của commit dọn nhà → chốt «cha phải phẳng» (không thì HẠ TẦNG). AC-3, AC-4.
- Khung 3 «Nhịp thước»: --tinh (vài giây, loại routing-baseline.txt) → đỏ: dừng · xanh: --cu / --moi / --sau-gop / --chieu-do → PR → CI đỉnh xanh → mời ký. AC-10.
