# Hạt giống — Làn ghim lại giữ trọn lời lỗi, để lại dấu lượt đỏ kèm dòng tự xưng của bàn đo

**Ngày:** 2026-10-02 · **Trạng thái:** ô `_acceptance/lan-ghim-lai-giu-tron-loi-loi/opportunity.md`
(`stage: discovery`, owner gõ «mở ô» 02/10 chiều) · **Hạng dự kiến:** T2 · **CỘNG nhỏ, owner phê ở
Cổng Đáng.**

**Sinh từ:** vòng crm `soan-okr-cung-tro-ly` 02/10 — ký 07:53, 12:40 chưa gộp; ~10 lượt ghim lại, 5
đỏ không dòng sổ; 6 nguyên nhân đỏ, 0 thuộc vật; ≥4 lượt gọi owner sau chữ ký. Bộ nhớ phiên
`lan-ghim-lai-cat-30-dong-mat-loi-loi` giữ diễn biến ba lần cắt gói trong ngày.

## Một đoạn

Làn ghim lại cắt 30 dòng cuối khi lệnh đỏ và không ghi gì khi làn đỏ, nên lời lỗi mất và lượt đỏ
vô hình với mọi sổ. Gói giữ hai món không đổi nghĩa xanh/đỏ: lệnh đỏ ghi trọn đầu ra ra
`.acceptance-runs/<slug>/` và in đường dẫn; làn đỏ để lại một dòng sổ (run_id · lệnh · mã thoát ·
tải máy lúc đỏ). Dòng tải máy là nguyên liệu để chứng minh hay bác «máy dùng chung làm đỏ» — hôm
02/10 chỉ là chỉ dấu (Drive kẹt vòng khởi động lại, tải 6–10/14 lõi, swap gần đầy).

## Đã cắt (ghi để không mở lại như mới)

«Chữ ký là bước cuối» (chỉ dời chuỗi) · «chạy lại rồi đi tiếp có cờ» (chờ số từ dấu lượt đỏ) ·
«dùng chung bộ nhãn với S4» (không người hưởng) · «chạy theo delta / lấy suite từ CI» (hoãn có
ngưỡng) · «luật kho ra bộ kiểm chung» (tật của cách viết thước ở crm/oneflow, không phải luật kit —
đưa vào engine là rò luật kho vào khuôn giao đi, bài học 19/09).

## Phép thử mọi kho

Kho không có sự cố này: không đổi byte nào khi xanh. Hành vi cũ: 30 dòng cuối vẫn in. Chỗ phải đo
trước khi hứa: dòng sổ đỏ ghi vào `run-log.jsonl` dưới `kind` mới mà bộ đọc 2.20.0 bỏ qua/cờ vàng
(giả định 1 của ô) — không đạt thì ghi ra `.acceptance-runs/` và khai giới hạn «git không thấy».

## Thước năm dòng (dự báo)

làm-xong→quyết-được ↓ (≈20 phút mỗi lần đỏ) · lượt gọi người/vòng ↓ (phần sau chữ ký) · vòng bị hạ
tầng đốt = nhưng đo được · token = · phút máy/lượt chấm ↓ (không chạy lại toàn kho để xem lỗi).
