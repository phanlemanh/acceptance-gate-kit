---
slug: ghim-lai-noi-ra-o-khong-do
at: 2026-09-20T02:35:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

# Phản biện context sạch — ghim-lai-noi-ra-o-khong-do

Critic: 1 subagent tươi, 5 input (design · contract · evals · decisions · claims advisory).
One-pass: mọi finding đã sửa thẳng vào artifact, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Vị từ «AC không có chốt máy» (∀ eval phủ AC đều không phải eval máy đáng ghim) không ghim bằng ma trận viết-trước: AC-1 không khai `criterion` của các ô fixture, AC-2 để danh sách AC làm chỗ trống, AC-7 chỉ so hai bản gộp làn↔thẻ với nhau, thiếu hai ô: AC vừa có test vừa có ui-check (CÓ chốt — chính lối W8 khuyên) và AC chỉ có script not-run (KHÔNG chốt) | Mutant gộp bằng ∃ thay ∀, hoặc đếm script not-run là chốt: làn và thẻ cùng sai nên round-trip xanh; thẻ ở crm nói AC đã có test là «không chốt» | Fixture khai 4 AC theo ma trận {chỉ máy · chỉ not-run · chỉ ngoài máy · ngoài máy + máy}; danh sách kỳ vọng VIẾT TRƯỚC = [AC-b, AC-c]; so đẳng thức ở section, thẻ gate 2, thẻ gate 1; hai mutant (∃ · not-run tính là chốt) mỗi cái ĐỎ ghim | fixed: AC-1/2/7/8 + E1/E3/E9/E10 khai ma trận 4 AC (AC-a{E1 test} · AC-b{E2 script not-run} · AC-c{E6 ui-check, E7 ui-check not-run} · AC-d{E12 judgment, E13 test}), kỳ vọng viết trước [AC-b, AC-c], mutant «got AC bang ton tai» + «not-run tinh la chot» |
| P1 | contract | Phân hoạch của AC-1 chỉ phủ 3/4 ô (kiểu × not-run): thiếu eval ngoài làn máy KHAI `status: not-run`; design không nói ô ấy thuộc mảng nào | crm có hồ sơ 7/12 ui-check; một ui-check not-run rơi vào cả hai mảng (pin nói một ô hai lần) hoặc không mảng nào (pin lại im) — GN01 vẫn xanh vì fixture không có ô ấy | Thêm ô thứ năm (E7 ui-check `status: not-run`); design ghi rõ KIỂU thắng TRẠNG THÁI: ô ngoài làn máy chỉ vào `evals_not_machine`; GN01 assert mỗi id xuất hiện ĐÚNG MỘT lần; mutant bỏ điều kiện kiểu trong bộ lọc not-run → ĐỎ ghim «id xuat hien hai mang» | fixed: design §3 A + AC-1 + E1 (E7 ui-check not-run; luật kiểu-thắng-trạng-thái; mutant «id xuat hien hai mang») |
| P1 | evals | E6/AC-4 ghim mốc diff «pin cũ → HEAD» nhưng kịch bản chỉ commit ĐÚNG MỘT lần sau pin nên `HEAD~1` trùng pin cũ; số đo crm (khoảng 3: 332 tệp) là nhiều commit giữa hai lần ghim | Mutant đọc `git diff HEAD~1`: GN06 xanh cả hai chiều; ở crm tệp UI đổi ở commit giữa khoảng ghim không vào khoá, ngưỡng GUIDE §7.1 đếm thiếu | Sau pin: commit 1 đổi `apps/x/a.ts`, commit 2 đổi tệp không khớp glob, chạy làn MỘT lần → `touched = ["E6"]`; mutant mốc HEAD~1 → ĐỎ ghim «moc diff khong phai pin cu» | fixed: AC-4 + E6 (hai commit sau pin, mutant HEAD~1) |
| P1 | contract | AC-7 định nghĩa cờ `fwarn` từ «dòng repin CHỐNG LƯNG `verified_commit`» nhưng không có ca đặc hiệu (repin cũ có touched + pin hiện tại sạch → không cờ); E9 nói «hồ sơ AC-4 đã ghim» mà chuỗi AC-4 kết thúc bằng lượt ghim KHÔNG có khoá touched — fixture mâu thuẫn kỳ vọng | Mutant quét chuỗi `"evals_not_machine_touched"` ở bất kỳ dòng nào: hồ sơ đã chứng lại qua S4 delta rồi ghim sạch vẫn mang cờ vàng vĩnh viễn; hoặc GN09 đỏ oan vì trạng thái fixture | GN09 khai trạng thái = sau lượt ghim 1 của AC-4; ca đặc hiệu: repin#1 (touched) + repin#2 (sạch), `verified_commit` = pin#2 → không fwarn, `chot_may.touched = []`; mutant đọc dòng đầu có khoá thay vì dòng khớp sha → ĐỎ ghim «fwarn tu dong repin khong chong lung» | fixed: AC-7 + E9 (trạng thái fixture rõ, ca đặc hiệu hai lượt ghim, mutant) |
| P2 | evals | E3 chiều im «so byte với bản đối chứng» không nói đối chứng là gì; design §5 chỉ archive `lib scripts` (bên đọc), không archive writer cũ — nếu đối chứng là chính làn mới thì phép so là tautology; cùng lớp [lan-doc-status-not-run#F2] | Làn mới đổi khuôn section trên hồ sơ toàn máy mà không ca nào đỏ; «chiều im» của AC-2 chưa từng đo thật | Đối chứng = writer `2826f807` (`git archive 2826f807 feature-loop lib scripts`, trọn thư mục) chạy trên cùng hồ sơ toàn máy trong cùng kho tạm; so byte section sau chuẩn hoá, ĐỎ ghim «section troi so voi lan 2.17.0»; đối chứng dương: hồ sơ bốn ô PHẢI khác đúng ở hai hậu tố | fixed: AC-2 + E3 + design §5 (đối chứng là writer 2.17.0 trọn thư mục) |
