# Hạt giống — dòng hiệu chuẩn tự xưng «ĐẠT đã ký» mà đếm cả hồ sơ chưa từng ĐẠT

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Nguồn:** phiên tổng kết cửa sổ 2.18 (`docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md` §4, câu 4)
Gốc: crm/_acceptance/nhan-ung-dung-noi-tieng-viet — bằng chứng `BLOCKED`, không chữ ký người; dòng `thuc-te` `d-20260921T142711Z-21` khai sẵn «còn một chỗ đỏ đã biết: đoạn giới thiệu tiếng Anh thiếu lang»; hồ sơ vẫn vào N của dòng hiệu chuẩn và k không thấy chỗ đỏ ấy.
Gốc: _acceptance/release-2-18-1 — dòng hiệu chuẩn `ĐẠT đã ký → prod đỏ: 0 / 8` đọc bằng `scripts/hieu-chuan-moc.mjs`; kit `release-2-0-0` (PASS, `human_signoff` rỗng) là một trong tám.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

`hieu-chuan-moc.mjs` đếm N = mọi hồ sơ có dòng `type: thuc-te` hợp lệ, không hỏi hồ sơ ấy từng có
bằng chứng ĐẠT được ký hay chưa. Tách tám hồ sơ của mốc 2.18.1 theo bằng chứng:

| Nhóm | Số | Hồ sơ |
|---|---|---|
| ĐẠT, có chữ ký người | 3 | crm `dieu-phoi-30-ngay-dau`, `quan-ly-danh-muc-30-ngay`, `khai-lang-gioi-thieu` |
| ĐẠT, máy thông (làn V) | 1 | crm `loi-vao-dieu-phoi-30-ngay` |
| chưa từng ĐẠT-ký | 4 | crm `cua-vao-noi-tieng-viet` (báo cáo đã xếp lại), `tieng-viet-cho-crm` (xếp lại), `nhan-ung-dung-noi-tieng-viet` (BLOCKED); kit `release-2-0-0` (PASS, không chữ ký) |

Hai hệ quả. Tên dòng nói «ĐẠT đã ký» trong khi nửa mẫu số là hồ sơ reality đóng thay chữ ký —
đúng việc ADR 0020 cho phép, nhưng không phải thứ dòng này tự xưng đo. Và k chỉ đọc dòng
`revisit` mở đầu «prod đỏ — » đứng SAU dòng quan sát, nên chỗ đỏ khai ngay TRONG dòng quan sát
không bao giờ vào k.

## Dạng nghiệm đúng tầng (dòng tự xưng của hạ tầng)

1. **Tách hai mẫu số trên cùng một dòng**, rút từ bằng chứng chứ không từ lời:
   `ĐẠT đã ký → prod đỏ: k / N_đạt · reality đóng không qua ĐẠT: N_khác`. Vị từ ĐẠT-đã-ký là
   `verdict: PASS` + `human_signoff` không rỗng HOẶC `status: machine-cleared` — cùng vị từ lưới
   trước-merge đang dùng, không viết vị từ thứ hai.
2. **Chỗ đỏ khai trong dòng quan sát tính là k.** Dòng `thuc-te` có trường `do_da_biet` (hoặc
   `decision` chứa «đỏ đã biết») → hồ sơ vào k ngay. Chiều đỏ: hồ sơ fixture có dòng quan sát khai
   đỏ → k = 1; chiều im: dòng quan sát sạch → k = 0.

Loại: TRỪ (sửa lời tự xưng) + vá điểm. Ngưỡng mở ô: dòng hiệu chuẩn được đọc ở hồ sơ mốc kế mà
N_đạt < N — tức là ngay mốc sau, nếu không sửa.
