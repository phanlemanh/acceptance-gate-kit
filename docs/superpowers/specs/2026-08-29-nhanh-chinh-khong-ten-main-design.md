# Design — nhánh chính không tên main (nhanh-chinh-khong-ten-main)

Nguồn: `_acceptance/nhanh-chinh-khong-ten-main/opportunity.md` (Cổng Đáng build,
Manh Phan 29/08) · phát hiện gốc: Cổng Bằng chứng của
`cham-dung-cay-dung-cho-dung` (PR #123), mục Ngoài-1/Ngoài-4.

## Vấn đề (một câu)

Trong `s4-args.mjs`, hàm `git()` là cửa fail-closed — nó *bắt lỗi rồi thoát tiến
trình*, không ném. Nhưng vòng dò tên nhánh chính lại dùng chính `git()` bên
trong `try/catch`, nên `catch` không bao giờ chạy: danh sách bốn tên chỉ còn
hiệu lực cho tên đầu, và repo dùng `master` chết ngay với thông điệp sai.

## Lời giải: tách HAI vai của một lệnh git

Một hàm không thể vừa là *phép đọc bắt buộc* (thiếu là hỏng → thoát có tên) vừa
là *phép dò* (thiếu là bình thường → thử tiếp). Tách đôi, mỗi vai một tên:

- `git(...)` — giữ nguyên: đọc bắt buộc, hỏng thì `die()` (exit 2, nêu tên).
- `gitTry(...)` — mới: trả `null` khi lệnh thất bại, KHÔNG thoát. Chỉ dùng cho
  phép dò (tên nhánh, remote).

Vòng dò viết lại theo `gitTry`, nên bốn tên đều được thử thật; ca không tên nào
khớp rơi đúng vào câu có hướng dẫn đã viết sẵn (`truyền --diff-base`) thay vì
vết đổ của tiến trình.

Kèm theo, cùng lớp «phép dò không được làm chết vòng»: lệnh hỏi remote là lệnh
CÓ MẠNG chạy mỗi lần sinh args — thêm trần thời gian để remote treo không treo
luôn bước chuẩn bị.

## Vì sao không chọn cách khác

- *Bọc `try/catch` quanh `die()`*: không được — `die` thoát tiến trình theo
  thiết kế, và nới nó thành «có lúc ném, có lúc thoát» là làm cửa fail-closed
  mất tính chắc.
- *Cho vòng dò gọi `execFileSync` trần*: chạy được, nhưng lại đẻ ra nguồn thứ
  hai cho «cách gọi git» — đúng lớp lỗi hai-bên-trôi vừa đóng ở vòng trước.

## Kiểm

Fixture do code sinh trong chính lần chạy: repo git thật dựng nhánh `master`,
không remote. Cặp hai chiều theo MEASURE-BIRTH: bản lành phải sinh args với mốc
so sánh BẰNG phép tính merge-base độc lập; mutant khôi phục vòng dò cũ (gọi
`git()` trong `try`) phải ĐỎ ghim đúng thông điệp — chứng minh phép đo phân biệt
được hai bản, chứ không xanh vì chưa từng chạy.

## Ngoài phạm vi

- Không đụng nghĩa của `git()` cho các phép đọc bắt buộc khác.
- Không thêm cờ mới cho người dùng; `--diff-base` đã là lối thoát có sẵn.
- Không sửa `baseline-127-tin-hieu-phan-biet` (ô riêng, đã ký, đi vòng sau).
