# Tổng kết đợt 2 «người về biên» — veto có dấu vết

*Phiên tổng kết 15/08, ngay sau merge PR #51 (`b496050`). Nguồn số: git
history 103a2dd..b496050 (24 commit), run-log 33 dòng/3 vòng,
biên bản hội đồng, gap-probe, và chính transcript phiên thi công. Không số
nào trong bài này viết theo trí nhớ — bài học «41 lượt phá là số bịa» (sửa
94b7d97) áp ngay cho bài này.*

## 1 · Đo với năm mục tiêu của bản neo

| M | Mục tiêu (trước → sau) | Trạng thái sau đợt 2 |
|---|---|---|
| M1 | Số lần chặn owner trong vòng T2 xanh sạch: 4–5 → **1** | **Cơ chế đã lắp, chưa đo trên vòng thật.** Vòng 1c (T2, trước đợt 2) chặn 6. Vòng veto (T3) chặn 4 lượt quyết thật — nhưng T3 *thiết kế* để chặn 3 (duyệt · chốt judgment · ký), nên nó không đo được M1. Số M1 thật phải chờ vòng T2 đầu tiên chạy trên luật mới — đợt 3. |
| M2 | Chữ ký chỉ ở đánh-đổi/khó-đảo | **Đạt về luật**: sáu điều kiện sạch máy-đọc + danh sách khó-đảo + NOTE đếm cửa veto cho phép đọc tỉ-lệ-cổng-đổi-kết-cục về sau. |
| M3 | 1 chỗ tuyên nguyên tắc | Đạt từ 1a (CLAUDE.md). |
| M4 | 0 nơi sửa-hai-lần | Đạt từ 1b. |
| M5 | Đúng MỘT cơ chế mới | **Đạt**: chỉ trạng thái V. Gap-probe soi mục «có lén cơ chế thứ hai không» — sạch; các vật đi kèm (danh sách sạch, danh sách khó-đảo, NOTE đếm) đều được bản neo gọi tên sẵn. |

Ba đợt đầu của bản neo nay **xong**. Còn đợt 3 — nghiệm trên vật thật.

## 2 · Chuỗi bằng chứng của hồ sơ

24 commit · Cổng 1 với gap-probe đóng **8 lỗ trước cổng** (2 P0 — nặng nhất
là *lưới canh trạng-thái-cuối mà không canh chiều-đổi*: máy sửa ngược veto
của người là veto bốc hơi) · 3 tầng thi công (lõi kiểm chặn-lúc-ghi → lưới
trước-merge → luật văn bản) · bộ răng 15 chân/33 phép đo con, mỗi chân qua
CHÍNH checker thật với chiều đỏ cùng lượt · 2 hội đồng phiên sạch (5 ca,
PASS cả 5) · **3 vòng chấm × 11 eval máy** (33 dòng run-log) · 2 lượt re-pin
sổ luật (lần 37, 38) · 4 suite 686/60/146/463 khớp đẳng thức và ≥ sàn ·
T3 nên owner tự chốt E6/E7 rồi ký — 2 chữ trong báo cáo là của người.

## 3 · Bảy lần máy bị bắt — xếp theo AI BẮT, vì đó mới là bài học

**Gap-probe bắt 2 (trước khi có dòng code nào):** chiều ghi-ngược veto không
ai canh · danh sách sạch thiếu điều kiện verdict-phải-đạt (một báo cáo TRƯỢT
sạch-5-điều vẫn tự merge được).

**Chân đỏ tự viết bắt 3 (trong lúc thi công):** thư viện đọc mục trả cùng
một giá trị cho «mục vắng» và «mục rỗng» — đường sạch-giả rẻ nhất suýt lọt ·
hồ sơ mẫu thiếu người duyệt nên chân đo nhầm luật Cổng 1 · phép so đọc dòng
đầu nên bắt phải dòng giải thích thay vì dòng vi phạm.

**Phiên chấm tươi bắt 3 (sau khi thi công tưởng xong):** hồ sơ cộng **0 ca
vào lưới thường trực** — sau merge mã cưỡng chế mới không ai canh (ADR 0011
ký buổi sáng cứu hồ sơ buổi chiều) · một **LỜI KHAI SAI**: tuyên «đã tách
hai phép đo» trong khi chỉ thêm chú thích, output giống nhau từng ký tự ·
một chân xanh mà không cô lập được thứ nó gọi tên (phiên chấm đâm riêng phần
vật cả hai chiều — vật đúng, thước không cô lập).

**CI bắt 1, lặp ×2:** bản đồ sản phẩm lệch sau commit chữ ký — cả PR #49 lẫn
#51, cùng một lỗi.

## 4 · Lớp lỗi đặt tên được từ đợt này

1. **Lời-khai-không-khớp-vật ở lượt SỬA.** Nguy hiểm hơn lỗi kỹ thuật: vòng
   sau đọc lời khai để quyết đo gì. Thuốc đã thành nếp ở vòng 3: *phiên chấm
   kiểm chứng từng lời khai của lượt sửa bằng phép đo, kèm đếm-vệ-sinh* —
   và chính nếp đó bắt được «tách E3/E3b» là khai khống.
2. **Răng-hồ-sơ ≠ lưới thường trực.** Câu hỏi «sau merge, AI canh?» phải
   được trả lời ngay tại Cổng 1 cho mọi hồ sơ chạm lõi — ghi vào hàng đợi
   reflect để cân việc thêm nó vào bộ câu gap-probe.
3. **Hai guard khoá nhau khi kit tự mở rộng** (`DV5` cấm sửa dòng luật cũ ×
   `RL7a1` đòi sổ tên khớp tập luật): thêm luật buộc chạm dòng khai. Đường
   thoát đúng: miễn trừ ĐÍCH DANH chuỗi cũ, không phải mẫu.
4. **Bản-đồ-sau-chữ-ký, lặp ×2 trong một phiên.** Không phải xui: đường ký
   THỦ CÔNG (agent làm thay lệnh `/signoff`) không có bước vẽ lại bản đồ,
   lệnh thì có. Nút rẻ ở hạt giống
   `2026-08-15-hat-giong-ban-do-dinh-chu-ky.md`.
5. **Máy-tự-dừng-cuối-tầng, tái xuất ở cấp PHIÊN.** Trong vòng veto, owner
   phải gõ ~5 lượt «tiếp đi / chạy tiếp» — không lượt nào là quyết định.
   Đây là đúng lớp «feature-loop không tự loop» (đo 26/07: 7/14 lần dừng là
   agent tự chèn) sống lại ở tầng hội thoại: phiên kết lượt sau mỗi tầng
   bằng «tôi làm tiếp X» rồi... dừng. Bất biến dừng mới thu hẹp CỔNG nhưng
   chưa trị được THÓI QUEN kết-lượt-non của phiên. Không mở hồ sơ engine cho
   nó — nó là hành xử phiên, trị bằng nếp: *đã tuyên «tôi làm tiếp X» thì
   PHẢI làm X trong cùng lượt.*

## 5 · Giới hạn mang theo (khai tại thẻ, nhắc lại để khỏi quên)

- Chân đo tầng lời văn CHỈ có vế dương — chưa chứng minh câu luật CŨ đã biến.
- Một chân của bộ điều-kiện-sạch không cô lập được vế hạng-tự-phong (vật đã
  được đâm thử riêng và đúng).
- Mốc `BASE-V` cố định → các chân so-với-mốc nhạt dần sau merge (đặc tính
  của răng-hồ-sơ, nay đã có 6 ca thường trực V01–V06 gánh phần dài hạn).
- Hành vi «máy đi trước» mới được hội đồng chấm trên đề ca — chưa chạy trên
  vòng thật nào. Đợt 3 là phép thử thật đầu tiên.

## 6 · Việc xếp hàng sau đợt 2 (không việc nào chặn việc nào)

1. **Đợt 3 — nghiệm trên vật thật** (điều kiện đóng bản neo): ≥2 feature
   thật ở repo tiêu thụ chạy trọn luật mới, đo M1/M2 thật, retro bằng dao
   trace. Đây cũng là lần đầu Cổng Giá trị có cơ hội chạy — bản đồ hiện ghi
   **41 việc đã giao · 0 việc qua Cổng Giá trị**.
2. Hạt giống bản-đồ-dính-chữ-ký (mới, nút rẻ).
3. Hạt giống T1 tuyên-kèm-căn-cứ (chờ Cổng 0, đã có điều kiện mở lại).
4. Hạt giống hỏi-theo-mặt-phẳng (xếp sau đợt 2 — nay đợt 2 xong, đủ điều
   kiện xếp lịch).
5. Hàng đợi reflect 10/08 — đợt này chạm 2/4 mục: «CTA-law hiệu quả?» (khối
   👉 nay hẹp lại đúng tin mời cổng — 1c) và «quay-lại-cổng tự thi hành»
   (chính là cửa veto + lưới chặn chiều ghi-ngược). Hai mục còn treo: văn
   hoá tự lan · chi phí pivot.
