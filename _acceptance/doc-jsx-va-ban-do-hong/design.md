# Thiết kế: doc-jsx-va-ban-do-hong

Nguồn: mục Ngoài-4, Ngoài-5 của `_acceptance/t3-can-ho-so-arm/review-findings.md`, chủ kho chọn «mở hợp đồng mới» ở Cổng
Bằng chứng 2026-11-10. Cả hai có sẵn từ trước, không phụ thuộc bản vá của hồ sơ đó.

## 1. Vì sao làm

Bản đồ khuôn là lưới giữ các màn nhất quán. Hai lỗ làm lưới sai mà không ai thấy:

- **Đọc thuộc tính sai.** Bước chấm tìm khe bắt buộc bằng biểu thức dừng ở dấu `>` đầu tiên, kể cả `>` của mũi tên trong
  thuộc tính. Thành phần có hàm mũi tên đứng trước khe bị báo oan thiếu khe; thẻ tự đóng có mũi tên lại lọt khe `children`.
  Hai chiều xảy ra trên cùng một thẻ: `<K onClose={() => dong()} title="x" />` hiện bị báo thiếu `title` (oan) và không bị
  báo thiếu `children` (sót).
- **Bản đồ hỏng làm lưới im.** Lưới ở bước sinh tham số lượt chấm hỏi «vòng có chạm nhóm nào không». Một tệp bản đồ không
  đọc được thì nhóm của nó biến mất khỏi câu trả lời, nên câu trả lời là «không», lượt chấm đi tiếp mà không ai biết.

## 2. Cách làm

### Bộ quét thẻ mở (`scripts/ban-do-khuon.cjs`)

Hàm mới đi từ ngay sau tên thẻ tới dấu `>` đóng thật, bỏ qua trọn: tham số kiểu của thẻ (`<K<Hang> …`), chuỗi, biểu thức
trong ngoặc nhọn (đếm độ sâu, biết chuỗi, chuỗi mẫu có `${}` lồng, chú thích, biểu thức chính quy), chú thích giữa các
thuộc tính. Kết quả là một bản **phẳng** chỉ còn tên thuộc tính ở cấp thẻ, giá trị rút thành `""` hay `{}`, nên khe nằm
trong chuỗi hay trong biểu thức con không được tính là khe của thẻ. Cờ tự đóng và cờ spread đọc từ cấp thẻ: `{...props}` là
spread, còn `style={{...s}}` thì không.

Trong biểu thức, JSX lồng có thể chứa dấu nháy trong văn bản (`<p>it's</p>`), nên dấu nháy đứng sát sau một chữ cái hay chữ
số, hoặc không có cặp trên cùng dòng, được coi là chữ thường. Dấu `/` chỉ mở biểu thức chính quy khi ký tự có nghĩa đứng
trước là một trong `( , = : [ ! & | ? {`, nên phép chia không bị đọc nhầm.

Thẻ không tới được dấu đóng (hết tệp, ngoặc hụt) → `khong_do` ghi «thẻ không đọc được», không suy đoán.

Vì sao không biểu thức tốt hơn: biểu thức không đếm được ngoặc lồng. Vì sao không bộ phân tích TypeScript: phụ thuộc mới,
bộ đọc đã khai không dùng thư viện nào và chạy ở kho tiêu thụ.

### Lưới bản đồ hỏng (`feature-loop/scripts/s4-args.mjs`)

Bộ đọc thêm trường `mat_nhom` — tập con của `sai` gồm các lỗi làm một nhóm mất khỏi lưới: không có frontmatter, YAML
không đọc được, frontmatter không phải mapping, thiếu khoá `nhan_dien`. `s4-args`:

- `mat_nhom` không rỗng → dừng (thoát 2), không sinh tệp, gọi tên từng tệp và lý do. Lưới mù thì không trả lời được.
- `sai` còn lại → mỗi lỗi một dòng stderr, sinh tệp bình thường. Các lỗi này không làm nhóm mất (ngoại lệ trỏ tệp đã xoá,
  màn mẫu vắng), nên lưới vẫn trả lời đúng; bước chấm khuôn báo chúng thoát 1 ở vòng có eval khuôn (AC-7 đo điều này). Chặn
  cả các lỗi này sẽ dừng một vòng không liên quan để người sửa một dòng ngoại lệ, không có gì để quyết.

`--json` của bộ đọc giữ nguyên hình dạng: lint của kho tiêu thụ đọc đầu ra đó.

## 3. Không làm

- Tên thẻ trùng tên kiểu trong mã TypeScript (`useRef<Khung>()`) vẫn được đếm như thẻ: lỗi khác, có từ trước, cần phân biệt
  ngữ cảnh rộng hơn thẻ mở.
- Thẻ nêu trong chú thích hay chuỗi của tệp vẫn được đọc như thẻ thật.
- Cờ «chưa chấm khuôn» trên thẻ Cổng Bằng chứng (`theCong2`) cũng dùng câu trả lời «vòng có chạm nhóm không»; đổi thẻ là việc
  riêng, vì `s4-args` đã dừng trước khi tới đó.

## 4. Đo

Ca đo mở bằng «DJ-» ở `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`. «Bộ máy gốc» là `git archive` của commit trước vá,
bung trong lượt, chạy trên CÙNG kho với cây đang kiểm, để chứng minh ca đo chạm đúng lỗi. Mỗi ca «-do» tiêm một nhát vào
bản sao TRỌN thư mục, sau khi bản lành xanh trên cùng fixture, và ghim thông điệp.
