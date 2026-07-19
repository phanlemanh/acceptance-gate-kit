# Preset: Risk / Pre-mortem

Dùng trước launch hoặc quyết định lớn. Câu hỏi khung: *"6 tháng sau thứ này chết — vì sao?"*

## Trục

1. **Thành phần** — theo kiến trúc thật: từng service/module, dữ liệu, tích hợp bên thứ 3, con người/vận hành, pháp lý.
2. **Kiểu hỏng (failure mode)** — sai (cho kết quả sai) | chết (không chạy) | chậm | rò (bảo mật/dữ liệu) | bị lạm dụng (abuse/fraud) | không ai dùng (adoption fail).
3. **Hậu quả rơi vào** — người dùng cuối, doanh thu, pháp lý, uy tín, vận hành nội bộ.

## Chấm điểm (FMEA rút gọn)

Mỗi ô có nghĩa: **Likelihood (1–3) × Impact (1–3) × Khó-phát-hiện (1–3)**. Khó-phát-hiện là hệ số hay bị bỏ quên nhất — risk âm thầm nguy hiểm hơn risk ồn ào cùng điểm.

## Pareto

Chỉ viết mitigation cho top ~5 điểm cao nhất; còn lại vào watch-list 1 dòng kèm ngưỡng kích hoạt xem lại.

## Thước CE

Incident/bug history của hệ thống tương tự + phỏng vấn người vận hành trực tiếp — họ giữ danh sách failure mode thật mà tài liệu không có.
