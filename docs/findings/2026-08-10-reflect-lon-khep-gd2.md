# Reflect lớn — khép GĐ2, định hướng kỷ nguyên kế

*2026-08-10 · Soạn: phiên B theo lệnh owner, sau tổng kết đối chiếu workflow.
Chuỗi hồ sơ nền: [bản chất thật](2026-08-09-ban-chat-that-vong-lap-kit.md) ·
[reflect 1](2026-08-09-reflect-thu-nghiem-lan-1.md) ·
[reflect 2](2026-08-10-reflect-truoc-vong-3.md) ·
[tổng kết đối chiếu](2026-08-10-tong-ket-gd2-doi-chieu-workflow-v2.md).
File này KHÔNG kể lại — nó tổng hợp và định hướng.*

## 1 · Cung đường, nhìn từ trên cao

Kit sinh 06/2026 để trả lời "làm sao tin code AI" — rồi lạc 29 vòng tự đo
mình. Tái lập 07/08 đặt cược: đóng lab, bắt kit chứng minh trên việc thật.
GĐ1 chết đúng luật (5 REJECT, không ship). GĐ2 ba ván trong ~3 ngày: hai
feature ship + một feature đi trọn bốn cổng và nhận chữ **kill** tại Cổng Giá
trị đầu tiên. **Vòng tròn khép: hệ thống sinh ra để đo niềm tin cuối cùng đã
đo được thứ duy nhất đáng đo — sản phẩm trước mắt người thật — và dám nói
không.** Điều kiện mở kit 2.1 đạt nguyên nghĩa đen charter.

## 2 · Sổ giá trị của toàn thí nghiệm — cái gì bắt cái gì (bảng chốt)

| Tầng | Bắt được (bằng chứng) | KHÔNG bắt được | Chi phí |
|---|---|---|---|
| Cổng máy (hook/recheck/pre-merge/khuôn) | Lỗi HỒ SƠ xuất sắc; recheck bắt lỗi chất-lượng-bằng-chứng (script bốc hơi, run_id dồn dòng) | Lỗi vật, lỗi nghĩa | rẻ, tự động |
| Chân chấm độc lập context tươi | 4/4 lỗi chặn-phát-hành vòng 2; judge đòi bằng-chứng-thiếu | Lỗi đủ-dùng | đắt; chết hạ tầng 3/7 |
| Mắt người giữa dòng | 4 ca máy-mù (overlay lệch, bản vẽ lộn ngược…) | — | rẻ NẾU vật thật đang chạy |
| Cổng Giá trị (người thật + ngưỡng ký trước) | Khoảng cách ĐÚNG-HÌNH ↔ ĐỦ-DÙNG — duy nhất nó bắt được | — | 1 buổi/ván |

**Không tầng nào thay được tầng nào.** GĐ4 prune theo bảng này, từng tầng
theo tỉ lệ đo được — không prune theo cảm giác, không giữ theo ký ức.

## 3 · Mô hình MẮT-NGƯỜI-GIỮA-DÒNG (đề bài trung tâm — trả lời)

Dữ liệu ván 3: 4 cổng + 6 can-thiệp-giữa-dòng; mắt owner bắt 2/4 lỗi nặng
nhất; grill là nội dung. Mô hình 4-cổng là *hợp đồng tối thiểu*, không phải
bức tranh tương tác. Người tham gia bằng BA vai khác nhau, cần đối xử khác:

1. **Ý ĐỊNH** (grill, Cổng Đáng, grill-thiết-kế): người là NGUỒN — không thể
   uỷ quyền, không nên rút gọn. Máy phục vụ bằng câu hỏi tốt + đổ thẳng vào
   khuôn.
2. **MẮT** (design-pass, xem giữa build, UAT): người là CẢM BIẾN tầng-ý-nghĩa
   — thứ máy mù. Rẻ khi vật thật đang chạy trước mặt; đắt khi phải tưởng
   tượng. → thiết kế để TĂNG băng-thông-mắt-trên-phút: vật luôn chạy được,
   khối VIỆC-CỦA-ANH rõ, phản ứng bằng một câu.
3. **TRÁCH NHIỆM** (chữ ký): người là NGƯỜI GÁNH — mỗi quyết một lời, không
   giả được. → thứ DUY NHẤT cần rút gọn nghi thức về một-lượt-gõ.

Hệ quả cho 2.1: giảm ma sát vai (3); TĂNG chất lượng phục vụ vai (1)(2).
Nhầm lẫn ba vai là nguồn của cả gate-fatigue lẫn thiết-kế-bị-bỏ.

## 4 · Hệ luận mới của North Star (đúc từ truy vấn owner)

> **Khi LÀM rẻ đi trăm lần, giá trị dồn về KHAI.** Build 95 phút làm
> bỏ-thiết-kế thành vô hình tới tận UAT; sai-tầng-ý-định là loại sai duy
> nhất còn đắt. Kỷ nguyên kế: máy càng nhanh, các khoảnh khắc KHAI (grill,
> thiết kế, ngưỡng, phạm-vi-loại-có-ý-thức) càng phải được bảo vệ và làm giàu
> — đó là chỗ người tạo giá trị không thay được.

## 5 · Văn hoá vs cơ chế — số liệu để GĐ4 quyết

Model hiện tại (đo trong 3 ngày): tự dừng đúng luật ~10 lần · tự bắt
xanh-giả ≥6 lần · tự lưu luật vào memory riêng · tự tạo CONTEXT.md consumer ·
từ chối thẩm quyền giả 100% các lần thử. Tỉ lệ hỏng cần-tháp-đỡ thấp hơn xa
so với thiết kế tháng 6. Kết hợp bảng mục 2: **phần lớn tháp đo-của-đo có
thể prune; phần văn hoá (corpus bài học + luật thành văn + memory) đang gánh
việc mà cơ chế từng gánh — rẻ hơn và tự lan.** GĐ4 chỉ cần giữ: lõi bất khả
nhượng + tầng nào có ca-bắt-thật trong bảng mục 2.

## 6 · Đề xuất đường đi (owner quyết, mỗi mục một chữ)

1. **GĐ3 — thông báo #2 cho đội**: kit 1.39.1 ổn định + 3 ván bằng chứng +
   sổ vấp 58 dòng làm kênh hứng vấp. Thông điệp mặt-người: *"bỏ điền phút ·
   thẻ kết bằng khối VIỆC-CỦA-BẠN · chuẩn bằng chứng giữ nguyên 100% · vấp
   thì ghi sổ, đừng tự vá kit"*. Baseline 3 số (charter 3.5) đã tính được:
   người-lật-máy ≈ 4 ca/3 ván (toàn mắt-bắt) · sự-kiện-cần-người 4–5/ván
   đường A, 2–3/ván đường C · feature qua Cổng Giá trị 1/1 chạy (kill).
2. **Mở kit 2.1** — thứ tự theo North Star test (rẻ × tỉ-lệ-đo-được):
   ① stale-theo-diff-PR (phân tích sẵn, gỡ chặn merge mọi vòng sau) ·
   ② khối VIỆC-CỦA-ANH vào khuôn card/mời-cổng ·
   ③ một-lượt-gõ + `--repo` cho 6 lệnh cổng ·
   ④ un-skip S1-D + câu-C2-sớm + đặt tên lại thang vật liệu ·
   ⑤ chiều-đỏ-đã-chạy + quy-ước-đo vào khuôn eval/opportunity ·
   ⑥ runner exit-code + suite in số-ca ·
   ⑦ card mode Cổng 0/UAT. (Mỗi món một hồ sơ nhỏ, nghi-thức-tương-xứng.)
3. **GĐ4 gộp vào lượt scoping 2.1** (một lần bàn, không hai): prune theo bảng
   mục 2 + quyết Codex twin theo usage + cổng-tự-qua-có-lấy-mẫu cho Gate 1
   sạch.
4. **Trace-v2 ngủ đông có địa chỉ** — chờ tín hiệu Trang Tư Vấn; 4 lỗ UAT là
   đề bài mở lại.

## 7 · Một câu khép

Ba ngày trước, câu hỏi là *"làm sao thoát vòng lặp sửa kit vô tận."* Câu trả
lời hoá ra không phải sửa kit giỏi hơn — mà là **bắt mọi thứ quay mặt về
sản phẩm**: neo vào thực tại, người đúng vai, máy đúng việc, cơ chế trả tiền
thuê bằng tỉ lệ đo được. Lần đầu tiên kể từ tháng 6, hệ thống này kết thúc
một giai đoạn mà **mọi giờ đều trỏ được về một mẩu giá trị cho người dùng
hoặc một bài học có địa chỉ** — và không còn vòng nào đang tự quay.

## 8 · TỰ-RÀ SOÁT (lệnh owner) — 7 lỗ logic tìm thấy trong chính bản này

1. **[NGHIÊM TRỌNG — lớp đã có tên] "Sạch sổ" là tuyên bố sai:** toàn bộ hồ
   sơ vòng 3 (biên bản kill, UAT, park, trace-v2, CONTEXT.md, uat-script,
   research v2) nằm TRÊN NHÁNH CHƯA MERGE `jolly-turing` — main floorplanstudio
   không có dấu vết nào (B kiểm 10/08). Đúng lớp sổ-quyết-định-trên-nhánh-chết
   08/08. Kill code ≠ kill sử liệu: hồ sơ phải về main dù cờ tắt.
2. **Bảng 4 tầng nói giọng chắc chắn trên mẫu nhỏ** (n=1–4/ô, lệch giữa các
   ván). Kết luận "không tầng nào thay được" đúng hướng nhưng prune-vĩnh-viễn
   theo bảng này là quá tay → prune phải ĐẢO ĐƯỢC (declared-off, không xoá)
   và chỉ sau khi lấy-mẫu đủ n.
3. **"Mắt người rẻ" mâu thuẫn ràng-buộc-số-1 (gate-fatigue):** 6 can-thiệp là
   nhiều GIỜ owner ngồi cạnh — giá-trị-trên-phút cao nhưng phút là tài nguyên
   hiếm nhất hệ. Vai Mắt cần NGÂN SÁCH: đặt vào khoảnh khắc thiết kế sẵn
   (S1-D, design-pass, UAT); hệ phải an toàn khi ngân sách mắt = tối thiểu
   — vì đồng đội GĐ3 sẽ không ngồi sâu như owner đã ngồi.
4. **"Văn hoá tự lan" là kết luận vượt mẫu:** mọi phiên A "tự có văn hoá" đều
   được B nhúng luật vào đề bài. Đồng đội GĐ3 chạy phiên KHÔNG có B → cơ chế
   + docs gánh trước, văn hoá đội hình thành sau. ⇒ KHÔNG prune trước/tại
   rollout; prune sau khi có mẫu từ phiên-không-B.
5. **"GĐ4 gộp vào scoping 2.1" tự mâu thuẫn charter:** GĐ4 cần dữ liệu ĐỘI;
   gộp bây giờ là prune bằng dữ liệu một-người. → tách lại: 2.1 (toàn món
   cộng/sửa, không prune) đi trước; GĐ4 sau khi đội dùng thật.
6. **Baseline 3 số bị đánh tráo khái niệm:** "người-lật-máy ≈ 4" thực ra là
   4 ca mắt-bắt-giữa-dòng (metric MỚI); gold-set lấy-mẫu-hồ-sơ-đã-ký theo
   charter CHƯA CHẠY LẦN NÀO (0 mẫu). Và "sự-kiện-cần-người 4–5/ván" thiếu
   trung thực cho người mới: đường A thật = 4 cổng + ~3 lượt grill + ~6 phản
   ứng mắt — đội phải được báo con số ĐẦY ĐỦ kẻo vỡ mộng.
7. **①–⑦ của 2.1 thiếu gói phục-vụ-đội** dù GĐ3 được đề xuất cùng lúc: hai
   món docs rẻ đã xếp hàng từ lâu (init dặn "chép xong re-pin"; hướng dẫn
   update clone-pull-first) chính là thứ đồng đội vấp NGÀY ĐẦU.

## 9 · ĐỀ XUẤT v2 (thay mục 6) — đã vá 7 lỗ

**NGAY (trước mọi thứ, ~30'):** Ⓐ **Khép sử liệu vòng 3 về main floorplanstudio**
— merge/cherry-pick phần hồ sơ (`_acceptance/**`, CONTEXT.md, docs research)
lên main; code editor ở lại nhánh có con trỏ trong hồ sơ park (cờ tắt, không
ship). Đây là món chặn-lớp, không chờ 2.1.

**GĐ3 — thông báo #2** (sau Ⓐ): thông điệp mặt-người + **số kỳ vọng ĐẦY ĐỦ
theo đường** (C: 2–3 cổng; A: 4 cổng + grill là nội-dung + mắt theo ngân sách)
+ 2 docs onboarding (init-repin, update-clone-pull) phát cùng lượt.

**2.1 — mở theo thứ tự sửa lại:** ⓪ gói-đội (2 docs trên, nếu chưa đi cùng
GĐ3) · ① stale-theo-diff-PR · ② khối VIỆC-CỦA-ANH vào khuôn máy · ③ một-lượt-
gõ + `--repo` · ④ un-skip S1-D + câu-C2-sớm + tên thang vật liệu · ⑤ chiều-
đỏ-đã-chạy + quy-ước-đo vào khuôn · ⑥ runner exit + suite in số-ca · ⑦ card
Cổng 0/UAT. KHÔNG món prune nào trong 2.1.

**GĐ4 — TÁCH RIÊNG, điều kiện mới:** chỉ mở sau khi (a) đội dùng thật ≥2
feature phiên-không-B, (b) gold-set lấy-mẫu chạy ≥10 hồ sơ qua `/start`
(metric chuẩn charter, hiện 0 mẫu). Prune khi đó ĐẢO ĐƯỢC từng nấc.

**Trace-v2:** ngủ đông có địa chỉ (không đổi).
