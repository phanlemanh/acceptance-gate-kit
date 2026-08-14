# Tổng hợp các kỳ retro — bản đồ một chỗ, luật sống nơi khác

*Soạn 15/08 từ việc ĐỌC TRỌN 13 kỳ retro/tổng kết (26/07 → 15/08) cộng retro
phiên hôm nay. File này là BẢN ĐỒ: mỗi kỳ một đoạn, bảy sợi chỉ xuyên suốt,
bảng bài-học-sống-ở-đâu, và danh sách còn-treo đã khử trùng lặp. Nó KHÔNG
chép lại luật — luật sống ở engine/ADR/CLAUDE.md, file này chỉ trỏ. Số nào
từng bị đính chính thì ghi số ĐÃ đính chính.*

## 1 · Dòng thời gian 14 kỳ, mỗi kỳ một đoạn

- **26/07 — feature-loop không tự loop.** 7/14 lần dừng của một phiên là
  agent tự chèn. Đặt tên lớp **không-gian-âm** (skill nói dừng ở đâu nhưng
  không nói «đừng dừng chỗ khác»). Vá 1.17.1; baseline 7/7 để so sau.
- **08/08 — ván thật #1 (mcp-cost-guard).** Feature đầu tiên trọn vòng ở
  repo tiêu thụ. Lớp lỗi chung: **vật-chép-sang-consumer chưa từng được đo ở
  phía consumer**. Ba viên ngọc đứng vững lần đầu: Cổng 1 chặn trước code ·
  lưới bằng chứng bắt cả bản vá của chính nó · luật dừng thi hành đúng.
- **09/08 — bản chất thật của vòng lặp kit** (nền của mọi thứ sau). Ba gốc
  rễ: đích ngầm «chắc chắn tự thân» không tồn tại (đệ quy là CẤU TRÚC) ·
  cơ chế đúc theo kẻ địch đã đổi mà chưa đo tỉ lệ hỏng thật · chi phí không
  khấu hao. Lõi bất khả nhượng ba món: **chữ ký người · không-bịa-bằng-chứng
  · đường-đảo-rẻ**.
- **09/08 — reflect thử nghiệm lần 1.** 20 dòng sổ vấp quy về 4 lớp; bài
  học phương pháp: **đề bài đi theo LỚP, đừng theo dòng**.
- **10/08 — rà soát luật theo North Star.** Không luật nào sai ở tầng Ý
  ĐỊNH; mọi xung đột nằm ở tầng THI HÀNH. Cổng kit bắt 0/4 lỗi chặn-phát-
  hành trong khi chân độc lập bắt 4/4 → ba khoảng trống, trong đó
  **chiều-đỏ-phải-CHẠY-trước-khi-khai** về sau thành luật.
- **10/08 — reflect trước vòng 3.** 6 lớp lỗi mới có tên (số-chép-lại-
  không-đo-lại · hằng-đúng · ba-lớp-che-xanh…). Phát hiện phương pháp: lối
  thoát khỏi tháp là **ĐI VÒNG** (acceptance-direct), không phải chặt đầu
  rắn.
- **10/08 — retro vòng 3 (digitize-floorplan, KILL).** Cổng Giá trị bắt
  được thứ mọi cổng khác bỏ lọt: 39 test · 15 eval xanh mà «dùng được cho
  khách: KHÔNG». 4 ca **mắt-người-bắt-máy-trượt**; 5/7 lỗi của máy cùng họ
  «tự nghĩ ra hình dạng thay vì đọc thứ có sẵn».
- **10/08 — đối chiếu Workflow v2.** Máy đo ĐÚNG-HÌNH, chỉ Cổng Giá trị đo
  ĐỦ-DÙNG. Ván 3 bỏ thiết kế thật và 3/4 lý do kill là lỗi thiết kế → «khi
  LÀM rẻ đi trăm lần, giá trị dồn về KHAI».
- **10/08 — reflect lớn khép GĐ2.** Bảng 4 tầng đo, không tầng nào thay
  tầng nào; người tham gia bằng BA vai (Ý ĐỊNH · MẮT · TRÁCH NHIỆM), chỉ
  vai trách nhiệm cần rút về một-lượt-gõ. Có mục tự-rà bác chính mình —
  «văn hoá tự lan» là kết luận vượt mẫu.
- **11/08 — báo cáo tái lập (ĐÃ BỊ THAY THẾ).** Sai 5 chỗ đếm được; giữ
  lại đúng một điều: quá tải chuyển từ TỪNG-CỔNG sang **TẦN-SUẤT-GỌI**.
  Đọc số của đợt tái lập thì đọc bản 12/08, đừng đọc bản này.
- **12/08 — tổng kết lớn tái lập (31 lượt khai quật độc lập).** 5 chip ship
  7 142 dòng đổi lấy **80 dòng mã thi hành được (1,1%)**; 3/5 chip răng chỉ
  canh CHỮ. Kết luận mạnh nhất, về sau thành la bàn: **không lớp lỗi nào
  lặp lại sau khi được cấp LƯỚI — còn nếp thì lặp**. 53 lượt gọi người/4
  ngày, 70% không phải quyết-giá-trị. Tìm ra **đường rửa chữ ký** — xem
  mục 5.
- **14/08 — retro tuần đo lường.** Học phí hội tụ 5 vòng → 8 vòng → 1 vòng
  qua ba hồ sơ. Hai bài đắt: **phủ-định-phổ-quát trên văn tự nhiên grep
  không chứng được** (phải lật sang liệt cái ĐƯỢC PHÉP — nay là luật
  `MEASURE-BIRTH-SECTIONS`); và «41 lượt phá» là **số bịa** (thật 37) sống
  qua bốn tầng chấm — con số tự khai trong văn xuôi không có răng.
- **15/08 — tổng kết đợt 2 (veto-có-dấu-vết).** Ba đợt đầu bản neo xong.
  Bảy lần máy bị bắt xếp theo AI-bắt; hai lớp mới: **lời-khai-không-khớp-
  vật-ở-lượt-sửa** và **hai-guard-khoá-nhau khi kit tự mở rộng**. M1 thật
  chưa đo — chờ đợt 3.
- **15/08 — retro phiên 14–15/08.** Hai hồ sơ ký một phiên; năm vấp cấp
  phiên (cây bị giật giữa chừng · máy-tự-dừng-cuối-tầng ~6 lượt · lưới
  tần-suất bắt người xếp nấc · danh tính hai dạng · docs cần đi PR).

## 2 · Bảy sợi chỉ xuyên suốt (≥3 kỳ nhắc)

1. **Máy đo ĐÚNG-HÌNH ≠ ĐỦ-DÙNG; chỉ Cổng Giá trị bắt được khoảng cách đó**
   — 5 kỳ nhắc, và cổng ấy tới nay vẫn 0 lần chạy (xem mục 5).
2. **Mắt-người-giữa-dòng là tầng đo chính danh** — 6 kỳ nhắc; 4 ca bắt lỗi
   mà mọi cổng máy trượt; vẫn chưa có khuôn/kênh có tên.
3. **Tần suất gọi người là ràng buộc số 1** — từ gate-fatigue (07/08) thành
   call-frequency-fatigue (11/08) thành luật toàn cục (12/08) thành cơ chế
   V (15/08). Sợi chỉ duy nhất đã đi trọn đường: cảm nhận → tên lớp → luật
   → cơ chế có lưới.
4. **Số tự khai / số chép lại không có răng** — 4 kỳ nhắc, và chính một bản
   báo cáo retro (11/08) là nạn nhân lớn nhất. Thuốc từng phần: đo-tại-
   commit-ghi, lệnh-tái-lập-ngay-cạnh-số; chưa thành lưới.
5. **Vật-chép-sang-consumer phải đo ở phía consumer** — 3 kỳ; đã có lưới
   (1.39.1 + consumer-sim round-trip) và là lớp hiếm hoi ĐÃ ĐÓNG; nhưng
   12/08 tìm thấy bản chép hoá thạch lệch 30 dòng — đóng ở kit không tự
   đóng ở mọi consumer.
6. **LƯỚI đóng lớp, NẾP thì lặp** — la bàn từ 12/08, được đợt 2 xác nhận
   hai lần trong một ngày (ADR 0011 cứu hồ sơ veto; bản-đồ-sau-chữ-ký là
   nếp nên lặp ×2). Hệ luận thi hành: mọi bài học muốn sống phải chỉ được
   chỗ đặt lưới, không thì nó là ghi chú.
7. **Máy tự nghĩ ra thay vì đọc thứ có sẵn** — họ lỗi 5/7 của vòng 3, tái
   xuất ở needle-gõ-theo-trí-nhớ (1c), số bịa (tuần đo lường), lời khai
   sai (đợt 2). Thuốc đã thành nếp ở phiên chấm: kiểm chứng lời khai bằng
   phép đo + đếm-vệ-sinh; chưa thành luật engine.

## 3 · Bài học đã promote — nay sống ở đâu (trỏ, không chép)

| Lớp bài học | Nay sống ở |
|---|---|
| Không tự chèn điểm dừng trong loop | feature-loop «bất biến dừng» (1.17.1, thu hẹp ở đợt 2) |
| Khoá 6 thao tác cổng người | ADR 0002 + test P32 |
| Vật chép sang consumer | lớp `.cjs` + chép trọn `lib/` (1.39.1) + đo round-trip |
| Staleness theo diff PR | 1.39.2 (chip ①) |
| Thôi đo phút người | hồ sơ 1a (cat-hinh-thuc) |
| Khối 👉 chỉ ở tin mời cổng + thẻ; T1/scan/init bớt hỏi | hồ sơ 1c |
| Chữ ký lui về đánh-đổi/khó-đảo; veto có dấu vết | hồ sơ veto-co-dau-vet (đợt 2) |
| Phủ-định-phổ-quát → lật allow-list; bánh cóc bảng lớp | `MEASURE-BIRTH-SECTIONS` + P177 (bai-hoc-do-luong-vao-engine) |
| Răng-hồ-sơ là lớp rẻ; dài hạn vào lưới thường trực từ đầu | ADR 0011 |
| Chiều đỏ phải CHẠY trước khi khai | khuôn khai sinh phép đo (measure-birth-certificate) |
| Kim chỉ nam + ba nguyên tố + nhịp mặc định | CLAUDE.md (repo + toàn cục) |

## 4 · Cách đọc khi các kỳ nói ngược nhau

- Bản **11/08 bị 12/08 thay thế** — mọi số của đợt tái lập đọc ở 12/08.
- «Văn hoá tự lan» (reflect lớn 10/08) **đã bị chính nó và 12/08 bác** —
  kết luận đứng là: chỉ lưới mới đóng lớp.
- Dự báo bi quan về UAT (reflect trước vòng 3) **không xảy ra** — retro
  vòng 3 xác nhận nghi thức chạy trơn; đọc kỳ sau, không đọc dự báo.
- «41 lượt phá» ở mọi văn bản cũ là **số bịa** — số đúng 37 (đính chính
  94d4ba7ff… 14/08); trí nhớ dài hạn đã sửa theo.

## 5 · Còn treo — khử trùng lặp toàn bộ 14 kỳ, xếp theo giá

1. **Cổng Giá trị: 0 lần chạy trên 41 việc đã giao.** Mục treo DAI NHẤT —
   xuất hiện từ 08/08 và lặp ở 6 kỳ. Sợi chỉ số 1 nói đây là tầng đo duy
   nhất bắt được ĐỦ-DÙNG. Đợt 3 là chỗ trả nợ.
2. **Đường rửa chữ ký còn nguyên** (`pre-merge-check.sh:854` — truy commit
   chữ ký bằng `git log -S … | head -1`, tức commit MỚI NHẤT chạm chuỗi,
   không phải commit ĐƯA chữ ký vào). Kỳ 12/08 gọi là lỗ nghiêm trọng nhất
   vì nằm trên lõi «chữ ký người»; kiểm lại 15/08: chưa hồ sơ nào vá. Chạm
   `scripts/pre-merge-check.sh` = hạng T3, cần hồ sơ riêng.
3. **Mắt-người-giữa-dòng chưa có khuôn** — 6 lần xảy ra trong một ván, 0
   lần có tên; câu hỏi trung tâm từ 10/08, chưa ai mô hình hoá.
4. **Số-tự-khai chưa có lưới** — nếp «kèm lệnh tái lập cạnh số» mới là văn;
   sợi chỉ 4 nói lớp này sẽ lặp cho tới khi có răng.
5. **Máy-tự-dừng-cuối-tầng cấp phiên** — baseline 26/07 là 7 lượt/phiên,
   phiên 14–15/08 vẫn ~6 lượt «tiếp đi»; loop đã có bất biến, PHIÊN chưa có
   chốt.
6. **M1 chưa đo trên vòng T2 thật** — cơ chế V lắp xong nhưng số phải chờ
   đợt 3; kèm hành vi máy-đi-trước mới chấm trên đề ca, chưa chạy thật.
7. Hàng đợi reflect 10/08 còn 2/4 mục: **chi phí pivot** · (mục «văn hoá tự
   lan» đã đóng bằng kết luận ngược ở 12/08).
8. Ba hạt giống chờ Cổng 0: bản-đồ-dính-chữ-ký · T1 tuyên-kèm-căn-cứ (điều
   kiện mở lại đã viết) · hỏi-theo-mặt-phẳng (đợt 2 xong, đủ điều kiện xếp
   lịch) · liệt-kê-máy-đọc (13/08).
