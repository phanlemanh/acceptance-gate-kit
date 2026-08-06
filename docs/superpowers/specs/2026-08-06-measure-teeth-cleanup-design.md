# measure-teeth-cleanup — trả răng cho những phép đo đã bị chính ta ghi là mất răng

**Ngày:** 2026-08-06 · **Slug:** `measure-teeth-cleanup` · **Tier:** T2 ·
**Nguồn:** 66 mục known-limits trên toàn kho; vòng này chỉ lấy nhóm *phép đo
không thể đỏ*. Việc 2 của lộ trình sau chương trình 80/20.

## Vấn đề

Kho có **109 khối kiểm**, trong đó **43 khối không có lần chạy nào trên vật
hỏng** (không mutant, không bản-cũ, không tiêm). Với phần lớn khối cũ điều đó
chấp nhận được — chúng kiểm cấu trúc tĩnh. Nhưng **năm** phép đo đã được chính
ta ghi vào known-limits là *mất răng*: chúng xanh mà không phân biệt được bản
đúng với bản hỏng. Nợ loại này nguy hiểm hơn nợ tính năng: lưới trông thì xanh
mà không bắt được gì, nên mọi vòng sau đều chạy trên nền tin cậy giả.

Nguy hiểm nhất, đo được: gói `design-loop-codex` rút ra **0** tham chiếu dù chỉ
dẫn của nó gọi 4 công cụ — **xoá `provenance.mjs` khỏi gói thì chốt vẫn xanh**,
trong khi bảng lại khai gói đó "đã được quét".

## Phạm vi (cắt chặt — 5 phép đo + 1 bug + 1 chốt)

Lấy: (1) chốt gói Codex mù hai dạng viết; (2) ma trận fail-loud chỉ ghim mã
thoát; (3) ngưỡng dung sai 25 mẫu mồ côi trong khi số thật là 18; (4) bộ đếm
thẻ render đếm-rồi-vứt; (5) chân sanity `judgedBlocks` là hằng đúng. Cộng một
bug sản phẩm một dòng: thông điệp lỗi trỏ vào giá trị thay vì vào cờ viết sai.

**Không lấy:** 60 mục còn lại. Phần lớn là "chưa hoàn hảo" chứ không phải
"không thể đỏ", hoặc đã có hợp đồng riêng (XSS thẻ, nguồn dữ liệu tiếng máy,
hồi quy nhấn-mạnh-lồng). Gom hết vào một vòng là đúng cách làm vòng phình to
rồi không hội tụ — bài học 4 vòng của `card-text-fidelity`.

## Chốt chống tái phát (nhẹ, đo được)

Một bảng ghim liệt kê những khối kiểm **buộc phải có đối chứng vật-hỏng**;
chốt đọc bảng, tìm từng khối trong cây kiểm, và đòi mỗi khối có ít nhất một
lần chạy trên vật hỏng. Thêm tên vào bảng mà khối đó không có đối chứng → đỏ.

Không tham vọng phát hiện tautology tự động — đó là bài toán mở, và bốn vòng
vừa rồi đã dạy giá của việc đuổi theo không gian mở bằng luật cú pháp.

## Out of scope

- 60 mục known-limits còn lại.
- Viết lại các khối kiểm cũ không nằm trong bảng ghim.
- Đổi hành vi sản phẩm nào ngoài một dòng thông điệp lỗi.
