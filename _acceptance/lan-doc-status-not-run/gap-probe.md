---
slug: lan-doc-status-not-run
at: 2026-09-12T03:50:19Z
verdict: findings
p0: 2
p1: 3
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals + contract AC-1 | Không ca nào phân biệt chuỗi trạng-thái nằm ở TRƯỜNG thật với chuỗi nằm trong comment hay thân block scalar | Chính bản evals.yaml ĐẦU của vòng này có chuỗi đó trong thân `expected:` của E2; bộ quét theo dòng gán nó cho E2 → làn loại E2 vĩnh viễn, pin ghi evals_not_run gồm E2, mọi chiến dịch sau không bao giờ chạy lại ca «bên viết bỏ qua thật» mà vẫn xanh | Ma trận toàn phần năm chỗ (comment · folded · literal · paths · trường thật), chỉ chỗ cuối được loại, cộng chân tự soi chạy làn trên chính evals.yaml của vòng và assert mảng rỗng | fixed: thêm AC-10 + eval E11; viết lại evals.yaml để không dòng văn nào đặt hai chữ đó liền nhau, kèm luật viết ghi ở đầu tệp |
| P0 | contract AC-5 + evals E5 | Fixture «pin CŨ» không có đường round-trip rút-từ-writer-thật — corpus kit có 0 ô trạng-thái nên vật đó buộc phải dựng tay đúng khuôn bên đọc [eval-khai-ma-thoat-mong-doi#F1] | E5 tự soạn dòng pin theo khuôn bên ĐỌC mới nên xanh; pin cũ THẬT khác ở một chi tiết bên đọc bóc (kiểu evals_exit, thứ tự khoá, hậu tố dòng sha khi đã có đạt-có-giới-hạn) → chiến dịch ghim lại của mốc làm hồ sơ cũ ở kho tiêu thụ hoá đỏ, đúng lớp AC-5 tuyên đã chặn | Dựng pin cũ bằng writer thật bản trước vá: git archive lấy TRỌN thư mục (P150), chạy làn của bản đó, lấy dòng nó ghi; bên đọc mới VÀ bên đọc cũ cùng chấm 0 lỗi | fixed: AC-5 và E5 viết lại đòi writer thật + git archive trọn thư mục + đối chứng bên đọc cũ |
| P1 | design + contract AC-1 | Design hứa chuẩn hoá lower-case và trim nhưng không AC nào nhắc, không eval nào có ma trận hình dạng khai [release-2-11-0#F1] | Kho tiêu thụ khai giá trị bọc nháy, hoặc viết hoa, hoặc thừa khoảng trắng → so chuỗi thô không khớp, ô vẫn bị thi hành, làn đỏ y như trước bản vá; E7 vẫn xanh vì ca thật của OneFlow là dạng trơn duy nhất, hồ sơ được ký với lỗi còn sống | Ma trận toàn phần bảy dạng: sáu dạng đầu bị loại, dạng gạch dưới KHÔNG bị loại; mỗi dạng đi qua cả hai đường thi hành | fixed: thêm AC-9 + eval E10 |
| P1 | contract AC-5 + evals E5 | Vế «không hồ sơ nào hoá đỏ» đo bằng đẳng thức hai con số, không chân nào chứng phép đếm còn sống — assertion âm-tính-một-mình khoác áo đẳng thức | Cả hai lượt recheck cùng sập (bản base thiếu export mới nên thoát khác 0) và bộ phân tích đọc ra 0 cho cả hai; hai số bằng nhau nên E5 xanh dù pin cũ đã hoá đỏ | Ghim ba thứ: hai lượt đều thoát 0 · tổng số hồ sơ đã chấm in ra và lớn hơn 0 · tập TÊN hồ sơ vi phạm giống nhau; chân dương tiêm pin thiếu id ô chạy được → số vi phạm tăng đúng 1 | fixed: AC-5 và E5 viết lại theo đúng ba thứ + chân dương |
| P1 | contract AC-4 + evals E4 | «Dừng exit 2 TRƯỚC khi ghi byte nào» không có vật quan sát nào được gọi tên | Bản cài ghi dòng pin và mục Re-pin rồi mới phát hiện vế 2 và exit 2; E4 xanh vì exit và thông điệp đều đúng, nhưng hồ sơ đã ký bị bẩn một dòng pin, lượt recheck kế kết tội chính hồ sơ lành | Băm nội dung run-log.jsonl và evidence-report.md trước/sau, giống byte-đối-byte, không tệp mới; đối chứng dương: lượt xanh phải làm hai băm ĐỔI | fixed: AC-4 và E4 viết lại với vật quan sát băm + đối chứng dương |

**Định đoạt:** 5/5 finding đã sửa thẳng vào artifact (2 P0 + 3 P1), không mục nào đẩy sang `human-gate1`, không mục nào deferred. One-pass: KHÔNG re-probe — phần code có ba vòng chấm ở S4.

**Ghi nhận:** cả hai P0 đều là lớp «thước không gắn vào vật được giao» của CLAUDE.md; P0 thứ nhất bắt được chính artifact của vòng đang dẫm bẫy nó đi bắt.
