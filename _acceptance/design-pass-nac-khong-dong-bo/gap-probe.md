---
slug: design-pass-nac-khong-dong-bo
at: 2026-08-24T23:53:53Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

# Phản biện context sạch — design-pass-nac-khong-dong-bo

Một phiên sạch, sáu đầu vào (thiết kế · hợp đồng · bộ đo · sổ quyết định · bài
học xuyên hồ sơ · hồ sơ cơ hội). Không đọc code — code chưa tồn tại.
Một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Ma trận mutant không toàn phần: sáu ca tuyên khẳng định N vế nhưng chỉ khai ĐÚNG MỘT chiều đỏ (E2 2 vế · E3 3 · E5 4 · E6 2 · E7 2 · E12 4). Riêng vế E7 «không nêu bộ dựng nào bắt buộc» là assert VẮNG-MẶT trên không gian mở, không ca tiêm nào chứng minh nó biết đỏ | Người thi công viết mục kỷ luật phương án nhưng bỏ vế «ngả máy khuyên GHIM TRÊN VẬT» — đúng vế mà ván thử 19/08 chết vì thiếu. Không mutant nào ép vế đó phải đỏ, ca vẫn in PASS. Cùng cách: skill viết «nấc 1 cần bộ dựng canvas» → ca xanh, kit nhận lại đúng phụ thuộc mà Out of scope cấm. Cổng Bằng chứng đọc một cột PASS và ký trên vật thiếu vế | Ma trận toàn phần viết TRƯỚC khi code: số mutant = số vế được khẳng định; mỗi mutant bẻ đúng MỘT vế, thông điệp đỏ ghim tên vế. Vế vắng-mặt phải có ca tiêm dương | **fixed:** bảng ma trận vào đầu `evals.yaml` như hợp đồng (E1=5 · E2=2 · E3=3 · E4=2 · E5=4 · E6=3 · E7=3 · E8=3 · E9=2 · E10=4 nhánh · E11=3 · E12=4 · E13=3 · E15=2); từng `expected` liệt mutant đích danh; E7 thêm ca tiêm dương m3; E14 đối chiếu số mutant thực thi với bảng |
| P1 | contract | AC-2 đòi câu chết = 0 «ở bất kỳ đâu trong skills/ và feature-loop/» nhưng E13 khai phạm vi hai FILE, trong khi bản base dựng trọn hai THƯ MỤC — hai đầu của cùng hàm đếm nhận phạm vi khác nhau, và không ca nào tiêm vào file thứ ba | Người thi công xoá câu chết ở hai file đã biết, một bản chép còn sống ở file thứ ba dưới hai thư mục. Đếm ở mốc ≥1 nên đối chứng dương xanh; đếm ở cây chỉ quét hai file nên = 0; ca in OK; mặc định đồng bộ vẫn còn trong cây mà AC-2 được coi là đạt | Cùng một glob thư mục ở hai đầu; thêm chân tiêm vào file THỨ BA ⇒ phải đỏ, ghim đường dẫn file còn sót | **fixed:** AC-2 khai phạm vi bằng `skills/**` + `feature-loop/**` và nói rõ hai đầu nhận CÙNG glob; `paths` của E13 đổi sang hai thư mục; E13 thành 3 chân, chân (3) là chân tiêm |
| P1 | evals | AC-11 hứa QUAN HỆ («nói cùng một chữ») nhưng E11 đo ĐẾM SỐ BẢN CHÉP so với bảng khai tay; không mốc neo nào giữ NGUYÊN VĂN câu chuẩn nên không có nguồn để so bằng | Vòng lặp viết «mặc định là nấc 1 async trên ảnh», nghi thức viết «mặc định async, nấc do máy khuyên» — hai câu mâu thuẫn về nấc mặc định nhưng cả hai đều khớp needle lỏng, đếm được 2 đúng bằng bảng ⇒ ca in PASS. Bất biến «một cây nguồn» trượt đúng chỗ nó được lập ra để giữ | Câu chuẩn nằm giữa cặp mốc neo; phép đo RÚT câu từ mốc rồi khẳng định mỗi site chứa đúng nguyên văn. Chiều đỏ: đổi MỘT TỪ ở một site ⇒ đỏ ghim cặp (site, chỗ lệch) | **fixed:** thêm mốc neo `REACTION-DEFAULT-SENTENCE` (bản gốc DUY NHẤT) vào AC-11 + thiết kế §7; E11 đổi sang so nguyên văn, ma trận 3 mutant (lệch một từ · thừa · thiếu) |
| P1 | contract | Trục C của Coverage khai bốn phần tử nhưng «không có sổ phiên» không AC nào phát biểu và không eval nào chạm | Bộ dựng thẻ thêm đường dựng nhãn nấc; gặp hồ sơ KHÔNG có sổ phiên thì đọc trường vắng và in khối rỗng / nhãn «undefined» / ném lỗi làm thẻ không dựng được. Mọi ca khác đều nạp hồ sơ CÓ sổ phiên nên đều xanh. Đây là nhánh phổ biến nhất ở kho tiêu thụ — và là nhánh của CHÍNH hồ sơ này, vì kit không chạy nghi thức thiết kế | Hồ sơ code sinh KHÔNG có sổ phiên, chạy cùng bộ dựng thẻ: thẻ dựng THÀNH CÔNG, khối vắng hẳn, không cờ nấc, không nhãn lạ | **fixed:** thêm AC-15 + eval E15 (ca DP13) với 2 mutant; Coverage trục C ghi rõ phần tử thứ tư đã có AC; thiết kế §8 thêm hàng và nêu vì sao nhánh này không phải ca hiếm |
| P1 | contract | Ngưỡng CHẾT thứ ba của hồ sơ cơ hội («máy né bước phân kỳ và bị owner veto ≥ 1 lần») không có dòng nào trong `## Đường đo` và không có entry bỏ có tên; kèm theo AC-6 bắt «để vết một dòng» mà không khai TÊN KHOÁ nào | Cổng Phạm vi duyệt vì mọi ngưỡng trông như đã có đường đo. Tới ván thử, máy bỏ bước phân kỳ vài lần, vết nằm chỗ tuỳ hứng mỗi phiên nên không đếm được bằng máy lẫn bằng tay. Cổng Giá trị mở ra với một ngưỡng CHẾT KHÔNG CÓ SỐ mà cũng không có lý do khai trước — treo đúng như hồ sơ `duong-do-trong-dinh-nghia-xong`, tức rủi ro mà giả định sinh tử #6 đã gọi tên | Một dòng Đường đo: số lần bỏ bước phân kỳ và số lần bị veto · số từ khoá vết ĐÓNG trong sổ phiên · bảo đảm bởi AC-6 và AC-8 | **fixed:** thêm khoá `divergence: opened \| skipped — <căn cứ>` (từ vựng đóng) vào khuôn sổ phiên; AC-6 nêu đích danh khoá; AC-8 và E8 kiểm nó như hai khoá kia (3 mutant); thêm dòng `## Đường đo` cho ngưỡng CHẾT thứ ba |

Ghi chú không nâng thành finding, đã nhận và sửa kèm: E10 chưa khai nguồn khuôn
cho ba hồ sơ của nó — nếu chúng tự dựng frontmatter theo kỳ vọng bên ĐỌC thì đổi
khuôn ở đầu VIẾT sẽ không làm ca đỏ. `expected` của E10 nay khai thẳng: ba hồ sơ
rút từ CÙNG mốc neo `DESIGN-PASS-NOTE-TEMPLATE`.

## Trả lời cross-check

- **(a) AC không có eval:** ánh xạ đủ AC-1…AC-15. Hai vế con từng hở đã vá —
  vế câu-chết của AC-2 (phạm vi lệch) và vế vết-sổ-phiên của AC-6 (không có khoá).
- **(b) Mệnh đề không đo được như đã viết:** AC-11 (quan hệ vs đếm) và AC-6
  (không nêu khoá) — cả hai đã sửa. AC-3/5/7 có Given là tình huống chạy thật
  trong khi Then chỉ kiểm được sự có mặt của LỜI: chấp nhận ở ô này vì vật giao
  đúng là lời, và chính vì thế ma trận mutant phải toàn phần.
- **(c) Trục Coverage không có AC phủ:** trục C thiếu phần tử «không có sổ phiên»
  — đã thêm AC-15 + E15.
- **(d) Ngưỡng không có đường đo và không có entry bỏ:** ngưỡng CHẾT «máy né bước
  phân kỳ bị veto ≥ 1» — đã thêm dòng Đường đo + khoá `divergence:`. Các ngưỡng
  còn lại đều có neo; độ lệch bộ-phương-án ↔ vật-thật có dòng «KHÔNG ĐO» kèm lý
  do và con trỏ, khớp entry bỏ có tên trong sổ quyết định.
- **(e) Lớp đo-lường:** ma trận không toàn phần ở sáu ca (đã sửa) · hai assert
  vắng-mặt thiếu ca tiêm (đã sửa) · không có fixture viết tay · không có đường dẫn
  hardcode gốc kho (E13 đọc mốc từ hợp đồng, dựng base bằng `git archive` trọn
  thư mục — đã né lớp lỗi P150) · E1–E8 và E12 đo chữ trong tài liệu, hợp lệ vì
  vật giao là lời; chỗ CÓ đầu ra thật thì đã đo đầu ra thật (E9/E10/E15 chạy chính
  bộ dựng thẻ).
