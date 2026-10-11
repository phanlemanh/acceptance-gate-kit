---
slug: eval-goi-model-that-khong-chay
at: 2026-10-11T09:25:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Phản biện context sạch — eval-goi-model-that-khong-chay

Một tác tử tươi đọc đúng sáu tệp (design doc, contract, evals, decisions, bài học xuyên hồ sơ từ
claim-scan, ô cơ hội), không đọc mã. Sửa artifact một lượt, không chạy lại phản biện (one-pass).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | E12 so `git diff 08ba287d…HEAD` với mốc đông cứng, không khai paths, không giới hạn diff vào commit của vòng. | Gộp main giữa vòng kéo commit ghim lại chạm hồ sơ đã ký → E12 đỏ «chạm hồ sơ đã ký» dù vòng không chạm; sau khi gộp, mọi làn ghim lại chạy E12 trên diff phình theo main → đỏ vĩnh viễn. | Rút tệp từ chính commit của vòng; ca chiều im: commit ngoài vòng chạm hồ sơ đã ký → vẫn xanh. | fixed: AC-12 + E12 rút tệp từ commit không-gộp mang dấu `(eval-goi-model-that-khong-chay)`; thêm chiều im trên kho thử; Notes khai giới hạn «commit quên dấu vô hình» |
| P1 | design | Luật «thư mục → mọi tệp dưới nó» áp lên đối số `cd` và từ trùng tên thư mục; lớp 4 không có ca độ đặc hiệu; số 17/44 không gồm lớp 4 và 5. | Lệnh crm `cd apps/agent && bun test …` băm trọn `apps/agent/` → dùng lại ≈ 0 → UAT CHẾT; ca `cd tools && sh e1.sh` xanh rỗng vì từ `tools` tự kéo e1.sh vào băm. | Đối số `cd` không trỏ tệp; ca độ đặc hiệu; phép phá «bỏ giải theo cd»; đo lại 44 cặp với năm lớp. | fixed: lớp 4 chỉ nhận tên tệp đúng, không kéo thư mục, đối số `cd` không trỏ tệp (design §2.2, d-…-6); AC-2 + E2 thêm ba ca độ đặc hiệu và hai phép phá («bỏ giải theo cd», «băm kéo cả thư mục»); đo lại năm lớp xấp xỉ: 14/44 (design §0, contract Context) — đo bằng chính hàm sau khi dựng |
| P1 | contract | Vi phân AC-7, AC-5(c), AC-8 chạy làn/bên đọc `08ba287d` đông cứng so với cây hiện tại; E7 chạy lại ở mọi vòng sau chạm làn; SAU-G3 «mới nhất mang dấu» trôi theo commit ký. | Vòng sau thêm khoá vào dòng repin hay JSON stdout → «tập khoá bằng nhau» đỏ dù khoá vắng vật vẫn như cũ; hồ sơ đã ký phải revisit. | Vi phân với mốc chỉ ở lượt chấm; làn ghim lại đo bất biến trong cùng cây; ghi SAU-G3 cố định. | fixed: AC-7 và AC-8 tách vế sống (cùng cây) và vế đông cứng (mốc ↔ SAU-G3, hai bản archive); SAU-G3 = commit mang dấu VÀ chạm `feature-loop/scripts/` (cố định sau gộp); AC-5(c) ghi pin khi khoá vắng bằng làn hiện hành, bỏ phụ thuộc mốc (d-…-7) |
| P1 | contract | Design hứa trần 60 s và «một lần mỗi lượt» cho lệnh dấu vân tay; khối lý do, AC-4, E4 không có hết giờ; không AC đếm số lần chạy lệnh vân tay. | Lệnh dò Gateway treo mạng → làn (không trần công cụ) treo vô hạn; hoặc vật chạy lệnh dò mỗi eval → 14 lần gọi Gateway/làn mà mọi eval vẫn xanh. | Lý do hết giờ trong khối; ca `sleep` vượt trần; ca hai eval model → bộ đếm lệnh vân tay = 1; phép phá «bỏ hết giờ». | fixed: AC-4 + E4 thêm lý do hết giờ (đo ở hàm chạy lệnh với trần 0,5 s — ca làn 60 s không đứng được trong suite), ca hai eval model → lệnh vân tay chạy 1 lần, phép phá «lệnh dấu vân tay không có trần» |
| P2 | contract | Ngưỡng CHẾT đọc `carry_lech` là «dùng lại mà đầu vào đã đổi», nhưng `carry_lech` cũng nổ khi eval không tất định; đường đo một cột không tách nguyên nhân [gia-lan-ghim-lai#F1]. | Eval LLM thật đỏ chập chờn một lượt sau khi nguồn quá hạn, cùng băm → carry_lech = 1 → UAT ghi CHẾT dù không lần dùng lại nào sai. | Script đếm gắn nhãn từng lượt lệch theo tệp git đổi giữa sha nguồn và sha lệch. | fixed: AC-10 + E10 thêm hai ca nhãn «lệch không tất định» / «nghi thiếu đầu vào: <tệp>» và phép phá «không tách nguyên nhân lệch»; Đường đo nói ngưỡng CHẾT đọc nhãn thứ hai (design §4) |
