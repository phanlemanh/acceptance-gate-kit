# Reflect trước vòng 3 — delta kể từ reflect lần 1

*2026-08-10 · Soạn: phiên B (điều phối) theo lệ owner đặt: reflect trước mỗi
ván. Phủ quãng 09–10/08: vòng 2 trọn (REJECT kép → dừng-hẳn → đánh-giá-lại →
errata → ký + merge `4e615b2`) · đợt kit 1.27.2 (3 vòng → DỪNG HẲN không ship)
· tạm-nghỉ-toàn-bộ + tái khởi động · kim chỉ nam + luật rẻ-thì-làm ra đời.
Nguồn: sổ vấp 46 dòng · [reflect lần 1](2026-08-09-reflect-thu-nghiem-lan-1.md)
· [bản chất thật](2026-08-09-ban-chat-that-vong-lap-kit.md). Không kể lại
chuyện reflect 1 đã kể.*

## 1 · Cái mới đứng vững — với bằng chứng giá

1. **Đường-rẻ thắng đường-nặng, bốn lần đo được:** acceptance-direct thay
   workflow hỏng (mở khoá vòng 2 với **0 giờ kit**) · errata thay amendment
   (tiết kiệm đúng **1 lượt duyệt**, độ trung thực không đổi — 3 số sai nằm
   công khai trên thẻ ký) · carry chỉ-comment thay chấm-lại-toàn-bộ (proof
   hai phép) · chấm phạm-vi-hẹp **65→21 lượt gọi / 5,9 phút**. Luật
   rẻ-thì-làm không còn là tuyên bố — nó có hoá đơn.
2. **Luật dừng thành phản xạ:** hai lần dừng-hẳn đúng lối thoát khai trước
   trong 24 giờ (1.27.2 không ship dù r3 PASS máy; vòng-cuối vòng 2 dừng vì
   3 câu văn) — không lần nào xin "amendment thứ ba". So với GĐ1 (5 vòng mới
   dừng được): hệ đã nội hoá được điều đắt nhất.
3. **Thẻ mặt người là lưới THẬT, không phải lớp trình bày:** bắt 2 lỗi
   (cột verdict khớp-chuỗi hiển thị "11 chưa đạt"; khối bằng chứng gộp) mà
   **ba cổng máy + hai chân chấm độc lập đều trượt**. Dữ kiện dương quý nhất
   cho câu "cổng nào đáng giữ" ở GĐ4.
4. **Máy tự thú vượt chuẩn người:** tự sửa NGÀY trên chữ ký theo timestamp
   transcript (09→10/08, khai trong seal) · khai thẳng "carry chiều đỏ KHÔNG
   chạy lại" · để nguyên 3 số sai cho người thấy thay vì sửa lặng lẽ. Văn
   hoá chữ-khớp-vật đã ngấm tới mức tự áp lên biên bản của chính mình.

## 2 · Số lấy-mẫu đầu tiên cho GĐ4 — bảng giá trị theo tầng

Từ 7 lượt chấm + 2 vòng ký của kỳ này:

| Tầng | Bắt được gì | Trượt gì |
|---|---|---|
| Cổng kit (hook, re-check, pre-merge, khuôn) | **Rất tốt với lỗi HỒ SƠ**: khuôn evidence, verifier thô, run_id, stale, thiếu trường — riêng đoạn khép bắt 4 lỗi của A | **0/4 lỗi chặn-phát-hành** |
| Chân chấm độc lập (review/verify context tươi) | **4/4 lỗi chặn-phát-hành** (trần n² thủng ×3 cơ chế · E4 xanh-rỗng · 3 câu số cũ · DV5 bên kit) | đắt, và 3/7 lượt chết vì hạ tầng |
| Thẻ mặt người + mắt owner | 2 lỗi máy trượt + toàn bộ các cú "cách-làm-cũ" | — |

Kết luận A tự rút, B chuẩn y: *hai loại giá trị khác nhau, chi phí khác nhau —
tính chung là tính sai.* Đây là đề bài trung tâm của GĐ4: giữ tầng nào, trả
giá nào, theo tỉ lệ này (sẽ dày thêm sau vòng 3).

## 3 · Lớp lỗi MỚI kỳ này (reflect 1 chưa có tên) — và chốt đang canh

| Lớp | Số lần | Chốt hiện có |
|---|---|---|
| Số-chép-lại-không-đo-lại (stale numbers — kể cả trong Amendment về chữ-khớp-vật) | 2 | luật đo-lại-sau-commit-cuối; chưa máy hoá |
| Hằng-số-tự-thêm (n² — tự tin viết thành số, 3 trần liên tiếp thủng) | 1 chuỗi | luật trần-phải-suy-được, ghi trong contract mẫu vòng 2 |
| Phép đo không-thể-đỏ | **8/1 feature** | chiều-đỏ-phải-CHẠY-trước-khi-khai — mới là lời dặn, chưa cơ chế |
| Bịa-định-danh từ chuỗi cắt cụt | 2 | gỡ bề mặt (bỏ field optional); argsPath là đề bài 2.1 |
| Ba-lớp-che-xanh (luật-tắt · thoát-sớm · runner-nuốt-exit) | 1 cụm | runner fix xếp hàng 2.1; tái-xác-nhận suite cũ sau fix |
| Staleness liên-tính-năng (2 feature canh chung 1 file test) | 1 | re-pin có tiền lệ; đề bài 2.1 |

## 4 · Phép thử hội tụ của reflect 1 — kết quả BẤT NGỜ

Reflect 1 đặt cược: *"vòng 3 lôi ra ít lỗi kit hơn = hội tụ; lại đẻ đợt vá =
hydra."* Vòng 2 trả lời theo cách thứ ba không ai đoán: **hydra ĐÚNG cho cái
tháp** (1.27.2 chết đúng kiểu hydra — 5 tầng lỗi nối nhau), nhưng **lối thoát
không phải chặt đầu rắn mà là ĐI VÒNG** (acceptance-direct, 0 giờ kit). Bài
học: câu hỏi đúng không phải "kit hội tụ chưa" mà "đường nào tới sản phẩm
không đi qua tháp".

## 5 · Điều kiện vào vòng 3 — checklist

- [x] 2/≥3 feature thật trên main consumer; toàn hệ xanh, cây sạch.
- [x] Đường vòng 3 chọn sẵn: acceptance-direct + design-pass + uat-session
      (KHÔNG workflow feature-loop — nó chờ 1.27.2-v2 ở 2.1).
- [x] Các luật lớp mới nhúng đề bài (số-phải-đo-lại · trần-phải-suy-được ·
      chiều-đỏ-chạy-trước-khi-khai · usage-report là điều kiện PASS).
- [ ] **`opportunity.md` + ngưỡng UAT khai TRƯỚC khi build** — Cổng Đáng, lần
      đầu chạy thật; grill 4-câu-hỏi-thực-tế với owner.
- [ ] **Người dùng đại diện** cho phiên UAT — owner mời; chấm kín trước thảo
      luận; "KILL tại cổng là thành công quy trình".
- [ ] Ngưỡng gọi-người vòng 3 khai TRƯỚC theo đường A thật (Cổng Đáng ·
      Cổng 1 · ký · Cổng UAT = 4, cộng judgment items khai rõ) — khai đúng để
      không đẻ "vượt ngưỡng" giả.

## 6 · Rủi ro mở của vòng 3 — khai trước, không giấu

- **uat-session chưa từng chạy** — skill mới toanh, chắc chắn có vấp; ván đầu
  của nó cũng là THÁM HIỂM, không chấm skill bằng ván đầu.
- **design-pass mới chạy pilot r1** — hành vi thật ở r2 là ẩn số có tên.
- **Hạ tầng chấm chết 3/7 lượt** — mọi dispatch vòng 3 mặc định phạm-vi-hẹp
  + thăm dò 1-agent; treo lần nữa → xử hạ tầng, không đốt vòng.
- **Trình vẽ chạm UI** — capture/ma trận state là vùng kit ít được thử nhất
  ở consumer.
