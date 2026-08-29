---
slug: suite-run-log-provenance
at: 2026-08-29T02:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Phản biện context sạch — suite-run-log-provenance

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Trục D khai bốn nút nhưng dây AC dừng ở nút thứ hai: AC-5 chỉ đòi đề bài CHỨA bản đồ mã. Không AC/eval nào chạy `extractEvalBlockRunIds` + `loadRunLogIds` — đúng hai hàm contract tự nêu làm thước CE — trên một bản chấm THẬT | Bản chấm ghi `SUITE-build` (evalId) thay vì `minted-...-SUITE-build-r1` (run_id), hoặc ghi ở chỗ bộ trích không quét. Sổ có dòng, đề bài có mã, cả 7 eval xanh, vòng ký — rồi recheck vẫn đỏ L2 PROVENANCE đúng như media-library vòng 11 | Chạy TRỌN dây trên fixture code-sinh: runLog thật → bản chấm → `extractEvalBlockRunIds(report) ⊆ loadRunLogIds(log)`, assert QUAN HỆ bao hàm. Chiều đỏ: bỏ một dòng suite khỏi sổ thì phép so phải đỏ ghim mã thiếu | fixed: AC-5 viết lại thành dây writer→reader chạy chính hai hàm đó; E6 đổi sang round-trip, thêm chân đếm khối luật |
| P1 | evals | E3 neo chiều đỏ vào mốc `BASE-SRLP-VA` không được khai sha ở đâu; trạng thái nó mô tả chỉ tồn tại trên commit nhánh chưa vào main — mốc di động | S3 amend/rebase commit vá (rất thường, vì mã chống va chạm sửa cùng file) → sha chết, `git show` exit 128, người dựng răng bỏ luôn vế đối chứng, E3 còn một chiều | Dựng chiều đỏ bằng bản-sao-gỡ-vá do code sinh trong lần chạy (như E2), không bằng mốc git; hoặc khai sha đã vào main | fixed: bỏ hẳn `BASE-SRLP-VA`; E3 dựng chiều đỏ bằng cách GỠ đoạn chống va chạm trong bản sao code-sinh, kèm `cmp` chứng minh tiêm đổi nội dung |
| P1 | evals | Ma trận trục A không toàn phần: ô «lệnh ghép a && b» không có AC lẫn eval; ô «lệnh trần» không ghim giá trị tên mong đợi nên không viết được assert; AC-3 chỉ kiểm va chạm bằng MỘT hình dạng | Nhánh dự phòng cắt chuỗi ở 40 ký tự: hai lệnh trần trùng 40 ký tự đầu cho cùng một tên, cùng một mã — đúng vi phạm AC-3 ở nhánh fixture E3 không chạm | Bảng ma trận đặt ĐẦU evals.yaml như hợp đồng, mỗi ô trục A một assert đích danh với tên mong đợi ghim nguyên văn; răng đếm số assert và tự đỏ nếu lệch | fixed: bảng ma trận vào đầu evals.yaml (6 ô trục A); AC-3 thêm ca lệnh-trần-trùng-40-ký-tự; E5 ghim tên mong đợi cho cả sáu hình dạng gồm lệnh ghép |
| P1 | evals | E6 hạ lời hứa QUAN HỆ của AC-5 xuống hai phép có-mặt-chuỗi rời, và đo ĐỀ BÀI (chỉ dẫn) chứ không đo bản chấm (đầu ra) | Thi công thêm một đoạn thứ hai vào đề bài kiểu «thiếu id thì tự đặt theo mẫu» — cả mã lẫn chuỗi cấm vẫn có mặt nên E6 xanh, agent theo đoạn dễ dãi, bản chấm mang mã bịa | Vế chứng được: đề bài chứa ĐÚNG MỘT khối luật mint — đếm điểm neo, khác 1 là đỏ ghim số đếm. Vế còn lại chuyển sang assert trên ĐẦU RA | fixed: E6 = round-trip đầu ra (thước của P0) + chân đếm khối luật ghim số |
| P2 | contract | Trục C ô «vòng sửa sau REJECT» không có AC nào nói mã suite phụ thuộc round; AC-2 chỉ ràng buộc ổn định TRONG cùng round | Thi công đọc AC-2 là «mã phải ổn định» rồi bỏ hậu tố round → vòng 1 và vòng 3 cùng mã; bản chấm vòng 3 trỏ về được lượt chạy vòng 1, mất đúng thứ sổ sinh ra để bảo đảm | Chạy cùng lệnh ở round 1 rồi round 2 trên cùng fixture, assert hai `run_id` khác nhau, ghim riêng. Chiều đỏ: bản tiêm bỏ hậu tố round phải đỏ | fixed: AC-2 thêm chân round; E5 thêm ca hai-round ghim thông điệp |

Ghi chú của critic (không thành finding): assertion âm tính của E1–E7 đều có đối chứng dương và thông điệp ghim — không lỗ ở lớp này. Hardcode ROOT chưa vi phạm nhưng chưa bị chặn → đã bổ sung câu ràng buộc «đường dẫn suy từ vị trí răng» vào `expected` của E2/E3/E7.
