---
slug: bo-doc-ho-so-khoan-dung
at: 2026-10-13T13:35:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Phản biện context sạch — bo-doc-ho-so-khoan-dung

Một tác tử tươi, đọc đúng năm đầu vào (design, contract, evals, sổ quyết định, bài học xuyên feature của claim-scan).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Số tệp crm tự mâu thuẫn: design ghi bốn, Out of scope + sổ + AC-8 ghi ba | crm sửa ba tệp có tên, tệp thứ tư vẫn làm Bun.YAML vấp; E8 đạt vì câu «ba» có mặt | Một con số ở mọi chỗ; răng in tên từng hồ sơ bị từ chối; E8 bỏ con số cứng | fixed: design §2 + Out of scope nêu đủ bốn hồ sơ (tệp thứ tư danh-sach-keo-chung ngoài #375); E2 in dòng yaml-tu-choi theo hồ sơ; AC-8/E8 điều (7) thành «chạy lệnh kiểm không --base» |
| P1 | evals | E2 so ở mức tệp trong khi lời hứa là dòng + lớp; mutant bỏ lớp có thể tương đương trên tệp nhiều lớp | Bộ dò cắm cờ sai dòng mà E2 vẫn xanh; mutant bỏ lớp không đỏ vì tệp còn lớp khác | So dòng problem_mark của PyYAML; mutant dời dòng; mutant bỏ lớp so ở mức (tệp, dòng lỗi đầu) | fixed: AC-2/E2 đòi mục ở đúng dòng lỗi đầu (dung sai 0), mutant so (tệp, dòng lỗi đầu), thêm mutant dời dòng +3 ghim «vi phân dòng» |
| P1 | contract | --base không nói so từ điểm rẽ hay hai chấm; ca chỉ dựng lịch sử thẳng | Nhánh chính đi trước chạm hồ sơ cũ, CI chặn một PR không chạm nó [dieu-phoi-on-dinh-r2#F1] | Ghi merge-base vào AC-4; ca nhánh rẽ + bản sao hai chấm đỏ | fixed: AC-4 + design §4 ghi so từ merge-base; ca YC-4-re với chiều đỏ hai chấm ghim «hồ sơ ngoài nhánh chặn: A» |
| P2 | evals | E7 chỉ chốt rỗng ở mức tổng, chưa nói cách gọi bốn mặt | Một mặt so 0 hồ sơ mà E7 vẫn xanh nhờ ba mặt kia | Đếm theo kho × mặt, mặt tổng 0 đỏ; đọc thêm in theo mặt | fixed: AC-7/E7 gọi bốn mặt qua lối vào công khai, in so=<n> theo kho × mặt, mặt tổng 0 → «vi phân rỗng: <mặt>», đọc thêm in đủ bốn mặt |
| P2 | evals | Fixture ma trận E1 không được thước chuẩn đọc — vật và thước cùng một trí tưởng tượng | Bản «lành» thật ra vẫn sai YAML, bộ dò im, YC-1 xanh | PyYAML đọc 19 ô ma trận rút từ chính hàm sinh của ca | fixed: module sinh ma trận dùng chung tests/scripts/yaml-chuan-ma-tran.mjs; E2 in «ma-tran-pyyaml: 19/19 khop», lệch đỏ ghim tên ô |

Ghi chú ngoài cap — mẫu số «661/662» ở dòng sổ thứ năm sai (662 là số tệp evals.yaml): fixed bằng dòng sổ `supersedes` với số đếm thật 654/655 chữ ký.
