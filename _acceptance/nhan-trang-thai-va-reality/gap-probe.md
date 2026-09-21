---
slug: nhan-trang-thai-va-reality
at: 2026-09-21T05:45:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

# Gap probe — nhan-trang-thai-va-reality

Một tác tử tươi đọc design + contract + evals + sổ + bài học (claim-scan) + opportunity; không
đọc mã. Sửa artifact một lượt, không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Bên VIẾT dòng revisit (lệnh signoff) không AC nào phủ; ca tự dựng tiền tố decision đúng khuôn bên đọc [do-tin-tram-phan-loai#F2] | signoff ghi sai khuôn, E5 E8 vẫn xanh; ở crm ký trên cạnh gãy rồi pre-merge báo thiếu revisit cho mọi eval | Khuôn dòng revisit ở khối marker trong signoff.md; ca rút khuôn đưa vào hai bên đọc; mutant đổi tiền tố thì cả hai đỏ | fixed: AC-8 thêm khối marker CANH-GAY-REVISIT-LINE + round-trip + mutant (E8 NL-AC8-mot-nguon b) |
| P1 | evals | Lệnh observed là prompt; ca kiểm chuỗi có mặt trong chính tệp là hằng đúng; seam dòng thuc-te → thucTe không round-trip | observed dặn sai tên vế, E9 E10 E11 xanh; chạy thật ở crm thì dòng bị báo dong-so-thieu, PR 65 vẫn chặn | Khuôn dòng thuc-te ở khối marker; ca rút khuôn đưa vào thucTe và pre-merge; mutant đổi tên vế thì đỏ | fixed: AC-11 khối marker THUC-TE-LINE + round-trip; bỏ vế chuỗi có mặt; khai giới hạn prompt ở Notes |
| P1 | contract | AC-10 chỉ đo pre-merge, recheck-all với status mới không được đo | recheck-all vẫn giữ luật verdict khác PASS, CI crm đỏ trên hồ sơ vừa đóng | Ma trận hai bên đọc × bốn ca + ca một nguồn | fixed: AC-10 và E10 thành 8 assert hai bên + ca thucTe luôn null |
| P1 | evals | Chuỗi hai dòng round-tally cùng round dựng tay; classifier nằm trong nhãn hệ thống chết mà không AC phủ [do-tin-tram-phan-loai#F2] | engine thử lại bằng round mới thì thẻ khoá mãi; ca Dừng nó rơi vào không phân loại | Chạy writer tallyLine thật hai lần; một ô classifier hoặc khai phạm vi hẹp | fixed: E7 dùng tallyLine thật + đối chứng round 2; classifier khai phạm vi hẹp ở AC-7 và Notes (SKILL chạy lại BLOCKED ở cùng round) |
| P1 | contract | Design cắt 12 dòng, hợp đồng đòi nguyên văn mọi dòng | thân dài hơn 12 dòng thì làm đúng design là E12 đỏ | Chốt một nghĩa; ma trận hai ca ≤12 và 13 dòng | fixed: AC-12 giữ cắt 12 dòng; E12 thêm NC-AC12-dai |
