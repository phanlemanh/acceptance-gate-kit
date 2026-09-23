# Hạt giống — khuôn `/goal` của feature-loop coi BLOCKED là «hoàn thành» nên phiên dừng hỏi người thay vì chạy lại cùng round

**Ngày:** 2026-09-23 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: crm/_acceptance/kiem-auth-khong-phu-thuoc-thu-tu — round 3 (23/09 05:15Z) BLOCKED vì agent chạy E5 `check-types` chết; phiên (kit 2.18.1) khai «đã đủ 3 round, là trần, máy dừng», hạ hợp đồng về `implemented`, không dựng thẻ Cổng 2 (card.html vẫn của round 2), và hỏi owner chọn (a) round 4 / (b) sửa hợp đồng / (c) dừng — kèm một finding TRONG hợp đồng (AC-7) cũng đưa cho người chọn.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Hai luật cãi nhau trong cùng SKILL feature-loop 2.18.1

- Dòng 248 (S4): «BLOCKED → đọc `blocked[].cmd` + `reason`, trình nguyên văn, khắc phục nguyên nhân, **chạy lại CÙNG round**. Không bao giờ downgrade BLOCKED thành pass.» — tức BLOCKED không đốt trần, không cần người.
- Dòng 155 (khối GOAL-TEMPLATE in ra cho owner dán `/goal`): «Loop đã escalate cho user (REJECT quá 3 round / **BLOCKED** / chờ input người) cũng coi là HOÀN THÀNH» — tức Stop hook của phiên coi BLOCKED là điểm dừng hợp lệ, và câu «Dừng mà không nêu tiền đề hay lối nào để người chọn = CHƯA hoàn thành» ép phiên **dựng lối cho người chọn** đúng lúc luật S4 bảo tự chạy lại.

Hệ quả đo được: một lượt gọi người ngoài thiết kế + finding trong hợp đồng bị đẩy sang người (máy phải tự sửa) +
thẻ 2.18.1 với nhãn cạnh gãy không được dựng, nên owner thấy «như kit cũ». Cùng khuôn goal ấy đã đốt thời gian máy 4
lần trong 3 ngày (câu «set contract … status: verified» kẹt Stop hook khi hồ sơ đi làn V — 22/09).

## Dạng nghiệm đúng tầng

1. Sửa GOAL-TEMPLATE: BLOCKED KHÔNG phải điều kiện hoàn thành; hoàn thành = phiên chính đã trình thẻ Cổng Bằng chứng
   (PASS / PENDING-JUDGMENT / BLOCKED-đã-thử-lại-một-lần với ô ký trên cạnh gãy) hoặc dừng ở cổng có tên; bỏ mọi mệnh
   lệnh trạng thái tệp («status: verified») và bỏ vế «không chắc = chưa hoàn thành».
2. Bước S4 BLOCKED trong SKILL nói rõ: lượt chạy lại cùng round KHÔNG đếm vào trần; finding `inContract` khi BLOCKED
   vẫn là việc máy sửa trước khi chạy lại.
3. Chiều đỏ: ca đọc SKILL rút khối GOAL-TEMPLATE và khẳng định không chứa «BLOCKED» trong vế hoàn thành và không chứa
   «status:» ; chiều im: khuôn mới vẫn dán được vào `/goal` (đường đọc-cũ: goal cũ vẫn chạy).

TRỪ (bớt một điều kiện dừng). Xếp vào vòng đầu cửa sổ kế cùng ba hạt giống đã có. Ngưỡng mở ô: đã đủ.
