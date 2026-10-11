# Hạt giống — script đếm dùng lại gắn nhãn đúng cho lượt lệch dừng sớm

**Ngày:** 2026-10-11 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2.
Gốc: _acceptance/eval-goi-model-that-khong-chay/ — Cổng Bằng chứng lượt 3, Ngoài-1 và Ngoài-2 (owner chọn «mở hợp đồng mới», ký 11/10).

## Vấn đề

Từ lượt 3 của hồ sơ trên, dòng `repin-do` của lượt ghim lại dừng sớm (vượt trần · bị ngắt) mang
`carry_lech` + `evals_hash` nhưng KHÔNG mang `evals_exit`. `feature-loop/scripts/dem-dung-lai-model.mjs`
tìm lượt nguồn bằng phép so mã thoát, nên mọi lượt lệch kết thúc bằng dừng sớm in nhãn «không thấy nguồn»
thay vì «nghi thiếu đầu vào: <tệp>» — mà ngưỡng CHẾT của ô cơ hội đọc đúng nhãn thứ hai.

## Hướng (chưa chốt)

Ghi mã thoát của các eval đã xong vào dòng dừng sớm, hoặc khi dòng lệch không có `evals_exit` thì lấy lượt
chạy thật cùng băm gần nhất làm nguồn. Ca kiểm phải chạy script đếm trên dòng dừng sớm do làn THẬT ghi.

## Ngưỡng mở (đang đếm: 0)

≥ 1 dòng «không thấy nguồn» ở run-log crm sau khi crm bật `model_carry_cmd` — đếm bằng
`dem-dung-lai-model.mjs --root <crm>`. Trước ngưỡng: người đọc số ở crm xem tay các dòng ấy.
