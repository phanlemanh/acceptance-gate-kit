---
slug: moi-noi-vong-trao
at: 2026-08-17T03:09:56Z
verdict: findings
p0: 0
p1: 2
p2: 3
claims_input: ok
---

# Phản biện context sạch — moi-noi-vong-trao

Critic fresh (Agent, 5 input: design + contract + evals + ledger + claims). One-pass, định đoạt tại chỗ.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E3 đo chuỗi-có-mặt (§0 nhắc chan, tập khoá khuôn ⊇ danh sách chép tay) trong khi AC-3 hứa QUAN HỆ mọi khoá §0 đọc đều có trong khuôn; chiều đỏ chỉ tiêm khuôn | §0 đọc thêm khoá blocked hoặc gõ nhầm chuyen_phien → E3 xanh; phiên thật đọc khoá không tồn tại → cờ vàng oan trên nhật-ký hợp lệ | rút ĐỌC bằng máy từ §0–§1, assert ĐỌC ⊆ KHUÔN; mutant hai phía | fixed: AC-3 + E3 viết lại theo quan hệ hai phía, chiều đỏ ở cả khuôn lẫn SKILL |
| P1 | design | chan 0 coi là thoả bằng bằng chứng mà không đòi nhật-ký thuộc VÒNG NÀY (slug, ran_at có trong khuôn nhưng §0 chỉ đọc chan) | nhật-ký chép từ workspace khác hoặc lái trên build trước lần chấm cuối → phiên nói thoả → người dự ngồi trên build chưa ai bấm | AC-4 thêm vế slug khớp + ran_at không cũ hơn verified_at; E4 thêm ca 5–6; E4b needle | fixed: AC-4 + design 3.2 + ca-E4/dap-an-E4 lên 6 ca + E3 đòi ĐỌC ⊇ {chan, slug, ran_at} |
| P2 | evals | ma trận E1/E2 chưa viết trước toàn phần (4 trạng thái × 2 mặt); rỗng và thiếu gộp một; extract chưa định nghĩa; chỉ 2 mutant | section có heading nhưng rỗng: HTML cờ vàng đúng mà extract lệch → bên đọc extract suy sai; mutant rỗng-vẫn-in-khối lọt | bảng 4×2 mỗi ô một assert có tên; extract khai rõ; mutant m3; lines tính từ fixture | fixed: AC-2 khai extract cho rỗng/thiếu; E1/E2 thành ma trận 8 ô + m3 |
| P2 | contract | AC-4 nhánh chan > 0 là DỪNG một lối ra, không chỉ đường quay lại | vấp CHẶN đã sửa nhưng nhật-ký chưa chạy lại → phiên đã mời người bị chặn cứng, phút cháy | AC-4 thêm câu chỉ đường; đáp án ca 2 đòi; E4b needle | fixed: AC-4 + dap-an-E4 ca 2 + E4b |
| P2 | contract | AC-7 dấu ĐỀ XUẤT sống cho tới khi merge — không nói merge của gì, không ai sở hữu việc gỡ | sau merge PR này gỡ dấu thì hình đi trước chữ; giữ vô hạn thì hình nói đề xuất về thứ đã hết là đề xuất | colophon nêu điều kiện gỡ; E7 needle cho tới khi | fixed: AC-7 + design 3.6 + E7 |
