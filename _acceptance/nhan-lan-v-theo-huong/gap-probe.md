---
slug: nhan-lan-v-theo-huong
at: 2026-10-04T13:05:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap probe: nhan-lan-v-theo-huong

Phản biện context sạch (một tác tử tươi, đọc đúng design doc + contract + evals + sổ + bài học
claim-scan). Sửa artifact một lượt, không chạy lại phản biện.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract+evals (AC-5/E5) | Lời hứa là QUAN HỆ chữ-gõ→hành-vi mà E5 chỉ đo chuỗi có mặt; không ca nào đo dạng thẻ mời gõ (ô điền sẵn sửa thành «đi tiếp hay kéo lại: kéo lại: X», hay dán nguyên one_shot) | Thân lệnh chỉ dạy dạng trần «kéo lại:», phiên nhận «đi tiếp hay kéo lại: kéo lại: lỗi X» không khớp dạng nào nên không ghi gì — cú kéo lại mất im lặng | Ma trận viết trước dạng-gõ→hành-vi trong khối marker, ca rút từ marker, số assert = số hàng, rút rỗng đỏ, mutant đổi hành vi một hàng | fixed: AC-5/E5 viết lại — khối mới `GATE-ONESHOT-LAN-V` sáu dạng bắt buộc, signoff trỏ tên khối, mutant đổi hành vi dòng «để yên» + gỡ marker |
| P1 | contract (Coverage trục A) + design §3 | Trục A thiếu trạng thái đã kéo lại (`da-veto`); vế đã khép chỉ đo `nghi`, bỏ sót khép bằng thực tế | Hồ sơ đã veto vẫn báo «đi tiếp»; bộ lọc chỉ xét NGHI vẫn qua E4 trong khi hồ sơ khép bằng thực tế báo một lối ra không còn | Hai hàng thêm, mỗi hàng ca do code sinh; mutant lọc-chỉ-khi-nghi đỏ ở hàng thực tế | fixed: AC-4/E4 thành ma trận ba hàng (nghỉ · thực tế · da-veto) kèm kiểm tiền đề «thẻ khép thật»; thêm mutant `loc-chi-nghi` |
| P1 | contract+evals (AC-3/E3) + design §4 | Chiều im hứa cho mọi kho nhưng chỉ đo một fixture; không nói hồ sơ thật nào đang ở làn V chưa khép (LM20 có thể đỏ hoặc baseline bị ghi tay) | Hồ sơ làn V thật đổi routing làm LM20 đỏ đốt một lượt chấm, hoặc lần ghi lại baseline che một thay đổi lạc | Dựng thẻ mọi hồ sơ thật bằng bản trước/sau; tập được đổi = đúng tập có nhãn cũ ở hoi, đổi đúng phép biến đổi; còn lại bằng nhau từng byte | fixed: AC-3/E3 quét trọn `_acceptance/` thật, hai vế (bằng nhau từng byte · đúng ba chỗ biến đổi), in tập vế hai và hồ sơ bản cũ không dựng được |
| P1 | contract+evals (AC-2/E2) | Kỳ vọng hoi = [Ngoài-1, Ngoài-2] viết cho fixture mà design không mô tả; có thể là tưởng tượng [ha-tang-khong-dot-luot#F1] | Thẻ thật đưa mục đã định đoạt vào bao → E2 đỏ bất kể vật; hoặc fixture bị bóp cho khớp | Chạy --extract của cây hiện tại trên đúng fixture, ghi kết quả thật; fixture do writer thật sinh | fixed: đo trước Gate 1 trên cây hiện tại (mục ngoài hợp đồng do khuôn OOC-ITEM-TEMPLATE của bên viết sinh, sổ gate2 định đoạt cả hai) → hoi = [Ngoài-1, Ngoài-2, veto hay để yên], bao = [cắt/hoãn, Treo]; kỳ vọng sau vòng = đúng một thay đổi (nhãn sang bao) |
| P2 | evals (E3) + design §4 | Bản nền neo vào cha commit đầu đưa chuỗi mới, không vào merge-base | Commit sớm hơn trong nhánh sửa gate-card nằm trong bản nền, thay đổi lạc của nó không thấy | Neo bản nền vào merge-base với origin/main | rejected: sau khi gộp, merge-base với main bằng chính HEAD — bản nền trùng bản sau, phép so tự xanh rỗng mãi mãi và đối chứng đặc hiệu đỏ oan; neo vào cặp commit ĐẦU/CUỐI của vòng (dấu slug trong thông điệp) bất biến sau 50 commit; commit đầu chạm gate-card của nhánh là commit của vòng |
