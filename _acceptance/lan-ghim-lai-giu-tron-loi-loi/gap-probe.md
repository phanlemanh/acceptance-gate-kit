---
slug: lan-ghim-lai-giu-tron-loi-loi
at: 2026-10-02T23:01:43Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap-probe — lan-ghim-lai-giu-tron-loi-loi

Phản biện context sạch, một lượt (03/10). Input: design doc · contract · evals · decisions · claims · opportunity.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-4 dùng danh sách bốn bộ đọc viết tay, chỉ so bằng nhau, không đối chứng dương từng bộ đọc; AC-7 không ghim mã mong đợi | bộ đọc gọi sai hồ sơ ra cùng lỗi hai phía nên E4 xanh; bộ đọc thứ năm đếm nhầm dòng mới mà danh sách đóng không thấy | rút danh sách bộ đọc bằng tìm trong mã, số assert bằng số bộ đọc, dấu nội dung từng bộ đọc; ghim năm mã | fixed: AC-4/E4 rút bộ đọc từ mã, bảng cách gọi viết trước, bộ đọc không có hàng → «bộ đọc chưa đo», đối chứng dương từng hàng; AC-7/E7 ghim 0 · 1 · 1 · 1 · 2 |
| P1 | evals | E5 đo thời lượng chỉ bằng khoá có mặt trên fixture nhanh, không mutant | ghi hằng 0, chỉ lệnh cuối, hay mili giây đều xanh — số nền cho vòng paths sai từ dòng đầu | suite ngủ 3 giây + eval ngủ 2 giây, wall_s ≥ 5; hai mutant | fixed: AC-5/E5 ngủ 3+2, cận dưới 5 và cận trên đồng hồ ngoài + 1; mutant «thời lượng hằng», «thời lượng một lệnh» |
| P1 | contract | AC-6 tiêm bằng bỏ lệnh khỏi PATH chỉ có tác dụng trên macOS; nhánh Linux không có phép đo | chạy trên Linux thì phép tiêm không tác dụng, chiều đỏ không chạy; nhánh /proc/meminfo không ai đo | nút tiêm trong vật dùng được hai nền + ca giả lập /proc/meminfo | fixed: bộ đọc tải máy tách thành mô-đun gọi trực tiếp; tiêm nguồn swap không tồn tại trong bản sao (hai nền) có đối chứng dương; bảng ba dòng /proc/meminfo code-sinh |
| P1 | evals | E3 chỉ kiểm khoá log có mặt, không kiểm đường mở được ở slug thứ hai | đường sai gốc thì dòng sổ trỏ chỗ trống, đường đo «log mở được» về 0 | giải log từ gốc kho, mở và tìm dấu riêng; mutant đường tương đối thư mục slug; ghim log null cho hai ca không lệnh đỏ | fixed: AC-3/E3 đòi log tương đối gốc kho mở được và chứa dấu riêng ở CẢ hai slug, log null + ly_do cho hai ca; mutant «dấu trỏ chỗ trống» |
| P2 | contract | Giả định 2 (đầu ra trọn đủ chẩn đoán hai ca thật 02/10) chưa thử; fixture 200 dòng không đại diện đầu ra dài | lời lỗi nằm ở tệp báo cáo riêng của bộ chạy test hoặc phần đầu bị mất vì bộ đệm | phát lại hai đầu ra thật; biến thể > 1 MiB dấu ở dòng đầu | fixed một phần: E1 thêm biến thể > 1 MiB dấu dòng đầu; deferred: phát lại đầu ra thật — hai đầu ra 02/10 không được lưu (chính lỗi ô này sửa), đọc ở ngưỡng UAT ≥ 8/10 |
