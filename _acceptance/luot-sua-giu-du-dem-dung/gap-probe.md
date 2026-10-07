---
slug: luot-sua-giu-du-dem-dung
at: 2026-10-07T02:58:52Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap probe — luot-sua-giu-du-dem-dung

Phản biện context sạch (một tác tử tươi, chỉ đọc design + contract + evals + sổ + claims). Định đoạt từng mục trong cột Xử lý; không probe lại (one-pass).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design, contract | Luật chống in trùng «tiêu đề chứa title» không có ca khớp nhầm | Mục tươi khác tệp có tiêu đề chứa title carry → mục carry bị coi là đã in và rụng im lặng | Ca phủ định + khoá (title, file) + mutant chỉ-chứa-title | fixed: AC-3/E3 thêm ca khác file, khoá chống trùng là cặp title + file, mutant ghim «mục carry bị nuốt bởi mục tươi trùng tên» |
| P1 | design, contract | Chuỗi carry ba lượt của khung ui-check không có round-trip bên viết → bên đọc | Lượt 2 chèn observed khác định dạng, lượt 3 s4-args không đọc lại được, thẻ lại báo không có bằng chứng | Ghi result.report của AC-5 làm evidence-report, s4-args lượt kế, so từng byte | fixed: AC-5/E5 thêm round-trip ba lượt |
| P1 | contract | Dòng (e) của AC-1 viết tay; không chứng workflow thật ghi dòng sổ cho mục carry | Bước chèn chỉ sửa markdown, sổ lượt 2 thiếu mục carry → lượt 3 rụng | Dòng sổ do workflow phát → carry-plan lượt kế | fixed: AC-3/E3 thêm round-trip sổ + mutant «mục carry rụng ở lượt kế» |
| P1 | contract, evals | Hợp đồng neo base là merge-base, evals neo 7b1afe1e; AC-10 thiếu đối chứng dương | Sau khi gộp merge-base = HEAD, chiều đỏ lịch sử tự chết mà vẫn xanh | Một mốc bất biến + ≥1 câu rút được | fixed: AC-1, AC-6, AC-8, AC-9, AC-10 neo 7b1afe1e; AC-10/E10 đòi rút được ≥ 1 câu và in nguyên văn |
| P2 | contract | Coverage ghi --write thuộc AC-6 mà When chỉ chạy --json | Bộ lọc chỉ nối vào nhánh JSON, --write vẫn ghi số phồng | Vế --write đọc lại dòng sổ | fixed: AC-6/E6 chạy cả --json và --write |
