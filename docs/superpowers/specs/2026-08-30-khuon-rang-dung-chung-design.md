# Design — khuôn răng dùng chung (khuon-rang-dung-chung)

Nguồn: `_acceptance/khuon-rang-dung-chung/opportunity.md` (Cổng Đáng build,
Manh Phan 30/08) — 5 hình dạng tự-dối của bộ răng đo được trong một phiên,
luật dừng-vá bật 3 lần vì đúng lớp này.

## Vấn đề (một câu)

43 bộ răng, 10.160 dòng bash, mỗi hồ sơ tự chế bộ đếm và bộ tiêm — nên cùng
một lớp «phép đo tự dối» tái phát hồ sơ này sang hồ sơ khác, và dặn-bằng-lời
đã chứng minh vô hiệu.

## Lời giải: MỘT thư viện, BA chốt cứng, áp cho bộ răng MỚI

Vật: `scripts/rang-khuon.sh` — thư viện bash mà rang.sh của hồ sơ nạp
(`source`). Đặt ở `scripts/` (không thuộc lõi cưỡng chế `t3_paths`: lỗi ở đây
làm hỏng bộ đo của hồ sơ dùng nó, không làm false-green trên cổng của mọi repo
tiêu thụ — khai tường minh ở contract).

Giao diện (một khối marker `RANG-KHUON-API` để phép đo rút):

- `kr_init <tên-chân>` — bộ đếm chuẩn, thư mục tạm, dọn khi thoát.
- `ok` / `bad` / `done_chan` — MỘT bộ đếm; `bad` là đường duy nhất báo hỏng.
- `kr_git <repo> <args…>` — chốt 3: từ chối đường rỗng / không-repo, tính đỏ.
- `kr_snapshot <dest> <vật-check>` — chép TRỌN cây làm việc (trừ rác nặng);
  bản sao thiếu vật hoặc chép hỏng ⇒ `bad` + return 1 (chốt 2).
- `kr_tiem_batdau <file>` / `kr_tiem_xong <file>` — băm trước/sau: bước tiêm
  KHÔNG đổi file ⇒ `bad` («mutant không tác dụng» hết đường im lặng).
- `kr_vi_phan <log-gốc> <log-tiêm>` — chốt 1, phép VI PHÂN cơ học: so (mã
  thoát + đuôi đầu ra) của CÙNG một lệnh chạy trên bản gốc và bản tiêm; GIỐNG
  NHAU ⇒ `bad` («ca không phân biệt được hai bản»). Caller vẫn tự assert nội
  dung bản tiêm — vi phân chỉ là sàn, không thay thế ghim thông điệp.

Vì sao vi phân là nghiệm đúng tầng (first principles A1): lỗi của vật và thước
tương quan vì cùng một đầu viết; phép so hai-lượt-chạy là kiểm tra CƠ HỌC,
không cần phán xét, nên thoát khỏi trí tưởng tượng chung.

## Chứng minh trên vật thật

Viết lại `_acceptance/nhanh-chinh-khong-ten-main/rang.sh` (bộ răng tươi nhất,
6 chân) theo khuôn: các hàm guard nội bộ của nó (snapshot/gfix) trở thành lời
gọi thư viện, mọi mutant đi qua `kr_tiem_*` + `kr_vi_phan`. Sáu chân phải xanh
như cũ VÀ mutant cũ vẫn bị bắt — «giữ nguyên khả năng bắt lỗi» là quan hệ đo
được, không phải lời hứa.

## Gộp vì rẻ: lỗ mang-kết-quả-sang bỏ qua bộ răng

`s4-args.mjs` khi tính danh sách file đổi cho carry đang loại TRỌN
`_acceptance/**`; sửa theo ĐẢO MẶC ĐỊNH (nếp đã chốt của kit): trong thư mục hồ sơ chỉ LOẠI đuôi
giấy đã biết; mọi đuôi khác — kể cả đuôi chưa biết — được GIỮ, để sửa bộ đo
làm eval chạy lại đúng luật `paths`. Danh sách trắng đuôi thực thi là danh
sách hụt trên không gian mở (`.cjs` là tiền lệ đã có).

## Lưới

Khuôn phải đúng SAU merge (ADR 0011) → lưới thường trực
`tests/scripts/rang-khuon.test.mjs`: mỗi chốt một cụm ca hai chiều, fixture
code-sinh. Răng hồ sơ chỉ giữ ca tích hợp (chạy lại 6 chân của bộ răng đã viết
lại).

## Ngoài phạm vi (từ ô, giữ nguyên)

Không migrate 43 bộ cũ · không đóng 4 hạn chế sản phẩm của s4-args · không sửa
lẻ ~10 mục chất-lượng-phép-đo.
