# Corpus khuôn dòng criterion — nguồn sự thật cho P58/P59/P60/P61

Contract của chính kit chỉ dùng 2/5 khuôn (đo 2026-07-30: 88 dòng `- AC-n:` +
13 dòng `- **AC-n**`), nên chạy eval bao-tập trên `_acceptance/` là gần như rỗng
nghĩa — nó không đụng được đúng những khuôn đã gây ra lỗi. Corpus này giữ **cả
năm khuôn thật** rút từ 178 contract của hai repo, cộng các dòng KHÔNG-phải-
criterion để canh false-positive.

Khuôn mỗi ca: một dòng `CASE <tên> | <id mong đợi hoặc "-"> | <judgment: y/n hoặc "-"> | <gwt mong đợi>`
rồi dòng `INPUT ` + nguyên văn dòng cần bóc. `-` ở cột id nghĩa là dòng này
KHÔNG được ra criterion nào.

CASE template | AC-1 | n | Given kho rỗng, When chạy, Then trả rỗng.
INPUT - AC-1: Given kho rỗng, When chạy, Then trả rỗng.

CASE bold-nhãn-colon-trong-bold | AC-2 | n | (biên dịch) build + typecheck xanh.
INPUT - **AC-2 (biên dịch):** build + typecheck xanh.

CASE bold-dong-truoc-nhan | AC-3 | y | Schema claim đủ làm nền tầng.
INPUT - **AC-3** (judgment) Schema claim đủ làm nền tầng.

CASE ngoac-nhan-chen-giua | AC-4 | n | (F1) Given thread spanDays 0, Then chữ span là "trong ngày".
INPUT - AC-4 (F1): Given thread spanDays 0, Then chữ span là "trong ngày".

CASE cham-thay-colon | AC-5 | n | Given mapposter trả 200 kèm PNG phẳng, Then chặn.
INPUT - **AC-5.** Given mapposter trả 200 kèm PNG phẳng, Then chặn.

CASE nhan-mang-chu-judgment | AC-6 | y | (chi phí có trần — judgment) Given cron chạy nền, Then LLM đi qua providers.
INPUT - AC-6 (chi phí có trần — judgment): Given cron chạy nền, Then LLM đi qua providers.

CASE than-ban-ve-judgment-khong-mang-dau | AC-7 | n | Given người duyệt cần judgment riêng, Then vẫn đo được bằng máy.
INPUT - AC-7: Given người duyệt cần judgment riêng, Then vẫn đo được bằng máy.

CASE dau-nam-trong-code-span-la-trich-dan | AC-8 | n | Given contract mang dấu `(judgment)` trong ngoặc kép, Then không tính là dấu.
INPUT - AC-8: Given contract mang dấu `(judgment)` trong ngoặc kép, Then không tính là dấu.

CASE dau-cuoi-dong-theo-template | AC-9 | y | Given việc cần người phán, Then người phán.
INPUT - AC-9: Given việc cần người phán, Then người phán. (judgment)

CASE tieu-de-in-dam-khong-gach-dau-dong | AC-10 | n | — Strip hiện đúng cấu trúc free-compose
INPUT - **AC-10** — Strip hiện đúng cấu trúc free-compose

CASE khong-phai-criterion-id-tran-khong-co-than | - | - | -
INPUT - **AC-11**

CASE khong-phai-criterion-dong-coverage | - | - | -
INPUT - **Đ — đường đo** (CE: ngưỡng DP-1 đã chốt): AC-6, AC-11

CASE khong-phai-criterion-van-xuoi-nhac-id | - | - | -
INPUT - Đèn cảnh báo "bỏ sót" nói ở trên (L18, xem AC-13) mới được bật.

CASE khong-phai-criterion-in-dam-tham-chieu-cheo | - | - | -
INPUT **AC-5, AC-9, AC-10 chưa có gì** — AC-5 cần code mới.
