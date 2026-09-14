---
slug: khoi-tim-loi-tra-phi-theo-vat
at: 2026-09-14T04:18:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Seam bên-viết (`s4-args`) sang bên-đọc (workflow) cho trường `ngoaiVatGlobs` không có phép đo: E3 chỉ ghim vùng vật và delta; E4/E5 nhận trường đó do tệp ca tự dựng đúng khuôn bên đọc — lớp `[cong-nguoi-doc-du-nguon#F2]` | Bên viết phát thiếu phần văn bản hồ sơ hoặc khác cú pháp khớp của bên đọc. E3 xanh, E4/E5 xanh trên fixture tay; lượt chấm thật lại để finding trên hồ sơ tới triage — đúng lớp vòng này cắt, mọi phép đo vẫn xanh | VV4: tệp args do `s4-args` THẬT sinh phải mang trường đó và khớp bằng CÙNG hàm khớp của bên đọc; W41 chiều im nạp args từ chính tệp đó | fixed: AC-3 và AC-4 ghi vế round-trip; E3 thêm VV4, E4 thêm câu nạp-args-thật |
| P1 | contract | AC-3 loại mọi tệp .md trong thư mục hồ sơ khỏi vùng vật và delta — nhưng .md có thể là FIXTURE của thước và được eval khai trong `paths` (chính E2 của vòng này khai một fixture .md) | Lượt 2 chỉ sửa fixture đó thì nó không vào delta, carry thấy `paths` của E2 không chạm delta, E2 mang màu xanh lượt 1; chiều đỏ E2 tự hứa không bao giờ nổ ở lượt sau — FAIL-OPEN, ngược tuyên bố fail-closed | Sửa AC-3: tệp có tên trong `paths` của bất kỳ eval nào ở lại vùng vật và delta; VV5 đo hai chiều | fixed: AC-3 thêm vế **And**; E3 thêm VV5 |
| P1 | evals | AC-7 vế «baseline vẫn được đợi» không có chiều dương: E7 chỉ có W44 (không chờ) và W44b (reject) — mutant bỏ hẳn lượt đợi qua cả hai; lớp «assertion âm-tính-một-mình» của CLAUDE.md | S3 tách promise, thêm bắt lỗi, quên đợi ở điểm muộn. Hai ca xanh. Lượt chấm thật: phân tích eval-không-phân-biệt rỗng vì tính trước khi baseline trả về → eval xanh-cả-hai-phía được ký PASS; thước tự dối | W44c: baseline trả MUỘN với một eval xanh hai phía → id phải có trong danh sách không-phân-biệt; mutant bỏ đợi → đỏ với thông điệp ghim | fixed: AC-7 thêm vế **And** chiều dương; E7 thêm W44c |
| P1 | evals | AC-2 hứa «cả hai nơi» nhưng E2 chỉ đo thẻ; khuôn synthesize soạn bản findings không ai ghim. Vắng cả assert mục ngoài hợp đồng không rơi dưới heading «refuter chết» và assert prompt triage bỏ câu cũ | Sửa thẻ, quên khuôn synthesize → hai nguồn nói ngược nhau; hoặc cờ mới nhưng nhánh in vẫn rẽ theo cờ cũ → hai mục nằm dưới heading hạ-tầng-hỏng. Người ký đọc sai nguyên nhân, mất xanh-sạch, thêm lượt gọi người | Ba assert ghim thông điệp trong W40 + mutant đổi cờ | fixed: AC-2 ghi rõ cả hai nơi + heading + prompt; E1 thêm bốn assert |
| P2 | evals | E8 đo thước thời gian bằng transcript do chính tệp ca dựng; ca không-nổ cho phép mọi trường rỗng mà vẫn exit 0 và im lặng | Tên trường thời gian ở harness khác fixture → mọi agent rơi vào nhánh rỗng, `wallSeconds` 0, script exit 0, U06 xanh. Mốc 2.13 đọc dòng 5 ra rỗng; «số sau» của cả vòng lại là ước lượng — đúng bệnh thước này sinh ra để chữa | U06c trên transcript THẬT + số đếm agent không đọc được thời gian, ghim bằng 0 | fixed: AC-8 thêm vế **And**; E8 thêm U06b không-im và U06c |

## Cross-check (câu trả lời của critic, đã định đoạt)

- **AC không có eval:** không có. Ba MỆNH ĐỀ thiếu assert đã sửa (AC-2 khuôn findings · AC-7 chiều dương · AC-6 bộ đọc run-log và tiền tố cho lens đo).
- **GWT không đo được:** AC-4 từng nhắc lane thứ ba bằng hai tên như thể là hai lane — đã viết lại theo QUAN HỆ («lane thứ ba dù là mặc định hay lane thay chỗ khi repo khai skill review riêng»). AC-6 «đúng một dòng» nay ghim tính duy nhất theo khoá. AC-1 thứ tự nay ghim bằng chỉ số call, không suy từ số lượng.
- **Trục Coverage không có AC:** ô «lượt gọi người» của trục chi phí — giữ nguyên có chủ đích: đó là số đếm tay ở mốc phát hành (luật (c)), không phải hành vi của vật.
- **Cross-layer / mặt người nhìn:** không áp dụng (bề mặt dòng lệnh, vật là workflow và script). Mặt người đọc duy nhất là thẻ và bản findings — cả hai nay có phép đo.
- **Chuẩn repo chưa nạp:** không. Quét không gian và đặc tả UX đã bỏ có sổ (hai entry `descope`). Bản văn hồ sơ đã tránh dán mẫu khớp dạng dấu sao (bài học P161).
- **Lớp đo-lường:** năm hình dạng critic nêu đều đã vào bảng trên. Hai chỗ giữ nguyên có lý do: chiều đỏ của E3/E5 là «tệp ca chưa tồn tại ở cây gốc» — đó là cơ chế PHÂN BIỆT với bản nền, không phải răng cho vật (răng cho vật là ma trận dương VV1 và cặp VVM0/VVM1); và E7 nay không còn kết luận bằng hết-giờ.
