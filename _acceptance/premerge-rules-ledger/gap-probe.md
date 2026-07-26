---
slug: premerge-rules-ledger
at: 2026-07-26T20:30:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Phản biện context sạch — premerge-rules-ledger

Critic đọc đúng 4 file (design · contract · evals · ledger), cấm đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | AC-3 và Notes MÂU THUẪN trực diện về biểu diễn `gap_probe: off`: AC-3 nói declared-off, Notes nói loại-khỏi-expected rồi bảo "chọn một trong hai" — contract vừa đã-chọn vừa chưa-chọn | Implementer theo Notes → RL3b đỏ; hoặc chọn LAI (cờ→declared-off, config→loại-expected) → hai nửa script hai ngữ nghĩa, `m` đếm sai — đúng cái bẫy Notes tự cảnh báo. Cổng 1 duyệt một spec tự mâu thuẫn | Một bảng duy nhất nguồn-tắt→dòng-sổ; E3 ghim NGUYÊN VĂN từng dòng | **fixed**: AC-3 nay là BẢNG duy nhất (EXPECTED cố định, mọi nguồn tắt → declared-off); Notes xoá câu hai-cách; E3 ghim nguyên văn `declared-off t1-escape` / `declared-off gap-probe` |
| P1 | contract+evals | AC-7 không có cơ chế đo: điểm nghẽn mù với khối không-chạm-sổ (dev thêm khối #4 không gọi ghi sổ → expected khớp, sổ khớp, khối vô hình); chiều "thừa tên" không đặc tả; không định nghĩa máy nhận diện "khối luật" bằng gì | Khối mới ship im lặng ngoài sổ, suite xanh, danh sách mục đúng kiểu AC-7 sinh ra để chống | Chữ ký lexical bắt buộc + đếm call-site + set-equality hai chiều | **fixed**: AC-7 nay đòi mọi khối ghi qua MỘT hàm `ledger_mark`, suite đếm tên duy nhất trong call-site == len(EXPECTED), và VIOLATION riêng cho tên THỪA; E7 tách RL7a/RL7b |
| P1 | design+contract | Không định nghĩa trạng thái "chạy nhưng bỏ việc vì phụ-thuộc-vắng-được-phép" (node vắng ở advisory — AC-14 gap-probe CHO PHÉP). Kết hợp AC-11 (warn không hạ điểm nghẽn) → consumer advisory hard-fail vì một trạng thái kit cho phép. Lý do MỚI mà quyết định warn chưa cân | Trước feature: run sạch. Sau feature: exit 2 ngoài đồng trên môi trường hợp lệ — phá true-negative AC-1/AC-4 | AC + case node-vắng advisory, đối chứng dương có-node | **fixed**: +AC-12 (E13) — mọi đường qua `*_not_enforced` là declared-off, nên trạng thái môi-trường-được-phép không bao giờ thành lệch sổ; AC-11 giữ nguyên và nay AN TOÀN vì sổ lệch chỉ còn nghĩa lỗi nội tại; trục Coverage ghi rõ lập luận này |
| P2 | contract vs evals | AC-6 khai BA lối exit-0 ("--help nếu có" — điều kiện treo), E6 ghim HAI | RL6 đỏ trên bản nguyên vẹn nếu script có sẵn đường help → author nới test lúc implement, máy-kiểm mềm đi mà contract không đổi | Chốt danh sách trước Gate 1 | **fixed**: AC-6 chốt ĐÚNG HAI lối, ghi rõ "thêm --help = một lần sửa contract"; E6 thêm đối chứng dương |
| P2 | design+contract | Design in `expected=<n+m>` — tautology tự khớp, dòng tổng kết không bao giờ hiển thị lệch; và không chốt lần VIOLATION [ledger] có in dòng này không | RL5a xanh rỗng: n+m==k luôn đúng vì k được tính từ n+m | k độc lập từ EXPECTED; chốt hành vi dòng tổng kết ở lần VIOLATION | **fixed**: AC-5 viết lại — k TÍNH TỪ EXPECTED, cấm chuỗi cộng n+m ở chỗ in (E5 grep nguồn); lần VIOLATION [ledger] VẪN in dòng với n+m != k làm bằng chứng lệch; +RL5c. Design sẽ sửa cùng commit |
| — | cross-check | Trục thiếu: khối chạy-nhưng-bỏ-việc; chiều lệch ngược của sổ | — | — | **fixed**: +2 trục Coverage (phụ-thuộc-vắng-được-phép · hai chiều của sổ) |

## Định đoạt — tóm tắt

5/5 sửa trên giấy, 0 deferred, 0 human-gate1.
Delta: **11 AC → 12 AC**, **12 eval → 13 eval**, **8 trục → 10 trục**.
P0 đáng xấu hổ đúng mức: Notes tự cảnh báo "đừng để hai nửa hiểu hai kiểu" rồi
chính nó mở cửa cho điều đó. Một-pass, không re-probe (quy ước S1#7).
