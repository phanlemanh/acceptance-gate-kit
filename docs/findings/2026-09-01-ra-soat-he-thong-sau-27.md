# Rà soát hệ thống sau bộ quyết định 2.7 — vật cũ nằm đâu, mối nối nào lỏng

> Owner yêu cầu cuối phiên 01/09: nhìn các mối quan hệ bằng tư duy hệ thống,
> kiểm điểm mù — *«những vật được tạo trước đây trình bày như diagram, proto
> hiện nằm ở đâu, có bỏ qua luôn không; tránh giải quyết việc này thì lỗi việc
> khác»*. Mọi kết luận dưới đây có lệnh kiểm chạy thật trong phiên, không đoán.

## Trục 1 — luật vừa đổi có làm đỏ răng cũ không: SẠCH

- Grep toàn `tests/ scripts/ lib/ hooks/ feature-loop/ skills/ commands/` tìm
  neo vào luật CẮT KIT vừa bỏ: **0 file**. Bảy file test nhắc `CLAUDE.md` đều
  là **bình luận trích luật**, không phải phép đo đọc nội dung file — đổi luật
  không đổi màu suite nào.
- Cổng tiền-gộp chạy lại sau 17 commit trong ngày: **exit 0**, 0 vi phạm.
- Một mẩu lịch sử nay cụt một nửa: entry revisit `6005` của hồ sơ 2.6.0 neo
  vào «khi owner mở phiên quyết cắt kit» — sự kiện đã bị bỏ. Vế thứ hai của nó
  («mốc thứ ba lặp lại giới hạn đếm-tay») còn sống, nên hook chưa chết hẳn.
  Sổ append-only, không sửa; ghi nhận ở đây là đủ.

## Trục 2 — kiểm kê vật-trình-bày: KHÔNG có mồ côi thật

Quét toàn repo (trừ vendor/tests-fixture): **74 file HTML**, chia sáu họ, và
quét-chéo từng tên file vào mọi `.md`:

| Họ vật | Ở đâu | Tình trạng con trỏ |
|---|---|---|
| Hình tầng 2 của hồ sơ (h1/h2 của 8 hồ sơ) | `_acceptance/<slug>/figures/` | ✓ trỏ từ contract/index của chính hồ sơ |
| Bộ 10 hình kiến trúc | `docs/reference/figures/` | ✓ ĐÃ CẮM vào GUIDE (3 chỗ, kèm index.md) — memory «treo» đã lỗi thời một nửa, xem nợ N6 |
| Hình workflow-v2 + lái-thử (đời 04/08) | `docs/diagrams/` | ✓ trỏ từ handoff/findings — đọc như tài liệu LỊCH SỬ (không colophon commit; quy ước colophon chỉ có từ 16/08) |
| Hình hạt giống + v27 | `docs/plans/assets/` | ✓ (v27 vừa sửa: con trỏ glob → tên đầy đủ, vì phép kiểm mồ-côi quét theo tên) |
| Thẻ/evidence page của hồ sơ | `_acceptance/<slug>/*.html` | vật bằng chứng, sống chết theo hồ sơ — đúng thiết kế |
| **MỘT proto thật** | `_acceptance/con-mat-thu-hai-lai-thu/prototype/` (765 dòng, từ 23/08) | ✓ trỏ từ hạt giống vlm-assert; README tự khai «chưa qua cổng nào, là vật liệu cho Cổng Đáng» |

Kết luận trục 2: nếp «một dòng trỏ» đang được giữ thật — không vật nào bị vứt
im lặng. Cái giữ nó là NẾP chứ không phải lưới, và đúng luật một-tầng-thước
thì KHÔNG đề xuất thước mới; phép quét hôm nay tốn 1 lệnh, làm lại được bất kỳ
lúc nào.

## Trục 3 — điểm mù hệ thống: sáu chỗ, hai chỗ đáng tiền nhất là hàng đợi

**N1 · 14 ô đang chờ Cổng Đáng — đây mới là kho «vật bị bỏ qua».** Trong đó có
proto 765 dòng ở trên, ô `hinh-o-moi-cong-dung-cho-nguoi`, ô `o-nuot-luat`…
`/start` liệt kê được chúng, nhưng thẻ hành động cho ô chờ đã TRẢ VỀ Ô hôm
01/09 (giới hạn đã khai của 2.6.0: gõ tên ô chờ → nhận câu chỉ sai bước kế).
Hàng đợi không có nhịp nổi lên: không ai bị nhắc rằng nó dài 14. Việc mở ô nào
là loại-5 (ưu tiên của owner); việc TRÌNH hàng đợi kèm khuyến nghị xếp hạng là
việc máy — chưa ai làm.

**N2 · 27 hồ sơ cửa veto đang mở, chưa ai đóng** (pre-merge in danh sách này
mỗi lần chạy — thành tiếng ồn). Đây là mặt B của chữ-ký-suông: lưới an toàn
không có nhịp chú ý thì cũng là sân khấu. Nghiêm trọng vì **2.7 tăng tải đúng
lên cửa này** (làn V rộng hơn + veto-default giữa vòng). Đề xuất nếp, không
cổng mới: **mốc phát hành là điểm đóng cửa veto** — thẻ ký mốc liệt các hồ sơ
veto-mở của cửa sổ, một chạm xác nhận đóng cả loạt; hồ sơ nào owner muốn lật
thì gọi tên ngay đó.

**N3 · Cổng Bằng chứng sẽ phình.** Veto-default dồn quyết-định-giữa-vòng về
khối «CHƯA duyệt» của thẻ Cổng 2; không có trần kích thước; «Treo: phê hết»
trên gói 15 mục là đóng-dấu kiểu mới. Yêu cầu thiết kế cho vòng
`loi-moi-cong-may-sinh`: **luật định tuyến áp cả vào khối provisional** — mục
loại-1/2 trong đó là dòng báo, chỉ mục loại-5 mới cần phê đích danh.

**N4 · Đối kháng chết thì chữ ký nói gì?** `probe-failed` hiện là cờ vàng
không chặn. Dưới ngữ nghĩa 2.7 (chữ ký xác nhận «đối kháng đã hội tụ»), mời ký
khi probe-failed là chữ ký nói dối. Yêu cầu thiết kế: **luật rơi bậc** —
probe-failed ⇒ mọi mục loại-3 rơi về loại-5, người tự đọc vật và điều đó khai
thẳng trên thẻ. Trung thực hơn, đắt hơn, đúng.

**N5 · Lượt và thời gian có thể đánh đổi nhau.** «Chỉ mời khi ký-được-ngay»
chuyển chi phí từ số-lượt sang thời-gian-chờ (máy vá xong mới mời). Ba dòng số
đo CẢ hai — nhưng người đọc mốc phải nhớ đọc cả cột thời gian, đừng tuyên
thắng chỉ bằng cột lượt.

**N6 · GUIDE còn 5 khối mermaid, ≥1 khối tự khai lỗi thời từ 16/08** («vẽ Cổng
2 luôn ký — làn V đã đổi; khối mermaid chờ một PR chữ riêng»). Nợ có tên, có
ghi chú che chắn người đọc, treo hai tuần — đáng một PR docs nhỏ sau khi 2.6.0
gộp, không đáng một vòng.

## Lớp lỗi xuyên suốt mà cả ba trục cùng chỉ về

«Giải việc này lỗi việc khác» trong repo này có một hình dạng lặp:
**gỡ/đổi một vật mà quên các vật đang TRỎ tới nó** — thu phạm vi gỡ làn thẻ
nhưng quên câu thân lệnh (P0-1 sáng nay) · bỏ án cắt kit để lại revisit-hook
cụt · con trỏ glob làm phép kiểm mồ-côi báo giả. Cái giữ hệ khỏi rách là ba
thứ đã có: một-dòng-trỏ · đối kháng context sạch · phép quét chéo rẻ chạy lại
được. Không cái nào cần thêm máy móc — cần nhịp chạy chúng tại mỗi mốc.

## Đã làm ngay trong phiên rà soát

Sửa con trỏ glob → tên đầy đủ (cùng commit) · xác nhận suite/tiền-gộp xanh sau
đổi luật · ghi sáu điểm mù kèm nơi xử lý: N3+N4 vào thiết kế vòng
`loi-moi-cong-may-sinh` · N2+N5 thành nếp mốc phát hành · N1 chờ owner xếp
hạng (máy sẽ trình danh sách 14 ô kèm khuyến nghị khi owner mở phiên) · N6
một PR docs nhỏ sau merge.
