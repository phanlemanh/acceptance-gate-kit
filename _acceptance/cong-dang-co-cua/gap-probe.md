---
slug: cong-dang-co-cua
at: 2026-09-01T02:34:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — cong-dang-co-cua

Một agent tươi, sáu đầu vào (design doc · contract · evals · sổ quyết định ·
bài học xuyên hồ sơ từ claim-scan · ô cơ hội). Không đọc mã kho — code chưa
tồn tại, đây là phản biện ARTIFACT.

Một lượt, không phản biện lại sau khi sửa (luật one-pass; phần mã đã có ba
vòng nghiệm thu ở S4).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Hành vi GHI của chế độ ký (bốn nhãn → bốn giá trị máy → ghi ô + sổ + bản đồ một lượt) không AC nào phủ; dòng Đường đo vẫn tuyên «bảo đảm bởi AC-11 + AC-12» trong khi hai AC đó chỉ đo hình dạng văn bản — overclaim cùng lớp [suite-run-log-provenance#F1] và [cham-dung-cay-dung-cho-dung#F1]. Ngưỡng «1 PR» không có dòng nào | Thẻ in đủ bốn nhãn, ba văn bản liệt đủ bốn nhãn nên E8/E11/E12/E13 xanh hết; nhưng bảng ánh xạ chỉ dẫn được hai giá trị máy. Owner ký «xếp lại» cho ô kế tiếp: máy không ghi được, phải hỏi lượt hai — đúng định nghĩa «Kết quả CHẾT» của ô cơ hội, mà cổng đã duyệt vì tin chữ «bảo đảm bởi» | Chân chạy trên bảng ánh xạ rút bằng máy: đủ bốn hàng, tập giá trị máy bằng tập enum `decision` rút từ lib | **fixed:** thêm **AC-13** + **E14** (đủ-hàng, so TẬP với `NAV_RULES` của `lib/workspace-record.cjs`, ba lượt tiêm riêng). Đường đo viết lại: phân biệt «bảo đảm bởi» ↔ «phủ hai dấu hiệu» ↔ «không đo được trong vòng này», và thêm dòng riêng cho ngưỡng «1 PR» |
| P1 | contract | Trục C khai bốn nấc ngưỡng, chỉ hai nấc có AC. Nấc `[đề xuất]` và nấc khai «Không đo được — » không nấc nào được dựng fixture | Owner làm đúng thứ kit dạy — điền «Không đo được — vì chưa có người dùng thật» — mà thẻ vẫn cắm cờ đỏ và răng ký vẫn chặn làm/lặp, nên ô không ký được bằng đường nào; 13 eval xanh trọn vì không ca nào dựng ở nấc đó | Ma trận toàn phần bốn nấc, mỗi nấc ba khẳng định, nấc rút từ lib | **fixed:** AC-2 viết lại thành ma trận 4 nấc × 3 khẳng định = 12 assert viết trước; E2 dựng bốn ô code-sinh khác nhau đúng ở thân section ngưỡng; Coverage thêm dòng phủ-theo-trục-C |
| P1 | contract | AC-1 phát biểu đẳng thức HAI CHIỀU («tập slug hai bên bằng nhau») trong khi design §2 khai B1 một chiều và B2 khai phần dôi hợp lệ; E1 lại chỉ khẳng định A ⊆ B. Ba văn bản nói ba điều về cùng một bất biến | Ô 5 nằm trong B mà không trong A, nên đẳng thức AC-1 hứa là sai theo thiết kế. Hai lối hỏng đều thật: thi công đọc AC-1 nguyên văn rồi bắt bộ dựng từ chối ô 5 → giết AC-2; hoặc người chấm viết assert đẳng thức → E1 đỏ trên bản cài ĐÚNG, đốt lượt chấm vì hạ tầng | Sửa lời AC-1 về một chiều, và cho phần dôi một thước riêng | **fixed:** AC-1 viết lại: `A \ B` rỗng (một chiều) **và** `B \ A` bằng đúng tập ô nấc ngưỡng-chưa-chốt. E1 thêm khẳng định (2) + lượt tiêm (b) bắt bộ dựng từ chối ô 5 để chứng phần dôi có canh |
| P1 | evals | E1 tuyên «số assert = 10 ô» nhưng ô 1 (vắng `config.yaml`) và ô 2 (vắng thư mục hồ sơ) là thuộc tính của GỐC CÂY, không dựng được bên trong một xưởng. Số dựng được nhiều nhất là 8 — lớp ma-trận-không-toàn-phần [design-pass-nac-khong-dong-bo#F1] | Thi công chỉ sinh được 8 ô, so với hằng 10 nên đỏ vì hạ tầng chứ không vì vật; hoặc người chấm lặng lẽ đổi thành «số ô dựng được», mất đúng tính chất viết-trước, và từ đó một ô bị quên không còn làm phép đo đỏ | Liệt đích danh ô dựng được + đếm thư mục thực sinh trước khi chạy hai bộ đọc | **fixed:** E1 liệt đích danh 8 ô (9 thư mục, ô 7 hai biến thể), ghi rõ ô 1–2 do E6 phủ, và chốt số phần tử bằng một bước đếm thư mục chạy TRƯỚC. AC-1 + Coverage nói cùng một điều |
| P2 | evals | E9 có hai khẳng định âm tính nhưng đối chứng dương chỉ khai cho khẳng định (2); không ca nào chứng minh `--extract` thật sự chạy và sinh đầu ra có nội dung, cũng không ca nào chứng minh phép so băm đỏ được | Gõ sai cờ / thoát 127 / in rỗng: băm dĩ nhiên không đổi, đầu ra rỗng dĩ nhiên không chứa `decision` → cả hai khẳng định xanh trong khi phép đo chưa chạm vật. AC-9 là một trong các dòng Đường đo nên cổng tin thước «0 chữ của người bị máy viết trước» đã có răng | Ghim mã thoát 0 + mẩu nội dung bắt buộc trước hai khẳng định âm; thêm ca ghi một byte rồi khẳng định phép so băm ĐỎ | **fixed:** E9 thêm bước «chứng lệnh đã thật sự chạy» đặt TRƯỚC, và đối chứng dương riêng cho từng khẳng định |

## Ghi chú

- Năm finding, năm đều `fixed` ở artifact. Không finding nào đẩy sang
  `human-gate1`, không finding nào `deferred`.
- Đầu vào thứ 5 (bài học xuyên hồ sơ) có tác dụng thật: hai finding cite id
  hồ sơ trước, và cả hai đều thuộc lớp «phép đo tự khai bảo đảm nhiều hơn thứ
  nó chạm». Đây là lần thứ ba lớp đó tái phát — đáng vào sổ lớp lỗi.
- Sửa artifact xong KHÔNG phản biện lại (one-pass).
