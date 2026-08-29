# Lệnh suite phải để lại dấu vết — thiết kế

**Ngày:** 2026-08-29 · **Slug:** `suite-run-log-provenance` · **Hạng:** T2

## Vấn đề

Mỗi vòng nghiệm thu chạy hai loại lệnh máy: lệnh của từng tiêu chí (eval) và
lệnh canh hồi quy chung của kho (suite). Sổ chạy — vật duy nhất chứng minh
"bản chấm này do một lượt chạy có thật sinh ra" — chỉ ghi loại thứ nhất.

Hệ quả xếp theo thứ tự người gặp:

1. Bản chấm vẫn phải khai kết quả lệnh suite, mà sổ không có mã lượt chạy nào
   cho chúng → máy soạn bản chấm **buộc phải tự đặt mã**, đúng thứ câu dặn ngay
   trên nó cấm.
2. Bộ kiểm đối chiếu đòi **mọi** mã trong bản chấm phải có trong sổ → vòng nào
   có lệnh suite không gắn tiêu chí đều đỏ.
3. Nó **ẩn tới phút cuối**: cổng trước khi gộp thấy chữ ký còn trống thì dừng
   sớm, chưa chạy tới khối đối chiếu. Mọi thứ trông sạch — rồi vi phạm nổ đúng
   lúc vừa ký xong, tức lúc đắt nhất.

Đo thật ở kho tiêu thụ `media-library`, vòng 11: hai mã `SUITE-smoke` và
`SUITE-itest_ci` không có trong sổ.

**Vì sao kho này không tự bắt được:** cấu hình của chính kit khai lệnh suite
trùng đúng lệnh của các eval, nên chúng luôn đi nhánh eval và luôn có dòng sổ.
Lỗi chỉ cắn ở kho mà lệnh suite **không gắn tiêu chí nào** — tức mọi kho tiêu
thụ bình thường. Lưới hiện tại mù đúng chỗ đó.

## Hai đường sai, chọn đường nào

- **Đường A — bản chấm thôi khai lệnh suite.** Rẻ nhất, nhưng mất hẳn bằng
  chứng "lượt này có chạy canh hồi quy" — đúng thứ người đọc ở cổng cần.
- **Đường B (chọn) — lệnh suite sinh dòng sổ như mọi lệnh khác.** Mã đúc từ
  chính lệnh, nối vào đúng câu dặn đã có, không thêm bản luật cạnh tranh.

## Tên phải suy từ lệnh, và phải phân biệt

Tên suy từ **chính chuỗi lệnh**, không theo chỉ số mảng: đổi thứ tự khai mà mã
đổi theo thì đối chiếu vòng sau lệch.

Nhưng "suy từ lệnh" chưa đủ. Bản rút gọn hiện tại bỏ tiền tố `cd <thư mục> &&`
rồi lấy tên script, nên trong kho nhiều gói **hai lệnh khác nhau rút về cùng
một tên**: `cd apps/web && pnpm build` và `cd apps/api && pnpm build` đều thành
`build`. Hai dòng sổ mang **cùng một mã** cho hai lệnh khác nhau — bộ kiểm vẫn
xanh (mã có trong sổ), nhưng mã không còn trỏ được về đúng lượt chạy nào. Nếu
một lệnh đỏ một lệnh xanh, bản chấm có thể trích đúng cái xanh và giấu cái đỏ.
Đó là cùng lớp false-green với lỗi gốc, nên đóng cùng lượt: **mã phải phân biệt
được trong một vòng**.

## Phạm vi

Trong: sinh dòng sổ cho lệnh suite · đúc mã ổn định, phân biệt · nối bản đồ mã
vào câu dặn sẵn có · giữ nguyên hình dạng dòng của eval.

Ngoài: **không** sửa thứ tự kiểm ở cổng trước khi gộp (chỗ làm lỗi ẩn tới sau
chữ ký). Đó là lớp khác — thứ tự cổng — và nó chạm lõi cưỡng chế, tức hạng T3
với vòng duyệt riêng. Ghi vào sổ quyết định, không kéo vào đây.

## Cách đo

Lưới thường trực: `tests/workflows/acceptance-verify.test.mjs` (fixture do
code dựng mỗi lần chạy). Răng hồ sơ `_acceptance/<slug>/rang.sh` ghim đúng dòng
ca trong kết quả và giữ chiều đỏ: gỡ vá trong một bản sao thì suite phải đỏ với
thông điệp ghim, bản nguyên vẹn phải xanh trước đã.
